import { useMemo, useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";
import {
  type PrintPilotQuote,
  type PrintPilotQuoteStatus,
  groupPrintPilotQuotesByStatus,
} from "../data/printPilotStore";
import { usePrintPilotStore } from "../store/PrintPilotStore";

import { useEditableDraft } from "../hooks/useEditableDraft";
import { useMasterDetailSelection } from "../hooks/useMasterDetailSelection";

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

const quoteTabs = ["Entwurf", "Offen", "Angenommen", "Abgelehnt"] as const;

type QuoteTab = PrintPilotQuoteStatus;

function getQuoteTitle(tab: QuoteTab) {
  switch (tab) {
    case "Entwurf":
      return "Angebot erstellen";

    case "Offen":
      return "Offenes Angebot prüfen";

    case "Angenommen":
      return "Angenommenes Angebot";

    case "Abgelehnt":
      return "Abgelehntes Angebot";
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
    return groupPrintPilotQuotesByStatus(quotes);
  }, [quotes]);

  const {
    activeTab,
    rows: quoteRows,
    selectedItem: selectedQuote,
    setActiveTab,
    selectItem,
  } = useMasterDetailSelection({
    rowsByTab: quoteRowsByTab,
    initialTab: "Entwurf",
  });

  const { draft, isDirty, updateDraftField, resetDraft, saveDraft } =
    useEditableDraft(selectedQuote);

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

    updateQuote(draft as PrintPilotQuote);
    saveDraft();
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
        tabs={[...quoteTabs]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="Angebotsmaske"
          title={getQuoteTitle(activeTab)}
          statusValue={activeTab}
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
                <Input value={draft?.customerName ?? ""} readOnly />
              </Field>

              <Field label="Angebotsdatum">
                <Input
                  type="date"
                  value={draft?.quoteDate ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("quoteDate", event.target.value)
                  }
                />
              </Field>

              <Field label="Betreff">
                <Input
                  value={draft?.subject ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("subject", event.target.value)
                  }
                />
              </Field>

              <Field label="Gültig bis">
                <Input
                  type="date"
                  value={draft?.validUntil ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("validUntil", event.target.value)
                  }
                />
              </Field>

              <Field label="Status">
                <Select value={activeTab} disabled>
                  {quoteTabs.map((tab) => (
                    <option key={tab}>{tab}</option>
                  ))}
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Positionen</SectionHeader>

            <div className="master-position-table">
              <DataTable>
                <thead>
                  <tr>
                    <th>Pos.</th>

                    <th>Bezeichnung</th>

                    <th>Menge</th>

                    <th>Einheit</th>

                    <th>Netto</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>1</td>

                    <td>Druckprodukt aus Kalkulation übernehmen</td>

                    <td>—</td>

                    <td>Stk.</td>

                    <td>—</td>
                  </tr>

                  <tr>
                    <td>2</td>

                    <td>Optionale Zusatzleistung</td>

                    <td>—</td>

                    <td>pauschal</td>

                    <td>—</td>
                  </tr>

                  <tr className="data-table-summary-row">
                    <td colSpan={4}>Zwischensumme netto</td>

                    <td>—</td>
                  </tr>
                </tbody>
              </DataTable>
            </div>

            <SectionHeader>Konditionen & Ausgabe</SectionHeader>

            <FieldGrid>
              <Field label="Zahlungsbedingungen">
                <Select
                  value={draft?.paymentTerms ?? ""}
                  disabled={!isEditing}
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

              <Field label="Lieferbedingungen">
                <Select
                  value={draft?.deliveryTerms ?? ""}
                  disabled={!isEditing}
                  onChange={(event) =>
                    updateDraftField("deliveryTerms", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Lieferung wählen
                  </option>

                  <option>Abholung</option>

                  <option>Lieferung inklusive</option>

                  <option>Versand nach Aufwand</option>
                </Select>
              </Field>

              <Field label="Angebotsvorlage">
                <Select
                  value={draft?.template ?? ""}
                  disabled={!isEditing}
                  onChange={(event) =>
                    updateDraftField("template", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Vorlage wählen
                  </option>

                  <option>Standardangebot</option>

                  <option>Kurzangebot</option>

                  <option>Technisches Angebot</option>
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

              <Button>Vorschau prüfen</Button>

              <SaveActionButton
                isDirty={isDirty}
                defaultLabel="Angebot ausgeben"
                onClick={handleSaveDraft}
              />
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
