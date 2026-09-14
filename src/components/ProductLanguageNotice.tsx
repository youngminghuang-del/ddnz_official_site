import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../i18n/translations';
import { navigationPath } from '../lib/productLanguageRouting';

const noticeCopy: Record<Language, { title: string; body: string; help: string; home: string }> = {
  en: { title: 'Guide language: English', body: 'This product guide is available in English. Choose a navigation language and send your sourcing request in that language.', help: 'Get sourcing help', home: 'Return home' },
  zh: { title: '本产品指南正文为英文', body: '导航语言已保留。你可以返回中文首页，或使用中文提交采购需求。', help: '获取采购协助', home: '返回中文首页' },
  ru: { title: 'Руководство доступно на английском', body: 'Язык навигации сохранён. Вернитесь на русскую главную страницу или отправьте запрос на закупку на русском языке.', help: 'Помощь с закупками', home: 'На главную на русском' },
  fr: { title: 'Ce guide produit est en anglais', body: 'Votre langue de navigation est conservée. Retrouvez l’accueil en français ou envoyez votre demande d’achat en français.', help: 'Obtenir une aide pour vos achats', home: 'Accueil en français' },
  es: { title: 'Esta guía de producto está en inglés', body: 'Se conserva tu idioma de navegación. Vuelve al inicio en español o envía tu solicitud de compra en español.', help: 'Recibir ayuda con la compra', home: 'Volver al inicio en español' },
  ar: { title: 'دليل المنتج متاح باللغة الإنجليزية', body: 'تم الاحتفاظ بلغة التنقل التي اخترتها. يمكنك العودة إلى الصفحة الرئيسية بالعربية أو إرسال طلب التوريد بالعربية.', help: 'احصل على مساعدة في التوريد', home: 'العودة إلى الرئيسية بالعربية' },
  pt: { title: 'Este guia de produto está em inglês', body: 'O idioma de navegação foi mantido. Volte ao início em português ou envie sua solicitação de compra em português.', help: 'Obter ajuda com a compra', home: 'Voltar ao início em português' },
  tr: { title: 'Bu ürün rehberi İngilizcedir', body: 'Gezinme dili seçiminiz korunur. Türkçe ana sayfaya dönebilir veya tedarik talebinizi Türkçe gönderebilirsiniz.', help: 'Tedarik desteği alın', home: 'Türkçe ana sayfaya dön' },
};

/** Render outside English body wrappers. SourcingHomepageNav already includes this on product pages. */
export default function ProductLanguageNotice({ guideName }: { guideName?: string } = {}) {
  const { language } = useLanguage();
  if (language === 'en') return null;
  const copy = noticeCopy[language];
  const help = navigationPath('/get-a-quote?leadGoal=Product%20Sourcing&source=product_language_notice', language);
  return (
    <aside data-product-language-notice lang={language === 'zh' ? 'zh-CN' : language} dir={language === 'ar' ? 'rtl' : 'ltr'}
      aria-label={copy.title} className="border-b border-slate-200 bg-slate-50 text-slate-700">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-4 sm:px-8">
        <div className="max-w-3xl text-sm leading-6" aria-live="polite">
          <p className="font-semibold text-slate-900">{copy.title}{guideName && <> · <bdi lang="en">{guideName}</bdi></>}</p>
          <p>{copy.body}</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          <Link to={help} className="inline-flex min-h-11 items-center rounded-sm text-[#633185] underline underline-offset-4 focus-visible:outline focus-visible:outline-2">{copy.help}</Link>
          <Link to={navigationPath('/', language)} className="inline-flex min-h-11 items-center rounded-sm underline underline-offset-4 focus-visible:outline focus-visible:outline-2">{copy.home}</Link>
        </div>
      </div>
    </aside>
  );
}
