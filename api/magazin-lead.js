const UPSTREAM_URL = process.env.MAGAZIN_LEAD_UPSTREAM ||
  "https://script.google.com/macros/s/AKfycbz99y9XNuqNqzUdn3V0yvEqoR9G_dSF1zA_a28CBPz7A9I4g_m1JnlE9R9-f7z8973k/exec";

const NEWSLETTER_CONSENT = "Ab und zu Impulse zu Marke & B2B per E-Mail – höchstens einmal im Monat, jederzeit abbestellbar.";

function text(value, max = 300) {
  return String(value || "").trim().slice(0, max);
}

function normalizeLead(input = {}, referer = "") {
  const print = input.print && typeof input.print === "object" ? input.print : null;
  const type = String(input.type || "").toLowerCase() === "post" || print ? "Post" : "PDF";
  const newsletter = input.newsletter === true;
  const contact = input.contact === true || newsletter;
  const source = text(input.source || "website");

  return {
    type,
    name: text(input.name || print?.name),
    company: text(input.company || print?.company),
    email: text(input.email),
    situation: text(input.situation || input.topic),
    address: type === "Post" ? text(input.address || print?.address) : "",
    contact,
    consentText: contact ? text(input.consentText || (newsletter ? NEWSLETTER_CONSENT : "")) : "",
    source: print && !source.startsWith("epaper") ? `epaper / ${source}` : source,
    page: text(input.page || referer, 500),
    website: text(input.website)
  };
}

function validateLead(lead) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return "E-Mail-Adresse fehlt oder ist ungültig.";
  if (lead.type === "Post" && !lead.name) return "Für den Postversand fehlt der Name.";
  if (lead.type === "Post" && !lead.address) return "Für den Postversand fehlt die Anschrift.";
  return "";
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");

  let raw = "";
  for await (const chunk of req) raw += chunk;
  return JSON.parse(raw || "{}");
}

async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const requestId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    const input = await readBody(req);
    const lead = normalizeLead(input, req.headers?.referer || "");

    // Bots sollen keine Rückmeldung über den Honeypot erhalten.
    if (lead.website) return res.status(200).json({ ok: true, requestId });

    const validationError = validateLead(lead);
    if (validationError) return res.status(422).json({ ok: false, error: "invalid_lead", message: validationError, requestId });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    let upstream;
    try {
      upstream = await fetch(UPSTREAM_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify(lead),
        redirect: "follow",
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeout);
    }

    const result = (await upstream.text()).trim().toLowerCase();
    if (!upstream.ok || result !== "ok") {
      console.error("magazin_lead_upstream_error", { requestId, status: upstream.status, result });
      return res.status(502).json({ ok: false, error: "sheet_write_failed", requestId });
    }

    console.info("magazin_lead_stored", { requestId, type: lead.type, source: lead.source });
    return res.status(200).json({ ok: true, requestId });
  } catch (error) {
    console.error("magazin_lead_error", { requestId, name: error?.name || "Error" });
    return res.status(502).json({ ok: false, error: "lead_service_unavailable", requestId });
  }
}

handler.normalizeLead = normalizeLead;
handler.validateLead = validateLead;
module.exports = handler;

