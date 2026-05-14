import { useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";

import { useEditableDraft } from "../hooks/useEditableDraft";
import { useMasterDetailSelection } from "../hooks/useMasterDetailSelection";

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
import { SectionHeader } from "../ui/SectionHeader";
import { SaveActionButton } from "../ui/SaveActionButton";
import { SortableTableHeader } from "../ui/SortableTableHeader";
import { Select } from "../ui/Select";
import { DataTable, TableToolbar } from "../ui/Table";
import { WorkspaceHeader } from "../ui/WorkspaceHeader";
import { useSortableTable } from "../ui/useSortableTable";

const deliveryTabs = [
  "Liste",
  "Entwurf",
  "Versandbereit",
  "Geliefert",
  "Abgeschlossen",
] as const;

type DeliveryTab = (typeof deliveryTabs)[number];

type DeliveryNoteRow = {
  id: string;
  number: string;
  customer: string;
  order: string;
  status: string;
  shippingMethod: string;
  recipient: string;
  address: string;
  template: string;
  badgeVariant?: "success";
};

const deliveryRowsByTab: Record<DeliveryTab, DeliveryNoteRow[]> = {
  Liste: [
    {
      id: "delivery-ls-2026-001",
      number: "LS-2026-001",
      customer: "Sonnendruck GmbH",
      order: "AU-2026-001",
      status: "Entwurf",
      shippingMethod: "Abholung",
      recipient: "Sonnendruck GmbH",
      address: "Musterstraße 1, 69168 Wiesloch",
      template: "Standardlieferschein",
      badgeVariant: "success",
    },
    {
      id: "delivery-ls-2026-002",
      number: "LS-2026-002",
      customer: "Musterkunde GmbH",
      order: "AU-2026-002",
      status: "Versandbereit",
      shippingMethod: "Auslieferung",
      recipient: "Musterkunde GmbH",
      address: "Beispielweg 12, 69115 Heidelberg",
      template: "Standardlieferschein",
      badgeVariant: undefined,
    },
    {
      id: "delivery-ls-2026-003",
      number: "LS-2026-003",
      customer: "Beispiel AG",
      order: "AU-2026-003",
      status: "Geliefert",
      shippingMethod: "Paketdienst",
      recipient: "Beispiel AG",
      address: "Industriestraße 8, 68159 Mannheim",
      template: "Neutraler Lieferschein",
      badgeVariant: "success",
    },
  ],
  Entwurf: [
    {
      id: "delivery-ls-2026-001",
      number: "LS-2026-001",
      customer: "Sonnendruck GmbH",
      order: "AU-2026-001",
      status: "Entwurf",
      shippingMethod: "Abholung",
      recipient: "Sonnendruck GmbH",
      address: "Musterstraße 1, 69168 Wiesloch",
      template: "Standardlieferschein",
      badgeVariant: "success",
    },
  ],
  Versandbereit: [
    {
      id: "delivery-ls-2026-002",
      number: "LS-2026-002",
      customer: "Musterkunde GmbH",
      order: "AU-2026-002",
      status: "Versandbereit",
      shippingMethod: "Auslieferung",
      recipient: "Musterkunde GmbH",
      address: "Beispielweg 12, 69115 Heidelberg",
      template: "Standardlieferschein",
      badgeVariant: undefined,
    },
  ],
  Geliefert: [
    {
      id: "delivery-ls-2026-003",
      number: "LS-2026-003",
      customer: "Beispiel AG",
      order: "AU-2026-003",
      status: "Geliefert",
      shippingMethod: "Paketdienst",
      recipient: "Beispiel AG",
      address: "Industriestraße 8, 68159 Mannheim",
      template: "Neutraler Lieferschein",
      badgeVariant: "success",
    },
  ],
  Abgeschlossen: [
    {
      id: "delivery-ls-2026-008",
      number: "LS-2026-008",
      customer: "Druckpartner Süd",
      order: "AU-2026-008",
      status: "Abgeschlossen",
      shippingMethod: "Spedition",
      recipient: "Druckpartner Süd",
      address: "Südstraße 5, 69190 Walldorf",
      template: "Technischer Lieferschein",
      badgeVariant: "success",
    },
  ],
};

function getDeliveryTitle(tab: DeliveryTab) {
  switch (tab) {
    case "Liste":
      return "Lieferschein vorbereiten";
    case "Entwurf":
      return "Lieferscheinentwurf bearbeiten";
    case "Versandbereit":
      return "Versandbereiten Lieferschein prüfen";
    case "Geliefert":
      return "Gelieferten Lieferschein prüfen";
    case "Abgeschlossen":
      return "Abgeschlossenen Lieferschein";
  }
}

function getDeliveryStatus(tab: DeliveryTab) {
  if (tab === "Liste") {
    return "Entwurf";
  }

  return tab;
}

function isDeliveryTab(tab: string): tab is DeliveryTab {
  return deliveryTabs.includes(tab as DeliveryTab);
}

type DeliverySortKey =
  | "number"
  | "customer"
  | "order"
  | "shippingMethod"
  | "status";

function getDeliverySortValue(
  deliveryNote: DeliveryNoteRow,
  sortKey: DeliverySortKey,
) {
  switch (sortKey) {
    case "number":
      return deliveryNote.number;

    case "customer":
      return deliveryNote.customer;

    case "order":
      return deliveryNote.order;

    case "shippingMethod":
      return deliveryNote.shippingMethod;

    case "status":
      return deliveryNote.status;
  }
}

export function DeliveryNotesPage() {
  const module = getModuleConfig("delivery-notes");

  const [isEditing, setIsEditing] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  const {
    activeTab,
    rows: deliveryRows,
    selectedItem: selectedDeliveryNote,
    setActiveTab,
    selectItem,
  } = useMasterDetailSelection({
    rowsByTab: deliveryRowsByTab,
    initialTab: "Liste" as DeliveryTab,
  });

  const { draft, isDirty, updateDraftField, resetDraft } =
    useEditableDraft(selectedDeliveryNote);

  const {
    sortedRows: sortedDeliveryRows,
    sortConfig: deliverySortConfig,
    requestSort: requestDeliverySort,
  } = useSortableTable<DeliveryNoteRow, DeliverySortKey>({
    rows: deliveryRows,
    initialSortKey: "number",
    getSortValue: getDeliverySortValue,
    fallbackSortValue: (deliveryNote: DeliveryNoteRow) => deliveryNote.number,
  });

  function handleTabChange(tab: string) {
    if (isDeliveryTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
      setIsDetailDrawerOpen(false);
    }
  }

  function handleDeliveryNoteSelect(deliveryNoteId: string) {
    selectItem(deliveryNoteId);
    setIsEditing(false);
    setIsDetailDrawerOpen(true);
  }

  function handleCloseDrawer() {
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

  function handleSaveDeliveryNote() {
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
        tabs={[...deliveryTabs]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="LIEFERSCHEINE"
          title="Lieferscheinübersicht"
          statusValue={activeTab === "Liste" ? "Alle Lieferscheine" : activeTab}
        />

        <section className="workspace-panel master-list-panel">
          <TableToolbar>
            <Input className="search-input" placeholder="Lieferscheine suchen..." />
            <Button>Filter</Button>
          </TableToolbar>

          <DataTable>
            <thead>
              <tr>
                <SortableTableHeader
                  label="Lieferschein"
                  sortKey="number"
                  sortConfig={deliverySortConfig}
                  onSort={requestDeliverySort}
                />
                <SortableTableHeader
                  label="Kunde"
                  sortKey="customer"
                  sortConfig={deliverySortConfig}
                  onSort={requestDeliverySort}
                />
                <SortableTableHeader
                  label="Auftrag"
                  sortKey="order"
                  sortConfig={deliverySortConfig}
                  onSort={requestDeliverySort}
                />
                <SortableTableHeader
                  label="Versand"
                  sortKey="shippingMethod"
                  sortConfig={deliverySortConfig}
                  onSort={requestDeliverySort}
                />
                <SortableTableHeader
                  label="Status"
                  sortKey="status"
                  sortConfig={deliverySortConfig}
                  onSort={requestDeliverySort}
                />
              </tr>
            </thead>

            <tbody>
              {sortedDeliveryRows.map((deliveryNote: DeliveryNoteRow) => {
                const isSelected = deliveryNote.id === selectedDeliveryNote?.id;

                return (
                  <tr
                    key={deliveryNote.id}
                    className={isSelected ? "data-table-row-selected" : undefined}
                    onClick={() => handleDeliveryNoteSelect(deliveryNote.id)}
                  >
                    <td>{deliveryNote.number}</td>
                    <td>{deliveryNote.customer}</td>
                    <td>{deliveryNote.order}</td>
                    <td>{deliveryNote.shippingMethod}</td>
                    <td>
                      <Badge variant={deliveryNote.badgeVariant}>
                        {deliveryNote.status}
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
        open={isDetailDrawerOpen && Boolean(selectedDeliveryNote)}
        eyebrow="Lieferschein"
        title={selectedDeliveryNote?.number ?? "Lieferschein"}
        subtitle={
          selectedDeliveryNote
            ? `${selectedDeliveryNote.customer} · ${selectedDeliveryNote.order}`
            : undefined
        }
        onClose={handleCloseDrawer}
        size="xl"
        footer={
          <>
            <DirtyStateNotice isDirty={isDirty} />

            <EditLockToggle
              isEditing={isEditing}
              onToggle={handleToggleEditing}
            />

            <Button onClick={handleResetDraft}>Änderungen verwerfen</Button>
            <Button>Vorschau prüfen</Button>
            <SaveActionButton
              isDirty={isDirty}
              defaultLabel="Lieferschein ausgeben"
              onClick={handleSaveDeliveryNote}
            />
          </>
        }
      >
        <section className="workspace-panel">
          <SectionHeader>Lieferscheinkopf</SectionHeader>

          <FieldGrid>
            <Field label="Lieferscheinnummer">
              <Input value={draft?.number ?? ""} readOnly />
            </Field>

            <Field label="Kunde">
              <Input value={draft?.customer ?? ""} readOnly />
            </Field>

            <Field label="Auftrag">
              <Input value={draft?.order ?? ""} readOnly />
            </Field>

            <Field label="Versandart">
              <Select
                value={draft?.shippingMethod ?? ""}
                disabled={!isEditing}
                onChange={(event) =>
                  updateDraftField("shippingMethod", event.target.value)
                }
              >
                <option value="" disabled>
                  Versandart wählen
                </option>
                <option>Abholung</option>
                <option>Auslieferung</option>
                <option>Paketdienst</option>
                <option>Spedition</option>
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
                <option value="" disabled>
                  Status wählen
                </option>
                <option>Entwurf</option>
                <option>Versandbereit</option>
                <option>Geliefert</option>
                <option>Abgeschlossen</option>
              </Select>
            </Field>
          </FieldGrid>

          <SectionHeader>Lieferadresse</SectionHeader>

          <FieldGrid>
            <Field label="Empfänger">
              <Input
                value={draft?.recipient ?? ""}
                readOnly={!isEditing}
                onChange={(event) =>
                  updateDraftField("recipient", event.target.value)
                }
              />
            </Field>

            <Field label="Adresse">
              <Input
                value={draft?.address ?? ""}
                readOnly={!isEditing}
                onChange={(event) =>
                  updateDraftField("address", event.target.value)
                }
              />
            </Field>
          </FieldGrid>

          <SectionHeader>Positionen</SectionHeader>

          <DataTable>
            <thead>
              <tr>
                <th>Pos.</th>
                <th>Bezeichnung</th>
                <th>Menge</th>
                <th>Einheit</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Produkt aus Auftrag übernehmen</td>
                <td>—</td>
                <td>Stk.</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Verpackungseinheit</td>
                <td>—</td>
                <td>Karton</td>
              </tr>
            </tbody>
          </DataTable>

          <SectionHeader>Ausgabe</SectionHeader>

          <FieldGrid>
            <Field label="Vorlage">
              <Select
                value={draft?.template ?? ""}
                disabled={!isEditing}
                onChange={(event) =>
                  updateDraftField("template", event.target.value)
                }
              >
                <option value="" disabled>
                  Vorlage wählen
                </option>
                <option>Standardlieferschein</option>
                <option>Neutraler Lieferschein</option>
                <option>Technischer Lieferschein</option>
              </Select>
            </Field>
          </FieldGrid>
        </section>
      </DetailDrawer>
    </div>
  );
}
