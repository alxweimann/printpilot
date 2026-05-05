import { getModuleConfig } from "../app/moduleConfig";
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

const machineRowsByTab = {
  Liste: [
    {
      id: "machine-xerox-iridesse",
      name: "Xerox Iridesse",
      type: "Digitaldruck Farbe",
      colorMode: "4/4 + Sonderfarben",
      status: "Aktiv",
      badgeVariant: "success" as const,
    },
    {
      id: "machine-xerox-nuvera",
      name: "Xerox Nuvera",
      type: "Digitaldruck Schwarz",
      colorMode: "1/1 schwarz",
      status: "Aktiv",
      badgeVariant: undefined,
    },
    {
      id: "machine-roland-truevis-vg3-540",
      name: "Roland TrueVis VG3 540",
      type: "Großformat",
      colorMode: "CMYK",
      status: "Aktiv",
      badgeVariant: undefined,
    },
  ],
  "Digitaldruck Farbe": [
    {
      id: "machine-xerox-iridesse",
      name: "Xerox Iridesse",
      type: "Digitaldruck Farbe",
      colorMode: "4/4 + Sonderfarben",
      status: "Aktiv",
      badgeVariant: "success" as const,
    },
  ],
  "Digitaldruck Schwarz": [
    {
      id: "machine-xerox-nuvera",
      name: "Xerox Nuvera",
      type: "Digitaldruck Schwarz",
      colorMode: "1/1 schwarz",
      status: "Aktiv",
      badgeVariant: undefined,
    },
    {
      id: "machine-canon-vp140",
      name: "Canon VP140",
      type: "Digitaldruck Schwarz",
      colorMode: "1/1 schwarz",
      status: "Aktiv",
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
      badgeVariant: undefined,
    },
  ],
  Wartung: [
    {
      id: "machine-xerox-iridesse-sonderfarben",
      name: "Xerox Iridesse Sonderfarben",
      type: "Digitaldruck Farbe",
      colorMode: "4/4 + Sonderfarben",
      status: "Wartung",
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

function getMachineType(tab: MachineTab) {
  if (tab === "Liste" || tab === "Wartung") {
    return "";
  }

  return tab;
}

function isMachineTab(tab: string): tab is MachineTab {
  return machineTabs.includes(tab as MachineTab);
}

export function MachinesPage() {
  const module = getModuleConfig("machines");

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

  function handleTabChange(tab: string) {
    if (isMachineTab(tab)) {
      setActiveTab(tab);
    }
  }

  function handleMachineSelect(machineId: string) {
    selectItem(machineId);
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
                <Input value={selectedMachine?.name ?? ""} readOnly />
              </Field>

              <Field label="Typ">
                <Select
                  value={getMachineType(activeTab) || selectedMachine?.type || ""}
                  onChange={(event) => handleTabChange(event.target.value)}
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
                <Select defaultValue={selectedMachine?.colorMode ?? ""}>
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
                  value={selectedMachine?.status ?? "Aktiv"}
                  onChange={(event) => {
                    if (event.target.value === "Wartung") {
                      handleTabChange("Wartung");
                    }
                  }}
                >
                  <option>Aktiv</option>
                  <option>Wartung</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Kostenparameter</SectionHeader>

            <FieldGrid>
              <Field label="Stundensatz">
                <Input placeholder="0,00 €" />
              </Field>

              <Field label="Klickkosten Farbe">
                <Input placeholder="0,000 €" />
              </Field>

              <Field label="Klickkosten Schwarz">
                <Input placeholder="0,000 €" />
              </Field>

              <Field label="Duplex">
                <Select defaultValue="">
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
                <Select defaultValue="Standard">
                  <option>Standard</option>
                  <option>Bevorzugt</option>
                  <option>Nur Spezialfälle</option>
                </Select>
              </Field>

              <Field label="Notiz">
                <Input placeholder="Interne Notiz" />
              </Field>
            </FieldGrid>

            <div className="calculation-footer">
              <Button>Änderungen verwerfen</Button>
              <Button variant="primary">Maschine speichern</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
