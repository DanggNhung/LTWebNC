import { useState } from "react";
import Button from "../common/Button.jsx";
import StatusBadge from "../common/StatusBadge.jsx";

export default function GradeTable({ rows }) {
  const [saving, setSaving] = useState(false);

  function handleSave() {
    setSaving(true);
    window.setTimeout(() => setSaving(false), 900);
  }

  return (
    <section className="panel grade-panel">
      <div className="panel-header">
        <div>
          <h2>Nhập điểm</h2>
          <p>Cập nhật điểm giữa kỳ và cuối kỳ trước khi công bố.</p>
        </div>
        <Button icon={saving ? "sync" : "save"} onClick={handleSave}>
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
      <table className="data-table grade-table">
        <thead>
          <tr>
            <th>Sinh viên</th>
            <th>Mã SV</th>
            <th>Giữa kỳ</th>
            <th>Cuối kỳ</th>
            <th>Trung bình</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td><strong>{row.name}</strong></td>
              <td className="mono">{row.id}</td>
              <td><input defaultValue={row.midterm} /></td>
              <td><input defaultValue={row.final} /></td>
              <td><strong>{row.average}</strong></td>
              <td><StatusBadge status={row.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
