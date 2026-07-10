import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";

export default function ClassDirectory({ classes }) {
  return (
    <section className="panel class-directory">
      <div className="panel-header">
        <div className="inline-heading">
          <h2>Danh bạ lớp học</h2>
          <span>Học kỳ hiện tại</span>
        </div>
        <div className="panel-actions">
          <Button variant="secondary" icon="download">Xuất CSV</Button>
          <button className="view-toggle active" aria-label="Xem dạng bảng"><Icon name="table" /></button>
          <button className="view-toggle" aria-label="Xem dạng lưới"><Icon name="grid_view" /></button>
        </div>
      </div>
      <div className="table-wrap">
        <table className="data-table class-table">
          <thead>
            <tr>
              <th><input type="checkbox" aria-label="Chọn tất cả" /></th>
              <th>Mã lớp</th>
              <th>Tên lớp</th>
              <th>Khoa</th>
              <th>Giảng viên</th>
              <th>Sĩ số</th>
              <th>Lịch học</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((item) => (
              <tr key={item.id}>
                <td><input type="checkbox" aria-label={`Chọn ${item.name}`} /></td>
                <td className="mono">{item.id}</td>
                <td><strong>{item.name}</strong></td>
                <td><span className="department-chip">{item.department}</span></td>
                <td>{item.faculty}</td>
                <td>
                  <div className="capacity-cell">
                    <span><i style={{ width: `${(item.students / item.capacity) * 100}%` }} /></span>
                    <strong>{item.students}</strong>
                  </div>
                </td>
                <td>{item.schedule}</td>
                <td><button className="icon-button"><Icon name="more_vert" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="pagination">
        <span>Đang hiển thị 1 đến 10 trong 142 lớp</span>
        <div>
          <button><Icon name="chevron_left" /></button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <span>...</span>
          <button>15</button>
          <button><Icon name="chevron_right" /></button>
        </div>
      </footer>
    </section>
  );
}
