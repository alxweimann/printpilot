import { getModuleConfig } from "../app/moduleConfig";
import { PageHeader } from "../layout/PageHeader";
import { PageTabs } from "../layout/PageTabs";

export function QuotesPage() {
  const module = getModuleConfig("quotes");

  return (
    <div className="page">
      <PageHeader
        title={module.title}
        description={module.description}
        actionLabel={module.actionLabel}
      />

      <PageTabs tabs={module.tabs ?? []} activeTab="Liste" />

      <section className="workspace-panel">
        <div className="empty-state">
          <div className="empty-state-title">Angebote</div>
          <div className="empty-state-text">
            Die Angebotsseite ist als eigenständige Seite vorbereitet. Die Gestaltung wird im nächsten Schritt erweitert.
          </div>
        </div>
      </section>
    </div>
  );
}