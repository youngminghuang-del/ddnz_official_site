import ChineseDealerPricePlanning from '../commercial-kitchen/components/ChineseDealerPricePlanning';
import { purchaseFlow } from '../commercial-kitchen/locales/purchase-flow.mjs';
import { kitchenPackagePath } from '../commercial-kitchen/routes.mjs';
import DealerPricePlanning from '../commercial-kitchen/components/DealerPricePlanning.jsx';
import GulfKitchenPlanning from '../commercial-kitchen/components/GulfKitchenPlanning.jsx';
import { KITCHEN_PATH, kitchenReading } from '../commercial-kitchen/data/discovery.mjs';
import kitchenProducts from '../commercial-kitchen/data/products.mjs';
import RestaurantProjectSelection, { RestaurantProjectHero } from './RestaurantProjectSelection.jsx';
import DealerStarterPlans, { dealerStarterCopy } from './DealerStarterPlans.jsx';
import PrivateLabelScope from './PrivateLabelScope.jsx';
import StartupBuyingContent from '../search-intent/StartupBuyingContent';
import React, { useState, useRef, useId, useEffect } from 'react';
import { buyerLocales, buyerLocale, buyerGroupPath, buildBuyerPayload, validateBuyerBrief } from './data.mjs';
import { localizedProductPath, hasProductTranslation } from '../../lib/productLocalization.mjs';
import { currentHostname, isProductionHost, submitInquiry } from '../commercial-kitchen/data/inquiry.mjs';
import BuyerGuideLinks from './BuyerGuideLinks.jsx';

