const db = require("../config/database");

async function findAll() {
  const [rows] = await db.query(`
    SELECT
      classes.id,
      classes.class_code,
      classes.class_name,
      classes.major,
      classes.course,
      COUNT(students.id) AS students
    FROM classes
    LEFT JOIN students ON students.class_id = classes.id
    GROUP BY classes.id
    ORDER BY classes.class_code ASC
  `);

  return rows;
}

async function create(payload) {
  const [result] = await db.query("INSERT INTO classes SET ?", payload);
  return result.insertId;
}

async function update(id, payload) {
  const [result] = await db.query("UPDATE classes SET ? WHERE id = ?", [payload, id]);
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await db.query("DELETE FROM classes WHERE id = ?", [id]);
  return result.affectedRows;
}

module.exports = {
  create,
  findAll,
  remove,
  update
};
