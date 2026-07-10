import Icon from "../common/Icon.jsx";

export default function AccountMetricCards({ metrics }) {
  return (
    <section className="account-metrics">
      {metrics.map((metric) => (
        <article className={`account-metric ${metric.accent ? "accent" : ""}`} key={metric.title}>
          <Icon name={metric.icon} />
          <div>
            <p>{metric.title}</p>
            <strong>{metric.value}</strong>
          </div>
        </article>
      ))}
    </section>
  );
}
