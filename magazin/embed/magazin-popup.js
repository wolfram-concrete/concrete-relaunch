/*!
 * CONCRETE Brandbuilding Magazin – Pop-up mit animiertem 3D-Heft
 *
 * Einbau (vor </body>):
 *   <script src="/magazin/embed/magazin-popup.js" defer></script>
 *
 * Optionen per data-Attribut am Script-Tag:
 *   data-section="3"          erscheint, sobald die 3. Section unter dem Hero ins Bild kommt
 *   data-trigger="0.45"      Ersatz auf Seiten ohne Hero: Scrolltiefe (0–1)
 *   data-tab="false"          kein seitlicher Magazin-Button nach dem Schließen (mobil ohnehin aus)
 *   Links mit data-cbm-open öffnen das Pop-up (z. B. Magazin-Eintrag im mobilen Menü)
 *   data-cooldown="session"  einmal pro Website-Besuch (Standard) – oder Zahl = Tage bis zur erneuten Anzeige
 *   data-exclude="kontakt|datenschutz|impressum"   Pfade ohne Pop-up (RegExp)
 *   data-autostart="false"   kein Scroll-Auslöser – nur per CBMPopup.open()
 *   data-theme="paper" | "coral-l"   alternativer Hintergrund der rechten Hälfte (Standard: Paper Deep #ece6da)
 *
 * API: CBMPopup.open(), CBMPopup.close()
 * Events: window "cbm:open", "cbm:close", "cbm:click" (detail.action: epaper|pdf), "cbm:lead" + dataLayer.push, falls vorhanden
 *
 * Leads: PDF-Download / Post-Anforderung fragt Name, Unternehmen, E-Mail, Situation (+ Adresse) ab → Google Sheet (LEAD_ENDPOINT = Apps-Script-Web-App, siehe leads/apps-script.gs)
 *
 * Gekapselt in Shadow DOM → keine Konflikte mit dem CSS der Website.
 */
