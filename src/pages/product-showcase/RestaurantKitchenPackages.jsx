import {packageAlternates} from '../../features/commercial-kitchen/packageLocalization';
import { useId, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BadgeDollarSign,
  Box,
  Building2,
  Check,
  ChefHat,
  ClipboardList,
  Coffee,
  Download,
  FilePenLine,
  Flame,
  Gauge,
  LockKeyhole,
  MailCheck,
  PackageCheck,
  PlugZap,
  RefreshCcw,
  Ruler,
  ShieldCheck,
  ShoppingBasket,
  Store,
  UsersRound,
  UtensilsCrossed,
  Warehouse,
  Waves,
} from 'lucide-react';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import { submitInquiry, validEmail } from '../../features/commercial-kitchen/data/inquiry.mjs';
import { trackEvent } from '../../lib/analytics';
import './restaurant-kitchen-packages.css';

const ROUTE = '/sourcing/restaurant-kitchen-packages-from-china/';
const QUOTE_BASE = '/get-a-quote/?leadGoal=Product+Sourcing&industry=Commercial+Kitchen+-+Restaurant+Package&projectNeed=Layout+and+equipment+package&source=restaurant_kitchen_packages';

import { scenarios } from '../../features/commercial-kitchen/data/restaurant-scenarios.mjs';
export { scenarios };

const buyerModes = [
  [ChefHat, 'Opening your first restaurant', 'Bring the menu, floor plan and destination. Receive one coordinated opening package.'],
  [Building2, 'Replicating 2 to 10 outlets', 'Standardize the equipment basis, utilities and substitutions before the next lease.'],
  [Warehouse, 'Selling equipment locally', 'Offer repeatable restaurant packages instead of quoting every machine from zero.'],
];

