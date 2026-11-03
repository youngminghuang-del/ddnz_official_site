import procurementLinks from './procurementLinks.json';
import {newMarketMetadata,marketCopy,marketInfo,marketPrefix,type NewMarket,type NewMarketLocale} from './model';
import marketRegions from '../marketRegions.json';
import senegalScopes from './senegalScopes.json';
import {freightBreadcrumbs,breadcrumbLabel} from '../freightPageSchema';
import CountryTransitPlanner from '../CountryTransitPlanner';
import FreightRatePreview from '../rates/FreightRatePreview';
import {quoteLinkProps} from '../../../lib/quoteLinkPolicy.mjs';
export default function NewMarketContent({country,locale}:{country:NewMarket;locale:NewMarketLocale}){
 const c=marketCopy(locale),m=marketInfo(country),meta=newMarketMetadata(country,locale),prefix=marketPrefix(locale),region=m.region==='latin-america'?c.latin:m.region==='west-africa'?c.west:marketRegions[m.region as keyof typeof marketRegions][locale].name;
 const quote=quoteLinkProps(`${prefix}/get-a-quote/?${new URLSearchParams({leadGoal:'Freight Export',source:'international_country',destinationText:`${meta.name} · ${m.port}`,notes:`${c.boundary}\n${m.notes[locale]}`})}`);
 const trail=freightBreadcrumbs(meta.path,locale);
 return <main id="main-content" className="country-editorial market-preparation new-market-page" data-country-cargo-planning={country} lang={locale==='zh'?'zh-CN':locale} dir={locale==='ar'?'rtl':'ltr'}><div className="mp-wrap">
 <nav className="mp-breadcrumb" aria-label={breadcrumbLabel(locale)} data-freight-breadcrumb>{trail.map((x,i)=><span key={x.path}>{i>0&&<span aria-hidden="true"> / </span>}{i===trail.length-1?<span aria-current="page">{x.name}</span>:<a href={x.path}>{x.name}</a>}</span>)}</nav>
 <header className="mp-hero"><div><p className="mp-kicker">{region} · <bdi dir="ltr">{m.port}</bdi></p><h1>{meta.title}</h1><h2>{c.heading}</h2><p className="mp-lede">{meta.description}</p><a className="mp-primary" {...quote}>{c.quote} ↗</a></div><figure className="mp-flow"><div className="new-market-origin"><span aria-hidden="true">01</span><h3>{c.origin}</h3></div><div className="mp-flow-line" aria-hidden="true">↓</div><div className="mp-hub"><span aria-hidden="true">02</span><h3>{c.gateway}</h3><p><bdi dir="ltr">{m.gateway}</bdi></p></div><div className="mp-flow-line" aria-hidden="true">↓</div><div className="mp-destination"><span aria-hidden="true">03</span><h3>{c.handover}</h3><p>{meta.name}</p></div><figcaption>{c.diagram}</figcaption></figure></header>
 <p className="mp-role">{c.roles}</p><CountryTransitPlanner country={country} locale={locale}/><p className="new-market-compare"><strong>{c.compare}</strong> {c.compareText}</p>
 {country==='senegal'&&<p className="new-market-compare">{senegalScopes[locale]}</p>}<FreightRatePreview context={country} locale={locale}/>
 <section className="mp-section"><h2>{c.arrival}</h2><p className="mp-lede">{c.arrivalText}</p><p>{c.boundary}</p><a {...quote}>{c.quote} ↗</a></section>
 <section className="mp-section"><h2>{c.brief}</h2><ul className="mp-checks">{[c.goods,c.packing,c.ready,c.receiver].map(x=><li key={x}>{x}</li>)}</ul><a className="mp-primary" {...quote}>{c.quote} ↗</a><p><a href={`${prefix}/sourcing-services/consolidation-export/`}>{c.exportLink} ↗</a></p></section>
 {['panama','costa-rica','spain','germany'].includes(country)&&<section className="mp-section"><h2>{procurementLinks[locale][0]}</h2><div className="new-market-product-links">{['commercial-kitchen-equipment','mobile-accessories','food-processing-machinery'].map((slug,i)=><a key={slug} href={`${prefix}/sourcing/${slug}-from-china/`}>{procurementLinks[locale][i+1]} ↗</a>)}</div></section>}
 <section className="mp-section mp-sources"><h2>{c.sources}</h2><a href={m.source} target="_blank" rel="noreferrer"><bdi dir="ltr">{m.gateway}</bdi> ↗</a><a href={`${prefix}/shipping-from-china-to-${m.region}/`}>{region} ↗</a></section>
 </div></main>;
}
