import type { ReactNode } from "react";

import { Button } from "./Button";

type ConfirmDialogVariant = "default" | "danger" | "warning";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: ReactNode;
  details?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmDialogVariant;
  onConfirm: () => void;
  onCancel: () => void;
};

const variantStyles: Record<
  ConfirmDialogVariant,
  {
    border: string;
    panel: string;
    title: string;
    detailsBackground: string;
    detailsBorder: string;
    detailsText: string;
  }
> = {
  default: {
    border: "rgba(100, 116, 139, 0.22)",
    panel: "white",
    title: "rgb(15, 23, 42)",
    detailsBackground: "rgba(100, 116, 139, 0.08)",
    detailsBorder: "rgba(100, 116, 139, 0.18)",
    detailsText: "rgb(51, 65, 85)",
  },
  danger: {
    border: "rgba(220, 38, 38, 0.24)",
    panel: "white",
    title: "rgb(153, 27, 27)",
    detailsBackground: "rgba(220, 38, 38, 0.08)",
    detailsBorder: "rgba(220, 38, 38, 0.18)",
    detailsText: "rgb(127, 29, 29)",
  },
  warning: {
    border: "rgba(245, 158, 11, 0.3)",
    panel: "white",
    title: "rgb(146, 64, 14)",
    detailsBackground: "rgba(245, 158, 11, 0.1)",
    detailsBorder: "rgba(245, 158, 11, 0.22)",
    detailsText: "rgb(120, 53, 15)",
  },
};

export function ConfirmDialog({
  open,
  title,
  description,
  details,
  confirmLabel = "Bestätigen",
  cancelLabel = "Abbrechen",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  const styles = variantStyles[variant];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      style={{
        alignItems: "center",
        background: "rgba(15, 23, 42, 0.42)",
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        left: 0,
        padding: "1.5rem",
        position: "fixed",
        right: 0,
        top: 0,
        zIndex: 90,
      }}
    >
      <div
        style={{
          background: styles.panel,
          border: `1px solid ${styles.border}`,
          borderRadius: "1.25rem",
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.22)",
          display: "grid",
          gap: "1rem",
          maxWidth: "34rem",
          padding: "1.25rem",
          width: "100%",
        }}
      >
        <div style={{ display: "grid", gap: "0.35rem" }}>
          <strong
            id="confirm-dialog-title"
            style={{
              color: styles.title,
              fontSize: "1.05rem",
            }}
          >
            {title}
          </strong>

          {description && (
            <div style={{ color: "rgb(71, 85, 105)", lineHeight: 1.5 }}>
              {description}
            </div>
          )}
        </div>

        {details && (
          <div
            style={{
              background: styles.detailsBackground,
              border: `1px solid ${styles.detailsBorder}`,
              borderRadius: "0.9rem",
              color: styles.detailsText,
              display: "grid",
              gap: "0.25rem",
              padding: "0.85rem",
            }}
          >
            {details}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={onCancel}>{cancelLabel}</Button>

          <Button variant="primary" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
