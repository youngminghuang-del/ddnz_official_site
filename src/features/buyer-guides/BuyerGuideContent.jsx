import StartupBuyingContent from '../search-intent/StartupBuyingContent';
import React, { useState, useRef, useId, useEffect } from 'react';
import { buyerLocales, buyerLocale, buyerGroupPath, buildBuyerPayload, validateBuyerBrief } from './data.mjs';
import { localizedProductPath, hasProductTranslation } from '../../lib/productLocalization.mjs';
import { currentHostname, isProductionHost, submitInquiry } from '../commercial-kitchen/data/inquiry.mjs';
import BuyerGuideLinks from './BuyerGuideLinks.jsx';

export function BuyerBriefForm({ guide, locale = 'en', onPrivacy = () => {}, onAction = (_action) => {} }) {
  const lang = buyerLocale(locale), copy = buyerLocales[lang], page = copy.guides[guide.id], f = copy.form;
  const [input, setInput] = useState({ name: '', email: '', company: '', country: '', notes: '' });
  const [errors, setErrors] = useState({}), [status, setStatus] = useState('idle');
  const sending = useRef(false), id = useId();
  const [production, setProduction] = useState(true);
  useEffect(() => { setProduction(isProductionHost(currentHostname())); }, []);
  const payload = buildBuyerPayload(guide, lang, input);
  function change(key, value) { setInput(previous => ({ ...previous, [key]: value })); setErrors(previous => ({ ...previous, [key]: undefined })); if (status !== 'submitting') setStatus('idle'); }
  async function submit(event) {
    event.preventDefault();
    if (sending.current || ['success', 'preview'].includes(status)) return;
    const next = validateBuyerBrief(page, input); setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(`${id}-${Object.keys(next)[0]}`)?.focus(); return;
    }
    sending.current = true; setStatus('submitting');
    try { const result = await submitInquiry(payload); setStatus(result.mode === 'preview' ? 'preview' : 'success'); if (result.mode === 'production') onAction('submit_success'); }
    catch { setStatus('error'); if (production) onAction('submit_error'); }
    finally { sending.current = false; }
  }
  const field = (key, label, { multiline = false, hint, required = false, type = 'text', max = 2000 } = {}) => <label key={key} htmlFor={`${id}-${key}`} className={multiline ? 'buyer-form-wide' : ''}>
    <span>{label}{required && <span aria-hidden="true"> *</span>}</span>
    {multiline ? <textarea id={`${id}-${key}`} name={key} value={input[key] || ''} onChange={e => change(key, e.target.value)} rows={3} maxLength={max} required={required} aria-invalid={!!errors[key]} aria-describedby={`${id}-${key}-help`} dir="auto" /> :
      <input id={`${id}-${key}`} name={key} value={input[key] || ''} onChange={e => change(key, e.target.value)} type={type} maxLength={max} required={required} autoComplete={{ name: 'name', email: 'email', company: 'organization', country: 'country-name' }[key]} dir={key === 'email' ? 'ltr' : 'auto'} aria-invalid={!!errors[key]} aria-describedby={`${id}-${key}-help`} />}
    <small id={`${id}-${key}-help`} className={errors[key] ? 'buyer-error' : ''}>{errors[key] ? f[errors[key]] : hint}</small>
  </label>;
  return <section className="buyer-brief" id="buyer-brief"><div className="buyer-section-heading"><h2>{copy.briefTitle}</h2><p>{copy.briefIntro}</p></div>
    <form className="buyer-form" noValidate onSubmit={submit}>
      <fieldset disabled={status === 'submitting'}>
        {field('name', f.name, { required: true, max: 100 })}{field('email', f.email, { required: true, type: 'email', max: 254 })}
        {field('company', f.company, { max: 120 })}{field('country', f.country, { required: true, max: 100, hint: f.countryHint })}
        {page.fields.map((item, index) => field(item.key, item.label, { multiline: true, hint: item.hint, required: index === 0 }))}
        {field('notes', f.notes, { multiline: true })}
      </fieldset>
      <details className="buyer-review"><summary>{f.review}</summary><pre dir="auto">{payload.message}</pre></details>
      <p className="buyer-small">{f.privacyCopy} {onPrivacy && <button type="button" className="buyer-text-button" onClick={onPrivacy}>{f.privacy}</button>}</p>
      <button type="submit" className="buyer-button" disabled={['submitting', 'success', 'preview'].includes(status)}>{status === 'submitting' ? f.sending : status === 'success' ? f.sent : status === 'preview' ? f.previewed : production ? f.send : f.simulate}<span aria-hidden="true">→</span></button>
      <p className="buyer-small">{production ? f.scope : f.previewScope}</p>
      {status !== 'idle' && status !== 'submitting' && <p role={status === 'error' ? 'alert' : 'status'} className={status === 'error' ? 'buyer-error' : 'buyer-status'}>{f[status]}</p>}
    </form>
  </section>;
}

export default function BuyerGuideContent({ guide, locale = 'en', onPrivacy = () => {}, onAction = (_action) => {} }) {
  const lang = buyerLocale(locale), copy = buyerLocales[lang], page = copy.guides[guide.id];
  const range = localizedProductPath(buyerGroupPath(guide.group), lang);
  const rangeSuffix = hasProductTranslation(buyerGroupPath(guide.group),lang) ? '' : ` (${copy.english})`;
  return <main id="main-content" className="buyer-page" lang={lang === 'zh' ? 'zh-CN' : lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
    <nav className="buyer-breadcrumbs" aria-label={copy.home}><a href={lang === 'en' ? '/' : `/${lang === 'zh' ? 'zh-cn' : lang}/`}>{copy.home}</a><span aria-hidden="true">/</span><a href={range}>{copy[guide.group]}{rangeSuffix}</a><span aria-hidden="true">/</span><span aria-current="page">{page.card}</span></nav>
    <section className="buyer-hero"><div><p className="buyer-eyebrow">{page.eyebrow}</p><h1>{page.heading}</h1><p className="buyer-lead">{page.intro}</p><div className="buyer-actions"><a className="buyer-button" href="#buyer-brief" onClick={() => onAction('start_brief')}>{copy.open}<span aria-hidden="true">→</span></a><a className="buyer-secondary" href={range} onClick={() => onAction('view_range')}>{copy.range}{rangeSuffix} ↗</a></div></div><figure><img src={guide.image} alt={copy[guide.group]} width="900" height="675" fetchPriority="high" /></figure></section>
    <StartupBuyingContent kind={guide.id} locale={lang} />
    <section className="buyer-steps"><h2>{copy.stepsTitle}</h2><div>{page.steps.map(([title, body], index) => <article key={title}><span className="buyer-step-number" aria-hidden="true">{new Intl.NumberFormat(lang).format(index + 1).padStart(2, lang === 'ar' ? '٠' : '0')}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section>
    <div className="buyer-content-columns"><section className="buyer-faq"><h2>{copy.faqTitle}</h2>{page.faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}<a className="buyer-secondary" href={range + (guide.group === 'kitchen' ? '#commercial-kitchen-equipment' : 'compare/')} onClick={() => onAction('view_range')}>{copy.range}{rangeSuffix} ↗</a></section>
      <BuyerBriefForm guide={guide} locale={lang} onPrivacy={onPrivacy} onAction={onAction} /></div>
    <BuyerGuideLinks group={guide.group} locale={lang} exclude={guide.id} />
  </main>;
}
