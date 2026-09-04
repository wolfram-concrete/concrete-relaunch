# CONCRETE UI/UX concept preview

Work only on the non-production relaunch prototype in this directory. Read
`UI-UX-HANDOFF-CLAUDE-CODE.md` before changing layouts, copy, interactions, or
navigation.

## Scope

- Allowed: `konzept/**` and existing media referenced from `../wp-content/**`.
- Do not edit production routes outside `konzept/**`.
- Keep every concept page `noindex,nofollow`.
- Do not deploy to production or change production domains.
- Preserve the validated information architecture unless the user explicitly
  asks to reopen a decision.

## Current architecture

```text
konzept/
  index.html                         Homepage and section-order comparison
  projekte/index.html                40-case industry directory + proof stories
  projekte/conlivo/index.html        Example case structure
  szenarien/index.html               Visible label: “Wo wir helfen können”
  szenarien/.../index.html           Example situation page
  leistungen/index.html              Service architecture
  ueber-concrete/index.html          About + working method
  projekt-anfragen/index.html        Non-submitting inquiry prototype
  assets/prototype.css               Shared visual system
  assets/prototype.js                Navigation, variants, filters, concept form
  data/projects.json                 Project taxonomy and routes
  scripts/verify-prototype.mjs       Browser QA
```

The `/szenarien/` path is currently retained for link stability. Its visible
navigation label is “Wo wir helfen können”. A final slug change is a later
migration decision.

## Locked concept decisions

- Navigation order: Home, Projekte, Wo wir helfen können, Leistungen, Über uns,
  Projekt anfragen.
- Only navigation items with a real submenu receive an arrow.
- Strategy, branding, and websites must be visible in the first homepage view.
- Projects are primarily filtered by eight industry clusters; do not add B2B,
  B2C, startup, or a parallel service filter without reopening the decision.
- “Über uns” combines people, senior involvement, responsibility, and process.
- Magazine, explanatory videos, and personal visibility remain part of the
  agency identity.
- Existing SEO copy is migration-critical. Do not globally rewrite it; preserve
  it when the underlying content has not changed.

## UI/UX objective

Make the site feel faster to understand, lighter, calmer, and more premium
without turning it into a generic agency template. Mutabor and Hochburg were
mentioned only as references for clarity and perceived quality, not as layouts
to copy.

Keep the first UI pass focused on:

1. global navigation and responsive menu;
2. homepage hero and hierarchy;
3. project directory and proof-card language;
4. spacing, type scale, reading width, and section rhythm;
5. accessible states and restrained motion.

Do not start with decorative motion, WebGL, a custom cursor, or a full rewrite.

## Commands

Run from the repository root:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/konzept/`.

In a second shell, run:

```bash
PROTOTYPE_BASE=http://127.0.0.1:4173 node konzept/scripts/verify-prototype.mjs
```

The QA script uses the Playwright runtime installed on this workstation. It
checks eight routes in desktop and mobile, internal concept links, overflow,
images, console errors, navigation, homepage ordering, the inquiry form, and
the 40-project directory.

## Working rules

- Reuse local CONCRETE fonts, colors, images, and video assets.
- Keep shared styling in `assets/prototype.css`; avoid page-level style blocks.
- Keep shared behavior in `assets/prototype.js`; use progressive enhancement.
- Maintain keyboard focus, 44px touch targets, semantic landmarks, and
  `prefers-reduced-motion` behavior.
- Test at 1440×1000 and 390×844 after every material pass.
- Update `CHANGELOG.md` and `README.md` with each accepted UI/UX milestone.
- Apply the gauntlet loop: objective → evidence → alternatives → challenge →
  implementation → browser verification → documented result.

## Git and preview

- Working analysis branch: `codex/relaunch-strukturprototyp`.
- Shareable clean preview branch: `codex/relaunch-industry-preview`.
- Stable Vercel preview:
  `https://concrete-website-git-codex-r-e0623d-wolfram-stratmanns-projects.vercel.app/konzept/`
- Keep internal `relaunch-analysis/**` files out of the clean preview branch.
- Never push a UI/UX experiment to the production branch.

