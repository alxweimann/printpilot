import { PageHeader } from "../layout/PageHeader";
import { PageTabs } from "../layout/PageTabs";

type PlaceholderPageProps = {
  title: string;
  description: string;
  actionLabel?: string;
  tabs?: string[];
};

export function PlaceholderPage({
  title,
  description,
  actionLabel,
  tabs,
}: PlaceholderPageProps) {
  return (
    <div className="page">
      <PageHeader title={title} description={description} actionLabel={actionLabel} />

      {tabs && tabs.length > 0 ? <PageTabs tabs={tabs} activeTab={tabs[0]} /> : null}

      <section className="workspace-panel">
        <div className="empty-state">
          <div className="empty-state-title">{title}</div>
          <div className="empty-state-text">
            Dieses Modul ist bewusst nur als Platzhalter angelegt. Die Fachlogik
            wird später Schritt für Schritt gebaut.
          </div>
        </div>
      </section>
    </div>
  );
}
