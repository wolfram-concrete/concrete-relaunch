const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "..", "attribution-v3.js"), "utf8");

function loadTracker({ search = "", referrer = "", local = new Map(), consent = true } = {}) {
  const listeners = new Map();
  const window = {
    crypto: { getRandomValues(bytes) { bytes.fill(2); return bytes; } },
    dataLayer: [],
    CONCRETEConsent: { get: () => ({ statistics: consent, marketing: consent }) },
    addEventListener(name, callback) { listeners.set(name, callback); },
  };
  const document = {
    referrer,
    readyState: "complete",
    documentElement: {},
    querySelectorAll() { return []; },
    addEventListener() {},
  };
  const session = new Map();
  const context = vm.createContext({
    window,
    document,
    location: {
      search,
      hostname: "www.concrete-designs.de",
      href: `https://www.concrete-designs.de/${search}`,
      pathname: "/",
    },
    sessionStorage: {
      getItem(key) { return session.get(key) || null; },
      setItem(key, value) { session.set(key, value); },
    },
    localStorage: {
      getItem(key) { return local.get(key) || null; },
      setItem(key, value) { local.set(key, value); },
    },
    MutationObserver: class { observe() {} },
    URL,
    URLSearchParams,
    Uint8Array,
    Date,
  });
  vm.runInContext(source, context);
  return { tracker: window.CONCRETE_CALENDLY_ATTRIBUTION, listeners, window };
}

test("startet ohne Statistik- oder Marketing-Einwilligung nicht", () => {
  const result = loadTracker({ search: "?gclid=click-id", consent: false });
  assert.equal(result.tracker, undefined);
  assert.equal(result.listeners.has("concrete:consent-update"), true);
});

test("erhält Google Ads über einen direkten Folgebesuch in neuem Tab", () => {
  const local = new Map();
  loadTracker({ search: "?gclid=click-id", local });
  const repeat = loadTracker({ local });
  const url = new URL(repeat.tracker.decorate("https://calendly.com/concrete-brandbuilding/erstgespraech"));
  assert.equal(url.searchParams.get("utm_source"), "google");
  assert.equal(url.searchParams.get("utm_medium"), "cpc");
  assert.equal(url.searchParams.get("utm_campaign"), "auto-tagged");
  assert.match(url.searchParams.get("utm_content"), /^ctj_/);
});

test("speichert und übermittelt keine rohe Google Click-ID", () => {
  const local = new Map();
  const result = loadTracker({ search: "?gclid=secret-click-id", local });
  const serialized = [...local.values()].join(" ");
  const url = result.tracker.decorate("https://calendly.com/concrete-brandbuilding/erstgespraech");
  assert.equal(serialized.includes("secret-click-id"), false);
  assert.equal(url.includes("secret-click-id"), false);
});
