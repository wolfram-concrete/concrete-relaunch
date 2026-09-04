<!-- Unveraenderte Kopie von /Users/wolfram/web-projekte/CONCRETE MAGAZIN/CLAUDE.md
     Stand 13.06.2026. Das Original liegt ausserhalb dieses Repositories.
     Abweichung zum Code: hier steht --grey-d:#8d8d8d, im CSS #a8a8a8 — der Code gilt. -->

# CONCRETE Magazin — Projektkontext

Print-Magazin (A4, Einzelseiten, Ziel: 48 Seiten) für CONCRETE Brandbuilding.
Output: druckfähiges PDF als 1:1-Vorlage für den finalen Aufbau in InDesign.
Gebaut als **HTML/CSS → A4-PDF** (Chromium/Playwright). Jede Seite = ein `.page`-Block (210×297 mm).

## So rendern
```
pip install playwright --break-system-packages
python -m playwright install chromium
python render.py        # -> CONCRETE_Magazin.pdf + review_XX.png
```

## Designsystem (CSS Custom Properties, NICHT abweichen)
- Farben: `--coral:#fe7e5e` (einziger Akzent), `--coral-l:#febdac`, `--grey-l/#ebebeb`, `--grey-d:#8d8d8d`, `--ink:#0c0c0c`.
- **Basis-Hintergrund immer Light Grey `#ebebeb`** (warm). Wechselnde BG erlaubt: solid Coral, Coral-/Hell-Beton-Struktur, dunkel `#0c0c0c`. **Keine Pink-/Lila-Gradients.**
- Schrift Display/Headlines/Highlights: **0Arame** (Thin/Regular/Bold) — groß, eng, uppercase.
- Schrift Body/Copy: **Roc Grotesk Regular** (liegt in `assets/fonts/`, font-weight 400) für allen Fließtext. **Bold (700)** nur für Mikro-Labels, Eyebrows, Tags, Foot und Highlight-Wörter (`.hl`, coral). NICHT die ExtraLight/Light (zu fein, bricht weg).
- Kein echter Kursivschnitt vorhanden → Italic-Akzente sind faux-italic, nur sparsam für Kleintext.
- Fonts liegen in `assets/fonts/`, via `@font-face` eingebunden.

## Gestaltungsprinzipien (Editorial)
- **Masthead-geführtes Cover**: Logo groß = Magazinname; Thesis als ruhige Themen-Coverline; Coral-Beton als kontrolliertes Hero-Bild; Haarlinien + Mikro-Labels. Referenzen: Eliot, PAPER, wander.
- **Linienkonzept** (Haarlinien) durchgängig in abgewandelter Form: Fußlinie, Regel über der Case-Frage, kurze Regeln unter Headlines.
- Skalenkontrast (Riesentypo gegen Mikrotypo), versetzte Achsen, vertikale Randlabels (voll sichtbar, nie abgeschnitten), große ausgegraute Schnitt-Nummern, Slash-Mikrolabels, „Hamburg —— Frankfurt"-Fuß.
- Mittelachsige Headlines und Italic nur zwischendurch als Abwechslung.
- Beton-Texturen: dunkel = `Beton_red_02.png` auf `#0c0c0c`; warm/transparent = `tex_coral_alpha*.png`, `tex_grey_alpha.png`.
- No-Gos (CONCRETE): Stockfotografie, Clipart, overused Fonts (Inter/Roboto/Arial/Futura/Gotham/Garamond), generische KI-Ästhetik, Pink-Gradients.

## Seitentypen (Blueprints, schon gebaut in index.html)
Cover · Denktext · Scale-Kontrast (solid Coral) · Kapiteltrenner (full Coral-Beton, zentriert) · Case-Text · Case-Hero (Bild, zentrierte Overlay-Headline) · Case-Anwendungen (knappes Bildraster) · Case-Statement (Quote + Foto-Container) · Dunkle Beton-Seite.

## Case-Blueprint (Conlivo = Vorlage für alle Cases)
Wenige, starke Bilder. Pro Case: Textseite (Herausforderung/Strategie/Lösung/Gemacht + große Coral-Frage „Was bedeutet das für mich?") → Hero-Bild → Anwendungs-Raster (3–4 Bilder) → Statement mit Foto-Container.
Quotes mit Personenfoto + Namen/Rolle. Conlivo-Kern: „Nicht Software — Unabhängigkeit / Kontrolle zurückgeben".

## 48-Seiten-Flatplan (Soll)
Cover · Innencover · Warum dieses Magazin (2) · Inhalt+Kontakt (2) · Trenner Haltung · Denktexte Design/Verstehen/Brandbuilding (3–4) · Cases je 2–4 S.: Conlivo, FinaPlus, MDB, System360, Link*, Haftpflichtkasse*, Lieblings-Zahnarzt/Wackelzahn, medium+BGF+, be.care, nextbed, CCF, Noey+SKNMETRICS* · Denktexte „nicht aus eurer Branche", B2B, KI (+Statements Julia/Joana) · Prozess · Messbar/Kosten · Outro · Rückseite. (* = Bilder fehlen noch, Platzhalter.)

## Druck/InDesign
Aktuell auf Trim 210×297 gebaut. Vor Finalisierung full-bleed-Elemente auf **3 mm Beschnitt** ziehen. PDF dient als 1:1-Gestaltungsmaster; finaler Satz in InDesign.

## Wording
Briefing-Manuskript ist die Quelle für Struktur & Wording (siehe CONCRETE_Magazin.pdf). E-Mail: hello@concrete-designs.de · Hamburg / Frankfurt.
