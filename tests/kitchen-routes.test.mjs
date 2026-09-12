import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalKitchenHash } from '../src/features/commercial-kitchen/routes.mjs';
test('previous kitchen catalogue and quote fragments keep reaching their replacement sections', () => {
  assert.equal(canonicalKitchenHash('#range'), '#commercial-kitchen-equipment');
  assert.equal(canonicalKitchenHash('#rfq'), '#commercial-kitchen-list');
  assert.equal(canonicalKitchenHash('#sourcing-list'), '#commercial-kitchen-list');
  assert.equal(canonicalKitchenHash('#equipment'), '#commercial-kitchen-equipment');
  assert.equal(canonicalKitchenHash('#commercial-kitchen-guide'), '#commercial-kitchen-guide');
  assert.equal(canonicalKitchenHash('#unknown'), '#unknown');
  assert.equal(canonicalKitchenHash(''), '');
});
