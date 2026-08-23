import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  ChevronDown,
  ClipboardCheck,
  FileCheck2,
  HelpCircle,
  ReceiptText,
  Refrigerator,
  Search,
  Ship,
  Smartphone,
  Speaker,
  X,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../i18n/translations';
import {
  HOME_FAQ_ITEMS,
  type HomeFaqCategory,
  type HomeFaqIcon,
  type HomeFaqItem,
  type HomeFaqLanguage,
} from '../data/homeFaqData';
import { buildQuoteHref } from '../lib/quoteLinks';
import { trackEvent } from '../lib/utils';

const localePrefix: Record<Language, string> = {
  en: '',
  zh: '/zh-cn',
  ru: '/ru',
  fr: '/fr',
  es: '/es',
  ar: '/ar',
  pt: '/pt',
  tr: '/tr',
};

const iconByKey: Record<HomeFaqIcon, React.ComponentType<{ className?: string }>> = {
  verify: BadgeCheck,
  consolidate: Boxes,
  terms: Ship,
  cost: ReceiptText,
  kitchen: Refrigerator,
  mobile: Smartphone,
  audio: Speaker,
  inspection: ClipboardCheck,
  compliance: FileCheck2,
};

const sectionCopy = {
  eyebrow: {
    en: 'Buyer decision support',
    zh: '买家决策支持',
    ru: 'Поддержка решений покупателя',
    fr: 'Aide à la décision acheteur',
    es: 'Apoyo a decisiones de compra',
    ar: 'دعم قرار المشتري',
    pt: 'Apoio à decisão do comprador',
    tr: 'Satın alma karar desteği',
  },
  title: {
    en: 'China sourcing, product & shipping questions',
    zh: '中国采购、产品与国际运输问答',
    ru: 'Вопросы о закупках, товарах и доставке из Китая',
    fr: 'Questions sur le sourcing, les produits et l’expédition depuis la Chine',
    es: 'Preguntas sobre compras, productos y envíos desde China',
    ar: 'أسئلة التوريد والمنتجات والشحن من الصين',
    pt: 'Perguntas sobre sourcing, produtos e frete da China',
    tr: 'Çin’den tedarik, ürün ve sevkiyat soruları',
  },
  subtitle: {
    en: 'Practical answers for importers buying commercial kitchen equipment, audio and mobile accessories for the Middle East, Africa and Latin America.',
    zh: '面向中东、非洲和拉美进口商，解答商用餐厨设备、音响和手机配件采购中的真实决策问题。',
    ru: 'Практические ответы для импортеров коммерческого кухонного оборудования, аудиотехники и мобильных аксессуаров на Ближнем Востоке, в Африке и Латинской Америке.',
    fr: 'Des réponses pratiques pour les importateurs d’équipements de cuisine professionnelle, d’audio et d’accessoires mobiles au Moyen-Orient, en Afrique et en Amérique latine.',
    es: 'Respuestas prácticas para importadores de equipamiento de cocina comercial, audio y accesorios móviles en Oriente Medio, África y América Latina.',
    ar: 'إجابات عملية لمستوردي معدات المطابخ التجارية والصوتيات وملحقات الهواتف في الشرق الأوسط وأفريقيا وأمريكا اللاتينية.',
    pt: 'Respostas práticas para importadores de cozinha comercial, áudio e acessórios móveis no Oriente Médio, África e América Latina.',
    tr: 'Orta Doğu, Afrika ve Latin Amerika’daki ticari mutfak, ses ve mobil aksesuar ithalatçıları için uygulamalı yanıtlar.',
  },
  searchPlaceholder: {
    en: 'Search MOQ, DDP, CIF, ice machines, UN38.3, QC…',
    zh: '搜索 MOQ、DDP、CIF、制冰机、UN38.3、质检…',
    ru: 'Поиск: MOQ, DDP, CIF, льдогенераторы, UN38.3, QC…',
    fr: 'Rechercher MOQ, DDP, CIF, machines à glaçons, UN38.3, QC…',
    es: 'Buscar MOQ, DDP, CIF, máquinas de hielo, UN38.3, QC…',
    ar: 'ابحث عن MOQ أو DDP أو CIF أو ماكينات الثلج أو UN38.3 أو الجودة…',
    pt: 'Buscar MOQ, DDP, CIF, máquinas de gelo, UN38.3, QC…',
    tr: 'MOQ, DDP, CIF, buz makinesi, UN38.3, QC ara…',
  },
  noResults: {
    en: 'No matching question yet. Try a product, shipping term or compliance document.',
    zh: '暂未找到匹配问题，可尝试搜索产品、贸易条款或合规文件。',
    ru: 'Совпадений нет. Попробуйте товар, условие поставки или документ.',
    fr: 'Aucune question correspondante. Essayez un produit, un Incoterm ou un document.',
    es: 'No hay coincidencias. Pruebe con un producto, Incoterm o documento.',
    ar: 'لا توجد نتيجة مطابقة. جرب منتجا أو شرط شحن أو مستند امتثال.',
    pt: 'Ainda não há uma pergunta correspondente. Tente um produto, termo de frete ou documento de conformidade.',
    tr: 'Eşleşen soru yok. Bir ürün, teslim şekli veya uyumluluk belgesi deneyin.',
  },
  resetSearch: {
    en: 'Show all questions',
    zh: '显示全部问题',
    ru: 'Показать все вопросы',
    fr: 'Afficher toutes les questions',
    es: 'Mostrar todas las preguntas',
    ar: 'عرض كل الأسئلة',
    pt: 'Mostrar todas as perguntas',
    tr: 'Tüm soruları göster',
  },
  ctaTitle: {
    en: 'Need a product, compliance or landed-cost plan?',
    zh: '需要产品、合规或到岸成本方案？',
    ru: 'Нужен план по товару, соответствию или полной стоимости?',
    fr: 'Besoin d’un plan produit, conformité ou coût rendu ?',
    es: '¿Necesita un plan de producto, conformidad o coste total?',
    ar: 'هل تحتاج خطة للمنتج أو الامتثال أو التكلفة النهائية؟',
    pt: 'Precisa de um plano de produto, conformidade ou custo posto?',
    tr: 'Ürün, uyumluluk veya toplam maliyet planına mı ihtiyacınız var?',
  },
  ctaDesc: {
    en: 'Share the product, target market and order stage. Our Guangzhou team will define the supplier, QC, consolidation and export questions that must be resolved before you commit.',
    zh: '告诉我们产品、目标市场和订单阶段。广州团队会在您投入采购前，明确供应商、质检、集货和出口环节必须解决的问题。',
    ru: 'Укажите товар, рынок и стадию заказа. Команда в Гуанчжоу определит вопросы поставщика, QC, консолидации и экспорта до принятия обязательств.',
    fr: 'Indiquez le produit, le marché et l’étape de commande. Notre équipe de Guangzhou définira les points fournisseur, QC, consolidation et export à résoudre avant engagement.',
    es: 'Comparta producto, mercado y etapa del pedido. Nuestro equipo de Guangzhou definirá los puntos de proveedor, QC, consolidación y exportación antes de que se comprometa.',
    ar: 'شارك المنتج والسوق ومرحلة الطلب. سيحدد فريق قوانغتشو مسائل المورد والجودة والتجميع والتصدير التي يجب حلها قبل الالتزام.',
    pt: 'Compartilhe o produto, o mercado e a fase do pedido. Nossa equipe em Guangzhou definirá os pontos de fornecedor, QC, consolidação e exportação antes do compromisso.',
    tr: 'Ürünü, hedef pazarı ve sipariş aşamasını paylaşın. Guangzhou ekibimiz taahhütten önce çözülmesi gereken tedarikçi, QC, konsolidasyon ve ihracat konularını belirler.',
  },
  ctaButton: {
    en: 'Start a sourcing brief',
    zh: '开始采购需求简报',
    ru: 'Начать бриф по закупке',
    fr: 'Démarrer un brief sourcing',
    es: 'Iniciar solicitud de compra',
    ar: 'ابدأ موجز التوريد',
    pt: 'Iniciar um briefing de sourcing',
    tr: 'Tedarik özeti başlat',
  },
} satisfies Record<string, Record<Language, string>>;

