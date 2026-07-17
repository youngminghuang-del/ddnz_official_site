import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
}

export default function SEO({ title, description, keywords, canonicalPath }: SEOProps) {
  const { language } = useLanguage();
  const location = useLocation();

  // 1. Define localized metadata dictionaries incorporating dual branding and targeted SEO keywords
  const seoDefaults: Record<string, { title: string; desc: string; keywords: string }> = {
    en: {
      title: 'DDNZ & Heaven Born Freight | China Sourcing & Logistics',
      desc: 'Optimize your China supply chain with Heaven Born Freight and DDNZ. Professional sourcing, sea/air freight forwarding, and FBA warehouse services from Guangzhou.',
      keywords: 'Heaven Born International Freight, DDNZ Supply Chain, China Cargo Agent, Guangzhou Freight Forwarder, Sea Freight From China, Air Cargo, Amazon FBA Logistics, China Sourcing Agent',
    },
    zh: {
      title: '华正邦泰国际物流 | DDNZ 供应链 | 广州靠谱实力货运代理与国际海运空运',
      desc: '广州靠谱实力出口货代，华正邦泰与 DDNZ 供应链为您提供专业的中国采购代理、集装箱海运（拼箱/整柜）、航空高特空运、亚马逊 FBA 等一站式跨境物流服务。',
      keywords: '广州货代, 广州靠谱货代, 实力出口货代, 华正邦泰国际物流, DDNZ供应链, 广州出口货运代理, 广州集装箱海运, 广州空运专线, 中国商品采购代理, 国际货运代理',
    },
    fr: {
      title: 'DDNZ & Heaven Born | Transitaire & Logistique en Chine',
      desc: "Optimisez votre chaîne d'approvisionnement en Chine avec Heaven Born & DDNZ. Services d'approvisionnement, fret maritime/aérien et logistique globale à Guangzhou.",
      keywords: 'Heaven Born International Freight, DDNZ Supply Chain, Transitaire maritime Chine, Fret aérien direct, Commissionnaire de transport Guangzhou, Logistique Chine Europe',
    },
    ru: {
      title: 'DDNZ & Heaven Born | Доставка грузов из Китая',
      desc: 'Оптимизируйте ваши поставки из Китая с Heaven Born и DDNZ. Профессиональный поиск поставщиков, морские/авиаперевозки и сборные грузы из Гуанчжоу.',
      keywords: 'Heaven Born International Freight, DDNZ Supply Chain, Доставка грузов из Китая, Карго Гуанчжоу, Морской фрахт Китай, Авиаперевозки из Китая, Экспортный логистический брокер',
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
  const langPrefixes = ['zh-cn', 'ru', 'fr'];
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
    if (!cleanSuffix) {
      return langCode === 'en' ? `${baseUrl}/` : `${baseUrl}/${langCode}`;
    }
    return langCode === 'en' ? `${baseUrl}/${cleanSuffix}` : `${baseUrl}/${langCode}/${cleanSuffix}`;
  };

  const canonicalUrl = canonicalPath 
    ? (canonicalPath.startsWith('http') ? canonicalPath : `https://www.ddnzglobal.com${canonicalPath}`)
    : getLanguageUrl(currentLang === 'zh' ? 'zh-cn' : currentLang);

  const enUrl = getLanguageUrl('en');
  const zhUrl = getLanguageUrl('zh-cn');
  const ruUrl = getLanguageUrl('ru');
  const frUrl = getLanguageUrl('fr');

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
        <link rel="alternate" hrefLang="x-default" href={enUrl} />
        <link rel="alternate" hrefLang="en" href={enUrl} />
        <link rel="alternate" hrefLang="zh-cn" href={zhUrl} />
        <link rel="alternate" hrefLang="ru" href={ruUrl} />
        <link rel="alternate" hrefLang="fr" href={frUrl} />

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
      {/* Hidden H1 for search crawler SEO mapping without visual layout distortion */}
      <h1 style={{ display: 'none' }}>{finalTitle}</h1>
    </>
  );
}
