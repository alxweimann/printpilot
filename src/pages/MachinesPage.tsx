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

const machineTabs = [
  "Liste",
  "Digitaldruck Farbe",
  "Digitaldruck Schwarz",
  "Großformat",
  "Wartung",
] as const;

type MachineTab = (typeof machineTabs)[number];

type MachineRow = {
  id: string;
  name: string;
  type: string;
  colorMode: string;
  status: string;
  hourlyRate: string;
  colorClickCost: string;
  blackClickCost: string;
  duplex: string;
  usage: string;
  note: string;
  badgeVariant?: "success";
};

const machineRowsByTab: Record<MachineTab, MachineRow[]> = {
  Liste: [
    {
      id: "machine-xerox-iridesse",
      name: "Xerox Iridesse",
      type: "Digitaldruck Farbe",
      colorMode: "4/4-farbig",
      status: "Aktiv",
      hourlyRate: "120,00 €",
      colorClickCost: "0,033 €",
      blackClickCost: "0,008 €",
      duplex: "Ja",
      usage: "Bevorzugt",
      note: "Standardmaschine für Farbdruck",
      badgeVariant: "success",
    },
    {
      id: "machine-xerox-nuvera",
      name: "Xerox Nuvera",
      type: "Digitaldruck Schwarz",
      colorMode: "1/1 schwarz",
      status: "Aktiv",
      hourlyRate: "95,00 €",
      colorClickCost: "0,000 €",
      blackClickCost: "0,008 €",
      duplex: "Ja",
      usage: "Standard",
      note: "Schwarzweiß-Produktion",
      badgeVariant: undefined,
    },
    {
      id: "machine-roland-truevis-vg3-540",
      name: "Roland TrueVis VG3 540",
      type: "Großformat",
      colorMode: "CMYK",
      status: "Aktiv",
      hourlyRate: "85,00 €",
      colorClickCost: "0,000 €",
      blackClickCost: "0,000 €",
      duplex: "Nein",
      usage: "Standard",
      note: "Großformatdruck",
      badgeVariant: undefined,
    },
  ],
  "Digitaldruck Farbe": [
    {
      id: "machine-xerox-iridesse",
      name: "Xerox Iridesse",
      type: "Digitaldruck Farbe",
      colorMode: "4/4-farbig",
      status: "Aktiv",
      hourlyRate: "120,00 €",
      colorClickCost: "0,033 €",
      blackClickCost: "0,008 €",
      duplex: "Ja",
      usage: "Bevorzugt",
      note: "Standardmaschine für Farbdruck",
      badgeVariant: "success",
    },
  ],
  "Digitaldruck Schwarz": [
    {
      id: "machine-xerox-nuvera",
      name: "Xerox Nuvera",
      type: "Digitaldruck Schwarz",
      colorMode: "1/1 schwarz",
      status: "Aktiv",
      hourlyRate: "95,00 €",
      colorClickCost: "0,000 €",
      blackClickCost: "0,008 €",
      duplex: "Ja",
      usage: "Standard",
      note: "Schwarzweiß-Produktion",
      badgeVariant: undefined,
    },
    {
      id: "machine-canon-vp140",
      name: "Canon VP140",
      type: "Digitaldruck Schwarz",
      colorMode: "1/1 schwarz",
      status: "Aktiv",
      hourlyRate: "95,00 €",
      colorClickCost: "0,000 €",
      blackClickCost: "0,008 €",
      duplex: "Ja",
      usage: "Standard",
      note: "Schwarzweiß-Produktion",
      badgeVariant: undefined,
    },
  ],
  Großformat: [
    {
      id: "machine-roland-truevis-vg3-540",
      name: "Roland TrueVis VG3 540",
      type: "Großformat",
      colorMode: "CMYK",
      status: "Aktiv",
      hourlyRate: "85,00 €",
      colorClickCost: "0,000 €",
      blackClickCost: "0,000 €",
      duplex: "Nein",
      usage: "Standard",
      note: "Großformatdruck",
      badgeVariant: undefined,
    },
  ],
  Wartung: [
    {
      id: "machine-xerox-iridesse-sonderfarben",
      name: "Xerox Iridesse Sonderfarben",
      type: "Digitaldruck Farbe",
      colorMode: "Sonderfarben",
      status: "Wartung",
      hourlyRate: "120,00 €",
      colorClickCost: "0,033 €",
      blackClickCost: "0,008 €",
      duplex: "Ja",
      usage: "Nur Spezialfälle",
      note: "Wartungsstatus prüfen",
      badgeVariant: undefined,
    },
  ],
};

