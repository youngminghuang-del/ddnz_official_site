import type { Language } from '../i18n/translations';
import { appendAttribution, readAttribution, type Attribution } from './attribution';

export type QuoteIntent = 'Product Sourcing' | 'Supplier Inspection & Consolidation' | 'Freight Export';

const PREFIX_BY_LANGUAGE: Record<Language, string> = {
  en: '',
  zh: '/zh-cn',
  ru: '/ru',
  fr: '/fr',
  es: '/es',
  ar: '/ar',
};

type QuoteLinkOptions = {
  intent: QuoteIntent;
  language?: Language;
  source: string;
  industry?: string;
  destination?: string;
  article?: string;
  subcategory?: string;
  attribution?: Attribution;
};

export function buildQuoteHref({
  intent,
  language = 'en',
  source,
  industry,
  destination,
  article,
  subcategory,
  attribution = readAttribution(),
}: QuoteLinkOptions) {
  const params = new URLSearchParams({ leadGoal: intent, source });
  if (industry) params.set('industry', industry);
  if (destination) params.set('dest', destination);
  if (article) params.set('article', article);
  if (subcategory) params.set('subcategory', subcategory);
  return appendAttribution(`${PREFIX_BY_LANGUAGE[language]}/get-a-quote?${params.toString()}`, attribution);
}
