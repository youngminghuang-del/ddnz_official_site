import transitNotes from './transitNotes.json';
import procurementLinks from './procurementLinks.json';
import {newMarketMetadata,marketCopy,marketInfo,marketPrefix,type NewMarket,type NewMarketLocale} from './model';
import marketRegions from '../marketRegions.json';
import senegalScopes from './senegalScopes.json';
import {freightBreadcrumbs,breadcrumbLabel} from '../freightPageSchema';
import CountryTransitPlanner from '../CountryTransitPlanner';
import FreightRatePreview from '../rates/FreightRatePreview';
import { RegionalFreightMap } from '../../../components/FreightRouteMap';
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
 const trail=freightBreadcrumbs(meta.path,locale);
 const routeDiagram = <figure className="mp-flow"><div className="new-market-origin"><span aria-hidden="true">01</span><h3>{c.origin}</h3></div><div className="mp-flow-line" aria-hidden="true">↓</div><div className="mp-hub"><span aria-hidden="true">02</span><h3>{c.gateway}</h3><p><bdi dir="ltr">{m.gateway}</bdi></p></div><div className="mp-flow-line" aria-hidden="true">↓</div><div className="mp-destination"><span aria-hidden="true">03</span><h3>{c.handover}</h3><p>{meta.name}</p></div><figcaption>{c.diagram}</figcaption></figure>;
 const procurement = <><h2>{procurementLinks[locale][0]}</h2><div className="new-market-product-links">{['commercial-kitchen-equipment','mobile-accessories','food-processing-machinery'].map((slug,i)=><a key={slug} href={`${prefix}/sourcing/${slug}-from-china/`}>{procurementLinks[locale][i+1]} ↗</a>)}</div></>;
 if (country === 'spain' || country === 'germany') {
  return (
   <main id="main-content" className="country-editorial gulf-page europe-country-freight" data-country-cargo-planning={country} lang={locale === 'zh' ? 'zh-CN' : locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
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
      <div className="europe-country-visual">
       <RegionalFreightMap region="europe" europeGateway={country === 'spain' ? 'valencia' : 'hamburg'} locale={locale} title={meta.title} description={c.diagram} />
       <p dir="ltr"><bdi>Shenzhen</bdi> → <bdi>{m.port}</bdi></p>
       <small>{c.diagram}</small>
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
       <p><a href={`${prefix}/shipping-from-china-to-europe/#europe-documents`}>{documentExamplesLink[locale]}</a></p>
      </div>
     </section>
     <section className="gulf-section gulf-scope"><p>{c.roles}</p><p>{c.boundary}</p></section>
     <section id={`${country}-quote`} className="gulf-quote-intro">
      <h2>{c.quote}</h2>
      <a className="gulf-cta" {...quote}>{c.quote} ↗</a>
     </section>
     <section className="gulf-section">{procurement}</section>
    </div>
   </main>
  );
 }
 return <main id="main-content" className="country-editorial market-preparation new-market-page" data-country-cargo-planning={country} lang={locale==='zh'?'zh-CN':locale} dir={locale==='ar'?'rtl':'ltr'}><div className="mp-wrap">
 <nav className="mp-breadcrumb" aria-label={breadcrumbLabel(locale)} data-freight-breadcrumb>{trail.map((x,i)=><span key={x.path}>{i>0&&<span aria-hidden="true"> / </span>}{i===trail.length-1?<span aria-current="page">{x.name}</span>:<a href={x.path}>{x.name}</a>}</span>)}</nav>
 <header className="mp-hero"><div><p className="mp-kicker">{region} · <bdi dir="ltr">{m.port}</bdi></p><h1>{meta.title}</h1><h2>{c.heading}</h2><p className="mp-lede">{meta.description}</p><a className="mp-primary" {...quote}>{c.quote} ↗</a></div>{routeDiagram}</header>
 <p className="mp-role">{c.roles}</p><CountryTransitPlanner country={country} locale={locale}/> {country in transitNotes&&<p className="new-market-compare">{transitNotes[country as keyof typeof transitNotes][locale]}</p>}
 <p className="new-market-compare"><strong>{c.compare}</strong> {c.compareText}</p>
 {country==='senegal'&&<p className="new-market-compare">{senegalScopes[locale]}</p>}<FreightRatePreview context={country} locale={locale}/>
 <section className="mp-section"><h2>{c.arrival}</h2><p className="mp-lede">{c.arrivalText}</p><p>{c.boundary}</p><a {...quote}>{c.quote} ↗</a></section>
 <section className="mp-section"><h2>{c.brief}</h2><ul className="mp-checks">{[c.goods,c.packing,c.ready,c.receiver].map(x=><li key={x}>{x}</li>)}</ul><a className="mp-primary" {...quote}>{c.quote} ↗</a><p><a href={`${prefix}/sourcing-services/consolidation-export/`}>{c.exportLink} ↗</a></p></section>
 {['panama','costa-rica'].includes(country)&&<section className="mp-section">{procurement}</section>}
 <section className="mp-section mp-sources"><h2>{c.sources}</h2><a href={m.source} target="_blank" rel="noreferrer"><bdi dir="ltr">{m.gateway}</bdi> ↗</a><a href={`${prefix}/shipping-from-china-to-${m.region}/`}>{region} ↗</a></section>
 </div></main>;
}
