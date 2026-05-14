import { useMemo, useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";
import {
  type PrintPilotQuote,
  type PrintPilotQuoteStatus,
  createPrintPilotOrderFromQuote,
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

const quoteTabs = [
  "Alle Angebote",
  "Entwurf",
  "Offen",
  "Angenommen",
  "Abgelehnt",
] as const;

type QuoteTab = "Alle Angebote" | PrintPilotQuoteStatus;

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

export function QuotesPage() {
  const module = getModuleConfig("quotes");
  const { addOrder, orders, quotes, updateQuote } = usePrintPilotStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isCreateOrderDialogOpen, setIsCreateOrderDialogOpen] = useState(false);
  const [isDuplicateOrderDialogOpen, setIsDuplicateOrderDialogOpen] =
    useState(false);

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
    initialTab: "Alle Angebote",
  });

  const { draft, isDirty, updateDraftField, resetDraft, saveDraft } =
    useEditableDraft(selectedQuote);

  const canEdit = isEditing && Boolean(draft);
  const existingOrderForSelectedQuote = selectedQuote
    ? orders.find((order) => order.quoteId === selectedQuote.id)
    : undefined;

  function handleTabChange(tab: string) {
    if (isQuoteTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
      setIsDetailDrawerOpen(false);
      setIsCreateOrderDialogOpen(false);
      setIsDuplicateOrderDialogOpen(false);
    }
  }

  function handleQuoteSelect(quoteId: string) {
    selectItem(quoteId);
    setIsEditing(false);
    setIsDetailDrawerOpen(true);
    setIsCreateOrderDialogOpen(false);
    setIsDuplicateOrderDialogOpen(false);
  }

  function handleCloseDetailDrawer() {
    setIsEditing(false);
    setIsDetailDrawerOpen(false);
    setIsCreateOrderDialogOpen(false);
    setIsDuplicateOrderDialogOpen(false);
  }

  function handleResetDraft() {
    resetDraft();
    setIsEditing(false);
    setIsCreateOrderDialogOpen(false);
  }

  function handleToggleEditing() {
    setIsEditing((currentValue) => !currentValue);
  }

  function handleOpenCreateOrderDialog() {
    if (!selectedQuote) {
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

  function createOrderFromSelectedQuote() {
    if (!selectedQuote) {
      return;
    }

    const newOrder = createPrintPilotOrderFromQuote(selectedQuote, orders);

    addOrder(newOrder);
  }

  function handleCreateOrderFromQuote() {
    createOrderFromSelectedQuote();
    setIsCreateOrderDialogOpen(false);
  }

  function handleCreateAdditionalOrderFromQuote() {
    createOrderFromSelectedQuote();
    setIsDuplicateOrderDialogOpen(false);
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
                <th>Angebot</th>
                <th>Kunde</th>
                <th>Betreff</th>
                <th>Datum</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {quoteRows.map((quote) => {
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
                    <td style={{ whiteSpace: "nowrap" }}>{quote.quoteDate}</td>
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

            <Button variant="primary" onClick={handleOpenCreateOrderDialog}>
              Auftrag erstellen
            </Button>

            <SaveActionButton
              isDirty={isDirty}
              defaultLabel="Angebot speichern"
              onClick={handleSaveDraft}
            />
          </>
        }
      >
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

      <ConfirmDialog
        open={isCreateOrderDialogOpen && Boolean(selectedQuote)}
        title="Angebot in Auftrag umwandeln?"
        description={
          <>
            Aus dem ausgewählten Angebot wird ein neuer Auftrag erzeugt. Das
            Angebot bleibt unverändert erhalten.
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
            Für dieses Angebot existiert bereits ein Auftrag. Du kannst
            trotzdem bewusst einen weiteren Auftrag aus diesem Angebot erstellen.
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
        cancelLabel="Abbrechen"
        confirmLabel="Weiteren Auftrag erstellen"
        onCancel={handleCancelDuplicateOrderDialog}
        onConfirm={handleCreateAdditionalOrderFromQuote}
      />
    </div>
  );
}
