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

function getProductionApprovalWarning(order: PrintPilotOrder) {
  return [
    "WARNUNG: Auftrag ohne gültige Freigabe.",
    "",
    `Auftrag: ${order.number}`,
    `Produkt: ${order.product}`,
    `Freigabe: ${order.approval}`,
    "",
    "Bitte Warnung in der Maske bestätigen, bevor gespeichert wird.",
  ].join("\n");
}

export function OrdersPage() {
  const module = getModuleConfig("orders");
  const { machines, orders, updateOrder } = usePrintPilotStore();

  const [isEditing, setIsEditing] = useState(false);
  const [productionOverrideConfirmed, setProductionOverrideConfirmed] =
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
  const requiresProductionApprovalWarning =
    Boolean(draftOrder) &&
    needsProductionApprovalWarning(
      draftOrder?.status ?? "Neu",
      draftOrder?.approval ?? "Freigabe ausstehend",
    ) &&
    !productionOverrideConfirmed;

  function handleTabChange(tab: string) {
    if (isOrderTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
      setProductionOverrideConfirmed(false);
    }
  }

  function handleOrderSelect(orderId: string) {
    selectItem(orderId);
    setIsEditing(false);

      setProductionOverrideConfirmed(false);
  }

  function handleResetDraft() {
    resetDraft();
    setIsEditing(false);

      setProductionOverrideConfirmed(false);
  }

  function handleToggleEditing() {
    setIsEditing((currentValue) => !currentValue);
  }

  function handleStatusChange(nextStatus: PrintPilotOrderStatus) {
    if (!draft) {
      return;
    }

    const currentDraft = draft as PrintPilotOrder;

    if (needsProductionApprovalWarning(nextStatus, currentDraft.approval)) {
      setPendingProductionStatus(nextStatus);
      return;
    }


      setProductionOverrideConfirmed(false);
    updateDraftField("status", nextStatus);
  }

  function handleConfirmProductionStatus() {
    if (!draft) {
      return;
    }

    const savedOrder: PrintPilotOrder = {
      ...(draft as PrintPilotOrder),
      status: "In Produktion",
    };

    updateOrder(savedOrder);
    saveDraft(savedOrder);
    setIsEditing(false);
    setProductionOverrideConfirmed(false);

    if (activeTab !== "Alle Aufträge") {
      setActiveTab("Alle Aufträge");
    }

    window.setTimeout(() => {
      selectItem(savedOrder.id);
    }, 0);
  }

  function handleCancelProductionStatus() {

      setProductionOverrideConfirmed(false);
  }

  function handleSaveDraft() {
    if (!draft) {
      return;
    }

    const savedOrder = draft as PrintPilotOrder;

    if (
      needsProductionApprovalWarning(savedOrder.status, savedOrder.approval) &&
      !productionOverrideConfirmed
    ) {
      window.alert(getProductionApprovalWarning(savedOrder));
      return;
    }

    updateOrder(savedOrder);
    saveDraft(savedOrder);
    setIsEditing(false);
    setProductionOverrideConfirmed(false);

    if (activeTab !== "Alle Aufträge") {
      setActiveTab("Alle Aufträge");
    }

    window.setTimeout(() => {
      selectItem(savedOrder.id);
    }, 0);
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
                        <Badge variant={getPrintPilotApprovalBadgeVariant(order.approval)}>
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
                    handleStatusChange(event.currentTarget.value as PrintPilotOrderStatus)
                  }
                  onInput={(event) =>
                    handleStatusChange(event.currentTarget.value as PrintPilotOrderStatus)
                  }
                >
                  {orderTabs.map((tab) => (
                    <option key={tab}>{tab}</option>
                  ))}
                </Select>
              </Field>

              {requiresProductionApprovalWarning && draftOrder && (
                <div
                  style={{
                    background: "rgba(220, 38, 38, 0.1)",
                    border: "1px solid rgba(220, 38, 38, 0.35)",
                    borderRadius: "1rem",
                    color: "rgb(153, 27, 27)",
                    display: "grid",
                    gap: "0.65rem",
                    gridColumn: "1 / -1",
                    padding: "1rem",
                  }}
                >
                  <strong>Freigabe fehlt: Produktion ist blockiert</strong>

                  <span>
                    Status ist <strong>In Produktion</strong>, aber Freigabe ist{" "}
                    <strong>{draftOrder.approval}</strong>.
                  </span>

                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <Button onClick={handleCancelProductionStatus}>
                      Status zurücksetzen
                    </Button>

                    <Button
                      variant="primary"
                      onClick={handleConfirmProductionStatus}
                    >
                      Trotz Warnung speichern
                    </Button>
                  </div>
                </div>
              )}

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
    </div>
  );
}
