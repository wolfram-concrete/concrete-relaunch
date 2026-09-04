# CONCRETE Strukturprototyp

Dieser Bereich ist eine nicht produktive, mit `noindex` geschützte
Konzeptfassung auf Basis des bestehenden statischen Website-Exports. Er
verändert keine Bestandsroute und dient als teilbare Git-/Vercel-Preview.

## Ziel

- neue Navigation und Navigationstiefe greifbar machen;
- neue Section-Reihenfolgen mit realen CONCRETE-Inhalten prüfen;
- „Wo wir helfen können“, Projekte und Leistungen als verbundenes System testen;
- UI, Motion und finale Copy bewusst nachgelagert behandeln.

## Seiten

- `/konzept/` – Homepage mit umschaltbarer Reihenfolge Projekte/Hilfesituationen
- `/konzept/projekte/` – Projektübersicht mit 40 Cases, acht Branchenclustern,
  Suche und kuratierten Proof Stories
- `/konzept/projekte/conlivo/` – exemplarisch umgebauter Case
- `/konzept/szenarien/` – sichtbarer Navigationspunkt „Wo wir helfen können“;
  der technische Arbeitspfad bleibt vorerst bestehen
- `/konzept/szenarien/unternehmen-entwickelt-marke-nicht/` – exemplarische Hilfeseite
- `/konzept/leistungen/` – vier gebündelte Kompetenzfelder
- `/konzept/ueber-concrete/` – „Über uns“ mit Menschen, Verantwortung und Arbeitsweise
- `/konzept/projekt-anfragen/` – nicht sendender Anfrageprototyp

## Designstand

Seit dem 28.08.2026 gibt es genau **einen** Designstand unter `/konzept/`.
Die Vergleichsfassungen A, B und Hybrid sind aufgelöst; die Entscheidung ist
gefallen und in `assets/design.css` umgesetzt.

Zwei Regeln tragen das System:

1. **Vier Schriftgrößen, mehr nicht** — 88 / 32 / 18 / 13 px. Display
   erscheint genau zweimal pro Seite: als H1 und als Schlusszeile im Footer.
   Unterschieden wird sonst über Schriftschnitt, Satzbreite und Position,
   nicht über weitere Größen. Vorher waren es elf.
2. **Raum in Vielfachen von 8**, Seitenrhythmus in drei Werten.

**Koralle hat genau eine Rolle: Interaktion.** Hover, Fokus, aktiver
Navigationspunkt. Keine eingefärbten Überschriften. Flächen tragen Papier und
Ink; die einzige gefüllte Fläche der Seite ist die primäre
Handlungsaufforderung im Inhalt.

**Module sind offene Blöcke**, keine Karten: keine Rahmen, keine Radien, keine
Schatten. Getrennt wird über Haarlinien und Raum.

Der Hero ist typografiegeführt und ohne Bild. Die Betonfläche aus dem
Originalauftritt liegt in einer **Pause-Section** in der Seitenmitte, mit einer
Aussage darüber. Bewusst als Standbild: der Originalclip wiegt 11 MB und
verstieße gegen die Medienvorgabe aus `06-relaunch-blueprint`.

Ausgestaltet ist die Homepage. Die übrigen Seiten laufen auf derselben
Grundlage mit, haben aber noch kein eigenes Layout.

### Footer

Der Footer ist der vollständige Seitenindex und liegt auf allen acht Seiten
identisch. Vier Spalten — Leistungen, Branchen, Wissen, Agentur — führen auf
54 echte Ziele aus der URL-Matrix. Unterhalb 760 px klappen sie zu Akkordeons;
technisch sind es `<details>`/`<summary>`, die Tastatur- und Screenreader-
Semantik kommt damit vom Browser. Am Desktop stehen alle Spalten offen und die
Labels sind aus der Tabfolge genommen.

Die **97 FAQ-Seiten stehen bewusst nicht einzeln** im Footer, sondern hinter
einem Sammel-Link auf `/faqs/`: die URL-Matrix empfiehlt, 210 Seiten zu
konsolidieren, fast alle davon FAQs mit maximal zwei Klicks. Sobald über die
Konsolidierung entschieden ist, gehört die verbleibende FAQ-Struktur hier
hinein.

Im Footer steht die **Wortmarke ohne den Zusatz „Brandbuilding“**
(`assets/logo/concrete-paper.svg`); der Header trägt weiterhin das
vollständige Logo. Das laufende Logoband zeigt neun Kundenlogos und steht bei
`prefers-reduced-motion` still.

## Motion

Bewusst noch nicht umgesetzt. Der Handoff sieht Motion als Pass D vor, also
nach Freigabe der statischen Hierarchie, und `05-gauntlet` hält fest, dass
„mehr Motion macht die Agentur premium" **nicht belegt** ist. Solange sich das
Layout noch ändert, wäre jede Bewegung Wegwerfarbeit.

## Design-Recherche

Für die Gestaltung wird der Refero-Skill genutzt. Installation:

```bash
npx skills add https://github.com/referodesign/refero_skill
```

Der Ordner `.agents/` wird bewusst nicht versioniert — der Skill ist mit dem
Befehl oben jederzeit reinstallierbar. Für die Live-Recherche braucht es
zusätzlich den Refero-MCP-Server; der wird pro Arbeitsplatz eingerichtet.

## Schriften

Unter `assets/fonts/` liegen die lizenzierten Webfont-Schnitte Arame
Regular/Bold und Roc Grotesk Regular/Bold (69 KB gesamt, aus den MyFonts-
Bestellungen M12995821 und M13012708). Vorher war nur je ein Schnitt eingebunden
und `<strong>` wurde vom Browser als Fake-Bold synthetisiert.

