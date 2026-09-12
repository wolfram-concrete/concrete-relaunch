# Technische Optimierung und Preflight · 10.09.2026

## Ergebnis

Der technische Optimierungspass ist auf `main` umgesetzt. Inhalt,
Informationsarchitektur, Navigation, Bildauswahl, Farben, Typografie,
Abstände und Layout wurden nicht neu gestaltet. Die Weiterleitungen und der
Inhalt der Grounding Page blieben unverändert. Das Vorlaunch-`noindex` ist
weiterhin an beiden vorgesehenen Stellen aktiv.

- `python3 tools/seo-gauntlet.py`: **129 Seiten, 0 Befunde**
- `python3 tools/technical-preflight.py`: **129 Seiten, 0 Befunde**
- Sitemap: **129 deklarierte URLs, 129 vorhandene Seiten**
- Weiterleitungen: **158**, ohne fehlendes Ziel, Duplikat oder Selbstschleife
- Interne Links, Fragmentziele und lokale Ressourcen: **0 defekte Ziele**
- Bilddimensionen: **0 fehlende `width`/`height`-Paare** auf Sitemap-Seiten
- Browserkonsole in den geprüften Interaktionen: **0 Warnungen/Fehler**
- Vercel Production Deployment: Die finale Seitenrevision `98c6870` wurde
  als **Ready** auf `main` verifiziert. Zum damaligen Prüfzeitpunkt antwortete
  der öffentliche Zugriff mit Basic Auth (`401`) und
  `X-Robots-Tag: noindex, nofollow`. Der Basic-Auth-Schutz wurde am 12.09.2026
  entfernt; das eigenständige Vorlaunch-`noindex` bleibt aktiv.

## Lighthouse vorher / nachher

Messung mit Lighthouse 13.4.1 gegen denselben lokalen statischen Server auf
Port 4174. Vorher: Commit `ecb1219`; nachher: Commit `98c6870`. Je URL und
Geräteprofil ist genau ein Abnahmelauf dargestellt. Die Werte sind Labordaten
und unterliegen Laufzeitstreuung; Transferänderungen sind belastbarer als
kleine Score-Differenzen.

### Scores

| Seite | Profil | Performance | Accessibility | Best Practices | SEO |
|---|---|---:|---:|---:|---:|
| Startseite | Mobil | 57 → **84** | 92 → **96** | 96 → **100** | 69 → 69 |
| Startseite | Desktop | 46 → **71** | 92 → **100** | 96 → **100** | 69 → 69 |
| Nextbed-Case | Mobil | 75 → **87** | 92 → **96** | 96 → **100** | 69 → 69 |
| Nextbed-Case | Desktop | 79 → **100** | 88 → **96** | 96 → **100** | 69 → 69 |
| B2B-Branchenseite | Mobil | 92 → **95** | 96 → **96** | 96 → **100** | 69 → 69 |
| B2B-Branchenseite | Desktop | 85 → **89** | 91 → **96** | 96 → **100** | 69 → 69 |

Der SEO-Score von 69 ist kein SEO-Defekt. Lighthouse wertet das verbindlich
gesetzte Vorlaunch-`noindex` als nicht crawlbar. Alle übrigen Regeln werden
vom projektspezifischen SEO-Gauntlet geprüft.

### Kernmetriken

| Seite | Profil | FCP | LCP | Speed Index | TBT | CLS | Transfer |
|---|---|---:|---:|---:|---:|---:|---:|
| Startseite | Mobil | 3,01 → **1,67 s** | 8,56 → **4,32 s** | 10,21 → **2,09 s** | 89 → **0 ms** | 0,12 → **0** | 41,29 → **7,73 MiB** |
| Startseite | Desktop | 0,57 → **0,52 s** | **4,25 → 5,48 s** | 3,90 → **1,51 s** | 0 → 0 ms | 0,71 → **0,12** | 46,04 → **23,13 MiB** |
| Nextbed-Case | Mobil | 1,36 → **1,35 s** | 9,01 → **3,98 s** | 1,36 → **1,35 s** | 0 → 0 ms | 0 → 0 | 12,59 → **3,66 MiB** |
| Nextbed-Case | Desktop | 0,53 → **0,41 s** | 3,93 → **0,79 s** | 0,87 → **0,41 s** | 0 → 0 ms | 0,01 → **0** | 14,45 → **5,73 MiB** |
| B2B-Branchenseite | Mobil | 1,21 → **1,20 s** | 3,31 → **2,85 s** | 1,21 → **1,20 s** | 0 → 0 ms | 0,01 → **0** | 0,84 → 0,85 MiB |
| B2B-Branchenseite | Desktop | 0,44 → **0,33 s** | 2,74 → **2,19 s** | 0,71 → **0,39 s** | 0 → 0 ms | 0 → 0 | 2,91 → **2,68 MiB** |

