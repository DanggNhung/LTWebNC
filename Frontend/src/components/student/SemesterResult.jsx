import { roundOne, toGpa } from "../../utils/gradeUtils.js";
import StatusBadge from "../common/StatusBadge.jsx";

export default function SemesterResult({ onCancelEnrollment, semester }) {
  return (
    <section className="panel semester-card">
      <div className="semester-header">
        <h2>{semester.term}</h2>
      </div>
      <div className="table-wrap">
        <table className="data-table semester-table">
          <thead>
            <tr>
              <th className="code-column">Mã môn</th>
              <th className="subject-name-column">Tên môn học</th>
              <th className="center-column credit-column">Số tín chỉ</th>
              <th className="center-column score-column">Điểm hệ số 10</th>
              <th className="center-column score-column">Điểm hệ số 4</th>
              <th className="center-column letter-column">Điểm chữ</th>
              <th className="center-column status-column">Trạng thái</th>
              <th className="center-column">Hủy đăng ký</th>
            </tr>
          </thead>
          <tbody>
            {semester.rows.map((row) => {
              const hasScore = row.score10 !== null && row.score10 !== undefined && row.score10 !== "";
              const { score4, letter } = hasScore ? toGpa(row.score10) : { score4: "", letter: "" };
              const status = hasScore ? row.status || (row.score10 >= 4 ? "Đạt" : "Học lại") : "Chưa đủ điểm";

              return (
                <tr key={row.enrollmentId ?? row.code}>
                  <td className="mono code-column">{row.code}</td>
                  <td className="subject-name-column">{row.subject}</td>
                  <td className="center-column credit-column">{row.credits}</td>
                  <td className="center-column score-column">{hasScore ? roundOne(row.score10) : "-"}</td>
                  <td className="center-column score-column">{hasScore ? roundOne(score4) : "-"}</td>
                  <td className="center-column letter-column"><strong>{letter || "-"}</strong></td>
                  <td className="center-column status-column"><StatusBadge status={status} /></td>
                  <td className="center-column">
                    <button
                      className="btn btn-secondary"
                      type="button"
                      disabled={!row.canCancel}
                      onClick={() => onCancelEnrollment?.(row)}
                    >
                      Hủy đăng ký
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
