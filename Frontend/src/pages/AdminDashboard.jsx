import AdminInsightCards from "../components/admin/AdminInsightCards.jsx";
import RegistrationTable from "../components/admin/RegistrationTable.jsx";
import StatCard from "../components/common/StatCard.jsx";
import AdminSidebar from "../components/layout/AdminSidebar.jsx";
import AdminTopbar from "../components/layout/AdminTopbar.jsx";
import { adminStats, registrations } from "../data/adminData.js";

export default function AdminDashboard() {
  return (
    <div className="admin-shell">
      <AdminSidebar activeLabel="Sinh viên" />
      <main className="admin-main">
        <AdminTopbar />
        <div className="admin-content">
          <section className="stats-grid">
            {adminStats.map((stat) => <StatCard {...stat} key={stat.label} />)}
          </section>
          <RegistrationTable rows={registrations} />
          <AdminInsightCards />
        </div>
      </main>
    </div>
  );
}
