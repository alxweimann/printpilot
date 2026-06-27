import flyerPreview from "../../assets/order-previews/flyer-dinlang.png";
import realBusinessCardPreview from "../../assets/order-previews/wohlstandsmeister-vika.png";
import realBusinessCardTrimmedPreview from "../../assets/order-previews/wohlstandsmeister-vika-trimmed.png";
import letterheadPreview from "../../assets/order-previews/aw-briefbogen.png";
import realBusinessCardPdf from "../../assets/order-files/wohlstandsmeister-vika.pdf";
import letterheadPdf from "../../assets/order-files/aw-briefbogen.pdf";
import brochurePreview from "../../assets/order-previews/broschuere-a5.png";
import posterPreview from "../../assets/order-previews/plakat-a2.png";
import stickerPreview from "../../assets/order-previews/aufkleberbogen.png";

export type OrderTone = "green" | "orange" | "gray" | "blue";
export type CheckStatus = "done" | "open" | "required";

export type OrderStatus = {
  label: string;
  tone: OrderTone;
};

export type OrderPreview = {
  kind: "flyer" | "business-card" | "brochure" | "poster" | "sticker" | "letterhead";
  label: string;
  filename: string;
  meta: string;
  imageSrc: string;
  imageAlt: string;
  sourcePdf?: string;
};

export type FinishingStep = {
  label: string;
  status: OrderStatus;
  note: string;
};

export type ChecklistSection = {
  title: string;
  items: Array<{ status: CheckStatus; label: string }>;
};

export type HistoryEntry = {
  tone: OrderTone;
  date: string;
  time: string;
  title: string;
  user: string;
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
  impositionCount: number;
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
  finishing: FinishingStep[];
  checklist: ChecklistSection[];
  history: HistoryEntry[];
};
export type SourceFileType = "pdf" | "image" | "generated-preview";
export type ProductKind = OrderPreview["kind"];

export type PrintFileAsset = {
  type: SourceFileType;
  role: "original" | "preview" | "approval" | "imposition";
  filename: string;
  label: string;
  href?: string;
  imageSrc?: string;
  alt?: string;
  category: string;
  size: string;
  createdAt: {
    date: string;
    time: string;
  };
};

export type ProductSpecification = {
  kind: ProductKind;
  label: string;
  finalFormat: string;
  pages: string;
  quantity: string;
  substrate: string;
  colorMode: string;
  bleed: string;
  productionFormat: string;
};

export type SheetSpecification = {
  name: string;
  widthMm?: number;
  heightMm?: number;
  orientation: "landscape" | "portrait" | "roll" | "unknown";
};

export type ImpositionPlanType =
  | "sheet-repeat"
  | "business-card-24up"
  | "letterhead-2up"
  | "brochure-signature"
  | "wide-format-single"
  | "sticker-sheet";

export type ImpositionPlan = {
  type: ImpositionPlanType;
  label: string;
  sheet: SheetSpecification;
  item: {
    finalFormat: string;
    widthMm?: number;
    heightMm?: number;
  };
  layout: {
    columns: number;
    rows: number;
    usedSlots: number;
    totalSlots: number;
    gapMm?: string;
    marginMm?: string;
    orientation: "upright" | "rotated" | "mixed" | "roll";
  };
  bleed: string;
  previewNote: string;
};

export type OrderProductionData = {
  product: ProductSpecification;
  files: {
    original?: PrintFileAsset;
    preview: PrintFileAsset;
  };
  imposition: ImpositionPlan;
  preflight: {
    value: string;
    dataStatus: OrderStatus;
    bleedStatus: OrderStatus;
  };
};

export type CalculationValueSource = "calculation" | "production-override" | "manual" | "system";

export type CalculationProductionFormat = {
  label: string;
  widthMm?: number;
  heightMm?: number;
  orientation?: "portrait" | "landscape" | "roll" | "unknown";
};

export type CalculationImpositionResult = {
  planType: ImpositionPlanType;
  sheet: SheetSpecification;
  item: {
    finalFormat: string;
    widthMm?: number;
    heightMm?: number;
  };
  layout: {
    columns: number;
    rows: number;
    usedSlots: number;
    totalSlots: number;
    gapMm?: number | string;
    marginMm?: number | string;
    orientation: "upright" | "rotated" | "mixed" | "roll";
  };
  production: {
    orderedQuantity: number;
    sheetsRequired?: number;
    overs?: number;
    netQuantity?: number;
    restQuantity?: number;
  };
  finishingHints?: string[];
  notes?: string[];
};

export type CalculationToProductionPayload = {
  version: "printpilot-calculation-v1";
  source: "calculation";
  calculationId?: string;
  quoteId?: string;
  orderId?: string;
  product: {
    kind: ProductKind;
    label: string;
    finalFormat: CalculationProductionFormat;
    pages: string;
    quantity: number;
    substrate?: string;
    colorMode?: string;
    bleedMm?: number;
  };
  imposition: CalculationImpositionResult;
  machine?: {
    label: string;
    type?: PrintPilotOrder["machineType"];
  };
  preview?: {
    originalPdf?: PrintFileAsset;
    generatedPreview?: PrintFileAsset;
  };
  valueSources?: Partial<Record<
    | "product"
    | "sheet"
    | "imposition"
    | "machine"
    | "preview",
    CalculationValueSource
  >>;
};

