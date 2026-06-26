import type { KeyboardEvent } from "react";
import { StatusPill } from "../../components/ui/StatusPill";
import { AppWorkHeader } from "../../components/ui/AppWorkHeader";
import { laneGroups } from "./order-data";
import type { OrderPreview, OrderTone, PrintPilotOrder } from "./order-data";

type OrdersIconName =
  | "orders"
  | "calendar"
  | "customer"
  | "machine"
  | "data"
  | "preview";

function OrdersIcon({ name }: { name: OrdersIconName }) {
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
    case "orders":
      return (
        <svg {...common}>
          <path d="M6 5h12v14H6z" />
          <path d="M9 8.5h6M9 12h6M9 15.5h4" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <path d="M6.5 5.5h11A1.5 1.5 0 0 1 19 7v10.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5V7a1.5 1.5 0 0 1 1.5-1.5Z" />
          <path d="M8 4v3M16 4v3M5 9h14" />
        </svg>
      );
    case "customer":
      return (
        <svg {...common}>
          <path d="M6 18.5V7.2L12 4l6 3.2v11.3" />
          <path d="M9 18.5v-5h6v5" />
        </svg>
      );
    case "machine":
      return (
        <svg {...common}>
          <path d="M5 8h14v9H5z" />
          <path d="M8 5h8v3H8z" />
          <path d="M8.5 12h7" />
        </svg>
      );
    case "data":
      return (
        <svg {...common}>
          <path d="M7 8V4.8h10V8" />
          <path d="M6.2 16.2H5a1.4 1.4 0 0 1-1.4-1.4v-4.2A1.6 1.6 0 0 1 5.2 9h13.6a1.6 1.6 0 0 1 1.6 1.6v4.2a1.4 1.4 0 0 1-1.4 1.4h-1.2" />
          <path d="M7.3 13.8h9.4v5.4H7.3z" />
        </svg>
      );
    case "preview":
      return (
        <svg {...common}>
          <path d="M6 4.8h9.5L18 7.3v11.9H6z" />
          <path d="M15.5 4.8v3H18" />
          <path d="M8.5 13.2h7M8.5 16h4.8" />
        </svg>
      );
    default:
      return null;
  }
}


function getOverviewMetrics(orders: PrintPilotOrder[]) {
  const dueSoon = orders.filter((order) => order.priority.tone === "orange").length;
  const inProduction = orders.filter((order) =>
    ["Produktion", "Weiterverarbeitung"].includes(order.production.label),
  ).length;
  const approvalOpen = orders.filter(
    (order) => order.approval.label !== "Freigabe erteilt",
  ).length;
  const dataOpen = orders.filter(
    (order) =>
      !order.data.label.includes("geprüft") && !order.data.label.includes("OK"),
  ).length;

  return [
    {
      label: "Priorität",
      value: String(dueSoon),
      helper: dueSoon === 1 ? "Auftrag kritisch" : "Aufträge kritisch",
      tone: dueSoon > 0 ? "orange" : "gray",
    },
    {
      label: "In Produktion",
      value: String(inProduction),
      helper: "Druck / Weiterverarbeitung",
      tone: inProduction > 0 ? "blue" : "gray",
    },
    {
      label: "Freigabe offen",
      value: String(approvalOpen),
      helper: "Kunde",
      tone: approvalOpen > 0 ? "orange" : "green",
    },
    {
      label: "Daten prüfen",
      value: String(dataOpen),
      helper: "Preflight",
      tone: dataOpen > 0 ? "orange" : "green",
    },
  ] satisfies Array<{
    label: string;
    value: string;
    helper: string;
    tone: OrderTone;
  }>;
}

