# SEO-, AEO-, GEO- und Migrationsanalyse

**Projekt:** CONCRETE Relaunch  
**Zukünftige Produktionsdomain:** `https://www.concrete-designs.de/`  
**Geprüfte Revision:** `497e8f3b` plus die in diesem Audit neu angestellte Dokumentation  
**Auditdatum:** 12. September 2026, Australia/Brisbane  
**Status:** **NO-GO im aktuellen Zustand** – der Relaunch ist substanziell vorbereitet, aber zwei Indexierungssperren und mehrere P1-Risiken müssen vor dem Cutover geschlossen werden.

## Management Summary

Das neue statische Projekt besitzt eine ungewöhnlich gute SEO-Grundlage: 129 öffentliche Seiten, eindeutige Titles und Descriptions, genau einen H1 je Seite, vollständige Canonicals, eine vollständige Sitemap und eine bereits weit ausgearbeitete Redirect-Liste. Die 223 URLs der aktuellen WordPress-Sitemaps sind formal vollständig abgedeckt: 65 Pfade bleiben erhalten und 158 werden weitergeleitet.

Unverändert darf das Repository trotzdem nicht auf die Produktionsdomain geschaltet werden:

1. Alle 129 HTML-Seiten enthalten `noindex,nofollow`.
2. Vercel setzt zusätzlich global `X-Robots-Tag: noindex, nofollow`, sogar auf Sitemap und Assets.
3. Die Homepage ist mit bis zu 25,7 MB Transfer, 9,7 Sekunden Desktop-LCP und 0,697 CLS nicht launchbereit.
4. Interne Links, Open Graph und Teile des JSON-LD verwenden `.html`, während Canonicals und Sitemap extensionless URLs verwenden.
5. Das strukturierte Datenmodell ist fast nicht vorhanden und das einzige Organization-Markup referenziert ein fehlendes Logo.
6. Die Redirect-Abdeckung beruht bislang hauptsächlich auf den WordPress-Sitemaps. Der Live-Crawl fand zusätzlich 31 intern verlinkte Pfade außerhalb dieser Sitemaps und 1.066 historische WordPress-Bild-URLs; mehrere vorgelagerte WordPress-Aliasse würden nach Abschaltung des CMS verloren gehen.
7. URLs aus Search Console, Analytics, Serverlogs, Backlinks, Downloads und Kampagnen müssen vor dem Cutover noch ergänzt beziehungsweise ausdrücklich ausgeschlossen werden.

Der Benchmark bewertet Implementierungs- und Launch-Readiness, **nicht** erwartete Rankings oder Traffic. Aktueller Wert: **56/100, NO-GO wegen harter Launch-Gates**.

## Scope, Methode und Grenzen

Geprüft wurden:

- die vollständige lokale statische Codebasis;
- alle 129 öffentlichen HTML-Dateien und die lokale Sitemap;
- Vercel-Konfiguration, Redirects, robots.txt, Meta-Daten, Canonicals, Open Graph und JSON-LD;
- repräsentative Seitentypen im lokalen Browser auf Desktop und Mobile;
- Lighthouse-Labmessungen für Homepage, Leistungsseite, Case Study und Antwortseite;
- die aktuelle WordPress-Homepage, robots.txt, Sitemap-Index und alle vier Child-Sitemaps;
- die URL-Abdeckung zwischen aktueller WordPress-Sitemap und Relaunch;
- aktuelle Primärdokumentation von Google, OpenAI, web.dev, schema.org und Vercel;
- ein unabhängiger Sub-Agent-Audit der Live-/Migrationsrisiken;
- der Payload-SEO-Agent-Skill aus dem Projekt `link-hr` als zusätzliche Checklisten-Inspiration.

Nicht verfügbar waren Google Search Console, Bing Webmaster Tools, Analytics-Landingpages, WordPress-/Apache-Serverlogs, Backlink-Export, Rankinghistorie, Conversion-Baseline und echte Chrome-UX-Felddaten. Deshalb können organischer Wert einzelner Alt-URLs, reale Nutzer-Performance und historische Indexierung nicht abschließend bewertet werden.

Es gibt keine `package.json`, keinen Lockfile und keine zu installierenden App-Dependencies. Das Projekt ist eine statische Website. Lokal wurde es mit `python3 -m http.server` gestartet. Beide vorhandenen Prüfskripte bestanden:

```text
python3 tools/seo-gauntlet.py
129 Seiten geprüft, 0 Befunde

python3 tools/technical-preflight.py
Technical preflight: 129 pages, 0 findings
```

## Benchmark

