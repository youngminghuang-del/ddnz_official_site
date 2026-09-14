import { kitchenJourney, kitchenReading, kitchenFaq } from '../src/features/commercial-kitchen/data/discovery.mjs';
import { kitchenCategories, kitchenModelHref } from '../src/features/commercial-kitchen/data/categories.mjs';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Uses the same catalogue as the interactive page, including quotation limits.
export function renderKitchenStaticContent(products, launch) {
  const featured = launch.featuredProductIds.map(id => {
    const product = products.find(p => p.id === id);
    if (!product?.quote) throw new Error(`Featured kitchen price missing: ${id}`);
    return product;
  });
  return `<main class="mx-auto max-w-5xl px-4 py-16 sm:px-6" data-static-fallback="commercial-kitchen" lang="en" dir="ltr" id="commercial-kitchen-top">
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/products/">Products</a> / <span aria-current="page">Commercial kitchen equipment</span></nav>
    <p>For importers, wholesalers &amp; distributors</p>
    <h1>Commercial kitchen equipment. Sourced in China.</h1>
    <p>Build a wholesale range with 26 equipment models. Compare capacity, indicative supply prices and local retail references, then request a quote for your market.</p>
    <nav aria-label="Plan your equipment order">${kitchenJourney.map(item=>`<a href="${item.href}">${escape(item.title)}</a>`).join(" · ")}</nav>
    <p>Serving buyers sourcing for the UAE, Singapore and Mexico.</p>
    <h2 id="commercial-kitchen-equipment">Compare commercial kitchen equipment</h2><p>26 models. Eight with indicative reference prices.</p>
    <nav aria-label="Equipment buying guides">${kitchenCategories.map(item => `<a href="${item.path}">${escape(item.label)} · Compare models</a>`).join(' · ')} · <a href="/refrigeration-equipment/">Refrigeration selection guide</a></nav>
    <div>${[...featured, ...products.filter(p => !launch.featuredProductIds.includes(p.id))].map(p => `<article><img src="${escape(p.image)}" alt="${escape(p.model + ' ' + p.name)}" width="420" height="290" loading="lazy" />
      <h3>${escape(p.model)} — ${escape(p.name)}</h3><p>${escape(p.metric)} · ${escape(p.dimensions)}</p>
      <dl>${Object.entries(p.specs).map(([key, value]) => `<dt>${escape(key)}</dt><dd>${escape(value)}</dd>`).join('')}</dl>
      <p>${p.quote ? `Indicative supply price: CNY ${Number(p.quote.price).toFixed(2)} / unit. Reference order quantity: ${Number(p.quote.minUnits)} units.` : 'Request a quote for your quantity and destination.'}</p>
      ${p.quote?.configurationNote ? `<p>${escape(p.quote.configurationNote)}</p>` : ''}<p><a href="${escape(kitchenModelHref(p.id))}">Plan an order for ${escape(p.model)}</a></p></article>`).join('')}</div>
    <p>Freight and taxes are extra. Final price, minimum quantities and electrical configuration are confirmed with your quotation.</p>
    <h2 id="commercial-kitchen-benchmarks">Compare prices. Plan your margin.</h2>
    ${launch.markets.map(m => `<section><h3>${escape(m.title)}</h3><p>${escape(m.description)}</p></section>`).join('')}
    <p>Compare dated retail references with indicative supply prices. Use your own selling price and import costs to estimate gross margin. Retail price differences are not net profit.</p>
    <h2 id="commercial-kitchen-assortments">Build a working range</h2>
    ${launch.assortments.map(k => `<h3>${escape(k.name)}</h3><p>${escape(k.description)}</p>`).join('')}
    <h2 id="commercial-kitchen-guide">What to check before you order</h2>
    <p>Select models, quantity and destination. Voltage, frequency, phase and plug are confirmed for the selected equipment during quotation.</p>
    <h2>Before you request a quote</h2>
    ${[...kitchenFaq,...launch.faq.slice(0,2)].map(item => `<details><summary>${escape(item.question)}</summary><p>${escape(item.answer)}</p></details>`).join('')}
    <h2>Buying guides for cold-side equipment</h2>
    ${kitchenReading.map(item=>`<h3><a href="/blog/${escape(item.slug)}/">${escape(item.title)}</a></h3><p>${escape(item.copy)}</p>`).join('')}
    <p><a href="/refrigeration-equipment/">Explore commercial refrigeration sourcing</a></p>
    <h2 id="commercial-kitchen-list">Build your sourcing brief</h2>
    <p><a href="/get-a-quote/?leadGoal=Product%20Sourcing&amp;industry=Commercial%20Kitchen%20Equipment&amp;source=kitchen_catalogue">Request an equipment quotation</a></p>
  </main>`;
}
