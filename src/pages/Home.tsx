import { lazy, Suspense } from 'react';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import SourcingHomepageHero from '../components/SourcingHomepageHero';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/SchemaMarkup';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedHomeFaqs, type HomeFaqLanguage } from '../data/homeFaqData';
import type { Language } from '../i18n/translations';

const Insights = lazy(() => import('../components/Insights'));
const Partners = lazy(() => import('../components/Partners'));
const Footer = lazy(() => import('../components/Footer'));
const HomeV2Preview = lazy(() => import('./HomeV2Preview'));

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
  const schemaFaqLanguage: HomeFaqLanguage = language === 'pt' || language === 'tr' ? 'en' : language;
  const metadata = {
    en: {
      title: 'DDNZ Global | China Sourcing, Quality Control & Export Delivery',
      description: 'Source commercial kitchen equipment, audio, mobile accessories and outdoor products from China with supplier verification, QC, consolidation and export delivery.',
      keywords: 'China sourcing agent, China procurement company, supplier inspection China, cargo consolidation China, commercial kitchen equipment sourcing, speaker sourcing China, mobile accessories sourcing, outdoor products sourcing China',
    },
    zh: {
      title: 'DDNZ Global 大递诺展 | 中国采购、验货、集货与出口交付',
      description: '为中东、非洲和中南美进口商提供商用餐厨设备、音响、手机配件和户外用品的一站式中国采购、验货、集货与出口服务。',
      keywords: '中国采购代理, 广州采购公司, 供应商验货, 集货出口, 商用餐厨设备采购, 音响采购, 手机配件采购, 户外用品采购',
    },
    ru: { title: 'DDNZ Global | Закупки, контроль качества и экспорт из Китая', description: 'Поиск поставщиков, инспекция, консолидация и экспорт кухонного оборудования, аудио, мобильных аксессуаров и товаров для отдыха из Китая.', keywords: 'закупки в Китае, поиск поставщиков Китай, инспекция товара, консолидация грузов, товары для отдыха из Китая' },
    fr: { title: 'DDNZ Global | Achats, contrôle qualité et export depuis la Chine', description: 'Sourcing, inspection, consolidation et export d’équipements de cuisine, audio, accessoires mobiles et produits de plein air depuis la Chine.', keywords: 'agent sourcing Chine, inspection fournisseur Chine, consolidation marchandises Chine, sourcing produits de plein air Chine' },
    es: { title: 'DDNZ Global | Compras, control de calidad y exportación desde China', description: 'Búsqueda, inspección, consolidación y exportación desde China de cocina comercial, audio, accesorios móviles y productos para actividades al aire libre.', keywords: 'agente de compras China, inspección de proveedores, consolidación de carga China, productos para actividades al aire libre China' },
    ar: { title: 'DDNZ Global | التوريد وفحص الجودة والتصدير من الصين', description: 'توريد وفحص وتجميع وتصدير معدات المطابخ والصوت وملحقات الهاتف ومستلزمات الأنشطة الخارجية من الصين.', keywords: 'وكيل توريد الصين, فحص الموردين, تجميع البضائع من الصين, توريد مستلزمات الأنشطة الخارجية' },
    pt: { title: 'DDNZ Global | Sourcing, inspeção e exportação da China', description: 'Encontre fornecedores, inspecione, consolide e exporte equipamentos para cozinha, áudio, acessórios móveis e produtos outdoor da China.', keywords: 'agente de sourcing China, compras na China, inspeção de fornecedor, consolidação de carga, exportação da China' },
    tr: { title: 'DDNZ Global | Çin’den tedarik, kalite kontrol ve ihracat', description: 'Çin’den endüstriyel mutfak, ses, mobil aksesuar ve outdoor ürünleri için tedarikçi arama, denetim, konsolidasyon ve ihracat.', keywords: 'Çin tedarik firması, Çin tedarikçi bulma, ürün denetimi, yük konsolidasyonu, Çin ihracat' },
  }[language];

  return (
    <div className="ddnz-home min-h-screen overflow-x-hidden bg-[#fffefb] font-sans text-slate-900">
      <SEO title={metadata.title} description={metadata.description} keywords={metadata.keywords} image="/images/operations/pexels-jakarta-warehouse-loading-ddnz-vest-v2.webp" />
      <SchemaMarkup type="Organization" data={{}} />
      <SchemaMarkup type="LocalBusiness" data={{}} />
      <SchemaMarkup
        type="FAQPage"
        data={{
          url: `https://www.ddnzglobal.com${window.location.pathname}`,
          faqs: getLocalizedHomeFaqs(schemaFaqLanguage),
        }}
      />
      <SourcingHomepageNav />
      <main>
        <SourcingHomepageHero />
        <Suspense fallback={<HomeSectionFallback language={language} />}>
          <HomeV2Preview
            embedded
            beforeFinal={(
              <>
              <Insights />
              <Partners />
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
