import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GetAQuote from '../components/GetAQuote';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import TradeSupportInquiry from '../components/TradeSupportInquiry';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import ScrollToTop from '../components/ScrollToTop';
import SEO from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';

export default function GetAQuotePage() {
  const { language } = useLanguage();
  const location = useLocation();
  const leadGoal = new URLSearchParams(location.search).get('leadGoal') || 'Freight Export';
  const isTradeSupport = leadGoal === 'Product Sourcing' || leadGoal === 'Supplier Inspection & Consolidation';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const freightSeoTitle = language === 'zh'
    ? '获取专属国际货运报价与航线方案 | 华正邦泰国际货运'
    : language === 'ru'
    ? 'Получить расчет стоимости доставки и логистики | DDNZ Global'
    : language === 'fr'
    ? 'Obtenir un devis de transport gratuit et personnalisé | DDNZ Global'
    : language === 'es'
    ? 'Obtenga una cotización de flete y plan de ruta | DDNZ Global'
    : language === 'ar'
    ? 'احصل على عرض سعر للشحن وخطة المسار | DDNZ Global'
    : language === 'pt'
    ? 'Solicite uma cotação de frete e plano de rota | DDNZ Global'
    : language === 'tr'
    ? 'Navlun teklifi ve rota planı alın | DDNZ Global'
    : 'Get a Freight Quote & Route Plan | DDNZ Global';

  const freightSeoDesc = language === 'zh'
    ? '立即提交您的货物尺寸和目的地，华正邦泰资深供应链专家将在 24 小时内为您精算多套最优国际货运与双清包税报价方案。'
    : language === 'ru'
    ? 'Заполните форму, и наши специалисты подготовят расчет стоимости доставки груза из Китая в течение 24 часов.'
    : language === 'fr'
    ? 'Saisissez les détails de votre cargaison pour recevoir une proposition tarifaire optimisée sous 24 heures.'
    : language === 'es'
    ? 'Indique los detalles de su carga para recibir una cotización de flete y una propuesta de ruta personalizada en 24 horas.'
    : language === 'ar'
    ? 'أدخل تفاصيل شحنتكم للحصول على عرض سعر وخطة مسار مخصصة خلال 24 ساعة.'
    : language === 'pt'
    ? 'Informe os detalhes da carga para receber uma cotação e um plano de rota personalizado em até 24 horas.'
    : language === 'tr'
    ? '24 saat içinde kişiselleştirilmiş navlun teklifi ve rota planı almak için yük bilgilerinizi girin.'
    : 'Get an instant, customized shipping quote and route analysis. Our senior logistics specialists will build your custom logistics plan within 24h.';

  const tradeSeo = {
    en: { title: leadGoal === 'Product Sourcing' ? 'China Product Sourcing Brief | DDNZ Global' : 'China Inspection & Consolidation Brief | DDNZ Global', description: 'Send a focused China sourcing, inspection or consolidation brief to DDNZ Global. A Guangzhou-based team will review your product, supplier and export scope.' },
    zh: { title: leadGoal === 'Product Sourcing' ? '提交中国采购需求 | DDNZ Global' : '提交验货与集货需求 | DDNZ Global', description: '向 DDNZ Global 提交中国采购、验货或集货需求，由广州团队审核产品、供应商和出口范围。' },
    ru: { title: 'Заявка на закупку и инспекцию в Китае | DDNZ Global', description: 'Отправьте заявку на поиск поставщиков, инспекцию или консолидацию в Китае.' },
    fr: { title: 'Brief sourcing, inspection et consolidation en Chine | DDNZ Global', description: 'Envoyez votre besoin de sourcing, inspection ou consolidation à notre équipe de Guangzhou.' },
    es: { title: 'Solicitud de compra, inspección y consolidación en China | DDNZ Global', description: 'Envíe su solicitud de compra, inspección o consolidación al equipo de DDNZ Global en Guangzhou.' },
    ar: { title: 'طلب التوريد والفحص والتجميع في الصين | DDNZ Global', description: 'أرسل طلب التوريد أو الفحص أو التجميع إلى فريق DDNZ Global في قوانغتشو.' },
    pt: { title: leadGoal === 'Product Sourcing' ? 'Briefing de sourcing na China | DDNZ Global' : 'Briefing de inspeção e consolidação na China | DDNZ Global', description: 'Envie seu briefing de sourcing, inspeção ou consolidação para a equipe da DDNZ Global em Guangzhou.' },
    tr: { title: leadGoal === 'Product Sourcing' ? 'Çin ürün tedarik özeti | DDNZ Global' : 'Çin denetim ve konsolidasyon özeti | DDNZ Global', description: 'Tedarik, denetim veya konsolidasyon özetinizi Guangzhou’daki DDNZ Global ekibine gönderin.' },
  }[language];

  return (
    <div className={`${isTradeSupport ? 'bg-[#fffdf9]' : 'bg-slate-50'} ddnz-home min-h-screen overflow-x-hidden font-sans text-slate-900`}>
      <SEO
        title={isTradeSupport ? tradeSeo.title : freightSeoTitle}
        description={isTradeSupport ? tradeSeo.description : freightSeoDesc}
        canonicalPath={location.pathname}
      />
      <SourcingHomepageNav showFreightExecutor={!isTradeSupport} />
      <main>
        {isTradeSupport ? <TradeSupportInquiry /> : <GetAQuote />}
      </main>
      <Footer />
      {!isTradeSupport ? <WhatsAppFloat /> : null}
      {!isTradeSupport ? <ScrollToTop /> : null}
    </div>
  );
}
