import { equipmentFilters, legacyHotGroups } from '../src/features/commercial-kitchen/data/catalogueNavigation.mjs';
import {quantityBand} from '../src/features/commercial-kitchen/data/model.mjs';
import { kitchenPurchasePaths, orderSupportPaths } from '../src/features/commercial-kitchen/data/purchase-paths.mjs';
import { kitchenFaq } from '../src/features/commercial-kitchen/data/discovery.mjs';
import { kitchenModelHref } from '../src/features/commercial-kitchen/data/categories.mjs';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Uses the same catalogue as the interactive page, including quotation limits.
export function renderKitchenStaticContent(products, launch, heroMedia = '') {
  const featured = launch.featuredProductIds.map(id => {
    const product = products.find(p => p.id === id);
    if (!product?.quote) throw new Error(`Featured kitchen price missing: ${id}`);
    return product;
  });
  return `<main class="mx-auto max-w-5xl px-4 py-16 sm:px-6" data-static-fallback="commercial-kitchen" lang="en" dir="ltr" id="commercial-kitchen-top">
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/products/">Products</a> / <span aria-current="page">Commercial kitchen equipment</span></nav>
    ${heroMedia?'<section class="catalogue-hero"><div>':''}<p>DDNZ / MANUFACTURING &amp; EXPORT</p>
    <h1>Commercial kitchen equipment. Wholesale from China.</h1>
    <p>DDNZ is a China-based manufacturer and exporter. Our commercial kitchen range includes equipment from specialist manufacturers. Compare ${products.length} models and request a quote by model, configuration, quantity and destination.</p>
    <nav class="kitchen-purchase-paths kitchen-purchase-illustrated" aria-label="Choose your purchasing task">${kitchenPurchasePaths.map(item=>`<a href="${escape(item.href)}"><img src="${escape(item.image)}" alt="" width="64" height="48" decoding="async"><div><strong>${escape(item.label)}</strong><span>${escape(item.description)}</span></div><span aria-hidden="true">→</span></a>`).join('')}</nav>
    <p>Serving buyers sourcing for the UAE, Singapore and Mexico.</p>${heroMedia?'</div>'+heroMedia+'</section>':''}
    <h2 id="commercial-kitchen-equipment">Compare commercial kitchen equipment</h2><p>${products.length} models. Eight with indicative reference prices.</p>
    <span id="kitchen-induction-range"></span><span id="coffee-machine-catalogue"></span>
    ${Object.keys(legacyHotGroups).map(id=>`<span id="${id}"></span>`).join('')}
    <nav aria-label="Equipment ranges">${equipmentFilters.flatMap(item=>item.links).map(item=>`<a href="${item.path}">${escape(item.label)} ↗</a>`).join(' · ')}</nav>
    <div>${[...featured, ...products.filter(p => !launch.featuredProductIds.includes(p.id))].map((p,index) => `${index===8?'<details class="catalog-rest"><summary>View all models</summary>':''}<article id="model-${escape(p.id)}">${p.handbookGroup?`<span id="catalog-${escape(p.id)}"></span>`: ''}<img src="${escape(p.image)}" alt="${escape(p.model + ' ' + p.name)}" width="420" height="290" loading="lazy" />
      <h3>${escape(p.model)} — ${escape(p.name)}</h3><p>${escape(p.metric)} · ${escape(p.dimensions)}</p>
      <dl>${Object.entries(p.specs).map(([key, value]) => `<dt>${escape(key)}</dt><dd>${escape(value)}</dd>`).join('')}</dl>
      ${p.quote?.tiers ? `<p>Indicative supply price per unit · MOQ ${p.quote.minUnits} unit</p><ul>${p.quote.tiers.map((tier,index)=>`<li>${quantityBand(p.quote.tiers,index)} units: CNY ${tier.price.toFixed(2)}</li>`).join('')}</ul>` : `<p>${p.quote ? `Indicative supply price: CNY ${Number(p.quote.price).toFixed(2)} / unit. Reference order quantity: ${Number(p.quote.minUnits)} units.` : 'Request a quote for your quantity and destination.'}</p>`}
      ${p.otherPowers ? `<p>Other power options: ${p.otherPowers.map(w=>`${w} W`).join(', ')}. <a href="/get-a-quote/">Request a separate quote</a>.</p>` : ''}
      ${p.quote?.configurationNote ? `<p>${escape(p.quote.configurationNote)}</p>` : ''}<p><a href="${escape(kitchenModelHref(p.id))}">Plan an order for ${escape(p.model)}</a></p></article>`).join('')}${products.length>8?'</details>':''}</div>
    <p>Freight and taxes are extra. Final price, minimum quantities and electrical configuration are confirmed with your quotation.</p>
    <h2 id="commercial-kitchen-list">Build your sourcing brief</h2>
    <p><a href="/get-a-quote/?leadGoal=Product%20Sourcing&amp;industry=Commercial%20Kitchen%20Equipment&amp;source=kitchen_catalogue">Request an equipment quotation</a></p>
    <h2 id="commercial-kitchen-guide">Before you order</h2>
    <p>We confirm configuration, packing and shipment options for your models and destination.</p>
    <nav aria-label="Order support" class="kitchen-support-cards">
      ${orderSupportPaths().map(item=>`<a class="kitchen-support-card" id="${escape(item.id)}" href="${escape(item.href)}"><img src="${escape(item.image)}" alt="" width="96" height="76" loading="lazy" decoding="async"><div><strong>${escape(item.label)}</strong><span>${escape(item.description)}</span></div><span aria-hidden="true">↗</span></a>`).join('')}
    </nav>
    <h2>Before you request a quote</h2>
    ${[...kitchenFaq,...launch.faq.slice(0,2)].map(item => `<details><summary>${escape(item.question)}</summary><p>${escape(item.answer)}</p></details>`).join('')}
  </main>`;
}
