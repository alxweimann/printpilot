import { getModuleConfig } from "../app/moduleConfig";
import { PageHeader } from "../layout/PageHeader";
import { PageTabs } from "../layout/PageTabs";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { DataTable, TableToolbar } from "../ui/Table";
import { WorkspaceHeader } from "../ui/WorkspaceHeader";

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

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="Angebotsmaske"
          title="Angebot erstellen"
          statusValue="Entwurf"
        />

        <div className="workspace-panel workspace-panel-flat">
          <TableToolbar>
            <Input className="search-input" placeholder="Angebote suchen..." />
            <Button>Filter</Button>
          </TableToolbar>

          <DataTable>
            <thead>
              <tr>
                <th>Angebot</th>
                <th>Kunde</th>
                <th>Betreff</th>
                <th>Datum</th>
                <th>Gültig bis</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>AG-2026-001</td>
                <td>Sonnendruck GmbH</td>
                <td>Broschüre A4, 32 Seiten</td>
                <td>04.05.2026</td>
                <td>18.05.2026</td>
                <td>
                  <Badge variant="success">Entwurf</Badge>
                </td>
              </tr>

              <tr>
                <td>AG-2026-002</td>
                <td>Musterkunde GmbH</td>
                <td>Flyer A5, 4/4-farbig</td>
                <td>04.05.2026</td>
                <td>18.05.2026</td>
                <td>
                  <Badge>Offen</Badge>
                </td>
              </tr>

              <tr>
                <td>AG-2026-003</td>
                <td>Beispiel AG</td>
                <td>Folder DIN lang</td>
                <td>03.05.2026</td>
                <td>17.05.2026</td>
                <td>
                  <Badge>In Prüfung</Badge>
                </td>
              </tr>
            </tbody>
          </DataTable>
        </div>
      </section>
    </div>
  );
}
