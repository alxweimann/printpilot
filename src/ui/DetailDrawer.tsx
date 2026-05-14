import type { ReactNode } from "react";


type DetailDrawerSize = "md" | "lg" | "xl";

type DetailDrawerProps = {
  open: boolean;
  title: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  size?: DetailDrawerSize;
};

type DetailDrawerSectionProps = {
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
};

type DetailDrawerFieldProps = {
  label: ReactNode;
  value?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function DetailDrawer({
  open,
  title,
  subtitle,
  eyebrow,
  children,
  footer,
  onClose,
  size = "lg",
}: DetailDrawerProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="detail-drawer-root">
      <button
        type="button"
        aria-label="Detailansicht schließen"
        className="detail-drawer-backdrop"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-drawer-title"
        className={`detail-drawer detail-drawer-${size}`}
      >
        <header className="detail-drawer-header">
          <div className="detail-drawer-title-block">
            {eyebrow ? <div className="detail-drawer-eyebrow">{eyebrow}</div> : null}

            <h2 id="detail-drawer-title" className="detail-drawer-title">
              {title}
            </h2>

            {subtitle ? (
              <p className="detail-drawer-subtitle">{subtitle}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="detail-drawer-close"
            aria-label="Schließen"
          >
            ×
          </button>
        </header>

        <div className="detail-drawer-content">{children}</div>

        {footer ? <footer className="detail-drawer-footer">{footer}</footer> : null}
      </aside>
    </div>
  );
}

export function DetailDrawerSection({
  title,
  description,
  children,
  className = "",
}: DetailDrawerSectionProps) {
  return (
    <section className={["detail-drawer-panel", className].filter(Boolean).join(" ")}>
      {title || description ? (
        <div className="detail-drawer-section-header">
          {title ? <h3>{title}</h3> : null}
          {description ? <p>{description}</p> : null}
        </div>
      ) : null}

      {children}
    </section>
  );
}

export function DetailDrawerField({
  label,
  value,
  children,
  className = "",
}: DetailDrawerFieldProps) {
  return (
    <div className={["detail-drawer-field", className].filter(Boolean).join(" ")}>
      <dt>{label}</dt>
      <dd>{children ?? value ?? "—"}</dd>
    </div>
  );
}

export function DetailDrawerFieldGrid({
  children,
  columns = 2,
}: {
  children: ReactNode;
  columns?: 1 | 2 | 3;
}) {
  return <dl className={`detail-drawer-field-grid detail-drawer-field-grid-${columns}`}>{children}</dl>;
}
