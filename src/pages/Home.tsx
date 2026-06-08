import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WhoWeAre from '../components/WhoWeAre';
import WhatWeDo from '../components/WhatWeDo';
import CompetitiveEdge from '../components/CompetitiveEdge';
import Partners from '../components/Partners';
import GetAQuote from '../components/GetAQuote';
import Insights from '../components/Insights';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import ScrollToTop from '../components/ScrollToTop';
import CookieConsent from '../components/CookieConsent';
import { useLanguage } from '../contexts/LanguageContext';
import SchemaMarkup from '../components/SchemaMarkup';

export default function Home() {
  const { language } = useLanguage();

  useEffect(() => {
    // Dictionary of SEO and GEO configurations tailored to user targets
    const seoConfig: Record<string, { title: string; desc: string; keywords: string }> = {
      en: {
        title: 'DDNZ Global | Premium China Freight Forwarder & Supply Chain Logistics',
        desc: 'Expert freight forwarding from China. Offering cheap sea freight, high-speed air cargo, professional Amazon FBA prep, and secure warehousing services.',
        keywords: 'china cargo agent, top freight forwarder china, ddnz global, logistics supply chain, cheap sea freight from china, LCL consolidation container'
      },
      zh: {
        title: '华正邦泰国际货运 (DDNZ Global) | 专注中国中欧、美、俄、法跨境货代与国际供应链仓配',
        desc: '华正邦泰国际货运（DDNZ Global）专注于全球一站式跨境多式海运拼箱整柜、特需空运包机、海外Amazon FBA贴标一件代发及广州大仓储理运，安全高效。',
        keywords: '广州海运拼箱货代, 深圳精密空运货运, 亚马逊FBA拼箱DDP, 跨境集运转包托盘, 华正邦泰国际货运, 华正邦泰'
      },
      ru: {
        title: 'DDNZ Global | Премиум грузоперевозки и логистика из Китая под ключ',
        desc: 'Надежный логистический партнер из Китая. Морской фрахт, экспресс авиаперевозки, профессиональный Amazon FBA Prep склад и ответственное хранение в Гуанчжоу.',
        keywords: 'доставка грузов из Китая, карго Гуанчжоу Шэньчжэнь, дешевый морской фрахт Китай, авиадоставка под ключ, склад консолидации'
      },
      fr: {
        title: 'DDNZ Global | Transitaire Premium Chine Coopération Logistique',
        desc: 'VOTRE expert de transit depuis la Chine. Fret maritime pas cher, fret aérien rapide de Shenzhen, préparation Amazon FBA professionnelle et entreposage hautement sécurisé.',
        keywords: 'commissionnaire de transport chine, fret maritime direct chine, expediteur fba amazon, logistique transit express guangzhou, ddnz global'
      }
    };

    const currentSEO = seoConfig[language] || seoConfig['en'];
    
    // Set Document Title
    document.title = currentSEO.title;

    // Set Meta Description
    let mDesc = document.querySelector('meta[name="description"]');
    if (!mDesc) {
      mDesc = document.createElement('meta');
      mDesc.setAttribute('name', 'description');
      document.head.appendChild(mDesc);
    }
    mDesc.setAttribute('content', currentSEO.desc);

    // Set Meta Keywords
    let mKeys = document.querySelector('meta[name="keywords"]');
    if (!mKeys) {
      mKeys = document.createElement('meta');
      mKeys.setAttribute('name', 'keywords');
      document.head.appendChild(mKeys);
    }
    mKeys.setAttribute('content', currentSEO.keywords);

    // Set Canonical Alternate link to avoid duplicate content penalty in search index
    let cLink = document.querySelector('link[rel="canonical"]');
    if (!cLink) {
      cLink = document.createElement('link');
      cLink.setAttribute('rel', 'canonical');
      document.head.appendChild(cLink);
    }
    const currentPathCode = language === 'en' ? '' : `/${language === 'zh' ? 'zh-cn' : language}`;
    cLink.setAttribute('href', `https://www.ddnzglobal.com${currentPathCode}`);

    // Manage link hreflangs
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

  }, [language]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <SchemaMarkup type="Organization" data={{}} />
      <SchemaMarkup type="LocalBusiness" data={{}} />
      <Navbar />
      <main>
        <Hero />
        <WhoWeAre />
        <WhatWeDo />
        <CompetitiveEdge />
        <Partners />
        <GetAQuote />
        <Insights />
      </main>
      <Footer />
      <WhatsAppFloat />
      <ScrollToTop />
      <CookieConsent />
    </div>
  );
}
