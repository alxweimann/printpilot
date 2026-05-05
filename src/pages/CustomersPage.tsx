import { getModuleConfig } from "../app/moduleConfig";
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

const customerTabs = ["Liste", "Aktiv", "Entwurf", "Gesperrt"] as const;

type CustomerTab = (typeof customerTabs)[number];

const customerRowsByTab = {
  Liste: [
    {
      id: "customer-sonnendruck",
      number: "KD-0001",
      name: "Sonnendruck GmbH",
      city: "Wiesloch",
      phone: "—",
      status: "Aktiv",
      badgeVariant: "success" as const,
    },
    {
      id: "customer-musterkunde",
      number: "KD-0002",
      name: "Musterkunde GmbH",
      city: "Heidelberg",
      phone: "—",
      status: "Entwurf",
      badgeVariant: undefined,
    },
    {
      id: "customer-beispiel-ag",
      number: "KD-0003",
      name: "Beispiel AG",
      city: "Mannheim",
      phone: "—",
      status: "Aktiv",
      badgeVariant: undefined,
    },
  ],
  Aktiv: [
    {
      id: "customer-sonnendruck",
      number: "KD-0001",
      name: "Sonnendruck GmbH",
      city: "Wiesloch",
      phone: "—",
      status: "Aktiv",
      badgeVariant: "success" as const,
    },
    {
      id: "customer-beispiel-ag",
      number: "KD-0003",
      name: "Beispiel AG",
      city: "Mannheim",
      phone: "—",
      status: "Aktiv",
      badgeVariant: undefined,
    },
  ],
  Entwurf: [
    {
      id: "customer-musterkunde",
      number: "KD-0002",
      name: "Musterkunde GmbH",
      city: "Heidelberg",
      phone: "—",
      status: "Entwurf",
      badgeVariant: undefined,
    },
  ],
  Gesperrt: [
    {
      id: "customer-testkunde",
      number: "KD-0004",
      name: "Testkunde KG",
      city: "Karlsruhe",
      phone: "—",
      status: "Gesperrt",
      badgeVariant: undefined,
    },
  ],
};

function getCustomerTitle(tab: CustomerTab) {
  switch (tab) {
    case "Liste":
      return "Kundendaten bearbeiten";
    case "Aktiv":
      return "Aktiven Kunden bearbeiten";
    case "Entwurf":
      return "Kundenentwurf bearbeiten";
    case "Gesperrt":
      return "Gesperrten Kunden prüfen";
  }
}

function getCustomerStatus(tab: CustomerTab) {
  if (tab === "Liste") {
    return "Aktiv";
  }

  return tab;
}

function isCustomerTab(tab: string): tab is CustomerTab {
  return customerTabs.includes(tab as CustomerTab);
}

export function CustomersPage() {
  const module = getModuleConfig("customers");

  const {
    activeTab,
    rows: customerRows,
    selectedItem: selectedCustomer,
    setActiveTab,
    selectItem,
  } = useMasterDetailSelection({
    rowsByTab: customerRowsByTab,
    initialTab: "Liste",
  });

  function handleTabChange(tab: string) {
    if (isCustomerTab(tab)) {
      setActiveTab(tab);
    }
  }

  function handleCustomerSelect(customerId: string) {
    selectItem(customerId);
  }

  return (
    <div className="page">
      <PageHeader
        title={module.title}
        description={module.description}
        actionLabel={module.actionLabel}
      />

      <PageTabs
        tabs={[...customerTabs]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="Kundenmaske"
          title={getCustomerTitle(activeTab)}
          statusValue={getCustomerStatus(activeTab)}
        />

        <div className="master-detail-layout">
          <section className="workspace-panel master-list-panel">
            <TableToolbar>
              <Input className="search-input" placeholder="Kunden suchen..." />
              <Button>Filter</Button>
            </TableToolbar>

            <DataTable>
              <thead>
                <tr>
                  <th>Kunde</th>
                  <th>Ort</th>
                  <th>Telefon</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {customerRows.map((customer) => {
                  const isSelected = customer.id === selectedCustomer?.id;

                  return (
                    <tr
                      key={customer.id}
                      className={
                        isSelected ? "data-table-row-selected" : undefined
                      }
                      onClick={() => handleCustomerSelect(customer.id)}
                    >
                      <td>{customer.name}</td>
                      <td>{customer.city}</td>
                      <td>{customer.phone}</td>
                      <td>
                        <Badge variant={customer.badgeVariant}>
                          {customer.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel master-editor-panel">
            <SectionHeader>Kundendaten</SectionHeader>

            <FieldGrid>
              <Field label="Kundennummer">
                <Input value={selectedCustomer?.number ?? ""} readOnly />
              </Field>

              <Field label="Firma">
                <Input value={selectedCustomer?.name ?? ""} readOnly />
              </Field>

              <Field label="Kundentyp">
                <Select defaultValue="">
                  <option value="" disabled>
                    Kundentyp wählen
                  </option>
                  <option>Geschäftskunde</option>
                  <option>Privatkunde</option>
                  <option>Wiederverkäufer</option>
                  <option>Interner Kunde</option>
                </Select>
              </Field>

              <Field label="Straße">
                <Input placeholder="Straße und Hausnummer" />
              </Field>

              <Field label="PLZ">
                <Input inputMode="numeric" placeholder="z. B. 69168" />
              </Field>

              <Field label="Ort">
                <Input value={selectedCustomer?.city ?? ""} readOnly />
              </Field>
            </FieldGrid>

            <SectionHeader>Kontakt</SectionHeader>

            <FieldGrid>
              <Field label="Ansprechpartner">
                <Input placeholder="Name" />
              </Field>

              <Field label="Telefon">
                <Input value={selectedCustomer?.phone ?? ""} readOnly />
              </Field>

              <Field label="E-Mail">
                <Input type="email" placeholder="mail@example.de" />
              </Field>
            </FieldGrid>

            <SectionHeader>Konditionen</SectionHeader>

            <FieldGrid>
              <Field label="Zahlungsziel">
                <Select defaultValue="">
                  <option value="" disabled>
                    Zahlungsziel wählen
                  </option>
                  <option>Sofort ohne Abzug</option>
                  <option>14 Tage netto</option>
                  <option>30 Tage netto</option>
                </Select>
              </Field>

              <Field label="Preisstufe">
                <Select defaultValue="">
                  <option value="" disabled>
                    Preisstufe wählen
                  </option>
                  <option>Standard</option>
                  <option>Stammkunde</option>
                  <option>Sonderkondition</option>
                </Select>
              </Field>

              <Field label="Status">
                <Select value={activeTab} onChange={(event) => handleTabChange(event.target.value)}>
                  {customerTabs.map((tab) => (
                    <option key={tab}>{tab}</option>
                  ))}
                </Select>
              </Field>
            </FieldGrid>

            <div className="calculation-footer">
              <Button>Änderungen verwerfen</Button>
              <Button variant="primary">Kunde speichern</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
