# SEO migration and cutover

Use this reference whenever a new build replaces an indexed site, even when the domain remains unchanged. A hosting-only move still risks outages, lost verification, changed headers, missing assets and accidental indexation blocks.

## Build the source-of-truth URL matrix

Inventory the old site from:

- all sitemap indexes and child sitemaps;
- a crawl of internal HTML links;
- CMS/export/API data;
- Search Console landing pages and indexed URLs when available;
- analytics landing pages, server logs and backlink exports when available;
- PDFs, downloads, image/video landing pages and campaign URLs;
- legacy hostname, HTTP, trailing-slash, file-extension and encoded variants.

For every old URL record:

- current status and canonical;
- content/template type and business value;
- new destination;
- action: preserve 200, permanent redirect, intentional 404/410, or investigate;
- rationale and validation result.

Never infer full coverage only because sitemap URLs are mapped. Sitemaps can omit still-indexed or externally linked URLs.

## Redirect rules

- Preserve an old URL unchanged when its intent and path remain valid.
- Use a server-side 301 or 308 for a permanent one-to-one or genuinely equivalent consolidated destination.
- Do not redirect unrelated retired content to the homepage; it can be treated as a soft 404.
- Resolve each source in one hop to an indexable 200 canonical destination.
- Preserve query parameters only when they affect real content; do not propagate tracking parameters into canonicals.
- Avoid regex rules that capture assets, system paths or already-canonical destinations unexpectedly.
- Keep migration redirects for at least one year; keeping useful legacy redirects indefinitely is often better for users and backlinks.

## Pre-launch gates

- [ ] URL matrix covers sitemaps, crawled URLs and supplied performance/backlink/log sources.
- [ ] New production build passes representative and corpus-wide status/indexability checks.
- [ ] Production canonical host, HTTPS, paths, slashes and extensions are consistent.
- [ ] Temporary global `noindex`, password middleware and crawl blocks have an explicit atomic removal step.
- [ ] New sitemap contains only canonical indexable 200 URLs and uses honest `lastmod` values.
- [ ] `robots.txt` returns 200 and references the production sitemap.
- [ ] Search Console verification survives the move.
- [ ] Unknown paths return a branded real 404; intended removals use 404/410.
- [ ] Critical assets, PDFs, forms, analytics, consent and conversion journeys work.
- [ ] DNS/CDN/host configuration, rollback owner and rollback criteria are documented.
- [ ] If hosting changes, lower DNS TTL several days in advance when operationally possible.
- [ ] Server/CDN capacity and cache warming account for temporarily increased crawler traffic.

## Launch sequence

1. Freeze URL/content changes and export the final old-site inventories.
2. Deploy the release and redirects together.
3. Remove preview protection and all temporary production `noindex` signals atomically.
4. Verify canonical host variants, homepage and every page template from external networks.
5. Test every URL-matrix row without automatically following redirects; then follow each chain to its final 200 target.
6. Verify robots.txt, every sitemap, representative canonicals and structured data from public responses.
7. Submit the canonical sitemap in Google Search Console and Bing Webmaster Tools. Do not use Google's retired sitemap-ping endpoint.
8. Annotate analytics and retain the old-host logs/configuration until the move is proven stable.

## Post-launch monitoring

Monitor daily during the first week, then at decreasing frequency for at least several weeks:

- uptime, 5xx, latency and crawler access;
- DNS/host/HTTPS consistency;
- redirect failures, loops, new 404/soft-404 reports and top missing URLs;
- sitemap fetch/parse status and submitted-versus-indexed counts;
- accidental `noindex`, robots blocks and canonical drift;
- Search Console crawl/indexing reports, URL Inspection samples and search traffic by landing page;
- field Core Web Vitals, conversion journeys and analytics continuity;
- old-server traffic, logs and externally linked legacy URLs.

Temporary search volatility can occur. Roll back for systemic serving, redirect, indexability, canonical, data-loss or conversion failures—not merely for a short-term ranking fluctuation.

## Primary references to refresh

- Google site moves with URL changes: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- Google hosting changes without URL changes: https://developers.google.com/search/docs/crawling-indexing/site-move-no-url-changes
- Google redirects: https://developers.google.com/search/docs/crawling-indexing/301-redirects
- Google sitemap ping deprecation: https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping
- Bing IndexNow: https://www.indexnow.org/documentation

