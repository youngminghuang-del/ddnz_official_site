# Production indexing and security repair — 2026-09-24

## Deployed changes

- Commit bb4dccf: prerender `/get-a-quote/` in all eight languages using the actual page component. Build, lint, search-intent audit and GitHub release run 35940558839 passed. All eight live routes returned 200 with one static H1 and core-prerender marker.
- Cloudflare response transform `DDNZ website security headers` (78e4121b507f41d5a3236c447b503b05) is active on HTTPS requests for the apex and www host. Security audit: 6/6. HSTS starts at 86400 seconds without subdomain/preload assumptions. CSP restricts script origins and prevents object embedding, base URI changes and foreign framing. Inline scripts remain allowed for current templates; this is not a nonce-based strict CSP.
- Browser checks: Arabic West Africa page retains regional content after JavaScript loads, with no captured errors. Portuguese enquiry page loads and advances from transport selection to origin/destination, without sending a test enquiry.
- Cloudflare bulk list `ddnz_legacy_articles_20260924` (44043a32db174d3b854a4113d3dd5454), rule eb94c2f6bc96454dace5af07c60c69ee: 77 exact redirects. All 77 return 301 to their expected canonical destination. See JSON/CSV and verification files in this folder.
- Two additional Cloudflare single redirects restore historical Alibaba-risk and new-energy-logistics UUID article URLs to their published articles. Both return 301 then 200.

## GSC evidence and actions

Report updated 2026-09-21 (before the current release), viewed 2026-09-24: 547 excluded, 263 indexed; redirect 271, 404 111, alternate canonical 120, noindex 4, discovered 19, crawled 8, redirect error 2, different canonical 12.

- 111 reported 404 URLs: 26 now return 200; 74 historical aliases redirected to exact published articles; 11 have no verified published replacement and remain genuine 404. Do not blanket-redirect them to the homepage or republish withdrawn articles solely to clear the report.
- Four noindex examples: `/screen-protectors/brief/` intentionally remains excluded. Three legacy article aliases now have real 301 redirects.
- Both redirect-error URLs repaired. GSC validation visibly **Started, 2026-09-24**.
- All 12 canonical-conflict URLs currently return 200, self-canonical, a static page-specific H1 and no robots noindex. Existing regional route components already differ from country pages; do not modify the older country-only components based on a mistaken routing assumption. GSC validation visibly **Started, 2026-09-24**.
- Arabic West Africa live test passed (“URL can be indexed”). Request indexing succeeded and GSC confirmed addition to priority crawl queue. This does not guarantee Google's eventual canonical choice or indexing.
- Eight crawled-not-indexed URLs checked live: all resolve to 200 with static H1 and correct canonical; the enquiry parameter URL canonicalizes to its clean URL, and slashless Chile/warehouse paths resolve to slash versions. See crawled-live.json. No blanket noindex removal or forced duplicate indexing performed.

## Ongoing distinctions

Normal redirects, alternate URLs, intentional noindex and genuinely removed pages should not all be forced into Google's index. Technical fetchability is distinct from indexing and rankings. GSC report counts will not disappear immediately after deployment; Google validation and recrawling are external pending work.

All 19 discovered-not-indexed examples were individually fetched: all return 200, self-canonical, static localized H1 and no robots noindex (see discovered-live.json). They comprise the eight-language dangerous-goods and LCL pages, Portuguese/Turkish sea-freight pages, and the screen-protector video page. They await Google crawling; this is not evidence that every excluded URL is fixed or that search visibility is guaranteed.
