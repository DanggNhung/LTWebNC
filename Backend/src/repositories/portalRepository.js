const db = require("../config/database");

async function findStudentByUserId(userId) {
  const [rows] = await db.query(
    `SELECT
       students.*,
       classes.class_code,
       classes.class_name,
       classes.faculty_id,
       classes.major_id,
       faculties.faculty_name,
       majors.major_name
     FROM students
     LEFT JOIN classes ON students.class_id = classes.id
     LEFT JOIN faculties ON classes.faculty_id = faculties.id
     LEFT JOIN majors ON classes.major_id = majors.id
     WHERE students.user_id = ?
     LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

async function updateStudentProfile(studentId, payload) {
  const [result] = await db.query(
    `UPDATE students
     SET birthday = ?, gender = ?
     WHERE id = ?`,
    [payload.birthday || null, payload.gender || null, studentId]
  );
  return result.affectedRows;
}

async function findLecturerByUserId(userId) {
  const [rows] = await db.query("SELECT * FROM lecturers WHERE user_id = ? LIMIT 1", [userId]);
  return rows[0] || null;
}

async function findAvailableSubjectsForStudent(studentId, facultyId) {
  if (!facultyId) return [];

  const [rows] = await db.query(
    `SELECT
       subjects.id,
       subjects.subject_code,
       subjects.subject_name,
       subjects.credits,
       faculties.faculty_name,
       lecturers.fullname AS lecturer_name,
       COALESCE(knowledge_blocks.block_name, subjects.knowledge_block) AS knowledge_block
     FROM subjects
     INNER JOIN faculties ON subjects.faculty_id = faculties.id
     LEFT JOIN lecturers ON subjects.lecturer_id = lecturers.id
     LEFT JOIN knowledge_blocks ON subjects.knowledge_block_id = knowledge_blocks.id
     LEFT JOIN enrollments
       ON enrollments.subject_id = subjects.id
      AND enrollments.student_id = ?
      AND enrollments.status <> 'cancelled'
     WHERE subjects.faculty_id = ?
       AND subjects.status = 'active'
       AND enrollments.id IS NULL
     ORDER BY subjects.subject_code ASC`,
    [studentId, facultyId]
  );
  return rows;
}

async function createEnrollments(studentId, subjectIds) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    for (const subjectId of subjectIds) {
      await connection.query(
        `INSERT INTO enrollments (student_id, subject_id, registration_date, status)
         VALUES (?, ?, CURRENT_DATE(), 'registered')
         ON DUPLICATE KEY UPDATE status = 'registered', updated_at = CURRENT_TIMESTAMP`,
        [studentId, subjectId]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function findEnrollmentCancellationState(studentId, enrollmentId) {
  const [rows] = await db.query(
    `SELECT
       enrollments.id,
       scores.attendance_score,
       scores.midterm_score,
       scores.final_score
     FROM enrollments
     LEFT JOIN scores ON scores.enrollment_id = enrollments.id
     WHERE enrollments.id = ?
       AND enrollments.student_id = ?
       AND enrollments.status <> 'cancelled'
     LIMIT 1`,
    [enrollmentId, studentId]
  );
  return rows[0] || null;
}

async function cancelEnrollment(enrollmentId) {
  const [result] = await db.query(
    `UPDATE enrollments
     SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [enrollmentId]
  );
  return result.affectedRows;
}

async function findStudentEnrollments(studentId) {
  const [rows] = await db.query(
    `SELECT
       enrollments.id AS enrollment_id,
       enrollments.semester,
       enrollments.academic_year,
       enrollments.status AS enrollment_status,
       subjects.id AS subject_id,
       subjects.subject_code,
       subjects.subject_name,
       subjects.credits,
       scores.attendance_score,
       scores.midterm_score,
       scores.final_score,
       scores.score_10,
       scores.score_4,
       scores.letter_grade,
       scores.result_status
     FROM enrollments
     INNER JOIN subjects ON enrollments.subject_id = subjects.id
     LEFT JOIN scores ON scores.enrollment_id = enrollments.id
     WHERE enrollments.student_id = ?
       AND enrollments.status <> 'cancelled'
     ORDER BY enrollments.created_at DESC, subjects.subject_code ASC`,
    [studentId]
  );
  return rows;
}

