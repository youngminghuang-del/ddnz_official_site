import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BatteryCharging,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  CloudSun,
  FileCheck2,
  Gauge,
  Globe2,
  Menu,
  PackageCheck,
  PlugZap,
  Refrigerator,
  ShieldCheck,
  Ship,
  Snowflake,
  SunMedium,
  TentTree,
  ThermometerSnowflake,
  Truck,
  X,
} from "lucide-react";
import "./outdoor-products.css";
import "./mobile-readability.css";
import ShowcaseSEO from "./ShowcaseSEO";
import ShowcaseContactFooter from "./ShowcaseContactFooter";

const RANGE_FAMILIES = [
  {
    id: "coolers",
    number: "01",
    title: "Insulated coolers",
    short: "Coolers",
    image: "/images/product-showcase/index/outdoor-insulated-cooler-catalog.webp",
    alt: "Unbranded insulated cooler prepared for outdoor vehicle use",
    position: "50% 61%",
    icon: ThermometerSnowflake,
    role: "Seasonal retail · vehicle travel · food and beverage",
    note: "Compare construction and retention claims only after the load, ambient conditions and test method are recorded.",
    variables: ["Capacity and internal dimensions", "Wall, lid and seal construction", "Retention test conditions", "Drain, handle and wheel set", "Unit pack and packed cube"],
  },
  {
    id: "portable-cold",
    number: "02",
    title: "Portable refrigeration",
    short: "Portable cold",
    image: "/images/product-showcase/index/outdoor-portable-refrigerator-catalog.webp",
    alt: "Unbranded portable refrigerator in a camping environment",
    position: "38% 76%",
    icon: Refrigerator,
    role: "Vehicle travel · camping · mobile cold-chain use",
    note: "Lock the compressor, set-point range, pull-down method and power path to the exact sample before comparison.",
    variables: ["Gross and usable capacity", "Temperature range and zones", "Compressor and refrigerant file", "AC, DC and vehicle input set", "Pull-down and runtime method"],
  },
  {
    id: "power-solar",
    number: "03",
    title: "Portable power & solar",
    short: "Power & solar",
    image: "/images/product-showcase/index/outdoor-portable-energy-brand-neutral-v1.webp",
    alt: "Brand-neutral portable power stations and folding solar panels",
    position: "50% 62%",
    icon: BatteryCharging,
    role: "Outdoor retail · emergency backup · mobile work",
    note: "Separate supplier-declared capacity and output from the conditions used for any sample or third-party evidence.",
    variables: ["Cell chemistry and declared capacity", "Rated AC and DC output", "Charging and solar-input range", "Protection and thermal behavior", "Battery, label and transport file"],
  },
  {
    id: "camp-systems",
    number: "04",
    title: "Outdoor camp systems",
    short: "Camp systems",
    image: "/images/product-showcase/outdoor/camp-tent-v1.webp",
    alt: "Unbranded olive and warm-gray family camping tent",
    position: "50% 53%",
    icon: TentTree,
    role: "Camping retail · seasonal ranges · mixed-SKU programs",
    note: "Build a coordinated product set around material, weather exposure, included components and carton constraints.",
    variables: ["Use environment and occupancy", "Fabric, coating and frame set", "Weather-resistance test basis", "Included accessories and repair kit", "Mixed-SKU MOQ and carton plan"],
  },
];

const CONTROL_VARIABLES = [
  { icon: CloudSun, title: "Climate & runtime", copy: "Temperature bands, ambient conditions and typical use duration." },
  { icon: PlugZap, title: "Power path", copy: "Input sources, output options, charging and system compatibility." },
  { icon: FileCheck2, title: "Transport file", copy: "Battery, refrigerant, weights and handling requirements." },
  { icon: PackageCheck, title: "Packed cube", copy: "Carton dimensions, pack volume and container-loading guidance." },
];

const COMPARISON_ROWS = [
  ["Capacity basis", "External + usable volume", "Gross + usable volume", "Declared Wh + usable basis", "Occupancy + floor area"],
  ["Use conditions", "Ambient + load state", "Ambient + set point", "Load + operating mode", "Wind / rain test basis"],
  ["Critical component", "Foam, wall and seal", "Compressor + controller", "Cell + inverter + BMS", "Fabric + coating + frame"],
  ["Evidence requested", "Retention record", "Pull-down / runtime record", "Input-output record", "Material / weather record"],
  ["Export control", "Packed cube", "Refrigerant label file", "Battery transport file", "Component + carton list"],
];

