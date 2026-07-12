import { useState } from "react";
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

export default function GradeTable({ rows }) {
  const [editing, setEditing] = useState(false);

  return (
    <section className="panel grade-panel">
      <div className="panel-header">
        <div>
          <h2>Nhập điểm</h2>
        </div>
        <Button icon={editing ? "check" : "edit"} onClick={() => setEditing((value) => !value)}>
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
            {rows.map((row) => {
              const scale10 = calculateScale10(row);
              const { scale4, letter } = toGpa(scale10);
              const status = scale10 >= 4 ? "Đạt" : "Học lại";

              return (
                <tr key={row.id}>
                  <td><strong>{row.name}</strong></td>
                  <td className="mono">{row.id}</td>
                  <td className="center-column">{editing ? <input defaultValue={roundOne(row.attendance)} /> : roundOne(row.attendance)}</td>
                  <td className="center-column">{editing ? <input defaultValue={roundOne(row.midterm)} /> : roundOne(row.midterm)}</td>
                  <td className="center-column">{editing ? <input defaultValue={roundOne(row.final)} /> : roundOne(row.final)}</td>
                  <td className="center-column">{roundOne(scale10)}</td>
                  <td className="center-column">{roundOne(scale4)}</td>
                  <td className="mono center-column">{letter}</td>
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
