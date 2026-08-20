# DDNZ product showcase launch handoff

## Production routes

- `/products`
- `/sourcing-services`
- `/sourcing/commercial-kitchen-equipment-from-china`
- `/refrigeration-equipment`
- `/sourcing/audio-speakers-from-china`
- `/sourcing/mobile-accessories-from-china`
- `/sourcing/outdoor-products-from-china`

The short prototype routes redirect to their canonical sourcing URLs. Localized overview routes redirect to the approved English pages until genuine translations are available.

## Inquiry handoff

All showcase CTAs continue through the existing `/get-a-quote` route. Product, destination, buying stage and source-page context are carried as query parameters. The existing Formspree form ID remains `mdabvqbd`; no second form or CRM path was introduced.

## Production media

The deployed showcase media root is:

`public/images/product-showcase/`

It contains 56 referenced production files only: 51 WebP images and 5 MP4 videos (about 17 MB). Source PNG/JPG/MOV files, review boards and unused image variants are not under the deployed media root.

## Recoverable archive

Non-production material is stored outside the official site's `public` directory at:

`/Users/huangyangming/Documents/New project/ddnz-products-v3-prototype/material-archive/2026-08-20-production-cleanup/`

The archive contains review boards, original PNG/JPG/MOV files and unused WebP variants. Nothing was deleted.

## SEO and production checks

- Canonical URLs, titles, descriptions, Open Graph images and single-language hreflang rules are defined for all seven routes.
- The routes are included in static pre-rendering and `sitemap.xml`.
- `robots.txt` uses the production domain `https://www.ddnzglobal.com`.
- Type checking: `npm run lint`.
- Production build, static generation and SEO audit: `npm run build`.
- A real Formspree submission is intentionally excluded from automated acceptance because it sends an external message.

Acceptance completed on 2026-08-20:

- Seven of seven routes passed at 1440 px desktop and 390 px mobile widths.
- No horizontal overflow or broken production images were found.
- All five MP4 files loaded; the three audio factory videos reached `readyState = 4` during browser acceptance.
- The marked outdoor comparison copy renders at 13 px with a 19.5 px line height on mobile.
- Product-page context reached `/get-a-quote` with the expected category, scope, destination, buying-stage and source parameters.
- Loading a showcase page and returning through client-side navigation did not alter the existing home page layout.
- Static generation audited 208 HTML pages and 208 sitemap URLs with zero failures and zero notices.

## Deployment boundary

Local production acceptance does not authorize git staging, commit, push, pull-request creation, DNS changes or deployment. Those actions require separate approval.
