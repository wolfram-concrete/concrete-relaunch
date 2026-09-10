# Übergabe an Codex: finale Optimierung

Dieser Text ist als Prompt gedacht. Alles darunter kann direkt übernommen werden.

---

Du übernimmst die fertige Relaunch-Website der CONCRETE – Brandbuilding GmbH und
sollst sie technisch optimieren. Der Inhalt und die Gestaltung sind abgenommen.
Deine Aufgabe ist Performance, Zugänglichkeit und Codequalität, nicht Redesign.

## Projekt

- Repository: `git@github.com:wolfram-concrete/concrete-relaunch.git`, Branch `main`
- Statische Seite ohne Build: 131 HTML-Dateien, eine `site.css` (85 KB), eine
  `site.js` (30 KB), 246 MB Assets, davon 26 MP4-Dateien
- Deployment: Vercel, `vercel.json` mit `cleanUrls`, Weiterleitungen und
  Vorlaunch-Headern
- Lokal ansehen: `python3 -m http.server 4174` im Repository-Wurzelverzeichnis
- Lies zuerst `README.md` und `docs/CHANGELOG.md`, dort stehen die Regeln des
  Projekts und der Stand vom 10.09.2026

## Woran du dich halten musst

1. **Cache-Buster.** Jede Änderung an `site.css` oder `site.js` erfordert, dass
   `?v=N` in allen HTML-Dateien erhöht wird. Aktuell `v=145`. Ohne das sieht
   niemand die Änderung.
2. **Medien haben keinen Cache-Buster.** Wenn du eine Bild- oder Videodatei
   ersetzt, gib ihr einen neuen Dateinamen, sonst liefern Browser die alte aus.
3. **Nach jeder abgeschlossenen Änderung committen und pushen.**
4. **`python3 tools/seo-gauntlet.py` muss mit Exit 0 enden.** Es prüft meta
   description, `rel=canonical`, Title-Längen, Eindeutigkeit, `sitemap.xml`,
   `robots.txt`, die Weiterleitungen und die Ankertexte der Branchenseiten.
   Läuft es nach deiner Arbeit auf einen Befund, hast du etwas kaputt gemacht.
5. **`noindex` bleibt drin.** Die Seite steht bewusst auf `noindex`, siehe
   README, Abschnitt „Vor dem Livegang". Nicht entfernen.

## Was wie Müll aussieht, aber Absicht ist

- **`&shy;` in Headlines.** Weiche Trennstellen in langen Komposita, damit auf
  schmalen Screens nichts aus dem Bild läuft und der Umbruch an der richtigen
  Fuge sitzt. Nicht entfernen, nicht „normalisieren".
- **Lange Titles auf Frageseiten.** Auf den Wissen-Seiten ist der Title die
  Frage. Das ist der Suchbegriff und darf über 70 Zeichen gehen.
- **Titles der Branchenseiten** beginnen mit „Strategie und Branding für …".
  Das ist eine SEO-Vorgabe des Kunden. Nicht kürzen, nicht umformulieren.
- **`style="--hero-pos:…"` auf `.case-hero`.** Steuert je Projektseite den
  Bildausschnitt des mobilen Vollbild-Heros. Sieht wie ein Inline-Style-Wildwuchs
  aus, ist aber pro Seite handverlesen.
- **`<picture>` mit `media="(max-width:820px)"` in einigen Heros.** Eigene
  Mobilmotive, wo das Querformat-Keyvisual im Hochformat nicht funktioniert.
- **`:has()`-Selektoren in `site.css`.** Bewusst eingesetzt, kein Versehen.
- **Inline-`<style>`-Blöcke im Head der Seiten.** Seitenspezifisch, sie stehen
  absichtlich nach dem Link auf `site.css` und gewinnen dadurch.

## Wo Optimierung tatsächlich lohnt

Priorisiere in dieser Reihenfolge und miss vorher und nachher:

1. **Bilder.** 246 MB Assets. Prüfe moderne Formate, `srcset`/`sizes`,
   `loading="lazy"` und `decoding="async"` auf allen Bildern unterhalb des
   ersten Bildschirms, sowie `width`/`height` gegen Layout-Sprünge.
2. **Videos.** 26 MP4-Dateien, teils als Autoplay-Hero. Prüfe Poster,
   `preload`, Bitrate und ob mobil ein leichteres Motiv reicht.
3. **Schriften.** Arame und die Grotesk liegen in `fonts/`. Prüfe `font-display`,
   Preload der tatsächlich im ersten Bildschirm verwendeten Schnitte und ob
   Subsetting möglich ist.
4. **Render-Blocking.** `site.css` ist eine Datei für alle Seiten. Prüfe, ob
   sich Critical CSS lohnt, ohne die Wartbarkeit zu zerstören.
5. **JavaScript.** `site.js` enthält unter anderem einen Galerie-Packer, ein
   Karussell mit Drag, Parallax und Scroll-Reveals. Prüfe Event-Handler auf
   `passive`, Layout-Thrashing in den Resize-Pfaden und ob Arbeit hinter
   `IntersectionObserver` gehört.
6. **Zugänglichkeit.** Kontraste, Fokus-Sichtbarkeit, Tastaturbedienung von
   Mega-Menü, mobilem Akkordeon und Karussell, `prefers-reduced-motion`.

## Was du nicht anfassen sollst

- Texte, Bildauswahl, Farben, Typografie, Abstände und Layout
- Die Informationsarchitektur und die Navigation
- Die Weiterleitungen in `vercel.json` und `tools/redirects.json`
- Die Grounding Page `fakten-zu-concrete-brandbuilding-gmbh.html` inhaltlich

## Abnahme

Zeige mir vor und nach deiner Arbeit je einen Lighthouse-Lauf für Startseite,
eine Projektseite und eine Branchenseite, jeweils mobil und Desktop. Berichte
ehrlich, was du nicht verbessern konntest.
