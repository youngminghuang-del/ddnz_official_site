import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  ClipboardCheck,
  LockKeyhole,
  MessageCircle,
  Search,
  ShieldCheck,
  Ship,
  Smartphone,
  Speaker,
  TentTree,
  UsersRound,
  Utensils,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../i18n/translations';
import { appendAttribution, buildAttributedWhatsAppUrl, readAttribution } from '../lib/attribution';
import { trackEvent } from '../lib/utils';

type Intent = 'sourcing' | 'existing' | 'freight';
type Category = 'Commercial Kitchen Equipment' | 'Audio & Speakers' | 'Mobile Accessories' | 'Outdoor Products';

type HomeCopy = {
  headline: string;
  body: string;
  primary: string;
  freight: string;
  whatsapp: string;
  support: string;
  heritage: string;
  formTitle: string;
  sourcing: string;
  sourcingDesc: string;
  existing: string;
  existingDesc: string;
  freightOnly: string;
  freightDesc: string;
  category: string;
  kitchen: string;
  audio: string;
  mobile: string;
  outdoor: string;
  selectOne: string;
  market: string;
  marketPlaceholder: string;
  privacy: string;
  process: Array<[string, string]>;
  categoriesTitle: string;
  viewAll: string;
};

const HOME_COPY: Record<Language, HomeCopy> = {
  en: {
    headline: 'Source, inspect and ship commercial products from China—with one accountable team.',
    body: 'Commercial kitchen equipment, audio, mobile accessories and outdoor products for importers across the Middle East, Africa and Latin America. We coordinate suppliers, quality checks, consolidation and export delivery from China.',
    primary: 'Start a sourcing brief', freight: 'Get a freight quote', whatsapp: 'WhatsApp our China team',
    support: 'Guangzhou origin-control team · Arabic, English, French and Spanish support',
    heritage: 'International freight operated by Heaven Born · Since 1997.',
    formTitle: 'What do you need help with?', sourcing: 'Find & source products', sourcingDesc: 'I need help finding and buying products', existing: 'Inspect or consolidate existing orders', existingDesc: 'I already have orders with suppliers', freightOnly: 'Freight only', freightDesc: 'I just need shipping and export', category: 'Product category', kitchen: 'Commercial kitchen', audio: 'Audio & speakers', mobile: 'Mobile accessories', outdoor: 'Outdoor products', selectOne: 'select one', market: 'Destination market', marketPlaceholder: 'Select your main market', privacy: 'Your information is secure and never shared.',
    process: [['Brief', 'Share your needs, specs and target market.'], ['Supplier shortlist', 'We find and vet the right manufacturers.'], ['Samples & spec checks', 'We verify quality, capacity and compliance.'], ['QC evidence', 'On-site inspections with photos and reports.'], ['Consolidated export', 'We consolidate, document and ship to your market.']],
    categoriesTitle: 'Explore our priority categories', viewAll: 'View all product categories',
  },
  zh: {
    headline: '从中国采购、验货并出口商用产品，由一个团队全程负责。', body: '面向中东、非洲和中南美进口商，提供商用餐厨设备、音响、手机配件和户外用品的供应商协调、质量检查、集货与出口交付。', primary: '提交采购需求', freight: '获取货运报价', whatsapp: 'WhatsApp 联系中国团队', support: '广州源头控制团队 · 支持中文、英语、阿拉伯语、法语和西语', heritage: '国际货运由华正邦泰执行 · 始于 1997 年。', formTitle: '您需要哪类协助？', sourcing: '寻找并采购产品', sourcingDesc: '需要寻找、比较并采购产品', existing: '验货或集货现有订单', existingDesc: '已经向供应商下单', freightOnly: '仅需货运', freightDesc: '只需要出口和运输', category: '产品品类', kitchen: '商用餐厨', audio: '音响设备', mobile: '手机配件', outdoor: '户外用品', selectOne: '请选择一项', market: '目标市场', marketPlaceholder: '选择主要目标市场', privacy: '您的资料将被安全处理，不会公开。', process: [['需求简报', '提交产品、规格与目标市场。'], ['供应商筛选', '寻找并核验合适制造商。'], ['样品与规格检查', '核对质量、产能与合规。'], ['验货证据', '现场验货并提供图片和报告。'], ['集货出口', '统一集货、单证和出口交付。']], categoriesTitle: '重点采购品类', viewAll: '查看全部品类',
  },
  ru: {
    headline: 'Закупайте, проверяйте и отправляйте товары из Китая с одной ответственной командой.', body: 'Профессиональное кухонное оборудование, аудио, мобильные аксессуары и товары для отдыха для импортеров Ближнего Востока, Африки и Латинской Америки.', primary: 'Оставить заявку', freight: 'Рассчитать доставку', whatsapp: 'WhatsApp команде в Китае', support: 'Контроль в Гуанчжоу · Поддержка на нескольких языках', heritage: 'Международная перевозка — Heaven Born · С 1997 года.', formTitle: 'Какая помощь вам нужна?', sourcing: 'Найти и закупить товары', sourcingDesc: 'Нужен поиск и закупка продукции', existing: 'Проверить или консолидировать', existingDesc: 'Заказы уже размещены у поставщиков', freightOnly: 'Только доставка', freightDesc: 'Нужны экспорт и перевозка', category: 'Категория товара', kitchen: 'Проф. кухни', audio: 'Аудио и колонки', mobile: 'Мобильные аксессуары', outdoor: 'Товары для отдыха', selectOne: 'выберите один вариант', market: 'Рынок назначения', marketPlaceholder: 'Выберите основной рынок', privacy: 'Ваши данные защищены.', process: [['Заявка', 'Требования, спецификации и рынок.'], ['Поставщики', 'Поиск и проверка производителей.'], ['Образцы', 'Качество, мощности и соответствие.'], ['Инспекция', 'Фото и отчеты с площадки.'], ['Экспорт', 'Консолидация, документы и отправка.']], categoriesTitle: 'Основные категории', viewAll: 'Все категории',
  },
  fr: {
    headline: 'Achetez, contrôlez et expédiez vos produits de Chine avec une seule équipe responsable.', body: 'Équipements de cuisine professionnelle, audio, accessoires mobiles et produits de plein air pour les importateurs du Moyen-Orient, d’Afrique et d’Amérique latine.', primary: 'Démarrer un brief', freight: 'Obtenir un devis fret', whatsapp: 'WhatsApp équipe Chine', support: 'Équipe de contrôle à Guangzhou · Support multilingue', heritage: 'Fret international opéré par Heaven Born · Depuis 1997.', formTitle: 'De quelle aide avez-vous besoin ?', sourcing: 'Rechercher et acheter', sourcingDesc: 'Je cherche des produits et fournisseurs', existing: 'Inspecter ou consolider', existingDesc: 'Mes commandes déjà placées', freightOnly: 'Fret uniquement', freightDesc: 'J’ai seulement besoin du transport', category: 'Catégorie produit', kitchen: 'Cuisine pro', audio: 'Audio et enceintes', mobile: 'Accessoires mobiles', outdoor: 'Produits de plein air', selectOne: 'sélectionnez une option', market: 'Marché de destination', marketPlaceholder: 'Choisir votre marché principal', privacy: 'Vos informations restent confidentielles.', process: [['Brief', 'Besoins, spécifications et marché.'], ['Fournisseurs', 'Recherche et vérification.'], ['Échantillons', 'Qualité, capacité et conformité.'], ['Inspection', 'Photos et rapports sur site.'], ['Export groupé', 'Consolidation, documents et livraison.']], categoriesTitle: 'Nos catégories prioritaires', viewAll: 'Voir toutes les catégories',
  },
  es: {
    headline: 'Compre, inspeccione y envíe productos comerciales desde China con un solo equipo responsable.', body: 'Equipos de cocina comercial, audio, accesorios móviles y productos para actividades al aire libre para importadores de Oriente Medio, África y América Latina.', primary: 'Iniciar solicitud', freight: 'Cotizar transporte', whatsapp: 'WhatsApp al equipo de China', support: 'Equipo de control en Guangzhou · Atención multilingüe', heritage: 'Transporte internacional operado por Heaven Born · Desde 1997.', formTitle: '¿Qué ayuda necesita?', sourcing: 'Buscar y comprar productos', sourcingDesc: 'Necesito encontrar y comprar productos', existing: 'Inspeccionar o consolidar', existingDesc: 'Ya tengo pedidos con proveedores', freightOnly: 'Solo transporte', freightDesc: 'Solo necesito exportación y envío', category: 'Categoría de producto', kitchen: 'Cocina comercial', audio: 'Audio y altavoces', mobile: 'Accesorios móviles', outdoor: 'Actividades al aire libre', selectOne: 'seleccione una opción', market: 'Mercado de destino', marketPlaceholder: 'Seleccione su mercado principal', privacy: 'Sus datos se mantienen seguros.', process: [['Solicitud', 'Necesidades, especificaciones y mercado.'], ['Proveedores', 'Búsqueda y verificación.'], ['Muestras', 'Calidad, capacidad y cumplimiento.'], ['Inspección', 'Fotos e informes en origen.'], ['Exportación', 'Consolidación, documentos y envío.']], categoriesTitle: 'Categorías prioritarias', viewAll: 'Ver todas las categorías',
  },
  ar: {
    headline: 'اشترِ وافحص واشحن المنتجات التجارية من الصين مع فريق واحد مسؤول.', body: 'معدات المطابخ التجارية والصوت وملحقات الهاتف ومستلزمات الأنشطة الخارجية للمستوردين في الشرق الأوسط وأفريقيا وأمريكا اللاتينية.', primary: 'ابدأ طلب التوريد', freight: 'احصل على عرض شحن', whatsapp: 'واتساب فريق الصين', support: 'فريق مراقبة في قوانغتشو · دعم متعدد اللغات', heritage: 'الشحن الدولي من تنفيذ Heaven Born · منذ 1997.', formTitle: 'ما نوع المساعدة المطلوبة؟', sourcing: 'البحث وشراء المنتجات', sourcingDesc: 'أحتاج إلى العثور على المنتجات وشرائها', existing: 'فحص أو تجميع الطلبات', existingDesc: 'لدي طلبات قائمة لدى الموردين', freightOnly: 'الشحن فقط', freightDesc: 'أحتاج إلى التصدير والشحن فقط', category: 'فئة المنتج', kitchen: 'معدات المطابخ', audio: 'الصوت ومكبرات الصوت', mobile: 'ملحقات الهاتف', outdoor: 'مستلزمات خارجية', selectOne: 'اختر خياراً واحداً', market: 'سوق الوجهة', marketPlaceholder: 'اختر السوق الرئيسي', privacy: 'يتم التعامل مع معلوماتك بسرية.', process: [['الموجز', 'الاحتياجات والمواصفات والسوق.'], ['الموردون', 'البحث والتحقق من المصانع.'], ['العينات', 'الجودة والقدرة والامتثال.'], ['الفحص', 'صور وتقارير من الموقع.'], ['التصدير', 'التجميع والمستندات والشحن.']], categoriesTitle: 'فئاتنا ذات الأولوية', viewAll: 'عرض جميع الفئات',
  },
  pt: {
    headline: 'Encontre, inspecione e exporte produtos comerciais da China com uma equipe responsável.', body: 'Equipamentos para cozinha profissional, áudio, acessórios para celular e produtos outdoor para importadores do Oriente Médio, África e América Latina.', primary: 'Iniciar solicitação', freight: 'Solicitar cotação de frete', whatsapp: 'WhatsApp da equipe na China', support: 'Equipe de controle em Guangzhou · Atendimento em português e outros idiomas', heritage: 'Transporte internacional executado pela Heaven Born · Desde 1997.', formTitle: 'Como podemos ajudar?', sourcing: 'Encontrar e comprar produtos', sourcingDesc: 'Preciso localizar e comprar produtos', existing: 'Inspecionar ou consolidar pedidos', existingDesc: 'Já tenho pedidos com fornecedores', freightOnly: 'Somente transporte', freightDesc: 'Preciso apenas de exportação e frete', category: 'Categoria do produto', kitchen: 'Cozinha profissional', audio: 'Áudio e caixas de som', mobile: 'Acessórios para celular', outdoor: 'Produtos outdoor', selectOne: 'selecione uma opção', market: 'Mercado de destino', marketPlaceholder: 'Selecione o mercado principal', privacy: 'Suas informações são tratadas com segurança.', process: [['Brief', 'Necessidades, especificações e mercado.'], ['Fornecedores', 'Busca e verificação de fabricantes.'], ['Amostras', 'Qualidade, capacidade e conformidade.'], ['Inspeção', 'Fotos e relatórios no local.'], ['Exportação', 'Consolidação, documentos e envio.']], categoriesTitle: 'Categorias prioritárias', viewAll: 'Ver todas as categorias',
  },
  tr: {
    headline: 'Çin’den ticari ürünleri tek bir sorumlu ekiple bulun, denetleyin ve gönderin.', body: 'Orta Doğu, Afrika ve Latin Amerika ithalatçıları için endüstriyel mutfak, ses, mobil aksesuar ve outdoor ürünleri.', primary: 'Tedarik talebi oluştur', freight: 'Nakliye teklifi al', whatsapp: 'Çin ekibiyle WhatsApp', support: 'Guangzhou kaynak kontrol ekibi · Türkçe ve çok dilli destek', heritage: 'Uluslararası nakliye Heaven Born tarafından yürütülür · 1997’den beri.', formTitle: 'Nasıl yardımcı olabiliriz?', sourcing: 'Ürün bul ve satın al', sourcingDesc: 'Ürün ve tedarikçi bulmak istiyorum', existing: 'Siparişi denetle veya birleştir', existingDesc: 'Tedarikçilerde mevcut siparişlerim var', freightOnly: 'Sadece nakliye', freightDesc: 'Yalnızca ihracat ve taşıma istiyorum', category: 'Ürün kategorisi', kitchen: 'Endüstriyel mutfak', audio: 'Ses ve hoparlör', mobile: 'Mobil aksesuarlar', outdoor: 'Outdoor ürünler', selectOne: 'bir seçenek belirleyin', market: 'Varış pazarı', marketPlaceholder: 'Ana pazarı seçin', privacy: 'Bilgileriniz güvenle işlenir.', process: [['Talep', 'İhtiyaçlar, teknik özellikler ve pazar.'], ['Tedarikçiler', 'Üretici arama ve doğrulama.'], ['Numuneler', 'Kalite, kapasite ve uygunluk.'], ['Denetim', 'Saha fotoğrafları ve raporlar.'], ['İhracat', 'Konsolidasyon, belgeler ve sevkiyat.']], categoriesTitle: 'Öncelikli kategoriler', viewAll: 'Tüm kategorileri görüntüle',
  },
};

