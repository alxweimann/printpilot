# Orders Status Guard

## Ziel

Die Auftragslogik wurde erweitert.

## Betroffene Datei

```text
src/pages/OrdersPage.tsx
```

## Statuswechsel

Wenn der Status eines Auftrags geändert und gespeichert wird, wechselt die Auftragsmaske automatisch in den passenden Tab.

Beispiel:

```text
Status: Wartet → In Produktion
Speichern
Auftrag wird im Tab "In Produktion" angezeigt
```

Technisch:

```ts
if (activeTab !== savedOrder.status) {
  setActiveTab(savedOrder.status);
}

selectItem(savedOrder.id);
```

## Freigabe-Schutz

Ein Auftrag darf nicht ohne Warnung in Produktion gesetzt werden, wenn keine gültige Freigabe vorliegt.

Blockierende Freigaben:

```text
Freigabe ausstehend
Korrektur angefordert
Daten unvollständig
```

Erlaubt ohne Warnung:

```text
Freigabe erteilt
Nicht erforderlich
```

Wenn ein nicht freigegebener Auftrag auf `In Produktion` gesetzt wird, erscheint eine Browser-Bestätigung.

Nur bei Bestätigung wird gespeichert.

## Warnmeldung

Die Meldung enthält:

```text
Auftragsnummer
Produkt
aktueller Freigabestatus
Hinweis, dass keine gültige Freigabe vorliegt
Bestätigung für Produktion
```

## Test

```text
Aufträge öffnen
Schloss öffnen
Auftrag mit Freigabe ausstehend wählen
Status auf In Produktion setzen
Änderungen speichern
Warnmeldung muss erscheinen
Abbrechen → Auftrag bleibt unverändert
erneut speichern und bestätigen → Auftrag wandert in Tab In Produktion
```
