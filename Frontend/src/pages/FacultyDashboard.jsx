import FacultyInsights from "../components/faculty/FacultyInsights.jsx";
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
            <p className="label-caps">Không gian giảng viên</p>
            <h1>Bảng điều khiển giảng viên</h1>
            <span>Nhập, cập nhật và rà soát điểm sinh viên theo từng lớp học.</span>
          </div>
        </section>
        <GradeToolbar />
        <div className="faculty-grid">
          <GradeTable rows={gradeRows} />
          <FacultyInsights />
        </div>
      </main>
    </div>
  );
}
