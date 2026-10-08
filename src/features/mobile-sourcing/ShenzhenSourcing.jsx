import React from 'react';
import { shenzhenCopy } from './shenzhen-copy.mjs';
import { localizedProductPath } from '../../lib/productLocalization.mjs';
import { navigationPath } from '../../lib/productLanguageRouting';

export default function ShenzhenSourcing({ locale = 'en' }) {
 const c = shenzhenCopy[locale === "zh-cn" ? "zh" : locale] || shenzhenCopy.en;
 return <section id="shenzhen-sourcing" className="ms-shenzhen" aria-labelledby="shenzhen-heading">
  <div className="ms-shenzhen-copy"><p className="ms-eyebrow">{c[0]}</p><h2 id="shenzhen-heading">{c[1]}</h2>
   <p className="ms-shenzhen-lead">{c[2]}</p><p>{c[3]}</p><p>{c[4]}</p>
   <a className="ms-secondary" href="#buying-brief">{c[10]} <span aria-hidden="true">↓</span></a>
  </div>
  <div className="ms-shenzhen-photos">
   <figure><img src="/images/product-showcase/mobile/phone-case-finish-samples-v1.webp" alt={c[5]} width="1000" height="1334" loading="lazy" decoding="async"/><figcaption>{c[5]}</figcaption></figure>
   <figure><img src="/images/product-showcase/mobile/phone-case-packout-proof-v2.webp" alt={c[6]} width="1200" height="817" loading="lazy" decoding="async"/><figcaption>{c[6]}</figcaption></figure>
  </div>
  <nav className="ms-shenzhen-links" aria-label={c[0]}>
   <a href={localizedProductPath('/phone-cases',locale)}>{c[7]} <span aria-hidden="true">→</span></a>
   <a href={localizedProductPath('/screen-protectors',locale)}>{c[8]} <span aria-hidden="true">→</span></a>
   <a href={navigationPath('/sourcing-services/inspection-quality-control/',locale)}>{c[9]} <span aria-hidden="true">→</span></a>
  </nav>
 </section>;
}
