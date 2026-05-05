import { useState } from "react";
import { getModuleConfig } from "../app/moduleConfig";
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
    {
      number: "RE-2026-001",
      customer: "Sonnendruck GmbH",
      subject: "Broschüre A4",
      status: "Entwurf",
      badgeVariant: "success" as const,
    },
    {
      number: "RE-2026-002",
      customer: "Musterkunde GmbH",
      subject: "Flyer A5",
      status: "Offen",
      badgeVariant: undefined,
    },
    {
      number: "RE-2026-003",
      customer: "Beispiel AG",
      subject: "Folder DIN lang",
      status: "Bezahlt",
      badgeVariant: "success" as const,
    },
  ],
  Entwurf: [
    {
      number: "RE-2026-001",
      customer: "Sonnendruck GmbH",
      subject: "Broschüre A4",
      status: "Entwurf",
      badgeVariant: "success" as const,
    },
  ],
  Offen: [
    {
      number: "RE-2026-002",
      customer: "Musterkunde GmbH",
      subject: "Flyer A5",
      status: "Offen",
      badgeVariant: undefined,
    },
  ],
  Bezahlt: [
    {
      number: "RE-2026-003",
      customer: "Beispiel AG",
      subject: "Folder DIN lang",
      status: "Bezahlt",
      badgeVariant: "success" as const,
    },
  ],
  Überfällig: [
    {
      number: "RE-2026-009",
      customer: "Testkunde KG",
      subject: "Plakat A1",
      status: "Überfällig",
      badgeVariant: undefined,
    },
  ],
};

function getInvoiceTitle(tab: InvoiceTab) {
  switch (tab) {
    case "Liste":
      return "Rechnung vorbereiten";
    case "Entwurf":
      return "Rechnungsentwurf bearbeiten";
    case "Offen":
      return "Offene Rechnung prüfen";
    case "Bezahlt":
      return "Bezahlte Rechnung";
    case "Überfällig":
      return "Überfällige Rechnung";
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
  const [activeTab, setActiveTab] = useState<InvoiceTab>("Liste");
  const invoiceRows = invoiceRowsByTab[activeTab];
  const selectedInvoice = invoiceRows[0];

  function handleTabChange(tab: string) {
    if (isInvoiceTab(tab)) {
      setActiveTab(tab);
    }
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
          kicker="Rechnungsmaske"
          title={getInvoiceTitle(activeTab)}
          statusValue={getInvoiceStatus(activeTab)}
        />

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
                {invoiceRows.map((invoice, index) => (
                  <tr
                    key={invoice.number}
                    className={index === 0 ? "data-table-row-selected" : undefined}
                  >
                    <td>{invoice.number}</td>
                    <td>{invoice.customer}</td>
                    <td>{invoice.subject}</td>
                    <td>
                      <Badge variant={invoice.badgeVariant}>{invoice.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel master-editor-panel">
            <SectionHeader>Rechnungskopf</SectionHeader>

            <FieldGrid>
              <Field label="Rechnungsnummer">
                <Input value={selectedInvoice.number} readOnly />
              </Field>

              <Field label="Quelle">
                <Input value={selectedInvoice.subject} readOnly />
              </Field>

              <Field label="Kunde">
                <Input value={selectedInvoice.customer} readOnly />
              </Field>

              <Field label="Rechnungsdatum">
                <Input type="date" />
              </Field>

              <Field label="Fällig am">
                <Input type="date" />
              </Field>

              <Field label="Status">
                <Select
                  value={getInvoiceStatus(activeTab)}
                  onChange={(event) => handleTabChange(event.target.value)}
                >
                  <option>Entwurf</option>
                  <option>Offen</option>
                  <option>Bezahlt</option>
                  <option>Überfällig</option>
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
            </div>

            <SectionHeader>Zahlung & Ausgabe</SectionHeader>

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

              <Field label="Zahlungsart">
                <Select defaultValue="">
                  <option value="" disabled>
                    Zahlungsart wählen
                  </option>
                  <option>Überweisung</option>
                  <option>Barzahlung</option>
                  <option>EC / Karte</option>
                  <option>Lastschrift</option>
                </Select>
              </Field>

              <Field label="Rechnungsvorlage">
                <Select defaultValue="">
                  <option value="" disabled>
                    Vorlage wählen
                  </option>
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
