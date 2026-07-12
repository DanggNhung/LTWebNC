import { useState } from "react";
import ClassDirectory from "../components/classes/ClassDirectory.jsx";
import AddRecordModal from "../components/common/AddRecordModal.jsx";
import Button from "../components/common/Button.jsx";
import SuccessToast from "../components/common/SuccessToast.jsx";
import AdminPageHeader from "../components/layout/AdminPageHeader.jsx";
import AdminSidebar from "../components/layout/AdminSidebar.jsx";
import AdminTopbar from "../components/layout/AdminTopbar.jsx";
import { classFormFields } from "../data/adminFormFields.js";
import useApiRows from "../hooks/useApiRows.js";

function getClassInitialValues(classItem) {
  return {
    classCode: classItem.id,
    className: classItem.name,
    major: classItem.major,
    department: classItem.faculty,
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
    students: Number(values.size)
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

function getDatabaseId(row) {
  const databaseId = row.databaseId ?? (Number.isInteger(Number(row.id)) ? row.id : null);

  if (!databaseId) {
    throw new Error("Dữ liệu lớp học chưa có databaseId. Hãy tải dữ liệu từ MySQL trước khi chỉnh sửa.");
  }

  return databaseId;
}

function rowsChanged(firstRow, secondRow) {
  return JSON.stringify(toClassPayload(firstRow)) !== JSON.stringify(toClassPayload(secondRow));
}

export default function ClassesManagement() {
  const { createRow, deleteRow, rows, updateRow } = useApiRows("/classes", []);
  const [isTableEditing, setIsTableEditing] = useState(false);
  const [draftRows, setDraftRows] = useState([]);
  const [modalConfig, setModalConfig] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const displayedRows = isTableEditing ? draftRows : rows;

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
    const draftByKey = new Map(draftRows.map((row) => [row.id, row]));
    const rowsByKey = new Map(rows.map((row) => [row.id, row]));
    const deletedRows = rows.filter((row) => !draftByKey.has(row.id));
    const updatedRows = draftRows.filter((row) => rowsByKey.has(row.id) && rowsChanged(row, rowsByKey.get(row.id)));

    try {
      for (const row of deletedRows) {
        await deleteRow(getDatabaseId(row));
      }

      for (const row of updatedRows) {
        await updateRow(getDatabaseId(rowsByKey.get(row.id)), toClassPayload(row));
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
          row.id === modalConfig.rowKey ? buildClassRow(values, row) : row
        )
      );
      return;
    }

    try {
      await createRow(toClassPayload(buildClassRow(values)));
      showMessage();
    } catch (error) {
      showMessage(error.message);
      throw error;
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
