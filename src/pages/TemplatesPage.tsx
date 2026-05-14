import { useMemo, useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";
import {
  type PrintPilotTemplate,
  type PrintPilotTemplateStatus,
  groupPrintPilotTemplatesByStatus,
} from "../data/printPilotStore";
import { useEditableDraft } from "../hooks/useEditableDraft";
import { useMasterDetailSelection } from "../hooks/useMasterDetailSelection";
import { usePrintPilotStore } from "../store/PrintPilotStore";
import { getPrintPilotStatusBadgeVariant } from "../data/statusBadges";

import { PageHeader } from "../layout/PageHeader";
import { PageTabs } from "../layout/PageTabs";

import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { DirtyStateNotice } from "../ui/DirtyStateNotice";
import { EditLockToggle } from "../ui/EditLockToggle";
import { Field } from "../ui/Field";
import { FieldGrid } from "../ui/FieldGrid";
import { Input } from "../ui/Input";
import { SaveActionButton } from "../ui/SaveActionButton";
import { SectionHeader } from "../ui/SectionHeader";
import { Select } from "../ui/Select";
import { SortableTableHeader } from "../ui/SortableTableHeader";
import { DataTable, TableToolbar } from "../ui/Table";
import { useSortableTable } from "../ui/useSortableTable";
import { WorkspaceHeader } from "../ui/WorkspaceHeader";

const templateTabs = ["Aktiv", "Entwurf", "Archiv"] as const;

type TemplateTab = PrintPilotTemplateStatus;

function getTemplateTitle(tab: TemplateTab) {
  switch (tab) {
    case "Aktiv":
      return "Aktive Vorlage bearbeiten";

    case "Entwurf":
      return "Vorlagenentwurf bearbeiten";

    case "Archiv":
      return "Archivierte Vorlage prüfen";
  }
}

function isTemplateTab(tab: string): tab is TemplateTab {
  return templateTabs.includes(tab as TemplateTab);
}


type TemplateSortKey = "number" | "name" | "type" | "area" | "isDefault" | "status";

function getTemplateSortValue(
  template: PrintPilotTemplate,
  sortKey: TemplateSortKey,
) {
  switch (sortKey) {
    case "number":
      return template.number;
    case "name":
      return template.name;
    case "type":
      return template.type;
    case "area":
      return template.area;
    case "isDefault":
      return template.isDefault;
    case "status":
      return template.status;
  }
}

export function TemplatesPage() {
  const module = getModuleConfig("templates");
  const { templates, updateTemplate } = usePrintPilotStore();

  const [isEditing, setIsEditing] = useState(false);

  const templateRowsByTab = useMemo(() => {
    return groupPrintPilotTemplatesByStatus(templates);
  }, [templates]);

  const {
    activeTab,
    rows: templateRows,
    selectedItem: selectedTemplate,
    setActiveTab,
    selectItem,
  } = useMasterDetailSelection({
    rowsByTab: templateRowsByTab,
    initialTab: "Aktiv" as TemplateTab,
  });

  const {
    sortedRows: sortedTemplateRows,
    sortConfig: templateSortConfig,
    requestSort: requestTemplateSort,
    getAriaSort: getTemplateAriaSort,
  } = useSortableTable<PrintPilotTemplate, TemplateSortKey>({
    rows: templateRows,
    initialSortKey: "number",
    getSortValue: getTemplateSortValue,
  });

  const { draft, isDirty, updateDraftField, resetDraft, saveDraft } =
    useEditableDraft(selectedTemplate);

  const canEdit = isEditing && Boolean(draft);

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

  function handleSaveDraft() {
    if (!draft) {
      return;
    }

    const savedTemplate = draft as PrintPilotTemplate;

    updateTemplate(savedTemplate);
    saveDraft(savedTemplate);
    setIsEditing(false);
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
          kicker="Vorlagen"
          title={getTemplateTitle(activeTab)}
          statusValue={isEditing ? "Bearbeitung offen" : activeTab}
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
                  <th aria-sort={getTemplateAriaSort("number")}>
                    <SortableTableHeader
                      label="Vorlagennr."
                      active={ templateSortConfig?.key === "number" }
                      direction={ templateSortConfig?.direction }
                      onClick={() => requestTemplateSort("number")}
                    />
                  </th>
                  <th aria-sort={getTemplateAriaSort("name")}>
                    <SortableTableHeader
                      label="Name"
                      active={ templateSortConfig?.key === "name" }
                      direction={ templateSortConfig?.direction }
                      onClick={() => requestTemplateSort("name")}
                    />
                  </th>
                  <th aria-sort={getTemplateAriaSort("type")}>
                    <SortableTableHeader
                      label="Typ"
                      active={ templateSortConfig?.key === "type" }
                      direction={ templateSortConfig?.direction }
                      onClick={() => requestTemplateSort("type")}
                    />
                  </th>
                  <th aria-sort={getTemplateAriaSort("area")}>
                    <SortableTableHeader
                      label="Bereich"
                      active={ templateSortConfig?.key === "area" }
                      direction={ templateSortConfig?.direction }
                      onClick={() => requestTemplateSort("area")}
                    />
                  </th>
                  <th aria-sort={getTemplateAriaSort("isDefault")}>
                    <SortableTableHeader
                      label="Standard"
                      active={ templateSortConfig?.key === "isDefault" }
                      direction={ templateSortConfig?.direction }
                      onClick={() => requestTemplateSort("isDefault")}
                    />
                  </th>
                  <th aria-sort={getTemplateAriaSort("status")}>
                    <SortableTableHeader
                      label="Status"
                      active={ templateSortConfig?.key === "status" }
                      direction={ templateSortConfig?.direction }
                      onClick={() => requestTemplateSort("status")}
                    />
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedTemplateRows.map((template) => {
                  const isSelected = template.id === selectedTemplate?.id;

                  return (
                    <tr
                      key={template.id}
                      className={
                        isSelected ? "data-table-row-selected" : undefined
                      }
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <td style={{ whiteSpace: "nowrap" }}>{template.number}</td>
                      <td>{template.name}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{template.type}</td>
                      <td>{template.area}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{template.isDefault}</td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <Badge variant={getPrintPilotStatusBadgeVariant(template.status)}>
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
              <Field label="Vorlagennummer">
                <Input value={draft?.number ?? ""} readOnly />
              </Field>

              <Field label="Name">
                <Input
                  value={draft?.name ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("name", event.target.value)
                  }
                />
              </Field>

              <Field label="Typ">
                <Select
                  value={draft?.type ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField("type", event.target.value)
                  }
                >
                  <option>Angebot</option>
                  <option>Auftrag</option>
                  <option>Lieferschein</option>
                  <option>Rechnung</option>
                  <option>Kalkulation</option>
                </Select>
              </Field>

              <Field label="Bereich">
                <Select
                  value={draft?.area ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField("area", event.target.value)
                  }
                >
                  <option>Verkauf</option>
                  <option>Produktion</option>
                  <option>Ausgabe</option>
                  <option>Faktura</option>
                  <option>Archiv</option>
                </Select>
              </Field>

              <Field label="Status">
                <Select
                  value={draft?.status ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField(
                      "status",
                      event.target.value as PrintPilotTemplateStatus,
                    )
                  }
                >
                  {templateTabs.map((tab) => (
                    <option key={tab}>{tab}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Standardvorlage">
                <Select
                  value={draft?.isDefault ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField("isDefault", event.target.value)
                  }
                >
                  <option>Ja</option>
                  <option>Nein</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Ausgabe</SectionHeader>

            <FieldGrid>
              <Field label="Produkttyp">
                <Input
                  value={draft?.productType ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("productType", event.target.value)
                  }
                />
              </Field>

              <Field label="Layout">
                <Input
                  value={draft?.outputLayout ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("outputLayout", event.target.value)
                  }
                />
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
                onClick={handleSaveDraft}
              />
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
