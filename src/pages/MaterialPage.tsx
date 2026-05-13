import { useMemo, useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";
import {
  type PrintPilotMaterial,
  type PrintPilotMaterialStatus,
  groupPrintPilotMaterialsByStatus,
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
import { DataTable, TableToolbar } from "../ui/Table";
import { WorkspaceHeader } from "../ui/WorkspaceHeader";

const materialTabs = ["Auf Lager", "Knapp", "Bestellen", "Archiv"] as const;

type MaterialTab = PrintPilotMaterialStatus;

function getMaterialTitle(tab: MaterialTab) {
  switch (tab) {
    case "Auf Lager":
      return "Materialbestand bearbeiten";

    case "Knapp":
      return "Knappe Materialien prüfen";

    case "Bestellen":
      return "Materialbestellung vorbereiten";

    case "Archiv":
      return "Archiviertes Material prüfen";
  }
}

function isMaterialTab(tab: string): tab is MaterialTab {
  return materialTabs.includes(tab as MaterialTab);
}

export function MaterialPage() {
  const module = getModuleConfig("material");
  const { materials, updateMaterial } = usePrintPilotStore();

  const [isEditing, setIsEditing] = useState(false);

  const materialRowsByTab = useMemo(() => {
    return groupPrintPilotMaterialsByStatus(materials);
  }, [materials]);

  const {
    activeTab,
    rows: materialRows,
    selectedItem: selectedMaterial,
    setActiveTab,
    selectItem,
  } = useMasterDetailSelection({
    rowsByTab: materialRowsByTab,
    initialTab: "Auf Lager",
  });

  const { draft, isDirty, updateDraftField, resetDraft, saveDraft } =
    useEditableDraft(selectedMaterial);

  const canEdit = isEditing && Boolean(draft);

  function handleTabChange(tab: string) {
    if (isMaterialTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
    }
  }

  function handleMaterialSelect(materialId: string) {
    selectItem(materialId);
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

    const savedMaterial = draft as PrintPilotMaterial;

    updateMaterial(savedMaterial);
    saveDraft(savedMaterial);
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
        tabs={[...materialTabs]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="Materialverwaltung"
          title={getMaterialTitle(activeTab)}
          statusValue={isEditing ? "Bearbeitung offen" : activeTab}
        />

        <div className="master-detail-layout">
          <section className="workspace-panel master-list-panel">
            <TableToolbar>
              <Input className="search-input" placeholder="Material suchen..." />

              <Button>Filter</Button>
            </TableToolbar>

            <DataTable>
              <thead>
                <tr>
                  <th>Materialnr.</th>
                  <th>Name</th>
                  <th>Format</th>
                  <th>Bestand</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {materialRows.map((material) => {
                  const isSelected = material.id === selectedMaterial?.id;

                  return (
                    <tr
                      key={material.id}
                      className={
                        isSelected ? "data-table-row-selected" : undefined
                      }
                      onClick={() => handleMaterialSelect(material.id)}
                    >
                      <td>{material.number}</td>
                      <td>{material.name}</td>
                      <td>{material.format}</td>
                      <td>{material.stock}</td>
                      <td>
                        <Badge variant={getPrintPilotStatusBadgeVariant(material.status)}>
                          {material.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel master-editor-panel">
            <SectionHeader>Materialdaten</SectionHeader>

            <FieldGrid>
              <Field label="Materialnummer">
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

              <Field label="Materialtyp">
                <Select
                  value={draft?.type ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField("type", event.target.value)
                  }
                >
                  <option>Bilderdruck matt</option>
                  <option>Bilderdruck glänzend</option>
                  <option>Offset</option>
                  <option>Naturpapier</option>
                  <option>Karton</option>
                  <option>Folie</option>
                </Select>
              </Field>

              <Field label="Format">
                <Input
                  value={draft?.format ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("format", event.target.value)
                  }
                />
              </Field>

              <Field label="Laufrichtung">
                <Select
                  value={draft?.grain ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField("grain", event.target.value)
                  }
                >
                  <option>Breitbahn</option>
                  <option>Schmalbahn</option>
                  <option>Unbekannt</option>
                </Select>
              </Field>

              <Field label="Status">
                <Select
                  value={draft?.status ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField(
                      "status",
                      event.target.value as PrintPilotMaterialStatus,
                    )
                  }
                >
                  {materialTabs.map((tab) => (
                    <option key={tab}>{tab}</option>
                  ))}
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Bestand & Preise</SectionHeader>

            <FieldGrid>
              <Field label="Preis pro Ries">
                <Input
                  value={draft?.pricePerReam ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("pricePerReam", event.target.value)
                  }
                />
              </Field>

              <Field label="Bogen pro Ries">
                <Input
                  value={draft?.sheetsPerReam ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("sheetsPerReam", event.target.value)
                  }
                />
              </Field>

              <Field label="Bestand">
                <Input
                  value={draft?.stock ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("stock", event.target.value)
                  }
                />
              </Field>

              <Field label="Mindestbestand">
                <Input
                  value={draft?.minimumStock ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("minimumStock", event.target.value)
                  }
                />
              </Field>

              <Field label="Lagerort">
                <Input
                  value={draft?.storageLocation ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("storageLocation", event.target.value)
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
                defaultLabel="Material speichern"
                onClick={handleSaveDraft}
              />
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
