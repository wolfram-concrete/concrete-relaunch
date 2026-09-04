# Projektübergabe an Claude Design

## Zugriff — bitte zuerst lesen

Der Prototyp liegt **nicht auf `main`**. Auf `main` steht nur der statische
WordPress-Export; ein Verzeichnis `konzept/` existiert dort überhaupt nicht.

```
Repository: github.com/wolfram-concrete/concrete-website  (privat)
Branch:     relaunch-v2
Pfad:       konzept/UEBERGABE-CLAUDE-DESIGN.md
```

Alles Weitere in diesem Dokument bezieht sich auf diesen Branch.

---

## Auftrag

**Das Magazin hast du selbst gebaut** — in diesem Chat. Es ist die
Designgrundlage, und du bist dafür die Quelle, nicht dieses Dokument. Was du
hier bekommst, ist die andere Hälfte: die **Websitekonzeption**, die in einem
getrennten Strang entschieden und als Prototyp gebaut wurde, ohne dass die
beiden je zusammengeführt wurden.

Deine Aufgabe ist diese Zusammenführung — die Gestaltungssprache, die du für
das Magazin entwickelt hast, auf die entschiedene Websitestruktur zu
übertragen.

Was du **nicht** tun sollst: eine externe Referenz einbringen oder die
Navigations- und Inhaltsentscheidungen anfassen. Beides ist mehrfach versucht
worden und gescheitert (siehe Teil D).

**Lies in dieser Reihenfolge:** Teil B (was die Website sein soll) → Teil C
(die vier Konflikte, das ist der eigentliche Kern) → Teil D (was schon
gescheitert ist) → Teil A nur als Abgleich.

---

## Teil A · Abgleich: was im Magazin tatsächlich steht

**Diesen Teil brauchst du nur als Kontrolle.** Du kennst das Magazin, du hast
es gebaut. Die Werte stehen hier aus einem einzigen Grund: damit sichtbar wird,
**wo der Websiteprototyp vom Magazin abgewichen ist** — und das ist er, an
mindestens einer entscheidenden Stelle.

Alle Angaben sind aus dem Build zurückgelesen, nicht geschätzt. Zur
Sicherheit liegen die Originale im Repository:

- `konzept/magazin-referenz/magazin-system.css` — das komplette CSS des
  Magazin-Builds, wörtlich übernommen, nur die eingebetteten Base64-Schriften
  entfernt
- `konzept/magazin-referenz/magazin-designvertrag.md` — der geschriebene
  Designvertrag des Magazinprojekts

Sollten diese Werte von dem abweichen, was in deinem Canvas steht: **dein
Canvas gilt**, und dann sag es — dann liegt der Fehler bei mir.

**Der lokale Magazinordner** `/Users/wolfram/web-projekte/CONCRETE MAGAZIN/`
liegt in keinem Repository und ist über GitHub nicht erreichbar. Er enthält
`index.html` (1.331 Zeilen, jede Seite ein `.page`-Block 210×297 mm),
`CLAUDE.md`, `assets/fonts/`, `assets/img/` und das 40-seitige Druck-PDF.

### Farben — aus `:root` in `index.html`

```
--coral:   #fe7e5e   einziger Akzent
--coral-l: #febdac
--grey-l:  #ebebeb
--grey-d:  #a8a8a8
--ink:     #0c0c0c
--paper:   #ebebeb   ← der Grund des Magazins
```

**Wichtig:** Der Basisgrund ist ein warmes Hellgrau `#ebebeb`, **kein
Papierweiß und kein Creme.** Das ist der auffälligste Unterschied zum
bisherigen Websiteprototyp, der auf `#f2eee7` gebaut wurde. Diese Abweichung
muss aufgelöst werden — siehe Teil C.

Wechselnde Seitengründe sind ausdrücklich erlaubt: vollflächig Coral,
Coral- oder Hellbeton-Struktur, dunkel `#0c0c0c`. Das Magazin nutzt Farbe also
**als Fläche**, nicht nur als Akzent.

*Hinweis:* `CLAUDE.md` nennt `--grey-d:#8d8d8d`, der Code `#a8a8a8`. Der Code
gilt.

### Schrift

| Rolle | Schnitt | Einsatz |
|---|---|---|
| Display, Headlines, Highlights | **Arame** (Thin / Regular / Bold) | groß, eng, versal |
| Fließtext | **Roc Grotesk Regular 400** | aller Body |
| Mikro-Labels, Eyebrows, Tags, Fußzeilen, Highlight-Wörter | **Roc Grotesk Bold 700** | nur dafür |

- **Roc ExtraLight/Light nicht verwenden** — bricht im Druck weg.
- **Kein echter Kursivschnitt vorhanden.** Italic ist faux-italic, nur sparsam
  für Kleintext.
