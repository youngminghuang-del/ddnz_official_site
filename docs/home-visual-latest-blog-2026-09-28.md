# Homepage visual and latest-blog selection — 2026-09-28

Two homepage changes requested through browser comments:

1. Add a sourcing-to-freight visual to the One Team section. The new conceptual image connects product samples, warehouse consolidation and a container port in one deep-blue scene. The responsive WebP files are about 160 KB and 56 KB, with lazy loading, explicit dimensions and localized alt text. Original section copy, headings and service links are retained.
2. Make the large Insights card show the newest published blog. Publication date now determines the order across languages; the current page language only resolves equal-date ties. Remaining cards follow the same order. Existing language badges and canonical article links remain. Legacy records without status retain the site's existing published-snapshot behavior; explicitly unpublished records are excluded. Editing an old article does not promote it above a newer publication.

The homepage static renderer now includes the same Insights component, so latest article links are available before JavaScript. Both changes apply through the shared component to all eight homepage languages. Future updates follow the existing Notion-to-site synchronization: successful publication builds, the existing dispatch trigger, or the scheduled daily build. This is not a live Notion query on every visitor request.

Validation: type-check, eight focused tests (including two publication-order regressions), complete preview build, static homepage discovery guard, SEO/deployment audits and search-intent audit. Browser verification covers desktop/mobile and no-JavaScript rendering. The current deployed CMS snapshot places the 2026-09-28 Spanish kitchen inspection article first on the English homepage.

Generated asset provenance: built-in image_gen, original filename `exec-f612509a-ddc0-441d-9480-dba97b62feb7.png`; prompt and original retained at `output/imagegen/one-team/生成记录.md` and `output/imagegen/one-team/source-to-destination-v1.png` in the local project. Only the two production WebP sizes are committed. The image is conceptual brand artwork, not a photograph of an identified company facility.

Rollback: revert this PR's merge commit and redeploy. Keep previous PR #43 purchase-entry changes and PR #42 title experiment.
