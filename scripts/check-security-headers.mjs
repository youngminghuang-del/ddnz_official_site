const targetUrl = process.argv[2] || 'https://www.ddnzglobal.com/';

const checks = [
  ['strict-transport-security', (value) => /max-age=\d+/i.test(value), 'Enable HSTS with a long max-age after confirming every subdomain supports HTTPS.'],
  ['content-security-policy', (value) => /default-src|script-src/i.test(value), 'Define an allowlisted CSP at the Cloudflare edge and test every form, analytics and media integration.'],
  ['x-content-type-options', (value) => value.toLowerCase() === 'nosniff', 'Set X-Content-Type-Options: nosniff.'],
  ['referrer-policy', (value) => value.length > 0, 'Set Referrer-Policy: strict-origin-when-cross-origin.'],
  ['permissions-policy', (value) => value.length > 0, 'Disable unused browser capabilities with Permissions-Policy.'],
];

async function fetchWithRetry(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(20_000),
      });
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1_500));
      }
    }
  }
  throw new Error(`Could not inspect ${url} after ${attempts} attempts: ${lastError?.message || 'network error'}`);
}

const response = await fetchWithRetry(targetUrl);
const results = checks.map(([header, validate, remediation]) => {
  const value = response.headers.get(header) || '';
  return { header, value, passed: validate(value), remediation };
});
const frameProtection = Boolean(response.headers.get('x-frame-options')) ||
  /frame-ancestors/i.test(response.headers.get('content-security-policy') || '');
results.push({
  header: 'frame protection',
  value: response.headers.get('x-frame-options') || 'No X-Frame-Options or CSP frame-ancestors directive',
  passed: frameProtection,
  remediation: 'Set CSP frame-ancestors (preferred) or X-Frame-Options.',
});

const passedCount = results.filter((result) => result.passed).length;
const summary = [
  '## Deployed security-header audit',
  '',
  `- URL: ${targetUrl}`,
  `- HTTP status: ${response.status}`,
  `- Passed: ${passedCount}/${results.length}`,
  '',
  '| Header | Result | Observed value / action |',
  '| --- | --- | --- |',
  ...results.map((result) => `| ${result.header} | ${result.passed ? 'PASS' : 'MISSING'} | ${(result.value || result.remediation).replace(/\|/g, '\\|')} |`),
  '',
];

console.log(summary.join('\n'));
if (process.env.GITHUB_STEP_SUMMARY) {
  const { appendFile } = await import('node:fs/promises');
  await appendFile(process.env.GITHUB_STEP_SUMMARY, summary.join('\n'));
}

if (passedCount !== results.length) process.exitCode = 1;
