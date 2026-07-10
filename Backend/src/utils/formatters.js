function getGivenNameInitial(fullName = "") {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return parts.at(-1)?.charAt(0).toUpperCase() || "U";
}

function inferFaculty(major = "") {
  const normalized = major.toLowerCase();

  if (normalized.includes("du lịch") || normalized.includes("khách sạn")) {
    return "Du lịch";
  }

  if (normalized.includes("kinh") || normalized.includes("quản trị")) {
    return "Kinh tế và kinh doanh";
  }

  if (normalized.includes("công nghệ") || normalized.includes("khoa học máy tính")) {
    return "Công nghệ thông tin";
  }

  return "Chưa cập nhật";
}

function normalizeRole(role = "") {
  const normalized = role.toLowerCase();

  if (normalized === "admin" || normalized === "quản trị viên") {
    return "Quản trị viên";
  }

  if (normalized === "teacher" || normalized === "giảng viên") {
    return "Giảng viên";
  }

  return "Sinh viên";
}

function avatarColor(index) {
  const colors = ["indigo", "cyan", "purple", "rose", "teal"];
  return colors[index % colors.length];
}

module.exports = {
  avatarColor,
  getGivenNameInitial,
  inferFaculty,
  normalizeRole
};
