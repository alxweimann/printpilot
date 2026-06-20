import { useMemo, useState } from "react";
import { PrintPilotLogo } from "../../components/brand/PrintPilotLogo";
import {
  createOrderDraftFromCalculation,
  demoCalculationPayload,
  getFallbackOrder,
} from "../orders/order-data";
import type {
  CalculationToProductionPayload,
  PrintPilotOrder,
  ProductKind,
} from "../orders/order-data";

type CalculationPageProps = {
  onCreateOrderDraft: (order: PrintPilotOrder) => void;
};

type ProductionMode = "internal" | "external" | "combined";
type FieldBadge = "Pflicht" | "optional" | "später";
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
  dueDate: string;
  correctionDeadline: string;
  owner: string;
  customerReference: string;
  customerOrderNumber: string;
  orderType: string;
  dataStatus: string;
  overdeliveryRule: string;
  partialDeliveries: string;
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
  setupTime: string;
  runTime: string;
  clickCosts: string;
  wasteMode: string;
  counterMode: string;
  productionHint: string;
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
  { id: "finishing", label: "Weiterverarbeitung", shortcut: "04" },
  { id: "external", label: "Fremdproduktion", shortcut: "05" },
  { id: "prices", label: "Preise & Ergebnis", shortcut: "06" },
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
      "overdeliveryRule",
      "partialDeliveries",
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
  "product-format": ["productKind", "productLabel", "pages", "finalFormat"],
  "paper-print": ["substrate", "machine", "printType"],
  finishing: [],
  external: ["externalSupplier", "externalPrice", "externalLeadTime"],
  prices: [],
};

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
    helper: "Maschine, Bogen, Nutzenrechner und interne Produktionszeiten",
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
  dueDate: "04.06.2026 · 11:00",
  correctionDeadline: "03.06.2026 · 12:00",
  owner: "Max M.",
  customerReference: "WM-VK-2026",
  customerOrderNumber: "Bestellung per Mail",
  orderType: "Neuauftrag",
  dataStatus: "Daten gestellt · Prüfung offen",
  overdeliveryRule: "keine Überlieferung",
  partialDeliveries: "keine Teillieferung",
  samples: "2 Belegexemplare",
  customerNote: "Lieferung an Standardadresse",
  internalNote: "Daten aus PDF-Preview prüfen",
  productKind: demoCalculationPayload.product.kind,
  productLabel: demoCalculationPayload.product.label,
  pages: demoCalculationPayload.product.pages,
  colorMode: "4/4-farbig · Skala",
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
  substrate: demoCalculationPayload.product.substrate ?? "Munken Lynx 300 g",
  grammage: "350 g/m²",
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
  setupTime: "12 min",
  runTime: "automatisch später",
  clickCosts: "Maschinenstamm",
  wasteMode: "Zuschuss aus Kalkulation",
  counterMode: "Klicks 4/4",
  productionHint: "Schön- und Widerdruck prüfen",
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
  salePriceNet: "automatisch später",
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

