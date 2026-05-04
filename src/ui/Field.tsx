import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  children: ReactNode;
  helperText?: string;
};

export function Field({ label, children, helperText }: FieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {helperText ? <small>{helperText}</small> : null}
    </label>
  );
}
