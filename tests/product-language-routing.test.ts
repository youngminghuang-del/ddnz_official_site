import test from 'node:test';
import assert from 'node:assert/strict';
import {
  englishProductPaths, englishProductRedirect, isEnglishProductPath, isNavigationLanguage,
  navigationPath, navigationPrefixes, navigationState, resolveNavigationLanguage, routeHashId,
  routeScrollAction, scrollPositionKey, splitNavigationPath, supportedNavigationLanguages,
} from '../src/lib/productLanguageRouting.ts';
import type { Language } from '../src/i18n/translations.ts';

const languages = Object.keys(navigationPrefixes) as Language[];

test('all eight navigation languages use only authored product URLs', () => {
  const translated = new Set(['/portable-power/selection-guide', '/sourcing/outdoor-products-from-china', '/sourcing/mobile-accessories-from-china', '/phone-cases', '/phone-cases/materials-and-pricing', '/phone-straps-charms', '/sourcing/commercial-kitchen-equipment-from-china', '/screen-protectors', '/screen-protectors/compare', '/sourcing/kitchen-equipment-for-distributors', '/sourcing/restaurant-project-equipment', '/screen-protectors/wholesale-for-stores', '/screen-protectors/private-label']);
  for (const language of languages) {
    for (const path of englishProductPaths) {
      const target = `${path==='/screen-protectors/brief'?'':navigationPrefixes[language]}${path}/`;
      assert.equal(navigationPath(path, language), target);
      assert.equal(navigationPath(`${navigationPrefixes[language]}${path}/?utm_source=guide#details`, language), `${target}?utm_source=guide#details`);
    }
    assert.equal(navigationPath('/', language), `${navigationPrefixes[language]}/`);
    assert.equal(navigationPath('/get-a-quote?industry=Mobile%20Accessories#form', language), `${navigationPrefixes[language]}/get-a-quote/?industry=Mobile%20Accessories#form`);
  }
});

test('language menus only offer authored destinations for freight pages', () => {
  assert.deepEqual(supportedNavigationLanguages('/shipping-from-china-to-kazakhstan/'), languages);
  assert.deepEqual(supportedNavigationLanguages('/ru/shipping-from-china-to-middle-east/'), languages);
  assert.deepEqual(supportedNavigationLanguages('/shipping-from-china-to-central-asia/'), languages);
  assert.deepEqual(supportedNavigationLanguages('/fr/services/air-freight/'), languages);
  assert.deepEqual(supportedNavigationLanguages('/services/sea-freight/'), languages);
  assert.deepEqual(supportedNavigationLanguages('/tr/services/lcl-shipping-from-china/'), languages);
  assert.deepEqual(supportedNavigationLanguages('/pt/how-we-work/'), languages);
  assert.equal(navigationPath('/shipping-from-china-to-kazakhstan/', 'pt'), '/pt/shipping-from-china-to-kazakhstan/');
  assert.equal(navigationPath('/tr/services/air-freight/', 'tr'), '/tr/services/air-freight/');
  assert.equal(navigationPath('/services/sea-freight/', 'pt'), '/pt/services/sea-freight/');
});

test('direct locale prefixes override stored and historical preferences on complete path segments', () => {
  for (const language of languages.filter(language => language !== 'en')) {
    for (const path of ['', '/products/', '/screen-protectors/compare/']) {
      assert.equal(resolveNavigationLanguage(`${navigationPrefixes[language]}${path}`, 'en', { navigationLanguage: 'fr' }), language);
    }
  }
  for (const path of ['/fridge', '/arabic', '/products-new', '/screen-protectors-archive', '/screen-protectors/missing', '/sourcing/missing', '/sourcing-services/supplier-search']) {
    assert.equal(isEnglishProductPath(path), false, path);
    assert.equal(resolveNavigationLanguage(path, 'ar'), 'en', path);
  }
  assert.deepEqual(splitNavigationPath('/zh-cn/products/?source=x#guide'), { pathname: '/products', suffix: '?source=x#guide', locale: 'zh' });
});

