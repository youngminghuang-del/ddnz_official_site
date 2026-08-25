import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Box,
  Check,
  CheckCircle2,
  ChefHat,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  CookingPot,
  Factory,
  FileCheck2,
  Flame,
  Gauge,
  Globe2,
  LockKeyhole,
  Menu,
  PackageCheck,
  PlugZap,
  RefreshCcw,
  Ruler,
  SearchCheck,
  Settings2,
  ShieldCheck,
  Ship,
  Snowflake,
  Thermometer,
  Truck,
  UtensilsCrossed,
  Wrench,
  X,
} from "lucide-react";
import "./kitchen.css";
import "./mobile-readability.css";
import ShowcaseSEO from "./ShowcaseSEO";
import ShowcaseContactFooter from "./ShowcaseContactFooter";
import SourcingHomepageNav from "../../components/SourcingHomepageNav";

const heroSteps = [
  { number: "01", title: "Define range", copy: "Requirements, use cases and target markets.", icon: ClipboardList },
  { number: "02", title: "Lock configuration", copy: "Equipment specs, options and bill of materials.", icon: Settings2 },
  { number: "03", title: "Verify evidence", copy: "Factory inspection, test evidence and comparison.", icon: ShieldCheck },
  { number: "04", title: "Consolidate & export", copy: "Packing, documents and export handoff.", icon: PackageCheck },
];

const categories = [
  {
    id: "cooking",
    short: "Cooking line",
    title: "Commercial cooking & thermal equipment",
    copy: "Build the line around menu output, utility conditions, peak load and the operator workflow—not a catalogue page.",
    image: "/images/product-showcase/kitchen/kitchen-product-range-sanitized.webp",
    alt: "Unbranded stainless commercial cooking line in an equipment showroom",
    products: ["Ranges & fryers", "Combi ovens", "Griddles & grills", "Heated holding"],
    checks: ["Energy source and local utility", "Hourly output and recovery time", "Ventilation and installation clearances", "Cleaning access and service parts"],
  },
  {
    id: "refrigeration",
    short: "Cold-side",
    title: "Refrigeration, ice & display",
    copy: "Compare cooling performance using the destination climate, merchandising format and service environment as part of the brief.",
    image: "/images/product-showcase/kitchen/kitchen-refrigeration-sanitized.webp",
    alt: "Unbranded commercial refrigeration and display cabinets in a showroom",
    products: ["Upright refrigeration", "Prep counters", "Display cabinets", "Ice machines"],
    checks: ["Ambient temperature and humidity", "Refrigerant and electrical standard", "Usable volume versus catalogue volume", "Door, compressor and spare-part access"],
  },
  {
    id: "prep",
    short: "Prep & wash",
    title: "Food preparation & warewashing",
    copy: "Motor load, bowl or chamber capacity, duty cycle and clean-down requirements determine whether a lower quote is actually comparable.",
    image: "/images/product-showcase/kitchen/kitchen-mixers-sanitized.webp",
    alt: "Unbranded commercial mixers in a kitchen-equipment showroom",
    products: ["Planetary mixers", "Dough mixers", "Food processors", "Warewashing"],
    checks: ["Batch size and duty cycle", "Motor rating and power standard", "Food-contact material specification", "Consumables, tools and spares"],
  },
  {
    id: "bakery",
    short: "Bakery & display",
    title: "Bakery, ovens & front-of-house display",
    copy: "Configuration, tray format, temperature uniformity and merchandising details are locked before samples or purchase orders move forward.",
    image: "/images/product-showcase/kitchen/kitchen-configuration-sanitized.webp",
    alt: "Unbranded commercial ovens and bakery equipment in a showroom",
    products: ["Deck & rack ovens", "Proofers", "Convection ovens", "Display equipment"],
    checks: ["Tray and rack compatibility", "Temperature range and uniformity", "Steam, exhaust and drainage needs", "Finish, glazing and retail presentation"],
  },
];

const controlPlan = [
  { number: "01", label: "Scope", title: "Turn the buying idea into a comparable brief", copy: "We define use case, output, utilities, dimensions, destination standards, budget signals and the evidence needed before release.", output: "Recorded output: requirement matrix", icon: ClipboardCheck },
  { number: "02", label: "Compare", title: "Normalize offers before judging price", copy: "Supplier offers are aligned by configuration, included accessories, material claims, warranty terms, packing and commercial exclusions.", output: "Recorded output: comparable offer table", icon: SearchCheck },
  { number: "03", label: "Verify", title: "Lock samples, specifications and acceptance points", copy: "The chosen configuration is tied to photos, model details, approved finishes, key components and order-specific inspection points.", output: "Recorded output: approved specification record", icon: FileCheck2 },
  { number: "04", label: "Release", title: "Document QC, packing and export handoff", copy: "Production evidence, quantity checks, packing marks, document readiness and consolidation status are recorded before freight execution.", output: "Recorded output: release and handoff file", icon: Ship },
];

const evidenceRows = [
  ["Delivery", "Required date, capacity and recovery plan", "Late-delivery risk visible"],
  ["Quality", "Material, function and model-level checks", "Failures cannot hide in averages"],
  ["Service", "Response, parts and corrective-action record", "Repeat issues trigger review"],
  ["Cost", "Comparable configuration and exclusions", "Low quote stays comparable"],
];

const menuItems = {
  products: [
    ["Commercial kitchen", "#range"],
    ["Audio & speakers", "#range"],
    ["Mobile accessories", "#range"],
    ["Outdoor products", "#range"],
  ],
  kitchen: [
    ["Cooking equipment", "#range"],
    ["Refrigeration & ice", "#range"],
    ["Food preparation", "#range"],
    ["Bakery & display", "#range"],
  ],
  resources: [
    ["Buyer control plan", "#control-plan"],
    ["Supplier scoring", "#evidence"],
    ["Inspection evidence", "#evidence"],
    ["China sourcing insights", "#about"],
  ],
};

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="DDNZ Global home">
      <img src="/images/product-showcase/common/ddnz-global-mark.webp" alt="" />
      <span className="brand-copy"><strong>DDNZ GLOBAL</strong><small>CHINA SOURCING &amp; EXPORT</small></span>
    </a>
  );
}

