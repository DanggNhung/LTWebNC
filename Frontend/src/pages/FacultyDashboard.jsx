import { useState } from "react";
import GradeTable from "../components/faculty/GradeTable.jsx";
import FacultyHeader from "../components/layout/FacultyHeader.jsx";
import useApiResource from "../hooks/useApiResource.js";
import useApiRows from "../hooks/useApiRows.js";

export default function FacultyDashboard() {
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const { data: subjects } = useApiResource("/portal/teacher/subjects", []);
  const scoresPath = selectedSubjectId ? `/portal/teacher/scores?subjectId=${selectedSubjectId}` : null;
  const { rows: gradeRows, refresh } = useApiRows(scoresPath, []);
  const displayedGradeRows = selectedSubjectId ? gradeRows : [];

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
        <div className="faculty-grid">
          <GradeTable
            rows={displayedGradeRows}
            subjects={subjects}
            selectedSubjectId={selectedSubjectId}
            onSaved={refresh}
            onSubjectChange={setSelectedSubjectId}
          />
        </div>
      </main>
    </div>
  );
}