export type ProductionDataContractField = {
  group: "Produkt" | "Druckbogen" | "Nutzenplan" | "Menge" | "Maschine" | "Dateien";
  field: string;
  required: boolean;
  provider: "Kalkulation" | "Auftrag" | "Druckdaten" | "System";
  consumer: "Auftragstasche" | "Übersicht" | "spätere Ausschieß-Engine";
  note: string;
};

export const calculationProductionContract = [
  {
    group: "Produkt",
    field: "product.kind / product.label",
    required: true,
    provider: "Kalkulation",
    consumer: "Auftragstasche",
    note: "Steuert Produktdarstellung, Preview-Typ und spätere produktabhängige Nutzenplan-Templates.",
  },
  {
    group: "Produkt",
    field: "product.finalFormat",
    required: true,
    provider: "Kalkulation",
    consumer: "Auftragstasche",
    note: "Endformat inklusive mm-Werten; Grundlage für Nutzenformat und technische Legende.",
  },
  {
    group: "Druckbogen",
    field: "imposition.sheet",
    required: true,
    provider: "Kalkulation",
    consumer: "Auftragstasche",
    note: "Bogenformat, z. B. SRA3 450 × 320 mm oder Rollenmaterial.",
  },
  {
    group: "Nutzenplan",
    field: "imposition.layout.columns / rows / usedSlots",
    required: true,
    provider: "Kalkulation",
    consumer: "Auftragstasche",
    note: "Raster und Nutzenanzahl; wird in der Auftragstasche nur visualisiert, nicht neu berechnet.",
  },
  {
    group: "Nutzenplan",
    field: "imposition.layout.gapMm / marginMm / bleedMm",
    required: false,
    provider: "Kalkulation",
    consumer: "spätere Ausschieß-Engine",
    note: "Zwischenschnitt, Rand und Beschnitt. Aktuell Anzeige-/Legendenwert, später produktionsrelevant.",
  },
  {
    group: "Menge",
    field: "imposition.production.sheetsRequired / overs / restQuantity",
    required: false,
    provider: "Kalkulation",
    consumer: "Auftragstasche",
    note: "Bogenanzahl, Zuschuss und Restmenge für spätere Produktionsplanung.",
  },
  {
    group: "Maschine",
    field: "machine.label / machine.type",
    required: false,
    provider: "Kalkulation",
    consumer: "Übersicht",
    note: "Maschinenempfehlung aus Kalkulation; kann im Auftrag später manuell überschrieben werden.",
  },
  {
    group: "Dateien",
    field: "preview.originalPdf / generatedPreview",
    required: false,
    provider: "Druckdaten",
    consumer: "Auftragstasche",
    note: "Originaldatei und gerendertes Thumbnail bleiben getrennt, damit echte PDF-Preview später austauschbar ist.",
  },
] satisfies ProductionDataContractField[];

const productKindLabels: Record<ProductKind, string> = {
  flyer: "Flyer",
  "business-card": "Visitenkarte",
  brochure: "Broschüre",
  poster: "Plakat",
  sticker: "Aufkleberbogen",
  letterhead: "Briefbogen",
};

const sheetSpecs: Record<string, SheetSpecification> = {
  SRA3: { name: "SRA3", widthMm: 450, heightMm: 320, orientation: "landscape" },
};

function getSheetSpecification(order: PrintPilotOrder): SheetSpecification {
  if (order.rawFormat === "SRA3") {
    return sheetSpecs.SRA3;
  }

  if (order.rawFormat.toLowerCase().includes("rolle")) {
    return { name: order.rawFormat, orientation: "roll" };
  }

  return { name: order.rawFormat, orientation: "unknown" };
}

function getItemSize(order: PrintPilotOrder) {
  switch (order.preview.kind) {
    case "business-card":
      return { widthMm: 85, heightMm: 55 };
    case "flyer":
      return { widthMm: 210, heightMm: 99 };
    case "letterhead":
      return { widthMm: 210, heightMm: 297 };
    case "poster":
      return { widthMm: 420, heightMm: 594 };
    case "brochure":
      return { widthMm: 148, heightMm: 210 };
    case "sticker":
      return { widthMm: 210, heightMm: 297 };
    default:
      return {};
  }
}

