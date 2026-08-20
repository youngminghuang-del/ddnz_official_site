import { ArrowRight, ClipboardCheck, MessageCircle, PackageSearch, Ship, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../i18n/translations';
import { buildAttributedWhatsAppUrl, readAttribution } from '../lib/attribution';
import { buildQuoteHref, type QuoteIntent } from '../lib/quoteLinks';
import { trackEvent } from '../lib/utils';

type BridgeCopy = {
  eyebrow: string;
  title: string;
  body: string;
  sourcing: string;
  sourcingDesc: string;
  existing: string;
  existingDesc: string;
  freight: string;
  freightDesc: string;
  whatsapp: string;
  privacy: string;
};

const COPY: Record<Language, BridgeCopy> = {
  en: { eyebrow: 'Choose the right next step', title: 'Start with the team that matches your order stage.', body: 'Product sourcing, existing supplier orders and freight-only requests need different information. Choose one path so the first review starts with the right questions.', sourcing: 'Start a product sourcing brief', sourcingDesc: 'Find, compare and coordinate products and suppliers in China.', existing: 'Request inspection or consolidation', existingDesc: 'Bring existing supplier orders under one China-based control team.', freight: 'Get a freight quote', freightDesc: 'Plan export routing and transport for goods that are ready to ship.', whatsapp: 'Not sure? Ask the China team on WhatsApp', privacy: 'Your information is used only to review this request.' },
  zh: { eyebrow: '选择正确的下一步', title: '根据订单阶段，进入对应团队的需求流程。', body: '产品采购、已有供应商订单和仅货运所需的信息不同。选择一种路径，让首次审核从正确的问题开始。', sourcing: '提交产品采购需求', sourcingDesc: '在中国寻找、比较并协调产品与供应商。', existing: '提交验货或集货需求', existingDesc: '由中国团队统一跟进已有供应商订单。', freight: '获取货运报价', freightDesc: '为已经备货的货物规划出口路线与运输。', whatsapp: '不确定？通过 WhatsApp 咨询中国团队', privacy: '您的资料仅用于审核本次需求。' },
  ru: { eyebrow: 'Выберите следующий шаг', title: 'Начните с команды, которая соответствует стадии заказа.', body: 'Для закупки, существующих заказов и готового груза нужны разные данные.', sourcing: 'Заявка на закупку', sourcingDesc: 'Поиск и координация товаров и поставщиков в Китае.', existing: 'Инспекция или консолидация', existingDesc: 'Контроль уже размещенных заказов одной командой в Китае.', freight: 'Рассчитать доставку', freightDesc: 'Маршрут и перевозка готового груза.', whatsapp: 'Не уверены? Напишите команде в WhatsApp', privacy: 'Данные используются только для проверки заявки.' },
  fr: { eyebrow: 'Choisissez la prochaine étape', title: 'Commencez avec l’équipe adaptée à l’avancement de votre commande.', body: 'Le sourcing, les commandes existantes et le fret seul nécessitent des informations différentes.', sourcing: 'Démarrer un brief sourcing', sourcingDesc: 'Rechercher et coordonner produits et fournisseurs en Chine.', existing: 'Inspection ou consolidation', existingDesc: 'Confier les commandes existantes à une équipe de contrôle en Chine.', freight: 'Obtenir un devis fret', freightDesc: 'Planifier l’export et le transport de marchandises prêtes.', whatsapp: 'Un doute ? Écrivez à l’équipe Chine sur WhatsApp', privacy: 'Vos données servent uniquement à analyser cette demande.' },
  es: { eyebrow: 'Elija el siguiente paso', title: 'Empiece con el equipo adecuado para la etapa de su pedido.', body: 'La compra, los pedidos existentes y el transporte requieren datos distintos.', sourcing: 'Iniciar solicitud de compra', sourcingDesc: 'Buscar y coordinar productos y proveedores en China.', existing: 'Solicitar inspección o consolidación', existingDesc: 'Controlar pedidos existentes con un solo equipo en China.', freight: 'Cotizar transporte', freightDesc: 'Planificar exportación y transporte de carga lista.', whatsapp: '¿No está seguro? Consulte al equipo por WhatsApp', privacy: 'Sus datos se usan solo para revisar esta solicitud.' },
  ar: { eyebrow: 'اختر الخطوة التالية', title: 'ابدأ مع الفريق المناسب لمرحلة طلبك.', body: 'تحتاج عمليات التوريد والطلبات القائمة والشحن فقط إلى معلومات مختلفة.', sourcing: 'ابدأ طلب التوريد', sourcingDesc: 'البحث عن المنتجات والموردين وتنسيقهم في الصين.', existing: 'اطلب الفحص أو التجميع', existingDesc: 'إدارة طلبات الموردين القائمة بواسطة فريق واحد في الصين.', freight: 'احصل على عرض شحن', freightDesc: 'تخطيط التصدير والنقل للبضائع الجاهزة.', whatsapp: 'غير متأكد؟ تواصل مع فريق الصين عبر واتساب', privacy: 'تستخدم معلوماتك فقط لمراجعة هذا الطلب.' },
};

export default function HomeConversionBridge() {
  const { language } = useLanguage();
  const copy = COPY[language];
  const attribution = readAttribution();
  const whatsappUrl = buildAttributedWhatsAppUrl('Hi DDNZ Global, I need help choosing the right sourcing, inspection or freight service.', attribution);
  const cards: Array<{ intent: QuoteIntent; label: string; description: string; Icon: typeof PackageSearch; tone: string }> = [
    { intent: 'Product Sourcing', label: copy.sourcing, description: copy.sourcingDesc, Icon: PackageSearch, tone: 'bg-[var(--ddnz-purple-strong)] hover:bg-[var(--ddnz-purple)]' },
    { intent: 'Supplier Inspection & Consolidation', label: copy.existing, description: copy.existingDesc, Icon: ClipboardCheck, tone: 'bg-[var(--ddnz-action)] hover:bg-[var(--ddnz-coral-strong)]' },
    { intent: 'Freight Export', label: copy.freight, description: copy.freightDesc, Icon: Ship, tone: 'bg-[#173252] hover:bg-[#24466d]' },
  ];

  return (
    <section id="conversion-paths" className="scroll-mt-24 bg-[#fffdf9] px-4 py-16 sm:px-6 md:py-20 lg:px-8" aria-labelledby="conversion-paths-title">
      <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ddnz-coral-strong)]">{copy.eyebrow}</p>
        <div className="mt-3 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <h2 id="conversion-paths-title" className="max-w-[18ch] text-3xl font-extrabold leading-tight tracking-[-0.035em] text-[var(--ddnz-ink)] sm:text-4xl">{copy.title}</h2>
          <p className="max-w-2xl text-base leading-7 text-slate-600">{copy.body}</p>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {cards.map(({ intent, label, description, Icon, tone }) => (
            <Link key={intent} to={buildQuoteHref({ intent, language, source: 'homepage_conversion_bridge', attribution })} data-analytics-tracked="true" onClick={() => trackEvent('quote_click', { cta_location: 'homepage_conversion_bridge', lead_goal: intent })} className={`group flex min-h-[178px] flex-col rounded-2xl p-6 text-white shadow-sm transition ${tone} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] focus-visible:ring-offset-2`}>
              <Icon className="h-7 w-7" aria-hidden="true" />
              <h3 className="mt-6 text-xl font-extrabold">{label}</h3>
              <p className="mt-2 text-sm leading-6 text-white/80">{description}</p>
              <ArrowRight className="mt-auto h-5 w-5 self-end transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 text-sm sm:flex-row sm:items-center sm:justify-between">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" data-analytics-tracked="true" onClick={() => trackEvent('whatsapp_click', { cta_location: 'homepage_conversion_bridge' })} className="inline-flex min-h-11 items-center gap-2 font-bold text-[var(--ddnz-purple-strong)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)]"><MessageCircle className="h-5 w-5 text-[#159a4a]" aria-hidden="true" />{copy.whatsapp}</a>
          <p className="flex items-center gap-2 text-xs font-semibold text-slate-500"><ShieldCheck className="h-4 w-4" aria-hidden="true" />{copy.privacy}</p>
        </div>
      </div>
    </section>
  );
}
