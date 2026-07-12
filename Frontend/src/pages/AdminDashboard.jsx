import { useState } from "react";
import RegistrationTable from "../components/admin/RegistrationTable.jsx";
import AddRecordModal from "../components/common/AddRecordModal.jsx";
import Button from "../components/common/Button.jsx";
import SuccessToast from "../components/common/SuccessToast.jsx";
import AdminPageHeader from "../components/layout/AdminPageHeader.jsx";
import AdminSidebar from "../components/layout/AdminSidebar.jsx";
import AdminTopbar from "../components/layout/AdminTopbar.jsx";
import { studentFormFields } from "../data/adminFormFields.js";
import useApiRows from "../hooks/useApiRows.js";

const EMPTY_DATE_TEXT = "Chưa cập nhật";
const EMPTY_GENDER_TEXT = "Chưa cập nhật";
const EMPTY_CLASS_TEXT = "Chưa phân lớp";

function splitFullName(fullName = "") {
  const parts = fullName.trim().split(/\s+/);
  return {
    lastName: parts.slice(0, -1).join(" "),
    firstName: parts.at(-1) ?? ""
  };
}

function toInputDate(value) {
  if (!value || !value.includes("/")) return "";
  const [day, month, year] = value.split("/");
  return `${year}-${month}-${day}`;
}

function toDisplayDate(value) {
  if (!value || !value.includes("-")) return EMPTY_DATE_TEXT;
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function getStudentInitialValues(student) {
  const nameParts = splitFullName(student.name);

  return {
    ...nameParts,
    studentId: student.studentId,
    birthDate: toInputDate(student.birthDate),
    gender: student.gender === EMPTY_GENDER_TEXT ? "" : student.gender,
    classCode: student.className === EMPTY_CLASS_TEXT ? "" : student.className
  };
}

function buildStudentRow(values, existingRow = {}) {
  const studentId = values.studentId.trim();

  return {
    ...existingRow,
    name: `${values.lastName} ${values.firstName}`.trim(),
    email: `${studentId}@sinhvien-uni.edu.vn`,
    studentId,
    birthDate: toDisplayDate(values.birthDate),
    gender: values.gender || EMPTY_GENDER_TEXT,
    className: values.classCode || EMPTY_CLASS_TEXT,
    status: existingRow.status === "Bảo lưu" ? "Bảo lưu" : "Đang học",
    avatar: existingRow.avatar ?? "indigo"
  };
}

function toStudentPayload(row) {
  const birthDate = toInputDate(row.birthDate);
  const gender = row.gender === EMPTY_GENDER_TEXT ? null : row.gender;
  const classCode = row.className === EMPTY_CLASS_TEXT ? null : row.className;

  return {
    studentId: row.studentId,
    name: row.name,
    birthDate: birthDate || null,
    gender,
    classCode,
    status: row.status
  };
}

function getDatabaseId(row) {
  const databaseId = row.databaseId ?? row.id;

  if (!databaseId) {
    throw new Error("Dữ liệu sinh viên chưa có databaseId. Hãy tải dữ liệu từ MySQL trước khi chỉnh sửa.");
  }

  return databaseId;
}

function rowsChanged(firstRow, secondRow) {
  return JSON.stringify(toStudentPayload(firstRow)) !== JSON.stringify(toStudentPayload(secondRow));
}

export default function AdminDashboard() {
  const { createRow, deleteRow, rows, updateRow } = useApiRows("/students", []);
  const { rows: classRows } = useApiRows("/classes", []);
  const [isTableEditing, setIsTableEditing] = useState(false);
  const [draftRows, setDraftRows] = useState([]);
  const [modalConfig, setModalConfig] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const displayedRows = isTableEditing ? draftRows : rows;
  const classOptions = classRows.map((classRow) => classRow.id);
  const dynamicStudentFormFields = studentFormFields.map((field) => {
    if (["lastName", "firstName", "studentId"].includes(field.name) && modalConfig?.mode === "edit") {
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

  function showMessage(message = "Thành công") {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(""), 1800);
  }

  function startEditing() {
    setDraftRows(rows);
    setIsTableEditing(true);
  }

  function cancelEditing() {
    setDraftRows(rows);
    setIsTableEditing(false);
  }

  async function saveAllChanges() {
    const draftByKey = new Map(draftRows.map((row) => [row.studentId, row]));
    const rowsByKey = new Map(rows.map((row) => [row.studentId, row]));
    const deletedRows = rows.filter((row) => !draftByKey.has(row.studentId));
    const updatedRows = draftRows.filter((row) => rowsByKey.has(row.studentId) && rowsChanged(row, rowsByKey.get(row.studentId)));

    try {
      for (const row of deletedRows) {
        await deleteRow(getDatabaseId(row));
      }

      for (const row of updatedRows) {
        await updateRow(getDatabaseId(rowsByKey.get(row.studentId)), toStudentPayload(row));
      }

      setIsTableEditing(false);
      showMessage();
    } catch (error) {
      showMessage(error.message);
    }
  }

  async function handleSubmit(values) {
    if (modalConfig?.mode === "edit") {
      setDraftRows((currentRows) =>
        currentRows.map((row) =>
          row.studentId === modalConfig.rowKey ? buildStudentRow(values, row) : row
        )
      );
      return;
    }

    try {
      await createRow(toStudentPayload(buildStudentRow(values)));
      showMessage();
    } catch (error) {
      showMessage(error.message);
      throw error;
    }
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
