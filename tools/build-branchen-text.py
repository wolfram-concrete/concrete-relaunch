# -*- coding: utf-8 -*-
"""Loest die zwei wortgleichen Bloecke der Branchenseiten auf.

Vorher stand auf allen zehn Seiten derselbe Satz ueber den Fallbeispielen und
dieselbe Weiterfuehrung. Google liest das als dieselbe Seite in zehn Varianten.
Die Saetze hier beschreiben, was die gezeigten Projekte verbindet.
"""
import io,re,sys,html

def esc(t): return html.escape(t,quote=False).replace("&amp;","&")

SATZ={
 "architektur-und-immobilien-brands":
   "Zwei gewachsene Architekturbüros und ein Produkt für die Objektbuchhaltung. In allen drei Fällen war die Qualität längst da, bevor der Auftritt sie gezeigt hat.",
 "b2b-brands":
   "Solarparks, Robotik, IT-Strukturen, PropTech und Orthopädie. Fünf Unternehmen mit erklärungsbedürftigen Leistungen, bei denen die Entscheidung über mehrere Köpfe läuft.",
 "b2b-marken-mallorca":
   "Ein Weingut im Norden der Insel, ein PropTech-Startup und ein Robotikanbieter. Drei Marken, die zwischen deutschsprachigem Markt und internationalem Umfeld arbeiten.",
 "consulting-it-und-finance-brands":
   "Zwei Finanzdienstleister, ein Sicherheitsunternehmen und ein Versicherer. In allen vier Projekten war Vertrauen die eigentliche Gestaltungsaufgabe.",
 "event-und-entertainment-brands":
   "Ein Comedy-Festival, ein Spielkonzept aus Klang und Smartphone und eine Produktionsfirma. Drei Marken, die über das einzelne Ereignis hinaus tragen müssen.",
 "family-und-kids-brands":
   "Zwei Zahnarztpraxen für Kinder und ein Ernährungsprogramm für Kitas. Alle drei sprechen Kinder und Eltern gleichzeitig an, ohne eine der beiden Seiten zu verlieren.",
 "food-und-beverage-brands":
   "Glutenfreie Teigwaren, Foodtrucks und Wein von Mallorca. Drei Marken, die im Regal und an der Straße in wenigen Sekunden überzeugen müssen.",
 "marketing-und-media-brands":
   "Eine Online-Marketing-Agentur, ein Medienunternehmen und eine IT-Beratung. Wer selbst Kommunikation verkauft, liefert mit dem eigenen Auftritt den Leistungsnachweis mit.",
 "recruiting-brands":
   "Zwei Personalberatungen und ein Arbeitgeber, der seine Kultur sichtbar machen wollte. In allen drei Projekten ging es um Menschen, die Alternativen haben.",
 "startups":
   "Ein Handwerksbetrieb im Netz, ein Beauty-Tech-Startup, eine Ledertaschenmarke und Deutschlands erster robotischer Coffeeshop. Vier Marken, die früh glaubwürdig wirken mussten, ohne fertig zu sein.",
}

WEITER={
 "architektur-und-immobilien-brands":[("situation-marke-nicht-mitgewachsen","Wenn die Marke nicht mitgewachsen ist"),("markenpositionierung-brand-story","Markenpositionierung und Brand Story")],
 "b2b-brands":[("situation-angebot-schwer-verstaendlich","Wenn das Angebot schwer zu erklären ist"),("headlines-und-textkonzept","Headlines und Textkonzept")],
 "b2b-marken-mallorca":[("situation-neues-in-den-markt","Wenn etwas Neues in den Markt soll"),("markenpositionierung-brand-story","Markenpositionierung und Brand Story")],
 "consulting-it-und-finance-brands":[("situation-vertrauen-sensible-maerkte","Wenn Vertrauen die Eintrittskarte ist"),("corporate-design","Corporate Design")],
 "event-und-entertainment-brands":[("situation-veraenderung-sichtbar","Wenn Veränderung sichtbar werden soll"),("kampagnenentwicklung","Kampagnenentwicklung")],
 "family-und-kids-brands":[("situation-vertrauen-sensible-maerkte","Wenn Vertrauen die Eintrittskarte ist"),("bildwelten-artworks-visual-looks","Bildwelten und Artworks")],
 "food-und-beverage-brands":[("situation-neues-in-den-markt","Wenn etwas Neues in den Markt soll"),("package-design","Package Design")],
 "marketing-und-media-brands":[("situation-angebot-schwer-verstaendlich","Wenn das Angebot schwer zu erklären ist"),("website-design","Website-Design")],
 "recruiting-brands":[("situation-veraenderung-sichtbar","Wenn Veränderung sichtbar werden soll"),("employer-branding","Employer Branding")],
 "startups":[("situation-neues-in-den-markt","Wenn etwas Neues in den Markt soll"),("namensentwicklung","Namensentwicklung")],
}

ALT="Ein Blick hinter die Kulissen einiger unserer Projekte aus diesem Umfeld."

def main():
    n=0
    for slug,satz in SATZ.items():
        f=slug+".html"
        h=io.open(f,encoding="utf-8").read(); o=h
        # 1) Satz ueber den Fallbeispielen
        if ALT in h:
            h=h.replace(ALT,esc(satz),1)
        else:
            h=re.sub(r'(<h2>Beispiele unserer Arbeit</h2>\s*<p>).*?(</p>)',
                     lambda m:m.group(1)+esc(satz)+m.group(2),h,count=1,flags=re.S)
        # 2) Weiterfuehrung je Branche
        m=re.search(r'(data-screen-label="Weiter".*?<div style="[^"]*">)(.*?)(</div>)',h,re.S)
        if m:
            links='<a class="link-arrow" href="branchen">Alle Branchen</a>'
            for ziel,label in WEITER[slug]:
                links+='<a class="link-arrow" href="%s">%s</a>'%(ziel,esc(label))
            h=h[:m.start(2)]+links+h[m.end(2):]
        if h!=o:
            io.open(f,"w",encoding="utf-8").write(h); n+=1
    print("Branchenseiten entdoppelt:",n)

if __name__=="__main__": main()
