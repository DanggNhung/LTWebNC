const portalRepository = require("../repositories/portalRepository");
const httpError = require("../utils/httpError");

function roundOne(value) {
  return Math.round(Number(value) * 10) / 10;
}

function toGpa(score10) {
  if (score10 >= 8.5) return { score4: 4.0, letter: "A" };
  if (score10 >= 8.0) return { score4: 3.5, letter: "B+" };
  if (score10 >= 7.0) return { score4: 3.0, letter: "B" };
  if (score10 >= 6.5) return { score4: 2.5, letter: "C+" };
  if (score10 >= 5.5) return { score4: 2.0, letter: "C" };
  if (score10 >= 5.0) return { score4: 1.5, letter: "D+" };
  if (score10 >= 4.0) return { score4: 1.0, letter: "D" };
  return { score4: 0.0, letter: "F" };
}

function assertScore(value, label) {
  const score = Number(value);
  if (!Number.isFinite(score) || score < 0 || score > 10) {
    throw httpError(400, `${label} phải nằm trong khoảng 0-10`);
  }
  return roundOne(score);
}

function hasEnteredScore(value) {
  return value !== null && value !== undefined && value !== "";
}

function assertStudentCanRegister(student) {
  if (student.status === "reserved") {
    throw httpError(403, "Sinh viên đang bảo lưu nên không thể đăng ký môn học");
  }
}

function toScoreDto(row) {
  const hasAllScores =
    row.attendance_score !== null &&
    row.midterm_score !== null &&
    row.final_score !== null;

  return {
    enrollmentId: row.enrollment_id,
    id: row.student_code,
    name: row.fullname,
    subjectId: row.subject_id,
    subjectCode: row.subject_code,
    subjectName: row.subject_name,
    attendance: row.attendance_score === null ? "" : Number(row.attendance_score),
    midterm: row.midterm_score === null ? "" : Number(row.midterm_score),
    final: row.final_score === null ? "" : Number(row.final_score),
    score10: hasAllScores ? Number(row.score_10) : "",
    score4: hasAllScores ? Number(row.score_4) : "",
    letter: hasAllScores ? row.letter_grade : "",
    status: hasAllScores ? row.result_status : "Chưa đủ điểm"
  };
}

function toEnrollmentResultDto(row) {
  const hasAnyScore =
    hasEnteredScore(row.attendance_score) ||
    hasEnteredScore(row.midterm_score) ||
    hasEnteredScore(row.final_score);

  return {
    enrollmentId: row.enrollment_id,
    code: row.subject_code,
    subject: row.subject_name,
    credits: Number(row.credits || 0),
    score10: row.score_10 === null ? null : Number(row.score_10),
    score4: row.score_4 === null ? null : Number(row.score_4),
    letter: row.letter_grade || "",
    canCancel: !hasAnyScore,
    status: row.result_status || "Chưa đủ điểm"
  };
}

async function getStudentProfile(userId) {
  const student = await portalRepository.findStudentByUserId(userId);
  if (!student) {
    throw httpError(404, "Không tìm thấy hồ sơ sinh viên");
  }

  return {
    id: student.id,
    studentId: student.student_code,
    name: student.fullname,
    birthDate: student.birthday,
    gender: student.gender,
    className: student.class_name || student.class_code || "Chưa phân lớp",
    status: student.status === "reserved" ? "Bảo lưu" : "Đang học",
    major: student.major_name || "",
    faculty: student.faculty_name || ""
  };
}

function normalizeProfileBirthDate(value) {
  if (!value) return null;
  const text = String(value).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    throw httpError(400, "Ngày sinh không hợp lệ");
  }
  return text;
}

async function updateStudentProfile(userId, body) {
  const student = await portalRepository.findStudentByUserId(userId);
  if (!student) {
    throw httpError(404, "Không tìm thấy hồ sơ sinh viên");
  }

  const gender = body.gender ? String(body.gender).trim() : null;
  if (gender && !["Nam", "Nữ"].includes(gender)) {
    throw httpError(400, "Giới tính không hợp lệ");
  }

  await portalRepository.updateStudentProfile(student.id, {
    birthday: normalizeProfileBirthDate(body.birthDate || body.birthday),
    gender
  });

  return getStudentProfile(userId);
}

async function listAvailableSubjects(userId) {
  const student = await portalRepository.findStudentByUserId(userId);
  if (!student) {
    throw httpError(404, "Không tìm thấy hồ sơ sinh viên");
  }

  assertStudentCanRegister(student);

  const rows = await portalRepository.findAvailableSubjectsForStudent(student.id, student.faculty_id);
  return rows.map((row) => ({
    id: row.id,
    code: row.subject_code,
    name: row.subject_name,
    credits: Number(row.credits || 0),
    faculty: row.faculty_name,
    instructor: row.lecturer_name || "Chưa phân công",
    knowledgeBlock: row.knowledge_block
  }));
}

