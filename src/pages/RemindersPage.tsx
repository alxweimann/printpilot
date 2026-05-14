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
import { SaveActionButton } from "../ui/SaveActionButton";
import { Select } from "../ui/Select";
import { DataTable, TableToolbar } from "../ui/Table";
import { SortableTableHeader } from "../ui/SortableTableHeader";
import { useSortableTable } from "../ui/useSortableTable";
import { WorkspaceHeader } from "../ui/WorkspaceHeader";

const reminderTabs = ["Liste", "Entwurf", "Offen", "Versendet", "Erledigt"] as const;

type ReminderTab = (typeof reminderTabs)[number];

type ReminderRow = {
  id: string;
  number: string;
  customer: string;
  invoice: string;
  status: string;
  reminderLevel: string;
  deadline: string;
  template: string;
  note: string;
  badgeVariant?: "success";
};

type ReminderSortKey = "number" | "customer" | "invoice" | "reminderLevel" | "deadline" | "status";



const reminderRowsByTab: Record<ReminderTab, ReminderRow[]> = {
  Liste: [
    {
      id: "reminder-ma-2026-001",
      number: "MA-2026-001",
      customer: "Sonnendruck GmbH",
      invoice: "RE-2026-001",
      status: "Entwurf",
      reminderLevel: "Zahlungserinnerung",
      deadline: "7 Tage",
      template: "Zahlungserinnerung",
      note: "Freundliche Erinnerung senden",
      badgeVariant: "success",
    },
    {
      id: "reminder-ma-2026-002",
      number: "MA-2026-002",
      customer: "Musterkunde GmbH",
      invoice: "RE-2026-002",
      status: "Offen",
      reminderLevel: "1. Mahnung",
      deadline: "10 Tage",
      template: "Standardmahnung",
      note: "Offene Rechnung prüfen",
      badgeVariant: undefined,
    },
    {
      id: "reminder-ma-2026-003",
      number: "MA-2026-003",
      customer: "Beispiel AG",
      invoice: "RE-2026-003",
      status: "Versendet",
      reminderLevel: "2. Mahnung",
      deadline: "7 Tage",
      template: "Standardmahnung",
      note: "Bereits versendet",
      badgeVariant: undefined,
    },
  ],
  Entwurf: [
    {
      id: "reminder-ma-2026-001",
      number: "MA-2026-001",
      customer: "Sonnendruck GmbH",
      invoice: "RE-2026-001",
      status: "Entwurf",
      reminderLevel: "Zahlungserinnerung",
      deadline: "7 Tage",
      template: "Zahlungserinnerung",
      note: "Freundliche Erinnerung senden",
      badgeVariant: "success",
    },
  ],
  Offen: [
    {
      id: "reminder-ma-2026-002",
      number: "MA-2026-002",
      customer: "Musterkunde GmbH",
      invoice: "RE-2026-002",
      status: "Offen",
      reminderLevel: "1. Mahnung",
      deadline: "10 Tage",
      template: "Standardmahnung",
      note: "Offene Rechnung prüfen",
      badgeVariant: undefined,
    },
  ],
  Versendet: [
    {
      id: "reminder-ma-2026-003",
      number: "MA-2026-003",
      customer: "Beispiel AG",
      invoice: "RE-2026-003",
      status: "Versendet",
      reminderLevel: "2. Mahnung",
      deadline: "7 Tage",
      template: "Standardmahnung",
      note: "Bereits versendet",
      badgeVariant: undefined,
    },
  ],
  Erledigt: [
    {
      id: "reminder-ma-2026-008",
      number: "MA-2026-008",
      customer: "Druckpartner Süd",
      invoice: "RE-2026-008",
      status: "Erledigt",
      reminderLevel: "Letzte Mahnung",
      deadline: "14 Tage",
      template: "Letzte Mahnung",
      note: "Erledigt",
      badgeVariant: "success",
    },
  ],
};

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
    return "Entwurf";
  }

  return tab;
}

function isReminderTab(tab: string): tab is ReminderTab {
  return reminderTabs.includes(tab as ReminderTab);
}

