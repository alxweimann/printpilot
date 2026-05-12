import { useMemo, useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";
import {
  type PrintPilotOrder,
  type PrintPilotOrderStatus,
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

const orderTabs = ["Neu", "In Produktion", "Wartet", "Fertig", "Archiv"] as const;

type OrderTab = PrintPilotOrderStatus;

function getOrderTitle(tab: OrderTab) {
  switch (tab) {
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

export function OrdersPage() {
  const module = getModuleConfig("orders");
  const { orders, updateOrder } = usePrintPilotStore();

  const [isEditing, setIsEditing] = useState(false);

  const orderRowsByTab = useMemo(() => {
    return groupPrintPilotOrdersByStatus(orders);
  }, [orders]);

  const {
    activeTab,
    rows: orderRows,
    selectedItem: selectedOrder,
    setActiveTab,
    selectItem,
  } = useMasterDetailSelection({
    rowsByTab: orderRowsByTab,
    initialTab: "Neu",
  });

  const { draft, isDirty, updateDraftField, resetDraft, saveDraft } =
    useEditableDraft(selectedOrder);

  const canEdit = isEditing && Boolean(draft);

  function handleTabChange(tab: string) {
    if (isOrderTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
    }
  }

  function handleOrderSelect(orderId: string) {
    selectItem(orderId);
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

    const savedOrder = draft as PrintPilotOrder;

    updateOrder(savedOrder);
    saveDraft(savedOrder);
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
                    updateDraftField(
                      "status",
                      event.target.value as PrintPilotOrderStatus,
                    )
                  }
                >
                  {orderTabs.map((tab) => (
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
                <Input
                  value={draft?.machine ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("machine", event.target.value)
                  }
                />
              </Field>

              <Field label="Priorität">
                <Select
                  value={draft?.priority ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField("priority", event.target.value)
                  }
                >
                  <option>Niedrig</option>
                  <option>Normal</option>
                  <option>Hoch</option>
                  <option>Express</option>
                </Select>
              </Field>

              <Field label="Übergabe">
                <Input
                  value={draft?.handoff ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("handoff", event.target.value)
                  }
                />
              </Field>

              <Field label="Freigabe">
                <Input
                  value={draft?.approval ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("approval", event.target.value)
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
