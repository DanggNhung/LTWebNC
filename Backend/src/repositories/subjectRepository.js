const db = require("../config/database");

async function findAll() {
  const [rows] = await db.query(`
    SELECT
      id,
      subject_code,
      subject_name,
      credits,
      description
    FROM subjects
    ORDER BY subject_code ASC
  `);

  return rows;
}

async function create(payload) {
  const [result] = await db.query("INSERT INTO subjects SET ?", payload);
  return result.insertId;
}

async function update(id, payload) {
  const [result] = await db.query("UPDATE subjects SET ? WHERE id = ?", [payload, id]);
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await db.query("DELETE FROM subjects WHERE id = ?", [id]);
  return result.affectedRows;
}

module.exports = {
  create,
  findAll,
  remove,
  update
};
