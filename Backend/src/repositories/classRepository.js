const db = require("../config/database");
const { buildInsert, buildUpdate } = require("../utils/sql");

async function findAll() {
  const [rows] = await db.query(`
    SELECT
      classes.id,
      classes.class_code,
      classes.class_name,
      classes.course,
      classes.faculty_id,
      classes.major_id,
      faculties.faculty_name,
      majors.major_name,
      COUNT(students.id) AS students
    FROM classes
    INNER JOIN faculties ON classes.faculty_id = faculties.id
    INNER JOIN majors ON classes.major_id = majors.id
    LEFT JOIN students ON students.class_id = classes.id
    GROUP BY
      classes.id,
      classes.class_code,
      classes.class_name,
      classes.course,
      classes.faculty_id,
      classes.major_id,
      faculties.faculty_name,
      majors.major_name
    ORDER BY classes.class_code ASC
  `);

  return rows;
}

async function findByCode(classCode) {
  const [rows] = await db.query("SELECT * FROM classes WHERE class_code = ?", [classCode]);
  return rows[0] || null;
}

async function create(payload) {
  const query = buildInsert("classes", payload);
  const [result] = await db.query(query.sql, query.values);
  return result.insertId;
}

async function update(id, payload) {
  const query = buildUpdate("classes", payload, id);
  const [result] = await db.query(query.sql, query.values);
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await db.query("DELETE FROM classes WHERE id = ?", [id]);
  return result.affectedRows;
}

module.exports = {
  create,
  findAll,
  findByCode,
  remove,
  update
};
