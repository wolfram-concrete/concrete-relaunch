# Briefing für Claude Design

Zum direkten Einfügen in den Design-Chat, in dem das Magazin gebaut wurde.

---

Wir bauen jetzt eine **Website**, kein zweites Magazin. Das Magazin, das wir in
diesem Chat gebaut haben, liefert ausschließlich die **visuelle Sprache** —
sonst nichts. Alles Inhaltliche kommt aus einem Website-Prototyp, der parallel
in Claude Code entstanden ist und inhaltlich bereits entschieden ist.

## Aus dem Magazin nimmst du nur den Look

Farbsystem und wie Farbe eingesetzt wird · Schriftsystem und die Rollen der
Schnitte · die Satzverhältnisse und vor allem der Skalenkontrast zwischen Body
und Display · das Haarlinienkonzept · eingerückte Headline-/Bodytext-Beziehung ·
der Wechsel groß skalierter und kleiner Bilder · Freisteller · collagige
Anordnungen · vollflächige Statementflächen · Betontexturen · vertikale
Randlabels · Mikrotypografie · große ausgegraute Nummern.

## Aus dem Prototyp nimmst du alles andere — unverändert

Seitenstruktur und Routen · Navigation und Navigationstiefe · Reihenfolge der
Sektionen · sämtliche Texte, Headlines und Sublines · die inhaltliche
Hierarchie · den Footer-Aufbau · und die bereits entschiedenen Regeln:
Eckenradius aller CTAs aus dem um 90° gekippten O des Logos (0,236 der kurzen
Achse), vollständiges Logo inklusive „Brandbuilding" im Header, Wortmarke ohne
Zusatz im Footer, keine rahmenden Linien oben und an den Seiten (Zwischenlinien
bleiben), Pfeile aus dem ursprünglichen Websitestyling.

**Du erfindest keine neue Struktur, keine neuen Texte, keine neue Navigation.**
Wenn dir inhaltlich etwas falsch vorkommt: sag es mir, ändere es nicht.

## Wo alles liegt

Der Prototyp liegt auf Branch **`relaunch-v2`**, nicht auf `main`. Auf `main`
steht nur der alte statische WordPress-Export, dort gibt es **kein**
Verzeichnis `konzept/`. Wenn du `main` liest, findest du nichts von alldem.

Repository: `github.com/wolfram-concrete/concrete-website` (privat)

**Zuerst lesen**

- Übergabe mit allen Entscheidungen und den offenen Konflikten:
  https://github.com/wolfram-concrete/concrete-website/blob/relaunch-v2/konzept/UEBERGABE-CLAUDE-DESIGN.md
- Stand, Ziel und Seitenübersicht:
  https://github.com/wolfram-concrete/concrete-website/blob/relaunch-v2/konzept/README.md

**Struktur, Texte, Hierarchie — die inhaltliche Vorlage**

- Startseite:
  https://github.com/wolfram-concrete/concrete-website/blob/relaunch-v2/konzept/index.html
- Projekte:
  https://github.com/wolfram-concrete/concrete-website/blob/relaunch-v2/konzept/projekte/index.html
- Case Conlivo:
  https://github.com/wolfram-concrete/concrete-website/blob/relaunch-v2/konzept/projekte/conlivo/index.html
- Wo wir helfen können:
  https://github.com/wolfram-concrete/concrete-website/blob/relaunch-v2/konzept/szenarien/index.html
- Hilfeseite (Beispiel):
  https://github.com/wolfram-concrete/concrete-website/blob/relaunch-v2/konzept/szenarien/unternehmen-entwickelt-marke-nicht/index.html
- Leistungen:
  https://github.com/wolfram-concrete/concrete-website/blob/relaunch-v2/konzept/leistungen/index.html
- Über uns:
  https://github.com/wolfram-concrete/concrete-website/blob/relaunch-v2/konzept/ueber-concrete/index.html
- Projekt anfragen:
  https://github.com/wolfram-concrete/concrete-website/blob/relaunch-v2/konzept/projekt-anfragen/index.html

**Der aktuelle Designstand — den ersetzt du, aber du solltest wissen, was drinsteht**

- https://github.com/wolfram-concrete/concrete-website/blob/relaunch-v2/konzept/assets/design.css
- https://github.com/wolfram-concrete/concrete-website/blob/relaunch-v2/konzept/assets/prototype.css
- https://github.com/wolfram-concrete/concrete-website/blob/relaunch-v2/konzept/assets/prototype.js

**Magazin zum Abgleich** — nur falls deine eigenen Werte unklar sind. Im
Zweifel gilt, was du selbst gebaut hast:

- https://github.com/wolfram-concrete/concrete-website/blob/relaunch-v2/konzept/magazin-referenz/magazin-system.css
- https://github.com/wolfram-concrete/concrete-website/blob/relaunch-v2/konzept/magazin-referenz/magazin-designvertrag.md

## Vier Konflikte, die du entscheiden musst

Sie stehen ausführlich in Teil C der Übergabe. Kurz:

1. **Der Grund.** Magazin `#ebebeb`, Prototyp `#f2eee7`. Ich tendiere zu
   `#ebebeb`, weil die Marke das im Druck schon trägt.
2. **Coral als Fläche oder nur als Interaktionsfarbe.** Das Magazin legt ganze
   Seiten vollflächig in Coral, der Prototyp hat Coral ausschließlich für
   Hover, Fokus und aktiven Navigationspunkt reserviert. Beides zusammen geht
   nicht.
3. **Der Maßstabssprung.** Im Magazin liegt zwischen Body und Display Faktor
   14–20, im Prototyp nur Faktor 7. Wenn der Magazinlook tragen soll, muss der
   Sprung größer werden.
4. **Leserichtung.** Das Magazin ist linear und blättert, die Website springt.
   Die Seiten lassen sich nicht 1:1 als Sektionen übersetzen — übertragbar ist
   die Grammatik, nicht die Dramaturgie der Abfolge.

## Wie wir arbeiten

Nicht die ganze Seite auf einmal. Das ist fünfmal gescheitert und ich konnte
jedes Mal nur „funktioniert nicht" sagen, ohne zu wissen, welche der zwanzig
Entscheidungen die falsche war.

Stattdessen: **erst das Regelblatt** — Grund, Schriftrollen, Satzverhältnisse,
Raster, Einzugstiefe, Linienstärken. Das lege ich mir vor und hake es ab.
**Dann Modul für Modul**, jeweils neben der Magazinseite, aus der es kommt.
Was freigegeben ist, wird gesperrt. **Die Startseite entsteht zuletzt**, nur
aus freigegebenen Modulen.

Fang bitte mit dem Regelblatt an. Bau noch keine Seite.
