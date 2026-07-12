import Icon from "./Icon.jsx";

export default function SuccessToast({ message }) {
  if (!message) return null;
  const isError = /error|lỗi|không|thiếu|tồn tại|sai|chưa/i.test(message);

  return (
    <div className={`success-toast${isError ? " error-toast" : ""}`} role="status" aria-live="polite">
      <Icon name={isError ? "error" : "check_circle"} filled />
      <span>{message}</span>
    </div>
  );
}
