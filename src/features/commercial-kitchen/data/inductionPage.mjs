import { KITCHEN_PATH } from './discovery.mjs';
import { inductionCookingPath, hotCookingPath } from '../routes.mjs';
import { inductionModels, multiZoneModels, largeWokModels, steamModels, noodleModels, roundCookerModels } from './inductionModels.mjs';

export const inductionPage = {
  path: inductionCookingPath + '/',
  label: 'Commercial induction cooking equipment',
  title: 'Commercial Induction Cooking Equipment from China | DDNZ',
  description: 'Compare eight commercial induction cooking models from China: single units, four- and six-zone ranges, and large wok cookers. Select models and request a quote.',
  image: inductionModels[0].image,
};
export const inductionGroups = /** @type {const} */ ([
  { group: 'single', anchor: 'induction-cooking', label: 'Single units', models: inductionModels },
  { group: 'multi', anchor: 'multi-zone-cooking', label: 'Multi-zone ranges', models: multiZoneModels },
  { group: 'large', anchor: 'large-wok-cookers', label: 'Large wok cookers', models: largeWokModels },
]);
export const inductionModelsForPage = inductionGroups.flatMap(group => group.models);
export const kitchenListHref = KITCHEN_PATH + '#commercial-kitchen-list';

export function inductionPageSchema() {
  const origin = 'https://www.ddnzglobal.com';
  const url = origin + inductionPage.path;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage', '@id': url, url, inLanguage: 'en',
        name: inductionPage.title, description: inductionPage.description,
        mainEntity: { '@type': 'ItemList', itemListElement: inductionModelsForPage.map((model, index) => ({
          '@type': 'ListItem', position: index + 1, name: model.model, url: url + '#model-' + model.id,
        })) },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          ['Home', '/'], ['Products', '/products/'],
          ['Commercial kitchen equipment', KITCHEN_PATH], [inductionPage.label, inductionPage.path],
        ].map(([name, path], index) => ({ '@type': 'ListItem', position: index + 1, name, item: origin + path })),
      },
    ],
  };
}

const zhKitchenPath = '/zh-cn' + KITCHEN_PATH;
export const zhInductionPage = {
  path: '/zh-cn' + inductionPage.path,
  label: '商用电磁烹饪设备',
  title: '从中国采购商用电磁烹饪设备 | DDNZ',
  description: '按工位比较单机电磁灶、四眼及六眼煲仔炉和商用电磁大锅灶。核对功率、电源和安装尺寸，按型号与数量询价。',
  heading: '从中国采购商用电磁烹饪设备',
  intro: '按工位比较 8 款设备。选定型号后，核对额定功率、电源、锅具尺寸和安装空间，再按采购数量询价。',
  image: inductionPage.image,
  groups: inductionGroups.map((group, index) => ({ ...group, label: ['单机电磁灶', '多头煲仔炉', '电磁大锅灶'][index] })),
};

export const zhHotCookingPage = {
  path: '/zh-cn' + hotCookingPath + '/',
  label: '商用蒸煮设备',
  title: '从中国采购商用蒸煮设备 | 蒸柜、煮面炉与汤炉 | DDNZ',
  description: '比较 6 款商用蒸煮设备，包括电磁蒸柜、台式煮面炉、汤炉与蒸包炉。按批量、篮位、电源和安装尺寸选型并询价。',
  heading: '从中国采购商用蒸煮设备',
  intro: '按蒸制、煮面、汤品和蒸包工位比较 6 款设备。确认每批用量、篮位或开口、电源和台面空间，再按型号询价。',
  image: steamModels[0].image,
  groups: /** @type {const} */ ([
    { group: 'steam', anchor: 'steam-cabinets', label: '电磁蒸柜', models: steamModels },
    { group: 'noodle', anchor: 'noodle-cookers', label: '台式煮面炉', models: noodleModels },
    { group: 'round', anchor: 'soup-bun-cookers', label: '汤炉与蒸包炉', models: roundCookerModels },
  ]),
};

export const chineseCookingPages = [zhInductionPage, zhHotCookingPage];
export const chineseCookingModelLinks = new Map(
  chineseCookingPages.flatMap(page => page.groups.flatMap(group =>
    group.models.map(model => [model.id, page.path + '#model-' + model.id]))),
);

export function chineseCookingSchema(page) {
  const origin = 'https://www.ddnzglobal.com';
  const url = origin + page.path;
  const models = page.groups.flatMap(group => [...group.models]);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage', '@id': url, url, inLanguage: 'zh-CN', name: page.title, description: page.description,
        mainEntity: { '@type': 'ItemList', itemListElement: models.map((model, index) => ({
          '@type': 'ListItem', position: index + 1, name: model.model, url: url + '#model-' + model.id,
        })) },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [['首页','/zh-cn/'], ['产品目录','/zh-cn/products/'], ['商用厨房设备',zhKitchenPath], [page.label,page.path]]
          .map(([name, path], index) => ({ '@type': 'ListItem', position: index + 1, name, item: origin + path })),
      },
    ],
  };
}
