import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Panel } from "../../components/ui/Panel";
import printPilotLogo from "../../assets/logo/printpilot-logo-on-navy.png";
import orderQrCode from "../../assets/qr/order-pp-2026-00481.svg";
import digitalColorMachine from "../../assets/machines/machine-digital-color.svg";
import digitalMonoMachine from "../../assets/machines/machine-digital-mono.svg";
import wideFormatMachine from "../../assets/machines/machine-wide-format.svg";
import inkjetMachine from "../../assets/machines/machine-inkjet.svg";
import finishingMachine from "../../assets/machines/machine-finishing.svg";
import { StatusPill } from "../../components/ui/StatusPill";
import type { PrintPilotOrder } from "../orders/order-data";

function getProductHighlights(order: PrintPilotOrder) {
  return [
    ["Auflage", order.quantity],
    ["Endformat", order.endFormat],
    ["Seiten", order.pages],
  ];
}

function getProductDetails(order: PrintPilotOrder) {
  return [
    ["Papier", order.paper],
    ["Farbigkeit", order.color],
    ["Rohformat", order.rawFormat],
    ["Nutzen", order.imposition],
    ["Beschnitt", order.bleed],
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

function getImpositionStats(order: PrintPilotOrder) {
  return [
    [
      "Bogenformat",
      order.rawFormat === "SRA3" ? "SRA3 · 450 × 320 mm" : order.rawFormat,
    ],
    ["Nutzen", order.imposition],
    ["Druckbogen", `${order.quantity} · ${order.waste}`],
  ];
}

function getImpositionDetails(order: PrintPilotOrder) {
  return [
    ["Endformat", order.endFormat],
    ["Anordnung", `${order.imposition} · schematisch`],
    ["Beschnitt", `${order.bleed} umlaufend`],
    [
      "Wendeart",
      order.pages.includes("2") || order.pages.includes("4/4")
        ? "Längswende / prüfen"
        : "einseitig",
    ],
  ];
}

function getPreviewSpecs(order: PrintPilotOrder) {
  return [
    ["Format", order.endFormat],
    ["Seiten", order.pages],
    ["Beschnitt", order.bleed],
  ];
}

function getFiles(order: PrintPilotOrder) {
  return [
    [
      "PDF",
      order.preview.filename,
      order.fileCategory,
      order.fileDate,
      order.fileTime,
      order.fileSize,
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
      "JPG",
      `${order.id.toLowerCase()}_ansicht.jpg`,
      "Ansicht",
      order.fileDate,
      order.fileTime,
      "2,1 MB",
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
    if (currentLabel === "Weiterverarbeitung" || currentLabel === "Versandbereit") {
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
  const parsedCount = Number.parseInt(order.imposition, 10);
  if (Number.isFinite(parsedCount) && parsedCount > 0) {
    return Math.min(parsedCount, 24);
  }

  switch (order.preview.kind) {
    case "business-card":
      return 12;
    case "brochure":
      return 8;
    case "poster":
      return 2;
    case "sticker":
      return 15;
    case "flyer":
    default:
      return 8;
  }
}

function ImpositionPlanCard({ order }: { order: PrintPilotOrder }) {
  const impositionStats = getImpositionStats(order);
  const impositionDetails = getImpositionDetails(order);
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
        aria-label={`Nutzenplan ${order.imposition} auf ${order.rawFormat}`}
      >
        {Array.from({ length: cellCount }, (_, index) => (
          <span key={index}>
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
    </div>
  );
}

function PreviewCard({ order }: { order: PrintPilotOrder }) {
  const previewSpecs = getPreviewSpecs(order);
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
        <b>{order.preview.filename}</b>
        <span>
          {order.fileCategory} · {order.color} · {order.preview.meta}
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
  const [localActionState, setLocalActionState] = useState<PocketActionState>(() =>
    createPocketActionState(order),
  );

  useEffect(() => {
    setLocalActionState(createPocketActionState(order));
  }, [order]);

  const hasCentralOrderState = typeof onOrderChange === "function";
  const centralActionState = useMemo(() => createPocketActionState(order), [order]);
  const actionState = hasCentralOrderState ? centralActionState : localActionState;

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
    specs: [order.rawFormat, order.color, order.imposition],
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
          <img
            className="pp-brand-logo"
            src={printPilotLogo}
            alt="PrintPilot"
          />
        </div>

        <div className="pp-header-title-shape">
          <h1>AUFTRAGSTASCHE</h1>
          <p>Produktionsauftrag</p>
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
              <strong>Auftragsstatus und Prozessphasen direkt bearbeiten</strong>
              <p className="pp-status-overview__note">
                UI-Vorschau ohne persistente Speicherung. Schritte anklicken,
                um Datenprüfung, Freigabe und Produktionsphase lokal zu ändern.
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
                  {checklistSummary.done} / {checklistSummary.total} erledigt
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
                    <section className="pp-check-section" key={section.title}>
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
                              handleToggleChecklistItem(sectionIndex, itemIndex)
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
              <a className="pp-card-link">Alle Dateien im Auftrag anzeigen →</a>
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
    </div>
  );
}
