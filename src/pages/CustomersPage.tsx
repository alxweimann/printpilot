import { getModuleConfig } from "../app/moduleConfig";
import { PageHeader } from "../layout/PageHeader";
import { PageTabs } from "../layout/PageTabs";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { DataTable, TableToolbar } from "../ui/Table";

export function CustomersPage() {
  const module = getModuleConfig("customers");

  return (
    <div className="page">
      <PageHeader
        title={module.title}
        description={module.description}
        actionLabel={module.actionLabel}
      />

      <PageTabs tabs={module.tabs ?? []} activeTab="Liste" />

      <section className="workspace-panel">
        <TableToolbar>
          <Input className="search-input" placeholder="Kunden suchen..." />
          <Button>Filter</Button>
        </TableToolbar>

        <DataTable>
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
                <Badge variant="success">Aktiv</Badge>
              </td>
            </tr>

            <tr>
              <td>Musterkunde GmbH</td>
              <td>Heidelberg</td>
              <td>—</td>
              <td>
                <Badge>Entwurf</Badge>
              </td>
            </tr>
          </tbody>
        </DataTable>
      </section>
    </div>
  );
}
