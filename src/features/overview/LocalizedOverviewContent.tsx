import { StartupBuyingLinks } from '../search-intent/StartupBuyingContent';
import { useState } from 'react';
import BuyerDecisionContent from '../search-intent/BuyerDecisionContent';
import { overviewCopy, type OverviewLocale, type OverviewKind } from './copy';
import { serviceCopy, type SourcingServiceKind } from '../sourcing-services/copy';
import { packages, packageSelection, selectionTotals, money } from '../food-processing/catalog.mjs';
import { navigationPath, navigationPrefixes, splitNavigationPath } from '../../lib/productLanguageRouting';

const categories = [
  { id:'commercial-kitchen-refrigeration', path:'/sourcing/commercial-kitchen-equipment-from-china/', image:'/images/product-showcase/kitchen/kitchen-product-range-sanitized.webp', extra:'/refrigeration-equipment/' },
  { id:'audio-speakers', path:'/sourcing/audio-speakers-from-china/', image:'/images/product-showcase/index/audio-speakers-category.webp' },
  { id:'mobile-accessories', path:'/sourcing/mobile-accessories-from-china/', image:'/images/product-showcase/mobile/family-phone-cases-v1.webp', extra:'/screen-protectors/compare/' },
  { id:'outdoor-products', path:'/sourcing/outdoor-products-from-china/', image:'/images/product-showcase/index/outdoor-portable-energy-brand-neutral-v1.webp' },
  { id:'food-processing-machinery', path:'/sourcing/food-processing-machinery-from-china/', image:'/food-processing-media/spiral-mixer.webp' },
];
const services: SourcingServiceKind[] = ['supplier-search','inspection-quality-control','consolidation-export'];
const stages = ['Exploring a new category','Building a target range','Comparing current offers','Sample or specification stage','Order-ready'];
const serviceImages = ['/images/product-showcase/kitchen/kitchen-factory-inspection-sanitized.webp','/images/product-showcase/mobile/phone-case-machine-proof-v1.webp','/images/product-showcase/mobile/phone-case-packout-proof-v2.webp'];
const button='inline-flex rounded-xl bg-purple-800 px-5 py-3 font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-800';
const input='mt-2 w-full rounded-lg border border-slate-400 bg-white px-3 py-3 text-slate-900';
const card='rounded-2xl border border-slate-200 bg-white p-6';

