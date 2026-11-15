import React from 'react';
import { GriddleModelPhoto } from './CookingVisuals';
import cookingCopy from '../locales/planning/cooking-selection.json';
import layoutCopy from '../locales/planning/griddle-thickness.json';

const thicknesses = ['8 mm', '12 mm', '16 mm'];

function ModelPhoto({ model }) {
  return model.imageSmall
    ? <img src={model.imageSmall} alt="" width="140" height="105" loading="lazy" decoding="async"/>
    : <GriddleModelPhoto modelId={model.id} decorative/>;
}

export default function GriddleComparison({ catalogue, models, locale, onSupplierAdd, catalogueActions }) {
  const [title, intro, confirm, specs, zones, surface] = layoutCopy[locale];
  const t = cookingCopy[locale];
  const groups = thicknesses.map(thickness => ({
    id: `griddle-plate-${thickness.split(' ')[0]}mm`,
    thickness,
    models: [
      ...catalogue.filter(model => model.specs['Cooking plate'].endsWith(' × ' + thickness)),
      ...models.filter(model => model.thickness === thickness),
    ],
  }));

  return <>
    <nav className="griddle-thickness-nav" aria-label={title}>
      {groups.map(group => <a href={`#${group.id}`} key={group.id} data-category-action="compare_models">
        <div className="griddle-nav-photo"><ModelPhoto model={group.models[0]}/></div>
        <strong><bdi>{group.thickness}</bdi> <span aria-hidden="true">↓</span></strong>
      </a>)}
    </nav>
    <p>{intro}</p>
    {groups.map(group => <section className="griddle-comparison" id={group.id} key={group.id} aria-labelledby={`${group.id}-title`}>
      <h3 id={`${group.id}-title`}><bdi>{group.thickness}</bdi></h3>
      <table aria-labelledby={`${group.id}-title`}>
        <thead><tr><th scope="col">{t.model}</th><th scope="col">{surface}</th><th scope="col">{zones}</th></tr></thead>
        <tbody>{group.models.map(model => <tr key={model.id} id={`model-${model.id}`}>
          <th scope="row">
            <div className="griddle-model-name"><div className="griddle-row-photo"><ModelPhoto model={model}/></div><bdi>{model.model}</bdi></div>
            <details>
              <summary>{specs}</summary>
              <dl>
                <div><dt>{t.power}</dt><dd><bdi>{model.power ?? model.specs['Rated power']}</bdi></dd></div>
                <div><dt>{t.dimensions}</dt><dd><bdi>{model.dimensions}</bdi></dd></div>
                <div><dt>{t.voltage}</dt><dd><bdi>{model.voltage ?? confirm}</bdi></dd></div>
              </dl>
              {model.imageSmall ? catalogueActions(model) : <button className="text-link" type="button"
                aria-label={`${t.add} ${model.model}`} onClick={() => onSupplierAdd(model.id)}>{t.add}</button>}
            </details>
          </th>
          <td><bdi>{model.metric}</bdi></td>
          <td><bdi>{model.controls ?? confirm}</bdi></td>
        </tr>)}</tbody>
      </table>
    </section>)}
  </>;
}
