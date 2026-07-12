import AddRecordModal from "../components/common/AddRecordModal.jsx";
import Button from "../components/common/Button.jsx";
import SuccessToast from "../components/common/SuccessToast.jsx";
import AdminPageHeader from "../components/layout/AdminPageHeader.jsx";
import AdminSidebar from "../components/layout/AdminSidebar.jsx";
import AdminTopbar from "../components/layout/AdminTopbar.jsx";
import SubjectInventoryTable from "../components/subjects/SubjectInventoryTable.jsx";
import { subjectFormFields } from "../data/adminFormFields.js";
import useApiRows from "../hooks/useApiRows.js";
import useFacultyOptions from "../hooks/useFacultyOptions.js";
import useTableEditor from "../hooks/useTableEditor.js";
import { getDatabaseId, saveDraftChanges } from "../utils/adminCrud.js";

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
  const { createRow, deleteRow, rows, loading, error, updateRow } = useApiRows("/subjects", []);
  const { rows: accountRows } = useApiRows("/accounts", []);
  const { departments } = useFacultyOptions();
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
  const instructorOptionMap = getInstructorOptionMap(accountRows);

  // Inject departments dynamic từ API, instructorOptionMap từ accounts
  const dynamicSubjectFormFields = subjectFormFields.map((field) => {
    if (field.name === "subjectCode" && modalConfig?.mode === "edit") return { ...field, readOnly: true };
    if (field.name === "department") return { ...field, options: departments };
    if (field.name === "instructor") return { ...field, optionMap: instructorOptionMap };
    return field;
  });

  async function saveAllChanges() {
    try {
      await saveDraftChanges({
        rows,
        draftRows,
        getKey: (row) => row.code,
        toPayload: toSubjectPayload,
        deleteRow,
        updateRow,
        getId: (row) => getDatabaseId(row, "Dữ liệu môn học")
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
          row.code === modalConfig.rowKey ? buildSubjectRow(values, row) : row
        )
      );
      return;
    }

    try {
      await createRow(toSubjectPayload(buildSubjectRow(values)));
      showMessage();
    } catch (err) {
      showMessage(err.message);
      throw err;
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
                <Button icon="add" onClick={() => openAddModal()}>Thêm môn học</Button>
                <Button icon="edit" variant={isTableEditing ? "secondary" : "primary"} onClick={isTableEditing ? () => cancelEditing(rows) : () => startEditing(rows)}>
                  Chỉnh sửa
                </Button>
              </div>
            )}
          />
          <SubjectInventoryTable
            subjects={displayedRows}
            departments={departments}
            isEditing={isTableEditing}
            loading={loading}
            error={error}
            onCancelEdit={() => cancelEditing(rows)}
            onDelete={(subject) => setDraftRows((currentRows) => currentRows.filter((row) => row.code !== subject.code))}
            onEdit={(subject) => openEditModal(subject.code, getSubjectInitialValues(subject))}
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
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitIcon={modalConfig?.mode === "edit" ? "save" : "add"}
        submitLabel={modalConfig?.mode === "edit" ? "Lưu" : "Thêm"}
      />
      <SuccessToast message={toastMessage} />
    </div>
  );
}
