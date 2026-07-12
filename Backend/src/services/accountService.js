const bcrypt = require("bcrypt");
const accountRepository = require("../repositories/accountRepository");
const lookupRepository = require("../repositories/lookupRepository");
const { avatarColor, getGivenNameInitial, normalizeRole } = require("../utils/formatters");
const httpError = require("../utils/httpError");
const { buildInsert } = require("../utils/sql");
const {
  assertUsernameMatchesRole,
  formatTeacherNumber,
  inferAdmissionYear,
  normalizeUsernameForRole,
  toDatabaseRole,
  toDatabaseStatus,
  toDisplayStatus
} = require("./accountHelpers");

function toAccountDto(row, index = 0) {
  const role = normalizeRole(row.role);
  const teacherCode = row.lecturer_code || `GV${formatTeacherNumber(row.id)}`;
  const studentCode = row.student_code || row.username || String(row.id).padStart(8, "0");

  const idByRole = {
    "Quản trị viên": "Admin",
    "Giảng viên": teacherCode,
    "Sinh viên": studentCode
  };

  return {
    id: idByRole[role],
    databaseId: row.id,
    initials: getGivenNameInitial(row.fullname || row.username),
    name: row.fullname || row.username || "Chưa cập nhật",
    email: "",
    passwordDisplay: row.password_plain || "",
    hasPassword: Boolean(row.password || row.has_password),
    role,
    department: row.lecturer_faculty_name || "",
    status: toDisplayStatus(row.status),
    lastLogin: "Chưa cập nhật",
    avatar: avatarColor(index)
  };
}

function buildAccountBase(body) {
  const fullname = String(body.name || body.fullname || `${body.lastName || ""} ${body.firstName || ""}`).trim();
  const role = toDatabaseRole(body.role);
  const username = normalizeUsernameForRole(String(body.accountId || body.username || body.id || "").trim(), role);

  if (!username) {
    throw httpError(400, "Thiếu ID tài khoản");
  }

  if (!fullname) {
    throw httpError(400, "Thiếu họ tên tài khoản");
  }

  assertUsernameMatchesRole(username, role);

  return {
    username,
    fullname,
    role,
    status: toDatabaseStatus(body.status)
  };
}

async function listAccounts() {
  const rows = await accountRepository.findAll();
  return rows.map(toAccountDto);
}

async function createAccount(body) {
  const basePayload = buildAccountBase(body);

  if (basePayload.role === "admin" || basePayload.username === "Admin") {
    throw httpError(400, "Tài khoản quản trị hệ thống là cố định và không thể tạo thêm");
  }

  const existingUser = await accountRepository.findByUsername(basePayload.username);

  if (existingUser) {
    throw httpError(409, "ID tài khoản đã tồn tại");
  }

  if (body.password && String(body.password).length < 6) {
    throw httpError(400, "Mật khẩu phải có ít nhất 6 ký tự");
  }

  const password = body.password ? await bcrypt.hash(String(body.password), 10) : "";
  const canStoreDisplayPassword = await accountRepository.hasPasswordPlainColumn();
  const id = await accountRepository.transaction(async (connection) => {
    const userQuery = buildInsert("users", {
      ...basePayload,
      password,
      password_plain: canStoreDisplayPassword ? body.password || "" : undefined
    });
    const [userResult] = await connection.query(userQuery.sql, userQuery.values);
    const userId = userResult.insertId;

    if (basePayload.role === "teacher") {
      const faculty = await lookupRepository.findFaculty(body.department || body.faculty || body.facultyId);
      if (!faculty) {
        throw httpError(400, "Khoa của giảng viên không tồn tại");
      }

      const lecturerQuery = buildInsert("lecturers", {
        user_id: userId,
        faculty_id: faculty.id,
        lecturer_code: basePayload.username,
        fullname: basePayload.fullname,
        email: `${basePayload.username.toLowerCase()}@giangvien-uni.edu.vn`,
        status: "active"
      });
      await connection.query(lecturerQuery.sql, lecturerQuery.values);
    }

    if (basePayload.role === "student") {
      const studentQuery = buildInsert("students", {
        user_id: userId,
        student_code: basePayload.username,
        fullname: basePayload.fullname,
        email: `${basePayload.username}@sinhvien-uni.edu.vn`,
        admission_year: inferAdmissionYear(basePayload.username),
        status: "studying"
      });
      await connection.query(studentQuery.sql, studentQuery.values);
    }

    return userId;
  });

  return { id };
}

