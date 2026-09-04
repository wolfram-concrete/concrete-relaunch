# UI/UX-Handoff für Claude Code

Stand: 27.08.2026  
Arbeitsbereich: nicht produktiver CONCRETE-Strukturprototyp  
Produktive Website: unverändert

## 1. Auftrag für die nächste Phase

Die Informationsarchitektur und die wesentlichen Seitenbeziehungen sind als
anklickbarer Strukturprototyp vorhanden. Die nächste Phase soll daraus ein
hochwertiges, leicht verständliches UI/UX-System entwickeln.

Der Auftrag ist nicht, die Konzeption neu zu starten. Zuerst soll geprüft
werden, wie die bestätigte Struktur durch Typografie, Proportionen, Weißraum,
Bildführung, Navigation und Interaktion schneller erfassbar wird.

Zielgröße bleibt nicht eine beliebige Conversion, sondern eine qualifizierte
Projektanfrage beziehungsweise ein sinnvoll gebuchtes Erstgespräch.

## 2. Verbindlicher Ausgangspunkt

### Hauptnavigation

1. Home
2. Projekte
3. Wo wir helfen können
4. Leistungen
5. Über uns
6. Projekt anfragen

„Wo wir helfen können“ besitzt eine echte Unterebene und wird deshalb mit Pfeil
und Dropdown dargestellt. Der interne Begriff „Szenarien“ darf in Analysen und
Dateipfaden vorkommen, ist aber nicht die sichtbare Hauptnavigation.

### Homepage

- Die Markenidee „Marken für Unternehmen in Bewegung“ bleibt der übergeordnete
  Rahmen.
- Strategie, Branding und Websites müssen ohne Scrollen sichtbar sein.
- Projekte und Hilfesituationen können über den vorhandenen Schalter in beiden
  Reihenfolgen bewertet werden.
- Projekte liefern früh visuelle und inhaltliche Glaubwürdigkeit.
- Magazin, Videos und persönliche Sichtbarkeit bleiben als Identitätssignale.

### Projekte

- 40 veröffentlichte Cases sind vollständig erfasst.
- Acht Branchencluster sind die primäre Filterlogik.
- Kein sichtbarer Filter nach B2B, B2C oder Startup.
- Kein paralleler Leistungsfilter im aktuellen Entscheidungsstand.
- Die Seite erfüllt zwei verschiedene Aufgaben:
  - Gesamtkatalog für Orientierung und Branchenerfahrung;
  - kuratierte Proof Stories für Haltung, Urteilskraft und Qualität.

### Über uns

„Über uns“ und Arbeitsweise sind zusammengeführt. Die Seite soll beantworten:

- Wer sitzt tatsächlich mit am Tisch?
- Wer trägt strategische und gestalterische Verantwortung?
- Wie bleibt seniorige Beteiligung bis zur Umsetzung erhalten?
- Was ist an der Zusammenarbeit konkret anders?

### Content und SEO

Die jetzigen Prototyptexte erklären die Struktur; sie sind noch keine komplette
Content-Migration. Bestehende indexierbare Texte dürfen nicht pauschal ersetzt
werden. Für den späteren Relaunch braucht jede Bestands-URL eine Entscheidung:
übernehmen, neu einordnen, gezielt aktualisieren oder konsolidieren.

## 3. Noch offene Entscheidungen

Diese Punkte dürfen im UI/UX-Pass untersucht werden:

- endgültiges visuelles System und Grad der Reduktion;
- Typografie-Hierarchie und maximale Überschriftenlängen;
- Homepage-Reihenfolge „Projekte zuerst“ oder „Wo wir helfen können zuerst“;
- genaue Ausführung des Mega-Menüs auf Desktop und Mobile;
- visuelle Balance zwischen Projektbildern, Text und persönlichen Formaten;
- Dichte und Darstellung des 40-Case-Projektkatalogs;
- Motion-Vokabular nach Abschluss der statischen Hierarchie;
- finale Anzahl und Benennung der Hilfesituationen;
- endgültiger URL-Slug für „Wo wir helfen können“;
- finale Anfragefelder, Budgetkommunikation und Calendly-Übergabe.

