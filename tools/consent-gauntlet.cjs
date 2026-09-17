// Read-only website sources; isolated browser fixtures never book or submit a lead.
const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const root = process.argv[2] || path.resolve(__dirname,'..');
const source = fs.readFileSync(path.join(root,'consent-v9.js'),'utf8');
const css = fs.readFileSync(path.join(root,'site.css'),'utf8');
const origin = 'https://www.concrete-designs.de';
const key = 'concrete-consent-v4';
const record = (statistics,marketing,savedAt=new Date().toISOString()) => ({version:4,savedAt,statistics,marketing});
let browser, checks=0;
async function fixture({hero=false,stored=null,viewport={width:1440,height:1000},cookie=null,blockedStorage=false}={}) {
  const context=await browser.newContext({viewport,reducedMotion:'reduce'});
  const requests=[];
  if(cookie) await context.addCookies([{name:'borlabs-cookie',value:cookie,url:origin}]);
  await context.addInitScript(({key,stored,blockedStorage})=>{
    if(stored&&!sessionStorage.getItem('__consent_fixture_seeded')) {
      localStorage.setItem(key,JSON.stringify(stored));
      sessionStorage.setItem('__consent_fixture_seeded','1');
    }
    if(blockedStorage) Object.defineProperty(window,'localStorage',{get(){throw Error('disabled')}});
    window.__clarity=[];
    window.clarity=(...args)=>window.__clarity.push(args);
  },{key,stored,blockedStorage});
  await context.route('**/*', async route=>{
    const url=new URL(route.request().url());requests.push(url.href);
    if(url.origin===origin) {
      if(url.pathname==='/consent-v9.js') return route.fulfill({contentType:'application/javascript',body:source});
      if(url.pathname==='/site.css') return route.fulfill({contentType:'text/css',body:css});
      if(url.pathname.startsWith('/fonts/')) return route.fulfill({body:fs.readFileSync(path.join(root,url.pathname))});
      return route.fulfill({contentType:'text/html',body:`<!doctype html><html lang="de" ${hero?'data-hero-intro-state="waiting"':''}><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/site.css"><script src="/consent-v9.js"></script></head><body><main><h1>CONCRETE</h1><a href="/next">Weiter</a>${hero?'<div data-hero></div>':''}</main><div id="already-inert" inert>Vorher gesperrt</div><footer><button data-consent-manage>Cookie-Einstellungen</button></footer></body></html>`});
    }
    // Preserve tracking loader requests but never transfer visitor/lead data.
    return route.fulfill({status:200,contentType:'application/javascript',body:''});
  });
  const page=await context.newPage();
  await page.goto(origin,{waitUntil:'domcontentloaded'});
  return {page,context,requests};
}
function ok(name) { checks++; console.log('PASS '+name); }
async function state(page) { return page.evaluate(key=>({saved:JSON.parse(localStorage.getItem(key)),updates:window.dataLayer.filter(x=>x[0]==='consent').map(x=>[...x]),ga:window.BorlabsCookie.checkCookieConsent('google-analytics'),ads:window.BorlabsCookie.Consents.hasConsent('google-ads'),clarity:window.__clarity,inert:document.querySelector('main').inert}),key); }
async function run(){
 browser=await chromium.launch({headless:true});
 try {
  for(const [name,statistics,marketing] of [['accept',true,true],['reject',false,false],['statistics',true,false],['marketing',false,true]]){
   const {page,context,requests}=await fixture();
   await page.locator('[data-consent-banner]').waitFor({state:'visible'});
   assert.equal(await page.locator('[data-consent-banner] [data-consent-accept]').textContent(),'Alle akzeptieren');
   assert.equal(await page.locator('[data-consent-dialog] [data-consent-accept]').textContent(),'Alle akzeptieren');
   assert.equal(await page.locator('[data-consent-banner] [data-consent-reject]').textContent(),'Nur notwendige');
   assert.equal(await page.locator('[data-consent-settings]').textContent(),'Einstellungen');
   assert.equal(await page.locator('[data-consent-dialog] [data-consent-reject]').textContent(),'Nur notwendige');
   assert.equal(await page.locator('[data-consent-save]').textContent(),'Auswahl speichern');
   assert.equal((await state(page)).inert,true);
   assert.equal(requests.some(x=>x.includes('googletagmanager.com')),false);
   assert.equal(requests.some(x=>x.includes('collector.sortlist.com')),false);
   assert.equal(requests.some(x=>x.includes('salesviewer.org')),true);
   if(name==='accept') await page.click('[data-consent-banner] [data-consent-accept]');
   else if(name==='reject') await page.locator('[data-consent-banner] [data-consent-reject]').click();
   else {await page.click('[data-consent-settings]');await page.locator(statistics?'[data-consent-statistics]':'[data-consent-marketing]').check();await page.click('[data-consent-save]');}
   await page.waitForTimeout(100);
   const s=await state(page);assert.equal(s.saved.statistics,statistics);assert.equal(s.saved.marketing,marketing);
   assert.equal(s.saved.version,4);assert.equal(typeof s.saved.savedAt,'string');
   assert(Number.isFinite(Date.parse(s.saved.savedAt))&&Math.abs(Date.now()-Date.parse(s.saved.savedAt))<120000);
   assert.equal(s.ga,statistics);assert.equal(s.ads,marketing);assert.equal(s.inert,false);
   assert.equal(s.updates.at(-1)[2].analytics_storage,statistics?'granted':'denied');
   assert.equal(s.updates.at(-1)[2].ad_user_data,marketing?'granted':'denied');
   assert.equal(s.updates.at(-1)[2].ad_personalization,marketing?'granted':'denied');
   assert.equal(requests.filter(x=>x.includes('googletagmanager.com')).length,statistics||marketing?1:0);
   assert.equal(requests.filter(x=>x.includes('collector.sortlist.com')).length,marketing?1:0);
   assert.equal(await page.locator('#already-inert').evaluate(x=>x.inert),true);
   const cookie=(await context.cookies()).find(x=>x.name==='borlabs-cookie');assert(cookie);
   const payload=JSON.parse(decodeURIComponent(cookie.value));assert.equal(payload.consents.statistics.includes('google-analytics'),statistics);
   assert.equal(payload.savedAt,s.saved.savedAt);
   await page.goto(origin+'/next');assert.equal(await page.locator('[data-consent-ui]').isVisible(),false);
   await page.click('[data-consent-manage]');await page.locator('[data-consent-dialog]').waitFor({state:'visible'});
   assert.equal(await page.locator('[data-consent-statistics]').isChecked(),statistics);
   await page.keyboard.press('Escape');assert.equal(await page.locator('[data-consent-ui]').isVisible(),false);
   assert.equal(await page.locator('[data-consent-manage]').evaluate(x=>x===document.activeElement),true);
   ok(name+': defaults, category contract, loaders, persistence, reopen, focus/inert');await context.close();
  }
  for(const stored of [null,record(false,false)]){
   const {page,context,requests}=await fixture({stored});
   if(stored)await page.click('[data-consent-manage]');else await page.click('[data-consent-settings]');
   await page.locator('[data-consent-dialog] [data-consent-accept]').click();
   const s=await state(page);assert.equal(s.saved.statistics,true);assert.equal(s.saved.marketing,true);
   assert.equal(s.ga,true);assert.equal(s.ads,true);assert.equal(s.inert,false);
   assert(Number.isFinite(Date.parse(s.saved.savedAt))&&Math.abs(Date.now()-Date.parse(s.saved.savedAt))<120000);
   const payload=JSON.parse(decodeURIComponent((await context.cookies()).find(x=>x.name==='borlabs-cookie').value));
   assert.equal(payload.savedAt,s.saved.savedAt);
   assert.equal(requests.filter(x=>x.includes('googletagmanager.com')).length,1);
   assert.equal(requests.filter(x=>x.includes('collector.sortlist.com')).length,1);
   await page.goto(origin+'/next');assert.equal(await page.locator('[data-consent-ui]').isVisible(),false);
   assert.equal((await state(page)).saved.savedAt,s.saved.savedAt);
   ok((stored?'return':'fresh')+' settings accept-all, timestamp consistency and persistence');await context.close();
  }
  { 
   const {page,context}=await fixture();await page.click('[data-consent-settings]');await page.keyboard.press('Escape');
   assert.equal(await page.locator('[data-consent-banner]').isVisible(),true);assert.equal((await state(page)).inert,true);
   await page.locator('[data-consent-settings]').focus();await page.keyboard.press('Tab');
   assert.equal(await page.locator('[data-consent-banner] a').first().evaluate(x=>x===document.activeElement),true);
   await page.keyboard.press('Shift+Tab');assert.equal(await page.locator('[data-consent-settings]').evaluate(x=>x===document.activeElement),true);
   await page.keyboard.press('Escape');assert.equal((await state(page)).saved.statistics,false);
   ok('fresh settings close, bidirectional focus trap, Escape rejects');await context.close();
  }
  for(const invalid of [record(true,true,'2020-01-01'),record(true,true,'2099-01-01'),{version:3,savedAt:new Date().toISOString()},record(true,true,'invalid')]){
   const {page,context}=await fixture({stored:invalid});assert.equal(await page.locator('[data-consent-banner]').isVisible(),true);assert.equal((await state(page)).ga,false);await context.close();
  }ok('expired, future, old-version, invalid timestamps rejected');
  {
   const {page,context}=await fixture({cookie:'%not-decodable'});assert.equal(await page.locator('[data-consent-banner]').isVisible(),true);await context.close();ok('malformed compatibility cookie cannot crash consent');
  }
  {
   const {page,context}=await fixture({blockedStorage:true});await page.click('[data-consent-banner] [data-consent-accept]');await page.goto(origin+'/next');assert.equal(await page.locator('[data-consent-ui]').isVisible(),false);await context.close();ok('cookie fallback when localStorage unavailable');
  }
  {
   const {page,context}=await fixture({hero:true});assert.equal(await page.locator('[data-consent-ui]').isVisible(),false);
   await page.evaluate(()=>window.dispatchEvent(new CustomEvent('concrete:hero-reel-complete')));
   await page.locator('[data-consent-banner]').waitFor({state:'visible',timeout:1000});await context.close();ok('homepage reveal after reel, independent of final video loop');
  }
  {
   const {page,context}=await fixture({hero:true});await page.locator('[data-consent-banner]').waitFor({state:'visible',timeout:9000});await context.close();ok('hero failure safety fallback within 8 seconds');
  }
  for(const viewport of [{width:390,height:844},{width:320,height:568},{width:720,height:500}]){
   const {page,context}=await fixture({viewport});
   for(const selector of ['[data-consent-banner]','[data-consent-dialog]']){
    if(selector.includes('dialog')) await page.click('[data-consent-settings]');
    const box=await page.locator(selector).boundingBox();assert(box.x>=0&&box.x+box.width<=viewport.width+1);assert(box.y>=0&&box.y+box.height<=viewport.height+1);
    const overflow=await page.locator(selector).evaluate(x=>x.scrollWidth>x.clientWidth);assert.equal(overflow,false);
    assert.equal(await page.locator(selector).evaluate(x=>getComputedStyle(x).animationName),'none');
   }
   await context.close();ok(`mobile/reflow/reduced-motion ${viewport.width}x${viewport.height}`);
  }
  {
   const {page,context}=await fixture();await page.click('[data-consent-banner] [data-consent-accept]');
   await page.evaluate(()=>{document.cookie='_ga=demo;Path=/';document.cookie='_gcl_au=demo;Path=/'});
   await page.click('[data-consent-manage]');await page.locator('[data-consent-statistics]').uncheck();
   await Promise.all([page.waitForEvent('domcontentloaded'),page.click('[data-consent-save]')]);
   const s=await state(page);assert.equal(s.ga,false);assert.equal(s.ads,true);
   const names=(await context.cookies()).map(x=>x.name);assert.equal(names.includes('_ga'),false);assert.equal(names.includes('_gcl_au'),true);
   await page.click('[data-consent-manage]');await Promise.all([page.waitForEvent('domcontentloaded'),page.locator('[data-consent-dialog] [data-consent-reject]').click()]);
   assert.equal((await state(page)).ads,false);assert.equal((await context.cookies()).some(x=>x.name==='_gcl_au'),false);
   await context.close();ok('partial + full withdrawal: reload, correct category cookies removed');
  }
  {
   const {page,context}=await fixture({blockedStorage:true});
   await page.evaluate(()=>{delete window.clarity;Object.defineProperty(document,'cookie',{get:()=>'',set:()=>{}})});
   await page.click('[data-consent-banner] [data-consent-accept]');await page.click('[data-consent-manage]');await page.click('[data-consent-save]');
   await page.evaluate(()=>{window.clarity=(...args)=>window.__clarity.push(args)});await page.waitForTimeout(600);
   const latest=await page.evaluate(()=>window.__clarity.at(-1));assert.equal(latest[1].analytics_Storage,'denied');assert.equal(latest[1].ad_Storage,'denied');
   await context.close();ok('delayed Clarity retry uses latest choice even when all persistence is blocked');
  }
  console.log(`RESULT ${checks} scenario groups passed; external GTM tag execution requires separate live verification.`);
 } finally {await browser.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
