import catalog from './products.mjs';
import launch from './launch.mjs';
import benchmarks from './benchmarks.mjs';
import { categoryProducts, kitchenCategories } from './categories.mjs';
import { buildInquiryPayload, validateInquiryContact } from './inquiry.mjs';
import { calculateMargin } from './model.mjs';
import { localizedProductPath, productAlternates } from '../../../lib/productLocalization.mjs';
import es from '../locales/es.mjs';
import ar from '../locales/ar.mjs';

export const LOCALIZED_KITCHEN_PATH = '/sourcing/commercial-kitchen-equipment-from-china/';
export const KITCHEN_LIST_STORAGE_KEY = 'ddnz-kitchen-list-v1';
export const kitchenLocales = Object.freeze({ es, ar });
export function kitchenCopy(locale) {
  if (!Object.hasOwn(kitchenLocales, locale)) throw new RangeError(`Unsupported kitchen locale: ${locale}`);
  return kitchenLocales[locale];
}
// Pin numbering systems: browser and Node ICU defaults for plain "ar" can differ.
export const localNumber = (value, locale, options = {}) => new Intl.NumberFormat(kitchenCopy(locale).numberLocale, { numberingSystem: locale === 'ar' ? 'arab' : 'latn', ...options }).format(value);
export const localMoney = (value, currency, locale) => `${currency} ${localNumber(value, locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Translate human-readable values while retaining the catalogue's numerical basis.
export function localSpecValue(value, locale) {
  const t = kitchenCopy(locale);
  const translated = t.values[value] || String(value).replace(/ to /g, locale === 'ar' ? ' إلى ' : ' a ');
  return translated.replace(/\d+(?:,\d{3})*(?:\.\d+)?/g, number => localNumber(Number(number.replaceAll(',', '')), locale))
    .replace(/(\d|[٠-٩])mm\b/g, '$1 mm');
}

const brandedProducts = new Map(kitchenCategories.flatMap(categoryProducts).map(product => [product.id, product]));
export function getLocalizedKitchenProducts(locale) {
  const t = kitchenCopy(locale);
  const ordered = [...launch.featuredProductIds.map(id => catalog.find(product => product.id === id)), ...catalog.filter(product => !launch.featuredProductIds.includes(product.id))];
  return ordered.map(product => {
    const photo = brandedProducts.get(product.id);
    return {
      ...product,
      name: t.names[product.name], categoryLabel: t.categories[product.category],
      displayModel: t.values[product.model] ? localSpecValue(product.model, locale) : product.model,
      metric: localSpecValue(product.metric, locale), detail: localSpecValue(product.detail, locale),
      dimensions: localSpecValue(product.dimensions, locale), note: t.notes[product.note.trim()],
      configurationNote: product.quote?.configurationNote ? t.notes[product.quote.configurationNote] : '',
      image: photo?.image || product.image, imageSmall: photo?.imageSmall,
      imageNote: product.imageNote ? t.notes[product.note.trim()] : t.ui.catalogPhoto,
      localizedSpecs: Object.entries(product.specs).map(([key, value]) => ({ key, label: t.specLabels[key], value: localSpecValue(value, locale) })),
    };
  });
}

const normalizeDigits = value => String(value ?? '').replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 0x660)).replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 0x6f0));
export function parseKitchenQuantity(value) {
  const text = normalizeDigits(value).trim();
  if (!/^\d{1,4}$/.test(text)) return null;
  const number = Number(text);
  return number >= 1 && number <= 9999 ? number : null;
}

// No grouping separators: "1.000" must not silently become either 1 or 1000.
export function parseKitchenMoney(value, locale) {
  kitchenCopy(locale);
  let text = normalizeDigits(value).trim().replace('٫', '.');
  if (locale === 'es') text = text.replace(',', '.');
  if (!/^\d{1,9}(?:\.\d{1,2})?$/.test(text)) return null;
  const amount = Number(text);
  return amount <= 999999999 ? amount : null;
}
export function calculateLocalizedKitchenMargin(locale, { productId, units, selling, landed } = {}) {
  const t = kitchenCopy(locale), product = catalog.find(item => item.id === productId && item.quote?.status === 'indicative');
  const count = parseKitchenQuantity(units), sale = parseKitchenMoney(selling, locale), extras = parseKitchenMoney(landed, locale);
  const errors = {};
  if (!product) errors.productId = t.margin.model;
  if (count === null) errors.units = t.ui.quantityError;
  else if (product && count < product.quote.minUnits) errors.units = t.margin.below;
  if (sale === null || sale <= 0) errors.selling = t.margin.sellingError;
  if (extras === null) errors.landed = t.margin.landedError;
  if (Object.keys(errors).length) return { result: null, errors };
  return { result: calculateMargin({ purchase: product.quote.price, selling: sale, landed: extras, units: count }), errors };
}
export function cleanKitchenSelection(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  return Object.fromEntries(catalog.flatMap(product => {
    const units = Object.hasOwn(raw, product.id) ? parseKitchenQuantity(raw[product.id]) : null;
    return units === null ? [] : [[product.id, units]];
  }));
}
export function addKitchenSelection(list, items) {
  const next = cleanKitchenSelection(list);
  for (const [id, units] of Object.entries(cleanKitchenSelection(items))) next[id] = Math.min(9999, (next[id] || 0) + units);
  return next;
}
export function toggleKitchenComparison(current, id) {
  const valid = [...new Set(current)].filter(candidate => catalog.some(product => product.id === candidate)).slice(0, 3);
  if (!catalog.some(product => product.id === id)) return { ids: valid, limited: false };
  if (valid.includes(id)) return { ids: valid.filter(candidate => candidate !== id), limited: false };
  return valid.length === 3 ? { ids: valid, limited: true } : { ids: [...valid, id], limited: false };
}
const searchText = value => normalizeDigits(value).normalize('NFD').replace(/\p{M}/gu, '').replace(/[أإآ]/g, 'ا').replace(/ـ/g, '').toLocaleLowerCase().trim();
export function filterKitchenProducts(products, { category = '', search = '' } = {}) {
  const query = searchText(search);
  return products.filter(product => (!category || product.category === category) && searchText([
    product.id, product.model, product.displayModel, product.name, product.categoryLabel, product.metric, product.detail, product.dimensions,
    ...product.localizedSpecs.flatMap(spec => [spec.label, spec.value]),
  ].join(' ')).includes(query));
}

export function getLocalizedKitchenMetadata(locale) {
  const t = kitchenCopy(locale);
  const canonicalPath = localizedProductPath(LOCALIZED_KITCHEN_PATH, locale);
  const canonicalUrl = `https://www.ddnzglobal.com${canonicalPath}`;
  const products = getLocalizedKitchenProducts(locale);
  return {
    ...t.meta, contentLanguage: locale, canonicalPath, canonicalUrl,
    alternateUrls: productAlternates(LOCALIZED_KITCHEN_PATH), image: '/commercial-kitchen-media/kitchen-hero.webp',
    structuredData: { '@context': 'https://schema.org', '@graph': [
      { '@type': 'CollectionPage', '@id': canonicalUrl, url: canonicalUrl, name: t.meta.title, description: t.meta.description, inLanguage: locale,
        mainEntity: { '@type': 'ItemList', numberOfItems: products.length, itemListElement: products.map((product, index) => ({ '@type': 'ListItem', position: index + 1, name: `${product.displayModel} ${product.name}`, url: `${canonicalUrl}#model-${product.id}` })) } },
      { '@type': 'FAQPage', '@id': `${canonicalUrl}#commercial-kitchen-faq`, inLanguage: locale, mainEntity: t.faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
    ] },
  };
}

