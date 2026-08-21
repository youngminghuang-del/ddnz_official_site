import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Box,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleGauge,
  ClipboardCheck,
  Database,
  FileCheck2,
  Globe2,
  Image as ImageIcon,
  Layers3,
  LockKeyhole,
  Menu,
  PackageCheck,
  PlugZap,
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

const A = "/images/product-showcase/refrigeration";

const productFamilies = [
  {
    name: "Upright & reach-in",
    promise: "Hold temperature through a busy service day.",
    image: `${A}/upright-dg860l4-sanitized.webp`,
    imageAlt: "Sanitized stainless-steel four-door upright commercial refrigerator",
    imageLabel: "SANITIZED PRODUCT RENDER",
    icon: Refrigerator,
    operating: ["Restaurants & hotels", "Chilled, frozen or dual-zone", "GN-format and solid-door options"],
    specs: [["Capacity", "860 L source model"], ["Temperature", "1–8°C / −5 to −18°C"], ["Cooling", "Direct-cooled, dual-zone"], ["Refrigerant", "R600a / R290 listed"]],
    source: "DG860L4-A supplier source card",
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
    source: "Product master · KIT-02 family",
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
    source: "Sanitized refrigeration range scene",
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
    source: "SD-50F supplier parameter sheet",
  },
];

const controlPoints = [
  [Database, "Model & source-file lock", "The quotation, sample and order retain one model code, configuration and source sheet."],
  [Thermometer, "Pull-down & hold test", "Temperature recovery, set point and test conditions are recorded—not inferred from the display."],
  [Wind, "Ambient & airflow review", "Climate class, ventilation clearance and condenser direction are checked for the destination kitchen."],
  [PlugZap, "Electrical & refrigerant match", "Voltage, frequency, plug, refrigerant and rated power remain visible in the approval file."],
  [Wrench, "Door, gasket & defrost check", "Door closure, seals, drainage and defrost behavior are checked against the approved unit."],
  [PackageCheck, "Pack-out & handling plan", "Corner protection, crate or carton, upright marks and loading constraints are confirmed before release."],
];

const evidenceTracks = {
  ice: {
    label: "Ice-maker records",
    status: "SOURCE RECORDS AVAILABLE",
    title: "Real source stills, mapped to a narrow claim.",
    copy: "These project-held stills document an ice-maker line and pack-out only. They do not prove production capability for upright cabinets or display refrigeration.",
    visual: `${A}/ice-maker-line-source.webp`,
    visualAlt: "Vertical source still showing commercial ice makers moving along a production line",
    caption: "Project-held source still · ice-maker line · capture date not supplied",
    checks: [
      ["Line-side unit", "Product format is visible in the source still."],
      ["Packed unit", "A separate still records a wrapped unit on a pallet."],
      ["Warehouse context", "Packed ice-maker cartons are visible in the retained record."],
      ["Parameter sheet", "Rated values stay linked to the named SD-50F example."],
    ],
    thumbs: [
      [`${A}/ice-maker-line-source.webp`, "01", "Line record", "Source still retained in project"],
      [`${A}/ice-maker-packout-source.webp`, "02", "Wrapped unit", "Pack-out source still"],
      [`${A}/ice-maker-warehouse-source.webp`, "03", "Warehouse record", "Packed ice-maker cartons"],
      [`${A}/ice-maker-sd50f-spec.webp`, "04", "Parameter sheet", "Supplier-listed example values"],
    ],
  },
  cabinet: {
    label: "Cabinet evidence gaps",
    status: "EVIDENCE REQUEST OPEN",
    title: "Cabinet validation stays open until the records arrive.",
    copy: "The product render and range scene support product selection, not factory proof. The selected cabinet supplier must return model-linked records before approval.",
    visual: `${A}/high-ambient-airflow-diagram.webp`,
    visualAlt: "Illustration of condenser airflow and clearance around an upright refrigerator in a hot kitchen",
    caption: "Control illustration · not a factory record",
    checks: [
      ["Nameplate photo", "Pending from the selected supplier."],
      ["Pull-down log", "Pending with ambient and load conditions."],
      ["Internal build", "Pending evaporator, condenser, gasket and drain photos."],
      ["Final pack-out", "Pending carton or crate and loading evidence."],
    ],
    thumbs: [],
  },
};

function Brand() {
  return (
    <a className="refrigeration-brand" href="/" aria-label="DDNZ Global home">
      <img src="/images/product-showcase/common/ddnz-global-mark.webp" alt="" />
      <span><strong>DDNZ GLOBAL</strong><small>CHINA SOURCING &amp; EXPORT</small></span>
    </a>
  );
}

function Header({ open, setOpen }) {
  return (
    <header className="refrigeration-header">
      <Brand />
      <nav className="refrigeration-desktop-nav" aria-label="Primary navigation">
        <a href="/">Product Sourcing <ChevronDown size={14} /></a>
        <a className="active" href="/refrigeration-equipment">Refrigeration Equipment <ChevronDown size={14} /></a>
        <a href="#refrigeration-control">Our Control Plan</a>
        <a href="#refrigeration-evidence">Evidence</a>
        <a href="#refrigeration-about">About DDNZ</a>
      </nav>
      <button className="refrigeration-menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      {open && (
        <nav className="refrigeration-drawer" aria-label="Mobile navigation">
          <a href="/">Product Sourcing</a>
          <a className="active" href="/refrigeration-equipment">Refrigeration Equipment</a>
          <a href="#refrigeration-control" onClick={() => setOpen(false)}>Our Control Plan</a>
          <a href="#refrigeration-evidence" onClick={() => setOpen(false)}>Evidence status</a>
          <a href="#refrigeration-rfq" onClick={() => setOpen(false)}>Start a scoped request</a>
        </nav>
      )}
    </header>
  );
}