function OverviewMetric({
  label,
  value,
  helper,
  tone,
}: {
  label: string;
  value: string;
  helper: string;
  tone: OrderTone;
}) {
  return (
    <article className={`pp-orders-metric pp-orders-metric--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{helper}</small>
    </article>
  );
}

function MetaItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <span className="pp-orders-meta-item">
      <span>{label}</span>
      <b>{value}</b>
    </span>
  );
}

function OrderPreviewCard({
  preview,
}: {
  preview: OrderPreview;
}) {
  return (
    <div
      className={`pp-order-preview pp-order-preview--${preview.kind}`}
      aria-label={`Druckdatei Vorschau ${preview.filename}`}
    >
      <div className="pp-order-preview__sheet">
        <span className="pp-order-preview__mark pp-order-preview__mark--tl" />
        <span className="pp-order-preview__mark pp-order-preview__mark--tr" />
        <span className="pp-order-preview__mark pp-order-preview__mark--bl" />
        <span className="pp-order-preview__mark pp-order-preview__mark--br" />
        <img
          className="pp-order-preview__image"
          src={preview.imageSrc}
          alt={preview.imageAlt}
          loading="lazy"
        />
      </div>
      <div className="pp-order-preview__caption">
        <span>{preview.label}</span>
        <b>{preview.filename}</b>
        <small>{preview.meta}</small>
      </div>
    </div>
  );
}

function OrderCard({
  order,
  onOpenOrderPocket,
}: {
  order: PrintPilotOrder;
  onOpenOrderPocket: (order: PrintPilotOrder) => void;
}) {
  const openOrderPocket = () => onOpenOrderPocket(order);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openOrderPocket();
    }
  };

  return (
    <article
      className="pp-order-row-card pp-order-row-card--clickable pp-order-row-card--quiet"
      role="button"
      tabIndex={0}
      onClick={openOrderPocket}
      onKeyDown={handleKeyDown}
      aria-label={`${order.id} Auftragstasche öffnen`}
    >
      <OrderPreviewCard preview={order.preview} />

      <div className="pp-order-row-card__content">
        <div className="pp-order-row-card__topline">
          <div>
            <span className="pp-order-id">{order.id}</span>
            <h2>{order.product}</h2>
            <p>{order.customer}</p>
          </div>
          <div className="pp-order-row-card__status" aria-label="Auftragsstatus">
            <StatusPill tone={order.production.tone}>{order.production.label}</StatusPill>
            <StatusPill tone={order.approval.tone}>{order.approval.label}</StatusPill>
            <StatusPill tone={order.data.tone}>{order.data.label}</StatusPill>
            {order.priority.tone === "orange" ? (
              <StatusPill tone={order.priority.tone}>{order.priority.label}</StatusPill>
            ) : null}
          </div>
        </div>

        <div className="pp-order-meta-line" aria-label="Auftragsdaten">
          <MetaItem label="Termin" value={`${order.dueDate} · ${order.dueMeta}`} />
          <MetaItem label="Maschine" value={order.machine} />
          <MetaItem label="Auflage" value={order.quantity} />
          <MetaItem label="Verantw." value={order.owner} />
        </div>

        <div className="pp-order-row-card__foot">
          <span className="pp-order-specs pp-order-specs--quiet">
            <span>{order.format}</span>
            <span>{order.preview.meta}</span>
          </span>
          <span>
            <small>Nächster Schritt</small>
            <b>{order.nextStep}</b>
          </span>
        </div>
      </div>
    </article>
  );
}

export function OrdersOverviewPage({
  orders,
  onOpenOrderPocket,
}: {
  orders: PrintPilotOrder[];
  onOpenOrderPocket: (order: PrintPilotOrder) => void;
}) {
  const overviewMetrics = getOverviewMetrics(orders);
  const metricValue = (label: string) =>
    overviewMetrics.find((item) => item.label === label)?.value ?? "0";
  const workHeaderChips = [
    `${orders.length} aktive Aufträge`,
    `${metricValue("In Produktion")} in Produktion`,
    `${metricValue("Freigabe offen")} Freigabe offen`,
    `${metricValue("Daten prüfen")} Daten prüfen`,
  ];

  return (
    <div className="pp-orders-overview pp-orders-overview--quiet">
      <AppWorkHeader
        module="Aufträge"
        title="Produktionsübersicht"
        subtitle="Freigaben · Termine · Auftragstaschen"
        chips={workHeaderChips}
        primaryAction={{ label: "Neuer Auftrag" }}
        className="pp-orders-work-header"
        ariaLabel="Arbeitskopf Aufträge"
      />

      <section className="pp-orders-summary pp-orders-summary--quiet" aria-label="Auftragskennzahlen">
        {overviewMetrics.map((item) => (
          <OverviewMetric key={item.label} {...item} />
        ))}
      </section>

      <section className="pp-orders-workbench pp-orders-workbench--quiet">
        <aside className="pp-orders-filter-panel pp-orders-filter-panel--quiet">
          <div className="pp-panel__header">
            <span className="pp-panel__icon">
              <OrdersIcon name="data" />
            </span>
            <h2>Filter</h2>
          </div>
          <div className="pp-orders-filter-list pp-orders-filter-list--quiet">
            {laneGroups.map((lane) => (
              <button type="button" key={lane.title}>
                <span>{lane.title}</span>
                <b>{String(lane.count)}</b>
              </button>
            ))}
          </div>
          <div className="pp-orders-next-panel pp-orders-next-panel--quiet">
            <span className="pp-panel__icon">
              <OrdersIcon name="preview" />
            </span>
            <strong>Auftragstasche ist Detailansicht</strong>
            <p>Karten öffnen direkt die Auftragstasche. Die Übersicht bleibt bewusst kompakt.</p>
          </div>
        </aside>

        <main className="pp-orders-list-panel pp-orders-list-panel--quiet">
          <div className="pp-orders-list-head pp-orders-list-head--quiet">
            <div>
              <p className="pp-eyebrow">Aktive Aufträge</p>
              <h2>Produktion und Freigaben</h2>
            </div>
          </div>

          <div className="pp-orders-card-list">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onOpenOrderPocket={onOpenOrderPocket}
              />
            ))}
          </div>
        </main>
      </section>
    </div>
  );
}
