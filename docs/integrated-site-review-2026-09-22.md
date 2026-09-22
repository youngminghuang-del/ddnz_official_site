# Integrated local candidate — 2026-09-22

## Version boundary

- Working branch: `codex/integrated-site-20260922`.
- Working directory: `ddnz-freight-release-20260920`.
- Restored content source: sibling `ddnz-site-aligned-preview-20260917`.
- Preserve current homepage work, the eight-language sea/LCL/dangerous-goods release, and the static CookieConsent import that avoids the blocked lazy-chunk failure.
- Previous freight release was deliberately partial; destination and procurement improvements remained in the candidate directory. This integration restores those changes rather than treating the mismatch as a browser-cache problem.
- No production deployment or remote push performed for this integration.

## Restored scope

- UAE, Nigeria, Mexico and Ghana destination components and routing.
- Regional destination content, Latin America depth modules and country/region links.
- Supplier search, inspection, consolidation/export service presentation and service case components.
- How-we-work image changes and sourcing/product entry links.
- Referenced UAE unloading videos/posters and speaker-parts image.
- Static page generation for the restored routes while retaining the release freight renderer.

## Performance changes

- Lazy-load Home instead of loading homepage-specific dependencies for every route.
- Load Google Fonts without a render-blocking stylesheet; retain a noscript fallback.
- Enhance same-origin native page anchors with client routing after React starts. Preserve downloads, external links, modified clicks, same-page anchors and explicit native-navigation opt-outs.
- Production curl measurements in this environment: root TTFB 6.754 s; Chinese homepage TTFB 7.618 s. These are two samples, not a multi-region benchmark or proof of a hosting fault. Network/CDN/origin latency remains unisolated.

## Verification

- `npm run lint`: pass.
- `npm run build:preview`: pass; 304 HTML files, 290 sitemap URLs; SEO and deployment inventory checks passed.
- `node --import tsx --test tests/core.test.mjs tests/release-build-chain.test.mjs tests/product-language-routing.test.ts`: 42 passed, 0 failed.
- Initial test invocation without the TS loader failed to load a .ts test; corrected invocation above passed.
- Browser: UAE page renders both unloading videos and no missing local-delivery placeholder. Clicked UAE → sea freight → consolidation/export successfully. Consolidation page displays Chinese steps, FCL-labelled speaker case and receiving record. Its desktop hero screenshot was reviewed.
- Local preview: http://127.0.0.1:4180/zh-cn/ (4180 separates this candidate from older 4173 previews).

## Remaining acceptance limits

- Browser checks are representative, not a full 290-URL visual certification.
- Existing destination translation gaps remain; this is not a claim that all restored pages are fully translated into eight languages.
- Production response time must be measured again after an approved deployment and investigated separately if slow.
- Homepage's proposed exact “Import from China” headline/three-path wording has not been applied by this integration.

## Pre-release follow-up

- Fetched remote main on 2026-09-22: `6cc6077` (PR #35); preceding release is `3eb358a` (PR #34). The content of the remote CookieConsent fix matches the local fix; no newer remote business-page changes were found.
- Additional public Chinese-homepage sample: HTTP 200, DNS 0.044 s, connection 0.048 s, TLS established 1.965 s, first byte 2.495 s, total 2.513 s. Timings are cumulative from request start. Variation versus earlier samples means latency is not consistently 7 seconds.
- Headers show Cloudflare in front of GitHub Pages; `cf-cache-status: DYNAMIC`, upstream `x-cache: MISS`, `cache-control: max-age=600`. No CDN configuration was changed. These headers alone do not establish the cause of end-user slowness.
- Local review remains separate from production; publishing still requires the release decision.
