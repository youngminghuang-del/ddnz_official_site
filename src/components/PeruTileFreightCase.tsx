import { Calculator, Check, FileCheck2, Scale, ShieldCheck } from 'lucide-react';

type Locale = 'en' | 'zh' | 'ru' | 'fr' | 'es' | 'ar';

type Copy = {
  eyebrow: string;
  title: string;
  intro: string;
  imageAlt: string;
  evidenceLabel: string;
  evidenceCaption: string;
  wmTitle: string;
  wmBody: string;
  formulaLabel: string;
  volume: string;
  weight: string;
  result: string;
  quoteNote: string;
  gatesLabel: string;
  gates: Array<{ title: string; body: string }>;
  checklistLabel: string;
  checklist: string[];
  cta: string;
};

export const PERU_TILE_CASE_IMAGE = '/images/operations/peru-tile-loading-case.webp';

export const PERU_TILE_CASE_COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: 'PERU HEAVY CARGO CASE · CERAMIC TILES',
    title: 'Price the chargeable ton before you price the shipment',
    intro: 'Tiles are dense cargo. The loading photo is useful evidence of palletisation and securing, but the commercial decision starts with chargeable weight, importer readiness and product classification.',
    imageAlt: 'Palletised ceramic tiles secured inside a container at the China loading point',
    evidenceLabel: 'ORIGIN LOADING RECORD',
    evidenceCaption: 'China loading point. The photo confirms the packed cargo and securing method only. Destination and customs status must be verified from the shipment documents.',
    wmTitle: 'LCL ocean freight is commonly rated by W/M',
    wmBody: 'Compare gross volume in cubic metres with gross weight in metric tons. The higher figure is commonly used for the ocean-freight rating unit.',
    formulaLabel: 'QUICK CHECK',
    volume: 'Gross volume in CBM',
    weight: 'Gross weight in kg ÷ 1,000',
    result: 'Chargeable W/M = higher figure',
    quoteNote: 'The booking quotation controls. Origin, destination and special-handling charges may use a different basis.',
    gatesLabel: 'THREE GATES BEFORE LOADING',
    gates: [
      { title: 'Importer and RUC', body: 'Commercial-scale imports normally require an active RUC. SUNAT provides limited exceptions for occasional imports by individuals.' },
      { title: 'FTA origin proof', body: 'If the tiles satisfy China-Peru FTA origin rules, the prescribed Certificate or Declaration of Origin may support a preferential tariff claim. It is not an automatic exemption.' },
      { title: 'Tariff line and controls', body: 'Confirm the Peruvian tariff classification and current technical rules. A voluntary tile standard does not prove that every product line is free from controls.' },
    ],
    checklistLabel: 'SEND FOR A WORKABLE QUOTE',
    checklist: ['Tile type and proposed HS code', 'Package count, pallet dimensions and gross weight', 'Importer name and RUC status', 'Callao, Chancay or final inland address'],
    cta: 'Check my Peru tile shipment',
  },
  zh: {
    eyebrow: '秘鲁重货案例 · 建筑瓷砖',
    title: '先算计费吨，再报秘鲁瓷砖运价',
    intro: '瓷砖是典型高密度货物。装柜实拍能证明托盘、打带和装载状态，但真正影响利润的是计费吨、进口主体资格和商品归类是否在出运前锁定。',
    imageAlt: '在中国装货点完成托盘打带并装入集装箱的建筑瓷砖',
    evidenceLabel: '中国端装载记录',
    evidenceCaption: '实拍仅证明中国装货点的包装与装载状态。目的地和清关结果应以本票运输及报关文件为准。',
    wmTitle: '海运拼箱通常按 W/M 孰高计费',
    wmBody: '分别计算总体积立方米和总毛重吨，海运费通常取较高者作为计费单位。',
    formulaLabel: '快速核算',
    volume: '总体积，单位 CBM',
    weight: '总毛重 kg ÷ 1,000',
    result: '计费 W/M = 两者取高',
    quoteNote: '最终以订舱报价条款为准。起运港、目的港及特殊操作费可能采用不同计费口径。',
    gatesLabel: '装货前先过三道关',
    gates: [
      { title: '进口主体与 RUC', body: '商业规模进口通常需要有效 RUC。SUNAT 对个人偶发进口设有金额和次数有限的例外，不能简单写成个人一律无法清关。' },
      { title: '中秘协定原产地凭证', body: '瓷砖满足中秘自贸协定原产地规则时，可按协定证书或声明申请优惠税率。办证本身不等于自动免税。' },
      { title: '税号归类与产品要求', body: '先确认秘鲁税则号和现行技术法规。瓷砖检测标准为自愿性，并不能替代具体货号的准入核对。' },
    ],
    checklistLabel: '要拿到可执行报价，请提供',
    checklist: ['瓷砖类型与建议 HS 编码', '件数、托盘尺寸、总体积和总毛重', '进口商名称与 RUC 状态', 'Callao、Chancay 或内陆最终地址'],
    cta: '核对我的秘鲁瓷砖出运方案',
  },
  es: {
    eyebrow: 'CASO DE CARGA PESADA EN PERÚ · BALDOSAS CERÁMICAS',
    title: 'Calcula la tonelada facturable antes de cotizar',
    intro: 'Las baldosas son carga densa. La foto acredita la paletización y la sujeción en origen, pero la decisión comercial depende del peso facturable, del importador y de la clasificación.',
    imageAlt: 'Baldosas cerámicas paletizadas y sujetas dentro de un contenedor en China',
    evidenceLabel: 'REGISTRO DE CARGA EN ORIGEN',
    evidenceCaption: 'Punto de carga en China. La foto confirma el embalaje y la sujeción, no el destino ni el estado del despacho aduanero.',
    wmTitle: 'El LCL marítimo suele cotizarse por W/M',
    wmBody: 'Compara el volumen bruto en metros cúbicos con el peso bruto en toneladas métricas. Para el flete marítimo suele aplicarse la cifra mayor.',
    formulaLabel: 'CÁLCULO RÁPIDO',
    volume: 'Volumen bruto en CBM',
    weight: 'Peso bruto en kg ÷ 1.000',
    result: 'W/M facturable = cifra mayor',
    quoteNote: 'Rige la cotización de la reserva. Los cargos de origen, destino y manejo especial pueden usar otra base.',
    gatesLabel: 'TRES CONTROLES ANTES DE CARGAR',
    gates: [
      { title: 'Importador y RUC', body: 'Las importaciones comerciales normalmente requieren RUC activo. SUNAT contempla excepciones limitadas para importaciones ocasionales de personas naturales.' },
      { title: 'Prueba de origen del TLC', body: 'Si las baldosas cumplen las reglas de origen del TLC China-Perú, el certificado o la declaración prescritos pueden respaldar una preferencia arancelaria. No es una exoneración automática.' },
      { title: 'Partida y controles', body: 'Confirma la partida peruana y los reglamentos técnicos vigentes. Una norma voluntaria no demuestra que toda baldosa esté libre de controles.' },
    ],
    checklistLabel: 'DATOS PARA UNA COTIZACIÓN EJECUTABLE',
    checklist: ['Tipo de baldosa y partida HS propuesta', 'Bultos, medidas de palé y peso bruto', 'Nombre del importador y estado del RUC', 'Callao, Chancay o dirección interior final'],
    cta: 'Revisar mi embarque de baldosas a Perú',
  },
  ru: {
    eyebrow: 'ТЯЖЁЛЫЙ ГРУЗ В ПЕРУ · КЕРАМИЧЕСКАЯ ПЛИТКА',
    title: 'Рассчитайте платную тонну до расчёта ставки',
    intro: 'Плитка относится к плотным грузам. Фото подтверждает паллетирование и крепление в Китае, а коммерческий расчёт зависит от платного веса, готовности импортёра и классификации товара.',
    imageAlt: 'Керамическая плитка на паллетах закреплена в контейнере в Китае',
    evidenceLabel: 'ЗАПИСЬ ПОГРУЗКИ В КИТАЕ',
    evidenceCaption: 'Фото подтверждает упаковку и крепление в месте погрузки. Направление и таможенный статус подтверждаются документами конкретной отправки.',
    wmTitle: 'Морской LCL часто рассчитывается по W/M',
    wmBody: 'Сравните объём в кубических метрах и вес в метрических тоннах. Для морского фрахта обычно берётся большее значение.',
    formulaLabel: 'БЫСТРАЯ ПРОВЕРКА',
    volume: 'Общий объём в CBM',
    weight: 'Общий вес в кг ÷ 1 000',
    result: 'Платный W/M = большее значение',
    quoteNote: 'Определяющими являются условия бронирования. Сборы в порту отправления, назначения и за спецобработку могут рассчитываться иначе.',
    gatesLabel: 'ТРИ ПРОВЕРКИ ДО ПОГРУЗКИ',
    gates: [
      { title: 'Импортёр и RUC', body: 'Коммерческий импорт обычно требует активного RUC. Для редких личных импортов SUNAT предусматривает ограниченные исключения.' },
      { title: 'Подтверждение происхождения', body: 'Если товар соответствует правилам ССТ Китай-Перу, установленный сертификат или декларация могут дать право на преференцию. Льгота не применяется автоматически.' },
      { title: 'Код и требования', body: 'Проверьте перуанский тарифный код и действующие технические правила. Добровольный стандарт не означает отсутствия контроля для всех видов плитки.' },
    ],
    checklistLabel: 'ДАННЫЕ ДЛЯ РАБОЧЕЙ СТАВКИ',
    checklist: ['Вид плитки и предполагаемый HS-код', 'Число мест, размеры паллет и общий вес', 'Название импортёра и статус RUC', 'Callao, Chancay или конечный адрес внутри страны'],
    cta: 'Проверить отправку плитки в Перу',
  },
  fr: {
    eyebrow: 'CAS DE FRET LOURD AU PÉROU · CARREAUX CÉRAMIQUES',
    title: 'Calculez la tonne taxable avant de chiffrer le transport',
    intro: 'Les carreaux sont une marchandise dense. La photo atteste la palettisation et l’arrimage au départ, mais la décision commerciale dépend du poids taxable, de l’importateur et du classement.',
    imageAlt: 'Carreaux céramiques palettisés et arrimés dans un conteneur en Chine',
    evidenceLabel: 'RELEVÉ DE CHARGEMENT AU DÉPART',
    evidenceCaption: 'Point de chargement en Chine. La photo confirme l’emballage et l’arrimage, pas la destination ni le statut douanier.',
    wmTitle: 'Le fret maritime LCL est souvent coté en W/M',
    wmBody: 'Comparez le volume brut en mètres cubes au poids brut en tonnes métriques. Le fret maritime retient généralement la valeur la plus élevée.',
    formulaLabel: 'CALCUL RAPIDE',
    volume: 'Volume brut en CBM',
    weight: 'Poids brut en kg ÷ 1 000',
    result: 'W/M taxable = valeur la plus élevée',
    quoteNote: 'Le devis de réservation fait foi. Les frais d’origine, de destination et de manutention spéciale peuvent suivre une autre base.',
    gatesLabel: 'TROIS CONTRÔLES AVANT CHARGEMENT',
    gates: [
      { title: 'Importateur et RUC', body: 'Les importations commerciales exigent normalement un RUC actif. SUNAT prévoit des exceptions limitées pour certaines importations occasionnelles de particuliers.' },
      { title: 'Preuve d’origine de l’ALE', body: 'Si les carreaux respectent les règles d’origine de l’ALE Chine-Pérou, le certificat ou la déclaration prescrits peuvent appuyer une demande de préférence. Elle n’est pas automatique.' },
      { title: 'Position et contrôles', body: 'Confirmez la position tarifaire péruvienne et les règles techniques en vigueur. Une norme volontaire ne prouve pas l’absence de contrôle pour tous les carreaux.' },
    ],
    checklistLabel: 'DONNÉES POUR UN DEVIS EXPLOITABLE',
    checklist: ['Type de carreau et code SH proposé', 'Colis, dimensions des palettes et poids brut', 'Nom de l’importateur et statut du RUC', 'Callao, Chancay ou adresse intérieure finale'],
    cta: 'Vérifier mon envoi de carreaux au Pérou',
  },
  ar: {
    eyebrow: 'حالة شحنة ثقيلة إلى بيرو · بلاط سيراميك',
    title: 'احسب طن الفوترة قبل تسعير الشحنة',
    intro: 'البلاط شحنة عالية الكثافة. توثق الصورة التحميل والتثبيت في الصين، بينما يعتمد القرار التجاري على الوزن القابل للفوترة واستعداد المستورد وتصنيف السلعة.',
    imageAlt: 'بلاط سيراميك على منصات ومثبت داخل حاوية في الصين',
    evidenceLabel: 'سجل التحميل في بلد المنشأ',
    evidenceCaption: 'تؤكد الصورة حالة التعبئة والتثبيت في موقع التحميل بالصين فقط. يجب إثبات الوجهة والحالة الجمركية بمستندات الشحنة.',
    wmTitle: 'غالبا ما يحسب الشحن البحري LCL على أساس W/M',
    wmBody: 'قارن الحجم الإجمالي بالمتر المكعب مع الوزن الإجمالي بالطن المتري. يستخدم الرقم الأعلى عادة لحساب أجرة الشحن البحري.',
    formulaLabel: 'فحص سريع',
    volume: 'الحجم الإجمالي بوحدة CBM',
    weight: 'الوزن الإجمالي كغ ÷ 1,000',
    result: 'W/M القابل للفوترة = الرقم الأعلى',
    quoteNote: 'تسري شروط عرض الحجز. قد تستخدم رسوم المنشأ والوجهة والمناولة الخاصة أساسا مختلفا.',
    gatesLabel: 'ثلاثة فحوصات قبل التحميل',
    gates: [
      { title: 'المستورد ورقم RUC', body: 'تتطلب الواردات التجارية عادة رقم RUC فعالا. وتوجد لدى SUNAT استثناءات محدودة لبعض الواردات العرضية للأفراد.' },
      { title: 'إثبات المنشأ وفق الاتفاقية', body: 'إذا استوفى البلاط قواعد منشأ اتفاقية الصين وبيرو، فقد يدعم النموذج المعتمد للشهادة أو الإقرار طلب التعرفة التفضيلية. ولا تمنح تلقائيا.' },
      { title: 'البند والضوابط', body: 'أكد التصنيف الجمركي في بيرو واللوائح الفنية السارية. وجود معيار طوعي لا يثبت إعفاء جميع أنواع البلاط من الضوابط.' },
    ],
    checklistLabel: 'بيانات مطلوبة لعرض قابل للتنفيذ',
    checklist: ['نوع البلاط ورمز HS المقترح', 'عدد الطرود وأبعاد المنصات والوزن الإجمالي', 'اسم المستورد وحالة RUC', 'Callao أو Chancay أو العنوان الداخلي النهائي'],
    cta: 'مراجعة شحنة البلاط إلى بيرو',
  },
};

