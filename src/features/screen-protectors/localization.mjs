import { PRODUCTS, BASIS, cartonFacts } from './calculator.mjs';
import { PHONE_LOCALES } from './locales/localized.mjs';
import { productAlternates } from '../../lib/productLocalization.mjs';

export const PHONE_PRODUCT_IDS = Object.freeze(['og28', '001', 'titan-hd', 'titan-privacy']);
export const LOCALIZED_INQUIRY_SOURCE = 'screen_protector_localized';
export const localizedDraftKey = locale => { phoneCopy(locale); return 'ddnz_phone_localized_draft_v1'; };
export const LOCALIZED_SCREEN_PROTECTOR_ROUTES = Object.freeze(['zh','es','ar','ru','fr','pt','tr'].flatMap(locale => ['home', 'compare'].map(page => ({ locale, page, path: localizedPhonePath(locale, page) }))));
export function phoneCopy(locale) {
 locale=locale==='zh-cn'?'zh':locale;
  if (!Object.hasOwn(PHONE_LOCALES, locale)) throw new Error(`Unsupported phone locale: ${locale}`);
  return PHONE_LOCALES[locale];
}
export function localText(template, values = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ''));
}
export function localizedPhonePath(locale, page = 'home') {
  phoneCopy(locale);
  if (!['home', 'compare'].includes(page)) throw new Error(`Unsupported localized phone page: ${page}`);
  return `/${locale === 'zh' || locale === 'zh-cn' ? 'zh-cn' : locale}/screen-protectors/${page === 'compare' ? 'compare/' : ''}`;
}
export function phoneAlternates(path) {
  const alternates = productAlternates(path);
  const english = alternates.find(item => item.hrefLang === 'en');
  return english ? [...alternates, { hrefLang: 'x-default', href: english.href }] : [];
}
export const phoneNumber = (locale, value, digits = 0) => new Intl.NumberFormat(phoneCopy(locale).numberLocale, { maximumFractionDigits: digits }).format(value);
export const phoneMoney = (locale, value) => new Intl.NumberFormat(phoneCopy(locale).numberLocale, { style: 'currency', currency: 'CNY', currencyDisplay: 'code', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
export const phoneReferenceDate = locale => new Intl.DateTimeFormat(phoneCopy(locale).numberLocale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${BASIS.date}T00:00:00Z`));
export function localizedProduct(locale, id) {
  const copy = phoneCopy(locale);
  if (!PHONE_PRODUCT_IDS.includes(id)) throw new Error(`Unknown phone product: ${id}`);
  const product = PRODUCTS[id];
  return {
    id, product, name: copy.names[id], label: copy.labels[id],
    image: `/screen-protector-media/assets/${product.image}`,
    packing: localText(copy.packing[id], { contents: phoneNumber(locale, product.unitsPerCarton * product.kgPerUnit, 2), tare: phoneNumber(locale, product.tareKg, 2), grams: phoneNumber(locale, product.kgPerUnit * 1000, 2) }),
    fullKg: cartonFacts(product).fullKg,
  };
}

// Accept native Arabic digits and localized thousands separators, but never
// interpret Spanish decimal commas as thousands or silently round quantities.
export function parsePhoneQuantity(locale, value) {
  phoneCopy(locale);
  if (typeof value === 'number') return Number.isSafeInteger(value) ? value : NaN;
  let text = String(value ?? '').trim().replace(/[٠-٩]/g, char => String(char.charCodeAt(0) - 0x660)).replace(/[۰-۹]/g, char => String(char.charCodeAt(0) - 0x6f0));
  const grouped = ['es','pt','tr'].includes(locale) ? /^\d{1,3}(?:\.\d{3})+$/ : ['fr','ru'].includes(locale)?/^\d{1,3}(?:[ \u00a0\u202f]\d{3})+$/:/^\d{1,3}(?:٬\d{3})+$|^\d{1,3}(?:,\d{3})+$/;
  if (grouped.test(text)) text = text.replace(/[.٬, \u00a0\u202f]/g, '');
  return /^\d+$/.test(text) && Number.isSafeInteger(Number(text)) ? Number(text) : NaN;
}
export const emptyPhoneDraft = () => ({ rows: [], destination: '', notes: '' });

// The same tab keeps one selection across ES/AR. Parse quantities using the
// saved language before formatting them for the new language.
export function restoreLocalizedDraft(saved, locale) {
  phoneCopy(locale);
  const draft = saved?.draft;
  if (!['zh','es','ar','ru','fr','pt','tr'].includes(saved?.locale) || !Array.isArray(draft?.rows) || draft.rows.length > BASIS.maxRows
    || !draft.rows.every(row => row && PHONE_PRODUCT_IDS.includes(row.product) && typeof row.model === 'string'
      && row.model.length <= 80 && ['string', 'number'].includes(typeof row.qty))
    || typeof draft.destination !== 'string' || draft.destination.length > 120
    || typeof draft.notes !== 'string' || draft.notes.length > 1000) return null;
  return { rows: draft.rows.map(row => {
    const qty = parsePhoneQuantity(saved.locale, row.qty);
    return { product: row.product, model: row.model,
      qty: saved.locale === locale ? row.qty : Number.isSafeInteger(qty) ? phoneNumber(locale, qty) : '' };
  }), destination: draft.destination, notes: draft.notes };
}

export function validateLocalizedSelection(locale, draft) {
  const copy = phoneCopy(locale);
  const errors = [];
  const fail = (code, field, row, values = {}) => errors.push({ code, field, row, message: localText(copy.errors[code], { row: phoneNumber(locale, row + 1), ...values }) });
  const inputs = Array.isArray(draft?.rows) ? draft.rows : [];
  if (!inputs.length) fail('empty', 'rows', null);
  if (inputs.length > BASIS.maxRows) fail('rows', 'rows', null, { max: phoneNumber(locale, BASIS.maxRows) });
  const seen = new Set();
  const rows = inputs.slice(0, BASIS.maxRows).map((input, index) => {
    const product = PHONE_PRODUCT_IDS.includes(input?.product) ? input.product : '';
    const model = String(input?.model ?? '').trim().replace(/\s+/g, ' ');
    const qty = parsePhoneQuantity(locale, input?.qty);
    if (!product) fail('product', 'product', index);
    if (!model || model.length > 80) fail('model', 'model', index, { max: phoneNumber(locale, 80) });
    if (!Number.isSafeInteger(qty) || qty < (PRODUCTS[product]?.minQty ?? 1) || qty > BASIS.maxQty) fail('quantity', 'qty', index, { min: phoneNumber(locale, PRODUCTS[product]?.minQty ?? 1), max: phoneNumber(locale, BASIS.maxQty) });
    const identity = `${product}|${model.toLowerCase()}`;
    if (model && seen.has(identity)) fail('duplicate', 'model', index);
    seen.add(identity);
    return { product, model, qty };
  });
  const qty = rows.reduce((sum, row) => sum + (Number.isFinite(row.qty) ? row.qty : 0), 0);
  if (qty > BASIS.maxQty) fail('total', 'rows', null, { max: phoneNumber(locale, BASIS.maxQty) });
  const og28 = rows.filter(row => row.product === 'og28');
  const og28Qty = og28.reduce((sum, row) => sum + (Number.isFinite(row.qty) ? row.qty : 0), 0);
  if (og28.length && og28Qty < PRODUCTS.og28.minOrderQty) fail('og28', 'rows', null, { min: phoneNumber(locale, PRODUCTS.og28.minOrderQty), qty: phoneNumber(locale, og28Qty) });
  const destination = String(draft?.destination ?? '').trim();
  const notes = String(draft?.notes ?? '').trim();
  if (destination.length < 2 || destination.length > 120) fail('destination', 'destination', null, { max: phoneNumber(locale, 120) });
  if (notes.length > 1000) fail('notes', 'notes', null, { max: phoneNumber(locale, 1000) });
  if (errors.length) return { valid: false, errors, state: null, summary: null };
  // Integer cents avoid floating-point drift; no freight, taxes or FX inference.
  const goodsCny = rows.reduce((sum, row) => sum + row.qty * Math.round(PRODUCTS[row.product].price * 100), 0) / 100;
  return { valid: true, errors, state: { rows, destination, notes }, summary: { pieces: qty, goodsCny } };
}

export function localizedInquiryBrief(locale, result) {
  if (!result.valid) throw new Error('A valid product selection is required.');
  const copy = phoneCopy(locale);
  return [copy.briefHeading, localText(copy.reference, { date: phoneReferenceDate(locale) }),
    `${copy.destination}: ${result.state.destination}`, '',
    ...result.state.rows.map(row => localText(copy.briefLine, { product: copy.names[row.product], model: row.model, qty: phoneNumber(locale, row.qty), price: phoneMoney(locale, PRODUCTS[row.product].price) })), '',
    `${copy.totalPieces}: ${phoneNumber(locale, result.summary.pieces)} ${copy.pieces}`,
    `${copy.goods}: ${phoneMoney(locale, result.summary.goodsCny)}`, copy.priceScope, '',
    ...[...new Set(result.state.rows.map(row => row.product))].flatMap(id => {
      const item = localizedProduct(locale, id);
      return [`${item.name}: ${copy.carton}: ${phoneNumber(locale, item.product.unitsPerCarton)}; ${copy.dimensions}: ${item.product.cartonCm.map(n => phoneNumber(locale, n, 2)).join(' × ')} ${copy.cm}; ${copy.weight}: ${phoneNumber(locale, item.fullKg, 2)} ${copy.kg}.`, item.packing];
    }), copy.briefConfirm, ...(result.state.notes ? ['', `${copy.notes}: ${result.state.notes}`] : []),
  ].join('\n');
}
export function localizedQuoteHref(locale, destination = '', { attached = true } = {}) {
  phoneCopy(locale);
  const params = new URLSearchParams({ leadGoal: 'Product Sourcing', industry: 'Mobile Accessories', subcategory: 'Screen protectors', source: attached ? LOCALIZED_INQUIRY_SOURCE : 'screen_protector_localized_manual', phoneLocale: locale });
  if (destination.trim()) params.set('dest', destination.trim());
  return `/${locale==='zh'?'zh-cn':locale}/get-a-quote/?${params}`;
}
export function validateLocalizedHandoff(value, now = Date.now()) {
  if (value?.version !== 2 || value.source !== LOCALIZED_INQUIRY_SOURCE || !['zh','es','ar','ru','fr','pt','tr'].includes(value.locale)
    || !Number.isFinite(value.createdAt) || now - value.createdAt > 86400000 || value.createdAt > now + 60000) return null;
  const result = validateLocalizedSelection(value.locale, value.state);
  if (!result.valid) return null;
  return { version: 2, source: LOCALIZED_INQUIRY_SOURCE, locale: value.locale, createdAt: value.createdAt, basisDate: BASIS.date,
    state: result.state, summary: result.summary, brief: localizedInquiryBrief(value.locale, result) };
}
