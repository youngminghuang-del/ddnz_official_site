import React from 'react';
import {convertPrice,formatPrice,fx} from '../data/fx.mjs';

export function FxNote(){return <p className="fine fx-note">Retail comparison exchange rates · {fx.date} · <a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer">Rates by ExchangeRate-API ↗</a>. Retail conversions are approximate.</p>}

export default function PriceContext({benchmark,product,onPlan}){
 const q=product.quote;
 const retail=convertPrice(benchmark.price,benchmark.currency,q?.currency);
 if(!q||retail===null)return null;
 const scale=Math.max(q.price,retail);
 return <div className="price-context">
   <div className="price-context-row"><span>Indicative supply · {product.model}</span><strong>{formatPrice(q.price,q.currency)}</strong></div>
   <div className="context-track"><span style={{width:`${q.price/scale*100}%`}}/></div>
   <div className="price-context-row retail"><span>Retail equivalent · {benchmark.site}</span><strong>≈ {formatPrice(retail,q.currency)}</strong></div>
   <div className="context-track retail"><span style={{width:`${retail/scale*100}%`}}/></div>
   <p className="fine">Supply reference based on {q.minUnits} {q.minUnits===1?'unit':'units'}, before freight and tax. The retail figure has separate tax, delivery and configuration terms shown above.</p>
   <button className="text-link" onClick={onPlan}>Work out my margin <span aria-hidden="true">→</span></button>
 </div>
}
