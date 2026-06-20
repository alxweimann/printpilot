import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Panel } from "../../components/ui/Panel";
import { PrintPilotLogo } from "../../components/brand/PrintPilotLogo";
import printPilotLogoImage from "../../assets/logo/printpilot-logo.png";
import orderQrCode from "../../assets/qr/order-pp-2026-00481.svg";
import digitalColorMachine from "../../assets/machines/machine-digital-color.svg";
import digitalMonoMachine from "../../assets/machines/machine-digital-mono.svg";
import wideFormatMachine from "../../assets/machines/machine-wide-format.svg";
import inkjetMachine from "../../assets/machines/machine-inkjet.svg";
import finishingMachine from "../../assets/machines/machine-finishing.svg";
import { StatusPill } from "../../components/ui/StatusPill";
import {
  getOrderProductionData,
  type PrintPilotOrder,
} from "../orders/order-data";

function getProductHighlights(order: PrintPilotOrder) {
  const { product } = getOrderProductionData(order);
  return [
    ["Auflage", product.quantity],
    ["Endformat", product.finalFormat],
    ["Seiten", product.pages],
  ];
}

function getProductDetails(order: PrintPilotOrder) {
  const { product, imposition } = getOrderProductionData(order);
  return [
    ["Produktart", product.label],
    ["Papier", product.substrate],
    ["Farbigkeit", product.colorMode],
    ["Rohformat", product.productionFormat],
    ["Nutzen", imposition.label],
    ["Beschnitt", product.bleed],
    ["Ausschuss", order.waste],
    ["Gewicht gesamt", order.totalWeight],
  ];
}

function getPrintStatusItems(order: PrintPilotOrder, dataStatus: PocketStatus) {
  return [
    { tone: dataStatus.tone, label: "Preflight", value: dataStatus.label },
    {
      tone: "green" as const,
      label: "Farbmodus",
      value: order.color.includes("CMYK") ? "CMYK" : order.color,
    },
    {
      tone: order.bleedStatus.tone,
      label: "Beschnitt",
      value: order.bleedStatus.label,
    },
  ];
}

function getPrintSpecs(order: PrintPilotOrder) {
  return [
    ["Maschine", order.machine],
    ["Druckverfahren", order.machineTypeLabel],
    ["Duplex/Seiten", order.pages],
    [
      "Profil",
      order.machineType === "wide-format"
        ? "Roland VG3 · Medienprofil"
        : "Coated FOGRA39",
    ],
    [
      "Auflösung",
      order.machineType === "wide-format"
        ? "1200 × 900 dpi"
        : "2400 × 2400 dpi",
    ],
    [
      "Papierbedarf",
      order.rawFormat === "SRA3"
        ? "aus Auflage berechnen"
        : "Rollenbedarf prüfen",
    ],
    [
      "Klicks",
      order.machineType === "wide-format"
        ? "nicht relevant"
        : "aus Auflage berechnen",
    ],
    ["Druckzeit", "noch kalkulieren"],
    ["Operator", order.owner],
  ];
}

function getScheduleRows(
  order: PrintPilotOrder,
  actionState: PocketActionState,
) {
  return [
    {
      tone: "green" as const,
      label: "Auftrag erfasst",
      date: order.orderDate,
      time: "10:15",
      state: "erledigt",
    },
    {
      tone: actionState.data.tone,
      label: "Datenprüfung",
      date: order.orderDate,
      time: order.fileTime,
      state: actionState.data.label,
    },
    {
      tone: actionState.approval.tone,
      label: "Kundenfreigabe",
      date: order.orderDate,
      time: "14:20",
      state: actionState.approval.label,
    },
    {
      tone: actionState.production.tone,
      label: "Produktionsstart",
      date: order.scheduleStart,
      time: order.scheduleStartTime,
      state: actionState.production.label,
    },
    {
      tone: "gray" as const,
      label: "Weiterverarbeitung",
      date: order.dueDate,
      time: "13:30",
      state: "geplant",
    },
    {
      tone: "gray" as const,
      label: "Versand / Abholung",
      date: order.dueDate,
      time: order.dueMeta.replace(/^.*·\s*/, ""),
      state: "offen",
    },
  ];
}

function formatSheetSize(widthMm?: number, heightMm?: number) {
  return widthMm && heightMm ? `${widthMm} × ${heightMm} mm` : "schematisch";
}

function getImpositionStats(order: PrintPilotOrder) {
  const productionData = getOrderProductionData(order);
  const { imposition } = productionData;
  return [
    [
      "Bogenformat",
      `${imposition.sheet.name}${
        imposition.sheet.widthMm && imposition.sheet.heightMm
          ? ` · ${formatSheetSize(imposition.sheet.widthMm, imposition.sheet.heightMm)}`
          : ""
      }`,
    ],
    ["Nutzen", imposition.label],
    ["Druckbogen", `${order.quantity} · ${order.waste}`],
  ];
}

function getImpositionDetails(order: PrintPilotOrder) {
  const { imposition } = getOrderProductionData(order);
  return [
    ["Endformat", imposition.item.finalFormat],
    [
      "Anordnung",
      `${imposition.layout.columns} × ${imposition.layout.rows} · ${imposition.layout.usedSlots} Nutzen`,
    ],
    ["Beschnitt", `${imposition.bleed} umlaufend`],
    [
      "Wendeart",
      imposition.type === "wide-format-single"
        ? "Rolle / einseitig"
        : order.pages.includes("2") || order.pages.includes("4/4")
          ? "Längswende / prüfen"
          : "einseitig",
    ],
  ];
}

function getImpositionLegend(order: PrintPilotOrder) {
  const { imposition } = getOrderProductionData(order);

  return [
    [
      "Bogen",
      formatSheetSize(imposition.sheet.widthMm, imposition.sheet.heightMm),
    ],
    ["Nutzen", imposition.item.finalFormat],
    ["Beschnitt", imposition.bleed],
    ["Abstand", imposition.layout.gapMm ?? "schematisch"],
  ];
}

function getPreviewSpecs(order: PrintPilotOrder) {
  const { product, files } = getOrderProductionData(order);
  return [
    ["Format", product.finalFormat],
    ["Seiten", product.pages],
    ["Beschnitt", product.bleed],
    ["Quelle", files.original ? "Original-PDF" : "Demo-Preview"],
  ];
}

function getFiles(order: PrintPilotOrder) {
  const productionData = getOrderProductionData(order);
  const files = [
    productionData.files.original
      ? [
          "PDF",
          productionData.files.original.filename,
          productionData.files.original.category,
          productionData.files.original.createdAt.date,
          productionData.files.original.createdAt.time,
          productionData.files.original.size,
        ]
      : [
          "PNG",
          productionData.files.preview.filename,
          productionData.files.preview.category,
          productionData.files.preview.createdAt.date,
          productionData.files.preview.createdAt.time,
          productionData.files.preview.size,
        ],
    [
      "PNG",
      productionData.files.preview.filename,
      "Generiertes Preview",
      productionData.files.preview.createdAt.date,
      productionData.files.preview.createdAt.time,
      productionData.files.preview.size,
    ],
    [
      "PDF",
      `${order.id.toLowerCase()}_freigabe.pdf`,
      "Freigabe",
      order.orderDate,
      "14:20",
      "1,3 MB",
    ],
    [
      "PDF",
      `${order.id.toLowerCase()}_nutzenplan.pdf`,
      "Nutzenplan",
      order.fileDate,
      order.fileTime,
      "0,6 MB",
    ],
  ];

  return files;
}

function getNoteRows(order: PrintPilotOrder) {
  return [
    {
      tone: "blue" as const,
      label: "Lieferung",
      text: `${order.customer} benötigt den Auftrag bis ${order.dueDate}.`,
      meta: `${order.owner} · ${order.orderDate} · 14:22`,
    },
    {
      tone: "gray" as const,
      label: "Produktion",
      text: order.nextStep,
      meta: `PrintPilot · ${order.fileDate} · ${order.fileTime}`,
    },
    {
      tone: "gray" as const,
      label: "Rückfrage",
      text: `Rückfragen an ${order.contactName}.`,
      meta: `${order.owner} · ${order.orderDate} · 11:40`,
    },
  ];
}

function getProductionCoreItems(
  order: PrintPilotOrder,
  actionState: PocketActionState,
) {
  const productionData = getOrderProductionData(order);
  const activeFinishing = actionState.finishing.filter(
    (step) => step.status.label !== "Nicht notwendig",
  ).length;

  return [
    {
      label: "Kalkulation",
      title: "Produktionsgrundlage",
      value: `${productionData.product.label} · ${productionData.product.quantity}`,
      meta: `${productionData.product.finalFormat} · ${productionData.product.substrate}`,
      tone: "blue" as const,
    },
    {
      label: "Auftrag",
      title: order.id,
      value: order.customer,
      meta: `Liefertermin ${order.dueDate} · ${order.dueMeta}`,
      tone: order.priority.tone,
    },
    {
      label: "Druckdaten",
      title: actionState.data.label,
      value:
        productionData.files.original?.filename ??
        productionData.files.preview.filename,
      meta: `Preflight ${order.preflightValue} · Beschnitt ${order.bleedStatus.label}`,
      tone: actionState.data.tone,
    },
    {
      label: "Produktion",
      title: getCurrentProductionLabel(actionState.production),
      value: order.machine,
      meta: `${order.machineTypeLabel} · ${productionData.imposition.label}`,
      tone: actionState.production.tone,
    },
    {
      label: "Weiterverarbeitung",
      title: `${activeFinishing} aktive Schritte`,
      value:
        actionState.finishing
          .filter((step) => step.status.label !== "Nicht notwendig")
          .map((step) => step.label)
          .join(" · ") || "keine aktive Leistung",
      meta: "aus Auftragstasche steuerbar",
      tone: activeFinishing > 0 ? ("orange" as const) : ("gray" as const),
    },
    {
      label: "Versand",
      title: order.deliveryMeta,
      value: order.dueMeta,
      meta: "Übergabe aus Produktion an Versand",
      tone:
        actionState.production.label === "Versandbereit"
          ? ("green" as const)
          : ("gray" as const),
    },
  ];
}

const finishingCatalog = [
  "Schneiden",
  "Falzen",
  "Rillen",
  "Heften",
  "Ringösen",
  "Ableimen",
  "Bohren",
  "Perforieren",
  "Nummerieren",
  "Kuvertieren",
  "Handarbeiten",
  "Verpacken",
];

type ProductionInfoRow = {
  label: string;
  value: string;
  state?: "ok" | "check" | "later";
};

type ProductionInfoGroup = {
  title: string;
  description: string;
  tone: "green" | "orange" | "blue" | "gray";
  rows: ProductionInfoRow[];
};

function getActiveFinishingSteps(actionState: PocketActionState) {
  return actionState.finishing.filter(
    (step) => step.status.label !== "Nicht notwendig",
  );
}

function getActiveFinishingLabels(actionState: PocketActionState) {
  return getActiveFinishingSteps(actionState).map((step) => step.label);
}

