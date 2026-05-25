import { useMemo, useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";
import {
  type PrintPilotApprovalStatus,
  type PrintPilotHandoffStatus,
  type PrintPilotOrder,
  type PrintPilotOrderPriority,
  createPrintPilotDeliveryNoteFromOrder,
  createPrintPilotInvoiceFromOrder,
  createPrintPilotHistoryEntry,
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
import { DocumentHistory } from "../ui/DocumentHistory";
import { DocumentPreviewDialog } from "../ui/DocumentPreviewDialog";
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
import { WorkflowHints } from "../ui/WorkflowHints";
import { formatPrintPilotDateString } from "../utils/dateFormat";

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

function getOrderRequiredFieldIssues(order: PrintPilotOrder | undefined) {
  const issues: string[] = [];

  if (!order) {
    return issues;
  }

  if (!order.customerName || order.customerName.trim().length === 0) {
    issues.push("Kunde fehlt");
  }

  if (!order.product || order.product.trim().length === 0) {
    issues.push("Produkt fehlt");
  }

  return issues;
}

function getOrderWorkflowHints(order: PrintPilotOrder | undefined) {
  if (!order) {
    return [];
  }

  const hints = [];

  if (!order.machine || order.machine.trim().length === 0) {
    hints.push({
      title: "Maschine fehlt",
      description: "Weise eine Druckmaschine zu, bevor der Auftrag produziert wird.",
      variant: "warning" as const,
    });
  }

  if (order.approval === "Freigabe ausstehend") {
    hints.push({
      title: "Freigabe ausstehend",
      description: "Vor Produktion sollte die Kunden- oder interne Freigabe abgeschlossen sein.",
      variant: "warning" as const,
    });
  }

  if (order.handoff === "Druckdaten prüfen") {
    hints.push({
      title: "Druckdaten prüfen",
      description: "Die Druckdaten sollten vor Übergabe in die Produktion geprüft werden.",
      variant: "info" as const,
    });
  }

  if (order.status === "Fertig") {
    hints.push({
      title: "Auftrag fertig",
      description: "Lieferschein und Rechnung können final geprüft werden.",
      variant: "success" as const,
    });
  }

  return hints;
}

export function OrdersPage() {
  const module = getModuleConfig("orders");
  const {
    addDeliveryNote,
    addInvoice,
    deliveryNotes,
    invoices,
    machines,
    orders,
    settings,
    updateOrder,
  } = usePrintPilotStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isProductionApprovalDialogOpen, setIsProductionApprovalDialogOpen] =
    useState(false);
  const [isCreateDeliveryNoteDialogOpen, setIsCreateDeliveryNoteDialogOpen] =
    useState(false);
  const [isDuplicateDeliveryNoteDialogOpen, setIsDuplicateDeliveryNoteDialogOpen] =
    useState(false);
  const [isCreateInvoiceDialogOpen, setIsCreateInvoiceDialogOpen] =
    useState(false);
  const [isDuplicateInvoiceDialogOpen, setIsDuplicateInvoiceDialogOpen] =
    useState(false);
  const [isRequiredFieldsDialogOpen, setIsRequiredFieldsDialogOpen] =
    useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [requiredFieldsActionLabel, setRequiredFieldsActionLabel] =
    useState("Folgebeleg");

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
    initialTab: "Alle Aufträge" as OrderTab,
  });

  const { draft, isDirty, updateDraftField, resetDraft, saveDraft } =
    useEditableDraft(selectedOrder);

  const canEdit = isEditing && Boolean(draft);
  const draftOrder = draft as PrintPilotOrder | undefined;
  const orderWorkflowHints = getOrderWorkflowHints(draftOrder);
  const orderRequiredFieldIssues = getOrderRequiredFieldIssues(
    draftOrder ?? selectedOrder,
  );
  const existingDeliveryNoteForSelectedOrder = selectedOrder
    ? deliveryNotes.find((deliveryNote) => deliveryNote.orderId === selectedOrder.id)
    : undefined;
  const existingInvoiceForSelectedOrder = selectedOrder
    ? invoices.find((invoice) => invoice.orderId === selectedOrder.id)
    : undefined;

  const {
    sortedRows: sortedOrderRows,
    sortConfig: orderSortConfig,
    requestSort: handleOrderSort,
    getAriaSort: getOrderSortAriaValue,
  } = useSortableTable<PrintPilotOrder, OrderSortKey>({
    rows: orderRows,
    getSortValue: getOrderSortValue,
  });

  function openApprovalDialogIfNeeded(nextOrder: PrintPilotOrder) {
    if (needsProductionApprovalWarning(nextOrder)) {
      setIsProductionApprovalDialogOpen(true);
      return;
    }

    setIsProductionApprovalDialogOpen(false);
    setIsRequiredFieldsDialogOpen(false);
  }

  function handleTabChange(tab: string) {
    if (isOrderTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
      setIsDetailDrawerOpen(false);
      setIsProductionApprovalDialogOpen(false);
    setIsRequiredFieldsDialogOpen(false);
      setIsRequiredFieldsDialogOpen(false);
      setIsCreateDeliveryNoteDialogOpen(false);
      setIsDuplicateDeliveryNoteDialogOpen(false);
    setIsCreateInvoiceDialogOpen(false);
    setIsDuplicateInvoiceDialogOpen(false);
    }
  }

  function handleOrderSelect(orderId: string) {
    selectItem(orderId);
    setIsEditing(false);
    setIsDetailDrawerOpen(true);
    setIsProductionApprovalDialogOpen(false);
    setIsRequiredFieldsDialogOpen(false);
    setIsCreateDeliveryNoteDialogOpen(false);
    setIsDuplicateDeliveryNoteDialogOpen(false);
    setIsCreateInvoiceDialogOpen(false);
    setIsDuplicateInvoiceDialogOpen(false);
  }

  function handleCloseDetailDrawer() {
    setIsEditing(false);
    setIsDetailDrawerOpen(false);
    setIsProductionApprovalDialogOpen(false);
    setIsRequiredFieldsDialogOpen(false);
    setIsCreateDeliveryNoteDialogOpen(false);
    setIsDuplicateDeliveryNoteDialogOpen(false);
    setIsCreateInvoiceDialogOpen(false);
    setIsDuplicateInvoiceDialogOpen(false);
  }

  function handleResetDraft() {
    resetDraft();
    setIsEditing(false);
    setIsProductionApprovalDialogOpen(false);
    setIsRequiredFieldsDialogOpen(false);
    setIsCreateDeliveryNoteDialogOpen(false);
    setIsDuplicateDeliveryNoteDialogOpen(false);
    setIsCreateInvoiceDialogOpen(false);
    setIsDuplicateInvoiceDialogOpen(false);
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
    const previousHistory = savedOrder.history ?? selectedOrder?.history ?? [];
    const historyEntries = [];

    if (selectedOrder && selectedOrder.status !== savedOrder.status) {
      historyEntries.push(
        createPrintPilotHistoryEntry(
          "Auftrag: Status geändert",
          savedOrder.status,
          selectedOrder.status,
          savedOrder.status,
        ),
      );
    }

    if (selectedOrder && selectedOrder.approval !== savedOrder.approval) {
      historyEntries.push(
        createPrintPilotHistoryEntry(
          "Auftrag: Freigabe geändert",
          savedOrder.approval,
          selectedOrder.approval,
          savedOrder.approval,
        ),
      );
    }

    if (selectedOrder && selectedOrder.handoff !== savedOrder.handoff) {
      historyEntries.push(
        createPrintPilotHistoryEntry(
          "Auftrag: Übergabe geändert",
          savedOrder.handoff,
          selectedOrder.handoff,
          savedOrder.handoff,
        ),
      );
    }

    const documentToSave: PrintPilotOrder =
      historyEntries.length > 0
        ? {
            ...savedOrder,
            history: [...historyEntries, ...previousHistory],
          }
        : savedOrder;

    updateOrder(documentToSave);
    saveDraft(documentToSave);
    setIsEditing(false);
    setIsProductionApprovalDialogOpen(false);
    setIsRequiredFieldsDialogOpen(false);

    if (activeTab !== "Alle Aufträge") {
      setActiveTab("Alle Aufträge");
    }

    window.setTimeout(() => {
      selectItem(documentToSave.id);
      setIsDetailDrawerOpen(true);
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

  function handleOpenPreviewDialog() {
    if (!draft && !selectedOrder) {
      return;
    }

    setIsPreviewDialogOpen(true);
  }

  function handleClosePreviewDialog() {
    setIsPreviewDialogOpen(false);
  }

  function handleOpenCreateDeliveryNoteDialog() {
    if (!selectedOrder) {
      return;
    }

    if (orderRequiredFieldIssues.length > 0) {
      setRequiredFieldsActionLabel("Lieferschein");
      setIsRequiredFieldsDialogOpen(true);
      return;
    }

    if (existingDeliveryNoteForSelectedOrder) {
      setIsDuplicateDeliveryNoteDialogOpen(true);
      return;
    }

    setIsCreateDeliveryNoteDialogOpen(true);
  }

  function handleCancelCreateDeliveryNoteDialog() {
    setIsCreateDeliveryNoteDialogOpen(false);
  }

  function handleCancelDuplicateDeliveryNoteDialog() {
    setIsDuplicateDeliveryNoteDialogOpen(false);
    setIsCreateInvoiceDialogOpen(false);
    setIsDuplicateInvoiceDialogOpen(false);
  }

  function handleCreateDeliveryNoteFromOrder() {
    if (!selectedOrder) {
      setIsCreateDeliveryNoteDialogOpen(false);
      return;
    }

    if (orderRequiredFieldIssues.length > 0) {
      setRequiredFieldsActionLabel("Lieferschein");
      setIsCreateDeliveryNoteDialogOpen(false);
      setIsRequiredFieldsDialogOpen(true);
      return;
    }

    if (existingDeliveryNoteForSelectedOrder) {
      setIsCreateDeliveryNoteDialogOpen(false);
      setIsDuplicateDeliveryNoteDialogOpen(true);
      return;
    }

    const newDeliveryNote = createPrintPilotDeliveryNoteFromOrder(
      selectedOrder,
      settings,
    );
    const linkedDeliveryNote = {
      ...newDeliveryNote,
      history: [
        createPrintPilotHistoryEntry(
          `Erstellt aus Auftrag: ${selectedOrder.number}`,
          newDeliveryNote.status,
        ),
        ...(newDeliveryNote.history ?? []),
      ],
    };
    const updatedOrder: PrintPilotOrder = {
      ...selectedOrder,
      history: [
        createPrintPilotHistoryEntry(
          `Lieferschein erstellt: ${linkedDeliveryNote.number}`,
          selectedOrder.status,
        ),
        ...(selectedOrder.history ?? []),
      ],
    };

    addDeliveryNote(linkedDeliveryNote);
    updateOrder(updatedOrder);
    saveDraft(updatedOrder);
    setIsCreateDeliveryNoteDialogOpen(false);

    window.setTimeout(() => {
      selectItem(updatedOrder.id);
      setIsDetailDrawerOpen(true);
    }, 0);
  }

  function handleOpenCreateInvoiceDialog() {
    if (!selectedOrder) {
      return;
    }

    if (orderRequiredFieldIssues.length > 0) {
      setRequiredFieldsActionLabel("Rechnung");
      setIsRequiredFieldsDialogOpen(true);
      return;
    }

    if (existingInvoiceForSelectedOrder) {
      setIsDuplicateInvoiceDialogOpen(true);
      return;
    }

    setIsCreateInvoiceDialogOpen(true);
  }

  function handleCancelCreateInvoiceDialog() {
    setIsCreateInvoiceDialogOpen(false);
  }

  function handleCancelDuplicateInvoiceDialog() {
    setIsDuplicateInvoiceDialogOpen(false);
  }

  function handleCancelRequiredFieldsDialog() {
    setIsRequiredFieldsDialogOpen(false);
  }

  function handleCreateInvoiceFromOrder() {
    if (!selectedOrder) {
      setIsCreateInvoiceDialogOpen(false);
      return;
    }

    if (orderRequiredFieldIssues.length > 0) {
      setRequiredFieldsActionLabel("Rechnung");
      setIsCreateInvoiceDialogOpen(false);
      setIsRequiredFieldsDialogOpen(true);
      return;
    }

    if (existingInvoiceForSelectedOrder) {
      setIsCreateInvoiceDialogOpen(false);
      setIsDuplicateInvoiceDialogOpen(true);
      return;
    }

    const newInvoice = createPrintPilotInvoiceFromOrder(selectedOrder, settings);
    const linkedInvoice = {
      ...newInvoice,
      history: [
        createPrintPilotHistoryEntry(
          `Erstellt aus Auftrag: ${selectedOrder.number}`,
          newInvoice.status,
        ),
        ...(newInvoice.history ?? []),
      ],
    };
    const updatedOrder: PrintPilotOrder = {
      ...selectedOrder,
      history: [
        createPrintPilotHistoryEntry(
          `Rechnung erstellt: ${linkedInvoice.number}`,
          selectedOrder.status,
        ),
        ...(selectedOrder.history ?? []),
      ],
    };

    addInvoice(linkedInvoice);
    updateOrder(updatedOrder);
    saveDraft(updatedOrder);
    setIsCreateInvoiceDialogOpen(false);

    window.setTimeout(() => {
      selectItem(updatedOrder.id);
      setIsDetailDrawerOpen(true);
    }, 0);
  }

  function handleCancelProductionApprovalDialog() {
    if (selectedOrder) {
      updateDraftField("status", selectedOrder.status);
      updateDraftField("handoff", selectedOrder.handoff);
      updateDraftField("approval", selectedOrder.approval);
    }

    setIsProductionApprovalDialogOpen(false);
    setIsRequiredFieldsDialogOpen(false);
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
                <SortableTableHeader
                    sortKey="number"
                    label={orderSortLabels.number}
                    sortConfig={orderSortConfig}
                    onSort={handleOrderSort}
                  />
                <SortableTableHeader
                    sortKey="customerName"
                    label={orderSortLabels.customerName}
                    sortConfig={orderSortConfig}
                    onSort={handleOrderSort}
                  />
                <SortableTableHeader
                    sortKey="product"
                    label={orderSortLabels.product}
                    sortConfig={orderSortConfig}
                    onSort={handleOrderSort}
                  />
                <SortableTableHeader
                    sortKey="dueDate"
                    label={orderSortLabels.dueDate}
                    sortConfig={orderSortConfig}
                    onSort={handleOrderSort}
                  />
                <SortableTableHeader
                    sortKey="approval"
                    label={orderSortLabels.approval}
                    sortConfig={orderSortConfig}
                    onSort={handleOrderSort}
                  />
                <SortableTableHeader
                    sortKey="status"
                    label={orderSortLabels.status}
                    sortConfig={orderSortConfig}
                    onSort={handleOrderSort}
                  />
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
                    <td style={{ whiteSpace: "nowrap" }}>{formatPrintPilotDateString(order.dueDate, settings.dateFormat)}</td>
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
        accentColor={module.accentColor}
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

            <Button onClick={handleOpenPreviewDialog}>Vorschau prüfen</Button>
            <Button variant="primary" onClick={handleOpenCreateDeliveryNoteDialog}>
              Lieferschein erstellen
            </Button>

            <Button variant="primary" onClick={handleOpenCreateInvoiceDialog}>
              Rechnung erstellen
            </Button>

            <SaveActionButton
              isDirty={isDirty}
              defaultLabel="Auftrag speichern"
              onClick={handleSaveDraft}
            />
          </>
        }
      >
        <WorkflowHints hints={orderWorkflowHints} />

        <DocumentHistory entries={draftOrder?.history ?? selectedOrder?.history} />

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
                  value={draft?.machine ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField("machine", event.target.value)
                  }
                >
                  <option value="">Keine Maschine gewählt</option>

                  {machines.map((machine) => (
                    <option key={machine.id} value={machine.name}>
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

      <DocumentPreviewDialog
        open={isPreviewDialogOpen && Boolean(draft ?? selectedOrder)}
        eyebrow="Auftragsvorschau"
        title={(draft as PrintPilotOrder | undefined)?.number ?? selectedOrder?.number ?? "Auftrag"}
        subtitle={
          (draft as PrintPilotOrder | undefined)?.customerName ??
          selectedOrder?.customerName ??
          "Kein Kunde hinterlegt"
        }
        fields={[
          {
            label: "Kunde",
            value:
              (draft as PrintPilotOrder | undefined)?.customerName ??
              selectedOrder?.customerName,
          },
          {
            label: "Produkt",
            value:
              (draft as PrintPilotOrder | undefined)?.product ??
              selectedOrder?.product,
          },
          {
            label: "Status",
            value:
              (draft as PrintPilotOrder | undefined)?.status ??
              selectedOrder?.status,
          },
          {
            label: "Fällig am",
            value:
              (draft as PrintPilotOrder | undefined)?.dueDate ??
              selectedOrder?.dueDate,
          },
          {
            label: "Maschine",
            value:
              (draft as PrintPilotOrder | undefined)?.machine ??
              selectedOrder?.machine,
          },
          {
            label: "Priorität",
            value:
              (draft as PrintPilotOrder | undefined)?.priority ??
              selectedOrder?.priority,
          },
          {
            label: "Übergabe",
            value:
              (draft as PrintPilotOrder | undefined)?.handoff ??
              selectedOrder?.handoff,
          },
          {
            label: "Freigabe",
            value:
              (draft as PrintPilotOrder | undefined)?.approval ??
              selectedOrder?.approval,
          },
        ]}
        onClose={handleClosePreviewDialog}
      />

      <ConfirmDialog
        open={isRequiredFieldsDialogOpen && Boolean(selectedOrder)}
        title={`${requiredFieldsActionLabel} kann nicht erstellt werden`}
        description={
          <>
            Dieser Folgebeleg kann noch nicht erzeugt werden, weil
            Pflichtangaben im Auftrag fehlen.
          </>
        }
        details={
          <>
            {orderRequiredFieldIssues.map((issue) => (
              <span key={issue}>
                <strong>Fehlt:</strong> {issue}
              </span>
            ))}
          </>
        }
        variant="warning"
        cancelLabel="Schließen"
        confirmLabel="Verstanden"
        onCancel={handleCancelRequiredFieldsDialog}
        onConfirm={handleCancelRequiredFieldsDialog}
      />

      <ConfirmDialog
        open={isCreateDeliveryNoteDialogOpen && Boolean(selectedOrder)}
        title="Lieferschein aus Auftrag erstellen?"
        description={
          <>
            Aus dem ausgewählten Auftrag wird ein neuer Lieferschein erzeugt.
            Der Lieferschein wird eindeutig mit dem Auftrag verknüpft.
          </>
        }
        details={
          selectedOrder ? (
            <>
              <span>
                <strong>Auftrag:</strong> {selectedOrder.number}
              </span>
              <span>
                <strong>Kunde:</strong> {selectedOrder.customerName}
              </span>
              <span>
                <strong>Produkt:</strong> {selectedOrder.product}
              </span>
              <span>
                <strong>Status neuer Lieferschein:</strong> Entwurf
              </span>
            </>
          ) : null
        }
        variant="default"
        cancelLabel="Abbrechen"
        confirmLabel="Lieferschein erstellen"
        onCancel={handleCancelCreateDeliveryNoteDialog}
        onConfirm={handleCreateDeliveryNoteFromOrder}
      />

      <ConfirmDialog
        open={isDuplicateDeliveryNoteDialogOpen && Boolean(selectedOrder)}
        title="Lieferschein existiert bereits"
        description={
          <>
            Für diesen Auftrag existiert bereits ein Lieferschein. Es wird kein
            weiterer Lieferschein erzeugt, damit keine Dublette entsteht.
          </>
        }
        details={
          selectedOrder ? (
            <>
              <span>
                <strong>Auftrag:</strong> {selectedOrder.number}
              </span>
              <span>
                <strong>Kunde:</strong> {selectedOrder.customerName}
              </span>
              {existingDeliveryNoteForSelectedOrder && (
                <span>
                  <strong>Vorhandener Lieferschein:</strong>{" "}
                  {existingDeliveryNoteForSelectedOrder.number}
                </span>
              )}
            </>
          ) : null
        }
        variant="warning"
        cancelLabel="Schließen"
        confirmLabel="Verstanden"
        onCancel={handleCancelDuplicateDeliveryNoteDialog}
        onConfirm={handleCancelDuplicateDeliveryNoteDialog}
      />

      <ConfirmDialog
        open={isCreateInvoiceDialogOpen && Boolean(selectedOrder)}
        title="Rechnung aus Auftrag erstellen?"
        description={
          <>
            Aus dem ausgewählten Auftrag wird eine neue Rechnung erzeugt. Die
            Rechnung wird eindeutig mit dem Auftrag verknüpft.
          </>
        }
        details={
          selectedOrder ? (
            <>
              <span>
                <strong>Auftrag:</strong> {selectedOrder.number}
              </span>
              <span>
                <strong>Kunde:</strong> {selectedOrder.customerName}
              </span>
              <span>
                <strong>Produkt:</strong> {selectedOrder.product}
              </span>
              <span>
                <strong>Status neue Rechnung:</strong> Entwurf
              </span>
            </>
          ) : null
        }
        variant="default"
        cancelLabel="Abbrechen"
        confirmLabel="Rechnung erstellen"
        onCancel={handleCancelCreateInvoiceDialog}
        onConfirm={handleCreateInvoiceFromOrder}
      />

      <ConfirmDialog
        open={isDuplicateInvoiceDialogOpen && Boolean(selectedOrder)}
        title="Rechnung existiert bereits"
        description={
          <>
            Für diesen Auftrag existiert bereits eine Rechnung. Es wird keine
            weitere Rechnung erzeugt, damit keine Dublette entsteht.
          </>
        }
        details={
          selectedOrder ? (
            <>
              <span>
                <strong>Auftrag:</strong> {selectedOrder.number}
              </span>
              <span>
                <strong>Kunde:</strong> {selectedOrder.customerName}
              </span>
              {existingInvoiceForSelectedOrder && (
                <span>
                  <strong>Vorhandene Rechnung:</strong>{" "}
                  {existingInvoiceForSelectedOrder.number}
                </span>
              )}
            </>
          ) : null
        }
        variant="warning"
        cancelLabel="Schließen"
        confirmLabel="Verstanden"
        onCancel={handleCancelDuplicateInvoiceDialog}
        onConfirm={handleCancelDuplicateInvoiceDialog}
      />

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
