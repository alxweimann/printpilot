import { useMemo, useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";
import {
  type PrintPilotService,
  type PrintPilotServiceStatus,
  groupPrintPilotServicesByStatus,
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

const serviceTabs = ["Aktiv", "Optional", "Archiv"] as const;

type ServiceTab = PrintPilotServiceStatus;

function getServiceTitle(tab: ServiceTab) {
  switch (tab) {
    case "Aktiv":
      return "Aktive Leistung bearbeiten";

    case "Optional":
      return "Optionale Leistung bearbeiten";

    case "Archiv":
      return "Archivierte Leistung prüfen";
  }
}

function isServiceTab(tab: string): tab is ServiceTab {
  return serviceTabs.includes(tab as ServiceTab);
}

export function ServicesPage() {
  const module = getModuleConfig("services");
  const { services, updateService } = usePrintPilotStore();

  const [isEditing, setIsEditing] = useState(false);

  const serviceRowsByTab = useMemo(() => {
    return groupPrintPilotServicesByStatus(services);
  }, [services]);

  const {
    activeTab,
    rows: serviceRows,
    selectedItem: selectedService,
    setActiveTab,
    selectItem,
  } = useMasterDetailSelection({
    rowsByTab: serviceRowsByTab,
    initialTab: "Aktiv" as ServiceTab,
  });

  const { draft, isDirty, updateDraftField, resetDraft, saveDraft } =
    useEditableDraft(selectedService);

  const canEdit = isEditing && Boolean(draft);

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

  function handleSaveDraft() {
    if (!draft) {
      return;
    }

    const savedService = draft as PrintPilotService;

    updateService(savedService);
    saveDraft(savedService);
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
        tabs={[...serviceTabs]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="Leistungen"
          title={getServiceTitle(activeTab)}
          statusValue={isEditing ? "Bearbeitung offen" : activeTab}
        />

        <div className="master-detail-layout">
          <section className="workspace-panel master-list-panel">
            <TableToolbar>
              <Input
                className="search-input"
                placeholder="Leistungen suchen..."
              />

              <Button>Filter</Button>
            </TableToolbar>

            <DataTable>
              <thead>
                <tr>
                  <th>Leistungsnr.</th>
                  <th>Name</th>
                  <th>Gruppe</th>
                  <th>Einheit</th>
                  <th>Preis</th>
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
                      <td style={{ whiteSpace: "nowrap" }}>{service.number}</td>
                      <td>{service.name}</td>
                      <td>{service.group}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{service.unit}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{service.price}</td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <Badge variant={getPrintPilotStatusBadgeVariant(service.status)}>
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
              <Field label="Leistungsnummer">
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

              <Field label="Gruppe">
                <Select
                  value={draft?.group ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField("group", event.target.value)
                  }
                >
                  <option>Druckvorstufe</option>
                  <option>Proof</option>
                  <option>Produktion</option>
                  <option>Weiterverarbeitung</option>
                  <option>Logistik</option>
                  <option>Archiv</option>
                </Select>
              </Field>

              <Field label="Einheit">
                <Select
                  value={draft?.unit ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField("unit", event.target.value)
                  }
                >
                  <option>pauschal</option>
                  <option>Stück</option>
                  <option>Minute</option>
                  <option>Stunde</option>
                  <option>laufender Meter</option>
                </Select>
              </Field>

              <Field label="Status">
                <Select
                  value={draft?.status ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField(
                      "status",
                      event.target.value as PrintPilotServiceStatus,
                    )
                  }
                >
                  {serviceTabs.map((tab) => (
                    <option key={tab}>{tab}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Optional">
                <Select
                  value={draft?.optional ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField("optional", event.target.value)
                  }
                >
                  <option>Ja</option>
                  <option>Nein</option>
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Kalkulation</SectionHeader>

            <FieldGrid>
              <Field label="Preis">
                <Input
                  value={draft?.price ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("price", event.target.value)
                  }
                />
              </Field>

              <Field label="Beschreibung">
                <Input
                  value={draft?.description ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("description", event.target.value)
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
                defaultLabel="Leistung speichern"
                onClick={handleSaveDraft}
              />
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