function getImpositionPlan(order: PrintPilotOrder): ImpositionPlan {
  const sheet = getSheetSpecification(order);
  const itemSize = getItemSize(order);

  switch (order.preview.kind) {
    case "business-card":
      return {
        type: "business-card-24up",
        label: "24 Nutzen · 6 × 4",
        sheet,
        item: { finalFormat: order.endFormat, ...itemSize },
        layout: {
          columns: 6,
          rows: 4,
          usedSlots: 24,
          totalSlots: 24,
          gapMm: "ca. 3–5 mm",
          marginMm: "produktionsnah",
          orientation: "upright",
        },
        bleed: order.bleed,
        previewNote: "schematische Produktionsvorschau, noch keine echte Ausschieß-Engine",
      };
    case "letterhead":
      return {
        type: "letterhead-2up",
        label: "2 Nutzen · A4 auf SRA3",
        sheet,
        item: { finalFormat: order.endFormat, ...itemSize },
        layout: {
          columns: 2,
          rows: 1,
          usedSlots: 2,
          totalSlots: 2,
          gapMm: "A4-Stand auf SRA3",
          marginMm: "schematisch",
          orientation: "upright",
        },
        bleed: order.bleed,
        previewNote: "A4-Hochformat schematisch auf Druckbogen platziert",
      };
    case "brochure":
      return {
        type: "brochure-signature",
        label: order.imposition,
        sheet,
        item: { finalFormat: order.endFormat, ...itemSize },
        layout: {
          columns: 4,
          rows: 2,
          usedSlots: Math.min(order.impositionCount, 8),
          totalSlots: 8,
          gapMm: "schematisch",
          marginMm: "schematisch",
          orientation: "mixed",
        },
        bleed: order.bleed,
        previewNote: "Signaturdarstellung ohne echte Seitenreihenfolge",
      };
    case "poster":
      return {
        type: "wide-format-single",
        label: order.imposition,
        sheet,
        item: { finalFormat: order.endFormat, ...itemSize },
        layout: {
          columns: 1,
          rows: 1,
          usedSlots: 1,
          totalSlots: 1,
          gapMm: "Rollenlayout",
          marginMm: "Medienrand prüfen",
          orientation: "roll",
        },
        bleed: order.bleed,
        previewNote: "Rollenlayout schematisch dargestellt",
      };
    case "sticker":
      return {
        type: "sticker-sheet",
        label: order.imposition,
        sheet,
        item: { finalFormat: order.endFormat, ...itemSize },
        layout: {
          columns: 5,
          rows: 3,
          usedSlots: Math.min(order.impositionCount, 15),
          totalSlots: 15,
          gapMm: "schematisch",
          marginMm: "Konturabstand prüfen",
          orientation: "upright",
        },
        bleed: order.bleed,
        previewNote: "Kontur-/Stickerbogen schematisch dargestellt",
      };
    case "flyer":
    default:
      return {
        type: "sheet-repeat",
        label: order.imposition,
        sheet,
        item: { finalFormat: order.endFormat, ...itemSize },
        layout: {
          columns: 4,
          rows: 2,
          usedSlots: Math.min(order.impositionCount, 8),
          totalSlots: 8,
          gapMm: "schematisch",
          marginMm: "schematisch",
          orientation: "upright",
        },
        bleed: order.bleed,
        previewNote: "schematische Produktionsvorschau, noch keine echte Ausschieß-Engine",
      };
  }
}

export function getOrderProductionData(order: PrintPilotOrder): OrderProductionData {
  const previewFile: PrintFileAsset = {
    type: "generated-preview",
    role: "preview",
    filename: order.preview.filename.replace(/\.pdf$/i, ".png"),
    label: order.preview.label,
    imageSrc: order.preview.imageSrc,
    alt: order.preview.imageAlt,
    category: "Preview-Bild",
    size: order.preview.meta,
    createdAt: {
      date: order.fileDate,
      time: order.fileTime,
    },
  };

  const originalFile: PrintFileAsset | undefined = order.preview.sourcePdf
    ? {
        type: "pdf",
        role: "original",
        filename: order.preview.filename,
        label: "Original-PDF",
        href: order.preview.sourcePdf,
        category: order.fileCategory,
        size: order.fileSize,
        createdAt: {
          date: order.fileDate,
          time: order.fileTime,
        },
      }
    : undefined;

  return {
    product: {
      kind: order.preview.kind,
      label: productKindLabels[order.preview.kind],
      finalFormat: order.endFormat,
      pages: order.pages,
      quantity: order.quantity,
      substrate: order.paper,
      colorMode: order.color,
      bleed: order.bleed,
      productionFormat: order.rawFormat,
    },
    files: {
      original: originalFile,
      preview: previewFile,
    },
    imposition: getImpositionPlan(order),
    preflight: {
      value: order.preflightValue,
      dataStatus: order.data,
      bleedStatus: order.bleedStatus,
    },
  };
}

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

