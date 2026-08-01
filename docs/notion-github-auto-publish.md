# Notion → GitHub Pages automatic publishing

The production website is rebuilt from Notion; generated article JSON does not need to be committed after every editorial change.

## Required GitHub settings

1. In **Settings → Secrets and variables → Actions**, add:
   - `NOTION_API_KEY`
   - `NOTION_DATABASE_ID`
2. In **Settings → Pages**, select **GitHub Actions** as the deployment source.
3. Keep `.github/workflows/deploy.yml` on the repository's default `main` branch. Scheduled workflows only run from the default branch.

## Triggers

- Every push to `main`.
- Every day at **21:00 Asia/Shanghai** (`13:00 UTC`).
- Manual **Run workflow** from the Actions page.
- Immediate `repository_dispatch` with event type `notion-content-published`.

An immediate dispatch can be sent by a trusted integration:

```http
POST /repos/youngminghuang-del/ddnz_official_site/dispatches
Authorization: Bearer <fine-grained GitHub token>
Accept: application/vnd.github+json
Content-Type: application/json

{"event_type":"notion-content-published"}
```

The token only needs permission to trigger repository workflows. Never store the GitHub token inside a public Notion page.

## Safety behavior

- Only Notion pages whose `Status` is `Published` are compiled.
- `STRICT_NOTION_SYNC=true` makes the build fail if Notion is unavailable; GitHub Pages keeps the previous successful deployment.
- Concurrent production deployments are queued instead of cancelling a deployment midway.
- Each run keeps a 14-day audit artifact containing the compiled Notion article data, redirects and sitemap.
- A successful deployment verifies that the production sitemap is reachable.

## Editorial sequence

1. Preview the article in the local Content Ops dashboard.
2. Complete the human Domain Review.
3. Use the local `Published` control.
4. Either wait for the 21:00 scheduled sync or trigger `notion-content-published` for an immediate build.
5. Inspect the GitHub Actions run and the production page.
