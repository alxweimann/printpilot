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

export function SettingsPage() {
  const module = getModuleConfig("settings");

  return (
    <div className="page">
      <PageHeader
        title={module.title}
        description={module.description}
        actionLabel={module.actionLabel}
      />

      <PageTabs tabs={module.tabs ?? []} activeTab="Allgemein" />

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="Systemmaske"
          title="Einstellungen verwalten"
          statusValue="Lokal"
        />

        <div className="quotes-layout">
          <section className="workspace-panel quotes-list-panel">
            <SectionHeader>Bereiche</SectionHeader>

            <div className="settings-nav-list">
              <button type="button" className="settings-nav-item active">
                Allgemein
              </button>
              <button type="button" className="settings-nav-item">
                Nummernkreise
              </button>
              <button type="button" className="settings-nav-item">
                Firma
              </button>
              <button type="button" className="settings-nav-item">
                System
              </button>
            </div>
          </section>

          <section className="workspace-panel quotes-editor-panel">
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
