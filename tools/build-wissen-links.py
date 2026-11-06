# -*- coding: utf-8 -*-
"""Setzt auf jede Wissensseite einen Block mit verwandten Fragen und, wo eindeutig,
der passenden Leistungsseite. Ohne diesen Block haengen die Wissensseiten nur am
Footer-Index und werden von Google nicht gecrawlt."""
import io,re,glob,json,collections,math,html,sys

def txt(t): return re.sub(r"\s+"," ",html.unescape(re.sub(r"<[^>]+>","",t))).strip()
def esc(t): return html.escape(t,quote=False).replace("&amp;","&")

# Leistungszuordnung nach Stichwort, bewusst konservativ: lieber kein Link als ein falscher
REGELN=[
 (r"icon|illustration",            "icons-und-illustration-sets"),
 (r"packaging|verpackung|regal",   "package-design"),
 (r"messestand|retail|pos\b|laden","retail-design"),
 (r"foto|shooting|stockbild|model","fotoproduktion"),
 (r"animation|motion|bewegtbild",  "animationen-motion-design"),
 (r"\bseo\b|google|ki-such|auffindbar|sichtbar.*such", "seo-und-ki-search"),
 (r"social listening|monitoring",  "social-listening"),
 (r"social media|instagram|linkedin","social-media"),
 (r"naming|name\b|namen",          "namensentwicklung"),
 (r"logo|signet|wortmarke",        "corporate-design"),
 (r"guideline|styleguide|reinzeichnung|druckdaten","reinzeichnung"),
 (r"workshop",                     "brand-workshop"),
 (r"umfrage|befragung|mitarbeitende.*fragen","kunden-und-mitarbeiterbefragungen"),
 (r"positionier|brand story|markenkern","markenpositionierung-brand-story"),
 (r"arbeitgeber|employer|fachkr|talent|recruiting","employer-branding"),
 (r"rollout|intern.*konzept|info-mail","internes-rollout"),
 (r"website|relaunch|migration|cms|code","website-design"),
 (r"text|headline|sprache|botschaft|tonalit","headlines-und-textkonzept"),
 (r"kampagne",                     "kampagnenentwicklung"),
 (r"zielgruppe|markt|wettbewerb|analyse","zielgruppen-markt-und-wettbewerberanalyse"),
 (r"marken-check|update.*marke|neu gedacht","marken-check"),
 (r"bildwelt|artwork|visual look","bildwelten-artworks-visual-looks"),
 (r"\bki\b|k.nstliche intelligenz","ki-tools-analyse-strategie"),
]

def laden():
    s={}
    for f in sorted(glob.glob("*.html")):
        if f.startswith("_"): continue
        h=io.open(f,encoding="utf-8").read()
        t=re.search(r"<title>(.*?)</title>",h,re.S)
        k=re.search(r'<p class="kurz">(.*?)</p>',h,re.S)
        l=re.search(r'<p class="lead[^"]*">(.*?)</p>',h,re.S)
        h1=re.search(r"<h1[^>]*>(.*?)</h1>",h,re.S)
        art="wissen" if k else ("leistung" if re.search(r'<span class="eyebrow[^"]*">\s*Leistung',h) else "rest")
        s[f[:-5]]={"titel":txt(t.group(1)) if t else "","h1":txt(h1.group(1)) if h1 else "",
                   "kurz":txt(k.group(1)) if k else (txt(l.group(1)) if l else ""),"art":art}
    return s

STOP=set("""der die das und oder aber wie was wenn wir ihr uns euch eine einen einem eines ein auf aus bei
den dem des fuer für im in ist sind mit nicht noch nur von vor zu zum zur als am an auch dass sich schon
mehr sehr man es sie ihre ihren unser unsere unseren wird werden kann koennen können muss muessen müssen
hat haben dann damit nach ueber über durch ohne so wirklich genau gibt geht gut viel alle beim""".split())

def gruppen_laden():
    """Themengruppen aus wissen.html lesen: slug -> Geschwister derselben Gruppe."""
    h=io.open("wissen.html",encoding="utf-8").read()
    zu={}
    for m in re.finditer(r'<section class="faqg" data-screen-label="([^"]+)">(.*?)</section>',h,re.S):
        links=re.findall(r'<li><a href="([a-z0-9-]+)"',m.group(2))
        for s in links: zu[s]=links
    return zu

