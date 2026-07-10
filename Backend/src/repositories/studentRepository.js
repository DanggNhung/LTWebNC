const db = require("../config/database");

async function findAll() {
  const [rows] = await db.query(`
    SELECT
      students.id,
      students.student_code,
      students.fullname,
      students.email,
      classes.class_code,
      classes.class_name,
      classes.major
    FROM students
    LEFT JOIN classes ON students.class_id = classes.id
    ORDER BY students.id DESC
  `);

  return rows;
}

async function create(payload) {
  const [result] = await db.query("INSERT INTO students SET ?", payload);
  return result.insertId;
}

async function update(id, payload) {
  const [result] = await db.query("UPDATE students SET ? WHERE id = ?", [payload, id]);
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await db.query("DELETE FROM students WHERE id = ?", [id]);
  return result.affectedRows;
}

module.exports = {
  create,
  findAll,
  remove,
  update
};
