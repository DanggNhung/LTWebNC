export default function AdminPageHeader({ title, description, action }) {
  return (
    <section className="admin-page-header">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action && <div className="admin-page-action">{action}</div>}
    </section>
  );
}
