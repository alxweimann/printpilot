import { useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";

import { useEditableDraft } from "../hooks/useEditableDraft";
import { useMasterDetailSelection } from "../hooks/useMasterDetailSelection";

import { PageHeader } from "../layout/PageHeader";
import { PageTabs } from "../layout/PageTabs";

import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { DirtyStateNotice } from "../ui/DirtyStateNotice";
import { EditLockToggle } from "../ui/EditLockToggle";
import { Field } from "../ui/Field";
import { FieldGrid } from "../ui/FieldGrid";
import { Input } from "../ui/Input";
import { SectionHeader } from "../ui/SectionHeader";
import { Select } from "../ui/Select";
import { DataTable, TableToolbar } from "../ui/Table";
import { WorkspaceHeader } from "../ui/WorkspaceHeader";

const finishingTabs = [
  "Liste",
  "Standard",
  "Falzen",
  "Bindung",
  "Veredelung",
  "Handarbeit",
] as const;

type FinishingTab = (typeof finishingTabs)[number];

type FinishingRow = {
  id: string;
  name: string;
  category: string;
  pricing: string;
  status: string;
  standardUsage: string;
  setupTime: string;
  hourlyRate: string;
  description: string;
  badgeVariant?: "success";
};

const finishingRowsByTab: Record<FinishingTab, FinishingRow[]> = {
  Liste: [
    {
      id: "finishing-schneiden",
      name: "Schneiden",
      category: "Standard",
      pricing: "pro Auftrag",
      status: "Aktiv",
      standardUsage: "Häufig",
      setupTime: "5",
      hourlyRate: "75,00 €",
      description: "Standardzuschnitt",
      badgeVariant: "success",
    },
    {
      id: "finishing-falzen",
      name: "Falzen",
      category: "Falzen",
      pricing: "pro Stück",
      status: "Aktiv",
      standardUsage: "Häufig",
      setupTime: "10",
      hourlyRate: "75,00 €",
      description: "Standardfalz",
      badgeVariant: undefined,
    },
    {
      id: "finishing-rueckendrahtheftung",
      name: "Rückendrahtheftung",
      category: "Bindung",
      pricing: "pro Stück",
      status: "Aktiv",
      standardUsage: "Häufig",
      setupTime: "15",
      hourlyRate: "80,00 €",
      description: "Broschürenheftung",
      badgeVariant: undefined,
    },
  ],
  Standard: [
    {
      id: "finishing-schneiden",
      name: "Schneiden",
      category: "Standard",
      pricing: "pro Auftrag",
      status: "Aktiv",
      standardUsage: "Häufig",
      setupTime: "5",
      hourlyRate: "75,00 €",
      description: "Standardzuschnitt",
      badgeVariant: "success",
    },
    {
      id: "finishing-rillen",
      name: "Rillen",
      category: "Standard",
      pricing: "pro Stück",
      status: "Aktiv",
      standardUsage: "Häufig",
      setupTime: "10",
      hourlyRate: "75,00 €",
      description: "Rillen für starke Grammaturen",
      badgeVariant: undefined,
    },
  ],
  Falzen: [
    {
      id: "finishing-falzen",
      name: "Falzen",
      category: "Falzen",
      pricing: "pro Stück",
      status: "Aktiv",
      standardUsage: "Häufig",
      setupTime: "10",
      hourlyRate: "75,00 €",
      description: "Standardfalz",
      badgeVariant: undefined,
    },
  ],
  Bindung: [
    {
      id: "finishing-rueckendrahtheftung",
      name: "Rückendrahtheftung",
      category: "Bindung",
      pricing: "pro Stück",
      status: "Aktiv",
      standardUsage: "Häufig",
      setupTime: "15",
      hourlyRate: "80,00 €",
      description: "Broschürenheftung",
      badgeVariant: undefined,
    },
    {
      id: "finishing-klebebindung",
      name: "Klebebindung",
      category: "Bindung",
      pricing: "pro Auftrag",
      status: "Aktiv",
      standardUsage: "Spezialfall",
      setupTime: "30",
      hourlyRate: "85,00 €",
      description: "Klebebindung für umfangreiche Produkte",
      badgeVariant: undefined,
    },
  ],
  Veredelung: [
    {
      id: "finishing-stanzen",
      name: "Stanzen",
      category: "Veredelung",
      pricing: "pro Auftrag",
      status: "Aktiv",
      standardUsage: "Spezialfall",
      setupTime: "20",
      hourlyRate: "90,00 €",
      description: "Stanzarbeiten",
      badgeVariant: undefined,
    },
  ],
  Handarbeit: [
    {
      id: "finishing-konfektionieren",
      name: "Konfektionieren",
      category: "Handarbeit",
      pricing: "pro Stunde",
      status: "Aktiv",
      standardUsage: "Spezialfall",
      setupTime: "0",
      hourlyRate: "55,00 €",
      description: "Manuelle Konfektionierung",
      badgeVariant: undefined,
    },
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
    return "Aktiv";
  }

  return tab;
}

function isFinishingTab(tab: string): tab is FinishingTab {
  return finishingTabs.includes(tab as FinishingTab);
}

export function FinishingPage() {
  const module = getModuleConfig("finishing");

  const [isEditing, setIsEditing] = useState(false);

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

  const { draft, isDirty, updateDraftField, resetDraft } =
    useEditableDraft(selectedOperation);

  function handleTabChange(tab: string) {
    if (isFinishingTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
    }
  }

  function handleOperationSelect(operationId: string) {
    selectItem(operationId);
    setIsEditing(false);
  }

  function handleResetDraft() {
    resetDraft();
    setIsEditing(false);
  }

  function handleToggleEditing() {
    setIsEditing((currentValue) => !currentValue);
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
          kicker="Weiterverarbeitung"
          title={getFinishingTitle(activeTab)}
          statusValue={getFinishingCategory(activeTab)}
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
                {finishingRows.map((operation) => {
                  const isSelected = operation.id === selectedOperation?.id;

                  return (
                    <tr
                      key={operation.id}
                      className={
                        isSelected ? "data-table-row-selected" : undefined
                      }
                      onClick={() => handleOperationSelect(operation.id)}
                    >
                      <td>{operation.name}</td>
                      <td>{operation.category}</td>
                      <td>{operation.pricing}</td>
                      <td>
                        <Badge variant={operation.badgeVariant}>
                          {operation.status}
                        </Badge>
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
                <Input
                  value={draft?.name ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("name", event.target.value)
                  }
                />
              </Field>

              <Field label="Kategorie">
                <Select
                  value={draft?.category ?? ""}
                  onChange={(event) =>
                    updateDraftField("category", event.target.value)
                  }
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
                <Select
                  value={draft?.pricing ?? ""}
                  onChange={(event) =>
                    updateDraftField("pricing", event.target.value)
                  }
                >
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
                <Select
                  value={draft?.status ?? ""}
                  disabled={!isEditing}
                  onChange={(event) =>
                    updateDraftField("status", event.target.value)
                  }
                >
                  <option>Aktiv</option>
                  <option>Entwurf</option>
                  <option>Gesperrt</option>
                </Select>
              </Field>

              <Field label="Standard">
                <Select
                  value={draft?.standardUsage ?? ""}
                  disabled={!isEditing}
                  onChange={(event) =>
                    updateDraftField("standardUsage", event.target.value)
                  }
                >
                  <option>Häufig</option>
                  <option>Spezialfall</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Kostenparameter</SectionHeader>

            <FieldGrid>
              <Field label="Rüstzeit">
                <Input
                  value={draft?.setupTime ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("setupTime", event.target.value)
                  }
                />
              </Field>

              <Field label="Stundensatz">
                <Input
                  value={draft?.hourlyRate ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("hourlyRate", event.target.value)
                  }
                />
              </Field>
            </FieldGrid>

            <SectionHeader>Hinweise</SectionHeader>

            <FieldGrid>
              <Field label="Beschreibung">
                <Input
                  value={draft?.description ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("description", event.target.value)
                  }
                />
              </Field>
            </FieldGrid>

            <div className="calculation-footer">
              <DirtyStateNotice isDirty={isDirty} />

              <EditLockToggle

                isEditing={isEditing}

                onToggle={handleToggleEditing}

              />

              <Button onClick={handleResetDraft}>Änderungen verwerfen</Button>
              <Button variant="primary">
                {isDirty ? "Änderungen speichern" : "Prozess speichern"}
              </Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
