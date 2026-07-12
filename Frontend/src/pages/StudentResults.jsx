import { useState } from "react";
import Button from "../components/common/Button.jsx";
import StudentHeader from "../components/layout/StudentHeader.jsx";
import CourseRegistrationModal from "../components/student/CourseRegistrationModal.jsx";
import SemesterResult from "../components/student/SemesterResult.jsx";
import { semesterResults } from "../data/studentData.js";
import { roundOne, summarizeGrades } from "../utils/gradeUtils.js";

export default function StudentResults() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          <div className="page-heading-actions" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <button 
              onClick={() => setIsModalOpen(true)}
              style={{
                background: "var(--primary-color)",
                color: "var(--text-inverse)",
                padding: "8px 16px",
                borderRadius: "6px",
                fontWeight: "600",
                fontSize: "0.9rem",
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => e.target.style.background = "var(--primary-hover)"}
              onMouseOut={(e) => e.target.style.background = "var(--primary-color)"}
            >
              Đăng ký môn
            </button>
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
          </div>
        </section>
        <div className="student-grid">
          <div className="semester-stack">
            {semesterResults.map((semester) => (
              <SemesterResult semester={semester} key={semester.term} />
            ))}
          </div>
        </div>
      </main>

      <CourseRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
