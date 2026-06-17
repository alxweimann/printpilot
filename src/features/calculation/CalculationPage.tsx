import { useMemo, useState } from "react";
import printPilotLogo from "../../assets/logo/printpilot-logo-on-navy.png";
import {
  createOrderDraftFromCalculation,
  demoCalculationPayload,
  getFallbackOrder,
} from "../orders/order-data";
import type {
  CalculationToProductionPayload,
  PrintPilotOrder,
  ProductKind,
} from "../orders/order-data";

type CalculationPageProps = {
  onCreateOrderDraft: (order: PrintPilotOrder) => void;
};

type ProductionMode = "internal" | "external" | "combined";
type FieldBadge = "Pflicht" | "optional" | "später";
type CalculationTabId =
  | "customer"
  | "order"
  | "product"
  | "format"
  | "paper"
  | "print"
  | "finishing"
  | "external"
  | "prices";

type CalculationDraft = {
  customer: string;
  contactName: string;
  projectName: string;
  calculationId: string;
  dueDate: string;
  owner: string;
  customerReference: string;
  internalNote: string;
  productKind: ProductKind;
  productLabel: string;
  pages: string;
  colorMode: string;
  versions: string;
  personalization: string;
  finalFormat: string;
  openFormat: string;
  orientation: string;
  bleedMm: string;
  safetyMarginMm: string;
  productionFormat: string;
  specialShape: string;
  preflight: string;
  quantity: string;
  overs: string;
  netQuantity: string;
  restQuantity: string;
  tier1: string;
  tier2: string;
  tier3: string;
  variants: string;
  materialGroup: string;
  substrate: string;
  grammage: string;
  sheetFormat: string;
  grainDirection: string;
  stockStatus: string;
  supplier: string;
  priceStatus: string;
  machine: string;
  printType: string;
  turning: string;
  impositionLabel: string;
  setupTime: string;
  runTime: string;
  clickCosts: string;
  wasteMode: string;
  externalSupplier: string;
  externalPrice: string;
  externalLeadTime: string;
  margin: string;
  externalQuote: string;
  externalFreight: string;
  handlingTime: string;
  internalCheck: string;
  combinationPrint: string;
  combinationFinishing: string;
  combinationPostpress: string;
  combinationExternal: string;
  materialCosts: string;
  printCosts: string;
  finishingCosts: string;
  externalCosts: string;
  shippingCosts: string;
  salePriceNet: string;
};

type FinishingDraftRow = {
  id: string;
  label: string;
  active: boolean;
  note: string;
  typeLabel: string;
  typeValue: string;
  amountLabel: string;
  amountValue: string;
  productionLabel: string;
  productionValue: string;
};


const calculationTabs: Array<{
  id: CalculationTabId;
  label: string;
  shortcut: string;
}> = [
  { id: "customer", label: "Kunde", shortcut: "01" },
  { id: "order", label: "Auftrag", shortcut: "02" },
  { id: "product", label: "Produkt", shortcut: "03" },
  { id: "format", label: "Format", shortcut: "04" },
  { id: "paper", label: "Papier", shortcut: "05" },
  { id: "print", label: "Druck", shortcut: "06" },
  { id: "finishing", label: "Weiterverarbeitung", shortcut: "07" },
  { id: "external", label: "Fremdproduktion", shortcut: "08" },
  { id: "prices", label: "Preise", shortcut: "09" },
];

const productKindLabels: Record<ProductKind, string> = {
  flyer: "Flyer",
  "business-card": "Visitenkarte",
  brochure: "Broschüre",
  poster: "Plakat",
  sticker: "Aufkleber",
  letterhead: "Briefbogen",
};

const productKindOptions = Object.entries(productKindLabels).map(([value, label]) => ({
  value: value as ProductKind,
  label,
}));

const productionModes: Array<{
  id: ProductionMode;
  label: string;
  helper: string;
}> = [
  {
    id: "internal",
    label: "Eigenproduktion",
    helper: "Maschine, Bogen, Nutzenrechner und interne Produktionszeiten",
  },
  {
    id: "external",
    label: "Fremdproduktion",
    helper: "Lieferant, Einkaufspreis, Marge, Lieferzeit und Fracht",
  },
  {
    id: "combined",
    label: "Kombination",
    helper: "Druck/Veredelung/Weiterverarbeitung intern und extern aufteilen",
  },
];