| Kategorie | Gewicht | Grad 0–4 | Punkte | Konfidenz | Kurzbefund |
|---|---:|---:|---:|---|---|
| Crawlability und Indexierung | 15 | 1 | 3,75 | hoch | Zwei globale `noindex`-Mechanismen; vor Launch beabsichtigt, live ein Totalausfall |
| URLs, Canonicals und Redirects | 15 | 3 | 11,25 | mittel–hoch | 223/223 Sitemap-URLs formal abgedeckt; `.html`-Inkonsistenz und Sammelredirects offen |
| On-page und Rendering | 10 | 3 | 7,50 | hoch | Metadaten, H1, `lang` und Kerninhalt vorhanden; kleinere Strukturfehler |
| Contentqualität und Trust | 15 | 3 | 11,25 | mittel | starke Themenbreite und Cases; Autoren, Daten, Quellen und Ergebnisbelege fehlen oft |
| Interne Verlinkung und Architektur | 8 | 2 | 4,00 | hoch | gute Hubs, aber Faktenseite verwaist und alle internen Links erzeugen künftig Redirects |
| Structured Data und Suchdarstellung | 10 | 1 | 2,50 | hoch | nur eine Seite mit zwei JSON-LD-Blöcken; fehlerhaftes Logo und URL-Konflikt |
| AEO/GEO und Entitätsklarheit | 10 | 3 | 7,50 | mittel | gute direkte Antworten und Themencluster; Entitäts-/Quellensignale ausbaufähig |
| Performance, Mobile, Accessibility | 10 | 2 | 5,00 | hoch für Lab | Homepage und Cases riskant; Kontrast-/Label-Probleme |
| Local/International/Media | 4 | 2 | 2,00 | mittel | Standorte sichtbar, aber Schema/Profiles nicht verifiziert; Media schwer |
| Measurement und Betrieb | 3 | 1 | 0,75 | niedrig–mittel | technische QA vorhanden, aber keine zugängliche Such-/Felddatenbaseline |
| **Gesamt** | **100** |  | **55,5 ≈ 56** | **mittel–hoch technisch** | **Nicht launchbereit; Hard Gates überschreiben den Score** |

## Was bereits stark ist

- 129 von 129 Seiten besitzen jeweils genau einen H1- und einen `main`-Bereich.
- Alle 129 Titles und Meta-Descriptions sind vorhanden und eindeutig.
- Alle 129 Canonicals sind eindeutig und zeigen auf die gewünschte HTTPS-/www-/extensionless-Struktur.
- Die lokale Sitemap enthält genau dieselben 129 öffentlichen Canonical-URLs.
- Kein Bild fehlt formal das `alt`-Attribut; dekorative Bilder verwenden überwiegend bewusst leere Alternativtexte.
- Rund 30 direkte Frage-/Antwortseiten beginnen mit einer kurzen Erklärung und liefern danach Details.
- 40 Case Studies, zehn Branchenbereiche, Leistungsseiten und Wissensinhalte geben Such- und Antwortsystemen ein breites, zusammenhängendes Themenfeld.
- Die aktuelle WordPress-Sitemap ist gegenüber dem bekannten neuen URL-Set vollständig abgebildet.
- Mobile Navigation und Case-Akkordeons funktionierten im Browser; die getesteten Seiten erzeugten keine Konsolenfehler.
- Die vorhandene technische Testautomatisierung ist eine gute Basis für ein späteres Launch-Gate.

## Befunde und Empfehlungen

### P0 – Beide Indexierungssperren atomar entfernen

**Evidenz:**

- `index.html` und alle 128 weiteren Seiten enthalten `<meta name="robots" content="noindex,nofollow">`.
- `vercel.json` setzt global `X-Robots-Tag: noindex, nofollow`.
- Dieser Header gilt auch für `sitemap.xml`, Bilder und PDFs.

**Auswirkung:** Wird der Cutover so ausgeführt, können Google und andere Suchsysteme den Relaunch nicht indexieren. Das ist ein harter Launch-Blocker.

**Empfehlung:** Meta-Tags, globalen Header und eventuell aktive Preview-Passwort-Middleware im selben Produktionsrelease entfernen. `robots.txt` weiterhin crawlbar halten.

**Erledigt wenn:** Öffentliche Requests auf Homepage, alle Seitentypen, Sitemap und ein Asset enthalten keinen unbeabsichtigten `noindex`-/`nofollow`-Header oder Meta-Tag; der vollständige lokale und externe Crawl bestätigt die Indexierbarkeit.

### P0 – Finale URL-Matrix mit echten Such-/Nutzungsdaten vervollständigen

Die WordPress-Sitemaps enthalten aktuell vier Child-Sitemaps:

| Sitemap | URLs |
|---|---:|
| `post-sitemap.xml` | 10 |
| `page-sitemap1.xml` | 200 |
| `page-sitemap2.xml` | 7 |
| `category-sitemap.xml` | 6 |
| **Gesamt** | **223 eindeutig** |

Abgleich mit dem Repository:

| Behandlung | Anzahl |
|---|---:|
| gleicher Pfad bleibt als neue Canonical-URL bestehen | 65 |
| permanenter Redirect aus `vercel.json` | 158 |
| formal ungemappt | 0 |
| Redirect-Ziel fehlt in neuer Sitemap | 0 |

Das ist sehr gut, beweist aber nur Sitemap-Abdeckung. WordPress-Sitemaps können historische, extern verlinkte, kampagnenbezogene oder absichtlich ausgeschlossene URLs nicht enthalten.

