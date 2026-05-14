import { useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";

import { useEditableDraft } from "../hooks/useEditableDraft";
import { useMasterDetailSelection } from "../hooks/useMasterDetailSelection";

import { PageHeader } from "../layout/PageHeader";
import { PageTabs } from "../layout/PageTabs";

import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { DetailDrawer } from "../ui/DetailDrawer";
import { DirtyStateNotice } from "../ui/DirtyStateNotice";
import { EditLockToggle } from "../ui/EditLockToggle";
import { Field } from "../ui/Field";
import { FieldGrid } from "../ui/FieldGrid";
import { Input } from "../ui/Input";
import { SectionHeader } from "../ui/SectionHeader";
import { SaveActionButton } from "../ui/SaveActionButton";
import { Select } from "../ui/Select";
import { DataTable, TableToolbar } from "../ui/Table";
import { SortableTableHeader } from "../ui/SortableTableHeader";
import { useSortableTable } from "../ui/useSortableTable";
import { WorkspaceHeader } from "../ui/WorkspaceHeader";

const invoiceTabs = ["Liste", "Entwurf", "Offen", "Bezahlt", "Überfällig"] as const;
const invoiceStatusOptions = ["Entwurf", "Offen", "Bezahlt", "Überfällig"] as const;

type InvoiceTab = (typeof invoiceTabs)[number];
type InvoiceStatus = (typeof invoiceStatusOptions)[number];

type InvoiceRow = {
  id: string;
  number: string;
  customer: string;
  subject: string;
  status: InvoiceStatus;
  paymentTerms: string;
  paymentType: string;
  template: string;
  invoiceDate: string;
  dueDate: string;
  badgeVariant?: "success";
};

type InvoiceSortKey =
  | "number"
  | "customer"
  | "subject"
  | "invoiceDate"
  | "dueDate"
  | "status";

const invoiceRowsByTab: Record<InvoiceTab, InvoiceRow[]> = {
  Liste: [
    {
      id: "invoice-re-2026-001",
      number: "RE-2026-001",
      customer: "Sonnendruck GmbH",
      subject: "Broschüre A4",
      status: "Entwurf",
      paymentTerms: "14 Tage netto",
      paymentType: "Überweisung",
      template: "Standardrechnung",
      invoiceDate: "2026-05-05",
      dueDate: "2026-05-19",
      badgeVariant: "success",
    },
    {
      id: "invoice-re-2026-002",
      number: "RE-2026-002",
      customer: "Musterkunde GmbH",
      subject: "Flyer A5",
      status: "Offen",
      paymentTerms: "14 Tage netto",
      paymentType: "Überweisung",
      template: "Standardrechnung",
      invoiceDate: "2026-05-03",
      dueDate: "2026-05-17",
      badgeVariant: undefined,
    },
    {
      id: "invoice-re-2026-003",
      number: "RE-2026-003",
      customer: "Beispiel AG",
      subject: "Folder DIN lang",
      status: "Bezahlt",
      paymentTerms: "30 Tage netto",
      paymentType: "Überweisung",
      template: "Kurzrechnung",
      invoiceDate: "2026-04-22",
      dueDate: "2026-05-22",
      badgeVariant: "success",
    },
  ],
  Entwurf: [
    {
      id: "invoice-re-2026-001",
      number: "RE-2026-001",
      customer: "Sonnendruck GmbH",
      subject: "Broschüre A4",
      status: "Entwurf",
      paymentTerms: "14 Tage netto",
      paymentType: "Überweisung",
      template: "Standardrechnung",
      invoiceDate: "2026-05-05",
      dueDate: "2026-05-19",
      badgeVariant: "success",
    },
  ],
  Offen: [
    {
      id: "invoice-re-2026-002",
      number: "RE-2026-002",
      customer: "Musterkunde GmbH",
      subject: "Flyer A5",
      status: "Offen",
      paymentTerms: "14 Tage netto",
      paymentType: "Überweisung",
      template: "Standardrechnung",
      invoiceDate: "2026-05-03",
      dueDate: "2026-05-17",
      badgeVariant: undefined,
    },
  ],
  Bezahlt: [
    {
      id: "invoice-re-2026-003",
      number: "RE-2026-003",
      customer: "Beispiel AG",
      subject: "Folder DIN lang",
      status: "Bezahlt",
      paymentTerms: "30 Tage netto",
      paymentType: "Überweisung",
      template: "Kurzrechnung",
      invoiceDate: "2026-04-22",
      dueDate: "2026-05-22",
      badgeVariant: "success",
    },
  ],
  Überfällig: [
    {
      id: "invoice-re-2026-009",
      number: "RE-2026-009",
      customer: "Testkunde KG",
      subject: "Plakat A1",
      status: "Überfällig",
      paymentTerms: "Sofort ohne Abzug",
      paymentType: "Überweisung",
      template: "Standardrechnung",
      invoiceDate: "2026-04-01",
      dueDate: "2026-04-15",
      badgeVariant: undefined,
    },
  ],
};

function getInvoiceTitle(tab: InvoiceTab) {
  switch (tab) {
    case "Liste":
      return "Rechnungsliste";
    case "Entwurf":
      return "Rechnungsentwürfe";
    case "Offen":
      return "Offene Rechnungen";
    case "Bezahlt":
      return "Bezahlte Rechnungen";
    case "Überfällig":
      return "Überfällige Rechnungen";
  }
}

function getInvoiceStatus(tab: InvoiceTab) {
  if (tab === "Liste") {
    return "Alle Rechnungen";
  }

  return tab;
}

function isInvoiceTab(tab: string): tab is InvoiceTab {
  return invoiceTabs.includes(tab as InvoiceTab);
}

function getInvoiceSortValue(invoice: InvoiceRow, sortKey: InvoiceSortKey) {
  switch (sortKey) {
    case "number":
      return invoice.number;
    case "customer":
      return invoice.customer;
    case "subject":
      return invoice.subject;
    case "invoiceDate":
      return invoice.invoiceDate;
    case "dueDate":
      return invoice.dueDate;
    case "status":
      return invoice.status;
  }
}

export function InvoicesPage() {
  const module = getModuleConfig("invoices");

  const [isEditing, setIsEditing] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  const {
    activeTab,
    rows: invoiceRows,
    selectedItem: selectedInvoice,
    setActiveTab,
    selectItem,
  } = useMasterDetailSelection({
    rowsByTab: invoiceRowsByTab,
    initialTab: "Liste" as InvoiceTab,
  });

  const { draft, isDirty, updateDraftField, resetDraft, saveDraft } =
    useEditableDraft(selectedInvoice);

  const {
    sortedRows: sortedInvoiceRows,
    sortConfig: invoiceSortConfig,
    requestSort: requestInvoiceSort,
    getAriaSort: getInvoiceSortAriaValue,
  } = useSortableTable<InvoiceRow, InvoiceSortKey>({
    rows: invoiceRows,
    initialSortKey: "number",
    getSortValue: getInvoiceSortValue,
    fallbackSortValue: (invoice) => invoice.number,
  });

  const canEdit = isEditing && Boolean(draft);

  function handleTabChange(tab: string) {
    if (isInvoiceTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
      setIsDetailDrawerOpen(false);
    }
  }

  function handleInvoiceSelect(invoiceId: string) {
    selectItem(invoiceId);
    setIsEditing(false);
    setIsDetailDrawerOpen(true);
  }

  function handleCloseDetailDrawer() {
    setIsEditing(false);
    setIsDetailDrawerOpen(false);
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

    const savedInvoice = draft as InvoiceRow;

    saveDraft(savedInvoice);
    setIsEditing(false);
    setIsDetailDrawerOpen(false);
  }

  return (
    <div className="page">
      <PageHeader
        title={module.title}
        description={module.description}
        actionLabel={module.actionLabel}
      />

      <PageTabs
        tabs={[...invoiceTabs]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="Rechnungen"
          title={getInvoiceTitle(activeTab)}
          statusValue={isEditing ? "Bearbeitung offen" : getInvoiceStatus(activeTab)}
        />

        <section className="workspace-panel">
          <TableToolbar>
            <Input className="search-input" placeholder="Rechnungen suchen..." />
            <Button>Filter</Button>
          </TableToolbar>

          <DataTable>
            <thead>
              <tr>
                <th aria-sort={getInvoiceSortAriaValue("number")}>
                  <SortableTableHeader
                    label="Rechnung"
                    sortKey="number"
                    sortConfig={invoiceSortConfig}
                    onSort={requestInvoiceSort}
                  />
                </th>
                <th aria-sort={getInvoiceSortAriaValue("customer")}>
                  <SortableTableHeader
                    label="Kunde"
                    sortKey="customer"
                    sortConfig={invoiceSortConfig}
                    onSort={requestInvoiceSort}
                  />
                </th>
                <th aria-sort={getInvoiceSortAriaValue("subject")}>
                  <SortableTableHeader
                    label="Betreff"
                    sortKey="subject"
                    sortConfig={invoiceSortConfig}
                    onSort={requestInvoiceSort}
                  />
                </th>
                <th aria-sort={getInvoiceSortAriaValue("invoiceDate")}>
                  <SortableTableHeader
                    label="Datum"
                    sortKey="invoiceDate"
                    sortConfig={invoiceSortConfig}
                    onSort={requestInvoiceSort}
                  />
                </th>
                <th aria-sort={getInvoiceSortAriaValue("dueDate")}>
                  <SortableTableHeader
                    label="Fällig"
                    sortKey="dueDate"
                    sortConfig={invoiceSortConfig}
                    onSort={requestInvoiceSort}
                  />
                </th>
                <th aria-sort={getInvoiceSortAriaValue("status")}>
                  <SortableTableHeader
                    label="Status"
                    sortKey="status"
                    sortConfig={invoiceSortConfig}
                    onSort={requestInvoiceSort}
                  />
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedInvoiceRows.map((invoice) => {
                const isSelected =
                  isDetailDrawerOpen && invoice.id === selectedInvoice?.id;

                return (
                  <tr
                    key={invoice.id}
                    className={isSelected ? "data-table-row-selected" : undefined}
                    onClick={() => handleInvoiceSelect(invoice.id)}
                  >
                    <td style={{ whiteSpace: "nowrap" }}>{invoice.number}</td>
                    <td>{invoice.customer}</td>
                    <td>{invoice.subject}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{invoice.invoiceDate}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{invoice.dueDate}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <Badge variant={invoice.badgeVariant}>{invoice.status}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </DataTable>
        </section>
      </section>

      <DetailDrawer
        open={isDetailDrawerOpen && Boolean(selectedInvoice)}
        eyebrow="Rechnung"
        title={draft?.number ?? selectedInvoice?.number ?? "Rechnung"}
        subtitle={
          selectedInvoice
            ? `${selectedInvoice.customer} · ${selectedInvoice.subject}`
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
            <Button>Vorschau prüfen</Button>

            <SaveActionButton
              isDirty={isDirty}
              defaultLabel="Rechnung ausgeben"
              onClick={handleSaveDraft}
            />
          </>
        }
      >
        <div className="detail-drawer-stack">
          <section className="detail-drawer-panel">
            <SectionHeader>Rechnungskopf</SectionHeader>

            <FieldGrid>
              <Field label="Rechnungsnummer">
                <Input value={draft?.number ?? ""} readOnly />
              </Field>

              <Field label="Kunde">
                <Input value={draft?.customer ?? ""} readOnly />
              </Field>

              <Field label="Betreff">
                <Input
                  value={draft?.subject ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("subject", event.target.value)
                  }
                />
              </Field>

              <Field label="Status">
                <Select
                  value={draft?.status ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField("status", event.target.value as InvoiceStatus)
                  }
                >
                  {invoiceStatusOptions.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Rechnungsdatum">
                <Input
                  type="date"
                  value={draft?.invoiceDate ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("invoiceDate", event.target.value)
                  }
                />
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
            <SectionHeader>Positionen</SectionHeader>

            <DataTable>
              <thead>
                <tr>
                  <th>Pos.</th>
                  <th>Bezeichnung</th>
                  <th>Menge</th>
                  <th>Netto</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Leistung aus Auftrag übernehmen</td>
                  <td>—</td>
                  <td>—</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Optionale Zusatzposition</td>
                  <td>—</td>
                  <td>—</td>
                </tr>
                <tr className="data-table-summary-row">
                  <td colSpan={3}>Rechnungssumme netto</td>
                  <td>—</td>
                </tr>
              </tbody>
            </DataTable>
          </section>

          <section className="detail-drawer-panel">
            <SectionHeader>Zahlung & Ausgabe</SectionHeader>

            <FieldGrid>
              <Field label="Bedingungen">
                <Select
                  value={draft?.paymentTerms ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField("paymentTerms", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Bedingungen wählen
                  </option>
                  <option>Zahlbar sofort ohne Abzug</option>
                  <option>14 Tage netto</option>
                  <option>30 Tage netto</option>
                </Select>
              </Field>

              <Field label="Zahlungsart">
                <Select
                  value={draft?.paymentType ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField("paymentType", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Zahlungsart wählen
                  </option>
                  <option>Überweisung</option>
                  <option>Barzahlung</option>
                  <option>EC / Karte</option>
                  <option>Lastschrift</option>
                </Select>
              </Field>

              <Field label="Vorlage">
                <Select
                  value={draft?.template ?? ""}
                  disabled={!canEdit}
                  onChange={(event) =>
                    updateDraftField("template", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Vorlage wählen
                  </option>
                  <option>Standardrechnung</option>
                  <option>Kurzrechnung</option>
                  <option>Technische Rechnung</option>
                </Select>
              </Field>
            </FieldGrid>
          </section>
        </div>
      </DetailDrawer>
    </div>
  );
}
