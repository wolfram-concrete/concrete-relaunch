# Kontaktformular auf der Homepage – Vercel-Implementierungsplan

**Status:** geplant, nicht implementiert  
**Stand:** 12. September 2026

## Ausgangslage

Die Homepage zeigt unter „Was verändert sich gerade bei euch?“ aktuell einen
Fit-Check mit diesen sichtbaren Eingaben:

- Aufgabe (`#fc-aufgabe`)
- Unternehmen (`#fc-unternehmen`)
- Zeitrahmen (`#fc-zeit`)
- Investitionsrahmen (`#fc-invest`)

Technisch ist der Bereich noch kein sendefähiges Formular:

- Es gibt kein `<form>`-Element und keine `name`-Attribute.
- Die Eingaben werden nicht serverseitig verarbeitet.
- „Termin buchen“ ist ein Link auf `erstgespraech.html`, kein Submit-Button.
- Name, E-Mail-Adresse, Nachricht und Datenschutzbestätigung fehlen für eine
  belastbare Kontaktanfrage.
- Es existiert noch kein API-Endpunkt und kein E-Mail-Provider im Projekt.

Diese Datei ist ausschließlich ein Umsetzungsplan. In diesem Arbeitsschritt
wurden weder Formularlogik noch E-Mail-Versand eingebaut.

## Vorgeschlagene Architektur

1. Den bestehenden Fit-Check in ein semantisches `<form method="post">`
   überführen, ohne die vorhandene Gestaltung unnötig zu verändern.
2. Einen serverseitigen Vercel Function-Endpunkt, zum Beispiel
   `POST /api/contact`, anlegen.
3. E-Mails ausschließlich serverseitig über einen freigegebenen Provider
   versenden. Für ein kleines statisches Projekt ist eine direkte HTTPS-API
   ohne Client-Geheimnisse ausreichend; Resend wäre eine mögliche, noch
   freizugebende Option.
4. Den Browser nur strukturierte Formulardaten an den eigenen Endpoint senden
   lassen. API-Schlüssel dürfen niemals in HTML, Browser-JavaScript oder einer
   `NEXT_PUBLIC_*`-Variable stehen.
5. Auf Erfolg eine klare Bestätigung anzeigen; bei Fehlern Eingaben erhalten
   und eine verständliche, per `aria-live` angekündigte Meldung ausgeben.

## Benötigte Formularfelder

Die finale redaktionelle Freigabe ist noch offen. Technisch empfohlen:

- Aufgabe – Auswahl, erforderlich
- Unternehmen – Text, erforderlich
- Name/Ansprechperson – Text, erforderlich
- geschäftliche E-Mail – E-Mail, erforderlich
- Telefon – optional
- Zeitrahmen – Auswahl, erforderlich
- Investitionsrahmen – Auswahl, optional oder erforderlich nach Entscheidung
- Nachricht/Projektkontext – Mehrzeilentext, erforderlich
- Datenschutzbestätigung mit Link zu `datenschutz.html` – erforderlich
- unsichtbares Honeypot-Feld – nur als zusätzliches Spam-Signal

Alle Felder brauchen eindeutige `label`-, `id`- und `name`-Werte,
serverseitige Längenlimits und verständliche Validierungsfehler. Browserseitige
Validierung verbessert die Bedienung, ersetzt aber nie die Servervalidierung.

## Vorgesehene Vercel-Environment-Variablen

Namen und Provider müssen vor der Implementierung final freigegeben werden.
Empfohlene Trennung:

| Variable | Zweck | Sichtbarkeit |
|---|---|---|
| `CONTACT_EMAIL_TO` | internes Empfängerpostfach | nur Server |
| `CONTACT_EMAIL_FROM` | verifizierter Absender der Website | nur Server |
| `CONTACT_EMAIL_SUBJECT_PREFIX` | eindeutiger Betreffpräfix | nur Server |
| `RESEND_API_KEY` oder Provider-Äquivalent | E-Mail-API-Authentifizierung | geheim, nur Server |
| `TURNSTILE_SECRET_KEY` | optionaler serverseitiger Bot-Schutz | geheim, nur Server |
| `CONTACT_ALLOWED_ORIGIN` | erwartete Production-Origin | nur Server |

Falls Cloudflare Turnstile oder ein vergleichbarer Dienst verwendet wird,
kommt zusätzlich ein öffentlicher Site-Key in die Client-Konfiguration. Dieser
ist nicht geheim; Datenschutz, Consent und Content Security Policy sind vorab
zu prüfen.

