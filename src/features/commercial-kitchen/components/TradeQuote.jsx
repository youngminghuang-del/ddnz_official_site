import React, {useEffect, useState} from 'react';
import {buyingIntents, quoteCurrencies, validateBuyingTarget, calculateMargin, createPriceDraft} from '../data/model.mjs';
import MarginPreview from './MarginPreview.jsx';
import ProductPrice from './ProductPrice.jsx';
import {marketCurrency,fx} from '../data/fx.mjs';

export default function TradeQuote({products, countries, country, onCountryChange, focus, onApply, benchmarks}) {
  const [productId, setProductId] = useState(products[0].id);
  const [intent, setIntent] = useState('trial');
  const initial=createPriceDraft(products[0],marketCurrency(country));
  const [units, setUnits] = useState(initial.units);
  const [price, setPrice] = useState(initial.price);
  const [currency, setCurrency] = useState(initial.currency);
  const [error, setError] = useState('');
  const [selling, setSelling] = useState('');
  const [landed, setLanded] = useState('');
  const [priceBasis, setPriceBasis] = useState(initial.priceBasis);
  const product=products.find(p=>p.id===productId);
  const retailReference=benchmarks?.find(b=>b.productId===productId&&b.country===country);

  function chooseProduct(id, fallbackCurrency=currency) {
    const draft=createPriceDraft(products.find(p=>p.id===id),fallbackCurrency);
    setProductId(id);
    setCurrency(draft.currency);
    setPrice(draft.price);
    setUnits(draft.units);
    setPriceBasis(draft.priceBasis);
    setSelling('');
    setLanded('');
    setError('');
  }

  useEffect(() => {
    if (!focus) return;
    chooseProduct(focus.id,focus.currency);
  }, [focus]);

  const belowReferenceQuantity=priceBasis==='reference'&&Number(units)<product.quote.minUnits;
  const marginPurchase=belowReferenceQuantity?'':price;
  const liveMargin=calculateMargin({purchase:marginPurchase,selling,landed,units});

  function submit(event) {
    event.preventDefault();
    const target = validateBuyingTarget(products, {productId, intent, units, price, currency, selling, landed, priceBasis});
    if (!target) {
      setError(belowReferenceQuantity?`This reference is based on ${product.quote.minUnits} units. For a smaller order, clear the buying price and request a quote.`:'Enter a whole number of units and a positive buying price, or leave the price blank.');
      return;
    }
    setError('');
    onApply(target);
  }

  return <section className="trade-quote" id="commercial-kitchen-trade-pricing" aria-labelledby="commercial-kitchen-trade-heading">
    <div className="trade-intro">
      <p className="eyebrow">PLAN YOUR NEXT ORDER</p>
      <h3 id="commercial-kitchen-trade-heading">Build your range.<br/>Keep room <br/>for <em>margin.</em></h3>
      <p>See what each sale leaves you. Enter your selling price and estimated costs to compare margin per unit and across your order.</p>
      <MarginPreview purchase={marginPurchase} selling={selling} landed={landed} units={units} currency={currency}/>
    </div>
    <form className="trade-form" onSubmit={submit}>
      <fieldset className="intent-field">
        <legend>What are you planning?</legend>
        <div className="buying-intents">{Object.entries(buyingIntents).map(([id, item]) =>
          <button type="button" key={id} aria-pressed={intent === id} onClick={() => setIntent(id)}>{item.label}</button>
        )}</div>
        <p className="intent-description" aria-live="polite">{buyingIntents[intent].description}</p>
      </fieldset>
      <label>Equipment to quote
        <select value={productId} onChange={e => chooseProduct(e.target.value)}>
          {products.map(p => <option key={p.id} value={p.id}>{p.model} — {p.name}</option>)}
        </select>
      </label>
      {product.quote&&<div className="trade-supply-price"><ProductPrice product={product} currency={currency}/><p className="fine">Price and configuration confirmed with your quotation.</p>{priceBasis!=='reference'&&<button type="button" className="text-link" onClick={()=>chooseProduct(productId)}>Use this price for my estimate →</button>}</div>}
      {retailReference&&<p className="margin-retail-reference"><span>Market reference</span><a href={retailReference.url} target="_blank" rel="noreferrer">{retailReference.site} · {retailReference.currency} {retailReference.price.toLocaleString('en',{minimumFractionDigits:2})} ↗</a><small>Observed retail listing; tax and delivery terms may differ from your sale.</small></p>}
      <div className="two-fields">
        <label>Order quantity<input type="number" min="1" max="9999" step="1" required value={units} onChange={e => setUnits(e.target.value)}/></label>
        <label>Destination for this order<select value={country} onChange={e => onCountryChange(e.target.value)}>{countries.map(c => <option key={c}>{c}</option>)}</select></label>
      </div>
      <fieldset className="target-price-field">
        <legend>Buying price / unit <span>(optional)</span></legend>
        <div className="target-price-inputs">
          <select aria-label="Target price currency" value={currency} onChange={e => {const next=e.target.value;setCurrency(next);setSelling('');setLanded('');if(priceBasis==='reference'&&fx.rates[next]){setPrice(createPriceDraft(product,next).price);}else{setPrice('');setPriceBasis('target');}}}>{quoteCurrencies.map(c => <option key={c}>{c}</option>)}</select>
          <input aria-label="Target buying price per unit" type="number" min="0.01" max="999999999" step="0.01" value={price} placeholder="Your target price" onChange={e => {setPrice(e.target.value);setPriceBasis('target');}}/>
        </div>
        <p className="fine">{priceBasis==='reference'?'Our indicative supply price is filled in. You can edit it to propose your own target.':'Enter a target buying price, or leave it open and request our quote.'}</p>
        {belowReferenceQuantity&&<p className="trade-error" role="status">This price reference is based on {product.quote.minUnits} units. Clear the buying price to request a smaller order.</p>}
      </fieldset>
      <fieldset className="margin-inputs">
        <legend>Plan your margin <span>(optional · all amounts in {currency})</span></legend>
        <div className="two-fields">
          <label>Expected selling price / unit<input type="number" min="0.01" max="999999999" step="0.01" value={selling} placeholder="Excluding sales tax" onChange={e=>setSelling(e.target.value)}/></label>
          <label>Freight & import costs / unit<input type="number" min="0" max="999999999" step="0.01" value={landed} placeholder="Enter cost, or 0 if none" onChange={e=>setLanded(e.target.value)}/></label>
        </div>
        <p className="fine">Enter all amounts in {currency}. Include costs you cannot recover, such as freight and import duty. Changing currency clears your selling price and costs; supported supply references convert using rates dated {fx.date}.</p>
      </fieldset>
      {liveMargin&&<div className={`margin-live-summary${liveMargin.unitProfit<0?' is-loss':''}`} aria-live="polite"><div><span>Gross margin</span><strong>{liveMargin.marginPct.toFixed(1)}%</strong></div><div><span>Gross profit / unit</span><strong>{new Intl.NumberFormat('en',{style:'currency',currency}).format(liveMargin.unitProfit)}</strong></div><a href="#commercial-kitchen-margin-visual">View margin breakdown ↑</a></div>}
      {error && <p className="trade-error" role="alert">{error}</p>}
      <button className="button primary trade-cta" type="submit">Add to my quote request <span aria-hidden="true">→</span></button>
      <p className="fine trade-footnote">Adds your buying goal to the sourcing brief and sets this model’s quantity. Final pricing and order terms follow the quotation.</p>
    </form>
  </section>;
}
