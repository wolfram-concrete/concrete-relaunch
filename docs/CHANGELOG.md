# Changelog – CONCRETE Strukturprototyp

## 10.09.2026 (5) – Technische Optimierung: mobiler Hero

- Auf Viewports bis 700 px und bei aktiviertem Datensparmodus zeigt der
  Homepage-Hero sofort das vorhandene 40-KB-Poster. Das 13,6-MB-Hero-Video
  und die 13 nur für das Desktop-Intro benötigten Zwischenbilder werden dort
  nicht mehr angefordert.
- Desktop behält die abgenommene Intro- und Video-Choreografie. Das finale
  Video lädt erst nach der mobilen/desktop Entscheidung parallel zum Intro
  statt bereits mit dem HTML-Parsing; das Poster wird über Preconnect/Preload
  priorisiert.
- Cache-Buster für `site.js` und `site.css` auf `v=147` erhöht.

## 10.09.2026 (4) – Technische Optimierung: Bilddimensionen

- Allen 5.859 bislang unbemaßten lokalen Bildern wurden ihre intrinsischen
  `width`- und `height`-Werte hinzugefügt. Das reserviert den Platz vor dem
  Download, ohne die bestehenden CSS-Größen oder Bildausschnitte zu ändern.
- 4.859 bereits lazy-geladene Bilder tragen zusätzlich
  `decoding="async"`. Die acht externen Video-Poster wurden anhand der
  tatsächlichen CDN-Maße auf 1280 × 720 ergänzt.
- Der statische Preflight meldet damit auf 129 Seiten kein einziges Bild
  mehr ohne feste Dimensionen. Kein Cache-Buster nötig, da weder `site.css`
  noch `site.js` geändert wurden.

## 10.09.2026 (3) – Technische Optimierung: Video-Teaser

- Stumme Vorschauvideos mit `data-vteaser` werden erst 320 px vor dem
  Viewport erzeugt. Zuvor lud jede Seite alle Teaser-MP4s unmittelbar beim
  Start, auf der Homepage vier Videos mit zusammen rund 13,6 MB.
- Das vorhandene Poster bleibt beim Wechsel zum Vorschauvideo erhalten;
  `preload="metadata"` begrenzt die Vorladung. Bei `prefers-reduced-motion`
  bleibt weiterhin ausschließlich das Standbild sichtbar.
- Cache-Buster für `site.js` und `site.css` auf `v=146` erhöht.

## 10.09.2026 (2) – SEO- und GEO-Grundlagen

- **Branchenseiten tragen wieder die alten Suchbegriffe.** Title und
  Footer-Ankertext lauten „Strategie und Branding für …" beziehungsweise
  „Brand Building für anspruchsvolle B2B-Marken auf Mallorca". Die URLs
  bleiben unverändert, acht von zehn entsprechen dem alten Slug.
- **Definitionssatz je Branche** (`.geo-def`) unter dem Lead, damit
  Antwortmaschinen einen zitierbaren Satz zur Entität finden.
- **meta description auf allen 129 Seiten**, eindeutig, 60 bis 170 Zeichen.
  Die Branchenseiten übernehmen die Texte aus der WordPress-Fassung, die
  übrigen werden aus Lead, Kurzantwort oder erstem Absatz abgeleitet;
  `og:description` zieht mit.
- **rel=canonical** auf allen Seiten, passend zu `cleanUrls` ohne `.html`.
- **sitemap.xml** mit 129 URLs und **robots.txt** mit Sitemap-Verweis.
- **158 Weiterleitungen** von den alten WordPress-Adressen in `vercel.json`,
  abgeleitet aus der alten `sitemap_index.xml`. Case-Seiten, Phasen,
  Übersichten und die alten FAQ-Seiten sind thematisch zugeordnet.
- **Projektkarussell**: Mobil steht „Zu allen Projekten" linksbündig direkt
  unter der Headline statt rechts daneben, das Karussell rückt nach und die
  Section hat weniger Abstand. Die Beschriftung ist global zweifarbig, der
  Markenname auf Ink, die Branche in Coral (3042 Captions, 40 Case-Seiten).
- **me**: Mobil-Hero auf `hero-sofa.jpg` gewechselt und mit
  `--hero-pos:43% 50%` auf Björn zentriert. Jens ist damit aus dem Hero raus,
  auf zwei Shootingbildern in der Galerie aber weiterhin zu sehen.
- **Offen bis zum Livegang:** Die Seite steht vollständig auf `noindex`, als
  Header in `vercel.json` und als Meta-Tag in 129 Dateien. Beides muss in dem
  Moment entfernt werden, in dem die Domain auf dieses Projekt zeigt, sonst
  wirken Titles, Descriptions, Sitemap und Grounding Page nicht. Ablauf steht
  im README unter „Vor dem Livegang".
- **`tools/seo-gauntlet.py`** prüft Description, Canonical, Title-Länge,
  Eindeutigkeit, Sitemap, robots.txt, Redirects und Ankertexte und endet
  mit Exit 1, sobald etwas fehlt.

## 10.09.2026 – Branchenseiten, Grounding Page, Mobile-Heros, Freisteller-Rückbau

- **Zehn Branchen-Detailseiten** nach dem WordPress-Vorbild neu gebaut:
  `b2b-brands`, `consulting-it-und-finance-brands`,
  `architektur-und-immobilien-brands`, `food-und-beverage-brands`,
  `event-und-entertainment-brands`, `family-und-kids-brands`,
  `marketing-und-media-brands`, `recruiting-brands`, `startups` und
  `b2b-marken-mallorca`. Aufbau je Seite: Einblicke, Herausforderungen,
  Lösungsansatz, Beispiele aus passenden Cases, häufige Fragen, Weiterführung.
  `branchen.html` verlinkt jede Branche auf ihre Detailseite und hat einen
  neuen Abschnitt Mallorca; der Footer zeigt auf die Seiten statt auf Anker.
- **Grounding Page** `fakten-zu-concrete-brandbuilding-gmbh.html` nach dem
  Grounding Page Standard v1.4, mit Organization- und WebPage-Schema.
  Nicht in der Navigation verlinkt, im Footer-Index vorhanden.
- **Projektseiten mobil**: Der Hero füllt den Screen (`100svh`, `object-fit:
  cover`), der Inhalt beginnt darunter. Fokuspunkt je Case über
  `--hero-pos` auf der Hero-Section; wo das Keyvisual im Hochformat nicht
  funktioniert, liefert ein `<picture>` mit `media="(max-width:820px)"` ein
  eigenes Mobilmotiv (Baked, SOLIT, Street Gourmet, pause/play, GET.ON).
- **Freisteller-Rückbau**: 55 umgefärbte Mockups hatten ausgefranste
  Schattenkanten aus dem Flood-Fill und liegen wieder auf ihrem Original.
  Sauber aus echten Alphaquellen gerechnete Serien bleiben (Maleco, Klang²,
  Boneß & Euteneuer, pause/play).
- **Galerie mobil**: höchstens zwei Bilder pro Zeile, größere Zielhöhe.
- **Gründer-Kommentar** auf Projektseiten: mobil Bild oben, Text darunter;
  Gesicht höher im Bild, Betonfläche nur noch im unteren Drittel, Firma in
  eigener Zeile ohne Mittelpunkt.
- **Headlines** laufen mobil nie mehr aus dem Screen: `overflow-wrap` global
  plus weiche Trennstellen (`&shy;`) in allen langen Komposita.
- **Ziffern** in nummerierten Listen sitzen exakt auf der Oberlänge des
  Textes; der Offset ist aus den Fontmetriken hergeleitet.
- Kleinteiliges: Zitat auf den Leistungsseiten mobil im schwarzen Band
  eingerückt, schräger Pfeil in den Wissen-Listen durch den Standardpfeil
  ersetzt, `was-kostet-ein-logo-design.html` inhaltlich gefüllt,
  Footer-Link „Projekt anfragen" auf `erstgespraech.html`, Aconvia-Stylescape
  entfernt, me-Hero auf das Sofa-Motiv gewechselt.

## 09.09.2026 – 40 Case-Seiten, Situationsseiten mit Bildmotiv, Textregeln

