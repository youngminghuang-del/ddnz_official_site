# Round 9 — Qatar responsive spacing

2026-10-14. Local changes and validation only; no publication.

The style and packing introductions now precede their galleries at all widths. Style artwork is centered at a maximum width of 860px; packing at 760px. Artwork 6–12 uses its natural aspect ratio instead of a fixed-height frame, retaining the complete image without CSS letterboxing. The consolidation section stacks heading/body before the gallery; its small consolidation/LCL explanation is compacted into two columns. Relevant section padding is 36px, 28px below 820px. Qatar's first cargo module also switches to a single column at 820px. No text or image changes were made to fill space.

Changed production files: src/features/freight/GulfFreightPage.tsx (one Qatar section class) and gulf-stories.css (Qatar-scoped layout). Baseline f8d91899f90d4c4dfb9c1f969b8438b8bb06a12b; remote main/latest successful deployment checked at start: b4156a7938672a7ebf3130285cc9d3e135a64880 / 38456135838.

Final preview: http://127.0.0.1:4187/shipping-from-china-to-qatar/ and /ar/shipping-from-china-to-qatar/. Stage /var/folders/qf/5ks5mmp12118_4y0794wl6dc0000gn/T/ddnz-preview-msnd8T/dist; entry index-D84cJaJn.js.

Validation:

- lint and build:preview passed; 754 HTML / 733 sitemap URLs / zero build failures.
- Search-intent audit unchanged: 610 pass, 117 context-only, 6 prior review.
- layout-check.mjs/results: EN/AR × 360/390/430/640/745/820/1024/1280/1440 = 18 combinations. Seven artwork selections each (126), natural aspect ratio and exact frame fit, introduction-before-gallery order and gap, 44px thumbnail targets, selected state, current full-image hrefs, RTL arrow/Home/End keyboard operations, no horizontal overflow, 72 chapter anchor activations with heading positions 100–300px below viewport top. No browser page errors.
- 30 final viewport screenshots: 24 representative selections (6/10/11/12 at 390/745/1440, both languages) plus six consolidation section context views. Initial element screenshot collection included sticky-header overlap; replaced by correctly scrolled 1400px viewport captures and visually inspected. This was a screenshot issue; no additional code change.
- protection-check.py/results: Qatar gallery code, image/copy data, Oman gallery, RFQ, map/navigation/journey/story/CMS sources unchanged. All 38 round7/8 image files byte-identical. Oman EN/AR main HTML unchanged; Qatar main HTML only adds the targeted section class. All packaging values remain unchanged.
- All browser external requests blocked; no real inquiry submitted. Full-image popup implementation is unchanged from round8; this round verifies every current href in 18 layouts, with round8 actual popup tests retained as prior evidence.

Remaining: local review/commit record and coordinator publication decision. No push, PR, deploy or effect measurement. Original six untracked evidence groups retained. Shared growth ledger is coordinator-owned and was not edited.

Coordinator reviewed 745px style, Arabic 390px packing and 1440px style screenshots and requested no further layout changes. The requested 745px consolidation heading/body/gallery context is included as qatar-en-745-packing-section-context.png (and Arabic equivalent). Local implementation and validation are complete; publication remains outstanding.