const CATEGORY_TAGLINES: Record<Language, [string, string, string, string]> = {
  en: [
    'Equip for performance. Source with confidence.',
    'Sound that sells. Quality buyers repeat.',
    'Fast-moving essentials. Proven quality, steady supply.',
    'Outdoor ranges built for real use and transport.',
  ],
  zh: ['按性能选型，按证据采购。', '好声音更好卖，稳定品质带来复购。', '快销产品，也要稳定品质与供应。', '面向真实使用和运输要求的户外产品。'],
  ru: ['Оборудование по задаче, закупка по доказательствам.', 'Звук, который продаётся. Качество, к которому возвращаются.', 'Ходовые товары со стабильным качеством и поставками.', 'Линейки для активного отдыха, рассчитанные на реальное использование и перевозку.'],
  fr: ['Des équipements performants, sourcés avec méthode.', 'Un son qui se vend, une qualité qui fidélise.', 'Des essentiels à rotation rapide, avec qualité et approvisionnement maîtrisés.', 'Des gammes de plein air conçues pour l’usage réel et le transport.'],
  es: ['Equipamiento por rendimiento, compras con evidencia.', 'Sonido que vende y calidad que fideliza.', 'Productos de alta rotación con calidad y suministro estables.', 'Gamas para actividades al aire libre preparadas para el uso real y el transporte.'],
  ar: ['معدات حسب الأداء وتوريد قائم على الأدلة.', 'صوت يحقق المبيعات وجودة تعزز تكرار الشراء.', 'منتجات سريعة الدوران بجودة وتوريد مستقرين.', 'مستلزمات للأنشطة الخارجية مناسبة للاستخدام الفعلي والنقل.'],
  pt: ['Equipamentos por desempenho, compras com evidências.', 'Som que vende e qualidade que gera recompra.', 'Itens de giro rápido com qualidade e fornecimento estáveis.', 'Linhas outdoor preparadas para uso real e transporte.'],
  tr: ['Performansa göre ekipman, kanıta dayalı tedarik.', 'Satan ses, tekrar sipariş getiren kalite.', 'Hızlı dönen ürünlerde istikrarlı kalite ve tedarik.', 'Gerçek kullanım ve taşımaya uygun outdoor ürünleri.'],
};

