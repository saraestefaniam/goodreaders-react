import "./spinner.css";

interface SpinnerProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  inline?: boolean;
}

function Spinner({ label = "Loading…", size = "md", inline = false }: SpinnerProps) {
  return (
    <div
      className={`spinner${inline ? " spinner--inline" : ""} spinner--${size}`}
      role="status"
      aria-live="polite"
    >
      <span className="spinner__circle" />
      {label && <span className="spinner__label">{label}</span>}
    </div>
  );
}

export default Spinner;
