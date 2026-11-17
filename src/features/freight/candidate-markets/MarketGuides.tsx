import { ClipboardList, Clock3, ReceiptText, ShieldCheck, Ship } from 'lucide-react';
import { pacificPorts } from '../locales/index.mjs';
import { originNames } from '../rates/model.mjs';
import { originNamesEn } from '../rates/copy.mjs';
import guide from './marketGuideCopy.json';
import { candidateCopy, isPacificCandidate, pacificCountryCopy, pacificMarketBadges, type CandidateCountry, type CandidateLocale } from './model';

export const marketGuide = guide;

const containers = ['20GP', '40GP', '40HQ'] as const;
export type MarketRateRow = {
 country: string;
 origin: string;
 days: number | null;
 prices: Record<typeof containers[number], number | null>;
};
const ports = {
 canada: pacificPorts['VANCOUVER,CA'],
 australia: pacificPorts.SYDNEY,
 japan: pacificPorts.TOKYO,
 'south-korea': pacificPorts.BUSAN,
 netherlands: { en:'Rotterdam', zh:'鹿特丹', es:'Róterdam', fr:'Rotterdam', ru:'Роттердам', ar:'روتردام', pt:'Roterdã', tr:'Rotterdam' },
 'united-kingdom': { en:'Southampton', zh:'南安普敦', es:'Southampton', fr:'Southampton', ru:'Саутгемптон', ar:'ساوثهامبتون', pt:'Southampton', tr:'Southampton' },
 france: { en:'Le Havre', zh:'勒阿弗尔', es:'Le Havre', fr:'Le Havre', ru:'Гавр', ar:'لوهافر', pt:'Le Havre', tr:'Le Havre' },
};
const policy = {
 'united-kingdom': { entry: 'GB / XI EORI', tax: 'VAT', taxTitle: 'ukTax', taxBody: 'ukTaxBody', marking: 'CE / UKCA', markTitle: 'ukMark', markBody: 'ukMarkBody' },
 france: { entry: 'EORI', tax: 'TVA / CA3', taxTitle: 'frTax', taxBody: 'frTaxBody', marking: 'CE', markTitle: 'euMark', markBody: 'euMarkBody' },
 netherlands: { entry: 'T1', tax: 'Article 23', taxTitle: 'nlTax', taxBody: 'nlTaxBody', marking: 'CE', markTitle: 'euMark', markBody: 'euMarkBody' },
} as const;

export function MarketRateOverview({ country, locale, rows }: {
 country: CandidateCountry; locale: CandidateLocale; rows: readonly MarketRateRow[];
}) {
 const c = guide[locale];
 const selected = rows.filter(row => row.country === country);
 const numerals = new Intl.NumberFormat(locale === 'zh' ? 'zh-CN' : locale, { maximumFractionDigits: 2 });
 const range = (values: (number | null)[]) => {
  const known = values.filter((value): value is number => value !== null && value > 0);
  if (!known.length) return '—';
  const min = Math.min(...known);
  const max = Math.max(...known);
  return min === max ? numerals.format(min) : `${numerals.format(min)}–${numerals.format(max)}`;
 };
 const origins = locale === 'zh' ? originNames : originNamesEn;
 const originCodes = [...new Set(selected.map(row => row.origin))];
 const originLabels = originCodes.map(origin => origins[origin] || origin);
 return <section id="cost-transit" className="gulf-section candidate-market-guide" aria-labelledby="cost-transit-title">
  <h2 id="cost-transit-title">{c.costTitle.replace('{port}', ports[country][locale])}</h2>
  {selected.length>0 && <>
   <div className="candidate-rate-summary">
    <div className="candidate-rate-transit">
     <p><Clock3 size={20} aria-hidden="true"/>{c.sailing}</p>
     <strong><bdi>{range(selected.map(row => row.days))}</bdi> <small>{c.days}</small></strong>
     <span>{numerals.format(selected.length)} {c.routes}</span>
    </div>
    <table>
     <caption><Ship size={20} aria-hidden="true"/>{c.main}</caption>
     <tbody>{containers.map(container => <tr key={container}><th scope="row"><bdi>{container}</bdi></th><td><bdi>{range(selected.map(row => row.prices[container] ?? null))}</bdi></td></tr>)}</tbody>
    </table>
   </div>
   <p className="candidate-market-sample">{c.reference} · {c.origins} <bdi>{originLabels.join(' / ')}</bdi></p>
   {originCodes.length > 1 && <table className="candidate-port-comparison">
    <caption>{c.origins}</caption>
    <thead><tr><th scope="col">{candidateCopy(country,locale).origin}</th><th scope="col">{c.sailing}</th><th scope="col"><bdi>20GP · USD</bdi></th></tr></thead>
    <tbody>{originCodes.map((origin,i) => {
     const group = selected.filter(row => row.origin === origin);
     return <tr key={origin}><th scope="row"><bdi>{originLabels[i]}</bdi></th><td><bdi>{range(group.map(row => row.days))}</bdi> {c.days}</td><td><bdi>{range(group.map(row => row.prices['20GP']))}</bdi></td></tr>;
    })}</tbody>
   </table>}
   <p>{c.scope}</p>
  </>}
  <p>{c.other}</p>
 </section>;
}

export function MarketImportRules({ country, locale }: {country: CandidateCountry; locale: CandidateLocale}) {
 const c = guide[locale];
 const page = candidateCopy(country, locale);
 if (isPacificCandidate(country)) {
  const rules = pacificCountryCopy(country,locale);
  const [entry, tax, check] = pacificMarketBadges[country];
  return <section id="import-rules" className="gulf-section candidate-market-guide" aria-labelledby="import-rules-title">
   <h2 id="import-rules-title">{c.rulesTitle}</h2>
   <ImportCards cards={[
    { icon:ClipboardList, badge:entry, title:page.importHeading, text:page.importText },
    { icon:ReceiptText, badge:tax, title:rules.taxTitle, text:rules.taxBody },
    { icon:ShieldCheck, badge:check, title:rules.checkTitle, text:rules.checkBody },
   ]}/>
  </section>;
 }
 const p = policy[country];
 const cards = [
  { icon:ClipboardList, badge:p.entry, title:page.importHeading, text:page.importText },
  { icon:ReceiptText, badge:p.tax, title:c[p.taxTitle], text:c[p.taxBody] },
  { icon:ShieldCheck, badge:p.marking, title:c[p.markTitle], text:c[p.markBody] },
 ];
 return <section id="import-rules" className="gulf-section candidate-market-guide" aria-labelledby="import-rules-title">
  <h2 id="import-rules-title">{c.rulesTitle}</h2>
  <ImportCards cards={cards}/>
 </section>;
}

function ImportCards({cards}: {cards:{icon:typeof ClipboardList;badge:string;title:string;text:string}[]}) {
 return <div className="candidate-policy-grid">{cards.map(({icon:Icon,badge,title,text}) => <article key={badge}>
  <div className="candidate-policy-label"><Icon size={20} aria-hidden="true"/><bdi>{badge}</bdi></div>
  <h3>{title}</h3><p>{text}</p>
 </article>)}</div>;
}
