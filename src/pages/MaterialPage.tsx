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

export function MaterialPage() {
  const module = getModuleConfig("material");

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
          kicker="Materialmaske"
          title="Material verwalten"
          statusValue="Aktiv"
        />

        <div className="quotes-layout">
          <section className="workspace-panel quotes-list-panel">
            <TableToolbar>
              <Input className="search-input" placeholder="Material suchen..." />
              <Button>Filter</Button>
            </TableToolbar>

            <DataTable>
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Typ</th>
                  <th>Format</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>135 g/m² Bilderdruck matt</td>
                  <td>Papier</td>
                  <td>SRA3</td>
                  <td>
                    <Badge variant="success">Aktiv</Badge>
                  </td>
                </tr>

                <tr>
                  <td>300 g/m² Bilderdruck matt</td>
                  <td>Papier</td>
                  <td>SRA3</td>
                  <td>
                    <Badge>Aktiv</Badge>
                  </td>
                </tr>

                <tr>
                  <td>Versandkarton A4</td>
                  <td>Verpackung</td>
                  <td>A4</td>
                  <td>
                    <Badge>Entwurf</Badge>
                  </td>
                </tr>
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel quotes-editor-panel">
            <SectionHeader>Materialdaten</SectionHeader>

            <FieldGrid>
              <Field label="Materialnummer">
                <Input placeholder="wird später automatisch vergeben" disabled />
              </Field>

              <Field label="Bezeichnung">
                <Input placeholder="z. B. 135 g/m² Bilderdruck matt" />
              </Field>

              <Field label="Materialtyp">
                <Select defaultValue="">
                  <option value="" disabled>
                    Typ wählen
                  </option>
                  <option>Papier</option>
                  <option>Karton</option>
                  <option>Verpackung</option>
                  <option>Verbrauchsmaterial</option>
                </Select>
              </Field>

              <Field label="Grammatur">
                <Input inputMode="decimal" placeholder="z. B. 135" />
              </Field>

              <Field label="Format">
                <Select defaultValue="">
                  <option value="" disabled>
                    Format wählen
                  </option>
                  <option>SRA3</option>
                  <option>A3</option>
                  <option>A4</option>
                  <option>Freies Format</option>
                </Select>
              </Field>

              <Field label="Laufrichtung">
                <Select defaultValue="">
                  <option value="" disabled>
                    Laufrichtung wählen
                  </option>
                  <option>Schmalbahn</option>
                  <option>Breitbahn</option>
                  <option>Keine Angabe</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Preise</SectionHeader>

            <FieldGrid>
              <Field label="Preis pro Ries">
                <Input inputMode="decimal" placeholder="z. B. 42,50" />
              </Field>

              <Field label="Bögen pro Ries">
                <Input inputMode="numeric" placeholder="500" />
              </Field>

              <Field label="Preis pro Bogen">
                <Input placeholder="später berechnet" disabled />
              </Field>
            </FieldGrid>

            <SectionHeader>Lager</SectionHeader>

            <FieldGrid>
              <Field label="Bestand">
                <Input inputMode="numeric" placeholder="z. B. 2500" />
              </Field>

              <Field label="Mindestbestand">
                <Input inputMode="numeric" placeholder="z. B. 500" />
              </Field>

              <Field label="Status">
                <Select defaultValue="Aktiv">
                  <option>Aktiv</option>
                  <option>Entwurf</option>
                  <option>Gesperrt</option>
                </Select>
              </Field>
            </FieldGrid>

            <div className="calculation-footer">
              <Button>Änderungen verwerfen</Button>
              <Button variant="primary">Material speichern</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
