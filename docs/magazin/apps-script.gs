/**
 * CONCRETE Magazin – Lead-Empfänger für das Google Sheet „CONCRETE Magazin – Leads"
 * Apps-Script-Projekt „CONCRETE Magazin Leads“ (wolfram@concrete-designs.de), Web-App:
 * Ausführen als Ich · Zugriff Jeder. Nach Code-Änderungen: Bereitstellen → Bereitstellungen
 * verwalten → Bearbeiten → Version „Neue Version“ → Bereitstellen (URL bleibt gleich).
 */
const SHEET_ID = "1CY83EvoaE2A5o_QgSnERNTB5OiBRW7jZbT9N7RalHWA";
const NOTIFY = "wolfram@concrete-designs.de";                 // Benachrichtigung bei jedem Lead

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents || "{}");
    if (d.website) return out("ignored");                       // Honeypot gegen Bots
    const email = String(d.email || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return out("invalid");
    const clean = v => String(v || "").replace(/^[=+\-@]/, "'$&").slice(0, 300);  // keine Formeln
    const ss = SpreadsheetApp.openById(SHEET_ID);
    if (ss.getSpreadsheetTimeZone() !== "Europe/Berlin") ss.setSpreadsheetTimeZone("Europe/Berlin");
    const sheet = ss.getSheets()[0];
    const HEAD = ["Zeitstempel", "Anfrage", "Name", "Unternehmen", "E-Mail", "Situation", "Adresse", "Quelle", "Seite"];
    if (sheet.getRange(1, 2).getValue() !== HEAD[1]) {           // Kopfzeile einmalig auf das neue Format setzen
      sheet.getRange(1, 1, 1, sheet.getMaxColumns()).clearContent();
      sheet.getRange(1, 1, 1, HEAD.length).setValues([HEAD]).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    const row = [new Date(), clean(d.type || "PDF"), clean(d.name), clean(d.company), clean(email),
      clean(d.situation), clean(d.address), clean(d.source), clean(d.page)];
    sheet.appendRow(row);
    notify(row);
    return out("ok");
  } catch (err) {
    return out("error");
  }
}

function notify(r) {
  try {
    const [, type, name, company, email, situation, address, source, page] = r;
    const post = type === "Post";
    MailApp.sendEmail({
      to: NOTIFY,
      replyTo: email,
      name: "CONCRETE Magazin",
      subject: `${post ? "📬 Druckausgabe angefordert" : "📄 PDF heruntergeladen"}: ${name}${company ? " · " + company : ""}`,
      body: [
        post ? "Jemand hat das gedruckte Magazin angefordert – bitte verschicken:" : "Jemand hat das Magazin als PDF heruntergeladen:",
        "",
        `Name:         ${name}`,
        `Unternehmen:  ${company || "–"}`,
        `E-Mail:       ${email}`,
        `Situation:    ${situation || "–"}`,
        post ? `Adresse:      ${address}` : null,
        "",
        `Quelle: ${source} · ${page}`,
        "",
        `Alle Leads: https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`,
        "Auf diese Mail antworten schreibt direkt an den Lead."
      ].filter(l => l !== null).join("\n")
    });
  } catch (err) {}                                               // Sheet-Eintrag bleibt auch ohne Mail erhalten
}

function out(s) { return ContentService.createTextOutput(s); }

// Einmal im Editor ausführen, um Mail- und Tabellenzugriff freizugeben (nach Scope-Änderungen)
function freigabe() {
  MailApp.getRemainingDailyQuota();
  SpreadsheetApp.openById(SHEET_ID).getName();
}