export function getLocalizedKitchenBenchmarks(locale) {
  const t = kitchenCopy(locale);
  return benchmarks.map(reference => ({ ...reference, ...t.benchmarks[reference.id], countryLabel: t.countries[reference.country] }));
}
export function getLocalizedKitchenAssortments(locale) {
  const t = kitchenCopy(locale);
  return launch.assortments.map((assortment, index) => ({ ...assortment, ...t.assortments[index], selection: Object.fromEntries(assortment.items.map(item => [item.productId, item.defaultQty])) }));
}

export function kitchenReferenceStatus(product, units) {
  if (product.quote?.status !== 'indicative') return 'pending';
  return parseKitchenQuantity(units) < product.quote.minUnits ? 'below' : 'reference';
}

export function validateLocalizedKitchenInquiry(locale, { name = '', email = '', list = {}, form = {} } = {}) {
  const t = kitchenCopy(locale).ui;
  const sharedErrors = validateInquiryContact({ name, email });
  const errors = {};
  if (sharedErrors.name) errors.name = t.nameError;
  if (sharedErrors.email) errors.email = t.emailError;
  if (!Object.keys(cleanKitchenSelection(list)).length) errors.list = t.listError;
  if (!String(form.country || '').trim()) errors.country = t.countryError;
  return errors;
}

