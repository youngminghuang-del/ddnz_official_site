const aliases = {
  top: 'top', kitchen: 'top', equipment: 'equipment', range: 'equipment', products: 'equipment', families: 'equipment',
  assortments: 'assortments', benchmarks: 'benchmarks', 'trade-pricing': 'trade-pricing',
  guide: 'guide', design: 'guide', control: 'guide', 'control-plan': 'guide',
  about: 'guide', evidence: 'guide', scorecard: 'guide', resources: 'guide', gallery: 'guide',
  'sourcing-list': 'list', brief: 'list', rfq: 'list',
};
export function canonicalKitchenHash(hash) {
  const key = String(hash).replace(/^#/, '');
  const target = Object.hasOwn(aliases, key) ? aliases[key] : null;
  return target ? `#commercial-kitchen-${target}` : hash;
}