const PREFIX: Record<Language, string> = { en: '', zh: '/zh-cn', ru: '/ru', fr: '/fr', es: '/es', ar: '/ar', pt: '/pt', tr: '/tr' };

const intentIcons: Record<Intent, LucideIcon> = { sourcing: Search, existing: ClipboardCheck, freight: Ship };
const destinations = ['Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Nigeria', 'Ghana', 'Kenya', 'Mexico', 'Brazil', 'Chile', 'Peru'];

const destinationLabels: Record<Language, Record<string, string>> = {
  en: { 'Saudi Arabia': 'Saudi Arabia', 'United Arab Emirates': 'United Arab Emirates', Qatar: 'Qatar', Nigeria: 'Nigeria', Ghana: 'Ghana', Kenya: 'Kenya', Mexico: 'Mexico', Brazil: 'Brazil', Chile: 'Chile', Peru: 'Peru' },
  zh: { 'Saudi Arabia': '沙特阿拉伯', 'United Arab Emirates': '阿联酋', Qatar: '卡塔尔', Nigeria: '尼日利亚', Ghana: '加纳', Kenya: '肯尼亚', Mexico: '墨西哥', Brazil: '巴西', Chile: '智利', Peru: '秘鲁' },
  ru: { 'Saudi Arabia': 'Саудовская Аравия', 'United Arab Emirates': 'ОАЭ', Qatar: 'Катар', Nigeria: 'Нигерия', Ghana: 'Гана', Kenya: 'Кения', Mexico: 'Мексика', Brazil: 'Бразилия', Chile: 'Чили', Peru: 'Перу' },
  fr: { 'Saudi Arabia': 'Arabie saoudite', 'United Arab Emirates': 'Émirats arabes unis', Qatar: 'Qatar', Nigeria: 'Nigéria', Ghana: 'Ghana', Kenya: 'Kenya', Mexico: 'Mexique', Brazil: 'Brésil', Chile: 'Chili', Peru: 'Pérou' },
  es: { 'Saudi Arabia': 'Arabia Saudí', 'United Arab Emirates': 'Emiratos Árabes Unidos', Qatar: 'Catar', Nigeria: 'Nigeria', Ghana: 'Ghana', Kenya: 'Kenia', Mexico: 'México', Brazil: 'Brasil', Chile: 'Chile', Peru: 'Perú' },
  ar: { 'Saudi Arabia': 'المملكة العربية السعودية', 'United Arab Emirates': 'الإمارات العربية المتحدة', Qatar: 'قطر', Nigeria: 'نيجيريا', Ghana: 'غانا', Kenya: 'كينيا', Mexico: 'المكسيك', Brazil: 'البرازيل', Chile: 'تشيلي', Peru: 'بيرو' },
  pt: { 'Saudi Arabia': 'Arábia Saudita', 'United Arab Emirates': 'Emirados Árabes Unidos', Qatar: 'Catar', Nigeria: 'Nigéria', Ghana: 'Gana', Kenya: 'Quênia', Mexico: 'México', Brazil: 'Brasil', Chile: 'Chile', Peru: 'Peru' },
  tr: { 'Saudi Arabia': 'Suudi Arabistan', 'United Arab Emirates': 'Birleşik Arap Emirlikleri', Qatar: 'Katar', Nigeria: 'Nijerya', Ghana: 'Gana', Kenya: 'Kenya', Mexico: 'Meksika', Brazil: 'Brezilya', Chile: 'Şili', Peru: 'Peru' },
};

