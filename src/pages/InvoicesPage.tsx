import { useMemo, useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";
import {
  type PrintPilotInvoice,
  type PrintPilotInvoiceStatus,
  groupPrintPilotInvoicesByStatus,
} from "../data/printPilotStore";
import { getPrintPilotStatusBadgeVariant } from "../data/statusBadges";
import { useEditableDraft } from "../hooks/useEditableDraft";
import { useMasterDetailSelection } from "../hooks/useMasterDetailSelection";
import { usePrintPilotStore } from "../store/PrintPilotStore";

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
import { SaveActionButton } from "../ui/SaveActionButton";
import { SectionHeader } from "../ui/SectionHeader";
import { Select } from "../ui/Select";
import { SortableTableHeader } from "../ui/SortableTableHeader";
import { DataTable, TableToolbar } from "../ui/Table";
import { useSortableTable } from "../ui/useSortableTable";
import { WorkspaceHeader } from "../ui/WorkspaceHeader";
import { formatPrintPilotDateString } from "../utils/dateFormat";

const invoiceTabs = ["Liste", "Entwurf", "Offen", "Bezahlt", "Überfällig"] as const;
const invoiceStatusOptions: PrintPilotInvoiceStatus[] = [
  "Entwurf",
  "Offen",
  "Bezahlt",
  "Überfällig",
];

type InvoiceTab = "Liste" | PrintPilotInvoiceStatus;

type InvoiceSortKey =
  | "number"
  | "customerName"
  | "subject"
  | "invoiceDate"
  | "dueDate"
  | "status";

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

function getInvoiceSortValue(invoice: PrintPilotInvoice, sortKey: InvoiceSortKey) {
  switch (sortKey) {
    case "number":
      return invoice.number;
    case "customerName":
      return invoice.customerName;
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
  const { invoices, settings, updateInvoice } = usePrintPilotStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  const invoiceRowsByTab = useMemo(() => {
    return {
      Liste: invoices,
      ...groupPrintPilotInvoicesByStatus(invoices),
    };
  }, [invoices]);

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
  } = useSortableTable<PrintPilotInvoice, InvoiceSortKey>({
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

    const savedInvoice = draft as PrintPilotInvoice;

    updateInvoice(savedInvoice);
    saveDraft(savedInvoice);
    setIsEditing(false);
    setIsDetailDrawerOpen(false);

    if (activeTab !== "Liste") {
      setActiveTab("Liste");
    }

    window.setTimeout(() => {
      selectItem(savedInvoice.id);
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
                <SortableTableHeader
                  label="Rechnung"
                  sortKey="number"
                  sortConfig={invoiceSortConfig}
                  onSort={requestInvoiceSort}
                />
                <SortableTableHeader
                  label="Kunde"
                  sortKey="customerName"
                  sortConfig={invoiceSortConfig}
                  onSort={requestInvoiceSort}
                />
                <SortableTableHeader
                  label="Betreff"
                  sortKey="subject"
                  sortConfig={invoiceSortConfig}
                  onSort={requestInvoiceSort}
                />
                <SortableTableHeader
                  label="Datum"
                  sortKey="invoiceDate"
                  sortConfig={invoiceSortConfig}
                  onSort={requestInvoiceSort}
                />
                <SortableTableHeader
                  label="Fällig"
                  sortKey="dueDate"
                  sortConfig={invoiceSortConfig}
                  onSort={requestInvoiceSort}
                />
                <SortableTableHeader
                  label="Status"
                  sortKey="status"
                  sortConfig={invoiceSortConfig}
                  onSort={requestInvoiceSort}
                />
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
                    <td>{invoice.customerName}</td>
                    <td>{invoice.subject}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {formatPrintPilotDateString(
                        invoice.invoiceDate,
                        settings.dateFormat,
                      )}
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {formatPrintPilotDateString(invoice.dueDate, settings.dateFormat)}
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <Badge variant={getPrintPilotStatusBadgeVariant(invoice.status)}>
                        {invoice.status}
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
        open={isDetailDrawerOpen && Boolean(selectedInvoice)}
        eyebrow="Rechnung"
        title={draft?.number ?? selectedInvoice?.number ?? "Rechnung"}
        subtitle={
          selectedInvoice
            ? `${selectedInvoice.customerName} · ${selectedInvoice.subject}`
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
                <Input value={draft?.customerName ?? ""} readOnly />
              </Field>

              <Field label="Auftrag">
                <Input value={draft?.orderNumber ?? ""} readOnly />
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
                    updateDraftField(
                      "status",
                      event.target.value as PrintPilotInvoiceStatus,
                    )
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
                  <td>{draft?.subject ?? "Leistung aus Auftrag übernehmen"}</td>
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
