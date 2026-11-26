import { buildSupplementalCorridorSpec } from './eurasiaCorridors';

export function centralAsiaCountryHero(country: string, locale: string) {
  if (country === 'kyrgyzstan' && locale === 'zh') {
    return {
      headline: '中国到吉尔吉斯斯坦货运',
      subheadline: '发往比什凯克或奥什，先比较伊尔克什坦、吐尔尕特或经哈萨克斯坦中转的方案。询价时注明是到站自提、送一个仓库，还是分拨两地。',
    };
  }
  if (country === 'tajikistan' && locale === 'zh') {
    return {
      headline: '中国到塔吉克斯坦货运',
      subheadline: '发往杜尚别或苦盏，先把最后一段写进报价。比较全程公路与铁转公方案时，逐票确认经行国家、换装地点和末段交付责任。',
    };
  }
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
