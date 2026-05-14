# Master-Detail-Drawer: Komponente

Stand: 14.05.2026

## Ziel

PrintPilot verwendet künftig für Listen und Detailansichten einen einheitlichen Master-Detail-Standard:

- Tabelle bleibt die volle Hauptansicht
- Klick auf eine Tabellenzeile öffnet rechts einen Drawer
- Detailinformationen werden im Drawer angezeigt
- bestehende Tabellen bleiben sichtbar und bedienbar
- Edit-/Save-/ConfirmDialog-Logik kann im Drawer weiterverwendet werden

## Neue Datei

```txt
src/ui/DetailDrawer.tsx
```

## Enthaltene Komponenten

- `DetailDrawer`
- `DetailDrawerSection`
- `DetailDrawerField`
- `DetailDrawerFieldGrid`

## Grundstruktur

```tsx
<DetailDrawer
  open={selectedItem !== null}
  title="Auftrag 10023"
  subtitle="Müller GmbH · Lieferung offen"
  eyebrow="Auftrag"
  onClose={() => setSelectedItem(null)}
  footer={<button>Speichern</button>}
>
  <DetailDrawerSection title="Details">
    <DetailDrawerFieldGrid>
      <DetailDrawerField label="Kunde" value="Müller GmbH" />
      <DetailDrawerField label="Status" value="In Produktion" />
    </DetailDrawerFieldGrid>
  </DetailDrawerSection>
</DetailDrawer>
```

## Geplante Reihenfolge

1. `DetailDrawer`-Komponente einbauen
2. Aufträge auf Tabellenansicht + Drawer umstellen
3. Angebote auf Tabellenansicht + Drawer umstellen
4. Rechnungen vorbereiten
5. Lieferscheine vorbereiten
6. Mahnungen vorbereiten
7. Stammdaten nachziehen

## Wichtige Designregel

Keine Detailkarten mehr dauerhaft unter oder neben der Tabelle platzieren.

Die Tabelle bleibt die Hauptfläche. Details erscheinen nur bei Auswahl rechts im Drawer.
