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

type ProductionMode = "internal" | "external" | "combined";

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

function formatNumber(value: number) {
  return value.toLocaleString("de-DE");
}

function formatMm(value?: number) {
  return typeof value === "number" ? `${value} mm` : "offen";
}

function formatFormatLabel(format: CalculationToProductionPayload["product"]["finalFormat"]) {
  if (format.widthMm && format.heightMm) {
    return `${format.widthMm} × ${format.heightMm} mm`;
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

function CalculationField({
  label,
  value,
  hint,
  wide = false,
}: {
  label: string;
  value: string;
  hint?: string;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "pp-calc-input-field pp-calc-input-field--wide" : "pp-calc-input-field"}>
      <span>{label}</span>
      <input value={value} readOnly />
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function CalculationSelect({
  label,
  value,
  options,
  hint,
}: {
  label: string;
  value: string;
  options: string[];
  hint?: string;
}) {
  return (
    <label className="pp-calc-input-field">
      <span>{label}</span>
      <select value={value} disabled>
        {options.map((option) => (
          <option key={option}>{option}</option>
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
  const [productionMode, setProductionMode] = useState<ProductionMode>("internal");
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
      label: "Produktionsart",
      value: productionMode === "internal" ? "Intern" : productionMode === "external" ? "Extern" : "Kombi",
      helper: productionModes.find((mode) => mode.id === productionMode)?.label ?? "Eigenproduktion",
      tone: productionMode === "external" ? "orange" : productionMode === "combined" ? "gray" : "green",
    },
    {
      label: "Nutzen/Bogen",
      value: String(result.layout.usedSlots),
      helper: `${result.layout.columns} × ${result.layout.rows}`,
      tone: "blue",
    },
    {
      label: "Bogen",
      value: result.production.sheetsRequired ? formatNumber(result.production.sheetsRequired) : "offen",
      helper: result.sheet.name,
      tone: "green",
    },
  ], [payload, productionMode, result]);

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
          <p>Eingabemaske · Produktionsart · Nutzenrechner</p>
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

      <section className="pp-calculation-layout">
        <main className="pp-calculation-form" aria-label="Kalkulation Eingabemaske">
          <div className="pp-calculation-form__intro">
            <div>
              <p className="pp-eyebrow">Arbeitsmaske</p>
              <h2>Kalkulationsdaten erfassen</h2>
              <span>
                Die Maske sammelt Produkt-, Material- und Produktionsdaten. Der Nutzenrechner liefert später daraus die Produktionsdaten für die Auftragstasche.
              </span>
            </div>
          </div>

          <CalculationSection eyebrow="01" title="Produkt">
            <div className="pp-calc-input-grid">
              <CalculationSelect
                label="Produktart"
                value={productKindLabels[payload.product.kind]}
                options={Object.values(productKindLabels)}
              />
              <CalculationField label="Bezeichnung" value={payload.product.label} wide />
              <CalculationField label="Seiten / Farbigkeit" value={payload.product.pages} />
              <CalculationField label="Motive / Varianten" value="1 Motiv · ein Datensatz" />
            </div>
          </CalculationSection>

          <CalculationSection eyebrow="02" title="Format">
            <div className="pp-calc-input-grid pp-calc-input-grid--four">
              <CalculationField label="Endformat" value={formatFormatLabel(payload.product.finalFormat)} />
              <CalculationField label="Ausrichtung" value="Querformat" />
              <CalculationField label="Beschnitt" value={formatMm(payload.product.bleedMm)} />
              <CalculationField label="Datenprüfung" value="Preflight erforderlich" />
            </div>
          </CalculationSection>

          <CalculationSection eyebrow="03" title="Auflage">
            <div className="pp-calc-input-grid pp-calc-input-grid--four">
              <CalculationField label="Menge" value={`${formatNumber(payload.product.quantity)} Stück`} />
              <CalculationField label="Zuschuss" value={result.production.overs ? `${formatNumber(result.production.overs)} Stück` : "offen"} />
              <CalculationField label="Netto-Menge" value={result.production.netQuantity ? `${formatNumber(result.production.netQuantity)} Stück` : "offen"} />
              <CalculationField label="Restmenge" value={result.production.restQuantity ? `${formatNumber(result.production.restQuantity)} Stück` : "0"} />
            </div>
          </CalculationSection>

          <CalculationSection eyebrow="04" title="Material / Papier">
            <div className="pp-calc-input-grid pp-calc-input-grid--four">
              <CalculationField label="Material" value={payload.product.substrate ?? "noch offen"} />
              <CalculationField label="Grammatur" value="350 g/m²" />
              <CalculationField label="Bogenformat" value={`${result.sheet.name} · ${result.sheet.widthMm ?? "?"} × ${result.sheet.heightMm ?? "?"} mm`} />
              <CalculationField label="Laufrichtung" value="offen" />
            </div>
          </CalculationSection>

          <CalculationSection eyebrow="05" title="Produktionsart">
            <div className="pp-calc-production-mode" role="radiogroup" aria-label="Produktionsart wählen">
              {productionModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={mode.id === productionMode ? "is-active" : ""}
                  onClick={() => setProductionMode(mode.id)}
                  aria-pressed={mode.id === productionMode}
                >
                  <b>{mode.label}</b>
                  <span>{mode.helper}</span>
                </button>
              ))}
            </div>

            <div className="pp-calc-production-detail">
              {productionMode === "internal" ? (
                <div className="pp-calc-input-grid pp-calc-input-grid--four">
                  <CalculationField label="Maschine" value={payload.machine?.label ?? "noch offen"} />
                  <CalculationField label="Druckart" value="Digitaldruck 4/4" />
                  <CalculationField label="Wendung" value="einseitig / aufrecht" />
                  <CalculationField label="Nutzenrechner" value={`${result.layout.columns} × ${result.layout.rows} · ${result.layout.usedSlots} Nutzen`} />
                </div>
              ) : null}

              {productionMode === "external" ? (
                <div className="pp-calc-input-grid pp-calc-input-grid--four">
                  <CalculationField label="Lieferant" value="Fremddruckerei auswählen" />
                  <CalculationField label="Einkaufspreis" value="0,00 €" />
                  <CalculationField label="Lieferzeit" value="3–5 Arbeitstage" />
                  <CalculationField label="Marge / Aufschlag" value="35 %" />
                  <CalculationField label="Angebotsnummer" value="noch offen" />
                  <CalculationField label="Fracht / Versand" value="0,00 €" />
                  <CalculationField label="Handling" value="Datencheck + Bestellabwicklung" wide />
                </div>
              ) : null}

              {productionMode === "combined" ? (
                <div className="pp-calc-input-grid pp-calc-input-grid--four">
                  <CalculationField label="Druck" value="Eigenproduktion" />
                  <CalculationField label="Veredelung" value="extern vorbereiten" />
                  <CalculationField label="Weiterverarbeitung" value="intern schneiden / verpacken" />
                  <CalculationField label="Fremdleistung" value="Lieferant + Einkauf noch offen" />
                </div>
              ) : null}
            </div>
          </CalculationSection>

          <CalculationSection eyebrow="06" title="Weiterverarbeitung">
            <div className="pp-calc-check-grid">
              {[
                "Schneiden",
                "Rillen / Falzen",
                "Heften",
                "Verpacken",
                "Externe Veredelung",
              ].map((item, index) => (
                <label key={item} className="pp-calc-check-item">
                  <input type="checkbox" checked={index === 0 || index === 3} readOnly />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </CalculationSection>
        </main>

        <aside className="pp-calculation-result-panel" aria-label="Kalkulation Ergebnis">
          <div className="pp-calculation-result-panel__head">
            <p className="pp-eyebrow">Ergebnis</p>
            <h2>Nutzenrechner</h2>
            <span>Vorbereitete Produktionsdaten aus dem Datenvertrag.</span>
          </div>

          <CalculationSheetPreview payload={payload} />

          <div className="pp-calculation-output-card">
            <h3>Produktionsdaten</h3>
            <div className="pp-calc-result-list">
              <ResultLine label="Produktionsweg" value={productionModes.find((mode) => mode.id === productionMode)?.label ?? "Eigenproduktion"} />
              <ResultLine label="Plan" value={result.planType} />
              <ResultLine label="Nutzen" value={`${result.layout.usedSlots} von ${result.layout.totalSlots}`} />
              <ResultLine label="Bogenanzahl" value={result.production.sheetsRequired ? `${formatNumber(result.production.sheetsRequired)} Bogen` : "offen"} />
              <ResultLine label="Zwischenschnitt" value={String(result.layout.gapMm ?? "offen")} />
            </div>
            <div className="pp-calculation-hints">
              {(result.finishingHints ?? []).map((hint) => (
                <span key={hint}>{hint}</span>
              ))}
            </div>
          </div>

          <div className="pp-calculation-contract-box">
            <h3>Datenvertrag</h3>
            <p>Auszug der Felder, die später der Nutzenrechner liefert.</p>
            <div className="pp-calculation-contract-list">
              {calculationProductionContract.slice(0, 6).map((field) => (
                <article key={`${field.group}-${field.field}`}>
                  <span>{field.group}</span>
                  <b>{field.field}</b>
                  <small>{field.required ? "Pflichtfeld" : "optional"}</small>
                </article>
              ))}
            </div>
          </div>

          <button className="pp-calculation-create-button" type="button" onClick={handleCreateOrderDraft}>
            Auftrag aus Kalkulation erzeugen
          </button>

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
