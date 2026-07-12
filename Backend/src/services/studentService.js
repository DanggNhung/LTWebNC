const studentRepository = require("../repositories/studentRepository");
const { avatarColor, formatDate, getGivenNameInitial } = require("../utils/formatters");

function toStudentDto(row, index) {
  const studentId = row.student_code || String(row.id).padStart(8, "0");

  return {
    id: row.id,
    name: row.fullname || "Chưa cập nhật",
    email: row.email || `${studentId}@sinhvien-uni.edu.vn`,
    studentId,
    birthDate: formatDate(row.birthday),
    gender: row.gender || "Chưa cập nhật",
    className: row.class_code || row.class_name || "Chưa phân lớp",
    status: "Đang học",
    avatar: avatarColor(index),
    initial: getGivenNameInitial(row.fullname)
  };
}

async function listStudents() {
  const rows = await studentRepository.findAll();
  return rows.map(toStudentDto);
}

module.exports = {
  listStudents
};