Der unabhängige Live-Crawl bestätigte für alle 223 Sitemap-URLs aktuell Status 200, ein passendes Canonical, kein `noindex`, mindestens einen internen Inlink und keine tote Sitemap-URL.

Vor Launch zusätzlich exportieren und in die Matrix aufnehmen:

- Search Console: Landingpages, indexierte und ausgeschlossene URLs, 404-Berichte;
- Analytics: organische Landingpages mindestens der letzten 12–16 Monate;
- Apache-/WordPress-Logs: angefragte URLs und Googlebot-Zugriffe;
- Backlinks: alle verlinkten Ziel-URLs und PDFs;
- WordPress-Medienbibliothek, Downloads und öffentlich verlinkte PDF-/Video-Assets;
- Kampagnen-, Social-, Profil- und E-Mail-Ziele;
- URL-Varianten mit HTTP, Apex-Domain, Slash, `.html`, Encoding, Groß-/Kleinschreibung und relevanten Parametern.

**Erledigt wenn:** Jede wertvolle Alt-URL besitzt eine dokumentierte Entscheidung `preserve`, `redirect`, `404/410` oder `investigate`, und jede Zeile wurde gegen den öffentlich deployten Release ohne automatisches Redirect-Following geprüft.

### P1 – Zusätzliche WordPress-Aliasse direkt abfangen

Der vollständige Live-Linkgraph enthält 31 intern verlinkte Pfade außerhalb der XML-Sitemaps: acht Kategorie-Paginierungen, acht Tag-Archive, zwei Pfade mit geschütztem Unicode-Bindestrich, historische Kurz-/Alias-URLs und fünf bereits heute tote interne Ziele.

Besonders relevante, heute von WordPress weitergeleitete Aliasse fehlen als eigene Sources in `vercel.json`:

| zusätzlicher Altpfad | heutige WordPress-Zwischenstufe | empfohlenes statisches Direktziel |
|---|---|---|
| `/cases/conlivo` | `/conlivo/` | `/case-conlivo` |
| `/cases/mdb-finance` | `/mdb-finance/` | `/case-mdb-finance` |
| `/cases/street-gourmet` | `/street-gourmet/` | `/case-street-gourmet` |
| `/me` | `/me-my-life-my-job/` | `/case-me` |
| `/solit` | `/solit-marketing/` | `/case-solit` |
| `/we-celebrate` | `/we-celebrate-streetfood/` | `/case-we-celebrate` |
| `/warum-beratung-im-markenaufbau-immer-wichtiger-wird` | `/warum-ist-beratung-im-markenaufbau-wichtig/` | `/wissen` |

Nach der WordPress-Abschaltung existiert die Zwischenstufe nicht mehr. Jeder Alias muss deshalb direkt auf das endgültige, indexierbare statische Ziel zeigen.

Zwei bestehende Regeln verwenden den geschützten Bindestrich `%e2%80%91`. Gegen Vercel sind lowercase- und uppercase-Encoding, das dekodierte Unicode-Zeichen sowie die ASCII-Bindestrichvariante separat zu testen.

### P1 – Historische Bilder und andere Assets migrationssicher behandeln

Die vier WordPress-Sitemaps referenzieren 1.066 eindeutige Bild-URLs, überwiegend unter `/wp-content/uploads/...`. Im statischen Projekt existieren weder dieser Pfad noch entsprechende Redirectregeln. Beispiele sind:

- `/wp-content/uploads/2025/09/2U9A9039-short.jpg`;
- `/wp-content/uploads/2024/12/CONCRETE-Erstgespraech.jpg`.

Beim Cutover würden diese Adressen voraussichtlich 404 liefern. Das kann Bildersuche, Bild-Backlinks, alte Social Cards und externe Einbettungen betreffen.

**Empfehlung:** Wichtige Assets anhand von Search Console, Bildsuche, Serverlogs und Backlinks priorisieren. Inhaltlich identische Dateien entweder unter dem alten Pfad weiter ausliefern oder einzeln auf das neue identische Asset umleiten. Entfernte Dateien dürfen echte 404/410 liefern. Keinesfalls alle Bilder pauschal auf Homepage oder Logo umleiten.

Der Crawl fand keine verlinkten PDF-, Office- oder ZIP-Dateien und die WordPress-Media-API meldete keine `application`-Medien. Unreferenzierte historische Downloads können trotzdem nur mit Logs/Search Console/Backlinks zuverlässig ausgeschlossen werden.

### P1 – Sammelredirects semantisch prüfen

108 der 158 Redirect-Quellen werden in 27 mehrfach verwendete Ziele konsolidiert. Beispiele sind alte Kategorien, FAQ- und Blog-Inhalte, die teilweise auf `/`, `/wissen` oder breite Leistungsseiten zeigen.

