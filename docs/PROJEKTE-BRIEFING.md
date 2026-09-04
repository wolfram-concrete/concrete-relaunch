# Projekte-Landingseite - Briefing fuer Claude Design

Die Rubrizierung ist entschieden und liegt als Daten vor:
**`konzept/data/projects.json`** - 40 Projekte, je mit `name`, `route`,
`summary`, `services` und `industries`. Das ist die Quelle, nicht dieses
Dokument. Wenn dort etwas fehlt, fehlt es ueberall.

Gebaut ist die Seite bereits unter `konzept/projekte/index.html`.

---

## Die beiden Achsen

**Branche ist die primaere Orientierung. Leistung ist es nicht.** Das ist im
Termin vom 27.08. entschieden worden: Leistungsbereiche werden ausdruecklich
*nicht* als konkurrierender Projektfilter gezeigt - sonst stehen zwei Filter
nebeneinander und keiner fuehrt. B2B/B2C und Startup sind ebenfalls keine
sichtbaren Filter.

### Acht Branchencluster - der sichtbare Filter

Jedes Projekt haengt in **genau einem** Cluster. Keine Mehrfachzuordnung,
keine Projekte ohne Cluster. Die Summen ergeben also exakt 40.

| Cluster | Projekte |
|---|---|
| Food, Beverage & Hospitality | 7 |
| Finance & Professional Services | 6 |
| Technologie & Industrie | 5 |
| Gesundheit & Care | 5 |
| Arbeit, Bildung & Community | 5 |
| Architektur, Immobilien & Räume | 4 |
| Kultur, Medien & Entertainment | 4 |
| Consumer, Retail & Lifestyle | 4 |

Die Verteilung ist bewusst ungleich - sieben zu vier. Gestalte den Filter so,
dass ein Cluster mit vier Projekten nicht wie ein Fehler aussieht.

### Vier Leistungsfelder - Metadaten, kein Filter

Jedes Projekt traegt zwei bis vier davon. Sie erscheinen **am Projekt**, nicht
als Auswahlleiste:

- Identität & Designsystem - bei 40 von 40 Projekten
- Website & Kommunikation - bei 39 von 40 Projekten
- Strategie & Positionierung - bei 36 von 40 Projekten
- Aktivierung & Markenführung - bei 12 von 40 Projekten

Die ersten drei sind nahezu universell, das vierte ist die Ausnahme. Als
Filter waere das wertlos: 40 von 40 filtern nichts. Als Auszeichnung am
Projekt zeigt es, wie weit ein Projekt gegangen ist.

---

## Zwei getrennte Ebenen auf einer Seite

Die zentrale Entscheidung dieser Seite: **die vollstaendige Case-Inventur
bleibt von der kuratierten Proof-Auswahl getrennt.**

**Kuratierte Proof Stories** - sechs Projekte, ausgewaehlt statt gefiltert.
Jedes steht fuer eine Unternehmenssituation und nennt die zentrale
Entscheidung, nicht die Leistungsliste:

| Projekt | Situation | Zentrale Entscheidung |
|---|---|---|
| Conlivo | Markteinfuehrung | Veraenderung nicht gegen den Markt inszenieren, sondern als glaubwuerdige Weiterentwicklung |
| FinaPlus | Rebranding | technische Leistungsfaehigkeit und persoenliche Finanzkompetenz in einem System |
| Nextbed | Neue Produktmarke | dem Angebot Eigenstaendigkeit geben, ohne die Herkunft zu verlieren |
| medium / BGF+ | Rebranding | nicht lauter werden, sondern Anspruch und Praezision sichtbarer machen |
| System 360 | Positionierung | den Nutzen vor die Technologie stellen |
| be.care | Technikuebersetzung | nicht Features, sondern Entlastung und Beziehung zum Ausgangspunkt machen |

**Das Archiv** - alle 40, filterbar ueber die acht Cluster, mit Suche. Hier
zaehlt Menge und Auffindbarkeit, nicht Erzaehlung.

