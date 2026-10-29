import React from 'react';
import copy from './copy.json';

export type EquipmentFamily = 'kitchen' | 'ice' | 'refrigeration';
type Locale = keyof typeof copy;
export function buyingSupportCopy(language: string) {
  const locale = (language === 'zh-cn' ? 'zh' : language) as Locale;
  return { locale: copy[locale] ? locale : 'en' as Locale, c: copy[locale] || copy.en };
}
export function buyingSupportQuote(language: string, family: EquipmentFamily) {
  const {locale,c} = buyingSupportCopy(language);
  const prefix = locale === 'en' ? '' : `/${locale === 'zh' ? 'zh-cn' : locale}`;
  const section = c.families[family];
  const overviewBrief = [c.brief, section[0], ...c.cards.map(([title]) => title), ...section.slice(1), c.pending].join('\n');
  return `${prefix}/get-a-quote/?` + new URLSearchParams({leadGoal:'Product Sourcing',source:'equipment_buying_support',industry:'Commercial Kitchen Equipment',subcategory:section[0],overviewBrief});
}
export default function EquipmentBuyingSupport({locale='en', family='kitchen'}:{locale?:string;family?:EquipmentFamily}) {
  const {locale:lang,c} = buyingSupportCopy(locale);
  const section = c.families[family];
  const list = family === 'kitchen' ? '#commercial-kitchen-list' : family === 'ice' ? '#category-models' : '#refrigeration-models';
  return <section className="equipment-support" id="equipment-buying-support" lang={lang==='zh'?'zh-CN':lang} dir={lang==='ar'?'rtl':'ltr'} aria-labelledby="equipment-support-title">
    <header><p className="equipment-support-kicker">{c.eyebrow}</p><h2 id="equipment-support-title">{c.title}</h2><p>{c.intro}</p></header>
    <div className="equipment-support-grid">{c.cards.map(([title,text],i)=><article key={title}><span className="equipment-support-number" aria-hidden="true">0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
    <details className="equipment-support-checks"><summary>{c.details} · {section[0]}</summary><ul>{section.slice(1).map(text=><li key={text}>{text}</li>)}</ul></details>
    <footer><div><a className="equipment-support-cta" href={buyingSupportQuote(lang,family)}>{c.cta}<span aria-hidden="true"> ↗</span></a><a className="equipment-support-list" href={list}>{c.list}</a></div><p>{c.pending}</p></footer>
  </section>;
}