Google empfiehlt keine pauschalen Weiterleitungen irrelevanter Alt-URLs auf die Homepage, weil diese wie Soft-404s behandelt werden können. Konsolidierung ist nur dann sinnvoll, wenn das Ziel die Suchintention und den wesentlichen Inhalt tatsächlich übernimmt.

Besonders zu prüfen:

- `/category/branchen`, `/category/cases`, `/category/concrete`, `/category/faqs`, `/category/leistungen`, `/category/uncategorized` → `/`;
- alte FAQ-/Blogbeiträge → `/wissen`;
- mehrere spezialisierte Frageseiten → eine breitere Leistung oder Phase;
- Seiten mit möglichen Rankings oder Backlinks, deren Inhalt im Ziel nur teilweise enthalten ist.

Für die Kategoriearchive bestehen bessere Direktziele als `/`:

- `/category/branchen` → `/branchen`;
- `/category/cases` → `/projekte`;
- `/category/faqs` → `/wissen`;
- `/category/leistungen` → `/leistungen`;
- `/category/concrete` → `/ueber-uns`;
- `/category/uncategorized` nur weiterleiten, wenn ein tatsächlich äquivalentes Ziel existiert.

Für wertvolle Seiten gilt: Inhalt erhalten oder in ein klar äquivalentes Ziel integrieren; andernfalls lieber echter 404/410 als ein irrelevanter Redirect.

### P1 – Interne URL-, Open-Graph- und Schema-Signale vereinheitlichen

Die Canonicals und Sitemap verwenden URLs ohne `.html`. Gleichzeitig wurden 16.243 interne `.html`-Links gefunden; 128 von 129 `og:url`-Werten und die vorhandene WebPage-URL im JSON-LD verwenden ebenfalls `.html`.

Mit `cleanUrls: true` wird Vercel `.html` künftig permanent auf die extensionless URL umleiten. Dadurch erzeugt fast jeder interne Klick einen unnötigen Redirect, und Suchmaschinen erhalten widersprüchliche Signale.

**Empfehlung:**

- alle internen Links direkt auf extensionless Canonical-Pfade setzen;
- `og:url` und JSON-LD-URLs auf exakt dieselbe Canonical-URL setzen;
- XML-Sitemap, Navigation, Breadcrumbs, Share-Tags und Schema in einem Corpus-Test vergleichen;
- fehlerhaften Slug `/icons-und-llustration-sets` in `/icons-und-illustration-sets` korrigieren und permanent weiterleiten.

### P1 – Homepage-Performance und Stabilität beheben

Lighthouse 13.4.1, lokale Labmessung:

| Seite | Profil | Performance | LCP | CLS | Transfer |
|---|---|---:|---:|---:|---:|
| Homepage | Mobile | 79 | 4,3 s | 0,02 | 18,4 MB |
| Homepage | Desktop | 46 | 9,7 s | 0,697 | 25,7 MB |
| Corporate Design | Mobile | 92 | 3,2 s | – | 1,41 MB |
| Case Conlivo | Mobile | 75 | 6,7 s | – | 3,27 MB |
| Logo-Design-Antwort | Mobile | 93 | 3,1 s | – | 0,99 MB |

Die Homepage enthält 13 Hero-JPEGs und ein finales Video. Die JavaScript-Logik überspringt diese Last nur bei `prefers-reduced-motion` oder aktiviertem `saveData`, nicht aufgrund kleiner Viewports. Auch der mobile Lighthouse-Lauf lud mehrere Megabyte Hero-Medien.

**Empfehlung:**

- stabilen statischen ersten Hero-Zustand als LCP-Kandidat verwenden;
- Sequenz und Video erst nach LCP, Idle oder bewusster Interaktion laden;
- mobile und datenarme Verbindungen frühzeitig kurzschließen;
- responsive Bildgrößen sowie AVIF/WebP einsetzen;
- Intro-/Font-Geometrie reservieren, um Desktop-CLS zu verhindern;
- große Case- und Hero-Medien priorisiert komprimieren;
- unveränderliche einjährige Asset-Caches nur mit echten versionierten Dateinamen verwenden.

Feldwerte aus CrUX/Search Console fehlen; die Labwerte sind kein Nutzerfeld-Benchmark, belegen aber reale Payload- und Layoutprobleme.

### P1 – Structured Data als konsistenten Graph aufbauen

Nur `fakten-zu-concrete-brandbuilding-gmbh.html` enthält strukturierte Daten:

- `Organization` verweist auf das nicht vorhandene `/assets/concrete-ink.svg`;
- `WebPage.url` enthält `.html` und widerspricht dem Canonical;
- die Organization-Anschrift enthält nur `addressCountry: DE`;
- die Seite besitzt keinen internen eingehenden Link;
- die Homepage enthält weder `WebSite` noch `Organization`.

Empfohlenes, wahrheitsgetreues Modell:

