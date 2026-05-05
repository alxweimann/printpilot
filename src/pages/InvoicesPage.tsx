import { useState } from "react";

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

const invoiceTabs = ["Liste", "Entwurf", "Offen", "Bezahlt", "Überfällig"] as const;

type InvoiceTab = (typeof invoiceTabs)[number];

type InvoiceRow = {
  id: string;
  number: string;
  customer: string;
  subject: string;
  status: string;
  paymentTerms: string;
  paymentType: string;
  template: string;
  invoiceDate: string;
  dueDate: string;
  badgeVariant?: "success";
};

const invoiceRowsByTab: Record<InvoiceTab, InvoiceRow[]> = {
  Liste: [
    {
      id: "invoice-re-2026-001",
      number: "RE-2026-001",
      customer: "Sonnendruck GmbH",
      subject: "Broschüre A4",
      status: "Entwurf",
      paymentTerms: "14 Tage netto",
      paymentType: "Überweisung",
      template: "Standardrechnung",
      invoiceDate: "2026-05-05",
      dueDate: "2026-05-19",
      badgeVariant: "success",
    },
    {
      id: "invoice-re-2026-002",
      number: "RE-2026-002",
      customer: "Musterkunde GmbH",
      subject: "Flyer A5",
      status: "Offen",
      paymentTerms: "14 Tage netto",
      paymentType: "Überweisung",
      template: "Standardrechnung",
      invoiceDate: "2026-05-03",
      dueDate: "2026-05-17",
      badgeVariant: undefined,
    },
    {
      id: "invoice-re-2026-003",
      number: "RE-2026-003",
      customer: "Beispiel AG",
      subject: "Folder DIN lang",
      status: "Bezahlt",
      paymentTerms: "30 Tage netto",
      paymentType: "Überweisung",
      template: "Kurzrechnung",
      invoiceDate: "2026-04-22",
      dueDate: "2026-05-22",
      badgeVariant: "success",
    },
  ],
  Entwurf: [
    {
      id: "invoice-re-2026-001",
      number: "RE-2026-001",
      customer: "Sonnendruck GmbH",
      subject: "Broschüre A4",
      status: "Entwurf",
      paymentTerms: "14 Tage netto",
      paymentType: "Überweisung",
      template: "Standardrechnung",
      invoiceDate: "2026-05-05",
      dueDate: "2026-05-19",
      badgeVariant: "success",
    },
  ],
  Offen: [
    {
      id: "invoice-re-2026-002",
      number: "RE-2026-002",
      customer: "Musterkunde GmbH",
      subject: "Flyer A5",
      status: "Offen",
      paymentTerms: "14 Tage netto",
      paymentType: "Überweisung",
      template: "Standardrechnung",
      invoiceDate: "2026-05-03",
      dueDate: "2026-05-17",
      badgeVariant: undefined,
    },
  ],
  Bezahlt: [
    {
      id: "invoice-re-2026-003",
      number: "RE-2026-003",
      customer: "Beispiel AG",
      subject: "Folder DIN lang",
      status: "Bezahlt",
      paymentTerms: "30 Tage netto",
      paymentType: "Überweisung",
      template: "Kurzrechnung",
      invoiceDate: "2026-04-22",
      dueDate: "2026-05-22",
      badgeVariant: "success",
    },
  ],
  Überfällig: [
    {
      id: "invoice-re-2026-009",
      number: "RE-2026-009",
      customer: "Testkunde KG",
      subject: "Plakat A1",
      status: "Überfällig",
      paymentTerms: "Sofort ohne Abzug",
      paymentType: "Überweisung",
      template: "Standardrechnung",
      invoiceDate: "2026-04-01",
      dueDate: "2026-04-15",
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

  const [isEditing, setIsEditing] = useState(false);

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

  const { draft, updateDraftField, resetDraft } =
    useEditableDraft(selectedInvoice);

  function handleTabChange(tab: string) {
    if (isInvoiceTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
    }
  }

  function handleInvoiceSelect(invoiceId: string) {
    selectItem(invoiceId);
    setIsEditing(false);
  }

  function handleResetDraft() {
    resetDraft();
    setIsEditing(false);
  }

  function handleToggleEditing() {
    setIsEditing((currentValue) => !currentValue);
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
                {invoiceRows.map((invoice) => {
                  const isSelected = invoice.id === selectedInvoice?.id;

                  return (
                    <tr
                      key={invoice.id}
                      className={
                        isSelected ? "data-table-row-selected" : undefined
                      }
                      onClick={() => handleInvoiceSelect(invoice.id)}
                    >
                      <td>{invoice.number}</td>
                      <td>{invoice.customer}</td>
                      <td>{invoice.subject}</td>
                      <td>
                        <Badge variant={invoice.badgeVariant}>
                          {invoice.status}
                        </Badge>
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
                <Input value={draft?.number ?? ""} readOnly />
              </Field>

              <Field label="Kunde">
                <Input value={draft?.customer ?? ""} readOnly />
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

              <Field label="Rechnungsdatum">
                <Input
                  type="date"
                  value={draft?.invoiceDate ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("invoiceDate", event.target.value)
                  }
                />
              </Field>

              <Field label="Fällig am">
                <Input
                  type="date"
                  value={draft?.dueDate ?? ""}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    updateDraftField("dueDate", event.target.value)
                  }
                />
              </Field>

              <Field label="Status">
                <Select
                  value={activeTab}
                  disabled={!isEditing}
                  onChange={(event) => handleTabChange(event.target.value)}
                >
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

              <Field label="Zahlungsart">
                <Select
                  value={draft?.paymentType ?? ""}
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

            <div className="calculation-footer">
              <button
                type="button"
                aria-label={
                  isEditing ? "Bearbeitung sperren" : "Bearbeitung öffnen"
                }
                title={isEditing ? "Bearbeitung sperren" : "Bearbeitung öffnen"}
                onClick={handleToggleEditing}
                style={{
                  alignItems: "center",
                  alignSelf: "center",
                  background: "transparent",
                  border: 0,
                  boxShadow: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  fontSize: "1.55rem",
                  height: "2.5rem",
                  justifyContent: "center",
                  lineHeight: 1,
                  padding: 0,
                  width: "1.65rem",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    alignItems: "center",
                    display: "inline-flex",
                    height: "100%",
                    justifyContent: "center",
                    transform: "translateY(-4px)",
                  }}
                >
                  {isEditing ? "🔓" : "🔒"}
                </span>
              </button>

              <Button onClick={handleResetDraft}>Änderungen verwerfen</Button>
              <Button>Vorschau prüfen</Button>
              <Button variant="primary">Rechnung ausgeben</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