const history = (
  orderDate: string,
  fileTime: string,
  owner: string,
  dataLabel: string,
  approvalLabel: string,
): HistoryEntry[] => [
  {
    tone: "blue",
    date: orderDate,
    time: "10:15",
    title: "Auftrag angelegt",
    user: "Admin",
  },
  {
    tone: dataLabel.includes("fehlen") ? "orange" : "green",
    date: orderDate,
    time: fileTime,
    title: `Datenprüfung: ${dataLabel}`,
    user: owner,
  },
  {
    tone: approvalLabel.includes("offen") ? "orange" : "green",
    date: orderDate,
    time: "14:20",
    title: `Kundenfreigabe: ${approvalLabel}`,
    user: owner,
  },
];

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
    impositionCount: 8,
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
      imageSrc: flyerPreview,
      imageAlt: "Druckdatei-Vorschau Flyer DIN Lang mit grünem Aktionsmotiv",
    },
    fileSize: "8,2 MB",
    fileCategory: "Druckdaten",
    fileDate: "30.05.2026",
    fileTime: "10:10",
    preflightValue: "OK",
    bleedStatus: { label: "prüfen", tone: "orange" },
    scheduleStart: "02.06.2026",
    scheduleStartTime: "08:00",
    finishing: [
      {
        label: "Schneiden",
        status: { label: "Geplant", tone: "orange" },
        note: "DIN Lang auf Endformat schneiden",
      },
      {
        label: "Falzen",
        status: { label: "Nicht notwendig", tone: "gray" },
        note: "2-seitiger Flyer ohne Falz",
      },
      {
        label: "Rillen",
        status: { label: "Nicht notwendig", tone: "gray" },
        note: "135 g ohne Rillung",
      },
      {
        label: "Heften",
        status: { label: "Nicht notwendig", tone: "gray" },
        note: "Einzelblatt",
      },
      {
        label: "Verpacken",
        status: { label: "Geplant", tone: "orange" },
        note: "3 Pakete à 1.000 Stück",
      },
    ],
    checklist: [
      {
        title: "Druck",
        items: [
          { status: "done", label: "Datei geprüft" },
          { status: "done", label: "Preflight OK" },
          { status: "done", label: "Farben geprüft" },
          { status: "required", label: "Ausschießung 8 Nutzen prüfen" },
          { status: "open", label: "Bilderdruck matt 135 g einlegen" },
          { status: "open", label: "Testdruck OK" },
          { status: "open", label: "Druck fertig" },
        ],
      },
      {
        title: "Weiterverarbeitung",
        items: [
          { status: "open", label: "Schneiden" },
          { status: "open", label: "Auflage bündeln" },
          { status: "open", label: "Verpacken" },
        ],
      },
      {
        title: "Versand",
        items: [
          { status: "open", label: "Auflage geprüft" },
          { status: "open", label: "Karton beschriftet" },
          { status: "open", label: "Abholung bereit" },
        ],
      },
    ],
    history: history(
      "30.05.2026",
      "10:10",
      "Sarah K.",
      "Daten geprüft",
      "Freigabe erteilt",
    ),
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
    impositionCount: 24,
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
      filename: "Wohlstandsmeister-ViKa.pdf",
      meta: "6 Seiten · 3,1 MB",
      imageSrc: realBusinessCardPreview,
      imageAlt: "PDF-Vorschau Wohlstandsmeister Visitenkarte mit QR-Code und Beschnittmarken",
      sourcePdf: realBusinessCardPdf,
    },
    fileSize: "3,1 MB",
    fileCategory: "Freigabe/Druckdaten",
    fileDate: "31.05.2026",
    fileTime: "09:40",
    preflightValue: "OK",
    bleedStatus: { label: "OK", tone: "green" },
    scheduleStart: "03.06.2026",
    scheduleStartTime: "10:30",
    finishing: [
      {
        label: "Schneiden",
        status: { label: "Geplant", tone: "orange" },
        note: "Karten auf 85 × 55 mm schneiden",
      },
      {
        label: "Falzen",
        status: { label: "Nicht notwendig", tone: "gray" },
        note: "Kartenprodukt",
      },
      {
        label: "Rillen",
        status: { label: "Nicht notwendig", tone: "gray" },
        note: "Keine Rillung",
      },
      {
        label: "Heften",
        status: { label: "Nicht notwendig", tone: "gray" },
        note: "Einzelkarten",
      },
      {
        label: "Verpacken",
        status: { label: "Wartet", tone: "gray" },
        note: "Nach Freigabe nach Ansprechpartnern bündeln",
      },
    ],
    checklist: [
      {
        title: "Druck",
        items: [
          { status: "done", label: "Preflight OK" },
          { status: "required", label: "Kundenfreigabe offen" },
          { status: "open", label: "Personalisierungen abgleichen" },
          { status: "open", label: "Munken Lynx 300 g einlegen" },
          { status: "open", label: "Testdruck je Ansprechpartner" },
        ],
      },
      {
        title: "Weiterverarbeitung",
        items: [
          { status: "open", label: "Schneiden" },
          { status: "open", label: "Sätze trennen" },
          { status: "open", label: "Verpacken" },
        ],
      },
      {
        title: "Versand",
        items: [
          { status: "open", label: "Auflage je Ansprechpartner prüfen" },
          { status: "open", label: "Übergabe an Praxis vorbereiten" },
        ],
      },
    ],
    history: history(
      "31.05.2026",
      "09:40",
      "Max M.",
      "Preflight OK",
      "Freigabe offen",
    ),
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
    impositionCount: 8,
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
      imageSrc: brochurePreview,
      imageAlt: "Druckdatei-Vorschau Broschüre A5 als Doppelseitenmotiv",
    },
    fileSize: "5,6 MB",
    fileCategory: "Umschlag",
    fileDate: "31.05.2026",
    fileTime: "15:25",
    preflightValue: "Teilweise",
    bleedStatus: { label: "offen", tone: "orange" },
    scheduleStart: "04.06.2026",
    scheduleStartTime: "08:00",
    finishing: [
      {
        label: "Schneiden",
        status: { label: "Geplant", tone: "orange" },
        note: "A5 nach Heftung final schneiden",
      },
      {
        label: "Falzen",
        status: { label: "Geplant", tone: "orange" },
        note: "Bogen für Rückenheftung falzen",
      },
      {
        label: "Rillen",
        status: { label: "Nicht notwendig", tone: "gray" },
        note: "Rückenheftung ohne Rillung",
      },
      {
        label: "Heften",
        status: { label: "Wartet", tone: "gray" },
        note: "Rückenheftung nach Innenteil",
      },
      {
        label: "Verpacken",
        status: { label: "Offen", tone: "gray" },
        note: "Nach Endkontrolle bündeln",
      },
    ],
    checklist: [
      {
        title: "Druck",
        items: [
          { status: "done", label: "Umschlag geprüft" },
          { status: "required", label: "Innenteil-PDF fehlt" },
          { status: "required", label: "Seitenreihenfolge prüfen" },
          { status: "open", label: "Ausschießung 16 Seiten prüfen" },
          { status: "open", label: "Umschlag-/Innenteilpapier einlegen" },
        ],
      },
      {
        title: "Weiterverarbeitung",
        items: [
          { status: "open", label: "Falzen" },
          { status: "open", label: "Rückenheftung" },
          { status: "open", label: "3-Seiten-Schnitt" },
          { status: "open", label: "Verpacken" },
        ],
      },
      {
        title: "Versand",
        items: [
          { status: "open", label: "Exemplarprüfung" },
          { status: "open", label: "Kartons etikettieren" },
        ],
      },
    ],
    history: history(
      "31.05.2026",
      "15:25",
      "Admin",
      "Daten fehlen",
      "Freigabe erteilt",
    ),
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
    impositionCount: 1,
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
      imageSrc: posterPreview,
      imageAlt: "Druckdatei-Vorschau Plakat A2 mit farbigem Motiv",
    },
    fileSize: "42,0 MB",
    fileCategory: "Druckdaten",
    fileDate: "01.06.2026",
    fileTime: "12:10",
    preflightValue: "OK",
    bleedStatus: { label: "OK", tone: "green" },
    scheduleStart: "05.06.2026",
    scheduleStartTime: "07:30",
    finishing: [
      {
        label: "Schneiden",
        status: { label: "Geplant", tone: "orange" },
        note: "A2 auf Endformat schneiden",
      },
      {
        label: "Falzen",
        status: { label: "Nicht notwendig", tone: "gray" },
        note: "Plakat ungerillt",
      },
      {
        label: "Rillen",
        status: { label: "Nicht notwendig", tone: "gray" },
        note: "Nicht erforderlich",
      },
      {
        label: "Heften",
        status: { label: "Nicht notwendig", tone: "gray" },
        note: "Einzelplakate",
      },
      {
        label: "Verpacken",
        status: { label: "Geplant", tone: "orange" },
        note: "Flach verpacken / Knickschutz",
      },
    ],
    checklist: [
      {
        title: "Druck",
        items: [
          { status: "done", label: "Daten geprüft" },
          { status: "done", label: "Beschnitt OK" },
          { status: "open", label: "Rollenmaterial prüfen" },
          { status: "open", label: "Medienprofil VG3 wählen" },
          { status: "open", label: "RIP-Vorschau prüfen" },
        ],
      },
      {
        title: "Weiterverarbeitung",
        items: [
          { status: "open", label: "Trocknung beachten" },
          { status: "open", label: "A2 schneiden" },
          { status: "open", label: "Flach verpacken" },
        ],
      },
      {
        title: "Versand",
        items: [
          { status: "open", label: "Abholung Freitag vormittag" },
          { status: "open", label: "Motivserie vollständig prüfen" },
        ],
      },
    ],
    history: history(
      "01.06.2026",
      "12:10",
      "Julia P.",
      "Daten geprüft",
      "Freigabe erteilt",
    ),
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
    impositionCount: 12,
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
      imageSrc: stickerPreview,
      imageAlt: "Druckdatei-Vorschau Aufkleberbogen mit CutContour-Stickern",
    },
    fileSize: "18,7 MB",
    fileCategory: "Druck-/Cutdaten",
    fileDate: "01.06.2026",
    fileTime: "16:05",
    preflightValue: "OK",
    bleedStatus: { label: "OK", tone: "green" },
    scheduleStart: "05.06.2026",
    scheduleStartTime: "11:30",
    finishing: [
      {
        label: "Schneiden",
        status: { label: "Nicht notwendig", tone: "gray" },
        note: "Konturschnitt übernimmt Schnittlinie",
      },
      {
        label: "Falzen",
        status: { label: "Nicht notwendig", tone: "gray" },
        note: "Aufkleberbogen",
      },
      {
        label: "Konturschnitt",
        status: { label: "In Arbeit", tone: "orange" },
        note: "CutContour nach Druck ausführen",
      },
      {
        label: "Entgittern",
        status: { label: "Geplant", tone: "orange" },
        note: "Aktionsaufkleber entgittern",
      },
      {
        label: "Verpacken",
        status: { label: "Geplant", tone: "orange" },
        note: "Bogen plan einlegen",
      },
    ],
    checklist: [
      {
        title: "Druck",
        items: [
          { status: "done", label: "Druckdaten geprüft" },
          { status: "done", label: "CutContour erkannt" },
          { status: "open", label: "Orajet 3164XG einlegen" },
          { status: "open", label: "Trocknungszeit einplanen" },
        ],
      },
      {
        title: "Weiterverarbeitung",
        items: [
          { status: "required", label: "Konturschnitt prüfen" },
          { status: "open", label: "Entgittern" },
          { status: "open", label: "Bogen zählen" },
          { status: "open", label: "Verpacken" },
        ],
      },
      {
        title: "Versand",
        items: [
          { status: "open", label: "Aufkleberbogen gegenknicken vermeiden" },
          { status: "open", label: "Übergabe ans Autohaus" },
        ],
      },
    ],
    history: history(
      "01.06.2026",
      "16:05",
      "Sarah K.",
      "Daten geprüft",
      "Freigabe erteilt",
    ),
  },
  {
    id: "PP-2026-00486",
    customer: "Weimann Print",
    customerAddress: ["Druckstraße 1", "67071 Ludwigshafen"],
    contactName: "Alex Weimann",
    contactPhone: "0621 / 000000",
    contactEmail: "info@weimann-print.de",
    product: "Briefbogen A4",
    productDescription: "Geschäftsbriefbogen mit Logo, Servicezeile und farbigem Abschluss",
    format: "A4 · 4/0",
    endFormat: "A4",
    pages: "1-seitig",
    quantity: "1.000 Stück",
    paper: "Offset weiß 90 g",
    color: "4/0-farbig CMYK",
    rawFormat: "SRA3",
    imposition: "2 Nutzen",
    impositionCount: 2,
    bleed: "3 mm",
    waste: "ca. 25 Bogen",
    totalWeight: "ca. 9,0 kg",
    machine: "Xerox® Iridesse 1",
    machineType: "digital-color",
    machineTypeLabel: "Digitaldruck Farbe",
    priority: { label: "Normal", tone: "blue" },
    production: { label: "Geplant", tone: "blue" },
    approval: { label: "Freigabe erteilt", tone: "green" },
    data: { label: "Daten geprüft", tone: "green" },
    orderDate: "02.06.2026",
    dueDate: "06.06.2026",
    dueMeta: "Sa · 11:00",
    deliveryMeta: "KW 23 / Samstag",
    nextStep: "Papier prüfen und Druckbogen vorbereiten",
    owner: "Sarah K.",
    progress: 18,
    preview: {
      kind: "letterhead",
      label: "PDF-Preview",
      filename: "aw_briefbogen.pdf",
      meta: "1 Seite · 583 KB",
      imageSrc: letterheadPreview,
      imageAlt: "PDF-Vorschau Briefbogen Weimann Print mit Logo und pinkem Verlauf",
      sourcePdf: letterheadPdf,
    },
    fileSize: "583 KB",
    fileCategory: "Druckdaten",
    fileDate: "02.06.2026",
    fileTime: "13:20",
    preflightValue: "OK",
    bleedStatus: { label: "OK", tone: "green" },
    scheduleStart: "06.06.2026",
    scheduleStartTime: "08:00",
    finishing: [
      {
        label: "Schneiden",
        status: { label: "Geplant", tone: "orange" },
        note: "SRA3 auf A4 endschneiden",
      },
      {
        label: "Falzen",
        status: { label: "Nicht notwendig", tone: "gray" },
        note: "Briefbogen ungefalzt",
      },
      {
        label: "Rillen",
        status: { label: "Nicht notwendig", tone: "gray" },
        note: "90 g Offset ohne Rillung",
      },
      {
        label: "Heften",
        status: { label: "Nicht notwendig", tone: "gray" },
        note: "Einzelblatt",
      },
      {
        label: "Verpacken",
        status: { label: "Geplant", tone: "orange" },
        note: "Plan in Karton einlegen",
      },
    ],
    checklist: [
      {
        title: "Druck",
        items: [
          { status: "done", label: "PDF-Vorschau geprüft" },
          { status: "done", label: "Preflight OK" },
          { status: "open", label: "Offset weiß 90 g einlegen" },
          { status: "open", label: "Logo und Fußverlauf prüfen" },
          { status: "open", label: "Druckbogen freigeben" },
        ],
      },
      {
        title: "Weiterverarbeitung",
        items: [
          { status: "open", label: "A4 schneiden" },
          { status: "open", label: "Auflage zählen" },
          { status: "open", label: "Plan verpacken" },
        ],
      },
      {
        title: "Versand",
        items: [
          { status: "open", label: "Karton beschriften" },
          { status: "open", label: "Übergabe vorbereiten" },
        ],
      },
    ],
    history: history(
      "02.06.2026",
      "13:20",
      "Sarah K.",
      "Daten geprüft",
      "Freigabe erteilt",
    ),
  },
];

