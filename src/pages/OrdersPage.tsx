import { useMemo, useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";
import {
  type PrintPilotApprovalStatus,
  type PrintPilotHandoffStatus,
  type PrintPilotOrder,
  type PrintPilotOrderPriority,
  type PrintPilotOrderStatus,
  getPrintPilotApprovalBadgeVariant,
  groupPrintPilotOrdersByStatus,
} from "../data/printPilotStore";
import { useEditableDraft } from "../hooks/useEditableDraft";
import { useMasterDetailSelection } from "../hooks/useMasterDetailSelection";
import { usePrintPilotStore } from "../store/PrintPilotStore";

import { PageHeader } from "../layout/PageHeader";
import { PageTabs } from "../layout/PageTabs";

import { Badge, type BadgeVariant } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { DetailDrawer } from "../ui/DetailDrawer";
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

const orderTabs = [
  "Alle Aufträge",
  "Neu",
  "In Produktion",
  "Wartet",
  "Fertig",
  "Archiv",
] as const;

const approvalOptions: PrintPilotApprovalStatus[] = [
  "Freigabe ausstehend",
  "Freigabe erteilt",
  "Korrektur angefordert",
  "Daten unvollständig",
  "Nicht erforderlich",
];

const handoffOptions: PrintPilotHandoffStatus[] = [
  "Druckdaten prüfen",
  "Wartet auf Daten",
  "In Druck",
  "In Weiterverarbeitung",
  "Abholbereit",
  "Versendet",
  "Abgeschlossen",
];

const priorityOptions: PrintPilotOrderPriority[] = [
  "Niedrig",
  "Normal",
  "Hoch",
  "Express",
];

type OrderTab = "Alle Aufträge" | PrintPilotOrderStatus;

type OrderSortKey =
  | "number"
  | "customerName"
  | "product"
  | "dueDate"
  | "approval"
  | "status";

type OrderSortDirection = "asc" | "desc";

type OrderSortConfig = {
  key: OrderSortKey;
  direction: OrderSortDirection;
} | null;

const orderSortCollator = new Intl.Collator("de-DE", {
  numeric: true,
  sensitivity: "base",
});

const orderSortLabels: Record<OrderSortKey, string> = {
  number: "Auftrag",
  customerName: "Kunde",
  product: "Produkt",
  dueDate: "Fällig",
  approval: "Freigabe",
  status: "Status",
};


function getOrderTitle(tab: OrderTab) {
  switch (tab) {
    case "Alle Aufträge":
      return "Auftragsübersicht";

    case "Neu":
      return "Neuen Auftrag vorbereiten";

    case "In Produktion":
      return "Auftrag in Produktion bearbeiten";

    case "Wartet":
      return "Wartenden Auftrag prüfen";

    case "Fertig":
      return "Fertigen Auftrag prüfen";

    case "Archiv":
      return "Archivierten Auftrag prüfen";
  }
}

function isOrderTab(tab: string): tab is OrderTab {
  return orderTabs.includes(tab as OrderTab);
}

function hasValidApproval(approval: PrintPilotApprovalStatus) {
  return approval === "Freigabe erteilt" || approval === "Nicht erforderlich";
}

function isProductionLikeState(
  status: PrintPilotOrderStatus,
  handoff: PrintPilotHandoffStatus,
) {
  return (
    status === "In Produktion" ||
    handoff === "In Druck" ||
    handoff === "In Weiterverarbeitung"
  );
}

function needsProductionApprovalWarning(order: PrintPilotOrder) {
  return (
    isProductionLikeState(order.status, order.handoff) &&
    !hasValidApproval(order.approval)
  );
}

function getOrderStatusBadgeVariant(
  status: PrintPilotOrderStatus,
): BadgeVariant {
  switch (status) {
    case "In Produktion":
    case "Fertig":
      return "success";

    case "Wartet":
      return "warning";

    case "Neu":
    case "Archiv":
      return "neutral";
  }
}

function getOrderSortValue(order: PrintPilotOrder, key: OrderSortKey) {
  switch (key) {
    case "number":
      return order.number;

    case "customerName":
      return order.customerName;

    case "product":
      return order.product;

    case "dueDate":
      return order.dueDate;

    case "approval":
      return order.approval;

    case "status":
      return order.status;
  }
}

function sortPrintPilotOrders(
  rows: PrintPilotOrder[],
  sortConfig: OrderSortConfig,
) {
  if (!sortConfig) {
    return rows;
  }

  const directionFactor = sortConfig.direction === "asc" ? 1 : -1;

  return [...rows].sort((firstOrder, secondOrder) => {
    const firstValue = getOrderSortValue(firstOrder, sortConfig.key);
    const secondValue = getOrderSortValue(secondOrder, sortConfig.key);
    const primaryResult = orderSortCollator.compare(firstValue, secondValue);

    if (primaryResult !== 0) {
      return primaryResult * directionFactor;
    }

    return orderSortCollator.compare(firstOrder.number, secondOrder.number);
  });
}

function getOrderSortAriaValue(
  sortConfig: OrderSortConfig,
  sortKey: OrderSortKey,
): "none" | "ascending" | "descending" {
  if (sortConfig?.key !== sortKey) {
    return "none";
  }

  return sortConfig.direction === "asc" ? "ascending" : "descending";
}

function SortableOrderHeader({
  sortKey,
  sortConfig,
  onSort,
}: {
  sortKey: OrderSortKey;
  sortConfig: OrderSortConfig;
  onSort: (sortKey: OrderSortKey) => void;
}) {
  const isActive = sortConfig?.key === sortKey;
  const directionLabel = sortConfig?.direction === "asc" ? "aufsteigend" : "absteigend";

  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      title={
        isActive
          ? `${orderSortLabels[sortKey]} ${directionLabel} sortiert`
          : `Nach ${orderSortLabels[sortKey]} sortieren`
      }
      style={{
        alignItems: "center",
        background: "transparent",
        border: 0,
        color: "inherit",
        cursor: "pointer",
        display: "inline-flex",
        font: "inherit",
        gap: "0.35rem",
        letterSpacing: "inherit",
        padding: 0,
        textTransform: "inherit",
        whiteSpace: "nowrap",
      }}
    >
      <span>{orderSortLabels[sortKey]}</span>
      <span aria-hidden="true" style={{ fontSize: "0.7rem", opacity: isActive ? 1 : 0.45 }}>
        {isActive ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↕"}
      </span>
    </button>
  );
}

export function OrdersPage() {
  const module = getModuleConfig("orders");
  const { machines, orders, updateOrder } = usePrintPilotStore();

  const [isEditing, setIsEditing] = useState(false);
  const [orderSortConfig, setOrderSortConfig] =
    useState<OrderSortConfig>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isProductionApprovalDialogOpen, setIsProductionApprovalDialogOpen] =
    useState(false);

  const orderRowsByTab = useMemo(() => {
    return {
      "Alle Aufträge": orders,
      ...groupPrintPilotOrdersByStatus(orders),
    };
  }, [orders]);

  const {
    activeTab,
    rows: orderRows,
    selectedItem: selectedOrder,
    setActiveTab,
    selectItem,
  } = useMasterDetailSelection({
    rowsByTab: orderRowsByTab,
    initialTab: "Alle Aufträge",
  });

  const { draft, isDirty, updateDraftField, resetDraft, saveDraft } =
    useEditableDraft(selectedOrder);

  const canEdit = isEditing && Boolean(draft);
  const draftOrder = draft as PrintPilotOrder | undefined;

  const sortedOrderRows = useMemo(() => {
    return sortPrintPilotOrders(orderRows, orderSortConfig);
  }, [orderRows, orderSortConfig]);

  function handleOrderSort(nextSortKey: OrderSortKey) {
    setOrderSortConfig((currentConfig) => {
      if (currentConfig?.key === nextSortKey) {
        return {
          key: nextSortKey,
          direction: currentConfig.direction === "asc" ? "desc" : "asc",
        };
      }

      return {
        key: nextSortKey,
        direction: "asc",
      };
    });
  }

  function openApprovalDialogIfNeeded(nextOrder: PrintPilotOrder) {
    if (needsProductionApprovalWarning(nextOrder)) {
      setIsProductionApprovalDialogOpen(true);
      return;
    }

    setIsProductionApprovalDialogOpen(false);
  }

  function handleTabChange(tab: string) {
    if (isOrderTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
      setIsDetailDrawerOpen(false);
      setIsProductionApprovalDialogOpen(false);
    }
  }

  function handleOrderSelect(orderId: string) {
    selectItem(orderId);
    setIsEditing(false);
    setIsDetailDrawerOpen(true);
    setIsProductionApprovalDialogOpen(false);
  }

  function handleCloseDetailDrawer() {
    setIsEditing(false);
    setIsDetailDrawerOpen(false);
    setIsProductionApprovalDialogOpen(false);
  }

  function handleResetDraft() {
    resetDraft();
    setIsEditing(false);
    setIsProductionApprovalDialogOpen(false);
  }

  function handleToggleEditing() {
    setIsEditing((currentValue) => !currentValue);
  }

  function handleStatusChange(nextStatus: PrintPilotOrderStatus) {
    if (!draftOrder) {
      return;
    }

    const nextOrder: PrintPilotOrder = {
      ...draftOrder,
      status: nextStatus,
    };

    updateDraftField("status", nextStatus);
    openApprovalDialogIfNeeded(nextOrder);
  }

  function handleHandoffChange(nextHandoff: PrintPilotHandoffStatus) {
    if (!draftOrder) {
      return;
    }

    const nextStatus =
      nextHandoff === "In Druck" || nextHandoff === "In Weiterverarbeitung"
        ? "In Produktion"
        : draftOrder.status;

    const nextOrder: PrintPilotOrder = {
      ...draftOrder,
      handoff: nextHandoff,
      status: nextStatus,
    };

    updateDraftField("handoff", nextHandoff);

    if (nextStatus !== draftOrder.status) {
      updateDraftField("status", nextStatus);
    }

    openApprovalDialogIfNeeded(nextOrder);
  }

  function handleApprovalChange(nextApproval: PrintPilotApprovalStatus) {
    if (!draftOrder) {
      return;
    }

    const nextOrder: PrintPilotOrder = {
      ...draftOrder,
      approval: nextApproval,
    };

    updateDraftField("approval", nextApproval);
    openApprovalDialogIfNeeded(nextOrder);
  }

  function saveOrder(savedOrder: PrintPilotOrder) {
    updateOrder(savedOrder);
    saveDraft(savedOrder);
    setIsEditing(false);
    setIsProductionApprovalDialogOpen(false);
    setIsDetailDrawerOpen(false);

    if (activeTab !== "Alle Aufträge") {
      setActiveTab("Alle Aufträge");
    }

    window.setTimeout(() => {
      selectItem(savedOrder.id);
    }, 0);
  }

  function handleSaveDraft() {
    if (!draft) {
      return;
    }

    const savedOrder = draft as PrintPilotOrder;

    if (needsProductionApprovalWarning(savedOrder)) {
      setIsProductionApprovalDialogOpen(true);
      return;
    }

    saveOrder(savedOrder);
  }

  function handleCancelProductionApprovalDialog() {
    if (selectedOrder) {
      updateDraftField("status", selectedOrder.status);
      updateDraftField("handoff", selectedOrder.handoff);
      updateDraftField("approval", selectedOrder.approval);
    }

    setIsProductionApprovalDialogOpen(false);
  }

  function handleConfirmProductionApprovalDialog() {
    if (!draft) {
      return;
    }

    const currentDraft = draft as PrintPilotOrder;

    const savedOrder: PrintPilotOrder = {
      ...currentDraft,
      status: "In Produktion",
    };

    saveOrder(savedOrder);
  }

  return (
    <div className="page">
      <PageHeader
        title={module.title}
        description={module.description}
        actionLabel={module.actionLabel}
      />

      <PageTabs
        tabs={[...orderTabs]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="Aufträge"
          title={getOrderTitle(activeTab)}
          statusValue={isEditing ? "Bearbeitung offen" : activeTab}
        />

        <section className="workspace-panel">
          <TableToolbar>
            <Input className="search-input" placeholder="Aufträge suchen..." />

            <Button>Filter</Button>
          </TableToolbar>

          <DataTable>
            <thead>
              <tr>
                <th aria-sort={getOrderSortAriaValue(orderSortConfig, "number")}>
                  <SortableOrderHeader
                    sortKey="number"
                    sortConfig={orderSortConfig}
                    onSort={handleOrderSort}
                  />
                </th>
                <th
                  aria-sort={getOrderSortAriaValue(
                    orderSortConfig,
                    "customerName",
                  )}
                >
                  <SortableOrderHeader
                    sortKey="customerName"
                    sortConfig={orderSortConfig}
                    onSort={handleOrderSort}
                  />
                </th>
                <th aria-sort={getOrderSortAriaValue(orderSortConfig, "product")}>
                  <SortableOrderHeader
                    sortKey="product"
                    sortConfig={orderSortConfig}
                    onSort={handleOrderSort}
                  />
                </th>
                <th aria-sort={getOrderSortAriaValue(orderSortConfig, "dueDate")}>
                  <SortableOrderHeader
                    sortKey="dueDate"
                    sortConfig={orderSortConfig}
                    onSort={handleOrderSort}
                  />
                </th>
                <th aria-sort={getOrderSortAriaValue(orderSortConfig, "approval")}>
                  <SortableOrderHeader
                    sortKey="approval"
                    sortConfig={orderSortConfig}
                    onSort={handleOrderSort}
                  />
                </th>
                <th aria-sort={getOrderSortAriaValue(orderSortConfig, "status")}>
                  <SortableOrderHeader
                    sortKey="status"
                    sortConfig={orderSortConfig}
                    onSort={handleOrderSort}
                  />
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedOrderRows.map((order) => {
                const isSelected =
                  isDetailDrawerOpen && order.id === selectedOrder?.id;

                return (
                  <tr
                    key={order.id}
                    className={
                      isSelected ? "data-table-row-selected" : undefined
                    }
                    onClick={() => handleOrderSelect(order.id)}
                  >
                    <td style={{ whiteSpace: "nowrap" }}>{order.number}</td>
                    <td>{order.customerName}</td>
                    <td>{order.product}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{order.dueDate}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <Badge
                        variant={getPrintPilotApprovalBadgeVariant(
                          order.approval,
                        )}
                      >
                        {order.approval}
                      </Badge>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <Badge variant={getOrderStatusBadgeVariant(order.status)}>
                        {order.status}
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
        open={isDetailDrawerOpen && Boolean(selectedOrder)}
        eyebrow="Auftrag"
        title={draft?.number ?? selectedOrder?.number ?? "Auftrag"}
        subtitle={
          selectedOrder
            ? `${selectedOrder.customerName} · ${selectedOrder.product}`
            : undefined
        }
        size="xl"
        onClose={handleCloseDetailDrawer}
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
              defaultLabel="Auftrag speichern"
              onClick={handleSaveDraft}
            />
          </>
        }
      >
        <div className="detail-drawer-stack">
          <section className="detail-drawer-panel">
            <SectionHeader>Auftragskopf</SectionHeader>

            <FieldGrid>
              <Field label="Auftragsnummer">
                <Input value={draft?.number ?? ""} readOnly />
              </Field>

              <Field label="Kunde">
                <Input
                  value={draft?.customerName ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("customerName", event.target.value)
                  }
                />
              </Field>

              <Field label="Produkt">
                <Input
                  value={draft?.product ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("product", event.target.value)
                  }
                />
              </Field>

              <Field label="Status">
                <Select
                  value={draft?.status ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    handleStatusChange(
                      event.currentTarget.value as PrintPilotOrderStatus,
                    )
                  }
                >
                  {orderTabs
                    .filter((tab): tab is PrintPilotOrderStatus =>
                      tab !== "Alle Aufträge",
                    )
                    .map((tab) => (
                      <option key={tab}>{tab}</option>
                    ))}
                </Select>
              </Field>

              <Field label="Fällig am">
                <Input
                  type="date"
                  value={draft?.dueDate ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("dueDate", event.target.value)
                  }
                />
              </Field>
            </FieldGrid>
          </section>

          <section className="detail-drawer-panel">
            <SectionHeader>Produktion</SectionHeader>

            <FieldGrid>
              <Field label="Maschine">
                <Select
                  value={draft?.machineId ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField("machineId", event.target.value)
                  }
                >
                  <option value="">Keine Maschine gewählt</option>

                  {machines.map((machine) => (
                    <option key={machine.id} value={machine.id}>
                      {machine.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Priorität">
                <Select
                  value={draft?.priority ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField(
                      "priority",
                      event.target.value as PrintPilotOrderPriority,
                    )
                  }
                >
                  {priorityOptions.map((priority) => (
                    <option key={priority}>{priority}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Freigabe">
                <Select
                  value={draft?.approval ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    handleApprovalChange(
                      event.currentTarget.value as PrintPilotApprovalStatus,
                    )
                  }
                >
                  {approvalOptions.map((approval) => (
                    <option key={approval}>{approval}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Übergabe">
                <Select
                  value={draft?.handoff ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    handleHandoffChange(
                      event.currentTarget.value as PrintPilotHandoffStatus,
                    )
                  }
                >
                  {handoffOptions.map((handoff) => (
                    <option key={handoff}>{handoff}</option>
                  ))}
                </Select>
              </Field>
            </FieldGrid>
          </section>
        </div>
      </DetailDrawer>

      <ConfirmDialog
        open={isProductionApprovalDialogOpen && Boolean(draftOrder)}
        title="Auftrag ohne gültige Freigabe"
        description={
          <>
            Dieser Auftrag ist produktionsrelevant oder soll in Produktion
            gehen, obwohl die Freigabe aktuell{" "}
            <strong>{draftOrder?.approval}</strong> ist.
          </>
        }
        details={
          <>
            <span>
              <strong>Auftrag:</strong> {draftOrder?.number}
            </span>
            <span>
              <strong>Produkt:</strong> {draftOrder?.product}
            </span>
            <span>
              <strong>Kunde:</strong> {draftOrder?.customerName}
            </span>
            <span>
              <strong>Übergabe:</strong> {draftOrder?.handoff}
            </span>
          </>
        }
        variant="danger"
        cancelLabel="Abbrechen"
        confirmLabel="Trotzdem speichern"
        onCancel={handleCancelProductionApprovalDialog}
        onConfirm={handleConfirmProductionApprovalDialog}
      />
    </div>
  );
}
