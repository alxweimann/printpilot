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

const customerTabs = ["Liste", "Aktiv", "Entwurf", "Gesperrt"] as const;

type CustomerTab = (typeof customerTabs)[number];

type CustomerRow = {
  id: string;
  number: string;
  name: string;
  type: string;
  street: string;
  zip: string;
  city: string;
  contact: string;
  phone: string;
  email: string;
  paymentTerm: string;
  priceLevel: string;
  status: string;
  badgeVariant?: "success";
};

const customerRowsByTab: Record<CustomerTab, CustomerRow[]> = {
  Liste: [
    {
      id: "customer-sonnendruck",
      number: "KD-0001",
      name: "Sonnendruck GmbH",
      type: "Geschäftskunde",
      street: "Musterstraße 1",
      zip: "69168",
      city: "Wiesloch",
      contact: "Alex Weimann",
      phone: "06222 / 000000",
      email: "info@sonnendruck.de",
      paymentTerm: "14 Tage netto",
      priceLevel: "Stammkunde",
      status: "Aktiv",
      badgeVariant: "success",
    },
    {
      id: "customer-musterkunde",
      number: "KD-0002",
      name: "Musterkunde GmbH",
      type: "Geschäftskunde",
      street: "Beispielweg 12",
      zip: "69115",
      city: "Heidelberg",
      contact: "Max Mustermann",
      phone: "06221 / 123456",
      email: "info@musterkunde.de",
      paymentTerm: "30 Tage netto",
      priceLevel: "Standard",
      status: "Entwurf",
      badgeVariant: undefined,
    },
    {
      id: "customer-beispiel-ag",
      number: "KD-0003",
      name: "Beispiel AG",
      type: "Wiederverkäufer",
      street: "Industriestraße 8",
      zip: "68159",
      city: "Mannheim",
      contact: "Sabine Beispiel",
      phone: "0621 / 555000",
      email: "einkauf@beispiel-ag.de",
      paymentTerm: "14 Tage netto",
      priceLevel: "Sonderkondition",
      status: "Aktiv",
      badgeVariant: undefined,
    },
  ],
  Aktiv: [
    {
      id: "customer-sonnendruck",
      number: "KD-0001",
      name: "Sonnendruck GmbH",
      type: "Geschäftskunde",
      street: "Musterstraße 1",
      zip: "69168",
      city: "Wiesloch",
      contact: "Alex Weimann",
      phone: "06222 / 000000",
      email: "info@sonnendruck.de",
      paymentTerm: "14 Tage netto",
      priceLevel: "Stammkunde",
      status: "Aktiv",
      badgeVariant: "success",
    },
    {
      id: "customer-beispiel-ag",
      number: "KD-0003",
      name: "Beispiel AG",
      type: "Wiederverkäufer",
      street: "Industriestraße 8",
      zip: "68159",
      city: "Mannheim",
      contact: "Sabine Beispiel",
      phone: "0621 / 555000",
      email: "einkauf@beispiel-ag.de",
      paymentTerm: "14 Tage netto",
      priceLevel: "Sonderkondition",
      status: "Aktiv",
      badgeVariant: undefined,
    },
  ],
  Entwurf: [
    {
      id: "customer-musterkunde",
      number: "KD-0002",
      name: "Musterkunde GmbH",
      type: "Geschäftskunde",
      street: "Beispielweg 12",
      zip: "69115",
      city: "Heidelberg",
      contact: "Max Mustermann",
      phone: "06221 / 123456",
      email: "info@musterkunde.de",
      paymentTerm: "30 Tage netto",
      priceLevel: "Standard",
      status: "Entwurf",
      badgeVariant: undefined,
    },
  ],
  Gesperrt: [
    {
      id: "customer-testkunde",
      number: "KD-0004",
      name: "Testkunde KG",
      type: "Geschäftskunde",
      street: "Altbestand 4",
      zip: "76133",
      city: "Karlsruhe",
      contact: "T. Kunde",
      phone: "0721 / 111222",
      email: "kontakt@testkunde.de",
      paymentTerm: "Sofort ohne Abzug",
      priceLevel: "Standard",
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

  const [isEditing, setIsEditing] = useState(false);

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

  const { draft, isDirty, updateDraftField, resetDraft } =
    useEditableDraft(selectedCustomer);

  function handleTabChange(tab: string) {
    if (isCustomerTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
    }
  }

  function handleCustomerSelect(customerId: string) {
    selectItem(customerId);
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
                <Input value={draft?.number ?? ""} readOnly />
              </Field>

              <Field label="Firma">
                <Input
                  value={draft?.name ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("name", event.target.value)
                  }
                />
              </Field>

              <Field label="Kundentyp">
                <Select
                  value={draft?.type ?? ""}
                  onChange={(event) =>
                    updateDraftField("type", event.target.value)
                  }
                >
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
                <Input
                  value={draft?.street ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("street", event.target.value)
                  }
                />
              </Field>

              <Field label="PLZ">
                <Input
                  inputMode="numeric"
                  value={draft?.zip ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("zip", event.target.value)
                  }
                />
              </Field>

              <Field label="Ort">
                <Input
                  value={draft?.city ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("city", event.target.value)
                  }
                />
              </Field>
            </FieldGrid>

            <SectionHeader>Kontakt</SectionHeader>

            <FieldGrid>
              <Field label="Ansprechpartner">
                <Input
                  value={draft?.contact ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("contact", event.target.value)
                  }
                />
              </Field>

              <Field label="Telefon">
                <Input
                  value={draft?.phone ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("phone", event.target.value)
                  }
                />
              </Field>

              <Field label="E-Mail">
                <Input
                  type="email"
                  value={draft?.email ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("email", event.target.value)
                  }
                />
              </Field>
            </FieldGrid>

            <SectionHeader>Konditionen</SectionHeader>

            <FieldGrid>
              <Field label="Zahlungsziel">
                <Select
                  value={draft?.paymentTerm ?? ""}
                  onChange={(event) =>
                    updateDraftField("paymentTerm", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Zahlungsziel wählen
                  </option>
                  <option>Sofort ohne Abzug</option>
                  <option>14 Tage netto</option>
                  <option>30 Tage netto</option>
                </Select>
              </Field>

              <Field label="Preisstufe">
                <Select
                  value={draft?.priceLevel ?? ""}
                  onChange={(event) =>
                    updateDraftField("priceLevel", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Preisstufe wählen
                  </option>
                  <option>Standard</option>
                  <option>Stammkunde</option>
                  <option>Sonderkondition</option>
                </Select>
              </Field>

              <Field label="Status">
                <Select
                  value={activeTab}
                  disabled={!isEditing}
                  onChange={(event) => handleTabChange(event.target.value)}
                >
                  {customerTabs.map((tab) => (
                    <option key={tab}>{tab}</option>
                  ))}
                </Select>
              </Field>
            </FieldGrid>

            <div className="calculation-footer">
              {isDirty && (
                <span
                  style={{
                    alignSelf: "center",
                    color: "var(--color-text-muted)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    marginRight: "auto",
                  }}
                >
                  Ungespeicherte Änderungen
                </span>
              )}

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
              <Button variant="primary">
                {isDirty ? "Änderungen speichern" : "Kunde speichern"}
              </Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
