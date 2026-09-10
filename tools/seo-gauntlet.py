# -*- coding: utf-8 -*-
"""Prueft die SEO-/GEO-Grundlagen der Seite. Exit 1, wenn etwas fehlt."""
import io,re,os,glob,json,sys,html
BASE="https://www.concrete-designs.de"
S=os.path.dirname(os.path.abspath(__file__))  # tools/
BRANCHEN={
 "architektur-und-immobilien-brands":"Strategie und Branding für Architekten und Real Estate",
 "b2b-marken-mallorca":"Brand Building für anspruchsvolle B2B-Marken auf Mallorca",
 "consulting-it-und-finance-brands":"Strategie und Branding für Consulting, IT und Finance",
 "event-und-entertainment-brands":"Strategie und Branding für Event und Entertainment",
 "family-und-kids-brands":"Strategie und Branding für Family und Kids",
 "food-und-beverage-brands":"Strategie und Branding für Food & Beverage",
 "b2b-brands":"Strategie und Branding für B2B-Marken",
 "marketing-und-media-brands":"Strategie und Branding für Marketing und Media",
 "recruiting-brands":"Strategie und Branding für Recruiting",
 "startups":"Strategie und Branding für Startups",
}
def txt(t): return re.sub(r"\s+"," ",html.unescape(re.sub(r"<[^>]+>","",t))).strip()

def main():
    fehler=[]
    seiten=sorted(f for f in glob.glob("*.html") if not f.startswith("_"))
    descs={}; titles={}
    for f in seiten:
        s=io.open(f,encoding="utf-8").read()
        slug=f[:-5]
        # 1 description
        m=re.search(r'<meta name="description" content="([^"]*)"',s)
        if not m: fehler.append(f"{f}: keine meta description")
        else:
            d=html.unescape(m.group(1))
            if not (60<=len(d)<=170): fehler.append(f"{f}: description {len(d)} Zeichen (60-170 erwartet)")
            if d in descs: fehler.append(f"{f}: description doppelt zu {descs[d]}")
            descs[d]=f
        # 2 canonical
        c=re.search(r'<link rel="canonical" href="([^"]*)"',s)
        soll=BASE+"/"+("" if slug=="index" else slug)
        if not c: fehler.append(f"{f}: kein canonical")
        elif c.group(1)!=soll: fehler.append(f"{f}: canonical {c.group(1)} statt {soll}")
        # 3 title
        t=re.search(r"<title>(.*?)</title>",s,re.S)
        if not t: fehler.append(f"{f}: kein title")
        else:
            tt=txt(t.group(1))
            grenze=110 if (tt.rstrip().endswith("?") or slug.startswith("situation-")) else 70
            if len(tt)>grenze: fehler.append(f"{f}: title {len(tt)} Zeichen (max {grenze}): {tt[:70]}")
            if tt in titles: fehler.append(f"{f}: title doppelt zu {titles[tt]}")
            titles[tt]=f
        # 4 Branchenseiten
        if slug in BRANCHEN:
            begriff=BRANCHEN[slug]
            if not txt(t.group(1)).startswith(begriff.split(" für ")[0]+" für"):
                fehler.append(f"{f}: title beginnt nicht mit '{begriff.split(' für ')[0]} für'")
            if 'class="geo-def"' not in s: fehler.append(f"{f}: kein GEO-Definitionssatz (.geo-def)")
    # 5 sitemap
    if not os.path.exists("sitemap.xml"): fehler.append("sitemap.xml fehlt")
    else:
        sm=io.open("sitemap.xml",encoding="utf-8").read()
        locs={re.sub(r"^"+re.escape(BASE)+r"/?","",l) for l in re.findall(r"<loc>([^<]+)</loc>",sm)}
        oeff={("" if f=="index.html" else f[:-5]) for f in seiten}
        fehlend=oeff-locs
        if fehlend: fehler.append(f"sitemap.xml: {len(fehlend)} Seiten fehlen, z.B. {sorted(fehlend)[:3]}")
        zuviel=locs-oeff
        if zuviel: fehler.append(f"sitemap.xml: {len(zuviel)} unbekannte Eintraege, z.B. {sorted(zuviel)[:3]}")
    # 6 robots.txt
    if not os.path.exists("robots.txt"): fehler.append("robots.txt fehlt")
    elif "sitemap.xml" not in io.open("robots.txt",encoding="utf-8").read().lower():
        fehler.append("robots.txt nennt die sitemap nicht")
    # 7 Redirects
    red=json.load(open(S+"/redirects.json"))
    vj=json.load(open("vercel.json"))
    have={r["source"].lstrip("/") for r in vj.get("redirects",[])}
    fehlend=[u for u in red if u not in have]
    if fehlend: fehler.append(f"vercel.json: {len(fehlend)} Redirects fehlen, z.B. {fehlend[:3]}")
    # 8 Footer-Ankertexte
    idx=io.open("index.html",encoding="utf-8").read()
    for slug,label in BRANCHEN.items():
        if f'href="{slug}.html">{label.replace("&","&amp;")}</a>' not in idx:
            fehler.append(f"Footer: Ankertext fuer {slug} nicht '{label}'")
    print(f"{len(seiten)} Seiten geprueft, {len(fehler)} Befunde")
    for x in fehler[:60]: print("  -",x)
    if len(fehler)>60: print(f"  ... und {len(fehler)-60} weitere")
    return 1 if fehler else 0

if __name__=="__main__": sys.exit(main())
