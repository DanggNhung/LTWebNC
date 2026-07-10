import Icon from "../common/Icon.jsx";

export default function SubjectInventoryTable({ subjects }) {
  return (
    <section className="panel subject-inventory">
      <div className="panel-header">
        <div>
          <h2>Danh sách môn học</h2>
          <p>Tổng số môn học: 124</p>
        </div>
        <div className="panel-actions">
          <div className="filter-controls" aria-label="Bộ lọc môn học">
            <Icon name="filter_list" />
            <button type="button">Chọn Khoa</button>
            <button type="button">Chọn Ngành</button>
            <button type="button">Chọn Khối kiến thức</button>
          </div>
        </div>
      </div>
      <div className="table-wrap">
        <table className="data-table subject-table">
          <thead>
            <tr>
              <th>Mã môn</th>
              <th className="subject-name-column">Tên môn học</th>
              <th className="center-column credit-column">Số tín chỉ</th>
              <th>Khoa</th>
              <th>Ngành</th>
              <th>Khối kiến thức</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.code}>
                <td className="mono">{subject.code}</td>
                <td className="subject-name-column"><strong>{subject.name}</strong></td>
                <td className="center-column credit-column">{subject.credits}</td>
                <td>{subject.faculty}</td>
                <td>{subject.major}</td>
                <td>{subject.knowledgeBlock}</td>
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
          <button>16</button>
          <button><Icon name="chevron_right" /></button>
        </div>
      </footer>
    </section>
  );
}
