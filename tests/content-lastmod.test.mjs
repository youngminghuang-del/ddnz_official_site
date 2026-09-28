import test from 'node:test';
import assert from 'node:assert/strict';
import { applyContentLastmod } from '../scripts/lib/content-lastmod.mjs';
const node = (path, extra = '') => `<url><loc>https://www.ddnzglobal.com${path}</loc>${extra}<priority>0.8</priority></url>`;
test('dates only reviewed pages, preserves unrelated nodes and is repeatable', () => {
  const untouched = node('/fr/', '<lastmod>2026-08-01</lastmod><xhtml:link href="/"/>');
  const xml = `<urlset>${node('/screen-protectors/')}${untouched}</urlset>`;
  const ledger = {'/screen-protectors/': '2026-09-28'};
  const result = applyContentLastmod(xml, ledger);
  assert.equal(result, xml.replace('</loc>', '</loc><lastmod>2026-09-28</lastmod>'));
  assert.ok(result.includes(untouched));
  assert.equal(applyContentLastmod(result, ledger), result);
});
test('updates stale dates without backdating later CMS changes', () => {
  const xml = node('/a/', '<lastmod>2026-09-01</lastmod>') + node('/b/', '<lastmod>2026-10-01T12:30:00Z</lastmod>');
  assert.equal(applyContentLastmod(xml, {'/a/':'2026-09-28','/b/':'2026-09-28'}), xml.replace('2026-09-01', '2026-09-28'));
});
test('rejects missing routes, duplicate routes and invalid calendar dates', () => {
  assert.throws(() => applyContentLastmod(node('/a/'), {'/b/':'2026-09-28'}), /absent/);
  assert.throws(() => applyContentLastmod(node('/a/')+node('/a/'), {'/a/':'2026-09-28'}), /Duplicate/);
  assert.throws(() => applyContentLastmod(node('/a/'), {'/a/':'2026-02-30'}), /Invalid/);
});
