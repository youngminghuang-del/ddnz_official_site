import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BatteryCharging,
  Box,
  Cable,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  FileCheck2,
  Globe2,
  Image as ImageIcon,
  LockKeyhole,
  Menu,
  PackageCheck,
  Pause,
  Play,
  Plug,
  SearchCheck,
  ShieldCheck,
  Smartphone,
  TestTubeDiagonal,
  Truck,
  X,
  Zap,
} from "lucide-react";
import "./mobile.css";
import "./mobile-readability.css";
import ShowcaseSEO from "./ShowcaseSEO";
import ShowcaseContactFooter from "./ShowcaseContactFooter";

const A = "/images/product-showcase/mobile";
const H = A;

const heroProducts = [
  ["f2", "f2-leather-fold-transparent-v1.webp", 1148, 938],
  ["p4", "p4-30000-powerbank-transparent-v1.webp", 795, 1158],
  ["c1s", "c1s-perforated-case-transparent-v1.webp", 563, 1109],
  ["p2", "p2-cabled-powerbank-transparent-v1.webp", 654, 784],
  ["p1", "p1-magnetic-powerbank-transparent-v1.webp", 840, 851],
  ["p5", "p5-outdoor-powerbank-transparent-v1.webp", 512, 1096],
  ["a1", "a1-car-adapter-transparent-v1.webp", 775, 920],
  ["s1", "s1-wallet-stand-transparent-v1.webp", 755, 1093],
  ["g1", "g1-tempered-glass-transparent-v1.webp", 616, 1337],
];

const productFamilies = [
  {
    name: "Phone cases",
    promise: "Protection that sells.",
    price: ["$0.60 – $1.20", "$1.20 – $2.50", "$2.50 – $5.00+"],
    image: `${A}/family-phone-cases-v1.webp`,
    imageAlt: "Six unbranded magnetic ring phone cases in different colorways",
    imageLabel: "COLORWAY RANGE",
    imageSize: [1200, 1200],
    position: "50% 50%",
    icon: Smartphone,
    sell: [4, 4, 4, 5],
    specs: ["Model matrix", "Finish options", "Drop-test plan", "Retail pack"],
  },
  {
    name: "Power banks",
    promise: "Portable power for repeat sales.",
    price: ["$3.00 – $6.00", "$6.00 – $12.00", "$12.00 – $25.00+"],
    image: `${A}/family-power-banks-v1.webp`,
    imageAlt: "Portable power bank shown from six angles with its port layout",
    imageLabel: "PORT & CAPACITY MAP",
    imageSize: [1200, 1310],
    position: "50% 48%",
    icon: BatteryCharging,
    sell: [4, 3, 4, 4],
    specs: ["Cell grade", "Rated capacity", "Port matrix", "Battery docs"],
  },
  {
    name: "Chargers",
    promise: "Fast charging. Status at a glance.",
    price: ["$1.20 – $2.50", "$2.50 – $5.50", "$5.50 – $12.00+"],
    image: `${A}/family-chargers-v2.webp`,
    imageAlt: "Three compact smart-display chargers in a dark finish",
    imageLabel: "SMART DISPLAY RANGE",
    imageSize: [1200, 1200],
    position: "50% 52%",
    icon: Plug,
    sell: [3, 3, 4, 4],
    specs: ["Plug type", "PD/QC/PPS", "Rated output", "Safety file"],
  },
  {
    name: "Cables & adapters",
    promise: "The right connector for every use.",
    price: ["$0.35 – $0.80", "$0.80 – $1.80", "$1.80 – $3.50+"],
    image: `${A}/family-cables-adapters-v1.webp`,
    imageAlt: "Car charging adapter in use with braided black and orange charging cables",
    imageLabel: "IN-VEHICLE USE",
    imageSize: [1200, 894],
    position: "50% 50%",
    icon: Cable,
    sell: [4, 4, 5, 4],
    specs: ["Connector map", "Length & gauge", "Bend-cycle plan", "Pack format"],
  },
];

const controlItems = [
  [Smartphone, "Compatibility & model matrix", "Device coverage is recorded by model, year and variant."],
  [SearchCheck, "Magnet alignment & hold strength", "Alignment and holding strength are checked against the approved sample."],
  [ShieldCheck, "Drop and protection testing", "Test points match the case type and target price band."],
  [BatteryCharging, "Battery safety & compliance", "Cell declarations, protection ICs and thermal behavior remain in the control file."],
  [Zap, "Charging protocol & output", "Port configuration and rated output are checked before pack-out."],
  [Box, "Packaging & market labeling", "Retail packs, labels, barcodes and manuals are reviewed for the destination market."],
];

