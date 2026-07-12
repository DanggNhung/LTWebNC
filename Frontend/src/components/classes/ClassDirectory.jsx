import { useMemo, useState } from "react";
import { departments, majorsByDepartment } from "../../data/academicStructure.js";
import Icon from "../common/Icon.jsx";

export default function ClassDirectory({ classes, isEditing = false, onCancelEdit, onDelete, onEdit, onSaveAll }) {
  const [filters, setFilters] = useState({ faculty: "", major: "" });
  const majorOptions = filters.faculty ? majorsByDepartment[filters.faculty] ?? [] : [];
  const filteredClasses = useMemo(
    () =>
      classes.filter(
        (item) =>
          (!filters.faculty || item.faculty === filters.faculty) &&
          (!filters.major || item.major === filters.major)
      ),
    [classes, filters]
  );

  return (
    <section className="panel class-directory">
      <div className="panel-header">
        <div>
          <h2>Danh sách lớp học</h2>
        </div>
        <div className="panel-actions">
          <div className="filter-controls" aria-label="Bộ lọc lớp học">
            <select
              className="filter-select"
              value={filters.faculty}
              onChange={(event) => setFilters({ faculty: event.target.value, major: "" })}
            >
              <option value="" hidden>Chọn Khoa</option>
              <option value="">Tất cả</option>
              {departments.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select
              className="filter-select"
              value={filters.major}
              onChange={(event) => setFilters((current) => ({ ...current, major: event.target.value }))}
              disabled={!filters.faculty}
            >
              <option value="" hidden>Chọn Ngành</option>
              <option value="">Tất cả</option>
              {majorOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
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
              <th className="center-column">Sĩ số</th>
              {isEditing && <th className="center-column edit-column" aria-label="Chỉnh sửa" />}
            </tr>
          </thead>
          <tbody>
            {filteredClasses.map((item) => (
              <tr key={item.id}>
                <td className="mono">{item.id}</td>
                <td><strong>{item.name}</strong></td>
                <td>{item.major}</td>
                <td>{item.faculty}</td>
                <td className="center-column">{item.students}</td>
                {isEditing && (
                  <td className="center-column edit-column">
                    <button className="icon-button edit-row-button" type="button" aria-label={`Chỉnh sửa ${item.name}`} onClick={() => onEdit?.(item)}>
                      <Icon name="edit" />
                    </button>
                    <button className="icon-button delete-row-button" type="button" aria-label={`Xóa ${item.name}`} onClick={() => onDelete?.(item)}>
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
