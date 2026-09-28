import test from 'node:test';
import assert from 'node:assert/strict';
import { latestHomepagePosts } from '../src/lib/homepageArticles';

test('latest publication leads even when an older article matches the page language', () => {
  const posts = [
    { id: 'en-old', date: '2026-09-24', language: 'en', lastEdited: '2026-09-29' },
    { id: 'es-new', date: '2026-09-28', language: 'es' },
    { id: 'ar-middle', date: '2026-09-26', language: 'ar' },
  ];
  assert.deepEqual(latestHomepagePosts(posts, 'en').map(p=>p.id), ['es-new','ar-middle','en-old']);
  assert.equal(posts[0].id, 'en-old', 'shared CMS array is not reordered');
});
test('same-date language preference, publication status and card limit are respected', () => {
  const posts = [
    { id: 'draft', date: '2026-10-01', language: 'en', status: 'Draft' },
    { id: 'archived', date: '2026-09-30', language: 'en', status: 'Archived' },
    { id: 'es', date: '2026-09-28', language: 'es', status: 'Published' },
    { id: 'en', date: '2026-09-28', language: 'en', status: 'Published' },
    { id: 'legacy', date: '2026-09-27', language: 'en' },
    { id: 'invalid', date: 'unknown', language: 'en' },
  ];
  assert.deepEqual(latestHomepagePosts(posts, 'en', 3).map(p=>p.id), ['en','es','legacy']);
  assert.deepEqual(latestHomepagePosts(posts, 'es', 2).map(p=>p.id), ['es','en']);
  assert.deepEqual(latestHomepagePosts([], 'en'), []);
});
