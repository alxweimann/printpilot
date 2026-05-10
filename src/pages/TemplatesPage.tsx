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
import { WorkspaceHeader } from "../ui/WorkspaceHeader";

const templateTabs = ["Produkte", "Dokumente", "Textbausteine", "Layouts", "Entwurf"] as const;

type TemplateTab = (typeof templateTabs)[number];

type TemplateRow = {
  id: string;
  name: string;
  type: string;
  area: string;
  status: string;
  isDefault: string;
  productType: string;
  outputLayout: string;
  badgeVariant?: "success";
};

const templateRowsByTab: Record<TemplateTab, TemplateRow[]> = {
  Produkte: [
    {
      id: "template-broschuere-a4-standard",
      name: "Broschüre A4 Standard",
      type: "Produkt",
      area: "Kalkulation",
      status: "Aktiv",
      isDefault: "Ja",
      productType: "Broschüre",
      outputLayout: "Standard",
      badgeVariant: "success",
    },
    {
      id: "template-flyer-a5-standard",
      name: "Flyer A5 Standard",
      type: "Produkt",
      area: "Kalkulation",
      status: "Aktiv",
      isDefault: "Nein",
      productType: "Flyer",
      outputLayout: "Kurzform",
      badgeVariant: undefined,
    },
  ],
  Dokumente: [
    {
      id: "template-standardangebot",
      name: "Standardangebot",
      type: "Dokument",
      area: "Angebote",
      status: "Aktiv",
      isDefault: "Ja",
      productType: "Freies Produkt",
      outputLayout: "Standard",
      badgeVariant: "success",
    },
    {
      id: "template-rechnung-standard",
      name: "Rechnung Standard",
      type: "Dokument",
      area: "Rechnungen",
      status: "Aktiv",
      isDefault: "Ja",
      productType: "Freies Produkt",
      outputLayout: "Standard",
      badgeVariant: undefined,
    },
  ],
  Textbausteine: [
    {
      id: "template-zahlungsbedingungen-standard",
      name: "Zahlungsbedingungen Standard",
      type: "Textbaustein",
      area: "Angebote",
      status: "Aktiv",
      isDefault: "Ja",
      productType: "Freies Produkt",
      outputLayout: "Standard",
      badgeVariant: "success",
    },
    {
      id: "template-lieferhinweis-standard",
      name: "Lieferhinweis Standard",
      type: "Textbaustein",
      area: "Lieferscheine",
      status: "Aktiv",
      isDefault: "Nein",
      productType: "Freies Produkt",
      outputLayout: "Kurzform",
      badgeVariant: undefined,
    },
  ],
  Layouts: [
    {
      id: "template-dokumentlayout-standard",
      name: "Dokumentlayout Standard",
      type: "Layout",
      area: "Dokumente",
      status: "Aktiv",
      isDefault: "Ja",
      productType: "Freies Produkt",
      outputLayout: "Standard",
      badgeVariant: "success",
    },
  ],
  Entwurf: [
    {
      id: "template-rechnung-modern",
      name: "Rechnung Modern",
      type: "Dokument",
      area: "Rechnungen",
      status: "Entwurf",
      isDefault: "Nein",
      productType: "Freies Produkt",
      outputLayout: "Standard",
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

function isTemplateTab(tab: string): tab is TemplateTab {
  return templateTabs.includes(tab as TemplateTab);
}

export function TemplatesPage() {
  const module = getModuleConfig("templates");

  const [isEditing, setIsEditing] = useState(false);

  const {
    activeTab,
    rows: templateRows,
    selectedItem: selectedTemplate,
    setActiveTab,
    selectItem,
  } = useMasterDetailSelection({
    rowsByTab: templateRowsByTab,
    initialTab: "Produkte",
  });

  const { draft, isDirty, updateDraftField, resetDraft } =
    useEditableDraft(selectedTemplate);

  function handleTabChange(tab: string) {
    if (isTemplateTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
    }
  }

  function handleTemplateSelect(templateId: string) {
    selectItem(templateId);
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
                {templateRows.map((template) => {
                  const isSelected = template.id === selectedTemplate?.id;

                  return (
                    <tr
                      key={template.id}
                      className={
                        isSelected ? "data-table-row-selected" : undefined
                      }
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <td>{template.name}</td>
                      <td>{template.type}</td>
                      <td>{template.area}</td>
                      <td>
                        <Badge variant={template.badgeVariant}>
                          {template.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel master-editor-panel">
            <SectionHeader>Vorlagendaten</SectionHeader>

            <FieldGrid>
              <Field label="Vorlage">
                <Input
                  value={draft?.name ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("name", event.target.value)
                  }
                />
              </Field>

              <Field label="Typ">
                <Select
                  value={draft?.type ?? ""}
                  onChange={(event) =>
                    updateDraftField("type", event.target.value)
                  }
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
                <Select
                  value={draft?.area ?? ""}
                  onChange={(event) =>
                    updateDraftField("area", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Bereich wählen
                  </option>
                  <option>Kalkulation</option>
                  <option>Angebote</option>
                  <option>Aufträge</option>
                  <option>Rechnungen</option>
                  <option>Lieferscheine</option>
                  <option>Dokumente</option>
                </Select>
              </Field>

              <Field label="Status">
                <Select
                  value={draft?.status ?? ""}
                  disabled={!isEditing}
                  onChange={(event) =>
                    updateDraftField("status", event.target.value)
                  }
                >
                  <option>Aktiv</option>
                  <option>Entwurf</option>
                </Select>
              </Field>

              <Field label="Standard">
                <Select
                  value={draft?.isDefault ?? ""}
                  disabled={!isEditing}
                  onChange={(event) =>
                    updateDraftField("isDefault", event.target.value)
                  }
                >
                  <option>Nein</option>
                  <option>Ja</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Produktparameter</SectionHeader>

            <FieldGrid>
              <Field label="Produktart">
                <Select
                  value={draft?.productType ?? ""}
                  onChange={(event) =>
                    updateDraftField("productType", event.target.value)
                  }
                >
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

              <Field label="Ausgabe">
                <Select
                  value={draft?.outputLayout ?? ""}
                  onChange={(event) =>
                    updateDraftField("outputLayout", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Layout wählen
                  </option>
                  <option>Standard</option>
                  <option>Kurzform</option>
                  <option>Technisch</option>
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
              <SaveActionButton

                              isDirty={isDirty}

                              defaultLabel="Vorlage speichern"

                            />
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
