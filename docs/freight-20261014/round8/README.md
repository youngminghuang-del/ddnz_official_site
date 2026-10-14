# Round 8 — English Qatar artwork

2026-10-14. Local implementation and validation only; not published.

Replaced Qatar EN/AR images 6–12 and their thumbnails with user-requested English imagegen edits supplied and reviewed by the material/content tasks. Both locales use English artwork; surrounding Arabic HTML stays Arabic. Packaging removes the red panel background; the two style charts use the same ivory/navy/purple visual treatment. Existing factory photos 1–5 remain unchanged. Original round 7 files and source PNG archives are retained. Edited artwork is not described as a pixel-identical photograph or completed shipment evidence.

The website uses original-dimension WebP quality 90 files (709,206 bytes total), with 160px fit-inside quality 80 thumbnails (23,758 bytes total). Source PNG hashes are recorded in source/material-manifest.json; derived asset hashes, dimensions and transformations are in website-assets.json. Natural EN/AR alt text no longer refers to Chinese labels. Packaging quantities, carton dimensions and product weights in HTML remain unchanged. All seven edited selections have localized “View full image” links opening the current full-size image in a new tab with noopener/noreferrer.

## Baselines and preview

- Local starting HEAD: a079b18ebd1d01f5c008923b4cd33db11beee5e1.
- Remote main / latest successful production deploy at round start: b4156a7938672a7ebf3130285cc9d3e135a64880 / 38456135838.
- Final preview: http://127.0.0.1:4187/shipping-from-china-to-qatar/ and /ar/shipping-from-china-to-qatar/.
- Final stage: /var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-wniRLf/dist; entry index-bz1QFnO4.js. Earlier iFIDHN stage was superseded by the full-image link addition.

## Checks

- lint and final build:preview passed: 754 HTML, 733 sitemap URLs, zero failures.
- Search-intent audit unchanged: 610 pass, 117 context-only, 6 pre-existing review.
- Gallery checks: EN/AR × 360/390/430/1110/1536, 120 image selections, 30 group keyboard sequences, 40 chapter anchors; loaded image paths/alts, contain/lazy, selected state, ≥44px controls, HTML packaging values/LTR runs, full-image hrefs and no horizontal overflow passed. No browser page errors.
- 58 screenshots: 48 per-image screenshots at 390/1536 plus ten fresh-page context screenshots. Mobile Arabic style 12 and desktop English packing 8 inspected visually.
- Full-image checks: 14 actual popup opens across both languages, correct full-size URL and natural dimensions, null opener.
- static-check.py: factory 1–5 data unchanged; five HTML packing datasets unchanged; original archive retained; Oman EN/AR main HTML byte-identical to round 7; shared freight page, Oman gallery, RFQ, maps, navigation, journey, story data and CMS source bytes unchanged. Qatar component/CSS changed only for the full-image link.
- Source artwork: material task, content task and engineering each viewed seven outputs; counts/labels and exact packaging figures passed. No additional HB, certification, MOQ or delivery claims.
- External browser requests blocked; no real inquiry sent.

## Files / remaining work

Changed src/features/freight/QatarCargoGallery.tsx, gulf-stories.css, qatarCargoGallery.json; added public/media/freight-20261014-round8 and this evidence directory. No main ledger changes, push, PR or deployment. Production and outcome validation remain outstanding. Coordinator determines publication scope after preview review.

Independent final content review passed on wniRLf/index-bz1QFnO4.js: EN desktop seven selections and Arabic 390px seven selections; new WebP paths, natural alt, labels, captions/packing values and all fourteen full-image hrefs correct. Content reviewer directly opened image 12 (1410×1115); their UI tool did not expose the new-tab click, so popup behavior is supported separately by engineering's 14 Playwright popup tests. Coordinator reviewed three final mobile screenshots and requested no visual rework. See 内容图片复核.md.
