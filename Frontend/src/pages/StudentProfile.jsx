import { useState } from "react";
import AddRecordModal from "../components/common/AddRecordModal.jsx";
import Button from "../components/common/Button.jsx";
import StudentHeader from "../components/layout/StudentHeader.jsx";
import useApiResource from "../hooks/useApiResource.js";
import { requestJson } from "../services/apiClient.js";

const profileEditFields = [
  { name: "birthDate", label: "Ngày sinh", type: "date" },
  { name: "gender", label: "Giới tính", type: "select", options: ["Nam", "Nữ"] }
];

function toInputDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

function getProfileRows(student) {
  return [
    { label: "Họ và tên", value: student?.name },
    { label: "Mã sinh viên", value: student?.studentId },
    { label: "Ngày sinh", value: formatDate(student?.birthDate) },
    { label: "Giới tính", value: student?.gender },
    { label: "Lớp", value: student?.className },
    { label: "Trạng thái", value: student?.status },
    { label: "Ngành", value: student?.major },
    { label: "Khoa", value: student?.faculty }
  ];
}

function getLastNameInitial(name) {
  return name?.trim().split(/\s+/).at(-1)?.charAt(0).toUpperCase() || "S";
}

export default function StudentProfile() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { data: student, refresh } = useApiResource("/portal/student/profile", null);
  const profileRows = getProfileRows(student);

  async function handleSubmit(values) {
    await requestJson("/portal/student/profile", {
      method: "PUT",
      body: values
    });
    await refresh();
  }

  return (
    <div className="student-page">
      <StudentHeader />
      <main className="student-content">
        <section className="page-heading">
          <div>
            <h1>Thông tin cá nhân</h1>
            <span>Rà soát thông tin hồ sơ, lớp học, ngành đào tạo và khoa quản lý của sinh viên.</span>
          </div>
          <Button icon="edit" onClick={() => setIsEditOpen(true)}>Chỉnh sửa</Button>
        </section>

        <section className="panel profile-panel">
          <div className="profile-summary">
            <span className={`avatar profile-avatar ${student?.avatar ?? "indigo"}`}>
              {getLastNameInitial(student?.name)}
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

      <AddRecordModal
        title="Chỉnh sửa thông tin cá nhân"
        description="Cập nhật ngày sinh và giới tính của sinh viên."
        fields={profileEditFields}
        initialValues={{
          birthDate: toInputDate(student?.birthDate),
          gender: student?.gender || ""
        }}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleSubmit}
        submitIcon="save"
        submitLabel="Lưu"
      />
    </div>
  );
}
