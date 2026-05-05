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

const templateTabs = ["Produkte", "Dokumente", "Textbausteine", "Layouts", "Entwurf"] as const;

type TemplateTab = (typeof templateTabs)[number];

const templateRowsByTab = {
  Produkte: [
    {
      name: "Broschüre A4 Standard",
      type: "Produkt",
      area: "Kalkulation",
      status: "Aktiv",
      badgeVariant: "success" as const,
    },
    {
      name: "Flyer A5 Standard",
      type: "Produkt",
      area: "Kalkulation",
      status: "Aktiv",
      badgeVariant: undefined,
    },
  ],
  Dokumente: [
    {
      name: "Standardangebot",
      type: "Dokument",
      area: "Angebote",
      status: "Aktiv",
      badgeVariant: "success" as const,
    },
    {
      name: "Rechnung Standard",
      type: "Dokument",
      area: "Rechnungen",
      status: "Aktiv",
      badgeVariant: undefined,
    },
  ],
  Textbausteine: [
    {
      name: "Zahlungsbedingungen Standard",
      type: "Textbaustein",
      area: "Angebote",
      status: "Aktiv",
      badgeVariant: "success" as const,
    },
    {
      name: "Lieferhinweis Standard",
      type: "Textbaustein",
      area: "Lieferscheine",
      status: "Aktiv",
      badgeVariant: undefined,
    },
  ],
  Layouts: [
    {
      name: "Dokumentlayout Standard",
      type: "Layout",
      area: "Dokumente",
      status: "Aktiv",
      badgeVariant: "success" as const,
    },
  ],
  Entwurf: [
    {
      name: "Rechnung Modern",
      type: "Dokument",
      area: "Rechnungen",
      status: "Entwurf",
      badgeVariant: undefined,
    },
  ],
};

function getTemplateTitle(tab: TemplateTab) {
  switch (tab) {
    case "Produkte":
      return "Produktvorlage verwalten";
    case "Dokumente":
      return "Dokumentvorlage verwalten";
    case "Textbausteine":
      return "Textbaustein verwalten";
    case "Layouts":
      return "Layoutvorlage verwalten";
    case "Entwurf":
      return "Vorlagenentwurf bearbeiten";
  }
}

function getTemplateStatus(tab: TemplateTab) {
  if (tab === "Entwurf") {
    return "Entwurf";
  }

  return "Aktiv";
}

function getTemplateType(tab: TemplateTab) {
  switch (tab) {
    case "Produkte":
      return "Produkt";
    case "Dokumente":
      return "Dokument";
    case "Textbausteine":
      return "Textbaustein";
    case "Layouts":
      return "Layout";
    case "Entwurf":
      return "";
  }
}

function isTemplateTab(tab: string): tab is TemplateTab {
  return templateTabs.includes(tab as TemplateTab);
}

export function TemplatesPage() {
  const module = getModuleConfig("templates");
  const [activeTab, setActiveTab] = useState<TemplateTab>("Produkte");
  const templateRows = templateRowsByTab[activeTab];

  function handleTabChange(tab: string) {
    if (isTemplateTab(tab)) {
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
        tabs={[...templateTabs]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="Vorlagenmaske"
          title={getTemplateTitle(activeTab)}
          statusValue={getTemplateStatus(activeTab)}
        />

        <div className="master-detail-layout">
          <section className="workspace-panel master-list-panel">
            <TableToolbar>
              <Input className="search-input" placeholder="Vorlagen suchen..." />
              <Button>Filter</Button>
            </TableToolbar>

            <DataTable>
              <thead>
                <tr>
                  <th>Vorlage</th>
                  <th>Typ</th>
                  <th>Bereich</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {templateRows.map((template) => (
                  <tr key={template.name}>
                    <td>{template.name}</td>
                    <td>{template.type}</td>
                    <td>{template.area}</td>
                    <td>
                      <Badge variant={template.badgeVariant}>{template.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel master-editor-panel">
            <SectionHeader>Vorlagendaten</SectionHeader>

            <FieldGrid>
              <Field label="Vorlagennummer">
                <Input placeholder="wird später automatisch vergeben" disabled />
              </Field>

              <Field label="Bezeichnung">
                <Input placeholder="z. B. Broschüre A4 Standard" />
              </Field>

              <Field label="Vorlagentyp">
                <Select
                  value={getTemplateType(activeTab)}
                  onChange={(event) => {
                    const value = event.target.value;

                    if (value === "Produkt") {
                      handleTabChange("Produkte");
                    }

                    if (value === "Dokument") {
                      handleTabChange("Dokumente");
                    }

                    if (value === "Textbaustein") {
                      handleTabChange("Textbausteine");
                    }

                    if (value === "Layout") {
                      handleTabChange("Layouts");
                    }
                  }}
                >
                  <option value="" disabled>
                    Typ wählen
                  </option>
                  <option>Produkt</option>
                  <option>Dokument</option>
                  <option>Textbaustein</option>
                  <option>Layout</option>
                </Select>
              </Field>

              <Field label="Bereich">
                <Select defaultValue="">
                  <option value="" disabled>
                    Bereich wählen
                  </option>
                  <option>Kalkulation</option>
                  <option>Angebote</option>
                  <option>Aufträge</option>
                  <option>Rechnungen</option>
                  <option>Lieferscheine</option>
                </Select>
              </Field>

              <Field label="Status">
                <Select
                  value={getTemplateStatus(activeTab)}
                  onChange={(event) => {
                    if (event.target.value === "Entwurf") {
                      handleTabChange("Entwurf");
                    }
                  }}
                >
                  <option>Aktiv</option>
                  <option>Entwurf</option>
                </Select>
              </Field>

              <Field label="Standard">
                <Select defaultValue="Nein">
                  <option>Nein</option>
                  <option>Ja</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Produktparameter</SectionHeader>

            <FieldGrid>
              <Field label="Produktart">
                <Select defaultValue="">
                  <option value="" disabled>
                    Produktart wählen
                  </option>
                  <option>Broschüre</option>
                  <option>Flyer</option>
                  <option>Folder</option>
                  <option>Plakat</option>
                  <option>Freies Produkt</option>
                </Select>
              </Field>

              <Field label="Format">
                <Input placeholder="z. B. A4" />
              </Field>

              <Field label="Standardumfang">
                <Input inputMode="numeric" placeholder="z. B. 32 Seiten" />
              </Field>

              <Field label="Papier Inhalt">
                <Input placeholder="Optional" />
              </Field>

              <Field label="Papier Umschlag">
                <Input placeholder="Optional" />
              </Field>

              <Field label="Weiterverarbeitung">
                <Input placeholder="Optional" />
              </Field>
            </FieldGrid>

            <SectionHeader>Ausgabe</SectionHeader>

            <FieldGrid>
              <Field label="Dokumentlayout">
                <Select defaultValue="">
                  <option value="" disabled>
                    Layout wählen
                  </option>
                  <option>Standard</option>
                  <option>Kurzform</option>
                  <option>Technisch</option>
                </Select>
              </Field>

              <Field label="Textbaustein">
                <Input placeholder="Optional" />
              </Field>

              <Field label="Interne Notiz">
                <Input placeholder="Optional" />
              </Field>
            </FieldGrid>

            <div className="calculation-footer">
              <Button>Änderungen verwerfen</Button>
              <Button variant="primary">Vorlage speichern</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
