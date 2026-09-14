import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Box,
  Check,
  CheckCircle2,
  CircleGauge,
  ClipboardCheck,
  Database,
  Globe2,
  Image as ImageIcon,
  Layers3,
  LockKeyhole,
  PackageCheck,
  PlugZap,
  Play,
  Refrigerator,
  Ruler,
  ScanLine,
  SearchCheck,
  ShieldCheck,
  Snowflake,
  Thermometer,
  Truck,
  Wind,
  Wrench,
  X,
} from "lucide-react";
import "./refrigeration.css";
import "./mobile-readability.css";
import ShowcaseSEO from "./ShowcaseSEO";
import ShowcaseContactFooter from "./ShowcaseContactFooter";
import SourcingHomepageNav from "../../components/SourcingHomepageNav";

const A = "/images/product-showcase/refrigeration";

const productFamilies = [
  {
    name: "Upright & reach-in",
    promise: "Hold temperature through a busy service day.",
    image: `${A}/upright-dg860l4-sanitized.webp`,
    imageAlt: "Illustration of a stainless-steel four-door commercial refrigerator",
    imageLabel: "PRODUCT ILLUSTRATION",
    icon: Refrigerator,
    operating: ["Restaurants & hotels", "Chilled, frozen or dual-zone", "GN-format and solid-door options"],
    specs: [["Capacity", "860 L source model"], ["Temperature", "1–8°C / −5 to −18°C"], ["Cooling", "Direct-cooled, dual-zone"], ["Refrigerant", "R600a / R290 listed"]],
  },
  {
    name: "Counters & prep",
    promise: "Cold storage where the work happens.",
    image: `${A}/counter-application-sanitized.webp`,
    imageAlt: "Commercial kitchen with refrigerated work counters in active service",
    imageLabel: "APPLICATION VIEW",
    icon: Layers3,
    operating: ["Prep lines & pass stations", "One-, two- and three-door formats", "Worktop and GN-pan configurations"],
    specs: [["Format", "1–3 door workbench"], ["Temperature", "0–10°C source range"], ["Cooling", "Fan-assisted source family"], ["Lock before quote", "Pan layout & worktop depth"]],
  },
  {
    name: "Display refrigeration",
    promise: "Merchandise clearly without losing cold control.",
    image: `${A}/display-range-sanitized.webp`,
    imageAlt: "Unbranded glass-door and serve-over refrigerated display equipment in a showroom",
    imageLabel: "RANGE VIEW",
    icon: ScanLine,
    operating: ["Bakery, retail & beverage display", "Serve-over and glass-door formats", "Sightline, access and loading plan"],
    specs: [["Temperature", "Chilled / frozen by format"], ["Airflow", "Forced-air options"], ["Defrost", "Confirm method & cycle"], ["Lock before quote", "Glass, shelves & lighting"]],
  },
  {
    name: "Commercial ice makers",
    promise: "Size output to the rush, not only the daily label.",
    image: `${A}/ice-maker-sd50f-spec.webp`,
    imageAlt: "Supplier parameter sheet for a compact stainless-steel commercial cube ice maker",
    imageLabel: "SUPPLIER PARAMETER SHEET",
    icon: Snowflake,
    operating: ["Bars, cafés & hospitality", "Cube, crescent and other ice formats", "Storage and peak-hour demand"],
    specs: [["Rated output", "25 kg / 24 h example"], ["Storage", "20 kg listed"], ["Cube", "22 × 22 × 22 mm"], ["Condenser", "Air / water listed"]],
  },
];

const controlPoints = [
  [Database, "Confirm the model", "Match the model and configuration across your quotation, sample and order."],
  [Thermometer, "Pull-down & hold test", "Temperature recovery, set point and test conditions are recorded—not inferred from the display."],
  [Wind, "Ambient & airflow review", "Climate class, ventilation clearance and condenser direction are checked for the destination kitchen."],
  [PlugZap, "Electrical & refrigerant match", "Voltage, frequency, plug, refrigerant and rated power remain visible in the approval file."],
  [Wrench, "Door, gasket & defrost check", "Door closure, seals, drainage and defrost behavior are checked against the approved unit."],
  [PackageCheck, "Pack-out & handling plan", "Corner protection, crate or carton, upright marks and loading constraints are confirmed before release."],
];

