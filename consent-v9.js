(function () {
  "use strict";

  var STORAGE_KEY = "concrete-consent-v4";
  var COOKIE_NAME = "borlabs-cookie";
  var CONSENT_VERSION = 4;
  var MAX_AGE_DAYS = 180;
  var GTM_ID = "GTM-N8223FX";
  var SALESVIEWER_ACCOUNT_ID = "o9H9o8a1U5l3";
  var SORTLIST_RADAR_SETTINGS = {
    cdn: "collector.sortlist.com",
    apiEndpoint: "radar.sortlist.com",
    profileId: "roNBkiXpHEc",
    namespace: "SortlistRadar",
    features: {
      sessionTracking: true,
      formTracking: true,
      clickTracking: true,
      downloadTracking: true
    }
  };
  var PRODUCTION_TRACKING_HOST = "www.concrete-designs.de";
  var gtmLoaded = false;
  var salesViewerLoaded = false;
  var sortlistRadarLoaded = false;
  var clarityAttempts = 0;
  var clarityTimer = 0;
  var activeConsent = { statistics: false, marketing: false };
  var inertElements = null;
  var revealTimer = 0;
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

  function isProductionTrackingHost() {
    return window.location.hostname.toLowerCase() === PRODUCTION_TRACKING_HOST;
  }

  function safeParse(value) {
    try { return JSON.parse(value); } catch (_error) { return null; }
  }

  function readConsentCookie() {
    var prefix = COOKIE_NAME + "=";
    var part = document.cookie.split(";").map(function (item) { return item.trim(); }).find(function (item) {
      return item.indexOf(prefix) === 0;
    });
    if (!part) return null;
    var payload;
    try { payload = safeParse(decodeURIComponent(part.slice(prefix.length))); } catch (_error) { return null; }
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
    function valid(value) {
      if (!value || value.version !== CONSENT_VERSION || !value.savedAt) return false;
      var age = Date.now() - Date.parse(value.savedAt);
      return Number.isFinite(age) && age >= 0 && age <= MAX_AGE_DAYS * 86400000;
    }
    if (!valid(record)) record = readConsentCookie();
    if (!valid(record)) return null;
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
      marketing: consent.marketing ? ["google-ads", "linkedininsighttag", "microsoft-advertising", "sortlist-radar", "sortlist-badge"] : []
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
    window.clearTimeout(clarityTimer);
    consent = activeConsent;
    if (typeof window.clarity === "function") {
      window.clarity("consentv2", {
        ad_Storage: consent.marketing ? "granted" : "denied",
        analytics_Storage: consent.statistics ? "granted" : "denied"
      });
      return;
    }
    if (gtmLoaded && clarityAttempts < 20) {
      clarityAttempts += 1;
      clarityTimer = window.setTimeout(function () { updateClarityConsent(activeConsent); }, 250);
    }
  }

  function installBorlabsBridge(consent) {
    var allowed = ["concrete-consent"];
    if (consent.statistics) allowed.push("google-analytics", "microsoft-clarity");
    if (consent.marketing) allowed.push("google-ads", "linkedininsighttag", "microsoft-advertising", "sortlist-radar", "sortlist-badge");
    function hasConsent(serviceName) { return allowed.indexOf(serviceName) !== -1; }
    window.BorlabsCookie = window.BorlabsCookie || {};
    window.BorlabsCookie.checkCookieConsent = hasConsent;
    window.BorlabsCookie.Consents = window.BorlabsCookie.Consents || {};
    window.BorlabsCookie.Consents.hasConsent = hasConsent;
  }

  function loadGtm(consent) {
    if (!isProductionTrackingHost() || gtmLoaded || (!consent.statistics && !consent.marketing)) return;
    gtmLoaded = true;
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(GTM_ID);
    script.addEventListener("load", function () { updateClarityConsent(consent); });
    document.head.appendChild(script);
  }

  function loadSalesViewer() {
    if (!isProductionTrackingHost() || salesViewerLoaded) return;
    salesViewerLoaded = true;
    (function (s, a, l, e, sv, i, ew, er) {
      try {
        a = s[a] || s[l] || function () { throw "no_xhr"; };
        sv = i = "https://salesviewer.org";
        ew = function (x) {
          s = new Image();
          s.src = "https://salesviewer.org/tle.gif?sva=" + e +
            "&u=" + encodeURIComponent(window.location) + "&e=" + encodeURIComponent(x);
        };
        l = s.SV_XHR = function (d) {
          er = new a();
          er.onerror = function () {
            if (sv !== i) return ew("load_err");
            sv = "https://www.salesviewer.com/t";
            window.setTimeout(l.bind(null, d), 0);
          };
          er.onload = function () {
            (s.execScript || s.eval).call(er, er.responseText);
          };
          er.open("POST", sv, true);
          er.withCredentials = true;
          er.send(d);
          return er;
        };
        l(
          "h_json=" + Number("JSON" in s && typeof JSON.parse !== "undefined") +
          "&h_wc=1&h_event=" + Number("addEventListener" in s) + "&sva=" + e
        );
      } catch (x) {
        ew(x);
      }
    })(window, "XDomainRequest", "XMLHttpRequest", SALESVIEWER_ACCOUNT_ID);
  }

  function loadSortlistRadar(consent) {
    if (!isProductionTrackingHost() || sortlistRadarLoaded || !consent.marketing) return;
    sortlistRadarLoaded = true;
    var settings = SORTLIST_RADAR_SETTINGS;
    var namespace = settings.namespace;
    if (!namespace || !settings.profileId || !settings.cdn) return;
    var radar = window[namespace];
    if (!radar || !Array.isArray(radar)) radar = window[namespace] = [];
    if (radar.initialized || radar._loaded) return;
    radar._loaded = true;
    [
      "track", "page", "identify", "group", "alias", "ready", "debug", "on", "off", "once",
      "trackClick", "trackSubmit", "trackLink", "trackForm", "pageview", "screen", "reset",
      "register", "setAnonymousId", "addSourceMiddleware", "addIntegrationMiddleware",
      "addDestinationMiddleware"
    ].forEach(function (method) {
      radar[method] = function () {
        var current = window[namespace];
        if (current.initialized) return current[method].apply(current, arguments);
        var args = Array.prototype.slice.call(arguments);
        args.unshift(method);
        current.push(args);
      };
    });
    var script = document.createElement("script");
    script.async = true;
    script.type = "text/javascript";
    script.id = "__radar__";
    script.dataset.settings = JSON.stringify(settings);
    script.src = "https://" + settings.cdn + "/releases/latest/radar.min.js";
    document.head.appendChild(script);
  }

  function loadConsentEmbeds(consent) {
    if (!consent.marketing) return;
    document.querySelectorAll('script[type="text/plain"][data-consent-category="marketing"][data-consent-src]').forEach(function (placeholder) {
      if (placeholder.getAttribute("data-consent-loaded") === "true") return;
      placeholder.setAttribute("data-consent-loaded", "true");
      var script = document.createElement("script");
      script.src = placeholder.getAttribute("data-consent-src");
      script.defer = true;
      script.addEventListener("load", function () {
        var container = placeholder.parentNode.querySelector(".sortlist-badge");
        if (!container) return;
        var fallback = container.querySelector(".footer-partner__fallback");
        var badgeLink = container.querySelector("a:not(.footer-partner__fallback)");
        if (!badgeLink) return;
        badgeLink.setAttribute("aria-label", "CONCRETE ist Sortlist Trusted Partner");
        badgeLink.setAttribute("rel", "noopener noreferrer");
        var badgeImage = badgeLink.querySelector("img");
        if (badgeImage) badgeImage.alt = "Sortlist Trusted Partner";
        if (fallback) fallback.remove();
      });
      placeholder.parentNode.insertBefore(script, placeholder.nextSibling);
    });
  }

  function applyConsent(consent) {
    activeConsent = consent;
    clarityAttempts = 0;
    clearOptionalCookies(consent);
    writeCompatibilityCookie(consent);
    installBorlabsBridge(consent);
    updateGoogleConsent(consent);
    window.dataLayer.push({
      event: "concrete_consent_update",
      concrete_statistics_consent: consent.statistics,
      concrete_marketing_consent: consent.marketing
    });
    loadGtm(consent);
    loadSortlistRadar(consent);
    loadConsentEmbeds(consent);
    updateClarityConsent(consent);
  }

  function clearOptionalCookies(consent) {
    var names = document.cookie.split(";").map(function (part) { return part.split("=")[0].trim(); });
    names.filter(function (name) {
      return (!consent.statistics && /^(_ga(?:_|$)|_gid$|_gat|_clck$|_clsk$)/.test(name)) ||
        (!consent.marketing && /^(_gcl_|_uet|MUID$)/.test(name));
    }).forEach(function (name) {
      document.cookie = name + "=; Path=/; Max-Age=0; SameSite=Lax";
      document.cookie = name + "=; Path=/; Domain=." + window.location.hostname.replace(/^www\./, "") + "; Max-Age=0; SameSite=Lax";
    });
  }

  function saveConsent(statistics, marketing) {
    var previous = readConsent();
    var wasOptionalLoaded = gtmLoaded || sortlistRadarLoaded;
    var consent = {
      version: CONSENT_VERSION,
      savedAt: new Date().toISOString(),
      statistics: statistics === true,
      marketing: marketing === true
    };
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent)); } catch (_error) {}
    applyConsent(consent);
    closeUi();
    if (previous && wasOptionalLoaded && (
      previous.statistics !== consent.statistics || previous.marketing !== consent.marketing
    )) window.location.reload();
  }

  function uiMarkup() {
    return '<div class="consent-ui" data-consent-ui hidden>' +
      '<section class="consent-banner" role="dialog" aria-modal="true" aria-labelledby="consent-title" aria-describedby="consent-copy" data-consent-banner>' +
        '<div class="consent-banner__copy">' +
          '<p class="eyebrow">CONCRETE · Deine Privatsphäre</p>' +
          '<h2 id="consent-title" tabindex="-1">Deine Auswahl.<br>Deine Daten.</h2>' +
          '<p id="consent-copy">Mit deiner Zustimmung nutzen wir Google Analytics und Clarity für die Website-Analyse sowie Marketingdienste einschließlich Sortlist Radar. Du kannst alle optionalen Dienste ablehnen oder einzeln auswählen. Danach geht es in jedem Fall weiter.</p>' +
          '<p class="consent-note">Deine Auswahl gilt 180 Tage und lässt sich im Footer ändern. SalesViewer läuft davon unabhängig. <a href="datenschutz">Datenschutz</a> · <a href="impressum">Impressum</a></p>' +
        '</div>' +
        '<div class="consent-actions">' +
          '<button class="consent-button" type="button" data-consent-accept>Alle akzeptieren</button>' +
          '<button class="consent-button" type="button" data-consent-reject>Nur notwendige</button>' +
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
          '<div class="consent-option"><div><h3>Notwendig</h3><p>Speichert deine Auswahl und stellt die Website bereit.</p></div><span class="consent-fixed" aria-label="Immer aktiv">Immer aktiv</span></div>' +
          '<label class="consent-option" for="consent-statistics"><span><strong>Statistik</strong><small>Google Analytics und Microsoft Clarity</small></span><span class="consent-switch"><input id="consent-statistics" type="checkbox" data-consent-statistics><i aria-hidden="true"></i></span></label>' +
          '<label class="consent-option" for="consent-marketing"><span><strong>Marketing &amp; externe Inhalte</strong><small>Google Ads, LinkedIn Insight, Microsoft Advertising, Sortlist Radar und Sortlist-Badge</small></span><span class="consent-switch"><input id="consent-marketing" type="checkbox" data-consent-marketing><i aria-hidden="true"></i></span></label>' +
        '</div>' +
        '<p class="consent-note">SalesViewer läuft unabhängig von dieser Auswahl. Informationen zu allen Diensten: <a href="datenschutz">Datenschutz</a>.</p>' +
        '<div class="consent-actions consent-actions--settings">' +
          '<button class="consent-button consent-button--quiet" type="button" data-consent-reject>Nur notwendige</button>' +
          '<button class="consent-button consent-button--solid" type="button" data-consent-save>Auswahl speichern</button>' +
        '</div>' +
      '</section>' +
    '</div>';
  }

  function focusable(container) {
    return Array.prototype.slice.call(container.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])'));
  }

  function setPageInert(active) {
    if (!active) {
      (inertElements || []).forEach(function (element) { element.removeAttribute("inert"); });
      inertElements = null;
      return;
    }
    if (inertElements) return;
    inertElements = [];
    var ui = document.querySelector("[data-consent-ui]");
    Array.prototype.forEach.call(document.body.children, function (element) {
      if (element === ui) return;
      if (!element.hasAttribute("inert")) { inertElements.push(element); element.setAttribute("inert", ""); }
    });
  }

  function onDialogKeydown(event) {
    var dialog = document.querySelector("[data-consent-dialog]");
    var banner = document.querySelector("[data-consent-banner]");
    var container = dialog && !dialog.hidden ? dialog : banner;
    if (!container || container.hidden || document.querySelector("[data-consent-ui]").hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      if (container === dialog) closeSettings();
      else saveConsent(false, false);
      return;
    }
    if (event.key !== "Tab") return;
    var items = focusable(container);
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (!container.contains(document.activeElement)) {
      event.preventDefault(); first.focus();
    } else if (event.shiftKey && document.activeElement === first) {
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
    window.clearTimeout(revealTimer);
    if (ui.hidden) lastFocused = document.activeElement;
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
    if (stored) closeUi();
    else banner.querySelector("[data-consent-settings]").focus();
  }

  function closeUi() {
    var ui = document.querySelector("[data-consent-ui]");
    if (ui) ui.hidden = true;
    document.documentElement.classList.remove("consent-open");
    setPageInert(false);
    document.removeEventListener("keydown", onDialogKeydown);
    if (lastFocused && lastFocused.isConnected && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function bindUi() {
    if (document.querySelector("[data-consent-ui]")) return;
    document.body.insertAdjacentHTML("beforeend", uiMarkup());
    var ui = document.querySelector("[data-consent-ui]");
    var banner = document.querySelector("[data-consent-banner]");
    var dialog = document.querySelector("[data-consent-dialog]");
    var stored = readConsent();
    if (!stored && banner) banner.hidden = true;
    function revealBanner() {
      if (readConsent() || !ui || !banner || !banner.hidden || !dialog.hidden) return;
      window.clearTimeout(revealTimer);
      lastFocused = document.activeElement;
      banner.classList.add("consent-banner--enter");
      ui.hidden = false;
      banner.hidden = false;
      document.documentElement.classList.add("consent-open");
      setPageInert(true);
      document.addEventListener("keydown", onDialogKeydown);
      banner.querySelector("h2").focus();
      banner.addEventListener("animationend", function () { banner.classList.remove("consent-banner--enter"); }, { once: true });
    }
    if (!stored) {
      var waitsForHero = !!document.querySelector("[data-hero]") && document.documentElement.getAttribute("data-hero-consent-ready") !== "true";
      if (waitsForHero) {
        window.addEventListener("concrete:hero-reel-complete", function () {
          window.clearTimeout(revealTimer);
          revealTimer = window.setTimeout(revealBanner, 200);
        }, { once: true });
        revealTimer = window.setTimeout(revealBanner, 8000);
      } else revealBanner();
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

  loadSalesViewer();
  installBorlabsBridge(activeConsent);
  var storedConsent = readConsent();
  if (storedConsent) applyConsent(storedConsent);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindUi);
  else bindUi();
})();
