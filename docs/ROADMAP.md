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
