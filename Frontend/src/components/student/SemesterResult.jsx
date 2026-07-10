import StatusBadge from "../common/StatusBadge.jsx";

export default function SemesterResult({ semester }) {
  return (
    <section className="panel semester-card">
      <div className="semester-header">
        <h2>{semester.term}</h2>
        <StatusBadge status={`ĐTB ${semester.gpa}`} />
      </div>
      <table className="data-table compact-table">
        <thead>
          <tr>
            <th>Mã môn</th>
            <th>Môn học</th>
            <th>Tín chỉ</th>
            <th>Điểm</th>
            <th>Xếp loại</th>
          </tr>
        </thead>
        <tbody>
          {semester.rows.map((row) => (
            <tr key={row.code}>
              <td className="mono">{row.code}</td>
              <td>{row.subject}</td>
              <td>{row.credits}</td>
              <td>{row.score}</td>
              <td><strong>{row.grade}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