- **20 weitere Case-Seiten** aus dem WordPress-Export (ohne Eingangsordner):
  highr, aconvia, noveltea, potatohead, be-care, me, pause-play, project-haya,
  the-moc, maleco, klang2, boness-euteneuer, good-humor, lieblings-zahnarzt,
  adsuits, mine-mina, ergobag, we-celebrate, get-on, luis-lea. Damit haben alle
  40 Projekte der Übersicht eine Case-Seite; Kacheln und Marquee verlinken alle.
  Ohne echtes Kundenzitat entfällt die Zitat-Section (Highr, me, Finaplus,
  system 360 mit Christians Stimme-Modul).
- **Bildkonvertierung**: PNGs mit Alphakanal werden mit `premultiply`
  abgeflacht (sonst graue Schattenflächen), Freisteller bekommen rundum 7 %
  Rand (Alpha-Bounding-Box). 101 Bilder neu gerechnet, 45 Freisteller neu
  gesetzt; Cologne-Comedy-Freisteller auf dem Marken-Pink.
- **Header** schaltet über hellen Heros auf Ink (`data-light` auf der
  Hero-Section, automatisch per Helligkeitsmessung gesetzt) und prüft den
  Kontrast auch nach Laden, Resize und im Sekundentakt.
- **Situationsseiten 01–05**: großflächiges Shootingmotiv unter dem Intro
  (`.situation-visual`, links bündig mit dem Grid, rechts randabfallend, Coral-
  Betonfragment oben rechts, 3200 px aus den Originalen); „Woran ihr es merkt“
  als Headline links, nummerierte Liste rechts, bündig mit der zweiten Spalte
  von „Wie wir helfen“; Section-Linien laufen nur innerhalb des Grids.
- **Text**: keine Gedankenstriche mehr als Satzzeichen (1345 Ersetzungen,
  Komma oder Punkt), Firmenname „CONCRETE – Brandbuilding GmbH“ bleibt.
  Case-h1 auf 18ch mit balanciertem Umbruch. Mega-Menü-CTA als Button.
- Kundenfotos ergänzt: SOLIT (Daniel Mensing), CA'N SORT (Jochen Lampert),
  SKNMETRICS (Daria Klein), mdb finance (Markus Wiedergrün), Conlivo (Zuschreibung
  Lennart Jörn), Digital2gether (Melanie Abel), Immofolia (nur Alexander Stade).

- **Weiße Bildhintergründe abgeschafft**: Freisteller und Mockups auf Weiß
  liegen jetzt auf Markenfarben (Case-Farbe im Wechsel mit einem 55-%-Papier-
  Ton oder gemessenen Tönen aus dem Branding). Alpha-Quellen (PNG/WebP aus dem
  WordPress-Export oder dem Drive-Archiv) werden mit `premultiply` und 7 %
  Rand auf die Farbe gelegt; weiße JPG-Mockups per Flood-Fill vom Rand
  (`-c.jpg`). Brandguide-Seiten (medium, Wackelzahn, Street Gourmet), bei
  denen die Umfärbung den Inhalt auswusch, bleiben Originale. Nachgebessert
  aus Alpha-Quellen: Maleco, Klang², Boneß & Euteneuer, Noveltea, the moc,
  Lieblings-Zahnarzt.
- **Galerien erweitert**: the moc (neun Produktfotos aus dem Shooting, vier
  kurze Videos, Archivmotive; Becher-Podest als Lead), Noveltea (Flaschen-
  Freisteller, Shooting, Styleguide-Farben), Boneß & Euteneuer (sechs weitere
  Shootingfotos, Frühlingsfest als Lead), Lieblings-Zahnarzt (Hero und Lead
  aus den 6000-px-Originalen). Klang²: Mozart-Keyvisual als Hero, damit die
  Headline nicht mehr unter dem Logo liegt. Maleco-Zitat auf hellem Blau.
- **Phasenseiten** (`phase-*.html`): Leistungspunkte verlinken auf ihre
  Detailseiten (Pfeil, ohne Seite bleibt Text), Christians Video steht als
  kleiner Teaser (`data-vteaser`) direkt unter der Liste, die eigene Video-
  Section mit Trennlinie entfällt. Referenz für alle vier Phasen.
- **Über uns**: beide Porträts im 4:5-Format, E-Mail-Links auf dem Coral-
  Kasten wechseln beim Hover auf Papier statt Coral. Mega-Menü als eine Fläche
  mit dem Header (kein Schnitt mehr an der Unterkante).
- Weitere Bildtausche auf Zuruf: be.care, Highr, pause/play, Project Haya
  (Lead), Potatohead (Sven Steffensmeier), Luis + Lea (Norbert Klotz),
  AdSuits in Originalauflösung.

- **Vier neue Leistungsseiten** nach dem Muster der bestehenden Detailseiten:
  `ki-tools-analyse-strategie.html` (Phase 01), `reinzeichnung.html` (Phase 03),
  `social-media.html` und `evaluierung-optimierung.html` (Phase 04). Verlinkt
  aus `leistungen.html`, den Phasenseiten und dem Footer-Index aller Seiten.
  Damit hat jeder Leistungspunkt eine Detailseite.
- **the moc**: Markenfilm als Hero-Video (1920 px, 1,7 MB, Poster), Reel und
  Signet aus dem Mosaik entfernt, Lead-Bild aus dem HighRes-Original (2400 px).
- **Über uns**: „Wofür wir stehen“ mit vier Bildcontainern (4:3) über den
  Texten, Motive aus dem Team-Shooting August 2024 (Drive `10_Shooting`) und
  dem Brainstorming-Foto; Projekt-Fit als Headline-Block plus zwei Spalten mit
  Video-Teaser rechts unten. Boneß & Euteneuer: Alt-Texte faktisch
  („Steuerberatungskanzlei Köln“).

- **Logoband auf der Startseite** verlinkt jede Marke, zu der eine Case-Seite
  existiert (32 von 54), in allen vier Laufzeilen. Die aria-hidden-Kopien der
  Endlosschleife bekommen `tabindex="-1"`, damit der Tab-Fokus nicht mehrfach
  durch dieselben Logos läuft.
- **Rezensionskarussell**: Porträts aus den Projekten statt Platzhaltern,
  Jochen Lampert (CA’N SORT), Daniel Mensing (dasselbe Foto wie im Case),
  Lea Ley (goodBytz), Anke Reincke (kidsbert) und Eleonora Piu (Little Big
  Pasta, auch im Zitatmodul der Case-Seite, Absender von Luca auf Eleonora
  geändert). Fokuspunkte per `object-position` gesetzt, damit die Gesichter
  im 4:3-Ausschnitt sitzen. Alle Karten tragen Person, Titel und Unternehmen;
  Lena Wilms ist HR, nicht Marketing.
- **Startseite Layout**: Der Textcontainer des Coral-Statements läuft bis
  1720 px, damit „Erst verstehen. Dann entscheiden. Dann gestalten.“ auch auf
  breiten Monitoren dreizeilig bleibt. Die feine Linie über dem Prozessvideo
  ist zurück (`.phase-layout__aside .vteaser` behält `border-top`). Die
  Abschnittsköpfe (`.section-heading`) stehen enger beieinander (1,12fr statt
  1,4fr, kleinerer Spaltenabstand).

- **Video-Teaser** bekommen einen flächenabhängigen Akzent
  (`--vt-accent`): Auf Coral-Flächen laufen Label „Video“ und Hover auf Ink
  statt Coral, das Badge auf Papier. Vorher verschwand die Schrift beim Hover
  im Grund. Alle zwölf Teaser auf neun Seiten geprüft, Kontrast dort jetzt
  7,25 statt 1,0.
- **Projektübersicht**: Suchfeld entfernt (Markup, CSS, Skript und die
  `data-search`-Attribute der 40 Kacheln), die Cluster-Filter bleiben. Die
  Eyebrow der Kacheln sitzt jetzt auf Oberlänge mit dem Markennamen
  (Versalhöhe statt Grundlinie, Versatz skaliert mit der Schriftgröße).
  ergobag steht direkt vor Klang2.
- **Kontaktformular**: Investitionsrahmen als „0 bis 5.000 €“ statt mit Komma.

- **Website-Videos live aufgenommen**: BGF+ (Navigationslauf mit echten
  Mausrad-Ereignissen, 20 s), Conlivo, medium, mdb finance und system 360 mit
  je zwei Scroll-Sequenzen; hy mit der Interviewszene aus dem Erklärfilm. Die
  älteren Website-Clips aus den Projektordnern sind bei medium und system 360
  entfernt. Videodateien hängen nicht am Cache-Buster, deshalb bekommen neue
  Fassungen einen neuen Dateinamen.