const evidenceTracks = {
  cases: {
    label: "Phone Cases",
    video: `${A}/phone-case-factory.mp4`,
    caption: "Authorized phone-case production footage · China",
    title: "Production and finish evidence for sample approval.",
    checks: [
      ["Material & molding", "Verify material, molding and finish consistency."],
      ["Artwork & alignment", "Check print position, color direction and adhesion."],
      ["Fit & function", "Confirm fit, button response and protection details."],
      ["Pack-out approval", "Review labeling, inserts and carton specifications."],
    ],
    evidence: ["Annotated production photos", "Sample approval record", "QC findings and open items", "Packaging approval photos"],
    thumbs: [
      [`${A}/phone-case-machine-proof-v1.webp`, "01", "Production", "Phone-case molding and material flow"],
      [`${A}/phone-case-finish-samples-v1.webp`, "02", "Finish check", "Color and surface consistency"],
      [`${A}/phone-case-feature-check-v2.webp`, "03", "Feature check", "Material, openings and button alignment"],
      [`${A}/phone-case-packout-proof-v2.webp`, "04", "Pack-out review", "Retail packaging and color assortment"],
    ],
  },
  power: {
    label: "Power & Charging",
    video: `${A}/power-bank-factory.mp4`,
    caption: "Authorized power-bank assembly footage · China",
    title: "Port, assembly and charging evidence for shipment release.",
    checks: [
      ["PCB & component review", "Confirm the agreed board, protection IC and key components."],
      ["Port configuration", "Verify port type, direction and power allocation."],
      ["Charging checks", "Record rated input and output against the approved sample."],
      ["Battery pack-out", "Review documentation, labels, packaging and carton handling."],
    ],
    evidence: ["Assembly photos", "Port and output record", "Open-item log", "Final packaging photos"],
    thumbs: [
      [`${A}/family-power-banks-v1.webp`, "01", "Port map", "Port configuration and interface"],
      [`${A}/power-bank-factory.mp4`, "02", "Assembly", "Line-side assembly evidence"],
      [`${A}/family-chargers-v1.webp`, "03", "Output test", "Live charger fixture and electrical check"],
      [`${A}/power-bank-final-sample-v1.webp`, "04", "Final sample", "Cabled unit and finish review"],
    ],
  },
};

function Brand() {
  return (
    <a className="mobile-brand" href="/" aria-label="DDNZ Global home">
      <img src="/images/product-showcase/common/ddnz-global-mark.webp" alt="DDNZ Global" />
      <span className="mobile-brand-copy">
        <strong>DDNZ GLOBAL</strong>
        <small>CHINA SOURCING &amp; EXPORT</small>
      </span>
    </a>
  );
}

