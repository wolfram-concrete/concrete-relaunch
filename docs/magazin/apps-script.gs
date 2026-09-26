/**
 * CONCRETE Magazin – Lead-Empfänger für das Google Sheet „CONCRETE Magazin – Leads"
 *
 * Einrichtung (einmalig, ca. 3 Minuten):
 * 1. Sheet öffnen → Erweiterungen → Apps Script
 * 2. Diesen Code einfügen (alles ersetzen) → Speichern
 * 3. Bereitstellen → Neue Bereitstellung → Typ „Web-App"
 *      Ausführen als: Ich · Zugriff: Jeder
 * 4. Zugriff autorisieren → die angezeigte Web-App-URL (…/exec) kopieren
 * 5. URL in epaper/embed/magazin-popup.js und epaper/index.html bei LEAD_ENDPOINT eintragen
 */
const SHEET_ID = "1CY83EvoaE2A5o_QgSnERNTB5OiBRW7jZbT9N7RalHWA";

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents || "{}");
    if (d.website) return out("ignored");                       // Honeypot gegen Bots
    const email = String(d.email || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return out("invalid");
    const clean = v => String(v || "").replace(/^[=+\-@]/, "'$&").slice(0, 300);  // keine Formeln
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    const HEAD = ["Zeitstempel", "Anfrage", "Name", "Unternehmen", "E-Mail", "Situation", "Adresse", "Quelle", "Seite"];
    if (sheet.getRange(1, 2).getValue() !== HEAD[1]) {           // Kopfzeile einmalig auf das neue Format setzen
      sheet.getRange(1, 1, 1, sheet.getMaxColumns()).clearContent();
      sheet.getRange(1, 1, 1, HEAD.length).setValues([HEAD]).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([
      new Date(), clean(d.type || "PDF"), clean(d.name), clean(d.company), clean(email),
      clean(d.situation), clean(d.address), clean(d.source), clean(d.page)
    ]);
    return out("ok");
  } catch (err) {
    return out("error");
  }
}

function out(s) { return ContentService.createTextOutput(s); }
