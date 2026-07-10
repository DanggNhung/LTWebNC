import Icon from "../common/Icon.jsx";

export default function FacultyInsights() {
  return (
    <aside className="faculty-insights">
      <section className="ai-illustration">
        <Icon name="auto_awesome" />
      </section>
      <section className="ai-card">
        <Icon name="psychology" />
        <h3>Gợi ý AI: Xu hướng học tập</h3>
        <p>
          Năm sinh viên đã cải thiện sau buổi thực hành gần nhất. Một sinh viên cần hỗ trợ
          nên được rà soát kỹ trước khi công bố điểm cuối kỳ.
        </p>
        <a href="#">Xem khuyến nghị <Icon name="arrow_forward" /></a>
      </section>
      <section className="panel compliance-card">
        <p className="label-caps">Thao tác nhanh</p>
        <h3>Kiểm tra liêm chính học thuật</h3>
        <p>Mọi thay đổi điểm đã gửi đều được lưu vết để phục vụ kiểm tra.</p>
        <span><Icon name="verified_user" /> Quy trình đã xác thực</span>
      </section>
    </aside>
  );
}
