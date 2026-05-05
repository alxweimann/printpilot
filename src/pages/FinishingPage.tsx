import { getModuleConfig } from "../app/moduleConfig";
import { useMasterDetailSelection } from "../hooks/useMasterDetailSelection";
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
    { id: "finishing-schneiden", name: "Schneiden", category: "Standard", pricing: "pro Auftrag", status: "Aktiv", badgeVariant: "success" as const },
    { id: "finishing-falzen", name: "Falzen", category: "Falzen", pricing: "pro Stück", status: "Aktiv", badgeVariant: undefined },
    { id: "finishing-rueckendrahtheftung", name: "Rückendrahtheftung", category: "Bindung", pricing: "pro Stück", status: "Aktiv", badgeVariant: undefined },
  ],
  Standard: [
    { id: "finishing-schneiden", name: "Schneiden", category: "Standard", pricing: "pro Auftrag", status: "Aktiv", badgeVariant: "success" as const },
    { id: "finishing-rillen", name: "Rillen", category: "Standard", pricing: "pro Stück", status: "Aktiv", badgeVariant: undefined },
  ],
  Falzen: [
    { id: "finishing-falzen", name: "Falzen", category: "Falzen", pricing: "pro Stück", status: "Aktiv", badgeVariant: undefined },
  ],
  Bindung: [
    { id: "finishing-rueckendrahtheftung", name: "Rückendrahtheftung", category: "Bindung", pricing: "pro Stück", status: "Aktiv", badgeVariant: undefined },
    { id: "finishing-klebebindung", name: "Klebebindung", category: "Bindung", pricing: "pro Auftrag", status: "Aktiv", badgeVariant: undefined },
  ],
  Veredelung: [
    { id: "finishing-stanzen", name: "Stanzen", category: "Veredelung", pricing: "pro Auftrag", status: "Aktiv", badgeVariant: undefined },
  ],
  Handarbeit: [
    { id: "finishing-konfektionieren", name: "Konfektionieren", category: "Handarbeit", pricing: "pro Stunde", status: "Aktiv", badgeVariant: undefined },
  ],
};

function getFinishingTitle(tab: FinishingTab) {
  switch (tab) {
    case "Liste": return "Prozess verwalten";
    case "Standard": return "Standardprozess verwalten";
    case "Falzen": return "Falzprozess verwalten";
    case "Bindung": return "Bindung verwalten";
    case "Veredelung": return "Veredelung verwalten";
    case "Handarbeit": return "Handarbeit verwalten";
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

  const {
    activeTab,
    rows: finishingRows,
    selectedItem: selectedOperation,
    setActiveTab,
    selectItem,
  } = useMasterDetailSelection({
    rowsByTab: finishingRowsByTab,
    initialTab: "Liste",
  });

  function handleTabChange(tab: string) {
    if (isFinishingTab(tab)) {
      setActiveTab(tab);
    }
  }

  function handleOperationSelect(operationId: string) {
    selectItem(operationId);
  }

  return (
    <div className="page">
      <PageHeader title={module.title} description={module.description} actionLabel={module.actionLabel} />

      <PageTabs tabs={[...finishingTabs]} activeTab={activeTab} onTabChange={handleTabChange} />

      <section className="calculation-sheet">
        <WorkspaceHeader kicker="Weiterverarbeitung" title={getFinishingTitle(activeTab)} statusValue={getFinishingCategory(activeTab) || "Aktiv"} />

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
                {finishingRows.map((operation) => {
                  const isSelected = operation.id === selectedOperation?.id;

                  return (
                    <tr
                      key={operation.id}
                      className={isSelected ? "data-table-row-selected" : undefined}
                      onClick={() => handleOperationSelect(operation.id)}
                    >
                      <td>{operation.name}</td>
                      <td>{operation.category}</td>
                      <td>{operation.pricing}</td>
                      <td>
                        <Badge variant={operation.badgeVariant}>{operation.status}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel master-editor-panel">
            <SectionHeader>Prozessdaten</SectionHeader>

            <FieldGrid>
              <Field label="Prozess">
                <Input value={selectedOperation?.name ?? ""} readOnly />
              </Field>

              <Field label="Kategorie">
                <Select value={getFinishingCategory(activeTab) || selectedOperation?.category || ""} onChange={(event) => handleTabChange(event.target.value)}>
                  <option value="" disabled>Kategorie wählen</option>
                  <option>Standard</option>
                  <option>Falzen</option>
                  <option>Bindung</option>
                  <option>Veredelung</option>
                  <option>Handarbeit</option>
                </Select>
              </Field>

              <Field label="Einheit">
                <Select defaultValue={selectedOperation?.pricing ?? ""}>
                  <option value="" disabled>Einheit wählen</option>
                  <option>pro Auftrag</option>
                  <option>pro Stück</option>
                  <option>pro 100 Stück</option>
                  <option>pro Stunde</option>
                </Select>
              </Field>

              <Field label="Status">
                <Select defaultValue={selectedOperation?.status ?? "Aktiv"}>
                  <option>Aktiv</option>
                  <option>Entwurf</option>
                  <option>Gesperrt</option>
                </Select>
              </Field>

              <Field label="Standard">
                <Select defaultValue="Häufig">
                  <option>Häufig</option>
                  <option>Spezialfall</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Kostenparameter</SectionHeader>

            <FieldGrid>
              <Field label="Rüstzeit">
                <Input placeholder="Minuten" />
              </Field>

              <Field label="Stundensatz">
                <Input placeholder="0,00 €" />
              </Field>
            </FieldGrid>

            <SectionHeader>Hinweise</SectionHeader>

            <FieldGrid>
              <Field label="Beschreibung">
                <Input placeholder="Interne Beschreibung" />
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
