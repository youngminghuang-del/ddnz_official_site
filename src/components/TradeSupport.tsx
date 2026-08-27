import { ArrowRight, ClipboardCheck, FileCheck2, Factory, ReceiptText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { buildQuoteHref } from '../lib/quoteLinks';
import { trackEvent } from '../lib/utils';

const copy = {
  en: {
    eyebrow: 'TRADE-SUPPORT BRAND',
    legalName: 'DDNZ Global Trade Co., Ltd.',
    title: 'More than freight: trade support from China, handled by one team.',
    body: 'When your shipment needs supplier verification, inspection, export agency support, customs declaration, or tax-refund coordination, DDNZ Global Trade Co., Ltd. works alongside Heaven Born International Freight Co., Ltd.',
    cta: 'Discuss trade support',
    items: ['Factory verification', 'Pre-shipment inspection', 'Export agency & customs', 'Tax-refund coordination'],
  },
  zh: {
    eyebrow: '贸易支持品牌',
    legalName: '大递诺展贸易有限公司',
    title: '不止货运：贸易与供应链支持，由同一团队协同处理。',
    body: '如需验厂、验货、代出口、报关或退税协助，大递诺展贸易有限公司可与华正邦泰国际货运团队协同处理。',
    cta: '咨询贸易支持',
    items: ['供应商验厂', '出货前验货', '代出口与报关', '退税协助'],
  },
  ru: {
    eyebrow: 'БРЕНД ТОРГОВОЙ ПОДДЕРЖКИ',
    legalName: 'DDNZ Global Trade Co., Ltd.',
    title: 'Больше, чем доставка: торговая поддержка из Китая одной командой.',
    body: 'DDNZ Global Trade Co., Ltd. помогает с проверкой поставщика, инспекцией, экспортным агентированием, таможенным оформлением и координацией возврата налогов.',
    cta: 'Обсудить торговую поддержку',
    items: ['Проверка фабрики', 'Предотгрузочная инспекция', 'Экспорт и таможня', 'Координация возврата налогов'],
  },
  fr: {
    eyebrow: 'MARQUE DE SOUTIEN COMMERCIAL',
    legalName: 'DDNZ Global Trade Co., Ltd.',
    title: 'Bien plus que le fret : un accompagnement commercial depuis la Chine.',
    body: 'DDNZ Global Trade Co., Ltd. travaille avec Heaven Born pour la vérification d’usine, l’inspection, l’exportation pour compte de tiers, la douane et la coordination du remboursement fiscal.',
    cta: 'Parler de votre projet',
    items: ['Audit fournisseur', 'Inspection avant expédition', 'Export & douane', 'Coordination fiscale'],
  },
  es: {
    eyebrow: 'MARCA DE APOYO COMERCIAL',
    legalName: 'DDNZ Global Trade Co., Ltd.',
    title: 'Más que flete: apoyo comercial desde China, gestionado por un solo equipo.',
    body: 'Cuando necesite verificación de proveedores, inspección, exportación por cuenta de terceros, declaración aduanera o coordinación de devolución de impuestos, DDNZ Global Trade Co., Ltd. trabaja junto con Heaven Born International Freight Co., Ltd.',
    cta: 'Consultar apoyo comercial',
    items: ['Verificación de fábrica', 'Inspección previa al envío', 'Exportación y aduana', 'Coordinación de devolución fiscal'],
  },
  ar: {
    eyebrow: 'علامة الدعم التجاري',
    legalName: 'DDNZ Global Trade Co., Ltd.',
    title: 'أكثر من الشحن: دعم تجاري من الصين يديره فريق واحد.',
    body: 'عند الحاجة إلى التحقق من المورد أو الفحص أو التصدير بالنيابة أو الإقرار الجمركي أو تنسيق استرداد الضرائب، تعمل DDNZ Global Trade Co., Ltd. جنباً إلى جنب مع Heaven Born International Freight Co., Ltd.',
    cta: 'ناقش الدعم التجاري',
    items: ['التحقق من المصنع', 'فحص ما قبل الشحن', 'التصدير والجمارك', 'تنسيق استرداد الضرائب'],
  },
};

const icons = [Factory, ClipboardCheck, FileCheck2, ReceiptText];

export default function TradeSupport() {
  const { language } = useLanguage();
  const content = copy[language as keyof typeof copy] || copy.en;
  const quoteHref = buildQuoteHref({ intent: 'Supplier Inspection & Consolidation', language, source: 'homepage_trade_support' });

  return (
    <section className="bg-[#F5F8FC] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <p className="text-[#EA6A12] font-black tracking-[0.18em] text-xs mb-2">{content.eyebrow}</p>
          <p className="mb-5 text-sm font-black text-[#0B4F8A]">{content.legalName}</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#0B1F3A] leading-tight">{content.title}</h2>
          <div className="mt-4 h-1 w-12 rounded-full bg-[var(--hb-amber)]" aria-hidden="true" />
          <p className="mt-5 text-slate-600 leading-relaxed max-w-2xl">{content.body}</p>
          <Link to={quoteHref} data-analytics-tracked="true" onClick={() => trackEvent('quote_click', { cta_location: 'homepage_trade_support', lead_goal: 'Supplier Inspection & Consolidation' })} className="inline-flex min-h-11 items-center gap-2 mt-5 rounded-xl bg-[var(--ddnz-purple-strong)] px-5 py-3 font-extrabold text-white hover:bg-[var(--ddnz-purple)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] focus-visible:ring-offset-2">
            {content.cta}<ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {content.items.map((item, index) => {
            const Icon = icons[index];
            return <div key={item} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#0B4F8A]/10 text-[#0B4F8A] grid place-items-center"><Icon className="w-5 h-5" /></div>
              <span className="font-bold text-slate-800 text-sm">{item}</span>
            </div>;
          })}
        </div>
      </div>
    </section>
  );
}
