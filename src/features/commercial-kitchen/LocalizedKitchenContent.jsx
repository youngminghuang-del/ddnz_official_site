import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  KITCHEN_LIST_STORAGE_KEY, addKitchenSelection, buildLocalizedKitchenInquiry, cleanKitchenSelection,
  filterKitchenProducts, getLocalizedKitchenAssortments, getLocalizedKitchenBenchmarks, getLocalizedKitchenProducts,
  kitchenCopy, kitchenReferenceStatus, localMoney, localNumber, parseKitchenQuantity, toggleKitchenComparison,
  validateLocalizedKitchenInquiry,
} from './data/localization.mjs';
import { buildDraftLinks, createInquirySubmitter, currentHostname, isProductionHost } from './data/inquiry.mjs';
import LocalizedKitchenMargin from './components/LocalizedKitchenMargin.jsx';
import { IsolatedText } from './components/LocalizedKitchenText.jsx';

// No Router, context or stylesheet dependency: this tree also supplies the static HTML body.
// Optional initial state is useful for isolated rendering; the browser restores the shared list after hydration.
export default function LocalizedKitchenContent({ locale, initialList = {}, initialCompared = [], initialForm = {}, onAction = (_action, _detail = undefined) => {} }) {
  const t = kitchenCopy(locale), u = t.ui;
  const products = useMemo(() => getLocalizedKitchenProducts(locale), [locale]);
  const assortments = useMemo(() => getLocalizedKitchenAssortments(locale), [locale]);
  const benchmarks = useMemo(() => getLocalizedKitchenBenchmarks(locale), [locale]);
  const [category, setCategory] = useState(''), [search, setSearch] = useState('');
  const [list, setList] = useState(() => cleanKitchenSelection(initialList));
  const [compared, setCompared] = useState(() => [...new Set(initialCompared)].filter(id => products.some(product => product.id === id)).slice(0, 3));
  const [quantityDrafts, setQuantityDrafts] = useState({}), [quantityErrors, setQuantityErrors] = useState({});
  const [form, setForm] = useState({ country: locale === 'ar' ? 'United Arab Emirates' : 'Mexico', otherCountry: '', type: 'importer', port: '', company: '', contact: '', notes: '', ...initialForm });
  const [contact, setContact] = useState({ name: '', email: '' }), [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(''), [storageWarning, setStorageWarning] = useState(false), [restored, setRestored] = useState(false);
  // Published SSR starts with visitor-facing submission copy; the actual transport always checks its hostname.
  const [production, setProduction] = useState(true), [pending, setPending] = useState(false);
  const [submission, setSubmission] = useState({ status: 'idle', fingerprint: '', message: '' });
  const submitter = useRef(null);
  if (!submitter.current) submitter.current = createInquirySubmitter();
  const actualForm = { ...form, country: form.country === 'other' ? form.otherCountry : form.country };
  const payload = useMemo(() => buildLocalizedKitchenInquiry(locale, { list, form: actualForm, ...contact }), [locale, list, form, contact]);
  const fingerprint = JSON.stringify(payload);
  const status = submission.fingerprint === fingerprint ? submission.status : 'idle';
  const links = buildDraftLinks(payload);
  const selected = products.filter(product => list[product.id]);
  const comparedProducts = products.filter(product => compared.includes(product.id));
  const count = Object.values(list).reduce((sum, units) => sum + units, 0);
  const filtered = filterKitchenProducts(products, { category, search });
  const invalidQuantities = Object.values(quantityErrors).some(Boolean);
  const draftsAvailable = selected.length > 0 && !invalidQuantities && actualForm.country.trim().length > 0;

  useEffect(() => {
    setProduction(isProductionHost(currentHostname()));
    try {
      const saved = window.localStorage.getItem(KITCHEN_LIST_STORAGE_KEY);
      if (saved !== null) setList(cleanKitchenSelection(JSON.parse(saved)));
    } catch { setStorageWarning(true); }
    setRestored(true);
    const id = new URLSearchParams(window.location.search).get('model');
    const product = products.find(item => item.id === id);
    if (product) { setSearch(product.model); onAction('model_entry'); }
  }, []);
  useEffect(() => {
    if (!restored) return;
    try { window.localStorage.setItem(KITCHEN_LIST_STORAGE_KEY, JSON.stringify(list)); }
    catch { setStorageWarning(true); }
  }, [list, restored]);

  function add(selection, message = u.added, action = 'add_to_list') {
    setList(previous => addKitchenSelection(previous, selection));
    for (const id of Object.keys(selection)) {
      setQuantityDrafts(previous => { const next = { ...previous }; delete next[id]; return next; });
      setQuantityErrors(previous => { const next = { ...previous }; delete next[id]; return next; });
    }
    setErrors(previous => ({ ...previous, list: undefined }));
    setNotice(message);
    onAction(action);
  }
  function remove(id) {
    setList(previous => { const next = { ...previous }; delete next[id]; return next; });
    setQuantityDrafts(previous => { const next = { ...previous }; delete next[id]; return next; });
    setQuantityErrors(previous => { const next = { ...previous }; delete next[id]; return next; });
  }
  function updateQuantity(id, value) {
    setQuantityDrafts(previous => ({ ...previous, [id]: value }));
    const units = parseKitchenQuantity(value);
    setQuantityErrors(previous => ({ ...previous, [id]: units === null }));
    if (units !== null) setList(previous => ({ ...previous, [id]: units }));
    setSubmission({ status: 'idle', fingerprint: '', message: '' });
  }
  function toggleCompare(id) {
    const next = toggleKitchenComparison(compared, id);
    setCompared(next.ids);
    if (next.limited) setNotice(u.compareLimit);
    else onAction('compare_models');
  }
  function updateForm(field, value) {
    setForm(previous => ({ ...previous, [field]: value }));
    if (field === 'country' || field === 'otherCountry') setErrors(previous => ({ ...previous, country: undefined }));
  }
  function updateContact(field, value) {
    setContact(previous => ({ ...previous, [field]: value }));
    setErrors(previous => ({ ...previous, [field]: undefined }));
  }
  async function sendInquiry(event) {
    event.preventDefault();
    if (submitter.current.pending || status === 'success' || status === 'preview') return;
    const nextErrors = validateLocalizedKitchenInquiry(locale, { ...contact, list, form: actualForm });
    if (invalidQuantities) nextErrors.list = u.quantityError;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const first = invalidQuantities ? `quantity-${Object.keys(quantityErrors).find(id => quantityErrors[id])}` : nextErrors.list ? 'commercial-kitchen-equipment' : nextErrors.country ? (form.country === 'other' ? 'kitchen-other-country' : 'kitchen-country') : nextErrors.name ? 'kitchen-name' : 'kitchen-email';
      document.getElementById(first)?.focus();
      return;
    }
    setPending(true);
    try {
      const result = await submitter.current.submit(payload, { hostname: currentHostname() });
      if (result.mode === 'blocked') return;
      setSubmission({ fingerprint, status: result.mode === 'preview' ? 'preview' : 'success', message: result.mode === 'preview' ? u.previewSuccess : u.success });
      if (result.mode === 'production') onAction('submit_success', { mode: 'production', productCount: selected.length, unitCount: count });
    } catch {
      setSubmission({ fingerprint, status: 'error', message: u.sendError });
      if (isProductionHost(currentHostname())) onAction('submit_error', { mode: 'production', productCount: selected.length, unitCount: count });
    } finally { setPending(false); }
  }
  const fieldError = (field, id) => errors[field] ? <small className="localized-error" id={id} role="alert">{errors[field]}</small> : null;
  return <section className="ddnz-kitchen localized-kitchen" lang={locale} dir={t.dir} aria-label={u.pageLabel} onClick={event => {
    const href = event.target.closest?.('a')?.getAttribute('href');
    if (href === '#commercial-kitchen-list') onAction('start_brief');
    if (href === '#commercial-kitchen-margin') onAction('plan_margin');
  }}>
    <a className="skip" href="#commercial-kitchen-equipment">{u.skip}</a>
    <nav className="kitchen-subnav" aria-label={u.sections}>
      <a href="#commercial-kitchen-equipment">{u.equipment}</a><a href="#commercial-kitchen-compare">{u.compare}</a>
      <a href="#commercial-kitchen-assortments">{u.assortments}</a><a href="#commercial-kitchen-benchmarks">{u.prices}</a>
      <a href="#commercial-kitchen-margin">{t.margin.nav}</a>
      <a href="#commercial-kitchen-guide">{u.guide}</a><a className="kitchen-subnav-list" href="#commercial-kitchen-list">{u.list} <bdi dir="ltr">{localNumber(count, locale)}</bdi></a>
    </nav>
    <main id="commercial-kitchen-top">
      <nav className="kitchen-breadcrumb wrap" aria-label={u.breadcrumb}><ol><li><a href={`/${locale}/`}>{u.home}</a></li><li aria-current="page">{u.pageLabel}</li></ol></nav>
      <section className="hero wrap">
        <div className="hero-copy"><p className="eyebrow">{u.audience}</p><h1>{u.heading}<br/><em>{u.emphasis}</em></h1><p className="hero-description"><IsolatedText>{u.intro}</IsolatedText></p><div className="actions"><a className="button primary" href="#commercial-kitchen-equipment">{u.explore}<Arrow locale={locale}/></a><a className="text-link" href="#commercial-kitchen-list">{u.startList}<Arrow locale={locale}/></a></div><div className="markets">{Object.values(t.countries).map(country => <span key={country}>{country}</span>)}</div></div>
        <div className="hero-visual"><img src="/commercial-kitchen-media/kitchen-hero.webp" alt={u.heroAlt} fetchPriority="high" width="1200" height="900"/><div className="image-caption">{u.heroCaption}</div><div className="hero-label"><strong>{u.heroLabel}</strong><a href="#commercial-kitchen-list">{u.startList}<Arrow locale={locale}/></a></div></div>
      </section>
      <section className="section wrap" id="commercial-kitchen-equipment" tabIndex={-1} aria-labelledby="localized-catalog-title">
        <div className="section-heading"><div><p className="eyebrow">{u.equipment}</p><h2 id="localized-catalog-title">{u.catalogTitle}</h2></div><p>{u.catalogHelp}</p></div>
        <div className="catalog-tools"><label className="localized-search">{u.search}<input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder={u.searchPlaceholder}/></label><div className="filters" aria-label={u.equipment}><button type="button" className={!category ? 'active' : ''} aria-pressed={!category} onClick={() => setCategory('')}>{u.all}</button>{Object.entries(t.categories).map(([key, label]) => <button type="button" key={key} className={category === key ? 'active' : ''} aria-pressed={category === key} onClick={() => setCategory(key)}>{label}</button>)}</div></div>
        <p className="catalog-meta" role="status">{u.results}: <bdi dir="ltr">{localNumber(filtered.length, locale)}</bdi></p>
        <div className="product-grid">{filtered.map(product => <article className="product localized-product" id={`model-${product.id}`} key={product.id} data-product-id={product.id}>
          <img className="localized-product-photo" src={product.image} srcSet={product.imageSmall ? `${product.imageSmall} 600w, ${product.image} 1200w` : undefined} sizes="(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 25vw" width="1200" height="900" alt={`${product.name} — ${product.displayModel}`} loading="lazy"/>
          <div className="localized-card-body"><p className="eyebrow">{product.categoryLabel}</p><h3>{product.name}</h3><p className="localized-model">{u.model}: <IsolatedText>{product.displayModel}</IsolatedText></p><p className="localized-metric"><IsolatedText>{product.metric}</IsolatedText></p><p className="fine"><IsolatedText>{product.detail}</IsolatedText></p>
            <KitchenPrice product={product} locale={locale}/>
            <details className="localized-specs"><summary>{u.details}</summary><dl><dt>{u.model}</dt><dd><IsolatedText>{product.displayModel}</IsolatedText>{product.model.includes('variant') && <small>{u.variant}</small>}</dd><dt>{u.dimensions}</dt><dd><IsolatedText>{product.dimensions}</IsolatedText></dd>{product.localizedSpecs.map(spec => <React.Fragment key={spec.key}><dt>{spec.label}</dt><dd><IsolatedText>{spec.value}</IsolatedText></dd></React.Fragment>)}</dl><p className="fine"><IsolatedText>{product.note}</IsolatedText></p><p className="fine"><IsolatedText>{product.imageNote}</IsolatedText></p></details>
            <div className="localized-card-actions"><label className="localized-compare-check"><input type="checkbox" checked={compared.includes(product.id)} onChange={() => toggleCompare(product.id)} aria-label={`${u.compare}: ${product.displayModel}`}/>{u.compare}</label><button className="button outline" type="button" onClick={() => add({ [product.id]: 1 })} aria-label={`${u.add}: ${product.displayModel}`}>{u.add}</button></div>
          </div>
        </article>)}</div>
        {!filtered.length && <div className="localized-empty"><p>{u.noResults}</p><button type="button" className="button outline" onClick={() => { setSearch(''); setCategory(''); }}>{u.reset}</button></div>}
        <p className="localized-notice" role="status" aria-live="polite"><IsolatedText>{notice}</IsolatedText></p>
      </section>
      <section className="section wrap localized-comparison" id="commercial-kitchen-compare" aria-labelledby="localized-compare-title"><h2 id="localized-compare-title">{u.compareTitle}</h2><p>{u.compareHelp}</p>
        {!comparedProducts.length ? <p className="localized-empty">{u.compareEmpty}</p> : <><div className="localized-table-scroll" role="region" aria-label={u.compareTitle} tabIndex={0}><table className="compare-table"><caption>{u.compareTitle}</caption><thead><tr><th scope="col">{u.model}</th>{comparedProducts.map(product => <th scope="col" key={product.id}><IsolatedText>{product.displayModel}</IsolatedText><p>{product.name}</p><button className="text-link" type="button" onClick={() => toggleCompare(product.id)} aria-label={`${u.removeCompare}: ${product.displayModel}`}>{u.removeCompare}</button></th>)}</tr></thead><tbody>
          <tr><th scope="row">{u.metric}</th>{comparedProducts.map(product => <td key={product.id}><IsolatedText>{product.metric}</IsolatedText></td>)}</tr>
          <tr><th scope="row">{u.dimensions}</th>{comparedProducts.map(product => <td key={product.id}><IsolatedText>{product.dimensions}</IsolatedText></td>)}</tr>
          <tr><th scope="row">{u.details}</th>{comparedProducts.map(product => <td key={product.id}><dl>{product.localizedSpecs.map(spec => <React.Fragment key={spec.key}><dt>{spec.label}</dt><dd><IsolatedText>{spec.value}</IsolatedText></dd></React.Fragment>)}</dl></td>)}</tr>
          <tr><th scope="row">{u.price}</th>{comparedProducts.map(product => <td key={product.id}><KitchenPrice product={product} locale={locale}/><button type="button" className="button outline" onClick={() => add({ [product.id]: 1 })}>{u.add}</button></td>)}</tr>
        </tbody></table></div><button className="text-link" type="button" onClick={() => setCompared([])}>{u.clearCompare}</button></>}
        <p className="fine">{u.electricity}</p>
      </section>
      <section className="section wrap" id="commercial-kitchen-assortments" aria-labelledby="localized-assortment-title"><h2 id="localized-assortment-title">{u.assortmentTitle}</h2><p>{u.assortmentHelp}</p><div className="localized-two-columns">{assortments.map(assortment => <article className="localized-panel" key={assortment.name}><h3>{assortment.name}</h3><p>{assortment.description}</p><ul>{assortment.items.map(item => <li key={item.productId}><IsolatedText>{products.find(product => product.id === item.productId).displayModel}</IsolatedText> × <bdi dir="ltr">{localNumber(item.defaultQty, locale)}</bdi> {u.units}</li>)}</ul><button type="button" className="button primary" onClick={() => add(assortment.selection, u.assortmentAdded, 'add_assortment')}>{u.addAssortment}</button></article>)}</div></section>
      <section className="section wrap" id="commercial-kitchen-benchmarks" aria-labelledby="localized-prices-title"><p className="eyebrow">{u.prices}</p><h2 id="localized-prices-title">{u.marketTitle}</h2><div className="localized-price-explanation" id="commercial-kitchen-trade-pricing"><p><IsolatedText>{u.priceScope}</IsolatedText></p><p>{u.priceCosts}</p><p><IsolatedText>{u.marketHelp}</IsolatedText></p></div>
        {Object.entries(t.markets).map(([country, market]) => <section className="localized-market" key={country} aria-label={t.countries[country]}><h3>{market.title}</h3><p>{market.description}</p><p className="fine"><IsolatedText>{market.note}</IsolatedText></p><div className="localized-two-columns">{benchmarks.filter(reference => reference.country === country).map(reference => <article className="localized-panel" key={reference.id}><p className="eyebrow">{reference.countryLabel} · <bdi dir="ltr">{reference.site}</bdi></p><h4><IsolatedText>{reference.name}</IsolatedText></h4><p className="fine">{u.linkedModel}: <IsolatedText>{products.find(product => product.id === reference.productId).displayModel}</IsolatedText></p><p>{u.observed}: <strong><bdi dir="ltr">{localMoney(reference.price, reference.currency, locale)}</bdi></strong></p><p><IsolatedText>{reference.spec}</IsolatedText></p><p>{reference.match}</p><p><IsolatedText>{reference.difference}</IsolatedText></p><p className="fine"><IsolatedText>{reference.context}</IsolatedText></p><p className="fine">{u.captured}: <time dateTime={reference.date}><bdi dir="ltr">{reference.date}</bdi></time>. {reference.capture}</p><a className="text-link" href={reference.url} target="_blank" rel="noopener noreferrer">{u.source}<span aria-hidden="true">↗</span></a></article>)}</div></section>)}
      </section>
      <LocalizedKitchenMargin locale={locale} onAction={onAction} onUseQuantity={(id, units) => {
        setList(previous => ({ ...previous, [id]: units }));
        setQuantityDrafts(previous => { const next = { ...previous }; delete next[id]; return next; });
        setQuantityErrors(previous => { const next = { ...previous }; delete next[id]; return next; });
        setErrors(previous => ({ ...previous, list: undefined }));
        setNotice(t.margin.used);
        onAction('add_to_list');
        document.getElementById('commercial-kitchen-list')?.scrollIntoView({ behavior: 'auto' });
      }}/>
      <section className="section wrap" id="commercial-kitchen-guide" aria-labelledby="localized-guide-title"><h2 id="localized-guide-title">{u.guideTitle}</h2><div className="localized-two-columns">{t.guides.map(item => <article className="localized-panel" key={item.title}><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div><p className="localized-price-explanation">{u.electricity}</p></section>
      <section className="section wrap" id="commercial-kitchen-list" aria-labelledby="localized-list-title"><h2 id="localized-list-title">{u.listTitle}</h2><p>{u.listHelp}</p><p>{u.modelCount}: <bdi dir="ltr">{localNumber(selected.length, locale)}</bdi> · {u.unitCount}: <bdi dir="ltr">{localNumber(count, locale)}</bdi></p>
        {storageWarning && <p className="fine" role="status">{u.storageUnavailable}</p>}
        {!selected.length ? <div className="localized-empty"><p>{u.emptyList}</p><a className="button outline" href="#commercial-kitchen-equipment">{u.explore}</a></div> : <><p className="fine" id="kitchen-quantity-help"><IsolatedText>{u.quantityHelp}</IsolatedText></p><div className="localized-selected-list">{selected.map(product => <article className="localized-selected-row" key={product.id} data-selected-id={product.id}><img src={product.imageSmall || product.image} alt={product.name} width="120" height="90" loading="lazy"/><div><h3><IsolatedText>{product.displayModel}</IsolatedText></h3><p>{product.name}</p><p className="fine">{product.quote ? kitchenReferenceStatus(product, list[product.id]) === 'below' ? u.belowTier : u.atTier : u.pendingHelp}</p></div><label htmlFor={`quantity-${product.id}`}>{u.quantity}<input id={`quantity-${product.id}`} inputMode="numeric" dir="ltr" value={quantityDrafts[product.id] ?? localNumber(list[product.id], locale, { useGrouping: false })} onChange={event => updateQuantity(product.id, event.target.value)} aria-label={`${u.quantity}: ${product.displayModel}`} aria-invalid={Boolean(quantityErrors[product.id])} aria-describedby={`kitchen-quantity-help${quantityErrors[product.id] ? ` quantity-error-${product.id}` : ''}`}/>{quantityErrors[product.id] && <small id={`quantity-error-${product.id}`} className="localized-error" role="alert">{u.quantityError}</small>}</label><button type="button" className="text-link" aria-label={`${u.remove}: ${product.displayModel}`} onClick={() => remove(product.id)}>{u.remove}</button></article>)}</div><button className="text-link" type="button" onClick={() => { setList({}); setQuantityDrafts({}); setQuantityErrors({}); }}>{u.clearList}</button></>}
        {fieldError('list', 'kitchen-list-error')}
        <form className="localized-inquiry" onSubmit={sendInquiry} noValidate aria-label={u.review}>
          <div className="localized-two-columns"><label htmlFor="kitchen-country">{u.country}<select id="kitchen-country" value={form.country} onChange={event => updateForm('country', event.target.value)} required aria-invalid={Boolean(errors.country)} aria-describedby={errors.country ? 'kitchen-country-error' : undefined}><option value="">{u.chooseCountry}</option>{Object.entries(t.countries).map(([key, label]) => <option key={key} value={key}>{label}</option>)}<option value="other">{u.otherCountry}</option></select>{fieldError('country', 'kitchen-country-error')}</label>
            {form.country === 'other' && <label htmlFor="kitchen-other-country">{u.destinationDetail}<input id="kitchen-other-country" value={form.otherCountry} maxLength={80} dir="auto" onChange={event => updateForm('otherCountry', event.target.value)} required aria-invalid={Boolean(errors.country)} aria-describedby={errors.country ? 'kitchen-country-error' : undefined}/></label>}
            <label>{u.port}<input value={form.port} maxLength={100} dir="auto" onChange={event => updateForm('port', event.target.value)}/></label><label>{u.buyerType}<select value={form.type} onChange={event => updateForm('type', event.target.value)}>{Object.entries(t.buyerTypes).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><label>{u.company}<input value={form.company} maxLength={140} autoComplete="organization" dir="auto" onChange={event => updateForm('company', event.target.value)}/></label><label>{u.contact}<input value={form.contact} maxLength={160} dir="auto" onChange={event => updateForm('contact', event.target.value)}/></label>
          </div><label>{u.notes}<textarea value={form.notes} rows={4} maxLength={420} dir="auto" onChange={event => updateForm('notes', event.target.value)} aria-describedby="kitchen-notes-help"/></label><p className="fine" id="kitchen-notes-help">{u.notesHelp}</p>
          <div className="localized-two-columns"><label htmlFor="kitchen-name">{u.name}<input id="kitchen-name" value={contact.name} maxLength={100} autoComplete="name" dir="auto" required onChange={event => updateContact('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'kitchen-name-error' : undefined}/>{fieldError('name', 'kitchen-name-error')}</label><label htmlFor="kitchen-email">{u.email}<input id="kitchen-email" type="email" value={contact.email} maxLength={254} autoComplete="email" dir="ltr" required onChange={event => updateContact('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'kitchen-email-error' : undefined}/>{fieldError('email', 'kitchen-email-error')}</label></div>
          <details className="localized-request-review" open><summary>{u.review}</summary><p>{u.reviewHelp}</p>{invalidQuantities ? <p className="localized-error" role="alert">{u.quantityError}</p> : <pre><IsolatedText>{payload.message}</IsolatedText></pre>}</details>
          <details className="localized-privacy"><summary>{u.privacyTitle}</summary><p>{u.privacy}</p></details>
          <button className="button primary" type="submit" disabled={pending || status === 'success' || status === 'preview'}>{pending ? u.sending : status === 'success' ? u.sent : status === 'preview' ? u.simulated : production ? u.send : u.simulate}<Arrow locale={locale}/></button><p className="fine">{production ? u.productionHelp : u.previewHelp}</p>
          {status !== 'idle' && <p className={`localized-status is-${status}`} role={status === 'error' ? 'alert' : 'status'}>{submission.message}</p>}
          {draftsAvailable && <div className="localized-drafts"><p>{u.draftHelp}</p><a className="button outline" href={links.whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => { if (production) onAction('whatsapp_draft', { mode: 'production', productCount: selected.length, unitCount: count }); }}>{u.whatsapp}<span aria-hidden="true">↗</span></a><a className="text-link" href={links.email} onClick={() => { if (production) onAction('email_draft', { mode: 'production', productCount: selected.length, unitCount: count }); }}>{u.emailDraft}<Arrow locale={locale}/></a></div>}
        </form>
      </section>
      <section className="section wrap localized-faq" id="commercial-kitchen-faq" aria-labelledby="localized-faq-title"><h2 id="localized-faq-title">{u.faq}</h2>{t.faqs.map(faq => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>
    </main>
  </section>;
}

export { LocalizedKitchenContent, IsolatedText };

function Arrow({ locale }) { return <span aria-hidden="true">{locale === 'ar' ? '←' : '→'}</span>; }

function KitchenPrice({ product, locale }) {
  const u = kitchenCopy(locale).ui;
  if (!product.quote) return <div className="quote-pending">{u.quotePending}<small>{u.pendingHelp}</small></div>;
  return <div className="supply-price compact" data-reference-cny={product.quote.price} data-reference-units={product.quote.minUnits}><span>{u.price}</span><strong><bdi dir="ltr">{localMoney(product.quote.price, product.quote.currency, locale)}</bdi></strong><small>{u.perUnit} · {u.referenceTier}: <bdi dir="ltr">{localNumber(product.quote.minUnits, locale)}</bdi> {u.units}</small><small><IsolatedText>{u.quoteOnly}</IsolatedText></small>{product.configurationNote && <small className="price-configuration"><IsolatedText>{product.configurationNote}</IsolatedText></small>}</div>;
}
