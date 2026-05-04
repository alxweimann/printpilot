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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.95fr) minmax(420px, 1.05fr)",
            gap: "14px",
            padding: "18px",
            alignItems: "start",
          }}
        >
          <section
            className="workspace-panel"
            style={{
              boxShadow: "none",
            }}
          >
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
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>AG-2026-001</td>
                  <td>Sonnendruck GmbH</td>
                  <td>Broschüre A4</td>
                  <td>
                    <Badge variant="success">Entwurf</Badge>
                  </td>
                </tr>

                <tr>
                  <td>AG-2026-002</td>
                  <td>Musterkunde GmbH</td>
                  <td>Flyer A5</td>
                  <td>
                    <Badge>Offen</Badge>
                  </td>
                </tr>

                <tr>
                  <td>AG-2026-003</td>
                  <td>Beispiel AG</td>
                  <td>Folder DIN lang</td>
                  <td>
                    <Badge>In Prüfung</Badge>
                  </td>
                </tr>
              </tbody>
            </DataTable>
          </section>

          <section
            className="workspace-panel"
            style={{
              boxShadow: "none",
              padding: 0,
              overflow: "hidden",
            }}
          >
            <SectionHeader>Angebotskopf</SectionHeader>

            <FieldGrid>
              <Field label="Angebotsnummer">
                <Input placeholder="wird später automatisch vergeben" disabled />
              </Field>

              <Field label="Kunde">
                <Input placeholder="Kunde auswählen" />
              </Field>

              <Field label="Angebotsdatum">
                <Input type="date" />
              </Field>

              <Field label="Betreff">
                <Input placeholder="z. B. Angebot Broschüre A4" />
              </Field>

              <Field label="Gültig bis">
                <Input type="date" />
              </Field>

              <Field label="Status">
                <Select defaultValue="Entwurf">
                  <option>Entwurf</option>
                  <option>Offen</option>
                  <option>Angenommen</option>
                  <option>Abgelehnt</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Konditionen</SectionHeader>

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

              <Field label="Lieferbedingungen">
                <Select defaultValue="">
                  <option value="" disabled>
                    Lieferung wählen
                  </option>
                  <option>Abholung</option>
                  <option>Lieferung inklusive</option>
                  <option>Versand nach Aufwand</option>
                </Select>
              </Field>

              <Field label="Angebotsvorlage">
                <Select defaultValue="">
                  <option value="" disabled>
                    Vorlage wählen
                  </option>
                  <option>Standardangebot</option>
                  <option>Kurzangebot</option>
                  <option>Technisches Angebot</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Positionen</SectionHeader>

            <div style={{ padding: "0 18px" }}>
              <DataTable>
                <thead>
                  <tr>
                    <th>Pos.</th>
                    <th>Bezeichnung</th>
                    <th>Menge</th>
                    <th>Gesamt</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Druckprodukt aus Kalkulation übernehmen</td>
                    <td>—</td>
                    <td>—</td>
                  </tr>

                  <tr>
                    <td>2</td>
                    <td>Optionale Zusatzleistung</td>
                    <td>—</td>
                    <td>—</td>
                  </tr>
                </tbody>
              </DataTable>
            </div>

            <div className="calculation-footer">
              <Button>Entwurf speichern</Button>
              <Button variant="primary">Zur Vorschau</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