function getProductionInfoGroups(
  order: PrintPilotOrder,
  actionState: PocketActionState,
): ProductionInfoGroup[] {
  const productionData = getOrderProductionData(order);
  const activeFinishing = getActiveFinishingSteps(actionState);
  const activeFinishingText =
    activeFinishing.map((step) => step.label).join(" · ") ||
    "keine aktive Leistung";

  return [
    {
      title: "Kunde & Auftrag",
      description: "Kontakt und kaufmännische Auftragsbasis",
      tone: "blue",
      rows: [
        { label: "Kunde", value: order.customer, state: "ok" },
        {
          label: "Kontakt",
          value: `${order.contactName} · ${order.contactPhone}`,
          state: "ok",
        },
        { label: "E-Mail", value: order.contactEmail, state: "ok" },
        { label: "Auftrag", value: order.id, state: "ok" },
        { label: "Bestellnummer", value: "noch nicht erfasst", state: "check" },
      ],
    },
    {
      title: "Produktdaten",
      description: "Format, Umfang, Auflage und Farbigkeiten",
      tone: "green",
      rows: [
        { label: "Produkt", value: productionData.product.label, state: "ok" },
        {
          label: "Endformat",
          value: productionData.product.finalFormat,
          state: "ok",
        },
        { label: "Seiten", value: productionData.product.pages, state: "ok" },
        {
          label: "Auflage",
          value: productionData.product.quantity,
          state: "ok",
        },
        {
          label: "Farbigkeit",
          value: productionData.product.colorMode,
          state: "ok",
        },
      ],
    },
    {
      title: "Material",
      description: "Papier, Bogenformat und Bedarf",
      tone: "blue",
      rows: [
        {
          label: "Papier",
          value: productionData.product.substrate,
          state: "ok",
        },
        {
          label: "Rohformat",
          value: productionData.product.productionFormat,
          state: "ok",
        },
        {
          label: "Bogenformat",
          value: productionData.imposition.sheet.name,
          state: "ok",
        },
        { label: "Zuschuss", value: order.waste, state: "ok" },
        {
          label: "Papierstatus",
          value: "später aus Materialmodul",
          state: "later",
        },
      ],
    },
    {
      title: "Druck",
      description: "Maschine, Datenstatus, Freigabe und technische Prüfung",
      tone: actionState.data.tone,
      rows: [
        { label: "Maschine", value: order.machine, state: "ok" },
        { label: "Verfahren", value: order.machineTypeLabel, state: "ok" },
        {
          label: "Datenstatus",
          value: actionState.data.label,
          state: actionState.data.tone === "green" ? "ok" : "check",
        },
        {
          label: "Freigabe",
          value: actionState.approval.label,
          state: actionState.approval.tone === "green" ? "ok" : "check",
        },
        {
          label: "Beschnitt",
          value: order.bleedStatus.label,
          state: order.bleedStatus.tone === "green" ? "ok" : "check",
        },
      ],
    },
    {
      title: "Nutzenplan",
      description: "Ausschießdaten für Druckbogen und spätere Engine",
      tone: "blue",
      rows: [
        {
          label: "Nutzen",
          value: productionData.imposition.label,
          state: "ok",
        },
        {
          label: "Anordnung",
          value: `${productionData.imposition.layout.columns} × ${productionData.imposition.layout.rows}`,
          state: "ok",
        },
        {
          label: "Beschnitt",
          value: productionData.imposition.bleed,
          state: "ok",
        },
        {
          label: "Zwischenraum",
          value: productionData.imposition.layout.gapMm ?? "schematisch",
          state: "check",
        },
        { label: "Druckbogen-PDF", value: "später erzeugen", state: "later" },
      ],
    },
    {
      title: "Weiterverarbeitung",
      description: "Aktive Produktionsschritte und kompletter Leistungskatalog",
      tone: activeFinishing.length > 0 ? "orange" : "gray",
      rows: [
        {
          label: "Aktiv",
          value: activeFinishingText,
          state: activeFinishing.length > 0 ? "ok" : "check",
        },
        {
          label: "Schritte",
          value: `${activeFinishing.length} aktiv`,
          state: activeFinishing.length > 0 ? "ok" : "check",
        },
        {
          label: "Katalog",
          value: `${finishingCatalog.length} Leistungen vorbereitet`,
          state: "ok",
        },
        {
          label: "Sonderarbeit",
          value: "Handarbeiten / Konfektionieren sichtbar",
          state: "ok",
        },
        { label: "Mailing", value: "Kuvertieren vorbereitet", state: "later" },
      ],
    },
    {
      title: "Versand",
      description: "Lieferung, Verpackung und Übergabe",
      tone: actionState.production.label === "Versandbereit" ? "green" : "gray",
      rows: [
        {
          label: "Termin",
          value: `${order.dueDate} · ${order.dueMeta}`,
          state: "ok",
        },
        { label: "Lieferinfo", value: order.deliveryMeta, state: "ok" },
        {
          label: "Adresse",
          value: order.customerAddress.join(", "),
          state: "ok",
        },
        {
          label: "Verpackung",
          value:
            activeFinishing.find((step) => step.label.includes("Verpack"))
              ?.note ?? "prüfen",
          state: "check",
        },
        { label: "Teillieferung", value: "später aus Auftrag", state: "later" },
      ],
    },
  ];
}

