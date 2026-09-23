import type { Language } from '../../i18n/translations';
export const freightLanguages: Language[] = ['en','zh','ru','fr','es','ar','pt','tr'];
export const establishedFreightServiceLanguages: Language[] = [...freightLanguages];
export const freightLanguagePrefix = (locale: Language) => locale === 'en' ? '' : locale === 'zh' ? '/zh-cn' : `/${locale}`;
export const freightAlternates = (path: string, languages: Language[] = freightLanguages) => [
  ...languages.map(locale => ({hrefLang: locale === 'zh' ? 'zh-CN' : locale, href: `https://www.ddnzglobal.com${freightLanguagePrefix(locale)}${path}`})),
  {hrefLang:'x-default', href:`https://www.ddnzglobal.com${path}`},
];
