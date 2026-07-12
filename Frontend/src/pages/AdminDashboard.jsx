import { useState } from "react";
import RegistrationTable from "../components/admin/RegistrationTable.jsx";
import AddRecordModal from "../components/common/AddRecordModal.jsx";
import Button from "../components/common/Button.jsx";
import SuccessToast from "../components/common/SuccessToast.jsx";
import AdminPageHeader from "../components/layout/AdminPageHeader.jsx";
import AdminSidebar from "../components/layout/AdminSidebar.jsx";
import AdminTopbar from "../components/layout/AdminTopbar.jsx";
import { accounts as fallbackAccounts } from "../data/accountsData.js";
import { registrations as fallbackRegistrations } from "../data/adminData.js";
import { studentFormFields } from "../data/adminFormFields.js";
import { classes as fallbackClasses } from "../data/classesData.js";
import useApiResource from "../hooks/useApiResource.js";
import usePersistentAdminRows from "../hooks/usePersistentAdminRows.js";

function splitFullName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  return {
    lastName: parts.slice(0, -1).join(" "),
    firstName: parts.at(-1) ?? ""
  };
}

function getStudentInitialValues(student) {
  const nameParts = splitFullName(student.name);
  return {
    ...nameParts,
    studentId: student.studentId,
    birthDate: toInputDate(student.birthDate),
    gender: student.gender,
    classCode: student.className
  };
}