function NavMenu({ id, label, openMenu, setOpenMenu }) {
  const open = openMenu === id;
  return (
    <div className="nav-menu-wrap">
      <button className="nav-item" aria-expanded={open} onClick={() => setOpenMenu(open ? null : id)}>{label} <ChevronDown size={15} /></button>
      {open && <div className="nav-popover">{menuItems[id].map(([item, href]) => <a href={href} key={item} onClick={() => setOpenMenu(null)}>{item}</a>)}</div>}
    </div>
  );
}

function BuyerBrief({ onClose }) {
  const [sent, setSent] = useState(false);
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="brief-modal" role="dialog" aria-modal="true" aria-labelledby="brief-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="icon-button close-button" onClick={onClose} aria-label="Close request form"><X size={20} /></button>
        {sent ? (
          <div className="success-state">
            <span className="success-icon"><Check size={24} /></span><p className="eyebrow">REQUEST CAPTURED</p>
            <h2 id="brief-title">Your product scope is ready for review.</h2>
            <p>This preview shows the intended conversion flow. No information has been submitted.</p>
            <button className="primary-button" onClick={onClose}>Return to preview</button>
          </div>
        ) : (
          <><p className="eyebrow">COMMERCIAL KITCHEN BRIEF</p><h2 id="brief-title">Tell us what you need to source.</h2>
            <p className="modal-intro">Start with the equipment, destination and order stage. Exact specifications can follow.</p>
            <form onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
              <label>Equipment or project scope<textarea required placeholder="e.g. cooking line, combi ovens and refrigerated prep counters" /></label>
              <div className="field-row"><label>Destination market<input required placeholder="Country or city" /></label><label>Order stage<select defaultValue="Comparing suppliers"><option>Comparing suppliers</option><option>Sample or specification stage</option><option>Existing purchase order</option></select></label></div>
              <button className="primary-button form-submit" type="submit">Continue brief <ArrowRight size={17} /></button>
            </form></>
        )}
      </section>
    </div>
  );
}

function InlineBrief() {
  const [sent, setSent] = useState(false);
  if (sent) return <div className="inline-success" role="status"><span className="success-icon"><Check size={24} /></span><div><p className="eyebrow">SCOPE READY</p><h3>Your brief is ready for a DDNZ review.</h3><p>Preview only—no information has been submitted.</p></div><button className="quiet-button" onClick={() => setSent(false)}>Edit scope</button></div>;
  return (
    <form className="inline-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
      <label>Product scope<input required placeholder="Equipment, quantities or project type" /></label>
      <label>Destination<input required placeholder="Country or city" /></label>
      <label>Buying stage<select defaultValue="Supplier comparison"><option>Supplier comparison</option><option>Specification / sample</option><option>Existing order</option></select></label>
      <button className="primary-button" type="submit">Start the brief <ArrowRight size={17} /></button>
    </form>
  );
}

const KITCHEN_ASSETS = "/images/product-showcase/kitchen";
const BRAND_ASSET = "/images/product-showcase/common/ddnz-global-mark.webp";

const equipmentFamilies = [
  {
    name: "Cooking line",
    promise: "Output built around the menu.",
    image: `${KITCHEN_ASSETS}/kitchen-product-range-sanitized.webp`,
    imageAlt: "Unbranded stainless commercial ranges, fryers and griddles in an equipment showroom",
    imageSize: [900, 1124],
    imagePosition: "50% 47%",
    imageLabel: "THERMAL LINE",
    icon: Flame,
    products: ["Ranges & fryers", "Griddles & grills", "Combi ovens", "Heated holding"],
    question: "Can the line sustain peak output with the site’s actual gas, electrical and extraction conditions?",
    specs: ["Menu and hourly output", "Gas or electrical load", "Recovery time", "Ventilation clearances"],
  },
  {
    name: "Cold-side",
    promise: "Cooling matched to climate and service.",
    image: `${KITCHEN_ASSETS}/kitchen-refrigeration-sanitized.webp`,
    imageAlt: "Unbranded upright and display refrigeration cabinets in a commercial equipment showroom",
    imageSize: [1445, 1088],
    imagePosition: "58% 50%",
    imageLabel: "REFRIGERATION RANGE",
    icon: Snowflake,
    products: ["Upright cabinets", "Prep counters", "Display cases", "Ice machines"],
    question: "Will the selected cooling system perform in the destination ambient and remain serviceable locally?",
    specs: ["Ambient class", "Refrigerant", "Usable volume", "Compressor and parts access"],
  },
  {
    name: "Prep & wash",
    promise: "Capacity sized to the duty cycle.",
    image: `${KITCHEN_ASSETS}/kitchen-mixers-sanitized.webp`,
    imageAlt: "A range of unbranded commercial spiral and planetary mixers in a kitchen equipment showroom",
    imageSize: [1448, 1086],
    imagePosition: "47% 52%",
    imageLabel: "PREPARATION RANGE",
    icon: CookingPot,
    products: ["Planetary mixers", "Dough mixers", "Food processors", "Warewashing"],
    question: "Are batch size, motor load, wash cycle and clean-down needs comparable across supplier offers?",
    specs: ["Batch or rack capacity", "Motor and pump rating", "Duty cycle", "Food-contact materials"],
  },
  {
    name: "Bakery & display",
    promise: "Bake and display formats locked together.",
    image: `${KITCHEN_ASSETS}/kitchen-configuration-sanitized.webp`,
    imageAlt: "Unbranded deck, rack and convection ovens displayed in a commercial equipment showroom",
    imageSize: [900, 1500],
    imagePosition: "50% 37%",
    imageLabel: "OVEN CONFIGURATION",
    icon: ChefHat,
    products: ["Deck & rack ovens", "Proofers", "Convection ovens", "Display equipment"],
    question: "Do tray format, steam, exhaust and temperature uniformity match the production plan?",
    specs: ["Tray and rack format", "Temperature uniformity", "Steam and drainage", "Finish and glazing"],
  },
];

