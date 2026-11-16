import { COMPANY } from '../../../config/companyIdentity';
import { freightDestinationLanguages, navigationPrefixes } from '../../../lib/productLanguageRouting';
import type { Language } from '../../../i18n/translations';
import countryCopy from './countryCopy.json';
import sharedCopy from './sharedCopy.json';

export { sharedCopy };
export type CandidateLocale = Language;
export const candidateLocales = freightDestinationLanguages;
export const candidateSlugs = ['netherlands', 'united-kingdom', 'france'] as const;
export type CandidateCountry = typeof candidateSlugs[number];
export const isCandidate = (slug: string): slug is CandidateCountry => candidateSlugs.includes(slug as CandidateCountry);
export const candidatePrefix = (locale: CandidateLocale) => navigationPrefixes[locale];
export const candidateLanguage = (locale: CandidateLocale) => locale === 'zh' ? 'zh-CN' : locale;
export function candidateLocale(language: string): CandidateLocale | undefined {
 const normalized = language.toLowerCase().replace(/^zh-cn$/, 'zh');
 return candidateLocales.find(locale => locale === normalized);
}
export const candidatePath = (slug: CandidateCountry, locale: CandidateLocale) => `${candidatePrefix(locale)}/shipping-from-china-to-${slug}/`;
export const candidateData = {
 netherlands: { iso: 'NL', gateway: 'Rotterdam', airport: 'AMS' },
 'united-kingdom': { iso: 'GB', gateway: 'Southampton', airport: 'LHR' },
 france: { iso: 'FR', gateway: 'Le Havre', airport: 'CDG' },
} as const;

export function candidateCopy(country: CandidateCountry, locale: CandidateLocale) {
 return { ...sharedCopy[locale], ...countryCopy[country][locale] };
}
const origin = 'https://www.ddnzglobal.com';

export function candidateInfo(slug: CandidateCountry, locale: CandidateLocale) {
 const {name,title,intro} = candidateCopy(slug, locale);
 return {slug, locale, prefix:candidatePrefix(locale), name, url:origin+candidatePath(slug,locale), title:title+' | DDNZ', description:intro, language:candidateLanguage(locale)};
}

export function candidateTrail(slug: CandidateCountry, locale: CandidateLocale) {
 const p = candidateInfo(slug,locale);
 const c = candidateCopy(slug, locale);
 return [{name:c.home,path:p.prefix+'/'},{name:c.europe,path:p.prefix+'/shipping-from-china-to-europe/'},{name:p.name,path:candidatePath(slug,locale)}];
}

export function candidateSchema(slug: CandidateCountry, locale: CandidateLocale) {
 const p = candidateInfo(slug,locale);
 const c = candidateCopy(slug, locale);
 return {'@context':'https://schema.org','@graph':[
  {'@type':'WebPage','@id':p.url,url:p.url,name:p.title,description:p.description,inLanguage:p.language,breadcrumb:{'@id':p.url+'#breadcrumb'},mainEntity:{'@id':p.url+'#service'}},
  {'@type':'Service','@id':p.url+'#service',url:p.url,name:c.title,description:p.description,serviceType:c.serviceType,areaServed:{'@type':'Country',name:p.name,identifier:candidateData[slug].iso},provider:{'@type':'Organization','@id':origin+'/#heaven-born',name:locale==='zh'?COMPANY.freightZh:COMPANY.freightEn},mainEntityOfPage:{'@id':p.url}},
  {'@type':'BreadcrumbList','@id':p.url+'#breadcrumb',itemListElement:candidateTrail(slug,locale).map((b,i)=>({'@type':'ListItem',position:i+1,name:b.name,item:origin+b.path}))},
 ]};
}
