# Performance und Indexierung · 17.09.2026

## Ergebnis und Umfang

**Status: GELB.** Alle 136 kanonischen Seiten sind erreichbar und indexierbar. Die finale Sitemap ist live und am 17.09.2026 in der Search Console erneut eingereicht; dort steht sie auf „Erfolgreich“. Die Startseite hat weiterhin eine hohe Medienlast und schwankende mobile Ladezeiten. Die neuen Cases sind technisch stabil, erreichen mobil aber teilweise noch nicht das LCP-Ziel von 2,5 Sekunden.

Geprüft: vollständiger HTTP-/Canonical-/Robots-Crawl aller 136 Sitemap-URLs; Lighthouse auf sechs Seiten jeweils Mobil und Desktop; zusätzliche mobile Startseitenmessung; Repository-Preflight und SEO-Gauntlet; Search Console, GA4 und veröffentlichter GTM-Container. Keine echten Kontaktanfragen oder Buchungen ausgelöst. Kein vollständiger manueller Accessibility- oder Formular-Abnahmetest.

## Lighthouse-Messwerte

Live-Domain: `https://www.concrete-designs.de`. Messung 21:19–21:24 Uhr MESZ, Lighthouse 13.4.1, Chrome 152, frische Browserprofile ohne optionale Tracking-Einwilligung. Mobile: simulierte Mobilverbindung mit 150 ms RTT, etwa 1,6 Mbit/s und vierfach verlangsamter CPU. Desktop: Lighthouse-Desktop-Preset. Die Werte sind Laborwerte, keine Messungen realer Besucher.

| Seite | Performance Mobil | Desktop | LCP Mobil | LCP Desktop | Übertragung Mobil |
|---|---:|---:|---:|---:|---:|
| Startseite `/` | 79 (Wiederholung), 54 (erster Lauf) | 72 | 4,3 s (Wiederholung) | 6,9 s | ca. 18,0 MiB |
| `/case-parq-energy` | 86 | 81 | 4,1 s | 3,4 s | 1,49 MiB |
| `/case-haftpflichtkasse` | 90 | 85 | 3,2 s | 2,5 s | 0,46 MiB |
| `/case-link` | 92 | 86 | 2,9 s | 2,7 s | 0,79 MiB |
| `/case-medium` | 88 | 100 | 3,4 s | 0,6 s | 1,88 MiB |
| `/website-design` | 98 | 89 | 2,2 s | 2,3 s | 1,48 MiB |

Der erste mobile Startseitenlauf meldete 39,6 s simulierten LCP und 530 ms TBT; die Wiederholung 4,3 s und 80 ms. Das ist eine starke Schwankung, deshalb keinen einzelnen Wert als verlässliche Besucher-Ladezeit interpretieren. Die Medienlast blieb mit 18.325 bzw. 18.366 KiB nahezu identisch. Desktop übertrug auf der Startseite 20.200 KiB.

Alle übrigen Messungen: TBT 0 ms, CLS zwischen 0 und 0,003. SEO und Best Practices jeweils 100 Punkte. Accessibility automatisiert: 100, außer Startseite Mobil mit 96; dort meldet Lighthouse Kontrastprobleme beim animierten Praxis-Statement. Das belegt keine vollständige Barrierefreiheit.

Lighthouse protokollierte bei einzelnen Trace-Insights `LanternError: NO_LCP`; die gespeicherten Performance-Audits haben keine Audit-Fehler. Einzelne zusätzliche Insight-Auswertungen sind dadurch eingeschränkt. Rohberichte und vollständiger Crawl liegen lokal unter `/private/tmp/concrete-performance-2026-09-17/`.

## Priorisierte Befunde

### P1 · Medienlast der Startseite reduzieren

