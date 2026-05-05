import type { ReactNode } from "react";

type BadgeVariant = "muted" | "success" | "info" | "warning" | "danger" | "purple";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
};

function getTextFromChildren(children: ReactNode) {
  if (typeof children === "string") {
    return children;
  }

  if (typeof children === "number") {
    return String(children);
  }

  return "";
}

function getVariantFromStatus(status: string): BadgeVariant {
  const normalizedStatus = status.trim().toLowerCase();

  if (
    normalizedStatus.includes("aktiv") ||
    normalizedStatus.includes("angenommen") ||
    normalizedStatus.includes("bezahlt") ||
    normalizedStatus.includes("erledigt") ||
    normalizedStatus.includes("abgeschlossen") ||
    normalizedStatus.includes("geliefert") ||
    normalizedStatus.includes("freigegeben")
  ) {
    return "success";
  }

  if (
    normalizedStatus.includes("offen") ||
    normalizedStatus.includes("liste") ||
    normalizedStatus.includes("lokal")
  ) {
    return "info";
  }

  if (
    normalizedStatus.includes("entwurf") ||
    normalizedStatus.includes("vorbereitung") ||
    normalizedStatus.includes("in prüfung") ||
    normalizedStatus.includes("prüfen")
  ) {
    return "muted";
  }

  if (
    normalizedStatus.includes("produktion") ||
    normalizedStatus.includes("weiterverarbeitung")
  ) {
    return "purple";
  }

  if (
    normalizedStatus.includes("versandbereit") ||
    normalizedStatus.includes("wartung") ||
    normalizedStatus.includes("stufe") ||
    normalizedStatus.includes("versendet")
  ) {
    return "warning";
  }

  if (
    normalizedStatus.includes("abgelehnt") ||
    normalizedStatus.includes("überfällig") ||
    normalizedStatus.includes("gesperrt") ||
    normalizedStatus.includes("fehlt") ||
    normalizedStatus.includes("korrektur")
  ) {
    return "danger";
  }

  return "muted";
}

export function Badge({ children, variant }: BadgeProps) {
  const statusText = getTextFromChildren(children);
  const resolvedVariant = variant ?? getVariantFromStatus(statusText);

  return <span className={`badge badge-${resolvedVariant}`}>{children}</span>;
}
