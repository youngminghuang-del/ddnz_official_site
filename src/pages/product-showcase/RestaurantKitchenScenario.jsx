import {packageAlternates} from '../../features/commercial-kitchen/packageLocalization';
import { allScenarios, libraryOrder } from '../../features/commercial-kitchen/data/restaurant-scenarios.mjs';
import { ArrowLeft, ArrowRight, Check, ClipboardList, Download, PlugZap, Ruler } from 'lucide-react';
import { Navigate, useParams } from 'react-router-dom';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import { PlanDrawing } from './RestaurantKitchenPackages';
import './restaurant-kitchen-packages.css';

const BASE = '/sourcing/restaurant-kitchen-packages-from-china';


function ZoneSequence({ zones }) {
  return <ol className="rkp-detail-zones">{zones.map((zone, index) => <li key={zone}><span>{String(index + 1).padStart(2, '0')}</span><strong>{zone}</strong></li>)}</ol>;
}

export default function RestaurantKitchenScenario() {
  const { scenarioSlug } = useParams();
  const scenario = allScenarios[scenarioSlug];
  if (!scenario) return <Navigate to={`${BASE}/`} replace />;
  const complete = Boolean(scenario.plan);
  const route = `${BASE}/${scenarioSlug}/`;
  const quote = `/get-a-quote/?leadGoal=Product+Sourcing&industry=Commercial+Kitchen+-+Restaurant+Package&projectNeed=${encodeURIComponent(scenario.tab)}&source=restaurant_kitchen_scenario`;

  return (
    <>
      <SEO title={`${scenario.tab} Kitchen Package from China | DDNZ`} description={`${scenario.tab} commercial kitchen planning brief with workflow, equipment groups, utilities and China sourcing handoff.`} canonicalPath={route} alternateUrls={packageAlternates(route.replace(/\/$/, ""))} contentLanguage="en" image={scenario.isometric || '/images/product-showcase/kitchen/kitchen-configuration-sanitized.webp'} />
      <SourcingHomepageNav quotePath={quote} />
      <main className="rkp-page rkp-detail" id="main-content" lang="en">
        <section className="rkp-detail-hero">
          <div>
            <a href={`${BASE}/#scenario-planner`}><ArrowLeft size={16} /> All kitchen scenarios</a>
            <p className="rkp-kicker">{scenario.status}</p>
            <h1>{scenario.tab} kitchen equipment package from China</h1>
            <p>Source a {scenario.tab.toLowerCase()} kitchen equipment package from China around your menu, floor plan and utility requirements. {scenario.title}</p>
            <div className="rkp-detail-metrics"><span><b>{scenario.footprint}</b> reference area</span><span><b>{scenario.aisle}</b> clearance basis</span><span><b>{scenario.crew}</b> opening crew</span></div>
          </div>
          {scenario.isometric ? <figure><img src={scenario.isometric} alt={`${scenario.tab} isometric planning concept`} /><figcaption>Generated planning visualization, not a site photograph</figcaption></figure> : <div className="rkp-detail-brief"><Ruler size={28} /><span>REFERENCE ENVELOPE</span><strong>{scenario.size}</strong><p>Send the actual lease drawing to convert this zoning brief into a dimensioned layout.</p></div>}
        </section>

        <section className="rkp-detail-workflow">
          <div><p className="rkp-kicker">OPERATING LOGIC</p><h2>The room sequence comes before the machine list.</h2><p>{scenario.summary}</p></div>
          <ZoneSequence zones={scenario.zones} />
        </section>

        {complete ? <section className="rkp-detail-plan"><div className="rkp-detail-heading"><p className="rkp-kicker">DIMENSIONED CONCEPT</p><h2>Equipment positions and three operating routes.</h2></div><PlanDrawing scenario={scenario} instance="detail" /></section> : null}

        <section className="rkp-detail-schedule">
          <div className="rkp-detail-heading"><p className="rkp-kicker">PACKAGE BASIS</p><h2>Core equipment groups and coordination points.</h2></div>
          <div className="rkp-detail-schedule-grid">
            <div className="rkp-detail-equipment"><header><ClipboardList size={19} /><strong>Equipment groups</strong></header>{scenario.equipment.map(([code, name, , note]) => <article key={code}><span>{code}</span><div><strong>{name}</strong><small>{note}</small></div></article>)}</div>
            <aside><header><PlugZap size={19} /><strong>Utility review</strong></header><ul>{scenario.utilities.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul><p>Final loads, connection points, fire, MEP and authority drawings require selected models, a measured site and local professional approval.</p></aside>
          </div>
        </section>

        <section className="rkp-detail-next">
          <div><p className="rkp-kicker">NEXT SCENARIO</p><h2>Continue through the planning library.</h2></div>
          <div className="rkp-detail-next-links">{libraryOrder.filter((slug) => slug !== scenarioSlug).slice(0, 3).map((slug) => <a href={`${BASE}/${slug}/`} key={slug}>{allScenarios[slug].tab}<ArrowRight size={16} /></a>)}</div>
          {complete ? <a className="rkp-primary" href={`${BASE}/#complete-plan`}>Unlock the 8-page plan PDF <Download size={17} /></a> : <a className="rkp-primary" href={quote}>Turn this brief into a plan <ArrowRight size={17} /></a>}
        </section>
      </main>
      <Footer quotePath={quote} pageKey={`restaurant_kitchen_${scenario.id}`} description={`${scenario.tab} kitchen planning and China equipment sourcing brief.`} pageLinks={[{ href: `${BASE}/`, label: 'All scenarios' }, { href: quote, label: 'Start a brief' }]} />
    </>
  );
}