const initialFinishingRows: FinishingDraftRow[] = [
  {
    id: "cutting",
    label: "Schneiden",
    active: true,
    note: "Planschnitt / Endschnitt / Zwischenschnitt",
    typeLabel: "Schnittart",
    typeValue: "Endschnitt",
    amountLabel: "Schnitte",
    amountValue: "4",
    productionLabel: "intern/extern",
    productionValue: "intern",
  },
  {
    id: "folding",
    label: "Falzen",
    active: false,
    note: "Falzart und Anzahl Brüche für Folder/Beilagen",
    typeLabel: "Falzart",
    typeValue: "Wickelfalz",
    amountLabel: "Brüche",
    amountValue: "2",
    productionLabel: "Maschine",
    productionValue: "Falzmaschine",
  },
  {
    id: "creasing",
    label: "Rillen / Nuten",
    active: false,
    note: "Wichtig bei starken Grammaturen und Foldern",
    typeLabel: "Rillungen",
    typeValue: "2",
    amountLabel: "Seite",
    amountValue: "einseitig",
    productionLabel: "Positionen",
    productionValue: "später",
  },
  {
    id: "stitching",
    label: "Heften",
    active: false,
    note: "Broschüren und gelochte Ringösenheftung",
    typeLabel: "Art",
    typeValue: "Rückstich",
    amountLabel: "Klammern",
    amountValue: "2",
    productionLabel: "Ösen",
    productionValue: "nein",
  },
  {
    id: "perfect-binding",
    label: "Klebebindung",
    active: false,
    note: "PUR/Hotmelt, Rückenbreite und Umschlagrillung",
    typeLabel: "Art",
    typeValue: "PUR",
    amountLabel: "Rücken",
    amountValue: "automatisch",
    productionLabel: "Umschlag",
    productionValue: "4-seitig",
  },
  {
    id: "thread-sewing",
    label: "Fadenheftung",
    active: false,
    note: "Meist Sonderleistung oder Fremdproduktion",
    typeLabel: "Lagen",
    typeValue: "offen",
    amountLabel: "Seiten/Lage",
    amountValue: "16",
    productionLabel: "Produktion",
    productionValue: "extern",
  },
  {
    id: "drilling",
    label: "Bohren / Lochen / Ösen",
    active: false,
    note: "Bohrbild, Durchmesser und Position",
    typeLabel: "Anzahl",
    typeValue: "2",
    amountLabel: "Ø",
    amountValue: "6 mm",
    productionLabel: "Ösen",
    productionValue: "optional",
  },
  {
    id: "lamination",
    label: "Laminieren / Kaschieren",
    active: false,
    note: "Matt, Glanz, Softtouch, ein- oder beidseitig",
    typeLabel: "Oberfläche",
    typeValue: "matt",
    amountLabel: "Seite",
    amountValue: "1/0",
    productionLabel: "Art",
    productionValue: "Folie",
  },
  {
    id: "die-cutting",
    label: "Stanzen / Plotten",
    active: false,
    note: "Konturschnitt, Stanzform oder digitale Weiterverarbeitung",
    typeLabel: "Art",
    typeValue: "Kontur",
    amountLabel: "Konturen",
    amountValue: "offen",
    productionLabel: "Stanze",
    productionValue: "später",
  },
  {
    id: "packing",
    label: "Verpacken / Versand",
    active: true,
    note: "Bündeln, Kartonieren, Etikettieren, Teillieferung",
    typeLabel: "Verpackung",
    typeValue: "Karton",
    amountLabel: "Bündel",
    amountValue: "100er",
    productionLabel: "Lieferung",
    productionValue: "eine Adresse",
  },
];

const initialDraft: CalculationDraft = {
  customer: "Wohlstandsmeister GmbH",
  contactName: "Lutz Humbert",
  projectName: "Visitenkarten Relaunch",
  calculationId: demoCalculationPayload.calculationId ?? "CALC-2026-00017",
  dueDate: "04.06.2026 · 11:00",
  owner: "Max M.",
  customerReference: "WM-VK-2026",
  internalNote: "Daten aus PDF-Preview prüfen",
  productKind: demoCalculationPayload.product.kind,
  productLabel: demoCalculationPayload.product.label,
  pages: demoCalculationPayload.product.pages,
  colorMode: "4/4-farbig · Skala",
  versions: "6 Varianten · Sammelauftrag",
  personalization: "keine Personalisierung",
  finalFormat: "85 × 55 mm",
  openFormat: "identisch",
  orientation: "Querformat",
  bleedMm: "3",
  safetyMarginMm: "3 mm",
  productionFormat: "85 × 55 mm + Beschnitt",
  specialShape: "keine",
  preflight: "Preflight erforderlich",
  quantity: "1000",
  overs: "3",
  netQuantity: "1008",
  restQuantity: "8",
  tier1: "500 Stück",
  tier2: "1.000 Stück",
  tier3: "2.500 Stück",
  variants: "6 Sorten zusammen",
  materialGroup: "Bilderdruck / Karton",
  substrate: demoCalculationPayload.product.substrate ?? "Munken Lynx 300 g",
  grammage: "350 g/m²",
  sheetFormat: "SRA3 · 450 × 320 mm",
  grainDirection: "offen",
  stockStatus: "Lagerware prüfen",
  supplier: "OVOL / IGEPA / Berberich",
  priceStatus: "manuell / CSV später",
  machine: demoCalculationPayload.machine?.label ?? "Xerox® Iridesse 2",
  printType: "Digitaldruck 4/4",
  turning: "einseitig / aufrecht",
  impositionLabel: "6 × 4 · 24 Nutzen",
  setupTime: "12 min",
  runTime: "automatisch später",
  clickCosts: "Maschinenstamm",
  wasteMode: "Zuschuss aus Kalkulation",
  externalSupplier: "Fremddruckerei auswählen",
  externalPrice: "0,00 €",
  externalLeadTime: "3–5 Arbeitstage",
  margin: "35 %",
  externalQuote: "noch offen",
  externalFreight: "0,00 €",
  handlingTime: "15 min",
  internalCheck: "Datencheck bleibt intern",
  combinationPrint: "Eigenproduktion",
  combinationFinishing: "extern vorbereiten",
  combinationPostpress: "intern schneiden / verpacken",
  combinationExternal: "Lieferant + Einkauf noch offen",
  materialCosts: "aus Papierstamm später",
  printCosts: "Maschinenstamm später",
  finishingCosts: "Matrix × Tarife später",
  externalCosts: "0,00 €",
  shippingCosts: "0,00 €",
  salePriceNet: "automatisch später",
};

