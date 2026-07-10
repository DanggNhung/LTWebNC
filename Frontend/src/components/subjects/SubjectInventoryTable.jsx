import Icon from "../common/Icon.jsx";
import StatusBadge from "../common/StatusBadge.jsx";

export default function SubjectInventoryTable({ subjects }) {
  return (
    <section className="panel subject-inventory">
      <header className="subject-table-toolbar">
        <div className="button-row">
          <button>Tất cả khoa <Icon name="expand_more" /></button>
          <button>Mọi độ khó</button>
        </div>
        <span>Đang hiển thị <strong>1 - 8</strong> trong 124</span>
      </header>
      <table className="data-table subject-table">
        <thead>
          <tr>
            <th>Mã môn</th>
            <th>Tên môn học</th>
            <th>Tín chỉ</th>
            <th>Khoa</th>
            <th>Độ khó</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.code}>
              <td className="mono">{subject.code}</td>
              <td>{subject.name}</td>
              <td>{subject.credits}</td>
              <td>{subject.department}</td>
              <td><StatusBadge status={subject.difficulty} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <footer className="pagination">
        <span><Icon name="chevron_left" /> Trước</span>
        <div>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <span>...</span>
          <button>16</button>
        </div>
        <span>Sau <Icon name="chevron_right" /></span>
      </footer>
    </section>
  );
}
