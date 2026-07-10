import AccountsTable from "../components/accounts/AccountsTable.jsx";
import Button from "../components/common/Button.jsx";
import AdminPageHeader from "../components/layout/AdminPageHeader.jsx";
import AdminSidebar from "../components/layout/AdminSidebar.jsx";
import AdminTopbar from "../components/layout/AdminTopbar.jsx";
import { accounts as fallbackAccounts } from "../data/accountsData.js";
import useApiResource from "../hooks/useApiResource.js";

export default function AccountsManagement() {
  const { data: accounts } = useApiResource("/accounts", fallbackAccounts);

  return (
    <div className="admin-shell">
      <AdminSidebar activeLabel="Tài khoản" />
      <main className="admin-main">
        <AdminTopbar title="Tài khoản" />
        <div className="management-content">
          <AdminPageHeader
            title="Tài khoản"
            description="Quản lý tài khoản đăng nhập, vai trò, trạng thái và thời điểm đăng nhập gần nhất."
            action={<Button icon="add">Thêm người dùng</Button>}
          />
          <AccountsTable accounts={accounts} />
        </div>
      </main>
    </div>
  );
}
