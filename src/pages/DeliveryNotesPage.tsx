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

const deliveryTabs = ["Liste", "Entwurf", "Versandbereit", "Geliefert", "Abgeschlossen"] as const;

type DeliveryTab = (typeof deliveryTabs)[number];

const deliveryRowsByTab = {
  Liste: [
    { id: "delivery-ls-2026-001", number: "LS-2026-001", customer: "Sonnendruck GmbH", order: "AU-2026-001", status: "Entwurf", badgeVariant: "success" as const },
    { id: "delivery-ls-2026-002", number: "LS-2026-002", customer: "Musterkunde GmbH", order: "AU-2026-002", status: "Versandbereit", badgeVariant: undefined },
    { id: "delivery-ls-2026-003", number: "LS-2026-003", customer: "Beispiel AG", order: "AU-2026-003", status: "Geliefert", badgeVariant: "success" as const },
  ],
  Entwurf: [
    { id: "delivery-ls-2026-001", number: "LS-2026-001", customer: "Sonnendruck GmbH", order: "AU-2026-001", status: "Entwurf", badgeVariant: "success" as const },
  ],
  Versandbereit: [
    { id: "delivery-ls-2026-002", number: "LS-2026-002", customer: "Musterkunde GmbH", order: "AU-2026-002", status: "Versandbereit", badgeVariant: undefined },
  ],
  Geliefert: [
    { id: "delivery-ls-2026-003", number: "LS-2026-003", customer: "Beispiel AG", order: "AU-2026-003", status: "Geliefert", badgeVariant: "success" as const },
  ],
  Abgeschlossen: [
    { id: "delivery-ls-2026-008", number: "LS-2026-008", customer: "Druckpartner Süd", order: "AU-2026-008", status: "Abgeschlossen", badgeVariant: "success" as const },
  ],
};

function getDeliveryTitle(tab: DeliveryTab) {
  switch (tab) {
    case "Liste": return "Lieferschein vorbereiten";
    case "Entwurf": return "Lieferscheinentwurf bearbeiten";
    case "Versandbereit": return "Versandbereiten Lieferschein prüfen";
    case "Geliefert": return "Gelieferten Lieferschein prüfen";
    case "Abgeschlossen": return "Abgeschlossenen Lieferschein";
  }
}

function getDeliveryStatus(tab: DeliveryTab) {
  if (tab === "Liste") {
    return "Entwurf";
  }

  return tab;
}

function isDeliveryTab(tab: string): tab is DeliveryTab {
  return deliveryTabs.includes(tab as DeliveryTab);
}

export function DeliveryNotesPage() {
  const module = getModuleConfig("delivery-notes");

  const {
    activeTab,
    rows: deliveryRows,
    selectedItem: selectedDeliveryNote,
    setActiveTab,
    selectItem,
  } = useMasterDetailSelection({
    rowsByTab: deliveryRowsByTab,
    initialTab: "Liste",
  });

  function handleTabChange(tab: string) {
    if (isDeliveryTab(tab)) {
      setActiveTab(tab);
    }
  }

  function handleDeliveryNoteSelect(deliveryNoteId: string) {
    selectItem(deliveryNoteId);
  }

  return (
    <div className="page">
      <PageHeader title={module.title} description={module.description} actionLabel={module.actionLabel} />

      <PageTabs tabs={[...deliveryTabs]} activeTab={activeTab} onTabChange={handleTabChange} />

      <section className="calculation-sheet">
        <WorkspaceHeader kicker="Lieferscheinmaske" title={getDeliveryTitle(activeTab)} statusValue={getDeliveryStatus(activeTab)} />

        <div className="master-detail-layout">
          <section className="workspace-panel master-list-panel">
            <TableToolbar>
              <Input className="search-input" placeholder="Lieferscheine suchen..." />
              <Button>Filter</Button>
            </TableToolbar>

            <DataTable>
              <thead>
                <tr>
                  <th>Lieferschein</th>
                  <th>Kunde</th>
                  <th>Auftrag</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {deliveryRows.map((deliveryNote) => {
                  const isSelected = deliveryNote.id === selectedDeliveryNote?.id;

                  return (
                    <tr
                      key={deliveryNote.id}
                      className={isSelected ? "data-table-row-selected" : undefined}
                      onClick={() => handleDeliveryNoteSelect(deliveryNote.id)}
                    >
                      <td>{deliveryNote.number}</td>
                      <td>{deliveryNote.customer}</td>
                      <td>{deliveryNote.order}</td>
                      <td>
                        <Badge variant={deliveryNote.badgeVariant}>{deliveryNote.status}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
          </section>

          <section className="workspace-panel master-editor-panel">
            <SectionHeader>Lieferscheinkopf</SectionHeader>

            <FieldGrid>
              <Field label="Lieferscheinnummer">
                <Input value={selectedDeliveryNote?.number ?? ""} readOnly />
              </Field>

              <Field label="Kunde">
                <Input value={selectedDeliveryNote?.customer ?? ""} readOnly />
              </Field>

              <Field label="Auftrag">
                <Input value={selectedDeliveryNote?.order ?? ""} readOnly />
              </Field>

              <Field label="Versandart">
                <Select defaultValue="">
                  <option value="" disabled>Versandart wählen</option>
                  <option>Abholung</option>
                  <option>Auslieferung</option>
                  <option>Paketdienst</option>
                  <option>Spedition</option>
                </Select>
              </Field>

              <Field label="Status">
                <Select value={activeTab} onChange={(event) => handleTabChange(event.target.value)}>
                  {deliveryTabs.map((tab) => (
                    <option key={tab}>{tab}</option>
                  ))}
                </Select>
              </Field>
            </FieldGrid>

            <SectionHeader>Lieferadresse</SectionHeader>

            <FieldGrid>
              <Field label="Empfänger">
                <Input value={selectedDeliveryNote?.customer ?? ""} readOnly />
              </Field>

              <Field label="Adresse">
                <Input placeholder="Lieferadresse" />
              </Field>
            </FieldGrid>

            <SectionHeader>Positionen</SectionHeader>

            <DataTable>
              <thead>
                <tr>
                  <th>Pos.</th>
                  <th>Bezeichnung</th>
                  <th>Menge</th>
                  <th>Einheit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Produkt aus Auftrag übernehmen</td>
                  <td>—</td>
                  <td>Stk.</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Verpackungseinheit</td>
                  <td>—</td>
                  <td>Karton</td>
                </tr>
              </tbody>
            </DataTable>

            <SectionHeader>Ausgabe</SectionHeader>

            <FieldGrid>
              <Field label="Vorlage">
                <Select defaultValue="">
                  <option value="" disabled>Vorlage wählen</option>
                  <option>Standardlieferschein</option>
                  <option>Neutraler Lieferschein</option>
                  <option>Technischer Lieferschein</option>
                </Select>
              </Field>
            </FieldGrid>

            <div className="calculation-footer">
              <Button>Entwurf speichern</Button>
              <Button>Vorschau prüfen</Button>
              <Button variant="primary">Lieferschein ausgeben</Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
