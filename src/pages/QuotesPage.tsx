import { useMemo, useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";
import {
  type PrintPilotQuote,
  type PrintPilotQuoteStatus,
  groupPrintPilotQuotesByStatus,
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
  const { quotes, updateQuote } = usePrintPilotStore();

  const [isEditing, setIsEditing] = useState(false);

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

  function handleTabChange(tab: string) {
    if (isQuoteTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
    }
  }

  function handleQuoteSelect(quoteId: string) {
    selectItem(quoteId);
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

    const savedQuote = draft as PrintPilotQuote;

    updateQuote(savedQuote);
    saveDraft(savedQuote);
    setIsEditing(false);

    if (activeTab !== "Alle Angebote") {
      setActiveTab("Alle Angebote");
    }

    window.setTimeout(() => {
      selectItem(savedQuote.id);
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

        <div className="master-detail-layout">
          <section className="workspace-panel master-list-panel">
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
                  const isSelected = quote.id === selectedQuote?.id;

                  return (
                    <tr
                      key={quote.id}
                      className={
                        isSelected ? "data-table-row-selected" : undefined
                      }
                      onClick={() => handleQuoteSelect(quote.id)}
                    >
                      <td>{quote.number}</td>
                      <td>{quote.customerName}</td>
                      <td>{quote.subject}</td>
                      <td>{quote.quoteDate}</td>
                      <td>
                        <Badge variant={quote.badgeVariant}>
                          {quote.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel master-editor-panel">
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

            <div className="calculation-footer">
              <DirtyStateNotice isDirty={isDirty} />

              <EditLockToggle
                isEditing={isEditing}
                onToggle={handleToggleEditing}
              />

              <Button onClick={handleResetDraft}>Änderungen verwerfen</Button>

              <SaveActionButton
                isDirty={isDirty}
                defaultLabel="Angebot speichern"
                onClick={handleSaveDraft}
              />
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
