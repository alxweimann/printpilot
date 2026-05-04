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

export function TemplatesPage() {
  const module = getModuleConfig("templates");

  return (
    <div className="page">
      <PageHeader
        title={module.title}
        description={module.description}
        actionLabel={module.actionLabel}
      />

      <PageTabs tabs={module.tabs ?? []} activeTab="Produkte" />

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="Vorlagenmaske"
          title="Vorlage verwalten"
          statusValue="Aktiv"
        />

        <div className="master-detail-layout">
          <section className="workspace-panel master-list-panel">
            <TableToolbar>
              <Input className="search-input" placeholder="Vorlagen suchen..." />
              <Button>Filter</Button>
            </TableToolbar>

            <DataTable>
              <thead>
                <tr>
                  <th>Vorlage</th>
                  <th>Typ</th>
                  <th>Bereich</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Broschüre A4 Standard</td>
                  <td>Produkt</td>
                  <td>Kalkulation</td>
                  <td>
                    <Badge variant="success">Aktiv</Badge>
                  </td>
                </tr>

                <tr>
                  <td>Standardangebot</td>
                  <td>Dokument</td>
                  <td>Angebote</td>
                  <td>
                    <Badge>Aktiv</Badge>
                  </td>
                </tr>

                <tr>
                  <td>Rechnung Standard</td>
                  <td>Dokument</td>
                  <td>Rechnungen</td>
                  <td>
                    <Badge>Entwurf</Badge>
                  </td>
                </tr>
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel master-editor-panel">
            <SectionHeader>Vorlagendaten</SectionHeader>

            <FieldGrid>
              <Field label="Vorlagennummer">
                <Input placeholder="wird später automatisch vergeben" disabled />
              </Field>

              <Field label="Bezeichnung">
                <Input placeholder="z. B. Broschüre A4 Standard" />
              </Field>

              <Field label="Vorlagentyp">
                <Select defaultValue="">
                  <option value="" disabled>
                    Typ wählen
                  </option>
                  <option>Produkt</option>
                  <option>Dokument</option>
                  <option>Textbaustein</option>
                  <option>Layout</option>
                </Select>
              </Field>

              <Field label="Bereich">
                <Select defaultValue="">
                  <option value="" disabled>
                    Bereich wählen
                  </option>
                  <option>Kalkulation</option>
                  <option>Angebote</option>
                  <option>Aufträge</option>
                  <option>Rechnungen</option>
                  <option>Lieferscheine</option>
                </Select>
              </Field>

              <Field label="Status">
                <Select defaultValue="Aktiv">
                  <option>Aktiv</option>
                  <option>Entwurf</option>
                  <option>Gesperrt</option>
                </Select>
              </Field>

              <Field label="Standard">
                <Select defaultValue="Nein">
                  <option>Nein</option>
                  <option>Ja</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Produktparameter</SectionHeader>

            <FieldGrid>
              <Field label="Produktart">
                <Select defaultValue="">
                  <option value="" disabled>
                    Produktart wählen
                  </option>
                  <option>Broschüre</option>
                  <option>Flyer</option>
                  <option>Folder</option>
                  <option>Plakat</option>
                  <option>Freies Produkt</option>
                </Select>
              </Field>

              <Field label="Format">
                <Input placeholder="z. B. A4" />
              </Field>

              <Field label="Standardumfang">
                <Input inputMode="numeric" placeholder="z. B. 32 Seiten" />
              </Field>

              <Field label="Papier Inhalt">
                <Input placeholder="Optional" />
              </Field>

              <Field label="Papier Umschlag">
                <Input placeholder="Optional" />
              </Field>

              <Field label="Weiterverarbeitung">
                <Input placeholder="Optional" />
              </Field>
            </FieldGrid>

            <SectionHeader>Ausgabe</SectionHeader>

            <FieldGrid>
              <Field label="Dokumentlayout">
                <Select defaultValue="">
                  <option value="" disabled>
                    Layout wählen
                  </option>
                  <option>Standard</option>
                  <option>Kurzform</option>
                  <option>Technisch</option>
                </Select>
              </Field>

              <Field label="Textbaustein">
                <Input placeholder="Optional" />
              </Field>

              <Field label="Interne Notiz">
                <Input placeholder="Optional" />
              </Field>
            </FieldGrid>

            <div className="calculation-footer">
              <Button>Änderungen verwerfen</Button>
              <Button variant="primary">Vorlage speichern</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
