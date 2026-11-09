import React from 'react';

export default function PrivateLabelScope({ onAction = (_action) => {} }) {
 return <section className="buyer-private-label-scope" id="private-label-configuration">
  <div className="buyer-section-heading"><p className="buyer-eyebrow">PRODUCT / PACKAGING / APPROVAL</p><h2>Define what changes for your brand.</h2>
   <p>Start with an existing DDNZ protector configuration. Confirm the glass, installation kit and phone-model fit separately from printed packaging, inserts and labels. Product and packaging minimums, artwork charges and sample costs are quoted for the selected configuration.</p></div>
  <div className="buyer-private-label-media">
   <figure><img src="/screen-protector-media/assets/001-kit-photo.jpg" width="1280" height="720" loading="lazy" decoding="async" alt="001 screen protector, protective sleeve and installation accessories sample"/><figcaption>001 sample: list the protector and accessories you need included.</figcaption></figure>
   <figure><img src="/screen-protector-media/assets/titan-kit.jpg" width="900" height="675" loading="lazy" decoding="async" alt="Titan screen protector retail packaging and installation tool example"/><figcaption>Titan example: confirm the retail pack, installation format and any branding changes.</figcaption></figure>
  </div>
  <p className="buyer-small">Examples from the current range, before any requested branding changes. Confirm the approved sample, artwork version, labels and packing list for your order.</p>
  <div className="buyer-actions"><a className="buyer-button" href="#buyer-brief" onClick={() => onAction('start_brief')}>Request a factory quote <span aria-hidden="true">↓</span></a><a className="buyer-secondary" href="/screen-protectors/compare/" onClick={() => onAction('view_range')}>Compare current configurations ↗</a></div>
 </section>;
}
