import Button from "../components/common/Button.jsx";
import StudentHeader from "../components/layout/StudentHeader.jsx";
import SemesterResult from "../components/student/SemesterResult.jsx";
import StudentSummary from "../components/student/StudentSummary.jsx";
import { semesterResults, studentProfile } from "../data/studentData.js";

export default function StudentResults() {
  return (
    <div className="student-page">
      <StudentHeader />
      <main className="student-content">
        <section className="page-heading">
          <div>
            <p className="label-caps">Hồ sơ sinh viên</p>
            <h1>Kết quả học tập</h1>
            <span>{studentProfile.name} - {studentProfile.program}</span>
          </div>
          <div className="button-row">
            <Button variant="secondary" icon="download">Tải xuống</Button>
            <Button variant="secondary" icon="share">Chia sẻ</Button>
          </div>
        </section>
        <div className="student-grid">
          <div className="semester-stack">
            {semesterResults.map((semester) => (
              <SemesterResult semester={semester} key={semester.term} />
            ))}
          </div>
          <StudentSummary profile={studentProfile} />
        </div>
      </main>
    </div>
  );
}
