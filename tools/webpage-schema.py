#!/usr/bin/env python3
"""Ergänzt auf jeder Seite ein WebPage-Objekt im JSON-LD.

Das Objekt verbindet die Seite mit der Website und der Organisation und trägt
das Änderungsdatum aus Git. Dadurch steht die Organisation nur einmal
vollständig da (Startseite), wird aber von jeder Seite referenziert.

Das Skript ist wiederholbar: Ein vorhandenes WebPage-Objekt wird aktualisiert,
nicht verdoppelt.
"""
import json, pathlib, re, subprocess, sys

BASIS = "https://www.concrete-designs.de"
ORG = f"{BASIS}/#organization"
SITE = f"{BASIS}/#website"
WURZEL = pathlib.Path(__file__).resolve().parent.parent

def git_datum(p):
    r = subprocess.run(["git", "log", "-1", "--format=%cs", "--", p.name],
                       cwd=WURZEL, capture_output=True, text=True)
    return r.stdout.strip() or None

def seiten_url(p):
    return BASIS + "/" + ("" if p.name == "index.html" else p.stem)

def titel(h):
    m = re.search(r"<title>(.*?)</title>", h, re.S)
    return re.sub(r"\s+", " ", m.group(1)).strip() if m else None

def bearbeite(p, trocken=False):
    h = p.read_text(encoding="utf-8")
    m = re.search(r'(<script[^>]*application/ld\+json[^>]*>)(.*?)(</script>)', h, re.S)
    if not m:
        return "kein JSON-LD"
    try:
        d = json.loads(m.group(2))
    except json.JSONDecodeError:
        return "JSON ungültig"
    graph = d.get("@graph") if isinstance(d, dict) and "@graph" in d else None
    if graph is None:
        graph = d if isinstance(d, list) else [d]
        d = {"@context": "https://schema.org", "@graph": graph}

    url = seiten_url(p)
    eintrag = next((g for g in graph if g.get("@type") == "WebPage"), None)
    neu = eintrag is None
    if neu:
        eintrag = {"@type": "WebPage"}
        graph.insert(0, eintrag)
    eintrag["@id"] = f"{url}#webpage"
    eintrag["url"] = url
    if titel(h):
        eintrag["name"] = titel(h)
    eintrag["isPartOf"] = {"@id": SITE}
    eintrag["publisher"] = {"@id": ORG}
    datum = git_datum(p)
    if datum:
        eintrag["dateModified"] = datum
    if trocken:
        return "neu" if neu else "aktualisiert"
    h = h[:m.start(2)] + json.dumps(d, ensure_ascii=False, separators=(",", ":")) + h[m.end(2):]
    p.write_text(h, encoding="utf-8")
    return "neu" if neu else "aktualisiert"

def main():
    trocken = "--trocken" in sys.argv
    zaehler = {}
    for p in sorted(WURZEL.glob("*.html")):
        if p.name.startswith("_"):
            continue
        r = bearbeite(p, trocken)
        zaehler[r] = zaehler.get(r, 0) + 1
    print(("Probelauf: " if trocken else "") + ", ".join(f"{v} {k}" for k, v in sorted(zaehler.items())))

if __name__ == "__main__":
    main()