def main():
    seiten=laden()
    GRUPPE=gruppen_laden()
    # Alles, was auf wissen.html in einer Themengruppe steht, zaehlt dazu.
    # So bekommen auch die Magazinartikel ohne Kurzantwort ihre Querverweise.
    wissen=sorted({s for s,d in seiten.items() if d["art"]=="wissen"} | {s for s in GRUPPE if s in seiten})
    tok=lambda s:[w for w in re.findall(r"[a-zäöüß]{4,}",s.lower()) if w not in STOP]
    docs={s:collections.Counter(tok(seiten[s]["titel"]+" "+seiten[s]["kurz"])) for s in seiten}
    df=collections.Counter()
    for c in docs.values():
        for w in c: df[w]+=1
    N=len(docs)
    def vec(s): return {w:(1+math.log(n))*math.log(N/(1+df[w])) for w,n in docs[s].items()}
    V={s:vec(s) for s in seiten}
    def cos(a,b):
        ks=set(a)&set(b)
        if not ks: return 0.0
        na=math.sqrt(sum(v*v for v in a.values())); nb=math.sqrt(sum(v*v for v in b.values()))
        return sum(a[k]*b[k] for k in ks)/(na*nb) if na and nb else 0.0

    geaendert=0
    for s in wissen:
        pass
        # Erste Wahl ist die redaktionelle Gruppierung auf wissen.html.
        # Sie ist von Hand gesetzt und trifft verlaesslicher als jede Rechnung.
        geschwister=[o for o in GRUPPE.get(s,[]) if o!=s and o in seiten]
        if geschwister:
            paare=sorted(((cos(V[s],V[o]),o) for o in geschwister),reverse=True)
            fragen=[o for _,o in paare[:3]]
        else:
            paare=sorted(((cos(V[s],V[o]),o) for o in wissen if o!=s),reverse=True)
            schwelle=max(0.12,paare[0][0]*0.45) if paare else 0.12
            fragen=[o for sc,o in paare[:3] if sc>=schwelle]
            if not fragen and paare and paare[0][0]>=0.08:
                fragen=[paare[0][1]]
        basis=(seiten[s]["titel"]+" "+seiten[s]["kurz"]).lower()
        dienst=None
        for muster,ziel in REGELN:
            if re.search(muster,basis) and ziel in seiten:
                dienst=ziel; break
        f=s+".html"
        h=io.open(f,encoding="utf-8").read()
        h=re.sub(r'\n<section class="sec" data-screen-label="Passt dazu">.*?</section>','',h,flags=re.S)
        # Frueher automatisch gesetzte Links wieder entfernen, sonst summieren sie sich
        h=re.sub(r'<a class="link-arrow" data-auto="1"[^>]*>.*?</a>','',h,flags=re.S)
        lis="".join('<li><a href="%s">%s</a></li>'%(o,esc(seiten[o]["h1"] or seiten[o]["titel"])) for o in fragen)
        extra=('<p style="margin-top:var(--s4)"><a class="link-arrow" href="%s">%s</a></p>'
               %(dienst,esc(seiten[dienst]["h1"] or seiten[dienst]["titel"]))) if dienst else ""
        block=('\n<section class="sec" data-screen-label="Passt dazu"><div class="container grid">\n'
               '<div><span class="num rv">03</span></div>\n'
               '<div class="rv"><h2>Passt dazu</h2>\n<ul class="sym">%s</ul>\n%s</div>\n</div></section>'%(lis,extra))
        anker='\n<section class="sec" data-screen-label="Weiter">'
        if anker in h:
            h=h.replace(anker,block+anker,1)
        else:
            # Neuere Seiten tragen faq-deeper, Magazinartikel knowledge-next.
            m=(re.search(r'(<div class="faq-deeper__links rv">)(.*?)(</div>)',h,re.S)
               or re.search(r'(<div class="knowledge-next__links">)(.*?)(</div>)',h,re.S))
            if not m:
                print("  kein Anker:",s); continue
            vorhanden=set(re.findall(r'href="([^"]+)"',m.group(2)))
            zusatz="".join('<a class="link-arrow" data-auto="1" href="%s">%s</a>'%(o,esc(seiten[o]["h1"] or seiten[o]["titel"]))
                           for o in fragen if o not in vorhanden)
            if dienst and dienst not in vorhanden:
                zusatz+='<a class="link-arrow" data-auto="1" href="%s">%s</a>'%(dienst,esc(seiten[dienst]["h1"] or seiten[dienst]["titel"]))
            if not zusatz: continue
            h=h[:m.end(2)]+zusatz+h[m.end(2):]
        io.open(f,"w",encoding="utf-8").write(h); geaendert+=1
    print("Blöcke gesetzt auf",geaendert,"Wissensseiten")

if __name__=="__main__": main()