async function findTeacherSubjects(lecturerId) {
  const [rows] = await db.query(
    `SELECT
       subjects.id,
       subjects.subject_code,
       subjects.subject_name,
       subjects.credits,
       faculties.faculty_name,
       COALESCE(knowledge_blocks.block_name, subjects.knowledge_block) AS knowledge_block,
       COUNT(enrollments.id) AS students
     FROM subjects
     INNER JOIN faculties ON subjects.faculty_id = faculties.id
     LEFT JOIN knowledge_blocks ON subjects.knowledge_block_id = knowledge_blocks.id
     LEFT JOIN enrollments ON enrollments.subject_id = subjects.id AND enrollments.status <> 'cancelled'
     WHERE subjects.lecturer_id = ?
     GROUP BY subjects.id, subjects.subject_code, subjects.subject_name, subjects.credits, faculties.faculty_name, knowledge_blocks.block_name, subjects.knowledge_block
     ORDER BY subjects.subject_code ASC`,
    [lecturerId]
  );
  return rows;
}

async function findTeacherScoreRows(lecturerId, subjectId) {
  const params = [lecturerId];
  let subjectFilter = "";

  if (subjectId) {
    subjectFilter = "AND subjects.id = ?";
    params.push(subjectId);
  }

  const [rows] = await db.query(
    `SELECT
       enrollments.id AS enrollment_id,
       students.student_code,
       students.fullname,
       subjects.id AS subject_id,
       subjects.subject_code,
       subjects.subject_name,
       scores.attendance_score,
       scores.midterm_score,
       scores.final_score,
       scores.score_10,
       scores.score_4,
       scores.letter_grade,
       scores.result_status
     FROM enrollments
     INNER JOIN students ON enrollments.student_id = students.id
     INNER JOIN subjects ON enrollments.subject_id = subjects.id
     LEFT JOIN scores ON scores.enrollment_id = enrollments.id
     WHERE subjects.lecturer_id = ?
       AND enrollments.status <> 'cancelled'
       ${subjectFilter}
     ORDER BY students.fullname ASC`,
    params
  );
  return rows;
}

async function findTeacherEnrollment(lecturerId, enrollmentId) {
  const [rows] = await db.query(
    `SELECT enrollments.*
     FROM enrollments
     INNER JOIN subjects ON enrollments.subject_id = subjects.id
     WHERE enrollments.id = ?
       AND subjects.lecturer_id = ?
     LIMIT 1`,
    [enrollmentId, lecturerId]
  );
  return rows[0] || null;
}

async function upsertScore(enrollmentId, payload) {
  const [existingRows] = await db.query("SELECT id FROM scores WHERE enrollment_id = ? LIMIT 1", [enrollmentId]);

  if (existingRows[0]) {
    await db.query(
      `UPDATE scores
       SET attendance_score = ?,
           midterm_score = ?,
           final_score = ?,
           score_10 = ?,
           score_4 = ?,
           letter_grade = ?,
           result_status = ?
       WHERE enrollment_id = ?`,
      [
        payload.attendance_score,
        payload.midterm_score,
        payload.final_score,
        payload.score_10,
        payload.score_4,
        payload.letter_grade,
        payload.result_status,
        enrollmentId
      ]
    );
    return;
  }

  await db.query(
    `INSERT INTO scores
       (enrollment_id, attendance_score, midterm_score, final_score, score_10, score_4, letter_grade, result_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      enrollmentId,
      payload.attendance_score,
      payload.midterm_score,
      payload.final_score,
      payload.score_10,
      payload.score_4,
      payload.letter_grade,
      payload.result_status
    ]
  );
}

module.exports = {
  cancelEnrollment,
  createEnrollments,
  findEnrollmentCancellationState,
  findAvailableSubjectsForStudent,
  findLecturerByUserId,
  findStudentByUserId,
  updateStudentProfile,
  findStudentEnrollments,
  findTeacherEnrollment,
  findTeacherScoreRows,
  findTeacherSubjects,
  upsertScore
};
