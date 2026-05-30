# WORKFLOWS

## Plantafel Fälligkeitsgruppen

Die Plantafel gliedert Aufträge nach Fälligkeit, ohne Fortschritts- oder Blockerlogik zu verändern.

## Plantafel Tageszeilen

Die Plantafel zeigt Überfällig und Montag bis Freitag untereinander. Aufträge stehen rechts daneben als Mini-Karten.

## Plantafel kompakte Karten

Auftragskarten in der Wochenansicht nutzen eine feste kompakte Höhe, damit die Plantafel gleichmäßiger lesbar bleibt.

## Plantafel Mini-Karten ohne Cutoff

Mini-Karten nutzen eine feste Mindesthöhe, bleiben aber nach unten flexibel, damit keine Produktionshinweise abgeschnitten werden.

## Plantafel ruhige Wochenansicht

Die Wochenansicht bleibt als Tageszeilen aufgebaut, wirkt aber durch reduzierte Schatten, Rahmen und kleinere Karten ruhiger.

## Plantafel Typografie

Die Wochen-Plantafel nutzt reduzierte Schriftgewichte und bessere Zeilenhöhen, damit Mini-Karten trotz kompakter Darstellung lesbar bleiben.

## Dashboard Handlungsbedarf Typografie

Die Handlungsbedarf-Liste nutzt reduzierte Schriftgewichte und ruhigere Badges, damit sie besser zur Plantafel passt.

## Produktionspanel im Auftragsdrawer

Status-Karten und Schnellaktionen im Produktionsbereich sind optisch korrigiert und bleiben als reine Pflegehilfe für Plantafel-relevante Daten gedacht.

## Farbige Produktions-Schnellaktionen

Die Schnellaktionen im Auftragsdrawer sind farblich nach ihrer fachlichen Bedeutung differenziert, bleiben aber bewusst dezent.

## Auftragsdrawer Blockerlogik

Im Produktionsbereich des Auftragsdrawers gibt es eine direkte Prüfung der Produktionsbereitschaft. Status, Freigabe und Übergabe bleiben die führenden Felder; die Prüfung erklärt, warum ein Auftrag blockiert ist oder warum er fachlich plausibel für die aktuelle Produktionsphase ist.

## Plantafel Statusanzeige

Die Plantafel trennt interne Steuerlogik und sichtbare Anzeige. Für Filterung und Zählung bleibt `status = In Produktion` erhalten, die Mini-Karten zeigen aber den fachlich konkreten Schritt aus `handoff`, zum Beispiel `Weiterverarbeitung` oder `Abholbereit`.

## Plantafel Freigabe und Produktionsschritt

In der Plantafel werden Maschinenzuordnung, konkreter Produktionsschritt und Freigabezustand gemeinsam als kompakte Meta-Pills gezeigt. Die interne Statuslogik bleibt davon getrennt.

## Dashboard Kennzahlenfarben

Die Dashboard-Kennzahlenkarten sind farblich semantisch getrennt. Die Farblogik dient als schneller visueller Einstieg in Angebote, Aufträge, Versand, Rechnungen, Mahnungen und Materialhinweise.

## Ruhige Produktions-Schnellaktionen

Die Schnellaktionen bleiben fachlich dieselben Pflegehilfen für Freigabe, Datenlage und Übergabe. Inaktive Schritte werden neutral dargestellt; nur der aktuell passende Schritt erhält die semantische Farbe.

## Auftragsdrawer Schnellaktionen

Die Produktions-Schnellaktionen bleiben als kurze Workflow-Pills sichtbar. Die Beschriftungen sind eindeutig und einzeilig, damit sie im Drawer nicht wie zusammengeklebte Begriffe wirken.

## UI-Regel – Schnellaktionen im Auftragsdrawer
Schnellaktionen im Produktionsbereich werden als kompakte Buttons dargestellt. Sie verwenden denselben moderaten Radius wie die unteren Drawer-Aktionen, damit sie nicht wie bunte Status-Pills wirken.

## Update 2026-05-30 – Auftragsdrawer Layout-Feinschliff
Im Auftragsdrawer wurde der Produktionsbereich optisch finalisiert. Die Schnellaktionen sind jetzt klar als eigener Abschnitt beschriftet. Die Workflow-Logik selbst wurde nicht geändert: `Abholbereit` bleibt offen sichtbar, `Fertig` schließt den Auftrag für die offene Plantafel ab.

## Aufträge – Listenlogik für Produktion
Die Auftragsliste ist an die Drawer-/Plantafel-Logik angeglichen. Ein Auftrag kann intern weiterhin `status = In Produktion` haben, während die Liste zusätzlich den konkreten Übergabeschritt aus `handoff` zeigt. Freigabe, Übergabe und Status sind getrennte Spalten und müssen fachlich getrennt bleiben.

## Update: Auftragsliste Statuslabel In Produktion

- Das Statuslabel `Offene Plantafel` wurde zurückgenommen, weil es fachlich missverständlich war.
- `status = In Produktion` wird in Drawer und Auftragsliste wieder als `In Produktion` angezeigt.
- Der konkrete Produktionsschritt bleibt separat über `Übergabe` sichtbar, z. B. `In Druck`, `Weiterverarbeitung` oder `Abholbereit`.
- Die interne Logik bleibt unverändert: Aufträge bleiben bis `Fertig` in der offenen Plantafel sichtbar.


## Update: Auftragsliste Filter und Suche

Die Auftragsliste ist nun praktisch nach Produktionszuständen filterbar. Die Suche berücksichtigt Rohwerte und fachliche Kurzlabels, damit Begriffe wie `Weiterverarbeitung`, `Abholbereit`, `Daten fehlen` oder `Freigabe fehlt` direkt gefunden werden. Schnellfilter verändern keine Daten, sondern reduzieren nur die Listenansicht.