function toDisplayDate(value) {
  if (!value || !value.includes("-")) return value;
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function toInputDate(value) {
  if (!value || !value.includes("/")) return value;
  const [day, month, year] = value.split("/");
  return `${year}-${month}-${day}`;
}

function buildStudentRow(values, existingRow = {}) {
  const studentId = values.studentId.trim();
  return {
    ...existingRow,
    name: `${values.lastName} ${values.firstName}`.trim(),
    email: `${studentId}@sinhvien-uni.edu.vn`,
    studentId,
    birthDate: toDisplayDate(values.birthDate),
    gender: values.gender,
    className: values.classCode,
    status: existingRow.status === "Bảo lưu" ? "Bảo lưu" : "Đang học",
    avatar: existingRow.avatar ?? "indigo"
  };
}

function readStoredRows(storageKey, fallbackRows) {
  try {
    const storedValue = localStorage.getItem(storageKey);
    return storedValue ? JSON.parse(storedValue) : fallbackRows;
  } catch {
    return fallbackRows;
  }
}

function writeStoredRows(storageKey, rows) {
  localStorage.setItem(storageKey, JSON.stringify(rows));
}

function syncAccountFromStudent(student) {
  const accounts = readStoredRows("admin-accounts", fallbackAccounts);
  const studentAccount = {
    initials: student.name?.trim().split(/\s+/).at(-1)?.charAt(0).toUpperCase() ?? "",
    name: student.name,
    id: student.studentId,
    email: student.email,
    password: "",
    role: "Sinh viên",
    status: "Hoạt động",
    lastLogin: "Chưa đăng nhập",
    avatar: student.avatar ?? "indigo"
  };
  const hasExistingAccount = accounts.some(
    (account) => account.role === "Sinh viên" && account.id === student.studentId
  );
  const nextAccounts = hasExistingAccount
    ? accounts.map((account) =>
        account.role === "Sinh viên" && account.id === student.studentId
          ? { ...account, name: student.name, email: student.email, initials: studentAccount.initials }
          : account
      )
    : [studentAccount, ...accounts];

  writeStoredRows("admin-accounts", nextAccounts);
}

function mergeStudentAccounts(students) {
  const accounts = readStoredRows("admin-accounts", fallbackAccounts);
  const studentAccounts = accounts.filter((account) => account.role === "Sinh viên");

  return studentAccounts.reduce((currentStudents, account) => {
    const studentRow = {
      name: account.name,
      email: account.email,
      studentId: account.id,
      birthDate: "",
      gender: "",
      className: "",
      status: "Đang học",
      avatar: account.avatar ?? "indigo"
    };

    return currentStudents.some((student) => student.studentId === account.id)
      ? currentStudents.map((student) =>
          student.studentId === account.id
            ? { ...student, name: account.name, email: account.email }
            : student
        )
      : [studentRow, ...currentStudents];
  }, students);
}

export default function AdminDashboard() {
  const { data: sourceRegistrations } = useApiResource("/students", fallbackRegistrations);
  const { rows, saveRows } = usePersistentAdminRows("admin-students", sourceRegistrations);
  const [isTableEditing, setIsTableEditing] = useState(false);
  const [draftRows, setDraftRows] = useState(rows);
  const [modalConfig, setModalConfig] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const syncedRows = mergeStudentAccounts(rows);
  const displayedRows = isTableEditing ? draftRows : syncedRows;
  const classOptions = readStoredRows("admin-classes", fallbackClasses).map((classRow) => classRow.id);
  const dynamicStudentFormFields = studentFormFields.map((field) => {
    if (field.name === "studentId" && modalConfig?.mode === "edit") {
      return { ...field, readOnly: true };
    }

    if (field.name === "classCode") {
      return {
        ...field,
        type: "select",
        options: classOptions
      };
    }

    return field;
  });

  function showSuccess() {
    setToastMessage("Thành công");
    window.setTimeout(() => setToastMessage(""), 1800);
  }

  function startEditing() {
    setDraftRows(syncedRows);
    setIsTableEditing(true);
  }

  function cancelEditing() {
    setDraftRows(syncedRows);
    setIsTableEditing(false);
  }

  function saveAllChanges() {
    saveRows(draftRows);
    setIsTableEditing(false);
    showSuccess();
  }

  function handleSubmit(values) {
    if (modalConfig?.mode === "edit") {
      setDraftRows((currentRows) =>
        currentRows.map((row) =>
          row.studentId === modalConfig.rowKey ? buildStudentRow(values, row) : row
        )
      );
      return;
    }

    const newStudent = buildStudentRow(values);
    const nextRows = [newStudent, ...syncedRows];
    saveRows(nextRows);
    setDraftRows(nextRows);
    syncAccountFromStudent(newStudent);
    showSuccess();
  }

  function toggleStudentStatus(student) {
    setDraftRows((currentRows) =>
      currentRows.map((row) => {
        if (row.studentId !== student.studentId) return row;
        const currentStatus = row.status === "Bảo lưu" ? "Bảo lưu" : "Đang học";
        return { ...row, status: currentStatus === "Đang học" ? "Bảo lưu" : "Đang học" };
      })
    );
  }

  return (
    <div className="admin-shell">
      <AdminSidebar activeLabel="Sinh viên" />
      <main className="admin-main">
        <AdminTopbar title="Sinh viên" />
        <div className="admin-content">
          <AdminPageHeader
            title="Sinh viên"
            description="Quản lý danh sách sinh viên, mã sinh viên, ngày sinh, giới tính, lớp và trạng thái học tập."
            action={(
              <div className="admin-header-actions">
                <Button icon="add" onClick={() => setModalConfig({ mode: "add", initialValues: {} })}>Thêm sinh viên</Button>
                <Button icon="edit" variant={isTableEditing ? "secondary" : "primary"} onClick={isTableEditing ? cancelEditing : startEditing}>
                  Chỉnh sửa
                </Button>
              </div>
            )}
          />
          <RegistrationTable
            rows={displayedRows}
            isEditing={isTableEditing}
            onCancelEdit={cancelEditing}
            onDelete={(student) => setDraftRows((currentRows) => currentRows.filter((row) => row.studentId !== student.studentId))}
            onEdit={(student) => setModalConfig({ mode: "edit", rowKey: student.studentId, initialValues: getStudentInitialValues(student) })}
            onSaveAll={saveAllChanges}
            onToggleStatus={toggleStudentStatus}
          />
        </div>
      </main>
      <AddRecordModal
        title={modalConfig?.mode === "edit" ? "Chỉnh sửa sinh viên" : "Thêm sinh viên"}
        description={modalConfig?.mode === "edit" ? "Cập nhật thông tin sinh viên đã chọn." : "Nhập thông tin sinh viên mới theo mã sinh viên đăng nhập."}
        fields={dynamicStudentFormFields}
        initialValues={modalConfig?.initialValues}
        isOpen={Boolean(modalConfig)}
        onClose={() => setModalConfig(null)}
        onSubmit={handleSubmit}
        submitIcon={modalConfig?.mode === "edit" ? "save" : "add"}
        submitLabel={modalConfig?.mode === "edit" ? "Lưu" : "Thêm"}
      />
      <SuccessToast message={toastMessage} />
    </div>
  );
}
