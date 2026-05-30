import { useRef, useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";
import {
  type PrintPilotFormatCategory,
  type PrintPilotGrainDirection,
  type PrintPilotProductFormat,
  type PrintPilotProductType,
  type PrintPilotRawSheetCategory,
  type PrintPilotRawSheetFormat,
} from "../data/printPilotStore";
import {
  type PrintPilotBackupFile,
  type PrintPilotBackupSummary,
  createPrintPilotBackup,
  downloadPrintPilotBackup,
  getPrintPilotBackupSummary,
  readPrintPilotBackupFile,
} from "../data/backup";
import { useEditableDraft } from "../hooks/useEditableDraft";
import { usePrintPilotStore } from "../store/PrintPilotStore";

import { PageHeader } from "../layout/PageHeader";
import { PageTabs } from "../layout/PageTabs";

import { Button } from "../ui/Button";
import { ConfirmDialog } from "../ui/ConfirmDialog";
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
  "Formate",
  "Rohbogenformate",
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

    case "Formate":
      return "Endformate verwalten";

    case "Rohbogenformate":
      return "Rohbogenformate verwalten";

    case "System":
      return "Systemeinstellungen prüfen";

    case "Datensicherung":
      return "Datensicherung verwalten";
  }
}


const productTypeOptions: PrintPilotProductType[] = [
  "Einzelblatt",
  "Flyer",
  "Broschüre",
  "Block",
  "SD-Satz",
  "Karte",
  "Großformat",
];

const productFormatCategoryOptions: PrintPilotFormatCategory[] = [
  "DIN",
  "Flyer",
  "Karte",
  "Broschüre",
  "Block",
  "SD-Satz",
  "Sonderformat",
];

const rawSheetCategoryOptions: PrintPilotRawSheetCategory[] = [
  "DIN",
  "SRA",
  "Langbogen",
  "Maschinenformat",
  "Sonderformat",
];

const grainDirectionOptions: PrintPilotGrainDirection[] = [
  "Unbekannt",
  "Schmalbahn",
  "Breitbahn",
];