const categoryLabels: Record<'all' | HomeFaqCategory, Record<Language, string>> = {
  all: { en: 'All questions', zh: '全部问题', ru: 'Все вопросы', fr: 'Toutes', es: 'Todas', ar: 'كل الأسئلة', pt: 'Todas', tr: 'Tümü' },
  sourcing: { en: 'Supplier sourcing', zh: '供应商采购', ru: 'Поставщики', fr: 'Fournisseurs', es: 'Proveedores', ar: 'الموردون', pt: 'Fornecedores', tr: 'Tedarikçiler' },
  shipping: { en: 'CIF, DDP & landed cost', zh: 'CIF、DDP 与到岸成本', ru: 'CIF, DDP и стоимость', fr: 'CIF, DDP et coût rendu', es: 'CIF, DDP y coste total', ar: 'CIF وDDP والتكلفة', pt: 'CIF, DDP e custo posto', tr: 'CIF, DDP ve toplam maliyet' },
  products: { en: 'Product checks', zh: '产品核验', ru: 'Проверка товара', fr: 'Contrôles produit', es: 'Control de producto', ar: 'فحص المنتجات', pt: 'Verificação de produto', tr: 'Ürün kontrolleri' },
  quality: { en: 'QC evidence', zh: '质检证据', ru: 'QC-доказательства', fr: 'Preuves QC', es: 'Evidencia QC', ar: 'أدلة الجودة', pt: 'Evidências de QC', tr: 'QC kanıtları' },
  compliance: { en: 'Compliance', zh: '合规文件', ru: 'Соответствие', fr: 'Conformité', es: 'Conformidad', ar: 'الامتثال', pt: 'Conformidade', tr: 'Uyumluluk' },
};

