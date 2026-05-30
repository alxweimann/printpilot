# UI STANDARDS

## Production Timeline Due Groups

Plantafel-Gruppen verwenden dezente Überschriften und responsive Kartenraster.

## Production Week Board Rows

Die Wochen-Plantafel verwendet Tageszeilen: links Tageskopf, rechts responsive Mini-Auftragskarten.

## Equal Compact Week Cards

Mini-Auftragskarten in der Produktions-Wochenansicht verwenden eine feste kompakte Höhe und gekürzte Textzeilen.

## Week Cards No Cutoff

Mini-Auftragskarten dürfen Inhalte nicht hart abschneiden. Einheitlichkeit wird über Mindesthöhe statt Maximalhöhe erreicht.

## Calm Production Week Board

Die Produktions-Wochenansicht nutzt dezente Tageszeilen, flache Mini-Karten und reduzierte visuelle Akzente.

## Production Week Board Typography

Mini-Karten verwenden Inter mit moderateren Schriftgewichten, klarer Hierarchie und entspannterer Zeilenhöhe.

## Attention List Typography

Dashboard-Handlungsbedarf-Listen verwenden moderate Schriftgewichte, kompakte Badges und klare, aber nicht überfette Zeilenhierarchie.

## Order Production Panel Visuals

Produktionsstatus-Karten im Drawer werden als ruhige Karten mit linksseitigem Akzent dargestellt. Schnellaktionen erscheinen als dezente Pill-Buttons.

## Production Quick Action Colors

Produktions-Schnellaktionen verwenden dezente semantische Farben: Erfolg grün, Warnung orange, Produktionsschritte blau, Versandbereitschaft gelb und Abschluss violett.

## Order Production Readiness

Produktionsbereiche im Drawer verwenden eine ruhige Readiness-Box zwischen Statuskarten und Schnellaktionen. Warnungen werden als kleine Pills dargestellt, erfolgreiche Zustände bleiben grün und dezent. Aktive Schnellaktionen erhalten eine leichte Innenkontur statt harter Farbflächen.

## Production Week Status Labels

Mini-Karten in der Plantafel zeigen fachliche Produktionslabels. Technische Sammelstatus wie `In Produktion` sollen nicht dominieren, wenn ein konkreter Übergabeschritt wie `In Druck`, `Weiterverarbeitung` oder `Abholbereit` vorhanden ist.

## Production Week Approval Labels

Mini-Karten in der Plantafel zeigen neben Maschine und Produktionsschritt auch den Freigabestand. Die Freigabe wird kompakt als Meta-Pill dargestellt und soll nicht den eigentlichen Produktionsschritt ersetzen.

## Dashboard Metric Card Colors

Dashboard-Kennzahlenkarten müssen eine einheitliche Accent-Variable verwenden. Farbstreifen, Label und Verlauf dürfen nicht aus unterschiedlichen CSS-Variablen kommen. Aktuelle Zuordnung: Angebote grün, Aufträge lila, Versand gelb, Rechnungen blau, Mahnungen magenta, Material orange.

## Calm Production Quick Actions

Schnellaktionen im Auftragsdrawer dürfen nicht als bunte Statusleiste wirken. Inaktive Workflow-Schritte bleiben neutral. Semantische Farben werden für Hover und aktive Zustände verwendet, damit der aktuelle Zustand klar ist, aber die Reihe ruhig bleibt.

## Quick Action Label Readability

Schnellaktionen im Auftragsdrawer müssen als lesbare einzeilige Labels erscheinen. Inaktive Buttons bleiben neutral, aktive Buttons nutzen semantische Farbe. Mehrteilige Labels dürfen nicht ohne Abstand zusammenlaufen.

## Auftragsdrawer – Schnellaktionsbuttons
Die Schnellaktionen im Produktionsbereich verwenden `border-radius: var(--radius-md)` statt voll gerundeter Pill-Optik. Dadurch passen sie optisch zu den unteren Aktionsbuttons und wirken ruhiger.

## Auftragsdrawer – Produktionsbereich final
Der Produktionsbereich im Auftragsdrawer folgt einer ruhigen Reihenfolge: vier kompakte Statuskarten, Produktionsprüfung, beschriftete Schnellaktionen, danach die Detailfelder. Schnellaktionen und Blockerchips verwenden moderate Radien (`var(--radius-md)`), keine Pill-Optik. Inaktive Schnellaktionen bleiben neutral; Farben werden nur für Hover und aktiven Zustand genutzt.

## Auftragsliste – fachliche Statusspalten
Die Auftragsliste zeigt Produktionszustände getrennt nach Freigabe, Übergabe und Status. Listen-Badges verwenden moderate Radien (`var(--radius-md)`) und ruhige semantische Farben. Konkrete Übergabeschritte wie `In Druck`, `Weiterverarbeitung` oder `Abholbereit` sollen sichtbar sein; technische Sammelwerte wie `In Produktion` dürfen nicht die einzige sichtbare Information bleiben.

## Update: Auftragsliste Statuslabel In Produktion

- Das Statuslabel `Offene Plantafel` wurde zurückgenommen, weil es fachlich missverständlich war.
- `status = In Produktion` wird in Drawer und Auftragsliste wieder als `In Produktion` angezeigt.
- Der konkrete Produktionsschritt bleibt separat über `Übergabe` sichtbar, z. B. `In Druck`, `Weiterverarbeitung` oder `Abholbereit`.
- Die interne Logik bleibt unverändert: Aufträge bleiben bis `Fertig` in der offenen Plantafel sichtbar.


## Auftragsliste – Filterbar

Schnellfilter in Listen werden als ruhige, moderat gerundete Buttons dargestellt. Der aktive Filter nutzt die jeweilige Modul-Akzentfarbe dezent; inaktive Filter bleiben neutral. Zähler werden als kleine rechteckige Counter mit `var(--radius-sm)` dargestellt.

## Auftragsliste – finaler Tabellenstil

Auftragstabellen verwenden feste Spaltenbreiten und `table-layout: fixed`, damit Status-, Freigabe- und Übergabe-Badges ruhig ausgerichtet bleiben. Lange Kunden- und Produkttexte werden einzeilig gekürzt. Leere Such-/Filtertreffer erhalten eine eigene ruhige Empty-State-Zeile mit Rücksetz-Aktion.