export default function PeruTileFreightCase({ locale, onQuote }: { locale: string; onQuote: () => void }) {
  const lang = (locale in PERU_TILE_CASE_COPY ? locale : 'en') as Locale;
  const text = PERU_TILE_CASE_COPY[lang];

  return (
    <section id="peru-tile-case" className="scroll-mt-24 border-b border-[#31465a] bg-[#10243f] py-16 text-white md:py-24" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-4xl">
          <p className="border-l-2 border-[#e77c4b] pl-3 text-xs font-black uppercase tracking-[0.2em] text-[#f2a47f] rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-3">
            {text.eyebrow}
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-black leading-[1.06] tracking-tight sm:text-4xl md:text-5xl">
            {text.title}
          </h2>
          <p className="mt-5 max-w-3xl text-sm font-medium leading-7 text-slate-300 sm:text-base">
            {text.intro}
          </p>
        </div>

        <div className="grid overflow-hidden border border-white/15 bg-[#0b1c2c] lg:grid-cols-12">
          <figure className="flex flex-col border-b border-white/15 lg:col-span-5 lg:border-b-0 lg:border-r rtl:lg:border-l rtl:lg:border-r-0">
            <div className="relative min-h-[520px] flex-1 bg-[#07131f]">
              <img
                src={PERU_TILE_CASE_IMAGE}
                alt={text.imageAlt}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <span className="absolute left-0 top-0 bg-[#e77c4b] px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white rtl:left-auto rtl:right-0">
                {text.evidenceLabel}
              </span>
            </div>
            <figcaption className="border-t border-white/15 bg-[#10243f] px-5 py-4 text-[11px] font-medium leading-5 text-slate-300">
              {text.evidenceCaption}
            </figcaption>
          </figure>

          <div className="lg:col-span-7">
            <div className="border-b border-white/15 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <Scale className="mt-1 h-6 w-6 shrink-0 text-[#f2a47f]" aria-hidden="true" />
                <div>
                  <h3 className="text-xl font-black tracking-tight sm:text-2xl">{text.wmTitle}</h3>
                  <p className="mt-3 text-sm font-medium leading-6 text-slate-300">{text.wmBody}</p>
                </div>
              </div>

              <div className="mt-6 grid border-l border-t border-white/15 sm:grid-cols-3">
                {[text.volume, text.weight, text.result].map((item, index) => (
                  <div key={item} className={`border-b border-r border-white/15 p-4 ${index === 2 ? 'bg-[#e77c4b] text-white' : 'bg-white/[0.03]'}`}>
                    <p className={`font-mono text-[10px] font-black uppercase tracking-[0.14em] ${index === 2 ? 'text-white/75' : 'text-slate-500'}`}>
                      {index === 0 ? `${text.formulaLabel} 01` : index === 1 ? '02' : '03'}
                    </p>
                    <p className="mt-2 text-xs font-black leading-5">{item}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] font-medium leading-5 text-slate-400">{text.quoteNote}</p>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#f2a47f]">{text.gatesLabel}</p>
              <div className="mt-5 divide-y divide-white/10 border-y border-white/10">
                {text.gates.map((gate, index) => (
                  <div key={gate.title} className="grid gap-3 py-5 sm:grid-cols-[42px_1fr]">
                    <span className="font-mono text-xl font-black text-[#e77c4b]">0{index + 1}</span>
                    <div>
                      <h3 className="text-sm font-black text-white">{gate.title}</h3>
                      <p className="mt-2 text-xs font-medium leading-6 text-slate-300">{gate.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    <FileCheck2 className="h-4 w-4 text-[#f2a47f]" aria-hidden="true" /> {text.checklistLabel}
                  </p>
                  <ul className="mt-3 grid gap-x-5 gap-y-2 sm:grid-cols-2">
                    {text.checklist.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs font-bold leading-5 text-slate-200">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#f2a47f]" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={onQuote}
                  className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#e77c4b] px-5 py-3 text-xs font-black text-white transition-colors hover:bg-[#c94f2f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  <Calculator className="h-4 w-4" aria-hidden="true" />
                  {text.cta}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
          <ShieldCheck className="h-4 w-4 text-[#e77c4b]" aria-hidden="true" />
          <span>{({en:'SUNAT · CHINA-PERU FTA · CARGO DATA REVIEW',zh:'SUNAT · 中国—秘鲁自贸协定 · 货物资料审核',es:'SUNAT · TLC CHINA-PERÚ · REVISIÓN DE DATOS DE LA CARGA',ar:'SUNAT · اتفاقية التجارة الحرة بين الصين وبيرو · مراجعة بيانات الشحنة',ru:'SUNAT · СОГЛАШЕНИЕ О СВОБОДНОЙ ТОРГОВЛЕ КИТАЙ–ПЕРУ · ПРОВЕРКА ДАННЫХ О ГРУЗЕ',fr:'SUNAT · ACCORD DE LIBRE-ÉCHANGE CHINE–PÉROU · VÉRIFICATION DES DONNÉES DU FRET',pt:'SUNAT · ACORDO DE LIVRE COMÉRCIO CHINA–PERU · REVISÃO DOS DADOS DA CARGA',tr:'SUNAT · ÇİN–PERU SERBEST TİCARET ANLAŞMASI · YÜK BİLGİLERİNİN KONTROLÜ'} as Record<string,string>)[locale] || 'SUNAT'}</span>
        </div>
      </div>
    </section>
  );
}
