import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary";
}

function Button({ variant, className = "", ...props }: ButtonProps) {
  const base =
    "cursor-pointer rounded-full border inline-flex items-center font-bold min-h-[36px] min-w-[72px] px-[30px] outline-none no-underline transition";

  const primary = "bg-[#721422] text-white border-[#721422] hover:bg-[#E0245E]";

  const secondary =
    "bg-white text-[#721422] border-[#721422] hover:bg-[#f8e6e9]";

  const disabledStyle = props.disabled ? "opacity-50 pointer-events-none" : "";

  const classes = `${base} ${
    variant === "primary" ? primary : secondary
  } ${disabledStyle} ${className}`;

  return React.createElement("button", { ...props, className: classes });
}

export default Button;
