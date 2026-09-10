#!/usr/bin/env python3
"""Static technical preflight for the CONCRETE relaunch.

The script only reads the repository. It validates the URLs declared in the
sitemap and the local dependencies referenced by those pages. Vercel routing
and SEO-specific rules remain covered by seo-gauntlet.py.
"""

from __future__ import annotations

import json
import re
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse
from xml.etree import ElementTree


ROOT = Path(__file__).resolve().parents[1]
EXPECTED_CACHE_VERSION = "159"
LOCAL_HOSTS = {"concrete-designs.de", "www.concrete-designs.de"}
URL_RE = re.compile(r"url\(\s*(['\"]?)([^)'\"]+)\1\s*\)", re.I)


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.links: list[tuple[str, str]] = []
        self.resources: list[tuple[str, str]] = []
        self.images_without_dimensions: list[str] = []
        self.asset_queries: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = {key: value or "" for key, value in attrs}
        if data.get("id"):
            self.ids.append(data["id"])

        if tag == "a" and data.get("href"):
            self.links.append((tag, data["href"]))

        candidates: list[tuple[str, str]] = []
        if tag == "img":
            for attr in ("src", "data-src"):
                if data.get(attr):
                    candidates.append((f"img[{attr}]", data[attr]))
            if (data.get("src") or data.get("data-src")) and not (
                data.get("width") and data.get("height")
            ):
                self.images_without_dimensions.append(data.get("src") or data.get("data-src") or "")
        elif tag == "video":
            for attr in ("src", "data-src", "poster", "data-fallback"):
                if data.get(attr):
                    candidates.append((f"video[{attr}]", data[attr]))
        elif tag == "source":
            for attr in ("src", "data-src"):
                if data.get(attr):
                    candidates.append((f"source[{attr}]", data[attr]))
            if data.get("srcset"):
                for part in data["srcset"].split(","):
                    candidates.append(("source[srcset]", part.strip().split()[0]))
        elif tag == "image" and data.get("href"):
            candidates.append(("image[href]", data["href"]))
        elif tag == "script" and data.get("src"):
            candidates.append(("script[src]", data["src"]))
        elif tag == "link" and data.get("href"):
            rel = set(data.get("rel", "").lower().split())
            if rel.intersection({"stylesheet", "icon", "preload"}):
                candidates.append(("link[href]", data["href"]))

        for label, value in candidates:
            self.resources.append((label, value))
            parsed = urlparse(value)
            if (
                not parsed.scheme
                and not value.startswith("//")
                and parsed.query
                and parsed.path
                and not parsed.path.endswith(("site.css", "site.js"))
            ):
                self.asset_queries.append(value)


def sitemap_pages() -> list[Path]:
    tree = ElementTree.parse(ROOT / "sitemap.xml")
    locations = [el.text or "" for el in tree.findall("{*}url/{*}loc")]
    pages: list[Path] = []
    for location in locations:
        path = unquote(urlparse(location).path).strip("/")
        pages.append(ROOT / ("index.html" if not path else f"{path}.html"))
    return pages


def local_path(raw_url: str, page: Path, *, link: bool) -> tuple[Path | None, str]:
    parsed = urlparse(raw_url)
    if parsed.scheme in {"mailto", "tel", "javascript", "data"}:
        return None, ""
    if parsed.scheme in {"http", "https"}:
        if not link or parsed.hostname not in LOCAL_HOSTS:
            return None, ""
    if raw_url.startswith("//"):
        return None, ""

    raw_path = unquote(parsed.path)
    if not raw_path:
        return page if link else None, parsed.fragment
    candidate = ROOT / raw_path.lstrip("/") if raw_path.startswith("/") else page.parent / raw_path
    if link:
        if raw_path.endswith("/"):
            candidate /= "index.html"
        elif not candidate.suffix:
            candidate = candidate.with_suffix(".html")
    return candidate.resolve(), parsed.fragment


