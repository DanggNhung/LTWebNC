import Icon from "../common/Icon.jsx";
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

export default function AccountsTable({ accounts }) {
  return (
    <section className="panel accounts-table-panel">
      <div className="panel-header">
        <div>
          <h2>Danh sách tài khoản</h2>
          <p>Tổng số tài khoản: 1.284</p>
        </div>
        <div className="panel-actions">
          <div className="filter-controls" aria-label="Bộ lọc tài khoản">
            <Icon name="filter_list" />
            <button type="button">Chọn Vai trò</button>
          </div>
        </div>
      </div>
      <div className="table-wrap">
        <table className="data-table account-table">
          <thead>
            <tr>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Đăng nhập gần nhất</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={`${account.role}-${account.id}`}>
                <td>
                  <div className="identity-cell">
                    <span className={`avatar ${account.avatar}`}>{getGivenNameInitial(account.name)}</span>
                    <span>
                      <strong>{account.name}</strong>
                      <small>ID: {account.id}</small>
                    </span>
                  </div>
                </td>
                <td>{account.email}</td>
                <td><span className={`role-chip role-${toSlug(account.role)}`}>{account.role}</span></td>
                <td><StatusBadge status={account.status} /></td>
                <td>{account.lastLogin}</td>
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
          <button><Icon name="chevron_right" /></button>
        </div>
      </footer>
    </section>
  );
}
