import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Box,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Factory,
  FileCheck2,
  Globe2,
  Menu,
  PackageCheck,
  SearchCheck,
  ShieldCheck,
  Ship,
  Speaker,
  Smartphone,
  TentTree,
  Truck,
  X,
} from "lucide-react";
import "./products-index.css";
import "./mobile-readability.css";
import ShowcaseSEO from "./ShowcaseSEO";
import ShowcaseContactFooter from "./ShowcaseContactFooter";

const PRODUCT_CATEGORIES = [
  {
    id: "commercial-kitchen-refrigeration",
    number: "01",
    title: "Commercial Kitchen & Refrigeration",
    shortTitle: "Kitchen & Refrigeration",
    eyebrow: "Foodservice equipment & cold-side projects",
    href: "/sourcing/commercial-kitchen-equipment-from-china",
    icon: Factory,
    images: [
      {
        src: "/images/product-showcase/kitchen/kitchen-product-range-sanitized.webp",
        alt: "Unbranded stainless commercial cooking equipment in a showroom",
        width: 900,
        height: 1124,
        position: "50% 43%",
      },
      {
        src: "/images/product-showcase/kitchen/kitchen-refrigeration-sanitized.webp",
        alt: "Unbranded commercial refrigeration and display cabinets in a showroom",
        width: 1445,
        height: 1088,
        position: "48% 50%",
      },
    ],
    imageLabel: "Cooking, refrigeration & projects",
    summary: "Source cooking, preparation and commercial refrigeration as one coordinated foodservice range—aligned around output, utilities, installation and service access.",
    families: ["Cooking & thermal", "Commercial refrigeration", "Prep, wash & stainless", "Beverage, ice & display"],
    quoteVariables: ["Utilities & climate", "Output & capacity", "Included components", "Service access"],
    brief: ["Menu, output and cold-side use", "Utilities, climate and installation", "Service, spares and project sequence"],
    normalizes: ["Cooking and refrigeration configuration", "Capacity, duty and included components", "Warranty, packing and exclusions"],
    approval: ["Locked model and utility record", "Performance, function and finish evidence", "Inspection and pack-out checks"],
    handoff: ["Destination compliance file", "Packed dimensions and quantities", "Project consolidation and release"],
  },
  {
    id: "audio-speakers",
    number: "02",
    title: "Audio & Speakers",
    shortTitle: "Audio & Speakers",
    eyebrow: "Portable, party & professional audio",
    href: "/sourcing/audio-speakers-from-china",
    icon: Speaker,
    images: [
      {
        src: "/images/product-showcase/index/audio-speakers-category.webp",
        alt: "Unbranded portable party speakers with microphones and remote controls",
        width: 1200,
        height: 800,
        position: "50% 50%",
      },
    ],
    imageLabel: "Portable, party & pro audio",
    summary: "Compare output, battery, wireless functions and included accessories as a sellable audio range—not as isolated catalogue models.",
    families: ["Portable & party speakers", "Professional audio", "Microphones & accessories", "Private label & packing"],
    quoteVariables: ["Driver & cabinet", "Battery & wireless", "Included accessories", "Retail pack"],
    brief: ["Channel and use environment", "Output, driver and function set", "Battery, microphone and pack needs"],
    normalizes: ["Acoustic and cabinet configuration", "Battery, wireless and accessory set", "MOQ, private label and retail pack"],
    approval: ["Locked model and feature record", "Output, battery and function evidence", "Finish, accessory and pack-out checks"],
    handoff: ["Battery and radio-document file", "SKU, accessories and carton quantities", "Label, packing and export release"],
  },
  {
    id: "mobile-accessories",
    number: "03",
    title: "Mobile Accessories",
    shortTitle: "Mobile Accessories",
    eyebrow: "Fast-moving assortment sourcing",
    href: "/sourcing/mobile-accessories-from-china",
    icon: Smartphone,
    images: [
      {
        src: "/images/product-showcase/mobile/family-phone-cases-v1.webp",
        alt: "Six unbranded magnetic ring phone cases in different colorways",
        width: 1200,
        height: 1200,
        position: "50% 50%",
      },
      {
        src: "/images/product-showcase/mobile/family-chargers-v2.webp",
        alt: "Three compact unbranded smart-display chargers",
        width: 1200,
        height: 1200,
        position: "50% 54%",
      },
    ],
    imageLabel: "Cases, power & charging",
    summary: "Build a sell-through range with device coverage, charging protocols, samples and SKU-level pack-out kept under control.",
    families: ["Phone cases", "Power & charging", "Cables & adapters"],
    quoteVariables: ["Compatibility", "Protocols", "Finish options", "Retail pack"],
    brief: ["Target devices and connectors", "Price ladder and channel", "Finish, branding and pack format"],
    normalizes: ["Model and protocol coverage", "Battery, output and material claims", "MOQ by colorway and packaging"],
    approval: ["Reference-to-sample record", "Fit, output and feature checks", "Colorway and pack-out approval"],
    handoff: ["Label and battery-document file", "SKU and carton quantity check", "Consolidation and export release"],
  },
  {
    id: "outdoor-products",
    number: "04",
    title: "Outdoor Products",
    shortTitle: "Outdoor Products",
    eyebrow: "Coolers, portable cold & emergency power",
    href: "/sourcing/outdoor-products-from-china",
    icon: TentTree,
    images: [
      {
        src: "/images/product-showcase/index/outdoor-portable-energy-brand-neutral-v1.webp",
        alt: "Brand-neutral portable power stations and solar panels for outdoor use",
        width: 1549,
        height: 1015,
        position: "50% 50%",
      },
      {
        src: "/images/product-showcase/index/outdoor-insulated-cooler-catalog.webp",
        alt: "Insulated cooler beside an outdoor vehicle and shelter",
        width: 1536,
        height: 1024,
        position: "50% 50%",
      },
      {
        src: "/images/product-showcase/index/outdoor-portable-refrigerator-catalog.webp",
        alt: "Portable outdoor refrigerator at a campsite",
        width: 1536,
        height: 1024,
        position: "38% 78%",
      },
    ],
    imageLabel: "Coolers, portable cold & power",
    summary: "Build outdoor assortments across insulated coolers, portable refrigeration and emergency power while keeping runtime, climate and transport requirements explicit.",
    families: ["Insulated coolers", "Portable refrigeration", "Portable power & solar", "Outdoor cooking & camp systems"],
    quoteVariables: ["Climate & runtime", "Power chain", "Battery / refrigerant files", "Packed cube"],
    brief: ["Destination climate and use case", "Temperature, runtime or output claim", "Vehicle power, battery and accessory set"],
    normalizes: ["Capacity and tested claim method", "Compressor, cell and component set", "Included accessories, carton and MOQ"],
    approval: ["Retention, pull-down or output record", "Exact-model power and transport file", "Construction, finish and pack-out checks"],
    handoff: ["Battery and refrigerant label file", "SKU, accessories and packed cube", "Mixed-range consolidation and release"],
  },
];

