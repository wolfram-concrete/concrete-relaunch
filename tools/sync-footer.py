#!/usr/bin/env python3
"""Replace the embedded footer on every sitemap page with the footer partial."""

from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse
from xml.etree import ElementTree


ROOT = Path(__file__).resolve().parents[1]
FOOTER_RE = re.compile(r'<footer class="site-footer".*?</footer>', re.S)


def sitemap_pages() -> list[Path]:
    tree = ElementTree.parse(ROOT / "sitemap.xml")
    locations = [element.text or "" for element in tree.findall("{*}url/{*}loc")]
    pages: list[Path] = []
    for location in locations:
        path = unquote(urlparse(location).path).strip("/")
        pages.append(ROOT / ("index.html" if not path else f"{path}.html"))
    return pages


def main() -> int:
    footer = (ROOT / "_footer.partial.html").read_text(encoding="utf-8").strip()
    changed = 0
    for page in sitemap_pages():
        text = page.read_text(encoding="utf-8")
        updated, replacements = FOOTER_RE.subn(footer, text)
        if replacements != 1:
            print(f"{page.name}: expected one footer, found {replacements}", file=sys.stderr)
            return 1
        if updated != text:
            page.write_text(updated, encoding="utf-8")
            changed += 1
    print(f"Footer sync: {changed} page(s) updated")
    return 0


if __name__ == "__main__":
    sys.exit(main())
