import { ArrowLeft, ArrowRight, Check, ClipboardList, Download, PlugZap, Ruler } from 'lucide-react';
import { Navigate, useParams } from 'react-router-dom';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import { PlanDrawing, scenarios } from './RestaurantKitchenPackages';
import './restaurant-kitchen-packages.css';

const BASE = '/sourcing/restaurant-kitchen-packages-from-china';

const expanded = {
  'bakery-pastry': {
    id: 'bakery', tab: 'Bakery + pastry', status: 'SCENARIO BRIEF', footprint: '80 sqm', size: '10,000 x 8,000 mm', aisle: '1,200 mm production aisle', crew: '6 to 10',
    title: 'Separate dough, heat and finishing so each batch moves forward once.',
    summary: 'Receiving feeds dry and cold storage, followed by mixing and make-up, proofing, baking, cooling and decoration. Wash returns on the service side without crossing finished goods.',
    zones: ['Receive + store', 'Mix + make-up', 'Proof', 'Bake', 'Cool + decorate', 'Display + dispatch', 'Wash'],
    equipment: [['E01', 'Spiral mixer', 'Dough volume sized to batch plan'], ['E02', 'Divider or sheeter', 'Selected by product range'], ['E03', 'Retarder proofer', 'Humidity and temperature basis'], ['E04', 'Deck or convection ovens', 'Fuel and throughput basis'], ['E05', 'Blast chiller', 'Cooling and food-safety basis'], ['E06', 'Stainless worktables', 'Make-up and finishing'], ['E07', 'Rack washer + sinks', 'Separate dirty return']],
    utilities: ['Three-phase oven and mixer loads', 'Proofing water and drainage review', 'Heat rejection and extraction basis', 'Rack clearances and door paths'],
  },
  'pizza-shop': {
    id: 'pizza', tab: 'Pizza shop', status: 'SCENARIO BRIEF', footprint: '72 sqm', size: '9,000 x 8,000 mm', aisle: '1,200 mm line aisle', crew: '5 to 9',
    title: 'Keep dough, topping, baking and pickup in one visible production rhythm.',
    summary: 'Cold holding and dough preparation sit behind the make line. The oven lands beside cut and box, while dish return reaches wash from the opposite side.',
    zones: ['Receive + cold', 'Dough prep', 'Proof + hold', 'Top line', 'Bake', 'Cut + box', 'Wash'],
    equipment: [['E01', 'Spiral mixer', 'Daily dough volume basis'], ['E02', 'Dough divider', 'Portion consistency'], ['E03', 'Refrigerated topping counter', 'Service line capacity'], ['E04', 'Deck or conveyor oven', 'Menu and output basis'], ['E05', 'Extraction system', 'Selected oven basis'], ['E06', 'Upright chiller', 'Dough and ingredient holding'], ['E07', 'Dishwasher + sinks', 'Separate dirty return']],
    utilities: ['Oven fuel and electrical policy', 'Extraction and replacement air review', 'Filtered water for dough production', 'Heat clearance and service access'],
  },
  'cloud-kitchen': {
    id: 'cloud', tab: 'Cloud kitchen', status: 'SCENARIO BRIEF', footprint: '150 sqm', size: '15,000 x 10,000 mm', aisle: '1,400 mm shared aisle', crew: '14 to 24',
    title: 'Share receiving, cold storage, washing and dispatch without mixing production pods.',
    summary: 'Three menu pods connect to common receiving, cold holding, warewashing and rider dispatch. Each pod keeps its own preparation and hot line so brands can operate independently.',
    zones: ['Receive + store', 'Shared cold', 'Pod A', 'Pod B', 'Pod C', 'Shared wash', 'Rider dispatch'],
    equipment: [['E01', 'Shared cold rooms', 'Combined inventory basis'], ['E02', 'Three prep modules', 'Separated by menu risk'], ['E03', 'Three hot-line modules', 'Independent cooking loads'], ['E04', 'Hot holding bank', 'Order consolidation'], ['E05', 'Extraction system', 'Zoned fan and duct basis'], ['E06', 'Central warewash', 'Peak return basis'], ['E07', 'Dispatch shelving', 'Courier collection zones']],
    utilities: ['Diversified three-phase load schedule', 'Zoned extraction and replacement air', 'Grease, drainage and hot-water basis', 'Fire separation and local code review'],
  },
};

const completeBySlug = Object.fromEntries(scenarios.map((scenario) => [scenario.slug, {
  ...scenario,
  status: 'COMPLETE CONCEPT + PDF',
  footprint: scenario.eyebrow.split(' / ')[0],
  size: `${scenario.plan.width} x ${scenario.plan.depth}`,
  aisle: scenario.plan.aisle,
  crew: scenario.facts[2][1],
  zones: scenario.plan.rooms.map((room) => room.label),
} ]));

const libraryOrder = ['takeaway-qsr', 'cafe-light-meals', 'casual-dining', 'bakery-pastry', 'pizza-shop', 'cloud-kitchen'];
const allScenarios = { ...completeBySlug, ...expanded };

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
      <SEO title={`${scenario.tab} Kitchen Package from China | DDNZ`} description={`${scenario.tab} commercial kitchen planning brief with workflow, equipment groups, utilities and China sourcing handoff.`} canonicalPath={route} contentLanguage="en" image={scenario.isometric || '/images/product-showcase/kitchen/kitchen-configuration-sanitized.webp'} />
      <SourcingHomepageNav quotePath={quote} />
      <main className="rkp-page rkp-detail" id="main-content" lang="en">
        <section className="rkp-detail-hero">
          <div>
            <a href={`${BASE}/#scenario-planner`}><ArrowLeft size={16} /> All kitchen scenarios</a>
            <p className="rkp-kicker">{scenario.status}</p>
            <h1>{scenario.tab} kitchen package</h1>
            <p>{scenario.title}</p>
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
