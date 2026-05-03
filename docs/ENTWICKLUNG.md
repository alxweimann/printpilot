# PrintPilot – Entwicklungsdokumentation

Stand: 2026-05-03  
Aktuelle Arbeitsversion: **V153 – Dokumentbereiche im Hauptmenü getrennt**

Diese Datei dient als laufende Projektdokumentation für GitHub.  
Sie soll nach jedem größeren Entwicklungsschritt aktualisiert und mitgepusht werden.

---

## Ziel der App

**PrintPilot** ist eine moderne Kalkulations- und Angebots-App für den Digitaldruck.

Die App soll schrittweise folgende Bereiche abdecken:

- schnelle Kalkulation von Druckprodukten
- saubere Produkt-/Jobstruktur mit Druckteilen
- automatische Nutzenberechnung
- Material-, Maschinen- und Weiterverarbeitungskosten
- Angebots- und Dokumentenerstellung
- Stammdatenverwaltung
- lokale Datensicherung / Import / Export
- später optional Lager, Auftragsverwaltung und Produktion

---

## Aktueller Schwerpunkt

Aktuell liegt der Fokus auf dem Übergang von der **Kalkulation** in eine klare **Dokumentverwaltung**:

1. Kalkulation fachlich sauber abschließen
2. Druckteile und Produktionskosten nachvollziehbar darstellen
3. Kalkulation als Angebotsposition übernehmen
4. Angebotsentwurf mit Kundendaten, Positionen und Summen aufbauen
5. Angebotsvorschau und spätere PDF-Ausgabe vorbereiten
6. Dokumentbereiche im Hauptmenü sauber trennen
7. Bedienung ruhig, geführt und übersichtlich halten

---

## Entwicklungsstand nach Versionen

### V87 – Datensicherung / Import & Export

Eingebaut:

- Einstellungen für Datensicherung
- JSON-Backup für lokale Daten
- Sicherung importieren
- Vorbereitung für Export von:
  - Firmenprofil
  - Kunden
  - Dokumente
  - Maschinen
  - Material
  - Weiterverarbeitung
  - Leistungen
  - Produkttypen
  - Kalkulationsvorlagen
  - Dokumenttypen

---

### V88 – Produkt-/Jobstruktur in der Kalkulation

Eingebaut:

- Grundstruktur für Druckteile
- Trennung von:
  - Inhalt
  - Umschlag
  - Beileger
  - Zusatzbogen
- Vorbereitung für mehrteilige Produkte wie:
  - Broschüren
  - SD-Sätze
  - Blöcke
  - Mailings

---

### V89 – Druckteile bearbeitbar

Eingebaut:

- Druckteile als bearbeitbare Karten
- Druckteil duplizieren
- Druckteil löschen
- Druckteiltyp ändern
- Material, Druckart und Seiten je Druckteil editierbar

---

### V90 – Broschüren-Druckteile bearbeitbar

Eingebaut:

- Bearbeitungsbereich für Druckteile auch bei Broschüren sichtbar
- Inhalt und Umschlag können direkt bearbeitet werden

---

### V91 – Druckteile oben bearbeiten

Eingebaut:

- Druckteile weiter nach oben in die Kalkulation verschoben
- Bearbeitung näher an der Produktstruktur
- kein separater Bearbeitungsblock weiter unten

---

### V92 – Broschüren-Grunddaten oben

Eingebaut:

- Broschüren-Grunddaten vor den Druckteilen platziert
- Reihenfolge verbessert:
  - Format
  - Auflage
  - Inhaltsseiten
  - Umschlagseiten
  - Inhaltspapier
  - Umschlagpapier
  - danach Druckteile

---

### V93 – Seiten je Bogen automatisch

Eingebaut:

- „Seiten je Bogen“ ist kein Eingabefeld mehr
- Wert wird automatisch berechnet
- verhindert versehentliche falsche Eingaben
- Broschürenlogik:
  - Nutzen offene Doppelseite × 4 Seiten

---

### V94 – Broschürenprüfung & Warnungen

Eingebaut:

- Prüfung, ob Inhaltsseiten durch 4 teilbar sind
- Umschlagseiten fest auf 4 Seiten
- Warnungen direkt im Broschürenblock
- erste fachliche Plausibilitätsprüfungen

---

### V95 – Kostenblöcke

Eingebaut:

- erste klarere Kostenübersicht
- Trennung nach:
  - Material
  - Druck / Maschine
  - Weiterverarbeitung
  - Gemeinkosten
  - Deckungsbeitrag

---

### V96 – Kalkulation übersichtlicher

Eingebaut:

- rechte Kalkulationsauswertung neu strukturiert
- klarere Trennung:
  - Ergebnis
  - Produktionskosten
  - Preisaufbau
  - Details

---

### V97 – Eingabemaske klar strukturiert

Eingebaut:

- linke Kalkulationsseite in klare Abschnitte gegliedert:
  1. Auftrag / Vorlage
  2. Produktdaten / Broschüre
  3. Druckteile
  4. Auflage / Format / Nutzen
  5. Maschine / Druck
  6. Weiterverarbeitung
  7. Zuschläge / Preislogik

---

### V98 – Reihenfolge der Kalkulation angepasst

Neue Reihenfolge:

1. Auftrag / Vorlage
2. Auflage
3. Produktdaten / Broschüre
4. Druckteile
5. Maschine / Druck
6. Weiterverarbeitung
7. Zuschläge / Preislogik

---

### V99 – Farbliche Eingabeschritte

Eingebaut:

- Schritte 1–7 farblich differenziert
- Farbwirkung passend zur linken Hauptnavigation
- bessere Orientierung in der Kalkulation

Farben:

- Auftrag / Vorlage: Cyan
- Auflage: Fuchsia
- Produktdaten / Broschüre: Gelb
- Druckteile: Grün
- Maschine / Druck: Blau
- Weiterverarbeitung: Lime
- Zuschläge / Preislogik: Violett

---

### V100 – Eingabeblöcke kompakter & einklappbar

Eingebaut:

- erste Blöcke einklappbar
- Maschine / Druck, Weiterverarbeitung und Zuschläge kompakter

---

### V101 – Alle Eingabeschritte einklappbar

Eingebaut:

- alle Schritte 1–7 einklappbar
- Schritt 1 standardmäßig offen
- deutlich ruhigere Eingabemaske
- Nutzer kann Schritt für Schritt durch die Kalkulation gehen

---

### V102 – Druckteile kompakter

Eingebaut:

- Schritt 4 „Druckteile“ kompakter gestaltet
- Inhalt und Umschlag als kurze Karten/Zeilen
- wichtige Kurzinfos direkt sichtbar:
  - Seiten
  - Farbigkeit
  - Material
  - Materialbogen
  - Kosten
- Details erst beim Aufklappen

---

### V103 – Druckteilkarten breiter / kompakter

Eingebaut:

- linke Kalkulationsspalte breiter
- Druckteilkarten luftiger
- kleinere Info-Chips
- bessere Lesbarkeit bei Inhalt/Umschlag

---

### V104 – Auswertung / Produktionskosten klarer

Eingebaut:

- rechte Kalkulationsseite verbessert
- Ergebnis oben klarer:
  - Verkaufspreis
  - Stückpreis
  - Produktionskosten
  - Selbstkosten
  - Deckungsbeitrag
  - DB-Anteil
- Preisbrücke verständlicher:
  - Produktionskosten
  - Gemeinkosten
  - Selbstkosten
  - Deckungsbeitrag
  - Verkaufspreis netto

---

### V105 – Kalkulationsstatus / Warnungen

Eingebaut:

- Kalkulationsstatus mit Ampel-Logik
- Meldungen gruppiert nach:
  - Muss korrigiert werden
  - Fachlich prüfen
  - Hinweise
