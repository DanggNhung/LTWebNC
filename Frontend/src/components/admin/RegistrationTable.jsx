import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";
import StatusBadge from "../common/StatusBadge.jsx";

export default function RegistrationTable({ rows }) {
  return (
    <section className="panel registration-panel">
      <div className="panel-header">
        <div>
          <h2>Đăng ký sinh viên gần đây</h2>
          <p>Theo dõi luồng ghi danh theo thời gian thực</p>
        </div>
        <div className="panel-actions">
          <Button variant="secondary" icon="filter_list">Lọc</Button>
          <Button icon="person_add">Thêm mới</Button>
        </div>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Mã sinh viên</th>
              <th>Lớp</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.studentId}>
                <td>
                  <div className="identity-cell">
                    <span className={`avatar ${row.avatar}`}>{row.initials}</span>
                    <span>
                      <strong>{row.name}</strong>
                      <small>{row.email}</small>
                    </span>
                  </div>
                </td>
                <td className="mono">{row.studentId}</td>
                <td>{row.className}</td>
                <td><StatusBadge status={row.status} /></td>
                <td><button className="icon-button"><Icon name="more_vert" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="pagination">
        <span>Đang hiển thị 5 trong 1,280 lượt đăng ký</span>
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
