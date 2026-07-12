import { useState } from "react";
import { requestJson } from "../../services/apiClient.js";
import Button from "../common/Button.jsx";
import StatusBadge from "../common/StatusBadge.jsx";

function roundOne(value) {
  return Number(value).toFixed(1);
}

function calculateScale10(row) {
  return row.attendance * 0.1 + row.midterm * 0.3 + row.final * 0.6;
}

function toGpa(scale10) {
  if (scale10 >= 8.5) return { scale4: 4.0, letter: "A" };
  if (scale10 >= 8.0) return { scale4: 3.5, letter: "B+" };
  if (scale10 >= 7.0) return { scale4: 3.0, letter: "B" };
  if (scale10 >= 6.5) return { scale4: 2.5, letter: "C+" };
  if (scale10 >= 5.5) return { scale4: 2.0, letter: "C" };
  if (scale10 >= 5.0) return { scale4: 1.5, letter: "D+" };
  if (scale10 >= 4.0) return { scale4: 1.0, letter: "D" };
  return { scale4: 0.0, letter: "F" };
}

export default function GradeTable({
  onSaved,
  onSubjectChange,
  rows,
  selectedSubjectId = "",
  subjects = []
}) {
  const [editing, setEditing] = useState(false);
  const [draftRows, setDraftRows] = useState([]);
  const displayedRows = editing ? draftRows : rows;

  function startEditing() {
    setDraftRows(rows);
    setEditing(true);
  }

  function updateDraft(enrollmentId, field, value) {
    setDraftRows((currentRows) =>
      currentRows.map((row) => (
        row.enrollmentId === enrollmentId ? { ...row, [field]: value } : row
      ))
    );
  }

  async function finishEditing() {
    for (const row of draftRows) {
      if (row.attendance === "" || row.midterm === "" || row.final === "") continue;

      await requestJson(`/portal/teacher/scores/${row.enrollmentId}`, {
        method: "PUT",
        body: {
          attendance: row.attendance,
          midterm: row.midterm,
          final: row.final
        }
      });
    }

    setEditing(false);
    await onSaved?.();
  }

  return (
    <section className="panel grade-panel">
      <div className="panel-header">
        <div className="grade-panel-title">
          <h2>Nhập điểm</h2>
          <select value={selectedSubjectId} onChange={(event) => onSubjectChange?.(event.target.value)}>
            <option value="">Chọn môn</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </div>
        <Button icon={editing ? "check" : "edit"} onClick={editing ? finishEditing : startEditing}>
          {editing ? "Hoàn tất" : "Chỉnh sửa"}
        </Button>
      </div>
      <div className="table-wrap">
        <table className="data-table grade-table">
          <thead>
            <tr>
              <th>Họ và tên</th>
              <th>Mã sinh viên</th>
              <th className="center-column">Chuyên cần</th>
              <th className="center-column">Giữa kỳ</th>
              <th className="center-column">Cuối kỳ</th>
              <th className="center-column">Điểm hệ số 10</th>
              <th className="center-column">Điểm hệ số 4</th>
              <th className="center-column">Điểm chữ</th>
              <th className="center-column">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {displayedRows.map((row) => {
              const hasAllScores = row.attendance !== "" && row.midterm !== "" && row.final !== "";
              const scale10 = hasAllScores ? calculateScale10(row) : null;
              const { scale4, letter } = hasAllScores ? toGpa(scale10) : { scale4: "", letter: "" };
              const status = hasAllScores ? (scale10 >= 4 ? "Đạt" : "Học lại") : "Chưa đủ điểm";

              return (
                <tr key={row.enrollmentId || row.id}>
                  <td><strong>{row.name}</strong></td>
                  <td className="mono">{row.id}</td>
                  <td className="center-column">{editing ? <input value={row.attendance} onChange={(event) => updateDraft(row.enrollmentId, "attendance", event.target.value)} /> : (row.attendance === "" ? "-" : roundOne(row.attendance))}</td>
                  <td className="center-column">{editing ? <input value={row.midterm} onChange={(event) => updateDraft(row.enrollmentId, "midterm", event.target.value)} /> : (row.midterm === "" ? "-" : roundOne(row.midterm))}</td>
                  <td className="center-column">{editing ? <input value={row.final} onChange={(event) => updateDraft(row.enrollmentId, "final", event.target.value)} /> : (row.final === "" ? "-" : roundOne(row.final))}</td>
                  <td className="center-column">{hasAllScores ? roundOne(scale10) : "-"}</td>
                  <td className="center-column">{hasAllScores ? roundOne(scale4) : "-"}</td>
                  <td className="mono center-column">{letter || "-"}</td>
                  <td className="center-column"><StatusBadge status={status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
