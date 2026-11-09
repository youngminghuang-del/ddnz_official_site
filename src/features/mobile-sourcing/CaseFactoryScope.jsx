import React from 'react';
import { caseFactoryFor } from './case-factory-copy.mjs';

export default function CaseFactoryScope({locale = 'en'}) {
 const c=caseFactoryFor(locale);
 return <section className="ms-section" id="case-factory-order">
  <div className="ms-section-head"><div><p className="ms-eyebrow">{c.scopeEyebrow}</p><h2>{c.scopeHeading}</h2>
   <p>{c.scopeIntro}</p>
   <p>{c.checklist}</p></div></div>
  <div className="grid gap-5 sm:grid-cols-2">
   <figure className="m-0 min-w-0"><img src="/images/product-showcase/mobile/phone-case-machine-proof-v1.webp" width="1200" height="800" loading="lazy" decoding="async" className="block aspect-video w-full object-contain" alt={c.machineAlt}/><figcaption className="mt-2 text-sm">{c.machineCaption}</figcaption></figure>
   <figure className="m-0 min-w-0"><img src="/images/product-showcase/mobile/phone-case-packout-proof-v2.webp" width="1200" height="817" loading="lazy" decoding="async" className="block aspect-video w-full object-contain" alt={c.packAlt}/><figcaption className="mt-2 text-sm">{c.packCaption}</figcaption></figure>
  </div>
  <div className="ms-actions mt-5"><a className="ms-button" href="#buying-brief">{c.quote} <span aria-hidden="true">↓</span></a><a className="ms-secondary" href="#collection">{c.styles} →</a></div>
 </section>;
}