const APPROVAL_STEPS = [
  { number: "01", icon: ClipboardCheck, title: "Define the use case", copy: "Destination climate, channel, duration, power access and range role become the buyer brief." },
  { number: "02", icon: Gauge, title: "Normalize the offer", copy: "Capacity, components, claims, accessories, MOQ and packing are aligned supplier by supplier." },
  { number: "03", icon: ShieldCheck, title: "Approve the sample", copy: "The exact model, method, result, finish and open items stay tied to one approval record." },
  { number: "04", icon: PackageCheck, title: "Release the pack-out", copy: "Labels, documents, packed cube, carton quantities and exceptions are checked before handoff." },
];

const EVIDENCE_CARDS = [
  {
    number: "01",
    image: "/images/product-showcase/index/outdoor-insulated-cooler-catalog.webp",
    alt: "Insulated cooler in an outdoor vehicle-use scene",
    position: "50% 61%",
    title: "Retention basis",
    copy: "Ambient temperature, pre-condition, ice/load mass, openings, duration and endpoints.",
    decision: "Validates how the claim should be compared.",
  },
  {
    number: "02",
    image: "/images/product-showcase/index/outdoor-portable-refrigerator-catalog.webp",
    alt: "Portable refrigerator shown in a camping environment",
    position: "39% 77%",
    title: "Cold-side function",
    copy: "Set point, starting temperature, load, power source, pull-down time and stability.",
    decision: "Locks the exact compressor product and method.",
  },
  {
    number: "03",
    image: "/images/product-showcase/index/outdoor-portable-energy-brand-neutral-v1.webp",
    alt: "Unbranded portable power and solar range in a clean product display",
    position: "50% 61%",
    title: "Power & transport",
    copy: "Declared battery, rated output, input path, protection behavior and transport documents.",
    decision: "Separates catalogue claims from order evidence.",
  },
];

function Brand() {
  return (
    <a className="od-brand" href="/" aria-label="DDNZ Global home">
      <img src="/images/product-showcase/common/ddnz-global-mark.webp" alt="" />
      <span><strong>DDNZ GLOBAL</strong><small>CHINA SOURCING &amp; EXPORT</small></span>
    </a>
  );
}

function Header({ open, setOpen }) {
  return (
    <header className="od-header">
      <Brand />
      <nav className="od-desktop-nav" aria-label="Primary navigation">
        <a href="/products">Product Sourcing <ChevronDown size={13} /></a>
        <a href="/sourcing/commercial-kitchen-equipment-from-china">Commercial Kitchen <ChevronDown size={13} /></a>
        <a href="#approval">Our Control Plan</a>
        <a href="#evidence">Resources <ChevronDown size={13} /></a>
        <a href="#footer">About DDNZ</a>
      </nav>
      <button className="od-menu-button" type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-label="Toggle navigation">
        {open ? <X size={23} /> : <Menu size={23} />}
      </button>
      {open && (
        <nav className="od-mobile-nav" aria-label="Mobile navigation">
          <a href="#range" onClick={() => setOpen(false)}>Browse the range</a>
          <a href="#compare" onClick={() => setOpen(false)}>Compare variables</a>
          <a href="#approval" onClick={() => setOpen(false)}>Review approval path</a>
          <a href="#rfq" onClick={() => setOpen(false)}>Start a request</a>
        </nav>
      )}
    </header>
  );
}

