import React from 'react';
import {convertPrice,formatPrice} from '../data/fx.mjs';

export const priceText = quote => `${quote.currency} ${quote.price.toLocaleString('en', {minimumFractionDigits:2, maximumFractionDigits:2})}`;

export default function ProductPrice({product, compact=false, currency='USD'}) {
  const quote=product.quote;
  if(!quote)return <span className="quote-pending">Wholesale quote<small>For your quantity & market</small></span>;
  const converted=convertPrice(quote.price,quote.currency,currency);
  const displayCurrency=converted===null?quote.currency:currency;
  return <div className={`supply-price${compact?' compact':''}`}>
    <span>Indicative supply price / unit</span>
    <strong>{displayCurrency!==quote.currency?'≈ ':''}{formatPrice(converted??quote.price,displayCurrency)}</strong>
    {displayCurrency!==quote.currency&&<small>{priceText(quote)} reference</small>}
    <small>Based on {quote.minUnits} {quote.minUnits===1?'unit':'units'} · Freight & tax extra</small>
    {quote.configurationNote&&<small className="price-configuration">{quote.configurationNote}</small>}
  </div>;
}
