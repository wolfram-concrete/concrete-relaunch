# Benchmark and report template

## Rating method

Score implementation readiness, not expected ranking or traffic. Grade each category from 0 to 4 and multiply by its weight:

| Category | Weight | 0 | 2 | 4 |
|---|---:|---|---|---|
| Crawlability and indexation | 15 | blocked/broken | material gaps | verified and controlled |
| URLs, canonicals and redirects | 15 | conflicting/lossy | partial consistency | one-hop, canonical integrity |
| On-page and rendering | 10 | absent/client-only | inconsistent | complete across templates |
| Content quality and trust | 15 | generic/unsupported | mixed | distinct, useful, evidenced |
| Internal linking and architecture | 8 | key pages orphaned | uneven | intentional topic paths |
| Structured data/search appearance | 10 | false/broken | limited | valid, eligible, consistent |
| AEO/GEO and entity clarity | 10 | unclear/unanswerable | some direct answers | clear, evidenced, connected |
| Performance, mobile and accessibility | 10 | severe barriers | template risks | good field/lab evidence |
| Local/international/media SEO | 4 | applicable basics broken | partial/not applicable | correctly implemented/N/A |
| Measurement and operations | 3 | blind launch | partial setup | baselines, alerts, owners |

For each category, calculate `weight × grade / 4`. Mark non-applicable subtopics explicitly; do not award points for features the business does not need. Report the total as a readiness indicator with confidence:

- 90–100: strong readiness;
- 75–89: launchable after listed gates;
- 60–74: material risk;
- below 60: not launch-ready.

Hard launch gates override the numeric result. Examples include production-wide `noindex`, widespread 5xx, missing priority content, broken canonical host routing, redirect loops, incomplete high-value URL migration or a sitemap that cannot be fetched.

## Minimum report structure

### Executive decision

- Environment and audit date
- Launch status: GO / CONDITIONAL GO / NO-GO
- Hard blockers
- Top strengths to preserve
- Data limitations

### Benchmark

| Category | Grade | Weighted score | Confidence | Evidence summary |
|---|---:|---:|---|---|

Never present the total without the category evidence and hard-gate status.

### Coverage

- Total known/crawled/repository URLs
- Sitemap URLs and child sitemaps
- Indexable/noindex/redirect/error counts
- Page templates sampled
- Field versus lab data available

### Findings

For every actionable finding:

| Field | Required content |
|---|---|
| Priority | P0, P1, P2 or P3 |
| Scope | affected URLs/templates/count |
| Evidence | file/line, URL, status, response or measurement |
| Impact | discoverability, interpretation, UX or migration consequence |
| Recommendation | concrete change without promising outcome |
| Done when | observable validation criterion |

### Migration appendix when applicable

- URL-source inventories and their coverage limits
- Preserve/redirect/remove/investigate counts
- Unmapped, many-to-one and intentionally retired URLs
- Host/scheme/path variant tests
- Pre-launch gates, rollback criteria and post-launch checks

### Data limitations

State whether Search Console, analytics, server logs, backlink data, rankings, conversion baselines and field Core Web Vitals were available. Do not replace missing datasets with estimates.

