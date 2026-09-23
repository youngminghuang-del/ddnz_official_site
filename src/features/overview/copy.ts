import zh from './locales/zh.json';
import es from './locales/es.json';
import ar from './locales/ar.json';
import ru from './locales/ru.json';
import fr from './locales/fr.json';
import pt from './locales/pt.json';
import tr from './locales/tr.json';
import { entryKeywords } from '../search-intent/entry-keywords.mjs';
export const overviewCopy = {
  zh: {...zh, ...entryKeywords.zh}, es: {...es, ...entryKeywords.es},
  ar: {...ar, ...entryKeywords.ar}, ru: {...ru, ...entryKeywords.ru},
  fr: {...fr, ...entryKeywords.fr}, pt: {...pt, ...entryKeywords.pt},
  tr: {...tr, ...entryKeywords.tr},
};
export type OverviewLocale = keyof typeof overviewCopy;
export type OverviewKind = 'products' | 'sourcing-services';
export const overviewLanguages = ['en','zh-cn','es','ar','ru','fr','pt','tr'];
export function overviewMeta(kind: OverviewKind, lang: string) {
  const locale = (lang === 'zh-cn' ? 'zh' : lang) as OverviewLocale;
  const copy = overviewCopy[locale];
  if (!copy) throw new Error(`Missing overview locale: ${lang}`);
  return { keywords: kind === 'products' ? copy.productsTitle : copy.servicesTitle, title: kind === 'products' ? copy.productsMetaTitle : copy.servicesMetaTitle, desc: kind === 'products' ? copy.productsIntro : copy.servicesIntro };
}
export function overviewAlternates(kind: OverviewKind) {
  return overviewLanguages.map(hrefLang => ({ hrefLang, href: `https://www.ddnzglobal.com/${hrefLang === 'en' ? '' : `${hrefLang}/`}${kind}/` }));
}
