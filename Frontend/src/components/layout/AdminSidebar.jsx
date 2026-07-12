import { adminNavItems } from "../../data/navigation.js";
import { requestJson } from "../../services/apiClient.js";
import Icon from "../common/Icon.jsx";

export default function AdminSidebar({ activeLabel = "Sinh viên" }) {
  async function handleLogout(event) {
    event.preventDefault();
    await requestJson("/auth/logout", { method: "POST" }).catch(() => null);
    window.location.href = "/";
  }

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <h1>Student management</h1>
      </div>
      <nav className="sidebar-nav">
        {adminNavItems.map((item) => (
          <a className={item.label === activeLabel ? "active" : ""} href={item.href} key={item.label}>
            <Icon name={item.icon} filled={item.label === activeLabel} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
      <a className="sidebar-profile" href="/" onClick={handleLogout}>
        <Icon name="logout" />
        <strong>Đăng xuất</strong>
      </a>
    </aside>
  );
}
