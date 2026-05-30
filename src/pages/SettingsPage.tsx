import { useRef, useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";
import {
  type PrintPilotFormatCategory,
  type PrintPilotFoldType,
  type PrintPilotGrainDirection,
  type PrintPilotProductFormat,
  type PrintPilotProductTemplate,
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

import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { DetailDrawer } from "../ui/DetailDrawer";
import { DirtyStateNotice } from "../ui/DirtyStateNotice";
import { EditLockToggle } from "../ui/EditLockToggle";
import { Field } from "../ui/Field";
import { FieldGrid } from "../ui/FieldGrid";
import { Input } from "../ui/Input";
import { SaveActionButton } from "../ui/SaveActionButton";
import { SectionHeader } from "../ui/SectionHeader";
import { Select } from "../ui/Select";
import { TableShell } from "../ui/Table";
import { WorkspaceHeader } from "../ui/WorkspaceHeader";

const settingsTabs = [
  "Allgemein",
  "Nummernkreise",
  "Firma",
  "Design",
  "Formate",
  "Rohbogenformate",
  "Produktvorlagen",
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

    case "Produktvorlagen":
      return "Produktvorlagen verwalten";

    case "System":
      return "Systemeinstellungen prüfen";

    case "Datensicherung":
      return "Datensicherung verwalten";
  }
}


const productTypeOptions: PrintPilotProductType[] = [
  "Einzelblatt",
  "Flyer",
  "Folder/Falzflyer",
  "Broschüre",
  "Block",
  "SD-Satz",
  "Karte",
  "Großformat",
];

const productFormatCategoryOptions: PrintPilotFormatCategory[] = [
  "DIN",
  "Flyer",
  "Folder",
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

const foldTypeOptions: PrintPilotFoldType[] = [
  "Kein Falz",
  "Einfachfalz",
  "Wickelfalz",
  "Zickzackfalz",
  "Doppelparallelfalz",
  "Altarfalz",
  "Kreuzbruch",
  "Sonderfalz",
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

function getYesNoBadgeVariant(value: string) {
  return value === "Ja" ? "success" : "neutral";
}

function formatProductTypes(productTypes: PrintPilotProductType[]) {
  return productTypes.length > 0 ? productTypes.join(", ") : "Keine Zuordnung";
}

function formatFormatSize(widthMm: string, heightMm: string) {
  return `${widthMm} × ${heightMm} mm`;
}

function getProductFormatName(
  productFormats: PrintPilotProductFormat[],
  formatId: string,
) {
  return productFormats.find((format) => format.id === formatId)?.name ?? "Freies Format";
}

function formatTemplateSize(template: PrintPilotProductTemplate) {
  return `${template.openWidthMm} × ${template.openHeightMm} mm offen`;
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
  const [selectedProductFormatId, setSelectedProductFormatId] =
    useState<string | null>(null);
  const [selectedRawSheetFormatId, setSelectedRawSheetFormatId] =
    useState<string | null>(null);
  const [selectedProductTemplateId, setSelectedProductTemplateId] =
    useState<string | null>(null);
  const [isProductFormatDrawerOpen, setIsProductFormatDrawerOpen] =
    useState(false);
  const [isRawSheetDrawerOpen, setIsRawSheetDrawerOpen] = useState(false);
  const [isProductTemplateDrawerOpen, setIsProductTemplateDrawerOpen] =
    useState(false);
  const [isReplaceArmed, setIsReplaceArmed] = useState(false);
  const [isReplaceConfirmOpen, setIsReplaceConfirmOpen] = useState(false);
  const backupInputRef = useRef<HTMLInputElement | null>(null);

  const { draft, isDirty, updateDraftField, resetDraft, saveDraft } =
    useEditableDraft(settings);

  const selectedProductFormat =
    draft?.productFormats.find((format) => format.id === selectedProductFormatId) ??
    null;
  const selectedRawSheetFormat =
    draft?.rawSheetFormats.find((format) => format.id === selectedRawSheetFormatId) ??
    null;
  const selectedProductTemplate =
    draft?.productTemplates.find(
      (template) => template.id === selectedProductTemplateId,
    ) ?? null;
  const canEditMasterData = isEditing;

  function handleTabChange(tab: string) {
    if (isSettingsTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
      setIsProductFormatDrawerOpen(false);
      setIsRawSheetDrawerOpen(false);
      setIsProductTemplateDrawerOpen(false);
      setSelectedProductFormatId(null);
      setSelectedRawSheetFormatId(null);
      setSelectedProductTemplateId(null);
      setIsReplaceArmed(false);
      setIsReplaceConfirmOpen(false);
    }
  }

  function handleResetDraft() {
    resetDraft();
    setIsEditing(false);
    setIsProductFormatDrawerOpen(false);
    setIsRawSheetDrawerOpen(false);
    setIsProductTemplateDrawerOpen(false);
    setSelectedProductFormatId(null);
    setSelectedRawSheetFormatId(null);
    setSelectedProductTemplateId(null);
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

  function handleProductFormatSelect(formatId: string) {
    setSelectedProductFormatId(formatId);
    setIsProductFormatDrawerOpen(true);
  }

  function handleRawSheetFormatSelect(formatId: string) {
    setSelectedRawSheetFormatId(formatId);
    setIsRawSheetDrawerOpen(true);
  }

  function handleProductTemplateSelect(templateId: string) {
    setSelectedProductTemplateId(templateId);
    setIsProductTemplateDrawerOpen(true);
  }

  function handleCloseProductFormatDrawer() {
    setIsProductFormatDrawerOpen(false);
  }

  function handleCloseRawSheetDrawer() {
    setIsRawSheetDrawerOpen(false);
  }

  function handleCloseProductTemplateDrawer() {
    setIsProductTemplateDrawerOpen(false);
  }

  function handleSaveAndCloseSettings() {
    handleSaveSettings();
    setIsProductFormatDrawerOpen(false);
    setIsRawSheetDrawerOpen(false);
    setIsProductTemplateDrawerOpen(false);
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

    const nextFormat: PrintPilotProductFormat = {
      id: createDraftId("format"),
      name: "Neues Format",
      widthMm: "210",
      heightMm: "297",
      category: "Sonderformat",
      productTypes: ["Einzelblatt"],
      isDefault: "Nein",
      isActive: "Ja",
    };

    updateDraftField("productFormats", [...draft.productFormats, nextFormat]);
    setSelectedProductFormatId(nextFormat.id);
    setIsProductFormatDrawerOpen(true);
  }

  function removeProductFormat(formatId: string) {
    if (!draft) return;

    updateDraftField(
      "productFormats",
      draft.productFormats.filter((format) => format.id !== formatId),
    );
    if (selectedProductFormatId === formatId) {
      setIsProductFormatDrawerOpen(false);
      setSelectedProductFormatId(null);
    }
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

    const nextFormat: PrintPilotRawSheetFormat = {
      id: createDraftId("raw"),
      name: "Neuer Rohbogen",
      widthMm: "450",
      heightMm: "320",
      category: "Sonderformat",
      machine: "Digitaldruck allgemein",
      grainDirection: "Unbekannt",
      isDefault: "Nein",
      isActive: "Ja",
    };

    updateDraftField("rawSheetFormats", [...draft.rawSheetFormats, nextFormat]);
    setSelectedRawSheetFormatId(nextFormat.id);
    setIsRawSheetDrawerOpen(true);
  }

  function removeRawSheetFormat(formatId: string) {
    if (!draft) return;

    updateDraftField(
      "rawSheetFormats",
      draft.rawSheetFormats.filter((format) => format.id !== formatId),
    );
    if (selectedRawSheetFormatId === formatId) {
      setIsRawSheetDrawerOpen(false);
      setSelectedRawSheetFormatId(null);
    }
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

  function updateProductTemplate(
    templateId: string,
    patch: Partial<PrintPilotProductTemplate>,
  ) {
    if (!draft) return;

    updateDraftField(
      "productTemplates",
      draft.productTemplates.map((template) =>
        template.id === templateId ? { ...template, ...patch } : template,
      ),
    );
  }

  function addProductTemplate() {
    if (!draft) return;

    const defaultFormat =
      draft.productFormats.find((format) => format.name === "DIN Lang") ??
      draft.productFormats[0];

    const nextTemplate: PrintPilotProductTemplate = {
      id: createDraftId("product-template"),
      name: "Neue Produktvorlage",
      productType: "Folder/Falzflyer",
      closedFormatId: defaultFormat?.id ?? "",
      openWidthMm: "297",
      openHeightMm: "210",
      pages: "6",
      panels: "3",
      foldType: "Wickelfalz",
      panelWidthsMm: "100 / 100 / 97",
      standardBleedMm: "3",
      finishing: "Falzen",
      isDefault: "Nein",
      isActive: "Ja",
    };

    updateDraftField("productTemplates", [
      ...draft.productTemplates,
      nextTemplate,
    ]);
    setSelectedProductTemplateId(nextTemplate.id);
    setIsProductTemplateDrawerOpen(true);
  }

  function removeProductTemplate(templateId: string) {
    if (!draft) return;

    updateDraftField(
      "productTemplates",
      draft.productTemplates.filter((template) => template.id !== templateId),
    );
    if (selectedProductTemplateId === templateId) {
      setIsProductTemplateDrawerOpen(false);
      setSelectedProductTemplateId(null);
    }
  }

  function setDefaultProductTemplate(templateId: string) {
    if (!draft) return;

    updateDraftField(
      "productTemplates",
      draft.productTemplates.map((template) => ({
        ...template,
        isDefault: template.id === templateId ? "Ja" : "Nein",
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
                SD-Sätze und spätere Kalkulationsarten. Änderungen erfolgen wie
                in den anderen Modulen über Listenansicht und Detaildrawer.
              </div>

              <div className="settings-list-toolbar">
                <div>
                  <strong>{draft?.productFormats.length ?? 0} Endformate</strong>
                  <span>Aktive Formate steuern die Auswahl in der Kalkulation.</span>
                </div>

                <Button onClick={addProductFormat} disabled={!canEditMasterData}>
                  Format hinzufügen
                </Button>
              </div>

              <TableShell className="settings-master-table-shell">
                <table className="data-table settings-master-table">
                  <colgroup>
                    <col style={{ width: "22%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "28%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "11%" }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Format</th>
                      <th>Kategorie</th>
                      <th>Produktarten</th>
                      <th>Aktiv</th>
                      <th>Standard</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(draft?.productFormats ?? []).map((format) => (
                      <tr
                        key={format.id}
                        className={
                          selectedProductFormatId === format.id
                            ? "data-table-row-selected"
                            : undefined
                        }
                        onClick={() => handleProductFormatSelect(format.id)}
                      >
                        <td>
                          <strong className="settings-table-primary-text">
                            {format.name}
                          </strong>
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {formatFormatSize(format.widthMm, format.heightMm)}
                        </td>
                        <td>{format.category}</td>
                        <td>
                          <span className="settings-table-muted-text">
                            {formatProductTypes(format.productTypes)}
                          </span>
                        </td>
                        <td>
                          <Badge variant={getYesNoBadgeVariant(format.isActive)}>
                            {format.isActive === "Ja" ? "Aktiv" : "Inaktiv"}
                          </Badge>
                        </td>
                        <td>
                          <Badge variant={getYesNoBadgeVariant(format.isDefault)}>
                            {format.isDefault === "Ja" ? "Standard" : "—"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableShell>
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

              <div className="settings-list-toolbar">
                <div>
                  <strong>{draft?.rawSheetFormats.length ?? 0} Rohbogenformate</strong>
                  <span>Aktive Rohbogen erscheinen im Digitaldruck-Rechner.</span>
                </div>

                <Button onClick={addRawSheetFormat} disabled={!canEditMasterData}>
                  Rohbogen hinzufügen
                </Button>
              </div>

              <TableShell className="settings-master-table-shell">
                <table className="data-table settings-master-table">
                  <colgroup>
                    <col style={{ width: "22%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "19%" }} />
                    <col style={{ width: "13%" }} />
                    <col style={{ width: "8%" }} />
                    <col style={{ width: "8%" }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Format</th>
                      <th>Kategorie</th>
                      <th>Maschine</th>
                      <th>Laufrichtung</th>
                      <th>Aktiv</th>
                      <th>Standard</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(draft?.rawSheetFormats ?? []).map((format) => (
                      <tr
                        key={format.id}
                        className={
                          selectedRawSheetFormatId === format.id
                            ? "data-table-row-selected"
                            : undefined
                        }
                        onClick={() => handleRawSheetFormatSelect(format.id)}
                      >
                        <td>
                          <strong className="settings-table-primary-text">
                            {format.name}
                          </strong>
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {formatFormatSize(format.widthMm, format.heightMm)}
                        </td>
                        <td>{format.category}</td>
                        <td>
                          <span className="settings-table-muted-text">
                            {format.machine || "Allgemein"}
                          </span>
                        </td>
                        <td>{format.grainDirection}</td>
                        <td>
                          <Badge variant={getYesNoBadgeVariant(format.isActive)}>
                            {format.isActive === "Ja" ? "Aktiv" : "Inaktiv"}
                          </Badge>
                        </td>
                        <td>
                          <Badge variant={getYesNoBadgeVariant(format.isDefault)}>
                            {format.isDefault === "Ja" ? "Standard" : "—"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableShell>
            </>
          )}


          {activeTab === "Produktvorlagen" && (
            <>
              <SectionHeader>Produktvorlagen</SectionHeader>

              <div className="settings-data-intro">
                Produktvorlagen verbinden Produktart, geschlossenes Format,
                offenes Druckformat und Weiterverarbeitung. Sie bilden die
                Grundlage für Folder/Falzflyer, Broschüren, Blöcke und SD-Sätze.
              </div>

              <div className="settings-list-toolbar">
                <div>
                  <strong>{draft?.productTemplates.length ?? 0} Produktvorlagen</strong>
                  <span>Vorlagen steuern später die produktartspezifische Kalkulation.</span>
                </div>

                <Button onClick={addProductTemplate} disabled={!canEditMasterData}>
                  Vorlage hinzufügen
                </Button>
              </div>

              <TableShell className="settings-master-table-shell">
                <table className="data-table settings-master-table">
                  <colgroup>
                    <col style={{ width: "24%" }} />
                    <col style={{ width: "16%" }} />
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "16%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "5%" }} />
                    <col style={{ width: "5%" }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Produktart</th>
                      <th>Geschlossen</th>
                      <th>Offenes Format</th>
                      <th>Seiten</th>
                      <th>Falzart</th>
                      <th>Aktiv</th>
                      <th>Standard</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(draft?.productTemplates ?? []).map((template) => (
                      <tr
                        key={template.id}
                        className={
                          selectedProductTemplateId === template.id
                            ? "data-table-row-selected"
                            : undefined
                        }
                        onClick={() => handleProductTemplateSelect(template.id)}
                      >
                        <td>
                          <strong className="settings-table-primary-text">
                            {template.name}
                          </strong>
                        </td>
                        <td>{template.productType}</td>
                        <td>
                          <span className="settings-table-muted-text">
                            {getProductFormatName(
                              draft?.productFormats ?? [],
                              template.closedFormatId,
                            )}
                          </span>
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {formatTemplateSize(template)}
                        </td>
                        <td>{template.pages} S. / {template.panels} Panels</td>
                        <td>{template.foldType}</td>
                        <td>
                          <Badge variant={getYesNoBadgeVariant(template.isActive)}>
                            {template.isActive === "Ja" ? "Aktiv" : "Inaktiv"}
                          </Badge>
                        </td>
                        <td>
                          <Badge variant={getYesNoBadgeVariant(template.isDefault)}>
                            {template.isDefault === "Ja" ? "Standard" : "—"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableShell>
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

      <DetailDrawer
        accentColor={module.accentColor}
        open={isProductFormatDrawerOpen && Boolean(selectedProductFormat)}
        eyebrow="Endformat"
        title={selectedProductFormat?.name ?? "Endformat"}
        subtitle={
          selectedProductFormat
            ? `${formatFormatSize(
                selectedProductFormat.widthMm,
                selectedProductFormat.heightMm,
              )} · ${selectedProductFormat.category}`
            : undefined
        }
        onClose={handleCloseProductFormatDrawer}
        size="lg"
        footer={
          <>
            <DirtyStateNotice isDirty={isDirty} />

            <EditLockToggle
              isEditing={isEditing}
              onToggle={handleToggleEditing}
            />

            <Button onClick={handleResetDraft}>Änderungen verwerfen</Button>

            {selectedProductFormat ? (
              <Button
                onClick={() => removeProductFormat(selectedProductFormat.id)}
                disabled={!canEditMasterData || selectedProductFormat.isDefault === "Ja"}
              >
                Löschen
              </Button>
            ) : null}

            <SaveActionButton
              isDirty={isDirty}
              defaultLabel="Einstellungen speichern"
              onClick={handleSaveAndCloseSettings}
            />
          </>
        }
      >
        {selectedProductFormat ? (
          <div className="detail-drawer-stack">
            <section className="detail-drawer-panel">
              <SectionHeader>Formatdaten</SectionHeader>

              <FieldGrid>
                <Field label="Name">
                  <Input
                    value={selectedProductFormat.name}
                    readOnly={!canEditMasterData}
                    onChange={(event) =>
                      updateProductFormat(selectedProductFormat.id, {
                        name: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Kategorie">
                  <Select
                    value={selectedProductFormat.category}
                    disabled={!canEditMasterData}
                    onChange={(event) =>
                      updateProductFormat(selectedProductFormat.id, {
                        category: event.target.value as PrintPilotFormatCategory,
                      })
                    }
                  >
                    {productFormatCategoryOptions.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </Select>
                </Field>

                <Field label="Breite mm">
                  <Input
                    inputMode="decimal"
                    value={selectedProductFormat.widthMm}
                    readOnly={!canEditMasterData}
                    onChange={(event) =>
                      updateProductFormat(selectedProductFormat.id, {
                        widthMm: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Höhe mm">
                  <Input
                    inputMode="decimal"
                    value={selectedProductFormat.heightMm}
                    readOnly={!canEditMasterData}
                    onChange={(event) =>
                      updateProductFormat(selectedProductFormat.id, {
                        heightMm: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Aktiv">
                  <Select
                    value={selectedProductFormat.isActive}
                    disabled={!canEditMasterData}
                    onChange={(event) =>
                      updateProductFormat(selectedProductFormat.id, {
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
                    value={selectedProductFormat.isDefault}
                    disabled={!canEditMasterData}
                    onChange={(event) => {
                      if (event.target.value === "Ja") {
                        setDefaultProductFormat(selectedProductFormat.id);
                      } else {
                        updateProductFormat(selectedProductFormat.id, {
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
            </section>

            <section className="detail-drawer-panel">
              <SectionHeader>Produktarten</SectionHeader>

              <div className="settings-product-type-grid">
                {productTypeOptions.map((productType) => (
                  <label key={productType}>
                    <input
                      type="checkbox"
                      checked={selectedProductFormat.productTypes.includes(productType)}
                      disabled={!canEditMasterData}
                      onChange={() =>
                        toggleProductFormatType(selectedProductFormat, productType)
                      }
                    />
                    <span>{productType}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>
        ) : null}
      </DetailDrawer>

      <DetailDrawer
        accentColor={module.accentColor}
        open={isRawSheetDrawerOpen && Boolean(selectedRawSheetFormat)}
        eyebrow="Rohbogenformat"
        title={selectedRawSheetFormat?.name ?? "Rohbogenformat"}
        subtitle={
          selectedRawSheetFormat
            ? `${formatFormatSize(
                selectedRawSheetFormat.widthMm,
                selectedRawSheetFormat.heightMm,
              )} · ${selectedRawSheetFormat.category}`
            : undefined
        }
        onClose={handleCloseRawSheetDrawer}
        size="lg"
        footer={
          <>
            <DirtyStateNotice isDirty={isDirty} />

            <EditLockToggle
              isEditing={isEditing}
              onToggle={handleToggleEditing}
            />

            <Button onClick={handleResetDraft}>Änderungen verwerfen</Button>

            {selectedRawSheetFormat ? (
              <Button
                onClick={() => removeRawSheetFormat(selectedRawSheetFormat.id)}
                disabled={!canEditMasterData || selectedRawSheetFormat.isDefault === "Ja"}
              >
                Löschen
              </Button>
            ) : null}

            <SaveActionButton
              isDirty={isDirty}
              defaultLabel="Einstellungen speichern"
              onClick={handleSaveAndCloseSettings}
            />
          </>
        }
      >
        {selectedRawSheetFormat ? (
          <div className="detail-drawer-stack">
            <section className="detail-drawer-panel">
              <SectionHeader>Rohbogendaten</SectionHeader>

              <FieldGrid>
                <Field label="Name">
                  <Input
                    value={selectedRawSheetFormat.name}
                    readOnly={!canEditMasterData}
                    onChange={(event) =>
                      updateRawSheetFormat(selectedRawSheetFormat.id, {
                        name: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Kategorie">
                  <Select
                    value={selectedRawSheetFormat.category}
                    disabled={!canEditMasterData}
                    onChange={(event) =>
                      updateRawSheetFormat(selectedRawSheetFormat.id, {
                        category: event.target.value as PrintPilotRawSheetCategory,
                      })
                    }
                  >
                    {rawSheetCategoryOptions.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </Select>
                </Field>

                <Field label="Breite mm">
                  <Input
                    inputMode="decimal"
                    value={selectedRawSheetFormat.widthMm}
                    readOnly={!canEditMasterData}
                    onChange={(event) =>
                      updateRawSheetFormat(selectedRawSheetFormat.id, {
                        widthMm: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Höhe mm">
                  <Input
                    inputMode="decimal"
                    value={selectedRawSheetFormat.heightMm}
                    readOnly={!canEditMasterData}
                    onChange={(event) =>
                      updateRawSheetFormat(selectedRawSheetFormat.id, {
                        heightMm: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Maschine">
                  <Input
                    value={selectedRawSheetFormat.machine}
                    readOnly={!canEditMasterData}
                    onChange={(event) =>
                      updateRawSheetFormat(selectedRawSheetFormat.id, {
                        machine: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Laufrichtung">
                  <Select
                    value={selectedRawSheetFormat.grainDirection}
                    disabled={!canEditMasterData}
                    onChange={(event) =>
                      updateRawSheetFormat(selectedRawSheetFormat.id, {
                        grainDirection: event.target.value as PrintPilotGrainDirection,
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
                    value={selectedRawSheetFormat.isActive}
                    disabled={!canEditMasterData}
                    onChange={(event) =>
                      updateRawSheetFormat(selectedRawSheetFormat.id, {
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
                    value={selectedRawSheetFormat.isDefault}
                    disabled={!canEditMasterData}
                    onChange={(event) => {
                      if (event.target.value === "Ja") {
                        setDefaultRawSheetFormat(selectedRawSheetFormat.id);
                      } else {
                        updateRawSheetFormat(selectedRawSheetFormat.id, {
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
            </section>
          </div>
        ) : null}
      </DetailDrawer>


      <DetailDrawer
        accentColor={module.accentColor}
        open={isProductTemplateDrawerOpen && Boolean(selectedProductTemplate)}
        eyebrow="Produktvorlage"
        title={selectedProductTemplate?.name ?? "Produktvorlage"}
        subtitle={
          selectedProductTemplate
            ? `${selectedProductTemplate.productType} · ${formatTemplateSize(
                selectedProductTemplate,
              )}`
            : undefined
        }
        onClose={handleCloseProductTemplateDrawer}
        size="lg"
        footer={
          <>
            <DirtyStateNotice isDirty={isDirty} />

            <EditLockToggle
              isEditing={isEditing}
              onToggle={handleToggleEditing}
            />

            <Button onClick={handleResetDraft}>Änderungen verwerfen</Button>

            {selectedProductTemplate ? (
              <Button
                onClick={() => removeProductTemplate(selectedProductTemplate.id)}
                disabled={!canEditMasterData || selectedProductTemplate.isDefault === "Ja"}
              >
                Löschen
              </Button>
            ) : null}

            <SaveActionButton
              isDirty={isDirty}
              defaultLabel="Einstellungen speichern"
              onClick={handleSaveAndCloseSettings}
            />
          </>
        }
      >
        {selectedProductTemplate ? (
          <div className="detail-drawer-stack">
            <section className="detail-drawer-panel">
              <SectionHeader>Vorlagendaten</SectionHeader>

              <FieldGrid>
                <Field label="Name">
                  <Input
                    value={selectedProductTemplate.name}
                    readOnly={!canEditMasterData}
                    onChange={(event) =>
                      updateProductTemplate(selectedProductTemplate.id, {
                        name: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Produktart">
                  <Select
                    value={selectedProductTemplate.productType}
                    disabled={!canEditMasterData}
                    onChange={(event) =>
                      updateProductTemplate(selectedProductTemplate.id, {
                        productType: event.target.value as PrintPilotProductType,
                      })
                    }
                  >
                    {productTypeOptions.map((productType) => (
                      <option key={productType}>{productType}</option>
                    ))}
                  </Select>
                </Field>

                <Field label="Geschlossenes Format">
                  <Select
                    value={selectedProductTemplate.closedFormatId}
                    disabled={!canEditMasterData}
                    onChange={(event) =>
                      updateProductTemplate(selectedProductTemplate.id, {
                        closedFormatId: event.target.value,
                      })
                    }
                  >
                    {(draft?.productFormats ?? []).map((format) => (
                      <option key={format.id} value={format.id}>
                        {format.name} · {formatFormatSize(format.widthMm, format.heightMm)}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Offene Breite mm">
                  <Input
                    inputMode="decimal"
                    value={selectedProductTemplate.openWidthMm}
                    readOnly={!canEditMasterData}
                    onChange={(event) =>
                      updateProductTemplate(selectedProductTemplate.id, {
                        openWidthMm: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Offene Höhe mm">
                  <Input
                    inputMode="decimal"
                    value={selectedProductTemplate.openHeightMm}
                    readOnly={!canEditMasterData}
                    onChange={(event) =>
                      updateProductTemplate(selectedProductTemplate.id, {
                        openHeightMm: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Seiten">
                  <Input
                    inputMode="numeric"
                    value={selectedProductTemplate.pages}
                    readOnly={!canEditMasterData}
                    onChange={(event) =>
                      updateProductTemplate(selectedProductTemplate.id, {
                        pages: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Panels">
                  <Input
                    inputMode="numeric"
                    value={selectedProductTemplate.panels}
                    readOnly={!canEditMasterData}
                    onChange={(event) =>
                      updateProductTemplate(selectedProductTemplate.id, {
                        panels: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Falzart">
                  <Select
                    value={selectedProductTemplate.foldType}
                    disabled={!canEditMasterData}
                    onChange={(event) =>
                      updateProductTemplate(selectedProductTemplate.id, {
                        foldType: event.target.value as PrintPilotFoldType,
                      })
                    }
                  >
                    {foldTypeOptions.map((foldType) => (
                      <option key={foldType}>{foldType}</option>
                    ))}
                  </Select>
                </Field>

                <Field label="Panelbreiten mm">
                  <Input
                    value={selectedProductTemplate.panelWidthsMm}
                    readOnly={!canEditMasterData}
                    onChange={(event) =>
                      updateProductTemplate(selectedProductTemplate.id, {
                        panelWidthsMm: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Standard-Beschnitt mm">
                  <Input
                    inputMode="decimal"
                    value={selectedProductTemplate.standardBleedMm}
                    readOnly={!canEditMasterData}
                    onChange={(event) =>
                      updateProductTemplate(selectedProductTemplate.id, {
                        standardBleedMm: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Weiterverarbeitung">
                  <Input
                    value={selectedProductTemplate.finishing}
                    readOnly={!canEditMasterData}
                    onChange={(event) =>
                      updateProductTemplate(selectedProductTemplate.id, {
                        finishing: event.target.value,
                      })
                    }
                  />
                </Field>

                <Field label="Aktiv">
                  <Select
                    value={selectedProductTemplate.isActive}
                    disabled={!canEditMasterData}
                    onChange={(event) =>
                      updateProductTemplate(selectedProductTemplate.id, {
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
                    value={selectedProductTemplate.isDefault}
                    disabled={!canEditMasterData}
                    onChange={(event) => {
                      if (event.target.value === "Ja") {
                        setDefaultProductTemplate(selectedProductTemplate.id);
                      } else {
                        updateProductTemplate(selectedProductTemplate.id, {
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
            </section>
          </div>
        ) : null}
      </DetailDrawer>

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
