import { createContext, useContext, useMemo, useRef, useState } from "react";
import { PrintPilotLogo } from "../../components/brand/PrintPilotLogo";
import { demoDocumentSettings } from "../documents/document-settings";
import {
  createOrderDraftFromCalculation,
  demoCalculationPayload,
  getFallbackOrder,
} from "../orders/order-data";
import type {
  CalculationImpositionResult,
  CalculationToProductionPayload,
  PrintPilotOrder,
  ProductKind,
} from "../orders/order-data";

type CalculationPageProps = {
  onCreateOrderDraft: (order: PrintPilotOrder) => void;
};

type ProductionMode = "internal" | "external" | "combined";
type FieldBadge = "Pflicht" | "optional" | "später";
type CalculationDialogVariant = "warning" | "info" | "success";
type CalculationDialogState = {
  variant: CalculationDialogVariant;
  title: string;
  body?: string;
  items?: string[];
  primaryLabel?: string;
};

const CalculationFieldValidationContext = createContext<ReadonlySet<string>>(new Set());
type ReadinessState = "ready" | "blocked";
type CalculationPlausibilityGroupId =
  | "product-data"
  | "print-data"
  | "material-consumption"
  | "machine-time"
  | "finishing"
  | "external-costs"
  | "price-closing";
type CalculationTabId =
  | "customer-order"
  | "product-format"
  | "paper-print"
  | "imposition"
  | "finishing"
  | "external"
  | "prices";

type CalculationDraft = {
  customer: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  billingAddress: string;
  deliveryAddress: string;
  projectName: string;
  calculationId: string;
  offerId: string;
  offerDate: string;
  offerValidUntil: string;
  offerStatus: string;
  senderCompany: string;
  senderAddress: string;
  senderPhone: string;
  senderEmail: string;
  senderWebsite: string;
  senderTaxNumber: string;
  senderVatId: string;
  senderBankName: string;
  senderIban: string;
  senderBic: string;
  documentLogoLabel: string;
  documentLogoHint: string;
  documentFooterNote: string;
  paymentTerms: string;
  dueDate: string;
  correctionDeadline: string;
  owner: string;
  customerReference: string;
  customerOrderNumber: string;
  orderType: string;
  dataStatus: string;
  printFileName: string;
  printFileVersion: string;
  printFileLocation: string;
  printDataCheck: string;
  approvalStatus: string;
  proofRequirement: string;
  overdeliveryRule: string;
  partialDeliveries: string;
  shippingMethod: string;
  packagingPlan: string;
  deliveryTimeWindow: string;
  neutralShipping: string;
  deliveryNoteStatus: string;
  samples: string;
  customerNote: string;
  internalNote: string;
  productKind: ProductKind;
  productLabel: string;
  pages: string;
  colorMode: string;
  frontColors: string;
  backColors: string;
  spotColors: string;
  versions: string;
  personalization: string;
  finalFormat: string;
  openFormat: string;
  orientation: string;
  bleedMm: string;
  safetyMarginMm: string;
  productionFormat: string;
  specialShape: string;
  dataSource: string;
  preflight: string;
  quantity: string;
  overs: string;
  netQuantity: string;
  restQuantity: string;
  tier1: string;
  tier2: string;
  tier3: string;
  variants: string;
  materialGroup: string;
  substrate: string;
  grammage: string;
  sheetFormat: string;
  grainDirection: string;
  rawSheetFormat: string;
  printSheetFormat: string;
  paperUsage: string;
  netSheets: string;
  wasteSheets: string;
  grossSheets: string;
  stockStatus: string;
  paperSource: string;
  paperOrderStatus: string;
  supplier: string;
  priceStatus: string;
  machine: string;
  printType: string;
  turning: string;
  impositionLabel: string;
  impositionGapMm: string;
  impositionGapXMm: string;
  impositionGapYMm: string;
  impositionMarginMm: string;
  impositionUseBleed: string;
  impositionRotationMode: string;
  setupTime: string;
  runTime: string;
  clickCosts: string;
  wasteMode: string;
  counterMode: string;
  productionHint: string;
  workInstruction: string;
  pocketExtraNote: string;
  externalSupplier: string;
  externalPrice: string;
  externalLeadTime: string;
  margin: string;
  externalQuote: string;
  externalFreight: string;
  handlingTime: string;
  internalCheck: string;
  combinationPrint: string;
  combinationFinishing: string;
  combinationPostpress: string;
  combinationExternal: string;
  materialCosts: string;
  printCosts: string;
  finishingCosts: string;
  externalCosts: string;
  shippingCosts: string;
  packagingCosts: string;
  overheadRate: string;
  minPrice: string;
  discount: string;
  contributionMargin: string;
  billingMode: string;
  settlementNote: string;
  commission: string;
  invoiceControl: string;
  controlPrintData: string;
  controlColorAccuracy: string;
  controlFinishing: string;
  controlQuantity: string;
  pocketSampleStatus: string;
  paperInvoiceStatus: string;
  supplierInvoiceStatus: string;
  salePriceNet: string;
};

type FinishingDraftRow = {
  id: string;
  label: string;
  active: boolean;
  note: string;
  typeLabel: string;
  typeValue: string;
  amountLabel: string;
  amountValue: string;
  productionLabel: string;
  productionValue: string;
};

const calculationTabs: Array<{
  id: CalculationTabId;
  label: string;
  shortcut: string;
}> = [
  { id: "customer-order", label: "Kunde & Auftrag", shortcut: "01" },
  { id: "product-format", label: "Produkt & Format", shortcut: "02" },
  { id: "paper-print", label: "Papier & Druck", shortcut: "03" },
  { id: "imposition", label: "Nutzen & Ausschießen", shortcut: "04" },
  { id: "finishing", label: "Weiterverarbeitung", shortcut: "05" },
  { id: "external", label: "Fremdproduktion", shortcut: "06" },
  { id: "prices", label: "Preise & Ergebnis", shortcut: "07" },
];

const calculationPlausibilityGroups: Array<{
  id: CalculationPlausibilityGroupId;
  title: string;
  helper: string;
  fields: Array<keyof CalculationDraft>;
}> = [
  {
    id: "product-data",
    title: "Produktdaten",
    helper: "Kunde, Produkt, Auflage, Umfang, Format und Farbigkeit",
    fields: [
      "customer",
      "projectName",
      "productKind",
      "productLabel",
      "quantity",
      "pages",
      "colorMode",
      "finalFormat",
      "openFormat",
    ],
  },
  {
    id: "print-data",
    title: "Druckdaten",
    helper: "Datenquelle, Beschnitt, Prüfschritte, Nutzenformat und Sorten",
    fields: [
      "printFileName",
      "approvalStatus",
      "printDataCheck",
      "dataSource",
      "preflight",
      "bleedMm",
      "safetyMarginMm",
      "productionFormat",
      "versions",
      "frontColors",
      "backColors",
      "spotColors",
    ],
  },
  {
    id: "material-consumption",
    title: "Materialverbrauch",
    helper: "Papier, Bogen, Nutzen, Nettobogen, Zuschuss und Lagerstatus",
    fields: [
      "materialGroup",
      "substrate",
      "grammage",
      "sheetFormat",
      "rawSheetFormat",
      "printSheetFormat",
      "paperUsage",
      "netSheets",
      "wasteSheets",
      "grossSheets",
      "stockStatus",
    ],
  },
  {
    id: "machine-time",
    title: "Maschinenzeit",
    helper:
      "Produktionsweg, Maschine, Druckart, Wendung, Rüstzeit und Klickmodus",
    fields: [
      "machine",
      "printType",
      "turning",
      "impositionLabel",
      "impositionGapXMm",
      "impositionGapYMm",
      "impositionMarginMm",
      "impositionUseBleed",
      "impositionRotationMode",
      "setupTime",
      "runTime",
      "clickCosts",
      "counterMode",
      "productionHint",
    ],
  },
  {
    id: "finishing",
    title: "Weiterverarbeitung",
    helper: "Aktive Leistungen, Menge, Parameter, Produktion und Verpackung",
    fields: [
      "finishingCosts",
      "packagingCosts",
      "shippingCosts",
      "workInstruction",
      "pocketExtraNote",
      "overdeliveryRule",
      "partialDeliveries",
      "packagingPlan",
      "shippingMethod",
      "samples",
    ],
  },
  {
    id: "external-costs",
    title: "Fremdkosten",
    helper: "Lieferant, Einkauf, Fracht, Handling und Kombinationsanteile",
    fields: [
      "externalSupplier",
      "externalPrice",
      "externalLeadTime",
      "externalQuote",
      "externalFreight",
      "handlingTime",
      "combinationPrint",
      "combinationFinishing",
      "combinationPostpress",
      "combinationExternal",
    ],
  },
  {
    id: "price-closing",
    title: "Preisabschluss",
    helper:
      "Kostenblöcke, Rabatt, Mindestpreis, Deckungsbeitrag und Abrechnung",
    fields: [
      "materialCosts",
      "printCosts",
      "finishingCosts",
      "externalCosts",
      "overheadRate",
      "minPrice",
      "discount",
      "contributionMargin",
      "billingMode",
      "settlementNote",
      "commission",
      "invoiceControl",
      "salePriceNet",
    ],
  },
];

const productKindLabels: Record<ProductKind, string> = {
  flyer: "Flyer",
  "business-card": "Visitenkarte",
  brochure: "Broschüre",
  poster: "Plakat",
  sticker: "Aufkleber",
  letterhead: "Briefbogen",
};

const productKindOptions = Object.entries(productKindLabels).map(
  ([value, label]) => ({
    value: value as ProductKind,
    label,
  }),
);

const calculationRequiredFields: Array<keyof CalculationDraft> = [
  "quantity",
  "productKind",
  "productLabel",
  "finalFormat",
  "substrate",
  "machine",
  "printType",
];

const offerRequiredFields: Array<keyof CalculationDraft> = [
  ...calculationRequiredFields,
  "customer",
  "contactName",
  "pages",
  "colorMode",
  "salePriceNet",
];

const offerEmailRequiredFields: Array<keyof CalculationDraft> = [
  ...offerRequiredFields,
  "contactEmail",
];

const requiredFieldsByTab: Record<
  CalculationTabId,
  Array<keyof CalculationDraft>
> = {
  "customer-order": [
    "customer",
    "contactName",
    "owner",
    "projectName",
    "dueDate",
    "quantity",
  ],
  "product-format": [
    "productKind",
    "productLabel",
    "pages",
    "colorMode",
    "finalFormat",
    "printFileName",
  ],
  "paper-print": ["substrate", "machine", "printType"],
  imposition: ["printSheetFormat", "finalFormat"],
  finishing: [],
  external: ["externalSupplier", "externalPrice", "externalLeadTime"],
  prices: ["salePriceNet"],
};


const calculationFieldTabOverrides: Partial<Record<keyof CalculationDraft, CalculationTabId>> = {
  contactEmail: "customer-order",
  offerId: "prices",
  offerDate: "prices",
  offerStatus: "prices",
  offerValidUntil: "prices",
  paymentTerms: "prices",
  senderCompany: "prices",
  senderAddress: "prices",
  senderPhone: "prices",
  senderEmail: "prices",
  senderWebsite: "prices",
  salePriceNet: "prices",
};

function getCalculationFieldTab(field: keyof CalculationDraft): CalculationTabId {
  if (calculationFieldTabOverrides[field]) {
    return calculationFieldTabOverrides[field] as CalculationTabId;
  }

  const foundTab = calculationTabs.find((tab) =>
    requiredFieldsByTab[tab.id]?.includes(field),
  );

  return foundTab?.id ?? "customer-order";
}

function isDraftValueMissing(value: string) {
  const normalized = value.trim().toLowerCase();

  return (
    normalized.length === 0 ||
    normalized === "offen" ||
    normalized === "noch offen" ||
    normalized === "automatisch später" ||
    normalized === "0,00 €"
  );
}

function getRequiredFieldsForTab(
  tabId: CalculationTabId,
  productionMode: ProductionMode,
) {
  if (tabId === "external" && productionMode === "internal") {
    return [];
  }

  return requiredFieldsByTab[tabId];
}

function getOrderRequiredFields(productionMode: ProductionMode) {
  return calculationTabs.flatMap((tab) =>
    getRequiredFieldsForTab(tab.id, productionMode),
  );
}

function getProductionModeRequiredFields(productionMode: ProductionMode) {
  return productionMode === "internal" ? [] : requiredFieldsByTab.external;
}

function countMissingFields(
  draft: CalculationDraft,
  fields: Array<keyof CalculationDraft>,
) {
  return fields.filter((field) =>
    isDraftValueMissing(String(draft[field] ?? "")),
  ).length;
}


const calculationFieldLabels: Partial<Record<keyof CalculationDraft, string>> = {
  customer: "Kunde",
  contactName: "Ansprechpartner",
  contactEmail: "E-Mail-Adresse",
  owner: "Bearbeiter",
  projectName: "Projekt",
  dueDate: "Liefertermin",
  quantity: "Auflage",
  productKind: "Produktart",
  productLabel: "Produktbezeichnung",
  pages: "Umfang",
  finalFormat: "Endformat",
  printFileName: "Druckdatei",
  substrate: "Material",
  machine: "Maschine",
  printType: "Druckart",
  colorMode: "Farbigkeit",
  salePriceNet: "Verkaufspreis netto",
  externalSupplier: "Fremdlieferant",
  externalPrice: "Einkaufspreis Fremdproduktion",
  externalLeadTime: "Lieferzeit Fremdproduktion",
  printSheetFormat: "Druckbogenformat",
};

function getMissingFieldLabels(
  draft: CalculationDraft,
  fields: Array<keyof CalculationDraft>,
) {
  return Array.from(new Set(fields))
    .filter((field) => isDraftValueMissing(String(draft[field] ?? "")))
    .map((field) => calculationFieldLabels[field] ?? String(field));
}

function buildDialogItems(labels: string[]) {
  const visibleItems = labels.slice(0, 8);

  if (labels.length > 8) {
    visibleItems.push(`${labels.length - 8} weitere Felder`);
  }

  return visibleItems;
}

function getReadinessLabel(missingCount: number) {
  return missingCount === 0 ? "bereit" : `${missingCount} offen`;
}

function getReadinessState(missingCount: number): ReadinessState {
  return missingCount === 0 ? "ready" : "blocked";
}

function isPlausibilityValuePrepared(value: string) {
  const normalized = value.trim().toLowerCase();

  return (
    normalized.length > 0 &&
    normalized !== "offen" &&
    normalized !== "noch offen" &&
    normalized !== "automatisch später" &&
    normalized !== "0,00 €"
  );
}

function countPreparedPlausibilityFields(
  draft: CalculationDraft,
  fields: Array<keyof CalculationDraft>,
) {
  return fields.filter((field) =>
    isPlausibilityValuePrepared(String(draft[field] ?? "")),
  ).length;
}

const productionModes: Array<{
  id: ProductionMode;
  label: string;
  helper: string;
}> = [
  {
    id: "internal",
    label: "Eigenproduktion",
    helper: "Maschine, Bogen, Nutzen und interne Produktionszeiten",
  },
  {
    id: "external",
    label: "Fremdproduktion",
    helper: "Lieferant, Einkaufspreis, Marge, Lieferzeit und Fracht",
  },
  {
    id: "combined",
    label: "Kombination",
    helper: "Druck/Veredelung/Weiterverarbeitung intern und extern aufteilen",
  },
];

