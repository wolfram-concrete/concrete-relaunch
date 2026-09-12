# Website audit checklist

Use the sections relevant to the site. A checked item means it was actually tested; configuration inspection alone does not prove runtime behavior.

## Environment and reproducibility

- Record audit date, environment, domain, git revision, local command, tool/browser versions and viewport.
- Inspect repository instructions and dirty worktree before running installers or builds.
- Detect the real dependency manager from lockfiles. Do not create a package manifest for a static site merely to run an audit.
- Start and browse the rendered site. Record console errors and failed requests.

## Discovery, crawling and indexation

- Verify `robots.txt` status/content and every declared sitemap URL.
- Check meta robots and `X-Robots-Tag` on HTML and non-HTML resources.
- Confirm indexable pages are accessible without authentication and return 200.
- Confirm noindex pages are excluded from sitemaps and intentional.
- Check robots rules for production, preview/staging, search crawlers and AI crawlers separately.
- Detect orphan priority pages, unreachable pages, crawl traps, faceted/query duplicates and JavaScript-only links.
- Verify a random unknown URL returns a genuine 404 or 410, not 200 or an irrelevant redirect.

## URL and canonical integrity

- Choose one HTTPS host form and one path policy: case, slash and file extension.
- Redirect HTTP, alternate host and alternate path forms in one permanent hop.
- Require absolute, indexable, 200-status canonicals. Default to self-canonical for unique pages.
- Align canonical, Open Graph URL, structured-data URL, sitemap URL and internal link target.
- Check encoded characters, Unicode, fragments, tracking parameters, pagination and filtered routes.
- Detect redirect chains, loops, temporary redirects used for permanent moves and mass redirects to irrelevant pages.

## Sitemaps

- Parse sitemap indexes and every child sitemap; do not stop at the first file.
- Compare sitemap URLs with the canonical indexable URL inventory.
- Exclude redirects, 4xx/5xx, noindex pages, duplicates and non-canonical alternates.
- Use `lastmod` only when it reflects a significant page update. Do not synthesize freshness.
- Keep within protocol limits and split large or distinct content types when operationally useful.
- Reference the canonical sitemap location in robots.txt and submit it through webmaster tools where appropriate.

## Rendering and on-page signals

- Verify initial HTML contains title, description, canonical, robots directives, headings, core copy and JSON-LD when used.
- Check uniqueness and intent alignment of titles, descriptions and H1s. Exact character limits are not ranking requirements.
- Verify one descriptive primary heading, logical subordinate headings and correct `html[lang]`.
- Check that important content is in the DOM, readable without interaction and not generated only with CSS `content`.
- Confirm responsive viewport, crawlable `<a href>` links and useful anchor text.
- Review image `alt` decisions: meaningful alternatives for informative images and empty alternatives for decorative images.

## Information architecture and internal linking

- Map priority pages and click depth from navigation or relevant hubs.
- Find orphan pages and overlinked boilerplate that dilutes useful context.
- Connect service/product pages with audiences, problems, proof, supporting knowledge and conversion paths.
- Use visible breadcrumbs where hierarchy helps users; structured data should mirror them.
- Ensure consolidated pages are truly relevant replacements before redirecting old URLs.

## Content quality, trust and entity clarity

- Confirm each indexable page has a distinct purpose and satisfies its likely query intent.
- Prefer original experience, named methods, outcomes, examples, evidence and caveats over generic summaries.
- Verify business name, address, contact, people, services and locations are consistent and supported.
- Add authors/reviewers and dates only when genuine; distinguish publication from meaningful modification.
- Check citations and external references for material factual claims.
- Review template-heavy short pages manually; do not pad content to meet arbitrary word counts.
- Detect doorway pages, copied manufacturer/provider text, keyword-location permutations and unsupported superlatives.

## Structured data and search appearance

- Inventory JSON-LD, Microdata and RDFa; check syntax, required/recommended properties and duplicate/conflicting entities.
- Match schema types to visible content and current search-feature eligibility.
- Use stable `@id` values to connect `WebSite`, `Organization`, people, places, articles, services and media where useful.
- Validate referenced URLs, logos, images, dates, authors and offers as real and crawlable.
- Test with Schema.org Validator and, for supported Google features, Rich Results Test.
- Review site-name signals, favicon, Open Graph/Twitter data, share images and snippet controls.

## Local and international SEO when applicable

- Verify customer-facing locations, service areas, contact details and authoritative business profiles.
- Do not mark virtual offices or unstaffed addresses as staffed local businesses.
- For localized variants, validate language/region URLs, self-canonicals, reciprocal `hreflang`, `x-default`, translated metadata and language-specific sitemap coverage.
- Avoid automatic locale redirects that prevent crawlers or users from selecting another language.

## Images and video

- Use descriptive surrounding text, meaningful filenames where practical, responsive images, correct dimensions and modern compression.
- Identify LCP images and avoid lazy-loading them; lazy-load noncritical media.
- Prevent decorative autoplay/video sequences from competing with LCP or loading unnecessarily on mobile/data-saving connections.
- For important watch pages, verify stable thumbnails, crawlable media, transcripts/captions and eligible video markup or sitemap entries.
- Check that robots rules and `X-Robots-Tag` do not unintentionally block image/PDF/video indexing.

## Page experience, accessibility and security

- Measure field LCP, INP and CLS when available; label lab metrics clearly otherwise.
- Diagnose the actual LCP element, layout shifts, main-thread tasks, render blocking and transfer size.
- Test keyboard navigation, focus, menus, accordions, labels, landmarks, heading order, contrast and reduced motion.
- Check HTTPS, mixed content, security headers, intrusive overlays and consent behavior.
- Accessibility and UX are not substitutes for relevance, but defects can make content unusable and harm conversion.

## Measurement and operations

- Preserve Search Console verification across hosting/CMS changes.
- Confirm analytics and consent behavior without exposing private data.
- Record baseline impressions, clicks, indexed pages, top landing pages, 404s and Core Web Vitals when access exists.
- Define alerts or checks for 5xx, sitemap failure, accidental noindex, canonical drift and traffic anomalies.
- Do not claim performance outcomes when Search Console, analytics, logs or field data are unavailable.

## Current primary references to refresh

- Google Search Essentials: https://developers.google.com/search/docs/essentials
- Helpful, reliable, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- AI optimization guidance: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Canonicals: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Robots meta and headers: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- Sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Structured-data policies: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Core Web Vitals: https://web.dev/articles/vitals
- Web Content Accessibility Guidelines: https://www.w3.org/TR/WCAG22/

