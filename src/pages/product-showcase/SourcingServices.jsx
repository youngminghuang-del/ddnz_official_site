import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Boxes,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileCheck2,
  Globe2,
  Layers3,
  Menu,
  PackageCheck,
  Plane,
  SearchCheck,
  ShieldCheck,
  Ship,
  ShoppingBag,
  Store,
  Truck,
  Users,
  X,
} from "lucide-react";
import "./sourcing-services.css";
import "./mobile-readability.css";
import ShowcaseSEO from "./ShowcaseSEO";
import ShowcaseContactFooter from "./ShowcaseContactFooter";
import SourcingHomepageNav from "../../components/SourcingHomepageNav";

const BUYER_PATHS = [
  {
    id: "retail",
    number: "01",
    eyebrow: "FLEXIBLE RETAIL SOURCING",
    title: "Buy closer to China supply without taking wholesale-scale risk per SKU.",
    copy: "For established retailers and multi-store operators building mixed ranges, testing demand and replenishing fast-moving products.",
    icon: Store,
    points: [
      "Mixed-SKU and mixed-color orders",
      "Lower quantity per individual SKU",
      "Test orders before wider rollout",
      "Frequent replenishment and small-batch air freight",
    ],
    brief: "Best starting brief: category, SKU count, units per SKU and replenishment rhythm.",
  },
  {
    id: "project",
    number: "02",
    eyebrow: "MANAGED PROJECT SOURCING",
    title: "Keep custom, higher-value or technically controlled orders tied to approval evidence.",
    copy: "For buyers who need deeper supplier review, specification control, production follow-up and a recorded release path.",
    icon: Layers3,
    points: [
      "Custom specification and sample approval",
      "Like-for-like supplier comparison",
      "Production milestones and issue escalation",
      "QC, packing and export handoff records",
    ],
    brief: "Best starting brief: use case, specification, destination, volume and required approval points.",
  },
];

const COMPARISON_ROWS = [
  ["Displayed price", "May reflect one configuration, MOQ or promotional entry point", "Same specification, quantity, inclusions and commercial assumptions"],
  ["Supplier identity", "A useful lead that still requires verification", "Business identity, production role and sourcing fit recorded"],
  ["Sample to bulk", "A sample alone does not define the production acceptance record", "Approved sample, specification and order checks connected"],
  ["Schedule", "Quoted lead time may change when scope or capacity is clarified", "Milestones, open items and exceptions returned to the buyer"],
  ["Release", "Buyer coordinates payment, inspection, packing and shipment decisions", "QC, pack-out and document status reviewed before handoff"],
];

const CONTROL_STEPS = [
  ["01", "Buyer brief", "Products, SKU mix, quantities, destination and buying stage.", "Requirement matrix"],
  ["02", "Supplier verification", "Identity, capability, commercial fit and production role.", "Supplier review note"],
  ["03", "Comparable offers", "Specifications, inclusions, MOQ and assumptions aligned.", "Comparable offer table"],
  ["04", "Sample approval", "Reference, model, finish and acceptance points recorded.", "Approval record"],
  ["05", "Production follow-up", "Milestones, changes, open items and corrective actions tracked.", "Milestone & exception log"],
  ["06", "QC & pack-out", "Order-specific checks, quantities, labels and packing evidence.", "QC & pack-out file"],
  ["07", "Export handoff", "Release status, documents and freight requirements coordinated.", "Release & freight handoff"],
];

const EVIDENCE = [
  {
    number: "01",
    title: "Factory & supplier review",
    copy: "Identity, role, production fit and open questions returned as a sourcing record.",
    image: "/images/product-showcase/kitchen/kitchen-factory-inspection-sanitized.webp",
    alt: "Sanitized factory inspection scene used as supplier review evidence",
    position: "50% 52%",
  },
  {
    number: "02",
    title: "Sample & specification lock",
    copy: "The selected reference, material, color and key acceptance points stay connected.",
    image: "/images/product-showcase/mobile/custom-material-case-v1.webp",
    alt: "Phone case material and color samples used for approval review",
    position: "50% 50%",
  },
  {
    number: "03",
    title: "Production & quality evidence",
    copy: "Order-specific production checks make issues visible before the release decision.",
    image: "/images/product-showcase/mobile/phone-case-machine-proof-v1.webp",
    alt: "Phone case production machine used as production evidence",
    position: "50% 50%",
  },
  {
    number: "04",
    title: "Pack-out review",
    copy: "Retail pack, quantities, markings and carton readiness are recorded together.",
    image: "/images/product-showcase/mobile/phone-case-packout-proof-v2.webp",
    alt: "Retail phone case packaging used for pack-out review",
    position: "50% 50%",
  },
];

