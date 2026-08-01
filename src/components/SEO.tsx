import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  alternateUrls?: Array<{ hrefLang: string; href: string }>;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

export default function SEO({
  title,
  description,
  keywords,
  canonicalPath,
  alternateUrls,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
}: SEOProps) {
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
  
  // Keep the summary concise without cutting a word in half. Search engines
  // may rewrite snippets, but this gives them a complete default description.
  const optimizeDesc = (desc: string, lang: string) => {
    const cleanDesc = desc.trim();
    const maxLength = lang === 'zh' ? 78 : 155;
    if (cleanDesc.length <= maxLength) return cleanDesc;
    const candidate = cleanDesc.slice(0, maxLength - 1);
    const lastSpace = candidate.lastIndexOf(' ');
    const completeText = lastSpace > maxLength * 0.72 ? candidate.slice(0, lastSpace) : candidate;
    return `${completeText.trim()}…`;
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
  const alternateSignature = JSON.stringify(finalAlternates);

  useEffect(() => {
    const replaceMeta = (
      attribute: 'name' | 'property',
      key: string,
      content: string,
    ) => {
      document.head
        .querySelectorAll(`meta[${attribute}="${key}"]`)
        .forEach((element) => element.remove());
      const meta = document.createElement('meta');
      meta.setAttribute(attribute, key);
      meta.content = content;
      document.head.appendChild(meta);
    };
    const removeMeta = (attribute: 'name' | 'property', key: string) => {
      document.head
        .querySelectorAll(`meta[${attribute}="${key}"]`)
        .forEach((element) => element.remove());
    };

    document.documentElement.lang = helmetLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.title = finalTitle;

    replaceMeta('name', 'title', finalTitle);
    replaceMeta('name', 'description', finalDesc);
    replaceMeta('name', 'keywords', finalKeywords);
    replaceMeta('name', 'robots', 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
    replaceMeta('property', 'og:type', type);
    replaceMeta('property', 'og:url', canonicalUrl);
    replaceMeta('property', 'og:title', finalTitle);
    replaceMeta('property', 'og:description', finalDesc);
    replaceMeta('name', 'twitter:card', 'summary_large_image');
    replaceMeta('name', 'twitter:url', canonicalUrl);
    replaceMeta('name', 'twitter:title', finalTitle);
    replaceMeta('name', 'twitter:description', finalDesc);
    if (image) {
      const absoluteImage = image.startsWith('http')
        ? image
        : `https://www.ddnzglobal.com${image.startsWith('/') ? image : `/${image}`}`;
      replaceMeta('property', 'og:image', absoluteImage);
      replaceMeta('name', 'twitter:image', absoluteImage);
    } else {
      removeMeta('property', 'og:image');
      removeMeta('name', 'twitter:image');
    }
    if (type === 'article' && publishedTime) {
      replaceMeta('property', 'article:published_time', publishedTime);
    } else {
      removeMeta('property', 'article:published_time');
    }
    if (type === 'article' && modifiedTime) {
      replaceMeta('property', 'article:modified_time', modifiedTime);
    } else {
      removeMeta('property', 'article:modified_time');
    }

    document.head
      .querySelectorAll('link[rel="canonical"]')
      .forEach((element) => element.remove());
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = canonicalUrl;
    document.head.appendChild(canonical);

    document.head
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((element) => element.remove());

    const appendAlternate = (hrefLang: string, href: string) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = hrefLang;
      link.href = href;
      document.head.appendChild(link);
    };

    if (defaultAlternate) {
      appendAlternate('x-default', defaultAlternate.href);
    }
    finalAlternates.forEach((item) => appendAlternate(item.hrefLang, item.href));
  }, [
    alternateSignature,
    canonicalUrl,
    currentLang,
    finalDesc,
    finalKeywords,
    finalTitle,
    helmetLang,
    image,
    modifiedTime,
    publishedTime,
    type,
  ]);

  return null;
}
