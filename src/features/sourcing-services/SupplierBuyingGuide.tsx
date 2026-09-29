import { useLanguage } from '../../contexts/LanguageContext';
import { navigationPath } from '../../lib/productLanguageRouting';
import { supplierBuyingCopy } from './supplierBuyingCopy';

export default function SupplierBuyingGuide({ quoteHref }: { quoteHref: string }) {
 const {language}=useLanguage(); const c=supplierBuyingCopy[language];
 return <section id="supplier-quotations" className="scroll-mt-24 bg-[#faf9f6] py-16 sm:py-20" aria-labelledby="supplier-buying-title" dir={language==='ar'?'rtl':'ltr'}>
  <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
   <div><h2 id="supplier-buying-title" className="text-3xl font-semibold leading-tight tracking-tight text-slate-900">{c.title}</h2><p className="mt-6 text-base leading-8 text-slate-600">{c.location}</p><p className="mt-5 text-base leading-8 text-slate-600">{c.sample}</p><a className="mt-6 inline-block py-2 font-semibold text-purple-900 underline underline-offset-4" href={quoteHref}>{c.cta} <span aria-hidden="true">{language==='ar'?'←':'→'}</span></a></div>
   <div><h3 className="text-2xl font-semibold leading-snug text-slate-900">{c.priceTitle}</h3><dl className="mt-5 divide-y divide-slate-200 border-y border-slate-200">{c.rows.map(([title,body])=><div className="py-5" key={title}><dt className="font-semibold text-slate-900">{title}</dt><dd className="mt-2 text-base leading-7 text-slate-600">{body}</dd></div>)}</dl><p className="mt-5 text-sm leading-7 text-slate-600">{c.next}</p><a className="mt-3 inline-block py-2 font-semibold text-purple-900 underline underline-offset-4" href={navigationPath('/sourcing-services/inspection-quality-control/',language)}>{c.link} <span aria-hidden="true">{language==='ar'?'←':'→'}</span></a></div>
  </div>
 </section>;
}