1. Homepage: `WebSite` plus `Organization`, verbunden über stabile `@id`-Werte und ein existentes crawlbares Logo.
2. Kontaktseite: Hamburg und Frankfurt nur als `LocalBusiness`, wenn es tatsächlich besetzte, kundenrelevante Standorte sind.
3. Unterseiten: sichtbare Breadcrumbs plus spiegelndes `BreadcrumbList`.
4. Redaktionelle Wissensseiten: `Article`/`BlogPosting` nur zusammen mit echten sichtbaren Autoren-/Reviewer- und Datumsangaben.
5. Eigenständige relevante Videoseiten: `VideoObject` beziehungsweise Video-Sitemap; nicht jedes dekorative Teaser-Video markieren.
6. Keine erwarteten Rich Results für `Service`; der Typ kann semantisch sein, besitzt aber kein garantiertes Google-Feature.
7. Keine selbst kontrollierten Bewertungssterne für die eigene `Organization`/`LocalBusiness`.

Syntax mit Schema.org Validator und tatsächlich unterstützte Google-Ergebnisse separat mit Rich Results Test validieren.

### P1 – Faktenseite aus der KI-Nische in die Informationsarchitektur holen

Die Faktenseite ist in der Sitemap, aber intern verwaist. Ihre Bezeichnung „Grounding Page Standard v1.4“ ist kein offizieller Standard von Google oder OpenAI.

**Empfehlung:**

- von „Über uns“, Kontakt und relevanten Wissensseiten sinnvoll verlinken;
- als hochwertige Unternehmens-/Faktenreferenz für Menschen formulieren;
- rechtliche Identität, Standorte, Verantwortliche, Leistungsfelder und überprüfbare Quellen konsistent halten;
- kein Versprechen formulieren, dass eine spezielle „KI-Seite“ Erwähnungen garantiert.

Google erklärt, dass normale SEO-Best-Practices auch für AI Overviews/AI Mode gelten und weder spezielle AI-Dateien noch besonderes AI-Markup erforderlich sind.

### P1 – Autoren, Quellen und reale Aktualität ergänzen

Die Frage-/Antwortseiten sind strukturell gut: kurze Direktantwort, danach Erklärung. Es fehlen aber überwiegend sichtbare Autor-/Reviewer-Angaben, Veröffentlichungs-/Änderungsdaten und Quellen für materielle Behauptungen.

Für priorisierte Inhalte ergänzen:

- verantwortliche Person und fachliche Rolle;
- tatsächliches Veröffentlichungsdatum;
- `dateModified` nur bei relevanter inhaltlicher Änderung;
- Quellen für Fakten, Daten und Standards;
- eigene Beobachtungen, Methoden, Entscheidungslogik, Ergebnisse und Grenzen;
- Verbindungen zu passenden Leistungen und echten Cases.

37 Seiten haben weniger als 250 Hauptinhaltswörter, zwei weniger als 150. Das ist kein automatischer Fehler: Google kennt keine ideale Wortzahl. Diese Seiten müssen manuell auf eigenständigen Nutzen geprüft, nicht künstlich verlängert werden.

### P2 – FAQ-Akkordeons ohne veraltete FAQ-Taktik

Akkordeons können die Nutzerführung verbessern, sofern Inhalt bereits im HTML/DOM vorhanden, per Tastatur erreichbar und ohne crawler-spezifische Sonderbehandlung lesbar ist.

Kein `FAQPage`-Markup als Rich-Result-Taktik einplanen: Google hat FAQ-Rich-Results 2026 aus der Suche entfernt. `QAPage` ist nur für Seiten mit mehreren nutzergenerierten Antworten auf eine Frage geeignet. Die vorhandenen kurzen Direktantworten bleiben unabhängig davon für Nutzer, Featured Snippets und generative Systeme wertvoll.

### P2 – Accessibility und semantische Qualität

- Koralle `#fe7e5e` auf Papier `#f3efe7` erreicht nur etwa 2,19:1 Kontrast.
- Ein Footer-Link besitzt einen Accessible Name, der den sichtbaren Text nicht vollständig enthält.
- `kontakt.html` und `erstgespraech.html` springen von H1 zu H3.
- `kontakt.html` enthält zwei unsichtbare U+0002-Steuerzeichen.
- Sternbewertungen verwenden teilweise `aria-label` auf einem Element ohne geeignete Rolle.
- Autoplay-/Bewegtbild-Inhalte benötigen eine abschließende Untertitel-/Transkript- und Reduced-Motion-Prüfung.

### P2 – Sitemap und Fehlerseiten härten

- Alle 129 `lastmod`-Werte stehen pauschal auf `2026-09-10`. Google nutzt `lastmod` nur, wenn der Wert eine signifikante Änderung wahrheitsgetreu widerspiegelt.
- `changefreq` und `priority` bringen Google keinen vergleichbaren Steuerungsvorteil und dürfen keine Genauigkeit suggerieren.
- Eine eigene, hilfreiche 404-Seite fehlt. Entscheidend ist zusätzlich ein echter HTTP-Status 404.
- Die neue `robots.txt` verweist korrekt auf `/sitemap.xml`; beim Cutover muss der bisherige Rank-Math-Sitemap-Index nicht weiterbestehen, solange die neue Sitemap erreichbar und in Search Console neu eingereicht ist.
- Die bisherigen Endpunkte `/sitemap_index.xml`, `/post-sitemap.xml`, `/page-sitemap1.xml`, `/page-sitemap2.xml` und `/category-sitemap.xml` verschwinden. Sie können auslaufen; für einen kontrollierten Übergang kann der alte Index vorübergehend direkt auf die neue Sitemap umgeleitet oder als Alt-URL-Quelle überwacht werden.
- Googles früherer Sitemap-Ping-Endpunkt ist abgeschaltet und darf nicht in Launch-Skripten verwendet werden.

