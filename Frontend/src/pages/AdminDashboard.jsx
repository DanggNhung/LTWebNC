import RegistrationTable from "../components/admin/RegistrationTable.jsx";
import Button from "../components/common/Button.jsx";
import AdminPageHeader from "../components/layout/AdminPageHeader.jsx";
import AdminSidebar from "../components/layout/AdminSidebar.jsx";
import AdminTopbar from "../components/layout/AdminTopbar.jsx";
import { registrations as fallbackRegistrations } from "../data/adminData.js";
import useApiResource from "../hooks/useApiResource.js";

export default function AdminDashboard() {
  const { data: registrations } = useApiResource("/students", fallbackRegistrations);

  return (
    <div className="admin-shell">
      <AdminSidebar activeLabel="Sinh viên" />
      <main className="admin-main">
        <AdminTopbar title="Sinh viên" />
        <div className="admin-content">
          <AdminPageHeader
            title="Sinh viên"
            description="Quản lý danh sách sinh viên, mã sinh viên, khoa, ngành, lớp và trạng thái học tập."
            action={<Button icon="add">Thêm sinh viên</Button>}
          />
          <RegistrationTable rows={registrations} />
        </div>
      </main>
    </div>
  );
}
