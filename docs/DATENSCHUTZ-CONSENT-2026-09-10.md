# Datenschutz- und Consent-Abgleich · 10.09.2026

## Ergebnis

Die Relaunch-Website besitzt jetzt eine technische Einwilligungsschranke im
Basic Consent Mode. Ohne Zustimmung wird kein externer Analyse- oder
Marketingdienst aus dem Browser geladen. Die Datenschutzerklärung wurde gegen
den tatsächlichen Code, das Vercel-Deployment und den bestehenden
GTM-Container abgeglichen.

Das ist eine technische und redaktionelle Vorbereitung, keine anwaltliche
Freigabe. Der Launchstatus bleibt für Datenschutz **gelb**, bis die unten
genannten Konto- und Containerprüfungen bestätigt sind.

## Tatsächlicher Integrationsstand

| Dienst | Rolle im Relaunch | Consent-Kategorie | Verhalten vor Zustimmung |
|---|---|---|---|
| Vercel | Hosting und eigenes Video-CDN | technisch notwendig | wird für die Seitenauslieferung genutzt |
| Google Tag Manager | Verwaltung optionaler Tags | Statistik oder Marketing | wird nicht geladen |
| Google Analytics 4 | Nutzungs- und Kontaktpfadanalyse | Statistik | wird nicht geladen |
| Microsoft Clarity | Heatmaps und Sitzungswiedergaben | Statistik | wird nicht geladen |
| Google Ads | Anzeigenattribution und Kontaktklicks | Marketing | wird nicht geladen |
| LinkedIn Insight | Kampagnenattribution | Marketing | wird nicht geladen |
| Microsoft Advertising | Anzeigenattribution | Marketing | wird nicht geladen |
| Search Console | aggregierte Suchdaten | keine Browser-Einbindung | kein Script und kein Cookie |
| Calendly | externe Terminbuchung | erst auf externer Seite | nur Link, kein Embed |
| Sortlist | Trusted Partner Badge und externer Lead-Herkunftskanal | Marketing & externe Inhalte | Badge-Script wird nicht geladen; Profil bleibt als normaler Link erreichbar |
| YouTube | nicht verwendet | keine | keine Einbettung |

## Implementiert

- Google Consent Mode mit `analytics_storage`, `ad_storage`, `ad_user_data`
  und `ad_personalization`, standardmäßig jeweils `denied`.
- Externer GTM-Abruf erst nach einer aktiven Statistik- oder
  Marketingentscheidung; kein consent-umgehendes `noscript`-Iframe.
- Clarity Consent API V2 passend zu Statistik- und Marketingauswahl.
- Gleichwertige Erstebenen-Aktionen „Nur notwendige“ und „Alle akzeptieren“.
- Detailauswahl für Statistik und Marketing; Notwendig ist transparent als
  immer aktiv gekennzeichnet.
- Das dynamische Sortlist Trusted Partner Badge lädt erst nach einer aktiven
  Einwilligung in „Marketing & externe Inhalte“. Die Consent-Version wurde
  deshalb auf 2 erhöht; frühere Auswahlstände werden nicht stillschweigend
  auf den neu hinzugekommenen Dienst erweitert.
- Bedienung per Tastatur, Escape, Fokusfalle im Einstellungsdialog,
  sichtbare Fokuszustände und reduzierte Animation bei
  `prefers-reduced-motion`.
- Auswahl für 180 Tage; Widerruf und Änderung über jede Footer-Instanz sowie
  direkt auf der Datenschutzseite.
- Bestmögliches Löschen bekannter First-Party-Analyse-Cookies bei Widerruf
  und Seitenneuladung, damit bereits geladene Drittanbieter-Scripte beendet
  werden.
- Vercel-Header für reduzierte Referrer-Weitergabe, MIME-Schutz und gesperrte
  Kamera-, Mikrofon- und Geolocation-Berechtigungen.
