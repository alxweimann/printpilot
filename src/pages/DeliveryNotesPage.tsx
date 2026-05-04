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

export function DeliveryNotesPage() {
  const module = getModuleConfig("delivery-notes");

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
          kicker="Lieferscheinmaske"
          title="Lieferschein vorbereiten"
          statusValue="Entwurf"
        />

        <div className="quotes-layout">
          <section className="workspace-panel quotes-list-panel">
            <TableToolbar>
              <Input className="search-input" placeholder="Lieferscheine suchen..." />
              <Button>Filter</Button>
            </TableToolbar>

            <DataTable>
              <thead>
                <tr>
                  <th>Lieferschein</th>
                  <th>Kunde</th>
                  <th>Auftrag</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>LS-2026-001</td>
                  <td>Sonnendruck GmbH</td>
                  <td>AU-2026-001</td>
                  <td>
                    <Badge variant="success">Entwurf</Badge>
                  </td>
                </tr>

                <tr>
                  <td>LS-2026-002</td>
                  <td>Musterkunde GmbH</td>
                  <td>AU-2026-002</td>
                  <td>
                    <Badge>Versandbereit</Badge>
                  </td>
                </tr>

                <tr>
                  <td>LS-2026-003</td>
                  <td>Beispiel AG</td>
                  <td>AU-2026-003</td>
                  <td>
                    <Badge>Geliefert</Badge>
                  </td>
                </tr>
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel quotes-editor-panel">
            <SectionHeader>Lieferscheinkopf</SectionHeader>

            <FieldGrid>
              <Field label="Lieferscheinnummer">
                <Input placeholder="wird später automatisch vergeben" disabled />
              </Field>

              <Field label="Quelle">
                <Input placeholder="später aus Auftrag übernehmen" disabled />
              </Field>

              <Field label="Kunde">
                <Input placeholder="Kunde auswählen" />
              </Field>

              <Field label="Lieferdatum">
                <Input type="date" />
              </Field>

              <Field label="Versandart">
                <Select defaultValue="">
                  <option value="" disabled>
                    Versandart wählen
                  </option>
                  <option>Abholung</option>
                  <option>Auslieferung</option>
                  <option>Paketdienst</option>
                  <option>Spedition</option>
                </Select>
              </Field>

              <Field label="Status">
                <Select defaultValue="Entwurf">
                  <option>Entwurf</option>
                  <option>Versandbereit</option>
                  <option>Geliefert</option>
                  <option>Abgeschlossen</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Lieferadresse</SectionHeader>

            <FieldGrid>
              <Field label="Firma / Name">
                <Input placeholder="Empfänger" />
              </Field>

              <Field label="Straße">
                <Input placeholder="Straße und Hausnummer" />
              </Field>

              <Field label="PLZ / Ort">
                <Input placeholder="PLZ und Ort" />
              </Field>
            </FieldGrid>

            <SectionHeader>Positionen</SectionHeader>

            <div className="quotes-position-table">
              <DataTable>
                <thead>
                  <tr>
                    <th>Pos.</th>
                    <th>Bezeichnung</th>
                    <th>Menge</th>
                    <th>Einheit</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Produkt aus Auftrag übernehmen</td>
                    <td>—</td>
                    <td>Stk.</td>
                  </tr>

                  <tr>
                    <td>2</td>
                    <td>Verpackungseinheit</td>
                    <td>—</td>
                    <td>Karton</td>
                  </tr>
                </tbody>
              </DataTable>
            </div>

            <SectionHeader>Ausgabe</SectionHeader>

            <FieldGrid>
              <Field label="Lieferscheinvorlage">
                <Select defaultValue="">
                  <option value="" disabled>
                    Vorlage wählen
                  </option>
                  <option>Standardlieferschein</option>
                  <option>Neutraler Lieferschein</option>
                  <option>Technischer Lieferschein</option>
                </Select>
              </Field>

              <Field label="Packhinweis">
                <Input placeholder="Optional" />
              </Field>

              <Field label="Interne Notiz">
                <Input placeholder="Optional" />
              </Field>
            </FieldGrid>

            <div className="calculation-footer">
              <Button>Entwurf speichern</Button>
              <Button>Vorschau prüfen</Button>
              <Button variant="primary">Lieferschein ausgeben</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
