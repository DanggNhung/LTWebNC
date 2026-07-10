import Icon from "./Icon.jsx";

export default function StatCard({ label, value, note, noteTone = "neutral", icon }) {
  return (
    <article className="stat-card">
      <div>
        <p className="label-caps">{label}</p>
        <strong>{value}</strong>
        <p className={`stat-note ${noteTone}`}>{note}</p>
      </div>
      <div className="stat-icon">
        <Icon name={icon} filled />
      </div>
    </article>
  );
}
