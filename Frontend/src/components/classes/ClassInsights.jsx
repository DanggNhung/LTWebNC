import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";

export default function ClassInsights() {
  return (
    <div className="class-insights">
      <section className="ai-card scheduling-card">
        <h3>Trợ lý xếp lịch AI</h3>
        <p>
          Tối ưu phòng học và lịch giảng viên bằng công cụ xếp lịch sinh tự động.
          Phát hiện xung đột lịch chỉ trong vài giây.
        </p>
        <Button variant="accent" icon="rocket_launch">Khởi chạy công cụ</Button>
      </section>
      <section className="panel growth-card">
        <Icon name="trending_up" />
        <h3>Báo cáo tăng trưởng</h3>
        <p>Lượt ghi danh học kỳ này tăng 8.4% so với năm trước.</p>
        <a href="#">Xem phân tích <Icon name="arrow_forward" /></a>
      </section>
    </div>
  );
}
