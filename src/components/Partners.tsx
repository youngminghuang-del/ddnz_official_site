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
import {
  HOME_FAQ_ITEMS,
  type HomeFaqCategory,
  type HomeFaqIcon,
  type HomeFaqItem,
  type HomeFaqLanguage,
} from '../data/homeFaqData';
import { buildQuoteHref } from '../lib/quoteLinks';
import { trackEvent } from '../lib/utils';

const localePrefix: Record<HomeFaqLanguage, string> = {
  en: '',
  zh: '/zh-cn',
  ru: '/ru',
  fr: '/fr',
  es: '/es',
  ar: '/ar',
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
  },
  title: {
    en: 'China sourcing, product & shipping questions',
    zh: '中国采购、产品与国际运输问答',
    ru: 'Вопросы о закупках, товарах и доставке из Китая',
    fr: 'Questions sur le sourcing, les produits et l’expédition depuis la Chine',
    es: 'Preguntas sobre compras, productos y envíos desde China',
    ar: 'أسئلة التوريد والمنتجات والشحن من الصين',
  },
  subtitle: {
    en: 'Practical answers for importers buying commercial kitchen equipment, audio and mobile accessories for the Middle East, Africa and Latin America.',
    zh: '面向中东、非洲和拉美进口商，解答商用餐厨设备、音响和手机配件采购中的真实决策问题。',
    ru: 'Практические ответы для импортеров коммерческого кухонного оборудования, аудиотехники и мобильных аксессуаров на Ближнем Востоке, в Африке и Латинской Америке.',
    fr: 'Des réponses pratiques pour les importateurs d’équipements de cuisine professionnelle, d’audio et d’accessoires mobiles au Moyen-Orient, en Afrique et en Amérique latine.',
    es: 'Respuestas prácticas para importadores de equipamiento de cocina comercial, audio y accesorios móviles en Oriente Medio, África y América Latina.',
    ar: 'إجابات عملية لمستوردي معدات المطابخ التجارية والصوتيات وملحقات الهواتف في الشرق الأوسط وأفريقيا وأمريكا اللاتينية.',
  },
  searchPlaceholder: {
    en: 'Search MOQ, DDP, CIF, ice machines, UN38.3, QC…',
    zh: '搜索 MOQ、DDP、CIF、制冰机、UN38.3、质检…',
    ru: 'Поиск: MOQ, DDP, CIF, льдогенераторы, UN38.3, QC…',
    fr: 'Rechercher MOQ, DDP, CIF, machines à glaçons, UN38.3, QC…',
    es: 'Buscar MOQ, DDP, CIF, máquinas de hielo, UN38.3, QC…',
    ar: 'ابحث عن MOQ أو DDP أو CIF أو ماكينات الثلج أو UN38.3 أو الجودة…',
  },
  noResults: {
    en: 'No matching question yet. Try a product, shipping term or compliance document.',
    zh: '暂未找到匹配问题，可尝试搜索产品、贸易条款或合规文件。',
    ru: 'Совпадений нет. Попробуйте товар, условие поставки или документ.',
    fr: 'Aucune question correspondante. Essayez un produit, un Incoterm ou un document.',
    es: 'No hay coincidencias. Pruebe con un producto, Incoterm o documento.',
    ar: 'لا توجد نتيجة مطابقة. جرب منتجا أو شرط شحن أو مستند امتثال.',
  },
  resetSearch: {
    en: 'Show all questions',
    zh: '显示全部问题',
    ru: 'Показать все вопросы',
    fr: 'Afficher toutes les questions',
    es: 'Mostrar todas las preguntas',
    ar: 'عرض كل الأسئلة',
  },
  ctaTitle: {
    en: 'Need a product, compliance or landed-cost plan?',
    zh: '需要产品、合规或到岸成本方案？',
    ru: 'Нужен план по товару, соответствию или полной стоимости?',
    fr: 'Besoin d’un plan produit, conformité ou coût rendu ?',
    es: '¿Necesita un plan de producto, conformidad o coste total?',
    ar: 'هل تحتاج خطة للمنتج أو الامتثال أو التكلفة النهائية؟',
  },
  ctaDesc: {
    en: 'Share the product, target market and order stage. Our Guangzhou team will define the supplier, QC, consolidation and export questions that must be resolved before you commit.',
    zh: '告诉我们产品、目标市场和订单阶段。广州团队会在您投入采购前，明确供应商、质检、集货和出口环节必须解决的问题。',
    ru: 'Укажите товар, рынок и стадию заказа. Команда в Гуанчжоу определит вопросы поставщика, QC, консолидации и экспорта до принятия обязательств.',
    fr: 'Indiquez le produit, le marché et l’étape de commande. Notre équipe de Guangzhou définira les points fournisseur, QC, consolidation et export à résoudre avant engagement.',
    es: 'Comparta producto, mercado y etapa del pedido. Nuestro equipo de Guangzhou definirá los puntos de proveedor, QC, consolidación y exportación antes de que se comprometa.',
    ar: 'شارك المنتج والسوق ومرحلة الطلب. سيحدد فريق قوانغتشو مسائل المورد والجودة والتجميع والتصدير التي يجب حلها قبل الالتزام.',
  },
  ctaButton: {
    en: 'Start a sourcing brief',
    zh: '开始采购需求简报',
    ru: 'Начать бриф по закупке',
    fr: 'Démarrer un brief sourcing',
    es: 'Iniciar solicitud de compra',
    ar: 'ابدأ موجز التوريد',
  },
} satisfies Record<string, Record<HomeFaqLanguage, string>>;

const categoryLabels: Record<'all' | HomeFaqCategory, Record<HomeFaqLanguage, string>> = {
  all: { en: 'All questions', zh: '全部问题', ru: 'Все вопросы', fr: 'Toutes', es: 'Todas', ar: 'كل الأسئلة' },
  sourcing: { en: 'Supplier sourcing', zh: '供应商采购', ru: 'Поставщики', fr: 'Fournisseurs', es: 'Proveedores', ar: 'الموردون' },
  shipping: { en: 'CIF, DDP & landed cost', zh: 'CIF、DDP 与到岸成本', ru: 'CIF, DDP и стоимость', fr: 'CIF, DDP et coût rendu', es: 'CIF, DDP y coste total', ar: 'CIF وDDP والتكلفة' },
  products: { en: 'Product checks', zh: '产品核验', ru: 'Проверка товара', fr: 'Contrôles produit', es: 'Control de producto', ar: 'فحص المنتجات' },
  quality: { en: 'QC evidence', zh: '质检证据', ru: 'QC-доказательства', fr: 'Preuves QC', es: 'Evidencia QC', ar: 'أدلة الجودة' },
  compliance: { en: 'Compliance', zh: '合规文件', ru: 'Соответствие', fr: 'Conformité', es: 'Conformidad', ar: 'الامتثال' },
};

function localizePath(path: string, language: HomeFaqLanguage) {
  const [pathname, hash] = path.split('#');
  return `${localePrefix[language]}${pathname}${hash ? `#${hash}` : ''}`;
}

export default function Partners() {
  const { language } = useLanguage();
  const currentLang = (language || 'en') as HomeFaqLanguage;
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
      return `${item.question[currentLang]} ${item.answer[currentLang]}`
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
                            {item.question[currentLang]}
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
                                {item.answer[currentLang]}
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
                                {item.cta[currentLang]}
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
