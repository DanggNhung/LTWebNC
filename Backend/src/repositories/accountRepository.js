const db = require("../config/database");

async function findAll() {
  const [rows] = await db.query(`
    SELECT
      id,
      username,
      fullname,
      role,
      created_at
    FROM users
    ORDER BY id ASC
  `);

  return rows;
}

async function findByUsername(username) {
  const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
  return rows[0] || null;
}

async function create(payload) {
  const [result] = await db.query("INSERT INTO users SET ?", payload);
  return result.insertId;
}

async function update(id, payload) {
  const [result] = await db.query("UPDATE users SET ? WHERE id = ?", [payload, id]);
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
  return result.affectedRows;
}

module.exports = {
  create,
  findAll,
  findByUsername,
  remove,
  update
};