function DotScale({ value }) {
  return (
    <span className="dot-scale" aria-label={`${value} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => <i className={n <= value ? "filled" : ""} key={n} />)}
    </span>
  );
}

function Header({ open, setOpen }) {
  return (
    <header className="mobile-header">
      <Brand />
      <nav className="mobile-desktop-nav" aria-label="Primary navigation">
        <a href="/">Product Sourcing <ChevronDown size={14} /></a>
        <a className="active" href="/sourcing/mobile-accessories-from-china">Mobile Accessories <ChevronDown size={14} /></a>
        <a href="#control">Our Control Plan</a>
        <a href="#evidence">Resources <ChevronDown size={14} /></a>
        <a href="#about">About DDNZ</a>
      </nav>
      <button className="mobile-menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      {open && (
        <nav className="mobile-drawer" aria-label="Mobile navigation">
          <a href="/">Product Sourcing</a>
          <a className="active" href="/sourcing/mobile-accessories-from-china">Mobile Accessories</a>
          <a href="#control" onClick={() => setOpen(false)}>Our Control Plan</a>
          <a href="#evidence" onClick={() => setOpen(false)}>Production Evidence</a>
          <a href="#rfq" onClick={() => setOpen(false)}>Start a Scoped Request</a>
        </nav>
      )}
    </header>
  );
}

function FamilyCard({ item, index, technical }) {
  const Icon = item.icon;
  return (
    <article className="assortment-family">
      <div className="family-title">
        <span><Icon size={22} /></span>
        <div><h3>{item.name}</h3><p>{item.promise}</p></div>
      </div>
      <div className="family-image">
        <img
          src={item.image}
          alt={item.imageAlt}
          width={item.imageSize[0]}
          height={item.imageSize[1]}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: item.position }}
        />
        <span>{item.imageLabel}</span>
      </div>
      {technical ? (
        <ul className="spec-list">{item.specs.map((spec) => <li key={spec}><Check size={13} />{spec}</li>)}</ul>
      ) : (
        <>
          <div className="price-ladder">
            <span>Good <b>{item.price[0]}</b></span>
            <span>Better <b>{item.price[1]}</b></span>
            <span>Best <b>{item.price[2]}</b></span>
          </div>
          <div className="family-metrics">
            {['Device coverage','Colorways & finishes','Bundle potential','Turn velocity'].map((label, i) => (
              <span key={label}><em>{label}</em><DotScale value={item.sell[i]} /></span>
            ))}
          </div>
        </>
      )}
      <span className="family-index">0{index + 1}</span>
    </article>
  );
}

function VideoThumb({ src, image, alt }) {
  if (src.endsWith(".mp4")) return <video src={src} muted playsInline preload="metadata" aria-label={alt} />;
  return <img src={src} alt={alt} loading="lazy" decoding="async" style={{ objectPosition: image || "50% 50%" }} />;
}

function HeroProductStage() {
  return (
    <div
      className="mobile-hero-stage"
      role="img"
      aria-label="A locked assortment of nine unbranded phone cases, power banks, a folding stand, a car adapter and tempered glass"
    >
      <div className="mobile-hero-orbit" aria-hidden="true" />
      {heroProducts.map(([id, file, width, height], index) => (
        <img
          key={id}
          className={`hero-product hero-product-${id}`}
          src={`${H}/${file}`}
          width={width}
          height={height}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          fetchPriority={index < 3 ? "high" : "auto"}
        />
      ))}
      <span className="hero-stage-record"><b>9 / 9</b> STRUCTURE LOCKED</span>
    </div>
  );
}

export function MobileAccessories() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [technical, setTechnical] = useState(false);
  const [trackKey, setTrackKey] = useState("cases");
  const [playing, setPlaying] = useState(true);
  const [scoreOpen, setScoreOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ category: "Phone cases", market: "", stage: "", price: "", volume: "", timeline: "", notes: "" });
  const videoRef = useRef(null);
  const track = evidenceTracks[trackKey];

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Mobile Accessories Sourcing from China | DDNZ Global";
    return () => { document.title = previousTitle; };
  }, []);

  const quoteUrl = useMemo(() => {
    const params = new URLSearchParams({
      leadGoal: "Product Sourcing",
      industry: `Mobile Accessories - ${form.category}`,
      dest: form.market,
      source: "mobile_accessories_product",
      buyingStage: form.stage,
      targetPrice: form.price,
      monthlyVolume: form.volume,
      timeline: form.timeline,
    });
    return `/get-a-quote?${params.toString()}`;
  }, [form]);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const toggleVideo = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { await video.play(); setPlaying(true); }
    else { video.pause(); setPlaying(false); }
  };
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  return (
    <div className="mobile-page">
      <ShowcaseSEO page="mobile" />
      <Header open={menuOpen} setOpen={setMenuOpen} />

      <main>
        <section className="mobile-hero" aria-labelledby="mobile-title">
          <HeroProductStage />
          <div className="mobile-hero-copy">
            <p className="mobile-kicker">PRODUCT SOURCING · MOBILE ACCESSORIES</p>
            <h1 id="mobile-title">Build a fast-moving accessories range without losing SKU control.</h1>
            <p>DDNZ turns a buyer’s assortment brief into comparable quotations, approved samples, documented QC and export-ready pack-out.</p>
            <div className="mobile-hero-actions">
              <button className="mobile-primary" type="button" onClick={() => scrollTo("rfq")}>Start a scoped request <ArrowRight size={17} /></button>
              <button className="mobile-link-button" type="button" onClick={() => scrollTo("control")}>Review the control plan <ArrowRight size={16} /></button>
            </div>
            <div className="mobile-proof-row">
              {[
                [ShieldCheck, "Verified suppliers", "and factory audits"],
                [ClipboardCheck, "Comparable", "quotations"],
                [TestTubeDiagonal, "Sample & test", "evidence"],
                [PackageCheck, "Export-ready", "pack-out"],
              ].map(([Icon, first, second]) => <span key={first}><Icon size={20} /><b>{first}</b><small>{second}</small></span>)}
            </div>
          </div>
        </section>

        <section className="mobile-section assortment-section" aria-labelledby="assortment-title">
          <div className="assortment-head">
            <div><p className="mobile-kicker">ASSORTMENT ARCHITECTURE</p><h2 id="assortment-title">Built around sell-through, not a random catalog.</h2><p>Four buying families. Multiple price ladders. One range built for comparison.</p></div>
            <div className="segmented" role="group" aria-label="Assortment view">
              <button className={!technical ? "active" : ""} type="button" onClick={() => setTechnical(false)}>Sell-through logic</button>
              <button className={technical ? "active" : ""} type="button" onClick={() => setTechnical(true)}>Technical specs</button>
            </div>
          </div>
          <div className="assortment-grid">
            {productFamilies.map((item, index) => <FamilyCard key={item.name} item={item} index={index} technical={technical} />)}
          </div>
        </section>

        <section className="mobile-section builder-section" id="control" aria-labelledby="builder-title">
          <div className="builder-card process-card">
            <p className="mobile-kicker">RANGE BUILDER</p>
            <h2 id="builder-title">From market brief to approved pack-out.</h2>
            <p>A structured process reduces risk and keeps decisions traceable.</p>
            <div className="process-steps">
              {[
                [FileCheck2, "Market brief", "Channels, price bands and must-have features."],
                [Box, "Target assortment", "The right product mix, SKU count and price ladder."],
                [SearchCheck, "Supplier comparison", "Like-for-like quotes and sample evidence."],
                [PackageCheck, "Approved pack-out", "QC-ready production, packaging and shipping plan."],
              ].map(([Icon, title, copy], index) => <article key={title}><span><Icon size={22} /></span><i>0{index + 1}</i><h3>{title}</h3><p>{copy}</p></article>)}
            </div>
          </div>
          <div className="builder-card custom-card">
            <p className="mobile-kicker">CATEGORY-SPECIFIC CONTROL</p>
            <h2>Phone-case customization</h2>
            <p>Turn a buyer’s reference image into a recorded sample ready for approval.</p>
            <div className="custom-flow">
              <article className="custom-image"><span>01</span><img src={`${A}/custom-reference-case-v1.webp`} width="1200" height="1200" loading="lazy" decoding="async" alt="Unbranded neon-green magnetic phone-case reference held for review" /><b>Reference</b><small>Buyer brief</small></article>
              <article className="custom-image"><span>02</span><img src={`${A}/custom-material-case-v1.webp`} width="1200" height="1200" loading="lazy" decoding="async" alt="Close view of woven phone-case material and button finish" /><b>Material & finish</b><small>Direction approved</small></article>
              <article className="custom-image"><span>03</span><img src={`${A}/phone-case-colorway-proof-v1.webp`} width="1000" height="1000" loading="lazy" decoding="async" alt="Six phone-case colorways arranged for range approval" /><b>Colorway proof</b><small>Range approved</small></article>
              <article className="custom-image"><span>04</span><img src={`${A}/custom-production-case-v1.webp`} width="1200" height="1200" loading="lazy" decoding="async" alt="Finished woven phone-case sample with customized camera-area details" /><b>Production sample</b><small>Release record</small></article>
            </div>
          </div>
        </section>

        <section className="mobile-section control-strip" aria-labelledby="detail-title">
          <p className="mobile-kicker">CONTROL POINTS</p>
          <h2 id="detail-title">Built for control. Proven in every detail.</h2>
          <div className="control-grid">
            {controlItems.map(([Icon, title, copy]) => <article key={title}><Icon size={26} /><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </section>

        <section className="mobile-section production-section" id="evidence" aria-labelledby="production-title">
          <div className="production-head">
            <div><p className="mobile-kicker">INSIDE PRODUCTION</p><h2 id="production-title">Evidence before approval.</h2><p>Each factory record maps to a buyer decision, a control point and an approval file.</p></div>
            <div className="track-tabs" role="tablist" aria-label="Production evidence track">
              {Object.entries(evidenceTracks).map(([key, value]) => <button type="button" role="tab" aria-selected={trackKey === key} className={trackKey === key ? "active" : ""} onClick={() => { setTrackKey(key); setPlaying(true); }} key={key}>{value.label}</button>)}
            </div>
          </div>
          <div className="production-stage">
            <figure className="production-video">
              <video ref={videoRef} key={track.video} src={track.video} autoPlay muted loop playsInline preload="metadata" />
              <button type="button" className="play-toggle" onClick={toggleVideo} aria-label={playing ? "Pause factory video" : "Play factory video"}>{playing ? <Pause size={24} /> : <Play size={24} />}</button>
              <figcaption>{track.caption}</figcaption>
            </figure>
            <aside className="production-checks">
              <h3>{track.title}</h3>
              <div>{track.checks.map(([title, copy]) => <span key={title}><CheckCircle2 size={17} /><b>{title}</b><small>{copy}</small></span>)}</div>
              <h4>Approval evidence</h4>
              <ul>{track.evidence.map((item) => <li key={item}><FileCheck2 size={15} />{item}</li>)}</ul>
            </aside>
          </div>
          <div className="evidence-thumbs">
            {track.thumbs.map(([src, number, title, copy]) => <article key={`${trackKey}-${number}`}><div><VideoThumb src={src} alt={`${title}: ${copy}`} /></div><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
          <button type="button" className="track-switch" onClick={() => { setTrackKey(trackKey === "cases" ? "power" : "cases"); setPlaying(true); }}>Switch to {trackKey === "cases" ? "Power & Charging" : "Phone Cases"} evidence <ArrowRight size={16} /></button>
        </section>

        <section className="mobile-section decision-section" aria-label="Supplier and destination controls">
          <article className="supplier-preview">
            <div className="decision-head"><div><p className="mobile-kicker">SUPPLIER SCORECARD</p><h2>Compare like for like. Choose on value.</h2></div><span>PREVIEW</span></div>
            <div className="supplier-table">
              <div className="supplier-row heading"><span>Supplier</span><span>Overall</span><span>Factory</span><span>Quality</span><span>Delivery</span><span>Communication</span></div>
              {[
                ["Supplier A", "92", 5, 5, 5, 4],
                ["Supplier B", "84", 4, 4, 4, 4],
                ["Supplier C", "76", 3, 4, 3, 4],
                ["Supplier D", "68", 3, 3, 3, 3],
              ].map(([name, score, ...dots]) => <div className="supplier-row" key={name}><span>{name}</span><strong>{score}</strong>{dots.map((dot, index) => <DotScale value={dot} key={index} />)}</div>)}
            </div>
            <button className="mobile-link-button score-link" type="button" onClick={() => setScoreOpen(true)}>View the complete scoring method <ArrowRight size={16} /></button>
          </article>
          <article className="readiness-card">
            <p className="mobile-kicker">DESTINATION-MARKET READINESS</p>
            <h2>Ship a sellable range, not just cartons.</h2>
            <ul>{[
              "Packaging and labeling localization",
              "Certification document checklist",
              "HS-code guidance and export file",
              "Export packing and carton optimization",
              "Consolidation and delivery options",
            ].map((item) => <li key={item}><CheckCircle2 size={17} />{item}</li>)}</ul>
            <div className="evidence-package">
              <h3>Approval package delivered</h3>
              {[
                [ClipboardCheck, "Control plan & specs"],
                [ImageIcon, "Samples & photo records"],
                [TestTubeDiagonal, "Test and QC reports"],
                [PackageCheck, "Packaging & pack-out"],
              ].map(([Icon, label]) => <span key={label}><Icon size={20} />{label}</span>)}
            </div>
          </article>
        </section>

        <section className="mobile-section rfq-section" id="rfq" aria-labelledby="rfq-title">
          <div className="rfq-intro">
            <p className="mobile-kicker">SCOPED PRODUCT REQUEST</p>
            <h2 id="rfq-title">Define the brief. Receive a comparable range.</h2>
            <p>Start with product scope, destination market and buying stage. Detailed files can follow after our first review.</p>
            <div className="rfq-proof">
              <span><LockKeyhole size={22} /><b>Confidential</b><small>handling</small></span>
              <span><SearchCheck size={22} /><b>Experienced</b><small>sourcing team</small></span>
              <span><Globe2 size={22} /><b>Clear</b><small>next steps</small></span>
            </div>
          </div>
          {!submitted ? (
            <form className="mobile-rfq" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
              <label>Product category *<select name="category" value={form.category} onChange={update} required><option>Phone cases</option><option>Power banks</option><option>Chargers</option><option>Cables & adapters</option><option>Mixed assortment</option></select></label>
              <label>Target market or region *<select name="market" value={form.market} onChange={update} required><option value="">Select region</option><option>Middle East</option><option>West Africa</option><option>Latin America</option><option>Other market</option></select></label>
              <label>Buying stage *<select name="stage" value={form.stage} onChange={update} required><option value="">Select stage</option><option>Building a new range</option><option>Replacing a supplier</option><option>Comparing current offers</option><option>Order-ready</option></select></label>
              <label>Target price band (USD)<select name="price" value={form.price} onChange={update}><option value="">Select price band</option><option>Entry</option><option>Mid</option><option>Premium</option><option>Mixed ladder</option></select></label>
              <label>Monthly volume target<select name="volume" value={form.volume} onChange={update}><option value="">Select volume</option><option>Trial order</option><option>1,000–5,000 units</option><option>5,000–20,000 units</option><option>20,000+ units</option></select></label>
              <label>Preferred timeline<select name="timeline" value={form.timeline} onChange={update}><option value="">Select timeline</option><option>Within 30 days</option><option>30–60 days</option><option>60–90 days</option><option>Planning stage</option></select></label>
              <label className="rfq-notes">Tell us about your requirements<textarea name="notes" value={form.notes} onChange={update} placeholder="Channels, must-haves, device coverage, packaging needs and any reference image requirements." /></label>
              <button className="mobile-primary rfq-submit" type="submit">Prepare sourcing brief <ArrowRight size={17} /></button>
              <p className="rfq-response"><ShieldCheck size={16} /> We review your scope before requesting any sensitive details.</p>
            </form>
          ) : (
            <div className="rfq-success" role="status">
              <CheckCircle2 size={42} />
              <div><p className="mobile-kicker">SCOPE READY</p><h3>{form.category} · {form.market}</h3><p>Your product category, destination and buying stage are ready for the secure DDNZ sourcing brief.</p></div>
              <a className="mobile-primary" href={quoteUrl}>Continue to secure brief <ArrowRight size={17} /></a>
              <button className="mobile-link-button" type="button" onClick={() => setSubmitted(false)}>Edit request</button>
            </div>
          )}
        </section>

        <section className="freight-handoff" id="about">
          <div><Truck size={28} /><p><strong>International freight executed by Heaven Born</strong><span>Operating since 1997.</span></p></div>
          <span>Origin control · route coordination · export documents · carrier handoff</span>
        </section>
      </main>

      <ShowcaseContactFooter
        pageKey="mobile-accessories"
        description="DDNZ Global coordinates mobile-accessories sourcing, supplier verification, inspection and export handoff from China."
        tagline="Product sourcing and trade support"
        links={[{ label: "Control path", href: "#control" }, { label: "Evidence", href: "#evidence" }, { label: "Start a brief", href: "#rfq" }]}
      />

      {scoreOpen && (
        <div className="score-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setScoreOpen(false); }}>
          <section className="score-modal" role="dialog" aria-modal="true" aria-labelledby="score-title">
            <button type="button" className="score-close" onClick={() => setScoreOpen(false)} aria-label="Close scoring method"><X size={20} /></button>
            <p className="mobile-kicker">SUPPLIER SCORING METHOD</p>
            <h2 id="score-title">Weights structure the comparison. Veto gates protect the decision.</h2>
            <div className="method-grid">
              <article><span>30 PTS</span><h3>Delivery readiness</h3><p>On-time history, response speed and realistic lead-time control.</p></article>
              <article><span>40 PTS</span><h3>Quality capability</h3><p>Incoming acceptance, batch consistency and test/inspection evidence.</p></article>
              <article><span>15 PTS</span><h3>Service coordination</h3><p>Issue response, specification discipline and communication.</p></article>
              <article><span>15 PTS</span><h3>Cost performance</h3><p>Comparable scope, stated assumptions and total landed implications.</p></article>
            </div>
            <div className="veto-list"><strong>Veto gates</strong><span>Unverified identity</span><span>Unresolved compliance gap</span><span>Approved sample failed</span><span>Repeated delivery or quality failure</span></div>
            <button type="button" className="mobile-primary" onClick={() => { setScoreOpen(false); scrollTo("rfq"); }}>Use this method for my range <ArrowRight size={17} /></button>
          </section>
        </div>
      )}
    </div>
  );
}