const CONTROL_STAGES = [
  { key: "brief", label: "Buyer brief", note: "Define the real buying variables.", icon: ClipboardCheck },
  { key: "normalizes", label: "Comparable quote", note: "Align inputs before judging price.", icon: SearchCheck },
  { key: "approval", label: "Approval evidence", note: "Record what the order must match.", icon: FileCheck2 },
  { key: "handoff", label: "Export handoff", note: "Release packing and documents together.", icon: Ship },
];

const WORKFLOW_STEPS = [
  {
    number: "01",
    title: "Discover the right category",
    copy: "Start with product families and the variables that shape supplier fit.",
    icon: Box,
  },
  {
    number: "02",
    title: "Compare sourcing capability",
    copy: "See how DDNZ structures like-for-like quotes and approval evidence.",
    icon: SearchCheck,
  },
  {
    number: "03",
    title: "Submit a scoped requirement",
    copy: "Share the range, destination and buying stage; detailed files can follow.",
    icon: FileCheck2,
  },
];

const PROCESS_RECORDS = [
  {
    icon: ClipboardCheck,
    title: "Scope record",
    copy: "Defines what the requirement must achieve before supplier outreach.",
    items: ["Use case & target channel", "Destination requirements", "Commercial priorities"],
    output: "Reviewed buyer brief",
  },
  {
    icon: SearchCheck,
    title: "Comparison record",
    copy: "Makes supplier offers comparable beyond the headline unit price.",
    items: ["Locked configuration", "Offer assumptions", "Options & exclusions"],
    output: "Like-for-like comparison",
  },
  {
    icon: ShieldCheck,
    title: "Approval record",
    copy: "Connects the order baseline to the evidence and decisions behind it.",
    items: ["Specification revision", "Sample & evidence status", "QC checks & open items"],
    output: "Approval baseline",
  },
  {
    icon: Truck,
    title: "Handoff record",
    copy: "Packages origin-side readiness into one controlled release file.",
    items: ["Packing & label status", "Document checklist", "Freight release status"],
    output: "Export handoff file",
  },
];

