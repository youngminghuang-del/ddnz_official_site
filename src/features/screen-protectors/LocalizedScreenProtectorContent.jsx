import { renderPrivacy001 } from './privacy001.mjs';
import { readMixedDraft, saveMixedDraft, replaceFilms, filmSelection, mixedBriefPath } from '../mobile-sourcing/mixed-storage.mjs';
import { mixedCopy } from '../mobile-sourcing/mixed-products.mjs';
import { copyFor } from '../mobile-sourcing/catalog.mjs';
import React, { useEffect, useRef, useState } from 'react';
import { BASIS, PRODUCTS } from './calculator.mjs';
import { createScreenProtectorActionReporter } from './site-analytics.mjs';
import {
  PHONE_PRODUCT_IDS, emptyPhoneDraft, localText, localizedPhonePath, localizedProduct,
  localizedInquiryBrief, localizedQuoteHref, phoneCopy, phoneMoney, phoneNumber, phoneReferenceDate, validateLocalizedSelection,
} from './localization.mjs';

// SSR contract: locale='es'|'ar', page='home'|'compare'. No router, CSS imports,
// browser globals or storage access during render; initial selection is empty.
// onNavigate is optional; parent can use React Router, otherwise normal navigation.
// onAction receives only select_configuration, create_brief, continue_inquiry.
export default function LocalizedScreenProtectorContent({ locale, page = 'home', onNavigate = undefined, onAction = undefined }) {
  const copy = phoneCopy(locale);
  const reportAction = createScreenProtectorActionReporter(onAction);
  localizedPhonePath(locale, page); // Validate both SSR props before rendering.
  const [draft, setDraft] = useState(emptyPhoneDraft);
  const [errors, setErrors] = useState([]);
  const [reviewing, setReviewing] = useState(false);
  const [status, setStatus] = useState('');
  const [storageFailed, setStorageFailed] = useState(false);
  const briefRef = useRef(null);
  const errorRef = useRef(null);
  const result = validateLocalizedSelection(locale, draft);
  const brief = result.valid ? localizedInquiryBrief(locale, result) : '';
  useEffect(() => {
    setDraft(emptyPhoneDraft()); setErrors([]); setReviewing(false); setStatus(''); setStorageFailed(false);
    try {
      const restored=filmSelection(readMixedDraft(window.sessionStorage));
      setDraft(restored); if(restored.rows.length)setStatus(copy.restored);
    } catch { setStorageFailed(true); }
  }, [locale]);
  useEffect(() => { if (errors.length) errorRef.current?.focus(); }, [errors]);
  function update(next) {
    setDraft(next); setErrors([]); setReviewing(false); setStatus('');
    try {
      saveMixedDraft(window.sessionStorage,replaceFilms(readMixedDraft(window.sessionStorage),next,locale));
      setStorageFailed(false);
    } catch { setStorageFailed(true); }
  }
  function addProduct(product) {
    if (draft.rows.length >= BASIS.maxRows) {
      setErrors([{ field: 'rows', row: null, message: localText(copy.errors.rows, { max: phoneNumber(locale, BASIS.maxRows) }) }]); return;
    }
    const row = draft.rows.length;
    update({ ...draft, rows: [...draft.rows, { product, model: '', qty: phoneNumber(locale, PRODUCTS[product].addQty) }] });
    setStatus(copy.selected);
    reportAction('select_configuration');
    window.requestAnimationFrame(() => document.getElementById(`phone-model-${row}`)?.focus());
  }
  function updateRow(index, key, value) {
    update({ ...draft, rows: draft.rows.map((row, i) => i === index ? { ...row, [key]: value } : row) });
  }
  function review(event) {
    event.preventDefault();
    setErrors(result.errors); setReviewing(result.valid); setStatus('');
    if (result.valid) {
      reportAction('create_brief');
      window.requestAnimationFrame(() => document.getElementById('phone-review-title')?.focus());
    }
  }
  function continueInquiry() {
    if (!result.valid) { setErrors(result.errors); setReviewing(false); return; }
    let saved;
    try { saveMixedDraft(window.sessionStorage,replaceFilms(readMixedDraft(window.sessionStorage),draft,locale)); saved={ok:true}; } catch { saved = { ok: false }; }
    if (!saved.ok) { setStorageFailed(true); return; }
    const href = mixedBriefPath(locale);
    reportAction('continue_inquiry');
    if (onNavigate) onNavigate(href); else window.location.assign(href);
  }
  async function copyBrief() {
    try { await navigator.clipboard.writeText(brief); setStatus(copy.copied); }
    catch { briefRef.current?.focus(); briefRef.current?.select(); setStatus(copy.copyFailed); }
  }
  const errorFor = (field, row = null) => errors.some(error => error.field === field && error.row === row);
  const fieldId = error => error.row === null ? `phone-${error.field}` : `phone-${error.field}-${error.row}`;
  return <div className="phone-film phone-localized" lang={locale} dir={copy.direction} data-phone-locale={locale}>
    <nav className="phone-local-nav" aria-label={copy.navigation}>
      <a href={localizedPhonePath(locale)} aria-current={page === 'home' ? 'page' : undefined}>{copy.section}</a>
      <a href={localizedPhonePath(locale, 'compare')} aria-current={page === 'compare' ? 'page' : undefined}>{copy.compare}</a>
      <a href="#phone-inquiry">{copy.prepare}</a><a href={mixedBriefPath(locale)}>{copyFor(mixedCopy.title,locale)}</a>
    </nav>
    <main>
      <nav className="breadcrumbs" aria-label={copy.breadcrumb}><ol>
        <li><a href={`/${locale}/`}>{copy.home}</a></li>
        <li>{page === 'home' ? <span aria-current="page">{copy.section}</span> : <a href={localizedPhonePath(locale)}>{copy.section}</a>}</li>
        {page === 'compare' && <li><span aria-current="page">{copy.compare}</span></li>}
      </ol></nav>
      <header className={`phone-local-hero ${page === 'compare' ? 'phone-local-hero-compact' : ''}`}>
        <div><p className="eyebrow">{copy.eyebrow}</p><h1>{page === 'home' ? copy.title : copy.compareTitle}</h1>
          <p className="lede">{page === 'home' ? copy.intro : copy.compareIntro}</p>
          <div className="actions"><a className="button primary" href={page === 'home' ? `${localizedPhonePath(locale, 'compare')}#phone-products` : '#phone-inquiry'}>{page === 'home' ? copy.explore : copy.prepare}</a></div>
        </div>
        {page === 'home' && <figure><img src="/screen-protector-media/assets/001-kit-photo.jpg" alt={copy.imageAlt} width="1672" height="941" fetchPriority="high" /><figcaption>{copy.heroCaption}</figcaption></figure>}
      </header>
      {page === 'home' && <section className="phone-local-steps" aria-labelledby="phone-steps-title"><h2 id="phone-steps-title">{copy.stepsTitle}</h2><ol>{copy.steps.map(([title, text], i) => <li key={title}><span aria-hidden="true">{phoneNumber(locale, i + 1)}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></section>}
      <section id="phone-products" aria-labelledby="phone-products-title">
        <h2 id="phone-products-title">{page === 'home' ? copy.productsTitle : copy.compare}</h2>
        <p className="phone-local-price-note">{localText(copy.reference, { date: phoneReferenceDate(locale) })}<br />{copy.priceScope}</p>
        <div className="phone-local-products">{PHONE_PRODUCT_IDS.map(id => {
          const item = localizedProduct(locale, id), p = item.product;
          return <article className="phone-local-product" id={`phone-product-${id}`} key={id}>
            <figure><img src={item.image} width="700" height="700" alt={item.name} loading="lazy" /></figure>
            <div className="phone-local-product-body"><p className="eyebrow">{item.label}</p><h3><bdi dir="auto">{item.name}</bdi></h3>
              <p className="phone-local-price"><bdi dir="ltr">{phoneMoney(locale, p.price)}</bdi> <span>{copy.perPiece}</span></p>
              <dl className="phone-local-specs">
                <div><dt>{copy.minimum}</dt><dd><bdi>{phoneNumber(locale, p.minQty)}</bdi> {copy.pieces}</dd></div>
                {p.minOrderQty && <div><dt>{copy.orderMinimum}</dt><dd><bdi>{phoneNumber(locale, p.minOrderQty)}</bdi> {copy.pieces}</dd></div>}
                <div><dt>{copy.carton}</dt><dd><bdi>{phoneNumber(locale, p.unitsPerCarton)}</bdi></dd></div>
                <div><dt>{copy.dimensions}</dt><dd><bdi dir="ltr">{p.cartonCm.map(value => phoneNumber(locale, value, 2)).join(' × ')}</bdi> {copy.cm}</dd></div>
                <div><dt>{copy.weight}</dt><dd><bdi>{phoneNumber(locale, item.fullKg, 2)}</bdi> {copy.kg}</dd></div>
              </dl>
              <p>{item.packing}</p>
              <button className="button primary" type="button" onClick={() => addProduct(id)} aria-label={`${copy.select}: ${item.name}`}>{copy.select}</button>
            </div>
          </article>;
        })}</div>
        <div dangerouslySetInnerHTML={{__html:renderPrivacy001(locale)}} />
        <p className="phone-local-fit">{copy.fit}</p>
      </section>
      <section className="phone-local-inquiry" id="phone-inquiry" aria-labelledby="phone-inquiry-title">
        <h2 id="phone-inquiry-title">{copy.inquiry}</h2><p>{copy.inquiryIntro}</p>
        <p className="small">{copy.notSent}</p>
        <p role="status" className="phone-local-status">{status}</p>
        {storageFailed && <p role="status" className="phone-local-warning">{copy.storageFailed}</p>}
        {errors.length > 0 && <div id="phone-form-errors" className="phone-local-errors" tabIndex={-1} ref={errorRef} role="alert"><h3>{copy.errorTitle}</h3><ul>{errors.map((error, i) => <li key={i}><a href={`#${fieldId(error)}`}>{error.message}</a></li>)}</ul></div>}
        <form onSubmit={review} noValidate>
          <div id="phone-rows" tabIndex={-1}>
            {!draft.rows.length && <p className="phone-local-empty">{copy.empty}</p>}
            {draft.rows.map((row, index) => <fieldset className="phone-local-row" key={index}>
              <legend>{localText(copy.line, { row: phoneNumber(locale, index + 1) })}</legend>
              <div className="phone-local-fields">
                <label htmlFor={`phone-product-${index}`}>{copy.product}<select id={`phone-product-${index}`} value={row.product} onChange={event => updateRow(index, 'product', event.target.value)} aria-invalid={errorFor('product', index)}>{PHONE_PRODUCT_IDS.map(id => <option key={id} value={id}>{copy.names[id]}</option>)}</select></label>
                <label htmlFor={`phone-model-${index}`}>{copy.model}<input id={`phone-model-${index}`} value={row.model} onChange={event => updateRow(index, 'model', event.target.value)} maxLength={80} placeholder={copy.modelPlaceholder} dir="auto" autoComplete="off" aria-invalid={errorFor('model', index)} aria-describedby="phone-model-help" /></label>
                <label htmlFor={`phone-qty-${index}`}>{copy.quantity}<input id={`phone-qty-${index}`} value={row.qty} type="text" inputMode="numeric" onChange={event => updateRow(index, 'qty', event.target.value)} aria-invalid={errorFor('qty', index)} aria-describedby={`phone-qty-help-${index}`} dir="auto" /></label>
              </div>
              <p id={`phone-qty-help-${index}`} className="small">{localText(copy.quantityHelp, { min: phoneNumber(locale, PRODUCTS[row.product].minQty) })} {row.product === 'og28' && localText(copy.og28Help, { total: phoneNumber(locale, PRODUCTS.og28.minOrderQty), min: phoneNumber(locale, PRODUCTS.og28.minQty) })}</p>
              <button type="button" className="text-link" onClick={() => update({ ...draft, rows: draft.rows.filter((_, i) => i !== index) })}>{localText(copy.remove, { row: phoneNumber(locale, index + 1) })}</button>
            </fieldset>)}
          </div>
          <button className="button secondary" type="button" onClick={() => addProduct('og28')}>{copy.add}</button>
          <p id="phone-model-help" className="small">{copy.modelHelp}</p>
          <div className="phone-local-destination"><label htmlFor="phone-destination">{copy.destination}</label><input id="phone-destination" value={draft.destination} onChange={event => update({ ...draft, destination: event.target.value })} maxLength={120} placeholder={copy.destinationPlaceholder} aria-invalid={errorFor('destination')} aria-describedby="phone-destination-help" dir="auto" /><p id="phone-destination-help" className="small">{copy.destinationHelp}</p></div>
          <label htmlFor="phone-notes">{copy.notes}</label><textarea id="phone-notes" rows={3} value={draft.notes} onChange={event => update({ ...draft, notes: event.target.value })} maxLength={1000} placeholder={copy.notesPlaceholder} aria-invalid={errorFor('notes')} dir="auto" />
          <button type="submit" className="button primary">{copy.review}</button>
        </form>
        {reviewing && result.valid && <section className="phone-local-review" aria-labelledby="phone-review-title">
          <h3 id="phone-review-title" tabIndex={-1}>{copy.reviewTitle}</h3>
          <dl><div><dt>{copy.totalPieces}</dt><dd><bdi>{phoneNumber(locale, result.summary.pieces)}</bdi> {copy.pieces}</dd></div><div><dt>{copy.goods}</dt><dd><bdi dir="ltr">{phoneMoney(locale, result.summary.goodsCny)}</bdi></dd></div></dl>
          <label htmlFor="phone-brief">{copy.briefLabel}</label><textarea id="phone-brief" ref={briefRef} readOnly value={brief} rows={12} dir={copy.direction} />
          <p className="small">{copy.priceScope}</p>
          <div className="actions"><button className="button primary" type="button" onClick={continueInquiry}>{copy.continue}</button><button className="button secondary" type="button" onClick={copyBrief}>{copy.copy}</button><button className="text-link" type="button" onClick={() => { setReviewing(false); document.getElementById('phone-destination')?.focus(); }}>{copy.edit}</button></div>
          {storageFailed && <a className="text-link" href={localizedQuoteHref(locale, draft.destination, { attached: false })}>{copy.manual}</a>}
        </section>}
        <noscript><p>{copy.noScript} <a href={localizedQuoteHref(locale, '', { attached: false })}>{copy.manual}</a></p></noscript>
      </section>
      <aside className="phone-local-resources" aria-labelledby="phone-resources-title"><h2 id="phone-resources-title">{copy.resources}</h2><ul>
        <li><a href="/screen-protectors/guides/" hrefLang="en">{copy.guidesEnglish}</a></li>
        <li><a href="/screen-protectors/videos/" hrefLang="en">{copy.videosEnglish}</a></li>
        <li><a href="/screen-protectors/calculator/" hrefLang="en">{copy.calculatorEnglish}</a></li>
      </ul><p>{copy.istanbul}</p></aside>
    </main>
  </div>;
}

export { LocalizedScreenProtectorContent };
