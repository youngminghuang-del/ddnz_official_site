import React from 'react';
import { kitchenListHref } from '../data/inductionPage.mjs';

export default function IceBuyingChecklist({ reading, children }) {
  return <section className="section wrap equipment-config ice-selection-check" id="category-buying">
    <h2 id="ice-site-check">Check output, storage and installation</h2>
    <div className="equipment-config-grid">
      <article><h3>Daily production</h3><p>Compare kg/day at the same room and inlet water temperatures. Ask for expected output under your site conditions.</p></article>
      <article><h3>Peak service and storage</h3><p>Estimate ice used during the busiest period, then confirm usable bin capacity and refill time.</p></article>
      <article><h3>Installation</h3><p>Confirm voltage and frequency, footprint, water supply, drain and cleaning access.</p></article>
    </div>
    <p><a className="text-link" href={'/blog/' + reading.slug + '/'} data-category-action="read_guide">{reading.title} ↗</a></p>
    {children}
  </section>;
}

export function IceQuotePaths({ count }) {
  return <section className="wrap ice-quote-paths" aria-labelledby="ice-quote-paths-title">
    <h2 id="ice-quote-paths-title">Ready for a quote?</h2>
    <div className="ice-quote-path-grid">
      <a className="ice-site-request" href={kitchenListHref} data-category-action="start_brief">
        <img src="/media/process/brief-spec-discussion-poster.webp" alt="" width="96" height="72" loading="lazy" decoding="async"/>
        <div><strong>View equipment list ({count})</strong><span>Review selected models and quantities for a mixed order.</span></div>
        <span aria-hidden="true">↗</span>
      </a>
      <a className="ice-site-request" href="#equipment-configuration">
        <img src="/commercial-kitchen-media/ddnz-products/ice-49-ddnz-v1-600.webp" alt="" width="96" height="72" loading="lazy" decoding="async"/>
        <div><strong>Add your site requirements</strong><span>Share electrical supply, water, drainage and installation space for a configuration quote.</span></div>
        <span aria-hidden="true">↓</span>
      </a>
    </div>
  </section>;
}
