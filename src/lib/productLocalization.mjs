import {audioCategoryPaths} from '../features/audio/category-routes.mjs';
import { kitchenCategoryPaths, kitchenPackagePath, kitchenPackageScenarioPaths } from '../features/commercial-kitchen/routes.mjs';
// Only routes with a complete, authored product body belong to this cluster.
// Other product routes retain their English canonical and the language notice.
import { foodProcessingRoutes } from '../features/food-processing/pages.mjs';
import { mobilePaths } from '../features/mobile-sourcing/routes.mjs';
export const powerGuidePath = '/portable-power/selection-guide';
export const outdoorPath = '/sourcing/outdoor-products-from-china';
export const overviewProductPaths = Object.freeze([...audioCategoryPaths,'/products', '/sourcing-services', '/sourcing/audio-speakers-from-china','/refrigeration-equipment','/screen-protectors/guides','/screen-protectors/guides/price-differences','/screen-protectors/guides/curved-glass','/screen-protectors/videos']);
export const overviewContentLanguages = Object.freeze(['en','zh','es','ar','ru','fr','pt','tr']);
export const productContentLanguages = Object.freeze(['en','zh','es','ar','ru','fr','pt','tr']);
export const buyerGuidePaths = Object.freeze([
  '/sourcing/kitchen-equipment-for-distributors',
  '/sourcing/restaurant-project-equipment',
  '/screen-protectors/wholesale-for-stores',
  '/screen-protectors/private-label',
]);
export const localizableProductPaths = Object.freeze([
  '/sourcing/commercial-kitchen-equipment-from-china',
  '/screen-protectors', '/screen-protectors/compare', '/screen-protectors/calculator', ...buyerGuidePaths, ...mobilePaths, outdoorPath, powerGuidePath,
]);
export function productRouteParts(path = '/') {
  const [, raw, suffix = ''] = String(path).match(/^([^?#]*)([?#].*)?$/s);
  const normalized = raw.replace(/\/+$/, '') || '/';
  const match = normalized.match(/^\/(zh-cn|es|ar|ru|fr|pt|tr)(?=\/|$)/);
  return { path: match ? normalized.slice(match[0].length) || '/' : normalized, locale: match?.[1] === 'zh-cn' ? 'zh' : match?.[1] || 'en', suffix };
}
export function hasProductTranslation(path, locale) {
  const base = productRouteParts(path).path;
  return (buyerGuidePaths.includes(base) || overviewProductPaths.includes(base) || foodProcessingRoutes.includes(base) || [...kitchenCategoryPaths,kitchenPackagePath,...kitchenPackageScenarioPaths].includes(base)) ? overviewContentLanguages.includes(locale === 'zh-cn' ? 'zh' : locale) : productContentLanguages.includes(locale === 'zh-cn' ? 'zh' : locale) && localizableProductPaths.includes(base);
}
export function localizedProductPath(path, locale = 'en') {
  const parts = productRouteParts(path);
  const prefix = hasProductTranslation(parts.path, locale) && locale !== 'en' ? `/${locale === 'zh' ? 'zh-cn' : locale}` : '';
  return `${prefix}${parts.path === '/' ? '' : parts.path}/${parts.suffix}`;
}
export function isLocalizedProductPath(path) {
  const parts = productRouteParts(path);
  return parts.locale !== 'en' && hasProductTranslation(parts.path, parts.locale);
}
export function productAlternates(path) {
  return ((buyerGuidePaths.includes(productRouteParts(path).path) || overviewProductPaths.includes(productRouteParts(path).path) || foodProcessingRoutes.includes(productRouteParts(path).path) || [...kitchenCategoryPaths,kitchenPackagePath,...kitchenPackageScenarioPaths].includes(productRouteParts(path).path)) ? overviewContentLanguages : productContentLanguages).filter(locale => hasProductTranslation(path, locale))
    .map(hrefLang => ({ hrefLang: hrefLang === 'zh' ? 'zh-cn' : hrefLang, href: `https://www.ddnzglobal.com${localizedProductPath(productRouteParts(path).path, hrefLang)}` }));
}
