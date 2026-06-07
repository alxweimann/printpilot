import type { KeyboardEvent, ReactNode } from "react";
import { StatusPill } from "../../components/ui/StatusPill";
import printPilotLogo from "../../assets/logo/printpilot-logo-on-navy.png";

type OrderTone = "green" | "orange" | "gray" | "blue";

type OrderStatus = {
  label: string;
  tone: OrderTone;
};

type OrderPreview = {
  kind: "flyer" | "business-card" | "brochure" | "poster" | "sticker";
  label: string;
  filename: string;
  meta: string;
};

type OrderRow = {
  id: string;
  customer: string;
  product: string;
  format: string;
  quantity: string;
  machine: string;
  priority: OrderStatus;
  production: OrderStatus;
  approval: OrderStatus;
  data: OrderStatus;
  dueDate: string;
  dueMeta: string;
  nextStep: string;
  owner: string;
  progress: number;
  preview: OrderPreview;
};

const orderSummary = [
  { label: "Heute fällig", value: "4", helper: "2 kritisch", tone: "orange" },
  { label: "In Produktion", value: "12", helper: "6 Maschinen", tone: "blue" },
  { label: "Freigabe offen", value: "5", helper: "Kunde", tone: "gray" },
  { label: "Daten prüfen", value: "3", helper: "Preflight", tone: "orange" },
] satisfies Array<{ label: string; value: string; helper: string; tone: OrderTone }>;

const orderRows: OrderRow[] = [
  {
    id: "PP-2026-00481",
    customer: "Muster GmbH",
    product: "Flyer DIN Lang",
    format: "210 × 99 mm · 2-seitig",
    quantity: "3.000 Stück",
    machine: "Xerox® Iridesse 1",
    priority: { label: "Normal", tone: "blue" },
    production: { label: "Produktion", tone: "orange" },
    approval: { label: "Freigabe erteilt", tone: "green" },
    data: { label: "Daten geprüft", tone: "green" },
    dueDate: "03.06.2026",
    dueMeta: "Mi · 10:00",
    nextStep: "Druckstart vorbereiten",
    owner: "Sarah K.",
    progress: 58,
    preview: {
      kind: "flyer",
      label: "PDF-Preview",
      filename: "flyer_dinlang_druck.pdf",
      meta: "2 Seiten · 8,2 MB",
    },
  },
  {
    id: "PP-2026-00482",
    customer: "Praxis Rheinbogen",
    product: "Visitenkarten Set",
    format: "85 × 55 mm · 4/4",
    quantity: "750 Stück",
    machine: "Xerox® Iridesse 2",
    priority: { label: "Eilig", tone: "orange" },
    production: { label: "Datenprüfung", tone: "blue" },
    approval: { label: "Freigabe offen", tone: "orange" },
    data: { label: "Preflight OK", tone: "green" },
    dueDate: "03.06.2026",
    dueMeta: "Mi · 14:00",
    nextStep: "Freigabe beim Kunden einholen",
    owner: "Max M.",
    progress: 32,
    preview: {
      kind: "business-card",
      label: "PDF-Preview",
      filename: "visitenkarten_set.pdf",
      meta: "4/4 · 3 Nutzen",
    },
  },
  {
    id: "PP-2026-00483",
    customer: "Stadtwerke Süd",
    product: "Broschüre A5",
    format: "16 Seiten · Rückenheftung",
    quantity: "1.200 Stück",
    machine: "Xerox® Iridesse 1",
    priority: { label: "Hoch", tone: "orange" },
    production: { label: "Wartet", tone: "gray" },
    approval: { label: "Freigabe erteilt", tone: "green" },
    data: { label: "Daten fehlen", tone: "orange" },
    dueDate: "04.06.2026",
    dueMeta: "Do · 12:00",
    nextStep: "Innenteil-PDF nachfordern",
    owner: "Admin",
    progress: 24,
    preview: {
      kind: "brochure",
      label: "Preview fehlt",
      filename: "umschlag_a5.pdf",
      meta: "Innenteil offen",
    },
  },
  {
    id: "PP-2026-00484",
    customer: "Bäckerei König",
    product: "Plakat A2",
    format: "420 × 594 mm · 4/0",
    quantity: "40 Stück",
    machine: "Roland TrueVis VG3-540",
    priority: { label: "Normal", tone: "blue" },
    production: { label: "Geplant", tone: "blue" },
    approval: { label: "Freigabe erteilt", tone: "green" },
    data: { label: "Daten geprüft", tone: "green" },
    dueDate: "05.06.2026",
    dueMeta: "Fr · 09:30",
    nextStep: "Rolle prüfen und RIP vorbereiten",
    owner: "Julia P.",
    progress: 46,
    preview: {
      kind: "poster",
      label: "PDF-Preview",
      filename: "plakat_a2_motivserie.pdf",
      meta: "A2 · CMYK",
    },
  },
  {
    id: "PP-2026-00485",
    customer: "Autohaus Bergstraße",
    product: "Aufkleberbogen",
    format: "SRA3 · Konturschnitt",
    quantity: "150 Bogen",
    machine: "Roland TrueVis VG3-540",
    priority: { label: "Eilig", tone: "orange" },
    production: { label: "Weiterverarbeitung", tone: "orange" },
    approval: { label: "Freigabe erteilt", tone: "green" },
    data: { label: "Daten geprüft", tone: "green" },
    dueDate: "05.06.2026",
    dueMeta: "Fr · 15:00",
    nextStep: "Konturschnitt und Verpackung",
    owner: "Sarah K.",
    progress: 74,
    preview: {
      kind: "sticker",
      label: "Druck-/Cut-Preview",
      filename: "aufkleberbogen_cutcontour.pdf",
      meta: "CutContour geprüft",
    },
  },
];