- zusätzliche Prüfungen:
  - Auflage fehlt
  - Material fehlt
  - Verkaufspreis unter Selbstkosten
  - negativer Deckungsbeitrag
- sichtbarer Versionsmarker:
  - V105 aktiv

---

### V106 – Schrittstatus in der Kalkulation

Eingebaut:

- Schrittkarten 1–7 mit Status-Badges
- Status:
  - OK
  - Prüfen
  - Optional
- Klick auf Schrittkarte springt zum passenden Eingabeblock
- bessere Orientierung in der Eingabemaske

---

### V107 – Bogenvorschau kompakt

Eingebaut, aber anschließend verworfen:

- Bogenvorschau kompakt geschlossen
- per Button ein-/ausklappbar

Grund für Rücknahme:

- Bediengefühl war nicht optimal
- Vorschau sollte besser rechts im Nutzenbereich stehen

---

### V108 – Bogenvorschau rechts

Eingebaut:

- Bogenvorschau rechts neben dem Nutzenbereich
- alter großer Vorschau-Block entfernt
- Eingabe links dadurch ruhiger

---

### V109 – Hochformat-Fix für Bogenvorschau

Eingebaut:

- Hochformat wird vollständig dargestellt
- Vorschau skaliert nach Breite und Höhe
- keine abgeschnittene Darstellung mehr

---

### V110 – Produktbild im Nutzen

Eingebaut, aber anschließend verworfen:

- Versuch, je Produktart kleine Produktgrafiken in den Nutzen anzuzeigen:
  - Broschüre
  - Visitenkarte
  - Poster
  - Aufkleber
  - Block

Grund für Rücknahme:

- optisch nicht überzeugend
- schlichte technische Vorschau war besser

---

### V111 – Bogenvorschau mit technischen Daten

Eingebaut:

- schlichte Vorschau aus V109 beibehalten
- technische Kurzinfos ergänzt:
  - Rohbogenformat
  - Endformat
  - Beschnitt
  - Zwischenschnitt
- Vorschau minimal breiter

---

### V112 – Nutzenberechnung fachlich absichern

Eingebaut:

- Nutzenstatus:
  - OK
  - Prüfen
  - Fehler
- bessere Erklärung, warum ein Nutzen gewählt wurde
- Vergleich Normal vs. Gedreht
- Hinweis, wenn Drehung gesperrt ist, aber besser wäre
- Warnung bei hoher Restfläche
- Hinweis, wenn Produkt nicht auf den Rohbogen passt

---

### V113 – Schrift auf Barlow umgestellt

Eingebaut:

- App-Schrift auf **Barlow** umgestellt
- weniger fette Schriftgewichte
- App wirkt ruhiger, schmaler und weniger blockig
- lange Texte brechen besser um

Gewichtung:

- normale Texte: 400 / 500
- Werte: 500
- Abschnittstitel: 600
- keine übermäßig fetten 800/900-Gewichte mehr

---

### V114 – Nutzenbereich optisch aufgeräumt

Eingebaut:

- Nutzenbereich ruhiger gestaltet
- „Gewählt weil“ über volle Breite
- lange Texte werden vollständig angezeigt
- Status kompakter
- wichtigste Werte besser sortiert
- Bogenvorschau bleibt rechts


---

### V115 – Druckteile fachlich klarer

Eingebaut:

- Schritt 4 „Druckteile“ fachlich verständlicher aufgebaut
- je Druckteil zusätzliche Übersicht mit:
  - Druckteiltyp
  - Seiten-/Mengenlogik
  - Farbigkeit
  - Material
  - Produktionsbogen
  - Materialbogen gesamt
  - Materialkosten
  - Anteil an den Materialkosten
- fachlicher Status je Druckteil:
  - Druckteil plausibel
  - Druckteil prüfen
- Hinweise je Druckteil, z. B.:
  - Inhaltsseiten nicht durch 4 teilbar
  - Umschlag sollte 4 Seiten haben
  - Materialbogen prüfen
  - Materialpreis fehlt
- Details bleiben weiterhin einklappbar

---

### V116 – Produktionskosten detaillierter

Eingebaut:

- rechte Auswertung um eine detaillierte Kostenaufschlüsselung erweitert
- Produktionskosten werden klarer getrennt nach:
  - Material nach Druckteil
  - Druck nach Druckteil
  - Rüstzeit & Maschine
  - Weiterverarbeitung
- Material wird getrennt gezeigt für:
  - Inhalt
  - Umschlag
  - weitere Druckteile
- variable Druckkosten werden rechnerisch anhand der Produktionsbogen auf Druckteile verteilt
- Rüstzeit wird separat mit Minuten und Maschinenstundensatz angezeigt
- Weiterverarbeitung zeigt Arbeitsschritte, Zusatzkosten und Gesamtsumme getrennt
- Preisbrücke bleibt darunter erhalten
- Ziel: Produktionskosten nicht nur als Summe anzeigen, sondern nachvollziehbar erklären
---

### V117 – Rechte Auswertung einklappbar & Status grün

Eingebaut:

- rechte Auswertungskarten sind jetzt ebenfalls einklappbar
- Ergebnis-Karte kann ein- und ausgeklappt werden
- Produktionskosten-/Preisaufbau-Karte kann ein- und ausgeklappt werden
- Kalkulationsstatus kann ein- und ausgeklappt werden
- Kostenmix-Karte kann ein- und ausgeklappt werden
- Status wirkt ruhiger und wird bei plausibler Kalkulation klar grün dargestellt
- Ziel: rechte Seite genauso ruhig und schrittweise bedienbar machen wie die linke Eingabemaske

---


### V119 – Rechte Karten besser priorisiert

Eingebaut:

- Ergebnis / Verkaufspreis bleibt rechts standardmäßig offen
- Kalkulationsstatus bleibt direkt darunter standardmäßig offen
- Status ist bei guter Kalkulation grün sichtbar
- Produktionskosten / Auswertung ist standardmäßig eingeklappt
- Kostenmix ist standardmäßig eingeklappt
- rechte Auswertung wirkt ruhiger und zeigt zuerst nur:
  - Was kostet es?
  - Ist die Kalkulation freigabefähig?
  - Gibt es Warnungen?

---

### V124 – Briefbogen-Hintergrund für Dokumente

Eingebaut:

- Dokumentdesign in den Einstellungen erweitert
- Briefbogen je Dokumenttyp vorbereitbar für:
  - Angebot
  - Auftragsbestätigung
  - Rechnung
  - Lieferschein
  - Mahnung
- Auswahl je Dokumenttyp:
  - ohne Briefbogen
  - Demo-Briefbogen
  - eigener Briefbogen als Bild
- Upload für PNG/JPG/WebP-Briefbogen
- Deckkraft einstellbar
- Vorschau im Bereich Einstellungen
- Angebots-/Dokumentvorschau nutzt den aktiven Briefbogen als Hintergrund
- Druck-/PDF-Vorschau übernimmt den Hintergrund

Hinweis:

- Für den ersten Schritt wird ein Bild-Hintergrund verwendet.
- Ideal ist ein A4-Hochformat-Briefbogen als PNG/JPG mit 300 dpi.
- Später kann der PDF-Export um echte PDF-Hintergründe erweitert werden.


### V125 – Briefbogen randlos und sicher positioniert

Eingebaut:

- echter Briefbogen-Hintergrund wird randlos hinter die Dokumentseite gelegt
- bei eigenem Briefbogen werden App-Firmenkopf und App-Footer in der Vorschau ausgeblendet
- verhindert doppelte Logos, doppelte Kontaktdaten und Überlagerungen
- Inhaltsbereich wird bei eigenem Briefbogen automatisch weiter nach unten gesetzt
- Druck-/PDF-Ausgabe nutzt bei Briefbogen `@page margin: 0`, damit der Hintergrund nicht zusätzlich eingerückt wird
- Dokumentseite ist auf A4-Breite begrenzt, damit die Vorschau nicht unkontrolliert skaliert

