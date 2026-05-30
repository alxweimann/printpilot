# ROADMAP

- Erledigt: Plantafel mit Fälligkeitsgruppen ergänzt
- Erledigt: Plantafel-Wochenansicht auf Tageszeilen mit Karten daneben umgestellt
- Erledigt: Mini-Karten der Plantafel einheitlich und kompakter gestaltet
- Erledigt: Abschneiden der Plantafel-Mini-Karten entfernt
- Erledigt: Wochen-Plantafel optisch beruhigt und kompakter gestaltet
- Erledigt: Typografie der Wochen-Plantafel lesbarer und ruhiger gestaltet
- Erledigt: Typografie im Dashboard-Handlungsbedarf beruhigt
- Erledigt: CSS-Fix für Produktionspanel im Auftragsdrawer
- Erledigt: Produktions-Schnellaktionen im Auftragsdrawer farblich differenziert

- Erledigt: Auftragsdrawer um Blocker-/Produktionsprüfung ergänzt
- Erledigt: Plantafel zeigt konkrete Produktionsschritte statt nur `In Produktion`
- Erledigt: Plantafel zeigt Freigabestand zusätzlich zum Produktionsschritt
- Erledigt: Farben der sechs Dashboard-Kennzahlenkarten vereinheitlicht
- Erledigt: Schnellaktionen im Auftragsdrawer optisch beruhigt
- Erledigt: Lesbarkeit der Schnellaktions-Beschriftungen im Auftragsdrawer korrigiert

- Erledigt: Schnellaktionsbuttons im Auftragsdrawer optisch an die unteren Drawer-Buttons angeglichen.

## Erledigt – Auftragsdrawer Layout-Feinschliff
Der finale Layout-Check des Auftragsdrawers ist umgesetzt. Nächster sinnvoller Block: fachliche Weiterarbeit an Belegerstellung, Vorschau oder Übergang Angebot → Auftrag.

## Erledigt – Auftragsliste Statusqualität
Die Auftragsliste wurde an die aktuelle Produktionslogik angeglichen: Freigabe, Übergabe und Status werden als separate fachliche Kurzlabels angezeigt. Nächster möglicher Schritt: Filter/Suche in der Auftragsliste funktional ausbauen und nach diesen Statusinformationen filterbar machen.

## Update: Auftragsliste Statuslabel In Produktion

- Das Statuslabel `Offene Plantafel` wurde zurückgenommen, weil es fachlich missverständlich war.
- `status = In Produktion` wird in Drawer und Auftragsliste wieder als `In Produktion` angezeigt.
- Der konkrete Produktionsschritt bleibt separat über `Übergabe` sichtbar, z. B. `In Druck`, `Weiterverarbeitung` oder `Abholbereit`.
- Die interne Logik bleibt unverändert: Aufträge bleiben bis `Fertig` in der offenen Plantafel sichtbar.


## Erledigt – Auftragsliste Filter und Suche

Die Auftragsliste hat jetzt eine funktionale Suche und Schnellfilter für Status-/Produktionsfälle wie `Wartet`, `In Produktion`, `Abholbereit`, `Daten fehlen`, `Freigabe fehlt` und `Fertig`. Nächster sinnvoller Block: Belegerstellung/Vorschau fachlich prüfen oder Angebot → Auftrag sauberer ausbauen.

## Update: Aufträge Tabellenabschluss

Der Auftragsbereich ist nach Listenfilterung und Tabellen-Feinschliff visuell abgeschlossen. Nächster sinnvoller Bereich: entweder letzter Review des Auftragsmoduls im Gesamtkontext oder Start des nächsten Moduls wie Angebote/Kunden/Material.

## Erledigt - Einheitlicher Tabellen-Feinschliff

- Auftragslisten-Standard auf weitere Master-Listen übertragen.
- Tabellenlayout für Kunden, Angebote, Lieferscheine, Rechnungen, Mahnungen, Material, Maschinen, Weiterverarbeitung, Leistungen und Vorlagen vereinheitlicht.
- Nächster sinnvoller Schritt: nach finaler Sichtprüfung mit dem nächsten Modulbereich weitermachen oder gezielt Such-/Filterfunktionen für weitere Listen ausbauen.
## Erledigt – Globaler UI-Konsistenzcheck

- Alte Pill-Optiken in Badges, Dashboard-Hinweisen und Produktionslabels reduziert.
- Badge- und Status-Radien an den Button-Stil angepasst.
- Überfette Schriftgewichte in mehreren UI-Bereichen weiter beruhigt.
- Fortschrittsbalken und echte Indikatoren bleiben bewusst rund.
- Keine Daten-, Status- oder Workflowlogik geändert.

## Erledigt – Kalkulation V1 Digitaldruck-Bogen

- Erste aktive Kalkulationsseite für Digitaldruck-Bogenware umgesetzt.
- Nutzenrechner vergleicht normale und gedrehte Ausrichtung.
- Netto-/Brutto-Druckbogen, Ausschuss, Rüstbogen, Klickkosten, Papierkosten und kalkulatorischer Verkaufspreis werden berechnet.
- Nächste sinnvolle Schritte: grafische Bogenvorschau, Papierlaufrichtung, Maschinenparameter, Weiterverarbeitung und danach Großformatdruck-Rechner.


## Nächste Kalkulationsausbaustufen

- Digitaldruck V1.1: Formatauswahl ist erweitert.
- Danach: grafische Bogenvorschau, Papierlaufrichtung, Maschinenzeiten, Sonderfarben und Weiterverarbeitung.
- Großformatdruck bleibt als separater Rechner nach Stabilisierung des Digitaldruck-Kerns vorgesehen.

## Erledigt – Kalkulation Format-Stammdaten

- Einstellungen um Tabs `Formate` und `Rohbogenformate` erweitert.
- Endformate und Rohbogenformate als zentrale Stammdaten vorbereitet.
- Digitaldruck-Rechner liest Format- und Rohbogen-Auswahl jetzt aus den Einstellungen.
- Nächster sinnvoller Schritt: Nutzenrechner V2 mit grafischer Bogenvorschau, Laufrichtung und maschinenbezogenen Rohbogen-/Materialparametern.

## Erledigt – Einstellungen Listenansicht und Drawer für Formate

- Endformate und Rohbogenformate wurden von Inline-Karten auf Listenansicht plus Detaildrawer umgestellt.
- Bedienung ist damit konsistent zu Kunden, Aufträgen, Material und weiteren Modulen.
- Nächste sinnvolle Kalkulationsausbaustufe: Nutzenrechner V2 mit grafischer Bogenvorschau und Laufrichtung.
