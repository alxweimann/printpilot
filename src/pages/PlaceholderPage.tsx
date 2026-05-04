import { PageHeader } from "../layout/PageHeader";

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="page">
      <PageHeader title={title} description={description} />

      <section className="workspace-panel">
        <div className="empty-state">
          <div className="empty-state-title">{title}</div>
          <div className="empty-state-text">
            Dieses Modul ist bewusst nur als Platzhalter angelegt. Die Fachlogik wird später Schritt für Schritt gebaut.
          </div>
        </div>
      </section>
    </div>
  );
}