import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  const classes = className ? `input ${className}` : "input";

  return <input className={classes} {...props} />;
}
