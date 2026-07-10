import Icon from "../common/Icon.jsx";

export default function StudentHeader() {
  return (
    <header className="student-header">
      <div>
        <strong>EduTrack Pro</strong>
        <span>Cổng sinh viên</span>
      </div>
      <label className="search-box compact">
        <Icon name="search" />
        <input placeholder="Tìm môn học, điểm số..." />
      </label>
      <nav>
        <button><Icon name="notifications" /></button>
        <button><Icon name="settings" /></button>
        <button><Icon name="help" /></button>
      </nav>
    </header>
  );
}
