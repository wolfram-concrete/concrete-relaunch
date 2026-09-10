(function () {
  "use strict";

  var STORAGE_KEY = "concrete-consent-v1";
  var COOKIE_NAME = "borlabs-cookie";
  var CONSENT_VERSION = 1;
  var MAX_AGE_DAYS = 180;
  var GTM_ID = "GTM-N8223FX";
  var gtmLoaded = false;
  var clarityAttempts = 0;
  var lastFocused = null;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500
  });

  function safeParse(value) {
    try { return JSON.parse(value); } catch (_error) { return null; }
  }

  function readConsentCookie() {
    var prefix = COOKIE_NAME + "=";
    var part = document.cookie.split(";").map(function (item) { return item.trim(); }).find(function (item) {
      return item.indexOf(prefix) === 0;
    });
    if (!part) return null;
    var payload = safeParse(decodeURIComponent(part.slice(prefix.length)));
    if (!payload || payload.version !== String(CONSENT_VERSION) || !payload.savedAt || !payload.consents) return null;
    var essential = payload.consents.essential || [];
    if (essential.indexOf("concrete-consent") === -1) return null;
    return {
      version: CONSENT_VERSION,
      savedAt: payload.savedAt,
      statistics: (payload.consents.statistics || []).indexOf("google-analytics") !== -1,
      marketing: (payload.consents.marketing || []).indexOf("google-ads") !== -1
    };
  }

  function readConsent() {
    var record = null;
    try { record = safeParse(window.localStorage.getItem(STORAGE_KEY)); } catch (_error) {}
    if (!record) record = readConsentCookie();
    if (!record || record.version !== CONSENT_VERSION || !record.savedAt) return null;
    var age = Date.now() - Date.parse(record.savedAt);
    if (!Number.isFinite(age) || age > MAX_AGE_DAYS * 86400000) return null;
    return {
      statistics: record.statistics === true,
      marketing: record.marketing === true,
      savedAt: record.savedAt,
      version: record.version
    };
  }

  function writeCompatibilityCookie(consent) {
    var groups = {
      essential: ["concrete-consent"],
      statistics: consent.statistics ? ["google-analytics", "microsoft-clarity"] : [],
      marketing: consent.marketing ? ["google-ads", "linkedininsighttag", "microsoft-advertising"] : []
    };
    var expires = new Date(Date.now() + MAX_AGE_DAYS * 86400000);
    var payload = encodeURIComponent(JSON.stringify({
      consents: groups,
      domainPath: window.location.hostname + "/",
      expires: expires.toISOString(),
      savedAt: consent.savedAt,
      version: String(CONSENT_VERSION)
    }));
    var secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = COOKIE_NAME + "=" + payload + "; Path=/; Max-Age=" + (MAX_AGE_DAYS * 86400) + "; SameSite=Lax" + secure;
  }

  function updateGoogleConsent(consent) {
    window.gtag("consent", "update", {
      analytics_storage: consent.statistics ? "granted" : "denied",
      ad_storage: consent.marketing ? "granted" : "denied",
      ad_user_data: consent.marketing ? "granted" : "denied",
      ad_personalization: consent.marketing ? "granted" : "denied"
    });
  }

  function updateClarityConsent(consent) {
    if (typeof window.clarity === "function") {
      window.clarity("consentv2", {
        ad_Storage: consent.marketing ? "granted" : "denied",
        analytics_Storage: consent.statistics ? "granted" : "denied"
      });
      return;
    }
    if (gtmLoaded && clarityAttempts < 20) {
      clarityAttempts += 1;
      window.setTimeout(function () { updateClarityConsent(consent); }, 250);
    }
  }

  function installBorlabsBridge(consent) {
    var allowed = ["concrete-consent"];
    if (consent.statistics) allowed.push("google-analytics", "microsoft-clarity");
    if (consent.marketing) allowed.push("google-ads", "linkedininsighttag", "microsoft-advertising");
    function hasConsent(serviceName) { return allowed.indexOf(serviceName) !== -1; }
    window.BorlabsCookie = window.BorlabsCookie || {};
    window.BorlabsCookie.checkCookieConsent = hasConsent;
    window.BorlabsCookie.Consents = window.BorlabsCookie.Consents || {};
    window.BorlabsCookie.Consents.hasConsent = hasConsent;
  }

  function loadGtm(consent) {
    if (gtmLoaded || (!consent.statistics && !consent.marketing)) return;
    gtmLoaded = true;
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(GTM_ID);
    script.addEventListener("load", function () { updateClarityConsent(consent); });
    document.head.appendChild(script);
  }

  function applyConsent(consent) {
    writeCompatibilityCookie(consent);
    installBorlabsBridge(consent);
    updateGoogleConsent(consent);
    window.dataLayer.push({
      event: "concrete_consent_update",
      concrete_statistics_consent: consent.statistics,
      concrete_marketing_consent: consent.marketing
    });
    loadGtm(consent);
    updateClarityConsent(consent);
  }

  function clearOptionalCookies() {
    var names = document.cookie.split(";").map(function (part) { return part.split("=")[0].trim(); });
    names.filter(function (name) {
      return /^(_ga|_gid|_gat|_gcl_|_clck|_clsk|_uet|MUID)/.test(name);
    }).forEach(function (name) {
      document.cookie = name + "=; Path=/; Max-Age=0; SameSite=Lax";
      document.cookie = name + "=; Path=/; Domain=." + window.location.hostname.replace(/^www\./, "") + "; Max-Age=0; SameSite=Lax";
    });
  }

  function saveConsent(statistics, marketing) {
    var previous = readConsent();
    var consent = {
      version: CONSENT_VERSION,
      savedAt: new Date().toISOString(),
      statistics: statistics === true,
      marketing: marketing === true
    };
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent)); } catch (_error) {}
    if (!consent.statistics && !consent.marketing) clearOptionalCookies();
    applyConsent(consent);
    closeUi();
    if (previous && gtmLoaded && (
      previous.statistics !== consent.statistics || previous.marketing !== consent.marketing
    )) window.location.reload();
  }

  function uiMarkup() {
    return '<div class="consent-ui" data-consent-ui hidden>' +
      '<section class="consent-banner" role="dialog" aria-labelledby="consent-title" aria-describedby="consent-copy" data-consent-banner>' +
        '<div class="consent-banner__copy">' +
          '<p class="eyebrow">Datenschutz</p>' +
          '<h2 id="consent-title">Dürfen wir messen?</h2>' +
          '<p id="consent-copy">Wir laden Analyse- und Marketingdienste erst nach deiner Zustimmung. Notwendige Technik funktioniert auch ohne Tracking. Details stehen im <a href="datenschutz.html">Datenschutz</a>.</p>' +
        '</div>' +
        '<div class="consent-actions">' +
          '<button class="consent-button consent-button--quiet" type="button" data-consent-reject>Nur notwendige</button>' +
          '<button class="consent-button consent-button--solid" type="button" data-consent-accept>Alle akzeptieren</button>' +
          '<button class="consent-link" type="button" data-consent-settings>Einstellungen</button>' +
        '</div>' +
      '</section>' +
      '<section class="consent-settings" role="dialog" aria-modal="true" aria-labelledby="consent-settings-title" hidden data-consent-dialog>' +
        '<div class="consent-settings__head">' +
          '<div><p class="eyebrow">Datenschutz</p><h2 id="consent-settings-title">Cookie-Einstellungen</h2></div>' +
          '<button class="consent-close" type="button" aria-label="Cookie-Einstellungen schließen" data-consent-close></button>' +
        '</div>' +
        '<p>Du entscheidest, welche optionalen Dienste wir laden. Deine Auswahl gilt 180 Tage und lässt sich im Footer jederzeit ändern.</p>' +
        '<div class="consent-options">' +
          '<div class="consent-option"><div><h3>Notwendig</h3><p>Speichert ausschließlich deine Auswahl und stellt die Website bereit.</p></div><span class="consent-fixed" aria-label="Immer aktiv">Immer aktiv</span></div>' +
          '<label class="consent-option" for="consent-statistics"><span><strong>Statistik</strong><small>Google Analytics und Microsoft Clarity</small></span><span class="consent-switch"><input id="consent-statistics" type="checkbox" data-consent-statistics><i aria-hidden="true"></i></span></label>' +
          '<label class="consent-option" for="consent-marketing"><span><strong>Marketing</strong><small>Google Ads, LinkedIn Insight und Microsoft Advertising</small></span><span class="consent-switch"><input id="consent-marketing" type="checkbox" data-consent-marketing><i aria-hidden="true"></i></span></label>' +
        '</div>' +
        '<div class="consent-actions consent-actions--settings">' +
          '<button class="consent-button consent-button--quiet" type="button" data-consent-reject>Alle ablehnen</button>' +
          '<button class="consent-button consent-button--solid" type="button" data-consent-save>Auswahl speichern</button>' +
        '</div>' +
      '</section>' +
    '</div>';
  }

  function focusable(container) {
    return Array.prototype.slice.call(container.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])'));
  }

  function setPageInert(active) {
    var ui = document.querySelector("[data-consent-ui]");
    Array.prototype.forEach.call(document.body.children, function (element) {
      if (element === ui) return;
      if (active) element.setAttribute("inert", "");
      else element.removeAttribute("inert");
    });
  }

  function onDialogKeydown(event) {
    var dialog = document.querySelector("[data-consent-dialog]");
    if (!dialog || dialog.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeSettings();
      return;
    }
    if (event.key !== "Tab") return;
    var items = focusable(dialog);
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }

  function openSettings() {
    var ui = document.querySelector("[data-consent-ui]");
    var banner = document.querySelector("[data-consent-banner]");
    var dialog = document.querySelector("[data-consent-dialog]");
    var stored = readConsent();
    if (!ui || !dialog) return;
    lastFocused = document.activeElement;
    ui.hidden = false;
    if (banner) banner.hidden = true;
    dialog.hidden = false;
    document.documentElement.classList.add("consent-open");
    setPageInert(true);
    dialog.querySelector("[data-consent-statistics]").checked = !!(stored && stored.statistics);
    dialog.querySelector("[data-consent-marketing]").checked = !!(stored && stored.marketing);
    document.addEventListener("keydown", onDialogKeydown);
    window.setTimeout(function () { dialog.querySelector("[data-consent-close]").focus(); }, 0);
  }

  function closeSettings() {
    var dialog = document.querySelector("[data-consent-dialog]");
    var ui = document.querySelector("[data-consent-ui]");
    var banner = document.querySelector("[data-consent-banner]");
    var stored = readConsent();
    if (dialog) dialog.hidden = true;
    if (ui) ui.hidden = !!stored;
    if (banner) banner.hidden = !!stored;
    document.documentElement.classList.remove("consent-open");
    setPageInert(false);
    document.removeEventListener("keydown", onDialogKeydown);
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function closeUi() {
    var ui = document.querySelector("[data-consent-ui]");
    if (ui) ui.hidden = true;
    document.documentElement.classList.remove("consent-open");
    setPageInert(false);
    document.removeEventListener("keydown", onDialogKeydown);
  }

  function bindUi() {
    document.body.insertAdjacentHTML("beforeend", uiMarkup());
    var ui = document.querySelector("[data-consent-ui]");
    var banner = document.querySelector("[data-consent-banner]");
    var dialog = document.querySelector("[data-consent-dialog]");
    var stored = readConsent();
    if (!stored) {
      ui.hidden = false;
      banner.hidden = false;
    }
    document.querySelectorAll("[data-consent-settings], [data-consent-manage]").forEach(function (button) {
      button.addEventListener("click", openSettings);
    });
    document.querySelectorAll("[data-consent-reject]").forEach(function (button) {
      button.addEventListener("click", function () { saveConsent(false, false); });
    });
    document.querySelector("[data-consent-accept]").addEventListener("click", function () { saveConsent(true, true); });
    document.querySelector("[data-consent-save]").addEventListener("click", function () {
      saveConsent(
        dialog.querySelector("[data-consent-statistics]").checked,
        dialog.querySelector("[data-consent-marketing]").checked
      );
    });
    document.querySelector("[data-consent-close]").addEventListener("click", closeSettings);
  }

  var storedConsent = readConsent();
  if (storedConsent) applyConsent(storedConsent);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindUi);
  else bindUi();
})();
