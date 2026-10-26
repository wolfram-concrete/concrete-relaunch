/* CONCRETE_CALENDLY_ATTRIBUTION_V3
 *
 * Für Google Tag Manager als Custom-HTML-Script. Der Tag darf erst nach
 * erteilter analytics_storage-Einwilligung ausgelöst werden.
 *
 * Aufgabe:
 * - letzte belastbare Nicht-Direct-Herkunft consent-gebunden fuer 90 Tage halten
 * - dieselbe Herkunft ueber interne Seitenwechsel und neue Tabs erhalten
 * - Calendly-Links unmittelbar vor dem Klick mit UTM-Werten versehen
 * - eine zufällige, nicht personenbezogene Sitzungskennung in utm_content
 *   transportieren; der Webhook speichert davon nur einen HMAC
 */
(function () {
  'use strict';

  var VERSION = 3;
  if (window.CONCRETE_CALENDLY_ATTRIBUTION &&
      window.CONCRETE_CALENDLY_ATTRIBUTION.version >= VERSION) return;

  var STORAGE_KEY = 'concrete_attribution_v3';
  var MAX_AGE_MS = 90 * 86400000;
  var JOURNEY_PREFIX = 'ctj_';
  var CALENDLY_HOST = /(^|\.)calendly\.com$/i;
  var CLICK_IDS = ['gclid', 'gbraid', 'wbraid', 'gad_source'];
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

  function clean(value, max) {
    return String(value || '').trim().slice(0, max || 180);
  }

  function randomToken() {
    var bytes = new Uint8Array(16);
    var parts = [];
    window.crypto.getRandomValues(bytes);
    for (var index = 0; index < bytes.length; index += 1) {
      parts.push(('0' + bytes[index].toString(16)).slice(-2));
    }
    return parts.join('');
  }

  function referrerAttribution() {
    if (!document.referrer) return { utm_source: 'direct', utm_medium: 'none' };
    try {
      var host = new URL(document.referrer).hostname.replace(/^www\./, '').toLowerCase();
      if (!host || host === location.hostname.replace(/^www\./, '').toLowerCase()) {
        return { utm_source: 'direct', utm_medium: 'none' };
      }
      if (/(^|\.)google\./.test(host) || host === 'google.com') {
        return { utm_source: 'google', utm_medium: 'organic' };
      }
      if (/(^|\.)bing\.com$/.test(host)) return { utm_source: 'bing', utm_medium: 'organic' };
      if (/(^|\.)ecosia\.org$/.test(host)) return { utm_source: 'ecosia', utm_medium: 'organic' };
      return { utm_source: host, utm_medium: 'referral' };
    } catch (error) {
      return { utm_source: 'direct', utm_medium: 'none' };
    }
  }

  function currentAttribution() {
    var params = new URLSearchParams(location.search);
    var values = {};
    var fallback = referrerAttribution();
    var paid = false;
    var explicit = false;
    var key;
    var value;
    var index;
    for (index = 0; index < UTM_KEYS.length; index += 1) {
      key = UTM_KEYS[index];
      value = clean(params.get(key));
      if (value) { values[key] = value; explicit = true; }
    }
    for (index = 0; index < CLICK_IDS.length; index += 1) {
      if (params.has(CLICK_IDS[index])) { paid = true; explicit = true; }
    }
    if (paid && !values.utm_source) values.utm_source = 'google';
    if (paid && !values.utm_medium) values.utm_medium = 'cpc';
    if (paid && !values.utm_campaign) values.utm_campaign = 'auto-tagged';
    if (!values.utm_source) values.utm_source = fallback.utm_source;
    if (!values.utm_medium && values.utm_source === fallback.utm_source) {
      values.utm_medium = fallback.utm_medium;
    }
    // Ein Referrer kann als einzelne utm_source ankommen. Ist er zugleich ein
    // Hostname, ist „referral“ eine belastbare Ergänzung. Bei unbekannten
    // Kampagnenquellen wird dagegen nicht geraten: E-Mail, Partnerlink und
    // organischer Verweis dürfen nicht stillschweigend gleichgesetzt werden.
    if (!values.utm_medium && /(?:^|\.)[a-z0-9-]+\.[a-z]{2,}$/i.test(values.utm_source || '')) {
      values.utm_medium = 'referral';
    }
    if (fallback.utm_medium !== 'none') explicit = true;
    return { attribution: values, explicit: explicit };
  }

  function parseState(raw) {
    try {
      var existing = JSON.parse(raw || 'null');
      var age = Date.now() - Date.parse(existing && existing.updated_at || '');
      if (existing && existing.version === VERSION && existing.journey_id &&
          existing.attribution && age >= 0 && age <= MAX_AGE_MS) return existing;
    } catch (error) { /* Ein blockierter Storage darf die Buchung nicht verhindern. */ }
    return null;
  }

  function readStoredState() {
    var existing = null;
    try { existing = parseState(localStorage.getItem(STORAGE_KEY)); } catch (error) { /* optional */ }
    if (existing) return existing;
    try { existing = parseState(sessionStorage.getItem(STORAGE_KEY)); } catch (error) { /* optional */ }
    return existing;
  }

  function storeState(state) {
    var serialized = JSON.stringify(state);
    try { localStorage.setItem(STORAGE_KEY, serialized); } catch (error) { /* optional */ }
    try { sessionStorage.setItem(STORAGE_KEY, serialized); } catch (error) { /* optional */ }
  }

  function loadState() {
    var incoming = currentAttribution();
    var existing = readStoredState();
    // Direkte Wiederbesuche ueberschreiben eine bekannte Kampagnen- oder
    // Referrer-Herkunft nicht. Ein neuer, belastbarer Touch startet dagegen
    // eine neue Journey und wird damit spaeter in Calendly sichtbar.
    if (existing && !incoming.explicit) return existing;
    if (existing && incoming.explicit &&
        JSON.stringify(existing.attribution) === JSON.stringify(incoming.attribution)) {
      existing.updated_at = new Date().toISOString();
      storeState(existing);
      return existing;
    }
    var state = {
      version: VERSION,
      journey_id: randomToken(),
      attribution: incoming.attribution,
      // Der Pfad hilft beim Debuggen im Browser, Query- und Click-IDs werden
      // bewusst nicht in den Sitzungszustand kopiert.
      landing_path: location.pathname.slice(0, 500),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    storeState(state);
    return state;
  }

  function consentGranted() {
    var api = window.CONCRETEConsent;
    if (!api || typeof api.get !== 'function') return true; // GTM ist selbst consent-gebunden.
    var consent = api.get();
    return !!(consent && (consent.statistics || consent.marketing));
  }

  function tracker(state) {
  function decorate(raw) {
    if (!raw) return raw;
    var url;
    var key;
    var value;
    var originalContent;
    var marker;
    try { url = new URL(raw, location.href); } catch (error) { return raw; }
    if (!CALENDLY_HOST.test(url.hostname)) return raw;

    for (var index = 0; index < UTM_KEYS.length; index += 1) {
      key = UTM_KEYS[index];
      if (key === 'utm_content') continue;
      value = clean(state.attribution[key]);
      if (value && !url.searchParams.has(key)) url.searchParams.set(key, value);
    }
    originalContent = clean(url.searchParams.get('utm_content') || state.attribution.utm_content);
    originalContent = originalContent.replace(/(?:^|~)ctj_[A-Za-z0-9_-]{16,64}(?=~|$)/g, '')
      .replace(/^~+|~+$/g, '');
    marker = JOURNEY_PREFIX + state.journey_id;
    if (originalContent.indexOf(marker) === -1) {
      url.searchParams.set(
        'utm_content',
        (marker + (originalContent ? '~' + originalContent : '')).slice(0, 240)
      );
    }
    return url.toString();
  }

  function decorateNode(root) {
    var links;
    var nodes;
    var index;
    root = root || document;
    if (!root.querySelectorAll) return;
    links = [];
    if (root.matches && root.matches('a[href*="calendly.com"]')) links.push(root);
    links = links.concat(Array.prototype.slice.call(root.querySelectorAll('a[href*="calendly.com"]')));
    for (index = 0; index < links.length; index += 1) {
      links[index].href = decorate(links[index].getAttribute('href'));
    }
    nodes = [];
    if (root.matches && root.matches('[data-url*="calendly.com"]')) nodes.push(root);
    nodes = nodes.concat(Array.prototype.slice.call(root.querySelectorAll('[data-url*="calendly.com"]')));
    for (index = 0; index < nodes.length; index += 1) {
      nodes[index].setAttribute('data-url', decorate(nodes[index].getAttribute('data-url')));
    }
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest ? event.target.closest('a[href*="calendly.com"]') : null;
    if (link) {
      link.href = decorate(link.getAttribute('href'));
      if (Array.isArray(window.dataLayer)) window.dataLayer.push({
        event: 'concrete_calendly_handoff',
        concrete_journey_version: VERSION,
        concrete_journey_present: true,
        concrete_utm_source: state.attribution.utm_source || '',
        concrete_utm_medium: state.attribution.utm_medium || '',
        concrete_utm_campaign: state.attribution.utm_campaign || '',
        concrete_landing_path: state.landing_path
      });
      if (typeof window.clarity === 'function') window.clarity('event', 'calendly_handoff');
    }
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { decorateNode(); });
  } else {
    decorateNode();
  }
  new MutationObserver(function (records) {
    for (var recordIndex = 0; recordIndex < records.length; recordIndex += 1) {
      var addedNodes = records[recordIndex].addedNodes;
      for (var nodeIndex = 0; nodeIndex < addedNodes.length; nodeIndex += 1) {
        if (addedNodes[nodeIndex].nodeType === 1) decorateNode(addedNodes[nodeIndex]);
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });

  window.CONCRETE_CALENDLY_ATTRIBUTION = {
    version: VERSION,
    decorate: decorate,
    state: state
  };
  if (Array.isArray(window.dataLayer)) window.dataLayer.push({
    event: 'concrete_attribution_ready',
    concrete_journey_version: VERSION,
    concrete_journey_present: true,
    concrete_utm_source: state.attribution.utm_source || '',
    concrete_utm_medium: state.attribution.utm_medium || '',
    concrete_utm_campaign: state.attribution.utm_campaign || '',
    concrete_landing_path: state.landing_path
  });
  }

  function start() {
    if (!consentGranted()) return;
    if (window.CONCRETE_CALENDLY_ATTRIBUTION &&
        window.CONCRETE_CALENDLY_ATTRIBUTION.version >= VERSION) return;
    tracker(loadState());
  }

  window.addEventListener('concrete:consent-update', start);
  start();
})();
