import React from 'react';
import {quantityBand} from '../data/model.mjs';
import {formatPrice} from '../data/fx.mjs';

export default function ProductPrice({product, compact=false}) {
  const quote=product.quote;
  if(!quote)return <span className="quote-pending">Wholesale quote<small>For your quantity & market</small></span>;
  if(quote.tiers)return <div className={`supply-price${compact?' compact':''}`}>
    <span>Indicative supply price / unit</span>
    <dl className="supply-price-tiers">{quote.tiers.map((tier,index)=><div key={tier.minUnits}>
      <dt>{quantityBand(quote.tiers,index)} units</dt><dd>{formatPrice(tier.price,quote.currency)}</dd>
    </div>)}</dl>
    <small>MOQ {quote.minUnits} unit · Freight &amp; tax extra</small>
  </div>;
  return <div className={`supply-price${compact?' compact':''}`}>
    <span>Indicative supply price / unit</span>
    <strong>{formatPrice(quote.price,quote.currency)}</strong>
    <small>Based on {quote.minUnits} {quote.minUnits===1?'unit':'units'} · Freight & tax extra</small>
    {quote.configurationNote&&<small className="price-configuration">{quote.configurationNote}</small>}
  </div>;
}
