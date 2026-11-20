import { buildQuoteHref } from '../../lib/quoteLinks';
import { quoteLinkProps } from '../../lib/quoteLinkPolicy.mjs';

export const cairoArticleSlug = 'cairo-mobile-accessories-wholesale-attaba-china';

export default function CairoBuyingLinks() {
  return (
    <section id="cairo-product-selection" className="article-reading-discovery article-reading-buying-actions scroll-mt-32" lang="ar" dir="rtl" aria-labelledby="cairo-product-selection-title">
      <h2 id="cairo-product-selection-title">جهّز قائمة أول طلب مختلط</h2>
      <p>اختر الجرابات وواقيات الشاشة حسب موديل الهاتف، وأضف الكمية المطلوبة من كل صنف إلى قائمتك. تُعرض الأسعار المرجعية باليوان الصيني، ويُؤكّد الحد الأدنى لكل صنف عند التسعير.</p>
      <a className="article-reading-action" data-article-cta="build_mixed_list" href="/ar/sourcing/mobile-accessories-from-china/#collection">كوّن قائمة شراء مختلطة</a>
      <div>
        <a data-article-cta="browse_phone_cases" href="/ar/phone-cases/">اختر جرابات الموبايل حسب الخامة والموديل</a>
        <a data-article-cta="compare_screen_protectors" href="/ar/screen-protectors/compare/">قارن واقيات الشاشة الشفافة وواقيات الخصوصية</a>
      </div>
    </section>
  );
}

export function CairoQuoteLink() {
  const href = buildQuoteHref({
    intent: 'Product Sourcing',
    language: 'ar',
    source: 'article',
    industry: 'Mobile Accessories',
    destination: 'Cairo, Egypt',
    article: cairoArticleSlug,
    attribution: {},
  });
  return (
    <div className="article-reading-buying-actions">
      <p>إذا كانت قائمتك جاهزة، أرسل موديلات الهواتف، والكمية لكل صنف، والتغليف المطلوب، ومدينة التسليم.</p>
      <a className="article-reading-action" data-article-cta="submit_existing_buying_list" {...quoteLinkProps(href)}>أرسل قائمة مشترياتك لطلب عرض سعر</a>
    </div>
  );
}
