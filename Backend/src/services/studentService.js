const studentRepository = require("../repositories/studentRepository");
const accountRepository = require("../repositories/accountRepository");
const lookupRepository = require("../repositories/lookupRepository");
const { avatarColor, formatDate, getGivenNameInitial } = require("../utils/formatters");
const httpError = require("../utils/httpError");
const { buildInsert } = require("../utils/sql");

function toStudentStatus(status = "") {
  return status === "reserved" || status === "Bảo lưu" ? "Bảo lưu" : "Đang học";
}

function toDatabaseStatus(status = "") {
  return status === "reserved" || status === "Bảo lưu" ? "reserved" : "studying";
}

function inferAdmissionYear(studentCode = "") {
  const prefix = String(studentCode).slice(0, 2);
  const year = Number(prefix);
  return Number.isInteger(year) && year > 0 ? 2000 + year : null;
}

function toStudentDto(row, index = 0) {
  const studentId = row.student_code || String(row.id).padStart(8, "0");

  return {
    id: row.id,
    databaseId: row.id,
    name: row.fullname || "Chưa cập nhật",
    email: row.email || `${studentId}@sinhvien-uni.edu.vn`,
    studentId,
    birthDate: formatDate(row.birthday),
    gender: row.gender || "Chưa cập nhật",
    className: row.class_code || "Chưa phân lớp",
    status: toStudentStatus(row.status),
    faculty: row.faculty_name || "",
    major: row.major_name || "",
    avatar: avatarColor(index),
    initial: getGivenNameInitial(row.fullname)
  };
}

async function buildStudentPayload(body, existingStudentCode) {
  const studentCode = String(body.studentId || body.student_code || existingStudentCode || "").trim();
  const fullname = String(body.name || body.fullname || `${body.lastName || ""} ${body.firstName || ""}`).trim();

  if (!studentCode) {
    throw httpError(400, "Thiếu mã sinh viên");
  }

  if (!fullname) {
    throw httpError(400, "Thiếu họ tên sinh viên");
  }

  const classValue = body.classId || body.class_id || body.classCode || body.className;
  const classRow = classValue ? await lookupRepository.findClass(classValue) : null;

  if (classValue && !classRow) {
    throw httpError(400, "Lớp học không tồn tại");
  }

  return {
    student_code: studentCode,
    fullname,
    email: body.email || `${studentCode}@sinhvien-uni.edu.vn`,
    birthday: body.birthDate || body.birthday || null,
    gender: body.gender || null,
    class_id: classRow?.id || null,
    admission_year: body.admissionYear || body.admission_year || inferAdmissionYear(studentCode),
    status: toDatabaseStatus(body.status)
  };
}

async function listStudents() {
  const rows = await studentRepository.findAll();
  return rows.map(toStudentDto);
}

async function createStudent(body) {
  const payload = await buildStudentPayload(body);
  const existingStudent = await studentRepository.findByStudentCode(payload.student_code);

  if (existingStudent) {
    throw httpError(409, "Mã sinh viên đã tồn tại");
  }

  const id = await accountRepository.transaction(async (connection) => {
    const [existingUsers] = await connection.query("SELECT * FROM users WHERE username = ? LIMIT 1", [
      payload.student_code
    ]);
    let userId = existingUsers[0]?.id;

    if (!userId) {
      const userQuery = buildInsert("users", {
        username: payload.student_code,
        password: "",
        fullname: payload.fullname,
        role: "student",
        status: "active"
      });
      const [userResult] = await connection.query(userQuery.sql, userQuery.values);
      userId = userResult.insertId;
    }

    const studentQuery = buildInsert("students", {
      ...payload,
      user_id: userId
    });
    const [studentResult] = await connection.query(studentQuery.sql, studentQuery.values);
    return studentResult.insertId;
  });

  return { id };
}

async function updateStudent(id, body) {
  const payload = await buildStudentPayload(body, body.studentId || body.student_code);
  const affectedRows = await studentRepository.update(id, payload);

  if (!affectedRows) {
    throw httpError(404, "Không tìm thấy sinh viên");
  }

  return { id: Number(id) };
}

async function deleteStudent(id) {
  const affectedRows = await studentRepository.remove(id);

  if (!affectedRows) {
    throw httpError(404, "Không tìm thấy sinh viên");
  }

  return { id: Number(id), deleted: true };
}

module.exports = {
  createStudent,
  deleteStudent,
  listStudents,
  updateStudent
};
