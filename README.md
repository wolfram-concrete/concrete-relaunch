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

Die 26 Case-Videos liegen direkt unter `assets/cases/`; einige allgemeine
Teaser werden weiterhin direkt vom eigenen Vercel-CDN
`concrete-video-cdn.vercel.app` geladen (siehe `docs/VIDEO-VERANKERUNG.md`).
YouTube wird nicht eingebettet.
Die 13 dekorativen Schriften des Desktop-Intros liegen ebenfalls lokal unter
`fonts/intro/`; `fonts/intro-fonts-v1.css` wird nur oberhalb von 700 px geladen.
Die zugehörigen OFL-Lizenztexte liegen unter `fonts/intro/licenses/`.
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

Die vier im Footer geführten Awards gehören zum ergobag-Projekt. Auf
`case-ergobag.html` weist deshalb eine kompakte Banderole direkt zwischen
Projektüberblick und Herausforderung auf diese Auszeichnungen hin.
Ihr dunkler Hintergrund ist auf die äußere Containerbreite von maximal
1440 px begrenzt; die vier Logos stehen auf Desktop nebeneinander.

Im Modul „Weitere Projekte“ stehen auf allen 40 Case-Seiten Firmenname
links und die korallfarbene Kategorie rechts an den Bildkanten, ohne
Mittelpunkt. Lange Angaben können innerhalb der Karten umbrechen. Diese
Regeln liegen im Inline-CSS der Case-Seiten und gelten auch für die
wiederholten Karten des Projektbands. Stand 11.09.2026: globaler
Cache-Buster `v=160`. Die beiden Footer-Partner bleiben auf Mobile auch
unter 460 px zweispaltig; Logo, Schrift und Abstand werden dafür verkleinert.

## Netzwerk auf der Über-uns-Seite

Die Sektion `#netzwerk` zwischen Christian und Projekt-Fit ist für die
geplanten 12–13 Personen- und Firmenpartner erweiterbar. Aktuell sind Marleen
Zepp, Julia Rosenberger (Fotografin) und Kevin Eulenberg (Principal & Agentic
Engineer) sowie Stefan Trocha (Photographer & Creative) eingetragen.
Vorhandene, bestätigte Websites, E-Mail-Adressen oder Telefonnummern werden
unter der Rolle als `.network__contact` verlinkt (HTTPS, `mailto:` bzw. `tel:`).
Stefans Website ist `https://stefantrocha.com/`; für die anderen Partner
stehen Kontaktdaten noch aus. Weitere bestätigte Namen, Fachgebiete und Profil-Links
werden als Einträge in `.network__list` ergänzt; Bilder liegen in
`assets/partners/`. Für Firmenlogos zusätzlich `network__portrait--logo`
verwenden. Keine unbestätigten Rollen oder Platzhalterpartner veröffentlichen.

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
Der Coral-CTA „Projekt anfragen" verwendet auf jeder Sitemap-Seite dieselbe
Komponente mit den beiden Portraits; der technische Preflight prueft diese
Konsistenz mit.

Projektseiten haben mobil einen Hero ueber den ganzen Schirm (`100svh`,
`object-fit: cover`); der Inhalt beginnt darunter. Der Bildausschnitt wird je
Case ueber `style="--hero-pos:78% 50%"` auf der `.case-hero` gesteuert. Wo ein
Querformat-Keyvisual im Hochformat nicht funktioniert, liegt im Hero ein
`<picture>` mit `<source media="(max-width:820px)">` und einem eigenen
Mobilmotiv. Die Galerie zeigt mobil hoechstens zwei Bilder pro Zeile
(`site.js`, `maxPer`).

In der Section „Weitere Projekte" steht der CTA mobil linksbuendig unter der
Headline; die Regel haengt an `.section-heading:has(+ .case-marquee)`. Die
Beschriftung im Karussell ist zweifarbig: Markenname auf Ink, Branche im
`<i>` in Coral.

Auf der Ueber-uns-Seite laufen „Wofuer wir stehen" und „Unsere Methode"
mobil als vier vollbreite Bloecke untereinander. Die Personenmodule zeigen
zuerst das Portrait und darunter eine gleich breite Coral-Textflaeche; die
E-Mail-Adresse ist als mindestens 44 px hohes Touchziel gestaltet.

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
Ohne die Umstellung von `noindex` auf `index,follow` hat sie keine Wirkung,
siehe „Vor dem Livegang".

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

## Technischer Preflight