export function BuyerBriefForm({ guide, locale = 'en', starter = '', onRemoveStarter = () => {}, initialCountry = '', onPrivacy = () => {}, onAction = (_action) => {} }) {
  const lang = buyerLocale(locale), copy = buyerLocales[lang], page = copy.guides[guide.id], f = copy.form;
  const [input, setInput] = useState({ name: '', email: '', company: '', country: initialCountry, notes: '' });
  const [errors, setErrors] = useState({}), [status, setStatus] = useState('idle');
  const sending = useRef(false), id = useId();
  const [production, setProduction] = useState(true);
  useEffect(() => { setProduction(isProductionHost(currentHostname())); }, []);
  const firstField = page.fields[0].key;
  const payload = buildBuyerPayload(guide, lang, input, starter && dealerStarterCopy[lang][9] + '\n' + starter);
  function change(key, value) { setInput(previous => ({ ...previous, [key]: value })); setErrors(previous => ({ ...previous, [key]: undefined })); if (status !== 'submitting') setStatus('idle'); }
  async function submit(event) {
    event.preventDefault();
    if (sending.current || ['success', 'preview'].includes(status)) return;
    const next = validateBuyerBrief(page, starter ? { ...input, [firstField]: starter } : input); setErrors(next);
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
  return <section className="buyer-brief" id="buyer-brief" tabIndex={-1}><div className="buyer-section-heading"><h2>{copy.briefTitle}</h2><p>{copy.briefIntro}</p></div>
    {initialCountry === 'Indonesia' && <p lang="id">Isi kebutuhan proyek dalam bahasa Indonesia. Cantumkan kota, menu, daftar alat, ukuran ruang dan target pembukaan. Jika ada denah daring, sertakan tautannya.</p>}
    {starter && <div className="dealer-plan-current" aria-live="polite"><p>{starter}</p><button type="button" className="buyer-text-button" onClick={onRemoveStarter}>{dealerStarterCopy[lang][8]}</button></div>}
    <form className="buyer-form" noValidate onSubmit={submit}>
      <fieldset disabled={status === 'submitting'}>
        {field('name', f.name, { required: true, max: 100 })}{field('email', f.email, { required: true, type: 'email', max: 254 })}
        {field('company', f.company, { max: 120 })}{field('country', f.country, { required: true, max: 100, hint: f.countryHint })}
        {page.fields.map((item, index) => field(item.key, item.label, { multiline: true, hint: item.hint, required: index === 0 && !starter }))}
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

const kitchenGuideTasks = {
  dealer: [
    { href: '#dealer-starter-plans', action: 'start_brief', label: 'Build a first order',
      description: 'Choose a starter mix and edit quantities.',
      image: '/commercial-kitchen-media/ddnz-products/ZH-102V-ddnz-v1-600.webp' },
    { href: '#buyer-brief', action: 'start_brief', label: 'Request a quote for my list',
      description: 'Send the models and quantities you already know.',
      image: '/media/process/brief-spec-discussion-poster.webp' },
    { href: '#commercial-kitchen-benchmarks', label: 'Estimate my buying margin',
      description: 'Compare retail references and calculate in CNY.',
      image: '/images/posts/_cards/turkey-kitchen-equipment-dealers-china-sourcing-margin-checklist-3bfeac33-480.webp' },
  ],
  project: [
    { href: '#buyer-brief', action: 'start_brief', label: 'Quote my equipment list',
      description: 'Share your equipment schedule, quantities and destination.',
      image: '/media/process/brief-spec-discussion-poster.webp' },
    { href: '#project-takeaway', action: 'view_range', label: 'Choose equipment for my menu',
      description: 'See how a sample kitchen is organised by station.',
      image: '/images/restaurant-kitchen-packages/qsr-isometric-concept-v1.webp' },
  ],
};

function KitchenGuideTasks({ tasks, onAction, label = 'Choose your next step' }) {
  return <nav className="buyer-task-links" aria-label={label}>
    {tasks.map(({ href, action, label, description, image })=><a key={href} href={href} onClick={()=>action&&onAction(action)}>
      <img src={image} alt="" width="64" height="48" decoding="async"/>
      <div><strong>{label}</strong>{description && <span>{description}</span>}</div>
      <span aria-hidden="true">{href.startsWith('#') ? '↓' : '↗'}</span>
    </a>)}
  </nav>;
}

export default function BuyerGuideContent({ guide, modelQuery = '', locale = 'en', initialCountry = '', onPrivacy = () => {}, onAction = (_action) => {} }) {
  const lang = buyerLocale(locale), copy = buyerLocales[lang], page = copy.guides[guide.id];
  const [starter, setStarter] = useState('');
  const [buyingTarget, setBuyingTarget] = useState('');
  const isDealer = guide.id === 'kitchen-distributors' && Boolean(dealerStarterCopy[lang]);
  const isProject = guide.id === 'restaurant-projects' && ['en', 'es'].includes(lang);
  const flow = purchaseFlow[lang];
  let tasks = null;
  if (isDealer) {
    tasks = lang === 'en' ? kitchenGuideTasks.dealer : kitchenGuideTasks.dealer.map((task, index) => ({
      ...task,
      label: [dealerStarterCopy[lang][0], flow.quote, dealerStarterCopy[lang][6]][index],
      description: undefined,
      href: index === 2 ? (lang === 'zh' ? '#commercial-kitchen-margin' : localizedProductPath(KITCHEN_PATH, lang) + '#commercial-kitchen-margin') : task.href,
    }));
  } else if (guide.id === 'restaurant-projects') {
    tasks = lang === 'en' ? kitchenGuideTasks.project : kitchenGuideTasks.project.map((task, index) => ({
      ...task,
      label: index === 0 ? flow.quote : flow.menu,
      description: undefined,
      href: index === 1 && !isProject ? localizedProductPath(kitchenPackagePath, lang) : task.href,
    }));
  }
  function useStarter(selection) {
    setStarter(selection);
    focusBrief();
  }
  function useBuyingTarget(target) {
    const model = kitchenProducts.find(item => item.id === target.productId)?.model;
    if (!model) return;
    const price = target.price == null ? 'Price requested' : (target.priceBasis === 'reference' ? 'Indicative reference' : 'Buyer target') + ' CNY ' + target.price.toFixed(2) + ' per unit';
    setBuyingTarget(model + ' × ' + target.units + ' · ' + price);
    focusBrief();
  }
  function focusBrief() {
    onAction('start_brief');
    const brief = document.getElementById('buyer-brief');
    brief?.focus({ preventScroll: true });
    brief?.scrollIntoView({ block: 'start' });
  }
  const range = localizedProductPath(buyerGroupPath(guide.group), lang);
  const rangeSuffix = hasProductTranslation(buyerGroupPath(guide.group),lang) ? '' : ` (${copy.english})`;
  const faqBlock = <section className="buyer-faq"><h2>{copy.faqTitle}</h2>{page.faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}<a className="buyer-secondary" href={range + (guide.group === 'kitchen' ? '#commercial-kitchen-equipment' : 'compare/')} onClick={() => onAction('view_range')}>{copy.range}{rangeSuffix} ↗</a></section>;
  const formBlock = <BuyerBriefForm guide={guide} locale={lang} initialCountry={initialCountry} starter={[starter,buyingTarget].filter(Boolean).join('\n\n')} onRemoveStarter={() => {setStarter('');setBuyingTarget('');}} onPrivacy={onPrivacy} onAction={onAction} />;
  return <main id="main-content" className="buyer-page" lang={lang === 'zh' ? 'zh-CN' : lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
    <nav className="buyer-breadcrumbs" aria-label={copy.home}><a href={lang === 'en' ? '/' : `/${lang === 'zh' ? 'zh-cn' : lang}/`}>{copy.home}</a><span aria-hidden="true">/</span><a href={range}>{copy[guide.group]}{rangeSuffix}</a><span aria-hidden="true">/</span><span aria-current="page">{page.card}</span></nav>
    <section className={'buyer-hero'+(isProject?' restaurant-project-hero':'')}><div><p className="buyer-eyebrow">{page.eyebrow}</p><h1>{page.heading}</h1><p className="buyer-lead">{page.intro}</p>{tasks?<KitchenGuideTasks tasks={tasks} onAction={onAction} label={flow?.nav}/>: <div className="buyer-actions"><a className="buyer-button" href={isDealer ? '#dealer-starter-plans' : '#buyer-brief'} onClick={() => onAction('start_brief')}>{isDealer ? dealerStarterCopy[lang][7] : isProject ? (lang === 'es' ? 'Cotizar mi lista de equipos' : 'Quote my equipment list') : guide.id==='private-label'?page.factoryQuote:copy.open}<span aria-hidden="true">→</span></a><a className="buyer-secondary" href={isProject ? '#project-takeaway' : range} onClick={() => onAction('view_range')}>{isProject ? (lang === 'es' ? 'Elegir equipos según mi menú' : 'Choose equipment for my menu') : copy.range + rangeSuffix} ↗</a></div>}</div>{isProject?<RestaurantProjectHero locale={lang}/>:<figure><img src={guide.image} alt={copy[guide.group]} width="900" height="675" fetchPriority="high" /></figure>}</section>
    {isProject&&<RestaurantProjectSelection locale={lang} onAction={onAction}/>}
    {isDealer&&<DealerStarterPlans locale={lang} onSelect={useStarter}/>}
    <StartupBuyingContent kind={guide.id} locale={lang} compact={isProject} />
    {guide.id==='private-label'&&<PrivateLabelScope locale={lang} onAction={onAction}/>}
    <section className="buyer-steps"><h2>{copy.stepsTitle}</h2><div>{page.steps.map(([title, body], index) => <article key={title}><span className="buyer-step-number" aria-hidden="true">{new Intl.NumberFormat(lang).format(index + 1).padStart(2, lang === 'ar' ? '٠' : '0')}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section>
    <div className={tasks ? 'buyer-content-columns buyer-content-form-first' : 'buyer-content-columns'}>
      {tasks ? <>{formBlock}{faqBlock}</> : <>{faqBlock}{formBlock}</>}
    </div>
    {isDealer && lang==='zh' && <ChineseDealerPricePlanning modelQuery={modelQuery} onAction={onAction}/>}
    {guide.id==='restaurant-projects' && lang==='zh' && <div className="ddnz-kitchen kitchen-brand">
      <GulfKitchenPlanning locale="zh" equipmentHref={localizedProductPath(KITCHEN_PATH, 'zh') + '#commercial-kitchen-equipment'} requestHref="#buyer-brief"/>
    </div>}
    {isDealer && lang==='en' && <DealerPricePlanning modelQuery={modelQuery} onApply={useBuyingTarget}/>}
    {isProject && lang==='en' && <>
      <section className="buyer-project-evidence" id="kitchen-production-reference">
        <div><h2>Kitchen equipment production reference</h2>
          <p>See the equipment and assembly details reviewed on the production floor. Share your equipment list so we can agree on configuration and inspection points for your order.</p></div>
        <video controls playsInline preload="none" poster="/commercial-kitchen-media/factory.webp" aria-label="Kitchen equipment production reference">
          <source src="/commercial-kitchen-media/production.mp4" type="video/mp4"/>
        </video>
      </section>
      <div className="ddnz-kitchen kitchen-brand">
        <GulfKitchenPlanning equipmentHref={KITCHEN_PATH+'#commercial-kitchen-equipment'} requestHref="#buyer-brief" showEvidence={false}/>
      </div>
      <p><a href={'/blog/'+kitchenReading[1].slug+'/'}>Check refrigeration for Gulf kitchens ↗</a></p>
      <aside lang="id"><a href="/id/blog/desain-dapur-restoran-pengadaan-peralatan-china/">Merencanakan restoran di Indonesia? ↗</a></aside>
    </>}
    <BuyerGuideLinks group={guide.group} locale={lang} exclude={guide.id} />
  </main>;
}
