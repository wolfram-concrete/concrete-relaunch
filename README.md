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

Ein Motiv wird groesser, indem es an eine Position mit breitem Slot rueckt
und eng auf den Inhalt beschnitten wird (breiteres `--ar`), nicht ueber eine
Sonderregel: Der Justify-Packer verteilt sonst die restliche Zeile schlecht.
`data-full` am `figure.case-gallery__lead` zeigt das Lead-Bild ohne Beschnitt,
der Container waechst mit.

## Mobile Regeln

Unter 900 px gelten eigene Regeln, der Desktop bleibt davon unberührt:
Praxis-Module stapeln (Headline, Bild, Copy, Links) und laufen ohne Parallax
in der Galerie, das Coral-Statement fuellt den Schirm und wird nicht
ueberlappt, Situationsfelder tragen einen sichtbaren Pfeil-Link, weil es
keinen Hover gibt. Das mobile Menue hat Burger und X, eine Kopfleiste auf
Papier und den Coral-CTA. Auf- und Zuklappen animiert die Hoehe per JS
(`site.js`, `[data-mnav-toggle]`), das Mega-Menue blendet weich ein.

Projektseiten haben mobil einen Hero ueber den ganzen Schirm (`100svh`,
`object-fit: cover`); der Inhalt beginnt darunter. Der Bildausschnitt wird je
Case ueber `style="--hero-pos:78% 50%"` auf der `.case-hero` gesteuert. Wo ein
Querformat-Keyvisual im Hochformat nicht funktioniert, liegt im Hero ein
`<picture>` mit `<source media="(max-width:820px)">` und einem eigenen
Mobilmotiv. Die Galerie zeigt mobil hoechstens zwei Bilder pro Zeile
(`site.js`, `maxPer`).

Headlines duerfen nie aus dem Schirm laufen: `h1,h2` haben global
`overflow-wrap:break-word`, lange Komposita bekommen weiche Trennstellen
(`&shy;`) an der sinnvollen Fuge, damit der Umbruch nicht mitten im Wort
passiert.

## Branchenseiten

Zehn Detailseiten (`b2b-brands.html`, `recruiting-brands.html`,
`startups.html`, `architektur-und-immobilien-brands.html`,
`consulting-it-und-finance-brands.html`, `food-und-beverage-brands.html`,
`event-und-entertainment-brands.html`, `family-und-kids-brands.html`,
`marketing-und-media-brands.html`, `b2b-marken-mallorca.html`) nach dem
Muster der WordPress-Fassung. `branchen.html` verlinkt jede Branche, der
Footer zeigt direkt auf die Detailseiten.

## Grounding Page

`fakten-zu-concrete-brandbuilding-gmbh.html` ist die faktische Referenz fuer
KI-Systeme (Grounding Page Standard v1.4) mit Organization- und
WebPage-Schema. Sie ist bewusst nicht in der Hauptnavigation verlinkt.
Vor dem Livegang muss sie zusammen mit dem Rest der Seite von `noindex` auf
`index,follow` umgestellt werden, sonst hat sie keine Wirkung.

## Freisteller

Umgefaerbte Mockups nur aus echten Alphaquellen mit `premultiply` rechnen.
Flood-Fill aus dem Bildrand hinterlaesst ausgefranste Schattenkanten; alle so
erzeugten Bilder wurden auf ihre Originale zurueckgesetzt. Im Zweifel bleibt
das Original mit weissem Grund.

## SEO und GEO

`tools/seo-gauntlet.py` prueft die Grundlagen und endet mit Exit 1, sobald
etwas fehlt: meta description (eindeutig, 60 bis 170 Zeichen), `rel=canonical`
passend zu `cleanUrls` ohne `.html`, Title-Laenge (70 Zeichen, 110 bei Frage-
und Situationsseiten), `sitemap.xml`, `robots.txt`, die Weiterleitungen in
`vercel.json` und die Footer-Ankertexte der Branchenseiten.

    python3 tools/seo-gauntlet.py

Die Branchenseiten tragen die Suchbegriffe der alten Seite: Title und
Ankertext lauten „Strategie und Branding fuer …". Jede Branchenseite hat
ausserdem einen zitierbaren Definitionssatz (`.geo-def`) fuer Antwort-
maschinen. Die alten WordPress-Adressen liegen als Weiterleitung in
`vercel.json`; die Zuordnung steht in `tools/redirects.json`.

## Lokal ansehen

    python3 -m http.server 4173

Dann `http://localhost:4173/`.

## Status

Vorlaunch: `vercel.json` setzt `noindex` auf alle Seiten. Vor dem Livegang
entfernen. Offene Punkte: `docs/UEBERGABE-CLAUDE-CODE.md`.
