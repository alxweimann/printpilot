import { useState, type ReactNode } from "react";
import { StatusPill } from "../../components/ui/StatusPill";

type OrderTone = "green" | "orange" | "gray" | "blue";

type OrderStatus = {
  label: string;
  tone: OrderTone;
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
  contact: string;
  department: string;
  delivery: string;
  preflight: string;
  material: string;
  finishing: string;
  note: string;
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
    contact: "Einkauf / Frau Schneider",
    department: "Digitaldruck Farbe",
    delivery: "Abholung heute ab 16:00 Uhr",
    preflight: "PDF/X-4 geprüft · Beschnitt vorhanden · RGB-Warnung 0",
    material: "135 g/m² Bilderdruck matt · SRA3",
    finishing: "Schneiden auf Endformat · keine Falzung",
    note: "Freigabe liegt vor. Produktion kann nach Maschinenbelegung gestartet werden.",
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
    contact: "Praxisleitung / Herr Neumann",
    department: "Druckvorstufe",
    delivery: "Versand per Paketdienst",
    preflight: "Preflight OK · Kundendruckfreigabe fehlt",
    material: "300 g/m² Bilderdruck matt · SRA3",
    finishing: "Schneiden · Ecken unverändert",
    note: "Daten sind technisch bereit. Ohne Kundenfreigabe keine Übergabe an Produktion.",
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
    contact: "Marketing / Frau Bender",
    department: "Druckvorstufe",
    delivery: "Lieferung an Zentrale",
    preflight: "Umschlag vorhanden · Innenteil fehlt",
    material: "Umschlag 250 g/m² · Inhalt 135 g/m² geplant",
    finishing: "Rückenheftung · Endbeschnitt A5",
    note: "Auftrag bleibt blockiert, bis das finale Innenteil-PDF vorliegt.",
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
    contact: "Filialleitung / Herr König",
    department: "Großformat",
    delivery: "Filiallieferung vormittags",
    preflight: "PDF geprüft · 5 mm Beschnitt · CMYK",
    material: "Plakatpapier matt · Rolle 914 mm",
    finishing: "Formatzuschnitt · flach verpacken",
    note: "Rolle vor Produktionsstart prüfen. Motivserie nach Sortierung ausgeben.",
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
    contact: "Service / Herr Adler",
    department: "Großformat / Weiterverarbeitung",
    delivery: "Kurier bis 17:00 Uhr",
    preflight: "Druckdaten und CutContour geprüft",
    material: "Orajet 3164XG · matt laminiert",
    finishing: "Konturschnitt · Bogenweise verpacken",
    note: "Druck ist erledigt. Weiterverarbeitung priorisieren, weil Abholung heute geplant ist.",
  },
];

const laneGroups = [
  { title: "Daten / Freigabe", count: 3, tone: "blue" },
  { title: "Produktion", count: 5, tone: "orange" },
  { title: "Weiterverarbeitung", count: 2, tone: "gray" },
  { title: "Versandbereit", count: 2, tone: "green" },
] satisfies Array<{ title: string; count: number; tone: OrderTone }>;

