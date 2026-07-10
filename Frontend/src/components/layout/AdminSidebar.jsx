import { adminNavItems } from "../../data/navigation.js";
import Icon from "../common/Icon.jsx";

export default function AdminSidebar({ activeLabel = "Sinh viên", profileName = "Hồ sơ quản trị", profileRole = "Quản trị viên hệ thống", initials = "AP" }) {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <h1>Bảng quản trị</h1>
        <p>Giám sát hệ thống</p>
      </div>
      <nav className="sidebar-nav">
        {adminNavItems.map((item) => (
          <a className={item.label === activeLabel ? "active" : ""} href={item.href} key={item.label}>
            <Icon name={item.icon} filled={item.label === activeLabel} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
      <div className="sidebar-profile">
        <div className="avatar image-avatar">{initials}</div>
        <div>
          <strong>{profileName}</strong>
          <span>{profileRole}</span>
        </div>
      </div>
    </aside>
  );
}
