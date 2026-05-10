import { useRef, useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";
import {
  type PrintPilotBackupFile,
  type PrintPilotBackupSummary,
  createPrintPilotBackup,
  downloadPrintPilotBackup,
  getPrintPilotBackupSummary,
  readPrintPilotBackupFile,
} from "../data/backup";
import { initialPrintPilotSettings } from "../data/printPilotStore";
import { useEditableDraft } from "../hooks/useEditableDraft";

import { PageHeader } from "../layout/PageHeader";
import { PageTabs } from "../layout/PageTabs";

import { Button } from "../ui/Button";
import { DirtyStateNotice } from "../ui/DirtyStateNotice";
import { EditLockToggle } from "../ui/EditLockToggle";
import { Field } from "../ui/Field";
import { FieldGrid } from "../ui/FieldGrid";
import { Input } from "../ui/Input";
import { SaveActionButton } from "../ui/SaveActionButton";
import { SectionHeader } from "../ui/SectionHeader";
import { Select } from "../ui/Select";
import { WorkspaceHeader } from "../ui/WorkspaceHeader";

const settingsTabs = [
  "Allgemein",
  "Nummernkreise",
  "Firma",
  "Design",
  "System",
  "Datensicherung",
] as const;

type SettingsTab = (typeof settingsTabs)[number];

function isSettingsTab(tab: string): tab is SettingsTab {
  return settingsTabs.includes(tab as SettingsTab);
}

function getSettingsTitle(tab: SettingsTab) {
  switch (tab) {
    case "Allgemein":
      return "Allgemeine Einstellungen";

    case "Nummernkreise":
      return "Nummernkreise verwalten";

    case "Firma":
      return "Firmendaten verwalten";

    case "Design":
      return "Design einstellen";

    case "System":
      return "Systemeinstellungen prüfen";

    case "Datensicherung":
      return "Datensicherung verwalten";
  }
}

function formatBackupDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatBackupSummary(summary: PrintPilotBackupSummary) {
  return [
    `Version ${summary.version}`,
    formatBackupDate(summary.createdAt),
    `${summary.customers} Kunden`,
    `${summary.quotes} Angebote`,
    `${summary.orders} Aufträge`,
    `${summary.materials} Materialien`,
    `${summary.machines} Maschinen`,
    `${summary.services} Leistungen`,
    `${summary.finishing} Weiterverarbeitungen`,
    `${summary.templates} Vorlagen`,
    summary.hasSettings ? "Einstellungen enthalten" : "Keine Einstellungen",
  ].join(" · ");
}

export function SettingsPage() {
  const module = getModuleConfig("settings");

  const [activeTab, setActiveTab] = useState<SettingsTab>("Allgemein");
  const [isEditing, setIsEditing] = useState(false);
  const [backupMessage, setBackupMessage] = useState(
    "Noch keine Sicherung erstellt oder geprüft.",
  );
  const [selectedBackup, setSelectedBackup] =
    useState<PrintPilotBackupFile | null>(null);
  const [selectedBackupSummary, setSelectedBackupSummary] =
    useState<PrintPilotBackupSummary | null>(null);
  const backupInputRef = useRef<HTMLInputElement | null>(null);

  const { draft, isDirty, updateDraftField, resetDraft, saveDraft } =
    useEditableDraft(initialPrintPilotSettings);

  function handleTabChange(tab: string) {
    if (isSettingsTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
    }
  }

  function handleResetDraft() {
    resetDraft();
    setIsEditing(false);
  }

  function handleToggleEditing() {
    setIsEditing((currentValue) => !currentValue);
  }

  function handleCreateBackup() {
    const backup = createPrintPilotBackup({
      customers: [],
      quotes: [],
      orders: [],
      materials: [],
      machines: [],
      services: [],
      finishing: [],
      templates: [],
      settings: draft ?? {},
    });

    downloadPrintPilotBackup(backup);
    setBackupMessage(
      `Backup erstellt: ${formatBackupDate(backup.createdAt)} · Version ${
        backup.version
      }`,
    );
  }

  function handleImportBackupClick() {
    backupInputRef.current?.click();
  }

  function handleClearSelectedBackup() {
    setSelectedBackup(null);
    setSelectedBackupSummary(null);
    setBackupMessage("Backup-Auswahl zurückgesetzt.");
  }

  function handlePrepareReplaceAll() {
    if (!selectedBackup || !selectedBackupSummary) {
      setBackupMessage("Bitte zuerst eine gültige Backup-Datei auswählen.");
      return;
    }

    setBackupMessage(
      `Alles ersetzen ist vorbereitet, aber noch nicht aktiv. Ausgewähltes Backup: ${formatBackupSummary(
        selectedBackupSummary,
      )}`,
    );
  }

  async function handleBackupFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const backup = await readPrintPilotBackupFile(file);
      const summary = getPrintPilotBackupSummary(backup);

      setSelectedBackup(backup);
      setSelectedBackupSummary(summary);
      setBackupMessage(
        `Backup geprüft: ${formatBackupSummary(
          summary,
        )}. Import ist vorbereitet, ersetzt aber noch keine Daten.`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Die Backup-Datei konnte nicht gelesen werden.";

      setSelectedBackup(null);
      setSelectedBackupSummary(null);
      setBackupMessage(message);
    } finally {
      event.target.value = "";
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
        tabs={[...settingsTabs]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="Einstellungen"
          title={getSettingsTitle(activeTab)}
          statusValue={isEditing ? "Bearbeitung offen" : "Gesperrt"}
        />

        <section className="workspace-panel master-editor-panel">
          {activeTab === "Allgemein" && (
            <>
              <SectionHeader>Allgemein</SectionHeader>

              <FieldGrid>
                <Field label="Arbeitsmodus">
                  <Select
                    value={draft?.mode ?? ""}
                    disabled={!isEditing}
                    onChange={(event) =>
                      updateDraftField("mode", event.target.value)
                    }
                  >
                    <option>Lokal</option>
                    <option>Server später</option>
                  </Select>
                </Field>

                <Field label="Startmodul">
                  <Select
                    value={draft?.startModule ?? ""}
                    disabled={!isEditing}
                    onChange={(event) =>
                      updateDraftField("startModule", event.target.value)
                    }
                  >
                    <option>Dashboard</option>
                    <option>Kalkulation</option>
                    <option>Angebote</option>
                    <option>Aufträge</option>
                  </Select>
                </Field>

                <Field label="Standard-Kalkulationsbereich">
                  <Select
                    value={draft?.defaultCalculationModule ?? ""}
                    disabled={!isEditing}
                    onChange={(event) =>
                      updateDraftField(
                        "defaultCalculationModule",
                        event.target.value,
                      )
                    }
                  >
                    <option>Kalkulation</option>
                    <option>Angebote</option>
                    <option>Aufträge</option>
                  </Select>
                </Field>
              </FieldGrid>
            </>
          )}

          {activeTab === "Nummernkreise" && (
            <>
              <SectionHeader>Nummernkreise</SectionHeader>

              <FieldGrid>
                <Field label="Angebots-Präfix">
                  <Input
                    value={draft?.quotePrefix ?? ""}
                    readOnly={!isEditing}
                    onChange={(event) =>
                      updateDraftField("quotePrefix", event.target.value)
                    }
                  />
                </Field>

                <Field label="Nächste Angebotsnummer">
                  <Input
                    value={draft?.quoteNextNumber ?? ""}
                    readOnly={!isEditing}
                    onChange={(event) =>
                      updateDraftField("quoteNextNumber", event.target.value)
                    }
                  />
                </Field>

                <Field label="Auftrags-Präfix">
                  <Input
                    value={draft?.orderPrefix ?? ""}
                    readOnly={!isEditing}
                    onChange={(event) =>
                      updateDraftField("orderPrefix", event.target.value)
                    }
                  />
                </Field>

                <Field label="Nächste Auftragsnummer">
                  <Input
                    value={draft?.orderNextNumber ?? ""}
                    readOnly={!isEditing}
                    onChange={(event) =>
                      updateDraftField("orderNextNumber", event.target.value)
                    }
                  />
                </Field>

                <Field label="Rechnungs-Präfix">
                  <Input
                    value={draft?.invoicePrefix ?? ""}
                    readOnly={!isEditing}
                    onChange={(event) =>
                      updateDraftField("invoicePrefix", event.target.value)
                    }
                  />
                </Field>

                <Field label="Nächste Rechnungsnummer">
                  <Input
                    value={draft?.invoiceNextNumber ?? ""}
                    readOnly={!isEditing}
                    onChange={(event) =>
                      updateDraftField("invoiceNextNumber", event.target.value)
                    }
                  />
                </Field>
              </FieldGrid>
            </>
          )}

          {activeTab === "Firma" && (
            <>
              <SectionHeader>Firma</SectionHeader>

              <FieldGrid>
                <Field label="Firmenname">
                  <Input
                    value={draft?.companyName ?? ""}
                    readOnly={!isEditing}
                    onChange={(event) =>
                      updateDraftField("companyName", event.target.value)
                    }
                  />
                </Field>

                <Field label="Straße">
                  <Input
                    value={draft?.companyStreet ?? ""}
                    readOnly={!isEditing}
                    onChange={(event) =>
                      updateDraftField("companyStreet", event.target.value)
                    }
                  />
                </Field>

                <Field label="PLZ">
                  <Input
                    value={draft?.companyZip ?? ""}
                    readOnly={!isEditing}
                    onChange={(event) =>
                      updateDraftField("companyZip", event.target.value)
                    }
                  />
                </Field>

                <Field label="Ort">
                  <Input
                    value={draft?.companyCity ?? ""}
                    readOnly={!isEditing}
                    onChange={(event) =>
                      updateDraftField("companyCity", event.target.value)
                    }
                  />
                </Field>

                <Field label="Telefon">
                  <Input
                    value={draft?.companyPhone ?? ""}
                    readOnly={!isEditing}
                    onChange={(event) =>
                      updateDraftField("companyPhone", event.target.value)
                    }
                  />
                </Field>

                <Field label="E-Mail">
                  <Input
                    type="email"
                    value={draft?.companyEmail ?? ""}
                    readOnly={!isEditing}
                    onChange={(event) =>
                      updateDraftField("companyEmail", event.target.value)
                    }
                  />
                </Field>
              </FieldGrid>
            </>
          )}

          {activeTab === "Design" && (
            <>
              <SectionHeader>Design</SectionHeader>

              <FieldGrid>
                <Field label="Dichte">
                  <Select
                    value={draft?.density ?? ""}
                    disabled={!isEditing}
                    onChange={(event) =>
                      updateDraftField("density", event.target.value)
                    }
                  >
                    <option>Kompakt</option>
                    <option>Normal</option>
                  </Select>
                </Field>

                <Field label="Darstellung">
                  <Select
                    value={draft?.appearance ?? ""}
                    disabled={!isEditing}
                    onChange={(event) =>
                      updateDraftField("appearance", event.target.value)
                    }
                  >
                    <option>Hell später</option>
                    <option>Dunkel später</option>
                  </Select>
                </Field>

                <Field label="Modulfarben">
                  <Select
                    value={draft?.moduleColors ?? ""}
                    disabled={!isEditing}
                    onChange={(event) =>
                      updateDraftField("moduleColors", event.target.value)
                    }
                  >
                    <option>Einheitlich später</option>
                    <option>Individuell später</option>
                  </Select>
                </Field>
              </FieldGrid>
            </>
          )}

          {activeTab === "System" && (
            <>
              <SectionHeader>System</SectionHeader>

              <FieldGrid>
                <Field label="Backup">
                  <Select
                    value={draft?.backupMode ?? ""}
                    disabled={!isEditing}
                    onChange={(event) =>
                      updateDraftField("backupMode", event.target.value)
                    }
                  >
                    <option>Manuell</option>
                    <option>Automatisch später</option>
                  </Select>
                </Field>

                <Field label="API">
                  <Select
                    value={draft?.apiStatus ?? ""}
                    disabled={!isEditing}
                    onChange={(event) =>
                      updateDraftField("apiStatus", event.target.value)
                    }
                  >
                    <option>Nicht aktiv</option>
                    <option>Später planen</option>
                  </Select>
                </Field>

                <Field label="Debug">
                  <Select
                    value={draft?.debugMode ?? ""}
                    disabled={!isEditing}
                    onChange={(event) =>
                      updateDraftField("debugMode", event.target.value)
                    }
                  >
                    <option>Aus</option>
                    <option>Später</option>
                  </Select>
                </Field>
              </FieldGrid>
            </>
          )}

          {activeTab === "Datensicherung" && (
            <>
              <SectionHeader>Backup & Wiederherstellung</SectionHeader>

              <FieldGrid>
                <Field label="Backup-Format">
                  <Input value="PrintPilot JSON Backup · Version 0.1.0" readOnly />
                </Field>

                <Field label="Sicherungsumfang">
                  <Input
                    value="Kunden, Angebote, Aufträge, Material, Maschinen, Leistungen, Weiterverarbeitung, Vorlagen, Einstellungen"
                    readOnly
                  />
                </Field>

                <Field label="Letzter Status">
                  <Input value={backupMessage} readOnly />
                </Field>

                <Field label="Ausgewähltes Backup">
                  <Input
                    value={
                      selectedBackupSummary
                        ? formatBackupSummary(selectedBackupSummary)
                        : "Kein Backup ausgewählt"
                    }
                    readOnly
                  />
                </Field>
              </FieldGrid>

              <SectionHeader>Aktionen</SectionHeader>

              <div className="calculation-footer">
                <Button onClick={handleCreateBackup}>Backup erstellen</Button>

                <Button onClick={handleImportBackupClick}>
                  Backup auswählen
                </Button>

                <Button onClick={handleClearSelectedBackup}>
                  Auswahl zurücksetzen
                </Button>

                <Button onClick={handlePrepareReplaceAll}>
                  Alles ersetzen vorbereiten
                </Button>

                <input
                  ref={backupInputRef}
                  type="file"
                  accept="application/json,.json"
                  onChange={handleBackupFileChange}
                  style={{ display: "none" }}
                />
              </div>
            </>
          )}

          {activeTab !== "Datensicherung" && (
            <div className="calculation-footer">
              <DirtyStateNotice isDirty={isDirty} />

              <EditLockToggle
                isEditing={isEditing}
                onToggle={handleToggleEditing}
              />

              <Button onClick={handleResetDraft}>Änderungen verwerfen</Button>

              <SaveActionButton
                isDirty={isDirty}
                defaultLabel="Einstellungen speichern"
                onClick={saveDraft}
              />
            </div>
          )}
        </section>
      </section>
    </div>
  );
}
