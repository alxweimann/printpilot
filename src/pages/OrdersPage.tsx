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

function needsProductionApprovalWarning(
  nextStatus: PrintPilotOrderStatus,
  approval: PrintPilotApprovalStatus,
) {
  return (
    nextStatus === "In Produktion" &&
    approval !== "Freigabe erteilt" &&
    approval !== "Nicht erforderlich"
  );
}

export function OrdersPage() {
  const module = getModuleConfig("orders");
  const { machines, orders, updateOrder } = usePrintPilotStore();

  const [isEditing, setIsEditing] = useState(false);
  const [productionOverrideRequested, setProductionOverrideRequested] =
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
  const shouldShowProductionApprovalModal =
    productionOverrideRequested && Boolean(draftOrder);

  function handleTabChange(tab: string) {
    if (isOrderTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
      setProductionOverrideRequested(false);
    }
  }

  function handleOrderSelect(orderId: string) {
    selectItem(orderId);
    setIsEditing(false);
    setProductionOverrideRequested(false);
  }

  function handleResetDraft() {
    resetDraft();
    setIsEditing(false);
    setProductionOverrideRequested(false);
  }

  function handleToggleEditing() {
    setIsEditing((currentValue) => !currentValue);
  }

  function handleStatusChange(nextStatus: PrintPilotOrderStatus) {
    updateDraftField("status", nextStatus);

    if (!draftOrder) {
      return;
    }

    if (needsProductionApprovalWarning(nextStatus, draftOrder.approval)) {
      setProductionOverrideRequested(true);
      return;
    }

    setProductionOverrideRequested(false);
  }

  function saveOrder(savedOrder: PrintPilotOrder) {
    updateOrder(savedOrder);
    saveDraft(savedOrder);
    setIsEditing(false);
    setProductionOverrideRequested(false);

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

    if (
      needsProductionApprovalWarning(savedOrder.status, savedOrder.approval)
    ) {
      setProductionOverrideRequested(true);
      return;
    }

    saveOrder(savedOrder);
  }

  function handleCancelProductionStatus() {
    if (selectedOrder) {
      updateDraftField("status", selectedOrder.status);
    }

    setProductionOverrideRequested(false);
  }

  function handleConfirmProductionStatus() {
    if (!draft) {
      return;
    }

    const savedOrder: PrintPilotOrder = {
      ...(draft as PrintPilotOrder),
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

        <div className="master-detail-layout">
          <section className="workspace-panel master-list-panel">
            <TableToolbar>
              <Input className="search-input" placeholder="Aufträge suchen..." />

              <Button>Filter</Button>
            </TableToolbar>

            <DataTable>
              <thead>
                <tr>
                  <th>Auftrag</th>
                  <th>Kunde</th>
                  <th>Produkt</th>
                  <th>Fällig</th>
                  <th>Freigabe</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {orderRows.map((order) => {
                  const isSelected = order.id === selectedOrder?.id;

                  return (
                    <tr
                      key={order.id}
                      className={
                        isSelected ? "data-table-row-selected" : undefined
                      }
                      onClick={() => handleOrderSelect(order.id)}
                    >
                      <td>{order.number}</td>
                      <td>{order.customerName}</td>
                      <td>{order.product}</td>
                      <td>{order.dueDate}</td>
                      <td>
                        <Badge
                          variant={getPrintPilotApprovalBadgeVariant(
                            order.approval,
                          )}
                        >
                          {order.approval}
                        </Badge>
                      </td>
                      <td>
                        <Badge variant={order.badgeVariant}>
                          {order.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel master-editor-panel">
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

              <Field label="Übergabe">
                <Select
                  value={draft?.handoff ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField(
                      "handoff",
                      event.target.value as PrintPilotHandoffStatus,
                    )
                  }
                >
                  {handoffOptions.map((handoff) => (
                    <option key={handoff}>{handoff}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Freigabe">
                <Select
                  value={draft?.approval ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField(
                      "approval",
                      event.target.value as PrintPilotApprovalStatus,
                    )
                  }
                >
                  {approvalOptions.map((approval) => (
                    <option key={approval}>{approval}</option>
                  ))}
                </Select>
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
                defaultLabel="Auftrag speichern"
                onClick={handleSaveDraft}
              />
            </div>
          </section>
        </div>
      </section>

      {shouldShowProductionApprovalModal && draftOrder && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="production-approval-modal-title"
          style={{
            alignItems: "center",
            background: "rgba(15, 23, 42, 0.42)",
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            left: 0,
            padding: "1.5rem",
            position: "fixed",
            right: 0,
            top: 0,
            zIndex: 80,
          }}
        >
          <div
            style={{
              background: "white",
              border: "1px solid rgba(220, 38, 38, 0.22)",
              borderRadius: "1.25rem",
              boxShadow: "0 24px 60px rgba(15, 23, 42, 0.22)",
              display: "grid",
              gap: "1rem",
              maxWidth: "34rem",
              padding: "1.25rem",
              width: "100%",
            }}
          >
            <div style={{ display: "grid", gap: "0.35rem" }}>
              <strong
                id="production-approval-modal-title"
                style={{
                  color: "rgb(153, 27, 27)",
                  fontSize: "1.05rem",
                }}
              >
                Auftrag ohne gültige Freigabe
              </strong>

              <span style={{ color: "rgb(71, 85, 105)", lineHeight: 1.5 }}>
                Der Auftrag soll auf <strong>In Produktion</strong> gesetzt
                werden, obwohl die Freigabe aktuell{" "}
                <strong>{draftOrder.approval}</strong> ist.
              </span>
            </div>

            <div
              style={{
                background: "rgba(220, 38, 38, 0.08)",
                border: "1px solid rgba(220, 38, 38, 0.18)",
                borderRadius: "0.9rem",
                color: "rgb(127, 29, 29)",
                display: "grid",
                gap: "0.25rem",
                padding: "0.85rem",
              }}
            >
              <span>
                <strong>Auftrag:</strong> {draftOrder.number}
              </span>
              <span>
                <strong>Produkt:</strong> {draftOrder.product}
              </span>
              <span>
                <strong>Kunde:</strong> {draftOrder.customerName}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "flex-end",
              }}
            >
              <Button onClick={handleCancelProductionStatus}>Abbrechen</Button>

              <Button variant="primary" onClick={handleConfirmProductionStatus}>
                Trotzdem speichern
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
