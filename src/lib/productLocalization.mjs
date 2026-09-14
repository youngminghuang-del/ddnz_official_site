// Only routes with a complete, authored product body belong to this cluster.
// Other product routes retain their English canonical and the language notice.
import { mobilePaths } from '../features/mobile-sourcing/routes.mjs';
export const powerGuidePath = '/portable-power/selection-guide';
export const outdoorPath = '/sourcing/outdoor-products-from-china';
export const productContentLanguages = Object.freeze(['en', 'es', 'ar']);
export const buyerGuidePaths = Object.freeze([
  '/sourcing/kitchen-equipment-for-distributors',
  '/sourcing/restaurant-project-equipment',
  '/screen-protectors/wholesale-for-stores',
  '/screen-protectors/private-label',
]);
export const localizableProductPaths = Object.freeze([
  '/sourcing/commercial-kitchen-equipment-from-china',
  '/screen-protectors', '/screen-protectors/compare', ...buyerGuidePaths, ...mobilePaths, outdoorPath, powerGuidePath,
]);
export function productRouteParts(path = '/') {
  const [, raw, suffix = ''] = String(path).match(/^([^?#]*)([?#].*)?$/s);
  const normalized = raw.replace(/\/+$/, '') || '/';
  const match = normalized.match(/^\/(es|ar)(?=\/|$)/);
  return { path: match ? normalized.slice(match[0].length) || '/' : normalized, locale: match?.[1] || 'en', suffix };
}
export function hasProductTranslation(path, locale) {
  return productContentLanguages.includes(locale) && localizableProductPaths.includes(productRouteParts(path).path);
}
export function localizedProductPath(path, locale = 'en') {
  const parts = productRouteParts(path);
  const prefix = hasProductTranslation(parts.path, locale) && locale !== 'en' ? `/${locale}` : '';
  return `${prefix}${parts.path === '/' ? '' : parts.path}/${parts.suffix}`;
}
export function isLocalizedProductPath(path) {
  const parts = productRouteParts(path);
  return parts.locale !== 'en' && hasProductTranslation(parts.path, parts.locale);
}
export function productAlternates(path) {
  return productContentLanguages.filter(locale => hasProductTranslation(path, locale))
    .map(hrefLang => ({ hrefLang, href: `https://www.ddnzglobal.com${localizedProductPath(productRouteParts(path).path, hrefLang)}` }));
}