export const laneGroups = [
  { title: "Daten / Freigabe", count: 3, tone: "blue" },
  { title: "Produktion", count: 6, tone: "orange" },
  { title: "Weiterverarbeitung", count: 2, tone: "gray" },
  { title: "Versandbereit", count: 2, tone: "green" },
] satisfies Array<{ title: string; count: number; tone: OrderTone }>;

export const getFallbackOrder = () => orderRows[0];
export type CalculationToOrderDraftOptions = {
  id?: string;
  customer?: string;
  customerAddress?: string[];
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  dueDate?: string;
  dueMeta?: string;
  owner?: string;
  priority?: OrderStatus;
  orderDate?: string;
};

function formatMmValue(value?: number | string) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return typeof value === "number" ? `${value} mm` : value;
}

function formatCalculationFormat(format: CalculationProductionFormat) {
  if (format.widthMm && format.heightMm) {
    return `${format.widthMm} × ${format.heightMm} mm`;
  }

  return format.label;
}

function formatCalculationGap(gap?: number | string) {
  if (gap === undefined || gap === null || gap === "") {
    return undefined;
  }

  return typeof gap === "number" ? `${gap} mm` : gap;
}

function formatCalculationQuantity(quantity: number, kind: ProductKind) {
  const suffix = kind === "letterhead" || kind === "sticker" ? "Bogen" : "Stück";
  return `${quantity.toLocaleString("de-DE")} ${suffix}`;
}

