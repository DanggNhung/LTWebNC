const subjectRepository = require("../repositories/subjectRepository");

function toSubjectDto(row) {
  return {
    id: row.id,
    code: row.subject_code || String(row.id),
    name: row.subject_name || "Chưa cập nhật",
    credits: Number(row.credits || 0),
    faculty: "Chưa cập nhật",
    major: "Chưa cập nhật",
    knowledgeBlock: row.description || "Chuyên ngành"
  };
}

async function listSubjects() {
  const rows = await subjectRepository.findAll();
  return rows.map(toSubjectDto);
}

module.exports = {
  listSubjects
};
