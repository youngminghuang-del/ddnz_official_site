import React from 'react';
import products from '../commercial-kitchen/data/products.mjs';
import { kitchenModelHref } from '../commercial-kitchen/data/categories.mjs';

const selections = [
 { id: 'cold-2', displayImage: '/commercial-kitchen-media/project-selection/gn650tnpro-studio.webp', role: 'Chilled holding', check: 'Confirm usable storage, door swing, ambient rating and access for delivery.' },
 { id: 'cold-7', displayImage: '/commercial-kitchen-media/project-selection/gnt2mtnpro-studio.webp', role: 'Cold preparation', check: 'Confirm ingredient separation, worktop use and the offered refrigeration configuration.' },
 { id: 'ZH-101V', displayImage: '/commercial-kitchen-media/ddnz-products/ZH-101V-ddnz-v1.webp', role: 'Frying', check: 'Confirm the food batch, recovery requirement, electrical configuration and quantity terms.' },
 { id: 'ZH-818', displayImage: '/commercial-kitchen-media/ddnz-products/ZH-818-ddnz-v1.webp', role: 'Griddle cooking', check: 'Confirm cooking surface, menu mix, electrical configuration and extraction requirements.' },
].map(selection => ({ ...selection, product: products.find(p => p.id === selection.id) }));

export function RestaurantProjectHero() {
 return <figure className="restaurant-hero-board" aria-label="Four catalogue models for a takeaway equipment selection">
  <figcaption><span>THE TAKEAWAY SELECTION</span><strong>Cold preparation.<br/>Two ways to cook.</strong></figcaption>
  <div className="restaurant-hero-products">{selections.map(({id, displayImage, product:p}, i) => <a href={'#project-model-'+id} key={id} aria-label={'View '+p.model+' selection'}><img src={displayImage} alt={p.model+' catalogue presentation'} width="1024" height="1024" loading={i===0?'eager':'lazy'} decoding="async"/><span>{p.model}</span></a>)}</div>
  <p className="restaurant-hero-note">4 model references · Configuration confirmed in your quote</p>
 </figure>;
}

export default function RestaurantProjectSelection({ onAction = (_action) => {} }) {
 return <section className="restaurant-selection" id="project-takeaway" aria-labelledby="project-takeaway-heading">
  <header><p className="buyer-eyebrow">TAKEAWAY / FRYING & GRIDDLE MENU</p><h2 id="project-takeaway-heading">Build the equipment selection around the menu.</h2>
   <p>Start with chilled holding, cold preparation and two countertop cooking functions for a takeaway menu. These four catalogue models are a starting selection for a DDNZ equipment quote. Confirm quantities, food batches and peak demand before choosing the final combination.</p></header>
  <figure className="restaurant-flow" aria-labelledby="restaurant-flow-caption">
   <p className="restaurant-flow-label">FOOD WORKFLOW</p>
   <ol>{[
    ['Receive & check', 'Goods, temperatures and storage needs'],
    ['Chilled holding', 'GN650TNPro'],
    ['Prepare', 'GNT2MTNPro'],
    ['Cook', 'ZH-101V fryer / ZH-818 griddle'],
    ['Pass & pickup', 'Holding, packing and handover'],
   ].map(([title, note], i) => <li key={title}><span className="restaurant-flow-number">0{i+1}</span><strong>{title}</strong><span>{note}</span></li>)}</ol>
   <div className="restaurant-wash-flow"><strong>USED UTENSILS</strong><span>Return → wash → dry / store</span><span>Plan this route separately from food preparation.</span></div>
   <figcaption id="restaurant-flow-caption">Illustrative workflow, not a measured floor plan or an installation drawing. Washing, ventilation, handwashing and other site provisions must be planned for the premises.</figcaption>
  </figure>
  <div className="restaurant-model-heading"><p className="buyer-eyebrow">THE EQUIPMENT / 04 REFERENCES</p><h2>Compare the working parts.</h2><p>Review the footprint, cooking or storage specification, and the configuration for your site.</p></div>
  <div className="restaurant-model-grid">{selections.map(({id, role, check, displayImage, product:p}, index) => <article key={id} id={'project-model-'+id}>
   <a className="restaurant-model-image" href={kitchenModelHref(id)} onClick={() => onAction('view_range')} aria-label={'View '+p.model+' equipment configuration'}><span className="restaurant-model-index">0{index+1}</span><img src={displayImage} alt={p.model+' '+p.name+' catalogue presentation'} width="1024" height="1024" loading="lazy" decoding="async"/><span className="restaurant-image-action" aria-hidden="true">View configuration ↗</span></a>
   <div className="restaurant-model-copy"><p className="buyer-eyebrow">{role}</p><h3>{p.model}</h3><p>{p.name}</p><dl><div><dt>Overall dimensions</dt><dd>{p.dimensions}</dd></div><div><dt>Listed specification</dt><dd>{p.metric} · {p.detail}</dd></div></dl><p>{check}</p>
   <a className="buyer-secondary" href={kitchenModelHref(id)} onClick={() => onAction('view_range')}>Review {p.model} configuration ↗</a></div>
  </article>)}</div>
  <p className="buyer-small">Retouched catalogue illustrations; confirm appearance and configuration against the approved sample. Listed specifications remain the model references. Confirm the order quantity for each item; this selection does not set a package price, minimum order or guaranteed output.</p>
  <div className="restaurant-scope-grid">
   <div><h3>In your equipment quote</h3><p>Ask DDNZ to confirm the selected models, quantities, manufacturing and complementary supply scope, samples or tests, packaging, spare parts and export delivery terms. Goods, packing, freight and destination costs should be itemised.</p></div>
   <div><h3>Confirm with your site team</h3><p>Provide the floor plan, doorway clearances, voltage, frequency, phase, water and drainage. Confirm extraction, handwashing, washing and local installation separately. Site works, engineered drawings and installation are not included by default.</p></div>
  </div>
  <div className="restaurant-quote-note"><h3>Request this selection or an alternative.</h3><p>Include GN650TNPro, GNT2MTNPro, ZH-101V and ZH-818 with quantities, your menu, peak portions, site dimensions, destination, budget scope and requested delivery window. Mark equipment already owned and functions still missing.</p>
   <div className="buyer-actions"><a className="buyer-button" href="#buyer-brief" onClick={() => onAction('start_brief')}>Request an equipment quote <span aria-hidden="true">↓</span></a><a className="buyer-secondary" href="/sourcing/commercial-kitchen-equipment-from-china/#commercial-kitchen-equipment" onClick={() => onAction('view_range')}>Browse the equipment catalogue ↗</a></div>
  </div>
 </section>;
}
