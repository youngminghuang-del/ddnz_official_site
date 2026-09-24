import React from 'react';
import copy from './assortments.json';
import { foodPrefix } from '../food-processing/localization';

type Locale = keyof typeof copy;
const productIds = ['mini-rgb', 'mini-karaoke', 'dual-eight-party', 'outdoor-boombox', 'shower-clip', 'retro-desktop'];
const packIds = ['reseller-starter', 'party-karaoke', 'outdoor-lifestyle'];
export default function AudioAssortments({locale = 'en'}: {locale?: Locale}) {
  const c = copy[locale];
  const quote = (name: string, scope: string) => `${foodPrefix(locale)}/get-a-quote/?${new URLSearchParams({leadGoal:'Product Sourcing',source:'audio_assortments',industry:name,productScope:scope,overviewBrief:`${name}\n${scope}`})}`;
  return <section id="speaker-seller-assortments" className="mx-auto max-w-7xl space-y-10 px-6 py-12 text-slate-900" lang={locale === 'zh' ? 'zh-CN' : locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
    <header className="max-w-4xl"><h2 className="text-3xl font-bold leading-tight">{c.heading}</h2><p className="mt-5 text-lg leading-8">{c.intro}</p></header>
    <div className="grid gap-6 md:grid-cols-2">{[{model:'K12',image:'k12-karaoke-reference',index:1},{model:'BTS07',image:'bts07-shower-reference',index:4}].map(({model,image,index})=><figure key={model} className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><img src={`/images/product-showcase/audio/${image}.webp`} alt={`${model} · ${c.products[index][0]}`} width="720" height="720" loading="lazy" className="aspect-square w-full object-contain"/><figcaption className="p-5 font-bold">{model} · {c.products[index][0]}</figcaption></figure>)}</div>
    <section aria-labelledby="speaker-product-heading"><h3 id="speaker-product-heading" className="text-2xl font-bold">{c.labels[0]}</h3><div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{c.products.map(([title,body],i)=><article id={productIds[i]} key={title} className="rounded-2xl border border-slate-200 bg-white p-6"><span className="text-sm font-bold text-purple-700">0{i+1}</span><h4 className="mt-3 text-xl font-bold">{title}</h4><p className="my-5 leading-7">{body}</p><a href={quote(title,body)} className="font-bold text-purple-800 underline">{c.labels[3]} →</a></article>)}</div></section>
    <section aria-labelledby="speaker-package-heading"><h3 id="speaker-package-heading" className="text-2xl font-bold">{c.labels[1]}</h3><div className="mt-6 grid gap-5 lg:grid-cols-3">{c.packs.map(([title,body],i)=><article id={packIds[i]} key={title} className="rounded-2xl bg-purple-50 p-6"><h4 className="text-xl font-bold">{title}</h4><p className="my-5 leading-7">{body}</p><a href={quote(title,body)} className="font-bold text-purple-800 underline">{c.labels[3]} →</a></article>)}</div></section>
    <section aria-labelledby="speaker-channel-heading"><h3 id="speaker-channel-heading" className="text-2xl font-bold">{c.labels[2]}</h3><div className="mt-6 grid gap-5 lg:grid-cols-3">{c.channels.map(([title,body])=><article key={title} className="rounded-2xl border border-slate-200 p-6"><h4 className="text-xl font-bold">{title}</h4><p className="mt-5 leading-7">{body}</p></article>)}</div></section>
    <p className="text-sm leading-7 text-slate-600">{c.note}</p>
  </section>;
}
