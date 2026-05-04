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
    {
      number: "MA-2026-001",
      customer: "Sonnendruck GmbH",
      invoice: "RE-2026-001",
      status: "Entwurf",
      badgeVariant: "success" as const,
    },
    {
      number: "MA-2026-002",
      customer: "Musterkunde GmbH",
      invoice: "RE-2026-002",
      status: "Offen",
      badgeVariant: undefined,
    },
    {
      number: "MA-2026-003",
      customer: "Beispiel AG",
      invoice: "RE-2026-003",
      status: "Versendet",
      badgeVariant: undefined,
    },
  ],
  Entwurf: [
    {
      number: "MA-2026-001",
      customer: "Sonnendruck GmbH",
      invoice: "RE-2026-001",
      status: "Entwurf",
      badgeVariant: "success" as const,
    },
  ],
  Offen: [
    {
      number: "MA-2026-002",
      customer: "Musterkunde GmbH",
      invoice: "RE-2026-002",
      status: "Offen",
      badgeVariant: undefined,
    },
  ],
  Versendet: [
    {
      number: "MA-2026-003",
      customer: "Beispiel AG",
      invoice: "RE-2026-003",
      status: "Versendet",
      badgeVariant: undefined,
    },
  ],
  Erledigt: [
    {
      number: "MA-2026-008",
      customer: "Druckpartner Süd",
      invoice: "RE-2026-008",
      status: "Erledigt",
      badgeVariant: "success" as const,
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

export function RemindersPage() {
  const module = getModuleConfig("reminders");
  const [activeTab, setActiveTab] = useState<ReminderTab>("Liste");
  const reminderRows = reminderRowsByTab[activeTab];

  function handleTabChange(tab: string) {
    if (isReminderTab(tab)) {
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
                  <th>Mahnung</th>
                  <th>Kunde</th>
                  <th>Rechnung</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {reminderRows.map((reminder) => (
                  <tr key={reminder.number}>
                    <td>{reminder.number}</td>
                    <td>{reminder.customer}</td>
                    <td>{reminder.invoice}</td>
                    <td>
                      <Badge variant={reminder.badgeVariant}>{reminder.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel master-editor-panel">
            <SectionHeader>Mahnkopf</SectionHeader>

            <FieldGrid>
              <Field label="Mahnnummer">
                <Input placeholder="wird später automatisch vergeben" disabled />
              </Field>

              <Field label="Quelle">
                <Input placeholder="später aus Rechnung übernehmen" disabled />
              </Field>

              <Field label="Kunde">
                <Input placeholder="Kunde auswählen" />
              </Field>

              <Field label="Rechnung">
                <Input placeholder="Rechnungsbezug" disabled />
              </Field>

              <Field label="Mahndatum">
                <Input type="date" />
              </Field>

              <Field label="Status">
                <Select
                  value={getReminderStatus(activeTab)}
                  onChange={(event) => handleTabChange(event.target.value)}
                >
                  <option>Entwurf</option>
                  <option>Offen</option>
                  <option>Versendet</option>
                  <option>Erledigt</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Mahninformationen</SectionHeader>

            <FieldGrid>
              <Field label="Mahnstufe">
                <Select defaultValue="">
                  <option value="" disabled>
                    Mahnstufe wählen
                  </option>
                  <option>Zahlungserinnerung</option>
                  <option>1. Mahnung</option>
                  <option>2. Mahnung</option>
                  <option>Letzte Mahnung</option>
                </Select>
              </Field>

              <Field label="Fällig seit">
                <Input placeholder="später aus Rechnung" disabled />
              </Field>

              <Field label="Offener Betrag">
                <Input placeholder="später aus Rechnung" disabled />
              </Field>
            </FieldGrid>

            <SectionHeader>Ausgabe</SectionHeader>

            <FieldGrid>
              <Field label="Mahnvorlage">
                <Select defaultValue="">
                  <option value="" disabled>
                    Vorlage wählen
                  </option>
                  <option>Zahlungserinnerung</option>
                  <option>Standardmahnung</option>
                  <option>Letzte Mahnung</option>
                </Select>
              </Field>

              <Field label="Frist">
                <Select defaultValue="">
                  <option value="" disabled>
                    Frist wählen
                  </option>
                  <option>7 Tage</option>
                  <option>10 Tage</option>
                  <option>14 Tage</option>
                </Select>
              </Field>

              <Field label="Interne Notiz">
                <Input placeholder="Optional" />
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
