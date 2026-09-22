export const shippingCountries = [
  'saudi-arabia',
  'uae',
  'kuwait',
  'qatar',
  'oman',
  'bahrain',
  'kazakhstan',
  'uzbekistan',
  'kyrgyzstan',
  'tajikistan',
  'turkmenistan',
  'russia',
  'nigeria',
  'ghana',
  'mexico',
  'brazil',
  'argentina',
  'peru',
  'chile',
] as const;

export const sourcingCategories = [
  { slug: 'commercial-kitchen-equipment-from-china', kind: 'commercial-kitchen' },
  { slug: 'audio-speakers-from-china', kind: 'audio-speakers' },
  { slug: 'mobile-accessories-from-china', kind: 'mobile-accessories' },
  { slug: 'outdoor-products-from-china', kind: 'outdoor' },
] as const;

export const siteNavigation = {
  sourcingServices: [
    '/sourcing-services',
    '/sourcing-services/supplier-search',
    '/sourcing-services/inspection-quality-control',
    '/sourcing-services/consolidation-export',
  ],
  freightServices: [
    '/services/sea-freight',
    '/services/lcl-shipping-from-china',
    '/services/air-freight',
    '/services/dangerous-goods-shipping-from-china',
    '/services/amazon-fba',
    '/services/warehouse-services',
  ],
  freightRegions: [
    '/shipping-from-china-to-middle-east',
    '/shipping-from-china-to-central-asia',
    '/shipping-from-china-to-west-africa',
    '/shipping-from-china-to-latin-america',
  ],
  featuredFreightCountries: [
    '/shipping-from-china-to-uae',
    '/shipping-from-china-to-saudi-arabia',
    '/shipping-from-china-to-kazakhstan',
    '/shipping-from-china-to-uzbekistan',
    '/shipping-from-china-to-nigeria',
    '/shipping-from-china-to-mexico',
    '/shipping-from-china-to-peru',
  ],
  process: '/how-we-work',
  insights: '/insights',
} as const;

export type SiteNavigation = typeof siteNavigation;