## Umgesetzt

### Bilder

- 5.859 lokale Bilder haben intrinsische Maße erhalten; 4.859 bereits
  lazy-geladene Bilder zusätzlich `decoding="async"`.
- Acht externe Poster besitzen feste Maße.
- Die größte Betontextur wurde für ihre maximale Darstellungsgröße neu
  gerechnet; sechs stark geladene JPEGs werden als WebP ausgeliefert.
- Ersetzte Medien tragen neue Dateinamen. Sieben danach unreferenzierte
  Originale wurden aus dem aktuellen Baum entfernt und bleiben über Git
  wiederherstellbar.

### Videos

- Video-Teaser werden erst 320 px vor dem Viewport erzeugt.
- 29 Galerie-/Projektvideos laden ihre Quelle erst in Sichtweite, pausieren
  außerhalb des Viewports und bleiben bei `prefers-reduced-motion` als Poster
  stehen.
- Der mobile Homepage-Hero lädt weder das 13,6-MB-Video noch die 13
  Desktop-Introframes. Desktop behält die abgenommene Choreografie.
- Zwei zuvor posterlose Videos haben cache-sicher benannte Poster erhalten.

### Fonts und Renderpfad

- Die drei im ersten Bildschirm benötigten lokalen WOFF2-Schnitte werden
  vorgeladen; `font-display: swap` war bereits korrekt.
- Die 13 nur im Desktop-Intro verwendeten Google-Fonts-Schnitte blockieren
  den mobilen Renderpfad nicht mehr und werden inzwischen vollständig lokal
  ausgeliefert; der Browser kontaktiert Google Fonts nicht mehr.
- Die lokalen Fonts wurden nicht weiter unterteilt: 16–24 KB je Schnitt
  rechtfertigen Zeichen-, Lizenz- und Wartungsrisiko nicht.
- Kein Critical-CSS-Split: Eine zweite CSS-Quelle oder 129 Kopien von
  Inline-CSS wären für die gemessene Ersparnis wartungsintensiver als die
  bestehende gemeinsame 85-KB-Datei.

### JavaScript und Interaktion

- Parallax, Galerien, Rezensionen und Projekt-Marquees arbeiten nur im oder
  nahe am Viewport und pausieren in inaktiven Tabs.
- Permanente Polling-Timer für Ton und Navigationskontrast wurden durch
  Ereignisse ersetzt; Resize-Messungen sind gebündelt.
- Projektfilter melden `aria-pressed`; ausgeblendete Marquee-Duplikate sind
  aus der Tabfolge entfernt.
- Das Case-Karussell pausiert bei Fokus und ist mit Links-/Rechts-Pfeil
  bedienbar. Mega-Menü, mobiles Akkordeon und Review-Karussell behalten ihre
  vorhandene native Button-/Escape-/Pfeilbedienung.
- Favicon-404, unzulässiges Absatz-ARIA und zu kleine Desktop-Nav-Ziele sind
  behoben.

### Deployment und Prüfbarkeit

- Einheitlicher Cache-Buster: `site.css?v=154` und `site.js?v=154` auf allen
  129 Seiten.
- `.vercelignore` verhindert, dass vier Entwurfsseiten, zwei HTML-Partials
  und interne Arbeitsordner als öffentliche URLs ausgeliefert werden.
- `tools/technical-preflight.py` macht die vollständige Link-, Asset- und
  Seitenprüfung wiederholbar.

## Gauntlet: Gegenhypothesen und offene Grenzen

1. **Desktop-LCP der Homepage:** Im dargestellten Lauf steigt der LCP von
   4,25 auf 5,48 Sekunden, obwohl Transfer, Speed Index und CLS klar besser
   werden. Ursache ist der wechselnde LCP-Kandidat während des abgenommenen
   Schrift-/Video-Intros; Lighthouse meldete in einzelnen Läufen sogar
   `NO_LCP`. Eine verlässliche weitere Verbesserung verlangt eine Änderung
   der Intro-Choreografie oder ihres sichtbaren Timings und wurde deshalb
   nicht erzwungen.