- Webfont-Fassungen für die Website liegen bereits lizenziert unter
  `konzept/assets/fonts/` (Arame Regular/Bold, Roc Grotesk Regular/Bold als
  WOFF2, Fontspring-Bestellungen M12995821 und M13012708).

### Der gemessene Satz — echte Werte aus dem Magazin-Code

Seite 210×297 mm, Seitenrand links/rechts **16 mm** (7,6 % der Seitenbreite),
Satzspiegel damit **178 mm**. Eyebrow sitzt auf **18 mm** von oben, die
Fußzeile **13 mm** von unten.

| Element | Wert | Verhältnis zum Body |
|---|---|---|
| Body | 8,6 pt / Zeilenhöhe 1,62 / LS .002em / `#161616` | 1,00 |
| Eyebrow (Roc Bold, versal, coral) | 7 pt / **LS .28em** | 0,81 |
| Fußzeile | 6,6 pt / LS .22em / versal | 0,77 |
| Lead | 12–13 pt / Zeilenhöhe 1,42 / max. 155 mm breit | 1,40–1,51 |
| Headline | 50–98 pt | 5,8–11,4 |
| Display | 118–170 pt | 13,7–19,8 |

Zeilenhöhen im Displaybereich: **.40 bis 1.14**, der Schwerpunkt liegt bei
**.78–.96**. Laufweite auf Displaygrößen negativ: **−.01 bis −.035em**.
Displayschnitt fast durchgehend **Bold 700**, versal.

Das eigentliche Merkmal ist nicht eine einzelne Größe, sondern der **Sprung**:
Faktor 14–20 zwischen Body und Display, und dazwischen fast nichts. Genau
dieser Skalenkontrast trägt die Seiten.

### Layoutgrammatik

- **Haarlinienkonzept**, durchgängig: Fußlinie (**.6 pt**, `padding-top: 3mm`),
  Regel über der Case-Frage, kurze Regeln unter Headlines.
- **Skalenkontrast** — Riesentypo gegen Mikrotypo.
- **Versetzte Achsen**, mittelachsige Headlines nur zwischendurch als Abwechslung.
- **Vertikale Randlabels** — immer voll sichtbar, nie angeschnitten.
- **Große ausgegraute Schnitt-Nummern**, Slash-Mikrolabels.
- **Fuß „Hamburg —— Frankfurt"** als wiederkehrendes Element.
- **Betontexturen:** dunkel = `Beton_red_02.png` auf `#0c0c0c`;
  warm/transparent = `tex_coral_alpha*.png`, `tex_grey_alpha.png`.
- Coral-Highlight im Fließtext: `.hl { color: var(--coral); font-weight: 700 }`.

### Bereits gebaute Seitentypen (Blueprints in `index.html`)

Cover · Denktext · Scale-Kontrast (vollflächig Coral) · Kapiteltrenner
(vollflächig Coral-Beton, zentriert) · Case-Text · Case-Hero (Bild, zentrierte
Overlay-Headline) · Case-Anwendungen (knappes Bildraster) · Case-Statement
(Quote + Foto-Container) · dunkle Betonseite.

