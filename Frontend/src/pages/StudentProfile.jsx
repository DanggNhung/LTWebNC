import Button from "../components/common/Button.jsx";
import StudentHeader from "../components/layout/StudentHeader.jsx";
import { studentProfile } from "../data/studentData.js";
import useApiResource from "../hooks/useApiResource.js";

function findCurrentStudent(students) {
  return (
    students.find((student) => student.studentId === studentProfile.studentId) ??
    students.find((student) => student.name === studentProfile.name) ??
    students[0]
  );
}

function getProfileRows(student) {
  return [
    { label: "Họ và tên", value: student?.name },
    { label: "Mã sinh viên", value: student?.studentId },
    { label: "Ngày sinh", value: student?.birthDate },
    { label: "Giới tính", value: student?.gender },
    { label: "Lớp", value: student?.className },
    { label: "Trạng thái", value: student?.status },
    { label: "Ngành", value: student?.major },
    { label: "Khoa", value: student?.faculty },
    { label: "Giảng viên hướng dẫn", value: student?.advisor }
  ];
}

export default function StudentProfile() {
  const { data: students } = useApiResource("/students", []);
  const student = findCurrentStudent(students);
  const profileRows = getProfileRows(student);

  return (
    <div className="student-page">
      <StudentHeader />
      <main className="student-content">
        <section className="page-heading">
          <div>
            <h1>Thông tin cá nhân</h1>
            <span>Rà soát thông tin hồ sơ, lớp học, ngành đào tạo và giảng viên hướng dẫn của sinh viên.</span>
          </div>
          <Button icon="edit">Chỉnh sửa</Button>
        </section>

        <section className="panel profile-panel">
          <div className="profile-summary">
            <span className={`avatar profile-avatar ${student?.avatar ?? "indigo"}`}>
              {student?.name?.trim().split(/\s+/).at(-1)?.charAt(0).toUpperCase() ?? "S"}
            </span>
            <div>
              <h2>{student?.name ?? "Chưa có dữ liệu sinh viên"}</h2>
            </div>
          </div>

          <div className="profile-info-grid">
            {profileRows.map((item) => (
              <div className="profile-info-item" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value || "Chưa cập nhật"}</strong>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
