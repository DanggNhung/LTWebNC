import { useState } from "react";
import AddRecordModal from "../components/common/AddRecordModal.jsx";
import Button from "../components/common/Button.jsx";
import SuccessToast from "../components/common/SuccessToast.jsx";
import AdminPageHeader from "../components/layout/AdminPageHeader.jsx";
import AdminSidebar from "../components/layout/AdminSidebar.jsx";
import AdminTopbar from "../components/layout/AdminTopbar.jsx";
import SubjectInventoryTable from "../components/subjects/SubjectInventoryTable.jsx";
import { subjectFormFields } from "../data/adminFormFields.js";
import useApiRows from "../hooks/useApiRows.js";

function getSubjectInitialValues(subject) {
  return {
    subjectCode: subject.code,
    subjectName: subject.name,
    credits: subject.credits,
    department: subject.faculty,
    instructor: subject.instructor === "Chưa phân công" ? "" : subject.instructor,
    knowledgeBlock: subject.knowledgeBlock
  };
}

function buildSubjectRow(values, existingRow = {}) {
  return {
    ...existingRow,
    code: values.subjectCode.trim(),
    name: values.subjectName,
    credits: Number(values.credits),
    faculty: values.department,
    instructor: values.instructor,
    knowledgeBlock: values.knowledgeBlock
  };
}

function toSubjectPayload(row) {
  return {
    subjectCode: row.code,
    subjectName: row.name,
    credits: Number(row.credits),
    faculty: row.faculty,
    instructor: row.instructor === "Chưa phân công" ? "" : row.instructor,
    knowledgeBlock: row.knowledgeBlock
  };
}

function getDatabaseId(row) {
  const databaseId = row.databaseId ?? row.id;

  if (!databaseId) {
    throw new Error("Dữ liệu môn học chưa có databaseId. Hãy tải dữ liệu từ MySQL trước khi chỉnh sửa.");
  }

  return databaseId;
}

function rowsChanged(firstRow, secondRow) {
  return JSON.stringify(toSubjectPayload(firstRow)) !== JSON.stringify(toSubjectPayload(secondRow));
}

function getInstructorOptionMap(accounts) {
  return accounts
    .filter((account) => account.role === "Giảng viên" && account.department)
    .reduce((optionMap, account) => {
      return {
        ...optionMap,
        [account.department]: [...(optionMap[account.department] ?? []), account.name]
      };
    }, {});
}

export default function SubjectsManagement() {
  const { createRow, deleteRow, rows, updateRow } = useApiRows("/subjects", []);
  const { rows: accountRows } = useApiRows("/accounts", []);
  const [isTableEditing, setIsTableEditing] = useState(false);
  const [draftRows, setDraftRows] = useState([]);
  const [modalConfig, setModalConfig] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const displayedRows = isTableEditing ? draftRows : rows;
  const instructorOptionMap = getInstructorOptionMap(accountRows);
  const dynamicSubjectFormFields = subjectFormFields.map((field) =>
    field.name === "instructor" ? { ...field, optionMap: instructorOptionMap } : field
  );

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
    const draftByKey = new Map(draftRows.map((row) => [row.code, row]));
    const rowsByKey = new Map(rows.map((row) => [row.code, row]));
    const deletedRows = rows.filter((row) => !draftByKey.has(row.code));
    const updatedRows = draftRows.filter((row) => rowsByKey.has(row.code) && rowsChanged(row, rowsByKey.get(row.code)));

    try {
      for (const row of deletedRows) {
        await deleteRow(getDatabaseId(row));
      }

      for (const row of updatedRows) {
        await updateRow(getDatabaseId(rowsByKey.get(row.code)), toSubjectPayload(row));
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
          row.code === modalConfig.rowKey ? buildSubjectRow(values, row) : row
        )
      );
      return;
    }

    try {
      await createRow(toSubjectPayload(buildSubjectRow(values)));
      showMessage();
    } catch (error) {
      showMessage(error.message);
      throw error;
    }
  }

  return (
    <div className="admin-shell">
      <AdminSidebar activeLabel="Môn học" />
      <main className="admin-main">
        <AdminTopbar title="Môn học" />
        <div className="management-content">
          <AdminPageHeader
            title="Môn học"
            description="Quản lý mã môn, số tín chỉ, khoa, giảng viên hướng dẫn và khối kiến thức của từng môn học."
            action={(
              <div className="admin-header-actions">
                <Button icon="add" onClick={() => setModalConfig({ mode: "add", initialValues: {} })}>Thêm môn học</Button>
                <Button icon="edit" variant={isTableEditing ? "secondary" : "primary"} onClick={isTableEditing ? cancelEditing : startEditing}>
                  Chỉnh sửa
                </Button>
              </div>
            )}
          />
          <SubjectInventoryTable
            subjects={displayedRows}
            isEditing={isTableEditing}
            onCancelEdit={cancelEditing}
            onDelete={(subject) => setDraftRows((currentRows) => currentRows.filter((row) => row.code !== subject.code))}
            onEdit={(subject) => setModalConfig({ mode: "edit", rowKey: subject.code, initialValues: getSubjectInitialValues(subject) })}
            onSaveAll={saveAllChanges}
          />
        </div>
      </main>
      <AddRecordModal
        title={modalConfig?.mode === "edit" ? "Chỉnh sửa môn học" : "Thêm môn học"}
        description={modalConfig?.mode === "edit" ? "Cập nhật thông tin môn học đã chọn." : "Nhập thông tin môn học mới để chuẩn bị đưa vào chương trình đào tạo."}
        fields={dynamicSubjectFormFields}
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