(() => {
  if (window.CBMPopup) return;
  const script = document.currentScript;
  const opt = script ? script.dataset : {};
  const BASE = new URL("../", script ? script.src : location.href).href;
  const EPAPER = BASE.replace(/\/$/, "");               // z. B. https://www.concrete-designs.de/magazin
  const TRIGGER = parseFloat(opt.trigger || "0.45");
  const SECTION = parseInt(opt.section || "3", 10);
  const TAB = opt.tab !== "false";
  const TAB_KEY = "cbm_tab";
  const PER_VISIT = !opt.cooldown || opt.cooldown === "session";
  const COOLDOWN = PER_VISIT ? 0 : parseFloat(opt.cooldown) * 864e5;
  const seenStore = PER_VISIT ? sessionStorage : localStorage;   // pro Besuch vs. über Tage
  const EXCLUDE = new RegExp(opt.exclude || "kontakt|datenschutz|impressum", "i");
  const AUTOSTART = opt.autostart !== "false";
  const KEY = "cbm_popup_seen";
  const THEME = opt.theme || "";              // "", "paper", "sand", "coral-l"
  const LEAD_ENDPOINT = opt.endpoint || "";   // TODO: Apps-Script-Web-App-URL (…/exec) eintragen
  const a = p => BASE + p;

  // Schriften müssen im Dokument registriert sein (nicht im Shadow Root)
  const fonts = document.createElement("style");
  fonts.textContent = `
@font-face{font-family:"CBM Roc";src:url(${a("assets/fonts/kostic_-_roc_grotesk_regular-webfont.woff2")}) format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"CBM Roc";src:url(${a("assets/fonts/kostic_-_roc_grotesk_bold-webfont.woff2")}) format("woff2");font-weight:700;font-display:swap}
@font-face{font-family:"CBM Arame";src:url(${a("assets/fonts/DMTR_ORG_-_0Arame_Bold.otf")}) format("opentype");font-weight:700;font-display:swap}`;
  document.head.append(fonts);

  const CSS = `
:host{all:initial}
*{box-sizing:border-box;margin:0;padding:0}
button,select{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
a{color:inherit;text-decoration:none}
.cbm{--coral:#fe7e5e;--panel:#ece6da;--em:var(--coral);--grey-l:#ebebeb;--ink:#0c0c0c;--paper:#f3f1ec;
  position:fixed;inset:0;z-index:2147483000;display:none;place-items:center;padding:24px;background:rgba(12,12,12,.32);
  font:400 15px/1.5 "CBM Roc",system-ui,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased}
.cbm.open{display:grid;animation:fade .35s ease}
.card{position:relative;width:min(1100px,100%);max-height:calc(100dvh - 48px);overflow-y:auto;overflow-x:hidden;
  display:grid;grid-template-columns:50% 1fr;background:var(--panel);animation:rise .5s cubic-bezier(.2,.8,.2,1)}
.card:focus{outline:none}
.card>*{position:relative}
.stage{background:var(--coral)}
.stage::before{content:"";position:absolute;inset:0;background:url(${a("assets/tex_coral.webp")}) center/cover;opacity:.45;mix-blend-mode:multiply;pointer-events:none}
@keyframes fade{from{opacity:0}}
@keyframes rise{from{transform:translateY(20px)}}
.x{position:absolute!important;right:10px;top:10px;z-index:5;width:40px;height:40px;display:grid;place-items:center}
.x svg{width:15px;height:15px;stroke:var(--ink);stroke-width:1.5}
.x:hover svg{stroke:var(--coral)}
.x:focus-visible,.btn:focus-visible,select:focus-visible{outline:2px solid var(--ink);outline-offset:2px}

.stage{min-height:600px;position:relative;display:grid;place-items:center;overflow:hidden;perspective:1500px;perspective-origin:50% 30%}
.zoom{transform-style:preserve-3d;transform:scale(1.32) rotateY(-18deg);transition:transform 1.15s cubic-bezier(.45,.05,.25,1)}
.zoom.open{transform:scale(.96) rotateY(0deg)}
.scene{--W:228px;--H:calc(var(--W) * 297 / 210);--T:11px;position:relative;width:calc(var(--W) * 2);height:var(--H);
  transform-style:preserve-3d;transform:rotateX(30deg) rotateZ(-7deg)}
.book{--TR:var(--T);--TL:0px;--ZR:2.4px;--ZL:0px;position:absolute;inset:0;transform-style:preserve-3d;transform:translateX(calc(var(--W) / -2));transition:transform 1s cubic-bezier(.45,.05,.25,1)}
.book.open{transform:translateX(0)}
.shadow{position:absolute;top:0;height:var(--H);left:var(--W);width:var(--W);transform:translateZ(calc(var(--T) * -1 - 1px));
  transition:left 1s cubic-bezier(.45,.05,.25,1),width 1s cubic-bezier(.45,.05,.25,1)}
.book.open .shadow{left:0;width:calc(var(--W) * 2)}
.shadow::before{content:"";position:absolute;inset:-3px -2px -5px -2px;background:rgba(80,18,4,.6);filter:blur(4px);border-radius:3px}
.shadow::after{content:"";position:absolute;inset:4% -6% -10% 6%;background:rgba(110,28,8,.42);filter:blur(22px);transform:translate(14px,22px)}
/* Heftdicke: Stapel rechts/links, Kanten reichen von der obersten Seite (--ZR/--ZL) bis zur Unterseite (--TR/--TL).
   Links wächst der Stapel mit jeder umgeblätterten Seite, rechts nimmt er ab. */
.block{position:absolute;top:0;width:var(--W);height:var(--H);background:var(--paper) url(${a("assets/paper-grain.png")}) 0 0/200px 200px;background-blend-mode:multiply;transform-style:preserve-3d}
.block.r{left:var(--W);--TS:var(--TR);--ZS:var(--ZR)}
.block.l{left:0;--TS:var(--TL);--ZS:var(--ZL);visibility:hidden}
.book.lstack .block.l{visibility:visible}
.block::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.14),transparent 12%)}
.block.l::after{background:linear-gradient(270deg,rgba(0,0,0,.14),transparent 12%)}
.edge{position:absolute}
.edge.x{top:0;height:100%;width:calc(var(--ZS) + var(--TS));background:repeating-linear-gradient(90deg,#f1eee8 0 1px,#d6d1c9 1px 2px)}
.block.r .edge.x{right:0;transform-origin:right;transform:translateZ(var(--ZS)) rotateY(-90deg)}
.block.l .edge.x{left:0;transform-origin:left;transform:translateZ(var(--ZS)) rotateY(90deg)}
.edge.y{left:0;bottom:0;width:100%;height:calc(var(--ZS) + var(--TS));transform-origin:bottom;transform:translateZ(var(--ZS)) rotateX(90deg);
  background:repeating-linear-gradient(0deg,#f1eee8 0 1px,#d6d1c9 1px 2px)}
/* Rücken (Klebebindung): sichtbar in der Nahaufnahme des geschlossenen Hefts */
.edge.s{left:0;top:0;height:100%;width:calc(var(--ZR) + var(--TR));transform-origin:left;transform:translateZ(var(--ZR)) rotateY(90deg);
  background:linear-gradient(90deg,#e7e3dc,#f3f0ea 35%,#d8d3cb)}
.leaf{position:absolute;top:0;left:var(--W);width:calc(var(--W) / 6);height:var(--H);transform-style:preserve-3d;transform-origin:left center}
.seg{position:absolute;top:0;left:0;width:100%;height:100%;transform-style:preserve-3d;transform-origin:left center}
.seg .seg{left:100%}
.face{position:absolute;inset:0 -1px 0 0;background-color:var(--paper);background-repeat:repeat,no-repeat;background-size:200px 200px,var(--W) var(--H);background-blend-mode:multiply;
  backface-visibility:hidden;-webkit-backface-visibility:hidden;outline:1px solid transparent}
.face.last{right:0}
.face.b{transform:rotateY(180deg)}
.face::after{content:"";position:absolute;inset:0;background:#3a1206;opacity:var(--sh,0);pointer-events:none}
.face.gut.f::before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(90deg,rgba(0,0,0,.28),rgba(0,0,0,.06) 30%,transparent 70%)}
.face.gut.b::before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(270deg,rgba(0,0,0,.28),rgba(0,0,0,.06) 30%,transparent 70%)}
.leaf.cover .face.gut.f::before{background:linear-gradient(90deg,rgba(0,0,0,.2),rgba(255,255,255,.3) 12%,rgba(0,0,0,.06) 30%,transparent 70%)}

.body{padding:56px 56px 44px 52px;display:flex;flex-direction:column;gap:18px}
.body{container-type:inline-size}
.h{font:700 min(40px,8.2cqi)/.96 "CBM Arame","CBM Roc",sans-serif;text-transform:uppercase}
.h span{display:block;white-space:nowrap}
.h em{font-style:normal;color:var(--em)}
/* Farbvarianten rechte Hälfte (Website-Palette) */
.cbm.t-paper{--panel:#f3efe7}
.cbm.t-sand{--panel:#ece6da}
.cbm.t-coral-l{--panel:#febdac;--em:var(--ink)}
.cbm.t-coral-l .h em span{background:linear-gradient(transparent 62%,var(--coral) 62%,var(--coral) 92%,transparent 92%)}
.lead{font-size:15px;line-height:1.5;margin-top:-2px}
.lead b{font-weight:700}
.kick{font-weight:700;font-size:16px;line-height:1.4;margin-top:-8px}
.quote{display:flex;gap:14px;align-items:flex-start;padding:16px;background:#fff;position:relative;margin-top:4px}
.quote::before{content:"";position:absolute;left:30px;top:-8px;width:16px;height:16px;background:#fff;transform:rotate(45deg)}
.quote img{width:64px;height:64px;border-radius:50%;object-fit:cover;flex:none}
.quote .mail{display:inline-flex;align-items:center;gap:8px;margin-top:10px;font-weight:700;font-size:13px;border-bottom:1px solid var(--ink);padding-bottom:1px;transition:color .15s,border-color .15s}
.quote .mail:hover{color:var(--coral);border-color:var(--coral)}
.quote .mail svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:1.5}
.quote p{font-size:14px;line-height:1.5}
.quote b{display:block;margin-top:8px;font-size:13px}
.quote .role{display:block;font-size:12.5px}
.act{display:grid;gap:10px;margin-top:2px}
/* Einheitliche Aktions-Zeilen: gleiche Höhe, Rahmen, Kachel links, Pfeil rechts */
.btn{display:flex;align-items:center;gap:16px;min-height:66px;padding:0 20px 0 0;border:1px solid var(--ink);background:transparent;color:var(--ink);
  text-align:left;width:100%;transition:background .15s,color .15s}
.btn .tile{align-self:stretch;width:66px;flex:none;display:grid;place-items:center;border-right:1px solid var(--ink);overflow:hidden}
.btn .tile img{width:100%;height:100%;object-fit:cover;display:block}
.btn .tile svg{width:20px;height:20px}
.btn .t{flex:1;display:grid;gap:1px;font-weight:700;font-size:15px;line-height:1.25}
.btn .t small{font-weight:400;font-size:12.5px}
.btn>svg{width:18px;height:18px;flex:none}
.btn svg{stroke:currentColor;fill:none;stroke-width:1.5}
.btn.pri{background:var(--coral)}
.btn:hover{background:var(--ink);color:var(--grey-l)}
.btn:hover .tile{border-color:var(--ink)}
.btn.plain{padding:0 20px;justify-content:space-between;min-height:58px}
/* Formular-Schritt */
.form,.done{display:none}
.card.step-form .intro,.card.step-done .intro{display:none}
.card.step-form .form{display:flex}
.card.step-done .done{display:flex}
.form,.done{flex-direction:column;gap:16px}
.h3{font:700 min(34px,8cqi)/.96 "CBM Arame","CBM Roc",sans-serif;text-transform:uppercase}
.back{align-self:flex-start;font-size:13px;text-decoration:underline;text-underline-offset:3px}
.f{display:grid;gap:4px}
.f label{font-weight:700;font-size:13px}
.f input,.f select{width:100%;font:400 16px/1.2 "CBM Roc",sans-serif;color:var(--ink);background:transparent;border:0;border-bottom:1px solid var(--ink);
  border-radius:0;padding:10px 0;outline:none;-webkit-appearance:none;appearance:none}
.f select{padding-right:24px;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%230c0c0c' stroke-width='1.5'/%3E%3C/svg%3E") right 2px center no-repeat}
.f input::placeholder{color:rgba(12,12,12,.55)}
.f input:focus,.f select:focus{border-bottom-width:2px;padding-bottom:9px}
.f.err input,.f.err select{border-bottom-color:#c4300e;border-bottom-width:2px}
.f .msg{display:none;font-size:12px;font-weight:700;color:#b02a0b}
.f.err .msg{display:block}
.chk{display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.45;cursor:pointer}
.chk input{margin-top:2px;width:16px;height:16px;accent-color:var(--ink);flex:none}
.hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
.row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.row.plz{grid-template-columns:110px 1fr}
.post{display:grid;gap:14px}
.post[hidden]{display:none}
.note{font-weight:700;font-size:13px}
.btn[disabled]{opacity:.35;cursor:not-allowed}
.btn[disabled]:hover{background:var(--coral);color:var(--ink)}
.btn .chev{transition:transform .2s}
.btn[aria-expanded="true"] .chev{transform:rotate(180deg)}
.h3 em{font-style:normal;color:var(--em)}
.done a{text-decoration:underline}
.legal{font-size:11.5px;line-height:1.5}
.legal a{text-decoration:underline}
/* Seitlicher Magazin-Button: eingeklappt nur Cover im Paper-Rahmen am rechten Rand,
   bei Hover fährt der Text heraus und alles wird Coral. ✕ blendet ihn für den Besuch aus. */
.tabw{--coral:#fe7e5e;--ink:#0c0c0c;--paper:#ece6da;position:fixed;right:0;bottom:32px;z-index:2147482000;
  transition:transform .45s cubic-bezier(.2,.8,.2,1),opacity .3s}
.tabw[hidden]{display:block;transform:translateX(120%);opacity:0;pointer-events:none}
.tab{display:flex;align-items:center;gap:0;padding:6px;border:0;cursor:pointer;background:var(--paper);color:var(--ink);
  font:700 13px/1.25 "CBM Roc",system-ui,sans-serif;text-align:left;box-shadow:0 16px 36px -12px rgba(12,12,12,.4);transition:background .2s}
.tab img{width:52px;height:52px;object-fit:cover;display:block;flex:none}
.tab .txt{display:flex;align-items:center;gap:14px;max-width:0;overflow:hidden;white-space:nowrap;opacity:0;
  transition:max-width .4s cubic-bezier(.2,.8,.2,1),opacity .25s,padding .4s;padding:0}
.tab .txt small{display:block;font-weight:400;font-size:12px}
.tab .txt svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.5;flex:none}
.tabw:hover .tab,.tab:focus-visible{background:var(--coral)}
.tabw:hover .txt,.tab:focus-visible .txt{max-width:260px;opacity:1;padding:0 16px 0 14px}
.tab:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
.tabx{position:absolute;left:-9px;top:-9px;width:22px;height:22px;display:grid;place-items:center;border:0;cursor:pointer;
  background:var(--ink);color:#ebebeb;opacity:0;transform:scale(.8);transition:opacity .2s,transform .2s}
.tabx svg{width:9px;height:9px;stroke:currentColor;stroke-width:1.6}
.tabw:hover .tabx,.tabx:focus-visible{opacity:1;transform:none}
.tabx:hover{background:var(--coral);color:var(--ink)}
/* Touch-Geräte: kein Hover → Tippen öffnet direkt das Pop-up, ✕ immer sichtbar */
@media (hover:none){.tabx{opacity:1;transform:none}}
@media (max-width:820px){.tabw{display:none!important}}   /* mobil: Magazin im Burger-Menü */
@media (max-width:820px){
  .cbm{padding:0;place-items:end stretch}
  .card{grid-template-columns:1fr;width:100%;max-height:94dvh}
  .stage{min-height:250px;padding-top:10px}
  .scene{--W:112px;--T:6px}
  .body{padding:26px 20px 24px;gap:16px}
  .row{grid-template-columns:1fr}
  .row.plz{grid-template-columns:100px 1fr}
}
@media (prefers-reduced-motion:reduce){.book,.shadow,.zoom{transition:none!important}}`;

  const HTML = `
<div class="cbm" role="dialog" aria-modal="true" aria-labelledby="h">
  <div class="card" tabindex="-1">
    <button class="x" data-close aria-label="Schließen"><svg viewBox="0 0 14 14"><path d="M1 1l12 12M13 1 1 13"/></svg></button>
    <div class="stage" aria-hidden="true"><div class="zoom"><div class="scene"><div class="book">
      <div class="shadow"></div>
      <div class="block l"><div class="edge x"></div><div class="edge y"></div></div>
      <div class="block r"><div class="edge x"></div><div class="edge y"></div><div class="edge s"></div></div>
    </div></div></div></div>
    <div class="body">
      <div class="intro">
        <h2 class="h" id="h"><span>11 B2B‑Situationen.</span><em><span>11 Wege, sie zu lösen.</span></em></h2>
        <p class="lead" style="margin-top:18px"><b>Echte Markenprojekte</b> und ein detaillierter Blick darauf, wie wir <b>strategisch und gestalterisch</b> mit ganz unterschiedlichen Herausforderungen umgegangen sind.</p>
        <p class="kick" style="margin-top:12px">Vielleicht findet ihr darin genau die Situation, vor der ihr gerade selbst steht.</p>
        <div class="quote" style="margin-top:22px">
          <img src="${a("assets/wolfram-vignette.jpg")}" alt="Wolfram Stratmann" width="64" height="64">
          <p>„Kaum eine Markenfrage ist wirklich neu. Aber jede braucht ihre eigene Antwort. Wenn ihr euch in einem der Fälle wiedererkennt, meldet euch gern direkt bei mir.“<b>Wolfram Stratmann</b><span class="role">Geschäftsführer<br>CONCRETE – Brandbuilding GmbH</span><a class="mail" href="mailto:wolfram@concrete-designs.de?subject=CONCRETE%20Magazin">E-Mail an Wolfram<svg viewBox="0 0 14 14"><path d="M2 7h10M8 3l4 4-4 4"/></svg></a></p>
        </div>
        <div class="act" style="margin-top:22px">
          <a class="btn pri" data-go target="_blank" rel="noopener"><span class="tile"><img src="${a("assets/mag-thumb-160.webp")}" srcset="${a("assets/mag-thumb-320.webp")} 2x" alt="" width="66" height="66"></span><span class="t">Magazin entdecken<small>Direkt im Browser durchblättern</small></span><svg viewBox="0 0 18 18"><path d="M3 9h12M10 4l5 5-5 5"/></svg></a>
          <button class="btn" data-pdf><span class="tile"><svg viewBox="0 0 20 20"><path d="M10 3v10M5.5 8.5 10 13l4.5-4.5M3 17h14"/></svg></span><span class="t">PDF herunterladen<small>Oder gedruckt per Post, 44 Seiten</small></span><svg viewBox="0 0 18 18"><path d="M3 9h12M10 4l5 5-5 5"/></svg></button>
        </div>
      </div>

      <form class="form" novalidate>
        <button type="button" class="back" data-back>← Zurück</button>
        <h3 class="h3" id="fh">Das Magazin<br><em>zum Behalten.</em></h3>
        <p class="lead">Alle 44 Seiten als PDF oder gedruckt per Post.</p>
        <div class="f"><label for="fn">Ansprechpartner *</label><input id="fn" name="name" autocomplete="name" required placeholder="Vor- und Nachname"></div>
        <div class="f"><label for="fc">Unternehmen</label><input id="fc" name="company" autocomplete="organization"></div>
        <div class="f"><label for="fe">E-Mail *</label><input id="fe" name="email" type="email" autocomplete="email" required placeholder="name@unternehmen.de"></div>
        <div class="f"><label for="fs">Wo steht ihr gerade?</label>
          <select id="fs" name="situation">
            <option value="">Situation auswählen</option>
            <option>Unsere Marke ist nicht mitgewachsen</option>
            <option>Unsere Leistung ist schwer zu erklären</option>
            <option>Wir müssen Vertrauen in einem skeptischen Markt aufbauen</option>
            <option>Wir bringen ein neues Produkt oder eine neue Marke</option>
            <option>Wir stecken mitten in einer Veränderung</option>
            <option>Wir wollen uns im Markt neu positionieren</option>
            <option>Wir schauen uns erst einmal um</option>
            <option>Etwas anderes</option>
          </select></div>
        <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <button class="btn pri plain" type="submit" data-kind="pdf" disabled><span class="t">PDF herunterladen</span><svg viewBox="0 0 18 18"><path d="M9 3v9M5 8l4 4 4-4M3 15h12"/></svg></button>
        <button class="btn plain" type="button" data-post-toggle aria-expanded="false"><span class="t">Gedruckt per Post anfordern</span><svg class="chev" viewBox="0 0 18 18"><path d="M4 7l5 5 5-5"/></svg></button>
        <div class="post" hidden>
          <div class="f"><label for="fst">Straße und Hausnummer *</label><input id="fst" name="street" autocomplete="street-address"></div>
          <div class="row plz">
            <div class="f"><label for="fz">PLZ *</label><input id="fz" name="zip" autocomplete="postal-code" inputmode="numeric"></div>
            <div class="f"><label for="fo">Ort *</label><input id="fo" name="city" autocomplete="address-level2"></div>
          </div>
          <p class="note">Das Porto übernehmen wir.</p>
          <button class="btn pri plain" type="submit" data-kind="post" disabled><span class="t">Per Post anfordern</span><svg viewBox="0 0 18 18"><path d="M3 9h12M10 4l5 5-5 5"/></svg></button>
        </div>
        <p class="legal">* Pflichtangaben. Eure Angaben nutzen wir nur, um euch das Magazin bereitzustellen. <a href="/datenschutz" target="_blank" rel="noopener">Datenschutz</a></p>
      </form>

      <div class="done">
        <h3 class="h3" id="dh">Danke!</h3>
        <p class="kick" data-done-tx></p>
        <a class="btn" data-go target="_blank" rel="noopener"><span class="tile"><img src="${a("assets/mag-thumb-160.webp")}" srcset="${a("assets/mag-thumb-320.webp")} 2x" alt="" width="66" height="66"></span><span class="t">Lieber online blättern<small>Das ganze Magazin im Browser</small></span><svg viewBox="0 0 18 18"><path d="M3 9h12M10 4l5 5-5 5"/></svg></a>
      </div>
    </div>
  </div>
</div>`;

  const TAB_HTML = `<div class="tabw" hidden><button class="tab" aria-label="Magazin öffnen: 11 B2B-Situationen"><img src="${a("assets/mag-thumb-320.webp")}" alt="" width="52" height="52"><span class="txt"><span>Magazin<small>11 B2B-Situationen</small></span><svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span></button><button class="tabx" aria-label="Magazin-Hinweis ausblenden"><svg viewBox="0 0 10 10"><path d="M1 1l8 8M9 1 1 9"/></svg></button></div>`;
  const host = document.createElement("div");
  host.id = "cbm-magazin-popup";
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = `<style>${CSS}</style>${HTML}${TAB_HTML}`;
  const $ = s => root.querySelector(s);
  const pop = $(".cbm"), book = $(".book"), zoom = $(".zoom"), card = $(".card"), form = $("form");
  const setTheme = t => { pop.classList.remove("t-paper", "t-sand", "t-coral-l"); if (t) pop.classList.add("t-" + t); };
  setTheme(THEME);
  const PDF = a("CONCRETE_Brandbuilding_Magazin.pdf");
  const UTM = "utm_source=website&utm_medium=popup&utm_campaign=magazin";

  const track = (name, detail = {}) => {
    window.dispatchEvent(new CustomEvent("cbm:" + name, { detail }));
    if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: "cbm_" + name, ...detail });
  };
  root.querySelectorAll("[data-go]").forEach(g => {
    g.href = `${EPAPER}?src=popup&${UTM}`;
    g.onclick = () => { track("click", { action: "epaper" }); close(); };
  });
  const step = s => { card.classList.remove("step-form", "step-done"); if (s) card.classList.add("step-" + s); card.scrollTop = 0; };
  $("[data-pdf]").onclick = () => { step("form"); track("click", { action: "pdf" }); setTimeout(() => { refreshBtns(); $("#fn").focus(); }, 30); };
  $("[data-back]").onclick = () => step(null);

  // ---------- Lead-Formular → Google Sheet ----------
  // PDF: Name + E-Mail Pflicht. Post: zusätzlich Adresse. Buttons erst aktiv, wenn das erfüllt ist.
  const f = form.elements;
  const okBase = () => f.name.value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim());
  const okPost = () => okBase() && f.street.value.trim() && /^\d{4,5}$/.test(f.zip.value.trim()) && f.city.value.trim();
  const refreshBtns = () => {
    $('[data-kind="pdf"]').disabled = !okBase();
    $('[data-kind="post"]').disabled = !okPost();
  };
  form.addEventListener("input", refreshBtns);
  form.addEventListener("change", refreshBtns);
  if (!LEAD_ENDPOINT) $("[data-post-toggle]").hidden = true;   // ohne Sheet-Anbindung keine Post-Bestellung
  $("[data-post-toggle]").onclick = e => {
    const post = $(".post"), show = post.hidden;
    post.hidden = !show;
    e.currentTarget.setAttribute("aria-expanded", show);
    if (show) setTimeout(() => $("#fst").focus(), 30);
  };
  form.onsubmit = e => {
    e.preventDefault();
    const kind = e.submitter?.dataset.kind || "pdf";
    if (kind === "pdf" ? !okBase() : !okPost()) return;
    const lead = { type: kind === "post" ? "Post" : "PDF", name: f.name.value.trim(), company: f.company.value.trim(),
      email: f.email.value.trim(), situation: f.situation.value,
      address: kind === "post" ? `${f.street.value.trim()}, ${f.zip.value.trim()} ${f.city.value.trim()}` : "",
      source: "popup", page: location.href, website: f.website.value };
    if (LEAD_ENDPOINT) fetch(LEAD_ENDPOINT, { method: "POST", mode: "no-cors", body: JSON.stringify(lead) }).catch(() => {});
    else console.info("[CBM Lead – kein Endpunkt eingetragen]", lead);
    track("lead", { type: lead.type, situation: lead.situation || null });
    $("#dh").textContent = `Danke, ${lead.name.split(" ")[0]}!`;
    if (kind === "post") {
      $("[data-done-tx]").innerHTML = `Wir schicken euch das gedruckte Magazin in den nächsten Tagen zu. Das Porto übernehmen wir. Bis dahin: <a href="${PDF}">PDF herunterladen</a>.`;
    } else {
      const dl = document.createElement("a");               // Download im selben Klick → kein Pop-up-Blocker
      dl.href = PDF; dl.download = ""; document.body.append(dl); dl.click(); dl.remove();
      $("[data-done-tx]").innerHTML = `Der Download startet gerade. Falls nicht: <a href="${PDF}">PDF hier laden</a>.`;
    }
    step("done");
  };

  let lastFocus = null;
  function open() {
    if (pop.classList.contains("open")) return;
    lastFocus = document.activeElement;
    pop.classList.add("open");
    $(".tabw").hidden = true;
    $(".card").focus({ preventScroll: true });
    try { seenStore.setItem(KEY, Date.now()); } catch {}
    track("open");
    start();
  }
  function close() {
    if (!pop.classList.contains("open")) return;
    pop.classList.remove("open");
    lastFocus?.focus?.({ preventScroll: true });
    track("close");
    showTab();
  }
  root.querySelectorAll("[data-close]").forEach(b => b.onclick = close);
  pop.addEventListener("click", e => { if (e.target === pop) close(); });
  document.addEventListener("keydown", e => {
    if (!pop.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "Tab") {                                 // Fokus im Dialog halten
      const f = [...pop.querySelectorAll("button,select,input:not(.hp),a[href]")].filter(el => el.offsetParent);
      const i = f.indexOf(root.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });

  // ---------- 3D-Heft in Original-Reihenfolge ----------
  // Blatt i: Vorderseite = Seite 2i+1 (rechts), Rückseite = Seite 2i+2 (links) → U1 | U2·03 | 04·05 …
  const SEG = 6, LEAVES = 12;
  const img = n => a(`pages/md/p${String(n).padStart(2, "0")}.webp`);
  const GRAIN = a("assets/paper-grain.png");
  const leaves = [];
  // Biegung abhängig von der Lage: rechts rollt die Kante vor, links landet sie zuletzt → nie durch den Stapel
  function set(l, angle, B, shade) {
    l.a = angle;
    const p = -angle / 180;
    const bend = -B * Math.sin(2 * Math.PI * p);
    const z = l.zR + (l.zL - l.zR) * p + Math.sin(Math.PI * p) * 4;
    l.el.style.transform = `translateZ(${z}px) rotateY(${angle}deg)`;
    for (let k = 1; k < SEG; k++) l.segs[k].style.transform = `rotateY(${bend * (0.5 + k * 0.1)}deg)`;
    l.el.style.setProperty("--sh", shade);
    stack();
  }
  // Dicke der beiden Stapel aus der Zahl der links liegenden Blätter (Heft: 22 Blätter)
  function stack() {
    if (!leaves.length) return;
    const n = leaves.filter(x => x.a <= -178).length;
    const T = parseFloat(getComputedStyle(book).getPropertyValue("--T")) || 10;
    const tl = T * n / 22;
    book.style.setProperty("--TL", tl + "px");
    book.style.setProperty("--TR", (T - tl) + "px");
    book.style.setProperty("--ZL", (n * 0.2) + "px");
    book.style.setProperty("--ZR", ((LEAVES - n) * 0.2) + "px");
    book.classList.toggle("lstack", n >= 2);  // Cover allein links braucht keinen Stapel
  }
  for (let i = 0; i < LEAVES; i++) {
    const el = document.createElement("div");
    el.className = "leaf" + (i === 0 ? " cover" : "");
    const segs = [];
    let parent = el;
    for (let k = 0; k < SEG; k++) {
      const seg = document.createElement("div");
      seg.className = "seg";
      const last = k === SEG - 1;              // äußerster Streifen: kein Überstand → keine helle Kante
      const pf = `calc(var(--W) / -${SEG} * ${k}) 0`, pb = `calc(var(--W) / -${SEG} * ${SEG - 1 - k}${last ? "" : " + 1px"}) 0`;
      // Papierkorn (multipliziert) über dem Seitenbild; Korn läuft über die Streifen durch
      const gx = `calc(var(--W) / -${SEG} * ${k})`;
      seg.innerHTML = `<div class="face f${k ? "" : " gut"}${last ? " last" : ""}" style="background-image:url(${GRAIN}),url(${img(2 * i + 1)});background-position:${gx} 0,${pf}"></div>` +
                      `<div class="face b${k ? "" : " gut"}${last ? " last" : ""}" style="background-image:url(${GRAIN}),url(${img(2 * i + 2)});background-position:${gx} 0,${pb}"></div>`;
      parent.append(seg); parent = seg; segs.push(seg);
    }
    const leaf = { el, segs, zR: (LEAVES - i) * 0.2, zL: 0.2 + i * 0.2, a: 0 };
    set(leaf, 0, 0, 0);
    book.append(el);
    leaves.push(leaf);
  }
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const turn = (l, to, ms, B) => new Promise(res => {
    const from = l.a, t0 = performance.now();
    const step = now => {
      const t = Math.min(1, (now - t0) / ms), e = ease(t);
      set(l, from + (to - from) * e, B, 0.2 * Math.sin(Math.PI * e));
      t < 1 ? requestAnimationFrame(step) : res();
    };
    requestAnimationFrame(step);
  });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const waitOpen = async () => { while (!pop.classList.contains("open") || document.hidden) await sleep(300); };

  let running = false;
  async function loop() {
    const RIFFLE = LEAVES - 2;
    while (true) {
      await waitOpen();
      await sleep(1700);                                   // Cover, herangezoomt
      book.classList.add("open"); zoom.classList.add("open");   // aufklappen + gleichzeitig herauszoomen
      await turn(leaves[0], -180, 1150, 5);                // aufklappen → U2 | 03
      await sleep(1500);
      const riffle = [];                                   // durchblättern
      for (let i = 1; i <= RIFFLE; i++) {
        riffle.push(turn(leaves[i], -180, 680, 12));
        await sleep(Math.max(120, 210 - i * 10));
      }
      await Promise.all(riffle);
      await sleep(1500);
      const shut = [];                                     // schließen
      for (let i = RIFFLE; i >= 0; i--) { shut.push(turn(leaves[i], 0, 950, 3)); await sleep(22); }
      book.classList.remove("open"); zoom.classList.remove("open");
      await Promise.all(shut);
      await sleep(1200);
    }
  }
  function start() {
    if (running) return;
    running = true;
    for (let n = 1; n <= LEAVES * 2 + 1; n++) { const i = new Image(); i.src = img(n); }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { book.classList.add("open", "lstack"); zoom.classList.add("open"); set(leaves[0], -180, 0, 0); }
    else loop();
  }

  // ---------- Seitlicher Button ----------
  const TAB_OFF = "cbm_tab_off";
  function showTab() {
    let off = false; try { off = sessionStorage.getItem(TAB_OFF) === "1"; } catch {}
    if (!TAB || off || EXCLUDE.test(location.pathname)) return;
    $(".tabw").hidden = false;
    try { seenStore.setItem(TAB_KEY, "1"); } catch {}
  }
  $(".tab").onclick = () => { track("click", { action: "tab" }); open(); };
  $(".tabx").onclick = () => {                              // für diesen Besuch ausblenden
    $(".tabw").hidden = true;
    try { sessionStorage.setItem(TAB_OFF, "1"); } catch {}
    track("tab_close");
  };

  // ---------- Auslöser ----------
  // Erst wenn das Cookie-Banner der Website erledigt ist (sonst zwei Dialoge übereinander)
  const consentOpen = () => {
    const ui = document.querySelector("[data-consent-ui]");
    return (ui && !ui.hidden) || document.documentElement.classList.contains("consent-open");
  };
  const whenConsentDone = fn => { const t = setInterval(() => { if (!consentOpen()) { clearInterval(t); fn(); } }, 600); };
  let triggered = false;
  const trigger = () => { if (triggered) return; triggered = true; consentOpen() ? whenConsentDone(open) : open(); };

  function arm() {
    let recently = false, tabBefore = false;
    try {
      const seen = +seenStore.getItem(KEY) || 0;
      recently = PER_VISIT ? seen > 0 : Date.now() - seen < COOLDOWN;
      tabBefore = seenStore.getItem(TAB_KEY) === "1";
    } catch {}
    if (EXCLUDE.test(location.pathname)) return;
    if (recently || tabBefore) showTab();                  // schon gesehen → nur der seitliche Button
    if (!AUTOSTART || recently) return;
    // 3. Section unter dem Hero; ohne Hero: Scrolltiefe
    const sections = [...document.querySelectorAll("main > section")];
    const hero = sections.findIndex(el => /hero/.test(el.className) || el.hasAttribute("data-hero"));
    const target = hero >= 0 ? sections[hero + SECTION] : null;
    if (target && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); trigger(); } },
        { rootMargin: "0px 0px -25% 0px" });
      io.observe(target);
    } else {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - innerHeight;
        if (max > 0 && scrollY / max >= TRIGGER) { removeEventListener("scroll", onScroll); trigger(); }
      };
      addEventListener("scroll", onScroll, { passive: true });
    }
  }

  document.addEventListener("click", e => {
    const link = e.target.closest?.("[data-cbm-open]");
    if (!link) return;
    e.preventDefault();
    const menu = document.querySelector("[data-menu-toggle][aria-expanded='true']");
    if (menu) menu.click();                                  // mobiles Menü schließen
    track("click", { action: "menu" });
    open();
  });

  const mount = () => { document.body.append(host); arm(); };
  document.body ? mount() : addEventListener("DOMContentLoaded", mount);
  window.CBMPopup = { open, close, setTheme, showTab };
})();
