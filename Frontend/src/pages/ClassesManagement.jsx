import { useState } from "react";
import ClassDirectory from "../components/classes/ClassDirectory.jsx";
import AddRecordModal from "../components/common/AddRecordModal.jsx";
import Button from "../components/common/Button.jsx";
import SuccessToast from "../components/common/SuccessToast.jsx";
import AdminPageHeader from "../components/layout/AdminPageHeader.jsx";
import AdminSidebar from "../components/layout/AdminSidebar.jsx";
import AdminTopbar from "../components/layout/AdminTopbar.jsx";
import { classes as fallbackClasses } from "../data/classesData.js";
import { classFormFields } from "../data/adminFormFields.js";
import useApiResource from "../hooks/useApiResource.js";
import usePersistentAdminRows from "../hooks/usePersistentAdminRows.js";

function getClassInitialValues(classItem) {
  return {
    classCode: classItem.id,
    className: classItem.name,
    major: classItem.major,
    department: classItem.faculty,
    advisor: classItem.instructor,
    size: classItem.students
  };
}

function buildClassRow(values, existingRow = {}) {
  return {
    ...existingRow,
    id: values.classCode.trim(),
    name: values.className,
    major: values.major,
    faculty: values.department,
    instructor: values.advisor,
    students: Number(values.size)
  };
}

export default function ClassesManagement() {
  const { data: sourceClasses } = useApiResource("/classes", fallbackClasses);
  const { rows, saveRows } = usePersistentAdminRows("admin-classes", sourceClasses);
  const [isTableEditing, setIsTableEditing] = useState(false);
  const [draftRows, setDraftRows] = useState(rows);
  const [modalConfig, setModalConfig] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const displayedRows = isTableEditing ? draftRows : rows;

  function showSuccess() {
    setToastMessage("Thành công");
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

  function saveAllChanges() {
    saveRows(draftRows);
    setIsTableEditing(false);
    showSuccess();
  }

  function handleSubmit(values) {
    if (modalConfig?.mode === "edit") {
      setDraftRows((currentRows) =>
        currentRows.map((row) =>
          row.id === modalConfig.rowKey ? buildClassRow(values, row) : row
        )
      );
      return;
    }

    const nextRows = [buildClassRow(values), ...rows];
    saveRows(nextRows);
    setDraftRows(nextRows);
    showSuccess();
  }

  return (
    <div className="admin-shell">
      <AdminSidebar activeLabel="Lớp học" />
      <main className="admin-main">
        <AdminTopbar title="Lớp học" />
        <div className="management-content">
          <AdminPageHeader
            title="Lớp học"
            description="Quản lý mã lớp, tên lớp, ngành, khoa, giảng viên phụ trách và sĩ số."
            action={(
              <div className="admin-header-actions">
                <Button icon="add" onClick={() => setModalConfig({ mode: "add", initialValues: {} })}>Thêm lớp học</Button>
                <Button icon="edit" variant={isTableEditing ? "secondary" : "primary"} onClick={isTableEditing ? cancelEditing : startEditing}>
                  Chỉnh sửa
                </Button>
              </div>
            )}
          />
          <ClassDirectory
            classes={displayedRows}
            isEditing={isTableEditing}
            onCancelEdit={cancelEditing}
            onDelete={(classItem) => setDraftRows((currentRows) => currentRows.filter((row) => row.id !== classItem.id))}
            onEdit={(classItem) => setModalConfig({ mode: "edit", rowKey: classItem.id, initialValues: getClassInitialValues(classItem) })}
            onSaveAll={saveAllChanges}
          />
        </div>
      </main>
      <AddRecordModal
        title={modalConfig?.mode === "edit" ? "Chỉnh sửa lớp học" : "Thêm lớp học"}
        description={modalConfig?.mode === "edit" ? "Cập nhật thông tin lớp học đã chọn." : "Nhập thông tin lớp học mới để bổ sung vào danh sách quản lý."}
        fields={classFormFields}
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
