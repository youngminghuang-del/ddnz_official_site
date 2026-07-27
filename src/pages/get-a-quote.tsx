import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GetAQuote from '../components/GetAQuote';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import ScrollToTop from '../components/ScrollToTop';
import SEO from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';

export default function GetAQuotePage() {
  const { language } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const seoTitle = language === 'zh' 
    ? '获取专属国际货运报价与航线方案 | 华正邦泰国际货运'
    : language === 'ru'
    ? 'Получить расчет стоимости доставки и логистики | Heaven Born'
    : language === 'fr'
    ? 'Obtenir un devis de transport gratuit et personnalisé | Heaven Born'
    : language === 'es'
    ? 'Obtenga una cotización de flete y plan de ruta | Heaven Born'
    : language === 'ar'
    ? 'احصل على عرض سعر للشحن وخطة المسار | Heaven Born'
    : 'Get a Freight Quote & Route Plan | Heaven Born';

  const seoDesc = language === 'zh'
    ? '立即提交您的货物尺寸和目的地，华正邦泰资深供应链专家将在 24 小时内为您精算多套最优国际货运与双清包税报价方案。'
    : language === 'ru'
    ? 'Заполните форму, и наши специалисты подготовят расчет стоимости доставки груза из Китая в течение 24 часов.'
    : language === 'fr'
    ? 'Saisissez les détails de votre cargaison pour recevoir une proposition tarifaire optimisée sous 24 heures.'
    : language === 'es'
    ? 'Indique los detalles de su carga para recibir una cotización de flete y una propuesta de ruta personalizada en 24 horas.'
    : language === 'ar'
    ? 'أدخل تفاصيل شحنتكم للحصول على عرض سعر وخطة مسار مخصصة خلال 24 ساعة.'
    : 'Get an instant, customized shipping quote and route analysis. Our senior logistics specialists will build your custom logistics plan within 24h.';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      <SEO title={seoTitle} description={seoDesc} />
      <Navbar />
      <main className="pt-20 md:pt-24">
        <GetAQuote />
      </main>
      <Footer />
      <WhatsAppFloat />
      <ScrollToTop />
    </div>
  );
}