const heroImageAlts: Record<Language, [string, string, string]> = {
  en: ['Warehouse workers checking cartons during receiving', 'Warehouse workers in DDNZ field vests moving through a storage aisle', 'Warehouse employee in a DDNZ field vest handling a parcel'],
  zh: ['仓库团队在收货环节核对纸箱', '穿着 DDNZ 工作马甲的团队在仓储通道巡检', '穿着 DDNZ 工作马甲的仓库员工处理包裹'],
  ru: ['Сотрудники склада проверяют коробки при приёмке', 'Сотрудники в жилетах DDNZ проходят по складскому проходу', 'Сотрудник склада в жилете DDNZ обрабатывает посылку'],
  fr: ['Équipe d’entrepôt contrôlant les cartons à la réception', 'Équipe en gilets DDNZ dans une allée de stockage', 'Employé d’entrepôt en gilet DDNZ traitant un colis'],
  es: ['Equipo de almacén verificando cajas durante la recepción', 'Equipo con chalecos DDNZ recorriendo un pasillo de almacén', 'Empleado de almacén con chaleco DDNZ manipulando un paquete'],
  ar: ['فريق المستودع يتحقق من الصناديق أثناء الاستلام', 'فريق يرتدي سترات DDNZ داخل ممر التخزين', 'موظف مستودع يرتدي سترة DDNZ ويتعامل مع طرد'],
  pt: ['Equipe do armazém verificando caixas no recebimento', 'Equipe com coletes DDNZ em um corredor do armazém', 'Funcionário do armazém com colete DDNZ manuseando um pacote'],
  tr: ['Depo ekibi teslim alırken kolileri kontrol ediyor', 'DDNZ yelekli ekip depo koridorunda', 'DDNZ yelekli depo çalışanı paketi işliyor'],
};

