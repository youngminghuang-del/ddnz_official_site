import { useEffect, type ComponentType } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Box,
  ClipboardCheck,
  FileSearch,
  Flame,
  IceCreamBowl,
  PackageCheck,
  Refrigerator,
  SearchCheck,
  ShieldCheck,
  Snowflake,
  Store,
  UtensilsCrossed,
  Warehouse,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/SchemaMarkup';
import { trackEvent } from '../lib/analytics';

type CategoryKind = 'commercial-kitchen' | 'outdoor';

type ScopeItem = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

type ShowcaseImage = {
  src: string;
  alt: string;
  label: string;
  caption: string;
};

type PageConfig = {
  eyebrow: string;
  title: string;
  intro: string;
  definition: string;
  heroImage: string;
  heroAlt: string;
  heroCaption: string;
  imageCredit: string;
  imageCreditUrl?: string;
  category: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string;
  scopes: ScopeItem[];
  controlPoints: Array<{ question: string; evidence: string }>;
  photoChecklist: Array<{ label: string; purpose: string }>;
  showcaseImages?: ShowcaseImage[];
};

const configs: Record<CategoryKind, PageConfig> = {
  'commercial-kitchen': {
    eyebrow: 'Product Sourcing · Commercial Kitchen Equipment',
    title: 'Source commercial kitchen equipment from China with a market-defined control plan.',
    intro:
      'For importers, distributors, restaurant groups, hotel projects, and food-service contractors that need more than a supplier list. DDNZ coordinates product scope, supplier comparison, inspection evidence, consolidation, and export handoff against the destination market.',
    definition:
      'This category includes commercial cooking, refrigeration, meat processing, bar and beverage systems, stainless equipment, and turnkey kitchen packages.',
    heroImage: '/images/sourcing/commercial-kitchen-project-hero.webp',
    heroAlt:
      'Bright commercial kitchen project with stainless cooking, preparation, washing and refrigeration zones',
    heroCaption: 'Clean workflow visualization based on supplied project layouts. Final specifications remain project-specific.',
    imageCredit: 'Project visual developed from client-supplied kitchen layouts',
    category: 'Commercial Kitchen Equipment',
    slug: 'commercial-kitchen-equipment-from-china',
    seoTitle: 'Commercial Kitchen Equipment Sourcing from China | DDNZ',
    seoDescription:
      'Source commercial kitchen equipment from China with model-level supplier checks, inspection evidence, consolidation and export coordination.',
    keywords:
      'commercial kitchen equipment from China, restaurant equipment sourcing China, commercial refrigerator supplier China, kitchen equipment inspection',
    scopes: [
      { title: 'Commercial cooking', description: 'Griddles, fryers, ranges, ovens, grills and heated holding equipment.', icon: Flame },
      { title: 'Commercial refrigeration', description: 'Freezers, chillers, counters, display cabinets and cold-room components.', icon: Snowflake },
      { title: 'Food preparation', description: 'Meat grinders, slicers, mixers, processors and preparation machinery.', icon: UtensilsCrossed },
      { title: 'Bar and beverage', description: 'Bar counters, water bars, ice, beverage and preparation systems.', icon: IceCreamBowl },
      { title: 'Stainless and turnkey', description: 'Tables, sinks, shelving, extraction and coordinated kitchen packages.', icon: Store },
      { title: 'Consolidated export', description: 'Multi-supplier receiving, packing review and shipment handoff from China.', icon: Warehouse },
    ],
    controlPoints: [
      { question: 'Where will the equipment be installed?', evidence: 'Destination market, voltage/frequency, plug, gas type, climate and intended commercial use.' },
      { question: 'What exactly is being offered?', evidence: 'Model-level quotation, drawings, materials, capacity, power, dimensions and included accessories.' },
      { question: 'Which claims are verifiable?', evidence: 'Applicable certificates or reports checked against model, manufacturer, market and validity.' },
      { question: 'Can it survive delivery and installation?', evidence: 'Inspection photos, function checks, label review, packing method, dimensions and loading records.' },
    ],
    photoChecklist: [
      { label: 'Model identity', purpose: 'Data plate, model suffix, voltage/phase and utility connection points in one traceable set.' },
      { label: 'Function and finish', purpose: 'Agreed operating check plus welds, surfaces, doors, controls and included accessories.' },
      { label: 'Pack-out', purpose: 'Internal protection, final carton or crate, shipping marks and measured packed dimensions.' },
    ],
  },
  outdoor: {
    eyebrow: 'Product Sourcing · Outdoor Products',
    title: 'Build an outdoor product range in China without narrowing the category too early.',
    intro:
      'For importers, distributors, hospitality projects, and outdoor brands sourcing a current or expanding assortment. DDNZ coordinates supplier comparison, market-specific specifications, inspection evidence, consolidation, and export handoff.',
    definition:
      'The top-level category is intentionally extensible: outdoor grills, insulated coolers, outdoor and portable refrigerators, outdoor kitchens, plus future outdoor product lines.',
    heroImage: '/images/sourcing/outdoor-car-refrigerator-catalog.webp',
    heroAlt:
      'Wheeled car refrigerator used beside a camper at a lakeside campsite',
    heroCaption: 'Supplier product reference shown in a real-use context. Final claims still require model-level evidence.',
    imageCredit: 'Supplier reference image edited for category presentation',
    category: 'Outdoor Products',
    slug: 'outdoor-products-from-china',
    seoTitle: 'Outdoor Products Sourcing from China | DDNZ',
    seoDescription:
      'Source grills, coolers, portable refrigerators and outdoor kitchens from China with supplier checks, inspection and export coordination.',
    keywords:
      'outdoor products sourcing China, BBQ grill supplier China, insulated cooler manufacturer China, portable refrigerator sourcing, outdoor kitchen China',
    scopes: [
      { title: 'Outdoor grills', description: 'Gas, charcoal and portable grill formats with market-specific fuel and label requirements.', icon: Flame },
      { title: 'Insulated coolers', description: 'Hard and soft coolers, insulated transport boxes and related accessories.', icon: Box },
      { title: 'Portable refrigeration', description: 'Outdoor, vehicle and portable refrigerators with defined power and climate conditions.', icon: Refrigerator },
      { title: 'Outdoor kitchens', description: 'Modules, cabinets, counters, sinks, refrigeration and coordinated cooking units.', icon: UtensilsCrossed },
      { title: 'Accessories and power', description: 'Covers, tools, stands, batteries, adapters and product-specific accessories.', icon: PackageCheck },
      { title: 'Expandable assortment', description: 'A controlled category structure for future outdoor products without taxonomy rework.', icon: Store },
    ],
    controlPoints: [
      { question: 'What is the real use environment?', evidence: 'Destination climate, transport mode, outdoor exposure, duty cycle, power/fuel and user profile.' },
      { question: 'Which performance claim matters?', evidence: 'Defined test method for temperature retention, cooling performance, load, corrosion or fuel-system checks.' },
      { question: 'Is the specification market-bound?', evidence: 'Model, voltage, refrigerant, gas components, warnings, manuals and required conformity evidence.' },
      { question: 'How will mixed products ship?', evidence: 'Packing dimensions, battery/refrigerant declarations where applicable, consolidation and loading plan.' },
    ],
    photoChecklist: [
      { label: 'Use environment', purpose: 'The product in its intended climate, vehicle, patio or campsite context—not a blank catalogue cutout.' },
      { label: 'Claim-specific test', purpose: 'Temperature retention, current draw, cooling pull-down, fuel connection or corrosion checks with the method shown.' },
      { label: 'Mixed-SKU packing', purpose: 'Accessories, batteries or refrigerant labels, carton protection, dimensions and consolidation layout.' },
    ],
    showcaseImages: [
      {
        src: '/images/sourcing/outdoor-car-refrigerator-catalog.webp',
        alt: 'Wheeled vehicle refrigerator beside a camper in a lakeside outdoor setting',
        label: 'Vehicle refrigeration',
        caption: 'Wheeled compressor formats for vehicle, campsite and mobile-service use.',
      },
      {
        src: '/images/sourcing/outdoor-insulated-cooler-catalog.webp',
        alt: 'Blue and white insulated cooler positioned at the rear of an outdoor vehicle',
        label: 'Insulated coolers',
        caption: 'Hard coolers for outdoor, hospitality, promotional and cold-chain applications.',
      },
      {
        src: '/images/sourcing/outdoor-portable-refrigerator-catalog.webp',
        alt: 'Compact portable refrigerator in a woodland campsite setting',
        label: 'Portable refrigeration',
        caption: 'Compact powered formats for camping, vehicles and portable cold storage.',
      },
    ],
  },
};