### P2 – Bereits heute tote interne Live-Ziele berücksichtigen

Der Live-Crawl fand fünf intern referenzierte 404-Pfade:

- `/bgfplus` → naheliegend `/case-bgf`;
- `/headlines-textkonzept` → `/headlines-und-textkonzept`;
- `/icon-illustration-sets` → nach Slug-Korrektur `/icons-und-illustration-sets`;
- `/leistungen` → wird im Relaunch eine gültige Seite;
- `/seo-und-sea` → `/seo-und-ki-search`.

Diese Fehler werden durch den Relaunch nicht neu erzeugt. Direkte Redirects sind dennoch sinnvoll, wenn Logs, Search Console oder Backlinks Nutzung beziehungsweise Wert zeigen.

### P2 – Social und Medien

- Alle 129 Seiten verwenden dasselbe Open-Graph-Bild. Für wichtige Cases, Leistungen und Wissensinhalte sind individuelle, stabile Share-Bilder sinnvoll.
- `og:locale` sowie explizite Twitter-Titel/-Descriptions fehlen; Open-Graph-Fallbacks funktionieren in vielen Clients, eine kontrollierte Social-Preview ist dennoch empfehlenswert.
- 102 Asset-Dateien sind größer als 500 KB; nicht alle werden sofort geladen, aber kritische Templates sollten gezielt budgetiert werden.

## AEO, GEO, IO und KI-Crawler

„IO“ ist kein einheitlich definierter Suchstandard. In diesem Audit bezeichnet es Information-/AI-Search-Optimierung: Inhalte und Entitäten so verfügbar, konsistent und belegbar zu machen, dass Such- und Antwortsysteme sie zuverlässig abrufen und zitieren können.

Relevante Grundsätze:

- Indexierbarkeit und normale Suchqualität bleiben die Basis für Google AI Features.
- Direktantworten sind hilfreich, aber kein Ersatz für Belege, Erfahrung und weiterführende Tiefe.
- `llms.txt` ist für Google neutral; eine fehlende Datei ist deshalb kein Defekt.
- `OAI-SearchBot` sollte für die Aufnahme in ChatGPT Search nicht blockiert werden.
- `GPTBot` für Training kann unabhängig davon erlaubt oder blockiert werden.
- `Google-Extended` betrifft bestimmte generative Nutzungen und ist von normaler Google-Suche getrennt zu entscheiden.
- Crawler-Freigabe garantiert weder Indexierung noch Zitation.

Vor Launch sollte CONCRETE diese Richtlinienentscheidung dokumentieren und die öffentliche robots.txt anschließend mit den tatsächlichen User Agents prüfen.

## Abgleich mit dem Payload-SEO-Agent-Skill

Der externe Skill war trotz seines Payload-/Next.js-Fokus als zusätzliche Checkliste nützlich. Übernommen beziehungsweise verstärkt wurden:

- serverseitig beziehungsweise im initialen HTML vorhandene Metadaten und JSON-LD;
- identische `noindex`-Logik zwischen Seiten und Sitemap;
- echte 404-Statusprüfung statt nur einer gestalteten Fehlerseite;
- Orphan-Page-, Breadcrumb- und interne Verlinkungsprüfung;
- getrennte Regeln für Production, Preview/Staging, Drafts und nichtöffentliche Bereiche;
- vollständige Redirect-Matrix, Ein-Hop-Prüfung und laufendes 404-Monitoring;
- Erhalt von Search-Console-Verifizierung und Post-Deployment-QA;
- absolute URLs und eine einheitliche URL-Basis für Canonical, Sitemap, Open Graph und JSON-LD;
- `hreflang`-/Lokalisierungsprüfung nur dann, wenn echte Sprachvarianten existieren.

Nicht übernommen oder aktualisiert wurden:

- Payload-/Next.js-spezifische Plugins, Hooks und `generateMetadata()` – dieses Projekt ist statisch;
- `FAQPage` als empfohlener Google-Rich-Result-Typ – 2026 veraltet;
- starre „Description unter 160 Zeichen“-Pass/Fail-Regel – Snippets sind query- und geräteabhängig;
- Canonical aller paginierten Seiten pauschal auf Seite 1 – jede eigenständige Pagination-URL muss kontextabhängig bewertet werden;
- der Google-Sitemap-Ping per `google.com/ping` – seit 2023 deaktiviert;
- pauschales `fallback: true` bei Übersetzungen – kann ohne echte Übersetzung Duplicate-/Sprachprobleme erzeugen.