const categoryImageAlts: Record<Language, [string, string, string, string]> = {
  en: ['Commercial kitchen equipment sourcing', 'Audio and speaker product sourcing', 'Unbranded magnetic power bank and mobile charging accessories', 'Brand-neutral portable energy and outdoor charging product family'],
  zh: ['商用餐厨设备采购', '音响与扬声器产品采购', '已脱敏品牌的磁吸充电宝与手机充电配件', '已脱敏品牌的便携能源与户外充电产品组合'],
  ru: ['Закупка профессионального кухонного оборудования', 'Закупка аудиотехники и колонок', 'Магнитные пауэрбанки и зарядные аксессуары без бренда', 'Линейка портативной энергии и зарядных устройств для активного отдыха без бренда'],
  fr: ['Sourcing d’équipements de cuisine professionnelle', 'Sourcing de produits audio et enceintes', 'Batteries magnétiques et accessoires de charge sans marque', 'Gamme sans marque d’énergie portable et de recharge de plein air'],
  es: ['Compra de equipos de cocina comercial', 'Compra de productos de audio y altavoces', 'Baterías magnéticas y accesorios de carga sin marca', 'Gama sin marca de energía portátil y carga para actividades al aire libre'],
  ar: ['توريد معدات المطابخ التجارية', 'توريد منتجات الصوت ومكبرات الصوت', 'بطاريات محمولة مغناطيسية وملحقات شحن بدون علامة تجارية', 'تشكيلة طاقة محمولة وشحن خارجي بدون علامة تجارية'],
  pt: ['Sourcing de equipamentos para cozinha profissional', 'Sourcing de produtos de áudio e caixas de som', 'Power banks magnéticos e acessórios de carregamento sem marca', 'Linha sem marca de energia portátil e carregamento outdoor'],
  tr: ['Endüstriyel mutfak ekipmanı tedariği', 'Ses ve hoparlör ürün tedariği', 'Markasız manyetik güç bankaları ve şarj aksesuarları', 'Markasız taşınabilir enerji ve outdoor şarj ürün grubu'],
};

