import assert from 'node:assert/strict';
import {
  isLocalAnalyticsHostname,
  resolveAnalyticsTestMode,
} from '../src/lib/analyticsPolicy';

assert.deepEqual(resolveAnalyticsTestMode({ search: '?ddnz_test=1', sessionDisabled: false }), {
  disabled: true,
  persistSessionDisabled: true,
});

assert.deepEqual(resolveAnalyticsTestMode({ search: '', sessionDisabled: true }), {
  disabled: true,
  persistSessionDisabled: true,
});

assert.deepEqual(resolveAnalyticsTestMode({ search: '?ddnz_test=0', sessionDisabled: true }), {
  disabled: false,
  persistSessionDisabled: false,
});

assert.deepEqual(
  resolveAnalyticsTestMode({
    search: '?utm_campaign=codex_validation_lighthouse',
    sessionDisabled: false,
  }),
  { disabled: true, persistSessionDisabled: true },
);

assert.deepEqual(resolveAnalyticsTestMode({ search: '?utm_campaign=launch_pt', sessionDisabled: false }), {
  disabled: false,
  persistSessionDisabled: false,
});

assert.equal(isLocalAnalyticsHostname('localhost'), true);
assert.equal(isLocalAnalyticsHostname('preview.local'), true);
assert.equal(isLocalAnalyticsHostname('www.ddnzglobal.com'), false);

console.log('Analytics collection policy tests passed.');
