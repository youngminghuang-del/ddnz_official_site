import { mobilePaths } from '../features/mobile-sourcing/routes.mjs';
import type { Language } from '../i18n/translations';
import { canonicalSitePath } from './notionArticleRouting';
import { kitchenCategoryPaths } from '../features/commercial-kitchen/routes.mjs';
import { buyerGuidePaths, hasProductTranslation, isLocalizedProductPath, localizedProductPath } from './productLocalization.mjs';

export const navigationPrefixes: Record<Language, string> = {
  en: '', zh: '/zh-cn', ru: '/ru', fr: '/fr', es: '/es', ar: '/ar', pt: '/pt', tr: '/tr',
};

export const englishProductPaths = [
  ...buyerGuidePaths, ...mobilePaths,
  ...kitchenCategoryPaths,
  '/products', '/sourcing-services', '/refrigeration-equipment',
  '/sourcing/commercial-kitchen-equipment-from-china', '/sourcing/audio-speakers-from-china',
  '/sourcing/outdoor-products-from-china',
  '/portable-power/selection-guide',
  '/screen-protectors', '/screen-protectors/compare', '/screen-protectors/guides',
  '/screen-protectors/guides/price-differences', '/screen-protectors/guides/curved-glass',
  '/screen-protectors/videos', '/screen-protectors/calculator', '/screen-protectors/brief',
] as const;

const productAliases: Record<string, string> = {
  '/commercial-kitchen': '/sourcing/commercial-kitchen-equipment-from-china',
  '/audio-speakers': '/sourcing/audio-speakers-from-china',
  '/mobile-accessories': '/sourcing/mobile-accessories-from-china',
  '/outdoor-products': '/sourcing/outdoor-products-from-china',
};

export function isNavigationLanguage(value: unknown): value is Language {
  return typeof value === 'string' && Object.hasOwn(navigationPrefixes, value);
}

/** Match complete prefix segments: /fridge and /arabic are ordinary English paths. */
export function splitNavigationPath(path: string) {
  const [, rawPath = '/', suffix = ''] = path.match(/^([^?#]*)([?#].*)?$/) || [];
  let pathname = rawPath.replace(/\/+$/, '') || '/';
  const entry = Object.entries(navigationPrefixes).find(([, prefix]) =>
    prefix && (pathname === prefix || pathname.startsWith(`${prefix}/`)));
  if (entry) pathname = pathname.slice(entry[1].length) || '/';
  return { pathname, suffix, locale: entry?.[0] as Language | undefined };
}

export function englishProductPath(path: string): string | undefined {
  const { pathname } = splitNavigationPath(path);
  if (Object.hasOwn(productAliases, pathname)) return productAliases[pathname];
  return (englishProductPaths as readonly string[]).includes(pathname) ? pathname : undefined;
}

export function isEnglishProductPath(path: string) {
  return englishProductPath(path) !== undefined && !isLocalizedProductPath(path);
}

/** Product links use an authored translation when one exists; other guides stay English. */
export function navigationPath(path: string, language: Language) {
  const { pathname, suffix } = splitNavigationPath(path);
  const product = englishProductPath(path);
  if (product && hasProductTranslation(product, language)) return localizedProductPath(`${product}${suffix}`, language);
  return canonicalSitePath(`${product || `${navigationPrefixes[language]}${pathname === '/' ? '' : pathname}` || '/'}${suffix}`);
}

export function navigationState(state: unknown, language: Language) {
  return { ...(state && typeof state === 'object' && !Array.isArray(state) ? state : {}), navigationLanguage: language };
}

/** Authored language URLs win. Untranslated English guides keep the navigation preference. */
export function resolveNavigationLanguage(path: string, current: Language, state?: unknown): Language {
  const { locale } = splitNavigationPath(path);
  if (locale) return locale;
  if (hasProductTranslation(path, 'en')) return 'en';
  if (!isEnglishProductPath(path)) return 'en';
  const remembered = state && typeof state === 'object' && 'navigationLanguage' in state
    ? state.navigationLanguage : undefined;
  return isNavigationLanguage(remembered) ? remembered : current;
}

export function englishProductRedirect(path: string, current: Language, state?: unknown) {
  const product = englishProductPath(path);
  if (!product) return undefined;
  return {
    to: navigationPath(`${product}${splitNavigationPath(path).suffix}`, resolveNavigationLanguage(path, current, state)),
    state: navigationState(state, resolveNavigationLanguage(path, current, state)),
  };
}

export function routeHashId(hash: string) {
  if (!hash || hash === '#') return undefined;
  try { return decodeURIComponent(hash.slice(1)); } catch { return hash.slice(1); }
}

/** Native hash anchors may reuse React Router's key, so the full URL is part of the identity. */
export function scrollPositionKey(location: { key: string; pathname: string; search: string; hash: string }) {
  return JSON.stringify([location.key, location.pathname, location.search, location.hash]);
}

/** Phone's controller owns its internal forward navigation; history restoration wins on POP. */
export function routeScrollAction({ pathname, previousPathname, hash, navigationType, hasSavedPosition }: {
  pathname: string; previousPathname?: string; hash: string;
  navigationType: 'POP' | 'PUSH' | 'REPLACE'; hasSavedPosition: boolean;
}): 'restore' | 'hash' | 'top' | 'preserve' | 'phone' {
  if (navigationType === 'POP' && hasSavedPosition) return 'restore';
  if (pathname === previousPathname && !hash) return 'preserve';
  const route = splitNavigationPath(pathname).pathname;
  if (route.startsWith('/screen-protectors') && !buyerGuidePaths.includes(route) && isEnglishProductPath(pathname)) return 'phone';
  if (routeHashId(hash)) return 'hash';
  if (navigationType === 'POP') return 'preserve';
  return 'top';
}
