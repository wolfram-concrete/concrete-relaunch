#!/usr/bin/env python3
"""CONCRETE Brandbuilding Magazin – E-Paper-Build aus den Druckdaten.

Quelle: RZ/pdf Druck/*_16.08.pdf (Innenteil 40 S. + Umschlag als Bogen mit Rücken, 3 mm Beschnitt)
Ausgabe (magazin/ im Website-Repo):
  pages/md/pNN.webp   Seitenbilder für den Blätter-Viewer
  pages/lg/pNN.webp   hochaufgelöst für Zoom
  pages/th/pNN.webp   Thumbnails
  CONCRETE_Brandbuilding_Magazin.pdf   Download-PDF (beschnitten, Lesereihenfolge, Lesezeichen)

Aufruf: python3 tools/magazin/build.py   (Druckdaten-Ordner per MAGAZIN_DRUCKDATEN überschreibbar)
Benötigt: pip install pymupdf pillow
"""
import io
import pathlib
import pymupdf
from PIL import Image

import os
# Ausgabe: <repo>/magazin · Quelle: Druckdaten im Projekt „CONCRETE MAGAZIN“ (nicht im Repo)
ROOT = pathlib.Path(__file__).resolve().parents[2] / "magazin"
SRC = pathlib.Path(os.environ.get("MAGAZIN_DRUCKDATEN",
      pathlib.Path.home() / "web-projekte" / "CONCRETE MAGAZIN" / "RZ" / "pdf Druck"))
INNEN = SRC / "CONCRETE Magazin Klebebindung_DIN A4_Innen_rz_16.08.pdf"
UMSCHLAG = SRC / "CONCRETE Magazin Klebebindung_DIN A4_Umschlag_rz_16.08.pdf"
PDF_OUT = ROOT / "CONCRETE_Brandbuilding_Magazin.pdf"

SIZES = {"md": 1600, "lg": 2800, "th": 360}  # Zielhöhe in px
QUALITY = {"md": 82, "lg": 80, "th": 70}

# Seitennummern im Heft = Position in dieser Liste (U1 = 01 … U4 = 44).
TOC = [
    ("Was Ihre Marke noch nicht erzählt", 3),
    ("Warum gutes Design keine Geschmacksfrage ist", 5),
    ("Warum gutes Branding mit Verstehen beginnt", 6),
    ("Was ist eigentlich Brandbuilding?", 8),
    ("Conlivo", 10),
    ("Warum Brandbuilding im B2B anders funktioniert", 14),
    ("FinaPlus", 16),
    ("MDB Finance", 18),
    ("System 360", 20),
    ("Link", 22),
    ("Die Haftpflichtkasse", 24),
    ("Wackelzahn", 26),
    ("medium + BGF+", 28),
    ("be.care", 30),
    ("nextbed", 32),
    ("Cologne Comedy Festival", 34),
    ("Noey + SKNMETRICS", 36),
    ("Unser Prozess", 40),
    ("Ist Branding messbar? · Was kostet Branding?", 41),
    ("Kann ich meine Brand auch mit KI aufbauen?", 42),
    ("Vielleicht ist Ihre Marke stärker, als sie wirkt", 43),
]


def page_sources():
    """(doc, page_index, clip) in Lesereihenfolge: U1, U2, Innen 1–40, U3, U4."""
    innen = pymupdf.open(INNEN)
    ums = pymupdf.open(UMSCHLAG)
    t = ums[0].trimbox                       # 8.5 … 1208.98 pt, Rücken mittig
    spine = (t.width - 2 * innen[0].trimbox.width) / 2
    mid = t.x0 + t.width / 2
    left = pymupdf.Rect(t.x0, t.y0, mid - spine, t.y1)
    right = pymupdf.Rect(mid + spine, t.y0, t.x1, t.y1)
    # Umschlag S.1 = U4 | U1, S.2 = U2 | U3
    seq = [(ums, 0, right), (ums, 1, left)]
    seq += [(innen, i, innen[i].trimbox) for i in range(len(innen))]
    seq += [(ums, 1, right), (ums, 0, left)]
    return seq


def render_images(seq):
    for key in SIZES:
        (ROOT / "pages" / key).mkdir(parents=True, exist_ok=True)
    for n, (doc, idx, clip) in enumerate(seq, 1):
        page = doc[idx]
        zoom = SIZES["lg"] / clip.height
        pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), clip=clip, alpha=False)
        img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
        for key, h in SIZES.items():
            w = round(img.width * h / img.height)
            out = img if key == "lg" else img.resize((w, h), Image.LANCZOS)
            out.save(ROOT / "pages" / key / f"p{n:02d}.webp", "WEBP", quality=QUALITY[key], method=6)
        print(f"  Seite {n:02d}/{len(seq)}")


PDF_DPI = 200      # Auflösung der Seiten im Download-PDF
PDF_QUALITY = 82   # JPEG-Qualität


def build_pdf(seq):
    """Download-PDF aus gerenderten Seiten.

    Die Bildneuberechnung von PyMuPDF (rewrite_images / replace_image) zerstört bei diesen
    Druckdaten (CMYK-JPEGs, Mehrfachverwendung) viele Bilder. Deshalb wird jede Seite
    wie im E-Paper gerendert und als JPEG eingebettet — identisches Erscheinungsbild in
    jedem PDF-Reader. Text ist in den Druckdaten ohnehin in Kurven/Type3, also nicht durchsuchbar.
    """
    out = pymupdf.open()
    w, h = seq[2][2].width, seq[2][2].height  # A4 Trim
    zoom = PDF_DPI / 72
    for doc, idx, clip in seq:
        pix = doc[idx].get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), clip=clip, alpha=False)
        img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
        buf = io.BytesIO()
        img.save(buf, "JPEG", quality=PDF_QUALITY, optimize=True, progressive=True)
        p = out.new_page(width=w, height=h)
        p.insert_image(p.rect, stream=buf.getvalue())
    out.set_toc([[1, "Cover", 1]] + [[1, t, n] for t, n in TOC])
    out.set_metadata({"title": "CONCRETE Brandbuilding Magazin",
                      "author": "CONCRETE Brandbuilding", "subject": "CONCRETE Brandbuilding Magazin — Ausgabe N°01",
                      "keywords": "Brandbuilding, Branding, Markenentwicklung, CONCRETE"})
    out.set_pagelayout("TwoPageRight")   # Doppelseiten mit Cover allein
    out.save(PDF_OUT, garbage=4, deflate=True)
    print(f"  PDF: {PDF_OUT.name} ({PDF_OUT.stat().st_size / 1e6:.1f} MB)")


if __name__ == "__main__":
    pymupdf.TOOLS.mupdf_display_errors(False)
    seq = page_sources()
    print(f"{len(seq)} Seiten")
    import sys
    if "--pdf-only" not in sys.argv:
        render_images(seq)
    build_pdf(seq)
