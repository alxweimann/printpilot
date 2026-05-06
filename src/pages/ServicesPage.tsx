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

const serviceTabs = [
  "Liste",
  "Vorstufe",
  "Satz / Layout",
  "Produktion",
  "Zuschlag",
  "Sonstiges",
] as const;

type ServiceTab = (typeof serviceTabs)[number];

type ServiceRow = {
  id: string;
  name: string;
  group: string;
  unit: string;
  status: string;
  optional: string;
  price: string;
  description: string;
  badgeVariant?: "success";
};

const serviceRowsByTab: Record<ServiceTab, ServiceRow[]> = {
  Liste: [
    {
      id: "service-datenpruefung",
      name: "Datenprüfung",
      group: "Vorstufe",
      unit: "pauschal",
      status: "Aktiv",
      optional: "Nein",
      price: "15,00 €",
      description: "Technische Datenprüfung",
      badgeVariant: "success",
    },
    {
      id: "service-grafische-anpassung",
      name: "Grafische Anpassung",
      group: "Satz / Layout",
      unit: "pro Stunde",
      status: "Aktiv",
      optional: "Optional",
      price: "75,00 €",
      description: "Gestalterische Anpassungen",
      badgeVariant: undefined,
    },
    {
      id: "service-expresszuschlag",
      name: "Expresszuschlag",
      group: "Zuschlag",
      unit: "pauschal",
      status: "Aktiv",
      optional: "Ja",
      price: "25,00 €",
      description: "Eilzuschlag",
      badgeVariant: undefined,
    },
  ],
  Vorstufe: [
    {
      id: "service-datenpruefung",
      name: "Datenprüfung",
      group: "Vorstufe",
      unit: "pauschal",
      status: "Aktiv",
      optional: "Nein",
      price: "15,00 €",
      description: "Technische Datenprüfung",
      badgeVariant: "success",
    },
    {
      id: "service-pdf-korrektur",
      name: "PDF-Korrektur",
      group: "Vorstufe",
      unit: "pro Stunde",
      status: "Aktiv",
      optional: "Optional",
      price: "75,00 €",
      description: "PDF-Anpassung",
      badgeVariant: undefined,
    },
  ],
  "Satz / Layout": [
    {
      id: "service-grafische-anpassung",
      name: "Grafische Anpassung",
      group: "Satz / Layout",
      unit: "pro Stunde",
      status: "Aktiv",
      optional: "Optional",
      price: "75,00 €",
      description: "Gestalterische Anpassungen",
      badgeVariant: undefined,
    },
  ],
  Produktion: [
    {
      id: "service-produktionspauschale",
      name: "Produktionspauschale",
      group: "Produktion",
      unit: "pro Auftrag",
      status: "Aktiv",
      optional: "Nein",
      price: "20,00 €",
      description: "Produktionsgrundpauschale",
      badgeVariant: undefined,
    },
  ],
  Zuschlag: [
    {
      id: "service-expresszuschlag",
      name: "Expresszuschlag",
      group: "Zuschlag",
      unit: "pauschal",
      status: "Aktiv",
      optional: "Ja",
      price: "25,00 €",
      description: "Eilzuschlag",
      badgeVariant: undefined,
    },
  ],
  Sonstiges: [
    {
      id: "service-sonderleistung",
      name: "Sonderleistung",
      group: "Sonstiges",
      unit: "pauschal",
      status: "Entwurf",
      optional: "Optional",
      price: "0,00 €",
      description: "Freie Sonderleistung",
      badgeVariant: undefined,
    },
  ],
};

function getServiceTitle(tab: ServiceTab) {
  switch (tab) {
    case "Liste":
      return "Leistung verwalten";
    case "Vorstufe":
      return "Vorstufenleistung verwalten";
    case "Satz / Layout":
      return "Satz- und Layoutleistung verwalten";
    case "Produktion":
      return "Produktionsleistung verwalten";
    case "Zuschlag":
      return "Zuschlag verwalten";
    case "Sonstiges":
      return "Sonstige Leistung verwalten";
  }
}

function getServiceGroup(tab: ServiceTab) {
  if (tab === "Liste") {
    return "Aktiv";
  }

  return tab;
}

function isServiceTab(tab: string): tab is ServiceTab {
  return serviceTabs.includes(tab as ServiceTab);
}

export function ServicesPage() {
  const module = getModuleConfig("services");

  const [isEditing, setIsEditing] = useState(false);

  const {
    activeTab,
    rows: serviceRows,
    selectedItem: selectedService,
    setActiveTab,
    selectItem,
  } = useMasterDetailSelection({
    rowsByTab: serviceRowsByTab,
    initialTab: "Liste",
  });

  const { draft, isDirty, updateDraftField, resetDraft } =
    useEditableDraft(selectedService);

  function handleTabChange(tab: string) {
    if (isServiceTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
    }
  }

  function handleServiceSelect(serviceId: string) {
    selectItem(serviceId);
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
        tabs={[...serviceTabs]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="Leistungsmaske"
          title={getServiceTitle(activeTab)}
          statusValue={getServiceGroup(activeTab)}
        />

        <div className="master-detail-layout">
          <section className="workspace-panel master-list-panel">
            <TableToolbar>
              <Input className="search-input" placeholder="Leistungen suchen..." />
              <Button>Filter</Button>
            </TableToolbar>

            <DataTable>
              <thead>
                <tr>
                  <th>Leistung</th>
                  <th>Gruppe</th>
                  <th>Einheit</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {serviceRows.map((service) => {
                  const isSelected = service.id === selectedService?.id;

                  return (
                    <tr
                      key={service.id}
                      className={
                        isSelected ? "data-table-row-selected" : undefined
                      }
                      onClick={() => handleServiceSelect(service.id)}
                    >
                      <td>{service.name}</td>
                      <td>{service.group}</td>
                      <td>{service.unit}</td>
                      <td>
                        <Badge variant={service.badgeVariant}>
                          {service.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel master-editor-panel">
            <SectionHeader>Leistungsdaten</SectionHeader>

            <FieldGrid>
              <Field label="Leistung">
                <Input
                  value={draft?.name ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("name", event.target.value)
                  }
                />
              </Field>

              <Field label="Gruppe">
                <Select
                  value={draft?.group ?? ""}
                  onChange={(event) =>
                    updateDraftField("group", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Gruppe wählen
                  </option>
                  <option>Vorstufe</option>
                  <option>Satz / Layout</option>
                  <option>Produktion</option>
                  <option>Zuschlag</option>
                  <option>Sonstiges</option>
                </Select>
              </Field>

              <Field label="Einheit">
                <Select
                  value={draft?.unit ?? ""}
                  onChange={(event) =>
                    updateDraftField("unit", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Einheit wählen
                  </option>
                  <option>pauschal</option>
                  <option>pro Stunde</option>
                  <option>pro Stück</option>
                  <option>pro Auftrag</option>
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
                  <option>Gesperrt</option>
                </Select>
              </Field>

              <Field label="Optional">
                <Select
                  value={draft?.optional ?? ""}
                  disabled={!isEditing}
                  onChange={(event) =>
                    updateDraftField("optional", event.target.value)
                  }
                >
                  <option>Nein</option>
                  <option>Ja</option>
                  <option>Optional</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Preise</SectionHeader>

            <FieldGrid>
              <Field label="Preis">
                <Input
                  value={draft?.price ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("price", event.target.value)
                  }
                />
              </Field>

              <Field label="Beschreibung">
                <Input
                  value={draft?.description ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("description", event.target.value)
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
                {isDirty ? "Änderungen speichern" : "Leistung speichern"}
              </Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
