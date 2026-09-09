# CONCRETE Relaunch

Die neue Website von CONCRETE Brandbuilding im Magazin-Look. Entstanden in
Claude Design, fortgeführt in Claude Code. Statisches HTML/CSS/JS, kein Build.

- `index.html` – Startseite, alle weiteren Seiten liegen daneben (Dateiname = Slug)
- `site.css` / `site.js` – geteilte Design- und Verhaltensschicht
- `assets/` – Bilder (webverkleinert), `fonts/` – lizenzierte WOFF2, `vendor/` – GSAP
- `docs/` – Konzeption, Übergaben und Entscheidungshistorie
- `_entwuerfe/` – unverlinkte Arbeitsstände aus der Designphase
- `assets/clients/` – Logos für das Logoband der Startseite (SVG bevorzugt, PNG mit 240 px Höhe)

## Logoband

Das Band auf der Startseite läuft in vier gegenläufigen Zeilen, jede Zeile
viermal kopiert, damit es bei jeder Breite ohne Lücke endlos läuft. Die
Logogrößen werden über `--lw` so gesetzt, dass alle Marken optisch gleich
schwer wirken (gleiche Fläche, Höhe 22 bis 44 px). Einfarbige Logos werden
per `brightness(0)` auf Ink gebracht; gefüllte Marken (Kästen, Badges) sind
in der SVG selbst auf Ink/Papier umgefärbt und in `site.css` vom Filter
ausgenommen. Neue Logos: Datei nach `assets/clients/`, Zeile im Band
ergänzen, `--lw` nach derselben Formel setzen. EPS-Originale lassen sich per
Illustrator-Skript zu SVG exportieren (siehe `docs/CHANGELOG.md`, 07.09.2026).

## Header

Der Header ist im Hero transparent, beim Hochscrollen erscheint er als
transluzenter Papier-Träger mit Blur. Das Mega-Menü nutzt dieselbe Fläche.
Bei offenem Menü trägt ein `::before` den Blur des Headers, damit auch das
Menü selbst die Seite dahinter weichzeichnen kann.

Videos kommen vom CDN `concrete-video-cdn.vercel.app` (siehe `docs/VIDEO-VERANKERUNG.md`).
Originalbilder und der alte WordPress-Export liegen im Repository
`wolfram-concrete/concrete-website`; hier gibt es bewusst keine Kopie davon.

## Case-Seiten

Alle 40 Projekte haben eine `case-<slug>.html` nach dem Nextbed-Muster
(Hero, Meta, Herausforderung, Ausgangslage/Strategie, Vorher/Nachher-Kasten,
Galerie, optional Zitat und Stimme, weitere Cases). Bilder liegen unter
`assets/cases/<slug>/`, JPG bis 2400 px. Regeln: keine weißen
Bildhintergründe (Freisteller auf Markenfarben), Karussell nur mit
Shootingfotos, Zitat nur bei echtem Kundenzitat, keine Gedankenstriche im
Fließtext. Freisteller aus PNG/WebP mit Alphakanal nur mit ffmpeg
`premultiply` abflachen und mit 7 % Rand setzen, sonst werden weiche
Schatten zu grauen Flächen. Details und Datum je Änderung in
`docs/CHANGELOG.md`.

## Phasen und Leistungen

`leistungen.html` zeigt je Phase ein Case-Bild mit Shortlink und einen
kleinen Video-Teaser (`data-vteaser`). Die vier `phase-*.html` verlinken
jeden Leistungspunkt auf seine Detailseite (Dateiname = Slug, Muster
`social-listening.html`) und tragen Christians Video als
Teaser direkt unter der Liste. Bei jeder Änderung an `site.css` oder
`site.js` den Cache-Buster `?v=N` in allen HTML-Dateien erhöhen.

## Website-Videos der Kundenmarken

Die Screencasts der Kundenwebsites nehmen wir selbst im Browser auf: Seite
laden, Cookie-Dialog wegklicken, dann per echten Mausrad-Ereignissen in
kleinen Schritten mit Zwischenstopps scrollen (`page.mouse.wheel`, nicht
`window.scrollTo`, weil manche Seiten nur auf Wheel-Events reagieren).
Aufnahme mit Playwright (`recordVideo`), danach mit ffmpeg beschleunigen und
auf 1280 px, `crf 30`, ohne Ton, plus Poster-JPG. Ein Clip bleibt unter
2,5 MB und dauert 10 bis 22 Sekunden. Videodateien hängen nicht am
Cache-Buster: Eine neue Fassung braucht einen neuen Dateinamen, sonst liefert
der Browser die alte aus.

## Galerie-Bausteine

`data-feature` an einem Galeriebild stellt es in eine eigene Zeile auf zwei
Drittel der Rasterbreite. `data-full` am `figure.case-gallery__lead` zeigt das
Lead-Bild ohne Beschnitt, der Container wächst mit.

## Lokal ansehen

    python3 -m http.server 4173

Dann `http://localhost:4173/`.

## Status

Vorlaunch: `vercel.json` setzt `noindex` auf alle Seiten. Vor dem Livegang
entfernen. Offene Punkte: `docs/UEBERGABE-CLAUDE-CODE.md`.
