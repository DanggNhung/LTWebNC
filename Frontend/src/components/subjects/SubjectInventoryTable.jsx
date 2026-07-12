import { useMemo, useState } from "react";
import { departments } from "../../data/academicStructure.js";
import Icon from "../common/Icon.jsx";

function getUniqueOptions(values) {
  return [...new Set(values.filter(Boolean))].sort((first, second) => first.localeCompare(second, "vi"));
}

export default function SubjectInventoryTable({ subjects, isEditing = false, onCancelEdit, onDelete, onEdit, onSaveAll }) {
  const [filters, setFilters] = useState({ faculty: "", knowledgeBlock: "" });
  const knowledgeBlockOptions = useMemo(
    () =>
      getUniqueOptions(
        subjects
          .filter((subject) => !filters.faculty || subject.faculty === filters.faculty)
          .map((subject) => subject.knowledgeBlock)
      ),
    [filters.faculty, subjects]
  );
  const filteredSubjects = useMemo(
    () =>
      subjects.filter(
        (subject) =>
          (!filters.faculty || subject.faculty === filters.faculty) &&
          (!filters.knowledgeBlock || subject.knowledgeBlock === filters.knowledgeBlock)
      ),
    [filters, subjects]
  );

  return (
    <section className="panel subject-inventory">
      <div className="panel-header">
        <div>
          <h2>Danh sách môn học</h2>
        </div>
        <div className="panel-actions">
          <div className="filter-controls" aria-label="Bộ lọc môn học">
            <select
              className="filter-select"
              value={filters.faculty}
              onChange={(event) => setFilters({ faculty: event.target.value, knowledgeBlock: "" })}
            >
              <option value="" hidden>Chọn Khoa</option>
              <option value="">Tất cả</option>
              {departments.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select className="filter-select" value={filters.knowledgeBlock} onChange={(event) => setFilters((current) => ({ ...current, knowledgeBlock: event.target.value }))}>
              <option value="" hidden>Chọn Khối kiến thức</option>
              <option value="">Tất cả</option>
              {knowledgeBlockOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
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
              <th>Giảng viên hướng dẫn</th>
              <th>Khối kiến thức</th>
              {isEditing && <th className="center-column edit-column" aria-label="Chỉnh sửa" />}
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.map((subject) => (
              <tr key={subject.code}>
                <td className="mono">{subject.code}</td>
                <td className="subject-name-column"><strong>{subject.name}</strong></td>
                <td className="center-column credit-column">{subject.credits}</td>
                <td>{subject.faculty}</td>
                <td>{subject.instructor || "Chưa phân công"}</td>
                <td>{subject.knowledgeBlock}</td>
                {isEditing && (
                  <td className="center-column edit-column">
                    <button className="icon-button edit-row-button" type="button" aria-label={`Chỉnh sửa ${subject.name}`} onClick={() => onEdit?.(subject)}>
                      <Icon name="edit" />
                    </button>
                    <button className="icon-button delete-row-button" type="button" aria-label={`Xóa ${subject.name}`} onClick={() => onDelete?.(subject)}>
                      <Icon name="delete" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isEditing && (
        <div className="external-table-edit-actions">
          <div className="table-edit-actions">
            <button className="btn btn-secondary" type="button" onClick={onCancelEdit}>Hủy</button>
            <button className="btn btn-primary" type="button" onClick={onSaveAll}>
              <Icon name="save" />
              <span>Lưu tất cả</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
