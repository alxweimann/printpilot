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

export function createEmptyPrintPilotStoreData(): PrintPilotStoreData {
  return {
    customers: initialPrintPilotCustomers,
    quotes: initialPrintPilotQuotes,
    orders: [],
    materials: initialPrintPilotMaterials,
    machines: initialPrintPilotMachines,
    services: initialPrintPilotServices,
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
    customers:
      overrides.customers && overrides.customers.length > 0
        ? overrides.customers
        : emptyStore.customers,
    quotes:
      overrides.quotes && overrides.quotes.length > 0
        ? overrides.quotes
        : emptyStore.quotes,
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
