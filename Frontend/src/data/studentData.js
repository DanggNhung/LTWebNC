export const studentProfile = {
  studentId: "22010207",
  name: "Trần Quốc Bảo",
  program: "Công nghệ thông tin",
  avatar: "B"
};

const subjectPool = [
  { code: "IT101", subject: "Nhập môn công nghệ thông tin", credits: 3 },
  { code: "IT204", subject: "Cấu trúc dữ liệu và giải thuật", credits: 4 },
  { code: "CS302", subject: "Cơ sở dữ liệu", credits: 3 },
  { code: "MA240", subject: "Toán rời rạc", credits: 3 },
  { code: "BA201", subject: "Nguyên lý quản trị", credits: 3 },
  { code: "DL110", subject: "Tổng quan du lịch", credits: 3 },
  { code: "KS215", subject: "Quản trị buồng phòng", credits: 2 },
  { code: "EN210", subject: "Viết kỹ thuật", credits: 2 },
  { code: "CS401", subject: "Trí tuệ nhân tạo", credits: 4 },
  { code: "DS320", subject: "Trực quan hóa dữ liệu", credits: 3 },
  { code: "SE301", subject: "Công nghệ phần mềm", credits: 3 },
  { code: "NW210", subject: "Mạng máy tính", credits: 3 }
];

function getEnrollmentYear(studentId) {
  const prefix = Number(String(studentId).slice(0, 2));
  return 2000 + prefix;
}

function getCurrentAcademicStartYear(today = new Date()) {
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  return month >= 8 ? year : year - 1;
}

function buildSemesterRows(semesterIndex) {
  const start = (semesterIndex * 3) % subjectPool.length;
  const scores = [8.6, 7.4, 8.1, 6.8, 7.9, 9.0, 5.7, 8.3, 7.2, 8.8, 6.5, 7.6];

  return [0, 1, 2].map((offset) => {
    const subject = subjectPool[(start + offset) % subjectPool.length];
    return {
      ...subject,
      score10: scores[(semesterIndex + offset) % scores.length]
    };
  });
}

function buildSemesterResults(studentId) {
  const enrollmentYear = getEnrollmentYear(studentId);
  const currentAcademicStartYear = getCurrentAcademicStartYear();
  const results = [];
  let semesterIndex = 0;

  for (let year = enrollmentYear; year <= currentAcademicStartYear; year += 1) {
    for (let semester = 1; semester <= 2; semester += 1) {
      results.push({
        term: `Học kỳ ${semester}, năm học ${year}-${year + 1}`,
        rows: buildSemesterRows(semesterIndex)
      });
      semesterIndex += 1;
    }
  }

  return results.reverse();
}

export const semesterResults = buildSemesterResults(studentProfile.studentId);
