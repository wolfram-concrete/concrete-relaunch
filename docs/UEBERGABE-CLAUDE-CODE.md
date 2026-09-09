# Handoff: CONCRETE Website-Relaunch (Magazin-Look)

Übergabe an Claude Code. Stand: 2026-09-03. Quelle dieser Übergabe ist der
Design-Prototyp in diesem Ordner (`website/`), entwickelt in Claude Design.

## Überblick
Kompletter Website-Relaunch für CONCRETE Brandbuilding (concrete-designs.de)
auf Basis der Optik des CONCRETE Magazins N°01. Struktur, Wording und
Seitenlogik stammen aus der Konzeption im Repo
`wolfram-concrete/concrete-website`, Branch `relaunch-v2`, Ordner `konzept/`
(`UEBERGABE-CLAUDE-DESIGN.md`). Der alte WordPress-Export liegt auf `main`.

## Über die Design-Dateien
Alle Dateien hier sind **Design-Referenzen in reinem HTML/CSS/JS** — Prototypen,
die Look und Verhalten zeigen. Sie sind NICHT als Produktionscode gedacht.
Aufgabe in Claude Code: die Designs in der Zielumgebung des Repos nachbauen
(bzw. das passendste Setup wählen — der Prototyp ist bewusst framework-frei;
statisches HTML/Astro/Next sind alle geeignet). Die Dateien funktionieren
lokal im Browser und taugen als 1:1-Referenz.

## Fidelity
**High-fidelity.** Farben, Typografie, Abstände, Zustände und Motion sind
final gemeint und sollen pixelgenau übernommen werden.

## Dateien
- `Home.html` — Startseite (Referenz für alles)
- `site.css` / `site.js` — geteilte Design- und Verhaltensschicht ALLER
  Unterseiten (Cache-Busting-Query `?v=3` in den Links)
- `projekte.html` — Case-Übersicht mit Filter + Masonry
- `case-nextbed.html` (freigegebenes Muster), `case-noey.html`,
  `case-wackelzahn.html`, `case-medium.html` — Case-Seiten
- 5× `situation-*.html` — „Wo wir helfen können"
- `leistungen.html` + ~21 Leistungs-Detailseiten (Dateiname = Slug)
- `branchen.html`, `wissen.html` + ~30 FAQ-Seiten (Frage-Slugs)
- `phase-verstehen/definieren/umsetzen/begleiten.html`, `ueber-uns.html`
- `erstgespraech.html` (Ziel des Nav-CTA), `kontakt.html`,
  `impressum.html`, `datenschutz.html`
- `assets/` — Logos (SVG), Beton-Texturen (`assets/beton/`), Case-Bilder
  (`assets/cases/<case>/`), Review-Porträts (`assets/reviews/`),
  Team-Avatare (`assets/team/`), Pfeil `assets/arrow.svg`
- `fonts/` — Arame (Thin/Regular/Bold), Roc Grotesk (Regular/Bold);
  Hausschriften, liegen vor. Arame besitzt KEINE Kleinbuchstaben —
  Text trotzdem gemischt schreiben, kein `text-transform` nötig.
- `../magazine/img/` — einige Bilder werden von dort referenziert
  (`.q.jpg` = webverkleinerte Varianten); beim Umzug mitnehmen.