export function OutdoorProducts() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [familyId, setFamilyId] = useState("coolers");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ family: "Mixed outdoor range", market: "", climate: "", useCase: "", stage: "", transport: "", notes: "" });

  useEffect(() => {
    const previous = document.title;
    document.title = "Outdoor Products Sourcing from China | DDNZ Global";
    return () => { document.title = previous; };
  }, []);

  const family = RANGE_FAMILIES.find((item) => item.id === familyId) ?? RANGE_FAMILIES[0];
  const quoteUrl = useMemo(() => {
    const params = new URLSearchParams({
      leadGoal: "Product Sourcing",
      industry: `Outdoor Products - ${form.family}`,
      dest: form.market,
      source: "outdoor_products",
      buyingStage: form.stage,
      climate: form.climate,
      useCase: form.useCase,
      transport: form.transport,
    });
    return `/get-a-quote?${params.toString()}`;
  }, [form]);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  return (
    <div className="outdoor-page">
      <ShowcaseSEO page="outdoor" />
      <a className="od-skip-link" href="#outdoor-main">Skip to outdoor sourcing content</a>
      <Header open={menuOpen} setOpen={setMenuOpen} />

      <main id="outdoor-main">
        <section className="od-hero" aria-labelledby="outdoor-title">
          <div className="od-hero-copy">
            <p className="od-kicker">RANGE ATLAS · OUTDOOR PRODUCTS</p>
            <h1 id="outdoor-title">Build an outdoor range that holds up beyond the catalogue.</h1>
            <p>A coordinated sourcing range across coolers, portable refrigeration, power and camp systems—structured so you can compare capability, market fit and pack-out before you commit.</p>
            <div className="od-hero-actions">
              <button className="od-primary" type="button" onClick={() => scrollTo("rfq")}>Start a scoped request <ArrowRight size={17} /></button>
              <button className="od-secondary" type="button" onClick={() => scrollTo("approval")}>Review the approval path <ArrowRight size={16} /></button>
            </div>
          </div>
          <figure className="od-hero-media">
            <img src="/images/product-showcase/outdoor/range-atlas-hero-v1.webp" width="1010" height="520" alt="Unbranded insulated cooler, portable refrigerator, power station and folding solar panel arranged as an outdoor sourcing range" fetchPriority="high" />
            <figcaption><span>COOLERS</span><span>PORTABLE COLD</span><span>POWER &amp; SOLAR</span></figcaption>
          </figure>
        </section>

        <section className="od-control-strip" aria-label="Outdoor sourcing variables">
          {CONTROL_VARIABLES.map(({ icon: Icon, title, copy }) => (
            <article key={title}><span><Icon size={22} /></span><div><h2>{title}</h2><p>{copy}</p></div></article>
          ))}
        </section>

        <section className="od-section od-range" id="range" aria-labelledby="range-title">
          <div className="od-range-selector">
            <div className="od-range-intro">
              <p className="od-kicker">STEP 1</p>
              <h2 id="range-title">Choose a range to explore</h2>
              <p>Filter the atlas by product group to compare capability and configuration.</p>
            </div>
            <div className="od-range-tabs" role="tablist" aria-label="Outdoor product families">
              {RANGE_FAMILIES.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} type="button" role="tab" aria-selected={familyId === item.id} className={familyId === item.id ? "active" : ""} onClick={() => setFamilyId(item.id)}>
                    <img src={item.image} alt="" aria-hidden="true" style={{ objectPosition: item.position }} />
                    <span><Icon size={18} /><i>{item.number}</i></span>
                    <strong>{item.short}</strong>
                    <ChevronRight size={17} />
                  </button>
                );
              })}
            </div>
          </div>
          <article className="od-family-panel" role="tabpanel" key={family.id}>
            <figure><img src={family.image} alt={family.alt} style={{ objectPosition: family.position }} /></figure>
            <div className="od-family-copy">
              <p className="od-kicker">{family.number} · CURRENT RANGE</p>
              <h2>{family.title}</h2>
              <span className="od-role"><Globe2 size={16} /> {family.role}</span>
              <p>{family.note}</p>
              <div className="od-family-variables">
                <h3>Lock before comparing price</h3>
                {family.variables.map((item) => <span key={item}><Check size={14} />{item}</span>)}
              </div>
              <button className="od-secondary" type="button" onClick={() => { setForm((current) => ({ ...current, family: family.title })); scrollTo("rfq"); }}>Scope this range <ArrowRight size={16} /></button>
            </div>
          </article>
        </section>

        <section className="od-section od-compare" id="compare" aria-labelledby="compare-title">
          <div className="od-section-heading">
            <div><p className="od-kicker">LIKE-FOR-LIKE COMPARISON</p><h2 id="compare-title">The product changes. The decision discipline stays visible.</h2></div>
            <p>Headline specifications are kept separate from the method, evidence and export file needed to support the order.</p>
          </div>
          <div className="od-comparison-ledger" role="table" aria-label="Outdoor product comparison variables">
            <div className="od-comparison-row od-comparison-head" role="row">
              <span role="columnheader">VARIABLE</span>
              {RANGE_FAMILIES.map((item) => <span role="columnheader" key={item.id}>{item.short}</span>)}
            </div>
            {COMPARISON_ROWS.map(([label, ...values]) => (
              <div className="od-comparison-row" role="row" key={label}>
                <strong role="rowheader">{label}</strong>
                {values.map((value, index) => <span role="cell" data-family={RANGE_FAMILIES[index].short} key={value}><CheckCircle2 size={14} />{value}</span>)}
              </div>
            ))}
          </div>
          <p className="od-comparison-note"><ShieldCheck size={16} /> Test results are not assumed. The supplier’s declared claim, the requested method and the returned evidence keep separate status.</p>
        </section>

        <section className="od-section od-approval" id="approval" aria-labelledby="approval-title">
          <div className="od-section-heading">
            <div><p className="od-kicker">CONTROLLED APPROVAL PATH</p><h2 id="approval-title">From use case to export-ready release.</h2></div>
            <p>Each gate returns a record to the buyer so changes, exceptions and approvals stay traceable.</p>
          </div>
          <div className="od-approval-steps">
            {APPROVAL_STEPS.map(({ number, icon: Icon, title, copy }) => (
              <article key={number}><span><Icon size={23} /></span><i>{number}</i><h3>{title}</h3><p>{copy}</p><small><FileCheck2 size={13} /> Buyer record returned</small></article>
            ))}
          </div>
        </section>

        <section className="od-section od-evidence" id="evidence" aria-labelledby="evidence-title">
          <div className="od-section-heading">
            <div><p className="od-kicker">EVIDENCE PLAN</p><h2 id="evidence-title">Ask for evidence that answers a buying decision.</h2></div>
            <p>These images show the product context. The evidence fields below define what a supplier must return for the exact model.</p>
          </div>
          <div className="od-evidence-grid">
            {EVIDENCE_CARDS.map((item) => (
              <article key={item.number}>
                <figure><img src={item.image} alt={item.alt} style={{ objectPosition: item.position }} /><figcaption>{item.number}</figcaption></figure>
                <div><h3>{item.title}</h3><p>{item.copy}</p><span><CheckCircle2 size={15} />{item.decision}</span><small>STATUS · REQUEST WITH SAMPLE</small></div>
              </article>
            ))}
          </div>
        </section>

        <section className="od-section od-decision" aria-label="Supplier and export controls">
          <article className="od-supplier-preview">
            <div><p className="od-kicker">SUPPLIER DECISION PREVIEW</p><h2>Compare fit, evidence and release readiness.</h2></div>
            <div className="od-supplier-table">
              <div className="od-supplier-row heading"><span>SUPPLIER</span><span>RANGE FIT</span><span>SAMPLE</span><span>TECHNICAL FILE</span><span>OPEN ITEM</span></div>
              {[
                ["Supplier A", "Cooler + cold", "Returned", "In review", "Retention method"],
                ["Supplier B", "Power + solar", "Requested", "Partial", "Battery file"],
                ["Supplier C", "Mixed range", "Returned", "Comparable", "Pack cube"],
              ].map((row) => <div className="od-supplier-row" key={row[0]}>{row.map((value, index) => <span data-label={["Supplier", "Range fit", "Sample", "Technical file", "Open item"][index]} key={value}>{value}</span>)}</div>)}
            </div>
            <p><ShieldCheck size={15} /> Illustrative comparison only. Supplier identity and status are verified per project.</p>
          </article>
          <article className="od-release-card">
            <p className="od-kicker">DESTINATION &amp; EXPORT FILE</p>
            <h2>Release the product set and the documents together.</h2>
            <ul>
              {["Approved SKU and accessory list", "Battery or refrigerant document status", "Destination labels and user information", "Packed dimensions and carton quantities", "Inspection, exception and release record"].map((item) => <li key={item}><CheckCircle2 size={16} />{item}</li>)}
            </ul>
            <span><Ship size={22} /><b>Origin-side handoff</b><small>Ready for freight coordination</small></span>
          </article>
        </section>

        <section className="od-section od-rfq" id="rfq" aria-labelledby="rfq-title">
          <div className="od-rfq-intro">
            <p className="od-kicker">SCOPED OUTDOOR REQUEST</p>
            <h2 id="rfq-title">Define the use case. Receive a comparable range.</h2>
            <p>Start with product family, destination climate, typical use and buying stage. Detailed specifications can follow after the first review.</p>
            <div className="od-rfq-trust">
              <span><ShieldCheck size={21} /><b>Controlled</b><small>supplier outreach</small></span>
              <span><FileCheck2 size={21} /><b>Recorded</b><small>approval evidence</small></span>
              <span><Globe2 size={21} /><b>Destination-led</b><small>export planning</small></span>
            </div>
          </div>
          {!submitted ? (
            <form className="od-rfq-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
              <label>Product family *<select name="family" value={form.family} onChange={update} required><option>Mixed outdoor range</option>{RANGE_FAMILIES.map((item) => <option key={item.id}>{item.title}</option>)}</select></label>
              <label>Destination market *<input name="market" value={form.market} onChange={update} placeholder="Country or region" required /></label>
              <label>Destination climate *<select name="climate" value={form.climate} onChange={update} required><option value="">Select climate</option><option>Hot and humid</option><option>Hot and dry</option><option>Temperate</option><option>Cold / high altitude</option><option>Multiple markets</option></select></label>
              <label>Typical use case *<select name="useCase" value={form.useCase} onChange={update} required><option value="">Select use case</option><option>Retail seasonal range</option><option>Vehicle travel</option><option>Camping and leisure</option><option>Emergency backup</option><option>Commercial / mobile work</option></select></label>
              <label>Buying stage *<select name="stage" value={form.stage} onChange={update} required><option value="">Select stage</option><option>Building a new range</option><option>Comparing current offers</option><option>Replacing a supplier</option><option>Sample ready</option><option>Order ready</option></select></label>
              <label>Preferred transport<select name="transport" value={form.transport} onChange={update}><option value="">Select mode</option><option>Sea freight</option><option>Air freight</option><option>Mixed / not decided</option></select></label>
              <label className="od-notes">Requirements and known specifications<textarea name="notes" value={form.notes} onChange={update} placeholder="Target capacity, runtime, power inputs, SKU mix, quantities, packaging and any supplier offers already received." /></label>
              <button className="od-primary od-submit" type="submit">Prepare sourcing brief <ArrowRight size={17} /></button>
              <p className="od-form-note"><ShieldCheck size={15} /> We review the scope before requesting sensitive project files.</p>
            </form>
          ) : (
            <div className="od-rfq-success" role="status">
              <CheckCircle2 size={43} />
              <div><p className="od-kicker">SCOPE READY</p><h3>{form.family} · {form.market}</h3><p>Your outdoor family, climate, use case and buying stage are ready for the secure DDNZ sourcing brief.</p></div>
              <a className="od-primary" href={quoteUrl}>Continue to secure brief <ArrowRight size={17} /></a>
              <button className="od-secondary" type="button" onClick={() => setSubmitted(false)}>Edit request</button>
            </div>
          )}
        </section>

        <section className="od-freight">
          <div><Truck size={28} /><p><strong>International freight executed by Heaven Born</strong><span>Operating since 1997.</span></p></div>
          <span>Origin control · route coordination · export documents · carrier handoff</span>
        </section>
      </main>

      <ShowcaseContactFooter
        footerId="footer"
        pageKey="outdoor-products"
        description="DDNZ Global coordinates outdoor-product sourcing, supplier comparison, sample evidence and export handoff from China."
        tagline="Outdoor product sourcing"
        links={[{ label: "Products", href: "/products" }, { label: "Sourcing services", href: "/sourcing-services" }, { label: "Start a request", href: "#rfq" }]}
        note="Outdoor Products representative page · illustrative sourcing workflow"
      />
    </div>
  );
}
