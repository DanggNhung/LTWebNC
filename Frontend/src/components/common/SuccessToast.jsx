import Icon from "./Icon.jsx";

export default function SuccessToast({ message }) {
  if (!message) return null;

  return (
    <div className="success-toast" role="status" aria-live="polite">
      <Icon name="check_circle" filled />
      <span>{message}</span>
    </div>
  );
}
