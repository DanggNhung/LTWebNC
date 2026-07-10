import Icon from "../common/Icon.jsx";

export default function ClassDirectory({ classes }) {
  return (
    <section className="panel class-directory">
      <div className="panel-header">
        <div>
          <h2>Danh sách lớp học</h2>
          <p>Tổng số lớp học: 142</p>
        </div>
        <div className="panel-actions">
          <div className="filter-controls" aria-label="Bộ lọc lớp học">
            <Icon name="filter_list" />
            <button type="button">Chọn Khoa</button>
            <button type="button">Chọn Ngành</button>
          </div>
        </div>
      </div>
      <div className="table-wrap">
        <table className="data-table class-table">
          <thead>
            <tr>
              <th>Mã lớp</th>
              <th>Tên lớp</th>
              <th>Ngành</th>
              <th>Khoa</th>
              <th>Giảng viên hướng dẫn</th>
              <th className="center-column">Sĩ số</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((item) => (
              <tr key={item.id}>
                <td className="mono">{item.id}</td>
                <td><strong>{item.name}</strong></td>
                <td>{item.major}</td>
                <td>{item.faculty}</td>
                <td>{item.instructor}</td>
                <td className="center-column">{item.students}</td>
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
          <button>15</button>
          <button><Icon name="chevron_right" /></button>
        </div>
      </footer>
    </section>
  );
}
