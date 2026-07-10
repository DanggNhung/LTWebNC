import ClassDirectory from "../components/classes/ClassDirectory.jsx";
import ClassInsights from "../components/classes/ClassInsights.jsx";
import Button from "../components/common/Button.jsx";
import StatCard from "../components/common/StatCard.jsx";
import AdminSidebar from "../components/layout/AdminSidebar.jsx";
import ManagementTopbar from "../components/layout/ManagementTopbar.jsx";
import { classes, classStats } from "../data/classesData.js";

export default function ClassesManagement() {
  return (
    <div className="admin-shell">
      <AdminSidebar activeLabel="Lớp học" />
      <main className="admin-main">
        <ManagementTopbar searchPlaceholder="Tìm lớp, mã lớp hoặc giảng viên..." />
        <div className="management-content">
          <section className="management-heading compact-heading">
            <div>
              <p>Quản lý / <strong>Lớp học</strong></p>
              <h1>Lớp học học thuật</h1>
            </div>
            <div className="button-row">
              <Button variant="secondary" icon="filter_list">Lọc</Button>
              <Button icon="add">Tạo lớp mới</Button>
            </div>
          </section>
          <section className="class-stat-grid">
            {classStats.map((stat) => <StatCard {...stat} key={stat.label} />)}
          </section>
          <ClassDirectory classes={classes} />
          <ClassInsights />
        </div>
      </main>
    </div>
  );
}
