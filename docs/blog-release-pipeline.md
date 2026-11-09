# Blog release pipeline

Owner-approved flow revision, 2026-11-09. This changes release controls, not existing article prose, images or dates. Protected legacy screen-protector article remains excluded.

## Register the exact approved release

Before publishing a new article, add its canonical, original language, compiled release JSON, final JSON-LD file, Notion page ID, human reviewer, explicit publication/image-rights confirmations, expected cover/images/FAQ/list counts to `src/data/blog-release-manifest.json`. Existing publication IDs are grandfathered solely to avoid bulk audits; unknown new IDs fail the build until registered. Never add the protected legacy slug.

`fetch-notion.ts` checks registered inputs even when invoked directly. Both `npm run build` and `npm run build:preview` run `scripts/check_blog_release.py` after the entire website template is generated. It checks final schema equality, timezone dates, visible reviewer/FAQ/list rows, canonical/language, real local asset paths and exactly one display of every selected image including the site-template cover. Template output is archived. Missing or inconsistent output stops Pages upload. PR previews stage only registered approved release data; production still requires strict live Notion Published status.

The workspace uploader also requires a fresh complete-template report:

```sh
python3 scripts/blog_release.py attach-template <article-package> <website-checkout> <final-json-ld>
python3 scripts/blog_release.py publish <article-package> <final-json-ld> -- <existing-upload-command>
```

Both schema and rendered HTML hashes must remain current. Local drafts, Chinese internal previews and Google/Schema.org validator records retain their existing rules.

## First publication: one immutable timestamp

A new release is eligible only if explicitly approved/registered, absent from the verified pre-deploy sitemap and absent from `blog-publications.json`. Missing prior inventory fails closed. After a successful Pages action, record the actual completed_at from GitHub's deployment step, with seconds and timezone. Only the candidate's two release JSON files and the append-only publication registry may be updated; only that candidate's Notion Date is synchronized. Replays use the original receipt and never create a newer first-publication date. Existing registered records are not refreshed or rewritten.

The writer has repository contents write only in its isolated job. It never force-pushes or bypasses branch protections. A changed main/content revision halts with the original receipt preserved. A retry can resume idempotently after a successful commit or transient Notion failure. If branch policy rejects the push, resolve through the normal repository review process; do not weaken protection.

A one-time conditional rebuild and Pages deployment ship the reconciled metadata in the SAME workflow, using a separate artifact name and all release checks. The timestamp commit uses GITHUB_TOKEN and does not require a recursive push-triggered deployment. No repeated timestamp PRs or infinite loop. Substantive revision dates are preserved.

## Independent IndexNow notifications

`indexnow.yml` runs after a successful production workflow, with a separate concurrency group and read-only GitHub access. It consumes JSON artifacts only, runs trusted default-branch code, verifies the source workflow/repository/main branch/success status, and compares normalized page-content and local-image hashes with the last successfully notified checkpoint. JS/CSS bundle filename changes do not mark every page changed.

Only added or changed canonical URLs are submitted via bounded batch POST. Removed URLs are reported, not notified by this flow. The first run initializes a baseline with ZERO submissions; no default full-site push. A missing/expired historical checkpoint fails closed for explicit recovery. Failed requests do not advance the checkpoint. Older out-of-order runs cannot roll a newer checkpoint back. Retry a failed notification through workflow_dispatch with its successful production run ID; it does not redeploy the site. Optional approved Baidu notification also runs outside the production queue; its HTTP-endpoint approval remains unchanged.

Public URL tests still run in Google Rich Results Test and Schema.org Validator after the FINAL deployed metadata version. Archive actual errors/warnings and inspected dates, not a fabricated pass.

References: [GitHub workflow_run](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_run), [IndexNow batch API](https://www.indexnow.org/documentation), [Pages artifact names](https://github.com/actions/deploy-pages/blob/v4/action.yml).
