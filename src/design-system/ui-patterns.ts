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
    id: "order-pocket-process-language",
    category: "production",
    name: "Auftragstasche Prozesskette und aktueller Status",
    purpose:
      "Trennt den aktuellen Auftragsstatus sprachlich von den festen Prozessphasen. Daten, Freigabe, Druck, Weiterverarbeitung und Versand werden als Prozesskette geführt, während der aktuelle Status separat als Aktuell-Wert sichtbar bleibt.",
    reference: "Auftragstasche · Sprint 43.3",
    classNames: [
      "pp-status-overview--process",
      "pp-status-current",
      "pp-process-flow",
      "pp-process-step",
      "pp-pocket-actionbar--process",
    ],
    reuseFor: [
      "Auftragstaschen",
      "Prozessketten",
      "Statuslogik",
      "Schnellaktionen",
      "Produktionsphasen",
    ],
  },

  {
    id: "order-pocket-action-workbar",
    category: "production",
    name: "Auftragstasche Schnellaktionen als Arbeitsleiste",
    purpose:
      "Führt lokale Auftragstaschen-Aktionen als kompakte Arbeitsleiste statt als zweite Prozesskette. Daten prüfen, Freigabe erteilen, Status weiter und Zurücksetzen bleiben klar klickbar, während die Checkliste typografisch weiter verdichtet wird.",
    reference: "Auftragstasche · Sprint 43.4",
    classNames: [
      "pp-pocket-actionbar--workbench",
      "pp-pocket-actionbar__actions",
      "pp-action-button",
      "pp-check-item",
      "pp-check-label",
    ],
    reuseFor: [
      "Auftragstaschen",
      "Schnellaktionen",
      "Arbeitsleisten",
      "Produktions-Checklisten",
      "Lokaler UI-State",
    ],
  },

  {
    id: "order-pocket-workbar-final",
    category: "production",
    name: "Auftragstasche finale Arbeitsleiste",
    purpose:
      "Finalisiert die lokalen Schnellaktionen als ruhige Arbeitsleiste mit einzeiligen, besser lesbaren Aktionsbuttons und weiter verdichteter Produktions-Checkliste. Der UI-State bleibt lokal und nicht persistent.",
    reference: "Auftragstasche · Sprint 43.5",
    classNames: [
      "pp-pocket-actionbar--workbench",
      "pp-pocket-actionbar__actions",
      "pp-action-button",
      "pp-check-item",
      "pp-check-label",
    ],
    reuseFor: [
      "Auftragstaschen",
      "Arbeitsleisten",
      "Lokaler UI-State",
      "Produktions-Checklisten",
      "Schnellaktionen",
    ],
  },

  {
    id: "order-pocket-zone-equal-heights",
    category: "layout",
    name: "Auftragstasche Zonen mit harmonisierten Kartenhöhen",
    purpose:
      "Gliedert die Auftragstasche in Auftragsdaten, Produktion und Auftragsbegleitung und harmonisiert die Kartenhöhen innerhalb jeder Zone. Dadurch bleiben Produkt, Druckdaten, Termine, Checkliste sowie Produktions- und Begleitmodule ruhiger ausgerichtet, ohne Inhalte zu verzerren.",
    reference: "Auftragstasche · Sprint 43.6",
    classNames: [
      "pp-pocket-zones",
      "pp-pocket-zone",
      "pp-pocket-zone__header",
      "pp-pocket-zone-grid",
      "pp-pocket-zone-grid--overview",
      "pp-pocket-zone-grid--production",
      "pp-pocket-zone-grid--support",
    ],
    reuseFor: [
      "Auftragstaschen",
      "Produktionszonen",
      "Kartenraster",
      "Grid-Balance",
      "gleichmäßige Kartenhöhen",
    ],
  },

  {
    id: "order-pocket-interactive-process-bar",
    category: "production",
    name: "Auftragstasche interaktive Prozessleiste",
    purpose:
      "Entfernt die redundante Schnellaktionsleiste und macht die zentrale Prozessleiste der Auftragstasche direkt bedienbar. Daten, Freigabe, Druck und Weiterverarbeitung können lokal über die Statusleiste geändert werden; Zurücksetzen bleibt als dezente Sekundäraktion erhalten.",
    reference: "Auftragstasche · Sprint 43.7",
    classNames: [
      "pp-status-overview--interactive",
      "pp-process-flow",
      "pp-process-step",
      "pp-status-current--with-reset",
    ],
    reuseFor: [
      "Auftragstaschen",
      "interaktive Statusleisten",
      "Prozessketten",
      "Lokaler UI-State",
      "Produktionsstatus",
    ],
  },

  {
    id: "central-order-ui-state",
    category: "production",
    name: "Zentraler Auftrags-UI-State",
    purpose:
      "Hält lokale Auftragstaschen-Änderungen in App.tsx zentral, damit Datenprüfung, Freigabe, Produktionsstatus, Checkliste und Weiterverarbeitung nach der Rückkehr in der Aufträge-Übersicht sichtbar bleiben. Noch ohne Persistenz oder Backend.",
    reference: "Aufträge · Übersicht ↔ Auftragstasche · Sprint 44",
    classNames: [
      "pp-order-row-card",
      "pp-status-overview--interactive",
      "pp-process-flow",
      "pp-check-item",
      "pp-finishing-status-button",
    ],
    reuseFor: [
      "Aufträge",
      "Auftragstasche",
      "lokaler UI-State",
      "Statusänderungen",
      "Persistenz-Vorbereitung",
    ],
  },

  {
    id: "central-order-ui-state-feedback-fix",
    category: "production",
    name: "Zentraler Auftrags-State mit Rückspiegelung",
    purpose:
      "Korrigiert die Rückspiegelung lokaler Auftragstaschen-Aktionen: Die Auftragstasche liest bei zentralem App-State direkt aus dem übergebenen Auftrag und schreibt Änderungen sofort in das zentrale Orders-Array zurück. Dadurch sind Datenprüfung, Freigabe, Produktionsstatus, Checkliste und Weiterverarbeitung nach der Rückkehr in der Übersicht sichtbar.",
    reference: "Aufträge · Übersicht ↔ Auftragstasche · Sprint 44.1",
    classNames: [
      "pp-status-overview--interactive",
      "pp-process-flow",
      "pp-check-item",
      "pp-finishing-status-button",
      "pp-order-row-card",
    ],
    reuseFor: [
      "Aufträge",
      "Auftragstasche",
      "zentraler UI-State",
      "Rückspiegelung",
      "Persistenz-Vorbereitung",
    ],
  },
  {
    id: "real-pdf-preview-assets",
    category: "production",
    name: "Echte PDF-Preview-Assets",
    purpose:
      "Bindet angelieferte Kundendruckdaten als Original-PDFs und daraus gerenderte PNG-Vorschauen in die Demo-Auftragsdaten ein. Übersicht und Auftragstasche nutzen dieselbe Preview-Quelle; Original-PDF und Thumbnail sind im Datenmodell getrennt vorbereitet.",
    reference: "Aufträge · Übersicht ↔ Auftragstasche · Sprint 44.2",
    classNames: [
      "pp-order-preview",
      "pp-order-preview--letterhead",
      "pp-product-preview",
      "pp-preview-stage--asset",
      "pp-preview-asset-frame",
    ],
    reuseFor: [
      "Druckdatei-Previews",
      "PDF-Thumbnails",
      "Auftragsdaten",
      "Aufträge-Übersicht",
      "Auftragstasche",
    ],
  },

  {
    id: "unified-process-status-labels",
    category: "production",
    name: "Einheitliche Prozessstatus-Begriffe",
    purpose:
      "Vereinheitlicht die Statusbegriffe zwischen Auftragstasche und Aufträge-Übersicht. Der interne Endzustand wird als Versandbereit geführt, damit Prozessleiste, Auftragskarte und Kennzahlen denselben Begriff verwenden.",
    reference: "Aufträge · Statuslogik · Sprint 44.2",
    classNames: [
      "pp-process-flow",
      "pp-process-step",
      "pp-order-row-card",
      "pp-status-pill",
    ],
    reuseFor: [
      "Prozessketten",
      "Auftragsstatus",
      "Übersichtsbadges",
      "Kennzahlen",
    ],
  },

  {
    id: "real-file-imposition-preview",
    category: "production",
    name: "Echte Datei-Previews im Nutzenplan",
    purpose:
      "Ersetzt rein nummerierte Nutzenplan-Kacheln durch kleine Wiederholungen des echten Druckdatei-Previews. Der Nutzenplan zeigt dadurch nicht nur die Anzahl der Nutzen, sondern visuell auch das Motiv auf dem Druckbogen; Briefbogen wird als A4-Hochformat separat behandelt.",
    reference: "Auftragstasche · Nutzenplan · Sprint 44.3",
    classNames: [
      "pp-imposition-sheet",
      "pp-imposition-tile",
      "pp-imposition-card--business-card",
      "pp-imposition-card--letterhead",
      "pp-preview-stage--letterhead",
    ],
    reuseFor: [
      "Nutzenplan",
      "Druckbogen-Vorschau",
      "PDF-Previews",
      "Ausschießen",
      "Produktionsansicht",
    ],
  },

  {
    id: "finalized-imposition-preview",
    category: "production",
    name: "Finalisierte Nutzenplan-Preview",
    purpose:
      "Verfeinert die echten Druckdatei-Previews im Nutzenplan: Bogenbegrenzung, Beschnitt-/Sicherheitsrahmen, dezentere Nutzennummern und eigene Darstellungsregeln für Visitenkarten, Briefbogen, Flyer, Broschüren, Plakate und Sticker.",
    reference: "Auftragstasche · Nutzenplan · Sprint 44.4",
    classNames: [
      "pp-imposition-sheet",
      "pp-imposition-tile",
      "pp-imposition-card--business-card",
      "pp-imposition-card--letterhead",
      "pp-imposition-card--poster",
      "pp-imposition-card--sticker",
    ],
    reuseFor: [
      "Nutzenplan",
      "Druckbogen-Vorschau",
      "Beschnittdarstellung",
      "PDF-Previews",
      "Ausschieß-Vorbereitung",
    ],
  },

  {
    id: "quiet-imposition-numbering",
    category: "production",
    name: "Dezente Nutzennummern im Nutzenplan",
    purpose:
      "Nutzennummern werden bei echten Druckdatei-Previews nur als leise Orientierung am Nutzenrand gezeigt. Die Motive bleiben dominant; Nummern werden erst im Hover deutlicher.",
    reference: "Auftragstasche · Nutzenplan · Sprint 44.5",
    classNames: ["pp-imposition-use__number", "pp-imposition-use__number--quiet"],
    reuseFor: ["Nutzenplan", "Druckbogen-Vorschau", "PDF-Previews"],
  },

  {
    id: "business-card-imposition-deoverlap",
    category: "production",
    name: "Entzerrter Visitenkarten-Nutzenplan",
    purpose:
      "Visitenkarten werden im Nutzenplan als klar getrennte Einzelnutzen dargestellt. Schatten, Überlagerungswirkung und dominante Nutzennummern werden reduziert, damit die echten PDF-Previews nicht wie gestapelte Karten wirken.",
    reference: "Auftragstasche · Nutzenplan · Sprint 44.6",
    classNames: ["pp-imposition-sheet--business-card", "pp-imposition-use--flat"],
    reuseFor: ["Nutzenplan", "Visitenkarten", "Druckbogen-Vorschau"],
  },

  {
    id: "realistic-flat-imposition-sheet",
    category: "production",
    name: "Realistischer Druckbogen-Nutzenplan",
    purpose:
      "Nutzenplan zeigt echte Druckdatei-Motive flach auf einem technischen Bogen statt als UI-Kacheln mit Schatten. Schnitt-/Beschnittlinien bleiben dezent sichtbar.",
    reference: "Auftragstasche · Nutzenplan · Sprint 44.7",
    classNames: ["pp-imposition-sheet", "pp-imposition-use", "pp-imposition-use--flat"],
    reuseFor: ["Nutzenplan", "Druckbogen-Vorschau", "Ausschießen"],
  },

  {
    id: "larger-production-imposition-sheet",
    category: "production",
    name: "Größerer produktionsnaher Druckbogen",
    purpose:
      "Nutzenplan skaliert den Druckbogen stärker aus, reduziert Randabstände und entfernt technischen Hilfstext aus der Bogenfläche. Visitenkarten- und Briefbogen-Motive wirken dadurch größer und näher an einem echten Druckbogen.",
    reference: "Auftragstasche · Nutzenplan · Sprint 44.8",
    classNames: ["pp-imposition-card", "pp-imposition-sheet", "pp-imposition-sheet--large"],
    reuseFor: ["Nutzenplan", "Druckbogen-Vorschau", "Produktionsbogen"],
  },

  {
    id: "professional-print-file-data-model",
    category: "production",
    name: "Professionalisierte Druckdaten-Struktur",
    purpose:
      "Druckdaten werden fachlich getrennt in Original-PDF, Preview-Bild, Produktdaten, Nutzenplan-Parameter, Bogenformat, Nutzenformat, Beschnitt und Abstand vorbereitet. Die UI bleibt demohaft, aber die Datenstruktur ist näher an späterer Persistenz und Ausschieß-Engine.",
    reference: "Auftragstasche · Druckdaten · Sprint 45",
    classNames: ["pp-file-card", "pp-imposition-card", "pp-production-data"],
    reuseFor: ["Druckdaten", "Auftragstasche", "Ausschieß-Engine"],
  },

  {
    id: "calculation-production-contract",
    category: "production",
    name: "Schnittstelle Kalkulation zu Produktionsdaten",
    purpose:
      "Definiert den Datenvertrag, über den der Kalkulations-Nutzenrechner später Produktformat, Bogenformat, Raster, Nutzenanzahl, Beschnitt, Abstand, Bogenmenge und optionale Maschinenempfehlung an Auftragstasche und Nutzenplan übergibt.",
    reference: "Kalkulation · Produktionsdaten · Sprint 45.1",
    classNames: ["pp-calculation-contract-box", "pp-calculation-output-card"],
    reuseFor: ["Kalkulation", "Auftragstasche", "Produktionsdaten"],
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

export const sprint449Pattern = {
  id: "contained-imposition-sheet",
  sprint: "44.9",
  description:
    "Druckbogen-Vorschauen müssen vollständig sichtbar bleiben. Visitenkarten nutzen eine ruhigere 5x5-Bogenlogik mit 24 platzierten Motiven, enthaltene PDF-Previews werden per contain eingepasst statt zugeschnitten.",
};

export const sprint4410Pattern = {
  id: "business-card-imposition-24-up",
  sprint: "44.10",
  description:
    "Visitenkarten-Nutzenpläne verwenden eine vollständige 24er-Anordnung im 6x4-Druckbogenraster. Leere 5x5-Rasterplätze werden vermieden, Motive bleiben flach und nicht gestapelt.",
};

export const sprint4411Pattern = {
  id: "business-card-imposition-readable-scale",
  sprint: "44.11",
  description:
    "Visitenkarten-Nutzenpläne behalten das vollständige 6x4-Raster, nutzen die verfügbare Bogenfläche aber stärker aus. Motive werden kontrastreicher und etwas größer dargestellt, ohne Cropping am Druckbogen oder Rückkehr zur Kacheloptik.",
};

export const sprint4412Pattern = {
  id: "business-card-imposition-practical-spacing",
  sprint: "44.12",
  description:
    "Visitenkarten-Nutzenpläne behalten das vollständige 6x4-Raster, reduzieren aber horizontale und vertikale Abstände. Die Motive wirken enger und produktionstypischer auf dem SRA3-Bogen, ohne Kachel- oder Stapeloptik.",
};

export const sprint4413Pattern = {
  id: "business-card-imposition-3-5mm-spacing",
  sprint: "44.13",
  description:
    "Visitenkarten-Nutzenpläne behalten das 6x4-Raster, simulieren aber praxisnähere Zwischenräume von ca. 3–5 mm. Die Grid-Zeilen werden als geschlossener Produktionsblock geführt, damit der Bogen nicht wie eine UI-Galerie wirkt.",
};

export const sprint4414Pattern = {
  id: "imposition-technical-legend",
  sprint: "44.14",
  description:
    "Nutzenplan-Vorschauen führen technische Angaben wie Bogenformat, Nutzenformat, Beschnitt und Abstand als dezente Legende. Der Hinweis auf die schematische Produktionsvorschau wird weniger dominant platziert.",
};

export const sprint45Pattern = {
  id: "professional-print-file-data-model",
  sprint: "45",
  description:
    "Original-PDF, generiertes Preview, Produktdaten und Nutzenplan-Parameter werden in einem abgeleiteten OrderProductionData-Modell gebündelt. Bestehende UI-Felder bleiben kompatibel, aber Auftragstasche und Dateiliste lesen bevorzugt aus der neuen Struktur.",
};

export const sprint451Pattern = {
  id: "calculation-production-contract",
  sprint: "45.1",
  description:
    "Der Datenvertrag zwischen Kalkulation und Auftragstasche ist als TypeScript-Struktur vorbereitet. Der Nutzenrechner liefert später fachliche Werte; Auftragstasche und Übersicht visualisieren diese Werte ohne eigene Neuberechnung.",
};

export const sprint452Pattern = {
  id: "calculation-to-order-adapter",
  sprint: "45.2",
  description:
    "Ein Demo-Adapter bildet CalculationToProductionPayload auf OrderProductionData und einen PrintPilotOrder-Entwurf ab. Die Kalkulation bleibt fachlicher Provider; Auftragstasche und Übersicht bleiben Consumer der vorbereiteten Produktionsdaten.",
};

export const sprint46Pattern = {
  id: "calculation-module-scaffold",
  sprint: "46",
  description:
    "Das Kalkulationsmodul wird als neue UI-Fläche vorbereitet. Produktparameter, Bogenparameter, ein visueller Nutzenrechner-Ergebnisbereich und ein Demo-Übergang zur Auftragstasche nutzen den Datenvertrag aus Sprint 45.1/45.2, ohne bereits eine echte Kalkulationslogik oder Persistenz einzuführen.",
};

export const sprint461Pattern = {
  id: "navigation-domain-order",
  sprint: "46.1",
  description:
    "Die Hauptnavigation folgt der fachlichen PrintPilot-Reihenfolge: Dashboard, Kalkulation, Aufträge. Kalkulation steht damit als Angebots-/Auftragsvorstufe direkt nach dem Dashboard; die bestehende Modul-Logik bleibt unverändert.",
};

export const sprint462Pattern = {
  id: "calculation-input-mask-production-mode",
  sprint: "46.2",
  description:
    "Die Kalkulationsseite wird als klare Eingabemaske geführt. Produkt, Format, Auflage, Material, Produktionsart, Weiterverarbeitung und Ergebnis sind getrennte Arbeitsbereiche; Eigenproduktion, Fremdproduktion und Kombination werden als zentrale Produktionsart vorbereitet.",
};

export const sprint463Pattern = {
  id: "calculation-large-input-mask",
  sprint: "46.3",
  description:
    "Die Kalkulationsseite nutzt eine große zusammenhängende Formularfläche statt vieler einzelner Cards. Fachliche Abschnitte werden durch Überschriften und feine Trennlinien geführt; Ergebnis und Nutzenrechner bleiben als separate rechte Zusammenfassung erhalten.",
};

export const sprint464Pattern = {
  id: "calculation-mis-input-mask",
  sprint: "46.4",
  description:
    "Die Kalkulationsmaske wird nach MIS-typischen Pflicht-/Optionalfeldern erweitert. Kopfdaten, Produktdetails, Format, Auflage/Staffeln, Material, Produktion, detaillierte Weiterverarbeitung und Kosten werden in einer großen Eingabemaske geführt.",
};


export const sprint465Pattern = {
  id: "calculation-compact-mis-input-mask",
  sprint: "46.5",
  description:
    "Die Kalkulationsmaske wird für produktives Erfassen verdichtet. Feldhöhen, Abschnittsabstände und Pflicht-/Optionalmarkierungen werden reduziert; die Weiterverarbeitung wird als tabellarische MIS-Matrix mit Leistung, Aktiv, Parametern, Menge und Produktionsweg geführt.",
};


export const sprint466Pattern = {
  id: "calculation-full-width-input-results-below",
  sprint: "46.6",
  description:
    "Die Kalkulation nutzt die komplette Inhaltsbreite für die Eingabemaske. Ergebnis, Nutzenrechner und Datenvertrag stehen kompakt unterhalb der Maske, damit die Formulareingabe nicht seitlich eingeengt wird.",
};

export const sprint467Pattern = {
  id: "calculation-readable-compact-mask",
  sprint: "46.7",
  description:
    "Die volle Kalkulationsmaske bleibt produktiv verdichtet, wird aber lesbarer: Feldtexte, Tabellenwerte, Abschnittsüberschriften und Ergebniszone werden größer gesetzt, ohne zur aufgeblasenen Card-Optik zurückzukehren. Zusätzlich werden ältere Pattern-Einträge typkonform repariert.",
};

export const sprint468Pattern = {
  id: "calculation-oldschool-mis-look",
  sprint: "46.8",
  description:
    "Die Kalkulationsseite erhält einen eigenständigen Oldschool-MIS-Look: flachere Rahmen, graue Abschnittsbalken, tabellarische Feldblöcke, weniger Rundungen und keine Card-/Dashboard-Anmutung. Auftragstasche und Auftragsübersicht bleiben davon unberührt.",
};

export const sprint469Pattern = {
  id: "calculation-oldschool-readable-mask",
  sprint: "46.9",
  description:
    "Der Oldschool-MIS-Look der Kalkulation wird lesbarer abgestimmt: größere Feldwerte, ruhigere Labels, höhere Tabellenzeilen, dezente Pflicht-Badges und mehr Abstand zur unteren Navigation, ohne zurück zur Card-Optik zu wechseln.",
};

export const sprint4610Pattern = {
  id: "calculation-workspace-calm-results-zone",
  sprint: "46.10",
  description:
    "Die Kalkulationsarbeitsfläche wird beruhigt: Die Eingabemaske erhält mehr Abstand zum Header und zur unteren Navigation, die Bottom-Navigation wird im Kalkulationskontext kompakter und die Auswertung unten wird mit breiterem Nutzenplan, klareren Produktionsdaten und kleinerem technischem Datenvertrag ausbalanciert.",
};

export const sprint4611Pattern = {
  id: "calculation-bottom-nav-consistent-with-orders",
  sprint: "46.11",
  description:
    "Die Bottom-Navigation wird in der Kalkulation wieder konsistent wie in der Auftragsübersicht behandelt. Die kalkulationsspezifische Kompakt-Navigation entfällt; stattdessen erhält die scrollbar bleibende Kalkulationsseite ausreichend unteren Sicherheitsabstand.",
};

export const sprint4612Pattern = {
  id: "calculation-editable-local-state-mask",
  sprint: "46.12",
  description:
    "Die Kalkulationsmaske bleibt im Oldschool-MIS-Look, wird aber funktional editierbar. Produkt, Format, Auflage, Material, Produktionsart, Weiterverarbeitung und Ergebnisvorgaben liegen in lokalem State; der Auftrag-Entwurf nutzt die aktuellen Maskenwerte statt ausschließlich Demo-Daten.",
};

export const sprint4613Pattern = {
  id: "calculation-productive-tabbed-mis-mask",
  sprint: "46.13",
  description:
    "Die Kalkulationsmaske wird von der langen Eingabeseite in eine produktive Reitermaske überführt. Kunde, Auftrag, Produkt, Format, Papier, Druck, Weiterverarbeitung, Fremdproduktion und Preise sind als Arbeitsbereiche organisiert; ein kompakter Kalkulationskopf und eine nüchterne Status-/Aktionsleiste bleiben sichtbar.",
};

export const sprint4614Pattern = {
  id: "calculation-equal-tabs-clear-input-fields",
  sprint: "46.14",
  description:
    "Die Kalkulations-Reitermaske erhält gleich breite Reiter und klarer erkennbare Eingabefelder. Labels, Feldrahmen, editierbare Flächen und Fokuszustände werden im Oldschool-MIS-Stil präziser gezeichnet, ohne die Reiterlogik oder Berechnung zu ändern.",
};

export const sprint4615Pattern = {
  id: "calculation-six-productive-tabs-sharp-typography",
  sprint: "46.15",
  description:
    "Die Kalkulations-Reitermaske wird auf sechs produktive Hauptreiter zusammengeführt: Kunde & Auftrag, Produkt & Format, Papier & Druck, Weiterverarbeitung, Fremdproduktion sowie Preise & Ergebnis. Gleichzeitig wird die Typografie entschärft: weniger fette Kleinschrift, ruhigere Labels, klarere Eingabewerte und schärfere Tabellenwirkung.",
};

export const sprint4616Pattern = {
  id: "calculation-guided-input-flow-badges",
  sprint: "46.16",
  description:
    "Die Kalkulations-Reitermaske erhält eine erste Bedienfluss-Führung. Reiter zeigen offene Mindestdaten, die Statusleiste fasst den Pflichtstatus zusammen, der Auftrag-Button wird bei fehlenden Mindestdaten gesperrt und Pflicht-/optional-/später-Badges werden ruhiger und eindeutiger gezeichnet.",
};

export const sprint4617Pattern = {
  id: "calculation-field-inventory-complete-mask",
  sprint: "46.17",
  description:
    "Die Kalkulations-Reitermaske wird fachlich gegen typische Druckerei-/MIS-Anforderungen geprüft und ergänzt. Fehlende Felder für Korrekturtermin, Datenstatus, Überlieferung, Teillieferung, Sonderfarben, Papierstatus, Nettobogen/Zuschuss/Bruttobogen, Ecken abrunden, Perforation, Nummerierung, Mindestpreis, Rabatt, Deckungsbeitrag und Abrechnung werden vorbereitet, ohne Preislogik oder Layoutprinzip zu ändern.",
};

export const sprint4618Pattern = {
  id: "calculation-field-inventory-cleanup",
  sprint: "46.18",
  description:
    "Die Kalkulationsmaske wird fachlich aufgeräumt, ohne neue Preislogik oder große Designänderung. Pflichtfelder werden auf echte Mindestdaten reduziert, optionale und spätere Felder blockieren den Auftrag nicht mehr und die Felder werden in den sechs Hauptreitern klarer nach Kontakt, Auftrag, Menge, Produkt, Format, Material, Druck, Fremdproduktion und Abrechnung sortiert.",
};

export const sprint47Pattern = {
  id: "calculation-modern-production-mask-from-order-pocket",
  sprint: "47",
  description:
    "Die Kalkulationsmaske übernimmt die eingefrorene Auftragstaschen-Designrichtung: weißer Produktionsarbeitsraum, ruhige Panels, klarere Feldrahmen, PrintPilot-Blau/Cyan als Akzent, oben sichtbarer PrintPilot-Fluss von Kalkulation über Auftrag und Auftragstasche bis Produktion sowie ein sticky Ergebnis-/Auftragstaschenblock rechts.",
};

export const sprint49Pattern = {
  id: "calculation-to-order-pocket-transfer-map",
  sprint: "49",
  description:
    "Die Kalkulationsmaske definiert sichtbar, welche Daten in Auftrag und Auftragstasche übernommen werden. Produktionsrelevante Bereiche wie Kopfdaten, Kunde, Druckdaten, Material, Nutzenplan, Weiterverarbeitung, Versand und Kontrolle werden der Auftragstasche zugeordnet; Preis-, Margen- und Kostenwerte bleiben als interne Kalkulationsdaten markiert.",
};
