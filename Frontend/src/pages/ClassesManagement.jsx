import ClassDirectory from "../components/classes/ClassDirectory.jsx";
import AddRecordModal from "../components/common/AddRecordModal.jsx";
import Button from "../components/common/Button.jsx";
import SuccessToast from "../components/common/SuccessToast.jsx";
import AdminPageHeader from "../components/layout/AdminPageHeader.jsx";
import AdminSidebar from "../components/layout/AdminSidebar.jsx";
import AdminTopbar from "../components/layout/AdminTopbar.jsx";
import { classFormFields } from "../data/adminFormFields.js";
import useApiRows from "../hooks/useApiRows.js";
import useFacultyOptions from "../hooks/useFacultyOptions.js";
import useTableEditor from "../hooks/useTableEditor.js";
import { getDatabaseId, saveDraftChanges } from "../utils/adminCrud.js";

function getClassInitialValues(classItem) {
  return {
    classCode: classItem.id,
    className: classItem.name,
    major: classItem.major,
    department: classItem.faculty
  };
}

function buildClassRow(values, existingRow = {}) {
  return {
    ...existingRow,
    id: values.classCode.trim(),
    name: values.className,
    major: values.major,
    faculty: values.department,
    students: existingRow.students ?? 0
  };
}

function toClassPayload(row) {
  return {
    classCode: row.id,
    className: row.name,
    major: row.major,
    faculty: row.faculty,
    course: null
  };
}

export default function ClassesManagement() {
  const { createRow, deleteRow, rows, loading, error, updateRow } = useApiRows("/classes", []);
  const { departments, majorsByDepartment } = useFacultyOptions();
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

  // Inject departments và majorsByDepartment dynamic từ API
  const dynamicClassFormFields = classFormFields.map((field) => {
    if (field.name === "classCode" && modalConfig?.mode === "edit") return { ...field, readOnly: true };
    if (field.name === "department") return { ...field, options: departments };
    if (field.name === "major") return { ...field, optionMap: majorsByDepartment };
    return field;
  });

  async function saveAllChanges() {
    try {
      await saveDraftChanges({
        rows,
        draftRows,
        getKey: (row) => row.id,
        toPayload: toClassPayload,
        deleteRow,
        updateRow,
        getId: (row) => getDatabaseId(row, "Dữ liệu lớp học")
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
          row.id === modalConfig.rowKey ? buildClassRow(values, row) : row
        )
      );
      return;
    }

    try {
      await createRow(toClassPayload(buildClassRow(values)));
      showMessage();
    } catch (err) {
      showMessage(err.message);
      throw err;
    }
  }

  return (
    <div className="admin-shell">
      <AdminSidebar activeLabel="Lớp học" />
      <main className="admin-main">
        <AdminTopbar title="Lớp học" />
        <div className="management-content">
          <AdminPageHeader
            title="Lớp học"
            description="Quản lý mã lớp, tên lớp, ngành, khoa và sĩ số của từng lớp học."
            action={(
              <div className="admin-header-actions">
                <Button icon="add" onClick={() => openAddModal()}>Thêm lớp học</Button>
                <Button icon="edit" variant={isTableEditing ? "secondary" : "primary"} onClick={isTableEditing ? () => cancelEditing(rows) : () => startEditing(rows)}>
                  Chỉnh sửa
                </Button>
              </div>
            )}
          />
          <ClassDirectory
            classes={displayedRows}
            departments={departments}
            majorsByDepartment={majorsByDepartment}
            isEditing={isTableEditing}
            loading={loading}
            error={error}
            onCancelEdit={() => cancelEditing(rows)}
            onDelete={(classItem) => setDraftRows((currentRows) => currentRows.filter((row) => row.id !== classItem.id))}
            onEdit={(classItem) => openEditModal(classItem.id, getClassInitialValues(classItem))}
            onSaveAll={saveAllChanges}
          />
        </div>
      </main>
      <AddRecordModal
        title={modalConfig?.mode === "edit" ? "Chỉnh sửa lớp học" : "Thêm lớp học"}
        description={modalConfig?.mode === "edit" ? "Cập nhật thông tin lớp học đã chọn." : "Nhập thông tin lớp học mới để bổ sung vào danh sách quản lý."}
        fields={dynamicClassFormFields}
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