Wichtig:

- Für echte Firmenbriefbögen sollte die Datei als `public/briefbogen.png` liegen
- Im Dokumentdesign sollte „Eigenen Briefbogen verwenden“ aktiv sein
- Der Briefbogen selbst enthält bereits Logo, Kopfbereich und Fußbereich
- Die App legt nur noch Empfänger, Dokumentinhalt, Positionen und Summen darüber

---


### V130 – Stammdaten für Dokumentfooter / Bank- und Steuerdaten

Eingebaut:

- Firmenprofil um Dokumentanzeige erweitert
- Bankdaten ergänzt um Kontoinhaber
- Haken in den Stammdaten für:
  - Adresse auf Dokumenten anzeigen
  - Kontaktdaten anzeigen
  - Steuerdaten anzeigen
  - Bankdaten anzeigen
  - Stammdaten im Dokumentfuß anzeigen
- Angebots-/Dokumentvorschau nutzt diese Stammdaten dynamisch
- bei echtem Briefbogen bleiben Stammdaten standardmäßig deaktiviert, damit nichts doppelt erscheint
- vorbereitet für Angebot, Rechnung, Lieferschein und Auftragsbestätigung

Hinweis:

Die Anzeige erfolgt nur, wenn der Haupt-Haken **Stammdaten im Dokumentfuß anzeigen** aktiv ist und zusätzlich die gewünschten Datenbereiche aktiviert wurden.


### V139 – Höhenbasierter Seitenumbruch

Eingebaut:

- Angebotspositionen werden nicht mehr nur nach fester Anzahl verteilt
- jede Position bekommt eine geschätzte Layout-Höhe
- lange Beschreibungen verbrauchen mehr Platz
- kurze Positionen erlauben mehr Positionen pro Seite
- Summenblock wird nur auf eine Seite gesetzt, wenn noch ausreichend Platz vorhanden ist
- Hinweise & Bedingungen bleiben geschützt
- Footer im magentafarbenen Briefbogen bleibt frei

Geänderte Logik:

```text
Seite 1
├ feste Bereiche: Empfänger, Kundendaten, Betreff, Einleitung
├ variabler Leistungsbereich
└ Reserve für Summe + Hinweise, falls es die letzte Seite ist

Folgeseiten
├ Briefbogen erneut automatisch
├ Leistungsfortsetzung
├ mehr Platz für Positionen
└ Summe + Hinweise nur auf letzter Seite
```

Prüfung:

- kurze Positionen sollen dichter auf Seite 1 bleiben
- lange Positionsbeschreibungen sollen früher auf eine Folgeseite laufen
- Summe darf nicht mit Hinweisen oder Footer kollidieren
- Dokumentfuß bleibt im magentafarbenen Balken



### V140 – Dokumentnummern / Nummernkreise verbessert

Eingebaut:

- Nummernkreise für Dokumenttypen weiter ausgebaut
- Nummernformat bleibt: Präfix · Jahr automatisch · laufende Nummer
- Beispiel: `AN-2026-0027`
- Angebotsbereich zeigt jetzt:
  - aktuelle Dokumentnummer
  - nächste freie Nummer aus dem Nummernkreis
  - Hinweis zur automatischen Reservierung
- Beim ersten Speichern eines neuen Dokuments wird die aktuelle Nummer automatisch reserviert, damit nicht versehentlich dieselbe Nummer erneut verwendet wird.
- Nummer bleibt weiterhin manuell überschreibbar.
- Einstellungen zeigen eine Übersicht aller Nummernkreise für:
  - Angebot
  - Auftragsbestätigung
  - Rechnung
  - Lieferschein
  - Mahnung

---

### V141 – Angebotsliste / Dokumentverwaltung

Eingebaut:

- Angebotsbereich um eine deutlichere Dokumentverwaltung erweitert
- Liste gespeicherter Angebote und Dokumente sichtbarer aufgebaut
- Suche nach Nummer, Kunde, Dokumenttyp, Status und Betrag bleibt erhalten
- Filter nach Dokumenttyp und Status bleiben erhalten
- neue Schnellübersicht für:
  - Angebote
  - Entwürfe
  - gesendete Dokumente
  - angenommene Dokumente
- Schnellfilter per Klick auf die Statuskarten
- gespeicherte Dokumente können weiterhin geöffnet, dupliziert und gelöscht werden
- aktueller Dokumententwurf bleibt bearbeitbar

Ziel:

- Angebote und Dokumente später sauber wiederfinden
- Grundlage für spätere Workflows wie Angebot → Auftrag → Rechnung → Lieferschein

---


### V145 – Löschdialog stabilisiert

Korrigiert:

- App-Löschdialog bleibt erhalten
- Bestätigen führt die Löschaktion wieder zuverlässig aus
- Löschdialog liegt visuell über anderen App-Dialogen
- Dialog schließt zuerst und führt danach die bestätigte Aktion aus
- keine Browser-Popups

## Aktueller Stand

Aktuelle Version: **V130**

Aktuell gut funktionierende Bereiche:

- klare Eingabeschritte 1–7
- alle Schritte einklappbar
- farbliche Schrittführung
- Druckteile kompakt
- rechte Auswertung klarer und priorisiert
- Kalkulationsstatus mit Warnungen
- Bogenvorschau rechts
- Hochformat-Fix
- Barlow-Schrift
- Nutzenbereich optisch verbessert
- Briefbogen-Hintergrund randlos und ohne doppelte Firmenkopfdaten
- Druckteile zeigen fachliche Prüfung und Kostenübersicht je Druckteil
- Produktionskosten sind nach Material, Druck, Rüstzeit/Maschine und Weiterverarbeitung aufgeschlüsselt
- rechte Auswertungskarten sind einklappbar
- plausibler Kalkulationsstatus wird grün angezeigt

---

## Bekannte offene Punkte

Diese Punkte sind noch offen oder sollten später geprüft werden:

- Druckkosten später noch exakter nach Simplex/Duplex und Farbigkeit je Druckteil trennen
- Maschinenzeit später realistisch anhand Geschwindigkeit/Bögen pro Stunde berechnen
- Weiterverarbeitung detaillierter berechnen
- Materialkosten je Druckteil weiter mit Stammdaten/Lager verknüpfen
- Angebotsbereich mit Entwurfscockpit und Dokumentenübersicht weiter ausbauen
- PDF-/Druckansicht für Angebote
- Stammdaten stärker mit Kalkulation verknüpfen
- Datenmodell später aus `App.tsx` herauslösen
- Komponentenstruktur aufbauen, damit `App.tsx` nicht zu groß wird

---

## Geplante nächste Schritte

### V142 – Dokumentstatus und Workflow verbessern

Geplant:

- Statuswechsel direkt in der Dokumentliste
- klarere Farben für Entwurf / Versendet / Angenommen / Abgelehnt
- Dokumente archivieren statt direkt löschen
- später Workflow vorbereiten:
  - Angebot angenommen → Auftrag erzeugen
  - Auftrag abgeschlossen → Rechnung erzeugen
  - Rechnung offen / bezahlt verfolgen


### V141 – Dokumentstatus / Angebotsworkflow

Geplant:

- Statuslogik für Angebote und Folgebelege verbessern
- Statuswechsel: Entwurf → Gesendet → Angenommen / Abgelehnt
- bei angenommenem Angebot Auftragsbestätigung vorbereiten
- bei Rechnung Zahlungsstatus besser darstellen
- Dokumentübersicht nach Status besser filtern

---


### V119 – Weiterverarbeitung verbessern

Geplant:

- Weiterverarbeitung übersichtlicher darstellen
- Kosten je Arbeitsschritt besser erklären
- typische Druckerei-Schritte:
  - Schneiden
  - Falzen
  - Rillen
  - Rückendrahtheftung
  - Blockleimung
  - Klebebindung
  - Handarbeit
