# PrintPilot – Entwicklungsdokumentation

Stand: 2026-05-03  
Aktuelle Arbeitsversion: **V117 – rechte Auswertung einklappbar & Status grün**

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

Aktuell liegt der Fokus auf der **Kalkulation**:

1. Eingabemaske klar strukturieren
2. Druckteile fachlich sauber abbilden
3. Nutzenberechnung und Bogenvorschau verbessern
4. Produktionskosten verständlich darstellen
5. Warnungen und Kalkulationsstatus einbauen
6. Bedienung ruhiger und übersichtlicher machen

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

## Aktueller Stand

Aktuelle Version: **V117**

Aktuell gut funktionierende Bereiche:

- klare Eingabeschritte 1–7
- alle Schritte einklappbar
- farbliche Schrittführung
- Druckteile kompakt
- rechte Auswertung klarer
- Kalkulationsstatus mit Warnungen
- Bogenvorschau rechts
- Hochformat-Fix
- Barlow-Schrift
- Nutzenbereich optisch verbessert
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
- Angebotsmodus mit sauberer Ausgabe
- PDF-/Druckansicht für Angebote
- Stammdaten stärker mit Kalkulation verknüpfen
- Datenmodell später aus `App.tsx` herauslösen
- Komponentenstruktur aufbauen, damit `App.tsx` nicht zu groß wird

---

## Geplante nächste Schritte

### V118 – Weiterverarbeitung verbessern

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