Der technische Gauntlet prüft alle Sitemap-Seiten auf interne Links,
Fragmentziele, lokale Ressourcen, Bilddimensionen, doppelte IDs,
Medien-Querystrings, Cache-Version, die einheitliche Award-Auszeichnung im
Footer und das verpflichtende Vorlaunch-`noindex`:

    python3 tools/technical-preflight.py

Der Footer wird zentral in `_footer.partial.html` gepflegt und anschließend
auf alle Sitemap-Seiten synchronisiert:

    python3 tools/sync-footer.py

So bleiben Navigationsspalten, Awards, Supporter/Partner und rechtliche Links
auf allen Seiten identisch. Design made in Germany wird mit einem lokal
gespeicherten SVG auf den CONCRETE-Eintrag im Agenturverzeichnis verlinkt.
Die langen Leistungs- und Branchenlisten sind initial auf die optische Höhe
der Wissen-Spalte verdichtet; „Weitere Leistungen“ beziehungsweise „Weitere
Branchen“ legen die übrigen, weiterhin im HTML vorhandenen Links ohne
verschachtelten Scrollbereich frei.
Das dynamische Sortlist Trusted Partner Badge liegt in derselben Vertrauensspalte,
wird aber erst nach Einwilligung in „Marketing & externe Inhalte“ geladen.
Änderungen an `site.css` oder `site.js` erfordern weiterhin den globalen
Cache-Buster in allen HTML-Dateien.

Messwerte, Entscheidungen und verbleibende Grenzen des Optimierungspasses vom
10.09.2026 stehen in `docs/TECHNISCHE-OPTIMIERUNG-2026-09-10.md`.

### Finaler Preflight vom 10.09.2026

Der vollständige Desktop-/Mobile-Gauntlet gegen `main` auf Commit `4796c84`
umfasste alle 129 Sitemap-Seiten bei 1440 px, 390 px und 320 px. Die daraus
entstandenen 387 Seiten-/Viewport-Prüfungen meldeten keine defekten internen
Links oder lokalen Ressourcen, keine Konsolenfehler, keine fehlenden
Alt-Attribute, keine H1-Fehler und keinen horizontal bedienbaren Überlauf.
Navigation, Mega-Menü, mobiles Untermenü, Projektfilter, Case- und
Footer-Akkordeons sowie die Consent-Zustände wurden zusätzlich interaktiv
geprüft. Beide projektspezifischen Gauntlets enden mit Exit 0.

Der Launchstatus bleibt trotzdem **GELB**, bis diese Punkte abgeschlossen und
erneut geprüft sind:

1. Die `og:url`-Angaben von 128 Unterseiten an Canonical und Sitemap angleichen
   und dort ebenfalls die Clean-URL ohne `.html` verwenden.
2. Die aktuelle visuelle Gewichtung der Erstebenen-Consent-Aktionen rechtlich
   freigeben oder die Ablehnung wieder als zur Zustimmung vergleichbare
   Schaltfläche darstellen.
3. Am Umschalttag Authentifizierung und beide `noindex`-Ebenen entfernen und
   anschließend die öffentliche Auslieferung auf der echten Domain prüfen.

Die beiden alten WordPress-Videoquellen auf `projekte.html` sind seit dem
11.09.2026 geschlossen: Nextbed lädt vom Video-CDN, das Agentur-Reel aus einer
auf 720p und 9,0 MB optimierten Repository-Datei.

Eine eigene `404.html`, zwei H1-zu-H3-Sprünge auf Kontakt und Erstgespräch,
zwei unsichtbare Steuerzeichen in `kontakt.html`, strukturierte
Organization-/Standortdaten sowie zusätzliche CSP-/Clickjacking-Header sind
keine harten Launchblocker, bleiben aber dokumentierte Qualitätsaufgaben. Der
Desktop-LCP der Startseite und der Coral-/Paper-Kontrast sind weiterhin die
bekannten, gestalterisch abhängigen Abweichungen aus dem Technikbericht.

Die lokale Arbeitskopie unter `/Users/wolfram/web-projekte/concrete-relaunch`
stand beim finalen Audit noch auf `5fb524d`. Für Abnahme und weitere Arbeit
zuerst mit `origin/main` synchronisieren; die Vercel-Revision von `4796c84`
ist erfolgreich deployed.

## Datenschutz und Consent

