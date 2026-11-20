import { buildSupplementalCorridorSpec } from './eurasiaCorridors';

export function centralAsiaCountryHero(country: string, locale: string) {
  if (country === 'kazakhstan' && locale === 'ru') {
    return {
      headline: 'Грузоперевозки из Китая в Казахстан',
      subheadline: 'Автоперевозки и доставка по железной дороге. Heaven Born уточнит стоимость и подскажет, какие документы подготовить.',
    };
  }
  if (country === 'tajikistan' && locale === 'ru') {
    return {
      headline: 'Доставка из Китая в Таджикистан',
      subheadline: 'Сравните автоперевозку и маршрут с перегрузкой с поезда на автомобиль до Душанбе или Худжанда. Heaven Born уточнит стоимость, сроки и документы для вашего груза.',
    };
  }
  if (country === 'turkmenistan' && locale === 'ru') {
    return {
      headline: 'Доставка грузов из Китая в Туркменистан',
      subheadline: 'Подберём авто- или железнодорожный маршрут до Ашхабада или Туркменабата. Heaven Born уточнит стоимость, сроки и документы для вашего груза.',
    };
  }
  if (country === 'kyrgyzstan' && locale === 'en') return buildSupplementalCorridorSpec(country, locale);
  return null;
}
