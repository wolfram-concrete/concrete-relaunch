# Structured data, AEO/GEO and AI-search discovery

Recheck the linked primary documentation during each audit because search features and crawler policies change quickly.

## Structured-data decision rule

1. Identify the visible content and real-world entity.
2. Check current search-engine feature support and required properties.
3. Add only truthful properties backed by visible content or authoritative organizational data.
4. Keep entity IDs and canonical URLs stable and consistent.
5. Validate syntax separately from rich-result eligibility.
6. Treat eligibility as eligibility, never a guarantee of enhanced display or ranking.

Commonly useful patterns:

- Homepage: `WebSite` for site-name signals and `Organization` for identity.
- Hierarchical pages: visible breadcrumbs plus `BreadcrumbList`.
- Editorial content: `Article`/`BlogPosting` with genuine author and date data.
- Customer-facing staffed locations: `LocalBusiness` only when the facts support it.
- Dedicated important video pages: `VideoObject` and/or a video sitemap.
- Products, jobs, events and other types only when the page meets the current feature rules.

Do not add schema merely because schema.org defines a type. Google may have no corresponding rich result. Do not mark self-controlled Organization/LocalBusiness testimonials as review stars when the search engine's self-serving review policy excludes them.

## FAQ and accordion guidance

- Accordions are a presentation choice, not an SEO feature. Make questions and answers useful, visible in the DOM, keyboard accessible and available without requiring a crawler-only path.
- As of 2026, Google has removed FAQ rich results from Search. Do not recommend `FAQPage` as a Google rich-result tactic without rechecking current documentation.
- `QAPage` is for pages where users can submit multiple answers to one question, not a publisher-written FAQ.
- Direct answers followed by evidence and nuance remain useful for people, snippets and AI-assisted discovery even without FAQ schema.

## AEO/GEO and generative search

Treat AEO and GEO as views of the same discoverability system, not separate technical hacks:

- be crawlable and indexable in the underlying search system;
- answer real questions clearly and substantively;
- provide first-hand evidence, sources, entity clarity and stable URLs;
- connect related pages with descriptive internal links;
- keep important facts consistent across pages and authoritative external profiles;
- expose meaningful content in accessible HTML;
- use structured data for supported meanings/features, not as an AI-ranking shortcut.

Google states that no special AI schema, forced content chunking, AI-only rewrites or `llms.txt` file is required for its generative search features. An `llms.txt` file may serve another documented consumer, but it is neutral for Google and creates a maintenance surface.

## AI crawler governance

Treat search discovery, training and user-triggered retrieval as separate policy decisions. Verify current user-agent documentation before editing robots.txt.

- For ChatGPT Search inclusion, OpenAI currently documents `OAI-SearchBot`; blocking it can prevent inclusion in ChatGPT search answers.
- OpenAI documents `GPTBot` separately for potential model-training use. A site can make a different decision for it.
- Google documents `Google-Extended` as a control for certain generative-AI uses, separate from ordinary Google Search inclusion.

Do not assume a crawler rule guarantees citation, indexing or exclusion from every downstream system. Record the business decision and test the public robots response after deployment.

## Primary references to refresh

- Google AI optimization guide: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google AI features and websites: https://developers.google.com/search/docs/appearance/ai-features
- Google structured-data policies: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Google supported structured-data features: https://developers.google.com/search/docs/appearance/structured-data/search-gallery
- Google Search documentation updates: https://developers.google.com/search/updates
- Google review snippets: https://developers.google.com/search/docs/appearance/structured-data/review-snippet
- OpenAI publisher/developer FAQ: https://help.openai.com/en/articles/12627856
- Schema.org validator: https://validator.schema.org/

