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

export type PrintPilotQuote = {
  id: PrintPilotId;
  number: string;
  customerId: PrintPilotId | null;
  customerName: string;
  subject: string;
  status: string;
  quoteDate: string;
  validUntil: string;
  paymentTerms: string;
  deliveryTerms: string;
  template: string;
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

export function createEmptyPrintPilotStoreData(): PrintPilotStoreData {
  return {
    customers: [],
    quotes: [],
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
