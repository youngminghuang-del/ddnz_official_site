import { useLanguage } from '../../contexts/LanguageContext';
import { intentCopy } from './copy.mjs';
export { intentCopy } from './copy.mjs';
const goals = ['Product Sourcing', 'Supplier Inspection & Consolidation', 'Freight Export'];
export default function IntentChoice({ onChoose }: { onChoose: (goal: string) => void }) {
 const { language } = useLanguage(); const c = intentCopy[language];
 return <section id="get-a-quote" dir={language === 'ar' ? 'rtl' : undefined} className="mx-auto max-w-6xl px-5 pb-20 pt-12 sm:pt-20" aria-labelledby="inquiry-intent-title">
  <p className="text-sm font-bold uppercase tracking-widest text-purple-800">DDNZ Global</p>
  <h1 id="inquiry-intent-title" className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">{c[0]}</h1>
  <p className="mt-5 text-lg leading-8 text-slate-600">{c[1]}</p>
  <div className="mt-10 grid gap-5 md:grid-cols-3">{goals.map((goal, i) => <button key={goal} type="button" onClick={() => onChoose(goal)} className="rounded-2xl border border-slate-200 bg-white p-6 text-start shadow-sm transition hover:border-purple-600 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-700">
   <span className="text-sm font-bold text-purple-700">0{i+1}</span><span className="mt-5 block text-xl font-bold">{c[2+i*2]}</span><span className="mt-3 block text-sm leading-7 text-slate-600">{c[3+i*2]}</span>
  </button>)}</div>
 </section>;
}
