import Icon from "../common/Icon.jsx";
import StatusBadge from "../common/StatusBadge.jsx";

export default function AccountsTable({ accounts }) {
  return (
    <section className="panel accounts-table-panel">
      <table className="data-table account-table">
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Đăng nhập gần nhất</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td>
                <div className="identity-cell">
                  <span className={`avatar ${account.avatar}`}>{account.initials}</span>
                  <span>
                    <strong>{account.name}</strong>
                    <small>ID: {account.id}</small>
                  </span>
                </div>
              </td>
              <td>{account.email}</td>
              <td><span className={`role-chip role-${account.role.toLowerCase().replace(/\s+/g, "-")}`}>{account.role}</span></td>
              <td><StatusBadge status={account.status} /></td>
              <td>{account.lastLogin}</td>
              <td><button className="icon-button"><Icon name="more_vert" /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <footer className="pagination">
        <span>Đang hiển thị <strong>1-5</strong> trong 1,284 người dùng</span>
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
