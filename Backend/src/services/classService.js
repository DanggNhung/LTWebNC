const classRepository = require("../repositories/classRepository");
const { inferFaculty } = require("../utils/formatters");

function toClassDto(row) {
  const major = row.major || "Chưa cập nhật";

  return {
    id: row.class_code || String(row.id),
    databaseId: row.id,
    name: row.class_name || row.class_code || "Chưa cập nhật",
    major,
    faculty: inferFaculty(major),
    instructor: "Chưa phân công",
    students: Number(row.students || 0)
  };
}

async function listClasses() {
  const rows = await classRepository.findAll();
  return rows.map(toClassDto);
}

module.exports = {
  listClasses
};
