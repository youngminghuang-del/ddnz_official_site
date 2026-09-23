import { entryKeywords } from '../../features/search-intent/entry-keywords.mjs';
import {refrigerationAlternates} from '../../features/refrigeration/copy';
import {audioAlternates} from '../../features/audio/copy';
import { overviewAlternates } from '../../features/overview/copy';
import SEO from "../../components/SEO";

const pages = {
  products: {
    title: entryKeywords.en.productsMetaTitle,
    description: "Explore DDNZ product sourcing for commercial kitchen equipment, refrigeration, food processing machinery and equipment packages, audio, mobile accessories and outdoor products.",
    keywords: "China product sourcing, commercial kitchen sourcing, speaker sourcing China, mobile accessories sourcing, outdoor products sourcing",
    path: "/products",
    image: "/images/product-showcase/index/audio-speakers-category.webp",
  },
  services: {
    title: entryKeywords.en.servicesMetaTitle,
    description: entryKeywords.en.servicesIntro,
    keywords: "China sourcing services, sourcing agent China, mixed SKU sourcing, supplier verification, production follow up China",
    path: "/sourcing-services",
    image: "/images/product-showcase/kitchen/kitchen-factory-inspection-sanitized.webp",
  },
  kitchen: {
    title: "Commercial Kitchen Design & Equipment Sourcing | DDNZ Global",
    description: "Plan and source commercial kitchen equipment from China with operations-led layout, equipment configuration, supplier comparison, inspection evidence and export handoff.",
    keywords: "commercial kitchen equipment China, kitchen design sourcing, restaurant equipment sourcing China, kitchen supplier inspection",
    path: "/sourcing/commercial-kitchen-equipment-from-china",
    image: "/images/product-showcase/kitchen/kitchen-operating-sanitized.webp",
  },
  refrigeration: {
    title: "Commercial Refrigeration Equipment Sourcing | DDNZ Global",
    description: "Source commercial refrigerators, prep counters, display cabinets and ice makers from China with climate, model, performance and pack-out controls.",
    keywords: "commercial refrigeration equipment China, refrigerator sourcing China, ice maker supplier China, refrigeration quality control",
    path: "/refrigeration-equipment",
    image: "/images/product-showcase/refrigeration/upright-dg860l4-sanitized.webp",
  },
  mobile: {
    title: "Mobile Accessories Sourcing from China | DDNZ Global",
    description: "Build a mobile-accessories range in China across cases, power banks, chargers, cables and adapters with SKU, sample, QC and pack-out controls.",
    keywords: "mobile accessories sourcing China, phone case supplier China, power bank sourcing, charger supplier China",
    path: "/sourcing/mobile-accessories-from-china",
    image: "/images/product-showcase/mobile/family-phone-cases-v1.webp",
  },
  audio: {
    title: "Audio & Speaker Sourcing from China | DDNZ Global",
    description: "Source portable, party and specialty speakers from China with exact-model comparison, sample approval, production evidence and export release control.",
    keywords: "speaker sourcing China, audio supplier China, Bluetooth speaker manufacturer, speaker quality control China",
    path: "/sourcing/audio-speakers-from-china",
    image: "/images/product-showcase/audio/vintage-range-hero-v1.webp",
  },
  outdoor: {
    title: "Outdoor Products Sourcing from China | DDNZ Global",
    description: "Build an outdoor product range across coolers, portable refrigeration, power systems and camp products with capability, climate and pack-out controls.",
    keywords: "outdoor products sourcing China, cooler supplier China, portable refrigerator sourcing, portable power station sourcing",
    path: "/sourcing/outdoor-products-from-china",
    image: "/images/product-showcase/outdoor/range-atlas-hero-v1.webp",
  },
};

export default function ShowcaseSEO({ page }) {
  const config = pages[page];
  return (
    <SEO
      title={config.title}
      description={config.description}
      keywords={config.keywords}
      canonicalPath={config.path}
      contentLanguage="en"
      alternateUrls={page === 'refrigeration' ? refrigerationAlternates() : page === 'audio' ? audioAlternates() : ['products','services'].includes(page) ? overviewAlternates(page === 'products' ? 'products' : 'sourcing-services') : [{ hrefLang: 'en', href: `https://www.ddnzglobal.com${config.path}/` }]}
      image={config.image}
    />
  );
}
