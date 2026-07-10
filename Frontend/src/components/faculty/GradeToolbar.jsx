import { facultyCourses } from "../../data/facultyData.js";
import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";

export default function GradeToolbar() {
  return (
    <section className="panel grade-toolbar">
      <div>
        <p className="label-caps">Môn học</p>
        <select defaultValue={facultyCourses[0]}>
          {facultyCourses.map((course) => <option key={course}>{course}</option>)}
        </select>
      </div>
      <label>
        <p className="label-caps">Tìm sinh viên</p>
        <span>
          <Icon name="search" />
          <input placeholder="Tên hoặc mã sinh viên" />
        </span>
      </label>
      <div className="toolbar-buttons">
        <Button variant="secondary" icon="download">Xuất file</Button>
        <Button variant="secondary" icon="print">In</Button>
      </div>
    </section>
  );
}
