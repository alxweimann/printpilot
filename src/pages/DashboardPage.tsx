import { PageHeader } from "../layout/PageHeader";

export function DashboardPage() {
  return (
    <div className="page">
      <PageHeader
        title="Dashboard"
        description="Startbereich für PrintPilot. Später mit Kennzahlen, offenen Vorgängen und Schnellzugriffen."
      />

      <section className="workspace-panel">
        <div className="empty-state">
          <div className="empty-state-title">Designsystem gestartet</div>
          <div className="empty-state-text">
            Die Grundstruktur steht. Als nächstes werden Layout, Eingabemasken und Basiskomponenten verfeinert.
          </div>
        </div>
      </section>
    </div>
  );
}