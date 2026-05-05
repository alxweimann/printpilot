import { useState } from "react";
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

const serviceTabs = ["Liste", "Vorstufe", "Satz / Layout", "Produktion", "Zuschlag", "Sonstiges"] as const;

type ServiceTab = (typeof serviceTabs)[number];

const serviceRowsByTab = {
  Liste: [
    { name: "Datenprüfung", group: "Vorstufe", unit: "pauschal", status: "Aktiv", badgeVariant: "success" as const },
    { name: "Grafische Anpassung", group: "Satz / Layout", unit: "pro Stunde", status: "Aktiv", badgeVariant: undefined },
    { name: "Expresszuschlag", group: "Zuschlag", unit: "pauschal", status: "Aktiv", badgeVariant: undefined },
  ],
  Vorstufe: [
    { name: "Datenprüfung", group: "Vorstufe", unit: "pauschal", status: "Aktiv", badgeVariant: "success" as const },
    { name: "PDF-Korrektur", group: "Vorstufe", unit: "pro Stunde", status: "Aktiv", badgeVariant: undefined },
  ],
  "Satz / Layout": [
    { name: "Grafische Anpassung", group: "Satz / Layout", unit: "pro Stunde", status: "Aktiv", badgeVariant: undefined },
  ],
  Produktion: [
    { name: "Produktionspauschale", group: "Produktion", unit: "pro Auftrag", status: "Aktiv", badgeVariant: undefined },
  ],
  Zuschlag: [
    { name: "Expresszuschlag", group: "Zuschlag", unit: "pauschal", status: "Aktiv", badgeVariant: undefined },
  ],
  Sonstiges: [
    { name: "Sonderleistung", group: "Sonstiges", unit: "pauschal", status: "Entwurf", badgeVariant: undefined },
  ],
};

function getServiceTitle(tab: ServiceTab) {
  switch (tab) {
    case "Liste":
      return "Leistung verwalten";
    case "Vorstufe":
      return "Vorstufenleistung verwalten";
    case "Satz / Layout":
      return "Satz- und Layoutleistung verwalten";
    case "Produktion":
      return "Produktionsleistung verwalten";
    case "Zuschlag":
      return "Zuschlag verwalten";
    case "Sonstiges":
      return "Sonstige Leistung verwalten";
  }
}

function getServiceGroup(tab: ServiceTab) {
  if (tab === "Liste") {
    return "";
  }

  return tab;
}

function isServiceTab(tab: string): tab is ServiceTab {
  return serviceTabs.includes(tab as ServiceTab);
}

export function ServicesPage() {
  const module = getModuleConfig("services");
  const [activeTab, setActiveTab] = useState<ServiceTab>("Liste");
  const serviceRows = serviceRowsByTab[activeTab];

  function handleTabChange(tab: string) {
    if (isServiceTab(tab)) {
      setActiveTab(tab);
    }
  }

  return (
    <div className="page">
      <PageHeader
        title={module.title}
        description={module.description}
        actionLabel={module.actionLabel}
      />

      <PageTabs
        tabs={[...serviceTabs]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="Leistungsmaske"
          title={getServiceTitle(activeTab)}
          statusValue="Aktiv"
        />

        <div className="master-detail-layout">
          <section className="workspace-panel master-list-panel">
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
                {serviceRows.map((service, index) => (
                  <tr
                    key={service.name}
                    className={index === 0 ? "data-table-row-selected" : undefined}
                  >
                    <td>{service.name}</td>
                    <td>{service.group}</td>
                    <td>{service.unit}</td>
                    <td>
                      <Badge variant={service.badgeVariant}>{service.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel master-editor-panel">
            <SectionHeader>Leistungsdaten</SectionHeader>

            <FieldGrid>
              <Field label="Leistungsnummer">
                <Input placeholder="wird später automatisch vergeben" disabled />
              </Field>

              <Field label="Bezeichnung">
                <Input placeholder="z. B. Datenprüfung" />
              </Field>

              <Field label="Leistungsgruppe">
                <Select
                  value={getServiceGroup(activeTab)}
                  onChange={(event) => handleTabChange(event.target.value)}
                >
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