function Brand() {
  return (
    <a className="px-brand" href="/" aria-label="DDNZ Global home">
      <img src="/images/product-showcase/common/ddnz-global-mark.webp" alt="" />
      <span>
        <strong>DDNZ GLOBAL</strong>
        <small>CHINA SOURCING &amp; EXPORT</small>
      </span>
    </a>
  );
}

function ProductsHeader({ open, onToggle, onClose }) {
  return (
    <header className="px-header">
      <Brand />
      <nav className="px-desktop-nav" aria-label="Primary navigation">
        <a className="active" href="#categories">Product Sourcing <ChevronDown size={14} /></a>
        <a href="/sourcing/commercial-kitchen-equipment-from-china">Kitchen &amp; Refrigeration</a>
        <a href="#compare">Our Control Plan</a>
        <a href="#process">How It Works</a>
        <a href="#rfq">Start an RFQ</a>
      </nav>
      <button className="px-menu-button" type="button" onClick={onToggle} aria-expanded={open} aria-label="Toggle navigation">
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      {open && (
        <nav className="px-mobile-nav" aria-label="Mobile navigation">
          <a href="#categories" onClick={onClose}>Browse categories</a>
          <a href="#compare" onClick={onClose}>Compare sourcing capability</a>
          <a href="#process" onClick={onClose}>How it works</a>
          <a href="#rfq" onClick={onClose}>Start an RFQ</a>
        </nav>
      )}
    </header>
  );
}

function HeroCategoryMap() {
  return (
    <div className="px-hero-map" aria-label="DDNZ product sourcing categories">
      <div className="px-map-heading">
        <span>PRODUCT SOURCING MAP</span>
        <small>4 primary categories</small>
      </div>
      <div className="px-map-grid">
        {PRODUCT_CATEGORIES.map((category) => {
          const Icon = category.icon;
          return (
            <a className={`px-map-item px-map-item-${category.number}`} href={`#${category.id}`} key={category.id}>
              <img
                src={category.images[0].src}
                width={category.images[0].width}
                height={category.images[0].height}
                alt=""
                aria-hidden="true"
                style={{ objectPosition: category.images[0].position }}
              />
              <span className="px-map-icon"><Icon size={17} /></span>
              <span className="px-map-copy"><small>{category.number}</small><strong>{category.shortTitle}</strong><em>{category.imageLabel}</em></span>
              <ArrowRight size={16} />
            </a>
          );
        })}
      </div>
      <div className="px-map-key">
        <span><i /> Category range</span>
        <span><i /> Quote variables</span>
        <span><i /> Approval path</span>
      </div>
    </div>
  );
}

