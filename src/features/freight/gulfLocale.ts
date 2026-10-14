import type { Language } from '../../i18n/translations';
import { freightLanguages, freightLanguagePrefix } from './freightLanguages';
export type GulfLocale = Language;
export type Localized<T = string> = Record<GulfLocale, T>;
export const gulfLocales = freightLanguages;
export const gulfLanguageTag = (locale: GulfLocale) => locale === 'zh' ? 'zh-CN' : locale;
export const gulfLanguagePrefix = freightLanguagePrefix;
export const gulfLanguageNames: Localized = { en: 'English', zh: '中文', ru: 'Русский', fr: 'Français', es: 'Español', ar: 'العربية', pt: 'Português', tr: 'Türkçe' };
export function gulfLocaleFromPath(pathname: string): GulfLocale {
 const segment = pathname.split('/')[1];
 if (segment === 'zh-cn') return 'zh';
 return gulfLocales.find(locale => locale === segment) || 'en';
}
