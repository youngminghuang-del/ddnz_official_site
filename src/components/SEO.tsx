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
      title: 'DDNZ Global | China Sourcing, Quality Control & Export Delivery',
      desc: 'Source commercial products from China with supplier verification, quality control, consolidation and export delivery.',
      keywords: 'China sourcing agent, China procurement company, supplier inspection China, cargo consolidation China',
    },
    zh: {
      title: 'DDNZ Global 大递诺展 | 中国采购、验货与出口交付',
      desc: 'DDNZ Global 为国际进口商协调中国采购、供应商核验、质量检验、集货与出口交付。',
      keywords: '中国采购代理, 广州采购公司, 供应商验货, 集货出口, 国际货运代理',
    },
    fr: {
      title: 'DDNZ Global | Sourcing, contrôle qualité et export Chine',
      desc: "DDNZ Global coordonne le sourcing, la vérification des fournisseurs, l'inspection, la consolidation et l'export depuis la Chine.",
      keywords: 'DDNZ Global, agent sourcing Chine, inspection fournisseur Chine, consolidation marchandises Chine',
    },
    ru: {
      title: 'DDNZ Global | Закупки, контроль качества и экспорт из Китая',
      desc: 'DDNZ Global координирует поиск поставщиков, инспекцию, консолидацию и экспорт коммерческих товаров из Китая.',
      keywords: 'DDNZ Global, закупки в Китае, поиск поставщиков Китай, инспекция товара, консолидация грузов',
    },
    es: {
      title: 'DDNZ Global | Compras, control de calidad y exportación desde China',
      desc: 'DDNZ Global coordina proveedores, inspección, consolidación y exportación de productos comerciales desde China.',
      keywords: 'DDNZ Global, agente de compras China, inspección de proveedores, consolidación de carga China',
    },
    ar: {
      title: 'DDNZ Global | التوريد وفحص الجودة والتصدير من الصين',
      desc: 'تنسق DDNZ Global البحث عن الموردين والفحص وتجميع البضائع وتصدير المنتجات التجارية من الصين.',
      keywords: 'DDNZ Global, وكيل توريد الصين, فحص الموردين, تجميع البضائع من الصين',
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
    const normalizedLangCode = langCode === 'zh-cn' ? 'zh' : langCode;
    const pathPrefix = normalizedLangCode === 'zh' ? 'zh-cn' : normalizedLangCode;
    const country = new URLSearchParams(location.search).get('country');
    const countryPath = country && cleanSuffix.startsWith('shipping-from-china-to-')
      ? `shipping-from-china-to-${country.toLowerCase()}`
      : cleanSuffix;
    if (!cleanSuffix) {
      return normalizedLangCode === 'en' ? `${baseUrl}/` : `${baseUrl}/${pathPrefix}`;
    }
    return normalizedLangCode === 'en'
      ? `${baseUrl}/${countryPath}`
      : `${baseUrl}/${pathPrefix}/${countryPath}`;
  };

  const canonicalUrl = canonicalPath 
    ? (canonicalPath.startsWith('http') ? canonicalPath : `https://www.ddnzglobal.com${canonicalPath}`)
    : getLanguageUrl(currentLang);

  const defaultAlternates = [
    { hrefLang: 'en', href: getLanguageUrl('en') },
    { hrefLang: 'zh-cn', href: getLanguageUrl('zh') },
    { hrefLang: 'ru', href: getLanguageUrl('ru') },
    { hrefLang: 'fr', href: getLanguageUrl('fr') },
    { hrefLang: 'es', href: getLanguageUrl('es') },
    { hrefLang: 'ar', href: getLanguageUrl('ar') },
  ];
  const finalAlternates = (alternateUrls || defaultAlternates).filter((item) => item.hrefLang !== 'x-default');
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
