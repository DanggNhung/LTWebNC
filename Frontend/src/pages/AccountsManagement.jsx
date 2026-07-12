import AccountsTable from "../components/accounts/AccountsTable.jsx";
import AddRecordModal from "../components/common/AddRecordModal.jsx";
import Button from "../components/common/Button.jsx";
import { EmptyRow, ErrorRow, LoadingRows } from "../components/common/LoadingRows.jsx";
import SuccessToast from "../components/common/SuccessToast.jsx";
import AdminPageHeader from "../components/layout/AdminPageHeader.jsx";
import AdminSidebar from "../components/layout/AdminSidebar.jsx";
import AdminTopbar from "../components/layout/AdminTopbar.jsx";
import { accountFormFields } from "../data/adminFormFields.js";
import useApiRows from "../hooks/useApiRows.js";
import useFacultyOptions from "../hooks/useFacultyOptions.js";
import useTableEditor from "../hooks/useTableEditor.js";

const SYSTEM_ADMIN_ACCOUNT = {
  initials: "AP",
  name: "Quản trị hệ thống",
  id: "Admin",
  email: "",
  password: "SMAdmin@2026!",
  hasPassword: true,
  role: "Quản trị viên",
  status: "Hoạt động",
  lastLogin: "Vừa xong",
  avatar: "indigo"
};

function splitFullName(fullName = "") {
  const parts = fullName.trim().split(/\s+/);
  return {
    lastName: parts.slice(0, -1).join(" "),
    firstName: parts.at(-1) ?? ""
  };
}

function getAccountInitialValues(account) {
  const nameParts = splitFullName(account.name);
  return {
    ...nameParts,
    accountId: account.id,
    password: account.password || "",
    department: account.department,
    role: account.role
  };
}

function buildAccountRow(values, existingRow = {}) {
  const accountId = values.accountId.trim();

  return {
    ...existingRow,
    name: `${values.lastName} ${values.firstName}`.trim(),
    id: accountId,
    email: "",
    password: values.password || existingRow.password || "",
    hasPassword: Boolean(values.password || existingRow.hasPassword),
    role: values.role,
    department: values.role === "Giảng viên" ? values.department : "",
    status: existingRow.status === "Tạm khóa" ? "Tạm khóa" : "Hoạt động",
    lastLogin: existingRow.lastLogin ?? "Chưa đăng nhập",
    avatar: existingRow.avatar ?? "indigo"
  };
}

function normalizeAccounts(accounts) {
  const adminAccount = accounts.find((account) => account.id === "Admin" && account.role === "Quản trị viên");
  const editableAccounts = accounts.filter((account) => !(account.id === "Admin" && account.role === "Quản trị viên"));
  return [{ ...(adminAccount || SYSTEM_ADMIN_ACCOUNT), password: "SMAdmin@2026!", hasPassword: true }, ...editableAccounts];
}

function toAccountPayload(row) {
  return {
    accountId: row.id,
    name: row.name,
    password: row.password || undefined,
    role: row.role,
    department: row.department,
    status: row.status
  };
}

function getDatabaseId(row) {
  const databaseId = row.databaseId ?? (Number.isInteger(Number(row.id)) ? row.id : null);

  if (!databaseId) {
    throw new Error("Dữ liệu tài khoản chưa có databaseId. Hãy tải dữ liệu từ MySQL trước khi chỉnh sửa.");
  }

  return databaseId;
}

function rowsChanged(firstRow, secondRow) {
  return JSON.stringify(toAccountPayload(firstRow)) !== JSON.stringify(toAccountPayload(secondRow));
}

function getAccountKey(account) {
  return `${account.role}-${account.id}`;
}

export default function AccountsManagement() {
  const { createRow, deleteRow, rows, loading, error, updateRow } = useApiRows("/accounts", []);
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

  const normalizedRows = normalizeAccounts(rows);
  const displayedRows = isTableEditing ? draftRows : normalizedRows;

  // Inject departments dynamic từ API vào form fields
  const dynamicAccountFormFields = accountFormFields.map((field) => {
    if (field.name === "department") return { ...field, options: departments };
    return field;
  });

  async function saveAllChanges() {
    const editableRows = normalizedRows.filter((row) => row.id !== "Admin");
    const editableDraftRows = draftRows.filter((row) => row.id !== "Admin");
    const draftByKey = new Map(editableDraftRows.map((row) => [getAccountKey(row), row]));
    const rowsByKey = new Map(editableRows.map((row) => [getAccountKey(row), row]));
    const deletedRows = editableRows.filter((row) => !draftByKey.has(getAccountKey(row)));
    const updatedRows = editableDraftRows.filter((row) => rowsByKey.has(getAccountKey(row)) && rowsChanged(row, rowsByKey.get(getAccountKey(row))));

    try {
      for (const row of deletedRows) {
        await deleteRow(getDatabaseId(row));
      }

      for (const row of updatedRows) {
        await updateRow(getDatabaseId(rowsByKey.get(getAccountKey(row))), toAccountPayload(row));
      }

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
          getAccountKey(row) === modalConfig.rowKey ? buildAccountRow(values, row) : row
        )
      );
      return;
    }

    try {
      await createRow(toAccountPayload(buildAccountRow(values)));
      showMessage();
    } catch (err) {
      showMessage(err.message);
      throw err;
    }
  }

  function toggleAccountStatus(account) {
    setDraftRows((currentRows) =>
      currentRows.map((row) => {
        if (getAccountKey(row) !== getAccountKey(account)) return row;
        const currentStatus = row.status === "Tạm khóa" ? "Tạm khóa" : "Hoạt động";
        return { ...row, status: currentStatus === "Hoạt động" ? "Tạm khóa" : "Hoạt động" };
      })
    );
  }

  return (
    <div className="admin-shell">
      <AdminSidebar activeLabel="Tài khoản" />
      <main className="admin-main">
        <AdminTopbar title="Tài khoản" />
        <div className="management-content">
          <AdminPageHeader
            title="Tài khoản"
            description="Quản lý tài khoản đăng nhập, mật khẩu, vai trò và trạng thái truy cập hệ thống."
            action={(
              <div className="admin-header-actions">
                <Button icon="add" onClick={() => openAddModal()}>Thêm tài khoản</Button>
                <Button icon="edit" variant={isTableEditing ? "secondary" : "primary"} onClick={isTableEditing ? () => cancelEditing(normalizedRows) : () => startEditing(normalizedRows)}>
                  Chỉnh sửa
                </Button>
              </div>
            )}
          />
          <AccountsTable
            accounts={displayedRows}
            isEditing={isTableEditing}
            loading={loading}
            error={error}
            onCancelEdit={() => cancelEditing(normalizedRows)}
            onDelete={(account) => setDraftRows((currentRows) => normalizeAccounts(currentRows.filter((row) => getAccountKey(row) !== getAccountKey(account))))}
            onEdit={(account) => openEditModal(getAccountKey(account), getAccountInitialValues(account))}
            onSaveAll={saveAllChanges}
            onToggleStatus={toggleAccountStatus}
          />
        </div>
      </main>
      <AddRecordModal
        title={modalConfig?.mode === "edit" ? "Chỉnh sửa tài khoản" : "Thêm tài khoản"}
        description={modalConfig?.mode === "edit" ? "Cập nhật thông tin tài khoản đã chọn." : "Nhập thông tin tài khoản mới và vai trò sử dụng trong hệ thống."}
        fields={dynamicAccountFormFields}
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
