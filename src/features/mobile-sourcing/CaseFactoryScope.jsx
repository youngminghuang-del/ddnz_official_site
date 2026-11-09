import React from 'react';

export default function CaseFactoryScope() {
 return <section className="ms-section" id="case-factory-order">
  <div className="ms-section-head"><div><p className="ms-eyebrow">OWN FACTORY / MODEL-BY-MODEL QUOTATION</p><h2>From your selected style to a factory quote.</h2>
   <p>DDNZ combines phone-case manufacturing and export supply. Your quotation identifies the manufacturing scope for each selected reference and any complementary styles in the same order.</p>
   <p>Keep the case code, exact phone model, colour and quantity on each line. Then specify logo placement, retail packaging and the sample you want approved. Existing-stock, printed and custom-packaging minimums remain separate; use the terms shown for each style below.</p></div></div>
  <div className="grid gap-5 sm:grid-cols-2">
   <figure className="m-0 min-w-0"><img src="/images/product-showcase/mobile/phone-case-machine-proof-v1.webp" width="1200" height="800" loading="lazy" decoding="async" className="block aspect-video w-full object-contain" alt="Phone-case moulding operation from existing production footage"/><figcaption className="mt-2 text-sm">Moulding process reference. Confirm the process for your selected case.</figcaption></figure>
   <figure className="m-0 min-w-0"><img src="/images/product-showcase/mobile/phone-case-packout-proof-v2.webp" width="1200" height="817" loading="lazy" decoding="async" className="block aspect-video w-full object-contain" alt="Phone-case retail packaging examples"/><figcaption className="mt-2 text-sm">Packaging examples. Confirm pack contents, phone-model labels and artwork before production.</figcaption></figure>
  </div>
  <div className="ms-actions mt-5"><a className="ms-button" href="#buying-brief">Request a factory quote <span aria-hidden="true">↓</span></a><a className="ms-secondary" href="#collection">Choose styles and check MOQ →</a></div>
 </section>;
}
