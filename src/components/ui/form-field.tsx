import type { ComponentProps } from "react";
import "../../index.css";

interface FormProps extends ComponentProps<"input"> {
  label: string;
}

const FormField = ({ label, ...props }: FormProps) => {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">
        <span>{label}</span>
        <input
          className="rounded-md border border-gray-300 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none"
          autoComplete="off"
          {...props}
        />
      </label>
    </div>
  );
};

export default FormField;
