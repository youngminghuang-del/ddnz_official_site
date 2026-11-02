import copy from './copy.json';
import markets from './markets.json';
import {destinationForm} from '../destinationGrammar';
export const newMarketLocales=['en','zh','es','ar','fr','ru','pt','tr'] as const;
export type NewMarketLocale=typeof newMarketLocales[number];
export type NewMarket=keyof typeof markets;
export const newMarkets=Object.keys(markets) as NewMarket[];
export const isNewMarket=(country:string):country is NewMarket=>Object.hasOwn(markets,country);
export const marketInfo=(country:NewMarket)=>markets[country];
export const marketCopy=(locale:NewMarketLocale)=>copy[locale];
export const marketPrefix=(locale:NewMarketLocale)=>locale==='en'?'':locale==='zh'?'/zh-cn':`/${locale}`;
export function newMarketMetadata(country:NewMarket,locale:NewMarketLocale){const c=copy[locale],m=markets[country],name=new Intl.DisplayNames([locale==='zh'?'zh-CN':locale],{type:'region'}).of(m.iso)!;return {name,title:c.title.replace('{name}',destinationForm(m.iso,locale,name)),description:`${c.description} ${m.notes[locale]}`,path:`${marketPrefix(locale)}/shipping-from-china-to-${country}/`};}
export const newMarketAlternates=(country:NewMarket)=>newMarketLocales.map(locale=>({hrefLang:locale==='zh'?'zh-CN':locale,href:`https://www.ddnzglobal.com${marketPrefix(locale)}/shipping-from-china-to-${country}/`}));
