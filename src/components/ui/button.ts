import React from "react";
import "./button.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary";
}

function Button({ variant, className = "", ...props }: ButtonProps) {
  const base = "btn";
  const primary = "btn--primary";
  const secondary = "btn--secondary";
  const disabledStyle = props.disabled ? "btn--disabled" : "";

  const classes = `${base} ${
    variant === "primary" ? primary : secondary
  } ${disabledStyle} ${className}`.trim();

  return React.createElement("button", { ...props, className: classes });
}

export default Button;