function getReminderSortValue(reminder: ReminderRow, sortKey: ReminderSortKey) {
  switch (sortKey) {
    case "number":
      return reminder.number;
    case "customer":
      return reminder.customer;
    case "invoice":
      return reminder.invoice;
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

  const [isEditing, setIsEditing] = useState(false);

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

  const { draft, isDirty, updateDraftField, resetDraft } =
    useEditableDraft(selectedReminder);


  const {
    sortedRows: sortedReminderRows,
    sortConfig: reminderSortConfig,
    requestSort: requestReminderSort,
  } = useSortableTable<ReminderRow, ReminderSortKey>({
    rows: reminderRows,
    initialSortKey: "number",
    getSortValue: getReminderSortValue,
    fallbackSortValue: (reminder) => reminder.number,
  });
  function handleTabChange(tab: string) {
    if (isReminderTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
    }
  }

  function handleReminderSelect(reminderId: string) {
    selectItem(reminderId);
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
        tabs={[...reminderTabs]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="Mahnmaske"
          title={getReminderTitle(activeTab)}
          statusValue={getReminderStatus(activeTab)}
        />

        <div className="master-detail-layout">
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
                    sortKey="customer"
                    sortConfig={reminderSortConfig}
                    onSort={requestReminderSort}
                  />
                  <SortableTableHeader
                    label="Rechnung"
                    sortKey="invoice"
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
                {sortedReminderRows.map((reminder) => {
                  const isSelected = reminder.id === selectedReminder?.id;

                  return (
                    <tr
                      key={reminder.id}
                      className={
                        isSelected ? "data-table-row-selected" : undefined
                      }
                      onClick={() => handleReminderSelect(reminder.id)}
                    >
                      <td>{reminder.number}</td>
                      <td>{reminder.customer}</td>
                      <td>{reminder.invoice}</td>
                      <td>{reminder.reminderLevel}</td>
                      <td>{reminder.deadline}</td>
                      <td>
                        <Badge variant={reminder.badgeVariant}>
                          {reminder.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel master-editor-panel">
            <SectionHeader>Mahnkopf</SectionHeader>

            <FieldGrid>
              <Field label="Mahnung">
                <Input value={draft?.number ?? ""} readOnly />
              </Field>

              <Field label="Kunde">
                <Input value={draft?.customer ?? ""} readOnly />
              </Field>

              <Field label="Rechnung">
                <Input value={draft?.invoice ?? ""} readOnly />
              </Field>

              <Field label="Status">
                <Select
                  value={activeTab}
                  disabled={!isEditing}
                  onChange={(event) => handleTabChange(event.target.value)}
                >
                  {reminderTabs.map((tab) => (
                    <option key={tab}>{tab}</option>
                  ))}
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Mahninformationen</SectionHeader>

            <FieldGrid>
              <Field label="Mahnstufe">
                <Select
                  value={draft?.reminderLevel ?? ""}
                  onChange={(event) =>
                    updateDraftField("reminderLevel", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Mahnstufe wählen
                  </option>
                  <option>Zahlungserinnerung</option>
                  <option>1. Mahnung</option>
                  <option>2. Mahnung</option>
                  <option>Letzte Mahnung</option>
                </Select>
              </Field>

              <Field label="Frist">
                <Select
                  value={draft?.deadline ?? ""}
                  onChange={(event) =>
                    updateDraftField("deadline", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Frist wählen
                  </option>
                  <option>7 Tage</option>
                  <option>10 Tage</option>
                  <option>14 Tage</option>
                </Select>
              </Field>

              <Field label="Notiz">
                <Input
                  value={draft?.note ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("note", event.target.value)
                  }
                />
              </Field>
            </FieldGrid>

            <SectionHeader>Ausgabe</SectionHeader>

            <FieldGrid>
              <Field label="Vorlage">
                <Select
                  value={draft?.template ?? ""}
                  onChange={(event) =>
                    updateDraftField("template", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Vorlage wählen
                  </option>
                  <option>Zahlungserinnerung</option>
                  <option>Standardmahnung</option>
                  <option>Letzte Mahnung</option>
                </Select>
              </Field>
            </FieldGrid>

            <div className="calculation-footer">
              <DirtyStateNotice isDirty={isDirty} />

              <EditLockToggle

                isEditing={isEditing}

                onToggle={handleToggleEditing}

              />

              <Button onClick={handleResetDraft}>Änderungen verwerfen</Button>
              <Button>Vorschau prüfen</Button>
              <SaveActionButton

                              isDirty={isDirty}

                              defaultLabel="Mahnung ausgeben"

                            />
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
