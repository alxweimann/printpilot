import { useMemo, useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";
import {
  type PrintPilotCustomer,
  type PrintPilotCustomerStatus,
  groupPrintPilotCustomersByStatus,
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

const customerTabs = ["Aktiv", "Interessent", "Inaktiv"] as const;

type CustomerTab = PrintPilotCustomerStatus;

function getCustomerTitle(tab: CustomerTab) {
  switch (tab) {
    case "Aktiv":
      return "Aktiven Kunden bearbeiten";

    case "Interessent":
      return "Interessenten bearbeiten";

    case "Inaktiv":
      return "Inaktiven Kunden prüfen";
  }
}

function isCustomerTab(tab: string): tab is CustomerTab {
  return customerTabs.includes(tab as CustomerTab);
}

export function CustomersPage() {
  const module = getModuleConfig("customers");
  const { customers, updateCustomer } = usePrintPilotStore();

  const [isEditing, setIsEditing] = useState(false);

  const customerRowsByTab = useMemo(() => {
    return groupPrintPilotCustomersByStatus(customers);
  }, [customers]);

  const {
    activeTab,
    rows: customerRows,
    selectedItem: selectedCustomer,
    setActiveTab,
    selectItem,
  } = useMasterDetailSelection({
    rowsByTab: customerRowsByTab,
    initialTab: "Aktiv",
  });

  const { draft, isDirty, updateDraftField, resetDraft, saveDraft } =
    useEditableDraft(selectedCustomer);

  const canEdit = isEditing && Boolean(draft);

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

  function handleSaveDraft() {
    if (!draft) {
      return;
    }

    const savedCustomer = draft as PrintPilotCustomer;

    updateCustomer(savedCustomer);
    saveDraft(savedCustomer);
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
        tabs={[...customerTabs]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="Kundenverwaltung"
          title={getCustomerTitle(activeTab)}
          statusValue={isEditing ? "Bearbeitung offen" : activeTab}
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
                  <th>Kundennr.</th>
                  <th>Name</th>
                  <th>Ort</th>
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
                      <td>{customer.number}</td>
                      <td>{customer.name}</td>
                      <td>{customer.city}</td>
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

              <Field label="Name">
                <Input
                  value={draft?.name ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("name", event.target.value)
                  }
                />
              </Field>

              <Field label="Kundentyp">
                <Select
                  value={draft?.type ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField("type", event.target.value)
                  }
                >
                  <option>Geschäftskunde</option>
                  <option>Agentur</option>
                  <option>Wiederverkäufer</option>
                  <option>Privatkunde</option>
                </Select>
              </Field>

              <Field label="Status">
                <Select
                  value={draft?.status ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField(
                      "status",
                      event.target.value as PrintPilotCustomerStatus,
                    )
                  }
                >
                  {customerTabs.map((tab) => (
                    <option key={tab}>{tab}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Straße">
                <Input
                  value={draft?.street ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("street", event.target.value)
                  }
                />
              </Field>

              <Field label="PLZ">
                <Input
                  value={draft?.zip ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("zip", event.target.value)
                  }
                />
              </Field>

              <Field label="Ort">
                <Input
                  value={draft?.city ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("city", event.target.value)
                  }
                />
              </Field>

              <Field label="Ansprechpartner">
                <Input
                  value={draft?.contact ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("contact", event.target.value)
                  }
                />
              </Field>

              <Field label="Telefon">
                <Input
                  value={draft?.phone ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("phone", event.target.value)
                  }
                />
              </Field>

              <Field label="E-Mail">
                <Input
                  type="email"
                  value={draft?.email ?? ""}
                  readOnly={!canEdit}
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
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField("paymentTerm", event.target.value)
                  }
                >
                  <option>Zahlbar sofort</option>
                  <option>Vorkasse</option>
                  <option>14 Tage netto</option>
                  <option>30 Tage netto</option>
                </Select>
              </Field>

              <Field label="Preisgruppe">
                <Select
                  value={draft?.priceLevel ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField("priceLevel", event.target.value)
                  }
                >
                  <option>Standard</option>
                  <option>A-Kunde</option>
                  <option>Agentur</option>
                  <option>Wiederverkäufer</option>
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
                defaultLabel="Kunde speichern"
                onClick={handleSaveDraft}
              />
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
