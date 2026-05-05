import { useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";
import { useEditableDraft } from "../hooks/useEditableDraft";

import { PageHeader } from "../layout/PageHeader";
import { PageTabs } from "../layout/PageTabs";

import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { FieldGrid } from "../ui/FieldGrid";
import { Input } from "../ui/Input";
import { SectionHeader } from "../ui/SectionHeader";
import { Select } from "../ui/Select";
import { WorkspaceHeader } from "../ui/WorkspaceHeader";

const settingsTabs = [
  "Allgemein",
  "Nummernkreise",
  "Firma",
  "Design",
  "System",
] as const;

type SettingsTab = (typeof settingsTabs)[number];

type SettingsDraft = {
  id: string;
  mode: string;
  startModule: string;
  defaultCalculationModule: string;
  quotePrefix: string;
  quoteNextNumber: string;
  orderPrefix: string;
  orderNextNumber: string;
  invoicePrefix: string;
  invoiceNextNumber: string;
  companyName: string;
  companyStreet: string;
  companyZip: string;
  companyCity: string;
  companyPhone: string;
  companyEmail: string;
  density: string;
  appearance: string;
  moduleColors: string;
  backupMode: string;
  apiStatus: string;
  debugMode: string;
};

const initialSettingsDraft: SettingsDraft = {
  id: "settings-local",
  mode: "Lokal",
  startModule: "Dashboard",
  defaultCalculationModule: "Kalkulation",
  quotePrefix: "AG",
  quoteNextNumber: "2026-001",
  orderPrefix: "AU",
  orderNextNumber: "2026-001",
  invoicePrefix: "RE",
  invoiceNextNumber: "2026-001",
  companyName: "Sonnendruck GmbH",
  companyStreet: "",
  companyZip: "",
  companyCity: "",
  companyPhone: "",
  companyEmail: "",
  density: "Kompakt",
  appearance: "Hell später",
  moduleColors: "Einheitlich später",
  backupMode: "Manuell",
  apiStatus: "Nicht aktiv",
  debugMode: "Aus",
};

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
  }
}

export function SettingsPage() {
  const module = getModuleConfig("settings");

  const [activeTab, setActiveTab] = useState<SettingsTab>("Allgemein");
  const [isEditing, setIsEditing] = useState(false);

  const { draft, updateDraftField, resetDraft } =
    useEditableDraft(initialSettingsDraft);

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

          <div className="calculation-footer">
            <button
              type="button"
              aria-label={
                isEditing ? "Bearbeitung sperren" : "Bearbeitung öffnen"
              }
              title={isEditing ? "Bearbeitung sperren" : "Bearbeitung öffnen"}
              onClick={handleToggleEditing}
              style={{
                alignItems: "center",
                alignSelf: "center",
                background: "transparent",
                border: 0,
                boxShadow: "none",
                cursor: "pointer",
                display: "inline-flex",
                fontSize: "1.55rem",
                height: "2.5rem",
                justifyContent: "center",
                lineHeight: 1,
                padding: 0,
                width: "1.65rem",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  alignItems: "center",
                  display: "inline-flex",
                  height: "100%",
                  justifyContent: "center",
                  transform: "translateY(-4px)",
                }}
              >
                {isEditing ? "🔓" : "🔒"}
              </span>
            </button>

            <Button onClick={handleResetDraft}>Änderungen verwerfen</Button>

            <Button variant="primary">Einstellungen speichern</Button>
          </div>
        </section>
      </section>
    </div>
  );
}
