import { inductionPage } from './inductionPage.mjs';
import { kitchenCategories } from './categories.mjs';
import { KITCHEN_PATH } from './discovery.mjs';

export const dealerPath = '/sourcing/kitchen-equipment-for-distributors/';
export const projectPath = '/sourcing/restaurant-project-equipment/';
export const marginHref = model => dealerPath + (model ? '?model=' + encodeURIComponent(model) : '') + '#commercial-kitchen-trade-pricing';

const categoryLink = id => kitchenCategories.find(item => item.id === id);
export const equipmentFilters = [
  { id: 'all', label: 'All equipment', categories: [], links: [] },
  { id: 'ice', label: 'Ice machines', categories: ['Ice making'], links: [categoryLink('ice-machines')] },
  { id: 'refrigeration', label: 'Refrigeration', categories: ['Cold storage', 'Prep counters', 'Display cooling'],
    links: [{ path: '/refrigeration-equipment/', label: 'Commercial refrigeration' }] },
  { id: 'hot', label: 'Hot cooking', categories: ['Cooking & baking'], links: [
    { path: inductionPage.path, label: 'Induction cooking' }, categoryLink('electric-fryers'), categoryLink('electric-griddles'),
  ] },
  { id: 'beverage', label: 'Coffee & beverages', categories: ['Beverage equipment'],
    links: [{ path: '/sourcing/commercial-coffee-machines-from-china/', label: 'Commercial coffee machines' }] },
];

export const kitchenHeroItems = [
  ['ice-49-studio-v2.png', 'Ice machines', 'ice'],
  ['ZH-8A.webp', 'Hot cooking', 'hot'],
  ['juice-1200.webp', 'Coffee & beverages', 'beverage'],
].map(([image, label, filter]) => ({
  src: '/commercial-kitchen-media/' + image,
  label,
  href: KITCHEN_PATH + '?category=' + filter + '#commercial-kitchen-equipment',
}));

export const legacyHotGroups = {
  'induction-cooking': 'single',
  'multi-zone-cooking': 'multi',
  'steam-cabinets': 'steam',
  'noodle-cookers': 'noodle',
  'soup-bun-cookers': 'round',
  'large-wok-cookers': 'large',
};