## Design-Tokens (`site.css :root`)
- Grund/Papier `#f3efe7` · Bildfläche `#ece6da` · Ink `#171513`
  (warmes Fast-Schwarz, nie #000) · Ink-60 `rgba(23,21,19,.6)`
- Coral `#fe7e5e` (Interaktion + genau EINE gefüllte CTA-Fläche pro Seite)
  · Coral hell `#febdac` (Akzent auf Ink)
- Haarlinie `rgba(23,21,19,.18)` (auf Ink: `rgba(243,239,231,.24)`);
  starke Regel: 1px Ink, kurz (64–128px); keine Rahmen, keine Schatten,
  keine Radien außer CTA
- Schriftgrößen (max. 4 pro Seite): meta 13 / body 15–16 / sub 24–32 /
  display bis 190px (Sprung Body→Display = 12,2). Zusätzlich
  Statement-Übergröße `clamp(72px,17vw,300px)` max. 1× pro Seite
- Display: Arame Bold, line-height .86, letter-spacing −.02em ·
  Fließtext: Roc Grotesk 400, lh 1.6 · Eyebrows: Roc 700 versal,
  letter-spacing .28em, Coral
- Raster: Container max 1440px, Pad `clamp(20px,3.2vw,48px)`,
  Einzug-Achse 16,667%; Raum in 8er-Schritten (8…96)
- CTA: Höhe 48px, Radius `0.236 × kurze Achse` (Logo-O), Hover =
  Coral-Fill-Sweep von unten (.38s cubic-bezier(.2,.7,.2,1)),
  Typo invertiert auf Weiß; auf Coral-Flächen invertiert (Ink-Sweep)
- Betontexturen (`assets/beton/`): Solid Rot als Zäsurfläche; Ink-/
  Coral-Alpha als Überlagerung — über Fotos nur Coral-Alpha, partiell
  (30–40%, als Band von einer Kante), nie hinter Fließtext, max. 1×
  pro Viewport. Versetzte Ink-/Coral-Blöcke (`.ink-block`/`.coral-block`)
  überlappen die Nachbarsektionen (Collage-Prinzip statt Balken)

## Header / Navigation (site.js)
- Logo = Wortmarke ohne Claim (`concrete-paper.svg`), verlinkt auf Home;
  kein „Home"-Navipunkt
- Header nicht sticky: erscheint nur beim Hochscrollen auf Blur-Träger
  (`rgba(23,21,19,.35)` + `backdrop-filter:blur(14px)`); ganz oben
  transparent; auf hellen Seitenstarts invertiert (Klasse `inv`)
- Nav-Links: weiß im Differenz-Blendmodus; Hover = Faux-Bold über
  text-shadow (kein Layout-Shift); aktive Seite fett; Chevron 1.25px,
  im Hover 2px
- Mega-Menüs (Projekte + Wo wir helfen können): öffnen per Klick auf
  Chevron (kein Hover), `position:absolute; top:100%` AM HEADER
  (WICHTIG: `position:fixed` bricht unter backdrop-filter/transform);
  bei offenem Menü bekommt der Header `mega-open` → Papier-Grund läuft
  hinter die Navi, alles wechselt auf Ink
- CTA „Projekt anfragen" mit zwei überlappenden Avatar-Porträts
  (26px, `assets/team/`), Ziel: `erstgespraech.html` (nie direkt Calendly —
  Calendly nur auf der Erstgespräch-Seite selbst)

## Motion
- Home-Preloader: „CONCRETE" versal in Arame → 13 Case-Frames im
  170ms-Takt, je Frame eine andere exotische Google-Font-Stimme
  (f0–f12 in site.css, Fonts im `<head>` von Home.html), Wort im
  Differenz-Modus → beruhigt auf stummem Hero-Video. Erst starten,
  wenn Bilder dekodiert + Fonts geladen (Promise.race mit 2,5s-Timeout);
  `prefers-reduced-motion`: direkt Endzustand
- Scroll-Reveals: Klassen `rv` (Text, translateY+fade), `rv-media`
  (Bilder), `rv-d1..d3` (Stagger); IntersectionObserver in site.js
- Parallax: `data-plx="±n"` (Hero-Bilder, Textur-Laps, Quote-Porträts)
- Statement-Headlines: Zeilen-Reveal linksbündig im Flattersatz
- Marquees: Footer-Wortmarke (Coral, groß) + „Weitere Projekte"-Slider,
  60s Loop, Hover pausiert, reduced-motion stoppt

## Video-Regeln (global, site.js erzwingt sie)
- Es läuft immer nur EIN Video; alle Videos stumm bis zum Aufklicken
  (Klick öffnet größeren Player mit Ton + Controls)
- Teaser (`.vteaser`): Standbild/Autoloop + Coral-Pill „Video ansehen";
  kein YouTube-Embed, eigener Player im Systemlook
- Quellen: `https://concrete-video-cdn.vercel.app/v/<slug>.mp4` +
  `/poster/<slug>.webp` · Slugs Home: hero, prozess, verantwortung,
  erstgespraech (projekt-fit existiert, Sektion wurde entfernt) ·
  Unterseiten: verstehen, definieren, umsetzen-messbar, begleiten,
  b2b, definition, ki-haltung, warum-concrete
- Hero-Video: autoplay muted loop playsinline, ohne Bedienelemente

## Wiederkehrende Muster
- Sektionseinstieg: Eyebrow (Coral, .28em) + Arame-Headline + Haarlinie;
  Inhalte oft um die 16,667%-Achse versetzt (magaziniger Versatz)
- Große Coral-Ziffern (01…) als Ordnungsmittel (Proof-Cases, Phasen,
  Szenarien, Kompetenzen)
- „Aus der Praxis"-Module auf der Home: über die Seite gestreute
  Case-Auszüge mit Brand-Logo oben rechts auf der Linie, 4-Bild-Galerie
  mit Auto-Fade (nur Visuals/Kampagnenmotive, keine Geschäftsausstattungs-
  Mockups), CTAs „Zum Projekt" + „Zu allen Projekten"
- Rezensionen („Das sagen unsere Kunden"): Slider mit Swipe, läuft rechts
  in den Bildschirmrand aus, Karten mit Porträt (Fokus auf Gesichter via
  object-position), vollständige Quote hinter „Weiterlesen", korrekte
  Firmierung + Titel der Absender
- Case-Seiten (Muster = Nextbed): Parallax-Hero → H1 → „Was wir gemacht
  haben" (Leistungs-Keywords als Crosslinks auf die SEO-Detailseiten,
  Brand-Logo rechts) → kurze Sektionen mit Akkordeons (verdichtete
  WP-Texte) → EINE holistische Masonry (alle Bilder unbeschnitten,
  columns-Layout) → Kundenzitat auf Coral m. Beton-Multiply → Relevanz
  („Warum dieses Projekt…") → „Weitere Projekte"-Marquee → Anfrage-Block
- Projekte-Übersicht: Filter-Chips (Branchen-Cluster) + Suche, Masonry
  zeilenweise sortiert (neueste zuerst, JS-Round-Robin auf Flex-Spalten),
  Freisteller-Teaser als transparente PNGs direkt auf Papier
- Footer: großer Coral-Wortmarken-Marquee → 4-Spalten-Index (Leistungen /
  Branchen / Wissen / Agentur; mobil Akkordeon) → Legal-Zeile. Footer-Grund
  zieht 50% hinter die Anfrage-Sektion hoch

## Offene Punkte
- Alle 40 Case-Seiten und alle Leistungs-Detailseiten stehen (Stand
  09.09.2026); Nextbed-Hero bleibt bewusst bei 1920 px
- Kostenvideo („Was kostet ein Branding?") existiert nicht im CDN-Satz —
  Investitions-Stelle ist textfähig gebaut
- Situationsseite 05 (Vertrauen/sensible Märkte) hat bewusst keine
  Beschreibungszeile im Home-Listing
- QR-/SEO-Metadaten (`robots:noindex` entfernen), echte Formular-Anbindung
  Erstgespräch/Fit-Check, Calendly-Integration

## Quelle / Sync
`github.md` im Projektroot hält Repo-Zuordnung und Sync-Historie
(`wolfram-concrete/concrete-website@relaunch-v2`, Konzeption unter
`konzept/`, Bild-Originale im WP-Export auf `main` unter `wp-content/uploads/`).