- Beleg: im mobilen Netzwerkmitschnitt etwa 18 MiB Übertragung; `https://concrete-video-cdn.vercel.app/v/hero-2.webm` allein etwa 6,6 MB, Beton-Hintergrund `beton-red-alpha-quer-hd-opt.webp` etwa 1,28 MB. Hinzu kommen mehrere Hero-JPEGs mit jeweils etwa 0,4–0,53 MB.
- Wirkung: Netzwerkkonkurrenz zwischen Hero-Video, Reel und weiteren Bildern; mobile Ladezeit bleibt deutlich ausbaufähig.
- Empfehlung: kleineres mobiles Hero-Video mit passendem Poster; Reel-Fotos als responsive WebP/AVIF; Betontexturen an tatsächliche Darstellung anpassen; Medien unterhalb des sichtbaren Bereichs später laden. Lighthouse schätzt allein beim mobilen Bildtransport etwa 6,7 MiB Einsparpotenzial.
- Abnahme: gleicher visueller Ablauf, deutlich geringere Übertragung und wiederholte mobile Messungen mit LCP möglichst ≤ 2,5 s, ohne schlechteren CLS.
- Verantwortlich: CONCRETE/Website-Entwicklung. Status: offen; in diesem Auftrag gemessen, keine visuellen Performance-Umbauten vorgenommen.

### P2 · PARQ-Hero und wiederkehrende Porträts optimieren

- Beleg: mobiler PARQ-Hero `dscf7744-hero-w1280.webp` etwa 354 KB; Lighthouse schätzt rund 287 KiB Bild-Einsparpotenzial. `assets/team/christian-portrait.jpg` lädt im gleichen Test mit etwa 408 KB.
- Empfehlung: Hero-Kompression visuell prüfen und kleinere responsive Porträtvarianten einsetzen; nicht sichtbare Porträts lazy laden.
- Abnahme: Schärfe erhalten, kleinerer Download, PARQ-LCP in Wiederholungsmessungen verbessern.
- Verantwortlich: CONCRETE/Website-Entwicklung. Status: offen.

### P2 · Website-Screencasts für Streaming und Aktualisierung vorbereiten

- Beleg: LINK 47,1 MB, BGF+ 44,2 MB, System 360 41,4 MB, medium 38,5 MB, NOEY 37,5 MB, PARQ 37,4 MB. Die GitHub-Dateigrößenempfehlung ist kein Ladezeitbudget für Besucher.
- Positiv: PARQ-Video hatte beim Seitenaufruf keinen `src` und `readyState=0`; nach Scrollen zur Galerie `src=assets/cases/parq-energy/parq-website.mp4` und `readyState=4`. Es wird somit bedarfsgesteuert geladen und spielt ab Sekunde 2.
- Empfehlung: kleinere Web-Exporte oder adaptives Streaming prüfen. Bei neuen Exporten Dateiname/Versions-URL ändern: der Live-Server liefert Assets mit `public, max-age=31536000, immutable`, deshalb können überschriebenen Dateien unter gleicher URL bei wiederkehrenden Besuchern veraltet bleiben.
- Abnahme: gleicher Content und Startzeitpunkt, weniger Übertragung beim Galerie-Einstieg, neue Exporte sofort unter neuer URL erreichbar.
- Verantwortlich: CONCRETE/Website-Entwicklung. Status: offen.

## Sitemap und Google Search Console

- `sitemap.xml`: 136 eindeutige HTTPS-URLs unter `www.concrete-designs.de`, nur indexierbare kanonische Seiten. Änderungsdaten aus Git; tatsächliche Inhalts-/Linkänderungen statt eines pauschalen heutigen Datums.
- `robots.txt` verweist auf die finale Sitemap. Live-Antwort: HTTP 200, `application/xml`. Nach Veröffentlichung mit der lokalen Datei bytegleich verglichen.
- Vollständiger Live-Crawl: 136 × HTTP 200, keine Weiterleitungen der Sitemap-Ziele, keine Canonical-Abweichungen, kein `noindex`.
- In der Domain-Property `concrete-designs.de` erneut eingereicht: `https://www.concrete-designs.de/sitemap.xml`. Einreichdatum 17.09.2026, Status „Erfolgreich“.
- Search Console zeigte direkt nach Einreichung noch 133 erkannte Seiten aus dem bisherigen Verarbeitungsstand. Das ist keine Bestätigung, dass alle 136 Seiten bereits neu gecrawlt oder indexiert sind.
- Historische Einreichungen `sitemap_index.xml` und `page-sitemap.xml` sind weiterhin in der Search Console sichtbar; die alte `page-sitemap.xml` hat den historischen Status „Konnte nicht abgerufen werden“. Diese Einträge wurden nicht gelöscht.
- Core Web Vitals, letzter Stand 16.09.2026: Mobil 0 zugeordnete URLs, historischer LCP-Hinweis ebenfalls mit 0 URLs; Desktop ausdrücklich nicht genügend Nutzungsdaten. Daher keine belastbaren aktuellen Feldwerte für LCP, INP oder CLS verfügbar.

