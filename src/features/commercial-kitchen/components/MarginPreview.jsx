import React, {useEffect, useState} from 'react';
import {calculateMargin} from '../data/model.mjs';

const money = (n, currency) => new Intl.NumberFormat('en', {style:'currency',currency,maximumFractionDigits:2}).format(n);
const example = calculateMargin({purchase:220,selling:500,landed:80,units:20});

export default function MarginPreview({purchase, selling, landed, units, currency}) {
  const [exampleRequested, setExampleRequested] = useState(false);
  useEffect(() => setExampleRequested(false), [purchase,selling,landed,units,currency]);
  const hasInputs = [purchase,selling,landed].some(v => String(v??'').trim()!=='');
  const sample = exampleRequested || !hasInputs;
  const result = sample ? example : calculateMargin({purchase,selling,landed,units});
  const displayCurrency = sample ? 'USD' : currency;
  const negative = result && result.unitProfit < 0;
  const scale = result ? Math.max(result.selling,result.unitCost) : 1;
  const parts = result ? [
    {key:'purchase',label:'Buying cost',value:result.purchase},
    {key:'landed',label:'Freight & import costs',value:result.landed},
    {key:'profit',label:negative?'Gross loss':'Gross profit',value:result.unitProfit}
  ] : [];

  return <div className={`margin-preview${negative?' is-loss':''}`} id="commercial-kitchen-margin-visual" aria-label="Margin visualisation">
    <div className="margin-top"><span className={`margin-mode${sample?' sample':''}`}>{sample?'WORKED EXAMPLE':'YOUR ESTIMATE'} · {displayCurrency}</span>{hasInputs&&<button type="button" onClick={()=>setExampleRequested(!exampleRequested)}>{sample?'Back to my numbers':'See an example'}</button>}</div>
    <div className="margin-percentage" aria-live="polite"><strong>{result?`${result.marginPct.toFixed(1)}%`:'—'}</strong><span>estimated<br/>gross margin</span></div>
    <p className="margin-context">{sample?'Example only — not a DDNZ price or a quotation.':result?'Based on your selling price and estimated costs.':'Enter a selling price, buying price and landed costs to see your margin.'}</p>
    {result ? <>
      <div className="margin-sale"><span>Expected sale / unit</span><b>{money(result.selling,displayCurrency)}</b></div>
      <div className="margin-bar" role="img" aria-label={parts.map(p=>`${p.label}: ${money(p.value,displayCurrency)}`).join('; ')}>{parts.map(p=>p.value>0&&<span key={p.key} className={`margin-segment ${p.key}`} style={{width:`${p.value/scale*100}%`}}/>)}</div>
      <dl className="margin-legend">{parts.map(p=><div key={p.key}><dt><i className={p.key}/>{p.label}</dt><dd>{money(p.value,displayCurrency)}</dd></div>)}</dl>
      {negative&&<p className="margin-loss-note">Costs exceed the selling price by {money(-result.unitProfit,displayCurrency)} per unit.</p>}
      <div className="margin-metrics" aria-live="polite"><div><span>{negative?'Gross loss':'Gross profit'} / unit</span><strong>{money(result.unitProfit,displayCurrency)}</strong></div><div><span>{negative?'Gross loss':'Gross profit'} / {result.units} {result.units===1?'unit':'units'}</span><strong>{money(result.orderProfit,displayCurrency)}</strong></div></div>
      <div className="margin-order-cost"><span>Landed cost / {result.units} {result.units===1?'unit':'units'}</span><b>{money(result.orderCost,displayCurrency)}</b></div>
    </> : <div className="margin-pending"><div className="margin-empty-bar"/><p>Buying cost <span>+</span> landed costs <span>+</span> gross profit <span>=</span> selling price</p><button type="button" className="text-link" onClick={()=>setExampleRequested(true)}>Preview a worked example <span aria-hidden="true">→</span></button></div>}
    <p className="margin-footnote">Gross margin = (selling price − buying cost − landed costs) ÷ selling price. Before operating costs and income tax.</p>
    {sample&&<p className="margin-example-note">Illustration: sell at USD 500, buy at USD 220, allow USD 80 for freight and import costs. Enter your own figures to plan your order.</p>}
  </div>;
}
