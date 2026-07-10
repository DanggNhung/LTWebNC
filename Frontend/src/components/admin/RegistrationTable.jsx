import Icon from "../common/Icon.jsx";
import StatusBadge from "../common/StatusBadge.jsx";

function getGivenNameInitial(fullName) {
  const parts = fullName.trim().split(/\s+/);
  return parts.at(-1)?.charAt(0).toUpperCase() ?? "";
}

export default function RegistrationTable({ rows }) {
  return (
    <section className="panel registration-panel">
      <div className="panel-header">
        <div>
          <h2>Danh sách sinh viên</h2>
          <p>Tổng số sinh viên: 12.842</p>
        </div>
        <div className="panel-actions">
          <div className="filter-controls" aria-label="Bộ lọc sinh viên">
            <Icon name="filter_list" />
            <button type="button">Chọn Khoa</button>
            <button type="button">Chọn Ngành</button>
            <button type="button">Chọn Lớp</button>
          </div>
        </div>
      </div>
      <div className="table-wrap">
        <table className="data-table student-table">
          <thead>
            <tr>
              <th>Họ và tên</th>
              <th>Mã sinh viên</th>
              <th>Khoa</th>
              <th>Ngành</th>
              <th>Lớp</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.studentId}>
                <td>
                  <div className="identity-cell">
                    <span className={`avatar ${row.avatar}`}>{getGivenNameInitial(row.name)}</span>
                    <span>
                      <strong>{row.name}</strong>
                      <small>{row.email}</small>
                    </span>
                  </div>
                </td>
                <td className="mono">{row.studentId}</td>
                <td>{row.faculty}</td>
                <td>{row.major}</td>
                <td>{row.className}</td>
                <td><StatusBadge status={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="pagination pagination-centered">
        <div>
          <button><Icon name="chevron_left" /></button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <span>...</span>
          <button>12</button>
          <button><Icon name="chevron_right" /></button>
        </div>
      </footer>
    </section>
  );
}
