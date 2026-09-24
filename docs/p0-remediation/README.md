# P0 remediation — 2026-09-24

## Scope and actual counts

User authorized five tracks: crawlable cross-language links, Turkish/Portuguese country content, five named articles, 174 long titles, and relevant legacy redirects. Existing crawl is the baseline, not a claim about Google's graph or rankings.

- Navigation: desktop language options are real anchors retained in DOM when closed. Footer language anchors are available in React pages and static generated documents. Only existing language routes are linked; untranslated blogs use the corresponding Insights hub. No invented blog translations.
- Content: 19 destinations × Turkish and Portuguese buyer briefs; Brazil's existing dedicated Portuguese page remains its source. This updates 37 template-based pages (19 tr + 18 pt), rather than treating the audit's incorrectly described “43 tr/pt pages” as a valid count. Destination-specific opening and receiving sections replace boilerplate, covering purchasing, packaging, split deliveries, receiving addresses and quote boundaries. Shared service explanations remain shared. No invented shipping times, duty rates, port coverage or legal assurances. This is not a claim of native-speaker certification.
- Articles: five specified original articles are preserved as local published snapshots. Three were already in current data; PSS and SAF were recovered from Git. Provenance is in recovered-posts.json. Existing historical publication dates/content are retained; they are not republished as current announcements. Notion sync preserves these explicitly restored pages when absent upstream, while preferring a current same-language same-slug published version.
- Titles: 174 prior-crawl URL title overrides, all <=60 characters after editorial shortening, no character slicing. 173 URLs currently exist in this build; the prior Alibaba top-10 article is not in the current published dataset, so its override is dormant. 60 is an editorial target, not a Google indexing rule. Shared overrides apply to runtime SEO and final static HTML/OG/Twitter output.
- Redirects: 77 previously configured mappings retained; 7 exact article aliases newly mapped. All 84 destinations exist in the build and do not form mapped redirect chains. Static redirect HTML is a navigation fallback, not a real HTTP 301. The new seven HTTP redirects require Cloudflare application after publishing the restored destination pages. No blanket homepage/category redirects; remaining unmatched legacy URL is not guessed.

## Validation

`npm run lint`; `npm run build:preview`; `node --import tsx scripts/test-notion-article-routing.ts`; `node --import tsx scripts/test-notion-publishing-guards.ts`; `npm run audit:search-intent`; `python3 scripts/check-p0-output.py`.

The custom check validates homepage reachability using actual static anchors, all active title overrides, five restored article routes and all redirect destinations. Results are in build-verification.json. Full build also runs existing country/core prerender, SEO and deployment-file checks.

Local dependencies were missing d3/topojson/world-atlas in the shared node_modules symlink. An isolated dependency installation from the existing lockfile and offline npm cache was used for validation, without changing the shared dependency directory.

## Release state

Production commit `2f30eefa91ba25e4eff2d7f9af9002285e4761d6` was deployed by GitHub run `35970260557` on 2026-09-24. The seven Cloudflare bulk redirects were subsequently applied and all seven source URLs returned a direct HTTP 301 to the canonical English article, whose target returned HTTP 200. Evidence is recorded in `live-redirect-verification.json`; `verify-restored-redirects.py` reproduces the read-only check. The UTF-8-with-BOM `cloudflare-redirects.csv` preserves the complete prior mapping set. Preserve existing Cloudflare normalization and security rules when making later changes.
