export type OrderTone = "green" | "orange" | "gray" | "blue";

export type OrderStatus = {
  label: string;
  tone: OrderTone;
};

export type OrderPreview = {
  kind: "flyer" | "business-card" | "brochure" | "poster" | "sticker";
  label: string;
  filename: string;
  meta: string;
};

export type PrintPilotOrder = {
  id: string;
  customer: string;
  customerAddress: string[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  product: string;
  productDescription: string;
  format: string;
  endFormat: string;
  pages: string;
  quantity: string;
  paper: string;
  color: string;
  rawFormat: string;
  imposition: string;
  bleed: string;
  waste: string;
  totalWeight: string;
  machine: string;
  machineType:
    | "digital-color"
    | "digital-mono"
    | "wide-format"
    | "inkjet"
    | "finishing";
  machineTypeLabel: string;
  priority: OrderStatus;
  production: OrderStatus;
  approval: OrderStatus;
  data: OrderStatus;
  orderDate: string;
  dueDate: string;
  dueMeta: string;
  deliveryMeta: string;
  nextStep: string;
  owner: string;
  progress: number;
  preview: OrderPreview;
  fileSize: string;
  fileCategory: string;
  fileDate: string;
  fileTime: string;
  preflightValue: string;
  bleedStatus: OrderStatus;
  scheduleStart: string;
  scheduleStartTime: string;
};

export const orderSummary = [
  { label: "Heute fällig", value: "4", helper: "2 kritisch", tone: "orange" },
  { label: "In Produktion", value: "12", helper: "6 Maschinen", tone: "blue" },
  { label: "Freigabe offen", value: "5", helper: "Kunde", tone: "gray" },
  { label: "Daten prüfen", value: "3", helper: "Preflight", tone: "orange" },
] satisfies Array<{
  label: string;
  value: string;
  helper: string;
  tone: OrderTone;
}>;

export const orderRows: PrintPilotOrder[] = [
  {
    id: "PP-2026-00481",
    customer: "Muster GmbH",
    customerAddress: ["Industriestraße 12", "69151 Neckargemünd"],
    contactName: "Max Mustermann",
    contactPhone: "06222 / 123456",
    contactEmail: "max@muster.de",
    product: "Flyer DIN Lang",
    productDescription: "2-seitiger Werbeflyer für Messeaktion Juni",
    format: "210 × 99 mm · 2-seitig",
    endFormat: "210 × 99 mm",
    pages: "2-seitig",
    quantity: "3.000 Stück",
    paper: "Bilderdruck matt 135 g",
    color: "4/4-farbig CMYK",
    rawFormat: "SRA3",
    imposition: "8 Nutzen",
    bleed: "3 mm",
    waste: "ca. 50 Bogen",
    totalWeight: "ca. 48,6 kg",
    machine: "Xerox® Iridesse 1",
    machineType: "digital-color",
    machineTypeLabel: "Digitaldruck Farbe",
    priority: { label: "Normal", tone: "blue" },
    production: { label: "Produktion", tone: "orange" },
    approval: { label: "Freigabe erteilt", tone: "green" },
    data: { label: "Daten geprüft", tone: "green" },
    orderDate: "30.05.2026",
    dueDate: "03.06.2026",
    dueMeta: "Mi · 10:00",
    deliveryMeta: "KW 23 / Mittwoch",
    nextStep: "Druckstart vorbereiten",
    owner: "Sarah K.",
    progress: 58,
    preview: {
      kind: "flyer",
      label: "PDF-Preview",
      filename: "flyer_dinlang_druck.pdf",
      meta: "2 Seiten · 8,2 MB",
    },
    fileSize: "8,2 MB",
    fileCategory: "Druckdaten",
    fileDate: "30.05.2026",
    fileTime: "10:10",
    preflightValue: "OK",
    bleedStatus: { label: "prüfen", tone: "orange" },
    scheduleStart: "02.06.2026",
    scheduleStartTime: "08:00",
  },
  {
    id: "PP-2026-00482",
    customer: "Praxis Rheinbogen",
    customerAddress: ["Hauptstraße 42", "69117 Heidelberg"],
    contactName: "Dr. Lena Frank",
    contactPhone: "06221 / 778899",
    contactEmail: "praxis@rheinbogen.de",
    product: "Visitenkarten Set",
    productDescription:
      "Visitenkarten für drei Ansprechpartner mit einheitlichem Praxislayout",
    format: "85 × 55 mm · 4/4",
    endFormat: "85 × 55 mm",
    pages: "4/4-farbig",
    quantity: "750 Stück",
    paper: "Munken Lynx 300 g",
    color: "4/4-farbig CMYK",
    rawFormat: "SRA3",
    imposition: "24 Nutzen",
    bleed: "3 mm",
    waste: "ca. 20 Bogen",
    totalWeight: "ca. 6,4 kg",
    machine: "Xerox® Iridesse 2",
    machineType: "digital-color",
    machineTypeLabel: "Digitaldruck Farbe",
    priority: { label: "Eilig", tone: "orange" },
    production: { label: "Datenprüfung", tone: "blue" },
    approval: { label: "Freigabe offen", tone: "orange" },
    data: { label: "Preflight OK", tone: "green" },
    orderDate: "31.05.2026",
    dueDate: "03.06.2026",
    dueMeta: "Mi · 14:00",
    deliveryMeta: "KW 23 / Mittwoch",
    nextStep: "Freigabe beim Kunden einholen",
    owner: "Max M.",
    progress: 32,
    preview: {
      kind: "business-card",
      label: "PDF-Preview",
      filename: "visitenkarten_set.pdf",
      meta: "4/4 · 3 Nutzen",
    },
    fileSize: "3,1 MB",
    fileCategory: "Freigabe/Druckdaten",
    fileDate: "31.05.2026",
    fileTime: "09:40",
    preflightValue: "OK",
    bleedStatus: { label: "OK", tone: "green" },
    scheduleStart: "03.06.2026",
    scheduleStartTime: "10:30",
  },
  {
    id: "PP-2026-00483",
    customer: "Stadtwerke Süd",
    customerAddress: ["Energiepark 7", "69124 Heidelberg"],
    contactName: "Nora Schneider",
    contactPhone: "06221 / 445566",
    contactEmail: "marketing@stadtwerke-sued.de",
    product: "Broschüre A5",
    productDescription:
      "16-seitige Informationsbroschüre mit Umschlag und Rückenheftung",
    format: "16 Seiten · Rückenheftung",
    endFormat: "A5",
    pages: "16 Seiten",
    quantity: "1.200 Stück",
    paper: "Bilderdruck matt 170 g / 250 g Umschlag",
    color: "4/4-farbig CMYK",
    rawFormat: "SRA3",
    imposition: "2 × 8 Seiten",
    bleed: "3 mm",
    waste: "ca. 80 Bogen",
    totalWeight: "ca. 96,0 kg",
    machine: "Xerox® Iridesse 1",
    machineType: "digital-color",
    machineTypeLabel: "Digitaldruck Farbe",
    priority: { label: "Hoch", tone: "orange" },
    production: { label: "Wartet", tone: "gray" },
    approval: { label: "Freigabe erteilt", tone: "green" },
    data: { label: "Daten fehlen", tone: "orange" },
    orderDate: "31.05.2026",
    dueDate: "04.06.2026",
    dueMeta: "Do · 12:00",
    deliveryMeta: "KW 23 / Donnerstag",
    nextStep: "Innenteil-PDF nachfordern",
    owner: "Admin",
    progress: 24,
    preview: {
      kind: "brochure",
      label: "Preview fehlt",
      filename: "umschlag_a5.pdf",
      meta: "Innenteil offen",
    },
    fileSize: "5,6 MB",
    fileCategory: "Umschlag",
    fileDate: "31.05.2026",
    fileTime: "15:25",
    preflightValue: "Teilweise",
    bleedStatus: { label: "offen", tone: "orange" },
    scheduleStart: "04.06.2026",
    scheduleStartTime: "08:00",
  },
  {
    id: "PP-2026-00484",
    customer: "Bäckerei König",
    customerAddress: ["Marktplatz 3", "69168 Wiesloch"],
    contactName: "Tobias König",
    contactPhone: "06222 / 334455",
    contactEmail: "info@baeckerei-koenig.de",
    product: "Plakat A2",
    productDescription:
      "Plakatserie für Sommeraktion im Schaufenster und Außenbereich",
    format: "420 × 594 mm · 4/0",
    endFormat: "A2",
    pages: "1-seitig",
    quantity: "40 Stück",
    paper: "Blueback 120 g",
    color: "4/0-farbig CMYK",
    rawFormat: "Rolle 540 mm",
    imposition: "Rollenlayout",
    bleed: "5 mm",
    waste: "ca. 2 Laufmeter",
    totalWeight: "ca. 5,8 kg",
    machine: "Roland TrueVis VG3-540",
    machineType: "wide-format",
    machineTypeLabel: "Großformatdruck",
    priority: { label: "Normal", tone: "blue" },
    production: { label: "Geplant", tone: "blue" },
    approval: { label: "Freigabe erteilt", tone: "green" },
    data: { label: "Daten geprüft", tone: "green" },
    orderDate: "01.06.2026",
    dueDate: "05.06.2026",
    dueMeta: "Fr · 09:30",
    deliveryMeta: "KW 23 / Freitag",
    nextStep: "Rolle prüfen und RIP vorbereiten",
    owner: "Julia P.",
    progress: 46,
    preview: {
      kind: "poster",
      label: "PDF-Preview",
      filename: "plakat_a2_motivserie.pdf",
      meta: "A2 · CMYK",
    },
    fileSize: "42,0 MB",
    fileCategory: "Druckdaten",
    fileDate: "01.06.2026",
    fileTime: "12:10",
    preflightValue: "OK",
    bleedStatus: { label: "OK", tone: "green" },
    scheduleStart: "05.06.2026",
    scheduleStartTime: "07:30",
  },
  {
    id: "PP-2026-00485",
    customer: "Autohaus Bergstraße",
    customerAddress: ["Bergstraße 88", "69469 Weinheim"],
    contactName: "Miriam Weber",
    contactPhone: "06201 / 998877",
    contactEmail: "werbung@autohaus-bergstrasse.de",
    product: "Aufkleberbogen",
    productDescription:
      "Konturgeschnittene Aktionsaufkleber auf Bogen mit CutContour",
    format: "SRA3 · Konturschnitt",
    endFormat: "SRA3 Bogen",
    pages: "1-seitig + Cut",
    quantity: "150 Bogen",
    paper: "Orajet 3164XG matt",
    color: "4/0-farbig CMYK + CutContour",
    rawFormat: "Rolle 540 mm",
    imposition: "Bogenlayout mit Konturschnitt",
    bleed: "2 mm",
    waste: "ca. 4 Laufmeter",
    totalWeight: "ca. 12,3 kg",
    machine: "Roland TrueVis VG3-540",
    machineType: "wide-format",
    machineTypeLabel: "Großformatdruck / Print & Cut",
    priority: { label: "Eilig", tone: "orange" },
    production: { label: "Weiterverarbeitung", tone: "orange" },
    approval: { label: "Freigabe erteilt", tone: "green" },
    data: { label: "Daten geprüft", tone: "green" },
    orderDate: "01.06.2026",
    dueDate: "05.06.2026",
    dueMeta: "Fr · 15:00",
    deliveryMeta: "KW 23 / Freitag",
    nextStep: "Konturschnitt und Verpackung",
    owner: "Sarah K.",
    progress: 74,
    preview: {
      kind: "sticker",
      label: "Druck-/Cut-Preview",
      filename: "aufkleberbogen_cutcontour.pdf",
      meta: "CutContour geprüft",
    },
    fileSize: "18,7 MB",
    fileCategory: "Druck-/Cutdaten",
    fileDate: "01.06.2026",
    fileTime: "16:05",
    preflightValue: "OK",
    bleedStatus: { label: "OK", tone: "green" },
    scheduleStart: "05.06.2026",
    scheduleStartTime: "11:30",
  },
];

export const laneGroups = [
  { title: "Daten / Freigabe", count: 3, tone: "blue" },
  { title: "Produktion", count: 5, tone: "orange" },
  { title: "Weiterverarbeitung", count: 2, tone: "gray" },
  { title: "Versandbereit", count: 2, tone: "green" },
] satisfies Array<{ title: string; count: number; tone: OrderTone }>;

export const getFallbackOrder = () => orderRows[0];
