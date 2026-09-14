import React from 'react';
import { buyerGuides, buyerLocales, buyerLocale } from './data.mjs';
import { localizedProductPath } from '../../lib/productLocalization.mjs';

export default function BuyerGuideLinks({ group, locale = 'en', exclude = null, onAction = (_id, _action) => {} }) {
  const lang = buyerLocale(locale), copy = buyerLocales[lang];
  return <section className="buyer-links" lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} aria-label={copy.entryTitle}>
    <div className="buyer-links-heading"><h2>{copy.entryTitle}</h2><p>{copy.entryIntro}</p></div>
    <div className="buyer-links-grid">{buyerGuides.filter(guide => (!group || guide.group === group) && guide.id !== exclude).map(guide => {
      const page = copy.guides[guide.id];
      return <a key={guide.id} href={localizedProductPath(guide.path, lang)} onClick={() => onAction(guide.id, 'open_guide')} className="buyer-link-card">
        <img src={guide.image} alt="" width="240" height="180" loading="lazy" />
        <div><h3>{page.card}</h3><p>{page.cardCopy}</p><span>{copy.open} <b aria-hidden="true">↗</b></span></div>
      </a>;
    })}</div>
  </section>;
}