export default function LocalizedOverviewContent({kind,locale}: {kind:OverviewKind;locale:OverviewLocale}) {
  const c=overviewCopy[locale], u=c.ui, product=kind==='products', prefix=navigationPrefixes[locale];
  const [active,setActive]=useState(0);
  const [buyerPath,setBuyerPath]=useState('retail');
  const [ready,setReady]=useState(false);
  const [form,setForm]=useState({category:categories[0].id,destination:'',scope:'',stage:'',notes:'',skuCount:'',quantityPerSku:'',rhythm:''});
  const change=(key:keyof typeof form,value:string)=>{setForm(current=>({...current,[key]:value}));setReady(false);};
  const pick=(index:number)=>{change('category',categories[index]?.id || 'other');document.getElementById('rfq')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});};
  const selectedCategory=c.categories[categories.findIndex(cat=>cat.id===form.category)]?.[0]||u.other;
  const brief=[[u.category,selectedCategory],[u.destination,form.destination],[u.scopeField,form.scope],[u.stage,u.stages[stages.indexOf(form.stage)]],[u.notes,form.notes],...(!product?[[u.path,buyerPath==='retail'?u.retail:u.project],[u.sku,form.skuCount],[u.units,form.quantityPerSku],[u.rhythm,form.rhythm]]:[])].filter(([,value])=>value).map(([label,value])=>`${label}: ${value}`).join('\n');
  const query=new URLSearchParams({leadGoal:'Product Sourcing',source:product?'products_index':'sourcing_services',industry:selectedCategory,overviewBrief:brief,subcategory:form.scope,productScope:form.scope,dest:form.destination,buyingStage:form.stage,notes:form.notes,sourcingPath:buyerPath,buyerType:buyerPath==='retail'?'Established / multi-store retailer':'Importer / project buyer',skuCount:form.skuCount,quantityPerSku:form.quantityPerSku,freightPreference:form.rhythm});
  const detailLink=(path:string,label=u.explore)=>{
    const href=navigationPath(path,locale), english=!splitNavigationPath(href).locale;
    return <a className="font-bold text-purple-800 underline underline-offset-4" href={href} hrefLang={english?'en':locale==='zh'?'zh-CN':locale}>{label}{english?` · ${u.english}`:''} <span aria-hidden="true">↗</span></a>;
  };
  return <main id="main-content" lang={locale==='zh'?'zh-CN':locale} dir={locale==='ar'?'rtl':'ltr'} className="bg-slate-50 text-slate-900">
    <header className="bg-slate-950 text-white"><div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
      <nav aria-label={u.home} className="mb-7 flex flex-wrap gap-4 text-sm"><a href={`${prefix}/`}>{u.home}</a><a href={`${prefix}/${product?'sourcing-services':'products'}/`}>{product?u.services:u.categories}</a></nav>
      <p className="mb-4 text-sm font-bold tracking-widest text-orange-300">DDNZ GLOBAL · {product?u.categories:u.services}</p>
      <h1 className="max-w-5xl text-4xl font-bold leading-tight md:text-6xl">{product?c.productsTitle:c.servicesTitle}</h1>
      <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-200">{product?c.productsIntro:c.servicesIntro}</p>
      <div className="mt-8 flex flex-wrap gap-5"><a href={product?'#categories':'#paths'} className="rounded-xl bg-white px-5 py-3 font-bold text-purple-900">{product?u.categories:u.path}</a><a href="#rfq" className="rounded-xl bg-orange-700 px-5 py-3 font-bold">{u.quote}</a></div>
    </div></header>
    <div className="mx-auto max-w-7xl space-y-16 px-6 py-16">
      {product ? <>
        <section id="categories" aria-labelledby="overview-categories"><h2 id="overview-categories" className="text-3xl font-bold">{u.categories}</h2><div className="mt-8 grid gap-7 md:grid-cols-2">
          {categories.map((category,i)=><article key={category.id} id={category.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <img src={category.image} alt={c.categories[i][0]} width="1200" height="800" className="aspect-[3/2] w-full bg-white object-contain" loading="lazy"/>
            <div className="space-y-4 p-6"><h3 className="text-2xl font-bold">{c.categories[i][0]}</h3><p className="leading-7">{c.categories[i][1]}</p><p className="text-sm leading-7 text-slate-600">{c.categories[i][2]}</p><div className="rounded-xl bg-slate-50 p-4"><strong>{u.variables}</strong><p className="mt-2 leading-7">{c.categories[i][3]}</p></div>
            <div className="flex flex-wrap gap-4">{detailLink(category.path)}{category.extra&&detailLink(category.extra,u.compare)}</div><button type="button" className={button} onClick={()=>pick(i)}>{u.scope}</button></div>
          </article>)}
          <article className={`${card} flex flex-col justify-center`}><h3 className="text-2xl font-bold">{u.other}</h3><p className="my-5 leading-7">{u.formIntro}</p><button type="button" className={button} onClick={()=>pick(-1)}>{u.quote}</button></article>
        </div></section>
        <section id="food-processing-packages" aria-labelledby="overview-packages"><h2 id="overview-packages" className="text-3xl font-bold">{u.packages}</h2><div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{packages.map((bundle:any,i:number)=>{
          const total=selectionTotals(packageSelection(bundle));
          return <article className={card} key={bundle.id}><h3 className="text-xl font-bold">{c.packageNames[i]}</h3><p className="my-4 leading-7">{c.packageDescriptions[i]}</p><dl className="mb-5 space-y-2"><div><dt>{u.equipment}</dt><dd className="text-xl font-bold" dir="ltr">{money(total.equipment)}</dd></div><div><dt>{u.packing}</dt><dd dir="ltr">{money(total.packing)}</dd></div></dl>{detailLink(`/sourcing/food-processing-machinery-from-china/packages/${bundle.id}/`)}</article>;
        })}</div><p className="mt-5 text-sm leading-7 text-slate-600">{c.priceNote}</p></section>
        <section id="compare" aria-labelledby="overview-compare"><h2 id="overview-compare" className="text-3xl font-bold">{u.compare}</h2><div role="tablist" aria-label={u.categories} className="my-6 flex flex-wrap gap-3">{c.categories.map((category,i)=><button key={categories[i].id} type="button" role="tab" id={`overview-tab-${i}`} aria-selected={active===i} aria-controls="overview-panel" onClick={()=>setActive(i)} className={active===i?button:'rounded-xl border border-slate-300 bg-white px-5 py-3'}>{category[0]}</button>)}</div><div id="overview-panel" role="tabpanel" aria-labelledby={`overview-tab-${active}`} className={card}><h3 className="text-2xl font-bold">{c.categories[active][0]}</h3><p className="mt-3 leading-7">{c.categories[active][3]}</p><div className="mt-5 grid gap-5 md:grid-cols-3">{services.map(id=><div key={id}><h4 className="font-bold">{serviceCopy[id][locale].eyebrow}</h4><ul className="mt-3 list-disc space-y-2 ps-5 leading-7">{serviceCopy[id][locale].outputs.map(text=><li key={text}>{text}</li>)}</ul></div>)}</div></div></section>
      </> : <>
        <section id="paths" aria-labelledby="overview-paths"><h2 id="overview-paths" className="text-3xl font-bold">{u.path}</h2><div className="mt-8 grid gap-6 md:grid-cols-2">{c.paths.map(([title,body],i)=><article className={card} key={title}><h3 className="text-2xl font-bold">{title}</h3><p className="my-5 leading-7">{body}</p><button type="button" aria-pressed={buyerPath===(i===0?'retail':'project')} className={button} onClick={()=>{setBuyerPath(i===0?'retail':'project');setReady(false);document.getElementById('rfq')?.scrollIntoView();}}>{u.quote}</button></article>)}</div></section>
        <section id="marketplace" aria-labelledby="overview-market"><h2 id="overview-market" className="text-3xl font-bold">{u.market}</h2><p className="my-5 max-w-4xl leading-7">{c.marketIntro}</p><div className="overflow-x-auto"><table className="w-full min-w-[38rem] border-collapse text-start text-sm leading-7"><thead className="bg-slate-900 text-white"><tr>{u.columns.map(text=><th scope="col" className="p-4 text-start" key={text}>{text}</th>)}</tr></thead><tbody>{c.marketRows.map(([title,a,b])=><tr className="border-b border-slate-200 bg-white" key={title}><th scope="row" className="p-4 text-start">{title}</th><td className="p-4">{a}</td><td className="p-4">{b}</td></tr>)}</tbody></table></div></section>
      </>}
      <section id="control" aria-labelledby="overview-control"><h2 id="overview-control" className="text-3xl font-bold">{u.control}</h2><ol className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{c.steps.map(([title,body],i)=><li className={card} key={title}><p className="text-sm font-bold text-purple-700">0{i+1}</p><h3 className="mt-3 text-xl font-bold">{title}</h3><p className="mt-3 leading-7">{body}</p></li>)}</ol><a className="mt-6 inline-block font-bold text-purple-800 underline" href={`${prefix}/how-we-work/`}>{u.process}</a></section>
      <section id="services" aria-labelledby="overview-services"><h2 id="overview-services" className="text-3xl font-bold">{u.services}</h2><div className="mt-8 grid gap-6 lg:grid-cols-3">{services.map((id,i)=>{const s=serviceCopy[id][locale];return <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white" key={id}><img src={serviceImages[i]} alt={s.eyebrow} loading="lazy" width="1200" height="800" className="aspect-[3/2] w-full object-cover"/><div className="space-y-4 p-6"><h3 className="text-xl font-bold">{s.title}</h3><p className="leading-7">{s.intro}</p>{!product&&<><h4 className="font-bold">{s.useTitle}</h4><ul className="list-disc space-y-2 ps-5 leading-7">{s.useCases.map(text=><li key={text}>{text}</li>)}</ul><h4 className="font-bold">{s.outputTitle}</h4><ul className="list-disc space-y-2 ps-5 leading-7">{s.outputs.map(text=><li key={text}>{text}</li>)}</ul><h4 className="font-bold">{s.boundaryTitle}</h4><p className="text-sm leading-7">{s.boundary}</p></>}<a className="inline-block font-bold text-purple-800 underline" href={`${prefix}/sourcing-services/${id}/`}>{u.details}</a></div></article>;})}</div></section>
      <section aria-labelledby="overview-faq"><h2 id="overview-faq" className="text-3xl font-bold">{u.faq}</h2><div className="mt-8 grid gap-5 md:grid-cols-2">{c.faqs.map(([question,answer])=><article className={card} key={question}><h3 className="text-xl font-bold">{question}</h3><p className="mt-4 leading-7">{answer}</p></article>)}</div></section>
      <section id="rfq" aria-labelledby="overview-rfq" className="scroll-mt-36 rounded-2xl bg-purple-50 p-6 md:p-10"><h2 id="overview-rfq" className="text-3xl font-bold">{u.quote}</h2><p className="mt-4 leading-7">{u.formIntro}</p>
        {!ready?<form className="mt-7 grid gap-5 md:grid-cols-2" onSubmit={event=>{event.preventDefault();setReady(true);}}>
          <label>{u.category} *<select className={input} name="category" value={form.category} onChange={e=>change('category',e.target.value)} required>{categories.map((cat,i)=><option value={cat.id} key={cat.id}>{c.categories[i][0]}</option>)}<option value="other">{u.other}</option></select></label>
          <label>{u.destination} *<input className={input} name="destination" value={form.destination} onChange={e=>change('destination',e.target.value)} maxLength={160} required/></label>
          <label className="md:col-span-2">{u.scopeField} *<textarea className={input} name="scope" value={form.scope} onChange={e=>change('scope',e.target.value)} maxLength={2000} required/></label>
          <label>{u.stage} *<select className={input} name="stage" value={form.stage} onChange={e=>change('stage',e.target.value)} required><option value="">{u.select}</option>{stages.map((stage,i)=><option value={stage} key={stage}>{u.stages[i]}</option>)}</select></label>
          {!product&&<><label>{u.path}<select className={input} value={buyerPath} onChange={e=>setBuyerPath(e.target.value)}><option value="retail">{u.retail}</option><option value="project">{u.project}</option></select></label><label>{u.sku}<input type="number" min="1" step="1" className={input} name="skuCount" value={form.skuCount} onChange={e=>change('skuCount',e.target.value)}/></label><label>{u.units}<input type="number" min="1" step="1" className={input} name="quantityPerSku" value={form.quantityPerSku} onChange={e=>change('quantityPerSku',e.target.value)}/></label><label>{u.rhythm}<input className={input} name="rhythm" value={form.rhythm} onChange={e=>change('rhythm',e.target.value)} maxLength={300}/></label></>}
          <label>{u.notes}<input className={input} name="notes" value={form.notes} onChange={e=>change('notes',e.target.value)} maxLength={1500}/></label><div className="md:col-span-2"><button type="submit" className={button}>{u.prepare}</button></div>
        </form>:<div className="mt-7 space-y-5" role="status"><h3 className="text-xl font-bold">{u.ready}</h3><dl className="space-y-3">{[[u.category,c.categories[categories.findIndex(cat=>cat.id===form.category)]?.[0]||u.other],[u.destination,form.destination],[u.scopeField,form.scope],[u.stage,u.stages[stages.indexOf(form.stage)]],[u.notes,form.notes],...(!product?[[u.path,buyerPath==='retail'?u.retail:u.project],[u.sku,form.skuCount],[u.units,form.quantityPerSku],[u.rhythm,form.rhythm]]:[])].filter(([,v])=>v).map(([label,value])=><div key={label}><dt className="font-bold">{label}</dt><dd className="whitespace-pre-wrap break-words leading-7">{value}</dd></div>)}</dl><div className="flex flex-wrap gap-5"><a className={button} href={`${prefix}/get-a-quote/?${query}`}>{u.continue}</a><button className="font-bold text-purple-800 underline" type="button" onClick={()=>setReady(false)}>{u.edit}</button></div></div>}
      </section>
      {product && <StartupBuyingLinks locale={locale} />}
      <BuyerDecisionContent page={kind} locale={locale} />
      <p className="border-t border-slate-200 pt-8 leading-7">{u.freight}</p>
    </div>
  </main>;
}
