#!/usr/bin/env python3
"""Rebuild the selected knowledge articles from the archived WordPress export."""

from __future__ import annotations

import html
import re
import shutil
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT.parent
ASSET_DIR = ROOT / "assets" / "wissen"
BASE = ROOT / "was-kostet-ein-logo-design.html"


@dataclass(frozen=True)
class Article:
    slug: str
    label: str
    image: str
    object_position: str = "center"


ARTICLES = (
    Article("was-kostet-ein-logo-design", "Was kostet ein Logo-Design?", "2022/11/Concrete-Website-Blog-image01.webp", "center 36%"),
    Article("was-ist-wichtig-beim-markendesign", "Was ist wichtig beim Markendesign?", "2022/10/Concrete-Was-ist-wichtig-beim-Markendesign-image01.jpeg"),
    Article("early-adopter-innovative-marken", "Warum Early Adopter wichtig sind", "2023/01/Drohne-683x1024.webp", "center 42%"),
    Article("wie-wird-meine-marke-zu-lovebrand", "Wie wird meine Marke zur Lovebrand?", "2022/10/Bild-2.webp"),
    Article("illustrationen-im-markendesign", "Illustrationen im Markendesign", "2022/10/Concrete-Illustrationen-im-Markendesign-image01.webp"),
    Article("wie-weit-ist-ki-im-layoutdesign", "KI im Layoutdesign", "2022/10/Concrete-Wie-weit-ist-die-KI-Entwicklung-im-Layoutdesign-image02-1024x542.webp"),
    Article("markenstrategie-mit-ki", "Markenstrategie mit KI", "2025/02/2U9A8281-min-1-701x1024.jpg", "center 32%"),
    Article("diversitaet-und-inklusion-im-design", "Diversität & Inklusion im Design", "2023/01/Header-komprimiert-780x1024.webp", "center 35%"),
    Article("warum-ist-beratung-im-markenaufbau-wichtig", "Beratung im Markenaufbau", "2023/01/pexels-life-of-pix-8169-scaled.jpg"),
    Article("wie-digitalisiert-man-eine-designagentur", "Designagentur digitalisieren", "2022/10/Concrete-Wie-digitalisiert-man-eine-Designagentur-image01.webp"),
)


class ContentParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.active = False
        self.depth = 0
        self.current: str | None = None
        self.buffer: list[str] = []
        self.strong = 0
        self.blocks: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        if not self.active and tag == "div" and attributes.get("itemprop") == "text":
            self.active = True
            self.depth = 1
            return
        if not self.active:
            return
        if tag == "div":
            self.depth += 1
        if tag in {"h1", "h2", "h3", "p", "li"} and self.current is None:
            self.current = tag
            self.buffer = []
        elif tag in {"strong", "b"} and self.current:
            if self.strong == 0:
                self.buffer.append("<strong>")
            self.strong += 1
        elif tag == "br" and self.current:
            self.buffer.append(" ")

    def handle_endtag(self, tag: str) -> None:
        if not self.active:
            return
        if tag in {"strong", "b"} and self.current and self.strong:
            self.strong -= 1
            if self.strong == 0:
                self.buffer.append("</strong>")
        if tag == self.current:
            while self.strong:
                self.buffer.append("</strong>")
                self.strong -= 1
            value = clean_markup("".join(self.buffer))
            if value:
                self.blocks.append((tag, value))
            self.current = None
            self.buffer = []
        if tag == "div":
            self.depth -= 1
            if self.depth == 0:
                self.active = False

    def handle_data(self, data: str) -> None:
        if self.active and self.current:
            self.buffer.append(html.escape(data, quote=False))


def clean_markup(value: str) -> str:
    value = value.replace("\u00ad", "")
    value = re.sub(r"https?://\S+", "", value)
    value = re.sub(r"\s+", " ", value).strip()
    value = re.sub(r"(?:<strong>\s*){2,}", "<strong>", value)
    value = re.sub(r"(?:\s*</strong>){2,}", "</strong>", value)
    return value


def plain(value: str) -> str:
    return re.sub(r"<[^>]+>", "", value)


def slugify(value: str) -> str:
    value = plain(value).lower()
    value = value.translate(str.maketrans("äöüß", "aous"))
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value[:64]


