import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  alternateUrls?: Array<{ hrefLang: string; href: string }>;
}

export default function SEO({ title, description, keywords, canonicalPath, alternateUrls }: SEOProps) {
  const { language } = useLanguage();
  const location = useLocation();

  // 1. Define localized metadata dictionaries incorporating dual branding and targeted SEO keywords
  const seoDefaults: Record<string, { title: string; desc: string; keywords: string }> = {
    en: {
      title: 'Heaven Born | China Freight Forwarding & Logistics',
      desc: 'Heaven Born International Freight provides freight forwarding from China, with trade support delivered by DDNZ Global Trade Co., Ltd.',
      keywords: 'Heaven Born International Freight, DDNZ Global Trade, China Cargo Agent, Guangzhou Freight Forwarder, Sea Freight From China, Air Cargo, Amazon FBA Logistics, China Sourcing Agent',
    },
    zh: {
      title: '华正邦泰国际货运 | 广州出口货代、国际海运与空运',
      desc: '华正邦泰国际货运代理有限公司提供中国出口货运服务，大递诺展贸易有限公司协同提供验厂、验货、代出口与报关等贸易支持。',
      keywords: '广州货代, 广州出口货运代理, 华正邦泰国际货运, 国际海运, 国际空运, 亚马逊FBA, 中国采购代理, 国际货运代理',
    },
    fr: {
      title: 'DDNZ & Heaven Born | Transitaire & Logistique en Chine',
      desc: "Optimisez votre chaîne d'approvisionnement en Chine avec Heaven Born & DDNZ. Services d'approvisionnement, fret maritime/aérien et logistique globale à Guangzhou.",
      keywords: 'Heaven Born International Freight, DDNZ Global Trade, Transitaire maritime Chine, Fret aérien direct, Commissionnaire de transport Guangzhou, Logistique Chine Europe',
    },
    ru: {
      title: 'DDNZ & Heaven Born | Доставка грузов из Китая',
      desc: 'Оптимизируйте ваши поставки из Китая с Heaven Born и DDNZ. Профессиональный поиск поставщиков, морские/авиаперевозки и сборные грузы из Гуанчжоу.',
      keywords: 'Heaven Born International Freight, DDNZ Global Trade, Доставка грузов из Китая, Карго Гуанчжоу, Морской фрахт Китай, Авиаперевозки из Китая, Экспортный логистический брокер',
    },
    es: {
      title: 'Heaven Born | Transporte de carga desde China',
      desc: 'Heaven Born International Freight coordina transporte marítimo, aéreo, Amazon FBA y consolidación desde China para importadores internacionales.',
      keywords: 'transitario China, carga desde China, flete marítimo China, flete aéreo China, consolidación de carga, logística internacional',
    },
    ar: {
      title: 'Heaven Born | الشحن والخدمات اللوجستية من الصين',
      desc: 'تنسق Heaven Born International Freight الشحن البحري والجوي وتجميع البضائع من الصين للمستوردين الدوليين.',
      keywords: 'شحن من الصين, وكيل شحن الصين, شحن بحري من الصين, شحن جوي من الصين, تجميع البضائع, خدمات لوجستية دولية',
    }
  };

  const currentLang = language || 'en';
  const defaults = seoDefaults[currentLang] || seoDefaults['en'];

  // Resolve final SEO fields
  const finalTitle = title || defaults.title;
  const finalRawDesc = description || defaults.desc;
  
  // Truncate description dynamically to ideal SEO length (110 - 145 chars for non-Chinese, 50 - 75 for Chinese) to satisfy Bing and Google limits
  const optimizeDesc = (desc: string, lang: string) => {
    const cleanDesc = desc.trim();
    if (lang === 'zh') {
      if (cleanDesc.length > 75) {
        return cleanDesc.slice(0, 72) + '...';
      }
    } else {
      if (cleanDesc.length > 145) {
        return cleanDesc.slice(0, 142) + '...';
      }
    }
    return cleanDesc;
  };

  const finalDesc = optimizeDesc(finalRawDesc, currentLang);
  const finalKeywords = keywords || defaults.keywords;

  // Resolve language-agnostic clean path suffix
  let cleanSuffix = location.pathname;
  if (cleanSuffix.startsWith('/')) {
    cleanSuffix = cleanSuffix.substring(1);
  }
  const langPrefixes = ['zh-cn', 'ru', 'fr', 'es', 'ar'];
  for (const prefix of langPrefixes) {
    if (cleanSuffix === prefix) {
      cleanSuffix = '';
      break;
    }
    if (cleanSuffix.startsWith(prefix + '/')) {
      cleanSuffix = cleanSuffix.substring(prefix.length + 1);
      break;
    }
  }

  // Remove any trailing slashes for consistency
  if (cleanSuffix.endsWith('/')) {
    cleanSuffix = cleanSuffix.substring(0, cleanSuffix.length - 1);
  }

  // Calculate language-specific absolute URLs
  const getLanguageUrl = (langCode: string) => {
    const baseUrl = 'https://www.ddnzglobal.com';
    const pathPrefix = langCode === 'zh' ? 'zh-cn' : langCode;
    const country = new URLSearchParams(location.search).get('country');
    const countryPath = country && cleanSuffix.startsWith('shipping-from-china-to-')
      ? `shipping-from-china-to-${country.toLowerCase()}`
      : cleanSuffix;
    if (!cleanSuffix) {
      return langCode === 'en' ? `${baseUrl}/` : `${baseUrl}/${pathPrefix}`;
    }
    return langCode === 'en'
      ? `${baseUrl}/${countryPath}`
      : `${baseUrl}/${pathPrefix}/${countryPath}`;
  };

  const canonicalUrl = canonicalPath 
    ? (canonicalPath.startsWith('http') ? canonicalPath : `https://www.ddnzglobal.com${canonicalPath}`)
    : getLanguageUrl(currentLang === 'zh' ? 'zh-cn' : currentLang);

  const defaultAlternates = [
    { hrefLang: 'en', href: getLanguageUrl('en') },
    { hrefLang: 'zh-cn', href: getLanguageUrl('zh') },
    { hrefLang: 'ru', href: getLanguageUrl('ru') },
    { hrefLang: 'fr', href: getLanguageUrl('fr') },
    { hrefLang: 'es', href: getLanguageUrl('es') },
    { hrefLang: 'ar', href: getLanguageUrl('ar') },
  ];
  const finalAlternates = alternateUrls || defaultAlternates;
  const defaultAlternate = finalAlternates.find((item) => item.hrefLang === 'en') || finalAlternates[0];

  const helmetLang = currentLang === 'zh' ? 'zh-CN' : currentLang;

  return (
    <>
      <Helmet>
        {/* HTML Language attribute */}
        <html lang={helmetLang} />

        {/* Primary Meta Tags */}
        <title>{finalTitle}</title>
        <meta name="title" content={finalTitle} />
        <meta name="description" content={finalDesc} />
        <meta name="keywords" content={finalKeywords} />

        {/* Canonical Link */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Hreflang Alternate Links */}
        {defaultAlternate && <link rel="alternate" hrefLang="x-default" href={defaultAlternate.href} />}
        {finalAlternates.map((item) => (
          <link key={item.hrefLang} rel="alternate" hrefLang={item.hrefLang} href={item.href} />
        ))}

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={finalTitle} />
        <meta property="og:description" content={finalDesc} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={finalTitle} />
        <meta name="twitter:description" content={finalDesc} />
      </Helmet>
    </>
  );
}