async function registerSubjects(userId, body) {
  const student = await portalRepository.findStudentByUserId(userId);
  if (!student) {
    throw httpError(404, "Không tìm thấy hồ sơ sinh viên");
  }

  assertStudentCanRegister(student);

  const subjectIds = Array.isArray(body.subjectIds) ? body.subjectIds.map(Number).filter(Boolean) : [];
  if (!subjectIds.length) {
    throw httpError(400, "Chưa chọn môn học để đăng ký");
  }

  await portalRepository.createEnrollments(student.id, subjectIds);
  return { registered: subjectIds.length };
}

async function cancelStudentEnrollment(userId, enrollmentId) {
  const student = await portalRepository.findStudentByUserId(userId);
  if (!student) {
    throw httpError(404, "Không tìm thấy hồ sơ sinh viên");
  }

  const enrollment = await portalRepository.findEnrollmentCancellationState(student.id, Number(enrollmentId));
  if (!enrollment) {
    throw httpError(404, "Không tìm thấy môn học đã đăng ký");
  }

  const hasAnyScore =
    hasEnteredScore(enrollment.attendance_score) ||
    hasEnteredScore(enrollment.midterm_score) ||
    hasEnteredScore(enrollment.final_score);

  if (hasAnyScore) {
    throw httpError(400, "Không thể hủy đăng ký vì giảng viên đã nhập điểm");
  }

  await portalRepository.cancelEnrollment(enrollment.id);
  return { id: enrollment.id, cancelled: true };
}

async function listStudentResults(userId) {
  const student = await portalRepository.findStudentByUserId(userId);
  if (!student) {
    throw httpError(404, "Không tìm thấy hồ sơ sinh viên");
  }

  const rows = await portalRepository.findStudentEnrollments(student.id);
  return rows.map(toEnrollmentResultDto);
}

async function listTeacherSubjects(userId) {
  const lecturer = await portalRepository.findLecturerByUserId(userId);
  if (!lecturer) {
    throw httpError(404, "Không tìm thấy hồ sơ giảng viên");
  }

  const rows = await portalRepository.findTeacherSubjects(lecturer.id);
  return rows.map((row) => ({
    id: row.id,
    code: row.subject_code,
    name: row.subject_name,
    credits: Number(row.credits || 0),
    faculty: row.faculty_name,
    knowledgeBlock: row.knowledge_block,
    students: Number(row.students || 0)
  }));
}

async function listTeacherScores(userId, subjectId) {
  const lecturer = await portalRepository.findLecturerByUserId(userId);
  if (!lecturer) {
    throw httpError(404, "Không tìm thấy hồ sơ giảng viên");
  }

  const rows = await portalRepository.findTeacherScoreRows(lecturer.id, subjectId ? Number(subjectId) : null);
  return rows.map(toScoreDto);
}

async function updateTeacherScore(userId, enrollmentId, body) {
  const lecturer = await portalRepository.findLecturerByUserId(userId);
  if (!lecturer) {
    throw httpError(404, "Không tìm thấy hồ sơ giảng viên");
  }

  const enrollment = await portalRepository.findTeacherEnrollment(lecturer.id, enrollmentId);
  if (!enrollment) {
    throw httpError(404, "Không tìm thấy sinh viên đăng ký môn thuộc giảng viên này");
  }

  const attendance = assertScore(body.attendance ?? body.attendance_score, "Điểm chuyên cần");
  const midterm = assertScore(body.midterm ?? body.midterm_score, "Điểm giữa kỳ");
  const final = assertScore(body.final ?? body.final_score, "Điểm cuối kỳ");
  const score10 = roundOne(attendance * 0.1 + midterm * 0.3 + final * 0.6);
  const { score4, letter } = toGpa(score10);

  await portalRepository.upsertScore(enrollmentId, {
    attendance_score: attendance,
    midterm_score: midterm,
    final_score: final,
    score_10: score10,
    score_4: score4,
    letter_grade: letter,
    result_status: score10 >= 4 ? "Đạt" : "Học lại"
  });

  return {
    enrollmentId: Number(enrollmentId),
    attendance,
    midterm,
    final,
    score10,
    score4,
    letter,
    status: score10 >= 4 ? "Đạt" : "Học lại"
  };
}

module.exports = {
  cancelStudentEnrollment,
  getStudentProfile,
  listAvailableSubjects,
  listStudentResults,
  listTeacherScores,
  listTeacherSubjects,
  registerSubjects,
  updateStudentProfile,
  updateTeacherScore
};
