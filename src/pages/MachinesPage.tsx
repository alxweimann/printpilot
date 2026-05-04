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

export function MachinesPage() {
  const module = getModuleConfig("machines");

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
          kicker="Maschinenmaske"
          title="Maschine verwalten"
          statusValue="Aktiv"
        />

        <div className="master-detail-layout">
          <section className="workspace-panel master-list-panel">
            <TableToolbar>
              <Input className="search-input" placeholder="Maschinen suchen..." />
              <Button>Filter</Button>
            </TableToolbar>

            <DataTable>
              <thead>
                <tr>
                  <th>Maschine</th>
                  <th>Typ</th>
                  <th>Farbigkeit</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Xerox Iridesse</td>
                  <td>Digitaldruck</td>
                  <td>4/4 + Sonderfarben</td>
                  <td>
                    <Badge variant="success">Aktiv</Badge>
                  </td>
                </tr>

                <tr>
                  <td>Xerox Nuvera</td>
                  <td>Digitaldruck S/W</td>
                  <td>1/1 schwarz</td>
                  <td>
                    <Badge>Aktiv</Badge>
                  </td>
                </tr>

                <tr>
                  <td>Roland TrueVis VG3 540</td>
                  <td>Großformat</td>
                  <td>CMYK</td>
                  <td>
                    <Badge>Aktiv</Badge>
                  </td>
                </tr>
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel master-editor-panel">
            <SectionHeader>Maschinendaten</SectionHeader>

            <FieldGrid>
              <Field label="Maschinennummer">
                <Input placeholder="wird später automatisch vergeben" disabled />
              </Field>

              <Field label="Bezeichnung">
                <Input placeholder="z. B. Xerox Iridesse" />
              </Field>

              <Field label="Maschinentyp">
                <Select defaultValue="">
                  <option value="" disabled>
                    Typ wählen
                  </option>
                  <option>Digitaldruck Farbe</option>
                  <option>Digitaldruck Schwarz</option>
                  <option>Großformat</option>
                  <option>Inkjet Produktion</option>
                </Select>
              </Field>

              <Field label="Farbigkeit">
                <Select defaultValue="">
                  <option value="" disabled>
                    Farbigkeit wählen
                  </option>
                  <option>4/4-farbig</option>
                  <option>4/0-farbig</option>
                  <option>1/1 schwarz</option>
                  <option>1/0 schwarz</option>
                  <option>Sonderfarben</option>
                </Select>
              </Field>

              <Field label="Max. Format">
                <Input placeholder="z. B. SRA3" />
              </Field>

              <Field label="Status">
                <Select defaultValue="Aktiv">
                  <option>Aktiv</option>
                  <option>Wartung</option>
                  <option>Gesperrt</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Kostenparameter</SectionHeader>

            <FieldGrid>
              <Field label="Klickpreis schwarz">
                <Input inputMode="decimal" placeholder="z. B. 0,008" />
              </Field>

              <Field label="Klickpreis farbig">
                <Input inputMode="decimal" placeholder="z. B. 0,033" />
              </Field>

              <Field label="Stundensatz">
                <Input inputMode="decimal" placeholder="z. B. 85,00" />
              </Field>

              <Field label="Rüstzeit Standard">
                <Input inputMode="decimal" placeholder="Minuten" />
              </Field>

              <Field label="Produktivität">
                <Input inputMode="numeric" placeholder="Bögen / Stunde" />
              </Field>

              <Field label="Duplex">
                <Select defaultValue="">
                  <option value="" disabled>
                    Duplex wählen
                  </option>
                  <option>Ja</option>
                  <option>Nein</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Hinweise</SectionHeader>

            <FieldGrid>
              <Field label="Einsatzbereich">
                <Input placeholder="z. B. Broschüren, Flyer, Kleinauflagen" />
              </Field>

              <Field label="Bemerkung">
                <Input placeholder="Optional" />
              </Field>

              <Field label="Priorität">
                <Select defaultValue="Standard">
                  <option>Standard</option>
                  <option>Bevorzugt</option>
                  <option>Nur Spezialfälle</option>
                </Select>
              </Field>
            </FieldGrid>

            <div className="calculation-footer">
              <Button>Änderungen verwerfen</Button>
              <Button variant="primary">Maschine speichern</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
