## Deployed security-header audit

- URL: https://www.ddnzglobal.com/
- HTTP status: 200
- Passed: 6/6

| Header | Result | Observed value / action |
| --- | --- | --- |
| strict-transport-security | PASS | max-age=86400 |
| content-security-policy | PASS | script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.clarity.ms https://static.cloudflareinsights.com https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; frame-ancestors 'self' |
| x-content-type-options | PASS | nosniff |
| referrer-policy | PASS | strict-origin-when-cross-origin |
| permissions-policy | PASS | camera=(), microphone=(), geolocation=() |
| frame protection | PASS | frame-ancestors 'self' |

