import React from 'react';
import copy from '../locales/planning/fryer-types.json';
import cookingCopy from '../locales/planning/cooking-selection.json';
import { categoryProducts } from '../data/categories.mjs';

export const fryerGroups = ['single', 'twin', 'drain'];
export const fryerGroupAnchor = group => `fryer-type-${group}`;

export default function FryerTypeNavigation({ category, locale = 'en' }) {
  const text = copy[locale];
  const labels = cookingCopy[locale];
  const products = categoryProducts(category);
  const photos = {
    single: products.find(product => product.specs.Tanks === '1').imageSmall,
    twin: products.find(product => product.specs.Tanks === '2').imageSmall,
    drain: '/images/cooking-products/df-12l.jpg',
  };

  return (
    <nav className="fryer-type-nav" aria-label={text.title}>
      {fryerGroups.map(group => (
        <a key={group} href={`#${fryerGroupAnchor(group)}`} data-category-action="compare_models">
          <img src={photos[group]} alt="" width="84" height="64" loading="lazy" decoding="async" />
          <span>
            <strong>{labels[group]} <span aria-hidden="true">↓</span></strong>
            <span className="fryer-type-description">{text[group]}</span>
          </span>
        </a>
      ))}
    </nav>
  );
}
