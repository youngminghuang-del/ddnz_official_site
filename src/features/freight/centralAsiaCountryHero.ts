import { buildSupplementalCorridorSpec } from './eurasiaCorridors';

export function centralAsiaCountryHero(country: string, locale: string) {
  if (country === 'kazakhstan' && locale === 'ru') {
    return {
      headline: 'Доставка из Китая в Казахстан: железная дорога, авто и таможня',
      subheadline: 'Сравните автомобильную и железнодорожную доставку из Китая в Казахстан. Heaven Born поможет подобрать маршрут и подготовить документы до отправки.',
    };
  }
  if (country === 'tajikistan' && locale === 'ru') return buildSupplementalCorridorSpec(country, locale);
  if (country === 'kyrgyzstan' && locale === 'en') return buildSupplementalCorridorSpec(country, locale);
  return null;
}