test('legacy aliases reach the available translation with query/hash and requested locale intact', () => {
  for (const language of languages) {
    const prefix = navigationPrefixes[language];
    for (const [alias, target] of [
      ['/mobile-accessories', '/sourcing/mobile-accessories-from-china'],
      ['/commercial-kitchen', '/sourcing/commercial-kitchen-equipment-from-china'],
      ['/audio-speakers', '/sourcing/audio-speakers-from-china','/refrigeration-equipment'],
      ['/outdoor-products', '/sourcing/outdoor-products-from-china'],
      ['/screen-protectors/brief', '/screen-protectors/brief'],
      ['/products', '/products'],
    ]) {
      const redirect = englishProductRedirect(`${prefix}${alias}/?utm_source=menu#guide`, language, { unrelated: 42 });
      const translatedPrefix = ['/products','/audio-speakers'].includes(alias) ? prefix : ['/commercial-kitchen','/mobile-accessories','/outdoor-products'].includes(alias) ? prefix : '';
      assert.equal(redirect?.to, `${translatedPrefix}${target}/?utm_source=menu#guide`);
      assert.deepEqual(redirect?.state, { unrelated: 42, navigationLanguage: language });
      assert.equal(resolveNavigationLanguage(redirect!.to, 'en', redirect!.state), ['/commercial-kitchen','/mobile-accessories','/outdoor-products'].includes(alias) && !translatedPrefix ? 'en' : language);
    }
  }
  assert.equal(englishProductRedirect('/ar/nonexistent', 'ar'), undefined);
});

test('SPA, reload and native product arrivals preserve preference; explicit English home resets it', () => {
  let stored: Language = resolveNavigationLanguage('/ar/', 'es');
  assert.equal(stored, 'ar');
  const product = navigationPath('/screen-protectors/videos', stored);
  assert.equal(resolveNavigationLanguage(product, stored), 'ar'); // native anchor / new tab
  const history = navigationState(null, stored);
  stored = 'es'; // explicit product language switch
  const switched = navigationState(history, stored);
  assert.equal(resolveNavigationLanguage(product, stored, switched), 'ar'); // authored URL wins over stale navigation state
  assert.equal(resolveNavigationLanguage(navigationPath(product, stored), stored, switched), 'es'); // refresh after switching URL
  assert.equal(navigationPath('/', stored), '/es/');
  assert.equal(navigationPath('/get-a-quote', stored), '/es/get-a-quote/');
  stored = resolveNavigationLanguage('/', stored, switched);
  assert.equal(stored, 'en');
  assert.equal(resolveNavigationLanguage(navigationPath(product, stored), stored), 'en'); // fresh product visit after EN home
  assert.equal(resolveNavigationLanguage(product, stored, history), 'ar'); // Back restores that entry
  assert.equal(resolveNavigationLanguage('/es/', stored, history), 'es'); // direct prefix still wins
});

test('authored language URLs take precedence over stale preferences and return to the matching English page', () => {
  for (const path of ['/sourcing/outdoor-products-from-china/', '/sourcing/commercial-kitchen-equipment-from-china/', '/screen-protectors/', '/screen-protectors/compare/', '/sourcing/kitchen-equipment-for-distributors/', '/sourcing/restaurant-project-equipment/', '/screen-protectors/wholesale-for-stores/', '/screen-protectors/private-label/']) {
    assert.equal(resolveNavigationLanguage(path, 'ar', { navigationLanguage: 'ar' }), 'en');
  }
  assert.equal(isEnglishProductPath('/sourcing/restaurant-kitchen-packages-from-china/'), true);
  assert.equal(resolveNavigationLanguage('/sourcing/restaurant-kitchen-packages-from-china/', 'ar', { navigationLanguage: 'ar' }), 'en');
  assert.equal(isEnglishProductPath('/ar/screen-protectors/compare/'), false);
  assert.equal(isEnglishProductPath('/ar/screen-protectors/videos/'), false);
  assert.equal(resolveNavigationLanguage('/es/screen-protectors/compare/', 'ar', { navigationLanguage: 'ar' }), 'es');
  assert.equal(navigationPath('/es/screen-protectors/compare/?model=001#quote', 'en'), '/screen-protectors/compare/?model=001#quote');
  assert.equal(navigationPath('/screen-protectors/videos/#cutting', 'ar'), '/ar/screen-protectors/videos/#cutting');
  assert.equal(navigationPath('/ar/screen-protectors/private-label/', 'fr'), '/fr/screen-protectors/private-label/');
  assert.equal(routeScrollAction({ pathname: '/ar/screen-protectors/compare/', hash: '', navigationType: 'PUSH', hasSavedPosition: false }), 'top');
  for (const pathname of ['/screen-protectors/wholesale-for-stores/', '/screen-protectors/private-label/']) {
    assert.equal(routeScrollAction({ pathname, hash: '', navigationType: 'PUSH', hasSavedPosition: false }), 'top');
    assert.equal(routeScrollAction({ pathname, hash: '#buyer-brief', navigationType: 'PUSH', hasSavedPosition: false }), 'hash');
  }
});

