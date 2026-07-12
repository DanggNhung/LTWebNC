import { useState } from "react";
import AddRecordModal from "../components/common/AddRecordModal.jsx";
import Button from "../components/common/Button.jsx";
import SuccessToast from "../components/common/SuccessToast.jsx";
import AdminPageHeader from "../components/layout/AdminPageHeader.jsx";
import AdminSidebar from "../components/layout/AdminSidebar.jsx";
import AdminTopbar from "../components/layout/AdminTopbar.jsx";
import SubjectInventoryTable from "../components/subjects/SubjectInventoryTable.jsx";
import { accounts as fallbackAccounts } from "../data/accountsData.js";
import { subjectFormFields } from "../data/adminFormFields.js";
import { subjects as fallbackSubjects } from "../data/subjectsData.js";
import useApiResource from "../hooks/useApiResource.js";
import usePersistentAdminRows from "../hooks/usePersistentAdminRows.js";

function getSubjectInitialValues(subject) {
  return {
    subjectCode: subject.code,
    subjectName: subject.name,
    credits: subject.credits,
    department: subject.faculty,
    instructor: subject.instructor,
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

function readStoredRows(storageKey, fallbackRows) {
  try {
    const storedValue = localStorage.getItem(storageKey);
    return storedValue ? JSON.parse(storedValue) : fallbackRows;
  } catch {
    return fallbackRows;
  }
}

function getInstructorOptionMap() {
  return readStoredRows("admin-accounts", fallbackAccounts)
    .filter((account) => account.role === "Giảng viên" && account.department)
    .reduce((optionMap, account) => {
      return {
        ...optionMap,
        [account.department]: [...(optionMap[account.department] ?? []), account.name]
      };
    }, {});
}

export default function SubjectsManagement() {
  const { data: sourceSubjects } = useApiResource("/subjects", fallbackSubjects);
  const { rows, saveRows } = usePersistentAdminRows("admin-subjects", sourceSubjects);
  const [isTableEditing, setIsTableEditing] = useState(false);
  const [draftRows, setDraftRows] = useState(rows);
  const [modalConfig, setModalConfig] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const displayedRows = isTableEditing ? draftRows : rows;
  const instructorOptionMap = getInstructorOptionMap();
  const dynamicSubjectFormFields = subjectFormFields.map((field) =>
    field.name === "instructor" ? { ...field, optionMap: instructorOptionMap } : field
  );

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
          row.code === modalConfig.rowKey ? buildSubjectRow(values, row) : row
        )
      );
      return;
    }

    const nextRows = [buildSubjectRow(values), ...rows];
    saveRows(nextRows);
    setDraftRows(nextRows);
    showSuccess();
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
