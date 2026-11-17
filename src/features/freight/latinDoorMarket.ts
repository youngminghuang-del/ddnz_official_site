import {COMPANY} from '../../config/companyIdentity';
import {ecuadorCopy, ecuadorLocales, ecuadorPrefix, type EcuadorLocale} from './ecuadorCopy';
import copy from './latinDoorCopy.json';

export const latinDoorMarkets = {
  ecuador: {iso:'EC', port:'GUAYAQUIL', clearance:'ECUAPASS · DAI', service:'/sourcing-services/consolidation-export/', authority:'SENAE', authorityUrl:'https://www.aduana.gob.ec/servicio-al-ciudadano/para-importar/'},
  'dominican-republic': {iso:'DO', port:'CAUCEDO', clearance:'SIGA · DUA', service:'/services/sea-freight/', authority:'DGA', authorityUrl:'https://www.aduanas.gob.do/preguntas-frecuentes/'},
} as const;

export type LatinDoorMarket = keyof typeof latinDoorMarkets;
export const isLatinDoorMarket = (value: string): value is LatinDoorMarket => Object.hasOwn(latinDoorMarkets,value);
export const latinDoorPath = (market: LatinDoorMarket, locale: EcuadorLocale) => `${ecuadorPrefix(locale)}/shipping-from-china-to-${market}/`;
export const latinDoorCopy = (market: LatinDoorMarket, locale: EcuadorLocale) => copy[market][locale];
export function latinDoorInfo(market: LatinDoorMarket, locale: EcuadorLocale) {
  const data=latinDoorMarkets[market];
  const {title,intro}=latinDoorCopy(market,locale);
  const language=locale==='zh'?'zh-CN':locale;
  const name=new Intl.DisplayNames([language],{type:'region'}).of(data.iso)!;
  const provider=locale==='zh'?COMPANY.freightZh:COMPANY.freightEn;
  return {slug:market, locale, prefix:ecuadorPrefix(locale), name, title:title+' | DDNZ', description:intro, language, provider};
}
export const latinDoorAlternates = (market: LatinDoorMarket) => [
  ...ecuadorLocales.map(locale=>({hrefLang:locale==='zh'?'zh-CN':locale,href:'https://www.ddnzglobal.com'+latinDoorPath(market,locale)})),
  {hrefLang:'x-default',href:'https://www.ddnzglobal.com'+latinDoorPath(market,'en')},
];
export function latinDoorTrail(market: LatinDoorMarket, locale: EcuadorLocale) {
  const {home,region}=ecuadorCopy[locale];
  const {prefix,name}=latinDoorInfo(market,locale);
  return [{name:home,path:prefix+'/'},{name:region,path:prefix+'/shipping-from-china-to-latin-america/'},{name,path:latinDoorPath(market,locale)}];
}
