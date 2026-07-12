import { useMemo, useState } from "react";
import { departmentAbbreviations } from "../../data/academicStructure.js";
import Icon from "../common/Icon.jsx";
import { EmptyRow, ErrorRow, LoadingRows } from "../common/LoadingRows.jsx";
import StatusBadge from "../common/StatusBadge.jsx";

function toSlug(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getGivenNameInitial(fullName) {
  const parts = fullName.trim().split(/\s+/);
  return parts.at(-1)?.charAt(0).toUpperCase() ?? "";
}

function getAccountStatus(status) {
  return status === "Tạm khóa" ? "Tạm khóa" : "Hoạt động";
}

function getDisplayName(account) {
  if (account.role !== "Giảng viên" || !account.department) return account.name;
  const abbreviation = departmentAbbreviations[account.department];
  return abbreviation ? `${account.name} (${abbreviation})` : `${account.name} (${account.department})`;
}

function isSystemAdmin(account) {
  return account.id === "Admin" && account.role === "Quản trị viên";
}

function getPasswordDisplay(account) {
  if (account.passwordDisplay) return account.passwordDisplay;
  if (account.password) return account.password;
  return account.hasPassword ? "Mật khẩu" : "Chưa đặt";
}

function getUniqueOptions(values) {
  return [...new Set(values.filter(Boolean))].sort((first, second) => first.localeCompare(second, "vi"));
}

export default function AccountsTable({
  accounts,
  isEditing = false,
  loading = false,
  error = null,
  onCancelEdit,
  onDelete,
  onEdit,
  onSaveAll,
  onToggleStatus
}) {
  const [roleFilter, setRoleFilter] = useState("");
  const roleOptions = useMemo(() => getUniqueOptions(accounts.map((account) => account.role)), [accounts]);
  const filteredAccounts = useMemo(
    () => accounts.filter((account) => !roleFilter || account.role === roleFilter),
    [accounts, roleFilter]
  );

  return (
    <section className="panel accounts-table-panel">
      <div className="panel-header">
        <div>
          <h2>Danh sách tài khoản</h2>
        </div>
        <div className="panel-actions">
          <div className="filter-controls" aria-label="Bộ lọc tài khoản">
            <select className="filter-select" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
              <option value="" hidden>Chọn Vai trò</option>
              <option value="">Tất cả</option>
              {roleOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="table-wrap">
        <table className="data-table account-table">
          <thead>
            <tr>
              <th>Họ và tên</th>
              <th>Mật khẩu</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              {isEditing && <th className="center-column edit-column" aria-label="Chỉnh sửa" />}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <LoadingRows cols={isEditing ? 5 : 4} />
            ) : error ? (
              <ErrorRow cols={isEditing ? 5 : 4} message={error.message} />
            ) : filteredAccounts.length === 0 ? (
              <EmptyRow cols={isEditing ? 5 : 4} />
            ) : (
              filteredAccounts.map((account) => {
                const status = getAccountStatus(account.status);

                return (
                  <tr key={account.databaseId ?? `${account.role}-${account.id}`}>
                    <td>
                      <div className="identity-cell">
                        <span className={`avatar ${account.avatar}`}>{getGivenNameInitial(account.name)}</span>
                        <span>
                          <strong>{getDisplayName(account)}</strong>
                          <small>ID: {account.id}</small>
                        </span>
                      </div>
                    </td>
                    <td className="mono">{getPasswordDisplay(account)}</td>
                    <td><span className={`role-chip role-${toSlug(account.role)}`}>{account.role}</span></td>
                    <td>
                      {isEditing && !isSystemAdmin(account) ? (
                        <button className="status-toggle-button" type="button" onClick={() => onToggleStatus?.(account)}>
                          <StatusBadge status={status} />
                        </button>
                      ) : (
                        <StatusBadge status={status} />
                      )}
                    </td>
                    {isEditing && (
                      <td className="center-column edit-column">
                        {!isSystemAdmin(account) && (
                          <>
                            <button className="icon-button edit-row-button" type="button" aria-label={`Chỉnh sửa ${account.name}`} onClick={() => onEdit?.(account)}>
                              <Icon name="edit" />
                            </button>
                            <button className="icon-button delete-row-button" type="button" aria-label={`Xóa ${account.name}`} onClick={() => onDelete?.(account)}>
                              <Icon name="delete" />
                            </button>
                          </>
                        )}
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
