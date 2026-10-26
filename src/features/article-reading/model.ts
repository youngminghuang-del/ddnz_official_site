import { sanitizeQuoteContext } from '../../lib/quoteLinkPolicy.mjs';
import { canonicalSitePath } from '../../lib/notionArticleRouting';
import { kitchenArticleDiscovery } from '../../data/kitchenArticleDiscovery.mjs';
import type { BlogPost } from '../../types/content';
import type { Language } from '../../i18n/translations';

export type ArticleUi = {
  loading: string;
  missing: string;
  back: string;
  home: string;
  insights: string;
  published: string;
  minRead: string;
  verified: string;
  updated: string;
  reviewedBy: string;
  evidenceRecords: string;
  linked: string;
  legacyRecord: string;
  lastVerified: string;
  lastUpdated: string;
  onThisPage: string;
  nextStep: string;
  ctaTitle: string;
  ctaBody: string;
  backInsights: string;
  automatedReview: string;
  editorialDesk: string;
  legacyEditorial: string;
  commercialCta: string;
  outdoorCta: string;
  sourcingCta: string;
  freightCta: string;
};

export const articleUi: Record<Language | 'id', ArticleUi> = {
  id: {
    loading: 'Memuat artikel...', missing: 'Artikel tidak ditemukan', back: 'Kembali ke beranda', home: 'Beranda', insights: 'Artikel', published: 'Diterbitkan', minRead: 'menit baca', verified: 'Diperiksa', updated: 'Diperbarui', reviewedBy: 'Ditinjau oleh', evidenceRecords: 'Sumber pendukung', linked: 'terkait', legacyRecord: 'Arsip', lastVerified: 'Terakhir diperiksa', lastUpdated: 'Terakhir diperbarui', onThisPage: 'Daftar isi', nextStep: 'Rencanakan dapur Anda', ctaTitle: 'Mulai dari denah, menu, dan anggaran.', ctaBody: 'Kirim denah, konsep menu, kota tujuan, dan target pembukaan kepada DDNZ. Kami membantu desain layout, pembagian fungsi, pemilihan peralatan, dan pengadaan dari China. Satu outlet pun dapat ditangani.', backInsights: 'Kembali ke artikel', automatedReview: 'Tinjauan editorial DDNZ', editorialDesk: 'Tim editorial DDNZ', legacyEditorial: 'Arsip editorial', commercialCta: 'Diskusikan desain dapur dengan DDNZ', outdoorCta: 'Diskusikan pengadaan', sourcingCta: 'Diskusikan pengadaan', freightCta: 'Diskusikan pengiriman',
  },
  en: {
    loading: 'Loading verified article...', missing: 'Post Not Found', back: 'Back to Home', home: 'Home', insights: 'Insights', published: 'Published', minRead: 'min read', verified: 'Verified', updated: 'Updated', reviewedBy: 'Reviewed by', evidenceRecords: 'Evidence records', linked: 'linked', legacyRecord: 'Legacy record', lastVerified: 'Last verified', lastUpdated: 'Last updated', onThisPage: 'On this page', nextStep: 'Next operational step', ctaTitle: 'Turn this guidance into a scoped China sourcing or export plan.', ctaBody: 'Share the destination market, product scope, quantities, inspection needs, and export requirements. DDNZ will respond against the stated scope rather than with a generic promise.', backInsights: 'Back to Insights Hub', automatedReview: 'DDNZ automated research and editorial audit', editorialDesk: 'DDNZ editorial desk', legacyEditorial: 'Legacy editorial record', commercialCta: 'Plan a commercial kitchen sourcing project', outdoorCta: 'Plan an outdoor product sourcing project', sourcingCta: 'Start a product sourcing brief', freightCta: 'Request a China export freight plan',
  },
  zh: {
    loading: '正在加载已核验文章…', missing: '未找到文章', back: '返回首页', home: '首页', insights: '洞察', published: '发布于', minRead: '分钟阅读', verified: '已核验', updated: '已更新', reviewedBy: '审核人', evidenceRecords: '证据记录', linked: '项已关联', legacyRecord: '历史记录', lastVerified: '最近核验', lastUpdated: '最近更新', onThisPage: '本页内容', nextStep: '下一步行动', ctaTitle: '将这些信息转化为范围明确的中国采购或出口方案。', ctaBody: '请提供目的市场、产品范围、数量、验货要求和出口需求。DDNZ 将根据具体范围回复，而不是提供笼统承诺。', backInsights: '返回洞察中心', automatedReview: 'DDNZ 自动研究与编辑审计', editorialDesk: 'DDNZ 编辑团队', legacyEditorial: '历史编辑记录', commercialCta: '规划商用厨房采购项目', outdoorCta: '规划户外产品采购项目', sourcingCta: '提交产品采购简报', freightCta: '获取中国出口运输方案',
  },
  ru: {
    loading: 'Загрузка проверенной статьи…', missing: 'Статья не найдена', back: 'Вернуться на главную', home: 'Главная', insights: 'Материалы', published: 'Опубликовано', minRead: 'мин чтения', verified: 'Проверено', updated: 'Обновлено', reviewedBy: 'Проверил', evidenceRecords: 'Подтверждающие материалы', linked: 'связано', legacyRecord: 'Архивная запись', lastVerified: 'Последняя проверка', lastUpdated: 'Последнее обновление', onThisPage: 'На этой странице', nextStep: 'Следующий практический шаг', ctaTitle: 'Превратите эти рекомендации в конкретный план закупки или экспорта из Китая.', ctaBody: 'Укажите рынок назначения, ассортимент, объёмы, требования к инспекции и экспорту. DDNZ ответит по заданному объёму работ без общих обещаний.', backInsights: 'Вернуться в раздел материалов', automatedReview: 'Автоматизированная исследовательская и редакционная проверка DDNZ', editorialDesk: 'Редакция DDNZ', legacyEditorial: 'Архивная редакционная запись', commercialCta: 'Спланировать закупку оборудования для профессиональной кухни', outdoorCta: 'Спланировать закупку товаров для отдыха на природе', sourcingCta: 'Начать бриф по закупке товара', freightCta: 'Запросить план экспорта из Китая',
  },
  fr: {
    loading: 'Chargement de l’article vérifié…', missing: 'Article introuvable', back: 'Retour à l’accueil', home: 'Accueil', insights: 'Ressources', published: 'Publié le', minRead: 'min de lecture', verified: 'Vérifié', updated: 'Mis à jour', reviewedBy: 'Relu par', evidenceRecords: 'Éléments de preuve', linked: 'liés', legacyRecord: 'Dossier historique', lastVerified: 'Dernière vérification', lastUpdated: 'Dernière mise à jour', onThisPage: 'Dans cet article', nextStep: 'Prochaine étape opérationnelle', ctaTitle: 'Transformez ces informations en un plan défini d’approvisionnement ou d’export depuis la Chine.', ctaBody: 'Indiquez le marché de destination, les produits, les quantités, les besoins d’inspection et les exigences d’export. DDNZ répondra selon ce périmètre précis.', backInsights: 'Retour au centre de ressources', automatedReview: 'Audit automatisé de recherche et de rédaction DDNZ', editorialDesk: 'Rédaction DDNZ', legacyEditorial: 'Dossier éditorial historique', commercialCta: 'Planifier un projet d’approvisionnement en cuisine professionnelle', outdoorCta: 'Planifier un projet d’approvisionnement en produits outdoor', sourcingCta: 'Démarrer un brief d’approvisionnement', freightCta: 'Demander un plan d’export depuis la Chine',
  },
  es: {
    loading: 'Cargando contenido verificado…', missing: 'Artículo no encontrado', back: 'Volver al inicio', home: 'Inicio', insights: 'Recursos', published: 'Publicado', minRead: 'min de lectura', verified: 'Verificado', updated: 'Actualizado', reviewedBy: 'Revisado por', evidenceRecords: 'Registros de evidencia', linked: 'vinculados', legacyRecord: 'Registro histórico', lastVerified: 'Última verificación', lastUpdated: 'Última actualización', onThisPage: 'En esta página', nextStep: 'Siguiente paso operativo', ctaTitle: 'Convierta esta información en un plan definido de abastecimiento o exportación desde China.', ctaBody: 'Comparta el mercado de destino, el alcance del producto, las cantidades, las necesidades de inspección y los requisitos de exportación. DDNZ responderá según ese alcance.', backInsights: 'Volver al centro de recursos', automatedReview: 'Auditoría automatizada de investigación y edición de DDNZ', editorialDesk: 'Equipo editorial de DDNZ', legacyEditorial: 'Registro editorial histórico', commercialCta: 'Planificar un proyecto de abastecimiento de cocina comercial', outdoorCta: 'Planificar un proyecto de abastecimiento de productos outdoor', sourcingCta: 'Iniciar un brief de abastecimiento', freightCta: 'Solicitar un plan de exportación desde China',
  },
  ar: {
    loading: 'جارٍ تحميل المقال المتحقق منه…', missing: 'المقال غير موجود', back: 'العودة إلى الصفحة الرئيسية', home: 'الرئيسية', insights: 'المعرفة', published: 'نُشر في', minRead: 'دقائق للقراءة', verified: 'تم التحقق', updated: 'تم التحديث', reviewedBy: 'راجعه', evidenceRecords: 'سجلات الأدلة', linked: 'مرتبطة', legacyRecord: 'سجل سابق', lastVerified: 'آخر تحقق', lastUpdated: 'آخر تحديث', onThisPage: 'في هذه الصفحة', nextStep: 'الخطوة التشغيلية التالية', ctaTitle: 'حوّل هذه الإرشادات إلى خطة محددة للتوريد أو التصدير من الصين.', ctaBody: 'شارك سوق الوجهة ونطاق المنتجات والكميات ومتطلبات الفحص والتصدير. سترد DDNZ وفق النطاق المحدد بدلًا من الوعود العامة.', backInsights: 'العودة إلى مركز المعرفة', automatedReview: 'تدقيق DDNZ الآلي للبحث والتحرير', editorialDesk: 'فريق تحرير DDNZ', legacyEditorial: 'سجل تحريري سابق', commercialCta: 'خطط لمشروع توريد مطبخ تجاري', outdoorCta: 'خطط لمشروع توريد منتجات خارجية', sourcingCta: 'ابدأ موجز توريد المنتجات', freightCta: 'اطلب خطة تصدير من الصين',
  },
  pt: {
    loading: 'A carregar o artigo verificado…', missing: 'Artigo não encontrado', back: 'Voltar ao início', home: 'Início', insights: 'Conteúdos', published: 'Publicado em', minRead: 'min de leitura', verified: 'Verificado', updated: 'Atualizado', reviewedBy: 'Revisto por', evidenceRecords: 'Registos de evidência', linked: 'associados', legacyRecord: 'Registo histórico', lastVerified: 'Última verificação', lastUpdated: 'Última atualização', onThisPage: 'Nesta página', nextStep: 'Próximo passo operacional', ctaTitle: 'Transforme esta orientação num plano definido de sourcing ou exportação a partir da China.', ctaBody: 'Partilhe o mercado de destino, o âmbito dos produtos, as quantidades, as necessidades de inspeção e os requisitos de exportação. A DDNZ responderá de acordo com esse âmbito específico.', backInsights: 'Voltar ao centro de conteúdos', automatedReview: 'Auditoria automatizada de pesquisa e edição da DDNZ', editorialDesk: 'Equipa editorial da DDNZ', legacyEditorial: 'Registo editorial histórico', commercialCta: 'Planear um projeto de sourcing para cozinha profissional', outdoorCta: 'Planear um projeto de sourcing de produtos outdoor', sourcingCta: 'Iniciar um briefing de sourcing', freightCta: 'Solicitar um plano de exportação a partir da China',
  },
  tr: {
    loading: 'Doğrulanmış makale yükleniyor…', missing: 'Makale bulunamadı', back: 'Ana sayfaya dön', home: 'Ana sayfa', insights: 'İçgörüler', published: 'Yayın tarihi', minRead: 'dk okuma', verified: 'Doğrulandı', updated: 'Güncellendi', reviewedBy: 'İnceleyen', evidenceRecords: 'Kanıt kayıtları', linked: 'bağlantılı', legacyRecord: 'Geçmiş kayıt', lastVerified: 'Son doğrulama', lastUpdated: 'Son güncelleme', onThisPage: 'Bu sayfada', nextStep: 'Sonraki operasyon adımı', ctaTitle: 'Bu rehberi kapsamı belirlenmiş bir Çin tedarik veya ihracat planına dönüştürün.', ctaBody: 'Hedef pazarı, ürün kapsamını, miktarları, denetim ihtiyaçlarını ve ihracat gerekliliklerini paylaşın. DDNZ genel vaatler yerine belirttiğiniz kapsama göre yanıt verir.', backInsights: 'İçgörü merkezine dön', automatedReview: 'DDNZ otomatik araştırma ve editoryal denetimi', editorialDesk: 'DDNZ editoryal ekibi', legacyEditorial: 'Geçmiş editoryal kayıt', commercialCta: 'Ticari mutfak tedarik projesi planlayın', outdoorCta: 'Outdoor ürün tedarik projesi planlayın', sourcingCta: 'Ürün tedarik brifi başlatın', freightCta: 'Çin ihracat planı talep edin',
  },
};

