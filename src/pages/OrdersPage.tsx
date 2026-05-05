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

const orderTabs = ["Liste", "Vorbereitung", "Produktion", "Abgeschlossen"] as const;

type OrderTab = (typeof orderTabs)[number];

type OrderRow = {
  id: string;
  number: string;
  customer: string;
  product: string;
  status: string;
  machine: string;
  priority: string;
  handoff: string;
  approval: string;
  dueDate: string;
  badgeVariant?: "success";
};

const orderRowsByTab: Record<OrderTab, OrderRow[]> = {
  Liste: [
    {
      id: "order-au-2026-001",
      number: "AU-2026-001",
      customer: "Sonnendruck GmbH",
      product: "Broschüre A4",
      status: "Vorbereitung",
      machine: "Xerox Iridesse",
      priority: "Normal",
      handoff: "Prüfen",
      approval: "Ausstehend",
      dueDate: "2026-05-12",
      badgeVariant: "success",
    },
    {
      id: "order-au-2026-002",
      number: "AU-2026-002",
      customer: "Musterkunde GmbH",
      product: "Flyer A5",
      status: "Produktion",
      machine: "Xerox Iridesse",
      priority: "Hoch",
      handoff: "Freigegeben",
      approval: "Erteilt",
      dueDate: "2026-05-09",
      badgeVariant: undefined,
    },
    {
      id: "order-au-2026-003",
      number: "AU-2026-003",
      customer: "Beispiel AG",
      product: "Folder DIN lang",
      status: "Offen",
      machine: "Canon VP140",
      priority: "Normal",
      handoff: "Fehlt",
      approval: "Ausstehend",
      dueDate: "2026-05-15",
      badgeVariant: undefined,
    },
  ],
  Vorbereitung: [
    {
      id: "order-au-2026-001",
      number: "AU-2026-001",
      customer: "Sonnendruck GmbH",
      product: "Broschüre A4",
      status: "Vorbereitung",
      machine: "Xerox Iridesse",
      priority: "Normal",
      handoff: "Prüfen",
      approval: "Ausstehend",
      dueDate: "2026-05-12",
      badgeVariant: "success",
    },
  ],
  Produktion: [
    {
      id: "order-au-2026-002",
      number: "AU-2026-002",
      customer: "Musterkunde GmbH",
      product: "Flyer A5",
      status: "Produktion",
      machine: "Xerox Iridesse",
      priority: "Hoch",
      handoff: "Freigegeben",
      approval: "Erteilt",
      dueDate: "2026-05-09",
      badgeVariant: undefined,
    },
  ],
  Abgeschlossen: [
    {
      id: "order-au-2026-008",
      number: "AU-2026-008",
      customer: "Druckpartner Süd",
      product: "Plakat A2",
      status: "Abgeschlossen",
      machine: "Roland TrueVis VG3 540",
      priority: "Normal",
      handoff: "Freigegeben",
      approval: "Erteilt",
      dueDate: "2026-04-30",
      badgeVariant: "success",
    },
  ],
};

function getOrderTitle(tab: OrderTab) {
  switch (tab) {
    case "Liste":
      return "Auftrag vorbereiten";
    case "Vorbereitung":
      return "Auftrag in Vorbereitung";
    case "Produktion":
      return "Auftrag in Produktion";
    case "Abgeschlossen":
      return "Abgeschlossener Auftrag";
  }
}

function getOrderStatus(tab: OrderTab) {
  if (tab === "Liste") {
    return "In Vorbereitung";
  }

  return tab;
}

function isOrderTab(tab: string): tab is OrderTab {
  return orderTabs.includes(tab as OrderTab);
}

export function OrdersPage() {
  const module = getModuleConfig("orders");

  const [isEditing, setIsEditing] = useState(false);

  const {
    activeTab,
    rows: orderRows,
    selectedItem: selectedOrder,
    setActiveTab,
    selectItem,
  } = useMasterDetailSelection({
    rowsByTab: orderRowsByTab,
    initialTab: "Liste",
  });

  const { draft, updateDraftField, resetDraft } = useEditableDraft(selectedOrder);

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
          kicker="Auftragsmaske"
          title={getOrderTitle(activeTab)}
          statusValue={getOrderStatus(activeTab)}
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
                      <td>{order.customer}</td>
                      <td>{order.product}</td>
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
                <Input value={draft?.customer ?? ""} readOnly />
              </Field>

              <Field label="Produkt">
                <Input
                  value={draft?.product ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("product", event.target.value)
                  }
                />
              </Field>

              <Field label="Liefertermin">
                <Input
                  type="date"
                  value={draft?.dueDate ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("dueDate", event.target.value)
                  }
                />
              </Field>

              <Field label="Status">
                <Select
                  value={activeTab}
                  disabled={!isEditing}
                  onChange={(event) => handleTabChange(event.target.value)}
                >
                  {orderTabs.map((tab) => (
                    <option key={tab}>{tab}</option>
                  ))}
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Produktion</SectionHeader>

            <FieldGrid>
              <Field label="Maschine">
                <Select
                  value={draft?.machine ?? ""}
                  onChange={(event) =>
                    updateDraftField("machine", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Maschine wählen
                  </option>
                  <option>Xerox Iridesse</option>
                  <option>Xerox Nuvera</option>
                  <option>Canon VP140</option>
                  <option>Roland TrueVis VG3 540</option>
                </Select>
              </Field>

              <Field label="Priorität">
                <Select
                  value={draft?.priority ?? ""}
                  disabled={!isEditing}
                  onChange={(event) =>
                    updateDraftField("priority", event.target.value)
                  }
                >
                  <option>Niedrig</option>
                  <option>Normal</option>
                  <option>Hoch</option>
                  <option>Eilt</option>
                </Select>
              </Field>

              <Field label="Übergabe">
                <Select
                  value={draft?.handoff ?? ""}
                  onChange={(event) =>
                    updateDraftField("handoff", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Status wählen
                  </option>
                  <option>Fehlt</option>
                  <option>Prüfen</option>
                  <option>Freigegeben</option>
                </Select>
              </Field>

              <Field label="Freigabe">
                <Select
                  value={draft?.approval ?? ""}
                  onChange={(event) =>
                    updateDraftField("approval", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Freigabe wählen
                  </option>
                  <option>Ausstehend</option>
                  <option>Erteilt</option>
                  <option>Korrektur erforderlich</option>
                </Select>
              </Field>
            </FieldGrid>

            <div className="calculation-footer">
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
              <Button variant="primary">Auftrag vorbereiten</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
