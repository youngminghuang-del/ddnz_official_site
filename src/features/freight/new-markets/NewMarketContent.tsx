import transitNotes from './transitNotes.json';
import procurementLinks from './procurementLinks.json';
import {newMarketMetadata,marketCopy,marketInfo,marketPrefix,type NewMarket,type NewMarketLocale} from './model';
import marketRegions from '../marketRegions.json';
import senegalScopes from './senegalScopes.json';
import CountryTransitPlanner from '../CountryTransitPlanner';
import FreightRatePreview from '../rates/FreightRatePreview';
import { CountryGatewayMap } from '../../../components/FreightRouteMap';
import FreightBreadcrumbs from '../FreightBreadcrumbs';
import {quoteLinkProps} from '../../../lib/quoteLinkPolicy.mjs';
const documentExamplesLink: Record<NewMarketLocale, string> = {
  en: 'Compare sample shipping documents',
  zh: '对照海运单证示意',
  es: 'Comparar ejemplos de documentos de transporte',
  ru: 'Сверить примеры морских документов',
  fr: 'Comparer les exemples de documents maritimes',
  ar: 'قارن أمثلة وثائق الشحن البحري',
  pt: 'Comparar exemplos de documentos marítimos',
  tr: 'Örnek deniz taşımacılığı belgelerini karşılaştırın',
};

export default function NewMarketContent({country,locale}:{country:NewMarket;locale:NewMarketLocale}){
 const c=marketCopy(locale),m=marketInfo(country),meta=newMarketMetadata(country,locale),prefix=marketPrefix(locale),region=m.region==='latin-america'?c.latin:m.region==='west-africa'?c.west:m.region==='central-africa'?c.central:marketRegions[m.region as keyof typeof marketRegions][locale].name;
 const quote=quoteLinkProps(`${prefix}/get-a-quote/?${new URLSearchParams({leadGoal:'Freight Export',source:'international_country',destinationText:`${meta.name} · ${m.port}`,notes:`${c.boundary}\n${m.notes[locale]}`})}`);
 const isEurope = country === 'spain' || country === 'germany';
 const procurement = <><h2>{procurementLinks[locale][0]}</h2><div className="new-market-product-links">{['commercial-kitchen-equipment','mobile-accessories','food-processing-machinery'].map((slug,i)=><a key={slug} href={`${prefix}/sourcing/${slug}-from-china/`}>{procurementLinks[locale][i+1]} ↗</a>)}</div></>;
 return (
   <main id="main-content" className={`country-editorial gulf-page market-country-freight ${isEurope ? 'europe-country-freight' : ''}`} data-country-cargo-planning={country} lang={locale === 'zh' ? 'zh-CN' : locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
    <div className="gulf-wrap">
     <FreightBreadcrumbs path={meta.path} locale={locale} className="gulf-breadcrumb" />
     <header className="gulf-hero">
      <div className="gulf-hero-copy">
       <p className="gulf-eyebrow">{region} · <bdi dir="ltr">{m.port}</bdi></p>
       <h1>{meta.title}</h1>
       <p className="gulf-lede">{meta.description}</p>
       <div className="gulf-actions">
        <a className="gulf-cta" {...quote}>{c.quote} ↗</a>
        <a className="gulf-secondary" href={`#${country}-arrival`}>{c.arrival} ↓</a>
       </div>
      </div>
      <div className="europe-country-visual market-country-visual">
       <CountryGatewayMap country={country} locale={locale} destination={meta.name} />
      </div>
     </header>
     <nav className="gulf-chapters" aria-label={c.heading}>
      <a href={`#${country}-transit`}>{c.compare}</a>
      <a href={`#${country}-preparation`}>{c.brief}</a>
      <a href={`#${country}-arrival`}>{c.arrival}</a>
      <a href={`#${country}-quote`}>{c.quote}</a>
     </nav>
     <div id={`${country}-transit`}>
      <CountryTransitPlanner country={country} locale={locale} />
      {country in transitNotes && <p className="new-market-compare">{transitNotes[country as keyof typeof transitNotes][locale]}</p>}
      <p className="new-market-compare"><strong>{c.compare}</strong> {c.compareText}</p>
      {country === 'senegal' && <p className="new-market-compare">{senegalScopes[locale]}</p>}
      <FreightRatePreview context={country} locale={locale} />
     </div>
     <section id={`${country}-preparation`} className="gulf-section">
      <h2>{c.brief}</h2>
      <p>{c.heading}</p>
      <ul className="mp-checks">{[c.goods, c.packing, c.ready, c.receiver].map(item => <li key={item}>{item}</li>)}</ul>
      <p><a href={`${prefix}/sourcing-services/consolidation-export/`}>{c.exportLink} ↗</a></p>
     </section>
     <section id={`${country}-arrival`} className="gulf-section gulf-split">
      <div><h2>{c.arrival}</h2><p>{c.arrivalText}</p></div>
      <div className="gulf-reading">
       <h3>{c.sources}</h3>
       <p><a href={m.source} target="_blank" rel="noreferrer"><bdi dir="ltr">{m.gateway}</bdi> ↗</a></p>
       <p><a href={`${prefix}/shipping-from-china-to-${m.region}/`}>{region} ↗</a></p>
       {isEurope && <p><a href={`${prefix}/shipping-from-china-to-europe/#europe-documents`}>{documentExamplesLink[locale]}</a></p>}
      </div>
     </section>
     <section className="gulf-section gulf-scope"><p>{c.roles}</p><p>{c.boundary}</p></section>
     <section id={`${country}-quote`} className="gulf-quote-intro">
      <h2>{c.quote}</h2>
      <a className="gulf-cta" {...quote}>{c.quote} ↗</a>
     </section>
     {['spain', 'germany', 'panama', 'costa-rica'].includes(country) && <section className="gulf-section">{procurement}</section>}
    </div>
   </main>
  );
}