const process = [
  { title: 'Define', body: 'Destination market, product list, target quantity, budget range, timeline and required services.' },
  { title: 'Compare', body: 'Normalize supplier quotations and model specifications before comparing price or lead time.' },
  { title: 'Verify', body: 'Check the supplier, relevant documents and claim-specific evidence; record unresolved gaps.' },
  { title: 'Inspect', body: 'Use an agreed checklist for model, quantity, function, labels, accessories and packing.' },
  { title: 'Consolidate', body: 'Receive multiple suppliers, reconcile items, document packing and prepare the export handoff.' },
];

export default function SourcingCategoryPage({ kind }: { kind: CategoryKind }) {
  const config = configs[kind];
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    trackEvent('sourcing_landing_view', { product_category: config.category });
  }, [config.category]);

  const incoming = new URLSearchParams(location.search);
  const quoteParams = new URLSearchParams({
    leadGoal: 'Product Sourcing',
    industry: config.category,
    source: incoming.get('source') || 'sourcing_landing',
  });
  const sourceArticle = incoming.get('article');
  const subcategory = incoming.get('subcategory');
  if (sourceArticle) quoteParams.set('article', sourceArticle);
  if (subcategory) quoteParams.set('subcategory', subcategory);
  const quoteHref = `/get-a-quote?${quoteParams.toString()}`;
  const canonicalPath = `/sourcing/${config.slug}`;

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#0b1f3a]">
      <SEO
        title={config.seoTitle}
        description={config.seoDescription}
        keywords={config.keywords}
        canonicalPath={canonicalPath}
        image={config.heroImage}
        alternateUrls={[
          { hrefLang: 'x-default', href: `https://www.ddnzglobal.com${canonicalPath}` },
          { hrefLang: 'en', href: `https://www.ddnzglobal.com${canonicalPath}` },
        ]}
      />
      <SchemaMarkup
        type="Service"
        data={{
          name: config.seoTitle,
          serviceType: `${config.category} sourcing and export coordination from China`,
          description: config.seoDescription,
          areaServed: 'Global',
          offerUrl: `https://www.ddnzglobal.com${quoteHref}`,
          offerDescription:
            'Request a market-defined product sourcing, inspection, consolidation and export coordination plan.',
          url: `https://www.ddnzglobal.com${canonicalPath}`,
        }}
      />
      <Navbar />

      <header className="relative overflow-hidden bg-[#07182d] pt-32 pb-20 text-white lg:pt-36 lg:pb-24">
        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_78%_20%,#0b4f8a_0,transparent_35%),radial-gradient(circle_at_15%_85%,#d97706_0,transparent_25%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.08fr_.72fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-400">{config.eyebrow}</p>
            <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.45rem] text-balance">{config.title}</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200">{config.intro}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to={quoteHref}
                data-analytics-tracked="true"
                onClick={() => trackEvent('sourcing_quote_click', { product_category: config.category, cta_location: 'hero' })}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3.5 font-extrabold text-white hover:bg-amber-700"
              >
                Start a scoped request <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#control-plan" className="inline-flex items-center justify-center rounded-xl border border-white/25 px-5 py-3.5 font-bold text-white hover:bg-white/10">
                Review the control plan
              </a>
            </div>
          </div>
          <figure className="relative overflow-hidden border border-white/15 bg-slate-900 shadow-[0_24px_70px_rgba(0,0,0,.35)]">
            <div className="aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5]">
              <img
                src={config.heroImage}
                alt={config.heroAlt}
                loading="eager"
                fetchPriority="high"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#07182d] via-[#07182d]/85 to-transparent px-5 pb-4 pt-14 text-xs leading-5 text-slate-200">
              {config.heroCaption}
              {config.imageCreditUrl ? (
                <a
                  href={config.imageCreditUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-1 font-bold text-amber-300 hover:text-white"
                >
                  {config.imageCredit}
                </a>
              ) : (
                <span className="ml-1 font-bold text-amber-300">{config.imageCredit}</span>
              )}
            </figcaption>
          </figure>
        </div>
      </header>

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid gap-5 lg:grid-cols-[220px_1fr] lg:items-center">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0b4f8a]">Scope definition</p>
              <p className="text-lg font-bold leading-8 text-slate-800">{config.definition}</p>
            </div>
          </div>
        </section>

        {config.showcaseImages?.length ? (
          <section className="border-b border-slate-200 bg-[#edf2f6]">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="grid gap-8 lg:grid-cols-[0.62fr_1.38fr] lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Supplier range, buyer controls</p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                    See the product family before narrowing the model.
                  </h2>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-slate-600 lg:justify-self-end">
                  These category images come from supplier-provided product references with catalogue and brand information removed.
                  They show the range only; capacity, power, refrigerant, accessories and market compliance still require model-level verification.
                </p>
              </div>

              <div className="mt-9 grid gap-4 md:grid-cols-2 md:grid-rows-2">
                {config.showcaseImages.map((image, index) => (
                  <figure
                    key={image.label}
                    className={`group relative min-h-[280px] overflow-hidden bg-[#07182d] ${
                      index === 0 ? 'md:row-span-2 md:min-h-[580px]' : 'md:min-h-0'
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07182d] via-[#07182d]/10 to-transparent" />
                    <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">{image.label}</p>
                      <p className="mt-2 max-w-md text-sm leading-6 text-slate-100">{image.caption}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Category coverage</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">A product map that supports a real buying brief.</h2>
            <p className="mt-4 text-slate-600 leading-7">Each subcategory stays separate in the inquiry and audit trail, while the top-level category keeps reporting and future expansion consistent.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {config.scopes.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-[#0b4f8a]"><Icon className="h-5 w-5" /></div>
                  <h3 className="mt-5 text-lg font-black">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[.72fr_1.28fr] lg:items-start lg:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Useful imagery, not decoration</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Three photo sets make the buying brief easier to read—and easier to audit.</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Replace stock imagery with DDNZ or supplier originals as soon as a real project enters review. Keep model labels and measurements readable as text in the record.
              </p>
            </div>
            <div className="divide-y divide-slate-200 border-y border-slate-300">
              {config.photoChecklist.map((item, index) => (
                <div key={item.label} className="grid gap-2 py-4 sm:grid-cols-[120px_1fr] sm:gap-5">
                  <p className="font-mono text-xs font-black text-[#0b4f8a]">PHOTO 0{index + 1}</p>
                  <div>
                    <h3 className="font-black text-slate-900">{item.label}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.purpose}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="control-plan" className="bg-[#eaf0f6] py-20 scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
              <div className="lg:sticky lg:top-28">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Evidence before assurance</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Four questions keep product claims tied to proof.</h2>
                <p className="mt-5 leading-7 text-slate-600">
                  Requirements vary by destination and model. DDNZ records what was checked, what remains supplier-provided, and what still needs buyer or local compliance confirmation.
                </p>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="grid grid-cols-[1fr_1.25fr] bg-[#0b1f3a] px-5 py-4 text-xs font-black uppercase tracking-wider text-white">
                  <span>Control question</span><span>Evidence to request</span>
                </div>
                {config.controlPoints.map((row, index) => (
                  <div key={row.question} className={`grid gap-3 px-5 py-5 sm:grid-cols-[1fr_1.25fr] ${index ? 'border-t border-slate-200' : ''}`}>
                    <p className="font-extrabold text-slate-900">{row.question}</p>
                    <p className="text-sm leading-6 text-slate-600">{row.evidence}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0b4f8a]">Working sequence</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">One traceable handoff from brief to export.</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-5">
            {process.map((item, index) => (
              <article key={item.title} className="relative rounded-2xl border border-slate-200 bg-white p-5">
                <span className="font-mono text-xs font-black text-amber-700">0{index + 1}</span>
                <h3 className="mt-5 font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="rounded-3xl border border-slate-200 p-7 md:p-9">
              <FileSearch className="h-7 w-7 text-[#0b4f8a]" />
              <h2 className="mt-5 text-2xl font-black">What to send first</h2>
              <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-700">
                {['Destination country and intended commercial use', 'Product list, reference photos or target models', 'Estimated quantity and target timing', 'Required certifications, tests or buyer standards', 'Need for sourcing, inspection, consolidation and export freight'].map((item) => (
                  <li key={item} className="flex gap-3"><BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-[#07182d] p-7 text-white md:p-9">
              <SearchCheck className="h-7 w-7 text-amber-400" />
              <h2 className="mt-5 text-2xl font-black">What the first response should clarify</h2>
              <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-200">
                {['Scope and missing specifications', 'Which evidence can be checked at the current stage', 'Supplier-comparison and inspection approach', 'Consolidation and shipment information still required', 'Risks or assumptions that need buyer confirmation'].map((item) => (
                  <li key={item} className="flex gap-3"><ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-[#f5f7fa] py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <ShieldCheck className="mx-auto h-9 w-9 text-[#0b4f8a]" />
            <h2 className="mt-5 text-3xl font-black tracking-tight">Start with the destination market and product list.</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">The inquiry keeps the article source, product category, subcategory and requested services so the right review path receives it.</p>
            <Link
              to={quoteHref}
              data-analytics-tracked="true"
              onClick={() => trackEvent('sourcing_quote_click', { product_category: config.category, cta_location: 'final' })}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-4 font-extrabold text-white hover:bg-amber-700"
            >
              Submit the sourcing brief <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
