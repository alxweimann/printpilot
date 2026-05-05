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

const quoteTabs = ["Entwurf", "Offen", "Angenommen", "Abgelehnt"] as const;

type QuoteTab = (typeof quoteTabs)[number];

type QuoteRow = {
  id: string;
  number: string;
  customer: string;
  subject: string;
  status: QuoteTab;
  quoteDate: string;
  validUntil: string;
  paymentTerms: string;
  deliveryTerms: string;
  template: string;
  badgeVariant?: "success";
};

const quoteRowsByTab: Record<QuoteTab, QuoteRow[]> = {
  Entwurf: [
    {
      id: "quote-ag-2026-001",
      number: "AG-2026-001",
      customer: "Sonnendruck GmbH",
      subject: "Broschüre A4",
      status: "Entwurf",
      quoteDate: "2026-05-05",
      validUntil: "2026-05-19",
      paymentTerms: "14 Tage netto",
      deliveryTerms: "Abholung",
      template: "Standardangebot",
      badgeVariant: "success",
    },
    {
      id: "quote-ag-2026-004",
      number: "AG-2026-004",
      customer: "Agentur Beispiel",
      subject: "Visitenkarten",
      status: "Entwurf",
      quoteDate: "2026-05-04",
      validUntil: "2026-05-18",
      paymentTerms: "Zahlbar sofort ohne Abzug",
      deliveryTerms: "Versand nach Aufwand",
      template: "Kurzangebot",
      badgeVariant: undefined,
    },
  ],
  Offen: [
    {
      id: "quote-ag-2026-002",
      number: "AG-2026-002",
      customer: "Musterkunde GmbH",
      subject: "Flyer A5",
      status: "Offen",
      quoteDate: "2026-05-03",
      validUntil: "2026-05-17",
      paymentTerms: "14 Tage netto",
      deliveryTerms: "Lieferung inklusive",
      template: "Standardangebot",
      badgeVariant: undefined,
    },
    {
      id: "quote-ag-2026-005",
      number: "AG-2026-005",
      customer: "Druckpartner Süd",
      subject: "Plakat A2",
      status: "Offen",
      quoteDate: "2026-05-02",
      validUntil: "2026-05-16",
      paymentTerms: "30 Tage netto",
      deliveryTerms: "Versand nach Aufwand",
      template: "Technisches Angebot",
      badgeVariant: undefined,
    },
  ],
  Angenommen: [
    {
      id: "quote-ag-2026-006",
      number: "AG-2026-006",
      customer: "Beispiel AG",
      subject: "Folder DIN lang",
      status: "Angenommen",
      quoteDate: "2026-04-29",
      validUntil: "2026-05-13",
      paymentTerms: "14 Tage netto",
      deliveryTerms: "Lieferung inklusive",
      template: "Standardangebot",
      badgeVariant: "success",
    },
  ],
  Abgelehnt: [
    {
      id: "quote-ag-2026-007",
      number: "AG-2026-007",
      customer: "Testkunde KG",
      subject: "Einladungskarten",
      status: "Abgelehnt",
      quoteDate: "2026-04-25",
      validUntil: "2026-05-09",
      paymentTerms: "Zahlbar sofort ohne Abzug",
      deliveryTerms: "Abholung",
      template: "Kurzangebot",
      badgeVariant: undefined,
    },
  ],
};

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

  const { draft, updateDraftField, resetDraft } =
    useEditableDraft(selectedQuote);

  function handleTabChange(tab: string) {
    if (isQuoteTab(tab)) {
      setActiveTab(tab);
    }
  }

  function handleQuoteSelect(quoteId: string) {
    selectItem(quoteId);
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

                      <td>{quote.customer}</td>

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
                <Input value={draft?.customer ?? ""} readOnly />
              </Field>

              <Field label="Angebotsdatum">
                <Input
                  type="date"
                  value={draft?.quoteDate ?? ""}
                  onChange={(event) =>
                    updateDraftField("quoteDate", event.target.value)
                  }
                />
              </Field>

              <Field label="Betreff">
                <Input
                  value={draft?.subject ?? ""}
                  onChange={(event) =>
                    updateDraftField("subject", event.target.value)
                  }
                />
              </Field>

              <Field label="Gültig bis">
                <Input
                  type="date"
                  value={draft?.validUntil ?? ""}
                  onChange={(event) =>
                    updateDraftField("validUntil", event.target.value)
                  }
                />
              </Field>

              <Field label="Status">
                <Select
                  value={activeTab}
                  onChange={(event) => handleTabChange(event.target.value)}
                >
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
              <Button onClick={resetDraft}>Änderungen verwerfen</Button>

              <Button>Vorschau prüfen</Button>

              <Button variant="primary">Angebot ausgeben</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
