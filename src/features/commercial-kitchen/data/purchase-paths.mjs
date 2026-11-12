import { dealerPath, projectPath, marginHref } from './catalogueNavigation.mjs';

export const kitchenPurchasePaths = [
  {
    href: '#commercial-kitchen-equipment',
    label: 'Buy individual equipment',
    image: '/commercial-kitchen-media/ddnz-products/ZH-101V-ddnz-v1-600.webp',
    description: 'Find a model by function, capacity or model number.',
  },
  {
    href: '/sourcing/kitchen-equipment-for-distributors/',
    label: 'Build a distributor order',
    image: '/commercial-kitchen-media/ddnz-products/ice-49-ddnz-v1-600.webp',
    description: 'Plan a mixed first order, restocking and spare parts.',
  },
  {
    href: '/sourcing/restaurant-project-equipment/',
    label: 'Equip a whole kitchen',
    image: '/images/restaurant-kitchen-packages/qsr-isometric-concept-v1.webp',
    description: 'Start with a menu, floor plan or existing equipment list.',
  },
];

export const orderSupportPaths = model => [
  {
    id: 'commercial-kitchen-assortments',
    href: dealerPath + '#dealer-starter-plans',
    label: 'Distributor starter orders',
    description: 'Start with an editable equipment mix.',
    image: '/commercial-kitchen-media/ddnz-products/ZH-102V-ddnz-v1-600.webp',
  },
  {
    id: 'commercial-kitchen-benchmarks',
    href: marginHref(),
    label: 'Retail references and margin tool',
    description: 'Compare retail examples and estimate margin in CNY.',
    image: '/images/posts/_cards/turkey-kitchen-equipment-dealers-china-sourcing-margin-checklist-3bfeac33-480.webp',
  },
  {
    id: 'commercial-kitchen-trade-pricing',
    href: marginHref(model),
    label: 'Plan the buying price',
    description: 'Set a target unit price and order quantity.',
    image: '/media/process/brief-spec-discussion-poster.webp',
  },
  {
    id: 'commercial-kitchen-gulf',
    href: projectPath + '#commercial-kitchen-gulf',
    label: 'Gulf kitchen planning',
    description: 'Check site conditions and equipment requirements.',
    image: '/commercial-kitchen-media/project-selection/gn650tnpro-studio.webp',
  },
  {
    id: 'factory-production',
    href: projectPath + '#kitchen-production-reference',
    label: 'Kitchen equipment production video',
    description: 'See equipment and assembly on the production floor.',
    image: '/commercial-kitchen-media/factory.webp',
  },
  {
    id: 'equipment-buying-support',
    href: '/how-we-work/',
    label: 'How we quote and ship',
    description: 'See how we confirm, pack and arrange your order.',
    image: '/media/process/packaging-inspection.webp',
  },
];
