import { subjects as fallbackSubjects } from "../../data/subjectsData.js";
import useApiResource from "../../hooks/useApiResource.js";
import Icon from "../common/Icon.jsx";

export default function GradeToolbar() {
  const { data: subjects } = useApiResource("/subjects", fallbackSubjects);

  return (
    <section className="panel grade-toolbar">
      <div>
        <p className="label-caps">Môn học</p>
        <select defaultValue={subjects[0]?.code || ""}>
          {subjects.map((subject) => (
            <option key={subject.code} value={subject.code}>{subject.name}</option>
          ))}
        </select>
      </div>
      <label>
        <p className="label-caps">Tìm sinh viên</p>
        <span>
          <Icon name="search" />
          <input placeholder="Tên hoặc mã sinh viên" />
        </span>
      </label>
    </section>
  );
}
