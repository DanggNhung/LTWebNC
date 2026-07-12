import { useEffect, useState } from "react";
import AccountsTable from "../components/accounts/AccountsTable.jsx";
import AddRecordModal from "../components/common/AddRecordModal.jsx";
import Button from "../components/common/Button.jsx";
import SuccessToast from "../components/common/SuccessToast.jsx";
import AdminPageHeader from "../components/layout/AdminPageHeader.jsx";
import AdminSidebar from "../components/layout/AdminSidebar.jsx";
import AdminTopbar from "../components/layout/AdminTopbar.jsx";
import { accountFormFields } from "../data/adminFormFields.js";
import { registrations as fallbackStudents } from "../data/adminData.js";
import { accounts as fallbackAccounts } from "../data/accountsData.js";
import useApiResource from "../hooks/useApiResource.js";
import usePersistentAdminRows from "../hooks/usePersistentAdminRows.js";

const SYSTEM_ADMIN_ACCOUNT = {
  initials: "AP",
  name: "Quản trị hệ thống",
  id: "Admin",
  email: "",
  password: "admin123",
  role: "Quản trị viên",
  status: "Hoạt động",
  lastLogin: "Vừa xong",
  avatar: "indigo"
};

function splitFullName(fullName) {
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
    password: account.password,
    department: account.department,
    role: account.role
  };
}

function getAccountEmail(accountId, role) {
  if (role === "Quản trị viên") return "";
  if (role === "Giảng viên") return `${accountId.toLowerCase()}@giangvien-uni.edu.vn`;
  return `${accountId}@sinhvien-uni.edu.vn`;
}

function buildAccountRow(values, existingRow = {}) {
  const accountId = values.accountId.trim();
  return {
    ...existingRow,
    name: `${values.lastName} ${values.firstName}`.trim(),
    id: accountId,
    email: getAccountEmail(accountId, values.role),
    password: values.password,
    role: values.role,
    department: values.role === "Giảng viên" ? values.department : "",
    status: existingRow.status === "Tạm khóa" ? "Tạm khóa" : "Hoạt động",
    lastLogin: existingRow.lastLogin ?? "Chưa đăng nhập",
    avatar: existingRow.avatar ?? "indigo"
  };
}

function normalizeAccounts(accounts) {
  const editableAccounts = accounts.filter((account) => account.id !== SYSTEM_ADMIN_ACCOUNT.id);
  return [SYSTEM_ADMIN_ACCOUNT, ...editableAccounts];
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

function syncStudentsFromAccounts(accounts) {
  const students = readStoredRows("admin-students", fallbackStudents);
  const studentAccounts = accounts.filter((account) => account.role === "Sinh viên");
  const nextStudents = studentAccounts.reduce((currentStudents, account) => {
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

  writeStoredRows("admin-students", nextStudents);
}

export default function AccountsManagement() {
  const { data: sourceAccounts } = useApiResource("/accounts", fallbackAccounts);
  const { rows, saveRows } = usePersistentAdminRows("admin-accounts", normalizeAccounts(sourceAccounts));
  const [isTableEditing, setIsTableEditing] = useState(false);
  const [draftRows, setDraftRows] = useState(rows);
  const [modalConfig, setModalConfig] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const displayedRows = isTableEditing ? draftRows : normalizeAccounts(rows);

  useEffect(() => {
    syncStudentsFromAccounts(normalizeAccounts(rows));
  }, [rows]);

  function showSuccess() {
    setToastMessage("Thành công");
    window.setTimeout(() => setToastMessage(""), 1800);
  }

  function startEditing() {
    setDraftRows(normalizeAccounts(rows));
    setIsTableEditing(true);
  }

  function cancelEditing() {
    setDraftRows(normalizeAccounts(rows));
    setIsTableEditing(false);
  }

  function saveAllChanges() {
    const nextRows = normalizeAccounts(draftRows);
    saveRows(nextRows);
    syncStudentsFromAccounts(nextRows);
    setIsTableEditing(false);
    showSuccess();
  }

  function handleSubmit(values) {
    if (modalConfig?.mode === "edit") {
      setDraftRows((currentRows) =>
        currentRows.map((row) =>
          `${row.role}-${row.id}` === modalConfig.rowKey ? buildAccountRow(values, row) : row
        )
      );
      return;
    }

    const newAccount = buildAccountRow(values);
    const nextRows = normalizeAccounts([newAccount, ...rows]);
    saveRows(nextRows);
    setDraftRows(nextRows);
    syncStudentsFromAccounts(nextRows);
    showSuccess();
  }

  function toggleAccountStatus(account) {
    setDraftRows((currentRows) =>
      currentRows.map((row) => {
        if (`${row.role}-${row.id}` !== `${account.role}-${account.id}`) return row;
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
            description="Quản lý tài khoản đăng nhập, vai trò, trạng thái và thời điểm đăng nhập gần nhất."
            action={(
              <div className="admin-header-actions">
                <Button icon="add" onClick={() => setModalConfig({ mode: "add", initialValues: {} })}>Thêm tài khoản</Button>
                <Button icon="edit" variant={isTableEditing ? "secondary" : "primary"} onClick={isTableEditing ? cancelEditing : startEditing}>
                  Chỉnh sửa
                </Button>
              </div>
            )}
          />
          <AccountsTable
            accounts={displayedRows}
            isEditing={isTableEditing}
            onCancelEdit={cancelEditing}
            onDelete={(account) => setDraftRows((currentRows) => normalizeAccounts(currentRows.filter((row) => `${row.role}-${row.id}` !== `${account.role}-${account.id}`)))}
            onEdit={(account) => setModalConfig({ mode: "edit", rowKey: `${account.role}-${account.id}`, initialValues: getAccountInitialValues(account) })}
            onSaveAll={saveAllChanges}
            onToggleStatus={toggleAccountStatus}
          />
        </div>
      </main>
      <AddRecordModal
        title={modalConfig?.mode === "edit" ? "Chỉnh sửa tài khoản" : "Thêm tài khoản"}
        description={modalConfig?.mode === "edit" ? "Cập nhật thông tin tài khoản đã chọn." : "Nhập thông tin tài khoản mới và vai trò sử dụng trong hệ thống."}
        fields={accountFormFields}
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