function CategoryCard({ category, onScope }) {
  const Icon = category.icon;
  return (
    <article className="px-category-card" id={category.id}>
      <div className={`px-category-media mosaic-${category.images.length}`}>
        {category.images.map((image) => (
          <img
            src={image.src}
            width={image.width}
            height={image.height}
            alt={image.alt}
            loading="lazy"
            decoding="async"
            style={{ objectPosition: image.position }}
            key={image.src}
          />
        ))}
        <span>{category.imageLabel}</span>
      </div>
      <div className="px-category-copy">
        <div className="px-category-title">
          <span><Icon size={20} /></span>
          <div><small>{category.number} · {category.eyebrow}</small><h3>{category.title}</h3></div>
        </div>
        <p>{category.summary}</p>
        <div className="px-family-list" aria-label={`${category.title} product families`}>
          {category.families.map((family) => <span key={family}><Check size={13} />{family}</span>)}
        </div>
        <div className="px-quote-variables">
          <strong>Variables to lock before comparison</strong>
          <div>{category.quoteVariables.map((variable) => <span key={variable}>{variable}</span>)}</div>
        </div>
        <div className="px-category-actions">
          <a href={category.href}>Explore category <ArrowRight size={16} /></a>
          <button type="button" onClick={() => onScope(category.id)}>Scope this range</button>
        </div>
      </div>
    </article>
  );
}

function CapabilityPanel({ category }) {
  return (
    <div className="px-capability-panel" id="capability-panel" role="tabpanel" aria-label={`${category.title} sourcing capability`}>
      <div className="px-capability-context">
        <span>{category.number}</span>
        <div><small>ACTIVE CATEGORY</small><strong>{category.title}</strong></div>
      </div>
      <div className="px-capability-grid">
        {CONTROL_STAGES.map(({ key, label, note, icon: Icon }, index) => (
          <article key={key}>
            <div className="px-stage-heading"><span><Icon size={20} /></span><small>0{index + 1}</small></div>
            <h3>{label}</h3>
            <p>{note}</p>
            <ul>{category[key].map((item) => <li key={item}><CheckCircle2 size={15} />{item}</li>)}</ul>
          </article>
        ))}
      </div>
      <p className="px-capability-note"><ShieldCheck size={16} /> The control path stays consistent; category-specific buying variables change.</p>
    </div>
  );
}