def scan() -> list[str]:
    findings: list[str] = []
    required_vercel_ignores = {
        "_eingang/",
        "_entwuerfe/",
        "docs/",
        "tools/",
        "README.md",
        "*.partial.html",
        "concrete-tokens.css",
        "motion.css",
        "motion.js",
    }
    vercel_ignore = ROOT / ".vercelignore"
    ignored = {
        line.strip()
        for line in vercel_ignore.read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.lstrip().startswith("#")
    } if vercel_ignore.is_file() else set()
    for missing in sorted(required_vercel_ignores - ignored):
        findings.append(f".vercelignore: missing deployment exclusion: {missing}")

    pages = sitemap_pages()
    if len(pages) != 129:
        findings.append(f"sitemap.xml: expected 129 URLs, found {len(pages)}")

    parsed_pages: dict[Path, PageParser] = {}
    for page in pages:
        if not page.is_file():
            findings.append(f"sitemap target missing: {page.relative_to(ROOT)}")
            continue
        parser = PageParser()
        text = page.read_text(encoding="utf-8")
        parser.feed(text)
        parsed_pages[page.resolve()] = parser

        duplicates = sorted(key for key, count in Counter(parser.ids).items() if count > 1)
        if duplicates:
            findings.append(f"{page.name}: duplicate IDs: {', '.join(duplicates)}")
        for source in parser.images_without_dimensions:
            findings.append(f"{page.name}: image without width/height: {source}")
        for source in parser.asset_queries:
            findings.append(f"{page.name}: media has cache query: {source}")

        css_versions = set(re.findall(r"site\.css\?v=(\d+)", text))
        js_versions = set(re.findall(r"site\.js\?v=(\d+)", text))
        if css_versions != {EXPECTED_CACHE_VERSION} or js_versions != {EXPECTED_CACHE_VERSION}:
            findings.append(
                f"{page.name}: cache version mismatch css={sorted(css_versions)} js={sorted(js_versions)}"
            )
        if '<meta name="robots" content="noindex,nofollow">' not in text:
            findings.append(f"{page.name}: required prelaunch noindex missing")
        if "Fabian Lampert" in text:
            findings.append(f"{page.name}: incorrect CA’N SORT quote attribution")
        if text.count('<script src="consent-v3.js"></script>') != 1:
            findings.append(f"{page.name}: consent manager missing or duplicated")
        elif text.index('<script src="consent-v3.js"></script>') > text.index(
            f'<script src="site.js?v={EXPECTED_CACHE_VERSION}"></script>'
        ):
            findings.append(f"{page.name}: consent manager must load before site.js")
        if any(domain in text for domain in (
            "googletagmanager.com", "google-analytics.com", "clarity.ms",
            "connect.facebook.net", "youtube.com/embed", "fonts.googleapis.com",
            "fonts.gstatic.com",
        )):
            findings.append(f"{page.name}: direct third-party tracker or embed bypasses consent")
        if text.count('data-consent-manage') < 1:
            findings.append(f"{page.name}: cookie settings control missing")
        if text.count('data-consent-category="marketing"') != 1 or text.count(
            'data-consent-src="https://www.sortlist.de/api/badge-embed?'
        ) != 1:
            findings.append(f"{page.name}: Sortlist badge consent gate missing or duplicated")
        if '<script src="https://www.sortlist.de/' in text:
            findings.append(f"{page.name}: Sortlist badge bypasses consent")

        mobile_cta = re.search(
            r'<a class="mobile-nav__cta"[^>]*>.*?</a>', text, flags=re.S
        )
        if mobile_cta is None:
            findings.append(f"{page.name}: mobile navigation CTA missing or inconsistent")
        else:
            cta_markup = mobile_cta.group(0)
            required_cta_parts = {
                'class="cta-avas"',
                'assets/team/wolfram.jpg',
                'assets/team/christian.jpg',
                'Projekt anfragen',
            }
            if any(part not in cta_markup for part in required_cta_parts):
                findings.append(f"{page.name}: mobile navigation CTA content inconsistent")

        if text.count('class="footer-awards"') != 1:
            findings.append(f"{page.name}: footer awards missing or duplicated")
        else:
            required_awards = {
                'assets/awards/concrete-awards-2026.png',
                'aria-label="German Brand Award"',
                'aria-label="Deutscher Gründerpreis"',
                'aria-label="Marken Award"',
                'aria-label="German Design Award"',
                'https://www.german-brand-award.com/',
                'https://www.deutscher-gruenderpreis.de/',
                'https://marken-award.de/',
                'https://www.german-design-award.com/',
            }
            if any(part not in text for part in required_awards):
                findings.append(f"{page.name}: footer awards content inconsistent")
        required_partners = {
            'class="footer-partners"',
            'assets/partners/designmade-in-germany.svg',
            'https://www.designmadeingermany.de/verzeichnis/agenturen/#37172',
            'https://www.sortlist.de/agency/concrete-brandbuilding',
        }
        if any(part not in text for part in required_partners):
            findings.append(f"{page.name}: footer partner content inconsistent")

    for page, parser in parsed_pages.items():
        for _tag, href in parser.links:
            target, fragment = local_path(href, page, link=True)
            if target is None:
                continue
            if not target.is_file():
                findings.append(f"{page.name}: broken internal link: {href}")
                continue
            if fragment and target.suffix == ".html":
                target_parser = parsed_pages.get(target)
                if target_parser is None:
                    target_parser = PageParser()
                    target_parser.feed(target.read_text(encoding="utf-8"))
                if fragment not in target_parser.ids:
                    findings.append(f"{page.name}: missing fragment target: {href}")

        for label, source in parser.resources:
            target, _fragment = local_path(source, page, link=False)
            if target is not None and not target.is_file():
                findings.append(f"{page.name}: missing local resource {label}: {source}")

        text = page.read_text(encoding="utf-8")
        for _quote, source in URL_RE.findall(text):
            target, _fragment = local_path(source, page, link=False)
            if target is not None and not target.is_file():
                findings.append(f"{page.name}: missing inline CSS resource: {source}")

    for css_path in (ROOT / "site.css", ROOT / "fonts/intro-fonts-v1.css"):
        css = css_path.read_text(encoding="utf-8")
        for _quote, source in URL_RE.findall(css):
            target, _fragment = local_path(source, css_path, link=False)
            if target is not None and not target.is_file():
                findings.append(f"{css_path.name}: missing resource: {source}")
            if source.startswith(("http://", "https://", "//")):
                findings.append(f"{css_path.name}: external CSS resource bypasses consent: {source}")

    consent = (ROOT / "consent-v3.js").read_text(encoding="utf-8")
    for required in (
        'var GTM_ID = "GTM-N8223FX"',
        'analytics_storage: "denied"',
        'ad_storage: "denied"',
        '"google-analytics", "microsoft-clarity"',
        '"google-ads", "linkedininsighttag", "microsoft-advertising", "sortlist-badge"',
        "loadConsentEmbeds(consent)",
        "window.BorlabsCookie.checkCookieConsent = hasConsent",
        "window.BorlabsCookie.Consents.hasConsent = hasConsent",
    ):
        if required not in consent:
            findings.append(f"consent-v3.js: missing consent safeguard: {required}")
    for forbidden in ('"facebook-pixel"', '"hubspot-pixel"'):
        if forbidden in consent:
            findings.append(f"consent-v3.js: obsolete service is consent-enabled: {forbidden}")

    privacy = (ROOT / "datenschutz.html").read_text(encoding="utf-8")
    for required in ("Vercel Inc.", "Microsoft Clarity", "Google Analytics 4", "Sortlist Trusted Partner Badge"):
        if required not in privacy:
            findings.append(f"datenschutz.html: current implementation missing: {required}")
    for obsolete in ("1&1 Internet", "concreten-designs.de", "EU-US Privacy Shield", "Google ReCaptcha"):
        if obsolete in privacy:
            findings.append(f"datenschutz.html: obsolete implementation claim remains: {obsolete}")

    vercel = json.loads((ROOT / "vercel.json").read_text(encoding="utf-8"))
    global_headers = {
        header["key"]: header["value"]
        for rule in vercel.get("headers", [])
        if rule.get("source") == "/(.*)"
        for header in rule.get("headers", [])
    }
    for key, value in {
        "X-Robots-Tag": "noindex, nofollow",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "X-Content-Type-Options": "nosniff",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    }.items():
        if global_headers.get(key) != value:
            findings.append(f"vercel.json: missing or incorrect global header: {key}")

    return sorted(set(findings))


def main() -> int:
    findings = scan()
    if findings:
        print(f"Technical preflight: {len(findings)} finding(s)")
        for finding in findings:
            print(f"- {finding}")
        return 1
    print("Technical preflight: 129 pages, 0 findings")
    return 0


if __name__ == "__main__":
    sys.exit(main())
