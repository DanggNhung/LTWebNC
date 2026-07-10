import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";

export default function AdminInsightCards() {
  return (
    <div className="admin-bottom-grid">
      <section className="ai-card admin-ai-card">
        <h3><Icon name="auto_awesome" /> Gợi ý AI về tuyển sinh</h3>
        <p>
          Dựa trên dữ liệu lịch sử, lượt đăng ký vào nhóm lớp học dự kiến tăng 15%
          trong 48 giờ tới. Nên ưu tiên tài nguyên máy chủ trong khung giờ cao điểm.
        </p>
        <div className="button-row">
          <Button variant="light">Tối ưu tài nguyên</Button>
          <Button variant="ghost">Xem dự báo đầy đủ</Button>
        </div>
      </section>
      <section className="panel health-card">
        <h3>Tình trạng hệ thống</h3>
        <div className="progress-line">
          <span style={{ width: "94%" }} />
          <strong>94%</strong>
        </div>
        <p>Thời gian hoạt động của dịch vụ đang ổn định. Không có độ trễ nghiêm trọng.</p>
        <footer>
          <strong>Nút hoạt động: US-EAST-1</strong>
          <span className="live-dot" />
        </footer>
      </section>
    </div>
  );
}
