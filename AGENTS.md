# Verbindliche Arbeitsregeln – CONCRETE Website

## Leistungsdetailseiten: Sektion 01

Projektteaser auf Leistungsdetailseiten verwenden immer das Heromotiv der
jeweiligen Case-Seite und dessen Seitenverhältnis. Ausnahme: Website-Referenzen
auf Website Design und Website-Konzept behalten die Website-Screencasts.

Projekt-Referenzlisten aller Leistungsdetailseiten verwenden Reveal und
das bestehende Parallax-System: `data-plx` am Teasercontainer, sodass Motiv,
Titel und Copy gemeinsam scrollen. `service-references.css` einbinden.
Mobil, auf Touch-Geräten und bei reduzierter Bewegung Parallax deaktivieren.
Hoverzoom der großen Projektliste übernehmen (scale 1.05, 0.7s Übergang).
Für Teaseraktionen den Markenpfeil aus `assets/arrow.svg` verwenden, keine ↗.

`website-design.html` ist die Formatierungsvorlage für die Copy unter 01.
Einleitung und Abschluss bleiben Fließtext. Inhaltliche Aufzählungen als
`ul.faql.design-aspects` mit korallfarbenen Pfeilen, Trennlinien und fett
gesetzten Leitbegriffen darstellen; keine losen Bullet-Absätze oder Quadrate.
Erklärende Langtexte behalten ihre Absatzstruktur mit gezielten Hervorhebungen.
Satzbreite, Textfarbe und Abstände der Vorlage übernehmen.

## Neue Projektseiten: bestehende Formatierung 1:1 übernehmen

Vor jeder Erstellung oder Duplizierung einer Case-Seite vollständig
`docs/CASE-FORMATIERUNGSREGELN.md` lesen. `case-nextbed.html` ist die verbindliche
Struktur- und Formatierungsreferenz; `case-noey.html` dient als zweite Kontrolle.
Keine eigenständige Interpretation der Module, Typografie oder Raster.
Nur Inhalte, Medien, Projektfarben und projektspezifische Metadaten austauschen.
Abweichungen erst nach ausdrücklicher Freigabe des Nutzers umsetzen.

Vor Übergabe Referenzvergleich auf Desktop und Mobile durchführen sowie
`python3 tools/technical-preflight.py`, `python3 tools/seo-gauntlet.py` und
`git diff --check` ausführen. README und Changelog bei akzeptierten Änderungen
aktualisieren. Bestehende, nicht zum Auftrag gehörende Änderungen erhalten.
