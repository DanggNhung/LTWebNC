const classRepository = require("../repositories/classRepository");
const lookupRepository = require("../repositories/lookupRepository");
const httpError = require("../utils/httpError");

function toClassDto(row) {
  return {
    id: row.class_code || String(row.id),
    databaseId: row.id,
    name: row.class_name || row.class_code || "Chưa cập nhật",
    major: row.major_name || "Chưa cập nhật",
    faculty: row.faculty_name || "Chưa cập nhật",
    students: Number(row.students || 0)
  };
}

async function buildClassPayload(body) {
  const classCode = String(body.classCode || body.class_code || body.id || "").trim();
  const className = String(body.className || body.class_name || body.name || "").trim();
  const facultyValue = body.facultyId || body.faculty_id || body.faculty;
  const majorValue = body.majorId || body.major_id || body.major;

  if (!classCode) {
    throw httpError(400, "Thiếu mã lớp");
  }

  if (!className) {
    throw httpError(400, "Thiếu tên lớp");
  }

  const faculty = await lookupRepository.findFaculty(facultyValue);
  if (!faculty) {
    throw httpError(400, "Khoa không tồn tại");
  }

  const major = await lookupRepository.findMajor(majorValue, faculty.id);
  if (!major) {
    throw httpError(400, "Ngành không tồn tại hoặc không thuộc khoa đã chọn");
  }

  return {
    class_code: classCode,
    class_name: className,
    faculty_id: faculty.id,
    major_id: major.id,
    major: major.major_name,
    course: body.course || null
  };
}

async function listClasses() {
  const rows = await classRepository.findAll();
  return rows.map(toClassDto);
}

async function createClass(body) {
  const payload = await buildClassPayload(body);
  const existingClass = await classRepository.findByCode(payload.class_code);

  if (existingClass) {
    throw httpError(409, "Mã lớp đã tồn tại");
  }

  const id = await classRepository.create(payload);
  return { id };
}

async function updateClass(id, body) {
  const payload = await buildClassPayload(body);
  const affectedRows = await classRepository.update(id, payload);

  if (!affectedRows) {
    throw httpError(404, "Không tìm thấy lớp học");
  }

  return { id: Number(id) };
}

async function deleteClass(id) {
  const affectedRows = await classRepository.remove(id);

  if (!affectedRows) {
    throw httpError(404, "Không tìm thấy lớp học");
  }

  return { id: Number(id), deleted: true };
}

module.exports = {
  createClass,
  deleteClass,
  listClasses,
  updateClass
};
