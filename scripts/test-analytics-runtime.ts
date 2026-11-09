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
assert.equal(isQuoteEntry('#buying-brief', overviewUrl), true);
assert.equal(isQuoteEntry('#lcl-quote-scope', overviewUrl), false);
assert.equal(isQuoteEntry('https://example.com/get-a-quote/', overviewUrl), false);
assert.equal(isQuoteEntry('/another-page/#audio-rfq', overviewUrl), false);
assert.equal(isQuoteEntry('/another-page/#buying-brief', overviewUrl), false);

// Exercise the actual global click handler with tracked and untracked anchors.
const { readFileSync } = await import('node:fs');
const { transpileModule } = await import('typescript');
const appSource = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const trackerStart = appSource.indexOf('const clickContexts =', appSource.indexOf('function GlobalConversionTracker()'));
const trackerEnd = appSource.indexOf("document.addEventListener('click', captureClick, true);", trackerStart);
assert.ok(trackerStart >= 0 && trackerEnd > trackerStart);
const compiledHandler = transpileModule(
  appSource.slice(trackerStart, trackerEnd) + '\nreturn { captureClick, handleClick };',
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
const testWindow = { location: { href: overviewUrl } };
const payloads: Array<{ params: Record<string, unknown>; source?: Record<string, unknown> }> = [];
const tracker = new Function('Element', 'HTMLAnchorElement', 'window', 'trackEvent',
  'readAttribution', 'isQuoteEntry', 'captureAnalyticsPageContext', compiledHandler)(TestElement, TestAnchor,
  testWindow, (name: string, params: Record<string, unknown>, source?: Record<string, unknown>) => {
    emitted.push(name);
    payloads.push({ params, source });
  }, () => ({}), isQuoteEntry, () => ({
    ...getSafeAnalyticsPageFields(testWindow.location.href),
    page_language: testWindow.location.href.includes('/fr/') ? 'fr' : 'en',
  }));
const clickHandler = tracker.handleClick;
const firstClick = { target: new TestAnchor('/screen-protectors/brief/') };
tracker.captureClick(firstClick);
testWindow.location.href = 'https://www.ddnzglobal.com/screen-protectors/brief/';
clickHandler(firstClick);
assert.deepEqual(emitted, ['quote_click']);
assert.equal(payloads.at(-1)?.source?.page_path, '/screen-protectors/');
testWindow.location.href = overviewUrl;
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

// A component may mark the anchor during its own handler, after capture.
emitted.length = 0;
const componentClick = { target: new TestAnchor('/get-a-quote/') };
tracker.captureClick(componentClick);
assert.equal(emitted.length, 0, 'Capture must never dispatch an event');
componentClick.target.dataset.analyticsTracked = 'true';
clickHandler(componentClick);
assert.equal(emitted.length, 0);

// Keyboard activation is still a click, and source language must survive routing.
const frenchUrl = 'https://www.ddnzglobal.com/fr/sourcing/mobile-accessories-from-china/?email=buyer%40example.com';
testWindow.location.href = frenchUrl;
const keyboardClick = { target: new TestAnchor('/get-a-quote/'), detail: 0 };
tracker.captureClick(keyboardClick);
testWindow.location.href = 'https://www.ddnzglobal.com/get-a-quote/';
clickHandler(keyboardClick);
assert.deepEqual(emitted, ['quote_click']);
assert.equal(payloads.at(-1)?.source?.page_language, 'fr');
assert.equal(payloads.at(-1)?.source?.page_path, '/fr/sourcing/mobile-accessories-from-china/');
assert.ok(!JSON.stringify(payloads.at(-1)).includes('buyer'));

// Classify same-page anchors against the captured URL even when it is longer
// than the analytics text limit, then preserve independent per-click snapshots.
emitted.length = 0;
testWindow.location.href = `https://www.ddnzglobal.com/blog/${'long-article-'.repeat(12)}/`;
const hashClick = { target: new TestAnchor('#audio-rfq') };
tracker.captureClick(hashClick);
testWindow.location.href = 'https://www.ddnzglobal.com/get-a-quote/';
clickHandler(hashClick);
assert.deepEqual(emitted, ['quote_click']);
assert.equal(payloads.at(-1)?.source?.page_path, new URL(`https://www.ddnzglobal.com/blog/${'long-article-'.repeat(12)}/`).pathname);

// Use the actual production payload builder and sender to verify that an old
// source snapshot wins over the current URL, while consent and sanitization
// still apply. Network/script loading is stubbed; nothing leaves this test.
const analyticsSource = readFileSync(new URL('../src/lib/analytics.ts', import.meta.url), 'utf8');
const contextCode = analyticsSource.slice(analyticsSource.indexOf('function getPageLanguage('), analyticsSource.indexOf('function ensureGtagQueue('));
const eventCode = analyticsSource.slice(analyticsSource.indexOf('export function captureAnalyticsPageContext('), analyticsSource.indexOf('export function trackPageView('));
const senderCode = transpileModule(
  contextCode + eventCode.replaceAll('export function', 'function') + '\nreturn { captureAnalyticsPageContext, trackEvent };',
  { compilerOptions: { target: 99 } },
).outputText;
for (const granted of [false, true]) {
  let disabled = false;
  const events: unknown[][] = [];
  const clarityEvents: unknown[][] = [];
  const browserWindow = {
    location: { href: frenchUrl },
    gtag: (...args: unknown[]) => events.push(args),
    clarity: (...args: unknown[]) => clarityEvents.push(args),
  };
  const sender = new Function('window', 'document', 'getSafeAnalyticsPageFields', 'sanitizeAnalyticsParams',
    'readAttribution', 'isAnalyticsDisabled', 'ensureGoogleAnalytics', 'analyticsConsentGranted', senderCode)(
    browserWindow, { title: 'Accessoires pour téléphones' }, getSafeAnalyticsPageFields, sanitizeAnalyticsParams,
    () => ({}), () => disabled, () => {}, granted,
  );
  const snapshot = sender.captureAnalyticsPageContext();
  browserWindow.location.href = 'https://www.ddnzglobal.com/get-a-quote/?message=private';
  sender.trackEvent('quote_click', { cta_location: 'mobile-accessories-request', email: 'buyer@example.com' }, snapshot);
  assert.equal(events.length, 1);
  const eventParams = events[0][2] as Record<string, unknown>;
  assert.equal(eventParams.page_path, '/fr/sourcing/mobile-accessories-from-china/');
  assert.equal(eventParams.page_location, 'https://www.ddnzglobal.com/fr/sourcing/mobile-accessories-from-china/');
  assert.equal(eventParams.page_language, 'fr');
  assert.equal(eventParams.page_title, 'Accessoires pour téléphones');
  assert.equal(eventParams.consent_state, granted ? 'granted' : 'denied');
  assert.equal(clarityEvents.length, granted ? 1 : 0);
  assert.ok(!JSON.stringify(eventParams).includes('buyer'));
  assert.ok(!JSON.stringify(eventParams).includes('private'));
  disabled = true;
  sender.trackEvent('quote_click', {}, snapshot);
  assert.equal(events.length, 1, 'Local/test opt-out must still suppress dispatch');
}
console.log('Navigation source, language, keyboard click, late dedup and consent/privacy regression checks passed.');
