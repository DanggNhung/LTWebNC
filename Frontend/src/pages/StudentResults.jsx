import StudentHeader from "../components/layout/StudentHeader.jsx";
import SemesterResult from "../components/student/SemesterResult.jsx";
import { semesterResults } from "../data/studentData.js";
import { roundOne, summarizeGrades } from "../utils/gradeUtils.js";

export default function StudentResults() {
  const summary = summarizeGrades(semesterResults);

  return (
    <div className="student-page">
      <StudentHeader />
      <main className="student-content">
        <section className="page-heading">
          <div>
            <h1>Kết quả học tập</h1>
            <span>Theo dõi kết quả học tập theo từng học kỳ kể từ năm nhập học.</span>
          </div>
          <details className="score-summary">
            <summary>Tổng điểm</summary>
            <div className="score-summary-menu">
              <span>Tổng số tín chỉ <strong>{summary.totalCredits}</strong></span>
              <span>Số tín chỉ tích lũy <strong>{summary.accumulatedCredits}</strong></span>
              <span>Điểm trung bình hệ số 10 <strong>{roundOne(summary.average10)}</strong></span>
              <span>Điểm trung bình hệ số 4 <strong>{roundOne(summary.average4)}</strong></span>
              <span>Điểm chữ trung bình <strong>{summary.averageLetter}</strong></span>
            </div>
          </details>
        </section>
        <div className="student-grid">
          <div className="semester-stack">
            {semesterResults.map((semester) => (
              <SemesterResult semester={semester} key={semester.term} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
