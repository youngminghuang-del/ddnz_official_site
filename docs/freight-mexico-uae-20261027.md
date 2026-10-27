# Mexico / UAE route planning — 2026-10-27

Local implementation after 6acf237; production baseline f8193e2 (PR89). Not deployed.

## Changes
- Added Mexico/UAE route comparison, arrival responsibilities and cargo preparation in EN/ZH/ES/PT/FR/RU/TR/AR through the shared RoutePlanningDepth component.
- Integrated dedicated EN/ZH/ES pages, legacy AR/FR/RU country templates and existing PT/TR international content path. Kept existing media and inquiry flows.
- UAE legacy hero sea/air timing now says route-specific rather than showing a generic range.
- Mexico compares Manzanillo road delivery, Lázaro Cárdenas inland options and a separate urgent air quotation. These are requests for comparison, not guaranteed bookings.
- UAE requires actual discharge gateway, onward sea/road transfer, clearance point, address, unloading and empty return. No fixed new transit promise.

## Sources and adoption
Checked 2026-10-27. Port topology is distinct from live carrier acceptance.
- DP World Jebel Ali: https://www.dpworld.com/en/ports-terminals/uae/jebel-ali-port — multimodal infrastructure, not evidence of currently bookable direct calls.
- Dubai Airports cargo: https://dubaiairports.ae/corporate/business-opportunities/cargo — airport cargo context.
- Maersk operational update 48, 2026-09-17: https://www.maersk.com/news/articles/2026/09/17/middle-east-operational-update-48 — search result confirms restrictions and landbridge distinctions. Not treated as today's complete operations status.
- Hapag-Lloyd week 40, updated 2026-09-29: https://www.hapag-lloyd.com/zh/services-information/operational-updates/updates/2026/09/ops-update-middle-east-week40.html — search result describes ad hoc Jebel Ali calls. Reason to require carrier confirmation rather than assume direct service.
- Maersk FM1 relaunch 2026-10-13: official search result found; page fetch timed out. No itinerary or numeric transit claim adopted.
- APM Terminals inland connections: https://akamai.apmterminals.com/es/lazaro-cardenas/about/intermodal-connections — inland mode comparison; no service guarantee adopted.
- Manzanillo port authority: https://www.puertomanzanillo.com.mx/esps/0000206/guias-de-tramites-y-servicios.html

## Assets and scope limits
Existing Mexico 3 videos and UAE 2 videos retained unchanged. No visual gap for this informational module; no new social asset adopted. Future external material must be shortlisted for user selection before processing. Existing video provenance/order linkage is not expanded by this batch.
Other regional templates and old country content outside this module are not comprehensively rewritten. No fresh customs/tax advice added. No real inquiry submitted. Native-language commercial editorial review remains separate from automated checks.

## Validation evidence
See workspace outputs/freight-mexico-uae-20261027: build, static checks, browser layout, regressions, search-intent audit and screenshot. Build uses the same-day verified 47-article snapshot from prior batch, not a fresh CMS fetch. Generated CMS/sitemap files are excluded from code commit.

## Recovered legacy assets
The baseline was missing three Mexico videos and posters. Restored six byte-identical files from ddnz-site-aligned-preview-20260917/public/media/freight-20260919. Its docs/mexico-media-2026-09-19.md records user-provided clips and selection 5/1/3. No reprocessing or invented case linkage. Built and staged preview copies match SHA256.
