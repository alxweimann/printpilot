export type ModuleGroup = "overview" | "sales" | "masterdata" | "system";

export type ModuleConfig = {
  id: string;
  label: string;
  title: string;
  description: string;
  group: ModuleGroup;
  accentColor: string;
  actionLabel?: string;
  tabs?: string[];
};

export const moduleConfig: Record<string, ModuleConfig> = {
  dashboard: {
    id: "dashboard",
    label: "Dashboard",
    title: "Dashboard",
    description:
      "Startbereich für PrintPilot. Später mit Kennzahlen, offenen Vorgängen und Schnellzugriffen.",
    group: "overview",
    accentColor: "#64748B",
  },

  calculation: {
    id: "calculation",
    label: "Kalkulation",
    title: "Kalkulation",
    description:
      "Aktive Kalkulationsseite für Digitaldruck-Bogenware. Großformatdruck und weitere Module folgen.",
    group: "sales",
    accentColor: "#00AEEF",
    actionLabel: "Neue Kalkulation",
    tabs: ["Eingabe", "Positionen", "Kalkulation", "Übersicht", "Ausgabe"],
  },

  quotes: {
    id: "quotes",
    label: "Angebote",
    title: "Angebote",
    description:
      "Angebotsübersicht und Angebotsbearbeitung werden später aufgebaut.",
    group: "sales",
    accentColor: "#16A34A",
    actionLabel: "Neues Angebot",
    tabs: ["Liste", "Entwurf", "Positionen", "Vorschau", "Ausgabe"],
  },

  orders: {
    id: "orders",
    label: "Aufträge",
    title: "Aufträge",
    description:
      "Auftragsverwaltung wird später aus Angeboten und Kalkulationen entstehen.",
    group: "sales",
    accentColor: "#7C3AED",
    actionLabel: "Neuer Auftrag",
    tabs: ["Liste", "Produktion", "Status", "Dokumente"],
  },

  invoices: {
    id: "invoices",
    label: "Rechnungen",
    title: "Rechnungen",
    description:
      "Rechnungen werden später sauber mit Zahlstatus und Folgeprozessen aufgebaut.",
    group: "sales",
    accentColor: "#2563EB",
    actionLabel: "Neue Rechnung",
    tabs: ["Liste", "Offen", "Bezahlt", "Ausgabe"],
  },

  "delivery-notes": {
    id: "delivery-notes",
    label: "Lieferscheine",
    title: "Lieferscheine",
    description:
      "Lieferscheine werden später als eigener Verkaufsprozess ergänzt.",
    group: "sales",
    accentColor: "#F97316",
    actionLabel: "Neuer Lieferschein",
    tabs: ["Liste", "Positionen", "Versand", "Ausgabe"],
  },

  reminders: {
    id: "reminders",
    label: "Mahnungen",
    title: "Mahnungen",
    description:
      "Mahnungen werden später erst nach sauberer Rechnungslogik umgesetzt.",
    group: "sales",
    accentColor: "#DC2626",
    actionLabel: "Neue Mahnung",
    tabs: ["Liste", "Offen", "Stufen", "Ausgabe"],
  },

  customers: {
    id: "customers",
    label: "Kunden",
    title: "Kunden",
    description:
      "Kundenstammdaten als kompakte Listenansicht. Noch ohne Speicherung.",
    group: "masterdata",
    accentColor: "#0891B2",
    actionLabel: "Neuer Kunde",
    tabs: ["Liste", "Details", "Kontakte", "Historie"],
  },

  material: {
    id: "material",
    label: "Material",
    title: "Material",
    description:
      "Materialstammdaten für Papier, Formate, Preise und Lager werden später aufgebaut.",
    group: "masterdata",
    accentColor: "#CA8A04",
    actionLabel: "Neues Material",
    tabs: ["Liste", "Papier", "Preise", "Lager"],
  },

  machines: {
    id: "machines",
    label: "Maschinen",
    title: "Maschinen",
    description:
      "Maschinenstammdaten werden später für Druckkosten und Produktionslogik genutzt.",
    group: "masterdata",
    accentColor: "#475569",
    actionLabel: "Neue Maschine",
    tabs: ["Liste", "Druck", "Kosten", "Parameter"],
  },

  finishing: {
    id: "finishing",
    label: "Weiterverarbeitung",
    title: "Weiterverarbeitung",
    description:
      "Schneiden, Falzen, Rillen, Heften und weitere Prozesse werden später ergänzt.",
    group: "masterdata",
    accentColor: "#EC008C",
    actionLabel: "Neuer Prozess",
    tabs: ["Liste", "Prozesse", "Kosten", "Parameter"],
  },

  services: {
    id: "services",
    label: "Leistungen",
    title: "Leistungen",
    description: "Freie Leistungen und Zuschläge werden später gepflegt.",
    group: "masterdata",
    accentColor: "#9333EA",
    actionLabel: "Neue Leistung",
    tabs: ["Liste", "Preise", "Gruppen"],
  },

  templates: {
    id: "templates",
    label: "Vorlagen",
    title: "Vorlagen",
    description:
      "Vorlagen für Produkte, Angebote und Dokumente werden später aufgebaut.",
    group: "masterdata",
    accentColor: "#6B7280",
    actionLabel: "Neue Vorlage",
    tabs: ["Produkte", "Dokumente", "Texte", "Layouts"],
  },

  settings: {
    id: "settings",
    label: "Einstellungen",
    title: "Einstellungen",
    description: "Globale Einstellungen für PrintPilot werden später ergänzt.",
    group: "system",
    accentColor: "#94A3B8",
    tabs: ["Allgemein", "Nummernkreise", "Firma", "System"],
  },
};

export const moduleOrder = [
  "dashboard",
  "calculation",
  "quotes",
  "orders",
  "invoices",
  "delivery-notes",
  "reminders",
  "customers",
  "material",
  "machines",
  "finishing",
  "services",
  "templates",
  "settings",
];

export function getModuleConfig(moduleId: string) {
  return moduleConfig[moduleId] ?? moduleConfig.dashboard;
}
