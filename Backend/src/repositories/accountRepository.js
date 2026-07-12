const db = require("../config/database");
const { buildInsert, buildUpdate } = require("../utils/sql");

let passwordPlainColumnExists;

async function hasPasswordPlainColumn() {
  if (passwordPlainColumnExists !== undefined) {
    return passwordPlainColumnExists;
  }

  const [rows] = await db.query(
    `SELECT COUNT(*) AS count
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'users'
       AND COLUMN_NAME = 'password_plain'`
  );
  passwordPlainColumnExists = Number(rows[0]?.count || 0) > 0;
  return passwordPlainColumnExists;
}

async function findAll() {
  const passwordPlainSelect = (await hasPasswordPlainColumn())
    ? "users.password_plain,"
    : "NULL AS password_plain,";

  const [rows] = await db.query(`
    SELECT
      users.id,
      users.username,
      users.fullname,
      users.role,
      users.status,
      users.password <> '' AS has_password,
      ${passwordPlainSelect}
      users.created_at,
      lecturers.lecturer_code,
      lecturers.faculty_id AS lecturer_faculty_id,
      faculties.faculty_name AS lecturer_faculty_name,
      students.student_code
    FROM users
    LEFT JOIN lecturers ON lecturers.user_id = users.id
    LEFT JOIN faculties ON lecturers.faculty_id = faculties.id
    LEFT JOIN students ON students.user_id = users.id
    ORDER BY
      FIELD(users.role, 'admin', 'teacher', 'student'),
      users.id ASC
  `);

  return rows;
}

async function findByUsername(username) {
  const passwordPlainSelect = (await hasPasswordPlainColumn()) ? "password_plain" : "NULL AS password_plain";
  const [rows] = await db.query(`SELECT id, username, password, ${passwordPlainSelect}, fullname, role, status, created_at, updated_at FROM users WHERE username = ?`, [username]);
  return rows[0] || null;
}

async function findById(id) {
  const passwordPlainSelect = (await hasPasswordPlainColumn()) ? "password_plain" : "NULL AS password_plain";
  const [rows] = await db.query(`SELECT id, username, password, ${passwordPlainSelect}, fullname, role, status, created_at, updated_at FROM users WHERE id = ?`, [id]);
  return rows[0] || null;
}

async function create(payload) {
  const query = buildInsert("users", payload);
  const [result] = await db.query(query.sql, query.values);
  return result.insertId;
}

async function update(id, payload) {
  const query = buildUpdate("users", payload, id);
  const [result] = await db.query(query.sql, query.values);
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
  return result.affectedRows;
}

async function transaction(callback) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  create,
  findAll,
  findById,
  findByUsername,
  hasPasswordPlainColumn,
  remove,
  transaction,
  update
};