Nicht offen sind Produktionseingriffe oder ein unkontrollierter Content-Rewrite.

## 4. Empfohlener UI/UX-Ablauf

### Pass A – Globaler Rahmen

- Navigation, Headerhöhe, Desktop-/Mobile-Verhalten und CTA-Hierarchie;
- Typografie-Tokens, Lesebreiten, Abstände und responsive Breakpoints;
- Farb- und Flächenlogik mit einem klaren CONCRETE-Akzent;
- Zustände für Hover, Fokus, aktiv, geöffnet und reduziert bewegte Darstellung.

Ergebnis: ein wiederverwendbarer Shell-Stand, noch ohne jede Seite auszudesignen.

### Pass B – Homepage als Referenzseite

- Hero mit sofort sichtbaren Kernleistungen;
- zwei bewertbare Section-Reihenfolgen erhalten;
- Projektkarten, Hilfesituationen, Leistungsfelder, Menschen und redaktionelle
  Formate in eine klare Dramaturgie bringen;
- Überschriften auf schnelle Erfassbarkeit prüfen.

Ergebnis: eine Seite, an der die visuelle Richtung verbindlich bewertet werden
kann.

### Pass C – System auf Schlüsselseiten übertragen

1. Projekte und Case-Verzeichnis
2. exemplarischer Conlivo-Case
3. Wo wir helfen können
4. Leistungen
5. Über uns
6. Projekt anfragen

Ergebnis: konsistente Komponenten statt individueller Seitendesigns.

### Pass D – Motion und Politur

Erst nach Freigabe der statischen Hierarchie:

- Navigation und Dropdown-Übergänge;
- zurückhaltende Section-Reveals;
- Bildwechsel und Case-Hover;
- Feedback bei Filtern und Formularzuständen;
- vollständiger Reduced-Motion-Fallback.

Motion soll Orientierung und Wertigkeit erhöhen, nicht Lesbarkeit verdecken.

## 5. Gauntlet-Loop für jede größere Entscheidung

Für Navigation, Hero, Projektverzeichnis und Section-System jeweils:

1. **Ziel benennen:** Welche Nutzerentscheidung soll leichter werden?
2. **Evidenz prüfen:** Welche Audit- oder Meeting-Erkenntnis stützt die Änderung?
3. **Alternativen bauen:** Mindestens zwei sinnvoll unterscheidbare Varianten.
4. **Challenge:** Was spricht gegen die bevorzugte Variante? Welche andere
   Erklärung ist möglich?
5. **Auswahl begründen:** Beobachtung, Hypothese und Entscheidung trennen.
6. **Umsetzen:** Nur im Konzeptbereich.
7. **Verifizieren:** Desktop, Mobile, Tastatur, Reduced Motion, Konsole, Links.
8. **Dokumentieren:** README und Changelog aktualisieren.

Eine ästhetische Präferenz allein ist kein ausreichender Entscheidungsgrund.

## 6. Technischer Stand

Der Prototyp ist bewusst einfach und frameworkfrei:

- semantisches statisches HTML pro Route;
- ein gemeinsames Stylesheet `assets/prototype.css`;
- ein gemeinsames Script `assets/prototype.js`;
- lokale Fonts und vorhandene Medien aus dem Website-Export;
- Projektdaten aus `data/projects.json`;
- automatisierte Browser-QA über `scripts/verify-prototype.mjs`.

Es gibt keinen Buildschritt und keine produktive Datenübertragung. Das
Anfrageformular simuliert nur die Interaktion.

## 7. Verifizierter Stand

Letzter vollständiger Test:

