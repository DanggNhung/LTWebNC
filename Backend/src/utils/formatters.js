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

function formatDate(value) {
  if (!value) {
    return "Chưa cập nhật";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

module.exports = {
  avatarColor,
  formatDate,
  getGivenNameInitial,
  inferFaculty,
  normalizeRole
};