def parse_article(article: Article) -> tuple[str, str, str, list[tuple[str, str]]]:
    parser = ContentParser()
    parser.feed((ARCHIVE / article.slug / "index.html").read_text(encoding="utf-8", errors="ignore"))
    blocks = parser.blocks
    title = plain(next(value for tag, value in blocks if tag == "h1"))
    blocks = [(tag, value) for tag, value in blocks if tag != "h1"]
    deck_index = next((i for i, (tag, _) in enumerate(blocks) if tag in {"h2", "h3", "p"}), 0)
    deck_tag, deck = blocks.pop(deck_index)
    if deck_tag in {"h2", "h3"}:
        lead_index = next((i for i, (tag, _) in enumerate(blocks) if tag == "p"), None)
        lead = blocks.pop(lead_index)[1] if lead_index is not None else deck
    else:
        lead_index = next((i for i, (tag, _) in enumerate(blocks) if tag == "p"), None)
        lead = blocks.pop(lead_index)[1] if lead_index is not None else deck
    blocks = [block for block in blocks if plain(block[1]) != "Dieses Video wird von YouTube geladen. Dabei können Daten an YouTube übertragen werden."]
    return title, deck, lead, blocks


def render_blocks(blocks: list[tuple[str, str]]) -> tuple[str, list[tuple[str, str]]]:
    rendered: list[str] = []
    toc: list[tuple[str, str]] = []
    in_list = False
    used_ids: set[str] = set()
    for tag, value in blocks:
        if tag == "li":
            if not in_list:
                rendered.append("<ul>")
                in_list = True
            rendered.append(f"<li>{value}</li>")
            continue
        if in_list:
            rendered.append("</ul>")
            in_list = False
        if tag in {"h2", "h3"}:
            anchor = slugify(value) or "abschnitt"
            base_anchor = anchor
            suffix = 2
            while anchor in used_ids:
                anchor = f"{base_anchor}-{suffix}"
                suffix += 1
            used_ids.add(anchor)
            toc.append((anchor, plain(value)))
            rendered.append(f'<{tag} id="{anchor}">{value}</{tag}>')
        else:
            rendered.append(f"<p>{value}</p>")
    if in_list:
        rendered.append("</ul>")
    return "\n".join(rendered), toc


def replace_metadata(prefix: str, title: str, description: str, slug: str) -> str:
    canonical = f"https://www.concrete-designs.de/{slug}"
    page_title = f"{title} · CONCRETE Brandbuilding"
    prefix = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{html.escape(description, quote=True)}">', prefix)
    prefix = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{canonical}">', prefix)
    prefix = re.sub(r"<title>.*?</title>", f"<title>{html.escape(page_title)}</title>", prefix)
    prefix = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{html.escape(page_title, quote=True)}">', prefix)
    prefix = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{html.escape(description, quote=True)}">', prefix)
    prefix = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{canonical}">', prefix)
    prefix = re.sub(r'<link rel="stylesheet" href="knowledge-article\.css(?:\?v=\d+)?">', '<link rel="stylesheet" href="knowledge-article.css">', prefix)
    prefix = re.sub(r"<style>.*?</style>", '<link rel="stylesheet" href="knowledge-article.css">', prefix, flags=re.S)
    return prefix


