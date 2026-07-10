import Icon from "../common/Icon.jsx";

export default function SubjectSummary({ stats }) {
  return (
    <aside className="subject-summary">
      {stats.map((stat) => (
        <section className="panel subject-stat" key={stat.label}>
          <p className="label-caps">{stat.label}</p>
          <div>
            <strong>{stat.value}</strong>
            <span className={stat.noteTone === "good" ? "good" : ""}>{stat.note}</span>
          </div>
        </section>
      ))}
      <section className="panel subject-ai">
        <Icon name="bolt" />
        <h3>Gợi ý AI</h3>
        <p>
          Độ khó tăng bất thường ở môn CS-402. Khuyến nghị rà soát điều kiện tiên quyết
          trong luồng chương trình hiện tại.
        </p>
      </section>
    </aside>
  );
}