const kitchenProcessSteps = [
  [ClipboardCheck, "Business & operating brief", "Concept, menu, channel, site conditions and peak output."],
  [Ruler, "Design & line plan", "Workflow, zoning, equipment mix, utilities and dimensions."],
  [SearchCheck, "Like-for-like quotes", "Comparable specifications, terms and exclusions."],
  [PackageCheck, "Approved release", "Inspection evidence, pack-out and freight handoff."],
];

const configurationSteps = [
  [UtensilsCrossed, "Menu & service model", "Menu mix, channel, dayparts and peak rhythm."],
  [Gauge, "Demand & labour", "Peak covers, batch size, recovery and staffing pattern."],
  [Ruler, "Flow, zoning & services", "Food, people, ware, waste and connection points."],
  [FileCheck2, "Approved design basis", "Plan, models, utilities, options and acceptance points."],
];

const kitchenDesignStages = [
  [ClipboardCheck, "Business model", "Concept, menu, channel, dayparts and growth plan."],
  [Gauge, "Operating demand", "Peak load, order mix, labour pattern, timing and recovery."],
  [Ruler, "Flow & space", "Food, people, ware and waste movements define the adjacencies."],
  [Settings2, "Equipment system", "Capacity, utilities, interfaces and service access become one coordinated line."],
];

const kitchenControlPoints = [
  [Gauge, "Output & recovery", "Capacity is checked against the operating brief, not only the catalogue rating."],
  [UtensilsCrossed, "Operator & product flow", "Work sequence, hand-offs and travel paths are reviewed around the service rhythm."],
  [PlugZap, "Utility compatibility", "Voltage, phase, gas type and connection load stay in the approved specification."],
  [ShieldCheck, "Hygienic flow & clean-down", "Raw, ready-to-serve, ware and waste paths inform zoning and accessible cleaning points."],
  [RefreshCcw, "Adaptability & service", "Modularity, cleaning access, wear parts and core components support controlled future change."],
  [Box, "Packing & installation", "Packed dimensions, loose accessories and installation documents are quantity-checked."],
];

const kitchenSupplierRows = [
  ["Supplier A", "Preferred", "Verified", "Pass", "Confirmed", "Responsive"],
  ["Supplier B", "Qualified", "Verified", "Open item", "Confirmed", "Responsive"],
  ["Supplier C", "Review", "Partial", "Pass", "At risk", "Responsive"],
  ["Supplier D", "Hold", "Unverified", "Open item", "At risk", "Slow"],
];

function KitchenBrand() {
  return (
    <a className="k-brand" href="#top" aria-label="DDNZ Global home">
      <img src={BRAND_ASSET} width="256" height="228" alt="" />
      <span><strong>DDNZ GLOBAL</strong><small>CHINA SOURCING &amp; EXPORT</small></span>
    </a>
  );
}

function KitchenHeader({ open, setOpen }) {
  return (
    <header className="k-header">
      <KitchenBrand />
      <nav className="k-desktop-nav" aria-label="Primary navigation">
        <a href="#families">Product Sourcing <ChevronDown size={14} /></a>
        <a className="active" href="#top" aria-current="page">Commercial Kitchen <ChevronDown size={14} /></a>
        <a href="#design">Kitchen Design</a>
        <a href="#control">Our Control Plan</a>
        <a href="#evidence">Resources <ChevronDown size={14} /></a>
      </nav>
      <button className="k-menu-button" type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-controls="k-mobile-nav" aria-label="Toggle navigation">
        {open ? <X size={23} /> : <Menu size={23} />}
      </button>
      {open && (
        <nav className="k-mobile-nav" id="k-mobile-nav" aria-label="Mobile navigation">
          <a href="#design" onClick={() => setOpen(false)}>Kitchen design approach</a>
          <a href="#families" onClick={() => setOpen(false)}>Equipment families</a>
          <a href="#control" onClick={() => setOpen(false)}>Control plan</a>
          <a href="#evidence" onClick={() => setOpen(false)}>Approval evidence</a>
          <a href="#rfq" onClick={() => setOpen(false)}>Start a request</a>
        </nav>
      )}
    </header>
  );
}

function KitchenEquipmentCard({ item, index, technical }) {
  const Icon = item.icon;
  return (
    <article className="k-family-card">
      <span className="k-card-index">0{index + 1}</span>
      <div className="k-family-title">
        <span><Icon size={20} /></span>
        <div><h3>{item.name}</h3><p>{item.promise}</p></div>
      </div>
      <figure className="k-family-image">
        <img src={item.image} alt={item.imageAlt} width={item.imageSize[0]} height={item.imageSize[1]} loading="lazy" decoding="async" style={{ objectPosition: item.imagePosition }} />
        <figcaption>{item.imageLabel}</figcaption>
      </figure>
      {technical ? (
        <ul className="k-spec-list">{item.specs.map((spec) => <li key={spec}><Check size={14} />{spec}</li>)}</ul>
      ) : (
        <>
          <p className="k-buying-question"><strong>Primary buying question</strong>{item.question}</p>
          <div className="k-product-list">{item.products.map((product) => <span key={product}>{product}</span>)}</div>
        </>
      )}
    </article>
  );
}