- **Galerie**: Ein Bild mit `data-feature` steht in eigener Zeile auf zwei
  Dritteln der Rasterbreite (the moc, Vertriebsbroschüre). Case-Leads mit
  `data-full` wachsen mit dem Bild statt zu beschneiden (BGF+, the moc).
- **Freisteller aus Originalquellen** statt Flutfüllung: pause/play Umschlag
  und Flyer, Poodlewohl Dosen und Hoodie. be.care steht wieder auf Weiß, weil
  die Illustrationen dafür angelegt sind.
- **Branchenseite**: sechs Teaser getauscht, Überschriften zweizeilig.
  **Footer**: Rubriken in Coral. **Header-CTA**: keine dunkle Kontur im Hover.

- **Mobil überarbeitet**: Menü mit Burger und X, Kopfleiste auf Papier mit
  invertierter Wortmarke, „Projekt anfragen“ als Coral-CTA, Unterpunkte mit
  Coral-Pfeilen und Trennlinie unter der Gruppe. Akkordeon und Mega-Menü
  animieren weich (Höhe über eine auslaufende Kurve, Einträge gestaffelt).
  „Aus der Praxis“ stapelt Headline, Bild, Copy, Links über die volle Breite;
  die Galerie läuft dort ohne Parallax, sonst blitzt beim Wechsel der Grund
  durch. BGF+ überlappt das Coral-Statement nicht mehr, das Statement füllt
  den ganzen Schirm. Situationsfelder tragen den Pfeil-Link „Situation
  ansehen“, weil auf dem Handy der Hover fehlt.
- **Social-Profile**: LinkedIn und Instagram im Footer, auf der Kontaktseite
  und im mobilen Menü, einfarbige Icons, die die Farbe ihrer Fläche annehmen.
- **Preloader** ohne auffällige Typografie im Bild: Cologne Comedy zeigt den
  Running Act in der Arena, Conlivo und Finaplus ihre Shootingfotos. Bild- und
  Videodateien hängen nicht am Cache-Buster, ausgetauschte Motive bekommen
  deshalb einen neuen Dateinamen.

Cache-Buster `site.css`/`site.js` auf `v=113`.


## 08.09.2026 – Case-Module ausgerollt, zwei neue Case-Seiten, Karussell mit Shootingfotos

### Case-Module „Die Herausforderung“ und „Ergebnis der Veränderung“

- Nach dem Nextbed-Muster auf `case-bgf`, `case-noey`, `case-wackelzahn` und
  `case-medium` ausgerollt. Texte aus dem Case-Sheet (Zeilen 11, 1, 2, 5),
  Briefing im Google Doc. Modul 1 direkt nach der Meta-Zeile, das Kundenlogo
  wandert aus der Meta-Zeile ins Modul (NOEY und medium mit breiterem Logo).
  Modul 2 vor der Galerie; bei Bestandsmarken (BGF+, medium, Cologne Comedy)
  heißt es „Was sich verändert hat“ mit den Spalten Vorher/Danach, bei
  Startups „Was entstanden ist“ mit Ausgangspunkt/Ergebnis.
- Zitat-Sektionen auf BGF+, Wackelzahn und medium auf das Nextbed-Modul
  umgestellt (Christians Porträt, Markenfarbe): BGF+ `#ec6408` (Warm Orange
  aus dem Logo), Wackelzahn `#daabea` (Lila aus der Wortmarke), medium
  `#f7cfe7` (Rosa der Logobalken). Nicht bestätigte Werte, bei Bedarf tauschen.
- Alle Zitat- und Stimme-Module tragen die Titel: Wolfram Stratmann ·
  Geschäftsführer Kreation, Christian Rosenberger · Geschäftsführer Strategie.

### Neue Case-Seiten Cologne Comedy Festival und Conlivo

- `case-cologne-comedy.html` und `case-conlivo.html` nach dem BGF+-Muster,
  Inhalte aus den WordPress-Seiten gestrafft, beide Module aus dem Sheet
  (Zeilen 17 und 8). Bilder aus dem WordPress-Export ohne Hochskalieren
  nach `assets/cases/cologne-comedy/` (23) und `assets/cases/conlivo/` (26).
  Zitatfarben: CCF Pink `#fd8199`, Conlivo Orange `#ff7b57`.
- Conlivo: Kundenzitat (Lennart Jörn) ohne Foto, es gibt keins im Export;
  Christians Stimme-Modul mit seinem Zitat von der alten Seite. Cologne
  Comedy: Zitat Daniela Mayer mit Foto aus dem Export.
- Mega-Menü (alle Seiten und `_header.partial.html`), Projekt-Marquee und
  die Kacheln in `projekte.html` verlinken jetzt die beiden Seiten statt der
  Anker in der Übersicht.

### Projekt-Marquee „Weitere Projekte“

- 20 freigestellte Teaser (`*.t.png`, `be-care`, `klang`, `me`, `poodlewohl`)
  durch Shootingfotos der Projekte ersetzt, auf 64:42 vorgeschnitten
  (`assets/cases/<slug>-shooting.jpg`, 1200 px), damit im Karussell nichts
  angeschnitten wird. System 360 zeigt die Designelemente statt des
  Bürofotos, Baked bleibt (Plakatmotiv). Nur `hy.t.png` bleibt, das ist das
  Keyvisual-Foto.
- Horizontales Wischen auf dem Trackpad (Wheel-Event mit deltaX) verschiebt
  das Band, vertikales Scrollen bleibt unberührt.

### Galerie und Layout

- Justified-Galerie: Die letzte Zeile füllt die volle Breite und darf
  höher werden. Der Platzhalter `.fill` kommt per JS nur zurück, wenn die
  Zeile dadurch mehr als 1,75-mal so hoch wie die erste würde.
- Nextbed-Galerie: elf neue Motive aus `_eingang/nextbed/` (Transporter,
  Geschäftsausstattung, Messestand, Visitenkarte, Umschläge, Mappe,
  Notizbuch, Leaflet, Bett-Rendering, Social-Phones) und zwei kurze Videos
  (Moodmoment 4:5, Website-Scroll). Rollups, Rahmen, Tablet, Messefotos,
  Instagram-Kacheln und die pt1-Animation waren schon da (CDN-Preview).
- Stimme-Modul (Wolfram auf Nextbed, Christian auf Conlivo): Foto füllt die
  Spalte und nimmt ein Drittel der Modulbreite.
- Nextbed: Strategie und Designsystem stehen nebeneinander (`.case-cols`,
  Spalten ab der Einzugskante). Eine Drei-Spalten-Variante mit Ausgangslage
  (`.case-cols--full`, `--n:3`) ist vorbereitet, Entscheidung offen.
- `_eingang/` hat jetzt Unterordner für alle Projekte (gitignored).

Cache-Buster `site.css`/`site.js` auf `v=67`.

### Nachtrag 08.09.2026, zweiter Teil

- **Ergebnis-Modul** umgebaut: Eyebrow und Headline (Größe wie die Abschnitts-h2)
  stehen über einem 1px-Ink-Rahmen, rechts daneben ein großer Coral-Pfeil; im
  Rahmen nur die Tabelle (Body-Größe, beide Spalten Ink, Köpfe Ink, keine
  Linie nach der letzten Zeile). Herausforderungs-Text und Ausgangslage in
  Body-Größe. Kundenlogo im Modul auf Spaltenbreite.
- **Attributionen** zweizeilig: Name, darunter fett Titel und Firma
  („CONCRETE – Brandbuilding GmbH“). Zitat-Attribution folgt der Textfarbe
  des Moduls (`--case-ink`), damit sie auf dunklen Flächen lesbar bleibt.
- **Projektseite**: Aufbau beim Scrollen (Wörter der Headline hinter einer
  Kante, Pfeil, Chips, Kacheln je Spalte versetzt mit Bildmaske von oben).
  Galerie-Zeilen werden per JS (dynamische Programmierung) gleich hoch gepackt,
  nur die letzte Zeile darf wachsen.
- **Karussell**: alle Kacheln zeigen Shootingfotos oder Keyvisuals
  (`assets/cases/<slug>-shooting.jpg`, 64:42), Wackelzahn-Label ohne
  „Kinderzahnarzt“.
