import { useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import "./index.css";

import { materials } from "./data/materials";
import { machines } from "./data/machines";
import { finishingOperations } from "./data/finishing";
import { companyProfile } from "./data/company";
import {
  calculateMaterialPricePerSheet,
  calculateSheetAreaSqm,
  calculateSheetWeightKg,
  formatCurrency,
  formatNumber,
  getClicksForColorMode,
  getPricingModeLabel,
} from "./lib/calculation";

type PageKey =
  | "dashboard"
  | "calculator"
  | "quotes"
  | "customers"
  | "materials"
  | "machines"
  | "finishing"
  | "imposition"
  | "services"
  | "calcTemplates"
  | "settings";

type ProductType = string;

type MachineCostModel = "click" | "risoInk" | "roland";

type RisoInkCoverage = "low" | "normal" | "high" | "full";

type RolandProductionMode = "print" | "printCut" | "cutOnly";

type InkChannel = {
  id: string;
  name: string;
  cartridgePrice: number;
  cartridgeSizeMl: number;
  cartridgeYieldPages: number;
  active: boolean;
};

type MachineBase = (typeof machines)[number];

type Machine = MachineBase & {
  inkChannels?: InkChannel[];
  rolandDefaultInkMlPerSqm?: number;
  rolandMaintenancePercent?: number;
};

type Material = (typeof materials)[number];

type FinishingOperation = (typeof finishingOperations)[number];

type MaterialCalculationMode = "manual" | "perCopy" | "pages";

type MaterialSelection = {
  id: string;
  label: string;
  materialId: string;
  calculationMode: MaterialCalculationMode;
  manualSheets: number;
  factorPerCopy: number;
  pages: number;
  pagesPerSheet: number;
  itemsPerSheet: number;
};

type FinishingSelection = {
  id: string;
  operationId: string;
};

type QuotePosition = {
  id: string;
  title: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  internalNote?: string;
};

type DocumentStatus =
  | "Entwurf"
  | "Versendet"
  | "Angenommen"
  | "Abgelehnt"
  | "Abgerechnet"
  | "Bezahlt"
  | "Storniert";

type PaymentStatus =
  | "Offen"
  | "Teilbezahlt"
  | "Bezahlt"
  | "Überfällig"
  | "Storniert";

type SavedDocument = {
  id: string;
  documentType: DocumentType;
  documentNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  validUntil: string;
  introText: string;
  deliveryTerms: string;
  paymentTerms: string;
  positions: QuotePosition[];
  status: DocumentStatus;
  paymentStatus?: PaymentStatus;
  paymentDueDate?: string;
  paymentPaidDate?: string;
  paymentPaidAmount?: number;
  createdAt: string;
  updatedAt: string;
};

type Customer = {
  id: string;
  customerNumber: string;
  company: string;
  contactPerson: string;
  street: string;
  zip: string;
  city: string;
  email: string;
  phone: string;
  status: "Aktiv" | "Interessent" | "Inaktiv";
  notes: string;
};

type ServiceItem = {
  id: string;
  itemNumber: string;
  title: string;
  category: string;
  description: string;
  unit: string;
  unitPrice: number;
  vatRate: number;
  status: "Aktiv" | "Inaktiv";
};

type NavItem = {
  key: PageKey;
  label: string;
  description: string;
  accent: string;
};

type ProductTemplate = {
  productName: string;
  finalWidthMm: number;
  finalHeightMm: number;
  itemsPerSheet: number;
  colorMode: string;
  materialSelections: Omit<MaterialSelection, "id">[];
  finishingNames: string[];
  bleedMm?: number;
  gripperMarginMm?: number;
  sheetMarginMm?: number;
  gutterHorizontalMm?: number;
  gutterVerticalMm?: number;
  allowRotation?: boolean;
  respectGrainDirection?: boolean;
  rawSheetMaterialId?: string;
  removeSpineBleed?: boolean;
  calculateAsOpenSpread?: boolean;
};

type CalculationTemplateStatus = "Aktiv" | "Inaktiv";

type CalculationTemplate = ProductTemplate & {
  id: string;
  name: string;
  productType: ProductType;
  defaultQuantity: number;
  machineId: string;
  status: CalculationTemplateStatus;
  bleedMm: number;
  removeSpineBleed: boolean;
  calculateAsOpenSpread: boolean;
  gripperMarginMm: number;
  sheetMarginMm: number;
  gutterHorizontalMm: number;
  gutterVerticalMm: number;
  allowRotation: boolean;
  respectGrainDirection: boolean;
  rawSheetMaterialId: string;
};

type CompanyProfile = typeof companyProfile & { logoDataUrl?: string };

type DocumentType =
  | "quote"
  | "orderConfirmation"
  | "invoice"
  | "deliveryNote"
  | "reminder";

type DocumentTemplate = {
  label: string;
  topMm: number;
  bottomMm: number;
  leftMm: number;
  rightMm: number;
  introText: string;
  footerText: string;
};

type DocumentTemplateSettings = Record<DocumentType, DocumentTemplate>;

type NumberCircle = {
  label: string;
  prefix: string;
  nextNumber: number;
  padding: number;
};

type NumberCircleSettings = Record<DocumentType, NumberCircle>;

const documentTypeOrder: DocumentType[] = [
  "quote",
  "orderConfirmation",
  "invoice",
  "deliveryNote",
  "reminder",
];

const documentStatusOptions: DocumentStatus[] = [
  "Entwurf",
  "Versendet",
  "Angenommen",
  "Abgelehnt",
  "Abgerechnet",
  "Bezahlt",
  "Storniert",
];

const paymentStatusOptions: PaymentStatus[] = [
  "Offen",
  "Teilbezahlt",
  "Bezahlt",
  "Überfällig",
  "Storniert",
];

const DEFAULT_DOCUMENT_TEMPLATE_SETTINGS: DocumentTemplateSettings = {
  quote: {
    label: "Angebot",
    topMm: 35,
    bottomMm: 20,
    leftMm: 18,
    rightMm: 18,
    introText:
      "vielen Dank für Ihre Anfrage. Gerne bieten wir Ihnen folgende Druckproduktion an.",
    footerText:
      "Lieferung nach Absprache. Preise verstehen sich netto zuzüglich gesetzlicher Mehrwertsteuer.",
  },
  orderConfirmation: {
    label: "Auftragsbestätigung",
    topMm: 35,
    bottomMm: 20,
    leftMm: 18,
    rightMm: 18,
    introText:
      "vielen Dank für Ihren Auftrag. Gerne bestätigen wir Ihnen die folgende Druckproduktion.",
    footerText:
      "Produktion und Lieferung erfolgen nach Absprache. Änderungen nach Freigabe können Mehrkosten verursachen.",
  },
  invoice: {
    label: "Rechnung",
    topMm: 35,
    bottomMm: 25,
    leftMm: 18,
    rightMm: 18,
    introText: "für die erbrachten Leistungen berechnen wir Ihnen wie folgt.",
    footerText:
      "Bitte überweisen Sie den Rechnungsbetrag innerhalb der angegebenen Zahlungsfrist.",
  },
  deliveryNote: {
    label: "Lieferschein",
    topMm: 35,
    bottomMm: 20,
    leftMm: 18,
    rightMm: 18,
    introText: "wir liefern Ihnen folgende Positionen.",
    footerText: "Die Lieferung erfolgt gemäß Vereinbarung.",
  },
  reminder: {
    label: "Mahnung",
    topMm: 35,
    bottomMm: 25,
    leftMm: 18,
    rightMm: 18,
    introText:
      "leider konnten wir zu der unten aufgeführten Rechnung noch keinen Zahlungseingang feststellen.",
    footerText:
      "Sollte sich Ihre Zahlung mit diesem Schreiben überschnitten haben, betrachten Sie diese Mahnung bitte als gegenstandslos.",
  },
};

const DEFAULT_NUMBER_CIRCLE_SETTINGS: NumberCircleSettings = {
  quote: { label: "Angebot", prefix: "AN", nextNumber: 1, padding: 4 },
  orderConfirmation: {
    label: "Auftragsbestätigung",
    prefix: "AB",
    nextNumber: 1,
    padding: 4,
  },
  invoice: { label: "Rechnung", prefix: "RE", nextNumber: 1, padding: 4 },
  deliveryNote: {
    label: "Lieferschein",
    prefix: "LS",
    nextNumber: 1,
    padding: 4,
  },
  reminder: { label: "Mahnung", prefix: "MA", nextNumber: 1, padding: 4 },
};

const navItems: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    description: "Übersicht",
    accent: "bg-cyan-400",
  },
  {
    key: "calculator",
    label: "Kalkulation",
    description: "Preise berechnen",
    accent: "bg-fuchsia-500",
  },
  {
    key: "quotes",
    label: "Angebote",
    description: "Angebote erstellen",
    accent: "bg-yellow-400",
  },
  {
    key: "customers",
    label: "Kunden",
    description: "Adressdaten",
    accent: "bg-emerald-400",
  },
  {
    key: "materials",
    label: "Material",
    description: "Papier & Lager",
    accent: "bg-orange-400",
  },
  {
    key: "machines",
    label: "Maschinen",
    description: "Drucksysteme",
    accent: "bg-sky-500",
  },
  {
    key: "finishing",
    label: "Weiterverarbeitung",
    description: "Falzen, Rillen, Schneiden",
    accent: "bg-lime-400",
  },
  {
    key: "imposition",
    label: "Nutzenrechner",
    description: "Bogenaufteilung",
    accent: "bg-rose-500",
  },
  {
    key: "services",
    label: "Leistungen",
    description: "Artikelstamm",
    accent: "bg-indigo-500",
  },
  {
    key: "calcTemplates",
    label: "Vorlagen",
    description: "Kalkulationsvorlagen",
    accent: "bg-pink-500",
  },
  {
    key: "settings",
    label: "Einstellungen",
    description: "Firmenprofil",
    accent: "bg-violet-500",
  },
];

const DEFAULT_PRODUCT_TYPES: ProductType[] = [
  "Einzelblatt",
  "Flyer",
  "Visitenkarten",
  "Karte",
  "Poster",
  "Aufkleber",
  "Broschüre",
  "SD-Satz",
  "Block",
  "Mailing",
  "Großformat",
];

const dashboardStats = [
  {
    label: "Offene Angebote",
    value: "12",
    hint: "+3 diese Woche",
    color: "from-cyan-400 to-sky-500",
  },
  {
    label: "Aktive Kalkulationen",
    value: "7",
    hint: "2 warten auf Material",
    color: "from-fuchsia-500 to-purple-600",
  },
  {
    label: "Materialwarnungen",
    value: "4",
    hint: "SRA3 & 300g prüfen",
    color: "from-yellow-300 to-orange-400",
  },
  {
    label: "Jobs in Produktion",
    value: "9",
    hint: "5 Digitaldruck",
    color: "from-emerald-400 to-green-600",
  },
];

const productionQueue = [
  {
    job: "Flyer A5 · 4/4 farbig",
    customer: "Musterkunde GmbH",
    machine: "Xerox Iridesse",
    status: "Kalkulation",
  },
  {
    job: "Broschüre A4 · 32 Seiten",
    customer: "Agentur Nord",
    machine: "Canon VP140",
    status: "Angebot offen",
  },
  {
    job: "Stickerbogen · Konturschnitt",
    customer: "Eventservice Klein",
    machine: "Roland VG3 540",
    status: "Produktion",
  },
];

const COMPANY_PROFILE_STORAGE_KEY = "printpilot.companyProfile";
const DOCUMENT_TEMPLATE_STORAGE_KEY = "printpilot.documentTemplates";
const NUMBER_CIRCLE_STORAGE_KEY = "printpilot.numberCircles";
const CUSTOMER_STORAGE_KEY = "printpilot.customers";
const SERVICE_ITEMS_STORAGE_KEY = "printpilot.serviceItems";
const SAVED_DOCUMENTS_STORAGE_KEY = "printpilot.savedDocuments";
const MACHINE_STORAGE_KEY = "printpilot.machines";
const MATERIAL_STORAGE_KEY = "printpilot.materials";
const FINISHING_STORAGE_KEY = "printpilot.finishingOperations";
const CALCULATION_TEMPLATE_STORAGE_KEY = "printpilot.calculationTemplates";
const PRODUCT_TYPES_STORAGE_KEY = "printpilot.productTypes";

function cloneDocumentTemplateSettings(
  settings: DocumentTemplateSettings,
): DocumentTemplateSettings {
  return JSON.parse(JSON.stringify(settings)) as DocumentTemplateSettings;
}

function normalizeDocumentTemplateSettings(
  savedSettings: unknown,
): DocumentTemplateSettings {
  const defaults = cloneDocumentTemplateSettings(
    DEFAULT_DOCUMENT_TEMPLATE_SETTINGS,
  );

  if (!savedSettings || typeof savedSettings !== "object") {
    return defaults;
  }

  const rawSettings = savedSettings as Partial<DocumentTemplateSettings> & {
    quoteTopMm?: number;
    quoteBottomMm?: number;
    quoteLeftMm?: number;
    quoteRightMm?: number;
  };

  if (typeof rawSettings.quoteTopMm === "number") {
    defaults.quote.topMm = rawSettings.quoteTopMm;
    defaults.quote.bottomMm =
      rawSettings.quoteBottomMm ?? defaults.quote.bottomMm;
    defaults.quote.leftMm = rawSettings.quoteLeftMm ?? defaults.quote.leftMm;
    defaults.quote.rightMm = rawSettings.quoteRightMm ?? defaults.quote.rightMm;
    return defaults;
  }

  documentTypeOrder.forEach((documentType) => {
    const savedTemplate = rawSettings[documentType];
    if (savedTemplate && typeof savedTemplate === "object") {
      defaults[documentType] = { ...defaults[documentType], ...savedTemplate };
    }
  });

  return defaults;
}

function cloneNumberCircleSettings(
  settings: NumberCircleSettings,
): NumberCircleSettings {
  return JSON.parse(JSON.stringify(settings)) as NumberCircleSettings;
}

function normalizeNumberCircleSettings(
  savedSettings: unknown,
): NumberCircleSettings {
  const defaults = cloneNumberCircleSettings(DEFAULT_NUMBER_CIRCLE_SETTINGS);

  if (!savedSettings || typeof savedSettings !== "object") {
    return defaults;
  }

  const rawSettings = savedSettings as Partial<NumberCircleSettings>;

  documentTypeOrder.forEach((documentType) => {
    const savedCircle = rawSettings[documentType];

    if (savedCircle && typeof savedCircle === "object") {
      defaults[documentType] = {
        ...defaults[documentType],
        ...savedCircle,
        nextNumber: Math.max(Number(savedCircle.nextNumber) || 1, 1),
        padding: Math.max(Number(savedCircle.padding) || 4, 1),
      };
    }
  });

  return defaults;
}

function formatDocumentNumber(
  circle: NumberCircle,
  year = new Date().getFullYear(),
) {
  const paddedNumber = String(Math.max(circle.nextNumber, 1)).padStart(
    Math.max(circle.padding, 1),
    "0",
  );

  return `${circle.prefix}-${year}-${paddedNumber}`;
}

const sampleCustomers: Customer[] = [
  {
    id: "customer-001",
    customerNumber: "KD-10001",
    company: "Musterkunde GmbH",
    contactPerson: "Max Mustermann",
    street: "Musterstraße 12",
    zip: "69115",
    city: "Heidelberg",
    email: "info@musterkunde.de",
    phone: "+49 6221 123456",
    status: "Aktiv",
    notes: "Regelmäßige Flyer- und Broschürenaufträge.",
  },
  {
    id: "customer-002",
    customerNumber: "KD-10002",
    company: "Agentur Nord",
    contactPerson: "Laura Beispiel",
    street: "Designallee 8",
    zip: "68159",
    city: "Mannheim",
    email: "produktion@agentur-nord.de",
    phone: "+49 621 987654",
    status: "Aktiv",
    notes: "Viele Broschüren und hochwertige Kartenproduktionen.",
  },
  {
    id: "customer-003",
    customerNumber: "KD-10003",
    company: "Eventservice Klein",
    contactPerson: "Thomas Klein",
    street: "Eventweg 3",
    zip: "69168",
    city: "Wiesloch",
    email: "kontakt@event-klein.de",
    phone: "+49 6222 456789",
    status: "Interessent",
    notes: "Interessiert an Stickern, Plakaten und kurzfristigen Produktionen.",
  },
  {
    id: "customer-004",
    customerNumber: "KD-10004",
    company: "Praxis Dr. Weber",
    contactPerson: "Sabine Weber",
    street: "Hauptstraße 44",
    zip: "69245",
    city: "Bammental",
    email: "praxis@dr-weber.de",
    phone: "+49 6223 112233",
    status: "Aktiv",
    notes: "Visitenkarten, Terminzettel und Praxisformulare.",
  },
  {
    id: "customer-005",
    customerNumber: "KD-10005",
    company: "Bäckerei Sonnengold",
    contactPerson: "Nina Gold",
    street: "Marktplatz 2",
    zip: "69117",
    city: "Heidelberg",
    email: "office@sonnengold.de",
    phone: "+49 6221 778899",
    status: "Inaktiv",
    notes: "Saisonale Preislisten und Gutscheine.",
  },
];

const sampleServiceItems: ServiceItem[] = [
  {
    id: "service-001",
    itemNumber: "LS-10001",
    title: "Flyer A5 4/4 farbig",
    category: "Druckprodukt",
    description:
      "Flyer im Format A5, beidseitig 4/4-farbig bedruckt, inklusive Schneiden.",
    unit: "Stück",
    unitPrice: 0.18,
    vatRate: 19,
    status: "Aktiv",
  },
  {
    id: "service-002",
    itemNumber: "LS-10002",
    title: "Broschüre A4 Rückendrahtheftung",
    category: "Druckprodukt",
    description:
      "Broschüre A4 mit Inhalt, Umschlag, Schneiden und Rückendrahtheftung.",
    unit: "Stück",
    unitPrice: 2.45,
    vatRate: 19,
    status: "Aktiv",
  },
  {
    id: "service-003",
    itemNumber: "LS-20001",
    title: "Schneiden",
    category: "Weiterverarbeitung",
    description: "Planschnitt / Endbeschnitt nach Aufwand und Auflage.",
    unit: "Auftrag",
    unitPrice: 18,
    vatRate: 19,
    status: "Aktiv",
  },
  {
    id: "service-004",
    itemNumber: "LS-20002",
    title: "Rillen",
    category: "Weiterverarbeitung",
    description: "Rillen von Karten, Umschlägen oder Falzprodukten.",
    unit: "100 Stück",
    unitPrice: 6.5,
    vatRate: 19,
    status: "Aktiv",
  },
  {
    id: "service-005",
    itemNumber: "LS-30001",
    title: "Datenprüfung",
    category: "Service",
    description:
      "Technische Prüfung angelieferter Druckdaten inklusive kurzer Rückmeldung.",
    unit: "Auftrag",
    unitPrice: 15,
    vatRate: 19,
    status: "Aktiv",
  },
  {
    id: "service-006",
    itemNumber: "LS-30002",
    title: "Expresszuschlag",
    category: "Zuschlag",
    description:
      "Zuschlag für bevorzugte Bearbeitung und kurzfristige Produktion.",
    unit: "Auftrag",
    unitPrice: 49,
    vatRate: 19,
    status: "Aktiv",
  },
];

