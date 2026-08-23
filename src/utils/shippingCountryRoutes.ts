const LANGUAGE_PREFIX_PATTERN = /^\/(zh-cn|ru|fr|es|ar|pt|tr)(?=\/|$)/;

export function getShippingCountrySlug(
  pathname: string,
  search: string,
  allowedCountries: readonly string[],
  fallbackCountry: string,
) {
  const normalizedAllowed = new Set(allowedCountries.map((country) => country.toLowerCase()));
  const cleanPath = pathname.replace(LANGUAGE_PREFIX_PATTERN, '');
  const routeMatch = cleanPath.match(/^\/shipping-from-china-to-([^/?#]+)\/?$/i);
  const routeCountry = routeMatch?.[1]?.toLowerCase();

  if (routeCountry && normalizedAllowed.has(routeCountry)) {
    return routeCountry;
  }

  const params = new URLSearchParams(search);
  const queryCountry = (params.get('country') || params.get('dest') || '').toLowerCase();
  if (queryCountry && normalizedAllowed.has(queryCountry)) {
    return queryCountry;
  }

  return fallbackCountry;
}

export function buildShippingCountryPath(pathname: string, country: string) {
  const languagePrefix = pathname.match(LANGUAGE_PREFIX_PATTERN)?.[0] || '';
  return `${languagePrefix}/shipping-from-china-to-${country.toLowerCase()}`;
}