- **Header** schaltet über hellen Hero-Motiven auf Ink, wenn die Hero-Section
  `data-light` trägt (Poodlewohl, SOLIT).
- **Galerien** der sechs bestehenden Cases aus `_eingang/` ergänzt (BGF+ 11,
  Wackelzahn 10, NOEY 2, medium 4 plus 3 Videos, Conlivo 5).
- **13 neue Case-Seiten** aus einem gemeinsamen Builder (`build_case.py`,
  Vorlage case-bgf.html, Spec-JSON je Projekt): baked, can-sort,
  digital2gether, finaplus, hy, immofolia, little-big-pasta, mdb-finance,
  poodlewohl, sknmetrics, solit, street-gourmet, system-360. Übersichtskacheln
  und Marquee auf allen 20 Case-Seiten verlinken sie. Strukturprüfung
  (`gauntlet.py`) gegen Nextbed für alle 20 Seiten grün.
- Offen aus den Agentenberichten: Finaplus-Zitat ist Agenturtext (kein echtes
  Zitat der alten Seite), Titel der hy-Zitatgeberin ist Zuschreibung, kein
  Kundenfoto bei SOLIT, D2G, Poodlewohl, Little Big Pasta, CA'N SORT,
  SKNMETRICS, mdb finance; Finaplus-Material nur klein (700–1800 px).

Cache-Buster `site.css`/`site.js` auf `v=75`.


## 07.09.2026 – Logoband mit 54 Marken, Header in Papier, Hero-Ausrichtung

### Logoband

- **31 neue Marken** ergänzt: Banijay Germany, CA'N SORT, goSchneider,
  goodBytz, IHP, Kidsbert, Mischok, PARQ energy, Poodlewohl, Potatohead
  Pictures, SpaceGenie, Street Monkeys, aconvia, be.care, Assmann (aktuelles
  Lockup BKW Engineering | Assmann von assmann.info), CONBAU Nord, Fraunhofer,
  Goldmann, Good Humor, freenet, Hapag-Lloyd, Helmholtz HIDA, I-SEC, klang2,
  Maleco, minemina, Opternus, Rieckermann, ZEISS. Luis & Lea auf die
  Querformat-Vektorversion, goSchneider auf die bearbeitete Outline-Version,
  Kidsbert auf das Lockup mit Erdmännchen und Subline umgestellt.
- **Vierte Zeile**, gegenläufig mit 104 s Umlauf. Verteilung 14/14/13/13,
  vier Kopien je Zeile; Lückenprüfung bei 390, 1440, 1878 und 2560 px.
- **Gefüllte Marken** (CA'N SORT, Potatohead, Assmann, Fraunhofer, Maleco,
  Rieckermann, ZEISS, goSchneider) sind in der SVG auf Ink/Papier umgefärbt
  und vom `brightness(0)`-Filter ausgenommen; IHP läuft als PNG in Graustufen.
- **EPS-Route**: Rieckermann lag nur als Pantone-EPS vor. Export über ein
  ExtendScript in Illustrator 2026 (`do javascript` per osascript), danach
  Umfärbung wie oben. Ghostscript ist auf dem Rechner nicht vorhanden.
- **Layout-Stabilität**: Alle Band-Bilder tragen `width`/`height`, damit die
  Bandhöhe vor dem Laden feststeht.

### Header und Mega-Menü

- Träger beim Hochscrollen wieder **Papier statt Coral**, transluzent
  (`rgba(243,239,231,.72)`) mit `blur(18px)`. Mega-Menü in derselben Fläche.
- **Blur im Mega-Menü repariert**: Ein Backdrop-Filter auf dem Header bildete
  einen Backdrop-Root, dadurch konnte das Menü die Seite dahinter nicht mehr
  weichzeichnen. Bei offenem Menü trägt jetzt ein `::before` den Header-Blur.
- **Hover-Öffnen** setzte die Klasse `mega-open` nicht (nur der Klick tat
  das). `syncMega()` läuft jetzt auch in `openIt`/`closeIt`.
- Hover-Farben im Menü von Papier auf Coral, sonst wären sie auf der
  Papierfläche unsichtbar.

### Statement-Pin

- ScrollTrigger misst die Pin-Positionen nach `load`, nach `fonts.ready` und
  nachdem alle Band-Bilder geladen sind neu. Grund: Späte Layout-Änderungen
  oberhalb ließen den Coral-Block zu früh einrasten und über die BGF+-Section
  scrollen.

### Vier neue Leistungsseiten, Home-Liste bereinigt

- `kommunikationsstrategie.html` und `kampagnenentwicklung.html` aus den
  WordPress-Seiten übernommen und gestrafft; beide waren auf WordPress
  nicht in der Leistungsübersicht verlinkt und deshalb durchgerutscht.
- `bildwelten-artworks-visual-looks.html` und
  `kampagnen-design-key-visuals.html` neu getextet im Muster der anderen
  Leistungsseiten (Was / Warum / Wie wir arbeiten / Was ihr bekommt / FAQ /
  Zitat / Einordnung).
- Home-Kompetenzen: alle Punkte verlinken jetzt eine Zielseite. „Digitale
  Anwendungen“ und „Content und Aktivierung“ entfernt, Social Listening
  ergänzt. Leistungsübersicht (Definieren/Umsetzen) und Footer auf allen
  Seiten um die vier Leistungen erweitert.

### Case-Seite BGF+

- Neue Seite `case-bgf.html` nach dem Muster von `case-medium.html`, Inhalte
  aus der alten WordPress-Seite gestrafft (Ausgangslage, „+“ als
  strategisches Symbol, Designsystem mit PP Mori/Playfair und Off-White/Warm
  Orange/Schwarz, Website bgf-plus.de), acht neue Bilder aus dem
  WordPress-Export unter `assets/cases/bgf/`. „Zum Projekt“ auf der Home,
  die Mega-Menü-Kachel und die Kachel in der Übersicht führen jetzt dorthin.

### Startseite, zweiter Durchgang

- Arbeitsweise: Phasen 01 bis 04 untereinander in einer breiten Spalte,
  das Prozess-Video daneben bleibt beim Scrollen stehen (sticky), der
  Markenpfeil sitzt unter der Headline. Der freistehende Pfeil-Trenner
  darunter entfällt.
- „Aus der Praxis“ läuft als Endlos-Typo von links nach rechts.
- Kompetenz-Section liegt auf einem coralfarbenen Träger mit Betonstruktur,
  rechts eingerückt wie der Statement-Block; Farben der Listen auf Ink.
- Section „Zusammenarbeit / Direkt mit den Entscheidern“ entfernt.
- „Wer sitzt mit am Tisch?“ als zweispaltige Section-Heading mit Arame-
  Headline und Pfeil, Video und Link rechts.
- Nextbed-Proof zeigt das Bett-von-oben-Motiv aus dem Peopleshoot 2025.
- Hero-CTA und Seiten-CTAs führen auf die Erstgespräch-Seite.

### Projektseite

- Fünf Kacheln zeigen jetzt Shooting-Fotos statt Freisteller-Teaser
  (`assets/cases/*-shooting.jpg`, 1600 px, aus dem Drive): Boneß &
  Euteneuer (beide Geschäftsführer auf Gartenliegen mit Buch,
  `boness_euteneuer105.jpg` aus „Projekte Concrete/BEH plus“ – der
  ARCHIV-Ordner enthält keine Fotos mehr), AdSuits (Team-Szene aus dem
  Büroshooting, High-res-Fassung), Mine Mina (Modelshoot Frühjahr 2022,
  Loft mit Cognac-Tasche), we:celebrate (Gäste am Foodtruck aus
  „5_Website/CASES/we celebrate“), Luis + Lea (Sitzkreis mit Kindern aus
  den Shooting-Highlights).
- Mega-Menü „Projekte“: Kacheln zeigen das Hero-Motiv der jeweiligen
  Case-Seite. BGF+, Cologne Comedy und Conlivo haben noch keine Case-Seite
  und springen per Anker auf ihre Kachel in der Übersicht. Die
  Wackelzahn-Kachel in der Übersicht verlinkt jetzt ihre Case-Seite.
