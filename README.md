# CONCRETE Relaunch

Die neue Website von CONCRETE Brandbuilding im Magazin-Look. Entstanden in
Claude Design, fortgeführt in Claude Code. Statisches HTML/CSS/JS, kein Build.

- `index.html` – Startseite, alle weiteren Seiten liegen daneben (Dateiname = Slug)
- `site.css` / `site.js` – geteilte Design- und Verhaltensschicht
- `assets/` – Bilder (webverkleinert), `fonts/` – lizenzierte WOFF2, `vendor/` – GSAP
- `docs/` – Konzeption, Übergaben und Entscheidungshistorie
- `_entwuerfe/` – unverlinkte Arbeitsstände aus der Designphase

Videos kommen vom CDN `concrete-video-cdn.vercel.app` (siehe `docs/VIDEO-VERANKERUNG.md`).
Originalbilder und der alte WordPress-Export liegen im Repository
`wolfram-concrete/concrete-website`; hier gibt es bewusst keine Kopie davon.

## Lokal ansehen

    python3 -m http.server 4173

Dann `http://localhost:4173/`.

## Status

Vorlaunch: `vercel.json` setzt `noindex` auf alle Seiten. Vor dem Livegang
entfernen. Offene Punkte: `docs/UEBERGABE-CLAUDE-CODE.md`.
