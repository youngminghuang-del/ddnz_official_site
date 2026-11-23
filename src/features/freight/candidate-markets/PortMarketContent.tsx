import {ClipboardList, Clock3, ReceiptText, ShieldCheck, Ship} from 'lucide-react';
import {CountryGatewayMap} from '../../../components/FreightRouteMap';
import {quoteLinkProps} from '../../../lib/quoteLinkPolicy.mjs';
import {candidateInfo, candidatePrefix, candidateTrail, sharedCopy, candidateLanguage, type CandidateLocale} from './model';
import {portMarketCopy, portMarketLabels, portMarkets, type PortMarketCountry} from './portMarkets';
import guide from './marketGuideCopy.json';
import scenarios from './quoteScenarioCopy.json';

const customsIcons = [ClipboardList, ReceiptText, ShieldCheck];

export function PortMarketContent({country, locale}: {country: PortMarketCountry; locale: CandidateLocale}) {
  const c = portMarketCopy[country][locale];
  const labels = portMarketLabels[locale];
  const market = portMarkets[country];
  const common = sharedCopy[locale];
  const scenario = scenarios[locale];
  const page = candidateInfo(country, locale);
  const prefix = candidatePrefix(locale);
  const currency = new Intl.NumberFormat(candidateLanguage(locale));
  const breadcrumb = candidateTrail(country, locale);
  const connection = country === 'morocco' ? portMarketCopy.morocco[locale].connection : null;
  const quote = (destinationText: string, notes: string, door = false) => {
    const params = new URLSearchParams({leadGoal: 'Freight Export', source: 'international_country', destinationText, notes});
    if (door && 'doorAssessment' in market) params.set('deliveryAssessment', '1');
    return quoteLinkProps(`${prefix}/get-a-quote/?${params}`);
  };

  return <main id="main-content" className="country-editorial gulf-page candidate-freight" lang={page.language} dir={locale === 'ar' ? 'rtl' : 'ltr'} data-country-cargo-planning={country}>
    <div className="gulf-wrap">
      <nav className="gulf-breadcrumb" aria-label={common.breadcrumb} data-freight-breadcrumb>
        {breadcrumb.map((item, i) => i === breadcrumb.length - 1
          ? <span key={item.path} aria-current="page">{item.name}</span>
          : <span key={item.path}><a href={item.path}>{item.name}</a><span aria-hidden="true"> / </span></span>)}
      </nav>
      <header className="gulf-hero">
        <div className="gulf-hero-copy" data-whatsapp-clear>
          <h1>{c.title}</h1>
          <p className="gulf-lede">{c.intro}</p>
          <div className="gulf-actions"><a className="gulf-cta" href="#cost-transit">{scenario.title} ↓</a></div>
        </div>
        <div className="candidate-hero-map" data-whatsapp-clear><CountryGatewayMap country={country} locale={locale} destination={c.name}/></div>
      </header>
      <nav className="gulf-chapters" aria-label={common.onPage}>
        <a href="#cost-transit">{guide[locale].costNav}</a>
        <a href="#import-rules">{guide[locale].rulesNav}</a>
        <a href="#factory-handoff">{common.documents}</a>
        <a href="#arrival">{common.arrivalLink}</a>
      </nav>
      <section className="gulf-section candidate-market-guide" id="cost-transit" aria-labelledby="cost-transit-title">
        <h2 id="cost-transit-title">{labels.rates}</h2>
        <div className="candidate-port-cards">
          {market.ports.map((port, i) => {
            const name = c.ports[i];
            const destination = `${c.name} · ${name}`;
            const routeNote = `${name} (${port.code})`;
            return <article key={port.code} data-port-rate={port.code}>
              <p className="candidate-policy-label"><bdi>{port.code}</bdi></p>
              <h3>{name}</h3>
              <dl>
                <div><dt><Clock3 size={18} aria-hidden="true"/>{labels.transit}</dt>
                  <dd><strong><bdi>{port.days}</bdi> {guide[locale].days}</strong>
                    <span><bdi>{port.shanghai ? labels.shanghai : labels.china}</bdi> · <bdi>{name}</bdi></span>
                    <a href={port.transitUrl}><bdi>{port.transitSource}</bdi> ↗</a></dd></div>
                <div><dt><Ship size={18} aria-hidden="true"/>{labels.rate}</dt>
                  <dd><strong><bdi>USD {currency.format(port.rate)}</bdi></strong><a href={port.rateUrl}>JHZ ↗</a></dd></div>
              </dl>
              <div className="candidate-port-actions">
                <a className="candidate-scenario-cta" data-port-quote={port.code} {...quote(destination, `${scenario.port} · ${routeNote}`)}>{scenario.portQuote} ↗</a>
                <a className="candidate-scenario-cta" data-door-quote={port.code} {...quote(`${c.name} · ${c.inland}`, `${scenario.door} · ${routeNote}\n${c.delivery}`, true)}>{scenario.doorQuote} ↗</a>
              </div>
            </article>;
          })}
        </div>
        <p className="candidate-market-sample">{labels.scope}{'transitBasis' in c && ` ${c.transitBasis}`}</p>
      </section>
      <section className="gulf-section candidate-market-guide" id="import-rules" aria-labelledby="import-rules-title">
        <h2 id="import-rules-title">{guide[locale].rulesTitle}</h2>
        <div className="candidate-policy-grid">{market.customsBadges.map((badge, i) => {
          const Icon = customsIcons[i];
          return <article key={badge}>
            <h3 className="candidate-policy-label"><Icon size={20} aria-hidden="true"/><bdi>{badge}</bdi></h3>
            <p>{c.customs[i]}</p>
          </article>;
        })}</div>
        <div className="candidate-port-actions">{market.authorities.map(({name, url}) => <a href={url} key={url}><bdi>{name}</bdi> ↗</a>)}</div>
      </section>
      <section className="gulf-section candidate-factory-panel" id="factory-handoff" aria-labelledby="factory-handoff-title">
        <div>
          <h2 id="factory-handoff-title">{c.factoryTitle}</h2>
          {c.factory.map(text => <p key={text}>{text}</p>)}
          <a className="candidate-scenario-cta" href={prefix + market.factoryPath}>{c.factoryLink} ↗</a>
        </div>
        <figure>
          <img {...market.photo} loading="lazy" decoding="async" alt={c.photo}/>
          <figcaption>{c.photo}</figcaption>
        </figure>
      </section>
      <section className="gulf-section candidate-final" id="arrival" aria-labelledby="arrival-title">
        <h2 id="arrival-title">{common.arrivalLink}</h2>
        <p>{c.delivery}</p>
        {connection && <p>{connection} <a href="https://www.cma-cgm.com/ebusiness/schedules/line-services/flyer/MPS?route=1"><bdi>CMA CGM · MPS</bdi> ↗</a></p>}
        <details className="candidate-scenario-details"><summary>{c.faq[0]}</summary><p>{c.faq[1]}</p></details>
        <p data-freight-provider>{common.providerBody}</p>
        <a className="gulf-cta" {...quote(c.name, c.intro)}>{common.ask} ↗</a>
      </section>
    </div>
  </main>;
}
