# -*- coding: utf-8 -*-
"""Setzt strukturierte Daten je Seitentyp. Idempotent: der eigene Block traegt
data-auto-schema und wird vor dem Schreiben entfernt.

FAQPage auf Wissensseiten, Service auf Leistungs- und Branchenseiten,
CreativeWork auf Projektseiten, BreadcrumbList auf allem ausser der Startseite.
"""
import io,re,glob,json,html,sys

BASE="https://www.concrete-designs.de"
ORG=BASE+"/#organization"

def txt(t):
    # Weiche Trennstellen gehoeren in die Darstellung, nicht in strukturierte Daten
    s=html.unescape(re.sub(r"<[^>]+>","",t)).replace("­","")
    return re.sub(r"\s+"," ",s).strip()

RUBRIK=[("case-","Projekte","projekte"),
        ("situation-","Wo wir helfen können","leistungen"),
        ("phase-","Leistungen","leistungen")]

def rubrik(slug,art):
    for pre,name,url in RUBRIK:
        if slug.startswith(pre): return name,url
    if art=="wissen": return "Wissen","wissen"
    if art=="branche": return "Branchen","branchen"
    if art=="leistung": return "Leistungen","leistungen"
    return None,None

def art_von(slug,h):
    if slug.startswith("case-"): return "case"
    if slug.endswith("brands") or slug in ("startups","b2b-marken-mallorca"): return "branche"
    if '<p class="kurz">' in h: return "wissen"
    if re.search(r'<span class="eyebrow[^"]*">\s*Leistung',h): return "leistung"
    return "rest"

def antwort(h):
    """Kurzantwort plus die ersten Absaetze der ausfuehrlichen Antwort."""
    teile=[]
    k=re.search(r'<p class="kurz">(.*?)</p>',h,re.S)
    if k: teile.append(txt(k.group(1)))
    m=re.search(r'Die ganze Antwort</h2>(.*?)</div>',h,re.S)
    if m:
        for p in re.findall(r'<p[^>]*>(.*?)</p>',m.group(1),re.S)[:3]:
            t=txt(p)
            if len(t)>40: teile.append(t)
    return " ".join(teile)[:1200]

def main():
    geaendert=0; zaehler={}
    for f in sorted(glob.glob("*.html")):
        if f.startswith("_"): continue
        slug=f[:-5]
        h=io.open(f,encoding="utf-8").read()
        art=art_von(slug,h)
        t=re.search(r"<title>(.*?)</title>",h,re.S)
        h1=re.search(r"<h1[^>]*>(.*?)</h1>",h,re.S)
        d=re.search(r'<meta name="description" content="([^"]*)"',h)
        titel=txt(t.group(1)).split(" · ")[0] if t else slug
        kopf=txt(h1.group(1)) if h1 else titel
        besch=html.unescape(d.group(1)) if d else ""
        url=BASE+"/"+("" if slug=="index" else slug)

        knoten=[]
        if art=="wissen":
            a=antwort(h)
            if a:
                knoten.append({"@type":"FAQPage","@id":url+"#faq","mainEntity":[{
                    "@type":"Question","name":kopf,
                    "acceptedAnswer":{"@type":"Answer","text":a}}]})
        elif art in ("leistung","branche"):
            knoten.append({"@type":"Service","@id":url+"#service","name":titel,
                "description":besch,"serviceType":titel,
                "provider":{"@id":ORG},"areaServed":{"@type":"Country","name":"Deutschland"},
                "url":url})
        elif art=="case":
            marke=titel
            knoten.append({"@type":"CreativeWork","@id":url+"#case","name":kopf,
                "headline":kopf,"about":marke,"description":besch,
                "creator":{"@id":ORG},"url":url,"inLanguage":"de"})

        if slug!="index":
            name,ziel=rubrik(slug,art)
            eintraege=[{"@type":"ListItem","position":1,"name":"Startseite","item":BASE+"/"}]
            if name:
                eintraege.append({"@type":"ListItem","position":2,"name":name,"item":BASE+"/"+ziel})
            eintraege.append({"@type":"ListItem","position":len(eintraege)+1,"name":kopf,"item":url})
            knoten.append({"@type":"BreadcrumbList","@id":url+"#breadcrumb","itemListElement":eintraege})

        h=re.sub(r'\n<script type="application/ld\+json" data-auto-schema>.*?</script>','',h,flags=re.S)
        if knoten:
            block=('\n<script type="application/ld+json" data-auto-schema>'
                   +json.dumps({"@context":"https://schema.org","@graph":knoten},ensure_ascii=False,separators=(",",":"))
                   +"</script>")
            h=h.replace("</head>",block+"\n</head>",1)
            zaehler[art]=zaehler.get(art,0)+1
        io.open(f,"w",encoding="utf-8").write(h); geaendert+=1
    print("Seiten bearbeitet:",geaendert)
    for k,v in sorted(zaehler.items()): print(f"   {v:4}  {k}")

if __name__=="__main__": main()
