import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BatteryCharging,
  Bluetooth,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileCheck2,
  Gauge,
  Globe2,
  Menu,
  Mic2,
  PackageCheck,
  Radio,
  ShieldCheck,
  SlidersHorizontal,
  Speaker,
  Truck,
  Volume2,
  X,
} from "lucide-react";
import "./audio-speakers.css";
import "./mobile-readability.css";
import ShowcaseSEO from "./ShowcaseSEO";
import ShowcaseContactFooter from "./ShowcaseContactFooter";
import SourcingHomepageNav from "../../components/SourcingHomepageNav";

const FAMILIES = [
  {
    id: "portable-party",
    number: "01",
    title: "Portable & party",
    note: "High-visibility ranges with microphones, lighting and multiple power paths.",
    image: "/images/product-showcase/index/audio-speakers-category.webp",
    alt: "Three unbranded portable party speakers with microphones and remote controls",
    width: 1200,
    height: 800,
    label: "Assortment range",
    use: "Entertainment retail · events · regional distribution",
    variables: ["Rated / peak output basis", "AC, charging and battery path", "Wireless and input functions", "Microphones, remote and cables"],
  },
  {
    id: "vintage-lifestyle",
    number: "02",
    title: "Vintage & lifestyle",
    note: "Material-led speakers where cabinet, control feel and finish drive the range.",
    image: "/images/product-showcase/audio/vintage-range-hero-v1.webp",
    alt: "Wood-finish portable speaker with a handle among a broader vintage speaker range",
    width: 1000,
    height: 1333,
    label: "Finish direction",
    use: "Lifestyle retail · gifting · interior-led collections",
    variables: ["Cabinet material and finish", "Control and input layout", "Driver and enclosure record", "Colorway and retail-pack plan"],
  },
  {
    id: "mini-giftable",
    number: "03",
    title: "Mini & giftable",
    note: "Compact, feature-led units that need exact battery, charging and pack definitions.",
    image: "/images/product-showcase/audio/mini-black-product-v1.webp",
    alt: "Compact unbranded black speaker with a top light chamber and large tactile controls",
    width: 1000,
    height: 1000,
    label: "Clean model view",
    use: "Convenience retail · gifting · test-order assortments",
    variables: ["Battery and charge input", "Lighting and mode sequence", "Strap, cable and included set", "Unit pack and mixed-color MOQ"],
  },
];

const NORMALIZATION_FIELDS = [
  { icon: Volume2, title: "Output declaration", copy: "Record continuous (rated) and peak output separately, together with the supplier's stated measurement basis." },
  { icon: BatteryCharging, title: "Power & battery", copy: "Separate AC input, adapter, charging input, cell/capacity and runtime conditions." },
  { icon: Bluetooth, title: "Wireless & inputs", copy: "List the wireless version, supported playback inputs, pairing behavior and available radio and compliance documents." },
  { icon: Mic2, title: "Microphone set", copy: "Confirm wired or wireless microphones, quantity, frequency information and included batteries." },
  { icon: SlidersHorizontal, title: "Functions & controls", copy: "Lock lighting, EQ, recording, priority and control-panel behavior to the exact model." },
  { icon: PackageCheck, title: "Pack-out", copy: "Tie accessories, labels, unit pack, carton quantity and packed dimensions to the approved SKU." },
];

const SAMPLE_STEPS = [
  { number: "01", icon: ClipboardCheck, title: "Reference brief", copy: "Use case, target channel, price position and must-have functions are recorded." },
  { number: "02", icon: SlidersHorizontal, title: "Configuration lock", copy: "Model, cabinet, power path, accessories and label requirements become one baseline." },
  { number: "03", icon: Gauge, title: "Sample evidence", copy: "Requested function, playback, charging, finish and accessory checks are returned with open items." },
  { number: "04", icon: PackageCheck, title: "Release record", copy: "Approved sample references, pack-out, documents and exceptions stay tied to the order." },
];

