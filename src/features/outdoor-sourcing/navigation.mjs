import { outdoorPath, productRouteParts } from '../../lib/productLocalization.mjs';

export const outdoorCategories = Object.freeze(['all', 'power', 'solar', 'cold']);
export function outdoorCategoryFromSearch(search = '') {
  const category = new URLSearchParams(search).get('category');
  return outdoorCategories.includes(category) ? category : 'all';
}
export function outdoorCategorySearch(search, category) {
  const params = new URLSearchParams(search);
  if (category !== 'all' && outdoorCategories.includes(category)) params.set('category', category);
  else params.delete('category');
  return params.size ? `?${params}` : '';
}
export function outdoorCategoryHref(category) {
  return `${outdoorPath}/${outdoorCategorySearch('', category)}#outdoor-range`;
}
export function outdoorNavigationCurrent(pathname, search, target) {
  const destination = new URL(target, 'https://www.ddnzglobal.com');
  const currentPath = productRouteParts(pathname).path;
  if (currentPath !== productRouteParts(destination.pathname).path) return false;
  return currentPath !== outdoorPath || outdoorCategoryFromSearch(search) === outdoorCategoryFromSearch(destination.search);
}
