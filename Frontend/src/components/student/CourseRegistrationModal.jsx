import { useState } from "react";
import useApiRows from "../../hooks/useApiRows.js";
import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";
import { EmptyRow, ErrorRow, LoadingRows } from "../common/LoadingRows.jsx";

export default function CourseRegistrationModal({ isOpen, onClose }) {
  const { rows: subjects, loading, error } = useApiRows("/subjects", []);
  const [selectedSubjects, setSelectedSubjects] = useState(new Set());

  if (!isOpen) return null;

  const handleToggle = (subjectId) => {
    const next = new Set(selectedSubjects);
    if (next.has(subjectId)) next.delete(subjectId);
    else next.add(subjectId);
    setSelectedSubjects(next);
  };

  const handleConfirm = () => {
    // Tạm thời chỉ đóng modal. Sau này có thể gọi API lưu xuống DB.
    onClose();
  };

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
      <section
        className="form-modal"
        style={{ maxWidth: "800px", width: "95vw" }}
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
          <button className="icon-button modal-close" type="button" aria-label="Đóng" onClick={onClose}>
            <Icon name="close" />
          </button>
        </header>

        <div className="form-modal-body" style={{ padding: "0" }}>
          <div className="table-responsive" style={{ maxHeight: "60vh", overflowY: "auto", borderBottom: "1px solid var(--border-light)" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 48, textAlign: "center" }}>
                    <Icon name="check_box_outline_blank" />
                  </th>
                  <th>Mã môn</th>
                  <th>Tên môn</th>
                  <th className="center-column">Tín chỉ</th>
                  <th>Khoa</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <LoadingRows cols={5} />
                ) : error ? (
                  <ErrorRow cols={5} message={error.message} />
                ) : subjects.length === 0 ? (
                  <EmptyRow cols={5} />
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
            <Button variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={handleConfirm} disabled={selectedSubjects.size === 0}>
              Xác nhận đăng ký
            </Button>
          </div>
        </footer>
      </section>
    </div>
  );
}