- spätere Verknüpfung mit Stammdaten

---

### V119 – Angebotsmodus vorbereiten

Geplant:

- aus Kalkulation ein Angebot erzeugen
- Kundenauswahl
- Angebotsnummer
- Angebotstext
- Positionen
- Netto / MwSt. / Brutto
- später PDF-Ausgabe

---

### V120 – Code-Struktur verbessern

Geplant:

- große `App.tsx` schrittweise aufteilen
- mögliche Struktur:

```text
src/
├ components/
│ ├ calculation/
│ ├ layout/
│ ├ ui/
├ data/
├ lib/
├ pages/
└ App.tsx
```

Ziel:

- wartbarer Code
- weniger Risiko bei Änderungen
- einzelne Bereiche besser bearbeitbar

---


### V125 – Angebotsdaten bearbeitbar machen

Geplant:

- Kunde auswählbar / bearbeitbar
- Angebotsnummer bearbeitbar
- Datum / Gültigkeit bearbeitbar
- Einleitungstext bearbeitbar
- Schlusstext bearbeitbar
- Positionstext bearbeitbar
- Rabatte / Zuschläge je Angebot vorbereiten


## Arbeitsregel für neue Versionen

Bei jedem größeren Entwicklungsschritt:

1. neue Version bauen
2. lokal testen:
   ```bash
   npm run dev
   ```
3. Build prüfen:
   ```bash
   npm run build
   ```
4. Dokumentation aktualisieren
5. Git prüfen:
   ```bash
   git status
   ```
6. alles übernehmen:
   ```bash
   git add .
   ```
7. committen:
   ```bash
   git commit -m "Kurze Beschreibung der Änderung"
   ```
8. pushen:
   ```bash
   git push
   ```

---

## Empfohlene Commit-Regel

Commit-Nachrichten sollten kurz beschreiben, was fachlich geändert wurde.

Beispiele:

```bash
git commit -m "Improve automatic imposition area"
git commit -m "Switch app typography to Barlow"
git commit -m "Improve sheet preview with technical data"
git commit -m "Add calculation status warnings"
git commit -m "Make all calculation input steps collapsible"
```

---

## Wichtig für weitere Arbeit mit ChatGPT

Wenn an der App weitergearbeitet wird, sollte diese Datei immer mit geprüft werden.

Wichtig sind vor allem:

- aktuelle Version
- letzte Änderung
- offene Punkte
- geplante nächste Schritte
- verworfene Ideen, damit sie nicht versehentlich erneut gebaut werden

Verworfene Ideen bisher:

- V107 kompakte Bogenvorschau per Button
- V110 Produktbild-Grafiken in der Bogenvorschau

Diese Ideen sollen vorerst **nicht** erneut umgesetzt werden.


---

### V119 – Weiterverarbeitung klarer strukturiert

Eingebaut:

- Schritt **6 · Weiterverarbeitung** fachlich übersichtlicher gestaltet
- Status direkt im Schritt sichtbar:
  - **OK** bei plausibler Weiterverarbeitung
  - **Prüfen** bei fachlichen Hinweisen
- aktive Arbeitsschritte kompakt als Produktionskette angezeigt
- klare Kennzeichnung von:
  - Schneiden / Endbeschnitt
  - Rillen / Falzvorbereitung
  - Heften / Binden
- Warnung, wenn bei Broschüren keine Heftung/Bindung gewählt ist
- Warnung, wenn bei Broschüren kein Schneid-/Endbeschnitt-Schritt gewählt ist
- Kosten je Arbeitsschritt weiterhin aufklappbar
- Summe Weiterverarbeitung und manuelle Zusatzkosten getrennt dargestellt

Prüfen:

- Bei Broschüre mit Schneiden + Rückendrahtheftung sollte der Status grün/OK sein.
- Entfernt man die Heftung, sollte der Status auf Prüfen wechseln.
- Die rechte Auswertung aus V118 bleibt priorisiert und einklappbar.


---

### V120 – Angebotsmodus vorbereitet

Eingebaut:

- rechter Bereich **Angebotsmodus V120** ergänzt
- Positionsvorschau direkt aus der Kalkulation:
  - Produktname
  - Auflage
  - Endformat
  - Maschine
  - Netto
  - MwSt. 19 %
  - Brutto
- Status zeigt, ob die Kalkulation als Angebotsposition bereit ist
- vorhandener Button **„In Angebot übernehmen“** bleibt die zentrale Übergabe in den Angebotsbereich
- Hinweis, dass Kundenauswahl, Angebotsnummer und Texte im Angebotsbereich gepflegt werden
- Ziel: Übergang von Kalkulation zu Angebot verständlicher machen

Prüfen:

- Rechts sollte **Angebotsmodus V120** sichtbar sein.
- Bei fehlerfreier Kalkulation sollte der Status **bereit** erscheinen.
- Bei kritischen Kalkulationsfehlern sollte der Status **nicht bereit** erscheinen.
- Netto, MwSt. und Brutto sollten plausibel angezeigt werden.
- Klick auf **„In Angebot übernehmen“** soll weiterhin in den Angebotsbereich wechseln und eine Position anlegen.

---

### V121 – Angebotsbereich aufgebaut

Eingebaut:

- Angebotsbereich mit neuem **Angebotsentwurf V121** erweitert
- oberer Cockpit-Bereich im Angebotsmodul ergänzt
- zentrale Informationen direkt sichtbar:
  - Dokumenttyp
  - Dokumentnummer
  - Status
  - Kunde
  - Anzahl Positionen
  - Netto
  - Brutto
- Buttons direkt im Entwurfsbereich:
  - Entwurf speichern
  - neue Nummer vergeben
  - Vorschau drucken / PDF
- Kundenauswahl und Dokumentkopf bleiben darunter vollständig bearbeitbar
- Dokumentenliste bleibt rechts erhalten
- Ziel: aus der Kalkulationsübergabe entsteht sichtbarer ein echter Angebotsentwurf

Prüfen:

- Im Bereich **Angebote** sollte oben **Angebotsbereich V121** sichtbar sein.
- Der Entwurfsbereich sollte Dokumentnummer, Kunde, Positionen, Netto und Brutto anzeigen.
- **Entwurf speichern** sollte das aktuelle Dokument in die Dokumentenliste übernehmen.
- **Neue Nummer vergeben** sollte eine neue Dokumentnummer erzeugen.
- **Vorschau drucken / PDF** sollte weiterhin die Druck-/PDF-Vorschau öffnen.

---

### V122 – Angebotsentwurf aus Kalkulation übernommen

Eingebaut:

- Button **„In Angebot übernehmen“** erzeugt jetzt klarer einen Angebotsentwurf aus der aktuellen Kalkulation
- Kalkulationsposition wird im Angebotsbereich vorne einsortiert
- Standard-Demoposition wird ersetzt, wenn sie noch unverändert vorhanden ist
- übernommene Position enthält:
  - Produktname
  - Auflage
  - Endformat
  - Farbigkeit / Produktionsmodus
  - Materialdetails
  - Weiterverarbeitung
  - Netto-Verkaufspreis je Einheit
  - MwSt. 19 %
  - Brutto über die Angebotsberechnung
- interne Notiz enthält jetzt die Quelle **Kalkulation V122** und die wichtigsten Kalkulationswerte
- rechter Angebotsmodus erklärt die Übergabe verständlicher
- sichtbarer Versionsmarker auf **V122 aktiv** aktualisiert

Prüfen:

- In der Kalkulation sollte **Kalkulation V122** sichtbar sein.
- Oben rechts sollte **V122 aktiv** sichtbar sein.
- Klick auf **„In Angebot übernehmen“** sollte in den Bereich **Angebote** wechseln.
- Im Angebotsbereich sollte die neue Kalkulationsposition oben stehen.
- Netto, MwSt. und Brutto sollten aus der übernommenen Position plausibel berechnet werden.
- Die unveränderte Demoposition sollte ersetzt werden, nicht zusätzlich stehen bleiben.

