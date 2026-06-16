import { useMemo, useState } from "react";
import printPilotLogo from "../../assets/logo/printpilot-logo-on-navy.png";
import {
  calculationProductionContract,
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

type CalculationMetric = {
  label: string;
  value: string;
  helper: string;
  tone: "blue" | "green" | "orange" | "gray";
};

const productKindLabels: Record<ProductKind, string> = {
  flyer: "Flyer",
  "business-card": "Visitenkarte",
  brochure: "Broschüre",
  poster: "Plakat",
  sticker: "Aufkleber",
  letterhead: "Briefbogen",
};

function formatNumber(value: number) {
  return value.toLocaleString("de-DE");
}

function formatMm(value?: number) {
  return typeof value === "number" ? `${value} mm` : "offen";
}

function formatFormatLabel(format: CalculationToProductionPayload["product"]["finalFormat"]) {
  if (format.widthMm && format.heightMm) {
    return `${format.label} · ${format.widthMm} × ${format.heightMm} mm`;
  }

  return format.label;
}

function CalculationMetricCard({ label, value, helper, tone }: CalculationMetric) {
  return (
    <article className={`pp-calc-metric pp-calc-metric--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{helper}</small>
    </article>
  );
}

function CalculationField({ label, value }: { label: string; value: string }) {
  return (
    <div className="pp-calc-field">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function CalculationSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pp-calc-panel">
      <div className="pp-calc-panel__head">
        <span />
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function CalculationSheetPreview({ payload }: { payload: CalculationToProductionPayload }) {
  const { imposition } = payload;
  const cells = Array.from({ length: imposition.layout.totalSlots }, (_, index) => index + 1);
  const previewImage = payload.preview?.generatedPreview?.imageSrc;
  const previewAlt = payload.preview?.generatedPreview?.alt ?? "Druckdatei-Preview";

  return (
    <div className="pp-calc-sheet-preview" aria-label="Nutzenrechner Ergebnisvorschau">
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
              className={isUsed ? "pp-calc-sheet-preview__item" : "pp-calc-sheet-preview__item is-empty"}
              aria-label={isUsed ? `Nutzen ${cell}` : `leerer Platz ${cell}`}
            >
              {isUsed && previewImage ? <img src={previewImage} alt={previewAlt} loading="lazy" /> : null}
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

export function CalculationPage({ onCreateOrderDraft }: CalculationPageProps) {
  const [draftWasCreated, setDraftWasCreated] = useState(false);
  const payload = demoCalculationPayload;
  const result = payload.imposition;

  const metrics = useMemo<CalculationMetric[]>(() => [
    {
      label: "Auflage",
      value: formatNumber(payload.product.quantity),
      helper: productKindLabels[payload.product.kind],
      tone: "blue",
    },
    {
      label: "Bogen",
      value: result.production.sheetsRequired ? formatNumber(result.production.sheetsRequired) : "offen",
      helper: result.sheet.name,
      tone: "green",
    },
    {
      label: "Nutzen/Bogen",
      value: String(result.layout.usedSlots),
      helper: `${result.layout.columns} × ${result.layout.rows}`,
      tone: "blue",
    },
    {
      label: "Zuschuss",
      value: result.production.overs ? formatNumber(result.production.overs) : "offen",
      helper: result.production.restQuantity ? `${formatNumber(result.production.restQuantity)} Rest` : "Rest offen",
      tone: "orange",
    },
  ], [payload, result]);

  const handleCreateOrderDraft = () => {
    const draft = createOrderDraftFromCalculation(payload, getFallbackOrder(), {
      customer: "Wohlstandsmeister GmbH",
      customerAddress: ["Pleidelsheimer Straße 9", "74321 Bietigheim-Bissingen"],
      contactName: "Lutz Humbert",
      contactPhone: "07142 35799-91",
      contactEmail: "lutz.humbert@wohlstandsmeister.de",
      dueDate: "04.06.2026",
      dueMeta: "Do · 11:00",
      owner: "Max M.",
    });

    onCreateOrderDraft(draft);
    setDraftWasCreated(true);
  };

  return (
    <div className="pp-calculation-page">
      <header className="pp-master-header pp-calculation-master-header">
        <div className="pp-header-brand">
          <img className="pp-brand-logo" src={printPilotLogo} alt="PrintPilot" />
        </div>
        <div className="pp-header-title-shape">
          <h1>KALKULATION</h1>
          <p>Produktparameter · Nutzenrechner · Auftragserzeugung</p>
        </div>
        <div className="pp-header-job pp-header-job--overview" aria-label="Kalkulationsnummer">
          <span>Demo-Kalkulation</span>
          <strong>{payload.calculationId ?? "CALC"}</strong>
        </div>
      </header>

      <section className="pp-calculation-summary" aria-label="Kalkulationskennzahlen">
        {metrics.map((metric) => (
          <CalculationMetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="pp-calculation-workbench">
        <aside className="pp-calculation-sidebar">
          <CalculationSection title="Produktparameter">
            <div className="pp-calc-field-list">
              <CalculationField label="Produkt" value={payload.product.label} />
              <CalculationField label="Produktart" value={productKindLabels[payload.product.kind]} />
              <CalculationField label="Endformat" value={formatFormatLabel(payload.product.finalFormat)} />
              <CalculationField label="Seiten/Farbe" value={payload.product.pages} />
              <CalculationField label="Material" value={payload.product.substrate ?? "noch offen"} />
            </div>
          </CalculationSection>

          <CalculationSection title="Bogenparameter">
            <div className="pp-calc-field-list">
              <CalculationField label="Bogen" value={`${result.sheet.name} · ${result.sheet.widthMm ?? "?"} × ${result.sheet.heightMm ?? "?"} mm`} />
              <CalculationField label="Beschnitt" value={formatMm(payload.product.bleedMm)} />
              <CalculationField label="Abstand" value={String(result.layout.gapMm ?? "offen")} />
              <CalculationField label="Raster" value={`${result.layout.columns} × ${result.layout.rows}`} />
              <CalculationField label="Maschine" value={payload.machine?.label ?? "noch offen"} />
            </div>
          </CalculationSection>
        </aside>

        <main className="pp-calculation-result">
          <div className="pp-calculation-result__head">
            <div>
              <p className="pp-eyebrow">Nutzenrechner</p>
              <h2>Produktionsdaten aus Kalkulation</h2>
              <span>
                Der spätere Nutzenrechner liefert diese Werte. Die Auftragstasche visualisiert sie nur.
              </span>
            </div>
            <button type="button" onClick={handleCreateOrderDraft}>
              Aus Kalkulation Auftrag erzeugen
            </button>
          </div>

          <div className="pp-calculation-result-grid">
            <CalculationSheetPreview payload={payload} />

            <div className="pp-calculation-output-card">
              <h3>Ergebnisdaten</h3>
              <div className="pp-calc-output-list">
                <CalculationField label="Plan" value={result.planType} />
                <CalculationField label="Nutzen" value={`${result.layout.usedSlots} von ${result.layout.totalSlots}`} />
                <CalculationField label="Bogenanzahl" value={result.production.sheetsRequired ? `${formatNumber(result.production.sheetsRequired)} Bogen` : "offen"} />
                <CalculationField label="Netto-Menge" value={result.production.netQuantity ? formatNumber(result.production.netQuantity) : "offen"} />
                <CalculationField label="Restmenge" value={result.production.restQuantity ? formatNumber(result.production.restQuantity) : "0"} />
                <CalculationField label="Wendung" value={result.layout.orientation === "upright" ? "einseitig / aufrecht" : result.layout.orientation} />
              </div>
              <div className="pp-calculation-hints">
                {(result.finishingHints ?? []).map((hint) => (
                  <span key={hint}>{hint}</span>
                ))}
              </div>
            </div>
          </div>
        </main>

        <aside className="pp-calculation-contract">
          <CalculationSection title="Datenvertrag">
            <p>
              Sprint 45.1/45.2 trennt Kalkulation, Produktionsdaten und Preview-Dateien. Diese Felder werden später vom Nutzenrechner geliefert.
            </p>
            <div className="pp-calculation-contract-list">
              {calculationProductionContract.slice(0, 6).map((field) => (
                <article key={`${field.group}-${field.field}`}>
                  <span>{field.group}</span>
                  <b>{field.field}</b>
                  <small>{field.required ? "Pflichtfeld" : "optional"}</small>
                </article>
              ))}
            </div>
          </CalculationSection>

          <div className={draftWasCreated ? "pp-calculation-create-note is-active" : "pp-calculation-create-note"}>
            <strong>{draftWasCreated ? "Auftragsentwurf erzeugt" : "Noch nicht gespeichert"}</strong>
            <p>
              Demo-State ohne Persistenz. Beim Erzeugen wird der Entwurf in die aktuelle Auftragsliste übernommen und die Auftragstasche geöffnet.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
