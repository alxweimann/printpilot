export type PrintPilotId = string;

export type PrintPilotCustomerStatus = "Aktiv" | "Interessent" | "Inaktiv";

export type PrintPilotCustomer = {
  id: PrintPilotId;
  number: string;
  name: string;
  type: string;
  status: PrintPilotCustomerStatus;
  street: string;
  zip: string;
  city: string;
  contact: string;
  phone: string;
  email: string;
  paymentTerm: string;
  priceLevel: string;
  badgeVariant?: "success";
};

export type PrintPilotHistoryEntry = {
  id: PrintPilotId;
  createdAt: string;
  action: string;
  status: string;
  previousStatus?: string;
  nextStatus?: string;
};

export function createPrintPilotHistoryEntry(
  action: string,
  status: string,
  previousStatus?: string,
  nextStatus?: string,
): PrintPilotHistoryEntry {
  return {
    id: `history-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    action,
    status,
    previousStatus,
    nextStatus,
  };
}

export type PrintPilotQuoteStatus =
  | "Entwurf"
  | "Offen"
  | "Angenommen"
  | "Abgelehnt";

export type PrintPilotQuote = {
  id: PrintPilotId;
  number: string;
  customerId: PrintPilotId | null;
  customerName: string;
  subject: string;
  status: PrintPilotQuoteStatus;
  quoteDate: string;
  validUntil: string;
  paymentTerms: string;
  deliveryTerms: string;
  template: string;
  badgeVariant?: "success";
  history?: PrintPilotHistoryEntry[];
};

export type PrintPilotMaterialStatus =
  | "Auf Lager"
  | "Knapp"
  | "Bestellen"
  | "Archiv";

export type PrintPilotMaterial = {
  id: PrintPilotId;
  number: string;
  name: string;
  type: string;
  format: string;
  grain: string;
  pricePerReam: string;
  sheetsPerReam: string;
  stock: string;
  status: PrintPilotMaterialStatus;
  minimumStock: string;
  storageLocation: string;
  badgeVariant?: "success";
};

export type PrintPilotMachineStatus = "Aktiv" | "Wartung" | "Archiv";

export type PrintPilotMachine = {
  id: PrintPilotId;
  number: string;
  name: string;
  type: string;
  colorMode: string;
  status: PrintPilotMachineStatus;
  hourlyRate: string;
  colorClickCost: string;
  blackClickCost: string;
  duplex: string;
  usage: string;
  note: string;
  badgeVariant?: "success";
};

export type PrintPilotApprovalStatus =
  | "Freigabe offen"
  | "Freigegeben"
  | "Kundenfreigabe fehlt"
  | "Freigabe ausstehend"
  | "Freigabe erteilt"
  | "Korrektur angefordert"
  | "Daten unvollständig"
  | "Nicht erforderlich"
  | "Archiv";

export type PrintPilotHandoffStatus =
  | "Druckdaten prüfen"
  | "Wartet auf Daten"
  | "In Druck"
  | "In Weiterverarbeitung"
  | "Abholbereit"
  | "Versendet"
  | "Abgeschlossen";

export type PrintPilotOrderPriority = "Niedrig" | "Normal" | "Hoch" | "Express";

export type PrintPilotOrderStatus =
  | "Neu"
  | "In Produktion"
  | "Wartet"
  | "Fertig"
  | "Archiv";

export type PrintPilotOrder = {
  id: PrintPilotId;
  number: string;
  quoteId: PrintPilotId | null;
  customerId: PrintPilotId | null;
  customerName: string;
  product: string;
  status: PrintPilotOrderStatus;
  dueDate: string;
  machine: string;
  priority: PrintPilotOrderPriority;
  handoff: PrintPilotHandoffStatus;
  approval: PrintPilotApprovalStatus;
  badgeVariant?: "success";
  history?: PrintPilotHistoryEntry[];
};

export type PrintPilotReminderStatus =
  | "Entwurf"
  | "Offen"
  | "Versendet"
  | "Erledigt";

export type PrintPilotReminder = {
  id: PrintPilotId;
  number: string;
  invoiceId: PrintPilotId;
  invoiceNumber: string;
  customerId: PrintPilotId | null;
  customerName: string;
  subject: string;
  status: PrintPilotReminderStatus;
  reminderLevel: string;
  deadline: string;
  template: string;
  note: string;
  badgeVariant?: "success";
  history?: PrintPilotHistoryEntry[];
};

export type PrintPilotInvoiceStatus =
  | "Entwurf"
  | "Offen"
  | "Bezahlt"
  | "Überfällig";

export type PrintPilotInvoice = {
  id: PrintPilotId;
  number: string;
  orderId: PrintPilotId;
  orderNumber: string;
  customerId: PrintPilotId | null;
  customerName: string;
  subject: string;
  status: PrintPilotInvoiceStatus;
  paymentTerms: string;
  paymentType: string;
  template: string;
  invoiceDate: string;
  dueDate: string;
  badgeVariant?: "success";
  history?: PrintPilotHistoryEntry[];
};

export type PrintPilotDeliveryNoteStatus =
  | "Entwurf"
  | "Versandbereit"
  | "Geliefert"
  | "Abgeschlossen";

export type PrintPilotDeliveryNote = {
  id: PrintPilotId;
  number: string;
  orderId: PrintPilotId;
  orderNumber: string;
  customerId: PrintPilotId | null;
  customerName: string;
  product: string;
  status: PrintPilotDeliveryNoteStatus;
  shippingMethod: string;
  recipient: string;
  address: string;
  template: string;
  badgeVariant?: "success";
  history?: PrintPilotHistoryEntry[];
};

export type PrintPilotServiceStatus = "Aktiv" | "Optional" | "Archiv";

export type PrintPilotService = {
  id: PrintPilotId;
  number: string;
  name: string;
  group: string;
  unit: string;
  status: PrintPilotServiceStatus;
  optional: string;
  price: string;
  description: string;
  badgeVariant?: "success";
};

export type PrintPilotFinishingStatus = "Aktiv" | "Optional" | "Archiv";

export type PrintPilotFinishingProcess = {
  id: PrintPilotId;
  number: string;
  name: string;
  category: string;
  pricing: string;
  status: PrintPilotFinishingStatus;
  standardUsage: string;
  setupTime: string;
  hourlyRate: string;
  description: string;
  badgeVariant?: "success";
};

export type PrintPilotTemplateStatus = "Aktiv" | "Entwurf" | "Archiv";

export type PrintPilotTemplate = {
  id: PrintPilotId;
  number: string;
  name: string;
  type: string;
  area: string;
  status: PrintPilotTemplateStatus;
  isDefault: string;
  productType: string;
  outputLayout: string;
  badgeVariant?: "success";
};


export type PrintPilotProductType =
  | "Einzelblatt"
  | "Flyer"
  | "Broschüre"
  | "Block"
  | "SD-Satz"
  | "Karte"
  | "Großformat";

export type PrintPilotFormatCategory =
  | "DIN"
  | "Flyer"
  | "Karte"
  | "Broschüre"
  | "Block"
  | "SD-Satz"
  | "Sonderformat";

export type PrintPilotRawSheetCategory =
  | "DIN"
  | "SRA"
  | "Langbogen"
  | "Maschinenformat"
  | "Sonderformat";

export type PrintPilotGrainDirection =
  | "Unbekannt"
  | "Schmalbahn"
  | "Breitbahn";

export type PrintPilotProductFormat = {
  id: PrintPilotId;
  name: string;
  widthMm: string;
  heightMm: string;
  category: PrintPilotFormatCategory;
  productTypes: PrintPilotProductType[];
  isDefault: string;
  isActive: string;
};

export type PrintPilotRawSheetFormat = {
  id: PrintPilotId;
  name: string;
  widthMm: string;
  heightMm: string;
  category: PrintPilotRawSheetCategory;
  machine: string;
  grainDirection: PrintPilotGrainDirection;
  isDefault: string;
  isActive: string;
};

export type PrintPilotSettings = {
  id: PrintPilotId;
  mode: string;
  startModule: string;
  defaultCalculationModule: string;
  dateFormat: string;
  quotePrefix: string;
  quoteNextNumber: string;
  orderPrefix: string;
  orderNextNumber: string;
  deliveryNotePrefix: string;
  deliveryNoteNextNumber: string;
  invoicePrefix: string;
  invoiceNextNumber: string;
  reminderPrefix: string;
  reminderNextNumber: string;
  companyName: string;
  companyStreet: string;
  companyZip: string;
  companyCity: string;
  companyPhone: string;
  companyEmail: string;
  density: string;
  appearance: string;
  moduleColors: string;
  backupMode: string;
  apiStatus: string;
  debugMode: string;
  productFormats: PrintPilotProductFormat[];
  rawSheetFormats: PrintPilotRawSheetFormat[];
};

export type PrintPilotStoreData = {
  customers: PrintPilotCustomer[];
  quotes: PrintPilotQuote[];
  orders: PrintPilotOrder[];
  invoices: PrintPilotInvoice[];
  reminders: PrintPilotReminder[];
  deliveryNotes: PrintPilotDeliveryNote[];
  materials: PrintPilotMaterial[];
  machines: PrintPilotMachine[];
  services: PrintPilotService[];
  finishing: PrintPilotFinishingProcess[];
  templates: PrintPilotTemplate[];
  settings: PrintPilotSettings;
};


export const initialPrintPilotProductFormats: PrintPilotProductFormat[] = [
  {
    id: "format-din-a3",
    name: "DIN A3",
    widthMm: "297",
    heightMm: "420",
    category: "DIN",
    productTypes: ["Einzelblatt", "Flyer", "Broschüre"],
    isDefault: "Nein",
    isActive: "Ja",
  },
  {
    id: "format-din-a4",
    name: "DIN A4",
    widthMm: "210",
    heightMm: "297",
    category: "DIN",
    productTypes: ["Einzelblatt", "Flyer", "Broschüre", "Block", "SD-Satz"],
    isDefault: "Nein",
    isActive: "Ja",
  },
  {
    id: "format-din-a5",
    name: "DIN A5",
    widthMm: "148",
    heightMm: "210",
    category: "DIN",
    productTypes: ["Einzelblatt", "Flyer", "Broschüre", "Block", "SD-Satz"],
    isDefault: "Nein",
    isActive: "Ja",
  },
  {
    id: "format-din-a6",
    name: "DIN A6",
    widthMm: "105",
    heightMm: "148",
    category: "DIN",
    productTypes: ["Einzelblatt", "Flyer", "Karte"],
    isDefault: "Nein",
    isActive: "Ja",
  },
  {
    id: "format-din-a7",
    name: "DIN A7",
    widthMm: "74",
    heightMm: "105",
    category: "DIN",
    productTypes: ["Einzelblatt", "Karte"],
    isDefault: "Nein",
    isActive: "Ja",
  },
  {
    id: "format-din-lang",
    name: "DIN Lang",
    widthMm: "99",
    heightMm: "210",
    category: "Flyer",
    productTypes: ["Einzelblatt", "Flyer"],
    isDefault: "Nein",
    isActive: "Ja",
  },
  {
    id: "format-din-lang-quer",
    name: "DIN Lang quer",
    widthMm: "210",
    heightMm: "99",
    category: "Flyer",
    productTypes: ["Einzelblatt", "Flyer"],
    isDefault: "Ja",
    isActive: "Ja",
  },
  {
    id: "format-din-lang-plus",
    name: "DIN Lang Plus",
    widthMm: "105",
    heightMm: "210",
    category: "Flyer",
    productTypes: ["Einzelblatt", "Flyer"],
    isDefault: "Nein",
    isActive: "Ja",
  },
  {
    id: "format-square-210",
    name: "Quadrat 210",
    widthMm: "210",
    heightMm: "210",
    category: "Sonderformat",
    productTypes: ["Einzelblatt", "Broschüre"],
    isDefault: "Nein",
    isActive: "Ja",
  },
  {
    id: "format-business-card",
    name: "Visitenkarte",
    widthMm: "85",
    heightMm: "55",
    category: "Karte",
    productTypes: ["Karte"],
    isDefault: "Nein",
    isActive: "Ja",
  },
];

export const initialPrintPilotRawSheetFormats: PrintPilotRawSheetFormat[] = [
  {
    id: "raw-sra3",
    name: "SRA3",
    widthMm: "450",
    heightMm: "320",
    category: "SRA",
    machine: "Digitaldruck allgemein",
    grainDirection: "Unbekannt",
    isDefault: "Ja",
    isActive: "Ja",
  },
  {
    id: "raw-din-a3",
    name: "DIN A3",
    widthMm: "420",
    heightMm: "297",
    category: "DIN",
    machine: "Digitaldruck allgemein",
    grainDirection: "Unbekannt",
    isDefault: "Nein",
    isActive: "Ja",
  },
  {
    id: "raw-din-a4",
    name: "DIN A4",
    widthMm: "297",
    heightMm: "210",
    category: "DIN",
    machine: "Digitaldruck allgemein",
    grainDirection: "Unbekannt",
    isDefault: "Nein",
    isActive: "Ja",
  },
  {
    id: "raw-din-a5",
    name: "DIN A5",
    widthMm: "210",
    heightMm: "148",
    category: "DIN",
    machine: "Digitaldruck allgemein",
    grainDirection: "Unbekannt",
    isDefault: "Nein",
    isActive: "Ja",
  },
  {
    id: "raw-din-a6",
    name: "DIN A6",
    widthMm: "148",
    heightMm: "105",
    category: "DIN",
    machine: "Digitaldruck allgemein",
    grainDirection: "Unbekannt",
    isDefault: "Nein",
    isActive: "Ja",
  },
  {
    id: "raw-din-a7",
    name: "DIN A7",
    widthMm: "105",
    heightMm: "74",
    category: "DIN",
    machine: "Digitaldruck allgemein",
    grainDirection: "Unbekannt",
    isDefault: "Nein",
    isActive: "Ja",
  },
  {
    id: "raw-iridesse-long-330-660",
    name: "Iridesse Langbogen",
    widthMm: "330",
    heightMm: "660",
    category: "Langbogen",
    machine: "Xerox Iridesse",
    grainDirection: "Unbekannt",
    isDefault: "Nein",
    isActive: "Ja",
  },
  {
    id: "raw-iridesse-banner-330-1200",
    name: "Iridesse Bannerbogen",
    widthMm: "330",
    heightMm: "1200",
    category: "Langbogen",
    machine: "Xerox Iridesse",
    grainDirection: "Unbekannt",
    isDefault: "Nein",
    isActive: "Ja",
  },
];

export const initialPrintPilotSettings: PrintPilotSettings = {
  id: "settings-local",
  mode: "Lokal",
  startModule: "Dashboard",
  defaultCalculationModule: "Kalkulation",
  dateFormat: "TT.MM.JJJJ",
  quotePrefix: "AG",
  quoteNextNumber: "2026-001",
  orderPrefix: "AU",
  orderNextNumber: "2026-001",
  deliveryNotePrefix: "LS",
  deliveryNoteNextNumber: "2026-001",
  invoicePrefix: "RE",
  invoiceNextNumber: "2026-001",
  reminderPrefix: "MA",
  reminderNextNumber: "2026-001",
  companyName: "Sonnendruck GmbH",
  companyStreet: "",
  companyZip: "",
  companyCity: "",
  companyPhone: "",
  companyEmail: "",
  density: "Kompakt",
  appearance: "Hell später",
  moduleColors: "Einheitlich später",
  backupMode: "Manuell",
  apiStatus: "Nicht aktiv",
  debugMode: "Aus",
  productFormats: initialPrintPilotProductFormats,
  rawSheetFormats: initialPrintPilotRawSheetFormats,
};

export const initialPrintPilotCustomers: PrintPilotCustomer[] = [
  {
    id: "customer-sonnendruck",
    number: "KD-1001",
    name: "Sonnendruck GmbH",
    type: "Geschäftskunde",
    status: "Aktiv",
    street: "Musterstraße 12",
    zip: "69115",
    city: "Heidelberg",
    contact: "Alex Weimann",
    phone: "06221 000000",
    email: "info@sonnendruck.de",
    paymentTerm: "14 Tage netto",
    priceLevel: "Standard",
    badgeVariant: "success",
  },
  {
    id: "customer-musterkunde",
    number: "KD-1002",
    name: "Musterkunde GmbH",
    type: "Geschäftskunde",
    status: "Aktiv",
    street: "Beispielweg 4",
    zip: "68159",
    city: "Mannheim",
    contact: "Max Mustermann",
    phone: "0621 000000",
    email: "kontakt@musterkunde.de",
    paymentTerm: "30 Tage netto",
    priceLevel: "A-Kunde",
    badgeVariant: "success",
  },
  {
    id: "customer-agentur-beispiel",
    number: "KD-1003",
    name: "Agentur Beispiel",
    type: "Agentur",
    status: "Interessent",
    street: "Designallee 8",
    zip: "69120",
    city: "Heidelberg",
    contact: "Mia Beispiel",
    phone: "06221 111111",
    email: "hello@agentur-beispiel.de",
    paymentTerm: "Zahlbar sofort",
    priceLevel: "Agentur",
  },
  {
    id: "customer-testkunde-kg",
    number: "KD-1004",
    name: "Testkunde KG",
    type: "Privatkunde",
    status: "Inaktiv",
    street: "Testgasse 1",
    zip: "69126",
    city: "Heidelberg",
    contact: "Tina Test",
    phone: "06221 222222",
    email: "test@testkunde.de",
    paymentTerm: "Vorkasse",
    priceLevel: "Standard",
  },
];

export const initialPrintPilotQuotes: PrintPilotQuote[] = [
  {
    id: "quote-ag-2026-001",
    number: "AG-2026-001",
    customerId: "customer-sonnendruck",
    customerName: "Sonnendruck GmbH",
    subject: "Broschüre A4",
    status: "Entwurf",
    quoteDate: "2026-05-05",
    validUntil: "2026-05-19",
    paymentTerms: "14 Tage netto",
    deliveryTerms: "Abholung",
    template: "Standardangebot",
    badgeVariant: "success",
  },
  {
    id: "quote-ag-2026-004",
    number: "AG-2026-004",
    customerId: "customer-agentur-beispiel",
    customerName: "Agentur Beispiel",
    subject: "Visitenkarten",
    status: "Entwurf",
    quoteDate: "2026-05-04",
    validUntil: "2026-05-18",
    paymentTerms: "Zahlbar sofort ohne Abzug",
    deliveryTerms: "Versand nach Aufwand",
    template: "Kurzangebot",
  },
  {
    id: "quote-ag-2026-002",
    number: "AG-2026-002",
    customerId: "customer-musterkunde",
    customerName: "Musterkunde GmbH",
    subject: "Flyer A5",
    status: "Offen",
    quoteDate: "2026-05-03",
    validUntil: "2026-05-17",
    paymentTerms: "14 Tage netto",
    deliveryTerms: "Lieferung inklusive",
    template: "Standardangebot",
  },
  {
    id: "quote-ag-2026-006",
    number: "AG-2026-006",
    customerId: "customer-sonnendruck",
    customerName: "Sonnendruck GmbH",
    subject: "Folder DIN lang",
    status: "Angenommen",
    quoteDate: "2026-04-29",
    validUntil: "2026-05-13",
    paymentTerms: "14 Tage netto",
    deliveryTerms: "Lieferung inklusive",
    template: "Standardangebot",
    badgeVariant: "success",
  },
  {
    id: "quote-ag-2026-007",
    number: "AG-2026-007",
    customerId: "customer-testkunde-kg",
    customerName: "Testkunde KG",
    subject: "Einladungskarten",
    status: "Abgelehnt",
    quoteDate: "2026-04-25",
    validUntil: "2026-05-09",
    paymentTerms: "Zahlbar sofort ohne Abzug",
    deliveryTerms: "Abholung",
    template: "Kurzangebot",
  },
];

export const initialPrintPilotMaterials: PrintPilotMaterial[] = [
  {
    id: "material-sra3-250-gm2",
    number: "MA-1001",
    name: "SRA3 Bilderdruck matt 250 g/m²",
    type: "Bilderdruck matt",
    format: "SRA3",
    grain: "Breitbahn",
    pricePerReam: "38,50",
    sheetsPerReam: "500",
    stock: "2400",
    status: "Auf Lager",
    minimumStock: "1000",
    storageLocation: "Regal A1",
    badgeVariant: "success",
  },
  {
    id: "material-sra3-170-gm2",
    number: "MA-1002",
    name: "SRA3 Bilderdruck glänzend 170 g/m²",
    type: "Bilderdruck glänzend",
    format: "SRA3",
    grain: "Schmalbahn",
    pricePerReam: "29,90",
    sheetsPerReam: "500",
    stock: "850",
    status: "Knapp",
    minimumStock: "1000",
    storageLocation: "Regal A2",
  },
  {
    id: "material-sra3-offset-120-gm2",
    number: "MA-1003",
    name: "SRA3 Offset 120 g/m²",
    type: "Offset",
    format: "SRA3",
    grain: "Breitbahn",
    pricePerReam: "21,40",
    sheetsPerReam: "500",
    stock: "300",
    status: "Bestellen",
    minimumStock: "750",
    storageLocation: "Regal B1",
  },
  {
    id: "material-a3-briefbogen-90-gm2",
    number: "MA-1004",
    name: "A3 Naturpapier 90 g/m²",
    type: "Naturpapier",
    format: "A3",
    grain: "Schmalbahn",
    pricePerReam: "18,20",
    sheetsPerReam: "500",
    stock: "0",
    status: "Archiv",
    minimumStock: "500",
    storageLocation: "Archiv",
  },
];

export const initialPrintPilotMachines: PrintPilotMachine[] = [
  {
    id: "machine-xerox-iridesse-1",
    number: "DM-1001",
    name: "Xerox Iridesse 1",
    type: "Digitaldruck",
    colorMode: "4/4 CMYK",
    status: "Aktiv",
    hourlyRate: "95,00",
    colorClickCost: "0,033",
    blackClickCost: "0,008",
    duplex: "Ja",
    usage: "Hauptmaschine Farbdruck",
    note: "SRA3, hohe Qualität, Standard-Farbdruck",
    badgeVariant: "success",
  },
  {
    id: "machine-xerox-iridesse-special",
    number: "DM-1002",
    name: "Xerox Iridesse Sonderfarben",
    type: "Digitaldruck",
    colorMode: "CMYK + Sonderfarben",
    status: "Aktiv",
    hourlyRate: "105,00",
    colorClickCost: "0,033",
    blackClickCost: "0,008",
    duplex: "Ja",
    usage: "Sonderfarben / Premiumjobs",
    note: "Gold, Silber, Weiß oder Pink je nach Setup",
    badgeVariant: "success",
  },
  {
    id: "machine-xerox-nuvera",
    number: "DM-1003",
    name: "Xerox Nuvera",
    type: "Schwarzweißdruck",
    colorMode: "1/1 Schwarz",
    status: "Aktiv",
    hourlyRate: "75,00",
    colorClickCost: "0,000",
    blackClickCost: "0,008",
    duplex: "Ja",
    usage: "Schwarzweiß-Produktionen",
    note: "Hohe Leistung für 1/1 Jobs",
    badgeVariant: "success",
  },
  {
    id: "machine-canon-vp140",
    number: "DM-1004",
    name: "Canon VP140",
    type: "Schwarzweißdruck",
    colorMode: "1/1 Schwarz",
    status: "Wartung",
    hourlyRate: "75,00",
    colorClickCost: "0,000",
    blackClickCost: "0,008",
    duplex: "Ja",
    usage: "Backup Schwarzweiß",
    note: "Für 1/1 Produktionen und Ausweichjobs",
  },
  {
    id: "machine-roland-vg3-540",
    number: "DM-1005",
    name: "Roland TrueVis VG3 540",
    type: "Großformat",
    colorMode: "CMYK",
    status: "Aktiv",
    hourlyRate: "85,00",
    colorClickCost: "0,000",
    blackClickCost: "0,000",
    duplex: "Nein",
    usage: "Plotter / Großformat / Folie",
    note: "Rollenmaterial, Banner, Folien, Magnetfolie",
    badgeVariant: "success",
  },
];

export const initialPrintPilotServices: PrintPilotService[] = [
  {
    id: "service-data-check",
    number: "LS-1001",
    name: "Datencheck Standard",
    group: "Druckvorstufe",
    unit: "pauschal",
    status: "Aktiv",
    optional: "Nein",
    price: "12,50",
    description: "Standardprüfung von PDF-Druckdaten vor Produktion",
    badgeVariant: "success",
  },
  {
    id: "service-layout-small",
    number: "LS-1002",
    name: "Layoutanpassung klein",
    group: "Druckvorstufe",
    unit: "pauschal",
    status: "Aktiv",
    optional: "Ja",
    price: "25,00",
    description: "Kleine Layoutkorrekturen oder Format-/Beschnittanpassung",
    badgeVariant: "success",
  },
  {
    id: "service-proof",
    number: "LS-1003",
    name: "Digitalproof",
    group: "Proof",
    unit: "Stück",
    status: "Optional",
    optional: "Ja",
    price: "18,00",
    description: "Optionaler Proof vor Produktionsfreigabe",
  },
  {
    id: "service-express",
    number: "LS-1004",
    name: "Expresszuschlag",
    group: "Produktion",
    unit: "pauschal",
    status: "Optional",
    optional: "Ja",
    price: "35,00",
    description: "Zuschlag für bevorzugte Produktion nach Absprache",
  },
  {
    id: "service-old-handling",
    number: "LS-1005",
    name: "Alte Handlingpauschale",
    group: "Archiv",
    unit: "pauschal",
    status: "Archiv",
    optional: "Nein",
    price: "10,00",
    description: "Archivierte Leistung, nicht mehr aktiv im Standardangebot",
  },
];

export const initialPrintPilotFinishing: PrintPilotFinishingProcess[] = [
  {
    id: "finishing-cutting",
    number: "WV-1001",
    name: "Schneiden",
    category: "Schneiden",
    pricing: "Rüstzeit + Zeit",
    status: "Aktiv",
    standardUsage: "Standard bei fast allen Druckprodukten",
    setupTime: "10",
    hourlyRate: "65,00",
    description: "Planschnitt / Endformat schneiden",
    badgeVariant: "success",
  },
  {
    id: "finishing-folding",
    number: "WV-1002",
    name: "Falzen",
    category: "Falzen",
    pricing: "Rüstzeit + Stück",
    status: "Aktiv",
    standardUsage: "Flyer, Folder, Einleger",
    setupTime: "15",
    hourlyRate: "70,00",
    description: "Standardfalzarten für Digitaldruckprodukte",
    badgeVariant: "success",
  },
  {
    id: "finishing-creasing",
    number: "WV-1003",
    name: "Rillen",
    category: "Rillen",
    pricing: "Rüstzeit + Stück",
    status: "Aktiv",
    standardUsage: "Karton, Umschläge, Klappkarten",
    setupTime: "15",
    hourlyRate: "70,00",
    description: "Rillen vor dem Falzen bei stärkeren Materialien",
    badgeVariant: "success",
  },
  {
    id: "finishing-saddle-stitching",
    number: "WV-1004",
    name: "Rückendrahtheftung",
    category: "Heften",
    pricing: "Rüstzeit + Stück",
    status: "Aktiv",
    standardUsage: "Broschüren",
    setupTime: "20",
    hourlyRate: "75,00",
    description: "Broschürenheftung mit zwei Klammern",
    badgeVariant: "success",
  },
  {
    id: "finishing-perfect-binding",
    number: "WV-1005",
    name: "Klebebindung",
    category: "Binden",
    pricing: "Rüstzeit + Stück",
    status: "Optional",
    standardUsage: "Bücher, umfangreiche Broschüren",
    setupTime: "30",
    hourlyRate: "85,00",
    description: "Klebebindung nach technischer Prüfung",
  },
  {
    id: "finishing-handwork",
    number: "WV-1006",
    name: "Handarbeit",
    category: "Manuell",
    pricing: "Zeit",
    status: "Optional",
    standardUsage: "Sonderarbeiten",
    setupTime: "0",
    hourlyRate: "45,00",
    description: "Manuelle Tätigkeiten, Verpacken, Sortieren, Sonderkonfektionierung",
  },
  {
    id: "finishing-old-diecut",
    number: "WV-1007",
    name: "Archivierte Stanzung",
    category: "Stanzen",
    pricing: "Archiv",
    status: "Archiv",
    standardUsage: "Nicht mehr aktiv",
    setupTime: "0",
    hourlyRate: "0,00",
    description: "Archivierter Weiterverarbeitungsprozess",
  },
];

export const initialPrintPilotTemplates: PrintPilotTemplate[] = [
  {
    id: "template-standard-quote",
    number: "VL-1001",
    name: "Standardangebot",
    type: "Angebot",
    area: "Verkauf",
    status: "Aktiv",
    isDefault: "Ja",
    productType: "Digitaldruck",
    outputLayout: "Klassisch mit Positionstabelle",
    badgeVariant: "success",
  },
  {
    id: "template-short-quote",
    number: "VL-1002",
    name: "Kurzangebot",
    type: "Angebot",
    area: "Verkauf",
    status: "Aktiv",
    isDefault: "Nein",
    productType: "Kleinauftrag",
    outputLayout: "Kompakt",
    badgeVariant: "success",
  },
  {
    id: "template-technical-quote",
    number: "VL-1003",
    name: "Technisches Angebot",
    type: "Angebot",
    area: "Verkauf",
    status: "Entwurf",
    isDefault: "Nein",
    productType: "Sonderproduktion",
    outputLayout: "Technisch mit Parametern",
  },
  {
    id: "template-delivery-note",
    number: "VL-1004",
    name: "Standard-Lieferschein",
    type: "Lieferschein",
    area: "Ausgabe",
    status: "Aktiv",
    isDefault: "Ja",
    productType: "Alle",
    outputLayout: "Lieferschein mit Empfängerblock",
    badgeVariant: "success",
  },
  {
    id: "template-invoice",
    number: "VL-1005",
    name: "Standard-Rechnung",
    type: "Rechnung",
    area: "Faktura",
    status: "Aktiv",
    isDefault: "Ja",
    productType: "Alle",
    outputLayout: "Rechnung mit Summenblock",
    badgeVariant: "success",
  },
  {
    id: "template-old-layout",
    number: "VL-1006",
    name: "Altes Angebotslayout",
    type: "Angebot",
    area: "Archiv",
    status: "Archiv",
    isDefault: "Nein",
    productType: "Archiv",
    outputLayout: "Nicht mehr verwenden",
  },
];

export const initialPrintPilotOrders: PrintPilotOrder[] = [
  {
    id: "order-au-2026-001",
    number: "AU-2026-001",
    quoteId: "quote-ag-2026-001",
    customerId: "customer-sonnendruck",
    customerName: "Sonnendruck GmbH",
    product: "Broschüre A4",
    status: "Neu",
    dueDate: "2026-05-20",
    machine: "Xerox Iridesse 1",
    priority: "Normal",
    handoff: "Druckdaten prüfen",
    approval: "Freigabe offen",
  },
  {
    id: "order-au-2026-002",
    number: "AU-2026-002",
    quoteId: "quote-ag-2026-002",
    customerId: "customer-musterkunde",
    customerName: "Musterkunde GmbH",
    product: "Flyer A5",
    status: "In Produktion",
    dueDate: "2026-05-16",
    machine: "Xerox Iridesse Sonderfarben",
    priority: "Hoch",
    handoff: "In Druck",
    approval: "Freigegeben",
    badgeVariant: "success",
  },
  {
    id: "order-au-2026-003",
    number: "AU-2026-003",
    quoteId: null,
    customerId: "customer-agentur-beispiel",
    customerName: "Agentur Beispiel",
    product: "Visitenkarten",
    status: "Wartet",
    dueDate: "2026-05-22",
    machine: "Xerox Iridesse 1",
    priority: "Normal",
    handoff: "Wartet auf Daten",
    approval: "Kundenfreigabe fehlt",
  },
  {
    id: "order-au-2026-004",
    number: "AU-2026-004",
    quoteId: null,
    customerId: "customer-sonnendruck",
    customerName: "Sonnendruck GmbH",
    product: "Folder DIN lang",
    status: "Fertig",
    dueDate: "2026-05-10",
    machine: "Xerox Nuvera",
    priority: "Normal",
    handoff: "Abholbereit",
    approval: "Freigegeben",
    badgeVariant: "success",
  },
  {
    id: "order-au-2026-005",
    number: "AU-2026-005",
    quoteId: null,
    customerId: "customer-testkunde-kg",
    customerName: "Testkunde KG",
    product: "Altes Kartenprojekt",
    status: "Archiv",
    dueDate: "2026-04-20",
    machine: "Canon VP140",
    priority: "Niedrig",
    handoff: "Abgeschlossen",
    approval: "Archiv",
  },
];

export const initialPrintPilotReminders: PrintPilotReminder[] = [
  {
    id: "reminder-ma-2026-001",
    number: "MA-2026-001",
    invoiceId: "invoice-re-2026-001",
    invoiceNumber: "RE-2026-001",
    customerId: "customer-sonnendruck",
    customerName: "Sonnendruck GmbH",
    subject: "Broschüre A4",
    status: "Entwurf",
    reminderLevel: "Zahlungserinnerung",
    deadline: "7 Tage",
    template: "Zahlungserinnerung",
    note: "Freundliche Erinnerung senden",
    badgeVariant: "success",
  },
  {
    id: "reminder-ma-2026-002",
    number: "MA-2026-002",
    invoiceId: "invoice-re-2026-002",
    invoiceNumber: "RE-2026-002",
    customerId: "customer-musterkunde",
    customerName: "Musterkunde GmbH",
    subject: "Flyer A5",
    status: "Offen",
    reminderLevel: "1. Mahnung",
    deadline: "10 Tage",
    template: "Standardmahnung",
    note: "Offene Rechnung prüfen",
  },
  {
    id: "reminder-ma-2026-003",
    number: "MA-2026-003",
    invoiceId: "invoice-re-2026-003",
    invoiceNumber: "RE-2026-003",
    customerId: "customer-agentur-beispiel",
    customerName: "Beispiel AG",
    subject: "Folder DIN lang",
    status: "Versendet",
    reminderLevel: "2. Mahnung",
    deadline: "7 Tage",
    template: "Standardmahnung",
    note: "Bereits versendet",
  },
  {
    id: "reminder-ma-2026-008",
    number: "MA-2026-008",
    invoiceId: "invoice-re-2026-009",
    invoiceNumber: "RE-2026-009",
    customerId: "customer-testkunde-kg",
    customerName: "Testkunde KG",
    subject: "Plakat A1",
    status: "Erledigt",
    reminderLevel: "Letzte Mahnung",
    deadline: "14 Tage",
    template: "Letzte Mahnung",
    note: "Erledigt",
    badgeVariant: "success",
  },
];

export const initialPrintPilotInvoices: PrintPilotInvoice[] = [
  {
    id: "invoice-re-2026-001",
    number: "RE-2026-001",
    orderId: "order-au-2026-001",
    orderNumber: "AU-2026-001",
    customerId: "customer-sonnendruck",
    customerName: "Sonnendruck GmbH",
    subject: "Broschüre A4",
    status: "Entwurf",
    paymentTerms: "14 Tage netto",
    paymentType: "Überweisung",
    template: "Standardrechnung",
    invoiceDate: "2026-05-05",
    dueDate: "2026-05-19",
    badgeVariant: "success",
  },
  {
    id: "invoice-re-2026-002",
    number: "RE-2026-002",
    orderId: "order-au-2026-002",
    orderNumber: "AU-2026-002",
    customerId: "customer-musterkunde",
    customerName: "Musterkunde GmbH",
    subject: "Flyer A5",
    status: "Offen",
    paymentTerms: "14 Tage netto",
    paymentType: "Überweisung",
    template: "Standardrechnung",
    invoiceDate: "2026-05-03",
    dueDate: "2026-05-17",
  },
  {
    id: "invoice-re-2026-003",
    number: "RE-2026-003",
    orderId: "order-au-2026-003",
    orderNumber: "AU-2026-003",
    customerId: "customer-agentur-beispiel",
    customerName: "Beispiel AG",
    subject: "Folder DIN lang",
    status: "Bezahlt",
    paymentTerms: "30 Tage netto",
    paymentType: "Überweisung",
    template: "Kurzrechnung",
    invoiceDate: "2026-04-22",
    dueDate: "2026-05-22",
    badgeVariant: "success",
  },
  {
    id: "invoice-re-2026-009",
    number: "RE-2026-009",
    orderId: "order-au-2026-005",
    orderNumber: "AU-2026-005",
    customerId: "customer-testkunde-kg",
    customerName: "Testkunde KG",
    subject: "Plakat A1",
    status: "Überfällig",
    paymentTerms: "Sofort ohne Abzug",
    paymentType: "Überweisung",
    template: "Standardrechnung",
    invoiceDate: "2026-04-01",
    dueDate: "2026-04-15",
  },
];

export function createPrintPilotQuoteFromSettings(
  settings: PrintPilotSettings,
): PrintPilotQuote {
  const number = formatPrintPilotDocumentNumber(
    settings.quotePrefix,
    settings.quoteNextNumber,
  );
  const quoteDate = new Date().toISOString().slice(0, 10);
  const validUntil = addDaysToIsoDate(quoteDate, 14);

  return {
    id: `quote-${number.toLowerCase()}`,
    number,
    customerId: null,
    customerName: "",
    subject: "",
    status: "Entwurf",
    quoteDate,
    validUntil,
    paymentTerms: "14 Tage netto",
    deliveryTerms: "Abholung",
    template: "Standardangebot",
  };
}

function getNextOrderNumber(orders: PrintPilotOrder[]) {
  const year = new Date().getFullYear();
  const numbersForYear = orders
    .map((order) => order.number)
    .filter((number) => number.startsWith(`AU-${year}-`))
    .map((number) => Number(number.replace(`AU-${year}-`, "")))
    .filter((number) => Number.isFinite(number));

  const nextNumber =
    numbersForYear.length > 0 ? Math.max(...numbersForYear) + 1 : 1;

  return `AU-${year}-${String(nextNumber).padStart(3, "0")}`;
}

export function createPrintPilotOrderFromQuote(
  quote: PrintPilotQuote,
  settings: PrintPilotSettings,
): PrintPilotOrder {
  const number = formatPrintPilotDocumentNumber(
    settings.orderPrefix,
    settings.orderNextNumber,
  );

  return {
    id: `order-${number.toLowerCase()}`,
    number,
    quoteId: quote.id,
    customerId: quote.customerId,
    customerName: quote.customerName,
    product: quote.subject,
    status: "Neu",
    dueDate: quote.validUntil,
    machine: "",
    priority: "Normal",
    handoff: "Druckdaten prüfen",
    approval: "Freigabe ausstehend",
  };
}


export const initialPrintPilotDeliveryNotes: PrintPilotDeliveryNote[] = [
  {
    id: "delivery-ls-2026-001",
    number: "LS-2026-001",
    orderId: "order-au-2026-001",
    orderNumber: "AU-2026-001",
    customerId: "customer-sonnendruck",
    customerName: "Sonnendruck GmbH",
    product: "Broschüre A4",
    status: "Entwurf",
    shippingMethod: "Abholung",
    recipient: "Sonnendruck GmbH",
    address: "Musterstraße 12, 69115 Heidelberg",
    template: "Standardlieferschein",
    badgeVariant: "success",
  },
  {
    id: "delivery-ls-2026-002",
    number: "LS-2026-002",
    orderId: "order-au-2026-002",
    orderNumber: "AU-2026-002",
    customerId: "customer-musterkunde",
    customerName: "Musterkunde GmbH",
    product: "Flyer A5",
    status: "Versandbereit",
    shippingMethod: "Auslieferung",
    recipient: "Musterkunde GmbH",
    address: "Beispielweg 4, 68159 Mannheim",
    template: "Standardlieferschein",
  },
  {
    id: "delivery-ls-2026-003",
    number: "LS-2026-003",
    orderId: "order-au-2026-003",
    orderNumber: "AU-2026-003",
    customerId: "customer-agentur-beispiel",
    customerName: "Agentur Beispiel",
    product: "Visitenkarten",
    status: "Geliefert",
    shippingMethod: "Paketdienst",
    recipient: "Agentur Beispiel",
    address: "Designallee 8, 69120 Heidelberg",
    template: "Neutraler Lieferschein",
    badgeVariant: "success",
  },
  {
    id: "delivery-ls-2026-008",
    number: "LS-2026-008",
    orderId: "order-au-2026-008",
    orderNumber: "AU-2026-008",
    customerId: null,
    customerName: "Druckpartner Süd",
    product: "Technischer Auftrag",
    status: "Abgeschlossen",
    shippingMethod: "Spedition",
    recipient: "Druckpartner Süd",
    address: "Südstraße 5, 69190 Walldorf",
    template: "Technischer Lieferschein",
    badgeVariant: "success",
  },
];

export function formatPrintPilotDocumentNumber(prefix: string, nextNumber: string) {
  return `${prefix}-${nextNumber}`;
}

export function getNextPrintPilotDocumentNumber(nextNumber: string) {
  const currentYear = new Date().getFullYear();
  const fallbackNumber = `${currentYear}-001`;
  const match = nextNumber.match(/^(\d{4})-(\d+)$/);

  if (!match) {
    return fallbackNumber;
  }

  const [, year, numericValue] = match;
  const nextNumericValue =
    year === String(currentYear) ? Number(numericValue) + 1 : 1;

  if (!Number.isFinite(nextNumericValue)) {
    return fallbackNumber;
  }

  return `${currentYear}-${String(nextNumericValue).padStart(numericValue.length, "0")}`;
}

function getNextReminderNumber(reminders: PrintPilotReminder[]) {
  const year = new Date().getFullYear();
  const numbersForYear = reminders
    .map((reminder) => reminder.number)
    .filter((number) => number.startsWith(`MA-${year}-`))
    .map((number) => Number(number.replace(`MA-${year}-`, "")))
    .filter((number) => Number.isFinite(number));

  const nextNumber =
    numbersForYear.length > 0 ? Math.max(...numbersForYear) + 1 : 1;

  return `MA-${year}-${String(nextNumber).padStart(3, "0")}`;
}

export function createPrintPilotReminderFromInvoice(
  invoice: PrintPilotInvoice,
  settings: PrintPilotSettings,
): PrintPilotReminder {
  const number = formatPrintPilotDocumentNumber(
    settings.reminderPrefix,
    settings.reminderNextNumber,
  );

  return {
    id: `reminder-${number.toLowerCase()}`,
    number,
    invoiceId: invoice.id,
    invoiceNumber: invoice.number,
    customerId: invoice.customerId,
    customerName: invoice.customerName,
    subject: invoice.subject,
    status: "Entwurf",
    reminderLevel: "1. Mahnung",
    deadline: "7 Tage",
    template: "Standardmahnung",
    note: `Erstellt aus Rechnung ${invoice.number}`,
  };
}

function getNextInvoiceNumber(invoices: PrintPilotInvoice[]) {
  const year = new Date().getFullYear();
  const numbersForYear = invoices
    .map((invoice) => invoice.number)
    .filter((number) => number.startsWith(`RE-${year}-`))
    .map((number) => Number(number.replace(`RE-${year}-`, "")))
    .filter((number) => Number.isFinite(number));

  const nextNumber =
    numbersForYear.length > 0 ? Math.max(...numbersForYear) + 1 : 1;

  return `RE-${year}-${String(nextNumber).padStart(3, "0")}`;
}

function addDaysToIsoDate(value: string, days: number) {
  const baseDate = value ? new Date(`${value}T00:00:00`) : new Date();

  if (Number.isNaN(baseDate.getTime())) {
    return "";
  }

  baseDate.setDate(baseDate.getDate() + days);

  return baseDate.toISOString().slice(0, 10);
}

export function createPrintPilotInvoiceFromOrder(
  order: PrintPilotOrder,
  settings: PrintPilotSettings,
): PrintPilotInvoice {
  const number = formatPrintPilotDocumentNumber(
    settings.invoicePrefix,
    settings.invoiceNextNumber,
  );
  const invoiceDate = new Date().toISOString().slice(0, 10);

  return {
    id: `invoice-${number.toLowerCase()}`,
    number,
    orderId: order.id,
    orderNumber: order.number,
    customerId: order.customerId,
    customerName: order.customerName,
    subject: order.product,
    status: "Entwurf",
    paymentTerms: "14 Tage netto",
    paymentType: "Überweisung",
    template: "Standardrechnung",
    invoiceDate,
    dueDate: addDaysToIsoDate(invoiceDate, 14),
  };
}

function getNextDeliveryNoteNumber(deliveryNotes: PrintPilotDeliveryNote[]) {
  const year = new Date().getFullYear();
  const numbersForYear = deliveryNotes
    .map((deliveryNote) => deliveryNote.number)
    .filter((number) => number.startsWith(`LS-${year}-`))
    .map((number) => Number(number.replace(`LS-${year}-`, "")))
    .filter((number) => Number.isFinite(number));

  const nextNumber =
    numbersForYear.length > 0 ? Math.max(...numbersForYear) + 1 : 1;

  return `LS-${year}-${String(nextNumber).padStart(3, "0")}`;
}

export function createPrintPilotDeliveryNoteFromOrder(
  order: PrintPilotOrder,
  settings: PrintPilotSettings,
): PrintPilotDeliveryNote {
  const number = formatPrintPilotDocumentNumber(
    settings.deliveryNotePrefix,
    settings.deliveryNoteNextNumber,
  );

  return {
    id: `delivery-${number.toLowerCase()}`,
    number,
    orderId: order.id,
    orderNumber: order.number,
    customerId: order.customerId,
    customerName: order.customerName,
    product: order.product,
    status: "Entwurf",
    shippingMethod: "Abholung",
    recipient: order.customerName,
    address: "",
    template: "Standardlieferschein",
  };
}

function comparePrintPilotNextNumbers(a: string, b: string) {
  const parse = (value: string) => {
    const match = value.match(/^(\d{4})-(\d+)$/);

    if (!match) {
      return { year: 0, number: 0 };
    }

    return {
      year: Number(match[1]),
      number: Number(match[2]),
    };
  };

  const parsedA = parse(a);
  const parsedB = parse(b);

  if (parsedA.year !== parsedB.year) {
    return parsedA.year - parsedB.year;
  }

  return parsedA.number - parsedB.number;
}

function getNextNumberFromExistingNumbers(
  existingNumbers: string[],
  prefix: string,
  fallbackNextNumber: string,
) {
  const year = new Date().getFullYear();
  const prefixWithYear = `${prefix}-${year}-`;

  const numericValues = existingNumbers
    .filter((number) => number.startsWith(prefixWithYear))
    .map((number) => Number(number.replace(prefixWithYear, "")))
    .filter((number) => Number.isFinite(number));

  if (numericValues.length === 0) {
    return fallbackNextNumber;
  }

  const nextFromExisting = `${year}-${String(Math.max(...numericValues) + 1).padStart(
    3,
    "0",
  )}`;

  return comparePrintPilotNextNumbers(nextFromExisting, fallbackNextNumber) > 0
    ? nextFromExisting
    : fallbackNextNumber;
}

export function synchronizePrintPilotNumberRanges(
  data: PrintPilotStoreData,
): PrintPilotStoreData {
  const settings = data.settings;

  return {
    ...data,
    settings: {
      ...settings,
      quoteNextNumber: getNextNumberFromExistingNumbers(
        data.quotes.map((quote) => quote.number),
        settings.quotePrefix,
        settings.quoteNextNumber,
      ),
      orderNextNumber: getNextNumberFromExistingNumbers(
        data.orders.map((order) => order.number),
        settings.orderPrefix,
        settings.orderNextNumber,
      ),
      deliveryNoteNextNumber: getNextNumberFromExistingNumbers(
        data.deliveryNotes.map((deliveryNote) => deliveryNote.number),
        settings.deliveryNotePrefix,
        settings.deliveryNoteNextNumber,
      ),
      invoiceNextNumber: getNextNumberFromExistingNumbers(
        data.invoices.map((invoice) => invoice.number),
        settings.invoicePrefix,
        settings.invoiceNextNumber,
      ),
      reminderNextNumber: getNextNumberFromExistingNumbers(
        data.reminders.map((reminder) => reminder.number),
        settings.reminderPrefix,
        settings.reminderNextNumber,
      ),
    },
  };
}


export function createEmptyPrintPilotStoreData(): PrintPilotStoreData {
  return {
    customers: initialPrintPilotCustomers,
    quotes: initialPrintPilotQuotes,
    orders: initialPrintPilotOrders,
    invoices: initialPrintPilotInvoices,
    reminders: initialPrintPilotReminders,
    deliveryNotes: initialPrintPilotDeliveryNotes,
    materials: initialPrintPilotMaterials,
    machines: initialPrintPilotMachines,
    services: initialPrintPilotServices,
    finishing: initialPrintPilotFinishing,
    templates: initialPrintPilotTemplates,
    settings: initialPrintPilotSettings,
  };
}

export function createPrintPilotStoreSnapshot(
  overrides: Partial<PrintPilotStoreData> = {},
): PrintPilotStoreData {
  const emptyStore = createEmptyPrintPilotStoreData();

  const snapshot = {
    ...emptyStore,
    ...overrides,
    customers:
      overrides.customers && overrides.customers.length > 0
        ? overrides.customers
        : emptyStore.customers,
    quotes:
      overrides.quotes && overrides.quotes.length > 0
        ? overrides.quotes
        : emptyStore.quotes,
    orders:
      overrides.orders && overrides.orders.length > 0
        ? overrides.orders
        : emptyStore.orders,
    invoices:
      overrides.invoices && overrides.invoices.length > 0
        ? overrides.invoices
        : emptyStore.invoices,
    reminders:
      overrides.reminders && overrides.reminders.length > 0
        ? overrides.reminders
        : emptyStore.reminders,
    deliveryNotes:
      overrides.deliveryNotes && overrides.deliveryNotes.length > 0
        ? overrides.deliveryNotes
        : emptyStore.deliveryNotes,
    materials:
      overrides.materials && overrides.materials.length > 0
        ? overrides.materials
        : emptyStore.materials,
    machines:
      overrides.machines && overrides.machines.length > 0
        ? overrides.machines
        : emptyStore.machines,
    services:
      overrides.services && overrides.services.length > 0
        ? overrides.services
        : emptyStore.services,
    finishing:
      overrides.finishing && overrides.finishing.length > 0
        ? overrides.finishing
        : emptyStore.finishing,
    templates:
      overrides.templates && overrides.templates.length > 0
        ? overrides.templates
        : emptyStore.templates,
    settings: {
      ...emptyStore.settings,
      ...(overrides.settings ?? {}),
    },
  };

  return synchronizePrintPilotNumberRanges(snapshot);
}

export function groupPrintPilotCustomersByStatus(
  customers: PrintPilotCustomer[],
): Record<PrintPilotCustomerStatus, PrintPilotCustomer[]> {
  return {
    Aktiv: customers.filter((customer) => customer.status === "Aktiv"),
    Interessent: customers.filter((customer) => customer.status === "Interessent"),
    Inaktiv: customers.filter((customer) => customer.status === "Inaktiv"),
  };
}

export function groupPrintPilotMachinesByStatus(
  machines: PrintPilotMachine[],
): Record<PrintPilotMachineStatus, PrintPilotMachine[]> {
  return {
    Aktiv: machines.filter((machine) => machine.status === "Aktiv"),
    Wartung: machines.filter((machine) => machine.status === "Wartung"),
    Archiv: machines.filter((machine) => machine.status === "Archiv"),
  };
}

export function groupPrintPilotMaterialsByStatus(
  materials: PrintPilotMaterial[],
): Record<PrintPilotMaterialStatus, PrintPilotMaterial[]> {
  return {
    "Auf Lager": materials.filter((material) => material.status === "Auf Lager"),
    Knapp: materials.filter((material) => material.status === "Knapp"),
    Bestellen: materials.filter((material) => material.status === "Bestellen"),
    Archiv: materials.filter((material) => material.status === "Archiv"),
  };
}

export function groupPrintPilotServicesByStatus(
  services: PrintPilotService[],
): Record<PrintPilotServiceStatus, PrintPilotService[]> {
  return {
    Aktiv: services.filter((service) => service.status === "Aktiv"),
    Optional: services.filter((service) => service.status === "Optional"),
    Archiv: services.filter((service) => service.status === "Archiv"),
  };
}

export function groupPrintPilotFinishingByStatus(
  finishing: PrintPilotFinishingProcess[],
): Record<PrintPilotFinishingStatus, PrintPilotFinishingProcess[]> {
  return {
    Aktiv: finishing.filter((process) => process.status === "Aktiv"),
    Optional: finishing.filter((process) => process.status === "Optional"),
    Archiv: finishing.filter((process) => process.status === "Archiv"),
  };
}

export function groupPrintPilotTemplatesByStatus(
  templates: PrintPilotTemplate[],
): Record<PrintPilotTemplateStatus, PrintPilotTemplate[]> {
  return {
    Aktiv: templates.filter((template) => template.status === "Aktiv"),
    Entwurf: templates.filter((template) => template.status === "Entwurf"),
    Archiv: templates.filter((template) => template.status === "Archiv"),
  };
}


export function getPrintPilotApprovalBadgeVariant(
  approval: PrintPilotApprovalStatus,
): "success" | "warning" | "danger" | "neutral" {
  switch (approval) {
    case "Freigabe erteilt":
    case "Freigegeben":
      return "success";

    case "Freigabe ausstehend":
    case "Freigabe offen":
    case "Kundenfreigabe fehlt":
    case "Daten unvollständig":
      return "danger";

    case "Korrektur angefordert":
      return "warning";

    case "Nicht erforderlich":
    case "Archiv":
    default:
      return "neutral";
  }
}

export function groupPrintPilotDeliveryNotesByStatus(
  deliveryNotes: PrintPilotDeliveryNote[],
): Record<PrintPilotDeliveryNoteStatus, PrintPilotDeliveryNote[]> {
  return {
    Entwurf: deliveryNotes.filter((deliveryNote) => deliveryNote.status === "Entwurf"),
    Versandbereit: deliveryNotes.filter(
      (deliveryNote) => deliveryNote.status === "Versandbereit",
    ),
    Geliefert: deliveryNotes.filter((deliveryNote) => deliveryNote.status === "Geliefert"),
    Abgeschlossen: deliveryNotes.filter(
      (deliveryNote) => deliveryNote.status === "Abgeschlossen",
    ),
  };
}

export function groupPrintPilotRemindersByStatus(
  reminders: PrintPilotReminder[],
): Record<PrintPilotReminderStatus, PrintPilotReminder[]> {
  return {
    Entwurf: reminders.filter((reminder) => reminder.status === "Entwurf"),
    Offen: reminders.filter((reminder) => reminder.status === "Offen"),
    Versendet: reminders.filter((reminder) => reminder.status === "Versendet"),
    Erledigt: reminders.filter((reminder) => reminder.status === "Erledigt"),
  };
}

export function groupPrintPilotInvoicesByStatus(
  invoices: PrintPilotInvoice[],
): Record<PrintPilotInvoiceStatus, PrintPilotInvoice[]> {
  return {
    Entwurf: invoices.filter((invoice) => invoice.status === "Entwurf"),
    Offen: invoices.filter((invoice) => invoice.status === "Offen"),
    Bezahlt: invoices.filter((invoice) => invoice.status === "Bezahlt"),
    Überfällig: invoices.filter((invoice) => invoice.status === "Überfällig"),
  };
}

export function groupPrintPilotOrdersByStatus(
  orders: PrintPilotOrder[],
): Record<PrintPilotOrderStatus, PrintPilotOrder[]> {
  return {
    Neu: orders.filter((order) => order.status === "Neu"),
    "In Produktion": orders.filter((order) => order.status === "In Produktion"),
    Wartet: orders.filter((order) => order.status === "Wartet"),
    Fertig: orders.filter((order) => order.status === "Fertig"),
    Archiv: orders.filter((order) => order.status === "Archiv"),
  };
}

export function groupPrintPilotQuotesByStatus(
  quotes: PrintPilotQuote[],
): Record<PrintPilotQuoteStatus, PrintPilotQuote[]> {
  return {
    Entwurf: quotes.filter((quote) => quote.status === "Entwurf"),
    Offen: quotes.filter((quote) => quote.status === "Offen"),
    Angenommen: quotes.filter((quote) => quote.status === "Angenommen"),
    Abgelehnt: quotes.filter((quote) => quote.status === "Abgelehnt"),
  };
}