Geplanter nächster Schritt:

### V123 – Angebotspositionen kompakter und kundentauglicher

Geplant:

- Angebotspositionen optisch ruhiger darstellen
- Preisfelder besser gruppieren
- Positionsbeschreibung für Kunden sauberer formulieren
- interne Notiz stärker von Kundentext trennen
- Summenblock Netto / MwSt. / Brutto stärker hervorheben
- Vorbereitung für echte Angebotsvorschau mit Briefkopf


---

### V123 – Angebotsvorschau sauber gestalten

Eingebaut:

- Angebotsbereich sichtbar auf V123 aktualisiert
- Kundenvorschau deutlicher als eigener Prüfbereich gekennzeichnet
- Vorschau optisch näher an einem echten Kundenangebot ausgerichtet
- Dokument-Metadaten ergänzt:
  - Dokumenttyp
  - Dokumentnummer
  - Datum
  - Gültig bis / Fällig / Lieferdatum
- Betreff nutzt nun die erste Angebotsposition als lesbaren Bezug
- Hinweise & Bedingungen im Angebotsdokument klarer benannt
- Vorschau bleibt druck- und PDF-fähig

---

## Geplante nächste Schritte

### V141 – Dokumentstatus / Angebotsworkflow

Geplant:

- Statuslogik für Angebote und Folgebelege verbessern
- Statuswechsel: Entwurf → Gesendet → Angenommen / Abgelehnt
- bei angenommenem Angebot Auftragsbestätigung vorbereiten
- bei Rechnung Zahlungsstatus besser darstellen
- Dokumentübersicht nach Status besser filtern

---
 ab V124

### V124 – Angebotsvorschau weiter verfeinern

Geplant:

- Vorschau noch stärker wie ein echtes Geschäftsangebot gestalten
- Positionstabelle optisch ruhiger und besser lesbar machen
- Firmenkopf und Kundendaten weiter optimieren
- Angebotsnummer, Datum und Gültigkeit besser platzieren
- Druck-/PDF-Ausgabe weiter prüfen

### V125 – Angebotspositionen bearbeiten

Geplant:

- übernommene Kalkulationsposition im Angebot bearbeiten
- Positionstext manuell anpassen
- Menge und Einzelpreis kontrolliert ändern
- zusätzliche Positionen hinzufügen
- Positionen duplizieren oder entfernen


---

### V127 – Briefbogen-Satzspiegel korrigiert

Eingebaut:

- echte Briefbogen-Hintergründe bleiben randlos im Hintergrund
- Dokumentinhalt wird nicht mehr über das `print-area`-Padding positioniert, sondern über eine eigene `document-content-layer`
- dadurch bleiben die Abstände auch in Druck/PDF erhalten
- fester Satzspiegel für echten Briefbogen vorbereitet:
  - oben mindestens 55 mm frei für Logo/Briefkopf
  - links mindestens 18 mm
  - rechts mindestens 18 mm
  - unten mindestens 42 mm frei für Footer
- App-Firmenkopf und App-Footer bleiben bei eigenem Briefbogen ausgeblendet
- Druck-/PDF-CSS überschreibt die Inhaltsabstände nicht mehr
- sichtbarer Versionsmarker auf **V127 aktiv** aktualisiert

Warum diese Änderung nötig war:

- Der Briefbogen selbst war korrekt eingebunden.
- Beim PDF/Druck wurden die Inhaltsabstände aber durch die Print-CSS-Regel `padding: 0 !important` wieder entfernt.
- Dadurch saßen Empfänger, Kundendaten und Positionen zu weit oben bzw. zu nah am Footer.
- V127 legt die Inhalte jetzt in eine eigene Ebene über dem Briefbogen.

Prüfen:

- In der App sollte **V127 aktiv** sichtbar sein.
- In der Angebotsvorschau sollte der Briefbogen randlos im Hintergrund liegen.
- Der Inhalt sollte unterhalb des Logos beginnen.
- Der pinke Footer des Briefbogens sollte frei bleiben.
- Beim Drucken / PDF speichern sollten die Abstände genauso erhalten bleiben.
- `npm run build` sollte sauber durchlaufen.

Geplanter nächster Schritt:

### V127 – Briefbogen-Layout feinjustierbar machen

Geplant:

- in den Einstellungen Satzspiegel für Briefbogen bearbeitbar machen
- getrennte Werte für:
  - Abstand oben
  - Abstand unten
  - Abstand links
  - Abstand rechts
- je Dokumenttyp eigene Werte speichern
- Vorschau direkt aktualisieren
- Preset für awima/Weimann-Briefbogen vorbereiten


---

### V127 – DIN-Briefbogen und Satzspiegel korrigiert

Eingebaut:

- Briefbogen-Hintergrund wird nicht mehr über die gesamte Dokumenthöhe gestreckt
- Logo wird nicht mehr durch falsches Skalieren angeschnitten
- Hintergrund wird fest auf A4 gesetzt: 210 × 297 mm
- Satzspiegel DIN-orientiert vorbereitet:
  - oben ca. 45 mm
  - links ca. 20 mm
  - rechts ca. 20 mm
  - unten ca. 32 mm
- Angebotstext, Positionstabelle, Summen und Hinweise wurden kompakter gesetzt
- Ziel: ein einseitiges Standard-Angebot mit Briefbogen soll auf A4 bleiben
- Druck-/PDF-Ausgabe übernimmt die feste A4-Hintergrundlogik

Wichtig:

- Der Briefbogen bleibt weiterhin als `public/briefbogen.png` eingebunden.
- Für echte Briefbogen ist ein randloses A4-PNG mit 300 dpi ideal.
- Der Browserdruck kann nur randlos sein, wenn der Druckdialog ebenfalls randlos bzw. ohne Ränder eingestellt wird.

Nächster sinnvoller Schritt:

- V129 – Dokumentlayout weiter DIN-5008-orientiert machen:
  - Adressfenster genauer positionieren
  - Informationsblock rechts optional machen
  - mehrseitige Dokumente mit Folgeseitenlogik vorbereiten
  - Briefbogen nur auf Seite 1 oder auf allen Seiten steuerbar machen


---

### V129 – DIN-Briefbogen mit festen Bereichen und Folgeseiten

Eingebaut:

- echte A4-Seitenlogik für Dokumente mit Briefbogen
- pro Seite wird ein eigener Briefbogen-Hintergrund angelegt
- Empfänger, Kundendaten und Betreff sind auf Seite 1 fest positioniert
- Leistungen/Positionen sind der variable Bereich
- wenn mehr Positionen vorhanden sind, werden automatisch Folgeseiten erzeugt
- Folgeseiten erhalten ebenfalls den Briefbogen-Hintergrund
- Hinweise & Bedingungen werden unten fest oberhalb des Footerbereichs platziert
- Logo wird über `object-fit: contain` sicherer dargestellt, damit es nicht rechts abgeschnitten wird
- Druck-/PDF-Ausgabe nutzt dieselbe Seitenstruktur wie die Vorschau

Ziel:

```text
Seite 1
├ Briefbogen-Hintergrund
├ Empfänger fest
├ Kundendaten fest
├ Betreff fest
├ Leistungen variabel
└ Hinweise unten fest

Folgeseiten
├ Briefbogen-Hintergrund
├ Dokumentnummer / Seitenhinweis
├ Leistungen Fortsetzung variabel
└ Hinweise auf letzter Seite unten fest
```

Prüfen:

- Logo vollständig sichtbar
- Seite 1 wirkt DIN-konformer
- Leistungen laufen nicht mehr unkontrolliert in Footer/Briefkopf
- mehrere Positionen erzeugen sichtbare Folgeseiten mit Briefbogen
- Drucken / PDF speichern übernimmt die gleiche Struktur


