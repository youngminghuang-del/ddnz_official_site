export type Language = 'en' | 'zh' | 'ru' | 'fr';

export const translations = {
  en: {
    nav: {
      who_we_are: 'WHO WE ARE',
      what_we_do: 'WHAT WE DO',
      why_ddnz: 'WHY CHOOSE US',
      services: 'SERVICES',
      services_sea: 'Sea freight',
      services_air: 'Air freight',
      services_fba: 'Amazon FBA',
      services_warehouse: 'Warehouse services',
      insights: 'INSIGHTS',
      get_a_quote: 'GET A QUOTE',
    },
    hero: {
      title1: 'China Freight Forwarder',
      title2: 'Global Logistics Solutions',
      subtitle: 'Since 1997 • Sea Freight • Air Freight • Amazon FBA • Warehouse Services — Professional & Integrated Supply Chain Solutions.',
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
      sea: {
        title: 'Sea Freight Solutions',
        highlights: [
          'Licensed Customs Brokerage',
          'FCL & LCL Consolidation',
          'Direct Carrier Contracts'
        ],
        desc: 'Reliable ocean freight forwarding with predictable schedules and cost-effective door-to-door (DDP/DAP) options worldwide.'
      },
      air: {
        title: 'Air Freight Solutions',
        highlights: [
          'Time-Critical Air Cargo',
          'Global Airport Coverage',
          'Express & Economy Options'
        ],
        desc: 'Fast and flexible air cargo transportation tailored to meet your strict deadlines with seamless customs handling.'
      },
      fba: {
        title: 'Amazon FBA Logistics',
        highlights: [
          'FNSKU Labeling & Prep',
          'Appointment Booking Included',
          'Direct Warehouse Delivery'
        ],
        desc: 'Comprehensive Amazon FBA freight services from Chinese suppliers straight to global fulfillment centers with full compliance.'
      },
      warehouse: {
        title: 'Warehouse & Fulfillment',
        highlights: [
          '100,000+ sq ft Secure Facility',
          'WMS Real-time Inventory',
          'Kitting & Cross-Docking'
        ],
        desc: 'Modern 3PL warehousing and smart order fulfillment solutions to streamline and optimize your local supply chain storage.'
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
      title: 'SUBMIT RFQ',
      estimatorTitle: 'Submit RFQ',
      subtitle: 'Submit a detailed inquiry and our senior team will build your custom logistics plan within 24 hours.',
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
      hubLabel: 'DDNZ GLOBAL INSIGHTS',
      hubTitle: 'Industry Insights & News',
      hubSubtitle: 'Unlock local guidelines, shipping timelines, regulatory changes, and first-hand supply chain intelligence direct from Asian hub authorities.',
      showAll: '🏷️ Show All Categories',
      deep_dive_read: 'Deep Dive Read',
      read_time: '4 Min',
      no_articles: 'No articles found',
      no_articles_desc: 'No items matching this category are published yet.',
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
      what_we_do: 'ЧЕМ МЫ ЗАНИМАЕМСЯ',
      why_ddnz: 'ПОЧЕМУ ВЫБИРАЮТ НАС',
      services: 'УСЛУГИ',
      services_sea: 'Морские перевозки',
      services_air: 'Авиаперевозки',
      services_fba: 'Амазон FBA',
      services_warehouse: 'Складские услуги',
      insights: 'РЕСУРСЫ',
      get_a_quote: 'ПОЛУЧИТЬ РАСЧЕТ',
    },
    hero: {
      title1: 'Грузоперевозки из Китая',
      title2: 'Глобальные логистические решения',
      subtitle: 'С 1997 года • Морские перевозки • Авиаперевозки • Амазон FBA • Складские услуги — Профессиональные и интегрированные цепочки поставок.',
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
      sea: {
        title: 'Морские перевозки',
        highlights: [
          'Лицензированное таможенное оформление',
          'Консолидация FCL и LCL грузов',
          'Прямые контракты с судовладельцами'
        ],
        desc: 'Надежное экспедирование океанских грузов с предсказуемым расписанием и выгодной доставкой «до двери» (DDP/DAP).'
      },
      air: {
        title: 'Авиаперевозки',
        highlights: [
          'Срочные авиаперевозки грузов',
          'Глобальный охват ведущих аэропортов',
          'Экспресс и экономичные тарифы'
        ],
        desc: 'Быстрая и гибкая транспортировка авиагрузов под ваши жесткие сроки с беспрепятственным таможенным оформлением.'
      },
      fba: {
        title: 'Амазон FBA',
        highlights: [
          'Маркировка FNSKU и подготовка',
          'Бронирование слотов доставки включено',
          'Прямая доставка на склады Amazon'
        ],
        desc: 'Комплексные услуги доставки Amazon FBA напрямую от китайских поставщиков на международные склады с полной комплаенс-поддержкой.'
      },
      warehouse: {
        title: 'Складские услуги',
        highlights: [
          'Безопасный склад более 100 000 кв. футов',
          'WMS-система складского учета в реальном времени',
          'Комплектация заказов и кросс-докинг'
        ],
        desc: 'Современные решения 3PL-складирования и смарт-исполнения заказов для оптимизации локального хранения в цепи поставок.'
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
      title: 'ОТПРАВИТЬ ЗАПРОС (RFQ)',
      estimatorTitle: 'Отправить запрос (RFQ)',
      subtitle: 'Отправьте подробный запрос, и наша команда подготовит индивидуальный логистический план в течение 24 часов.',
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
      hubLabel: 'ГЛОБАЛЬНАЯ АНАЛИТИКА DDNZ',
      hubTitle: 'Отраслевая аналитика и новости',
      hubSubtitle: 'Получите доступ к правилам, срокам доставки, изменениям в регулировании и оперативной информации от азиатских ведомств.',
      showAll: '🏷️ Показать все темы',
      deep_dive_read: 'Подробный обзор',
      read_time: '4 мин',
      no_articles: 'Материалы не найдены',
      no_articles_desc: 'Нет опубликованных материалов по выбранной теме.',
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
      who_we_are: 'À PROPOS',
      what_we_do: 'CE QUE NOUS FAISONS',
      why_ddnz: 'POURQUOI NOUS CHOISIR',
      services: 'SERVICES',
      services_sea: 'Fret maritime',
      services_air: 'Fret aérien',
      services_fba: 'Amazon FBA',
      services_warehouse: 'Services d\'entreposage',
      insights: 'INSIGHTS',
      get_a_quote: 'OBTENIR UN DEVIS',
    },
    hero: {
      title1: 'Transitaire en Chine',
      title2: 'Solutions Logistiques Globales',
      subtitle: "Depuis 1997 • Fret maritime • Fret aérien • Amazon FBA • Services d'entreposage — Solutions de chaîne d'approvisionnement professionnelles et intégrées.",
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
      sea: {
        title: 'Solutions de Fret Maritime',
        highlights: [
          "Dédouanement agréé par l'État",
          'Consolidation FCL (complet) & LCL (groupage)',
          'Contrats directs avec les compagnies maritimes'
        ],
        desc: 'Expédition océanique fiable à calendrier fixe avec options de livraison porte-à-porte (DDP/DAP) compétitives.'
      },
      air: {
        title: 'Solutions de Fret Aérien',
        highlights: [
          'Transport aérien urgent sous délais serrés',
          'Couverture mondiale de tous les grands aéroports',
          "Options d'expédition Express ou Économique"
        ],
        desc: 'Fret aérien rapide et flexible adapté à vos impératifs de livraison urgents avec gestion douanière intégrée.'
      },
      fba: {
        title: 'Logistique Amazon FBA',
        highlights: [
          'Étiquetage FNSKU & préparation réglementaire',
          "Prise de rendez-vous d'entrepôt Amazon incluse",
          'Livraison directe sans intermédiaire aux centres FBA'
        ],
        desc: 'Services de fret Amazon FBA de bout en bout, connectant vos fournisseurs chinois aux centres de distribution mondiaux.'
      },
      warehouse: {
        title: 'Entreposage & Distribution',
        highlights: [
          'Entrepôts hautement sécurisés de +100 000 pi²',
          'Gestion de stock WMS en temps réel',
          'Tri, emballage et cross-docking agile'
        ],
        desc: 'Solutions d’entreposage 3PL modernes et de préparation de commandes intelligentes pour optimiser votre chaîne logistique locale.'
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
      title: 'ENVOYER UNE DEMANDE (RFQ)',
      estimatorTitle: 'Envoyer une demande (RFQ)',
      subtitle: 'Envoyez-nous une demande détaillée et notre équipe senior élaborera votre plan logistique sur mesure sous 24 heures.',
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
      hubLabel: 'ACTUALITÉS GLOBALES DDNZ',
      hubTitle: "Actualités et Analyses de l'Industrie",
      hubSubtitle: "Accédez aux directives locales, aux délais d'expédition, aux changements réglementaires et aux informations de première main sur la chaîne d'approvisionnement.",
      showAll: '🏷️ Afficher toutes les catégories',
      deep_dive_read: 'Lecture Approfondie',
      read_time: '4 Min',
      no_articles: 'Aucun article trouvé',
      no_articles_desc: 'Aucun article correspondant n\'est encore publié.',
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
  },
  zh: {
    nav: {
      who_we_are: '关于我们',
      what_we_do: '核心业务',
      why_ddnz: '为什么选择我们',
      services: '服务项目',
      services_sea: '海运服务',
      services_air: '空运服务',
      services_fba: '亚马逊 FBA',
      services_warehouse: '仓储服务',
      insights: '行业洞察',
      get_a_quote: '获取报价',
    },
    hero: {
      title1: '中国货运代理',
      title2: '全球综合物流解决方案',
      subtitle: '自1997年以来 • 海运服务 • 空运服务 • 亚马逊FBA • 仓储服务 —— 专业高效的一站式综合供应链解决方案。',
      primary_cta: '计算运费并获取报价',
      secondary_cta: '下载公司手册',
      chat: 'WhatsApp咨询',
      alibaba_cta: '从阿里巴巴采购？我们提供一站式物流与验货解决方案。',
      stats: {
        years: '29+',
        years_label: '载卓越表现',
        countries: '160+',
        countries_label: '覆盖国家地区',
        support: '24/7',
        support_label: '贴心专业支持',
      }
    },
    services: {
      label: '服务',
      title: '我们的业务',
      subtitle: '我们提供集成的优质供应链及物流方案',
      sea: {
        title: '海运货运方案',
        highlights: [
          '专业持牌清关报关',
          'FCL整柜与LCL拼箱集运',
          '船东直签特惠合约价格'
        ],
        desc: '可靠的全球海洋货运代理，班期稳定且提供极具性价比的全球双清到门（DDP/DAP）专线服务。'
      },
      air: {
        title: '空运物流方案',
        highlights: [
          '高时效紧急空运方案',
          '全球各大机场航线覆盖',
          '快捷与经济型自选舱位'
        ],
        desc: '快速灵活的空中货运服务，专为满足您严苛的交货时效而定制，配合无缝清关高效派送。'
      },
      fba: {
        title: '亚马逊 FBA 头程',
        highlights: [
          'FNSKU贴标与专业贴牌',
          '亚马逊仓预约入库服务',
          '指向亚马逊运送直送到仓'
        ],
        desc: '全方位跨境电商亚马逊FBA头程服务，从中国供应商到全球运营中心全程严密合规护航。'
      },
      warehouse: {
        title: '仓储与订单履约',
        highlights: [
          '十万平方英尺高规安防仓库',
          'WMS系统云端实时库存管理',
          '拼箱集拼与交叉转运作业'
        ],
        desc: '现代化第三方物流（3PL）仓储与智能订单履约方案，无缝简化并优化您的本地供应链存储。'
      }
    },
    who_we_are: {
      label: '关于我们',
      title: '我们是谁',
      subtitle: '29年坚守：从商贸先驱演进至专业工业物流与危险品专家',
      stats: {
        years: '年行业深耕储备',
        clients: '全球活跃老客户',
        shipments: '已妥投国际货载',
        projects: '战略承运项目案例',
        desc: '“近三十年的信任重托。DDNZ Global 是复杂跨国供应链的坚强后盾，以严谨细节成就百万次货运的安全嘱托。”'
      },
      heritage: { title: '29载全球资源传承', desc: '自1997年起，我们见证并协助多国企业共谱商贸篇章，深耕全球可靠而弹性的承运网络。' },
      nev: { title: '新能源与九类危险品行家', desc: '把握绿色转型，提供储能系统(ESS)及电动汽车(EV)的整套合规和高标准包装与出运保障。' },
      infra: { title: '实体自营仓储与财务安全', desc: '在广州和香港自营中转枢纽和分拨仓，结合香港合规财务通道，全方位防范供应链中断及结算风险。' },
      resilience: { title: '长红交付与温情关怀', desc: '在危机时期，我们全力开辟紧急通道包机包列，以强大的物流底气为客户撑起安全屏障。' }
    },
    why_ddnz: {
      title: '为什么选择我们',
      subtitle: '集深厚经验、自营实体和全球清关网路于一体的放心之选',
      label: '我们的优势',
      strength: 'DDNZ 的绝对优势',
      industry: '相比同行劣势',
      c1: { title: '端到端自主掌控不外包', desc: '我们自营仓库、车队和报关中转行，保障流程严密配合，杜绝中间流失。', vs: '拼凑型货代拼箱，极度依赖多层外包导致信息延误和丢货风险。' },
      c2: { title: '资深项目专家对接服务', desc: '为每个重要客户配有专家管家，即时跟进特需，随时应对突发。', vs: '全自动化工单，机械式冷漠客服或由不成熟经验新人套用模板。' },
      c3: { title: '成熟DG危险品及新能源操作', desc: '常态化承揽纯电池、储能系统和EV整车，严密固定和九类清关无忧。', vs: '普通货物快件商，缺乏九类危险品经验，被临时拒绝或罚没。' },
      edge: {
        e1: { title: '海关AEO权威资质', desc: '持牌卓越报关' },
        e2: { title: '近30年积淀', desc: '29+ 年全球物流资深经验' },
        e3: { title: '一对一管家式跟进', desc: '主动汇报动态与答疑' },
        e4: { title: '高效与精准交付', desc: '承诺严密，有诺必履' },
        e5: { title: '成熟国际合作网路', desc: '全球百余港口支持' },
        e6: { title: '极致性价比约价', desc: '直签各大船东与航空公司' }
      }
    },
    facilities: {
      label: '我们的自营实体',
      title: '实打实的卓越物流保障',
      subtitle: '以自置实体资产与资深包装，超越轻资产货代拼凑的局限',
      guangzhou: { title: '广州仓：您的核心主控集货基地', tag: '1. 18年精心运营，绝非短期租赁仓', desc: '本仓为公司成熟自营核心，实现百万货品集货合装。全流程专人质检与标准化堆存，铸就您的安全防线。' },
      systems: { title: '精密工业件定制木箱与包装支持', tag: '2. 专注守护高价值与敏感货品', desc: '配备定制卡板、高承重定制胶合板木箱，精细包装重型机械及光学敏感仪器，稳妥应对越洋颠簸。' }
    },
    get_a_quote: {
      title: '提交正式 RFQ',
      estimatorTitle: '提交正式 RFQ',
      subtitle: '提交一份详细的需求表单，我们的资深物流专家将在24小时内为您量身定制最省钱的物流路线方案。',
      calcTitle: '计费重量快速测算',
      formTitle: '提交 RFQ 表单',
      mode: '推荐运输方式',
      modeSea: '海运 FCL/LCL',
      modeLand: '陆运',
      modeAir: '空运',
      lane: '拟运线路/贸易路线',
      sea: '海运优势航线',
      sea_opt1: '南美 / 东南亚大包',
      sea_opt2: '东欧 / 欧洲全境',
      land: '陆运优势航线',
      land_opt1: '中亚卡铁联运',
      land_opt2: '乌兹别克斯坦/哈萨克斯坦专线',
      air: '空运优势服务',
      air_opt1: '全球高时效空专线',
      packageDim: '单件外包装尺寸 (cm)',
      quantity: '件数',
      calcBtn: '速算计费重量',
      totalVol: '预估总体积:',
      totalGross: '预估总毛重:',
      chargeableUnits: '计费重量 (KG):',
      insight: '测算助手意见:',
      insightDesc: '计费重量按承运人规则多取大值计算。实际以最终承配出运账单为准。',
      reqQuote: '直接索取精准报价',
      fname: '联系人姓名/公司名 *',
      email: '企业常用邮箱 *',
      phone: '联系电话 / 微信 / WhatsApp *',
      cargo: '货品详述、申报货值、电池情况 *',
      baseRate: '预估基础运费 ($)',
      baseRatePlaceholder: '可选（填入单价进行快速估算）',
      includeDG: '包含带电/DG九类危险品（加收+25%）',
      cargoCat: '货品分类类型',
      catGeneral: '一般货物普货',
      catNev: '新能源储能包电池件',
      actualWeightLabel: '实际总重量 (KG)',
      totalCbm: '指定或者输入总体积 CBM码',
      autoPrefix: '自适应',
      dimInfo: '请按包装最外溢凸出面进行精确长宽高测算。',
      orOverride: '或者直接输入总体积 CBM值',
      estTotalFreight: '估算全包基本海运费 :',
      totalVolLabel: '实体总体积 (CBM):',
      chargeableUnitsLabel: '计价重量 (KG):',
      fclNote: '* 整箱 FCL 另外提供定制专属约价。估算报价不包含目的港清关手续费、代理代垫、卡车配送及因延误产生的可能港杂费。',
      formSubtitle: '填写以下运载计划，确保我司团队能够极速评估路线性价比。',
      industryLabel: '您的主营行业 / 货物品类',
      indNev: '新能源汽车 / 电池储能系统与配件 (ESS)',
      indFurn: '商业家装 / 展会家私与工期货载',
      indProject: '超高超宽设备 / 工业重箱项目工程',
      indOther: '日常普通杂货普货 (General Cargo)',
      originLabel: '始发港 / 始发城市',
      originPlaceholder: '例如：中国广州、深圳、义乌市',
      destLabel: '目的港 / 目的国',
      destPlaceholder: '例如：马来西亚、沙特阿拉伯、波兰',
      msgPlaceholder: '请提供详实的包装件数、大体纸箱尺寸、特殊操作限制及交货期要求...',
      required: '必填选项码',
      alertInput: '请写明尺寸/数量，或直接指定总体积 CBM 及毛重。',
      alertSuccess: '提交成功！我司高级物流规划师已将您的询价单置为最高优先级别。24小时内发送正轨报价单！',
      alertError: '网络瞬时繁忙。欢迎通过右下角官方微信/WhatsApp等工具直联专席。',
      roadNote: '提示：此处自动套用符合公路承运标准的计重折算系数。',
      submit: '点击发送 RFQ 询价',
      submitting: '正在加急处理并上传中...',
      classHeavy: '重货按实际毛重计费',
      classLight: '轻抛泡货按泡积测算计费',
      modeLabel: '海空陆模式',
      waTemplate: '你好 DDNZ，我刚在官网计算了费用。我的货物有 {cbm} CBM / {weight} KG，打算发往 {destination}。算出来属于{class}。我想了解最终的折扣海运价？',
    },
    insights: {
      title: '物流趋势与跨国贸易实操分享',
      subtitle: '全面理解本地进口合规、实战清关案例及直营航季一手干货报告',
      label: '行业洞见',
      readMore: '阅读全文',
      adviceTitle: '需要专业的供应链一对一解惑？',
      adviceSubtitle: 'DDNZ 高级物流顾问时刻为您排忧解难。',
      contactExpert: '点击直通专家进行深度方案规划',
      hubLabel: 'DDNZ GLOBAL 前沿资讯',
      hubTitle: '海关通关、运力预测及港口实时情报',
      hubSubtitle: '获取由资深报关员与项目运力专家出具的一线实操作报告。',
      showAll: '🏷️ 切换全品类情报',
      deep_dive_read: '实战深度长文',
      read_time: '阅读耗时 4 分钟',
      no_articles: '暂无符合条件的简报',
      no_articles_desc: '此目录下暂时没有发布的更新，欢迎向我们咨询具体课题。',
      posts: {
        "1": {
          title: "2025 全瞻：南美国际进口海运费与港口拥堵走势应对秘诀",
          summary: "分析近期美西、美东及南美通关和塞港形势，为中资出海企业献策如何提前锁定运力、规避超期滞箱费。"
        },
        "2": {
          title: "安全大于天：新能源整车及大型储能系统的长途多式联运实战指南",
          summary: "针对 Class 9 类储能集装箱及商用车，分享 DDNZ 实操出口报关规范和独特的加固技术防范海上自燃。"
        },
        "3": {
          title: "时效交付：商业厨房重件设备中欧卡航15天神速妥投波兰全纪实",
          summary: "解析中欧公路通道如何克服大雪、口岸滞关，特快到底完成客户工期的实操细节。"
        }
      }
    },
    partners: {
      title: '全球卓越伙伴一致推崇的选择',
      subtitle: '携手世界班轮公会直签及国际优质联络网',
      desc: '我们以深厚资质和香港、大湾区核心通道，与一众巨头保持极佳运价合作，保障不抛货、稳定抢舱。'
    },
    footer: {
      slogan: '“29年深耕全球供应链重任，我们不负每一次长途相托。用中国实力托举全球未来。”',
      hq: '广州自营总部',
      hq_addr: '中国广东省广州市白云区云城东路云城街启福路1-10号联富大厦6楼6025-6027室',
      hk: '香港核心金融办公室',
      hk_addr: '中国香港湾仔罗素街38号新鸿基中心5楼',
      hours: '24小时全年全天候技术服务支持',
      hours_desc: '全球运营协调总指挥台',
      cert: '行业核心持牌资质',
      cert_desc: '无船承运人 NVOCC / 国际空协 IATA A级 / ZATCA 认证',
      quick: '便捷网页导航',
      contact: '联系客服',
      compliance: '合规安全及法律声明',
      privacy: '保障隐私声明条款',
      terms: '一般承运基本商业条款',
      experts: '新能源与合规清关资深专家团',
      rights: '© 2024 DDNZ Global。保留最终解释及所有相关版权。'
    }
  }
};
