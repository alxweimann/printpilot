import { useMemo } from "react";

import { PageHeader } from "../layout/PageHeader";
import { Badge } from "../ui/Badge";
import { DataTable } from "../ui/Table";
import { usePrintPilotStore } from "../store/PrintPilotStore";

type DashboardPageProps = {
  onNavigate: (pageId: string) => void;
};

type DashboardActivity = {
  type: string;
  number: string;
  customerName: string;
  status: string;
  pageId: string;
  variant?: "success" | "warning" | "danger";
};

function formatDashboardTimestamp(value: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function parseNumber(value: string) {
  const parsedValue = Number.parseFloat(value.replace(",", "."));

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const {
    deliveryNotes,
    invoices,
    materials,
    orders,
    quotes,
    reminders,
  } = usePrintPilotStore();

  const openQuotes = quotes.filter((quote) => quote.status === "Offen");
  const draftQuotes = quotes.filter((quote) => quote.status === "Entwurf");
  const productionOrders = orders.filter(
    (order) => order.status === "In Produktion",
  );
  const waitingOrders = orders.filter((order) => order.status === "Wartet");
  const shippingReadyDeliveryNotes = deliveryNotes.filter(
    (deliveryNote) => deliveryNote.status === "Versandbereit",
  );
  const openInvoices = invoices.filter((invoice) => invoice.status === "Offen");
  const overdueInvoices = invoices.filter(
    (invoice) => invoice.status === "Überfällig",
  );
  const openReminders = reminders.filter(
    (reminder) =>
      reminder.status === "Offen" || reminder.status === "Versendet",
  );
  const materialWarnings = materials.filter((material) => {
    const stock = parseNumber(material.stock);
    const minimumStock = parseNumber(material.minimumStock);

    return (
      material.status === "Knapp" ||
      material.status === "Bestellen" ||
      (minimumStock > 0 && stock <= minimumStock)
    );
  });

  const dashboardActivities = useMemo<DashboardActivity[]>(() => {
    const quoteRows = openQuotes.slice(0, 3).map((quote) => ({
      type: "Angebot",
      number: quote.number,
      customerName: quote.customerName,
      status: quote.status,
      pageId: "quotes",
      variant: "warning" as const,
    }));

    const orderRows = productionOrders.slice(0, 3).map((order) => ({
      type: "Auftrag",
      number: order.number,
      customerName: order.customerName,
      status: order.status,
      pageId: "orders",
      variant: "success" as const,
    }));

    const invoiceRows = overdueInvoices.slice(0, 3).map((invoice) => ({
      type: "Rechnung",
      number: invoice.number,
      customerName: invoice.customerName,
      status: invoice.status,
      pageId: "invoices",
      variant: "danger" as const,
    }));

    const reminderRows = openReminders.slice(0, 3).map((reminder) => ({
      type: "Mahnung",
      number: reminder.number,
      customerName: reminder.customerName,
      status: reminder.status,
      pageId: "reminders",
      variant: "warning" as const,
    }));

    return [...invoiceRows, ...reminderRows, ...orderRows, ...quoteRows].slice(
      0,
      8,
    );
  }, [openQuotes, openReminders, overdueInvoices, productionOrders]);

  return (
    <div className="page">
      <PageHeader
        title="Dashboard"
        description="Workflow-Zentrale für offene Vorgänge, kritische Belege und nächste Aktionen."
      />

      <section className="dashboard-grid dashboard-grid-workflow">
        <button
          type="button"
          className="dashboard-metric-card dashboard-metric-quotes"
          onClick={() => onNavigate("quotes")}
        >
          <div className="dashboard-metric-label">Offene Angebote</div>
          <div className="dashboard-metric-value">{openQuotes.length}</div>
          <div className="dashboard-metric-hint">
            {draftQuotes.length} Entwürfe vorbereiten
          </div>
        </button>

        <button
          type="button"
          className="dashboard-metric-card dashboard-metric-orders"
          onClick={() => onNavigate("orders")}
        >
          <div className="dashboard-metric-label">Aufträge in Produktion</div>
          <div className="dashboard-metric-value">
            {productionOrders.length}
          </div>
          <div className="dashboard-metric-hint">
            {waitingOrders.length} wartende Aufträge
          </div>
        </button>

        <button
          type="button"
          className="dashboard-metric-card dashboard-metric-delivery"
          onClick={() => onNavigate("delivery-notes")}
        >
          <div className="dashboard-metric-label">Versandbereit</div>
          <div className="dashboard-metric-value">
            {shippingReadyDeliveryNotes.length}
          </div>
          <div className="dashboard-metric-hint">
            Versand/Abholung vorbereiten
          </div>
        </button>

        <button
          type="button"
          className="dashboard-metric-card dashboard-metric-invoices"
          onClick={() => onNavigate("invoices")}
        >
          <div className="dashboard-metric-label">Offene Rechnungen</div>
          <div className="dashboard-metric-value">{openInvoices.length}</div>
          <div className="dashboard-metric-hint">
            {overdueInvoices.length} überfällig
          </div>
        </button>

        <button
          type="button"
          className="dashboard-metric-card dashboard-metric-reminders"
          onClick={() => onNavigate("reminders")}
        >
          <div className="dashboard-metric-label">Offene Mahnungen</div>
          <div className="dashboard-metric-value">{openReminders.length}</div>
          <div className="dashboard-metric-hint">Zahlungsfristen prüfen</div>
        </button>

        <button
          type="button"
          className="dashboard-metric-card dashboard-metric-material"
          onClick={() => onNavigate("material")}
        >
          <div className="dashboard-metric-label">Materialhinweise</div>
          <div className="dashboard-metric-value">
            {materialWarnings.length}
          </div>
          <div className="dashboard-metric-hint">Mindestbestand prüfen</div>
        </button>
      </section>

      <section className="master-detail-layout dashboard-layout">
        <div className="workspace-panel master-list-panel">
          <div className="dashboard-panel-header">
            <div>
              <div className="sheet-kicker">Vorgänge</div>
              <h2>Handlungsbedarf</h2>
            </div>
          </div>

          <DataTable>
            <thead>
              <tr>
                <th>Typ</th>
                <th>Nummer</th>
                <th>Kunde</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {dashboardActivities.length > 0 ? (
                dashboardActivities.map((activity) => (
                  <tr
                    key={`${activity.type}-${activity.number}`}
                    className="dashboard-work-row"
                    onClick={() => onNavigate(activity.pageId)}
                  >
                    <td>{activity.type}</td>
                    <td>{activity.number}</td>
                    <td>{activity.customerName}</td>
                    <td>
                      <Badge variant={activity.variant}>{activity.status}</Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>
                    <strong>Keine kritischen Vorgänge.</strong> Aktuell gibt es
                    keine offenen Mahnungen, überfälligen Rechnungen oder
                    Produktionsengpässe.
                  </td>
                </tr>
              )}
            </tbody>
          </DataTable>
        </div>

        <div className="workspace-panel master-editor-panel">
          <div className="dashboard-panel-header dashboard-panel-header-split">
            <div>
              <div className="sheet-kicker">Schnellzugriff</div>
              <h2>Nächste Aktionen</h2>
            </div>

            <div className="dashboard-stand-pill">
              Stand: {formatDashboardTimestamp(new Date())}
            </div>
          </div>

          <div className="dashboard-action-list">
            <button
              type="button"
              className="dashboard-action-item dashboard-action-calculation"
              onClick={() => onNavigate("calculation")}
            >
              <span>Kalkulation starten</span>
              <small>neues Druckprodukt vorbereiten</small>
            </button>

            <button
              type="button"
              className="dashboard-action-item dashboard-action-quotes"
              onClick={() => onNavigate("quotes")}
            >
              <span>Angebote prüfen</span>
              <small>{openQuotes.length} offene Angebote</small>
            </button>

            <button
              type="button"
              className="dashboard-action-item dashboard-action-orders"
              onClick={() => onNavigate("orders")}
            >
              <span>Produktion prüfen</span>
              <small>{productionOrders.length} Aufträge in Produktion</small>
            </button>

            <button
              type="button"
              className="dashboard-action-item dashboard-action-invoices"
              onClick={() => onNavigate("invoices")}
            >
              <span>Zahlungen prüfen</span>
              <small>
                {overdueInvoices.length} überfällig · {openInvoices.length} offen
              </small>
            </button>

            <button
              type="button"
              className="dashboard-action-item dashboard-action-material"
              onClick={() => onNavigate("material")}
            >
              <span>Material prüfen</span>
              <small>{materialWarnings.length} Hinweise</small>
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}