const SUPPLIER_PREVIEW = [
  { name: "Supplier A", fit: "Party range", sample: "Returned", file: "In review", exception: "Battery file pending" },
  { name: "Supplier B", fit: "Vintage range", sample: "Returned", file: "Comparable", exception: "Finish code to lock" },
  { name: "Supplier C", fit: "Mini range", sample: "Requested", file: "Partial", exception: "Pack set unclear" },
];

const FACTORY_EVIDENCE = [
  {
    number: "01",
    className: "as-factory-wide",
    video: "/images/product-showcase/audio/oem-production-line-v1.mp4",
    poster: "/images/product-showcase/audio/oem-production-line-poster-v1.webp",
    title: "Line & component assembly",
    copy: "Workstation flow, unit handling and component assembly from the supplied OEM factory footage.",
    label: "Play shortened production-line evidence",
  },
  {
    number: "02",
    className: "as-factory-portrait",
    video: "/images/product-showcase/audio/function-light-check-v1.mp4",
    poster: "/images/product-showcase/audio/function-light-check-poster-v1.webp",
    title: "Lighting-mode check",
    copy: "Visible mode cycling at the line. This clip does not claim sound-pressure, battery-runtime or certification results.",
    label: "Play shortened lighting-mode check",
  },
  {
    number: "03",
    className: "as-factory-portrait",
    video: "/images/product-showcase/audio/form-assembly-line-v1.mp4",
    poster: "/images/product-showcase/audio/form-assembly-line-poster-v1.webp",
    title: "Form-specific assembly",
    copy: "Open housings, drivers, control panels and completed units stay visible as separate assembly states.",
    label: "Play shortened form-specific assembly evidence",
  },
];

function Brand() {
  return (
    <a className="as-brand" href="/products/" aria-label="DDNZ Global product sourcing">
      <img src="/images/product-showcase/common/ddnz-global-mark.webp" alt="" />
      <span><strong>DDNZ GLOBAL</strong><small>CHINA SOURCING &amp; EXPORT</small></span>
    </a>
  );
}

function Header({ open, setOpen }) {
  const close = () => setOpen(false);
  return (
    <header className="as-header">
      <Brand />
      <nav className="as-desktop-nav" aria-label="Audio and speakers navigation">
        <a href="/products/">Product Sourcing</a>
        <a className="active" href="#audio-range">Audio &amp; Speakers</a>
        <a href="#comparison">Comparison Desk</a>
        <a href="#sample-control">Sample Control</a>
        <a href="#audio-rfq">Start a Brief</a>
      </nav>
      <button className="as-menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation" aria-expanded={open}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      {open && (
        <nav className="as-mobile-nav" aria-label="Mobile audio and speakers navigation">
          <a href="/products/" onClick={close}>Product sourcing</a>
          <a href="#audio-range" onClick={close}>Audio range</a>
          <a href="#comparison" onClick={close}>Comparison desk</a>
          <a href="#sample-control" onClick={close}>Sample control</a>
          <a href="#audio-rfq" onClick={close}>Start a brief</a>
        </nav>
      )}
    </header>
  );
}

function HeroWall() {
  return (
    <div className="as-hero-wall" aria-label="Audio speaker range examples">
      <div className="as-wall-heading">
        <span>CURATED AUDIO RANGE</span>
        <small>Use case · output · power · pack</small>
      </div>
      <figure className="as-wall-party as-wall-primary">
        <img src="/images/product-showcase/index/audio-speakers-category.webp" width="1200" height="800" alt="Unbranded party speakers with microphones and remotes" />
        <figcaption><span>01</span><div><strong>Portable &amp; party</strong><small>Output · power · accessory set</small></div><em>Lead range</em></figcaption>
      </figure>
      <div className="as-wall-support">
        <figure className="as-wall-vintage">
          <img src="/images/product-showcase/audio/vintage-range-hero-v1.webp" width="1000" height="1333" alt="Wood-finish handled speaker in a vintage audio range" />
          <figcaption><span>02</span><div><strong>Vintage &amp; lifestyle</strong><small>Material · finish · controls</small></div></figcaption>
        </figure>
        <figure className="as-wall-mini">
          <img src="/images/product-showcase/audio/mini-black-product-v1.webp" width="1000" height="1000" alt="Compact unbranded black speaker with a top light chamber" />
          <figcaption><span>03</span><div><strong>Mini &amp; giftable</strong><small>Battery · charge · pack</small></div></figcaption>
        </figure>
      </div>
      <p className="as-wall-record"><span>RANGE CONTROL</span><strong>Use case before model</strong><small>Illustrative buying path</small></p>
    </div>
  );
}