// The existing payload builder owns sanitation, quantity tiers and message facts.
// Translate its fixed labels; keep user-authored requirements and model codes intact.
export function buildLocalizedKitchenInquiry(locale, { list = {}, form = {}, name = '', email = '' } = {}) {
  const t = kitchenCopy(locale);
  const selected = cleanKitchenSelection(list);
  const localizedForm = { ...form, country: t.countries[form.country] || form.country, type: t.buyerTypes[form.type] || t.buyerTypes.importer, buyingTargets: {} };
  const payload = buildInquiryPayload({ products: catalog, list: selected, form: localizedForm, name, email });
  const products = getLocalizedKitchenProducts(locale);
  const translateLine = line => {
    if (!line) return '';
    if (line === 'DDNZ commercial kitchen enquiry') return t.inquiry.heading;
    if (line === 'Requested models:') return `${t.inquiry.requested}:`;
    if (line.startsWith('Please confirm configuration,')) return t.inquiry.final;
    if (line === '- No valid models selected; please describe the equipment needed.') return t.ui.emptyList;
    for (const [prefix, label] of [['Destination: ', t.inquiry.destination], ['Buyer type: ', t.inquiry.buyer], ['Company: ', t.inquiry.company], ['Preferred contact: ', t.inquiry.contact], ['Buyer notes: ', t.inquiry.notes]]) {
      if (line.startsWith(prefix)) return `${label}: ${line.slice(prefix.length).replace(/^To confirm(?= \(|$)/, t.inquiry.toConfirm)}`;
    }
    const counts = line.match(/^Products: (\d+) models? \/ (\d+) units?$/);
    if (counts) return `${t.inquiry.products}: ${localNumber(Number(counts[1]), locale)} / ${localNumber(Number(counts[2]), locale)}`;
    const model = line.match(/^- (.+) × (\d+)$/);
    if (model) return `- ${products.find(product => product.model === model[1])?.displayModel || model[1]} × ${localNumber(Number(model[2]), locale)}`;
    const reference = line.match(/^  Indicative reference: (\w+) ([\d,.]+) \/ unit \(based on (\d+) units?; subject to quotation\)\.$/);
    if (reference) return `  ${t.inquiry.reference}: ${localMoney(Number(reference[2].replaceAll(',', '')), reference[1], locale)} ${t.ui.perUnit} (${t.inquiry.tier}: ${localNumber(Number(reference[3]), locale)} ${t.ui.units}). ${t.ui.quoteOnly}`;
    const below = line.match(/^  Quantity is below the (\d+)-unit indicative reference; please quote this quantity\.$/);
    if (below) return `  ${t.inquiry.below} (${t.inquiry.tier}: ${localNumber(Number(below[1]), locale)} ${t.ui.units}).`;
    throw new Error('The shared kitchen inquiry message has an untranslated line.');
  };
  return { ...payload, subject: `${t.inquiry.subject} — ${localNumber(Object.keys(selected).length, locale)} / ${localNumber(Object.values(selected).reduce((sum, units) => sum + units, 0), locale)}`, message: `${payload.message.split('\n').map(translateLine).join('\n')}\n\n${t.ui.electricity}\n${t.ui.priceCosts}` };
}
