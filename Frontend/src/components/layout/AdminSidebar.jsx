import { adminNavItems } from "../../data/navigation.js";
import Icon from "../common/Icon.jsx";

export default function AdminSidebar({ activeLabel = "Sinh viên" }) {
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
      <a className="sidebar-profile" href="/">
        <Icon name="logout" />
        <strong>Đăng xuất</strong>
      </a>
    </aside>
  );
}