const evidenceTracks = {
  ice: {
    label: "Ice maker production",
    status: "PRODUCTION VIDEO · 9 SECONDS",
    title: "See the ice-maker line in motion.",
    copy: "Watch a short clip from an ice-maker production line, then take a closer look at the packing and storage photos below.",
    video: "/media/process/kitchen-production.mp4",
    visual: `${A}/ice-maker-line-source.webp`,
    visualAlt: "Commercial ice makers on a production line",
    caption: "Ice maker production line · 9-second video",
    checks: [
      ["Production line", "Ice makers at the assembly stations."],
      ["Protective packing", "A wrapped unit secured on a pallet."],
      ["Warehouse storage", "Packed ice makers ready for handling."],
      ["Model specifications", "The SD-50F sheet below is a separate model example."],
    ],
    thumbs: [
      [`${A}/ice-maker-line-source.webp`, "01", "Production line", "Ice makers at the assembly stations"],
      [`${A}/ice-maker-packout-source.webp`, "02", "Protective packing", "Wrapping and pallet support"],
      [`${A}/ice-maker-warehouse-source.webp`, "03", "Warehouse storage", "Packed ice-maker cartons"],
      [`${A}/ice-maker-sd50f-spec.webp`, "04", "SD-50F specifications", "Capacity, dimensions and ice output"],
    ],
  },
  cabinet: {
    label: "Choosing a cabinet",
    status: "BEFORE YOU ORDER",
    title: "Check the fit, cooling and service access.",
    copy: "Choose a cabinet around your available space and kitchen conditions. We confirm the selected model's details with the supplier when preparing your quote.",
    visual: `${A}/high-ambient-airflow-diagram.webp`,
    visualAlt: "Illustration of condenser airflow and clearance around an upright refrigerator in a hot kitchen",
    caption: "Condenser airflow and clearance · Illustration",
    checks: [
      ["Model and configuration", "Confirm dimensions, voltage and refrigerant for your selected unit."],
      ["Cooling performance", "Ask for test readings at the expected room temperature and load."],
      ["Cleaning and maintenance", "Check condenser access, door seals and drainage."],
      ["Transport packaging", "Agree protection, packed dimensions and upright handling requirements."],
    ],
    thumbs: [],
  },
};

function DotScale({ value }) {
  return <span className="refrigeration-dots" aria-label={`${value} of 5`}>{[1, 2, 3, 4, 5].map((n) => <i className={n <= value ? "filled" : ""} key={n} />)}</span>;
}

function ProductionVideo({ src, poster }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const play = () => videoRef.current?.play().catch(() => setUnavailable(true));
  return <>
    <video ref={videoRef} controls playsInline preload="none" poster={poster} aria-label="Ice maker production line video"
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => setUnavailable(true)}>
      <source src={src} type="video/mp4" />
      <a href={src}>Open the production video</a>
    </video>
    {!playing && !unavailable && <button className="refrigeration-video-play" type="button" onClick={play} aria-label="Play ice maker production video">
      <Play size={23} fill="currentColor" aria-hidden="true" /><span>Play video<small>9 seconds</small></span>
    </button>}
    {unavailable && <p className="refrigeration-video-fallback">The video could not be played. <a href={src}>Open video file</a></p>}
  </>;
}

