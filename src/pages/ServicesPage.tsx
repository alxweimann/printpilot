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


type ServiceSortKey = "number" | "name" | "group" | "unit" | "price" | "status";

function getServiceSortValue(
  service: PrintPilotService,
  sortKey: ServiceSortKey,
) {
  switch (sortKey) {
    case "number":
      return service.number;
    case "name":
      return service.name;
    case "group":
      return service.group;
    case "unit":
      return service.unit;
    case "price":
      return service.price;
    case "status":
      return service.status;
  }
}

export function ServicesPage() {
  const module = getModuleConfig("services");
  const { services, updateService } = usePrintPilotStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

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

  const {
    sortedRows: sortedServiceRows,
    sortConfig: serviceSortConfig,
    requestSort: requestServiceSort,
  } = useSortableTable<PrintPilotService, ServiceSortKey>({
    rows: serviceRows,
    initialSortKey: "number",
    getSortValue: getServiceSortValue,
  });

  const { draft, isDirty, updateDraftField, resetDraft, saveDraft } =
    useEditableDraft(selectedService);

  const canEdit = isEditing && Boolean(draft);

  function handleTabChange(tab: string) {
    if (isServiceTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
      setIsDetailDrawerOpen(false);
    }
  }

  function handleServiceSelect(serviceId: string) {
    selectItem(serviceId);
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

    const savedService = draft as PrintPilotService;

    updateService(savedService);
    saveDraft(savedService);
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
                <SortableTableHeader
                  label="Leistungsnr."
                  sortKey="number"
                  sortConfig={serviceSortConfig}
                  onSort={requestServiceSort}
                />
                <SortableTableHeader
                  label="Name"
                  sortKey="name"
                  sortConfig={serviceSortConfig}
                  onSort={requestServiceSort}
                />
                <SortableTableHeader
                  label="Gruppe"
                  sortKey="group"
                  sortConfig={serviceSortConfig}
                  onSort={requestServiceSort}
                />
                <SortableTableHeader
                  label="Einheit"
                  sortKey="unit"
                  sortConfig={serviceSortConfig}
                  onSort={requestServiceSort}
                />
                <SortableTableHeader
                  label="Preis"
                  sortKey="price"
                  sortConfig={serviceSortConfig}
                  onSort={requestServiceSort}
                />
                <SortableTableHeader
                  label="Status"
                  sortKey="status"
                  sortConfig={serviceSortConfig}
                  onSort={requestServiceSort}
                />
              </tr>
            </thead>

            <tbody>
              {sortedServiceRows.map((service) => {
                const isSelected = service.id === selectedService?.id;

                return (
                  <tr
                    key={service.id}
                    className={isSelected ? "data-table-row-selected" : undefined}
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
      </section>

      <DetailDrawer
        accentColor={module.accentColor}
        open={isDetailDrawerOpen && Boolean(selectedService)}
        eyebrow="Leistung"
        title={selectedService?.name ?? "Leistung"}
        subtitle={
          selectedService
            ? `${selectedService.number} · ${selectedService.group}`
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
              defaultLabel="Leistung speichern"
              onClick={handleSaveDraft}
            />
          </>
        }
      >
        <div className="detail-drawer-stack">
          <section className="detail-drawer-panel">
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
          </section>

          <section className="detail-drawer-panel">
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
            </FieldGrid>
          </section>

          <section className="detail-drawer-panel">
            <SectionHeader>Beschreibung</SectionHeader>

            <FieldGrid>
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
          </section>
        </div>
      </DetailDrawer>
    </div>
  );
}
