import en from './locales/en.json' with { type: 'json' };
import es from './locales/es.json' with { type: 'json' };
import ar from './locales/ar.json' with { type: 'json' };
import { buyerGuidePaths, localizedProductPath, productRouteParts } from '../../lib/productLocalization.mjs';

export const buyerLocales = { en, es, ar };
export const buyerGuides = [
  { id: 'kitchen-distributors', path: buyerGuidePaths[0], group: 'kitchen', image: '/commercial-kitchen-media/ddnz-products/ice-49-ddnz-v1.webp', modelIds: ['ice-49', 'ZH-101V'] },
  { id: 'restaurant-projects', path: buyerGuidePaths[1], group: 'kitchen', image: '/commercial-kitchen-media/kitchen-hero.webp', modelIds: ['cold-7', 'ZH-818'] },
  { id: 'phone-stores', path: buyerGuidePaths[2], group: 'phone', image: '/screen-protector-media/assets/001-kit-photo.jpg', modelIds: ['og28', '001'] },
  { id: 'private-label', path: buyerGuidePaths[3], group: 'phone', image: '/screen-protector-media/assets/titan-kit.jpg', modelIds: ['titan-hd', 'titan-privacy'] },
];
export const buyerGroupPath = group => group === 'kitchen' ? '/sourcing/commercial-kitchen-equipment-from-china' : '/screen-protectors';
export function buyerGuideForPath(path) { return buyerGuides.find(guide => guide.path === productRouteParts(path).path); }
export function buyerLocale(locale) { return Object.hasOwn(buyerLocales, locale) ? locale : 'en'; }
export function buyerMeta(guide, locale = 'en') {
  const copy = buyerLocales[buyerLocale(locale)].guides[guide.id];
  return { title: copy.title, description: copy.description, image: guide.image, path: localizedProductPath(guide.path, locale) };
}
export function buyerSchema(guide, locale = 'en') {
  const copy = buyerLocales[buyerLocale(locale)];
  const meta = buyerMeta(guide, locale);
  const origin = 'https://www.ddnzglobal.com';
  const url = origin + meta.path;
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', '@id': url, url, name: meta.title, description: meta.description, inLanguage: locale,
      breadcrumb: { '@id': `${url}#breadcrumb` }, isPartOf: { '@id': `${origin}/#website` } },
    { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
      { '@type': 'ListItem', position: 1, name: copy.home, item: `${origin}${locale === 'en' ? '/' : `/${locale}/`}` },
      { '@type': 'ListItem', position: 2, name: copy[guide.group], item: origin + localizedProductPath(buyerGroupPath(guide.group), locale) },
      { '@type': 'ListItem', position: 3, name: copy.guides[guide.id].card, item: url },
    ] },
  ] };
}

const clean = (value, limit = 2000) => String(value ?? '').replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').trim().slice(0, limit);
export function validateBuyerBrief(guide, input) {
  const errors = {};
  for (const field of ['name', 'country', guide.fields[0].key]) if (!clean(input[field])) errors[field] = 'required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(input.email, 254)) || String(input.email || '').length > 254) errors.email = 'invalidEmail';
  return errors;
}
export function buildBuyerPayload(guide, locale, input) {
  const copy = buyerLocales[buyerLocale(locale)];
  const page = copy.guides[guide.id];
  const f = copy.form;
  return {
    name: clean(input.name, 100), email: clean(input.email, 254),
    subject: `${page.card} — DDNZ ${f.request}`,
    message: [page.card, `${f.country}: ${clean(input.country, 100)}`,
      input.company && `${f.company}: ${clean(input.company, 120)}`,
      ...page.fields.map(field => `${field.label}: ${clean(input[field.key]) || '—'}`),
      input.notes && `${f.notesLabel}: ${clean(input.notes)}`,
    ].filter(Boolean).join('\n\n'),
  };
}
// Analytics only receive fixed vocabulary, never a country or buyer's free text.
export function buyerJourneyAnalytics(id, locale, action) {
  if (!buyerGuides.some(guide => guide.id === id) || !Object.hasOwn(buyerLocales, locale)
    || !['open_guide', 'view_range', 'start_brief', 'submit_success', 'submit_error'].includes(action)) return null;
  return { event: action === 'submit_success' ? 'generate_lead' : 'buyer_guide_action',
    params: { form_id: 'buyer_brief', buyer_guide: id, content_language: locale, exploration_action: action } };
}