function DotScale({ value }) {
  return <span className="refrigeration-dots" aria-label={`${value} of 5`}>{[1, 2, 3, 4, 5].map((n) => <i className={n <= value ? "filled" : ""} key={n} />)}</span>;
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
      <p className="refrigeration-source"><FileCheck2 size={13} />{item.source}</p>
      <span className="refrigeration-family-index">0{index + 1}</span>
    </article>
  );
}

function EvidencePlaceholder({ index, title, copy }) {
  return (
    <article className="refrigeration-evidence-placeholder">
      <span>{index}</span><ImageIcon size={25} /><h3>{title}</h3><p>{copy}</p><small>SUPPLIER FILE REQUESTED</small>
    </article>
  );
}

export function RefrigerationEquipment() {
  const [menuOpen, setMenuOpen] = useState(false);
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
    return `/get-a-quote?${params.toString()}`;
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
      <Header open={menuOpen} setOpen={setMenuOpen} />

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
            <img src={`${A}/upright-dg860l4-sanitized.webp`} width="1600" height="1600" alt="Sanitized four-door stainless-steel upright refrigeration cabinet" fetchPriority="high" decoding="async" />
            <span className="refrigeration-model-tag"><b>DG860L4-A</b> SOURCE-MAPPED EXAMPLE</span>
            <div className="refrigeration-spec-callout callout-capacity"><strong>860 L</strong><span>effective volume</span></div>
            <div className="refrigeration-spec-callout callout-temp"><strong>2 zones</strong><span>1–8°C / −5 to −18°C</span></div>
            <div className="refrigeration-spec-callout callout-cooling"><strong>Direct cool</strong><span>350 W listed</span></div>
            <p className="refrigeration-render-note">Sanitized product render reconstructed from a supplier source card. Final configuration requires model-linked evidence.</p>
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
          <p className="refrigeration-spec-disclaimer"><AlertCircle size={15} />Representative values are tied to named source records or source families. Verify the final model sheet, test conditions and destination suitability before order release.</p>
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
          <div className="refrigeration-control-head"><div><p className="refrigeration-kicker">REFRIGERATION CONTROL PLAN</p><h2 id="refrigeration-control-title">Release the model only when the cold-chain evidence closes.</h2></div><p>Each checkpoint creates a record that can be traced back to the selected model and destination-market brief.</p></div>
          <div className="refrigeration-control-grid">
            {controlPoints.map(([Icon, title, copy], index) => <article key={title}><span>0{index + 1}</span><Icon size={27} /><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </section>

        <section className="refrigeration-section refrigeration-evidence" id="refrigeration-evidence" aria-labelledby="refrigeration-evidence-title">
          <div className="refrigeration-evidence-head">
            <div><p className="refrigeration-kicker">EVIDENCE STATUS</p><h2 id="refrigeration-evidence-title">Show what exists. Mark what is still missing.</h2><p>Product imagery supports selection. Only source records mapped to a model support approval.</p></div>
            <div className="refrigeration-tabs" role="tablist" aria-label="Refrigeration evidence track">
              {Object.entries(evidenceTracks).map(([key, value]) => <button type="button" role="tab" aria-selected={evidenceKey === key} className={evidenceKey === key ? "active" : ""} onClick={() => setEvidenceKey(key)} key={key}>{value.label}</button>)}
            </div>
          </div>
          <div className={`refrigeration-evidence-stage ${evidenceKey === "cabinet" ? "is-gap" : ""}`}>
            <figure><img key={evidence.visual} src={evidence.visual} alt={evidence.visualAlt} width="1200" height="900" loading="lazy" decoding="async" /><figcaption>{evidence.caption}</figcaption></figure>
            <aside>
              <span className="refrigeration-evidence-status">{evidence.status}</span>
              <h3>{evidence.title}</h3><p>{evidence.copy}</p>
              <div>{evidence.checks.map(([title, copy]) => <span key={title}><CheckCircle2 size={17} /><b>{title}</b><small>{copy}</small></span>)}</div>
            </aside>
          </div>
          {evidence.thumbs.length ? (
            <div className="refrigeration-evidence-thumbs">
              {evidence.thumbs.map(([src, number, title, copy]) => <article key={number}><div><img src={src} alt={`${title}: ${copy}`} width="720" height="720" loading="lazy" decoding="async" /></div><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
            </div>
          ) : (
            <div className="refrigeration-placeholder-grid" aria-label="Pending cabinet evidence">
              <EvidencePlaceholder index="01" title="Nameplate photo" copy="Model, voltage, frequency, phase and refrigerant visible." />
              <EvidencePlaceholder index="02" title="Pull-down log" copy="Ambient, load, start temperature and timed readings recorded." />
              <EvidencePlaceholder index="03" title="Internal build" copy="Condenser, evaporator, drainage, gasket and control details." />
              <EvidencePlaceholder index="04" title="Final pack-out" copy="Protection, dimensions, handling marks and loading condition." />
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
        links={[{ label: "Control plan", href: "#refrigeration-control" }, { label: "Evidence", href: "#refrigeration-evidence" }, { label: "Start a brief", href: "#refrigeration-rfq" }]}
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
