import { useLanguage } from '../../contexts/LanguageContext';
import { inspectionEvidenceCopy } from './inspectionEvidenceCopy';
export default function InspectionEvidence({quoteHref}:{quoteHref:string}) {
 const {language}=useLanguage();const c=inspectionEvidenceCopy[language];
 return <section id="inspection-evidence" className="scroll-mt-24 bg-[#f8f7f4] py-16 sm:py-20" dir={language==='ar'?'rtl':'ltr'} aria-labelledby="inspection-evidence-title">
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <div className="grid gap-6 lg:grid-cols-2 lg:gap-16"><h2 id="inspection-evidence-title" className="max-w-lg text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{c[0]}</h2><p className="text-base leading-8 text-slate-600">{c[1]}</p></div>
 <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
 <figure className="m-0"><div className="overflow-hidden rounded-2xl bg-slate-950"><video className="block max-h-[560px] w-full object-contain" controls playsInline preload="none" poster="/images/product-showcase/audio/function-light-check-poster-v1.webp" aria-label={c[2]} src="/images/product-showcase/audio/function-light-check-v1.mp4" /></div><figcaption className="mt-4"><strong className="text-base font-semibold">{c[2]}</strong><p className="mt-2 max-w-lg text-sm leading-7 text-slate-600">{c[3]}</p></figcaption></figure>
 <div><ol className="m-0 list-none divide-y divide-slate-200 border-y border-slate-200 p-0">{[4,6,8].map((n,i)=><li className="flex gap-5 py-6" key={n}><span className="mt-1 text-sm text-purple-700" aria-hidden="true">0{i+1}</span><div><h3 className="text-xl font-semibold">{c[n]}</h3><p className="mt-3 text-base leading-8 text-slate-600">{c[n+1]}</p></div></li>)}</ol><a className="mt-6 inline-block py-2 font-semibold text-purple-900 underline underline-offset-4" href={quoteHref}>{c[10]} <span aria-hidden="true">{language==='ar'?'←':'→'}</span></a></div>
 </div></div></section>;
}