function KitchenScoreModal({ close }) {
  useEffect(() => {
    const onKeyDown = (event) => event.key === "Escape" && close();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close]);

  return (
    <div className="k-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <section className="k-score-modal" role="dialog" aria-modal="true" aria-labelledby="score-title">
        <button className="k-modal-close" type="button" onClick={close} aria-label="Close scoring method" autoFocus><X size={20} /></button>
        <p className="k-kicker">SUPPLIER SCORING METHOD</p>
        <h2 id="score-title">Weights structure the comparison. Veto gates protect the decision.</h2>
        <div className="k-method-grid">
          <article><span>30 PTS</span><h3>Delivery readiness</h3><p>Capacity, lead-time evidence and recovery planning for the required delivery window.</p></article>
          <article><span>40 PTS</span><h3>Quality capability</h3><p>Material control, functional checks, batch consistency and corrective-action evidence.</p></article>
          <article><span>15 PTS</span><h3>Service coordination</h3><p>Specification discipline, issue response, spare-parts support and communication.</p></article>
          <article><span>15 PTS</span><h3>Cost performance</h3><p>Comparable configuration, stated exclusions, packing and landed-cost implications.</p></article>
        </div>
        <div className="k-veto-list"><strong>Veto gates</strong><span>Unverified factory identity</span><span>Unresolved compliance gap</span><span>Approval evidence failed</span><span>Repeated delivery or quality failure</span></div>
        <button className="k-primary" type="button" onClick={() => { close(); document.getElementById("rfq")?.scrollIntoView({ behavior: "smooth" }); }}>Use this method for my project <ArrowRight size={17} /></button>
      </section>
    </div>
  );
}

function LegacyKitchenPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <div className="site-shell" id="top" onClick={(event) => { if (!event.target.closest(".nav-menu-wrap")) setOpenMenu(null); }}>
      <header className="site-header">
        <Brand />
        <nav className="desktop-nav" aria-label="Primary navigation">
          <NavMenu id="products" label="Product Sourcing" openMenu={openMenu} setOpenMenu={setOpenMenu} />
          <NavMenu id="kitchen" label="Commercial Kitchen" openMenu={openMenu} setOpenMenu={setOpenMenu} />
          <a className="nav-item" href="#control-plan">Our Control Plan</a>
          <NavMenu id="resources" label="Resources" openMenu={openMenu} setOpenMenu={setOpenMenu} />
          <a className="nav-item" href="#about">About DDNZ</a>
        </nav>
        <button className="icon-button menu-button" onClick={() => setMobileOpen((value) => !value)} aria-expanded={mobileOpen} aria-label="Toggle navigation">{mobileOpen ? <X size={24} /> : <Menu size={24} />}</button>
      </header>

      {mobileOpen && <nav className="mobile-nav" aria-label="Mobile navigation"><a href="#range" onClick={() => setMobileOpen(false)}>Product range</a><a href="#control-plan" onClick={() => setMobileOpen(false)}>Control plan</a><a href="#evidence" onClick={() => setMobileOpen(false)}>Evidence</a><a href="#brief" onClick={() => setMobileOpen(false)}>Start a brief</a></nav>}

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy"><p className="eyebrow"><span></span> PRODUCT SOURCING · COMMERCIAL KITCHEN</p><h1 id="hero-title">Build a market-ready kitchen range with one accountable China team.</h1><p className="hero-intro">We turn product requirements into a verified, configured and export-ready kitchen range—with comparison, evidence and handoff built in.</p><div className="hero-actions"><button className="primary-button" onClick={() => setBriefOpen(true)}>Start a scoped request <ArrowRight size={18} /></button><a className="text-link" href="#control-plan">Review the control plan <ArrowRight size={17} /></a></div></div>
          <div className="visual-stage" id="gallery">
            <figure className="media-card side-media product-range"><img src={`${KITCHEN_ASSETS}/kitchen-product-range-sanitized.webp`} alt="Unbranded stainless commercial cooking line in an equipment showroom" /><figcaption>Product range</figcaption></figure>
            <figure className="media-card main-media"><img src={`${KITCHEN_ASSETS}/kitchen-operating-sanitized.webp`} alt="Chefs working in a modern stainless commercial kitchen" /><figcaption><span>REAL USE CONTEXT</span> Operating-kitchen reference</figcaption></figure>
            <figure className="media-card side-media configuration-detail"><img src={`${KITCHEN_ASSETS}/kitchen-configuration-sanitized.webp`} alt="Unbranded commercial ovens and bakery equipment in a showroom" /><figcaption>Configuration detail</figcaption></figure>
          </div>
          <div className="control-row"><div className="steps" aria-label="DDNZ sourcing control sequence">{heroSteps.map(({ number, title, copy, icon: Icon }) => <article className="step" key={number}><span className="step-icon"><Icon size={21} strokeWidth={1.8} /></span><div><p className="step-number">{number}</p><h2>{title}</h2><p>{copy}</p></div></article>)}</div><aside className="buyer-note" aria-label="Buyer checks before price comparison"><p>Before price comparison</p><ul><li>Voltage / phase</li><li>Gas type</li><li>Spare parts</li><li>Packed dimensions</li></ul></aside></div>
        </section>

        <section className="confidence-strip" aria-label="Product sourcing scope"><span><Gauge size={17} /> Market-defined configuration</span><span><Wrench size={17} /> Serviceability considered</span><span><Factory size={17} /> Factory evidence recorded</span><span><Globe2 size={17} /> Destination-ready handoff</span></section>

        <section className="section range-section" id="range" aria-labelledby="range-title">
          <div className="section-heading split-heading"><div><p className="eyebrow"><span></span> RANGE ARCHITECTURE</p><h2 id="range-title">Choose a range, then lock the variables that change the quote.</h2></div><p>Dealers do not need a longer catalogue. They need comparable products, clear exclusions and the operating details that make the order sellable.</p></div>
          <div className="category-tabs" role="tablist" aria-label="Commercial kitchen categories">{categories.map((category) => <button key={category.id} role="tab" aria-selected={activeCategory.id === category.id} className={activeCategory.id === category.id ? "active" : ""} onClick={() => setActiveCategory(category)}>{category.short}</button>)}</div>
          <div className="category-panel" role="tabpanel">
            <figure><img src={activeCategory.image} alt={activeCategory.alt} /><figcaption>Authorized product-range material · supplier branding removed</figcaption></figure>
            <div className="category-copy"><p className="category-kicker">{activeCategory.short}</p><h3>{activeCategory.title}</h3><p>{activeCategory.copy}</p><div className="category-columns"><div><h4>Typical range</h4><ul>{activeCategory.products.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul></div><div><h4>Lock before comparison</h4><ul>{activeCategory.checks.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul></div></div><button className="quiet-button" onClick={() => setBriefOpen(true)}>Scope this category <ArrowRight size={16} /></button></div>
          </div>
        </section>

        <section className="control-section" id="control-plan" aria-labelledby="plan-title"><div className="section control-inner"><div className="section-heading light-heading"><p className="eyebrow"><span></span> DDNZ CONTROL PLAN</p><h2 id="plan-title">From buying brief to release evidence.</h2><p>Each gate creates a recorded output, so the next decision is based on evidence rather than a supplier promise.</p></div><div className="plan-grid">{controlPlan.map(({ number, label, title, copy, output, icon: Icon }) => <article className="plan-card" key={number}><div className="plan-card-top"><span>{number}</span><Icon size={22} /></div><p className="plan-label">{label}</p><h3>{title}</h3><p>{copy}</p><strong>{output}</strong></article>)}</div></div></section>

        <section className="section evidence-section" id="evidence" aria-labelledby="evidence-title">
          <div className="evidence-layout"><figure className="evidence-photo"><img src={`${KITCHEN_ASSETS}/kitchen-factory-inspection-sanitized.webp`} alt="Three people reviewing stainless commercial equipment in a production facility" /><figcaption><span>REAL FIELD MATERIAL</span> Configuration review at a China-origin production site</figcaption></figure><div className="evidence-copy"><p className="eyebrow"><span></span> SUPPLIER VERIFICATION</p><h2 id="evidence-title">A shortlist should show why an offer moves forward.</h2><p>DDNZ compares supplier offers across delivery, quality, service and cost. Veto gates keep a low price from hiding repeated delivery or quality failures.</p><div className="evidence-points"><span><ShieldCheck size={19} />Comparable inputs</span><span><ClipboardCheck size={19} />Recorded checks</span><span><PackageCheck size={19} />Release gates</span></div><a className="text-link" href="#brief">Use this control plan <ArrowRight size={17} /></a></div></div>
          <div className="scorecard" id="scorecard" aria-label="Supplier assessment preview"><div className="scorecard-head"><div><p>DDNZ SUPPLIER SCORECARD</p><h3>Four dimensions, plus veto gates</h3></div><span>PREVIEW</span></div><div className="scorecard-table" role="table"><div className="score-row score-header" role="row"><span>Dimension</span><span>What is normalized</span><span>Control outcome</span></div>{evidenceRows.map((row) => <div className="score-row" role="row" key={row[0]}>{row.map((cell) => <span key={cell}>{cell}</span>)}</div>)}</div><div className="veto-band"><strong>Veto gates</strong><span>Delivery reliability</span><span>Incoming quality</span><span>Batch quality</span><span>Major incidents</span></div></div>
        </section>

        <section className="market-section" id="about"><div className="section market-inner"><div><p className="eyebrow"><span></span> MARKET-READY, NOT CATALOGUE-READY</p><h2>Product decisions stay connected to the destination market.</h2></div><div className="market-grid"><article><Globe2 size={23} /><h3>Utilities & compliance</h3><p>Voltage, phase, gas type, refrigerant, installation requirements and document needs enter the brief early.</p></article><article><Gauge size={23} /><h3>Operating performance</h3><p>Output, recovery, ambient conditions and duty cycle are compared at the level that affects daily use.</p></article><article><Wrench size={23} /><h3>Serviceability</h3><p>Common spare parts, cleaning access, component availability and support terms are treated as buying variables.</p></article><article><PackageCheck size={23} /><h3>Packing & handoff</h3><p>Packed dimensions, marks, accessories, quantity records and export documents stay tied to the approved order.</p></article></div></div></section>

        <section className="section brief-section" id="brief" aria-labelledby="brief-section-title"><div className="brief-heading"><p className="eyebrow"><span></span> START WITH A SCOPED REQUEST</p><h2 id="brief-section-title">Tell us the range, destination and buying stage.</h2><p>We will structure the first review around supplier fit, specifications, evidence and the right export path.</p></div><InlineBrief /><p className="privacy-note"><ShieldCheck size={15} /> Continue through the secure DDNZ inquiry route.</p></section>

        <section className="handoff-band" aria-label="Freight execution partner"><div><Ship size={28} /><p><strong>International freight executed by Heaven Born</strong><span>Operating since 1997 · engaged after sourcing release</span></p></div><span>DDNZ remains your sourcing coordination team</span></section>
      </main>

      <footer className="site-footer"><Brand /><p>Product sourcing, supplier verification, specification control and export handoff from China.</p><div><a href="#range">Product range</a><a href="#control-plan">Control plan</a><a href="#evidence">Evidence</a><a href="#brief">Start a brief</a></div><small>Commercial kitchen sourcing by DDNZ Global</small></footer>
      {briefOpen && <BuyerBrief onClose={() => setBriefOpen(false)} />}
    </div>
  );
}