const heroWhatsappMessages: Record<Language, string> = {
  en: 'Hi DDNZ Global, I would like help sourcing products from China.',
  zh: '您好 DDNZ Global，我需要协助从中国采购产品。',
  ru: 'Здравствуйте, DDNZ Global. Мне нужна помощь с закупкой товаров в Китае.',
  fr: 'Bonjour DDNZ Global, j’ai besoin d’aide pour sourcer des produits en Chine.',
  es: 'Hola DDNZ Global, necesito ayuda para comprar productos en China.',
  ar: 'مرحباً DDNZ Global، أحتاج إلى مساعدة في توريد منتجات من الصين.',
  pt: 'Olá DDNZ Global, preciso de ajuda para comprar produtos da China.',
  tr: 'Merhaba DDNZ Global, Çin’den ürün tedariki için desteğe ihtiyacım var.',
};

export default function SourcingHomepageHero() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const copy = HOME_COPY[language];
  const [intent, setIntent] = useState<Intent>('sourcing');
  const [category, setCategory] = useState<Category>('Commercial Kitchen Equipment');
  const [market, setMarket] = useState('');
  const attribution = readAttribution();
  const whatsappUrl = buildAttributedWhatsAppUrl(heroWhatsappMessages[language], attribution);

  const scrollToBrief = (nextIntent: Intent = 'sourcing') => {
    setIntent(nextIntent);
    document.getElementById('sourcing-brief')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => document.getElementById(`intent-${nextIntent}`)?.focus(), 350);
  };

  const goToQuote = (nextIntent: Intent, nextCategory = category) => {
    const params = new URLSearchParams({
      leadGoal: nextIntent === 'sourcing' ? 'Product Sourcing' : nextIntent === 'existing' ? 'Supplier Inspection & Consolidation' : 'Freight Export',
      industry: nextCategory,
      source: 'homepage_sourcing_selector',
    });
    if (market) params.set('dest', market);
    const url = appendAttribution(`${PREFIX[language]}/get-a-quote?${params.toString()}`, attribution);
    trackEvent('homepage_intent_submit', { intent: nextIntent, industry: nextCategory, destination: market || 'not_selected' });
    navigate(url);
  };

  const intents: Array<{ id: Intent; label: string; description: string }> = [
    { id: 'sourcing', label: copy.sourcing, description: copy.sourcingDesc },
    { id: 'existing', label: copy.existing, description: copy.existingDesc },
    { id: 'freight', label: copy.freightOnly, description: copy.freightDesc },
  ];

  const categories: Array<{ value: Category; label: string; Icon: LucideIcon }> = [
    { value: 'Commercial Kitchen Equipment', label: copy.kitchen, Icon: Utensils },
    { value: 'Audio & Speakers', label: copy.audio, Icon: Speaker },
    { value: 'Mobile Accessories', label: copy.mobile, Icon: Smartphone },
    { value: 'Outdoor Products', label: copy.outdoor, Icon: TentTree },
  ];

  const categoryCards = [
    {
      industry: 'Commercial Kitchen Equipment',
      label: copy.kitchen,
      tagline: CATEGORY_TAGLINES[language][0],
      image: '/images/sourcing/commercial-kitchen-project-hero.webp',
      alt: categoryImageAlts[language][0],
      href: `${PREFIX[language]}/sourcing/commercial-kitchen-equipment-from-china`,
    },
    {
      industry: 'Audio & Speakers',
      label: copy.audio,
      tagline: CATEGORY_TAGLINES[language][1],
      image: '/images/sourcing/audio-speakers-category.webp',
      alt: categoryImageAlts[language][1],
      href: `${PREFIX[language]}/sourcing/audio-speakers-from-china`,
    },
    {
      industry: 'Mobile Accessories',
      label: copy.mobile,
      tagline: CATEGORY_TAGLINES[language][2],
      image: '/images/sourcing/mobile-accessories-powerbank-category-v2.webp',
      alt: categoryImageAlts[language][2],
      href: `${PREFIX[language]}/sourcing/mobile-accessories-from-china`,
    },
    {
      industry: 'Outdoor Products',
      label: copy.outdoor,
      tagline: CATEGORY_TAGLINES[language][3],
      image: '/images/sourcing/outdoor-portable-energy-brand-neutral-v1.webp',
      alt: categoryImageAlts[language][3],
      href: `${PREFIX[language]}/sourcing/outdoor-products-from-china`,
    },
  ];

  return (
    <>
      <section className="border-b border-slate-200 bg-[#fffefb]" aria-labelledby="homepage-sourcing-title">
        <div className="mx-auto grid max-w-[1536px] lg:min-h-[600px] lg:grid-cols-12">
          <div className="flex flex-col justify-center px-5 py-12 sm:px-8 sm:py-14 lg:col-span-6 lg:px-12 lg:py-6 xl:px-[54px]">
            <h1 id="homepage-sourcing-title" className="max-w-[660px] text-[clamp(2.35rem,3.7vw,3.65rem)] font-extrabold leading-[1.04] tracking-[-0.045em] text-[var(--ddnz-ink)] lg:translate-y-2">
              {language === 'en' ? (
                <>
                  <span className="lg:block lg:whitespace-nowrap">Source, inspect and</span>{' '}
                  <span className="lg:block lg:whitespace-nowrap">ship commercial products</span>{' '}
                  <span className="lg:block lg:whitespace-nowrap">from China—with one</span>{' '}
                  <span className="lg:block lg:whitespace-nowrap">accountable team.</span>
                </>
              ) : copy.headline}
            </h1>
            <p className="mt-5 max-w-[610px] text-[17px] leading-[1.5] text-[#26364d] sm:text-[18px]">
              {copy.body}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => scrollToBrief('sourcing')} className="inline-flex min-h-[54px] items-center justify-center gap-3 rounded-lg bg-[var(--ddnz-action)] px-6 text-[16px] font-bold text-white shadow-sm transition-all hover:bg-[var(--ddnz-coral-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] focus-visible:ring-offset-2">
                {copy.primary}<ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => goToQuote('freight')} className="inline-flex min-h-[54px] items-center justify-center rounded-lg border border-[#173252] bg-white px-6 text-[16px] font-bold text-[var(--ddnz-ink)] transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] focus-visible:ring-offset-2">
                {copy.freight}
              </button>
            </div>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" data-analytics-tracked="true" onClick={() => trackEvent('whatsapp_click', { cta_location: 'homepage_hero' })} className="mt-2 inline-flex min-h-11 w-fit items-center gap-2 rounded-md py-2 text-sm font-semibold text-[var(--ddnz-purple-strong)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)]">
              <MessageCircle className="h-5 w-5 text-[#21a65a]" aria-hidden="true" />{copy.whatsapp}<ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <div className="mt-3 space-y-2 text-[13px] text-[#42536a] sm:text-sm">
              <p className="flex items-center gap-2"><UsersRound className="h-5 w-5 shrink-0 text-[#42536a]" aria-hidden="true" />{copy.support}</p>
              <p className="flex items-center gap-2"><img src="/images/brand/heaven-born-wing-logo-v1.png" alt="" width="420" height="295" className="h-7 w-10 shrink-0 object-contain" aria-hidden="true" />{copy.heritage}</p>
            </div>
          </div>

          <div className="order-3 grid h-[540px] min-h-0 grid-rows-[1.3fr_0.9fr_0.9fr] overflow-hidden bg-slate-100 sm:h-[560px] lg:order-none lg:col-span-2 lg:h-[600px]">
            <div className="min-h-0 overflow-hidden"><img src="/images/operations/pexels-jakarta-warehouse-loading-ddnz-vest-v2.webp" alt={heroImageAlts[language][0]} width="941" height="1671" loading="lazy" decoding="async" className="h-full min-h-0 w-full object-cover object-[50%_35%]" /></div>
            <div className="min-h-0 overflow-hidden"><img src="/images/operations/pexels-warehouse-workers-aisle-ddnz-vest-v1.webp" alt={heroImageAlts[language][1]} width="1536" height="1024" loading="lazy" decoding="async" className="h-full min-h-0 w-full scale-[1.18] object-cover object-[50%_44%]" /></div>
            <div className="min-h-0 overflow-hidden"><img src="/images/operations/pexels-wuhan-warehouse-receiving-ddnz-vest-v1.webp" alt={heroImageAlts[language][2]} width="1536" height="1024" loading="lazy" decoding="async" className="h-full min-h-0 w-full scale-[1.08] object-cover object-[58%_43%]" /></div>
          </div>

          <div className="order-2 flex items-center bg-[#fbfaf7] px-4 py-8 sm:px-7 lg:order-none lg:col-span-4 lg:px-5 lg:py-5 xl:px-6">
            <form id="sourcing-brief" onSubmit={(event) => { event.preventDefault(); goToQuote(intent); }} className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.10)] sm:p-5" aria-labelledby="sourcing-brief-title">
              <h2 id="sourcing-brief-title" className="text-[22px] font-extrabold tracking-[-0.025em] text-[var(--ddnz-ink)] sm:text-[24px]">{copy.formTitle}</h2>
              <div className="mt-3 grid gap-2">
                {intents.map((choice) => {
                  const Icon = intentIcons[choice.id];
                  const selected = intent === choice.id;
                  return (
                    <button id={`intent-${choice.id}`} key={choice.id} type="button" aria-pressed={selected} onClick={() => setIntent(choice.id)} className={`flex min-h-[58px] items-center gap-3 rounded-lg border px-4 py-2.5 text-start transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] ${selected ? 'border-[var(--ddnz-purple)] bg-[var(--ddnz-purple-soft)] shadow-[0_0_0_1px_rgba(118,60,156,0.12)]' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}>
                      <Icon className={`h-7 w-7 shrink-0 ${selected ? 'text-[var(--ddnz-purple)]' : 'text-slate-500'}`} strokeWidth={1.8} aria-hidden="true" />
                      <span className="min-w-0"><span className="block text-[15px] font-bold leading-tight text-[#13243b]">{choice.label}</span><span className="mt-1 block text-[12px] leading-tight text-slate-500">{choice.description}</span></span>
                    </button>
                  );
                })}
              </div>

              <fieldset className="mt-4 border-t border-slate-200 pt-3">
                <legend className="mb-2 text-[13px] font-semibold text-[#26364d]">{copy.category} <span className="font-normal text-slate-500">({copy.selectOne})</span></legend>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(({ value, label, Icon }) => {
                    const selected = category === value;
                    return (
                      <button key={value} type="button" aria-pressed={selected} onClick={() => setCategory(value)} className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-lg border px-1.5 py-2 text-center text-[11px] font-semibold leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] sm:min-h-[50px] sm:flex-row sm:gap-2 sm:px-2 sm:text-start sm:text-[12px] ${selected ? 'border-[var(--ddnz-purple)] bg-[var(--ddnz-purple-soft)] text-[var(--ddnz-purple-strong)]' : 'border-slate-200 bg-white text-[#26364d] hover:bg-slate-50'}`}>
                        <Icon className="h-5 w-5 shrink-0" strokeWidth={1.8} aria-hidden="true" />{label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <label htmlFor="destination-market" className="mt-3 block text-[13px] font-semibold text-[#26364d]">{copy.market}</label>
              <select id="destination-market" value={market} onChange={(event) => setMarket(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#26364d] outline-none transition focus:border-[var(--ddnz-purple)] focus:ring-2 focus:ring-[var(--ddnz-purple)]/20">
                <option value="">{copy.marketPlaceholder}</option>
                {destinations.map((destination) => <option key={destination} value={destination}>{destinationLabels[language][destination]}</option>)}
              </select>

              <button type="submit" className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center gap-3 rounded-lg bg-[var(--ddnz-action)] px-5 text-[16px] font-bold text-white shadow-sm transition-colors hover:bg-[var(--ddnz-coral-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] focus-visible:ring-offset-2">
                {intent === 'freight' ? copy.freight : copy.primary}<ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <p className="mt-2 flex items-center justify-center gap-2 text-center text-[12px] text-slate-500"><LockKeyhole className="h-4 w-4" aria-hidden="true" />{copy.privacy}</p>
            </form>
          </div>
        </div>
      </section>

      <section id="product-categories" className="scroll-mt-24 bg-[#fffefb] px-5 pb-14 pt-10 sm:px-8 lg:px-12" aria-labelledby="priority-categories-title">
        <div className="mx-auto max-w-[1436px]">
          <div className="flex items-end justify-between gap-4">
            <h2 id="priority-categories-title" className="text-[24px] font-extrabold tracking-[-0.025em] text-[var(--ddnz-ink)]">{copy.categoriesTitle}</h2>
            <button type="button" onClick={() => scrollToBrief('sourcing')} className="hidden items-center gap-2 text-sm font-semibold text-[var(--ddnz-purple-strong)] hover:underline sm:inline-flex">{copy.viewAll}<ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {categoryCards.map((card) => (
              <Link
                key={card.industry}
                to={card.href}
                onClick={() => trackEvent('homepage_category_select', { industry: card.industry, cta_location: 'priority_categories' })}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white text-start shadow-sm transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-[var(--ddnz-purple)]/35 hover:shadow-[0_14px_36px_rgba(16,36,63,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] focus-visible:ring-offset-2"
              >
                <div className="relative aspect-[16/7] overflow-hidden bg-slate-100">
                  <img src={card.image} alt={card.alt} width="1600" height="1000" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" aria-hidden="true" />
                  <span className="absolute bottom-5 start-5 max-w-[220px] text-[24px] font-extrabold leading-tight text-white">{card.label}</span>
                </div>
                <span className="flex min-h-[84px] items-center justify-between gap-4 px-5 py-4">
                  <span className="text-sm font-semibold leading-5 text-slate-700">{card.tagline}</span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-[var(--ddnz-purple-strong)] transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
