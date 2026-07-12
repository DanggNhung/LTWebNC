const db = require("../config/database");

async function findFaculty(value) {
  if (!value) return null;

  const isNumericId = Number.isInteger(Number(value));
  const sql = isNumericId
    ? "SELECT * FROM faculties WHERE id = ? OR faculty_code = ? OR faculty_name = ? LIMIT 1"
    : "SELECT * FROM faculties WHERE faculty_code = ? OR faculty_name = ? LIMIT 1";
  const params = isNumericId ? [value, value, value] : [value, value];
  const [rows] = await db.query(sql, params);
  return rows[0] || null;
}

async function findMajor(value, facultyId) {
  if (!value) return null;

  const isNumericId = Number.isInteger(Number(value));
  const params = isNumericId ? [value, value, value] : [value, value];
  let sql = isNumericId
    ? "SELECT * FROM majors WHERE (id = ? OR major_code = ? OR major_name = ?)"
    : "SELECT * FROM majors WHERE (major_code = ? OR major_name = ?)";

  if (facultyId) {
    sql += " AND faculty_id = ?";
    params.push(facultyId);
  }

  sql += " LIMIT 1";
  const [rows] = await db.query(sql, params);
  return rows[0] || null;
}

async function findClass(value) {
  if (!value) return null;

  const isNumericId = Number.isInteger(Number(value));
  const sql = isNumericId
    ? "SELECT * FROM classes WHERE id = ? OR class_code = ? OR class_name = ? LIMIT 1"
    : "SELECT * FROM classes WHERE class_code = ? OR class_name = ? LIMIT 1";
  const params = isNumericId ? [value, value, value] : [value, value];
  const [rows] = await db.query(sql, params);
  return rows[0] || null;
}

async function findLecturer(value, facultyId) {
  if (!value) return null;

  const isNumericId = Number.isInteger(Number(value));
  const params = isNumericId ? [value, value, value] : [value, value];
  let sql = isNumericId
    ? "SELECT * FROM lecturers WHERE (id = ? OR lecturer_code = ? OR fullname = ?)"
    : "SELECT * FROM lecturers WHERE (lecturer_code = ? OR fullname = ?)";

  if (facultyId) {
    sql += " AND faculty_id = ?";
    params.push(facultyId);
  }

  sql += " LIMIT 1";
  const [rows] = await db.query(sql, params);
  return rows[0] || null;
}

module.exports = {
  findClass,
  findFaculty,
  findLecturer,
  findMajor
};
