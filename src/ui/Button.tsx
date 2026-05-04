import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

export function Button({
  children,
  variant = "secondary",
  type = "button",
  className,
  ...props
}: ButtonProps) {
  const variantClass = variant === "primary" ? "button-primary" : "button-secondary";
  const classes = className ? `${variantClass} ${className}` : variantClass;

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