- Die 13 dekorativen Intro-Schriften werden als 26 lokale WOFF2-Dateien
  ausgeliefert; Google Fonts erhält beim Seitenaufruf keine Verbindung.
- Preflight-Regeln verhindern fehlende Consent-Scripte, falsche
  Ladereihenfolge und direkte Tracker-/Embed-Bypässe.

## GTM-Gauntlet

Der per API gelesene Live-Container `GTM-N8223FX`, Version 39, enthält 28 Tags,
davon 19 aktiv. Die aktiven Tags sind noch über Borlabs-Cookie-Variablen
gesperrt und haben überwiegend keine nativen Consent-Anforderungen gesetzt.
Der Relaunch schreibt deshalb eine kompatible Consent-Struktur und stellt die
beiden von der alten GTM-Vorlage erwarteten Borlabs-API-Abfragen bereit, gibt
darüber aber ausschließlich die oben benannten Dienste frei.

Am 11.09.2026 wurden die nicht mehr verwendeten Tags `fb_main_tag`,
`fb_contact_tag` und `hs_main_tag` in einem separaten Arbeitsbereich pausiert
und als Version 39 veröffentlicht. Der API-Vergleich gegen Version 38 bestätigt,
dass sich dabei kein anderer Tagstatus verändert hat.

### Consent-Verhalten nach GTM-Version 39

| Auswahl | Beobachtete externe Tags |
|---|---|
| keine Entscheidung / alle abgelehnt | keine; selbst der GTM-Container wird nicht geladen |
| nur Statistik | GA4 und Clarity; kein LinkedIn oder Microsoft Ads |
| nur Marketing | LinkedIn, Microsoft Ads und Sortlist-Badge; kein GA4 oder Clarity |
| alle akzeptiert | GA4, Clarity, LinkedIn, Microsoft Ads und Sortlist-Badge |

Google-Ads-Conversion-Tags sind ereignisgebunden und erscheinen erst bei den
dafür vorgesehenen Kontaktklicks. Die Browser-Abnahme der vier Zustände lief
gegen Version 38 in einem frischen Browser-Origin ohne vorhandene Einwilligung;
die Browserkonsole blieb ohne Fehler. Für Version 39 weist der API-Diff
ausschließlich die drei Pausierungen aus, weshalb das Verhalten der übrigen
Tags unverändert ist. Ein abschließender Tag-Assistant-Lauf bleibt Teil der
Livegang-Abnahme.

## Vor Livegang extern bestätigen

1. Alte Universal-Analytics-Tags dauerhaft pausiert lassen.
2. Übrige Tags auf native Consent Checks umstellen oder die bestehende
   Sperrlogik bewusst dokumentiert beibehalten.
3. Mit Google Tag Assistant vier Zustände prüfen: keine Auswahl, Ablehnung,
   nur Statistik, nur Marketing sowie alle akzeptiert.
4. Im Browser-Netzwerk prüfen, dass vor Zustimmung keine Requests an Google,
   Microsoft, LinkedIn oder Sortlist stattfinden.
5. In Clarity kontrollieren, dass Maskierung und Consent API V2 im Projekt
   wirksam sind.
6. Aufbewahrungsfristen in GA4, Google Ads, Clarity, LinkedIn und Microsoft
   Ads festlegen und mit der Datenschutzerklärung abstimmen.
7. Auftragsverarbeitungsverträge, Verantwortlichkeiten und internationale
   Übermittlungsmechanismen für Vercel, Google und Microsoft dokumentieren;
   bei Nutzung zusätzlich LinkedIn und Microsoft Advertising.
8. Datenschutzerklärung juristisch final prüfen lassen, insbesondere
   Dienstumfang, Speicherdauern und Drittlandübermittlungen.

## Reproduzierbare technische Prüfung

```bash
python3 tools/seo-gauntlet.py
python3 tools/technical-preflight.py
```

Der technische Preflight prüft alle 129 Sitemap-Seiten. Die Konto- und
Vertragsprüfungen sind dagegen nicht aus dem Repository automatisierbar.
