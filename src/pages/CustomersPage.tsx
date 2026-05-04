import { PageHeader } from "../layout/PageHeader";
import { PageTabs } from "../layout/PageTabs";

export function CustomersPage() {
  return (
    <div className="page">
      <PageHeader
        title="Kunden"
        description="Kundenstammdaten als kompakte Listenansicht. Noch ohne Speicherung."
        actionLabel="Neuer Kunde"
      />

      <PageTabs tabs={["Liste", "Details", "Kontakte", "Historie"]} activeTab="Liste" />

      <section className="workspace-panel">
        <div className="table-toolbar">
          <input className="search-input" placeholder="Kunden suchen..." />
          <button type="button" className="button-secondary">
            Filter
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Kunde</th>
              <th>Ort</th>
              <th>Telefon</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Sonnendruck GmbH</td>
              <td>Wiesloch</td>
              <td>—</td>
              <td>
                <span className="badge badge-success">Aktiv</span>
              </td>
            </tr>

            <tr>
              <td>Musterkunde GmbH</td>
              <td>Heidelberg</td>
              <td>—</td>
              <td>
                <span className="badge badge-muted">Entwurf</span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}