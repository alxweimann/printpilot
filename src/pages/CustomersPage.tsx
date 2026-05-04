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

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="Kundenmaske"
          title="Kundendaten bearbeiten"
          statusValue="Aktiv"
        />

        <div className="quotes-layout">
          <section className="workspace-panel quotes-list-panel">
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

                <tr>
                  <td>Beispiel AG</td>
                  <td>Mannheim</td>
                  <td>—</td>
                  <td>
                    <Badge>Aktiv</Badge>
                  </td>
                </tr>
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel quotes-editor-panel">
            <SectionHeader>Kundendaten</SectionHeader>

            <FieldGrid>
              <Field label="Kundennummer">
                <Input placeholder="wird später automatisch vergeben" disabled />
              </Field>

              <Field label="Firma">
                <Input placeholder="z. B. Sonnendruck GmbH" />
              </Field>

              <Field label="Kundentyp">
                <Select defaultValue="">
                  <option value="" disabled>
                    Kundentyp wählen
                  </option>
                  <option>Geschäftskunde</option>
                  <option>Privatkunde</option>
                  <option>Wiederverkäufer</option>
                  <option>Interner Kunde</option>
                </Select>
              </Field>

              <Field label="Straße">
                <Input placeholder="Straße und Hausnummer" />
              </Field>

              <Field label="PLZ">
                <Input inputMode="numeric" placeholder="z. B. 69168" />
              </Field>

              <Field label="Ort">
                <Input placeholder="z. B. Wiesloch" />
              </Field>
            </FieldGrid>

            <SectionHeader>Kontakt</SectionHeader>

            <FieldGrid>
              <Field label="Ansprechpartner">
                <Input placeholder="Name" />
              </Field>

              <Field label="Telefon">
                <Input placeholder="Telefonnummer" />
              </Field>

              <Field label="E-Mail">
                <Input type="email" placeholder="mail@example.de" />
              </Field>
            </FieldGrid>

            <SectionHeader>Konditionen</SectionHeader>

            <FieldGrid>
              <Field label="Zahlungsziel">
                <Select defaultValue="">
                  <option value="" disabled>
                    Zahlungsziel wählen
                  </option>
                  <option>Sofort ohne Abzug</option>
                  <option>14 Tage netto</option>
                  <option>30 Tage netto</option>
                </Select>
              </Field>

              <Field label="Preisstufe">
                <Select defaultValue="">
                  <option value="" disabled>
                    Preisstufe wählen
                  </option>
                  <option>Standard</option>
                  <option>Stammkunde</option>
                  <option>Sonderkondition</option>
                </Select>
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
              <Button variant="primary">Kunde speichern</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
