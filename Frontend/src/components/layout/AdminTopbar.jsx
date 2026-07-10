export default function AdminTopbar({ title }) {
  return (
    <header className="admin-topbar">
      <div className="admin-breadcrumb">
        <strong>Student management</strong>
        <span>&gt;</span>
        <span>{title}</span>
      </div>
    </header>
  );
}
