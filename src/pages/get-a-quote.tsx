import {supplyPositioning} from '../features/product-positioning/ProductSupply';
import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GetAQuote from '../components/GetAQuote';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import TradeSupportInquiry from '../components/TradeSupportInquiry';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import SEO from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';

import { inquiryPageSchema, replaceInquirySchema } from '../features/inquiry/schema.mjs';
import IntentChoice, { intentCopy } from '../features/inquiry/IntentChoice';
import { inquiryIntent } from '../features/inquiry/intent.mjs';
import { saveQuoteContext, clearQuoteContext, quoteParamsForLocation } from '../lib/quoteLinkPolicy.mjs';

export default function GetAQuotePage() {
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useMemo(() => quoteParamsForLocation(location.search, location.pathname), [location.search, location.pathname, location.key]);
  const leadGoal = inquiryIntent(params);
  const chooseIntent = (goal: string) => {
    saveQuoteContext(location.pathname, { ...Object.fromEntries(params), leadGoal: goal, source: params.get('source') || 'quote_page' });
    navigate(location.pathname, { replace: true });
  };
  const resetIntent = () => { clearQuoteContext(location.pathname); navigate(location.pathname, { replace: true }); };
  const isTradeSupport = leadGoal === 'Product Sourcing' || leadGoal === 'Supplier Inspection & Consolidation';

  useEffect(() => replaceInquirySchema(document, inquiryPageSchema(language, leadGoal)), [language, leadGoal, location.key]);

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

  const freightSeoDesc = {
    en: 'Share your cargo details and destination for a freight estimate and route review. Our team will confirm the required information and service scope with you.',
    zh: '提交货物情况与目的地，申请国际货运估价与路线评估。团队将与您确认所需资料及服务范围。',
    ru: 'Укажите данные груза и пункт назначения для оценки стоимости перевозки и маршрута. Команда уточнит необходимые сведения и объем услуг.',
    fr: 'Indiquez votre cargaison et sa destination pour une estimation du transport et une étude du trajet. Notre équipe confirmera les informations et services nécessaires.',
    es: 'Indique su carga y destino para solicitar una estimación de flete y una revisión de ruta. Nuestro equipo confirmará la información y los servicios necesarios.',
    ar: 'أرسل تفاصيل الشحنة والوجهة لطلب تقدير تكلفة الشحن ومراجعة المسار. سيؤكد فريقنا المعلومات المطلوبة ونطاق الخدمات معكم.',
    pt: 'Informe a carga e o destino para solicitar uma estimativa de frete e uma análise da rota. Nossa equipe confirmará os dados necessários e o escopo do serviço.',
    tr: 'Navlun tahmini ve rota değerlendirmesi için yük ve varış bilgilerini paylaşın. Ekibimiz gerekli bilgileri ve hizmet kapsamını sizinle doğrulayacaktır.',
  }[language];

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

  if(leadGoal==='Product Sourcing')Object.assign(tradeSeo,{title:supplyPositioning[language].primary+' | DDNZ Global',description:supplyPositioning[language].description});

  return (
    <div className={`${isTradeSupport ? 'bg-[#fffdf9]' : 'bg-slate-50'} ddnz-home min-h-screen overflow-x-hidden font-sans text-slate-900`}>
      <SEO
        title={!leadGoal ? `${intentCopy[language][0]} | DDNZ Global` : isTradeSupport ? tradeSeo.title : freightSeoTitle}
        description={!leadGoal ? intentCopy[language][1] : isTradeSupport ? tradeSeo.description : freightSeoDesc}
        canonicalPath={location.pathname}
      />
      <SourcingHomepageNav showFreightExecutor={!!leadGoal && !isTradeSupport} />
      <main>
        {leadGoal ? <>
          <div className="relative z-10 border-b border-slate-200 px-5 py-3"><button type="button" onClick={resetIntent} className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-purple-800 underline shadow-sm">{intentCopy[language][8]}</button></div>
          {isTradeSupport ? <TradeSupportInquiry key={leadGoal + location.key} /> : <GetAQuote key={leadGoal + location.key} />}
        </> : <IntentChoice onChoose={chooseIntent} />}
      </main>
      <Footer />

      {!isTradeSupport ? <ScrollToTop /> : null}
    </div>
  );
}
