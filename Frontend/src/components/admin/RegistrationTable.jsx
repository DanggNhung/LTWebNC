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
  return (
    <section className="panel registration-panel">
      <div className="panel-header">
        <div>
          <h2>Danh sách sinh viên</h2>
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
            ) : rows.length === 0 ? (
              <EmptyRow cols={isEditing ? 7 : 6} />
            ) : (
              rows.map((row) => {
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
