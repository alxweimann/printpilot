import { useState } from "react";
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

function formatFormatLabel(
  format: CalculationToProductionPayload["product"]["finalFormat"],
) {
  if (format.widthMm && format.heightMm) {
    return `${format.widthMm} × ${format.heightMm} mm`;
  }

  return format.label;
}

function CalculationField({
  label,
  value,
  hint,
  badge,
  wide = false,
}: {
  label: string;
  value: string;
  hint?: string;
  badge?: "Pflicht" | "optional" | "später";
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
  badge,
}: {
  label: string;
  value: string;
  options: string[];
  hint?: string;
  badge?: "Pflicht" | "optional" | "später";
}) {
  return (
    <label className="pp-calc-input-field">
      <span>
        {label}
        {badge ? <em>{badge}</em> : null}
      </span>
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

function FinishingMatrixRow({
  label,
  active,
  fields,
  note,
}: {
  label: string;
  active: boolean;
  fields: Array<{ label: string; value: string }>;
  note?: string;
}) {
  const [typeField, amountField, productionField] = fields;

  return (
    <tr className={active ? "is-active" : undefined}>
      <td className="pp-calc-finishing-table__active">
        <input type="checkbox" checked={active} readOnly aria-label={label} />
      </td>
      <th scope="row">
        <b>{label}</b>
        {note ? <small>{note}</small> : null}
      </th>
      <td>
        <span>{typeField?.label ?? "Art"}</span>
        <strong>{typeField?.value ?? "—"}</strong>
      </td>
      <td>
        <span>{amountField?.label ?? "Menge"}</span>
        <strong>{amountField?.value ?? "—"}</strong>
      </td>
      <td>
        <span>{productionField?.label ?? "intern/extern"}</span>
        <strong>{productionField?.value ?? "—"}</strong>
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
  const [productionMode, setProductionMode] =
    useState<ProductionMode>("internal");
  const payload = demoCalculationPayload;
  const result = payload.imposition;

  const handleCreateOrderDraft = () => {
    const draft = createOrderDraftFromCalculation(payload, getFallbackOrder(), {
      customer: "Wohlstandsmeister GmbH",
      customerAddress: [
        "Pleidelsheimer Straße 9",
        "74321 Bietigheim-Bissingen",
      ],
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
          <img
            className="pp-brand-logo"
            src={printPilotLogo}
            alt="PrintPilot"
          />
        </div>
        <div className="pp-header-title-shape">
          <h1>KALKULATION</h1>
          <p>MIS-Maske · Tabellenlayout · Ergebnis unten</p>
        </div>
        <div
          className="pp-header-job pp-header-job--overview"
          aria-label="Kalkulationsnummer"
        >
          <span>Demo-Kalkulation</span>
          <strong>{payload.calculationId ?? "CALC"}</strong>
        </div>
      </header>

      <section className="pp-calculation-layout">
        <main
          className="pp-calculation-form"
          aria-label="Kalkulation Eingabemaske"
        >
          <div className="pp-calculation-form__intro">
            <div>
              <p className="pp-eyebrow">Arbeitsmaske</p>
              <h2>Eingabeformular</h2>
            </div>
            <div
              className="pp-calculation-form__meta"
              aria-label="Kalkulationsstatus"
            >
              <span>{payload.calculationId ?? "CALC"}</span>
              <b>{productKindLabels[payload.product.kind]}</b>
              <small>{formatNumber(payload.product.quantity)} Stück</small>
            </div>
          </div>

          <CalculationSection eyebrow="01" title="Kopfdaten">
            <div className="pp-calc-input-grid pp-calc-input-grid--four">
              <CalculationField label="Kunde" value="Wohlstandsmeister GmbH" badge="Pflicht" />
              <CalculationField label="Ansprechpartner" value="Lutz Humbert" badge="Pflicht" />
              <CalculationField label="Projekt / Jobname" value="Visitenkarten Relaunch" badge="Pflicht" />
              <CalculationField label="Kalkulationsnummer" value={payload.calculationId ?? "CALC-2026-0001"} badge="Pflicht" />
              <CalculationField label="Liefertermin" value="04.06.2026 · 11:00" badge="Pflicht" />
              <CalculationField label="Bearbeiter" value="Max M." badge="Pflicht" />
              <CalculationField label="Kundenreferenz" value="WM-VK-2026" badge="optional" />
              <CalculationField label="Interne Notiz" value="Daten aus PDF-Preview prüfen" badge="optional" />
            </div>
          </CalculationSection>

          <CalculationSection eyebrow="02" title="Produktdetails">
            <div className="pp-calc-input-grid">
              <CalculationSelect
                label="Produktart"
                value={productKindLabels[payload.product.kind]}
                options={Object.values(productKindLabels)}
                badge="Pflicht"
              />
              <CalculationField
                label="Bezeichnung"
                value={payload.product.label}
                wide
                badge="Pflicht"
              />
              <CalculationField
                label="Seiten / Umfang"
                value={payload.product.pages}
                badge="Pflicht"
              />
              <CalculationField
                label="Farbigkeit"
                value="4/4-farbig · Skala"
                badge="Pflicht"
              />
              <CalculationField
                label="Motive / Sorten"
                value="6 Varianten · Sammelauftrag"
                badge="optional"
              />
              <CalculationField
                label="Personalisierung"
                value="keine Personalisierung"
                badge="später"
              />
            </div>
          </CalculationSection>

          <CalculationSection eyebrow="03" title="Format">
            <div className="pp-calc-input-grid pp-calc-input-grid--four">
              <CalculationField
                label="Endformat"
                value={formatFormatLabel(payload.product.finalFormat)}
                badge="Pflicht"
              />
              <CalculationField label="Offenes Format" value="identisch" badge="optional" />
              <CalculationField label="Ausrichtung" value="Querformat" badge="Pflicht" />
              <CalculationField
                label="Beschnitt"
                value={formatMm(payload.product.bleedMm)}
                badge="Pflicht"
              />
              <CalculationField label="Sicherheitsabstand" value="3 mm" badge="optional" />
              <CalculationField label="Nutzenformat" value="85 × 55 mm + Beschnitt" badge="Pflicht" />
              <CalculationField label="Sonderform / Stanze" value="keine" badge="optional" />
              <CalculationField
                label="Datenprüfung"
                value="Preflight erforderlich"
                badge="Pflicht"
              />
            </div>
          </CalculationSection>

          <CalculationSection eyebrow="04" title="Auflage / Staffeln">
            <div className="pp-calc-input-grid pp-calc-input-grid--four">
              <CalculationField
                label="Hauptauflage"
                value={`${formatNumber(payload.product.quantity)} Stück`}
                badge="Pflicht"
              />
              <CalculationField
                label="Zuschuss"
                value={
                  result.production.overs
                    ? `${formatNumber(result.production.overs)} Stück`
                    : "offen"
                }
                badge="Pflicht"
              />
              <CalculationField
                label="Netto-Menge"
                value={
                  result.production.netQuantity
                    ? `${formatNumber(result.production.netQuantity)} Stück`
                    : "offen"
                }
                badge="optional"
              />
              <CalculationField
                label="Restmenge"
                value={
                  result.production.restQuantity
                    ? `${formatNumber(result.production.restQuantity)} Stück`
                    : "0"
                }
                badge="optional"
              />
              <CalculationField label="Staffel 1" value="500 Stück" badge="optional" />
              <CalculationField label="Staffel 2" value="1.000 Stück" badge="optional" />
              <CalculationField label="Staffel 3" value="2.500 Stück" badge="optional" />
              <CalculationField label="Varianten" value="6 Sorten zusammen" badge="optional" />
            </div>
          </CalculationSection>

          <CalculationSection eyebrow="05" title="Material / Papier">
            <div className="pp-calc-input-grid pp-calc-input-grid--four">
              <CalculationField
                label="Materialgruppe"
                value="Bilderdruck / Karton"
                badge="Pflicht"
              />
              <CalculationField
                label="Artikel"
                value={payload.product.substrate ?? "noch offen"}
                badge="Pflicht"
              />
              <CalculationField label="Grammatur" value="350 g/m²" badge="Pflicht" />
              <CalculationField
                label="Bogenformat"
                value={`${result.sheet.name} · ${result.sheet.widthMm ?? "?"} × ${result.sheet.heightMm ?? "?"} mm`}
                badge="Pflicht"
              />
              <CalculationField label="Laufrichtung" value="offen" badge="optional" />
              <CalculationField label="Lagerstatus" value="Lagerware prüfen" badge="Pflicht" />
              <CalculationField label="Lieferant" value="OVOL / IGEPA / Berberich" badge="optional" />
              <CalculationField label="Preisstand" value="manuell / CSV später" badge="später" />
            </div>
          </CalculationSection>

          <CalculationSection eyebrow="06" title="Produktion">
            <div
              className="pp-calc-production-mode"
              role="radiogroup"
              aria-label="Produktionsart wählen"
            >
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
                  <CalculationField
                    label="Maschine"
                    value={payload.machine?.label ?? "noch offen"}
                    badge="Pflicht"
                  />
                  <CalculationField label="Druckart" value="Digitaldruck 4/4" badge="Pflicht" />
                  <CalculationField
                    label="Wendung"
                    value="einseitig / aufrecht"
                    badge="Pflicht"
                  />
                  <CalculationField
                    label="Nutzenrechner"
                    value={`${result.layout.columns} × ${result.layout.rows} · ${result.layout.usedSlots} Nutzen`}
                    badge="Pflicht"
                  />
                  <CalculationField label="Rüstzeit" value="12 min" badge="später" />
                  <CalculationField label="Laufzeit" value="automatisch später" badge="später" />
                  <CalculationField label="Klickkosten" value="Maschinenstamm" badge="später" />
                  <CalculationField label="Makulatur" value="Zuschuss aus Kalkulation" badge="optional" />
                </div>
              ) : null}

              {productionMode === "external" ? (
                <div className="pp-calc-input-grid pp-calc-input-grid--four">
                  <CalculationField
                    label="Lieferant"
                    value="Fremddruckerei auswählen"
                    badge="Pflicht"
                  />
                  <CalculationField label="Einkaufspreis" value="0,00 €" badge="Pflicht" />
                  <CalculationField
                    label="Lieferzeit"
                    value="3–5 Arbeitstage"
                    badge="Pflicht"
                  />
                  <CalculationField label="Marge / Aufschlag" value="35 %" badge="Pflicht" />
                  <CalculationField label="Angebotsnummer" value="noch offen" badge="optional" />
                  <CalculationField label="Fracht / Versand" value="0,00 €" badge="optional" />
                  <CalculationField label="Handling-Aufwand" value="15 min" badge="optional" />
                  <CalculationField label="Interne Prüfung" value="Datencheck bleibt intern" badge="Pflicht" />
                </div>
              ) : null}

              {productionMode === "combined" ? (
                <div className="pp-calc-input-grid pp-calc-input-grid--four">
                  <CalculationField label="Druck" value="Eigenproduktion" badge="Pflicht" />
                  <CalculationField
                    label="Veredelung"
                    value="extern vorbereiten"
                    badge="optional"
                  />
                  <CalculationField
                    label="Weiterverarbeitung"
                    value="intern schneiden / verpacken"
                    badge="Pflicht"
                  />
                  <CalculationField
                    label="Fremdleistung"
                    value="Lieferant + Einkauf noch offen"
                    badge="optional"
                  />
                </div>
              ) : null}
            </div>
          </CalculationSection>

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
              <FinishingMatrixRow
                label="Schneiden"
                active
                note="Planschnitt / Endschnitt / Zwischenschnitt"
                fields={[
                  { label: "Schnittart", value: "Endschnitt" },
                  { label: "Schnitte", value: "4" },
                  { label: "intern/extern", value: "intern" },
                ]}
              />
              <FinishingMatrixRow
                label="Falzen"
                active={false}
                note="Falzart und Anzahl Brüche für Folder/Beilagen"
                fields={[
                  { label: "Falzart", value: "Wickelfalz" },
                  { label: "Brüche", value: "2" },
                  { label: "Maschine", value: "Falzmaschine" },
                ]}
              />
              <FinishingMatrixRow
                label="Rillen / Nuten"
                active={false}
                note="Wichtig bei starken Grammaturen und Foldern"
                fields={[
                  { label: "Rillungen", value: "2" },
                  { label: "Seite", value: "einseitig" },
                  { label: "Positionen", value: "später" },
                ]}
              />
              <FinishingMatrixRow
                label="Heften"
                active={false}
                note="Broschüren und gelochte Ringösenheftung"
                fields={[
                  { label: "Art", value: "Rückstich" },
                  { label: "Klammern", value: "2" },
                  { label: "Ösen", value: "nein" },
                ]}
              />
              <FinishingMatrixRow
                label="Klebebindung"
                active={false}
                note="PUR/Hotmelt, Rückenbreite und Umschlagrillung"
                fields={[
                  { label: "Art", value: "PUR" },
                  { label: "Rücken", value: "automatisch" },
                  { label: "Umschlag", value: "4-seitig" },
                ]}
              />
              <FinishingMatrixRow
                label="Fadenheftung"
                active={false}
                note="Meist Sonderleistung oder Fremdproduktion"
                fields={[
                  { label: "Lagen", value: "offen" },
                  { label: "Seiten/Lage", value: "16" },
                  { label: "Produktion", value: "extern" },
                ]}
              />
              <FinishingMatrixRow
                label="Bohren / Lochen / Ösen"
                active={false}
                note="Bohrbild, Durchmesser und Position"
                fields={[
                  { label: "Anzahl", value: "2" },
                  { label: "Ø", value: "6 mm" },
                  { label: "Ösen", value: "optional" },
                ]}
              />
              <FinishingMatrixRow
                label="Laminieren / Kaschieren"
                active={false}
                note="Matt, Glanz, Softtouch, ein- oder beidseitig"
                fields={[
                  { label: "Oberfläche", value: "matt" },
                  { label: "Seite", value: "1/0" },
                  { label: "Art", value: "Folie" },
                ]}
              />
              <FinishingMatrixRow
                label="Stanzen / Plotten"
                active={false}
                note="Konturschnitt, Stanzform oder digitale Weiterverarbeitung"
                fields={[
                  { label: "Art", value: "Kontur" },
                  { label: "Konturen", value: "offen" },
                  { label: "Stanze", value: "später" },
                ]}
              />
              <FinishingMatrixRow
                label="Verpacken / Versand"
                active
                note="Bündeln, Kartonieren, Etikettieren, Teillieferung"
                fields={[
                  { label: "Verpackung", value: "Karton" },
                  { label: "Bündel", value: "100er" },
                  { label: "Lieferung", value: "eine Adresse" },
                ]}
              />
                </tbody>
              </table>
            </div>
          </CalculationSection>

          <CalculationSection eyebrow="08" title="Kosten / Ergebnisvorgaben">
            <div className="pp-calc-input-grid pp-calc-input-grid--four">
              <CalculationField label="Materialkosten" value="aus Papierstamm später" badge="später" />
              <CalculationField label="Druckkosten" value="Maschinenstamm später" badge="später" />
              <CalculationField label="Weiterverarbeitung" value="Matrix × Tarife später" badge="später" />
              <CalculationField label="Fremdleistung" value="0,00 €" badge="optional" />
              <CalculationField label="Handling" value="15 min" badge="optional" />
              <CalculationField label="Versand" value="0,00 €" badge="optional" />
              <CalculationField label="Marge" value="35 %" badge="Pflicht" />
              <CalculationField label="Verkaufspreis netto" value="automatisch später" badge="später" />
            </div>
          </CalculationSection>
        </main>

        <aside
          className="pp-calculation-result-panel"
          aria-label="Kalkulation Ergebnis"
        >
          <div className="pp-calculation-result-panel__head">
            <p className="pp-eyebrow">Ergebnis</p>
            <h2>Auswertung / Nutzenrechner</h2>
            <span>Nüchterne Auswertung unter der Eingabemaske.</span>
          </div>

          <CalculationSheetPreview payload={payload} />

          <div className="pp-calculation-output-card">
            <h3>Produktionsdaten</h3>
            <div className="pp-calc-result-list">
              <ResultLine
                label="Produktionsweg"
                value={
                  productionModes.find((mode) => mode.id === productionMode)
                    ?.label ?? "Eigenproduktion"
                }
              />
              <ResultLine label="Plan" value={result.planType} />
              <ResultLine
                label="Nutzen"
                value={`${result.layout.usedSlots} von ${result.layout.totalSlots}`}
              />
              <ResultLine
                label="Bogenanzahl"
                value={
                  result.production.sheetsRequired
                    ? `${formatNumber(result.production.sheetsRequired)} Bogen`
                    : "offen"
                }
              />
              <ResultLine
                label="Zwischenschnitt"
                value={String(result.layout.gapMm ?? "offen")}
              />
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

          <button
            className="pp-calculation-create-button"
            type="button"
            onClick={handleCreateOrderDraft}
          >
            Auftrag aus Kalkulation erzeugen
          </button>

          <div
            className={
              draftWasCreated
                ? "pp-calculation-create-note is-active"
                : "pp-calculation-create-note"
            }
          >
            <strong>
              {draftWasCreated
                ? "Auftragsentwurf erzeugt"
                : "Noch nicht gespeichert"}
            </strong>
            <p>
              Demo-State ohne Persistenz. Beim Erzeugen wird der Entwurf in die
              aktuelle Auftragsliste übernommen und die Auftragstasche geöffnet.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