export function normalizeNotionLinks(content: string) {
  return content.replace(
    /https:\/\/(?:www\.)?google\.com\/search\?q=([^"'&\s]+)/g,
    (url, encodedPath: string) => {
      try {
        const path = decodeURIComponent(encodedPath);
        const isInternalRoute =
          /^(?:\/services\/|\/shipping-from-china-to-|\/insights(?:\/|$)|\/sourcing\/|\/get-a-quote)/.test(path);
        return isInternalRoute ? `https://www.ddnzglobal.com${canonicalSitePath(path)}` : url;
      } catch {
        return url;
      }
    },
  );
}

export function buildPrimaryCta(post: BlogPost, prefix: string, ui: ArticleUi) {
  if (post.language === 'id' && post.productCategory === 'Commercial Kitchen Equipment') return {
    href: 'https://wa.me/85261077362?text=Saya%20ingin%20merencanakan%20dapur%20restoran%20di%20Indonesia.%20Kota%3A%20%20Menu%3A%20%20Anggaran%3A',
    label: ui.commercialCta,
  };
  const isProductSourcing =
    post.leadGoal === 'Product Sourcing' ||
    post.primaryCTA === 'Commercial Kitchen Sourcing' ||
    post.primaryCTA === 'Outdoor Products Sourcing' ||
    (Boolean(post.productCategory) && post.productCategory !== 'Not Applicable');
  const params = new URLSearchParams({
    source: 'article',
    article: post.slug || post.id,
    leadGoal: post.leadGoal || (isProductSourcing ? 'Product Sourcing' : 'Freight Export'),
  });
  // Discovery links keep only a fixed subcategory identifier, never free text.
  const subcategory = sanitizeQuoteContext({ subcategory: post.productSubcategory || '' }).subcategory;
  if (subcategory) params.set('subcategory', subcategory);

  if (post.primaryCTA === 'Commercial Kitchen Sourcing') {
    const next = kitchenArticleDiscovery[post.slug || '']?.links[0];
    if (next) {
      const [pathname, hash] = next.href.split('#');
      return { label: next.label, href: `${pathname}?${params.toString()}${hash ? `#${hash}` : ''}` };
    }
    return {
      label: ui.commercialCta,
      href: `${canonicalSitePath(`${prefix}/sourcing/commercial-kitchen-equipment-from-china`)}?${params.toString()}#${post.slug?.includes("margin") ? "commercial-kitchen-benchmarks" : "commercial-kitchen-equipment"}`,
    };
  }
  if (post.primaryCTA === 'Outdoor Products Sourcing') {
    return {
      label: ui.outdoorCta,
      href: `${canonicalSitePath(`${prefix}/sourcing/outdoor-products-from-china`)}?${params.toString()}`,
    };
  }
  // Quote context is moved out of href at the link-emission boundary.
  if (post.productCategory && post.productCategory !== 'Not Applicable') params.set('industry', post.productCategory);
  if (post.productSubcategory) params.set('subcategory', post.productSubcategory);
  return {
    label: isProductSourcing ? ui.sourcingCta : ui.freightCta,
    href: `${canonicalSitePath(`${prefix}/get-a-quote`)}?${params.toString()}`,
  };
}

export const readingLabels: Record<string, string[]> = {
 en:['Buyer guide','Comparison','Market update','Sourcing','Market','Project logistics','Railway','Supply chain strategy','Compliance','Global','Latin America','Africa','Europe','Middle East','Central Asia','North America','Back to top'],
 zh:['采购指南','产品比较','市场观察','产品采购','市场','项目物流','铁路运输','供应链规划','进口文件','全球','拉丁美洲','非洲','欧洲','中东','中亚','北美','返回顶部'],
 es:['Guía de compra','Comparativa','Actualidad del mercado','Abastecimiento','Mercado','Logística de proyectos','Transporte ferroviario','Estrategia de suministro','Documentación de importación','Global','Latinoamérica','África','Europa','Oriente Medio','Asia Central','Norteamérica','Volver arriba'],
 fr:['Guide d’achat','Comparatif','Actualité du marché','Approvisionnement','Marché','Logistique de projet','Transport ferroviaire','Stratégie d’approvisionnement','Documents d’importation','Monde','Amérique latine','Afrique','Europe','Moyen-Orient','Asie centrale','Amérique du Nord','Retour en haut'],
 pt:['Guia de compra','Comparação','Atualização do mercado','Fornecimento','Mercado','Logística de projetos','Transporte ferroviário','Estratégia de fornecimento','Documentos de importação','Global','América Latina','África','Europa','Oriente Médio','Ásia Central','América do Norte','Voltar ao topo'],
 ru:['Руководство по закупке','Сравнение','Обзор рынка','Закупки','Рынок','Проектная логистика','Железнодорожные перевозки','Стратегия поставок','Документы для импорта','Весь мир','Латинская Америка','Африка','Европа','Ближний Восток','Центральная Азия','Северная Америка','Наверх'],
 tr:['Satın alma rehberi','Karşılaştırma','Pazar güncellemesi','Tedarik','Pazar','Proje lojistiği','Demiryolu taşımacılığı','Tedarik zinciri stratejisi','İthalat belgeleri','Küresel','Latin Amerika','Afrika','Avrupa','Orta Doğu','Orta Asya','Kuzey Amerika','Başa dön'],
 ar:['دليل الشراء','مقارنة','مستجدات السوق','التوريد','السوق','لوجستيات المشاريع','النقل بالسكك الحديدية','استراتيجية سلسلة التوريد','مستندات الاستيراد','عالمي','أمريكا اللاتينية','أفريقيا','أوروبا','الشرق الأوسط','آسيا الوسطى','أمريكا الشمالية','العودة إلى الأعلى'],
 id:['Panduan pembelian','Perbandingan','Perkembangan pasar','Pengadaan','Pasar','Logistik proyek','Angkutan kereta','Strategi pasokan','Dokumen impor','Global','Amerika Latin','Afrika','Eropa','Timur Tengah','Asia Tengah','Amerika Utara','Kembali ke atas'],
};
const taxonomy=['Buyer Guide','Comparison','Market Update','Sourcing','Market','Project Logistics','Railway','Supply Chain Strategy','Compliance','Global','Latin America','Africa','Europe','Middle East','Central Asia','North America'];
export const readingLocale=(locale:string)=>locale==='zh-cn'?'zh':locale;
export function articleLabel(value:string,locale:string){
 const copy=readingLabels[readingLocale(locale)]||readingLabels.en;
 return value.split(',').map(v=>{const key=v.trim(),i=taxonomy.indexOf(key);return i>=0?copy[i]:key;}).filter(Boolean).join(' · ');
}
export function readingDate(value:string,locale:string){
 const date=new Date(value?.slice(0,10)+'T00:00:00Z');
 if(!Number.isFinite(date.getTime()))return value||'';
 return new Intl.DateTimeFormat(locale==='zh'?'zh-CN':locale,{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(date);
}

export const articleImageLabels:Record<string,[string,string]>={en:['View image','Close image'],zh:['查看大图','关闭图片'],es:['Ampliar imagen','Cerrar imagen'],fr:['Agrandir l’image','Fermer l’image'],pt:['Ampliar imagem','Fechar imagem'],ru:['Открыть изображение','Закрыть изображение'],tr:['Görseli büyüt','Görseli kapat'],ar:['تكبير الصورة','إغلاق الصورة'],id:['Perbesar gambar','Tutup gambar']};
