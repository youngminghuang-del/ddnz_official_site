import React from 'react';
import { navigationPath } from '../../lib/productLanguageRouting';
import { startupCopy, startupRoutes } from './startup-copy.mjs';

const detailPaths = [
 '/sourcing/restaurant-kitchen-packages-from-china/',
 '/sourcing/commercial-kitchen-equipment-from-china/',
 '/screen-protectors/compare/',
 '/screen-protectors/wholesale-for-stores/',
 '/sourcing/restaurant-kitchen-packages-from-china/cafe-light-meals/',
 '/sourcing/commercial-ice-machines-from-china/',
 '/sourcing-services/supplier-search/',
 '/phone-cases/materials-and-pricing/',
];
const language = locale => locale === 'zh-cn' ? 'zh' : locale;

export function StartupBuyingLinks({locale='en'}) {
 const lang=language(locale), copy=startupCopy[lang];
 if(!copy)return null;
 return <section data-startup-links="true" className="mx-auto max-w-7xl px-5 py-12 text-slate-900" dir={lang==='ar'?'rtl':'ltr'} aria-labelledby="startup-links-title">
  <h2 id="startup-links-title" className="text-3xl font-bold">{copy.heading}</h2>
  <div className="mt-6 grid gap-4 md:grid-cols-2">{copy.items.map((item,i)=><a key={startupRoutes[i][1]} className="rounded-xl border border-slate-300 bg-white p-5 font-semibold text-purple-900 underline underline-offset-4" href={`${navigationPath(startupRoutes[i][0],lang)}#${startupRoutes[i][1]}`}>{item[0]} →</a>)}</div>
 </section>;
}

export default function StartupBuyingContent({kind,locale='en',compact=false}) {
 const lang=language(locale), copy=startupCopy[lang];
 const indexes=kind==='restaurant-projects'?[0,1,4,5]:kind==='phone-stores'?[2]:kind==='hub'?[3]:kind==='audio'?[6]:kind==='cases'?[7]:[];
 if(!copy||!indexes.length)return null;
 if (compact) {
  const es = lang === 'es';
  return <section className="dealer-plans" aria-labelledby="project-budget-heading">
   <div id={startupRoutes[0][1]} className="scroll-mt-28">
    <h2 id="project-budget-heading">{es ? 'Equipo esencial para la apertura' : 'Equipment for opening day'}</h2>
    <p id={startupRoutes[1][1]} className="scroll-mt-28">{es ? 'Defina el menú inicial y el volumen en hora punta. Cotice primero los equipos esenciales y deje la ampliación en una partida aparte.' : 'Set the opening menu and peak volume first. Quote the essential equipment, with expansion items priced separately.'}</p>
    <a className="buyer-secondary" href={navigationPath(detailPaths[0],lang)}>{es ? 'Ver configuraciones de cocina' : 'Explore kitchen layouts'} ↗</a>
   </div>
   <div className="dealer-plan-grid mt-5">
    <article id={startupRoutes[4][1]} className="dealer-plan scroll-mt-28"><h3>{es ? 'Cafetería' : 'Café'}</h3><p>{es ? 'Parta de las bebidas por hora y reserve espacio para café, lavado y refrigeración bajo barra.' : 'Start with drinks per hour and leave room for coffee, washing and undercounter cooling.'}</p><a className="buyer-secondary" href={navigationPath(detailPaths[4],lang)}>{es ? 'Ver el escenario de cafetería' : 'Explore the café layout'} ↗</a></article>
    <article id={startupRoutes[5][1]} className="dealer-plan scroll-mt-28"><h3>{es ? 'Bar y coctelería' : 'Bar and cocktail service'}</h3><p>{es ? 'Dimensione por separado la producción y la reserva de hielo para el servicio punta.' : 'Size ice production and storage separately for peak service.'}</p><a className="buyer-secondary" href={navigationPath(detailPaths[5],lang)}>{es ? 'Comparar máquinas de hielo' : 'Compare ice machines'} ↗</a></article>
   </div>
  </section>;
 }
 return <div className="mx-auto max-w-7xl space-y-10 px-5 py-12 text-slate-900" dir={lang==='ar'?'rtl':'ltr'}>
  {indexes.map(i=>{
   const [title,intro,steps,question,answer,label]=copy.items[i], id=startupRoutes[i][1];
   const query=new URLSearchParams({leadGoal:'Product Sourcing',source:'startup_plan',subcategory:id,overviewBrief:title,industry:[0,1,4,5].includes(i)?'Commercial Kitchen Equipment':i===6?'Audio & Speakers':'Mobile Accessories'});
   return <section key={id} id={id} data-startup-intent={id} className="scroll-mt-28 rounded-2xl border border-slate-300 bg-white p-6 sm:p-8" aria-labelledby={`${id}-title`}>
    <h2 id={`${id}-title`} className="text-3xl font-bold leading-tight">{title}</h2>
    <p className="mt-4 max-w-4xl leading-7">{intro}</p>
    <ol className="mt-6 list-decimal space-y-4 ps-6 leading-7">{steps.map(step=><li key={step}>{step}</li>)}</ol>
    <h3 className="mt-7 text-xl font-bold">{question}</h3><p className="mt-3 max-w-4xl leading-7">{answer}</p>
    <div className="mt-6 flex flex-wrap items-center gap-5"><a className="font-semibold text-purple-900 underline underline-offset-4" href={navigationPath(detailPaths[i],lang)}>{label} →</a><a className="rounded-xl ddnz-action px-5 py-3 font-bold text-white" href={`${navigationPath('/get-a-quote/',lang)}?${query}`}>{copy.cta} →</a></div>
   </section>;
  })}
 </div>;
}
