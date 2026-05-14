export type Language = 'en' | 'ru' | 'fr';

export const translations = {
  en: {
    nav: {
      who_we_are: 'WHO WE ARE',
      what_we_do: 'WHAT WE DO',
      why_ddnz: 'WHY CHOOSE US',
      our_facilities: 'OUR FACILITIES',
      insights: 'INSIGHTS',
      get_a_quote: 'GET A QUOTE',
    },
    hero: {
      title1: 'Global Logistics',
      title2: 'Excellence Since 1997',
      subtitle: 'Professional & Integrated Supply Chain Solutions.',
      primary_cta: 'Calculate Freight & Get Quote',
      secondary_cta: 'Download Company Deck',
      chat: 'Chat on WhatsApp',
      alibaba_cta: 'Sourcing from Alibaba? We offer integrated logistics & inspection solutions.',
      stats: {
        years: '29+',
        years_label: 'Years Excellence',
        countries: '160+',
        countries_label: 'Countries Served',
        support: '24/7',
        support_label: 'Personal Touch',
      }
    },
    services: {
      label: 'SERVICES',
      title: 'WHAT WE DO',
      subtitle: 'We provide integrated logistics solutions',
      rail: { 
        title: 'China-Europe Railway Express', 
        highlights: [
          'Licensed Customs Brokerage',
          'CIS & Europe Door-to-Door',
          'Asset-Based Cost Efficiency'
        ],
        desc: 'Our team manages complex rail documentation and cargo handling. This asset-based advantage ensures reliable door-to-door delivery with secure, consistent service.' 
      },
      warehousing: { 
        title: 'Local Warehousing & Distribution', 
        highlights: [
          'Agile Overseas Buffer Storage',
          'Efficient Cargo Consolidation',
          'Last-Mile Delivery Optimization'
        ],
        desc: 'Turn our warehouses into your hub for deconsolidation and cross-docking. We act as your flexible footprint, accelerating market delivery without long-term lease commitments.' 
      },
      freight: { 
        title: 'Global Freight (Sea, Air & Land)', 
        highlights: [
          'Licensed Customs Brokerage',
          'Direct Carrier Contracts',
          'Global Visibility & Visibility'
        ],
        desc: 'Orchestrating seamless transportation via air and sea. You gain complete supply chain visibility while we optimize routes to ensure competitive all-in rates.' 
      },
      trust: {
        title: 'Your Eyes & Ears in China',
        highlights: [
          'Factory Audit & Supplier Verification',
          'Pre-shipment Quality Inspection',
          'Alibaba/1688 Order Consolidation'
        ],
        desc: 'We bridge the trust gap. From supplier verification to on-site quality checks and consolidating multiple platform orders at our Guangzhou hub, we de-risk your entire China sourcing process.'
      }
    },
    who_we_are: {
      label: 'ABOUT US',
      title: 'WHO WE ARE',
      subtitle: 'A 29-Year Evolution: From Trade Pioneers to Specialized Industrial Logistics Experts',
      stats: {
        years: 'Years In Business',
        clients: 'Happy Clients',
        shipments: 'Shipments Completed',
        projects: 'Strategic Projects',
        desc: '"A legacy of integrity and excellence. For nearly three decades, DDNZ Global has been the trusted backbone for complex supply chains, managing over a million successful shipments with precision and care."'
      },
      heritage: { title: '29 Years of Global Heritage', desc: 'Since 1997, we evolved from pioneering trade links during China’s WTO accession to mastering global supply chains. A relentless focus on long-term reliability and adaptability.' },
      nev: { title: 'DG & New Energy Specialists', desc: 'Leading the green transition with bespoke logistics for Energy Storage Systems (ESS) and EVs. We master complex, compliance-driven Dangerous Goods (DG) global transport.' },
      infra: { title: 'Integrated Supply Chain & Trade', desc: 'Empowered by self-owned warehousing hubs and our Hong Kong financial gateway, we guarantee structural control, secure multi-currency settlements, and seamless global operations.' },
      resilience: { title: 'Unwavering Resilience & Care', desc: 'When global networks falter, we deliver. Proven during the pandemic by prioritizing critical supplies, our network is built to absorb shocks and protect your business interests.' }
    },
    why_ddnz: {
      title: 'WHY CHOOSE US',
      subtitle: 'Delivering excellence through experience and global connectivity',
      label: 'OUR STRENGTH',
      strength: 'Our Strength',
      industry: 'Industry Standard',
      c1: { title: 'End-to-End Absolute Control', desc: 'We own our warehouses, cross-border fleets, and customs brokerages. This ensures zero handoffs, absolute security, and process integrity.', vs: 'Fragmented forwarding; reliance on third-party vendors leading to risk and delays.' },
      c2: { title: 'Dedicated Project Managers', desc: 'Every client is assigned a Senior Expert. You get strategic advice, proactive problem-solving, and a 24/7 direct communication line.', vs: 'Call centers, automated ticketing, and Junior operators following scripts.' },
      c3: { title: 'Hazardous / NEV Mastery', desc: 'Certified and experienced in Class 9 DG. We routinely handle Electric Vehicles and ESS units with airtight compliance and structural securing.', vs: 'Standard cargo generalists who outsource DG compliance at a premium.' },
      edge: {
        e1: { title: 'Licensed by GACC', desc: 'Licensed customs broker' },
        e2: { title: 'Long Experience', desc: '29+ Years of Experience' },
        e3: { title: 'Dedicated Support', desc: 'Client-focused follow-up.' },
        e4: { title: 'Speed & Accuracy', desc: 'Fast, reliable execution.' },
        e5: { title: 'Strong Global Network', desc: 'Trusted international partners.' },
        e6: { title: 'Competitive Pricing', desc: 'Best value for money.' }
      }
    },
    facilities: {
      label: 'OUR FACILITIES',
      title: 'OPERATIONAL EXCELLENCE',
      subtitle: 'Where Legacy Expertise Powers Modern Infrastructure',
      guangzhou: { title: 'Guangzhou: Your Command & Control Center', tag: '1. A Strategic Hub, Owned & Mastered for 18 Years', desc: 'This is not a leased space; it’s our strategic nerve center, owned and refined over nearly two decades. Here, we exercise absolute control. Every shipment undergoes professional consolidation and rigorous, standardized quality checks, ensuring integrity from the first to the final mile.' },
      systems: { title: 'Advanced Systems for Complex Cargo', tag: '2. Engineered for Precision & Protection', desc: 'Equipped with automated sorting and a team of specialists, we handle what standard warehouses cannot. Our core expertise lies in custom, export-grade packaging solutions—most notably, precision-engineered plywood crating for high-value, sensitive machinery and project cargo, built to survive the global supply chain.' }
    },
    get_a_quote: {
      title: 'LOGISTICS TOOLS & INQUIRY',
      estimatorTitle: 'Estimator & Inquiry',
      subtitle: 'Use our professional Chargeable Weight Estimator for instant volume assessment, or submit a detailed inquiry to our senior team.',
      calcTitle: 'Chargeable Weight Estimator',
      formTitle: 'Submit RFQ',
      mode: 'Mode of Transport',
      modeSea: 'Sea',
      modeLand: 'Land',
      modeAir: 'Air',
      lane: 'Lane / Trade Route',
      sea: 'Sea Freight Lane',
      sea_opt1: 'South America / SE Asia',
      sea_opt2: 'Eastern Europe / Europe',
      land: 'Land Freight Lane',
      land_opt1: 'Central Asia Road',
      land_opt2: 'Uzbekistan/Kazakhstan Focus',
      air: 'Air Freight Lane',
      air_opt1: 'Global Express/Air',
      packageDim: 'Package Dimensions (cm)',
      quantity: 'Quantity',
      calcBtn: 'Calculate Chargeable Weight',
      totalVol: 'Total Physical Volume:',
      totalGross: 'Total Gross Weight:',
      chargeableUnits: 'Chargeable Units:',
      insight: 'DDNZ Insight:',
      insightDesc: 'chargeable weight is calculated dynamically. Note that final conversion ratios may vary based on carriers, exact routing, seasonality, and cargo type.',
      reqQuote: 'Request Firm Quote',
      fname: 'Full Name *',
      email: 'Corporate Email *',
      phone: 'Phone / WhatsApp *',
      cargo: 'Cargo Description & Value *',
      baseRate: 'Base Rate ($)',
      baseRatePlaceholder: 'Optional (Input rate per Chargeable Unit)',
      includeDG: 'Include Battery/DG (+25% Surcharge)',
      cargoCat: 'Cargo Category',
      catGeneral: 'General / Standard',
      catNev: 'NEV / Base Station',
      actualWeightLabel: 'Actual Weight (KG)',
      totalCbm: 'Total CBM',
      autoPrefix: 'Auto',
      dimInfo: 'Please use the max protrusion point for measurement.',
      orOverride: 'OR OVERRIDE CBM',
      estTotalFreight: 'Estimated Total Freight:',
      totalVolLabel: 'Total Volume:',
      chargeableUnitsLabel: 'Chargeable Units:',
      fclNote: '* FCL (Full Container Load) is quoted separately. Pricing excludes local origin/destination charges and duties.',
      formSubtitle: 'Fill out the details for a comprehensive quote and routing options.',
      industryLabel: 'Industry / Product Category',
      indNev: 'New Energy / Energy Storage Systems (ESS)',
      indFurn: 'Commercial Furniture Engineering',
      indProject: 'Project Cargo / Heavy Lift',
      indOther: 'Other (General Cargo)',
      originLabel: 'Origin Port / City',
      originPlaceholder: 'e.g., Guangzhou, Shenzhen',
      destLabel: 'Destination Port / Country',
      destPlaceholder: 'e.g., Malaysia, Saudi Arabia',
      msgPlaceholder: 'Please provide details regarding your cargo, timeline, and any special handling requirements...',
      required: 'This field is required',
      alertInput: 'Please enter dimensions/quantity or Total CBM, and Actual Weight.',
      alertSuccess: 'Thank you! Your inquiry has been prioritized. A DDNZ senior expert will contact you via email within 24 hours.',
      alertError: 'System busy. Please try again later or contact us directly via our official email for an immediate quote.',
      roadNote: 'Note: Applied Road Freight Density Ratio.',
      submit: 'Send Request',
      submitting: 'Sending...',
      classHeavy: 'Heavy Cargo (Charged by Weight)',
      classLight: 'Light/Light-bubble Cargo (Charged by Volume)',
      modeLabel: 'Mode',
      waTemplate: 'Hi DDNZ, I just used your Rate Tool. My shipment is {cbm} CBM / {weight} KG to {destination}. It is detected as {class}. Can I get a final firm quote?',
    },
    insights: {
      title: 'LOGISTICS INSIGHTS & GLOBAL TRADE UPDATES',
      subtitle: 'Stay informed with the latest trends and real-world case studies in global freight forwarding.',
      label: 'Insights',
      readMore: 'Read More',
      adviceTitle: 'Need personalized advice?',
      adviceSubtitle: 'Our experts are ready to analyze your specific logistics needs.',
      contactExpert: 'Contact Expert for Consultation',
      posts: {
        "1": {
          title: "2025 Market Trends: Managing Logistics Costs in South America",
          summary: "Explore the latest market trends, port congestion updates, and practical strategies to navigate the shipping cost fluctuations out of China to South America."
        },
        "2": {
          title: "Safety First: How DDNZ Handles NEV & Battery Shipments",
          summary: "New Energy Vehicles and Energy Storage Systems require specialized dangerous goods management. Learn how DDNZ controls risk from factory to destination."
        },
        "3": {
          title: "Efficiency Matters: A Case Study of a 15-Day Delivery to Poland",
          summary: "Discover how we utilized the China-Europe Railway Express coupled with priority dispatch to achieve a record 15-day delivery for commercial kitchen equipment to Poland."
        }
      }
    },
    partners: {
      title: 'Trusted by Global Leaders',
      subtitle: "Seamlessly Integrated with the World's Premier Carriers & Networks",
      desc: 'Our strategic alliances with top-tier shipping lines and airlines ensure that DDNZ Global (Hong Kong) provides the most competitive rates and priority space allocations for your critical cargo.'
    },
    footer: {
      slogan: '"29 Years of Logistics Excellence & Integrity. Your Strategic Partner for Specialized Supply Chain Solutions."',
      hq: 'Guangzhou HQ',
      hq_addr: 'Room 6025 - 6027, 6th Floor, Lianfu Building, No. 1-10 Qifu Road, Yuncheng Street, Baiyun District, Guangzhou, China',
      hk: 'Hong Kong Office',
      hk_addr: '5F, Sun Hung Kai Centre, 38 Russell Street, Causeway Bay, Hong Kong, China',
      hours: '24/7 Support',
      hours_desc: 'Global Operations Desk',
      cert: 'Certified',
      cert_desc: 'NVOCC / ZATCA / IATA',
      quick: 'Quick Links',
      contact: 'Contact',
      compliance: 'Compliance & Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      experts: 'Specialized NEV & SCM Experts',
      rights: '© 2024 DDNZ Global. All rights reserved.'
    }
  },
  ru: {
    nav: {
      who_we_are: 'О НАС',
      what_we_do: 'НАШИ УСЛУГИ',
      why_ddnz: 'ПОЧЕМУ МЫ?',
      our_facilities: 'НАШИ ОБЪЕКТЫ',
      insights: 'ИНФОРМАЦИЯ',
      get_a_quote: 'РАССЧИТАТЬ',
    },
    hero: {
      title1: 'Глобальная логистика',
      title2: 'Превосходство с 1997 года',
      subtitle: 'Профессиональные и комплексные решения для цепей поставок.',
      primary_cta: 'Рассчитать стоимость',
      secondary_cta: 'Скачать презентацию',
      chat: 'Связаться в WhatsApp',
      alibaba_cta: 'Закупаете на Alibaba? Мы предлагаем комплексные решения по логистике и инспекции.',
      stats: {
        years: '29+',
        years_label: 'Лет опыта',
        countries: '160+',
        countries_label: 'Стран обслуживания',
        support: '24/7',
        support_label: 'Индивидуальный подход',
      }
    },
    services: {
      label: 'УСЛУГИ',
      title: 'НАШИ УСЛУГИ',
      subtitle: 'Мы предоставляем интегрированные логистические решения',
      rail: { 
        title: 'Железнодорожный экспресс Китай-Европа', 
        highlights: [
          'Лицензированный таможенный брокер',
          'Доставка от двери до двери (СНГ и Европа)',
          'Собственные активы и ценовая эффективность'
        ],
        desc: 'Наша команда управляет сложной документацией и обработкой грузов. Собственные активы гарантируют надежную доставку «от двери до двери» и стабильный сервис.' 
      },
      warehousing: { 
        title: 'Локальное складирование и дистрибуция', 
        highlights: [
          'Гибкое буферное хранение за рубежом',
          'Эффективная консолидация грузов',
          'Оптимизация доставки «последней мили»'
        ],
        desc: 'Используйте наши склады как свой хаб. Мы обеспечиваем гибкое присутствие и ускоряем выход на рынок без долгосрочных обязательств по аренде.' 
      },
      freight: { 
        title: 'Глобальные перевозки (море, воздух и суша)', 
        highlights: [
          'Лицензированный таможенный брокер',
          'Прямые контракты с перевозчиками',
          'Глобальный контроль и отслеживание'
        ],
        desc: 'Бесперебойная транспортировка по воздуху и морю. Получите полную видимость цепочки поставок при оптимальных маршрутах и конкурентных ставках.' 
      },
      trust: {
        title: 'Ваши глаза и уши в Китае',
        highlights: [
          'Аудит заводов и проверка поставщиков',
          'Предотгрузочная инспекция качества',
          'Консолидация заказов с Alibaba/1688'
        ],
        desc: 'Мы устраняем дефицит доверия. От проверки поставщиков до инспекций качества и консолидации заказов на нашем хабе в Гуанчжоу — мы минимизируем риски вашего сорсинга в Китае.'
      }
    },
    who_we_are: {
      label: 'О НАС',
      title: 'О НАС',
      subtitle: '29 лет эволюции: от пионеров торговли до экспертов промышленной логистики',
      stats: {
        years: 'Лет в бизнесе',
        clients: 'Довольных клиентов',
        shipments: 'Выполненных отгрузок',
        projects: 'Стратегических проектов',
        desc: '"Наследие честности и превосходства. Почти три десятилетия DDNZ Global является надежной опорой для сложных цепей поставок."'
      },
      heritage: { title: '29 лет глобального наследия', desc: 'С 1997 года мы превратились из новаторов торговых связей в мастеров глобальных цепей поставок. Внимание на долгосрочную надежность.' },
      nev: { title: 'Эксперты по опасным грузам и новой энергии', desc: 'Ведущая роль в экологическом переходе: логистика для систем накопления энергии (ESS) и электромобилей.' },
      infra: { title: 'Комплексные поставки и торговля', desc: 'Собственные складские центры и финансовый хаб в Гонконге гарантируют контроль, мультивалютные расчеты и бесперебойные операции.' },
      resilience: { title: 'Устойчивость и забота', desc: 'Когда глобальные сети дают сбой, мы доставляем. Наша сеть создана для амортизации потрясений и защиты ваших интересов.' }
    },
    why_ddnz: {
      title: 'ПОЧЕМУ ВЫБИРАЮТ НАС?',
      subtitle: 'Достижение совершенства благодаря опыту и связям',
      label: 'НАШИ СИЛЬНЫЕ СТОРОНЫ',
      strength: 'Наши сильные стороны',
      industry: 'Отраслевой стандарт',
      c1: { title: 'Сквозной 100% контроль', desc: 'Мы владеем складами, автопарками и таможенными брокерами. Это обеспечивает безопасность и целостность процесса на каждом этапе.', vs: 'Фрагментированное экспедирование; зависимость от третьих лиц.' },
      c2: { title: 'Выделенные проект-менеджеры', desc: 'За каждым клиентом закреплен старший эксперт. Вы получаете стратегические советы и круглосучную прямую связь.', vs: 'Колл-центры, автоматические тикеты и младшие операторы.' },
      c3: { title: 'Мастерство в Опасных грузах (NEV)', desc: 'Сертифицированы по классу 9 DG. Мы регулярно обрабатываем электромобили и установки ESS с полным соблюдением стандартов.', vs: 'Широкопрофильные логисты, передающие опасные грузы на аутсорс.' },
      edge: {
        e1: { title: 'Лицензия GACC', desc: 'Лицензированный брокер' },
        e2: { title: 'Большой Опыт', desc: '29+ лет опыта' },
        e3: { title: 'Персональная Поддержка', desc: 'Фокус на клиента' },
        e4: { title: 'Скорость и Точность', desc: 'Надежное исполнение.' },
        e5: { title: 'Глобальная Сеть', desc: 'Надежные партнеры.' },
        e6: { title: 'Конкурентные Цены', desc: 'Лучшая цена.' }
      }
    },
    facilities: {
      label: 'НАШИ ОБЪЕКТЫ',
      title: 'ОПЕРАЦИОННОЕ ПРЕВОСХОДСТВО',
      subtitle: 'Опыт наследия обеспечивает современную инфраструктуру',
      guangzhou: { title: 'Гуанчжоу: Ваш командный центр', tag: '1. Стратегический хаб с 18-летней историей', desc: 'Это не арендованное помещение, это наш нервный центр. Здесь мы осуществляем абсолютный контроль и строгую проверку качества.' },
      systems: { title: 'Передовые системы для сложных грузов', tag: '2. Разработано для точности и защиты', desc: 'Оснащенные системами автоматической сортировки, мы обрабатываем то, что не могут обычные склады. Наш основной опыт — экспортная упаковка.' }
    },
    get_a_quote: {
      title: 'ИНСТРУМЕНТЫ ЛОГИСТИКИ И ЗАПРОСЫ',
      estimatorTitle: 'Калькулятор и запрос',
      subtitle: 'Используйте наш профессиональный калькулятор для оценки оплачиваемого веса.',
      calcTitle: 'Оценка оплачиваемого веса',
      formTitle: 'Отправить запрос (RFQ)',
      mode: 'Вид транспорта',
      modeSea: 'МОРЕ',
      modeLand: 'СУША',
      modeAir: 'АВИА',
      lane: 'Маршрут',
      sea: 'Морские перевозки',
      sea_opt1: 'Южная Америка / Юго-Восточная Азия',
      sea_opt2: 'Восточная Европа / Европа',
      land: 'Автоперевозки',
      land_opt1: 'Центральная Азия',
      land_opt2: 'Фокус: Узбекистан/Казахстан',
      air: 'Авиаперевозки',
      air_opt1: 'Глобальные экспресс/авиа',
      packageDim: 'Габариты упаковки (см)',
      quantity: 'Кол-во',
      calcBtn: 'Рассчитать вес',
      totalVol: 'Общий объем:',
      totalGross: 'Вес брутто:',
      chargeableUnits: 'Оплачиваемый вес:',
      insight: 'Аналитика DDNZ:',
      insightDesc: 'вес рассчитывается динамически. Коэффициенты могут варьироваться в зависимости от перевозчиков.',
      reqQuote: 'Запросить точную квоту',
      fname: 'Полное имя *',
      email: 'Corporate Email *',
      phone: 'Телефон / WhatsApp *',
      cargo: 'Описание груза *',
      baseRate: 'Базовая ставка ($)',
      baseRatePlaceholder: 'Опционально (введите ставку за единицу)',
      includeDG: 'Опасный груз/Батареи (+25%)',
      cargoCat: 'Категория груза',
      catGeneral: 'Генеральный / Стандартный',
      catNev: 'NEV / Базовая станция',
      actualWeightLabel: 'Вес брутто (кг)',
      totalCbm: 'Всего CBM',
      autoPrefix: 'Авто',
      dimInfo: 'Пожалуйста, используйте максимальную точку выступа для замера.',
      orOverride: 'ИЛИ ВВЕДИТЕ CBM ВРУЧНУЮ',
      estTotalFreight: 'Ориентировочная стоимость фрахта:',
      totalVolLabel: 'Общий объем:',
      chargeableUnitsLabel: 'Оплачиваемый вес:',
      fclNote: '* FCL (полная загрузка контейнера) котируется отдельно. Цены не включают локальные сборы и пошлины.',
      formSubtitle: 'Заполните данные для получения подробного расчета и вариантов маршрута.',
      industryLabel: 'Отрасль / Категория продукта',
      indNev: 'Новая энергия / Системы хранения энергии (ESS)',
      indFurn: 'Коммерческая мебель / Проектирование',
      indProject: 'Проектные грузы / Тяжеловесы',
      indOther: 'Другое (Генеральный груз)',
      originLabel: 'Порт отправления / Город',
      originPlaceholder: 'напр., Гуанчжоу, Шэньчжэнь',
      destLabel: 'Порт назначения / Страна',
      destPlaceholder: 'напр., Казахстан, Узбекистан',
      msgPlaceholder: 'Пожалуйста, предоставьте подробную информацию о вашем грузе, сроках и особых требованиях к обработке...',
      required: 'Это поле обязательно',
      alertInput: 'Пожалуйста, введите размеры/количество или общий объем CBM и фактический вес.',
      alertSuccess: 'Спасибо! Ваш запрос приоритизирован. Старший эксперт DDNZ свяжется с вами по электронной почте в течение 24 часов.',
      alertError: 'Система занята. Пожалуйста, попробуйте позже или свяжитесь с нами напрямую по электронной почте.',
      roadNote: 'Примечание: Применен коэффициент плотности для автоперевозок.',
      submit: 'Отправить',
      submitting: 'Отправка...',
      classHeavy: 'Тяжелый груз (оплата по весу)',
      classLight: 'Объемный груз (оплата по объему)',
      modeLabel: 'Режим',
      waTemplate: 'Здравствуйте DDNZ, я только что воспользовался вашим калькулятором. Мой груз: {cbm} CBM / {weight} кг в {destination}. Определен как {class}. Можно ли получить окончательную квоту?',
    },
    insights: {
      title: 'АНАЛИТИКА ЛОГИСТИКИ',
      subtitle: 'Будьте в курсе последних тенденций и реальных примеров.',
      label: 'Инсайты',
      readMore: 'Читать далее',
      adviceTitle: 'Нужен персональный совет?',
      adviceSubtitle: 'Наши эксперты готовы проанализировать ваши конкретные логистические потребности.',
      contactExpert: 'Связаться с экспертом',
      posts: {
        "1": {
          title: "Тренды рынка 2025: Управление логистическими затратами в Южной Америке",
          summary: "Изучите последние тенденции рынка, новости о заторах в портах и практические стратегии для навигации по колебаниям стоимости доставки из Китая в Южную Америку."
        },
        "2": {
          title: "Безопасность прежде всего: Как DDNZ обрабатывает поставки NEV и аккумуляторов",
          summary: "Транспортные средства на новых источниках энергии и системы хранения энергии требуют специализированного управления опасными грузами. Узнайте, как DDNZ контролирует риски."
        },
        "3": {
          title: "Эффективность имеет значение: Доставка в Польшу за 15 дней",
          summary: "Узнайте, как мы использовали железнодорожный экспресс Китай-Европа в сочетании с приоритетной отправкой для достижения рекордно быстрой доставки оборудования в Польшу."
        }
      }
    },
    partners: {
      title: 'Нам доверяют мировые лидеры',
      subtitle: 'Бесшовная интеграция с ведущими мировыми перевозчиками и сетями',
      desc: 'Наши стратегические альянсы с первоклассными судоходными и авиалиниями гарантируют, что DDNZ Global предоставляет наиболее конкурентоспособные ставки и приоритетное выделение места для вашего важного груза.'
    },
    footer: {
      slogan: '"29 лет превосходства и честности в логистике. Ваш стратегический партнер."',
      hq: 'Штаб-квартира в Гуанчжоу',
      hq_addr: 'Офис 6025 - 6027, 6-й этаж, здание Lianfu, № 1-10 Qifu Road, улица Yuncheng, район Baiyun, Гуанчжоу, Китай',
      hk: 'Гонконгский офис',
      hk_addr: '5F, Центр Sun Hung Kai, 38 Russell Street, Козуэй-Бей, Гонконг, Китай',
      hours: 'Поддержка 24/7',
      hours_desc: 'Операционный отдел',
      cert: 'Сертифицировано',
      cert_desc: 'NVOCC / ZATCA / IATA',
      quick: 'Быстрые ссылки',
      contact: 'Контакты',
      compliance: 'Соответствие и право',
      privacy: 'Политика конфиденциальности',
      terms: 'Условия использования',
      experts: 'Специалисты по NEV и SCM',
      rights: '© 2024 DDNZ Global. Все права защищены.'
    }
  },
  fr: {
    nav: {
      who_we_are: 'QUI SOMMES-NOUS',
      what_we_do: 'NOS SERVICES',
      why_ddnz: 'POURQUOI NOUS ?',
      our_facilities: 'NOS INFRASTRUCTURES',
      insights: 'ACTUALITÉS',
      get_a_quote: 'DEVIS',
    },
    hero: {
      title1: "L'Excellence en Logistique",
      title2: 'Mondiale Depuis 1997',
      subtitle: "Solutions de chaîne d'approvisionnement professionnelles et intégrées.",
      primary_cta: 'Calculer le fret et devis',
      secondary_cta: 'Télécharger la présentation',
      chat: 'Discuter sur WhatsApp',
      alibaba_cta: 'Vous approvisionnez-vous sur Alibaba ? Nous offrons des solutions logistiques et d\'inspection intégrées.',
      stats: {
        years: '29+',
        years_label: "Années d'excellence",
        countries: '160+',
        countries_label: 'Pays desservis',
        support: '24/7',
        support_label: 'Touche personnelle',
      }
    },
    services: {
      label: 'SERVICES',
      title: 'NOS SERVICES',
      subtitle: 'Nous fournissons des solutions logistiques intégrées',
      rail: { 
        title: 'Express Ferroviaire Chine-Europe', 
        highlights: [
          'Courtage en douane agréé',
          'Porte-à-porte CEI & Europe',
          'Efficacité des coûts basée sur les actifs'
        ],
        desc: 'Notre équipe gère la documentation et la manutention. Cet avantage basé sur nos actifs assure une livraison porte-à-porte fiable et un service sécurisé.' 
      },
      warehousing: { 
        title: 'Entreposage Local & Distribution', 
        highlights: [
          'Stockage tampon agile à l\'étranger',
          'Consolidation efficace du fret',
          'Optimisation de la livraison du dernier kilomètre'
        ],
        desc: 'Utilisez nos entrepôts comme votre hub de dégroupage. Nous agissons comme votre empreinte flexible, accélérant la livraison sans engagements à long terme.' 
      },
      freight: { 
        title: 'Global Freight (Sea, Air & Land)', 
        highlights: [
          'Courtage en douane agréé',
          'Contrats directs transporteurs',
          'Visibilité mondiale et suivi'
        ],
        desc: 'Transport de bout en bout via air et mer. Bénéficiez d\'une visibilité complète de la chaîne d\'approvisionnement avec des itinéraires optimisés et des tarifs compétitifs.' 
      },
      trust: {
        title: 'Vos Yeux & Oreilles en Chine',
        highlights: [
          'Audit d\'usine & Vérification fournisseur',
          'Inspection qualité avant expédition',
          'Consolidation de commandes Alibaba/1688'
        ],
        desc: 'Nous comblons le fossé de la confiance. De la vérification des fournisseurs aux contrôles qualité et à la consolidation de commandes sur notre hub de Guangzhou, nous sécurisons votre sourcing en Chine.'
      }
    },
    who_we_are: {
      label: 'À PROPOS',
      title: 'QUI SOMMES-NOUS',
      subtitle: "29 ans d'évolution : des pionniers du commerce aux experts en logistique",
      stats: {
        years: "Années d'activité",
        clients: 'Clients Satisfaits',
        shipments: 'Expéditions Réalisées',
        projects: 'Projets Stratégiques',
        desc: '"Un héritage d\'intégrité et d\'excellence. Depuis près de trois décennies, DDNZ Global est l\'épine dorsale de confiance des chaînes logistiques complexes."'
      },
      heritage: { title: "29 ans d'héritage mondial", desc: "Depuis 1997, nous sommes passés de pionniers du commerce à maîtres des chaînes d'approvisionnement mondiales." },
      nev: { title: 'Spécialistes DG & Nouvelles Énergies', desc: "A la pointe de la transition verte avec des solutions d'entreposage d'énergie et logistique de véhicules électriques." },
      infra: { title: "Chaîne d'Approvisionnement Intégrée", desc: 'Forts de nos propres entrepôts et de notre passerelle financière à Hong Kong, nous garantissons un contrôle strict.' },
      resilience: { title: 'Résilience Inébranlable', desc: "Quand les réseaux mondiaux s'effondrent, nous livrons. Conçu pour absorber les chocs et protéger vos intérêts." }
    },
    why_ddnz: {
      title: 'POURQUOI NOUS CHOISIR ?',
      subtitle: 'Livrer l\'excellence grâce à l\'expérience et la connectivité',
      label: 'NOTRE FORCE',
      strength: 'Notre Force',
      industry: 'Standard de l\'Industrie',
      c1: { title: 'Contrôle Absolu de Bout en Bout', desc: 'Nous possédons nos entrepôts et flottes. Cela assure zéro transfert non géré, une sécurité absolue.', vs: 'Expédition fragmentée ; dépendance aux sous-traitants et retards.' },
      c2: { title: 'Chefs de Projet Dédiés', desc: 'Chaque client se voit assigner un Expert Senior. Conseils stratégiques et ligne directe 24/7.', vs: "Centres d'appels, billets automatisés, opérateurs juniors." },
      c3: { title: 'Maîtrise Dangereux / NEV', desc: 'Certifiés Classe 9 DG. Nous manipulons quotidiennement des véhicules électriques et systèmes ESS en totale conformité.', vs: 'Généralistes qui sous-traitent la conformité DG.' },
      edge: {
        e1: { title: 'Agréé par GACC', desc: 'Courtier en douane agréé' },
        e2: { title: 'Longue Expérience', desc: '+29 Ans d\'Expérience' },
        e3: { title: 'Support Dédié', desc: 'Suivi axé sur le client.' },
        e4: { title: 'Vitesse & Précision', desc: 'Exécution rapide.' },
        e5: { title: 'Réseau Mondial', desc: 'Partenaires de confiance.' },
        e6: { title: 'Prix Compétitifs', desc: 'Meilleur rapport qualité-prix.' }
      }
    },
    facilities: {
      label: 'NOS INFRASTRUCTURES',
      title: 'EXCELLENCE OPÉRATIONNELLE',
      subtitle: "L'expertise patrimoniale au service de l'infrastructure moderne",
      guangzhou: { title: 'Guangzhou : Votre Centre de Contrôle', tag: '1. Hub Stratégique Détenu depuis 18 ans', desc: "Ce n'est pas un espace loué. C'est notre centre vital, un contrôle absolu." },
      systems: { title: 'Systèmes Avancés de Fret', tag: '2. Ingénierie de Précision et Protection', desc: "Équipés de tris automatiques et spécialisés dans les solutions d'emballage pour l'export." }
    },
    get_a_quote: {
      title: 'OUTILS LOGISTIQUES ET DEMANDES',
      estimatorTitle: 'Estimateur & Demandes',
      subtitle: 'Utilisez notre estimateur de poids facturable ou envoyez une demande à notre équipe senior.',
      calcTitle: 'Estimateur de Poids',
      formTitle: 'Envoyer une Demande (RFQ)',
      mode: 'Mode de Transport',
      modeSea: 'MER',
      modeLand: 'ROUTE',
      modeAir: 'AIR',
      lane: 'Route Commerciale',
      sea: 'Fret Maritime',
      sea_opt1: 'Amérique du Sud / Asie du Sud-Est',
      sea_opt2: "Europe de l'Est / Europe",
      land: 'Fret Routier',
      land_opt1: 'Route Asie Centrale',
      land_opt2: 'Focus Ouzbékistan/Kazakhstan',
      air: 'Fret Aérien',
      air_opt1: 'Express / Air Global',
      packageDim: 'Dimensions (cm)',
      quantity: 'Quantité',
      calcBtn: 'Calculer le Poids',
      totalVol: 'Volume Total:',
      totalGross: 'Poids Brut:',
      chargeableUnits: 'Unités Facturables:',
      insight: 'Aperçu DDNZ:',
      insightDesc: 'le ratio de conversion final peut varier selon les transporteurs et le fret.',
      reqQuote: 'Demander un Devis',
      fname: 'Nom Complet *',
      email: 'Email Professionnel *',
      phone: 'Téléphone *',
      cargo: 'Cargaison *',
      baseRate: 'Taux Base ($)',
      baseRatePlaceholder: 'Optionnel (Saisissez le taux par unité facturable)',
      includeDG: 'Inclure Batterie/DG (+25%)',
      cargoCat: 'Catégorie de cargaison',
      catGeneral: 'Général / Standard',
      catNev: 'NEV / Station de base',
      actualWeightLabel: 'Poids brut (KG)',
      totalCbm: 'CBM Total',
      autoPrefix: 'Auto',
      dimInfo: 'Veuillez utiliser le point de saillie maximal pour la mesure.',
      orOverride: 'OU SAISIR CBM MANUELLEMENT',
      estTotalFreight: 'Fret total estimé :',
      totalVolLabel: 'Volume total :',
      chargeableUnitsLabel: 'Unités facturables :',
      fclNote: '* Le FCL (chargement complet du conteneur) est coté séparément. Les prix excluent les frais locaux et les droits de douane.',
      formSubtitle: 'Remplissez les détails pour un devis complet et des options d\'itinéraire.',
      industryLabel: 'Industrie / Catégorie de produit',
      indNev: 'Nouvelle énergie / Systèmes de stockage d\'énergie (ESS)',
      indFurn: 'Ingénierie de mobilier commercial',
      indProject: 'Cargaison de projet / Levage lourd',
      indOther: 'Autre (Cargaison générale)',
      originLabel: 'Port d\'origine / Ville',
      originPlaceholder: 'ex: Guangzhou, Shenzhen',
      destLabel: 'Port de destination / Pays',
      destPlaceholder: 'ex: France, Belgique',
      msgPlaceholder: 'Veuillez fournir des détails sur votre cargaison, vos délais et toute exigence particulière...',
      required: 'Ce champ est obligatoire',
      alertInput: 'Veuillez saisir les dimensions/quantité ou le CBM total, et le poids réel.',
      alertSuccess: 'Merci ! Votre demande a été priorisée. Un expert senior DDNZ vous contactera par e-mail sous 24 heures.',
      alertError: 'Système occupé. Veuillez réessayer plus tard ou nous contacter directement par e-mail.',
      roadNote: 'Note : Ratio de densité du fret routier appliqué.',
      submit: 'Envoyer',
      submitting: 'Envoi...',
      classHeavy: 'Cargaison Lourde (facturée au poids)',
      classLight: 'Cargaison Volumineuse (facturée au volume)',
      modeLabel: 'Mode',
      waTemplate: 'Bonjour DDNZ, je viens d\'utiliser votre outil de calcul. Mon expédition : {cbm} CBM / {weight} KG vers {destination}. Détecté comme {class}. Puis-je obtenir un devis final ?',
    },
    insights: {
      title: 'ACTUALITÉS LOGISTIQUES',
      subtitle: 'Restez informé des dernières tendances.',
      label: 'Actualités',
      readMore: 'Lire la suite',
      adviceTitle: 'Besoin d\'un conseil personnalisé ?',
      adviceSubtitle: 'Nos experts sont prêts à analyser vos besoins logistiques spécifiques.',
      contactExpert: 'Contacter un expert',
      posts: {
        "1": {
          title: "Tendances 2025 : Gérer les coûts logistiques en Amérique du Sud",
          summary: "Explorez les tendances du marché et les stratégies pour naviguer dans les fluctuations des coûts d'expédition entre la Chine et l'Amérique du Sud."
        },
        "2": {
          title: "La sécurité d'abord : Comment DDNZ gère les expéditions de NEV et de batteries",
          summary: "Les véhicules à énergie nouvelle et les systèmes de stockage nécessitent une gestion spécialisée des marchandises dangereuses."
        },
        "3": {
          title: "Efficacité : Étude de cas sur une livraison en 15 jours en Pologne",
          summary: "Découvrez comment nous avons utilisé le China-Europe Railway Express pour atteindre une livraison record de 15 jours en Pologne."
        }
      }
    },
    partners: {
      title: 'Approuvé par les leaders mondiaux',
      subtitle: 'Intégré de manière transparente aux principaux transporteurs et réseaux mondiaux',
      desc: 'Nos alliances stratégiques avec les meilleures compagnies maritimes et aériennes garantissent que DDNZ Global offre les tarifs les plus compétitifs et des allocations d\'espace prioritaires pour votre cargaison critique.'
    },
    footer: {
      slogan: '"29 ans d\'excellence et d\'intégrité logistique. Votre partenaire stratégique."',
      hq: 'Siège de Guangzhou',
      hq_addr: 'Bureau 6025 - 6027, 6e étage, bâtiment Lianfu, n° 1-10 Qifu Road, rue Yuncheng, district de Baiyun, Guangzhou, Chine',
      hk: 'Bureau de Hong Kong',
      hk_addr: '5F, centre Sun Hung Kai, 38 Russell Street, Causeway Bay, Hong Kong, Chine',
      hours: 'Support 24/7',
      hours_desc: 'Opérations mondiales',
      cert: 'Certifié',
      cert_desc: 'NVOCC / ZATCA / IATA',
      quick: 'Liens rapides',
      contact: 'Contact',
      compliance: 'Conformité et légal',
      privacy: 'Politique de confidentialité',
      terms: 'Conditions d\'utilisation',
      experts: 'Experts spécialisés NEV & SCM',
      rights: '© 2024 DDNZ Global. Tous droits réservés.'
    }
  }
};
