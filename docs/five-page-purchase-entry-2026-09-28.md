# Five English purchase-entry improvements — 2026-09-28

Approved scope: improve the existing phone-case, screen-protector comparison, vegetable-processing, refrigeration and restaurant-package pages. Keep titles, descriptions, H1s, URL paths and the five-title experiment unchanged. No new pages or translated copy.

| Page | Change |
| --- | --- |
| `/phone-cases/` | Material links to five existing case cards; iPhone, Samsung, Xiaomi / Redmi, OPPO and vivo request entries append the brand to the existing sourcing notes. Unlisted cases have a separate quotation entry. |
| `/screen-protectors/compare/` | Short HD / clear, privacy / anti-spy, 9H tempered glass and 2.5D / 3D buying explanations; existing store-wholesale, private-label, video and combined-request links. |
| `/sourcing/food-processing-machinery-from-china/vegetable-processing-machinery/` | Opening names peeling, slicing, julienne / shredding and chopping; links to TP-350, DQ-PS300 and SC-R22, plus the existing three-machine package. |
| `/refrigeration-equipment/` | Chilled storage, frozen storage, prep counters, display cooling and ice-making entries. Uses the existing model query selection and a static-compatible equipment anchor. |
| `/sourcing/restaurant-kitchen-packages-from-china/` | Six existing scenario links and summaries, plus fryer, griddle, refrigeration and food-preparation entries. |

Static and interactive versions share the new content renderers. The English-only mobile guard preserves translated pages. Existing products, images, videos, pricing and inquiry components remain in use. No large specification tables were introduced.

Validation: type-check; complete existing 297-test suite; isolated release fixture updated for the new content dependency; final focused regression tests; full build with the latest deployed Notion snapshot (703 sitemap URLs); SEO/deployment audits; purchase-intent audit (592 pass, 111 context-only); 40 new navigation links and fragment targets checked. Browser checks cover 390px and 1440px, no-JavaScript content, product selection and existing model handoff. No inquiry is submitted.

Metadata comparison against the prior preview has zero title, description or canonical changes. The latest deployed CMS snapshot adds an already-live Spanish article, which also updates existing insights listings; those CMS files are not part of this change. Translation-page body content is unchanged by this patch.

Rollback: revert this pull request's merge commit and redeploy. Preserve PR 42's title overrides and the independent Notion content snapshot. Publication and live verification details are recorded in the external completion report after deployment.
