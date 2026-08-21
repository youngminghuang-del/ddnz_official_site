import SEO from "../../components/SEO";

const pages = {
  products: {
    title: "Product Sourcing Categories in China | DDNZ Global",
    description: "Explore DDNZ product sourcing for commercial kitchen equipment, refrigeration, audio, mobile accessories and outdoor products, with supplier comparison, QC and export handoff.",
    keywords: "China product sourcing, commercial kitchen sourcing, speaker sourcing China, mobile accessories sourcing, outdoor products sourcing",
    path: "/products",
    image: "/images/product-showcase/index/audio-speakers-category.webp",
  },
  services: {
    title: "China Sourcing Services for Retailers & Importers | DDNZ Global",
    description: "DDNZ manages flexible mixed-SKU retail sourcing and China sourcing projects with comparable offers, recorded approvals, production follow-up and export handoff.",
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
      image={config.image}
    />
  );
}