const laneGroups = [
  { title: "Daten / Freigabe", count: 3, tone: "blue" },
  { title: "Produktion", count: 5, tone: "orange" },
  { title: "Weiterverarbeitung", count: 2, tone: "gray" },
  { title: "Versandbereit", count: 2, tone: "green" },
] satisfies Array<{ title: string; count: number; tone: OrderTone }>;

type OrdersIconName = "orders" | "calendar" | "customer" | "machine" | "data" | "preview" | "pocket";

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
    case "pocket":
      return (
        <svg {...common}>
          <path d="M5 6h14v13H5z" />
          <path d="M5 9h14" />
          <path d="M8 13h4M8 16h7" />
        </svg>
      );
    default:
      return null;
  }
}

function OverviewMetric({ label, value, helper, tone }: { label: string; value: string; helper: string; tone: OrderTone }) {
  return (
    <article className={`pp-orders-metric pp-orders-metric--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{helper}</small>
    </article>
  );
}

function MiniInfo({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <span className="pp-orders-mini-info">
      <span className="pp-panel__icon">{icon}</span>
      <span>
        <small>{label}</small>
        <b>{value}</b>
      </span>
    </span>
  );
}

function OrderPreviewCard({ preview, product }: { preview: OrderPreview; product: string }) {
  return (
    <div className={`pp-order-preview pp-order-preview--${preview.kind}`} aria-label={`Druckdatei Vorschau ${preview.filename}`}>
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
        <small>{preview.meta}</small>
      </div>
    </div>
  );
}

function OrderCard({ order, onOpenOrderPocket }: { order: OrderRow; onOpenOrderPocket: (order: OrderRow) => void }) {
  const openOrderPocket = () => onOpenOrderPocket(order);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openOrderPocket();
    }
  };

  return (
    <article
      className="pp-order-row-card pp-order-row-card--clickable"
      role="button"
      tabIndex={0}
      onClick={openOrderPocket}
      onKeyDown={handleKeyDown}
      aria-label={`${order.id} Auftragstasche öffnen`}
    >
      <div className="pp-order-row-card__topline">
        <span className="pp-order-id">{order.id}</span>
        <div className="pp-order-row-card__status" aria-label="Auftragsstatus">
          <StatusPill tone={order.production.tone}>{order.production.label}</StatusPill>
          <StatusPill tone={order.approval.tone}>{order.approval.label}</StatusPill>
          <StatusPill tone={order.data.tone}>{order.data.label}</StatusPill>
          <StatusPill tone={order.priority.tone}>{order.priority.label}</StatusPill>
        </div>
      </div>

      <div className="pp-order-row-card__body pp-order-row-card__body--with-preview">
        <OrderPreviewCard preview={order.preview} product={order.product} />

        <div className="pp-order-row-card__main">
          <h2>{order.product}</h2>
          <p>{order.customer}</p>
          <div className="pp-order-specs">
            <span>{order.format}</span>
            <span>{order.quantity}</span>
          </div>
        </div>

        <div className="pp-order-row-card__meta">
          <MiniInfo icon={<OrdersIcon name="calendar" />} label="Termin" value={`${order.dueDate} · ${order.dueMeta}`} />
          <MiniInfo icon={<OrdersIcon name="machine" />} label="Maschine" value={order.machine} />
          <MiniInfo icon={<OrdersIcon name="orders" />} label="Auflage" value={order.quantity} />
          <MiniInfo icon={<OrdersIcon name="customer" />} label="Verantwortlich" value={order.owner} />
        </div>
      </div>

      <div className="pp-order-progress" aria-label={`Fortschritt ${order.progress} Prozent`}>
        <span style={{ width: `${order.progress}%` }}></span>
      </div>

      <div className="pp-order-row-card__foot">
        <span>
          <small>Nächster Schritt</small>
          <b>{order.nextStep}</b>
        </span>
        <span className="pp-order-row-card__open-hint">
          <span className="pp-panel__icon"><OrdersIcon name="pocket" /></span>
          <span>Karte öffnet Auftragstasche</span>
        </span>
      </div>
    </article>
  );
}

export function OrdersOverviewPage({ onOpenOrderPocket }: { onOpenOrderPocket: (order: OrderRow) => void }) {
  return (
    <div className="pp-orders-overview">
      <header className="pp-master-header pp-orders-master-header">
        <div className="pp-header-brand">
          <img className="pp-brand-logo" src={printPilotLogo} alt="PrintPilot" />
        </div>

        <div className="pp-header-title-shape">
          <h1>AUFTRÄGE-ÜBERSICHT</h1>
          <p>Produktionscockpit</p>
        </div>

        <div className="pp-header-job pp-header-job--overview" aria-label="Aktive Aufträge">
          <span>Aktive Aufträge</span>
          <strong>{orderRows.length}</strong>
        </div>

        <div className="pp-header-overview-status" aria-label="Übersichtsstatus">
          <span>Sprint 40.6 · Aufträge</span>
          <div>
            <StatusPill tone="green">Freigaben</StatusPill>
            <StatusPill tone="orange">Datenstatus</StatusPill>
            <StatusPill tone="blue">Preview</StatusPill>
          </div>
          <small>Karte anklicken, um die Auftragstasche zu öffnen.</small>
        </div>
      </header>

      <section className="pp-orders-summary" aria-label="Auftragskennzahlen">
        {orderSummary.map((item) => (
          <OverviewMetric key={item.label} {...item} />
        ))}
      </section>

      <section className="pp-orders-workbench">
        <aside className="pp-orders-filter-panel">
          <div className="pp-panel__header">
            <span className="pp-panel__icon"><OrdersIcon name="data" /></span>
            <h2>Filter</h2>
          </div>
          <div className="pp-orders-filter-list">
            {laneGroups.map((lane) => (
              <button type="button" key={lane.title}>
                <span>{lane.title}</span>
                <StatusPill tone={lane.tone}>{String(lane.count)}</StatusPill>
              </button>
            ))}
          </div>
          <div className="pp-orders-next-panel">
            <span className="pp-panel__icon"><OrdersIcon name="preview" /></span>
            <strong>Auftragstasche ist Detailansicht</strong>
            <p>Die komplette Auftragskarte führt direkt in die Auftragstasche. Die Übersicht bleibt das schnelle Produktionscockpit mit Druckdatei-Preview.</p>
          </div>
        </aside>

        <main className="pp-orders-list-panel">
          <div className="pp-orders-list-head">
            <div>
              <p className="pp-eyebrow">Aktive Aufträge</p>
              <h2>Produktion und Freigaben</h2>
            </div>
            <div className="pp-orders-list-head__badges">
              <StatusPill tone="green">Freigabe sichtbar</StatusPill>
              <StatusPill tone="orange">Datenstatus sichtbar</StatusPill>
              <StatusPill tone="blue">Preview vorbereitet</StatusPill>
            </div>
          </div>

          <div className="pp-orders-card-list">
            {orderRows.map((order) => (
              <OrderCard key={order.id} order={order} onOpenOrderPocket={onOpenOrderPocket} />
            ))}
          </div>
        </main>
      </section>
    </div>
  );
}
