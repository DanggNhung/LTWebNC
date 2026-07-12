import { useMemo, useState } from "react";
import Icon from "../common/Icon.jsx";
import { EmptyRow, ErrorRow, LoadingRows } from "../common/LoadingRows.jsx";
import StatusBadge from "../common/StatusBadge.jsx";

function getGivenNameInitial(fullName = "") {
  const parts = fullName.trim().split(/\s+/);
  return parts.at(-1)?.charAt(0).toUpperCase() ?? "";
}

function getStudentStatus(status) {
  return status === "Bảo lưu" ? "Bảo lưu" : "Đang học";
}

function getUniqueOptions(values) {
  return [...new Set(values.filter(Boolean))].sort((first, second) => first.localeCompare(second, "vi"));
}

export default function RegistrationTable({
  rows,
  isEditing = false,
  loading = false,
  error = null,
  onCancelEdit,
  onDelete,
  onEdit,
  onSaveAll,
  onToggleStatus
}) {
  const [classFilter, setClassFilter] = useState("");
  const classOptions = useMemo(() => getUniqueOptions(rows.map((row) => row.className)), [rows]);
  const filteredRows = useMemo(
    () => rows.filter((row) => !classFilter || row.className === classFilter),
    [classFilter, rows]
  );

  return (
    <section className="panel registration-panel">
      <div className="panel-header">
        <div>
          <h2>Danh sách sinh viên</h2>
        </div>
        <div className="panel-actions">
          <div className="filter-controls" aria-label="Bộ lọc sinh viên">
            <select className="filter-select" value={classFilter} onChange={(event) => setClassFilter(event.target.value)}>
              <option value="" hidden>Chọn Lớp</option>
              <option value="">Tất cả</option>
              {classOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="table-wrap">
        <table className="data-table student-table">
          <thead>
            <tr>
              <th>Họ và tên</th>
              <th>Mã sinh viên</th>
              <th>Ngày sinh</th>
              <th>Giới tính</th>
              <th>Lớp</th>
              <th>Trạng thái</th>
              {isEditing && <th className="center-column edit-column" aria-label="Chỉnh sửa" />}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <LoadingRows cols={isEditing ? 7 : 6} />
            ) : error ? (
              <ErrorRow cols={isEditing ? 7 : 6} message={error.message} />
            ) : filteredRows.length === 0 ? (
              <EmptyRow cols={isEditing ? 7 : 6} />
            ) : (
              filteredRows.map((row) => {
                const status = getStudentStatus(row.status);

                return (
                  <tr key={row.studentId}>
                    <td>
                      <div className="identity-cell">
                        <span className={`avatar ${row.avatar}`}>{getGivenNameInitial(row.name)}</span>
                        <span>
                          <strong>{row.name}</strong>
                        </span>
                      </div>
                    </td>
                    <td className="mono">{row.studentId}</td>
                    <td>{row.birthDate}</td>
                    <td>{row.gender}</td>
                    <td>{row.className}</td>
                    <td>
                      {isEditing ? (
                        <button className="status-toggle-button" type="button" onClick={() => onToggleStatus?.(row)}>
                          <StatusBadge status={status} />
                        </button>
                      ) : (
                        <StatusBadge status={status} />
                      )}
                    </td>
                    {isEditing && (
                      <td className="center-column edit-column">
                        <button className="icon-button edit-row-button" type="button" aria-label={`Chỉnh sửa ${row.name}`} onClick={() => onEdit?.(row)}>
                          <Icon name="edit" />
                        </button>
                        <button className="icon-button delete-row-button" type="button" aria-label={`Xóa ${row.name}`} onClick={() => onDelete?.(row)}>
                          <Icon name="delete" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
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
