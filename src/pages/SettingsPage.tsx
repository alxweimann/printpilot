import { useState } from "react";
import { getModuleConfig } from "../app/moduleConfig";
import { PageHeader } from "../layout/PageHeader";
import { PageTabs } from "../layout/PageTabs";
import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { FieldGrid } from "../ui/FieldGrid";
import { Input } from "../ui/Input";
import { SectionHeader } from "../ui/SectionHeader";
import { Select } from "../ui/Select";
import { WorkspaceHeader } from "../ui/WorkspaceHeader";

const settingsTabs = ["Allgemein", "Nummernkreise", "Firma", "Design", "System"] as const;

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
  }
}

export function SettingsPage() {
  const module = getModuleConfig("settings");
  const [activeTab, setActiveTab] = useState<SettingsTab>("Allgemein");

  function handleTabChange(tab: string) {
    if (isSettingsTab(tab)) {
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
        tabs={[...settingsTabs]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="Systemmaske"
          title={getSettingsTitle(activeTab)}
          statusValue="Lokal"
        />

        <div className="master-detail-layout">
          <section className="workspace-panel master-list-panel">
            <SectionHeader>Bereiche</SectionHeader>

            <div className="settings-nav-list">
              {settingsTabs.map((tab) => (
                <button
                  type="button"
                  key={tab}
                  className={tab === activeTab ? "settings-nav-item active" : "settings-nav-item"}
                  onClick={() => handleTabChange(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </section>

          <section className="workspace-panel master-editor-panel">
            {activeTab === "Allgemein" && (
              <>
                <SectionHeader>Allgemein</SectionHeader>

                <FieldGrid>
                  <Field label="Software-Name">
                    <Input placeholder="PrintPilot" />
                  </Field>

                  <Field label="Arbeitsmodus">
                    <Select defaultValue="Lokal">
                      <option>Lokal</option>
                      <option>Server später</option>
                    </Select>
                  </Field>

                  <Field label="Standardmodul">
                    <Select defaultValue="Dashboard">
                      <option>Dashboard</option>
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
                  <Field label="Angebote">
                    <Input placeholder="AG-{YYYY}-{000}" />
                  </Field>

                  <Field label="Aufträge">
                    <Input placeholder="AU-{YYYY}-{000}" />
                  </Field>

                  <Field label="Rechnungen">
                    <Input placeholder="RE-{YYYY}-{000}" />
                  </Field>

                  <Field label="Lieferscheine">
                    <Input placeholder="LS-{YYYY}-{000}" />
                  </Field>

                  <Field label="Mahnungen">
                    <Input placeholder="MA-{YYYY}-{000}" />
                  </Field>

                  <Field label="Kunden">
                    <Input placeholder="KD-{0000}" />
                  </Field>
                </FieldGrid>
              </>
            )}

            {activeTab === "Firma" && (
              <>
                <SectionHeader>Firma</SectionHeader>

                <FieldGrid>
                  <Field label="Firmenname">
                    <Input placeholder="z. B. Sonnendruck GmbH" />
                  </Field>

                  <Field label="Straße">
                    <Input placeholder="Straße und Hausnummer" />
                  </Field>

                  <Field label="PLZ / Ort">
                    <Input placeholder="PLZ und Ort" />
                  </Field>

                  <Field label="Telefon">
                    <Input placeholder="Telefonnummer" />
                  </Field>

                  <Field label="E-Mail">
                    <Input type="email" placeholder="mail@example.de" />
                  </Field>

                  <Field label="Website">
                    <Input placeholder="www.example.de" />
                  </Field>
                </FieldGrid>
              </>
            )}

            {activeTab === "Design" && (
              <>
                <SectionHeader>Design</SectionHeader>

                <FieldGrid>
                  <Field label="Darstellung">
                    <Select defaultValue="Kompakt">
                      <option>Kompakt</option>
                      <option>Normal</option>
                    </Select>
                  </Field>

                  <Field label="Sidebar">
                    <Select defaultValue="Dunkel">
                      <option>Dunkel</option>
                      <option>Hell später</option>
                    </Select>
                  </Field>

                  <Field label="Akzentfarben">
                    <Select defaultValue="Modulfarben">
                      <option>Modulfarben</option>
                      <option>Einheitlich später</option>
                    </Select>
                  </Field>
                </FieldGrid>
              </>
            )}

            {activeTab === "System" && (
              <>
                <SectionHeader>System</SectionHeader>

                <FieldGrid>
                  <Field label="Speicherort">
                    <Input placeholder="lokal im Browser / später Datenbank" disabled />
                  </Field>

                  <Field label="Export">
                    <Select defaultValue="Manuell">
                      <option>Manuell</option>
                      <option>Automatisch später</option>
                    </Select>
                  </Field>

                  <Field label="Backup">
                    <Select defaultValue="Nicht aktiv">
                      <option>Nicht aktiv</option>
                      <option>Später planen</option>
                    </Select>
                  </Field>

                  <Field label="Version">
                    <Input placeholder="Design-Baseline" disabled />
                  </Field>

                  <Field label="Datenstatus">
                    <Input placeholder="Statische Designwerte" disabled />
                  </Field>

                  <Field label="Servermodus">
                    <Select defaultValue="Aus">
                      <option>Aus</option>
                      <option>Später</option>
                    </Select>
                  </Field>
                </FieldGrid>
              </>
            )}

            <div className="calculation-footer">
              <Button>Änderungen verwerfen</Button>
              <Button variant="primary">Einstellungen speichern</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