Der daraus entstandene wiederverwendbare Skill liegt unter `docs/seo-agent/`.

## Cutover-Plan

### Spätestens einige Tage vor Launch

- [ ] Search Console, Analytics, Logs und Backlinkdaten exportieren und URL-Matrix ergänzen.
- [ ] Alle Sammelredirects nach organischem Wert und semantischer Äquivalenz freigeben.
- [ ] Google-/Bing-Verifizierung für das neue Hosting sicherstellen.
- [ ] Vercel-Domainzuordnung für `www` und Apex prüfen; HTTP und Apex möglichst in einem Hop nach `https://www...` führen.
- [ ] DNS-TTL beim Provider rechtzeitig reduzieren, sofern die Umschaltung über DNS erfolgt.
- [ ] Rollback-Verantwortliche, Entscheidungsschwellen und vorherigen Hostingzustand dokumentieren.
- [ ] Finale WordPress-Sitemaps und relevante Server-/Redirect-Konfiguration exportieren.
- [ ] 31 zusätzliche Crawl-Pfade und 1.066 WordPress-Bild-URLs klassifizieren.
- [ ] Direkte Redirects für die vorgeschalteten WordPress-Aliasse ergänzen.
- [ ] Wichtige `/wp-content/uploads/`-Assets erhalten oder einzeln äquivalent umleiten.

### Im Launch-Release

- [ ] Alle 129 Meta-`noindex`-Tags entfernen.
- [ ] Globalen `X-Robots-Tag: noindex, nofollow` entfernen.
- [ ] Preview-Passwort/Middleware von der Produktionsdomain entfernen.
- [ ] Redirects und neue Seiten atomar deployen.
- [ ] Korrigierte Canonical-/interne-/OG-/Schema-URLs deployen.
- [ ] Neue Sitemap und robots.txt deployen.
- [ ] Cache-Busting für geänderte immutable Assets sicherstellen.
- [ ] Kategoriearchive auf relevante Hubs statt pauschal auf `/` umleiten.

### Unmittelbar nach Umschaltung

- [ ] Extern Homepage und alle Template-Typen auf 200, Canonical und Indexierbarkeit prüfen.
- [ ] Alle URL-Matrixzeilen auf Quellstatus, Location und finales 200-Ziel prüfen.
- [ ] Unbekannte URL auf echten 404 prüfen.
- [ ] HTTP, HTTP-www, HTTPS-Apex, Slash- und `.html`-Varianten prüfen.
- [ ] Unicode-/Encoding-Varianten sowie relevante Querystrings prüfen.
- [ ] robots.txt und Sitemap öffentlich abrufen und parsen.
- [ ] Schema.org Validator und Google Rich Results Test auf repräsentative Seiten anwenden.
- [ ] Formulare, Calendly, Consent, Analytics, Social Links, PDFs und Conversion-Pfade testen.
- [ ] Sitemap in Google Search Console und Bing Webmaster Tools einreichen; keinen Google-Ping-Endpunkt verwenden.
- [ ] Kein Search-Console-„Change of Address“ verwenden: Domain und bevorzugter Host bleiben gleich.
- [ ] Launch in Analytics annotieren und alten Host nicht sofort abschalten.

### Monitoring nach Launch

- [ ] In der ersten Woche täglich 5xx, 404/Soft-404, Redirects, noindex, Canonicals und Sitemapstatus prüfen.
- [ ] Search Console auf Crawling-/Indexierungsfehler und ungewöhnliche Rückgänge nach Landingpage prüfen.
- [ ] Alten und neuen Server-/CDN-Traffic beobachten, bis kein relevanter Zugriff mehr auf die alte Infrastruktur geht.
- [ ] Nach verfügbarem Feldfenster Core Web Vitals für Homepage und Cases bewerten.
- [ ] Redirects mindestens ein Jahr, sinnvolle Legacy-Ziele besser dauerhaft behalten.
- [ ] Nach 1, 2, 4 und 8 Wochen Indexabdeckung, Top-Landingpages, Impressions, Klicks und Conversions gegen die Baseline vergleichen.

Normale kurzfristige Ranking-Schwankungen sind bei einer Migration möglich. Ein Rollback sollte an systemischen Serving-, Redirect-, Indexierungs-, Canonical-, Daten- oder Conversionfehlern hängen, nicht an einzelnen kurzfristigen Positionsänderungen.

## Offene Todos nach Priorität

### P0 – Launch-Blocker

- [ ] Meta-`noindex,nofollow` auf allen Produktionsseiten entfernen.
- [ ] Globalen `X-Robots-Tag`-Block in `vercel.json` entfernen.
- [ ] Search-Console-/Analytics-/Log-/Backlink-URLinventar in die Redirect-Matrix einarbeiten.
- [ ] Sämtliche 223 bekannten Alt-URLs plus zusätzliche historische URLs gegen den öffentlichen Release testen.
- [ ] Rollbackplan und Verantwortliche festlegen.