function FamilyPanel({ family }) {
  return (
    <div className="as-family-panel" id="audio-family-panel" role="tabpanel" aria-label={`${family.title} buying variables`}>
      <div className={`as-family-image ${family.id === "mini-giftable" ? "as-family-image-contain" : ""}`}>
        <img src={family.image} width={family.width} height={family.height} alt={family.alt} loading="lazy" decoding="async" />
        <span>{family.label}</span>
      </div>
      <div className="as-family-copy">
        <p className="as-kicker">{family.number} · ACTIVE RANGE</p>
        <h3>{family.title}</h3>
        <p>{family.note}</p>
        <div className="as-use-case"><Radio size={17} /><span><small>Buyer use case</small><strong>{family.use}</strong></span></div>
        <div className="as-variable-list">
          <small>LOCK BEFORE COMPARING OFFERS</small>
          {family.variables.map((variable) => <span key={variable}><CheckCircle2 size={15} />{variable}</span>)}
        </div>
      </div>
    </div>
  );
}

export function AudioSpeakers() {
  const [activeFamily, setActiveFamily] = useState(FAMILIES[0].id);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ family: FAMILIES[0].id, destination: "", scope: "", volume: "", stage: "", notes: "" });
  const family = FAMILIES.find((item) => item.id === activeFamily) || FAMILIES[0];

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Audio & Speaker Sourcing from China | DDNZ Global";
    return () => { document.title = previousTitle; };
  }, []);

  const quoteUrl = useMemo(() => {
    const selected = FAMILIES.find((item) => item.id === form.family);
    const params = new URLSearchParams({
      leadGoal: "Product Sourcing",
      industry: `Audio & Speakers · ${selected?.title || "Audio range"}`,
      productScope: form.scope,
      dest: form.destination,
      orderVolume: form.volume,
      buyingStage: form.stage,
      notes: form.notes,
      source: "audio_speakers",
    });
    return `/get-a-quote/?${params.toString()}`;
  }, [form]);

  const scrollTo = (id) => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  const selectFamily = (id) => {
    setActiveFamily(id);
    setForm((current) => ({ ...current, family: id }));
  };

  const updateForm = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  return (
    <div className="audio-speakers-page" id="audio-top">
      <ShowcaseSEO page="audio" />
      <a className="as-skip-link" href="#audio-main">Skip to audio sourcing content</a>
      <SourcingHomepageNav />

      <main id="audio-main">
        <section className="as-hero" aria-labelledby="audio-title">
          <div className="as-hero-copy">
            <p className="as-kicker">AUDIO &amp; SPEAKER SOURCING · RANGE CONTROL</p>
            <h1 id="audio-title">Build an audio range buyers can hear, compare and reorder.</h1>
            <p>DDNZ structures portable, party, vintage and compact speaker sourcing around the intended use, declared output, power path, included accessories and retail pack—so the quotation, approved sample and shipped configuration stay aligned.</p>
            <div className="as-hero-actions">
              <button className="as-primary" type="button" onClick={() => scrollTo("audio-range")}>Build the range <ArrowRight size={17} /></button>
              <button className="as-secondary" type="button" onClick={() => scrollTo("comparison")}>Review the control fields <ArrowRight size={16} /></button>
            </div>
            <div className="as-proof-row" aria-label="Audio sourcing controls">
              <span><Speaker size={20} /><b>Range-led</b><small>by use case</small></span>
              <span><SlidersHorizontal size={20} /><b>Comparable</b><small>configuration</small></span>
              <span><FileCheck2 size={20} /><b>Recorded</b><small>sample evidence</small></span>
              <span><PackageCheck size={20} /><b>Accountable</b><small>pack-out</small></span>
            </div>
          </div>
          <HeroWall />
        </section>

        <section className="as-control-strip" aria-label="Audio buying variables">
          <article><span>01</span><div><strong>Use environment</strong><small>Home · outdoor · event · gift</small></div></article>
          <article><span>02</span><div><strong>Output &amp; power</strong><small>Declaration · AC · battery</small></div></article>
          <article><span>03</span><div><strong>Functions &amp; set</strong><small>Inputs · microphone · lighting</small></div></article>
          <article><span>04</span><div><strong>Label &amp; pack</strong><small>Destination · accessories · carton</small></div></article>
        </section>

        <section className="as-section as-range" id="audio-range" aria-labelledby="audio-range-title">
          <div className="as-section-heading">
            <div><p className="as-kicker">BUILD THE SELLABLE RANGE</p><h2 id="audio-range-title">Start with the retail role. Then choose the model.</h2></div>
            <p>One speaker cannot represent every channel. The right comparison begins by separating high-visibility party systems, material-led lifestyle products and compact giftable units.</p>
          </div>
          <div className="as-family-tabs" role="tablist" aria-label="Audio product families">
            {FAMILIES.map((item) => (
              <button type="button" role="tab" aria-selected={activeFamily === item.id} aria-controls="audio-family-panel" className={activeFamily === item.id ? "active" : ""} onClick={() => selectFamily(item.id)} key={item.id}>
                <span>{item.number}</span><strong>{item.title}</strong><small>{item.note}</small><ChevronRight size={18} />
              </button>
            ))}
          </div>
          <FamilyPanel family={family} />
          <aside className="as-range-note"><Mic2 size={20} /><p><strong>Microphones and accessories are controlled as part of the exact speaker set.</strong><span>Quantity, connection type, frequency information, remote, cables and adapters must match the approved pack—not merely the catalogue photograph.</span></p></aside>
        </section>

        <section className="as-comparison" id="comparison" aria-labelledby="comparison-title">
          <div className="as-section as-comparison-inner">
            <div className="as-comparison-heading">
              <div><p className="as-kicker">AUDIO COMPARISON DESK</p><h2 id="comparison-title">Turn catalogue claims into one comparable control file.</h2></div>
              <p>DDNZ requests the same buying fields from each shortlisted supplier, records what is supplier-declared and flags what still needs sample or document evidence.</p>
            </div>
            <div className="as-ledger">
              <div className="as-ledger-title"><span><SlidersHorizontal size={20} /></span><div><small>ILLUSTRATIVE FIELD MAP</small><strong>Exact-model audio specification ledger</strong></div><em>Example—not live order evidence</em></div>
              <div className="as-ledger-grid">
                {NORMALIZATION_FIELDS.map(({ icon: Icon, title, copy }, index) => (
                  <article key={title}><span><Icon size={20} /></span><small>0{index + 1}</small><h3>{title}</h3><p>{copy}</p></article>
                ))}
              </div>
              <div className="as-ledger-note"><ShieldCheck size={17} /> No performance claim is treated as approved until its source, model and evidence status are visible.</div>
            </div>
          </div>
        </section>

        <section className="as-section as-sample" id="sample-control" aria-labelledby="sample-title">
          <div className="as-sample-copy">
            <p className="as-kicker">SAMPLE &amp; APPROVAL CONTROL</p>
            <h2 id="sample-title">Listening matters. A repeatable record matters more.</h2>
            <p>A buyer can like a sample and still receive a different cabinet, battery, microphone set or pack. The approval path keeps the commercial sample tied to the exact order baseline and its open items.</p>
            <div className="as-sample-output"><FileCheck2 size={20} /><p><small>BUYER RECORD RETURNED</small><strong>Sample checklist · annotated evidence · open-item log · approval status</strong></p></div>
          </div>
          <div className="as-sample-steps">
            {SAMPLE_STEPS.map(({ number, icon: Icon, title, copy }) => <article key={number}><span><Icon size={20} /></span><small>{number}</small><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </section>

        <section className="as-factory" id="factory-evidence" aria-labelledby="factory-evidence-title">
          <div className="as-section">
            <div className="as-factory-heading">
              <div><p className="as-kicker">FACTORY &amp; FUNCTION EVIDENCE</p><h2 id="factory-evidence-title">See the checkpoint each factory clip actually documents.</h2></div>
              <p>Each clip is tied to one production checkpoint. Model-specific results, dates, exceptions and open items remain in the buyer record.</p>
            </div>
            <div className="as-factory-grid">
              {FACTORY_EVIDENCE.map((item) => (
                <article className={item.className} key={item.number}>
                  <video controls muted playsInline preload="metadata" poster={item.poster} aria-label={item.label}>
                    <source src={item.video} type="video/mp4" />
                  </video>
                  <div><span>{item.number}</span><p><strong>{item.title}</strong><small>{item.copy}</small></p></div>
                </article>
              ))}
            </div>
            <p className="as-factory-note"><ShieldCheck size={17} />Video presence is not the approval record. The buyer record still needs the model, checkpoint, result, date and open items.</p>
          </div>
        </section>

        <section className="as-evidence" aria-labelledby="evidence-title">
          <div className="as-section">
            <div className="as-evidence-heading"><div><p className="as-kicker">PRODUCT EVIDENCE</p><h2 id="evidence-title">Each image should verify one buying decision.</h2></div><p>Product images are reviewed separately from factory footage so buyers can verify form, finish, controls and the exact supplied configuration.</p></div>
            <div className="as-evidence-grid">
              <article className="as-evidence-wide"><img src="/images/product-showcase/audio/vintage-range-hero-v1.webp" width="1000" height="1333" alt="Wood-finish speaker with handle and surrounding vintage speaker range" loading="lazy" /><div><span>01</span><p><strong>Range &amp; finish review</strong><small>Cabinet form, finish direction and collection fit</small></p></div></article>
              <article><img src="/images/product-showcase/audio/vintage-gramophone-detail-v1.webp" width="960" height="960" alt="Vintage-style gramophone speaker horn and wood-finish cabinet detail" loading="lazy" /><div><span>02</span><p><strong>Horn &amp; cabinet detail</strong><small>Horn geometry, grille pattern and wood-finish enclosure</small></p></div></article>
              <article><img src="/images/product-showcase/audio/vintage-horn-detail-v1.webp" width="960" height="960" alt="Flower-shaped horn on a compact wood-finish speaker" loading="lazy" /><div><span>03</span><p><strong>Horn profile &amp; finish</strong><small>Horn shape, surface finish and cabinet proportion</small></p></div></article>
              <article className="as-evidence-mini as-evidence-product"><img src="/images/product-showcase/audio/mini-black-product-v1.webp" width="1000" height="1000" alt="Compact unbranded black speaker showing its top light chamber and controls" loading="lazy" /><div><span>04</span><p><strong>Compact model view</strong><small>Form, control scale, light chamber and visible USB-C input</small></p></div></article>
            </div>
          </div>
        </section>

        <section className="as-section as-supplier" aria-labelledby="supplier-title">
          <div className="as-supplier-heading"><div><p className="as-kicker">SUPPLIER DECISION PREVIEW</p><h2 id="supplier-title">Compare specification completeness before negotiating price.</h2></div><p>Illustrative status only. A real shortlist is built from the buyer brief and verified supplier responses.</p></div>
          <div className="as-supplier-grid">
            {SUPPLIER_PREVIEW.map((supplier, index) => (
              <article key={supplier.name}>
                <div><span>0{index + 1}</span><small>ILLUSTRATIVE</small></div><h3>{supplier.name}</h3>
                <dl><div><dt>Range fit</dt><dd>{supplier.fit}</dd></div><div><dt>Sample</dt><dd>{supplier.sample}</dd></div><div><dt>Comparison file</dt><dd>{supplier.file}</dd></div><div><dt>Open item</dt><dd>{supplier.exception}</dd></div></dl>
              </article>
            ))}
          </div>
          <div className="as-supplier-rule"><ShieldCheck size={20} /><p><strong>A low quote with missing specifications is not yet comparable.</strong><span>DDNZ separates price, configuration, evidence status, exclusions and destination readiness before a commercial decision.</span></p></div>
        </section>

        <section className="as-section as-rfq" id="audio-rfq" aria-labelledby="audio-rfq-title">
          <div className="as-rfq-intro">
            <p className="as-kicker">SCOPED AUDIO REQUEST</p>
            <h2 id="audio-rfq-title">Define the range you want to build.</h2>
            <p>Start with the product family, destination, approximate volume and buying stage. Detailed specifications and reference files can follow after the sourcing-fit review.</p>
            <div><span><Globe2 size={18} /><b>Destination captured early</b></span><span><ShieldCheck size={18} /><b>Secure inquiry handoff</b></span></div>
          </div>
          {!submitted ? (
            <form className="as-rfq-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
              <label htmlFor="as-family">Audio family *<select id="as-family" name="family" value={form.family} onChange={updateForm} required>{FAMILIES.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}</select></label>
              <label htmlFor="as-destination">Destination market *<input id="as-destination" name="destination" value={form.destination} onChange={updateForm} placeholder="Country or region" required /></label>
              <label className="as-wide" htmlFor="as-scope">Product scope *<input id="as-scope" name="scope" value={form.scope} onChange={updateForm} placeholder="Use case, models, functions, microphones or pack needs" required /></label>
              <label htmlFor="as-volume">Approximate volume<input id="as-volume" name="volume" value={form.volume} onChange={updateForm} placeholder="Per model or mixed order" /></label>
              <label htmlFor="as-stage">Buying stage *<select id="as-stage" name="stage" value={form.stage} onChange={updateForm} required><option value="">Select stage</option><option>Exploring an audio range</option><option>Comparing supplier offers</option><option>Sample / specification stage</option><option>Test order or replenishment</option><option>Order-ready</option></select></label>
              <label className="as-wide" htmlFor="as-notes">Priorities or constraints<input id="as-notes" name="notes" value={form.notes} onChange={updateForm} placeholder="Target position, timeline, certification or private-label needs" /></label>
              <button className="as-primary" type="submit">Prepare audio brief <ArrowRight size={17} /></button>
              <p className="as-form-note"><ShieldCheck size={15} /> Review and submit your details on DDNZ’s secure inquiry page.</p>
            </form>
          ) : (
            <div className="as-rfq-success" role="status"><CheckCircle2 size={42} /><div><p className="as-kicker">AUDIO SCOPE READY</p><h3>{FAMILIES.find((item) => item.id === form.family)?.title}</h3><p>Your range, destination and buying stage are ready for the centralized DDNZ brief.</p></div><a className="as-primary" href={quoteUrl}>Continue to secure brief <ArrowRight size={17} /></a><button className="as-secondary" type="button" onClick={() => setSubmitted(false)}>Edit request</button></div>
          )}
        </section>

        <section className="as-handoff" aria-label="Freight handoff">
          <div><Truck size={28} /><p><strong>International freight executed by Heaven Born</strong><span>Engaged after the approved sourcing and pack-out file is ready</span></p></div><span>DDNZ remains the sourcing coordination team</span>
        </section>
      </main>

      <ShowcaseContactFooter
        pageKey="audio-speakers"
        description="Audio-range sourcing, exact-model comparison, sample evidence and export handoff from China."
        tagline="Audio and speaker sourcing"
        links={[{ label: "Products", href: "/products/" }, { label: "Control fields", href: "#comparison" }, { label: "Start a brief", href: "#audio-rfq" }]}
        note="Illustrative records are replaced by order-specific evidence after the buyer brief"
      />
    </div>
  );
}

export default AudioSpeakers;
