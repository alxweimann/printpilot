import { getModuleConfig } from "../app/moduleConfig";

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

const quoteRowsByTab = {
  Entwurf: [
    {
      id: "quote-ag-2026-001",
      number: "AG-2026-001",
      customer: "Sonnendruck GmbH",
      subject: "Broschüre A4",
      status: "Entwurf",
      badgeVariant: "success" as const,
    },
    {
      id: "quote-ag-2026-004",
      number: "AG-2026-004",
      customer: "Agentur Beispiel",
      subject: "Visitenkarten",
      status: "Entwurf",
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
      badgeVariant: undefined,
    },
    {
      id: "quote-ag-2026-005",
      number: "AG-2026-005",
      customer: "Druckpartner Süd",
      subject: "Plakat A2",
      status: "Offen",
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
      badgeVariant: "success" as const,
    },
  ],
  Abgelehnt: [
    {
      id: "quote-ag-2026-007",
      number: "AG-2026-007",
      customer: "Testkunde KG",
      subject: "Einladungskarten",
      status: "Abgelehnt",
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
                <Input value={selectedQuote?.number ?? ""} readOnly />
              </Field>

              <Field label="Kunde">
                <Input value={selectedQuote?.customer ?? ""} readOnly />
              </Field>

              <Field label="Angebotsdatum">
                <Input type="date" />
              </Field>

              <Field label="Betreff">
                <Input value={selectedQuote?.subject ?? ""} readOnly />
              </Field>

              <Field label="Gültig bis">
                <Input type="date" />
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
                <Select defaultValue="">
                  <option value="" disabled>
                    Bedingungen wählen
                  </option>

                  <option>Zahlbar sofort ohne Abzug</option>

                  <option>14 Tage netto</option>

                  <option>30 Tage netto</option>
                </Select>
              </Field>

              <Field label="Lieferbedingungen">
                <Select defaultValue="">
                  <option value="" disabled>
                    Lieferung wählen
                  </option>

                  <option>Abholung</option>

                  <option>Lieferung inklusive</option>

                  <option>Versand nach Aufwand</option>
                </Select>
              </Field>

              <Field label="Angebotsvorlage">
                <Select defaultValue="">
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
              <Button>Entwurf speichern</Button>

              <Button>Vorschau prüfen</Button>

              <Button variant="primary">Angebot ausgeben</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
