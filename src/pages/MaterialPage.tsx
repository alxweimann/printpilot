import { useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";

import { useEditableDraft } from "../hooks/useEditableDraft";
import { useMasterDetailSelection } from "../hooks/useMasterDetailSelection";

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

const materialTabs = [
  "Liste",
  "Papier",
  "Verpackung",
  "Verbrauchsmaterial",
  "Gesperrt",
] as const;

type MaterialTab = (typeof materialTabs)[number];

type MaterialRow = {
  id: string;
  name: string;
  type: string;
  format: string;
  grain: string;
  pricePerReam: string;
  sheetsPerReam: string;
  stock: string;
  minimumStock: string;
  storageLocation: string;
  status: string;
  badgeVariant?: "success";
};

const materialRowsByTab: Record<MaterialTab, MaterialRow[]> = {
  Liste: [
    {
      id: "material-135-bilderdruck-matt",
      name: "135 g/m² Bilderdruck matt",
      type: "Papier",
      format: "SRA3",
      grain: "Schmalbahn",
      pricePerReam: "42,50 €",
      sheetsPerReam: "500",
      stock: "18",
      minimumStock: "5",
      storageLocation: "Papierlager",
      status: "Aktiv",
      badgeVariant: "success",
    },
    {
      id: "material-300-bilderdruck-matt",
      name: "300 g/m² Bilderdruck matt",
      type: "Papier",
      format: "SRA3",
      grain: "Breitbahn",
      pricePerReam: "86,00 €",
      sheetsPerReam: "500",
      stock: "8",
      minimumStock: "4",
      storageLocation: "Papierlager",
      status: "Aktiv",
      badgeVariant: undefined,
    },
    {
      id: "material-versandkarton-a4",
      name: "Versandkarton A4",
      type: "Verpackung",
      format: "A4",
      grain: "Keine Angabe",
      pricePerReam: "0,38 €",
      sheetsPerReam: "1",
      stock: "250",
      minimumStock: "50",
      storageLocation: "Versand",
      status: "Entwurf",
      badgeVariant: undefined,
    },
  ],
  Papier: [
    {
      id: "material-135-bilderdruck-matt",
      name: "135 g/m² Bilderdruck matt",
      type: "Papier",
      format: "SRA3",
      grain: "Schmalbahn",
      pricePerReam: "42,50 €",
      sheetsPerReam: "500",
      stock: "18",
      minimumStock: "5",
      storageLocation: "Papierlager",
      status: "Aktiv",
      badgeVariant: "success",
    },
    {
      id: "material-300-bilderdruck-matt",
      name: "300 g/m² Bilderdruck matt",
      type: "Papier",
      format: "SRA3",
      grain: "Breitbahn",
      pricePerReam: "86,00 €",
      sheetsPerReam: "500",
      stock: "8",
      minimumStock: "4",
      storageLocation: "Papierlager",
      status: "Aktiv",
      badgeVariant: undefined,
    },
  ],
  Verpackung: [
    {
      id: "material-versandkarton-a4",
      name: "Versandkarton A4",
      type: "Verpackung",
      format: "A4",
      grain: "Keine Angabe",
      pricePerReam: "0,38 €",
      sheetsPerReam: "1",
      stock: "250",
      minimumStock: "50",
      storageLocation: "Versand",
      status: "Entwurf",
      badgeVariant: undefined,
    },
  ],
  Verbrauchsmaterial: [
    {
      id: "material-toner-klickkosten-reserve",
      name: "Toner / Klickkosten Reserve",
      type: "Verbrauchsmaterial",
      format: "—",
      grain: "Keine Angabe",
      pricePerReam: "0,00 €",
      sheetsPerReam: "1",
      stock: "1",
      minimumStock: "1",
      storageLocation: "Maschinenraum",
      status: "Aktiv",
      badgeVariant: undefined,
    },
  ],
  Gesperrt: [
    {
      id: "material-altes-sonderpapier",
      name: "Altes Sonderpapier",
      type: "Papier",
      format: "A3",
      grain: "Keine Angabe",
      pricePerReam: "0,00 €",
      sheetsPerReam: "500",
      stock: "2",
      minimumStock: "0",
      storageLocation: "Altbestand",
      status: "Gesperrt",
      badgeVariant: undefined,
    },
  ],
};

function getMaterialTitle(tab: MaterialTab) {
  switch (tab) {
    case "Liste":
      return "Material verwalten";
    case "Papier":
      return "Papiermaterial verwalten";
    case "Verpackung":
      return "Verpackung verwalten";
    case "Verbrauchsmaterial":
      return "Verbrauchsmaterial verwalten";
    case "Gesperrt":
      return "Gesperrtes Material prüfen";
  }
}

function getMaterialStatus(tab: MaterialTab) {
  if (tab === "Gesperrt") {
    return "Gesperrt";
  }

  return "Aktiv";
}

function isMaterialTab(tab: string): tab is MaterialTab {
  return materialTabs.includes(tab as MaterialTab);
}

export function MaterialPage() {
  const module = getModuleConfig("material");

  const [isEditing, setIsEditing] = useState(false);

  const {
    activeTab,
    rows: materialRows,
    selectedItem: selectedMaterial,
    setActiveTab,
    selectItem,
  } = useMasterDetailSelection({
    rowsByTab: materialRowsByTab,
    initialTab: "Liste",
  });

  const { draft, isDirty, updateDraftField, resetDraft } =
    useEditableDraft(selectedMaterial);

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
          kicker="Materialmaske"
          title={getMaterialTitle(activeTab)}
          statusValue={getMaterialStatus(activeTab)}
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
                  <th>Material</th>
                  <th>Typ</th>
                  <th>Format</th>
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
                      <td>{material.name}</td>
                      <td>{material.type}</td>
                      <td>{material.format}</td>
                      <td>
                        <Badge variant={material.badgeVariant}>
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
              <Field label="Materialname">
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
                  <option>Papier</option>
                  <option>Verpackung</option>
                  <option>Verbrauchsmaterial</option>
                </Select>
              </Field>

              <Field label="Format">
                <Select
                  value={draft?.format ?? ""}
                  onChange={(event) =>
                    updateDraftField("format", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Format wählen
                  </option>
                  <option>SRA3</option>
                  <option>A3</option>
                  <option>A4</option>
                  <option>Freies Format</option>
                  <option>—</option>
                </Select>
              </Field>

              <Field label="Laufrichtung">
                <Select
                  value={draft?.grain ?? ""}
                  onChange={(event) =>
                    updateDraftField("grain", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Laufrichtung wählen
                  </option>
                  <option>Schmalbahn</option>
                  <option>Breitbahn</option>
                  <option>Keine Angabe</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Preise</SectionHeader>

            <FieldGrid>
              <Field label="Preis je Ries">
                <Input
                  value={draft?.pricePerReam ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("pricePerReam", event.target.value)
                  }
                />
              </Field>

              <Field label="Bogen je Ries">
                <Input
                  inputMode="numeric"
                  value={draft?.sheetsPerReam ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("sheetsPerReam", event.target.value)
                  }
                />
              </Field>

              <Field label="Lagerbestand">
                <Input
                  inputMode="numeric"
                  value={draft?.stock ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("stock", event.target.value)
                  }
                />
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
                  <option>Gesperrt</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Lager</SectionHeader>

            <FieldGrid>
              <Field label="Mindestbestand">
                <Input
                  inputMode="numeric"
                  value={draft?.minimumStock ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("minimumStock", event.target.value)
                  }
                />
              </Field>

              <Field label="Lagerort">
                <Input
                  value={draft?.storageLocation ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("storageLocation", event.target.value)
                  }
                />
              </Field>
            </FieldGrid>

            <div className="calculation-footer">
              {isDirty && (
                <span
                  style={{
                    alignSelf: "center",
                    color: "var(--color-text-muted)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    marginRight: "auto",
                  }}
                >
                  Ungespeicherte Änderungen
                </span>
              )}

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
              <Button variant="primary">
                {isDirty ? "Änderungen speichern" : "Material speichern"}
              </Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
