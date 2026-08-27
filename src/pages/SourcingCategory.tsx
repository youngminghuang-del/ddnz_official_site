import { useEffect, type ComponentType } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BadgeCheck,
  Backpack,
  BatteryCharging,
  Cable,
  ClipboardCheck,
  FileSearch,
  Flame,
  Headphones,
  IceCreamBowl,
  MicVocal,
  PackageCheck,
  PackageOpen,
  Plug,
  RadioTower,
  Refrigerator,
  SearchCheck,
  ShieldCheck,
  Snowflake,
  Speaker,
  Smartphone,
  Store,
  TentTree,
  Usb,
  UtensilsCrossed,
  Warehouse,
  Watch,
  Wifi,
} from 'lucide-react';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/SchemaMarkup';
import { DdnzEyebrow, DdnzPrimaryLink, DdnzSecondaryLink } from '../components/DdnzUi';
import { trackEvent } from '../lib/analytics';
import { buildQuoteHref } from '../lib/quoteLinks';
import { readAttribution } from '../lib/attribution';
import { useLanguage } from '../contexts/LanguageContext';

type CategoryKind = 'commercial-kitchen' | 'audio-speakers' | 'mobile-accessories' | 'outdoor';

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
  heroWidth: number;
  heroHeight: number;
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
    heroImage: '/media/process/kitchen-production-poster.webp',
    heroWidth: 720,
    heroHeight: 1280,
    heroAlt: 'Commercial ice-machine components moving through a supplier production line in China',
    heroCaption: 'Authorized field material showing commercial-kitchen production follow-up. Final specifications and acceptance remain order-specific.',
    imageCredit: 'DDNZ field material · China origin',
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
  'audio-speakers': {
    eyebrow: 'Product Sourcing · Audio & Speakers',
    title: 'Source audio and speaker products from China with every sellable configuration defined.',
    intro:
      'For importers, distributors, electronics wholesalers, event suppliers, and private-label brands. DDNZ compares complete configurations—not similar-looking cabinets—and coordinates samples, inspection evidence, consolidation, and export handoff.',
    definition:
      'This category covers portable and party speakers, professional and installed audio, microphones, headphones, amplifiers, and the batteries, adapters, accessories, packaging, and branding that determine the real sellable unit.',
    heroImage: '/media/process/supplier-visit-speaker.webp',
    heroWidth: 1050,
    heroHeight: 1400,
    heroAlt: 'Buyer and supplier representatives reviewing speaker products during a China showroom visit',
    heroCaption: 'Authorized field material showing product-fit discussion during a supplier visit. Supplier qualification and model approval require separate records.',
    imageCredit: 'DDNZ field material · China origin',
    category: 'Audio & Speakers',
    slug: 'audio-speakers-from-china',
    seoTitle: 'Audio & Speaker Sourcing from China | DDNZ',
    seoDescription:
      'Source portable, party and professional speakers from China with configuration comparison, battery and function checks, inspection, consolidation and export support.',
    keywords:
      'speaker sourcing China, portable speaker supplier China, party speaker wholesale China, audio equipment inspection, private label speakers China',
    scopes: [
      { title: 'Portable speakers', description: 'Compact Bluetooth, TWS and battery-powered models for retail and promotional channels.', icon: Speaker },
      { title: 'Party speakers', description: 'Large active systems with drivers, lighting, microphones, batteries and trolley formats.', icon: RadioTower },
      { title: 'Professional audio', description: 'PA, installed sound, amplifiers, mixers and project-based audio configurations.', icon: MicVocal },
      { title: 'Headphones and audio accessories', description: 'Headphones, microphones, stands, cables, adapters and related sellable accessories.', icon: Headphones },
      { title: 'Wireless and power chain', description: 'Bluetooth versions, wireless microphones, adapters, cells, battery packs and charging behavior.', icon: Wifi },
      { title: 'Private label and packing', description: 'Logo placement, artwork, manuals, retail cartons, foam protection and master-carton controls.', icon: PackageOpen },
    ],
    controlPoints: [
      { question: 'Are the quotations actually equivalent?', evidence: 'Cabinet, drivers, functions, battery, microphones, accessories, branding, packing and trade term aligned line by line.' },
      { question: 'Can the claimed output be demonstrated?', evidence: 'Agreed audio/function test, input and connectivity checks, control operation and observable limitations recorded for the exact sample.' },
      { question: 'Is the battery and wireless file complete?', evidence: 'Installed battery identity, capacity, charger, transport evidence where applicable, and the offered Bluetooth or microphone configuration.' },
      { question: 'Will the retail unit arrive sellable?', evidence: 'Approved artwork, labels, manuals, included accessories, foam protection, carton condition and final pack-out photos.' },
    ],
    photoChecklist: [
      { label: 'Exact configuration', purpose: 'Front, rear panel, drivers, functions, included microphones, remote, charger, cables and accessories in one traceable set.' },
      { label: 'Power and function', purpose: 'Battery identity, charging behavior, inputs, wireless functions, controls and an agreed sound/function check.' },
      { label: 'Retail pack-out', purpose: 'Artwork, labels, manual, foam, accessory placement, sealed carton and measured packed dimensions.' },
    ],
  },
  'mobile-accessories': {
    eyebrow: 'Product Sourcing · Mobile Accessories',
    title: 'Build a mobile-accessories range in China with SKU, compatibility, power and packaging under control.',
    intro:
      'For importers, electronics distributors, retail chains, e-commerce sellers, and private-label brands managing fast-changing assortments. DDNZ structures the SKU list, normalizes supplier offers, verifies samples and pack-outs, and coordinates consolidation and export.',
    definition:
      'This category includes chargers, cables, power banks, earbuds, cases, screen protection, mounts, wearables, and mixed accessory assortments where compatibility, performance, labeling, and retail packaging determine sellability.',
    heroImage: '/media/process/phone-case-production-poster.webp',
    heroWidth: 720,
    heroHeight: 1282,
    heroAlt: 'Phone-case production equipment operating at a China supplier facility',
    heroCaption: 'Authorized field material showing a mobile-accessories production stage. Compatibility, materials, finish and artwork still require SKU-level approval.',
    imageCredit: 'DDNZ field material · China origin',
    category: 'Mobile Accessories',
    slug: 'mobile-accessories-from-china',
    seoTitle: 'Mobile Accessories Sourcing from China | DDNZ',
    seoDescription:
      'Source chargers, cables, power banks, earbuds, cases and mobile accessories from China with SKU comparison, sample checks, packaging control and consolidation.',
    keywords:
      'mobile accessories sourcing China, phone accessories wholesale China, charger cable supplier China, power bank sourcing, private label phone accessories',
    scopes: [
      { title: 'Chargers and adapters', description: 'Wall, car and travel chargers with defined plug, ports, protocols and rated output.', icon: Plug },
      { title: 'Cables and connectors', description: 'USB-C, Lightning-compatible and multi-connector formats with length, material and power claims defined.', icon: Cable },
      { title: 'Power banks', description: 'Capacity, cell configuration, ports, display, charging behavior and transport documentation.', icon: BatteryCharging },
      { title: 'Earbuds and wearables', description: 'TWS earbuds, headphones, watches and wearable accessories with app and compatibility boundaries.', icon: Watch },
      { title: 'Protection and mounting', description: 'Cases, screen protectors, holders, stands and vehicle mounts matched to device or size range.', icon: Smartphone },
      { title: 'Mixed-SKU retail packing', description: 'Barcode, color/model matrix, inserts, artwork, carton quantities and consolidation reconciliation.', icon: Usb },
    ],
    controlPoints: [
      { question: 'Which device and protocol must it support?', evidence: 'Device list, connector, charging standard, rated input/output, regional plug and any claimed compatibility.' },
      { question: 'Is each supplier quoting the same SKU?', evidence: 'Materials, dimensions, chipset or cell assumptions, cable length, included parts, color, logo and retail pack aligned.' },
      { question: 'Can performance and safety claims be checked?', evidence: 'Agreed sample checks for charging, capacity, temperature, fit, pairing or durability plus model-linked documents where relevant.' },
      { question: 'Can a mixed assortment be reconciled?', evidence: 'SKU/color matrix, barcode and artwork approval, pack quantity, master-carton marks, inspection count and warehouse receiving record.' },
    ],
    photoChecklist: [
      { label: 'SKU identity', purpose: 'Model, color, connector, dimensions, rated data and compatible device shown together with the approved sample.' },
      { label: 'Claim-specific check', purpose: 'Charging/output, capacity, fit, pairing, magnet strength or other agreed check with the method recorded.' },
      { label: 'Assortment pack-out', purpose: 'Barcode, artwork, inserts, color/model quantity, retail pack and reconciled master-carton marking.' },
    ],
  },
  outdoor: {
    eyebrow: 'Product Sourcing · Outdoor Products',
    title: 'Source a dealer-ready outdoor range from China—with claims, power and pack-out under control.',
    intro:
      'For importers, distributors, retail chains, hospitality projects, and outdoor brands managing a current or expanding assortment. DDNZ compares model-level offers, locks market-specific specifications, records inspection evidence, and coordinates mixed-SKU consolidation and export handoff.',
    definition:
      'This category covers compact tents and shelters, overlanding backpacks, insulated coolers, portable refrigeration, portable power, outdoor cooking systems, and the accessories and packaging that make the range sellable.',
    heroImage: '/images/sourcing/outdoor-portable-energy-brand-neutral-v1.webp',
    heroWidth: 1549,
    heroHeight: 1015,
    heroAlt:
      'Brand-neutral portable power stations, solar panels, charging equipment and outdoor energy accessories displayed as a product family',
    heroCaption: 'Authorized product-family reference with supplier branding removed. Capacity, battery chemistry, rated output and transport evidence remain model-specific.',
    imageCredit: 'Authorized supplier reference · branding removed',
    category: 'Outdoor Products',
    slug: 'outdoor-products-from-china',
    seoTitle: 'Outdoor Products Sourcing from China | DDNZ',
    seoDescription:
      'Source tents, overlanding backpacks, coolers, portable refrigerators, portable power and outdoor cooking products from China with supplier checks, QC evidence and export coordination.',
    keywords:
      'outdoor products sourcing China, tent supplier China, overlanding backpack manufacturer China, portable power station sourcing, insulated cooler manufacturer China, portable refrigerator sourcing',
    scopes: [
      { title: 'Compact tents & shelters', description: 'Fabric, waterproof rating, seam taping, poles, ventilation, packed size and setup hardware defined by use case.', icon: TentTree },
      { title: 'Overlanding backpacks', description: 'Capacity, fabric, zippers, stitching, load-bearing points, hydration features and retail pack-out.', icon: Backpack },
      { title: 'Coolers & portable refrigeration', description: 'Insulated and powered formats with temperature, compressor, vehicle-power and climate assumptions recorded.', icon: Refrigerator },
      { title: 'Portable power', description: 'Capacity, battery chemistry, rated output, ports, solar input, accessories and transport documents.', icon: BatteryCharging },
      { title: 'Outdoor cooking & camp systems', description: 'Grills, burners and coordinated modules with market-specific fuel, materials, warnings and accessories.', icon: UtensilsCrossed },
      { title: 'Mixed range & accessories', description: 'Lighting, tools, covers, adapters, replacement parts and multi-supplier consolidation reconciled by SKU.', icon: PackageCheck },
    ],
    controlPoints: [
      { question: 'Where and how will the product be used?', evidence: 'Destination climate, user profile, outdoor exposure, setup frequency, load, duty cycle, vehicle power or fuel type.' },
      { question: 'Which sellable claim must be proved?', evidence: 'Defined checks for waterproofing, seam and load strength, temperature retention, cooling pull-down, output or runtime.' },
      { question: 'Are power, battery and fuel files complete?', evidence: 'Exact model, ratings, battery identity, transport documents, refrigerant or fuel components, warnings and manuals.' },
      { question: 'Can the assortment be packed and reconciled?', evidence: 'Packed dimensions, accessory list, barcode/SKU matrix, carton protection, regulated-goods labels and consolidation plan.' },
    ],
    photoChecklist: [
      { label: 'Construction & model identity', purpose: 'Fabric, seams, poles, zippers, load points, data plate, ports and included accessories tied to the approved SKU.' },
      { label: 'Claim-specific verification', purpose: 'Water exposure, load, temperature retention, cooling pull-down, output or runtime checked with the method recorded.' },
      { label: 'Complete pack-out', purpose: 'Packed dimensions, inserts, warnings, battery or refrigerant labels, accessory count and mixed-SKU carton reconciliation.' },
    ],
    showcaseImages: [
      {
        src: '/images/sourcing/outdoor-portable-energy-brand-neutral-v1.webp',
        alt: 'Brand-neutral portable energy product family with solar panels and charging equipment',
        label: 'Portable power systems',
        caption: 'Power stations, solar input and charging accessories compared by exact capacity, output, battery and transport file.',
      },
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
  { title: 'Buying brief', body: 'Define the destination, product list, quantity, budget range, timing and required controls.' },
  { title: 'Supplier shortlist', body: 'Normalize quotations and model specifications before comparing price, capacity or lead time.' },
  { title: 'Samples & specifications', body: 'Confirm the exact sample, specification, artwork and open evidence before production.' },
  { title: 'Production follow-up', body: 'Track the agreed milestones and record changes, delays or unresolved order exceptions.' },
  { title: 'QC evidence', body: 'Check model, quantity, function, labels, accessories and packing against the agreed checklist.' },
  { title: 'Export handoff', body: 'Reconcile approved cargo and documents before consolidation, booking and loading execution.' },
];

export default function SourcingCategoryPage({ kind }: { kind: CategoryKind }) {
  const config = configs[kind];
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
    trackEvent('sourcing_landing_view', { product_category: config.category });
  }, [config.category]);

  const incoming = new URLSearchParams(location.search);
  const sourceArticle = incoming.get('article');
  const subcategory = incoming.get('subcategory');
  const quoteHref = buildQuoteHref({
    intent: 'Product Sourcing',
    language,
    source: incoming.get('source') || 'sourcing_landing',
    industry: config.category,
    article: sourceArticle || undefined,
    subcategory: subcategory || undefined,
    attribution: readAttribution(location.search),
  });
  // Category body copy is currently authoritative in English only. Localized
  // convenience routes therefore consolidate to the genuine English page and
  // do not claim untranslated hreflang equivalents.
  const canonicalPath = `/sourcing/${config.slug}`;

  return (
    <div className="ddnz-home min-h-screen bg-[#fbfaf7] text-[var(--ddnz-ink)]">
      <SEO
        title={config.seoTitle}
        description={config.seoDescription}
        keywords={config.keywords}
        canonicalPath={canonicalPath}
        image={config.heroImage}
        alternateUrls={[
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
          providerName: 'DDNZ Global Trade Co., Ltd.',
        }}
      />
      <SourcingHomepageNav />

      <header className="relative overflow-hidden bg-[#10243f] py-16 text-white sm:py-20 lg:py-24">
        <div className="absolute inset-0 opacity-55 bg-[radial-gradient(circle_at_78%_20%,#763c9c_0,transparent_35%),radial-gradient(circle_at_15%_85%,#c94f2f_0,transparent_25%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.08fr_.72fr] lg:items-center lg:px-8">
          <div>
            <DdnzEyebrow dark>{config.eyebrow}</DdnzEyebrow>
            <h1 className="mt-5 max-w-[17ch] text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[1.03] tracking-[-0.05em] text-balance">{config.title}</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200">{config.intro}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <DdnzPrimaryLink
                to={quoteHref}
                onClick={() => trackEvent('sourcing_quote_click', { product_category: config.category, cta_location: 'hero' })}
                tracking
              >
                Start a scoped request
              </DdnzPrimaryLink>
              <DdnzSecondaryLink to="#control-plan" className="border-white/30 text-white hover:bg-white/10">Review the control plan</DdnzSecondaryLink>
            </div>
          </div>
          <figure className="relative self-center overflow-hidden border border-white/15 bg-slate-900 shadow-[0_24px_70px_rgba(0,0,0,.35)]">
            <div className={kind === 'outdoor' ? 'aspect-[16/10]' : 'aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5]'}>
              <img
                src={config.heroImage}
                alt={config.heroAlt}
                width={config.heroWidth}
                height={config.heroHeight}
                loading="eager"
                fetchPriority="high"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#10243f] via-[#10243f]/85 to-transparent px-5 pb-4 pt-14 text-xs leading-5 text-slate-200">
              {config.heroCaption}
              {config.imageCreditUrl ? (
                <a
                  href={config.imageCreditUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-1 font-bold text-[#f5a078] hover:text-white"
                >
                  {config.imageCredit}
                </a>
              ) : (
                <span className="ml-1 font-bold text-[#f5a078]">{config.imageCredit}</span>
              )}
            </figcaption>
          </figure>
        </div>
      </header>

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid gap-5 lg:grid-cols-[220px_1fr] lg:items-center">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ddnz-purple-strong)]">Scope definition</p>
              <p className="text-lg font-bold leading-8 text-slate-800">{config.definition}</p>
            </div>
          </div>
        </section>

        {config.showcaseImages?.length ? (
          <section className="border-b border-slate-200 bg-[#edf2f6]">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="grid gap-8 lg:grid-cols-[0.62fr_1.38fr] lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ddnz-coral-strong)]">Supplier range, buyer controls</p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                    See the product family before narrowing the model.
                  </h2>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-slate-600 lg:justify-self-end">
                  These category images come from supplier-provided product references with catalogue and brand information removed.
                  They show the range only; capacity, power, refrigerant, accessories and market compliance still require model-level verification.
                </p>
              </div>

              <div className="mt-9 grid gap-4 md:grid-cols-2">
                {config.showcaseImages.map((image) => (
                  <figure
                    key={image.label}
                    className="group relative aspect-[16/11] min-h-[280px] overflow-hidden rounded-2xl bg-[#10243f] shadow-[0_18px_48px_rgba(16,36,63,.12)]"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10243f] via-[#10243f]/10 to-transparent" />
                    <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f5a078]">{image.label}</p>
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
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ddnz-coral-strong)]">Category coverage</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">A product map that supports a real buying brief.</h2>
            <p className="mt-4 text-slate-600 leading-7">Each subcategory stays separate in the inquiry and audit trail, while the top-level category keeps reporting and future expansion consistent.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {config.scopes.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="ddnz-card p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--ddnz-purple-soft)] text-[var(--ddnz-purple-strong)]"><Icon className="h-5 w-5" /></div>
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
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ddnz-coral-strong)]">Useful imagery, not decoration</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Three photo sets make the buying brief easier to read—and easier to audit.</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Use authorized DDNZ or supplier field material to show the visible action. Keep model labels, measurements and acceptance decisions readable in the underlying order record.
              </p>
            </div>
            <div className="divide-y divide-slate-200 border-y border-slate-300">
              {config.photoChecklist.map((item, index) => (
                <div key={item.label} className="grid gap-2 py-4 sm:grid-cols-[120px_1fr] sm:gap-5">
                  <p className="font-mono text-xs font-black text-[var(--ddnz-purple-strong)]">PHOTO 0{index + 1}</p>
                  <div>
                    <h3 className="font-black text-slate-900">{item.label}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.purpose}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="control-plan" className="scroll-mt-24 bg-[var(--ddnz-purple-soft)] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
              <div className="lg:sticky lg:top-28">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ddnz-coral-strong)]">Evidence before assurance</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Four questions keep product claims tied to proof.</h2>
                <p className="mt-5 leading-7 text-slate-600">
                  Requirements vary by destination and model. DDNZ records what was checked, what remains supplier-provided, and what still needs buyer or local compliance confirmation.
                </p>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="grid grid-cols-[1fr_1.25fr] bg-[var(--ddnz-ink)] px-5 py-4 text-xs font-black uppercase tracking-wider text-white">
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
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ddnz-purple-strong)]">Working sequence</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">One traceable handoff from brief to export.</h2>
          <div className="mt-10 grid gap-px overflow-hidden border border-slate-200 bg-slate-200 md:grid-cols-2 lg:grid-cols-6">
            {process.map((item, index) => (
              <article key={item.title} className="relative bg-white p-5">
                <span className="font-mono text-xs font-black text-[var(--ddnz-coral-strong)]">0{index + 1}</span>
                <h3 className="mt-5 font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
          <Link
            to="/how-we-work"
            className="mt-6 inline-flex min-h-11 items-center text-sm font-black text-[var(--ddnz-purple-strong)] underline decoration-transparent underline-offset-4 transition hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ddnz-purple)]"
          >
            View the full six-checkpoint workflow <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="ddnz-card p-7 md:p-9">
              <FileSearch className="h-7 w-7 text-[var(--ddnz-purple-strong)]" />
              <h2 className="mt-5 text-2xl font-black">What to send first</h2>
              <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-700">
                {['Destination country and intended commercial use', 'Product list, reference photos or target models', 'Estimated quantity and target timing', 'Required certifications, tests or buyer standards', 'Need for sourcing, inspection, consolidation and export freight'].map((item) => (
                  <li key={item} className="flex gap-3"><BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--ddnz-coral-strong)]" />{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-[var(--ddnz-ink)] p-7 text-white md:p-9">
              <SearchCheck className="h-7 w-7 text-[#f5a078]" />
              <h2 className="mt-5 text-2xl font-black">What the first response should clarify</h2>
              <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-200">
                {['Scope and missing specifications', 'Which evidence can be checked at the current stage', 'Supplier-comparison and inspection approach', 'Consolidation and shipment information still required', 'Risks or assumptions that need buyer confirmation'].map((item) => (
                  <li key={item} className="flex gap-3"><ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#f5a078]" />{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-[#fbfaf7] py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <ShieldCheck className="mx-auto h-9 w-9 text-[var(--ddnz-purple-strong)]" />
            <h2 className="mt-5 text-3xl font-black tracking-tight">Start with the destination market and product list.</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">The inquiry keeps the article source, product category, subcategory and requested services so the right review path receives it.</p>
            <DdnzPrimaryLink
              to={quoteHref}
              onClick={() => trackEvent('sourcing_quote_click', { product_category: config.category, cta_location: 'final' })}
              className="mt-7"
              tracking
            >
              Submit the sourcing brief
            </DdnzPrimaryLink>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