function FamilyCard({ item, index, technical }) {
  const Icon = item.icon;
  return (
    <article className="refrigeration-family-card">
      <div className="refrigeration-family-title"><span><Icon size={21} /></span><div><h3>{item.name}</h3><p>{item.promise}</p></div></div>
      <figure>
        <img src={item.image} alt={item.imageAlt} width="1200" height="900" loading={index === 0 ? "eager" : "lazy"} decoding="async" />
        <figcaption>{item.imageLabel}</figcaption>
      </figure>
      {technical ? (
        <dl>{item.specs.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl>
      ) : (
        <ul>{item.operating.map((line) => <li key={line}><Check size={14} />{line}</li>)}</ul>
      )}
      <span className="refrigeration-family-index">0{index + 1}</span>
    </article>
  );
}

export function RefrigerationEquipment() {
  const [technical, setTechnical] = useState(false);
  const [evidenceKey, setEvidenceKey] = useState("ice");
  const [scoreOpen, setScoreOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ category: "Upright & reach-in", market: "", stage: "", temperature: "", capacity: "", cooling: "", notes: "" });
  const evidence = evidenceTracks[evidenceKey];

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Commercial Refrigeration Equipment Sourcing | DDNZ Global";
    return () => { document.title = previousTitle; };
  }, []);

  useEffect(() => {
    if (!scoreOpen) return undefined;

    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    root.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [scoreOpen]);

  const quoteUrl = useMemo(() => {
    const params = new URLSearchParams({
      leadGoal: "Product Sourcing",
      industry: `Refrigeration Equipment - ${form.category}`,
      dest: form.market,
      source: "refrigeration_equipment_product",
      buyingStage: form.stage,
      temperatureRange: form.temperature,
      capacity: form.capacity,
      coolingMethod: form.cooling,
    });
    return `/get-a-quote/?${params.toString()}`;
  }, [form]);

  const persistQuoteDraft = () => {
    try {
      if (!form.notes.trim()) {
        window.sessionStorage.removeItem("ddnz_quote_prefill_v1");
        return;
      }
      window.sessionStorage.setItem("ddnz_quote_prefill_v1", JSON.stringify({
        source: "refrigeration_product",
        notes: form.notes.trim(),
      }));
    } catch {
      // The secure quote route remains available when browser storage is disabled.
    }
  };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  return (
    <div className="refrigeration-page">
      <ShowcaseSEO page="refrigeration" />
      <SourcingHomepageNav />

      <main>
        <section className="refrigeration-hero" aria-labelledby="refrigeration-title">
          <div className="refrigeration-hero-copy">
            <p className="refrigeration-kicker">PRODUCT SOURCING · REFRIGERATION EQUIPMENT</p>
            <h1 id="refrigeration-title">Source the cold side around the operating load.</h1>
            <p>DDNZ turns temperature, capacity, ambient conditions and service workflow into like-for-like quotations, model-linked approval evidence and export-ready pack-out.</p>
            <div className="refrigeration-hero-actions">
              <button className="refrigeration-primary" type="button" onClick={() => scrollTo("refrigeration-rfq")}>Start a scoped request <ArrowRight size={17} /></button>
              <button className="refrigeration-link-button" type="button" onClick={() => scrollTo("refrigeration-control")}>Review the control plan <ArrowRight size={16} /></button>
            </div>
            <div className="refrigeration-proof-row">
              {[
                [ClipboardCheck, "Like-for-like", "model comparison"],
                [Thermometer, "Temperature", "test plan"],
                [ShieldCheck, "Model-linked", "approval evidence"],
                [PackageCheck, "Export-ready", "handling plan"],
              ].map(([Icon, first, second]) => <span key={first}><Icon size={20} /><b>{first}</b><small>{second}</small></span>)}
            </div>
          </div>
          <div className="refrigeration-hero-stage">
            <div className="refrigeration-stage-grid" aria-hidden="true" />
            <img src={`${A}/upright-dg860l4-sanitized.webp`} width="1600" height="1600" alt="Illustration of a four-door stainless-steel refrigeration cabinet" fetchPriority="high" decoding="async" />
            <span className="refrigeration-model-tag"><b>DG860L4-A</b> MODEL EXAMPLE</span>
            <div className="refrigeration-spec-callout callout-capacity"><strong>860 L</strong><span>effective volume</span></div>
            <div className="refrigeration-spec-callout callout-temp"><strong>2 zones</strong><span>1–8°C / −5 to −18°C</span></div>
            <div className="refrigeration-spec-callout callout-cooling"><strong>Direct cool</strong><span>350 W listed</span></div>
            <p className="refrigeration-render-note">Product illustration. Confirm the final configuration with your quotation.</p>
          </div>
        </section>

        <section className="refrigeration-section refrigeration-range" aria-labelledby="refrigeration-range-title">
          <div className="refrigeration-section-head">
            <div><p className="refrigeration-kicker">EQUIPMENT MATRIX</p><h2 id="refrigeration-range-title">Choose the operating role, then lock the variables.</h2><p>Four commercial cold-side families, compared by duty—not by catalogue appearance.</p></div>
            <div className="refrigeration-segmented" role="group" aria-label="Equipment matrix view">
              <button className={!technical ? "active" : ""} type="button" onClick={() => setTechnical(false)}>Operating fit</button>
              <button className={technical ? "active" : ""} type="button" onClick={() => setTechnical(true)}>Representative specs</button>
            </div>
          </div>
          <div className="refrigeration-family-grid">
            {productFamilies.map((item, index) => <FamilyCard item={item} index={index} technical={technical} key={item.name} />)}
          </div>
          <p className="refrigeration-spec-disclaimer"><AlertCircle size={15} />Specifications are examples for the models shown. We confirm the final model, test conditions and destination configuration with your quotation.</p>
        </section>

        <section className="refrigeration-brief-band" aria-labelledby="refrigeration-brief-title">
          <div className="refrigeration-section refrigeration-brief-grid">
            <div className="refrigeration-brief-copy"><p className="refrigeration-kicker">COOLING BRIEF</p><h2 id="refrigeration-brief-title">The variables that change the machine—and the quote.</h2><p>A refrigeration RFQ is comparable only when every supplier receives the same operating assumptions.</p></div>
            <div className="refrigeration-brief-steps">
              {[
                ["01", Thermometer, "Duty & temperature", "Chilled, frozen, dual-zone or ice output."],
                ["02", Box, "Usable capacity", "Product load, GN layout, shelves and access."],
                ["03", Wind, "Ambient & ventilation", "Kitchen heat, humidity and condenser clearance."],
                ["04", PlugZap, "Utility configuration", "Voltage, frequency, plug, drain and water."],
                ["05", Ruler, "Footprint & delivery", "Doorways, service clearance and pack-out limits."],
              ].map(([number, Icon, title, copy]) => <article key={number}><span>{number}</span><Icon size={24} /><h3>{title}</h3><p>{copy}</p></article>)}
            </div>
          </div>
        </section>

        <section className="refrigeration-section refrigeration-control" id="refrigeration-control" aria-labelledby="refrigeration-control-title">
          <div className="refrigeration-control-head"><div><p className="refrigeration-kicker">BEFORE YOU ORDER</p><h2 id="refrigeration-control-title">Get the details right for your kitchen.</h2></div><p>Start with the equipment you need. Confirm the model, operating conditions and delivery requirements as we prepare your quotation.</p></div>
          <div className="refrigeration-control-grid">
            {controlPoints.map(([Icon, title, copy], index) => <article key={title}><span>0{index + 1}</span><Icon size={27} /><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </section>

        <section className="refrigeration-section" aria-label="Compare refrigeration models"><p className="refrigeration-kicker">CHOOSE YOUR EQUIPMENT</p><h2>Find the next model for your range.</h2><div className="flex flex-wrap gap-4 mt-5"><a className="refrigeration-primary" href="/sourcing/commercial-ice-machines-from-china/">Compare six ice machines <ArrowRight size={17}/></a><a className="refrigeration-secondary" href="/sourcing/commercial-kitchen-equipment-from-china/#commercial-kitchen-equipment">Browse refrigerators &amp; prep counters <ArrowRight size={17}/></a></div></section>
        <section className="refrigeration-section refrigeration-evidence" id="refrigeration-evidence" aria-labelledby="refrigeration-evidence-title">
          <div className="refrigeration-evidence-head">
            <div><p className="refrigeration-kicker">A CLOSER LOOK</p><h2 id="refrigeration-evidence-title">From the production line to the packing floor.</h2><p>Watch ice-maker production, view the packing photos and check what matters for your equipment selection.</p></div>
            <div className="refrigeration-tabs" role="group" aria-label="Production and equipment checks">
              {Object.entries(evidenceTracks).map(([key, value]) => <button type="button" aria-pressed={evidenceKey === key} aria-controls="refrigeration-media-panel" className={evidenceKey === key ? "active" : ""} onClick={() => setEvidenceKey(key)} key={key}>{value.label}</button>)}
            </div>
          </div>
          <div id="refrigeration-media-panel" className={`refrigeration-evidence-stage ${evidenceKey === "cabinet" ? "is-gap" : ""}`}>
            <figure className={evidence.video ? "has-video" : undefined}>
              {evidence.video ? <ProductionVideo src={evidence.video} poster={evidence.visual} /> : <img key={evidence.visual} src={evidence.visual} alt={evidence.visualAlt} width="1200" height="900" loading="lazy" decoding="async" />}
              <figcaption>{evidence.caption}</figcaption>
            </figure>
            <aside>
              <span className="refrigeration-evidence-status">{evidence.status}</span>
              <h3>{evidence.title}</h3><p>{evidence.copy}</p>
              <div>{evidence.checks.map(([title, copy]) => <span key={title}><CheckCircle2 size={17} /><b>{title}</b><small>{copy}</small></span>)}</div>
            </aside>
          </div>
          {evidence.thumbs.length > 0 && (
            <div className="refrigeration-evidence-thumbs">
              {evidence.thumbs.map(([src, number, title, copy]) => <article key={number}><div><img src={src} alt={`${title}: ${copy}`} width="720" height="720" loading="lazy" decoding="async" /></div><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
            </div>
          )}
        </section>

        <section className="refrigeration-section refrigeration-decisions" aria-label="Supplier and destination controls">
          <article className="refrigeration-scorecard">
            <div className="refrigeration-decision-head"><div><p className="refrigeration-kicker">SUPPLIER SCORECARD</p><h2>Compare capability after the specification is locked.</h2></div><span>ILLUSTRATIVE PREVIEW</span></div>
            <div className="refrigeration-supplier-table">
              <div className="refrigeration-supplier-row heading"><span>Supplier</span><span>Overall</span><span>Thermal</span><span>Spec</span><span>Service</span><span>Pack-out</span></div>
              {[["Supplier A", "91", 5, 5, 4, 5], ["Supplier B", "84", 4, 4, 4, 4], ["Supplier C", "77", 4, 3, 4, 3], ["Supplier D", "69", 3, 3, 3, 3]].map(([name, score, ...dots]) => <div className="refrigeration-supplier-row" key={name}><span>{name}</span><strong>{score}</strong>{dots.map((dot, index) => <DotScale value={dot} key={index} />)}</div>)}
            </div>
            <button className="refrigeration-link-button refrigeration-score-link" type="button" onClick={() => setScoreOpen(true)}>View the complete scoring method <ArrowRight size={16} /></button>
          </article>
          <article className="refrigeration-readiness">
            <p className="refrigeration-kicker">DESTINATION-MARKET READINESS</p><h2>Make the unit installable, serviceable and sellable.</h2>
            <ul>{["Voltage, frequency and plug configuration", "Refrigerant and destination restrictions", "Climate class and ventilation allowance", "Language, labeling and nameplate file", "Packing, upright handling and route plan"].map((item) => <li key={item}><CheckCircle2 size={17} />{item}</li>)}</ul>
            <div className="refrigeration-package"><h3>Approval package</h3>{[[ClipboardCheck, "Locked control sheet"], [ImageIcon, "Model-linked photos"], [CircleGauge, "Test records"], [PackageCheck, "Pack-out release"]].map(([Icon, label]) => <span key={label}><Icon size={20} />{label}</span>)}</div>
          </article>
        </section>

        <section className="refrigeration-section refrigeration-rfq" id="refrigeration-rfq" aria-labelledby="refrigeration-rfq-title">
          <div className="refrigeration-rfq-intro"><p className="refrigeration-kicker">SCOPED PRODUCT REQUEST</p><h2 id="refrigeration-rfq-title">Start with the duty. Build a comparable equipment brief.</h2><p>Share the category, destination and operating requirements first. Detailed files can follow after our review.</p><div>{[[LockKeyhole, "Confidential", "handling"], [SearchCheck, "Model-first", "comparison"], [Globe2, "Clear", "next steps"]].map(([Icon, first, second]) => <span key={first}><Icon size={22} /><b>{first}</b><small>{second}</small></span>)}</div></div>
          {!submitted ? (
            <form className="refrigeration-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
              <label>Equipment category *<select name="category" value={form.category} onChange={update} required><option>Upright &amp; reach-in</option><option>Counters &amp; prep</option><option>Display refrigeration</option><option>Commercial ice makers</option><option>Mixed cold-side project</option></select></label>
              <label>Destination market *<select name="market" value={form.market} onChange={update} required><option value="">Select region</option><option>Middle East</option><option>West Africa</option><option>Latin America</option><option>Europe</option><option>Other market</option></select></label>
              <label>Buying stage *<select name="stage" value={form.stage} onChange={update} required><option value="">Select stage</option><option>Building a new range</option><option>Fitting out a project</option><option>Replacing a supplier</option><option>Comparing current offers</option><option>Order-ready</option></select></label>
              <label>Temperature or output<select name="temperature" value={form.temperature} onChange={update}><option value="">Select duty</option><option>Chilled</option><option>Frozen</option><option>Dual-zone</option><option>Ice output</option><option>Not defined yet</option></select></label>
              <label>Capacity or service volume<select name="capacity" value={form.capacity} onChange={update}><option value="">Select range</option><option>Compact / undercounter</option><option>Medium commercial</option><option>Large reach-in</option><option>Project schedule</option><option>Not defined yet</option></select></label>
              <label>Cooling or condenser method<select name="cooling" value={form.cooling} onChange={update}><option value="">Select if known</option><option>Direct-cooled</option><option>Fan-assisted</option><option>Air-cooled condenser</option><option>Water-cooled condenser</option><option>Compare suitable options</option></select></label>
              <label className="refrigeration-notes">Operating brief<textarea name="notes" value={form.notes} onChange={update} placeholder="Ambient temperature, daily load, peak service window, utility limits, dimensions, shelf or GN layout, packaging and any model references." /></label>
              <button className="refrigeration-primary refrigeration-submit" type="submit">Prepare refrigeration brief <ArrowRight size={17} /></button>
              <p className="refrigeration-response"><ShieldCheck size={16} /> We review the operating scope before requesting sensitive files.</p>
            </form>
          ) : (
            <div className="refrigeration-success" role="status"><CheckCircle2 size={42} /><div><p className="refrigeration-kicker">SCOPE READY</p><h3>{form.category} · {form.market}</h3><p>Your category, destination and buying stage are ready for the secure DDNZ sourcing brief.</p></div><a className="refrigeration-primary" href={quoteUrl} onClick={persistQuoteDraft}>Continue to secure brief <ArrowRight size={17} /></a><button className="refrigeration-link-button" type="button" onClick={() => setSubmitted(false)}>Edit request</button></div>
          )}
        </section>

        <section className="refrigeration-freight" id="refrigeration-about"><div><Truck size={28} /><p><strong>International freight executed by Heaven Born</strong><span>Operating since 1997.</span></p></div><span>Origin control · upright handling · route coordination · export documents · carrier handoff</span></section>
      </main>

      <ShowcaseContactFooter
        pageKey="refrigeration-equipment"
        description="DDNZ Global coordinates commercial cold-side sourcing, supplier verification, inspection and export handoff from China."
        tagline="Commercial cold-side sourcing"
        links={[{ label: "Before you order", href: "#refrigeration-control" }, { label: "Production & packing", href: "#refrigeration-evidence" }, { label: "Start a brief", href: "#refrigeration-rfq" }]}
      />

      {scoreOpen && (
        <div className="refrigeration-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setScoreOpen(false); }}>
          <section className="refrigeration-modal" role="dialog" aria-modal="true" aria-labelledby="refrigeration-score-title">
            <button type="button" className="refrigeration-modal-close" onClick={() => setScoreOpen(false)} aria-label="Close scoring method"><X size={20} /></button>
            <p className="refrigeration-kicker">SUPPLIER SCORING METHOD</p><h2 id="refrigeration-score-title">Thermal evidence carries more weight than catalogue breadth.</h2>
            <div className="refrigeration-method-grid">{[["30 PTS", "Thermal performance", "Pull-down, hold, recovery and high-ambient evidence."], ["25 PTS", "Specification integrity", "Model, component, electrical and refrigerant consistency."], ["20 PTS", "Factory & service", "Build control, issue response and spare-parts clarity."], ["15 PTS", "Delivery & pack-out", "Lead-time realism, protection and handling control."], ["10 PTS", "Commercial terms", "Like-for-like scope, cost and stated assumptions."]].map(([points, title, copy]) => <article key={title}><span>{points}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
            <div className="refrigeration-veto"><strong>Veto gates</strong><span>Unverified identity</span><span>Model mismatch</span><span>Unresolved refrigerant or electrical gap</span><span>Failed temperature evidence</span></div>
            <button type="button" className="refrigeration-primary" onClick={() => { setScoreOpen(false); scrollTo("refrigeration-rfq"); }}>Use this method for my brief <ArrowRight size={17} /></button>
          </section>
        </div>
      )}
    </div>
  );
}