---

### V129 – Betreffbereich DIN-konformer positioniert

Eingebaut:

- Betreffbereich auf dem Briefbogen weiter nach unten gesetzt
- Abstand zwischen Kundendaten und Betreff vergrößert
- Betreff-Schrift weniger fett gesetzt
- Laufweite normalisiert, damit `Angebot: Broschüre A4` sauberer wirkt
- Leistungsbereich entsprechend etwas nach unten verschoben
- feste Briefbogen-/Folgeseitenlogik aus V128 bleibt erhalten

Prüfen:

- Betreff überlappt nicht mehr mit Kundendaten
- Betreff wirkt DIN-gerechter und ruhiger
- Logo bleibt vollständig sichtbar
- Footer bleibt frei
- normale Angebote passen weiterhin auf eine Seite

---

### V131 – Stammdaten im magentafarbenen Briefbogen-Footer

Eingebaut:

- Stammdaten können im echten Briefbogen jetzt direkt im magentafarbenen Footerbereich erscheinen.
- Die Ausgabe ist professioneller als reiner Fließtext unter „Hinweise & Bedingungen“.
- Footerdaten werden in Gruppen gesetzt:
  - Firma
  - Steuer
  - Bank
- In den Stammdaten / Firmenprofil gibt es neue Einstellmöglichkeiten:
  - Platzierung: im magenta Balken oder unter Hinweise
  - Spalten: 2 oder 3 Spalten
  - Abstand von unten in mm
  - Footerhöhe in mm
  - Textfarbe: Weiß auf Magenta oder Dunkel
- Die Ausgabe bleibt über Haken steuerbar:
  - Adresse anzeigen
  - Kontaktdaten anzeigen
  - Steuerdaten anzeigen
  - Bankdaten anzeigen
  - Stammdaten im Dokumentfuß anzeigen

Ziel:

- Der echte Briefbogen soll professionell genutzt werden.
- Bereits vorgedruckte oder im Briefbogen gestaltete Bereiche dürfen nicht doppelt oder unkontrolliert belegt werden.
- Die Stammdaten sollen später für Angebot, Rechnung, Lieferschein und Auftragsbestätigung gleich funktionieren.

Aktuelle Version: **V141**

---

### V132 – Footerposition ohne Dropdown mit Minusbereich

Eingebaut:

- Platzierungsauswahl entfernt
- Stammdaten werden bei echtem Briefbogen immer im Footer/Briefbogenbereich ausgegeben
- Footer-Y-Position erlaubt jetzt negative Werte
- negative Werte schieben die Stammdaten weiter nach unten in den magentafarbenen Balken
- Standardposition auf -6 mm gesetzt
- Steuerung bleibt über:
  - Spalten 2 / 3
  - Footer Y-Position
  - Footerhöhe
  - Textfarbe
- Beschreibung in den Stammdaten klarer formuliert

Ziel:

- professionellere Platzierung im vorhandenen Briefbogen-Footer
- keine unnötige Auswahl „Unter Hinweise“ mehr
- bessere Feinjustierung bei randlosen Briefbögen

---

### V133 – Footer dreizeilig und professioneller umbrochen

Eingebaut:

- Footer bleibt fest im magentafarbenen Briefbogen-Balken
- keine Dropdown-Platzierung, weiterhin nur Footer
- Footer-Gruppen werden sinnvoll dreizeilig aufgebaut:
  - Firma: Firmenname, Adresse, Kontakt
  - Steuer: Steuernummer, USt-ID
  - Bank: Bank/Inhaber, IBAN, BIC
- lange Zeilen werden nicht mehr abgeschnitten
- Footertext bricht sauber um
- 2- und 3-Spalten-Ausgabe bleiben verfügbar
- negative Y-Position bleibt erhalten

Ziel:

- professioneller Dokumentfuß im Briefbogen
- keine abgeschnittenen Bankdaten
- besser lesbare Stammdaten im Magenta-Balken


## Update V136

Der Angebotsbereich kann jetzt Positionen deutlich besser bearbeiten. Der nächste sinnvolle Schritt ist V136: Positionen professioneller für mehrseitige Angebote paginieren und Positionen optional als Zwischensumme/Gruppierung vorbereiten.


---

### V136 – Angebotspositionen: Platz auf Seite 1 besser nutzen

Geändert:

- Erste Angebotsseite nutzt den variablen Leistungsbereich besser aus.
- Auf Seite 1 werden jetzt bis zu 4 Positionen platziert, bevor eine Folgeseite erzeugt wird.
- Folgeseiten nehmen bis zu 6 Positionen auf.
- Positionszeilen in der PDF-/Druckvorschau wurden etwas kompakter gesetzt.
- Feste Bereiche bleiben erhalten:
  - Empfänger
  - Kundendaten
  - Betreff
  - Hinweise / Bedingungen auf der letzten Seite
  - Footer im magentafarbenen Briefbogenbereich
- Ziel: Keine unnötige zweite Seite, wenn auf Seite 1 noch Platz für weitere Positionen ist.

Nächster sinnvoller Schritt:

### V137 – Intelligenter Seitenumbruch für Angebote

Geplant:

- Seitenumbruch nicht nur nach Positionsanzahl, sondern nach geschätzter Zeilenhöhe.
- Lange Positionsbeschreibungen sollen mehr Platz zählen als kurze Positionen.
- Summe und Hinweise sollen nur dann auf Seite 1 bleiben, wenn genug Platz vorhanden ist.
- Andernfalls wandern Summe und Hinweise sauber auf die nächste Seite.


### V137 – Summenblock und Seitenumbruch korrigiert

Eingebaut:

- Summenblock im Angebot kompakter gesetzt
- Positionszeilen in der PDF-/Briefbogenansicht etwas platzsparender gestaltet
- Leistungsbereich auf Seite 1 beginnt etwas früher
- Hinweise und Bedingungen bleiben vom Summenblock getrennt
- Ziel: Kein Überlappen von Brutto-Summe, Hinweisen und Footer bei 3–4 Positionen
- Vorbereitung für späteren echten höhenbasierten Seitenumbruch


---

### V139 – Seitenumbruch weniger früh

Eingebaut:

- Höhenbasierter Seitenumbruch wurde weniger konservativ eingestellt.
- Lange Positionen dürfen mehr Restfläche auf Seite 1 nutzen.
- Eine kurze Folgeposition rutscht nicht mehr unnötig früh auf Seite 2.
- Summenblock und Hinweise bleiben weiterhin als geschützter Bereich reserviert.
- Footer im magentafarbenen Briefbogen bleibt geschützt.

Prüfung:

- Test mit einer langen ersten Position und einer kurzen zweiten Position.
- Erwartung: Wenn noch genug Platz ist, bleibt die zweite Position auf Seite 1.
- Erst bei echter Überfüllung wird eine Folgeseite erzeugt.

---

### V142 – Löschbestätigungen in allen kritischen Bereichen

Eingebaut:

- Zentrale Sicherheitsabfrage vor Löschaktionen.
- Betroffene Bereiche:
  - Druckteile in der Kalkulation
  - Weiterverarbeitung in der Kalkulation
  - Angebotspositionen
  - gespeicherte Angebote/Dokumente
  - Kunden
  - Produkttypen
  - Materialzeilen in Kalkulationsvorlagen
  - Weiterverarbeitungsschritte in Kalkulationsvorlagen
  - Kalkulationsvorlagen
  - Leistungen/Artikel
  - Materialien
  - Maschinen
  - Farbkanäle bei Maschinen
  - Weiterverarbeitungs-Stammdaten
  - Firmenlogo
  - hochgeladener Briefbogen
