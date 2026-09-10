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
| Sortlist | externer Lead-Herkunftskanal | keine Browser-Einbindung | kein Script, Widget oder Pixel |
| YouTube | nicht verwendet | keine | keine Einbettung |
| Facebook/Meta | nicht verwendet | keine | erhält nie eine Freigabe |
| HubSpot | nicht verwendet | keine | erhält nie eine Freigabe |

## Implementiert

- Google Consent Mode mit `analytics_storage`, `ad_storage`, `ad_user_data`
  und `ad_personalization`, standardmäßig jeweils `denied`.
- Externer GTM-Abruf erst nach einer aktiven Statistik- oder
  Marketingentscheidung; kein consent-umgehendes `noscript`-Iframe.
- Clarity Consent API V2 passend zu Statistik- und Marketingauswahl.
- Gleichwertige Erstebenen-Aktionen „Nur notwendige“ und „Alle akzeptieren“.
- Detailauswahl für Statistik und Marketing; Notwendig ist transparent als
  immer aktiv gekennzeichnet.
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

Der per API gelesene Live-Container `GTM-N8223FX`, Version 38, enthält 28 Tags,
davon 22 aktiv. Die aktiven Tags sind noch über Borlabs-Cookie-Variablen
gesperrt und haben überwiegend keine nativen Consent-Anforderungen gesetzt.
Der Relaunch schreibt deshalb eine kompatible Consent-Struktur und stellt die
beiden von der alten GTM-Vorlage erwarteten Borlabs-API-Abfragen bereit, gibt
darüber aber ausschließlich die oben benannten Dienste frei.

Wichtig: Zwei Facebook-Tags und ein HubSpot-Tag sind im Container weiterhin
als aktiv markiert. Sie werden im Relaunch durch die fehlende Servicefreigabe
blockiert, sollten aber trotzdem vor dem Domainwechsel im Container pausiert
und in einer neuen Version veröffentlicht werden. So wird die Konfiguration
verständlich und bleibt nicht von einer Alt-Sperrlogik abhängig.

### Browser-Abnahme gegen GTM-Version 38

| Auswahl | Beobachtete externe Tags |
|---|---|
| keine Entscheidung / alle abgelehnt | keine; selbst der GTM-Container wird nicht geladen |
| nur Statistik | GA4 und Clarity; kein LinkedIn, Microsoft Ads, Facebook oder HubSpot |
| nur Marketing | LinkedIn und Microsoft Ads; kein GA4, Clarity, Facebook oder HubSpot |
| alle akzeptiert | GA4, Clarity, LinkedIn und Microsoft Ads; kein Facebook oder HubSpot |

Google-Ads-Conversion-Tags sind ereignisgebunden und erscheinen erst bei den
dafür vorgesehenen Kontaktklicks. Die Abnahme lief in einem frischen
Browser-Origin ohne vorhandene Einwilligung; die Browserkonsole blieb in allen
Zuständen ohne Fehler.

## Vor Livegang extern bestätigen

1. Facebook- und HubSpot-Tags im GTM pausieren/entfernen; alte Universal-
   Analytics-Tags dauerhaft pausiert lassen.
2. Übrige Tags auf native Consent Checks umstellen oder die bestehende
   Sperrlogik bewusst dokumentiert beibehalten.
3. Mit Google Tag Assistant vier Zustände prüfen: keine Auswahl, Ablehnung,
   nur Statistik, nur Marketing sowie alle akzeptiert.
4. Im Browser-Netzwerk prüfen, dass vor Zustimmung keine Requests an Google,
   Microsoft, LinkedIn oder Meta stattfinden.
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
