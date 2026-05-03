import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, Dispatch, SetStateAction } from "react";
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

type PrintPartType =
  | "Inhalt"
  | "Umschlag"
  | "Beileger"
  | "Zusatzbogen"
  | "Zusatzmaterial"
  | "Sonstiges";

type PrintSideMode = "simplex" | "duplex" | "materialOnly";

type MaterialSelection = {
  id: string;
  label: string;
  partType?: PrintPartType;
  materialId: string;
  calculationMode: MaterialCalculationMode;
  manualSheets: number;
  factorPerCopy: number;
  pages: number;
  pagesPerSheet: number;
  itemsPerSheet: number;
  frontColorMode?: string;
  backColorMode?: string;
  printSideMode?: PrintSideMode;
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
  customerContactPerson?: string;
  customerStreet?: string;
  customerZip?: string;
  customerCity?: string;
  customerEmail?: string;
  customerPhone?: string;
  date: string;
  validUntil: string;
  subject?: string;
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

type CompanyProfile = typeof companyProfile & {
  logoDataUrl?: string;
  accountHolder?: string;
  showCompanyAddressOnDocuments?: boolean;
  showCompanyContactOnDocuments?: boolean;
  showTaxDataOnDocuments?: boolean;
  showBankDataOnDocuments?: boolean;
  showCompanyFooterOnDocuments?: boolean;
  documentFooterPlacement?: "content" | "letterheadBar";
  documentFooterColumns?: "2" | "3";
  documentFooterBottomMm?: number;
  documentFooterHeightMm?: number;
  documentFooterTextTone?: "dark" | "white";
};

type DocumentType =
  | "quote"
  | "orderConfirmation"
  | "invoice"
  | "deliveryNote"
  | "reminder";

type LetterheadMode = "none" | "demo" | "upload";

type DocumentTemplate = {
  label: string;
  topMm: number;
  bottomMm: number;
  leftMm: number;
  rightMm: number;
  introText: string;
  footerText: string;
  letterheadMode: LetterheadMode;
  letterheadDataUrl: string;
  letterheadOpacity: number;
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
    topMm: 45,
    bottomMm: 32,
    leftMm: 20,
    rightMm: 20,
    introText:
      "vielen Dank für Ihre Anfrage. Gerne bieten wir Ihnen folgende Druckproduktion an.",
    footerText:
      "Lieferung nach Absprache. Preise verstehen sich netto zuzüglich gesetzlicher Mehrwertsteuer.",
    letterheadMode: "none",
    letterheadDataUrl: "",
    letterheadOpacity: 100,
  },
  orderConfirmation: {
    label: "Auftragsbestätigung",
    topMm: 45,
    bottomMm: 32,
    leftMm: 20,
    rightMm: 20,
    introText:
      "vielen Dank für Ihren Auftrag. Gerne bestätigen wir Ihnen die folgende Druckproduktion.",
    footerText:
      "Produktion und Lieferung erfolgen nach Absprache. Änderungen nach Freigabe können Mehrkosten verursachen.",
    letterheadMode: "none",
    letterheadDataUrl: "",
    letterheadOpacity: 100,
  },
  invoice: {
    label: "Rechnung",
    topMm: 45,
    bottomMm: 32,
    leftMm: 20,
    rightMm: 20,
    introText: "für die erbrachten Leistungen berechnen wir Ihnen wie folgt.",
    footerText:
      "Bitte überweisen Sie den Rechnungsbetrag innerhalb der angegebenen Zahlungsfrist.",
    letterheadMode: "none",
    letterheadDataUrl: "",
    letterheadOpacity: 100,
  },
  deliveryNote: {
    label: "Lieferschein",
    topMm: 45,
    bottomMm: 32,
    leftMm: 20,
    rightMm: 20,
    introText: "wir liefern Ihnen folgende Positionen.",
    footerText: "Die Lieferung erfolgt gemäß Vereinbarung.",
    letterheadMode: "none",
    letterheadDataUrl: "",
    letterheadOpacity: 100,
  },
  reminder: {
    label: "Mahnung",
    topMm: 45,
    bottomMm: 32,
    leftMm: 20,
    rightMm: 20,
    introText:
      "leider konnten wir zu der unten aufgeführten Rechnung noch keinen Zahlungseingang feststellen.",
    footerText:
      "Sollte sich Ihre Zahlung mit diesem Schreiben überschnitten haben, betrachten Sie diese Mahnung bitte als gegenstandslos.",
    letterheadMode: "none",
    letterheadDataUrl: "",
    letterheadOpacity: 100,
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


const PRINT_PART_TYPE_OPTIONS: { value: PrintPartType; label: string }[] = [
  { value: "Inhalt", label: "Inhalt" },
  { value: "Umschlag", label: "Umschlag" },
  { value: "Beileger", label: "Beileger" },
  { value: "Zusatzbogen", label: "Zusatzbogen" },
  { value: "Zusatzmaterial", label: "Zusatzmaterial" },
  { value: "Sonstiges", label: "Sonstiges" },
];

const PRINT_SIDE_MODE_OPTIONS: { value: PrintSideMode; label: string }[] = [
  { value: "duplex", label: "beidseitig" },
  { value: "simplex", label: "einseitig" },
  { value: "materialOnly", label: "nur Material" },
];

const PRINT_PART_COLOR_MODE_OPTIONS = [
  { value: "4-farbig", label: "4-farbig" },
  { value: "schwarz", label: "schwarz" },
  { value: "Sonderfarbe", label: "Sonderfarbe" },
  { value: "unbedruckt", label: "unbedruckt" },
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

function normalizeCompanyProfile(savedProfile?: Partial<CompanyProfile>): CompanyProfile {
  return {
    ...companyProfile,
    accountHolder: companyProfile.name,
    showCompanyAddressOnDocuments: false,
    showCompanyContactOnDocuments: false,
    showTaxDataOnDocuments: false,
    showBankDataOnDocuments: false,
    showCompanyFooterOnDocuments: false,
    documentFooterPlacement: "letterheadBar",
    documentFooterColumns: "3",
    documentFooterBottomMm: -6,
    documentFooterHeightMm: 20,
    documentFooterTextTone: "white",
    ...savedProfile,
  };
}

function App() {
  const [activePage, setActivePage] = useState<PageKey>("dashboard");
  const [editableCompanyProfile, setEditableCompanyProfile] =
    useState<CompanyProfile>(() => {
      try {
        const savedProfile = window.localStorage.getItem(
          COMPANY_PROFILE_STORAGE_KEY,
        );

        if (!savedProfile) {
          return normalizeCompanyProfile();
        }

        return normalizeCompanyProfile(JSON.parse(savedProfile));
      } catch {
        return normalizeCompanyProfile();
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
    const transferredPosition: QuotePosition = {
      id: createLocalId(),
      ...position,
    };

    setQuotePositions((current) => {
      const onlyDefaultDemoPosition =
        current.length === 1 &&
        current[0].title === "Broschüre A4" &&
        current[0].quantity === 1000 &&
        current[0].unitPrice === 2.45 &&
        !current[0].internalNote;

      return onlyDefaultDemoPosition
        ? [transferredPosition]
        : [transferredPosition, ...current];
    });
    setActivePage("quotes");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&display=swap");

        :root, body, button, input, select, textarea {
          font-family: "Barlow", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .font-black, .font-extrabold {
          font-weight: 600 !important;
        }

        .font-bold {
          font-weight: 500 !important;
        }
      `}</style>
      <div className="fixed right-4 top-4 z-[9999] rounded-full bg-emerald-500 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-emerald-500/30">
        V141 aktiv
      </div>
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
              <p className="text-sm font-black">PrintPilot V141</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Stammdaten sind kompakt organisiert und können gesichert werden.
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
                customers={customers}
                setCustomers={setCustomers}
                serviceItems={serviceItems}
                setServiceItems={setServiceItems}
                savedDocuments={savedDocuments}
                setSavedDocuments={setSavedDocuments}
                machines={editableMachines}
                setMachines={setEditableMachines}
                materials={editableMaterials}
                setMaterials={setEditableMaterials}
                finishingOperations={editableFinishingOperations}
                setFinishingOperations={setEditableFinishingOperations}
                productTypes={productTypes}
                setProductTypes={setProductTypes}
                calculationTemplates={calculationTemplates}
                setCalculationTemplates={setCalculationTemplates}
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
      partType: "Inhalt",
      frontColorMode: "4-farbig",
      backColorMode: "4-farbig",
      printSideMode: "duplex",
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
      partType: "Umschlag",
      frontColorMode: "4-farbig",
      backColorMode: "4-farbig",
      printSideMode: "duplex",
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
  const rotatedWouldBeBetter = impositionResult.rotated.total > impositionResult.normal.total;
  const selectedBecause =
    impositionResult.best.total <= 0
      ? "Kein Nutzen möglich – Format, Beschnitt oder Rohbogen prüfen."
      : impositionResult.best.orientation === "gedreht"
        ? "Gedrehte Lage bringt den besten Nutzen auf dem Rohbogen."
        : rotatedWouldBeBetter && !allowRotation
          ? "Drehung ist gesperrt – normaler Nutzen wird verwendet."
          : "Normale Lage ist fachlich ausreichend oder gleichwertig."
  const impositionQuality =
    impositionResult.best.total <= 0
      ? "Fehler"
      : !allowRotation && rotatedWouldBeBetter
        ? "Prüfen"
        : impositionResult.best.wastePercent > 45
          ? "Prüfen"
          : "OK";
  const impositionQualityClass =
    impositionQuality === "OK"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : impositionQuality === "Fehler"
        ? "bg-rose-50 text-rose-700 ring-rose-200"
        : "bg-amber-50 text-amber-700 ring-amber-200";

  const brochurePagesPerRawSheet =
    productType === "Broschüre" && calculateAsOpenSpread
      ? Math.max(impositionResult.best.total * 4, 1)
      : 0;

  const getAutomaticPagesPerSheet = (selection: MaterialSelection) => {
    if (selection.calculationMode !== "pages") {
      return Math.max(selection.pagesPerSheet, 1);
    }

    const isBrochurePageMaterial =
      productType === "Broschüre" &&
      calculateAsOpenSpread &&
      ["inhalt", "umschlag"].some((label) =>
        selection.label.toLowerCase().includes(label),
      );

    if (isBrochurePageMaterial) {
      return Math.max(brochurePagesPerRawSheet, 1);
    }

    const printedSides =
      selection.printSideMode === "simplex"
        ? 1
        : selection.printSideMode === "materialOnly"
          ? 1
          : 2;

    return Math.max(safeItemsPerSheet * printedSides, 1);
  };

  const baseMaterialItems = materialSelections.map((selection) => {
    const material =
      materials.find((item) => item.id === selection.materialId) ??
      materials[0];
    const automaticPagesPerSheet = getAutomaticPagesPerSheet(selection);
    const normalizedSelection = {
      ...selection,
      pagesPerSheet: automaticPagesPerSheet,
    };

    const calculatedSheets = calculateMaterialSheets(
      normalizedSelection,
      safeQuantity,
    );
    const pricePerSheet = calculateMaterialPricePerSheet(material);

    return {
      ...normalizedSelection,
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
  const activeFinishingNames = selectedFinishingItems
    .map((item) => item.operation.name)
    .join(" · ");
  const hasCuttingFinishing = selectedFinishingItems.some((item) =>
    item.operation.name.toLowerCase().includes("schneid"),
  );
  const hasStitchingFinishing = selectedFinishingItems.some((item) => {
    const name = item.operation.name.toLowerCase();
    return name.includes("rückendraht") || name.includes("heft") || name.includes("draht");
  });
  const hasCreasingFinishing = selectedFinishingItems.some((item) =>
    item.operation.name.toLowerCase().includes("rill"),
  );
  const finishingWarnings = [
    ...(productType === "Broschüre" && !hasStitchingFinishing
      ? ["Bei Broschüren sollte eine Rückendrahtheftung oder passende Bindung gewählt sein."]
      : []),
    ...(productType === "Broschüre" && !hasCuttingFinishing
      ? ["Bei Broschüren sollte ein Schneid-/Endbeschnitt-Schritt eingeplant sein."]
      : []),
    ...(selectedFinishingItems.length === 0
      ? ["Keine Weiterverarbeitung gewählt."]
      : []),
  ];
  const finishingStatus = finishingWarnings.length > 0 ? "Prüfen" : "OK";

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

  const costBlockItems = [
    {
      title: "Material",
      subtitle: `${selectedMaterialItems.length} Druckteil${selectedMaterialItems.length === 1 ? "" : "e"}`,
      value: materialCost,
      detail: `${totalSheets.toLocaleString("de-DE")} Bg. gesamt · ${wasteSheets.toLocaleString("de-DE")} Bg. Ausschuss`,
      badge: "Papier / Substrat",
    },
    {
      title: "Druck / Maschine",
      subtitle: getMachineCostModelLabel(machineCostModel),
      value: printCost + setupCost,
      detail: `${formatCurrency(printCost)} variabel · ${formatCurrency(setupCost)} Rüstzeit`,
      badge: selectedMachine.name,
    },
    {
      title: "Weiterverarbeitung",
      subtitle: `${selectedFinishingItems.length} Vorgang${selectedFinishingItems.length === 1 ? "" : "e"}`,
      value: finishingCost,
      detail: `${formatCurrency(calculatedFinishingCost)} berechnet · ${formatCurrency(finishingExtraCost)} Zusatz`,
      badge: "Finishing",
    },
    {
      title: "Gemeinkosten",
      subtitle: `${formatNumber(overheadPercent, 1)} % auf direkte Kosten`,
      value: overheadCost,
      detail: `Direkte Kosten: ${formatCurrency(directCost)}`,
      badge: "Overhead",
    },
    {
      title: "Deckungsbeitrag",
      subtitle: `${formatNumber(marginPercent, 1)} % Marge`,
      value: profit,
      detail: `Selbstkosten: ${formatCurrency(totalCost)} · Verkauf: ${formatCurrency(sellingPrice)}`,
      badge: "Ertrag",
    },
  ];

  const productionCostTotal = Math.max(directCost, 0.01);
  const productionCostSections = [
    {
      title: "Material",
      shortTitle: "Papier",
      value: materialCost,
      percentBase: productionCostTotal,
      accentClass: "bg-orange-400",
      summary: `${selectedMaterialItems.length} Druckteil${selectedMaterialItems.length === 1 ? "" : "e"} · ${totalSheets.toLocaleString("de-DE")} Bg. inkl. Zuschuss/Ausschuss`,
      rows: [
        ...selectedMaterialItems.map((item) => ({
          label: item.label,
          value: formatCurrency(item.cost),
          note: `${item.totalMaterialSheets.toLocaleString("de-DE")} Bg. · ${formatCurrency(item.pricePerSheet)} / Bg.`,
        })),
        {
          label: "Zuschuss / Ausschuss",
          value: `${(fixedOvers + wasteSheets).toLocaleString("de-DE")} Bg.`,
          note: `${fixedOvers.toLocaleString("de-DE")} Bg. fest · ${wasteSheets.toLocaleString("de-DE")} Bg. prozentual`,
        },
      ],
    },
    {
      title: "Druck & Maschine",
      shortTitle: "Druck",
      value: printCost + setupCost,
      percentBase: productionCostTotal,
      accentClass: "bg-sky-500",
      summary: `${selectedMachine.name} · ${getMachineCostModelLabel(machineCostModel)}`,
      rows: [
        ...machineCost.rows.map((row) => ({
          label: row.label,
          value: row.value,
          note: "Maschinenmodell",
        })),
        {
          label: "Variable Maschinenkosten",
          value: formatCurrency(printCost),
          note: "Klicks / Tinte / Produktion",
        },
        {
          label: "Rüstzeit Maschine",
          value: formatCurrency(setupCost),
          note: `${formatNumber(setupMinutes, 0)} Min. · ${formatCurrency(selectedMachine.hourlyRate)} / h`,
        },
      ],
    },
    {
      title: "Weiterverarbeitung",
      shortTitle: "WV",
      value: finishingCost,
      percentBase: productionCostTotal,
      accentClass: "bg-lime-500",
      summary: `${selectedFinishingItems.length} Vorgang${selectedFinishingItems.length === 1 ? "" : "e"} · ${formatCurrency(finishingExtraCost)} Zusatzkosten`,
      rows:
        selectedFinishingItems.length > 0
          ? [
              ...selectedFinishingItems.map((item) => ({
                label: item.operation.name,
                value: formatCurrency(item.price),
                note: getPricingModeLabel(item.operation.pricingMode),
              })),
              {
                label: "Zusatzkosten",
                value: formatCurrency(finishingExtraCost),
                note: "manuell in der Kalkulation",
              },
            ]
          : [
              {
                label: "Keine Weiterverarbeitung gewählt",
                value: formatCurrency(finishingCost),
                note: "Schneiden, Falzen, Heften usw. hinzufügen",
              },
            ],
    },
  ];

  const contentMaterialItems = selectedMaterialItems.filter((item) => {
    const label = item.label.toLowerCase();
    return item.partType === "Inhalt" || label.includes("inhalt");
  });
  const coverMaterialItems = selectedMaterialItems.filter((item) => {
    const label = item.label.toLowerCase();
    return item.partType === "Umschlag" || label.includes("umschlag");
  });
  const otherMaterialItems = selectedMaterialItems.filter(
    (item) =>
      !contentMaterialItems.some((contentItem) => contentItem.id === item.id) &&
      !coverMaterialItems.some((coverItem) => coverItem.id === item.id),
  );
  const materialCostForItems = (items: typeof selectedMaterialItems) =>
    items.reduce((sum, item) => sum + item.cost, 0);
  const calculatedSheetsForItems = (items: typeof selectedMaterialItems) =>
    items.reduce((sum, item) => sum + item.calculatedSheets, 0);
  const totalCalculatedPartSheets = Math.max(
    calculatedSheetsForItems(selectedMaterialItems),
    1,
  );
  const printCostForItems = (items: typeof selectedMaterialItems) =>
    printCost * (calculatedSheetsForItems(items) / totalCalculatedPartSheets);
  const contentMaterialCost = materialCostForItems(contentMaterialItems);
  const coverMaterialCost = materialCostForItems(coverMaterialItems);
  const otherMaterialCost = materialCostForItems(otherMaterialItems);
  const contentPrintCost = printCostForItems(contentMaterialItems);
  const coverPrintCost = printCostForItems(coverMaterialItems);
  const otherPrintCost = Math.max(printCost - contentPrintCost - coverPrintCost, 0);
  const finishingOperationCost = selectedFinishingItems.reduce(
    (sum, item) => sum + item.price,
    0,
  );

  const detailedProductionCostGroups = [
    {
      title: "Material nach Druckteil",
      description: "Papierkosten getrennt nach Inhalt, Umschlag und sonstigen Druckteilen.",
      accentClass: "border-orange-200 bg-orange-50",
      rows: [
        {
          label: "Inhalt",
          value: contentMaterialCost,
          note: `${contentMaterialItems.length} Druckteil(e) · ${calculatedSheetsForItems(contentMaterialItems).toLocaleString("de-DE")} Bg.`,
        },
        {
          label: "Umschlag",
          value: coverMaterialCost,
          note: `${coverMaterialItems.length} Druckteil(e) · ${calculatedSheetsForItems(coverMaterialItems).toLocaleString("de-DE")} Bg.`,
        },
        {
          label: "Weitere Teile",
          value: otherMaterialCost,
          note: `${otherMaterialItems.length} Druckteil(e) · ${calculatedSheetsForItems(otherMaterialItems).toLocaleString("de-DE")} Bg.`,
        },
      ],
    },
    {
      title: "Druck nach Druckteil",
      description: "Variable Druckkosten rechnerisch nach Produktionsbogen auf die Druckteile verteilt.",
      accentClass: "border-sky-200 bg-sky-50",
      rows: [
        {
          label: "Inhalt",
          value: contentPrintCost,
          note: `${formatNumber((contentPrintCost / Math.max(printCost, 0.01)) * 100, 1)} % der variablen Druckkosten`,
        },
        {
          label: "Umschlag",
          value: coverPrintCost,
          note: `${formatNumber((coverPrintCost / Math.max(printCost, 0.01)) * 100, 1)} % der variablen Druckkosten`,
        },
        {
          label: "Weitere Teile",
          value: otherPrintCost,
          note: `${formatNumber((otherPrintCost / Math.max(printCost, 0.01)) * 100, 1)} % der variablen Druckkosten`,
        },
      ],
    },
    {
      title: "Rüstzeit & Maschine",
      description: "Maschinenkosten, Rüstzeit und gewähltes Kostenmodell transparent getrennt.",
      accentClass: "border-indigo-200 bg-indigo-50",
      rows: [
        {
          label: "Variable Maschinenkosten",
          value: printCost,
          note: getMachineCostModelLabel(machineCostModel),
        },
        {
          label: "Rüstzeit",
          value: setupCost,
          note: `${formatNumber(setupMinutes, 0)} Min. · ${formatCurrency(selectedMachine.hourlyRate)} / h`,
        },
        {
          label: "Produktionsbogen",
          value: 0,
          note: `${totalSheets.toLocaleString("de-DE")} Bg. für die Maschine`,
        },
      ],
    },
    {
      title: "Weiterverarbeitung",
      description: "Automatische Arbeitsschritte plus manuelle Zusatzkosten.",
      accentClass: "border-lime-200 bg-lime-50",
      rows: [
        {
          label: "Arbeitsschritte",
          value: finishingOperationCost,
          note: `${selectedFinishingItems.length} Vorgang/Vorgänge ausgewählt`,
        },
        {
          label: "Zusatzkosten",
          value: Math.max(finishingExtraCost, 0),
          note: "manuell erfasste Zusatzkosten",
        },
        {
          label: "Weiterverarbeitung gesamt",
          value: finishingCost,
          note: "fließt vollständig in die Produktionskosten ein",
        },
      ],
    },
  ];

  const priceBridgeItems = [
    {
      label: "Produktionskosten",
      value: directCost,
      note: "Material + Druck + Rüstzeit + Weiterverarbeitung",
    },
    {
      label: "Gemeinkosten",
      value: overheadCost,
      note: `${formatNumber(overheadPercent, 1)} % Zuschlag`,
    },
    {
      label: "Selbstkosten",
      value: totalCost,
      note: "interner Mindestpreis vor Marge",
    },
    {
      label: "Deckungsbeitrag",
      value: profit,
      note: `${formatNumber(marginPercent, 1)} % Marge`,
    },
    {
      label: "Verkaufspreis netto",
      value: sellingPrice,
      note: `${formatCurrency(unitPrice)} pro Stück`,
    },
  ];

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
          "Bei rückendrahtgehefteten Broschüren muss die Inhaltsseitenzahl fachlich durch 4 teilbar sein. Bitte Seitenzahl korrigieren oder Leerseiten einplanen.",
      });
    }

    if (coverPages > 0 && coverPages % 4 !== 0) {
      calculationWarnings.push({
        level: "warning",
        title: "Umschlagseiten prüfen",
        description:
          "Ein Broschürenumschlag wird in dieser Kalkulation fest mit 4 Seiten gerechnet. Klicke auf „Broschürenlogik anwenden“, um die Struktur zu reparieren.",
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

  if (selectedMaterialItems.length === 0) {
    calculationWarnings.push({
      level: "error",
      title: "Kein Material gewählt",
      description:
        "Für die Kalkulation ist kein Material aktiv. Wähle mindestens Inhalt, Umschlag oder ein anderes Druckteil aus.",
    });
  }

  if (safeQuantity <= 0) {
    calculationWarnings.push({
      level: "error",
      title: "Auflage fehlt",
      description:
        "Die Auflage muss größer als 0 sein, damit Produktionskosten, Stückpreis und Verkaufspreis belastbar berechnet werden können.",
    });
  }

  if (sellingPrice < totalCost) {
    calculationWarnings.push({
      level: "error",
      title: "Verkaufspreis unter Selbstkosten",
      description:
        "Der Verkaufspreis liegt unter den berechneten Selbstkosten. Der Auftrag wäre in dieser Einstellung nicht kostendeckend.",
    });
  }

  if (profit < 0) {
    calculationWarnings.push({
      level: "error",
      title: "Negativer Deckungsbeitrag",
      description:
        "Der Deckungsbeitrag ist negativ. Prüfe Material, Maschine, Weiterverarbeitung, Gemeinkosten und Marge.",
    });
  }

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
  const brochureWarnings =
    productType === "Broschüre"
      ? calculationWarnings.filter((warning) =>
          [
            "Broschürenmodus prüfen",
            "Inhaltsseiten nicht durch 4 teilbar",
            "Umschlagseiten prüfen",
            "Bundbeschnitt aktiv",
            "Kein Nutzen möglich",
          ].includes(warning.title),
        )
      : [];

  const criticalCalculationWarnings = calculationWarnings.filter(
    (warning) => warning.level === "error",
  );
  const normalCalculationWarnings = calculationWarnings.filter(
    (warning) => warning.level === "warning",
  );
  const infoCalculationWarnings = calculationWarnings.filter(
    (warning) => warning.level === "info",
  );
  const primaryCalculationMessage =
    criticalCalculationWarnings[0] ??
    normalCalculationWarnings[0] ??
    infoCalculationWarnings[0];
  const calculationStatusTone = hasCalculationErrors
    ? {
        label: "Prüfen",
        headline: "Kalkulation nicht freigabefähig",
        panelClass: "border-rose-200 bg-rose-50",
        textClass: "text-rose-800",
        badgeClass: "bg-rose-600 text-white",
        hint: "Bitte die roten Meldungen korrigieren, bevor daraus ein Angebot erstellt wird.",
      }
    : calculationWarningCount > 0
      ? {
          label: "Achtung",
          headline: "Kalkulation fachlich prüfen",
          panelClass: "border-amber-200 bg-amber-50",
          textClass: "text-amber-800",
          badgeClass: "bg-amber-500 text-white",
          hint: "Die Kalkulation ist möglich, sollte aber vor dem Angebot kurz kontrolliert werden.",
        }
      : calculationInfoCount > 0
        ? {
            label: "OK",
            headline: "Kalkulation plausibel",
            panelClass: "border-emerald-200 bg-emerald-50",
            textClass: "text-emerald-800",
            badgeClass: "bg-emerald-500 text-white",
            hint: "Es gibt nur Hinweise ohne direkte Sperre für die Kalkulation.",
          }
        : {
            label: "OK",
            headline: "Kalkulation freigabefähig",
            panelClass: "border-emerald-200 bg-emerald-50",
            textClass: "text-emerald-800",
            badgeClass: "bg-emerald-500 text-white",
            hint: "Die wichtigsten Plausibilitätsprüfungen sind unauffällig.",
          };

  const calculationStepOverview = [
    {
      step: "1",
      title: "Auftrag",
      subtitle: "Name & Vorlage",
      href: "#calc-step-1",
      accent: "bg-cyan-400",
      cardClass: "border-cyan-200 bg-cyan-50",
      textClass: "text-cyan-700",
      status: productName.trim().length > 0 ? "OK" : "Prüfen",
      statusClass: productName.trim().length > 0 ? "bg-emerald-500 text-white" : "bg-amber-500 text-white",
    },
    {
      step: "2",
      title: "Auflage",
      subtitle: "Menge & Nutzen",
      href: "#calc-step-2",
      accent: "bg-fuchsia-500",
      cardClass: "border-fuchsia-200 bg-fuchsia-50",
      textClass: "text-fuchsia-700",
      status: safeQuantity > 0 && safeItemsPerSheet > 0 ? "OK" : "Prüfen",
      statusClass: safeQuantity > 0 && safeItemsPerSheet > 0 ? "bg-emerald-500 text-white" : "bg-rose-600 text-white",
    },
    {
      step: "3",
      title: "Produkt",
      subtitle: "Format & Seiten",
      href: "#calc-step-3",
      accent: "bg-yellow-400",
      cardClass: "border-yellow-200 bg-yellow-50",
      textClass: "text-yellow-700",
      status: brochureWarnings.length > 0 ? "Prüfen" : "OK",
      statusClass: brochureWarnings.length > 0 ? "bg-amber-500 text-white" : "bg-emerald-500 text-white",
    },
    {
      step: "4",
      title: "Druckteile",
      subtitle: "Inhalt, Umschlag",
      href: "#calc-step-4",
      accent: "bg-emerald-400",
      cardClass: "border-emerald-200 bg-emerald-50",
      textClass: "text-emerald-700",
      status: selectedMaterialItems.length > 0 ? "OK" : "Prüfen",
      statusClass: selectedMaterialItems.length > 0 ? "bg-emerald-500 text-white" : "bg-rose-600 text-white",
    },
    {
      step: "5",
      title: "Produktion",
      subtitle: "Maschine & Druck",
      href: "#calc-step-5",
      accent: "bg-sky-500",
      cardClass: "border-sky-200 bg-sky-50",
      textClass: "text-sky-700",
      status: selectedMachine ? "OK" : "Prüfen",
      statusClass: selectedMachine ? "bg-emerald-500 text-white" : "bg-rose-600 text-white",
    },
    {
      step: "6",
      title: "Weiterverarbeitung",
      subtitle: "Finishing",
      href: "#calc-step-6",
      accent: "bg-lime-400",
      cardClass: "border-lime-200 bg-lime-50",
      textClass: "text-lime-700",
      status: finishingSelections.length > 0 ? "OK" : "Optional",
      statusClass: finishingSelections.length > 0 ? "bg-emerald-500 text-white" : "bg-slate-500 text-white",
    },
    {
      step: "7",
      title: "Preis",
      subtitle: "Zuschläge & Marge",
      href: "#calc-step-7",
      accent: "bg-violet-500",
      cardClass: "border-violet-200 bg-violet-50",
      textClass: "text-violet-700",
      status: sellingPrice >= totalCost && marginPercent >= 10 ? "OK" : "Prüfen",
      statusClass: sellingPrice >= totalCost && marginPercent >= 10 ? "bg-emerald-500 text-white" : "bg-amber-500 text-white",
    },
  ];

  const tiers = [250, 500, 1000, 2500, 5000].map((tierQuantity) => {
    const tierScaleFactor = tierQuantity / safeQuantity;

    const tierBaseMaterialItems = materialSelections.map((selection) => {
      const material =
        materials.find((item) => item.id === selection.materialId) ??
        materials[0];
      const pricePerSheet = calculateMaterialPricePerSheet(material);
      const automaticPagesPerSheet = getAutomaticPagesPerSheet(selection);
      const normalizedSelection = {
        ...selection,
        pagesPerSheet: automaticPagesPerSheet,
      };

      const calculatedSheets =
        normalizedSelection.calculationMode === "manual"
          ? Math.ceil(Math.max(normalizedSelection.manualSheets, 0) * tierScaleFactor)
          : calculateMaterialSheets(normalizedSelection, tierQuantity);

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
              partType: "Sonstiges",
              frontColorMode: "4-farbig",
              backColorMode: "4-farbig",
              printSideMode: "duplex",
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
    addPrintPart("Sonstiges");
  }

  function addPrintPart(partType: PrintPartType) {
    setMaterialSelections((current) => [
      ...current,
      withLocalMaterialId({
        label: partType === "Sonstiges" ? `Druckteil ${current.length + 1}` : partType,
        partType,
        materialId: materials[0].id,
        calculationMode: partType === "Inhalt" || partType === "Umschlag" ? "pages" : "perCopy",
        manualSheets: totalSheets,
        factorPerCopy: 1,
        pages: partType === "Inhalt" ? 16 : partType === "Umschlag" ? 4 : 1,
        pagesPerSheet: partType === "Inhalt" || partType === "Umschlag" ? 4 : 1,
        itemsPerSheet: 1,
        frontColorMode: "4-farbig",
        backColorMode: partType === "Zusatzmaterial" ? "unbedruckt" : "4-farbig",
        printSideMode: partType === "Zusatzmaterial" ? "materialOnly" : "duplex",
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

  function duplicateMaterialSelection(selectionId: string) {
    setMaterialSelections((current) => {
      const sourceIndex = current.findIndex(
        (selection) => selection.id === selectionId,
      );

      if (sourceIndex < 0) return current;

      const source = current[sourceIndex];
      const copy = withLocalMaterialId({
        label: `${source.label || `Druckteil ${sourceIndex + 1}`} Kopie`,
        partType: source.partType ?? "Sonstiges",
        materialId: source.materialId,
        calculationMode: source.calculationMode,
        manualSheets: source.manualSheets,
        factorPerCopy: source.factorPerCopy,
        pages: source.pages,
        pagesPerSheet: source.pagesPerSheet,
        itemsPerSheet: source.itemsPerSheet,
        frontColorMode: source.frontColorMode ?? "4-farbig",
        backColorMode: source.backColorMode ?? "4-farbig",
        printSideMode: source.printSideMode ?? "duplex",
      });

      return [
        ...current.slice(0, sourceIndex + 1),
        copy,
        ...current.slice(sourceIndex + 1),
      ];
    });
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
    const safeUpdates =
      labelSearch === "umschlag" ? { ...updates, pages: 4 } : updates;

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
          ...safeUpdates,
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
            partType: "Inhalt" as PrintPartType,
            calculationMode: "pages" as MaterialCalculationMode,
            frontColorMode: selection.frontColorMode ?? "4-farbig",
            backColorMode: selection.backColorMode ?? "4-farbig",
            printSideMode: selection.printSideMode ?? "duplex",
            pages: selection.pages > 0 ? selection.pages : 32,
            factorPerCopy: 1,
            itemsPerSheet: 1,
          };
        }

        if (normalizedLabel.includes("umschlag")) {
          return {
            ...selection,
            partType: "Umschlag" as PrintPartType,
            calculationMode: "pages" as MaterialCalculationMode,
            frontColorMode: selection.frontColorMode ?? "4-farbig",
            backColorMode: selection.backColorMode ?? "4-farbig",
            printSideMode: selection.printSideMode ?? "duplex",
            pages: 4,
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
            partType: "Inhalt",
            frontColorMode: "4-farbig",
            backColorMode: "4-farbig",
            printSideMode: "duplex",
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
            partType: "Umschlag",
            frontColorMode: "4-farbig",
            backColorMode: "4-farbig",
            printSideMode: "duplex",
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
        `Quelle: Kalkulation V141`,
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
                Kalkulation V141
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Produkt- und Jobstruktur
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Produktdaten, Druckteile, Nutzen, Maschine, Weiterverarbeitung und Zuschläge sind klar strukturiert; rechts bleiben Ergebnis und Status sofort sichtbar, Details sind einklappbar priorisiert.
                Erst die Pflichtdaten, danach die Produktionsdetails, Details nur dort wo sie gebraucht werden.
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

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_23rem] 2xl:grid-cols-[minmax(0,1.55fr)_24rem] xl:items-start">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                Kalkulation
              </p>
              <h3 className="mt-2 text-2xl font-black tracking-tight">
                Eingabemaske
              </h3>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Geführter Workflow: Alle Eingabeschritte 1–7 sind einklappbar. Schritt 1 startet geöffnet, danach gehst du die Kalkulation sauber Abschnitt für Abschnitt durch.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-600">
              Live-Kalkulation
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-7">
              {calculationStepOverview.map((item) => (
                <a
                  key={item.step}
                  href={item.href}
                  className={`relative overflow-hidden rounded-2xl border p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${item.cardClass}`}
                >
                  <span className={`absolute left-0 top-0 h-full w-2 ${item.accent}`} />
                  <div className="pl-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`inline-flex h-7 w-7 items-center justify-center rounded-xl text-xs font-black text-white ${item.accent}`}>
                        {item.step}
                      </span>
                      <span className={`rounded-full px-2 py-1 text-[0.62rem] font-black uppercase ${item.statusClass}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-black text-slate-950">{item.title}</p>
                    <p className={`mt-1 text-xs font-bold ${item.textClass}`}>{item.subtitle}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                    Arbeitsmodus V140
                  </p>
                  <p className="mt-1 text-sm font-black text-slate-950">
                    Schritte anklicken, Abschnitt öffnen, Werte prüfen, weiter zum nächsten Block.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-[0.68rem] font-black">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">OK</span>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">Prüfen</span>
                  <span className="rounded-full bg-slate-200 px-3 py-1 text-slate-600">Optional</span>
                </div>
              </div>
            </div>

            <details id="calc-step-1" open className="group scroll-mt-24 rounded-3xl border border-cyan-200 bg-white p-0 shadow-sm [&>summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-3xl border-l-8 border-cyan-400 bg-cyan-50 px-4 py-4 transition hover:bg-cyan-100/70">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-cyan-700">1 · Auftrag / Vorlage</p>
                  <p className="mt-1 text-sm font-black text-slate-950">{productName || "Neues Produkt"}</p>
                  <p className="mt-1 text-xs font-bold text-cyan-900">Vorlage wählen, Produktname prüfen und danach mit Auflage weitermachen.</p>
                </div>
                <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-cyan-700 shadow-sm ring-1 ring-cyan-100 group-open:hidden">Aufklappen</span>
                <span className="hidden rounded-full bg-white px-3 py-2 text-xs font-black text-cyan-700 shadow-sm ring-1 ring-cyan-100 group-open:inline-flex">Einklappen</span>
              </summary>
              <div className="px-0 pb-0">
            <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-4">
              <p className="text-xs font-extrabold uppercase tracking-wide text-cyan-700">
                1 · Auftrag / Vorlage
              </p>
              <p className="mt-1 text-sm font-bold text-cyan-900">
                Zuerst Vorlage wählen und den Produktnamen sauber vergeben. Danach steuert die Vorlage die Grundlogik.
              </p>

              <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr_auto] xl:items-end">
                <SelectField
                  label="Kalkulationsvorlage"
                  value={selectedCalculationTemplateId}
                  onChange={setSelectedCalculationTemplateId}
                  options={activeCalculationTemplates.map((template) => ({
                    value: template.id,
                    label: `${template.name} · ${template.productType}`,
                  }))}
                />

                <InputField
                  label="Produktname"
                  value={productName}
                  onChange={setProductName}
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
              </div>
            </details>

            <details id="calc-step-2" className="group scroll-mt-24 rounded-3xl border border-fuchsia-200 bg-white p-0 shadow-sm [&>summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-3xl border-l-8 border-fuchsia-500 bg-fuchsia-50 px-4 py-4 transition hover:bg-fuchsia-100/70">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-fuchsia-700">2 · Auflage</p>
                  <p className="mt-1 text-sm font-black text-slate-950">{safeQuantity.toLocaleString("de-DE")} Stück · {safeItemsPerSheet} Nutzen / Bogen</p>
                  <p className="mt-1 text-xs font-bold text-fuchsia-900">Auflage, Format und automatische Nutzenbasis prüfen.</p>
                </div>
                <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-fuchsia-700 shadow-sm ring-1 ring-fuchsia-100 group-open:hidden">Aufklappen</span>
                <span className="hidden rounded-full bg-white px-3 py-2 text-xs font-black text-fuchsia-700 shadow-sm ring-1 ring-fuchsia-100 group-open:inline-flex">Einklappen</span>
              </summary>
              <div className="px-0 pb-0">
            <div className="rounded-3xl border border-fuchsia-200 bg-fuchsia-50 p-4 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-wide text-fuchsia-700">
                2 · Auflage
              </p>
              <p className="mt-1 text-sm font-bold text-fuchsia-900">
                Hier werden nur die produktionsrelevanten Eckdaten gesetzt. Nutzen und Seiten je Bogen bleiben automatische Kontrollwerte.
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <NumberField
                  label="Auflage"
                  value={quantity}
                  onChange={setQuantity}
                  suffix="Stück"
                />
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
                <ReadOnlyField
                  label="Berechneter Nutzen"
                  value={`${safeItemsPerSheet} Nutzen`}
                />
              </div>

              <div className="mt-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-fuchsia-100">
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                  Nutzenbasis / Druckbogen
                </p>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  Beschnitt, Bund, Zwischenschnitt und Rohbogen steuern den automatischen Nutzenrechner.
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
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Automatischer Nutzen
                    </p>
                    <h4 className="mt-2 text-lg font-semibold text-slate-950">
                      Nutzen, Bogenbedarf und Vorschau
                    </h4>
                    <p className="mt-2 max-w-4xl text-sm font-medium leading-6 text-slate-500">
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

                  <div className={`shrink-0 rounded-2xl px-4 py-2 text-sm font-semibold ring-1 ${impositionQualityClass}`}>
                    Status: {impositionQuality}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
                  <div className="grid auto-rows-min gap-3 md:grid-cols-3">
                    <InfoCard
                      label="Bester Nutzen"
                      value={`${impositionResult.best.total} Nutzen / Bogen`}
                    />
                    <InfoCard
                      label="Bogenbedarf"
                      value={`${Math.ceil(safeQuantity / Math.max(impositionResult.best.total, 1)).toLocaleString("de-DE")} Bogen`}
                    />
                    <InfoCard
                      label="Restfläche"
                      value={`${formatNumber(impositionResult.best.wastePercent, 1)} %`}
                    />
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
                      label="Bundrichtung"
                      value={getSpineAxisLabel(impositionResult.best.spineAxis)}
                    />
                    <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Gewählt weil
                      </p>
                      <p className="mt-2 whitespace-normal break-words text-sm font-medium leading-6 text-slate-700">
                        {selectedBecause}
                      </p>
                    </div>
                    <InfoCard
                      label="Belegte Fläche"
                      value={`${impositionResult.best.usedWidth} × ${impositionResult.best.usedHeight} mm`}
                    />
                    <InfoCard
                      label="Nutzbare Fläche"
                      value={`${impositionResult.availableWidth} × ${impositionResult.availableHeight} mm`}
                    />
                    <InfoCard
                      label="Status"
                      value={impositionQuality}
                    />
                  </div>

                  <aside className="xl:sticky xl:top-24">
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
                  </aside>
                </div>

                <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Nutzenanalyse
                      </p>
                      <h4 className="mt-2 text-lg font-semibold text-slate-950">
                        Prüfdaten für die Bogenaufteilung
                      </h4>
                      <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                        Diese Werte zeigen, warum der aktuelle Nutzen gewählt wurde.
                      </p>
                    </div>

                    {removeSpineBleed && (
                      <div className="rounded-2xl bg-yellow-100 px-4 py-3 text-sm font-semibold text-yellow-800">
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
                      <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold leading-6 text-yellow-800">
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

                    {!allowRotation && rotatedWouldBeBetter && (
                      <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold leading-6 text-amber-700">
                        Prüfen: Drehung ist gesperrt. Gedreht wären {impositionResult.rotated.total} Nutzen möglich,
                        aktuell werden {impositionResult.normal.total} Nutzen verwendet.
                      </p>
                    )}

                    {impositionResult.best.total > 0 && impositionResult.best.wastePercent > 45 && (
                      <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold leading-6 text-amber-700">
                        Prüfen: Die Restfläche liegt bei {formatNumber(impositionResult.best.wastePercent, 1)} %.
                        Eventuell passt ein anderes Rohbogenformat besser.
                      </p>
                    )}
                  </div>
                </div>

                {impositionResult.best.total <= 0 && (
                  <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700">
                    Das Produkt passt mit den aktuellen Rändern/Beschnittwerten
                    nicht auf den gewählten Rohbogen.
                  </p>
                )}
              </div>
            </div>
            </div>
              </div>
            </details>

            {productType === "Broschüre" && (
              <details id="calc-step-3" className="group scroll-mt-24 rounded-3xl border border-yellow-200 bg-white p-0 shadow-sm [&>summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-3xl border-l-8 border-yellow-400 bg-yellow-50 px-4 py-4 transition hover:bg-yellow-100/70">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wide text-yellow-700">3 · Produktdaten / Broschüre</p>
                    <p className="mt-1 text-sm font-black text-slate-950">{finalWidthMm} × {finalHeightMm} mm · {materialSelections.find((selection) => selection.label.toLowerCase().includes("inhalt"))?.pages ?? 32} Inhaltsseiten</p>
                    <p className="mt-1 text-xs font-bold text-yellow-900">Format, Inhaltsseiten, Umschlag und Papiere prüfen.</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-yellow-700 shadow-sm ring-1 ring-yellow-100 group-open:hidden">Aufklappen</span>
                  <span className="hidden rounded-full bg-white px-3 py-2 text-xs font-black text-yellow-700 shadow-sm ring-1 ring-yellow-100 group-open:inline-flex">Einklappen</span>
                </summary>
                <div className="px-0 pb-0">
              <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wide text-yellow-700">
                      3 · Produktdaten / Broschüre
                    </p>
                    <h4 className="mt-2 text-lg font-black text-slate-950">
                      Format, Seiten und Papiere
                    </h4>
                    <p className="mt-2 text-sm font-bold leading-6 text-yellow-800">
                      Die App berechnet daraus offene Doppelseite, Bund ohne Beschnitt,
                      Nutzen, Materialbogen und Druckbogen automatisch.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={ensureBrochureDefaults}
                    className="rounded-2xl bg-yellow-500 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5"
                  >
                    Broschürenlogik anwenden
                  </button>
                </div>

                {brochureWarnings.length > 0 ? (
                  <div className="mt-5 rounded-3xl border border-rose-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-wide text-rose-700">
                          Broschürenprüfung
                        </p>
                        <h5 className="mt-1 text-base font-black text-slate-950">
                          Bitte vor dem Angebot prüfen
                        </h5>
                      </div>
                      <span className="rounded-full bg-rose-600 px-3 py-1 text-xs font-black text-white">
                        {brochureWarnings.length} Meldung{brochureWarnings.length === 1 ? "" : "en"}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2">
                      {brochureWarnings.map((warning, index) => (
                        <div
                          key={`${warning.title}-${index}`}
                          className="rounded-2xl bg-rose-50 px-4 py-3"
                        >
                          <p className="text-sm font-black text-rose-800">
                            {warning.title}
                          </p>
                          <p className="mt-1 text-sm font-bold leading-6 text-slate-600">
                            {warning.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 rounded-3xl border border-emerald-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-extrabold uppercase tracking-wide text-emerald-700">
                      Broschürenprüfung
                    </p>
                    <p className="mt-1 text-sm font-black text-emerald-800">
                      Format, Bundlogik und Seitenaufbau sind plausibel.
                    </p>
                  </div>
                )}

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
                      <div>
                        <ReadOnlyField
                          label="Umschlagseiten"
                          value="4 S. automatisch"
                        />
                        <p className="mt-2 text-xs font-bold leading-5 text-yellow-800">
                          Der Umschlag ist für die Broschürenlogik fest auf 4 Seiten gesperrt.
                        </p>
                      </div>
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

                <p className="mt-5 rounded-2xl bg-yellow-100 px-4 py-3 text-sm font-black text-yellow-900">
                  Berechnung: Seiten je Rohbogen = Nutzen offener Doppelseiten × 4.
                  Im Bund wird kein Beschnitt gerechnet, außen bleibt der Beschnitt aktiv.
                </p>
              </div>
                </div>
              </details>
            )}


            <details id="calc-step-4" className="group scroll-mt-24 rounded-3xl border border-emerald-200 bg-white p-0 shadow-sm [&>summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-3xl border-l-8 border-emerald-400 bg-emerald-50 px-4 py-4 transition hover:bg-emerald-100/70">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-emerald-700">4 · Druckteile / Produktstruktur</p>
                  <p className="mt-1 text-sm font-black text-slate-950">{selectedMaterialItems.length} Druckteil(e) · {formatCurrency(materialCost)}</p>
                  <p className="mt-1 text-xs font-bold text-emerald-900">Kompakte Übersicht, Details per Aufklappen.</p>
                </div>
                <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-emerald-700 shadow-sm ring-1 ring-emerald-100 group-open:hidden">Aufklappen</span>
                <span className="hidden rounded-full bg-white px-3 py-2 text-xs font-black text-emerald-700 shadow-sm ring-1 ring-emerald-100 group-open:inline-flex">Einklappen</span>
              </summary>
              <div className="px-0 pb-0">
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-emerald-700">
                    4 · Druckteile / Produktstruktur
                  </p>
                  <h4 className="mt-2 text-lg font-black text-slate-950">
                    Druckteile fachlich prüfen
                  </h4>
                  <p className="mt-1 text-sm font-bold text-emerald-900">
                    Inhalt, Umschlag und Zusatzteile zeigen jetzt sofort Seiten, Papier, Farbigkeit, Materialbogen, Kosten und fachliche Hinweise. Details bleiben aufklappbar.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(["Inhalt", "Umschlag", "Beileger", "Zusatzbogen"] as PrintPartType[]).map((partType) => (
                    <button
                      key={partType}
                      type="button"
                      onClick={() => addPrintPart(partType)}
                      className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5"
                    >
                      + {partType}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-emerald-900 shadow-sm ring-1 ring-emerald-100">
                Übersicht: {selectedMaterialItems.length} Druckteil(e) · {totalSheets.toLocaleString("de-DE")} Produktionsbogen · {formatCurrency(materialCost)} Materialkosten · fachliche Prüfung je Druckteil
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
                  const colorSummary = getPrintPartColorSummary(item);
                  const quantitySummary = getPrintPartQuantitySummary(item);
                  const partChecks = [
                    item.calculationMode === "pages" && item.pages <= 0
                      ? "Seiten fehlen"
                      : null,
                    item.partType === "Inhalt" &&
                    item.calculationMode === "pages" &&
                    item.pages % 4 !== 0
                      ? "Inhaltsseiten nicht durch 4 teilbar"
                      : null,
                    item.partType === "Umschlag" &&
                    item.calculationMode === "pages" &&
                    item.pages !== 4
                      ? "Umschlag sollte 4 Seiten haben"
                      : null,
                    item.totalMaterialSheets <= 0
                      ? "Materialbogen prüfen"
                      : null,
                    item.pricePerSheet <= 0
                      ? "Materialpreis fehlt"
                      : null,
                  ].filter(Boolean) as string[];
                  const partStatus = partChecks.length === 0 ? "OK" : "Prüfen";
                  const partStatusClass =
                    partChecks.length === 0
                      ? "bg-emerald-50 text-emerald-800 ring-emerald-100"
                      : "bg-amber-50 text-amber-800 ring-amber-100";
                  const partCostShare =
                    materialCost > 0 ? (item.cost / materialCost) * 100 : 0;

                  return (
                    <details
                      key={item.id}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white"
                    >
                      <summary className="grid cursor-pointer list-none gap-3 px-4 py-3 transition hover:bg-slate-50 xl:grid-cols-[minmax(180px,1.1fr)_minmax(0,2.8fr)_auto] xl:items-center [&::-webkit-details-marker]:hidden">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                              {item.partType ?? "Sonstiges"}
                            </span>
                            <p className="truncate text-sm font-black text-slate-950">
                              {item.label || `Material ${index + 1}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 text-[11px] font-black leading-tight text-slate-600">
                          <span className="whitespace-nowrap rounded-full bg-slate-50 px-2.5 py-1 ring-1 ring-slate-200">{quantitySummary}</span>
                          <span className="whitespace-nowrap rounded-full bg-slate-50 px-2.5 py-1 ring-1 ring-slate-200">{colorSummary}</span>
                          <span className="whitespace-nowrap rounded-full bg-slate-50 px-2.5 py-1 ring-1 ring-slate-200">{item.material.grammage} g</span>
                          <span className="whitespace-nowrap rounded-full bg-slate-50 px-2.5 py-1 ring-1 ring-slate-200">{item.totalMaterialSheets.toLocaleString("de-DE")} Bg.</span>
                          <span className="whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-800 ring-1 ring-emerald-100">{formatCurrency(item.cost)}</span>
                          <span className={`whitespace-nowrap rounded-full px-2.5 py-1 ring-1 ${partStatusClass}`}>{partStatus}</span>
                        </div>

                        <div className="flex shrink-0 items-center justify-end gap-3">
                          <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 md:inline-flex group-open:hidden">
                            Details
                          </span>
                          <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 group-open:md:inline-flex">
                            Schließen
                          </span>
                          <span className="text-xs font-black text-slate-400 transition group-open:rotate-180">
                            ▼
                          </span>
                        </div>
                      </summary>

                      <div className="space-y-4 border-t border-slate-100 p-4">
                        <div className="quote-preview-card rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fachliche Übersicht</p>
                              <h5 className="mt-1 text-base font-semibold text-slate-950">{item.partType ?? "Druckteil"}: {item.label || `Position ${index + 1}`}</h5>
                              <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
                                {quantitySummary} · {colorSummary} · {item.material.name} · {item.material.grammage} g/m²
                              </p>
                            </div>
                            <span className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${partStatusClass}`}>
                              {partStatus === "OK" ? "Druckteil plausibel" : "Druckteil prüfen"}
                            </span>
                          </div>

                          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Produktionsbogen</p>
                              <p className="mt-1 text-lg font-semibold text-slate-950">{item.calculatedSheets.toLocaleString("de-DE")}</p>
                            </div>
                            <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Materialbogen gesamt</p>
                              <p className="mt-1 text-lg font-semibold text-slate-950">{item.totalMaterialSheets.toLocaleString("de-DE")}</p>
                            </div>
                            <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Materialkosten</p>
                              <p className="mt-1 text-lg font-semibold text-slate-950">{formatCurrency(item.cost)}</p>
                            </div>
                            <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Anteil Material</p>
                              <p className="mt-1 text-lg font-semibold text-slate-950">{formatNumber(partCostShare, 1)} %</p>
                            </div>
                          </div>

                          {partChecks.length > 0 ? (
                            <div className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm font-medium leading-6 text-amber-900 ring-1 ring-amber-100">
                              <p className="font-semibold">Bitte prüfen:</p>
                              <ul className="mt-1 list-disc space-y-1 pl-5">
                                {partChecks.map((check) => (
                                  <li key={check}>{check}</li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <div className="mt-4 rounded-2xl bg-emerald-50 p-3 text-sm font-medium text-emerald-900 ring-1 ring-emerald-100">
                              Material, Seitenlogik und Kostenwerte wirken für diesen Druckteil plausibel.
                            </div>
                          )}
                        </div>

                        <div className="grid gap-3 md:grid-cols-4 md:items-end">
                          <SelectField
                            label="Druckteil"
                            value={item.partType ?? "Sonstiges"}
                            onChange={(value) =>
                              updateMaterialSelection(
                                item.id,
                                "partType",
                                value as PrintPartType,
                              )
                            }
                            options={PRINT_PART_TYPE_OPTIONS}
                          />
                          <SelectField
                            label="Druckart"
                            value={item.printSideMode ?? "duplex"}
                            onChange={(value) =>
                              updateMaterialSelection(
                                item.id,
                                "printSideMode",
                                value as PrintSideMode,
                              )
                            }
                            options={PRINT_SIDE_MODE_OPTIONS}
                          />
                          <SelectField
                            label="Vorderseite"
                            value={item.frontColorMode ?? "4-farbig"}
                            onChange={(value) =>
                              updateMaterialSelection(
                                item.id,
                                "frontColorMode",
                                value,
                              )
                            }
                            options={PRINT_PART_COLOR_MODE_OPTIONS}
                          />
                          <SelectField
                            label="Rückseite"
                            value={item.backColorMode ?? "4-farbig"}
                            onChange={(value) =>
                              updateMaterialSelection(
                                item.id,
                                "backColorMode",
                                value,
                              )
                            }
                            options={PRINT_PART_COLOR_MODE_OPTIONS}
                          />
                        </div>

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

                          <div className="grid gap-2 md:grid-cols-2">
                            <button
                              type="button"
                              onClick={() => duplicateMaterialSelection(item.id)}
                              className="rounded-2xl bg-cyan-100 px-4 py-3 text-sm font-black text-cyan-800 transition hover:-translate-y-0.5"
                            >
                              Duplizieren
                            </button>
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
                              Löschen
                            </button>
                          </div>
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
                            <ReadOnlyField
                              label="Seiten je Bogen"
                              value={`${item.pagesPerSheet.toLocaleString("de-DE")} S./Bg. automatisch`}
                            />
                            <ReadOnlyField
                              label="Produktionsbogen"
                              value={`${item.calculatedSheets.toLocaleString("de-DE")} Bogen`}
                            />
                          </div>
                        )}
                      </div>

                      <div className="mx-4 mb-4 mt-0 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600 md:grid-cols-2">
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
                    </details>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-950 px-4 py-3 text-white">
                <p className="text-sm font-semibold">Summe Material</p>
                <p className="text-xl font-semibold">{formatCurrency(materialCost)}</p>
              </div>
            </div>
              </div>
            </details>

            <details id="calc-step-5" className="group scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-0 shadow-sm [&>summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-3xl border-l-8 border-sky-500 bg-sky-50 px-4 py-4 transition hover:bg-sky-100/70">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-sky-700">5 · Maschine / Druck</p>
                  <p className="mt-1 text-sm font-black text-slate-950">{selectedMachine.name} · {getMachineCostModelLabel(machineCostModel)}</p>
                  <p className="mt-1 text-xs font-bold text-sky-900">Aufklappen, wenn Maschine, Farbmodus oder Produktionsparameter geändert werden sollen.</p>
                </div>
                <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-sky-700 shadow-sm ring-1 ring-sky-100 group-open:hidden">Aufklappen</span>
                <span className="hidden rounded-full bg-white px-3 py-2 text-xs font-black text-sky-700 shadow-sm ring-1 ring-sky-100 group-open:inline-flex">Einklappen</span>
              </summary>
              <div className="px-0 pb-0">
            <div className="rounded-3xl border border-sky-200 bg-sky-50 p-4 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-wide text-sky-700">
                5 · Maschine / Druck
              </p>
              <p className="mt-1 text-sm font-bold text-sky-900">
                Maschine wählen, Farb-/Kostenmodell prüfen und nur die passenden Produktionsfelder bearbeiten.
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
              </div>
            </details>

            <details id="calc-step-6" className="group scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-0 shadow-sm [&>summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-3xl border-l-8 border-lime-400 bg-lime-50 px-4 py-4 transition hover:bg-lime-100/70">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-lime-700">6 · Weiterverarbeitung</p>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${finishingStatus === "OK" ? "bg-emerald-500 text-white" : "bg-amber-400 text-amber-950"}`}>
                      {finishingStatus}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    {selectedFinishingItems.length} Schritt(e) · {formatCurrency(finishingCost)} gesamt
                  </p>
                  <p className="mt-1 max-w-2xl truncate text-xs font-medium text-lime-900">
                    {activeFinishingNames || "Keine Weiterverarbeitung gewählt"}
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-lime-700 shadow-sm ring-1 ring-lime-100 group-open:hidden">Aufklappen</span>
                <span className="hidden rounded-full bg-white px-3 py-2 text-xs font-semibold text-lime-700 shadow-sm ring-1 ring-lime-100 group-open:inline-flex">Einklappen</span>
              </summary>
              <div className="px-0 pb-0">
                <div className="rounded-3xl border border-lime-200 bg-lime-50 p-4 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-lime-700">
                        6 · Weiterverarbeitung
                      </p>
                      <p className="mt-1 text-sm font-medium text-lime-900">
                        Aktive Arbeitsschritte werden kompakt als Produktionskette geführt. Details und Kosten bleiben je Schritt aufklappbar.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addFinishingSelection}
                      className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
                    >
                      + Schritt hinzufügen
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl bg-white p-4 ring-1 ring-lime-100">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</p>
                      <p className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${finishingStatus === "OK" ? "bg-emerald-500 text-white" : "bg-amber-400 text-amber-950"}`}>
                        {finishingStatus === "OK" ? "Weiterverarbeitung plausibel" : "Weiterverarbeitung prüfen"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 ring-1 ring-lime-100">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Aktive Schritte</p>
                      <p className="mt-2 text-xl font-semibold text-slate-950">{selectedFinishingItems.length}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 ring-1 ring-lime-100">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Gesamtkosten</p>
                      <p className="mt-2 text-xl font-semibold text-slate-950">{formatCurrency(finishingCost)}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className={`rounded-2xl p-3 text-sm font-medium ${hasCuttingFinishing ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100" : "bg-white text-slate-500 ring-1 ring-slate-100"}`}>
                      Schneiden / Endbeschnitt {hasCuttingFinishing ? "✓" : "optional"}
                    </div>
                    <div className={`rounded-2xl p-3 text-sm font-medium ${hasCreasingFinishing ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100" : "bg-white text-slate-500 ring-1 ring-slate-100"}`}>
                      Rillen / Falzvorbereitung {hasCreasingFinishing ? "✓" : "optional"}
                    </div>
                    <div className={`rounded-2xl p-3 text-sm font-medium ${hasStitchingFinishing ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100" : productType === "Broschüre" ? "bg-amber-50 text-amber-800 ring-1 ring-amber-100" : "bg-white text-slate-500 ring-1 ring-slate-100"}`}>
                      Heften / Binden {hasStitchingFinishing ? "✓" : productType === "Broschüre" ? "prüfen" : "optional"}
                    </div>
                  </div>

                  {finishingWarnings.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">
                      <p className="font-semibold">Bitte prüfen:</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        {finishingWarnings.map((warning) => (
                          <li key={warning}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 space-y-2">
                    {selectedFinishingItems.map((item, index) => {
                      const { operation, price, selectionId } = item;

                      return (
                        <details
                          key={selectionId}
                          className="group overflow-hidden rounded-2xl border border-slate-200 bg-white"
                        >
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 transition hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="grid h-7 w-7 place-items-center rounded-full bg-lime-100 text-xs font-semibold text-lime-800">
                                  {index + 1}
                                </span>
                                <p className="truncate text-sm font-semibold text-slate-950">
                                  {operation.name}
                                </p>
                              </div>
                              <p className="mt-1 truncate text-xs font-medium text-slate-500">
                                {operation.category} · {getFinishingPricingModeLabel(operation.pricingMode)} · Rüstzeit {operation.setupMinutes} Min.
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-3">
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                {formatCurrency(price)}
                              </span>
                              <span className="text-xs font-semibold text-slate-400 transition group-open:rotate-180">
                                ▼
                              </span>
                            </div>
                          </summary>

                          <div className="border-t border-slate-100 p-4">
                            <div className="flex flex-col gap-3 md:flex-row md:items-end">
                              <div className="flex-1">
                                <SelectField
                                  label={`Schritt ${index + 1}`}
                                  value={operation.id}
                                  onChange={(value) =>
                                    updateFinishingSelection(selectionId, value)
                                  }
                                  options={finishingOperations.map((item) => ({
                                    value: item.id,
                                    label: item.name,
                                  }))}
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFinishingSelection(selectionId)}
                                disabled={finishingSelections.length <= 1}
                                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                  finishingSelections.length <= 1
                                    ? "cursor-not-allowed bg-slate-100 text-slate-400"
                                    : "bg-rose-100 text-rose-700 hover:-translate-y-0.5"
                                }`}
                              >
                                Entfernen
                              </button>
                            </div>

                            <div className="mt-4 grid gap-3 text-sm font-medium text-slate-600 md:grid-cols-2">
                              <p>Kategorie: {operation.category}</p>
                              <p>Modell: {getFinishingPricingModeLabel(operation.pricingMode)}</p>
                              <p>Grundpreis: {formatCurrency(operation.basePrice)}</p>
                              <p>Mindestpreis: {formatCurrency(operation.minimumPrice)}</p>
                              <p>Rüstzeit: {operation.setupMinutes} Min.</p>
                              <p>Berechnet: {formatCurrency(price)}</p>
                            </div>
                          </div>
                        </details>
                      );
                    })}
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <div className="rounded-3xl bg-slate-950 p-5 text-white">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Summe Weiterverarbeitung
                      </p>
                      <p className="mt-2 text-3xl font-semibold">
                        {formatCurrency(calculatedFinishingCost)}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-white p-5 ring-1 ring-lime-100">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Zusatzkosten manuell
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-slate-950">
                        {formatCurrency(Math.max(finishingExtraCost, 0))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </details>

            <details id="calc-step-7" className="group scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-0 shadow-sm [&>summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-3xl border-l-8 border-violet-500 bg-violet-50 px-4 py-4 transition hover:bg-violet-100/70">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-violet-700">7 · Zuschläge / Preislogik</p>
                  <p className="mt-1 text-sm font-black text-slate-950">Gemeinkosten {overheadPercent}% · Marge {marginPercent}%</p>
                  <p className="mt-1 text-xs font-bold text-violet-900">Aufklappen, wenn Zuschuss, Ausschuss, Rüstzeit, Gemeinkosten oder Marge geändert werden sollen.</p>
                </div>
                <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-violet-700 shadow-sm ring-1 ring-violet-100 group-open:hidden">Aufklappen</span>
                <span className="hidden rounded-full bg-white px-3 py-2 text-xs font-black text-violet-700 shadow-sm ring-1 ring-violet-100 group-open:inline-flex">Einklappen</span>
              </summary>
              <div className="px-0 pb-0">
            <div className="rounded-3xl border border-violet-200 bg-violet-50 p-4 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-wide text-violet-700">
                7 · Zuschläge / Preislogik
              </p>
              <p className="mt-1 text-sm font-bold text-violet-900">
                Diese Werte beeinflussen die Produktionssicherheit und den Verkaufspreis. Die eigentliche Preisbrücke steht rechts im Ergebnisbereich.
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
            </details>
          </div>
        </div>

        <div className="space-y-5 xl:sticky xl:top-28 xl:self-start">
          <details open className="group overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-slate-950/20">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Ergebnis V141</p>
                <p className="mt-1 text-sm font-medium text-slate-300">wichtigster Preisblock bleibt offen</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200 group-open:hidden">Aufklappen</span>
              <span className="hidden rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200 group-open:inline-flex">Einklappen</span>
            </summary>
            <div className="border-t border-white/10 p-6">
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
                  <p className="text-[0.68rem] font-bold uppercase tracking-wide text-slate-400">
                    Produktionskosten
                  </p>
                  <p className="mt-2 text-base font-black">
                    {formatCurrency(directCost)}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-[0.68rem] font-bold uppercase tracking-wide text-slate-400">
                    Selbstkosten
                  </p>
                  <p className="mt-2 text-base font-black">
                    {formatCurrency(totalCost)}
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-400/15 p-4 text-emerald-200">
                  <p className="text-[0.68rem] font-bold uppercase tracking-wide text-emerald-300">
                    Deckungsbeitrag
                  </p>
                  <p className="mt-2 text-base font-black">
                    {formatCurrency(profit)}
                  </p>
                </div>

                <div className="rounded-2xl bg-cyan-400/15 p-4 text-cyan-100">
                  <p className="text-[0.68rem] font-bold uppercase tracking-wide text-cyan-200">
                    DB-Anteil
                  </p>
                  <p className="mt-2 text-base font-black">
                    {formatNumber((profit / Math.max(sellingPrice, 0.01)) * 100, 1)} %
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
          </details>

          <details open className="group overflow-hidden rounded-[2rem] border border-emerald-200 bg-emerald-50 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Angebotsmodus V141</p>
                <p className="mt-1 text-sm font-medium text-emerald-950">Kalkulation ist bereit für eine Angebotsposition</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm group-open:hidden">Aufklappen</span>
              <span className="hidden rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm group-open:inline-flex">Einklappen</span>
            </summary>
            <div className="border-t border-emerald-200/70 p-5">
              <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-emerald-100">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Positionsvorschau</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-950">{productName}</h3>
                    <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
                      {safeQuantity.toLocaleString("de-DE")} Stück · {finalWidthMm} × {finalHeightMm} mm · {selectedMachine.name}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${hasCalculationErrors ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {hasCalculationErrors ? "nicht bereit" : "bereit"}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-slate-400">Netto</p>
                    <p className="mt-1 text-base font-semibold text-slate-950">{formatCurrency(sellingPrice)}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-slate-400">MwSt. 19 %</p>
                    <p className="mt-1 text-base font-semibold text-slate-950">{formatCurrency(sellingPrice * 0.19)}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-950 p-3 text-white">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-slate-400">Brutto</p>
                    <p className="mt-1 text-base font-semibold">{formatCurrency(sellingPrice * 1.19)}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm font-medium leading-6 text-slate-600">
                  Beim Klick auf <span className="font-semibold text-slate-950">„In Angebot übernehmen“</span> wird aus dieser Kalkulation direkt ein Angebotsentwurf erzeugt. Produktname, Auflage, Positionstext, Netto, MwSt. und Brutto werden in den Angebotsbereich übernommen.
                </div>
              </div>
            </div>
          </details>

          <details
            open
            className={`group rounded-[2rem] border p-5 shadow-sm ${calculationStatusTone.panelClass}`}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wide ${calculationStatusTone.textClass}`}>Kalkulationsstatus V141</p>
                <p className="mt-1 text-sm font-medium text-slate-600">{calculationStatusTone.headline}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${calculationStatusTone.badgeClass}`}>
                {calculationStatusTone.label}
              </span>
            </summary>
            <div className="mt-5 border-t border-white/60 pt-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className={`text-xs font-extrabold uppercase tracking-wide ${calculationStatusTone.textClass}`}
                >
                  Kalkulationsstatus V141
                </p>
                <h3 className="mt-1 text-lg font-black text-slate-950">
                  {calculationStatusTone.headline}
                </h3>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
                  {calculationStatusTone.hint}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${calculationStatusTone.badgeClass}`}
                >
                  {calculationStatusTone.label}
                </span>
                <div className="flex flex-wrap justify-end gap-1 text-[0.68rem] font-black">
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
                      {calculationInfoCount} Hinweis
                    </span>
                  )}
                </div>
              </div>
            </div>

            {primaryCalculationMessage ? (
              <div className="mt-4 rounded-2xl bg-white px-4 py-3 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className={`text-sm font-black ${
                        primaryCalculationMessage.level === "error"
                          ? "text-rose-800"
                          : primaryCalculationMessage.level === "warning"
                            ? "text-amber-800"
                            : "text-sky-800"
                      }`}
                    >
                      {primaryCalculationMessage.title}
                    </p>
                    <p className="mt-1 text-sm font-bold leading-6 text-slate-600">
                      {primaryCalculationMessage.description}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[0.65rem] font-black uppercase ${
                      primaryCalculationMessage.level === "error"
                        ? "bg-rose-100 text-rose-700"
                        : primaryCalculationMessage.level === "warning"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-sky-100 text-sky-700"
                    }`}
                  >
                    {primaryCalculationMessage.level === "error"
                      ? "Fehler"
                      : primaryCalculationMessage.level === "warning"
                        ? "Warnung"
                        : "Hinweis"}
                  </span>
                </div>
              </div>
            ) : null}

            {calculationWarnings.length > 0 ? (
              <details className="mt-4 rounded-2xl bg-white/80 px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
                <summary className="cursor-pointer font-black text-slate-950">
                  Alle Prüfungen anzeigen
                </summary>
                <div className="mt-4 space-y-4">
                  {criticalCalculationWarnings.length > 0 && (
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-rose-700">
                        Muss korrigiert werden
                      </p>
                      <div className="mt-2 space-y-2">
                        {criticalCalculationWarnings.map((warning, index) => (
                          <div
                            key={`${warning.title}-critical-${index}`}
                            className="rounded-2xl border border-rose-100 bg-rose-50 px-3 py-2"
                          >
                            <p className="font-black text-rose-900">
                              {warning.title}
                            </p>
                            <p className="mt-1 leading-6 text-slate-600">
                              {warning.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {normalCalculationWarnings.length > 0 && (
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-amber-700">
                        Fachlich prüfen
                      </p>
                      <div className="mt-2 space-y-2">
                        {normalCalculationWarnings.map((warning, index) => (
                          <div
                            key={`${warning.title}-warning-${index}`}
                            className="rounded-2xl border border-amber-100 bg-amber-50 px-3 py-2"
                          >
                            <p className="font-black text-amber-900">
                              {warning.title}
                            </p>
                            <p className="mt-1 leading-6 text-slate-600">
                              {warning.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {infoCalculationWarnings.length > 0 && (
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-sky-700">
                        Hinweise
                      </p>
                      <div className="mt-2 space-y-2">
                        {infoCalculationWarnings.map((warning, index) => (
                          <div
                            key={`${warning.title}-info-${index}`}
                            className="rounded-2xl border border-sky-100 bg-sky-50 px-3 py-2"
                          >
                            <p className="font-black text-sky-900">
                              {warning.title}
                            </p>
                            <p className="mt-1 leading-6 text-slate-600">
                              {warning.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </details>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-black text-emerald-800">
                <div className="rounded-2xl bg-white/80 px-3 py-2 shadow-sm">
                  Nutzen möglich
                </div>
                <div className="rounded-2xl bg-white/80 px-3 py-2 shadow-sm">
                  Preis über Selbstkosten
                </div>
                <div className="rounded-2xl bg-white/80 px-3 py-2 shadow-sm">
                  Material geprüft
                </div>
                <div className="rounded-2xl bg-white/80 px-3 py-2 shadow-sm">
                  DB plausibel
                </div>
              </div>
            )}
            </div>
          </details>

          <details className="group rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Auswertung V141</p>
                <p className="mt-1 text-sm font-medium text-slate-500">Produktionskosten und Preisaufbau</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 group-open:hidden">Aufklappen</span>
              <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 group-open:inline-flex">Einklappen</span>
            </summary>
            <div className="mt-5 border-t border-slate-100 pt-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                  Auswertung V141
                </p>
                <h3 className="mt-1 text-lg font-black text-slate-950">
                  Produktionskosten & Preisaufbau
                </h3>
                <p className="mt-1 text-sm font-bold leading-6 text-slate-500">
                  Rechts siehst du zuerst das Ergebnis, dann Produktionskosten nach Material, Druck, Rüstzeit und Weiterverarbeitung sowie darunter die Preisbrücke bis zum Netto-Verkaufspreis.
                </p>
              </div>
              <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                netto
              </span>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                Produktionskosten
              </p>
              <p className="text-xs font-black text-slate-500">
                {formatCurrency(directCost)} gesamt
              </p>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {productionCostSections.map((section) => {
                const percent = (section.value / section.percentBase) * 100;

                return (
                  <div
                    key={`${section.title}-compact`}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-3"
                  >
                    <p className="text-[0.68rem] font-black uppercase tracking-wide text-slate-400">
                      {section.shortTitle}
                    </p>
                    <p className="mt-1 truncate text-sm font-black text-slate-950">
                      {formatCurrency(section.value)}
                    </p>
                    <p className="mt-1 text-[0.68rem] font-black text-slate-400">
                      {formatNumber(percent, 0)} % Produktion
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 space-y-3">
              {productionCostSections.map((section) => {
                const percent = (section.value / section.percentBase) * 100;
                const safePercent = Math.max(0, Math.min(percent, 100));

                return (
                  <details
                    key={section.title}
                    className="group rounded-3xl border border-slate-100 bg-slate-50 p-4 open:bg-white open:shadow-sm"
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`h-3 w-3 shrink-0 rounded-full ${section.accentClass}`} />
                          <p className="text-sm font-black text-slate-950">
                            {section.title}
                          </p>
                        </div>
                        <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                          {section.summary}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-base font-black text-slate-950">
                          {formatCurrency(section.value)}
                        </p>
                        <p className="mt-1 text-[0.68rem] font-black uppercase tracking-wide text-slate-400">
                          Details
                        </p>
                      </div>
                    </summary>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${section.accentClass}`}
                        style={{ width: `${safePercent}%` }}
                      />
                    </div>

                    <div className="mt-4 space-y-2">
                      {section.rows.map((row) => (
                        <div
                          key={`${section.title}-${row.label}`}
                          className="rounded-2xl border border-slate-100 bg-white px-3 py-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-xs font-black text-slate-700">
                                {row.label}
                              </p>
                              <p className="mt-1 text-[0.68rem] font-bold leading-4 text-slate-400">
                                {row.note}
                              </p>
                            </div>
                            <p className="shrink-0 text-xs font-black text-slate-950">
                              {row.value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                );
              })}
            </div>

            <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Produktionskosten V141
                  </p>
                  <h4 className="mt-1 text-base font-semibold text-slate-950">
                    Detaillierte Kostenaufschlüsselung
                  </h4>
                </div>
                <p className="text-xs font-medium text-slate-500">
                  Summe: {formatCurrency(directCost)}
                </p>
              </div>

              <div className="mt-4 grid gap-3">
                {detailedProductionCostGroups.map((group) => (
                  <details
                    key={group.title}
                    className={`group rounded-3xl border p-4 ${group.accentClass}`}
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-950">
                          {group.title}
                        </p>
                        <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                          {group.description}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-white px-3 py-1 text-[0.68rem] font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">
                        Details
                      </span>
                    </summary>

                    <div className="mt-4 space-y-2">
                      {group.rows.map((row) => (
                        <div
                          key={`${group.title}-${row.label}`}
                          className="rounded-2xl bg-white px-3 py-3 shadow-sm ring-1 ring-slate-100"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-800">
                                {row.label}
                              </p>
                              <p className="mt-1 text-[0.68rem] font-medium leading-4 text-slate-400">
                                {row.note}
                              </p>
                            </div>
                            <p className="shrink-0 text-xs font-semibold text-slate-950">
                              {row.value > 0 ? formatCurrency(row.value) : "Info"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-3xl bg-slate-950 p-4 text-white">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                  Preisbrücke
                </p>
                <p className="text-xs font-black text-slate-400">
                  Netto-Aufbau
                </p>
              </div>
              <div className="mt-4 space-y-2">
                {priceBridgeItems.map((item, index) => (
                  <div
                    key={item.label}
                    className={`rounded-2xl px-3 py-3 ${index === priceBridgeItems.length - 1 ? "bg-emerald-400 text-slate-950" : "bg-white/10"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black">{item.label}</p>
                        <p className={`mt-1 text-[0.68rem] font-bold ${index === priceBridgeItems.length - 1 ? "text-slate-700" : "text-slate-400"}`}>
                          {item.note}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-black">
                        {formatCurrency(item.value)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </details>

          <details className="group rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Kostenmix</p>
                <p className="mt-1 text-sm font-medium text-slate-500">Kostentreiber im Verhältnis</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 group-open:hidden">Aufklappen</span>
              <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 group-open:inline-flex">Einklappen</span>
            </summary>
            <div className="mt-5 border-t border-slate-100 pt-5">
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
          </details>

          <details className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wide text-slate-500">
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
            <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wide text-slate-500">
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
            <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wide text-slate-500">
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
  const activeLetterheadMode = activeBusinessDocumentTemplate.letterheadMode ?? "none";
  const activeLetterheadOpacity = Math.max(0, Math.min(activeBusinessDocumentTemplate.letterheadOpacity ?? 100, 100));
  const hasUploadedLetterhead = Boolean(activeBusinessDocumentTemplate.letterheadDataUrl);
  const showUploadedLetterhead = activeLetterheadMode === "upload" && hasUploadedLetterhead;
  const showDemoLetterhead = activeLetterheadMode === "demo";
  const showLetterhead = showUploadedLetterhead || showDemoLetterhead;
  const useRealLetterheadBackground = showUploadedLetterhead;
  const documentContentTopMm = useRealLetterheadBackground
    ? Math.max(activeBusinessDocumentTemplate.topMm, 45)
    : activeBusinessDocumentTemplate.topMm;
  const documentContentBottomMm = useRealLetterheadBackground
    ? Math.max(activeBusinessDocumentTemplate.bottomMm, 32)
    : activeBusinessDocumentTemplate.bottomMm;
  const documentContentLeftMm = useRealLetterheadBackground
    ? Math.max(activeBusinessDocumentTemplate.leftMm, 20)
    : activeBusinessDocumentTemplate.leftMm;
  const documentContentRightMm = useRealLetterheadBackground
    ? Math.max(activeBusinessDocumentTemplate.rightMm, 20)
    : activeBusinessDocumentTemplate.rightMm;
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    customers[0]?.id ?? "manual",
  );
  const [customerName, setCustomerName] = useState(
    customers[0]?.company ?? "Musterkunde GmbH",
  );
  const [customerContactPerson, setCustomerContactPerson] = useState(
    customers[0]?.contactPerson ?? "",
  );
  const [customerStreet, setCustomerStreet] = useState(
    customers[0]?.street ?? "",
  );
  const [customerZip, setCustomerZip] = useState(
    customers[0]?.zip ?? "",
  );
  const [customerCity, setCustomerCity] = useState(
    customers[0]?.city ?? "",
  );
  const [customerEmail, setCustomerEmail] = useState(
    customers[0]?.email ?? "",
  );
  const [customerPhone, setCustomerPhone] = useState(
    customers[0]?.phone ?? "",
  );
  const [quoteDate, setQuoteDate] = useState("2026-05-01");
  const [validUntil, setValidUntil] = useState("2026-05-15");
  const [documentSubject, setDocumentSubject] = useState(() =>
    `${activeBusinessDocumentLabel}: ${quotePositions[0]?.title || "Broschüre A4"}`,
  );
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

  const quoteCustomerName = customerName;
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
  const showCompanyFooterData = Boolean(company.showCompanyFooterOnDocuments);
  const documentCompanyNameFooterLine = Boolean(company.showCompanyAddressOnDocuments)
    ? company.name
    : "";
  const documentCompanyAddressLine = Boolean(company.showCompanyAddressOnDocuments)
    ? [company.street, companyCityLine].filter(Boolean).join(" · ")
    : "";
  const documentCompanyContactLine = Boolean(company.showCompanyContactOnDocuments)
    ? [company.phone, company.email, company.website].filter(Boolean).join(" · ")
    : "";
  const documentCompanyTaxNumberLine = Boolean(company.showTaxDataOnDocuments) && company.taxNumber
    ? `St.-Nr. ${company.taxNumber}`
    : "";
  const documentCompanyVatLine = Boolean(company.showTaxDataOnDocuments) && company.vatId
    ? `USt-ID ${company.vatId}`
    : "";
  const documentCompanyBankNameLine = Boolean(company.showBankDataOnDocuments)
    ? [company.bankName, company.accountHolder ? `Inh. ${company.accountHolder}` : ""].filter(Boolean).join(" · ")
    : "";
  const documentCompanyIbanLine = Boolean(company.showBankDataOnDocuments) && company.iban
    ? `IBAN ${company.iban}`
    : "";
  const documentCompanyBicLine = Boolean(company.showBankDataOnDocuments) && company.bic
    ? `BIC ${company.bic}`
    : "";
  const documentFooterLines = [
    documentCompanyNameFooterLine,
    documentCompanyAddressLine,
    documentCompanyContactLine,
    documentCompanyTaxNumberLine,
    documentCompanyVatLine,
    documentCompanyBankNameLine,
    documentCompanyIbanLine,
    documentCompanyBicLine,
  ].filter(Boolean);
  const documentFooterColumns = company.documentFooterColumns ?? "3";
  const documentFooterBottomMm = Math.max(-30, Math.min(Number(company.documentFooterBottomMm ?? -6), 35));
  const documentFooterHeightMm = Math.max(10, Math.min(Number(company.documentFooterHeightMm ?? 20), 36));
  const documentFooterTextTone = company.documentFooterTextTone ?? "white";
  const showFooterInLetterheadBar =
    showCompanyFooterData &&
    documentFooterLines.length > 0 &&
    useRealLetterheadBackground;
  const documentFooterGroups = [
    {
      title: "Firma",
      lines: [
        documentCompanyNameFooterLine,
        documentCompanyAddressLine,
        documentCompanyContactLine,
      ].filter(Boolean),
    },
    {
      title: "Steuer",
      lines: [
        documentCompanyTaxNumberLine,
        documentCompanyVatLine,
      ].filter(Boolean),
    },
    {
      title: "Bank",
      lines: [
        documentCompanyBankNameLine,
        documentCompanyIbanLine,
        documentCompanyBicLine,
      ].filter(Boolean),
    },
  ].filter((group) => group.lines.length > 0);

  const customerCityAddressLine = [customerZip, customerCity].filter(Boolean).join(" ");
  const customerAddressLines = [
    quoteCustomerName,
    customerContactPerson ? `z. Hd. ${customerContactPerson}` : "",
    customerStreet,
    customerCityAddressLine,
  ].filter(Boolean);

  const customerMetaRows = [
    { label: "Kundennummer", value: selectedCustomer?.customerNumber ?? "" },
    { label: "Ansprechpartner", value: customerContactPerson },
    { label: "E-Mail", value: customerEmail },
    { label: "Telefon", value: customerPhone },
  ].filter((item) => Boolean(item.value));

  const documentTotals = calculateDocumentTotals(quotePositions);
  const netTotal = documentTotals.netTotal;
  const vatTotals = documentTotals.vatTotals;
  const grossTotal = documentTotals.grossTotal;
  const letterheadPositionPages = useMemo(() => {
    return paginateQuotePositionsByEstimatedHeight(quotePositions);
  }, [quotePositions]);
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
  const quoteDocumentCount = savedDocuments.filter(
    (documentItem) => documentItem.documentType === "quote",
  ).length;
  const draftDocumentCount = savedDocuments.filter(
    (documentItem) => documentItem.status === "Entwurf",
  ).length;
  const sentDocumentCount = savedDocuments.filter(
    (documentItem) => documentItem.status === "Versendet",
  ).length;
  const acceptedDocumentCount = savedDocuments.filter(
    (documentItem) => documentItem.status === "Angenommen",
  ).length;

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
      setCustomerContactPerson(customer.contactPerson);
      setCustomerStreet(customer.street);
      setCustomerZip(customer.zip);
      setCustomerCity(customer.city);
      setCustomerEmail(customer.email);
      setCustomerPhone(customer.phone);
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

  function reserveCurrentDocumentNumberIfNeeded() {
    if (activeSavedDocumentId) {
      return;
    }

    const currentCircle = numberCircleSettings[activeBusinessDocumentType];
    const expectedNextNumber = formatDocumentNumber(currentCircle);

    if (quoteNumber !== expectedNextNumber) {
      return;
    }

    setNumberCircleSettings((current) => ({
      ...current,
      [activeBusinessDocumentType]: {
        ...current[activeBusinessDocumentType],
        nextNumber: current[activeBusinessDocumentType].nextNumber + 1,
      },
    }));
  }

  function handleSwitchBusinessDocumentType(documentType: DocumentType) {
    setActiveBusinessDocumentType(documentType);
    setIntroText(documentTemplateSettings[documentType].introText);
    setDeliveryTerms(documentTemplateSettings[documentType].footerText);
    setDocumentSubject(`${documentTemplateSettings[documentType].label}: ${quotePositions[0]?.title || quoteNumber}`);
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
      customerContactPerson,
      customerStreet,
      customerZip,
      customerCity,
      customerEmail,
      customerPhone,
      date: quoteDate,
      validUntil,
      subject: documentSubject,
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

    reserveCurrentDocumentNumberIfNeeded();

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
    setCustomerContactPerson(documentItem.customerContactPerson ?? "");
    setCustomerStreet(documentItem.customerStreet ?? "");
    setCustomerZip(documentItem.customerZip ?? "");
    setCustomerCity(documentItem.customerCity ?? "");
    setCustomerEmail(documentItem.customerEmail ?? "");
    setCustomerPhone(documentItem.customerPhone ?? "");
    setQuoteDate(documentItem.date);
    setValidUntil(documentItem.validUntil);
    setDocumentSubject(documentItem.subject ?? `${documentTemplateSettings[documentItem.documentType].label}: ${documentItem.positions[0]?.title ?? documentItem.documentNumber}`);
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

    const printTopMm = showLetterhead ? 0 : Math.max(activeBusinessDocumentTemplate.topMm, 0);
    const printBottomMm = showLetterhead ? 0 : Math.max(activeBusinessDocumentTemplate.bottomMm, 0);
    const printLeftMm = showLetterhead ? 0 : Math.max(activeBusinessDocumentTemplate.leftMm, 18);
    const printRightMm = showLetterhead ? 0 : Math.max(activeBusinessDocumentTemplate.rightMm, 18);

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
              font-family: Barlow, Inter, "Segoe UI", Arial, Helvetica, sans-serif;
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
              width: 210mm !important;
              max-width: 210mm !important;
              min-height: 297mm !important;
              height: auto !important;
              margin: 0 auto !important;
              padding: 0 !important;
              box-shadow: none !important;
              border: none !important;
              border-radius: 0 !important;
              background: white !important;
              overflow: visible !important;
            }

            .document-letterhead-background {
              display: block !important;
              left: 0 !important;
              top: 0 !important;
              width: 210mm !important;
              height: 297mm !important;
              object-fit: fill !important;
              max-width: none !important;
              max-height: none !important;
            }

            .document-content-layer {
              position: relative !important;
              z-index: 10 !important;
              min-height: 297mm !important;
            }

            .document-content-layer.with-real-letterhead {
              padding-top: var(--doc-top-mm) !important;
              padding-bottom: var(--doc-bottom-mm) !important;
              padding-left: var(--doc-left-mm) !important;
              padding-right: var(--doc-right-mm) !important;
            }

            .document-content-layer.din-letterhead-content {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            .document-content-layer.din-letterhead-content .quote-preview-card {
              border-radius: 4mm !important;
            }

            .print-area * {
              box-sizing: border-box;
            }

            .document-page {
              position: relative !important;
              width: 210mm !important;
              height: 297mm !important;
              min-height: 297mm !important;
              margin: 0 auto 10mm !important;
              overflow: hidden !important;
              background: white !important;
              page-break-after: always;
              break-after: page;
            }

            .document-page:last-child {
              page-break-after: auto;
              break-after: auto;
              margin-bottom: 0 !important;
            }

            .document-page-background {
              position: absolute !important;
              inset: 0 !important;
              width: 210mm !important;
              height: 297mm !important;
              object-fit: contain !important;
              object-position: center center !important;
              max-width: none !important;
              max-height: none !important;
              z-index: 0 !important;
            }

            .document-page-content {
              position: relative !important;
              z-index: 10 !important;
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
                Angebote V141
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">
                Angebotsvorschau erstellen
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Angebot aus der Kalkulation übernehmen, Kundendaten ergänzen und als saubere Kundenvorschau prüfen.
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

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Angebotsbereich V141
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
              Angebotsentwurf & Kundenvorschau
            </h3>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-500">
              Dokumentdaten, Empfänger, Betreff, Texte und Positionen sind jetzt direkt bearbeitbar. Die Vorschau aktualisiert sich sofort auf dem Briefbogen.
            </p>
          </div>

          <div className="grid min-w-full gap-3 sm:grid-cols-2 xl:min-w-[460px]">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Dokument</p>
              <p className="mt-1 truncate text-lg font-semibold text-slate-950">{activeBusinessDocumentLabel}</p>
              <p className="mt-1 text-sm font-medium text-slate-500">{quoteNumber}</p>
            </div>
            <div className="rounded-3xl bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Status</p>
              <p className="mt-1 text-lg font-semibold text-emerald-900">{documentStatus}</p>
              <p className="mt-1 text-sm font-medium text-emerald-700">{activeSavedDocumentId ? "gespeichert" : "Entwurf offen"}</p>
            </div>
            <div className={`rounded-3xl p-4 ${showLetterhead ? "bg-cyan-50" : "bg-slate-50"}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${showLetterhead ? "text-cyan-700" : "text-slate-400"}`}>Briefbogen</p>
              <p className={`mt-1 text-lg font-semibold ${showLetterhead ? "text-cyan-900" : "text-slate-950"}`}>
                {showUploadedLetterhead ? "Eigener Hintergrund" : showDemoLetterhead ? "Demo aktiv" : "Ohne Hintergrund"}
              </p>
              <p className={`mt-1 text-sm font-medium ${showLetterhead ? "text-cyan-700" : "text-slate-500"}`}>
                für {activeBusinessDocumentLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Kunde</p>
            <p className="mt-2 truncate text-base font-semibold text-slate-950">{quoteCustomerName}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">{selectedCustomer ? selectedCustomer.customerNumber : "Freitext"}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Positionen</p>
            <p className="mt-2 text-base font-semibold text-slate-950">{quotePositions.length}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">aus Kalkulation / manuell</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Netto</p>
            <p className="mt-2 text-base font-semibold text-slate-950">{isDeliveryNote ? "ohne Preise" : formatCurrency(netTotal)}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">zzgl. MwSt.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Brutto</p>
            <p className="mt-2 text-base font-semibold text-slate-950">{isDeliveryNote ? "—" : formatCurrency(grossTotal)}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">Kundenbetrag</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={handleSaveCurrentDocument}
            className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5"
          >
            Entwurf speichern
          </button>
          <button
            type="button"
            onClick={() => handleCreateNextDocumentNumber()}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5"
          >
            Neue Nummer vergeben
          </button>
          <button
            type="button"
            onClick={() => handlePrintDocument("print")}
            className="rounded-2xl bg-cyan-50 px-5 py-3 text-sm font-semibold text-cyan-700 shadow-sm transition hover:-translate-y-0.5"
          >
            Vorschau drucken / PDF
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Nummernkreis V141</p>
            <p className="mt-2 text-base font-semibold text-amber-950">{numberCircleSettings[activeBusinessDocumentType].prefix}-{new Date().getFullYear()}-{String(numberCircleSettings[activeBusinessDocumentType].nextNumber).padStart(numberCircleSettings[activeBusinessDocumentType].padding, "0")}</p>
            <p className="mt-1 text-sm font-medium text-amber-800">nächste freie Nummer</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Aktuelle Nummer</p>
            <p className="mt-2 text-base font-semibold text-slate-950">{quoteNumber}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">manuell überschreibbar</p>
          </div>
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Vergabe</p>
            <p className="mt-2 text-base font-semibold text-emerald-950">automatisch reserviert</p>
            <p className="mt-1 text-sm font-medium text-emerald-700">beim ersten Speichern oder per Button</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-2 w-24 rounded-full bg-gradient-to-r from-yellow-300 via-fuchsia-500 to-cyan-400" />
            <h3 className="mt-5 text-xl font-black">Dokumentkopf</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Kundenauswahl und Stammdaten für die Kundenvorschau V141.
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
                label="Ansprechpartner / z. Hd."
                value={customerContactPerson}
                onChange={setCustomerContactPerson}
              />
              <InputField
                label="Straße"
                value={customerStreet}
                onChange={setCustomerStreet}
              />
              <InputField
                label="PLZ"
                value={customerZip}
                onChange={setCustomerZip}
              />
              <InputField
                label="Ort"
                value={customerCity}
                onChange={setCustomerCity}
              />
              <InputField
                label="E-Mail"
                value={customerEmail}
                onChange={setCustomerEmail}
              />
              <InputField
                label="Telefon"
                value={customerPhone}
                onChange={setCustomerPhone}
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
                  {customerContactPerson || selectedCustomer.contactPerson} ·{" "}
                  {selectedCustomer.customerNumber}
                </p>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  {customerStreet || selectedCustomer.street}, {customerZip || selectedCustomer.zip}{" "}
                  {customerCity || selectedCustomer.city}
                </p>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  {[customerEmail || selectedCustomer.email, customerPhone || selectedCustomer.phone]
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
              <InputField
                label="Betreff"
                value={documentSubject}
                onChange={setDocumentSubject}
              />
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
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <div className="h-2 w-24 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500" />
                <h3 className="mt-5 text-xl font-semibold tracking-tight">Positionen V141</h3>
                <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
                  Positionen sind jetzt als klare Bearbeitungskarten aufgebaut. Titel, Beschreibung, Menge,
                  Einzelpreis und MwSt. ändern die Angebotsvorschau sofort.
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 xl:min-w-[360px]">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Positionen</p>
                  <p className="mt-1 text-lg font-semibold text-slate-950">{quotePositions.length}</p>
                </div>
                <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
                  <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Netto</p>
                  <p className="mt-1 text-lg font-semibold">{formatCurrency(netTotal)}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">MwSt.</p>
                  <p className="mt-1 text-lg font-semibold text-slate-950">
                    {formatCurrency(Math.max(grossTotal - netTotal, 0))}
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Brutto</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-950">{formatCurrency(grossTotal)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-slate-50 p-4">
              <div className="grid gap-3 xl:grid-cols-[1fr_auto_auto] xl:items-end">
                <SelectField
                  label="Leistung aus Stammdaten übernehmen"
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
                  className={`rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition ${
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
                  className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
                >
                  + freie Position
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {quotePositions.map((position, index) => {
                const positionVatRate = getPositionVatRate(position);
                const positionNetTotal = position.quantity * position.unitPrice;
                const positionVatAmount = positionNetTotal * (positionVatRate / 100);
                const positionGrossTotal = positionNetTotal + positionVatAmount;
                const positionIsComplete =
                  position.title.trim().length > 0 &&
                  position.quantity > 0 &&
                  position.unitPrice >= 0;

                return (
                  <div
                    key={position.id}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-base font-semibold tracking-tight text-slate-950">
                              {position.title || `Position ${index + 1}`}
                            </h4>
                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                positionIsComplete
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {positionIsComplete ? "Position OK" : "Prüfen"}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-slate-500">
                            {position.description || "Keine Beschreibung hinterlegt."}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-3 xl:w-[360px]">
                        <div className="rounded-2xl bg-white px-3 py-2 text-right shadow-sm">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Menge</p>
                          <p className="text-sm font-semibold text-slate-950">{formatNumber(position.quantity, 0)}</p>
                        </div>
                        <div className="rounded-2xl bg-white px-3 py-2 text-right shadow-sm">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Netto</p>
                          <p className="text-sm font-semibold text-slate-950">{formatCurrency(positionNetTotal)}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-950 px-3 py-2 text-right text-white shadow-sm">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-white/60">Brutto</p>
                          <p className="text-sm font-semibold">{formatCurrency(positionGrossTotal)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 p-5">
                      <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
                        <InputField
                          label="Positionstitel"
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
                      </div>

                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[0.7fr_0.85fr_0.55fr_0.85fr_0.85fr] xl:items-end">
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
                          value={positionVatRate}
                          onChange={(value) =>
                            updateQuotePosition(position.id, "vatRate", value)
                          }
                          suffix="%"
                        />

                        <ReadOnlyField
                          label="Gesamt netto"
                          value={formatCurrency(positionNetTotal)}
                        />

                        <ReadOnlyField
                          label="Gesamt brutto"
                          value={formatCurrency(positionGrossTotal)}
                        />
                      </div>

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

                      <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 md:flex-row md:items-center md:justify-between">
                        <p className="text-xs font-medium leading-5 text-slate-500">
                          Reihenfolge und Positionstexte werden direkt in die Kundenvorschau übernommen.
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => moveQuotePosition(position.id, "up")}
                            disabled={index === 0}
                            className={`rounded-2xl px-3 py-2 text-xs font-semibold transition ${
                              index === 0
                                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                                : "bg-slate-100 text-slate-700 hover:-translate-y-0.5 hover:bg-slate-200"
                            }`}
                          >
                            ↑ Hoch
                          </button>
                          <button
                            type="button"
                            onClick={() => moveQuotePosition(position.id, "down")}
                            disabled={index === quotePositions.length - 1}
                            className={`rounded-2xl px-3 py-2 text-xs font-semibold transition ${
                              index === quotePositions.length - 1
                                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                                : "bg-slate-100 text-slate-700 hover:-translate-y-0.5 hover:bg-slate-200"
                            }`}
                          >
                            ↓ Runter
                          </button>
                          <button
                            type="button"
                            onClick={() => duplicateQuotePosition(position.id)}
                            className="rounded-2xl bg-indigo-100 px-4 py-2 text-xs font-semibold text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-200"
                          >
                            Duplizieren
                          </button>
                          <button
                            type="button"
                            onClick={() => removeQuotePosition(position.id)}
                            disabled={quotePositions.length <= 1}
                            className={`rounded-2xl px-4 py-2 text-xs font-semibold transition ${
                              quotePositions.length <= 1
                                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                                : "bg-rose-100 text-rose-700 hover:-translate-y-0.5 hover:bg-rose-200"
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
            <h3 className="mt-5 text-xl font-semibold tracking-tight">Angebotsliste / Dokumentverwaltung V141</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Gespeicherte Angebote und Dokumente suchen, filtern, öffnen, duplizieren oder löschen. Status, Kunde, Nummer und Betrag sind direkt sichtbar.
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

            <div className="mt-5 grid gap-3 md:grid-cols-4">
              <button
                type="button"
                onClick={() => {
                  setDocumentTypeFilter("quote");
                  setDocumentStatusFilter("all");
                }}
                className="rounded-3xl border border-yellow-200 bg-yellow-50 p-4 text-left transition hover:-translate-y-0.5"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">Angebote</p>
                <p className="mt-1 text-lg font-semibold text-yellow-950">{quoteDocumentCount}</p>
              </button>
              <button
                type="button"
                onClick={() => setDocumentStatusFilter("Entwurf")}
                className="rounded-3xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Entwürfe</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">{draftDocumentCount}</p>
              </button>
              <button
                type="button"
                onClick={() => setDocumentStatusFilter("Versendet")}
                className="rounded-3xl border border-cyan-200 bg-cyan-50 p-4 text-left transition hover:-translate-y-0.5"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Gesendet</p>
                <p className="mt-1 text-lg font-semibold text-cyan-950">{sentDocumentCount}</p>
              </button>
              <button
                type="button"
                onClick={() => setDocumentStatusFilter("Angenommen")}
                className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-left transition hover:-translate-y-0.5"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Angenommen</p>
                <p className="mt-1 text-lg font-semibold text-emerald-950">{acceptedDocumentCount}</p>
              </button>
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
                  Kundenvorschau V141
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
              className="print-area relative mx-auto mt-8 w-full max-w-[210mm] overflow-visible rounded-[2rem] border border-slate-200 bg-white p-0 shadow-sm"
              style={
                {
                  "--doc-top-mm": `${documentContentTopMm}mm`,
                  "--doc-bottom-mm": `${documentContentBottomMm}mm`,
                  "--doc-left-mm": `${documentContentLeftMm}mm`,
                  "--doc-right-mm": `${documentContentRightMm}mm`,
                } as CSSProperties
              }
            >
              {useRealLetterheadBackground ? (
                <div className="document-page-stack space-y-8 print:space-y-0">
                  {letterheadPositionPages.map((pagePositions, pageIndex) => {
                    const isFirstPage = pageIndex === 0;
                    const isLastPage = pageIndex === letterheadPositionPages.length - 1;
                    const startPositionNumber = letterheadPositionPages
                      .slice(0, pageIndex)
                      .reduce((sum, page) => sum + page.length, 0);

                    return (
                      <section
                        key={`letterhead-page-${pageIndex}`}
                        className="document-page relative h-[297mm] min-h-[297mm] w-[210mm] overflow-hidden bg-white shadow-sm print:shadow-none"
                      >
                        <img
                          src={activeBusinessDocumentTemplate.letterheadDataUrl}
                          alt="Briefbogen-Hintergrund"
                          className="document-page-background pointer-events-none absolute inset-0"
                          style={{
                            opacity: activeLetterheadOpacity / 100,
                            width: "210mm",
                            height: "297mm",
                            objectFit: "contain",
                            objectPosition: "center center",
                          }}
                        />

                        <div className="document-page-content relative z-10 h-full text-slate-800">
                          <div className="absolute left-[20mm] top-[52mm] w-[85mm]">
                            {isFirstPage ? (
                              <>
                                <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                                  Empfänger
                                </p>
                                <div className="mt-[4mm] space-y-[1.5mm] text-[11px] font-medium leading-tight text-slate-800">
                                  {customerAddressLines.map((line) => (
                                    <p key={line}>{line}</p>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <div className="rounded-[3mm] bg-white/85 px-[4mm] py-[3mm] text-[9px] font-medium text-slate-500">
                                {activeBusinessDocumentLabel} {quoteNumber} · Seite {pageIndex + 1}
                              </div>
                            )}
                          </div>

                          {isFirstPage && (
                            <>
                              <div className="absolute left-[20mm] right-[20mm] top-[88mm] rounded-[4mm] border border-slate-200 bg-white/88 p-[5mm]">
                                <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-400">
                                  Kundendaten
                                </p>
                                <div className="mt-[3mm] grid gap-[2mm] text-[9px] font-medium">
                                  {customerMetaRows.length > 0 ? (
                                    customerMetaRows.map((row) => (
                                      <div key={row.label} className="flex justify-between gap-[8mm]">
                                        <span className="text-slate-400">{row.label}</span>
                                        <span className="text-right text-slate-700">{row.value}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-slate-500">Freitext-Kunde ohne Stammdaten</p>
                                  )}
                                </div>
                              </div>

                              <div className="absolute left-[20mm] right-[20mm] top-[130mm]">
                                <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-400">
                                  Betreff
                                </p>
                                <h4 className="mt-[2.5mm] text-[16px] font-medium leading-tight tracking-normal text-slate-950">
                                  {documentSubject}
                                </h4>
                                <p className="mt-[3.5mm] text-[9.5px] font-medium leading-[1.42] text-slate-600">
                                  {introText}
                                </p>
                              </div>
                            </>
                          )}

                          <div
                            className={`${isFirstPage ? "absolute left-[20mm] right-[20mm] top-[154mm] bottom-[49mm]" : "absolute left-[20mm] right-[20mm] top-[44mm] bottom-[49mm]"} overflow-hidden`}
                          >
                            {!isFirstPage && (
                              <div className="mb-[4mm] flex items-center justify-between border-b border-slate-200 pb-[2mm]">
                                <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                                  Leistungen · Fortsetzung
                                </p>
                                <p className="text-[9px] font-medium text-slate-400">
                                  Seite {pageIndex + 1} / {letterheadPositionPages.length}
                                </p>
                              </div>
                            )}

                            <div className="overflow-hidden rounded-[3.5mm] border border-slate-200 bg-white/90">
                              <div
                                className={`grid gap-[2mm] bg-slate-100 px-[4mm] py-[1.7mm] text-[7.7px] font-semibold uppercase tracking-wide text-slate-500 ${
                                  isDeliveryNote
                                    ? "grid-cols-[1fr_0.3fr]"
                                    : "grid-cols-[1fr_0.22fr_0.28fr_0.2fr_0.32fr]"
                                }`}
                              >
                                <span>Leistung</span>
                                <span className="text-right">Menge</span>
                                {!isDeliveryNote && <span className="text-right">Einzel</span>}
                                {!isDeliveryNote && <span className="text-right">MwSt.</span>}
                                {!isDeliveryNote && <span className="text-right">Gesamt</span>}
                              </div>

                              {pagePositions.map((position, positionIndex) => {
                                const positionTotal = position.quantity * position.unitPrice;
                                const absolutePositionIndex = startPositionNumber + positionIndex;

                                return (
                                  <div
                                    key={position.id}
                                    className={`grid gap-[2mm] border-t border-slate-100 px-[4mm] py-[1.75mm] text-[8.4px] ${
                                      isDeliveryNote
                                        ? "grid-cols-[1fr_0.3fr]"
                                        : "grid-cols-[1fr_0.22fr_0.28fr_0.2fr_0.32fr]"
                                    }`}
                                  >
                                    <div>
                                      <p className="font-semibold text-slate-950">
                                        {absolutePositionIndex + 1}. {position.title}
                                      </p>
                                      <p className="mt-[0.7mm] whitespace-pre-line text-[7.4px] font-medium leading-[1.18] text-slate-500">
                                        {position.description}
                                      </p>
                                    </div>
                                    <p className="text-right font-medium text-slate-600">
                                      {position.quantity.toLocaleString("de-DE")}
                                    </p>
                                    {!isDeliveryNote && (
                                      <p className="text-right font-medium text-slate-600">
                                        {formatCurrency(position.unitPrice)}
                                      </p>
                                    )}
                                    {!isDeliveryNote && (
                                      <p className="text-right font-medium text-slate-600">
                                        {formatNumber(getPositionVatRate(position), 0)} %
                                      </p>
                                    )}
                                    {!isDeliveryNote && (
                                      <p className="text-right font-semibold text-slate-950">
                                        {formatCurrency(positionTotal)}
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {isLastPage && !isDeliveryNote && (
                              <div className="mt-[4mm] flex justify-end">
                                <div className="w-[78mm] overflow-hidden rounded-[3.5mm] border border-slate-200 bg-white/92">
                                  <div className="flex items-center justify-between border-b border-slate-100 px-[4mm] py-[1.85mm] text-[9px] font-medium text-slate-600">
                                    <span>Netto</span>
                                    <span>{formatCurrency(netTotal)}</span>
                                  </div>
                                  {vatTotals.length > 0 ? (
                                    vatTotals.map((taxLine) => (
                                      <div
                                        key={taxLine.rate}
                                        className="flex items-center justify-between border-b border-slate-100 px-[4mm] py-[1.85mm] text-[9px] font-medium text-slate-600"
                                      >
                                        <span>MwSt. {formatNumber(taxLine.rate, 0)} %</span>
                                        <span>{formatCurrency(taxLine.amount)}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="flex items-center justify-between border-b border-slate-100 px-[4mm] py-[1.85mm] text-[9px] font-medium text-slate-600">
                                      <span>MwSt.</span>
                                      <span>{formatCurrency(0)}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between bg-slate-950 px-[4mm] py-[2.2mm] text-[9px] font-semibold text-white">
                                    <span>Brutto</span>
                                    <span>{formatCurrency(grossTotal)}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {isLastPage && (
                            <div className="absolute left-[20mm] right-[20mm] bottom-[33mm] border-t border-slate-200 pt-[2.4mm] text-[8.2px] font-medium leading-[1.34] text-slate-600">
                              <p className="mb-[1.5mm] text-[7.5px] font-semibold uppercase tracking-wide text-slate-400">
                                Hinweise & Bedingungen
                              </p>
                              <p>{deliveryTerms}</p>
                              {!isDeliveryNote && <p className="mt-[1.4mm]">{paymentTerms}</p>}
                              {showCompanyFooterData && documentFooterLines.length > 0 && !showFooterInLetterheadBar && (
                                <div className="mt-[2mm] grid gap-[1mm] text-[7.5px] leading-[1.35] text-slate-500">
                                  {documentFooterLines.map((line) => (
                                    <p key={line}>{line}</p>
                                  ))}
                                </div>
                              )}
                              {isDeliveryNote && (
                                <p className="mt-[2mm] font-semibold text-slate-700">
                                  Ware ordnungsgemäß erhalten: ______________________________
                                </p>
                              )}
                            </div>
                          )}

                          {showFooterInLetterheadBar && documentFooterGroups.length > 0 && (
                            <div
                              className={`absolute left-[20mm] right-[20mm] grid gap-[5mm] overflow-hidden ${
                                documentFooterColumns === "2" ? "grid-cols-2" : "grid-cols-3"
                              } ${
                                documentFooterTextTone === "white"
                                  ? "text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.28)]"
                                  : "text-slate-950"
                              }`}
                              style={{
                                bottom: `${documentFooterBottomMm}mm`,
                                height: `${documentFooterHeightMm}mm`,
                              }}
                            >
                              {documentFooterGroups.map((group) => (
                                <div key={group.title} className="min-w-0">
                                  <p className={`text-[6.8px] font-semibold uppercase tracking-[0.18em] ${
                                    documentFooterTextTone === "white" ? "text-white/80" : "text-slate-700"
                                  }`}>
                                    {group.title}
                                  </p>
                                  <div className="mt-[1.1mm] space-y-[0.55mm] text-[6.9px] font-medium leading-[1.18]">
                                    {group.lines.map((line) => (
                                      <p key={line} className="break-words">{line}</p>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </section>
                    );
                  })}
                </div>
              ) : (
                <>
              {showUploadedLetterhead && (
                <img
                  src={activeBusinessDocumentTemplate.letterheadDataUrl}
                  alt="Briefbogen-Hintergrund"
                  className="document-letterhead-background pointer-events-none absolute left-0 top-0"
                  style={{
                    opacity: activeLetterheadOpacity / 100,
                    width: "210mm",
                    height: "297mm",
                    objectFit: "fill",
                  }}
                />
              )}
              {showDemoLetterhead && (
                <div
                  className="document-letterhead-background pointer-events-none absolute inset-0"
                  style={{
                    opacity: activeLetterheadOpacity / 100,
                    background:
                      "linear-gradient(135deg, rgba(6,199,242,0.18), transparent 35%), linear-gradient(315deg, rgba(225,57,242,0.16), transparent 32%), linear-gradient(0deg, rgba(255,208,28,0.12), transparent 28%)",
                  }}
                />
              )}
              <div
                className={`document-content-layer relative z-10 ${useRealLetterheadBackground ? "with-real-letterhead din-letterhead-content" : ""}`}
                style={{
                  paddingTop: useRealLetterheadBackground ? undefined : `${documentContentTopMm}mm`,
                  paddingBottom: useRealLetterheadBackground ? undefined : `${documentContentBottomMm}mm`,
                  paddingLeft: useRealLetterheadBackground ? undefined : `${documentContentLeftMm}mm`,
                  paddingRight: useRealLetterheadBackground ? undefined : `${documentContentRightMm}mm`,
                }}
              >
              {!useRealLetterheadBackground && (
              <div className="-mx-6 -mt-6 mb-6 border-b border-slate-200 bg-slate-50 px-6 py-4 print:hidden">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Kundenvorschau V141</p>
                    <p className="mt-1 text-sm font-medium text-slate-600">So wirkt das Dokument später im Druck oder als PDF.</p>
                  </div>
                  <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Layout prüfbar</div>
                </div>
              </div>
              )}

              {!useRealLetterheadBackground && (
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
              )}

              {!useRealLetterheadBackground && (
              <div className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-600 md:grid-cols-4">
                <div>
                  <p className="font-semibold uppercase tracking-wide text-slate-400">Dokument</p>
                  <p className="mt-1 text-slate-900">{activeBusinessDocumentLabel}</p>
                </div>
                <div>
                  <p className="font-semibold uppercase tracking-wide text-slate-400">Nummer</p>
                  <p className="mt-1 text-slate-900">{quoteNumber}</p>
                </div>
                <div>
                  <p className="font-semibold uppercase tracking-wide text-slate-400">Datum</p>
                  <p className="mt-1 text-slate-900">{quoteDate}</p>
                </div>
                <div>
                  <p className="font-semibold uppercase tracking-wide text-slate-400">{activeBusinessDocumentType === "invoice" ? "Fällig" : activeBusinessDocumentType === "deliveryNote" ? "Lieferdatum" : "Gültig bis"}</p>
                  <p className="mt-1 text-slate-900">{validUntil}</p>
                </div>
              </div>
              )}

              {companySenderLine && !useRealLetterheadBackground && (
                <p className="mt-8 border-b border-slate-200 pb-1 text-[10px] font-bold text-slate-400">
                  {companySenderLine}
                </p>
              )}

              <div className={`grid gap-6 md:grid-cols-[1fr_0.9fr] ${useRealLetterheadBackground ? "mt-0" : "mt-4"}`}>
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

              <div className={useRealLetterheadBackground ? "mt-7" : "mt-10"}>
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                  Betreff
                </p>
                <h4 className="mt-2 text-xl font-semibold tracking-normal text-slate-950">
                  {documentSubject}
                </h4>
                <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
                  {introText}
                </p>
              </div>

              <div className={useRealLetterheadBackground ? "mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white" : "mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white"}>
                <div
                  className={`grid gap-3 bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
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
                      className={`grid gap-3 border-t border-slate-100 px-4 py-3 text-sm ${
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
                <div className={useRealLetterheadBackground ? "mt-5 flex justify-end" : "mt-8 flex justify-end"}>
                  <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5 text-sm font-bold text-slate-600">
                      <span>Netto</span>
                      <span>{formatCurrency(netTotal)}</span>
                    </div>
                    {vatTotals.length > 0 ? (
                      vatTotals.map((taxLine) => (
                        <div
                          key={taxLine.rate}
                          className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5 text-sm font-bold text-slate-600"
                        >
                          <span>MwSt. {formatNumber(taxLine.rate, 0)} %</span>
                          <span>{formatCurrency(taxLine.amount)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5 text-sm font-bold text-slate-600">
                        <span>MwSt.</span>
                        <span>{formatCurrency(0)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between bg-slate-950 px-4 py-3 text-sm font-black text-white">
                      <span>Brutto</span>
                      <span>{formatCurrency(grossTotal)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className={useRealLetterheadBackground ? "mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm font-medium leading-6 text-slate-600" : "mt-8 space-y-3 border-t border-slate-200 pt-5 text-sm font-medium leading-7 text-slate-600"}>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Hinweise & Bedingungen</p>
                <p>{deliveryTerms}</p>
                {!isDeliveryNote && <p>{paymentTerms}</p>}
                {isDeliveryNote && (
                  <p className="font-bold text-slate-700">
                    Ware ordnungsgemäß erhalten: ______________________________
                  </p>
                )}
              </div>

              {!useRealLetterheadBackground && showCompanyFooterData && documentFooterLines.length > 0 && (
              <div className="mt-8 grid gap-3 border-t border-slate-200 pt-5 text-xs font-medium leading-5 text-slate-500 md:grid-cols-2">
                {documentFooterLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              )}
              </div>
                </>
              )}
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
                Kundenverwaltung V3
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

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[0.8fr_1.45fr_1fr_1fr_1.25fr_0.7fr] gap-3 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-extrabold uppercase tracking-wide text-slate-400 md:grid">
          <span>Kd.-Nr.</span>
          <span>Kunde</span>
          <span>Ansprechpartner</span>
          <span>Ort</span>
          <span>E-Mail</span>
          <span>Status</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredCustomers.map((customer) => {
            const statusClass =
              customer.status === "Aktiv"
                ? "bg-emerald-100 text-emerald-700"
                : customer.status === "Interessent"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-slate-100 text-slate-500";

            const address =
              [
                customer.street,
                [customer.zip, customer.city].filter(Boolean).join(" "),
              ]
                .filter(Boolean)
                .join(", ") || "—";

            return (
              <details
                key={customer.id}
                className="group bg-white open:bg-slate-50/60 [&>summary::-webkit-details-marker]:hidden"
              >
                <summary className="grid cursor-pointer gap-3 px-5 py-4 text-sm transition hover:bg-slate-50 md:grid-cols-[0.8fr_1.45fr_1fr_1fr_1.25fr_0.7fr] md:items-center">
                  <span className="font-black text-slate-950">
                    {customer.customerNumber}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-black text-slate-950">
                      {customer.company}
                    </span>
                    <span className="mt-1 block text-xs font-bold text-slate-400 md:hidden">
                      {address}
                    </span>
                  </span>
                  <span className="truncate font-bold text-slate-600">
                    {customer.contactPerson || "—"}
                  </span>
                  <span className="truncate font-bold text-slate-600">
                    {customer.city || "—"}
                  </span>
                  <span className="truncate font-bold text-slate-600">
                    {customer.email || "—"}
                  </span>
                  <span>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${statusClass}`}
                    >
                      {customer.status}
                    </span>
                  </span>
                </summary>

                <div className="border-t border-slate-100 px-5 py-5">
                  <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-start">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <InfoCard label="Adresse" value={address} />
                      <InfoCard label="Telefon" value={customer.phone || "—"} />
                      <InfoCard label="E-Mail" value={customer.email || "—"} />
                      <InfoCard
                        label="Kundennummer"
                        value={customer.customerNumber}
                      />
                    </div>

                    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                        Notiz
                      </p>
                      <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        {customer.notes || "Keine Notiz hinterlegt."}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
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
                </div>
              </details>
            );
          })}
        </div>
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
  const [expandedTemplateId, setExpandedTemplateId] = useState<string | null>(
    null,
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

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[1.1fr_0.7fr_0.8fr_0.7fr_0.55fr_0.75fr] gap-4 bg-slate-950 px-5 py-4 text-xs font-black uppercase tracking-wide text-white">
          <span>Vorlage</span>
          <span>Produkttyp</span>
          <span>Format</span>
          <span>Maschine</span>
          <span>Status</span>
          <span className="text-right">Aktionen</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredTemplates.map((template) => {
            const machine = machines.find(
              (item) => item.id === template.machineId,
            );
            const rawMaterial = materials.find(
              (item) => item.id === template.rawSheetMaterialId,
            );
            const isExpanded = expandedTemplateId === template.id;
            const statusClass =
              template.status === "Aktiv"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-500";

            return (
              <article key={template.id} className="bg-white">
                <div className="grid grid-cols-[1.1fr_0.7fr_0.8fr_0.7fr_0.55fr_0.75fr] gap-4 px-5 py-4 text-sm md:items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedTemplateId(isExpanded ? null : template.id)
                    }
                    className="min-w-0 text-left"
                  >
                    <p className="truncate font-black text-slate-950">
                      {template.name}
                    </p>
                    <p className="mt-1 truncate text-xs font-bold text-slate-500">
                      {template.productName} · {template.defaultQuantity.toLocaleString("de-DE")} Stück
                    </p>
                  </button>

                  <div className="min-w-0">
                    <span className="inline-flex max-w-full rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                      <span className="truncate">{template.productType}</span>
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="font-black text-slate-800">
                      {template.finalWidthMm} × {template.finalHeightMm} mm
                    </p>
                    <p className="mt-1 text-xs font-bold text-slate-400">
                      Beschnitt {template.bleedMm} mm
                    </p>
                  </div>

                  <p className="min-w-0 truncate font-bold text-slate-600">
                    {machine?.name ?? "—"}
                  </p>

                  <div>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${statusClass}`}>
                      {template.status}
                    </span>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedTemplateId(isExpanded ? null : template.id)
                      }
                      className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-200"
                    >
                      {isExpanded ? "Zuklappen" : "Details"}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditTemplateForm(template)}
                      className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white"
                    >
                      Bearbeiten
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-5">
                    <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
                      <div className="rounded-3xl bg-white p-5 shadow-sm">
                        <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                          Produktion
                        </p>
                        <div className="mt-4 space-y-3">
                          <CostRow label="Farbmodus" value={template.colorMode} />
                          <CostRow
                            label="Standard-Rohbogen"
                            value={
                              rawMaterial
                                ? `${rawMaterial.name} · ${rawMaterial.widthMm} × ${rawMaterial.heightMm} mm`
                                : "—"
                            }
                          />
                          <CostRow
                            label="Drehung"
                            value={template.allowRotation ? "erlaubt" : "gesperrt"}
                          />
                          <CostRow
                            label="Laufrichtung"
                            value={
                              template.respectGrainDirection ? "beachten" : "ignorieren"
                            }
                          />
                        </div>
                      </div>

                      <div className="rounded-3xl bg-white p-5 shadow-sm">
                        <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                          Nutzenbasis
                        </p>
                        <div className="mt-4 space-y-3">
                          <CostRow
                            label="Broschürenmodus"
                            value={
                              template.calculateAsOpenSpread
                                ? "offene Doppelseite"
                                : "geschlossenes Format"
                            }
                          />
                          <CostRow
                            label="Bundbeschnitt"
                            value={
                              template.removeSpineBleed
                                ? "ohne Beschnitt im Bund"
                                : "Beschnitt rundum"
                            }
                          />
                          <CostRow
                            label="Zwischenschnitt"
                            value={`H ${template.gutterHorizontalMm} mm / V ${template.gutterVerticalMm} mm`}
                          />
                        </div>
                      </div>

                      <div className="rounded-3xl bg-white p-5 shadow-sm">
                        <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                          Aktionen
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
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
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div className="rounded-3xl bg-white p-5 shadow-sm">
                        <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                          Materialien
                        </p>
                        <div className="mt-4 space-y-3">
                          {template.materialSelections.map((selection, index) => {
                            const material = materials.find(
                              (item) => item.id === selection.materialId,
                            );

                            return (
                              <div
                                key={`${template.id}-material-${index}`}
                                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                              >
                                <p className="font-black text-slate-950">
                                  {selection.label || `Material ${index + 1}`}
                                </p>
                                <p className="mt-1 text-sm font-bold text-slate-500">
                                  {material
                                    ? `${material.name} · ${material.widthMm} × ${material.heightMm} mm · ${material.grammage} g/m²`
                                    : "Material nicht gefunden"}
                                </p>
                                <p className="mt-2 text-xs font-bold text-slate-400">
                                  Berechnung: {selection.calculationMode} · Seiten {selection.pages} · Seiten/Bg. {selection.pagesPerSheet}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="rounded-3xl bg-white p-5 shadow-sm">
                        <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                          Weiterverarbeitung
                        </p>
                        {template.finishingNames.length > 0 ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {template.finishingNames.map((name, index) => (
                              <span
                                key={`${template.id}-finishing-${index}`}
                                className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-600"
                              >
                                {name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-4 text-sm font-bold text-slate-500">
                            Keine Weiterverarbeitung hinterlegt.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
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
                Leistungsstamm V2
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

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[0.85fr_1.55fr_1fr_0.7fr_0.8fr_0.6fr_0.7fr] gap-3 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-extrabold uppercase tracking-wide text-slate-400 md:grid">
          <span>Art.-Nr.</span>
          <span>Bezeichnung</span>
          <span>Kategorie</span>
          <span>Einheit</span>
          <span>Preis</span>
          <span>MwSt.</span>
          <span>Status</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredServiceItems.map((item) => {
            const statusClass =
              item.status === "Aktiv"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-500";

            return (
              <details
                key={item.id}
                className="group bg-white open:bg-slate-50/60 [&>summary::-webkit-details-marker]:hidden"
              >
                <summary className="grid cursor-pointer gap-3 px-5 py-4 text-sm transition hover:bg-slate-50 md:grid-cols-[0.85fr_1.55fr_1fr_0.7fr_0.8fr_0.6fr_0.7fr] md:items-center">
                  <span className="font-black text-slate-950">
                    {item.itemNumber}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-black text-slate-950">
                      {item.title}
                    </span>
                    <span className="mt-1 block truncate text-xs font-bold text-slate-400 md:hidden">
                      {item.category} · {formatCurrency(item.unitPrice)}
                    </span>
                  </span>
                  <span className="truncate font-bold text-slate-600">
                    {item.category || "—"}
                  </span>
                  <span className="font-bold text-slate-600">
                    {item.unit || "—"}
                  </span>
                  <span className="font-black text-slate-950">
                    {formatCurrency(item.unitPrice)}
                  </span>
                  <span className="font-bold text-slate-600">
                    {formatNumber(item.vatRate, 0)} %
                  </span>
                  <span>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${statusClass}`}
                    >
                      {item.status}
                    </span>
                  </span>
                </summary>

                <div className="border-t border-slate-100 px-5 py-5">
                  <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-start">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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

                    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                        Beschreibung
                      </p>
                      <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        {item.description || "Keine Beschreibung hinterlegt."}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
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
                </div>
              </details>
            );
          })}
        </div>
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
  const [expandedMaterialId, setExpandedMaterialId] = useState<string | null>(
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

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[1.6fr_0.9fr_0.8fr_0.9fr_0.9fr_0.8fr_auto] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-extrabold uppercase tracking-wide text-slate-400 lg:grid">
          <span>Material</span>
          <span>Format</span>
          <span>Grammatur</span>
          <span>Preis/Bogen</span>
          <span>Bestand</span>
          <span>Status</span>
          <span className="text-right">Aktionen</span>
        </div>

        <div className="divide-y divide-slate-100">
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
            const isExpanded = expandedMaterialId === material.id;
            const stockPercentage =
              material.minimumStockSheets > 0
                ? Math.min(
                    (material.stockSheets / material.minimumStockSheets) * 100,
                    160,
                  )
                : 100;

            return (
              <article key={material.id} className="bg-white">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedMaterialId((current) =>
                      current === material.id ? null : material.id,
                    )
                  }
                  className="grid w-full gap-3 px-5 py-4 text-left transition hover:bg-slate-50 lg:grid-cols-[1.6fr_0.9fr_0.8fr_0.9fr_0.9fr_0.8fr_auto] lg:items-center lg:gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                        {material.type || "Material"}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                        {getPricingModeLabel(material.pricingMode)}
                      </span>
                    </div>
                    <p className="mt-2 truncate text-base font-black text-slate-950">
                      {material.name}
                    </p>
                    <p className="mt-1 truncate text-xs font-bold text-slate-500">
                      {material.supplier || "kein Lieferant"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400 lg:hidden">
                      Format
                    </p>
                    <p className="text-sm font-black text-slate-700">
                      {material.widthMm} × {material.heightMm} mm
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400 lg:hidden">
                      Grammatur
                    </p>
                    <p className="text-sm font-black text-slate-700">
                      {material.grammage > 0
                        ? `${material.grammage} g/m²`
                        : "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400 lg:hidden">
                      Preis/Bogen
                    </p>
                    <p className="text-sm font-black text-slate-950">
                      {formatCurrency(pricePerSheet)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400 lg:hidden">
                      Bestand
                    </p>
                    <p className="text-sm font-black text-slate-700">
                      {material.stockSheets.toLocaleString("de-DE")} Bg.
                    </p>
                    <p className="mt-1 text-xs font-bold text-slate-400">
                      Min. {material.minimumStockSheets.toLocaleString("de-DE")}
                    </p>
                  </div>

                  <div>
                    <span
                      className={
                        isLowStock
                          ? "inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700"
                          : "inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700"
                      }
                    >
                      {isLowStock ? "Nachbestellen" : "Okay"}
                    </span>
                  </div>

                  <div className="flex gap-2 lg:justify-end">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setEditingMaterialId(material.id);
                        setExpandedMaterialId(material.id);
                      }}
                      className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white transition hover:-translate-y-0.5"
                    >
                      Bearbeiten
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteMaterial(material.id);
                      }}
                      disabled={materials.length <= 1}
                      className={
                        materials.length <= 1
                          ? "cursor-not-allowed rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-400"
                          : "rounded-xl bg-rose-100 px-3 py-2 text-xs font-black text-rose-700 transition hover:-translate-y-0.5"
                      }
                    >
                      Löschen
                    </button>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-5">
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <InfoCard
                        label="Laufrichtung"
                        value={material.grainDirection}
                      />
                      <InfoCard
                        label="Preisart"
                        value={getPricingModeLabel(material.pricingMode)}
                      />
                      <InfoCard
                        label="Fläche/Bogen"
                        value={`${formatNumber(areaSqm, 4)} m²`}
                      />
                      <InfoCard
                        label="Gewicht/Bogen"
                        value={
                          material.grammage > 0
                            ? `${formatNumber(weightKg * 1000, 1)} g`
                            : "—"
                        }
                      />
                      <InfoCard
                        label="Preis/Ries"
                        value={formatCurrency(material.pricePerReam)}
                      />
                      <InfoCard
                        label="Preis/kg"
                        value={formatCurrency(material.pricePerKg)}
                      />
                      <InfoCard
                        label="Bogen/Ries"
                        value={String(material.sheetsPerReam)}
                      />
                      <InfoCard
                        label="Lagerwert"
                        value={formatCurrency(
                          material.stockSheets * pricePerSheet,
                        )}
                      />
                    </div>

                    <div className="mt-5 rounded-2xl bg-white p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                            Lagerbestand
                          </p>
                          <p className="mt-1 text-xl font-black text-slate-950">
                            {material.stockSheets.toLocaleString("de-DE")} Bogen
                          </p>
                          <p className="mt-1 text-sm font-bold text-slate-500">
                            Mindestbestand: {material.minimumStockSheets.toLocaleString("de-DE")} Bogen
                          </p>
                        </div>
                        <div
                          className={
                            isLowStock
                              ? "rounded-2xl bg-rose-100 px-4 py-3 text-rose-700"
                              : "rounded-2xl bg-emerald-100 px-4 py-3 text-emerald-700"
                          }
                        >
                          <p className="text-xs font-extrabold uppercase tracking-wide">
                            Status
                          </p>
                          <p className="mt-1 text-sm font-black">
                            {isLowStock ? "Nachbestellen" : "Bestand okay"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={
                            isLowStock
                              ? "h-full rounded-full bg-rose-500"
                              : "h-full rounded-full bg-emerald-500"
                          }
                          style={{
                            width: `${Math.max(Math.min(stockPercentage, 100), 4)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
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
  const [expandedMachineId, setExpandedMachineId] = useState<string | null>(null);

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
                Maschinenverwaltung V5
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">
                Maschinen-Stammdaten
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Maschinen kompakt verwalten, bei Bedarf Details ausklappen und
                inklusive Tinten-/Kartuschenkosten dauerhaft speichern.
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

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[1.15fr_0.8fr_0.8fr_0.75fr_0.75fr_0.85fr_auto] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-extrabold uppercase tracking-wide text-slate-400 xl:grid">
          <span>Maschine</span>
          <span>Typ</span>
          <span>Kostenmodell</span>
          <span>Status</span>
          <span>Stundensatz</span>
          <span>Format</span>
          <span className="text-right">Aktionen</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredMachines.map((machine) => {
            const machineCostModel = getMachineCostModel(machine.name);
            const statusClass =
              machine.status === "Bereit"
                ? "bg-emerald-100 text-emerald-700"
                : machine.status === "Wartung"
                  ? "bg-rose-100 text-rose-700"
                  : "bg-orange-100 text-orange-700";
            const isExpanded = expandedMachineId === machine.id;

            return (
              <article key={machine.id} className="bg-white">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedMachineId(isExpanded ? null : machine.id)
                  }
                  className="grid w-full gap-4 px-5 py-4 text-left transition hover:bg-slate-50 xl:grid-cols-[1.15fr_0.8fr_0.8fr_0.75fr_0.75fr_0.85fr_auto] xl:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-950">
                      {machine.name}
                    </p>
                    <p className="mt-1 text-xs font-bold text-slate-400 xl:hidden">
                      {machine.type} · {getMachineCostModelLabel(machineCostModel)} · {machine.maxWidthMm} × {machine.maxHeightMm} mm
                    </p>
                  </div>

                  <p className="hidden truncate text-sm font-bold text-slate-600 xl:block">
                    {machine.type}
                  </p>

                  <span className="hidden w-fit rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 xl:inline-flex">
                    {getMachineCostModelLabel(machineCostModel)}
                  </span>

                  <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${statusClass}`}>
                    {machine.status}
                  </span>

                  <p className="hidden text-sm font-black text-slate-700 xl:block">
                    {formatCurrency(machine.hourlyRate)} / h
                  </p>

                  <p className="hidden text-sm font-bold text-slate-600 xl:block">
                    {machine.maxWidthMm} × {machine.maxHeightMm} mm
                  </p>

                  <div className="flex items-center justify-between gap-2 xl:justify-end">
                    <span className="text-xs font-black text-slate-400 xl:hidden">
                      {formatCurrency(machine.hourlyRate)} / h
                    </span>
                    <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-600">
                      {isExpanded ? "Schließen" : "Details"}
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-5">
                    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                      <div className="rounded-3xl bg-white p-5 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="flex flex-wrap gap-2">
                              <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                                {machine.type}
                              </span>
                              <span className={`rounded-full px-3 py-1 text-xs font-black ${statusClass}`}>
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
                              Max. Format: {machine.maxWidthMm} × {machine.maxHeightMm} mm · Rüstzeit Standard: {machine.setupMinutesDefault} Min.
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

                        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          <InfoCard label="Kostenmodell" value={getMachineCostModelLabel(machineCostModel)} />
                          {machineCostModel === "click" && (
                            <>
                              <InfoCard
                                label="Farbklick"
                                value={machine.colorClickCost > 0 ? `${formatCurrency(machine.colorClickCost)} / Klick` : "—"}
                              />
                              <InfoCard
                                label="S/W-Klick"
                                value={machine.blackClickCost > 0 ? `${formatCurrency(machine.blackClickCost)} / Klick` : "—"}
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
                          <InfoCard label="Stundensatz" value={`${formatCurrency(machine.hourlyRate)} / h`} />
                          <InfoCard label="Duplex" value={machine.duplex ? "Ja" : "Nein"} />
                          <InfoCard label="Max. Format" value={`${machine.maxWidthMm} × ${machine.maxHeightMm} mm`} />
                          <InfoCard
                            label="Leistung"
                            value={machine.speedSheetsPerHour > 0 ? `${machine.speedSheetsPerHour.toLocaleString("de-DE")} Bg./h` : "Rollenabhängig"}
                          />
                          <InfoCard
                            label={machineCostModel === "roland" ? "Produktionsarten" : "Farbmodi"}
                            value={
                              getAllowedColorModes(machine.name, machineCostModel)
                                .map((mode) => mode.label)
                                .join(", ") || "Drucken, Drucken + Schneiden, Nur Schneiden"
                            }
                          />
                        </div>
                      </div>

                      <div className="rounded-3xl bg-white p-5 shadow-sm">
                        <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                          Besonderheiten & Notizen
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {machine.specialFeatures.length > 0 ? (
                            machine.specialFeatures.map((feature) => (
                              <span
                                key={feature}
                                className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-600"
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

                        {machineCostModel !== "click" && (
                          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                              Tintenkanäle
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {(machine.inkChannels ?? [])
                                .filter((channel) => channel.active)
                                .map((channel) => (
                                  <span
                                    key={channel.id}
                                    className="rounded-full bg-white px-3 py-2 text-xs font-black text-slate-600 shadow-sm"
                                  >
                                    {channel.name}
                                  </span>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
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
  const [expandedOperationId, setExpandedOperationId] = useState<string | null>(
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
        operation.notes.toLowerCase().includes(normalizedSearch) ||
        getFinishingPricingModeLabel(operation.pricingMode)
          .toLowerCase()
          .includes(normalizedSearch);

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
    setExpandedOperationId(nextOperation.id);
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

    if (editingOperationId === operationId) setEditingOperationId(null);
    if (expandedOperationId === operationId) setExpandedOperationId(null);
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
    setExpandedOperationId(null);
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
                Weiterverarbeitung V3
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">
                Weiterverarbeitung
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Kompakte Listenansicht für Schneiden, Falzen, Rillen, Heften,
                Leimen, Stanzen, Kuvertieren und Handarbeit.
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

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[1.2fr_0.75fr_0.8fr_0.55fr_0.55fr_auto] gap-4 bg-slate-950 px-5 py-4 text-xs font-black uppercase tracking-wide text-white">
          <span>Vorgang</span>
          <span>Kategorie</span>
          <span>Preismodell</span>
          <span className="text-right">Mindestpreis</span>
          <span className="text-right">Status</span>
          <span className="text-right">Aktionen</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredOperations.map((operation) => {
            const isExpanded = expandedOperationId === operation.id;
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
              <div key={operation.id} className="bg-white">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedOperationId(isExpanded ? null : operation.id)
                  }
                  className="grid w-full grid-cols-[1.2fr_0.75fr_0.8fr_0.55fr_0.55fr_auto] items-center gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-black text-slate-950">
                      {operation.name}
                    </span>
                    <span className="mt-1 block truncate text-xs font-bold text-slate-400">
                      {operation.notes || "Keine Notizen"}
                    </span>
                  </span>
                  <span className="truncate text-sm font-bold text-slate-600">
                    {operation.category}
                  </span>
                  <span className="truncate text-sm font-bold text-slate-600">
                    {getFinishingPricingModeLabel(operation.pricingMode)}
                  </span>
                  <span className="text-right text-sm font-black text-slate-950">
                    {formatCurrency(operation.minimumPrice)}
                  </span>
                  <span className="text-right">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${operation.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                    >
                      {operation.active ? "Aktiv" : "Inaktiv"}
                    </span>
                  </span>
                  <span className="flex justify-end gap-2">
                    <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">
                      {isExpanded ? "Schließen" : "Details"}
                    </span>
                  </span>
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-5">
                    <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr_0.8fr]">
                      <div className="rounded-3xl bg-white p-5 shadow-sm">
                        <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                          Preislogik
                        </p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
                            label="Stundensatz"
                            value={`${formatCurrency(operation.hourlyRate)} / h`}
                          />
                        </div>
                      </div>

                      <div className="rounded-3xl bg-white p-5 shadow-sm">
                        <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                          Beispiel
                        </p>
                        <div className="mt-4 space-y-3">
                          <CostRow
                            label="Rüstkosten"
                            value={formatCurrency(setupCost)}
                          />
                          <CostRow
                            label="Technischer Startpreis"
                            value={formatCurrency(technicalBasePrice)}
                          />
                          <CostRow
                            label="Beispiel 1.000 Stück"
                            value={formatCurrency(examplePrice)}
                            highlight
                          />
                        </div>
                      </div>

                      <div className="rounded-3xl bg-white p-5 shadow-sm">
                        <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                          Aktionen
                        </p>
                        <div className="mt-4 flex flex-col gap-2">
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
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
  customers,
  setCustomers,
  serviceItems,
  setServiceItems,
  savedDocuments,
  setSavedDocuments,
  machines,
  setMachines,
  materials,
  setMaterials,
  finishingOperations,
  setFinishingOperations,
  productTypes,
  setProductTypes,
  calculationTemplates,
  setCalculationTemplates,
}: {
  company: CompanyProfile;
  setCompany: Dispatch<SetStateAction<CompanyProfile>>;
  documentTemplateSettings: DocumentTemplateSettings;
  setDocumentTemplateSettings: Dispatch<
    SetStateAction<DocumentTemplateSettings>
  >;
  numberCircleSettings: NumberCircleSettings;
  setNumberCircleSettings: Dispatch<SetStateAction<NumberCircleSettings>>;
  customers: Customer[];
  setCustomers: Dispatch<SetStateAction<Customer[]>>;
  serviceItems: ServiceItem[];
  setServiceItems: Dispatch<SetStateAction<ServiceItem[]>>;
  savedDocuments: SavedDocument[];
  setSavedDocuments: Dispatch<SetStateAction<SavedDocument[]>>;
  machines: Machine[];
  setMachines: Dispatch<SetStateAction<Machine[]>>;
  materials: Material[];
  setMaterials: Dispatch<SetStateAction<Material[]>>;
  finishingOperations: FinishingOperation[];
  setFinishingOperations: Dispatch<SetStateAction<FinishingOperation[]>>;
  productTypes: ProductType[];
  setProductTypes: Dispatch<SetStateAction<ProductType[]>>;
  calculationTemplates: CalculationTemplate[];
  setCalculationTemplates: Dispatch<SetStateAction<CalculationTemplate[]>>;
}) {
  const [activeDocumentType, setActiveDocumentType] =
    useState<DocumentType>("quote");
  const activeDocumentTemplate = documentTemplateSettings[activeDocumentType];

  function updateCompanyField(field: keyof CompanyProfile, value: string | boolean) {
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

  function handleLetterheadUpload(file: File | null) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setDocumentTemplateSettings((current) => ({
        ...current,
        [activeDocumentType]: {
          ...current[activeDocumentType],
          letterheadMode: "upload",
          letterheadDataUrl: result,
        },
      }));
    };

    reader.readAsDataURL(file);
  }

  function removeLetterheadUpload() {
    setDocumentTemplateSettings((current) => ({
      ...current,
      [activeDocumentType]: {
        ...current[activeDocumentType],
        letterheadMode: "none",
        letterheadDataUrl: "",
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
    setCompany(normalizeCompanyProfile());
    try {
      window.localStorage.removeItem(COMPANY_PROFILE_STORAGE_KEY);
    } catch {}
  }

  function createBackupFileName() {
    const today = new Date().toISOString().slice(0, 10);
    return `printpilot-backup-${today}.json`;
  }

  function exportAppBackup() {
    const payload = {
      app: "PrintPilot",
      version: "V140",
      exportedAt: new Date().toISOString(),
      data: {
        company,
        documentTemplateSettings,
        numberCircleSettings,
        customers,
        serviceItems,
        savedDocuments,
        machines,
        materials,
        finishingOperations,
        productTypes,
        calculationTemplates,
      },
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = createBackupFileName();
    link.click();

    URL.revokeObjectURL(url);
  }

  function importAppBackup(file: File | null) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const raw = typeof reader.result === "string" ? reader.result : "";
        const parsed = JSON.parse(raw);
        const data = parsed.data ?? parsed;

        if (data.company) {
          setCompany(normalizeCompanyProfile(data.company));
        }

        if (data.documentTemplateSettings) {
          setDocumentTemplateSettings(
            normalizeDocumentTemplateSettings(data.documentTemplateSettings),
          );
        }

        if (data.numberCircleSettings) {
          setNumberCircleSettings(
            normalizeNumberCircleSettings(data.numberCircleSettings),
          );
        }

        if (Array.isArray(data.customers)) {
          setCustomers(data.customers);
        }

        if (Array.isArray(data.serviceItems)) {
          setServiceItems(data.serviceItems);
        }

        if (Array.isArray(data.savedDocuments)) {
          setSavedDocuments(data.savedDocuments);
        }

        if (Array.isArray(data.machines)) {
          setMachines(data.machines.map(normalizeMachine));
        }

        if (Array.isArray(data.materials)) {
          setMaterials(data.materials.map(normalizeMaterial));
        }

        if (Array.isArray(data.finishingOperations)) {
          setFinishingOperations(
            data.finishingOperations.map(normalizeFinishingOperation),
          );
        }

        if (Array.isArray(data.productTypes)) {
          const importedProductTypes = data.productTypes
            .map((type: unknown) => String(type).trim())
            .filter(Boolean);

          if (importedProductTypes.length > 0) {
            setProductTypes(importedProductTypes);
          }
        }

        if (Array.isArray(data.calculationTemplates)) {
          const templateMaterials = Array.isArray(data.materials)
            ? data.materials.map(normalizeMaterial)
            : materials;
          const templateMachines = Array.isArray(data.machines)
            ? data.machines.map(normalizeMachine)
            : machines;
          const templateFinishing = Array.isArray(data.finishingOperations)
            ? data.finishingOperations.map(normalizeFinishingOperation)
            : finishingOperations;
          const templateProductTypes = Array.isArray(data.productTypes)
            ? data.productTypes.map((type: unknown) => String(type).trim()).filter(Boolean)
            : productTypes;

          setCalculationTemplates(
            data.calculationTemplates.map((template: CalculationTemplate) =>
              normalizeCalculationTemplate(
                template,
                templateMaterials,
                templateMachines,
                templateFinishing,
                templateProductTypes.length > 0 ? templateProductTypes : productTypes,
              ),
            ),
          );
        }
      } catch {
        window.alert("Die Sicherungsdatei konnte nicht gelesen werden.");
      }
    };

    reader.readAsText(file);
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
                Einstellungen V7
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

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="h-2 w-24 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500" />
            <h3 className="mt-5 text-xl font-black">Datensicherung</h3>
            <p className="mt-1 max-w-3xl text-sm font-medium leading-6 text-slate-500">
              Sichere alle lokalen PrintPilot-Daten als JSON-Datei oder spiele eine
              Sicherung wieder ein. Enthalten sind Firmenprofil, Kunden,
              Dokumente, Maschinen, Material, Weiterverarbeitung, Leistungen,
              Produkttypen und Kalkulationsvorlagen.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={exportAppBackup}
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5"
            >
              Daten sichern
            </button>
            <label className="cursor-pointer rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-200">
              Sicherung importieren
              <input
                type="file"
                accept="application/json,.json"
                onChange={(event) =>
                  importAppBackup(event.target.files?.[0] ?? null)
                }
                className="hidden"
              />
            </label>
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
              <InputField
                label="Kontoinhaber"
                value={company.accountHolder ?? company.name}
                onChange={(value) => updateCompanyField("accountHolder", value)}
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-2 w-24 rounded-full bg-gradient-to-r from-lime-400 to-emerald-500" />
            <h3 className="mt-5 text-xl font-black">Dokumentanzeige</h3>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
              Lege fest, welche Stammdaten auf Angeboten, Rechnungen, Lieferscheinen und Auftragsbestätigungen zusätzlich ausgegeben werden. Bei vorgedrucktem Briefbogen kannst du alles deaktiviert lassen.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {[
                ["showCompanyAddressOnDocuments", "Adresse auf Dokumenten anzeigen", "Firmenname, Straße, PLZ und Ort"],
                ["showCompanyContactOnDocuments", "Kontaktdaten anzeigen", "Telefon, E-Mail und Website"],
                ["showTaxDataOnDocuments", "Steuerdaten anzeigen", "Steuernummer und USt-ID"],
                ["showBankDataOnDocuments", "Bankdaten anzeigen", "Bank, IBAN, BIC und Kontoinhaber"],
                ["showCompanyFooterOnDocuments", "Stammdaten im Dokumentfuß anzeigen", "aktiviert die Ausgabe im Footer des Briefbogens"],
              ].map(([field, label, description]) => (
                <label
                  key={field}
                  className="flex cursor-pointer gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(company[field as keyof CompanyProfile])}
                    onChange={(event) =>
                      updateCompanyField(
                        field as keyof CompanyProfile,
                        event.target.checked,
                      )
                    }
                    className="mt-1 h-5 w-5 rounded border-slate-300 text-slate-950 focus:ring-slate-950"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-slate-950">{label}</span>
                    <span className="mt-1 block text-xs font-medium leading-5 text-slate-500">{description}</span>
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-fuchsia-100 bg-fuchsia-50/60 p-5">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-700">
                    Footerposition im Briefbogen
                  </p>
                  <p className="mt-1 text-sm font-medium leading-6 text-fuchsia-900/70">
                    Für den echten Briefbogen werden die Stammdaten fest im Footer gesetzt. Firma, Steuer und Bank werden professionell als 3-zeilige Gruppen umbrochen. Die Y-Position kann auch in den Minusbereich geschoben werden.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-fuchsia-200 bg-white/70 px-4 py-3 text-sm font-semibold leading-6 text-fuchsia-950">
                Footer im Briefbogen: 3 Gruppen mit sinnvoller Zeilenlogik. Firma = Name, Adresse, Kontakt. Steuer = Steuernummer und USt-ID. Bank = Bank/Inhaber, IBAN, BIC. Negative Y-Werte schieben die Stammdaten weiter nach unten in den magentafarbenen Balken.
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <SelectField
                  label="Spalten"
                  value={company.documentFooterColumns ?? "3"}
                  onChange={(value) =>
                    updateCompanyField(
                      "documentFooterColumns",
                      value as CompanyProfile["documentFooterColumns"],
                    )
                  }
                  options={[
                    { value: "2", label: "2 Spalten" },
                    { value: "3", label: "3 Spalten" },
                  ]}
                />
                <NumberField
                  label="Footer Y-Position"
                  value={Number(company.documentFooterBottomMm ?? -6)}
                  onChange={(value) => updateCompanyField("documentFooterBottomMm", value)}
                  suffix="mm"
                  step={1}
                  min={-30}
                />
                <NumberField
                  label="Footerhöhe"
                  value={Number(company.documentFooterHeightMm ?? 20)}
                  onChange={(value) => updateCompanyField("documentFooterHeightMm", value)}
                  suffix="mm"
                  step={1}
                />
                <SelectField
                  label="Textfarbe"
                  value={company.documentFooterTextTone ?? "white"}
                  onChange={(value) =>
                    updateCompanyField(
                      "documentFooterTextTone",
                      value as CompanyProfile["documentFooterTextTone"],
                    )
                  }
                  options={[
                    { value: "white", label: "Weiß auf Magenta" },
                    { value: "dark", label: "Dunkel" },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-2 w-24 rounded-full bg-gradient-to-r from-rose-500 via-yellow-300 to-cyan-400" />
            <h3 className="mt-5 text-xl font-black">Dokumenttypen</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Jeder Dokumenttyp hat eigene Abstände und Standardtexte. Die
              Kundenvorschau V141 nutzt den aktiven Dokumenttyp: Angebot,
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
                    label="Abstand oben / DIN-Fenster"
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
                <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                        Briefbogen / Hintergrund
                      </p>
                      <h5 className="mt-2 text-lg font-semibold text-slate-950">
                        Hintergrund für {activeDocumentTemplate.label}
                      </h5>
                      <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
                        Verwende einen A4-Briefbogen als Bild-Hintergrund. Die Dokumentinhalte werden DIN-orientiert darüber gelegt. Ideal: PNG/JPG in A4 Hochformat mit 300 dpi. Für euren Briefbogen empfiehlt sich ca. 45 mm oben, 20 mm links/rechts und 32 mm unten.
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${activeDocumentTemplate.letterheadMode === "none" ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-700"}`}>
                      {activeDocumentTemplate.letterheadMode === "none"
                        ? "ohne Briefbogen"
                        : activeDocumentTemplate.letterheadMode === "demo"
                          ? "Demo aktiv"
                          : "eigener Briefbogen"}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                    <div className="space-y-4">
                      <SelectField
                        label="Briefbogen verwenden"
                        value={activeDocumentTemplate.letterheadMode ?? "none"}
                        onChange={(value) =>
                          updateDocumentTemplateField(
                            "letterheadMode",
                            value as LetterheadMode,
                          )
                        }
                        options={[
                          { value: "none", label: "Ohne Briefbogen" },
                          { value: "demo", label: "Demo-Briefbogen" },
                          { value: "upload", label: "Eigenen Briefbogen verwenden" },
                        ]}
                      />
                      <NumberField
                        label="Deckkraft"
                        value={activeDocumentTemplate.letterheadOpacity ?? 100}
                        onChange={(value) =>
                          updateDocumentTemplateField(
                            "letterheadOpacity",
                            Math.max(0, Math.min(value, 100)),
                          )
                        }
                        suffix="%"
                      />
                      <label className="block">
                        <span className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                          Briefbogen hochladen
                        </span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={(event) =>
                            handleLetterheadUpload(event.target.files?.[0] ?? null)
                          }
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-950"
                        />
                      </label>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={() =>
                            updateDocumentTemplateField("letterheadMode", "demo")
                          }
                          className="rounded-2xl bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-700 shadow-sm transition hover:-translate-y-0.5"
                        >
                          Demo anzeigen
                        </button>
                        <button
                          type="button"
                          onClick={removeLetterheadUpload}
                          className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5"
                        >
                          Briefbogen entfernen
                        </button>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="relative mx-auto aspect-[210/297] max-h-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        {activeDocumentTemplate.letterheadMode === "upload" &&
                        activeDocumentTemplate.letterheadDataUrl ? (
                          <img
                            src={activeDocumentTemplate.letterheadDataUrl}
                            alt="Briefbogen-Vorschau"
                            className="absolute inset-0 h-full w-full object-cover"
                            style={{
                              opacity:
                                Math.max(
                                  0,
                                  Math.min(
                                    activeDocumentTemplate.letterheadOpacity ?? 100,
                                    100,
                                  ),
                                ) / 100,
                            }}
                          />
                        ) : activeDocumentTemplate.letterheadMode === "demo" ? (
                          <div
                            className="absolute inset-0"
                            style={{
                              opacity:
                                Math.max(
                                  0,
                                  Math.min(
                                    activeDocumentTemplate.letterheadOpacity ?? 100,
                                    100,
                                  ),
                                ) / 100,
                              background:
                                "linear-gradient(135deg, rgba(6,199,242,0.22), transparent 35%), linear-gradient(315deg, rgba(225,57,242,0.18), transparent 32%), linear-gradient(0deg, rgba(255,208,28,0.14), transparent 28%)",
                            }}
                          />
                        ) : (
                          <div className="absolute inset-0 grid place-items-center text-center text-xs font-semibold uppercase tracking-wide text-slate-300">
                            Ohne Briefbogen
                          </div>
                        )}
                        <div className="absolute inset-x-6 top-8 h-10 rounded-xl bg-slate-950/90" />
                        <div className="absolute left-6 top-24 h-2 w-28 rounded-full bg-slate-300" />
                        <div className="absolute left-6 top-32 h-2 w-36 rounded-full bg-slate-200" />
                        <div className="absolute inset-x-6 bottom-10 h-2 rounded-full bg-slate-200" />
                      </div>
                      <p className="mt-4 text-center text-xs font-semibold leading-5 text-slate-500">
                        Vorschau für den aktiven Dokumenttyp. PDF-Hintergrund wird später sauber erweitert; aktuell funktioniert die Druckvorschau mit Bild-Hintergrund.
                      </p>
                    </div>
                  </div>
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
              Lege Präfix, nächste freie Nummer und Stellenzahl je Dokumenttyp fest. Die Jahreszahl wird automatisch aus dem aktuellen Jahr gebildet.
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
                <p className="mt-2 text-sm font-medium text-slate-300">
                  Format: Präfix · Jahr automatisch · fortlaufende Nummer
                </p>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {documentTypeOrder.map((documentType) => (
                  <button
                    key={documentType}
                    type="button"
                    onClick={() => setActiveDocumentType(documentType)}
                    className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${activeDocumentType === documentType ? "border-amber-300 bg-amber-50 text-amber-950" : "border-slate-200 bg-white text-slate-700"}`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {numberCircleSettings[documentType].label}
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {formatDocumentNumber(numberCircleSettings[documentType])}
                    </p>
                  </button>
                ))}
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
              <div className="mt-5 rounded-2xl bg-white p-4 text-xs font-medium leading-5 text-slate-500 shadow-sm">
                <p className="mb-2 font-semibold uppercase tracking-wide text-slate-400">Aktive Dokumentanzeige</p>
                {Boolean(company.showCompanyFooterOnDocuments) && [
                  company.showCompanyAddressOnDocuments ? "Adresse" : "",
                  company.showCompanyContactOnDocuments ? "Kontakt" : "",
                  company.showTaxDataOnDocuments ? "Steuerdaten" : "",
                  company.showBankDataOnDocuments ? "Bankdaten" : "",
                ].filter(Boolean).length > 0 ? (
                  <p>{[
                    company.showCompanyAddressOnDocuments ? "Adresse" : "",
                    company.showCompanyContactOnDocuments ? "Kontakt" : "",
                    company.showTaxDataOnDocuments ? "Steuerdaten" : "",
                    company.showBankDataOnDocuments ? "Bankdaten" : "",
                  ].filter(Boolean).join(" · ")}</p>
                ) : (
                  <p>Keine zusätzlichen Stammdaten auf Dokumenten aktiv.</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-2 w-24 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
            <h3 className="mt-5 text-xl font-black">Kundenvorschau V141</h3>
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
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p
        title={value}
        className="mt-2 whitespace-normal break-words text-sm font-medium leading-5 text-slate-700"
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

function getPrintPartColorShort(mode?: string) {
  if (!mode || mode === "unbedruckt") return "0";
  if (mode === "4-farbig") return "4";
  if (mode === "schwarz") return "1";
  if (mode === "Sonderfarbe") return "SF";
  return mode;
}

function getPrintPartColorSummary(item: { printSideMode?: PrintSideMode; frontColorMode?: string; backColorMode?: string }) {
  if (item.printSideMode === "materialOnly") return "nur Material";
  const front = getPrintPartColorShort(item.frontColorMode);
  const back = item.printSideMode === "duplex" ? getPrintPartColorShort(item.backColorMode) : "0";
  return `${front}/${back}`;
}


function estimateQuotePositionLayoutUnits(position: QuotePosition) {
  const titleLength = position.title.trim().length;
  const description = position.description.trim();
  const descriptionLength = description.length;
  const explicitDescriptionLines = description ? description.split(/\r?\n/).length : 1;
  const estimatedTitleLines = Math.max(1, Math.ceil(titleLength / 46));
  const estimatedDescriptionLines = Math.max(
    1,
    Math.max(explicitDescriptionLines, Math.ceil(descriptionLength / 88)),
  );
  const internalNoteUnits = position.internalNote?.trim() ? 3 : 0;

  return 13 + estimatedTitleLines * 3.5 + estimatedDescriptionLines * 4.4 + internalNoteUnits;
}

function paginateQuotePositionsByEstimatedHeight(positions: QuotePosition[]) {
  if (positions.length === 0) {
    return [[] as QuotePosition[]];
  }

  // V140: slightly less conservative height model. The protected footer area remains fixed,
  // but the content area on page 1 may use more of the available white space before the footer.
  const firstPageCapacity = 156;
  const followingPageCapacity = 188;
  const lastPageReserveForTotalsAndTerms = 40;
  const pages: QuotePosition[][] = [];
  let index = 0;

  while (index < positions.length) {
    const isFirstPage = pages.length === 0;
    const pageCapacity = isFirstPage ? firstPageCapacity : followingPageCapacity;
    const pagePositions: QuotePosition[] = [];
    let usedUnits = 0;

    while (index < positions.length) {
      const position = positions[index];
      const positionUnits = estimateQuotePositionLayoutUnits(position);
      const isLastPositionAfterThis = index === positions.length - 1;
      const requiredReserve = isLastPositionAfterThis ? lastPageReserveForTotalsAndTerms : 0;
      const wouldOverflow = usedUnits + positionUnits + requiredReserve > pageCapacity;

      if (pagePositions.length > 0 && wouldOverflow) {
        break;
      }

      pagePositions.push(position);
      usedUnits += positionUnits;
      index += 1;

      if (pagePositions.length === 1 && wouldOverflow) {
        break;
      }
    }

    pages.push(pagePositions);
  }

  return pages;
}

function getPrintPartQuantitySummary(item: { calculationMode: MaterialCalculationMode; pages: number; factorPerCopy: number; manualSheets: number; pagesPerSheet: number; calculatedSheets: number }) {
  if (item.calculationMode === "pages") {
    return `${item.pages.toLocaleString("de-DE")} S. · ${item.pagesPerSheet.toLocaleString("de-DE")} S./Bg.`;
  }

  if (item.calculationMode === "perCopy") {
    return `${formatNumber(item.factorPerCopy, 2)}× je Ex.`;
  }

  return `${item.manualSheets.toLocaleString("de-DE")} Bg. manuell`;
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
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const maxPreviewWidth = 310;
  const maxPreviewHeight = 260;
  const scale = Math.min(
    maxPreviewWidth / safeSheetWidth,
    maxPreviewHeight / safeSheetHeight,
  );
  const previewWidth = Math.max(Math.round(safeSheetWidth * scale), 120);
  const previewHeight = Math.max(Math.round(safeSheetHeight * scale), 120);

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
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
            Bogenvorschau rechts V140
          </p>
          <p className="mt-1 truncate text-sm font-black text-slate-800">
            {result.best.columns} × {result.best.rows} Nutzen · {result.best.orientation}
          </p>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
            Kompakte technische Vorschau für Rohbogen, Endformat, Beschnitt und Zwischenschnitt.
          </p>
          <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px] font-black text-slate-600">
            <span className="rounded-lg bg-slate-100 px-2 py-1">Rohbogen {formatNumber(safeSheetWidth, 0)} × {formatNumber(safeSheetHeight, 0)} mm</span>
            <span className="rounded-lg bg-slate-100 px-2 py-1">Endformat {formatNumber(closedFinalWidth, 0)} × {formatNumber(closedFinalHeight, 0)} mm</span>
            <span className="rounded-lg bg-amber-100 px-2 py-1">Beschnitt {formatNumber(safeBleed, 1)} mm</span>
            <span className="rounded-lg bg-pink-100 px-2 py-1">Zwischenschnitt {formatNumber(Math.max(safeGutterHorizontal, safeGutterVertical), 1)} mm</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsPreviewOpen((value) => !value)}
          className="rounded-xl border border-slate-200 bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-sm transition hover:bg-slate-800"
        >
          {isPreviewOpen ? "Vorschau schließen" : "Vorschau öffnen"}
        </button>
      </div>

      {isPreviewOpen && (
        <div className="mt-3 overflow-x-auto rounded-xl bg-slate-50 p-3">
          <svg
            width={previewWidth}
            height={previewHeight}
            viewBox={"0 0 " + previewWidth + " " + previewHeight}
            className="mx-auto max-w-full rounded-lg bg-white shadow-sm"
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

          <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-black text-slate-600">
            <span className="rounded-full bg-amber-100 px-2 py-1">Gelb: Beschnitt</span>
            <span className="rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">Weiß: Endformat</span>
            <span className="rounded-full bg-pink-100 px-2 py-1">Pink: Zwischenschnitt</span>
            <span className="rounded-full bg-slate-100 px-2 py-1">Schwarz: Bund/Falz</span>
          </div>
        </div>
      )}
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
    text: "text-yellow-900",
    badge: "bg-yellow-100 text-amber-700",
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