const initialFinishingRows: FinishingDraftRow[] = [
  {
    id: "cutting",
    label: "Schneiden",
    active: true,
    note: "Planschnitt, Zwischenschnitt, Endschnitt, Trennschnitt",
    typeLabel: "Schnittart",
    typeValue: "Endschnitt",
    amountLabel: "Schnitte",
    amountValue: "4",
    productionLabel: "intern/extern",
    productionValue: "intern",
  },
  {
    id: "folding",
    label: "Falzen",
    active: false,
    note: "Falzart, Brüche, Laufrichtung und Folder-Produktion",
    typeLabel: "Falzart",
    typeValue: "Wickelfalz",
    amountLabel: "Brüche",
    amountValue: "2",
    productionLabel: "Maschine",
    productionValue: "Falzmaschine",
  },
  {
    id: "creasing",
    label: "Rillen / Nuten",
    active: false,
    note: "Rillungen, Nutung, Falzhilfe bei starker Grammatur",
    typeLabel: "Ausführung",
    typeValue: "2 Rillungen",
    amountLabel: "Seite",
    amountValue: "einseitig",
    productionLabel: "Positionen",
    productionValue: "später",
  },
  {
    id: "perforation",
    label: "Perforieren",
    active: false,
    note: "Abriss, Coupons, Tickets, Antwortkarten oder Linienperforation",
    typeLabel: "Art",
    typeValue: "Linienperforation",
    amountLabel: "Anzahl",
    amountValue: "1",
    productionLabel: "Position",
    productionValue: "offen",
  },
  {
    id: "drilling",
    label: "Bohren / Lochen / Ösen",
    active: false,
    note: "Bohrbild, Lochung, Durchmesser, Ösen und Position",
    typeLabel: "Anzahl",
    typeValue: "2",
    amountLabel: "Ø",
    amountValue: "6 mm",
    productionLabel: "Ösen",
    productionValue: "optional",
  },
  {
    id: "round-corners",
    label: "Ecken abrunden",
    active: false,
    note: "Radius, Nutzenverarbeitung oder Einzelverarbeitung",
    typeLabel: "Radius",
    typeValue: "3 mm",
    amountLabel: "Seiten",
    amountValue: "4 Ecken",
    productionLabel: "Produktion",
    productionValue: "intern",
  },
  {
    id: "die-cutting",
    label: "Stanzen / Plotten",
    active: false,
    note: "Konturschnitt, Stanzform, Plotter, Kiss-Cut oder digitale Formgebung",
    typeLabel: "Art",
    typeValue: "Kontur",
    amountLabel: "Konturen",
    amountValue: "offen",
    productionLabel: "Stanze",
    productionValue: "später",
  },
  {
    id: "lamination",
    label: "Laminieren / Kaschieren",
    active: false,
    note: "Matt, Glanz, Softtouch, Schutzfolie, ein- oder beidseitig",
    typeLabel: "Oberfläche",
    typeValue: "matt",
    amountLabel: "Seite",
    amountValue: "1/0",
    productionLabel: "Art",
    productionValue: "Folie",
  },
  {
    id: "gathering",
    label: "Zusammentragen / Sortieren",
    active: false,
    note: "Sätze, Varianten, Reihenfolge, Sammelauftrag oder Register",
    typeLabel: "Art",
    typeValue: "sortiert",
    amountLabel: "Sätze",
    amountValue: "automatisch",
    productionLabel: "Kontrolle",
    productionValue: "nach Auftrag",
  },
  {
    id: "stitching",
    label: "Heften",
    active: false,
    note: "Rückstich, Ringösen, Blockheftung oder Broschürenheftung",
    typeLabel: "Art",
    typeValue: "Rückstich",
    amountLabel: "Klammern",
    amountValue: "2",
    productionLabel: "Ösen",
    productionValue: "nein",
  },
  {
    id: "perfect-binding",
    label: "Klebebindung",
    active: false,
    note: "PUR/Hotmelt, Rückenbreite, Umschlagrillung und Buchblock",
    typeLabel: "Art",
    typeValue: "PUR",
    amountLabel: "Rücken",
    amountValue: "automatisch",
    productionLabel: "Umschlag",
    productionValue: "4-seitig",
  },
  {
    id: "padding",
    label: "Ableimen / Blockleimung",
    active: false,
    note: "Blöcke, SD-Sätze, Schreibblocks, kopf- oder seitengeleimt",
    typeLabel: "Leimung",
    typeValue: "Kopfleimung",
    amountLabel: "Blöcke",
    amountValue: "offen",
    productionLabel: "Trocknung",
    productionValue: "einplanen",
  },
  {
    id: "wire-binding",
    label: "Spiral- / Drahtkammbindung",
    active: false,
    note: "Wire-O, Plastikspirale, Kalender, Manuals oder Kleinauflagen",
    typeLabel: "Bindung",
    typeValue: "Drahtkamm",
    amountLabel: "Exemplare",
    amountValue: "Auflage",
    productionLabel: "Produktion",
    productionValue: "intern/extern",
  },
  {
    id: "thread-sewing",
    label: "Fadenheftung",
    active: false,
    note: "Sonderleistung, hochwertige Broschüren oder Fremdproduktion",
    typeLabel: "Lagen",
    typeValue: "offen",
    amountLabel: "Seiten/Lage",
    amountValue: "16",
    productionLabel: "Produktion",
    productionValue: "extern",
  },
  {
    id: "numbering",
    label: "Nummerieren",
    active: false,
    note: "Startnummer, Endnummer, Eindruckposition und variable Daten",
    typeLabel: "Start",
    typeValue: "000001",
    amountLabel: "Ende",
    amountValue: "automatisch",
    productionLabel: "Daten",
    productionValue: "variabel",
  },
  {
    id: "inserting",
    label: "Einlegen / Beilegen",
    active: false,
    note: "Beilagen, Karten, Deckblätter, Umschläge oder Sets",
    typeLabel: "Art",
    typeValue: "Beilage",
    amountLabel: "Teile",
    amountValue: "1",
    productionLabel: "Prüfung",
    productionValue: "Vollständigkeit",
  },
  {
    id: "banding",
    label: "Banderolieren / Bündeln",
    active: false,
    note: "Banderole, Bündelgröße, Schrumpffolie, Schutzverpackung",
    typeLabel: "Art",
    typeValue: "Banderole",
    amountLabel: "Bündel",
    amountValue: "100er",
    productionLabel: "Material",
    productionValue: "Banderole / Folie",
  },
  {
    id: "manual-work",
    label: "Handarbeiten / Konfektionieren",
    active: false,
    note: "Kleben, Montieren, Sortieren, Zählen, Sets oder Sonderhandling",
    typeLabel: "Tätigkeit",
    typeValue: "offen beschreiben",
    amountLabel: "Zeit / Menge",
    amountValue: "offen",
    productionLabel: "Arbeitsplatz",
    productionValue: "Handarbeit",
  },
  {
    id: "mailing",
    label: "Kuvertieren / Mailing",
    active: false,
    note: "Kuverts, Anschreiben, Porto, Adressen, Personalisierung und Übergabe",
    typeLabel: "Art",
    typeValue: "kuvertieren",
    amountLabel: "Sendungen",
    amountValue: "Auflage",
    productionLabel: "Daten",
    productionValue: "Adressliste",
  },
  {
    id: "packing",
    label: "Verpacken / Versand",
    active: true,
    note: "Kartonieren, Etikettieren, Lieferschein, Palette oder Teillieferung",
    typeLabel: "Verpackung",
    typeValue: "Karton",
    amountLabel: "Bündel",
    amountValue: "100er",
    productionLabel: "Lieferung",
    productionValue: "eine Adresse",
  },
];

const initialDraft: CalculationDraft = {
  customer: "Wohlstandsmeister GmbH",
  contactName: "Lutz Humbert",
  contactPhone: "07142 35799-91",
  contactEmail: "lutz.humbert@wohlstandsmeister.de",
  billingAddress: "Pleidelsheimer Straße 9 · 74321 Bietigheim-Bissingen",
  deliveryAddress: "wie Rechnungsadresse",
  projectName: "Visitenkarten Relaunch",
  calculationId: demoCalculationPayload.calculationId ?? "CALC-2026-00017",
  offerId: "ANG-2026-00017",
  offerDate: "21.06.2026",
  offerValidUntil: demoDocumentSettings.defaults.offerValidity,
  offerStatus: "Entwurf",
  senderCompany: demoDocumentSettings.company.companyName,
  senderAddress: demoDocumentSettings.company.address,
  senderPhone: demoDocumentSettings.company.phone,
  senderEmail: demoDocumentSettings.company.email,
  senderWebsite: demoDocumentSettings.company.website,
  senderTaxNumber: demoDocumentSettings.company.taxNumber,
  senderVatId: demoDocumentSettings.company.vatId,
  senderBankName: demoDocumentSettings.company.bankName,
  senderIban: demoDocumentSettings.company.iban,
  senderBic: demoDocumentSettings.company.bic,
  documentLogoLabel: demoDocumentSettings.branding.logoLabel,
  documentLogoHint: demoDocumentSettings.branding.logoHint,
  documentFooterNote: demoDocumentSettings.defaults.footerNote,
  paymentTerms: demoDocumentSettings.defaults.paymentTerms,
  dueDate: "04.06.2026 · 11:00",
  correctionDeadline: "03.06.2026 · 12:00",
  owner: "Max M.",
  customerReference: "WM-VK-2026",
  customerOrderNumber: "Bestellung per Mail",
  orderType: "Neuauftrag",
  dataStatus: "Daten gestellt · Prüfung offen",
  printFileName: "wohlstandsmeister-vika.pdf",
  printFileVersion: "V1 · 21.06.2026",
  printFileLocation: "Druckdaten / Kundenordner",
  printDataCheck: "Druckdaten prüfen",
  approvalStatus: "Freigabe offen",
  proofRequirement: "kein Proof erforderlich",
  overdeliveryRule: "keine Überlieferung",
  partialDeliveries: "keine Teillieferung",
  shippingMethod: "Fahrer / Standardtour",
  packagingPlan: "1 Karton · nach Sorten trennen",
  deliveryTimeWindow: "04.06.2026 · 11:00",
  neutralShipping: "kein Neutralversand",
  deliveryNoteStatus: "Lieferschein erforderlich",
  samples: "2 Belegexemplare",
  customerNote: "Lieferung an Standardadresse",
  internalNote: "Daten aus PDF-Preview prüfen",
  productKind: demoCalculationPayload.product.kind,
  productLabel: "Visitenkarten",
  pages: "2-seitig",
  colorMode: "4/4-farbig Euroskala",
  frontColors: "Euroskala / 4c",
  backColors: "Euroskala / 4c",
  spotColors: "keine Sonderfarben",
  versions: "6 Varianten · Sammelauftrag",
  personalization: "keine Personalisierung",
  finalFormat: "85 × 55 mm",
  openFormat: "identisch",
  orientation: "Querformat",
  bleedMm: "3",
  safetyMarginMm: "3 mm",
  productionFormat: "85 × 55 mm + Beschnitt",
  specialShape: "keine",
  dataSource: "PDF gestellt",
  preflight: "Preflight erforderlich",
  quantity: "1000",
  overs: "3",
  netQuantity: "1008",
  restQuantity: "8",
  tier1: "500 Stück",
  tier2: "1.000 Stück",
  tier3: "2.500 Stück",
  variants: "6 Sorten zusammen",
  materialGroup: "Bilderdruck / Karton",
  substrate: "Munken Lynx",
  grammage: "300 g/m²",
  sheetFormat: "SRA3 · 450 × 320 mm",
  grainDirection: "offen",
  rawSheetFormat: "70 × 100 cm",
  printSheetFormat: "45 × 32 cm",
  paperUsage: "4 Nutzen aus Rohbogen",
  netSheets: "42 Nettobogen",
  wasteSheets: "2 Zuschussbogen",
  grossSheets: "44 Bruttobogen",
  stockStatus: "Lagerware prüfen",
  paperSource: "Papier am Lager",
  paperOrderStatus: "nicht bestellt",
  supplier: "OVOL / IGEPA / Berberich",
  priceStatus: "manuell / CSV später",
  machine: demoCalculationPayload.machine?.label ?? "Xerox® Iridesse 2",
  printType: "Digitaldruck 4/4",
  turning: "einseitig / aufrecht",
  impositionLabel: "6 × 4 · 24 Nutzen",
  impositionGapMm: "0",
  impositionGapXMm: "0",
  impositionGapYMm: "0",
  impositionMarginMm: "5",
  impositionUseBleed: "Endformat",
  impositionRotationMode: "Drehung erlaubt",
  setupTime: "12 min",
  runTime: "automatisch später",
  clickCosts: "Maschinenstamm",
  wasteMode: "Zuschuss aus Kalkulation",
  counterMode: "Klicks 4/4",
  productionHint: "Schön- und Widerdruck prüfen",
  workInstruction: "Drucken, schneiden, sortenrein verpacken",
  pocketExtraNote: "1 Karton · Sorten kennzeichnen · 2 Belege beilegen",
  externalSupplier: "Fremddruckerei auswählen",
  externalPrice: "0,00 €",
  externalLeadTime: "3–5 Arbeitstage",
  margin: "35 %",
  externalQuote: "noch offen",
  externalFreight: "0,00 €",
  handlingTime: "15 min",
  internalCheck: "Datencheck bleibt intern",
  combinationPrint: "Eigenproduktion",
  combinationFinishing: "extern vorbereiten",
  combinationPostpress: "intern schneiden / verpacken",
  combinationExternal: "Lieferant + Einkauf noch offen",
  materialCosts: "aus Papierstamm später",
  printCosts: "Maschinenstamm später",
  finishingCosts: "Matrix × Tarife später",
  externalCosts: "0,00 €",
  shippingCosts: "0,00 €",
  packagingCosts: "Verpackung pauschal später",
  overheadRate: "Gemeinkosten später",
  minPrice: "Mindestpreis prüfen",
  discount: "0 %",
  contributionMargin: "automatisch später",
  billingMode: "laut Angebot / Auftragsbestätigung",
  settlementNote: "Mengen laut Auftrag",
  commission: "keine Provision",
  invoiceControl: "Lieferschein / Lieferantenrechnung prüfen",
  controlPrintData: "Druckdaten / Freigabe prüfen",
  controlColorAccuracy: "Farbigkeit / Maßhaltigkeit prüfen",
  controlFinishing: "Weiterverarbeitung prüfen",
  controlQuantity: "Menge / Stückzahl prüfen",
  pocketSampleStatus: "Muster in Tasche",
  paperInvoiceStatus: "Papierrechnung später",
  supplierInvoiceStatus: "Lieferantenrechnung später",
  salePriceNet: "148,50 €",
};

function formatNumber(value: number) {
  return value.toLocaleString("de-DE");
}

