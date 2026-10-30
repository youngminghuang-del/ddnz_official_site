import { EURASIA_DELAY_DIAGNOSTIC, EURASIA_UI, type EurasiaLocale } from './eurasiaCorridors';
export default function EurasiaRegionalGuide({locale}:{locale:string}) {
 if (!(locale in EURASIA_DELAY_DIAGNOSTIC)) return null;
 const c=EURASIA_DELAY_DIAGNOSTIC[locale as EurasiaLocale], ui=EURASIA_UI[locale as EurasiaLocale];
 const sources=[{label:ui.sourceEaeu,href:'https://eec.eaeunion.org/en/news/01-01-2015-1/'},{label:ui.sourceTir,href:'https://unece.org/es/node/350813'},{label:c.sourceCarec,href:'https://cpmm.carecprogram.org/2023-report/kazakhstan/'},{label:c.sourceKazakhstanCustoms,href:'https://www.gov.kz/services/3635?lang=en'},{label:c.sourceUzbekistanCustoms,href:'https://sw2.customs.uz/?lang=en_EN'},{label:ui.sourceRussia,href:'https://www.bis.gov/licensing/country-guidance'}];
 return <section id="regional-operating-guide" className="freight-wrap freight-section" data-regional-operating-guide>
 <p className="freight-kicker">{c.scope}</p><h2>{c.title}</h2><p className="mt-4 max-w-3xl leading-7">{c.intro}</p>
 <div className="mt-6 grid gap-4 md:grid-cols-2">{c.items.map(item=><details key={item.title} className="border-t border-slate-300 py-4"><summary className="cursor-pointer font-bold">{item.title}</summary><p className="mt-3 leading-7">{item.body}</p><p className="mt-2 leading-7">{item.check}</p></details>)}</div>
 <h3 className="mt-8 text-xl font-bold">{c.questionsTitle}</h3><ul className="mt-4 list-disc space-y-2 pl-5">{c.questions.map(q=><li key={q}>{q}</li>)}</ul><p className="mt-4 leading-7">{c.closing}</p>
 <details className="mt-6 border-t border-slate-300 py-4"><summary className="cursor-pointer font-bold">{ui.routeEvidence}</summary><p className="mt-3 leading-7">{ui.routeEvidenceBody}</p><ul>{sources.map(s=><li key={s.href}><a className="inline-flex min-h-11 items-center underline" href={s.href} target="_blank" rel="noreferrer">{s.label} ↗</a></li>)}</ul></details>
 </section>;
}