- Kachelraster mit rund 50 % mehr Luft: Spaltenabstand `clamp(21px,2.7vw,42px)`
  statt `clamp(14px,1.8vw,28px)`, Abstand unter jeder Kachel
  `clamp(36px,4.5vw,72px)` statt `clamp(24px,3vw,48px)`. Die feine Linie
  unter der Filterleiste ist entfernt.
- Nextbed-Kachel im Mega-Menü „Projekte“ zeigt den Transporter, der ohne
  Anschnitt in 4:3 passt.

### Hero-Video

- Das Würfel-Video lief mit 2,4 Mbit/s (CRF 25) und wirkte weich. Neu vom
  34-Mbit/s-Master encodiert: `hero-2.webm` (VP9, CRF 32, 13,6 MB) zuerst,
  `hero-2.mp4` (H.264, CRF 23, 19 MB) als Fallback. Der Master liegt nur in
  1920×1076 vor, eine höhere Auflösung gibt es nicht. Neue Dateinamen, weil
  das CDN ein Jahr immutable cacht; CDN-Header decken jetzt auch `.webm` ab.
- Der dunkle Verlauf (`hero__scrim`) endet jetzt bei 60 % Höhe und ist oben
  transparent; unten bleibt er für die Lesbarkeit der Headline.

### Startseite

- Hero auf breiten Screens: Body-Text und CTA bündig mit dem Logo
  (Container-Kante). H1 und Pfeil rücken nur einen Teil des freien Randes
  nach außen (`--hero-out`, maximal 240 px), auf 1440 px und darunter
  unverändert.
- Situationsliste: Jeder Beschreibungstext beginnt mit dem Angebotsbegriff in
  Fett und Papierfarbe (Repositionierung und Rebranding, B2B/Technologie/
  Beratung, Geschäftsfeld/Angebot/Produktmarke, Marke muss Entwicklung
  mittragen, Finance/Versicherung/Healthcare).
- Mega-Menü: Nummern 01 bis 05 in Coral.
- Situation 05 („Unser Markt lebt von Vertrauen.“) hat jetzt wie die anderen
  vier einen Beschreibungstext. Die fünf Punkte entsprechen eins zu eins dem
  Mega-Menü „Wo wir helfen können“; dort stehen Kategorie-Labels, auf der
  Home Aussagen in der Ich-Perspektive.

Cache-Buster `site.css`/`site.js` auf `v=31`.


## 04.09.2026 – Claude-Design-Export als zweite Struktur unter `website/`

Der in Claude Design gebaute Relaunch (80 Seiten, Magazin-Look) liegt jetzt
neben dem WordPress-Export im Repository, ohne den Bestand anzufassen.
Details, Änderungen gegenüber dem Export und Prüfstand: `website/README.md`.
Der Prototyp unter `konzept/` bleibt als Konzeptionsstand erhalten.


## 30.08.2026 – Footer als vollständiger Seitenindex

Auftrag: den Footer nach dem Webflow-Muster „footer-1“ mit allen SEO-Unter­seiten
aufbauen, im Footer nur die Wortmarke ohne den Zusatz „Brandbuilding“.

### Neu

- **Vier Linkspalten mit 54 echten Zielen** – Leistungen (21), Branchen (10),
  Wissen (11), Agentur (12). Die Routen stammen aus der URL-Matrix, nicht aus
  einer Wunschliste; alle 60 Footer-Links wurden gegen den laufenden Server
  geprüft und lösen mit 200 auf.
- **Aufklappbar erst unterhalb 760 px.** Umgesetzt mit `<details>`/`<summary>`,
  also ohne eigene ARIA-Konstruktion: Tastaturbedienung und Screenreader-
  Semantik kommen vom Browser. Am Desktop stehen die Spalten offen, das Label
  ist dort per `tabindex="-1"` aus der Tabfolge genommen und der Klick wird
  abgefangen — ein Label, das nichts tut, soll auch keinen Fokus fangen.
  Ohne JavaScript bleibt alles offen. Plus/Minus über zwei CSS-Striche.
- **Laufendes Logoband** mit neun Kundenlogos (`konzept/assets/clients/`,
  zusammen 55 KB WebP). Einfärbung über `brightness(0) invert(1)`.
  Bei `prefers-reduced-motion` steht das Band still.
- **Rechtszeile** mit Wortmarke, Kontakt/Impressum/Datenschutz und Copyright.

### Entscheidungen und Korrekturen

- **Wortmarke ohne „Brandbuilding“** im Footer (`concrete-paper.svg`, aus dem
  Bestand übernommen). Der Header behält weiterhin das vollständige Logo.
- **Die 97 FAQ-Seiten stehen nicht einzeln im Footer**, sondern über einen
  Sammel-Link auf `/faqs/`. Die URL-Matrix empfiehlt, 210 Seiten zu
  konsolidieren — fast alle davon FAQs, mit maximal 2 Klicks pro Seite. Sie
  jetzt vollzählig zu verlinken würde genau diese Empfehlung unterlaufen.
- **Drei Kundenlogos entfernt.** Gemessene Alphadeckung: CanSort 66 %,
  Potatohead 65 % — Logos mit gefüllter Hintergrundfläche werden durch die
  Einfärbung zum weißen Klotz. Street Gourmet fiel als zu schwache
  Badge-Form heraus.
- **Displaygröße korrigiert:** `--fs-display` von 52 px auf 44 px Untergrenze.
  Bei 390 px Viewport stehen dem Satz 342 px zur Verfügung, „BRANDBUILDING“
  misst in Arame Bold bei 46 px bereits 332 px — bei 52 px brach das Wort
  mitten im Buchstaben um.
- **Konzeptleiste erscheint nur noch mit `?konzept=1`.** Sie lag als
  schwebender Kasten über den Footer-Links.
- Der Versuch, alle „Alle …“-Links auf eine gemeinsame Grundlinie zu ziehen,
  wurde zurückgenommen: der Inhalt eines `<details>` liegt in aktuellen
  Engines in `::details-content` und ist damit kein direktes Flexkind. Ein
  Pseudoelement-Hack ohne Safari-Rückhalt war den Gewinn nicht wert.

### Geprüft

16 Seitenansichten (1440×1000 und 390×844), keine Überläufe, keine toten
internen Links. Tastatur: Label am Desktop nicht fokussierbar, im schmalen
Raster mit Enter bedienbar. Klick auf ein Label am Desktop schließt die
Spalte nicht.


## 29.08.2026 – Versuch: Referenz André Cândido, Schrifttausch, Case-Wand

Auftrag: den Ansatz challengen. Referenz analysiert, Hauptschrift getauscht,
Aufbau geändert, damit die Startseite deutlich mehr Cases zeigt.

### Referenz geprüft

Die Seite wurde live gegengelesen, nicht nur das Dokument. Die Tokens im
MD-File stimmen: H1 in Editorial New bei **160 px, Schnitt 200**, Body PP Mori
400, Radien 80 / 24 / 8 / 50 / 800 px.

**Das Dokument verfehlt aber die Dramaturgie**, und die ist der eigentliche
Punkt: Auf einen stillen Papierhero folgt unmittelbar eine vollflächige,
dichte Arbeitsfläche mit Dutzenden Kacheln. Erst danach kommt das aufgeräumte
Raster mit benannten Projekten. Dieser Kontrast trägt die Seite.

### Geändert

- **Hauptschrift getauscht.** Display und H2 laufen jetzt in **Bodoni Moda**
  (OFL, selbst gehostet, Latin-Subset 26 KB). Editorial New ist nicht
  lizenzierbar; Bodoni Moda kommt im Charakter am nächsten. Roc Grotesk bleibt
  für Fließtext und Navigation.
- **Hero ist wieder rein typografisch auf Papier.** Das Case-Reel im Hero ist
  entfallen — über einem Foto gehen die Haarlinien der Didone verloren.
- **Neue Case-Wand direkt unter dem Hero:** 18 Projekte quer durch alle
  Branchencluster, von BGF+ und NOEY über Street Gourmet und Cologne Comedy
  bis Klang² und Poodlewohl.
- Typo-Skala auf fünf Stufen: 124 / 54 / 24 / 18 / 13 px. Serif ab der
  H2-Ebene, Groteske darunter — die Referenz setzt die Serif ausdrücklich erst
  ab 48 px ein.
- Kleintext getrackt mit 0,107 em wie in der Referenz.

### Performance