type SupplementalFaqLanguage = 'pt' | 'tr';
type SupplementalFaqCopy = Record<'question' | 'answer' | 'cta', Record<SupplementalFaqLanguage, string>>;

const supplementalFaqCopy: Record<number, SupplementalFaqCopy> = {
  1: {
    question: { pt: 'Como encontrar e verificar um fornecedor confiável na China antes de pagar o sinal?', tr: 'Kapora ödemeden önce güvenilir bir Çin tedarikçisini nasıl bulup doğrularım?' },
    answer: { pt: 'Verifique razão social, licença, endereço da fábrica e escopo de produtos; depois confronte a cotação com uma visita por vídeo ao vivo ou auditoria local. Aprove a amostra e registre as especificações antes do sinal. A DDNZ também analisa evidências de entrega, qualidade, serviço e custo antes da pré-seleção.', tr: 'Yasal unvanı, işletme ruhsatını, fabrika adresini ve ürün kapsamını doğrulayın; ardından teklifi canlı video veya saha denetimiyle karşılaştırın. Kaporadan önce numuneyi onaylayıp şartnameyi kaydedin. DDNZ ayrıca kısa liste öncesinde teslimat, kalite, hizmet ve maliyet kanıtlarını inceler.' },
    cta: { pt: 'Ver o processo de verificação', tr: 'Tedarikçi doğrulama sürecini gör' },
  },
  2: {
    question: { pt: 'A DDNZ pode combinar pedidos de várias fábricas chinesas em uma única exportação?', tr: 'DDNZ birden fazla Çin fabrikasından gelen siparişleri tek ihracat sevkiyatında birleştirebilir mi?' },
    answer: { pt: 'Sim, quando produtos e documentos podem viajar juntos. Alinhamos datas de prontidão, recebemos e contamos caixas, verificamos etiquetas e embalagem, preservamos evidências de QC e comparamos LCL e FCL antes da entrega para exportação. Baterias, líquidos e outras cargas regulamentadas podem exigir tratamento separado.', tr: 'Ürünler ve belgeler birlikte taşınabiliyorsa evet. Fabrika hazır tarihlerini eşleştirir, kolileri teslim alıp sayar, etiket ve paketlemeyi kontrol eder, QC kanıtını korur ve ihracat tesliminden önce LCL ile FCL’yi karşılaştırırız. Batarya, sıvı ve düzenlemeye tabi yükler ayrı işlem gerektirebilir.' },
    cta: { pt: 'Ver consolidação e entrega para exportação', tr: 'Konsolidasyon ve ihracat teslimini gör' },
  },
  3: {
    question: { pt: 'CIF ou DDP da China: qual é melhor para um primeiro pedido comercial?', tr: 'Çin’den CIF mi DDP mi: ilk ticari sipariş için hangisi daha iyi?' },
    answer: { pt: 'Nenhum termo é automaticamente mais seguro. No CIF, o vendedor organiza frete e seguro básico até o porto indicado; o comprador normalmente cuida da importação e dos custos no destino. O DDP só simplifica quando o importador oficial é legal e transparente. Compare responsabilidades, provas aduaneiras e custo total posto.', tr: 'Hiçbiri otomatik olarak daha güvenli değildir. CIF’te satıcı navlun ve temel sigortayı belirtilen limana kadar düzenler; ithalat ve varış masrafları genelde alıcıdadır. DDP ancak kayıtlı ithalatçı düzeni yasal ve şeffafsa kolaylık sağlar. Başlık fiyatı değil, sorumluluk, gümrük kanıtı ve toplam maliyeti karşılaştırın.' },
    cta: { pt: 'Comparar opções para minha carga', tr: 'Sevkiyat seçeneklerimi karşılaştır' },
  },
  4: {
    question: { pt: 'O que uma cotação DDP transparente deve informar sobre importador, impostos e documentos?', tr: 'Şeffaf bir DDP teklifi kayıtlı ithalatçı, vergiler ve gümrük belgeleri hakkında ne göstermeli?' },
    answer: { pt: 'Peça o nome legal e o registro do importador oficial, código HS e valor declarado, quem paga impostos, quais documentos aduaneiros ou fiscais serão entregues e o escopo exato. Despachante ou agente de carga não é automaticamente o importador. Evite rotas opacas com “impostos incluídos” se precisar de declarações, IVA ou trilha formal de estoque.', tr: 'Kayıtlı ithalatçının yasal adı ve kaydı, HS kodu ve beyan değeri, vergi ödeyen taraf, teslim edilecek gümrük/vergi belgeleri ve kesin teslim kapsamını isteyin. Gümrük müşaviri veya taşıma acentesi otomatik olarak ithalatçı değildir. Beyan, KDV kanıtı veya resmi stok izi gerekiyorsa belirsiz “vergiler dahil” rotalardan kaçının.' },
    cta: { pt: 'Solicitar revisão DDP transparente', tr: 'Şeffaf DDP incelemesi talep et' },
  },
  5: {
    question: { pt: 'Quais custos costumam ficar fora do CIF e como calculo o custo posto?', tr: 'CIF teklifine genellikle hangi masraflar dahil değildir ve toplam maliyet nasıl hesaplanır?' },
    answer: { pt: 'O CIF normalmente termina no porto de destino. Considere terminal, manuseio, despacho, impostos, armazenagem ou demurrage, devolução do contêiner, entrega interna, tarifas bancárias e inspeção ou certificação. Calcule por itens com o código HS, volume, porto e dias livres corretos.', tr: 'CIF genellikle varış limanında sona erer. Terminal ve elleçleme, gümrük müşavirliği, vergi, depolama veya demuraj, konteyner iadesi, iç taşıma, banka ve denetim/sertifika giderlerini ekleyin. Doğru HS kodu, yük hacmi, liman ve serbest süreyle kalem bazında hesaplayın.' },
    cta: { pt: 'Montar meu plano de custo posto', tr: 'Toplam maliyet planımı oluştur' },
  },
  6: {
    question: { pt: 'O que verificar antes de comprar máquina de gelo ou refrigerador inox comercial da China?', tr: 'Çin’den ticari buz makinesi veya paslanmaz çelik buzdolabı almadan önce neyi doğrulamalıyım?' },
    answer: { pt: 'Compare a produção na temperatura ambiente e de água reais, não apenas kg/dia do catálogo. Confirme classe climática, tensão, frequência, refrigerante, inox, compressor, controlador, limpeza, peças, embalagem e certificação no destino. Para mercados quentes, peça condições de teste e evidências de perda de capacidade com o aumento da temperatura.', tr: 'Katalog kg/gün değeri yerine gerçek ortam ve giriş suyu sıcaklığındaki üretimi karşılaştırın. İklim sınıfı, voltaj, frekans, soğutucu, paslanmaz çelik kalitesi, kompresör, kontrolcü, temizlik, yedek parça, paketleme ve hedef ülke belgesini doğrulayın. Sıcak pazarlar için test koşulu ve sıcaklık arttıkça kapasite değişimi kanıtı isteyin.' },
    cta: { pt: 'Revisar sourcing de cozinha comercial', tr: 'Ticari mutfak tedarikini incele' },
  },
  7: {
    question: { pt: 'Posso pedir capas, películas, carregadores e power banks mistos com MOQ menor?', tr: 'Karışık telefon kılıfı, ekran koruyucu, şarj cihazı ve powerbank’i daha düşük MOQ ile sipariş edebilir miyim?' },
    answer: { pt: 'Muitas vezes sim, se o fornecedor aceitar SKUs mistos ou se a DDNZ consolidar fábricas compatíveis. Defina MOQ por modelo e cor, aparelhos compatíveis, mistura por caixa, marca, etiquetas, amostra e critérios de defeito. Power banks podem exigir documentos, embalagem e transportador separados por causa da bateria de lítio.', tr: 'Tedarikçi karışık SKU kabul ederse veya DDNZ uyumlu fabrikaları birleştirirse çoğu zaman evet. Model ve renk bazında MOQ, telefon modelleri, koli karışımı, marka, etiket, numune ve kusur kriterini tanımlayın. Lityum batarya nedeniyle powerbank’ler ayrı belge, paket ve taşıyıcı gerektirebilir.' },
    cta: { pt: 'Revisar sourcing de acessórios móveis', tr: 'Mobil aksesuar tedarikini incele' },
  },
  8: {
    question: { pt: 'Quais documentos são necessários para enviar power banks e carregadores da China?', tr: 'Çin’den powerbank ve şarj cihazı göndermek için hangi belgeler gerekir?' },
    answer: { pt: 'Depende do modal, desenho da bateria, transportador e destino. Power banks normalmente exigem resumo UN38.3, SDS/MSDS, declaração de bateria e evidência de embalagem; o transportador pode pedir mais. Para carregadores, confirme plugue, tensão, saída e documentos de conformidade. Valide a aceitação antes de escolher fornecedor ou reservar a carga.', tr: 'Taşıma modu, batarya tasarımı, taşıyıcı ve hedef ülkeye bağlıdır. Powerbank için genellikle UN38.3 test özeti, SDS/MSDS, batarya beyanı ve uygun paket kanıtı gerekir; taşıyıcı ek belge isteyebilir. Şarj cihazında fiş, voltaj, çıkış ve hedef ülke uygunluk belgelerini doğrulayın. Tedarikçi seçimi veya rezervasyondan önce belge kabulünü teyit edin.' },
    cta: { pt: 'Planejar um envio móvel em conformidade', tr: 'Uyumlu mobil ürün sevkiyatı planla' },
  },
  9: {
    question: { pt: 'Como verificar potência, autonomia da bateria e componentes antes de um pedido de áudio?', tr: 'Ses ürünü siparişinden önce watt, batarya çalışma süresi ve bileşenleri nasıl doğrularım?' },
    answer: { pt: 'Peça especificação por modelo que separe potência contínua/RMS de pico publicitário. Registre driver, amplificador, célula e controlador; teste autonomia, carga, calor, som e acessórios. A amostra e o método aprovados devem reger a produção, junto com plugue, tensão, rádio e segurança do destino.', tr: 'Sürekli/RMS gücü pazarlama tepe değerinden ayıran model bazlı şartname isteyin. Sürücü, amplifikatör, batarya hücresi ve kontrolcü referansını kaydedin; çalışma süresi, şarj, ısı, ses ve aksesuarları test edin. Onaylı numune ve test yöntemi üretimi, hedef ülke fiş, voltaj, radyo ve güvenlik gerekleriyle birlikte yönetmelidir.' },
    cta: { pt: 'Revisar sourcing de áudio e caixas de som', tr: 'Ses ve hoparlör tedarikini incele' },
  },
  10: {
    question: { pt: 'Como a DDNZ controla amostras, especificações e qualidade antes do embarque?', tr: 'DDNZ numune, şartname ve sevkiyat öncesi kaliteyi nasıl kontrol eder?' },
    answer: { pt: 'Transformamos amostra aprovada e requisitos do comprador em especificação versionada e checklist. Conforme o risco, acompanhamos produção, quantidade, embalagem, testes funcionais e amostragem pré-embarque. Fotos, vídeos ou relatórios apoiam a decisão de liberação; inspeção não substitui certificação obrigatória.', tr: 'Onaylı numune ve alıcı şartlarını sürüm kontrollü şartname ve kontrol listesine dönüştürürüz. Ürün riskine göre üretim takibi, adet/paket kontrolü, fonksiyon testi ve sevkiyat öncesi örnekleme yapılır. Fotoğraf, video veya rapor serbest bırakma kararını destekler; denetim zorunlu sertifikanın yerini tutmaz.' },
    cta: { pt: 'Ver o portão de evidências de QC', tr: 'QC kanıt kapısını gör' },
  },
  11: {
    question: { pt: 'Quais certificações de produto são necessárias no Oriente Médio, África ou América Latina?', tr: 'Orta Doğu, Afrika veya Latin Amerika için hangi ürün sertifikaları gerekir?' },
    answer: { pt: 'Depende do país, produto, tensão, classificação HS e uso. NOM, Inmetro, RETIQ, SEC, SABER/IECEE, SONCAP ou NRCS podem valer em mercados específicos. Não presuma que CE ou FCC basta. Confirme o modelo exato com importador, despachante e autoridade competente antes da produção.', tr: 'Hedef ülke, ürün, voltaj, HS sınıfı ve kullanıma bağlıdır. NOM, Inmetro, RETIQ, SEC, SABER/IECEE, SONCAP veya NRCS belirli pazar ve ürünlerde geçerli olabilir. CE veya FCC’nin her yerde yeterli olduğunu varsaymayın. Üretimden önce kesin modeli ithalatçı, gümrük müşaviri ve yetkili kurumla doğrulayın.' },
    cta: { pt: 'Revisar conformidade para meu mercado', tr: 'Pazarım için uyumluluğu incele' },
  },
};

