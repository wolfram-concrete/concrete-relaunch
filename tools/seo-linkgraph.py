# -*- coding: utf-8 -*-
"""Prueft die interne Verlinkung ausserhalb von Header und Footer.

Footer-Links wiederholen sich auf jeder Seite und werden von Suchmaschinen
abgewertet. Jede Seite braucht Eingaenge aus dem Fliesstext.
Exit 1, wenn eine Seite weniger als MIN_KONTEXT solcher Eingaenge hat.
"""
import io,re,glob,sys,collections,json

MIN_KONTEXT=3
AUSNAHMEN={"index","impressum","datenschutz","fakten-zu-concrete-brandbuilding-gmbh"}

def rumpf(html):
    """HTML ohne Header, Footer, Mega-Menue und Marquee."""
    s=html
    for muster in (r'<header\b.*?</header>', r'<footer\b.*?</footer>',
                   r'<nav class="mobile-nav".*?</nav>',
                   r'<div class="case-marquee\b.*?</div>\s*</div>\s*</div>'):
        s=re.sub(muster,'',s,flags=re.S)
    return s

def sammeln():
    seiten=[f for f in sorted(glob.glob("*.html")) if not f.startswith("_")]
    ein=collections.Counter()
    quellen=collections.defaultdict(set)
    for f in seiten:
        h=io.open(f,encoding="utf-8").read()
        for m in re.finditer(r'href="([a-z0-9][a-z0-9._-]*\.html|[a-z0-9][a-z0-9-]*)"',rumpf(h)):
            ziel=m.group(1).replace(".html","")
            if ziel==f[:-5]: continue
            ein[ziel]+=1
            quellen[ziel].add(f[:-5])
    return seiten,ein,quellen

def main():
    seiten,ein,quellen=sammeln()
    schwach=[]
    for f in seiten:
        slug=f[:-5]
        if slug in AUSNAHMEN: continue
        n=len(quellen[slug])
        if n<MIN_KONTEXT: schwach.append((n,slug))
    schwach.sort()
    print(f"{len(seiten)} Seiten, {len(schwach)} mit weniger als {MIN_KONTEXT} Kontextlinks")
    for n,s in schwach[:40]:
        print(f"  {n}  {s}")
    if len(schwach)>40: print(f"  ... und {len(schwach)-40} weitere")
    if "--json" in sys.argv:
        io.open("tools/linkgraph.json","w",encoding="utf-8").write(
            json.dumps({s:sorted(quellen[s]) for s in (f[:-5] for f in seiten)},ensure_ascii=False,indent=1))
    return 1 if schwach else 0

if __name__=="__main__": sys.exit(main())
