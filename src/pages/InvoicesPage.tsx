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

export function InvoicesPage() {
  const module = getModuleConfig("invoices");

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
          kicker="Rechnungsmaske"
          title="Rechnung vorbereiten"
          statusValue="Entwurf"
        />

        <div className="master-detail-layout">
          <section className="workspace-panel master-list-panel">
            <TableToolbar>
              <Input className="search-input" placeholder="Rechnungen suchen..." />
              <Button>Filter</Button>
            </TableToolbar>

            <DataTable>
              <thead>
                <tr>
                  <th>Rechnung</th>
                  <th>Kunde</th>
                  <th>Betreff</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>RE-2026-001</td>
                  <td>Sonnendruck GmbH</td>
                  <td>Broschüre A4</td>
                  <td>
                    <Badge variant="success">Entwurf</Badge>
                  </td>
                </tr>

                <tr>
                  <td>RE-2026-002</td>
                  <td>Musterkunde GmbH</td>
                  <td>Flyer A5</td>
                  <td>
                    <Badge>Offen</Badge>
                  </td>
                </tr>

                <tr>
                  <td>RE-2026-003</td>
                  <td>Beispiel AG</td>
                  <td>Folder DIN lang</td>
                  <td>
                    <Badge>Bezahlt</Badge>
                  </td>
                </tr>
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel master-editor-panel">
            <SectionHeader>Rechnungskopf</SectionHeader>

            <FieldGrid>
              <Field label="Rechnungsnummer">
                <Input placeholder="wird später automatisch vergeben" disabled />
              </Field>

              <Field label="Quelle">
                <Input placeholder="später aus Auftrag übernehmen" disabled />
              </Field>

              <Field label="Kunde">
                <Input placeholder="Kunde auswählen" />
              </Field>

              <Field label="Rechnungsdatum">
                <Input type="date" />
              </Field>

              <Field label="Fällig am">
                <Input type="date" />
              </Field>

              <Field label="Status">
                <Select defaultValue="Entwurf">
                  <option>Entwurf</option>
                  <option>Offen</option>
                  <option>Teilbezahlt</option>
                  <option>Bezahlt</option>
                  <option>Überfällig</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Positionen</SectionHeader>

            <div className="master-position-table">
              <DataTable>
                <thead>
                  <tr>
                    <th>Pos.</th>
                    <th>Bezeichnung</th>
                    <th>Menge</th>
                    <th>Netto</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Leistung aus Auftrag übernehmen</td>
                    <td>—</td>
                    <td>—</td>
                  </tr>

                  <tr>
                    <td>2</td>
                    <td>Optionale Zusatzposition</td>
                    <td>—</td>
                    <td>—</td>
                  </tr>

                  <tr className="data-table-summary-row">
                    <td colSpan={3}>Rechnungssumme netto</td>
                    <td>—</td>
                  </tr>
                </tbody>
              </DataTable>
            </div>

            <SectionHeader>Zahlung & Ausgabe</SectionHeader>

            <FieldGrid>
              <Field label="Zahlungsbedingungen">
                <Select defaultValue="">
                  <option value="" disabled>
                    Bedingungen wählen
                  </option>
                  <option>Zahlbar sofort ohne Abzug</option>
                  <option>14 Tage netto</option>
                  <option>30 Tage netto</option>
                </Select>
              </Field>

              <Field label="Zahlungsart">
                <Select defaultValue="">
                  <option value="" disabled>
                    Zahlungsart wählen
                  </option>
                  <option>Überweisung</option>
                  <option>Barzahlung</option>
                  <option>EC / Karte</option>
                  <option>Lastschrift</option>
                </Select>
              </Field>

              <Field label="Rechnungsvorlage">
                <Select defaultValue="">
                  <option value="" disabled>
                    Vorlage wählen
                  </option>
                  <option>Standardrechnung</option>
                  <option>Kurzrechnung</option>
                  <option>Technische Rechnung</option>
                </Select>
              </Field>
            </FieldGrid>

            <div className="calculation-footer">
              <Button>Entwurf speichern</Button>
              <Button>Vorschau prüfen</Button>
              <Button variant="primary">Rechnung ausgeben</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
