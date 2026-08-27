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