function formatNumber(value: number) {
  return value.toLocaleString("de-DE");
}


function parseGermanNumber(value: string, fallback: number) {
  const normalized = value.replace(/[^0-9,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseInteger(value: string, fallback: number) {
  const parsed = Math.round(parseGermanNumber(value, fallback));
  return parsed > 0 ? parsed : fallback;
}

function parseFormatDimensions(label: string) {
  const match = label.match(/(\d+(?:[,.]\d+)?)\s*[×xX]\s*(\d+(?:[,.]\d+)?)/);

  if (!match) {
    return {
      label,
      widthMm: demoCalculationPayload.product.finalFormat.widthMm,
      heightMm: demoCalculationPayload.product.finalFormat.heightMm,
      orientation: demoCalculationPayload.product.finalFormat.orientation,
    };
  }

  const widthMm = parseGermanNumber(match[1], 0);
  const heightMm = parseGermanNumber(match[2], 0);

  return {
    label,
    widthMm,
    heightMm,
    orientation: widthMm >= heightMm ? "landscape" as const : "portrait" as const,
  };
}

function buildPayloadFromDraft(
  draft: CalculationDraft,
  productionMode: ProductionMode,
  finishingRows: FinishingDraftRow[],
): CalculationToProductionPayload {
  const quantity = parseInteger(draft.quantity, demoCalculationPayload.product.quantity);
  const usedSlots = demoCalculationPayload.imposition.layout.usedSlots;
  const sheetsRequired = Math.max(1, Math.ceil(quantity / Math.max(1, usedSlots)));
  const netQuantity = sheetsRequired * usedSlots;
  const restQuantity = Math.max(0, netQuantity - quantity);
  const overs = parseInteger(draft.overs, restQuantity);
  const activeFinishing = finishingRows
    .filter((row) => row.active)
    .map((row) => row.label);
  const finalFormat = parseFormatDimensions(draft.finalFormat);
  const bleedMm = parseGermanNumber(draft.bleedMm, demoCalculationPayload.product.bleedMm ?? 3);

  return {
    ...demoCalculationPayload,
    calculationId: draft.calculationId,
    product: {
      ...demoCalculationPayload.product,
      kind: draft.productKind,
      label: draft.productLabel,
      finalFormat,
      pages: draft.pages,
      quantity,
      substrate: draft.substrate,
      colorMode: draft.colorMode,
      bleedMm,
    },
    imposition: {
      ...demoCalculationPayload.imposition,
      item: {
        ...demoCalculationPayload.imposition.item,
        finalFormat: draft.finalFormat,
        widthMm: finalFormat.widthMm,
        heightMm: finalFormat.heightMm,
      },
      production: {
        orderedQuantity: quantity,
        sheetsRequired,
        overs,
        netQuantity,
        restQuantity,
      },
      finishingHints: activeFinishing.length ? activeFinishing : ["Weiterverarbeitung prüfen"],
    },
    machine: {
      label:
        productionMode === "external"
          ? draft.externalSupplier
          : productionMode === "combined"
            ? `${draft.machine} + Fremdleistung`
            : draft.machine,
      type: demoCalculationPayload.machine?.type ?? "digital-color",
    },
  };
}

function CalculationField({
  label,
  value,
  onValueChange,
  hint,
  badge,
  wide = false,
}: {
  label: string;
  value: string;
  onValueChange?: (value: string) => void;
  hint?: string;
  badge?: FieldBadge;
  wide?: boolean;
}) {
  return (
    <label
      className={
        wide
          ? "pp-calc-input-field pp-calc-input-field--wide"
          : "pp-calc-input-field"
      }
    >
      <span>
        {label}
        {badge ? <em>{badge}</em> : null}
      </span>
      <input
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
        readOnly={!onValueChange}
      />
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function CalculationSelect({
  label,
  value,
  options,
  onValueChange,
  hint,
  badge,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onValueChange?: (value: string) => void;
  hint?: string;
  badge?: FieldBadge;
}) {
  return (
    <label className="pp-calc-input-field">
      <span>
        {label}
        {badge ? <em>{badge}</em> : null}
      </span>
      <select
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
        disabled={!onValueChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function CalculationSection({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pp-calc-form-section">
      <div className="pp-calc-form-section__head">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function FinishingMatrixRow({
  row,
  onToggle,
  onChange,
}: {
  row: FinishingDraftRow;
  onToggle: (active: boolean) => void;
  onChange: (updates: Partial<FinishingDraftRow>) => void;
}) {
  return (
    <tr className={row.active ? "is-active" : undefined}>
      <td className="pp-calc-finishing-table__active">
        <input
          type="checkbox"
          checked={row.active}
          onChange={(event) => onToggle(event.target.checked)}
          aria-label={row.label}
        />
      </td>
      <th scope="row">
        <b>{row.label}</b>
        <small>{row.note}</small>
      </th>
      <td>
        <span>{row.typeLabel}</span>
        <input
          value={row.typeValue}
          onChange={(event) => onChange({ typeValue: event.target.value })}
          aria-label={`${row.label} ${row.typeLabel}`}
        />
      </td>
      <td>
        <span>{row.amountLabel}</span>
        <input
          value={row.amountValue}
          onChange={(event) => onChange({ amountValue: event.target.value })}
          aria-label={`${row.label} ${row.amountLabel}`}
        />
      </td>
      <td>
        <span>{row.productionLabel}</span>
        <input
          value={row.productionValue}
          onChange={(event) => onChange({ productionValue: event.target.value })}
          aria-label={`${row.label} ${row.productionLabel}`}
        />
      </td>
    </tr>
  );
}

function CalculationSheetPreview({
  payload,
}: {
  payload: CalculationToProductionPayload;
}) {
  const { imposition } = payload;
  const cells = Array.from(
    { length: imposition.layout.totalSlots },
    (_, index) => index + 1,
  );
  const previewImage = payload.preview?.generatedPreview?.imageSrc;
  const previewAlt =
    payload.preview?.generatedPreview?.alt ?? "Druckdatei-Preview";

  return (
    <div
      className="pp-calc-sheet-preview"
      aria-label="Nutzenrechner Ergebnisvorschau"
    >
      <div className="pp-calc-sheet-preview__bar">
        <span>{imposition.sheet.name}</span>
        <b>{imposition.layout.usedSlots} Nutzen</b>
      </div>
      <div
        className="pp-calc-sheet-preview__sheet"
        style={{
          gridTemplateColumns: `repeat(${imposition.layout.columns}, minmax(0, 1fr))`,
        }}
      >
        {cells.map((cell) => {
          const isUsed = cell <= imposition.layout.usedSlots;
          return (
            <span
              key={cell}
              className={
                isUsed
                  ? "pp-calc-sheet-preview__item"
                  : "pp-calc-sheet-preview__item is-empty"
              }
              aria-label={isUsed ? `Nutzen ${cell}` : `leerer Platz ${cell}`}
            >
              {isUsed && previewImage ? (
                <img src={previewImage} alt={previewAlt} loading="lazy" />
              ) : null}
            </span>
          );
        })}
      </div>
      <p>
        {imposition.sheet.widthMm && imposition.sheet.heightMm
          ? `${imposition.sheet.widthMm} × ${imposition.sheet.heightMm} mm`
          : imposition.sheet.name}
        {" · "}
        Raster {imposition.layout.columns} × {imposition.layout.rows}
        {" · "}
        Abstand {imposition.layout.gapMm ?? "offen"}
      </p>
    </div>
  );
}

function ResultLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="pp-calc-result-line">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

export function CalculationPage({ onCreateOrderDraft }: CalculationPageProps) {
  const [draftWasCreated, setDraftWasCreated] = useState(false);
  const [draft, setDraft] = useState<CalculationDraft>(initialDraft);
  const [productionMode, setProductionMode] = useState<ProductionMode>("internal");
  const [finishingRows, setFinishingRows] = useState<FinishingDraftRow[]>(initialFinishingRows);
  const [activeTab, setActiveTab] = useState<CalculationTabId>("customer");

  const payload = useMemo(
    () => buildPayloadFromDraft(draft, productionMode, finishingRows),
    [draft, finishingRows, productionMode],
  );
  const result = payload.imposition;

  const updateDraft = (field: keyof CalculationDraft) => (value: string) => {
    setDraft((currentDraft) => ({ ...currentDraft, [field]: value }));
    setDraftWasCreated(false);
  };

  const updateFinishingRow = (id: string, updates: Partial<FinishingDraftRow>) => {
    setFinishingRows((currentRows) =>
      currentRows.map((row) => (row.id === id ? { ...row, ...updates } : row)),
    );
    setDraftWasCreated(false);
  };

  const handleCreateOrderDraft = () => {
    const dueDateParts = draft.dueDate.split("·").map((part) => part.trim());
    const draftOrder = createOrderDraftFromCalculation(payload, getFallbackOrder(), {
      customer: draft.customer,
      customerAddress: ["Pleidelsheimer Straße 9", "74321 Bietigheim-Bissingen"],
      contactName: draft.contactName,
      contactPhone: "07142 35799-91",
      contactEmail: "lutz.humbert@wohlstandsmeister.de",
      dueDate: dueDateParts[0] || draft.dueDate,
      dueMeta: dueDateParts[1] ? `Do · ${dueDateParts[1]}` : "Do · 11:00",
      owner: draft.owner,
    });

    onCreateOrderDraft(draftOrder);
    setDraftWasCreated(true);
  };

  return (
    <div className="pp-calculation-page">
      <header className="pp-master-header pp-calculation-master-header">
        <div className="pp-header-brand">
          <img
            className="pp-brand-logo"
            src={printPilotLogo}
            alt="PrintPilot"
          />
        </div>
        <div className="pp-header-title-shape">
          <h1>KALKULATION</h1>
          <p>MIS-Maske · editierbare Eingaben · Ergebnis unten</p>
        </div>
        <div
          className="pp-header-job pp-header-job--overview"
          aria-label="Kalkulationsnummer"
        >
          <span>Demo-Kalkulation</span>
          <strong>{payload.calculationId ?? "CALC"}</strong>
        </div>
      </header>

      <section className="pp-calculation-layout pp-calculation-layout--tabs">
        <div className="pp-calculation-form" aria-label="Kalkulation Reitermaske">
          <div className="pp-calculation-form__intro pp-calculation-tabs-intro">
            <div>
              <p className="pp-eyebrow">Arbeitsmaske</p>
              <h2>Produktive Reitermaske</h2>
            </div>
            <div className="pp-calculation-form__meta" aria-label="Kalkulationsstatus">
              <span>{payload.calculationId ?? "CALC"}</span>
              <b>{draft.customer}</b>
              <small>{formatNumber(payload.product.quantity)} Stück</small>
            </div>
          </div>

          <div className="pp-calculation-quick-head" aria-label="Kalkulationskopf">
            <div>
              <span>Kunde</span>
              <b>{draft.customer}</b>
            </div>
            <div>
              <span>Produkt</span>
              <b>{payload.product.label}</b>
            </div>
            <div>
              <span>Auflage</span>
              <b>{formatNumber(payload.product.quantity)} Stück</b>
            </div>
            <div>
              <span>Format</span>
              <b>{draft.finalFormat}</b>
            </div>
            <div>
              <span>Produktion</span>
              <b>{productionModes.find((mode) => mode.id === productionMode)?.label ?? "Eigenproduktion"}</b>
            </div>
          </div>

          <nav className="pp-calculation-tabs" aria-label="Kalkulationsbereiche">
            {calculationTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={activeTab === tab.id ? "is-active" : ""}
                onClick={() => setActiveTab(tab.id)}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                <span>{tab.shortcut}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="pp-calculation-tab-panel">
            {activeTab === "customer" ? (
              <CalculationSection eyebrow="01" title="Kunde / Adresse">
                <div className="pp-calc-input-grid pp-calc-input-grid--four">
                  <CalculationField label="Kunde" value={draft.customer} onValueChange={updateDraft("customer")} badge="Pflicht" />
                  <CalculationField label="Ansprechpartner" value={draft.contactName} onValueChange={updateDraft("contactName")} badge="Pflicht" />
                  <CalculationField label="Kundenreferenz" value={draft.customerReference} onValueChange={updateDraft("customerReference")} badge="optional" />
                  <CalculationField label="Bearbeiter" value={draft.owner} onValueChange={updateDraft("owner")} badge="Pflicht" />
                  <CalculationField label="Rechnung an" value={draft.customer} onValueChange={updateDraft("customer")} badge="später" wide />
                  <CalculationField label="Lieferadresse" value="wie Kunde / später eigene Adresse" badge="später" wide />
                </div>
              </CalculationSection>
            ) : null}

            {activeTab === "order" ? (
              <CalculationSection eyebrow="02" title="Auftrag / Anfrage">
                <div className="pp-calc-input-grid pp-calc-input-grid--four">
                  <CalculationField label="Projekt / Jobname" value={draft.projectName} onValueChange={updateDraft("projectName")} badge="Pflicht" wide />
                  <CalculationField label="Kalkulationsnummer" value={draft.calculationId} onValueChange={updateDraft("calculationId")} badge="Pflicht" />
                  <CalculationField label="Liefertermin" value={draft.dueDate} onValueChange={updateDraft("dueDate")} badge="Pflicht" />
                  <CalculationField label="Interne Notiz" value={draft.internalNote} onValueChange={updateDraft("internalNote")} badge="optional" wide />
                  <CalculationField label="Hauptauflage" value={draft.quantity} onValueChange={updateDraft("quantity")} badge="Pflicht" />
                  <CalculationField label="Zuschuss" value={draft.overs} onValueChange={updateDraft("overs")} badge="Pflicht" />
                  <CalculationField label="Netto-Menge" value={`${formatNumber(result.production.netQuantity ?? 0)} Stück`} badge="optional" />
                  <CalculationField label="Restmenge" value={`${formatNumber(result.production.restQuantity ?? 0)} Stück`} badge="optional" />
                  <CalculationField label="Staffel 1" value={draft.tier1} onValueChange={updateDraft("tier1")} badge="optional" />
                  <CalculationField label="Staffel 2" value={draft.tier2} onValueChange={updateDraft("tier2")} badge="optional" />
                  <CalculationField label="Staffel 3" value={draft.tier3} onValueChange={updateDraft("tier3")} badge="optional" />
                  <CalculationField label="Varianten" value={draft.variants} onValueChange={updateDraft("variants")} badge="optional" />
                </div>
              </CalculationSection>
            ) : null}

            {activeTab === "product" ? (
              <CalculationSection eyebrow="03" title="Produkt">
                <div className="pp-calc-input-grid">
                  <CalculationSelect
                    label="Produktart"
                    value={draft.productKind}
                    options={productKindOptions}
                    onValueChange={(value) => updateDraft("productKind")(value as ProductKind)}
                    badge="Pflicht"
                  />
                  <CalculationField label="Bezeichnung" value={draft.productLabel} onValueChange={updateDraft("productLabel")} wide badge="Pflicht" />
                  <CalculationField label="Seiten / Umfang" value={draft.pages} onValueChange={updateDraft("pages")} badge="Pflicht" />
                  <CalculationField label="Farbigkeit" value={draft.colorMode} onValueChange={updateDraft("colorMode")} badge="Pflicht" />
                  <CalculationField label="Motive / Sorten" value={draft.versions} onValueChange={updateDraft("versions")} badge="optional" />
                  <CalculationField label="Personalisierung" value={draft.personalization} onValueChange={updateDraft("personalization")} badge="später" />
                </div>
              </CalculationSection>
            ) : null}

            {activeTab === "format" ? (
              <CalculationSection eyebrow="04" title="Format / Datenprüfung">
                <div className="pp-calc-input-grid pp-calc-input-grid--four">
                  <CalculationField label="Endformat" value={draft.finalFormat} onValueChange={updateDraft("finalFormat")} badge="Pflicht" />
                  <CalculationField label="Offenes Format" value={draft.openFormat} onValueChange={updateDraft("openFormat")} badge="optional" />
                  <CalculationField label="Ausrichtung" value={draft.orientation} onValueChange={updateDraft("orientation")} badge="Pflicht" />
                  <CalculationField label="Beschnitt" value={draft.bleedMm} onValueChange={updateDraft("bleedMm")} badge="Pflicht" />
                  <CalculationField label="Sicherheitsabstand" value={draft.safetyMarginMm} onValueChange={updateDraft("safetyMarginMm")} badge="optional" />
                  <CalculationField label="Nutzenformat" value={draft.productionFormat} onValueChange={updateDraft("productionFormat")} badge="Pflicht" />
                  <CalculationField label="Sonderform / Stanze" value={draft.specialShape} onValueChange={updateDraft("specialShape")} badge="optional" />
                  <CalculationField label="Datenprüfung" value={draft.preflight} onValueChange={updateDraft("preflight")} badge="Pflicht" />
                </div>
              </CalculationSection>
            ) : null}

            {activeTab === "paper" ? (
              <CalculationSection eyebrow="05" title="Papier / Material">
                <div className="pp-calc-input-grid pp-calc-input-grid--four">
                  <CalculationField label="Materialgruppe" value={draft.materialGroup} onValueChange={updateDraft("materialGroup")} badge="Pflicht" />
                  <CalculationField label="Artikel" value={draft.substrate} onValueChange={updateDraft("substrate")} badge="Pflicht" wide />
                  <CalculationField label="Grammatur" value={draft.grammage} onValueChange={updateDraft("grammage")} badge="Pflicht" />
                  <CalculationField label="Bogenformat" value={draft.sheetFormat} onValueChange={updateDraft("sheetFormat")} badge="Pflicht" />
                  <CalculationField label="Laufrichtung" value={draft.grainDirection} onValueChange={updateDraft("grainDirection")} badge="optional" />
                  <CalculationField label="Lagerstatus" value={draft.stockStatus} onValueChange={updateDraft("stockStatus")} badge="Pflicht" />
                  <CalculationField label="Lieferant" value={draft.supplier} onValueChange={updateDraft("supplier")} badge="optional" />
                  <CalculationField label="Preisstand" value={draft.priceStatus} onValueChange={updateDraft("priceStatus")} badge="später" />
                </div>
              </CalculationSection>
            ) : null}

            {activeTab === "print" ? (
              <CalculationSection eyebrow="06" title="Druck / Maschine">
                <div className="pp-calc-production-mode" role="radiogroup" aria-label="Produktionsart wählen">
                  {productionModes.map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      className={mode.id === productionMode ? "is-active" : ""}
                      onClick={() => {
                        setProductionMode(mode.id);
                        setDraftWasCreated(false);
                      }}
                      aria-pressed={mode.id === productionMode}
                    >
                      <b>{mode.label}</b>
                      <span>{mode.helper}</span>
                    </button>
                  ))}
                </div>
                <div className="pp-calc-production-detail">
                  <div className="pp-calc-input-grid pp-calc-input-grid--four">
                    <CalculationField label="Maschine" value={draft.machine} onValueChange={updateDraft("machine")} badge="Pflicht" />
                    <CalculationField label="Druckart" value={draft.printType} onValueChange={updateDraft("printType")} badge="Pflicht" />
                    <CalculationField label="Wendung" value={draft.turning} onValueChange={updateDraft("turning")} badge="Pflicht" />
                    <CalculationField label="Nutzenrechner" value={draft.impositionLabel} onValueChange={updateDraft("impositionLabel")} badge="Pflicht" />
                    <CalculationField label="Rüstzeit" value={draft.setupTime} onValueChange={updateDraft("setupTime")} badge="später" />
                    <CalculationField label="Laufzeit" value={draft.runTime} onValueChange={updateDraft("runTime")} badge="später" />
                    <CalculationField label="Klickkosten" value={draft.clickCosts} onValueChange={updateDraft("clickCosts")} badge="später" />
                    <CalculationField label="Makulatur" value={draft.wasteMode} onValueChange={updateDraft("wasteMode")} badge="optional" />
                  </div>
                </div>
              </CalculationSection>
            ) : null}

            {activeTab === "finishing" ? (
              <CalculationSection eyebrow="07" title="Weiterverarbeitung">
                <div className="pp-calc-finishing-matrix" aria-label="Weiterverarbeitungs-Matrix">
                  <table className="pp-calc-finishing-table">
                    <thead>
                      <tr>
                        <th>Aktiv</th>
                        <th>Leistung</th>
                        <th>Art / Parameter</th>
                        <th>Menge / Anzahl</th>
                        <th>Produktion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {finishingRows.map((row) => (
                        <FinishingMatrixRow
                          key={row.id}
                          row={row}
                          onToggle={(active) => updateFinishingRow(row.id, { active })}
                          onChange={(updates) => updateFinishingRow(row.id, updates)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </CalculationSection>
            ) : null}

            {activeTab === "external" ? (
              <CalculationSection eyebrow="08" title="Fremdproduktion / Kombination">
                <div className="pp-calc-input-grid pp-calc-input-grid--four">
                  <CalculationField label="Lieferant" value={draft.externalSupplier} onValueChange={updateDraft("externalSupplier")} badge="Pflicht" />
                  <CalculationField label="Einkaufspreis" value={draft.externalPrice} onValueChange={updateDraft("externalPrice")} badge="Pflicht" />
                  <CalculationField label="Lieferzeit" value={draft.externalLeadTime} onValueChange={updateDraft("externalLeadTime")} badge="Pflicht" />
                  <CalculationField label="Marge / Aufschlag" value={draft.margin} onValueChange={updateDraft("margin")} badge="Pflicht" />
                  <CalculationField label="Angebotsnummer" value={draft.externalQuote} onValueChange={updateDraft("externalQuote")} badge="optional" />
                  <CalculationField label="Fracht / Versand" value={draft.externalFreight} onValueChange={updateDraft("externalFreight")} badge="optional" />
                  <CalculationField label="Handling-Aufwand" value={draft.handlingTime} onValueChange={updateDraft("handlingTime")} badge="optional" />
                  <CalculationField label="Interne Prüfung" value={draft.internalCheck} onValueChange={updateDraft("internalCheck")} badge="Pflicht" />
                  <CalculationField label="Druck" value={draft.combinationPrint} onValueChange={updateDraft("combinationPrint")} badge="Pflicht" />
                  <CalculationField label="Veredelung" value={draft.combinationFinishing} onValueChange={updateDraft("combinationFinishing")} badge="optional" />
                  <CalculationField label="Weiterverarbeitung" value={draft.combinationPostpress} onValueChange={updateDraft("combinationPostpress")} badge="Pflicht" />
                  <CalculationField label="Fremdleistung" value={draft.combinationExternal} onValueChange={updateDraft("combinationExternal")} badge="optional" />
                </div>
              </CalculationSection>
            ) : null}

            {activeTab === "prices" ? (
              <CalculationSection eyebrow="09" title="Preise / Ergebnisvorgaben">
                <div className="pp-calc-input-grid pp-calc-input-grid--four">
                  <CalculationField label="Materialkosten" value={draft.materialCosts} onValueChange={updateDraft("materialCosts")} badge="später" />
                  <CalculationField label="Druckkosten" value={draft.printCosts} onValueChange={updateDraft("printCosts")} badge="später" />
                  <CalculationField label="Weiterverarbeitung" value={draft.finishingCosts} onValueChange={updateDraft("finishingCosts")} badge="später" />
                  <CalculationField label="Fremdleistung" value={draft.externalCosts} onValueChange={updateDraft("externalCosts")} badge="optional" />
                  <CalculationField label="Handling" value={draft.handlingTime} onValueChange={updateDraft("handlingTime")} badge="optional" />
                  <CalculationField label="Versand" value={draft.shippingCosts} onValueChange={updateDraft("shippingCosts")} badge="optional" />
                  <CalculationField label="Marge" value={draft.margin} onValueChange={updateDraft("margin")} badge="Pflicht" />
                  <CalculationField label="Verkaufspreis netto" value={draft.salePriceNet} onValueChange={updateDraft("salePriceNet")} badge="später" />
                </div>
              </CalculationSection>
            ) : null}
          </div>

          <div className="pp-calculation-statusbar" aria-label="Kalkulationsstatus und Aktionen">
            <div>
              <span>Pflichtfelder</span>
              <b>Demo · offen</b>
            </div>
            <div>
              <span>Aktiver Bereich</span>
              <b>{calculationTabs.find((tab) => tab.id === activeTab)?.label ?? "Kunde"}</b>
            </div>
            <div>
              <span>Nutzen / Bogen</span>
              <b>{result.layout.usedSlots} Nutzen · {result.production.sheetsRequired ? formatNumber(result.production.sheetsRequired) : "offen"} Bogen</b>
            </div>
            <button className="pp-calculation-create-button pp-calculation-create-button--bar" type="button" onClick={handleCreateOrderDraft}>
              Auftrag aus Kalkulation erzeugen
            </button>
          </div>
        </div>

        <aside className="pp-calculation-result-panel pp-calculation-result-panel--compact" aria-label="Kalkulation Ergebnis">
          <div className="pp-calculation-result-panel__head">
            <p className="pp-eyebrow">Ergebnis</p>
            <h2>Auswertung</h2>
            <span>Kurzübersicht zur aktuellen Kalkulation.</span>
          </div>

          <CalculationSheetPreview payload={payload} />

          <div className="pp-calculation-output-card">
            <h3>Produktionsdaten</h3>
            <div className="pp-calc-result-list">
              <ResultLine label="Produktionsweg" value={productionModes.find((mode) => mode.id === productionMode)?.label ?? "Eigenproduktion"} />
              <ResultLine label="Produkt" value={payload.product.label} />
              <ResultLine label="Nutzen" value={`${result.layout.usedSlots} von ${result.layout.totalSlots}`} />
              <ResultLine label="Bogenanzahl" value={result.production.sheetsRequired ? `${formatNumber(result.production.sheetsRequired)} Bogen` : "offen"} />
            </div>
            <div className="pp-calculation-hints">
              {(result.finishingHints ?? []).map((hint) => <span key={hint}>{hint}</span>)}
            </div>
          </div>

          <div className={draftWasCreated ? "pp-calculation-create-note is-active" : "pp-calculation-create-note"}>
            <strong>{draftWasCreated ? "Auftragsentwurf erzeugt" : "Noch nicht gespeichert"}</strong>
            <p>Reitermaske mit lokalem Demo-State. Die aktuellen Werte werden beim Erzeugen übernommen.</p>
          </div>
        </aside>
      </section>
    </div>
  );
}
