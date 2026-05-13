import type { ReactNode } from "react";

export type BadgeVariant = "success" | "warning" | "danger" | "neutral";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
};

const badgeStyles: Record<BadgeVariant, React.CSSProperties> = {
  success: {
    background: "rgba(22, 163, 74, 0.12)",
    borderColor: "rgba(22, 163, 74, 0.28)",
    color: "rgb(21, 128, 61)",
  },
  warning: {
    background: "rgba(245, 158, 11, 0.14)",
    borderColor: "rgba(245, 158, 11, 0.32)",
    color: "rgb(180, 83, 9)",
  },
  danger: {
    background: "rgba(220, 38, 38, 0.12)",
    borderColor: "rgba(220, 38, 38, 0.3)",
    color: "rgb(185, 28, 28)",
  },
  neutral: {
    background: "rgba(100, 116, 139, 0.12)",
    borderColor: "rgba(100, 116, 139, 0.24)",
    color: "rgb(71, 85, 105)",
  },
};

export function Badge({ children, variant = "neutral" }: BadgeProps) {
  return (
    <span className={`badge badge-${variant}`} style={badgeStyles[variant]}>
      {children}
    </span>
  );
}
