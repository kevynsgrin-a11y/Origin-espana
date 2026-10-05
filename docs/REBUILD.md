# Origen España rebuild — blank-canvas kickoff (2026-10-05)

Working branch for the full bilingual rebuild. Master plan and coordination
live in the (private) ops repository; this public file records the build
contract only.

## Build contract

- **Stack:** React 19 + Vite 6 + Tailwind 4, static-prerendered HTML for
  every indexable URL, JSON-driven content, no client framework required to
  read a recipe. Deploys: git-connected Vercel behind the site's Cloudflare
  zone (proxied). No builder-platform dependencies.
- **Content model:** merge `recipes.json` (ES) + `recipes.en.json` (EN) into
  `recipes.bilingual.json` keyed by slug. Schema per recipe: title,
  subtitle, description, category (family), note, ingredients[] (metric +
  US units), steps[] (named), faqs[] (ES+EN), nutrition (sourced, cited),
  region, yield, times, difficulty. No invented numbers anywhere.
- **URLs:** `/recipes/<slug>/` (English) and `/recetas/<slug>/` (Spanish)
  with hreflang pairs, plus family hubs from the existing categories
  (Rice dishes, Tortillas, Cold soups, Stews, Vegetables, Soups, Desserts).
- **Templates:** reference layout — story → ingredients → named steps →
  technique note → FAQ; Recipe + FAQPage JSON-LD on every recipe page.
- **Tools:** paella pan-size calculator (people → pan cm / rice g / broth,
  bomba +20% rule) as a client-side island with unit tests.
- **Quality gates (CI):** sitemap↔page parity test; hreflang pair test
  (every /recipes/ slug has a /recetas/ twin and vice versa); bilingual
  completeness test (no missing ES/EN fields); nutrition-source lint.
- **Serving hygiene:** robots.txt + sitemap.xml generated at build; `_headers`
  kept; canonical URLs with trailing-slash directory form.

This branch supersedes the `build.mjs` + committed-`dist/` flow: content
edits happen in JSON, deploys happen from Git.
