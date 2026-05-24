import { useMemo, useState } from "react";

import { getModuleConfig } from "../app/moduleConfig";
import {
  type PrintPilotDeliveryNote,
  type PrintPilotDeliveryNoteStatus,
  groupPrintPilotDeliveryNotesByStatus,
} from "../data/printPilotStore";
import { getPrintPilotStatusBadgeVariant } from "../data/statusBadges";
import { useEditableDraft } from "../hooks/useEditableDraft";
import { useMasterDetailSelection } from "../hooks/useMasterDetailSelection";
import { usePrintPilotStore } from "../store/PrintPilotStore";

import { PageHeader } from "../layout/PageHeader";
import { PageTabs } from "../layout/PageTabs";

import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { DetailDrawer } from "../ui/DetailDrawer";
import { DocumentPreviewDialog } from "../ui/DocumentPreviewDialog";
import { DirtyStateNotice } from "../ui/DirtyStateNotice";
import { EditLockToggle } from "../ui/EditLockToggle";
import { Field } from "../ui/Field";
import { FieldGrid } from "../ui/FieldGrid";
import { Input } from "../ui/Input";
import { SectionHeader } from "../ui/SectionHeader";
import { SaveActionButton } from "../ui/SaveActionButton";
import { SortableTableHeader } from "../ui/SortableTableHeader";
import { Select } from "../ui/Select";
import { DataTable, TableToolbar } from "../ui/Table";
import { WorkspaceHeader } from "../ui/WorkspaceHeader";
import { WorkflowHints } from "../ui/WorkflowHints";
import { useSortableTable } from "../ui/useSortableTable";

const deliveryTabs = [
  "Liste",
  "Entwurf",
  "Versandbereit",
  "Geliefert",
  "Abgeschlossen",
] as const;

type DeliveryTab = "Liste" | PrintPilotDeliveryNoteStatus;

function getDeliveryTitle(tab: DeliveryTab) {
  switch (tab) {
    case "Liste":
      return "Lieferscheinübersicht";
    case "Entwurf":
      return "Lieferscheinentwurf bearbeiten";
    case "Versandbereit":
      return "Versandbereiten Lieferschein prüfen";
    case "Geliefert":
      return "Gelieferten Lieferschein prüfen";
    case "Abgeschlossen":
      return "Abgeschlossenen Lieferschein";
  }
}

function getDeliveryStatus(tab: DeliveryTab) {
  if (tab === "Liste") {
    return "Alle Lieferscheine";
  }

  return tab;
}

function isDeliveryTab(tab: string): tab is DeliveryTab {
  return deliveryTabs.includes(tab as DeliveryTab);
}

type DeliverySortKey =
  | "number"
  | "customerName"
  | "orderNumber"
  | "shippingMethod"
  | "status";

function getDeliverySortValue(
  deliveryNote: PrintPilotDeliveryNote,
  sortKey: DeliverySortKey,
) {
  switch (sortKey) {
    case "number":
      return deliveryNote.number;

    case "customerName":
      return deliveryNote.customerName;

    case "orderNumber":
      return deliveryNote.orderNumber;

    case "shippingMethod":
      return deliveryNote.shippingMethod;

    case "status":
      return deliveryNote.status;
  }
}

function getDeliveryNoteWorkflowHints(
  deliveryNote: PrintPilotDeliveryNote | undefined,
) {
  if (!deliveryNote) {
    return [];
  }

  const hints = [];

  if (deliveryNote.status === "Entwurf") {
    hints.push({
      title: "Lieferschein noch nicht ausgegeben",
      description:
        "Der Lieferschein ist noch ein Entwurf und sollte vor Ausgabe geprüft werden.",
      variant: "info" as const,
    });
  }

  if (deliveryNote.status === "Versandbereit") {
    hints.push({
      title: "Versand/Abholung vorbereiten",
      description:
        "Der Lieferschein ist bereit. Prüfe Versandart, Empfänger und Adresse.",
      variant: "warning" as const,
    });
  }

  if (deliveryNote.status === "Geliefert") {
    hints.push({
      title: "Lieferung prüfen",
      description:
        "Der Lieferschein ist geliefert. Prüfe, ob Rückmeldung oder Nachweis vollständig ist.",
      variant: "info" as const,
    });
  }

  if (deliveryNote.status === "Abgeschlossen") {
    hints.push({
      title: "Lieferschein abgeschlossen",
      description:
        "Der Lieferschein ist abgeschlossen und benötigt aktuell keine weitere Aktion.",
      variant: "success" as const,
    });
  }

  return hints;
}

