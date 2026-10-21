import HomeProductFaqs from '../components/HomeProductFaqs';
import { positioning } from '../features/search-intent/positioning.mjs';
import {supplyPositioning} from '../features/product-positioning/ProductSupply';
import { lazy, Suspense } from 'react';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import SourcingHomepageHero from '../components/SourcingHomepageHero';
import HomeOneTeamBridge from '../components/HomeOneTeamBridge';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/SchemaMarkup';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedHomeFaqs } from '../data/homeFaqData';
import type { Language } from '../i18n/translations';

const Insights = lazy(() => import('../components/Insights'));
const Partners = lazy(() => import('../components/Partners'));
const Footer = lazy(() => import('../components/Footer'));
const HomeV2Preview = lazy(() => import('./HomeV2Preview'));
const FreightRouteMap = lazy(() => import('../components/FreightRouteMap'));

const loadingCopy: Record<Language, string> = {
  en: 'Loading section',
  zh: '正在加载内容',
  ru: 'Раздел загружается',
  fr: 'Chargement de la section',
  es: 'Cargando sección',
  ar: 'جارٍ تحميل القسم',
  pt: 'Carregando seção',
  tr: 'Bölüm yükleniyor',
};

function HomeSectionFallback({ language }: { language: Language }) {
  return (
    <section className="min-h-64 bg-[#F5F8FC]" aria-busy="true" aria-live="polite">
      <span className="sr-only">{loadingCopy[language]}</span>
    </section>
  );
}

export default function Home() {
  const { language } = useLanguage();


  return (
    <div className="ddnz-home min-h-screen overflow-x-hidden bg-[#fffefb] font-sans text-slate-900">
      <SEO title={positioning[language].homeTitle} description={positioning[language].homeDescription} keywords={supplyPositioning[language].title+', OEM, ODM'} image="/images/operations/ddnz-team-20260914.webp" />
      <SchemaMarkup type="Organization" data={{}} />
      <SchemaMarkup type="LocalBusiness" data={{}} />
      <SchemaMarkup
        type="FAQPage"
        data={{
          url: `https://www.ddnzglobal.com${window.location.pathname}`,
          faqs: getLocalizedHomeFaqs(language),
        }}
      />
      <SourcingHomepageNav />
      <main>
        <SourcingHomepageHero />
        <HomeOneTeamBridge />
        <Suspense fallback={<HomeSectionFallback language={language} />}>
          <FreightRouteMap variant="world" />
        </Suspense>
        <Suspense fallback={<HomeSectionFallback language={language} />}>
          <HomeV2Preview
            embedded
            beforeFinal={(
              <>
              <Insights />
              <Partners />
              <HomeProductFaqs/>
              </>
            )}
          />
        </Suspense>
      </main>
      <Suspense fallback={<HomeSectionFallback language={language} />}>
        <Footer />
      </Suspense>
    </div>
  );
}
