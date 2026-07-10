import Icon from "./Icon.jsx";

export default function Button({ children, icon, variant = "primary", className = "", ...props }) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {icon && <Icon name={icon} />}
      <span>{children}</span>
    </button>
  );
}
