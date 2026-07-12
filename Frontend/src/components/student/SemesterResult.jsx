import { roundOne, toGpa } from "../../utils/gradeUtils.js";
import StatusBadge from "../common/StatusBadge.jsx";

export default function SemesterResult({ semester }) {
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
            </tr>
          </thead>
          <tbody>
            {semester.rows.map((row) => {
              const { score4, letter } = toGpa(row.score10);
              const status = row.score10 >= 4 ? "Đạt" : "Học lại";

              return (
                <tr key={row.code}>
                  <td className="mono code-column">{row.code}</td>
                  <td className="subject-name-column">{row.subject}</td>
                  <td className="center-column credit-column">{row.credits}</td>
                  <td className="center-column score-column">{roundOne(row.score10)}</td>
                  <td className="center-column score-column">{roundOne(score4)}</td>
                  <td className="center-column letter-column"><strong>{letter}</strong></td>
                  <td className="center-column status-column"><StatusBadge status={status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