test('malformed stored state cannot select a bogus locale or poison internal URLs', () => {
  for (const value of ['de', 'constructor', '__proto__', null, {}, 1]) {
    assert.equal(isNavigationLanguage(value), false);
    assert.equal(resolveNavigationLanguage('/products', 'tr', { navigationLanguage: value }), 'en');
  }
  assert.deepEqual(navigationState('not-an-object', 'pt'), { navigationLanguage: 'pt' });
  assert.equal(navigationPath('/es/how-we-work/?source=nav#steps', 'ar'), '/ar/how-we-work/?source=nav#steps');
});

test('normal navigation starts at top, respects hashes and leaves same-page state untouched', () => {
  const base = { pathname: '/products/', previousPathname: '/ar/', hash: '', navigationType: 'PUSH' as const, hasSavedPosition: false };
  assert.equal(routeScrollAction(base), 'top');
  assert.equal(routeScrollAction({ ...base, navigationType: 'REPLACE' }), 'top');
  assert.equal(routeScrollAction({ ...base, hash: '#categories' }), 'hash');
  assert.equal(routeScrollAction({ ...base, previousPathname: '/products/' }), 'preserve');
  assert.equal(routeScrollAction({ ...base, previousPathname: '/products/', hash: '#categories' }), 'hash');
  assert.equal(routeHashId('#hello%20world'), 'hello world');
  assert.equal(routeHashId('#malformed%'), 'malformed%');
  assert.equal(routeHashId('#'), undefined);
});

test('Back/Forward positions win over hashes and phone controller scrolling', () => {
  for (const pathname of ['/products/', '/screen-protectors/compare/']) {
    assert.equal(routeScrollAction({ pathname, hash: '#details', navigationType: 'POP', hasSavedPosition: true }), 'restore');
  }
  assert.equal(routeScrollAction({ pathname: '/products/', hash: '', navigationType: 'POP', hasSavedPosition: false }), 'preserve');
  assert.equal(routeScrollAction({ pathname: '/products/', hash: '#categories', navigationType: 'POP', hasSavedPosition: false }), 'hash');
  assert.equal(routeScrollAction({ pathname: '/screen-protectors/videos/', hash: '#factory-scenes', navigationType: 'PUSH', hasSavedPosition: false }), 'phone');
  assert.equal(routeScrollAction({ pathname: '/screen-protectors/compare/', hash: '', navigationType: 'PUSH', hasSavedPosition: false }), 'phone');
});

test('native hash links sharing a history key scroll to a new anchor, then restore on Back', () => {
  const page = { key: 'same-native-key', pathname: '/sourcing/commercial-kitchen-equipment-from-china/', search: '', hash: '' };
  const anchor = { ...page, hash: '#commercial-kitchen-benchmarks' };
  const positions = new Map([[scrollPositionKey(page), 850]]);
  const action = (location: typeof page) => routeScrollAction({ ...location, previousPathname: page.pathname,
    navigationType: 'POP', hasSavedPosition: positions.has(scrollPositionKey(location)) });
  assert.equal(action(anchor), 'hash', 'first native anchor must not restore the base page’s cached position');
  positions.set(scrollPositionKey(anchor), 4200);
  assert.equal(action(page), 'restore', 'Back restores the prior viewport');
  assert.equal(positions.get(scrollPositionKey(page)), 850);
  assert.equal(action(anchor), 'restore', 'Forward restores the known anchor entry');
  assert.notEqual(scrollPositionKey(page), scrollPositionKey({ ...page, search: '?category=ice' }));
  assert.notEqual(scrollPositionKey(page), scrollPositionKey({ ...page, pathname: '/products/' }));
});