- acht Routen in Desktop und Mobile, 16 Seitenansichten;
- keine kaputten Links innerhalb des Konzeptbereichs;
- keine JavaScript-Konsolenfehler;
- keine fehlenden Medien;
- kein horizontaler Überlauf bei 390 × 844 Pixeln;
- mobile Navigation funktioniert;
- beide Homepage-Reihenfolgen funktionieren;
- Konzeptformular zeigt den erwarteten Status;
- 40 Projekte und acht Branchenfilter werden geladen;
- Suche nach „NOEY“ liefert genau ein Ergebnis;
- kein sichtbarer Leistungsfilter im Projektkatalog.

## 8. Relevante Dateien und Wissensquellen

Im Arbeitsbranch `codex/relaunch-strukturprototyp` zuerst lesen:

1. `konzept/README.md`
2. `konzept/CHANGELOG.md`
3. `relaunch-analysis/13-meeting-audit-christian-2026-08-27.md`
4. `relaunch-analysis/11-strukturprototyp-gauntlet.md`
5. `relaunch-analysis/12-case-branchenkategorien.md`
6. `relaunch-analysis/09-wireframe-abgleich-alt-neu.md`
7. `relaunch-analysis/06-relaunch-blueprint.md`
8. `relaunch-analysis/05-gauntlet.md`

Verbindliche Magazine für Agentur-DNA, Cases und Tonalität:

- `/Users/wolfram/web-projekte/CONCRETE MAGAZIN/RZ/pdf Druck/CONCRETE Magazin Klebebindung_DIN A4_Innen_rz_16.08.pdf`
- `/Users/wolfram/web-projekte/CONCRETE MAGAZIN/RZ/pdf Druck/CONCRETE Magazin Klebebindung_DIN A4_Umschlag_rz_16.08.pdf`

Meeting-Quelle vom 27.08.2026:

- `https://docs.google.com/document/d/1HT_JB3o9rwUpATzDrDDUJEFNWsejwtGB4ahJ8Gx27TA/edit?tab=t.11m9v74xhu6g`

Das Meeting-Dokument enthält die Tabs „Notizen“ und „Transkript“, aber keine
Kommentar-Threads. Automatische Zusammenfassungen müssen gegen das Transkript
geprüft werden.

## 9. Preview- und Git-Workflow

- Interner Arbeitsbranch mit Wissensbasis:
  `codex/relaunch-strukturprototyp`
- Teilbarer, bereinigter Preview-Branch:
  `codex/relaunch-industry-preview`
- Stabile Vercel-Preview:
  `https://concrete-website-git-codex-r-e0623d-wolfram-stratmanns-projects.vercel.app/konzept/`

Der Preview-Branch enthält bewusst nur den teilbaren Konzeptbereich. Interne
Audit-Unterlagen und Lead-Auswertungen dürfen nicht versehentlich in diesen
Branch kopiert werden.

Empfohlener Start mit Claude Code:

```bash
git switch codex/relaunch-strukturprototyp
cd konzept
claude
```

Hinweis: Die Claude-Code-CLI war bei Erstellung dieser Übergabe nicht im
aktuellen Shell-Pfad installiert. Falls Claude Code über eine andere Oberfläche
gestartet wird, dort den Ordner `konzept` als Arbeitsverzeichnis wählen und
zuerst `CLAUDE.md` sowie dieses Handoff laden.

Erster sinnvoller Claude-Code-Auftrag:

> Lies `CLAUDE.md` und `UI-UX-HANDOFF-CLAUDE-CODE.md` vollständig. Entwickle
> zunächst zwei klar unterscheidbare UI-Richtungen ausschließlich für den
> globalen Header und den Homepage-Hero. Bewahre Navigation, Inhalte und
> Section-Reihenfolgen. Bewerte beide Richtungen mit dem Gauntlet-Loop, setze
> noch keine Richtung auf alle Unterseiten um und verändere keine produktiven
> Dateien.
