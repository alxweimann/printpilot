import type { KeyboardEvent, ReactNode } from "react";
import { StatusPill } from "../../components/ui/StatusPill";
import printPilotLogo from "../../assets/logo/printpilot-logo-on-navy.png";
import { laneGroups, orderRows, orderSummary } from "./order-data";
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
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <span className="pp-orders-meta-item">
      {icon}
      <span>{label}</span>
      <b>{value}</b>
    </span>
  );
}

function OrderPreviewCard({
  preview,
  product,
}: {
  preview: OrderPreview;
  product: string;
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
        <div className="pp-order-preview__art">
          <span />
          <strong>{product.slice(0, 2).toUpperCase()}</strong>
          <em />
        </div>
      </div>
      <div className="pp-order-preview__caption">
        <span>{preview.label}</span>
        <b>{preview.filename}</b>
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
      <OrderPreviewCard preview={order.preview} product={order.product} />

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
          <MetaItem
            icon={<OrdersIcon name="calendar" />}
            label="Termin"
            value={`${order.dueDate} · ${order.dueMeta}`}
          />
          <MetaItem
            icon={<OrdersIcon name="machine" />}
            label="Maschine"
            value={order.machine}
          />
          <MetaItem
            icon={<OrdersIcon name="orders" />}
            label="Auflage"
            value={order.quantity}
          />
          <MetaItem
            icon={<OrdersIcon name="customer" />}
            label="Verantw."
            value={order.owner}
          />
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
  onOpenOrderPocket,
}: {
  onOpenOrderPocket: (order: PrintPilotOrder) => void;
}) {
  return (
    <div className="pp-orders-overview pp-orders-overview--quiet">
      <header className="pp-master-header pp-orders-master-header pp-orders-master-header--quiet">
        <div className="pp-header-brand">
          <img
            className="pp-brand-logo"
            src={printPilotLogo}
            alt="PrintPilot"
          />
        </div>

        <div className="pp-header-title-shape">
          <h1>AUFTRÄGE-ÜBERSICHT</h1>
          <p>Produktionscockpit · Freigaben · Termine</p>
        </div>

        <div
          className="pp-header-job pp-header-job--overview"
          aria-label="Aktive Aufträge"
        >
          <span>Aktive Aufträge</span>
          <strong>{orderRows.length}</strong>
        </div>
      </header>

      <section className="pp-orders-summary pp-orders-summary--quiet" aria-label="Auftragskennzahlen">
        {orderSummary.map((item) => (
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
            {orderRows.map((order) => (
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