export function App() {
  const [technical, setTechnical] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ need: "Design + equipment plan", category: "Complete kitchen line", market: "", stage: "", serviceModel: "", energy: "", volume: "", timeline: "", notes: "" });

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Commercial Kitchen Design & Equipment Sourcing | DDNZ Global";
    return () => { document.title = previousTitle; };
  }, []);

  const quoteUrl = useMemo(() => {
    const params = new URLSearchParams({
      leadGoal: "Product Sourcing",
      industry: `Commercial Kitchen - ${form.category}`,
      dest: form.market,
      source: "commercial_kitchen_product",
      projectNeed: form.need,
      buyingStage: form.stage,
      serviceModel: form.serviceModel,
      energySource: form.energy,
      projectScale: form.volume,
      timeline: form.timeline,
    });
    return `/get-a-quote?${params.toString()}`;
  }, [form]);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const persistQuoteDraft = () => {
    try {
      if (!form.notes.trim()) {
        window.sessionStorage.removeItem("ddnz_quote_prefill_v1");
        return;
      }
      window.sessionStorage.setItem("ddnz_quote_prefill_v1", JSON.stringify({
        source: "commercial_kitchen_product",
        notes: form.notes.trim(),
      }));
    } catch {
      // The secure quote route remains available when browser storage is disabled.
    }
  };
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="kitchen-page" id="top">
      <ShowcaseSEO page="kitchen" />
      <SourcingHomepageNav />

      <main>
        <section className="k-hero" aria-labelledby="kitchen-title">
          <div className="k-hero-copy">
            <p className="k-kicker">COMMERCIAL KITCHEN · DESIGN + SOURCING</p>
            <h1 id="kitchen-title">Design the operation. Configure the kitchen. Then compare the price.</h1>
            <p>DDNZ’s senior China-based kitchen designers and engineers turn the business model, menu and service rhythm into an operations-led design—then connect the plan to like-for-like quotes, approval evidence and export handoff.</p>
            <div className="k-hero-actions">
              <button className="k-primary" type="button" onClick={() => scrollTo("rfq")}>Start with the operating brief <ArrowRight size={17} /></button>
              <button className="k-link-button" type="button" onClick={() => scrollTo("design")}>See the design approach <ArrowRight size={16} /></button>
            </div>
            <div className="k-proof-row" aria-label="DDNZ kitchen design and sourcing approach">
              {[
                [UtensilsCrossed, "Business-led", "menu & service model"],
                [Ruler, "Flow-designed", "food, people & ware"],
                [Settings2, "Configured", "utilities & equipment"],
                [RefreshCcw, "Improved", "as operations evolve"],
              ].map(([Icon, first, second]) => <span key={first}><Icon size={20} /><b>{first}</b><small>{second}</small></span>)}
            </div>
          </div>
          <div className="k-hero-visual">
            <figure>
              <img src={`${KITCHEN_ASSETS}/kitchen-operating-sanitized.webp`} alt="Chefs working across a configured stainless commercial kitchen line" width="1600" height="1000" loading="eager" decoding="async" fetchPriority="high" />
              <figcaption>OPERATING-KITCHEN REFERENCE · DESIGN CONTEXT</figcaption>
            </figure>
            <aside className="k-hero-ticket" aria-label="Commercial kitchen operating design brief preview">
              <div><span>OPERATING DESIGN</span><strong>01 / DEFINE</strong></div>
              <dl><div><dt>Business</dt><dd>Concept · channel</dd></div><div><dt>Demand</dt><dd>Peak · dayparts</dd></div><div><dt>Flow</dt><dd>People · food · ware</dd></div></dl>
            </aside>
          </div>
        </section>

        <section className="k-section k-design" id="design" aria-labelledby="design-title">
          <div className="k-design-intro">
            <p className="k-kicker">OPERATIONS-LED KITCHEN DESIGN</p>
            <h2 id="design-title">A kitchen is an operating system, not an equipment list.</h2>
            <p>We begin with how the business creates value and how each service must run. Menu mix, demand, labour, site constraints and safe movement shape the layout; the equipment follows that operating logic.</p>
            <div className="k-design-signals" aria-label="Kitchen design inputs">
              <span><b>Business</b> Concept · channel · growth</span>
              <span><b>Operations</b> Demand · labour · service rhythm</span>
              <span><b>Space</b> Flow · zoning · future change</span>
            </div>
          </div>
          <div className="k-design-loop">
            <div className="k-loop-head"><span>DDNZ DESIGN LOOP</span><strong>Brief · plan · run · improve</strong></div>
            <div className="k-loop-stages" role="list" aria-label="Operations-led kitchen design stages">
              {kitchenDesignStages.map(([Icon, title, copy], index) => (
                <article role="listitem" key={title}>
                  <span className="k-loop-number">0{index + 1}</span>
                  <Icon size={23} />
                  <div><h3>{title}</h3><p>{copy}</p></div>
                </article>
              ))}
            </div>
            <div className="k-loop-return">
              <RefreshCcw size={27} />
              <div><strong>Continuous improvement is part of the design.</strong><p>Opening assumptions are checked against real service. Bottlenecks, labour shifts, menu changes and maintenance experience feed the next controlled revision.</p></div>
            </div>
          </div>
          <article className="k-design-boundary" aria-labelledby="design-boundary-title">
            <header>
              <p className="k-kicker">DESIGN DELIVERY BOUNDARY</p>
              <h3 id="design-boundary-title">DDNZ design package. Local statutory drawings.</h3>
            </header>
            <div className="k-boundary-item">
              <span><FileCheck2 size={24} /></span>
              <div><h4>Prepared by DDNZ in China</h4><p>Operating brief, kitchen layout, equipment plan and schedule, utility and connection coordination, and construction drawings—prepared by our China-based design and engineering team.</p></div>
            </div>
            <div className="k-boundary-item">
              <span><Globe2 size={24} /></span>
              <div><h4>Completed or validated locally</h4><p>Local code adaptation, authority-submission drawings, permits, licensed calculations, seals or stamps, and regulated architectural, MEP, fire or structural documents must be handled by qualified local parties.</p></div>
            </div>
            <p className="k-boundary-handoff"><ArrowRight size={17} /> DDNZ keeps equipment schedules, interfaces and revisions controlled so the local team can adapt the statutory package without restarting the kitchen design.</p>
          </article>
        </section>

        <section className="k-section k-families" id="families" aria-labelledby="families-title">
          <div className="k-section-head">
            <div><p className="k-kicker">EQUIPMENT RANGE ARCHITECTURE</p><h2 id="families-title">Four equipment lines. One coordinated operating plan.</h2><p>Each family keeps its own performance variables, service needs and approval checks.</p></div>
            <div className="k-segmented" role="group" aria-label="Equipment family view">
              <button className={!technical ? "active" : ""} type="button" onClick={() => setTechnical(false)}>Project logic</button>
              <button className={technical ? "active" : ""} type="button" onClick={() => setTechnical(true)}>Technical controls</button>
            </div>
          </div>
          <div className="k-family-grid">{equipmentFamilies.map((item, index) => <KitchenEquipmentCard key={item.name} item={item} index={index} technical={technical} />)}</div>
        </section>

        <section className="k-section k-builder" id="control" aria-label="Commercial kitchen sourcing control plan">
          <article className="k-builder-card">
            <p className="k-kicker">PROJECT CONTROL PLAN</p>
            <h2>From design basis to approved release.</h2>
            <p>One decision record keeps operating intent, supplier comparison, inspection and export execution connected.</p>
            <div className="k-process-grid">{kitchenProcessSteps.map(([Icon, title, copy], index) => <article key={title}><span><Icon size={22} /></span><i>0{index + 1}</i><h3>{title}</h3><p>{copy}</p></article>)}</div>
          </article>
          <article className="k-builder-card k-config-card">
            <p className="k-kicker">DESIGN BASIS CONTROL</p>
            <h2>Kitchen design and configuration approval</h2>
            <p>Lock the service model, operating demand, flow, site services and equipment interfaces before the order moves.</p>
            <div className="k-config-flow">{configurationSteps.map(([Icon, title, copy], index) => <article key={title}><span>0{index + 1}</span><Icon size={24} /><h3>{title}</h3><p>{copy}</p></article>)}</div>
          </article>
        </section>

        <section className="k-section k-control-points" aria-labelledby="controls-title">
          <p className="k-kicker">KITCHEN CONTROL POINTS</p>
          <h2 id="controls-title">The variables that change daily performance.</h2>
          <div>{kitchenControlPoints.map(([Icon, title, copy]) => <article key={title}><Icon size={25} /><h3>{title}</h3><p>{copy}</p></article>)}</div>
        </section>

        <section className="k-section k-evidence" id="evidence" aria-labelledby="evidence-title">
          <div className="k-evidence-head"><div><p className="k-kicker">ON-SITE VERIFICATION</p><h2 id="evidence-title">Approval evidence before shipment release.</h2><p>Every record answers a buyer decision: what was checked, what passed, what remains open and what is approved.</p></div><span>REAL FIELD MATERIAL · CHINA</span></div>
          <div className="k-evidence-stage">
            <figure>
              <img src={`${KITCHEN_ASSETS}/kitchen-factory-inspection-sanitized.webp`} alt="Three people reviewing stainless commercial equipment at a production site in China" width="1536" height="1024" loading="lazy" decoding="async" />
              <figcaption>Configuration review at a commercial-equipment production site</figcaption>
            </figure>
            <aside>
              <h3>Model-level inspection, tied to the approved line brief.</h3>
              <div className="k-evidence-checks">
                <span><CheckCircle2 size={18} /><b>Identity &amp; configuration</b><small>Model, dimensions, options and included accessories.</small></span>
                <span><CheckCircle2 size={18} /><b>Function &amp; performance</b><small>Agreed heating, cooling, motor or control checks.</small></span>
                <span><CheckCircle2 size={18} /><b>Finish &amp; clean-down</b><small>Accessible surfaces, edges, doors and cleaning access.</small></span>
                <span><CheckCircle2 size={18} /><b>Pack-out &amp; documents</b><small>Quantity, labels, loose parts and installation files.</small></span>
              </div>
              <h4>Approval file</h4>
              <ul><li><FileCheck2 size={15} />Approved configuration record</li><li><FileCheck2 size={15} />Annotated inspection photos</li><li><FileCheck2 size={15} />Open-item and correction log</li><li><FileCheck2 size={15} />Release and packing record</li></ul>
            </aside>
          </div>
          <div className="k-record-strip" aria-label="Inspection evidence sequence">
            {[[Factory, "01", "Factory check", "Supplier identity, capacity and process fit"], [Ruler, "02", "Configuration", "Dimensions, utilities, options and interfaces"], [Thermometer, "03", "Function", "Operating checks against acceptance points"], [PackageCheck, "04", "Release", "Corrections closed and pack-out recorded"]].map(([Icon, number, title, copy]) => <article key={number}><span>{number}</span><Icon size={22} /><div><h3>{title}</h3><p>{copy}</p></div></article>)}
          </div>
        </section>

        <section className="k-section k-decisions" aria-label="Supplier and destination controls">
          <article className="k-supplier-card">
            <div className="k-decision-head"><div><p className="k-kicker">SUPPLIER SCORECARD</p><h2>Compare the same scope. Choose on evidence.</h2></div><span>ILLUSTRATIVE PREVIEW</span></div>
            <div className="k-supplier-table" role="table" aria-label="Illustrative supplier comparison">
              <div className="k-supplier-row heading" role="row"><span>Supplier</span><span>Decision</span><span>Factory</span><span>Quality</span><span>Delivery</span><span>Service</span></div>
              {kitchenSupplierRows.map((row) => <div className="k-supplier-row" role="row" key={row[0]}>{row.map((cell, index) => index === 1 ? <strong data-label="Decision" key={cell}>{cell}</strong> : <span data-label={["Supplier", "Decision", "Factory", "Quality", "Delivery", "Service"][index]} key={cell}>{cell}</span>)}</div>)}
            </div>
            <button className="k-link-button k-score-link" type="button" onClick={() => setScoreOpen(true)}>View the complete scoring method <ArrowRight size={16} /></button>
          </article>
          <article className="k-readiness-card" id="about">
            <p className="k-kicker">DESTINATION-MARKET READINESS</p>
            <h2>Prepare an installable line, not just a container load.</h2>
            <ul>{["Utility and connection schedule", "Certification document checklist", "Local statutory drawing plan", "Installation and service file", "Export packing and carton marks", "Consolidation and delivery plan"].map((item) => <li key={item}><CheckCircle2 size={17} />{item}</li>)}</ul>
            <div className="k-approval-package"><h3>Approval package delivered</h3>{[[ClipboardCheck, "Line brief & specs"], [Settings2, "Models & options"], [ShieldCheck, "Inspection evidence"], [PackageCheck, "Pack-out & handoff"]].map(([Icon, label]) => <span key={label}><Icon size={20} />{label}</span>)}</div>
          </article>
        </section>

        <section className="k-section k-rfq" id="rfq" aria-labelledby="rfq-title">
          <div className="k-rfq-intro">
            <p className="k-kicker">OPERATING &amp; EQUIPMENT BRIEF</p>
            <h2 id="rfq-title">Define the operation. Receive a design-led equipment plan.</h2>
            <p>Start with the design need, business format, equipment scope and destination. Drawings and detailed schedules can follow after the first review.</p>
            <div className="k-rfq-proof"><span><LockKeyhole size={21} /><b>Confidential</b><small>handling</small></span><span><SearchCheck size={21} /><b>Structured</b><small>supplier review</small></span><span><Globe2 size={21} /><b>Clear</b><small>next steps</small></span></div>
          </div>
          {!submitted ? (
            <form className="k-rfq-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
              <label>Project need *<select name="need" value={form.need} onChange={update} required><option>Design + equipment plan</option><option>Layout and configuration review</option><option>Equipment specification and sourcing</option><option>Replacement or improvement plan</option></select></label>
              <label>Equipment scope *<select name="category" value={form.category} onChange={update} required><option>Complete kitchen line</option><option>Cooking equipment</option><option>Refrigeration & ice</option><option>Food preparation & warewashing</option><option>Bakery & display</option><option>Mixed equipment order</option></select></label>
              <label>Destination market *<input name="market" value={form.market} onChange={update} required placeholder="Country or city" /></label>
              <label>Buying stage *<select name="stage" value={form.stage} onChange={update} required><option value="">Select stage</option><option>Building a new project</option><option>Replacing equipment</option><option>Comparing current offers</option><option>Order-ready</option></select></label>
              <label>Business format<select name="serviceModel" value={form.serviceModel} onChange={update}><option value="">Select format</option><option>Restaurant or café</option><option>Hotel or catering</option><option>Central or commissary kitchen</option><option>Bakery or food retail</option><option>Institutional foodservice</option><option>Other format</option></select></label>
              <label>Primary energy source<select name="energy" value={form.energy} onChange={update}><option value="">Select source</option><option>Electric</option><option>Gas</option><option>Mixed utilities</option><option>To be confirmed</option></select></label>
              <label>Project scale<select name="volume" value={form.volume} onChange={update}><option value="">Select scale</option><option>Single equipment item</option><option>Small kitchen line</option><option>Full commercial kitchen</option><option>Multi-site rollout</option></select></label>
              <label>Preferred timeline<select name="timeline" value={form.timeline} onChange={update}><option value="">Select timeline</option><option>Within 30 days</option><option>30–60 days</option><option>60–90 days</option><option>Planning stage</option></select></label>
              <label className="k-rfq-notes">Tell us about the business and operating brief<textarea name="notes" value={form.notes} onChange={update} placeholder="Concept, menu, dayparts, peak demand, labour pattern, available utilities, space constraints and any current bottlenecks." /></label>
              <p className="k-rfq-scope"><FileCheck2 size={17} /> DDNZ drawings follow our China-based design and engineering practice. Locally regulated drawings, permits and professional sign-off must be completed or validated by qualified local parties.</p>
              <button className="k-primary k-rfq-submit" type="submit">Prepare design brief <ArrowRight size={17} /></button>
              <p className="k-rfq-response"><ShieldCheck size={16} /> We review the scope before requesting sensitive project files.</p>
            </form>
          ) : (
            <div className="k-rfq-success" role="status">
              <CheckCircle2 size={42} />
              <div><p className="k-kicker">BRIEF READY</p><h3>{form.need} · {form.market}</h3><p>Your design need, operating context and equipment scope are ready for the secure DDNZ brief.</p></div>
              <a className="k-primary" href={quoteUrl} onClick={persistQuoteDraft}>Continue to secure brief <ArrowRight size={17} /></a>
              <button className="k-link-button" type="button" onClick={() => setSubmitted(false)}>Edit request</button>
            </div>
          )}
        </section>

        <section className="k-freight" aria-label="Freight execution partner"><div><Truck size={28} /><p><strong>International freight executed by Heaven Born</strong><span>Operating since 1997.</span></p></div><span>Origin control · route coordination · export documents · carrier handoff</span></section>
      </main>

      <ShowcaseContactFooter
        pageKey="commercial-kitchen"
        description="DDNZ Global connects operations-led kitchen design with equipment sourcing, supplier verification, inspection and export handoff from China."
        tagline="Kitchen design + sourcing"
        links={[{ label: "Design approach", href: "#design" }, { label: "Equipment families", href: "#families" }, { label: "Start a brief", href: "#rfq" }]}
      />
      {scoreOpen && <KitchenScoreModal close={() => setScoreOpen(false)} />}
    </div>
  );
}
