import { useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";
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

const orderRowsByTab = {
  Liste: [
    {
      id: "order-au-2026-001",
      number: "AU-2026-001",
      customer: "Sonnendruck GmbH",
      product: "Broschüre A4",
      status: "Vorbereitung",
      badgeVariant: "success" as const,
    },
    {
      id: "order-au-2026-002",
      number: "AU-2026-002",
      customer: "Musterkunde GmbH",
      product: "Flyer A5",
      status: "Produktion",
      badgeVariant: undefined,
    },
    {
      id: "order-au-2026-003",
      number: "AU-2026-003",
      customer: "Beispiel AG",
      product: "Folder DIN lang",
      status: "Offen",
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
      badgeVariant: "success" as const,
    },
  ],
  Produktion: [
    {
      id: "order-au-2026-002",
      number: "AU-2026-002",
      customer: "Musterkunde GmbH",
      product: "Flyer A5",
      status: "Produktion",
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
      badgeVariant: "success" as const,
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

  const [activeTab, setActiveTab] = useState<OrderTab>("Liste");
  const [selectedId, setSelectedId] = useState(
    orderRowsByTab.Liste[0]?.id ?? "",
  );

  const orderRows = orderRowsByTab[activeTab];
  const selectedOrder =
    orderRows.find((order) => order.id === selectedId) ?? orderRows[0];

  function handleTabChange(tab: string) {
    if (isOrderTab(tab)) {
      const nextRows = orderRowsByTab[tab];

      setActiveTab(tab);
      setSelectedId(nextRows[0]?.id ?? "");
    }
  }

  function handleOrderSelect(orderId: string) {
    setSelectedId(orderId);
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
                <Input value={selectedOrder?.number ?? ""} readOnly />
              </Field>

              <Field label="Kunde">
                <Input value={selectedOrder?.customer ?? ""} readOnly />
              </Field>

              <Field label="Produkt">
                <Input value={selectedOrder?.product ?? ""} readOnly />
              </Field>

              <Field label="Status">
                <Select value={activeTab} onChange={(event) => handleTabChange(event.target.value)}>
                  {orderTabs.map((tab) => (
                    <option key={tab}>{tab}</option>
                  ))}
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Produktion</SectionHeader>

            <FieldGrid>
              <Field label="Maschine">
                <Select defaultValue="">
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
                <Select defaultValue="Normal">
                  <option>Niedrig</option>
                  <option>Normal</option>
                  <option>Hoch</option>
                  <option>Eilt</option>
                </Select>
              </Field>

              <Field label="Übergabe">
                <Select defaultValue="">
                  <option value="" disabled>
                    Status wählen
                  </option>
                  <option>Fehlt</option>
                  <option>Prüfen</option>
                  <option>Freigegeben</option>
                </Select>
              </Field>

              <Field label="Freigabe">
                <Select defaultValue="">
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
              <Button>Entwurf speichern</Button>
              <Button variant="primary">Auftrag vorbereiten</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
