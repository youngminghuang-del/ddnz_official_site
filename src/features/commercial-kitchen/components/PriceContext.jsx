import React from 'react';
import {convertPrice,formatPrice,fx} from '../data/fx.mjs';

export function FxNote(){return <p className="fine fx-note">Approximate currency conversion · {fx.date} · <a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer">Rates by ExchangeRate-API ↗</a>. Final currency and pricing follow your quotation.</p>}

export default function PriceContext({benchmark,product,onPlan}){
 const q=product.quote;
 const cost=q&&convertPrice(q.price,q.currency,benchmark.currency);
 if(cost===null||cost===undefined)return null;
 const scale=Math.max(cost,benchmark.price);
 return <div className="price-context">
   <div className="price-context-row"><span>Indicative supply · {product.model}</span><strong>≈ {formatPrice(cost,benchmark.currency)}</strong></div>
   <div className="context-track"><span style={{width:`${cost/scale*100}%`}}/></div>
   <div className="price-context-row retail"><span>Observed retail · {benchmark.site}</span><strong>{formatPrice(benchmark.price,benchmark.currency)}</strong></div>
   <div className="context-track retail"><span style={{width:`${benchmark.price/scale*100}%`}}/></div>
   <p className="fine">Supply reference based on {q.minUnits} {q.minUnits===1?'unit':'units'}, before freight and tax. The retail figure has separate tax, delivery and configuration terms shown above.</p>
   <button className="text-link" onClick={onPlan}>Work out my margin <span aria-hidden="true">→</span></button>
 </div>
}