def image_dimensions(path: Path) -> tuple[int, int]:
    data = path.read_bytes()
    if data.startswith(b"\xff\xd8"):
        i = 2
        while i < len(data) - 9:
            if data[i] != 0xFF:
                i += 1
                continue
            marker = data[i + 1]
            length = int.from_bytes(data[i + 2:i + 4], "big")
            if marker in range(0xC0, 0xC4):
                return int.from_bytes(data[i + 7:i + 9], "big"), int.from_bytes(data[i + 5:i + 7], "big")
            i += 2 + length
    if data.startswith(b"RIFF") and data[8:12] == b"WEBP":
        kind = data[12:16]
        if kind == b"VP8X":
            return 1 + int.from_bytes(data[24:27], "little"), 1 + int.from_bytes(data[27:30], "little")
        if kind == b"VP8 ":
            pos = data.find(b"\x9d\x01\x2a")
            if pos >= 0:
                return int.from_bytes(data[pos + 3:pos + 5], "little") & 0x3FFF, int.from_bytes(data[pos + 5:pos + 7], "little") & 0x3FFF
        if kind == b"VP8L" and len(data) >= 25 and data[20] == 0x2F:
            bits = int.from_bytes(data[21:25], "little")
            return (bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1
    return 1600, 900


def main() -> None:
    base = BASE.read_text(encoding="utf-8")
    prefix, remainder = base.split('<main id="main">', 1)
    _, suffix = remainder.split("</main>", 1)
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    for article in ARTICLES:
        title, deck, lead, blocks = parse_article(article)
        body, toc = render_blocks(blocks)
        description = plain(lead)
        if len(description) > 156:
            description = description[:153].rsplit(" ", 1)[0] + "…"
        source_image = ARCHIVE / "wp-content" / "uploads" / article.image
        target_image = ASSET_DIR / f"{article.slug}{source_image.suffix.lower()}"
        shutil.copy2(source_image, target_image)
        width, height = image_dimensions(source_image)
        toc_html = "\n".join(f'<li><a href="#{anchor}">{html.escape(label)}</a></li>' for anchor, label in toc)
        main_html = f'''<main id="main">
<section class="knowledge-head" data-screen-label="Wissen"><div class="container knowledge-head__grid">
  <div><span class="eyebrow rv">Wissen · Perspektiven für starke Marken</span><h1 class="rv rv-d1">{html.escape(title)}</h1></div>
  <div class="knowledge-head__intro rv rv-d2"><p class="knowledge-head__deck">{deck}</p><p class="knowledge-head__lead">{lead}</p></div>
</div></section>
<figure class="knowledge-hero rv-media"><img src="assets/wissen/{target_image.name}" alt="Titelmotiv zum Artikel: {html.escape(title, quote=True)}" width="{width}" height="{height}" style="object-position:{article.object_position}" fetchpriority="high" decoding="async"></figure>
<div class="container knowledge-layout">
  <aside class="knowledge-toc rv" aria-label="Inhalt"><span class="knowledge-toc__label">In diesem Artikel</span><ol>{toc_html}</ol></aside>
  <article class="knowledge-copy rv rv-d1">{body}</article>
</div>
<section class="knowledge-next" data-screen-label="Weiterlesen"><div class="container knowledge-next__grid">
  <span class="eyebrow">Weiterdenken</span>
  <div class="knowledge-next__links"><a class="link-arrow" href="wissen">Alle FAQs</a><a class="link-arrow" href="leistungen">Unser Handwerk</a><a class="link-arrow" href="erstgespraech">Projekt anfragen</a></div>
</div></section>
<div class="coral-wrap" style="margin-top:clamp(48px,7vw,110px)" data-screen-label="Projekt anfragen">
  <div class="coral-block rv-block-r">
  <img class="tex-lap plx" data-plx="-14" src="assets/beton/beton-ink-alpha-quer.webp" alt="" aria-hidden="true" style="right:-2%;bottom:0;transform:translateY(46%);width:clamp(180px,22vw,380px)" width="1800" height="1014">
  <div class="container inquiry__head"><p class="eyebrow" style="color:rgba(23,21,19,.55)">Nächster Schritt</p><h2>Eure Frage geht tiefer?</h2></div>
  <div class="container inquiry__grid"><div class="inquiry__media"><img src="assets/magazine/meeting.q.jpg" alt="Das CONCRETE-Team im Gespräch" loading="lazy" width="1400" height="931" decoding="async"></div><div class="inquiry__form"><p class="big-copy">Erzählt uns, was sich in eurem Unternehmen verändern soll. Wir klären gemeinsam, welche strategischen und gestalterischen Schritte dafür wirklich sinnvoll sind.</p><a class="button button--solid" href="erstgespraech" style="margin-top:var(--s4)">Projekt anfragen</a></div></div>
  </div>
</div>
</main>'''
        page_prefix = replace_metadata(prefix, article.label, description, article.slug)
        (ROOT / f"{article.slug}.html").write_text(page_prefix + main_html + suffix, encoding="utf-8")
        print(f"Built {article.slug}.html ({len(blocks)} content blocks)")


if __name__ == "__main__":
    main()