function Brand() {
  return (
    <a className="ss-brand" href="/" aria-label="DDNZ Global home">
      <img src="/images/product-showcase/common/ddnz-global-mark.webp" alt="" />
      <span><strong>DDNZ GLOBAL</strong><small>CHINA SOURCING &amp; EXPORT</small></span>
    </a>
  );
}

function Header({ menuOpen, setMenuOpen }) {
  const close = () => setMenuOpen(false);
  return (
    <header className="ss-header">
      <Brand />
      <nav className="ss-desktop-nav" aria-label="Primary navigation">
        <a href="/products">Product Sourcing</a>
        <a className="active" href="#top">Sourcing Services</a>
        <a href="#marketplace">Why Control Matters</a>
        <a href="#control">How We Work</a>
        <a href="#brief">Start a Brief</a>
      </nav>
      <button className="ss-menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="sourcing-services-mobile-nav" aria-label="Toggle navigation">
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      {menuOpen && (
        <nav className="ss-mobile-nav" id="sourcing-services-mobile-nav" aria-label="Mobile navigation">
          <a href="/products" onClick={close}>Product sourcing</a>
          <a href="#paths" onClick={close}>Choose a sourcing path</a>
          <a href="#marketplace" onClick={close}>Why control matters</a>
          <a href="#control" onClick={close}>How we work</a>
          <a href="#brief" onClick={close}>Start a brief</a>
        </nav>
      )}
    </header>
  );
}

function ControlDesk() {
  return (
    <div className="ss-control-desk" aria-label="Example China-side sourcing control file">
      <div className="ss-desk-head">
        <div><span className="ss-status-dot" /><strong>EXAMPLE CHINA-SIDE CONTROL FILE</strong></div>
        <small>Representative retail brief</small>
      </div>
      <div className="ss-desk-brief">
        <span><ShoppingBag size={18} /></span>
        <div><small>BUYER BRIEF</small><strong>Mixed phone-case range</strong><p>Lower quantity per SKU · multiple colorways · air replenishment</p></div>
        <small className="ss-brief-basis">INPUT BASIS</small>
      </div>
      <div className="ss-desk-grid">
        <article>
          <small>01 · COMPARE</small>
          <strong>Quote variables aligned</strong>
          <ul className="ss-record-list">
            <li><Check size={12} />Material &amp; device fit</li>
            <li><Check size={12} />MOQ by color</li>
            <li><Check size={12} />Retail-pack inclusions</li>
          </ul>
        </article>
        <article>
          <small>02 · APPROVE</small>
          <strong>Sample acceptance record</strong>
          <ul className="ss-record-list">
            <li><Check size={12} />Reference image</li>
            <li><Check size={12} />Material &amp; color</li>
            <li><Check size={12} />Fit &amp; feature checks</li>
          </ul>
        </article>
        <article>
          <small>03 · FOLLOW</small>
          <strong>Milestones returned</strong>
          <ol className="ss-stage-list">
            <li><i />Pre-production</li>
            <li><i />In-line review</li>
            <li><i />Final review</li>
          </ol>
        </article>
        <article>
          <small>04 · RELEASE</small>
          <strong>Release file</strong>
          <div className="ss-release-items">
            <span><ClipboardCheck size={13} />QC findings</span>
            <span><Boxes size={13} />SKU quantities</span>
            <span><PackageCheck size={13} />Pack-out</span>
            <span><Truck size={13} />Freight handoff</span>
          </div>
        </article>
      </div>
      <div className="ss-desk-return">
        <ShieldCheck size={18} />
        <div><strong>Expected buyer record</strong><span>Comparison</span><span>Approval</span><span>QC</span><span>Handoff</span></div>
      </div>
    </div>
  );
}

function BuyerPath({ path, active, onSelect }) {
  const Icon = path.icon;
  return (
    <article className={`ss-path-card ${active ? "active" : ""}`}>
      <div className="ss-path-top">
        <span><Icon size={23} /></span>
        <small>{path.number}</small>
      </div>
      <p className="ss-kicker">{path.eyebrow}</p>
      <h3>{path.title}</h3>
      <p>{path.copy}</p>
      <ul>{path.points.map((point) => <li key={point}><Check size={15} />{point}</li>)}</ul>
      <div className="ss-path-brief"><ClipboardCheck size={17} /><span>{path.brief}</span></div>
      <button type="button" onClick={() => onSelect(path.id)}>Use this sourcing path <ArrowRight size={16} /></button>
    </article>
  );
}

