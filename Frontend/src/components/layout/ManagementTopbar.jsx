import Icon from "../common/Icon.jsx";

export default function ManagementTopbar({ searchPlaceholder = "Tìm kiếm..." }) {
  return (
    <header className="management-topbar">
      <strong>EduTrack Pro</strong>
      <label className="search-box compact">
        <Icon name="search" />
        <input placeholder={searchPlaceholder} />
      </label>
      <nav>
        <button aria-label="Thông báo"><Icon name="notifications" /></button>
        <button aria-label="Cài đặt"><Icon name="settings" /></button>
        <button aria-label="Trợ giúp"><Icon name="help" /></button>
        <div className="avatar small">QT</div>
      </nav>
    </header>
  );
}
