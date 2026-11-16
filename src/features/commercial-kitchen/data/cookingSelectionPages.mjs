import roundCopy from '../locales/planning/round-cookers.json' with { type: 'json' };
import noodleCopy from '../locales/planning/noodle-cookers.json' with { type: 'json' };
import steamCopy from '../locales/planning/steam-cabinets.json' with { type: 'json' };
import navigationCopy from '../locales/planning/induction-use.json' with { type: 'json' };
import { localizedProductPath } from '../../../lib/productLocalization.mjs';
import { noodleCookerPath, soupBunCookerPath, steamCabinetPath } from '../routes.mjs';
import { KITCHEN_PATH } from './discovery.mjs';
import { noodleModels, roundCookerModels, steamModels } from './inductionModels.mjs';

export const cookingSelections = {
  steam: { path: steamCabinetPath, models: steamModels, copy: steamCopy, id: 'steam-cabinet' },
  noodle: { path: noodleCookerPath, models: noodleModels, copy: noodleCopy, id: 'noodle-cooker' },
  round: { path: soupBunCookerPath, models: roundCookerModels, copy: roundCopy, id: 'soup-bun-cooker' },
};

export function cookingSelectionGroup(path) {
  if (path === steamCabinetPath) return 'steam';
  if (path === noodleCookerPath) return 'noodle';
  if (path === soupBunCookerPath) return 'round';
}

export function cookingSelectionBreadcrumb(group, locale) {
  const { copy, path } = cookingSelections[group];
  const [home, products, kitchen] = navigationCopy[locale].labels;
  return [
    [home, locale === 'en' ? '/' : `/${locale === 'zh' ? 'zh-cn' : locale}/`],
    [products, localizedProductPath('/products/', locale)],
    [kitchen, localizedProductPath(KITCHEN_PATH, locale)],
    [copy[locale].label, localizedProductPath(path, locale)],
  ];
}

export function getCookingSelectionPage(group, language = 'en') {
  const { copy, path, models } = cookingSelections[group];
  const locale = language === 'zh-cn' ? 'zh' : language;
  const text = copy[locale];
  return {
    path: localizedProductPath(path, locale),
    title: text.heading + ' | DDNZ',
    description: text.intro,
    image: models[1].image,
  };
}

export const cookingSelectionPages = Object.entries(cookingSelections).flatMap(([group, { copy }]) =>
  Object.keys(copy).map(locale => getCookingSelectionPage(group, locale)));

export function cookingSelectionSchema(group, locale) {
  const { models } = cookingSelections[group];
  const page = getCookingSelectionPage(group, locale);
  const origin = 'https://www.ddnzglobal.com';
  const url = origin + page.path;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage', '@id': url, url, inLanguage: locale === 'zh' ? 'zh-CN' : locale,
        name: page.title, description: page.description,
        mainEntity: { '@type': 'ItemList', itemListElement: models.map((model, index) => ({
          '@type': 'ListItem', position: index + 1, name: model.model, url: url + '#model-' + model.id,
        })) },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: cookingSelectionBreadcrumb(group, locale).map(([name, path], index) => ({
          '@type': 'ListItem', position: index + 1, name, item: origin + path,
        })),
      },
    ],
  };
}
