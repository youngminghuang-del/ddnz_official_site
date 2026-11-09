import React from 'react';
import {copyFor} from '../catalog.mjs';
import {accessoryCopy} from './copy.mjs';
import {localizedProductPath} from '../../../lib/productLocalization.mjs';
export default function FactorySourcing({locale}){
 const c=k=>copyFor(accessoryCopy[k],locale);
 if(locale==='en')return <section className="ms-section" id="factory-sourcing">
  <div className="ms-section-head"><div><p className="ms-eyebrow">OWN FACTORY / COMPLEMENTARY SUPPLY</p><h2>Manufacturing, product selection and export in one order.</h2>
  <p>DDNZ is a factory-integrated manufacturer and exporter in China. The quotation identifies our factory-made range, the manufacturing scope for each selected model and any complementary products supplied with it.</p>
  <p>Choose phone cases and screen protectors first. Add straps, charging accessories or wireless audio as separate order lines. Minimums, customization, samples and packaging are confirmed by product; combining categories does not combine their production minimums.</p></div></div>
  <div className="grid gap-5 sm:grid-cols-2">
   <figure className="m-0 min-w-0"><img src="/images/product-showcase/mobile/phone-case-machine-proof-v1.webp" width="1200" height="800" loading="lazy" decoding="async" className="block aspect-video w-full object-contain" alt="Phone-case moulding operation shown in existing production footage"/><figcaption className="mt-2 text-sm">A phone-case moulding operation. Confirm the process and manufacturing scope for your chosen reference.</figcaption></figure>
   <figure className="m-0 min-w-0"><img src="/images/product-showcase/mobile/phone-case-packout-proof-v2.webp" width="1200" height="817" loading="lazy" decoding="async" className="block aspect-video w-full object-contain" alt="Phone-case retail packaging examples"/><figcaption className="mt-2 text-sm">Retail packaging examples. Confirm the phone model, pack contents, labels and branding in your quote.</figcaption></figure>
  </div>
  <p className="mt-5"><a className="ms-secondary" href="/screen-protectors/videos/">Watch screen protector production stages →</a></p>
  <a className="ms-button" href="#buying-brief">Request a factory quote <span aria-hidden="true">↓</span></a>
 </section>;
 return <section className="ms-section ms-factory-sourcing" id="factory-sourcing">
  <div>
   <h2>{c('factoryTitle')}</h2>
   <p>{c('factoryIntro')}</p>
   <p>{c('factoryBody')}</p>
   <a href="#buying-brief">{c('factoryCta')} →</a>
  </div>
  <div>
   {['Audio','Style','Gear'].map(k=><details key={k}><summary>{c('factory'+k+'Title')}</summary><p>{c('factory'+k)}</p></details>)}
   <a href={localizedProductPath('/sourcing-services/supplier-search',locale)}>{c('factoryLink')} →</a>
   <a href={localizedProductPath('/sourcing-services/inspection-quality-control',locale)}>{c('qualityLink')} →</a>
  </div>
 </section>;
}
