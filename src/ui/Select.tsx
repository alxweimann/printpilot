import type { ReactNode, SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode;
};

export function Select({ children, className, ...props }: SelectProps) {
  const classes = className ? `select ${className}` : "select";

  return (
    <select className={classes} {...props}>
      {children}
    </select>
  );
}