export function PlanDrawing({ scenario, instance = 'main' }) {
  const markerId = (kind) => `${scenario.id}-${instance}-${kind}`;
  return (
    <svg className={`rkp-plan-drawing rkp-plan-drawing--${scenario.id}`} viewBox="0 0 710 540" role="img" aria-labelledby={`${scenario.id}-${instance}-plan-title ${scenario.id}-${instance}-plan-desc`}>
      <title id={`${scenario.id}-${instance}-plan-title`}>{scenario.tab} concept kitchen plan</title>
      <desc id={`${scenario.id}-${instance}-plan-desc`}>A dimensioned plan showing equipment placement and separate food, staff and dirty ware routes.</desc>
      <defs>
        {['food', 'staff', 'ware'].map((kind) => (
          <marker id={markerId(kind)} key={kind} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L8,4 L0,8 Z" className={`rkp-arrow rkp-arrow--${kind}`} />
          </marker>
        ))}
        <pattern id={`${scenario.id}-${instance}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" className="rkp-plan-gridline" fill="none" />
        </pattern>
      </defs>

      <rect x="40" y="40" width="630" height="460" className="rkp-plan-paper" />
      <rect x="40" y="40" width="630" height="460" fill={`url(#${scenario.id}-${instance}-grid)`} />
      <line x1="52" y1="24" x2="650" y2="24" className="rkp-dimension-line" />
      <line x1="52" y1="17" x2="52" y2="32" className="rkp-dimension-line" />
      <line x1="650" y1="17" x2="650" y2="32" className="rkp-dimension-line" />
      <text x="351" y="18" textAnchor="middle" className="rkp-dimension-text">{scenario.plan.width}</text>
      <line x1="22" y1="56" x2="22" y2="486" className="rkp-dimension-line" />
      <line x1="15" y1="56" x2="30" y2="56" className="rkp-dimension-line" />
      <line x1="15" y1="486" x2="30" y2="486" className="rkp-dimension-line" />
      <text x="12" y="271" textAnchor="middle" className="rkp-dimension-text" transform="rotate(-90 12 271)">{scenario.plan.depth}</text>

      {scenario.plan.rooms.map((room) => (
        <g key={room.label}>
          <rect x={room.x} y={room.y} width={room.w} height={room.h} className="rkp-room" />
          <text x={room.x + 10} y={room.y + room.h - 10} className="rkp-room-label">{room.label}</text>
        </g>
      ))}

      {scenario.plan.equipment.map((item) => (
        <g key={`${item.code}-${item.x}`}>
          <rect x={item.x} y={item.y} width={item.w} height={item.h} rx="2" className="rkp-plan-equipment" />
          <text x={item.x + item.w / 2} y={item.y + item.h / 2 - 3} textAnchor="middle" className="rkp-equipment-code">{item.code}</text>
          <text x={item.x + item.w / 2} y={item.y + item.h / 2 + 11} textAnchor="middle" className="rkp-equipment-size">{item.label}</text>
        </g>
      ))}

      <rect x="278" y="292" width="150" height="52" rx="2" className="rkp-aisle" />
      <text x="353" y="315" textAnchor="middle" className="rkp-aisle-label">CLEAR WORKING ZONE</text>
      <text x="353" y="330" textAnchor="middle" className="rkp-aisle-size">{scenario.plan.aisle}</text>

      {scenario.plan.flows.map((flow) => (
        <g key={flow.kind}>
          <path d={flow.d} className={`rkp-flow-path rkp-flow-path--${flow.kind}`} markerEnd={`url(#${markerId(flow.kind)})`} />
          <text x={flow.kind === 'food' ? 52 : flow.kind === 'staff' ? 310 : 535} y={flow.kind === 'food' ? 520 : 520} className={`rkp-flow-label rkp-flow-label--${flow.kind}`}>{flow.label}</text>
        </g>
      ))}

      <path d="M40 72 L40 118" className="rkp-door-gap" />
      <text x="48" y="50" className="rkp-entry-label">{scenario.plan.entry}</text>
      <path d="M290 500 L475 500" className="rkp-service-opening" />
      <text x="382" y="535" textAnchor="middle" className="rkp-service-label">{scenario.plan.service}</text>
    </svg>
  );
}

function FloorPlan({ scenario }) {
  return (
    <div className="rkp-plan-shell">
      <div className="rkp-plan-meta">
        <span>CONCEPT PLAN / EQUIPMENT POSITIONS IN MILLIMETRES</span>
        <b>{scenario.plan.width} x {scenario.plan.depth}</b>
      </div>
      <PlanDrawing scenario={scenario} />
      <div className="rkp-flow-legend" aria-label="Plan route legend">
        <span className="is-food">Food and product route</span>
        <span className="is-staff">Staff working route</span>
        <span className="is-ware">Dirty ware route</span>
      </div>
      <p className="rkp-plan-note">Concept basis only. Final dimensions, clearances, utilities and authority drawings are validated against the actual site.</p>
    </div>
  );
}

function EquipmentVisuals({ scenario }) {
  return (
    <div className="rkp-equipment-visuals" aria-label={`${scenario.tab} core equipment examples`}>
      {scenario.products.map((product) => (
        <figure key={product.name}>
          <div><img src={product.image} alt={product.name} loading="lazy" /></div>
          <figcaption><strong>{product.name}</strong><span>{product.size}</span></figcaption>
        </figure>
      ))}
    </div>
  );
}

function PackageOptions({ packages }) {
  return (
    <div className="rkp-package-options">
      {packages.map(([name, copy], index) => (
        <article className={index === 1 ? 'is-featured' : ''} key={name}>
          <div><span>{String(index + 1).padStart(2, '0')}</span><h4>{name}</h4></div>
          <p>{copy}</p>
          {index === 1 ? <b>RECOMMENDED BASIS</b> : null}
        </article>
      ))}
    </div>
  );
}

const scenarioLibrary = [
  ['takeaway-qsr', 'Takeaway + QSR', '48 sqm', 'Complete concept and PDF'],
  ['cafe-light-meals', 'Cafe + light meals', '60 sqm', 'Complete concept and PDF'],
  ['casual-dining', 'Casual dining', '120 sqm', 'Complete concept and PDF'],
  ['bakery-pastry', 'Bakery + pastry', '80 sqm', 'Scenario brief'],
  ['pizza-shop', 'Pizza shop', '72 sqm', 'Scenario brief'],
  ['cloud-kitchen', 'Cloud kitchen', '150 sqm', 'Scenario brief'],
];

function ScenarioLibrary() {
  return (
    <section className="rkp-library" aria-labelledby="rkp-library-title">
      <div className="rkp-section-head">
        <div><p className="rkp-kicker">SIX OPERATING MODELS</p><h2 id="rkp-library-title">One decision page, separate working briefs.</h2></div>
        <p>Compare formats here, then open only the scenario that matches your menu, service model and floor area.</p>
      </div>
      <div className="rkp-library-grid">
        {scenarioLibrary.map(([slug, title, size, status], index) => (
          <a href={`${ROUTE}${slug}/`} key={slug}>
            <span>0{index + 1}</span>
            <div><h3>{title}</h3><p>{size} reference footprint</p></div>
            <div><small>{status}</small><ArrowRight size={17} /></div>
          </a>
        ))}
      </div>
    </section>
  );
}

function FourLayerEvidence({ scenario }) {
  return (
    <section className="rkp-evidence" id="evidence-chain" aria-labelledby="rkp-evidence-title">
      <div className="rkp-section-head">
        <div><h2 id="rkp-evidence-title">Four kinds of proof, kept clearly separate.</h2></div>
        <p>Follow one package from planning intent to equipment selection, production control and destination handling.</p>
      </div>
      <div className="rkp-evidence-key" aria-label="Evidence identity key">
        <span><b>Generated concept</b>Explains the intended layout</span>
        <span><b>DDNZ field record</b>Shows work actually performed</span>
        <span><b>Context reference</b>Shows use conditions, not a claimed project</span>
      </div>
      <div className="rkp-evidence-story">
        <article className="rkp-evidence-layer rkp-evidence-layer--scene">
          <header><span aria-hidden="true">01</span><div><b>Generated concept</b><h3>See the planned kitchen as one system.</h3><p>The isometric view follows the same zones, equipment line and service logic shown in the plan.</p></div></header>
          <figure>
            <img src={scenario.isometric} alt={`${scenario.tab} isometric kitchen concept`} loading="lazy" />
            <figcaption><strong>{scenario.tab} planning visualization</strong><span>Scenario-specific concept. Not a site photograph.</span></figcaption>
          </figure>
        </article>

        <article className="rkp-evidence-layer rkp-evidence-layer--equipment">
          <header><span aria-hidden="true">02</span><div><b>Package-specific products</b><h3>Match the drawing to actual equipment groups.</h3><p>These product references correspond to the equipment codes and nominal dimensions used in this scenario.</p></div></header>
          <EquipmentVisuals scenario={scenario} />
        </article>

        <article className="rkp-evidence-layer rkp-evidence-layer--field">
          <header><span aria-hidden="true">03</span><div><b>DDNZ field record</b><h3>Check configuration before export release.</h3><p>Factory review and loading records connect the selected package to real production and handling work.</p></div></header>
          <div className="rkp-evidence-media rkp-evidence-media--field">
            <figure>
              <img src="/images/product-showcase/kitchen/kitchen-factory-inspection-sanitized.webp" alt="Commercial kitchen equipment configuration review at a China production site" loading="lazy" />
              <figcaption><strong>Configuration review</strong><span>Real DDNZ field material at a China-origin production site.</span></figcaption>
            </figure>
            <figure>
              <img src="/images/operations/container-loading-forklift-wide-v1.webp" alt="Protected equipment packages being loaded into an export container" loading="lazy" />
              <figcaption><strong>Export loading record</strong><span>Protected packages and loading sequence documented before departure.</span></figcaption>
            </figure>
          </div>
        </article>

        <article className="rkp-evidence-layer rkp-evidence-layer--delivery">
          <header><span aria-hidden="true">04</span><div><b>Delivery record and context</b><h3>Separate destination proof from inspiration.</h3><p>The unloading clip is a real DDNZ shipment record. The operating kitchen shows the intended context only.</p></div></header>
          <div className="rkp-evidence-media rkp-evidence-media--delivery">
            <figure className="rkp-evidence-video">
              <video controls preload="metadata" poster="/images/restaurant-kitchen-packages/uae-delivery-proof-poster-v2.webp" playsInline aria-label="DDNZ kitchen equipment unloading record in the United Arab Emirates">
                <source src="/media/freight-20260919/uae-kitchen-unloading.mp4" type="video/mp4" />
              </video>
              <figcaption><strong>UAE destination handling</strong><span>Real DDNZ shipment unloading into storage.</span></figcaption>
            </figure>
            <figure>
              <img src="/images/product-showcase/kitchen/kitchen-operating-sanitized.webp" alt="Chefs working in a commercial kitchen used as an operating-context reference" loading="lazy" />
              <figcaption><strong>Operating context reference</strong><span>Reference only. This is not represented as a DDNZ installation case.</span></figcaption>
            </figure>
          </div>
        </article>
      </div>
    </section>
  );
}

const blankLead = {
  buyerType: '',
  country: '',
  projectStage: '',
  name: '',
  email: '',
  whatsapp: '',
  company: '',
  consent: false,
};

function planLeadPayload(lead, scenario) {
  return {
    name: lead.name.trim(),
    email: lead.email.trim(),
    subject: `Restaurant kitchen plan request: ${scenario.tab}`,
    message: [
      'DDNZ restaurant kitchen plan request',
      `Requested plan: ${scenario.tab}`,
      `Buyer type: ${lead.buyerType}`,
      `Destination market: ${lead.country.trim()}`,
      `Project stage: ${lead.projectStage}`,
      `Company or brand: ${lead.company.trim() || 'Not provided'}`,
      `WhatsApp or phone: ${lead.whatsapp.trim()}`,
      '',
      'The buyer requested the downloadable concept plan and agreed that DDNZ may contact them about this restaurant project.',
    ].join('\n'),
  };
}

function PlanDownloadGate({ scenario }) {
  const [lead, setLead] = useState(blankLead);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const submitting = useRef(false);
  const formId = useId();

  function update(key, value) {
    setLead((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    if (status === 'error') setStatus('idle');
  }

  function focusField(key) {
    window.setTimeout(() => document.getElementById(`${formId}-${key}`)?.focus(), 0);
  }

  function validateProject() {
    const next = {};
    if (!lead.buyerType) next.buyerType = 'Choose the option that best describes you.';
    if (!lead.country.trim()) next.country = 'Enter the country where the kitchen will operate.';
    if (!lead.projectStage) next.projectStage = 'Choose the current project stage.';
    setErrors(next);
    if (Object.keys(next).length) {
      focusField(Object.keys(next)[0]);
      return;
    }
    setStep(2);
    trackEvent('kitchen_plan_gate_step', { step: 2, scenario: scenario.id });
    focusField('name');
  }

  function validateContact() {
    const next = {};
    if (!lead.name.trim()) next.name = 'Enter your name.';
    if (!validEmail(lead.email)) next.email = 'Enter a valid business email address.';
    if (lead.whatsapp.replace(/\D/g, '').length < 7) next.whatsapp = 'Enter a valid WhatsApp or phone number with country code.';
    if (!lead.consent) next.consent = 'Confirm that DDNZ may contact you about this project.';
    return next;
  }

  async function submit(event) {
    event.preventDefault();
    if (step === 1) {
      validateProject();
      return;
    }
    if (submitting.current || status === 'success' || status === 'preview') return;
    const next = validateContact();
    setErrors(next);
    if (Object.keys(next).length) {
      focusField(Object.keys(next)[0] === 'consent' ? 'consent' : Object.keys(next)[0]);
      return;
    }
    submitting.current = true;
    setStatus('submitting');
    try {
      const result = await submitInquiry(planLeadPayload(lead, scenario));
      setStatus(result.mode === 'preview' ? 'preview' : 'success');
      trackEvent('kitchen_plan_gate_submit', { scenario: scenario.id, mode: result.mode });
    } catch {
      setStatus('error');
      trackEvent('kitchen_plan_gate_error', { scenario: scenario.id });
    } finally {
      submitting.current = false;
    }
  }

  const unlocked = status === 'success' || status === 'preview';
  return (
    <section className="rkp-download-gate" id="complete-plan" aria-labelledby="rkp-download-title">
      <div className="rkp-download-summary">
        <p className="rkp-download-label"><LockKeyhole size={16} /> QUALIFIED PROJECT DOWNLOAD</p>
        <h2 id="rkp-download-title">Get the complete {scenario.tab} plan.</h2>
        <p>Share a short project brief to unlock the PDF. DDNZ receives the same details, so the follow-up can start with your market, timeline and operating model.</p>
        <ul>
          <li><Check size={15} />Dimensioned concept layout and working routes</li>
          <li><Check size={15} />Equipment schedule, sizes and placement basis</li>
          <li><Check size={15} />Utility checkpoints and three package levels</li>
          <li><Check size={15} />Scope boundaries for local design and installation</li>
        </ul>
        <div className="rkp-selected-plan"><span>Selected plan</span><strong>{scenario.tab}</strong><small>{scenario.eyebrow}</small></div>
      </div>

      <div className="rkp-download-form-shell">
        {unlocked ? (
          <div className="rkp-download-success" role="status">
            <MailCheck size={34} />
            <span>PROJECT DETAILS RECEIVED</span>
            <h3>Your {scenario.tab} concept plan is ready.</h3>
            <p>The PDF is a planning basis. DDNZ will use your submitted details when following up with a matched equipment and sourcing review.</p>
            <a
              className="rkp-primary"
              href={scenario.download}
              download
              onClick={() => trackEvent('kitchen_plan_pdf_download', { scenario: scenario.id })}
            >
              Download the PDF <Download size={18} />
            </a>
            <a className="rkp-download-quote" href={`${QUOTE_BASE}&scenario=${encodeURIComponent(scenario.tab)}`}>Add drawings or request a matched quote <ArrowRight size={16} /></a>
          </div>
        ) : (
          <form className="rkp-download-form" noValidate onSubmit={submit}>
            <header>
              <span>STEP {step} OF 2</span>
              <strong>{step === 1 ? 'Your project' : 'Where to send the plan'}</strong>
              <small>About 60 seconds</small>
            </header>

            {step === 1 ? (
              <fieldset disabled={status === 'submitting'}>
                <label htmlFor={`${formId}-buyerType`}>
                  <span>You are *</span>
                  <select id={`${formId}-buyerType`} value={lead.buyerType} onChange={(event) => update('buyerType', event.target.value)} aria-invalid={!!errors.buyerType} aria-describedby={`${formId}-buyerType-error`}>
                    <option value="">Select one</option>
                    <option>Opening my first restaurant</option>
                    <option>Growing a restaurant brand</option>
                    <option>Equipment distributor or dealer</option>
                    <option>Consultant or kitchen contractor</option>
                  </select>
                  {errors.buyerType ? <small className="rkp-field-error" id={`${formId}-buyerType-error`}>{errors.buyerType}</small> : null}
                </label>
                <label htmlFor={`${formId}-country`}>
                  <span>Destination country *</span>
                  <input id={`${formId}-country`} value={lead.country} onChange={(event) => update('country', event.target.value)} maxLength={80} autoComplete="country-name" placeholder="e.g. United Arab Emirates" aria-invalid={!!errors.country} aria-describedby={`${formId}-country-error`} />
                  {errors.country ? <small className="rkp-field-error" id={`${formId}-country-error`}>{errors.country}</small> : null}
                </label>
                <label htmlFor={`${formId}-projectStage`}>
                  <span>Project stage *</span>
                  <select id={`${formId}-projectStage`} value={lead.projectStage} onChange={(event) => update('projectStage', event.target.value)} aria-invalid={!!errors.projectStage} aria-describedby={`${formId}-projectStage-error`}>
                    <option value="">Select one</option>
                    <option>Researching and budgeting</option>
                    <option>Opening within 3 months</option>
                    <option>Opening in 3 to 6 months</option>
                    <option>Opening in more than 6 months</option>
                    <option>Planning multiple outlets</option>
                  </select>
                  {errors.projectStage ? <small className="rkp-field-error" id={`${formId}-projectStage-error`}>{errors.projectStage}</small> : null}
                </label>
                <button className="rkp-primary rkp-form-next" type="button" onClick={validateProject}>Continue to contact details <ArrowRight size={18} /></button>
              </fieldset>
            ) : (
              <fieldset disabled={status === 'submitting'}>
                <label htmlFor={`${formId}-name`}>
                  <span>Your name *</span>
                  <input id={`${formId}-name`} value={lead.name} onChange={(event) => update('name', event.target.value)} maxLength={100} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={`${formId}-name-error`} />
                  {errors.name ? <small className="rkp-field-error" id={`${formId}-name-error`}>{errors.name}</small> : null}
                </label>
                <label htmlFor={`${formId}-email`}>
                  <span>Business email *</span>
                  <input id={`${formId}-email`} type="email" value={lead.email} onChange={(event) => update('email', event.target.value)} maxLength={254} autoComplete="email" inputMode="email" placeholder="name@company.com" aria-invalid={!!errors.email} aria-describedby={`${formId}-email-error`} />
                  {errors.email ? <small className="rkp-field-error" id={`${formId}-email-error`}>{errors.email}</small> : null}
                </label>
                <label htmlFor={`${formId}-whatsapp`}>
                  <span>WhatsApp or phone *</span>
                  <input id={`${formId}-whatsapp`} type="tel" value={lead.whatsapp} onChange={(event) => update('whatsapp', event.target.value)} maxLength={40} autoComplete="tel" inputMode="tel" placeholder="Include country code" aria-invalid={!!errors.whatsapp} aria-describedby={`${formId}-whatsapp-error`} />
                  {errors.whatsapp ? <small className="rkp-field-error" id={`${formId}-whatsapp-error`}>{errors.whatsapp}</small> : null}
                </label>
                <label htmlFor={`${formId}-company`}>
                  <span>Company or restaurant brand <small>Optional</small></span>
                  <input id={`${formId}-company`} value={lead.company} onChange={(event) => update('company', event.target.value)} maxLength={140} autoComplete="organization" />
                </label>
                <label className="rkp-consent" htmlFor={`${formId}-consent`}>
                  <input id={`${formId}-consent`} type="checkbox" checked={lead.consent} onChange={(event) => update('consent', event.target.checked)} aria-invalid={!!errors.consent} aria-describedby={`${formId}-consent-error`} />
                  <span>I agree that DDNZ may use these details to send the plan and contact me about this project.</span>
                </label>
                {errors.consent ? <small className="rkp-field-error" id={`${formId}-consent-error`}>{errors.consent}</small> : null}
                <div className="rkp-form-actions">
                  <button type="button" className="rkp-form-back" onClick={() => setStep(1)}>Back</button>
                  <button className="rkp-primary" type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? 'Preparing your plan...' : 'Unlock my complete plan'} <Download size={18} /></button>
                </div>
                {status === 'error' ? <p className="rkp-submit-error" role="alert">We could not confirm the request. Please try again, or use the matched quote link below.</p> : null}
              </fieldset>
            )}
            <p className="rkp-form-privacy"><ShieldCheck size={14} />Your details are used only to review this request and are not sold.</p>
          </form>
        )}
      </div>
    </section>
  );
}

export function RestaurantKitchenPackagesContent() {
  const [activeId, setActiveId] = useState('qsr');
  const scenario = useMemo(() => scenarios.find((item) => item.id === activeId) || scenarios[0], [activeId]);
  const quoteUrl = `${QUOTE_BASE}&scenario=${encodeURIComponent(scenario.tab)}`;

  return (
    <main className="rkp-page" id="main-content" lang="en">
      <section className="rkp-hero" aria-labelledby="rkp-title">
        <div className="rkp-hero-copy">
          <p className="rkp-kicker">FOR FOUNDERS, GROWING RESTAURANT BRANDS AND DISTRIBUTORS</p>
          <h1 id="rkp-title">Plan the kitchen. Buy from China.</h1>
          <p>DDNZ combines layout, equipment and export handoff, with sample China baskets near one-third of local marketplace list prices.</p>
          <div className="rkp-hero-actions">
            <a className="rkp-primary" href="#scenario-planner">Choose your restaurant format <ArrowRight size={18} /></a>
            <a className="rkp-secondary" href={quoteUrl}>Request a matched package</a>
          </div>
        </div>
        <div className="rkp-hero-visual">
          <div className="rkp-hero-plan-head"><span>48 SQM TAKEAWAY KITCHEN</span><b>DIMENSIONED CONCEPT</b></div>
          <PlanDrawing scenario={scenarios[0]} instance="hero" />
          <div className="rkp-hero-plan-foot"><span><Ruler size={16} /> Equipment sizes shown</span><span><Gauge size={16} /> Three flows separated</span><strong>Layout + equipment schedule</strong></div>
        </div>
      </section>

      <section className="rkp-buyer-strip" aria-labelledby="rkp-buyers-title">
        <div className="rkp-strip-heading"><h2 id="rkp-buyers-title">Buy a working restaurant package, not seven disconnected machines.</h2></div>
        <div className="rkp-buyer-list">
          {buyerModes.map(([Icon, title, copy], index) => (
            <article key={title}><span>0{index + 1}</span><Icon size={23} /><div><h3>{title}</h3><p>{copy}</p></div></article>
          ))}
        </div>
      </section>

      <section className="rkp-scenarios" id="scenario-planner" aria-labelledby="rkp-scenarios-title">
        <div className="rkp-section-head">
          <div><p className="rkp-kicker">SCENARIO PLANNER</p><h2 id="rkp-scenarios-title">Choose the operating model before choosing machines.</h2></div>
          <p>Each concept starts with flow, peak demand and utilities. The list changes only after those inputs are clear.</p>
        </div>
        <div className="rkp-tabs" role="tablist" aria-label="Restaurant kitchen scenarios">
          {scenarios.map((item) => {
            const Icon = item.icon;
            return <button id={`rkp-tab-${item.id}`} key={item.id} type="button" role="tab" aria-selected={activeId === item.id} aria-controls="rkp-scenario-panel" onClick={() => setActiveId(item.id)}><Icon size={18} /><span>{item.tab}</span><small>{item.eyebrow.split(' / ')[0]}</small></button>;
          })}
        </div>
        <div className="rkp-scenario-panel" id="rkp-scenario-panel" role="tabpanel" aria-labelledby={`rkp-tab-${scenario.id}`}>
          <div className="rkp-scenario-intro">
            <div><p>{scenario.eyebrow}</p><h3>{scenario.title}</h3><span>{scenario.summary}</span><dl>{scenario.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>
            <EquipmentVisuals scenario={scenario} />
          </div>
          <div className="rkp-plan-grid">
            <FloorPlan scenario={scenario} />
            <div className="rkp-equipment-schedule">
              <div className="rkp-panel-label"><ClipboardList size={19} /><span>EQUIPMENT SCHEDULE</span><b>7 CORE GROUPS</b></div>
              <ol>{scenario.equipment.map(([number, name, size, note]) => <li key={number}><span>{number}</span><div><strong>{name}</strong><small>{size} mm / {note}</small></div></li>)}</ol>
            </div>
          </div>
          <div className="rkp-utilities">
            <div><PlugZap size={21} /><strong>Utility checkpoints</strong></div>
            <ul>{scenario.utilities.map((item) => <li key={item}><Check size={14} />{item}</li>)}</ul>
          </div>
          <PackageOptions packages={scenario.packages} />
          <div className="rkp-plan-download-prompt"><div><LockKeyhole size={18} /><span><strong>Need the complete working document?</strong><small>Unlock the dimensioned plan, schedule, utilities and package basis.</small></span></div><a href="#complete-plan">Get the full plan PDF <Download size={16} /></a></div>
        </div>
      </section>

      <ScenarioLibrary />

      <PlanDownloadGate scenario={scenario} />

      <FourLayerEvidence scenario={scenario} />

      <section className="rkp-cost" id="cost-benchmark" aria-labelledby="rkp-cost-title">
        <div className="rkp-cost-copy">
          <h2 id="rkp-cost-title">Compare the same equipment basket, not two headline totals.</h2>
          <p>The module is designed for public Amazon, Noon, Jumia or Mercado Libre list prices, matched against a DDNZ China equipment reference for the same functional package.</p>
          <ul>
            <li><ShoppingBasket size={18} />Same equipment groups and quantities</li>
            <li><Gauge size={18} />Capacity and utility assumptions shown</li>
            <li><RefreshCcw size={18} />Market, capture date and source links updated together</li>
          </ul>
          <a href={quoteUrl}>Request a comparison for your market <ArrowRight size={17} /></a>
        </div>
        <div className="rkp-cost-board">
          <header><div><span>EXAMPLE DATA SLOT</span><strong>{scenario.tab} equipment basket</strong></div><b>UAE / USD / SAMPLE</b></header>
          <div className="rkp-cost-figures">
            <article><span>Observed local marketplace basket</span><strong>{scenario.benchmark.local}</strong><small>Public list-price reference</small></article>
            <article className="is-ddnz"><span>DDNZ China equipment reference</span><strong>{scenario.benchmark.ddnz}</strong><small>Matched equipment scope</small></article>
          </div>
          <div className="rkp-cost-ratio"><BadgeDollarSign size={25} /><div><span>Indicative equipment ratio</span><strong>{scenario.benchmark.ratio} of the sample local basket</strong></div></div>
          <p><ShieldCheck size={15} /> Illustrative ranges for page development only. Replace with dated public listing captures before publication.</p>
          <dl><div><dt>Included</dt><dd>Listed equipment and standard accessories</dd></div><div><dt>Not included</dt><dd>Freight, duty, tax, installation, local approvals and site works</dd></div></dl>
        </div>
      </section>

      <section className="rkp-delivery" aria-labelledby="rkp-delivery-title">
        <div className="rkp-section-head">
          <div><h2 id="rkp-delivery-title">DDNZ keeps the plan, products and release basis connected.</h2></div>
          <p>Local specialists still complete regulated drawings, permits and installation. The equipment basis stays controlled across that handoff.</p>
        </div>
        <div className="rkp-delivery-sequence">
          {[
            [FilePenLine, '01', 'Operating brief', 'Menu, capacity, service model, site and budget basis.'],
            [Ruler, '02', 'Concept layout', 'Zones, workflow, equipment positions and connection points.'],
            [Box, '03', 'Equipment package', 'Comparable models, options, schedule and supplier quotes.'],
            [PackageCheck, '04', 'QC + export release', 'Approved identity, checks, packing records and freight handoff.'],
          ].map(([Icon, number, title, copy]) => <article key={title}><span>{number}</span><Icon size={24} /><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
        <div className="rkp-responsibility">
          <article><Store size={23} /><div><h3>DDNZ scope</h3><p>Concept layout, equipment schedule, China supplier comparison, order control, inspection and export coordination.</p></div></article>
          <article><UsersRound size={23} /><div><h3>Local professional scope</h3><p>Code adaptation, authority submissions, licensed MEP, fire and structural work, permits and site installation.</p></div></article>
          <article><Waves size={23} /><div><h3>Freight execution</h3><p>International freight is executed by Heaven Born after the equipment package is approved for release.</p></div></article>
        </div>
      </section>

      <section className="rkp-final-cta" aria-labelledby="rkp-cta-title">
        <div><h2 id="rkp-cta-title">A menu, a floor area and a destination are enough for the first review.</h2></div>
        <div><a className="rkp-primary" href="#complete-plan">Unlock the complete plan <Download size={18} /></a><a href={quoteUrl}>Build a matched kitchen brief</a></div>
      </section>
    </main>
  );
}

export default function RestaurantKitchenPackages() {
  return (
    <>
      <SEO
        title="Restaurant Kitchen Packages from China | Layout + Equipment | DDNZ"
        description="Plan a quick-service, cafe or casual-dining kitchen with DDNZ layout design, coordinated China equipment sourcing, QC and export handoff."
        keywords="restaurant kitchen package China, commercial kitchen layout, restaurant equipment package, cafe equipment sourcing China"
        canonicalPath={ROUTE} alternateUrls={packageAlternates(ROUTE.replace(/\/$/, ""))}
        contentLanguage="en"
        image="/images/product-showcase/kitchen/kitchen-operating-sanitized.webp"
      />
      <SourcingHomepageNav quotePath={QUOTE_BASE} />
      <RestaurantKitchenPackagesContent />
      <Footer
        quotePath={QUOTE_BASE}
        pageKey="restaurant_kitchen_packages"
        description="Restaurant kitchen layout, equipment package, China sourcing control and export handoff."
        pageLinks={[
          { href: '#scenario-planner', label: 'Kitchen plans' },
          { href: '#cost-benchmark', label: 'Cost benchmark' },
          { href: QUOTE_BASE, label: 'Start a brief' },
        ]}
      />
    </>
  );
}
