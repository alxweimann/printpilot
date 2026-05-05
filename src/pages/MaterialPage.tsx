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

const materialTabs = [
  "Liste",
  "Papier",
  "Verpackung",
  "Verbrauchsmaterial",
  "Gesperrt",
] as const;

type MaterialTab = (typeof materialTabs)[number];

const materialRowsByTab = {
  Liste: [
    {
      id: "material-135-bilderdruck-matt",
      name: "135 g/m² Bilderdruck matt",
      type: "Papier",
      format: "SRA3",
      status: "Aktiv",
      badgeVariant: "success" as const,
    },
    {
      id: "material-300-bilderdruck-matt",
      name: "300 g/m² Bilderdruck matt",
      type: "Papier",
      format: "SRA3",
      status: "Aktiv",
      badgeVariant: undefined,
    },
    {
      id: "material-versandkarton-a4",
      name: "Versandkarton A4",
      type: "Verpackung",
      format: "A4",
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
      status: "Aktiv",
      badgeVariant: "success" as const,
    },
    {
      id: "material-300-bilderdruck-matt",
      name: "300 g/m² Bilderdruck matt",
      type: "Papier",
      format: "SRA3",
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

function getMaterialType(tab: MaterialTab) {
  if (tab === "Liste" || tab === "Gesperrt") {
    return "";
  }

  return tab;
}

function isMaterialTab(tab: string): tab is MaterialTab {
  return materialTabs.includes(tab as MaterialTab);
}

export function MaterialPage() {
  const module = getModuleConfig("material");

  const [activeTab, setActiveTab] = useState<MaterialTab>("Liste");
  const [selectedId, setSelectedId] = useState(
    materialRowsByTab.Liste[0]?.id ?? "",
  );

  const materialRows = materialRowsByTab[activeTab];
  const selectedMaterial =
    materialRows.find((material) => material.id === selectedId) ??
    materialRows[0];

  function handleTabChange(tab: string) {
    if (isMaterialTab(tab)) {
      const nextRows = materialRowsByTab[tab];

      setActiveTab(tab);
      setSelectedId(nextRows[0]?.id ?? "");
    }
  }

  function handleMaterialSelect(materialId: string) {
    setSelectedId(materialId);
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
                <Input value={selectedMaterial?.name ?? ""} readOnly />
              </Field>

              <Field label="Typ">
                <Select
                  value={getMaterialType(activeTab) || selectedMaterial?.type || ""}
                  onChange={(event) => handleTabChange(event.target.value)}
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
                <Select defaultValue={selectedMaterial?.format ?? ""}>
                  <option value="" disabled>
                    Format wählen
                  </option>
                  <option>SRA3</option>
                  <option>A3</option>
                  <option>A4</option>
                  <option>Freies Format</option>
                </Select>
              </Field>

              <Field label="Laufrichtung">
                <Select defaultValue="">
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
                <Input placeholder="0,00 €" />
              </Field>

              <Field label="Bogen je Ries">
                <Input inputMode="numeric" placeholder="500" />
              </Field>

              <Field label="Lagerbestand">
                <Input inputMode="numeric" placeholder="0" />
              </Field>

              <Field label="Status">
                <Select
                  value={selectedMaterial?.status ?? "Aktiv"}
                  onChange={(event) => {
                    if (event.target.value === "Gesperrt") {
                      handleTabChange("Gesperrt");
                    }
                  }}
                >
                  <option>Aktiv</option>
                  <option>Gesperrt</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Lager</SectionHeader>

            <FieldGrid>
              <Field label="Mindestbestand">
                <Input inputMode="numeric" placeholder="0" />
              </Field>

              <Field label="Lagerort">
                <Input placeholder="z. B. Papierlager" />
              </Field>
            </FieldGrid>

            <div className="calculation-footer">
              <Button>Änderungen verwerfen</Button>
              <Button variant="primary">Material speichern</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
