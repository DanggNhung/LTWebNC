const db = require("../config/database");
const { buildInsert, buildUpdate } = require("../utils/sql");

async function findAll() {
  const [rows] = await db.query(`
    SELECT
      students.id,
      students.student_code,
      students.fullname,
      students.email,
      students.birthday,
      students.gender,
      students.status,
      students.admission_year,
      classes.id AS class_id,
      classes.class_code,
      classes.class_name,
      majors.major_name,
      faculties.faculty_name
    FROM students
    LEFT JOIN classes ON students.class_id = classes.id
    LEFT JOIN majors ON classes.major_id = majors.id
    LEFT JOIN faculties ON classes.faculty_id = faculties.id
    ORDER BY students.id DESC
  `);

  return rows;
}

async function findByStudentCode(studentCode) {
  const [rows] = await db.query("SELECT * FROM students WHERE student_code = ?", [studentCode]);
  return rows[0] || null;
}

async function create(payload) {
  const query = buildInsert("students", payload);
  const [result] = await db.query(query.sql, query.values);
  return result.insertId;
}

async function update(id, payload) {
  const query = buildUpdate("students", payload, id);
  const [result] = await db.query(query.sql, query.values);
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await db.query("DELETE FROM students WHERE id = ?", [id]);
  return result.affectedRows;
}

module.exports = {
  create,
  findAll,
  findByStudentCode,
  remove,
  update
};