`consent-v3.js` ist der eigene Consent-Manager der statischen Website. Er
setzt Google Consent Mode standardmäßig auf `denied` und lädt den Container
`GTM-N8223FX` erst, wenn mindestens eine optionale Kategorie freigegeben ist.
Die Auswahl gilt 180 Tage und kann über „Cookie-Einstellungen“ im Footer
jederzeit geändert werden. Der initiale kompakte Hinweis sitzt mit sicherem
Rand in der rechten unteren Bildschirmecke; der ausführliche
Einstellungsdialog bleibt zentriert. In der ersten Ebene steht „Akzeptieren“
als Button links; „Ablehnen“ und „Einstellungen“ bleiben als direkt
erreichbare Textaktionen in der rechten Hälfte sichtbar.

- Statistik: Google Analytics 4 und Microsoft Clarity
- Marketing & externe Inhalte: Google Ads, LinkedIn Insight, Microsoft Advertising
  und das dynamische Sortlist Trusted Partner Badge
- Nicht eingesetzt: YouTube-Einbettungen

Die Kompatibilitäts-Cookie-Struktur hält die vorhandenen Borlabs-Sperrvariablen
im GTM funktionsfähig. Die nicht mehr verwendeten Alt-Tags `fb_main_tag`,
`fb_contact_tag` und `hs_main_tag` sind seit GTM-Live-Version 39 vom
11.09.2026 pausiert. Search Console ist keine Browser-Einbindung und gehört
nicht in den Banner. Calendly ist nur extern verlinkt, nicht eingebettet.

Änderungen an `consent-v3.js` erfordern wegen fehlender Medien-Querystrings
einen neuen Dateinamen und eine Aktualisierung in allen Sitemap-Seiten. Die
Implementierung, Prüffälle und noch nötigen Konto-/Vertragsprüfungen stehen in
`docs/DATENSCHUTZ-CONSENT-2026-09-10.md`.

## Lokal ansehen

    python3 -m http.server 4174

Dann `http://localhost:4174/`.

## Vor dem Livegang: noindex entfernen

**Die Seite ist vollstaendig auf `noindex` gestellt und darf so nicht live
gehen.** Das ist Absicht, solange `www.concrete-designs.de` noch die alte
WordPress-Fassung ausliefert: Zwei Fassungen derselben Inhalte im Index
wuerden sich gegenseitig schaden, und alle `rel=canonical` zeigen bereits auf
die spaetere Live-Adresse. Entfernt wird es genau in dem Moment, in dem die
Domain auf dieses Projekt zeigt, nicht frueher.

`noindex` steht an zwei Stellen, beide muessen weg:

1. Als HTTP-Header fuer die ganze Domain in `vercel.json`, der Block mit
   `X-Robots-Tag: noindex, nofollow` fuer `source: "/(.*)"`. Er erfasst auch
   Bilder, PDFs und die `sitemap.xml`.
2. Als Meta-Tag in Zeile 8 jeder Seite,
   `<meta name="robots" content="noindex,nofollow">`, aktuell in 129 Dateien.

Am Launch-Tag:

    # 1) Meta-Tag aus allen Seiten nehmen
    sed -i '' '/<meta name="robots" content="noindex,nofollow">/d' *.html
    # 2) Header-Block aus vercel.json loeschen (Eintrag mit X-Robots-Tag)
    # 3) middleware.js entfernen und PREVIEW_PASSWORD nicht mehr verwenden
    # 4) Cache-Buster erhoehen, committen, pushen
    # 5) Pruefen
    python3 tools/seo-gauntlet.py
    python3 tools/technical-preflight.py
    curl -sI https://www.concrete-designs.de/ | grep -i x-robots-tag   # darf nichts liefern

Die `robots.txt` bleibt unveraendert auf `Allow: /`. Eine Sperre dort waere
falsch, weil Suchmaschinen die Seiten crawlen muessen, um ein `noindex`
ueberhaupt zu sehen.

Danach öffentlich prüfen: Startseite und zentrale Seitentypen mit Status 200,
eine unbekannte URL mit Status 404, `robots.txt`, `sitemap.xml`, ausgewählte
alte Weiterleitungen, Canonicals, Calendly, Consent-Zustände und die
Browserkonsole. Anschließend die `sitemap.xml` in Google Search Console und
Bing Webmaster Tools einreichen beziehungsweise erneut anstoßen.

## Status

Vorlaunch, Status **GELB**. Der vollständige technische Preflight ist
abgeschlossen; die vier oben genannten Launch-Gates sind vor der
Domainumschaltung zu schließen. Weitere Entscheidungen stehen in
`docs/TECHNISCHE-OPTIMIERUNG-2026-09-10.md` und
`docs/UEBERGABE-CLAUDE-CODE.md`.
