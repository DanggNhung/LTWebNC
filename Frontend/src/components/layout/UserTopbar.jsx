import Icon from "../common/Icon.jsx";

export default function UserTopbar({ profileHref, showProfileLink = true, user }) {
  return (
    <header className="user-topbar">
      <strong className="topbar-brand">Student management</strong>
      <details className="topbar-profile">
        <summary aria-label="Mở menu tài khoản">
          <span className="avatar topbar-avatar">{user.avatar}</span>
        </summary>
        <div className="profile-menu">
          <div className="profile-menu-info">
            <strong>{user.name}</strong>
          </div>
          <div className="profile-menu-actions">
            {showProfileLink && <a href={profileHref}><Icon name="person" /> Thông tin cá nhân</a>}
            <a href="/"><Icon name="logout" /> Đăng xuất</a>
          </div>
        </div>
      </details>
    </header>
  );
}
