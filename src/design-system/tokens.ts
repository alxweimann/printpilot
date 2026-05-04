export const colors = {
  background: "#F3F4F6",
  surface: "#FFFFFF",
  surfaceMuted: "#F8FAFC",
  border: "#D9DEE7",

  sidebar: "#101827",
  sidebarSoft: "#162033",
  sidebarActive: "#22304A",

  text: "#111827",
  textMuted: "#6B7280",
  textLight: "#E5E7EB",

  cyan: "#00AEEF",
  magenta: "#EC008C",
  yellow: "#FFD200",

  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#DC2626",
  info: "#0284C7",
} as const;

export const radii = {
  small: "6px",
  medium: "8px",
  large: "12px",
} as const;

export const typography = {
  pageTitle: {
    fontSize: "22px",
    fontWeight: 700,
  },
  sectionTitle: {
    fontSize: "13px",
    fontWeight: 700,
  },
  label: {
    fontSize: "12px",
    fontWeight: 600,
  },
  body: {
    fontSize: "13px",
    fontWeight: 400,
  },
} as const;
