const { normalizeRole } = require("../utils/formatters");
const httpError = require("../utils/httpError");

function stripDiacritics(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function toDatabaseRole(role = "") {
  const normalized = stripDiacritics(normalizeRole(role)).toLowerCase();

  if (normalized === "admin" || normalized.includes("quan tri")) return "admin";
  if (normalized === "teacher" || normalized.includes("giang vien")) return "teacher";
  return "student";
}

function toDatabaseStatus(status = "") {
  const normalized = stripDiacritics(status).toLowerCase();
  return normalized === "locked" || normalized.includes("tam khoa") ? "locked" : "active";
}

function toDisplayStatus(status = "") {
  return status === "locked" ? "Tạm khóa" : "Hoạt động";
}

function formatTeacherNumber(value) {
  return String(value).padStart(3, "0");
}

function normalizeUsernameForRole(username, role) {
  return role === "teacher" ? String(username).toUpperCase() : String(username);
}

function assertUsernameMatchesRole(username, role) {
  if (role === "student" && !/^\d{8}$/.test(username)) {
    throw httpError(400, "ID sinh viên phải gồm đúng 8 chữ số");
  }

  if (role === "teacher" && !/^GV\d{3}$/.test(username)) {
    throw httpError(400, "ID giảng viên phải có dạng GV***, trong đó *** là 3 chữ số");
  }
}

function inferAdmissionYear(studentCode = "") {
  const prefix = String(studentCode).slice(0, 2);
  const year = Number(prefix);
  return Number.isInteger(year) && year > 0 ? 2000 + year : null;
}

module.exports = {
  assertUsernameMatchesRole,
  formatTeacherNumber,
  inferAdmissionYear,
  normalizeUsernameForRole,
  toDatabaseRole,
  toDatabaseStatus,
  toDisplayStatus
};
