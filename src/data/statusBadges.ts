export type PrintPilotBadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "neutral";

export function getPrintPilotStatusBadgeVariant(
  status: string | undefined | null,
): PrintPilotBadgeVariant {
  switch (status) {
    case "Aktiv":
    case "Auf Lager":
    case "Angenommen":
    case "Fertig":
    case "Freigabe erteilt":
      return "success";

    case "Offen":
    case "Optional":
    case "Entwurf":
    case "Wartet":
    case "Wartung":
    case "Knapp":
    case "In Produktion":
    case "Korrektur angefordert":
      return "warning";

    case "Abgelehnt":
    case "Bestellen":
    case "Freigabe ausstehend":
    case "Daten unvollständig":
      return "danger";

    case "Archiv":
    case "Inaktiv":
    case "Interessent":
    case "Nicht erforderlich":
    default:
      return "neutral";
  }
}
