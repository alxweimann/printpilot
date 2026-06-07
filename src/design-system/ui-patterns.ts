export type PrintPilotPatternCategory =
  | 'layout'
  | 'card'
  | 'status'
  | 'timeline'
  | 'production'
  | 'media'
  | 'list'
  | 'drawer'

export type PrintPilotPattern = {
  id: string
  category: PrintPilotPatternCategory
  name: string
  purpose: string
  reference: string
  classNames: string[]
  reuseFor: string[]
}

export const printPilotUiPatterns: PrintPilotPattern[] = [

  {
    id: 'orders-overview-list',
    category: 'list',
    name: 'Aufträge-Übersichtsliste',
    purpose:
      'Überträgt die technische Auftragstaschen-Formsprache auf fokussierte Auftragskarten mit sauber umbrechenden Status-Pills, integrierter Verantwortlichkeit, Freigabe, Datenstatus, Termin, Kunde, Produkt, Maschine, Druckdatei-Preview und direktem Kartenklick in die Auftragstasche.',
    reference: 'Aufträge · Übersicht',
    classNames: [
      'pp-orders-overview',
      'pp-orders-master-header',
      'pp-header-overview-status',
      'pp-orders-workbench',
      'pp-order-row-card',
      'pp-orders-mini-info',
      'pp-order-specs',
      'pp-order-row-card__open-hint',
      'pp-order-row-card--clickable',
      'pp-order-preview',
      'pp-pocket-route-toolbar',
    ],
    reuseFor: ['Aufträge', 'Produktionsplanung', 'Kundenaufträge', 'Druckdatei-Previews', 'Auftragstaschen-Einstiege', 'Kartenklick-Navigation', 'Rücknavigation'],
  },

  {
    id: 'orders-overview-master-header',
    category: 'layout',
    name: 'Aufträge-Übersicht Header',
    purpose:
      'Verwendet den Auftragstaschen-Master-Header für die Aufträge-Übersicht, damit Übersicht und Auftragstasche dieselbe visuelle Hierarchie haben. Der Titel wechselt auf Aufträge-Übersicht, während Kennzahlen und Status-Hinweise die Produktionscockpit-Rolle erklären.',
    reference: 'Aufträge · Übersicht',
    classNames: [
      'pp-master-header',
      'pp-orders-master-header',
      'pp-header-brand',
      'pp-header-title-shape',
      'pp-header-job--overview',
      'pp-header-overview-status',
    ],
    reuseFor: ['Aufträge', 'Produktionscockpit', 'Modul-Header', 'Übersichtsseiten'],
  },

  {
    id: 'order-file-preview',
    category: 'media',
    name: 'Druckdatei-Preview in Listen',
    purpose:
      'Zeigt in produktionsnahen Listen eine kompakte Vorschau der Druckdatei als stilisierten Papierbogen mit Dateiname, Preview-Status und technischem Kurzkontext. Echte PDF-/Bild-Previews können später an diese Struktur angebunden werden.',
    reference: 'Aufträge · Übersicht',
    classNames: [
      'pp-order-preview',
      'pp-order-preview__sheet',
      'pp-order-preview__art',
      'pp-order-preview__caption',
    ],
    reuseFor: ['Aufträge', 'Druckdaten', 'Freigabeansicht', 'Produktionscockpit', 'Dateilisten'],
  },

  {
    id: 'bottom-navigation-safe-area',
    category: 'layout',
    name: 'Bottom-Navigation Sicherheitsabstand',
    purpose:
      'Zentraler Layout-Abstand für feste Bottom-Navigation, damit Scroll-Inhalte in Übersichten und Detailseiten nicht verdeckt werden.',
    reference: 'AppShell · Bottom Navigation',
    classNames: [
      'pp-main',
      'pp-main--console',
      'pp-bottom-nav',
      'pp-orders-overview',
      'pp-order-pocket',
      'pp-pocket-route-shell',
    ],
    reuseFor: ['Alle Module mit Bottom-Navigation', 'Aufträge', 'Auftragstasche', 'Mobile Ansichten'],
  },
  {
    id: 'order-pocket-header',
    category: 'layout',
    name: 'Auftragstaschen-Header',
    purpose:
      'Führt Logo, Dokumenttyp, Auftragsnummer und QR-Code in einer klaren Produktionskopfzeile zusammen.',
    reference: 'Auftragstasche · Header',
    classNames: [
      'pp-pocket-header',
      'pp-pocket-brand',
      'pp-pocket-title',
      'pp-pocket-job',
      'pp-pocket-qr',
    ],
    reuseFor: ['Auftragstaschen', 'Lieferscheine', 'Produktionsbegleitkarten'],
  },
  {
    id: 'technical-panel',
    category: 'card',
    name: 'Technische Karte',
    purpose:
      'Standardkarte für produktionsnahe Informationen mit Icon-Kachel, Titel, ruhigem Rahmen und kompaktem Inhalt.',
    reference: 'Produkt, Druckdaten, Termine, Nutzenplan, Vorschau, Dateien',
    classNames: ['pp-panel', 'pp-panel__header', 'pp-panel__icon', 'pp-panel__title'],
    reuseFor: ['Aufträge', 'Maschinen', 'Material', 'Produktion', 'Kunden-Details'],
  },
  {
    id: 'status-pill',
    category: 'status',
    name: 'Status-Pill / Badge',
    purpose:
      'Kantiger, kompakter Statusindikator mit reduziertem Schriftgewicht und klaren Tönen.',
    reference: 'Statuslauf, Weiterverarbeitung, Checkliste, Druckdaten',
    classNames: ['pp-pill', 'pp-status-step', 'pp-mini-status', 'pp-check-status'],
    reuseFor: ['Freigabe', 'Preflight', 'Produktion', 'Weiterverarbeitung', 'Lieferstatus'],
  },
  {
    id: 'timeline',
    category: 'timeline',
    name: 'Timeline',
    purpose:
      'Vertikale Ereignisdarstellung für Termine, Notizen und Verlauf ohne tabellarische Enge.',
    reference: 'Termine, Notizen, Kommentare / Verlauf',
    classNames: ['pp-schedule-timeline', 'pp-note-timeline', 'pp-history-timeline'],
    reuseFor: ['Auftragsverlauf', 'Kundenkommunikation', 'Produktionsplanung', 'Systemlog'],
  },
  {
    id: 'checklist',
    category: 'production',
    name: 'Produktions-Checkliste',
    purpose:
      'Gliedert prüfbare Produktionsschritte in Abschnitte mit erledigt/offen/Pflichtpunkt-Logik.',
    reference: 'Produktions-Checkliste',
    classNames: ['pp-checklist-section', 'pp-checklist-item', 'pp-check-box'],
    reuseFor: ['Druckfreigabe', 'Maschinenrüsten', 'Weiterverarbeitung', 'Versandprüfung'],
  },
  {
    id: 'imposition-sheet',
    category: 'production',
    name: 'Nutzenplan / Druckbogen',
    purpose:
      'Zeigt Ausschieß- und Nutzeninformationen proportional zum realistischen Druckbogenformat.',
    reference: 'Nutzenplan · SRA3 450 × 320 mm',
    classNames: ['pp-imposition-sheet', 'pp-imposition-page', 'pp-imposition-stats'],
    reuseFor: ['Kalkulation', 'Druckbogen-Erzeugung', 'Auftragstaschen', 'Ausschießen'],
  },
  {
    id: 'machine-card',
    category: 'media',
    name: 'Maschinenkarte',
    purpose:
      'Kombiniert Maschinenbild/Fallback-Illustration, Status und technische Merkmale responsiv.',
    reference: 'Maschine',
    classNames: ['pp-machine-card', 'pp-machine-visual', 'pp-machine-content'],
    reuseFor: ['Maschinenmodul', 'Produktionsplanung', 'Kalkulation', 'Wartung'],
  },
  {
    id: 'preview-card',
    category: 'media',
    name: 'PDF-/Druckvorschau',
    purpose:
      'Stellt Druckdateien als Papierbogen mit Beschnitt-, Schnittmarken- und Dateikontext dar.',
    reference: 'Vorschau',
    classNames: ['pp-preview-card', 'pp-preview-paper', 'pp-preview-specs'],
    reuseFor: ['Druckdaten', 'Freigabeansicht', 'Angebotsvorschau', 'PDF-Prüfung'],
  },
]

export const printPilotReferenceScreen = {
  id: 'order-pocket-reference',
  name: 'Auftragstasche',
  route: '/auftragstasche',
  status: 'design-reference',
  description:
    'Die Auftragstasche ist die visuelle Referenz für zukünftige PrintPilot-Module und bündelt die wichtigsten UI-Patterns.',
  patterns: printPilotUiPatterns.map((pattern) => pattern.id),
} as const
