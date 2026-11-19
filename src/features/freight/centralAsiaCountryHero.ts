import { buildSupplementalCorridorSpec } from './eurasiaCorridors';

export function centralAsiaCountryHero(country: string, locale: string) {
  if (country === 'kazakhstan' && locale === 'ru') {
    return {
      headline: 'Грузоперевозки из Китая в Казахстан',
      subheadline: 'Автоперевозки и доставка по железной дороге. Heaven Born уточнит стоимость и подскажет, какие документы подготовить.',
    };
  }
  if (country === 'tajikistan' && locale === 'ru') return buildSupplementalCorridorSpec(country, locale);
  if (country === 'kyrgyzstan' && locale === 'en') return buildSupplementalCorridorSpec(country, locale);
  return null;
}
