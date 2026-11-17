import { COMPANY } from '../../../config/companyIdentity';
import { freightDestinationLanguages, navigationPrefixes } from '../../../lib/productLanguageRouting';
import type { Language } from '../../../i18n/translations';
import { localizedPacificPort } from '../locales/index.mjs';
import countryCopy from './countryCopy.json';
import sharedCopy from './sharedCopy.json';
import pacificCopy from './pacificCopy.json';
import eastAsiaCopy from './eastAsiaCopy.json';

import southeastAsiaCopy from './southeastAsiaCopy.json';

const seaMarketCopy = {...pacificCopy, ...eastAsiaCopy, ...southeastAsiaCopy};

export { sharedCopy };
export type CandidateLocale = Language;
export const candidateLocales = freightDestinationLanguages;
export const europeCandidateSlugs = ['netherlands', 'united-kingdom', 'france'] as const;
export const pacificCountrySlugs = ['canada', 'australia'] as const;
export const eastAsiaCountrySlugs = ['japan', 'south-korea'] as const;
export const southeastAsiaCountrySlugs = ['vietnam', 'malaysia', 'singapore'] as const;
export const pacificCandidateSlugs = [...pacificCountrySlugs, ...eastAsiaCountrySlugs, ...southeastAsiaCountrySlugs] as const;
export const candidateSlugs = [...europeCandidateSlugs,...pacificCandidateSlugs] as const;
export type PacificCandidate = typeof pacificCandidateSlugs[number];
export const isPacificCandidate = (slug: string): slug is PacificCandidate => pacificCandidateSlugs.includes(slug as PacificCandidate);
const seaLabels = {en:'Sea freight',zh:'海运服务',es:'Flete marítimo',fr:'Fret maritime',ru:'Морские перевозки',ar:'الشحن البحري',pt:'Frete marítimo',tr:'Deniz taşımacılığı'};
export const candidateSeaLabel = (locale: CandidateLocale) => seaLabels[locale];
export const pacificCountryCopy = (country:PacificCandidate,locale:CandidateLocale) => seaMarketCopy[country][locale];
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
 canada: { iso:'CA', gateway:'Vancouver', airport:'YVR' },
 australia: { iso:'AU', gateway:'Sydney', airport:'SYD' },
 japan: { iso:'JP', gateway:'Tokyo', airport:'NRT / HND' },
 'south-korea': { iso:'KR', gateway:'Busan', airport:'ICN' },
 vietnam: {iso:'VN',gateway:'Ho Chi Minh City · Cat Lai',airport:'SGN'},
 malaysia: {iso:'MY',gateway:'Port Klang',airport:'KUL'},
 singapore: {iso:'SG',gateway:'Singapore',airport:'SIN'},
} as const;

export function candidateCopy(country: CandidateCountry, locale: CandidateLocale) {
 return { ...sharedCopy[locale], ...(isPacificCandidate(country) ? pacificCountryCopy(country,locale) : countryCopy[country][locale]) };
}
const southeastQuotePorts = { vietnam: 'HOCHIMINH CAT LAI', malaysia: 'PORT KELANG', singapore: 'SINGAPORE' } as const;
export function candidateQuoteDestination(country: CandidateCountry, locale: CandidateLocale, name: string) {
 const quotePort = southeastQuotePorts[country as keyof typeof southeastQuotePorts];
 const gateway = quotePort ? localizedPacificPort(quotePort,locale) : candidateData[country].gateway;
 return gateway && gateway !== name ? `${name} · ${gateway}` : name;
}

export const pacificMarketBadges = {
 canada: ['CARM / RM','GST / RPP','Vancouver','CARM · BN9 / RM'],
 australia: ['BICON','ABF / GST','ISPM 15','BICON · ISPM 15'],
 japan: ['NACCS','HS','AFR','NACCS · AFR'],
 'south-korea': ['UNI-PASS','HS / FTA','Busan','UNI-PASS · HS'],
 vietnam: ['VNACCS','HS','Cat Lai','VNACCS · CAT LAI'],
 malaysia: ['K1','HS','Westports / Northport','K1 · PORT KLANG'],
 singapore: ['TradeNet','GST','FTZ','TradeNet · GST'],
} as const;
const origin = 'https://www.ddnzglobal.com';

export function candidateInfo(slug: CandidateCountry, locale: CandidateLocale) {
 const {name,title,intro} = candidateCopy(slug, locale);
 return {slug, locale, prefix:candidatePrefix(locale), name, url:origin+candidatePath(slug,locale), title:title+' | DDNZ', description:intro, language:candidateLanguage(locale)};
}

export function candidateTrail(slug: CandidateCountry, locale: CandidateLocale) {
 const p = candidateInfo(slug,locale);
 const c = candidateCopy(slug, locale);
 return [{name:c.home,path:p.prefix+'/'},(isPacificCandidate(slug) ? {name:candidateSeaLabel(locale),path:p.prefix+'/services/sea-freight/'} : {name:c.europe,path:p.prefix+'/shipping-from-china-to-europe/'}),{name:p.name,path:candidatePath(slug,locale)}];
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
