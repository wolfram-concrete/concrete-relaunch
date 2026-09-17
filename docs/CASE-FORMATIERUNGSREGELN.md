# Case-Seiten: verbindliche Formatierungsregeln

Stand: 17.09.2026. Diese Regeln gelten für die Projektseiten im Repository-Root,
nicht für den gesonderten historischen Konzept-Prototyp unter `konzept/`.

## Prinzip: duplizieren, nicht neu gestalten

Eine neue Case-Seite übernimmt die bestehenden Formatierungsregeln **1:1**.
Vor Beginn `case-nextbed.html`, `case-noey.html` sowie die zugehörigen Regeln
in `site.css` und `site.js` lesen. NextBed ist die Hauptreferenz. Inhalte dürfen
keine neu erfundene Dramaturgie, andere Satzbreiten oder Sondermodule begründen.
Die goSchneider-Nachbesserungen sind ausdrücklich kein wiederholbarer Prozess:
Formatierung muss schon bei der ersten Umsetzung mit der Referenz übereinstimmen.

## Aufbau und Module

1. Bestehender Header, Hero, Projekttitel und Leistungsmetadaten.
2. Herausforderung und sämtliche Case-Texte einschließlich Strategie,
   Designsystem und Ergebnis **vor** der Gallery. Vertiefungen im vorhandenen
   Accordion; keine einzelnen Packaging-/Website-Bildtext-Rubriken dazwischen.
3. Ein großes Introbild, danach das gemeinsame `case-mosaic`-Raster. Vorhandene
   Packlogik und Medienhöhen verwenden; keine leeren Rasterzellen oder eigenen
   Masonry-Implementierungen. Fotos, Anwendungen und Illustrationen mischen.
4. Relevanz-Modul wie NOEY/NextBed: `data-screen-label="Relevanz"`, Desktop-Raster
   `.9fr / 1.1fr`, vorhandener Gap, Arame-Headline in `clamp(30px,3.6vw,52px)`
   mit Zeilenhöhe `1.02` und maximal `14ch`; **korallfarbener Originalpfeil**
   darunter. Copy im regulären Body-Stil, keine Big-Copy oder zusätzliche
   H3-Schriftstufe. Einladung fett im Absatz, CTA in der vorhandenen
   `button-row` mit `var(--s4)` Abstand. Mobile Regeln des Moduls mit übernehmen.
5. Persönliche Stimme, falls vorhanden: gemeinsame Klassen `personal-voice`,
   `personal-voice__text`, `personal-voice__author` und `stimme-media` verwenden.
   Desktop **2/3 Text, 1/3 Portrait**, kein 50:50 und keine bildgetriebene Höhe.
   Coral-Fläche, Grotesk Regular `clamp(17px,1.5vw,22px)`, Zeilenhöhe `1.5`,
   Padding `clamp(28px,3.6vw,56px)`. Name in Meta-Größe, Rolle/Firma fett,
   korrektes Portrait und gemeinsamer Beton-Grunge. Mobil Portrait über Text.
   Inhalte nicht künstlich kürzen, um identische Höhen zu erzwingen.
6. Bestehendes Weitere-Projekte-Karussell und Footer unverändert übernehmen.

Kundenstimmen sind ein eigener Modultyp, nicht mit der persönlichen Stimme
verwechseln. Fehlende Quotes nicht erfinden: Modul bis zur Lieferung ausblenden.

## Medien, Integration und Abnahme

- Hero-Bild auch für alle Projektteaser und Karussellkacheln verwenden.
- Dekorative Videos stumm, `autoplay muted loop playsinline`, ohne Controls.
  Vorhandene Reduced-Motion-/Save-Data-Logik erhalten; Poster bereitstellen.
- Globale Case-Headlinebreiten, Schriftregeln, Copy-Raster, Abstände, CTA und
  responsive Breakpoints unverändert übernehmen. Keine lokalen Ersatzregeln.
- Projektübersicht, Mega-Menü und inhaltlich passende Projektmodule ergänzen;
  fachfremde kuratierte Auswahlen nicht wahllos verändern.
- Vor Übergabe Browservergleich mit NextBed und NOEY bei Desktop, Tablet und
  Mobile: Satzbreiten, Oberkanten, Pfeil, CTA, Portrait, Grunge, Gallery ohne
  Lücken, Video-Wiedergabe und horizontale Überläufe kontrollieren.
- Technischen Preflight, SEO-Gauntlet und `git diff --check` ausführen.
  Cache-Version bei Änderungen gemeinsam mit der technischen Erwartung pflegen.
- Ausdrücklich gewünschte Abweichungen dokumentieren; ohne Freigabe keine
  Neuinterpretation bestehender Module.
