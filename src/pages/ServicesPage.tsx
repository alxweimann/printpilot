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

export function ServicesPage() {
  const module = getModuleConfig("services");

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
          kicker="Leistungsmaske"
          title="Leistung verwalten"
          statusValue="Aktiv"
        />

        <div className="quotes-layout">
          <section className="workspace-panel quotes-list-panel">
            <TableToolbar>
              <Input className="search-input" placeholder="Leistungen suchen..." />
              <Button>Filter</Button>
            </TableToolbar>

            <DataTable>
              <thead>
                <tr>
                  <th>Leistung</th>
                  <th>Gruppe</th>
                  <th>Einheit</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Datenprüfung</td>
                  <td>Vorstufe</td>
                  <td>pauschal</td>
                  <td>
                    <Badge variant="success">Aktiv</Badge>
                  </td>
                </tr>

                <tr>
                  <td>Grafische Anpassung</td>
                  <td>Satz / Layout</td>
                  <td>pro Stunde</td>
                  <td>
                    <Badge>Aktiv</Badge>
                  </td>
                </tr>

                <tr>
                  <td>Expresszuschlag</td>
                  <td>Zuschlag</td>
                  <td>pauschal</td>
                  <td>
                    <Badge>Aktiv</Badge>
                  </td>
                </tr>
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel quotes-editor-panel">
            <SectionHeader>Leistungsdaten</SectionHeader>

            <FieldGrid>
              <Field label="Leistungsnummer">
                <Input placeholder="wird später automatisch vergeben" disabled />
              </Field>

              <Field label="Bezeichnung">
                <Input placeholder="z. B. Datenprüfung" />
              </Field>

              <Field label="Leistungsgruppe">
                <Select defaultValue="">
                  <option value="" disabled>
                    Gruppe wählen
                  </option>
                  <option>Vorstufe</option>
                  <option>Satz / Layout</option>
                  <option>Produktion</option>
                  <option>Zuschlag</option>
                  <option>Sonstiges</option>
                </Select>
              </Field>

              <Field label="Einheit">
                <Select defaultValue="">
                  <option value="" disabled>
                    Einheit wählen
                  </option>
                  <option>pauschal</option>
                  <option>pro Stunde</option>
                  <option>pro Stück</option>
                  <option>pro Auftrag</option>
                </Select>
              </Field>

              <Field label="Status">
                <Select defaultValue="Aktiv">
                  <option>Aktiv</option>
                  <option>Entwurf</option>
                  <option>Gesperrt</option>
                </Select>
              </Field>

              <Field label="In Angebot anzeigen">
                <Select defaultValue="Ja">
                  <option>Ja</option>
                  <option>Nein</option>
                  <option>Optional</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Preise</SectionHeader>

            <FieldGrid>
              <Field label="Standardpreis">
                <Input inputMode="decimal" placeholder="z. B. 25,00" />
              </Field>

              <Field label="Mindestpreis">
                <Input inputMode="decimal" placeholder="Optional" />
              </Field>

              <Field label="Kostenbasis">
                <Input inputMode="decimal" placeholder="interner Kostenwert" />
              </Field>
            </FieldGrid>

            <SectionHeader>Beschreibung</SectionHeader>

            <FieldGrid>
              <Field label="Kurztext">
                <Input placeholder="Text für Angebot / Rechnung" />
              </Field>

              <Field label="Interne Notiz">
                <Input placeholder="Optional" />
              </Field>

              <Field label="Sortierung">
                <Input inputMode="numeric" placeholder="z. B. 10" />
              </Field>
            </FieldGrid>

            <div className="calculation-footer">
              <Button>Änderungen verwerfen</Button>
              <Button variant="primary">Leistung speichern</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
