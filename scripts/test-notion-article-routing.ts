import assert from 'node:assert/strict';
import notionBlogPosts from '../src/data/notionBlogData.json' with { type: 'json' };
import {
  articleAbsoluteUrl,
  articleLanguageSwitchPath,
  articleRoutePath,
  canonicalSitePath,
  canonicalSiteUrl,
  findArticleByRoute,
  getArticleHreflangSet,
  localizedSitePath,
  normalizeArticleLocale,
  type NotionArticleRoute,
} from '../src/lib/notionArticleRouting';

const failures: string[] = [];

async function check(name: string, run: () => void | Promise<void>) {
  try {
    await run();
    console.log(`PASS ${name}`);
  } catch (error) {
    failures.push(`${name}: ${error instanceof Error ? error.message : String(error)}`);
    console.error(`FAIL ${name}`);
  }
}

const translatedPosts: NotionArticleRoute[] = [
  {
    id: 'en-id',
    slug: 'shared-guide',
    language: 'en-US',
    translationGroup: 'Buyer Guide 01',
    status: 'Published',
  },
  {
    id: 'zh-id',
    slug: 'shared-guide',
    language: 'zh-CN',
    translationGroup: ' buyer guide 01 ',
    status: 'Published',
  },
  {
    id: 'es-id',
    slug: 'guia-comprador',
    language: 'ES_es',
    translationGroup: 'BUYER GUIDE 01',
    status: 'Published',
  },
  {
    id: 'draft-fr-id',
    slug: 'guide-acheteur',
    language: 'fr',
    translationGroup: 'Buyer Guide 01',
    status: 'Draft',
  },
];

await check('normalizes Notion language variants to site locale paths', () => {
  assert.equal(normalizeArticleLocale('zh-CN'), 'zh-cn');
  assert.equal(normalizeArticleLocale('zh_CN'), 'zh-cn');
  assert.equal(normalizeArticleLocale('zh'), 'zh-cn');
  assert.equal(normalizeArticleLocale('EN-us'), 'en');
  assert.equal(normalizeArticleLocale('es_ES'), 'es');
  assert.equal(localizedSitePath('zh-CN', 'blog/example'), '/zh-cn/blog/example/');
  assert.equal(localizedSitePath('en-US', 'blog/example'), '/blog/example/');
  assert.equal(canonicalSitePath('/fr/get-a-quote?source=test#brief'), '/fr/get-a-quote/?source=test#brief');
  assert.equal(canonicalSiteUrl('/ru/insights?preview=1'), 'https://www.ddnzglobal.com/ru/insights/');
});

await check('resolves the same slug by route locale instead of first match', () => {
  assert.equal(findArticleByRoute(translatedPosts, 'en', 'shared-guide')?.id, 'en-id');
  assert.equal(findArticleByRoute(translatedPosts, 'zh', 'shared-guide')?.id, 'zh-id');
  assert.equal(findArticleByRoute(translatedPosts, 'zh-CN', 'zh-id')?.id, 'zh-id');
  assert.equal(findArticleByRoute(translatedPosts, 'fr', 'shared-guide'), undefined);
});

await check('builds the same complete reciprocal hreflang set for every Published translation', () => {
  const expected = [
    { hrefLang: 'en', href: 'https://www.ddnzglobal.com/blog/shared-guide/' },
    { hrefLang: 'zh-cn', href: 'https://www.ddnzglobal.com/zh-cn/blog/shared-guide/' },
    { hrefLang: 'es', href: 'https://www.ddnzglobal.com/es/blog/guia-comprador/' },
  ];
  const englishSet = getArticleHreflangSet(translatedPosts[0], translatedPosts);
  const chineseSet = getArticleHreflangSet(translatedPosts[1], translatedPosts);
  const spanishSet = getArticleHreflangSet(translatedPosts[2], translatedPosts);
  assert.deepEqual(englishSet.alternates, expected);
  assert.deepEqual(chineseSet.alternates, expected);
  assert.deepEqual(spanishSet.alternates, expected);
  assert.equal(englishSet.xDefaultUrl, expected[0].href);
  assert.equal(chineseSet.xDefaultUrl, expected[0].href);
  assert.equal(spanishSet.xDefaultUrl, expected[0].href);
});

await check('keeps an ungrouped article on self plus x-default only', () => {
  const standalone: NotionArticleRoute = {
    id: 'ar-id',
    slug: 'standalone-arabic',
    language: 'ar-SA',
    status: 'Published',
  };
  const set = getArticleHreflangSet(standalone, [...translatedPosts, standalone]);
  const url = 'https://www.ddnzglobal.com/ar/blog/standalone-arabic/';
  assert.deepEqual(set.alternates, [{ hrefLang: 'ar', href: url }]);
  assert.equal(set.xDefaultUrl, url);
  assert.equal(
    articleLanguageSwitchPath(standalone, [...translatedPosts, standalone], 'fr'),
    '/fr/insights/',
  );
});

await check('switches to a real translated route and never invents a missing article URL', () => {
  assert.equal(
    articleLanguageSwitchPath(translatedPosts[0], translatedPosts, 'zh-CN'),
    '/zh-cn/blog/shared-guide/',
  );
  assert.equal(
    articleLanguageSwitchPath(translatedPosts[0], translatedPosts, 'fr'),
    '/fr/insights/',
  );
});

await check('current 21-article snapshot produces no invented translation alternates', () => {
  assert.ok(notionBlogPosts.length >= 21, 'the current 21-article baseline must not shrink unexpectedly');
  for (const post of notionBlogPosts) {
    const set = getArticleHreflangSet(post, notionBlogPosts);
    assert.equal(set.alternates.length, 1, `${post.slug || post.id} must remain self-only`);
    assert.equal(set.alternates[0].href, articleAbsoluteUrl(post));
    assert.equal(articleRoutePath(post).startsWith('//'), false);
  }
});

if (failures.length) {
  throw new Error(`Notion article routing tests failed:\n- ${failures.join('\n- ')}`);
}

console.log(`Validated locale routing and hreflang behavior against ${notionBlogPosts.length} current articles.`);
