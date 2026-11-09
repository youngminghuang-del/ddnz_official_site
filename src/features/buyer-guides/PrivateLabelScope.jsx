import React from 'react';
import { buyerLocales, buyerLocale } from './data.mjs';
import { localizedProductPath } from '../../lib/productLocalization.mjs';

export default function PrivateLabelScope({ locale = 'en', onAction = (_action) => {} }) {
 const lang=buyerLocale(locale),page=buyerLocales[lang].guides['private-label'],c=page.factoryScope;
 return <section className="buyer-private-label-scope" id="private-label-configuration">
  <div className="buyer-section-heading"><p className="buyer-eyebrow">{c.scopeEyebrow}</p><h2>{c.scopeHeading}</h2>
   <p>{c.scopeIntro}</p></div>
  <div className="buyer-private-label-media">
   <figure><img src="/screen-protector-media/assets/001-kit-photo.jpg" width="1280" height="720" loading="lazy" decoding="async" alt={c.kitAlt}/><figcaption>{c.kitCaption}</figcaption></figure>
   <figure><img src="/screen-protector-media/assets/titan-kit.jpg" width="900" height="675" loading="lazy" decoding="async" alt={c.titanAlt}/><figcaption>{c.titanCaption}</figcaption></figure>
  </div>
  <p className="buyer-small">{c.note}</p>
  <div className="buyer-actions"><a className="buyer-button" href="#buyer-brief" onClick={() => onAction('start_brief')}>{page.factoryQuote} <span aria-hidden="true">↓</span></a><a className="buyer-secondary" href={localizedProductPath('/screen-protectors/compare',lang)} onClick={() => onAction('view_range')}>{c.compare} ↗</a></div>
 </section>;
}
