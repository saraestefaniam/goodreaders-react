import type { ComponentProps } from "react";
import "./form-field.css";

interface FormFieldProps extends ComponentProps<"input"> {
  label: string;
  helperText?: string;
  wrapperClassName?: string;
  inputClassName?: string;
}

function FormField({
  label,
  helperText,
  wrapperClassName = "",
  inputClassName = "",
  ...props
}: FormFieldProps) {
  return (
    <label className={`form-field ${wrapperClassName}`}>
      <span className="form-field__label">{label}</span>
      <input className={`form-field__input ${inputClassName}`.trim()} {...props} />
      {helperText && <span className="form-field__helper">{helperText}</span>}
    </label>
  );
}

export default FormField;
