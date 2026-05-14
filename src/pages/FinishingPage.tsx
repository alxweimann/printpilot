import { useMemo, useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";
import {
  type PrintPilotFinishingProcess,
  type PrintPilotFinishingStatus,
  groupPrintPilotFinishingByStatus,
} from "../data/printPilotStore";
import { useEditableDraft } from "../hooks/useEditableDraft";
import { useMasterDetailSelection } from "../hooks/useMasterDetailSelection";
import { usePrintPilotStore } from "../store/PrintPilotStore";
import { getPrintPilotStatusBadgeVariant } from "../data/statusBadges";

import { PageHeader } from "../layout/PageHeader";
import { PageTabs } from "../layout/PageTabs";

import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { DirtyStateNotice } from "../ui/DirtyStateNotice";
import { EditLockToggle } from "../ui/EditLockToggle";
import { Field } from "../ui/Field";
import { FieldGrid } from "../ui/FieldGrid";
import { Input } from "../ui/Input";
import { SaveActionButton } from "../ui/SaveActionButton";
import { SectionHeader } from "../ui/SectionHeader";
import { Select } from "../ui/Select";
import { DataTable, TableToolbar } from "../ui/Table";
import { WorkspaceHeader } from "../ui/WorkspaceHeader";

const finishingTabs = ["Aktiv", "Optional", "Archiv"] as const;

type FinishingTab = PrintPilotFinishingStatus;

function getFinishingTitle(tab: FinishingTab) {
  switch (tab) {
    case "Aktiv":
      return "Aktive Weiterverarbeitung bearbeiten";

    case "Optional":
      return "Optionale Weiterverarbeitung bearbeiten";

    case "Archiv":
      return "Archivierte Weiterverarbeitung prüfen";
  }
}

function isFinishingTab(tab: string): tab is FinishingTab {
  return finishingTabs.includes(tab as FinishingTab);
}

export function FinishingPage() {
  const module = getModuleConfig("finishing");
  const { finishing, updateFinishingProcess } = usePrintPilotStore();

  const [isEditing, setIsEditing] = useState(false);

  const finishingRowsByTab = useMemo(() => {
    return groupPrintPilotFinishingByStatus(finishing);
  }, [finishing]);

  const {
    activeTab,
    rows: finishingRows,
    selectedItem: selectedProcess,
    setActiveTab,
    selectItem,
  } = useMasterDetailSelection({
    rowsByTab: finishingRowsByTab,
    initialTab: "Aktiv",
  });

  const { draft, isDirty, updateDraftField, resetDraft, saveDraft } =
    useEditableDraft(selectedProcess);

  const canEdit = isEditing && Boolean(draft);

  function handleTabChange(tab: string) {
    if (isFinishingTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
    }
  }

  function handleProcessSelect(processId: string) {
    selectItem(processId);
    setIsEditing(false);
  }

  function handleResetDraft() {
    resetDraft();
    setIsEditing(false);
  }

  function handleToggleEditing() {
    setIsEditing((currentValue) => !currentValue);
  }

  function handleSaveDraft() {
    if (!draft) {
      return;
    }

    const savedProcess = draft as PrintPilotFinishingProcess;

    updateFinishingProcess(savedProcess);
    saveDraft(savedProcess);
    setIsEditing(false);
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
          statusValue={isEditing ? "Bearbeitung offen" : activeTab}
        />

        <div className="master-detail-layout">
          <section className="workspace-panel master-list-panel">
            <TableToolbar>
              <Input
                className="search-input"
                placeholder="Weiterverarbeitung suchen..."
              />

              <Button>Filter</Button>
            </TableToolbar>

            <DataTable>
              <thead>
                <tr>
                  <th>Nr.</th>
                  <th>Name</th>
                  <th>Kategorie</th>
                  <th>Preismodell</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {finishingRows.map((process) => {
                  const isSelected = process.id === selectedProcess?.id;

                  return (
                    <tr
                      key={process.id}
                      className={
                        isSelected ? "data-table-row-selected" : undefined
                      }
                      onClick={() => handleProcessSelect(process.id)}
                    >
                      <td style={{ whiteSpace: "nowrap" }}>{process.number}</td>
                      <td>{process.name}</td>
                      <td>{process.category}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{process.pricing}</td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <Badge variant={getPrintPilotStatusBadgeVariant(process.status)}>
                          {process.status}
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
              <Field label="Nummer">
                <Input value={draft?.number ?? ""} readOnly />
              </Field>

              <Field label="Name">
                <Input
                  value={draft?.name ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("name", event.target.value)
                  }
                />
              </Field>

              <Field label="Kategorie">
                <Select
                  value={draft?.category ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField("category", event.target.value)
                  }
                >
                  <option>Schneiden</option>
                  <option>Falzen</option>
                  <option>Rillen</option>
                  <option>Heften</option>
                  <option>Binden</option>
                  <option>Stanzen</option>
                  <option>Manuell</option>
                </Select>
              </Field>

              <Field label="Preismodell">
                <Select
                  value={draft?.pricing ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField("pricing", event.target.value)
                  }
                >
                  <option>Rüstzeit + Zeit</option>
                  <option>Rüstzeit + Stück</option>
                  <option>Zeit</option>
                  <option>Pauschal</option>
                  <option>Archiv</option>
                </Select>
              </Field>

              <Field label="Status">
                <Select
                  value={draft?.status ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField(
                      "status",
                      event.target.value as PrintPilotFinishingStatus,
                    )
                  }
                >
                  {finishingTabs.map((tab) => (
                    <option key={tab}>{tab}</option>
                  ))}
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Kalkulationswerte</SectionHeader>

            <FieldGrid>
              <Field label="Standard-Einsatz">
                <Input
                  value={draft?.standardUsage ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("standardUsage", event.target.value)
                  }
                />
              </Field>

              <Field label="Rüstzeit Minuten">
                <Input
                  value={draft?.setupTime ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("setupTime", event.target.value)
                  }
                />
              </Field>

              <Field label="Stundensatz">
                <Input
                  value={draft?.hourlyRate ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("hourlyRate", event.target.value)
                  }
                />
              </Field>

              <Field label="Beschreibung">
                <Input
                  value={draft?.description ?? ""}
                  readOnly={!canEdit}
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

              <SaveActionButton
                isDirty={isDirty}
                defaultLabel="Weiterverarbeitung speichern"
                onClick={handleSaveDraft}
              />
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
