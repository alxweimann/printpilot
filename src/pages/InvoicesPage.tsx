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

const invoiceTabs = ["Liste", "Entwurf", "Offen", "Bezahlt", "Überfällig"] as const;

type InvoiceTab = (typeof invoiceTabs)[number];

const invoiceRowsByTab = {
  Liste: [
    { id: "invoice-re-2026-001", number: "RE-2026-001", customer: "Sonnendruck GmbH", subject: "Broschüre A4", status: "Entwurf", badgeVariant: "success" as const },
    { id: "invoice-re-2026-002", number: "RE-2026-002", customer: "Musterkunde GmbH", subject: "Flyer A5", status: "Offen", badgeVariant: undefined },
    { id: "invoice-re-2026-003", number: "RE-2026-003", customer: "Beispiel AG", subject: "Folder DIN lang", status: "Bezahlt", badgeVariant: "success" as const },
  ],
  Entwurf: [
    { id: "invoice-re-2026-001", number: "RE-2026-001", customer: "Sonnendruck GmbH", subject: "Broschüre A4", status: "Entwurf", badgeVariant: "success" as const },
  ],
  Offen: [
    { id: "invoice-re-2026-002", number: "RE-2026-002", customer: "Musterkunde GmbH", subject: "Flyer A5", status: "Offen", badgeVariant: undefined },
  ],
  Bezahlt: [
    { id: "invoice-re-2026-003", number: "RE-2026-003", customer: "Beispiel AG", subject: "Folder DIN lang", status: "Bezahlt", badgeVariant: "success" as const },
  ],
  Überfällig: [
    { id: "invoice-re-2026-009", number: "RE-2026-009", customer: "Testkunde KG", subject: "Plakat A1", status: "Überfällig", badgeVariant: undefined },
  ],
};

function getInvoiceTitle(tab: InvoiceTab) {
  switch (tab) {
    case "Liste": return "Rechnung vorbereiten";
    case "Entwurf": return "Rechnungsentwurf bearbeiten";
    case "Offen": return "Offene Rechnung prüfen";
    case "Bezahlt": return "Bezahlte Rechnung";
    case "Überfällig": return "Überfällige Rechnung";
  }
}

function getInvoiceStatus(tab: InvoiceTab) {
  if (tab === "Liste") {
    return "Entwurf";
  }

  return tab;
}

function isInvoiceTab(tab: string): tab is InvoiceTab {
  return invoiceTabs.includes(tab as InvoiceTab);
}

export function InvoicesPage() {
  const module = getModuleConfig("invoices");

  const {
    activeTab,
    rows: invoiceRows,
    selectedItem: selectedInvoice,
    setActiveTab,
    selectItem,
  } = useMasterDetailSelection({
    rowsByTab: invoiceRowsByTab,
    initialTab: "Liste",
  });

  function handleTabChange(tab: string) {
    if (isInvoiceTab(tab)) {
      setActiveTab(tab);
    }
  }

  function handleInvoiceSelect(invoiceId: string) {
    selectItem(invoiceId);
  }

  return (
    <div className="page">
      <PageHeader title={module.title} description={module.description} actionLabel={module.actionLabel} />

      <PageTabs tabs={[...invoiceTabs]} activeTab={activeTab} onTabChange={handleTabChange} />

      <section className="calculation-sheet">
        <WorkspaceHeader kicker="Rechnungsmaske" title={getInvoiceTitle(activeTab)} statusValue={getInvoiceStatus(activeTab)} />

        <div className="master-detail-layout">
          <section className="workspace-panel master-list-panel">
            <TableToolbar>
              <Input className="search-input" placeholder="Rechnungen suchen..." />
              <Button>Filter</Button>
            </TableToolbar>

            <DataTable>
              <thead>
                <tr>
                  <th>Rechnung</th>
                  <th>Kunde</th>
                  <th>Betreff</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {invoiceRows.map((invoice) => {
                  const isSelected = invoice.id === selectedInvoice?.id;

                  return (
                    <tr
                      key={invoice.id}
                      className={isSelected ? "data-table-row-selected" : undefined}
                      onClick={() => handleInvoiceSelect(invoice.id)}
                    >
                      <td>{invoice.number}</td>
                      <td>{invoice.customer}</td>
                      <td>{invoice.subject}</td>
                      <td>
                        <Badge variant={invoice.badgeVariant}>{invoice.status}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel master-editor-panel">
            <SectionHeader>Rechnungskopf</SectionHeader>

            <FieldGrid>
              <Field label="Rechnungsnummer">
                <Input value={selectedInvoice?.number ?? ""} readOnly />
              </Field>

              <Field label="Kunde">
                <Input value={selectedInvoice?.customer ?? ""} readOnly />
              </Field>

              <Field label="Betreff">
                <Input value={selectedInvoice?.subject ?? ""} readOnly />
              </Field>

              <Field label="Status">
                <Select value={activeTab} onChange={(event) => handleTabChange(event.target.value)}>
                  {invoiceTabs.map((tab) => (
                    <option key={tab}>{tab}</option>
                  ))}
                </Select>
              </Field>
            </FieldGrid>

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

            <SectionHeader>Zahlung & Ausgabe</SectionHeader>

            <FieldGrid>
              <Field label="Bedingungen">
                <Select defaultValue="">
                  <option value="" disabled>Bedingungen wählen</option>
                  <option>Zahlbar sofort ohne Abzug</option>
                  <option>14 Tage netto</option>
                  <option>30 Tage netto</option>
                </Select>
              </Field>

              <Field label="Zahlungsart">
                <Select defaultValue="">
                  <option value="" disabled>Zahlungsart wählen</option>
                  <option>Überweisung</option>
                  <option>Barzahlung</option>
                  <option>EC / Karte</option>
                  <option>Lastschrift</option>
                </Select>
              </Field>

              <Field label="Vorlage">
                <Select defaultValue="">
                  <option value="" disabled>Vorlage wählen</option>
                  <option>Standardrechnung</option>
                  <option>Kurzrechnung</option>
                  <option>Technische Rechnung</option>
                </Select>
              </Field>
            </FieldGrid>

            <div className="calculation-footer">
              <Button>Entwurf speichern</Button>
              <Button>Vorschau prüfen</Button>
              <Button variant="primary">Rechnung ausgeben</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