Eine Sitemap unterstützt Entdeckung und Crawling; die Indexierung entscheidet Google. Quelle: [Google: Sitemap erstellen und einreichen](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## Analytics und GTM

- GA4-Webstream `concrete-designs.de`, Mess-ID `G-27Z3TB9J98`: Datenerhebung in den vergangenen 48 Stunden aktiv; optimierte Analysen und Seitenaufrufe aktiviert.
- GTM `GTM-N8223FX`, veröffentlichte Version 41 vom 16.09.2026: `ga4_main_tag` ist ein Google-Tag mit Trigger „All Pages“ und bestehender Consent-Ausnahme.
- Auf der neuen PARQ-Seite laden im Browser das passende GTM-Script und `gtag/js?id=G-27Z3TB9J98` unter der vorhandenen Einwilligung.
- Keine zusätzliche Seitenregistrierung oder Sitemap-Übertragung in GA4/GTM nötig. Die Sitemap gehört in Search Console; neue statische Seitenaufrufe werden über das bestehende All-Pages-Tag erfasst. Quelle: [Google Analytics: Seitenaufrufe messen](https://developers.google.com/analytics/devguides/collection/ga4/views).
- Keine Tags, Events oder Conversion-Regeln geändert. Die konkrete Verarbeitung jedes neuen Case-Aufrufs in GA4-Berichten wurde nicht separat nachgewiesen; die Prüfung belegt Stream-/Trigger-Konfiguration und Browser-Einbindung.

## Prüfgates und Grenzen

| Gate | Ergebnis | Beleg/Grenze |
|---|---|---|
| Sitemap | Bestanden | 136 URLs, XML live abgeglichen, Search-Console-Einreichung erfolgreich |
| H-Struktur | Automatisierte Stichprobe bestanden | Lighthouse-/Repository-Prüfung; kein vollständiger manueller Outline-Audit |
| Barrierefreiheit | Teilweise offen | Lighthouse 96–100; mobiler Kontrastfund; kein vollständiger manueller Test |
| Integrationen | Tracking-Konfiguration geprüft | GA4 aktiv, GTM All Pages; keine echten Formular-/Buchungstests |
| SEO-Metadaten | Automatisiert bestanden | SEO-Gauntlet 136 Seiten ohne Befunde, Lighthouse SEO 100 |
| 404-/Danke-Seiten | 404 bestanden, Abschlusswege nicht geprüft | Zufällige fehlende Live-URL liefert HTTP 404; keine Buchung ausgelöst |
| Performance | Optimierung erforderlich | Startseite und einige Case-Heros; Laborwerte, keine aktuellen belastbaren Feldwerte |

## Durchgeführt und nächste Kontrolle

Sitemap aktualisiert und veröffentlicht; vollständiger Live-Crawl durchgeführt; 13 Lighthouse-Läufe gespeichert; Search Console erfolgreich eingereicht; GA4/GTM geprüft. Repository-Preflight und SEO-Gauntlet: jeweils 136 Seiten, 0 Befunde. `git diff --check` ohne Fehler.

Nach erneuter Verarbeitung in Search Console die Anzahl erkannter Seiten und den Indexierungsstatus von PARQ, LINK und Haftpflichtkasse kontrollieren. Nach Medienoptimierung dieselben Lighthouse-Profile erneut messen. Diese Folgekontrollen sind Empfehlungen, keine eingerichtete Automatisierung.