- Löschdialog zeigt nach Möglichkeit den konkreten Namen des Objekts.
- Hinweis ergänzt: „Diese Aktion kann nicht rückgängig gemacht werden.“
- Schutz bleibt erhalten, wenn nur noch ein Pflichtdatensatz vorhanden ist.

Ziel:

- Versehentliches Löschen verhindern.
- Kritische Stammdaten und Dokumente besser schützen.
- Bedienung bleibt schnell, aber sicherer.
---

### V143 – App-Löschdialog statt Browser-Bestätigung

Geändert:

- Die Löschbestätigung nutzt jetzt keinen Browser-Dialog mehr.
- Stattdessen erscheint ein app-eigener Dialog im PrintPilot-Stil.
- Der Dialog liegt als Overlay über der App.
- Gestaltung:
  - Barlow-Schrift
  - weiche Rundungen
  - farbiger Akzent oben
  - klare Buttons „Abbrechen“ und „Ja, löschen“
- Alle bisherigen Löschschutz-Bereiche aus V142 bleiben erhalten.
- Abbrechen löscht nichts.
- Bestätigen führt die jeweilige Löschaktion aus.
- Auch das Zurücksetzen der Weiterverarbeitungs-Stammdaten nutzt jetzt den App-Dialog.

Ziel:

- Löschvorgänge wirken nicht mehr wie eine Browser-Funktion, sondern wie ein nativer Teil der App.
- Die Bedienung ist professioneller und konsistenter.


---

### V145 – App-Dialoge vereinheitlicht

Eingebaut:

- Neben dem Löschdialog gibt es jetzt einen allgemeinen PrintPilot-Dialog für Rückmeldungen.
- Aktionen mit sichtbarer App-Rückmeldung:
  - Dokument speichern
  - Dokument aktualisieren
  - Neue Dokumentnummer vergeben
  - Dokument duplizieren
  - Kalkulation in Angebot übernehmen
  - ungültige Sicherungsdatei beim Import
- Browser-Meldungen werden weiter reduziert.
- Der neue Dialog nutzt denselben Stil wie der Löschdialog:
  - Overlay über der App
  - farbiger Akzent oben
  - Barlow-Schrift
  - klare Aktionstaste
  - Varianten für Erfolg, Hinweis und Warnung

Ziel:

- Wichtige Aktionen fühlen sich app-like an.
- Der Nutzer bekommt klare Rückmeldung, ohne Browser-Popups.
- Der Dialog-Stil ist vorbereitet für spätere Aktionen wie Statusänderung, Angebot senden oder Nummernkreis-Prüfung.

### V148 – App-Dialoge sicher nachgezogen

Geändert:

- Der stabile Löschdialog aus V145 bleibt unverändert erhalten.
- Weitere app-like Rückmeldungen wurden ergänzt, ohne die Löschlogik erneut zu verändern.
- Zusätzliche Dialoge erscheinen jetzt bei:
  - Auftragsbestätigung vorbereiten
  - Rechnung vorbereiten
  - Lieferschein vorbereiten
  - Mahnung vorbereiten
  - zurück zum Angebotsmodus wechseln
- Erfolgs-, Hinweis- und Warndialoge nutzen denselben PrintPilot-Stil.
- Browser-Popups werden weiter vermieden.

Ziel:

- Die App wirkt konsistenter und professioneller.
- Wichtige Dokumentaktionen bekommen klare Rückmeldung.
- Die zuvor reparierte Löschfunktion bleibt stabil.

---

Nächster sinnvoller Schritt:

### V148 – Dokumentstatus und Folgeprozess

Geplant:

- Angebotsstatus sauberer führen:
  - Entwurf
  - Versendet
  - Angenommen
  - Abgelehnt
- Statusänderung mit Datum.
- Aus angenommenem Angebot später Auftrag/Rechnung/Lieferschein erzeugen.
- Dokumentliste weiter in Richtung echter Dokumentverwaltung ausbauen.

### V148 – Statuswechsel für Dokumente

Eingebaut:

- Statuswechsel direkt im Angebots-/Dokumentbereich
- Statusoptionen für Angebot und Dokumente:
  - Entwurf
  - Versendet
  - Angenommen
  - Abgelehnt
- Statuswechsel erzeugt einen App-Dialog statt Browsermeldung
- bei „Versendet“ wird ein Sendedatum vorbereitet
- bei „Angenommen“ wird ein Annahmedatum vorbereitet
- bei „Abgelehnt“ kann ein Ablehnungsgrund gepflegt werden
- Statuskarte ist farblich differenziert:
  - Entwurf neutral
  - Versendet cyan
  - Angenommen grün
  - Abgelehnt rot
- Angebotsliste bleibt für spätere Folgeprozesse vorbereitet

---

## Nächster geplanter Schritt

### V148 – Folgeprozess aus Status

Geplant:

- aus angenommenem Angebot Auftrag vorbereiten
- Rechnung aus angenommenem Angebot erzeugen
- Lieferschein aus angenommenem Angebot erzeugen
- Statuswechsel und Folgeprozess fachlich stärker verbinden
- gespeicherte Dokumente besser nach Status auswerten


---

### V148 – Folgeprozesse aus angenommenem Angebot

Eingebaut:

- neuer Bereich **Folgeprozess V148** im Angebotsbereich
- aus einem angenommenen Angebot können vorbereitet werden:
  - Auftragsbestätigung / Auftrag
  - Rechnung
  - Lieferschein
- Folgedokumente bekommen eine neue Nummer aus dem passenden Nummernkreis
- Ursprungsdokument wird als Quelle gespeichert und angezeigt
- Hinweis, wenn ein Folgedokument erzeugt wird, obwohl das Angebot noch nicht angenommen ist
- App-Dialog bestätigt den Folgeprozess
- bestehende Löschdialoge bleiben unverändert stabil

Geplante nächste Schritte:

### V149 – Dokumenttypen fachlich trennen

Geplant:

- Angebotsvorschau je Dokumenttyp optimieren
- Rechnung mit Zahlungsdaten und Fälligkeit stärker hervorheben
- Lieferschein ohne Preise noch klarer gestalten
- Auftragsbestätigung mit eigenem Text und Produktionshinweisen
- Ursprungsdokument in Vorschau und Dokumentliste sichtbarer machen


---

### V149 – Dokumenttypen fachlich unterscheiden

Eingebaut:

- neuer Bereich **Dokumentlogik V149** im Angebots-/Dokumentbereich
- je Dokumenttyp eigene fachliche Hinweise:
  - Angebot: Gültigkeit, Angebotsstatus und Folgeprozess
  - Auftragsbestätigung: Produktionsfreigabe, Lieferhinweis und Kundenauftrag
  - Rechnung: Fälligkeit, Zahlungsstatus und Bankdaten
  - Lieferschein: preisfreie Ansicht, Mengen und Lieferdaten
  - Mahnung: Rechnungsbezug, offener Betrag und neue Zahlungsfrist
- Betreff wird beim Dokumenttypwechsel passender gesetzt:
  - Angebot: ...
  - Auftragsbestätigung: ...
  - Rechnung: ...
  - Lieferschein: ...
  - Mahnung: ...
- Zahlungsbedingungen werden je Dokumenttyp sinnvoller vorbelegt
- Lieferschein bleibt ohne Preise und Summen
- Folgeprozesse aus angenommenem Angebot bleiben erhalten
- App-Dialoge und stabiler Löschdialog bleiben unverändert

---

### V150 – Druck-/PDF-Ausgabe je Dokumenttyp sauberer

Eingebaut:

- Kundenvorschau / Druckausgabe wurde je Dokumenttyp erweitert.
- Im Betreffbereich erscheinen jetzt dokumenttypabhängige Kurzinfos:
  - Angebot: Angebotsdatum, gültig bis, Status
  - Auftragsbestätigung: Bestätigungsdatum, Quelle, Status
  - Rechnung: Rechnungsdatum, Fälligkeitsdatum, Zahlungsstatus
  - Lieferschein: Lieferscheindatum, Quelle, Hinweis „Preise ausgeblendet“
  - Mahnung: Mahndatum, Fälligkeit, offener Betrag
