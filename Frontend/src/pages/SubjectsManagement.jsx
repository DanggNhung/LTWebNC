import Button from "../components/common/Button.jsx";
import CurriculumStatus from "../components/subjects/CurriculumStatus.jsx";
import SubjectInventoryTable from "../components/subjects/SubjectInventoryTable.jsx";
import SubjectSummary from "../components/subjects/SubjectSummary.jsx";
import AdminSidebar from "../components/layout/AdminSidebar.jsx";
import ManagementTopbar from "../components/layout/ManagementTopbar.jsx";
import { subjects, subjectStats } from "../data/subjectsData.js";

export default function SubjectsManagement() {
  return (
    <div className="admin-shell">
      <AdminSidebar
        activeLabel="Môn học"
        profileName="TS. Aris Thorne"
        profileRole="Quản trị chương trình"
        initials="AT"
      />
      <main className="admin-main">
        <ManagementTopbar searchPlaceholder="Tìm chương trình học..." />
        <div className="management-content">
          <section className="management-heading compact-heading">
            <div>
              <p>Chương trình / <strong>Quản lý môn học</strong></p>
              <h1>Kho môn học</h1>
              <span>Rà soát khoa, môn học cốt lõi và mức độ khó của từng học phần.</span>
            </div>
            <Button icon="add">Thêm môn học</Button>
          </section>
          <div className="subjects-grid">
            <SubjectSummary stats={subjectStats} />
            <SubjectInventoryTable subjects={subjects} />
          </div>
          <CurriculumStatus />
        </div>
      </main>
    </div>
  );
}
