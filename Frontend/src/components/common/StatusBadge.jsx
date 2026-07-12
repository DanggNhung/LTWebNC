export default function StatusBadge({ status }) {
  const normalized = status
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return <span className={`status-badge status-${normalized}`}>{status}</span>;
}
