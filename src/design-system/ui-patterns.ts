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
      'Überträgt die technische Auftragstaschen-Formsprache auf fokussierte Auftragskarten mit sauber umbrechenden Status-Pills, integrierter Verantwortlichkeit, Freigabe, Datenstatus, Termin, Kunde, Produkt, Maschine, vorbereiteten Aktionen und aktivem Detail-Drawer.',
    reference: 'Aufträge · Übersicht',
    classNames: [
      'pp-orders-overview',
      'pp-orders-hero',
      'pp-orders-workbench',
      'pp-order-row-card',
      'pp-orders-mini-info',
      'pp-order-specs',
      'pp-order-row-card__actions',
      'pp-orders-detail-drawer',
    ],
    reuseFor: ['Aufträge', 'Produktionsplanung', 'Kundenaufträge', 'Detail-Drawer-Einstiege', 'Auftragstaschen-Einstiege'],
  },
  {
    id: 'order-detail-drawer',
    category: 'drawer',
    name: 'Auftrags-Detail-Drawer',
    purpose:
      'Öffnet aus einer Auftragskarte rechts eine kompakte Detailansicht mit Auftragskopf, Status, Produktion, Druckdaten, nächstem Schritt und vorbereiteten Aktionen.',
    reference: 'Aufträge · Detail-Drawer',
    classNames: [
      'pp-orders-drawer-shell',
      'pp-orders-detail-drawer',
      'pp-orders-drawer-header',
      'pp-orders-drawer-section',
      'pp-orders-drawer-facts',
      'pp-orders-drawer-actions',
    ],
    reuseFor: ['Auftragsdetails', 'Kundendetails', 'Produktionsdetails', 'Angebotsdetails', 'Rechnungsdetails'],
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