## Lokal ansehen

Vom Repository-Root:

```bash
python3 -m http.server 4173
```

Danach `http://localhost:4173/konzept/` öffnen.

Browser-QA in einer zweiten Shell:

```bash
PROTOTYPE_BASE=http://127.0.0.1:4173 node konzept/scripts/verify-prototype.mjs
```

Das Skript prüft 16 Seitenansichten: acht Routen jeweils auf Desktop und
Mobile.

## Status

Aktueller Konzeptentscheid nach dem Termin vom 27.08.2026:

- Hauptnavigation: Home, Projekte, Wo wir helfen können, Leistungen, Über uns,
  Projekt anfragen.
- „Wo wir helfen können“ ersetzt den sichtbaren Begriff „Szenarien“ und zeigt
  seine Unterebenen über Dropdown und Pfeil.
- Strategie, Branding und Websites sind im ersten Homepage-Bildschirm und als
  drei Kernleistungsfelder sichtbar.
- Branchencluster sind die primäre Orientierung im Projektarchiv.
- B2B/B2C und Startup sind keine sichtbaren Filter.
- Leistungsbereiche werden nicht als konkurrierender Projektfilter gezeigt.
- „Über uns“ und Arbeitsweise sind auf einer Seite zusammengeführt.
- Die vollständige Case-Inventur bleibt von der kuratierten Proof-Auswahl
  getrennt.
- Magazin, Videos und persönliche Sichtbarkeit bleiben als Teil der Agentur-DNA
  erhalten.
- Bestehende SEO-Texte werden in der Migration weitgehend übernommen, sofern
  sich der Inhalt nicht ändert; der Prototyp ist ausdrücklich kein Volltext-
  Migrationsstand.

Stand 28.08.2026 zusätzlich entschieden und umgesetzt:

- Die Navigation hat auf allen acht Seiten eine echte Disclosure-Mechanik
  (Klick, Tastatur, Escape, Klick nach außen). Vorher öffnete das Mega-Menü nur
  per Hover und war auf Touch-Geräten oberhalb 1080 px nicht bedienbar.
- Die Unterebene von „Wo wir helfen können“ existiert jetzt auch in der mobilen
  Navigation. Vorher fehlte sie dort vollständig.
- Homepage-Reihenfolge: Projekte zuerst.

Der Prototyp wurde mit 40 Projekten auf Filterung, Suche, Konsolenausgaben und
mobile Überläufe geprüft. Inhaltliche Zuordnungen bleiben redaktionell
diskutierbar; das finale Interface-System, Motion und die vollständige
SEO-Content-Migration sind weiterhin nachgelagert.

Die interne Relaunch-Wissensbasis wird bewusst nicht im teilbaren
Preview-Branch veröffentlicht.

Änderungen werden im [Changelog](./CHANGELOG.md) festgehalten.

## Branches, Deployment und Arbeitsweise

| Branch | Inhalt | Vercel |
|---|---|---|
| `main` | Originalseite aus dem WordPress-Export. **Eingefroren.** | Production |
| `relaunch-v2` | diese Arbeitsversion unter `/konzept/` | eigene Preview-URL, aktualisiert sich bei jedem Push |

Das Original wird nicht durch Disziplin geschützt, sondern durch Aufbau: Die
Arbeitsversion liegt vollständig in `konzept/`. In den Bestandsseiten unter `/`
wird nicht geschrieben.

`relaunch-v2` zweigt direkt von `main` ab. Die interne Wissensbasis
`relaunch-analysis/` wird mitversioniert, seit das Repository privat ist —
`.vercelignore` hält sie zusätzlich aus jedem Deployment heraus, sie ist also
auch über die Preview-URL nicht abrufbar.

**Bedingung:** Sollte das Repository jemals wieder öffentlich gestellt werden,
muss `relaunch-analysis/` vorher aus Branch und Historie entfernt werden. Der
Ordner enthält Lead-, Abschluss- und Umsatzdaten sowie interne Bewertungen
laufender Kundenprojekte.

### Routine bei jeder Arbeitseinheit

1. Änderungen ausschließlich in `konzept/**` vornehmen.
2. Browser-QA laufen lassen:
   `PROTOTYPE_BASE=http://127.0.0.1:4173 node konzept/scripts/verify-prototype.mjs`
3. `CHANGELOG.md` um den Eintrag ergänzen, bei strukturellen Änderungen auch
   diese README.
4. Committen und auf `relaunch-v2` pushen. Vercel baut die Preview neu.

Nach `main` wird erst gemerged, wenn die neue Version tatsächlich live gehen
soll. Bis dahin bleibt `main` unberührt.

## Übergabe an Claude Code

- [CLAUDE.md](./CLAUDE.md) enthält die verbindlichen Scope-, Workflow- und
  Testregeln für die nächste UI/UX-Phase.
- [UI-UX-HANDOFF-CLAUDE-CODE.md](./UI-UX-HANDOFF-CLAUDE-CODE.md) dokumentiert
  Ausgangslage, feste Entscheidungen, offene Designfragen, empfohlenen Ablauf
  und einen direkt nutzbaren Startprompt.

Für den UI/UX-Start im internen Arbeitsbranch:

```bash
cd konzept
claude
```

Der Befehl setzt eine installierte und angemeldete Claude-Code-CLI voraus. Im
aktuellen Shell-Pfad wurde die CLI bei Erstellung dieser Übergabe nicht gefunden;
die Übergabedateien funktionieren ebenso als Kontext für eine andere
Claude-Code-Oberfläche.
