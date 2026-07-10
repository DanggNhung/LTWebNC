import { studentQuickLinks } from "../../data/navigation.js";
import Icon from "../common/Icon.jsx";

export default function StudentSummary({ profile }) {
  const percent = Math.round((profile.creditsCompleted / profile.creditsRequired) * 100);

  return (
    <aside className="student-summary">
      <section className="gpa-card">
        <Icon name="auto_awesome" />
        <p>Điểm TB tích lũy</p>
        <strong>{profile.cumulativeGpa}</strong>
        <span>Thuộc nhóm 8% cao nhất của ngành học</span>
      </section>
      <section className="panel progress-card">
        <h3>Tiến độ tín chỉ</h3>
        <div className="ring-progress" style={{ "--value": `${percent}%` }}>
          <strong>{percent}%</strong>
        </div>
        <p>Đã hoàn thành {profile.creditsCompleted} / {profile.creditsRequired} tín chỉ</p>
      </section>
      <section className="panel quick-links">
        <h3>Truy cập nhanh</h3>
        {studentQuickLinks.map((item) => (
          <a href="#" key={item}>
            <span>{item}</span>
            <Icon name="arrow_forward" />
          </a>
        ))}
      </section>
      <section className="ai-card small-ai-card">
        <Icon name="psychology" />
        <p>Điểm môn hệ quản trị cơ sở dữ liệu của bạn tăng 6 điểm. Hãy duy trì nhịp học hiện tại.</p>
      </section>
    </aside>
  );
}
