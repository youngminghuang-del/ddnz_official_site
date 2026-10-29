import { PRODUCTS, BASIS } from './calculator.mjs';
import { bearProducts } from '../mobile-sourcing/bear-glass.mjs';
import { privacy28 } from '../mobile-sourcing/privacy28.mjs';
import { privacyOFold } from '../mobile-sourcing/privacy-o-fold.mjs';

const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const qty = value => value.toLocaleString('en-US');
const price = value => `CNY ${value.toFixed(2)}`;
const tierText = product => product.tiers.map(([min, value], i, tiers) => `${price(value)} · ${qty(min)}${tiers[i + 1] ? '–' + qty(tiers[i + 1][0] - 1) : '+'} pieces`).join('<br>');
// Shared by visible HTML and the collection schema; prices use the existing order models.
export function comparisonGroups() {
  return [
    {anchor:'bear-glass', name:'HD & 28° privacy', code:'BG-HD / BG-P28', prices:tierText(bearProducts[0]), minimum:bearProducts[0].orderNote.en, pack:'Confirm packaging and included accessories.', note:'Combine these two versions only; separate from O-fold and the other ranges.'},
    {anchor:'privacy-o-fold', name:'O-fold privacy', code:privacyOFold.code, prices:tierText(privacyOFold), minimum:privacyOFold.orderNote.en, pack:'Retail packaging; confirm the included accessories.', note:'This product has its own quantity tiers.'},
    {anchor:'privacy28-new', name:'28° HD privacy', code:privacy28.code, prices:price(privacy28.tiers[0][1])+' · per piece', minimum:privacy28.orderNote.en, pack:'Confirm which packaging and accessories the price covers.', note:'Separate from BG-P28 and P28-OF.'},
    ...Object.entries(PRODUCTS).map(([id,p]) => ({anchor:'film-product-'+id, name:({'og28':'OG28 Privacy','001':'001 Privacy','titan-hd':'Titan Clear + installer','titan-privacy':'Titan Privacy + installer'})[id], code:'Reference · '+BASIS.date, prices:price(p.price)+' · per piece', minimum:`${qty(p.minQty)} pieces per phone model${p.minOrderQty ? '; '+qty(p.minOrderQty)+' pieces total for this product' : ''}.`, pack:id.startsWith('titan')?'Retail pack with enclosed installation tool.':id==='001'?'Individual retail packaging.':'Retail packaging as listed.', note:'Confirm current price, model availability and lead time.'}))
  ];
}
export function renderComparisonActions() {
  return '<div class="actions compare-intro-actions"><a class="button" href="/screen-protectors/compare/#price-comparison">Compare prices & minimums ↓</a><a class="button secondary" href="/screen-protectors/brief/">Prepare a wholesale request →</a></div>';
}
export function renderPriceComparison() {
  const rows = comparisonGroups();
  return `<section class="film-price-comparison" id="price-comparison" aria-labelledby="price-comparison-title"><header><p class="eyebrow">PRICES & ORDER MINIMUMS</p><h2 id="price-comparison-title">Compare your next wholesale order.</h2><p>Choose the finish and order size that work for your phone-model mix. Each range has its own minimums and packing conditions.</p></header><div class="film-price-grid" role="list">${rows.map(r=>`<article class="film-price-row" role="listitem"><div class="film-price-name"><h3>${esc(r.name)}</h3><small>${esc(r.code)}</small></div><div class="film-price-amount"><span class="film-price-label">Unit price</span><strong>${r.prices}</strong></div><div class="film-price-terms"><span class="film-price-label">Minimum & mixing</span><p>${esc(r.minimum)}</p><small>${esc(r.note)}</small></div><div class="film-price-pack"><span class="film-price-label">Packing</span><p>${esc(r.pack)}</p><a href="/screen-protectors/compare/#${r.anchor}">Choose models & view details ↗</a></div></article>`).join('')}</div><p class="film-price-footnote">Prices are in CNY per piece. The four dated references retain their ${esc(BASIS.date)} basis. Freight is quoted separately for your destination; confirm phone fit, pack contents, current supply terms and lead time before ordering.</p></section>`;
}
export function comparisonSchema(breadcrumb) {
  const url = 'https://www.ddnzglobal.com/screen-protectors/compare/';
  const groups = comparisonGroups();
  const { '@context': context, ...crumb } = breadcrumb;
  return {'@context':context,'@graph':[
    {'@type':'CollectionPage','@id':url+'#webpage',url,name:'Wholesale Screen Protector Prices & MOQ from China | DDNZ',inLanguage:'en',breadcrumb:{'@id':url+'#breadcrumb'},mainEntity:{'@id':url+'#comparison-list'}},
    {...crumb,'@id':url+'#breadcrumb'},
    {'@type':'ItemList','@id':url+'#comparison-list',name:'Wholesale screen protector comparison groups',numberOfItems:groups.length,itemListElement:groups.map((r,i)=>({'@type':'ListItem',position:i+1,name:r.name+' — '+r.code,url:url+'#'+r.anchor}))}
  ]};
}
