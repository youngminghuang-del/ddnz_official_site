import copy from './route-locales/latin-arrival.json';
import transit from './route-locales/latin-transit.json';
import ranges from './route-locales/latin-ocean-ranges.json';
import {quoteLinkProps} from '../../lib/quoteLinkPolicy.mjs';

const ports = {
 mexico: [
  ['Manzanillo','https://www.puertomanzanillo.com.mx/esps/0021104/terminales-especializadas.html'],
  ['Lázaro Cárdenas','https://puertolazarocardenas.com.mx/'],
 ],
 chile: [
  ['San Antonio','https://www.puertosanantonio.com/operacion-portuaria'],
  ['Valparaíso','https://www.puertovalparaiso.cl/terminal-1'],
 ],
 argentina: [['Buenos Aires','https://www.argentina.gob.ar/transporte/puerto-ba/el-puerto/delimitacion-y-jurisdiccion']],
};
export function hasLatinArrivalPlan(country:string):country is keyof typeof ports { return Object.hasOwn(ports,country); }
export default function LatinArrivalPlanner({country,locale}:{country:keyof typeof ports;locale:string}) {
 const t=copy[locale as keyof typeof copy] || copy.en;
 const v=transit[locale as keyof typeof transit] || transit.en;
 const intro=t[{mexico:2,chile:3,argentina:4}[country]];
 const prefix=locale==='en'?'':locale==='zh'?'/zh-cn':`/${locale}`;
 const quote=(destination:string,mode='FCL')=>quoteLinkProps(`${prefix}/get-a-quote/?${new URLSearchParams({leadGoal:'Freight Export',source:mode==='air'?'air_freight':'international_country',destinationText:destination,notes:`${mode.toUpperCase()} · ${intro}\n${t[7]}`})}`);
 const chinaName=new Intl.DisplayNames([locale],{type:'region'}).of('CN') || 'China';
 const countryName=country==='mexico'?'Mexico':country==='chile'?'Chile':'Argentina';
 const portKey=(port:string)=>({'Manzanillo':'MANZANILLO,MEXICO','Lázaro Cárdenas':'LAZARO CARDENAS','San Antonio':'SAN ANTONIO,CL','Valparaíso':'VALPARAISO,CL','Buenos Aires':'BUENOS AIRES'}[port]||port);
 const ocean=ranges[country] as Record<string,{min:number;max:number;records:number}>;
 const supplemental={mexico:{lcl:'28–38',air:'5–8',lclRoute:'China → Mexico',airRoute:'China → Mexico',sources:[['Freightos','https://www.freightos.com/shipping-routes/shipping-from-china-to-mexico/']]},chile:{lcl:'35–50',air:'3–8',lclRoute:'China → San Antonio / Valparaíso',airRoute:'China → Santiago (SCL)',sources:[['DSV · Shanghai → San Antonio','https://www.dsv.com/es-mx/sobre-dsv/latam/dsv-chile/servicios-lcl'],['Segucargo','https://segucargo.cl/tiempo-de-transito-china-chile']]},argentina:{lcl:'38–46',air:'4–9',lclRoute:'Shanghai → Buenos Aires',airRoute:'China → Buenos Aires (EZE)',sources:[['Flexport · published route reference','https://www.flexport.com/rates/cnshg/arbue'],['DTFU · air route references','https://www.dtfulogistics.com/news/air-shipping-from-china-to-argentina/']]}}[country];
 return <section className="route-depth latin-arrival" id="freight-route-options" lang={locale==='zh'?'zh-CN':locale} dir={locale==='ar'?'rtl':'ltr'} aria-labelledby="route-depth-heading" data-route-depth={country}>
  <div className="route-depth-inner">
   <h2 id="route-depth-heading">{v[0]}</h2><p className="route-depth-intro">{v[12]}</p>
   <table className="latin-transit-table"><caption className="sr-only">{v[0]}</caption><thead><tr><th scope="col">{v[1]}</th><th scope="col">{v[2]}</th><th scope="col">{v[3]}</th><th scope="col"><span className="sr-only">{v[4]}</span></th></tr></thead><tbody>
    {ports[country].map(([port])=>{const range=ocean[portKey(port)];return <tr key={port}><th scope="row">{v[5]}<span><bdi dir="ltr">{port}</bdi></span></th><td className="latin-transit-days"><bdi dir="ltr">{range.min}–{range.max}</bdi> <span>{v[8]}</span></td><td>{v[9]}</td><td><a className="latin-arrival-quote" {...quote(`${countryName} · ${port}`)}>{v[4]}<span className="sr-only"> · {port} · FCL</span> ↗</a></td></tr>;})}
    {(['lcl','air'] as const).map((mode,i)=><tr key={mode}><th scope="row">{v[6+i]}<span><bdi dir="ltr">{supplemental[mode+'Route' as 'lclRoute'|'airRoute'].replace('China',chinaName)}</bdi></span></th><td className="latin-transit-days"><bdi dir="ltr">{supplemental[mode]}</bdi> <span>{v[8]}</span></td><td>{v[10+i]}{country==='argentina' && mode==='lcl' && <small className="latin-transit-date">{v[16]} · 2026-09</small>}</td><td><a {...quote(`${countryName} · ${supplemental[mode+'Route' as 'lclRoute'|'airRoute']}`,mode)}>{v[4]}<span className="sr-only"> · {mode.toUpperCase()}</span> ↗</a></td></tr>)}
   </tbody></table>
   <p className="latin-transit-stages">{v[15]}</p>
   <details className="latin-transit-sources"><summary>{v[13]}</summary><p>{v[14]}</p><p>{intro}</p><div>{ports[country].map(([port,source])=><a key={port} href={source} target="_blank" rel="noreferrer">{t[6]} · <bdi dir="ltr">{port}</bdi> ↗</a>)}{supplemental.sources.map(([label,url])=><a key={url} href={url} target="_blank" rel="noreferrer">{v[16]} · <bdi dir="ltr">{label}</bdi> ↗</a>)}</div></details>
  </div>
 </section>;
}
