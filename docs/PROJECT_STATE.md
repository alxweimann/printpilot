# PROJECT STATE

## Plantafel mit Fälligkeitsgruppen

Die Dashboard-Plantafel gruppiert Aufträge jetzt optisch nach Fälligkeit:

```text
Überfällig
Heute
Morgen
Später diese Woche
```

Die bestehende Fortschritts- und Blocker-Logik bleibt unverändert.

## Plantafel Wochenansicht als Tageszeilen

Die Wochenansicht zeigt die Tage jetzt untereinander. Links steht der Tag, rechts daneben die passenden Aufträge als Mini-Karten nebeneinander.

## Plantafel Mini-Karten einheitlich kompakt

Die Mini-Auftragskarten der Wochen-Plantafel haben jetzt eine einheitliche kompakte Höhe. Texte werden sauber gekürzt, Fortschrittsbalken bleiben sichtbar und die Zeilen wirken ruhiger.

## Plantafel Mini-Karten ohne Abschneiden

Die Mini-Auftragskarten der Wochen-Plantafel behalten eine einheitliche Mindesthöhe, schneiden Inhalte aber nicht mehr per `max-height` ab. Blocker-Hinweise und Fortschrittsbalken bleiben sichtbar.

## Plantafel Wochenansicht beruhigt

Die Wochen-Plantafel wurde optisch beruhigt: weniger Schatten, weniger Rahmenwirkung, kompaktere Karten, dezente Fortschrittsbalken und zurückhaltendere Blocker-Hinweise.

## Plantafel Typografie verfeinert

Die Typografie der Wochen-Plantafel wurde lesbarer gestaltet: Inter bleibt erhalten, extreme Schriftgewichte wurden reduziert, Zeilenhöhen leicht entspannt und Mini-Karten wirken ruhiger.

## Handlungsbedarf Typografie verfeinert

Die Typografie der Dashboard-Liste `Handlungsbedarf` wurde beruhigt: weniger extreme Schriftgewichte, etwas kompaktere Badges und bessere Lesbarkeit in den Tabellenzeilen.

## Auftragsdrawer Produktionspanel CSS-Fix

Das Produktionspanel im Auftragsdrawer wurde optisch korrigiert: Status-Karten werden als Karten dargestellt, Schnellaktionen erscheinen als Pill-Buttons und Abstände/Schriftgewichte sind ruhiger.

## Produktions-Schnellaktionen farblich differenziert

Die Schnellbuttons im Auftragsdrawer-Produktionspanel haben jetzt dezente fachliche Farben: Freigabe grün, Daten fehlen orange, Produktionsschritte blau, Abholbereit gelb und Fertig violett.

## Auftragsdrawer Blocker-/Produktionsprüfung

Der Auftragsdrawer zeigt im Produktionsbereich jetzt eine kompakte Produktionsprüfung. Offene Punkte wie fehlende Kundendaten, fehlendes Produkt, fehlende Fälligkeit, fehlende Freigabe, fehlende Maschine oder wartende Druckdaten werden direkt im Drawer sichtbar. Die Schnellaktionen markieren den aktuell passenden Zustand aktiv, ohne die bestehende Plantafel-Logik zu ändern.

## Plantafel konkrete Produktionsanzeige

Die Plantafel zeigt bei produktionsrelevanten Aufträgen jetzt den konkreten Übergabe-/Produktionsschritt statt nur den technischen Sammelstatus `In Produktion`. `In Weiterverarbeitung` erscheint als `Weiterverarbeitung`, `Abholbereit` bleibt sichtbar als `Abholbereit`, während die interne Statuslogik unverändert bleibt.

## Plantafel Freigabeanzeige

Die Plantafel zeigt in den Mini-Auftragskarten jetzt zusätzlich zur Maschine und zum konkreten Produktionsschritt auch den Freigabestand. Damit sind Produktionsphase und Produktionsfreigabe getrennt sichtbar: zum Beispiel `Weiterverarbeitung` plus `Freigabe ok` oder `Freigabe fehlt`.

## Dashboard Kennzahlenkarten Farben

Die sechs oberen Dashboard-Karten verwenden jetzt durchgehend dieselbe Accent-Variable. Angebote sind grün, Aufträge lila, Versand/Lieferscheine gelb, Rechnungen blau, Mahnungen magenta und Materialhinweise orange. Linker Farbstreifen, Label und dezenter Hintergrundverlauf greifen damit konsistent auf dieselbe Farbe zu.

## Auftragsdrawer Schnellaktionen beruhigt

Die Produktions-Schnellaktionen im Auftragsdrawer sind optisch weiter beruhigt. Inaktive Schritte bleiben neutral, die fachliche Farbe wird nur noch beim Hover und beim aktiven Schritt eingesetzt. Dadurch bleibt der aktuelle Workflow-Schritt klar erkennbar, ohne dass die gesamte Button-Reihe bunt und unruhig wirkt.

## Auftragsdrawer Schnellaktionen Beschriftung

Die Schnellaktionen im Auftragsdrawer verwenden jetzt wieder klare einzeilige Beschriftungen wie `Freigabe erteilt`, `Daten fehlen`, `In Druck`, `Weiterverarbeitung`, `Abholbereit` und `Fertig`. Dadurch entstehen keine zusammengeschobenen Texte mehr.

## Update 2026-05-30 – Auftragsdrawer Schnellaktionen eckiger
Die Schnellaktions-Buttons im Auftragsdrawer wurden optisch an die unteren Drawer-Buttons angeglichen: nicht mehr pillenförmig/komplett rund, sondern mit `var(--radius-md)`. Die Statuslogik bleibt unverändert.

