import profiles from './route-locales/country-transit.json';
import copy from './route-locales/country-transit-ui.json';
import tableCopy from './route-locales/latin-transit.json';
import {quoteLinkProps} from '../../lib/quoteLinkPolicy.mjs';

type TransitRow={mode:string;days:number[];route:string;scope:string;dayUnit?:string};
type Profile={iso:string;sources:string[];rows:TransitRow[];recordCount:number};
export function hasCountryTransitPlan(country:string):country is keyof typeof profiles {return Object.hasOwn(profiles,country);}
export function countryTransitUi(locale:string){return copy[locale as keyof typeof copy] || copy.en;}
export default function CountryTransitPlanner({country,locale}:{country:keyof typeof profiles;locale:string}) {
 const p:Profile=profiles[country],u=countryTransitUi(locale),t=tableCopy[locale as keyof typeof tableCopy] || tableCopy.en;
 const names=new Intl.DisplayNames([locale==='zh'?'zh-CN':locale],{type:'region'}),name=names.of(p.iso)||country;
 const prefix=locale==='en'?'':locale==='zh'?'/zh-cn':`/${locale}`;
 const warehouse={en:'warehouse',zh:'仓库',es:'almacén',fr:'entrepôt',ru:'склад',pt:'armazém',tr:'depo',ar:'مستودع'}[locale] || 'warehouse';
 const routeText=(route:string)=>route.replace('China departure','China').replace(/\b(China|Russia|Kazakhstan|Uzbekistan)\b/g,n=>names.of(({China:'CN',Russia:'RU',Kazakhstan:'KZ',Uzbekistan:'UZ'} as Record<string,string>)[n])||n).replaceAll('warehouse',warehouse);
 const modeLabel=(mode:string)=>mode==='fcl'?t[5]:mode==='lcl'?t[6]:mode==='air'?t[7]:u.modes[mode as keyof typeof u.modes];
 const rowNote=(scope:string)=>u.scopes[scope as keyof typeof u.scopes];
 const businessDays:Record<string,string>={en:'business days',zh:'工作日',es:'días laborables',ar:'أيام عمل',fr:'jours ouvrés',ru:'рабочих дней',pt:'dias úteis',tr:'iş günü'};
 const dayLabel=(row:TransitRow)=>row.dayUnit==='business'?businessDays[locale]||businessDays.en:t[8];
 const quote=(row:TransitRow)=>quoteLinkProps(`${prefix}/get-a-quote/?${new URLSearchParams({leadGoal:'Freight Export',source:row.mode==='air'?'air_freight':row.mode.startsWith('road')||row.mode==='rail'?'central_asia_route_builder':'international_country',destinationText:`${name} · ${routeText(row.route).split(' → ').at(-1)}`,notes:`${modeLabel(row.mode)} · ${routeText(row.route)}\n${rowNote(row.scope)}${row.dayUnit==='business'?` · ${row.days.join('–')} ${dayLabel(row)}`:''}\n${u.stages}`})}`);
 return <section className="route-depth freight-transit" id="freight-route-options" data-country-transit={country} lang={locale==='zh'?'zh-CN':locale} dir={locale==='ar'?'rtl':'ltr'} aria-labelledby="route-depth-heading"><div className="route-depth-inner">
  <h2 id="route-depth-heading">{u.title}</h2><p className="route-depth-intro">{u.intro}</p>
  <table className="latin-transit-table"><caption className="sr-only">{name} · {u.title}</caption><thead><tr><th scope="col">{t[1]}</th><th scope="col">{t[2]}</th><th scope="col">{t[3]}</th><th scope="col"><span className="sr-only">{t[4]}</span></th></tr></thead><tbody>
   {p.rows.map(row=><tr key={row.mode} data-transit-mode={row.mode}><th scope="row">{modeLabel(row.mode)}<span><bdi dir="ltr">{routeText(row.route)}</bdi></span></th><td className="latin-transit-days"><bdi dir="ltr">{row.days[0]}–{row.days[1]}</bdi> <span>{dayLabel(row)}</span></td><td>{rowNote(row.scope)}</td><td><a {...quote(row)}>{t[4]}<span className="sr-only"> · {modeLabel(row.mode)}</span> ↗</a></td></tr>)}
  </tbody></table><p className="latin-transit-stages">{u.stages}</p>
  <details className="latin-transit-sources"><summary>{u.method}</summary><p>{u.methodText}</p><div>{p.sources.map(url=><a key={url} href={url} target="_blank" rel="noreferrer">{u.source} · <bdi dir="ltr">{new URL(url).hostname.replace(/^www\./,'')}</bdi> ↗</a>)}</div></details>
 </div></section>;
}