function getMachineTitle(tab: MachineTab) {
  switch (tab) {
    case "Liste":
      return "Maschine verwalten";
    case "Digitaldruck Farbe":
      return "Farbdruckmaschine verwalten";
    case "Digitaldruck Schwarz":
      return "Schwarzweißmaschine verwalten";
    case "Großformat":
      return "Großformatmaschine verwalten";
    case "Wartung":
      return "Maschine in Wartung prüfen";
  }
}

function getMachineStatus(tab: MachineTab) {
  if (tab === "Wartung") {
    return "Wartung";
  }

  return "Aktiv";
}

function isMachineTab(tab: string): tab is MachineTab {
  return machineTabs.includes(tab as MachineTab);
}

export function MachinesPage() {
  const module = getModuleConfig("machines");

  const [isEditing, setIsEditing] = useState(false);

  const {
    activeTab,
    rows: machineRows,
    selectedItem: selectedMachine,
    setActiveTab,
    selectItem,
  } = useMasterDetailSelection({
    rowsByTab: machineRowsByTab,
    initialTab: "Liste",
  });

  const { draft, isDirty, updateDraftField, resetDraft } =
    useEditableDraft(selectedMachine);

  function handleTabChange(tab: string) {
    if (isMachineTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
    }
  }

  function handleMachineSelect(machineId: string) {
    selectItem(machineId);
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
        tabs={[...machineTabs]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="Maschinenmaske"
          title={getMachineTitle(activeTab)}
          statusValue={getMachineStatus(activeTab)}
        />

        <div className="master-detail-layout">
          <section className="workspace-panel master-list-panel">
            <TableToolbar>
              <Input className="search-input" placeholder="Maschinen suchen..." />
              <Button>Filter</Button>
            </TableToolbar>

            <DataTable>
              <thead>
                <tr>
                  <th>Maschine</th>
                  <th>Typ</th>
                  <th>Farbigkeit</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {machineRows.map((machine) => {
                  const isSelected = machine.id === selectedMachine?.id;

                  return (
                    <tr
                      key={machine.id}
                      className={
                        isSelected ? "data-table-row-selected" : undefined
                      }
                      onClick={() => handleMachineSelect(machine.id)}
                    >
                      <td>{machine.name}</td>
                      <td>{machine.type}</td>
                      <td>{machine.colorMode}</td>
                      <td>
                        <Badge variant={machine.badgeVariant}>
                          {machine.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel master-editor-panel">
            <SectionHeader>Maschinendaten</SectionHeader>

            <FieldGrid>
              <Field label="Maschine">
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
                  <option>Digitaldruck Farbe</option>
                  <option>Digitaldruck Schwarz</option>
                  <option>Großformat</option>
                </Select>
              </Field>

              <Field label="Farbigkeit">
                <Select
                  value={draft?.colorMode ?? ""}
                  onChange={(event) =>
                    updateDraftField("colorMode", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Farbigkeit wählen
                  </option>
                  <option>4/4-farbig</option>
                  <option>4/0-farbig</option>
                  <option>1/1 schwarz</option>
                  <option>1/0 schwarz</option>
                  <option>Sonderfarben</option>
                  <option>CMYK</option>
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
                  <option>Wartung</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Kostenparameter</SectionHeader>

            <FieldGrid>
              <Field label="Stundensatz">
                <Input
                  value={draft?.hourlyRate ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("hourlyRate", event.target.value)
                  }
                />
              </Field>

              <Field label="Klickkosten Farbe">
                <Input
                  value={draft?.colorClickCost ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("colorClickCost", event.target.value)
                  }
                />
              </Field>

              <Field label="Klickkosten Schwarz">
                <Input
                  value={draft?.blackClickCost ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("blackClickCost", event.target.value)
                  }
                />
              </Field>

              <Field label="Duplex">
                <Select
                  value={draft?.duplex ?? ""}
                  onChange={(event) =>
                    updateDraftField("duplex", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Duplex wählen
                  </option>
                  <option>Ja</option>
                  <option>Nein</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Hinweise</SectionHeader>

            <FieldGrid>
              <Field label="Einsatz">
                <Select
                  value={draft?.usage ?? ""}
                  disabled={!isEditing}
                  onChange={(event) =>
                    updateDraftField("usage", event.target.value)
                  }
                >
                  <option>Standard</option>
                  <option>Bevorzugt</option>
                  <option>Nur Spezialfälle</option>
                </Select>
              </Field>

              <Field label="Notiz">
                <Input
                  value={draft?.note ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("note", event.target.value)
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
                {isDirty ? "Änderungen speichern" : "Maschine speichern"}
              </Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
