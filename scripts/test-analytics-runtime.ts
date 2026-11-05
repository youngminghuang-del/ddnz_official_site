import assert from 'node:assert/strict';
import {
  getSafeAnalyticsPageFields,
  sanitizeAnalyticsParams,
  sanitizeAnalyticsText,
} from '../src/lib/analyticsPayload';
import { createGtagCommandQueue } from '../src/lib/gtagQueue';

const dataLayer: unknown[] = [];
const gtag = createGtagCommandQueue(dataLayer);

gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
});
gtag('consent', 'update', { analytics_storage: 'granted' });
gtag('event', 'page_view', { page_path: '/services' });

assert.equal(dataLayer.length, 3);
assert.ok(dataLayer.every((entry) => Object.prototype.toString.call(entry) === '[object Arguments]'));
assert.deepEqual(Array.from(dataLayer[0] as IArguments), [
  'consent',
  'default',
  { analytics_storage: 'denied', ad_storage: 'denied' },
]);
assert.deepEqual(Array.from(dataLayer[1] as IArguments), [
  'consent',
  'update',
  { analytics_storage: 'granted' },
]);

const sanitized = sanitizeAnalyticsParams({
  service: 'ocean-freight',
  email: 'buyer@example.com',
  message: 'Please call me',
  campaign: 'buyer@example.com',
  phone_like_value: '+86 138 0013 8000',
  count: 2,
  active: true,
  oversized: 'x'.repeat(200),
});

assert.deepEqual(sanitized, {
  service: 'ocean-freight',
  count: 2,
  active: true,
  oversized: 'x'.repeat(120),
});
assert.equal(sanitizeAnalyticsText('buyer@example.com'), undefined);
assert.equal(sanitizeAnalyticsText('+86 138 0013 8000'), undefined);
assert.deepEqual(
  getSafeAnalyticsPageFields('https://www.ddnzglobal.com/services?email=buyer%40example.com#quote'),
  {
    page_location: 'https://www.ddnzglobal.com/services',
    page_path: '/services',
  },
);

console.log('Analytics runtime and payload safeguards passed.');

// Purchase entry classification must exclude unrelated and external links.
const { isQuoteEntry } = await import('../src/lib/quoteEntry');
const overviewUrl = 'https://www.ddnzglobal.com/screen-protectors/';
assert.equal(isQuoteEntry('/screen-protectors/brief/', overviewUrl), true);
assert.equal(isQuoteEntry('/fr/get-a-quote/?source=audio', overviewUrl), true);
assert.equal(isQuoteEntry('#audio-rfq', overviewUrl), true);
assert.equal(isQuoteEntry('#lcl-quote-scope', overviewUrl), false);
assert.equal(isQuoteEntry('https://example.com/get-a-quote/', overviewUrl), false);
assert.equal(isQuoteEntry('/another-page/#audio-rfq', overviewUrl), false);

// Exercise the actual global click handler with tracked and untracked anchors.
const { readFileSync } = await import('node:fs');
const { transpileModule } = await import('typescript');
const appSource = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const handlerSource = appSource.split('const handleClick = (event: MouseEvent) => {')[1]
  .split("document.addEventListener('click', handleClick);")[0];
const compiledHandler = transpileModule(
  'const handleClick = (event: MouseEvent) => {' + handlerSource + '\nreturn handleClick;',
  { compilerOptions: { target: 99 } },
).outputText;
class TestElement {
  dataset: Record<string, string> = {};
  id = '';
  closest(selector: string) { return selector === 'a, button' ? this : null; }
}
class TestAnchor extends TestElement {
  constructor(private href: string, tracked = false) {
    super();
    if (tracked) this.dataset.analyticsTracked = 'true';
  }
  getAttribute(name: string) { return name === 'href' ? this.href : null; }
}
const emitted: string[] = [];
const clickHandler = new Function('Element', 'HTMLAnchorElement', 'window', 'trackEvent',
  'readAttribution', 'isQuoteEntry', compiledHandler)(TestElement, TestAnchor,
  { location: { href: overviewUrl } }, (name: string) => emitted.push(name), () => ({}), isQuoteEntry);
clickHandler({ target: new TestAnchor('/screen-protectors/brief/') });
assert.deepEqual(emitted, ['quote_click']);
emitted.length = 0;
// A component has already emitted its own quote event before bubbling.
emitted.push('quote_click');
clickHandler({ target: new TestAnchor('/get-a-quote/', true) });
assert.deepEqual(emitted, ['quote_click']);
emitted.length = 0;
clickHandler({ target: new TestAnchor('/get-a-quote/', true) });
assert.equal(emitted.length, 0);
clickHandler({ target: new TestAnchor('#audio-rfq') });
assert.deepEqual(emitted, ['quote_click']);
emitted.length = 0;
clickHandler({ target: new TestAnchor('https://example.com/get-a-quote/') });
assert.equal(emitted.length, 0);
console.log('Actual global purchase click handler deduplication passed.');