## Update 2026-05-30 – Auftragsdrawer finaler Layout-Check
Der Produktionsbereich im Auftragsdrawer wurde final optisch nachgeschärft: Produktionskarten und Produktionsprüfung sind etwas kompakter, die Schnellaktionen haben eine eigene kleine Überschrift und die Warn-/Blockerchips verwenden nun ebenfalls moderat gerundete Radien statt Pill-Optik. Die fachliche Status-, Freigabe- und Plantafel-Logik bleibt unverändert.

## Update 2026-05-30 – Auftragsliste Status-/Freigabeanzeige
Die Auftragsliste verwendet nun dieselben fachlichen Kurzlabels wie Drawer und Plantafel. Freigabe, Übergabe und Status werden getrennt angezeigt: z. B. `Freigabe ok`, `Weiterverarbeitung` und `Offene Plantafel`. Der technische Sammelstatus `In Produktion` dominiert damit nicht mehr die Listenansicht, bleibt intern aber unverändert erhalten.

## Update: Auftragsliste Statuslabel In Produktion

- Das Statuslabel `Offene Plantafel` wurde zurückgenommen, weil es fachlich missverständlich war.
- `status = In Produktion` wird in Drawer und Auftragsliste wieder als `In Produktion` angezeigt.
- Der konkrete Produktionsschritt bleibt separat über `Übergabe` sichtbar, z. B. `In Druck`, `Weiterverarbeitung` oder `Abholbereit`.
- Die interne Logik bleibt unverändert: Aufträge bleiben bis `Fertig` in der offenen Plantafel sichtbar.


## Update: Auftragsliste Filter und Suche

- Die Auftragsliste hat jetzt eine funktionale Suche über Auftrag, Kunde, Produkt, Fälligkeit, Maschine, Priorität, Status, Freigabe und Übergabe.
- Zusätzlich gibt es kompakte Schnellfilter: `Alle`, `Wartet`, `In Produktion`, `Abholbereit`, `Daten fehlen`, `Freigabe fehlt` und `Fertig`.
- Die Filter arbeiten auf den fachlich getrennten Feldern Status, Freigabe und Übergabe, ohne die bestehende Plantafel- oder Drawer-Logik zu verändern.
- Eine Ergebniszeile zeigt, wie viele Aufträge aktuell sichtbar sind.

## Update: Auftragsliste Tabellen-Feinschliff

- Die Auftragsliste wurde optisch final beruhigt: feste Spaltenbreiten, klarere Tabellenkopffläche, gekürzte lange Kunden-/Produkttexte und konsistent zentrierte Status-Badges.
- Die Filterleiste ist auf kleineren Breiten stabiler und bricht sauber um.
- Bei leeren Treffern erscheint jetzt eine eigene ruhige Leeranzeige mit direktem `Filter zurücksetzen`.
- Status-, Freigabe-, Übergabe-, Plantafel- und Drawer-Logik bleiben unverändert.

## Update 2026-05-30 - Tabellen-Feinschliff auf weitere Module übertragen

Der finale Tabellenstandard aus der Auftragsliste wurde auf die übrigen Master-Listen übertragen: Kunden, Angebote, Lieferscheine, Rechnungen, Mahnungen, Material, Maschinen, Weiterverarbeitung, Leistungen und Vorlagen. Die Tabellen nutzen jetzt feste Spaltenbreiten, ruhigere Tabellenköpfe, einzeilige gekürzte Texte, konsistentere Status-Badges und ein stabileres Umbruchverhalten auf kleineren Breiten. Die fachliche Logik der Module wurde nicht geändert.
## Globaler UI-Konsistenzcheck

Der globale UI-Konsistenzcheck ist umgesetzt. Restliche alte Pill-Optiken in Badges, Dashboard-Hinweisen, Produktionslabels und Tabellenstatus wurden auf den moderaten Button-Radius umgestellt. Extreme Schriftgewichte in Plantafel, Handlungsbedarf und Produktionshinweisen wurden weiter reduziert. Fortschrittsbalken und echte Punkt-/Strichmarker bleiben bewusst rund, weil sie keine klickbaren Pills sind.

## Update 2026-05-30 – Kalkulation V1 Digitaldruck-Bogenrechner

Die Kalkulationsseite wurde vom reinen Formular zur ersten aktiven Rechenmaske erweitert. V1 fokussiert bewusst auf das Hauptgeschäft Digitaldruck: Auflage, Endformat, Rohbogenformat, Beschnitt, Nutzenabstand, Maschinenrand, Simplex/Duplex, Klickkosten, Papierkosten, Ausschuss und kalkulatorischer Verkaufspreis. Der Nutzenrechner vergleicht normale und gedrehte Ausrichtung und wählt automatisch die bessere Variante. Großformatdruck, Laufrichtung, grafische Bogenvorschau, Weiterverarbeitung und Maschinenzeiten bleiben Folgeausbaustufen.


## 2026-05-30 – Kalkulation Digitaldruck Formatauswahl erweitert

- Digitaldruck-Bogenrechner hat jetzt eine eigene Endformat-Vorlage.
- Enthalten: DIN A3, A4, A5, A6, A7 sowie DIN Lang, DIN Lang quer und DIN Lang Plus.
- Rohbogen-Vorlagen wurden ebenfalls um DIN A5, A6 und A7 ergänzt; SRA3, A3 und A4 bleiben enthalten.
- Manuelle Formatänderung stellt die jeweilige Vorlage automatisch auf „frei“, damit individuelle Sonderformate weiter möglich bleiben.
