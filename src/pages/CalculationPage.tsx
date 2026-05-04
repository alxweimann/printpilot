import { getModuleConfig } from "../app/moduleConfig";
import { PageHeader } from "../layout/PageHeader";
import { PageTabs } from "../layout/PageTabs";
import { Field } from "../ui/Field";
import { FieldGrid } from "../ui/FieldGrid";
import { Input } from "../ui/Input";
import { SectionHeader } from "../ui/SectionHeader";

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

      <section className="form-sheet">
        <SectionHeader>Kundendaten</SectionHeader>

        <FieldGrid>
          <Field label="Kunde">
            <Input placeholder="Kunde auswählen" />
          </Field>

          <Field label="Ansprechpartner">
            <Input placeholder="Name" />
          </Field>

          <Field label="Datum">
            <Input type="date" />
          </Field>
        </FieldGrid>

        <SectionHeader>Produktdaten</SectionHeader>

        <FieldGrid>
          <Field label="Produkt">
            <Input placeholder="z. B. Broschüre A4" />
          </Field>

          <Field label="Auflage">
            <Input placeholder="z. B. 500" />
          </Field>

          <Field label="Format">
            <Input placeholder="z. B. A4" />
          </Field>

          <Field label="Umfang">
            <Input placeholder="z. B. 32 Seiten" />
          </Field>

          <Field label="Farbigkeit">
            <Input placeholder="z. B. 4/4-farbig" />
          </Field>

          <Field label="Liefertermin">
            <Input type="date" />
          </Field>
        </FieldGrid>

        <SectionHeader>Produktion</SectionHeader>

        <FieldGrid>
          <Field label="Papier Inhalt">
            <Input placeholder="Material auswählen" />
          </Field>

          <Field label="Papier Umschlag">
            <Input placeholder="Optional" />
          </Field>

          <Field label="Maschine">
            <Input placeholder="Maschine auswählen" />
          </Field>

          <Field label="Weiterverarbeitung">
            <Input placeholder="z. B. schneiden, heften" />
          </Field>

          <Field label="Verpackung">
            <Input placeholder="z. B. Karton" />
          </Field>

          <Field label="Versand">
            <Input placeholder="z. B. Lieferung" />
          </Field>
        </FieldGrid>
      </section>
    </div>
  );
}