Die 18 Motive wogen als Originale **5,09 MB**. Nach Konvertierung auf WebP bei
640 px Breite sind es **0,52 MB — 90 Prozent gespart.** Die Originale bleiben
unangetastet, die konvertierten Kacheln liegen unter `assets/cases/`.

### Bewusst nicht übernommen

- **Die Radien der Referenz** (80 / 24 / 8 / 800 px). Die Rundung der
  Handlungsflächen bleibt bei der Regel aus dem eigenen Logo (0,236 zur kurzen
  Achse). Der eigene Ursprung schlägt die fremde Referenz.
- **Der gelbe Akzent.** Koralle bleibt die Akzentfarbe, weiterhin nur für
  Interaktion.

### Zu entscheiden

- **Der Schrifttausch löst die Website typografisch vom gedruckten Magazin.**
  Arame trägt dort die gesamte Display-Ebene. In einem Schritt umkehrbar.

### Geprüft

- 16 Seitenansichten, 0 Überläufe, 0 Konsolenfehler, 0 defekte Links;
- fünf Schriftgrößen, Radien weiterhin nur an Aktionen.

## 29.08.2026 – Rahmenlinien, Bestandspfeile, Rundung aus dem Logo

### Entfernt

- **Rahmende Linien oben und links** an Kompetenzraster, Magazinraster und
  Situationsliste. Sie lasen sich wie ein Darstellungsfehler statt wie
  Struktur. Die Linien **zwischen** den Elementen bleiben — sie trennen,
  statt zu umranden. Zusätzlich entfällt die Linie hinter der letzten
  Situationszeile.

### Geändert

