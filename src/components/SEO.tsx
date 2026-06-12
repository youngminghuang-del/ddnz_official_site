import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
}

export default function SEO({ title, description, keywords, canonicalPath }: SEOProps) {
  const { language } = useLanguage();

  useEffect(() => {
    // 1. Define localized metadata dictionaries incorporating dual branding and targeted SEO keywords
    const seoDefaults: Record<string, { title: string; desc: string; keywords: string }> = {
      en: {
        title: 'DDNZ Global & Heaven Born International Freight | China Sourcing & Cargo Logistics',
        desc: 'Optimize your China supply chain with Heaven Born International Freight and DDNZ Supply Chain. Offering professional China sourcing, sea freight forwarding, air cargo logistics, and FBA warehouse services from Guangzhou.',
        keywords: 'Heaven Born International Freight, DDNZ Supply Chain, China Cargo Agent, Guangzhou Freight Forwarder, Sea Freight From China, Air Cargo, Amazon FBA Logistics, China Sourcing Agent',
      },
      zh: {
        title: '华正邦泰国际物流 | DDNZ 供应链 | 广州靠谱实力出口货运代理与国际海运空运',
        desc: '广州靠谱实力出口货运代理，华正邦泰国际物流联合 DDNZ 供应链为您提供专业的中国商品采购代理、广州货代、集装箱海运（拼箱/整柜）、航空高特空运、亚马逊 FBA 及全球一站式跨境物流和海外仓增值支持。',
        keywords: '广州货代, 广州靠谱货代, 实力出口货代, 华正邦泰国际物流, DDNZ供应链, 广州出口货运代理, 广州集装箱海运, 广州空运专线, 中国商品采购代理, 国际货运代理',
      },
      fr: {
        title: 'Heaven Born International Freight & DDNZ Supply Chain | Transitaire de Fret en Chine & Logistique',
        desc: 'Optimisez votre chaîne d\'approvisionnement en Chine avec Heaven Born International Freight et DDNZ Supply Chain. Services professionnels d\'approvisionnement, fret maritime, fret aérien et logistique globale à Guangzhou.',
        keywords: 'Heaven Born International Freight, DDNZ Supply Chain, Transitaire maritime Chine, Fret aérien direct, Commissionnaire de transport Guangzhou, Logistique Chine Europe',
      },
      ru: {
        title: 'Heaven Born International Freight & DDNZ Supply Chain | Международная доставка грузов из Китая',
        desc: 'Оптимизируйте ваши поставки из Китая с Heaven Born International Freight и DDNZ Supply Chain. Профессиональный поиск надежных поставщиков, недорогие морские контейнерные перевозки, авиадоставка под ключ и сборные грузы из Гуанчжоу.',
        keywords: 'Heaven Born International Freight, DDNZ Supply Chain, Доставка грузов из Китая, Карго Гуанчжоу, Морской фрахт Китай, Авиаперевозки из Китая, Экспортный логистический брокер',
      }
    };

    const currentLang = language || 'en';
    const defaults = seoDefaults[currentLang] || seoDefaults['en'];

    // 2. Resolve final SEO fields (custom props override defaults)
    const finalTitle = title || defaults.title;
    const finalDesc = description || defaults.desc;
    const finalKeywords = keywords || defaults.keywords;

    // 3. Update DOM head tags dynamically
    document.title = finalTitle;

    // Meta title tag
    let mTitle = document.querySelector('meta[name="title"]');
    if (!mTitle) {
      mTitle = document.createElement('meta');
      mTitle.setAttribute('name', 'title');
      document.head.appendChild(mTitle);
    }
    mTitle.setAttribute('content', finalTitle);

    // Meta description tag
    let mDesc = document.querySelector('meta[name="description"]');
    if (!mDesc) {
      mDesc = document.createElement('meta');
      mDesc.setAttribute('name', 'description');
      document.head.appendChild(mDesc);
    }
    mDesc.setAttribute('content', finalDesc);

    // Meta keywords tag
    let mKeys = document.querySelector('meta[name="keywords"]');
    if (!mKeys) {
      mKeys = document.createElement('meta');
      mKeys.setAttribute('name', 'keywords');
      document.head.appendChild(mKeys);
    }
    mKeys.setAttribute('content', finalKeywords);

    // Open Graph / Twitter title and description sync
    const syncOgMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(property.startsWith('og:') ? 'property' : 'name', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    syncOgMeta('og:title', finalTitle);
    syncOgMeta('og:description', finalDesc);
    syncOgMeta('twitter:title', finalTitle);
    syncOgMeta('twitter:description', finalDesc);

    // Set canonical link
    let cLink = document.querySelector('link[rel="canonical"]');
    if (!cLink) {
      cLink = document.createElement('link');
      cLink.setAttribute('rel', 'canonical');
      document.head.appendChild(cLink);
    }
    
    // Resolve dynamic path matching the active routing setup
    const pathCode = canonicalPath !== undefined 
      ? canonicalPath 
      : (currentLang === 'en' ? '' : `/${currentLang === 'zh' ? 'zh-cn' : currentLang}`);
    const resolvedCanonical = `https://www.ddnzglobal.com${pathCode}`;
    cLink.setAttribute('href', resolvedCanonical);

    // Update alternate link tags for hreflang
    const oldHreflangs = document.querySelectorAll('link[rel="alternate"][hreflang]');
    oldHreflangs.forEach(el => el.remove());

    const langMap = [
      { code: 'en', pathCode: '' },
      { code: 'zh-cn', pathCode: '/zh-cn' },
      { code: 'ru', pathCode: '/ru' },
      { code: 'fr', pathCode: '/fr' }
    ];

    langMap.forEach(({ code, pathCode }) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', code);
      link.setAttribute('href', `https://www.ddnzglobal.com${pathCode}`);
      document.head.appendChild(link);
    });

    // Add x-default hreflang
    const defLink = document.createElement('link');
    defLink.setAttribute('rel', 'alternate');
    defLink.setAttribute('hreflang', 'x-default');
    defLink.setAttribute('href', 'https://www.ddnzglobal.com/');
    document.head.appendChild(defLink);

    // Update <html lang="..."> attribute for crawler language awareness
    const htmlTag = document.documentElement;
    if (htmlTag) {
      htmlTag.setAttribute('lang', currentLang === 'zh' ? 'zh-CN' : currentLang);
    }

  }, [title, description, keywords, canonicalPath, language]);

  return null;
}
