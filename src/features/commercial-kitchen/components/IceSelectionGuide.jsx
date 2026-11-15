import React from 'react';
import copy from '../locales/ice-selection-guide.json';
import modelDetails from '../data/iceDetails.json';
import { iceUseModels } from '../data/iceUseModels.mjs';
import { sdIceModels } from '../data/sdIceModels.mjs';
import configurationCopy from '../locales/planning/configuration.json';

export default function IceSelectionGuide({ products, locale = 'en' }) {
  const t = copy[locale];
  const hzb = products.map(product => ({
    id: product.id,
    model: product.model,
    output: product.specs['Daily output'],
    storage: modelDetails[product.id]?.storage,
    split: modelDetails[product.id]?.construction === 'split',
    photo: product.imageSmall,
  }));
  const sd = sdIceModels.map(model => ({ ...model, id: model.model.toLowerCase() }));
  const other = iceUseModels.map(model => ({
    ...model,
    output: `${model.output} kg / 24h`,
    storage: `${model.storage} kg`,
  }));
  const groups = [
    { key: 'cube', photo: hzb[0].photo, rows: [...hzb.filter(model => !model.split), ...sd] },
    { key: 'crescent', photo: other.find(model => model.kind === 'crescent').image, rows: other.filter(model => model.kind === 'crescent') },
    { key: 'granular', photo: other.find(model => model.kind === 'granular').image, rows: other.filter(model => model.kind === 'granular') },
    { key: 'split', photo: other.find(model => model.kind === 'split').image, rows: [...other.filter(model => model.kind === 'split'), ...hzb.filter(model => model.split)] },
  ];

  return <>
    <h2 id="ice-selection-title">{t.heading}</h2>
    <nav className="ice-selection-nav" aria-labelledby="ice-selection-title">
      {groups.map(group => <a key={group.key} href={`#ice-type-${group.key}`} data-category-action="compare_models">
        <img src={group.photo} width="96" height="70" alt="" loading="lazy" decoding="async"/>
        <span>
          <strong>{t[group.key][0]} <span aria-hidden="true">↓</span></strong>
          <span>{t[group.key][1]}</span>
        </span>
      </a>)}
    </nav>
    <p className="ice-selection-note">{t.outputNote}</p>
    <div className="ice-selection-tables">
      {groups.map(group => <section className="ice-type-group" key={group.key} id={`ice-type-${group.key}`} aria-labelledby={`ice-type-${group.key}-title`}>
        <h3 id={`ice-type-${group.key}-title`}>{t[group.key][0]}</h3>
        <table>
          <thead><tr><th scope="col">{configurationCopy[locale].headers[0]}</th><th scope="col">{t.daily}</th><th scope="col">{t.storage}</th></tr></thead>
          <tbody>{group.rows.map(model => <tr key={model.id} data-ice-model={model.id}>
            <th scope="row"><a href={`#model-${model.id}`}><bdi>{model.model}</bdi></a></th>
            <td><bdi>{model.output}</bdi></td>
            <td>{model.storage ? <bdi>{model.storage}</bdi> : t.pending}</td>
          </tr>)}</tbody>
        </table>
      </section>)}
    </div>
    <section className="ice-selection-installation" id="ice-installation-check" aria-labelledby="ice-installation-title">
      <h3 id="ice-installation-title">{t.installation}</h3>
      <div>
        {[t.connections, t.space, t.electric].map(([heading, body]) => <article key={heading}><h4>{heading}</h4><p>{body}</p></article>)}
      </div>
      <a className="text-link" href={locale === 'en' ? '#equipment-configuration' : '#category-rfq'}>{t.quote} ↓</a>
    </section>
  </>;
}