function createDraftId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
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
  const {
    settings,
    updateSettings,
    getBackupData,
    replaceStoreData,
  } = usePrintPilotStore();

  const [activeTab, setActiveTab] = useState<SettingsTab>("Allgemein");
  const [isEditing, setIsEditing] = useState(false);
  const [backupMessage, setBackupMessage] = useState(
    "Noch keine Sicherung erstellt oder geprüft.",
  );
  const [selectedBackup, setSelectedBackup] =
    useState<PrintPilotBackupFile | null>(null);
  const [selectedBackupSummary, setSelectedBackupSummary] =
    useState<PrintPilotBackupSummary | null>(null);
  const [isReplaceArmed, setIsReplaceArmed] = useState(false);
  const [isReplaceConfirmOpen, setIsReplaceConfirmOpen] = useState(false);
  const backupInputRef = useRef<HTMLInputElement | null>(null);

  const { draft, isDirty, updateDraftField, resetDraft, saveDraft } =
    useEditableDraft(settings);

  function handleTabChange(tab: string) {
    if (isSettingsTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
      setIsReplaceArmed(false);
      setIsReplaceConfirmOpen(false);
    }
  }

  function handleResetDraft() {
    resetDraft();
    setIsEditing(false);
  }

  function handleToggleEditing() {
    setIsEditing((currentValue) => !currentValue);
  }

  function handleSaveSettings() {
    if (!draft) {
      return;
    }

    updateSettings(draft);
    saveDraft(draft);
    setIsEditing(false);
  }


  function updateProductFormat(
    formatId: string,
    patch: Partial<PrintPilotProductFormat>,
  ) {
    if (!draft) return;

    updateDraftField(
      "productFormats",
      draft.productFormats.map((format) =>
        format.id === formatId ? { ...format, ...patch } : format,
      ),
    );
  }

  function addProductFormat() {
    if (!draft) return;

    updateDraftField("productFormats", [
      ...draft.productFormats,
      {
        id: createDraftId("format"),
        name: "Neues Format",
        widthMm: "210",
        heightMm: "297",
        category: "Sonderformat",
        productTypes: ["Einzelblatt"],
        isDefault: "Nein",
        isActive: "Ja",
      },
    ]);
  }

  function removeProductFormat(formatId: string) {
    if (!draft) return;

    updateDraftField(
      "productFormats",
      draft.productFormats.filter((format) => format.id !== formatId),
    );
  }

  function setDefaultProductFormat(formatId: string) {
    if (!draft) return;

    updateDraftField(
      "productFormats",
      draft.productFormats.map((format) => ({
        ...format,
        isDefault: format.id === formatId ? "Ja" : "Nein",
      })),
    );
  }

  function toggleProductFormatType(
    format: PrintPilotProductFormat,
    productType: PrintPilotProductType,
  ) {
    const hasType = format.productTypes.includes(productType);
    const nextProductTypes = hasType
      ? format.productTypes.filter((currentType) => currentType !== productType)
      : [...format.productTypes, productType];

    updateProductFormat(format.id, {
      productTypes:
        nextProductTypes.length > 0 ? nextProductTypes : ["Einzelblatt"],
    });
  }

  function updateRawSheetFormat(
    formatId: string,
    patch: Partial<PrintPilotRawSheetFormat>,
  ) {
    if (!draft) return;

    updateDraftField(
      "rawSheetFormats",
      draft.rawSheetFormats.map((format) =>
        format.id === formatId ? { ...format, ...patch } : format,
      ),
    );
  }

  function addRawSheetFormat() {
    if (!draft) return;

    updateDraftField("rawSheetFormats", [
      ...draft.rawSheetFormats,
      {
        id: createDraftId("raw"),
        name: "Neuer Rohbogen",
        widthMm: "450",
        heightMm: "320",
        category: "Sonderformat",
        machine: "Digitaldruck allgemein",
        grainDirection: "Unbekannt",
        isDefault: "Nein",
        isActive: "Ja",
      },
    ]);
  }

  function removeRawSheetFormat(formatId: string) {
    if (!draft) return;

    updateDraftField(
      "rawSheetFormats",
      draft.rawSheetFormats.filter((format) => format.id !== formatId),
    );
  }

  function setDefaultRawSheetFormat(formatId: string) {
    if (!draft) return;

    updateDraftField(
      "rawSheetFormats",
      draft.rawSheetFormats.map((format) => ({
        ...format,
        isDefault: format.id === formatId ? "Ja" : "Nein",
      })),
    );
  }

  function handleCreateBackup() {
    const backup = createPrintPilotBackup(getBackupData());
    const summary = getPrintPilotBackupSummary(backup);

    downloadPrintPilotBackup(backup);
    setBackupMessage(`Backup erstellt: ${formatBackupSummary(summary)}`);
    setIsReplaceArmed(false);
  }

  function handleImportBackupClick() {
    backupInputRef.current?.click();
  }

  function handleClearSelectedBackup() {
    setSelectedBackup(null);
    setSelectedBackupSummary(null);
    setIsReplaceArmed(false);
    setIsReplaceConfirmOpen(false);
    setBackupMessage("Backup-Auswahl zurückgesetzt.");
  }

  function handlePrepareReplaceAll() {
    if (!selectedBackup || !selectedBackupSummary) {
      setBackupMessage("Bitte zuerst eine gültige Backup-Datei auswählen.");
      setIsReplaceArmed(false);
      return;
    }

    setIsReplaceArmed(true);
    setBackupMessage(
      `Alles ersetzen ist vorbereitet. Vor dem Import wird automatisch ein Sicherheitsbackup des aktuellen Standes heruntergeladen. Ausgewähltes Backup: ${formatBackupSummary(
        selectedBackupSummary,
      )}`,
    );
  }

  function handleExecuteReplaceAll() {
    if (!selectedBackup || !selectedBackupSummary) {
      setBackupMessage("Bitte zuerst eine gültige Backup-Datei auswählen.");
      setIsReplaceArmed(false);
      return;
    }

    setIsReplaceConfirmOpen(true);
  }

  function handleCancelReplaceAll() {
    setIsReplaceConfirmOpen(false);
    setBackupMessage("Import abgebrochen. Es wurden keine Daten ersetzt.");
  }

  function handleConfirmReplaceAll() {
    if (!selectedBackup || !selectedBackupSummary) {
      setIsReplaceConfirmOpen(false);
      setBackupMessage("Bitte zuerst eine gültige Backup-Datei auswählen.");
      setIsReplaceArmed(false);
      return;
    }

    const safetyBackup = createPrintPilotBackup(getBackupData());
    downloadPrintPilotBackup(safetyBackup);

    replaceStoreData(selectedBackup.data);
    saveDraft(selectedBackup.data.settings);
    setIsReplaceArmed(false);
    setIsReplaceConfirmOpen(false);
    setBackupMessage(
      `Backup importiert. Aktueller Stand wurde vorher als Sicherheitsbackup exportiert. Importiertes Backup: ${formatBackupSummary(
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
      setIsReplaceArmed(false);
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
      setIsReplaceArmed(false);
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

                <Field label="Datumsformat">
                  <Select
                    value={draft?.dateFormat ?? "TT.MM.JJJJ"}
                    disabled={!isEditing}
                    onChange={(event) =>
                      updateDraftField("dateFormat", event.target.value)
                    }
                  >
                    <option>TT.MM.JJJJ</option>
                    <option>TT-MM-JJJJ</option>
                    <option>JJJJ-MM-TT</option>
                    <option>JJJJ/MM/TT</option>
                  </Select>
                </Field>
              </FieldGrid>
            </>
          )}

          {activeTab === "Nummernkreise" && (
            <>
              <SectionHeader>Nummernkreise</SectionHeader>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: "16px",
                  alignItems: "stretch",
                  padding: "12px 18px 24px",
                }}
              >
                <section className="workspace-panel" style={{ padding: "20px" }}>
                  <SectionHeader>Angebote</SectionHeader>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "104px minmax(0, 1fr)",
                      gap: "14px",
                      alignItems: "end",
                    }}
                  >
                    <Field label="Präfix">
                      <Input
                        value={draft?.quotePrefix ?? ""}
                        readOnly={!isEditing}
                        onChange={(event) =>
                          updateDraftField("quotePrefix", event.target.value)
                        }
                      />
                    </Field>

                    <Field label="Nächste Nummer">
                      <Input
                        value={draft?.quoteNextNumber ?? ""}
                        readOnly={!isEditing}
                        onChange={(event) =>
                          updateDraftField("quoteNextNumber", event.target.value)
                        }
                      />
                    </Field>
                  </div>
                </section>

                <section className="workspace-panel" style={{ padding: "20px" }}>
                  <SectionHeader>Aufträge</SectionHeader>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "104px minmax(0, 1fr)",
                      gap: "14px",
                      alignItems: "end",
                    }}
                  >
                    <Field label="Präfix">
                      <Input
                        value={draft?.orderPrefix ?? ""}
                        readOnly={!isEditing}
                        onChange={(event) =>
                          updateDraftField("orderPrefix", event.target.value)
                        }
                      />
                    </Field>

                    <Field label="Nächste Nummer">
                      <Input
                        value={draft?.orderNextNumber ?? ""}
                        readOnly={!isEditing}
                        onChange={(event) =>
                          updateDraftField("orderNextNumber", event.target.value)
                        }
                      />
                    </Field>
                  </div>
                </section>

                <section className="workspace-panel" style={{ padding: "20px" }}>
                  <SectionHeader>Lieferscheine</SectionHeader>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "104px minmax(0, 1fr)",
                      gap: "14px",
                      alignItems: "end",
                    }}
                  >
                    <Field label="Präfix">
                      <Input
                        value={draft?.deliveryNotePrefix ?? ""}
                        readOnly={!isEditing}
                        onChange={(event) =>
                          updateDraftField(
                            "deliveryNotePrefix",
                            event.target.value,
                          )
                        }
                      />
                    </Field>

                    <Field label="Nächste Nummer">
                      <Input
                        value={draft?.deliveryNoteNextNumber ?? ""}
                        readOnly={!isEditing}
                        onChange={(event) =>
                          updateDraftField(
                            "deliveryNoteNextNumber",
                            event.target.value,
                          )
                        }
                      />
                    </Field>
                  </div>
                </section>

                <section className="workspace-panel" style={{ padding: "20px" }}>
                  <SectionHeader>Rechnungen</SectionHeader>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "104px minmax(0, 1fr)",
                      gap: "14px",
                      alignItems: "end",
                    }}
                  >
                    <Field label="Präfix">
                      <Input
                        value={draft?.invoicePrefix ?? ""}
                        readOnly={!isEditing}
                        onChange={(event) =>
                          updateDraftField("invoicePrefix", event.target.value)
                        }
                      />
                    </Field>

                    <Field label="Nächste Nummer">
                      <Input
                        value={draft?.invoiceNextNumber ?? ""}
                        readOnly={!isEditing}
                        onChange={(event) =>
                          updateDraftField("invoiceNextNumber", event.target.value)
                        }
                      />
                    </Field>
                  </div>
                </section>

                <section className="workspace-panel" style={{ padding: "20px" }}>
                  <SectionHeader>Mahnungen</SectionHeader>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "104px minmax(0, 1fr)",
                      gap: "14px",
                      alignItems: "end",
                    }}
                  >
                    <Field label="Präfix">
                      <Input
                        value={draft?.reminderPrefix ?? ""}
                        readOnly={!isEditing}
                        onChange={(event) =>
                          updateDraftField("reminderPrefix", event.target.value)
                        }
                      />
                    </Field>

                    <Field label="Nächste Nummer">
                      <Input
                        value={draft?.reminderNextNumber ?? ""}
                        readOnly={!isEditing}
                        onChange={(event) =>
                          updateDraftField("reminderNextNumber", event.target.value)
                        }
                      />
                    </Field>
                  </div>
                </section>
              </div>
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


          {activeTab === "Formate" && (
            <>
              <SectionHeader>Endformate</SectionHeader>

              <div className="settings-data-intro">
                Zentrale Endformate für Einzelblatt, Flyer, Broschüren, Blöcke,
                SD-Sätze und spätere Kalkulationsarten. Die Kalkulation liest
                diese Stammdaten im nächsten Schritt direkt aus den Einstellungen.
              </div>

              <div className="settings-data-actions">
                <Button onClick={addProductFormat} disabled={!isEditing}>Format hinzufügen</Button>
              </div>

              <div className="settings-data-list">
                {(draft?.productFormats ?? []).map((format) => (
                  <article className="settings-data-card" key={format.id}>
                    <div className="settings-data-card-header">
                      <strong>{format.name}</strong>
                      <span>
                        {format.widthMm} × {format.heightMm} mm · {format.category}
                      </span>
                    </div>

                    <FieldGrid>
                      <Field label="Name">
                        <Input
                          value={format.name}
                          readOnly={!isEditing}
                          onChange={(event) =>
                            updateProductFormat(format.id, {
                              name: event.target.value,
                            })
                          }
                        />
                      </Field>

                      <Field label="Breite mm">
                        <Input
                          inputMode="decimal"
                          value={format.widthMm}
                          readOnly={!isEditing}
                          onChange={(event) =>
                            updateProductFormat(format.id, {
                              widthMm: event.target.value,
                            })
                          }
                        />
                      </Field>

                      <Field label="Höhe mm">
                        <Input
                          inputMode="decimal"
                          value={format.heightMm}
                          readOnly={!isEditing}
                          onChange={(event) =>
                            updateProductFormat(format.id, {
                              heightMm: event.target.value,
                            })
                          }
                        />
                      </Field>

                      <Field label="Kategorie">
                        <Select
                          value={format.category}
                          disabled={!isEditing}
                          onChange={(event) =>
                            updateProductFormat(format.id, {
                              category: event.target
                                .value as PrintPilotFormatCategory,
                            })
                          }
                        >
                          {productFormatCategoryOptions.map((category) => (
                            <option key={category}>{category}</option>
                          ))}
                        </Select>
                      </Field>

                      <Field label="Aktiv">
                        <Select
                          value={format.isActive}
                          disabled={!isEditing}
                          onChange={(event) =>
                            updateProductFormat(format.id, {
                              isActive: event.target.value,
                            })
                          }
                        >
                          <option>Ja</option>
                          <option>Nein</option>
                        </Select>
                      </Field>

                      <Field label="Standard">
                        <Select
                          value={format.isDefault}
                          disabled={!isEditing}
                          onChange={(event) => {
                            if (event.target.value === "Ja") {
                              setDefaultProductFormat(format.id);
                            } else {
                              updateProductFormat(format.id, {
                                isDefault: "Nein",
                              });
                            }
                          }}
                        >
                          <option>Ja</option>
                          <option>Nein</option>
                        </Select>
                      </Field>
                    </FieldGrid>

                    <div className="settings-product-type-grid">
                      {productTypeOptions.map((productType) => (
                        <label key={productType}>
                          <input
                            type="checkbox"
                            checked={format.productTypes.includes(productType)}
                            disabled={!isEditing}
                            onChange={() =>
                              toggleProductFormatType(format, productType)
                            }
                          />
                          <span>{productType}</span>
                        </label>
                      ))}
                    </div>

                    <div className="settings-data-card-footer">
                      <Button
                        onClick={() => removeProductFormat(format.id)}
                        disabled={!isEditing || format.isDefault === "Ja"}
                      >
                        Löschen
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {activeTab === "Rohbogenformate" && (
            <>
              <SectionHeader>Rohbogenformate</SectionHeader>

              <div className="settings-data-intro">
                Rohbogenformate sind die Ausgangsformate für Nutzenberechnung,
                Papierverbrauch und Maschinenfähigkeit. Langbogen und
                Bannerbogen sind hier bewusst als Stammdaten vorbereitet.
              </div>

              <div className="settings-data-actions">
                <Button onClick={addRawSheetFormat} disabled={!isEditing}>Rohbogen hinzufügen</Button>
              </div>

              <div className="settings-data-list">
                {(draft?.rawSheetFormats ?? []).map((format) => (
                  <article className="settings-data-card" key={format.id}>
                    <div className="settings-data-card-header">
                      <strong>{format.name}</strong>
                      <span>
                        {format.widthMm} × {format.heightMm} mm · {format.category}
                      </span>
                    </div>

                    <FieldGrid>
                      <Field label="Name">
                        <Input
                          value={format.name}
                          readOnly={!isEditing}
                          onChange={(event) =>
                            updateRawSheetFormat(format.id, {
                              name: event.target.value,
                            })
                          }
                        />
                      </Field>

                      <Field label="Breite mm">
                        <Input
                          inputMode="decimal"
                          value={format.widthMm}
                          readOnly={!isEditing}
                          onChange={(event) =>
                            updateRawSheetFormat(format.id, {
                              widthMm: event.target.value,
                            })
                          }
                        />
                      </Field>

                      <Field label="Höhe mm">
                        <Input
                          inputMode="decimal"
                          value={format.heightMm}
                          readOnly={!isEditing}
                          onChange={(event) =>
                            updateRawSheetFormat(format.id, {
                              heightMm: event.target.value,
                            })
                          }
                        />
                      </Field>

                      <Field label="Kategorie">
                        <Select
                          value={format.category}
                          disabled={!isEditing}
                          onChange={(event) =>
                            updateRawSheetFormat(format.id, {
                              category: event.target
                                .value as PrintPilotRawSheetCategory,
                            })
                          }
                        >
                          {rawSheetCategoryOptions.map((category) => (
                            <option key={category}>{category}</option>
                          ))}
                        </Select>
                      </Field>

                      <Field label="Maschine">
                        <Input
                          value={format.machine}
                          readOnly={!isEditing}
                          onChange={(event) =>
                            updateRawSheetFormat(format.id, {
                              machine: event.target.value,
                            })
                          }
                        />
                      </Field>

                      <Field label="Laufrichtung">
                        <Select
                          value={format.grainDirection}
                          disabled={!isEditing}
                          onChange={(event) =>
                            updateRawSheetFormat(format.id, {
                              grainDirection: event.target
                                .value as PrintPilotGrainDirection,
                            })
                          }
                        >
                          {grainDirectionOptions.map((grainDirection) => (
                            <option key={grainDirection}>{grainDirection}</option>
                          ))}
                        </Select>
                      </Field>

                      <Field label="Aktiv">
                        <Select
                          value={format.isActive}
                          disabled={!isEditing}
                          onChange={(event) =>
                            updateRawSheetFormat(format.id, {
                              isActive: event.target.value,
                            })
                          }
                        >
                          <option>Ja</option>
                          <option>Nein</option>
                        </Select>
                      </Field>

                      <Field label="Standard">
                        <Select
                          value={format.isDefault}
                          disabled={!isEditing}
                          onChange={(event) => {
                            if (event.target.value === "Ja") {
                              setDefaultRawSheetFormat(format.id);
                            } else {
                              updateRawSheetFormat(format.id, {
                                isDefault: "Nein",
                              });
                            }
                          }}
                        >
                          <option>Ja</option>
                          <option>Nein</option>
                        </Select>
                      </Field>
                    </FieldGrid>

                    <div className="settings-data-card-footer">
                      <Button
                        onClick={() => removeRawSheetFormat(format.id)}
                        disabled={!isEditing || format.isDefault === "Ja"}
                      >
                        Löschen
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
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

                {isReplaceArmed && (
                  <Button variant="primary" onClick={handleExecuteReplaceAll}>
                    Import jetzt ausführen
                  </Button>
                )}

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
                onClick={handleSaveSettings}
              />
            </div>
          )}
        </section>
      </section>

      <ConfirmDialog
        open={isReplaceConfirmOpen}
        title="Backup wirklich einspielen?"
        description={
          <>
            Alle aktuellen lokalen PrintPilot-Daten werden durch das ausgewählte
            Backup ersetzt. Vorher wird automatisch ein Sicherheitsbackup des
            aktuellen Standes heruntergeladen.
          </>
        }
        details={
          selectedBackupSummary ? (
            <>
              <span>
                <strong>Backup:</strong> Version {selectedBackupSummary.version}
              </span>
              <span>
                <strong>Erstellt:</strong>{" "}
                {formatBackupDate(selectedBackupSummary.createdAt)}
              </span>
              <span>
                <strong>Umfang:</strong> {selectedBackupSummary.customers} Kunden
                · {selectedBackupSummary.quotes} Angebote ·{" "}
                {selectedBackupSummary.orders} Aufträge
              </span>
            </>
          ) : null
        }
        variant="danger"
        cancelLabel="Abbrechen"
        confirmLabel="Alles ersetzen"
        onCancel={handleCancelReplaceAll}
        onConfirm={handleConfirmReplaceAll}
      />

    </div>
  );
}
