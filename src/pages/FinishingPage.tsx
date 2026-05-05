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

const finishingTabs = ["Liste", "Standard", "Falzen", "Bindung", "Veredelung", "Handarbeit"] as const;

type FinishingTab = (typeof finishingTabs)[number];

const finishingRowsByTab = {
  Liste: [
    { name: "Schneiden", category: "Standard", pricing: "pro Auftrag", status: "Aktiv", badgeVariant: "success" as const },
    { name: "Falzen", category: "Falzen", pricing: "pro Stück", status: "Aktiv", badgeVariant: undefined },
    { name: "Rückendrahtheftung", category: "Bindung", pricing: "pro Stück", status: "Aktiv", badgeVariant: undefined },
  ],
  Standard: [
    { name: "Schneiden", category: "Standard", pricing: "pro Auftrag", status: "Aktiv", badgeVariant: "success" as const },
    { name: "Rillen", category: "Standard", pricing: "pro Stück", status: "Aktiv", badgeVariant: undefined },
  ],
  Falzen: [
    { name: "Falzen", category: "Falzen", pricing: "pro Stück", status: "Aktiv", badgeVariant: undefined },
  ],
  Bindung: [
    { name: "Rückendrahtheftung", category: "Bindung", pricing: "pro Stück", status: "Aktiv", badgeVariant: undefined },
    { name: "Klebebindung", category: "Bindung", pricing: "pro Auftrag", status: "Aktiv", badgeVariant: undefined },
  ],
  Veredelung: [
    { name: "Stanzen", category: "Veredelung", pricing: "pro Auftrag", status: "Aktiv", badgeVariant: undefined },
  ],
  Handarbeit: [
    { name: "Konfektionieren", category: "Handarbeit", pricing: "pro Stunde", status: "Aktiv", badgeVariant: undefined },
  ],
};

function getFinishingTitle(tab: FinishingTab) {
  switch (tab) {
    case "Liste":
      return "Prozess verwalten";
    case "Standard":
      return "Standardprozess verwalten";
    case "Falzen":
      return "Falzprozess verwalten";
    case "Bindung":
      return "Bindung verwalten";
    case "Veredelung":
      return "Veredelung verwalten";
    case "Handarbeit":
      return "Handarbeit verwalten";
  }
}

function getFinishingCategory(tab: FinishingTab) {
  if (tab === "Liste") {
    return "";
  }

  return tab;
}

function isFinishingTab(tab: string): tab is FinishingTab {
  return finishingTabs.includes(tab as FinishingTab);
}

export function FinishingPage() {
  const module = getModuleConfig("finishing");
  const [activeTab, setActiveTab] = useState<FinishingTab>("Liste");
  const finishingRows = finishingRowsByTab[activeTab];

  function handleTabChange(tab: string) {
    if (isFinishingTab(tab)) {
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
        tabs={[...finishingTabs]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="Weiterverarbeitungsmaske"
          title={getFinishingTitle(activeTab)}
          statusValue="Aktiv"
        />

        <div className="master-detail-layout">
          <section className="workspace-panel master-list-panel">
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
                {finishingRows.map((operation, index) => (
                  <tr
                    key={operation.name}
                    className={index === 0 ? "data-table-row-selected" : undefined}
                  >
                    <td>{operation.name}</td>
                    <td>{operation.category}</td>
                    <td>{operation.pricing}</td>
                    <td>
                      <Badge variant={operation.badgeVariant}>{operation.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel master-editor-panel">
            <SectionHeader>Prozessdaten</SectionHeader>

            <FieldGrid>
              <Field label="Prozessnummer">
                <Input placeholder="wird später automatisch vergeben" disabled />
              </Field>

              <Field label="Bezeichnung">
                <Input placeholder="z. B. Schneiden" />
              </Field>

              <Field label="Kategorie">
                <Select
                  value={getFinishingCategory(activeTab)}
                  onChange={(event) => handleTabChange(event.target.value)}
                >
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
