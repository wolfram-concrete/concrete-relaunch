# -*- coding: utf-8 -*-
"""Verlinkt jede Branchenseite aus den Cases heraus, die sie selbst zeigt.
Ohne Rueckverlinkung haengen die Branchenseiten nur an branchen.html."""
import io,re,glob,html,collections

def esc(t): return html.escape(t,quote=False).replace("&amp;","&")
def txt(t): return re.sub(r"\s+"," ",html.unescape(re.sub(r"<[^>]+>","",t))).strip()

BRANCHEN=[f[:-5] for f in glob.glob("*.html")
          if f[:-5].endswith("brands") or f[:-5] in ("startups","b2b-marken-mallorca")]

def main():
    # Welche Cases zeigt welche Branchenseite?
    zuordnung=collections.defaultdict(list)
    titel={}
    for b in BRANCHEN:
        h=io.open(b+".html",encoding="utf-8").read()
        m=re.search(r"<title>(.*?)</title>",h,re.S)
        t=txt(m.group(1)).split(" · ")[0] if m else b
        titel[b]=t
        block=re.search(r'<div class="bimgs[^"]*"[^>]*>(.*?)</div>\s*<p',h,re.S)
        if not block: continue
        for case in re.findall(r'href="(case-[a-z0-9-]+)"',block.group(1)):
            zuordnung[case].append(b)

    geaendert=0
    for case,bs in sorted(zuordnung.items()):
        f=case+".html"
        try: h=io.open(f,encoding="utf-8").read()
        except FileNotFoundError: continue
        h=re.sub(r'\n      <span class="lbl[^"]*">Branche</span>\n      <span class="svc branche">.*?</span>\n?\s*','',h,flags=re.S)
        links=" · ".join('<a href="%s">%s</a>'%(b,esc(titel[b])) for b in bs)
        zeile='\n      <span class="lbl branche">Branche</span>\n      <span class="svc branche">%s</span>\n    '%links
        # Ans Ende des case-meta-Containers haengen. Das Raster hat drei Spalten
        # (Label, Wert, Kundenlogo); so fuellt die bestehende Zeile zuerst auf
        # und Branche steht als eigene Zeile darunter.
        # Der Container enthaelt nur spans, das erste </div> schliesst ihn.
        m=re.search(r'<div class="case-meta"[^>]*>\s*<div class="container">(.*?)</div>',h,re.S)
        if not m:
            print("  kein case-meta-Container:",case); continue
        h=h[:m.end(1)]+zeile+h[m.end(1):]
        io.open(f,"w",encoding="utf-8").write(h); geaendert+=1
    print("Branchenlink gesetzt auf",geaendert,"Case-Seiten")
    print("Branchenseiten ohne Case-Rueckverlinkung:",
          sorted(set(BRANCHEN)-{b for bs in zuordnung.values() for b in bs}))

if __name__=="__main__": main()
