import AccountMetricCards from "../components/accounts/AccountMetricCards.jsx";
import AccountsTable from "../components/accounts/AccountsTable.jsx";
import Button from "../components/common/Button.jsx";
import AdminSidebar from "../components/layout/AdminSidebar.jsx";
import ManagementTopbar from "../components/layout/ManagementTopbar.jsx";
import { accountMetrics, accounts } from "../data/accountsData.js";

export default function AccountsManagement() {
  return (
    <div className="admin-shell">
      <AdminSidebar activeLabel="Tài khoản" />
      <main className="admin-main">
        <ManagementTopbar searchPlaceholder="Tìm tài khoản, vai trò hoặc trạng thái..." />
        <div className="management-content">
          <section className="management-heading">
            <div>
              <h1>Quản lý tài khoản</h1>
              <p>Giám sát thông tin đăng nhập, vai trò và quyền truy cập trên toàn hệ thống.</p>
            </div>
            <div className="button-row">
              <Button variant="secondary" icon="download">Xuất dữ liệu</Button>
              <Button icon="add">Thêm người dùng</Button>
            </div>
          </section>
          <AccountMetricCards metrics={accountMetrics} />
          <AccountsTable accounts={accounts} />
        </div>
      </main>
    </div>
  );
}
