import { getModuleConfig } from "../app/moduleConfig";
import { PageHeader } from "../layout/PageHeader";
import { PageTabs } from "../layout/PageTabs";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { FieldGrid } from "../ui/FieldGrid";
import { Input } from "../ui/Input";
import { SectionHeader } from "../ui/SectionHeader";
import { Select } from "../ui/Select";
import { DataTable, TableToolbar } from "../ui/Table";
import { WorkspaceHeader } from "../ui/WorkspaceHeader";

export function OrdersPage() {
  const module = getModuleConfig("orders");

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
          kicker="Auftragsmaske"
          title="Auftrag vorbereiten"
          statusValue="In Vorbereitung"
        />

        <div className="quotes-layout">
          <section className="workspace-panel quotes-list-panel">
            <TableToolbar>
              <Input className="search-input" placeholder="Aufträge suchen..." />
              <Button>Filter</Button>
            </TableToolbar>

            <DataTable>
              <thead>
                <tr>
                  <th>Auftrag</th>
                  <th>Kunde</th>
                  <th>Produkt</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>AU-2026-001</td>
                  <td>Sonnendruck GmbH</td>
                  <td>Broschüre A4</td>
                  <td>
                    <Badge variant="success">Vorbereitung</Badge>
                  </td>
                </tr>

                <tr>
                  <td>AU-2026-002</td>
                  <td>Musterkunde GmbH</td>
                  <td>Flyer A5</td>
                  <td>
                    <Badge>Produktion</Badge>
                  </td>
                </tr>

                <tr>
                  <td>AU-2026-003</td>
                  <td>Beispiel AG</td>
                  <td>Folder DIN lang</td>
                  <td>
                    <Badge>Offen</Badge>
                  </td>
                </tr>
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel quotes-editor-panel">
            <SectionHeader>Auftragskopf</SectionHeader>

            <FieldGrid>
              <Field label="Auftragsnummer">
                <Input placeholder="wird später automatisch vergeben" disabled />
              </Field>

              <Field label="Quelle">
                <Input placeholder="später aus Angebot übernehmen" disabled />
              </Field>

              <Field label="Kunde">
                <Input placeholder="Kunde auswählen" />
              </Field>

              <Field label="Produkt">
                <Input placeholder="z. B. Broschüre A4" />
              </Field>

              <Field label="Auftragsdatum">
                <Input type="date" />
              </Field>

              <Field label="Liefertermin">
                <Input type="date" />
              </Field>
            </FieldGrid>

            <SectionHeader>Produktion</SectionHeader>

            <FieldGrid>
              <Field label="Produktionsstatus">
                <Select defaultValue="Vorbereitung">
                  <option>Vorbereitung</option>
                  <option>In Produktion</option>
                  <option>Weiterverarbeitung</option>
                  <option>Versandbereit</option>
                  <option>Abgeschlossen</option>
                </Select>
              </Field>

              <Field label="Maschine">
                <Select defaultValue="">
                  <option value="" disabled>
                    Maschine wählen
                  </option>
                  <option>Xerox Iridesse</option>
                  <option>Xerox Nuvera</option>
                  <option>Canon VP140</option>
                  <option>Roland TrueVis VG3 540</option>
                </Select>
              </Field>

              <Field label="Priorität">
                <Select defaultValue="Normal">
                  <option>Niedrig</option>
                  <option>Normal</option>
                  <option>Hoch</option>
                  <option>Eilt</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Übergabe</SectionHeader>

            <FieldGrid>
              <Field label="Druckdatenstatus">
                <Select defaultValue="">
                  <option value="" disabled>
                    Status wählen
                  </option>
                  <option>Fehlt</option>
                  <option>Prüfen</option>
                  <option>Freigegeben</option>
                </Select>
              </Field>

              <Field label="Freigabe">
                <Select defaultValue="">
                  <option value="" disabled>
                    Freigabe wählen
                  </option>
                  <option>Ausstehend</option>
                  <option>Erteilt</option>
                  <option>Korrektur erforderlich</option>
                </Select>
              </Field>

              <Field label="Interne Notiz">
                <Input placeholder="Optional" />
              </Field>
            </FieldGrid>

            <div className="calculation-footer">
              <Button>Entwurf speichern</Button>
              <Button variant="primary">Auftrag vorbereiten</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
