import { useMemo, useState } from "react";
import { getModuleConfig } from "../app/moduleConfig";
import { PageHeader } from "../layout/PageHeader";
import { usePrintPilotStore } from "../store/PrintPilotStore";
import { PageTabs } from "../layout/PageTabs";
import { Field } from "../ui/Field";
import { FieldGrid } from "../ui/FieldGrid";
import { Input } from "../ui/Input";
import { SectionHeader } from "../ui/SectionHeader";
import { Select } from "../ui/Select";
import { WorkspaceHeader } from "../ui/WorkspaceHeader";

type Orientation = "normal" | "rotated";
type PrintSideMode = "color" | "black" | "blank";

type ImpositionVariant = {
  orientation: Orientation;
  label: string;
  itemWidth: number;
  itemHeight: number;
  columns: number;
  rows: number;
  ups: number;
  usedWidth: number;
  usedHeight: number;
  restWidth: number;
  restHeight: number;
  usedArea: number;
  wasteArea: number;
};

function formatPresetLabel(format: {
  name: string;
  widthMm: string;
  heightMm: string;
}) {
  return `${format.name} · ${format.widthMm} × ${format.heightMm} mm`;
}

function toNumber(value: string, fallback = 0) {
  const normalized = value.replace(",", ".").trim();
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatNumber(value: number, digits = 0) {
  return new Intl.NumberFormat("de-DE", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("de-DE", {
    currency: "EUR",
    style: "currency",
  }).format(value);
}

function calculateVariant(params: {
  orientation: Orientation;
  finalWidth: number;
  finalHeight: number;
  sheetWidth: number;
  sheetHeight: number;
  bleed: number;
  gap: number;
  margin: number;
}): ImpositionVariant {
  const { orientation, finalWidth, finalHeight, sheetWidth, sheetHeight, bleed, gap, margin } = params;
  const trimWidth = orientation === "normal" ? finalWidth : finalHeight;
  const trimHeight = orientation === "normal" ? finalHeight : finalWidth;
  const itemWidth = Math.max(1, trimWidth + bleed * 2);
  const itemHeight = Math.max(1, trimHeight + bleed * 2);
  const availableWidth = Math.max(0, sheetWidth - margin * 2);
  const availableHeight = Math.max(0, sheetHeight - margin * 2);
  const columns = Math.max(0, Math.floor((availableWidth + gap) / (itemWidth + gap)));
  const rows = Math.max(0, Math.floor((availableHeight + gap) / (itemHeight + gap)));
  const ups = columns * rows;
  const usedWidth = columns > 0 ? columns * itemWidth + Math.max(0, columns - 1) * gap : 0;
  const usedHeight = rows > 0 ? rows * itemHeight + Math.max(0, rows - 1) * gap : 0;
  const printableArea = availableWidth * availableHeight;
  const usedArea = ups * itemWidth * itemHeight;

  return {
    orientation,
    label: orientation === "normal" ? "Normal" : "Gedreht",
    itemWidth,
    itemHeight,
    columns,
    rows,
    ups,
    usedWidth,
    usedHeight,
    restWidth: Math.max(0, availableWidth - usedWidth),
    restHeight: Math.max(0, availableHeight - usedHeight),
    usedArea,
    wasteArea: Math.max(0, printableArea - usedArea),
  };
}

function getBestVariant(variants: ImpositionVariant[]) {
  return [...variants].sort((a, b) => {
    if (b.ups !== a.ups) return b.ups - a.ups;
    return a.wasteArea - b.wasteArea;
  })[0];
}

function getSideClicks(mode: PrintSideMode, sheets: number) {
  if (mode === "blank") return { black: 0, color: 0 };
  if (mode === "black") return { black: sheets, color: 0 };

  return { black: 0, color: sheets };
}

export function CalculationPage() {
  const module = getModuleConfig("calculation");
  const { settings } = usePrintPilotStore();
  const productFormatOptions = settings.productFormats.filter(
    (format) => format.isActive === "Ja",
  );
  const rawSheetFormatOptions = settings.rawSheetFormats.filter(
    (format) => format.isActive === "Ja",
  );
  const defaultProductFormat =
    productFormatOptions.find((format) => format.isDefault === "Ja") ??
    productFormatOptions[0];
  const defaultRawSheetFormat =
    rawSheetFormatOptions.find((format) => format.isDefault === "Ja") ??
    rawSheetFormatOptions[0];

  const [quantity, setQuantity] = useState("1000");
  const [productPreset, setProductPreset] = useState(
    defaultProductFormat?.id ?? "custom",
  );
  const [finalWidth, setFinalWidth] = useState(
    defaultProductFormat?.widthMm ?? "210",
  );
  const [finalHeight, setFinalHeight] = useState(
    defaultProductFormat?.heightMm ?? "99",
  );
  const [sheetPreset, setSheetPreset] = useState(defaultRawSheetFormat?.id ?? "custom");
  const [sheetWidth, setSheetWidth] = useState(defaultRawSheetFormat?.widthMm ?? "450");
  const [sheetHeight, setSheetHeight] = useState(defaultRawSheetFormat?.heightMm ?? "320");
  const [bleed, setBleed] = useState("3");
  const [gap, setGap] = useState("4");
  const [margin, setMargin] = useState("5");
  const [isDuplex, setIsDuplex] = useState("yes");
  const [frontMode, setFrontMode] = useState<PrintSideMode>("color");
  const [backMode, setBackMode] = useState<PrintSideMode>("color");
  const [wastePercent, setWastePercent] = useState("5");
  const [setupSheets, setSetupSheets] = useState("10");
  const [paperPerThousand, setPaperPerThousand] = useState("65");
  const [colorClickCost, setColorClickCost] = useState("0,033");
  const [blackClickCost, setBlackClickCost] = useState("0,008");
  const [markupPercent, setMarkupPercent] = useState("35");

  const calculation = useMemo(() => {
    const numericQuantity = Math.max(1, Math.ceil(toNumber(quantity, 1)));
    const numericFinalWidth = Math.max(1, toNumber(finalWidth, 210));
    const numericFinalHeight = Math.max(1, toNumber(finalHeight, 99));
    const numericSheetWidth = Math.max(1, toNumber(sheetWidth, 450));
    const numericSheetHeight = Math.max(1, toNumber(sheetHeight, 320));
    const numericBleed = Math.max(0, toNumber(bleed, 3));
    const numericGap = Math.max(0, toNumber(gap, 4));
    const numericMargin = Math.max(0, toNumber(margin, 5));
    const numericWastePercent = Math.max(0, toNumber(wastePercent, 5));
    const numericSetupSheets = Math.max(0, Math.ceil(toNumber(setupSheets, 10)));
    const numericPaperPerThousand = Math.max(0, toNumber(paperPerThousand, 65));
    const numericColorClickCost = Math.max(0, toNumber(colorClickCost, 0.033));
    const numericBlackClickCost = Math.max(0, toNumber(blackClickCost, 0.008));
    const numericMarkupPercent = Math.max(0, toNumber(markupPercent, 35));

    const variants = [
      calculateVariant({
        orientation: "normal",
        finalWidth: numericFinalWidth,
        finalHeight: numericFinalHeight,
        sheetWidth: numericSheetWidth,
        sheetHeight: numericSheetHeight,
        bleed: numericBleed,
        gap: numericGap,
        margin: numericMargin,
      }),
      calculateVariant({
        orientation: "rotated",
        finalWidth: numericFinalWidth,
        finalHeight: numericFinalHeight,
        sheetWidth: numericSheetWidth,
        sheetHeight: numericSheetHeight,
        bleed: numericBleed,
        gap: numericGap,
        margin: numericMargin,
      }),
    ];
    const bestVariant = getBestVariant(variants);
    const netSheets = bestVariant.ups > 0 ? Math.ceil(numericQuantity / bestVariant.ups) : 0;
    const variableWasteSheets = Math.ceil(netSheets * (numericWastePercent / 100));
    const grossSheets = netSheets + variableWasteSheets + numericSetupSheets;
    const effectiveBackMode: PrintSideMode = isDuplex === "yes" ? backMode : "blank";
    const frontClicks = getSideClicks(frontMode, grossSheets);
    const backClicks = getSideClicks(effectiveBackMode, grossSheets);
    const colorClicks = frontClicks.color + backClicks.color;
    const blackClicks = frontClicks.black + backClicks.black;
    const clickCost = colorClicks * numericColorClickCost + blackClicks * numericBlackClickCost;
    const paperCost = grossSheets * (numericPaperPerThousand / 1000);
    const productionCost = clickCost + paperCost;
    const salesPrice = productionCost * (1 + numericMarkupPercent / 100);

    return {
      bestVariant,
      blackClicks,
      clickCost,
      colorClicks,
      effectiveBackMode,
      grossSheets,
      netSheets,
      numericBleed,
      numericFinalHeight,
      numericFinalWidth,
      numericGap,
      numericMargin,
      numericQuantity,
      numericSheetHeight,
      numericSheetWidth,
      paperCost,
      productionCost,
      salesPrice,
      variableWasteSheets,
      variants,
    };
  }, [
    backMode,
    blackClickCost,
    bleed,
    colorClickCost,
    finalHeight,
    finalWidth,
    frontMode,
    gap,
    isDuplex,
    margin,
    markupPercent,
    paperPerThousand,
    quantity,
    setupSheets,
    sheetHeight,
    sheetWidth,
    wastePercent,
  ]);

  function handleProductPresetChange(value: string) {
    setProductPreset(value);
    const preset = productFormatOptions.find((format) => format.id === value);

    if (preset) {
      setFinalWidth(preset.widthMm);
      setFinalHeight(preset.heightMm);
    }
  }

  function handleSheetPresetChange(value: string) {
    setSheetPreset(value);
    const preset = rawSheetFormatOptions.find((format) => format.id === value);

    if (preset) {
      setSheetWidth(preset.widthMm);
      setSheetHeight(preset.heightMm);
    }
  }

  return (
    <div className="page">
      <PageHeader
        title={module.title}
        description="Digitaldruck-Kalkulation mit Bogen-Nutzenrechner für DIN-Formate, Rohbogen, Beschnitt, Klicks und Papierkosten."
        actionLabel={module.actionLabel}
      />

      <PageTabs tabs={["Digitaldruck Bogen", "Großformatdruck", "Material", "Zusammenfassung"]} activeTab="Digitaldruck Bogen" />

      <section className="calculation-sheet calculation-v1-sheet">
        <WorkspaceHeader
          kicker="Kalkulation V1"
          title="Digitaldruck-Bogenrechner"
          statusValue="Rechenlogik aktiv"
        />

        <div className="calculation-layout">
          <div className="calculation-input-panel">
            <SectionHeader>Produkt & Format</SectionHeader>

            <FieldGrid>
              <Field label="Auflage">
                <Input inputMode="numeric" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
              </Field>

              <Field label="Endformat-Vorlage">
                <Select value={productPreset} onChange={(event) => handleProductPresetChange(event.target.value)}>
                  {productFormatOptions.map((format) => (
                    <option key={format.id} value={format.id}>
                      {formatPresetLabel(format)}
                    </option>
                  ))}
                  <option value="custom">Freies Endformat</option>
                </Select>
              </Field>

              <Field label="Endformat Breite mm">
                <Input
                  inputMode="decimal"
                  value={finalWidth}
                  onChange={(event) => {
                    setProductPreset("custom");
                    setFinalWidth(event.target.value);
                  }}
                />
              </Field>

              <Field label="Endformat Höhe mm">
                <Input
                  inputMode="decimal"
                  value={finalHeight}
                  onChange={(event) => {
                    setProductPreset("custom");
                    setFinalHeight(event.target.value);
                  }}
                />
              </Field>

              <Field label="Rohbogenformat">
                <Select value={sheetPreset} onChange={(event) => handleSheetPresetChange(event.target.value)}>
                  {rawSheetFormatOptions.map((format) => (
                    <option key={format.id} value={format.id}>
                      {formatPresetLabel(format)}
                    </option>
                  ))}
                  <option value="custom">Freies Rohformat</option>
                </Select>
              </Field>

              <Field label="Rohbogen Breite mm">
                <Input
                  inputMode="decimal"
                  value={sheetWidth}
                  onChange={(event) => {
                    setSheetPreset("custom");
                    setSheetWidth(event.target.value);
                  }}
                />
              </Field>

              <Field label="Rohbogen Höhe mm">
                <Input
                  inputMode="decimal"
                  value={sheetHeight}
                  onChange={(event) => {
                    setSheetPreset("custom");
                    setSheetHeight(event.target.value);
                  }}
                />
              </Field>
            </FieldGrid>

            <SectionHeader>Nutzenparameter</SectionHeader>

            <FieldGrid>
              <Field label="Beschnitt mm" helperText="wird umlaufend gerechnet">
                <Input inputMode="decimal" value={bleed} onChange={(event) => setBleed(event.target.value)} />
              </Field>

              <Field label="Abstand mm" helperText="Abstand zwischen Nutzen">
                <Input inputMode="decimal" value={gap} onChange={(event) => setGap(event.target.value)} />
              </Field>

              <Field label="Maschinenrand mm" helperText="umlaufend abgezogen">
                <Input inputMode="decimal" value={margin} onChange={(event) => setMargin(event.target.value)} />
              </Field>
            </FieldGrid>

            <SectionHeader>Druck & Kosten</SectionHeader>

            <FieldGrid>
              <Field label="Druckmodus">
                <Select value={isDuplex} onChange={(event) => setIsDuplex(event.target.value)}>
                  <option value="no">Einseitig</option>
                  <option value="yes">Zweiseitig</option>
                </Select>
              </Field>

              <Field label="Vorderseite">
                <Select value={frontMode} onChange={(event) => setFrontMode(event.target.value as PrintSideMode)}>
                  <option value="color">4-farbig</option>
                  <option value="black">1-farbig Schwarz</option>
                  <option value="blank">Unbedruckt</option>
                </Select>
              </Field>

              <Field label="Rückseite">
                <Select value={backMode} onChange={(event) => setBackMode(event.target.value as PrintSideMode)} disabled={isDuplex !== "yes"}>
                  <option value="color">4-farbig</option>
                  <option value="black">1-farbig Schwarz</option>
                  <option value="blank">Unbedruckt</option>
                </Select>
              </Field>

              <Field label="Ausschuss %">
                <Input inputMode="decimal" value={wastePercent} onChange={(event) => setWastePercent(event.target.value)} />
              </Field>

              <Field label="Rüstbogen">
                <Input inputMode="numeric" value={setupSheets} onChange={(event) => setSetupSheets(event.target.value)} />
              </Field>

              <Field label="Papier €/1000 Bg.">
                <Input inputMode="decimal" value={paperPerThousand} onChange={(event) => setPaperPerThousand(event.target.value)} />
              </Field>

              <Field label="Klick Farbe €">
                <Input inputMode="decimal" value={colorClickCost} onChange={(event) => setColorClickCost(event.target.value)} />
              </Field>

              <Field label="Klick Schwarz €">
                <Input inputMode="decimal" value={blackClickCost} onChange={(event) => setBlackClickCost(event.target.value)} />
              </Field>

              <Field label="Aufschlag %">
                <Input inputMode="decimal" value={markupPercent} onChange={(event) => setMarkupPercent(event.target.value)} />
              </Field>
            </FieldGrid>
          </div>

          <aside className="calculation-result-panel">
            <div className="calculation-result-card calculation-result-card-primary">
              <span>Beste Variante</span>
              <strong>{calculation.bestVariant.ups > 0 ? `${calculation.bestVariant.ups} Nutzen` : "Kein Nutzen"}</strong>
              <p>
                {calculation.bestVariant.ups > 0
                  ? `${calculation.bestVariant.label}: ${calculation.bestVariant.columns} × ${calculation.bestVariant.rows} auf ${formatNumber(calculation.numericSheetWidth)} × ${formatNumber(calculation.numericSheetHeight)} mm`
                  : "Format passt mit diesen Rändern nicht auf den Rohbogen."}
              </p>
            </div>

            <div className="calculation-result-grid">
              <div className="calculation-result-card">
                <span>Druckbogen netto</span>
                <strong>{formatNumber(calculation.netSheets)}</strong>
                <p>Auflage geteilt durch Nutzen</p>
              </div>

              <div className="calculation-result-card">
                <span>Druckbogen brutto</span>
                <strong>{formatNumber(calculation.grossSheets)}</strong>
                <p>inkl. Ausschuss und Rüstbogen</p>
              </div>

              <div className="calculation-result-card">
                <span>Klicks Farbe</span>
                <strong>{formatNumber(calculation.colorClicks)}</strong>
                <p>bedruckte Farbseiten</p>
              </div>

              <div className="calculation-result-card">
                <span>Klicks Schwarz</span>
                <strong>{formatNumber(calculation.blackClicks)}</strong>
                <p>bedruckte Schwarzseiten</p>
              </div>
            </div>

            <div className="calculation-cost-card">
              <div>
                <span>Papierkosten</span>
                <strong>{formatCurrency(calculation.paperCost)}</strong>
              </div>
              <div>
                <span>Klickkosten</span>
                <strong>{formatCurrency(calculation.clickCost)}</strong>
              </div>
              <div>
                <span>Herstellkosten V1</span>
                <strong>{formatCurrency(calculation.productionCost)}</strong>
              </div>
              <div className="calculation-cost-total">
                <span>Verkaufspreis kalk.</span>
                <strong>{formatCurrency(calculation.salesPrice)}</strong>
              </div>
            </div>
          </aside>
        </div>

        <SectionHeader>Nutzenvergleich</SectionHeader>

        <div className="imposition-comparison">
          {calculation.variants.map((variant) => (
            <article
              className={`imposition-card ${variant.orientation === calculation.bestVariant.orientation ? "is-best" : ""}`}
              key={variant.orientation}
            >
              <div>
                <span>{variant.label}</span>
                <strong>{variant.ups} Nutzen</strong>
              </div>
              <p>
                Motiv inkl. Beschnitt: {formatNumber(variant.itemWidth)} × {formatNumber(variant.itemHeight)} mm · Raster {variant.columns} × {variant.rows}
              </p>
              <small>
                belegte Fläche: {formatNumber(variant.usedWidth)} × {formatNumber(variant.usedHeight)} mm · Rest: {formatNumber(variant.restWidth)} × {formatNumber(variant.restHeight)} mm
              </small>
            </article>
          ))}
        </div>

        <div className="calculation-note">
V1 rechnet bewusst als robuste Kalkulationsbasis: Format- und Rohbogenstammdaten, Nutzen, Druckbogen, Papierkosten und Klickkosten. Laufrichtung,
          grafische Bogenvorschau, Maschinenzeiten, Weiterverarbeitung und Großformatdruck folgen in den nächsten Ausbaustufen.
        </div>
      </section>
    </div>
  );
}
