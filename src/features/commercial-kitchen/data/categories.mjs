import products from './products.mjs';
import { KITCHEN_PATH } from './discovery.mjs';

// Branded category photography; retain the original catalogue assets separately.
const categoryImages = {
  'ice-39': 'ice-39',
  'ice-49': 'ice-49',
  'ice-58': 'ice-58',
  'ice-61': 'ice-58', // These two catalogue entries use the same source photograph.
  'ice-64': 'ice-64',
  'ice-69': 'ice-69',
  'ZH-101V': 'ZH-101V',
  'ZH-102V': 'ZH-102V',
  'ZH-818': 'ZH-818',
  'ZH-820': 'ZH-820',
};

export const kitchenCategories = [
  {
    id: 'ice-machines', path: '/sourcing/commercial-ice-machines-from-china/', label: 'Ice machines',
    title: 'Commercial Ice Machines from China: Compare Models | DDNZ',
    description: 'Compare six commercial cube ice machines from China, rated 50–250 kg/day. Review sizes, reference prices and questions for your wholesale order.',
    heading: 'Commercial ice machines.', emphasis: 'Find your output range.',
    intro: 'Build an ice-machine range for cafés, restaurants and hospitality buyers. Compare six models by rated daily output and footprint, then request a configuration for your market.',
    productIds: ['ice-39', 'ice-49', 'ice-58', 'ice-61', 'ice-64', 'ice-69'],
    heroId: 'ice-49', statistic: '50–250 kg', statisticLabel: 'Rated daily output across six models',
    comparisonKeys: ['Daily output'], comparisonTitle: 'Compare output and space together.',
    comparisonCopy: 'Several models share similar outer dimensions but list different daily output. Ask about the storage bin and operating conditions when narrowing the range.',
    buyingTitle: 'Plan for the busiest part of the day.',
    buying: [
      { title: 'Start with demand and storage', copy: 'Ask your customer how much ice they use during peak service and how much they need ready in the bin. Daily production and ice-storage capacity are separate specifications; the listed kg/day figure describes rated production.' },
      { title: 'Put temperature in the brief', copy: 'Include the expected room and inlet-water temperatures, especially for a hot kitchen. Request the output test conditions for the selected model before treating its daily rating as an operating forecast.' },
      { title: 'Check the installation space', copy: 'Compare machine width, depth and height, then allow for the ventilation, connections and service access specified for the final configuration. Confirm the water feed and drain arrangement with the quotation.' },
    ],
    quoteChecks: ['Daily ice demand and peak service period', 'Required bin capacity and ice format', 'Expected ambient and inlet-water temperatures', 'Water supply, drainage and installation space', 'Quantity, destination and preferred spare-parts package'],
    faqs: [
      { question: 'Is 100 kg/day the amount the machine can store?', answer: 'No. It is the listed daily production rating. Bin capacity is a separate value and will be confirmed for your chosen model.' },
      { question: 'Will the listed output be achieved in a hot kitchen?', answer: 'The figures are rated values. Ask for the selected machine’s output at the intended ambient and inlet-water conditions before planning the order.' },
      { question: 'Why do the 55, 80 and 100 kg models show the same dimensions?', answer: 'The current catalogue lists these models at 448 × 400 × 798 mm. A shared footprint does not establish identical components or storage capacity. We confirm the final dimensions and configuration when quoting.' },
      { question: 'Can I order several output sizes together?', answer: 'Add the models to the same equipment list. Quantities, availability, packing and consolidation will be reviewed for that combination.' },
    ],
    reading: [{ slug: 'commercial-ice-machine-hot-kitchen-output-china-sourcing', title: 'Choosing an ice machine for a hot kitchen', copy: 'The questions behind a daily output rating.' }],
  },
  {
    id: 'electric-fryers', path: '/sourcing/commercial-electric-fryers-from-china/', label: 'Electric fryers',
    title: 'Commercial Electric Fryers from China: 10L & Twin Tank | DDNZ',
    description: 'Compare 10 L and twin 10 L commercial electric fryers from China. Check tank layout, dimensions, reference prices and wholesale order quantities.',
    heading: 'Commercial electric fryers.', emphasis: 'Choose the tank layout.',
    intro: 'Compare a compact single-tank model with a twin-tank option for your restaurant equipment range. See the listed capacity, counter space and starting order quantities side by side.',
    productIds: ['ZH-101V', 'ZH-102V'], heroId: 'ZH-102V', statistic: '10 L / 2 × 10 L', statisticLabel: 'Single and twin tank options',
    comparisonKeys: ['Tank volume', 'Tanks', 'Rated power'], comparisonTitle: 'One tank or two?',
    comparisonCopy: 'Compare capacity per tank, the number of tanks and the counter width. A twin-tank unit has two separate 10 L tanks; it is not a single 20 L tank.',
    buyingTitle: 'Match the fryer to the menu and counter.',
    buying: [
      { title: 'Choose the tank arrangement', copy: 'The ZH-101V offers one 10 L tank in a 280 mm-wide unit. The ZH-102V offers two 10 L tanks in a 570 mm-wide unit. Discuss which foods will be cooked, the basket arrangement and the controls needed for each tank.' },
      { title: 'Check a real working batch', copy: 'Tank volume alone does not establish portions per hour. Ask about the basket dimensions, recommended oil fill, batch size and recovery performance for the food your customer intends to cook.' },
      { title: 'Plan cleaning and service', copy: 'Review draining, access to the tank and heating elements, and the parts that need regular cleaning. Include baskets, thermostats, heating elements and other requested spare parts in the quotation scope.' },
    ],
    quoteChecks: ['Single or twin tank, and intended foods', 'Basket dimensions and planned batch size', 'Available counter width and depth', 'Quantity, destination and installation requirements', 'Draining arrangement, packing and spare parts'],
    faqs: [
      { question: 'Does “2 × 10 L” mean one 20 L cooking tank?', answer: 'No. It describes two 10 L tanks. Compare each tank and basket with the portion size you need.' },
      { question: 'Is tank volume the recommended oil fill?', answer: 'Do not assume they are the same. Confirm the usable oil fill range and operating instructions for the selected model.' },
      { question: 'Why are the reference order quantities different?', answer: 'Each model has its own reference price and order tier. The single-tank reference is for 10 units and the twin-tank reference is for 1 unit. We confirm final pricing for your actual quantity.' },
      { question: 'Can the electrical setup be confirmed after I choose?', answer: 'Yes. Start with the model, quantity and destination. Voltage, frequency, phase, plug and connection requirements are confirmed during quotation.' },
    ],
    reading: [{ slug: 'commercial-kitchen-equipment-china-saudi-rfq-checklist', title: 'What to include in an equipment quotation request', copy: 'Bring the model, quantity and destination into one brief.' }],
  },
  {
    id: 'electric-griddles', path: '/sourcing/commercial-electric-griddles-from-china/', label: 'Electric griddles',
    title: 'Commercial Electric Griddles from China: Compare Sizes | DDNZ',
    description: 'Compare ZH-818 and ZH-820 electric griddles from China: cooking area, 8 mm plate, counter footprint and wholesale quotation options.',
    heading: 'Commercial electric griddles.', emphasis: 'Make the surface count.',
    intro: 'Choose between two flat-plate sizes for your countertop cooking range. Compare the usable cooking surface, overall footprint and listed power before requesting your order price.',
    productIds: ['ZH-818', 'ZH-820'], heroId: 'ZH-818', statistic: '548 / 728 mm', statisticLabel: 'Listed cooking-plate widths',
    comparisonKeys: ['Cooking plate', 'Rated power', 'Surface'], comparisonTitle: 'Cooking area and counter space.',
    comparisonCopy: 'The cooking plate is smaller than the full appliance. Use plate dimensions to plan the food layout and overall dimensions to check the counter.',
    buyingTitle: 'Start with what goes on the plate.',
    buying: [
      { title: 'Compare the two surfaces', copy: 'The ZH-818 lists a 548 × 350 mm cooking surface. The ZH-820 lists 728 × 400 mm. Both list an 8 mm flat plate. Sketch a typical batch on these dimensions before choosing the larger unit.' },
      { title: 'Allow room around the appliance', copy: 'Overall dimensions are 550 × 430 × 220 mm and 730 × 470 × 220 mm respectively. Confirm installation clearances, the grease collection arrangement and room for cleaning with the selected configuration.' },
      { title: 'Ask about heat and controls', copy: 'Listed power is 3 kW for the ZH-818 and 4.4 kW for the ZH-820. Confirm the control arrangement, heating performance, plate material and electrical setup in the quote; power alone does not establish cooking throughput.' },
    ],
    quoteChecks: ['Model and the foods normally cooked', 'Cooking surface and available counter space', 'Required control and plate configuration', 'Quantity, destination and installation requirements', 'Grease collection, cleaning access and spare parts'],
    faqs: [
      { question: 'Are these flat or grooved plates?', answer: 'Both listed models have a flat surface. If you need a grooved or mixed surface, add that request to your sourcing brief so we can check an appropriate option.' },
      { question: 'Why is only one model priced?', answer: 'We currently have an indicative reference for the ZH-818. The ZH-820 needs a quotation for the selected quantity and configuration; its price is not inferred from the smaller model.' },
      { question: 'Does the larger plate guarantee higher output?', answer: 'It provides more listed cooking area. Actual output depends on the food, batch layout, heat recovery and working method. Discuss a representative batch when requesting a sample or performance check.' },
      { question: 'Can I combine griddles with fryers?', answer: 'Yes. Use the shared equipment list to select both types, then request prices, packing and shipment coordination for the combination.' },
    ],
    reading: [{ slug: 'turkey-kitchen-equipment-dealers-china-sourcing-margin-checklist', title: 'Build a dealer margin calculation', copy: 'Include the purchase price, import costs and local selling costs.' }],
  },
];

