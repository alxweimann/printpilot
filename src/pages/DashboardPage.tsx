import { useMemo } from "react";

import { PageHeader } from "../layout/PageHeader";
import { Badge } from "../ui/Badge";
import { DataTable } from "../ui/Table";
import { usePrintPilotStore } from "../store/PrintPilotStore";

type DashboardPageProps = {
  onNavigate: (pageId: string) => void;
};

type DashboardActivity = {
  id: string;
  type: string;
  number: string;
  customerName: string;
  status: string;
  pageId: string;
  priority: string;
  hint: string;
  className: string;
  variant?: "success" | "warning" | "danger" | "neutral";
};

type ProductionTimelineDueGroup =
  | "Überfällig"
  | "Heute"
  | "Morgen"
  | "Später diese Woche";

type ProductionTimelineOrder = {
  id: string;
  number: string;
  customerName: string;
  product: string;
  status: string;
  dueDate: string;
  dueGroup: ProductionTimelineDueGroup;
  machine: string;
  priority: string;
  handoff: string;
  approval: string;
  progress: number;
  blocker: string | null;
  urgencyClassName: string;
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

function getStartOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function getDaysUntilDueDate(value: string) {
  const dueDate = new Date(value);

  if (Number.isNaN(dueDate.getTime())) {
    return 999;
  }

  const today = getStartOfDay(new Date());
  const dueDay = getStartOfDay(dueDate);

  return Math.round(
    (dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
}

function getProductionDueGroup(
  daysUntilDueDate: number,
): ProductionTimelineDueGroup {
  if (daysUntilDueDate < 0) {
    return "Überfällig";
  }

  if (daysUntilDueDate === 0) {
    return "Heute";
  }

  if (daysUntilDueDate === 1) {
    return "Morgen";
  }

  return "Später diese Woche";
}

function formatProductionDueDate(value: string) {
  const dueDate = new Date(value);

  if (Number.isNaN(dueDate.getTime())) {
    return "kein Fälligkeitsdatum";
  }

  return new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(dueDate);
}

function getProductionProgress(order: {
  approval: string;
  handoff: string;
  status: string;
}) {
  if (order.status === "Fertig") {
    return 100;
  }

  if (order.handoff === "Abholbereit" || order.handoff === "Versendet") {
    return 90;
  }

  if (order.handoff === "In Weiterverarbeitung") {
    return 70;
  }

  if (order.handoff === "In Druck" || order.status === "In Produktion") {
    return 55;
  }

  if (
    order.approval === "Freigabe ausstehend" ||
    order.approval === "Daten unvollständig" ||
    order.handoff === "Wartet auf Daten"
  ) {
    return 25;
  }

  if (order.handoff === "Druckdaten prüfen") {
    return 35;
  }

  if (order.status === "Wartet") {
    return 20;
  }

  if (order.status === "Neu") {
    return 10;
  }

  return 40;
}

function getProductionBlocker(order: {
  approval: string;
  handoff: string;
  status: string;
}) {
  if (order.approval === "Freigabe ausstehend") {
    return "Freigabe fehlt";
  }

  if (order.approval === "Daten unvollständig") {
    return "Daten unvollständig";
  }

  if (order.handoff === "Wartet auf Daten") {
    return "Wartet auf Druckdaten";
  }

  if (order.status === "Wartet") {
    return "Auftrag wartet";
  }

  return null;
}

function getProductionUrgencyClass(order: {
  blocker: string | null;
  daysUntilDueDate: number;
  priority: string;
}) {
  if (order.daysUntilDueDate < 0) {
    return "production-timeline-card-overdue";
  }

  if (order.blocker) {
    return "production-timeline-card-blocked";
  }

  if (order.priority === "Express") {
    return "production-timeline-card-express";
  }

  if (order.daysUntilDueDate === 0) {
    return "production-timeline-card-today";
  }

  return "production-timeline-card-normal";
}

function openDashboardActivity(
  activity: DashboardActivity,
  onNavigate: (pageId: string) => void,
) {
  window.sessionStorage.setItem(
    "printpilot:pending-selection",
    JSON.stringify({
      pageId: activity.pageId,
      itemId: activity.id,
    }),
  );

  onNavigate(activity.pageId);
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
    const overdueInvoiceRows = overdueInvoices.slice(0, 4).map((invoice) => ({
      id: invoice.id,
      type: "Rechnung",
      number: invoice.number,
      customerName: invoice.customerName,
      status: invoice.status,
      pageId: "invoices",
      priority: "Hoch",
      hint: "Zahlung / Mahnung prüfen",
      className: "dashboard-priority-critical",
      variant: "danger" as const,
    }));

    const reminderRows = openReminders.slice(0, 4).map((reminder) => ({
      id: reminder.id,
      type: "Mahnung",
      number: reminder.number,
      customerName: reminder.customerName,
      status: reminder.status,
      pageId: "reminders",
      priority: reminder.status === "Versendet" ? "Frist" : "Prüfen",
      hint: "Zahlungseingang prüfen",
      className: "dashboard-priority-warning",
      variant: "warning" as const,
    }));

    const deliveryRows = shippingReadyDeliveryNotes
      .slice(0, 3)
      .map((deliveryNote) => ({
        id: deliveryNote.id,
        type: "Lieferschein",
        number: deliveryNote.number,
        customerName: deliveryNote.customerName,
        status: deliveryNote.status,
        pageId: "delivery-notes",
        priority: "Versand",
        hint: "Versand / Abholung vorbereiten",
        className: "dashboard-priority-shipping",
        variant: "warning" as const,
      }));

    const productionOrderRows = productionOrders.slice(0, 4).map((order) => ({
      id: order.id,
      type: "Auftrag",
      number: order.number,
      customerName: order.customerName,
      status: order.status,
      pageId: "orders",
      priority: "Produktion",
      hint: "Produktionsstatus prüfen",
      className: "dashboard-priority-production",
      variant: "success" as const,
    }));

    const waitingOrderRows = waitingOrders.slice(0, 3).map((order) => ({
      id: order.id,
      type: "Auftrag",
      number: order.number,
      customerName: order.customerName,
      status: order.status,
      pageId: "orders",
      priority: "Wartet",
      hint: "Blocker prüfen",
      className: "dashboard-priority-waiting",
      variant: "warning" as const,
    }));

    const quoteRows = openQuotes.slice(0, 3).map((quote) => ({
      id: quote.id,
      type: "Angebot",
      number: quote.number,
      customerName: quote.customerName,
      status: quote.status,
      pageId: "quotes",
      priority: "Angebot",
      hint: "Nachfassen / Entscheidung prüfen",
      className: "dashboard-priority-normal",
      variant: "warning" as const,
    }));

    return [
      ...overdueInvoiceRows,
      ...reminderRows,
      ...deliveryRows,
      ...productionOrderRows,
      ...waitingOrderRows,
      ...quoteRows,
    ].slice(0, 10);
  }, [
    openQuotes,
    openReminders,
    overdueInvoices,
    productionOrders,
    shippingReadyDeliveryNotes,
    waitingOrders,
  ]);

  const productionTimelineOrders = useMemo<ProductionTimelineOrder[]>(() => {
    return orders
      .filter((order) => order.status !== "Fertig" && order.status !== "Archiv")
      .map((order) => {
        const daysUntilDueDate = getDaysUntilDueDate(order.dueDate);
        const blocker = getProductionBlocker(order);

        return {
          id: order.id,
          number: order.number,
          customerName: order.customerName,
          product: order.product,
          status: order.status,
          dueDate: order.dueDate,
          dueGroup: getProductionDueGroup(daysUntilDueDate),
          machine: order.machine,
          priority: order.priority,
          handoff: order.handoff,
          approval: order.approval,
          progress: getProductionProgress(order),
          blocker,
          urgencyClassName: getProductionUrgencyClass({
            blocker,
            daysUntilDueDate,
            priority: order.priority,
          }),
        };
      })
      .filter((order) => {
        const daysUntilDueDate = getDaysUntilDueDate(order.dueDate);

        return daysUntilDueDate <= 6;
      })
      .sort((firstOrder, secondOrder) => {
        const firstDue = getDaysUntilDueDate(firstOrder.dueDate);
        const secondDue = getDaysUntilDueDate(secondOrder.dueDate);

        if (firstDue !== secondDue) {
          return firstDue - secondDue;
        }

        if (firstOrder.priority === "Express" && secondOrder.priority !== "Express") {
          return -1;
        }

        if (secondOrder.priority === "Express" && firstOrder.priority !== "Express") {
          return 1;
        }

        return firstOrder.number.localeCompare(secondOrder.number);
      })
      .slice(0, 8);
  }, [orders]);
  const productionTimelineGroups = useMemo(() => {
    const dueGroups: ProductionTimelineDueGroup[] = [
      "Überfällig",
      "Heute",
      "Morgen",
      "Später diese Woche",
    ];

    return dueGroups
      .map((dueGroup) => ({
        dueGroup,
        orders: productionTimelineOrders.filter(
          (order) => order.dueGroup === dueGroup,
        ),
      }))
      .filter((group) => group.orders.length > 0);
  }, [productionTimelineOrders]);


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

      <section className="dashboard-stacked-layout">
        <div className="workspace-panel dashboard-full-panel dashboard-attention-panel">
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
                <th>Priorität</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {dashboardActivities.length > 0 ? (
                dashboardActivities.map((activity) => (
                  <tr
                    key={`${activity.type}-${activity.number}`}
                    className={`dashboard-work-row ${activity.className}`}
                    onClick={() => openDashboardActivity(activity, onNavigate)}
                  >
                    <td>{activity.type}</td>
                    <td>{activity.number}</td>
                    <td>
                      <strong>{activity.customerName}</strong>
                      <small>{activity.hint}</small>
                    </td>
                    <td>
                      <span className="dashboard-priority-pill">
                        {activity.priority}
                      </span>
                    </td>
                    <td>
                      <Badge variant={activity.variant}>{activity.status}</Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <strong>Keine kritischen Vorgänge.</strong> Aktuell gibt es
                    keine offenen Mahnungen, überfälligen Rechnungen oder
                    Produktionsengpässe.
                  </td>
                </tr>
              )}
            </tbody>
          </DataTable>
        </div>

        <div className="workspace-panel dashboard-full-panel production-timeline-panel">
          <div className="dashboard-panel-header dashboard-panel-header-split">
            <div>
              <div className="sheet-kicker">Plantafel</div>
              <h2>Diese Woche</h2>
            </div>

            <div className="dashboard-stand-pill">
              Stand: {formatDashboardTimestamp(new Date())}
            </div>
          </div>

          <div className="production-timeline">
            {productionTimelineGroups.length > 0 ? (
              productionTimelineGroups.map((group) => (
                <section
                  key={group.dueGroup}
                  className="production-timeline-group"
                >
                  <div className="production-timeline-group-header">
                    <h3>{group.dueGroup}</h3>
                    <span>{group.orders.length} Aufträge</span>
                  </div>

                  <div className="production-timeline-group-grid">
                    {group.orders.map((order) => (
                      <button
                        key={order.id}
                        type="button"
                        className={`production-timeline-card ${order.urgencyClassName}`}
                        onClick={() =>
                          openDashboardActivity(
                            {
                              id: order.id,
                              type: "Auftrag",
                              number: order.number,
                              customerName: order.customerName,
                              status: order.status,
                              pageId: "orders",
                              priority: order.priority,
                              hint: "Auftrag prüfen",
                              className: "dashboard-priority-production",
                              variant: "success",
                            },
                            onNavigate,
                          )
                        }
                      >
                        <div className="production-timeline-card-header">
                          <div>
                            <strong>{order.number}</strong>
                            <span>
                              {order.product} · {order.customerName}
                            </span>
                          </div>

                          <span className="production-timeline-priority">
                            {order.priority}
                          </span>
                        </div>

                        <div className="production-timeline-meta">
                          <span>{formatProductionDueDate(order.dueDate)}</span>
                          <span>{order.machine || "keine Maschine"}</span>
                        </div>

                        <div className="production-timeline-progress">
                          <div>
                            <span style={{ width: `${order.progress}%` }} />
                          </div>
                          <strong>{order.progress}%</strong>
                        </div>

                        <div className="production-timeline-details">
                          <span>Status: {order.status}</span>
                          <span>Freigabe: {order.approval}</span>
                          <span>Übergabe: {order.handoff}</span>
                        </div>

                        {order.blocker ? (
                          <div className="production-timeline-blocker">
                            ⚠ {order.blocker}
                          </div>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </section>
              ))
            ) : (
              <div className="production-timeline-empty">
                Keine offenen Aufträge für diese Woche.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