function App() {
  const [activePage, setActivePage] = useState<PageKey>("dashboard");
  const [editableCompanyProfile, setEditableCompanyProfile] =
    useState<CompanyProfile>(() => {
      try {
        const savedProfile = window.localStorage.getItem(
          COMPANY_PROFILE_STORAGE_KEY,
        );

        if (!savedProfile) {
          return { ...companyProfile };
        }

        return {
          ...companyProfile,
          ...JSON.parse(savedProfile),
        };
      } catch {
        return { ...companyProfile };
      }
    });
  const [documentTemplateSettings, setDocumentTemplateSettings] =
    useState<DocumentTemplateSettings>(() => {
      try {
        const savedSettings = window.localStorage.getItem(
          DOCUMENT_TEMPLATE_STORAGE_KEY,
        );

        if (!savedSettings) {
          return cloneDocumentTemplateSettings(
            DEFAULT_DOCUMENT_TEMPLATE_SETTINGS,
          );
        }

        return normalizeDocumentTemplateSettings(JSON.parse(savedSettings));
      } catch {
        return cloneDocumentTemplateSettings(
          DEFAULT_DOCUMENT_TEMPLATE_SETTINGS,
        );
      }
    });

  const [numberCircleSettings, setNumberCircleSettings] =
    useState<NumberCircleSettings>(() => {
      try {
        const savedSettings = window.localStorage.getItem(
          NUMBER_CIRCLE_STORAGE_KEY,
        );

        if (!savedSettings) {
          return cloneNumberCircleSettings(DEFAULT_NUMBER_CIRCLE_SETTINGS);
        }

        return normalizeNumberCircleSettings(JSON.parse(savedSettings));
      } catch {
        return cloneNumberCircleSettings(DEFAULT_NUMBER_CIRCLE_SETTINGS);
      }
    });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const savedCustomers = window.localStorage.getItem(CUSTOMER_STORAGE_KEY);

      if (!savedCustomers) {
        return sampleCustomers;
      }

      const parsedCustomers = JSON.parse(savedCustomers);

      return Array.isArray(parsedCustomers) && parsedCustomers.length > 0
        ? parsedCustomers
        : sampleCustomers;
    } catch {
      return sampleCustomers;
    }
  });

  const [serviceItems, setServiceItems] = useState<ServiceItem[]>(() => {
    try {
      const savedItems = window.localStorage.getItem(SERVICE_ITEMS_STORAGE_KEY);

      if (!savedItems) {
        return sampleServiceItems;
      }

      const parsedItems = JSON.parse(savedItems);

      return Array.isArray(parsedItems) && parsedItems.length > 0
        ? parsedItems
        : sampleServiceItems;
    } catch {
      return sampleServiceItems;
    }
  });

  const [savedDocuments, setSavedDocuments] = useState<SavedDocument[]>(() => {
    try {
      const savedDocumentsRaw = window.localStorage.getItem(
        SAVED_DOCUMENTS_STORAGE_KEY,
      );

      if (!savedDocumentsRaw) {
        return [];
      }

      const parsedDocuments = JSON.parse(savedDocumentsRaw);

      return Array.isArray(parsedDocuments) ? parsedDocuments : [];
    } catch {
      return [];
    }
  });

  const [editableMachines, setEditableMachines] = useState<Machine[]>(() => {
    try {
      const savedMachines = window.localStorage.getItem(MACHINE_STORAGE_KEY);

      if (!savedMachines) {
        return machinesDefaultClone();
      }

      const parsedMachines = JSON.parse(savedMachines);

      return Array.isArray(parsedMachines) && parsedMachines.length > 0
        ? parsedMachines.map(normalizeMachine)
        : machinesDefaultClone();
    } catch {
      return machinesDefaultClone();
    }
  });

  const [editableMaterials, setEditableMaterials] = useState<Material[]>(() => {
    try {
      const savedMaterials = window.localStorage.getItem(MATERIAL_STORAGE_KEY);

      if (!savedMaterials) return materialsDefaultClone();

      const parsedMaterials = JSON.parse(savedMaterials);

      return Array.isArray(parsedMaterials) && parsedMaterials.length > 0
        ? parsedMaterials.map(normalizeMaterial)
        : materialsDefaultClone();
    } catch {
      return materialsDefaultClone();
    }
  });

  const [editableFinishingOperations, setEditableFinishingOperations] =
    useState<FinishingOperation[]>(() => {
      try {
        const savedOperations = window.localStorage.getItem(
          FINISHING_STORAGE_KEY,
        );

        if (!savedOperations) return finishingDefaultClone();

        const parsedOperations = JSON.parse(savedOperations);

        return Array.isArray(parsedOperations) && parsedOperations.length > 0
          ? parsedOperations.map(normalizeFinishingOperation)
          : finishingDefaultClone();
      } catch {
        return finishingDefaultClone();
      }
    });

  const [productTypes, setProductTypes] = useState<ProductType[]>(() => {
    try {
      const savedProductTypes = window.localStorage.getItem(
        PRODUCT_TYPES_STORAGE_KEY,
      );

      if (!savedProductTypes) return [...DEFAULT_PRODUCT_TYPES];

      const parsedProductTypes = JSON.parse(savedProductTypes);

      return Array.isArray(parsedProductTypes) && parsedProductTypes.length > 0
        ? parsedProductTypes.map((type) => String(type).trim()).filter(Boolean)
        : [...DEFAULT_PRODUCT_TYPES];
    } catch {
      return [...DEFAULT_PRODUCT_TYPES];
    }
  });

  const [calculationTemplates, setCalculationTemplates] = useState<
    CalculationTemplate[]
  >(() => {
    try {
      const savedTemplates = window.localStorage.getItem(
        CALCULATION_TEMPLATE_STORAGE_KEY,
      );

      if (!savedTemplates) {
        return createDefaultCalculationTemplates(
          editableMaterials,
          editableMachines,
          editableFinishingOperations,
          productTypes,
        );
      }

      const parsedTemplates = JSON.parse(savedTemplates);

      return Array.isArray(parsedTemplates) && parsedTemplates.length > 0
        ? parsedTemplates.map((template) =>
            normalizeCalculationTemplate(
              template,
              editableMaterials,
              editableMachines,
              editableFinishingOperations,
              productTypes,
            ),
          )
        : createDefaultCalculationTemplates(
            editableMaterials,
            editableMachines,
            editableFinishingOperations,
            productTypes,
          );
    } catch {
      return createDefaultCalculationTemplates(
        editableMaterials,
        editableMachines,
        editableFinishingOperations,
        productTypes,
      );
    }
  });

  const [quotePositions, setQuotePositions] = useState<QuotePosition[]>([
    {
      id: createLocalId(),
      title: "Broschüre A4",
      description:
        "Broschüre A4, 32 Seiten Inhalt, 4-seitiger Umschlag, 4/4-farbig, Rückendrahtheftung.",
      quantity: 1000,
      unitPrice: 2.45,
      vatRate: 19,
      internalNote: "",
    },
  ]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        COMPANY_PROFILE_STORAGE_KEY,
        JSON.stringify(editableCompanyProfile),
      );
    } catch {
      // localStorage kann z. B. im privaten Modus blockiert sein.
    }
  }, [editableCompanyProfile]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        DOCUMENT_TEMPLATE_STORAGE_KEY,
        JSON.stringify(documentTemplateSettings),
      );
    } catch {
      // localStorage kann z. B. im privaten Modus blockiert sein.
    }
  }, [documentTemplateSettings]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        NUMBER_CIRCLE_STORAGE_KEY,
        JSON.stringify(numberCircleSettings),
      );
    } catch {
      // localStorage kann z. B. im privaten Modus blockiert sein.
    }
  }, [numberCircleSettings]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        CUSTOMER_STORAGE_KEY,
        JSON.stringify(customers),
      );
    } catch {
      // localStorage kann z. B. im privaten Modus blockiert sein.
    }
  }, [customers]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        SERVICE_ITEMS_STORAGE_KEY,
        JSON.stringify(serviceItems),
      );
    } catch {
      // localStorage kann z. B. im privaten Modus blockiert sein.
    }
  }, [serviceItems]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        SAVED_DOCUMENTS_STORAGE_KEY,
        JSON.stringify(savedDocuments),
      );
    } catch {
      // localStorage kann z. B. im privaten Modus blockiert sein.
    }
  }, [savedDocuments]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        MACHINE_STORAGE_KEY,
        JSON.stringify(editableMachines),
      );
    } catch {
      // localStorage kann z. B. im privaten Modus blockiert sein.
    }
  }, [editableMachines]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        MATERIAL_STORAGE_KEY,
        JSON.stringify(editableMaterials),
      );
    } catch {
      // localStorage kann z. B. im privaten Modus blockiert sein.
    }
  }, [editableMaterials]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        FINISHING_STORAGE_KEY,
        JSON.stringify(editableFinishingOperations),
      );
    } catch {
      // localStorage kann z. B. im privaten Modus blockiert sein.
    }
  }, [editableFinishingOperations]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        PRODUCT_TYPES_STORAGE_KEY,
        JSON.stringify(productTypes),
      );
    } catch {
      // localStorage kann z. B. im privaten Modus blockiert sein.
    }
  }, [productTypes]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        CALCULATION_TEMPLATE_STORAGE_KEY,
        JSON.stringify(calculationTemplates),
      );
    } catch {
      // localStorage kann z. B. im privaten Modus blockiert sein.
    }
  }, [calculationTemplates]);

  const activeItem =
    navItems.find((item) => item.key === activePage) ?? navItems[0];

  function addQuotePositionFromCalculation(
    position: Omit<QuotePosition, "id">,
  ) {
    setQuotePositions((current) => [
      ...current,
      {
        id: createLocalId(),
        ...position,
      },
    ]);
    setActivePage("quotes");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <aside className="fixed inset-y-0 left-0 z-20 hidden w-80 flex-col bg-slate-950 text-white shadow-2xl shadow-slate-950/30 lg:flex">
          <div className="border-b border-white/10 px-7 py-7">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-xl font-black text-slate-950">
                PP
              </div>
              <div>
                <p className="text-xl font-black tracking-tight">PrintPilot</p>
                <p className="text-sm text-slate-400">Druckerei Cockpit</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
            {navItems.map((item) => {
              const isActive = item.key === activePage;

              return (
                <button
                  key={item.key}
                  onClick={() => setActivePage(item.key)}
                  className={`group flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left transition ${
                    isActive
                      ? "bg-white text-slate-950 shadow-xl shadow-black/20"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className={`h-11 w-2 rounded-full ${item.accent}`} />
                  <span>
                    <span className="block text-sm font-black">
                      {item.label}
                    </span>
                    <span
                      className={`block text-xs ${
                        isActive
                          ? "text-slate-500"
                          : "text-slate-500 group-hover:text-slate-300"
                      }`}
                    >
                      {item.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-5">
            <div className="rounded-3xl bg-white/10 p-5">
              <p className="text-sm font-black">PrintPilot V48</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Produkttypen und Kalkulationsvorlagen sind jetzt Stammdaten.
              </p>
            </div>
          </div>
        </aside>

        <main className="min-h-screen flex-1 lg:pl-80">
          <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 px-5 py-4 backdrop-blur-xl lg:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400">
                  {activeItem.description}
                </p>
                <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                  {activeItem.label}
                </h1>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <input
                    placeholder="Suchen..."
                    className="w-full min-w-72 border-0 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
                  />
                </div>

                <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5">
                  + Neu
                </button>
              </div>
            </div>
          </header>

          <div className="px-5 py-6 lg:px-8 lg:py-8">
            <MobileNav activePage={activePage} setActivePage={setActivePage} />

            {activePage === "dashboard" && <DashboardPage />}
            {activePage === "calculator" && (
              <CalculatorPage
                materials={editableMaterials}
                machines={editableMachines}
                finishingOperations={editableFinishingOperations}
                calculationTemplates={calculationTemplates}
                onAddQuotePosition={addQuotePositionFromCalculation}
              />
            )}
            {activePage === "quotes" && (
              <QuotesPage
                quotePositions={quotePositions}
                setQuotePositions={setQuotePositions}
                company={editableCompanyProfile}
                documentTemplateSettings={documentTemplateSettings}
                numberCircleSettings={numberCircleSettings}
                setNumberCircleSettings={setNumberCircleSettings}
                customers={customers}
                savedDocuments={savedDocuments}
                setSavedDocuments={setSavedDocuments}
                serviceItems={serviceItems}
              />
            )}
            {activePage === "customers" && (
              <CustomersPage
                customers={customers}
                setCustomers={setCustomers}
              />
            )}
            {activePage === "materials" && (
              <MaterialsPage
                materials={editableMaterials}
                setMaterials={setEditableMaterials}
              />
            )}
            {activePage === "machines" && (
              <MachinesPage
                machines={editableMachines}
                setMachines={setEditableMachines}
              />
            )}
            {activePage === "finishing" && (
              <FinishingPage
                finishingOperations={editableFinishingOperations}
                setFinishingOperations={setEditableFinishingOperations}
              />
            )}
            {activePage === "imposition" && (
              <PlaceholderPage title="Nutzenrechner" />
            )}
            {activePage === "services" && (
              <ServicesPage
                serviceItems={serviceItems}
                setServiceItems={setServiceItems}
              />
            )}
            {activePage === "calcTemplates" && (
              <CalculationTemplatesPage
                calculationTemplates={calculationTemplates}
                setCalculationTemplates={setCalculationTemplates}
                productTypes={productTypes}
                setProductTypes={setProductTypes}
                materials={editableMaterials}
                machines={editableMachines}
                finishingOperations={editableFinishingOperations}
              />
            )}
            {activePage === "settings" && (
              <SettingsPage
                company={editableCompanyProfile}
                setCompany={setEditableCompanyProfile}
                documentTemplateSettings={documentTemplateSettings}
                setDocumentTemplateSettings={setDocumentTemplateSettings}
                numberCircleSettings={numberCircleSettings}
                setNumberCircleSettings={setNumberCircleSettings}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileNav({
  activePage,
  setActivePage,
}: {
  activePage: PageKey;
  setActivePage: (page: PageKey) => void;
}) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 lg:hidden">
      {navItems.map((item) => (
        <button
          key={item.key}
          onClick={() => setActivePage(item.key)}
          className={`rounded-2xl border px-4 py-3 text-left text-sm font-black ${
            activePage === item.key
              ? "border-slate-950 bg-slate-950 text-white"
              : "border-slate-200 bg-white text-slate-700"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl shadow-slate-950/15">
        <div className="relative p-7 lg:p-10">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-0 right-24 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />

          <div className="relative max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
              PrintPilot V15
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight lg:text-6xl">
              Kalkulation und Angebot verbunden.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Kalkulation, Angebot, Material, Maschinen und Weiterverarbeitung
              sind jetzt als erster durchgängiger Workflow vorbereitet.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Neues Angebot",
                "Neue Kalkulation",
                "Kunde anlegen",
                "Material prüfen",
              ].map((action) => (
                <button
                  key={action}
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <div
            key={stat.label}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            <div className={`h-2 bg-gradient-to-r ${stat.color}`} />
            <div className="p-6">
              <p className="text-sm font-bold text-slate-500">{stat.label}</p>
              <p className="mt-3 text-4xl font-black tracking-tight">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-400">
                {stat.hint}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-black">Aktuelle Vorgänge</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Beispielhafte Jobs für die spätere Angebots- und
            Produktionsübersicht.
          </p>

          <div className="mt-6 space-y-4">
            {productionQueue.map((item) => (
              <div
                key={item.job}
                className="grid gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-5 md:grid-cols-[1.3fr_1fr_1fr_auto] md:items-center"
              >
                <div>
                  <p className="font-black">{item.job}</p>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {item.customer}
                  </p>
                </div>
                <p className="text-sm font-bold text-slate-600">
                  {item.machine}
                </p>
                <p className="text-sm font-bold text-slate-600">
                  {item.status}
                </p>
                <button className="rounded-xl bg-white px-4 py-2 text-sm font-black text-slate-950 shadow-sm">
                  Öffnen
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-black">Aktueller Ausbau</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Die wichtigsten Module sind angelegt und werden jetzt miteinander
            verbunden.
          </p>

          <div className="mt-6 space-y-3">
            {[
              "Kalkulation",
              "Produkttypen",
              "Materialpositionen",
              "Weiterverarbeitung",
              "In Angebot übernehmen",
              "PDF / Druckansicht",
            ].map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-sm font-black text-white">
                  {index + 1}
                </span>
                <span className="text-sm font-black">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function CalculatorPage({
  materials,
  machines,
  finishingOperations,
  calculationTemplates,
  onAddQuotePosition,
}: {
  materials: Material[];
  machines: Machine[];
  finishingOperations: FinishingOperation[];
  calculationTemplates: CalculationTemplate[];
  onAddQuotePosition: (position: Omit<QuotePosition, "id">) => void;
}) {
  const activeCalculationTemplates = useMemo(
    () =>
      calculationTemplates.filter((template) => template.status === "Aktiv"),
    [calculationTemplates],
  );

  const [selectedCalculationTemplateId, setSelectedCalculationTemplateId] =
    useState(activeCalculationTemplates[0]?.id ?? "");
  const [productType, setProductType] = useState<ProductType>("Broschüre");
  const [productName, setProductName] = useState("Broschüre A4");
  const [quantity, setQuantity] = useState(1000);

  const [materialSelections, setMaterialSelections] = useState<
    MaterialSelection[]
  >([
    withLocalMaterialId({
      label: "Inhalt",
      materialId:
        findMaterialIdInCatalog(materials, "Offset") ?? materials[0].id,
      calculationMode: "pages",
      manualSheets: 500,
      factorPerCopy: 1,
      pages: 32,
      pagesPerSheet: 4,
      itemsPerSheet: 1,
    }),
    withLocalMaterialId({
      label: "Umschlag",
      materialId: findMaterialIdInCatalog(materials, "300") ?? materials[0].id,
      calculationMode: "perCopy",
      manualSheets: 50,
      factorPerCopy: 1,
      pages: 4,
      pagesPerSheet: 4,
      itemsPerSheet: 1,
    }),
  ]);

  const [selectedMachineId, setSelectedMachineId] = useState(machines[0].id);
  const [finishingSelections, setFinishingSelections] = useState<
    FinishingSelection[]
  >([
    withLocalFinishingId(
      findFinishingIdInCatalog(finishingOperations, "Schneiden") ??
        finishingOperations[0].id,
    ),
    withLocalFinishingId(
      findFinishingIdInCatalog(finishingOperations, "Rückendraht") ??
        finishingOperations[0].id,
    ),
  ]);

  const [colorMode, setColorMode] = useState("4/4 farbig");
  const [risoInkCoverage, setRisoInkCoverage] =
    useState<RisoInkCoverage>("normal");
  const [rolandProductionMode, setRolandProductionMode] =
    useState<RolandProductionMode>("printCut");
  const [rolandPrintAreaSqm, setRolandPrintAreaSqm] = useState(1);
  const [rolandInkMlPerSqm, setRolandInkMlPerSqm] = useState(12);
  const [rolandInkCostPerMl, setRolandInkCostPerMl] = useState(0.28);
  const [rolandCutLengthM, setRolandCutLengthM] = useState(20);
  const [rolandCutSpeedMMin, setRolandCutSpeedMMin] = useState(8);
  const [rolandMaintenancePercent, setRolandMaintenancePercent] = useState(10);
  const [finalWidthMm, setFinalWidthMm] = useState(210);
  const [finalHeightMm, setFinalHeightMm] = useState(297);
  const [itemsPerSheet, setItemsPerSheet] = useState(1);
  const [bleedMm, setBleedMm] = useState(3);
  const [removeSpineBleed, setRemoveSpineBleed] = useState(true);
  const [calculateAsOpenSpread, setCalculateAsOpenSpread] = useState(true);
  const gripperMarginMm = 0;
  const sheetMarginMm = 0;
  const [gutterHorizontalMm, setGutterHorizontalMm] = useState(4);
  const [gutterVerticalMm, setGutterVerticalMm] = useState(4);
  const [allowRotation, setAllowRotation] = useState(true);
  const [respectGrainDirection, setRespectGrainDirection] = useState(true);
  const [rawSheetMaterialId, setRawSheetMaterialId] = useState(
    materials[0]?.id ?? "",
  );
  const [fixedOvers, setFixedOvers] = useState(25);
  const [wastePercent, setWastePercent] = useState(5);
  const [setupMinutes, setSetupMinutes] = useState(15);
  const [finishingExtraCost, setFinishingExtraCost] = useState(0);
  const [overheadPercent, setOverheadPercent] = useState(12);
  const [marginPercent, setMarginPercent] = useState(35);

  const selectedMachine =
    machines.find((machine) => machine.id === selectedMachineId) ?? machines[0];

  useEffect(() => {
    if (
      selectedCalculationTemplateId &&
      activeCalculationTemplates.some(
        (template) => template.id === selectedCalculationTemplateId,
      )
    ) {
      return;
    }

    setSelectedCalculationTemplateId(activeCalculationTemplates[0]?.id ?? "");
  }, [activeCalculationTemplates, selectedCalculationTemplateId]);

  const safeQuantity = Math.max(quantity, 1);
  const selectedRawSheet =
    materials.find((material) => material.id === rawSheetMaterialId) ??
    materials[0];
  const impositionResult = calculateImpositionResult({
    sheetWidthMm: selectedRawSheet?.widthMm ?? 0,
    sheetHeightMm: selectedRawSheet?.heightMm ?? 0,
    finalWidthMm,
    finalHeightMm,
    bleedMm,
    removeSpineBleed,
    calculateAsOpenSpread,
    gripperMarginMm,
    sheetMarginMm,
    gutterHorizontalMm,
    gutterVerticalMm,
    allowRotation,
  });

  const safeItemsPerSheet = Math.max(impositionResult.best.total, 1);

  const brochurePagesPerRawSheet =
    productType === "Broschüre" && calculateAsOpenSpread
      ? Math.max(impositionResult.best.total * 4, 1)
      : 0;

  const baseMaterialItems = materialSelections.map((selection) => {
    const material =
      materials.find((item) => item.id === selection.materialId) ??
      materials[0];
    const isBrochurePageMaterial =
      productType === "Broschüre" &&
      calculateAsOpenSpread &&
      selection.calculationMode === "pages" &&
      ["inhalt", "umschlag"].some((label) =>
        selection.label.toLowerCase().includes(label),
      );

    const calculatedSheets = isBrochurePageMaterial
      ? Math.ceil(
          (safeQuantity * Math.max(selection.pages, 0)) /
            Math.max(brochurePagesPerRawSheet, 1),
        )
      : calculateMaterialSheets(selection, safeQuantity);
    const pricePerSheet = calculateMaterialPricePerSheet(material);

    return {
      ...selection,
      material,
      calculatedSheets,
      pricePerSheet,
    };
  });

  const baseMaterialSheetTotal = baseMaterialItems.reduce(
    (sum, item) => sum + item.calculatedSheets,
    0,
  );
  const productionSheets = Math.max(
    baseMaterialSheetTotal,
    Math.ceil(safeQuantity / safeItemsPerSheet),
  );
  const materialOvers = allocateProportionalInteger(
    Math.max(fixedOvers, 0),
    baseMaterialItems.map((item) => item.calculatedSheets),
  );

  const selectedMaterialItems = baseMaterialItems.map((item, index) => {
    const oversSheets = materialOvers[index] ?? 0;
    const sheetsBeforeWasteForMaterial = item.calculatedSheets + oversSheets;
    const wasteSheetsForMaterial = Math.ceil(
      sheetsBeforeWasteForMaterial * (wastePercent / 100),
    );
    const totalMaterialSheets =
      sheetsBeforeWasteForMaterial + wasteSheetsForMaterial;
    const cost = totalMaterialSheets * item.pricePerSheet;

    return {
      ...item,
      oversSheets,
      sheetsBeforeWasteForMaterial,
      wasteSheetsForMaterial,
      totalMaterialSheets,
      cost,
    };
  });

  const sheetsBeforeWaste = selectedMaterialItems.reduce(
    (sum, item) => sum + item.sheetsBeforeWasteForMaterial,
    0,
  );
  const wasteSheets = selectedMaterialItems.reduce(
    (sum, item) => sum + item.wasteSheetsForMaterial,
    0,
  );
  const totalSheets = sheetsBeforeWaste + wasteSheets;

  const materialCost = selectedMaterialItems.reduce(
    (sum, item) => sum + item.cost,
    0,
  );
  const clickSetup = getClicksForColorMode(colorMode);
  const machineCostModel = getMachineCostModel(selectedMachine.name);
  const availableColorModes = useMemo(
    () => getAllowedColorModes(selectedMachine.name, machineCostModel),
    [selectedMachine.name, machineCostModel],
  );
  const setupCost = (setupMinutes / 60) * selectedMachine.hourlyRate;

  useEffect(() => {
    if (machineCostModel === "roland") return;

    const currentModeIsAllowed = availableColorModes.some(
      (mode) => mode.value === colorMode,
    );

    if (currentModeIsAllowed) return;

    const fallbackMode = colorMode.includes("/0")
      ? "1/0 schwarz"
      : "1/1 schwarz";
    const fallbackIsAllowed = availableColorModes.some(
      (mode) => mode.value === fallbackMode,
    );

    setColorMode(
      fallbackIsAllowed
        ? fallbackMode
        : (availableColorModes[0]?.value ?? "1/0 schwarz"),
    );
  }, [availableColorModes, colorMode, machineCostModel]);

  useEffect(() => {
    if (machineCostModel !== "roland") return;

    if (typeof selectedMachine.rolandDefaultInkMlPerSqm === "number") {
      setRolandInkMlPerSqm(selectedMachine.rolandDefaultInkMlPerSqm);
    }

    if (typeof selectedMachine.rolandMaintenancePercent === "number") {
      setRolandMaintenancePercent(selectedMachine.rolandMaintenancePercent);
    }
  }, [
    machineCostModel,
    selectedMachine.id,
    selectedMachine.rolandDefaultInkMlPerSqm,
    selectedMachine.rolandMaintenancePercent,
  ]);

  const machineCost = calculateMachineVariableCost({
    machineCostModel,
    selectedMachine,
    totalSheets,
    clickSetup,
    risoInkCoverage,
    rolandProductionMode,
    rolandPrintAreaSqm,
    rolandInkMlPerSqm,
    rolandInkCostPerMl:
      getAverageInkPricePerMl(selectedMachine) || rolandInkCostPerMl,
    rolandCutLengthM,
    rolandCutSpeedMMin,
    rolandMaintenancePercent:
      selectedMachine.rolandMaintenancePercent ?? rolandMaintenancePercent,
  });

  const printCost = machineCost.total;

  const selectedFinishingItems = finishingSelections.map((selection) => {
    const operation =
      finishingOperations.find((item) => item.id === selection.operationId) ??
      finishingOperations[0];

    const price = calculateFinishingPrice({
      pricingMode: operation.pricingMode,
      basePrice: operation.basePrice,
      unitPrice: operation.unitPrice,
      minimumPrice: operation.minimumPrice,
      setupMinutes: operation.setupMinutes,
      hourlyRate: operation.hourlyRate,
      quantity: safeQuantity,
      sheets: totalSheets,
    });

    return {
      selectionId: selection.id,
      operation,
      price,
    };
  });

  const calculatedFinishingCost = selectedFinishingItems.reduce(
    (sum, item) => sum + item.price,
    0,
  );
  const finishingCost =
    calculatedFinishingCost + Math.max(finishingExtraCost, 0);
  const directCost = materialCost + printCost + setupCost + finishingCost;
  const overheadCost = directCost * (overheadPercent / 100);
  const totalCost = directCost + overheadCost;

  const marginFactor = 1 - marginPercent / 100;
  const sellingPrice = marginFactor > 0 ? totalCost / marginFactor : totalCost;
  const unitPrice = sellingPrice / safeQuantity;
  const profit = sellingPrice - totalCost;
  const costAnalysisTotal = Math.max(sellingPrice, 0.01);
  const costAnalysisItems = [
    { label: "Material", value: materialCost, className: "bg-orange-400" },
    {
      label: getMachineCostModelLabel(machineCostModel),
      value: printCost + setupCost,
      className: "bg-sky-500",
    },
    {
      label: "Weiterverarbeitung",
      value: finishingCost,
      className: "bg-lime-500",
    },
    { label: "Gemeinkosten", value: overheadCost, className: "bg-violet-500" },
    { label: "Ertrag", value: profit, className: "bg-emerald-500" },
  ].filter((item) => item.value > 0);

  const contentPages =
    materialSelections.find((selection) =>
      selection.label.toLowerCase().includes("inhalt"),
    )?.pages ?? 0;

  const coverPages =
    materialSelections.find((selection) =>
      selection.label.toLowerCase().includes("umschlag"),
    )?.pages ?? 0;

  const calculationWarnings: {
    level: "error" | "warning" | "info";
    title: string;
    description: string;
  }[] = [];

  if (impositionResult.best.total <= 0) {
    calculationWarnings.push({
      level: "error",
      title: "Kein Nutzen möglich",
      description:
        "Das Produkt passt mit den aktuellen Format-, Beschnitt- oder Rohbogenwerten nicht auf den ausgewählten Bogen.",
    });
  }

  if (productType === "Broschüre") {
    if (!calculateAsOpenSpread) {
      calculationWarnings.push({
        level: "warning",
        title: "Broschürenmodus prüfen",
        description:
          "Broschüren sollten normalerweise als offene Doppelseite berechnet werden, damit Bund und Papierbogen korrekt kalkuliert werden.",
      });
    }

    if (contentPages > 0 && contentPages % 4 !== 0) {
      calculationWarnings.push({
        level: "error",
        title: "Inhaltsseiten nicht durch 4 teilbar",
        description:
          "Bei rückendrahtgehefteten Broschüren sollte die Inhaltsseitenzahl durch 4 teilbar sein.",
      });
    }

    if (coverPages > 0 && coverPages % 4 !== 0) {
      calculationWarnings.push({
        level: "warning",
        title: "Umschlagseiten prüfen",
        description:
          "Ein Broschürenumschlag hat normalerweise 4 Seiten. Prüfe, ob die Eingabe korrekt ist.",
      });
    }

    if (calculateAsOpenSpread && !removeSpineBleed) {
      calculationWarnings.push({
        level: "warning",
        title: "Bundbeschnitt aktiv",
        description:
          "Bei Broschüren mit offener Doppelseite sollte im Bund normalerweise kein Beschnitt gerechnet werden.",
      });
    }
  }

  if (!allowRotation && impositionResult.rotated.total > impositionResult.normal.total) {
    calculationWarnings.push({
      level: "info",
      title: "Gedreht wäre ein besserer Nutzen möglich",
      description:
        "Die Drehung ist gesperrt. Mit Drehung würde die App mehr Nutzen auf dem Rohbogen finden.",
    });
  }

  selectedMaterialItems.forEach((item) => {
    if (item.pricePerSheet <= 0) {
      calculationWarnings.push({
        level: "warning",
        title: `Materialpreis fehlt: ${item.label}`,
        description:
          "Dieses Material hat keinen berechneten Preis pro Bogen. Prüfe Preisart, Riespreis, Kilopreis oder Bogendaten im Materialstamm.",
      });
    }
  });

  selectedFinishingItems.forEach((item) => {
    if (item.operation.active === false) {
      calculationWarnings.push({
        level: "warning",
        title: `Weiterverarbeitung inaktiv: ${item.operation.name}`,
        description:
          "Dieser Vorgang ist im Stamm als inaktiv markiert, wird in dieser Kalkulation aber noch verwendet.",
      });
    }
  });

  if (marginPercent < 10) {
    calculationWarnings.push({
      level: "info",
      title: "Marge niedrig",
      description:
        "Die eingestellte Marge liegt unter 10 %. Prüfe, ob das für diesen Auftrag gewünscht ist.",
    });
  }

  if (machineCostModel === "roland" && rolandProductionMode !== "print" && rolandCutSpeedMMin <= 0) {
    calculationWarnings.push({
      level: "error",
      title: "Schneidegeschwindigkeit fehlt",
      description:
        "Für Roland-Schneidejobs muss eine Schneidegeschwindigkeit größer 0 hinterlegt sein.",
    });
  }

  const calculationErrorCount = calculationWarnings.filter(
    (warning) => warning.level === "error",
  ).length;
  const calculationWarningCount = calculationWarnings.filter(
    (warning) => warning.level === "warning",
  ).length;
  const calculationInfoCount = calculationWarnings.filter(
    (warning) => warning.level === "info",
  ).length;
  const hasCalculationErrors = calculationErrorCount > 0;

  const tiers = [250, 500, 1000, 2500, 5000].map((tierQuantity) => {
    const tierScaleFactor = tierQuantity / safeQuantity;

    const tierBaseMaterialItems = materialSelections.map((selection) => {
      const material =
        materials.find((item) => item.id === selection.materialId) ??
        materials[0];
      const pricePerSheet = calculateMaterialPricePerSheet(material);
      const isBrochurePageMaterial =
        productType === "Broschüre" &&
        calculateAsOpenSpread &&
        selection.calculationMode === "pages" &&
        ["inhalt", "umschlag"].some((label) =>
          selection.label.toLowerCase().includes(label),
        );

      const calculatedSheets = isBrochurePageMaterial
        ? Math.ceil(
            (tierQuantity * Math.max(selection.pages, 0)) /
              Math.max(brochurePagesPerRawSheet, 1),
          )
        : selection.calculationMode === "manual"
          ? Math.ceil(Math.max(selection.manualSheets, 0) * tierScaleFactor)
          : calculateMaterialSheets(selection, tierQuantity);

      return {
        calculatedSheets,
        pricePerSheet,
      };
    });

    const tierMaterialOvers = allocateProportionalInteger(
      Math.max(fixedOvers, 0),
      tierBaseMaterialItems.map((item) => item.calculatedSheets),
    );
    const tierMaterialBreakdowns = tierBaseMaterialItems.map((item, index) => {
      const oversSheets = tierMaterialOvers[index] ?? 0;
      const sheetsBeforeWasteForMaterial = item.calculatedSheets + oversSheets;
      const wasteSheetsForMaterial = Math.ceil(
        sheetsBeforeWasteForMaterial * (wastePercent / 100),
      );
      const totalMaterialSheets =
        sheetsBeforeWasteForMaterial + wasteSheetsForMaterial;

      return {
        ...item,
        oversSheets,
        sheetsBeforeWasteForMaterial,
        wasteSheetsForMaterial,
        totalMaterialSheets,
      };
    });
    const tierSheetsBeforeWaste = tierMaterialBreakdowns.reduce(
      (sum, item) => sum + item.sheetsBeforeWasteForMaterial,
      0,
    );
    const tierWasteSheets = tierMaterialBreakdowns.reduce(
      (sum, item) => sum + item.wasteSheetsForMaterial,
      0,
    );
    const tierTotalSheets = tierSheetsBeforeWaste + tierWasteSheets;
    const tierMaterial = tierMaterialBreakdowns.reduce(
      (sum, item) => sum + item.totalMaterialSheets * item.pricePerSheet,
      0,
    );

    const tierPrint = calculateMachineVariableCost({
      machineCostModel,
      selectedMachine,
      totalSheets: tierTotalSheets,
      clickSetup,
      risoInkCoverage,
      rolandProductionMode,
      rolandPrintAreaSqm: rolandPrintAreaSqm * tierScaleFactor,
      rolandInkMlPerSqm,
      rolandInkCostPerMl,
      rolandCutLengthM: rolandCutLengthM * tierScaleFactor,
      rolandCutSpeedMMin,
      rolandMaintenancePercent,
    }).total;

    const tierCalculatedFinishing = finishingSelections.reduce(
      (sum, selection) => {
        const operation =
          finishingOperations.find(
            (item) => item.id === selection.operationId,
          ) ?? finishingOperations[0];

        return (
          sum +
          calculateFinishingPrice({
            pricingMode: operation.pricingMode,
            basePrice: operation.basePrice,
            unitPrice: operation.unitPrice,
            minimumPrice: operation.minimumPrice,
            setupMinutes: operation.setupMinutes,
            hourlyRate: operation.hourlyRate,
            quantity: tierQuantity,
            sheets: tierTotalSheets,
          })
        );
      },
      0,
    );

    const tierFinishing =
      tierCalculatedFinishing +
      Math.max(finishingExtraCost, 0) * tierScaleFactor;
    const tierDirect = tierMaterial + tierPrint + setupCost + tierFinishing;
    const tierOverhead = tierDirect * (overheadPercent / 100);
    const tierTotalCost = tierDirect + tierOverhead;
    const tierSellingPrice =
      marginFactor > 0 ? tierTotalCost / marginFactor : tierTotalCost;

    return {
      quantity: tierQuantity,
      sheets: tierTotalSheets,
      material: tierMaterial,
      finishing: tierFinishing,
      price: tierSellingPrice,
      unit: tierSellingPrice / tierQuantity,
    };
  });

  function applySelectedTemplate() {
    const selectedTemplate =
      activeCalculationTemplates.find(
        (template) => template.id === selectedCalculationTemplateId,
      ) ?? activeCalculationTemplates[0];

    const template = selectedTemplate ?? {
      ...getProductTemplate(productType, materials),
      id: "fallback",
      name: productType,
      productType,
      defaultQuantity: safeQuantity,
      machineId: selectedMachineId,
      status: "Aktiv" as CalculationTemplateStatus,
    };

    setProductType(template.productType);
    setProductName(template.productName);
    setQuantity(Math.max(template.defaultQuantity || safeQuantity, 1));
    setFinalWidthMm(template.finalWidthMm);
    setFinalHeightMm(template.finalHeightMm);
    setItemsPerSheet(template.itemsPerSheet);
    setBleedMm(template.bleedMm);
    setRemoveSpineBleed(template.removeSpineBleed);
    setCalculateAsOpenSpread(template.calculateAsOpenSpread);
    setGutterHorizontalMm(template.gutterHorizontalMm);
    setGutterVerticalMm(template.gutterVerticalMm);
    setAllowRotation(template.allowRotation);
    setRespectGrainDirection(template.respectGrainDirection);
    setRawSheetMaterialId(
      materials.some((material) => material.id === template.rawSheetMaterialId)
        ? template.rawSheetMaterialId
        : (materials[0]?.id ?? ""),
    );
    setColorMode(template.colorMode);

    if (machines.some((machine) => machine.id === template.machineId)) {
      setSelectedMachineId(template.machineId);
    }

    const nextMaterialSelections = template.materialSelections.map(
      (selection) =>
        withLocalMaterialId({
          ...selection,
          materialId: materials.some(
            (material) => material.id === selection.materialId,
          )
            ? selection.materialId
            : materials[0].id,
        }),
    );

    setMaterialSelections(
      nextMaterialSelections.length > 0
        ? nextMaterialSelections
        : [
            withLocalMaterialId({
              label: "Material",
              materialId: materials[0].id,
              calculationMode: "perCopy",
              manualSheets: 1000,
              factorPerCopy: 1,
              pages: 2,
              pagesPerSheet: 2,
              itemsPerSheet: 1,
            }),
          ],
    );

    const nextFinishing = template.finishingNames
      .map((name) => findFinishingIdInCatalog(finishingOperations, name))
      .filter((id): id is string => Boolean(id))
      .map(withLocalFinishingId);

    setFinishingSelections(
      nextFinishing.length > 0
        ? nextFinishing
        : [withLocalFinishingId(finishingOperations[0].id)],
    );
  }

  function addMaterialSelection() {
    setMaterialSelections((current) => [
      ...current,
      withLocalMaterialId({
        label: `Material ${current.length + 1}`,
        materialId: materials[0].id,
        calculationMode: "perCopy",
        manualSheets: totalSheets,
        factorPerCopy: 1,
        pages: 4,
        pagesPerSheet: 4,
        itemsPerSheet: 1,
      }),
    ]);
  }

  function updateMaterialSelection(
    selectionId: string,
    field: keyof Omit<MaterialSelection, "id">,
    value: string | number,
  ) {
    setMaterialSelections((current) =>
      current.map((selection) =>
        selection.id === selectionId
          ? { ...selection, [field]: value }
          : selection,
      ),
    );
  }

  function removeMaterialSelection(selectionId: string) {
    setMaterialSelections((current) =>
      current.length <= 1
        ? current
        : current.filter((selection) => selection.id !== selectionId),
    );
  }

  function setBrochureFormat(format: "A5" | "A4") {
    setRemoveSpineBleed(true);
    setCalculateAsOpenSpread(true);

    if (format === "A5") {
      setProductName("Broschüre A5");
      setFinalWidthMm(148);
      setFinalHeightMm(210);
      return;
    }

    setProductName("Broschüre A4");
    setFinalWidthMm(210);
    setFinalHeightMm(297);
  }

  function updateBrochurePart(
    labelSearch: "inhalt" | "umschlag",
    updates: Partial<Omit<MaterialSelection, "id">>,
  ) {
    setRemoveSpineBleed(true);
    setCalculateAsOpenSpread(true);
    setMaterialSelections((current) =>
      current.map((selection) => {
        const matches = selection.label.toLowerCase().includes(labelSearch);

        if (!matches) return selection;

        return {
          ...selection,
          calculationMode: "pages",
          factorPerCopy: 1,
          itemsPerSheet: 1,
          pagesPerSheet: Math.max(brochurePagesPerRawSheet, 1),
          ...updates,
        };
      }),
    );
  }

  function ensureBrochureDefaults() {
    setRemoveSpineBleed(true);
    setCalculateAsOpenSpread(true);
    setMaterialSelections((current) => {
      const hasContent = current.some((selection) =>
        selection.label.toLowerCase().includes("inhalt"),
      );
      const hasCover = current.some((selection) =>
        selection.label.toLowerCase().includes("umschlag"),
      );

      const next = current.map((selection) => {
        const normalizedLabel = selection.label.toLowerCase();

        if (normalizedLabel.includes("inhalt")) {
          return {
            ...selection,
            calculationMode: "pages" as MaterialCalculationMode,
            pages: selection.pages > 0 ? selection.pages : 32,
            factorPerCopy: 1,
            itemsPerSheet: 1,
          };
        }

        if (normalizedLabel.includes("umschlag")) {
          return {
            ...selection,
            calculationMode: "pages" as MaterialCalculationMode,
            pages: selection.pages > 0 ? selection.pages : 4,
            factorPerCopy: 1,
            itemsPerSheet: 1,
          };
        }

        return selection;
      });

      if (!hasContent) {
        next.push(
          withLocalMaterialId({
            label: "Inhalt",
            materialId:
              findMaterialIdInCatalog(materials, "Offset") ?? materials[0].id,
            calculationMode: "pages",
            manualSheets: 0,
            factorPerCopy: 1,
            pages: 32,
            pagesPerSheet: 4,
            itemsPerSheet: 1,
          }),
        );
      }

      if (!hasCover) {
        next.push(
          withLocalMaterialId({
            label: "Umschlag",
            materialId:
              findMaterialIdInCatalog(materials, "300") ?? materials[0].id,
            calculationMode: "pages",
            manualSheets: 0,
            factorPerCopy: 1,
            pages: 4,
            pagesPerSheet: 4,
            itemsPerSheet: 1,
          }),
        );
      }

      return next;
    });
  }

  function addFinishingSelection() {
    setFinishingSelections((current) => [
      ...current,
      withLocalFinishingId(finishingOperations[0].id),
    ]);
  }

  function updateFinishingSelection(selectionId: string, operationId: string) {
    setFinishingSelections((current) =>
      current.map((selection) =>
        selection.id === selectionId
          ? { ...selection, operationId }
          : selection,
      ),
    );
  }

  function removeFinishingSelection(selectionId: string) {
    setFinishingSelections((current) =>
      current.length <= 1
        ? current
        : current.filter((selection) => selection.id !== selectionId),
    );
  }

  function handleAddToQuote() {
    const customerMaterialDetails = selectedMaterialItems
      .map((item) => {
        if (!item.label) return "";

        if (item.calculationMode === "pages" && item.pages > 0) {
          return `${item.label}: ${item.pages} Seiten`;
        }

        return item.label;
      })
      .filter(Boolean)
      .join(", ");

    const finishingNames = selectedFinishingItems
      .map((item) => item.operation.name)
      .filter(Boolean)
      .join(", ");

    const productionDescription =
      machineCostModel === "roland"
        ? `Produktion: ${getRolandProductionModeLabel(rolandProductionMode)}`
        : `Farbigkeit: ${colorMode}`;

    const descriptionParts = [
      `${productName}`,
      `Auflage: ${safeQuantity.toLocaleString("de-DE")} Stück`,
      `Endformat: ${finalWidthMm} × ${finalHeightMm} mm`,
      productionDescription,
      customerMaterialDetails ? `Material: ${customerMaterialDetails}` : "",
      finishingNames ? `Weiterverarbeitung: ${finishingNames}` : "",
    ].filter(Boolean);

    onAddQuotePosition({
      title: productName,
      description: descriptionParts.join("\n"),
      quantity: safeQuantity,
      unitPrice: roundMoney(unitPrice),
      vatRate: 19,
      internalNote: [
        `Interne Kalkulation`,
        `Maschine: ${selectedMachine.name}`,
        `Druckbogen: ${totalSheets.toLocaleString("de-DE")}`,
        `Materialkosten: ${formatCurrency(materialCost)}`,
        `Druckkosten: ${formatCurrency(printCost)}`,
        `Weiterverarbeitung: ${formatCurrency(finishingCost)}`,
        `Selbstkosten: ${formatCurrency(totalCost)}`,
        `Marge: ${formatNumber(marginPercent, 1)} %`,
      ].join("\n"),
    });
  }


  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-slate-950/20">
        <div className="relative p-5 lg:p-6">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-40 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-fuchsia-300">
                Kalkulation V80
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Kompaktes Kalkulations-Cockpit
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Produkt, Material, Maschine, Nutzen und Preis kompakt gegliedert.
                Details bleiben erreichbar, ohne die Oberfläche zu überladen.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-4 text-slate-950 shadow-xl">
              <p className="text-sm font-bold text-slate-500">
                Verkaufspreis netto
              </p>
              <p className="mt-1 text-3xl font-black">
                {formatCurrency(sellingPrice)}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-500">
                {formatCurrency(unitPrice)} pro Stück
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
            Produkt
          </p>
          <p className="mt-2 truncate text-lg font-black" title={productName}>
            {productName}
          </p>
          <p className="mt-1 text-sm font-bold text-slate-500">
            {safeQuantity.toLocaleString("de-DE")} Stück · {finalWidthMm} ×{" "}
            {finalHeightMm} mm
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
            Nutzen
          </p>
          <p className="mt-2 text-lg font-black">
            {safeItemsPerSheet} pro Bogen
          </p>
          <p className="mt-1 text-sm font-bold text-slate-500">
            Auto: {impositionResult.best.total} ·{" "}
            {impositionResult.best.orientation}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
            Maschine
          </p>
          <p
            className="mt-2 truncate text-lg font-black"
            title={selectedMachine.name}
          >
            {selectedMachine.name}
          </p>
          <p className="mt-1 text-sm font-bold text-slate-500">
            {getMachineCostModelLabel(machineCostModel)}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-950 p-4 text-white shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
            Verkauf netto
          </p>
          <p className="mt-2 text-2xl font-black">
            {formatCurrency(sellingPrice)}
          </p>
          <p className="mt-1 text-sm font-bold text-slate-400">
            {formatCurrency(unitPrice)} / Stück
          </p>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_25rem] xl:items-start">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                Kalkulation
              </p>
              <h3 className="mt-2 text-2xl font-black tracking-tight">
                Produktionsdaten
              </h3>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Kompakte Eingaben für Vorlage, Material, Maschine und Weiterverarbeitung.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-600">
              Live-Kalkulation
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                Produkttyp / Vorlage
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <SelectField
                  label="Kalkulationsvorlage"
                  value={selectedCalculationTemplateId}
                  onChange={setSelectedCalculationTemplateId}
                  options={activeCalculationTemplates.map((template) => ({
                    value: template.id,
                    label: `${template.name} · ${template.productType}`,
                  }))}
                />

                <button
                  type="button"
                  onClick={applySelectedTemplate}
                  className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5"
                >
                  Vorlage anwenden
                </button>
              </div>

            </div>

            <InputField
              label="Produktname"
              value={productName}
              onChange={setProductName}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <NumberField
                label="Auflage"
                value={quantity}
                onChange={setQuantity}
                suffix="Stück"
              />
              <ReadOnlyField
                label="Berechneter Nutzen"
                value={`${safeItemsPerSheet} Nutzen`}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <NumberField
                label="Endformat Breite"
                value={finalWidthMm}
                onChange={setFinalWidthMm}
                suffix="mm"
              />
              <NumberField
                label="Endformat Höhe"
                value={finalHeightMm}
                onChange={setFinalHeightMm}
                suffix="mm"
              />
            </div>

            {productType === "Broschüre" && (
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wide text-amber-700">
                      Broschüre
                    </p>
                    <h4 className="mt-2 text-lg font-black text-slate-950">
                      Nur Format, Seiten und Papiere eingeben
                    </h4>
                    <p className="mt-2 text-sm font-bold leading-6 text-amber-800">
                      Die App berechnet daraus offene Doppelseite, Bund ohne Beschnitt,
                      Nutzen, Materialbogen und Druckbogen automatisch.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={ensureBrochureDefaults}
                    className="rounded-2xl bg-amber-600 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5"
                  >
                    Broschürenlogik anwenden
                  </button>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <SelectField
                    label="Broschürenformat"
                    value={finalWidthMm === 148 && finalHeightMm === 210 ? "A5" : "A4"}
                    onChange={(value) => setBrochureFormat(value as "A5" | "A4")}
                    options={[
                      { value: "A5", label: "DIN A5 geschlossen" },
                      { value: "A4", label: "DIN A4 geschlossen" },
                    ]}
                  />
                  <ReadOnlyField
                    label="Geschlossen"
                    value={`${finalWidthMm} × ${finalHeightMm} mm`}
                  />
                  <ReadOnlyField
                    label="Offene Doppelseite"
                    value={`${finalWidthMm * 2} × ${finalHeightMm} mm`}
                  />
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-2">
                  <div className="rounded-3xl border border-amber-200 bg-white p-4">
                    <p className="text-xs font-extrabold uppercase tracking-wide text-amber-700">
                      Inhalt
                    </p>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <NumberField
                        label="Inhaltsseiten"
                        value={materialSelections.find((selection) => selection.label.toLowerCase().includes("inhalt"))?.pages ?? 32}
                        onChange={(value) => updateBrochurePart("inhalt", { pages: value })}
                        suffix="S."
                      />
                      <SelectField
                        label="Inhaltspapier"
                        value={materialSelections.find((selection) => selection.label.toLowerCase().includes("inhalt"))?.materialId ?? materials[0].id}
                        onChange={(value) => updateBrochurePart("inhalt", { materialId: value })}
                        options={materials.map((material) => ({
                          value: material.id,
                          label: `${material.name} · ${material.widthMm} × ${material.heightMm} mm · ${material.grammage} g/m²`,
                        }))}
                      />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-amber-200 bg-white p-4">
                    <p className="text-xs font-extrabold uppercase tracking-wide text-amber-700">
                      Umschlag
                    </p>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <NumberField
                        label="Umschlagseiten"
                        value={materialSelections.find((selection) => selection.label.toLowerCase().includes("umschlag"))?.pages ?? 4}
                        onChange={(value) => updateBrochurePart("umschlag", { pages: value })}
                        suffix="S."
                      />
                      <SelectField
                        label="Umschlagpapier"
                        value={materialSelections.find((selection) => selection.label.toLowerCase().includes("umschlag"))?.materialId ?? materials[0].id}
                        onChange={(value) => updateBrochurePart("umschlag", { materialId: value })}
                        options={materials.map((material) => ({
                          value: material.id,
                          label: `${material.name} · ${material.widthMm} × ${material.heightMm} mm · ${material.grammage} g/m²`,
                        }))}
                      />
                    </div>
                  </div>
                </div>

                <p className="mt-5 rounded-2xl bg-amber-100 px-4 py-3 text-sm font-black text-amber-900">
                  Berechnung: Seiten je Rohbogen = Nutzen offener Doppelseiten × 4.
                  Im Bund wird kein Beschnitt gerechnet, außen bleibt der Beschnitt aktiv.
                </p>
              </div>
            )}

            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                Produktparameter / Nutzenbasis
              </p>
              <p className="mt-1 text-sm font-bold text-slate-500">
                Diese Werte kommen aus der Kalkulationsvorlage und steuern den
                automatischen Nutzenrechner.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <NumberField
                  label="Beschnitt"
                  value={bleedMm}
                  onChange={setBleedMm}
                  step={1}
                  suffix="mm"
                />
                <SelectField
                  label="Bundbeschnitt"
                  value={removeSpineBleed ? "no" : "yes"}
                  onChange={(value) => setRemoveSpineBleed(value === "no")}
                  options={[
                    { value: "yes", label: "Beschnitt rundum" },
                    { value: "no", label: "ohne Beschnitt im Bund" },
                  ]}
                />
                <SelectField
                  label="Broschürenmodus"
                  value={calculateAsOpenSpread ? "spread" : "closed"}
                  onChange={(value) => setCalculateAsOpenSpread(value === "spread")}
                  options={[
                    { value: "spread", label: "offene Doppelseite" },
                    { value: "closed", label: "geschlossenes Format" },
                  ]}
                />
                <NumberField
                  label="Zwischenschnitt H"
                  value={gutterHorizontalMm}
                  onChange={setGutterHorizontalMm}
                  step={1}
                  suffix="mm"
                />
                <NumberField
                  label="Zwischenschnitt V"
                  value={gutterVerticalMm}
                  onChange={setGutterVerticalMm}
                  step={1}
                  suffix="mm"
                />
                <SelectField
                  label="Drehung"
                  value={allowRotation ? "yes" : "no"}
                  onChange={(value) => setAllowRotation(value === "yes")}
                  options={[
                    { value: "yes", label: "Drehung erlaubt" },
                    { value: "no", label: "Keine Drehung" },
                  ]}
                />
                <SelectField
                  label="Laufrichtung"
                  value={respectGrainDirection ? "yes" : "no"}
                  onChange={(value) =>
                    setRespectGrainDirection(value === "yes")
                  }
                  options={[
                    { value: "yes", label: "beachten" },
                    { value: "no", label: "ignorieren" },
                  ]}
                />
                <SelectField
                  label="Standard-Rohbogen"
                  value={rawSheetMaterialId}
                  onChange={setRawSheetMaterialId}
                  options={materials.map((material) => ({
                    value: material.id,
                    label: `${material.name} · ${material.widthMm} × ${material.heightMm} mm`,
                  }))}
                />
              </div>

              <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                      Automatischer Nutzen
                    </p>
                    <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
                      Rohbogen: {selectedRawSheet?.widthMm ?? 0} ×{" "}
                      {selectedRawSheet?.heightMm ?? 0} mm · Nutzmaß inkl.
                      Beschnitt: {impositionResult.productWidthWithBleed} ×{" "}
                      {impositionResult.productHeightWithBleed} mm ·{" "}
                      {removeSpineBleed
                        ? "ohne Bundbeschnitt"
                        : "Beschnitt rundum"}{" "}
                      · Zwischenschnitt: H {gutterHorizontalMm} mm / V{" "}
                      {gutterVerticalMm} mm · nutzbare Fläche:{" "}
                      {impositionResult.availableWidth} ×{" "}
                      {impositionResult.availableHeight} mm
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 px-5 py-3 text-sm font-black text-emerald-700">
                    Wird automatisch verwendet
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <InfoCard
                    label="Normal"
                    value={`${impositionResult.normal.columns} × ${impositionResult.normal.rows} = ${impositionResult.normal.total}`}
                  />
                  <InfoCard
                    label="Gedreht"
                    value={
                      allowRotation
                        ? `${impositionResult.rotated.columns} × ${impositionResult.rotated.rows} = ${impositionResult.rotated.total}`
                        : "nicht erlaubt"
                    }
                  />
                  <InfoCard
                    label="Bester Nutzen"
                    value={`${impositionResult.best.total} Nutzen / Bogen`}
                  />
                  <InfoCard
                    label="Ausrichtung"
                    value={impositionResult.best.orientation}
                  />
                  <InfoCard
                    label="Belegte Fläche"
                    value={`${impositionResult.best.usedWidth} × ${impositionResult.best.usedHeight} mm`}
                  />
                  <InfoCard
                    label="Restfläche"
                    value={`${formatNumber(impositionResult.best.wastePercent, 1)} %`}
                  />
                  <InfoCard
                    label="Bogenbedarf"
                    value={`${Math.ceil(safeQuantity / Math.max(impositionResult.best.total, 1)).toLocaleString("de-DE")} Bogen`}
                  />
                  <InfoCard
                    label="Bundlogik"
                    value={removeSpineBleed ? "aktiv" : "nicht aktiv"}
                  />
                  <InfoCard
                    label="Bundrichtung"
                    value={getSpineAxisLabel(impositionResult.best.spineAxis)}
                  />
                </div>

                <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                        Nutzenanalyse
                      </p>
                      <h4 className="mt-2 text-lg font-black text-slate-950">
                        Prüfdaten für die Bogenaufteilung
                      </h4>
                      <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
                        Diese Werte zeigen, warum der aktuelle Nutzen gewählt wurde.
                      </p>
                    </div>

                    {removeSpineBleed && (
                      <div className="rounded-2xl bg-amber-100 px-4 py-3 text-sm font-black text-amber-800">
                        Broschürenlogik aktiv: außen Beschnitt, im Bund kein Beschnitt.
                      </div>
                    )}
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <InfoCard
                      label="Geschlossenes Endformat"
                      value={`${finalWidthMm} × ${finalHeightMm} mm`}
                    />
                    <InfoCard
                      label="Offenes Nutzmaß"
                      value={calculateAsOpenSpread ? `${impositionResult.openFinalWidthMm} × ${impositionResult.openFinalHeightMm} mm` : "nicht aktiv"}
                    />
                    <InfoCard
                      label="Nutzmaß inkl. Beschnitt"
                      value={`${impositionResult.productWidthWithBleed} × ${impositionResult.productHeightWithBleed} mm`}
                    />
                    <InfoCard
                      label="Zwischenschnitt"
                      value={`H ${gutterHorizontalMm} mm / V ${gutterVerticalMm} mm`}
                    />
                    <InfoCard
                      label="Genutzte Fläche"
                      value={`${impositionResult.best.usedWidth} × ${impositionResult.best.usedHeight} mm`}
                    />
                    <InfoCard
                      label="Nutzbare Fläche"
                      value={`${impositionResult.availableWidth} × ${impositionResult.availableHeight} mm`}
                    />
                    <InfoCard
                      label="Bundrichtung"
                      value={getSpineAxisLabel(impositionResult.best.spineAxis)}
                    />
                    <InfoCard
                      label="Gewählte Ausrichtung"
                      value={impositionResult.best.orientation}
                    />
                    <InfoCard
                      label="Restfläche"
                      value={`${formatNumber(impositionResult.best.wastePercent, 1)} %`}
                    />
                    <InfoCard
                      label="Drehung"
                      value={allowRotation ? "erlaubt" : "gesperrt"}
                    />
                  </div>

                  <div className="mt-5 space-y-3">
                    {removeSpineBleed && (
                      <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold leading-6 text-amber-800">
                        Hinweis: Außenbeschnitt wird gerechnet und angezeigt. Im Bund wird kein Beschnitt gerechnet.
                        Bundrichtung: {getSpineAxisLabel(impositionResult.best.spineAxis)}.
                      </p>
                    )}

                    {productType === "Broschüre" && !calculateAsOpenSpread && impositionResult.best.spineAxis === "none" && (
                      <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold leading-6 text-rose-700">
                        Warnung: Für diese Broschürenaufteilung wurde kein eindeutiger Bund erkannt.
                        Prüfe Nutzen, Format und Drehung.
                      </p>
                    )}

                    {allowRotation && impositionResult.best.orientation === "gedreht" && (
                      <p className="rounded-2xl bg-sky-50 px-4 py-3 text-sm font-bold leading-6 text-sky-700">
                        Hinweis: Der beste Nutzen wird nur gedreht erreicht.
                      </p>
                    )}
                  </div>
                </div>

                <ImpositionPreview
                  sheetWidthMm={selectedRawSheet?.widthMm ?? 0}
                  sheetHeightMm={selectedRawSheet?.heightMm ?? 0}
                  finalWidthMm={finalWidthMm}
                  finalHeightMm={finalHeightMm}
                  bleedMm={bleedMm}
                  removeSpineBleed={removeSpineBleed}
                  calculateAsOpenSpread={calculateAsOpenSpread}
                  gripperMarginMm={gripperMarginMm}
                  sheetMarginMm={sheetMarginMm}
                  gutterHorizontalMm={gutterHorizontalMm}
                  gutterVerticalMm={gutterVerticalMm}
                  result={impositionResult}
                />

                {impositionResult.best.total <= 0 && (
                  <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700">
                    Das Produkt passt mit den aktuellen Rändern/Beschnittwerten
                    nicht auf den gewählten Rohbogen.
                  </p>
                )}
              </div>
            </div>

            {productType !== "Broschüre" && (
            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                    Materialpositionen
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-500">
                    Manuell, pro Exemplar oder nach Seitenzahl berechnen.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addMaterialSelection}
                  className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5"
                >
                  + Material hinzufügen
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {selectedMaterialItems.map((item, index) => {
                  const areaSqm = calculateSheetAreaSqm(
                    item.material.widthMm,
                    item.material.heightMm,
                  );
                  const weightKg = calculateSheetWeightKg(
                    item.material.widthMm,
                    item.material.heightMm,
                    item.material.grammage,
                  );

                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-white p-3"
                    >
                      <div className="space-y-4">
                        <SelectField
                          label={`Material für ${item.label || `Position ${index + 1}`}`}
                          value={item.materialId}
                          onChange={(value) =>
                            updateMaterialSelection(
                              item.id,
                              "materialId",
                              value,
                            )
                          }
                          options={materials.map((material) => ({
                            value: material.id,
                            label: `${material.name} · ${material.widthMm} × ${material.heightMm} mm · ${material.grammage} g/m²`,
                          }))}
                        />

                        <div className="grid gap-3 md:grid-cols-[1fr_0.8fr_auto] md:items-end">
                          <InputField
                            label={`Position ${index + 1}`}
                            value={item.label}
                            onChange={(value) =>
                              updateMaterialSelection(item.id, "label", value)
                            }
                          />

                          <SelectField
                            label="Berechnung"
                            value={item.calculationMode}
                            onChange={(value) =>
                              updateMaterialSelection(
                                item.id,
                                "calculationMode",
                                value as MaterialCalculationMode,
                              )
                            }
                            options={[
                              { value: "manual", label: "Manuell" },
                              { value: "perCopy", label: "Pro Exemplar" },
                              { value: "pages", label: "Seiten" },
                            ]}
                          />

                          <button
                            type="button"
                            onClick={() => removeMaterialSelection(item.id)}
                            disabled={materialSelections.length <= 1}
                            className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                              materialSelections.length <= 1
                                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                                : "bg-rose-100 text-rose-700 hover:-translate-y-0.5"
                            }`}
                          >
                            Entfernen
                          </button>
                        </div>

                        {item.calculationMode === "manual" && (
                          <div className="grid gap-3 md:grid-cols-2 md:items-end">
                            <NumberField
                              label="Bogen manuell"
                              value={item.manualSheets}
                              onChange={(value) =>
                                updateMaterialSelection(
                                  item.id,
                                  "manualSheets",
                                  value,
                                )
                              }
                              suffix="Bg."
                            />
                            <ReadOnlyField
                              label="Produktionsbogen"
                              value={`${item.calculatedSheets.toLocaleString("de-DE")} Bogen`}
                            />
                          </div>
                        )}

                        {item.calculationMode === "perCopy" && (
                          <div className="grid gap-3 md:grid-cols-3 md:items-end">
                            <NumberField
                              label="Faktor pro Exemplar"
                              value={item.factorPerCopy}
                              onChange={(value) =>
                                updateMaterialSelection(
                                  item.id,
                                  "factorPerCopy",
                                  value,
                                )
                              }
                              step={0.1}
                              suffix="x"
                            />
                            <NumberField
                              label="Nutzen"
                              value={item.itemsPerSheet}
                              onChange={(value) =>
                                updateMaterialSelection(
                                  item.id,
                                  "itemsPerSheet",
                                  value,
                                )
                              }
                              suffix="Nutzen"
                            />
                            <ReadOnlyField
                              label="Produktionsbogen"
                              value={`${item.calculatedSheets.toLocaleString("de-DE")} Bogen`}
                            />
                          </div>
                        )}

                        {item.calculationMode === "pages" && (
                          <div className="grid gap-3 md:grid-cols-3 md:items-end">
                            <NumberField
                              label="Seiten"
                              value={item.pages}
                              onChange={(value) =>
                                updateMaterialSelection(item.id, "pages", value)
                              }
                              suffix="S."
                            />
                            <NumberField
                              label="Seiten je Bogen"
                              value={item.pagesPerSheet}
                              onChange={(value) =>
                                updateMaterialSelection(
                                  item.id,
                                  "pagesPerSheet",
                                  value,
                                )
                              }
                              suffix="S./Bg."
                            />
                            <ReadOnlyField
                              label="Produktionsbogen"
                              value={`${item.calculatedSheets.toLocaleString("de-DE")} Bogen`}
                            />
                          </div>
                        )}
                      </div>

                      <div className="mt-4 grid gap-3 text-sm font-bold text-slate-600 md:grid-cols-2">
                        <p>
                          Format: {item.material.widthMm} ×{" "}
                          {item.material.heightMm} mm
                        </p>
                        <p>Grammatur: {item.material.grammage} g/m²</p>
                        <p>Fläche: {formatNumber(areaSqm, 4)} m²</p>
                        <p>
                          Gewicht:{" "}
                          {item.material.grammage > 0
                            ? `${formatNumber(weightKg * 1000, 1)} g/Bogen`
                            : "—"}
                        </p>
                        <p>
                          Preisart:{" "}
                          {getPricingModeLabel(item.material.pricingMode)}
                        </p>
                        <p>Preis/Bogen: {formatCurrency(item.pricePerSheet)}</p>
                        <p>
                          Produktionsbogen:{" "}
                          {item.calculatedSheets.toLocaleString("de-DE")}
                        </p>
                        <p>
                          Zuschuss anteilig:{" "}
                          {item.oversSheets.toLocaleString("de-DE")}
                        </p>
                        <p>
                          Ausschuss:{" "}
                          {item.wasteSheetsForMaterial.toLocaleString("de-DE")}
                        </p>
                        <p>
                          Materialbogen gesamt:{" "}
                          {item.totalMaterialSheets.toLocaleString("de-DE")}
                        </p>
                        <p>Kosten: {formatCurrency(item.cost)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-3xl bg-slate-950 p-5 text-white">
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                  Summe Material
                </p>
                <p className="mt-2 text-3xl font-black">
                  {formatCurrency(materialCost)}
                </p>
              </div>
            </div>

            )}

            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                Maschine / Kostenmodell
              </p>
              <p className="mt-1 text-sm font-bold text-slate-500">
                Die Kalkulation zeigt je nach Maschine passende Kostenfelder:
                Klickkosten nur bei Klickmaschinen, Tintenverbrauch oder
                Roland-Schneiden.
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2 md:items-end">
                <SelectField
                  label="Druckmaschine"
                  value={selectedMachineId}
                  onChange={setSelectedMachineId}
                  options={machines.map((machine) => ({
                    value: machine.id,
                    label: machine.name,
                  }))}
                />

                <ReadOnlyField
                  label="Kostenmodell"
                  value={getMachineCostModelLabel(machineCostModel)}
                />
              </div>

              {machineCostModel !== "click" && (
                <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-700">
                  Diese Maschine verwendet keine Klickpreise. Die Kosten werden
                  über Tinte/Kartuschen, Fläche, Verbrauch oder Schneidezeit
                  berechnet.
                </div>
              )}

              {machineCostModel === "click" && (
                <div className="mt-4">
                  <SelectField
                    label="Farbmodus"
                    value={colorMode}
                    onChange={setColorMode}
                    options={availableColorModes}
                  />
                </div>
              )}

              {machineCostModel === "risoInk" && (
                <div className="mt-4 grid gap-4 md:grid-cols-3 md:items-end">
                  <SelectField
                    label="Farbmodus"
                    value={colorMode}
                    onChange={setColorMode}
                    options={availableColorModes}
                  />
                  <SelectField
                    label="Riso-Verbrauch"
                    value={risoInkCoverage}
                    onChange={(value) =>
                      setRisoInkCoverage(value as RisoInkCoverage)
                    }
                    options={[
                      { value: "low", label: "wenig Farbe" },
                      { value: "normal", label: "normal" },
                      { value: "high", label: "hoch" },
                      { value: "full", label: "vollflächig" },
                    ]}
                  />
                  <ReadOnlyField
                    label="Kosten pro Seite"
                    value={formatCurrency(
                      getRisoInkCostPerPage(selectedMachine, risoInkCoverage),
                    )}
                  />
                </div>
              )}

              {machineCostModel === "roland" && (
                <div className="mt-4 space-y-4">
                  <SelectField
                    label="Roland-Produktionsart"
                    value={rolandProductionMode}
                    onChange={(value) =>
                      setRolandProductionMode(value as RolandProductionMode)
                    }
                    options={[
                      { value: "print", label: "Drucken" },
                      { value: "printCut", label: "Drucken + Schneiden" },
                      { value: "cutOnly", label: "Nur Schneiden" },
                    ]}
                  />

                  {rolandProductionMode !== "cutOnly" && (
                    <div className="grid gap-4 md:grid-cols-3">
                      <NumberField
                        label="Druckfläche"
                        value={rolandPrintAreaSqm}
                        onChange={setRolandPrintAreaSqm}
                        step={0.01}
                        suffix="m²"
                      />
                      <NumberField
                        label="Tinte"
                        value={rolandInkMlPerSqm}
                        onChange={setRolandInkMlPerSqm}
                        step={0.1}
                        suffix="ml/m²"
                      />
                      <ReadOnlyField
                        label="Ø Preis/ml"
                        value={formatCurrency(
                          getAverageInkPricePerMl(selectedMachine) ||
                            rolandInkCostPerMl,
                        )}
                      />
                    </div>
                  )}

                  {rolandProductionMode !== "print" && (
                    <div className="grid gap-4 md:grid-cols-3">
                      <NumberField
                        label="Schneidelänge"
                        value={rolandCutLengthM}
                        onChange={setRolandCutLengthM}
                        step={0.1}
                        suffix="m"
                      />
                      <NumberField
                        label="Schnittgeschw."
                        value={rolandCutSpeedMMin}
                        onChange={setRolandCutSpeedMMin}
                        step={0.1}
                        suffix="m/min"
                      />
                      <NumberField
                        label="Wartung"
                        value={rolandMaintenancePercent}
                        onChange={setRolandMaintenancePercent}
                        step={1}
                        suffix="%"
                      />
                    </div>
                  )}

                  {rolandProductionMode === "cutOnly" && (
                    <div className="rounded-2xl bg-white p-4 text-sm font-bold leading-6 text-slate-500">
                      Bei „Nur Schneiden“ werden keine Tintenkosten berechnet.
                      Es zählen nur Schneidezeit, Rüstzeit und optional
                      Material-/Weiterverarbeitungskosten.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                    Weiterverarbeitung
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-500">
                    Mehrere Verarbeitungsschritte pro Kalkulation.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addFinishingSelection}
                  className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5"
                >
                  + Schritt hinzufügen
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {finishingSelections.map((selection, index) => {
                  const operation =
                    finishingOperations.find(
                      (item) => item.id === selection.operationId,
                    ) ?? finishingOperations[0];

                  const itemPrice = calculateFinishingPrice({
                    pricingMode: operation.pricingMode,
                    basePrice: operation.basePrice,
                    unitPrice: operation.unitPrice,
                    minimumPrice: operation.minimumPrice,
                    setupMinutes: operation.setupMinutes,
                    hourlyRate: operation.hourlyRate,
                    quantity: safeQuantity,
                    sheets: totalSheets,
                  });

                  return (
                    <div
                      key={selection.id}
                      className="rounded-2xl border border-slate-200 bg-white p-3"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-end">
                        <div className="flex-1">
                          <SelectField
                            label={`Schritt ${index + 1}`}
                            value={selection.operationId}
                            onChange={(value) =>
                              updateFinishingSelection(selection.id, value)
                            }
                            options={finishingOperations.map((item) => ({
                              value: item.id,
                              label: item.name,
                            }))}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFinishingSelection(selection.id)}
                          disabled={finishingSelections.length <= 1}
                          className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                            finishingSelections.length <= 1
                              ? "cursor-not-allowed bg-slate-100 text-slate-400"
                              : "bg-rose-100 text-rose-700 hover:-translate-y-0.5"
                          }`}
                        >
                          Entfernen
                        </button>
                      </div>

                      <div className="mt-4 grid gap-3 text-sm font-bold text-slate-600 md:grid-cols-2">
                        <p>Kategorie: {operation.category}</p>
                        <p>
                          Modell:{" "}
                          {getFinishingPricingModeLabel(operation.pricingMode)}
                        </p>
                        <p>Grundpreis: {formatCurrency(operation.basePrice)}</p>
                        <p>
                          Mindestpreis: {formatCurrency(operation.minimumPrice)}
                        </p>
                        <p>Rüstzeit: {operation.setupMinutes} Min.</p>
                        <p>Berechnet: {formatCurrency(itemPrice)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-3xl bg-slate-950 p-5 text-white">
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                  Summe Weiterverarbeitung
                </p>
                <p className="mt-2 text-3xl font-black">
                  {formatCurrency(calculatedFinishingCost)}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <NumberField
                label="Zuschuss"
                value={fixedOvers}
                onChange={setFixedOvers}
                suffix="Bogen"
              />
              <NumberField
                label="Ausschuss"
                value={wastePercent}
                onChange={setWastePercent}
                suffix="%"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <NumberField
                label="Rüstzeit Druck"
                value={setupMinutes}
                onChange={setSetupMinutes}
                suffix="Min."
              />
              <NumberField
                label="Zusatzkosten WV"
                value={finishingExtraCost}
                onChange={setFinishingExtraCost}
                suffix="€"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <NumberField
                label="Gemeinkosten"
                value={overheadPercent}
                onChange={setOverheadPercent}
                suffix="%"
              />
              <NumberField
                label="Deckungsbeitrag / Marge"
                value={marginPercent}
                onChange={setMarginPercent}
                suffix="%"
              />
            </div>
          </div>
        </div>

        <div className="space-y-5 xl:sticky xl:top-28 xl:self-start">
          <div className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-slate-950/20">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                    Ergebnis
                  </p>
                  <p className="mt-2 text-4xl font-black tracking-tight">
                    {formatCurrency(sellingPrice)}
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-400">
                    {formatCurrency(unitPrice)} pro Stück · netto
                  </p>
                </div>

                <div
                  className={`rounded-2xl px-3 py-2 text-xs font-black ${
                    hasCalculationErrors
                      ? "bg-rose-500 text-white"
                      : calculationWarningCount > 0
                        ? "bg-amber-400 text-slate-950"
                        : "bg-emerald-400 text-slate-950"
                  }`}
                >
                  {hasCalculationErrors
                    ? "Prüfen"
                    : calculationWarningCount > 0
                      ? "Hinweise"
                      : "OK"}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Selbstkosten
                  </p>
                  <p className="mt-2 text-lg font-black">
                    {formatCurrency(totalCost)}
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-400/15 p-4 text-emerald-200">
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-300">
                    Ertrag
                  </p>
                  <p className="mt-2 text-lg font-black">
                    {formatCurrency(profit)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToQuote}
                disabled={hasCalculationErrors}
                className={`mt-5 w-full rounded-2xl px-5 py-4 text-sm font-black shadow-lg transition ${
                  hasCalculationErrors
                    ? "cursor-not-allowed bg-slate-700 text-slate-400 shadow-none"
                    : "bg-emerald-400 text-slate-950 shadow-emerald-500/20 hover:-translate-y-0.5 hover:bg-emerald-300"
                }`}
              >
                {hasCalculationErrors
                  ? "Kalkulation zuerst prüfen"
                  : "In Angebot übernehmen"}
              </button>
            </div>
          </div>

          <div
            className={`rounded-[2rem] border p-5 shadow-sm ${
              hasCalculationErrors
                ? "border-rose-200 bg-rose-50"
                : calculationWarningCount > 0
                  ? "border-amber-200 bg-amber-50"
                  : calculationInfoCount > 0
                    ? "border-sky-200 bg-sky-50"
                    : "border-emerald-200 bg-emerald-50"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className={`text-xs font-extrabold uppercase tracking-wide ${
                    hasCalculationErrors
                      ? "text-rose-700"
                      : calculationWarningCount > 0
                        ? "text-amber-700"
                        : calculationInfoCount > 0
                          ? "text-sky-700"
                          : "text-emerald-700"
                  }`}
                >
                  Kalkulationsstatus
                </p>
                <h3 className="mt-1 text-lg font-black text-slate-950">
                  {calculationWarnings.length === 0
                    ? "Alles plausibel"
                    : `${calculationWarnings.length} Meldung${
                        calculationWarnings.length === 1 ? "" : "en"
                      }`}
                </h3>
              </div>

              <div className="flex shrink-0 flex-wrap justify-end gap-1 text-xs font-black">
                {calculationErrorCount > 0 && (
                  <span className="rounded-full bg-rose-600 px-2 py-1 text-white">
                    {calculationErrorCount} Fehler
                  </span>
                )}
                {calculationWarningCount > 0 && (
                  <span className="rounded-full bg-amber-500 px-2 py-1 text-white">
                    {calculationWarningCount} Warnung
                  </span>
                )}
                {calculationInfoCount > 0 && (
                  <span className="rounded-full bg-sky-500 px-2 py-1 text-white">
                    {calculationInfoCount} Info
                  </span>
                )}
              </div>
            </div>

            {calculationWarnings.length > 0 ? (
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <p
                    className={`text-sm font-black ${
                      calculationWarnings[0].level === "error"
                        ? "text-rose-800"
                        : calculationWarnings[0].level === "warning"
                          ? "text-amber-900"
                          : "text-sky-800"
                    }`}
                  >
                    {calculationWarnings[0].title}
                  </p>
                  <p className="mt-1 text-sm font-bold leading-6 text-slate-600">
                    {calculationWarnings[0].description}
                  </p>
                </div>

                {calculationWarnings.length > 1 && (
                  <details className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-bold text-slate-700">
                    <summary className="cursor-pointer font-black">
                      Alle Meldungen anzeigen
                    </summary>
                    <div className="mt-3 space-y-3">
                      {calculationWarnings.slice(1).map((warning, index) => (
                        <div
                          key={`${warning.title}-${index}`}
                          className="border-t border-slate-200 pt-3"
                        >
                          <p className="font-black text-slate-950">
                            {warning.title}
                          </p>
                          <p className="mt-1 leading-6 text-slate-600">
                            {warning.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm font-bold leading-6 text-emerald-800">
                Die wichtigsten Plausibilitätsprüfungen sind unauffällig.
              </p>
            )}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                  Kostenmix
                </p>
                <h3 className="mt-1 text-lg font-black">Kostentreiber</h3>
              </div>
              <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                netto
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {costAnalysisItems.map((item) => {
                const percent = (item.value / costAnalysisTotal) * 100;

                return (
                  <CostAnalysisRow
                    key={item.label}
                    label={item.label}
                    value={formatCurrency(item.value)}
                    percent={percent}
                    className={item.className}
                  />
                );
              })}
            </div>
          </div>

          <details className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <summary className="cursor-pointer text-sm font-black uppercase tracking-wide text-slate-500">
              Kostenübersicht anzeigen
            </summary>

            <div className="mt-5 space-y-3">
              <CostRow
                label="Endformat"
                value={`${finalWidthMm} × ${finalHeightMm} mm`}
              />
              <CostRow
                label="Berechneter Nutzen"
                value={`${safeItemsPerSheet}`}
              />
              <CostRow
                label="Produktionsbogen"
                value={`${productionSheets} Bogen`}
              />
              <CostRow label="Zuschuss" value={`${fixedOvers} Bogen`} />
              <CostRow label="Ausschussbogen" value={`${wasteSheets} Bogen`} />
              <CostRow
                label="Druck-/WV-Gesamtbogen"
                value={`${totalSheets} Bogen`}
                highlight
              />

              <div className="my-4 border-t border-slate-200" />

              {selectedMaterialItems.map((item, index) => (
                <CostRow
                  key={item.id}
                  label={`Material ${index + 1}: ${item.label}`}
                  value={`${formatCurrency(item.cost)} · ${item.totalMaterialSheets.toLocaleString("de-DE")} Bg.`}
                />
              ))}
              <CostRow
                label="Material gesamt"
                value={formatCurrency(materialCost)}
                highlight
              />

              <div className="my-4 border-t border-slate-200" />

              {machineCost.rows.map((row) => (
                <CostRow key={row.label} label={row.label} value={row.value} />
              ))}
              <CostRow
                label="Maschinenkosten gesamt"
                value={formatCurrency(printCost)}
              />
              <CostRow
                label="Rüstzeit Maschine"
                value={formatCurrency(setupCost)}
              />

              <div className="my-4 border-t border-slate-200" />

              {selectedFinishingItems.map((item, index) => (
                <CostRow
                  key={item.selectionId}
                  label={`WV ${index + 1}: ${item.operation.name}`}
                  value={formatCurrency(item.price)}
                />
              ))}
              <CostRow
                label="WV berechnet"
                value={formatCurrency(calculatedFinishingCost)}
                highlight
              />
              <CostRow
                label="WV Zusatzkosten"
                value={formatCurrency(finishingExtraCost)}
              />
              <CostRow
                label="WV gesamt"
                value={formatCurrency(finishingCost)}
              />

              <div className="my-4 border-t border-slate-200" />

              <CostRow
                label="Direkte Kosten"
                value={formatCurrency(directCost)}
              />
              <CostRow
                label="Gemeinkosten"
                value={formatCurrency(overheadCost)}
              />
              <CostRow
                label="Selbstkosten"
                value={formatCurrency(totalCost)}
                highlight
              />
            </div>
          </details>

          <details className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <summary className="cursor-pointer text-sm font-black uppercase tracking-wide text-slate-500">
              Staffelpreise anzeigen
            </summary>

            <div className="mt-5 space-y-3">
              {tiers.map((tier) => (
                <div
                  key={tier.quantity}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-black">{tier.quantity} Stück</p>
                    <p className="text-xs font-bold text-slate-400">
                      {tier.sheets} Bg. · Material {formatCurrency(tier.material)} ·
                      WV {formatCurrency(tier.finishing)} · {formatCurrency(tier.unit)} / Stück
                    </p>
                  </div>
                  <p className="text-sm font-black">{formatCurrency(tier.price)}</p>
                </div>
              ))}
            </div>
          </details>

          <details className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <summary className="cursor-pointer text-sm font-black uppercase tracking-wide text-slate-500">
              Maschinendetails anzeigen
            </summary>

            <div className="mt-5 rounded-3xl bg-slate-50 p-5">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                Maschine
              </p>
              <p className="mt-3 text-lg font-black">{selectedMachine.name}</p>
              <p className="mt-2 text-sm font-bold text-slate-500">
                Kostenmodell: {getMachineCostModelLabel(machineCostModel)}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-500">
                Stundensatz: {formatCurrency(selectedMachine.hourlyRate)} / h
              </p>
              {machineCost.rows.map((row) => (
                <p
                  key={row.label}
                  className="mt-1 text-sm font-bold text-slate-500"
                >
                  {row.label}: {row.value}
                </p>
              ))}
            </div>
          </details>
        </div>

      </section>
    </div>
  );
}

function QuotesPage({
  quotePositions,
  setQuotePositions,
  company,
  documentTemplateSettings,
  numberCircleSettings,
  setNumberCircleSettings,
  customers,
  savedDocuments,
  setSavedDocuments,
  serviceItems,
}: {
  quotePositions: QuotePosition[];
  setQuotePositions: Dispatch<SetStateAction<QuotePosition[]>>;
  company: CompanyProfile;
  documentTemplateSettings: DocumentTemplateSettings;
  numberCircleSettings: NumberCircleSettings;
  setNumberCircleSettings: Dispatch<SetStateAction<NumberCircleSettings>>;
  customers: Customer[];
  savedDocuments: SavedDocument[];
  setSavedDocuments: Dispatch<SetStateAction<SavedDocument[]>>;
  serviceItems: ServiceItem[];
}) {
  const [activeBusinessDocumentType, setActiveBusinessDocumentType] =
    useState<DocumentType>("quote");
  const [activeSavedDocumentId, setActiveSavedDocumentId] = useState<
    string | null
  >(null);
  const [documentStatus, setDocumentStatus] =
    useState<DocumentStatus>("Entwurf");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("Offen");
  const [paymentDueDate, setPaymentDueDate] = useState(() =>
    addDaysIso("2026-05-01", 14),
  );
  const [paymentPaidDate, setPaymentPaidDate] = useState("");
  const [paymentPaidAmount, setPaymentPaidAmount] = useState(0);
  const [documentSearch, setDocumentSearch] = useState("");
  const [documentTypeFilter, setDocumentTypeFilter] = useState<string>("all");
  const [documentStatusFilter, setDocumentStatusFilter] =
    useState<string>("all");
  const [selectedServiceItemId, setSelectedServiceItemId] = useState(
    () =>
      serviceItems.find((item) => item.status === "Aktiv")?.id ??
      serviceItems[0]?.id ??
      "",
  );
  const [quoteNumber, setQuoteNumber] = useState(() =>
    formatDocumentNumber(numberCircleSettings.quote),
  );
  const activeBusinessDocumentTemplate =
    documentTemplateSettings[activeBusinessDocumentType];
  const activeBusinessDocumentLabel = activeBusinessDocumentTemplate.label;
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    customers[0]?.id ?? "manual",
  );
  const [customerName, setCustomerName] = useState(
    customers[0]?.company ?? "Musterkunde GmbH",
  );
  const [quoteDate, setQuoteDate] = useState("2026-05-01");
  const [validUntil, setValidUntil] = useState("2026-05-15");
  const [introText, setIntroText] = useState(
    activeBusinessDocumentTemplate.introText,
  );
  const [paymentTerms, setPaymentTerms] = useState(
    "Zahlbar innerhalb von 14 Tagen netto.",
  );
  const [deliveryTerms, setDeliveryTerms] = useState(
    activeBusinessDocumentTemplate.footerText,
  );

  const selectedCustomer =
    selectedCustomerId === "manual"
      ? undefined
      : customers.find((customer) => customer.id === selectedCustomerId);

  const quoteCustomerName = selectedCustomer?.company ?? customerName;
  const companyCityLine = [company.zip, company.city].filter(Boolean).join(" ");
  const companyAddressLine = [company.street, companyCityLine]
    .filter(Boolean)
    .join(" · ");
  const companyContactLine = [company.phone, company.email, company.website]
    .filter(Boolean)
    .join(" · ");
  const companySenderLine = [company.name, company.street, companyCityLine]
    .filter(Boolean)
    .join(" · ");

  const customerAddressLines = selectedCustomer
    ? [
        selectedCustomer.company,
        selectedCustomer.contactPerson
          ? `z. Hd. ${selectedCustomer.contactPerson}`
          : "",
        selectedCustomer.street,
        `${selectedCustomer.zip} ${selectedCustomer.city}`.trim(),
      ].filter(Boolean)
    : [quoteCustomerName].filter(Boolean);

  const customerMetaRows = selectedCustomer
    ? [
        { label: "Kundennummer", value: selectedCustomer.customerNumber },
        { label: "Ansprechpartner", value: selectedCustomer.contactPerson },
        { label: "E-Mail", value: selectedCustomer.email },
        { label: "Telefon", value: selectedCustomer.phone },
      ].filter((item) => Boolean(item.value))
    : [];

  const documentTotals = calculateDocumentTotals(quotePositions);
  const netTotal = documentTotals.netTotal;
  const vatTotals = documentTotals.vatTotals;
  const grossTotal = documentTotals.grossTotal;
  const isInvoice = activeBusinessDocumentType === "invoice";
  const safePaymentPaidAmount = Math.max(paymentPaidAmount, 0);
  const openPaymentAmount = Math.max(grossTotal - safePaymentPaidAmount, 0);
  const currentResolvedPaymentStatus =
    getResolvedPaymentStatusForCurrentInvoice(
      paymentStatus,
      paymentDueDate,
      openPaymentAmount,
    );
  const currentPaymentStatusClasses = getPaymentStatusClasses(
    currentResolvedPaymentStatus,
  );
  const invoicePaymentHint = getInvoicePaymentHint(
    paymentStatus,
    paymentDueDate,
    openPaymentAmount,
  );
  const currentInvoiceOverdueDays = getInvoiceOverdueDays(
    paymentDueDate,
    openPaymentAmount,
  );

  const filteredSavedDocuments = savedDocuments.filter((documentItem) => {
    const normalizedSearch = documentSearch.trim().toLowerCase();
    const documentTypeLabel =
      documentTemplateSettings[documentItem.documentType]?.label ??
      documentItem.documentType;
    const documentTotals = calculateDocumentTotals(documentItem.positions);
    const documentNetTotal = documentTotals.netTotal;
    const documentGrossTotal = documentTotals.grossTotal;

    const matchesSearch =
      normalizedSearch.length === 0 ||
      documentItem.documentNumber.toLowerCase().includes(normalizedSearch) ||
      documentItem.customerName.toLowerCase().includes(normalizedSearch) ||
      documentTypeLabel.toLowerCase().includes(normalizedSearch) ||
      documentItem.status.toLowerCase().includes(normalizedSearch) ||
      (documentItem.paymentStatus ?? "")
        .toLowerCase()
        .includes(normalizedSearch) ||
      (documentItem.paymentDueDate ?? "")
        .toLowerCase()
        .includes(normalizedSearch) ||
      formatCurrency(documentNetTotal)
        .toLowerCase()
        .includes(normalizedSearch) ||
      formatCurrency(documentGrossTotal)
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesType =
      documentTypeFilter === "all" ||
      documentItem.documentType === documentTypeFilter;
    const matchesStatus =
      documentStatusFilter === "all" ||
      documentItem.status === documentStatusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });
  const activeServiceItems = serviceItems.filter(
    (item) => item.status === "Aktiv",
  );
  const selectedServiceItem = serviceItems.find(
    (item) => item.id === selectedServiceItemId,
  );
  const isDeliveryNote = activeBusinessDocumentType === "deliveryNote";

  function addQuotePosition() {
    setQuotePositions((current) => [
      ...current,
      {
        id: createLocalId(),
        title: "Neue Position",
        description: "Beschreibung der Druckleistung.",
        quantity: 1,
        unitPrice: 0,
        vatRate: 19,
        internalNote: "",
      },
    ]);
  }

  function addServiceItemToQuote() {
    if (!selectedServiceItem) {
      return;
    }

    const descriptionParts = [
      selectedServiceItem.description,
      selectedServiceItem.itemNumber
        ? `Artikelnummer: ${selectedServiceItem.itemNumber}`
        : "",
      selectedServiceItem.category
        ? `Kategorie: ${selectedServiceItem.category}`
        : "",
      selectedServiceItem.unit ? `Einheit: ${selectedServiceItem.unit}` : "",
      `MwSt.: ${formatNumber(selectedServiceItem.vatRate, 0)} %`,
    ].filter(Boolean);

    setQuotePositions((current) => [
      ...current,
      {
        id: createLocalId(),
        title: selectedServiceItem.title,
        description: descriptionParts.join("\n"),
        quantity: 1,
        unitPrice: selectedServiceItem.unitPrice,
        vatRate: selectedServiceItem.vatRate,
        internalNote: "",
      },
    ]);
  }

  function updateQuotePosition(
    positionId: string,
    field: keyof Omit<QuotePosition, "id">,
    value: string | number,
  ) {
    setQuotePositions((current) =>
      current.map((position) =>
        position.id === positionId ? { ...position, [field]: value } : position,
      ),
    );
  }

  function removeQuotePosition(positionId: string) {
    setQuotePositions((current) =>
      current.length <= 1
        ? current
        : current.filter((position) => position.id !== positionId),
    );
  }

  function duplicateQuotePosition(positionId: string) {
    setQuotePositions((current) => {
      const positionIndex = current.findIndex(
        (position) => position.id === positionId,
      );

      if (positionIndex === -1) {
        return current;
      }

      const duplicatedPosition: QuotePosition = {
        ...current[positionIndex],
        id: createLocalId(),
        title: `${current[positionIndex].title} Kopie`,
      };

      return [
        ...current.slice(0, positionIndex + 1),
        duplicatedPosition,
        ...current.slice(positionIndex + 1),
      ];
    });
  }

  function moveQuotePosition(positionId: string, direction: "up" | "down") {
    setQuotePositions((current) => {
      const positionIndex = current.findIndex(
        (position) => position.id === positionId,
      );
      const targetIndex =
        direction === "up" ? positionIndex - 1 : positionIndex + 1;

      if (
        positionIndex === -1 ||
        targetIndex < 0 ||
        targetIndex >= current.length
      ) {
        return current;
      }

      const nextPositions = [...current];
      const [movedPosition] = nextPositions.splice(positionIndex, 1);
      nextPositions.splice(targetIndex, 0, movedPosition);

      return nextPositions;
    });
  }

  function handleCustomerChange(customerId: string) {
    setSelectedCustomerId(customerId);

    if (customerId === "manual") {
      return;
    }

    const customer = customers.find((item) => item.id === customerId);

    if (customer) {
      setCustomerName(customer.company);
    }
  }

  function handleCreateNextDocumentNumber(
    documentType: DocumentType = activeBusinessDocumentType,
  ) {
    const currentCircle = numberCircleSettings[documentType];

    setQuoteNumber(formatDocumentNumber(currentCircle));
    setNumberCircleSettings((current) => ({
      ...current,
      [documentType]: {
        ...current[documentType],
        nextNumber: current[documentType].nextNumber + 1,
      },
    }));
  }

  function handleSwitchBusinessDocumentType(documentType: DocumentType) {
    setActiveBusinessDocumentType(documentType);
    setIntroText(documentTemplateSettings[documentType].introText);
    setDeliveryTerms(documentTemplateSettings[documentType].footerText);
  }

  function handleCreateOrderConfirmation() {
    setActiveSavedDocumentId(null);
    setDocumentStatus("Entwurf");
    handleSwitchBusinessDocumentType("orderConfirmation");
    handleCreateNextDocumentNumber("orderConfirmation");
  }

  function handleCreateInvoice() {
    setActiveSavedDocumentId(null);
    setDocumentStatus("Entwurf");
    setPaymentStatus("Offen");
    setPaymentDueDate(addDaysIso(quoteDate, 14));
    setPaymentPaidDate("");
    setPaymentPaidAmount(0);
    handleSwitchBusinessDocumentType("invoice");
    handleCreateNextDocumentNumber("invoice");
  }

  function handleCreateDeliveryNote() {
    setActiveSavedDocumentId(null);
    setDocumentStatus("Entwurf");
    handleSwitchBusinessDocumentType("deliveryNote");
    handleCreateNextDocumentNumber("deliveryNote");
  }

  function handleCreateReminder() {
    const originalInvoiceNumber =
      activeBusinessDocumentType === "invoice" ? quoteNumber : "";
    const openAmount = Math.max(grossTotal - safePaymentPaidAmount, 0);
    const reminderDueDate = addDaysIso(todayIso(), 7);
    const baseIntroText = documentTemplateSettings.reminder.introText;

    setActiveSavedDocumentId(null);
    setDocumentStatus("Entwurf");
    setPaymentStatus("Offen");
    setPaymentDueDate(reminderDueDate);
    setPaymentPaidDate("");
    setPaymentPaidAmount(0);
    setValidUntil(reminderDueDate);
    setActiveBusinessDocumentType("reminder");
    setIntroText(
      [
        baseIntroText,
        originalInvoiceNumber
          ? `Bezug: Rechnung ${originalInvoiceNumber}.`
          : "",
        `Offener Betrag: ${formatCurrency(openAmount)}.`,
        `Neue Zahlungsfrist: ${formatDateGerman(reminderDueDate)}.`,
      ]
        .filter(Boolean)
        .join("\\n"),
    );
    setDeliveryTerms(documentTemplateSettings.reminder.footerText);
    handleCreateNextDocumentNumber("reminder");
  }

  function handleBackToQuote() {
    setActiveSavedDocumentId(null);
    setDocumentStatus("Entwurf");
    setPaymentStatus("Offen");
    setPaymentDueDate(addDaysIso(quoteDate, 14));
    setPaymentPaidDate("");
    setPaymentPaidAmount(0);
    handleSwitchBusinessDocumentType("quote");
  }

  function buildCurrentSavedDocument(
    existingId?: string | null,
  ): SavedDocument {
    const now = new Date().toISOString();

    return {
      id: existingId ?? createLocalId(),
      documentType: activeBusinessDocumentType,
      documentNumber: quoteNumber,
      customerId: selectedCustomerId,
      customerName: quoteCustomerName,
      date: quoteDate,
      validUntil,
      introText,
      deliveryTerms,
      paymentTerms,
      positions: normalizeQuotePositions(quotePositions),
      status: documentStatus,
      paymentStatus:
        activeBusinessDocumentType === "invoice" ? paymentStatus : undefined,
      paymentDueDate:
        activeBusinessDocumentType === "invoice" ? paymentDueDate : undefined,
      paymentPaidDate:
        activeBusinessDocumentType === "invoice" ? paymentPaidDate : undefined,
      paymentPaidAmount:
        activeBusinessDocumentType === "invoice"
          ? safePaymentPaidAmount
          : undefined,
      createdAt:
        savedDocuments.find((documentItem) => documentItem.id === existingId)
          ?.createdAt ?? now,
      updatedAt: now,
    };
  }

  function handleSaveCurrentDocument() {
    const nextDocument = buildCurrentSavedDocument(activeSavedDocumentId);

    setSavedDocuments((current) => {
      const existingDocument = current.some(
        (documentItem) => documentItem.id === nextDocument.id,
      );

      if (existingDocument) {
        return current.map((documentItem) =>
          documentItem.id === nextDocument.id ? nextDocument : documentItem,
        );
      }

      return [nextDocument, ...current];
    });

    setActiveSavedDocumentId(nextDocument.id);
  }

  function handleOpenSavedDocument(documentItem: SavedDocument) {
    setActiveSavedDocumentId(documentItem.id);
    setActiveBusinessDocumentType(documentItem.documentType);
    setQuoteNumber(documentItem.documentNumber);
    setSelectedCustomerId(documentItem.customerId);
    setCustomerName(documentItem.customerName);
    setQuoteDate(documentItem.date);
    setValidUntil(documentItem.validUntil);
    setIntroText(documentItem.introText);
    setDeliveryTerms(documentItem.deliveryTerms);
    setPaymentTerms(documentItem.paymentTerms);
    setDocumentStatus(documentItem.status);
    setPaymentStatus(documentItem.paymentStatus ?? "Offen");
    setPaymentDueDate(
      documentItem.paymentDueDate ?? addDaysIso(documentItem.date, 14),
    );
    setPaymentPaidDate(documentItem.paymentPaidDate ?? "");
    setPaymentPaidAmount(documentItem.paymentPaidAmount ?? 0);
    setQuotePositions(normalizeQuotePositions(documentItem.positions));
  }

  function handleDuplicateSavedDocument(documentItem: SavedDocument) {
    const now = new Date().toISOString();
    const duplicatedDocument: SavedDocument = {
      ...documentItem,
      id: createLocalId(),
      documentNumber: `${documentItem.documentNumber}-KOPIE`,
      status: "Entwurf",
      paymentStatus:
        documentItem.documentType === "invoice" ? "Offen" : undefined,
      paymentDueDate:
        documentItem.documentType === "invoice"
          ? addDaysIso(todayIso(), 14)
          : undefined,
      paymentPaidDate: undefined,
      paymentPaidAmount:
        documentItem.documentType === "invoice" ? 0 : undefined,
      createdAt: now,
      updatedAt: now,
      positions: normalizeQuotePositions(documentItem.positions).map(
        (position) => ({ ...position, id: createLocalId() }),
      ),
    };

    setSavedDocuments((current) => [duplicatedDocument, ...current]);
    handleOpenSavedDocument(duplicatedDocument);
  }

  function handleDeleteSavedDocument(documentId: string) {
    setSavedDocuments((current) =>
      current.filter((documentItem) => documentItem.id !== documentId),
    );

    if (activeSavedDocumentId === documentId) {
      setActiveSavedDocumentId(null);
    }
  }

  function handlePrintDocument(action: "print" | "pdf" = "print") {
    const printElement = document.querySelector(".print-area");

    if (!printElement) {
      window.print();
      return;
    }

    const printWindow = window.open("", "_blank", "width=900,height=1200");

    if (!printWindow) {
      window.print();
      return;
    }

    const safeCustomerName = quoteCustomerName
      .replace(/[^a-zA-Z0-9äöüÄÖÜß\- ]/g, "")
      .trim()
      .replace(/\s+/g, "_");

    const isPdfMode = action === "pdf";
    const documentFileName = `${quoteNumber}${safeCustomerName ? `_${safeCustomerName}` : ""}`;

    const printTopMm = Math.max(activeBusinessDocumentTemplate.topMm, 0);
    const printBottomMm = Math.max(activeBusinessDocumentTemplate.bottomMm, 0);
    const printLeftMm = Math.max(activeBusinessDocumentTemplate.leftMm, 18);
    const printRightMm = Math.max(activeBusinessDocumentTemplate.rightMm, 18);

    const styles = Array.from(
      document.querySelectorAll('style, link[rel="stylesheet"]'),
    )
      .map((node) => node.outerHTML)
      .join("\n");

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${isPdfMode ? `${documentFileName}.pdf` : documentFileName}</title>
          <meta charset="utf-8" />
          ${styles}
          <style>
            @page {
              size: A4;
              margin: ${printTopMm}mm ${printRightMm}mm ${printBottomMm}mm ${printLeftMm}mm;
            }

            html,
            body {
              width: auto;
              min-height: auto;
              margin: 0;
              padding: 0;
              overflow: visible;
              background: white;
              color: #0f172a;
              font-family: Inter, "Segoe UI", Arial, Helvetica, sans-serif;
            }

            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .print-shell {
              width: 100%;
              max-width: 100%;
              min-height: auto;
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              background: white;
            }

            .print-area {
              width: 100% !important;
              max-width: 100% !important;
              min-height: 0 !important;
              height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
              border: none !important;
              border-radius: 0 !important;
              background: white !important;
            }

            .print-area * {
              box-sizing: border-box;
            }

            button {
              display: none !important;
            }
          </style>
        </head>
        <body>
          <main class="print-shell">
            ${printElement.outerHTML}
          </main>
          <script>
            window.onload = function () {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-slate-950/20">
        <div className="relative p-7 lg:p-9">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-yellow-300/20 blur-3xl" />
          <div className="absolute bottom-0 right-40 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-yellow-300">
                Dokumente V61
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">
                Dokument erstellen
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Dokumente erstellen, speichern, wieder öffnen und direkt drucken
                oder als PDF speichern.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5 text-slate-950 shadow-xl">
              <p className="text-sm font-bold text-slate-500">
                {isDeliveryNote ? "Positionen" : "Dokument brutto"}
              </p>
              <p className="mt-2 text-4xl font-black">
                {isDeliveryNote
                  ? quotePositions.length
                  : formatCurrency(grossTotal)}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-500">
                {isDeliveryNote
                  ? "ohne Preisangaben"
                  : `Netto ${formatCurrency(netTotal)}`}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-2 w-24 rounded-full bg-gradient-to-r from-yellow-300 via-fuchsia-500 to-cyan-400" />
            <h3 className="mt-5 text-xl font-black">Dokumentkopf</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Kundenauswahl und Stammdaten für die Dokumentvorschau.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <InputField
                  label="Dokumentnummer"
                  value={quoteNumber}
                  onChange={setQuoteNumber}
                />
                <button
                  type="button"
                  onClick={() => handleCreateNextDocumentNumber()}
                  className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5"
                >
                  Neue Nummer
                </button>
              </div>
              <SelectField
                label="Kunde auswählen"
                value={selectedCustomerId}
                onChange={handleCustomerChange}
                options={[
                  ...customers.map((customer) => ({
                    value: customer.id,
                    label: `${customer.customerNumber} · ${customer.company}`,
                  })),
                  { value: "manual", label: "Freitext / kein Kunde" },
                ]}
              />
              <InputField
                label="Kunde / Freitext"
                value={customerName}
                onChange={setCustomerName}
              />
              <InputField
                label="Datum"
                value={quoteDate}
                onChange={setQuoteDate}
              />
              <InputField
                label={
                  activeBusinessDocumentType === "invoice"
                    ? "Fällig bis"
                    : activeBusinessDocumentType === "deliveryNote"
                      ? "Lieferdatum"
                      : activeBusinessDocumentType === "reminder"
                        ? "Zahlungsfrist bis"
                        : "Gültig bis"
                }
                value={validUntil}
                onChange={setValidUntil}
              />
              <SelectField
                label="Status"
                value={documentStatus}
                onChange={(value) => setDocumentStatus(value as DocumentStatus)}
                options={documentStatusOptions.map((status) => ({
                  value: status,
                  label: status,
                }))}
              />
            </div>

            {selectedCustomer && (
              <div className="mt-5 rounded-3xl bg-slate-50 p-5">
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                  Ausgewählter Kunde
                </p>
                <p className="mt-2 text-lg font-black">
                  {selectedCustomer.company}
                </p>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  {selectedCustomer.contactPerson} ·{" "}
                  {selectedCustomer.customerNumber}
                </p>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  {selectedCustomer.street}, {selectedCustomer.zip}{" "}
                  {selectedCustomer.city}
                </p>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  {[selectedCustomer.email, selectedCustomer.phone]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            )}

            {isInvoice && (
              <div
                className={`mt-5 rounded-3xl p-5 ${currentPaymentStatusClasses.panel}`}
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p
                      className={`text-xs font-extrabold uppercase tracking-wide ${currentPaymentStatusClasses.label}`}
                    >
                      Zahlungsstatus Rechnung
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black shadow-sm ${currentPaymentStatusClasses.badge}`}
                      >
                        {currentResolvedPaymentStatus}
                      </span>
                      <p
                        className={`text-sm font-bold ${currentPaymentStatusClasses.text}`}
                      >
                        {invoicePaymentHint}
                      </p>
                      {currentInvoiceOverdueDays > 0 && (
                        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 shadow-sm">
                          Seit {currentInvoiceOverdueDays} Tagen fällig
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-sm">
                    <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                      Offen
                    </p>
                    <p
                      className={`mt-1 text-lg font-black ${openPaymentAmount > 0 ? "text-rose-700" : "text-emerald-700"}`}
                    >
                      {formatCurrency(openPaymentAmount)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <SelectField
                    label="Zahlungsstatus"
                    value={paymentStatus}
                    onChange={(value) =>
                      setPaymentStatus(value as PaymentStatus)
                    }
                    options={paymentStatusOptions.map((status) => ({
                      value: status,
                      label: status,
                    }))}
                  />
                  <InputField
                    label="Fälligkeitsdatum"
                    value={paymentDueDate}
                    onChange={setPaymentDueDate}
                  />
                  <NumberField
                    label="Zahlungseingang"
                    value={paymentPaidAmount}
                    onChange={setPaymentPaidAmount}
                    suffix="€"
                    step={0.01}
                  />
                  <InputField
                    label="Bezahlt am"
                    value={paymentPaidDate}
                    onChange={setPaymentPaidDate}
                  />
                </div>
              </div>
            )}

            <div className="mt-5 rounded-3xl bg-slate-50 p-5">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                Dokumenttyp
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1.7fr_1fr_1fr_1fr]">
                <button
                  type="button"
                  onClick={handleBackToQuote}
                  className={`min-h-[64px] whitespace-nowrap rounded-2xl px-4 py-4 text-sm font-black leading-tight transition ${
                    activeBusinessDocumentType === "quote"
                      ? "bg-slate-950 text-white shadow-sm"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Angebot
                </button>
                <button
                  type="button"
                  onClick={handleCreateOrderConfirmation}
                  className={`min-h-[64px] whitespace-nowrap rounded-2xl px-4 py-4 text-sm font-black leading-tight transition ${
                    activeBusinessDocumentType === "orderConfirmation"
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  Auftragsbestätigung
                </button>
                <button
                  type="button"
                  onClick={handleCreateInvoice}
                  className={`min-h-[64px] whitespace-nowrap rounded-2xl px-4 py-4 text-sm font-black leading-tight transition ${
                    activeBusinessDocumentType === "invoice"
                      ? "bg-cyan-500 text-white shadow-sm"
                      : "bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                  }`}
                >
                  Rechnung
                </button>

                <button
                  type="button"
                  onClick={handleCreateDeliveryNote}
                  className={`min-h-[64px] whitespace-nowrap rounded-2xl px-4 py-4 text-sm font-black leading-tight transition ${
                    activeBusinessDocumentType === "deliveryNote"
                      ? "bg-violet-500 text-white shadow-sm"
                      : "bg-violet-50 text-violet-700 hover:bg-violet-100"
                  }`}
                >
                  Lieferschein
                </button>

                <button
                  type="button"
                  onClick={handleCreateReminder}
                  className={`min-h-[64px] whitespace-nowrap rounded-2xl px-4 py-4 text-sm font-black leading-tight transition ${
                    activeBusinessDocumentType === "reminder"
                      ? "bg-rose-500 text-white shadow-sm"
                      : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                  }`}
                >
                  Mahnung
                </button>
              </div>
              <p className="mt-3 text-sm font-bold leading-6 text-slate-500">
                Kunde, Positionen, Logo und Firmendaten bleiben erhalten. Bei
                Angebot, Auftragsbestätigung, Rechnung und Mahnung werden Preise
                gezeigt; beim Lieferschein werden Preise und Summen
                ausgeblendet.
              </p>
            </div>

            <div className="mt-5 rounded-3xl bg-slate-50 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                    Speichern
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-500">
                    {activeSavedDocumentId
                      ? "Dieses Dokument ist gespeichert und kann überschrieben werden."
                      : "Dieses Dokument ist noch nicht gespeichert."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveCurrentDocument}
                  className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-600"
                >
                  Dokument speichern
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <TextAreaField
                label="Einleitung"
                value={introText}
                onChange={setIntroText}
              />
              <TextAreaField
                label="Fußtext / Bedingungen"
                value={deliveryTerms}
                onChange={setDeliveryTerms}
              />
              <InputField
                label="Zahlungsbedingungen"
                value={paymentTerms}
                onChange={setPaymentTerms}
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="h-2 w-24 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500" />
                <h3 className="mt-5 text-xl font-black">Positionen</h3>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Dokumentpositionen mit Menge und Einzelpreis netto.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
                <SelectField
                  label="Leistung auswählen"
                  value={selectedServiceItemId}
                  onChange={setSelectedServiceItemId}
                  options={
                    activeServiceItems.length > 0
                      ? activeServiceItems.map((item) => ({
                          value: item.id,
                          label: `${item.itemNumber} · ${item.title} · ${formatCurrency(item.unitPrice)} / ${item.unit}`,
                        }))
                      : [
                          {
                            value: "",
                            label: "Keine aktive Leistung vorhanden",
                          },
                        ]
                  }
                />

                <button
                  type="button"
                  onClick={addServiceItemToQuote}
                  disabled={!selectedServiceItem}
                  className={`rounded-2xl px-5 py-3 text-sm font-black text-white shadow-sm transition ${
                    selectedServiceItem
                      ? "bg-indigo-500 hover:-translate-y-0.5 hover:bg-indigo-600"
                      : "cursor-not-allowed bg-slate-300"
                  }`}
                >
                  Leistung übernehmen
                </button>

                <button
                  type="button"
                  onClick={addQuotePosition}
                  className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5"
                >
                  + freie Position
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {quotePositions.map((position, index) => {
                const positionTotal = position.quantity * position.unitPrice;

                return (
                  <div
                    key={position.id}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="grid gap-4">
                      <InputField
                        label={`Position ${index + 1}`}
                        value={position.title}
                        onChange={(value) =>
                          updateQuotePosition(position.id, "title", value)
                        }
                      />

                      <TextAreaField
                        label="Kundenbeschreibung"
                        value={position.description}
                        onChange={(value) =>
                          updateQuotePosition(position.id, "description", value)
                        }
                      />

                      <TextAreaField
                        label="Interne Notiz"
                        value={position.internalNote ?? ""}
                        onChange={(value) =>
                          updateQuotePosition(
                            position.id,
                            "internalNote",
                            value,
                          )
                        }
                      />

                      <div className="grid gap-3 md:grid-cols-[0.65fr_0.8fr_0.55fr_0.85fr_auto] md:items-end">
                        <NumberField
                          label="Menge"
                          value={position.quantity}
                          onChange={(value) =>
                            updateQuotePosition(position.id, "quantity", value)
                          }
                          suffix="Stk."
                        />

                        <NumberField
                          label="Einzelpreis netto"
                          value={position.unitPrice}
                          onChange={(value) =>
                            updateQuotePosition(position.id, "unitPrice", value)
                          }
                          suffix="€"
                          step={0.01}
                        />

                        <NumberField
                          label="MwSt."
                          value={getPositionVatRate(position)}
                          onChange={(value) =>
                            updateQuotePosition(position.id, "vatRate", value)
                          }
                          suffix="%"
                        />

                        <ReadOnlyField
                          label="Gesamt netto"
                          value={formatCurrency(positionTotal)}
                        />

                        <div className="grid gap-2">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                moveQuotePosition(position.id, "up")
                              }
                              disabled={index === 0}
                              className={`rounded-2xl px-3 py-2 text-xs font-black transition ${
                                index === 0
                                  ? "cursor-not-allowed bg-slate-100 text-slate-400"
                                  : "bg-white text-slate-700 shadow-sm hover:-translate-y-0.5"
                              }`}
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                moveQuotePosition(position.id, "down")
                              }
                              disabled={index === quotePositions.length - 1}
                              className={`rounded-2xl px-3 py-2 text-xs font-black transition ${
                                index === quotePositions.length - 1
                                  ? "cursor-not-allowed bg-slate-100 text-slate-400"
                                  : "bg-white text-slate-700 shadow-sm hover:-translate-y-0.5"
                              }`}
                            >
                              ↓
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => duplicateQuotePosition(position.id)}
                            className="rounded-2xl bg-indigo-100 px-4 py-2 text-xs font-black text-indigo-700 transition hover:-translate-y-0.5"
                          >
                            Duplizieren
                          </button>

                          <button
                            type="button"
                            onClick={() => removeQuotePosition(position.id)}
                            disabled={quotePositions.length <= 1}
                            className={`rounded-2xl px-4 py-2 text-xs font-black transition ${
                              quotePositions.length <= 1
                                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                                : "bg-rose-100 text-rose-700 hover:-translate-y-0.5"
                            }`}
                          >
                            Entfernen
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-2 w-24 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
            <h3 className="mt-5 text-xl font-black">Dokumentenliste</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Gespeicherte Dokumente suchen, filtern, öffnen, duplizieren oder
              löschen.
            </p>

            <div className="mt-6 grid gap-3 xl:grid-cols-[1.2fr_0.9fr_0.9fr]">
              <SearchField
                label="Dokument suchen"
                value={documentSearch}
                onChange={setDocumentSearch}
                placeholder="Nummer, Kunde, Status oder Betrag suchen..."
              />

              <SelectField
                label="Dokumenttyp"
                value={documentTypeFilter}
                onChange={setDocumentTypeFilter}
                options={[
                  { value: "all", label: "Alle Dokumenttypen" },
                  ...documentTypeOrder.map((documentType) => ({
                    value: documentType,
                    label:
                      documentTemplateSettings[documentType]?.label ??
                      documentType,
                  })),
                ]}
              />

              <SelectField
                label="Status"
                value={documentStatusFilter}
                onChange={setDocumentStatusFilter}
                options={[
                  { value: "all", label: "Alle Status" },
                  ...documentStatusOptions.map((status) => ({
                    value: status,
                    label: status,
                  })),
                ]}
              />
            </div>

            <div className="mt-5 rounded-3xl bg-slate-50 p-4">
              <div className="grid gap-3 text-sm md:grid-cols-3">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                    Gespeichert
                  </p>
                  <p className="mt-1 font-black text-slate-800">
                    {savedDocuments.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                    Gefiltert
                  </p>
                  <p className="mt-1 font-black text-slate-800">
                    {filteredSavedDocuments.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                    Aktiv
                  </p>
                  <p className="mt-1 truncate font-black text-slate-800">
                    {activeSavedDocumentId ? quoteNumber : "Nicht gespeichert"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {savedDocuments.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5">
                  <p className="text-sm font-black text-slate-700">
                    Noch keine Dokumente gespeichert
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    Speichere das aktuelle Dokument, damit es hier erscheint.
                  </p>
                </div>
              ) : filteredSavedDocuments.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5">
                  <p className="text-sm font-black text-slate-700">
                    Keine Dokumente gefunden
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    Passe Suche, Dokumenttyp oder Statusfilter an.
                  </p>
                </div>
              ) : (
                filteredSavedDocuments.map((documentItem) => {
                  const documentTotals = calculateDocumentTotals(
                    documentItem.positions,
                  );
                  const documentTotal = documentTotals.netTotal;
                  const resolvedPaymentStatus =
                    getResolvedPaymentStatus(documentItem);
                  const invoiceOpenAmount = getInvoiceOpenAmount(documentItem);
                  const invoiceOverdueDays = getInvoiceOverdueDays(
                    documentItem.paymentDueDate,
                    invoiceOpenAmount,
                  );
                  const isActiveDocument =
                    activeSavedDocumentId === documentItem.id;

                  return (
                    <div
                      key={documentItem.id}
                      className={`rounded-3xl border p-4 ${
                        isActiveDocument
                          ? "border-violet-300 bg-violet-50"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-slate-950">
                            {documentItem.documentNumber} ·{" "}
                            {
                              documentTemplateSettings[
                                documentItem.documentType
                              ]?.label
                            }
                          </p>
                          <p className="mt-1 truncate text-sm font-bold text-slate-500">
                            {documentItem.customerName}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500 shadow-sm">
                              {documentItem.date}
                            </span>
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500 shadow-sm">
                              {documentItem.status}
                            </span>
                            {documentItem.documentType === "invoice" &&
                              resolvedPaymentStatus && (
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-black shadow-sm ${getPaymentStatusClasses(resolvedPaymentStatus).badge}`}
                                >
                                  Zahlung: {resolvedPaymentStatus}
                                </span>
                              )}
                            {documentItem.documentType === "invoice" &&
                              documentItem.paymentDueDate && (
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500 shadow-sm">
                                  Fällig {documentItem.paymentDueDate}
                                </span>
                              )}
                            {documentItem.documentType === "invoice" &&
                              invoiceOverdueDays > 0 && (
                                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 shadow-sm">
                                  Seit {invoiceOverdueDays} Tagen fällig
                                </span>
                              )}
                            {documentItem.documentType === "invoice" && (
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-black shadow-sm ${getOpenAmountClasses(invoiceOpenAmount)}`}
                              >
                                Offen {formatCurrency(invoiceOpenAmount)}
                              </span>
                            )}
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500 shadow-sm">
                              Netto {formatCurrency(documentTotal)}
                            </span>
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500 shadow-sm">
                              Brutto {formatCurrency(documentTotals.grossTotal)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenSavedDocument(documentItem)
                            }
                            className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white"
                          >
                            Öffnen
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDuplicateSavedDocument(documentItem)
                            }
                            className="rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm"
                          >
                            Duplizieren
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteSavedDocument(documentItem.id)
                            }
                            className="rounded-xl bg-rose-100 px-3 py-2 text-xs font-black text-rose-700"
                          >
                            Löschen
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-2 w-24 rounded-full bg-gradient-to-r from-emerald-400 to-green-600" />
            <h3 className="mt-5 text-xl font-black">
              {isDeliveryNote ? "Lieferschein" : "Summen"}
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {isDeliveryNote
                ? "Der Lieferschein zeigt Mengen und Leistungen ohne Preisangaben."
                : "Dokumentwert mit MwSt.-Ausweisung je Steuersatz."}
            </p>

            {isDeliveryNote ? (
              <div className="mt-6 rounded-3xl bg-violet-50 p-5 text-violet-700">
                <p className="text-xs font-extrabold uppercase tracking-wide">
                  Preisfreie Ansicht
                </p>
                <p className="mt-2 text-sm font-bold leading-6">
                  Einzelpreise, Gesamtpreise, MwSt. und Summen werden im
                  Lieferschein ausgeblendet.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                <CostRow label="Netto" value={formatCurrency(netTotal)} />
                {vatTotals.length > 0 ? (
                  vatTotals.map((taxLine) => (
                    <CostRow
                      key={taxLine.rate}
                      label={`MwSt. ${formatNumber(taxLine.rate, 0)} %`}
                      value={formatCurrency(taxLine.amount)}
                    />
                  ))
                ) : (
                  <CostRow label="MwSt." value={formatCurrency(0)} />
                )}
                <CostRow
                  label="Brutto"
                  value={formatCurrency(grossTotal)}
                  highlight
                />
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                  Dokumentvorschau
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-tight">
                  {quoteNumber}
                </h3>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handlePrintDocument("print")}
                  className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5"
                >
                  Drucken
                </button>

                <button
                  type="button"
                  onClick={() => handlePrintDocument("pdf")}
                  className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-600"
                >
                  Als PDF speichern
                </button>
              </div>
            </div>

            <div
              className="print-area mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
              style={{
                paddingTop: `${activeBusinessDocumentTemplate.topMm}mm`,
                paddingBottom: `${activeBusinessDocumentTemplate.bottomMm}mm`,
                paddingLeft: `${activeBusinessDocumentTemplate.leftMm}mm`,
                paddingRight: `${activeBusinessDocumentTemplate.rightMm}mm`,
              }}
            >
              <div className="border-b border-slate-200 pb-5">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    {company.logoDataUrl ? (
                      <img
                        src={company.logoDataUrl}
                        alt={company.name || "Firmenlogo"}
                        className="max-h-20 max-w-64 object-contain"
                      />
                    ) : (
                      <p className="text-2xl font-black tracking-tight text-slate-950">
                        {company.name || "Firmenname"}
                      </p>
                    )}
                    <p
                      className={`${company.logoDataUrl ? "mt-4" : "mt-1"} text-sm font-bold text-slate-600`}
                    >
                      {company.claim || "Claim / Beschreibung"}
                    </p>
                    {companyAddressLine && (
                      <p className="mt-3 text-xs font-bold text-slate-500">
                        {companyAddressLine}
                      </p>
                    )}
                    {companyContactLine && (
                      <p className="mt-1 text-xs font-bold text-slate-500">
                        {companyContactLine}
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl bg-slate-950 px-5 py-4 text-left text-white md:text-right">
                    <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                      {activeBusinessDocumentLabel}
                    </p>
                    <p className="mt-1 text-xl font-black">{quoteNumber}</p>
                    <p className="mt-2 text-xs font-bold text-slate-300">
                      Datum: {quoteDate}
                    </p>
                    <p className="mt-1 text-xs font-bold text-slate-300">
                      {activeBusinessDocumentType === "invoice"
                        ? "Fällig bis"
                        : activeBusinessDocumentType === "deliveryNote"
                          ? "Lieferdatum"
                          : "Gültig bis"}
                      : {validUntil}
                    </p>
                    {isInvoice && (
                      <p
                        className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-black ${currentPaymentStatusClasses.badge}`}
                      >
                        Zahlung: {currentResolvedPaymentStatus} · Offen{" "}
                        {formatCurrency(openPaymentAmount)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {companySenderLine && (
                <p className="mt-8 border-b border-slate-200 pb-1 text-[10px] font-bold text-slate-400">
                  {companySenderLine}
                </p>
              )}

              <div className="mt-4 grid gap-8 md:grid-cols-[1fr_0.9fr]">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                    Empfänger
                  </p>
                  <div className="mt-3 space-y-1 text-sm font-bold leading-6 text-slate-800">
                    {customerAddressLines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                    Kundendaten
                  </p>
                  <div className="mt-3 space-y-2">
                    {customerMetaRows.length > 0 ? (
                      customerMetaRows.map((row) => (
                        <div
                          key={row.label}
                          className="flex justify-between gap-4 text-xs font-bold"
                        >
                          <span className="text-slate-400">{row.label}</span>
                          <span className="text-right text-slate-700">
                            {row.value}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs font-bold text-slate-500">
                        Freitext-Kunde ohne Stammdaten
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                  Betreff
                </p>
                <h4 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  {activeBusinessDocumentLabel} {quoteNumber}
                </h4>
                <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
                  {introText}
                </p>
              </div>

              <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div
                  className={`grid gap-3 bg-slate-950 px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-white ${
                    isDeliveryNote
                      ? "grid-cols-[1fr_0.3fr]"
                      : "grid-cols-[1fr_0.24fr_0.32fr_0.24fr_0.38fr]"
                  }`}
                >
                  <span>Leistung</span>
                  <span className="text-right">Menge</span>
                  {!isDeliveryNote && (
                    <span className="text-right">Einzel</span>
                  )}
                  {!isDeliveryNote && <span className="text-right">MwSt.</span>}
                  {!isDeliveryNote && (
                    <span className="text-right">Gesamt</span>
                  )}
                </div>

                {quotePositions.map((position, index) => {
                  const positionTotal = position.quantity * position.unitPrice;

                  return (
                    <div
                      key={position.id}
                      className={`grid gap-3 border-t border-slate-100 px-4 py-4 text-sm ${
                        isDeliveryNote
                          ? "grid-cols-[1fr_0.3fr]"
                          : "grid-cols-[1fr_0.24fr_0.32fr_0.24fr_0.38fr]"
                      }`}
                    >
                      <div>
                        <p className="font-black text-slate-950">
                          {index + 1}. {position.title}
                        </p>
                        <p className="mt-1 whitespace-pre-line text-xs font-medium leading-5 text-slate-500">
                          {position.description}
                        </p>
                      </div>
                      <p className="text-right font-bold text-slate-600">
                        {position.quantity.toLocaleString("de-DE")}
                      </p>
                      {!isDeliveryNote && (
                        <p className="text-right font-bold text-slate-600">
                          {formatCurrency(position.unitPrice)}
                        </p>
                      )}
                      {!isDeliveryNote && (
                        <p className="text-right font-bold text-slate-600">
                          {formatNumber(getPositionVatRate(position), 0)} %
                        </p>
                      )}
                      {!isDeliveryNote && (
                        <p className="text-right font-black text-slate-950">
                          {formatCurrency(positionTotal)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {!isDeliveryNote && (
                <div className="mt-8 flex justify-end">
                  <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm font-bold text-slate-600">
                      <span>Netto</span>
                      <span>{formatCurrency(netTotal)}</span>
                    </div>
                    {vatTotals.length > 0 ? (
                      vatTotals.map((taxLine) => (
                        <div
                          key={taxLine.rate}
                          className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm font-bold text-slate-600"
                        >
                          <span>MwSt. {formatNumber(taxLine.rate, 0)} %</span>
                          <span>{formatCurrency(taxLine.amount)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm font-bold text-slate-600">
                        <span>MwSt.</span>
                        <span>{formatCurrency(0)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between bg-slate-950 px-4 py-4 text-sm font-black text-white">
                      <span>Brutto</span>
                      <span>{formatCurrency(grossTotal)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 space-y-3 border-t border-slate-200 pt-5 text-sm font-medium leading-7 text-slate-600">
                <p>{deliveryTerms}</p>
                {!isDeliveryNote && <p>{paymentTerms}</p>}
                {isDeliveryNote && (
                  <p className="font-bold text-slate-700">
                    Ware ordnungsgemäß erhalten: ______________________________
                  </p>
                )}
              </div>

              <div className="mt-8 grid gap-3 border-t border-slate-200 pt-5 text-xs font-bold leading-5 text-slate-500 md:grid-cols-2">
                <p>
                  {[company.name, companyAddressLine]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <p className="md:text-right">
                  {[
                    company.taxNumber ? `St.-Nr. ${company.taxNumber}` : "",
                    company.vatId ? `USt-ID ${company.vatId}` : "",
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <p>
                  {[company.bankName, company.iban, company.bic]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <p className="md:text-right">
                  {isDeliveryNote
                    ? "Vielen Dank für Ihren Auftrag."
                    : "Vielen Dank für Ihre Anfrage."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CustomersPage({
  customers,
  setCustomers,
}: {
  customers: Customer[];
  setCustomers: Dispatch<SetStateAction<Customer[]>>;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(
    null,
  );
  const [customerForm, setCustomerForm] = useState<Omit<Customer, "id">>({
    customerNumber: createNextCustomerNumber(customers),
    company: "",
    contactPerson: "",
    street: "",
    zip: "",
    city: "",
    email: "",
    phone: "",
    status: "Aktiv",
    notes: "",
  });

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        customer.customerNumber.toLowerCase().includes(normalizedSearch) ||
        customer.company.toLowerCase().includes(normalizedSearch) ||
        customer.contactPerson.toLowerCase().includes(normalizedSearch) ||
        customer.city.toLowerCase().includes(normalizedSearch) ||
        customer.email.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const activeCustomers = customers.filter(
    (customer) => customer.status === "Aktiv",
  ).length;
  const prospects = customers.filter(
    (customer) => customer.status === "Interessent",
  ).length;
  const inactiveCustomers = customers.filter(
    (customer) => customer.status === "Inaktiv",
  ).length;
  const customerCities = Array.from(
    new Set(customers.map((customer) => customer.city).filter(Boolean)),
  ).length;

  function createEmptyCustomerForm(): Omit<Customer, "id"> {
    return {
      customerNumber: createNextCustomerNumber(customers),
      company: "",
      contactPerson: "",
      street: "",
      zip: "",
      city: "",
      email: "",
      phone: "",
      status: "Aktiv",
      notes: "",
    };
  }

  function openNewCustomerForm() {
    setEditingCustomerId(null);
    setCustomerForm(createEmptyCustomerForm());
    setIsEditorOpen(true);
  }

  function openEditCustomerForm(customer: Customer) {
    setEditingCustomerId(customer.id);
    setCustomerForm({
      customerNumber: customer.customerNumber,
      company: customer.company,
      contactPerson: customer.contactPerson,
      street: customer.street,
      zip: customer.zip,
      city: customer.city,
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
      notes: customer.notes,
    });
    setIsEditorOpen(true);
  }

  function updateCustomerForm(
    field: keyof Omit<Customer, "id">,
    value: string,
  ) {
    setCustomerForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function saveCustomer() {
    const normalizedCompany = customerForm.company.trim();

    if (!normalizedCompany) {
      return;
    }

    const normalizedCustomer: Omit<Customer, "id"> = {
      ...customerForm,
      customerNumber:
        customerForm.customerNumber.trim() ||
        createNextCustomerNumber(customers),
      company: normalizedCompany,
      contactPerson: customerForm.contactPerson.trim(),
      street: customerForm.street.trim(),
      zip: customerForm.zip.trim(),
      city: customerForm.city.trim(),
      email: customerForm.email.trim(),
      phone: customerForm.phone.trim(),
      notes: customerForm.notes.trim(),
    };

    if (editingCustomerId) {
      setCustomers((current) =>
        current.map((customer) =>
          customer.id === editingCustomerId
            ? { ...customer, ...normalizedCustomer }
            : customer,
        ),
      );
    } else {
      setCustomers((current) => [
        ...current,
        {
          id: createLocalId(),
          ...normalizedCustomer,
        },
      ]);
    }

    setIsEditorOpen(false);
    setEditingCustomerId(null);
  }

  function deleteCustomer(customerId: string) {
    setCustomers((current) =>
      current.length <= 1
        ? current
        : current.filter((customer) => customer.id !== customerId),
    );
  }

  function resetCustomers() {
    setCustomers(sampleCustomers);
    setSearch("");
    setStatusFilter("all");
    setIsEditorOpen(false);
    setEditingCustomerId(null);
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-slate-950/20">
        <div className="relative p-7 lg:p-9">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute bottom-0 right-40 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-emerald-300">
                Kundenverwaltung V2
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">
                Kundenstamm
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Kunden anlegen, bearbeiten, suchen und dauerhaft im Browser
                speichern.
              </p>
            </div>

            <button
              type="button"
              onClick={openNewCustomerForm}
              className="rounded-3xl bg-white px-6 py-4 text-sm font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5"
            >
              + Kunde anlegen
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Kunden"
          value={`${customers.length}`}
          hint="im Kundenstamm"
          gradient="from-emerald-400 to-green-600"
        />
        <MetricCard
          label="Aktiv"
          value={`${activeCustomers}`}
          hint="aktive Kunden"
          gradient="from-cyan-400 to-sky-500"
        />
        <MetricCard
          label="Interessenten"
          value={`${prospects}`}
          hint="offene Kontakte"
          gradient="from-yellow-300 to-orange-400"
        />
        <MetricCard
          label="Orte"
          value={`${customerCities}`}
          hint={`${inactiveCustomers} inaktiv`}
          gradient="from-fuchsia-500 to-purple-600"
        />
      </section>

      {isEditorOpen && (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="h-2 w-24 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500" />
              <h3 className="mt-5 text-xl font-black">
                {editingCustomerId ? "Kunde bearbeiten" : "Kunde anlegen"}
              </h3>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Diese Daten werden automatisch im Browser gespeichert.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsEditorOpen(false)}
              className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-600 transition hover:-translate-y-0.5"
            >
              Schließen
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <InputField
              label="Kundennummer"
              value={customerForm.customerNumber}
              onChange={(value) => updateCustomerForm("customerNumber", value)}
            />
            <SelectField
              label="Status"
              value={customerForm.status}
              onChange={(value) =>
                updateCustomerForm("status", value as Customer["status"])
              }
              options={[
                { value: "Aktiv", label: "Aktiv" },
                { value: "Interessent", label: "Interessent" },
                { value: "Inaktiv", label: "Inaktiv" },
              ]}
            />
            <InputField
              label="Firma / Name"
              value={customerForm.company}
              onChange={(value) => updateCustomerForm("company", value)}
            />
            <InputField
              label="Ansprechpartner"
              value={customerForm.contactPerson}
              onChange={(value) => updateCustomerForm("contactPerson", value)}
            />
            <InputField
              label="Straße"
              value={customerForm.street}
              onChange={(value) => updateCustomerForm("street", value)}
            />
            <InputField
              label="PLZ"
              value={customerForm.zip}
              onChange={(value) => updateCustomerForm("zip", value)}
            />
            <InputField
              label="Ort"
              value={customerForm.city}
              onChange={(value) => updateCustomerForm("city", value)}
            />
            <InputField
              label="E-Mail"
              value={customerForm.email}
              onChange={(value) => updateCustomerForm("email", value)}
            />
            <InputField
              label="Telefon"
              value={customerForm.phone}
              onChange={(value) => updateCustomerForm("phone", value)}
            />
          </div>

          <div className="mt-4">
            <TextAreaField
              label="Notizen"
              value={customerForm.notes}
              onChange={(value) => updateCustomerForm("notes", value)}
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-bold text-slate-500">
              Pflichtfeld: Firma / Name. Alle anderen Felder können leer
              bleiben.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-600 transition hover:-translate-y-0.5"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={saveCustomer}
                disabled={!customerForm.company.trim()}
                className={`rounded-2xl px-5 py-3 text-sm font-black text-white transition ${customerForm.company.trim() ? "bg-slate-950 hover:-translate-y-0.5" : "cursor-not-allowed bg-slate-300"}`}
              >
                Kunde speichern
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr_auto] xl:items-end">
          <SearchField
            label="Suche"
            value={search}
            onChange={setSearch}
            placeholder="Kunde, Ansprechpartner, Ort, E-Mail oder Kundennummer suchen..."
          />
          <SelectField
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "all", label: "Alle Status" },
              { value: "Aktiv", label: "Aktiv" },
              { value: "Interessent", label: "Interessent" },
              { value: "Inaktiv", label: "Inaktiv" },
            ]}
          />
          <button
            type="button"
            onClick={resetCustomers}
            className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-600 transition hover:-translate-y-0.5"
          >
            Musterkunden laden
          </button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {filteredCustomers.map((customer) => {
          const statusClass =
            customer.status === "Aktiv"
              ? "bg-emerald-100 text-emerald-700"
              : customer.status === "Interessent"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-slate-100 text-slate-500";

          return (
            <article
              key={customer.id}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
            >
              <div
                className={`h-2 bg-gradient-to-r ${customer.status === "Aktiv" ? "from-emerald-400 via-cyan-400 to-sky-500" : customer.status === "Interessent" ? "from-yellow-300 via-orange-400 to-rose-500" : "from-slate-300 to-slate-500"}`}
              />
              <div className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                        {customer.customerNumber}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${statusClass}`}
                      >
                        {customer.status}
                      </span>
                    </div>
                    <h3 className="mt-4 text-2xl font-black tracking-tight">
                      {customer.company}
                    </h3>
                    <p className="mt-2 text-sm font-bold text-slate-500">
                      Ansprechpartner: {customer.contactPerson || "—"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => openEditCustomerForm(customer)}
                      className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
                    >
                      Bearbeiten
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCustomer(customer.id)}
                      disabled={customers.length <= 1}
                      className={`rounded-2xl px-4 py-3 text-sm font-black transition ${customers.length <= 1 ? "cursor-not-allowed bg-slate-100 text-slate-400" : "bg-rose-100 text-rose-700 hover:-translate-y-0.5"}`}
                    >
                      Löschen
                    </button>
                  </div>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <InfoCard
                    label="Adresse"
                    value={
                      [
                        customer.street,
                        [customer.zip, customer.city].filter(Boolean).join(" "),
                      ]
                        .filter(Boolean)
                        .join(", ") || "—"
                    }
                  />
                  <InfoCard label="E-Mail" value={customer.email || "—"} />
                  <InfoCard label="Telefon" value={customer.phone || "—"} />
                  <InfoCard
                    label="Kundennummer"
                    value={customer.customerNumber}
                  />
                </div>
                <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                    Notiz
                  </p>
                  <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                    {customer.notes || "Keine Notiz hinterlegt."}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {filteredCustomers.length === 0 && (
        <EmptyState title="Keine Kunden gefunden" />
      )}
    </div>
  );
}

function CalculationTemplatesPage({
  calculationTemplates,
  setCalculationTemplates,
  productTypes,
  setProductTypes,
  materials,
  machines,
  finishingOperations,
}: {
  calculationTemplates: CalculationTemplate[];
  setCalculationTemplates: Dispatch<SetStateAction<CalculationTemplate[]>>;
  productTypes: ProductType[];
  setProductTypes: Dispatch<SetStateAction<ProductType[]>>;
  materials: Material[];
  machines: Machine[];
  finishingOperations: FinishingOperation[];
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(
    null,
  );
  const [templateForm, setTemplateForm] = useState<CalculationTemplate>(() =>
    createEmptyCalculationTemplate(
      materials,
      machines,
      finishingOperations,
      calculationTemplates.length + 1,
      productTypes,
    ),
  );

  const filteredTemplates = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return calculationTemplates.filter((template) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        template.name.toLowerCase().includes(normalizedSearch) ||
        template.productName.toLowerCase().includes(normalizedSearch) ||
        template.productType.toLowerCase().includes(normalizedSearch);

      const matchesType =
        typeFilter === "all" || template.productType === typeFilter;
      const matchesStatus =
        statusFilter === "all" || template.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [calculationTemplates, search, statusFilter, typeFilter]);

  const activeTemplates = calculationTemplates.filter(
    (template) => template.status === "Aktiv",
  ).length;
  const templatesWithMultipleMaterials = calculationTemplates.filter(
    (template) => template.materialSelections.length > 1,
  ).length;
  const templatesWithFinishing = calculationTemplates.filter(
    (template) => template.finishingNames.length > 0,
  ).length;
  const [newProductTypeName, setNewProductTypeName] = useState("");

  function addProductType() {
    const nextName = newProductTypeName.trim();

    if (!nextName) return;

    const alreadyExists = productTypes.some(
      (type) => type.toLowerCase() === nextName.toLowerCase(),
    );

    if (alreadyExists) {
      setNewProductTypeName("");
      return;
    }

    setProductTypes((current) => [...current, nextName]);
    setNewProductTypeName("");
  }

  function updateProductType(index: number, value: string) {
    const nextName = value.trimStart();
    const oldName = productTypes[index];

    if (!oldName || !nextName.trim()) return;

    setProductTypes((current) =>
      current.map((type, typeIndex) => (typeIndex === index ? nextName : type)),
    );
    setCalculationTemplates((current) =>
      current.map((template) =>
        template.productType === oldName
          ? { ...template, productType: nextName }
          : template,
      ),
    );
  }

  function deleteProductType(index: number) {
    if (productTypes.length <= 1) return;

    const typeToDelete = productTypes[index];
    const fallbackType =
      productTypes.find((_, typeIndex) => typeIndex !== index) ?? "Flyer";

    setProductTypes((current) =>
      current.filter((_, typeIndex) => typeIndex !== index),
    );
    setCalculationTemplates((current) =>
      current.map((template) =>
        template.productType === typeToDelete
          ? { ...template, productType: fallbackType }
          : template,
      ),
    );
  }

  function resetProductTypes() {
    setProductTypes([...DEFAULT_PRODUCT_TYPES]);
    setCalculationTemplates((current) =>
      current.map((template) =>
        DEFAULT_PRODUCT_TYPES.includes(template.productType)
          ? template
          : { ...template, productType: DEFAULT_PRODUCT_TYPES[0] ?? "Flyer" },
      ),
    );
  }

  function openNewTemplateForm() {
    setEditingTemplateId(null);
    setTemplateForm(
      createEmptyCalculationTemplate(
        materials,
        machines,
        finishingOperations,
        calculationTemplates.length + 1,
        productTypes,
      ),
    );
    setIsEditorOpen(true);
  }

  function openEditTemplateForm(template: CalculationTemplate) {
    setEditingTemplateId(template.id);
    setTemplateForm(
      JSON.parse(JSON.stringify(template)) as CalculationTemplate,
    );
    setIsEditorOpen(true);
  }

  function updateTemplateForm(
    field: keyof CalculationTemplate,
    value: string | number | boolean,
  ) {
    setTemplateForm((current) => ({ ...current, [field]: value }));
  }

  function updateMaterialTemplate(
    index: number,
    field: keyof Omit<MaterialSelection, "id">,
    value: string | number,
  ) {
    setTemplateForm((current) => ({
      ...current,
      materialSelections: current.materialSelections.map(
        (selection, selectionIndex) =>
          selectionIndex === index
            ? { ...selection, [field]: value }
            : selection,
      ),
    }));
  }

  function addTemplateMaterial() {
    setTemplateForm((current) => ({
      ...current,
      materialSelections: [
        ...current.materialSelections,
        {
          label: `Material ${current.materialSelections.length + 1}`,
          materialId: materials[0]?.id ?? "",
          calculationMode: "perCopy",
          manualSheets: 100,
          factorPerCopy: 1,
          pages: 2,
          pagesPerSheet: 2,
          itemsPerSheet: 1,
        },
      ],
    }));
  }

  function removeTemplateMaterial(index: number) {
    setTemplateForm((current) => ({
      ...current,
      materialSelections:
        current.materialSelections.length <= 1
          ? current.materialSelections
          : current.materialSelections.filter(
              (_, selectionIndex) => selectionIndex !== index,
            ),
    }));
  }

  function updateTemplateFinishing(index: number, operationName: string) {
    setTemplateForm((current) => ({
      ...current,
      finishingNames: current.finishingNames.map((name, nameIndex) =>
        nameIndex === index ? operationName : name,
      ),
    }));
  }

  function addTemplateFinishing() {
    setTemplateForm((current) => ({
      ...current,
      finishingNames: [
        ...current.finishingNames,
        finishingOperations[0]?.name ?? "Schneiden",
      ],
    }));
  }

  function removeTemplateFinishing(index: number) {
    setTemplateForm((current) => ({
      ...current,
      finishingNames: current.finishingNames.filter(
        (_, nameIndex) => nameIndex !== index,
      ),
    }));
  }

  function saveTemplate() {
    const normalizedTemplate = normalizeCalculationTemplate(
      {
        ...templateForm,
        id: (editingTemplateId ?? templateForm.id) || createLocalId(),
        name:
          templateForm.name.trim() ||
          templateForm.productName.trim() ||
          "Kalkulationsvorlage",
        productName:
          templateForm.productName.trim() ||
          templateForm.name.trim() ||
          "Druckprodukt",
      },
      materials,
      machines,
      finishingOperations,
      productTypes,
    );

    setCalculationTemplates((current) => {
      const exists = current.some(
        (template) => template.id === normalizedTemplate.id,
      );

      if (exists) {
        return current.map((template) =>
          template.id === normalizedTemplate.id ? normalizedTemplate : template,
        );
      }

      return [...current, normalizedTemplate];
    });

    setIsEditorOpen(false);
    setEditingTemplateId(null);
  }

  function deleteTemplate(templateId: string) {
    setCalculationTemplates((current) =>
      current.length <= 1
        ? current
        : current.filter((template) => template.id !== templateId),
    );
  }

  function duplicateTemplate(template: CalculationTemplate) {
    setCalculationTemplates((current) => [
      ...current,
      {
        ...JSON.parse(JSON.stringify(template)),
        id: createLocalId(),
        name: `${template.name} Kopie`,
      },
    ]);
  }

  function resetTemplates() {
    setCalculationTemplates(
      createDefaultCalculationTemplates(
        materials,
        machines,
        finishingOperations,
        productTypes,
      ),
    );
    setIsEditorOpen(false);
    setEditingTemplateId(null);
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-slate-950/20">
        <div className="relative p-7 lg:p-9">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-pink-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-40 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-pink-300">
                Kalkulationsvorlagen V2
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">
                Produktvorlagen verwalten
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Lege wiederkehrende Druckprodukte inklusive Beschnitt,
                Zwischenschnitt, Laufrichtung und Standard-Rohbogen als Vorlage an.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={resetTemplates}
                className="rounded-3xl bg-white/10 px-6 py-4 text-sm font-black text-white transition hover:-translate-y-0.5"
              >
                Standards laden
              </button>
              <button
                type="button"
                onClick={openNewTemplateForm}
                className="rounded-3xl bg-white px-6 py-4 text-sm font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5"
              >
                + Vorlage anlegen
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Vorlagen"
          value={`${calculationTemplates.length}`}
          hint="gespeicherte Kalkulationsvorlagen"
          gradient="from-pink-500 to-fuchsia-500"
        />
        <MetricCard
          label="Aktiv"
          value={`${activeTemplates}`}
          hint="in Kalkulation auswählbar"
          gradient="from-emerald-400 to-green-600"
        />
        <MetricCard
          label="Mehrere Materialien"
          value={`${templatesWithMultipleMaterials}`}
          hint="z. B. Broschüren / SD-Sätze"
          gradient="from-cyan-400 to-sky-500"
        />
        <MetricCard
          label="Mit WV"
          value={`${templatesWithFinishing}`}
          hint="mit Weiterverarbeitung"
          gradient="from-yellow-300 to-orange-400"
        />
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="h-2 w-24 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500" />
            <h3 className="mt-5 text-xl font-black">Produkttypen</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Diese Typen stehen in Kalkulationsvorlagen und in der Kalkulation
              zur Auswahl.
            </p>
          </div>

          <button
            type="button"
            onClick={resetProductTypes}
            className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-600 transition hover:-translate-y-0.5"
          >
            Standardtypen laden
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <InputField
            label="Neuer Produkttyp"
            value={newProductTypeName}
            onChange={setNewProductTypeName}
          />
          <button
            type="button"
            onClick={addProductType}
            className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5"
          >
            + Produkttyp hinzufügen
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {productTypes.map((type, index) => (
            <div
              key={`${type}-${index}`}
              className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_auto] md:items-end"
            >
              <InputField
                label={`Produkttyp ${index + 1}`}
                value={type}
                onChange={(value) => updateProductType(index, value)}
              />
              <button
                type="button"
                onClick={() => deleteProductType(index)}
                disabled={productTypes.length <= 1}
                className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                  productTypes.length <= 1
                    ? "cursor-not-allowed bg-slate-100 text-slate-400"
                    : "bg-rose-100 text-rose-700 hover:-translate-y-0.5"
                }`}
              >
                Löschen
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr_0.8fr]">
          <SearchField
            label="Suche"
            value={search}
            onChange={setSearch}
            placeholder="Vorlage, Produkt oder Produkttyp suchen..."
          />
          <SelectField
            label="Produkttyp"
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: "all", label: "Alle Produkttypen" },
              ...productTypes.map((type) => ({ value: type, label: type })),
            ]}
          />
          <SelectField
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "all", label: "Alle Status" },
              { value: "Aktiv", label: "Aktiv" },
              { value: "Inaktiv", label: "Inaktiv" },
            ]}
          />
        </div>
      </section>

      {isEditorOpen && (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="h-2 w-24 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500" />
              <h3 className="mt-5 text-xl font-black">
                {editingTemplateId ? "Vorlage bearbeiten" : "Vorlage anlegen"}
              </h3>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Diese Werte werden beim Anwenden in die Kalkulation übernommen.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsEditorOpen(false)}
              className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-600"
            >
              Schließen
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InputField
              label="Vorlagenname"
              value={templateForm.name}
              onChange={(value) => updateTemplateForm("name", value)}
            />
            <SelectField
              label="Produkttyp"
              value={templateForm.productType}
              onChange={(value) =>
                updateTemplateForm("productType", value as ProductType)
              }
              options={productTypes.map((type) => ({
                value: type,
                label: type,
              }))}
            />
            <SelectField
              label="Status"
              value={templateForm.status}
              onChange={(value) =>
                updateTemplateForm("status", value as CalculationTemplateStatus)
              }
              options={[
                { value: "Aktiv", label: "Aktiv" },
                { value: "Inaktiv", label: "Inaktiv" },
              ]}
            />
            <NumberField
              label="Standardauflage"
              value={templateForm.defaultQuantity}
              onChange={(value) => updateTemplateForm("defaultQuantity", value)}
              suffix="Stk."
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InputField
              label="Produktname"
              value={templateForm.productName}
              onChange={(value) => updateTemplateForm("productName", value)}
            />
            <SelectField
              label="Standardmaschine"
              value={templateForm.machineId}
              onChange={(value) => updateTemplateForm("machineId", value)}
              options={machines.map((machine) => ({
                value: machine.id,
                label: machine.name,
              }))}
            />
            <SelectField
              label="Farbmodus"
              value={templateForm.colorMode}
              onChange={(value) => updateTemplateForm("colorMode", value)}
              options={[
                { value: "1/0 schwarz", label: "1/0 schwarz" },
                { value: "1/1 schwarz", label: "1/1 schwarz" },
                { value: "4/0 farbig", label: "4/0 farbig" },
                { value: "4/4 farbig", label: "4/4 farbig" },
              ]}
            />
            <NumberField
              label="Nutzen / Bogen"
              value={templateForm.itemsPerSheet}
              onChange={(value) => updateTemplateForm("itemsPerSheet", value)}
              suffix="Nutzen"
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <NumberField
              label="Endformat Breite"
              value={templateForm.finalWidthMm}
              onChange={(value) => updateTemplateForm("finalWidthMm", value)}
              suffix="mm"
            />
            <NumberField
              label="Endformat Höhe"
              value={templateForm.finalHeightMm}
              onChange={(value) => updateTemplateForm("finalHeightMm", value)}
              suffix="mm"
            />
          </div>

          <div className="mt-6 rounded-3xl bg-slate-50 p-5">
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
              Produktparameter / Nutzenbasis
            </p>
            <p className="mt-1 text-sm font-bold text-slate-500">
              Diese Werte werden später vom Nutzenrechner verwendet: Beschnitt,
              Zwischenschnitt, Drehung und Laufrichtung.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <NumberField
                label="Beschnitt"
                value={templateForm.bleedMm}
                onChange={(value) => updateTemplateForm("bleedMm", value)}
                step={1}
                suffix="mm"
              />
              <SelectField
                label="Bundbeschnitt"
                value={templateForm.removeSpineBleed ? "no" : "yes"}
                onChange={(value) =>
                  updateTemplateForm("removeSpineBleed", value === "no")
                }
                options={[
                  { value: "yes", label: "Beschnitt rundum" },
                  { value: "no", label: "ohne Beschnitt im Bund" },
                ]}
              />
              <SelectField
                label="Broschürenmodus"
                value={templateForm.calculateAsOpenSpread ? "spread" : "closed"}
                onChange={(value) =>
                  updateTemplateForm("calculateAsOpenSpread", value === "spread")
                }
                options={[
                  { value: "spread", label: "offene Doppelseite" },
                  { value: "closed", label: "geschlossenes Format" },
                ]}
              />
              <NumberField
                label="Zwischenschnitt H"
                value={templateForm.gutterHorizontalMm}
                onChange={(value) =>
                  updateTemplateForm("gutterHorizontalMm", value)
                }
                step={1}
                suffix="mm"
              />
              <NumberField
                label="Zwischenschnitt V"
                value={templateForm.gutterVerticalMm}
                onChange={(value) =>
                  updateTemplateForm("gutterVerticalMm", value)
                }
                step={1}
                suffix="mm"
              />
              <SelectField
                label="Drehung"
                value={templateForm.allowRotation ? "yes" : "no"}
                onChange={(value) =>
                  updateTemplateForm("allowRotation", value === "yes")
                }
                options={[
                  { value: "yes", label: "Drehung erlaubt" },
                  { value: "no", label: "Keine Drehung" },
                ]}
              />
              <SelectField
                label="Laufrichtung"
                value={templateForm.respectGrainDirection ? "yes" : "no"}
                onChange={(value) =>
                  updateTemplateForm("respectGrainDirection", value === "yes")
                }
                options={[
                  { value: "yes", label: "beachten" },
                  { value: "no", label: "ignorieren" },
                ]}
              />
              <SelectField
                label="Standard-Rohbogen"
                value={templateForm.rawSheetMaterialId}
                onChange={(value) =>
                  updateTemplateForm("rawSheetMaterialId", value)
                }
                options={materials.map((material) => ({
                  value: material.id,
                  label: `${material.name} · ${material.widthMm} × ${material.heightMm} mm`,
                }))}
              />
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-slate-50 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                  Materialpositionen
                </p>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  Mehrere Materialien für Broschüren, Blocks oder SD-Sätze
                  möglich.
                </p>
              </div>
              <button
                type="button"
                onClick={addTemplateMaterial}
                className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white"
              >
                + Material
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {templateForm.materialSelections.map((selection, index) => (
                <div
                  key={`${selection.label}-${index}`}
                  className="rounded-3xl border border-slate-200 bg-white p-4"
                >
                  <div className="grid gap-3 md:grid-cols-[1fr_1fr_0.7fr_auto] md:items-end">
                    <InputField
                      label={`Position ${index + 1}`}
                      value={selection.label}
                      onChange={(value) =>
                        updateMaterialTemplate(index, "label", value)
                      }
                    />
                    <SelectField
                      label="Material"
                      value={selection.materialId}
                      onChange={(value) =>
                        updateMaterialTemplate(index, "materialId", value)
                      }
                      options={materials.map((material) => ({
                        value: material.id,
                        label: `${material.name} · ${material.widthMm} × ${material.heightMm} mm`,
                      }))}
                    />
                    <SelectField
                      label="Berechnung"
                      value={selection.calculationMode}
                      onChange={(value) =>
                        updateMaterialTemplate(
                          index,
                          "calculationMode",
                          value as MaterialCalculationMode,
                        )
                      }
                      options={[
                        { value: "manual", label: "Manuell" },
                        { value: "perCopy", label: "Pro Exemplar" },
                        { value: "pages", label: "Seiten" },
                      ]}
                    />
                    <button
                      type="button"
                      onClick={() => removeTemplateMaterial(index)}
                      disabled={templateForm.materialSelections.length <= 1}
                      className={`rounded-2xl px-4 py-3 text-sm font-black ${
                        templateForm.materialSelections.length <= 1
                          ? "cursor-not-allowed bg-slate-100 text-slate-400"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      Entfernen
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-5 md:items-end">
                    <NumberField
                      label="Bogen manuell"
                      value={selection.manualSheets}
                      onChange={(value) =>
                        updateMaterialTemplate(index, "manualSheets", value)
                      }
                      suffix="Bg."
                    />
                    <NumberField
                      label="Faktor"
                      value={selection.factorPerCopy}
                      onChange={(value) =>
                        updateMaterialTemplate(index, "factorPerCopy", value)
                      }
                      step={0.1}
                      suffix="x"
                    />
                    <NumberField
                      label="Seiten"
                      value={selection.pages}
                      onChange={(value) =>
                        updateMaterialTemplate(index, "pages", value)
                      }
                      suffix="S."
                    />
                    <NumberField
                      label="Seiten je Bogen"
                      value={selection.pagesPerSheet}
                      onChange={(value) =>
                        updateMaterialTemplate(index, "pagesPerSheet", value)
                      }
                      suffix="S./Bg."
                    />
                    <NumberField
                      label="Nutzen"
                      value={selection.itemsPerSheet}
                      onChange={(value) =>
                        updateMaterialTemplate(index, "itemsPerSheet", value)
                      }
                      suffix="Nutzen"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-slate-50 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                  Weiterverarbeitung
                </p>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  Standard-Schritte für diese Vorlage.
                </p>
              </div>
              <button
                type="button"
                onClick={addTemplateFinishing}
                className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white"
              >
                + Schritt
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {templateForm.finishingNames.map((name, index) => (
                <div
                  key={`${name}-${index}`}
                  className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_auto] md:items-end"
                >
                  <SelectField
                    label={`Schritt ${index + 1}`}
                    value={
                      findFinishingIdInCatalog(finishingOperations, name) ??
                      finishingOperations[0]?.id ??
                      ""
                    }
                    onChange={(value) => {
                      const operation = finishingOperations.find(
                        (item) => item.id === value,
                      );
                      updateTemplateFinishing(index, operation?.name ?? name);
                    }}
                    options={finishingOperations.map((operation) => ({
                      value: operation.id,
                      label: operation.name,
                    }))}
                  />
                  <button
                    type="button"
                    onClick={() => removeTemplateFinishing(index)}
                    className="rounded-2xl bg-rose-100 px-4 py-3 text-sm font-black text-rose-700"
                  >
                    Entfernen
                  </button>
                </div>
              ))}

              {templateForm.finishingNames.length === 0 && (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-5 text-sm font-bold text-slate-500">
                  Keine Weiterverarbeitung hinterlegt.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setIsEditorOpen(false)}
              className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-600"
            >
              Abbrechen
            </button>
            <button
              type="button"
              onClick={saveTemplate}
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm"
            >
              Vorlage speichern
            </button>
          </div>
        </section>
      )}

      <section className="grid gap-5 xl:grid-cols-2">
        {filteredTemplates.map((template) => {
          const machine = machines.find(
            (item) => item.id === template.machineId,
          );

          return (
            <article
              key={template.id}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
            >
              <div
                className={`h-2 bg-gradient-to-r ${template.status === "Aktiv" ? "from-pink-500 via-fuchsia-500 to-cyan-400" : "from-slate-300 to-slate-400"}`}
              />
              <div className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                        {template.productType}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${template.status === "Aktiv" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                      >
                        {template.status}
                      </span>
                    </div>
                    <h3 className="mt-4 text-2xl font-black tracking-tight">
                      {template.name}
                    </h3>
                    <p className="mt-2 text-sm font-bold text-slate-500">
                      {template.productName} · {template.finalWidthMm} ×{" "}
                      {template.finalHeightMm} mm ·{" "}
                      {template.defaultQuantity.toLocaleString("de-DE")} Stück
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-950 px-5 py-4 text-white">
                    <p className="text-xs font-bold text-slate-400">Nutzen</p>
                    <p className="mt-1 text-xl font-black">
                      {template.itemsPerSheet}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <InfoCard label="Maschine" value={machine?.name ?? "—"} />
                  <InfoCard label="Farbmodus" value={template.colorMode} />
                  <InfoCard
                    label="Materialien"
                    value={`${template.materialSelections.length}`}
                  />
                  <InfoCard
                    label="Weiterverarbeitung"
                    value={
                      template.finishingNames.length > 0
                        ? template.finishingNames.join(", ")
                        : "—"
                    }
                  />
                  <InfoCard
                    label="Endformat"
                    value={`${template.finalWidthMm} × ${template.finalHeightMm} mm`}
                  />
                  <InfoCard
                    label="Standardauflage"
                    value={`${template.defaultQuantity.toLocaleString("de-DE")} Stück`}
                  />
                  <InfoCard
                    label="Beschnitt"
                    value={`${template.bleedMm} mm · ${template.removeSpineBleed ? "ohne Bund" : "rundum"} · ${template.calculateAsOpenSpread ? "offen" : "geschlossen"}`}
                  />
                  <InfoCard
                    label="Zwischenschnitt"
                    value={`H ${template.gutterHorizontalMm} mm / V ${template.gutterVerticalMm} mm`}
                  />
                  <InfoCard
                    label="Laufrichtung"
                    value={
                      template.respectGrainDirection ? "beachten" : "ignorieren"
                    }
                  />
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => openEditTemplateForm(template)}
                    className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white"
                  >
                    Bearbeiten
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicateTemplate(template)}
                    className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700"
                  >
                    Duplizieren
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTemplate(template.id)}
                    disabled={calculationTemplates.length <= 1}
                    className={`rounded-2xl px-4 py-3 text-sm font-black ${calculationTemplates.length <= 1 ? "cursor-not-allowed bg-slate-100 text-slate-400" : "bg-rose-100 text-rose-700"}`}
                  >
                    Löschen
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {filteredTemplates.length === 0 && (
        <EmptyState title="Keine Kalkulationsvorlagen gefunden" />
      )}
    </div>
  );
}

function ServicesPage({
  serviceItems,
  setServiceItems,
}: {
  serviceItems: ServiceItem[];
  setServiceItems: Dispatch<SetStateAction<ServiceItem[]>>;
}) {
  const emptyServiceForm: ServiceItem = {
    id: "",
    itemNumber: `LS-${String(serviceItems.length + 10001).padStart(5, "0")}`,
    title: "",
    category: "Druckprodukt",
    description: "",
    unit: "Stück",
    unitPrice: 0,
    vatRate: 19,
    status: "Aktiv",
  };

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<ServiceItem>(emptyServiceForm);

  const categories = Array.from(
    new Set(serviceItems.map((item) => item.category)),
  ).filter(Boolean);

  const filteredServiceItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return serviceItems.filter((item) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.itemNumber.toLowerCase().includes(normalizedSearch) ||
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch) ||
        item.unit.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [categoryFilter, search, serviceItems, statusFilter]);

  const activeItems = serviceItems.filter(
    (item) => item.status === "Aktiv",
  ).length;
  const averagePrice =
    serviceItems.reduce((sum, item) => sum + item.unitPrice, 0) /
    Math.max(serviceItems.length, 1);
  const categoryCount = categories.length;

  function openNewServiceForm() {
    setEditingServiceId(null);
    setServiceForm({
      ...emptyServiceForm,
      id: createLocalId(),
      itemNumber: `LS-${String(serviceItems.length + 10001).padStart(5, "0")}`,
    });
    setIsEditorOpen(true);
  }

  function openEditServiceForm(item: ServiceItem) {
    setEditingServiceId(item.id);
    setServiceForm({ ...item });
    setIsEditorOpen(true);
  }

  function updateServiceForm(field: keyof ServiceItem, value: string | number) {
    setServiceForm((current) => ({ ...current, [field]: value }));
  }

  function saveServiceItem() {
    if (!serviceForm.title.trim()) {
      return;
    }

    const normalizedItem: ServiceItem = {
      ...serviceForm,
      id: (editingServiceId ?? serviceForm.id) || createLocalId(),
      title: serviceForm.title.trim(),
      itemNumber:
        serviceForm.itemNumber.trim() ||
        `LS-${String(serviceItems.length + 10001).padStart(5, "0")}`,
      category: serviceForm.category.trim() || "Sonstiges",
      unit: serviceForm.unit.trim() || "Stück",
      unitPrice: Math.max(Number(serviceForm.unitPrice) || 0, 0),
      vatRate: Math.max(Number(serviceForm.vatRate) || 0, 0),
    };

    setServiceItems((current) => {
      const exists = current.some((item) => item.id === normalizedItem.id);

      if (exists) {
        return current.map((item) =>
          item.id === normalizedItem.id ? normalizedItem : item,
        );
      }

      return [...current, normalizedItem];
    });

    setIsEditorOpen(false);
    setEditingServiceId(null);
  }

  function deleteServiceItem(serviceId: string) {
    setServiceItems((current) =>
      current.length <= 1
        ? current
        : current.filter((item) => item.id !== serviceId),
    );
  }

  function resetServiceItems() {
    setServiceItems(sampleServiceItems);
    setIsEditorOpen(false);
    setEditingServiceId(null);
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-slate-950/20">
        <div className="relative p-7 lg:p-9">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-40 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-indigo-300">
                Leistungsstamm V1
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">
                Artikel und Leistungen
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Häufige Angebotspositionen speichern, pflegen und später direkt
                in Dokumente übernehmen.
              </p>
            </div>

            <button
              type="button"
              onClick={openNewServiceForm}
              className="rounded-3xl bg-white px-6 py-4 text-sm font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5"
            >
              + Leistung anlegen
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Leistungen"
          value={`${serviceItems.length}`}
          hint="im Leistungsstamm"
          gradient="from-indigo-500 to-cyan-400"
        />
        <MetricCard
          label="Aktiv"
          value={`${activeItems}`}
          hint="kalkulationsbereit"
          gradient="from-emerald-400 to-green-600"
        />
        <MetricCard
          label="Kategorien"
          value={`${categoryCount}`}
          hint="für Struktur"
          gradient="from-yellow-300 to-orange-400"
        />
        <MetricCard
          label="Ø Preis"
          value={formatCurrency(averagePrice)}
          hint="Standard-Einzelpreis"
          gradient="from-fuchsia-500 to-purple-600"
        />
      </section>

      {isEditorOpen && (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="h-2 w-24 rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400" />
              <h3 className="mt-5 text-xl font-black">
                {editingServiceId ? "Leistung bearbeiten" : "Leistung anlegen"}
              </h3>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Diese Stammdaten werden automatisch im Browser gespeichert.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsEditorOpen(false)}
              className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-600 transition hover:-translate-y-0.5"
            >
              Schließen
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <InputField
              label="Artikelnummer"
              value={serviceForm.itemNumber}
              onChange={(value) => updateServiceForm("itemNumber", value)}
            />
            <SelectField
              label="Status"
              value={serviceForm.status}
              onChange={(value) =>
                updateServiceForm("status", value as ServiceItem["status"])
              }
              options={[
                { value: "Aktiv", label: "Aktiv" },
                { value: "Inaktiv", label: "Inaktiv" },
              ]}
            />
            <InputField
              label="Bezeichnung"
              value={serviceForm.title}
              onChange={(value) => updateServiceForm("title", value)}
            />
            <InputField
              label="Kategorie"
              value={serviceForm.category}
              onChange={(value) => updateServiceForm("category", value)}
            />
            <InputField
              label="Einheit"
              value={serviceForm.unit}
              onChange={(value) => updateServiceForm("unit", value)}
            />
            <NumberField
              label="Standard-Einzelpreis"
              value={serviceForm.unitPrice}
              onChange={(value) => updateServiceForm("unitPrice", value)}
              suffix="€"
              step={0.01}
            />
            <NumberField
              label="MwSt."
              value={serviceForm.vatRate}
              onChange={(value) => updateServiceForm("vatRate", value)}
              suffix="%"
            />
          </div>

          <div className="mt-4">
            <TextAreaField
              label="Beschreibung"
              value={serviceForm.description}
              onChange={(value) => updateServiceForm("description", value)}
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-bold text-slate-500">
              Pflichtfeld: Bezeichnung. Alle anderen Felder können später
              ergänzt werden.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-600 transition hover:-translate-y-0.5"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={saveServiceItem}
                disabled={!serviceForm.title.trim()}
                className={`rounded-2xl px-5 py-3 text-sm font-black text-white transition ${serviceForm.title.trim() ? "bg-slate-950 hover:-translate-y-0.5" : "cursor-not-allowed bg-slate-300"}`}
              >
                Leistung speichern
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr_0.8fr_auto] xl:items-end">
          <SearchField
            label="Suche"
            value={search}
            onChange={setSearch}
            placeholder="Leistung, Artikelnummer, Kategorie oder Beschreibung suchen..."
          />
          <SelectField
            label="Kategorie"
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { value: "all", label: "Alle Kategorien" },
              ...categories.map((category) => ({
                value: category,
                label: category,
              })),
            ]}
          />
          <SelectField
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "all", label: "Alle Status" },
              { value: "Aktiv", label: "Aktiv" },
              { value: "Inaktiv", label: "Inaktiv" },
            ]}
          />
          <button
            type="button"
            onClick={resetServiceItems}
            className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-600 transition hover:-translate-y-0.5"
          >
            Musterleistungen laden
          </button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {filteredServiceItems.map((item) => {
          const statusClass =
            item.status === "Aktiv"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-500";

          return (
            <article
              key={item.id}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
            >
              <div
                className={`h-2 bg-gradient-to-r ${item.status === "Aktiv" ? "from-indigo-500 via-cyan-400 to-emerald-400" : "from-slate-300 to-slate-500"}`}
              />
              <div className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                        {item.itemNumber}
                      </span>
                      <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-black text-indigo-700">
                        {item.category}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${statusClass}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <h3 className="mt-4 text-2xl font-black tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
                      {item.description || "Keine Beschreibung hinterlegt."}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => openEditServiceForm(item)}
                      className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
                    >
                      Bearbeiten
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteServiceItem(item.id)}
                      disabled={serviceItems.length <= 1}
                      className={`rounded-2xl px-4 py-3 text-sm font-black transition ${serviceItems.length <= 1 ? "cursor-not-allowed bg-slate-100 text-slate-400" : "bg-rose-100 text-rose-700 hover:-translate-y-0.5"}`}
                    >
                      Löschen
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <InfoCard label="Einheit" value={item.unit || "—"} />
                  <InfoCard
                    label="Einzelpreis"
                    value={formatCurrency(item.unitPrice)}
                  />
                  <InfoCard
                    label="MwSt."
                    value={`${formatNumber(item.vatRate, 0)} %`}
                  />
                  <InfoCard label="Kategorie" value={item.category || "—"} />
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {filteredServiceItems.length === 0 && (
        <EmptyState title="Keine Leistungen gefunden" />
      )}
    </div>
  );
}

function MaterialsPage({
  materials,
  setMaterials,
}: {
  materials: Material[];
  setMaterials: Dispatch<SetStateAction<Material[]>>;
}) {
  const [search, setSearch] = useState("");
  const [pricingFilter, setPricingFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(
    null,
  );

  const materialTypes = Array.from(
    new Set(materials.map((material) => material.type)),
  );
  const editingMaterial = editingMaterialId
    ? (materials.find((material) => material.id === editingMaterialId) ?? null)
    : null;

  const filteredMaterials = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return materials.filter((material) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        material.name.toLowerCase().includes(normalizedSearch) ||
        material.supplier.toLowerCase().includes(normalizedSearch) ||
        material.type.toLowerCase().includes(normalizedSearch);
      const matchesPricing =
        pricingFilter === "all" || material.pricingMode === pricingFilter;
      const matchesType = typeFilter === "all" || material.type === typeFilter;
      const isLowStock = material.stockSheets <= material.minimumStockSheets;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "low" && isLowStock) ||
        (stockFilter === "ok" && !isLowStock);
      return matchesSearch && matchesPricing && matchesType && matchesStock;
    });
  }, [materials, pricingFilter, search, stockFilter, typeFilter]);

  const totalMaterials = materials.length;
  const averagePricePerSheet =
    materials.reduce(
      (sum, material) => sum + calculateMaterialPricePerSheet(material),
      0,
    ) / Math.max(totalMaterials, 1);
  const lowStockMaterials = materials.filter(
    (material) => material.stockSheets <= material.minimumStockSheets,
  ).length;
  const stockValue = materials.reduce(
    (sum, material) =>
      sum + material.stockSheets * calculateMaterialPricePerSheet(material),
    0,
  );

  function createMaterial() {
    const nextMaterial = normalizeMaterial({
      id: createLocalId(),
      name: "Neues Material",
      type: "Papier",
      supplier: "",
      widthMm: 450,
      heightMm: 320,
      grammage: 135,
      grainDirection: "Schmalbahn" as Material["grainDirection"],
      pricingMode: "perReam" as Material["pricingMode"],
      pricePerSheet: 0,
      pricePerReam: 0,
      pricePerKg: 0,
      sheetsPerReam: 500,
      stockSheets: 0,
      minimumStockSheets: 0,
    });
    setMaterials((current) => [nextMaterial, ...current]);
    setEditingMaterialId(nextMaterial.id);
  }

  function updateMaterial(materialId: string, patch: Partial<Material>) {
    setMaterials((current) =>
      current.map((material) =>
        material.id === materialId
          ? normalizeMaterial({ ...material, ...patch })
          : material,
      ),
    );
  }

  function deleteMaterial(materialId: string) {
    setMaterials((current) =>
      current.length <= 1
        ? current
        : current.filter((material) => material.id !== materialId),
    );
    if (editingMaterialId === materialId) setEditingMaterialId(null);
  }

  function resetMaterials() {
    setMaterials(materialsDefaultClone());
    setEditingMaterialId(null);
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-slate-950/20">
        <div className="relative p-7 lg:p-9">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-orange-400/20 blur-3xl" />
          <div className="absolute bottom-0 right-40 h-56 w-56 rounded-full bg-yellow-300/20 blur-3xl" />
          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-orange-300">
                Materialverwaltung V3
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">
                Papier- und Materialstamm
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Material anlegen, bearbeiten, löschen, Preise pflegen und
                dauerhaft speichern.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={resetMaterials}
                className="rounded-3xl bg-white/10 px-6 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                Standards laden
              </button>
              <button
                type="button"
                onClick={createMaterial}
                className="rounded-3xl bg-white px-6 py-4 text-sm font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5"
              >
                + Material anlegen
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Materialien"
          value={String(totalMaterials)}
          hint="im Materialstamm"
          gradient="from-orange-400 to-yellow-300"
        />
        <MetricCard
          label="Ø Preis/Bogen"
          value={formatCurrency(averagePricePerSheet)}
          hint="über alle Materialien"
          gradient="from-cyan-400 to-sky-500"
        />
        <MetricCard
          label="Bestandswarnungen"
          value={String(lowStockMaterials)}
          hint="unter Mindestbestand"
          gradient="from-rose-500 to-orange-400"
        />
        <MetricCard
          label="Lagerwert"
          value={formatCurrency(stockValue)}
          hint="grob kalkulierter Materialwert"
          gradient="from-emerald-400 to-green-600"
        />
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
          <SearchField
            label="Suche"
            value={search}
            onChange={setSearch}
            placeholder="Material, Lieferant oder Typ suchen..."
          />
          <SelectField
            label="Preisart"
            value={pricingFilter}
            onChange={setPricingFilter}
            options={[
              { value: "all", label: "Alle Preisarten" },
              { value: "perSheet", label: "€/Bogen" },
              { value: "perReam", label: "€/Ries" },
              { value: "perKg", label: "€/kg" },
            ]}
          />
          <SelectField
            label="Materialtyp"
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: "all", label: "Alle Typen" },
              ...materialTypes.map((type) => ({ value: type, label: type })),
            ]}
          />
          <SelectField
            label="Bestand"
            value={stockFilter}
            onChange={setStockFilter}
            options={[
              { value: "all", label: "Alle Bestände" },
              { value: "low", label: "Nur Warnungen" },
              { value: "ok", label: "Bestand okay" },
            ]}
          />
        </div>
      </section>

      {editingMaterial && (
        <section className="rounded-[2rem] border border-orange-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="h-2 w-24 rounded-full bg-gradient-to-r from-orange-400 to-yellow-300" />
              <h3 className="mt-5 text-xl font-black">Material bearbeiten</h3>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Preise, Format, Laufrichtung und Lagerbestand pflegen.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditingMaterialId(null)}
              className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700 transition hover:-translate-y-0.5"
            >
              Schließen
            </button>
          </div>
          <div className="mt-6 grid gap-4 xl:grid-cols-4">
            <InputField
              label="Materialname"
              value={editingMaterial.name}
              onChange={(value) =>
                updateMaterial(editingMaterial.id, { name: value })
              }
            />
            <InputField
              label="Typ"
              value={editingMaterial.type}
              onChange={(value) =>
                updateMaterial(editingMaterial.id, { type: value })
              }
            />
            <InputField
              label="Lieferant"
              value={editingMaterial.supplier}
              onChange={(value) =>
                updateMaterial(editingMaterial.id, { supplier: value })
              }
            />
            <SelectField
              label="Laufrichtung"
              value={editingMaterial.grainDirection}
              onChange={(value) =>
                updateMaterial(editingMaterial.id, {
                  grainDirection: value as Material["grainDirection"],
                })
              }
              options={[
                { value: "Schmalbahn", label: "Schmalbahn" },
                { value: "Breitbahn", label: "Breitbahn" },
                { value: "Rolle", label: "Rolle" },
                { value: "Unbekannt", label: "Unbekannt" },
              ]}
            />
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-4">
            <NumberField
              label="Breite"
              value={editingMaterial.widthMm}
              onChange={(value) =>
                updateMaterial(editingMaterial.id, { widthMm: value })
              }
              suffix="mm"
            />
            <NumberField
              label="Höhe"
              value={editingMaterial.heightMm}
              onChange={(value) =>
                updateMaterial(editingMaterial.id, { heightMm: value })
              }
              suffix="mm"
            />
            <NumberField
              label="Grammatur"
              value={editingMaterial.grammage}
              onChange={(value) =>
                updateMaterial(editingMaterial.id, { grammage: value })
              }
              suffix="g/m²"
            />
            <NumberField
              label="Bogen/Ries"
              value={editingMaterial.sheetsPerReam}
              onChange={(value) =>
                updateMaterial(editingMaterial.id, { sheetsPerReam: value })
              }
              suffix="Bg."
            />
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-4">
            <SelectField
              label="Preisart"
              value={editingMaterial.pricingMode}
              onChange={(value) =>
                updateMaterial(editingMaterial.id, {
                  pricingMode: value as Material["pricingMode"],
                })
              }
              options={[
                { value: "perSheet", label: "€/Bogen" },
                { value: "perReam", label: "€/Ries" },
                { value: "perKg", label: "€/kg" },
              ]}
            />
            <NumberField
              label="Preis/Bogen"
              value={editingMaterial.pricePerSheet}
              onChange={(value) =>
                updateMaterial(editingMaterial.id, { pricePerSheet: value })
              }
              suffix="€"
              step={0.01}
            />
            <NumberField
              label="Preis/Ries"
              value={editingMaterial.pricePerReam}
              onChange={(value) =>
                updateMaterial(editingMaterial.id, { pricePerReam: value })
              }
              suffix="€"
              step={0.01}
            />
            <NumberField
              label="Preis/kg"
              value={editingMaterial.pricePerKg}
              onChange={(value) =>
                updateMaterial(editingMaterial.id, { pricePerKg: value })
              }
              suffix="€"
              step={0.01}
            />
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-4">
            <NumberField
              label="Lagerbestand"
              value={editingMaterial.stockSheets}
              onChange={(value) =>
                updateMaterial(editingMaterial.id, { stockSheets: value })
              }
              suffix="Bg."
            />
            <NumberField
              label="Mindestbestand"
              value={editingMaterial.minimumStockSheets}
              onChange={(value) =>
                updateMaterial(editingMaterial.id, {
                  minimumStockSheets: value,
                })
              }
              suffix="Bg."
            />
            <ReadOnlyField
              label="Preis/Bogen"
              value={formatCurrency(
                calculateMaterialPricePerSheet(editingMaterial),
              )}
            />
            <ReadOnlyField
              label="Lagerwert"
              value={formatCurrency(
                editingMaterial.stockSheets *
                  calculateMaterialPricePerSheet(editingMaterial),
              )}
            />
          </div>
        </section>
      )}

      <section className="grid gap-5 xl:grid-cols-2">
        {filteredMaterials.map((material) => {
          const areaSqm = calculateSheetAreaSqm(
            material.widthMm,
            material.heightMm,
          );
          const weightKg = calculateSheetWeightKg(
            material.widthMm,
            material.heightMm,
            material.grammage,
          );
          const pricePerSheet = calculateMaterialPricePerSheet(material);
          const isLowStock =
            material.stockSheets <= material.minimumStockSheets;
          const stockPercentage =
            material.minimumStockSheets > 0
              ? Math.min(
                  (material.stockSheets / material.minimumStockSheets) * 100,
                  160,
                )
              : 100;
          return (
            <article
              key={material.id}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
            >
              <div
                className={
                  isLowStock
                    ? "h-2 bg-gradient-to-r from-rose-500 via-orange-400 to-yellow-300"
                    : "h-2 bg-gradient-to-r from-orange-400 via-yellow-300 to-cyan-400"
                }
              />
              <div className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                        {material.type}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                        {getPricingModeLabel(material.pricingMode)}
                      </span>
                      <span
                        className={
                          isLowStock
                            ? "rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700"
                            : "rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700"
                        }
                      >
                        {isLowStock ? "Bestand niedrig" : "Bestand okay"}
                      </span>
                    </div>
                    <h3 className="mt-4 text-2xl font-black tracking-tight">
                      {material.name}
                    </h3>
                    <p className="mt-2 text-sm font-bold text-slate-500">
                      {material.widthMm} × {material.heightMm} mm ·{" "}
                      {material.grammage > 0
                        ? String(material.grammage) + " g/m²"
                        : "Rollenmaterial"}{" "}
                      · {material.supplier || "kein Lieferant"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setEditingMaterialId(material.id)}
                      className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
                    >
                      Bearbeiten
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMaterial(material.id)}
                      disabled={materials.length <= 1}
                      className={
                        materials.length <= 1
                          ? "cursor-not-allowed rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-400"
                          : "rounded-2xl bg-rose-100 px-4 py-3 text-sm font-black text-rose-700 transition hover:-translate-y-0.5"
                      }
                    >
                      Löschen
                    </button>
                  </div>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <InfoCard
                    label="Format"
                    value={
                      String(material.widthMm) +
                      " × " +
                      String(material.heightMm) +
                      " mm"
                    }
                  />
                  <InfoCard
                    label="Grammatur"
                    value={
                      material.grammage > 0
                        ? String(material.grammage) + " g/m²"
                        : "—"
                    }
                  />
                  <InfoCard
                    label="Laufrichtung"
                    value={material.grainDirection}
                  />
                  <InfoCard
                    label="Fläche/Bogen"
                    value={formatNumber(areaSqm, 4) + " m²"}
                  />
                  <InfoCard
                    label="Gewicht/Bogen"
                    value={
                      material.grammage > 0
                        ? formatNumber(weightKg * 1000, 1) + " g"
                        : "—"
                    }
                  />
                  <InfoCard
                    label="Preis/Bogen"
                    value={formatCurrency(pricePerSheet)}
                  />
                </div>
                <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                        Lagerbestand
                      </p>
                      <p className="mt-2 text-2xl font-black">
                        {material.stockSheets.toLocaleString("de-DE")} Bogen
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-500">
                        Mindestbestand:{" "}
                        {material.minimumStockSheets.toLocaleString("de-DE")}{" "}
                        Bogen · Lagerwert{" "}
                        {formatCurrency(material.stockSheets * pricePerSheet)}
                      </p>
                    </div>
                    <div
                      className={
                        isLowStock
                          ? "rounded-3xl bg-rose-100 px-5 py-4 text-rose-700"
                          : "rounded-3xl bg-emerald-100 px-5 py-4 text-emerald-700"
                      }
                    >
                      <p className="text-xs font-extrabold uppercase tracking-wide">
                        Status
                      </p>
                      <p className="mt-1 text-lg font-black">
                        {isLowStock ? "Nachbestellen" : "Okay"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 h-3 overflow-hidden rounded-full bg-white">
                    <div
                      className={
                        isLowStock
                          ? "h-full rounded-full bg-rose-500"
                          : "h-full rounded-full bg-emerald-500"
                      }
                      style={{
                        width:
                          String(Math.max(Math.min(stockPercentage, 100), 4)) +
                          "%",
                      }}
                    />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
      {filteredMaterials.length === 0 && (
        <EmptyState title="Keine Materialien gefunden" />
      )}
    </div>
  );
}

function MachinesPage({
  machines,
  setMachines,
}: {
  machines: Machine[];
  setMachines: Dispatch<SetStateAction<Machine[]>>;
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [featureText, setFeatureText] = useState("");

  const machineTypes = Array.from(
    new Set(machines.map((machine) => machine.type)),
  );

  const filteredMachines = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return machines.filter((machine) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        machine.name.toLowerCase().includes(normalizedSearch) ||
        machine.type.toLowerCase().includes(normalizedSearch) ||
        machine.notes.toLowerCase().includes(normalizedSearch) ||
        machine.specialFeatures.some((feature) =>
          feature.toLowerCase().includes(normalizedSearch),
        );

      const matchesType = typeFilter === "all" || machine.type === typeFilter;
      const matchesStatus =
        statusFilter === "all" || machine.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [machines, search, statusFilter, typeFilter]);

  const totalMachines = machines.length;
  const readyMachines = machines.filter(
    (machine) => machine.status === "Bereit",
  ).length;
  const averageHourlyRate =
    machines.reduce((sum, machine) => sum + machine.hourlyRate, 0) /
    Math.max(totalMachines, 1);
  const duplexMachines = machines.filter((machine) => machine.duplex).length;

  function openNewMachine() {
    const template = machines[0] ?? machinesDefaultClone()[0];

    setEditingMachine(
      normalizeMachine({
        ...template,
        id: createLocalId(),
        name: "Neue Maschine",
        type: "Digitaldruck",
        status: "Bereit",
        colorClickCost: 0,
        blackClickCost: 0,
        hourlyRate: template.hourlyRate || 80,
        setupMinutesDefault: 10,
        speedSheetsPerHour: 0,
        specialFeatures: [],
        notes: "",
      }),
    );
    setFeatureText("");
  }

  function openEditMachine(machine: Machine) {
    const normalizedMachine = normalizeMachine(machine);

    setEditingMachine({
      ...normalizedMachine,
      specialFeatures: [...normalizedMachine.specialFeatures],
      inkChannels:
        normalizedMachine.inkChannels?.map((channel) => ({ ...channel })) ?? [],
    });
    setFeatureText(normalizedMachine.specialFeatures.join(", "));
  }

  function updateEditingMachine<K extends keyof Machine>(
    field: K,
    value: Machine[K],
  ) {
    setEditingMachine((current) =>
      current ? { ...current, [field]: value } : current,
    );
  }

  function updateEditingInkChannel<K extends keyof InkChannel>(
    channelId: string,
    field: K,
    value: InkChannel[K],
  ) {
    setEditingMachine((current) => {
      if (!current) return current;

      return {
        ...current,
        inkChannels: (current.inkChannels ?? []).map((channel) =>
          channel.id === channelId ? { ...channel, [field]: value } : channel,
        ),
      };
    });
  }

  function addEditingInkChannel() {
    setEditingMachine((current) => {
      if (!current) return current;

      return {
        ...current,
        inkChannels: [
          ...(current.inkChannels ?? []),
          {
            id: createLocalId(),
            name: "Neue Farbe",
            cartridgePrice: 0,
            cartridgeSizeMl: 220,
            cartridgeYieldPages: 0,
            active: true,
          },
        ],
      };
    });
  }

  function removeEditingInkChannel(channelId: string) {
    setEditingMachine((current) => {
      if (!current) return current;

      return {
        ...current,
        inkChannels: (current.inkChannels ?? []).filter(
          (channel) => channel.id !== channelId,
        ),
      };
    });
  }

  function saveMachine() {
    if (!editingMachine) return;

    const normalizedMachine = normalizeMachine({
      ...editingMachine,
      specialFeatures: featureText
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean),
    });

    setMachines((current) => {
      const exists = current.some(
        (machine) => machine.id === normalizedMachine.id,
      );

      if (exists) {
        return current.map((machine) =>
          machine.id === normalizedMachine.id ? normalizedMachine : machine,
        );
      }

      return [...current, normalizedMachine];
    });

    setEditingMachine(null);
    setFeatureText("");
  }

  function deleteMachine(machineId: string) {
    setMachines((current) =>
      current.length <= 1
        ? current
        : current.filter((machine) => machine.id !== machineId),
    );
  }

  function resetMachines() {
    try {
      window.localStorage.removeItem(MACHINE_STORAGE_KEY);
    } catch {}
    setMachines(machinesDefaultClone());
    setEditingMachine(null);
    setFeatureText("");
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-slate-950/20">
        <div className="relative p-7 lg:p-9">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-40 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-300">
                Maschinenverwaltung V4
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">
                Maschinen-Stammdaten
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Maschinen anlegen, bearbeiten und inklusive
                Tinten-/Kartuschenkosten dauerhaft speichern. Die Kalkulation
                nutzt diese Maschinen direkt.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={resetMachines}
                className="rounded-3xl bg-white/10 px-6 py-4 text-sm font-black text-white ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                Zurücksetzen
              </button>
              <button
                type="button"
                onClick={openNewMachine}
                className="rounded-3xl bg-white px-6 py-4 text-sm font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5"
              >
                + Maschine anlegen
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Maschinen"
          value={`${totalMachines}`}
          hint="im Maschinenstamm"
          gradient="from-sky-500 to-cyan-400"
        />
        <MetricCard
          label="Bereit"
          value={`${readyMachines}`}
          hint="produktionsbereit"
          gradient="from-emerald-400 to-green-600"
        />
        <MetricCard
          label="Ø Stundensatz"
          value={formatCurrency(averageHourlyRate)}
          hint="über alle Maschinen"
          gradient="from-fuchsia-500 to-purple-600"
        />
        <MetricCard
          label="Duplex"
          value={`${duplexMachines}`}
          hint="duplexfähige Systeme"
          gradient="from-yellow-300 to-orange-400"
        />
      </section>

      {editingMachine && (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="h-2 w-24 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" />
              <h3 className="mt-5 text-xl font-black">
                {machines.some((machine) => machine.id === editingMachine.id)
                  ? "Maschine bearbeiten"
                  : "Maschine anlegen"}
              </h3>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Kosten, Formate, Status und Besonderheiten pflegen.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-950 p-5 text-white">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                Kostenmodell
              </p>
              <p className="mt-2 text-xl font-black">
                {getMachineCostModelLabel(
                  getMachineCostModel(editingMachine.name),
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            <InputField
              label="Maschinenname"
              value={editingMachine.name}
              onChange={(value) => updateEditingMachine("name", value)}
            />
            <InputField
              label="Maschinentyp"
              value={editingMachine.type}
              onChange={(value) => updateEditingMachine("type", value)}
            />
            <SelectField
              label="Status"
              value={editingMachine.status}
              onChange={(value) =>
                updateEditingMachine("status", value as Machine["status"])
              }
              options={[
                { value: "Bereit", label: "Bereit" },
                { value: "Wartung", label: "Wartung" },
                { value: "Prüfen", label: "Prüfen" },
              ]}
            />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <NumberField
              label="Max. Breite"
              value={editingMachine.maxWidthMm}
              onChange={(value) => updateEditingMachine("maxWidthMm", value)}
              suffix="mm"
            />
            <NumberField
              label="Max. Höhe"
              value={editingMachine.maxHeightMm}
              onChange={(value) => updateEditingMachine("maxHeightMm", value)}
              suffix="mm"
            />
            <NumberField
              label="Standard-Rüstzeit"
              value={editingMachine.setupMinutesDefault}
              onChange={(value) =>
                updateEditingMachine("setupMinutesDefault", value)
              }
              suffix="Min."
            />
            <NumberField
              label="Leistung"
              value={editingMachine.speedSheetsPerHour}
              onChange={(value) =>
                updateEditingMachine("speedSheetsPerHour", value)
              }
              suffix="Bg./h"
            />
          </div>

          {getMachineCostModel(editingMachine.name) === "click" ? (
            <div className="mt-5 rounded-3xl bg-slate-50 p-5">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                Klickkosten
              </p>
              <p className="mt-1 text-sm font-bold text-slate-500">
                Nur Klickkosten-Maschinen wie Iridesse, Nuvera oder Canon
                verwenden Farb-/S/W-Klickpreise.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <NumberField
                  label="Farbklick"
                  value={editingMachine.colorClickCost}
                  onChange={(value) =>
                    updateEditingMachine("colorClickCost", value)
                  }
                  suffix="€"
                  step={0.001}
                />
                <NumberField
                  label="S/W-Klick"
                  value={editingMachine.blackClickCost}
                  onChange={(value) =>
                    updateEditingMachine("blackClickCost", value)
                  }
                  suffix="€"
                  step={0.001}
                />
                <NumberField
                  label="Stundensatz"
                  value={editingMachine.hourlyRate}
                  onChange={(value) =>
                    updateEditingMachine("hourlyRate", value)
                  }
                  suffix="€/h"
                  step={1}
                />
                <SelectField
                  label="Duplex"
                  value={editingMachine.duplex ? "yes" : "no"}
                  onChange={(value) =>
                    updateEditingMachine("duplex", value === "yes")
                  }
                  options={[
                    { value: "yes", label: "Ja" },
                    { value: "no", label: "Nein" },
                  ]}
                />
              </div>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <NumberField
                label="Stundensatz"
                value={editingMachine.hourlyRate}
                onChange={(value) => updateEditingMachine("hourlyRate", value)}
                suffix="€/h"
                step={1}
              />
              <SelectField
                label="Duplex"
                value={editingMachine.duplex ? "yes" : "no"}
                onChange={(value) =>
                  updateEditingMachine("duplex", value === "yes")
                }
                options={[
                  { value: "yes", label: "Ja" },
                  { value: "no", label: "Nein" },
                ]}
              />
              <ReadOnlyField
                label="Kostenbasis"
                value={
                  getMachineCostModel(editingMachine.name) === "risoInk"
                    ? "Tinte/Kartusche pro Seite"
                    : "Tinte pro m² + Schneiden"
                }
              />
              <ReadOnlyField
                label="Keine Klickpreise"
                value="Klickkosten werden nicht verwendet"
              />
            </div>
          )}

          {getMachineCostModel(editingMachine.name) !== "click" && (
            <div className="mt-5 rounded-3xl bg-slate-50 p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                    Tinten- / Kartuschenmodell
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-500">
                    Riso nutzt Reichweite je Kartusche. Roland nutzt
                    Kartuschengröße in ml und berechnet daraus den
                    durchschnittlichen Preis/ml.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addEditingInkChannel}
                  className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5"
                >
                  + Farbkanal
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {(editingMachine.inkChannels ?? []).map((channel) => (
                  <div
                    key={channel.id}
                    className="rounded-3xl border border-slate-200 bg-white p-4"
                  >
                    <div className="grid gap-3 md:grid-cols-[1fr_0.8fr_0.8fr_0.8fr_0.6fr_auto] md:items-end">
                      <InputField
                        label="Farbkanal"
                        value={channel.name}
                        onChange={(value) =>
                          updateEditingInkChannel(channel.id, "name", value)
                        }
                      />
                      <NumberField
                        label="Kartusche"
                        value={channel.cartridgePrice}
                        onChange={(value) =>
                          updateEditingInkChannel(
                            channel.id,
                            "cartridgePrice",
                            value,
                          )
                        }
                        step={0.01}
                        suffix="€"
                      />
                      <NumberField
                        label="Inhalt"
                        value={channel.cartridgeSizeMl}
                        onChange={(value) =>
                          updateEditingInkChannel(
                            channel.id,
                            "cartridgeSizeMl",
                            value,
                          )
                        }
                        step={1}
                        suffix="ml"
                      />
                      <NumberField
                        label="Reichweite"
                        value={channel.cartridgeYieldPages}
                        onChange={(value) =>
                          updateEditingInkChannel(
                            channel.id,
                            "cartridgeYieldPages",
                            value,
                          )
                        }
                        step={100}
                        suffix="S."
                      />
                      <SelectField
                        label="Aktiv"
                        value={channel.active ? "yes" : "no"}
                        onChange={(value) =>
                          updateEditingInkChannel(
                            channel.id,
                            "active",
                            value === "yes",
                          )
                        }
                        options={[
                          { value: "yes", label: "Ja" },
                          { value: "no", label: "Nein" },
                        ]}
                      />
                      <button
                        type="button"
                        onClick={() => removeEditingInkChannel(channel.id)}
                        className="rounded-2xl bg-rose-100 px-4 py-3 text-sm font-black text-rose-700 transition hover:-translate-y-0.5"
                      >
                        Entfernen
                      </button>
                    </div>

                    <div className="mt-3 grid gap-3 text-sm font-bold text-slate-600 md:grid-cols-2">
                      <p>
                        Preis/ml:{" "}
                        {formatCurrency(getInkChannelCostPerMl(channel))}
                      </p>
                      <p>
                        Kosten/Seite:{" "}
                        {channel.cartridgeYieldPages > 0
                          ? formatCurrency(getInkChannelCostPerPage(channel))
                          : "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {getMachineCostModel(editingMachine.name) === "roland" && (
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <NumberField
                    label="Standardverbrauch"
                    value={editingMachine.rolandDefaultInkMlPerSqm ?? 12}
                    onChange={(value) =>
                      updateEditingMachine("rolandDefaultInkMlPerSqm", value)
                    }
                    step={0.1}
                    suffix="ml/m²"
                  />
                  <NumberField
                    label="Wartung/Reinigung"
                    value={editingMachine.rolandMaintenancePercent ?? 10}
                    onChange={(value) =>
                      updateEditingMachine("rolandMaintenancePercent", value)
                    }
                    step={1}
                    suffix="%"
                  />
                  <ReadOnlyField
                    label="Ø Preis/ml"
                    value={formatCurrency(
                      getAverageInkPricePerMl(editingMachine),
                    )}
                  />
                </div>
              )}

              {getMachineCostModel(editingMachine.name) === "risoInk" && (
                <div className="mt-5 grid gap-4 md:grid-cols-4">
                  <ReadOnlyField
                    label="wenig Farbe"
                    value={formatCurrency(
                      getRisoInkCostPerPage(editingMachine, "low"),
                    )}
                  />
                  <ReadOnlyField
                    label="normal"
                    value={formatCurrency(
                      getRisoInkCostPerPage(editingMachine, "normal"),
                    )}
                  />
                  <ReadOnlyField
                    label="hoch"
                    value={formatCurrency(
                      getRisoInkCostPerPage(editingMachine, "high"),
                    )}
                  />
                  <ReadOnlyField
                    label="vollflächig"
                    value={formatCurrency(
                      getRisoInkCostPerPage(editingMachine, "full"),
                    )}
                  />
                </div>
              )}
            </div>
          )}

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <TextAreaField
              label="Besonderheiten, kommagetrennt"
              value={featureText}
              onChange={setFeatureText}
            />
            <TextAreaField
              label="Notizen"
              value={editingMachine.notes}
              onChange={(value) => updateEditingMachine("notes", value)}
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setEditingMachine(null);
                setFeatureText("");
              }}
              className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-600 transition hover:-translate-y-0.5"
            >
              Abbrechen
            </button>
            <button
              type="button"
              onClick={saveMachine}
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5"
            >
              Maschine speichern
            </button>
          </div>
        </section>
      )}

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr_0.8fr]">
          <SearchField
            label="Suche"
            value={search}
            onChange={setSearch}
            placeholder="Maschine, Typ oder Besonderheit suchen..."
          />
          <SelectField
            label="Maschinentyp"
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: "all", label: "Alle Typen" },
              ...machineTypes.map((type) => ({ value: type, label: type })),
            ]}
          />
          <SelectField
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "all", label: "Alle Status" },
              { value: "Bereit", label: "Bereit" },
              { value: "Wartung", label: "Wartung" },
              { value: "Prüfen", label: "Prüfen" },
            ]}
          />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {filteredMachines.map((machine) => {
          const statusClass =
            machine.status === "Bereit"
              ? "bg-emerald-100 text-emerald-700"
              : machine.status === "Wartung"
                ? "bg-rose-100 text-rose-700"
                : "bg-orange-100 text-orange-700";

          const machineCostModel = getMachineCostModel(machine.name);

          return (
            <article
              key={machine.id}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
            >
              <div
                className={`h-2 bg-gradient-to-r ${
                  machine.status === "Bereit"
                    ? "from-sky-500 via-cyan-400 to-emerald-400"
                    : "from-orange-400 via-rose-500 to-fuchsia-500"
                }`}
              />

              <div className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                        {machine.type}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${statusClass}`}
                      >
                        {machine.status}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                        {machine.duplex ? "Duplex" : "Simplex"}
                      </span>
                      <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700">
                        {getMachineCostModelLabel(machineCostModel)}
                      </span>
                    </div>

                    <h3 className="mt-4 text-2xl font-black tracking-tight">
                      {machine.name}
                    </h3>
                    <p className="mt-2 text-sm font-bold text-slate-500">
                      Max. Format: {machine.maxWidthMm} × {machine.maxHeightMm}{" "}
                      mm · Rüstzeit Standard: {machine.setupMinutesDefault} Min.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => openEditMachine(machine)}
                      className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5"
                    >
                      Bearbeiten
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMachine(machine.id)}
                      disabled={machines.length <= 1}
                      className={`rounded-2xl px-4 py-3 text-sm font-black transition ${machines.length <= 1 ? "cursor-not-allowed bg-slate-100 text-slate-400" : "bg-rose-100 text-rose-700 hover:-translate-y-0.5"}`}
                    >
                      Löschen
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <InfoCard
                    label="Kostenmodell"
                    value={getMachineCostModelLabel(machineCostModel)}
                  />
                  {machineCostModel === "click" && (
                    <>
                      <InfoCard
                        label="Farbklick"
                        value={
                          machine.colorClickCost > 0
                            ? `${formatCurrency(machine.colorClickCost)} / Klick`
                            : "—"
                        }
                      />
                      <InfoCard
                        label="S/W-Klick"
                        value={
                          machine.blackClickCost > 0
                            ? `${formatCurrency(machine.blackClickCost)} / Klick`
                            : "—"
                        }
                      />
                    </>
                  )}
                  {machineCostModel === "risoInk" && (
                    <>
                      <InfoCard
                        label="Tinte normal"
                        value={`${formatCurrency(getRisoInkCostPerPage(machine, "normal"))} / Seite`}
                      />
                      <InfoCard
                        label="Tinte vollflächig"
                        value={`${formatCurrency(getRisoInkCostPerPage(machine, "full"))} / Seite`}
                      />
                    </>
                  )}
                  {machineCostModel === "roland" && (
                    <>
                      <InfoCard
                        label="Ø Tinte"
                        value={`${formatCurrency(getAverageInkPricePerMl(machine))} / ml`}
                      />
                      <InfoCard
                        label="Standardverbrauch"
                        value={`${formatNumber(machine.rolandDefaultInkMlPerSqm ?? 12, 1)} ml/m²`}
                      />
                    </>
                  )}
                  <InfoCard
                    label="Stundensatz"
                    value={`${formatCurrency(machine.hourlyRate)} / h`}
                  />
                  <InfoCard
                    label="Duplex"
                    value={machine.duplex ? "Ja" : "Nein"}
                  />
                  <InfoCard
                    label="Max. Format"
                    value={`${machine.maxWidthMm} × ${machine.maxHeightMm} mm`}
                  />
                  <InfoCard
                    label="Leistung"
                    value={
                      machine.speedSheetsPerHour > 0
                        ? `${machine.speedSheetsPerHour.toLocaleString("de-DE")} Bg./h`
                        : "Rollenabhängig"
                    }
                  />
                  <InfoCard
                    label={
                      machineCostModel === "roland"
                        ? "Produktionsarten"
                        : "Farbmodi"
                    }
                    value={
                      getAllowedColorModes(machine.name, machineCostModel)
                        .map((mode) => mode.label)
                        .join(", ") ||
                      "Drucken, Drucken + Schneiden, Nur Schneiden"
                    }
                  />
                </div>

                <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                    Besonderheiten
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {machine.specialFeatures.length > 0 ? (
                      machine.specialFeatures.map((feature) => (
                        <span
                          key={feature}
                          className="rounded-full bg-white px-3 py-2 text-xs font-black text-slate-600 shadow-sm"
                        >
                          {feature}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm font-bold text-slate-400">
                        Keine Besonderheiten hinterlegt
                      </span>
                    )}
                  </div>
                  <p className="mt-5 text-sm font-medium leading-6 text-slate-500">
                    {machine.notes || "Keine Notiz hinterlegt."}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {filteredMachines.length === 0 && (
        <EmptyState title="Keine Maschinen gefunden" />
      )}
    </div>
  );
}

function machinesDefaultClone() {
  return machines.map((machine) => normalizeMachine(machine));
}

function normalizeMachine(machine: Partial<Machine> & MachineBase): Machine {
  const model = getMachineCostModel(machine.name ?? "");
  const defaultInkChannels = getDefaultInkChannelsForMachineName(
    machine.name ?? "",
  );
  const existingInkChannels =
    Array.isArray(machine.inkChannels) && machine.inkChannels.length > 0
      ? machine.inkChannels
      : defaultInkChannels;

  return {
    ...machine,
    specialFeatures: [...(machine.specialFeatures ?? [])],
    inkChannels: existingInkChannels.map((channel) => ({
      id: channel.id || createLocalId(),
      name: channel.name,
      cartridgePrice: Number(channel.cartridgePrice) || 0,
      cartridgeSizeMl: Number(channel.cartridgeSizeMl) || 0,
      cartridgeYieldPages: Number(channel.cartridgeYieldPages) || 0,
      active: channel.active !== false,
    })),
    rolandDefaultInkMlPerSqm:
      machine.rolandDefaultInkMlPerSqm ?? (model === "roland" ? 12 : undefined),
    rolandMaintenancePercent:
      machine.rolandMaintenancePercent ?? (model === "roland" ? 10 : undefined),
  } as Machine;
}

function getDefaultInkChannelsForMachineName(
  machineName: string,
): InkChannel[] {
  const model = getMachineCostModel(machineName);

  if (model === "risoInk") {
    return ["Cyan", "Magenta", "Yellow", "Black", "Grey"].map((name) => ({
      id: createLocalId(),
      name,
      cartridgePrice: 95,
      cartridgeSizeMl: 0,
      cartridgeYieldPages: 9500,
      active: true,
    }));
  }

  if (model === "roland") {
    return [
      "Cyan",
      "Magenta",
      "Yellow",
      "Black",
      "Light Cyan",
      "Light Magenta",
      "Light Black",
      "Orange",
    ].map((name) => ({
      id: createLocalId(),
      name,
      cartridgePrice: 95,
      cartridgeSizeMl: 220,
      cartridgeYieldPages: 0,
      active: true,
    }));
  }

  return [];
}

function getInkChannelCostPerMl(channel: InkChannel) {
  if (!channel.active || channel.cartridgeSizeMl <= 0) return 0;

  return (
    Math.max(channel.cartridgePrice, 0) /
    Math.max(channel.cartridgeSizeMl, 0.01)
  );
}

function getInkChannelCostPerPage(channel: InkChannel) {
  if (!channel.active || channel.cartridgeYieldPages <= 0) return 0;

  return (
    Math.max(channel.cartridgePrice, 0) /
    Math.max(channel.cartridgeYieldPages, 1)
  );
}

function getAverageInkPricePerMl(machine: Machine) {
  const activeChannels = (machine.inkChannels ?? []).filter(
    (channel) =>
      channel.active &&
      channel.cartridgeSizeMl > 0 &&
      channel.cartridgePrice > 0,
  );

  if (activeChannels.length === 0) return 0;

  const total = activeChannels.reduce(
    (sum, channel) => sum + getInkChannelCostPerMl(channel),
    0,
  );

  return total / activeChannels.length;
}

function getRisoInkBaseCostPerPage(machine: Machine) {
  const activeChannels = (machine.inkChannels ?? []).filter(
    (channel) =>
      channel.active &&
      channel.cartridgeYieldPages > 0 &&
      channel.cartridgePrice > 0,
  );

  if (activeChannels.length === 0) return 0.05;

  return activeChannels.reduce(
    (sum, channel) => sum + getInkChannelCostPerPage(channel),
    0,
  );
}

function FinishingPage({
  finishingOperations,
  setFinishingOperations,
}: {
  finishingOperations: FinishingOperation[];
  setFinishingOperations: Dispatch<SetStateAction<FinishingOperation[]>>;
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [pricingFilter, setPricingFilter] = useState("all");
  const [editingOperationId, setEditingOperationId] = useState<string | null>(
    null,
  );

  const categories = Array.from(
    new Set(finishingOperations.map((operation) => operation.category)),
  );
  const editingOperation = editingOperationId
    ? (finishingOperations.find(
        (operation) => operation.id === editingOperationId,
      ) ?? null)
    : null;

  const filteredOperations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return finishingOperations.filter((operation) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        operation.name.toLowerCase().includes(normalizedSearch) ||
        operation.category.toLowerCase().includes(normalizedSearch) ||
        operation.notes.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        categoryFilter === "all" || operation.category === categoryFilter;
      const matchesPricing =
        pricingFilter === "all" || operation.pricingMode === pricingFilter;

      return matchesSearch && matchesCategory && matchesPricing;
    });
  }, [categoryFilter, finishingOperations, pricingFilter, search]);

  const activeOperations = finishingOperations.filter(
    (operation) => operation.active,
  ).length;
  const averageMinimumPrice =
    finishingOperations.reduce(
      (sum, operation) => sum + operation.minimumPrice,
      0,
    ) / Math.max(finishingOperations.length, 1);
  const averageSetupMinutes =
    finishingOperations.reduce(
      (sum, operation) => sum + operation.setupMinutes,
      0,
    ) / Math.max(finishingOperations.length, 1);
  const averageHourlyRate =
    finishingOperations.reduce(
      (sum, operation) => sum + operation.hourlyRate,
      0,
    ) / Math.max(finishingOperations.length, 1);

  function createOperation() {
    const template = finishingOperations[0] ?? finishingDefaultClone()[0];
    const nextOperation = normalizeFinishingOperation({
      ...template,
      id: createLocalId(),
      name: "Neue Weiterverarbeitung",
      category: "Allgemein",
      pricingMode: "perJob",
      basePrice: 0,
      unitPrice: 0,
      minimumPrice: 0,
      setupMinutes: 0,
      hourlyRate: 60,
      active: true,
      notes: "",
    });

    setFinishingOperations((current) => [nextOperation, ...current]);
    setEditingOperationId(nextOperation.id);
  }

  function updateOperation(
    operationId: string,
    patch: Partial<FinishingOperation>,
  ) {
    setFinishingOperations((current) =>
      current.map((operation) =>
        operation.id === operationId
          ? normalizeFinishingOperation({ ...operation, ...patch })
          : operation,
      ),
    );
  }

  function deleteOperation(operationId: string) {
    const operation = finishingOperations.find(
      (item) => item.id === operationId,
    );
    const confirmed = window.confirm(
      `Weiterverarbeitung „${operation?.name ?? "Vorgang"}“ wirklich löschen?`,
    );

    if (!confirmed) return;

    setFinishingOperations((current) =>
      current.length <= 1
        ? current
        : current.filter((item) => item.id !== operationId),
    );

    if (editingOperationId === operationId) {
      setEditingOperationId(null);
    }
  }

  function resetOperations() {
    const confirmed = window.confirm(
      "Alle gespeicherten Weiterverarbeitungs-Vorgänge zurücksetzen und Standards neu laden?",
    );

    if (!confirmed) return;

    try {
      window.localStorage.removeItem(FINISHING_STORAGE_KEY);
    } catch {}
    setFinishingOperations(finishingDefaultClone());
    setEditingOperationId(null);
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-slate-950/20">
        <div className="relative p-7 lg:p-9">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-lime-400/20 blur-3xl" />
          <div className="absolute bottom-0 right-40 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-lime-300">
                Weiterverarbeitung V2
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">
                Weiterverarbeitungs-Stamm
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Schneiden, Falzen, Rillen, Heften, Leimen, Stanzen, Kuvertieren
                und Handarbeit mit editierbaren Preismodellen.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={resetOperations}
                className="rounded-3xl bg-white/10 px-6 py-4 text-sm font-black text-white ring-1 ring-white/20 transition hover:-translate-y-0.5"
              >
                Standards laden
              </button>
              <button
                type="button"
                onClick={createOperation}
                className="rounded-3xl bg-white px-6 py-4 text-sm font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5"
              >
                + Vorgang anlegen
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Vorgänge"
          value={`${finishingOperations.length}`}
          hint="im Stamm"
          gradient="from-lime-400 to-emerald-500"
        />
        <MetricCard
          label="Aktiv"
          value={`${activeOperations}`}
          hint="kalkulationsbereit"
          gradient="from-emerald-400 to-green-600"
        />
        <MetricCard
          label="Ø Mindestpreis"
          value={formatCurrency(averageMinimumPrice)}
          hint="über alle Vorgänge"
          gradient="from-yellow-300 to-orange-400"
        />
        <MetricCard
          label="Ø Rüstzeit"
          value={`${formatNumber(averageSetupMinutes, 1)} Min.`}
          hint={`${formatCurrency(averageHourlyRate)} Ø Stundensatz`}
          gradient="from-cyan-400 to-sky-500"
        />
      </section>

      {editingOperation && (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="h-2 w-24 rounded-full bg-gradient-to-r from-lime-400 to-emerald-500" />
              <h3 className="mt-5 text-xl font-black">Vorgang bearbeiten</h3>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Änderungen werden automatisch im Browser gespeichert und in der
                Kalkulation verwendet.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setEditingOperationId(null)}
              className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700"
            >
              Schließen
            </button>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            <InputField
              label="Name"
              value={editingOperation.name}
              onChange={(value) =>
                updateOperation(editingOperation.id, { name: value })
              }
            />
            <InputField
              label="Kategorie"
              value={editingOperation.category}
              onChange={(value) =>
                updateOperation(editingOperation.id, { category: value })
              }
            />
            <SelectField
              label="Status"
              value={editingOperation.active ? "Aktiv" : "Inaktiv"}
              onChange={(value) =>
                updateOperation(editingOperation.id, {
                  active: value === "Aktiv",
                })
              }
              options={[
                { value: "Aktiv", label: "Aktiv" },
                { value: "Inaktiv", label: "Inaktiv" },
              ]}
            />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-3">
            <SelectField
              label="Preismodell"
              value={editingOperation.pricingMode}
              onChange={(value) =>
                updateOperation(editingOperation.id, {
                  pricingMode: value as FinishingOperation["pricingMode"],
                })
              }
              options={[
                { value: "perJob", label: "Pauschal / Auftrag" },
                { value: "perPiece", label: "pro Stück" },
                { value: "perSheet", label: "pro Bogen" },
                { value: "perMinute", label: "pro Minute" },
                { value: "per100Pieces", label: "pro 100 Stück" },
              ]}
            />
            <NumberField
              label="Grundpreis"
              value={editingOperation.basePrice}
              onChange={(value) =>
                updateOperation(editingOperation.id, { basePrice: value })
              }
              suffix="€"
              step={0.01}
            />
            <NumberField
              label="Einheitspreis"
              value={editingOperation.unitPrice}
              onChange={(value) =>
                updateOperation(editingOperation.id, { unitPrice: value })
              }
              suffix="€"
              step={0.001}
            />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-3">
            <NumberField
              label="Mindestpreis"
              value={editingOperation.minimumPrice}
              onChange={(value) =>
                updateOperation(editingOperation.id, { minimumPrice: value })
              }
              suffix="€"
              step={0.01}
            />
            <NumberField
              label="Rüstzeit"
              value={editingOperation.setupMinutes}
              onChange={(value) =>
                updateOperation(editingOperation.id, { setupMinutes: value })
              }
              suffix="Min."
            />
            <NumberField
              label="Stundensatz"
              value={editingOperation.hourlyRate}
              onChange={(value) =>
                updateOperation(editingOperation.id, { hourlyRate: value })
              }
              suffix="€/h"
              step={0.01}
            />
          </div>

          <div className="mt-4">
            <TextAreaField
              label="Notizen"
              value={editingOperation.notes}
              onChange={(value) =>
                updateOperation(editingOperation.id, { notes: value })
              }
            />
          </div>
        </section>
      )}

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr_0.8fr]">
          <SearchField
            label="Suche"
            value={search}
            onChange={setSearch}
            placeholder="Vorgang, Kategorie oder Notiz suchen..."
          />
          <SelectField
            label="Kategorie"
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { value: "all", label: "Alle Kategorien" },
              ...categories.map((category) => ({
                value: category,
                label: category,
              })),
            ]}
          />
          <SelectField
            label="Preismodell"
            value={pricingFilter}
            onChange={setPricingFilter}
            options={[
              { value: "all", label: "Alle Modelle" },
              { value: "perJob", label: "Pauschal / Auftrag" },
              { value: "perPiece", label: "pro Stück" },
              { value: "perSheet", label: "pro Bogen" },
              { value: "perMinute", label: "pro Minute" },
              { value: "per100Pieces", label: "pro 100 Stück" },
            ]}
          />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {filteredOperations.map((operation) => {
          const setupCost =
            (operation.setupMinutes / 60) * operation.hourlyRate;
          const technicalBasePrice = operation.basePrice + setupCost;
          const exampleQuantity = 1000;
          const examplePrice = calculateFinishingExamplePrice(
            operation.pricingMode,
            operation.basePrice,
            operation.unitPrice,
            operation.minimumPrice,
            operation.setupMinutes,
            operation.hourlyRate,
            exampleQuantity,
          );

          return (
            <article
              key={operation.id}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
            >
              <div className="h-2 bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400" />

              <div className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                        {operation.category}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                        {getFinishingPricingModeLabel(operation.pricingMode)}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${operation.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                      >
                        {operation.active ? "Aktiv" : "Inaktiv"}
                      </span>
                    </div>

                    <h3 className="mt-4 text-2xl font-black tracking-tight">
                      {operation.name}
                    </h3>
                    <p className="mt-2 text-sm font-bold text-slate-500">
                      {operation.notes || "Keine Notizen hinterlegt."}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setEditingOperationId(operation.id)}
                      className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white"
                    >
                      Bearbeiten
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteOperation(operation.id)}
                      disabled={finishingOperations.length <= 1}
                      className={`rounded-2xl px-4 py-3 text-sm font-black ${finishingOperations.length <= 1 ? "cursor-not-allowed bg-slate-100 text-slate-400" : "bg-rose-100 text-rose-700"}`}
                    >
                      Löschen
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <InfoCard
                    label="Preismodell"
                    value={getFinishingPricingModeLabel(operation.pricingMode)}
                  />
                  <InfoCard
                    label="Grundpreis"
                    value={formatCurrency(operation.basePrice)}
                  />
                  <InfoCard
                    label="Einheitspreis"
                    value={formatFinishingUnitPrice(
                      operation.pricingMode,
                      operation.unitPrice,
                    )}
                  />
                  <InfoCard
                    label="Rüstzeit"
                    value={`${operation.setupMinutes} Min.`}
                  />
                  <InfoCard
                    label="Rüstkosten"
                    value={formatCurrency(setupCost)}
                  />
                  <InfoCard
                    label="Stundensatz"
                    value={`${formatCurrency(operation.hourlyRate)} / h`}
                  />
                </div>

                <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                        Technischer Startpreis
                      </p>
                      <p className="mt-2 text-xl font-black">
                        {formatCurrency(technicalBasePrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                        Beispiel 1.000 Stück
                      </p>
                      <p className="mt-2 text-xl font-black">
                        {formatCurrency(examplePrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                        Mindestpreis greift
                      </p>
                      <p className="mt-2 text-xl font-black">
                        {examplePrice <= operation.minimumPrice ? "Ja" : "Nein"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {filteredOperations.length === 0 && (
        <EmptyState title="Keine Weiterverarbeitung gefunden" />
      )}
    </div>
  );
}

function SettingsPage({
  company,
  setCompany,
  documentTemplateSettings,
  setDocumentTemplateSettings,
  numberCircleSettings,
  setNumberCircleSettings,
}: {
  company: CompanyProfile;
  setCompany: Dispatch<SetStateAction<CompanyProfile>>;
  documentTemplateSettings: DocumentTemplateSettings;
  setDocumentTemplateSettings: Dispatch<
    SetStateAction<DocumentTemplateSettings>
  >;
  numberCircleSettings: NumberCircleSettings;
  setNumberCircleSettings: Dispatch<SetStateAction<NumberCircleSettings>>;
}) {
  const [activeDocumentType, setActiveDocumentType] =
    useState<DocumentType>("quote");
  const activeDocumentTemplate = documentTemplateSettings[activeDocumentType];

  function updateCompanyField(field: keyof CompanyProfile, value: string) {
    setCompany((current) => ({ ...current, [field]: value }));
  }

  function handleLogoUpload(file: File | null) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setCompany((current) => ({ ...current, logoDataUrl: result }));
    };

    reader.readAsDataURL(file);
  }

  function removeLogo() {
    setCompany((current) => ({ ...current, logoDataUrl: "" }));
  }

  function updateDocumentTemplateField(
    field: keyof Omit<DocumentTemplate, "label">,
    value: string | number,
  ) {
    setDocumentTemplateSettings((current) => ({
      ...current,
      [activeDocumentType]: {
        ...current[activeDocumentType],
        [field]: value,
      },
    }));
  }

  function resetActiveDocumentTemplate() {
    setDocumentTemplateSettings((current) => ({
      ...current,
      [activeDocumentType]: {
        ...DEFAULT_DOCUMENT_TEMPLATE_SETTINGS[activeDocumentType],
      },
    }));
  }

  function resetDocumentTemplateSettings() {
    setDocumentTemplateSettings(
      cloneDocumentTemplateSettings(DEFAULT_DOCUMENT_TEMPLATE_SETTINGS),
    );
    try {
      window.localStorage.removeItem(DOCUMENT_TEMPLATE_STORAGE_KEY);
    } catch {}
  }

  function updateNumberCircleField(
    field: keyof Omit<NumberCircle, "label">,
    value: string | number,
  ) {
    setNumberCircleSettings((current) => ({
      ...current,
      [activeDocumentType]: {
        ...current[activeDocumentType],
        [field]:
          field === "prefix"
            ? String(value).toUpperCase()
            : Math.max(Number(value) || 1, 1),
      },
    }));
  }

  function resetNumberCircleSettings() {
    setNumberCircleSettings(
      cloneNumberCircleSettings(DEFAULT_NUMBER_CIRCLE_SETTINGS),
    );
    try {
      window.localStorage.removeItem(NUMBER_CIRCLE_STORAGE_KEY);
    } catch {}
  }

  function resetCompanyProfile() {
    setCompany({ ...companyProfile });
    try {
      window.localStorage.removeItem(COMPANY_PROFILE_STORAGE_KEY);
    } catch {}
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-slate-950/20">
        <div className="relative p-7 lg:p-9">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-40 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-300">
                Einstellungen V6
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">
                Firmenprofil, Dokumenttypen & Nummernkreise
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Firmenprofil und Dokumentvorlagen für Angebot,
                Auftragsbestätigung, Rechnung, Lieferschein und Mahnung.
              </p>
            </div>
            <div className="rounded-3xl bg-white p-5 text-slate-950 shadow-xl">
              <p className="text-sm font-bold text-slate-500">
                Aktives Firmenprofil
              </p>
              <p className="mt-2 text-2xl font-black">
                {company.name || "Ohne Firmenname"}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-500">
                {company.city || "Ort nicht gesetzt"}
              </p>
              {company.logoDataUrl && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <img
                    src={company.logoDataUrl}
                    alt="Firmenlogo"
                    className="max-h-16 max-w-full object-contain"
                  />
                </div>
              )}
              <button
                type="button"
                onClick={resetCompanyProfile}
                className="mt-4 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5"
              >
                Firmenprofil zurücksetzen
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-2 w-24 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400" />
            <h3 className="mt-5 text-xl font-black">Unternehmen</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Diese Daten erscheinen in deinen Dokumenten.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <InputField
                label="Firmenname"
                value={company.name}
                onChange={(value) => updateCompanyField("name", value)}
              />
              <InputField
                label="Claim / Beschreibung"
                value={company.claim}
                onChange={(value) => updateCompanyField("claim", value)}
              />
              <InputField
                label="Straße"
                value={company.street}
                onChange={(value) => updateCompanyField("street", value)}
              />
              <InputField
                label="PLZ"
                value={company.zip}
                onChange={(value) => updateCompanyField("zip", value)}
              />
              <InputField
                label="Ort"
                value={company.city}
                onChange={(value) => updateCompanyField("city", value)}
              />
              <InputField
                label="Website"
                value={company.website}
                onChange={(value) => updateCompanyField("website", value)}
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-2 w-24 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
            <h3 className="mt-5 text-xl font-black">Logo</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Lade ein Firmenlogo hoch. Es wird lokal im Browser gespeichert und
              in Angeboten sowie in der Druckansicht verwendet.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-start">
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5">
                {company.logoDataUrl ? (
                  <div className="grid min-h-32 place-items-center rounded-2xl bg-white p-4 shadow-sm">
                    <img
                      src={company.logoDataUrl}
                      alt="Firmenlogo"
                      className="max-h-28 max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="grid min-h-32 place-items-center rounded-2xl bg-white p-4 text-center shadow-sm">
                    <div>
                      <p className="text-sm font-black text-slate-950">
                        Noch kein Logo
                      </p>
                      <p className="mt-1 text-xs font-bold text-slate-400">
                        PNG, JPG oder SVG empfohlen
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                    Logo-Datei
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    onChange={(event) =>
                      handleLogoUpload(event.target.files?.[0] ?? null)
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-950 outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-black file:text-white focus:border-slate-950 focus:bg-white"
                  />
                </label>

                <button
                  type="button"
                  onClick={removeLogo}
                  disabled={!company.logoDataUrl}
                  className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                    company.logoDataUrl
                      ? "bg-rose-100 text-rose-700 hover:-translate-y-0.5"
                      : "cursor-not-allowed bg-slate-100 text-slate-400"
                  }`}
                >
                  Logo entfernen
                </button>

                <p className="text-sm font-bold leading-6 text-slate-500">
                  Für sauberen Druck: transparentes PNG oder SVG verwenden, eher
                  breit als hoch. Ideal sind ca. 600–1200 px Breite.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-2 w-24 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500" />
            <h3 className="mt-5 text-xl font-black">Kontakt</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <InputField
                label="Telefon"
                value={company.phone}
                onChange={(value) => updateCompanyField("phone", value)}
              />
              <InputField
                label="E-Mail"
                value={company.email}
                onChange={(value) => updateCompanyField("email", value)}
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-2 w-24 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400" />
            <h3 className="mt-5 text-xl font-black">Steuer / Bank</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <InputField
                label="Steuernummer"
                value={company.taxNumber}
                onChange={(value) => updateCompanyField("taxNumber", value)}
              />
              <InputField
                label="USt-ID"
                value={company.vatId}
                onChange={(value) => updateCompanyField("vatId", value)}
              />
              <InputField
                label="Bank"
                value={company.bankName}
                onChange={(value) => updateCompanyField("bankName", value)}
              />
              <InputField
                label="IBAN"
                value={company.iban}
                onChange={(value) => updateCompanyField("iban", value)}
              />
              <InputField
                label="BIC"
                value={company.bic}
                onChange={(value) => updateCompanyField("bic", value)}
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-2 w-24 rounded-full bg-gradient-to-r from-rose-500 via-yellow-300 to-cyan-400" />
            <h3 className="mt-5 text-xl font-black">Dokumenttypen</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Jeder Dokumenttyp hat eigene Abstände und Standardtexte. Die
              Dokumentvorschau nutzt den aktiven Dokumenttyp: Angebot,
              Auftragsbestätigung, Rechnung oder Lieferschein.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
              <div className="space-y-3">
                {documentTypeOrder.map((documentType) => {
                  const template = documentTemplateSettings[documentType];
                  const isActive = documentType === activeDocumentType;
                  return (
                    <button
                      key={documentType}
                      type="button"
                      onClick={() => setActiveDocumentType(documentType)}
                      className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-black transition ${isActive ? "bg-slate-950 text-white shadow-sm" : "bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
                    >
                      {template.label}
                    </button>
                  );
                })}
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                  Aktiver Dokumenttyp
                </p>
                <h4 className="mt-2 text-2xl font-black">
                  {activeDocumentTemplate.label}
                </h4>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <NumberField
                    label="Abstand oben"
                    value={activeDocumentTemplate.topMm}
                    onChange={(value) =>
                      updateDocumentTemplateField("topMm", value)
                    }
                    suffix="mm"
                  />
                  <NumberField
                    label="Abstand unten"
                    value={activeDocumentTemplate.bottomMm}
                    onChange={(value) =>
                      updateDocumentTemplateField("bottomMm", value)
                    }
                    suffix="mm"
                  />
                  <NumberField
                    label="Linker Rand"
                    value={activeDocumentTemplate.leftMm}
                    onChange={(value) =>
                      updateDocumentTemplateField("leftMm", value)
                    }
                    suffix="mm"
                  />
                  <NumberField
                    label="Rechter Rand"
                    value={activeDocumentTemplate.rightMm}
                    onChange={(value) =>
                      updateDocumentTemplateField("rightMm", value)
                    }
                    suffix="mm"
                  />
                </div>
                <div className="mt-5 space-y-4">
                  <TextAreaField
                    label="Standard-Einleitung"
                    value={activeDocumentTemplate.introText}
                    onChange={(value) =>
                      updateDocumentTemplateField("introText", value)
                    }
                  />
                  <TextAreaField
                    label="Standard-Fußtext"
                    value={activeDocumentTemplate.footerText}
                    onChange={(value) =>
                      updateDocumentTemplateField("footerText", value)
                    }
                  />
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={resetActiveDocumentTemplate}
                    className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-950 shadow-sm transition hover:-translate-y-0.5"
                  >
                    Aktiven Typ zurücksetzen
                  </button>
                  <button
                    type="button"
                    onClick={resetDocumentTemplateSettings}
                    className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5"
                  >
                    Alle Dokumenttypen zurücksetzen
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-2 w-24 rounded-full bg-gradient-to-r from-yellow-300 via-orange-400 to-rose-500" />
            <h3 className="mt-5 text-xl font-black">Nummernkreise</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Lege Präfix, nächste Nummer und Stellenzahl je Dokumenttyp fest.
            </p>
            <div className="mt-6 rounded-3xl bg-slate-50 p-5">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                Aktiver Nummernkreis
              </p>
              <h4 className="mt-2 text-2xl font-black">
                {numberCircleSettings[activeDocumentType].label}
              </h4>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <InputField
                  label="Präfix"
                  value={numberCircleSettings[activeDocumentType].prefix}
                  onChange={(value) => updateNumberCircleField("prefix", value)}
                />
                <NumberField
                  label="Nächste Nummer"
                  value={numberCircleSettings[activeDocumentType].nextNumber}
                  onChange={(value) =>
                    updateNumberCircleField("nextNumber", value)
                  }
                />
                <NumberField
                  label="Stellen"
                  value={numberCircleSettings[activeDocumentType].padding}
                  onChange={(value) =>
                    updateNumberCircleField("padding", value)
                  }
                />
              </div>
              <div className="mt-5 rounded-3xl bg-slate-950 p-5 text-white">
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                  Beispielnummer
                </p>
                <p className="mt-2 text-3xl font-black">
                  {formatDocumentNumber(
                    numberCircleSettings[activeDocumentType],
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={resetNumberCircleSettings}
                className="mt-5 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-950 shadow-sm transition hover:-translate-y-0.5"
              >
                Nummernkreise zurücksetzen
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-2 w-24 rounded-full bg-gradient-to-r from-emerald-400 to-green-600" />
            <h3 className="mt-5 text-xl font-black">Vorschau</h3>
            <div className="mt-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
              {company.logoDataUrl ? (
                <img
                  src={company.logoDataUrl}
                  alt={company.name || "Firmenlogo"}
                  className="max-h-20 max-w-full object-contain"
                />
              ) : (
                <p className="text-lg font-black text-slate-950">
                  {company.name || "Firmenname"}
                </p>
              )}
              <p
                className={`${company.logoDataUrl ? "mt-4" : "mt-1"} text-sm font-medium text-slate-500`}
              >
                {company.claim || "Claim / Beschreibung"}
              </p>
              <p className="mt-4 text-sm font-bold text-slate-600">
                {[
                  company.street,
                  [company.zip, company.city].filter(Boolean).join(" "),
                ]
                  .filter(Boolean)
                  .join(" · ") || "Adresse"}
              </p>
              <p className="mt-2 text-sm font-bold text-slate-600">
                {[company.phone, company.email, company.website]
                  .filter(Boolean)
                  .join(" · ") || "Kontakt"}
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-2 w-24 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
            <h3 className="mt-5 text-xl font-black">Dokumentvorschau</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Aktive Vorlage: {activeDocumentTemplate.label}
            </p>
            <div className="mt-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="bg-slate-950 px-5 py-4 text-white">
                <p className="text-xs font-black uppercase tracking-widest">
                  {activeDocumentTemplate.label}
                </p>
                <p className="mt-1 text-sm font-bold text-slate-300">
                  Oben {activeDocumentTemplate.topMm} mm · Unten{" "}
                  {activeDocumentTemplate.bottomMm} mm · Links{" "}
                  {activeDocumentTemplate.leftMm} mm · Rechts{" "}
                  {activeDocumentTemplate.rightMm} mm
                </p>
              </div>
              <div className="p-5">
                <div
                  className="rounded-3xl border border-dashed border-slate-300 bg-slate-50"
                  style={{
                    paddingTop: `${Math.max(activeDocumentTemplate.topMm / 2, 8)}px`,
                    paddingBottom: `${Math.max(activeDocumentTemplate.bottomMm / 2, 8)}px`,
                    paddingLeft: `${Math.max(activeDocumentTemplate.leftMm / 2, 8)}px`,
                    paddingRight: `${Math.max(activeDocumentTemplate.rightMm / 2, 8)}px`,
                  }}
                >
                  {company.logoDataUrl ? (
                    <img
                      src={company.logoDataUrl}
                      alt={company.name || "Firmenlogo"}
                      className="max-h-14 max-w-full object-contain"
                    />
                  ) : (
                    <p className="text-sm font-black text-slate-950">
                      {company.name || "Firmenname"}
                    </p>
                  )}
                  <p className="mt-4 whitespace-pre-line text-sm font-bold leading-6 text-slate-600">
                    {activeDocumentTemplate.introText}
                  </p>
                  <div className="mt-5 rounded-2xl bg-white p-4 text-sm font-black text-slate-700 shadow-sm">
                    Beispielposition / Dokumentinhalt
                  </div>
                  <p className="mt-5 whitespace-pre-line text-sm font-bold leading-6 text-slate-600">
                    {activeDocumentTemplate.footerText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="max-w-3xl">
        <div className="h-2 w-24 rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-300" />
        <h2 className="mt-6 text-3xl font-black tracking-tight">{title}</h2>
        <p className="mt-4 text-base leading-8 text-slate-500">
          Dieses Modul ist vorbereitet. Im nächsten Schritt bekommt es echte
          Eingabefelder, Daten und Berechnungslogik.
        </p>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
  gradient,
}: {
  label: string;
  value: string;
  hint: string;
  gradient: string;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className={`h-2 bg-gradient-to-r ${gradient}`} />
      <div className="p-6">
        <p className="text-sm font-bold text-slate-500">{label}</p>
        <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
        <p className="mt-2 text-sm font-semibold text-slate-400">{hint}</p>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl bg-slate-50 p-4">
      <p className="truncate text-xs font-extrabold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p
        title={value}
        className="mt-2 truncate text-sm font-black text-slate-700"
      >
        {value}
      </p>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="block">
      <span className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-950 px-4 py-3 text-sm font-black text-white">
        {value}
      </div>
    </div>
  );
}

function SearchField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-950 outline-none transition focus:border-slate-950 focus:bg-white"
      />
    </label>
  );
}

function EmptyState({ title }: { title: string }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center">
      <h3 className="text-xl font-black">{title}</h3>
      <p className="mt-2 text-sm font-medium text-slate-500">
        Passe die Suche oder Filter an.
      </p>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-950 outline-none transition focus:border-slate-950 focus:bg-white"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold leading-6 text-slate-950 outline-none transition focus:border-slate-950 focus:bg-white"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  suffix,
  step = 1,
  min = 0,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  step?: number;
  min?: number;
}) {
  function handleChange(rawValue: string) {
    const nextValue = Number(rawValue);

    if (Number.isNaN(nextValue)) {
      onChange(min);
      return;
    }

    onChange(Math.max(nextValue, min));
  }

  return (
    <label className="block">
      <span className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <div className="mt-2 flex overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition focus-within:border-slate-950 focus-within:bg-white">
        <input
          type="number"
          value={value}
          min={min}
          step={step}
          onChange={(event) => handleChange(event.target.value)}
          className="w-full border-0 bg-transparent px-4 py-3 text-sm font-bold text-slate-950 outline-none"
        />
        {suffix && (
          <span className="grid place-items-center border-l border-slate-200 px-3 text-xs font-black text-slate-400">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-950 outline-none transition focus:border-slate-950 focus:bg-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CostAnalysisRow({
  label,
  value,
  percent,
  className,
}: {
  label: string;
  value: string;
  percent: number;
  className: string;
}) {
  const safePercent = Math.max(0, Math.min(percent, 100));

  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-slate-800">{label}</p>
          <p className="mt-1 text-xs font-bold text-slate-400">
            {formatNumber(percent, 1)} % vom Verkaufspreis
          </p>
        </div>
        <p className="shrink-0 text-sm font-black text-slate-950">{value}</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
        <div
          className={`h-full rounded-full ${className}`}
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </div>
  );
}

function CostRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-2xl px-4 py-3 ${
        highlight ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-700"
      }`}
    >
      <span className="text-sm font-bold">{label}</span>
      <span className="text-sm font-black">{value}</span>
    </div>
  );
}

function getMachineCostModel(machineName: string): MachineCostModel {
  const normalizedName = machineName.toLowerCase();

  if (normalizedName.includes("roland") || normalizedName.includes("truevis")) {
    return "roland";
  }

  if (normalizedName.includes("riso") || normalizedName.includes("comcolor")) {
    return "risoInk";
  }

  return "click";
}

function getMachineCostModelLabel(model: MachineCostModel) {
  if (model === "click") return "Klickkosten";
  if (model === "risoInk") return "Tinte pro Seite";
  if (model === "roland") return "Tinte / Fläche / Schneiden";
  return model;
}

function getAllowedColorModes(
  machineName: string,
  machineCostModel: MachineCostModel,
) {
  const normalizedName = machineName.toLowerCase();
  const blackOnlyMachine =
    normalizedName.includes("nuvera") ||
    normalizedName.includes("canon") ||
    normalizedName.includes("vp140");

  if (machineCostModel === "roland") {
    return [];
  }

  if (blackOnlyMachine) {
    return [
      { value: "1/0 schwarz", label: "1/0 schwarz" },
      { value: "1/1 schwarz", label: "1/1 schwarz" },
    ];
  }

  return [
    { value: "4/0 farbig", label: "4/0 farbig" },
    { value: "4/4 farbig", label: "4/4 farbig" },
    { value: "1/0 schwarz", label: "1/0 schwarz" },
    { value: "1/1 schwarz", label: "1/1 schwarz" },
  ];
}

function getRisoCoverageLabel(coverage: RisoInkCoverage) {
  if (coverage === "low") return "wenig Farbe";
  if (coverage === "normal") return "normal";
  if (coverage === "high") return "hoch";
  if (coverage === "full") return "vollflächig";
  return coverage;
}

function getRisoInkCostPerPage(machine: Machine, coverage: RisoInkCoverage) {
  const baseCostPerPage = getRisoInkBaseCostPerPage(machine);

  if (coverage === "low") return baseCostPerPage * 0.25;
  if (coverage === "normal") return baseCostPerPage * 0.5;
  if (coverage === "high") return baseCostPerPage * 0.75;
  if (coverage === "full") return baseCostPerPage;

  return baseCostPerPage * 0.5;
}

function getRolandProductionModeLabel(mode: RolandProductionMode) {
  if (mode === "print") return "Drucken";
  if (mode === "printCut") return "Drucken + Schneiden";
  if (mode === "cutOnly") return "Nur Schneiden";
  return mode;
}

function calculateMachineVariableCost({
  machineCostModel,
  selectedMachine,
  totalSheets,
  clickSetup,
  risoInkCoverage,
  rolandProductionMode,
  rolandPrintAreaSqm,
  rolandInkMlPerSqm,
  rolandInkCostPerMl,
  rolandCutLengthM,
  rolandCutSpeedMMin,
  rolandMaintenancePercent,
}: {
  machineCostModel: MachineCostModel;
  selectedMachine: Machine;
  totalSheets: number;
  clickSetup: ReturnType<typeof getClicksForColorMode>;
  risoInkCoverage: RisoInkCoverage;
  rolandProductionMode: RolandProductionMode;
  rolandPrintAreaSqm: number;
  rolandInkMlPerSqm: number;
  rolandInkCostPerMl: number;
  rolandCutLengthM: number;
  rolandCutSpeedMMin: number;
  rolandMaintenancePercent: number;
}) {
  if (machineCostModel === "risoInk") {
    const costPerPage = getRisoInkCostPerPage(selectedMachine, risoInkCoverage);
    const printedSides = Math.max(
      clickSetup.colorClicksPerSheet + clickSetup.blackClicksPerSheet,
      1,
    );
    const total = Math.max(totalSheets, 0) * printedSides * costPerPage;

    return {
      total,
      rows: [
        { label: "Druckseiten/Bogen", value: `${printedSides}` },
        {
          label: "Riso-Verbrauch",
          value: getRisoCoverageLabel(risoInkCoverage),
        },
        { label: "Tintenkosten/Seite", value: formatCurrency(costPerPage) },
        { label: "Tintenkosten", value: formatCurrency(total) },
      ],
    };
  }

  if (machineCostModel === "roland") {
    const inkBaseCost =
      rolandProductionMode === "cutOnly"
        ? 0
        : Math.max(rolandPrintAreaSqm, 0) *
          Math.max(rolandInkMlPerSqm, 0) *
          Math.max(rolandInkCostPerMl, 0);

    const inkCost =
      inkBaseCost * (1 + Math.max(rolandMaintenancePercent, 0) / 100);
    const cutMinutes =
      rolandProductionMode === "print"
        ? 0
        : Math.max(rolandCutLengthM, 0) / Math.max(rolandCutSpeedMMin, 0.01);
    const cutCost = (cutMinutes / 60) * selectedMachine.hourlyRate;
    const total = inkCost + cutCost;

    const rows = [
      {
        label: "Roland-Produktion",
        value: getRolandProductionModeLabel(rolandProductionMode),
      },
    ];

    if (rolandProductionMode !== "cutOnly") {
      rows.push({
        label: "Druckfläche",
        value: `${formatNumber(rolandPrintAreaSqm, 2)} m²`,
      });
      rows.push({
        label: "Tintenverbrauch",
        value: `${formatNumber(rolandInkMlPerSqm, 1)} ml/m²`,
      });
      rows.push({
        label: "Tinte Ø",
        value: `${formatCurrency(rolandInkCostPerMl)} / ml`,
      });
      rows.push({ label: "Tintenkosten", value: formatCurrency(inkCost) });
    }

    if (rolandProductionMode !== "print") {
      rows.push({
        label: "Schneidezeit",
        value: `${formatNumber(cutMinutes, 1)} Min.`,
      });
      rows.push({ label: "Schneidekosten", value: formatCurrency(cutCost) });
    }

    return { total, rows };
  }

  const colorClickTotal =
    Math.max(totalSheets, 0) *
    clickSetup.colorClicksPerSheet *
    selectedMachine.colorClickCost;
  const blackClickTotal =
    Math.max(totalSheets, 0) *
    clickSetup.blackClicksPerSheet *
    selectedMachine.blackClickCost;

  return {
    total: colorClickTotal + blackClickTotal,
    rows: [
      { label: "Farbklicks", value: formatCurrency(colorClickTotal) },
      { label: "S/W-Klicks", value: formatCurrency(blackClickTotal) },
    ],
  };
}

function createDefaultCalculationTemplates(
  materialCatalog: Material[],
  machineCatalog: Machine[],
  finishingCatalog: FinishingOperation[],
  productTypeCatalog: ProductType[] = DEFAULT_PRODUCT_TYPES,
): CalculationTemplate[] {
  return productTypeCatalog.map((type, index) => {
    const baseTemplate = getProductTemplate(type, materialCatalog);

    return normalizeCalculationTemplate(
      {
        id: `template-${type.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}`,
        name: type,
        productType: type,
        defaultQuantity: type === "Broschüre" || type === "Block" ? 100 : 1000,
        machineId: pickDefaultMachineForTemplate(type, machineCatalog),
        status: "Aktiv",
        ...baseTemplate,
      },
      materialCatalog,
      machineCatalog,
      finishingCatalog,
      productTypeCatalog,
    );
  });
}

function createEmptyCalculationTemplate(
  materialCatalog: Material[],
  machineCatalog: Machine[],
  finishingCatalog: FinishingOperation[],
  index: number,
  productTypeCatalog: ProductType[] = DEFAULT_PRODUCT_TYPES,
): CalculationTemplate {
  const productType: ProductType = productTypeCatalog[0] ?? "Flyer";
  const baseTemplate = getProductTemplate(productType, materialCatalog);

  return normalizeCalculationTemplate(
    {
      id: createLocalId(),
      name: `Neue Vorlage ${index}`,
      productType,
      defaultQuantity: 1000,
      machineId: pickDefaultMachineForTemplate(productType, machineCatalog),
      status: "Aktiv",
      ...baseTemplate,
    },
    materialCatalog,
    machineCatalog,
    finishingCatalog,
    productTypeCatalog,
  );
}

function normalizeCalculationTemplate(
  template: Partial<CalculationTemplate>,
  materialCatalog: Material[],
  machineCatalog: Machine[],
  finishingCatalog: FinishingOperation[],
  productTypeCatalog: ProductType[] = DEFAULT_PRODUCT_TYPES,
): CalculationTemplate {
  const rawProductType = String(template.productType || "").trim();
  const productType =
    rawProductType && productTypeCatalog.includes(rawProductType)
      ? rawProductType
      : (productTypeCatalog[0] ?? "Flyer");
  const fallbackTemplate = getProductTemplate(productType, materialCatalog);
  const fallbackMachineId = pickDefaultMachineForTemplate(
    productType,
    machineCatalog,
  );
  const materialFallbackId = materialCatalog[0]?.id ?? "";

  const materialSelections =
    Array.isArray(template.materialSelections) &&
    template.materialSelections.length > 0
      ? template.materialSelections.map((selection) => ({
          label: String(selection.label || "Material"),
          materialId: materialCatalog.some(
            (material) => material.id === selection.materialId,
          )
            ? String(selection.materialId)
            : materialFallbackId,
          calculationMode: ["manual", "perCopy", "pages"].includes(
            String(selection.calculationMode),
          )
            ? (selection.calculationMode as MaterialCalculationMode)
            : "perCopy",
          manualSheets: Math.max(Number(selection.manualSheets) || 0, 0),
          factorPerCopy: Math.max(Number(selection.factorPerCopy) || 0, 0),
          pages: Math.max(Number(selection.pages) || 0, 0),
          pagesPerSheet: Math.max(Number(selection.pagesPerSheet) || 1, 1),
          itemsPerSheet: Math.max(Number(selection.itemsPerSheet) || 1, 1),
        }))
      : fallbackTemplate.materialSelections;

  const finishingNames = Array.isArray(template.finishingNames)
    ? template.finishingNames
        .map((name) => String(name || "").trim())
        .filter(Boolean)
        .filter((name) =>
          finishingCatalog.some((operation) => operation.name === name),
        )
    : fallbackTemplate.finishingNames;

  return {
    id: String(template.id || createLocalId()),
    name: String(template.name || productType).trim() || productType,
    productType,
    productName:
      String(template.productName || fallbackTemplate.productName).trim() ||
      fallbackTemplate.productName,
    defaultQuantity: Math.max(Number(template.defaultQuantity) || 1, 1),
    finalWidthMm: Math.max(
      Number(template.finalWidthMm) || fallbackTemplate.finalWidthMm,
      1,
    ),
    finalHeightMm: Math.max(
      Number(template.finalHeightMm) || fallbackTemplate.finalHeightMm,
      1,
    ),
    itemsPerSheet: Math.max(
      Number(template.itemsPerSheet) || fallbackTemplate.itemsPerSheet,
      1,
    ),
    colorMode: String(template.colorMode || fallbackTemplate.colorMode),
    bleedMm: Math.max(
      Number(template.bleedMm ?? fallbackTemplate.bleedMm ?? 3) || 0,
      0,
    ),
    removeSpineBleed:
      typeof template.removeSpineBleed === "boolean"
        ? template.removeSpineBleed
        : (fallbackTemplate.removeSpineBleed ?? isBrochureProduct(productType)),
    calculateAsOpenSpread:
      typeof template.calculateAsOpenSpread === "boolean"
        ? template.calculateAsOpenSpread
        : (fallbackTemplate.calculateAsOpenSpread ?? isBrochureProduct(productType)),
    gripperMarginMm: 0,
    sheetMarginMm: 0,
    gutterHorizontalMm: Math.max(
      Number(
        template.gutterHorizontalMm ?? fallbackTemplate.gutterHorizontalMm ?? 4,
      ) || 0,
      0,
    ),
    gutterVerticalMm: Math.max(
      Number(
        template.gutterVerticalMm ?? fallbackTemplate.gutterVerticalMm ?? 4,
      ) || 0,
      0,
    ),
    allowRotation:
      typeof template.allowRotation === "boolean"
        ? template.allowRotation
        : (fallbackTemplate.allowRotation ?? true),
    respectGrainDirection:
      typeof template.respectGrainDirection === "boolean"
        ? template.respectGrainDirection
        : (fallbackTemplate.respectGrainDirection ?? true),
    rawSheetMaterialId: materialCatalog.some(
      (material) => material.id === template.rawSheetMaterialId,
    )
      ? String(template.rawSheetMaterialId)
      : fallbackTemplate.rawSheetMaterialId &&
          materialCatalog.some(
            (material) => material.id === fallbackTemplate.rawSheetMaterialId,
          )
        ? fallbackTemplate.rawSheetMaterialId
        : materialFallbackId,
    machineId: machineCatalog.some(
      (machine) => machine.id === template.machineId,
    )
      ? String(template.machineId)
      : fallbackMachineId,
    status: template.status === "Inaktiv" ? "Inaktiv" : "Aktiv",
    materialSelections,
    finishingNames,
  };
}

function isBrochureProduct(productType: ProductType) {
  return String(productType || "")
    .toLowerCase()
    .includes("brosch");
}

function pickDefaultMachineForTemplate(
  productType: ProductType,
  machineCatalog: Machine[],
) {
  const preferred =
    productType === "Großformat" ||
    productType === "Poster" ||
    productType === "Aufkleber"
      ? machineCatalog.find(
          (machine) => getMachineCostModel(machine.name) === "roland",
        )
      : productType === "SD-Satz" || productType === "Block"
        ? machineCatalog.find(
            (machine) =>
              machine.name.toLowerCase().includes("nuvera") ||
              machine.name.toLowerCase().includes("canon"),
          )
        : machineCatalog.find((machine) =>
            machine.name.toLowerCase().includes("iridesse"),
          );

  return preferred?.id ?? machineCatalog[0]?.id ?? "";
}

function getProductTemplate(
  productType: ProductType,
  materialCatalog: Material[],
): ProductTemplate {
  const offsetMaterialId =
    findMaterialIdInCatalog(materialCatalog, "Offset") ?? materialCatalog[0].id;
  const strongMaterialId =
    findMaterialIdInCatalog(materialCatalog, "300") ??
    findMaterialIdInCatalog(materialCatalog, "Karton") ??
    materialCatalog[0].id;
  const standardMaterialId = materialCatalog[0].id;
  const rollMaterialId =
    findMaterialIdInCatalog(materialCatalog, "Vinyl") ??
    findMaterialIdInCatalog(materialCatalog, "Folie") ??
    materialCatalog[0].id;
  const defaultTemplateParameters = {
    bleedMm: 3,
    removeSpineBleed: false,
    calculateAsOpenSpread: false,
    gripperMarginMm: 0,
    sheetMarginMm: 0,
    gutterHorizontalMm: 4,
    gutterVerticalMm: 4,
    allowRotation: true,
    respectGrainDirection: true,
    rawSheetMaterialId: standardMaterialId,
  };

  const templates: Record<ProductType, ProductTemplate> = {
    Einzelblatt: {
      productName: "Einzelblatt A4",
      finalWidthMm: 210,
      finalHeightMm: 297,
      itemsPerSheet: 1,
      colorMode: "4/4 farbig",
      materialSelections: [
        {
          label: "Papier",
          materialId: offsetMaterialId,
          calculationMode: "perCopy",
          manualSheets: 1000,
          factorPerCopy: 1,
          pages: 2,
          pagesPerSheet: 2,
          itemsPerSheet: 1,
        },
      ],
      finishingNames: ["Schneiden"],
    },
    Flyer: {
      productName: "Flyer A5",
      finalWidthMm: 148,
      finalHeightMm: 210,
      itemsPerSheet: 2,
      colorMode: "4/4 farbig",
      materialSelections: [
        {
          label: "Flyerpapier",
          materialId: standardMaterialId,
          calculationMode: "perCopy",
          manualSheets: 500,
          factorPerCopy: 1,
          pages: 2,
          pagesPerSheet: 2,
          itemsPerSheet: 2,
        },
      ],
      finishingNames: ["Schneiden"],
    },
    Visitenkarten: {
      productName: "Visitenkarten 85 × 55 mm",
      finalWidthMm: 85,
      finalHeightMm: 55,
      itemsPerSheet: 10,
      colorMode: "4/4 farbig",
      materialSelections: [
        {
          label: "Kartenmaterial",
          materialId: strongMaterialId,
          calculationMode: "perCopy",
          manualSheets: 100,
          factorPerCopy: 1,
          pages: 2,
          pagesPerSheet: 2,
          itemsPerSheet: 10,
        },
      ],
      finishingNames: ["Schneiden"],
    },
    Poster: {
      productName: "Poster A3",
      finalWidthMm: 297,
      finalHeightMm: 420,
      itemsPerSheet: 1,
      colorMode: "4/0 farbig",
      materialSelections: [
        {
          label: "Posterpapier",
          materialId: standardMaterialId,
          calculationMode: "perCopy",
          manualSheets: 100,
          factorPerCopy: 1,
          pages: 1,
          pagesPerSheet: 1,
          itemsPerSheet: 1,
        },
      ],
      finishingNames: ["Schneiden"],
    },
    Aufkleber: {
      productName: "Aufkleber",
      finalWidthMm: 100,
      finalHeightMm: 100,
      itemsPerSheet: 1,
      colorMode: "4/0 farbig",
      materialSelections: [
        {
          label: "Folie",
          materialId: rollMaterialId,
          calculationMode: "manual",
          manualSheets: 10,
          factorPerCopy: 1,
          pages: 1,
          pagesPerSheet: 1,
          itemsPerSheet: 1,
        },
      ],
      finishingNames: ["Schneiden"],
    },
    Karte: {
      productName: "Karte A6",
      finalWidthMm: 105,
      finalHeightMm: 148,
      itemsPerSheet: 4,
      colorMode: "4/4 farbig",
      materialSelections: [
        {
          label: "Kartenmaterial",
          materialId: strongMaterialId,
          calculationMode: "perCopy",
          manualSheets: 250,
          factorPerCopy: 1,
          pages: 2,
          pagesPerSheet: 2,
          itemsPerSheet: 4,
        },
      ],
      finishingNames: ["Schneiden", "Rillen"],
    },
    Broschüre: {
      productName: "Broschüre A4",
      finalWidthMm: 210,
      finalHeightMm: 297,
      itemsPerSheet: 1,
      colorMode: "4/4 farbig",
      materialSelections: [
        {
          label: "Inhalt",
          materialId: offsetMaterialId,
          calculationMode: "pages",
          manualSheets: 500,
          factorPerCopy: 1,
          pages: 32,
          pagesPerSheet: 4,
          itemsPerSheet: 1,
        },
        {
          label: "Umschlag",
          materialId: strongMaterialId,
          calculationMode: "perCopy",
          manualSheets: 50,
          factorPerCopy: 1,
          pages: 4,
          pagesPerSheet: 4,
          itemsPerSheet: 1,
        },
      ],
      finishingNames: ["Schneiden", "Rückendraht"],
      removeSpineBleed: true,
      calculateAsOpenSpread: true,
    },
    "SD-Satz": {
      productName: "SD-Satz 3-fach",
      finalWidthMm: 210,
      finalHeightMm: 297,
      itemsPerSheet: 1,
      colorMode: "1/0 schwarz",
      materialSelections: [
        {
          label: "Blatt 1 weiß",
          materialId: offsetMaterialId,
          calculationMode: "perCopy",
          manualSheets: 1000,
          factorPerCopy: 1,
          pages: 1,
          pagesPerSheet: 1,
          itemsPerSheet: 1,
        },
        {
          label: "Blatt 2 farbig",
          materialId: offsetMaterialId,
          calculationMode: "perCopy",
          manualSheets: 1000,
          factorPerCopy: 1,
          pages: 1,
          pagesPerSheet: 1,
          itemsPerSheet: 1,
        },
        {
          label: "Blatt 3 farbig",
          materialId: offsetMaterialId,
          calculationMode: "perCopy",
          manualSheets: 1000,
          factorPerCopy: 1,
          pages: 1,
          pagesPerSheet: 1,
          itemsPerSheet: 1,
        },
      ],
      finishingNames: ["Schneiden", "Satzleimung"],
    },
    Block: {
      productName: "Block A4",
      finalWidthMm: 210,
      finalHeightMm: 297,
      itemsPerSheet: 1,
      colorMode: "1/0 schwarz",
      materialSelections: [
        {
          label: "Blockinhalt",
          materialId: offsetMaterialId,
          calculationMode: "pages",
          manualSheets: 1000,
          factorPerCopy: 1,
          pages: 50,
          pagesPerSheet: 1,
          itemsPerSheet: 1,
        },
        {
          label: "Rückenkarton",
          materialId: strongMaterialId,
          calculationMode: "perCopy",
          manualSheets: 100,
          factorPerCopy: 1,
          pages: 1,
          pagesPerSheet: 1,
          itemsPerSheet: 1,
        },
      ],
      finishingNames: ["Schneiden", "Blockleimung"],
    },
    Mailing: {
      productName: "Mailing A4",
      finalWidthMm: 210,
      finalHeightMm: 297,
      itemsPerSheet: 1,
      colorMode: "4/4 farbig",
      materialSelections: [
        {
          label: "Anschreiben",
          materialId: offsetMaterialId,
          calculationMode: "perCopy",
          manualSheets: 1000,
          factorPerCopy: 1,
          pages: 2,
          pagesPerSheet: 2,
          itemsPerSheet: 1,
        },
        {
          label: "Beileger",
          materialId: standardMaterialId,
          calculationMode: "perCopy",
          manualSheets: 1000,
          factorPerCopy: 1,
          pages: 2,
          pagesPerSheet: 2,
          itemsPerSheet: 1,
        },
      ],
      finishingNames: ["Falzen", "Kuvertieren"],
    },
    Großformat: {
      productName: "Großformat-Aufkleber",
      finalWidthMm: 500,
      finalHeightMm: 700,
      itemsPerSheet: 1,
      colorMode: "4/0 farbig",
      materialSelections: [
        {
          label: "Rollenmaterial",
          materialId: rollMaterialId,
          calculationMode: "manual",
          manualSheets: 10,
          factorPerCopy: 1,
          pages: 1,
          pagesPerSheet: 1,
          itemsPerSheet: 1,
        },
      ],
      finishingNames: ["Schneiden"],
    },
  };

  const selectedTemplate =
    templates[productType] ?? templates.Flyer ?? Object.values(templates)[0];

  return {
    ...defaultTemplateParameters,
    ...selectedTemplate,
    rawSheetMaterialId:
      selectedTemplate.rawSheetMaterialId ??
      selectedTemplate.materialSelections[0]?.materialId ??
      standardMaterialId,
  };
}

function getFinishingPricingModeLabel(mode: string) {
  if (mode === "perJob") return "Pauschal / Auftrag";
  if (mode === "perPiece") return "pro Stück";
  if (mode === "perSheet") return "pro Bogen";
  if (mode === "perMinute") return "pro Minute";
  if (mode === "per100Pieces") return "pro 100 Stück";
  return mode;
}

function formatFinishingUnitPrice(mode: string, unitPrice: number) {
  if (mode === "perJob") return "—";
  if (mode === "perPiece") return `${formatCurrency(unitPrice)} / Stück`;
  if (mode === "perSheet") return `${formatCurrency(unitPrice)} / Bogen`;
  if (mode === "perMinute") return `${formatCurrency(unitPrice)} / Min.`;
  if (mode === "per100Pieces")
    return `${formatCurrency(unitPrice)} / 100 Stück`;
  return formatCurrency(unitPrice);
}

function calculateMaterialSheets(
  selection: MaterialSelection,
  quantity: number,
) {
  if (selection.calculationMode === "manual") {
    return Math.ceil(Math.max(selection.manualSheets, 0));
  }

  if (selection.calculationMode === "perCopy") {
    const totalPieces = quantity * Math.max(selection.factorPerCopy, 0);
    return Math.ceil(totalPieces / Math.max(selection.itemsPerSheet, 1));
  }

  if (selection.calculationMode === "pages") {
    const totalPages = quantity * Math.max(selection.pages, 0);
    return Math.ceil(totalPages / Math.max(selection.pagesPerSheet, 1));
  }

  return 0;
}

function calculateFinishingExamplePrice(
  mode: string,
  basePrice: number,
  unitPrice: number,
  minimumPrice: number,
  setupMinutes: number,
  hourlyRate: number,
  quantity: number,
) {
  const setupCost = (setupMinutes / 60) * hourlyRate;
  let variableCost = 0;

  if (mode === "perPiece") variableCost = quantity * unitPrice;
  if (mode === "perSheet") variableCost = quantity * unitPrice;
  if (mode === "perMinute") variableCost = setupMinutes * unitPrice;
  if (mode === "per100Pieces")
    variableCost = Math.ceil(quantity / 100) * unitPrice;

  return Math.max(basePrice + setupCost + variableCost, minimumPrice);
}

function calculateFinishingPrice({
  pricingMode,
  basePrice,
  unitPrice,
  minimumPrice,
  setupMinutes,
  hourlyRate,
  quantity,
  sheets,
}: {
  pricingMode: string;
  basePrice: number;
  unitPrice: number;
  minimumPrice: number;
  setupMinutes: number;
  hourlyRate: number;
  quantity: number;
  sheets: number;
}) {
  const setupCost = (setupMinutes / 60) * hourlyRate;
  let variableCost = 0;

  if (pricingMode === "perPiece") variableCost = quantity * unitPrice;
  if (pricingMode === "perSheet") variableCost = sheets * unitPrice;
  if (pricingMode === "perMinute") variableCost = setupMinutes * unitPrice;
  if (pricingMode === "per100Pieces")
    variableCost = Math.ceil(quantity / 100) * unitPrice;

  return Math.max(basePrice + setupCost + variableCost, minimumPrice);
}

function finishingDefaultClone(): FinishingOperation[] {
  return finishingOperations.map((operation) =>
    normalizeFinishingOperation(operation),
  );
}

function normalizeFinishingOperation(
  operation: Partial<FinishingOperation>,
): FinishingOperation {
  const fallback = finishingOperations[0];

  return {
    ...fallback,
    ...operation,
    id: String(operation.id ?? createLocalId()),
    name: String(operation.name ?? "Weiterverarbeitung"),
    category: String(operation.category ?? "Allgemein"),
    pricingMode: (operation.pricingMode ??
      "perJob") as FinishingOperation["pricingMode"],
    basePrice: Number(operation.basePrice ?? 0),
    unitPrice: Number(operation.unitPrice ?? 0),
    minimumPrice: Number(operation.minimumPrice ?? 0),
    setupMinutes: Number(operation.setupMinutes ?? 0),
    hourlyRate: Number(operation.hourlyRate ?? 60),
    active: Boolean(operation.active ?? true),
    notes: String(operation.notes ?? ""),
  };
}

function findFinishingIdInCatalog(
  catalog: FinishingOperation[],
  search: string,
) {
  const normalizedSearch = search.toLowerCase();

  return catalog.find((operation) =>
    operation.name.toLowerCase().includes(normalizedSearch),
  )?.id;
}

function materialsDefaultClone(): Material[] {
  return materials.map((material) => normalizeMaterial(material));
}

function normalizeMaterial(material: Partial<Material>): Material {
  const fallback = materials[0];
  return {
    ...fallback,
    ...material,
    id: String(material.id ?? createLocalId()),
    name: String(material.name ?? fallback.name),
    type: String(material.type ?? fallback.type),
    supplier: String(material.supplier ?? ""),
    widthMm: Number(material.widthMm ?? fallback.widthMm ?? 0),
    heightMm: Number(material.heightMm ?? fallback.heightMm ?? 0),
    grammage: Number(material.grammage ?? fallback.grammage ?? 0),
    grainDirection: (material.grainDirection ??
      fallback.grainDirection) as Material["grainDirection"],
    pricingMode: (material.pricingMode ??
      fallback.pricingMode) as Material["pricingMode"],
    pricePerSheet: Number(material.pricePerSheet ?? 0),
    pricePerReam: Number(material.pricePerReam ?? 0),
    pricePerKg: Number(material.pricePerKg ?? 0),
    sheetsPerReam: Number(material.sheetsPerReam ?? 500),
    stockSheets: Number(material.stockSheets ?? 0),
    minimumStockSheets: Number(material.minimumStockSheets ?? 0),
  };
}

function findMaterialIdInCatalog(materialCatalog: Material[], search: string) {
  const normalizedSearch = search.toLowerCase();
  return materialCatalog.find((material) =>
    material.name.toLowerCase().includes(normalizedSearch),
  )?.id;
}

function findMaterialId(search: string) {
  const normalizedSearch = search.toLowerCase();
  return materials.find((material) =>
    material.name.toLowerCase().includes(normalizedSearch),
  )?.id;
}

function findFinishingId(search: string) {
  const normalizedSearch = search.toLowerCase();
  return finishingOperations.find((operation) =>
    operation.name.toLowerCase().includes(normalizedSearch),
  )?.id;
}

function withLocalMaterialId(
  selection: Omit<MaterialSelection, "id">,
): MaterialSelection {
  return {
    id: createLocalId(),
    ...selection,
  };
}

function withLocalFinishingId(operationId: string): FinishingSelection {
  return {
    id: createLocalId(),
    operationId,
  };
}

function allocateProportionalInteger(total: number, weights: number[]) {
  const safeTotal = Math.max(Math.round(total), 0);
  const weightTotal = weights.reduce(
    (sum, weight) => sum + Math.max(weight, 0),
    0,
  );

  if (safeTotal <= 0 || weightTotal <= 0) {
    return weights.map(() => 0);
  }

  const rawShares = weights.map((weight, index) => {
    const safeWeight = Math.max(weight, 0);
    const raw = (safeTotal * safeWeight) / weightTotal;

    return {
      index,
      floor: Math.floor(raw),
      remainder: raw - Math.floor(raw),
    };
  });

  let remaining =
    safeTotal - rawShares.reduce((sum, share) => sum + share.floor, 0);
  const result = rawShares.map((share) => share.floor);

  rawShares
    .slice()
    .sort((a, b) => b.remainder - a.remainder)
    .forEach((share) => {
      if (remaining <= 0) return;
      result[share.index] += 1;
      remaining -= 1;
    });

  return result;
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function ImpositionPreview({
  sheetWidthMm,
  sheetHeightMm,
  finalWidthMm,
  finalHeightMm,
  bleedMm,
  removeSpineBleed,
  calculateAsOpenSpread,
  gripperMarginMm,
  sheetMarginMm,
  gutterHorizontalMm,
  gutterVerticalMm,
  result,
}: {
  sheetWidthMm: number;
  sheetHeightMm: number;
  finalWidthMm: number;
  finalHeightMm: number;
  bleedMm: number;
  removeSpineBleed: boolean;
  calculateAsOpenSpread: boolean;
  gripperMarginMm: number;
  sheetMarginMm: number;
  gutterHorizontalMm: number;
  gutterVerticalMm: number;
  result: ReturnType<typeof calculateImpositionResult>;
}) {
  const safeSheetWidth = Math.max(Number(sheetWidthMm) || 0, 1);
  const safeSheetHeight = Math.max(Number(sheetHeightMm) || 0, 1);
  const previewWidth = 540;
  const previewHeight = Math.max(
    (previewWidth / safeSheetWidth) * safeSheetHeight,
    250,
  );
  const scale = previewWidth / safeSheetWidth;

  const safeSheetMargin = 0;
  const safeGripperMargin = 0;
  const safeBleed = Math.max(Number(bleedMm) || 0, 0);
  const spreadMode = Boolean(calculateAsOpenSpread);
  const noSpineBleed = Boolean(removeSpineBleed) && !spreadMode;
  const safeGutterHorizontal = Math.max(Number(gutterHorizontalMm) || 0, 0);
  const safeGutterVertical = Math.max(Number(gutterVerticalMm) || 0, 0);

  const isRotated = result.best.orientation === "gedreht";
  const productWidthWithBleed = Math.max(result.best.itemWidth, 1);
  const productHeightWithBleed = Math.max(result.best.itemHeight, 1);
  const closedFinalWidth = Math.max(Number(finalWidthMm) || 0, 1);
  const closedFinalHeight = Math.max(Number(finalHeightMm) || 0, 1);
  const openFinalWidth = spreadMode ? closedFinalWidth * 2 : closedFinalWidth;
  const openFinalHeight = closedFinalHeight;
  const finalWidth = isRotated ? openFinalHeight : openFinalWidth;
  const finalHeight = isRotated ? openFinalWidth : openFinalHeight;

  const spineAxis = noSpineBleed ? result.best.spineAxis : "none";

  const availableX = safeSheetMargin;
  const availableY = safeSheetMargin;
  const availableWidth = Math.max(safeSheetWidth - safeSheetMargin * 2, 0);
  const availableHeight = Math.max(
    safeSheetHeight - safeSheetMargin - safeGripperMargin,
    0,
  );

  const startX =
    availableX + Math.max((availableWidth - result.best.usedWidth) / 2, 0);
  const startY =
    availableY + Math.max((availableHeight - result.best.usedHeight) / 2, 0);

  const positions: { key: string; row: number; column: number; x: number; y: number }[] = [];

  for (let row = 0; row < result.best.rows; row += 1) {
    for (let column = 0; column < result.best.columns; column += 1) {
      positions.push({
        key: row + "-" + column,
        row,
        column,
        x:
          startX +
          column * productWidthWithBleed +
          (noSpineBleed && spineAxis === "vertical"
            ? Math.floor(column / 2)
            : column) * safeGutterVertical,
        y:
          startY +
          row * productHeightWithBleed +
          (noSpineBleed && spineAxis === "horizontal"
            ? Math.floor(row / 2)
            : row) * safeGutterHorizontal,
      });
    }
  }

  const verticalGutters = noSpineBleed && spineAxis === "vertical"
    ? Array.from({ length: Math.floor(Math.max(result.best.columns - 1, 0) / 2) }, (_, index) => {
        const x = startX + (index + 1) * 2 * productWidthWithBleed + index * safeGutterVertical;

        return {
          key: `v-${index}`,
          x,
          y: startY,
          width: safeGutterVertical,
          height: result.best.usedHeight,
        };
      })
    : Array.from(
        { length: Math.max(result.best.columns - 1, 0) },
        (_, index) => {
          const x =
            startX +
            (index + 1) * productWidthWithBleed +
            index * safeGutterVertical;

          return {
            key: `v-${index}`,
            x,
            y: startY,
            width: safeGutterVertical,
            height: result.best.usedHeight,
          };
        },
      );

  const horizontalGutters = noSpineBleed && spineAxis === "horizontal"
    ? Array.from({ length: Math.floor(Math.max(result.best.rows - 1, 0) / 2) }, (_, index) => {
        const y = startY + (index + 1) * 2 * productHeightWithBleed + index * safeGutterHorizontal;

        return {
          key: `h-${index}`,
          x: startX,
          y,
          width: result.best.usedWidth,
          height: safeGutterHorizontal,
        };
      })
    : Array.from(
        { length: Math.max(result.best.rows - 1, 0) },
        (_, index) => {
          const y =
            startY +
            (index + 1) * productHeightWithBleed +
            index * safeGutterHorizontal;

          return {
            key: `h-${index}`,
            x: startX,
            y,
            width: result.best.usedWidth,
            height: safeGutterHorizontal,
          };
        },
      );

  const verticalSpineCutLines = noSpineBleed && spineAxis === "vertical"
    ? Array.from({ length: Math.floor(result.best.columns / 2) }, (_, index) => {
        const x = startX + (index * 2 + 1) * productWidthWithBleed + index * safeGutterVertical;

        return {
          key: `spine-v-${index}`,
          x,
          y: startY,
          height: result.best.usedHeight,
        };
      })
    : [];

  const horizontalSpineCutLines = noSpineBleed && spineAxis === "horizontal"
    ? Array.from({ length: Math.floor(result.best.rows / 2) }, (_, index) => {
        const y = startY + (index * 2 + 1) * productHeightWithBleed + index * safeGutterHorizontal;

        return {
          key: `spine-h-${index}`,
          x: startX,
          y,
          width: result.best.usedWidth,
        };
      })
    : [];

  function getInnerBox(position: { row: number; column: number; x: number; y: number }) {
    const outerX = position.x;
    const outerY = position.y;

    if (noSpineBleed && spineAxis === "horizontal") {
      const isTopOfPair = position.row % 2 === 0;

      return {
        x: outerX + safeBleed,
        y: outerY + (isTopOfPair ? safeBleed : 0),
        width: finalWidth,
        height: finalHeight,
      };
    }

    if (noSpineBleed && spineAxis === "vertical") {
      const isLeftOfPair = position.column % 2 === 0;

      return {
        x: outerX + (isLeftOfPair ? safeBleed : 0),
        y: outerY + safeBleed,
        width: finalWidth,
        height: finalHeight,
      };
    }

    return {
      x: outerX + safeBleed,
      y: outerY + safeBleed,
      width: finalWidth,
      height: finalHeight,
    };
  }

  function getBleedRects(position: { row: number; column: number; x: number; y: number }) {
    const outerX = position.x;
    const outerY = position.y;
    const outerWidth = productWidthWithBleed;
    const outerHeight = productHeightWithBleed;

    if (safeBleed <= 0) return [];

    if (noSpineBleed && spineAxis === "horizontal") {
      const isTopOfPair = position.row % 2 === 0;

      return [
        ...(isTopOfPair
          ? [
              {
                key: "top",
                x: outerX,
                y: outerY,
                width: outerWidth,
                height: safeBleed,
              },
            ]
          : [
              {
                key: "bottom",
                x: outerX,
                y: outerY + finalHeight,
                width: outerWidth,
                height: safeBleed,
              },
            ]),
        {
          key: "left",
          x: outerX,
          y: outerY,
          width: safeBleed,
          height: outerHeight,
        },
        {
          key: "right",
          x: outerX + outerWidth - safeBleed,
          y: outerY,
          width: safeBleed,
          height: outerHeight,
        },
      ];
    }

    if (noSpineBleed && spineAxis === "vertical") {
      const isLeftOfPair = position.column % 2 === 0;

      return [
        ...(isLeftOfPair
          ? [
              {
                key: "left",
                x: outerX,
                y: outerY,
                width: safeBleed,
                height: outerHeight,
              },
            ]
          : [
              {
                key: "right",
                x: outerX + finalWidth,
                y: outerY,
                width: safeBleed,
                height: outerHeight,
              },
            ]),
        {
          key: "top",
          x: outerX,
          y: outerY,
          width: outerWidth,
          height: safeBleed,
        },
        {
          key: "bottom",
          x: outerX,
          y: outerY + outerHeight - safeBleed,
          width: outerWidth,
          height: safeBleed,
        },
      ];
    }

    return [
      {
        key: "top",
        x: outerX,
        y: outerY,
        width: outerWidth,
        height: safeBleed,
      },
      {
        key: "bottom",
        x: outerX,
        y: outerY + outerHeight - safeBleed,
        width: outerWidth,
        height: safeBleed,
      },
      {
        key: "left",
        x: outerX,
        y: outerY,
        width: safeBleed,
        height: outerHeight,
      },
      {
        key: "right",
        x: outerX + outerWidth - safeBleed,
        y: outerY,
        width: safeBleed,
        height: outerHeight,
      },
    ];
  }

  return (
    <div className="mt-5 rounded-none border border-slate-300 bg-white p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
            Grafische Bogenvorschau
          </p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
            Maßstäblich vereinfachte Vorschau: Gelb ist Beschnitt, Weiß ist
            Endformat. Im Broschürenmodus wird die offene Doppelseite mit Bundlinie
            dargestellt; Beschnitt liegt nur außen.
          </p>
        </div>

        <div className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm">
          {result.best.columns} × {result.best.rows} · {result.best.orientation}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <svg
          width={previewWidth}
          height={previewHeight}
          viewBox={"0 0 " + previewWidth + " " + previewHeight}
          className="max-w-full rounded-none bg-white shadow-md"
          role="img"
          aria-label="Bogenvorschau"
        >
          <rect
            x="0"
            y="0"
            width={previewWidth}
            height={previewHeight}
            fill="#ffffff"
            stroke="#0f172a"
            strokeWidth="2.5"
          />

          <rect
            x={safeSheetMargin * scale}
            y={safeSheetMargin * scale}
            width={availableWidth * scale}
            height={availableHeight * scale}
            fill="#e0f2fe"
            stroke="#0284c7"
            strokeWidth="2"
            strokeDasharray="6 5"
          />

          {verticalGutters.map((gutter) => {
            const x = gutter.x * scale;
            const y = gutter.y * scale;
            const height = gutter.height * scale;

            if (safeGutterVertical <= 0) {
              return (
                <line
                  key={gutter.key}
                  x1={x}
                  y1={y}
                  x2={x}
                  y2={y + height}
                  stroke="#e11d48"
                  strokeWidth="2.6"
                  strokeDasharray="5 4"
                />
              );
            }

            return (
              <rect
                key={gutter.key}
                x={x}
                y={y}
                width={Math.max(gutter.width * scale, 1)}
                height={height}
                fill="#f9a8d4"
                stroke="#db2777"
                strokeWidth="1"
              />
            );
          })}

          {horizontalGutters.map((gutter) => {
            const x = gutter.x * scale;
            const y = gutter.y * scale;
            const width = gutter.width * scale;

            if (safeGutterHorizontal <= 0) {
              return (
                <line
                  key={gutter.key}
                  x1={x}
                  y1={y}
                  x2={x + width}
                  y2={y}
                  stroke="#e11d48"
                  strokeWidth="2.6"
                  strokeDasharray="5 4"
                />
              );
            }

            return (
              <rect
                key={gutter.key}
                x={x}
                y={y}
                width={width}
                height={Math.max(gutter.height * scale, 1)}
                fill="#f9a8d4"
                stroke="#db2777"
                strokeWidth="1"
              />
            );
          })}

          {positions.map((position, index) => {
            const outerX = position.x * scale;
            const outerY = position.y * scale;
            const outerWidth = productWidthWithBleed * scale;
            const outerHeight = productHeightWithBleed * scale;
            const innerBox = getInnerBox(position);

            return (
              <g key={position.key}>
                {getBleedRects(position).map((bleedRect) => (
                  <rect
                    key={`${position.key}-${bleedRect.key}`}
                    x={bleedRect.x * scale}
                    y={bleedRect.y * scale}
                    width={Math.max(bleedRect.width * scale, 0.5)}
                    height={Math.max(bleedRect.height * scale, 0.5)}
                    fill="#fef3c7"
                    stroke="none"
                    strokeWidth="0"
                  />
                ))}
                <rect
                  x={innerBox.x * scale}
                  y={innerBox.y * scale}
                  width={innerBox.width * scale}
                  height={innerBox.height * scale}
                  fill="#ffffff"
                  stroke="#111827"
                  strokeWidth="1.7"
                />
                {spreadMode && (
                  <line
                    x1={(innerBox.x + innerBox.width / 2) * scale}
                    y1={innerBox.y * scale}
                    x2={(innerBox.x + innerBox.width / 2) * scale}
                    y2={(innerBox.y + innerBox.height) * scale}
                    stroke="#111827"
                    strokeWidth="2"
                  />
                )}
                <text
                  x={outerX + outerWidth / 2}
                  y={outerY + outerHeight / 2 + 3}
                  textAnchor="middle"
                  fill="#111827"
                  className="text-[10px] font-black"
                >
                  {index + 1}
                </text>
              </g>
            );
          })}

          {verticalSpineCutLines.map((line) => {
            const x = line.x * scale;
            const y = line.y * scale;
            const height = line.height * scale;

            return (
              <rect
                key={`${line.key}-clean`}
                x={x - 2}
                y={y}
                width={4}
                height={height}
                fill="#ffffff"
              />
            );
          })}

          {horizontalSpineCutLines.map((line) => {
            const x = line.x * scale;
            const y = line.y * scale;
            const width = line.width * scale;

            return (
              <rect
                key={`${line.key}-clean`}
                x={x}
                y={y - 2}
                width={width}
                height={4}
                fill="#ffffff"
              />
            );
          })}

          {verticalSpineCutLines.map((line) => {
            const x = line.x * scale;
            const y = line.y * scale;
            const height = line.height * scale;

            return (
              <line
                key={line.key}
                x1={x}
                y1={y}
                x2={x}
                y2={y + height}
                stroke="#111827"
                strokeWidth="2.2"
              />
            );
          })}

          {horizontalSpineCutLines.map((line) => {
            const x = line.x * scale;
            const y = line.y * scale;
            const width = line.width * scale;

            return (
              <line
                key={line.key}
                x1={x}
                y1={y}
                x2={x + width}
                y2={y}
                stroke="#111827"
                strokeWidth="2.2"
              />
            );
          })}
        </svg>
      </div>

      <div className="mt-4 grid gap-3 text-sm font-bold text-slate-600 md:grid-cols-2 xl:grid-cols-4">
        <p>Gelb: Beschnittbereich</p>
        <p>Weiß: Endformat</p>
        <p>Rot/Pink: Zwischenschnitt</p>
        <p>Schwarz: Bund / Doppelseitenfalz</p>
      </div>
    </div>
  );
}

function calculateImpositionResult({
  sheetWidthMm,
  sheetHeightMm,
  finalWidthMm,
  finalHeightMm,
  bleedMm,
  removeSpineBleed,
  calculateAsOpenSpread,
  gripperMarginMm,
  sheetMarginMm,
  gutterHorizontalMm,
  gutterVerticalMm,
  allowRotation,
}: {
  sheetWidthMm: number;
  sheetHeightMm: number;
  finalWidthMm: number;
  finalHeightMm: number;
  bleedMm: number;
  removeSpineBleed: boolean;
  calculateAsOpenSpread: boolean;
  gripperMarginMm: number;
  sheetMarginMm: number;
  gutterHorizontalMm: number;
  gutterVerticalMm: number;
  allowRotation: boolean;
}) {
  const safeSheetWidth = Math.max(Number(sheetWidthMm) || 0, 0);
  const safeSheetHeight = Math.max(Number(sheetHeightMm) || 0, 0);
  const safeFinalWidth = Math.max(Number(finalWidthMm) || 0, 1);
  const safeFinalHeight = Math.max(Number(finalHeightMm) || 0, 1);
  const safeBleed = Math.max(Number(bleedMm) || 0, 0);
  const spreadMode = Boolean(calculateAsOpenSpread);
  const noSpineBleed = Boolean(removeSpineBleed) && !spreadMode;
  const calculationFinalWidth = spreadMode ? safeFinalWidth * 2 : safeFinalWidth;
  const calculationFinalHeight = safeFinalHeight;
  const safeSheetMargin = 0;
  const safeGripperMargin = 0;
  const availableWidth = Math.max(safeSheetWidth - safeSheetMargin * 2, 0);
  const availableHeight = Math.max(
    safeSheetHeight - safeSheetMargin - safeGripperMargin,
    0,
  );

  const safeGutterHorizontal = Math.max(Number(gutterHorizontalMm) || 0, 0);
  const safeGutterVertical = Math.max(Number(gutterVerticalMm) || 0, 0);

  function calculateCount(available: number, item: number, gutter: number) {
    if (available <= 0 || item <= 0) return 0;

    return Math.max(Math.floor((available + gutter) / (item + gutter)), 0);
  }

  function calculateCountWithSpinePairs(available: number, item: number, gutter: number) {
    if (available <= 0 || item <= 0) return 0;

    let count = 0;

    while (true) {
      const nextCount = count + 1;
      const realGutters = Math.floor(Math.max(nextCount - 1, 0) / 2);
      const usedSize = nextCount * item + realGutters * gutter;

      if (usedSize > available) break;
      count = nextCount;
    }

    return count;
  }

  function buildResult({
    baseWidth,
    baseHeight,
    orientation,
    spineAxis,
  }: {
    baseWidth: number;
    baseHeight: number;
    orientation: string;
    spineAxis: "vertical" | "horizontal" | "none" | "spread";
  }) {
    const itemWidth =
      noSpineBleed && spineAxis === "vertical"
        ? baseWidth + safeBleed
        : baseWidth + safeBleed * 2;
    const itemHeight =
      noSpineBleed && spineAxis === "horizontal"
        ? baseHeight + safeBleed
        : baseHeight + safeBleed * 2;

    const columns =
      noSpineBleed && spineAxis === "vertical"
        ? calculateCountWithSpinePairs(availableWidth, itemWidth, safeGutterVertical)
        : calculateCount(availableWidth, itemWidth, safeGutterVertical);
    const rows =
      noSpineBleed && spineAxis === "horizontal"
        ? calculateCountWithSpinePairs(availableHeight, itemHeight, safeGutterHorizontal)
        : calculateCount(availableHeight, itemHeight, safeGutterHorizontal);
    const total = columns * rows;
    const verticalGapCount =
      noSpineBleed && spineAxis === "vertical"
        ? Math.floor(Math.max(columns - 1, 0) / 2)
        : Math.max(columns - 1, 0);
    const horizontalGapCount =
      noSpineBleed && spineAxis === "horizontal"
        ? Math.floor(Math.max(rows - 1, 0) / 2)
        : Math.max(rows - 1, 0);
    const usedWidth = columns > 0 ? columns * itemWidth + verticalGapCount * safeGutterVertical : 0;
    const usedHeight = rows > 0 ? rows * itemHeight + horizontalGapCount * safeGutterHorizontal : 0;
    const usedArea = usedWidth * usedHeight;
    const availableArea = Math.max(availableWidth * availableHeight, 1);
    const wastePercent =
      total > 0 ? Math.max(100 - (usedArea / availableArea) * 100, 0) : 100;

    return {
      columns,
      rows,
      total,
      orientation,
      spineAxis,
      itemWidth,
      itemHeight,
      usedWidth,
      usedHeight,
      wastePercent,
    };
  }

  function pickBetterResult<T extends ReturnType<typeof buildResult>>(first: T, second: T) {
    if (second.total > first.total) return second;
    if (second.total === first.total && second.wastePercent < first.wastePercent) return second;

    return first;
  }

  function calculateOrientation(
    baseWidth: number,
    baseHeight: number,
    orientation: string,
  ) {
    if (spreadMode) {
      return buildResult({
        baseWidth,
        baseHeight,
        orientation,
        spineAxis: "spread",
      });
    }

    if (!noSpineBleed) {
      return buildResult({
        baseWidth,
        baseHeight,
        orientation,
        spineAxis: "none",
      });
    }

    const verticalSpine = buildResult({
      baseWidth,
      baseHeight,
      orientation,
      spineAxis: "vertical",
    });
    const horizontalSpine = buildResult({
      baseWidth,
      baseHeight,
      orientation,
      spineAxis: "horizontal",
    });

    // Wichtig für Broschüren: Eine Bundkante existiert nur dann wirklich,
    // wenn zwei Nutzen direkt nebeneinander bzw. untereinander liegen können.
    // Bei 1 Spalte darf die App keinen vertikalen Bund annehmen, weil sonst
    // oben/unten weiterhin Beschnitt im echten Bund angezeigt wird.
    const verticalHasRealSpine = verticalSpine.columns >= 2;
    const horizontalHasRealSpine = horizontalSpine.rows >= 2;

    if (verticalHasRealSpine && !horizontalHasRealSpine) return verticalSpine;
    if (horizontalHasRealSpine && !verticalHasRealSpine) return horizontalSpine;

    if (verticalHasRealSpine && horizontalHasRealSpine) {
      return pickBetterResult(verticalSpine, horizontalSpine);
    }

    return pickBetterResult(verticalSpine, horizontalSpine);
  }

  const normal = calculateOrientation(
    calculationFinalWidth,
    calculationFinalHeight,
    "normal",
  );
  const rotated = allowRotation
    ? calculateOrientation(
        calculationFinalHeight,
        calculationFinalWidth,
        "gedreht",
      )
    : {
        columns: 0,
        rows: 0,
        total: 0,
        orientation: "nicht erlaubt",
        spineAxis: "none" as const,
        itemWidth: calculationFinalHeight + safeBleed * 2,
        itemHeight: calculationFinalWidth + safeBleed * 2,
        usedWidth: 0,
        usedHeight: 0,
        wastePercent: 100,
      };

  const best = rotated.total > normal.total ? rotated : normal;

  return {
    productWidthWithBleed: best.itemWidth,
    productHeightWithBleed: best.itemHeight,
    openFinalWidthMm: calculationFinalWidth,
    openFinalHeightMm: calculationFinalHeight,
    calculateAsOpenSpread: spreadMode,
    availableWidth,
    availableHeight,
    gutterHorizontalMm: safeGutterHorizontal,
    gutterVerticalMm: safeGutterVertical,
    normal,
    rotated,
    best,
  };
}

function getSpineAxisLabel(axis: string) {
  if (axis === "spread") return "offene Doppelseite";
  if (axis === "horizontal") return "horizontal";
  if (axis === "vertical") return "vertikal";
  return "keine Bundlogik";
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysIso(dateIso: string, days: number) {
  const baseDate = dateIso ? new Date(`${dateIso}T00:00:00`) : new Date();

  if (Number.isNaN(baseDate.getTime())) {
    return todayIso();
  }

  baseDate.setDate(baseDate.getDate() + days);

  return baseDate.toISOString().slice(0, 10);
}

function formatDateGerman(dateIso: string) {
  if (!dateIso) {
    return "";
  }

  const date = new Date(`T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateIso;
  }

  return date.toLocaleDateString("de-DE");
}

function getInvoiceOverdueDays(
  dueDate: string | undefined,
  openAmount: number,
) {
  if (!dueDate || openAmount <= 0) {
    return 0;
  }

  const due = new Date(`${dueDate}T00:00:00`);
  const today = new Date(`${todayIso()}T00:00:00`);

  if (
    Number.isNaN(due.getTime()) ||
    Number.isNaN(today.getTime()) ||
    due >= today
  ) {
    return 0;
  }

  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  return Math.floor((today.getTime() - due.getTime()) / millisecondsPerDay);
}

function getPaymentStatusClasses(status?: PaymentStatus) {
  if (status === "Bezahlt") {
    return {
      panel: "bg-emerald-50",
      label: "text-emerald-700",
      text: "text-emerald-900",
      badge: "bg-emerald-100 text-emerald-700",
    };
  }

  if (status === "Teilbezahlt") {
    return {
      panel: "bg-sky-50",
      label: "text-sky-700",
      text: "text-sky-900",
      badge: "bg-sky-100 text-sky-700",
    };
  }

  if (status === "Überfällig") {
    return {
      panel: "bg-rose-50",
      label: "text-rose-700",
      text: "text-rose-900",
      badge: "bg-rose-100 text-rose-700",
    };
  }

  if (status === "Storniert") {
    return {
      panel: "bg-slate-100",
      label: "text-slate-600",
      text: "text-slate-700",
      badge: "bg-slate-200 text-slate-700",
    };
  }

  return {
    panel: "bg-amber-50",
    label: "text-amber-700",
    text: "text-amber-900",
    badge: "bg-amber-100 text-amber-700",
  };
}

function getOpenAmountClasses(openAmount: number) {
  return openAmount > 0
    ? "bg-rose-100 text-rose-700"
    : "bg-emerald-100 text-emerald-700";
}

function getResolvedPaymentStatusForCurrentInvoice(
  status: PaymentStatus,
  dueDate: string,
  openAmount: number,
): PaymentStatus {
  if (status === "Bezahlt" || status === "Storniert") {
    return status;
  }

  if (dueDate && dueDate < todayIso() && openAmount > 0) {
    return "Überfällig";
  }

  return status;
}

function getInvoicePaymentHint(
  status: PaymentStatus,
  dueDate: string,
  openAmount: number,
) {
  if (status === "Bezahlt") {
    return "Diese Rechnung ist vollständig bezahlt.";
  }

  if (status === "Storniert") {
    return "Diese Rechnung wurde storniert.";
  }

  const overdueDays = getInvoiceOverdueDays(dueDate, openAmount);

  if (overdueDays > 0) {
    return `Diese Rechnung ist seit ${overdueDays} ${overdueDays === 1 ? "Tag" : "Tagen"} überfällig.`;
  }

  if (status === "Teilbezahlt") {
    return "Diese Rechnung ist teilweise bezahlt.";
  }

  return "Diese Rechnung ist noch offen.";
}

function getInvoiceOpenAmount(documentItem: SavedDocument) {
  const totals = calculateDocumentTotals(documentItem.positions);
  const paidAmount = Math.max(Number(documentItem.paymentPaidAmount) || 0, 0);

  return Math.max(totals.grossTotal - paidAmount, 0);
}

function getResolvedPaymentStatus(
  documentItem: SavedDocument,
): PaymentStatus | undefined {
  if (documentItem.documentType !== "invoice") {
    return undefined;
  }

  const storedStatus = documentItem.paymentStatus ?? "Offen";
  const openAmount = getInvoiceOpenAmount(documentItem);

  if (storedStatus === "Bezahlt" || storedStatus === "Storniert") {
    return storedStatus;
  }

  if (
    documentItem.paymentDueDate &&
    documentItem.paymentDueDate < todayIso() &&
    openAmount > 0
  ) {
    return "Überfällig";
  }

  return storedStatus;
}

function getPositionVatRate(position: Partial<QuotePosition>) {
  const vatRate = Number(position.vatRate);

  return Number.isFinite(vatRate) ? Math.max(vatRate, 0) : 19;
}

function calculatePositionNetTotal(
  position: Pick<QuotePosition, "quantity" | "unitPrice">,
) {
  return (
    Math.max(Number(position.quantity) || 0, 0) *
    Math.max(Number(position.unitPrice) || 0, 0)
  );
}

function normalizeQuotePositions(
  positions: Partial<QuotePosition>[],
): QuotePosition[] {
  return positions.map((position) => ({
    id: position.id ?? createLocalId(),
    title: position.title ?? "Position",
    description: position.description ?? "",
    quantity: Math.max(Number(position.quantity) || 0, 0),
    unitPrice: Math.max(Number(position.unitPrice) || 0, 0),
    vatRate: getPositionVatRate(position),
    internalNote: position.internalNote ?? "",
  }));
}

function calculateDocumentTotals(positions: Partial<QuotePosition>[]) {
  const vatMap = new Map<
    number,
    { rate: number; net: number; amount: number }
  >();

  const netTotal = positions.reduce((sum, position) => {
    const positionTotal = calculatePositionNetTotal({
      quantity: Number(position.quantity) || 0,
      unitPrice: Number(position.unitPrice) || 0,
    });
    const vatRate = getPositionVatRate(position);
    const vatAmount = positionTotal * (vatRate / 100);
    const currentVat = vatMap.get(vatRate) ?? {
      rate: vatRate,
      net: 0,
      amount: 0,
    };

    currentVat.net += positionTotal;
    currentVat.amount += vatAmount;
    vatMap.set(vatRate, currentVat);

    return sum + positionTotal;
  }, 0);

  const vatTotals = Array.from(vatMap.values())
    .filter((item) => item.net > 0 || item.amount > 0)
    .sort((a, b) => a.rate - b.rate);

  const vatTotal = vatTotals.reduce((sum, item) => sum + item.amount, 0);

  return {
    netTotal,
    vatTotals,
    vatTotal,
    grossTotal: netTotal + vatTotal,
  };
}

function createNextCustomerNumber(customers: Customer[]) {
  const highestNumber = customers.reduce((highest, customer) => {
    const match = customer.customerNumber.match(/(\d+)$/);

    if (!match) {
      return highest;
    }

    return Math.max(highest, Number(match[1]));
  }, 10000);

  return `KD-${highestNumber + 1}`;
}

function createLocalId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default App;
