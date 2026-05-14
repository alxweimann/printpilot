import type { CSSProperties, ReactNode } from "react";
import { createPortal } from "react-dom";

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

const drawerWidthBySize: Record<DetailDrawerSize, string> = {
  md: "560px",
  lg: "720px",
  xl: "860px",
};

const rootStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  display: "flex",
  justifyContent: "flex-end",
  pointerEvents: "auto",
};

const backdropStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  border: 0,
  background: "rgba(15, 23, 42, 0.18)",
  backdropFilter: "blur(1px)",
  cursor: "default",
};

const baseDrawerStyle: CSSProperties = {
  position: "relative",
  zIndex: 1001,
  display: "flex",
  width: "min(100vw, 720px)",
  height: "100vh",
  maxHeight: "100vh",
  flexDirection: "column",
  overflow: "hidden",
  borderLeft: "1px solid #d9dee7",
  background: "#ffffff",
  boxShadow: "-24px 0 60px rgba(15, 23, 42, 0.18)",
  animation: "printpilotDetailDrawerIn 360ms cubic-bezier(0.22, 1, 0.36, 1)",
};

const headerStyle: CSSProperties = {
  position: "relative",
  flex: "0 0 auto",
  borderBottom: "1px solid #e5e7eb",
  padding: "22px 72px 20px 28px",
  background: "#ffffff",
};

const eyebrowStyle: CSSProperties = {
  marginBottom: "8px",
  color: "#4f46e5",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const titleStyle: CSSProperties = {
  margin: 0,
  overflow: "hidden",
  color: "#111827",
  fontSize: "22px",
  fontWeight: 750,
  letterSpacing: "-0.03em",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const subtitleStyle: CSSProperties = {
  margin: "6px 0 0",
  color: "#6b7280",
  fontSize: "13px",
  lineHeight: 1.5,
};

const closeButtonStyle: CSSProperties = {
  position: "absolute",
  top: "18px",
  right: "20px",
  display: "inline-flex",
  width: "38px",
  height: "38px",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid #d9dee7",
  borderRadius: "999px",
  background: "#ffffff",
  color: "#6b7280",
  cursor: "pointer",
  fontSize: "22px",
  lineHeight: 1,
};

const contentStyle: CSSProperties = {
  flex: "1 1 auto",
  minHeight: 0,
  overflowY: "auto",
  padding: "24px 28px",
  background: "#f8fafc",
};

const footerStyle: CSSProperties = {
  flex: "0 0 auto",
  borderTop: "1px solid #e5e7eb",
  background: "#ffffff",
  padding: "16px 28px",
};

const footerInnerStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "10px",
};

const sectionStyle: CSSProperties = {
  border: "1px solid #d9dee7",
  borderRadius: "18px",
  background: "#ffffff",
  padding: "20px",
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
};

const sectionHeaderStyle: CSSProperties = {
  marginBottom: "16px",
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  color: "#111827",
  fontSize: "14px",
  fontWeight: 750,
};

const sectionDescriptionStyle: CSSProperties = {
  margin: "4px 0 0",
  color: "#6b7280",
  fontSize: "13px",
  lineHeight: 1.5,
};

const fieldLabelStyle: CSSProperties = {
  color: "#6b7280",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const fieldValueStyle: CSSProperties = {
  margin: "6px 0 0",
  color: "#111827",
  fontSize: "14px",
  fontWeight: 650,
};

const fieldGridBaseStyle: CSSProperties = {
  display: "grid",
  gap: "16px",
};

function getFieldGridStyle(columns: 1 | 2 | 3): CSSProperties {
  if (columns === 1) {
    return {
      ...fieldGridBaseStyle,
      gridTemplateColumns: "1fr",
    };
  }

  if (columns === 3) {
    return {
      ...fieldGridBaseStyle,
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    };
  }

  return {
    ...fieldGridBaseStyle,
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  };
}

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
  if (!open || typeof document === "undefined") {
    return null;
  }

  const drawer = (
    <div className="detail-drawer-root" style={rootStyle}>
      <style>
        {`
          @keyframes printpilotDetailDrawerIn {
            from {
              opacity: 0.96;
              transform: translateX(32px);
            }

            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @media (max-width: 760px) {
            .detail-drawer {
              width: 100vw !important;
              max-width: 100vw !important;
            }

            .detail-drawer-content {
              padding: 18px !important;
            }

            .detail-drawer-field-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      <button
        type="button"
        aria-label="Detailansicht schließen"
        className="detail-drawer-backdrop"
        style={backdropStyle}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-drawer-title"
        className={`detail-drawer detail-drawer-${size}`}
        style={{
          ...baseDrawerStyle,
          width: `min(100vw, ${drawerWidthBySize[size]})`,
          maxWidth: drawerWidthBySize[size],
        }}
      >
        <header className="detail-drawer-header" style={headerStyle}>
          <div className="detail-drawer-title-block">
            {eyebrow ? (
              <div className="detail-drawer-eyebrow" style={eyebrowStyle}>
                {eyebrow}
              </div>
            ) : null}

            <h2
              id="detail-drawer-title"
              className="detail-drawer-title"
              style={titleStyle}
            >
              {title}
            </h2>

            {subtitle ? (
              <p className="detail-drawer-subtitle" style={subtitleStyle}>
                {subtitle}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="detail-drawer-close"
            style={closeButtonStyle}
            aria-label="Schließen"
          >
            ×
          </button>
        </header>

        <div className="detail-drawer-content" style={contentStyle}>
          {children}
        </div>

        {footer ? (
          <footer className="detail-drawer-footer" style={footerStyle}>
            <div style={footerInnerStyle}>{footer}</div>
          </footer>
        ) : null}
      </aside>
    </div>
  );

  return createPortal(drawer, document.body);
}

export function DetailDrawerSection({
  title,
  description,
  children,
  className = "",
}: DetailDrawerSectionProps) {
  return (
    <section
      className={["detail-drawer-panel", className].filter(Boolean).join(" ")}
      style={sectionStyle}
    >
      {title || description ? (
        <div className="detail-drawer-section-header" style={sectionHeaderStyle}>
          {title ? <h3 style={sectionTitleStyle}>{title}</h3> : null}
          {description ? <p style={sectionDescriptionStyle}>{description}</p> : null}
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
      <dt style={fieldLabelStyle}>{label}</dt>
      <dd style={fieldValueStyle}>{children ?? value ?? "—"}</dd>
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
  return (
    <dl
      className={`detail-drawer-field-grid detail-drawer-field-grid-${columns}`}
      style={getFieldGridStyle(columns)}
    >
      {children}
    </dl>
  );
}