function formatCalculationSheets(value?: number) {
  if (!value) {
    return "noch offen";
  }

  return `${value.toLocaleString("de-DE")} Bogen`;
}

function buildCalculationPreview(payload: CalculationToProductionPayload, fallback: PrintPilotOrder): OrderPreview {
  const generatedPreview = payload.preview?.generatedPreview;
  const originalPdf = payload.preview?.originalPdf;

  return {
    kind: payload.product.kind,
    label: generatedPreview?.label ?? fallback.preview.label,
    filename: originalPdf?.filename ?? generatedPreview?.filename ?? fallback.preview.filename,
    meta: generatedPreview?.size ?? fallback.preview.meta,
    imageSrc: generatedPreview?.imageSrc ?? fallback.preview.imageSrc,
    imageAlt: generatedPreview?.alt ?? fallback.preview.imageAlt,
    sourcePdf: originalPdf?.href ?? fallback.preview.sourcePdf,
  };
}

export function createProductionDataFromCalculation(
  payload: CalculationToProductionPayload,
  fallbackOrder: PrintPilotOrder = getFallbackOrder(),
): OrderProductionData {
  const fallbackProductionData = getOrderProductionData(fallbackOrder);
  const generatedPreview = payload.preview?.generatedPreview ?? fallbackProductionData.files.preview;
  const originalPdf = payload.preview?.originalPdf ?? fallbackProductionData.files.original;
  const bleed = formatMmValue(payload.product.bleedMm) ?? fallbackProductionData.product.bleed;
  const gap = formatCalculationGap(payload.imposition.layout.gapMm);
  const margin = formatCalculationGap(payload.imposition.layout.marginMm);

  return {
    product: {
      kind: payload.product.kind,
      label: payload.product.label,
      finalFormat: formatCalculationFormat(payload.product.finalFormat),
      pages: payload.product.pages,
      quantity: formatCalculationQuantity(payload.product.quantity, payload.product.kind),
      substrate: payload.product.substrate ?? fallbackProductionData.product.substrate,
      colorMode: payload.product.colorMode ?? fallbackProductionData.product.colorMode,
      bleed,
      productionFormat: payload.imposition.sheet.name,
    },
    files: {
      original: originalPdf,
      preview: generatedPreview,
    },
    imposition: {
      type: payload.imposition.planType,
      label: `${payload.imposition.layout.usedSlots} Nutzen · ${payload.imposition.layout.columns} × ${payload.imposition.layout.rows}`,
      sheet: payload.imposition.sheet,
      item: payload.imposition.item,
      layout: {
        columns: payload.imposition.layout.columns,
        rows: payload.imposition.layout.rows,
        usedSlots: payload.imposition.layout.usedSlots,
        totalSlots: payload.imposition.layout.totalSlots,
        gapMm: gap,
        marginMm: margin,
        orientation: payload.imposition.layout.orientation,
      },
      bleed,
      previewNote: payload.imposition.notes?.[0] ?? "aus Kalkulation übernommene Produktionsdaten",
    },
    preflight: {
      value: fallbackProductionData.preflight.value,
      dataStatus: fallbackProductionData.preflight.dataStatus,
      bleedStatus: fallbackProductionData.preflight.bleedStatus,
    },
  };
}

