export type PrintPilotPatternCategory =
  | "layout"
  | "card"
  | "status"
  | "timeline"
  | "production"
  | "media"
  | "list"
  | "drawer";

export type PrintPilotPattern = {
  id: string;
  category: PrintPilotPatternCategory;
  name: string;
  purpose: string;
  reference: string;
  classNames: string[];
  reuseFor: string[];
};

export const printPilotUiPatterns: PrintPilotPattern[] = [
  {
    id: "orders-overview-list",
    category: "list",
    name: "Aufträge-Übersichtsliste",
    purpose:
      "Beruhigt die Aufträge-Übersicht zu einer kompakten Produktionsliste: dezente Druckdatei-Preview, reduzierte Status-Badges, Meta-Zeile für Termin/Maschine/Auflage/Verantwortlichkeit und direkter Kartenklick in die Auftragstasche.",
    reference: "Aufträge · Übersicht",
    classNames: [
      "pp-orders-overview",
      "pp-orders-master-header",
      "pp-header-overview-status",
      "pp-orders-workbench",
      "pp-order-row-card",
      "pp-order-meta-line",
      "pp-orders-meta-item",
      "pp-order-specs",
      "pp-order-row-card--clickable",
      "pp-order-row-card--quiet",
      "pp-order-preview",
      "pp-pocket-route-toolbar",
    ],
    reuseFor: [
      "Aufträge",
      "Produktionsplanung",
      "Kundenaufträge",
      "Druckdatei-Previews",
      "Auftragstaschen-Einstiege",
      "Kartenklick-Navigation",
      "Rücknavigation",
    ],
  },


  {
    id: "orders-overview-quiet-list",
    category: "list",
    name: "Beruhigte Aufträge-Übersicht",
    purpose:
      "Reduziert die visuelle Last der Auftragsübersicht: weniger Farbsignale, keine wiederholten Öffnen-Hinweise, keine großen Meta-Kacheln, stattdessen kompakte Meta-Zeile und dezente Preview. Die Karte bleibt die primäre Navigation zur Auftragstasche.",
    reference: "Aufträge · Übersicht",
    classNames: [
      "pp-orders-overview--quiet",
      "pp-orders-master-header--quiet",
      "pp-orders-summary--quiet",
      "pp-orders-workbench--quiet",
      "pp-order-row-card--quiet",
      "pp-order-meta-line",
      "pp-orders-meta-item",
    ],
    reuseFor: [
      "Aufträge",
      "Produktionscockpit",
      "Listenansichten",
      "Druckdatei-Previews",
      "Statusreduzierung",
    ],
  },

  {
    id: "orders-overview-master-header",
    category: "layout",
    name: "Aufträge-Übersicht Header",
    purpose:
      "Verwendet den Auftragstaschen-Master-Header für die Aufträge-Übersicht, damit Übersicht und Auftragstasche dieselbe visuelle Hierarchie haben. Der Titel wechselt auf Aufträge-Übersicht, während Kennzahlen und Status-Hinweise die Produktionscockpit-Rolle erklären.",
    reference: "Aufträge · Übersicht",
    classNames: [
      "pp-master-header",
      "pp-orders-master-header",
      "pp-header-brand",
      "pp-header-title-shape",
      "pp-header-job--overview",
      "pp-header-overview-status",
    ],
    reuseFor: [
      "Aufträge",
      "Produktionscockpit",
      "Modul-Header",
      "Übersichtsseiten",
    ],
  },

  {
    id: "order-file-preview",
    category: "media",
    name: "Druckdatei-Preview in Listen",
    purpose:
      "Zeigt in produktionsnahen Listen eine kompakte Vorschau der Druckdatei als stilisierten Papierbogen mit Dateiname, Preview-Status und technischem Kurzkontext. Echte PDF-/Bild-Previews können später an diese Struktur angebunden werden.",
    reference: "Aufträge · Übersicht",
    classNames: [
      "pp-order-preview",
      "pp-order-preview__sheet",
      "pp-order-preview__art",
      "pp-order-preview__caption",
    ],
    reuseFor: [
      "Aufträge",
      "Druckdaten",
      "Freigabeansicht",
      "Produktionscockpit",
      "Dateilisten",
    ],
  },


  {
    id: "orders-overview-real-preview-assets",
    category: "production",
    name: "Echte Preview-Bilddaten in Auftragskarten",
    purpose:
      "Ersetzt generische CSS-Platzhalter durch konkrete eingebundene SVG-Preview-Assets pro Auftrag. Die Aufträge-Übersicht wirkt dadurch druckdateinah, ohne die ruhige Produktionslisten-Optik aufzugeben.",
    reference: "Aufträge · Produktionscockpit · Sprint 41.3",
    classNames: [
      "pp-order-preview",
      "pp-order-preview__sheet",
      "pp-order-preview__image",
      "pp-order-preview__caption",
    ],
    reuseFor: [
      "Aufträge",
      "Druckdatei-Previews",
      "PDF-Thumbnail-Vorbereitung",
      "Produktionslisten",
    ],
  },

  {
    id: "orders-overview-photoreal-preview-assets",
    category: "media",
    name: "Fotorealistische Druckdatei-Previews",
    purpose:
      "Nutzt gerenderte PNG-Demo-Previews mit Papierfläche, Schatten, Motivflächen und drucknaher Anmutung. Die Meta-Zeile bleibt bewusst typografisch: ohne Icons, mit feinen senkrechten Trennern zwischen Termin, Maschine, Auflage und Verantwortlichkeit.",
    reference: "Aufträge · Produktionscockpit · Sprint 41.4",
    classNames: [
      "pp-order-preview",
      "pp-order-preview__sheet",
      "pp-order-preview__image",
      "pp-order-preview__caption",
      "pp-order-meta-line",
      "pp-orders-meta-item",
    ],
    reuseFor: [
      "Aufträge",
      "PDF-Thumbnail-Vorbereitung",
      "Druckdatei-Previews",
      "Produktionslisten",
      "Meta-Zeilen",
    ],
  },


  {
    id: "orders-overview-meta-baseline",
    category: "list",
    name: "Aufträge-Übersicht Meta-Zeile Grundlinie",
    purpose:
      "Richtet Label und Wert der Produktions-Meta-Zeile auf einer gemeinsamen typografischen Höhe aus und trennt Termin, Maschine, Auflage und Verantwortlichkeit mit feinen senkrechten Linien.",
    reference: "Aufträge · Produktionscockpit · Sprint 41.5",
    classNames: ["pp-order-meta-line", "pp-orders-meta-item"],
    reuseFor: [
      "Auftragslisten",
      "Produktionscockpits",
      "Terminlisten",
      "Maschinenplanung",
    ],
  },

  {
    id: "selected-order-state",
    category: "production",
    name: "Ausgewählter Auftrag als UI-State",
    purpose:
      "Verbindet die Aufträge-Übersicht mit der Auftragstasche: Der Kartenklick setzt den aktiven Auftrag im App-State und übergibt dieselben Demo-Daten an die Auftragstasche. Das bereitet echtes Routing, Persistenz und spätere Datenbankanbindung vor.",
    reference: "Aufträge · Übersicht → Auftragstasche",
    classNames: [
      "pp-order-row-card--clickable",
      "pp-pocket-route-shell",
      "pp-pocket-route-toolbar",
      "pp-order-pocket",
    ],
    reuseFor: [
      "Aufträge",
      "Auftragstaschen",
      "Detailansichten",
      "Router-Vorbereitung",
      "Datenübergabe",
    ],
  },
  {
    id: "bottom-navigation-safe-area",
    category: "layout",
    name: "Bottom-Navigation Sicherheitsabstand",
    purpose:
      "Zentraler Layout-Abstand für feste Bottom-Navigation, damit Scroll-Inhalte in Übersichten und Detailseiten nicht verdeckt werden.",
    reference: "AppShell · Bottom Navigation",
    classNames: [
      "pp-main",
      "pp-main--console",
      "pp-bottom-nav",
      "pp-orders-overview",
      "pp-order-pocket",
      "pp-pocket-route-shell",
    ],
    reuseFor: [
      "Alle Module mit Bottom-Navigation",
      "Aufträge",
      "Auftragstasche",
      "Mobile Ansichten",
    ],
  },
  {
    id: "order-pocket-header",
    category: "layout",
    name: "Auftragstaschen-Header",
    purpose:
      "Führt Logo, Dokumenttyp, Auftragsnummer und QR-Code in einer klaren Produktionskopfzeile zusammen.",
    reference: "Auftragstasche · Header",
    classNames: [
      "pp-pocket-header",
      "pp-pocket-brand",
      "pp-pocket-title",
      "pp-pocket-job",
      "pp-pocket-qr",
    ],
    reuseFor: ["Auftragstaschen", "Lieferscheine", "Produktionsbegleitkarten"],
  },
  {
    id: "technical-panel",
    category: "card",
    name: "Technische Karte",
    purpose:
      "Standardkarte für produktionsnahe Informationen mit Icon-Kachel, Titel, ruhigem Rahmen und kompaktem Inhalt.",
    reference: "Produkt, Druckdaten, Termine, Nutzenplan, Vorschau, Dateien",
    classNames: [
      "pp-panel",
      "pp-panel__header",
      "pp-panel__icon",
      "pp-panel__title",
    ],
    reuseFor: [
      "Aufträge",
      "Maschinen",
      "Material",
      "Produktion",
      "Kunden-Details",
    ],
  },
  {
    id: "status-pill",
    category: "status",
    name: "Status-Pill / Badge",
    purpose:
      "Kantiger, kompakter Statusindikator mit reduziertem Schriftgewicht und klaren Tönen.",
    reference: "Statuslauf, Weiterverarbeitung, Checkliste, Druckdaten",
    classNames: [
      "pp-pill",
      "pp-status-step",
      "pp-mini-status",
      "pp-check-status",
    ],
    reuseFor: [
      "Freigabe",
      "Preflight",
      "Produktion",
      "Weiterverarbeitung",
      "Lieferstatus",
    ],
  },
  {
    id: "timeline",
    category: "timeline",
    name: "Timeline",
    purpose:
      "Vertikale Ereignisdarstellung für Termine, Notizen und Verlauf ohne tabellarische Enge.",
    reference: "Termine, Notizen, Kommentare / Verlauf",
    classNames: [
      "pp-schedule-timeline",
      "pp-note-timeline",
      "pp-history-timeline",
    ],
    reuseFor: [
      "Auftragsverlauf",
      "Kundenkommunikation",
      "Produktionsplanung",
      "Systemlog",
    ],
  },
  {
    id: "checklist",
    category: "production",
    name: "Produktions-Checkliste",
    purpose:
      "Gliedert prüfbare Produktionsschritte in Abschnitte mit erledigt/offen/Pflichtpunkt-Logik.",
    reference: "Produktions-Checkliste",
    classNames: ["pp-checklist-section", "pp-checklist-item", "pp-check-box"],
    reuseFor: [
      "Druckfreigabe",
      "Maschinenrüsten",
      "Weiterverarbeitung",
      "Versandprüfung",
    ],
  },
  {
    id: "imposition-sheet",
    category: "production",
    name: "Nutzenplan / Druckbogen",
    purpose:
      "Zeigt Ausschieß- und Nutzeninformationen proportional zum realistischen Druckbogenformat.",
    reference: "Nutzenplan · SRA3 450 × 320 mm",
    classNames: [
      "pp-imposition-sheet",
      "pp-imposition-page",
      "pp-imposition-stats",
    ],
    reuseFor: [
      "Kalkulation",
      "Druckbogen-Erzeugung",
      "Auftragstaschen",
      "Ausschießen",
    ],
  },
  {
    id: "machine-card",
    category: "media",
    name: "Maschinenkarte",
    purpose:
      "Kombiniert Maschinenbild/Fallback-Illustration, Status und technische Merkmale responsiv.",
    reference: "Maschine",
    classNames: ["pp-machine-card", "pp-machine-visual", "pp-machine-content"],
    reuseFor: [
      "Maschinenmodul",
      "Produktionsplanung",
      "Kalkulation",
      "Wartung",
    ],
  },
  {
    id: "preview-card",
    category: "media",
    name: "PDF-/Druckvorschau",
    purpose:
      "Stellt Druckdateien als Papierbogen mit Beschnitt-, Schnittmarken- und Dateikontext dar.",
    reference: "Vorschau",
    classNames: ["pp-preview-card", "pp-preview-paper", "pp-preview-specs"],
    reuseFor: [
      "Druckdaten",
      "Freigabeansicht",
      "Angebotsvorschau",
      "PDF-Prüfung",
    ],
  },
  {
    id: "order-pocket-preview-assets",
    category: "media",
    name: "Auftragstaschen-Preview mit echten Bilddaten",
    purpose:
      "Verwendet dieselben fotorealistischen Preview-Assets aus der Aufträge-Übersicht in Produkt- und Vorschaukarte der Auftragstasche. Die Vorschau wird größer, kontrastreicher und als Druckdatei-Thumbnail statt als statisches Demo-Motiv dargestellt.",
    reference: "Auftragstasche · Sprint 42.1",
    classNames: [
      "pp-product-preview",
      "pp-preview-card--asset",
      "pp-preview-stage--asset",
      "pp-preview-asset-frame",
      "pp-imposition-card--business-card",
      "pp-imposition-card--poster",
      "pp-imposition-card--sticker",
    ],
    reuseFor: [
      "Auftragstaschen",
      "Druckdaten",
      "PDF-Thumbnail-Vorbereitung",
      "Produktkarten",
      "Vorschaukarten",
      "Nutzenplan-Vorbereitung",
    ],
  },
  {
    id: "order-pocket-preview-contain-scaling",
    category: "media",
    name: "Auftragstaschen-Preview ohne Cropping",
    purpose:
      "Skaliert Produkt- und Vorschau-Previews in der Auftragstasche mit contain-Logik, damit Druckdatei-Thumbnails vollständig sichtbar bleiben und nicht als schmale Streifen oder gecroppte Ausschnitte erscheinen.",
    reference: "Auftragstasche · Sprint 42.2",
    classNames: [
      "pp-product-hero--with-preview",
      "pp-product-preview",
      "pp-preview-stage--asset",
      "pp-preview-asset-frame",
      "pp-preview-meta",
    ],
    reuseFor: [
      "Auftragstaschen",
      "Druckdatei-Vorschau",
      "PDF-Thumbnail-Vorbereitung",
      "Produktkarten",
      "Vorschaukarten",
    ],
  },



  {
    id: "order-pocket-layout-balance",
    category: "production",
    name: "Auftragstasche Layout-Balance",
    purpose:
      "Balanciert die Auftragstaschen-Karten ohne neue Fachlogik: kompaktere Panelhöhen, dynamische Checkliste/Weiterverarbeitung/Verlauf aus Auftragsdaten und ruhigere Kartenverteilung für Produkt, Druckdaten, Termine, Vorschau und Nutzenplan.",
    reference: "Auftragstasche · Sprint 42.3",
    classNames: [
      "pp-pocket-grid",
      "pp-product-panel",
      "pp-printdata-panel",
      "pp-imposition-panel",
      "pp-preview-panel",
      "pp-finishing-panel",
      "pp-checklist-panel",
      "pp-finishing-list",
    ],
    reuseFor: [
      "Auftragstaschen",
      "Produktionsdetails",
      "Druckdaten-Ansichten",
      "Checklisten",
      "Weiterverarbeitung",
    ],
  },

  {
    id: "order-pocket-local-actions",
    category: "production",
    name: "Auftragstasche lokale Aktionen",
    purpose:
      "Bereitet klickbare Auftragstaschen-Aktionen ohne Persistenz vor: Statusänderung, Datenprüfung, Freigabe, Checklistenpunkte und Weiterverarbeitungsschritte reagieren lokal im UI und sind später an Speicherung oder Datenbank anschließbar.",
    reference: "Auftragstasche · Sprint 43",
    classNames: [
      "pp-pocket-actionbar",
      "pp-pocket-actionbar__buttons",
      "pp-check-item",
      "pp-finishing-status-button",
      "pp-status-flow",
    ],
    reuseFor: [
      "Auftragstaschen",
      "Statusänderungen",
      "Produktions-Checklisten",
      "Weiterverarbeitung",
      "Freigabe-Workflows",
    ],
  },

  {
    id: "order-pocket-compact-actions",
    category: "production",
    name: "Auftragstasche kompakte Aktionen",
    purpose:
      "Beruhigt die lokalen Auftragstaschen-Aktionen aus Sprint 43: Schnellaktionen werden als kompakte Buttons statt großer Karten geführt, Zurücksetzen wird sekundär und Checklisten-Zeilen bleiben anklickbar, aber visuell leichter.",
    reference: "Auftragstasche · Sprint 43.1",
    classNames: [
      "pp-pocket-actionbar",
      "pp-pocket-actionbar__intro",
      "pp-pocket-actionbar__buttons",
      "pp-pocket-actionbar__ghost",
      "pp-check-item",
      "pp-checklist-summary",
    ],
    reuseFor: [
      "Auftragstaschen",
      "Schnellaktionen",
      "Lokaler UI-State",
      "Produktions-Checklisten",
      "Interaktionsleisten",
    ],
  },

  {
    id: "order-pocket-action-chain",
    category: "production",
    name: "Auftragstasche Schnellaktionen als Statuskette",
    purpose:
      "Stellt lokale Auftragstaschen-Schnellaktionen im Duktus der Statusübersicht dar: rechteckige Statusflächen mit Trennern statt Pill-Buttons sowie deutlich kompaktere Checklisten-Typografie für Produktionslisten.",
    reference: "Auftragstasche · Sprint 43.2",
    classNames: [
      "pp-pocket-actionbar",
      "pp-pocket-actionbar__controls",
      "pp-pocket-actionbar__chain",
      "pp-pocket-chain-button",
      "pp-pocket-actionbar__reset",
      "pp-check-item",
      "pp-check-label",
    ],
    reuseFor: [
      "Auftragstaschen",
      "Schnellaktionen",
      "Statusketten",
      "Produktions-Checklisten",
      "Lokaler UI-State",
    ],
  },

];

export const printPilotReferenceScreen = {
  id: "order-pocket-reference",
  name: "Auftragstasche",
  route: "/auftragstasche",
  status: "design-reference",
  description:
    "Die Auftragstasche ist die visuelle Referenz für zukünftige PrintPilot-Module und bündelt die wichtigsten UI-Patterns.",
  patterns: printPilotUiPatterns.map((pattern) => pattern.id),
} as const;
