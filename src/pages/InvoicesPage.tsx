import { useMemo, useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";
import {
  type PrintPilotInvoice,
  type PrintPilotInvoiceStatus,
  createPrintPilotReminderFromInvoice,
  groupPrintPilotInvoicesByStatus,
  createPrintPilotHistoryEntry,
} from "../data/printPilotStore";
import { getPrintPilotStatusBadgeVariant } from "../data/statusBadges";
import { useEditableDraft } from "../hooks/useEditableDraft";
import { useMasterDetailSelection } from "../hooks/useMasterDetailSelection";
import { usePrintPilotStore } from "../store/PrintPilotStore";

import { PageHeader } from "../layout/PageHeader";
import { PageTabs } from "../layout/PageTabs";

import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { DetailDrawer } from "../ui/DetailDrawer";
import { DocumentHistory } from "../ui/DocumentHistory";
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
  const {
    addReminder,
    invoices,
    reminders,
    settings,
    updateInvoice,
  } = usePrintPilotStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isCreateReminderDialogOpen, setIsCreateReminderDialogOpen] =
    useState(false);
  const [isDuplicateReminderDialogOpen, setIsDuplicateReminderDialogOpen] =
    useState(false);
  const [isReminderStatusBlockedDialogOpen, setIsReminderStatusBlockedDialogOpen] =
    useState(false);

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
  const draftInvoice = draft as PrintPilotInvoice | undefined;
  const invoiceForReminderGuard = draftInvoice ?? selectedInvoice;
  const existingReminderForSelectedInvoice = selectedInvoice
    ? reminders.find((reminder) => reminder.invoiceId === selectedInvoice.id)
    : undefined;
  const canCreateReminderFromSelectedInvoice =
    invoiceForReminderGuard?.status === "Offen" ||
    invoiceForReminderGuard?.status === "Überfällig";

  function handleTabChange(tab: string) {
    if (isInvoiceTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
      setIsDetailDrawerOpen(false);
      setIsCreateReminderDialogOpen(false);
      setIsDuplicateReminderDialogOpen(false);
      setIsReminderStatusBlockedDialogOpen(false);
    }
  }

  function handleInvoiceSelect(invoiceId: string) {
    selectItem(invoiceId);
    setIsEditing(false);
    setIsDetailDrawerOpen(true);
    setIsCreateReminderDialogOpen(false);
    setIsDuplicateReminderDialogOpen(false);
    setIsReminderStatusBlockedDialogOpen(false);
  }

  function handleCloseDetailDrawer() {
    setIsEditing(false);
    setIsDetailDrawerOpen(false);
    setIsCreateReminderDialogOpen(false);
    setIsDuplicateReminderDialogOpen(false);
    setIsReminderStatusBlockedDialogOpen(false);
  }

  function handleResetDraft() {
    resetDraft();
    setIsEditing(false);
    setIsCreateReminderDialogOpen(false);
    setIsDuplicateReminderDialogOpen(false);
    setIsReminderStatusBlockedDialogOpen(false);
  }

  function handleToggleEditing() {
    setIsEditing((currentValue) => !currentValue);
  }

  function handleIssueInvoice() {
    if (!draft) {
      return;
    }

    const previousHistory = (draft as PrintPilotInvoice).history ?? [];

    const issuedInvoice: PrintPilotInvoice = {
      ...(draft as PrintPilotInvoice),
      status: "Offen",
      history: [
        createPrintPilotHistoryEntry("Rechnung ausgegeben", "Offen"),
        ...previousHistory,
      ],
    };

    updateInvoice(issuedInvoice);
    saveDraft(issuedInvoice);
    setIsEditing(false);

    if (activeTab !== "Liste") {
      setActiveTab("Liste");
    }

    window.setTimeout(() => {
      selectItem(issuedInvoice.id);
      setIsDetailDrawerOpen(true);
    }, 0);
  }

  function handleSaveDraft() {
    if (!draft) {
      return;
    }

    const savedInvoice = draft as PrintPilotInvoice;

    const statusChanged =
      selectedInvoice && selectedInvoice.status !== savedInvoice.status;
    const previousHistory = savedInvoice.history ?? selectedInvoice?.history ?? [];
    const documentToSave: PrintPilotInvoice = statusChanged
      ? {
          ...savedInvoice,
          history: [
            createPrintPilotHistoryEntry(
              "Rechnung: Status geändert",
              savedInvoice.status,
              selectedInvoice?.status,
              savedInvoice.status,
            ),
            ...previousHistory,
          ],
        }
      : savedInvoice;


    updateInvoice(documentToSave);

    saveDraft(documentToSave);
    setIsEditing(false);

    if (activeTab !== "Liste") {
      setActiveTab("Liste");
    }

    window.setTimeout(() => {
      selectItem(documentToSave.id);
      setIsDetailDrawerOpen(true);
    }, 0);
  }

  function handleOpenCreateReminderDialog() {
    if (!selectedInvoice) {
      return;
    }

    if (!canCreateReminderFromSelectedInvoice) {
      setIsCreateReminderDialogOpen(false);
      setIsDuplicateReminderDialogOpen(false);
      setIsReminderStatusBlockedDialogOpen(true);
      return;
    }

    if (existingReminderForSelectedInvoice) {
      setIsDuplicateReminderDialogOpen(true);
      return;
    }

    setIsCreateReminderDialogOpen(true);
  }

  function handleCancelCreateReminderDialog() {
    setIsCreateReminderDialogOpen(false);
  }

  function handleCancelDuplicateReminderDialog() {
    setIsDuplicateReminderDialogOpen(false);
  }

  function handleCancelReminderStatusBlockedDialog() {
    setIsReminderStatusBlockedDialogOpen(false);
  }

  function handleCreateReminderFromInvoice() {
    if (!selectedInvoice) {
      setIsCreateReminderDialogOpen(false);
      return;
    }

    if (!canCreateReminderFromSelectedInvoice) {
      setIsCreateReminderDialogOpen(false);
      setIsDuplicateReminderDialogOpen(false);
      setIsReminderStatusBlockedDialogOpen(true);
      return;
    }

    if (existingReminderForSelectedInvoice) {
      setIsCreateReminderDialogOpen(false);
      setIsDuplicateReminderDialogOpen(true);
      return;
    }

    const newReminder = createPrintPilotReminderFromInvoice(
      selectedInvoice,
      settings,
    );

    addReminder(newReminder);
    setIsCreateReminderDialogOpen(false);
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
            <Button
              variant="primary"
              disabled={!canCreateReminderFromSelectedInvoice}
              onClick={handleOpenCreateReminderDialog}
            >
              {canCreateReminderFromSelectedInvoice
                ? "Mahnung erstellen"
                : "Mahnung gesperrt"}
            </Button>

            <SaveActionButton
              isDirty={isDirty}
              defaultLabel="Änderungen speichern"
              onClick={handleSaveDraft}
            />
            <Button variant="primary" onClick={handleIssueInvoice}>
              Rechnung ausgeben
            </Button>
          </>
        }
      >

        <DocumentHistory entries={(draft as PrintPilotInvoice | undefined)?.history ?? selectedInvoice?.history} />
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

      <ConfirmDialog
        open={isReminderStatusBlockedDialogOpen && Boolean(selectedInvoice)}
        title="Mahnung nicht möglich"
        description={
          <>
            Eine Mahnung kann nur aus Rechnungen mit Status{" "}
            <strong>Offen</strong> oder <strong>Überfällig</strong> erstellt
            werden.
          </>
        }
        details={
          selectedInvoice ? (
            <>
              <span>
                <strong>Rechnung:</strong> {selectedInvoice.number}
              </span>
              <span>
                <strong>Kunde:</strong> {selectedInvoice.customerName}
              </span>
              <span>
                <strong>Aktueller Status:</strong>{" "}
                {invoiceForReminderGuard?.status ?? selectedInvoice.status}
              </span>
            </>
          ) : null
        }
        variant="warning"
        cancelLabel="Schließen"
        confirmLabel="Verstanden"
        onCancel={handleCancelReminderStatusBlockedDialog}
        onConfirm={handleCancelReminderStatusBlockedDialog}
      />

      <ConfirmDialog
        open={isCreateReminderDialogOpen && Boolean(selectedInvoice)}
        title="Mahnung aus Rechnung erstellen?"
        description={
          <>
            Aus der ausgewählten Rechnung wird eine neue Mahnung erzeugt. Die
            Mahnung wird eindeutig mit der Rechnung verknüpft.
          </>
        }
        details={
          selectedInvoice ? (
            <>
              <span>
                <strong>Rechnung:</strong> {selectedInvoice.number}
              </span>
              <span>
                <strong>Kunde:</strong> {selectedInvoice.customerName}
              </span>
              <span>
                <strong>Betreff:</strong> {selectedInvoice.subject}
              </span>
              <span>
                <strong>Mahnstufe:</strong> 1. Mahnung
              </span>
            </>
          ) : null
        }
        variant="default"
        cancelLabel="Abbrechen"
        confirmLabel="Mahnung erstellen"
        onCancel={handleCancelCreateReminderDialog}
        onConfirm={handleCreateReminderFromInvoice}
      />

      <ConfirmDialog
        open={isDuplicateReminderDialogOpen && Boolean(selectedInvoice)}
        title="Mahnung existiert bereits"
        description={
          <>
            Für diese Rechnung existiert bereits eine Mahnung. Es wird keine
            weitere Mahnung erzeugt, damit keine Dublette entsteht.
          </>
        }
        details={
          selectedInvoice ? (
            <>
              <span>
                <strong>Rechnung:</strong> {selectedInvoice.number}
              </span>
              <span>
                <strong>Kunde:</strong> {selectedInvoice.customerName}
              </span>
              {existingReminderForSelectedInvoice && (
                <span>
                  <strong>Vorhandene Mahnung:</strong>{" "}
                  {existingReminderForSelectedInvoice.number}
                </span>
              )}
            </>
          ) : null
        }
        variant="warning"
        cancelLabel="Schließen"
        confirmLabel="Verstanden"
        onCancel={handleCancelDuplicateReminderDialog}
        onConfirm={handleCancelDuplicateReminderDialog}
      />

    </div>
  );
}
