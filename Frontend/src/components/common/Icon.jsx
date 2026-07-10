export default function Icon({ name, filled = false, className = "" }) {
  const style = filled ? { fontVariationSettings: "'FILL' 1" } : undefined;

  return (
    <span className={`material-symbols-outlined ${className}`} style={style}>
      {name}
    </span>
  );
}
