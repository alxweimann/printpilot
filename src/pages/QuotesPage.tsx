import { useMemo, useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";
import {
  type PrintPilotQuote,
  type PrintPilotQuoteStatus,
  createPrintPilotOrderFromQuote,
  createPrintPilotQuoteFromSettings,
  groupPrintPilotQuotesByStatus,
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
import { DocumentPreviewDialog } from "../ui/DocumentPreviewDialog";
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
import { WorkflowHints } from "../ui/WorkflowHints";
import { formatPrintPilotDateString } from "../utils/dateFormat";

const quoteTabs = [
  "Alle Angebote",
  "Entwurf",
  "Offen",
  "Angenommen",
  "Abgelehnt",
] as const;

type QuoteTab = "Alle Angebote" | PrintPilotQuoteStatus;

type QuoteSortKey =
  | "number"
  | "customerName"
  | "subject"
  | "quoteDate"
  | "status";

const quoteSortLabels: Record<QuoteSortKey, string> = {
  number: "Angebot",
  customerName: "Kunde",
  subject: "Betreff",
  quoteDate: "Datum",
  status: "Status",
};

function getQuoteSortValue(quote: PrintPilotQuote, key: QuoteSortKey) {
  switch (key) {
    case "number":
      return quote.number;

    case "customerName":
      return quote.customerName;

    case "subject":
      return quote.subject;

    case "quoteDate":
      return quote.quoteDate;

    case "status":
      return quote.status;
  }
}

function getQuoteTitle(tab: QuoteTab) {
  switch (tab) {
    case "Alle Angebote":
      return "Angebotsübersicht";

    case "Entwurf":
      return "Angebotsentwurf bearbeiten";

    case "Offen":
      return "Offenes Angebot bearbeiten";

    case "Angenommen":
      return "Angenommenes Angebot prüfen";

    case "Abgelehnt":
      return "Abgelehntes Angebot prüfen";
  }
}

function isQuoteTab(tab: string): tab is QuoteTab {
  return quoteTabs.includes(tab as QuoteTab);
}

function getQuoteRequiredFieldIssues(quote: PrintPilotQuote | undefined) {
  const issues: string[] = [];

  if (!quote) {
    return issues;
  }

  if (!quote.customerName || quote.customerName.trim().length === 0) {
    issues.push("Kunde fehlt");
  }

  if (!quote.subject || quote.subject.trim().length === 0) {
    issues.push("Betreff/Produkt fehlt");
  }

  if (!quote.validUntil || quote.validUntil.trim().length === 0) {
    issues.push("Gültigkeit fehlt");
  }

  return issues;
}

function getQuoteWorkflowHints(quote: PrintPilotQuote | undefined) {
  if (!quote) {
    return [];
  }

  const hints = [];

  if (!quote.customerName || quote.customerName.trim().length === 0) {
    hints.push({
      title: "Kunde fehlt",
      description: "Ergänze einen Kunden, bevor aus dem Angebot ein Auftrag erzeugt wird.",
      variant: "warning" as const,
    });
  }

  if (!quote.subject || quote.subject.trim().length === 0) {
    hints.push({
      title: "Betreff/Produkt fehlt",
      description: "Ohne Betreff ist der Folgeauftrag später nicht eindeutig.",
      variant: "warning" as const,
    });
  }

  if (!quote.validUntil || quote.validUntil.trim().length === 0) {
    hints.push({
      title: "Gültigkeit fehlt",
      description: "Lege fest, bis wann das Angebot gültig ist.",
      variant: "info" as const,
    });
  }

  if (quote.status === "Angenommen") {
    hints.push({
      title: "Angebot angenommen",
      description: "Dieses Angebot kann als Auftrag weitergeführt werden.",
      variant: "success" as const,
    });
  }

  return hints;
}

export function QuotesPage() {
  const module = getModuleConfig("quotes");
  const {
    addOrder,
    addQuote,
    orders,
    quotes,
    settings,
    updateQuote,
  } = usePrintPilotStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isCreateOrderDialogOpen, setIsCreateOrderDialogOpen] = useState(false);
  const [isDuplicateOrderDialogOpen, setIsDuplicateOrderDialogOpen] =
    useState(false);
  const [isRequiredFieldsDialogOpen, setIsRequiredFieldsDialogOpen] =
    useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);

  const quoteRowsByTab = useMemo(() => {
    return {
      "Alle Angebote": quotes,
      ...groupPrintPilotQuotesByStatus(quotes),
    };
  }, [quotes]);

  const {
    activeTab,
    rows: quoteRows,
    selectedItem: selectedQuote,
    setActiveTab,
    selectItem,
  } = useMasterDetailSelection({
    rowsByTab: quoteRowsByTab,
    initialTab: "Alle Angebote" as QuoteTab,
  });

  const { draft, isDirty, updateDraftField, resetDraft, saveDraft } =
    useEditableDraft(selectedQuote);

  const canEdit = isEditing && Boolean(draft);
  const existingOrderForSelectedQuote = selectedQuote
    ? orders.find((order) => order.quoteId === selectedQuote.id)
    : undefined;
  const quoteDraft = draft as PrintPilotQuote | undefined;
  const quoteWorkflowHints = getQuoteWorkflowHints(quoteDraft);
  const quoteRequiredFieldIssues = getQuoteRequiredFieldIssues(
    quoteDraft ?? selectedQuote,
  );

  const {
    sortedRows: sortedQuoteRows,
    sortConfig: quoteSortConfig,
    requestSort: handleQuoteSort,
  } = useSortableTable<PrintPilotQuote, QuoteSortKey>({
    rows: quoteRows,
    getSortValue: getQuoteSortValue,
  });

  function handleTabChange(tab: string) {
    if (isQuoteTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
      setIsDetailDrawerOpen(false);
      setIsCreateOrderDialogOpen(false);
      setIsDuplicateOrderDialogOpen(false);
      setIsRequiredFieldsDialogOpen(false);
    }
  }

  function handleQuoteSelect(quoteId: string) {
    selectItem(quoteId);
    setIsEditing(false);
    setIsDetailDrawerOpen(true);
    setIsCreateOrderDialogOpen(false);
    setIsDuplicateOrderDialogOpen(false);
    setIsRequiredFieldsDialogOpen(false);
  }

  function handleCloseDetailDrawer() {
    setIsEditing(false);
    setIsDetailDrawerOpen(false);
    setIsCreateOrderDialogOpen(false);
    setIsDuplicateOrderDialogOpen(false);
    setIsRequiredFieldsDialogOpen(false);
  }

  function handleResetDraft() {
    resetDraft();
    setIsEditing(false);
    setIsCreateOrderDialogOpen(false);
  }

  function handleToggleEditing() {
    setIsEditing((currentValue) => !currentValue);
  }

  function handleCreateNewQuote() {
    const newQuote = createPrintPilotQuoteFromSettings(settings);

    addQuote(newQuote);
    saveDraft(newQuote);
    setActiveTab("Alle Angebote");
    setIsEditing(true);
    setIsDetailDrawerOpen(true);
    setIsCreateOrderDialogOpen(false);
    setIsDuplicateOrderDialogOpen(false);
    setIsRequiredFieldsDialogOpen(false);

    window.setTimeout(() => {
      selectItem(newQuote.id);
    }, 0);
  }

  function handleOpenPreviewDialog() {
    if (!draft && !selectedQuote) {
      return;
    }

    setIsPreviewDialogOpen(true);
  }

  function handleClosePreviewDialog() {
    setIsPreviewDialogOpen(false);
  }

  function handleOpenCreateOrderDialog() {
    if (!selectedQuote) {
      return;
    }

    if (quoteRequiredFieldIssues.length > 0) {
      setIsRequiredFieldsDialogOpen(true);
      return;
    }

    if (existingOrderForSelectedQuote) {
      setIsDuplicateOrderDialogOpen(true);
      return;
    }

    setIsCreateOrderDialogOpen(true);
  }

  function handleCancelCreateOrderDialog() {
    setIsCreateOrderDialogOpen(false);
  }

  function handleCancelDuplicateOrderDialog() {
    setIsDuplicateOrderDialogOpen(false);
  }

  function handleCancelRequiredFieldsDialog() {
    setIsRequiredFieldsDialogOpen(false);
  }

  function handleCreateOrderFromQuote() {
    if (!selectedQuote) {
      setIsCreateOrderDialogOpen(false);
      return;
    }

    if (quoteRequiredFieldIssues.length > 0) {
      setIsCreateOrderDialogOpen(false);
      setIsRequiredFieldsDialogOpen(true);
      return;
    }

    if (existingOrderForSelectedQuote) {
      setIsCreateOrderDialogOpen(false);
      setIsDuplicateOrderDialogOpen(true);
      return;
    }

    const acceptedQuote: PrintPilotQuote = {
      ...selectedQuote,
      status: "Angenommen",
      badgeVariant: "success",
    };

    const newOrder = createPrintPilotOrderFromQuote(acceptedQuote, settings);

    addOrder(newOrder);
    updateQuote(acceptedQuote);
    saveDraft(acceptedQuote);
    setIsEditing(false);
    setIsCreateOrderDialogOpen(false);
  }

  function handleIssueQuote() {
    if (!draft) {
      return;
    }

    const issuedQuote: PrintPilotQuote = {
      ...(draft as PrintPilotQuote),
      status: "Offen",
    };

    updateQuote(issuedQuote);
    saveDraft(issuedQuote);
    setIsEditing(false);

    if (activeTab !== "Alle Angebote") {
      setActiveTab("Alle Angebote");
    }

    window.setTimeout(() => {
      selectItem(issuedQuote.id);
      setIsDetailDrawerOpen(true);
    }, 0);
  }

  function handleSaveDraft() {
    if (!draft) {
      return;
    }

    const savedQuote = draft as PrintPilotQuote;

    updateQuote(savedQuote);
    saveDraft(savedQuote);
    setIsEditing(false);

    if (activeTab !== "Alle Angebote") {
      setActiveTab("Alle Angebote");
    }

    window.setTimeout(() => {
      selectItem(savedQuote.id);
      setIsDetailDrawerOpen(true);
    }, 0);
  }

  return (
    <div className="page">
      <PageHeader
        title={module.title}
        description={module.description}
        actionLabel={module.actionLabel}
        onAction={handleCreateNewQuote}
      />

      <PageTabs
        tabs={[...quoteTabs]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="Angebote"
          title={getQuoteTitle(activeTab)}
          statusValue={isEditing ? "Bearbeitung offen" : activeTab}
        />

        <section className="workspace-panel">
          <TableToolbar>
            <Input className="search-input" placeholder="Angebote suchen..." />

            <Button>Filter</Button>
          </TableToolbar>

          <DataTable>
            <thead>
              <tr>
                <SortableTableHeader
                    sortKey="number"
                    label={quoteSortLabels.number}
                    sortConfig={quoteSortConfig}
                    onSort={handleQuoteSort}
                  />
                <SortableTableHeader
                    sortKey="customerName"
                    label={quoteSortLabels.customerName}
                    sortConfig={quoteSortConfig}
                    onSort={handleQuoteSort}
                  />
                <SortableTableHeader
                    sortKey="subject"
                    label={quoteSortLabels.subject}
                    sortConfig={quoteSortConfig}
                    onSort={handleQuoteSort}
                  />
                <SortableTableHeader
                    sortKey="quoteDate"
                    label={quoteSortLabels.quoteDate}
                    sortConfig={quoteSortConfig}
                    onSort={handleQuoteSort}
                  />
                <SortableTableHeader
                    sortKey="status"
                    label={quoteSortLabels.status}
                    sortConfig={quoteSortConfig}
                    onSort={handleQuoteSort}
                  />
              </tr>
            </thead>

            <tbody>
              {sortedQuoteRows.map((quote) => {
                const isSelected =
                  isDetailDrawerOpen && quote.id === selectedQuote?.id;

                return (
                  <tr
                    key={quote.id}
                    className={
                      isSelected ? "data-table-row-selected" : undefined
                    }
                    onClick={() => handleQuoteSelect(quote.id)}
                  >
                    <td style={{ whiteSpace: "nowrap" }}>{quote.number}</td>
                    <td>{quote.customerName}</td>
                    <td>{quote.subject}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{formatPrintPilotDateString(quote.quoteDate, settings.dateFormat)}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <Badge variant={getPrintPilotStatusBadgeVariant(quote.status)}>
                        {quote.status}
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
        open={isDetailDrawerOpen && Boolean(selectedQuote)}
        eyebrow="Angebot"
        title={draft?.number ?? selectedQuote?.number ?? "Angebot"}
        subtitle={
          selectedQuote
            ? `${selectedQuote.customerName} · ${selectedQuote.subject}`
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

            <Button onClick={handleOpenPreviewDialog}>Vorschau prüfen</Button>
            <Button variant="primary" onClick={handleOpenCreateOrderDialog}>
              Auftrag erstellen
            </Button>

            <SaveActionButton
              isDirty={isDirty}
              defaultLabel="Angebot ausgeben"
              onClick={handleIssueQuote}
            />
          </>
        }
      >
        <WorkflowHints hints={quoteWorkflowHints} />

        <div className="detail-drawer-stack">
          <section className="detail-drawer-panel">
            <SectionHeader>Angebotskopf</SectionHeader>

            <FieldGrid>
              <Field label="Angebotsnummer">
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
                      event.target.value as PrintPilotQuoteStatus,
                    )
                  }
                >
                  <option>Entwurf</option>
                  <option>Offen</option>
                  <option>Angenommen</option>
                  <option>Abgelehnt</option>
                </Select>
              </Field>

              <Field label="Angebotsdatum">
                <Input
                  type="date"
                  value={draft?.quoteDate ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("quoteDate", event.target.value)
                  }
                />
              </Field>

              <Field label="Gültig bis">
                <Input
                  type="date"
                  value={draft?.validUntil ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("validUntil", event.target.value)
                  }
                />
              </Field>
            </FieldGrid>

            <SectionHeader>Konditionen</SectionHeader>

            <FieldGrid>
              <Field label="Zahlungsbedingungen">
                <Input
                  value={draft?.paymentTerms ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("paymentTerms", event.target.value)
                  }
                />
              </Field>

              <Field label="Lieferbedingungen">
                <Input
                  value={draft?.deliveryTerms ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("deliveryTerms", event.target.value)
                  }
                />
              </Field>

              <Field label="Vorlage">
                <Input
                  value={draft?.template ?? ""}
                  readOnly={!canEdit}
                  onChange={(event) =>
                    updateDraftField("template", event.target.value)
                  }
                />
              </Field>
            </FieldGrid>
          </section>
        </div>
      </DetailDrawer>

      <DocumentPreviewDialog
        open={isPreviewDialogOpen && Boolean(draft ?? selectedQuote)}
        eyebrow="Angebotsvorschau"
        title={(draft as PrintPilotQuote | undefined)?.number ?? selectedQuote?.number ?? "Angebot"}
        subtitle={
          (draft as PrintPilotQuote | undefined)?.customerName ??
          selectedQuote?.customerName ??
          "Kein Kunde hinterlegt"
        }
        fields={[
          {
            label: "Kunde",
            value:
              (draft as PrintPilotQuote | undefined)?.customerName ??
              selectedQuote?.customerName,
          },
          {
            label: "Betreff / Produkt",
            value:
              (draft as PrintPilotQuote | undefined)?.subject ??
              selectedQuote?.subject,
          },
          {
            label: "Status",
            value:
              (draft as PrintPilotQuote | undefined)?.status ??
              selectedQuote?.status,
          },
          {
            label: "Angebotsdatum",
            value:
              (draft as PrintPilotQuote | undefined)?.quoteDate ??
              selectedQuote?.quoteDate,
          },
          {
            label: "Gültig bis",
            value:
              (draft as PrintPilotQuote | undefined)?.validUntil ??
              selectedQuote?.validUntil,
          },
          {
            label: "Zahlungsbedingungen",
            value:
              (draft as PrintPilotQuote | undefined)?.paymentTerms ??
              selectedQuote?.paymentTerms,
          },
          {
            label: "Lieferbedingungen",
            value:
              (draft as PrintPilotQuote | undefined)?.deliveryTerms ??
              selectedQuote?.deliveryTerms,
          },
          {
            label: "Vorlage",
            value:
              (draft as PrintPilotQuote | undefined)?.template ??
              selectedQuote?.template,
          },
        ]}
        onClose={handleClosePreviewDialog}
      />

      <ConfirmDialog
        open={isRequiredFieldsDialogOpen && Boolean(selectedQuote)}
        title="Auftrag kann nicht erstellt werden"
        description={
          <>
            Aus diesem Angebot kann noch kein Auftrag erzeugt werden, weil
            Pflichtangaben fehlen.
          </>
        }
        details={
          <>
            {quoteRequiredFieldIssues.map((issue) => (
              <span key={issue}>
                <strong>Fehlt:</strong> {issue}
              </span>
            ))}
          </>
        }
        variant="warning"
        cancelLabel="Schließen"
        confirmLabel="Verstanden"
        onCancel={handleCancelRequiredFieldsDialog}
        onConfirm={handleCancelRequiredFieldsDialog}
      />

      <ConfirmDialog
        open={isCreateOrderDialogOpen && Boolean(selectedQuote)}
        title="Angebot in Auftrag umwandeln?"
        description={
          <>
            Aus dem ausgewählten Angebot wird ein neuer Auftrag erzeugt. Das
            Angebot wird dabei auf „Angenommen“ gesetzt und eindeutig mit dem
            neuen Auftrag verknüpft.
          </>
        }
        details={
          selectedQuote ? (
            <>
              <span>
                <strong>Angebot:</strong> {selectedQuote.number}
              </span>
              <span>
                <strong>Kunde:</strong> {selectedQuote.customerName}
              </span>
              <span>
                <strong>Produkt:</strong> {selectedQuote.subject}
              </span>
              <span>
                <strong>Status Angebot danach:</strong> Angenommen
              </span>
              <span>
                <strong>Status neuer Auftrag:</strong> Neu
              </span>
            </>
          ) : null
        }
        variant="default"
        cancelLabel="Abbrechen"
        confirmLabel="Auftrag erstellen"
        onCancel={handleCancelCreateOrderDialog}
        onConfirm={handleCreateOrderFromQuote}
      />

      <ConfirmDialog
        open={isDuplicateOrderDialogOpen && Boolean(selectedQuote)}
        title="Auftrag existiert bereits"
        description={
          <>
            Für dieses Angebot existiert bereits ein Auftrag. Es wird kein
            weiterer Auftrag erzeugt, damit keine Dublette entsteht.
          </>
        }
        details={
          selectedQuote ? (
            <>
              <span>
                <strong>Angebot:</strong> {selectedQuote.number}
              </span>
              <span>
                <strong>Kunde:</strong> {selectedQuote.customerName}
              </span>
              <span>
                <strong>Produkt:</strong> {selectedQuote.subject}
              </span>
              {existingOrderForSelectedQuote && (
                <span>
                  <strong>Vorhandener Auftrag:</strong>{" "}
                  {existingOrderForSelectedQuote.number}
                </span>
              )}
            </>
          ) : null
        }
        variant="warning"
        cancelLabel="Schließen"
        confirmLabel="Verstanden"
        onCancel={handleCancelDuplicateOrderDialog}
        onConfirm={handleCancelDuplicateOrderDialog}
      />
    </div>
  );
}