export function DeliveryNotesPage() {
  const module = getModuleConfig("delivery-notes");
  const { deliveryNotes, updateDeliveryNote } = usePrintPilotStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);

  const deliveryRowsByTab = useMemo(() => {
    return {
      Liste: deliveryNotes,
      ...groupPrintPilotDeliveryNotesByStatus(deliveryNotes),
    };
  }, [deliveryNotes]);

  const {
    activeTab,
    rows: deliveryRows,
    selectedItem: selectedDeliveryNote,
    setActiveTab,
    selectItem,
  } = useMasterDetailSelection({
    rowsByTab: deliveryRowsByTab,
    initialTab: "Liste" as DeliveryTab,
  });

  const { draft, isDirty, updateDraftField, resetDraft, saveDraft } =
    useEditableDraft(selectedDeliveryNote);

  const canEdit = isEditing && Boolean(draft);
  const deliveryNoteWorkflowHints = getDeliveryNoteWorkflowHints(
    draft as PrintPilotDeliveryNote | undefined,
  );

  const {
    sortedRows: sortedDeliveryRows,
    sortConfig: deliverySortConfig,
    requestSort: requestDeliverySort,
  } = useSortableTable<PrintPilotDeliveryNote, DeliverySortKey>({
    rows: deliveryRows,
    initialSortKey: "number",
    getSortValue: getDeliverySortValue,
    fallbackSortValue: (deliveryNote: PrintPilotDeliveryNote) =>
      deliveryNote.number,
  });

  function handleTabChange(tab: string) {
    if (isDeliveryTab(tab)) {
      setActiveTab(tab);
      setIsEditing(false);
      setIsDetailDrawerOpen(false);
    }
  }

  function handleDeliveryNoteSelect(deliveryNoteId: string) {
    selectItem(deliveryNoteId);
    setIsEditing(false);
    setIsDetailDrawerOpen(true);
  }

  function handleCloseDrawer() {
    setIsEditing(false);
    setIsDetailDrawerOpen(false);
  }

  function handleResetDraft() {
    resetDraft();
    setIsEditing(false);
  }

  function handleToggleEditing() {
    setIsEditing((currentValue) => !currentValue);
  }

  function handleOpenPreviewDialog() {
    if (!draft && !selectedDeliveryNote) {
      return;
    }

    setIsPreviewDialogOpen(true);
  }

  function handleClosePreviewDialog() {
    setIsPreviewDialogOpen(false);
  }

  function handleSaveDeliveryNote() {
    if (!draft) {
      return;
    }

    const savedDeliveryNote = draft as PrintPilotDeliveryNote;

    updateDeliveryNote(savedDeliveryNote);
    saveDraft(savedDeliveryNote);
    setIsEditing(false);
    setIsDetailDrawerOpen(false);

    if (activeTab !== "Liste") {
      setActiveTab("Liste");
    }

    window.setTimeout(() => {
      selectItem(savedDeliveryNote.id);
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
        tabs={[...deliveryTabs]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <section className="calculation-sheet">
        <WorkspaceHeader
          kicker="LIEFERSCHEINE"
          title={getDeliveryTitle(activeTab)}
          statusValue={getDeliveryStatus(activeTab)}
        />

        <section className="workspace-panel master-list-panel">
          <TableToolbar>
            <Input className="search-input" placeholder="Lieferscheine suchen..." />
            <Button>Filter</Button>
          </TableToolbar>

          <DataTable>
            <thead>
              <tr>
                <SortableTableHeader
                  label="Lieferschein"
                  sortKey="number"
                  sortConfig={deliverySortConfig}
                  onSort={requestDeliverySort}
                />
                <SortableTableHeader
                  label="Kunde"
                  sortKey="customerName"
                  sortConfig={deliverySortConfig}
                  onSort={requestDeliverySort}
                />
                <SortableTableHeader
                  label="Auftrag"
                  sortKey="orderNumber"
                  sortConfig={deliverySortConfig}
                  onSort={requestDeliverySort}
                />
                <SortableTableHeader
                  label="Versand"
                  sortKey="shippingMethod"
                  sortConfig={deliverySortConfig}
                  onSort={requestDeliverySort}
                />
                <SortableTableHeader
                  label="Status"
                  sortKey="status"
                  sortConfig={deliverySortConfig}
                  onSort={requestDeliverySort}
                />
              </tr>
            </thead>

            <tbody>
              {sortedDeliveryRows.map((deliveryNote: PrintPilotDeliveryNote) => {
                const isSelected = deliveryNote.id === selectedDeliveryNote?.id;

                return (
                  <tr
                    key={deliveryNote.id}
                    className={isSelected ? "data-table-row-selected" : undefined}
                    onClick={() => handleDeliveryNoteSelect(deliveryNote.id)}
                  >
                    <td>{deliveryNote.number}</td>
                    <td>{deliveryNote.customerName}</td>
                    <td>{deliveryNote.orderNumber}</td>
                    <td>{deliveryNote.shippingMethod}</td>
                    <td>
                      <Badge
                        variant={getPrintPilotStatusBadgeVariant(
                          deliveryNote.status,
                        )}
                      >
                        {deliveryNote.status}
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
        open={isDetailDrawerOpen && Boolean(selectedDeliveryNote)}
        eyebrow="Lieferschein"
        title={selectedDeliveryNote?.number ?? "Lieferschein"}
        subtitle={
          selectedDeliveryNote
            ? `${selectedDeliveryNote.customerName} · ${selectedDeliveryNote.orderNumber}`
            : undefined
        }
        onClose={handleCloseDrawer}
        size="xl"
        footer={
          <>
            <DirtyStateNotice isDirty={isDirty} />

            <EditLockToggle
              isEditing={isEditing}
              onToggle={handleToggleEditing}
            />

            <Button onClick={handleResetDraft}>Änderungen verwerfen</Button>
            <Button onClick={handleOpenPreviewDialog}>Vorschau prüfen</Button>
            <SaveActionButton
              isDirty={isDirty}
              defaultLabel="Lieferschein ausgeben"
              onClick={handleSaveDeliveryNote}
            />
          </>
        }
      >
        <WorkflowHints hints={deliveryNoteWorkflowHints} />

        <section className="workspace-panel">
          <SectionHeader>Lieferscheinkopf</SectionHeader>

          <FieldGrid>
            <Field label="Lieferscheinnummer">
              <Input value={draft?.number ?? ""} readOnly />
            </Field>

            <Field label="Kunde">
              <Input value={draft?.customerName ?? ""} readOnly />
            </Field>

            <Field label="Auftrag">
              <Input value={draft?.orderNumber ?? ""} readOnly />
            </Field>

            <Field label="Versandart">
              <Select
                value={draft?.shippingMethod ?? ""}
                disabled={!canEdit}
                onChange={(event) =>
                  updateDraftField("shippingMethod", event.target.value)
                }
              >
                <option value="" disabled>
                  Versandart wählen
                </option>
                <option>Abholung</option>
                <option>Auslieferung</option>
                <option>Paketdienst</option>
                <option>Spedition</option>
              </Select>
            </Field>

            <Field label="Status">
              <Select
                value={draft?.status ?? ""}
                disabled={!canEdit}
                onChange={(event) =>
                  updateDraftField(
                    "status",
                    event.target.value as PrintPilotDeliveryNoteStatus,
                  )
                }
              >
                <option value="" disabled>
                  Status wählen
                </option>
                <option>Entwurf</option>
                <option>Versandbereit</option>
                <option>Geliefert</option>
                <option>Abgeschlossen</option>
              </Select>
            </Field>
          </FieldGrid>

          <SectionHeader>Lieferadresse</SectionHeader>

          <FieldGrid>
            <Field label="Empfänger">
              <Input
                value={draft?.recipient ?? ""}
                readOnly={!canEdit}
                onChange={(event) =>
                  updateDraftField("recipient", event.target.value)
                }
              />
            </Field>

            <Field label="Adresse">
              <Input
                value={draft?.address ?? ""}
                readOnly={!canEdit}
                onChange={(event) =>
                  updateDraftField("address", event.target.value)
                }
              />
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
                <td>{draft?.product ?? "Produkt aus Auftrag übernehmen"}</td>
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
              <Select
                value={draft?.template ?? ""}
                disabled={!canEdit}
                onChange={(event) =>
                  updateDraftField("template", event.target.value)
                }
              >
                <option value="" disabled>
                  Vorlage wählen
                </option>
                <option>Standardlieferschein</option>
                <option>Neutraler Lieferschein</option>
                <option>Technischer Lieferschein</option>
              </Select>
            </Field>
          </FieldGrid>
        </section>
      </DetailDrawer>
      <DocumentPreviewDialog
        open={isPreviewDialogOpen && Boolean(draft ?? selectedDeliveryNote)}
        eyebrow="Lieferscheinvorschau"
        title={
          (draft as PrintPilotDeliveryNote | undefined)?.number ??
          selectedDeliveryNote?.number ??
          "Lieferschein"
        }
        subtitle={
          (draft as PrintPilotDeliveryNote | undefined)?.customerName ??
          selectedDeliveryNote?.customerName ??
          "Kein Kunde hinterlegt"
        }
        fields={[
          {
            label: "Kunde",
            value:
              (draft as PrintPilotDeliveryNote | undefined)?.customerName ??
              selectedDeliveryNote?.customerName,
          },
          {
            label: "Auftrag",
            value:
              (draft as PrintPilotDeliveryNote | undefined)?.orderNumber ??
              selectedDeliveryNote?.orderNumber,
          },
          {
            label: "Produkt",
            value:
              (draft as PrintPilotDeliveryNote | undefined)?.product ??
              selectedDeliveryNote?.product,
          },
          {
            label: "Status",
            value:
              (draft as PrintPilotDeliveryNote | undefined)?.status ??
              selectedDeliveryNote?.status,
          },
          {
            label: "Versandart",
            value:
              (draft as PrintPilotDeliveryNote | undefined)?.shippingMethod ??
              selectedDeliveryNote?.shippingMethod,
          },
          {
            label: "Empfänger",
            value:
              (draft as PrintPilotDeliveryNote | undefined)?.recipient ??
              selectedDeliveryNote?.recipient,
          },
          {
            label: "Adresse",
            value:
              (draft as PrintPilotDeliveryNote | undefined)?.address ??
              selectedDeliveryNote?.address,
          },
          {
            label: "Vorlage",
            value:
              (draft as PrintPilotDeliveryNote | undefined)?.template ??
              selectedDeliveryNote?.template,
          },
        ]}
        onClose={handleClosePreviewDialog}
      />

    </div>
  );
}