- **Pfeile aus dem ursprünglichen Website-Styling.** Die typografischen
  Zeichen → und ↗ sind an 29 Stellen durch die Pfeilform aus
  `Concrete-next.svg` ersetzt. Als CSS-Maske eingesetzt, damit sie die
  Textfarbe übernimmt und in jedem Zustand mitgeht. Externe Ziele nutzen
  denselben Pfeil, nach schräg oben gedreht. Der Pfeil im Fließtext
  („Ausgangslage → Entscheidung → Veränderung") bleibt ein Textzeichen.

- **Rundung der Handlungsflächen aus dem eigenen Logo abgeleitet.**
  Gemessen am O in Arame Bold: 144 × 196 px mit 34 px Eckradius, in beiden
  Achsen gleich. Um 90 Grad gekippt wird daraus 196 × 144 — der Radius
  verhält sich damit wie **0,236 zur kurzen Achse**. Bei 48 px hohen CTAs
  ergibt das 11,3 px. Als Token `--radius-cta` hinterlegt.

  Das ersetzt die 999-px-Pillen aus dem Referenzdokument. Der Wert stammt
  jetzt aus der eigenen Marke statt aus einer fremden Referenz.

### Geprüft

- 16 Seitenansichten, 0 Überläufe, 0 Konsolenfehler, 0 defekte Links;
- Randprüfung im DOM: nur noch Schaltflächen und Zwischenlinien tragen Kanten;
- weiterhin genau vier Schriftgrößen; Radien ausschließlich an Aktionen
  (11,3 px an CTAs, 13,2 px an der Abspielmarke — dieselbe Regel).

## 29.08.2026 – Echte Inhalte auf der Startseite

Anlass: Auf Konzepttexten lässt sich kein UI beurteilen. Die Startseite trägt
jetzt weitgehend die tatsächlichen Inhalte statt Beschreibungen des Konzepts.

### Geändert

- **Zusammenarbeit** und **Über uns** nutzen die echte Copy der Bestandsseite
  („kurze Wege, klare Verantwortungen, keine Übergaben in die zweite Reihe";
  „Echtes Handwerk aus Hamburg und Frankfurt – seit über 20 Jahren").
- **Magazin-Modul** zeigt die reale Ausgabe N°01 mit den tatsächlichen
  Artikelzeilen vom Umschlag: „Was ist eigentlich Brandbuilding?", „Warum
  Brandbuilding im B2B anders funktioniert", „Gutes Design ist keine
  Geschmacksfrage", „Wenn richtige Werte falsch ankommen".
- **Videomodul ist jetzt sichtbar** — Standbild aus dem CONCRETE-Imagefilm mit
  Abspielmarke und Verweis auf den YouTube-Kanal.
- Konzeptkommentar aus den sichtbaren Texten entfernt (Kernleistungen,
  Magazin, Videos). Es steht kein Text mehr auf der Seite, der die Seite
  erklärt statt zu wirken.

### Entschieden

- **Der Agentur-Reel wird nicht eingebettet: 23 MB.** Auch der Imagefilm
  bleibt draußen (11 MB). Beides verstößt gegen die Medienvorgabe aus
  `06-relaunch-blueprint`. Gezeigt wird ein 36 KB großes Standbild aus dem
  eigenen Film mit Abspielmarke.

### Behoben

- `.editorial-card h3` war im Prototyp auf 12ch begrenzt — bei Fließtextgröße
  132 px, die Überschrift brach auf sechs Zeilen.

### Noch nicht verbindlich

- **Die Auswahl der drei kuratierten Cases.** Sichtbar sind Conlivo, NextBed
  und medium/BGF+; die Bestandsseite zeigt SOLIT, Baked, BGF+ und NextBed.
  Welche sechs bis acht Projekte die Positionierung tragen, ist eine
  redaktionelle Entscheidung.
- **Zahl und Benennung der vier Hilfesituationen.** Ohne Entsprechung auf der
  Bestandsseite, weiterhin Konzeptvorschlag.
- **Die Leistungslisten** unter Strategie / Branding / Websites sind knapper
  als die Bestandstexte zu „Wir & Marken".

### Geprüft

- 16 Seitenansichten, 0 Überläufe, 0 Konsolenfehler, 0 defekte Links;
- weiterhin genau vier Schriftgrößen, Radien nur an Aktionen.

## 28.08.2026 – Hero mit Case-Reel, Referenz „Dash Digital Studio" übertragen

### Geändert

- **Hero zeigt jetzt ein vollflächiges Reel aus fünf Cases** — BGF+, NextBed,
  Baked, SOLIT und medium Architekten. Überblendung alle sechs Sekunden,
  30-Sekunden-Zyklus, reine CSS-Animation ohne JavaScript.
- **Eyebrow „CONCRETE Brandbuilding" entfernt.** Die Referenz fordert für
  Display-Überschriften ausdrücklich „no subheading, no eyebrow above".
- **Die drei Quick-Links Strategie / Branding / Websites im Hero entfernt**,
  ebenso die Leistungsbahn darunter.
- **Display-Behandlung nach Referenz:** Zeilenhöhe 0,85 und Laufweite
  −0,035 em auf Displaygrößen. Das lässt die Type architektonisch wirken
  statt werblich.
- **Pillen ausschließlich für Aktionen** (999 px), alles andere bleibt bei
  0 px. Der Kontrast zwischen der harten Bildkante und der Pille ist das
  Signal.
- Sektionsabstände auf den Referenzbereich 80–120 px gebracht.

### Bewusst nicht übernommen

- **Die Achromatik.** Die Referenz fordert null Farbe („the 0% colorfulness
  is the brand"). Das widerspricht der Festlegung, dass die CONCRETE-Farben
  bleiben. Übernommen wurde die Farb*disziplin*: Koralle nur als Interaktion.
- **Founders Grotesk.** Übernommen wurden die Proportionen, nicht die Schrift.

### Zu prüfen

- Das Entfernen der drei Quick-Links widerspricht der Entscheidung aus dem
  Termin mit Christian vom 27.08.2026: „Strategie, Branding und Websites
  müssen im ersten Homepage-Bildschirm erkennbar sein." Auf ausdrücklichen
  Wunsch umgesetzt. Die drei Begriffe bleiben als Kompetenzabschnitt weiter
  unten auf der Seite.
- Das Reel wiegt rund 900 KB. Nach AVIF/WebP-Konvertierung wären es etwa 350 KB.
  Bei `prefers-reduced-motion` werden die vier nicht sichtbaren Motive derzeit
  trotzdem geladen — mit reinem CSS nicht vermeidbar.

### Geprüft

- 16 Seitenansichten, 0 Überläufe, 0 Konsolenfehler, 0 defekte Links;
- fünf Motive geladen, gestaffelte Überblendung mit 0/6/12/18/24 s;
- `prefers-reduced-motion`: Animation aus, nur das erste Motiv sichtbar;
- weiterhin genau vier Schriftgrößen, Radien nur an Aktionen.

## 28.08.2026 – Aufräumen: vier Schriftgrößen, kein Farbakzent in Überschriften

Grundlage: Recherche über den Refero-MCP an drei Referenzen mit vergleichbarer
Haltung — Koto (Markenagentur), Look inc (Editorial-Agentur), Adopt (Agentur
auf Pergament). Alle drei konvergieren auf dieselben Prinzipien.

### Gemessen

- Vorher rendeten auf der Startseite **elf** verschiedene Schriftgrößen
  (158 / 95 / 72 / 52 / 43 / 32 / 24 / 18 / 16 / 14 / 13 px). Ursache: zwei
  Stylesheets, die nie aufeinander abgestimmt wurden.
- Jetzt sind es **vier**: 88 / 32 / 18 / 13 px. Die Referenzen arbeiten mit
  drei bis vier.

### Geändert

- **Typo-Skala auf vier Stufen.** Display erscheint bewusst genau zweimal pro
  Seite: als H1 und als Schlusszeile im Footer.
- **Keine eingefärbten Überschriften mehr.** Koralle hat jetzt genau eine
  Rolle: Interaktion (Hover, Fokus, aktiver Navigationspunkt). Alle drei
  Referenzen halten den Akzent aus der Typohierarchie heraus.
- **Navigation ohne Versalien und weite Laufweite**, CTA im Header als
  Haarlinie statt gefüllter Fläche. Die einzige gefüllte Fläche der Seite ist
  die primäre Handlungsaufforderung im Inhalt.
- **Module ohne Kästen.** Projektkarten haben keinen Rahmen und keine
  Oberlinie mehr, Bilder sind offene Blöcke. Kompetenzfelder ohne Rahmen und
  Mindesthöhe, Trennung nur über Raum.
- **Keine Schatten, keine Radien** mehr auf der Seite — verifiziert.
- Kartenüberschriften nutzen Fließtextgröße in der Displayschrift. Damit
  entsteht Hierarchie zur Sektionsüberschrift, ohne eine fünfte Größe.
- Zwei schwache Projektmotive (Präsentationsfolien) gegen dokumentarische
  Fotografie getauscht.

### Behoben

- **Sprungziele lagen unter dem klebenden Header.** Ankerlinks wie
  `/leistungen/#strategie` zeigten die angesteuerte Überschrift verdeckt.
  `scroll-margin-top` ergänzt.

### Unverändert

Schriften, Farben, sämtliche Inhalte und der komplette Seitenaufbau.

### Geprüft

- 16 Seitenansichten, acht Routen auf Desktop 1440 × 1000 und Mobile 390 × 844;
- 0 Überläufe, 0 Konsolenfehler, 0 defekte Bilder oder Links;
- genau vier Schriftgrößen, null Radien, null Schatten.

### Offen

- Motion. Bewusst nachgelagert, siehe README.

## 28.08.2026 – Designsystem: Proportionen, Weißraum, Betonfläche

### Geändert

- **Typo-Skala auf eine Regel gebracht.** Faktor 1,333 zwischen allen
  Textstufen, Sprung 2,25 auf die Display-Ebene. Die bisherigen Verhältnisse
  (1,42 / 1,75 / 1,32 / 1,47 / 1,31) waren gewachsen, nicht gesetzt.
- **Raum auf ein 8er-Raster gebracht**, Seitenrhythmus auf drei Werte reduziert
  (eng / normal / weit) und insgesamt großzügiger gefasst.
- **Hero ist jetzt typografiegeführt und bildlos.** Die große Korallfläche ist
  entfallen; Koralle wirkt nur noch als Akzent auf einer Headline-Zeile.
- **Betonfläche aus dem Originalauftritt aufgenommen** – als neue
  Pause-Section in der Seitenmitte, mit dem redaktionellen Kern des Magazins
  als Aussage darüber.
- Navigation in Versalien und Roc Grotesk, Header auf 72 px.

### Aufgelöst

- Die Vergleichsfassungen A, B und Hybrid und der zugehörige Umschalter. Es
  gibt einen Designstand, kein `?ui=`-Parameter mehr.

### Entschieden

- Der Beton-Clip bleibt aus dem ersten Bildschirm: 11 MB verstoßen gegen die
  Medienvorgabe aus `06-relaunch-blueprint`. Das Standbild wiegt 36 KB und
  zeigt dasselbe Motiv. Ein komprimierter Loop gehört in den Motion-Pass.

### Behoben

- Die Bildprüfung der QA meldete `loading="lazy"`-Motive unterhalb des Folds
  fälschlich als defekt. Sie lädt Bilder jetzt erzwungen, bevor sie prüft.

### Geprüft

- 16 Seitenansichten, acht Routen auf Desktop 1440 × 1000 und Mobile 390 × 844;
- 0 Überläufe, 0 Konsolenfehler, 0 defekte Bilder oder Links, genau eine H1;
- 40 Projekte, acht Branchenfilter, ein Treffer für „NOEY“.

### Offen

- Die Sections unterhalb des Heros sind noch der Strukturprototyp mit neuen
  Tokens, nicht ausgestaltet.
- Die sechs weiteren Seitentypen folgen erst, wenn die Homepage steht.

## 28.08.2026 – Richtungsentscheidung: Hybrid

### Entschieden

- **UI-Richtung: Hybrid** – der bildgeführte Hero aus B auf dem disziplinierten
  System aus A. Aufruf `?ui=h`. A und B bleiben zum Vergleich erhalten.
- **Headline und Subline bleiben vorerst unverändert** („Marken für Unternehmen
  in Bewegung.“). Der Blueprint-Nordstern wurde geprüft und nicht übernommen.
- **Hero-Motiv: Projektbild statt Teamfoto** – dokumentarische Aufnahme aus dem
  medium-Architekten-Case mit sichtbarem Markenzeichen. Beweist gestalterische
  Arbeit im ersten Bildschirm statt Agenturselbstbild.
- **Nächster Arbeitsschritt: URL-Entscheidungsmatrix**, nicht die Übertragung
  auf die weiteren Seitentypen.

### Geändert

- `ui-directions.css` neu strukturiert: Hero-Regeln und System-Regeln sind
  getrennt, damit der Hybrid B-Hero und A-System sauber kombiniert;
- Hero-Motiv erhält ein definiertes Seitenverhältnis (4:5 Desktop, 4:3 Mobile).
  Ohne das bestimmte das hochformatige Bild die Höhe des Heros und schob die
  Kernleistungsbahn unter den ersten Bildschirm.

### Geprüft

- 64 Seitenansichten: acht Routen × vier Zustände (Aktuell/A/B/Hybrid) ×
  Desktop 1440 × 1000 und Mobile 390 × 844;
- 0 Überläufe, 0 Konsolenfehler, 0 defekte Bilder oder Links, genau eine H1;
- 19 Interaktionstests bestanden; `prefers-reduced-motion` unverändert korrekt;
- Trennung verifiziert: A zeigt Projektstreifen ohne Bildhero, B zeigt Mosaik
  und Anschnitt ohne Section-Ziffern, Hybrid zeigt B-Hero mit A-Section-Ziffern.

## 28.08.2026 – UI/UX-Pass A: globaler Rahmen und zwei UI-Richtungen

### Hinzugefügt

- `assets/ui-directions.css` mit gemeinsamer Token-Grundlage und zwei
  vergleichbaren Richtungen, aufrufbar über `?ui=a` und `?ui=b`;
- **Variante A „Editorial Grid“** – reduziert und typografiegeführt: Kernleistungen
  als gerahmte Felder über die volle Breite, Projektstreifen mit drei Motiven im
  ersten Bildschirm, laufende Section-Ziffern als Übergangsmittel;
- **Variante B „Magazin-Raum“** – bildgeführt: Korallfeld mit dokumentarischer
  Fotografie im Split, Headline mit Farbwechsel auf der letzten Zeile,
  Kernleistungen als volle Bahn, asymmetrisches Mosaik im Projektbeweis;
- lizenzierte Schriftschnitte **Arame Regular/Bold** und **Roc Grotesk
  Regular/Bold** unter `assets/fonts/` (69 KB gesamt);
- echte Disclosure-Mechanik für „Wo wir helfen können“ auf allen acht Seiten:
  Klick, Enter, Escape, Klick nach außen, `aria-expanded`;
- Unterebene in der mobilen Navigation als Akkordeon – vorher existierte sie
  dort überhaupt nicht;
- Prototyp-Kontrollleiste zum Umschalten von Konzepthinweisen und UI-Richtung.

### Geändert

- Konzepthinweise (Leiste, Notizen, Reihenfolgeschalter) sind **standardmäßig
  ausgeblendet** und über die Kontrollleiste oder `?konzept=1` zuschaltbar;
- Homepage-Reihenfolge **Projekte zuerst** ist der Standard; „Wo wir helfen
  können zuerst“ bleibt über `?variante=szenarien` vergleichbar;
- Mega-Menü öffnet nicht mehr per Hover. Hover öffnete das Panel und der
  unmittelbar folgende Klick schloss es sofort wieder;
- warme Magazin-Palette statt dreier fast identischer kühler Grautöne;
- Navigation in Roc Grotesk statt Arame, Headerhöhe von 86 auf 68 px;
- Projektmotive im Hero-Streifen von Präsentationsfolien auf dokumentarische
  Fotografie getauscht.

### Behoben

- **Fake-Bold beseitigt.** `font-weight: 400 700` verwies auf eine statische
  Einzelschnitt-Datei; jedes `<strong>` wurde vom Browser synthetisiert.
  Geprüft durch Auslesen der WOFF2-Tabellenverzeichnisse: kein `fvar`.
- **Unkontrollierte Überschriftenumbrüche.** `overflow-wrap: anywhere` schlug
  `hyphens: auto` und zerlegte Wörter ohne Trennstrich. Auf Display-Größen ist
  auch Auto-Silbentrennung falsch – sie machte aus „UNTERNEHMEN“ ein
  „UNTER-NEHMEN“. Jetzt Umbruch an Wortgrenzen, `break-word` nur als Notfallnetz.
- **`line-height: 0.96` pauschal auf H1 bis H3.** Für eine 150-px-Zeile richtig,
  für eine 30-px-H3 zu eng. Jetzt je Ebene definiert.
- **Bilder mit `width`/`height`-Attributen ignorierten `aspect-ratio`.** Beide
  Dimensionen galten als gesetzt; `height: auto` in der Basisregel ergänzt.
- Uneinheitliche Lesebreiten (34/38/78ch) durch Tokens ersetzt.

### Geprüft

- 48 Seitenansichten: acht Routen × drei Zustände (Aktuell/A/B) × Desktop
  1440 × 1000 und Mobile 390 × 844;
- 0 horizontale Überläufe, 0 Konsolenfehler, 0 fehlgeschlagene Requests,
  0 defekte Bilder, 0 defekte Konzeptlinks, genau eine H1 je Seite;
- 19 Interaktionstests bestanden: Klick, Tastatur, Escape, Fokusrückgabe,
  Klick nach außen, Touch bei 1180 px, mobiles Akkordeon, 44-px-Touchziele,
  Konzeptumschaltung, Richtungsumschaltung;
- `prefers-reduced-motion`: Animation aus, Smooth-Scroll aus, Panel öffnet
  vollständig – keine Information hängt an Bewegung;
- 40 Projekte, acht Branchenfilter, ein Treffer für „NOEY“, kein sichtbarer
  Leistungsfilter, Anfrageprototyp reagiert unverändert.

### Noch offen

- Wahl der Richtung; A und B sind bewusst gleichwertig gebaut;
- Hero-Bild für Variante B (aktuell Teamfoto als Platzhalter);
- Headline und Subline – siehe Rückfrage im Übergabegespräch;
- Übertragung auf die Unterseiten erfolgt erst nach Entscheidung.

## 27.08.2026 – Übergabe für die UI/UX-Phase

### Hinzugefügt

- scoped `konzept/CLAUDE.md` mit Architektur, festen Konzeptentscheidungen,
  Arbeitsregeln, Tests und Git-/Preview-Grenzen;
- ausführliches `UI-UX-HANDOFF-CLAUDE-CODE.md` mit UI/UX-Zielbild, offenen
  Entscheidungen, vier empfohlenen Arbeitspässen und Gauntlet-Loop;
- direkt nutzbarer Startprompt für den ersten Claude-Code-Durchlauf.

### Präzisiert

- UI/UX startet mit globalem Rahmen und Homepage, nicht mit einem gleichzeitigen
  Redesign aller Seiten;
- Motion folgt erst nach Freigabe der statischen Hierarchie;
- interne Audit-Unterlagen bleiben außerhalb des teilbaren Preview-Branches;
- Produktion, SEO-Bestandstexte und validierte Informationsarchitektur sind vor
  unbeabsichtigten Änderungen geschützt.

## 27.08.2026 – Meeting-Audit mit Christian eingearbeitet

### Geändert

- Hauptnavigation auf Home, Projekte, Wo wir helfen können, Leistungen, Über uns
  und Projekt anfragen ausgerichtet;
- sichtbaren Begriff „Szenarien“ durch „Wo wir helfen können“ ersetzt;
- Dropdown und Pfeil auf den Navigationspunkt mit tatsächlicher Unterebene
  konzentriert;
- Strategie, Branding und Websites im Homepage-Hero und als drei sichtbare
  Kernleistungen priorisiert;
- Über uns und Arbeitsweise als gemeinsames Seitenziel bestätigt;
- Projektarchiv auf eine primäre Branchenperspektive reduziert;
- Leitüberschriften an zentralen Stellen verkürzt;
- Magazin, Videos und persönliche Sichtbarkeit wieder in die Homepage-Struktur
  aufgenommen.

### Dokumentiert

- bestehende SEO-Texte bleiben eine migrationskritische Quelle und werden nicht
  pauschal neu geschrieben;
- H1/Subline-Tausch, finales Interface-System und endgültiger Szenario-Slug sind
  noch keine beschlossenen Punkte;
- Meeting-Notizen wurden mit dem vollständigen Transkript gegengeprüft; im
  Dokument waren keine Kommentar-Threads vorhanden.

### Geprüft

- acht Konzeptseiten in Desktop und Mobile, insgesamt 16 Seitenansichten;
- keine kaputten Konzeptlinks, JavaScript-Fehler, fehlenden Medien oder
  horizontalen Überläufe;
- mobile Navigation, beide Homepage-Reihenfolgen und Anfrageprototyp;
- 40 Projekte, acht Branchenfilter, ein Suchergebnis für „NOEY“ und kein
  sichtbarer Leistungsfilter.

## 27.08.2026 – Branchenorientiertes Projektarchiv

### Hinzugefügt

- vollständiges Verzeichnis der 40 veröffentlichten Cases;
- acht Branchencluster mit transparenten Ergebniszahlen;
- Projektsuche über Name, Beschreibung, Branche und Leistungsbereich;
- alternative, nachgeordnete Ansicht nach Leistungsbereichen;
- gleichberechtigte Projektzeilen mit alphabetischer Standardsortierung;
- Pfeilkennzeichnung für Hauptnavigationselemente mit Unterebenen.

### Geändert

- Branchencluster sind jetzt die primäre Orientierung auf der Projekte-Seite;
- B2B, B2C, B2B2C und Startup wurden aus der sichtbaren Filterlogik entfernt;
- die Projekte-Seite trennt vollständiges Archiv und kuratierte Proof Stories;
- Einleitung und Konzeptnotiz erläutern den geprüften Arbeitsstand.

### Geprüft

- 40 von 40 Projekten werden geladen;
- alle acht Branchencluster liefern die erwarteten Case-Anzahlen;
- Filter „Technologie & Industrie“ liefert fünf Projekte;
- Suche nach „NOEY“ liefert genau den Case NOEY Solutions;
- keine JavaScript-Konsolenfehler im geprüften Ablauf;
- kein horizontaler Überlauf bei 390 × 844 Pixeln.

## 26.08.2026 – Erster Strukturprototyp

- neue Hauptnavigation mit Projekte, Szenarien, Leistungen, Über CONCRETE und
  Projektanfrage;
- vergleichbare Homepage-Reihenfolgen „Projekte zuerst“ und „Szenarien zuerst“;
- exemplarische Projekt- und Szenario-Detailseiten;
- nicht sendender Anfrageprototyp;
- bestehende Gestaltung als bewusst reduzierte Arbeitsoberfläche übernommen.