export function createOrderDraftFromCalculation(
  payload: CalculationToProductionPayload,
  baseOrder: PrintPilotOrder = getFallbackOrder(),
  options: CalculationToOrderDraftOptions = {},
): PrintPilotOrder {
  const productionData = createProductionDataFromCalculation(payload, baseOrder);
  const preview = buildCalculationPreview(payload, baseOrder);
  const sheetCount = payload.imposition.production.sheetsRequired;
  const overs = payload.imposition.production.overs;
  const restQuantity = payload.imposition.production.restQuantity;
  const gap = formatCalculationGap(payload.imposition.layout.gapMm);

  return {
    ...baseOrder,
    id: options.id ?? payload.orderId ?? baseOrder.id,
    customer: options.customer ?? baseOrder.customer,
    customerAddress: options.customerAddress ?? baseOrder.customerAddress,
    contactName: options.contactName ?? baseOrder.contactName,
    contactPhone: options.contactPhone ?? baseOrder.contactPhone,
    contactEmail: options.contactEmail ?? baseOrder.contactEmail,
    product: payload.product.label,
    productDescription: `${payload.product.label} aus Kalkulation ${payload.calculationId ?? "Demo"}`,
    format: `${productionData.product.finalFormat} · ${payload.product.pages}`,
    endFormat: productionData.product.finalFormat,
    pages: payload.product.pages,
    quantity: productionData.product.quantity,
    paper: productionData.product.substrate,
    color: productionData.product.colorMode,
    rawFormat: payload.imposition.sheet.name,
    imposition: productionData.imposition.label,
    impositionCount: payload.imposition.layout.usedSlots,
    bleed: productionData.product.bleed,
    waste: overs ? `${overs.toLocaleString("de-DE")} Zuschuss` : baseOrder.waste,
    totalWeight: restQuantity ? `${restQuantity.toLocaleString("de-DE")} Restmenge` : baseOrder.totalWeight,
    machine: payload.machine?.label ?? baseOrder.machine,
    machineType: payload.machine?.type ?? baseOrder.machineType,
    machineTypeLabel: payload.machine?.type ? baseOrder.machineTypeLabel : baseOrder.machineTypeLabel,
    production: { label: "Kalkuliert", tone: "blue" },
    approval: { label: "Freigabe offen", tone: "orange" },
    data: { label: "Daten prüfen", tone: "orange" },
    orderDate: options.orderDate ?? baseOrder.orderDate,
    dueDate: options.dueDate ?? baseOrder.dueDate,
    dueMeta: options.dueMeta ?? baseOrder.dueMeta,
    nextStep: "Produktionsdaten aus Kalkulation prüfen",
    owner: options.owner ?? baseOrder.owner,
    progress: 18,
    preview,
    fileSize: productionData.files.original?.size ?? productionData.files.preview.size,
    fileCategory: productionData.files.original?.category ?? productionData.files.preview.category,
    fileDate: productionData.files.original?.createdAt.date ?? productionData.files.preview.createdAt.date,
    fileTime: productionData.files.original?.createdAt.time ?? productionData.files.preview.createdAt.time,
    preflightValue: "offen",
    bleedStatus: { label: "prüfen", tone: "orange" },
    scheduleStart: options.dueDate ?? baseOrder.scheduleStart,
    scheduleStartTime: options.dueMeta?.split("·").at(-1)?.trim() ?? baseOrder.scheduleStartTime,
    finishing: payload.imposition.finishingHints?.length
      ? payload.imposition.finishingHints.map((label) => ({
          label,
          status: { label: "Geplant", tone: "orange" },
          note: "aus Kalkulation übernommen",
        }))
      : baseOrder.finishing,
    checklist: [
      {
        title: "Kalkulation",
        items: [
          { status: "done", label: "Produktionsdaten übernommen" },
          { status: "done", label: `${payload.imposition.layout.usedSlots} Nutzen / ${formatCalculationSheets(sheetCount)}` },
          { status: gap ? "done" : "open", label: gap ? `Zwischenraum ${gap}` : "Zwischenraum prüfen" },
          { status: "required", label: "Druckdaten gegen Kalkulation prüfen" },
        ],
      },
      ...baseOrder.checklist.slice(1),
    ],
    history: [
      {
        tone: "blue",
        date: options.orderDate ?? baseOrder.orderDate,
        time: "09:00",
        title: "Aus Kalkulation erzeugt",
        user: "Kalkulation",
      },
      {
        tone: "orange",
        date: options.orderDate ?? baseOrder.orderDate,
        time: "09:05",
        title: "Produktionsdaten prüfen",
        user: options.owner ?? baseOrder.owner,
      },
    ],
  };
}

