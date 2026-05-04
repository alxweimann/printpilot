export type NavigationItem = {
  id: string;
  label: string;
  group: "overview" | "sales" | "masterdata" | "system";
};

export const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    group: "overview",
  },

  {
    id: "calculation",
    label: "Kalkulation",
    group: "sales",
  },
  {
    id: "quotes",
    label: "Angebote",
    group: "sales",
  },
  {
    id: "orders",
    label: "Aufträge",
    group: "sales",
  },
  {
    id: "invoices",
    label: "Rechnungen",
    group: "sales",
  },
  {
    id: "delivery-notes",
    label: "Lieferscheine",
    group: "sales",
  },
  {
    id: "reminders",
    label: "Mahnungen",
    group: "sales",
  },

  {
    id: "customers",
    label: "Kunden",
    group: "masterdata",
  },
  {
    id: "material",
    label: "Material",
    group: "masterdata",
  },
  {
    id: "machines",
    label: "Maschinen",
    group: "masterdata",
  },
  {
    id: "finishing",
    label: "Weiterverarbeitung",
    group: "masterdata",
  },
  {
    id: "services",
    label: "Leistungen",
    group: "masterdata",
  },
  {
    id: "templates",
    label: "Vorlagen",
    group: "masterdata",
  },

  {
    id: "settings",
    label: "Einstellungen",
    group: "system",
  },
];

export const navigationGroups = [
  {
    id: "overview",
    label: "Übersicht",
  },
  {
    id: "sales",
    label: "Verkauf",
  },
  {
    id: "masterdata",
    label: "Stammdaten",
  },
  {
    id: "system",
    label: "System",
  },
] as const;