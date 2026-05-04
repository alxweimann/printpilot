import { PageHeader } from "../layout/PageHeader";
import { PageTabs } from "../layout/PageTabs";

export function CalculationPage() {
  return (
    <div className="page">
      <PageHeader
        title="Kalkulation"
        description="Technische Eingabemaske für Druckprodukte. Noch ohne Berechnungslogik."
        actionLabel="Neue Kalkulation"
      />

      <PageTabs
        tabs={["Eingabe", "Positionen", "Kalkulation", "Übersicht", "Ausgabe"]}
        activeTab="Eingabe"
      />

      <section className="form-sheet">
        <div className="form-section-title">Kundendaten</div>

        <div className="field-grid">
          <label className="field">
            <span>Kunde</span>
            <input placeholder="Kunde auswählen" />
          </label>

          <label className="field">
            <span>Ansprechpartner</span>
            <input placeholder="Name" />
          </label>

          <label className="field">
            <span>Datum</span>
            <input type="date" />
          </label>
        </div>

        <div className="form-section-title">Produktdaten</div>

        <div className="field-grid">
          <label className="field">
            <span>Produkt</span>
            <input placeholder="z. B. Broschüre A4" />
          </label>

          <label className="field">
            <span>Auflage</span>
            <input placeholder="z. B. 500" />
          </label>

          <label className="field">
            <span>Format</span>
            <input placeholder="z. B. A4" />
          </label>

          <label className="field">
            <span>Umfang</span>
            <input placeholder="z. B. 32 Seiten" />
          </label>

          <label className="field">
            <span>Farbigkeit</span>
            <input placeholder="z. B. 4/4-farbig" />
          </label>

          <label className="field">
            <span>Liefertermin</span>
            <input type="date" />
          </label>
        </div>

        <div className="form-section-title">Produktion</div>

        <div className="field-grid">
          <label className="field">
            <span>Papier Inhalt</span>
            <input placeholder="Material auswählen" />
          </label>

          <label className="field">
            <span>Papier Umschlag</span>
            <input placeholder="Optional" />
          </label>

          <label className="field">
            <span>Maschine</span>
            <input placeholder="Maschine auswählen" />
          </label>

          <label className="field">
            <span>Weiterverarbeitung</span>
            <input placeholder="z. B. schneiden, heften" />
          </label>

          <label className="field">
            <span>Verpackung</span>
            <input placeholder="z. B. Karton" />
          </label>

          <label className="field">
            <span>Versand</span>
            <input placeholder="z. B. Lieferung" />
          </label>
        </div>
      </section>
    </div>
  );
}