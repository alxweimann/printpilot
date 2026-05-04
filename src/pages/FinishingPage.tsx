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

export function FinishingPage() {
  const module = getModuleConfig("finishing");

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
          kicker="Weiterverarbeitungsmaske"
          title="Prozess verwalten"
          statusValue="Aktiv"
        />

        <div className="quotes-layout">
          <section className="workspace-panel quotes-list-panel">
            <TableToolbar>
              <Input className="search-input" placeholder="Prozesse suchen..." />
              <Button>Filter</Button>
            </TableToolbar>

            <DataTable>
              <thead>
                <tr>
                  <th>Prozess</th>
                  <th>Kategorie</th>
                  <th>Preislogik</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Schneiden</td>
                  <td>Standard</td>
                  <td>pro Auftrag</td>
                  <td>
                    <Badge variant="success">Aktiv</Badge>
                  </td>
                </tr>

                <tr>
                  <td>Falzen</td>
                  <td>Weiterverarbeitung</td>
                  <td>pro Stück</td>
                  <td>
                    <Badge>Aktiv</Badge>
                  </td>
                </tr>

                <tr>
                  <td>Rückendrahtheftung</td>
                  <td>Bindung</td>
                  <td>pro Stück</td>
                  <td>
                    <Badge>Aktiv</Badge>
                  </td>
                </tr>
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel quotes-editor-panel">
            <SectionHeader>Prozessdaten</SectionHeader>

            <FieldGrid>
              <Field label="Prozessnummer">
                <Input placeholder="wird später automatisch vergeben" disabled />
              </Field>

              <Field label="Bezeichnung">
                <Input placeholder="z. B. Schneiden" />
              </Field>

              <Field label="Kategorie">
                <Select defaultValue="">
                  <option value="" disabled>
                    Kategorie wählen
                  </option>
                  <option>Standard</option>
                  <option>Falzen</option>
                  <option>Bindung</option>
                  <option>Veredelung</option>
                  <option>Handarbeit</option>
                </Select>
              </Field>

              <Field label="Einheit">
                <Select defaultValue="">
                  <option value="" disabled>
                    Einheit wählen
                  </option>
                  <option>pro Auftrag</option>
                  <option>pro Stück</option>
                  <option>pro 100 Stück</option>
                  <option>pro Stunde</option>
                </Select>
              </Field>

              <Field label="Status">
                <Select defaultValue="Aktiv">
                  <option>Aktiv</option>
                  <option>Entwurf</option>
                  <option>Gesperrt</option>
                </Select>
              </Field>

              <Field label="Priorität">
                <Select defaultValue="Standard">
                  <option>Standard</option>
                  <option>Häufig</option>
                  <option>Spezialfall</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Kostenparameter</SectionHeader>

            <FieldGrid>
              <Field label="Grundpreis">
                <Input inputMode="decimal" placeholder="z. B. 12,50" />
              </Field>

              <Field label="Einzelpreis">
                <Input inputMode="decimal" placeholder="z. B. 0,025" />
              </Field>

              <Field label="Rüstzeit">
                <Input inputMode="decimal" placeholder="Minuten" />
              </Field>

              <Field label="Stundensatz">
                <Input inputMode="decimal" placeholder="z. B. 65,00" />
              </Field>

              <Field label="Mindestmenge">
                <Input inputMode="numeric" placeholder="Optional" />
              </Field>

              <Field label="Ausschuss">
                <Input inputMode="decimal" placeholder="z. B. 2 %" />
              </Field>
            </FieldGrid>

            <SectionHeader>Hinweise</SectionHeader>

            <FieldGrid>
              <Field label="Beschreibung">
                <Input placeholder="z. B. Endschnitt, Zwischenschnitt, Planschnitt" />
              </Field>

              <Field label="Maschinenbezug">
                <Input placeholder="Optional" />
              </Field>

              <Field label="Interne Notiz">
                <Input placeholder="Optional" />
              </Field>
            </FieldGrid>

            <div className="calculation-footer">
              <Button>Änderungen verwerfen</Button>
              <Button variant="primary">Prozess speichern</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