function parseGermanNumber(value: string, fallback: number) {
  const normalized = value
    .replace(/[^0-9,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseGermanDate(value: string) {
  const match = value.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);

  if (!match) {
    return null;
  }

  const [, day, month, year] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function isDeliveryBeforeOfferDate(draft: CalculationDraft) {
  const offerDate = parseGermanDate(draft.offerDate);
  const deliveryDate = parseGermanDate(draft.dueDate);

  if (!offerDate || !deliveryDate) {
    return false;
  }

  return deliveryDate.getTime() < offerDate.getTime();
}

function parseInteger(value: string, fallback: number) {
  const parsed = Math.round(parseGermanNumber(value, fallback));
  return parsed > 0 ? parsed : fallback;
}

function parseFormatDimensions(label: string) {
  const match = label.match(/(\d+(?:[,.]\d+)?)\s*[×xX]\s*(\d+(?:[,.]\d+)?)/);

  if (!match) {
    return {
      label,
      widthMm: demoCalculationPayload.product.finalFormat.widthMm,
      heightMm: demoCalculationPayload.product.finalFormat.heightMm,
      orientation: demoCalculationPayload.product.finalFormat.orientation,
    };
  }

  const widthMm = parseGermanNumber(match[1], 0);
  const heightMm = parseGermanNumber(match[2], 0);

  return {
    label,
    widthMm,
    heightMm,
    orientation:
      widthMm >= heightMm ? ("landscape" as const) : ("portrait" as const),
  };
}

type ImpositionOrientation = "upright" | "rotated";

type ImpositionCalculatorVariant = {
  id: ImpositionOrientation;
  label: string;
  itemWidthMm: number;
  itemHeightMm: number;
  columns: number;
  rows: number;
  usedSlots: number;
  totalSlots: number;
  usablePercent: number;
  restWidthMm: number;
  restHeightMm: number;
};

type ImpositionCalculatorResult = {
  sheet: {
    label: string;
    widthMm: number;
    heightMm: number;
  };
  item: {
    label: string;
    finalWidthMm: number;
    finalHeightMm: number;
    calculationWidthMm: number;
    calculationHeightMm: number;
  };
  settings: {
    gapXMm: number;
    gapYMm: number;
    marginMm: number;
    includeBleed: boolean;
    rotationMode: string;
  };
  selected: ImpositionCalculatorVariant;
  variants: ImpositionCalculatorVariant[];
  production: {
    orderedQuantity: number;
    sheetsRequired: number;
    netQuantity: number;
    restQuantity: number;
    wasteSheets: number;
    grossSheets: number;
  };
  label: string;
};

const impositionBleedModeOptions = [
  { value: "Endformat", label: "Endformat rechnen" },
  { value: "inklusive Beschnitt", label: "inklusive Beschnitt rechnen" },
];

const impositionRotationModeOptions = [
  { value: "Drehung erlaubt", label: "Drehung erlaubt" },
  { value: "nur aufrecht", label: "nur aufrecht" },
  { value: "nur gedreht", label: "nur gedreht" },
];

function parseDimensionPairToMm(
  value: string,
  fallback: { widthMm: number; heightMm: number; label: string },
) {
  const normalized = value.replace(/[,]/g, ".");
  const match = normalized.match(
    /(\d+(?:\.\d+)?)\s*[×xX]\s*(\d+(?:\.\d+)?)(?:\s*(mm|cm))?/i,
  );

  if (!match) {
    return fallback;
  }

  const unitFromText = match[3]?.toLowerCase();
  const first = Number.parseFloat(match[1]);
  const second = Number.parseFloat(match[2]);
  const multiplier = unitFromText === "cm" ? 10 : 1;

  if (!Number.isFinite(first) || !Number.isFinite(second)) {
    return fallback;
  }

  return {
    label: value,
    widthMm: Math.round(first * multiplier * 10) / 10,
    heightMm: Math.round(second * multiplier * 10) / 10,
  };
}

function getSheetDimensionsFromDraft(draft: CalculationDraft) {
  const fallback = { widthMm: 450, heightMm: 320, label: "SRA3 · 450 × 320 mm" };
  const printSheet = parseDimensionPairToMm(draft.printSheetFormat, fallback);

  if (printSheet.widthMm !== fallback.widthMm || printSheet.heightMm !== fallback.heightMm) {
    return printSheet;
  }

  return parseDimensionPairToMm(draft.sheetFormat, printSheet);
}

function getImpositionVariant(
  id: ImpositionOrientation,
  label: string,
  sheetWidthMm: number,
  sheetHeightMm: number,
  itemWidthMm: number,
  itemHeightMm: number,
  gapXMm: number,
  gapYMm: number,
  marginMm: number,
): ImpositionCalculatorVariant {
  const usableWidth = Math.max(1, sheetWidthMm - marginMm * 2);
  const usableHeight = Math.max(1, sheetHeightMm - marginMm * 2);
  const columns = Math.max(1, Math.floor((usableWidth + gapXMm) / Math.max(1, itemWidthMm + gapXMm)));
  const rows = Math.max(1, Math.floor((usableHeight + gapYMm) / Math.max(1, itemHeightMm + gapYMm)));
  const totalSlots = columns * rows;
  const occupiedWidth = columns * itemWidthMm + Math.max(0, columns - 1) * gapXMm;
  const occupiedHeight = rows * itemHeightMm + Math.max(0, rows - 1) * gapYMm;
  const usablePercent = Math.min(100, (totalSlots * itemWidthMm * itemHeightMm) / (sheetWidthMm * sheetHeightMm) * 100);

  return {
    id,
    label,
    itemWidthMm,
    itemHeightMm,
    columns,
    rows,
    usedSlots: totalSlots,
    totalSlots,
    usablePercent,
    restWidthMm: Math.max(0, Math.round((usableWidth - occupiedWidth) * 10) / 10),
    restHeightMm: Math.max(0, Math.round((usableHeight - occupiedHeight) * 10) / 10),
  };
}

function calculateImpositionFromDraft(draft: CalculationDraft): ImpositionCalculatorResult {
  const sheet = getSheetDimensionsFromDraft(draft);
  const finalFormat = parseFormatDimensions(draft.finalFormat);
  const fallbackWidth = demoCalculationPayload.product.finalFormat.widthMm ?? 85;
  const fallbackHeight = demoCalculationPayload.product.finalFormat.heightMm ?? 55;
  const finalWidthMm = finalFormat.widthMm ?? fallbackWidth;
  const finalHeightMm = finalFormat.heightMm ?? fallbackHeight;
  const bleedMm = Math.max(0, parseGermanNumber(draft.bleedMm, 0));
  const legacyGapMm = Math.max(0, parseGermanNumber(draft.impositionGapMm, 0));
  const gapXMm = Math.max(0, parseGermanNumber(draft.impositionGapXMm, legacyGapMm));
  const gapYMm = Math.max(0, parseGermanNumber(draft.impositionGapYMm, legacyGapMm));
  const marginMm = Math.max(0, parseGermanNumber(draft.impositionMarginMm, 0));
  const includeBleed = draft.impositionUseBleed.toLowerCase().includes("beschnitt");
  const calculationWidthMm = finalWidthMm + (includeBleed ? bleedMm * 2 : 0);
  const calculationHeightMm = finalHeightMm + (includeBleed ? bleedMm * 2 : 0);
  const quantity = parseInteger(draft.quantity, demoCalculationPayload.product.quantity);
  const wasteSheets = Math.max(0, parseInteger(draft.wasteSheets, 0));
  const variants = [
    getImpositionVariant(
      "upright",
      "aufrecht",
      sheet.widthMm,
      sheet.heightMm,
      calculationWidthMm,
      calculationHeightMm,
      gapXMm,
      gapYMm,
      marginMm,
    ),
    getImpositionVariant(
      "rotated",
      "gedreht",
      sheet.widthMm,
      sheet.heightMm,
      calculationHeightMm,
      calculationWidthMm,
      gapXMm,
      gapYMm,
      marginMm,
    ),
  ].filter((variant) => {
    if (draft.impositionRotationMode === "nur aufrecht") {
      return variant.id === "upright";
    }

    if (draft.impositionRotationMode === "nur gedreht") {
      return variant.id === "rotated";
    }

    return true;
  });
  const selected = [...variants].sort((a, b) => {
    if (b.usedSlots !== a.usedSlots) {
      return b.usedSlots - a.usedSlots;
    }

    return b.usablePercent - a.usablePercent;
  })[0] ?? variants[0];
  const sheetsRequired = Math.max(1, Math.ceil(quantity / Math.max(1, selected.usedSlots)));
  const netQuantity = sheetsRequired * selected.usedSlots;
  const restQuantity = Math.max(0, netQuantity - quantity);
  const grossSheets = sheetsRequired + wasteSheets;

  return {
    sheet,
    item: {
      label: draft.finalFormat,
      finalWidthMm,
      finalHeightMm,
      calculationWidthMm,
      calculationHeightMm,
    },
    settings: {
      gapXMm,
      gapYMm,
      marginMm,
      includeBleed,
      rotationMode: draft.impositionRotationMode,
    },
    selected,
    variants,
    production: {
      orderedQuantity: quantity,
      sheetsRequired,
      netQuantity,
      restQuantity,
      wasteSheets,
      grossSheets,
    },
    label: `${selected.columns} × ${selected.rows} · ${selected.usedSlots} Nutzen`,
  };
}

function formatImpositionGapLabel(gapXMm: number, gapYMm: number) {
  const xLabel = formatMillimeterValue(gapXMm);
  const yLabel = formatMillimeterValue(gapYMm);

  if (gapXMm === gapYMm) {
    return xLabel;
  }

  return `X ${xLabel} / Y ${yLabel}`;
}

function getPlanTypeFromProductKind(productKind: ProductKind): CalculationImpositionResult["planType"] {
  switch (productKind) {
    case "business-card":
      return "business-card-24up";
    case "letterhead":
      return "letterhead-2up";
    case "brochure":
      return "brochure-signature";
    case "poster":
      return "wide-format-single";
    case "sticker":
      return "sticker-sheet";
    case "flyer":
    default:
      return "sheet-repeat";
  }
}

function buildPayloadFromDraft(
  draft: CalculationDraft,
  productionMode: ProductionMode,
  finishingRows: FinishingDraftRow[],
): CalculationToProductionPayload {
  const impositionResult = calculateImpositionFromDraft(draft);
  const quantity = impositionResult.production.orderedQuantity;
  const overs = parseInteger(draft.overs, impositionResult.production.restQuantity);
  const activeFinishing = finishingRows
    .filter((row) => row.active)
    .map((row) => row.label);
  const finalFormat = parseFormatDimensions(draft.finalFormat);
  const bleedMm = parseGermanNumber(
    draft.bleedMm,
    demoCalculationPayload.product.bleedMm ?? 3,
  );

  return {
    ...demoCalculationPayload,
    calculationId: draft.calculationId,
    product: {
      ...demoCalculationPayload.product,
      kind: draft.productKind,
      label: draft.productLabel,
      finalFormat,
      pages: draft.pages,
      quantity,
      substrate: draft.substrate,
      colorMode: draft.colorMode,
      bleedMm,
    },
    imposition: {
      ...demoCalculationPayload.imposition,
      planType: getPlanTypeFromProductKind(draft.productKind),
      sheet: {
        name: `${impositionResult.sheet.label}`,
        widthMm: impositionResult.sheet.widthMm,
        heightMm: impositionResult.sheet.heightMm,
        orientation:
          impositionResult.sheet.widthMm >= impositionResult.sheet.heightMm
            ? "landscape"
            : "portrait",
      },
      item: {
        finalFormat: draft.finalFormat,
        widthMm: finalFormat.widthMm,
        heightMm: finalFormat.heightMm,
      },
      layout: {
        columns: impositionResult.selected.columns,
        rows: impositionResult.selected.rows,
        usedSlots: impositionResult.selected.usedSlots,
        totalSlots: impositionResult.selected.totalSlots,
        gapMm: formatImpositionGapLabel(impositionResult.settings.gapXMm, impositionResult.settings.gapYMm),
        marginMm: impositionResult.settings.marginMm,
        orientation:
          impositionResult.selected.id === "rotated" ? "rotated" : "upright",
      },
      production: {
        orderedQuantity: quantity,
        sheetsRequired: impositionResult.production.sheetsRequired,
        overs,
        netQuantity: impositionResult.production.netQuantity,
        restQuantity: impositionResult.production.restQuantity,
      },
      finishingHints: activeFinishing.length
        ? activeFinishing
        : ["Weiterverarbeitung prüfen"],
      notes: [
        `Nutzen und Ausschießen: ${impositionResult.label}`,
        `Berechnungsbasis: ${impositionResult.settings.includeBleed ? "inklusive Beschnitt" : "Endformat"}`,
        `Zwischenschnitt: ${formatImpositionGapLabel(impositionResult.settings.gapXMm, impositionResult.settings.gapYMm)}`,
      ],
    },
    machine: {
      label:
        productionMode === "external"
          ? draft.externalSupplier
          : productionMode === "combined"
            ? `${draft.machine} + Fremdleistung`
            : draft.machine,
      type: demoCalculationPayload.machine?.type ?? "digital-color",
    },
  };
}


function getOfferPriceLabel(value: string) {
  return isDraftValueMissing(value) ? "Preis offen" : value;
}

function parseEuroAmount(value: string) {
  if (isDraftValueMissing(value)) {
    return null;
  }

  const normalized = value
    .replace(/[^0-9,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const parsed = Number.parseFloat(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

function formatEuroAmount(value: number) {
  return `${value.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}

function getOfferPriceBreakdown(netPriceLabel: string, quantity: number) {
  const net = parseEuroAmount(netPriceLabel);

  if (net === null) {
    return {
      netLabel: getOfferPriceLabel(netPriceLabel),
      unitNetLabel: "offen",
      taxLabel: "offen",
      grossLabel: "offen",
    };
  }

  const tax = net * (demoDocumentSettings.defaults.taxRatePercent / 100);
  const gross = net + tax;
  const unitNet = quantity > 0 ? net / quantity : net;

  return {
    netLabel: formatEuroAmount(net),
    unitNetLabel: formatEuroAmount(unitNet),
    taxLabel: formatEuroAmount(tax),
    grossLabel: formatEuroAmount(gross),
  };
}

function getOfferQuantityLabel(payload: CalculationToProductionPayload) {
  return `${formatNumber(payload.product.quantity)} Stück`;
}

function getOfferTitle(draft: CalculationDraft, payload: CalculationToProductionPayload) {
  return draft.projectName.trim() || payload.product.label;
}

function getOfferColorLabel(draft: CalculationDraft) {
  return draft.colorMode
    .replace(/\s*·\s*Skala/gi, " Euroskala")
    .replace(/CMYK/gi, "Euroskala")
    .replace(/\s+/g, " ")
    .trim();
}

function getOfferScopeAndColorLabel(draft: CalculationDraft) {
  const scope = draft.pages.trim();
  const color = getOfferColorLabel(draft);

  if (!scope || scope.toLowerCase() === color.toLowerCase()) {
    return color;
  }

  return `${scope} · ${color}`;
}

function getOfferMaterialLabel(draft: CalculationDraft) {
  const substrate = draft.substrate.trim();
  const grammage = draft.grammage.trim();

  if (!grammage || substrate.toLowerCase().includes(grammage.toLowerCase())) {
    return substrate;
  }

  return `${substrate} · ${grammage}`;
}


function isDocumentPlaceholderValue(value: string) {
  const normalized = value.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return (
    normalized.includes("später") ||
    normalized.includes("platzhalter") ||
    normalized.includes("placeholder") ||
    normalized === "firmenlogo" ||
    normalized === "logo"
  );
}

function getDocumentValueOrEmpty(value: string) {
  return isDocumentPlaceholderValue(value) ? "" : value.trim();
}

function getOfferDocumentLogo(draft: CalculationDraft) {
  const label = getDocumentValueOrEmpty(draft.documentLogoLabel);

  if (!label) {
    return null;
  }

  return {
    label,
    hint: getDocumentValueOrEmpty(draft.documentLogoHint),
  };
}

function getOfferVatIdLabel(draft: CalculationDraft) {
  const vatId = getDocumentValueOrEmpty(draft.senderVatId);

  if (!vatId) {
    return "";
  }

  return /ust|umsatzsteuer/i.test(vatId) ? vatId : `USt-ID ${vatId}`;
}

function getOfferTaxNumberLabel(draft: CalculationDraft) {
  const taxNumber = getDocumentValueOrEmpty(draft.senderTaxNumber);

  if (!taxNumber) {
    return "";
  }

  return /steuer/i.test(taxNumber) ? taxNumber : `Steuernummer ${taxNumber}`;
}

function getOfferFooterMeta(draft: CalculationDraft) {
  return [getOfferVatIdLabel(draft), getOfferTaxNumberLabel(draft), draft.offerId]
    .filter(Boolean)
    .join(" · ");
}

function getOfferSubject(draft: CalculationDraft) {
  return `Angebot ${draft.offerId} - ${draft.projectName}`;
}

function getOfferMailBody(draft: CalculationDraft, payload: CalculationToProductionPayload) {
  const price = getOfferPriceBreakdown(draft.salePriceNet, payload.product.quantity);

  return [
    `Guten Tag ${draft.contactName},`,
    "",
    `vielen Dank für Ihre Anfrage. Im Anhang erhalten Sie unser Angebot ${draft.offerId} für ${getOfferTitle(draft, payload)}.`,
    "",
    `Produkt: ${draft.productLabel}`,
    `Auflage: ${getOfferQuantityLabel(payload)}`,
    `Format: ${draft.finalFormat}`,
    `Material: ${getOfferMaterialLabel(draft)}`,
    `Gesamtsumme netto: ${price.netLabel}`,
    `Gesamtsumme brutto inkl. ${demoDocumentSettings.defaults.taxRatePercent} % Umsatzsteuer: ${price.grossLabel}`,
    "",
    `Das Angebot ist ${draft.offerValidUntil} gültig.`,
    "Bei Rückfragen stehen wir Ihnen gerne zur Verfügung.",
    "",
    "Mit freundlichen Grüßen",
    draft.owner,
    draft.senderCompany,
  ].join("\n");
}

function escapeOfferPrintText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getOfferPrintWindowHtml(title: string, offerMarkup: string) {
  const documentTitle = escapeOfferPrintText(title);

  return `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <base href="${window.location.origin}/" />
    <title>${documentTitle}</title>
    <style>
      @page { size: A4 portrait; margin: 0; }

      *, *::before, *::after { box-sizing: border-box; }

      html,
      body {
        width: 210mm;
        min-height: 297mm;
        margin: 0;
        padding: 0;
        background: #ffffff;
        color: #07183a;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      body { display: block; }

      .pp-offer-print-window {
        width: 210mm;
        min-height: 297mm;
        margin: 0;
        padding: 0;
        background: #ffffff;
      }

      .pp-print-offer-document {
        display: grid;
        grid-template-rows: auto auto auto auto auto auto 1fr auto;
        gap: 3.4mm;
        width: 210mm;
        min-height: 297mm;
        margin: 0;
        padding: 12mm 13mm 11mm;
        border: 0;
        border-radius: 0;
        background: #ffffff;
        color: #07183a;
        box-shadow: none;
      }

      .pp-offer-document__header {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: start;
        gap: 14mm;
        padding-bottom: 4.2mm;
        border-bottom: 1.2pt solid #00a8e0;
      }

      .pp-printpilot-logo,
      .pp-offer-document__logo {
        display: block;
        width: 42mm;
        max-width: 42mm;
        height: auto;
      }

      .pp-document-company-logo {
        display: grid;
        place-items: center;
        align-content: center;
        gap: .65mm;
        width: 36mm;
        min-width: 36mm;
        min-height: 19mm;
        padding: 2.2mm;
        border: .55pt solid #dbe6f1;
        border-radius: 3.2mm;
        background: #f8fbff;
        color: #008bd1;
        text-align: center;
      }

      .pp-document-company-logo span {
        color: #008bd1;
        font-size: 9.2pt;
        font-weight: 900;
        letter-spacing: .04em;
        text-transform: uppercase;
      }

      .pp-document-company-logo small {
        color: #53647c;
        font-size: 6.4pt;
        font-weight: 560;
        line-height: 1.1;
      }

      .pp-offer-document__meta {
        display: grid;
        gap: .6mm;
        min-width: 46mm;
        text-align: right;
      }

      .pp-offer-document__sender {
        display: flex;
        align-items: flex-start;
        gap: 5mm;
        min-width: 0;
      }

      .pp-offer-document__sender--without-logo {
        gap: 0;
      }

      .pp-offer-document__sender p {
        display: grid;
        gap: .45mm;
        margin: 0;
        color: #53647c;
        font-size: 7.4pt;
        font-weight: 520;
        line-height: 1.22;
      }

      .pp-offer-document__sender p strong {
        color: #07183a;
        font-size: 8.4pt;
        font-weight: 850;
      }

      .pp-offer-document__sender p span {
        color: #53647c;
        font-size: 7.4pt;
        font-weight: 520;
        letter-spacing: 0;
        text-transform: none;
      }

      .pp-offer-document__header span,
      .pp-offer-document__address span,
      .pp-offer-document__summary span,
      .pp-offer-document__positions th,
      .pp-offer-document__address dt {
        color: #24577d;
        font-size: 7.1pt;
        font-weight: 850;
        letter-spacing: .055em;
        text-transform: uppercase;
      }

      .pp-offer-document__header strong {
        color: #07183a;
        font-size: 18pt;
        font-weight: 950;
        letter-spacing: -.04em;
        line-height: 1;
      }

      .pp-offer-document__header small,
      .pp-offer-document__footer,
      .pp-offer-document__address p,
      .pp-offer-document__notes p,
      .pp-offer-document__intro p {
        color: #53647c;
        font-size: 8.6pt;
        font-weight: 520;
        line-height: 1.32;
      }

      .pp-offer-document__address {
        display: grid;
        grid-template-columns: minmax(0, 1.14fr) minmax(78mm, .86fr);
        gap: 7mm;
      }

      .pp-offer-document__address strong {
        display: block;
        margin: .8mm 0 1.7mm;
        color: #07183a;
        font-size: 12pt;
        font-weight: 850;
      }

      .pp-offer-document__address p { margin: 0 0 .8mm; }

      .pp-offer-document__address dl {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        margin: 0;
        border: .45pt solid #dbe6f1;
        border-radius: 3.2mm;
        overflow: hidden;
      }

      .pp-offer-document__address dl div {
        display: grid;
        gap: .7mm;
        min-height: 13mm;
        padding: 2.2mm 2.8mm;
        border-right: .35pt solid #e7eef7;
        border-bottom: .35pt solid #e7eef7;
      }

      .pp-offer-document__address dl div:nth-child(2n) { border-right: 0; }
      .pp-offer-document__address dl div:nth-last-child(-n + 2) { border-bottom: 0; }

      .pp-offer-document__address dd {
        margin: 0;
        color: #07183a;
        font-size: 8.6pt;
        font-weight: 760;
        line-height: 1.16;
      }

      .pp-offer-document__intro {
        padding: 3.2mm 3.8mm;
        border: .45pt solid #dbe6f1;
        border-radius: 3.2mm;
        background: #f8fbff;
      }

      .pp-offer-document__intro h1 {
        margin: 0 0 1.3mm;
        color: #18345e;
        font-size: 14.5pt;
        font-weight: 900;
        letter-spacing: -.04em;
        line-height: 1.04;
      }

      .pp-offer-document__intro p { margin: 0; }

      .pp-offer-document__summary {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        border: .45pt solid #dbe6f1;
        border-radius: 3.2mm;
        overflow: hidden;
      }

      .pp-offer-document__summary div {
        display: grid;
        gap: .9mm;
        min-height: 13mm;
        padding: 2.3mm 2.8mm;
        border-right: .35pt solid #e7eef7;
        border-bottom: .35pt solid #e7eef7;
      }

      .pp-offer-document__summary div:nth-child(3n) { border-right: 0; }
      .pp-offer-document__summary div:nth-last-child(-n + 3) { border-bottom: 0; }

      .pp-offer-document__summary b {
        color: #07183a;
        font-size: 8.4pt;
        font-weight: 740;
        line-height: 1.16;
      }

      .pp-offer-document__positions table {
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
        overflow: hidden;
        border: .45pt solid #dbe6f1;
        border-radius: 3.2mm;
      }

      .pp-offer-document__positions col:nth-child(1) { width: 9mm; }
      .pp-offer-document__positions col:nth-child(2) { width: auto; }
      .pp-offer-document__positions col:nth-child(3) { width: 22mm; }
      .pp-offer-document__positions col:nth-child(4) { width: 27mm; }
      .pp-offer-document__positions col:nth-child(5) { width: 31mm; }

      .pp-offer-document__positions th,
      .pp-offer-document__positions td {
        padding: 2.6mm 2.7mm;
        border-bottom: .35pt solid #e7eef7;
        text-align: left;
        vertical-align: top;
      }

      .pp-offer-document__positions th:last-child,
      .pp-offer-document__positions td:last-child { text-align: right; }

      .pp-offer-document__positions td {
        color: #07183a;
        font-size: 8.5pt;
        font-weight: 650;
        line-height: 1.2;
      }

      .pp-offer-document__positions td strong,
      .pp-offer-document__positions td span { display: block; }

      .pp-offer-document__positions td span {
        margin-top: .8mm;
        color: #53647c;
        font-weight: 540;
      }

      .pp-offer-document__positions th:nth-child(3),
      .pp-offer-document__positions td:nth-child(3),
      .pp-offer-document__positions th:nth-child(4),
      .pp-offer-document__positions td:nth-child(4),
      .pp-offer-document__positions th:nth-child(5),
      .pp-offer-document__positions td:nth-child(5) {
        text-align: right;
      }

      .pp-offer-document__positions tfoot td {
        border-bottom: 0;
        background: #f8fbff;
        color: #07183a;
        font-size: 9.3pt;
        font-weight: 850;
      }

      .pp-offer-document__positions .pp-offer-document__total-row td {
        background: #eaf8ff;
        color: #003d5d;
        font-size: 10.4pt;
        font-weight: 920;
      }

      .pp-offer-document__notes {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 3.2mm;
      }

      .pp-offer-document__notes div {
        padding: 2.8mm 3.2mm;
        border: .45pt solid #dbe6f1;
        border-radius: 3.2mm;
        background: #ffffff;
      }

      .pp-offer-document__notes h2 {
        margin: 0 0 1.3mm;
        color: #18345e;
        font-size: 9.6pt;
        font-weight: 850;
      }

      .pp-offer-document__notes p { margin: 0 0 .7mm; }

      .pp-offer-document__closing {
        display: grid;
        gap: .7mm;
        padding: 2.8mm 3.2mm;
        border: .45pt solid #dbe6f1;
        border-radius: 3.2mm;
        background: #ffffff;
      }

      .pp-offer-document__closing p,
      .pp-offer-document__closing span {
        margin: 0;
        color: #53647c;
        font-size: 8.6pt;
        font-weight: 520;
        line-height: 1.28;
      }

      .pp-offer-document__closing strong {
        margin-top: .4mm;
        color: #07183a;
        font-size: 8.8pt;
        font-weight: 820;
      }

      .pp-offer-document__footer {
        display: flex;
        align-self: end;
        justify-content: space-between;
        gap: 4mm;
        padding-top: 2.1mm;
        border-top: .35pt solid #e7eef7;
      }

      .pp-offer-document__footer span {
        min-width: 0;
        overflow-wrap: normal;
        word-break: normal;
        hyphens: none;
      }

      .pp-offer-document__footer-main {
        flex: 1 1 auto;
      }

      .pp-offer-document__footer-contact,
      .pp-offer-document__footer-meta {
        flex: 0 0 auto;
        white-space: nowrap;
      }

      @media print {
        html, body, .pp-offer-print-window, .pp-print-offer-document {
          width: 210mm;
          min-height: 297mm;
        }
      }
    </style>
  </head>
  <body>
    <main class="pp-offer-print-window">${offerMarkup}</main>
  </body>
</html>`;
}

function CalculationOfferDocument({
  draft,
  payload,
  finishingRows,
}: {
  draft: CalculationDraft;
  payload: CalculationToProductionPayload;
  finishingRows: FinishingDraftRow[];
  productionModeLabel: string;
  sheetCount: string;
}) {
  const activeFinishingLabels = getActiveFinishingLabels(finishingRows);
  const price = getOfferPriceBreakdown(draft.salePriceNet, payload.product.quantity);
  const offerTitle = getOfferTitle(draft, payload);
  const materialLabel = getOfferMaterialLabel(draft);
  const scopeAndColorLabel = getOfferScopeAndColorLabel(draft);
  const documentLogo = getOfferDocumentLogo(draft);
  const footerMeta = getOfferFooterMeta(draft);
  const offerRows = [
    ["Produkt", draft.productLabel],
    ["Auflage", getOfferQuantityLabel(payload)],
    ["Format", draft.finalFormat],
    ["Umfang / Farbigkeit", scopeAndColorLabel],
    ["Material", materialLabel],
    ["Weiterverarbeitung", activeFinishingLabels],
  ];

  return (
    <article className="pp-print-offer-document" aria-label="Angebot PDF-Vorschau">
      <header className="pp-offer-document__header">
        <div
          className={
            documentLogo
              ? "pp-offer-document__sender"
              : "pp-offer-document__sender pp-offer-document__sender--without-logo"
          }
        >
          {documentLogo ? (
            <div className="pp-document-company-logo" aria-label="Firmenlogo">
              <span>{documentLogo.label}</span>
              {documentLogo.hint ? <small>{documentLogo.hint}</small> : null}
            </div>
          ) : null}
          <p>
            <strong>{draft.senderCompany}</strong>
            <span>{draft.senderAddress}</span>
            <span>{draft.senderPhone} · {draft.senderEmail}</span>
            <span>{draft.senderWebsite}</span>
          </p>
        </div>
        <div className="pp-offer-document__meta">
          <span>Angebot</span>
          <strong>{draft.offerId}</strong>
          <small>{draft.offerDate}</small>
          <small>{draft.offerStatus}</small>
        </div>
      </header>

      <section className="pp-offer-document__address">
        <div>
          <span>Angebot an</span>
          <strong>{draft.customer}</strong>
          <p>{draft.contactName}</p>
          <p>{draft.billingAddress}</p>
          <p>{draft.contactEmail}</p>
        </div>
        <dl>
          <div>
            <dt>Projekt</dt>
            <dd>{offerTitle}</dd>
          </div>
          <div>
            <dt>Angebotsdatum</dt>
            <dd>{draft.offerDate}</dd>
          </div>
          <div>
            <dt>Liefertermin</dt>
            <dd>{draft.dueDate}</dd>
          </div>
          <div>
            <dt>Gültigkeit</dt>
            <dd>{draft.offerValidUntil}</dd>
          </div>
        </dl>
      </section>

      <section className="pp-offer-document__intro">
        <h1>Angebot für {offerTitle}</h1>
        <p>
          Vielen Dank für Ihre Anfrage. Gerne bieten wir Ihnen folgende
          Druckleistung an.
        </p>
      </section>

      <section className="pp-offer-document__summary" aria-label="Leistungsdaten">
        {offerRows.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <b>{value}</b>
          </div>
        ))}
      </section>

      <section className="pp-offer-document__positions" aria-label="Angebotspositionen">
        <table>
          <colgroup>
            <col />
            <col />
            <col />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th>Pos.</th>
              <th>Leistung</th>
              <th>Menge</th>
              <th>Einzelpreis netto</th>
              <th>Gesamtpreis netto</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>
                <strong>{offerTitle}</strong>
                <span>
                  {draft.productLabel} · {draft.finalFormat} · {scopeAndColorLabel} · {materialLabel}
                </span>
                <span>Weiterverarbeitung: {activeFinishingLabels}</span>
                <span>Lieferung: {draft.shippingMethod} · {draft.deliveryTimeWindow}</span>
              </td>
              <td>{getOfferQuantityLabel(payload)}</td>
              <td>{price.unitNetLabel}</td>
              <td>{price.netLabel}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}>Zwischensumme netto</td>
              <td>{price.netLabel}</td>
            </tr>
            <tr>
              <td colSpan={4}>Umsatzsteuer 19 %</td>
              <td>{price.taxLabel}</td>
            </tr>
            <tr className="pp-offer-document__total-row">
              <td colSpan={4}>Gesamtsumme brutto</td>
              <td>{price.grossLabel}</td>
            </tr>
          </tfoot>
        </table>
      </section>

      <section className="pp-offer-document__notes">
        <div>
          <h2>Hinweise</h2>
          <p>{draft.customerNote}</p>
          <p>{draft.settlementNote}</p>
        </div>
        <div>
          <h2>Konditionen</h2>
          <p>Zahlungsbedingungen: {draft.paymentTerms}</p>
          <p>Angebot gültig: {draft.offerValidUntil}</p>
          <p>Alle Preise verstehen sich netto zuzüglich {demoDocumentSettings.defaults.taxRatePercent} % gesetzlicher Umsatzsteuer. Die Gesamtsumme brutto ist ausgewiesen.</p>
        </div>
      </section>

      <section className="pp-offer-document__closing">
        <p>
          Wir freuen uns auf Ihre Rückmeldung und stehen für Rückfragen gerne zur Verfügung.
        </p>
        <strong>Mit freundlichen Grüßen</strong>
        <span>{draft.owner}</span>
      </section>

      <footer className="pp-offer-document__footer">
        <span className="pp-offer-document__footer-main">
          {draft.senderCompany} · {draft.senderAddress}
        </span>
        <span className="pp-offer-document__footer-contact">
          {draft.senderPhone} · {draft.senderEmail}
        </span>
        <span className="pp-offer-document__footer-meta">{footerMeta}</span>
      </footer>
    </article>
  );
}

function CalculationSoftwareDialog({
  dialog,
  onClose,
}: {
  dialog: CalculationDialogState;
  onClose: () => void;
}) {
  const variantLabel =
    dialog.variant === "warning"
      ? "Hinweis"
      : dialog.variant === "success"
        ? "Erledigt"
        : "Information";

  return (
    <div className="pp-software-dialog" role="presentation">
      <button
        className="pp-software-dialog__backdrop"
        type="button"
        aria-label="Dialog schließen"
        onClick={onClose}
      />
      <section
        className={[
          "pp-software-dialog__panel",
          `pp-software-dialog__panel--${dialog.variant}`,
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pp-calculation-dialog-title"
      >
        <div className="pp-software-dialog__head">
          <span>{variantLabel}</span>
          <button type="button" onClick={onClose} aria-label="Dialog schließen">
            ×
          </button>
        </div>
        <div className="pp-software-dialog__body">
          <h2 id="pp-calculation-dialog-title">{dialog.title}</h2>
          {dialog.body ? <p>{dialog.body}</p> : null}
          {dialog.items && dialog.items.length > 0 ? (
            <ul>
              {dialog.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="pp-software-dialog__actions">
          <button type="button" onClick={onClose}>
            {dialog.primaryLabel ?? "Verstanden"}
          </button>
        </div>
      </section>
    </div>
  );
}

function CalculationField({
  field,
  label,
  value,
  onValueChange,
  hint,
  badge: _badge,
  wide = false,
}: {
  field?: keyof CalculationDraft;
  label: string;
  value: string;
  onValueChange?: (value: string) => void;
  hint?: string;
  badge?: FieldBadge;
  wide?: boolean;
}) {
  const activeValidationFields = useContext(CalculationFieldValidationContext);
  const isMissingRequired =
    Boolean(field && activeValidationFields.has(String(field)) && isDraftValueMissing(value));

  return (
    <label
      className={[
        wide
          ? "pp-calc-input-field pp-calc-input-field--wide"
          : "pp-calc-input-field",
        isMissingRequired ? "is-required-missing" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span>
        <strong>{label}</strong>
      </span>
      <input
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
        readOnly={!onValueChange}
        aria-invalid={isMissingRequired || undefined}
      />
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function CalculationSelect({
  field,
  label,
  value,
  options,
  onValueChange,
  hint,
  badge: _badge,
}: {
  field?: keyof CalculationDraft;
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onValueChange?: (value: string) => void;
  hint?: string;
  badge?: FieldBadge;
}) {
  const activeValidationFields = useContext(CalculationFieldValidationContext);
  const isMissingRequired =
    Boolean(field && activeValidationFields.has(String(field)) && isDraftValueMissing(value));

  return (
    <label
      className={[
        "pp-calc-input-field",
        isMissingRequired ? "is-required-missing" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span>
        <strong>{label}</strong>
      </span>
      <select
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
        disabled={!onValueChange}
        aria-invalid={isMissingRequired || undefined}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function CalculationSection({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pp-calc-form-section">
      <div className="pp-calc-form-section__head">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function FinishingMatrixRow({
  row,
  onToggle,
  onChange,
}: {
  row: FinishingDraftRow;
  onToggle: (active: boolean) => void;
  onChange: (updates: Partial<FinishingDraftRow>) => void;
}) {
  return (
    <tr className={row.active ? "is-active" : undefined}>
      <td className="pp-calc-finishing-table__active">
        <label
          className="pp-calc-finishing-check"
          aria-label={`${row.label} aktivieren`}
        >
          <input
            type="checkbox"
            checked={row.active}
            onChange={(event) => onToggle(event.target.checked)}
          />
        </label>
      </td>
      <th scope="row">
        <b>{row.label}</b>
        <small>{row.note}</small>
      </th>
      <td>
        <span>{row.typeLabel}</span>
        <input
          value={row.typeValue}
          onChange={(event) => onChange({ typeValue: event.target.value })}
          aria-label={`${row.label} ${row.typeLabel}`}
        />
      </td>
      <td>
        <span>{row.amountLabel}</span>
        <input
          value={row.amountValue}
          onChange={(event) => onChange({ amountValue: event.target.value })}
          aria-label={`${row.label} ${row.amountLabel}`}
        />
      </td>
      <td>
        <span>{row.productionLabel}</span>
        <input
          value={row.productionValue}
          onChange={(event) =>
            onChange({ productionValue: event.target.value })
          }
          aria-label={`${row.label} ${row.productionLabel}`}
        />
      </td>
    </tr>
  );
}

function CalculationSheetPreview({
  payload,
}: {
  payload: CalculationToProductionPayload;
}) {
  const { imposition } = payload;
  const cells = Array.from(
    { length: imposition.layout.totalSlots },
    (_, index) => index + 1,
  );
  const previewImage = payload.preview?.generatedPreview?.imageSrc;
  const previewAlt =
    payload.preview?.generatedPreview?.alt ?? "Druckdatei-Preview";

  return (
    <div
      className="pp-calc-sheet-preview"
      aria-label="Nutzen- und Ausschießvorschau"
    >
      <div className="pp-calc-sheet-preview__bar">
        <span>{imposition.sheet.name}</span>
        <b>{imposition.layout.usedSlots} Nutzen</b>
      </div>
      <div
        className="pp-calc-sheet-preview__sheet"
        style={{
          gridTemplateColumns: `repeat(${imposition.layout.columns}, minmax(0, 1fr))`,
        }}
      >
        {cells.map((cell) => {
          const isUsed = cell <= imposition.layout.usedSlots;
          return (
            <span
              key={cell}
              className={
                isUsed
                  ? "pp-calc-sheet-preview__item"
                  : "pp-calc-sheet-preview__item is-empty"
              }
              aria-label={isUsed ? `Nutzen ${cell}` : `leerer Platz ${cell}`}
            >
              {isUsed && previewImage ? (
                <img src={previewImage} alt={previewAlt} loading="lazy" />
              ) : null}
            </span>
          );
        })}
      </div>
      <p>
        {imposition.sheet.widthMm && imposition.sheet.heightMm
          ? `${imposition.sheet.widthMm} × ${imposition.sheet.heightMm} mm`
          : imposition.sheet.name}
        {" · "}
        Raster {imposition.layout.columns} × {imposition.layout.rows}
        {" · "}
        Abstand {imposition.layout.gapMm ?? "offen"}
      </p>
    </div>
  );
}

function formatMillimeterValue(value: number) {
  return `${value.toLocaleString("de-DE", {
    maximumFractionDigits: 1,
  })} mm`;
}

function formatPercentValue(value: number) {
  return `${value.toLocaleString("de-DE", {
    maximumFractionDigits: 1,
  })} %`;
}

function ImpositionCalculatorPanel({
  draft,
  payload,
  result,
  onDraftChange,
}: {
  draft: CalculationDraft;
  payload: CalculationToProductionPayload;
  result: ImpositionCalculatorResult;
  onDraftChange: (field: keyof CalculationDraft) => (value: string) => void;
}) {
  return (
    <div className="pp-imposition-calculator pp-imposition-calculator--workbench">
      <div className="pp-imposition-calculator__editor">
        <div className="pp-imposition-calculator__editor-head">
          <span>Nutzenrechner</span>
          <strong>Nutzenplan einrichten</strong>
          <p>Beschnitt, Bogenrand, X-/Y-Zwischenschnitt und Drehregel steuern den Kalkulationsnutzen und bereiten den späteren Ausschießplan vor.</p>
        </div>
        <div className="pp-imposition-calculator__controls">
        <CalculationField
                      field="printSheetFormat"
          label="Druckbogen"
          value={draft.printSheetFormat}
          onValueChange={onDraftChange("printSheetFormat")}
          badge="Pflicht"
        />
        <CalculationField
                      field="finalFormat"
          label="Endformat"
          value={draft.finalFormat}
          onValueChange={onDraftChange("finalFormat")}
          badge="Pflicht"
        />
        <CalculationField
                      field="impositionMarginMm"
          label="Bogenrand"
          value={draft.impositionMarginMm}
          onValueChange={onDraftChange("impositionMarginMm")}
          hint="in Millimeter"
        />
        <CalculationField
                      field="impositionGapXMm"
          label="Zwischenschnitt X-Achse"
          value={draft.impositionGapXMm}
          onValueChange={onDraftChange("impositionGapXMm")}
          hint="horizontal zwischen den Nutzen"
        />
        <CalculationField
                      field="impositionGapYMm"
          label="Zwischenschnitt Y-Achse"
          value={draft.impositionGapYMm}
          onValueChange={onDraftChange("impositionGapYMm")}
          hint="vertikal zwischen den Nutzen"
        />
        <CalculationSelect
                      field="impositionUseBleed"
          label="Berechnungsbasis"
          value={draft.impositionUseBleed}
          options={impositionBleedModeOptions}
          onValueChange={onDraftChange("impositionUseBleed")}
        />
        <CalculationSelect
                      field="impositionRotationMode"
          label="Drehung"
          value={draft.impositionRotationMode}
          options={impositionRotationModeOptions}
          onValueChange={onDraftChange("impositionRotationMode")}
        />
        </div>
      </div>

      <div className="pp-imposition-calculator__preview">
        <CalculationSheetPreview payload={payload} />
        <div className="pp-imposition-calculator__imposing-plan" aria-label="Ausschießplan vorbereitet">
          <div>
            <span>Ausschießplan / Imposing</span>
            <strong>Vorbereitet</strong>
            <p>
              Der berechnete Nutzenplan bildet die Grundlage für den späteren produktionsfertigen Druckbogen.
            </p>
          </div>
          <dl>
            <div>
              <dt>Status</dt>
              <dd>noch kein PDF erzeugt</dd>
            </div>
            <div>
              <dt>Geplant</dt>
              <dd>Stand, Anlage, Vorderseite / Rückseite, Marken</dd>
            </div>
            <div>
              <dt>Ausgabe</dt>
              <dd>Druckbogen erzeugen folgt in eigener Engine</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="pp-imposition-calculator__result">
        <div className="pp-imposition-calculator__hero">
          <span>Beste Variante</span>
          <strong>{result.label}</strong>
          <p>
            {result.selected.label} · {formatPercentValue(result.selected.usablePercent)}
            Flächennutzung · Berechnungsformat {formatMillimeterValue(result.item.calculationWidthMm)} × {formatMillimeterValue(result.item.calculationHeightMm)}
            · Zwischenschnitt {formatImpositionGapLabel(result.settings.gapXMm, result.settings.gapYMm)}
          </p>
        </div>

        <div className="pp-imposition-calculator__metrics">
          <ResultLine label="Druckbogen" value={`${formatMillimeterValue(result.sheet.widthMm)} × ${formatMillimeterValue(result.sheet.heightMm)}`} />
          <ResultLine label="Zwischenschnitt" value={formatImpositionGapLabel(result.settings.gapXMm, result.settings.gapYMm)} />
          <ResultLine label="Nettobogen" value={`${formatNumber(result.production.sheetsRequired)} Bogen`} />
          <ResultLine label="Netto produziert" value={`${formatNumber(result.production.netQuantity)} Stück`} />
          <ResultLine label="Restmenge" value={`${formatNumber(result.production.restQuantity)} Stück`} />
          <ResultLine label="Zuschussbogen" value={`${formatNumber(result.production.wasteSheets)} Bogen`} />
          <ResultLine label="Bruttobogen" value={`${formatNumber(result.production.grossSheets)} Bogen`} />
        </div>
      </div>

      <div className="pp-imposition-calculator__variants" aria-label="Nutzenvarianten">
        <table>
          <thead>
            <tr>
              <th>Variante</th>
              <th>Raster</th>
              <th>Nutzen</th>
              <th>Ausnutzung</th>
              <th>Zwischenschnitt</th>
              <th>Restfläche</th>
            </tr>
          </thead>
          <tbody>
            {result.variants.map((variant) => (
              <tr
                key={variant.id}
                className={variant.id === result.selected.id ? "is-selected" : undefined}
              >
                <th scope="row">{variant.label}</th>
                <td>{variant.columns} × {variant.rows}</td>
                <td>{variant.usedSlots}</td>
                <td>{formatPercentValue(variant.usablePercent)}</td>
                <td>{formatImpositionGapLabel(result.settings.gapXMm, result.settings.gapYMm)}</td>
                <td>
                  {formatMillimeterValue(variant.restWidthMm)} × {formatMillimeterValue(variant.restHeightMm)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ResultLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="pp-calc-result-line">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

type CalculationTransferKind =
  | "order-pocket"
  | "order-internal"
  | "calculation-internal";

type CalculationTransferRow = {
  label: string;
  source: string;
  value: string;
  target: string;
  kind: CalculationTransferKind;
};

type CalculationTransferGroup = {
  title: string;
  helper: string;
  rows: CalculationTransferRow[];
};

function getTransferKindLabel(kind: CalculationTransferKind) {
  switch (kind) {
    case "order-pocket":
      return "Auftragstasche";
    case "order-internal":
      return "Auftrag intern";
    case "calculation-internal":
      return "nur Kalkulation";
    default:
      return "offen";
  }
}

function getActiveFinishingLabels(finishingRows: FinishingDraftRow[]) {
  const activeLabels = finishingRows
    .filter((row) => row.active)
    .map((row) => row.label);

  return activeLabels.length ? activeLabels.join(" · ") : "keine aktiven Schritte";
}

function buildCalculationTransferGroups({
  draft,
  payload,
  finishingRows,
  productionModeLabel,
  sheetCount,
}: {
  draft: CalculationDraft;
  payload: CalculationToProductionPayload;
  finishingRows: FinishingDraftRow[];
  productionModeLabel: string;
  sheetCount: string;
}): CalculationTransferGroup[] {
  const activeFinishingLabels = getActiveFinishingLabels(finishingRows);

  return [
    {
      title: "Kopfdaten",
      helper: "Steuert Kopfbereich und Identifikation der späteren Auftragstasche.",
      rows: [
        {
          label: "Kalkulationsnummer",
          source: "Auftrag / Status",
          value: draft.calculationId,
          target: "Auftrag · spätere Auftragsnummer wird separat erzeugt",
          kind: "order-internal",
        },
        {
          label: "Produkt",
          source: "Produkt / Farbigkeit",
          value: payload.product.label,
          target: "Auftragstasche · Kopf und Produktionsdaten",
          kind: "order-pocket",
        },
        {
          label: "Liefertermin",
          source: "Auftrag / Status",
          value: draft.dueDate,
          target: "Auftragstasche · Kopf und Lieferung / Versand",
          kind: "order-pocket",
        },
      ],
    },
    {
      title: "Produktionsdaten",
      helper: "Alles, was die Produktion sofort auf einen Blick braucht.",
      rows: [
        {
          label: "Auflage",
          source: "Menge / Lieferung",
          value: `${formatNumber(payload.product.quantity)} Stück`,
          target: "Auftragstasche · Produktionsdaten",
          kind: "order-pocket",
        },
        {
          label: "Endformat",
          source: "Produkt / Format",
          value: draft.finalFormat,
          target: "Auftragstasche · Produktionsdaten",
          kind: "order-pocket",
        },
        {
          label: "Farbigkeit",
          source: "Produkt / Farbigkeit",
          value: draft.colorMode,
          target: "Auftragstasche · Produktionsdaten und Druckdaten",
          kind: "order-pocket",
        },
        {
          label: "Produktionsweg",
          source: "Papier & Druck",
          value: productionModeLabel,
          target: "Auftrag intern · Planung / Produktionssteuerung",
          kind: "order-internal",
        },
      ],
    },
    {
      title: "Kunde",
      helper: "Kunden- und Kontaktinformationen ohne Preisdaten.",
      rows: [
        {
          label: "Kunde",
          source: "Kunde / Kontakt",
          value: draft.customer,
          target: "Auftragstasche · Kunde",
          kind: "order-pocket",
        },
        {
          label: "Ansprechpartner",
          source: "Kunde / Kontakt",
          value: draft.contactName,
          target: "Auftragstasche · Kunde",
          kind: "order-pocket",
        },
        {
          label: "Telefon und E-Mail",
          source: "Kunde / Kontakt",
          value: `${draft.contactPhone} · ${draft.contactEmail}`,
          target: "Auftragstasche · Kunde",
          kind: "order-pocket",
        },
        {
          label: "Kundenhinweis",
          source: "Auftrag / Status",
          value: draft.customerNote,
          target: "Auftrag intern · optional in Auftragstasche nach Relevanz",
          kind: "order-internal",
        },
      ],
    },
    {
      title: "Druckdaten",
      helper: "Datei, Prüfung, Freigabe und Korrekturstatus bleiben produktionsrelevant.",
      rows: [
        {
          label: "Druckdatei",
          source: "Produkt & Format",
          value: draft.printFileName,
          target: "Auftragstasche · Druckdaten",
          kind: "order-pocket",
        },
        {
          label: "Dateiversion / Ablageort",
          source: "Produkt & Format",
          value: `${draft.printFileVersion} · ${draft.printFileLocation}`,
          target: "Auftrag intern · Dateiablage / Historie",
          kind: "order-internal",
        },
        {
          label: "Datenprüfung",
          source: "Produkt & Format",
          value: `${draft.printDataCheck} · ${draft.preflight}`,
          target: "Auftragstasche · Druckdaten und Kontrolle",
          kind: "order-pocket",
        },
        {
          label: "Freigabe / Proof",
          source: "Produkt & Format",
          value: `${draft.approvalStatus} · ${draft.proofRequirement}`,
          target: "Auftragstasche · Druckdaten",
          kind: "order-pocket",
        },
      ],
    },
    {
      title: "Material / Druckbogen",
      helper: "Papier, Bogenformat, Zuschuss und Lieferanteninformation.",
      rows: [
        {
          label: "Material",
          source: "Papier / Material",
          value: `${draft.substrate} · ${draft.grammage}`,
          target: "Auftragstasche · Material / Druckbogen",
          kind: "order-pocket",
        },
        {
          label: "Druckbogen",
          source: "Papier / Material",
          value: `${draft.sheetFormat} · ${draft.printSheetFormat}`,
          target: "Auftragstasche · Material / Druckbogen und Nutzenplan",
          kind: "order-pocket",
        },
        {
          label: "Bogenmenge",
          source: "Papier / Material",
          value: `${sheetCount} Bogen · ${draft.wasteSheets}`,
          target: "Auftragstasche · Material / Druckbogen",
          kind: "order-pocket",
        },
        {
          label: "Papierlieferant / Lagerstatus",
          source: "Papier / Material",
          value: `${draft.supplier} · ${draft.stockStatus}`,
          target: "Auftragstasche · Material / Druckbogen",
          kind: "order-pocket",
        },
      ],
    },
    {
      title: "Druck / Nutzenplan",
      helper: "Maschine und Nutzenplan liefern Produktionsvorgaben, ohne in der Tasche neu zu rechnen.",
      rows: [
        {
          label: "Maschine",
          source: "Druck / Maschine",
          value: `${draft.machine} · ${draft.printType}`,
          target: "Auftragstasche · Produktionsdaten",
          kind: "order-pocket",
        },
        {
          label: "Nutzen",
          source: "Nutzen & Ausschießen",
          value: `${payload.imposition.layout.usedSlots} Nutzen · ${draft.impositionLabel}`,
          target: "Auftragstasche · Nutzenplan",
          kind: "order-pocket",
        },
        {
          label: "Beschnitt / Sicherheitsabstand",
          source: "Produkt / Format",
          value: `${draft.bleedMm} mm · ${draft.safetyMarginMm}`,
          target: "Auftragstasche · Druckdaten / Kontrolle",
          kind: "order-pocket",
        },
      ],
    },
    {
      title: "Weiterverarbeitung / Versand",
      helper: "Nur konkrete Produktionsanweisungen, keine Kalkulationstarife.",
      rows: [
        {
          label: "Aktive Leistungen",
          source: "Weiterverarbeitung",
          value: activeFinishingLabels,
          target: "Auftragstasche · Weiterverarbeitung",
          kind: "order-pocket",
        },
        {
          label: "Arbeitsanweisung",
          source: "Weiterverarbeitung",
          value: draft.workInstruction,
          target: "Auftragstasche · Weiterverarbeitung",
          kind: "order-pocket",
        },
        {
          label: "Zusatz / Verpackungshinweis",
          source: "Weiterverarbeitung",
          value: draft.pocketExtraNote,
          target: "Auftragstasche · Weiterverarbeitung / Lieferung",
          kind: "order-pocket",
        },
        {
          label: "Versand und Verpackung",
          source: "Menge / Lieferung",
          value: `${draft.shippingMethod} · ${draft.packagingPlan}`,
          target: "Auftragstasche · Lieferung / Versand",
          kind: "order-pocket",
        },
      ],
    },
    {
      title: "Kontrolle",
      helper: "Prüfpunkte für Produktion, Weiterverarbeitung und Versand.",
      rows: [
        {
          label: "Druckdaten / Freigabe",
          source: "Preise & Ergebnis",
          value: draft.controlPrintData,
          target: "Auftragstasche · Kontrolle",
          kind: "order-pocket",
        },
        {
          label: "Farbigkeit / Maßhaltigkeit",
          source: "Preise & Ergebnis",
          value: draft.controlColorAccuracy,
          target: "Auftragstasche · Kontrolle",
          kind: "order-pocket",
        },
        {
          label: "Weiterverarbeitung / Menge",
          source: "Preise & Ergebnis",
          value: `${draft.controlFinishing} · ${draft.controlQuantity}`,
          target: "Auftragstasche · Kontrolle",
          kind: "order-pocket",
        },
        {
          label: "Muster / Rechnungsbelege",
          source: "Preise & Ergebnis",
          value: `${draft.pocketSampleStatus} · ${draft.paperInvoiceStatus} · ${draft.supplierInvoiceStatus}`,
          target: "Auftragstasche · Kontrolle",
          kind: "order-pocket",
        },
      ],
    },
    {
      title: "Interne Kalkulationsdaten",
      helper: "Diese Werte gehören nicht auf die Auftragstasche.",
      rows: [
        {
          label: "Kostenblöcke",
          source: "Preise & Ergebnis",
          value: `${draft.materialCosts} · ${draft.printCosts} · ${draft.finishingCosts}`,
          target: "nur Kalkulation · Preisfindung",
          kind: "calculation-internal",
        },
        {
          label: "Marge / Deckungsbeitrag",
          source: "Preise & Ergebnis",
          value: `${draft.discount} · ${draft.contributionMargin} · ${draft.margin}`,
          target: "nur Kalkulation · Auswertung",
          kind: "calculation-internal",
        },
        {
          label: "Fremdkosten / Einkauf",
          source: "Fremdproduktion",
          value: `${draft.externalSupplier} · ${draft.externalPrice} · ${draft.externalFreight}`,
          target: "nur Kalkulation, außer Produktionsweg ist extern relevant",
          kind: "calculation-internal",
        },
      ],
    },
  ];
}

function CalculationTransferMapping({
  groups,
  compact = false,
}: {
  groups: CalculationTransferGroup[];
  compact?: boolean;
}) {
  const orderPocketLabel = getTransferKindLabel("order-pocket");
  const internalLabel = getTransferKindLabel("calculation-internal");
  const orderPocketGroupCount = groups.filter((group) =>
    group.rows.some((row) => row.kind === "order-pocket"),
  ).length;
  const internalGroupCount = groups.filter((group) =>
    group.rows.some((row) => row.kind === "calculation-internal"),
  ).length;

  const readinessItems = [
    {
      title: "Kundendaten",
      value: "Kunde, Ansprechpartner und Lieferadresse vorhanden",
    },
    {
      title: "Produktionsdaten",
      value: "Produkt, Auflage, Format, Material und Maschine definiert",
    },
    {
      title: "Druckdaten",
      value: "Datei, Datenprüfung, Freigabe und Korrekturstatus vorbereitet",
    },
    {
      title: "Weiterverarbeitung",
      value: "Leistungen, Arbeitsanweisung und Zusatz sind übergabefähig",
    },
    {
      title: "Lieferung",
      value: "Termin, Versandart, Verpackung und Teillieferung sind gesetzt",
    },
    {
      title: "Kontrolle",
      value: "Prüfpunkte für Druck, Weiterverarbeitung, Menge und Belege angelegt",
    },
  ];

  return (
    <div
      className={
        compact
          ? "pp-calculation-handoff-check pp-calculation-handoff-check--compact"
          : "pp-calculation-handoff-check"
      }
      aria-label="Übergabeprüfung für Auftrag und Auftragstasche"
    >
      <div className="pp-calculation-handoff-check__head">
        <span>Übergabeprüfung</span>
        <b>Bereit für Auftrag und Auftragstasche</b>
        <small>
          Der Benutzer sieht nur den Übergabestatus. Die genaue Feldzuordnung
          bleibt intern dokumentiert.
        </small>
      </div>

      <div className="pp-calculation-handoff-check__summary">
        <article>
          <span>Status</span>
          <b>übergabefähig</b>
          <small>Kalkulation kann in einen Auftragsentwurf überführt werden.</small>
        </article>
        <article>
          <span>Enthalten</span>
          <b>{orderPocketGroupCount} Produktionsbereiche</b>
          <small>Kunde, Produkt, Druck, Material, Weiterverarbeitung und Lieferung.</small>
        </article>
        <article>
          <span>Nicht auf der Auftragstasche</span>
          <b>{internalGroupCount} interne Bereiche</b>
          <small>Preise, Kosten, Margen und reine Kalkulationswerte bleiben intern.</small>
        </article>
      </div>

      {compact ? null : (
        <div className="pp-calculation-handoff-check__list">
          {readinessItems.map((item) => (
            <article key={item.title}>
              <span>{orderPocketLabel}</span>
              <b>{item.title}</b>
              <small>{item.value}</small>
            </article>
          ))}
          <article className="is-internal">
            <span>{internalLabel}</span>
            <b>Preis- und Kalkulationswerte</b>
            <small>
              Verkaufspreis, Kostenblöcke, Marge, Rabatt und Deckungsbeitrag
              werden nicht auf die Auftragstasche übernommen.
            </small>
          </article>
        </div>
      )}
    </div>
  );
}

function CalculationPlausibilityOverview({
  draft,
  activeFinishingCount,
  productionMode,
}: {
  draft: CalculationDraft;
  activeFinishingCount: number;
  productionMode: ProductionMode;
}) {
  return (
    <div
      className="pp-calculation-plausibility"
      aria-label="Plausibilitätsgruppen für spätere Kalkulationslogik"
    >
      <div className="pp-calculation-plausibility__head">
        <span>Plausibilitätsgruppen</span>
        <b>Vorbereitung für spätere Kalkulationslogik</b>
        <small>Nur fachliche Zuordnung · keine Preisberechnung</small>
      </div>
      <div className="pp-calculation-plausibility__grid">
        {calculationPlausibilityGroups.map((group) => {
          const preparedCount = countPreparedPlausibilityFields(
            draft,
            group.fields,
          );
          const totalCount = group.fields.length;
          const isMuted =
            group.id === "external-costs" && productionMode === "internal";
          const extraLabel =
            group.id === "finishing"
              ? `${activeFinishingCount} aktive Leistung${
                  activeFinishingCount === 1 ? "" : "en"
                }`
              : `${preparedCount}/${totalCount} Felder`;

          return (
            <article
              key={group.id}
              className={isMuted ? "is-muted" : undefined}
            >
              <span>{group.title}</span>
              <b>{extraLabel}</b>
              <p>{group.helper}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function CalculationFieldAudit() {
  const groups = [
    {
      title: "Pflichtfelder geschärft",
      items: [
        "Kalkulierbar: Auflage, Produkt, Format, Material, Maschine und Druckart",
        "Angebotsfähig: zusätzlich Kunde, Ansprechpartner, Umfang und Farbigkeit",
        "Auftragsfähig: zusätzlich Projekt, Bearbeiter und Liefertermin",
        "Beschnitt, Bogenformat, Nutzen und Grammatur blockieren nicht mehr pauschal",
      ],
    },
    {
      title: "Bedienfluss bereinigt",
      items: [
        "Kunde, Kontakt, Adressen und Auftrag bleiben im Startreiter",
        "Produkt, Format, Farben, Druckdatei, Freigabe und Auflage führen in einem Block zur Kalkulation",
        "Papierlieferant, Maschine, Druckart und Bogeninformationen stehen vor Weiterverarbeitung",
        "Fremdproduktion ist nur bei externem oder kombiniertem Produktionsweg blockierend",
        "Preise & Ergebnis bleibt Prüf- und Abschlussreiter ohne neue Preislogik",
      ],
    },
    {
      title: "Später bewusst nicht blockierend",
      items: [
        "Papierpreisimport, Preisstände und Lieferantenkataloge",
        "Maschinenzeiten, Klickkosten, Zählermodus und Zuschussautomatiken",
        "automatische Netto-/Restmengen, Zuschuss- und Sammelauftragslogik",
        "Deckungsbeitrag, Mindestpreis, Rabattregeln und Provision",
        "Rechnungskontrolle, Persistenz, Tariflogik und Druck-PDF",
      ],
    },
  ];

  return (
    <div
      className="pp-calculation-field-audit"
      aria-label="Fachlicher Feldcheck"
    >
      {groups.map((group) => (
        <article key={group.title}>
          <h3>{group.title}</h3>
          <ul>
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

export function CalculationPage({ onCreateOrderDraft }: CalculationPageProps) {
  const [draftWasCreated, setDraftWasCreated] = useState(false);
  const [offerPreviewOpen, setOfferPreviewOpen] = useState(false);
  const [offerWasPrepared, setOfferWasPrepared] = useState(false);
  const offerPrintRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<CalculationDraft>(initialDraft);
  const [productionMode, setProductionMode] =
    useState<ProductionMode>("internal");
  const [finishingRows, setFinishingRows] =
    useState<FinishingDraftRow[]>(initialFinishingRows);
  const [activeTab, setActiveTab] =
    useState<CalculationTabId>("customer-order");
  const [activeValidationFields, setActiveValidationFields] = useState<Array<keyof CalculationDraft>>([]);
  const [softwareDialog, setSoftwareDialog] = useState<CalculationDialogState | null>(null);
  const activeValidationFieldSet = useMemo(
    () => new Set(activeValidationFields.map(String)),
    [activeValidationFields],
  );

  const missingRequiredByTab = useMemo(() => {
    return calculationTabs.reduce<Record<CalculationTabId, number>>(
      (counts, tab) => {
        counts[tab.id] = activeValidationFields.filter(
          (field) =>
            getCalculationFieldTab(field) === tab.id &&
            isDraftValueMissing(String(draft[field] ?? "")),
        ).length;

        return counts;
      },
      {
        "customer-order": 0,
        "product-format": 0,
        "paper-print": 0,
        imposition: 0,
        finishing: 0,
        external: 0,
        prices: 0,
      },
    );
  }, [activeValidationFields, draft]);

  const productionModeRequiredFields = useMemo(
    () => getProductionModeRequiredFields(productionMode),
    [productionMode],
  );

  const calculationOpenFields = useMemo(
    () =>
      countMissingFields(draft, [
        ...calculationRequiredFields,
        ...productionModeRequiredFields,
      ]),
    [draft, productionModeRequiredFields],
  );

  const offerOpenFields = useMemo(
    () =>
      countMissingFields(draft, [
        ...offerRequiredFields,
        ...productionModeRequiredFields,
      ]),
    [draft, productionModeRequiredFields],
  );

  const orderRequiredFields = useMemo(
    () => getOrderRequiredFields(productionMode),
    [productionMode],
  );

  const activeTabOpenRequiredFields = missingRequiredByTab[activeTab];
  const canCreateOffer = offerOpenFields === 0;
  const orderOpenFields = countMissingFields(draft, orderRequiredFields);
  const canCreateOrderDraft = orderOpenFields === 0;
  const offerDateWarning = isDeliveryBeforeOfferDate(draft);
  const payload = useMemo(
    () => buildPayloadFromDraft(draft, productionMode, finishingRows),
    [draft, finishingRows, productionMode],
  );
  const impositionCalculatorResult = useMemo(
    () => calculateImpositionFromDraft(draft),
    [draft],
  );
  const activeFinishingCount = finishingRows.filter((row) => row.active).length;
  const result = payload.imposition;
  const productionModeLabel =
    productionModes.find((mode) => mode.id === productionMode)?.label ??
    "Eigenproduktion";
  const sheetCount = result.production.sheetsRequired
    ? formatNumber(result.production.sheetsRequired)
    : "offen";
  const calculationInfoRows = [
    ["Kunde", draft.customer],
    ["Produkt", payload.product.label],
    ["Auflage", `${formatNumber(payload.product.quantity)} Stück · ${sheetCount} Bogen`],
    ["Termin", draft.dueDate],
    ["Material", `${draft.substrate} · ${draft.grammage}`],
    ["Maschine", `${draft.machine} · ${draft.printType}`],
  ];
  const orderPocketPreviewRows = [
    ["Kunde", `${draft.customer} · ${draft.contactName}`],
    ["Produkt", `${payload.product.label} · ${draft.finalFormat}`],
    ["Druck", `${draft.machine} · ${draft.colorMode}`],
    ["Material", `${draft.substrate} · ${draft.grammage}`],
    [
      "Weiterverarbeitung",
      activeFinishingCount > 0
        ? `${activeFinishingCount} aktive Schritte`
        : "nur relevante Schritte",
    ],
    ["Arbeitsanweisung", draft.workInstruction],
    ["Zusatz", draft.pocketExtraNote],
    ["Lieferung", `${draft.shippingMethod} · ${draft.packagingPlan}`],
  ];
  const transferGroups = useMemo(
    () =>
      buildCalculationTransferGroups({
        draft,
        payload,
        finishingRows,
        productionModeLabel,
        sheetCount,
      }),
    [draft, finishingRows, payload, productionModeLabel, sheetCount],
  );

  const updateDraft = (field: keyof CalculationDraft) => (value: string) => {
    setDraft((currentDraft) => ({ ...currentDraft, [field]: value }));
    setDraftWasCreated(false);
    setOfferWasPrepared(false);
  };

  const updateFinishingRow = (
    id: string,
    updates: Partial<FinishingDraftRow>,
  ) => {
    setFinishingRows((currentRows) =>
      currentRows.map((row) => (row.id === id ? { ...row, ...updates } : row)),
    );
    setDraftWasCreated(false);
    setOfferWasPrepared(false);
  };

  const focusFirstMissingFieldTab = (missingFields: Array<keyof CalculationDraft>) => {
    const firstMissingField = missingFields[0];

    if (firstMissingField) {
      setActiveTab(getCalculationFieldTab(firstMissingField));
    }
  };

  const showValidationForFields = ({
    fields,
    headline,
    extraMessage,
  }: {
    fields: Array<keyof CalculationDraft>;
    headline: string;
    extraMessage: string;
  }) => {
    const missingFields = Array.from(new Set(fields)).filter((field) =>
      isDraftValueMissing(String(draft[field] ?? "")),
    );
    const missingLabels = getMissingFieldLabels(draft, missingFields);

    setActiveValidationFields(missingFields);
    focusFirstMissingFieldTab(missingFields);

    setSoftwareDialog({
      variant: "warning",
      title: headline,
      body: extraMessage,
      items: buildDialogItems(missingLabels),
      primaryLabel: "Angaben prüfen",
    });
  };

  const showOfferValidation = () => {
    showValidationForFields({
      fields: [...offerRequiredFields, ...productionModeRequiredFields],
      headline: "Das Angebot kann noch nicht erzeugt werden.",
      extraMessage:
        "Die Maske bleibt bewusst ruhig. PrintPilot markiert jetzt nur die Felder, die für diese Aktion fehlen.",
    });
  };

  const showOfferEmailValidation = () => {
    showValidationForFields({
      fields: [...offerEmailRequiredFields, ...productionModeRequiredFields],
      headline: "Die Angebots-E-Mail kann noch nicht vorbereitet werden.",
      extraMessage:
        "Für die E-Mail-Vorbereitung werden Angebotsdaten und die E-Mail-Adresse des Ansprechpartners geprüft.",
    });
  };

  const showOrderValidation = () => {
    showValidationForFields({
      fields: orderRequiredFields,
      headline: "Der Auftrag kann noch nicht vorbereitet werden.",
      extraMessage:
        "Bitte die markierten Angaben ergänzen und die Aktion danach erneut ausführen.",
    });
  };

  const handlePrepareOffer = () => {
    if (!canCreateOffer) {
      showOfferValidation();
      return;
    }

    setActiveValidationFields([]);
    setSoftwareDialog(null);
    setOfferPreviewOpen(true);
    setOfferWasPrepared(true);
    setActiveTab("prices");
  };

  const handlePrintOffer = () => {
    if (!canCreateOffer) {
      showOfferValidation();
      return;
    }

    setActiveValidationFields([]);
    setSoftwareDialog(null);
    setOfferPreviewOpen(true);
    setOfferWasPrepared(true);

    const offerMarkup = offerPrintRef.current?.innerHTML;

    if (!offerMarkup) {
      setSoftwareDialog({
        variant: "warning",
        title: "Angebotsdokument nicht bereit",
        body: "Das Angebotsdokument konnte noch nicht vorbereitet werden. Bitte Angebot anzeigen und danach erneut als PDF drucken.",
      });
      return;
    }

    const printWindow = window.open(
      "",
      "printpilot-offer-print",
      "width=920,height=1200,menubar=no,toolbar=no,location=no,status=no",
    );

    if (!printWindow) {
      setSoftwareDialog({
        variant: "warning",
        title: "Druckfenster blockiert",
        body: "Das Druckfenster wurde vom Browser blockiert. Bitte Pop-ups für PrintPilot erlauben und erneut drucken.",
      });
      return;
    }

    printWindow.document.open();
    printWindow.document.write(
      getOfferPrintWindowHtml(getOfferSubject(draft), offerMarkup),
    );
    printWindow.document.close();

    window.setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 260);
  };

  const handlePrepareOfferEmail = () => {
    const missingEmailFields = countMissingFields(draft, [
      ...offerEmailRequiredFields,
      ...productionModeRequiredFields,
    ]);

    if (missingEmailFields > 0) {
      showOfferEmailValidation();
      return;
    }

    setActiveValidationFields([]);
    setSoftwareDialog(null);
    setOfferPreviewOpen(true);
    setOfferWasPrepared(true);

    const mailto = new URL(`mailto:${draft.contactEmail}`);
    mailto.searchParams.set("subject", getOfferSubject(draft));
    mailto.searchParams.set("body", getOfferMailBody(draft, payload));
    window.location.href = mailto.toString();
  };

  const handleCreateOrderDraft = () => {
    if (!canCreateOrderDraft) {
      showOrderValidation();
      return;
    }

    const dueDateParts = draft.dueDate.split("·").map((part) => part.trim());
    const draftOrder = createOrderDraftFromCalculation(
      payload,
      getFallbackOrder(),
      {
        customer: draft.customer,
        customerAddress: draft.deliveryAddress
          .split("·")
          .map((line) => line.trim()),
        contactName: draft.contactName,
        contactPhone: draft.contactPhone,
        contactEmail: draft.contactEmail,
        dueDate: dueDateParts[0] || draft.dueDate,
        dueMeta: dueDateParts[1] ? `Do · ${dueDateParts[1]}` : "Do · 11:00",
        owner: draft.owner,
      },
    );

    onCreateOrderDraft(draftOrder);
    setActiveValidationFields([]);
    setSoftwareDialog(null);
    setDraftWasCreated(true);
  };

  return (
    <div className="pp-calculation-page">
      <header className="pp-master-header pp-calculation-master-header">
        <div className="pp-header-brand">
          <PrintPilotLogo className="pp-brand-logo" variant="app" />
        </div>
        <div className="pp-header-title-shape">
          <h1>KALKULATION</h1>
          <p>Produktionsdaten · Preisfindung · Auftragstasche</p>
        </div>
        <div
          className="pp-header-job pp-header-job--overview"
          aria-label="Kalkulationsnummer"
        >
          <span>Demo-Kalkulation</span>
          <strong>{payload.calculationId ?? "CALC"}</strong>
        </div>
      </header>

      <CalculationFieldValidationContext.Provider value={activeValidationFieldSet}>
        <section className="pp-calculation-layout pp-calculation-layout--tabs">
        <div
          className="pp-calculation-form"
          aria-label="Kalkulation Reitermaske"
        >
          <div className="pp-calculation-form__intro pp-calculation-tabs-intro">
            <div>
              <p className="pp-eyebrow">Auftragstaschen-Design</p>
              <h2>Kalkulation</h2>
              <p className="pp-calculation-intro-copy">
                Eingabemaske für produktionsrelevante Kalkulationsdaten. Doppelte
                Begriffe sind getrennt, damit die Werte sauber in Auftrag und
                Auftragstasche übernommen werden.
              </p>
            </div>
            <aside
              className="pp-calculation-compact-info"
              aria-label="Wichtigste Kalkulationsdaten"
            >
              <div className="pp-calculation-compact-info__head">
                <span>Demo-Kalkulation</span>
                <b>{payload.calculationId ?? "CALC"}</b>
              </div>
              <dl>
                {calculationInfoRows.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>

          <nav
            className="pp-calculation-tabs"
            aria-label="Kalkulationsbereiche"
          >
            {calculationTabs.map((tab) => {
              const missingCount = missingRequiredByTab[tab.id];
              const isExternalMuted =
                tab.id === "external" && productionMode === "internal";

              return (
                <button
                  key={tab.id}
                  type="button"
                  className={[
                    activeTab === tab.id ? "is-active" : "",
                    missingCount > 0 ? "has-open-required" : "",
                    isExternalMuted ? "is-muted" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={activeTab === tab.id ? "page" : undefined}
                >
                  <span>{tab.shortcut}</span>
                  <b>{tab.label}</b>
                  {missingCount > 0 ? <small>{`${missingCount} offen`}</small> : null}
                </button>
              );
            })}
          </nav>

          <div className="pp-calculation-tab-panel">
            {activeTab === "customer-order" ? (
              <>
                <CalculationSection eyebrow="01" title="Kunde / Kontakt">
                  <div className="pp-calc-input-grid pp-calc-input-grid--four">
                    <CalculationField
                      field="customer"
                      label="Kunde"
                      value={draft.customer}
                      onValueChange={updateDraft("customer")}
                      badge="Pflicht"
                    />
                    <CalculationField
                      field="contactName"
                      label="Ansprechpartner"
                      value={draft.contactName}
                      onValueChange={updateDraft("contactName")}
                      badge="Pflicht"
                    />
                    <CalculationField
                      field="contactPhone"
                      label="Telefon"
                      value={draft.contactPhone}
                      onValueChange={updateDraft("contactPhone")}
                      badge="optional"
                    />
                    <CalculationField
                      field="contactEmail"
                      label="E-Mail"
                      value={draft.contactEmail}
                      onValueChange={updateDraft("contactEmail")}
                      badge="optional"
                    />
                    <CalculationField
                      field="owner"
                      label="Bearbeiter"
                      value={draft.owner}
                      onValueChange={updateDraft("owner")}
                      badge="Pflicht"
                    />
                    <CalculationField
                      field="billingAddress"
                      label="Rechnung an"
                      value={draft.billingAddress}
                      onValueChange={updateDraft("billingAddress")}
                      badge="optional"
                      wide
                    />
                    <CalculationField
                      field="deliveryAddress"
                      label="Lieferadresse"
                      value={draft.deliveryAddress}
                      onValueChange={updateDraft("deliveryAddress")}
                      badge="optional"
                      wide
                    />
                  </div>
                </CalculationSection>

                <CalculationSection eyebrow="02" title="Auftrag / Status">
                  <div className="pp-calc-input-grid pp-calc-input-grid--four">
                    <CalculationField
                      field="projectName"
                      label="Projekt / Jobname"
                      value={draft.projectName}
                      onValueChange={updateDraft("projectName")}
                      badge="Pflicht"
                      wide
                    />
                    <CalculationField
                      field="calculationId"
                      label="Kalkulationsnummer"
                      value={draft.calculationId}
                      onValueChange={updateDraft("calculationId")}
                      badge="optional"
                    />
                    <CalculationField
                      field="orderType"
                      label="Auftragsart"
                      value={draft.orderType}
                      onValueChange={updateDraft("orderType")}
                      badge="optional"
                    />
                    <CalculationField
                      field="dueDate"
                      label="Liefertermin"
                      value={draft.dueDate}
                      onValueChange={updateDraft("dueDate")}
                      badge="Pflicht"
                    />
                    <CalculationField
                      field="correctionDeadline"
                      label="Korrektur bis"
                      value={draft.correctionDeadline}
                      onValueChange={updateDraft("correctionDeadline")}
                      badge="optional"
                    />
                    <CalculationField
                      field="dataStatus"
                      label="Datenstatus"
                      value={draft.dataStatus}
                      onValueChange={updateDraft("dataStatus")}
                      badge="optional"
                    />
                    <CalculationField
                      field="customerReference"
                      label="Kundenreferenz"
                      value={draft.customerReference}
                      onValueChange={updateDraft("customerReference")}
                      badge="optional"
                    />
                    <CalculationField
                      field="customerOrderNumber"
                      label="Bestellnummer"
                      value={draft.customerOrderNumber}
                      onValueChange={updateDraft("customerOrderNumber")}
                      badge="optional"
                    />
                    <CalculationField
                      field="customerNote"
                      label="Kundenhinweis"
                      value={draft.customerNote}
                      onValueChange={updateDraft("customerNote")}
                      badge="optional"
                      wide
                    />
                    <CalculationField
                      field="internalNote"
                      label="Interne Notiz"
                      value={draft.internalNote}
                      onValueChange={updateDraft("internalNote")}
                      badge="optional"
                      wide
                    />
                  </div>
                </CalculationSection>

                <CalculationSection eyebrow="03" title="Menge / Lieferung">
                  <div className="pp-calc-input-grid pp-calc-input-grid--four">
                    <CalculationField
                      field="quantity"
                      label="Hauptauflage"
                      value={draft.quantity}
                      onValueChange={updateDraft("quantity")}
                      badge="Pflicht"
                    />
                    <CalculationField
                      field="overs"
                      label="Geplante Übermenge"
                      value={draft.overs}
                      onValueChange={updateDraft("overs")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Netto-Menge"
                      value={`${formatNumber(result.production.netQuantity ?? 0)} Stück`}
                      badge="später"
                    />
                    <CalculationField
                      label="Restmenge"
                      value={`${formatNumber(result.production.restQuantity ?? 0)} Stück`}
                      badge="später"
                    />
                    <CalculationField
                      field="overdeliveryRule"
                      label="Überlieferung"
                      value={draft.overdeliveryRule}
                      onValueChange={updateDraft("overdeliveryRule")}
                      badge="optional"
                    />
                    <CalculationField
                      field="partialDeliveries"
                      label="Teillieferungen"
                      value={draft.partialDeliveries}
                      onValueChange={updateDraft("partialDeliveries")}
                      badge="optional"
                    />
                    <CalculationField
                      field="shippingMethod"
                      label="Versandart"
                      value={draft.shippingMethod}
                      onValueChange={updateDraft("shippingMethod")}
                      badge="optional"
                    />
                    <CalculationField
                      field="packagingPlan"
                      label="Verpackung"
                      value={draft.packagingPlan}
                      onValueChange={updateDraft("packagingPlan")}
                      badge="optional"
                      wide
                    />
                    <CalculationField
                      field="deliveryTimeWindow"
                      label="Lieferzeit / Tour"
                      value={draft.deliveryTimeWindow}
                      onValueChange={updateDraft("deliveryTimeWindow")}
                      badge="optional"
                    />
                    <CalculationField
                      field="neutralShipping"
                      label="Neutralversand / Label"
                      value={draft.neutralShipping}
                      onValueChange={updateDraft("neutralShipping")}
                      badge="optional"
                    />
                    <CalculationField
                      field="deliveryNoteStatus"
                      label="Lieferschein"
                      value={draft.deliveryNoteStatus}
                      onValueChange={updateDraft("deliveryNoteStatus")}
                      badge="optional"
                    />
                    <CalculationField
                      field="samples"
                      label="Muster / Belege"
                      value={draft.samples}
                      onValueChange={updateDraft("samples")}
                      badge="optional"
                    />
                    <CalculationField
                      field="variants"
                      label="Varianten"
                      value={draft.variants}
                      onValueChange={updateDraft("variants")}
                      badge="optional"
                    />
                    <CalculationField
                      field="tier1"
                      label="Staffel 1"
                      value={draft.tier1}
                      onValueChange={updateDraft("tier1")}
                      badge="optional"
                    />
                    <CalculationField
                      field="tier2"
                      label="Staffel 2"
                      value={draft.tier2}
                      onValueChange={updateDraft("tier2")}
                      badge="optional"
                    />
                    <CalculationField
                      field="tier3"
                      label="Staffel 3"
                      value={draft.tier3}
                      onValueChange={updateDraft("tier3")}
                      badge="optional"
                    />
                  </div>
                </CalculationSection>
              </>
            ) : null}

            {activeTab === "product-format" ? (
              <>
                <CalculationSection eyebrow="04" title="Produkt / Farbigkeit">
                  <div className="pp-calc-input-grid pp-calc-input-grid--four">
                    <CalculationSelect
                      field="productKind"
                      label="Produktart"
                      value={draft.productKind}
                      options={productKindOptions}
                      onValueChange={(value) =>
                        updateDraft("productKind")(value as ProductKind)
                      }
                      badge="Pflicht"
                    />
                    <CalculationField
                      field="productLabel"
                      label="Bezeichnung"
                      value={draft.productLabel}
                      onValueChange={updateDraft("productLabel")}
                      wide
                      badge="Pflicht"
                    />
                    <CalculationField
                      field="pages"
                      label="Seiten / Umfang"
                      value={draft.pages}
                      onValueChange={updateDraft("pages")}
                      badge="Pflicht"
                    />
                    <CalculationField
                      field="colorMode"
                      label="Farbigkeit"
                      value={draft.colorMode}
                      onValueChange={updateDraft("colorMode")}
                      badge="optional"
                    />
                    <CalculationField
                      field="frontColors"
                      label="Farben Vorderseite"
                      value={draft.frontColors}
                      onValueChange={updateDraft("frontColors")}
                      badge="optional"
                    />
                    <CalculationField
                      field="backColors"
                      label="Farben Rückseite"
                      value={draft.backColors}
                      onValueChange={updateDraft("backColors")}
                      badge="optional"
                    />
                    <CalculationField
                      field="spotColors"
                      label="Sonderfarben"
                      value={draft.spotColors}
                      onValueChange={updateDraft("spotColors")}
                      badge="optional"
                    />
                    <CalculationField
                      field="versions"
                      label="Motive / Sorten"
                      value={draft.versions}
                      onValueChange={updateDraft("versions")}
                      badge="optional"
                    />
                    <CalculationField
                      field="personalization"
                      label="Personalisierung"
                      value={draft.personalization}
                      onValueChange={updateDraft("personalization")}
                      badge="später"
                    />
                  </div>
                </CalculationSection>

                <CalculationSection eyebrow="05" title="Format / Druckdaten">
                  <div className="pp-calc-input-grid pp-calc-input-grid--four">
                    <CalculationField
                      field="finalFormat"
                      label="Endformat"
                      value={draft.finalFormat}
                      onValueChange={updateDraft("finalFormat")}
                      badge="Pflicht"
                    />
                    <CalculationField
                      field="openFormat"
                      label="Offenes Format"
                      value={draft.openFormat}
                      onValueChange={updateDraft("openFormat")}
                      badge="optional"
                    />
                    <CalculationField
                      field="orientation"
                      label="Ausrichtung"
                      value={draft.orientation}
                      onValueChange={updateDraft("orientation")}
                      badge="optional"
                    />
                    <CalculationField
                      field="bleedMm"
                      label="Beschnitt"
                      value={draft.bleedMm}
                      onValueChange={updateDraft("bleedMm")}
                      badge="optional"
                    />
                    <CalculationField
                      field="safetyMarginMm"
                      label="Sicherheitsabstand"
                      value={draft.safetyMarginMm}
                      onValueChange={updateDraft("safetyMarginMm")}
                      badge="optional"
                    />
                    <CalculationField
                      field="productionFormat"
                      label="Nutzenformat"
                      value={draft.productionFormat}
                      onValueChange={updateDraft("productionFormat")}
                      badge="später"
                    />
                    <CalculationField
                      field="specialShape"
                      label="Sonderform / Stanze"
                      value={draft.specialShape}
                      onValueChange={updateDraft("specialShape")}
                      badge="optional"
                    />
                    <CalculationField
                      field="dataSource"
                      label="Datenquelle"
                      value={draft.dataSource}
                      onValueChange={updateDraft("dataSource")}
                      badge="optional"
                    />
                    <CalculationField
                      field="preflight"
                      label="Datenprüfung"
                      value={draft.preflight}
                      onValueChange={updateDraft("preflight")}
                      badge="optional"
                    />
                    <CalculationField
                      field="printFileName"
                      label="Druckdatei"
                      value={draft.printFileName}
                      onValueChange={updateDraft("printFileName")}
                      badge="Pflicht"
                      wide
                    />
                    <CalculationField
                      field="printFileVersion"
                      label="Dateiversion"
                      value={draft.printFileVersion}
                      onValueChange={updateDraft("printFileVersion")}
                      badge="optional"
                    />
                    <CalculationField
                      field="printFileLocation"
                      label="Ablageort / Link"
                      value={draft.printFileLocation}
                      onValueChange={updateDraft("printFileLocation")}
                      badge="optional"
                      wide
                    />
                    <CalculationField
                      field="printDataCheck"
                      label="Druckdaten geprüft"
                      value={draft.printDataCheck}
                      onValueChange={updateDraft("printDataCheck")}
                      badge="optional"
                    />
                    <CalculationField
                      field="approvalStatus"
                      label="Freigabe"
                      value={draft.approvalStatus}
                      onValueChange={updateDraft("approvalStatus")}
                      badge="optional"
                    />
                    <CalculationField
                      field="proofRequirement"
                      label="Proof / Muster"
                      value={draft.proofRequirement}
                      onValueChange={updateDraft("proofRequirement")}
                      badge="optional"
                    />
                  </div>
                </CalculationSection>
              </>
            ) : null}

            {activeTab === "paper-print" ? (
              <>
                <CalculationSection eyebrow="06" title="Papier / Material">
                  <div className="pp-calc-input-grid pp-calc-input-grid--four">
                    <CalculationField
                      field="materialGroup"
                      label="Materialgruppe"
                      value={draft.materialGroup}
                      onValueChange={updateDraft("materialGroup")}
                      badge="optional"
                    />
                    <CalculationField
                      field="substrate"
                      label="Artikel"
                      value={draft.substrate}
                      onValueChange={updateDraft("substrate")}
                      badge="Pflicht"
                      wide
                    />
                    <CalculationField
                      field="grammage"
                      label="Grammatur"
                      value={draft.grammage}
                      onValueChange={updateDraft("grammage")}
                      badge="optional"
                    />
                    <CalculationField
                      field="sheetFormat"
                      label="Bogenformat"
                      value={draft.sheetFormat}
                      onValueChange={updateDraft("sheetFormat")}
                      badge="optional"
                    />
                    <CalculationField
                      field="grainDirection"
                      label="Laufrichtung"
                      value={draft.grainDirection}
                      onValueChange={updateDraft("grainDirection")}
                      badge="optional"
                    />
                    <CalculationField
                      field="rawSheetFormat"
                      label="Rohbogenformat"
                      value={draft.rawSheetFormat}
                      onValueChange={updateDraft("rawSheetFormat")}
                      badge="optional"
                    />
                    <CalculationField
                      field="printSheetFormat"
                      label="Druckbogenformat"
                      value={draft.printSheetFormat}
                      onValueChange={updateDraft("printSheetFormat")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Papier-Nutzen"
                      value={impositionCalculatorResult.label}
                      badge="Pflicht"
                    />
                    <CalculationField
                      label="Nettobogen"
                      value={`${formatNumber(impositionCalculatorResult.production.sheetsRequired)} Nettobogen`}
                      badge="Pflicht"
                    />
                    <CalculationField
                      field="wasteSheets"
                      label="Zuschussbogen"
                      value={draft.wasteSheets}
                      onValueChange={updateDraft("wasteSheets")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Bruttobogen"
                      value={`${formatNumber(impositionCalculatorResult.production.grossSheets)} Bruttobogen`}
                      badge="Pflicht"
                    />
                    <CalculationField
                      field="stockStatus"
                      label="Lagerstatus"
                      value={draft.stockStatus}
                      onValueChange={updateDraft("stockStatus")}
                      badge="optional"
                    />
                    <CalculationField
                      field="paperSource"
                      label="Papierquelle"
                      value={draft.paperSource}
                      onValueChange={updateDraft("paperSource")}
                      badge="optional"
                    />
                    <CalculationField
                      field="paperOrderStatus"
                      label="Papierbestellung"
                      value={draft.paperOrderStatus}
                      onValueChange={updateDraft("paperOrderStatus")}
                      badge="optional"
                    />
                    <CalculationField
                      field="supplier"
                      label="Papierlieferant"
                      value={draft.supplier}
                      onValueChange={updateDraft("supplier")}
                      badge="optional"
                    />
                    <CalculationField
                      field="priceStatus"
                      label="Preisstand"
                      value={draft.priceStatus}
                      onValueChange={updateDraft("priceStatus")}
                      badge="später"
                    />
                  </div>
                </CalculationSection>

                <CalculationSection eyebrow="07" title="Druck / Maschine">
                  <div
                    className="pp-calc-production-mode"
                    role="radiogroup"
                    aria-label="Produktionsart wählen"
                  >
                    {productionModes.map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        className={
                          mode.id === productionMode ? "is-active" : ""
                        }
                        onClick={() => {
                          setProductionMode(mode.id);
                          setDraftWasCreated(false);
                        }}
                        aria-pressed={mode.id === productionMode}
                      >
                        <b>{mode.label}</b>
                        <span>{mode.helper}</span>
                      </button>
                    ))}
                  </div>
                  <div className="pp-calc-production-detail">
                    <div className="pp-calc-input-grid pp-calc-input-grid--four">
                      <CalculationField
                      field="machine"
                        label="Maschine"
                        value={draft.machine}
                        onValueChange={updateDraft("machine")}
                        badge="Pflicht"
                      />
                      <CalculationField
                      field="printType"
                        label="Druckart"
                        value={draft.printType}
                        onValueChange={updateDraft("printType")}
                        badge="Pflicht"
                      />
                      <CalculationField
                      field="turning"
                        label="Wendung"
                        value={draft.turning}
                        onValueChange={updateDraft("turning")}
                        badge="optional"
                      />
                      <CalculationField
                        label="Berechneter Nutzenplan"
                        value={impositionCalculatorResult.label}
                        badge="Pflicht"
                      />
                      <CalculationField
                      field="setupTime"
                        label="Rüstzeit"
                        value={draft.setupTime}
                        onValueChange={updateDraft("setupTime")}
                        badge="später"
                      />
                      <CalculationField
                      field="runTime"
                        label="Laufzeit"
                        value={draft.runTime}
                        onValueChange={updateDraft("runTime")}
                        badge="später"
                      />
                      <CalculationField
                      field="clickCosts"
                        label="Klickkosten"
                        value={draft.clickCosts}
                        onValueChange={updateDraft("clickCosts")}
                        badge="später"
                      />
                      <CalculationField
                      field="wasteMode"
                        label="Maschinenmakulatur"
                        value={draft.wasteMode}
                        onValueChange={updateDraft("wasteMode")}
                        badge="optional"
                      />
                      <CalculationField
                      field="counterMode"
                        label="Zähler / Klicks"
                        value={draft.counterMode}
                        onValueChange={updateDraft("counterMode")}
                        badge="später"
                      />
                      <CalculationField
                      field="productionHint"
                        label="Produktionshinweis"
                        value={draft.productionHint}
                        onValueChange={updateDraft("productionHint")}
                        badge="optional"
                        wide
                      />
                    </div>
                  </div>
                </CalculationSection>
              </>
            ) : null}

            {activeTab === "imposition" ? (
              <CalculationSection eyebrow="08" title="Nutzen & Ausschießen">
                <ImpositionCalculatorPanel
                  draft={draft}
                  payload={payload}
                  result={impositionCalculatorResult}
                  onDraftChange={updateDraft}
                />
              </CalculationSection>
            ) : null}

            {activeTab === "finishing" ? (
              <CalculationSection eyebrow="09" title="Weiterverarbeitung">
                <div
                  className="pp-calc-finishing-matrix"
                  aria-label="Weiterverarbeitungs-Matrix"
                >
                  <table className="pp-calc-finishing-table">
                    <colgroup>
                      <col className="pp-calc-finishing-table__col-active" />
                      <col className="pp-calc-finishing-table__col-service" />
                      <col className="pp-calc-finishing-table__col-param" />
                      <col className="pp-calc-finishing-table__col-amount" />
                      <col className="pp-calc-finishing-table__col-production" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Aktiv</th>
                        <th>Leistung</th>
                        <th>Art / Parameter</th>
                        <th>Menge / Anzahl</th>
                        <th>Produktion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {finishingRows.map((row) => (
                        <FinishingMatrixRow
                          key={row.id}
                          row={row}
                          onToggle={(active) =>
                            updateFinishingRow(row.id, { active })
                          }
                          onChange={(updates) =>
                            updateFinishingRow(row.id, updates)
                          }
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="pp-calc-input-grid pp-calc-input-grid--four pp-calc-finishing-transfer">
                  <CalculationField
                      field="workInstruction"
                    label="Arbeitsanweisung"
                    value={draft.workInstruction}
                    onValueChange={updateDraft("workInstruction")}
                    badge="optional"
                    wide
                  />
                  <CalculationField
                      field="pocketExtraNote"
                    label="Zusatz / Verpackungshinweis"
                    value={draft.pocketExtraNote}
                    onValueChange={updateDraft("pocketExtraNote")}
                    badge="optional"
                    wide
                  />
                </div>
              </CalculationSection>
            ) : null}

            {activeTab === "external" ? (
              <CalculationSection
                eyebrow="09"
                title="Fremdproduktion / Kombination"
              >
                <div className="pp-calc-input-grid pp-calc-input-grid--four">
                  <CalculationField
                      field="externalSupplier"
                    label="Fremdlieferant"
                    value={draft.externalSupplier}
                    onValueChange={updateDraft("externalSupplier")}
                    badge="Pflicht"
                  />
                  <CalculationField
                      field="externalPrice"
                    label="Einkaufspreis"
                    value={draft.externalPrice}
                    onValueChange={updateDraft("externalPrice")}
                    badge="Pflicht"
                  />
                  <CalculationField
                      field="externalLeadTime"
                    label="Lieferzeit"
                    value={draft.externalLeadTime}
                    onValueChange={updateDraft("externalLeadTime")}
                    badge="Pflicht"
                  />
                  <CalculationField
                      field="margin"
                    label="Fremdleistungs-Aufschlag"
                    value={draft.margin}
                    onValueChange={updateDraft("margin")}
                    badge="optional"
                  />
                  <CalculationField
                      field="externalQuote"
                    label="Angebotsnummer"
                    value={draft.externalQuote}
                    onValueChange={updateDraft("externalQuote")}
                    badge="optional"
                  />
                  <CalculationField
                      field="externalFreight"
                    label="Fracht / Versand"
                    value={draft.externalFreight}
                    onValueChange={updateDraft("externalFreight")}
                    badge="optional"
                  />
                  <CalculationField
                      field="handlingTime"
                    label="Handling-Aufwand"
                    value={draft.handlingTime}
                    onValueChange={updateDraft("handlingTime")}
                    badge="optional"
                  />
                  <CalculationField
                      field="internalCheck"
                    label="Interne Prüfung"
                    value={draft.internalCheck}
                    onValueChange={updateDraft("internalCheck")}
                    badge="optional"
                  />
                  <CalculationField
                      field="combinationPrint"
                    label="Druck"
                    value={draft.combinationPrint}
                    onValueChange={updateDraft("combinationPrint")}
                    badge="optional"
                  />
                  <CalculationField
                      field="combinationFinishing"
                    label="Veredelung"
                    value={draft.combinationFinishing}
                    onValueChange={updateDraft("combinationFinishing")}
                    badge="optional"
                  />
                  <CalculationField
                      field="combinationPostpress"
                    label="Weiterverarbeitungs-Anteil intern / extern"
                    value={draft.combinationPostpress}
                    onValueChange={updateDraft("combinationPostpress")}
                    badge="optional"
                  />
                  <CalculationField
                      field="combinationExternal"
                    label="Fremdleistungs-Anteil"
                    value={draft.combinationExternal}
                    onValueChange={updateDraft("combinationExternal")}
                    badge="optional"
                  />
                </div>
              </CalculationSection>
            ) : null}

            {activeTab === "prices" ? (
              <>
                <CalculationSection
                  eyebrow="10"
                  title="Preise / Ergebnisvorgaben"
                >
                  <div className="pp-calc-input-grid pp-calc-input-grid--four">
                    <CalculationField
                      field="offerId"
                      label="Angebotsnummer"
                      value={draft.offerId}
                      onValueChange={updateDraft("offerId")}
                      badge="optional"
                    />
                    <CalculationField
                      field="offerDate"
                      label="Angebotsdatum"
                      value={draft.offerDate}
                      onValueChange={updateDraft("offerDate")}
                      badge="optional"
                    />
                    <CalculationField
                      field="offerStatus"
                      label="Angebotsstatus"
                      value={draft.offerStatus}
                      onValueChange={updateDraft("offerStatus")}
                      badge="optional"
                    />
                    <CalculationField
                      field="offerValidUntil"
                      label="Angebotsgültigkeit"
                      value={draft.offerValidUntil}
                      onValueChange={updateDraft("offerValidUntil")}
                      badge="optional"
                    />
                    <CalculationField
                      field="paymentTerms"
                      label="Zahlungsbedingungen"
                      value={draft.paymentTerms}
                      onValueChange={updateDraft("paymentTerms")}
                      badge="optional"
                      wide
                    />
                    <CalculationField
                      field="senderCompany"
                      label="Eigene Firma"
                      value={draft.senderCompany}
                      onValueChange={updateDraft("senderCompany")}
                      badge="später"
                    />
                    <CalculationField
                      field="senderAddress"
                      label="Eigene Adresse"
                      value={draft.senderAddress}
                      onValueChange={updateDraft("senderAddress")}
                      badge="später"
                      wide
                    />
                    <CalculationField
                      label="Eigene Kontaktdaten"
                      value={`${draft.senderPhone} · ${draft.senderEmail}`}
                      onValueChange={(value) => {
                        const [phone = "", email = ""] = value.split("·").map((part) => part.trim());
                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          senderPhone: phone,
                          senderEmail: email || currentDraft.senderEmail,
                        }));
                        setDraftWasCreated(false);
                        setOfferWasPrepared(false);
                      }}
                      badge="später"
                    />
                    <CalculationField
                      field="senderWebsite"
                      label="Eigene Website"
                      value={draft.senderWebsite}
                      onValueChange={updateDraft("senderWebsite")}
                      badge="später"
                    />
                    <CalculationField
                      field="documentLogoLabel"
                      label="Logo-Platzhalter"
                      value={draft.documentLogoLabel}
                      onValueChange={updateDraft("documentLogoLabel")}
                      badge="später"
                    />
                    <CalculationField
                      field="documentLogoHint"
                      label="Logo-Hinweis"
                      value={draft.documentLogoHint}
                      onValueChange={updateDraft("documentLogoHint")}
                      badge="später"
                    />
                    <CalculationField
                      field="senderVatId"
                      label="Umsatzsteuer-ID"
                      value={draft.senderVatId}
                      onValueChange={updateDraft("senderVatId")}
                      badge="später"
                    />
                    <CalculationField
                      field="senderTaxNumber"
                      label="Steuernummer"
                      value={draft.senderTaxNumber}
                      onValueChange={updateDraft("senderTaxNumber")}
                      badge="später"
                    />
                    <CalculationField
                      field="senderBankName"
                      label="Bank"
                      value={draft.senderBankName}
                      onValueChange={updateDraft("senderBankName")}
                      badge="später"
                    />
                    <CalculationField
                      field="senderIban"
                      label="IBAN"
                      value={draft.senderIban}
                      onValueChange={updateDraft("senderIban")}
                      badge="später"
                    />
                    <CalculationField
                      field="senderBic"
                      label="BIC"
                      value={draft.senderBic}
                      onValueChange={updateDraft("senderBic")}
                      badge="später"
                    />
                    <CalculationField
                      field="documentFooterNote"
                      label="Dokumentenfuß"
                      value={draft.documentFooterNote}
                      onValueChange={updateDraft("documentFooterNote")}
                      badge="später"
                      wide
                    />
                    <CalculationField
                      field="materialCosts"
                      label="Materialkosten"
                      value={draft.materialCosts}
                      onValueChange={updateDraft("materialCosts")}
                      badge="später"
                    />
                    <CalculationField
                      field="printCosts"
                      label="Druckkosten"
                      value={draft.printCosts}
                      onValueChange={updateDraft("printCosts")}
                      badge="später"
                    />
                    <CalculationField
                      field="finishingCosts"
                      label="Weiterverarbeitungskosten"
                      value={draft.finishingCosts}
                      onValueChange={updateDraft("finishingCosts")}
                      badge="später"
                    />
                    <CalculationField
                      field="externalCosts"
                      label="Fremdkosten"
                      value={draft.externalCosts}
                      onValueChange={updateDraft("externalCosts")}
                      badge="optional"
                    />
                    <CalculationField
                      field="handlingTime"
                      label="Handling"
                      value={draft.handlingTime}
                      onValueChange={updateDraft("handlingTime")}
                      badge="optional"
                    />
                    <CalculationField
                      field="shippingCosts"
                      label="Versand"
                      value={draft.shippingCosts}
                      onValueChange={updateDraft("shippingCosts")}
                      badge="optional"
                    />
                    <CalculationField
                      field="packagingCosts"
                      label="Verpackung"
                      value={draft.packagingCosts}
                      onValueChange={updateDraft("packagingCosts")}
                      badge="optional"
                    />
                    <CalculationField
                      field="overheadRate"
                      label="Gemeinkosten"
                      value={draft.overheadRate}
                      onValueChange={updateDraft("overheadRate")}
                      badge="später"
                    />
                    <CalculationField
                      field="minPrice"
                      label="Mindestpreis"
                      value={draft.minPrice}
                      onValueChange={updateDraft("minPrice")}
                      badge="optional"
                    />
                    <CalculationField
                      field="discount"
                      label="Rabatt"
                      value={draft.discount}
                      onValueChange={updateDraft("discount")}
                      badge="optional"
                    />
                    <CalculationField
                      field="contributionMargin"
                      label="Deckungsbeitrag"
                      value={draft.contributionMargin}
                      onValueChange={updateDraft("contributionMargin")}
                      badge="später"
                    />
                    <CalculationField
                      field="margin"
                      label="Gesamtmarge / Deckungsbeitrag"
                      value={draft.margin}
                      onValueChange={updateDraft("margin")}
                      badge="optional"
                    />
                    <CalculationField
                      field="salePriceNet"
                      label="Verkaufspreis netto"
                      value={draft.salePriceNet}
                      onValueChange={updateDraft("salePriceNet")}
                      badge="später"
                    />
                    <CalculationField
                      field="billingMode"
                      label="Abrechnung"
                      value={draft.billingMode}
                      onValueChange={updateDraft("billingMode")}
                      badge="optional"
                      wide
                    />
                    <CalculationField
                      field="settlementNote"
                      label="Mengenabrechnung"
                      value={draft.settlementNote}
                      onValueChange={updateDraft("settlementNote")}
                      badge="optional"
                    />
                    <CalculationField
                      field="commission"
                      label="Provision"
                      value={draft.commission}
                      onValueChange={updateDraft("commission")}
                      badge="optional"
                    />
                    <CalculationField
                      field="invoiceControl"
                      label="Rechnungskontrolle"
                      value={draft.invoiceControl}
                      onValueChange={updateDraft("invoiceControl")}
                      badge="optional"
                      wide
                    />
                    <CalculationField
                      field="controlPrintData"
                      label="Kontrolle Druckdaten"
                      value={draft.controlPrintData}
                      onValueChange={updateDraft("controlPrintData")}
                      badge="optional"
                    />
                    <CalculationField
                      field="controlColorAccuracy"
                      label="Kontrolle Farbe / Maß"
                      value={draft.controlColorAccuracy}
                      onValueChange={updateDraft("controlColorAccuracy")}
                      badge="optional"
                    />
                    <CalculationField
                      field="controlFinishing"
                      label="Kontrolle Weiterverarbeitung"
                      value={draft.controlFinishing}
                      onValueChange={updateDraft("controlFinishing")}
                      badge="optional"
                    />
                    <CalculationField
                      field="controlQuantity"
                      label="Kontrolle Menge"
                      value={draft.controlQuantity}
                      onValueChange={updateDraft("controlQuantity")}
                      badge="optional"
                    />
                    <CalculationField
                      field="pocketSampleStatus"
                      label="Muster in Tasche"
                      value={draft.pocketSampleStatus}
                      onValueChange={updateDraft("pocketSampleStatus")}
                      badge="optional"
                    />
                    <CalculationField
                      field="paperInvoiceStatus"
                      label="Papierrechnung"
                      value={draft.paperInvoiceStatus}
                      onValueChange={updateDraft("paperInvoiceStatus")}
                      badge="optional"
                    />
                    <CalculationField
                      field="supplierInvoiceStatus"
                      label="Lieferantenrechnung"
                      value={draft.supplierInvoiceStatus}
                      onValueChange={updateDraft("supplierInvoiceStatus")}
                      badge="optional"
                    />
                  </div>
                </CalculationSection>
                <div hidden>
                  <CalculationPlausibilityOverview
                    draft={draft}
                    activeFinishingCount={activeFinishingCount}
                    productionMode={productionMode}
                  />
                  <CalculationFieldAudit />
                  <CalculationTransferMapping groups={transferGroups} />
                </div>
                <div className="pp-calculation-offer-workflow" aria-label="Angebot erzeugen">
                  <div className="pp-calculation-offer-workflow__head">
                    <span>Angebot</span>
                    <b>{offerWasPrepared ? "Angebot vorbereitet" : "PDF für Druck und E-Mail vorbereiten"}</b>
                    <small>
                      Das Angebot enthält nur kundenrelevante Leistungs- und Preisdaten.
                      Interne Kalkulationswerte bleiben verborgen.
                    </small>
                  </div>
                  {offerDateWarning ? (
                    <div className="pp-calculation-offer-warning" role="status">
                      <b>Liefertermin prüfen</b>
                      <span>Der Liefertermin liegt vor dem Angebotsdatum. Bitte Datum korrigieren oder bewusst als Alt-/Demo-Datensatz stehen lassen.</span>
                    </div>
                  ) : null}
                  <div className="pp-calculation-offer-workflow__actions">
                    <button
                      type="button"
                      className="pp-calculation-create-button"
                      onClick={handlePrepareOffer}
                    >
                      Angebot anzeigen
                    </button>
                    <button
                      type="button"
                      className="pp-calculation-create-button"
                      onClick={handlePrintOffer}
                    >
                      Angebot als PDF drucken
                    </button>
                    <button
                      type="button"
                      className="pp-calculation-create-button pp-calculation-create-button--secondary"
                      onClick={handlePrepareOfferEmail}
                    >
                      E-Mail vorbereiten
                    </button>
                  </div>
                  {offerPreviewOpen ? (
                    <CalculationOfferDocument
                      draft={draft}
                      payload={payload}
                      finishingRows={finishingRows}
                      productionModeLabel={productionModeLabel}
                      sheetCount={sheetCount}
                    />
                  ) : null}
                </div>
              </>
            ) : null}
          </div>

          <div
            className="pp-calculation-statusbar"
            aria-label="Kalkulationsstatus und Aktionen"
            hidden
          >
            <div>
              <span>Kalkulierbar</span>
              <b
                className={`pp-readiness pp-readiness--${getReadinessState(calculationOpenFields)}`}
              >
                {getReadinessLabel(calculationOpenFields)}
              </b>
            </div>
            <div>
              <span>Angebotsfähig</span>
              <b
                className={`pp-readiness pp-readiness--${getReadinessState(offerOpenFields)}`}
              >
                {getReadinessLabel(offerOpenFields)}
              </b>
            </div>
            <div>
              <span>Auftragsfähig</span>
              <b
                className={`pp-readiness pp-readiness--${getReadinessState(orderOpenFields)}`}
              >
                {orderOpenFields > 0
                  ? `${orderOpenFields} offen · Bereich ${activeTabOpenRequiredFields}`
                  : "bereit"}
              </b>
            </div>
            <div>
              <span>Nutzen / Bogen</span>
              <b>
                {result.layout.usedSlots} Nutzen · {sheetCount} Bogen
              </b>
            </div>
            <button
              className="pp-calculation-create-button pp-calculation-create-button--bar"
              type="button"
              onClick={handleCreateOrderDraft}
            >
              Auftragsentwurf erzeugen
            </button>
          </div>
        </div>

        <div className="pp-offer-print-source" ref={offerPrintRef} aria-hidden="true">
          <CalculationOfferDocument
            draft={draft}
            payload={payload}
            finishingRows={finishingRows}
            productionModeLabel={productionModeLabel}
            sheetCount={sheetCount}
          />
        </div>

        <aside
          className="pp-calculation-result-panel pp-calculation-result-panel--compact"
          aria-label="Kalkulation Ergebnis"
        >
          <div className="pp-calculation-result-panel__head">
            <p className="pp-eyebrow">Ergebnis</p>
            <h2>Produktionskern</h2>
            <span>Produktionsdaten, Nutzenplan und Preisabschluss.</span>
          </div>

          <CalculationSheetPreview payload={payload} />

          <div className="pp-calculation-output-card">
            <h3>Produktionsdaten</h3>
            <div className="pp-calc-result-list">
              <ResultLine
                label="Produktionsweg"
                value={productionModeLabel}
              />
              <ResultLine label="Produkt" value={payload.product.label} />
              <ResultLine label="Druckdatei" value={draft.printFileName} />
              <ResultLine label="Freigabe" value={draft.approvalStatus} />
              <ResultLine
                label="Nutzen"
                value={`${result.layout.usedSlots} von ${result.layout.totalSlots}`}
              />
              <ResultLine
                label="Bogenanzahl"
                value={
                  result.production.sheetsRequired
                    ? `${formatNumber(result.production.sheetsRequired)} Bogen`
                    : "offen"
                }
              />
            </div>
            <div className="pp-calculation-hints">
              {(result.finishingHints ?? []).map((hint) => (
                <span key={hint}>{hint}</span>
              ))}
            </div>
          </div>

          <div className="pp-calculation-output-card pp-calculation-output-card--price">
            <h3>Preisabschluss</h3>
            <div className="pp-calc-result-list">
              <ResultLine label="Material" value={draft.materialCosts} />
              <ResultLine label="Druck" value={draft.printCosts} />
              <ResultLine label="Weiterverarbeitungskosten" value={draft.finishingCosts} />
              <ResultLine label="Fremdkosten" value={draft.externalCosts} />
              <ResultLine label="Verkauf netto" value={draft.salePriceNet} />
            </div>
          </div>

          <div className="pp-calculation-output-card pp-calculation-output-card--pocket" hidden>
            <h3>Übergabe an Auftragstasche</h3>
            <div className="pp-calc-result-list">
              {orderPocketPreviewRows.map(([label, value]) => (
                <ResultLine key={label} label={label} value={value} />
              ))}
            </div>
          </div>

          <div hidden>
            <CalculationTransferMapping groups={transferGroups} compact />
          </div>

          <div className="pp-calculation-action-stack">
            <button
              className="pp-calculation-create-button"
              type="button"
              onClick={handlePrepareOffer}
            >
              Angebot anzeigen
            </button>
            <button
              className="pp-calculation-create-button pp-calculation-create-button--secondary"
              type="button"
              onClick={handlePrintOffer}
            >
              Angebot als PDF drucken
            </button>
            <button
              className="pp-calculation-create-button"
              type="button"
              onClick={handleCreateOrderDraft}
            >
              Auftragsentwurf erzeugen
            </button>
          </div>

          {draftWasCreated ? (
            <div className="pp-calculation-create-note is-active">
              <strong>Auftragsentwurf erzeugt</strong>
              <p>
                Die produktionsrelevanten Kalkulationswerte wurden in einen
                lokalen Auftragsentwurf übernommen.
              </p>
            </div>
          ) : null}
        </aside>
        </section>
      </CalculationFieldValidationContext.Provider>
      {softwareDialog ? (
        <CalculationSoftwareDialog
          dialog={softwareDialog}
          onClose={() => setSoftwareDialog(null)}
        />
      ) : null}
    </div>
  );
}
