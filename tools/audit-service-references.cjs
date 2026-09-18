// Read-only audit; --patch emits an apply_patch-compatible update.
const fs = require('fs');
const cp = require('child_process');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const pages = Object.fromEntries(files.map(f => [f.slice(0,-5), fs.readFileSync(f,'utf8')]));
const text = s => s.replace(/<[^>]*>/g,'').replace(/&shy;/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').trim();
const esc = s => s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const attrs = s => Object.fromEntries([...s.matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
const serviceKeys = new Set(Object.entries(pages).filter(([k,s])=>s.includes('Leistung · Phase')).map(([k])=>k));
for (const list of pages.leistungen.matchAll(/<ul class="svc-list">([\s\S]*?)<\/ul>/g))
  for(const a of list[1].matchAll(/href="([^"]+)"/g)) if(pages[a[1]]) serviceKeys.add(a[1]);
const tiles = {};
for(const m of pages.projekte.matchAll(/<a class="ptile[^>]*href="(case-[^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
  tiles[m[1]] = {name:text(m[2].match(/<b>(.*?)<\/b>/)?.[1]||m[1]),industry:text(m[2].match(/<i>(.*?)<\/i>/)?.[1]||'')};
}
const cases = {};
for(const [key,s] of Object.entries(pages).filter(([k])=>k.startsWith('case-'))) {
  const meta=s.match(/class="case-meta"[\s\S]*?class="svc"[^>]*>([\s\S]*?)<\/span>/)?.[1]||'';
  const services=[...new Set([...meta.matchAll(/href="([^"]+)"/g)].map(m=>m[1]))];
  const hero=s.match(/<section class="case-hero"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  if(!hero || !tiles[key]) continue;
  const tag=hero.match(/<(img|video)\b[^>]*>/);
  if(!tag) continue;
  const a=attrs(tag[0]);
  const src=tag[1]==='video'?a.poster:a.src;
  if(!src) continue;
  let w=+a.width,h=+a.height;
  if(!w||!h){try{const dims=cp.execFileSync('/opt/homebrew/bin/ffprobe',['-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','csv=p=0',src],{encoding:'utf8'}).trim().split(',');w=+dims[0];h=+dims[1];}catch{continue;}}
  const recording=[...s.matchAll(/<video\b[^>]*>/g)].map(m=>attrs(m[0])).find(v=>v['data-src']?.startsWith('assets/website-projects/')||v['data-src']?.endsWith('/parq-website.mp4'));
  cases[key]={...tiles[key],services,src,w,h,srcset:a.srcset,alt:a.alt||tiles[key].name,recording};
}
let patch='*** Begin Patch\n';
let report='# Leistungsreferenzen – Abgleich 18.09.2026\n\nQuelle: Leistungslinks in „Was wir gemacht haben“ der Case-Seiten. Bestehende kuratierte Referenzen bleiben erhalten. Hero-Motive und deren Seitenverhältnis werden übernommen. Website-Sections behalten ihre Screencasts; weitere belegte Website-Cases ohne verfügbaren Screencast werden hier nur dokumentiert. Keine Leistungszuordnung auf Verdacht.\n\n| Leistung | Bestehende Referenzen | Ergänzt | Noch ohne Screencast / ohne belegten Case |\n|---|---:|---|---|\n';
let additions=0,changed=0;
for(const key of [...serviceKeys].sort()) {
  const s=pages[key];
  const section=s.match(/<section\b[^>]*class="[^"]*website-projects[^\"]*"[\s\S]*?<\/section>/)?.[0];
  const existing=section?[...section.matchAll(/class="website-project__link"[^>]*href="([^"]+)"/g)].map(m=>m[1]):[];
  const matches=Object.keys(cases).filter(c=>cases[c].services.includes(key));
  const norm=s=>text(s).toLowerCase().replace(/[^a-z0-9]/g,'');
  const names=section?[...section.matchAll(/<h3[^>]*>(.*?)<\/h3>/g)].map(m=>norm(m[1])):[];
  const missing=matches.filter(c=>!existing.includes(c)&&!names.includes(norm(cases[c].name))&&!(c==='case-link'&&names.includes('linkkarriere')));
  const website=['website-design','website-konzept'].includes(key);
  const add=website?missing.filter(c=>cases[c].recording):missing;
  const title=text(s.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]||key);
  report+=`| ${title} | ${existing.length} | ${add.map(c=>cases[c].name).join(', ')||'–'} | ${website?missing.map(c=>cases[c].name).join(', '):matches.length?'–':'Kein expliziter Leistungslink in den Cases'} |\n`;
  if(!add.length)continue;
  const cards=add.map((c,i)=>{const p=cases[c];return `<li class="website-project rv" style="--project-ratio:${p.w}/${p.h};--project-delay:${(i%3*.06).toFixed(2)}s"><a class="website-project__link" data-plx="${i%2?4:-4}" href="${c}"><figure class="website-project__media"><img src="${p.src}"${p.srcset?` srcset="${p.srcset}"`:''} sizes="(max-width:540px) 100vw, (max-width:1000px) 50vw, 33vw" width="${p.w}" height="${p.h}" alt="${esc(text(p.alt))}" loading="lazy" decoding="async"></figure><div class="website-project__head"><h3>${esc(p.name)}</h3><span aria-hidden="true"></span></div><span class="website-project__industry">${esc(p.industry)}</span><span class="website-project__copy">${esc(title)} als Teil der Markenarbeit für ${esc(p.name)}.</span></a></li>`;}).join('\n');
  let next;
  let recordingIndex=0;
  const rendered=website?cards.replace(/--project-ratio:[^;]+/g,'--project-ratio:16/9').replace(/<figure class="website-project__media"><img[^>]*><\/figure>/g,()=>{const p=cases[add[recordingIndex++]];const v=p.recording;return `<figure class="website-project__media"><video data-lazy-autoplay data-src="${v['data-src']}" poster="${v.poster||v['data-fallback']||p.src}"${v['data-start-time']?` data-start-time="${v['data-start-time']}"`:''} width="1920" height="1080" muted loop playsinline preload="none" aria-label="${esc(p.name)} Website-Screencast"></video></figure>`;}):cards;
  if(section)next=s.replace(section,section.replace('</ul>',rendered+'\n</ul>'));
  else {
    const block=`<section class="sec website-projects sec--line" id="projekt-referenzen" data-screen-label="Projektreferenzen" aria-labelledby="projekt-referenzen-title"><div class="container"><div class="website-projects__intro rv"><h2 id="projekt-referenzen-title">Projekte: ${esc(title)}</h2><p>Konkrete Einblicke in unsere Arbeit – diese Projekte verbinden ${esc(title)} mit einer klaren Markenidee.</p></div><ul class="website-projects__list" aria-label="Projektreferenzen">\n${cards}\n</ul></div></section>\n`;
    const first=s.match(/<section class="sec sec--line"[\s\S]*?<\/section>/);
    if(!first)throw Error('No insertion anchor: '+key);
    next=s.replace(first[0],first[0]+'\n'+block);
  }
  if(!next.includes('href="service-references.css'))next=next.replace('</head>','<link rel="stylesheet" href="service-references.css?v=2">\n</head>');
  // Full-file replacement avoids ambiguity in compact legacy HTML.
  if(!process.argv.includes('--page')||process.argv[process.argv.indexOf('--page')+1]===key)patch+=`*** Update File: ${process.cwd()}/${key}.html\n@@\n`+s.trimEnd().split('\n').map(l=>'-'+l).join('\n')+'\n'+next.trimEnd().split('\n').map(l=>'+'+l).join('\n')+'\n';
  additions+=add.length;changed++;
}
report+=`\n${serviceKeys.size} Leistungsdetailseiten geprüft; ${additions} fehlende Referenzen auf ${changed} Seiten ergänzt.\n`;
if(!process.argv.includes('--page')||process.argv[process.argv.indexOf('--page')+1]==='report')patch+=`*** Add File: ${process.cwd()}/docs/LEISTUNGSREFERENZEN-2026-09-18.md\n`+report.trimEnd().split('\n').map(l=>'+'+l).join('\n')+'\n';
patch+='*** End Patch\n';
if(process.argv.includes('--patch'))process.stdout.write(patch);else console.log(report);
