import GradeTable from "../components/faculty/GradeTable.jsx";
import GradeToolbar from "../components/faculty/GradeToolbar.jsx";
import FacultyHeader from "../components/layout/FacultyHeader.jsx";
import { gradeRows } from "../data/facultyData.js";

export default function FacultyDashboard() {
  return (
    <div className="faculty-page">
      <FacultyHeader />
      <main className="faculty-content">
        <section className="page-heading">
          <div>
            <h1>Quản lý điểm</h1>
            <span>Theo dõi và chỉnh sửa điểm thành phần của sinh viên trong lớp phụ trách.</span>
          </div>
        </section>
        <GradeToolbar />
        <div className="faculty-grid">
          <GradeTable rows={gradeRows} />
        </div>
      </main>
    </div>
  );
}
