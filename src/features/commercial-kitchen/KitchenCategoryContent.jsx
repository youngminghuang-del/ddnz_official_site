import React from 'react';
import { categoryProducts, kitchenCategories, kitchenModelHref } from './data/categories.mjs';
import { KITCHEN_PATH } from './data/discovery.mjs';

const currency = value => new Intl.NumberFormat('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

export default function KitchenCategoryContent({ category, homeHref = '/', onTrack = (_action) => {} }) {
  const products = categoryProducts(category);
  const hero = products.find(p => p.id === category.heroId);
  return <main id="main-content" className="ddnz-kitchen kitchen-category" lang="en" dir="ltr" onClick={event => {
    const action = event.target.closest?.('[data-category-action]')?.dataset.categoryAction;
    if (action) onTrack(action);
  }}>
    <a className="skip" href="#category-models">Skip to models</a>
    <nav className="kitchen-breadcrumb wrap" aria-label="Breadcrumb"><ol><li><a href={homeHref}>Home</a></li><li><a href="/products/">Products</a></li><li><a href={KITCHEN_PATH}>Commercial kitchen</a></li><li aria-current="page">{category.label}</li></ol></nav>
    <section className="category-hero wrap">
      <div><p className="eyebrow">CHINA SOURCING · FOR IMPORTERS &amp; DISTRIBUTORS</p><h1>{category.heading}<br/><em>{category.emphasis}</em></h1><p className="hero-description">{category.intro}</p><div className="actions"><a className="button primary" href="#category-models" data-category-action="compare_models">Compare the models <span aria-hidden="true">↓</span></a><a className="text-link" href="#category-buying">What to check before buying <span aria-hidden="true">→</span></a></div><p className="category-market-note">Sourcing for the UAE, Singapore, Mexico and other destinations.</p></div>
      <figure className="category-hero-photo"><img src={hero.image} srcSet={`${hero.imageSmall} 600w, ${hero.image} 1200w`} sizes="(max-width: 760px) calc(100vw - 36px), 46vw" alt={`${hero.model} ${hero.name}`} width="1200" height="900" fetchPriority="high"/><figcaption><strong>{category.statistic}</strong><span>{category.statisticLabel}</span></figcaption></figure>
    </section>
    <nav className="category-navigation wrap" aria-label="Commercial kitchen categories">{kitchenCategories.map(item => <a key={item.id} href={item.path} aria-current={item.id === category.id ? 'page' : undefined}>{item.label}</a>)}<a href="/refrigeration-equipment/">Refrigeration</a><a href={KITCHEN_PATH}>All equipment <span aria-hidden="true">↗</span></a></nav>
    <section id="category-models" className="section wrap"><div className="section-heading"><div><p className="eyebrow">COMPARE THE RANGE</p><h2>{category.comparisonTitle}</h2></div><p>{category.comparisonCopy}</p></div>
      <div className="category-model-grid">{products.map(p => <article id={`model-${p.id}`} className="category-model" key={p.id}>
        <div className="category-model-photo"><img src={p.image} srcSet={`${p.imageSmall} 600w, ${p.image} 1200w`} sizes="(max-width: 760px) calc(100vw - 36px), (min-width: 1200px) 40vw, 46vw" alt={`${p.model} ${p.name}`} width="1200" height="900" loading="lazy"/></div>
        <div className="category-model-copy"><p className="model">{p.model}</p><h3>{p.name}</h3><strong className="category-model-metric">{p.metric}</strong><dl>{category.comparisonKeys.filter(key => p.specs[key]).map(key => <div key={key}><dt>{key}</dt><dd>{p.specs[key]}</dd></div>)}<div><dt>Overall dimensions</dt><dd>{p.dimensions}</dd></div></dl>
          <div className="category-price">{p.quote ? <><span>Indicative supply price</span><strong>CNY {currency(p.quote.price)} <small>/ unit</small></strong><span>Reference quantity: {p.quote.minUnits} {p.quote.minUnits === 1 ? 'unit' : 'units'}</span></> : <><span>Wholesale pricing</span><strong>Request a quote</strong><span>For your quantity and destination</span></>}</div>
          <a className="button primary" href={kitchenModelHref(p.id)} data-category-action="select_model">Plan an order for {p.model} <span aria-hidden="true">→</span></a>
          {p.imageNote && <p className="fine">{p.imageNote}</p>}
          {p.quote?.configurationNote && <p className="fine">{p.quote.configurationNote}</p>}
        </div>
      </article>)}</div>
      <p className="fine category-price-note">Product images are retouched. Prices are indicative for the stated reference quantities. Freight and taxes are extra. Final price, availability and electrical configuration are confirmed with your quotation.{category.id === 'ice-machines' && ' Ice output figures are rated values; test conditions and bin capacity will be confirmed.'}</p>
    </section>
    <section id="category-buying" className="section wrap category-buying"><p className="eyebrow">BEFORE YOU BUY</p><h2>{category.buyingTitle}</h2><div className="category-buying-grid">{category.buying.map((item, i) => <article key={item.title}><span className="category-step">0{i + 1}</span><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div></section>
    <section className="category-brief-band"><div className="wrap category-brief-layout"><div><p className="eyebrow">BUILD A COMPARABLE QUOTE</p><h2>Bring the right details<br/>to your next order.</h2><p>Choose a model above to open the shared equipment planner. Set the quantity and destination, add your target price or selling price, and review your sourcing brief.</p><a className="button primary" href={kitchenModelHref(hero.id)} data-category-action="start_brief">Start with {hero.model} <span aria-hidden="true">→</span></a><p className="fine">Voltage, frequency, phase and plug follow the selected model and destination during quotation.</p></div><div><h3>Include in your request</h3><ul>{category.quoteChecks.map(item => <li key={item}>{item}</li>)}</ul><a className="text-link" href={`${KITCHEN_PATH}#commercial-kitchen-benchmarks`} data-category-action="price_context">Compare local prices and plan your margin <span aria-hidden="true">→</span></a></div></div></section>
    <section className="section wrap faq"><div><p className="eyebrow">BUYING QUESTIONS</p><h2>Before you decide.</h2></div><div>{category.faqs.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></section>
    <section className="wrap category-reading"><p className="eyebrow">CONTINUE YOUR RESEARCH</p><div>{category.reading.map(item => <a key={item.slug} href={`/blog/${item.slug}/`} data-category-action="read_guide"><h3>{item.title} <span aria-hidden="true">↗</span></h3><p>{item.copy}</p></a>)}<a href={KITCHEN_PATH} data-category-action="browse_range"><h3>Build a wider equipment range <span aria-hidden="true">↗</span></h3><p>Combine cooking, cold storage and beverage equipment in one sourcing list.</p></a></div></section>
  </main>;
}