### P1 – Vor Launch dringend

- [ ] 108 konsolidierte Redirect-Quellen semantisch und nach organischem Wert prüfen.
- [ ] 31 zusätzliche intern erreichbare Live-Pfade inventarisieren und historische Aliasse direkt mappen.
- [ ] 1.066 historische Bild-URLs mit Search Console, Logs und Backlinks priorisieren; wertvolle Assets erhalten oder äquivalent umleiten.
- [ ] Kategoriearchive auf relevante Hubs statt auf die Homepage umstellen.
- [ ] Unicode-Encoding-, Slash-, Query- und Hostvarianten auf dem echten Vercel-Deployment testen.
- [ ] Alle internen `.html`-Links auf Canonical-Pfade umstellen.
- [ ] 128 abweichende `og:url`-Werte und WebPage-Schema-URL korrigieren.
- [ ] Tippfehler-Slug `icons-und-llustration-sets` korrigieren und weiterleiten.
- [ ] Homepage-Sequenz und Video aus dem kritischen Ladepfad entfernen.
- [ ] Desktop-LCP und CLS sowie mobile Payload erneut messen.
- [ ] Organization/WebSite-Schema mit existentem Logo auf der Homepage implementieren.
- [ ] Faktenseite intern verlinken und als echte Nutzer-/Faktenressource überarbeiten.
- [ ] Search Console/Bing-Verifizierung, Analytics und Consent auf neuem Hosting sicherstellen.
- [ ] Host-, HTTPS-, Slash- und Dateiendungsnormalisierung extern verifizieren.

### P2 – Kurz nach P1 beziehungsweise vor finaler Abnahme

- [ ] Breadcrumbs und `BreadcrumbList` auf geeigneten Unterseiten ergänzen.
- [ ] Autoren, Reviewer, echte Daten und Quellen für priorisierte Wissensseiten ergänzen.
- [ ] Article-/Video-Markup nur auf geeigneten, sichtbaren Inhalten ergänzen.
- [ ] LocalBusiness-Daten nur für verifizierte, besetzte Standorte implementieren.
- [ ] Individuelle Open-Graph-Bilder für wichtige Cases/Leistungen erstellen.
- [ ] Eigene 404-Seite mit echtem 404-Status erstellen.
- [ ] Sitemap-`lastmod` auf echte Änderungsdaten umstellen.
- [ ] Kontrast, Footer-Accessible-Name, Heading-Sprünge und Steuerzeichen beheben.
- [ ] Große Bilder und Videos priorisiert optimieren; Cache-Versionierung definieren.
- [ ] AI-Crawler-Richtlinie für OAI-SearchBot, GPTBot und Google-Extended dokumentieren.

### P3 – Weiterentwicklung

- [ ] Schwache/kurze Seiten nach Nutzen statt Wortzahl redaktionell prüfen.
- [ ] Topic-Cluster und Related-Content-Verlinkung ausbauen.
- [ ] Externe Profile und wichtige Backlinks auf finale Canonical-URLs aktualisieren.
- [ ] Optional IndexNow für Bing und teilnehmende Systeme integrieren.
- [ ] Wiederkehrenden SEO-Smoke-Test für Status, noindex, Canonical, Sitemap und Redirects in CI einbauen.

## Primärquellen

- Google: AI-Optimierung und AEO/GEO-Einordnung: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google: AI Features und Websites: https://developers.google.com/search/docs/appearance/ai-features
- Google: Helpful, reliable, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google: Site Moves mit URL-Änderungen: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- Google: Hostingwechsel ohne sichtbare URL-Änderung: https://developers.google.com/search/docs/crawling-indexing/site-move-no-url-changes
- Google: Redirects: https://developers.google.com/search/docs/crawling-indexing/301-redirects
- Google: Canonicals: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google: Robots-Meta und `X-Robots-Tag`: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- Google: Sitemap-Erstellung: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google: Abschaltung des Sitemap-Ping-Endpunkts: https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping
- Google: Structured-Data-Richtlinien: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Google: Search-Dokumentationsupdates: https://developers.google.com/search/updates
- Google: Organization: https://developers.google.com/search/docs/appearance/structured-data/organization
- Google: LocalBusiness: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Google: Breadcrumbs: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- Google: Site Names/WebSite: https://developers.google.com/search/docs/appearance/site-names
- Google: Article: https://developers.google.com/search/docs/appearance/structured-data/article
- Google: Video: https://developers.google.com/search/docs/appearance/structured-data/video
- Google: Review Snippets: https://developers.google.com/search/docs/appearance/structured-data/review-snippet
- OpenAI: Publisher-/Developer-FAQ und Crawler: https://help.openai.com/en/articles/12627856
- web.dev: Core Web Vitals: https://web.dev/articles/vitals
- Vercel: `cleanUrls`, Redirects und Header: https://vercel.com/docs/project-configuration/vercel-json
- IndexNow: https://www.indexnow.org/documentation
