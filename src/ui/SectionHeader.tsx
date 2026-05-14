import type { CSSProperties } from "react";

type SectionHeaderProps = {
  children: string;
};

const wrapperStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "100%",
  margin: "22px 0 14px",
  color: "#0f172a",
  fontSize: "14px",
  fontWeight: 800,
  lineHeight: 1.2,
};

const accentStyle: CSSProperties = {
  display: "inline-block",
  width: "4px",
  height: "18px",
  flex: "0 0 4px",
  borderRadius: "999px",
  background: "var(--detail-drawer-accent-color, var(--item-accent, #2563eb))",
  boxShadow: "0 0 10px var(--detail-drawer-accent-shadow, rgba(37, 99, 235, 0.35))",
};

const labelStyle: CSSProperties = {
  flex: "0 0 auto",
  whiteSpace: "nowrap",
};

const lineStyle: CSSProperties = {
  height: "1px",
  flex: "1 1 auto",
  background:
    "linear-gradient(90deg, rgba(148, 163, 184, 0.45), rgba(226, 232, 240, 0.2))",
};

export function SectionHeader({ children }: SectionHeaderProps) {
  return (
    <div data-section-header style={wrapperStyle}>
      <span aria-hidden="true" style={accentStyle} />
      <span style={labelStyle}>{children}</span>
      <span aria-hidden="true" style={lineStyle} />
    </div>
  );
}
