import { getModuleConfig } from "../app/moduleConfig";
import { PageHeader } from "../layout/PageHeader";
import { PageTabs } from "../layout/PageTabs";
import { Field } from "../ui/Field";
import { FieldGrid } from "../ui/FieldGrid";
import { Input } from "../ui/Input";
import { SectionHeader } from "../ui/SectionHeader";
import { Select } from "../ui/Select";

export function CalculationPage() {
  const module = getModuleConfig("calculation");

  return (
    <div className="page">
      <PageHeader
        title={module.title}
        description={module.description}
        actionLabel={module.actionLabel}
      />

      <PageTabs tabs={module.tabs ?? []} activeTab="Eingabe" />

      <section className="calculation-sheet">
        <div className="calculation-sheet-header">
          <div>
            <div className="sheet-kicker">Eingabemaske</div>
            <h2>Druckprodukt kalkulieren</h2>
          </div>

          <div className="sheet-meta">
            <span>Status</span>
            <strong>Entwurf</strong>
          </div>
        </div>

        <SectionHeader>Kunde</SectionHeader>

        <FieldGrid>
          <Field label="Kunde">
            <Input placeholder="Kunde auswählen" />
          </Field>

          <Field label="Ansprechpartner">
            <Input placeholder="Name" />
          </Field>

          <Field label="Anfrage vom">
            <Input type="date" />
          </Field>

          <Field label="Projekt / Betreff">
            <Input placeholder="z. B. Imagebroschüre Frühjahr" />
          </Field>

          <Field label="Bearbeiter">
            <Input placeholder="z. B. Alex" />
          </Field>

          <Field label="Liefertermin">
            <Input type="date" />
          </Field>
        </FieldGrid>

        <SectionHeader>Produkt</SectionHeader>

        <FieldGrid>
          <Field label="Produktart">
            <Select defaultValue="">
              <option value="" disabled>
                Produktart wählen
              </option>
              <option>Broschüre</option>
              <option>Flyer</option>
              <option>Folder</option>
              <option>Plakat</option>
              <option>Visitenkarte</option>
              <option>Freies Produkt</option>
            </Select>
          </Field>

          <Field label="Produktbezeichnung">
            <Input placeholder="z. B. A4 Broschüre 32 Seiten" />
          </Field>

          <Field label="Auflage">
            <Input inputMode="numeric" placeholder="z. B. 500" />
          </Field>
        </FieldGrid>

        <SectionHeader>Format & Umfang</SectionHeader>

        <FieldGrid>
          <Field label="Endformat">
            <Select defaultValue="">
              <option value="" disabled>
                Format wählen
              </option>
              <option>A6</option>
              <option>A5</option>
              <option>A4</option>
              <option>A3</option>
              <option>DIN lang</option>
              <option>Freies Format</option>
            </Select>
          </Field>

          <Field label="Breite mm">
            <Input inputMode="decimal" placeholder="210" />
          </Field>

          <Field label="Höhe mm">
            <Input inputMode="decimal" placeholder="297" />
          </Field>

          <Field label="Seiten Inhalt">
            <Input inputMode="numeric" placeholder="z. B. 28" />
          </Field>

          <Field label="Seiten Umschlag">
            <Input inputMode="numeric" placeholder="z. B. 4" />
          </Field>

          <Field label="Beschnitt mm">
            <Input inputMode="decimal" placeholder="3" />
          </Field>
        </FieldGrid>

        <SectionHeader>Papier</SectionHeader>

        <FieldGrid>
          <Field label="Papier Inhalt">
            <Select defaultValue="">
              <option value="" disabled>
                Papier wählen
              </option>
              <option>90 g/m² Offset</option>
              <option>120 g/m² Bilderdruck matt</option>
              <option>135 g/m² Bilderdruck matt</option>
              <option>170 g/m² Bilderdruck matt</option>
              <option>Freies Material</option>
            </Select>
          </Field>

          <Field label="Papier Umschlag">
            <Select defaultValue="">
              <option value="" disabled>
                Optional
              </option>
              <option>200 g/m² Bilderdruck matt</option>
              <option>250 g/m² Bilderdruck matt</option>
              <option>300 g/m² Bilderdruck matt</option>
              <option>350 g/m² Bilderdruck matt</option>
              <option>Kein Umschlag</option>
            </Select>
          </Field>

          <Field label="Rohbogenformat">
            <Select defaultValue="">
              <option value="" disabled>
                Rohbogen wählen
              </option>
              <option>SRA3</option>
              <option>A3</option>
              <option>A4</option>
              <option>Freies Rohformat</option>
            </Select>
          </Field>

          <Field label="Laufrichtung">
            <Select defaultValue="">
              <option value="" disabled>
                Laufrichtung wählen
              </option>
              <option>Schmalbahn</option>
              <option>Breitbahn</option>
              <option>Automatisch</option>
            </Select>
          </Field>

          <Field label="Papierpreis">
            <Input placeholder="später aus Materialstamm" disabled />
          </Field>

          <Field label="Ausschuss">
            <Input inputMode="decimal" placeholder="z. B. 5 %" />
          </Field>
        </FieldGrid>

        <SectionHeader>Druck</SectionHeader>

        <FieldGrid>
          <Field label="Maschine">
            <Select defaultValue="">
              <option value="" disabled>
                Maschine wählen
              </option>
              <option>Xerox Iridesse</option>
              <option>Xerox Iridesse Sonderfarben</option>
              <option>Xerox Nuvera</option>
              <option>Canon VP140</option>
              <option>Roland TrueVis VG3 540</option>
            </Select>
          </Field>

          <Field label="Farbigkeit Inhalt">
            <Select defaultValue="">
              <option value="" disabled>
                Farbigkeit wählen
              </option>
              <option>4/4-farbig</option>
              <option>4/0-farbig</option>
              <option>1/1 schwarz</option>
              <option>1/0 schwarz</option>
              <option>Sonderfarbe</option>
            </Select>
          </Field>

          <Field label="Farbigkeit Umschlag">
            <Select defaultValue="">
              <option value="" disabled>
                Optional
              </option>
              <option>4/4-farbig</option>
              <option>4/0-farbig</option>
              <option>1/1 schwarz</option>
              <option>1/0 schwarz</option>
              <option>Kein Umschlag</option>
            </Select>
          </Field>

          <Field label="Druckmodus">
            <Select defaultValue="">
              <option value="" disabled>
                Modus wählen
              </option>
              <option>Simplex</option>
              <option>Duplex</option>
              <option>Automatisch</option>
            </Select>
          </Field>

          <Field label="Nutzen">
            <Input placeholder="später berechnet" disabled />
          </Field>

          <Field label="Rüstzeit">
            <Input placeholder="später aus Maschine" disabled />
          </Field>
        </FieldGrid>

        <SectionHeader>Weiterverarbeitung</SectionHeader>

        <FieldGrid>
          <Field label="Schneiden">
            <Select defaultValue="Ja">
              <option>Ja</option>
              <option>Nein</option>
            </Select>
          </Field>

          <Field label="Falzen">
            <Select defaultValue="">
              <option value="" disabled>
                Falzart wählen
              </option>
              <option>Kein Falz</option>
              <option>Einbruchfalz</option>
              <option>Wickelfalz</option>
              <option>Zickzackfalz</option>
              <option>Altarfalz</option>
            </Select>
          </Field>

          <Field label="Bindung / Heftung">
            <Select defaultValue="">
              <option value="" disabled>
                Verarbeitung wählen
              </option>
              <option>Keine</option>
              <option>Rückendrahtheftung</option>
              <option>Klebebindung</option>
              <option>Blockleimung</option>
              <option>Blockheftung</option>
            </Select>
          </Field>

          <Field label="Rillen">
            <Select defaultValue="Nein">
              <option>Nein</option>
              <option>Ja</option>
            </Select>
          </Field>

          <Field label="Stanzen">
            <Select defaultValue="Nein">
              <option>Nein</option>
              <option>Ja</option>
            </Select>
          </Field>

          <Field label="Handarbeit">
            <Input placeholder="Optional" />
          </Field>
        </FieldGrid>

        <SectionHeader>Verpackung & Versand</SectionHeader>

        <FieldGrid>
          <Field label="Verpackung">
            <Select defaultValue="">
              <option value="" disabled>
                Verpackung wählen
              </option>
              <option>Karton</option>
              <option>Packpapier</option>
              <option>Palette</option>
              <option>Neutral</option>
              <option>Keine Verpackung</option>
            </Select>
          </Field>

          <Field label="Versandart">
            <Select defaultValue="">
              <option value="" disabled>
                Versand wählen
              </option>
              <option>Abholung</option>
              <option>Auslieferung</option>
              <option>Paketdienst</option>
              <option>Spedition</option>
            </Select>
          </Field>

          <Field label="Lieferadresse">
            <Input placeholder="Falls abweichend" />
          </Field>
        </FieldGrid>

        <div className="calculation-footer">
          <button type="button" className="button-secondary">
            Entwurf speichern
          </button>

          <button type="button" className="button-primary">
            Weiter zur Übersicht
          </button>
        </div>
      </section>
    </div>
  );
}