**Case-Blueprint (Conlivo ist die Vorlage für alle):** Textseite
(Herausforderung / Strategie / Lösung / Gemacht + große Coral-Frage „Was
bedeutet das für mich?") → Hero-Bild → Anwendungsraster (3–4 Bilder) →
Statement mit Foto-Container. Quotes immer mit Personenfoto, Name, Rolle.

### No-Gos (aus dem Magazinvertrag, gelten auch für die Website)

Stockfotografie · Clipart · überstrapazierte Schriften (Inter, Roboto, Arial,
Futura, Gotham, Garamond) · generische KI-Ästhetik · Pink-/Lila-Gradients.

---

## Teil B · Die neue Konzeption: die Website

Entschieden im Termin vom **27./28.08.2026**. Diese Punkte sind **nicht** zur
Gestaltung freigegeben — sie sind die Struktur, in die das Magazindesign
hineingelegt wird.

**Geschäftsziel:** qualifizierte Projektanfragen, *nicht* Conversionmenge.

### Hauptnavigation

`Home` · `Projekte` · `Wo wir helfen können` · `Leistungen` · `Über uns` ·
`Projekt anfragen`

- „Wo wir helfen können" ersetzt den sichtbaren Begriff „Szenarien" und zeigt
  seine vier Unterebenen über Dropdown und Pfeil:
  Unternehmen entwickelt, Marke nicht · Starkes Angebot, schwer verständlich ·
  Etwas Neues in den Markt bringen · Veränderung sichtbar machen.
- In der Hauptnavigation steht das **vollständige Logo inklusive
  „Brandbuilding"**. Die Navigation hat **keine Hintergrundfarbe**.
- Im **Footer** dagegen nur die Wortmarke **CONCRETE ohne** den Zusatz.

### Seiten des Prototyps

| Route | Inhalt |
|---|---|
| `/konzept/` | Startseite, Projekte zuerst |
| `/konzept/projekte/` | 40 Cases, acht Branchencluster, Suche, kuratierte Proof Stories |
| `/konzept/projekte/conlivo/` | exemplarisch umgebauter Case |
| `/konzept/szenarien/` | „Wo wir helfen können" |
| `/konzept/szenarien/unternehmen-entwickelt-marke-nicht/` | exemplarische Hilfeseite |
| `/konzept/leistungen/` | vier gebündelte Kompetenzfelder |
| `/konzept/ueber-concrete/` | Über uns, Menschen, Verantwortung, Arbeitsweise |
| `/konzept/projekt-anfragen/` | nicht sendender Anfrageprototyp |

### Sektionsfolge der Startseite (aktueller Stand)

Hero → Case-Wand → Proof → Wo wir helfen können → Pause/Statement →
Kompetenzen → Zusammenarbeit → Menschen → Redaktionelles → Anfrage → Footer

Die H2-Ebene lautet aktuell: „Projekte, die unsere Arbeit belegen." · „Wo wir
helfen können." · „Strategie. Branding. Websites." · „Direkt mit den
Entscheidern." · „Wer sitzt mit am Tisch?" · „Wir zeigen, wie wir denken." ·
„Was verändert sich gerade bei euch?"

### Weitere bindende Entscheidungen

- Branchencluster sind die primäre Orientierung im Projektarchiv.
- B2B/B2C und Startup sind **keine** sichtbaren Filter.
- Leistungsbereiche werden **nicht** als konkurrierender Projektfilter gezeigt.
- „Über uns" und Arbeitsweise liegen auf **einer** Seite.
- Die vollständige Case-Inventur bleibt von der kuratierten Proof-Auswahl getrennt.
- Magazin, Videos und persönliche Sichtbarkeit bleiben Teil der Agentur-DNA und
  müssen auf der Startseite vorkommen.
- Bestehende SEO-Texte werden weitgehend übernommen; der Prototyp ist
  ausdrücklich **kein** Volltext-Migrationsstand.
- Eckenradius aller CTAs folgt dem **O aus dem Logo, um 90° gekippt**:
  gemessen 144×196 px bei 34 px Radius, also **0,236 der kurzen Achse**.
- Der Footer ist der vollständige Seitenindex mit vier Spalten und 54 echten
  SEO-Zielen; die 97 FAQ-Seiten stehen bewusst nur als Sammel-Link.
- Rahmende Linien oben und an den Seiten sind entfernt. Zwischenlinien bleiben.
- Pfeile stammen aus dem ursprünglichen Websitestyling
  (`konzept/assets/media/arrow.svg`).

---

## Teil C · Wo Magazin und Website kollidieren

Das sind die vier Stellen, an denen eine Entscheidung nötig ist. Sie sind der
eigentliche Kern der Aufgabe.

**1 · Der Grund.** Magazin `#ebebeb` (warmes Hellgrau) gegen Prototyp `#f2eee7`
(Papierweiß). Der Prototyp ist hier vom Magazin abgewichen, ohne dass das je
entschieden wurde. **Empfehlung: auf `#ebebeb` zurück** — es ist der Grund, den
die Marke im Druck bereits trägt.

**2 · Farbe als Fläche oder nur als Akzent.** Das Magazin legt ganze Seiten
vollflächig in Coral und in dunklen Beton. Der Websiteprototyp hat sich die
Regel gegeben, Coral **ausschließlich** für Interaktion zu benutzen (Hover,
Fokus, aktiver Navigationspunkt) und keine eingefärbten Überschriften zu
setzen. Beides zusammen geht nicht. **Vorschlag: Coral darf Fläche sein — aber
nur als ganze Sektion, nie als Auszeichnung innerhalb von Text.** Dann bleibt
die Interaktionsfarbe innerhalb einer Sektion eindeutig, weil sie dort ins
Gegenteil kippt (heller Text auf Coral).

**3 · Maßstab.** Die Punktgrößen des Magazins lassen sich nicht übernehmen, die
**Verhältnisse** schon. Der Sprung Faktor 14–20 zwischen Body und Display ist
das Merkmal, nicht die absolute Zahl. Der Websiteprototyp läuft aktuell auf
einem viel flacheren Verhältnis (17 px Body zu 118 px Display = Faktor 7).
Wenn der Magazinlook tragen soll, muss dieser Sprung größer werden — oder der
Body kleiner.

**4 · Leserichtung.** Das Magazin ist ein lineares Medium: man blättert, jede
Doppelseite hat einen Auftritt. Die Website ist ein springendes Medium. Die
Magazinseiten lassen sich deshalb **nicht 1:1 als Sektionen** übersetzen. Was
übertragbar ist, ist die Grammatik — Einzug, Haarlinie, Skalenkontrast,
Bildgrößenwechsel, das eingestreute Vollflächen-Statement. Was nicht
übertragbar ist, ist die Dramaturgie der Abfolge.

---

## Teil D · Was bereits gescheitert ist

Fünf Anläufe, alle vom Kunden verworfen. Bitte nicht wiederholen:

1. **Variante A/B/Hybrid** (reduziert-editorial gegen expressiv-bildgeführt) —
   aufgelöst, Entscheidung zugunsten eines einzigen Standes.
2. **Dash Digital Studio als Referenz** — bringt eine fremde Grammatik in eine
   Marke, die schon eine hat.
3. **André Cândido als Referenz**, inklusive Schrifttausch auf **Bodoni Moda** —
   verworfen. Das Magazin setzt **Arame**; eine Didone widerspricht der
   Marke direkt. `bodoni-moda.woff2` liegt noch im Ordner und ist unbenutzt.
4. **Magazinadaption aus dem PDF gemessen** — im Ansatz richtig, aber ich habe
   aus gerenderten Seiten zurückgerechnet, statt den vorhandenen Quellcode zu
   lesen. Die Werte in Teil A sind die echten.
5. Wiederkehrender Verfahrensfehler: **die ganze Seite auf einmal geändert.**
   Darauf kann man nur mit ja oder nein antworten, und bei nein ist nicht
   erkennbar, welche der zwanzig Entscheidungen die falsche war.

**Konsequenz für dich:** ein Modul nach dem anderen, jeweils neben der
Magazinseite, aus der es stammt. Erst wenn die Module freigegeben sind, wird
die Startseite daraus komponiert.

---

## Teil E · Offene Punkte

Diese Fragen sind nicht entschieden. Nicht selbst beantworten — vorlegen.

- Welche **6–8 Cases** sind die kuratierten Proof Stories?
- Anzahl und Benennung der **vier Hilfesituationen**.
- Folgen die Kompetenzlisten den **drei Kernbegriffen** (Strategie, Branding,
  Websites) oder den **vier Live-Phasen** (Verstehen, Definieren, Umsetzen,
  Begleiten)? Der Footer nutzt derzeit die vier Phasen, weil die SEO-Seiten
  daran hängen.
- **Motion** ist bewusst noch nicht umgesetzt (Pass D, nach Freigabe der
  statischen Hierarchie).
- Die **210 Konsolidierungskandidaten** der URL-Matrix — solange offen, bleiben
  die 97 FAQ-Seiten im Footer ein Sammel-Link.

---

## Teil F · Wo alles liegt

**Magazin**
Deine eigene Quelle im Canvas. Als Abgleich zusätzlich im Repository:
`konzept/magazin-referenz/magazin-system.css` und
`konzept/magazin-referenz/magazin-designvertrag.md`.
Der lokale Ordner `/Users/wolfram/web-projekte/CONCRETE MAGAZIN/` ist über
GitHub **nicht** erreichbar.

**Website-Prototyp** — Branch `relaunch-v2`, lokal
`/Users/wolfram/.codex/worktrees/4227/CONCRETE Website/`
- `konzept/` — der gesamte Prototyp, **nur hier darf geändert werden**
- `konzept/assets/design.css` — Designsystem
- `konzept/assets/prototype.css` — Basisschicht, `@font-face`
- `konzept/assets/prototype.js` — Navigation, Footer-Akkordeon
- `konzept/assets/fonts/` — lizenzierte WOFF2
- `konzept/assets/logo/` — `concrete-brandbuilding-ink.svg` (Header),
  `concrete-paper.svg` (Footer, ohne Zusatz)
- `konzept/assets/cases/` — 18 Case-Kacheln WebP
- `konzept/assets/clients/` — 9 Kundenlogos für das Footer-Band
- `konzept/README.md` · `konzept/CHANGELOG.md` — Stand und Entscheidungshistorie
- `konzept/scripts/verify-prototype.mjs` — Browser-QA über 16 Seitenansichten

**Analyse**
`relaunch-analysis/data/url-entscheidungsmatrix.csv` — 328 URLs mit
Inhaltstyp und GSC-Daten

**Randbedingungen:** Prototyp bleibt `noindex,nofollow`. Keine Änderung an
Produktionsrouten. Kein neues Framework ohne Begründung. Getestet wird auf
**1440×1000** und **390×844**, ohne horizontalen Überlauf, mit Tastatur und mit
`prefers-reduced-motion`.

**Lokal ansehen** — vom Repository-Root:

```
python3 -m http.server 4173
```

Dann `http://localhost:4173/konzept/`.