Gestalterisch muessen diese beiden Ebenen **klar unterscheidbar** sein. Eine
Proof Story ist kein groesseres Archivelement - sie hat eine andere Aufgabe.
Im Magazin entspricht das dem Unterschied zwischen einer Case-Doppelseite und
dem Inhaltsverzeichnis.

---

## Bestehender Aufbau

H1: „Arbeiten und Erfahrung nach Branchen.“

1. Filterleiste, acht Cluster plus Suche - H2 „Projekte nach Branche entdecken.“
2. Kuratierte Proof Stories - H2 „Kuratierte Proof Stories“
3. Archiv aller 40 - H2 „Katalog und Proof Stories.“
4. Ueberleitung zu den Hilfesituationen - H2 „Welches Szenario steckt hinter eurem Projekt?“

Reihenfolge und Texte sind entschieden. Wenn du die Abfolge aus
gestalterischen Gruenden aendern willst, frag nach.

---

## Was offen ist

**Sind es diese sechs Proof Stories?** Der Strukturvergleich vom 25.08. nennt
sechs bis acht und schlaegt vor, Link und Die Haftpflichtkasse zu pruefen -
beide sind derzeit nicht dabei. Auf der Startseite sollen drei stehen, hier
sechs. Welche drei das sind, ist ebenfalls offen.

**Videos im Archiv.** Im Bestand liegt ein einzelnes Teaservideo
(`nextbed-preview.mp4`), das sich auf 46 Seiten wiederholt. Entweder bekommt
jedes Projekt einen eigenen Teaser oder keines - dasselbe Video ueberall ist
schlechter als gar keins.

---

## Alle 40 Projekte nach Cluster

### Food, Beverage & Hospitality (7)

- **Baked** - Glutenfreie Lebensmittel als eigenständige Qualitätsmarke.  
  `/baked/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation
- **CA'N SORT** - Herkunft und Handwerk als ruhige Premium-Weinmarke.  
  `/can-sort/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation
- **Little Big Pasta** - Ein urbanes Gastronomiekonzept eigenständig positionieren.  
  `/little-big-pasta/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation
- **Noveltea** - Tee und Spirituose als überraschendes Genusserlebnis verbinden.  
  `/noveltea/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation, Aktivierung & Markenführung
- **Street Gourmet** - Foodtruck-Catering als starke, skalierbare Marke weiterentwickeln.  
  `/street-gourmet/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation, Aktivierung & Markenführung
- **the moc** - Robotik und Specialty Coffee als neue Erlebnisidee positionieren.  
  `/the-moc/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation, Aktivierung & Markenführung
- **we:celebrate Streetfood** - Einen großen Foodtruck-Caterer als konsistente Erlebnis- und Servicemarke.  
  `/we-celebrate-streetfood/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation, Aktivierung & Markenführung

### Finance & Professional Services (6)

- **AdSuits** - Eine Performance-Agentur mit eigenständigerer Identität.  
  `/adsuits/` - Identität & Designsystem, Website & Kommunikation
- **Boneß & Euteneuer** - Eine etablierte Steuerkanzlei zeitgemäß und nahbar positionieren.  
  `/boness-euteneuer/` - Identität & Designsystem, Website & Kommunikation
- **FinaPlus** - Gewachsene WealthTech-Qualität sichtbar und systemfähig machen.  
  `/finaplus/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation
- **MDB Finance** - Persönlichkeit und langfristiges Vertrauen im Finanzmarkt.  
  `/mdb-finance/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation
- **SOLIT Marketing** - Marketingkompetenz im Finanzumfeld schärfen und systematisieren.  
  `/solit-marketing/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation
- **System 360** - Komplexität erklären, ohne die notwendige Diskretion zu verlieren.  
  `/system-360/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation

### Technologie & Industrie (5)

- **Aconvia** - Technologieeinführung als verständliches Leistungsversprechen.  
  `/aconvia/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation
- **Digital2gether** - Digitale Beratung klarer und gemeinschaftlicher positionieren.  
  `/digital2gether/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation
- **Maleco** - Fachwissen und Nahbarkeit für eine gewachsene Zielgruppe.  
  `/maleco/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation
- **NOEY Solutions** - Robotiknutzen für den industriellen Mittelstand auf den Punkt bringen.  
  `/noey-solutions/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation
- **be.care** - IT-Leistung menschlich und verständlich erzählen.  
  `/becare/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation

### Gesundheit & Care (5)

- **GET.ON** - Ein komplexes Gesundheitsangebot neu ordnen und zugänglich machen.  
  `/get-on/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation
- **Kinderzahnarzt Wackelzahn** - Ein skalierbares Kinderzahnarzt-Konzept mit Vertrauen aufbauen.  
  `/kinderzahnarzt-wackelzahn/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation, Aktivierung & Markenführung
- **Lieblings-Zahnarzt** - Eine moderne Praxisidee als wiedererkennbare Marke etablieren.  
  `/lieblings-zahnarzt/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation, Aktivierung & Markenführung
- **SKNMETRICS** - Den Wert eines AI- und Hautanalyse-Angebots vor der Technologie erklären.  
  `/sknmetrics/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation
- **hy helpyourself** - Selbsttests als zugängliche und selbstbestimmte Gesundheitsmarke.  
  `/hy-help-yourself/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation

### Arbeit, Bildung & Community (5)

- **Highr** - Berufliche Entwicklung zwischen Menschen und Unternehmen vermitteln.  
  `/highr/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation
- **Klang2** - Akustisches Wissen spielerisch und visuell erfahrbar machen.  
  `/klang2/` - Identität & Designsystem, Website & Kommunikation
- **Luis + Lea** - Ernährungsbildung für Kita-Kinder als lebendiges Programm.  
  `/luis-lea/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation, Aktivierung & Markenführung
- **Project Haya** - Einen Raum für Kreativschaffende als eigenständige Marke aufbauen.  
  `/project-haya/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation
- **me – my life, my job** - Berufliche Orientierung über Beziehung und Vertrauen erzählen.  
  `/me-my-life-my-job/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation

### Architektur, Immobilien & Räume (4)

- **BGF+ Architekten** - Gewachsene Architekturqualität im Auftritt sichtbar machen.  
  `/bgf-architekten/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation
- **Conlivo** - Veränderung in einem konservativen Markt glaubwürdig einführen.  
  `/konzept/projekte/conlivo/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation, Aktivierung & Markenführung
- **Immofolia** - Digitale Immobilienleistung vertrauenswürdig und verständlich machen.  
  `/immofolia/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation
- **medium Architekten** - Marke und gewachsene Architekturqualität angleichen.  
  `/medium-architekten/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation

### Kultur, Medien & Entertainment (4)

- **Cologne Comedy Festival** - Ein skalierbares System für Festival, Artists und Orte.  
  `/cologne-comedy-festival/` - Identität & Designsystem, Website & Kommunikation, Aktivierung & Markenführung
- **Good Humor** - Ein neues Entertainment-Label mit eigenständigem Profil.  
  `/good-humor/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation
- **Potatohead Pictures** - Eine neue Produktionsmarke mit klarer Haltung und Persönlichkeit.  
  `/potatohead/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation
- **pause and play** - Eine Event- und Erlebnismarke strategisch und visuell neu aufstellen.  
  `/pause-and-play/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation, Aktivierung & Markenführung

### Consumer, Retail & Lifestyle (4)

- **Mine Mina** - Eine hochwertige Taschenmarke zwischen Design und Fairness.  
  `/mine-mina/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation
- **Nextbed** - Eine neue Produktmarke aus bestehender Unternehmenssubstanz.  
  `/nextbed/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation, Aktivierung & Markenführung
- **Poodlewohl** - Die Beziehung zwischen Mensch und Tier als Marke erzählen.  
  `/poodlewohl/` - Strategie & Positionierung, Identität & Designsystem, Website & Kommunikation
- **ergobag** - Von der jungen Produktidee zur international etablierten Schulrucksack-Marke.  
  `/ergobag/` - Strategie & Positionierung, Identität & Designsystem, Aktivierung & Markenführung
