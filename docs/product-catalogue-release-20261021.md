# 2026-10-21 manufacturing identity and catalogue release

DDNZ is presented consistently as a manufacturer and exporter, with OEM/ODM and wholesale product enquiries as its primary buyer path. Home and About now carry this positioning in all eight supported languages. The shared wordmark uses MANUFACTURING & EXPORT, while freight pages retain Heaven Born execution details and freight enquiries.

Four product catalogues cover eight languages each: home storage (3 series / 11 configurations), electric bicycles (6 models), portable power stations (5 models), and electric scooters (10 models). Model images, details, filters, galleries and enquiry context remain specific to each product. Product directory navigation groups energy/outdoor equipment and electric mobility; buyer guides link from the corresponding product range instead of duplicate homepage cards. Existing URLs remain unchanged.

Previously reviewed freight work in this integration includes the Bangladesh/Pakistan/Ghana/India used-goods container correction to 45HC, route planning depth and Brazil visual alignment. It does not assert unsupported service availability or guaranteed delivery times.

## Baseline and preservation
- Rebased onto main 05464da (Cairo article images and schema, PR76).
- Preserves PR75 Spanish storage schema and all Cairo article assets/schema.
- Latest Notion snapshot from run39530306968: 43 articles and 14 redirects. All current production sitemap URLs preserved.
- Source PDFs and internal parameter ledgers are not published. 25 PDFs adopted, 5 deferred and 20 unfinished; 49 parameter questions remain. Translation completion does not imply all product evidence is confirmed.

## Validation
- TypeScript and complete 340-test suite passed after integration.
- build:preview: 816 HTML, 795 sitemap routes, 88 core SSR pages, zero audit failures.
- Home/About 16-page canonical, hreflang, visible FAQ and JSON-LD checks passed.
- Prior six-language 390/1440 viewport checks, Arabic RTL, galleries and enquiry handoffs passed; final shared-brand mobile check passed.
- Freight and market regression plus search-intent audit run again. Existing review items remain separate from release failures.
- No live customer enquiry was submitted during testing.

Deployment and live verification evidence must be recorded after the actual release.
