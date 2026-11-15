import copy from '../locales/planning/steam-cabinets.json' with { type: 'json' };
import navigationCopy from '../locales/planning/induction-use.json' with { type: 'json' };
import { localizedProductPath } from '../../../lib/productLocalization.mjs';
import { steamCabinetPath } from '../routes.mjs';
import { KITCHEN_PATH } from './discovery.mjs';
import { steamModels } from './inductionModels.mjs';

export function steamCabinetBreadcrumb(locale) {
  const [home, products, kitchen] = navigationCopy[locale].labels;
  return [
    [home, locale === 'en' ? '/' : `/${locale === 'zh' ? 'zh-cn' : locale}/`],
    [products, localizedProductPath('/products/', locale)],
    [kitchen, localizedProductPath(KITCHEN_PATH, locale)],
    [copy[locale].label, localizedProductPath(steamCabinetPath, locale)],
  ];
}

export function getSteamCabinetPage(language = 'en') {
  const locale = language === 'zh-cn' ? 'zh' : language;
  const text = copy[locale];
  return {
    path: localizedProductPath(steamCabinetPath, locale),
    title: text.heading + ' | DDNZ',
    description: text.intro,
    image: steamModels[1].image,
  };
}

export const steamCabinetPages = Object.keys(copy).map(getSteamCabinetPage);

export function steamCabinetSchema(locale) {
  const page = getSteamCabinetPage(locale);
  const origin = 'https://www.ddnzglobal.com';
  const url = origin + page.path;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage', '@id': url, url, inLanguage: locale === 'zh' ? 'zh-CN' : locale,
        name: page.title, description: page.description,
        mainEntity: { '@type': 'ItemList', itemListElement: steamModels.map((model, index) => ({
          '@type': 'ListItem', position: index + 1, name: model.model, url: url + '#model-' + model.id,
        })) },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: steamCabinetBreadcrumb(locale).map(([name, path], index) => ({
          '@type': 'ListItem', position: index + 1, name, item: origin + path,
        })),
      },
    ],
  };
}