2. **Farbkontrast:** Coral `#fe7e5e` auf Paper `#f3efe7` erreicht etwa 2,19:1
   statt 3:1 für große Schrift. Das erklärt den verbleibenden
   Accessibility-Score 96 auf den betroffenen Seiten. Farben waren explizit
   gesperrt; der Befund ist dokumentiert, nicht kaschiert.
3. **Asset-Bestand:** `assets/` umfasst weiterhin rund 243 MB; 84 Rasterbilder
   sind größer als 500 KB. Durch Lazy Loading werden sie nicht pauschal pro
   Seite übertragen. Ein vollständiges `srcset`-/AVIF-System wäre als
   reproduzierbare Bildpipeline sinnvoller als hunderte manuell gepflegte
   Varianten in einer Site ohne Buildprozess.
4. **Videos:** Die 26 lokalen MP4-Dateien umfassen nur rund 15,1 MiB; weitere
   Videos kommen vom vorhandenen CDN. Eine erneute Bitratenrunde ist ohne
   visuelle Einzelabnahme nicht belastbar. Die größere Wirkung kam hier aus
   Poster, Preload und viewport-gesteuertem Laden.
5. **404-Seite:** Es gibt keine kaputten internen Ziele, aber auch keine
   gestaltete `404.html`. Vercel liefert nach der Vorlaunch-Authentifizierung
   daher seine Standardfehlerseite. Eine markengerechte 404 benötigt
   freigegebenen Text und Gestaltung und liegt außerhalb dieses Technikpasses.
6. **Felddaten:** Vercel Web Analytics und Speed Insights sind im Projekt
   nicht aktiviert. Lighthouse belegt Laboreffekte, nicht reale
   Nutzerverteilungen. Aktivierung sollte gemeinsam mit Datenschutz- und
   Consent-Entscheidung erfolgen.
7. **Produktionsprüfung:** Basic Auth schützte bei diesem Audit alle Routen,
   auch `robots.txt`, `sitemap.xml` und unbekannte URLs. Der Schutz wurde am
   12.09.2026 entfernt. Nach dem folgenden Vercel-Deployment sind öffentlicher
   Status 200, Sitemap, robots.txt und echter 404 erneut zu prüfen; beim
   Domainwechsel muss der vollständige URL-Test wiederholt werden.
8. **Datenschutz-Erklärung und Implementierung:** Der frühere Befund meinte
   keine einzelne Formulierung, sondern einen Widerspruch zwischen Text und
   Technik: Die alte Erklärung nannte 1&1, Google Fonts, Maps, reCAPTCHA,
   YouTube- und Facebook-Plugins sowie ein Kontaktformular, obwohl der Relaunch
   über Vercel läuft, Schriften und Videos selbst ausliefert und diese
   Einbindungen nicht besitzt. Der Text wurde deshalb vollständig am
   tatsächlichen Relaunch ausgerichtet und ein Basic-Consent-System ergänzt.
   Kontoebene und Verträge bleiben separat zu bestätigen. Die nicht mehr
   verwendeten Facebook- und HubSpot-Alt-Tags wurden am 11.09.2026 in
   GTM-Live-Version 39 pausiert.

## Empfohlene nächste Schritte

1. Vor dem Launch entscheiden, ob der Desktop-Homepage-LCP eine Anpassung des
   abgenommenen Intros rechtfertigt.
2. Kontrast-Ausnahme gemeinsam mit Design bewerten; erst danach Farben
   ändern.
3. Falls laufend neue Cases hinzukommen: kleine Bildpipeline für WebP/AVIF
   und 640/1280/1920-px-Derivate einführen, dann `srcset/sizes` je
   Seitentyp ergänzen.
4. Eine freigegebene 404-Seite gestalten und umsetzen.
5. Die übrigen Tags mit Tag Assistant je Consent-Kategorie prüfen und
   Analytics-/Clarity-Aufbewahrung sowie AV-Verträge bestätigen.
6. Nach Datenschutzfreigabe Speed Insights oder ein bestehendes RUM-System
   aktivieren und die Labordaten mit Feldwerten abgleichen.
7. Am Launch-Tag den Ablauf im README exakt ausführen und anschließend beide
   Gauntlets sowie externe Status-/Redirect-Checks wiederholen.

## Reproduzierbare Abnahme

```bash
python3 -m http.server 4174
python3 tools/seo-gauntlet.py
python3 tools/technical-preflight.py
```

Lighthouse wurde jeweils mit Mobile-Standardprofil beziehungsweise
`--preset=desktop` ausgeführt.
