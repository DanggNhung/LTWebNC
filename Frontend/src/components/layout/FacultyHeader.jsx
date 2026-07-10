import Icon from "../common/Icon.jsx";

export default function FacultyHeader() {
  return (
    <header className="faculty-header">
      <div className="faculty-title">
        <strong>EduTrack Pro</strong>
        <span>Quản lý điểm</span>
      </div>
      <div className="faculty-user">
        <Icon name="notifications" />
        <Icon name="settings" />
        <div className="avatar small">PA</div>
        <strong>GV. An</strong>
        <Icon name="logout" />
      </div>
    </header>
  );
}
