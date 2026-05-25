import { useMemo, useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";
import {
  type PrintPilotReminder,
  type PrintPilotReminderStatus,
  groupPrintPilotRemindersByStatus,
  createPrintPilotHistoryEntry,
} from "../data/printPilotStore";
import { getPrintPilotStatusBadgeVariant } from "../data/statusBadges";
import { useEditableDraft } from "../hooks/useEditableDraft";
import { useMasterDetailSelection } from "../hooks/useMasterDetailSelection";
import { usePrintPilotStore } from "../store/PrintPilotStore";

import { PageHeader } from "../layout/PageHeader";
import { PageTabs } from "../layout/PageTabs";

import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { DetailDrawer } from "../ui/DetailDrawer";
import { DocumentHistory } from "../ui/DocumentHistory";
import { DirtyStateNotice } from "../ui/DirtyStateNotice";
import { EditLockToggle } from "../ui/EditLockToggle";
import { Field } from "../ui/Field";
import { FieldGrid } from "../ui/FieldGrid";
import { Input } from "../ui/Input";
import { SectionHeader } from "../ui/SectionHeader";
import { SaveActionButton } from "../ui/SaveActionButton";
import { Select } from "../ui/Select";
import { DataTable, TableToolbar } from "../ui/Table";
import { SortableTableHeader } from "../ui/SortableTableHeader";
import { useSortableTable } from "../ui/useSortableTable";
import { WorkspaceHeader } from "../ui/WorkspaceHeader";

const reminderTabs = ["Liste", "Entwurf", "Offen", "Versendet", "Erledigt"] as const;

type ReminderTab = "Liste" | PrintPilotReminderStatus;

type ReminderSortKey =
  | "number"
  | "customerName"
  | "invoiceNumber"
  | "reminderLevel"
  | "deadline"
  | "status";

function getReminderTitle(tab: ReminderTab) {
  switch (tab) {
    case "Liste":
      return "Mahnung vorbereiten";
    case "Entwurf":
      return "Mahnungsentwurf bearbeiten";
    case "Offen":
      return "Offene Mahnung prüfen";
    case "Versendet":
      return "Versendete Mahnung prüfen";
    case "Erledigt":
      return "Erledigte Mahnung";
  }
}

function getReminderStatus(tab: ReminderTab) {
  if (tab === "Liste") {
    return "Alle Mahnungen";
  }

  return tab;
}

function isReminderTab(tab: string): tab is ReminderTab {
  return reminderTabs.includes(tab as ReminderTab);
}

function getReminderSortValue(reminder: PrintPilotReminder, sortKey: ReminderSortKey) {
  switch (sortKey) {
    case "number":
      return reminder.number;
    case "customerName":
      return reminder.customerName;
    case "invoiceNumber":
      return reminder.invoiceNumber;
    case "reminderLevel":
      return reminder.reminderLevel;
    case "deadline":
      return reminder.deadline;
    case "status":
      return reminder.status;
  }
}

export function RemindersPage() {
  const module = getModuleConfig("reminders");
  const { reminders, updateReminder } = usePrintPilotStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  const reminderRowsByTab = useMemo(() => {
    return {
      Liste: reminders,
      ...groupPrintPilotRemindersByStatus(reminders),
    };
  }, [reminders]);

  const {
    activeTab,
    rows: reminderRows,
    selectedItem: selectedReminder,
    setActiveTab,
    selectItem,
  } = useMasterDetailSelection({
    rowsByTab: reminderRowsByTab,
    initialTab: "Liste" as ReminderTab,
  });

  const { draft, isDirty, updateDraftField, resetDraft, saveDraft } =
    useEditableDraft(selectedReminder);

  const canEdit = isEditing && Boolean(draft);

  const {
    sortedRows: sortedReminderRows,
    sortConfig: reminderSortConfig,
    requestSort: requestReminderSort,
  } = useSortableTable<PrintPilotReminder, ReminderSortKey>({
    rows: reminderRows,
    initialSortKey: "number",
    getSortValue: getReminderSortValue,
    fallbackSortValue: (reminder: PrintPilotReminder) => reminder.number,
  });

  function handleTabChange(tab: string) {
    if (isReminderTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
      setIsDetailDrawerOpen(false);
    }
  }

  function handleReminderSelect(reminderId: string) {
    selectItem(reminderId);
    setIsEditing(false);
    setIsDetailDrawerOpen(true);
  }

  function handleCloseDrawer() {
    setIsEditing(false);
    setIsDetailDrawerOpen(false);
  }

  function handleResetDraft() {
    resetDraft();
    setIsEditing(false);
  }

  function handleToggleEditing() {
    setIsEditing((currentValue) => !currentValue);
  }

  function handleIssueReminder() {
    const reminderToIssue =
      (draft as PrintPilotReminder | undefined) ?? selectedReminder;

    if (!reminderToIssue) {
      return;
    }

    const previousHistory = reminderToIssue.history ?? [];

    const issuedReminder: PrintPilotReminder = {
      ...reminderToIssue,
      status: "Versendet",
      history: [
        createPrintPilotHistoryEntry("Mahnung versendet", "Versendet"),
        ...previousHistory,
      ],
    };

    updateReminder(issuedReminder);
    saveDraft(issuedReminder);
    setIsEditing(false);

    if (activeTab !== "Liste") {
      setActiveTab("Liste");
    }

    window.setTimeout(() => {
      selectItem(issuedReminder.id);
      setIsDetailDrawerOpen(true);
    }, 0);
  }

  function handleSaveReminder() {
    if (!draft) {
      return;
    }

    const savedReminder = draft as PrintPilotReminder;

    const statusChanged =
      selectedReminder && selectedReminder.status !== savedReminder.status;
    const previousHistory = savedReminder.history ?? selectedReminder?.history ?? [];
    const documentToSave: PrintPilotReminder = statusChanged
      ? {
          ...savedReminder,
          history: [
            createPrintPilotHistoryEntry(
              "Mahnung: Status geändert",
              savedReminder.status,
              selectedReminder?.status,
              savedReminder.status,
            ),
            ...previousHistory,
          ],
        }
      : savedReminder;


    updateReminder(documentToSave);
    saveDraft(documentToSave);
    setIsEditing(false);
    setIsDetailDrawerOpen(false);

    if (activeTab !== "Liste") {
      setActiveTab("Liste");
    }

    window.setTimeout(() => {
      selectItem(documentToSave.id);
    }, 0);
  }

  return (
    <div className="page">
      <PageHeader
        title={module.title}
        description={module.description}
        actionLabel={module.actionLabel}
      />

      <PageTabs
        tabs={[...reminderTabs]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="MAHNUNGEN"
          title={getReminderTitle(activeTab)}
          statusValue={isEditing ? "Bearbeitung offen" : getReminderStatus(activeTab)}
        />

        <section className="workspace-panel master-list-panel">
          <TableToolbar>
            <Input className="search-input" placeholder="Mahnungen suchen..." />
            <Button>Filter</Button>
          </TableToolbar>

          <DataTable>
            <thead>
              <tr>
                <SortableTableHeader
                  label="Mahnung"
                  sortKey="number"
                  sortConfig={reminderSortConfig}
                  onSort={requestReminderSort}
                />
                <SortableTableHeader
                  label="Kunde"
                  sortKey="customerName"
                  sortConfig={reminderSortConfig}
                  onSort={requestReminderSort}
                />
                <SortableTableHeader
                  label="Rechnung"
                  sortKey="invoiceNumber"
                  sortConfig={reminderSortConfig}
                  onSort={requestReminderSort}
                />
                <SortableTableHeader
                  label="Stufe"
                  sortKey="reminderLevel"
                  sortConfig={reminderSortConfig}
                  onSort={requestReminderSort}
                />
                <SortableTableHeader
                  label="Frist"
                  sortKey="deadline"
                  sortConfig={reminderSortConfig}
                  onSort={requestReminderSort}
                />
                <SortableTableHeader
                  label="Status"
                  sortKey="status"
                  sortConfig={reminderSortConfig}
                  onSort={requestReminderSort}
                />
              </tr>
            </thead>

            <tbody>
              {sortedReminderRows.map((reminder: PrintPilotReminder) => {
                const isSelected = reminder.id === selectedReminder?.id;

                return (
                  <tr
                    key={reminder.id}
                    className={isSelected ? "data-table-row-selected" : undefined}
                    onClick={() => handleReminderSelect(reminder.id)}
                  >
                    <td>{reminder.number}</td>
                    <td>{reminder.customerName}</td>
                    <td>{reminder.invoiceNumber}</td>
                    <td>{reminder.reminderLevel}</td>
                    <td>{reminder.deadline}</td>
                    <td>
                      <Badge variant={getPrintPilotStatusBadgeVariant(reminder.status)}>
                        {reminder.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </DataTable>
        </section>
      </section>

      <DetailDrawer
        accentColor={module.accentColor}
        open={isDetailDrawerOpen && Boolean(selectedReminder)}
        eyebrow="Mahnung"
        title={selectedReminder?.number ?? "Mahnung"}
        subtitle={
          selectedReminder
            ? `${selectedReminder.customerName} · ${selectedReminder.invoiceNumber}`
            : undefined
        }
        onClose={handleCloseDrawer}
        size="xl"
        footer={
          <>
            <DirtyStateNotice isDirty={isDirty} />

            <EditLockToggle
              isEditing={isEditing}
              onToggle={handleToggleEditing}
            />

            <Button onClick={handleResetDraft}>Änderungen verwerfen</Button>
            <Button>Vorschau prüfen</Button>
            <SaveActionButton
              isDirty={isDirty}
              defaultLabel="Änderungen speichern"
              onClick={handleSaveReminder}
            />
            <Button variant="primary" onClick={handleIssueReminder}>
              Mahnung ausgeben
            </Button>
          </>
        }
      >

        <DocumentHistory entries={(draft as PrintPilotReminder | undefined)?.history ?? selectedReminder?.history} />
        <section className="workspace-panel">
          <SectionHeader>Mahnkopf</SectionHeader>

          <FieldGrid>
            <Field label="Mahnungsnummer">
              <Input value={draft?.number ?? ""} readOnly />
            </Field>

            <Field label="Kunde">
              <Input value={draft?.customerName ?? ""} readOnly />
            </Field>

            <Field label="Rechnung">
              <Input value={draft?.invoiceNumber ?? ""} readOnly />
            </Field>

            <Field label="Status">
              <Select
                value={draft?.status ?? ""}
                disabled={!canEdit}
                onChange={(event) =>
                  updateDraftField(
                    "status",
                    event.target.value as PrintPilotReminderStatus,
                  )
                }
              >
                <option>Entwurf</option>
                <option>Offen</option>
                <option>Versendet</option>
                <option>Erledigt</option>
              </Select>
            </Field>

            <Field label="Mahnstufe">
              <Select
                value={draft?.reminderLevel ?? ""}
                disabled={!canEdit}
                onChange={(event) =>
                  updateDraftField("reminderLevel", event.target.value)
                }
              >
                <option>Zahlungserinnerung</option>
                <option>1. Mahnung</option>
                <option>2. Mahnung</option>
                <option>Letzte Mahnung</option>
              </Select>
            </Field>

            <Field label="Frist">
              <Select
                value={draft?.deadline ?? ""}
                disabled={!canEdit}
                onChange={(event) =>
                  updateDraftField("deadline", event.target.value)
                }
              >
                <option>7 Tage</option>
                <option>10 Tage</option>
                <option>14 Tage</option>
              </Select>
            </Field>
          </FieldGrid>

          <SectionHeader>Text & Ausgabe</SectionHeader>

          <FieldGrid>
            <Field label="Vorlage">
              <Select
                value={draft?.template ?? ""}
                disabled={!canEdit}
                onChange={(event) =>
                  updateDraftField("template", event.target.value)
                }
              >
                <option>Zahlungserinnerung</option>
                <option>Standardmahnung</option>
                <option>Letzte Mahnung</option>
              </Select>
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
        </section>
      </DetailDrawer>
    </div>
  );
}
