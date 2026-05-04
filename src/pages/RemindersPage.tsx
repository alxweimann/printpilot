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

export function RemindersPage() {
  const module = getModuleConfig("reminders");

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
          kicker="Mahnmaske"
          title="Mahnung vorbereiten"
          statusValue="Entwurf"
        />

        <div className="master-detail-layout">
          <section className="workspace-panel master-list-panel">
            <TableToolbar>
              <Input className="search-input" placeholder="Mahnungen suchen..." />
              <Button>Filter</Button>
            </TableToolbar>

            <DataTable>
              <thead>
                <tr>
                  <th>Mahnung</th>
                  <th>Kunde</th>
                  <th>Rechnung</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>MA-2026-001</td>
                  <td>Sonnendruck GmbH</td>
                  <td>RE-2026-001</td>
                  <td>
                    <Badge variant="success">Entwurf</Badge>
                  </td>
                </tr>

                <tr>
                  <td>MA-2026-002</td>
                  <td>Musterkunde GmbH</td>
                  <td>RE-2026-002</td>
                  <td>
                    <Badge>Offen</Badge>
                  </td>
                </tr>

                <tr>
                  <td>MA-2026-003</td>
                  <td>Beispiel AG</td>
                  <td>RE-2026-003</td>
                  <td>
                    <Badge>Stufe 2</Badge>
                  </td>
                </tr>
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel master-editor-panel">
            <SectionHeader>Mahnkopf</SectionHeader>

            <FieldGrid>
              <Field label="Mahnnummer">
                <Input placeholder="wird später automatisch vergeben" disabled />
              </Field>

              <Field label="Quelle">
                <Input placeholder="später aus Rechnung übernehmen" disabled />
              </Field>

              <Field label="Kunde">
                <Input placeholder="Kunde auswählen" />
              </Field>

              <Field label="Rechnung">
                <Input placeholder="Rechnungsbezug" disabled />
              </Field>

              <Field label="Mahndatum">
                <Input type="date" />
              </Field>

              <Field label="Status">
                <Select defaultValue="Entwurf">
                  <option>Entwurf</option>
                  <option>Offen</option>
                  <option>Versendet</option>
                  <option>Erledigt</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Mahninformationen</SectionHeader>

            <FieldGrid>
              <Field label="Mahnstufe">
                <Select defaultValue="">
                  <option value="" disabled>
                    Mahnstufe wählen
                  </option>
                  <option>Zahlungserinnerung</option>
                  <option>1. Mahnung</option>
                  <option>2. Mahnung</option>
                  <option>Letzte Mahnung</option>
                </Select>
              </Field>

              <Field label="Fällig seit">
                <Input placeholder="später aus Rechnung" disabled />
              </Field>

              <Field label="Offener Betrag">
                <Input placeholder="später aus Rechnung" disabled />
              </Field>
            </FieldGrid>

            <SectionHeader>Ausgabe</SectionHeader>

            <FieldGrid>
              <Field label="Mahnvorlage">
                <Select defaultValue="">
                  <option value="" disabled>
                    Vorlage wählen
                  </option>
                  <option>Zahlungserinnerung</option>
                  <option>Standardmahnung</option>
                  <option>Letzte Mahnung</option>
                </Select>
              </Field>

              <Field label="Frist">
                <Select defaultValue="">
                  <option value="" disabled>
                    Frist wählen
                  </option>
                  <option>7 Tage</option>
                  <option>10 Tage</option>
                  <option>14 Tage</option>
                </Select>
              </Field>

              <Field label="Interne Notiz">
                <Input placeholder="Optional" />
              </Field>
            </FieldGrid>

            <div className="calculation-footer">
              <Button>Entwurf speichern</Button>
              <Button>Vorschau prüfen</Button>
              <Button variant="primary">Mahnung ausgeben</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