export function categoryProducts(category) {
  return category.productIds.map(id => {
    const product = products.find(p => p.id === id);
    if (!product) throw new Error(`Unknown category product: ${id}`);
    const imageBase = `/commercial-kitchen-media/ddnz-products/${categoryImages[id]}-ddnz-v1`;
    return { ...product, image: `${imageBase}.webp`, imageSmall: `${imageBase}-600.webp` };
  });
}

export function kitchenModelHref(id) {
  if (!products.some(p => p.id === id)) throw new Error(`Unknown kitchen model: ${id}`);
  return `${KITCHEN_PATH}?model=${encodeURIComponent(id)}#commercial-kitchen-trade-pricing`;
}

export function requestedKitchenModel(search) {
  const id = new URLSearchParams(search).get('model');
  return products.find(p => p.id === id) || null;
}

export function kitchenCategorySchema(category) {
  const origin = 'https://www.ddnzglobal.com';
  const url = origin + category.path;
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', '@id': url, url, name: category.title, description: category.description, inLanguage: 'en',
      isPartOf: { '@id': origin + KITCHEN_PATH }, mainEntity: { '@type': 'ItemList', itemListElement: categoryProducts(category).map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: `${p.model} ${p.name}`, url: `${url}#model-${p.id}` })) } },
    { '@type': 'BreadcrumbList', itemListElement: [ ['Home', '/'], ['Products', '/products/'], ['Commercial kitchen equipment', KITCHEN_PATH], [category.label, category.path] ].map(([name, href], i) => ({ '@type': 'ListItem', position: i + 1, name, item: origin + href })) },
  ] };
}
