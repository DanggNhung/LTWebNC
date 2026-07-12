const db = require("../config/database");
const { buildInsert, buildUpdate } = require("../utils/sql");

async function findAll() {
  const [rows] = await db.query(`
    SELECT
      subjects.id,
      subjects.subject_code,
      subjects.subject_name,
      subjects.credits,
      subjects.knowledge_block,
      subjects.description,
      subjects.faculty_id,
      subjects.lecturer_id,
      faculties.faculty_name,
      lecturers.fullname AS lecturer_name
    FROM subjects
    INNER JOIN faculties ON subjects.faculty_id = faculties.id
    LEFT JOIN lecturers ON subjects.lecturer_id = lecturers.id
    ORDER BY subjects.subject_code ASC
  `);

  return rows;
}

async function findByCode(subjectCode) {
  const [rows] = await db.query("SELECT * FROM subjects WHERE subject_code = ?", [subjectCode]);
  return rows[0] || null;
}

async function create(payload) {
  const query = buildInsert("subjects", payload);
  const [result] = await db.query(query.sql, query.values);
  return result.insertId;
}

async function update(id, payload) {
  const query = buildUpdate("subjects", payload, id);
  const [result] = await db.query(query.sql, query.values);
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await db.query("DELETE FROM subjects WHERE id = ?", [id]);
  return result.affectedRows;
}

module.exports = {
  create,
  findAll,
  findByCode,
  remove,
  update
};
