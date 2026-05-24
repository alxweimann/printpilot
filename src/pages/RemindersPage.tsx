import { useMemo, useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";
import {
  type PrintPilotReminder,
  type PrintPilotReminderStatus,
  groupPrintPilotRemindersByStatus,
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
import { DocumentPreviewDialog } from "../ui/DocumentPreviewDialog";
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
import { WorkflowHints } from "../ui/WorkflowHints";

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

function getReminderWorkflowHints(reminder: PrintPilotReminder | undefined) {
  if (!reminder) {
    return [];
  }

  const hints = [];

  if (reminder.status === "Entwurf") {
    hints.push({
      title: "Mahnung noch nicht versendet",
      description: "Die Mahnung ist vorbereitet, aber noch nicht ausgegeben.",
      variant: "info" as const,
    });
  }

  if (reminder.status === "Offen") {
    hints.push({
      title: "Zahlungseingang prüfen",
      description: "Die Mahnung ist offen. Prüfe, ob bereits eine Zahlung eingegangen ist.",
      variant: "warning" as const,
    });
  }

  if (reminder.status === "Versendet") {
    hints.push({
      title: "Frist überwachen",
      description: "Die Mahnung wurde versendet. Behalte die gesetzte Zahlungsfrist im Blick.",
      variant: "info" as const,
    });
  }

  if (reminder.status === "Erledigt") {
    hints.push({
      title: "Mahnung abgeschlossen",
      description: "Die Mahnung ist erledigt und benötigt aktuell keine weitere Aktion.",
      variant: "success" as const,
    });
  }

  return hints;
}

export function RemindersPage() {
  const module = getModuleConfig("reminders");
  const { reminders, updateReminder } = usePrintPilotStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);

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
  const reminderWorkflowHints = getReminderWorkflowHints(
    draft as PrintPilotReminder | undefined,
  );

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

  function handleOpenPreviewDialog() {
    if (!draft && !selectedReminder) {
      return;
    }

    setIsPreviewDialogOpen(true);
  }

  function handleClosePreviewDialog() {
    setIsPreviewDialogOpen(false);
  }

  function handleSaveReminder() {
    if (!draft) {
      return;
    }

    const savedReminder = draft as PrintPilotReminder;

    updateReminder(savedReminder);
    saveDraft(savedReminder);
    setIsEditing(false);
    setIsDetailDrawerOpen(false);

    if (activeTab !== "Liste") {
      setActiveTab("Liste");
    }

    window.setTimeout(() => {
      selectItem(savedReminder.id);
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
            <Button onClick={handleOpenPreviewDialog}>Vorschau prüfen</Button>
            <SaveActionButton
              isDirty={isDirty}
              defaultLabel="Mahnung ausgeben"
              onClick={handleSaveReminder}
            />
          </>
        }
      >
        <WorkflowHints hints={reminderWorkflowHints} />

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
      <DocumentPreviewDialog
        open={isPreviewDialogOpen && Boolean(draft ?? selectedReminder)}
        eyebrow="Mahnvorschau"
        title={
          (draft as PrintPilotReminder | undefined)?.number ??
          selectedReminder?.number ??
          "Mahnung"
        }
        subtitle={
          (draft as PrintPilotReminder | undefined)?.customerName ??
          selectedReminder?.customerName ??
          "Kein Kunde hinterlegt"
        }
        fields={[
          {
            label: "Kunde",
            value:
              (draft as PrintPilotReminder | undefined)?.customerName ??
              selectedReminder?.customerName,
          },
          {
            label: "Rechnung",
            value:
              (draft as PrintPilotReminder | undefined)?.invoiceNumber ??
              selectedReminder?.invoiceNumber,
          },
          {
            label: "Betreff",
            value:
              (draft as PrintPilotReminder | undefined)?.subject ??
              selectedReminder?.subject,
          },
          {
            label: "Status",
            value:
              (draft as PrintPilotReminder | undefined)?.status ??
              selectedReminder?.status,
          },
          {
            label: "Mahnstufe",
            value:
              (draft as PrintPilotReminder | undefined)?.reminderLevel ??
              selectedReminder?.reminderLevel,
          },
          {
            label: "Frist",
            value:
              (draft as PrintPilotReminder | undefined)?.deadline ??
              selectedReminder?.deadline,
          },
          {
            label: "Vorlage",
            value:
              (draft as PrintPilotReminder | undefined)?.template ??
              selectedReminder?.template,
          },
          {
            label: "Notiz",
            value:
              (draft as PrintPilotReminder | undefined)?.note ??
              selectedReminder?.note,
          },
        ]}
        onClose={handleClosePreviewDialog}
      />

    </div>
  );
}
