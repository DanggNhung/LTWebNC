import Icon from "../common/Icon.jsx";

export default function AdminTopbar() {
  return (
    <header className="admin-topbar">
      <div className="breadcrumb">
        <Icon name="menu_open" />
        <span>Quản trị</span>
        <Icon name="chevron_right" />
        <strong>Tổng quan</strong>
      </div>
      <div className="topbar-actions">
        <label className="search-box">
          <input placeholder="Tìm kiếm dữ liệu..." />
          <Icon name="search" />
        </label>
        <button aria-label="Thông báo"><Icon name="notifications" /></button>
        <button aria-label="Cài đặt"><Icon name="settings" /></button>
        <button aria-label="Trợ giúp"><Icon name="help" /></button>
      </div>
    </header>
  );
}
