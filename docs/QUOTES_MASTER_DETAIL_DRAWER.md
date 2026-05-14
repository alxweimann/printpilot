# Angebote: Master-Detail-Drawer

Stand: 14.05.2026

## Änderung

Die Angebotsseite wurde vom festen Zwei-Spalten-Layout auf den neuen Master-Detail-Drawer-Standard umgestellt.

## Vorher

- Tabelle links
- Angebotskopf/Konditionen dauerhaft rechts daneben
- Hauptansicht wurde durch das Detailformular verkleinert

## Jetzt

- Tabelle nutzt die volle Hauptfläche
- Klick auf eine Angebotszeile öffnet rechts den Detail-Drawer
- Angebotskopf und Konditionen liegen im Drawer
- Bearbeiten, Änderungen verwerfen, Auftrag erstellen und Angebot speichern bleiben im Drawer-Footer erhalten
- bestehende ConfirmDialog-Logik für Auftragserstellung und doppelte Aufträge bleibt erhalten

## Betroffene Datei

```txt
src/pages/QuotesPage.tsx
```

## Nächster Schritt

Als nächstes sollte die Auftragsseite auf denselben Standard umgestellt werden:

```txt
src/pages/OrdersPage.tsx
```

Ziel auch dort:

- Auftragstabelle volle Breite
- Zeile anklicken
- Auftragsdetails rechts im Drawer
- bestehende Freigabe-/Status-/ConfirmDialog-Logik erhalten