export function SourcingServices() {
  const [buyerPath, setBuyerPath] = useState("retail");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    buyerType: "Established / multi-store retailer",
    productScope: "",
    skuCount: "",
    quantityPerSku: "",
    stage: "",
    destination: "",
    freight: "Not decided",
  });

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "China Sourcing Services | DDNZ Global";
    return () => { document.title = previousTitle; };
  }, []);

  const quoteUrl = useMemo(() => {
    const params = new URLSearchParams({
      leadGoal: "Product Sourcing",
      industry: form.productScope,
      subcategory: form.productScope,
      buyerType: form.buyerType,
      sourcingPath: buyerPath,
      productScope: form.productScope,
      skuCount: form.skuCount,
      quantityPerSku: form.quantityPerSku,
      buyingStage: form.stage,
      dest: form.destination,
      freightPreference: form.freight,
      source: "sourcing_services",
    });
    return `/get-a-quote?${params.toString()}`;
  }, [buyerPath, form]);

  const scrollTo = (id) => {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  };

  const choosePath = (id) => {
    setBuyerPath(id);
    setSubmitted(false);
    setForm((current) => ({
      ...current,
      buyerType: id === "retail" ? "Established / multi-store retailer" : "Importer / project buyer",
    }));
    scrollTo("brief");
  };

  const updateForm = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  return (
    <div className="sourcing-services-page" id="top">
      <ShowcaseSEO page="services" />
      <a className="ss-skip-link" href="#main">Skip to sourcing services</a>
      <SourcingHomepageNav />

      <main id="main">
        <section className="ss-hero" aria-labelledby="ss-title">
          <div className="ss-hero-copy">
            <p className="ss-kicker">CHINA SOURCING SERVICES · TWO BUYING PATHS</p>
            <h1 id="ss-title">Source closer to China’s supply base. Keep control of what happens next.</h1>
            <p>For mixed-SKU retail orders and managed sourcing projects, DDNZ turns supplier discovery into a recorded path for comparison, approval, production follow-up and export handoff.</p>
            <div className="ss-hero-actions">
              <button className="ss-primary" type="button" onClick={() => scrollTo("brief")}>Start a sourcing brief <ArrowRight size={17} /></button>
              <button className="ss-text-button" type="button" onClick={() => scrollTo("control")}>Review the control path <ArrowRight size={16} /></button>
            </div>
            <div className="ss-proof-row" aria-label="DDNZ sourcing service principles">
              <span><Boxes size={20} /><b>Mixed-SKU</b><small>retail flexibility</small></span>
              <span><SearchCheck size={20} /><b>Comparable</b><small>supplier offers</small></span>
              <span><FileCheck2 size={20} /><b>Recorded</b><small>approval evidence</small></span>
              <span><PackageCheck size={20} /><b>Accountable</b><small>release handoff</small></span>
            </div>
          </div>
          <ControlDesk />
        </section>

        <section className="ss-principle-strip" aria-label="Service positioning">
          <span><SearchCheck size={18} /> Marketplaces can help discovery</span>
          <span><ShieldCheck size={18} /> Verification comes before commitment</span>
          <span><ClipboardCheck size={18} /> Approvals stay tied to the order</span>
          <span><Globe2 size={18} /> Destination needs enter the brief early</span>
        </section>

        <section className="ss-section ss-paths" id="paths" aria-labelledby="paths-title">
          <div className="ss-split-heading">
            <div><p className="ss-kicker">CHOOSE THE RIGHT OPERATING MODEL</p><h2 id="paths-title">Not every China order should be managed as a wholesale order.</h2></div>
            <p>The right control path depends on SKU depth, quantity per SKU, replenishment needs, customization and the cost of getting a decision wrong.</p>
          </div>
          <div className="ss-path-grid">
            {BUYER_PATHS.map((path) => <BuyerPath path={path} active={buyerPath === path.id} onSelect={choosePath} key={path.id} />)}
          </div>
          <aside className="ss-retail-example">
            <ShoppingBag size={23} />
            <div><small>REPRESENTATIVE USE CASE</small><strong>Phone cases &amp; screen protectors</strong><p>Multiple styles, lower units per model, fast trend changes and repeat air replenishment can matter more than one large-volume SKU.</p></div>
            <a href="/sourcing/mobile-accessories-from-china">See the product control model <ArrowRight size={16} /></a>
          </aside>
        </section>

        <section className="ss-marketplace" id="marketplace" aria-labelledby="marketplace-title">
          <div className="ss-section">
            <div className="ss-marketplace-head">
              <div><p className="ss-kicker">DISCOVERY IS NOT DELIVERY CONTROL</p><h2 id="marketplace-title">A listing is a lead—not a final, comparable offer.</h2></div>
              <p>Online marketplaces are useful discovery channels. The buying decision becomes safer only when price, supplier identity, specification and release conditions are checked against the actual order.</p>
            </div>
            <div className="ss-compare-table" role="table" aria-label="Marketplace discovery and controlled sourcing comparison">
              <div className="ss-compare-row ss-compare-header" role="row">
                <span role="columnheader">Decision point</span><span role="columnheader">Marketplace discovery</span><span role="columnheader">Controlled sourcing record</span>
              </div>
              {COMPARISON_ROWS.map(([point, listing, controlled]) => (
                <div className="ss-compare-row" role="row" key={point}>
                  <strong role="cell">{point}</strong><span role="cell" data-label="Marketplace discovery">{listing}</span><span role="cell" data-label="Controlled sourcing record"><CheckCircle2 size={16} />{controlled}</span>
                </div>
              ))}
            </div>
            <p className="ss-fair-note"><ShieldCheck size={17} /> The issue is not where a supplier lead is found. The issue is whether the final decision is based on comparable inputs and accountable follow-up.</p>
          </div>
        </section>

        <section className="ss-section ss-presence" aria-labelledby="presence-title">
          <div className="ss-presence-copy">
            <p className="ss-kicker">LOCAL PRESENCE ≠ ORDER CONTROL</p>
            <h2 id="presence-title">Being in China does not automatically make an order visible.</h2>
            <p>A buyer visit or a trusted local contact can help communication. It still needs a defined method for supplier verification, specification control, inspection, issue escalation and export readiness.</p>
            <div className="ss-presence-note"><Users size={21} /><span><strong>People support the process.</strong> A recorded control system makes the process reviewable.</span></div>
          </div>
          <div className="ss-gap-list">
            {[
              ["Supplier identity", "Who manufactures, who trades and who is accountable for the offer?"],
              ["Specification control", "What exact model, material, components and inclusions must bulk production match?"],
              ["Inspection method", "Which order-specific checks define acceptance before release?"],
              ["Issue escalation", "Who records exceptions, corrective action and the buyer's decision?"],
              ["Export readiness", "Are labels, documents, packing and freight conditions ready together?"],
            ].map(([title, copy], index) => <article key={title}><small>0{index + 1}</small><div><strong>{title}</strong><p>{copy}</p></div></article>)}
          </div>
        </section>

        <section className="ss-control" id="control" aria-labelledby="control-title">
          <div className="ss-section">
            <div className="ss-control-heading">
              <div><p className="ss-kicker">THE DDNZ CONTROL PATH</p><h2 id="control-title">Seven gates between a product idea and a release decision.</h2></div>
              <p>The buyer keeps the commercial decision. DDNZ structures the China-side information, evidence and follow-up needed to make that decision.</p>
            </div>
            <div className="ss-control-grid">
              {CONTROL_STEPS.map(([number, title, copy, output], index) => (
                <article key={number}>
                  <div className="ss-control-top"><span>{number}</span>{index < CONTROL_STEPS.length - 1 && <ChevronRight size={18} />}</div>
                  <h3>{title}</h3><p>{copy}</p>
                  <div className="ss-step-output"><small>RETURNED RECORD</small><strong>{output}</strong></div>
                </article>
              ))}
            </div>
            <div className="ss-control-output"><FileCheck2 size={22} /><p><strong>Control output</strong><span>A sourcing file that records assumptions, approvals, exceptions and release status—rather than relying on chat history alone.</span></p></div>
          </div>
        </section>

        <section className="ss-section ss-evidence" id="evidence" aria-labelledby="evidence-title">
          <div className="ss-split-heading">
            <div><p className="ss-kicker">EVIDENCE RETURNED</p><h2 id="evidence-title">See what happened—not only what was promised.</h2></div>
            <p>Evidence depth changes by product and order. The principle stays the same: each record should support a real buyer decision.</p>
          </div>
          <div className="ss-evidence-grid">
            {EVIDENCE.map((item) => (
              <article key={item.number}>
                <figure><img src={item.image} alt={item.alt} style={{ objectPosition: item.position }} loading="lazy" /><figcaption>{item.number}</figcaption></figure>
                <h3>{item.title}</h3><p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ss-section ss-brief" id="brief" aria-labelledby="brief-title">
          <div className="ss-brief-intro">
            <p className="ss-kicker">STRUCTURED SOURCING BRIEF</p>
            <h2 id="brief-title">Start with the buying pattern—not a long supplier list.</h2>
            <p>Share enough information to choose the right sourcing path. Detailed files and specifications can follow after fit is confirmed.</p>
            <div className="ss-brief-paths">
              {BUYER_PATHS.map((path) => <button className={buyerPath === path.id ? "active" : ""} type="button" onClick={() => choosePath(path.id)} key={path.id}><span>{path.number}</span><strong>{path.eyebrow === "FLEXIBLE RETAIL SOURCING" ? "Flexible retail" : "Managed project"}</strong></button>)}
            </div>
          </div>
          {!submitted ? (
            <form className="ss-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
              <label htmlFor="ss-buyer-type">Buyer type *
                <select id="ss-buyer-type" name="buyerType" value={form.buyerType} onChange={updateForm} required>
                  <option>Established / multi-store retailer</option>
                  <option>Wholesaler / distributor</option>
                  <option>Importer / project buyer</option>
                  <option>Brand / private-label buyer</option>
                  <option>Other business buyer</option>
                </select>
              </label>
              <label htmlFor="ss-destination">Destination *<input id="ss-destination" name="destination" value={form.destination} onChange={updateForm} placeholder="Country or region" required /></label>
              <label className="ss-wide" htmlFor="ss-product-scope">Product scope *<input id="ss-product-scope" name="productScope" value={form.productScope} onChange={updateForm} placeholder="Products, categories, models or use case" required /></label>
              <label htmlFor="ss-sku-count">Approx. SKU count<input id="ss-sku-count" name="skuCount" value={form.skuCount} onChange={updateForm} placeholder="e.g. 12 styles / colors" /></label>
              <label htmlFor="ss-quantity">Quantity per SKU<input id="ss-quantity" name="quantityPerSku" value={form.quantityPerSku} onChange={updateForm} placeholder="e.g. 50–200 units" /></label>
              <label htmlFor="ss-stage">Buying stage *
                <select id="ss-stage" name="stage" value={form.stage} onChange={updateForm} required>
                  <option value="">Select stage</option>
                  <option>Exploring supply options</option>
                  <option>Planning a test order</option>
                  <option>Comparing current offers</option>
                  <option>Sample / specification stage</option>
                  <option>Replenishing an existing range</option>
                  <option>Order-ready</option>
                </select>
              </label>
              <label htmlFor="ss-freight">Preferred freight
                <select id="ss-freight" name="freight" value={form.freight} onChange={updateForm}>
                  <option>Not decided</option><option>Air freight</option><option>Sea freight</option><option>Air + sea by SKU</option>
                </select>
              </label>
              <button className="ss-primary ss-submit" type="submit">Prepare my sourcing brief <ArrowRight size={17} /></button>
              <p className="ss-form-note"><ShieldCheck size={15} /> Review and submit your details on DDNZ’s secure inquiry page.</p>
            </form>
          ) : (
            <div className="ss-success" role="status">
              <CheckCircle2 size={42} />
              <div><p className="ss-kicker">BRIEF READY</p><h3>{buyerPath === "retail" ? "Flexible retail sourcing" : "Managed project sourcing"}</h3><p>Your buyer type, product scope, SKU pattern, stage and destination are ready for the centralized DDNZ quote flow.</p></div>
              <a className="ss-primary" href={quoteUrl}>Continue to secure brief <ArrowRight size={17} /></a>
              <button className="ss-text-button" type="button" onClick={() => setSubmitted(false)}>Edit request</button>
            </div>
          )}
        </section>

        <section className="ss-handoff" aria-label="Sourcing and freight handoff">
          <div><Globe2 size={24} /><p><strong>DDNZ structures the China-side sourcing file</strong><span>Supplier comparison, approvals, production evidence and release coordination</span></p></div>
          <div><Plane size={21} /><Ship size={21} /><p><strong>Freight begins after sourcing release</strong><span>Air, sea or mixed-mode requirements are captured in the brief</span></p></div>
        </section>
      </main>

      <ShowcaseContactFooter
        pageKey="sourcing-services"
        description="Flexible retail assortment sourcing and managed project sourcing from China—with comparable inputs, recorded approvals and accountable release coordination."
        tagline="China sourcing and export coordination"
        links={[{ label: "Sourcing paths", href: "#paths" }, { label: "Why control matters", href: "#marketplace" }, { label: "Control path", href: "#control" }, { label: "Start a brief", href: "#brief" }]}
      />
    </div>
  );
}

export default SourcingServices;
