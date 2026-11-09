import { CENTRAL_ASIA_DATA } from './centralAsiaCountryData';
import { centralAsiaCountryHero } from './centralAsiaCountryHero';
import { buildSupplementalCorridorSpec, EURASIA_COUNTRIES, type EurasiaCountry, type EurasiaLocale } from './eurasiaCorridors';
import { countryBuyerBriefs } from './countryBuyerBriefs';

/** Keep the service description and visible introduction on one authored source. */
export function resolveEurasiaIntro(country: string, locale: string, fallbackHeadline = '') {
  if (!(EURASIA_COUNTRIES as readonly string[]).includes(country)) return null;
  if (locale === 'pt' || locale === 'tr') {
    return { headline: fallbackHeadline, subheadline: countryBuyerBriefs[country][locale][0] };
  }
  const authored = centralAsiaCountryHero(country, locale);
  if (authored) return { headline: authored.headline, subheadline: authored.subheadline };
  if ((country === 'kazakhstan' || country === 'uzbekistan') && (locale === 'en' || locale === 'zh' || locale === 'ru')) {
    const source = CENTRAL_ASIA_DATA[country][locale];
    return { headline: source.headline, subheadline: source.subheadline };
  }
  const source = buildSupplementalCorridorSpec(country as EurasiaCountry, locale as EurasiaLocale);
  return { headline: source.headline, subheadline: source.subheadline };
}