function buildPayloadFromDraft(
  draft: CalculationDraft,
  productionMode: ProductionMode,
  finishingRows: FinishingDraftRow[],
): CalculationToProductionPayload {
  const quantity = parseInteger(
    draft.quantity,
    demoCalculationPayload.product.quantity,
  );
  const usedSlots = demoCalculationPayload.imposition.layout.usedSlots;
  const sheetsRequired = Math.max(
    1,
    Math.ceil(quantity / Math.max(1, usedSlots)),
  );
  const netQuantity = sheetsRequired * usedSlots;
  const restQuantity = Math.max(0, netQuantity - quantity);
  const overs = parseInteger(draft.overs, restQuantity);
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
      item: {
        ...demoCalculationPayload.imposition.item,
        finalFormat: draft.finalFormat,
        widthMm: finalFormat.widthMm,
        heightMm: finalFormat.heightMm,
      },
      production: {
        orderedQuantity: quantity,
        sheetsRequired,
        overs,
        netQuantity,
        restQuantity,
      },
      finishingHints: activeFinishing.length
        ? activeFinishing
        : ["Weiterverarbeitung prüfen"],
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

function CalculationField({
  label,
  value,
  onValueChange,
  hint,
  badge,
  wide = false,
}: {
  label: string;
  value: string;
  onValueChange?: (value: string) => void;
  hint?: string;
  badge?: FieldBadge;
  wide?: boolean;
}) {
  return (
    <label
      className={
        wide
          ? "pp-calc-input-field pp-calc-input-field--wide"
          : "pp-calc-input-field"
      }
    >
      <span>
        <strong>{label}</strong>
        {badge ? (
          <em
            className={`pp-field-badge pp-field-badge--${badge.toLowerCase()}`}
          >
            {badge}
          </em>
        ) : null}
      </span>
      <input
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
        readOnly={!onValueChange}
      />
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function CalculationSelect({
  label,
  value,
  options,
  onValueChange,
  hint,
  badge,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onValueChange?: (value: string) => void;
  hint?: string;
  badge?: FieldBadge;
}) {
  return (
    <label className="pp-calc-input-field">
      <span>
        <strong>{label}</strong>
        {badge ? (
          <em
            className={`pp-field-badge pp-field-badge--${badge.toLowerCase()}`}
          >
            {badge}
          </em>
        ) : null}
      </span>
      <select
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
        disabled={!onValueChange}
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
      aria-label="Nutzenrechner Ergebnisvorschau"
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

function ResultLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="pp-calc-result-line">
      <span>{label}</span>
      <b>{value}</b>
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
        "Produkt, Format, Farben, Datenquelle und Auflage führen in einem Block zur Kalkulation",
        "Papier, Maschine, Druckart und Bogeninformationen stehen vor Weiterverarbeitung",
        "Fremdproduktion ist nur bei externem oder kombiniertem Produktionsweg blockierend",
        "Preise & Ergebnis bleibt Prüf- und Abschlussreiter ohne neue Preislogik",
      ],
    },
    {
      title: "Später bewusst nicht blockierend",
      items: [
        "Papierpreisimport, Preisstände und Lieferantenkataloge",
        "Maschinenzeiten, Klickkosten, Zählermodus und Zuschussautomatiken",
        "automatische Netto-/Restmengen und Sammelauftragslogik",
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
  const [draft, setDraft] = useState<CalculationDraft>(initialDraft);
  const [productionMode, setProductionMode] =
    useState<ProductionMode>("internal");
  const [finishingRows, setFinishingRows] =
    useState<FinishingDraftRow[]>(initialFinishingRows);
  const [activeTab, setActiveTab] =
    useState<CalculationTabId>("customer-order");

  const missingRequiredByTab = useMemo(() => {
    return calculationTabs.reduce<Record<CalculationTabId, number>>(
      (counts, tab) => {
        const requiredFields = getRequiredFieldsForTab(tab.id, productionMode);
        counts[tab.id] = requiredFields.filter((field) =>
          isDraftValueMissing(String(draft[field] ?? "")),
        ).length;

        return counts;
      },
      {
        "customer-order": 0,
        "product-format": 0,
        "paper-print": 0,
        finishing: 0,
        external: 0,
        prices: 0,
      },
    );
  }, [draft, finishingRows, productionMode]);

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

  const openRequiredFields = Object.values(missingRequiredByTab).reduce(
    (sum, count) => sum + count,
    0,
  );
  const activeTabOpenRequiredFields = missingRequiredByTab[activeTab];
  const canCreateOrderDraft = openRequiredFields === 0;
  const orderOpenFields = countMissingFields(draft, orderRequiredFields);
  const readinessSummary = [
    `Kalkulierbar ${getReadinessLabel(calculationOpenFields)}`,
    `Angebotsfähig ${getReadinessLabel(offerOpenFields)}`,
    `Auftragsfähig ${getReadinessLabel(orderOpenFields)}`,
  ];

  const payload = useMemo(
    () => buildPayloadFromDraft(draft, productionMode, finishingRows),
    [draft, finishingRows, productionMode],
  );
  const activeFinishingCount = finishingRows.filter((row) => row.active).length;
  const result = payload.imposition;

  const updateDraft = (field: keyof CalculationDraft) => (value: string) => {
    setDraft((currentDraft) => ({ ...currentDraft, [field]: value }));
    setDraftWasCreated(false);
  };

  const updateFinishingRow = (
    id: string,
    updates: Partial<FinishingDraftRow>,
  ) => {
    setFinishingRows((currentRows) =>
      currentRows.map((row) => (row.id === id ? { ...row, ...updates } : row)),
    );
    setDraftWasCreated(false);
  };

  const handleCreateOrderDraft = () => {
    if (!canCreateOrderDraft) {
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
          <p>MIS-Maske · 6 Arbeitsbereiche · geführter Bedienfluss</p>
        </div>
        <div
          className="pp-header-job pp-header-job--overview"
          aria-label="Kalkulationsnummer"
        >
          <span>Demo-Kalkulation</span>
          <strong>{payload.calculationId ?? "CALC"}</strong>
        </div>
      </header>

      <section className="pp-calculation-layout pp-calculation-layout--tabs">
        <div
          className="pp-calculation-form"
          aria-label="Kalkulation Reitermaske"
        >
          <div className="pp-calculation-form__intro pp-calculation-tabs-intro">
            <div>
              <p className="pp-eyebrow">Arbeitsmaske</p>
              <h2>Produktive Reitermaske</h2>
            </div>
            <div
              className="pp-calculation-form__meta"
              aria-label="Kalkulationsstatus"
            >
              <span>{payload.calculationId ?? "CALC"}</span>
              <b>{draft.customer}</b>
              <small>{formatNumber(payload.product.quantity)} Stück</small>
            </div>
          </div>

          <div
            className="pp-calculation-quick-head"
            aria-label="Kalkulationskopf"
          >
            <div>
              <span>Kunde</span>
              <b>{draft.customer}</b>
            </div>
            <div>
              <span>Produkt</span>
              <b>{payload.product.label}</b>
            </div>
            <div>
              <span>Auflage</span>
              <b>{formatNumber(payload.product.quantity)} Stück</b>
            </div>
            <div>
              <span>Format</span>
              <b>{draft.finalFormat}</b>
            </div>
            <div>
              <span>Produktion</span>
              <b>
                {productionModes.find((mode) => mode.id === productionMode)
                  ?.label ?? "Eigenproduktion"}
              </b>
            </div>
            <div>
              <span>Status</span>
              <b>{readinessSummary.join(" · ")}</b>
            </div>
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
                  <small>
                    {missingCount > 0
                      ? `${missingCount} offen`
                      : isExternalMuted
                        ? "nicht aktiv"
                        : "ok"}
                  </small>
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
                      label="Kunde"
                      value={draft.customer}
                      onValueChange={updateDraft("customer")}
                      badge="Pflicht"
                    />
                    <CalculationField
                      label="Ansprechpartner"
                      value={draft.contactName}
                      onValueChange={updateDraft("contactName")}
                      badge="Pflicht"
                    />
                    <CalculationField
                      label="Telefon"
                      value={draft.contactPhone}
                      onValueChange={updateDraft("contactPhone")}
                      badge="optional"
                    />
                    <CalculationField
                      label="E-Mail"
                      value={draft.contactEmail}
                      onValueChange={updateDraft("contactEmail")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Bearbeiter"
                      value={draft.owner}
                      onValueChange={updateDraft("owner")}
                      badge="Pflicht"
                    />
                    <CalculationField
                      label="Rechnung an"
                      value={draft.billingAddress}
                      onValueChange={updateDraft("billingAddress")}
                      badge="optional"
                      wide
                    />
                    <CalculationField
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
                      label="Projekt / Jobname"
                      value={draft.projectName}
                      onValueChange={updateDraft("projectName")}
                      badge="Pflicht"
                      wide
                    />
                    <CalculationField
                      label="Kalkulationsnummer"
                      value={draft.calculationId}
                      onValueChange={updateDraft("calculationId")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Auftragsart"
                      value={draft.orderType}
                      onValueChange={updateDraft("orderType")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Liefertermin"
                      value={draft.dueDate}
                      onValueChange={updateDraft("dueDate")}
                      badge="Pflicht"
                    />
                    <CalculationField
                      label="Korrektur bis"
                      value={draft.correctionDeadline}
                      onValueChange={updateDraft("correctionDeadline")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Datenstatus"
                      value={draft.dataStatus}
                      onValueChange={updateDraft("dataStatus")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Kundenreferenz"
                      value={draft.customerReference}
                      onValueChange={updateDraft("customerReference")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Bestellnummer"
                      value={draft.customerOrderNumber}
                      onValueChange={updateDraft("customerOrderNumber")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Kundenhinweis"
                      value={draft.customerNote}
                      onValueChange={updateDraft("customerNote")}
                      badge="optional"
                      wide
                    />
                    <CalculationField
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
                      label="Hauptauflage"
                      value={draft.quantity}
                      onValueChange={updateDraft("quantity")}
                      badge="Pflicht"
                    />
                    <CalculationField
                      label="Zuschuss"
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
                      label="Überlieferung"
                      value={draft.overdeliveryRule}
                      onValueChange={updateDraft("overdeliveryRule")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Teillieferungen"
                      value={draft.partialDeliveries}
                      onValueChange={updateDraft("partialDeliveries")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Muster / Belege"
                      value={draft.samples}
                      onValueChange={updateDraft("samples")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Varianten"
                      value={draft.variants}
                      onValueChange={updateDraft("variants")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Staffel 1"
                      value={draft.tier1}
                      onValueChange={updateDraft("tier1")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Staffel 2"
                      value={draft.tier2}
                      onValueChange={updateDraft("tier2")}
                      badge="optional"
                    />
                    <CalculationField
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
                      label="Produktart"
                      value={draft.productKind}
                      options={productKindOptions}
                      onValueChange={(value) =>
                        updateDraft("productKind")(value as ProductKind)
                      }
                      badge="Pflicht"
                    />
                    <CalculationField
                      label="Bezeichnung"
                      value={draft.productLabel}
                      onValueChange={updateDraft("productLabel")}
                      wide
                      badge="Pflicht"
                    />
                    <CalculationField
                      label="Seiten / Umfang"
                      value={draft.pages}
                      onValueChange={updateDraft("pages")}
                      badge="Pflicht"
                    />
                    <CalculationField
                      label="Farbigkeit"
                      value={draft.colorMode}
                      onValueChange={updateDraft("colorMode")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Farben Vorderseite"
                      value={draft.frontColors}
                      onValueChange={updateDraft("frontColors")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Farben Rückseite"
                      value={draft.backColors}
                      onValueChange={updateDraft("backColors")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Sonderfarben"
                      value={draft.spotColors}
                      onValueChange={updateDraft("spotColors")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Motive / Sorten"
                      value={draft.versions}
                      onValueChange={updateDraft("versions")}
                      badge="optional"
                    />
                    <CalculationField
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
                      label="Endformat"
                      value={draft.finalFormat}
                      onValueChange={updateDraft("finalFormat")}
                      badge="Pflicht"
                    />
                    <CalculationField
                      label="Offenes Format"
                      value={draft.openFormat}
                      onValueChange={updateDraft("openFormat")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Ausrichtung"
                      value={draft.orientation}
                      onValueChange={updateDraft("orientation")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Beschnitt"
                      value={draft.bleedMm}
                      onValueChange={updateDraft("bleedMm")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Sicherheitsabstand"
                      value={draft.safetyMarginMm}
                      onValueChange={updateDraft("safetyMarginMm")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Nutzenformat"
                      value={draft.productionFormat}
                      onValueChange={updateDraft("productionFormat")}
                      badge="später"
                    />
                    <CalculationField
                      label="Sonderform / Stanze"
                      value={draft.specialShape}
                      onValueChange={updateDraft("specialShape")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Datenquelle"
                      value={draft.dataSource}
                      onValueChange={updateDraft("dataSource")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Datenprüfung"
                      value={draft.preflight}
                      onValueChange={updateDraft("preflight")}
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
                      label="Materialgruppe"
                      value={draft.materialGroup}
                      onValueChange={updateDraft("materialGroup")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Artikel"
                      value={draft.substrate}
                      onValueChange={updateDraft("substrate")}
                      badge="Pflicht"
                      wide
                    />
                    <CalculationField
                      label="Grammatur"
                      value={draft.grammage}
                      onValueChange={updateDraft("grammage")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Bogenformat"
                      value={draft.sheetFormat}
                      onValueChange={updateDraft("sheetFormat")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Laufrichtung"
                      value={draft.grainDirection}
                      onValueChange={updateDraft("grainDirection")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Rohbogenformat"
                      value={draft.rawSheetFormat}
                      onValueChange={updateDraft("rawSheetFormat")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Druckbogenformat"
                      value={draft.printSheetFormat}
                      onValueChange={updateDraft("printSheetFormat")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Papier-Nutzen"
                      value={draft.paperUsage}
                      onValueChange={updateDraft("paperUsage")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Nettobogen"
                      value={draft.netSheets}
                      onValueChange={updateDraft("netSheets")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Zuschussbogen"
                      value={draft.wasteSheets}
                      onValueChange={updateDraft("wasteSheets")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Bruttobogen"
                      value={draft.grossSheets}
                      onValueChange={updateDraft("grossSheets")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Lagerstatus"
                      value={draft.stockStatus}
                      onValueChange={updateDraft("stockStatus")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Papierquelle"
                      value={draft.paperSource}
                      onValueChange={updateDraft("paperSource")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Papierbestellung"
                      value={draft.paperOrderStatus}
                      onValueChange={updateDraft("paperOrderStatus")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Lieferant"
                      value={draft.supplier}
                      onValueChange={updateDraft("supplier")}
                      badge="optional"
                    />
                    <CalculationField
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
                        label="Maschine"
                        value={draft.machine}
                        onValueChange={updateDraft("machine")}
                        badge="Pflicht"
                      />
                      <CalculationField
                        label="Druckart"
                        value={draft.printType}
                        onValueChange={updateDraft("printType")}
                        badge="Pflicht"
                      />
                      <CalculationField
                        label="Wendung"
                        value={draft.turning}
                        onValueChange={updateDraft("turning")}
                        badge="optional"
                      />
                      <CalculationField
                        label="Nutzenrechner"
                        value={draft.impositionLabel}
                        onValueChange={updateDraft("impositionLabel")}
                        badge="später"
                      />
                      <CalculationField
                        label="Rüstzeit"
                        value={draft.setupTime}
                        onValueChange={updateDraft("setupTime")}
                        badge="später"
                      />
                      <CalculationField
                        label="Laufzeit"
                        value={draft.runTime}
                        onValueChange={updateDraft("runTime")}
                        badge="später"
                      />
                      <CalculationField
                        label="Klickkosten"
                        value={draft.clickCosts}
                        onValueChange={updateDraft("clickCosts")}
                        badge="später"
                      />
                      <CalculationField
                        label="Makulatur"
                        value={draft.wasteMode}
                        onValueChange={updateDraft("wasteMode")}
                        badge="optional"
                      />
                      <CalculationField
                        label="Zähler / Klicks"
                        value={draft.counterMode}
                        onValueChange={updateDraft("counterMode")}
                        badge="später"
                      />
                      <CalculationField
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

            {activeTab === "finishing" ? (
              <CalculationSection eyebrow="08" title="Weiterverarbeitung">
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
              </CalculationSection>
            ) : null}

            {activeTab === "external" ? (
              <CalculationSection
                eyebrow="09"
                title="Fremdproduktion / Kombination"
              >
                <div className="pp-calc-input-grid pp-calc-input-grid--four">
                  <CalculationField
                    label="Lieferant"
                    value={draft.externalSupplier}
                    onValueChange={updateDraft("externalSupplier")}
                    badge="Pflicht"
                  />
                  <CalculationField
                    label="Einkaufspreis"
                    value={draft.externalPrice}
                    onValueChange={updateDraft("externalPrice")}
                    badge="Pflicht"
                  />
                  <CalculationField
                    label="Lieferzeit"
                    value={draft.externalLeadTime}
                    onValueChange={updateDraft("externalLeadTime")}
                    badge="Pflicht"
                  />
                  <CalculationField
                    label="Marge / Aufschlag"
                    value={draft.margin}
                    onValueChange={updateDraft("margin")}
                    badge="optional"
                  />
                  <CalculationField
                    label="Angebotsnummer"
                    value={draft.externalQuote}
                    onValueChange={updateDraft("externalQuote")}
                    badge="optional"
                  />
                  <CalculationField
                    label="Fracht / Versand"
                    value={draft.externalFreight}
                    onValueChange={updateDraft("externalFreight")}
                    badge="optional"
                  />
                  <CalculationField
                    label="Handling-Aufwand"
                    value={draft.handlingTime}
                    onValueChange={updateDraft("handlingTime")}
                    badge="optional"
                  />
                  <CalculationField
                    label="Interne Prüfung"
                    value={draft.internalCheck}
                    onValueChange={updateDraft("internalCheck")}
                    badge="optional"
                  />
                  <CalculationField
                    label="Druck"
                    value={draft.combinationPrint}
                    onValueChange={updateDraft("combinationPrint")}
                    badge="optional"
                  />
                  <CalculationField
                    label="Veredelung"
                    value={draft.combinationFinishing}
                    onValueChange={updateDraft("combinationFinishing")}
                    badge="optional"
                  />
                  <CalculationField
                    label="Weiterverarbeitung"
                    value={draft.combinationPostpress}
                    onValueChange={updateDraft("combinationPostpress")}
                    badge="optional"
                  />
                  <CalculationField
                    label="Fremdleistung"
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
                      label="Materialkosten"
                      value={draft.materialCosts}
                      onValueChange={updateDraft("materialCosts")}
                      badge="später"
                    />
                    <CalculationField
                      label="Druckkosten"
                      value={draft.printCosts}
                      onValueChange={updateDraft("printCosts")}
                      badge="später"
                    />
                    <CalculationField
                      label="Weiterverarbeitung"
                      value={draft.finishingCosts}
                      onValueChange={updateDraft("finishingCosts")}
                      badge="später"
                    />
                    <CalculationField
                      label="Fremdleistung"
                      value={draft.externalCosts}
                      onValueChange={updateDraft("externalCosts")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Handling"
                      value={draft.handlingTime}
                      onValueChange={updateDraft("handlingTime")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Versand"
                      value={draft.shippingCosts}
                      onValueChange={updateDraft("shippingCosts")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Verpackung"
                      value={draft.packagingCosts}
                      onValueChange={updateDraft("packagingCosts")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Gemeinkosten"
                      value={draft.overheadRate}
                      onValueChange={updateDraft("overheadRate")}
                      badge="später"
                    />
                    <CalculationField
                      label="Mindestpreis"
                      value={draft.minPrice}
                      onValueChange={updateDraft("minPrice")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Rabatt"
                      value={draft.discount}
                      onValueChange={updateDraft("discount")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Deckungsbeitrag"
                      value={draft.contributionMargin}
                      onValueChange={updateDraft("contributionMargin")}
                      badge="später"
                    />
                    <CalculationField
                      label="Marge"
                      value={draft.margin}
                      onValueChange={updateDraft("margin")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Verkaufspreis netto"
                      value={draft.salePriceNet}
                      onValueChange={updateDraft("salePriceNet")}
                      badge="später"
                    />
                    <CalculationField
                      label="Abrechnung"
                      value={draft.billingMode}
                      onValueChange={updateDraft("billingMode")}
                      badge="optional"
                      wide
                    />
                    <CalculationField
                      label="Mengenabrechnung"
                      value={draft.settlementNote}
                      onValueChange={updateDraft("settlementNote")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Provision"
                      value={draft.commission}
                      onValueChange={updateDraft("commission")}
                      badge="optional"
                    />
                    <CalculationField
                      label="Rechnungskontrolle"
                      value={draft.invoiceControl}
                      onValueChange={updateDraft("invoiceControl")}
                      badge="optional"
                      wide
                    />
                  </div>
                </CalculationSection>
                <CalculationPlausibilityOverview
                  draft={draft}
                  activeFinishingCount={activeFinishingCount}
                  productionMode={productionMode}
                />
                <CalculationFieldAudit />
              </>
            ) : null}
          </div>

          <div
            className="pp-calculation-statusbar"
            aria-label="Kalkulationsstatus und Aktionen"
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
                {result.layout.usedSlots} Nutzen ·{" "}
                {result.production.sheetsRequired
                  ? formatNumber(result.production.sheetsRequired)
                  : "offen"}{" "}
                Bogen
              </b>
            </div>
            <button
              className="pp-calculation-create-button pp-calculation-create-button--bar"
              type="button"
              onClick={handleCreateOrderDraft}
              disabled={!canCreateOrderDraft}
            >
              {canCreateOrderDraft
                ? "Auftrag aus Kalkulation erzeugen"
                : "Auftragsdaten fehlen"}
            </button>
          </div>
        </div>

        <aside
          className="pp-calculation-result-panel pp-calculation-result-panel--compact"
          aria-label="Kalkulation Ergebnis"
        >
          <div className="pp-calculation-result-panel__head">
            <p className="pp-eyebrow">Ergebnis</p>
            <h2>Auswertung</h2>
            <span>Kurzübersicht zur aktuellen Kalkulation.</span>
          </div>

          <CalculationSheetPreview payload={payload} />

          <div className="pp-calculation-output-card">
            <h3>Produktionsdaten</h3>
            <div className="pp-calc-result-list">
              <ResultLine
                label="Produktionsweg"
                value={
                  productionModes.find((mode) => mode.id === productionMode)
                    ?.label ?? "Eigenproduktion"
                }
              />
              <ResultLine label="Produkt" value={payload.product.label} />
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

          <div
            className={
              draftWasCreated
                ? "pp-calculation-create-note is-active"
                : "pp-calculation-create-note"
            }
          >
            <strong>
              {draftWasCreated
                ? "Auftragsentwurf erzeugt"
                : "Noch nicht gespeichert"}
            </strong>
            <p>
              Reitermaske mit lokalem Demo-State. Die aktuellen Werte werden
              beim Erzeugen übernommen.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
