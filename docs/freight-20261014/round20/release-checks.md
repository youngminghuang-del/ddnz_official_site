# Nigeria and Peru country pages: eight-language release candidate

2026-10-15. User authorized completion, verification and publication. Baseline: main 4f2e203 (PR67). This record describes pre-release checks; deployment and online verification are recorded separately after completion.

Scope: Nigeria and Peru in en, zh-CN, es, fr, pt, ru, tr, ar (16 existing URLs). Includes the previously reviewed English page work, four shared Gulf chapter cards, official resource logos, destination context maps, image/video galleries, Nigeria tile case supplied by the user, and seven localized editorial versions. Quote links retain language, destination and source. No new destinations, invented shipment outcomes, or actual inquiry submissions.

Sources: SON https://son.gov.ng/soncap-faq/ and https://son.gov.ng/soncapservice/; NPA https://nigerianports.gov.ng/; SUNAT https://www.sunat.gob.pe/legislacion/procedim/despacho/importacion/importac/procGeneral/despa-pg.01.htm; Chancay photo https://www.gob.pe/institucion/mtc/noticias/1182446-mtc-otorga-al-terminal-portuario-de-chancay-la-licencia-para-el-inicio-oficial-de-sus-operaciones. Logos identify official resources, not endorsements. Tile photos and Lagos video originate from user-supplied materials. Peru loading image is a loading reference, not a proven Peru delivery. Map boundaries: Natural Earth/world-atlas.

Facts retained across locales: Nigeria customer quote uses 4719 kg / 500 = 9.438 (about 9.44 units) for 3.5 CBM; this is not a universal LCL tariff. Peru example uses 3 CBM / 4500 kg at 1 CBM versus 1 tonne, giving 4.5 W/M units conditionally. SONCAP applicability is product-specific and preparation is pre-shipment. RUC and documents are reviewed with the Peruvian importer. No fixed delivery time or all-inclusive tax promises.

Validation:
- TypeScript passed; 323 existing release tests passed; 16 new country SSR checks passed.
- Notion route and publishing guards, analytics policy/runtime checks passed. Guard tests deliberately simulate download failure.
- Build: 754 HTML files / 733 sitemap URLs / 0 failures.
- 16 country static checks: final template, H1, canonical, eight alternates, local links and media paths. Added to both CI and production workflow. Fixed Portuguese/Turkish early static return and separate client route overrides.
- Existing freight eight-language audit: 24 pages passed. Search intent: 610 pass, 117 context-only, 6 existing review.
- Browser: Arabic Nigeria at 390px, RTL and no overflow; chapter anchor at about 125px; tile switch and full-image link agreed; localized quote entry → sea mode populated Nigeria, without submission. Portuguese Peru at 745px rendered new template and switched Chancay photo. Turkish Nigeria at 390px rendered four cards without overflow. Prior English two-country 390/745/1440 and Gulf shared-navigation checks retained.
- Videos have no autoplay; eight caption tracks per video (selected locale); cue end times match container durations. Destination maps reduced from about 1.7 MB each to about 120 KB. Mobile WhatsApp avoidance covers gallery controls, video controls and image links.

Remaining boundaries: no claim of native-speaker review, new real inquiry ingestion or conversion improvement. Business availability remains shipment-specific. Preserve unrelated untracked audit/CMS files.