function faqText(item: HomeFaqItem, field: 'question' | 'answer' | 'cta', language: Language) {
  if (language === 'pt' || language === 'tr') {
    return supplementalFaqCopy[item.id]?.[field][language] || item[field].en;
  }
  return item[field][language];
}

function localizePath(path: string, language: Language) {
  const [pathname, hash] = path.split('#');
  return `${localePrefix[language]}${pathname}${hash ? `#${hash}` : ''}`;
}

export default function Partners() {
  const { language } = useLanguage();
  const currentLang = language || 'en';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | HomeFaqCategory>('all');
  const [openId, setOpenId] = useState<number | null>(null);
  const sourcingBriefHref = buildQuoteHref({
    intent: 'Product Sourcing',
    language,
    source: 'homepage_faq_bottom',
  });

  const filteredFaqs = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
    return HOME_FAQ_ITEMS.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (!normalizedQuery) return true;
      return `${faqText(item, 'question', currentLang)} ${faqText(item, 'answer', currentLang)}`
        .toLocaleLowerCase()
        .includes(normalizedQuery);
    });
  }, [currentLang, searchQuery, selectedCategory]);

  const getItemHref = (item: HomeFaqItem) => {
    if (item.target.kind === 'path') return localizePath(item.target.path, currentLang);
    return buildQuoteHref({
      intent: item.target.intent,
      language,
      industry: item.target.industry,
      source: `homepage_faq_${item.id}`,
    });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setOpenId(null);
  };

  return (
    <section
      id="partners"
      dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
      aria-labelledby="faq-title"
      className="relative overflow-hidden border-t border-slate-200 bg-[var(--ddnz-surface-muted)] py-16 md:py-24"
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#763c9c_32%,#c94f2f_68%,transparent)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--ddnz-purple-strong)]">
            {sectionCopy.eyebrow[currentLang]}
          </p>
          <h2 id="faq-title" className="mt-4 text-3xl font-black tracking-[-0.035em] text-[var(--ddnz-ink)] md:text-5xl">
            {sectionCopy.title[currentLang]}
          </h2>
          <p id="faq-subtitle" className="mx-auto mt-5 max-w-3xl text-sm font-medium leading-7 text-slate-600 md:text-base">
            {sectionCopy.subtitle[currentLang]}
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-5xl space-y-5">
          <div className="relative flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_14px_35px_rgba(16,36,63,0.08)]">
            <Search className="ms-3.5 h-5 w-5 shrink-0 text-[var(--ddnz-purple)]" aria-hidden="true" />
            <input
              id="faq-search-input"
              name="faq-search"
              type="search"
              autoComplete="off"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                if (event.target.value.trim()) {
                  setSelectedCategory('all');
                  setOpenId(null);
                }
              }}
              aria-label={sectionCopy.searchPlaceholder[currentLang]}
              placeholder={sectionCopy.searchPlaceholder[currentLang]}
              className="min-h-11 w-full border-none bg-transparent pe-3 text-sm font-semibold text-slate-800 outline-none placeholder:font-medium placeholder:text-slate-400 focus-visible:ring-0 md:text-base"
            />
            {searchQuery && (
              <button
                id="faq-search-clear"
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label={sectionCopy.resetSearch[currentLang]}
                className="me-1 grid min-h-11 min-w-11 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2" aria-label="FAQ categories">
            {(Object.keys(categoryLabels) as Array<'all' | HomeFaqCategory>).map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  id={`faq-filter-${category}`}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setSelectedCategory(category);
                    setOpenId(null);
                  }}
                  className={`min-h-10 rounded-full border px-4 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] focus-visible:ring-offset-2 md:text-sm ${
                    active
                      ? 'border-[var(--ddnz-purple)] bg-[var(--ddnz-purple)] text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-[var(--ddnz-purple)] hover:text-[var(--ddnz-purple-strong)]'
                  }`}
                >
                  {categoryLabels[category][currentLang]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-5xl space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length ? (
              filteredFaqs.map((item) => {
                const isOpen = openId === item.id;
                const Icon = iconByKey[item.icon];
                return (
                  <motion.article
                    key={item.id}
                    id={`faq-item-${item.id}`}
                    layout="position"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`overflow-hidden rounded-2xl border bg-white transition ${
                      isOpen
                        ? 'border-[var(--ddnz-purple)] shadow-[0_18px_42px_rgba(99,43,137,0.11)]'
                        : 'border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <h3>
                      <button
                        id={`faq-trigger-${item.id}`}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${item.id}`}
                        onClick={() => {
                          const nextOpenId = isOpen ? null : item.id;
                          setOpenId(nextOpenId);
                          if (nextOpenId) {
                            trackEvent('faq_question_open', {
                              faq_id: item.id,
                              faq_category: item.category,
                              faq_language: currentLang,
                            });
                          }
                        }}
                        className="flex w-full items-start justify-between gap-4 p-5 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ddnz-purple)] md:p-6"
                      >
                        <span className="flex min-w-0 items-start gap-4">
                          <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition ${isOpen ? 'bg-[var(--ddnz-purple)] text-white' : 'bg-[var(--ddnz-purple-soft)] text-[var(--ddnz-purple-strong)]'}`}>
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <span className="pt-1 text-sm font-black leading-6 text-[var(--ddnz-ink)] md:text-base">
                            <span className="me-2 font-mono text-[10px] tracking-[0.15em] text-[var(--ddnz-coral)]">{String(item.id).padStart(2, '0')}</span>
                            {faqText(item, 'question', currentLang)}
                          </span>
                        </span>
                        <span className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-50 text-slate-500 transition ${isOpen ? 'rotate-180 bg-[var(--ddnz-purple-soft)] text-[var(--ddnz-purple)]' : ''}`}>
                          <ChevronDown className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-panel-${item.id}`}
                          role="region"
                          aria-labelledby={`faq-trigger-${item.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: 'easeInOut' }}
                        >
                          <div className="border-t border-slate-100 px-5 pb-6 pt-5 md:px-6">
                            <div className="sm:ms-[60px]">
                              <p className="max-w-3xl text-sm font-medium leading-7 text-slate-600">
                                {faqText(item, 'answer', currentLang)}
                              </p>
                              <Link
                                to={getItemHref(item)}
                                data-analytics-tracked="true"
                                onClick={() => trackEvent('faq_answer_cta_click', {
                                  faq_id: item.id,
                                  faq_category: item.category,
                                  faq_target: item.target.kind,
                                })}
                                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--ddnz-purple)] px-4 py-2.5 text-sm font-black text-[var(--ddnz-purple-strong)] transition hover:bg-[var(--ddnz-purple-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] focus-visible:ring-offset-2"
                              >
                                {faqText(item, 'cta', currentLang)}
                                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.article>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm"
              >
                <HelpCircle className="mx-auto h-11 w-11 text-slate-300" aria-hidden="true" />
                <p className="mx-auto mt-4 max-w-lg text-sm font-semibold leading-6 text-slate-500">
                  {sectionCopy.noResults[currentLang]}
                </p>
                <button
                  id="faq-reset-btn"
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 min-h-11 rounded-xl bg-[var(--ddnz-purple)] px-5 py-2.5 text-sm font-black text-white transition hover:bg-[var(--ddnz-purple-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] focus-visible:ring-offset-2"
                >
                  {sectionCopy.resetSearch[currentLang]}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="relative mx-auto mt-14 max-w-5xl overflow-hidden rounded-3xl bg-[var(--ddnz-ink)] p-7 text-white shadow-[0_24px_60px_rgba(16,36,63,0.18)] md:p-9"
        >
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#763c9c,#c94f2f,#f28a55)]" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h3 className="text-xl font-black tracking-[-0.025em] md:text-2xl">{sectionCopy.ctaTitle[currentLang]}</h3>
              <p className="mt-3 text-sm font-medium leading-6 text-slate-300">{sectionCopy.ctaDesc[currentLang]}</p>
            </div>
            <Link
              id="faq-contact-btn"
              to={sourcingBriefHref}
              data-analytics-tracked="true"
              onClick={() => trackEvent('faq_cta_click', { location: 'homepage_faq_section', lead_goal: 'Product Sourcing' })}
              className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--ddnz-coral)] px-6 py-3 text-sm font-black text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[var(--ddnz-coral-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ddnz-ink)] md:w-auto"
            >
              {sectionCopy.ctaButton[currentLang]}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
