const subjectRepository = require("../repositories/subjectRepository");
const lookupRepository = require("../repositories/lookupRepository");
const httpError = require("../utils/httpError");

const KNOWLEDGE_BLOCKS = new Set(["Giáo dục đại cương", "Cơ sở ngành", "Chuyên ngành", "Bổ trợ"]);

function toSubjectDto(row) {
  return {
    id: row.id,
    databaseId: row.id,
    code: row.subject_code || String(row.id),
    name: row.subject_name || "Chưa cập nhật",
    credits: Number(row.credits || 0),
    faculty: row.faculty_name || "Chưa cập nhật",
    instructor: row.lecturer_name || "Chưa phân công",
    students: Number(row.enrolled_count || 0),
    knowledgeBlock: row.knowledge_block_name || row.knowledge_block || row.description || "Chuyên ngành",
    status: row.status === "inactive" ? "Tạm dừng" : "Hoạt động"
  };
}

async function buildSubjectPayload(body) {
  const subjectCode = String(body.subjectCode || body.subject_code || body.code || "").trim();
  const subjectName = String(body.subjectName || body.subject_name || body.name || "").trim();
  const credits = Number(body.credits);
  const facultyValue = body.facultyId || body.faculty_id || body.faculty;
  const lecturerValue = body.lecturerId || body.lecturer_id || body.instructor;
  const knowledgeBlock = body.knowledgeBlock || body.knowledge_block || "Chuyên ngành";

  if (!subjectCode) {
    throw httpError(400, "Thiếu mã môn");
  }

  if (!subjectName) {
    throw httpError(400, "Thiếu tên môn học");
  }

  if (!Number.isInteger(credits) || credits < 1 || credits > 3) {
    throw httpError(400, "Số tín chỉ phải là số tự nhiên từ 1 đến 3");
  }

  if (!KNOWLEDGE_BLOCKS.has(knowledgeBlock)) {
    throw httpError(400, "Khối kiến thức không hợp lệ");
  }

  const faculty = await lookupRepository.findFaculty(facultyValue);
  if (!faculty) {
    throw httpError(400, "Khoa không tồn tại");
  }

  const lecturer = lecturerValue ? await lookupRepository.findLecturer(lecturerValue, faculty.id) : null;
  if (!lecturerValue) {
    throw httpError(400, "Vui lòng chọn giảng viên hướng dẫn");
  }

  if (!lecturer) {
    throw httpError(400, "Giảng viên hướng dẫn không tồn tại hoặc không thuộc khoa đã chọn");
  }

  const knowledgeBlockRow = await lookupRepository.findKnowledgeBlock(knowledgeBlock);

  return {
    subject_code: subjectCode,
    subject_name: subjectName,
    credits,
    faculty_id: faculty.id,
    lecturer_id: lecturer.id,
    knowledge_block_id: knowledgeBlockRow?.id || null,
    knowledge_block: knowledgeBlock,
    description: body.description || knowledgeBlock,
    status: "active"
  };
}

async function listSubjects() {
  const rows = await subjectRepository.findAll();
  return rows.map(toSubjectDto);
}

async function createSubject(body) {
  const payload = await buildSubjectPayload(body);
  const existingSubject = await subjectRepository.findByCode(payload.subject_code);

  if (existingSubject) {
    throw httpError(409, "Mã môn đã tồn tại");
  }

  const id = await subjectRepository.create(payload);
  return { id };
}

async function updateSubject(id, body) {
  const payload = await buildSubjectPayload(body);
  const affectedRows = await subjectRepository.update(id, payload);

  if (!affectedRows) {
    throw httpError(404, "Không tìm thấy môn học");
  }

  return { id: Number(id) };
}

async function deleteSubject(id) {
  const affectedRows = await subjectRepository.remove(id);

  if (!affectedRows) {
    throw httpError(404, "Không tìm thấy môn học");
  }

  return { id: Number(id), deleted: true };
}

module.exports = {
  createSubject,
  deleteSubject,
  listSubjects,
  updateSubject
};
