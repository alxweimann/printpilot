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

## Produktions-Schnellaktionen und Plantafel-Logik

Die Schnellaktionen im Auftragsdrawer wirken fachlich auf Status, Übergabe und Plantafel:

- **Freigabe erteilt** setzt `approval = Freigabe erteilt`; der Blocker „Freigabe fehlt“ verschwindet.
- **Daten fehlen** setzt `approval = Daten unvollständig`, `handoff = Wartet auf Daten` und `status = Wartet`.
- **In Druck** setzt `handoff = In Druck` und `status = In Produktion`.
- **Weiterverarbeitung** setzt `handoff = In Weiterverarbeitung` und `status = In Produktion`.
- **Abholbereit** setzt `handoff = Abholbereit` und bleibt mit `status = In Produktion` offen sichtbar.
- **Fertig** setzt `handoff = Abgeschlossen` und `status = Fertig`; der Auftrag verschwindet aus der offenen Plantafel.
