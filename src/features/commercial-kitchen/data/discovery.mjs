export const KITCHEN_PATH = '/sourcing/commercial-kitchen-equipment-from-china/';

export const kitchenJourney = [
  { step: '01', title: 'Choose your equipment', copy: 'Compare 26 models by capacity, size and use.', href: '#commercial-kitchen-equipment' },
  { step: '02', title: 'Work out your margin', copy: 'Compare supply prices, local retail and import costs.', href: '#commercial-kitchen-benchmarks' },
  { step: '03', title: 'Check before you order', copy: 'Review the details that change a quotation.', href: '#commercial-kitchen-guide' },
];

export const kitchenReading = [
  {
    slug: 'commercial-ice-machine-hot-kitchen-output-china-sourcing',
    title: 'Choosing an ice maker for a hot kitchen',
    copy: 'Know which output conditions to ask about before comparing daily capacity.',
    image: '/commercial-kitchen-media/factory.webp',
    category: 'Ice making',
  },
  {
    slug: 'commercial-refrigerators-gulf-kitchens-climate-class-high-ambient',
    title: 'Checking refrigeration for Gulf kitchens',
    copy: 'Understand climate-class and ambient-temperature claims before requesting a configuration.',
    image: '/commercial-kitchen-media/factory.webp',
    category: 'Refrigeration',
  },
];

export const kitchenFaq = [
  { question: 'Can I combine different equipment types?', answer: 'Build a mixed sourcing list here. MOQ, factory availability, consolidation and packaging terms will be confirmed for the specific combination.' },
  { question: 'Do I need to know every electrical specification now?', answer: 'No. Select the products, quantity and destination country first. We will confirm the electrical configuration of those selected models during quotation.' },
  { question: 'Are the retail references identical to these models?', answer: 'A reference may match a model code and key specifications, or only a comparable capacity class. Each comparison states its matching basis. Branding, components, electrical configuration and after-sales terms may differ.' },
  { question: 'What does the indicative supply price include?', answer: 'Selected models show an indicative unit price with the reference order quantity. Approximate USD and local-currency values use the dated exchange rates shown on this page. Freight and taxes are extra. Final currency, configuration and order pricing are confirmed in your quotation.' },
  { question: 'Can you work with my target buying price?', answer: 'Include your target price, quantity and destination in the quote request. We will review the selection and quote available options. Freight, import charges and local selling costs also affect your margin.' },
  { question: 'Can I request a product that is not listed?', answer: 'Yes. Add a model, description or product link in the sourcing notes. This page is a selected range drawn from supplier catalogues, not the full product library.' },
];

// Describe the actual collection and its hierarchy; indicative quotes are not
// binding product Offers, and no rating or FAQ rich-result eligibility is implied.
export function kitchenStructuredData(launch) {
  const origin = 'https://www.ddnzglobal.com';
  const url = origin + KITCHEN_PATH;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': url, url, name: launch.meta.title,
        description: launch.meta.description, inLanguage: 'en',
        breadcrumb: { '@id': url + '#breadcrumb' },
        isPartOf: { '@type': 'WebSite', '@id': origin + '/#website', name: 'DDNZ Global', url: origin + '/' },
      },
      { '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: origin + '/' },
        { '@type': 'ListItem', position: 2, name: 'Products', item: origin + '/products/' },
        { '@type': 'ListItem', position: 3, name: 'Commercial kitchen equipment', item: url },
      ] },
    ],
  };
}
