# Product catalogue integration — 2026-10-21

Status: locally validated; prepared for a draft pull request. Not deployed.
Base: PR77 / 0cf952558067c627a64c5c1c23cbb5a773545753.

Integrates the previously reviewed F61–F65 previews:
- Five electric tricycles with 13 image groups, distinguishing pedal, cargo, box-delivery and compact models.
- Three electric utility vehicles with 16 image groups, split by delivery and seating use.
- Electric camping wagon on the existing outdoor page; five motor supply configurations on the existing scooter page.
- Eight authored languages: EN, zh-CN, RU, FR, ES, AR, PT, TR. Catalogue filters, galleries, quote details, canonical URLs and language routes are included.

The global product menu includes tricycles and utility vehicles, plus direct existing-page anchors for the wagon and hub motors. No extra nesting or separate wagon/motor URLs. Final integration removes duplicate trailing slashes in tricycle cross-links and new-page SEO alternates.

Source material: prior 50-PDF batch, folder material IDs 02/07/11/29/30/31/33/38/42/45. Original material and full image-processing records remain in the local catalogue audit archive. Today's alibaba 02 PDFs are not adopted in this change. Fuel ATVs are excluded; fuel motocross and the wheelchair are deferred. Unknown/conflicting specifications remain unconfirmed and are not turned into performance, approval or compatibility promises.

Validation:
- Final TypeScript lint passes; 16 navigation/locale tests pass. Complete 340-test suite passed for F65 before these navigation/URL adjustments; not represented as rerun here.
- Final preview build: 832 HTML files, 811 sitemap URLs, 104 core SSR routes, zero deployment-file failures.
- 32-page static integration audit: one H1, self-canonical, localized menu routes (outdoor header checked in browser), new image resources, new-page language alternates, and no duplicate-slash internal links. All 795 prior production sitemap URLs retained; 16 added locale URLs.
- Search intent: 682 pass, 123 context-only, 6 existing review cases. This is a structural check, not a ranking or translation-quality guarantee.
- F65 already verified galleries, quotation presets and 32 desktop/mobile layouts. Final integration checked the folded product menu and direct navigation to the hub-motor section in the browser. No external enquiry submitted.

Remaining: PR validation, merge/deployment and online verification; parameter confirmation (94 prior fields); separate preparation of the newly audited 13 PDFs. Production and traffic results are not inferred from local checks.

## Review corrections — homepage FAQ and consumer navigation

The homepage rendered the same 11 FAQ entries twice: once through the searchable Partners component, and again through HomeProductFaqs. Remove the second rendering in both Home.tsx and the static renderer. Preserve the shared FAQ data, original search/filter/answer links and FAQPage schema.

Within Consumer electronics & accessories, mobile accessories and audio are now labeled groups rather than further disclosure controls. Mobile links go directly to the overview, phone cases, straps/charms and screen protectors. Audio offers its overview and five existing categories. Explicit overview labels replace ambiguous "View category" labels; materials/pricing remains within the phone-case page rather than another global disclosure. No route or redirect is removed.

Final local checks pass: TypeScript; 21 related homepage/navigation tests; preview build (832 HTML / 811 sitemap / 104 core SSR); eight homepage static checks (one FAQ module, 11 unique questions and matching schema each); 32 catalogue integration checks and 795 production URL preservation. Search intent stays 682/123/6. Browser checks: zh-CN and Arabic at 390px, zh-CN at 1440px; no horizontal page overflow, direct mobile screen-protector link, two labeled menu groups without nested disclosures, and FAQ answer/search interaction. No external enquiry submitted. New HEAD requires its own PR check; previous 7a3db6b passed run 39565207134.

## Remaining product-menu groups

Reviewed all five product groups after the consumer-electronics feedback. Kitchen and food now use explicit overview labels and distinguish equipment categories from packages. Energy separates power/storage/solar, outdoor equipment, and selection guides. Mobility separates vehicles from parts/motors; the scooter catalogue is a direct link, with detailed adult/child selection left on that page. Every category now has only its top-level disclosure, with descriptive groups and direct links inside.

New copy is authored in all eight languages in src/config/productDirectoryLabels.json. No page URL, redirect or landing-page content is removed. All prior category paths remain represented; 288 localized entry targets and fragment IDs exist in the built output. The solar entry retains its category query and section anchor.

Local validation passes: TypeScript, 16 routing/navigation tests, full preview build, search-intent audit (682/123/6 existing), prior FAQ/schema checks and 795 production sitemap URL preservation. Browser checks cover all five groups in all eight languages at 390px and 1440px (80 checks), with no horizontal page overflow or extra nested disclosures. No enquiry submitted. The new commit requires its own PR CI result; no merge/deployment performed.