- Tabellenkopf passt sich fachlich an:
  - Leistung
  - Auftragsposition
  - Rechnungsposition
  - Lieferposition
  - Rechnung / Position
- Fortsetzungsseiten bekommen eine passendere Überschrift je Dokumenttyp.
- Lieferschein bleibt weiterhin ohne Preise und Summen.
- Briefbogen, Footer im Magenta-Balken und Seitenumbruch bleiben erhalten.
- App-Dialoge und stabiler Löschdialog bleiben unverändert.

Ziel:

- Angebot, Auftragsbestätigung, Rechnung, Lieferschein und Mahnung wirken im Druck/PDF nicht mehr wie dieselbe Vorlage mit anderem Namen.
- Wichtige Dokumentinformationen stehen direkt sichtbar im Dokumentkopf.
- Die Vorschau bleibt DIN-orientiert und briefbogenfähig.

Geplante nächste Schritte:

### V153 – Rechnung fachlich ausbauen

Geplant:

- Zahlungsblock auf Rechnungen stärker hervorheben
- Fälligkeit, Zahlungsziel und offener Betrag klarer darstellen
- Zahlungsstatus in Dokumentliste und Vorschau konsistenter machen
- Bankdaten bei Rechnung optional als Pflicht-Hinweis prüfen
- später: Teilzahlungen und Zahlungseingang sauber verwalten


---

### V153 – Dokumentbereiche im Hauptmenü getrennt

Eingebaut:

- Dokumentbereiche wurden aus dem überladenen Angebotsbereich herausgezogen.
- Linkes Hauptmenü erweitert um eigene Bereiche:
  - Angebote
  - Aufträge
  - Rechnungen
  - Lieferscheine
  - Mahnungen
- Jeder Bereich startet mit dem passenden Dokumenttyp:
  - Angebote → Angebot
  - Aufträge → Auftragsbestätigung
  - Rechnungen → Rechnung
  - Lieferscheine → Lieferschein
  - Mahnungen → Mahnung
- Die Dokumentliste filtert beim Öffnen standardmäßig auf den jeweiligen Dokumenttyp.
- Die vorhandene Dokumentlogik bleibt erhalten:
  - Statuswechsel
  - Folgeprozesse
  - Nummernkreise
  - Briefbogen
  - Footer
  - PDF-/Druckausgabe
  - App-Dialoge
  - Löschdialog

Ziel:

- Der Bereich „Angebote“ wird nicht mehr mit allen Dokumenttypen überladen.
- Angebote, Aufträge, Rechnungen, Lieferscheine und Mahnungen wirken wie eigene Arbeitsbereiche.
- Die App ist im linken Menü näher an einer echten Druckerei-/ERP-Software.

Geplante nächste Schritte:

### V153 – Dokumentbereiche weiter spezialisieren

Geplant:

- Angebote: Angebotsgültigkeit und Folgeprozess fokussieren
- Aufträge: Produktions- und Lieferhinweise stärker ausbauen
- Rechnungen: Zahlungsstatus, Fälligkeit und offener Betrag klarer machen
- Lieferscheine: Lieferadresse, Versandart und Unterschriftsbereich vorbereiten
- Mahnungen: Rechnungsbezug, Mahnstufe und Zahlungsfrist vorbereiten

### V153 – Duplizieren mit App-Hinweis

Eingebaut:

- Beim Duplizieren von Angebotspositionen erscheint wieder ein App-Dialog.
- Beim Duplizieren von Druckteilen erscheint ein App-Dialog.
- Beim Duplizieren von Kalkulationsvorlagen erscheint ein App-Dialog.
- Das Duplizieren gespeicherter Dokumente behält den App-Dialog bei.
- Keine Browser-Popups.
- Löschdialog aus V145 bleibt stabil.



---

### V153 – Dokumentbereiche optisch aufgeräumt

Eingebaut:

- Dokumentbereiche im linken Menü bleiben getrennt:
  - Angebote
  - Aufträge
  - Rechnungen
  - Lieferscheine
  - Mahnungen
- jeder Bereich erhält eine eigene Modulübersicht
- Kennzahlen je Dokumentbereich:
  - Dokumente gesamt
  - Entwürfe
  - Versendet
  - Angenommen
  - Abgelehnt bzw. bei Rechnungen offener Betrag
- aktueller Entwurf wird oben klarer angezeigt
- Netto-Volumen je Bereich wird sichtbar
- nächster sinnvoller Arbeitsschritt wird als Hinweis angezeigt
- Dokumentliste wurde neutraler benannt und passt besser zu allen Dokumenttypen
- App-Hinweise beim Duplizieren aus V152 bleiben erhalten
- Löschdialog bleibt stabil

Ziel:

- die getrennten Menübereiche sollen nicht nur technisch getrennt sein, sondern wie eigenständige Module wirken
- weniger Überladung in einem einzigen Angebotsbereich
- klarere Orientierung je Dokumenttyp

---

### V154 – Dokumentbereich-Farben korrigiert

Eingebaut:

- die Hero-/Modulkopf-Farben der Dokumentbereiche passen jetzt zum jeweiligen Menüpunkt
- Rechnungen verwenden im oberen Kopfbereich jetzt Cyan/Sky statt Gelb
- Angebote bleiben Gelb
- Aufträge verwenden Grün/Emerald
- Lieferscheine verwenden Lime/Emerald
- Mahnungen verwenden Rose/Rot
- die farbliche Zuordnung ist dadurch konsistenter mit der linken Navigation

Ziel:

- jeder Dokumentbereich soll sofort optisch wiedererkennbar sein
- keine falsche gelbe Zuordnung bei Rechnungen oder anderen Dokumenttypen
- professionelleres Modulgefühl für Angebote, Aufträge, Rechnungen, Lieferscheine und Mahnungen

---

## Nächste geplante Schritte

### V155 – Dokumentlisten je Bereich weiter verfeinern

Geplant:

- Tabellen/Karten je Bereich noch stärker an Dokumenttyp anpassen
- Angebote: Gültigkeit, Status und Folgeprozess
- Aufträge: Produktionsstatus und Liefertermin
- Rechnungen: Fälligkeit, Zahlungsstatus und offener Betrag
- Lieferscheine: Versandart und Lieferadresse
- Mahnungen: Mahnstufe, offener Betrag und neue Zahlungsfrist
- bessere Schnellaktionen je Bereich


---

### V155 – Dokumentbereich-Aktionen je Modul aufgeräumt

Eingebaut:

- neue Modulaktionen je Dokumentbereich
- Angebote zeigen passende Aktionen:
  - in Auftrag übernehmen
  - Rechnung vorbereiten
  - Lieferschein vorbereiten
- Aufträge zeigen passende Aktionen:
  - Produktion markieren
  - Rechnung erstellen
  - Lieferschein erstellen
- Rechnungen zeigen passende Aktionen:
  - Zahlung erfassen
  - Mahnung vorbereiten
  - Zahlungsstatus prüfen
- Lieferscheine zeigen passende Aktionen:
  - Lieferung erledigt
  - Rechnung erzeugen
  - Versandhinweis vorbereiten
- Mahnungen zeigen passende Aktionen:
  - Zahlung erfassen
  - Mahnstufe / Frist vorbereiten
  - Rechnungsbezug weiterführen
- App-Dialoge bleiben aktiv
- stabiler Löschdialog bleibt erhalten

Ziel:

- nicht mehr überall dieselben Buttons anzeigen
- jeder Dokumentbereich wirkt fachlich eigenständiger
- weniger Überladung im Dokumentbereich
- Folgeprozesse sind besser nach Modul sortiert
