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

const reminderTabs = ["Liste", "Entwurf", "Offen", "Versendet", "Erledigt"] as const;

type ReminderTab = (typeof reminderTabs)[number];

const reminderRowsByTab = {
  Liste: [
    { id: "reminder-ma-2026-001", number: "MA-2026-001", customer: "Sonnendruck GmbH", invoice: "RE-2026-001", status: "Entwurf", badgeVariant: "success" as const },
    { id: "reminder-ma-2026-002", number: "MA-2026-002", customer: "Musterkunde GmbH", invoice: "RE-2026-002", status: "Offen", badgeVariant: undefined },
    { id: "reminder-ma-2026-003", number: "MA-2026-003", customer: "Beispiel AG", invoice: "RE-2026-003", status: "Versendet", badgeVariant: undefined },
  ],
  Entwurf: [
    { id: "reminder-ma-2026-001", number: "MA-2026-001", customer: "Sonnendruck GmbH", invoice: "RE-2026-001", status: "Entwurf", badgeVariant: "success" as const },
  ],
  Offen: [
    { id: "reminder-ma-2026-002", number: "MA-2026-002", customer: "Musterkunde GmbH", invoice: "RE-2026-002", status: "Offen", badgeVariant: undefined },
  ],
  Versendet: [
    { id: "reminder-ma-2026-003", number: "MA-2026-003", customer: "Beispiel AG", invoice: "RE-2026-003", status: "Versendet", badgeVariant: undefined },
  ],
  Erledigt: [
    { id: "reminder-ma-2026-008", number: "MA-2026-008", customer: "Druckpartner Süd", invoice: "RE-2026-008", status: "Erledigt", badgeVariant: "success" as const },
  ],
};

function getReminderTitle(tab: ReminderTab) {
  switch (tab) {
    case "Liste": return "Mahnung vorbereiten";
    case "Entwurf": return "Mahnungsentwurf bearbeiten";
    case "Offen": return "Offene Mahnung prüfen";
    case "Versendet": return "Versendete Mahnung prüfen";
    case "Erledigt": return "Erledigte Mahnung";
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

export function RemindersPage() {
  const module = getModuleConfig("reminders");

  const [activeTab, setActiveTab] = useState<ReminderTab>("Liste");
  const [selectedId, setSelectedId] = useState(
    reminderRowsByTab.Liste[0]?.id ?? "",
  );

  const reminderRows = reminderRowsByTab[activeTab];
  const selectedReminder =
    reminderRows.find((reminder) => reminder.id === selectedId) ??
    reminderRows[0];

  function handleTabChange(tab: string) {
    if (isReminderTab(tab)) {
      const nextRows = reminderRowsByTab[tab];

      setActiveTab(tab);
      setSelectedId(nextRows[0]?.id ?? "");
    }
  }

  function handleReminderSelect(reminderId: string) {
    setSelectedId(reminderId);
  }

  return (
    <div className="page">
      <PageHeader title={module.title} description={module.description} actionLabel={module.actionLabel} />

      <PageTabs tabs={[...reminderTabs]} activeTab={activeTab} onTabChange={handleTabChange} />

      <section className="calculation-sheet">
        <WorkspaceHeader kicker="Mahnmaske" title={getReminderTitle(activeTab)} statusValue={getReminderStatus(activeTab)} />

        <div className="master-detail-layout">
          <section className="workspace-panel master-list-panel">
            <TableToolbar>
              <Input className="search-input" placeholder="Mahnungen suchen..." />
              <Button>Filter</Button>
            </TableToolbar>

            <DataTable>
              <thead>
                <tr>
                  <th>Mahnung</th>
                  <th>Kunde</th>
                  <th>Rechnung</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {reminderRows.map((reminder) => {
                  const isSelected = reminder.id === selectedReminder?.id;

                  return (
                    <tr
                      key={reminder.id}
                      className={isSelected ? "data-table-row-selected" : undefined}
                      onClick={() => handleReminderSelect(reminder.id)}
                    >
                      <td>{reminder.number}</td>
                      <td>{reminder.customer}</td>
                      <td>{reminder.invoice}</td>
                      <td>
                        <Badge variant={reminder.badgeVariant}>{reminder.status}</Badge>
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
                <Input value={selectedReminder?.number ?? ""} readOnly />
              </Field>

              <Field label="Kunde">
                <Input value={selectedReminder?.customer ?? ""} readOnly />
              </Field>

              <Field label="Rechnung">
                <Input value={selectedReminder?.invoice ?? ""} readOnly />
              </Field>

              <Field label="Status">
                <Select value={activeTab} onChange={(event) => handleTabChange(event.target.value)}>
                  {reminderTabs.map((tab) => (
                    <option key={tab}>{tab}</option>
                  ))}
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Mahninformationen</SectionHeader>

            <FieldGrid>
              <Field label="Mahnstufe">
                <Select defaultValue="">
                  <option value="" disabled>Mahnstufe wählen</option>
                  <option>Zahlungserinnerung</option>
                  <option>1. Mahnung</option>
                  <option>2. Mahnung</option>
                  <option>Letzte Mahnung</option>
                </Select>
              </Field>

              <Field label="Frist">
                <Select defaultValue="">
                  <option value="" disabled>Frist wählen</option>
                  <option>7 Tage</option>
                  <option>10 Tage</option>
                  <option>14 Tage</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Ausgabe</SectionHeader>

            <FieldGrid>
              <Field label="Vorlage">
                <Select defaultValue="">
                  <option value="" disabled>Vorlage wählen</option>
                  <option>Zahlungserinnerung</option>
                  <option>Standardmahnung</option>
                  <option>Letzte Mahnung</option>
                </Select>
              </Field>
            </FieldGrid>

            <div className="calculation-footer">
              <Button>Entwurf speichern</Button>
              <Button>Vorschau prüfen</Button>
              <Button variant="primary">Mahnung ausgeben</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
