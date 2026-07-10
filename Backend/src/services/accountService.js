const bcrypt = require("bcrypt");
const accountRepository = require("../repositories/accountRepository");
const { avatarColor, getGivenNameInitial, normalizeRole } = require("../utils/formatters");
const httpError = require("../utils/httpError");

function formatTeacherNumber(value) {
  return String(value).padStart(3, "0");
}

function toAccountDto(row, index) {
  const role = normalizeRole(row.role);
  const teacherNumber = formatTeacherNumber(row.id);
  const studentCode = row.username || String(row.id).padStart(8, "0");

  const idByRole = {
    "Quản trị viên": "Admin",
    "Giảng viên": `GV${teacherNumber}`,
    "Sinh viên": studentCode
  };

  const emailByRole = {
    "Quản trị viên": "",
    "Giảng viên": `gv${teacherNumber}@giangvien-uni.edu.vn`,
    "Sinh viên": `${studentCode}@sinhvien-uni.edu.vn`
  };

  return {
    id: idByRole[role],
    databaseId: row.id,
    initials: getGivenNameInitial(row.fullname || row.username),
    name: row.fullname || row.username || "Chưa cập nhật",
    email: emailByRole[role],
    role,
    status: "Hoạt động",
    lastLogin: "Chưa cập nhật",
    avatar: avatarColor(index)
  };
}

async function listAccounts() {
  const rows = await accountRepository.findAll();
  return rows.map(toAccountDto);
}

async function authenticate(username, password) {
  const user = await accountRepository.findByUsername(username);

  if (!user) {
    throw httpError(401, "Sai tài khoản hoặc mật khẩu");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw httpError(401, "Sai tài khoản hoặc mật khẩu");
  }

  return {
    id: user.id,
    username: user.username,
    name: user.fullname,
    role: normalizeRole(user.role)
  };
}

module.exports = {
  authenticate,
  listAccounts
};
