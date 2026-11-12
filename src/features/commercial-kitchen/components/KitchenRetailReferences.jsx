import { getLocalizedKitchenBenchmarks, getLocalizedKitchenProducts, kitchenCopy, localMoney } from '../data/localization.mjs';
import { IsolatedText } from './LocalizedKitchenText';

export default function KitchenRetailReferences({ locale }) {
  const t = kitchenCopy(locale), u = t.ui;
  const products = getLocalizedKitchenProducts(locale);
  const benchmarks = getLocalizedKitchenBenchmarks(locale);
  return <section className="section wrap" id="commercial-kitchen-benchmarks" aria-labelledby="localized-prices-title">
    <p className="eyebrow">{u.prices}</p>
    <h2 id="localized-prices-title">{u.marketTitle}</h2>
    <div className="localized-price-explanation" id="commercial-kitchen-trade-pricing">
      <p><IsolatedText>{u.priceScope}</IsolatedText></p>
      <p>{u.priceCosts}</p>
      <p><IsolatedText>{u.marketHelp}</IsolatedText></p>
    </div>
    {Object.entries(t.markets).map(([country, market]) => <section className="localized-market" key={country} aria-label={t.countries[country]}>
      <h3>{market.title}</h3>
      <p>{market.description}</p>
      <p className="fine"><IsolatedText>{market.note}</IsolatedText></p>
      <div className="localized-two-columns">
        {benchmarks.filter(reference => reference.country === country).map(reference => <article className="localized-panel" key={reference.id}>
          <p className="eyebrow">{reference.countryLabel} · <bdi dir="ltr">{reference.site}</bdi></p>
          <h4><IsolatedText>{reference.name}</IsolatedText></h4>
          <p className="fine">{u.linkedModel}: <IsolatedText>{products.find(product => product.id === reference.productId).displayModel}</IsolatedText></p>
          <p>{u.observed}: <strong><bdi dir="ltr">{localMoney(reference.price, reference.currency, locale)}</bdi></strong></p>
          <p><IsolatedText>{reference.spec}</IsolatedText></p>
          <p>{reference.match}</p>
          <p><IsolatedText>{reference.difference}</IsolatedText></p>
          <p className="fine"><IsolatedText>{reference.context}</IsolatedText></p>
          <p className="fine">{u.captured}: <time dateTime={reference.date}><bdi dir="ltr">{reference.date}</bdi></time>. {reference.capture}</p>
          <a className="text-link" href={reference.url} target="_blank" rel="noopener noreferrer">{u.source}<span aria-hidden="true">↗</span></a>
        </article>)}
      </div>
    </section>)}
  </section>;
}
