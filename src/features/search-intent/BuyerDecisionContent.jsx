import {translatedText,translatedTree} from '../site-localization/translate.mjs';
import {navigationPath} from '../../lib/productLanguageRouting';
import React from 'react';
import { buyerQuestions } from './buyer-questions.mjs';
import { sourcingQuestions } from './sourcing-questions.mjs';
import { decisionLocales } from './decision-locales.mjs';
export default function BuyerDecisionContent({page,locale='en'}) {
 if(!buyerQuestions[page])return null;
 const reviewed = page === 'sourcing-services' ? sourcingQuestions[locale] : decisionLocales[locale]?.[page];
 const items = reviewed ? reviewed.map(([q,a,label],i)=>({q,a,label,href:buyerQuestions[page][i].href})) : translatedTree(buyerQuestions[page],locale);
 const sourcingHeading = {zh:'选择适合订单的中国采购支持',es:'Elija el apoyo de compras en China que necesita',ar:'اختر خدمات الشراء من الصين المناسبة لطلبك',ru:'Выберите подходящие услуги по закупкам в Китае',fr:'Choisissez votre accompagnement achats en Chine',pt:'Escolha o apoio de compras na China para seu pedido',tr:'Siparişinize uygun Çin’den satın alma desteğini seçin'};
 const heading={products:'Choose products around the order you need to place.','sourcing-services':'Choose the right China sourcing support.','how-we-work':'Decisions before the next handoff.',insights:'Start with the question behind your next order.'}[page];
 return <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" data-buyer-decisions={page} aria-labelledby={`buyer-decisions-${page}`}><h2 id={`buyer-decisions-${page}`} className="max-w-3xl text-3xl font-bold tracking-tight text-slate-900">{reviewed ? (page === 'sourcing-services' ? sourcingHeading[locale] : decisionLocales[locale].headings[page]) : translatedText(heading,locale)}</h2><div className="mt-7 grid gap-x-10 md:grid-cols-2">{items.map(item=><article key={item.q} className="border-t border-slate-200 py-6"><h3 className="text-lg font-bold text-slate-900">{item.q}</h3><p className="mt-3 leading-7 text-slate-600">{item.a}</p><a className="mt-4 inline-block py-2 font-semibold text-purple-900 underline decoration-purple-300 underline-offset-4" href={item.href.startsWith('/blog/')?item.href:navigationPath(item.href,locale)} hrefLang={item.href.startsWith('/blog/')?'en':locale==='zh'?'zh-CN':locale}>{item.label}{item.href.startsWith('/blog/') && locale !== 'en' && <span lang="en"> · English</span>} →</a></article>)}</div></section>;
}
