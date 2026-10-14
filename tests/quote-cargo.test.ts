import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cargoMeasurement, isValidCargoMeasurement } from '../src/lib/quoteCargo';

test('unknown measurements are explicit and never silently become sample cargo', () => {
  assert.deepEqual(cargoMeasurement('', 'KG'), { value: 'Unknown — awaiting cargo details', status: 'unknown' });
  assert.equal(cargoMeasurement('  ', 'CBM').status, 'unknown');
});
test('customer estimates retain existing receiver field units including decimals', () => {
  assert.deepEqual(cargoMeasurement('350.5', 'KG'), { value: '350.5 KG', status: 'customer_estimate' });
  assert.equal(cargoMeasurement('2.5', 'CBM').value, '2.5 CBM');
  assert.equal(cargoMeasurement('0.02', 'KG').value, '0.02 KG');
});
test('zero, negative and non-finite inputs cannot become positive estimates or unknown', () => {
  for (const value of ['0', '-1', 'Infinity', 'NaN', 'e', '1e999', '1,2']) {
    assert.equal(isValidCargoMeasurement(value), false, value);
    assert.throws(() => cargoMeasurement(value, 'KG'));
  }
});