export function ProductsIndex() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState(PRODUCT_CATEGORIES[0].id);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ category: PRODUCT_CATEGORIES[0].id, scope: "", destination: "", stage: "", notes: "" });
  const activeCategory = PRODUCT_CATEGORIES.find((category) => category.id === activeId) || PRODUCT_CATEGORIES[0];

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Product Sourcing Categories | DDNZ Global";
    return () => { document.title = previousTitle; };
  }, []);

  const quoteUrl = useMemo(() => {
    const category = PRODUCT_CATEGORIES.find((item) => item.id === form.category);
    const params = new URLSearchParams({
      leadGoal: "Product Sourcing",
      industry: category?.title || "Product Sourcing",
      productScope: form.scope,
      dest: form.destination,
      buyingStage: form.stage,
      notes: form.notes,
      source: "products_index",
    });
    return `/get-a-quote?${params.toString()}`;
  }, [form]);

  const scrollTo = (id) => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  const scopeCategory = (categoryId) => {
    setForm((current) => ({ ...current, category: categoryId }));
    setSubmitted(false);
    scrollTo("rfq");
  };

  const updateForm = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  return (
    <div className="products-index-page" id="products-index-top">
      <ShowcaseSEO page="products" />
      <a className="px-skip-link" href="#products-index-main">Skip to product categories</a>
      <ProductsHeader open={menuOpen} onToggle={() => setMenuOpen((value) => !value)} onClose={() => setMenuOpen(false)} />

      <main id="products-index-main">
        <section className="px-hero" aria-labelledby="products-index-title">
          <div className="px-hero-copy">
            <p className="px-kicker">PRODUCT SOURCING · CATEGORY INDEX</p>
            <h1 id="products-index-title">Find the right product range. Keep every sourcing decision comparable.</h1>
            <p>Browse DDNZ sourcing categories, see the buying variables we control, then submit one structured brief for supplier comparison and export handoff.</p>
            <div className="px-hero-actions">
              <button className="px-primary" type="button" onClick={() => scrollTo("categories")}>Browse categories <ArrowRight size={17} /></button>
              <button className="px-text-button" type="button" onClick={() => scrollTo("rfq")}>Start a scoped RFQ <ArrowRight size={16} /></button>
            </div>
            <div className="px-proof-row" aria-label="DDNZ sourcing controls">
              <span><SearchCheck size={20} /><b>Like-for-like</b><small>supplier quotes</small></span>
              <span><ClipboardCheck size={20} /><b>Recorded</b><small>buying variables</small></span>
              <span><FileCheck2 size={20} /><b>Approval</b><small>evidence</small></span>
              <span><PackageCheck size={20} /><b>Export-ready</b><small>pack-out</small></span>
            </div>
          </div>
          <HeroCategoryMap />
        </section>

        <section className="px-workflow-strip" aria-label="Products index workflow">
          {WORKFLOW_STEPS.map(({ number, title, copy, icon: Icon }) => (
            <article key={number}><span><Icon size={20} /></span><small>{number}</small><div><strong>{title}</strong><p>{copy}</p></div></article>
          ))}
        </section>

        <section className="px-section px-categories" id="categories" aria-labelledby="category-title">
          <div className="px-section-heading">
            <div><p className="px-kicker">DISCOVER BY BUYING CATEGORY</p><h2 id="category-title">Start with the range—not a random supplier list.</h2></div>
            <p>Each category opens with the product families buyers need to navigate and the variables DDNZ locks before price comparison.</p>
          </div>
          <div className="px-category-grid">
            {PRODUCT_CATEGORIES.map((category) => <CategoryCard category={category} onScope={scopeCategory} key={category.id} />)}
          </div>
          <aside className="px-other-category">
            <div><Box size={22} /><p><strong>Need a category not shown here?</strong><span>Start with the product, destination and buying stage. We will confirm sourcing fit before supplier outreach.</span></p></div>
            <button type="button" onClick={() => scopeCategory("other")}>Submit another category <ArrowRight size={16} /></button>
          </aside>
        </section>

        <section className="px-compare" id="compare" aria-labelledby="compare-title">
          <div className="px-section px-compare-inner">
            <div className="px-compare-heading">
              <div><p className="px-kicker">COMPARE PROCUREMENT CAPABILITY</p><h2 id="compare-title">See how a category moves from buying brief to release evidence.</h2></div>
              <p>Price becomes useful only after specifications, inclusions and acceptance points are made comparable.</p>
            </div>
            <div className="px-category-tabs" role="tablist" aria-label="Choose a category control path">
              {PRODUCT_CATEGORIES.map((category) => {
                const Icon = category.icon;
                return <button type="button" role="tab" aria-selected={activeId === category.id} aria-controls="capability-panel" className={activeId === category.id ? "active" : ""} onClick={() => setActiveId(category.id)} key={category.id}><Icon size={18} />{category.shortTitle}</button>;
              })}
            </div>
            <CapabilityPanel category={activeCategory} />
          </div>
        </section>

        <section className="px-section px-process" id="process" aria-labelledby="process-title">
          <div className="px-process-copy">
            <p className="px-kicker">ONE ACCOUNTABLE SOURCING PATH</p>
            <h2 id="process-title">Category expertise changes. Decision discipline stays consistent.</h2>
            <p>DDNZ coordinates the sourcing brief, supplier comparison, approval records and origin-side release. Freight execution begins after the approved sourcing file is ready.</p>
            <button className="px-text-button" type="button" onClick={() => scrollTo("rfq")}>Use this path for my requirement <ArrowRight size={16} /></button>
          </div>
          <div className="px-process-records">
            {PROCESS_RECORDS.map(({ icon: Icon, title, copy, items, output }, index) => (
              <article key={title}>
                <span><Icon size={21} /></span>
                <small>0{index + 1}</small>
                <h3>{title}</h3>
                <p>{copy}</p>
                <ul>{items.map((item) => <li key={item}><Check size={13} />{item}</li>)}</ul>
                <div className="px-record-output"><small>Decision output</small><strong>{output}</strong></div>
              </article>
            ))}
          </div>
        </section>

        <section className="px-section px-rfq" id="rfq" aria-labelledby="rfq-title">
          <div className="px-rfq-intro">
            <p className="px-kicker">SCOPED PRODUCT REQUEST</p>
            <h2 id="rfq-title">Tell us what you need to source.</h2>
            <p>Start with a category, product scope and destination. The next review will focus on supplier fit, comparable inputs and the evidence needed before release.</p>
            <div className="px-rfq-trust">
              <span><ShieldCheck size={19} /><b>Private brief</b><small>No files required to begin</small></span>
              <span><Globe2 size={19} /><b>Market-aware</b><small>Destination needs captured early</small></span>
            </div>
          </div>
          {!submitted ? (
            <form className="px-rfq-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
              <label htmlFor="px-category">Product category *
                <select id="px-category" name="category" value={form.category} onChange={updateForm} required>
                  {PRODUCT_CATEGORIES.map((category) => <option value={category.id} key={category.id}>{category.title}</option>)}
                  <option value="other">Another product category</option>
                </select>
              </label>
              <label htmlFor="px-destination">Destination market *
                <input id="px-destination" name="destination" value={form.destination} onChange={updateForm} placeholder="Country or region" required />
              </label>
              <label className="px-rfq-wide" htmlFor="px-scope">Product scope *
                <input id="px-scope" name="scope" value={form.scope} onChange={updateForm} placeholder="Products, quantities, use case or project type" required />
              </label>
              <label htmlFor="px-stage">Buying stage *
                <select id="px-stage" name="stage" value={form.stage} onChange={updateForm} required>
                  <option value="">Select stage</option>
                  <option>Exploring a new category</option>
                  <option>Building a target range</option>
                  <option>Comparing current offers</option>
                  <option>Sample or specification stage</option>
                  <option>Order-ready</option>
                </select>
              </label>
              <label htmlFor="px-notes">Priorities or constraints
                <input id="px-notes" name="notes" value={form.notes} onChange={updateForm} placeholder="Target price, timeline, standards or pack format" />
              </label>
              <button className="px-primary px-rfq-submit" type="submit">Prepare sourcing brief <ArrowRight size={17} /></button>
              <p className="px-form-note"><ShieldCheck size={15} /> Review and submit your details on DDNZ’s secure inquiry page.</p>
            </form>
          ) : (
            <div className="px-rfq-success" role="status">
              <CheckCircle2 size={40} />
              <div><p className="px-kicker">SCOPE READY</p><h3>{PRODUCT_CATEGORIES.find((item) => item.id === form.category)?.title || "Another product category"}</h3><p>Your category, destination and buying stage are ready for the centralized DDNZ quote flow.</p></div>
              <a className="px-primary" href={quoteUrl}>Continue to secure brief <ArrowRight size={17} /></a>
              <button className="px-text-button" type="button" onClick={() => setSubmitted(false)}>Edit request</button>
            </div>
          )}
        </section>

        <section className="px-handoff" aria-label="Freight execution partner">
          <div><Truck size={27} /><p><strong>International freight executed by Heaven Born</strong><span>Operating since 1997 · engaged after sourcing release</span></p></div>
          <span>DDNZ remains your sourcing coordination team</span>
        </section>
      </main>

      <ShowcaseContactFooter
        pageKey="products"
        description="Product sourcing, supplier comparison, approval evidence and export handoff from China."
        tagline="China sourcing and export coordination"
        links={[{ label: "Categories", href: "#categories" }, { label: "Control path", href: "#compare" }, { label: "Start an RFQ", href: "#rfq" }]}
      />
    </div>
  );
}

export default ProductsIndex;