Die Variablen sollen getrennt für Production und Preview hinterlegt werden.
Preview muss an ein Testpostfach senden und darf keine echten Leads an das
Produktionspostfach schicken. Geheimwerte werden über Vercel CLI/Dashboard
eingetragen, nie in Git committed und nie in Dokumentation ausgeschrieben.

Beispiel für die spätere Einrichtung, noch nicht ausführen bevor Provider,
Adressen und Umgebungen freigegeben sind:

```bash
vercel env add CONTACT_EMAIL_TO production
vercel env add CONTACT_EMAIL_FROM production
vercel env add RESEND_API_KEY production --sensitive
```

## Serverseitige Anforderungen

- Nur `POST` akzeptieren; andere Methoden mit 405 beantworten.
- `Content-Type`, Payload-Größe, Feldtypen, Pflichtfelder und Längen prüfen.
- E-Mail-Adressen normalisieren und validieren; Header-Injection verhindern.
- Nutzereingaben sicher als Text/HTML escapen.
- Absender immer die verifizierte eigene Domain sein lassen; Nutzeradresse nur
  als `Reply-To` verwenden.
- Origin/Host prüfen und CORS nicht pauschal öffnen.
- Honeypot plus Rate Limit und bei Bedarf Turnstile einsetzen.
- Keine vollständigen Anfrageinhalte oder personenbezogenen Daten in Vercel-
  Logs schreiben.
- Nach Provider-Timeouts und Fehlern keine falsche Erfolgsmeldung ausgeben.
- Eine technische Request-ID zurückgeben, aber keine internen Fehlerdetails.
- Optional eine Eingangsbestätigung an den Absender senden, erst nach
  redaktioneller und datenschutzrechtlicher Freigabe.

## Datenschutz und Betrieb

- E-Mail-Provider, Auftragsverarbeitung, Datenstandort und Löschfristen prüfen.
- Datenschutzerklärung um Formularzweck, Rechtsgrundlage, Empfänger/Provider,
  Speicherdauer und Betroffenenrechte ergänzen.
- Nur notwendige Daten erheben; Budget/Telefon als optional bewerten.
- Spam-/CAPTCHA-Dienst in Consent- und Datenschutzkonzept einordnen.
- Zustellbare Absenderdomain mit SPF, DKIM und gegebenenfalls DMARC absichern.
- Zustellfehler und Provider-Quota überwachen, ohne Anfrageinhalte zu loggen.
- Verantwortliches Empfängerpostfach und interne Reaktionszeit festlegen.

## Abnahmekriterien

- [ ] Formular ist mit Tastatur und Screenreader verständlich bedienbar.
- [ ] Pflicht- und Fehlerzustände funktionieren client- und serverseitig.
- [ ] Direkter ungültiger API-Request wird abgelehnt.
- [ ] Erfolgreiche Production-Anfrage erreicht genau das freigegebene Postfach.
- [ ] Preview-Anfragen erreichen ausschließlich das Testpostfach.
- [ ] `Reply-To` antwortet an die eingegebene Adresse, ohne Spoofing des From-Headers.
- [ ] Doppelklick oder Retry erzeugt möglichst keine Mehrfach-E-Mail.
- [ ] Honeypot/Rate Limit beziehungsweise gewählter Bot-Schutz ist geprüft.
- [ ] Keine Secrets oder personenbezogenen Inhalte erscheinen im Client-Bundle,
      Repository oder Vercel-Log.
- [ ] SPF/DKIM und Versanddomain sind beim Provider verifiziert.
- [ ] Datenschutzerklärung und gegebenenfalls Consent-Konfiguration sind freigegeben.
- [ ] Erfolgs- und Fehlerzustände wurden mobil und auf Desktop getestet.
- [ ] Nach Deployment wurde ein realer End-to-End-Test dokumentiert.

## Offene Entscheidungen

- [ ] E-Mail-Provider auswählen und Vertrag/AVV prüfen.
- [ ] Empfänger- und Absenderadresse festlegen.
- [ ] Finale Pflichtfelder und Formulartexte freigeben.
- [ ] Entscheiden, ob das Formular direkt sendet, zusätzlich Calendly öffnet oder
      beide Wege klar getrennt anbietet.
- [ ] Spam-Schutz und Rate-Limit-Verfahren festlegen.
- [ ] Datenschutzerklärung und Löschprozess freigeben.
- [ ] Preview-/Production-Testpostfächer und Verantwortliche festlegen.

