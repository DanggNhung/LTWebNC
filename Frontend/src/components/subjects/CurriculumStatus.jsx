import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";

export default function CurriculumStatus() {
  return (
    <section className="panel curriculum-status">
      <div className="curriculum-visual">
        <Icon name="architecture" />
      </div>
      <div>
        <h3>Trạng thái đồng bộ chương trình</h3>
        <p>
          Chuẩn môn học toàn hệ thống được đồng bộ lần cuối 2 giờ trước.
          Tất cả mức độ khó hiện phù hợp với tiêu chí kiểm định của trường.
        </p>
      </div>
      <Button variant="secondary" icon="rule">Chạy kiểm tra</Button>
    </section>
  );
}
