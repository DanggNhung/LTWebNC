import { useEffect, useState } from "react";
import useApiRows from "../../hooks/useApiRows.js";
import { requestJson } from "../../services/apiClient.js";
import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";
import { EmptyRow, ErrorRow, LoadingRows } from "../common/LoadingRows.jsx";

export default function CourseRegistrationModal({ isOpen, onClose, refreshToken = 0 }) {
  const { rows: subjects, loading, error, refresh } = useApiRows("/portal/student/subjects", []);
  const [selectedSubjects, setSelectedSubjects] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      refresh();
    }
  }, [isOpen, refresh, refreshToken]);

  if (!isOpen) return null;

  const allVisibleSelected = subjects.length > 0 && subjects.every((subject) => selectedSubjects.has(subject.id));

  const handleToggle = (subjectId) => {
    const next = new Set(selectedSubjects);
    if (next.has(subjectId)) next.delete(subjectId);
    else next.add(subjectId);
    setSelectedSubjects(next);
  };

  const handleToggleAll = () => {
    setSelectedSubjects(allVisibleSelected ? new Set() : new Set(subjects.map((subject) => subject.id)));
  };

  const handleClose = () => {
    setSelectedSubjects(new Set());
    onClose(false);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await requestJson("/portal/student/enrollments", {
        method: "POST",
        body: {
          subjectIds: [...selectedSubjects]
        }
      });
      setSelectedSubjects(new Set());
      await refresh();
      onClose(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={handleClose}>
      <section
        className="form-modal"
        style={{ maxWidth: "1120px", width: "95vw" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-registration-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="form-modal-header">
          <div>
            <h2 id="course-registration-title">Đăng ký môn học</h2>
            <p>Chọn các môn học muốn đăng ký trong học kỳ này.</p>
          </div>
          <button className="icon-button modal-close" type="button" aria-label="Đóng" onClick={handleClose}>
            <Icon name="close" />
          </button>
        </header>

        <div className="form-modal-body" style={{ padding: "0" }}>
          <div className="table-responsive" style={{ maxHeight: "60vh", overflowY: "auto", borderBottom: "1px solid var(--border-light)" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 48, textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      disabled={!subjects.length}
                      onChange={handleToggleAll}
                      aria-label="Chọn tất cả môn học"
                      style={{ cursor: subjects.length ? "pointer" : "default", width: 18, height: 18 }}
                    />
                  </th>
                  <th>Mã môn</th>
                  <th>Tên môn</th>
                  <th className="center-column">Tín chỉ</th>
                  <th>Khoa</th>
                  <th>Giảng viên hướng dẫn</th>
                  <th>Khối kiến thức</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <LoadingRows cols={7} />
                ) : error ? (
                  <ErrorRow cols={7} message={error.message} />
                ) : subjects.length === 0 ? (
                  <EmptyRow cols={7} />
                ) : (
                  subjects.map((subject) => (
                    <tr
                      key={subject.id}
                      onClick={() => handleToggle(subject.id)}
                      style={{ cursor: "pointer", background: selectedSubjects.has(subject.id) ? "var(--surface-mid)" : "transparent" }}
                    >
                      <td className="center-column" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedSubjects.has(subject.id)}
                          onChange={() => handleToggle(subject.id)}
                          style={{ cursor: "pointer", width: 16, height: 16 }}
                        />
                      </td>
                      <td className="mono">{subject.code}</td>
                      <td><strong>{subject.name}</strong></td>
                      <td className="center-column">{subject.credits}</td>
                      <td>{subject.faculty}</td>
                      <td>{subject.instructor}</td>
                      <td>{subject.knowledgeBlock}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="form-modal-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px" }}>
          <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Đã chọn: <strong style={{ color: "var(--primary-color)" }}>{selectedSubjects.size}</strong> môn
          </span>
          <div style={{ display: "flex", gap: "12px" }}>
            <Button variant="secondary" onClick={handleClose}>
              Hủy
            </Button>
            <Button onClick={handleConfirm} disabled={selectedSubjects.size === 0 || submitting}>
              {submitting ? "Đang đăng ký" : "Xác nhận đăng ký"}
            </Button>
          </div>
        </footer>
      </section>
    </div>
  );
}
