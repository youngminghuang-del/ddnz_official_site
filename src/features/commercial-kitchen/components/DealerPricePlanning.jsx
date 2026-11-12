import { useState } from 'react';
import TradeQuote from './TradeQuote.jsx';
import PriceContext, { FxNote } from './PriceContext.jsx';
import catalog from '../data/products.mjs';
import launch from '../data/launch.mjs';
import benchmarks from '../data/benchmarks.mjs';
import { requestedKitchenModel } from '../data/categories.mjs';

const products = [...launch.featuredProductIds.map(id => catalog.find(item => item.id === id)),
  ...catalog.filter(item => !launch.featuredProductIds.includes(item.id))];
const countries = ['United Arab Emirates', 'Singapore', 'Mexico', 'Other'];

export default function DealerPricePlanning({ modelQuery = '', onApply }) {
  const [country, setCountry] = useState(countries[0]);
  const [focus, setFocus] = useState(null);
  const product = requestedKitchenModel(modelQuery);
  const references = benchmarks.filter(item => item.country === country);

  return <section className="ddnz-kitchen kitchen-brand dealer-price-planning" id="commercial-kitchen-benchmarks">
    <div className="section wrap">
      <h2>Retail references and buying margin</h2>
      <p>Use dated local retail listings to check your own selling price. Compare configuration, tax and delivery terms before estimating margin in CNY.</p>
      <label className="dealer-market-picker">Retail reference market
        <select value={country} onChange={event => setCountry(event.target.value)}>
          {countries.map(item => <option key={item}>{item}</option>)}
        </select>
      </label>
      {references.length > 0 ? <div className="benchmarks">{references.map(item => <article className="benchmark" key={item.id}>
        <div className="benchmark-top"><span>{item.site}</span><a href={item.url} target="_blank" rel="noreferrer">View listing ↗</a></div>
        <h3>{item.name}</h3><p>{item.spec}</p>
        <strong className="retail-price">{item.currency} {item.price.toLocaleString('en')}<small>Observed retail reference / unit</small></strong>
        <p className="fine">{item.context}<br/>{item.capture}</p>
        <p>{item.match}. {item.difference}</p>
        <PriceContext benchmark={item} product={products.find(row => row.id === item.productId)}
          onPlan={() => {setFocus({id:item.productId});document.getElementById('commercial-kitchen-trade-pricing')?.scrollIntoView();}}/>
      </article>)}</div> : <p>No retail reference for this market. Enter your own figures below.</p>}
      <FxNote/>
      <TradeQuote key={product?.id || 'catalogue'} products={products} initialProductId={product?.id} focus={focus}
        countries={countries} country={country} onCountryChange={setCountry} onApply={onApply} benchmarks={benchmarks}/>
    </div>
  </section>;
}