function ProductionInfoAudit({
  order,
  actionState,
}: {
  order: PrintPilotOrder;
  actionState: PocketActionState;
}) {
  const groups = getProductionInfoGroups(order, actionState);

  return (
    <section
      className="pp-production-info-audit"
      aria-label="Produktionsinformationen prüfen"
    >
      <div className="pp-production-info-audit__head">
        <div>
          <span>Produktionsinformationen</span>
          <strong>Fachlicher Vollständigkeitscheck der Auftragstasche</strong>
        </div>
        <small>
          zeigt, welche Informationen aus Kalkulation, Auftrag, Druckdaten und
          Produktion in der Auftragstasche sichtbar sind
        </small>
      </div>
      <div className="pp-production-info-grid">
        {groups.map((group) => (
          <article
            className={`pp-production-info-card pp-production-info-card--${group.tone}`}
            key={group.title}
          >
            <header>
              <span>{group.title}</span>
              <small>{group.description}</small>
            </header>
            <div>
              {group.rows.map((row) => (
                <p
                  className={`pp-production-info-row pp-production-info-row--${row.state ?? "ok"}`}
                  key={`${group.title}-${row.label}`}
                >
                  <span>{row.label}</span>
                  <strong>{row.value}</strong>
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FinishingCatalog({ actionState }: { actionState: PocketActionState }) {
  const activeLabels = getActiveFinishingLabels(actionState);

  return (
    <div
      className="pp-finishing-catalog"
      aria-label="Weiterverarbeitungs-Katalog"
    >
      <span>Leistungskatalog</span>
      <div>
        {finishingCatalog.map((label) => {
          const isActive = activeLabels.some(
            (activeLabel) =>
              activeLabel.toLowerCase().includes(label.toLowerCase()) ||
              label.toLowerCase().includes(activeLabel.toLowerCase()),
          );

          return (
            <small
              className={
                isActive
                  ? "pp-finishing-catalog__item pp-finishing-catalog__item--active"
                  : "pp-finishing-catalog__item"
              }
              key={label}
            >
              {label}
            </small>
          );
        })}
      </div>
    </div>
  );
}

function ProductionCoreStrip({
  order,
  actionState,
}: {
  order: PrintPilotOrder;
  actionState: PocketActionState;
}) {
  const items = getProductionCoreItems(order, actionState);

  return (
    <section
      className="pp-pocket-core-strip"
      aria-label="Produktionskern Auftragstasche"
    >
      <div className="pp-pocket-core-strip__head">
        <div>
          <span>Auftragstasche als Produktionskern</span>
          <strong>
            Alle produktionsrelevanten Informationen laufen hier zusammen
          </strong>
        </div>
        <small>
          Kalkulation → Auftrag → Auftragstasche → Produktion → Versand
        </small>
      </div>
      <div className="pp-pocket-core-grid">
        {items.map((item) => (
          <article
            className={`pp-pocket-core-card pp-pocket-core-card--${item.tone}`}
            key={item.label}
          >
            <span>{item.label}</span>
            <strong>{item.title}</strong>
            <b>{item.value}</b>
            <small>{item.meta}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

type OrderPocketView = "details" | "print-pocket";

type PrintPocketDraft = {
  orderNumber: string;
  jobTitle: string;
  jobSummary: string;
  deliveryDate: string;
  deliveryMeta: string;
  customerName: string;
  customerContact: string;
  customerAddress: string;
  customerPhone: string;
  invoiceName: string;
  invoiceAddress: string;
  correctionUntil: string;
  checklistLabel: string;
  statusLabel: string;
  specialNotes: string;
  orderDescription: string;
  quantity: string;
  finalFormat: string;
  openFormat: string;
  pages: string;
  impositionLabel: string;
  frontColors: string;
  backColors: string;
  printType: string;
  paper: string;
  rawFormat: string;
  printFormat: string;
  netSheets: string;
  wasteSheets: string;
  grossSheets: string;
  paperOrdered: boolean;
  paperInStock: boolean;
  paperSupplied: boolean;
  paperSupplier: boolean;
  deliveryAddress: string;
  partialDelivery1: string;
  partialDelivery2: string;
  partialDelivery3: string;
  totalQuantity: string;
  shipDpd: boolean;
  shipDpdExpress: boolean;
  shipPost: boolean;
  shipFreight: boolean;
  shipPickup: boolean;
  shipDriver: boolean;
  shippingMethod: string;
  packaging: string;
  partialDeliveries: string;
  finishCut: boolean;
  finishFold: boolean;
  finishCrease: boolean;
  finishStaple: boolean;
  finishEyelets: boolean;
  finishGlue: boolean;
  finishDrill: boolean;
  finishPerforate: boolean;
  finishNumber: boolean;
  finishEnvelope: boolean;
  finishManual: boolean;
  finishPack: boolean;
  finishingNotes: string;
  finishingAdditional: string;
  orderNew: boolean;
  reprintSame: boolean;
  reprintChanged: boolean;
  dataSupplied: boolean;
  dataStatus: string;
  approvalStatus: string;
  fileName: string;
  foreignWork: string;
  samples: string;
  documents: string;
  invoiceNote: string;
  sampleInPocket: boolean;
  deliveryNoteDocument: boolean;
  paperInvoiceDocument: boolean;
  supplierInvoiceDocument: boolean;
  controlDate: string;
  operator: string;
  signaturePrint: string;
  signatureFinishing: string;
  signatureShipping: string;
};

type PrintPocketDraftChange = <K extends keyof PrintPocketDraft>(
  field: K,
  value: PrintPocketDraft[K],
) => void;

function createPrintPocketDraft(order: PrintPilotOrder): PrintPocketDraft {
  const productionData = getOrderProductionData(order);
  const orderNumber = order.id.replace("PP-", "");
  const activeFinishing = order.finishing.filter(
    (step) => step.status.tone !== "gray",
  );
  const activePackaging = order.finishing.find((step) =>
    step.label.includes("Verpack"),
  );
  const hasActiveFinishing = (label: string) =>
    activeFinishing.some((step) => step.label === label);

  return {
    orderNumber,
    jobTitle: order.product,
    jobSummary: `${productionData.product.quantity} · ${productionData.product.finalFormat} · ${productionData.product.colorMode}`,
    deliveryDate: order.dueDate,
    deliveryMeta: order.dueMeta,
    customerName: order.customer,
    customerContact: order.contactName,
    customerAddress: order.customerAddress.join(" · "),
    customerPhone: order.contactPhone,
    invoiceName: order.customer,
    invoiceAddress: order.customerAddress.join(" · "),
    correctionUntil: `${order.orderDate} · 16:00`,
    checklistLabel: "3/13 · 1 offen",
    statusLabel: getCurrentProductionLabel(order.production),
    specialNotes: order.nextStep,
    orderDescription: `${productionData.product.label} · ${productionData.product.pages} · ${productionData.product.colorMode} · Bestellung per Mail / Kundenauftrag prüfen`,
    quantity: productionData.product.quantity,
    finalFormat: productionData.product.finalFormat,
    openFormat: productionData.product.finalFormat,
    pages: productionData.product.pages,
    impositionLabel: productionData.imposition.label,
    frontColors: order.color.includes("4/4") ? "4-farbig CMYK" : order.color,
    backColors: order.color.includes("4/4") ? "4-farbig CMYK" : "prüfen",
    printType: order.machineTypeLabel,
    paper: productionData.product.substrate,
    rawFormat: productionData.product.productionFormat,
    printFormat: `${productionData.imposition.sheet.name} · ${formatSheetSize(productionData.imposition.sheet.widthMm, productionData.imposition.sheet.heightMm)}`,
    netSheets: "aus Kalkulation",
    wasteSheets: order.waste,
    grossSheets: "aus Kalkulation",
    paperOrdered: false,
    paperInStock: true,
    paperSupplied: false,
    paperSupplier: false,
    deliveryAddress: order.customerAddress.join(" · "),
    partialDelivery1: "",
    partialDelivery2: "",
    partialDelivery3: "",
    totalQuantity: productionData.product.quantity,
    shipDpd: false,
    shipDpdExpress: false,
    shipPost: false,
    shipFreight: false,
    shipPickup: false,
    shipDriver: false,
    shippingMethod: order.deliveryMeta,
    packaging: activePackaging?.note ?? "Verpackung prüfen",
    partialDeliveries: "keine Teillieferung",
    finishCut: hasActiveFinishing("Schneiden"),
    finishFold: hasActiveFinishing("Falzen"),
    finishCrease: hasActiveFinishing("Rillen"),
    finishStaple: hasActiveFinishing("Heften"),
    finishEyelets: hasActiveFinishing("Ringösen"),
    finishGlue: hasActiveFinishing("Ableimen"),
    finishDrill: hasActiveFinishing("Bohren"),
    finishPerforate: hasActiveFinishing("Perforieren"),
    finishNumber: hasActiveFinishing("Nummerieren"),
    finishEnvelope: hasActiveFinishing("Kuvertieren"),
    finishManual: hasActiveFinishing("Handarbeiten"),
    finishPack: hasActiveFinishing("Verpacken"),
    finishingNotes:
      activeFinishing.map((step) => `${step.label}: ${step.note}`).join(" · ") ||
      "keine aktive Weiterverarbeitung",
    finishingAdditional: activePackaging?.note ?? "",
    orderNew: false,
    reprintSame: false,
    reprintChanged: false,
    dataSupplied: true,
    dataStatus: order.data.label,
    approvalStatus: order.approval.label,
    fileName: productionData.files.original?.filename ?? order.preview.filename,
    foreignWork: "keine Fremdarbeit erfasst",
    samples: "2 Belegexemplare / Muster nach Auftrag",
    documents: "Lieferschein · Papierrechnung · Lieferantenrechnung prüfen",
    invoiceNote: "Rechnung nach Versand prüfen",
    sampleInPocket: false,
    deliveryNoteDocument: false,
    paperInvoiceDocument: false,
    supplierInvoiceDocument: false,
    controlDate: order.orderDate,
    operator: order.owner,
    signaturePrint: "Druck geprüft",
    signatureFinishing: "Weiterverarbeitung geprüft",
    signatureShipping: "Versand geprüft",
  };
}

function DraftTextField({
  label,
  field,
  draft,
  onDraftChange,
}: {
  label: string;
  field: keyof PrintPocketDraft;
  draft: PrintPocketDraft;
  onDraftChange: PrintPocketDraftChange;
}) {
  return (
    <label>
      <span>{label}</span>
      <input
        value={String(draft[field])}
        onChange={(event) => onDraftChange(field, event.target.value as never)}
      />
    </label>
  );
}

function DraftTextArea({
  label,
  field,
  draft,
  onDraftChange,
  rows = 2,
}: {
  label: string;
  field: keyof PrintPocketDraft;
  draft: PrintPocketDraft;
  onDraftChange: PrintPocketDraftChange;
  rows?: number;
}) {
  return (
    <label className="pp-print-pocket-field-group__wide">
      <span>{label}</span>
      <textarea
        rows={rows}
        value={String(draft[field])}
        onChange={(event) => onDraftChange(field, event.target.value as never)}
      />
    </label>
  );
}

function DraftCheckbox({
  label,
  field,
  draft,
  onDraftChange,
}: {
  label: string;
  field: keyof PrintPocketDraft;
  draft: PrintPocketDraft;
  onDraftChange: PrintPocketDraftChange;
}) {
  return (
    <label className="pp-print-pocket-check-edit">
      <input
        type="checkbox"
        checked={Boolean(draft[field])}
        onChange={(event) => onDraftChange(field, event.target.checked as never)}
      />
      <span>{label}</span>
    </label>
  );
}

function PrintPocketDraftEditor({
  order,
  draft,
  onDraftChange,
}: {
  order: PrintPilotOrder;
  actionState: PocketActionState;
  draft: PrintPocketDraft;
  onDraftChange: PrintPocketDraftChange;
}) {
  return (
    <section
      className="pp-print-pocket-editor pp-print-pocket-editor--sheet"
      aria-label="Auftragstasche bearbeiten"
    >
      <div className="pp-print-pocket-editor__head">
        <div>
          <span>Auftragstasche</span>
          <strong>Vollständig editierbarer Laufzettel</strong>
          <p>
            Alle Felder der späteren DIN-A4-Auftragstasche sind hier als
            Drucktaschenwerte editierbar. Die ursprünglichen Auftragsdaten
            bleiben davon getrennt.
          </p>
        </div>
        <div className="pp-print-pocket-editor__job">
          <small>{order.id}</small>
          <b>{draft.jobTitle}</b>
          <span>
            {draft.customerName} · {draft.quantity}
          </span>
        </div>
      </div>

      <div className="pp-print-pocket-workbench">
        <article
          className="pp-print-pocket-a4-preview pp-print-pocket-a4-preview--editable"
          aria-label="A4-Vorschau"
        >
          <header>
            <div>
              <small>Auftrag-Nr.</small>
              <strong>{draft.orderNumber}</strong>
            </div>
            <div>
              <small>Liefertermin</small>
              <strong>{draft.deliveryDate}</strong>
              <span>{draft.deliveryMeta}</span>
            </div>
            <img src={orderQrCode} alt={`QR-Code für Auftrag ${order.id}`} />
          </header>

          <section className="pp-print-pocket-a4-preview__customer">
            <b>{draft.customerName}</b>
            <span>
              {draft.customerContact} · {draft.customerPhone}
            </span>
            <em>{draft.customerAddress}</em>
          </section>

          <section className="pp-print-pocket-a4-preview__notice">
            <small>Besondere Hinweise</small>
            <strong>{draft.specialNotes || "keine besonderen Hinweise"}</strong>
          </section>

          <section className="pp-print-pocket-a4-preview__title">
            <small>Auftragsbezeichnung</small>
            <strong>{draft.jobTitle}</strong>
            <span>{draft.jobSummary}</span>
          </section>

          <div className="pp-print-pocket-a4-preview__grid">
            <span>
              Material
              <br />
              <b>{draft.paper}</b>
            </span>
            <span>
              Druck
              <br />
              <b>{draft.printType}</b>
            </span>
            <span>
              Nutzen
              <br />
              <b>{draft.impositionLabel}</b>
            </span>
            <span>
              Weiterverarbeitung
              <br />
              <b>{draft.finishingNotes}</b>
            </span>
          </div>

          <section className="pp-print-pocket-a4-preview__checks">
            <span>{draft.paperOrdered ? "☒" : "☐"} Papier bestellt</span>
            <span>{draft.dataSupplied ? "☒" : "☐"} Daten gestellt</span>
            <span>{draft.sampleInPocket ? "☒" : "☐"} Muster</span>
            <span>{draft.deliveryNoteDocument ? "☒" : "☐"} Lieferschein</span>
            <span>{draft.paperInvoiceDocument ? "☒" : "☐"} Papierrechnung</span>
            <span>{draft.supplierInvoiceDocument ? "☒" : "☐"} Lieferantenrechnung</span>
          </section>

          <footer>
            <span>{draft.signaturePrint}</span>
            <span>{draft.signatureFinishing}</span>
            <span>{draft.signatureShipping}</span>
          </footer>
        </article>

        <div className="pp-print-pocket-fields pp-print-pocket-fields--all-editable">
          <section className="pp-print-pocket-field-group">
            <h3>Kopf / Kunde / Rechnung</h3>
            <div>
              <DraftTextField label="Auftrag-Nr." field="orderNumber" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Auftragsbezeichnung" field="jobTitle" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Kurzzeile" field="jobSummary" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Liefertermin" field="deliveryDate" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Termin-Zusatz" field="deliveryMeta" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Korrektur bis" field="correctionUntil" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Kunde" field="customerName" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Ansprechpartner" field="customerContact" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Telefon" field="customerPhone" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Rechnung an" field="invoiceName" draft={draft} onDraftChange={onDraftChange} />
            </div>
            <DraftTextArea label="Kundenadresse" field="customerAddress" draft={draft} onDraftChange={onDraftChange} rows={2} />
            <DraftTextArea label="Rechnungsadresse" field="invoiceAddress" draft={draft} onDraftChange={onDraftChange} rows={2} />
          </section>

          <section className="pp-print-pocket-field-group">
            <h3>Auftragsbeschreibung / Produktdaten</h3>
            <DraftTextArea label="Besondere Hinweise" field="specialNotes" draft={draft} onDraftChange={onDraftChange} rows={2} />
            <DraftTextArea label="Auftragsbeschreibung" field="orderDescription" draft={draft} onDraftChange={onDraftChange} rows={2} />
            <div>
              <DraftTextField label="Auflage" field="quantity" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Endformat" field="finalFormat" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Offenes Format" field="openFormat" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Umfang" field="pages" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Bogenaufteilung" field="impositionLabel" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Farben Vorderseite" field="frontColors" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Farben Rückseite" field="backColors" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Druckart" field="printType" draft={draft} onDraftChange={onDraftChange} />
            </div>
          </section>

          <section className="pp-print-pocket-field-group">
            <h3>Papier / Druckbogen</h3>
            <div>
              <DraftTextField label="Papier" field="paper" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Rohbogenformat" field="rawFormat" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Druckformat" field="printFormat" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Nettobogen" field="netSheets" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Zuschuss" field="wasteSheets" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Bruttobogen" field="grossSheets" draft={draft} onDraftChange={onDraftChange} />
            </div>
            <div className="pp-print-pocket-check-grid-edit">
              <DraftCheckbox label="Papier bestellt" field="paperOrdered" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Papier am Lager" field="paperInStock" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Papier gestellt" field="paperSupplied" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Lieferant" field="paperSupplier" draft={draft} onDraftChange={onDraftChange} />
            </div>
          </section>

          <section className="pp-print-pocket-field-group">
            <h3>Lieferung / Versand</h3>
            <DraftTextArea label="Lieferadresse" field="deliveryAddress" draft={draft} onDraftChange={onDraftChange} rows={2} />
            <div>
              <DraftTextField label="1. Teillieferung" field="partialDelivery1" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="2. Teillieferung" field="partialDelivery2" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="3. Teillieferung" field="partialDelivery3" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Gesamtmenge" field="totalQuantity" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Versandart" field="shippingMethod" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Verpackung" field="packaging" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Teillieferung" field="partialDeliveries" draft={draft} onDraftChange={onDraftChange} />
            </div>
            <div className="pp-print-pocket-check-grid-edit">
              <DraftCheckbox label="DPD" field="shipDpd" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="DPD-Express" field="shipDpdExpress" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Post" field="shipPost" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Spedition" field="shipFreight" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Abholung" field="shipPickup" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Fahrer" field="shipDriver" draft={draft} onDraftChange={onDraftChange} />
            </div>
          </section>

          <section className="pp-print-pocket-field-group">
            <h3>Weiterverarbeitung / Produktion</h3>
            <div className="pp-print-pocket-check-grid-edit pp-print-pocket-check-grid-edit--finishing">
              <DraftCheckbox label="Schneiden" field="finishCut" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Falzen" field="finishFold" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Rillen" field="finishCrease" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Heften" field="finishStaple" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Ringösen" field="finishEyelets" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Ableimen" field="finishGlue" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Bohren" field="finishDrill" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Perforieren" field="finishPerforate" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Nummerieren" field="finishNumber" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Kuvertieren" field="finishEnvelope" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Handarbeiten" field="finishManual" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Verpacken" field="finishPack" draft={draft} onDraftChange={onDraftChange} />
            </div>
            <DraftTextArea label="Arbeitsanweisung" field="finishingNotes" draft={draft} onDraftChange={onDraftChange} rows={2} />
            <DraftTextArea label="Zusatz" field="finishingAdditional" draft={draft} onDraftChange={onDraftChange} rows={2} />
          </section>

          <section className="pp-print-pocket-field-group">
            <h3>Auftrag / Daten / Kontrolle</h3>
            <div className="pp-print-pocket-check-grid-edit">
              <DraftCheckbox label="Neuauftrag" field="orderNew" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Nachdruck unverändert" field="reprintSame" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Nachdruck mit Änderung" field="reprintChanged" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Daten gestellt" field="dataSupplied" draft={draft} onDraftChange={onDraftChange} />
            </div>
            <div>
              <DraftTextField label="Datenstatus" field="dataStatus" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Freigabe" field="approvalStatus" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Datei" field="fileName" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Status" field="statusLabel" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Checkliste" field="checklistLabel" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Operator" field="operator" draft={draft} onDraftChange={onDraftChange} />
            </div>
          </section>

          <section className="pp-print-pocket-field-group">
            <h3>Fremdarbeit / Dokumente / Signatur</h3>
            <div>
              <DraftTextField label="Fremdarbeit" field="foreignWork" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Muster" field="samples" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Dokumente" field="documents" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Rechnung" field="invoiceNote" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Datum" field="controlDate" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Druck Signatur" field="signaturePrint" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="WV Signatur" field="signatureFinishing" draft={draft} onDraftChange={onDraftChange} />
              <DraftTextField label="Versand Signatur" field="signatureShipping" draft={draft} onDraftChange={onDraftChange} />
            </div>
            <div className="pp-print-pocket-check-grid-edit">
              <DraftCheckbox label="Muster in Tasche" field="sampleInPocket" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Lieferschein" field="deliveryNoteDocument" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Papierrechnung" field="paperInvoiceDocument" draft={draft} onDraftChange={onDraftChange} />
              <DraftCheckbox label="Lieferantenrechnung" field="supplierInvoiceDocument" draft={draft} onDraftChange={onDraftChange} />
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}


type PrintSheetIconName =
  | "stack"
  | "format"
  | "cmyk"
  | "paper"
  | "printer"
  | "dots"
  | "grid"
  | "customer"
  | "document"
  | "layers"
  | "scissors"
  | "truck"
  | "shield";

function PrintPilotSheetLogo() {
  return <img className="pp-modern-print-logo-img" src={printPilotLogoImage} alt="PrintPilot" />;
}

function PrintSheetIcon({ name }: { name: PrintSheetIconName }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 32 32",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
    className: "pp-modern-print-svg-icon",
  };

  switch (name) {
    case "stack":
      return (
        <svg {...common}>
          <path d="M16 5.2 5.2 10.7 16 16.1l10.8-5.4L16 5.2Z" />
          <path d="M6 15.9 16 20.9l10-5" />
          <path d="M6 21 16 26l10-5" />
        </svg>
      );
    case "format":
      return (
        <svg {...common}>
          <path d="M19.9 5.4h6.8c.7 0 1.2.5 1.2 1.2v18.8c0 .7-.5 1.2-1.2 1.2h-6.8c-.7 0-1.2-.5-1.2-1.2V6.6c0-.7.5-1.2 1.2-1.2Z" />
          <path d="M10.1 5.7v20.6" />
          <path d="M6.9 22.5 10.1 26.3l3.2-3.8" />
        </svg>
      );
    case "cmyk":
      return (
        <svg {...common} className="pp-modern-print-svg-icon pp-modern-print-svg-icon--cmyk">
          <path className="c" d="M8.1 5.2c3 3.9 4.5 6.8 4.5 9a4.5 4.5 0 0 1-9 0c0-2.2 1.5-5.1 4.5-9Z" />
          <path className="m" d="M16 3.9c3.1 4 4.6 7 4.6 9.1a4.6 4.6 0 1 1-9.2 0c0-2.1 1.5-5.1 4.6-9.1Z" />
          <path className="y" d="M23.9 5.2c3 3.9 4.5 6.8 4.5 9a4.5 4.5 0 0 1-9 0c0-2.2 1.5-5.1 4.5-9Z" />
          <path className="k" d="M16 14.1c3.1 4 4.6 6.9 4.6 9.1a4.6 4.6 0 1 1-9.2 0c0-2.2 1.5-5.1 4.6-9.1Z" />
        </svg>
      );
    case "paper":
      return (
        <svg {...common}>
          <path d="M9.2 4.8h10.2l5.4 5.4v17H9.2V4.8Z" />
          <path d="M19.4 4.8v5.4h5.4" />
        </svg>
      );
    case "printer":
      return (
        <svg {...common}>
          <path d="M10 11V5.4h12V11" />
          <path d="M7.4 22.5H5.8c-1.1 0-2-.9-2-2v-6.1c0-1.7 1.4-3.1 3.1-3.1h18.2c1.7 0 3.1 1.4 3.1 3.1v6.1c0 1.1-.9 2-2 2h-1.6" />
          <path d="M9.2 18.4h13.6v8.2H9.2v-8.2Z" />
          <path d="M10.9 21.1h10.2" />
        </svg>
      );
    case "dots":
      return (
        <svg {...common}>
          <circle cx="8.5" cy="11.2" r="2.25" />
          <circle className="dot-filled" cx="16" cy="7.4" r="2.7" />
          <circle cx="23.5" cy="11.2" r="2.25" />
          <circle cx="8.5" cy="20.8" r="2.25" />
          <circle cx="16" cy="24.6" r="2.25" />
          <circle cx="23.5" cy="20.8" r="2.25" />
        </svg>
      );
    case "grid":
      return (
        <svg {...common}>
          <path d="M5.6 5.6h20.8v20.8H5.6V5.6Z" />
          <path d="M12.5 5.6v20.8M19.5 5.6v20.8M5.6 12.5h20.8M5.6 19.5h20.8" />
        </svg>
      );
    case "customer":
      return (
        <svg {...common}>
          <path d="M16 15.8a4.9 4.9 0 1 0 0-9.8 4.9 4.9 0 0 0 0 9.8Z" />
          <path d="M6.8 27c1.4-5.4 4.5-8 9.2-8 4.8 0 7.8 2.6 9.2 8" />
        </svg>
      );
    case "document":
      return (
        <svg {...common}>
          <path d="M9 4.7h10.2l5.5 5.5v17.1H9V4.7Z" />
          <path d="M19.2 4.7v5.5h5.5" />
          <path d="M12.2 15.3h7.6M12.2 20h7.6" />
        </svg>
      );
    case "layers":
      return (
        <svg {...common}>
          <path d="M16 5.3 5.2 10.6 16 16l10.8-5.4L16 5.3Z" />
          <path d="M5.2 16.4 16 21.8l10.8-5.4" />
          <path d="M5.2 22.1 16 27.5l10.8-5.4" />
        </svg>
      );
    case "scissors":
      return (
        <svg {...common}>
          <circle cx="8.4" cy="8.4" r="3" />
          <circle cx="8.4" cy="23.6" r="3" />
          <path d="M11.2 10 26.4 22.8" />
          <path d="M11.2 22 26.4 9.2" />
          <path d="M15.4 16h2.2" />
        </svg>
      );
    case "truck":
      return (
        <svg {...common}>
          <path d="M4.5 9.5h16.2v10.8H4.5V9.5Z" />
          <path d="M20.7 13h4.2l2.6 3.5v3.8h-6.8" />
          <circle cx="9.2" cy="22.5" r="2.35" />
          <circle cx="24.2" cy="22.5" r="2.35" />
          <path d="M11.6 22.5h10.2" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M16 4.4 25.8 8v7.3c0 6.1-3.7 10.4-9.8 12.3-6.1-1.9-9.8-6.2-9.8-12.3V8L16 4.4Z" />
          <path d="m11.4 16 3.2 3.1 6.2-6.6" />
        </svg>
      );
    default:
      return null;
  }
}
function PrintModernFact({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="pp-modern-print-fact">
      <span className="pp-modern-print-fact__icon">{icon}</span>
      <span className="pp-modern-print-fact__text">
        <small>{label}</small>
        <strong>{value}</strong>
      </span>
    </div>
  );
}

function PrintModernLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <p className="pp-modern-print-line">
      <span>{label}</span>
      <strong>{value}</strong>
    </p>
  );
}

function PrintModernCheck({
  label,
  checked = false,
}: {
  label: string;
  checked?: boolean;
}) {
  return (
    <span className={checked ? "pp-modern-print-check is-checked" : "pp-modern-print-check"}>
      <b>{checked ? "☑" : "☐"}</b>
      {label}
    </span>
  );
}

function getPrintColorSummary(frontColors: string, backColors: string) {
  const front = frontColors.trim();
  const back = backColors.trim();
  const frontLower = front.toLowerCase();
  const backLower = back.toLowerCase();

  const isFourColor = (value: string) =>
    value.toLowerCase().includes("4-farbig") && value.toLowerCase().includes("cmyk");
  const isBlack = (value: string) => value.toLowerCase().includes("schwarz");

  if (isFourColor(front) && isFourColor(back)) {
    return "4/4 farbig CMYK";
  }

  if (isBlack(front) && isBlack(back)) {
    return "1/1 farbig Schwarz";
  }

  if (front && back && frontLower === backLower) {
    return front.replace("-farbig", " farbig");
  }

  if (!back || backLower === "prüfen") {
    return front.replace("-farbig", " farbig");
  }

  return `${front.replace("-farbig", " farbig")} / ${back.replace("-farbig", " farbig")}`;
}

function PrintOrderPocketSheet({
  order,
  draft,
}: {
  order: PrintPilotOrder;
  actionState: PocketActionState;
  draft: PrintPocketDraft;
}) {
  const productionFacts = [
    { icon: <PrintSheetIcon name="stack" />, label: "Auflage", value: draft.quantity },
    { icon: <PrintSheetIcon name="format" />, label: "Endformat", value: draft.finalFormat },
    { icon: <PrintSheetIcon name="cmyk" />, label: "Farbigkeit", value: getPrintColorSummary(draft.frontColors, draft.backColors) },
    { icon: <PrintSheetIcon name="paper" />, label: "Material", value: draft.paper },
    { icon: <PrintSheetIcon name="printer" />, label: "Maschine", value: order.machine },
    { icon: <PrintSheetIcon name="dots" />, label: "Druckart", value: draft.printType },
    { icon: <PrintSheetIcon name="grid" />, label: "Nutzen", value: draft.impositionLabel },
  ];

  const finishingTasks = [
    { label: "Schneiden", checked: draft.finishCut },
    { label: "Falzen", checked: draft.finishFold },
    { label: "Rillen", checked: draft.finishCrease },
    { label: "Heften", checked: draft.finishStaple },
    { label: "Ringösen", checked: draft.finishEyelets },
    { label: "Ableimen", checked: draft.finishGlue },
    { label: "Bohren", checked: draft.finishDrill },
    { label: "Perforieren", checked: draft.finishPerforate },
    { label: "Nummerieren", checked: draft.finishNumber },
    { label: "Kuvertieren", checked: draft.finishEnvelope },
    { label: "Handarbeiten", checked: draft.finishManual },
    { label: "Verpacken", checked: draft.finishPack },
  ];

  const activeFinishingTasks = finishingTasks.filter((task) => task.checked);

  return (
    <article
      className="pp-print-order-pocket pp-print-order-pocket--form pp-print-order-pocket--modern"
      aria-label="Druckbare Auftragstasche"
    >
      <header className="pp-modern-print-header">
        <div className="pp-modern-print-brand-row">
          <div className="pp-modern-print-brand">
            <PrintPilotSheetLogo />
            <em>Auftragstasche</em>
          </div>
          <div className="pp-modern-print-scan">
            <span>
              <b>Scannen</b>
              <small>für Details</small>
              <i aria-hidden="true" className="pp-modern-print-phone-icon">
                <svg viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4.25" y="1.25" width="7.5" height="17.5" rx="1.4" />
                  <path d="M6.7 3.2h2.6M7.65 16.7h.7" />
                </svg>
              </i>
            </span>
            <img src={orderQrCode} alt={`QR-Code für Auftrag ${order.id}`} />
          </div>
        </div>

        <div className="pp-modern-print-meta-row">
          <div className="pp-modern-print-meta pp-modern-print-meta--order">
            <span>Auftrag-Nr.</span>
            <strong>{order.id}</strong>
          </div>
          <div className="pp-modern-print-meta">
            <span>Produkt</span>
            <strong>{draft.jobTitle}</strong>
          </div>
          <div className="pp-modern-print-meta pp-modern-print-meta--delivery">
            <span>Liefertermin</span>
            <strong className="pp-modern-print-delivery-date">
              <span>{draft.deliveryDate}</span>
              <em> · {draft.deliveryMeta}</em>
            </strong>
          </div>
          <div className="pp-modern-print-status">
            <span>Status</span>
            <strong>{draft.statusLabel}</strong>
          </div>
        </div>
      </header>

      <section className="pp-modern-print-core" aria-label="Produktionsdaten">
        <header>
          <span className="pp-modern-print-section-icon"><PrintSheetIcon name="document" /></span>
          <div>
            <h2>Produktionsdaten</h2>
            <p>{draft.quantity} · {draft.finalFormat} · {draft.printType}</p>
          </div>
        </header>
        <div className="pp-modern-print-fact-grid">
          {productionFacts.map((fact) => (
            <PrintModernFact key={fact.label} icon={fact.icon} label={fact.label} value={fact.value} />
          ))}
        </div>
      </section>

      <section className="pp-modern-print-panel-grid pp-modern-print-panel-grid--top">
        <div className="pp-modern-print-panel">
          <h3><PrintSheetIcon name="customer" /> Kunde</h3>
          <PrintModernLine label="Kunde" value={draft.customerName} />
          <PrintModernLine label="Ansprechpartner" value={draft.customerContact} />
          <PrintModernLine label="Telefon" value={draft.customerPhone} />
          <PrintModernLine label="Adresse" value={draft.customerAddress} />
        </div>

        <div className="pp-modern-print-panel">
          <h3><PrintSheetIcon name="document" /> Druckdaten</h3>
          <PrintModernLine label="Datei" value={draft.fileName} />
          <div className="pp-modern-print-state-row">
            <span className="is-ok"><i aria-hidden="true">✓</i>{draft.dataStatus}</span>
            <span className="is-ok"><i aria-hidden="true">✓</i>{draft.approvalStatus}</span>
          </div>
          <PrintModernLine label="Korrektur bis" value={draft.correctionUntil} />
          <PrintModernLine label="Besonderheiten" value={draft.specialNotes} />
        </div>
      </section>

      <section className="pp-modern-print-panel-grid pp-modern-print-panel-grid--middle">
        <div className="pp-modern-print-panel">
          <h3><PrintSheetIcon name="layers" /> Material / Druckbogen</h3>
          <PrintModernLine label="Material" value={draft.paper} />
          <PrintModernLine label="Rohbogen" value={draft.rawFormat} />
          <PrintModernLine label="Druckbogen" value={draft.printFormat} />
          <PrintModernLine label="Zuschuss" value={draft.wasteSheets} />
          <div className="pp-modern-print-check-row">
            <PrintModernCheck label="bestellt" checked={draft.paperOrdered} />
            <PrintModernCheck label="am Lager" checked={draft.paperInStock} />
            <PrintModernCheck label="gestellt" checked={draft.paperSupplied} />
            <PrintModernCheck label="Lieferant" checked={draft.paperSupplier} />
          </div>
        </div>

        <div className="pp-modern-print-panel pp-modern-print-panel--finishing">
          <h3><PrintSheetIcon name="scissors" /> Weiterverarbeitung</h3>
          <div className="pp-modern-print-tags">
            {activeFinishingTasks.length > 0 ? (
              activeFinishingTasks.map((task) => <strong key={task.label}>{task.label}</strong>)
            ) : (
              <strong>keine aktive Weiterverarbeitung</strong>
            )}
          </div>
          <PrintModernLine label="Arbeitsanweisung" value={draft.finishingNotes} />
          {draft.finishingAdditional.trim() ? (
            <PrintModernLine label="Zusatz" value={draft.finishingAdditional} />
          ) : null}
        </div>
      </section>

      <section className="pp-modern-print-panel-grid pp-modern-print-panel-grid--bottom">
        <div className="pp-modern-print-panel">
          <h3><PrintSheetIcon name="truck" /> Lieferung / Versand</h3>
          <PrintModernLine label="Lieferadresse" value={draft.deliveryAddress} />
          <PrintModernLine label="Liefertermin" value={`${draft.deliveryDate} · ${draft.deliveryMeta}`} />
          <PrintModernLine label="Versandart" value={draft.shippingMethod} />
          <PrintModernLine label="Verpackung" value={draft.packaging} />
          <PrintModernLine label="Teillieferung" value={draft.partialDeliveries} />
          <div className="pp-modern-print-check-row pp-modern-print-check-row--shipping">
            <PrintModernCheck label="DPD" checked={draft.shipDpd} />
            <PrintModernCheck label="DPD-Express" checked={draft.shipDpdExpress} />
            <PrintModernCheck label="Post" checked={draft.shipPost} />
            <PrintModernCheck label="Spedition" checked={draft.shipFreight} />
            <PrintModernCheck label="Abholung" checked={draft.shipPickup} />
            <PrintModernCheck label="Fahrer" checked={draft.shipDriver} />
          </div>
        </div>

        <div className="pp-modern-print-panel pp-modern-print-panel--control">
          <h3><PrintSheetIcon name="shield" /> Kontrolle</h3>
          <PrintModernLine label="Checkliste" value={draft.checklistLabel} />
          <div className="pp-modern-print-check-list pp-modern-print-check-list--control-only">
            <PrintModernCheck label="Farbigkeit / Maßhaltigkeit geprüft" />
            <PrintModernCheck label="Weiterverarbeitung geprüft" />
            <PrintModernCheck label="Menge / Stückzahl geprüft" />
            <PrintModernCheck label="Druckdaten / Freigabe geprüft" />
          </div>
        </div>
      </section>

      <section className="pp-modern-print-document-row">
        <PrintModernCheck label="Muster in Tasche" checked={draft.sampleInPocket} />
        <PrintModernCheck label="Lieferschein" checked={draft.deliveryNoteDocument} />
        <PrintModernCheck label="Papierrechnung" checked={draft.paperInvoiceDocument} />
        <PrintModernCheck label="Lieferantenrechnung" checked={draft.supplierInvoiceDocument} />
        <span>{draft.controlDate}</span>
        <span>{draft.operator}</span>
      </section>

      <section className="pp-modern-print-signatures">
        <div>
          <strong>{draft.signaturePrint}</strong>
          <span>Datum, Uhrzeit</span>
          <span>Name, Unterschrift</span>
        </div>
        <div>
          <strong>{draft.signatureFinishing}</strong>
          <span>Datum, Uhrzeit</span>
          <span>Name, Unterschrift</span>
        </div>
        <div>
          <strong>{draft.signatureShipping}</strong>
          <span>Datum, Uhrzeit</span>
          <span>Name, Unterschrift</span>
        </div>
      </section>

      <footer className="pp-modern-print-footer">
        <span>Erstellt am {draft.controlDate} durch PrintPilot</span>
        <span>Seite 1 von 1</span>
      </footer>
    </article>
  );
}

type MachineType =
  | "digital-color"
  | "digital-mono"
  | "wide-format"
  | "inkjet"
  | "finishing";

type MachineCardData = {
  id: string;
  name: string;
  type: MachineType;
  typeLabel: string;
  status: "Verfügbar" | "Belegt" | "Wartung";
  location: string;
  specs: string[];
  service: string;
  image?: string;
};

const machineFallbacks: Record<MachineType, string> = {
  "digital-color": digitalColorMachine,
  "digital-mono": digitalMonoMachine,
  "wide-format": wideFormatMachine,
  inkjet: inkjetMachine,
  finishing: finishingMachine,
};

type PocketIconName =
  | "customer"
  | "contact"
  | "date"
  | "delivery"
  | "product"
  | "print-data"
  | "timeline"
  | "checklist"
  | "imposition"
  | "preview"
  | "finishing"
  | "files"
  | "notes"
  | "machine"
  | "history";

function PocketIcon({ name }: { name: PocketIconName }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
    className: "pp-pocket-icon",
  };

  switch (name) {
    case "customer":
      return (
        <svg {...common}>
          <path d="M6 18.5V7.2L12 4l6 3.2v11.3" />
          <path d="M9 18.5v-5h6v5" />
          <path d="M9 9h.01M12 9h.01M15 9h.01" />
        </svg>
      );
    case "contact":
      return (
        <svg {...common}>
          <path d="M12 12.2a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z" />
          <path d="M5.5 19.2c.9-3.1 3.2-4.7 6.5-4.7s5.6 1.6 6.5 4.7" />
        </svg>
      );
    case "date":
      return (
        <svg {...common}>
          <path d="M6.5 5.5h11A1.5 1.5 0 0 1 19 7v10.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5V7a1.5 1.5 0 0 1 1.5-1.5Z" />
          <path d="M8 4v3M16 4v3M5 9h14" />
          <path d="M8.5 12.5h3v3h-3z" />
        </svg>
      );
    case "delivery":
      return (
        <svg {...common}>
          <path d="M4.8 7h10.7v9.5H4.8z" />
          <path d="M15.5 10h2.6l1.1 2v4.5h-3.7" />
          <path d="M7.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM16.8 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
        </svg>
      );
    case "product":
      return (
        <svg {...common}>
          <path d="M6.2 5.2h8.2l3.4 3.4v10.2H6.2z" />
          <path d="M14.4 5.2v3.4h3.4" />
          <path d="M8.8 12.2h6.4M8.8 15h4.9" />
        </svg>
      );
    case "print-data":
      return (
        <svg {...common}>
          <path d="M7 8V4.8h10V8" />
          <path d="M6.2 16.2H5a1.4 1.4 0 0 1-1.4-1.4v-4.2A1.6 1.6 0 0 1 5.2 9h13.6a1.6 1.6 0 0 1 1.6 1.6v4.2a1.4 1.4 0 0 1-1.4 1.4h-1.2" />
          <path d="M7.3 13.8h9.4v5.4H7.3z" />
          <path d="M17.2 11.6h.01" />
        </svg>
      );
    case "timeline":
      return (
        <svg {...common}>
          <path d="M7 5.5h11" />
          <path d="M7 12h11" />
          <path d="M7 18.5h11" />
          <path d="M4 5.5h.01M4 12h.01M4 18.5h.01" />
        </svg>
      );
    case "checklist":
      return (
        <svg {...common}>
          <path d="M6.5 5h11A1.5 1.5 0 0 1 19 6.5v11A1.5 1.5 0 0 1 17.5 19h-11A1.5 1.5 0 0 1 5 17.5v-11A1.5 1.5 0 0 1 6.5 5Z" />
          <path d="m8.5 12 2 2 5-5" />
        </svg>
      );
    case "imposition":
      return (
        <svg {...common}>
          <path d="M4.8 6h14.4v12H4.8z" />
          <path d="M9.6 6v12M14.4 6v12M4.8 12h14.4" />
        </svg>
      );
    case "preview":
      return (
        <svg {...common}>
          <path d="M4 12s2.7-5 8-5 8 5 8 5-2.7 5-8 5-8-5-8-5Z" />
          <path d="M12 14.7a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4Z" />
        </svg>
      );
    case "finishing":
      return (
        <svg {...common}>
          <path d="M5 6.5h14" />
          <path d="M7 6.5v10.2A1.3 1.3 0 0 0 8.3 18h7.4a1.3 1.3 0 0 0 1.3-1.3V6.5" />
          <path d="M9.2 10.2h5.6M9.2 13h5.6" />
        </svg>
      );
    case "files":
      return (
        <svg {...common}>
          <path d="M6 4.8h8l4 4v10.4H6z" />
          <path d="M14 4.8v4h4" />
          <path d="M8.8 12.2h6.4M8.8 15h5" />
        </svg>
      );
    case "notes":
      return (
        <svg {...common}>
          <path d="M6.2 5h11.6v14H6.2z" />
          <path d="M9 8.5h6M9 12h6M9 15.5h3.8" />
        </svg>
      );
    case "machine":
      return (
        <svg {...common}>
          <path d="M5 8h14v9H5z" />
          <path d="M8 5h8v3H8z" />
          <path d="M8 17v2M16 17v2" />
          <path d="M8.5 12h7" />
        </svg>
      );
    case "history":
      return (
        <svg {...common}>
          <path d="M6.2 7.7A7.5 7.5 0 1 1 5 12" />
          <path d="M6.2 4.8v2.9H9" />
          <path d="M12 8v4.2l3 1.8" />
        </svg>
      );
    default:
      return null;
  }
}

type CheckStatus = "done" | "open" | "required";
type PocketStatus = PrintPilotOrder["production"];
type PocketChecklistSection = PrintPilotOrder["checklist"][number];
type PocketFinishingStep = PrintPilotOrder["finishing"][number];

type PocketActionState = {
  data: PocketStatus;
  approval: PocketStatus;
  production: PocketStatus;
  checklist: PocketChecklistSection[];
  finishing: PocketFinishingStep[];
};

const productionStatusCycle: PocketStatus[] = [
  { label: "Geplant", tone: "blue" },
  { label: "Produktion", tone: "orange" },
  { label: "Weiterverarbeitung", tone: "orange" },
  { label: "Versandbereit", tone: "green" },
];

function cloneChecklist(
  checklist: PrintPilotOrder["checklist"],
): PocketChecklistSection[] {
  return checklist.map((section) => ({
    ...section,
    items: section.items.map((item) => ({ ...item })),
  }));
}

function cloneFinishing(
  finishing: PrintPilotOrder["finishing"],
): PocketFinishingStep[] {
  return finishing.map((step) => ({
    ...step,
    status: { ...step.status },
  }));
}

function createPocketActionState(order: PrintPilotOrder): PocketActionState {
  return {
    data: { ...order.data },
    approval: { ...order.approval },
    production: { ...order.production },
    checklist: cloneChecklist(order.checklist),
    finishing: cloneFinishing(order.finishing),
  };
}

function createOrderFromActionState(
  order: PrintPilotOrder,
  actionState: PocketActionState,
): PrintPilotOrder {
  return {
    ...order,
    data: { ...actionState.data },
    approval: { ...actionState.approval },
    production: { ...actionState.production },
    checklist: cloneChecklist(actionState.checklist),
    finishing: cloneFinishing(actionState.finishing),
  };
}

function getNextProductionStatus(status: PocketStatus): PocketStatus {
  const currentIndex = productionStatusCycle.findIndex(
    (item) => item.label === status.label,
  );
  const nextIndex =
    currentIndex === -1 ? 1 : (currentIndex + 1) % productionStatusCycle.length;
  return productionStatusCycle[nextIndex];
}

function getNextChecklistStatus(status: CheckStatus): CheckStatus {
  if (status === "done") return "open";
  return "done";
}

function getNextFinishingStatus(step: PocketFinishingStep): PocketStatus {
  if (step.status.label === "Nicht notwendig") return step.status;
  if (step.status.label === "Erledigt")
    return { label: "Geplant", tone: "orange" };
  return { label: "Erledigt", tone: "green" };
}

function getChecklistSectionStats(section: PocketChecklistSection) {
  const done = section.items.filter((item) => item.status === "done").length;
  return { done, total: section.items.length };
}

function getChecklistSummary(checklist: PocketChecklistSection[]) {
  const allItems = checklist.flatMap((section) => section.items);
  const done = allItems.filter((item) => item.status === "done").length;
  const requiredOpen = allItems.filter(
    (item) => item.status === "required",
  ).length;

  return {
    done,
    total: allItems.length,
    requiredOpen,
  };
}

type PocketProcessStep = {
  key: string;
  label: string;
  value: string;
  tone: PocketStatus["tone"];
  isActive?: boolean;
};

function getCurrentProductionLabel(status: PocketStatus) {
  switch (status.label) {
    case "Produktion":
      return "Im Druck";
    case "Weiterverarbeitung":
      return "In Weiterverarbeitung";
    case "Versandbereit":
      return "Versandbereit";
    case "Geplant":
      return "Geplant";
    default:
      return status.label;
  }
}

function getProcessStepState(
  productionStatus: PocketStatus,
  phase: "print" | "finishing" | "shipping",
): PocketProcessStep {
  const currentLabel = productionStatus.label;

  if (phase === "print") {
    if (currentLabel === "Produktion") {
      return {
        key: "print",
        label: "Druck",
        value: "läuft",
        tone: "orange",
        isActive: true,
      };
    }
    if (
      currentLabel === "Weiterverarbeitung" ||
      currentLabel === "Versandbereit"
    ) {
      return { key: "print", label: "Druck", value: "erledigt", tone: "green" };
    }
    return { key: "print", label: "Druck", value: "geplant", tone: "blue" };
  }

  if (phase === "finishing") {
    if (currentLabel === "Weiterverarbeitung") {
      return {
        key: "finishing",
        label: "Weiterverarbeitung",
        value: "läuft",
        tone: "orange",
        isActive: true,
      };
    }
    if (currentLabel === "Versandbereit") {
      return {
        key: "finishing",
        label: "Weiterverarbeitung",
        value: "erledigt",
        tone: "green",
      };
    }
    return {
      key: "finishing",
      label: "Weiterverarbeitung",
      value: "geplant",
      tone: "gray",
    };
  }

  if (currentLabel === "Versandbereit") {
    return {
      key: "shipping",
      label: "Versand",
      value: "bereit",
      tone: "green",
      isActive: true,
    };
  }

  return { key: "shipping", label: "Versand", value: "offen", tone: "gray" };
}

function getProcessFlowSteps(
  actionState: PocketActionState,
): PocketProcessStep[] {
  return [
    {
      key: "data",
      label: "Daten",
      value: actionState.data.label,
      tone: actionState.data.tone,
      isActive: actionState.data.label !== "Daten geprüft",
    },
    {
      key: "approval",
      label: "Freigabe",
      value: actionState.approval.label,
      tone: actionState.approval.tone,
      isActive: actionState.approval.label !== "Freigabe erteilt",
    },
    getProcessStepState(actionState.production, "print"),
    getProcessStepState(actionState.production, "finishing"),
    getProcessStepState(actionState.production, "shipping"),
  ];
}

function ProcessFlow({
  steps,
  interactive = false,
  onDataClick,
  onApprovalClick,
  onProductionClick,
}: {
  steps: PocketProcessStep[];
  interactive?: boolean;
  onDataClick?: () => void;
  onApprovalClick?: () => void;
  onProductionClick?: () => void;
}) {
  const getClickHandler = (step: PocketProcessStep) => {
    if (!interactive) return undefined;
    if (step.key === "data") return onDataClick;
    if (step.key === "approval") return onApprovalClick;
    if (step.key === "print" || step.key === "finishing")
      return onProductionClick;
    return undefined;
  };

  return (
    <div className="pp-process-flow" role={interactive ? "group" : undefined}>
      {steps.map((step, index) => {
        const clickHandler = getClickHandler(step);
        const content = (
          <>
            <span>{step.label}</span>
            <b>{step.value}</b>
          </>
        );

        return (
          <div className="pp-process-flow__part" key={step.key}>
            {clickHandler ? (
              <button
                type="button"
                className={`pp-process-step pp-process-step--${step.tone} ${
                  step.isActive ? "pp-process-step--active" : ""
                }`}
                onClick={clickHandler}
              >
                {content}
              </button>
            ) : (
              <span
                className={`pp-process-step pp-process-step--${step.tone} ${
                  step.isActive ? "pp-process-step--active" : ""
                }`}
              >
                {content}
              </span>
            )}
            {index < steps.length - 1 ? (
              <span className="pp-process-separator" aria-hidden="true">
                ›
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function CheckItem({
  status,
  label,
  onToggle,
}: {
  status: CheckStatus;
  label: string;
  onToggle: () => void;
}) {
  const stateLabel =
    status === "done"
      ? "erledigt"
      : status === "required"
        ? "pflicht"
        : "offen";

  return (
    <button
      type="button"
      className={`pp-check-item pp-check-item--${status}`}
      aria-pressed={status === "done"}
      onClick={onToggle}
    >
      <span className="pp-check-box" aria-hidden="true">
        {status === "done" ? "✓" : ""}
      </span>
      <span className="pp-check-label">{label}</span>
      <small>{stateLabel}</small>
    </button>
  );
}

function TopInfoCard({
  icon,
  label,
  title,
  children,
}: {
  icon: ReactNode;
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="pp-top-info-card">
      <span className="pp-top-info-card__icon">{icon}</span>
      <div>
        <div className="pp-eyebrow">{label}</div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </article>
  );
}

function ProductCard({ order }: { order: PrintPilotOrder }) {
  const productHighlights = getProductHighlights(order);
  const productDetails = getProductDetails(order);
  return (
    <div className="pp-product-card">
      <div className="pp-product-hero pp-product-hero--with-preview">
        <div>
          <span>Produkt</span>
          <h3>{order.product}</h3>
          <p>{order.productDescription}</p>
        </div>
        <figure
          className={`pp-product-preview pp-product-preview--${order.preview.kind}`}
          aria-label={order.preview.imageAlt}
        >
          <img src={order.preview.imageSrc} alt="" />
          <figcaption>{order.preview.label}</figcaption>
        </figure>
      </div>

      <div className="pp-product-highlights">
        {productHighlights.map(([label, value]) => (
          <span key={label}>
            <small>{label}</small>
            <strong>{value}</strong>
          </span>
        ))}
      </div>

      <div className="pp-compact-data-list">
        {productDetails.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function PrintDataCard({
  order,
  dataStatus,
}: {
  order: PrintPilotOrder;
  dataStatus: PocketStatus;
}) {
  const printStatusItems = getPrintStatusItems(order, dataStatus);
  const printSpecs = getPrintSpecs(order);
  return (
    <div className="pp-printdata-card">
      <div className="pp-printdata-file">
        <span className="pp-printdata-file__type">PDF</span>
        <div>
          <b>{order.preview.filename}</b>
          <small>
            {order.fileCategory} · {order.fileDate} · {order.fileTime} ·{" "}
            {order.fileSize}
          </small>
        </div>
      </div>

      <div className="pp-printdata-status">
        {printStatusItems.map((item) => (
          <span
            className={`pp-printdata-check pp-printdata-check--${item.tone}`}
            key={item.label}
          >
            <small>{item.label}</small>
            <strong>{item.value}</strong>
          </span>
        ))}
      </div>

      <div className="pp-compact-data-list pp-compact-data-list--print">
        {printSpecs.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScheduleCard({
  order,
  actionState,
}: {
  order: PrintPilotOrder;
  actionState: PocketActionState;
}) {
  const scheduleRows = getScheduleRows(order, actionState);
  return (
    <div className="pp-schedule-card">
      <div className="pp-schedule-summary">
        <span>
          <small>Start</small>
          <strong>
            {order.scheduleStart} · {order.scheduleStartTime}
          </strong>
        </span>
        <span>
          <small>Lieferung</small>
          <strong>
            {order.dueDate} · {order.dueMeta.replace(/^.*·\s*/, "")}
          </strong>
        </span>
      </div>

      <div className="pp-schedule-timeline">
        {scheduleRows.map((entry) => (
          <article
            className={`pp-schedule-step pp-schedule-step--${entry.tone}`}
            key={entry.label}
          >
            <span className="pp-schedule-marker" aria-hidden="true"></span>
            <div className="pp-schedule-step__main">
              <strong>{entry.label}</strong>
              <small>{entry.state}</small>
            </div>
            <time>
              {entry.date}
              <b>{entry.time}</b>
            </time>
          </article>
        ))}
      </div>
    </div>
  );
}

function getImpositionCellCount(order: PrintPilotOrder) {
  const { imposition } = getOrderProductionData(order);
  return Math.max(1, Math.min(imposition.layout.usedSlots, 24));
}

function ImpositionPlanCard({ order }: { order: PrintPilotOrder }) {
  const impositionStats = getImpositionStats(order);
  const impositionDetails = getImpositionDetails(order);
  const impositionLegend = getImpositionLegend(order);
  const productionData = getOrderProductionData(order);
  const cellCount = getImpositionCellCount(order);
  return (
    <div
      className={`pp-imposition-card pp-imposition-card--${order.preview.kind}`}
    >
      <div className="pp-imposition-stats">
        {impositionStats.map(([label, value]) => (
          <span key={label}>
            <small>{label}</small>
            <strong>{value}</strong>
          </span>
        ))}
      </div>

      <div
        className="pp-imposition-sheet"
        aria-label={`Nutzenplan ${productionData.imposition.label} auf ${productionData.imposition.sheet.name}`}
      >
        {Array.from({ length: cellCount }, (_, index) => (
          <span className="pp-imposition-tile" key={index}>
            <img src={order.preview.imageSrc} alt="" />
            <b>{index + 1}</b>
          </span>
        ))}
      </div>

      <div className="pp-imposition-details">
        {impositionDetails.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div
        className="pp-imposition-legend"
        aria-label="Technische Nutzenplan-Legende"
      >
        {impositionLegend.map(([label, value]) => (
          <span key={label}>
            <small>{label}</small>
            <strong>{value}</strong>
          </span>
        ))}
        <em>{productionData.imposition.previewNote}</em>
      </div>
    </div>
  );
}

function PreviewCard({ order }: { order: PrintPilotOrder }) {
  const previewSpecs = getPreviewSpecs(order);
  const productionData = getOrderProductionData(order);
  return (
    <div className="pp-preview-card pp-preview-card--asset">
      <div
        className={`pp-preview-stage pp-preview-stage--asset pp-preview-stage--${order.preview.kind}`}
        aria-label={order.preview.imageAlt}
      >
        <div className="pp-preview-asset-frame">
          <span className="pp-preview-mark pp-preview-mark--tl"></span>
          <span className="pp-preview-mark pp-preview-mark--tr"></span>
          <span className="pp-preview-mark pp-preview-mark--bl"></span>
          <span className="pp-preview-mark pp-preview-mark--br"></span>
          <img src={order.preview.imageSrc} alt="" />
        </div>
      </div>

      <div className="pp-preview-meta">
        <b>
          {productionData.files.original?.filename ?? order.preview.filename}
        </b>
        <span>
          {productionData.product.label} · {productionData.product.colorMode} ·{" "}
          {order.preview.meta}
        </span>
      </div>

      <div className="pp-preview-specs">
        {previewSpecs.map(([label, value]) => (
          <span key={label}>
            <small>{label}</small>
            <strong>{value}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}

function MachineCard({ machine }: { machine: MachineCardData }) {
  const imageSource = machine.image ?? machineFallbacks[machine.type];

  return (
    <div className="pp-machine-card">
      <div
        className="pp-machine-visual"
        aria-label={`${machine.name} Illustration`}
      >
        <span className="pp-machine-visual__label">{machine.typeLabel}</span>
        <img src={imageSource} alt="" />
      </div>
      <div className="pp-machine-details">
        <div className="pp-machine-details__head">
          <span>Ausgewählte Maschine</span>
          <b>{machine.name}</b>
          <small>
            {machine.typeLabel} · {machine.location}
          </small>
          <StatusPill tone="green">{machine.status}</StatusPill>
        </div>
        <div className="pp-machine-specs">
          {machine.specs.map((spec) => (
            <span key={spec}>{spec}</span>
          ))}
        </div>
        <p className="pp-machine-service">Letzter Service: {machine.service}</p>
      </div>
    </div>
  );
}

export function OrderPocketPage({
  order,
  onOrderChange,
  onOrderReset,
}: {
  order: PrintPilotOrder;
  onOrderChange?: (order: PrintPilotOrder) => void;
  onOrderReset?: () => void;
}) {
  const [localActionState, setLocalActionState] = useState<PocketActionState>(
    () => createPocketActionState(order),
  );
  const [activeView, setActiveView] = useState<OrderPocketView>("details");
  const [printPocketDraft, setPrintPocketDraft] = useState<PrintPocketDraft>(
    () => createPrintPocketDraft(order),
  );

  useEffect(() => {
    setLocalActionState(createPocketActionState(order));
    setPrintPocketDraft(createPrintPocketDraft(order));
  }, [order]);

  const hasCentralOrderState = typeof onOrderChange === "function";
  const centralActionState = useMemo(
    () => createPocketActionState(order),
    [order],
  );
  const actionState = hasCentralOrderState
    ? centralActionState
    : localActionState;

  const files = useMemo(() => getFiles(order), [order]);
  const noteRows = useMemo(() => getNoteRows(order), [order]);
  const checklistSummary = getChecklistSummary(actionState.checklist);
  const processSteps = getProcessFlowSteps(actionState);
  const currentProductionLabel = getCurrentProductionLabel(
    actionState.production,
  );
  const selectedMachine: MachineCardData = {
    id: order.machine.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name: order.machine,
    type: order.machineType,
    typeLabel: order.machineTypeLabel,
    status: "Verfügbar",
    location: order.machineType === "wide-format" ? "Großformat" : "Halle 1",
    specs: [
      order.rawFormat,
      order.color,
      getOrderProductionData(order).imposition.label,
    ],
    service: "12.05.2026",
  };

  const applyActionState = (
    updater: (current: PocketActionState) => PocketActionState,
  ) => {
    const next = updater(actionState);
    setLocalActionState(next);
    onOrderChange?.(createOrderFromActionState(order, next));
  };

  const handleMarkDataChecked = () => {
    applyActionState((current) => ({
      ...current,
      data: { label: "Daten geprüft", tone: "green" },
    }));
  };

  const handleMarkApprovalGranted = () => {
    applyActionState((current) => ({
      ...current,
      approval: { label: "Freigabe erteilt", tone: "green" },
    }));
  };

  const handleCycleProduction = () => {
    applyActionState((current) => ({
      ...current,
      production: getNextProductionStatus(current.production),
    }));
  };

  const handleResetActions = () => {
    onOrderReset?.();
  };

  const handlePrintPocketDraftChange: PrintPocketDraftChange = (field, value) => {
    setPrintPocketDraft((current) => ({ ...current, [field]: value }));
  };

  const handleToggleChecklistItem = (
    sectionIndex: number,
    itemIndex: number,
  ) => {
    applyActionState((current) => ({
      ...current,
      checklist: current.checklist.map((section, currentSectionIndex) =>
        currentSectionIndex !== sectionIndex
          ? section
          : {
              ...section,
              items: section.items.map((item, currentItemIndex) =>
                currentItemIndex !== itemIndex
                  ? item
                  : { ...item, status: getNextChecklistStatus(item.status) },
              ),
            },
      ),
    }));
  };

  const handleToggleFinishingStep = (stepIndex: number) => {
    applyActionState((current) => ({
      ...current,
      finishing: current.finishing.map((step, currentStepIndex) =>
        currentStepIndex !== stepIndex
          ? step
          : { ...step, status: getNextFinishingStatus(step) },
      ),
    }));
  };

  return (
    <div className="pp-order-pocket">
      <header className="pp-master-header">
        <div className="pp-header-brand">
          <PrintPilotLogo className="pp-brand-logo" variant="app" />
        </div>

        <div className="pp-header-title-shape">
          <h1>AUFTRAGSDETAILS</h1>
          <p>Digitale Produktionsansicht</p>
        </div>

        <div className="pp-header-job" aria-label="Auftragsnummer">
          <span>Auftragsnummer</span>
          <strong>{order.id}</strong>
        </div>

        <div className="pp-header-qr">
          <img
            className="pp-qr-code"
            src={orderQrCode}
            alt={`QR-Code für Auftrag ${order.id}`}
          />
          <span className="pp-header-qr-text">
            <strong>Auftrag scannen</strong>
            <small>{order.id}</small>
            <em>in PrintPilot öffnen</em>
          </span>
        </div>
      </header>

      <nav className="pp-pocket-view-tabs" aria-label="Ansicht wählen">
        <button
          type="button"
          className={activeView === "details" ? "is-active" : ""}
          onClick={() => setActiveView("details")}
        >
          <span>Auftragsdetails</span>
          <small>digitale Produktionsansicht</small>
        </button>
        <button
          type="button"
          className={activeView === "print-pocket" ? "is-active" : ""}
          onClick={() => setActiveView("print-pocket")}
        >
          <span>Auftragstasche</span>
          <small>bearbeiten · drucken</small>
        </button>
      </nav>

      {activeView === "details" ? (
        <>
          <div className="pp-print-action-bar pp-print-action-bar--secondary">
            <button type="button" onClick={() => setActiveView("print-pocket")}>
              Auftragstasche bearbeiten
            </button>
            <span>
              Die druckbare Auftragstasche ist jetzt ein eigener
              Bearbeitungsbereich.
            </span>
          </div>

          <section className="pp-top-info-panel">
            <TopInfoCard
              icon={<PocketIcon name="customer" />}
              label="Kunde"
              title={order.customer}
            >
              {order.customerAddress.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
              <br />
              <a>Kundendetails anzeigen →</a>
            </TopInfoCard>
            <TopInfoCard
              icon={<PocketIcon name="contact" />}
              label="Ansprechpartner"
              title={order.contactName}
            >
              {order.contactPhone}
              <br />
              {order.contactEmail}
            </TopInfoCard>
            <TopInfoCard
              icon={<PocketIcon name="date" />}
              label="Auftragsdatum"
              title={order.orderDate}
            >
              &nbsp;
            </TopInfoCard>
            <TopInfoCard
              icon={<PocketIcon name="delivery" />}
              label="Liefertermin"
              title={order.dueDate}
            >
              {order.deliveryMeta}
            </TopInfoCard>
            <article className="pp-status-overview pp-status-overview--process pp-status-overview--interactive">
              <div className="pp-status-overview__head">
                <div>
                  <div className="pp-eyebrow">Interaktive Prozessleiste</div>
                  <strong>
                    Auftragsstatus und Prozessphasen direkt bearbeiten
                  </strong>
                  <p className="pp-status-overview__note">
                    UI-Vorschau ohne persistente Speicherung. Schritte
                    anklicken, um Datenprüfung, Freigabe und Produktionsphase
                    lokal zu ändern.
                  </p>
                </div>
                <div className="pp-status-current pp-status-current--with-reset">
                  <span>
                    <small>Aktuell</small>
                    <StatusPill tone={actionState.production.tone}>
                      {currentProductionLabel}
                    </StatusPill>
                  </span>
                  <button type="button" onClick={handleResetActions}>
                    Zurücksetzen
                  </button>
                </div>
              </div>
              <ProcessFlow
                steps={processSteps}
                interactive
                onDataClick={handleMarkDataChecked}
                onApprovalClick={handleMarkApprovalGranted}
                onProductionClick={handleCycleProduction}
              />
            </article>
          </section>

          <ProductionCoreStrip order={order} actionState={actionState} />

          <ProductionInfoAudit order={order} actionState={actionState} />

          <div className="pp-pocket-zones">
            <section
              className="pp-pocket-zone pp-pocket-zone--overview"
              aria-label="Auftragsdaten"
            >
              <div className="pp-pocket-zone__header">
                <h2>Auftragsdaten</h2>
                <span>Produkt · Druckdaten · Termine · Checkliste</span>
              </div>
              <div className="pp-pocket-zone-grid pp-pocket-zone-grid--overview">
                <Panel
                  title="Produkt"
                  icon={<PocketIcon name="product" />}
                  className="pp-product-panel"
                >
                  <ProductCard order={order} />
                </Panel>

                <Panel
                  title="Druckdaten"
                  icon={<PocketIcon name="print-data" />}
                  className="pp-printdata-panel"
                >
                  <PrintDataCard order={order} dataStatus={actionState.data} />
                </Panel>

                <Panel title="Termine" icon={<PocketIcon name="timeline" />}>
                  <ScheduleCard order={order} actionState={actionState} />
                </Panel>

                <Panel
                  title="Produktions-Checkliste"
                  icon={<PocketIcon name="checklist" />}
                  className="pp-checklist-panel"
                >
                  <div className="pp-checklist-summary">
                    <strong>
                      {checklistSummary.done} / {checklistSummary.total}{" "}
                      erledigt
                    </strong>
                    <span>
                      {checklistSummary.requiredOpen} Pflichtpunkt
                      {checklistSummary.requiredOpen === 1 ? "" : "e"} offen
                    </span>
                  </div>

                  <div className="pp-checklist-sections">
                    {actionState.checklist.map((section, sectionIndex) => {
                      const stats = getChecklistSectionStats(section);

                      return (
                        <section
                          className="pp-check-section"
                          key={section.title}
                        >
                          <div className="pp-check-section__head">
                            <h4>{section.title}</h4>
                            <span>
                              {stats.done}/{stats.total}
                            </span>
                          </div>
                          <div className="pp-check-section__items">
                            {section.items.map((item, itemIndex) => (
                              <CheckItem
                                key={item.label}
                                status={item.status}
                                label={item.label}
                                onToggle={() =>
                                  handleToggleChecklistItem(
                                    sectionIndex,
                                    itemIndex,
                                  )
                                }
                              />
                            ))}
                          </div>
                        </section>
                      );
                    })}
                  </div>

                  <div className="pp-signature">
                    <b>Geprüft von / am</b>
                    <span>Unterschrift</span>
                  </div>
                </Panel>
              </div>
            </section>

            <section
              className="pp-pocket-zone pp-pocket-zone--production"
              aria-label="Produktion"
            >
              <div className="pp-pocket-zone__header">
                <h2>Produktion</h2>
                <span>Nutzenplan · Vorschau · Weiterverarbeitung</span>
              </div>
              <div className="pp-pocket-zone-grid pp-pocket-zone-grid--production">
                <Panel
                  title="Nutzenplan"
                  icon={<PocketIcon name="imposition" />}
                  className="pp-imposition-panel"
                >
                  <ImpositionPlanCard order={order} />
                </Panel>

                <Panel
                  title="Vorschau"
                  icon={<PocketIcon name="preview" />}
                  className="pp-preview-panel"
                >
                  <PreviewCard order={order} />
                </Panel>

                <Panel
                  title="Weiterverarbeitung"
                  icon={<PocketIcon name="finishing" />}
                  className="pp-finishing-panel"
                >
                  <div className="pp-finishing-list">
                    {actionState.finishing.map((step, stepIndex) => (
                      <div key={step.label}>
                        <span>
                          <b>{step.label}</b>
                          <small>{step.note}</small>
                        </span>
                        <button
                          type="button"
                          className="pp-finishing-status-button"
                          disabled={step.status.label === "Nicht notwendig"}
                          onClick={() => handleToggleFinishingStep(stepIndex)}
                        >
                          <StatusPill tone={step.status.tone}>
                            {step.status.label}
                          </StatusPill>
                        </button>
                      </div>
                    ))}
                  </div>
                  <FinishingCatalog actionState={actionState} />
                </Panel>
              </div>
            </section>

            <section
              className="pp-pocket-zone pp-pocket-zone--support"
              aria-label="Auftragsbegleitung"
            >
              <div className="pp-pocket-zone__header">
                <h2>Auftragsbegleitung</h2>
                <span>Dateien · Notizen · Maschine · Verlauf</span>
              </div>
              <div className="pp-pocket-zone-grid pp-pocket-zone-grid--support">
                <Panel title="Dateien" icon={<PocketIcon name="files" />}>
                  <div className="pp-files-list">
                    {files.map(([type, name, category, date, time, size]) => (
                      <div className="pp-file-row" key={name}>
                        <span
                          className={`pp-file-type pp-file-type--${type.toLowerCase()}`}
                        >
                          {type}
                        </span>
                        <div className="pp-file-main">
                          <b>{name}</b>
                          <small>
                            {category} · {date} · {time}
                          </small>
                        </div>
                        <strong>{size}</strong>
                      </div>
                    ))}
                  </div>
                  <a className="pp-card-link">
                    Alle Dateien im Auftrag anzeigen →
                  </a>
                </Panel>

                <Panel title="Notizen" icon={<PocketIcon name="notes" />}>
                  <div className="pp-activity-list pp-activity-list--notes">
                    {noteRows.map((note) => (
                      <article className="pp-activity-item" key={note.label}>
                        <span
                          className={`pp-activity-dot pp-activity-dot--${note.tone}`}
                        ></span>
                        <div>
                          <strong>{note.label}</strong>
                          <p>{note.text}</p>
                          <small>{note.meta}</small>
                        </div>
                      </article>
                    ))}
                  </div>
                </Panel>

                <Panel title="Maschine" icon={<PocketIcon name="machine" />}>
                  <MachineCard machine={selectedMachine} />
                  <a className="pp-card-link">Maschinendetails anzeigen →</a>
                </Panel>

                <Panel
                  title="Kommentare / Verlauf"
                  icon={<PocketIcon name="history" />}
                >
                  <div className="pp-activity-list pp-activity-list--history">
                    {order.history.map((entry) => (
                      <article
                        className="pp-activity-item"
                        key={`${entry.date}-${entry.time}-${entry.title}`}
                      >
                        <span
                          className={`pp-activity-dot pp-activity-dot--${entry.tone}`}
                        ></span>
                        <div>
                          <small>
                            {entry.date} · {entry.time}
                          </small>
                          <strong>{entry.title}</strong>
                          <p>{entry.user}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                  <a className="pp-card-link">Gesamten Verlauf anzeigen →</a>
                </Panel>
              </div>
            </section>
          </div>
        </>
      ) : (
        <>
          <div className="pp-print-action-bar">
            <button type="button" onClick={() => window.print()}>
              Auftragstasche drucken / als PDF speichern
            </button>
            <span>
              DIN-A4-Hochformat, exakt eine Seite. Die Felder unten fließen
              direkt in den Ausdruck.
            </span>
          </div>
          <PrintPocketDraftEditor
            order={order}
            actionState={actionState}
            draft={printPocketDraft}
            onDraftChange={handlePrintPocketDraftChange}
          />
        </>
      )}

      <PrintOrderPocketSheet
        order={order}
        actionState={actionState}
        draft={printPocketDraft}
      />
    </div>
  );
}
