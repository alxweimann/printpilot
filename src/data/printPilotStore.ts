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

export function createEmptyPrintPilotStoreData(): PrintPilotStoreData {
  return {
    customers: initialPrintPilotCustomers,
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

export function groupPrintPilotCustomersByStatus(
  customers: PrintPilotCustomer[],
): Record<PrintPilotCustomerStatus, PrintPilotCustomer[]> {
  return {
    Aktiv: customers.filter((customer) => customer.status === "Aktiv"),
    Interessent: customers.filter((customer) => customer.status === "Interessent"),
    Inaktiv: customers.filter((customer) => customer.status === "Inaktiv"),
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
