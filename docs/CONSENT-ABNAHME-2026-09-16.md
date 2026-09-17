# Consent-Vorbereitung · Übergabe an ADSUITS

Stand: 16.09.2026. Scope: Consent-UX und Signalübergabe auf der neuen statischen
Website, nicht Ads-Optimierung oder rechtliche Zertifizierung.

## Ergebnis der Vorbereitung

- `consent-v9.js` liegt genau einmal im Head jeder der 131 Sitemap-Seiten,
  vor `site.js`. Alle Seiten laden CSS/JS mit `v=174`.
- Homepage: Modal 200 ms nach Ende der kurzen Bild-/Schrift-Reel-Sequenz;
  der folgende Video-Loop darf weiterlaufen. Fallback spätestens 8 Sekunden
  nach DOM-Aufbau. Direkte Unterseiten: ohne Hero-Verzögerung.
- Zentriertes Paper-/Ink-Modal, dunkelgraues Overlay, gleichwertiges Annehmen
  und Ablehnen. Bei beiden Entscheidungen wird die Seite freigegeben.
- Fokusführung, Tab/Shift-Tab, Escape, mobile Höhenbegrenzung mit internem
  Scrollen, Reduced Motion, Speicherung und Footer-Wiederöffnung vorbereitet.
- Consent Mode startet mit den vier Google-Signalen `denied`. Auswahl und
  Borlabs-Brücke werden vor dem optionalen GTM-Loader aktualisiert. GTM-Live-
  Version 40 wurde read-only hinsichtlich der Borlabs-Service-Namen geprüft;
  der Container wurde durch diesen Website-Patch nicht verändert/publiziert.

## Vertrag für Marcel: frisches Browserprofil je Zeile

| Auswahl | analytics_storage | ad_storage / ad_user_data / ad_personalization | Borlabs GA4 / Clarity | Borlabs Ads | Radar |
|---|---|---|---|---|---|
| Noch keine | denied | denied | false | false | aus |
| Alle ablehnen | denied | denied | false | false | aus |
| Nur Statistik | granted | denied | true | false | aus |
| Nur Marketing | denied | granted | false | true | an |
| Alle akzeptieren | granted | granted | true | true | an |

GTM `GTM-N8223FX` wird im bestehenden Basic-Modus nur geladen, sobald mindestens
eine optionale Kategorie zugestimmt wurde. Vorher ist ein fehlender GTM-Request
erwartet, kein Fehler. SalesViewer ist separat und unverändert unabhängig von
dieser Auswahl aktiv; darauf wird im Modal verwiesen. Das ist keine erneute
rechtliche Freigabe des Dienstes. Keine Migration auf Advanced Consent Mode.

GTM-Kompatibilität: `BorlabsCookie.checkCookieConsent(serviceName)` und
`BorlabsCookie.Consents.hasConsent(serviceName)`; Statistik: `google-analytics`,
`microsoft-clarity`; Marketing: `google-ads`, `linkedininsighttag`,
`microsoft-advertising`, `sortlist-radar`, `sortlist-badge`.
Website-Event: `concrete_consent_update` mit Kategorie-Booleans.
Speicherung: `concrete-consent-v4` plus `borlabs-cookie`, maximal 180 Tage.

## Gauntlet-Nachweise und Grenzen

- `node --check consent-v9.js` und `node --check site.js`: erfolgreich.
- `python3 tools/technical-preflight.py`: 131 Seiten, 0 Befunde.
- `python3 tools/seo-gauntlet.py`: 131 Seiten, 0 Befunde.
- Browser: 15 Testgruppen unter `tools/consent-gauntlet.cjs`, alle bestanden.
  Alle vier Auswahlen, Google-Update-Reihenfolge, Borlabs-Dienste, einmalige
  Loader, Cookie-Struktur, Wiederbesuch, Footer, Fokus/Inert, Escape, kaputte
  Speicherung, Ablauf, Hero-Event/Fallback, 390×844, 320×568 sowie 720×500
  Reflow, Reduced Motion, Teil-/Vollwiderruf und verzögerte Clarity-Antworten.
  Fixtures ersetzen externe Tracking-Antworten und erzeugen keine echten Leads.
- Visueller Pass mit `agent-browser`: echte lokale Startseite und
  Erstgespräch-Seite, Desktop und Mobile. Keine neue Website-Gestaltung außerhalb
  des Consent-Modals; bestehende Hero-Animation bleibt erhalten.
- Globaler Skill-Baseline-Scanner ist nicht clean-URL-/Vercel-bewusst und
  meldet deshalb zahlreiche `.html`-/Sitemap-Abweichungen; dafür gelten die
  repositoryeigenen, routingbewussten Checks. Bestehende größere Bilder,
  einzelne Überschriften-Sprünge und fehlende gestaltete 404 liegen außerhalb
  dieser Consent-Änderung. Kein neuer CWV-, Screenreader- oder Rechts-Audit.

Wiederholung: Playwright muss im Node-Suchpfad installiert sein, dann
`node tools/consent-gauntlet.cjs`; alternativ `NODE_PATH=/pfad/node_modules`.
Keine Abhängigkeiten oder Schlüssel sind im Website-Frontend enthalten.

## Live-Abnahme durch Marcel

1. Frischer Inkognito-Browser auf Homepage sowie direktem Einstieg
   `/erstgespraech` und `/branding-designagentur-hamburg`. Zeitnahe Auswahl,
   mobile Bedienung und Wiederbesuch prüfen.
2. Alle Matrix-Zeilen in Tag Assistant/GTM Preview kontrollieren: Consent-
   Reihenfolge, tatsächliche Borlabs-Variablen, Blocking-Trigger und ausgelöste
   GA4-/Ads-/Clarity-Tags. Nicht nur das Vorhandensein eines Scripts prüfen.
3. Nur Statistik: GA4/Clarity zulässig, Ads blockiert. Nur Marketing: Ads
   zulässig, GA4/Clarity blockiert. Geänderte Auswahl muss auf Folgeseiten gelten.
4. Footer öffnen, Teil-/Vollwiderruf testen: aktualisierte Consent-Signale,
   kategorieweise Bereinigung eigener lesbarer Cookies, Reload gegen bereits
   geladene Tracker. Drittanbieter-/HttpOnly-Cookies sind nicht global löschbar.
5. Nach Zustimmung echte kontrollierte Erstgespräch-Buchung mit markierter
   Testquelle durchführen. GA4 DebugView, Journey-ID/UTM und Calendly-
   Terminart prüfen; Zweitgespräche nicht als Erstkontakt zählen. Diese Buchung
   wurde durch den Gauntlet nicht ausgeführt.
6. Befunde mit URL, Auswahl, Consent-Status, Tag-Name und Screenshot zurückgeben.
   Keine pauschale Entfernung aller Blocking-Trigger ohne belegten Fehler.

## Rollback

Vorherige Version bleibt als `consent-v8.js` vorhanden. Bei bestätigter Regression
den gesamten Consent-Patch als gezielten Git-Revert zurücknehmen, mit neuer
Asset-Version neu deployen und erneut live prüfen; keine ungetesteten
Einzelfile-Mischstände und keine Änderung der Kampagnen/Budgets.
