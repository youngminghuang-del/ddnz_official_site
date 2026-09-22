import test from 'node:test';
import assert from 'node:assert/strict';
import { shippingCountries, siteNavigation, sourcingCategories } from '../src/config/siteNavigation.ts';

test('global navigation has unique routes and a clear six-item primary hierarchy', () => {
  const primary = ['home', 'products', 'sourcing-services', 'freight', 'process', 'insights'];
  assert.equal(new Set(primary).size, 6);

  const routes = [
    ...siteNavigation.sourcingServices,
    ...siteNavigation.freightServices,
    ...siteNavigation.freightRegions,
    ...siteNavigation.featuredFreightCountries,
    siteNavigation.process,
    siteNavigation.insights,
  ];
  assert.equal(new Set(routes).size, routes.length, 'navigation routes must not be duplicated across groups');
  assert.ok(routes.every(path => path.startsWith('/')), 'every internal route must be root-relative');
});

test('featured freight countries are real country routes and all category slugs are unique', () => {
  const countrySet = new Set(shippingCountries);
  for (const route of siteNavigation.featuredFreightCountries) {
    const slug = route.replace('/shipping-from-china-to-', '');
    assert.ok(countrySet.has(slug as typeof shippingCountries[number]), route);
  }
  assert.equal(new Set(shippingCountries).size, shippingCountries.length);
  assert.equal(new Set(sourcingCategories.map(item => item.slug)).size, sourcingCategories.length);
});
