---
name: seo-agent
description: Audit and benchmark websites for technical SEO, content quality, AEO/GEO and AI-search discoverability, structured data, performance, and migration readiness. Use for pre-launch reviews, live-site audits, redesigns, CMS migrations, URL changes, or evidence-based SEO status reports; do not use it to promise rankings or traffic.
---

# SEO Agent

Produce a reproducible, evidence-based assessment of how discoverable, indexable, understandable, and migration-safe a website is. Adapt to the actual stack; never assume WordPress, Payload, Next.js, or a package manager.

## Operating principles

- Treat the audit as read-only unless the user explicitly asks for implementation.
- Separate verified facts, reasonable inferences, recommendations, and unknowns.
- Research volatile search-engine rules at audit time. Prefer Google Search Central, Bing, OpenAI, schema.org, web.dev/W3C and platform documentation over SEO blogs.
- Do not present a benchmark as a ranking or traffic prediction. Score implementation readiness and record evidence, coverage, test date, environment, and confidence.
- Distinguish source HTML from hydrated DOM, local lab results from field data, and preview behavior from production behavior.
- Sample all important page templates and automate corpus-wide checks where practical. Do not infer site-wide compliance from the homepage.
- Never recommend hidden text, fabricated authorship, fake freshness, invented reviews, unsupported locations, mass-produced keyword variants, or structured data that is not visible and true.

## Choose the audit mode

1. **Codebase/pre-launch:** inspect repository instructions, framework, build/dependency files, routes, metadata generation, robots directives, sitemap generation, redirects, assets, analytics and deployment configuration. Start the project and test rendered output when safe.
2. **Live site:** inspect HTTP responses, rendered pages, robots.txt, sitemap(s), canonical host behavior, representative templates, structured data, page experience and crawl paths.
3. **Migration/cutover:** inventory both old and new URL sets, build a source-to-destination matrix, validate every redirect and launch gate, then define post-launch monitoring. Read [references/migration-cutover.md](references/migration-cutover.md).

For a full audit, read [references/audit-checklist.md](references/audit-checklist.md). For structured data, rich results, AEO/GEO, crawler governance, or AI-search questions, also read [references/structured-data-ai.md](references/structured-data-ai.md). Use [references/report-template.md](references/report-template.md) for the deliverable.

## Workflow

### 1. Establish scope and baseline

- Record domain(s), canonical host, locale(s), repository revision, environment, audit timestamp and tools.
- Determine whether dependencies actually exist before installing anything; use the repository's lockfile and documented package manager when they do.
- Preserve the user's working tree. Record pre-existing changes and avoid unrelated edits.
- Identify page types, conversion paths, business locations, target audiences and whether a live predecessor must be preserved.

### 2. Discover the complete URL surface

Combine rather than substitute these sources:

- sitemap indexes and child sitemaps;
- navigation, footer, breadcrumbs and crawled internal links;
- CMS/API exports or route manifests;
- repository HTML/routes and redirects;
- Search Console, analytics, backlink or server-log exports when the user supplies access;
- known assets such as PDFs, videos and downloadable files.

Normalize scheme, host, case, percent-encoding, trailing slash, query parameters and file extensions before comparing sets. Preserve raw URLs in evidence.

### 3. Validate technical invariants

At minimum verify:

- status codes and redirect hops;
- indexability across meta robots, `X-Robots-Tag`, robots.txt and authentication;
- one preferred canonical host and self-consistent canonical URLs;
- sitemap coverage, accurate `lastmod`, absence of redirects/errors/noindex URLs;
- crawlable HTML links and absence of orphan priority pages;
- title, description, H1, `lang`, viewport and meaningful HTML response without client-only SEO;
- structured data validity, eligibility, truthfulness and URL consistency;
- real 404/410 behavior rather than soft 404s;
- HTTPS, mixed content, mobile usability, accessibility and Core Web Vitals risks.

Treat global `noindex`, blocked production crawling, missing primary pages, canonical conflicts, broken migrations, 5xx responses, widespread soft 404s, or redirect loops as launch gates rather than ordinary score deductions.

### 4. Evaluate content, entities and answerability

- Assess whether each priority page has a distinct user intent and substantive purpose.
- Look for first-hand evidence, methods, outcomes, limitations, responsible author/reviewer information and honest published/modified dates where appropriate.
- Evaluate whether key questions receive direct, concise answers followed by useful detail, without forcing artificial FAQ formatting.
- Verify consistent organization, people, service, product, location and contact facts across visible content, structured data and authoritative profiles.
- Review internal topic relationships: service ↔ industry/use case ↔ proof/case study ↔ answer/content ↔ conversion.
- Do not use word counts or exact metadata character counts as pass/fail rules. Flag truncation or thinness only with page-specific evidence.

### 5. Benchmark representative templates

Use the weighted rubric in [references/report-template.md](references/report-template.md). Test the homepage plus at least one example of each meaningful template. For heterogeneous or high-risk sites, increase the sample.

For performance:

- prefer field Core Web Vitals at the 75th percentile when available;
- otherwise label Lighthouse/WebPageTest results as lab data;
- run comparable mobile and desktop profiles and retain tool versions;
- report LCP, INP when field data exists, CLS, transfer size and the actual dominant resources or elements.

### 6. Report and prioritize

Lead with the launch decision and hard blockers. Every finding should include severity, affected scope, evidence, impact, recommendation and validation criterion. Use P0 for launch blockers, P1 for material near-term risk, P2 for meaningful improvement and P3 for optional refinement.

Finish with:

- strengths worth preserving;
- benchmark by category and confidence;
- ordered open tasks with owner/timing when known;
- launch, rollback and post-launch monitoring checks for migrations;
- explicit limitations and unavailable data.

## Evidence and freshness rules

- Link local findings to exact files and lines when possible; cite live URLs and response evidence for production findings.
- For rules that can change—rich-result eligibility, crawler user agents, AI-search guidance, Core Web Vitals, platform redirects—recheck primary documentation during the audit and record the date.
- Test claims such as “redirected,” “indexable,” “in the sitemap,” or “mobile does not load this asset.” Configuration alone is not proof.
- If Search Console, analytics, logs, backlink data, rankings or real-user data are unavailable, state that plainly. Do not estimate them from Lighthouse or HTML quality.