export const demoCalculationPayload: CalculationToProductionPayload = {
  version: "printpilot-calculation-v1",
  source: "calculation",
  calculationId: "CALC-2026-00017",
  quoteId: "ANG-2026-00112",
  orderId: "PP-2026-CALC-DEMO",
  product: {
    kind: "business-card",
    label: "Visitenkarten aus Kalkulation",
    finalFormat: { label: "85 × 55 mm", widthMm: 85, heightMm: 55, orientation: "landscape" },
    pages: "4/4-farbig",
    quantity: 1000,
    substrate: "Munken Lynx 300 g",
    colorMode: "4/4-farbig CMYK",
    bleedMm: 3,
  },
  imposition: {
    planType: "business-card-24up",
    sheet: { name: "SRA3", widthMm: 450, heightMm: 320, orientation: "landscape" },
    item: { finalFormat: "85 × 55 mm", widthMm: 85, heightMm: 55 },
    layout: {
      columns: 6,
      rows: 4,
      usedSlots: 24,
      totalSlots: 24,
      gapMm: "ca. 3–5 mm",
      marginMm: "produktionsnah",
      orientation: "upright",
    },
    production: {
      orderedQuantity: 1000,
      sheetsRequired: 42,
      overs: 3,
      netQuantity: 1008,
      restQuantity: 8,
    },
    finishingHints: ["Schneiden", "Sätze trennen", "Verpacken"],
    notes: ["Demo-Adapter: Werte kommen später direkt aus dem Nutzenrechner."],
  },
  machine: { label: "Xerox® Iridesse 2", type: "digital-color" },
  preview: {
    originalPdf: {
      type: "pdf",
      role: "original",
      filename: "Wohlstandsmeister-ViKa.pdf",
      label: "Original-PDF",
      href: realBusinessCardPdf,
      category: "Freigabe/Druckdaten",
      size: "3,1 MB",
      createdAt: { date: "31.05.2026", time: "09:40" },
    },
    generatedPreview: {
      type: "generated-preview",
      role: "preview",
      filename: "wohlstandsmeister-vika.png",
      label: "PDF-Preview",
      imageSrc: realBusinessCardTrimmedPreview,
      alt: "normalisierte Endformat-Vorschau Wohlstandsmeister Visitenkarte ohne Schnittmarken",
      category: "Preview-Bild",
      size: "6 Seiten · 3,1 MB",
      createdAt: { date: "31.05.2026", time: "09:40" },
    },
  },
  valueSources: {
    product: "calculation",
    sheet: "calculation",
    imposition: "calculation",
    machine: "calculation",
    preview: "production-override",
  },
};

export const demoOrderFromCalculation = createOrderDraftFromCalculation(
  demoCalculationPayload,
  orderRows[1] ?? getFallbackOrder(),
  {
    customer: "Wohlstandsmeister GmbH",
    customerAddress: ["Pleidelsheimer Straße 9", "74321 Bietigheim-Bissingen"],
    contactName: "Lutz Humbert",
    contactPhone: "07142 35799-91",
    contactEmail: "lutz.humbert@wohlstandsmeister.de",
    dueDate: "04.06.2026",
    dueMeta: "Do · 11:00",
    owner: "Max M.",
  },
);