type OrdersIconName = "orders" | "calendar" | "customer" | "machine" | "data" | "drawer" | "close" | "check" | "pocket";

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
    case "drawer":
      return (
        <svg {...common}>
          <path d="M5 5h14v14H5z" />
          <path d="M13 5v14" />
          <path d="m8.5 9.5 2.5 2.5-2.5 2.5" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="M7 7l10 10M17 7 7 17" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="m5.5 12.5 4 4 9-9" />
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

function DrawerFact({ label, value }: { label: string; value: string }) {
  return (
    <span className="pp-orders-drawer-fact">
      <small>{label}</small>
      <b>{value}</b>
    </span>
  );
}

function DrawerStatusTile({ label, status }: { label: string; status: OrderStatus }) {
  return (
    <span className="pp-orders-drawer-status-tile">
      <small>{label}</small>
      <StatusPill tone={status.tone}>{status.label}</StatusPill>
    </span>
  );
}

function DrawerAction({ icon, title, helper, tone = "default" }: { icon: ReactNode; title: string; helper: string; tone?: "default" | "primary" }) {
  return (
    <button type="button" className={`pp-orders-drawer-action pp-orders-drawer-action--${tone}`}>
      <span className="pp-panel__icon">{icon}</span>
      <span>
        <b>{title}</b>
        <small>{helper}</small>
      </span>
    </button>
  );
}

function OrderCard({ order, isSelected, onOpen }: { order: OrderRow; isSelected: boolean; onOpen: (order: OrderRow) => void }) {
  return (
    <article className={`pp-order-row-card${isSelected ? " pp-order-row-card--selected" : ""}`}>
      <button type="button" className="pp-order-row-card__hitarea" onClick={() => onOpen(order)} aria-label={`${order.id} öffnen`} />
      <div className="pp-order-row-card__topline">
        <span className="pp-order-id">{order.id}</span>
        <div className="pp-order-row-card__status" aria-label="Auftragsstatus">
          <StatusPill tone={order.production.tone}>{order.production.label}</StatusPill>
          <StatusPill tone={order.approval.tone}>{order.approval.label}</StatusPill>
          <StatusPill tone={order.data.tone}>{order.data.label}</StatusPill>
          <StatusPill tone={order.priority.tone}>{order.priority.label}</StatusPill>
        </div>
      </div>

      <div className="pp-order-row-card__body">
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
        <div className="pp-order-row-card__actions">
          <button type="button" onClick={() => onOpen(order)}>Auftrag öffnen →</button>
          <button type="button" onClick={() => onOpen(order)}>Auftragstasche</button>
        </div>
      </div>
    </article>
  );
}

function OrderDetailDrawer({ order, onClose }: { order: OrderRow | null; onClose: () => void }) {
  return (
    <div className={`pp-orders-drawer-shell${order ? " pp-orders-drawer-shell--open" : ""}`} aria-hidden={!order}>
      <div className="pp-orders-drawer-backdrop" onClick={onClose} />
      <aside className="pp-orders-detail-drawer" aria-label="Auftragsdetails" aria-modal="true" role="dialog">
        {order ? (
          <>
            <header className="pp-orders-drawer-header">
              <div className="pp-orders-drawer-header__main">
                <span className="pp-panel__icon"><OrdersIcon name="drawer" /></span>
                <div>
                  <p className="pp-eyebrow">Sprint 40.2 · Detail-Drawer</p>
                  <h2>{order.product}</h2>
                  <span>{order.id} · {order.customer}</span>
                </div>
              </div>
              <button type="button" className="pp-orders-drawer-close" onClick={onClose} aria-label="Detail-Drawer schließen">
                <OrdersIcon name="close" />
              </button>
            </header>

            <section className="pp-orders-drawer-primary-action" aria-label="Primäre Aktion">
              <button type="button">
                <span className="pp-panel__icon"><OrdersIcon name="pocket" /></span>
                <span>
                  <b>Auftragstasche öffnen</b>
                  <small>UI vorbereitet · spätere Verknüpfung zur produktiven Auftragstasche</small>
                </span>
              </button>
            </section>

            <div className="pp-orders-drawer-scrollbody">
              <section className="pp-orders-drawer-section pp-orders-drawer-section--accent pp-orders-drawer-section--compact">
                <div className="pp-panel__header">
                  <span className="pp-panel__icon"><OrdersIcon name="check" /></span>
                  <h3>Status und Prüfung</h3>
                </div>
                <div className="pp-orders-drawer-status-grid" aria-label="Statusübersicht">
                  <DrawerStatusTile label="Produktion" status={order.production} />
                  <DrawerStatusTile label="Freigabe" status={order.approval} />
                  <DrawerStatusTile label="Daten" status={order.data} />
                  <DrawerStatusTile label="Priorität" status={order.priority} />
                </div>
                <p className="pp-orders-drawer-hint">Vorbereitete Controls: Statuswechsel werden später mit Speicherlogik und Historie verbunden.</p>
              </section>

              <section className="pp-orders-drawer-section">
                <div className="pp-panel__header">
                  <span className="pp-panel__icon"><OrdersIcon name="orders" /></span>
                  <h3>Auftragskopf</h3>
                </div>
                <div className="pp-orders-drawer-facts">
                  <DrawerFact label="Kunde" value={order.customer} />
                  <DrawerFact label="Ansprechpartner" value={order.contact} />
                  <DrawerFact label="Produkt" value={order.product} />
                  <DrawerFact label="Format" value={order.format} />
                  <DrawerFact label="Auflage" value={order.quantity} />
                  <DrawerFact label="Lieferung" value={order.delivery} />
                </div>
              </section>

              <section className="pp-orders-drawer-section">
                <div className="pp-panel__header">
                  <span className="pp-panel__icon"><OrdersIcon name="calendar" /></span>
                  <h3>Produktion</h3>
                </div>
                <div className="pp-orders-drawer-facts pp-orders-drawer-facts--two">
                  <DrawerFact label="Termin" value={`${order.dueDate} · ${order.dueMeta}`} />
                  <DrawerFact label="Maschine" value={order.machine} />
                  <DrawerFact label="Bereich" value={order.department} />
                  <DrawerFact label="Verantwortlich" value={order.owner} />
                </div>
                <div className="pp-orders-drawer-progress">
                  <span>
                    <small>Produktionsstand</small>
                    <b>{order.progress}%</b>
                  </span>
                  <div className="pp-order-progress" aria-label={`Fortschritt ${order.progress} Prozent`}>
                    <span style={{ width: `${order.progress}%` }}></span>
                  </div>
                </div>
              </section>

              <section className="pp-orders-drawer-section">
                <div className="pp-panel__header">
                  <span className="pp-panel__icon"><OrdersIcon name="data" /></span>
                  <h3>Druckdaten und Weiterverarbeitung</h3>
                </div>
                <div className="pp-orders-drawer-note-grid">
                  <p><small>Preflight</small>{order.preflight}</p>
                  <p><small>Material</small>{order.material}</p>
                  <p><small>Weiterverarbeitung</small>{order.finishing}</p>
                </div>
              </section>

              <section className="pp-orders-drawer-section pp-orders-drawer-section--note">
                <small>Nächster Schritt</small>
                <strong>{order.nextStep}</strong>
                <p>{order.note}</p>
              </section>
            </div>

            <footer className="pp-orders-drawer-actions" aria-label="Vorbereitete Drawer-Aktionen">
              <DrawerAction icon={<OrdersIcon name="check" />} title="Freigabe markieren" helper="UI-Dummy · später Status speichern" />
              <DrawerAction icon={<OrdersIcon name="data" />} title="Daten prüfen" helper="UI-Dummy · Preflight verbinden" />
              <DrawerAction icon={<OrdersIcon name="machine" />} title="Status ändern" helper="UI-Dummy · Produktionsstatus wählen" />
              <DrawerAction icon={<OrdersIcon name="calendar" />} title="Termin planen" helper="UI-Dummy · Kalender später" />
            </footer>
          </>
        ) : null}
      </aside>
    </div>
  );
}

export function OrdersOverviewPage() {
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);

  return (
    <div className={`pp-orders-overview${selectedOrder ? " pp-orders-overview--drawer-open" : ""}`}>
      <header className="pp-orders-hero">
        <div className="pp-orders-hero__title">
          <span className="pp-panel__icon"><OrdersIcon name="orders" /></span>
          <div>
            <p className="pp-eyebrow">Sprint 40.2 · Aufträge</p>
            <h1>Aufträge-Übersicht</h1>
            <span>Produktionsnahe Übersicht mit korrigiertem Detail-Drawer-Footer.</span>
          </div>
        </div>
        <div className="pp-orders-hero__actions">
          <button type="button">+ Neuer Auftrag</button>
          <button type="button" onClick={() => setSelectedOrder(orderRows[0])}>Auftragstasche öffnen</button>
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
            <span className="pp-panel__icon"><OrdersIcon name="drawer" /></span>
            <strong>Detail-Drawer Footer korrigiert</strong>
            <p>„Auftrag öffnen“ fährt rechts eine kompakte Detailansicht auf. Die Aktionsleiste besitzt jetzt einen eigenen Footer und überdeckt keine Inhalte.</p>
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
              <StatusPill tone="blue">Drawer vorbereitet</StatusPill>
            </div>
          </div>

          <div className="pp-orders-card-list">
            {orderRows.map((order) => (
              <OrderCard key={order.id} order={order} isSelected={selectedOrder?.id === order.id} onOpen={setSelectedOrder} />
            ))}
          </div>
        </main>
      </section>

      <OrderDetailDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}
