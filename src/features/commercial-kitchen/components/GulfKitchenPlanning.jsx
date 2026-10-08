import React from 'react';
import en from '../locales/gulf/en.mjs';
import ar from '../locales/gulf/ar.mjs';
const copies = { en, ar };
export function GulfKitchenEntry({ locale = 'en' }) {
  const t = copies[locale];
  return t ? <a className="gulf-kitchen-entry" href="#commercial-kitchen-gulf">{t.entry} <span aria-hidden="true">↓</span></a> : null;
}
export default function GulfKitchenPlanning({ locale = 'en' }) {
  const t = copies[locale];
  if (!t) return null;
  const prefix = locale === 'ar' ? '/ar' : '';
  return <section id="commercial-kitchen-gulf" className="gulf-kitchen section wrap" aria-labelledby="gulf-kitchen-title">
    <header className="gulf-kitchen-heading"><p className="eyebrow">{t.eyebrow}</p><h2 id="gulf-kitchen-title">{t.title}</h2><p>{t.intro}</p></header>
    <div className="gulf-kitchen-layout">
      <figure className="gulf-kitchen-visual"><img src="/commercial-kitchen-media/cold-2.webp" alt={t.imageAlt} loading="lazy" width="452" height="700"/><figcaption>{t.caption}</figcaption><a className="text-link" href="#commercial-kitchen-equipment">{t.equipment} <span aria-hidden="true">↑</span></a></figure>
      <div><div className="gulf-kitchen-origin"><h3>{t.originTitle}</h3><p>{t.origin}</p></div><ol className="gulf-kitchen-steps">{t.points.map((point,index)=><li key={point.title}><span className="gulf-step-number" aria-hidden="true"><bdi>{String(index+1).padStart(2,'0')}</bdi></span><div><h3>{point.title}</h3><p>{point.text}</p></div></li>)}</ol></div>
    </div>
    <div className="gulf-kitchen-brief"><div><h3>{t.briefTitle}</h3><p>{t.brief}</p></div><a className="button primary" href="#commercial-kitchen-list">{t.request} <span aria-hidden="true">↓</span></a></div>
    <nav className="gulf-kitchen-related" aria-label={t.eyebrow}><a href={`${prefix}/sourcing/restaurant-kitchen-packages-from-china/`}>{t.package} <span aria-hidden="true">↗</span></a><a href={`${prefix}/shipping-from-china-to-saudi-arabia/`}>{t.freight} <span aria-hidden="true">↗</span></a></nav>
  </section>;
}
