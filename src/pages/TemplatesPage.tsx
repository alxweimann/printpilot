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
import { DetailDrawer } from "../ui/DetailDrawer";
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
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

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
      setIsDetailDrawerOpen(false);
    }
  }

  function handleTemplateSelect(templateId: string) {
    selectItem(templateId);
    setIsEditing(false);
    setIsDetailDrawerOpen(true);
  }

  function handleCloseDetailDrawer() {
    setIsEditing(false);
    setIsDetailDrawerOpen(false);
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
    setIsDetailDrawerOpen(false);
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

        <section className="workspace-panel master-list-panel">
          <TableToolbar>
            <Input className="search-input" placeholder="Vorlagen suchen..." />
            <Button>Filter</Button>
          </TableToolbar>

          <DataTable tableClassName="entity-data-table templates-data-table">

            <colgroup>
              <col className="templates-table-col-number" />
              <col className="templates-table-col-name" />
              <col className="templates-table-col-type" />
              <col className="templates-table-col-area" />
              <col className="templates-table-col-default" />
              <col className="templates-table-col-status" />
            </colgroup>

            <thead>
              <tr>
                <SortableTableHeader
                  label="Vorlagennr."
                  sortKey="number"
                  sortConfig={templateSortConfig}
                  onSort={requestTemplateSort}
                />
                <SortableTableHeader
                  label="Name"
                  sortKey="name"
                  sortConfig={templateSortConfig}
                  onSort={requestTemplateSort}
                />
                <SortableTableHeader
                  label="Typ"
                  sortKey="type"
                  sortConfig={templateSortConfig}
                  onSort={requestTemplateSort}
                />
                <SortableTableHeader
                  label="Bereich"
                  sortKey="area"
                  sortConfig={templateSortConfig}
                  onSort={requestTemplateSort}
                />
                <SortableTableHeader
                  label="Standard"
                  sortKey="isDefault"
                  sortConfig={templateSortConfig}
                  onSort={requestTemplateSort}
                />
                <SortableTableHeader
                  label="Status"
                  sortKey="status"
                  sortConfig={templateSortConfig}
                  onSort={requestTemplateSort}
                />
              </tr>
            </thead>

            <tbody>
              {sortedTemplateRows.map((template) => {
                const isSelected = template.id === selectedTemplate?.id;

                return (
                  <tr
                    key={template.id}
                    className={isSelected ? "data-table-row-selected" : undefined}
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
      </section>

      <DetailDrawer
        accentColor={module.accentColor}
        open={isDetailDrawerOpen && Boolean(selectedTemplate)}
        eyebrow="Vorlage"
        title={selectedTemplate?.name ?? "Vorlage"}
        subtitle={
          selectedTemplate
            ? `${selectedTemplate.number} · ${selectedTemplate.type}`
            : undefined
        }
        onClose={handleCloseDetailDrawer}
        size="xl"
        footer={
          <>
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
          </>
        }
      >
        <div className="detail-drawer-stack">
          <section className="detail-drawer-panel">
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
          </section>

          <section className="detail-drawer-panel">
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
          </section>
        </div>
      </DetailDrawer>
    </div>
  );
}
