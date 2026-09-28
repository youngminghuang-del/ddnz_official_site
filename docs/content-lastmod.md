# Verified sitemap content dates

`src/data/contentUpdates.json` records actual publication dates for reviewed page changes. The first seven entries correspond to the screen-protector content and active-view rendering corrections published on 2026-09-28 in PR #38 (commit `593f463b475fff3006d1e9b124901ebecb4fb226`).

The final SEO build step applies these dates to both deployment and public sitemaps. It preserves URL membership, priorities, alternates, unrelated dates and any later CMS date. Missing or duplicate target routes fail the build.

For later substantive page changes, update the specific entry and record publication evidence. Never use the current build date or bulk-refresh unchanged pages. This ledger does not claim that every historic page modification has a reconstructed date.

Validation: `node --test tests/content-lastmod.test.mjs`, `npm run lint`, `npm run build:preview`, and `npm run audit:search-intent`. A 701-route build using the deployed Notion snapshot changes only seven lastmod fields; all other sitemap nodes remain byte-identical. This change does not modify page titles or body copy.