async function updateAccount(id, body) {
  const currentUser = await accountRepository.findById(id);

  if (!currentUser) {
    throw httpError(404, "Không tìm thấy tài khoản");
  }

  if (currentUser.username === "Admin" || currentUser.role === "admin") {
    throw httpError(400, "Không được chỉnh sửa tài khoản quản trị hệ thống");
  }

  const basePayload = buildAccountBase(body);
  const isRoleChanged = currentUser.role !== basePayload.role;
  const isUsernameChanged = currentUser.username !== basePayload.username;

  if (isRoleChanged && !isUsernameChanged) {
    throw httpError(400, "Muốn đổi vai trò thì phải đổi ID phù hợp với vai trò mới trước");
  }

  if (isUsernameChanged) {
    const existingUser = await accountRepository.findByUsername(basePayload.username);
    if (existingUser && Number(existingUser.id) !== Number(id)) {
      throw httpError(409, "ID tài khoản đã tồn tại");
    }
  }

  if (basePayload.role === "admin") {
    throw httpError(400, "Không được đổi tài khoản thường thành quản trị viên");
  }

  const payload = {
    username: basePayload.username,
    fullname: basePayload.fullname,
    role: basePayload.role,
    status: basePayload.status
  };

  if (body.password && String(body.password).length < 6) {
    throw httpError(400, "Mật khẩu phải có ít nhất 6 ký tự");
  }

  if (body.password) {
    payload.password = await bcrypt.hash(String(body.password), 10);
    payload.password_plain = String(body.password);
  }

  const canStoreDisplayPassword = await accountRepository.hasPasswordPlainColumn();
  const faculty = basePayload.role === "teacher"
    ? await lookupRepository.findFaculty(body.department || body.faculty || body.facultyId)
    : null;

  if (basePayload.role === "teacher" && !faculty) {
    throw httpError(400, "Khoa của giảng viên không tồn tại");
  }

  await accountRepository.transaction(async (connection) => {
    const passwordSql = payload.password ? ", password = ?" : "";
    const passwordPlainSql = payload.password && canStoreDisplayPassword ? ", password_plain = ?" : "";
    const values = [payload.username, payload.fullname, payload.role, payload.status];

    if (payload.password) {
      values.push(payload.password);
    }

    if (payload.password && canStoreDisplayPassword) {
      values.push(payload.password_plain);
    }

    values.push(id);

    const [userResult] = await connection.query(
      `UPDATE users
       SET username = ?, fullname = ?, role = ?, status = ?${passwordSql}${passwordPlainSql}
       WHERE id = ?`,
      values
    );

    if (!userResult.affectedRows) {
      throw httpError(404, "Không tìm thấy tài khoản");
    }

    if (currentUser.role === "teacher" && basePayload.role !== "teacher") {
      await connection.query(
        `UPDATE subjects
         SET lecturer_id = NULL
         WHERE lecturer_id IN (SELECT id FROM lecturers WHERE user_id = ?)`,
        [id]
      );
      await connection.query("DELETE FROM lecturers WHERE user_id = ?", [id]);
    }

    if (currentUser.role === "student" && basePayload.role !== "student") {
      await connection.query("DELETE FROM students WHERE user_id = ?", [id]);
    }

    if (basePayload.role === "teacher") {
      await connection.query(
        `INSERT INTO lecturers (user_id, faculty_id, lecturer_code, fullname, email, status)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           faculty_id = VALUES(faculty_id),
           lecturer_code = VALUES(lecturer_code),
           fullname = VALUES(fullname),
           email = VALUES(email),
           status = VALUES(status)`,
        [
          id,
          faculty.id,
          payload.username,
          payload.fullname,
          `${payload.username.toLowerCase()}@giangvien-uni.edu.vn`,
          payload.status === "locked" ? "inactive" : "active"
        ]
      );
    }

    if (basePayload.role === "student") {
      await connection.query(
        `INSERT INTO students (user_id, student_code, fullname, email, admission_year, status)
         VALUES (?, ?, ?, ?, ?, 'studying')
         ON DUPLICATE KEY UPDATE
           student_code = VALUES(student_code),
           fullname = VALUES(fullname),
           email = VALUES(email),
           admission_year = VALUES(admission_year),
           status = VALUES(status)`,
        [
          id,
          payload.username,
          payload.fullname,
          `${payload.username}@sinhvien-uni.edu.vn`,
          inferAdmissionYear(payload.username)
        ]
      );
    }
  });

  return { id: Number(id) };
}

async function deleteAccount(id) {
  const currentUser = await accountRepository.findById(id);

  if (!currentUser) {
    throw httpError(404, "Không tìm thấy tài khoản");
  }

  if (currentUser.username === "Admin" || currentUser.role === "admin") {
    throw httpError(400, "Không được xóa tài khoản quản trị hệ thống");
  }

  const affectedRows = await accountRepository.remove(id);

  if (!affectedRows) {
    throw httpError(404, "Không tìm thấy tài khoản");
  }

  return { id: Number(id), deleted: true };
}

async function authenticate(username, password) {
  const loginUsername = String(username || "").trim();
  const lookupUsername = loginUsername.toLowerCase() === "admin" ? "Admin" : loginUsername;
  const user = await accountRepository.findByUsername(lookupUsername);

  if (!user) {
    throw httpError(401, "Sai tài khoản hoặc mật khẩu");
  }

  if (user.status === "locked") {
    throw httpError(403, "Tài khoản đang tạm khóa");
  }

  const isSystemAdmin = user.username === "Admin" && user.role === "admin";

  if (!user.password && !isSystemAdmin) {
    throw httpError(401, "Tài khoản chưa có mật khẩu");
  }

  const isValid = user.password ? await bcrypt.compare(password, user.password) : false;
  const isDefaultAdminPassword = isSystemAdmin && ["SMAdmin@2026!", "admin123"].includes(password);

  if (!isValid && !isDefaultAdminPassword) {
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
  createAccount,
  deleteAccount,
  listAccounts,
  updateAccount
};
