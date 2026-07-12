import { useRef, useState } from "react";
import Button from "../components/common/Button.jsx";
import SuccessToast from "../components/common/SuccessToast.jsx";
import StudentHeader from "../components/layout/StudentHeader.jsx";
import CourseRegistrationModal from "../components/student/CourseRegistrationModal.jsx";
import SemesterResult from "../components/student/SemesterResult.jsx";
import useApiResource from "../hooks/useApiResource.js";
import useApiRows from "../hooks/useApiRows.js";
import { requestJson } from "../services/apiClient.js";
import { roundOne, summarizeGrades } from "../utils/gradeUtils.js";

export default function StudentResults() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectRefreshToken, setSubjectRefreshToken] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  const toastTimerRef = useRef(null);
  const { rows, refresh } = useApiRows("/portal/student/enrollments", []);
  const { data: studentProfile } = useApiResource("/portal/student/profile", null);
  const semesterResults = rows.length ? [{ term: "Môn học đã đăng ký", rows }] : [];
  const summary = summarizeGrades(semesterResults);
  const canRegisterSubjects = studentProfile?.status !== "Bảo lưu";

  function showMessage(message = "Thành công") {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    setToastMessage("");
    window.setTimeout(() => {
      setToastMessage(message);
      toastTimerRef.current = window.setTimeout(() => setToastMessage(""), 2500);
    }, 0);
  }

  async function handleCancelEnrollment(row) {
    try {
      await requestJson(`/portal/student/enrollments/${row.enrollmentId}`, { method: "DELETE" });
      await refresh();
      setSubjectRefreshToken((value) => value + 1);
      showMessage("Hủy đăng ký thành công");
    } catch (error) {
      showMessage(error.message);
    }
  }

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
            <Button
              icon="add"
              onClick={() => setIsModalOpen(true)}
              disabled={!canRegisterSubjects}
              title={canRegisterSubjects ? undefined : "Sinh viên đang bảo lưu nên không thể đăng ký môn học"}
            >
              Đăng ký môn
            </Button>
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
              <SemesterResult
                semester={semester}
                key={semester.term}
                onCancelEnrollment={handleCancelEnrollment}
              />
            ))}
          </div>
        </div>
      </main>

      <CourseRegistrationModal
        isOpen={isModalOpen}
        refreshToken={subjectRefreshToken}
        onClose={(changed) => {
          setIsModalOpen(false);
          if (changed) {
            refresh();
            showMessage("Đăng ký môn thành công");
          }
        }}
      />
      <SuccessToast message={toastMessage} />
    </div>
  );
}
