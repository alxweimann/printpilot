import { PageHeader } from "../layout/PageHeader";
import { Badge } from "../ui/Badge";
import { DataTable } from "../ui/Table";

export function DashboardPage() {
  return (
    <div className="page">
      <PageHeader
        title="Dashboard"
        description="Startbereich für PrintPilot. Später mit Kennzahlen, offenen Vorgängen und Schnellzugriffen."
      />

      <section className="dashboard-grid">
        <div className="dashboard-metric-card dashboard-metric-quotes">
          <div className="dashboard-metric-label">Offene Angebote</div>
          <div className="dashboard-metric-value">12</div>
          <div className="dashboard-metric-hint">3 Entwürfe, 9 offen</div>
        </div>

        <div className="dashboard-metric-card dashboard-metric-orders">
          <div className="dashboard-metric-label">Aktive Aufträge</div>
          <div className="dashboard-metric-value">8</div>
          <div className="dashboard-metric-hint">2 in Produktion</div>
        </div>

        <div className="dashboard-metric-card dashboard-metric-invoices">
          <div className="dashboard-metric-label">Offene Rechnungen</div>
          <div className="dashboard-metric-value">5</div>
          <div className="dashboard-metric-hint">später mit Summe</div>
        </div>

        <div className="dashboard-metric-card dashboard-metric-material">
          <div className="dashboard-metric-label">Materialhinweise</div>
          <div className="dashboard-metric-value">3</div>
          <div className="dashboard-metric-hint">Mindestbestand prüfen</div>
        </div>
      </section>

      <section className="master-detail-layout dashboard-layout">
        <div className="workspace-panel master-list-panel">
          <div className="dashboard-panel-header">
            <div>
              <div className="sheet-kicker">Vorgänge</div>
              <h2>Aktuelle Arbeiten</h2>
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
              <tr className="dashboard-work-row dashboard-work-quotes">
                <td>Angebot</td>
                <td>AG-2026-001</td>
                <td>Sonnendruck GmbH</td>
                <td>
                  <Badge variant="success">Entwurf</Badge>
                </td>
              </tr>

              <tr className="dashboard-work-row dashboard-work-orders">
                <td>Auftrag</td>
                <td>AU-2026-002</td>
                <td>Musterkunde GmbH</td>
                <td>
                  <Badge>Produktion</Badge>
                </td>
              </tr>

              <tr className="dashboard-work-row dashboard-work-invoices">
                <td>Rechnung</td>
                <td>RE-2026-003</td>
                <td>Beispiel AG</td>
                <td>
                  <Badge>Offen</Badge>
                </td>
              </tr>
            </tbody>
          </DataTable>
        </div>

        <div className="workspace-panel master-editor-panel">
          <div className="dashboard-panel-header">
            <div>
              <div className="sheet-kicker">Schnellzugriff</div>
              <h2>Nächste Aktionen</h2>
            </div>
          </div>

          <div className="dashboard-action-list">
            <button type="button" className="dashboard-action-item dashboard-action-calculation">
              <span>Kalkulation starten</span>
              <small>neues Druckprodukt vorbereiten</small>
            </button>

            <button type="button" className="dashboard-action-item dashboard-action-quotes">
              <span>Angebot erstellen</span>
              <small>aus Kalkulation oder manuell</small>
            </button>

            <button type="button" className="dashboard-action-item dashboard-action-customers">
              <span>Kunde anlegen</span>
              <small>Stammdaten vorbereiten</small>
            </button>

            <button type="button" className="dashboard-action-item dashboard-action-material">
              <span>Material prüfen</span>
              <small>Preise und Lagerbestand</small>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
