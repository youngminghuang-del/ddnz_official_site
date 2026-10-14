# Round 7 — Qatar user photo galleries

2026-10-14. Local implementation and validation; not pushed or published.

## Change

Qatar EN/AR now uses twelve user-supplied originals in three independent groups: production/sorting 1–5 (default 5), styles 11–12 (default 11), packing 6–10 (default 6). The production gallery replaces the ViaTrading reference on the page. Style guidance has its own compact section; packing examples sit in the consolidation section, retaining the existing consolidation/LCL explanation.

Titles and captions use localized HTML outside the image. Originals remain byte-identical and render with object-fit: contain. Twelve 160px thumbnails total 111,434 bytes. Only the selected original is mounted in each group, with lazy loading. Buttons support click, Home/End and direction-aware arrow keys, focus indication and aria-pressed. Packing selections show three readable HTML values: number of caps, outer carton dimensions and product weight. Arabic numeric runs have explicit LTR direction. Group copy explains that examples are not standard specifications and freight pricing needs final dimensions and gross weight.

## Evidence

- Starting local HEAD: 0b6244bf134ffcd419bdea40a1baca6e33234606.
- Starting remote main/live successful deploy: b4156a7938672a7ebf3130285cc9d3e135a64880; workflow 38456135838.
- Preview: http://127.0.0.1:4187/shipping-from-china-to-qatar/ and /ar/shipping-from-china-to-qatar/.
- Final preview stage: /var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-RZGMrM/dist; entry index-0u_ruNLU.js.
- lint.log: TypeScript passed.
- build.log: preview build passed; 754 HTML files / 733 sitemap URLs / no failures.
- search-intent.log: 610 pass, 117 context-only, 6 pre-existing review; no expansion into phone-film work.
- gallery-check.mjs / gallery-results.json: 2 languages × 360/390/430/1110/1536 widths; 120 image selections, 30 group keyboard checks, packing fields and LTR numbers, lazy/contain, unique selected states, ≥44px controls, no horizontal overflow, 40 chapter anchors. No browser page errors. External requests blocked; no inquiry submitted.
- screenshots/: 48 per-image screenshots at 390/1536 in both languages plus 10 fresh-page contextual screenshots = 58. Representative desktop English context and mobile Arabic packing/style images inspected visually.
- static-check.py / static-results.json: twelve original SHA-256 matches; three groups/twelve SSR controls on both Qatar routes; no ViaTrading attribution on either page. Oman EN/AR main HTML byte-identical to round 6. RFQ, Oman gallery, destination map, chapter navigation, cargo journey, story data, regional map data and CMS source bytes unchanged.
- website-assets.json and source/: exact asset hashes, dimensions in source JSON and received content/manifest.

## Changed files and next step

GulfFreightPage.tsx, gulf-stories.css, new QatarCargoGallery.tsx and qatarCargoGallery.json; public/media/freight-20261014-round7; this evidence directory. No shared ledger changes, remote push, PR, deploy or production verification. Historical unused reference assets remain in the repository but are not rendered by Qatar EN/AR.

Next: coordinator reviews this local preview and determines publication scope. Production effect validation remains outstanding because this round is unpublished.

Independent content review passed against index-0u_ruNLU.js: EN desktop 12 clicks plus AR 390×844 mobile 12 clicks; all images, captions/HTML values and defaults verified; no content fixes requested. Coordinator also inspected desktop context, Arabic mobile packing and style screenshots and approved local commit. See 内容组集成复核.md.
