export type PrintPilotId = string;

export type PrintPilotCustomer = {
  id: PrintPilotId;
  number: string;
  name: string;
  type: string;
  street: string;
  zip: string;
  city: string;
  contact: string;
  phone: string;
  email: string;
  paymentTerm: string;
  priceLevel: string;
};

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
};

export type PrintPilotOrder = {
  id: PrintPilotId;
  number: string;
  quoteId: PrintPilotId | null;
  customerId: PrintPilotId | null;
  customerName: string;
  product: string;
  status: string;
  dueDate: string;
  machine: string;
  priority: string;
  handoff: string;
  approval: string;
};

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
  status: string;
  minimumStock: string;
  storageLocation: string;
};

export type PrintPilotMachine = {
  id: PrintPilotId;
  number: string;
  name: string;
  type: string;
  colorMode: string;
  status: string;
  hourlyRate: string;
  colorClickCost: string;
  blackClickCost: string;
  duplex: string;
  usage: string;
  note: string;
};

export type PrintPilotService = {
  id: PrintPilotId;
  number: string;
  name: string;
  group: string;
  unit: string;
  status: string;
  optional: string;
  price: string;
  description: string;
};

export type PrintPilotFinishingProcess = {
  id: PrintPilotId;
  number: string;
  name: string;
  category: string;
  pricing: string;
  status: string;
  standardUsage: string;
  setupTime: string;
  hourlyRate: string;
  description: string;
};

export type PrintPilotTemplate = {
  id: PrintPilotId;
  number: string;
  name: string;
  type: string;
  area: string;
  status: string;
  isDefault: string;
  productType: string;
  outputLayout: string;
};

export type PrintPilotSettings = {
  id: PrintPilotId;
  mode: string;
  startModule: string;
  defaultCalculationModule: string;
  quotePrefix: string;
  quoteNextNumber: string;
  orderPrefix: string;
  orderNextNumber: string;
  invoicePrefix: string;
  invoiceNextNumber: string;
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
};

export type PrintPilotStoreData = {
  customers: PrintPilotCustomer[];
  quotes: PrintPilotQuote[];
  orders: PrintPilotOrder[];
  materials: PrintPilotMaterial[];
  machines: PrintPilotMachine[];
  services: PrintPilotService[];
  finishing: PrintPilotFinishingProcess[];
  templates: PrintPilotTemplate[];
  settings: PrintPilotSettings;
};

export const initialPrintPilotSettings: PrintPilotSettings = {
  id: "settings-local",
  mode: "Lokal",
  startModule: "Dashboard",
  defaultCalculationModule: "Kalkulation",
  quotePrefix: "AG",
  quoteNextNumber: "2026-001",
  orderPrefix: "AU",
  orderNextNumber: "2026-001",
  invoicePrefix: "RE",
  invoiceNextNumber: "2026-001",
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
};

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
    id: "quote-ag-2026-005",
    number: "AG-2026-005",
    customerId: "customer-druckpartner-sued",
    customerName: "Druckpartner Süd",
    subject: "Plakat A2",
    status: "Offen",
    quoteDate: "2026-05-02",
    validUntil: "2026-05-16",
    paymentTerms: "30 Tage netto",
    deliveryTerms: "Versand nach Aufwand",
    template: "Technisches Angebot",
  },
  {
    id: "quote-ag-2026-006",
    number: "AG-2026-006",
    customerId: "customer-beispiel-ag",
    customerName: "Beispiel AG",
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

export function createEmptyPrintPilotStoreData(): PrintPilotStoreData {
  return {
    customers: [],
    quotes: initialPrintPilotQuotes,
    orders: [],
    materials: [],
    machines: [],
    services: [],
    finishing: [],
    templates: [],
    settings: initialPrintPilotSettings,
  };
}

export function createPrintPilotStoreSnapshot(
  overrides: Partial<PrintPilotStoreData> = {},
): PrintPilotStoreData {
  const emptyStore = createEmptyPrintPilotStoreData();

  return {
    ...emptyStore,
    ...overrides,
    settings: {
      ...emptyStore.settings,
      ...(overrides.settings ?? {}),
    },
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
