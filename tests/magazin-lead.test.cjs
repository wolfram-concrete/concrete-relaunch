const test = require("node:test");
const assert = require("node:assert/strict");
const handler = require("../api/magazin-lead.js");

function response() {
  return {
    statusCode: 200,
    headers: {},
    payload: null,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; }
  };
}

test("normalisiert eine Printbestellung aus dem Popup", () => {
  const lead = handler.normalizeLead({
    type: "Post",
    name: "Ada Lovelace",
    company: "Analytical Engines",
    email: "ada@example.com",
    address: "Teststraße 1, 20095 Hamburg",
    source: "popup",
    page: "https://www.concrete-designs.de/"
  });

  assert.equal(lead.type, "Post");
  assert.equal(lead.name, "Ada Lovelace");
  assert.equal(lead.address, "Teststraße 1, 20095 Hamburg");
  assert.equal(handler.validateLead(lead), "");
});

test("überführt das bisherige E-Paper-Printformat in eine echte Postbestellung", () => {
  const lead = handler.normalizeLead({
    email: "ada@example.com",
    topic: "wachstum",
    newsletter: true,
    source: "popup",
    print: {
      name: "Ada Lovelace",
      company: "Analytical Engines",
      address: "Teststraße 1, 20095 Hamburg"
    }
  });

  assert.equal(lead.type, "Post");
  assert.equal(lead.source, "epaper / popup");
  assert.equal(lead.contact, true);
  assert.match(lead.consentText, /Impulse/);
  assert.equal(handler.validateLead(lead), "");
});

test("weist unvollständige Printbestellungen zurück", () => {
  const lead = handler.normalizeLead({ type: "Post", email: "ada@example.com", name: "Ada Lovelace" });
  assert.match(handler.validateLead(lead), /Anschrift/);
});

test("bestätigt dem Browser erst den erfolgreichen Sheet-Write", async () => {
  const originalFetch = global.fetch;
  let forwarded;
  global.fetch = async (_url, options) => {
    forwarded = JSON.parse(options.body);
    return { ok: true, status: 200, text: async () => "ok" };
  };

  try {
    const req = {
      method: "POST",
      headers: { referer: "https://www.concrete-designs.de/" },
      body: {
        type: "Post",
        name: "Ada Lovelace",
        email: "ada@example.com",
        address: "Teststraße 1, 20095 Hamburg",
        source: "popup"
      }
    };
    const res = response();
    await handler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.payload.ok, true);
    assert.equal(forwarded.type, "Post");
    assert.equal(forwarded.page, "https://www.concrete-designs.de/");
  } finally {
    global.fetch = originalFetch;
  }
});

test("meldet einen fehlgeschlagenen Sheet-Write als Fehler", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({ ok: true, status: 200, text: async () => "error" });

  try {
    const req = {
      method: "POST",
      headers: {},
      body: {
        type: "Post",
        name: "Ada Lovelace",
        email: "ada@example.com",
        address: "Teststraße 1, 20095 Hamburg"
      }
    };
    const res = response();
    await handler(req, res);

    assert.equal(res.statusCode, 502);
    assert.equal(res.payload.ok, false);
    assert.equal(res.payload.error, "sheet_write_failed");
  } finally {
    global.fetch = originalFetch;
  }
});

