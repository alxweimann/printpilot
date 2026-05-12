import { useMemo, useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";
import {
  type PrintPilotMachine,
  type PrintPilotMachineStatus,
  groupPrintPilotMachinesByStatus,
} from "../data/printPilotStore";
import { useEditableDraft } from "../hooks/useEditableDraft";
import { useMasterDetailSelection } from "../hooks/useMasterDetailSelection";
import { usePrintPilotStore } from "../store/PrintPilotStore";

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

const machineTabs = ["Aktiv", "Wartung", "Archiv"] as const;

type MachineTab = PrintPilotMachineStatus;

function getMachineTitle(tab: MachineTab) {
  switch (tab) {
    case "Aktiv":
      return "Aktive Maschine bearbeiten";

    case "Wartung":
      return "Maschine in Wartung prüfen";

    case "Archiv":
      return "Archivierte Maschine prüfen";
  }
}

function isMachineTab(tab: string): tab is MachineTab {
  return machineTabs.includes(tab as MachineTab);
}

export function MachinesPage() {
  const module = getModuleConfig("machines");
  const { machines, updateMachine } = usePrintPilotStore();

  const [isEditing, setIsEditing] = useState(false);

  const machineRowsByTab = useMemo(() => {
    return groupPrintPilotMachinesByStatus(machines);
  }, [machines]);

  const {
    activeTab,
    rows: machineRows,
    selectedItem: selectedMachine,
    setActiveTab,
    selectItem,
  } = useMasterDetailSelection({
    rowsByTab: machineRowsByTab,
    initialTab: "Aktiv",
  });

  const { draft, isDirty, updateDraftField, resetDraft, saveDraft } =
    useEditableDraft(selectedMachine);

  const canEdit = isEditing && Boolean(draft);

  function handleTabChange(tab: string) {
    if (isMachineTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
    }
  }

  function handleMachineSelect(machineId: string) {
    selectItem(machineId);
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

    const savedMachine = draft as PrintPilotMachine;

    updateMachine(savedMachine);
    saveDraft(savedMachine);
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
        tabs={[...machineTabs]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="Druckmaschinen"
          title={getMachineTitle(activeTab)}
          statusValue={isEditing ? "Bearbeitung offen" : activeTab}
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
                  <th>Maschinennr.</th>
                  <th>Name</th>
                  <th>Typ</th>
                  <th>Farbmodus</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {machineRows.map((machine) => {
                  const isSelected = machine.id === selectedMachine?.id;

                  return (
                    <tr
                      key={machine.id}
                      className={
                        isSelected ? "data-table-row-selected" : undefined
                      }
                      onClick={() => handleMachineSelect(machine.id)}
                    >
                      <td>{machine.number}</td>
                      <td>{machine.name}</td>
                      <td>{machine.type}</td>
                      <td>{machine.colorMode}</td>
                      <td>
                        <Badge variant={machine.badgeVariant}>
                          {machine.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel master-editor-panel">
            <SectionHeader>Maschinendaten</SectionHeader>

            <FieldGrid>
              <Field label="Maschinennummer">
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

              <Field label="Maschinentyp">
                <Select
                  value={draft?.type ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField("type", event.target.value)
                  }
                >
                  <option>Digitaldruck</option>
                  <option>Schwarzweißdruck</option>
                  <option>Großformat</option>
                  <option>Weiterverarbeitung</option>
                </Select>
              </Field>

              <Field label="Farbmodus">
                <Input
                  value={draft?.colorMode ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("colorMode", event.target.value)
                  }
                />
              </Field>

              <Field label="Status">
                <Select
                  value={draft?.status ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField(
                      "status",
                      event.target.value as PrintPilotMachineStatus,
                    )
                  }
                >
                  {machineTabs.map((tab) => (
                    <option key={tab}>{tab}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Duplex">
                <Select
                  value={draft?.duplex ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField("duplex", event.target.value)
                  }
                >
                  <option>Ja</option>
                  <option>Nein</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Kalkulationswerte</SectionHeader>

            <FieldGrid>
              <Field label="Stundensatz">
                <Input
                  value={draft?.hourlyRate ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("hourlyRate", event.target.value)
                  }
                />
              </Field>

              <Field label="Klickkosten Farbe">
                <Input
                  value={draft?.colorClickCost ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("colorClickCost", event.target.value)
                  }
                />
              </Field>

              <Field label="Klickkosten Schwarz">
                <Input
                  value={draft?.blackClickCost ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("blackClickCost", event.target.value)
                  }
                />
              </Field>

              <Field label="Einsatzbereich">
                <Input
                  value={draft?.usage ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("usage", event.target.value)
                  }
                />
              </Field>

              <Field label="Notiz">
                <Input
                  value={draft?.note ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("note", event.target.value)
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
                defaultLabel="Maschine speichern"
                onClick={handleSaveDraft}
              />
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
