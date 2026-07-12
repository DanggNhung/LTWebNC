import RegistrationTable from "../components/admin/RegistrationTable.jsx";
import AddRecordModal from "../components/common/AddRecordModal.jsx";
import Button from "../components/common/Button.jsx";
import SuccessToast from "../components/common/SuccessToast.jsx";
import AdminPageHeader from "../components/layout/AdminPageHeader.jsx";
import AdminSidebar from "../components/layout/AdminSidebar.jsx";
import AdminTopbar from "../components/layout/AdminTopbar.jsx";
import { studentFormFields } from "../data/adminFormFields.js";
import useApiRows from "../hooks/useApiRows.js";
import useTableEditor from "../hooks/useTableEditor.js";
import {
  EMPTY_CLASS_TEXT,
  EMPTY_GENDER_TEXT,
  getDatabaseId,
  saveDraftChanges,
  splitFullName,
  toDisplayDate,
  toInputDate
} from "../utils/adminCrud.js";

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

export default function AdminDashboard() {
  const { createRow, deleteRow, rows, loading, error, updateRow } = useApiRows("/students", []);
  const { rows: classRows } = useApiRows("/classes", []);
  const {
    cancelEditing,
    closeModal,
    draftRows,
    isTableEditing,
    modalConfig,
    openAddModal,
    openEditModal,
    setDraftRows,
    showMessage,
    startEditing,
    stopEditing,
    toastMessage
  } = useTableEditor(rows);

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

  async function saveAllChanges() {
    try {
      await saveDraftChanges({
        rows,
        draftRows,
        getKey: (row) => row.studentId,
        toPayload: toStudentPayload,
        deleteRow,
        updateRow,
        getId: (row) => getDatabaseId(row, "Dữ liệu sinh viên")
      });
      stopEditing();
      showMessage();
    } catch (err) {
      showMessage(err.message);
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
    } catch (err) {
      showMessage(err.message);
      throw err;
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
                <Button icon="add" onClick={() => openAddModal()}>Thêm sinh viên</Button>
                <Button icon="edit" variant={isTableEditing ? "secondary" : "primary"} onClick={isTableEditing ? () => cancelEditing(rows) : () => startEditing(rows)}>
                  Chỉnh sửa
                </Button>
              </div>
            )}
          />
          <RegistrationTable
            rows={displayedRows}
            isEditing={isTableEditing}
            loading={loading}
            error={error}
            onCancelEdit={() => cancelEditing(rows)}
            onDelete={(student) => setDraftRows((currentRows) => currentRows.filter((row) => row.studentId !== student.studentId))}
            onEdit={(student) => openEditModal(student.studentId, getStudentInitialValues(student))}
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
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitIcon={modalConfig?.mode === "edit" ? "save" : "add"}
        submitLabel={modalConfig?.mode === "edit" ? "Lưu" : "Thêm"}
      />
      <SuccessToast message={toastMessage} />
    </div>
  );
}
