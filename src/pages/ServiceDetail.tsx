import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import ScrollToTop from '../components/ScrollToTop';
import SchemaMarkup from '../components/SchemaMarkup';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { 
  Ship, Plane, ShieldAlert, BadgeCheck, CheckCircle2, ArrowRight, 
  Clock, DollarSign, Languages, Landmark, Star, HelpCircle, AlertCircle,
  Package, ShieldCheck, Thermometer, FileText, Truck, Zap, Globe
} from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import { trackEvent } from '../lib/utils';

// Multi-language data for the 4 core pillars
const SERVICES_DATA: Record<string, Record<string, any>> = {
  'sea-freight': {
    en: {
      title: 'Sea Freight from China',
      tag: 'Integrated Ocean Logistics Solutions',
      heroSubtitle: 'Cost-effective FCL (Full Container) & LCL (Less-than-Container) shipping with direct carrier contracts.',
      quickFacts: {
        title: 'Quick Facts',
        points: [
          'Direct carrier contracts with MAERSK, MSC, COSCO',
          '99% Custom clearance success rate',
          'Double-customs clearance (DDP) options available',
          'Guangzhou hub inspection and loading control'
        ]
      },
      advs: [
        { title: 'Best-in-class Rates', desc: 'Secure direct contract rates with top carrier alliances, cutting middleman fees.' },
        { title: 'Ultimate Flexibility', desc: 'Custom schedules mapping FCL and weekly LCL consolidations to suit your inventory.' },
        { title: 'Global Coverage', desc: 'Covering South America, South-East Asia, Eastern Europe and the Middle East.' },
        { title: 'DG & Lithium Mastery', desc: 'Specialized containers and secure securing for Class 9 baterry/ESS units.' }
      ],
      deepDive: {
        title: 'Deep-Dive Services',
        desc: 'Our ocean freight network keeps your business competitive. We handle everything from standard dry cargo to complex project cargo and industrial assemblies. By partnering directly with vessel operators, we secure container space even during peak shipping seasons.',
        sections: [
          { name: 'FCL (Full Container Load)', info: 'Complete container booking (20GP, 40HQ, 40FR) with optimized loading schemes and direct routes.' },
          { name: 'LCL (Less-than-Container Load)', info: 'Weekly consolidation of smaller cargo at our Guangzhou self-owned hub, reducing overhead expenses.' },
          { name: 'Customs Brokerage', info: 'In-house brokers at major Chinese ports ensuring fast and hassle-free export declaration and document filing.' }
        ]
      },
      lanes: {
        title: 'Key Lanes & Estimates',
        headers: ['Lane / Trade Route', 'Destination Port', 'Est. Transit Days'],
        rows: [
          ['China → South America', 'Santos, Brazil', '32 - 38 Days'],
          ['China → Europe', 'Gdynia / Hamburg', '28 - 35 Days'],
          ['China → South-East Asia', 'Port Klang, Malaysia', '8 - 12 Days'],
          ['China → Middle East', 'Jebel Ali, UAE', '15 - 18 Days']
        ]
      }
    },
    zh: {
      title: '从中国出发的全球海运服务',
      tag: '集约化海洋箱运与拼箱方案',
      heroSubtitle: '性价比极高的整柜 (FCL) 及拼箱 (LCL) 环球订舱，直签各大船东大客户特惠约价。',
      quickFacts: {
        title: '核心速览',
        points: [
          '直签 MAERSK、MSC、COSCO 等班轮公会',
          '中国主要口岸 99.9% 精准报关放行记录',
          '包含双清包税 (DDP) 至多国门到门专线渠道',
          '自营广州仓现场质检、防潮真空包装及实配监装'
        ]
      },
      advs: [
        { title: '直签各大船东低价', desc: '绕过层层多级货代，直接拿到第一手优质约价，深度降低跨国基本运费支出。' },
        { title: '拼箱集货灵活便捷', desc: '每周固定开班，精准匹配中小企业柔性采购批次，拼箱即达，库存压力大减。' },
        { title: '覆盖多条特色航线', desc: '深耕南美全境、大东南亚、东欧及中东主要口岸港口，清关优势显赫。' },
        { title: '九类危险品及工业品特需', desc: '配有高难储能柜及高货值精密设备卡板加固，全程锁孔稳固高频防护。' }
      ],
      deepDive: {
        title: '海洋运输深度服务项目',
        desc: '华正邦泰国际货运 29年积淀的海运网络是您拓展跨国商贸的核心动力。无论是处理标准非重工件还是高价值重型机械工程项目，我们的专业海运专家都能从装箱起算、口岸接单到最终尾端配送，打造万无一失的拼合或独柜闭环。',
        sections: [
          { name: '海运整箱 (FCL)', info: '提供标准 20GP、40HQ 及特种平板柜(FR)、开顶柜(OT)的最优配舱和快速直航装载。' },
          { name: '海运拼箱 (LCL)', info: '在广州和香港自有仓库集货多品牌包装合一，降低拼箱港杂费及运价门槛。' },
          { name: '通关配合与金融安全', desc: '配备自营卓越 AEO 级别报关团队，确保各项复杂提单、产地证等迅速出单放行。' }
        ]
      },
      lanes: {
        title: '优势主要航线时效表',
        headers: ['始发航线路线', '目的港口 / 国家', '预计海运航程天数'],
        rows: [
          ['中国华南/华东 → 南美专线', '桑托斯（巴西/Santos）', '32 - 38 天'],
          ['中国大湾区 → 欧洲主港', '格丁尼亚 / 汉堡 / 鹿特丹', '28 - 35 天'],
          ['中国港口 → 东南亚大包', '巴生港（马来西亚）', '8 - 12 天'],
          ['中国始发 → 中东专线', '杰贝阿里（阿联酋）', '15 - 18 天']
        ]
      }
    },
    ru: {
      title: 'Морские грузоперевозки из Китая',
      tag: 'Интегрированные морские решения',
      heroSubtitle: 'Экономически выгодная доставка FCL (полный контейнер) и LCL (сборные грузы) по прямым контрактам.',
      quickFacts: {
        title: 'Факты',
        points: [
          'Прямые контракты с MAERSK, MSC, COSCO',
          'Успешное таможенное оформление в 99% случаев',
          'Доступны варианты сквозного DDP клиринга',
          'Контроль инспекции и загрузки на хабе в Гуанчжоу'
        ]
      },
      advs: [
        { title: 'Лучшие контрактные тарифы', desc: 'Безопасные прямые контрактные тарифы без лишних наценок традиционных посредников.' },
        { title: 'Максимальная гибкость', desc: 'Полноценные схемы FCL и регулярные консолидации LCL каждую неделю.' },
        { title: 'Широкий охват портов', desc: 'Южная Америка, Юго-Восточная Азия, Восточная Европа и Ближний Восток.' },
        { title: 'Мастерство работы с АКБ', desc: 'Специальное крепление для опасных грузов класса 9 (аккумуляторы).' }
      ],
      deepDive: {
        title: 'Глубокий анализ услуг',
        desc: 'Наша сеть морских грузоперевозок обеспечивает конкурентные преимущества вашему бизнесу. Мы обрабатываем все виды грузов: от стандартных сухих до сложных проектных и тяжелого промышленного оборудования.',
        sections: [
          { name: 'FCL (Полный контейнер)', info: 'Бронирование полных контейнеров (20GP, 40HQ) по выгодным маршрутам без перегрузок.' },
          { name: 'LCL (Сборный груз)', info: 'Еженедельно комплектуемые сборные партии на нашем складе в Гуанчжоу.' },
          { name: 'Таможенное сопровождение', info: 'Штат лицензированных декларантов в ключевых портах Китая для оперативного выпуска деклараций.' }
        ]
      },
      lanes: {
        title: 'Маршруты и Транзитное время',
        headers: ['Торговый путь из Китая', 'Порт назначения', 'Ориентировочные дни'],
        rows: [
          ['Китай → Южная Америка', 'Сантос, Бразилия', '32 - 38 дней'],
          ['Китай → Европа', 'Гдыня / Гамбург', '28 - 35 дней'],
          ['Китай → Юго-Восточная Азия', 'Порт-Кланг, Малайзия', '8 - 12 дней'],
          ['Китай → Ближний Восток', 'Джебель-Али, ОАЭ', '15 - 18 дней']
        ]
      }
    },
    fr: {
      title: 'Fret Maritime depuis la Chine',
      tag: 'Solutions Logistiques Océaniques Intégrées',
      heroSubtitle: 'Expédition FCL (conteneur complet) et LCL (groupage) économique grâce à des contrats directs.',
      quickFacts: {
        title: 'Infos Rapides',
        points: [
          'Contrats directs avec MAERSK, MSC, COSCO',
          'Taux de réussite de dédouanement de 99%',
          'Options DDP (double dédouanement rendu payé)',
          'Inspection et contrôle de chargement au hub de Guangzhou'
        ]
      },
      advs: [
        { title: 'Tarifs Directs Compétitifs', desc: 'Accès direct aux taux d\'alliances maritimes mondiales, sans frais d\'intermédiaires.' },
        { title: 'Flexibilité Maximale', desc: 'Départs réguliers en FCL ou groupages hebdomadaires en LCL.' },
        { title: 'Couverture Globale', desc: 'Portée robuste en Amérique du Sud, Asie, Europe de l\'Est et Moyen-Orient.' },
        { title: 'Maîtrise DG & Piles Lithium', desc: 'Fixation professionnelle et conforme des composants de classe de danger 9.' }
      ],
      deepDive: {
        title: 'Exploration de l\'offre Maritime',
        desc: 'Notre réseau de transport maritime assure la pérennité de votre chaîne d\'approvisionnement. Nous gérons des projets complexes, du transport de marchandises sèches standards aux frets lourds d\'ingénierie.',
        sections: [
          { name: 'FCL (Conteneur Complet)', info: 'Placement complet de conteneurs standard (20GP, 40HQ) et spéciaux sur les lignes maritimes directes.' },
          { name: 'LCL (Groupage Maritime)', info: 'Consolidation hebdomadaire de colis au hub de Guangzhou, réduisant les charges opérationnelles.' },
          { name: 'Courtage & Douane', info: 'Représentants intégrés dans les ports chinois pour valider l\'exportation de façon irréprochable.' }
        ]
      },
      lanes: {
        title: 'Lignes et Délais Estimés',
        headers: ['Route depuis la Chine', 'Port de Destination', 'Jours de Transit (Est.)'],
        rows: [
          ['Chine → Amérique du Sud', 'Santos, Brésil', '32 - 38 Jours'],
          ['Chine → Europe', 'Gdynia / Hambourg', '28 - 35 Jours'],
          ['Chine → Asie du Sud-Est', 'Port Klang, Malaisie', '8 - 12 Jours'],
          ['Chine → Moyen-Orient', 'Jebel Ali, Émirats Arabes Unis', '15 - 18 Jours']
        ]
      }
    }
  },
  'air-freight': {
    en: {
      title: 'Air Freight from China',
      tag: 'Urgent & Scheduled Sky Solutions',
      heroSubtitle: 'Time-critical air cargo solutions with global coverage, predictable schedules and door-to-door delivery.',
      advs: [
        { title: 'Fast Transit', desc: 'Express, standard and economy options to meet your deadlines.' },
        { title: 'Global Network', desc: 'Extensive airline partners and schedules from all major CN airports.' },
        { title: 'Customs Expertise', desc: 'Export/import documentation and brokerage support end-to-end.' },
        { title: 'Reliable Handling', desc: 'Secure facilities and milestone updates for your priority cargo.' }
      ],
      coreServices: {
        title: '5 Core Air Freight Services',
        desc: 'Our specialized airline allocations guarantee flexible air solutions tailored directly to your logistical speed requirements.',
        items: [
          { name: 'Express Air', info: 'Next-flight-out and priority services for urgent shipments.' },
          { name: 'Standard Air', info: 'Balanced speed and cost with reliable departure windows.' },
          { name: 'Economy Air', info: 'Cost-effective consolidated air for less time-sensitive cargo.' },
          { name: 'DDP/DAP', info: 'Door-to-door with all-inclusive options, customs and delivery.' },
          { name: 'Special Cargo', info: 'Dangerous goods, oversized, temperature-controlled on request.' }
        ]
      },
      quickFacts: {
        title: 'Air Quick Facts',
        points: [
          'From PVG, CAN, SZX, HKG, PEK and more',
          'Chargeable weight optimized (volumetric)',
          'Export packing and labeling support',
          'Real-time milestone updates'
        ]
      },
      lanes: {
        title: 'Popular Lanes & Transit Times (Air Matrix)',
        headers: ['Lane / Trade Route', 'Destination Airport Ports (IATA)', 'Express Service', 'Standard Service'],
        rows: [
          ['China → USA', 'LAX, JFK, ORD, DFW, ATL', '2 – 4 Days', '3 – 7 Days'],
          ['China → Europe', 'AMS, FRA, LHR, CDG', '2 – 3 Days', '3 – 5 Days'],
          ['China → Middle East', 'DXB, DOH, RUH', '1 – 3 Days', '2 – 4 Days']
        ]
      },
      workflow: [
        { num: '01', title: 'Quote', desc: 'Share cargo details to evaluate immediate route capacities and premium rates.' },
        { num: '02', title: 'Pickup', desc: 'Arrange secure dispatch from your regional supplier factory or directly to our Guangzhou hub.' },
        { num: '03', title: 'Export', desc: 'Handle physical airway packaging, custom declarations, and immediate export clearance.' },
        { num: '04', title: 'Flight', desc: 'Choose between Express, Standard, or Economy flight block space bookings.' },
        { num: '05', title: 'Import', desc: 'Complete arrival documentation, custom tax pre-payment, and local clearance handling.' },
        { num: '06', title: 'Delivery', desc: 'Initiate door-to-door shipping if needed, ensuring fast freight handovers.' }
      ],
      valueAdded: {
        title: 'Value-Added Services (Air Logistics Specifics)',
        desc: 'Complete auxiliary operations to protect and expedite high-priority air shipments.',
        items: [
          { title: 'Customs Brokerage', desc: 'HS classification, duty/tax advisory, import/export filing.' },
          { title: 'Warehousing', desc: 'Consolidation, short-term storage, cross-docking.' },
          { title: 'Cargo Insurance', desc: 'All-risk coverage to protect your goods in transit.' },
          { title: 'Temperature Control', desc: 'Cool chain and thermal solutions for sensitive goods.' }
        ]
      }
    },
    zh: {
      title: '从中国起发的至捷空运',
      tag: '至捷高时效空运物流',
      heroSubtitle: '高时效空中货运方案，航网穿梭全球、舱位班期稳定，更有全托门到门速派服务。',
      advs: [
        { title: '极速运转', desc: '提供特快、标运及经济等多元选择，严密迎合您的交货截关时限。' },
        { title: '环球航网', desc: '直签主力航空，覆盖中国所有主要枢纽机场出发飞抵全球。' },
        { title: '卓越通关', desc: '配备自营关务专家，进出口单证申报与综合报关代理一站式无盲区。' },
        { title: '稳妥储运', desc: '全封闭货站配载，GPS里程碑实时轨迹监控，守护高净值货物生命线。' }
      ],
      coreServices: {
        title: '5 大核心空运解决方案',
        desc: '自营各大航空签约班机板位规划，满足您货物对运输速度和预算支出的多样化和精细化要求。',
        items: [
          { name: '特快优先 (Express Air)', info: '承诺就近航班(Next-flight-out)及精编板位直配，针对紧急订单提供最速装运服务。' },
          { name: '标准直达 (Standard Air)', info: '性价比与交付周期完美均衡，提供固定出港时间窗口，按计划妥善派货。' },
          { name: '经济集运 (Economy Air)', info: '为非紧急批次采购量身打造，拼板拼舱，深度优化空运费支出的首要之选。' },
          { name: '双清派送 (DDP / DAP)', info: '一站式全包含关税方案，派收送货上门，全流程由海外团队接驳递交，进口商零操心。' },
          { name: '特种货载 (Special Cargo)', info: '提供锂电池、纯带电件、超限大型工业母机及精细温控等空运危包证和全合规起运保障。' }
        ]
      },
      quickFacts: {
        title: '核心空运要素说明',
        points: [
          '覆盖 PVG、CAN、SZX、HKG、PEK 等中国主要口岸机场直发',
          '提供计费重（体积重 / Volumetric weight）算法层面的合理优化推荐',
          '免费进行空运特种纸箱、防撬木箱包装及防磁/防震/防跌落标签补加',
          '核心卡车定位与空中运单节点实时触发主动物流进展更新'
        ]
      },
      lanes: {
        title: '热门干线与空运时效 (Air Matrix)',
        headers: ['始发航线 (中国)', '目的港主要机场口岸 (IATA)', '特快方案 (预计周期)', '标准方案 (预计周期)'],
        rows: [
          ['中国 → 美国', 'LAX, JFK, ORD, DFW, ATL', '2 – 4 天', '3 – 7 天'],
          ['中国 → 欧洲', 'AMS, FRA, LHR, CDG', '2 – 3 天', '3 – 5 天'],
          ['中国 → 中东', 'DXB, DOH, RUH', '1 – 3 天', '2 – 4 天']
        ]
      },
      workflow: [
        { num: '01', title: '快速询价', desc: '极速输入货物尺寸、品类及始发终点以测算适配空运板位及精准全包价。' },
        { num: '02', title: '上门提货', desc: '由协议重卡从全国供应厂商拉返，亦可直接通过内陆物流送至我们广州 18 年自营大仓。' },
        { num: '03', title: '出口报关', desc: '执行重组贴标、打防爆包装，一站式通过港口危包鉴定与海商安检、绿色通关放行。' },
        { num: '04', title: '定舱装空', desc: '确认装入特快、标级或者经济合舱班轮，完成飞跃大洋的高空干线中转。' },
        { num: '05', title: '境外清关', desc: '飞机平稳落地境外哈布卡线，海外分理团队优先接卸，急速办结放税放行。' },
        { num: '06', title: '送达移交', desc: '拖车全托卡派或 UPS 派送，顺利呈递至亚马逊或海外买手仓库，签署 POD 追踪。' }
      ],
      valueAdded: {
        title: '高附加值增值空运服务',
        desc: '全面的一件式增值细化支持，确保紧急和高价值空中包裹防损通关。',
        items: [
          { title: '一站式关务代理 (Customs Brokerage)', desc: 'HS 品名归类、国际适用关税申报、进出口报关及临时退税代理。' },
          { title: '自营仓储支持 (Warehousing)', desc: '广州 18 年自营大仓拼装重组、标签管理、短租货位及拆箱分拣。' },
          { title: '全程运输险保障 (Cargo Insurance)', desc: '合伙国际保客提供全损险（All-Risk Cover），理赔便捷赔付足额。' },
          { title: '温控恒温链处理 (Temperature Control)', desc: '配备恒温主动降温或真空保温措施，专业保管医药、精密半导体耗材。' }
        ]
      }
    },
    ru: {
      title: 'Авиаперевозки из Китая',
      tag: 'Срочные и регулярные авиарешения',
      heroSubtitle: 'Срочные решения для авиаперевозок с глобальным охватом, предсказуемым расписанием и доставкой от двери до двери.',
      advs: [
        { title: 'Скорость', desc: 'Экспресс, стандартные и экономичные варианты доставки в соответствии с вашими сроками.' },
        { title: 'Глобальная сеть', desc: 'Обширная сеть партнеров-авиакомпаний и регулярные рейсы из всех ключевых аэропортов Китая.' },
        { title: 'Таможня', desc: 'Комплексная подготовка экспортно-импортной документации и брокерская поддержка.' },
        { title: 'Надежность', desc: 'Безопасное хранение на терминалах и оперативное информирование о ключевых статусах приоритетного груза.' }
      ],
      coreServices: {
        title: '5 ключевых авиарешений',
        desc: 'Наши авиационные квоты и прямое бронирование обеспечивают гибкое покрытие для любых требований по скорости и бюджету.',
        items: [
          { name: 'Express Air', info: 'Приоритетная доставка ближайшим рейсом (Next-flight-out) для самых срочных партий грузов.' },
          { name: 'Standard Air', info: 'Оптимальное сочетание скорости и стоимости с гарантированным стыковочным временем.' },
          { name: 'Economy Air', info: 'Экономичная консолидация авиагрузов для сборных отправлений без жестких сроков.' },
          { name: 'DDP/DAP под ключ', info: 'Доставка до дверей с оплатой всех пошлин и таможенной очистки за один платеж без участия импортера.' },
          { name: 'Спецгрузы (Special)', info: 'Безопасное и сертифицированное размещение литиевых батарей, тяжелого оборудования и термочувствительных грузов.' }
        ]
      },
      quickFacts: {
        title: 'Факты об авиаперевозках',
        points: [
          'Вылеты проводятся из PVG, CAN, SZX, HKG, PEK и других главных хабов Китая',
          'Оптимизация оплачиваемого объемного веса в соответствии со стандартами IATA',
          'Профессиональная экспортная деревянная обрешетка и контроль маркировки',
          'Регулярное информирование и отслеживание статуса перевозки в пути'
        ]
      },
      lanes: {
        title: 'Популярные маршруты и транзит (Air Matrix)',
        headers: ['Направление доставки (Китай)', 'Аэропорты прибытия (IATA)', 'Экспресс-тариф', 'Стандарт-тариф'],
        rows: [
          ['Китай → США', 'LAX, JFK, ORD, DFW, ATL', '2 – 4 дня', '3 – 7 дней'],
          ['Китай → Европа', 'AMS, FRA, LHR, CDG', '2 – 3 дня', '3 – 5 дней'],
          ['Китай → Ближний Восток', 'DXB, DOH, RUH', '1 – 3 дня', '2 – 4 дня']
        ]
      },
      workflow: [
        { num: '01', title: 'Расчет', desc: 'Укажите параметры вашего груза для подбора быстрой схемы перевозки и лучшего тарифа.' },
        { num: '02', title: 'Pick-up', desc: 'Организуем оперативную автовывозку с фабрики поставщика или забор на наш склад в Гуанчжоу.' },
        { num: '03', title: 'Экспорт', desc: 'Упакуем груз в соответствии с авианормами, заполним экспортную декларацию и организуем клиринг.' },
        { num: '04', title: 'Полет', desc: 'Груз закладывается в выбранную категорию бронирования (Экспресс, Стандарт или Эконом) и вылетает.' },
        { num: '05', title: 'Импорт', desc: 'Обеспечим быстрое получение на терминале аэропорта назначения и растаможку.' },
        { num: '06', title: 'Доставка', desc: 'Осуществим автодоставку товара непосредственно к дверям вашего склада с подписанием документов.' }
      ],
      valueAdded: {
        title: 'Дополнительные услуги авиалогистики',
        desc: 'Комплексные вспомогательные сервисы для максимального комфорта и безопасности ценных отправлений.',
        items: [
          { title: 'Таможенное оформление', desc: 'Подбор корректных кодов ТН ВЭД, консультации по пошлинам и сертификация.' },
          { title: 'Консолидация на складе', desc: 'Хранение, консолидация, распределение и переупаковка на собственном складе в Гуанчжоу.' },
          { title: 'Страхование грузов', desc: 'Оформление страховки «от всех рисков» (All-Risk) с полной защитой стоимости груза.' },
          { title: 'Контроль температуры', desc: 'Организация холодовой цепи, термочехлов и хладагентов для чувствительных комплектующих.' }
        ]
      }
    },
    fr: {
      title: 'Fret Aérien de Chine',
      tag: 'Solutions Célestes Express & Fiables',
      heroSubtitle: 'Solutions de cargo aérien urgentes avec couverture globale, horaires fiables et livraison directe de porte à porte.',
      advs: [
        { title: 'Transit Rapide', desc: 'Options express, standard et économie conçues pour respecter vos dates de livraison.' },
        { title: 'Réseau Mondial', desc: 'Partenariat avec des compagnies aériennes majeures au départ de tous les aéroports chinois clés.' },
        { title: 'Expertise Douanière', desc: 'Préparation documentaire complète et support de courtage douanier de bout en bout.' },
        { title: 'Traitement Sûr', desc: 'Installations hautement sécurisées et suivi par jalons réguliers pour vos colis prioritaires.' }
      ],
      coreServices: {
        title: '5 Solutions de Fret Aérien Cruciales',
        desc: 'Nos réservations garanties auprès des transporteurs aériens offrent une flexibilité et une rapidité adaptées à votre chaîne logistique.',
        items: [
          { name: 'Express Air (Fret Express)', info: 'Priorité absolue sur le premier vol disponible (Next-flight-out) pour les envois urgents de haute valeur.' },
          { name: 'Standard Air (Fret Standard)', info: 'Le meilleur équilibre tarifaire et de transit avec des fenêtres de départ de compagnies programmées.' },
          { name: 'Economy Air (Fret Éco)', info: 'Services de groupage aérien réguliers optimisant l\'économie sur les envois moins pressants.' },
          { name: 'DDP/DAP Clé en Main', info: 'Logistique intégrée incluant le dédouanement à l\'import, le règlement prépayé des droits et le transport final.' },
          { name: 'Fret Spécialisé', info: 'Normes de sécurité renforcées pour batteries au lithium, marchandises dangereuses et chaîne du froid.' }
        ]
      },
      quickFacts: {
        title: 'Points Forts Clés',
        points: [
          'Départs réguliers de PVG, CAN, SZX, HKG, PEK et d\'autres aéroports chinois majeurs',
          'Optimisation stricte du poids facturable (poids volumétrique selon les formules de l\'IATA)',
          'Fabrication d\'emballage carton robuste, caisses de bois protectrices et étiquetage export',
          'Mises à jour régulières et rapports des étapes du voyage en temps réel'
        ]
      },
      lanes: {
        title: 'Lignes Populaires & Temps de Transit (Air Matrix)',
        headers: ['Ligne Actuelle (Chine)', 'Aéroports de Destination (IATA)', 'Fret Express (Est.)', 'Fret Standard (Est.)'],
        rows: [
          ['Chine → USA', 'LAX, JFK, ORD, DFW, ATL', '2 – 4 Jours', '3 – 7 Jours'],
          ['Chine → Europe', 'AMS, FRA, LHR, CDG', '2 – 3 Jours', '3 – 5 Jours'],
          ['Chine → Moyen-Orient', 'DXB, DOH, RUH', '1 – 3 Jours', '2 – 4 Jours']
        ]
      },
      workflow: [
        { num: '01', title: 'Devis', desc: 'Saisie rapide des dimensions du fret pour déterminer les capacités de cargaison et la tarification exacte.' },
        { num: '02', title: 'Collecte', desc: 'Camionnage express depuis l\'emplacement fournisseur ou livraison interne à notre hub de Guangzhou.' },
        { num: '03', title: 'Export', desc: 'Vérification métrique rigoureuse, palettisation certifiée IATA et dédouanement d\'origine.' },
        { num: '04', title: 'Vol', desc: 'Expédition directe selon la flexibilité souhaitée (Abonnements d\'itinéraires Express, Standard ou Économie).' },
        { num: '05', title: 'Import', desc: 'Arrivée terminal, déchargement et accomplissement des formalités de douane import de premier plan.' },
        { num: '06', title: 'Livraison', desc: 'Récupération rapide, acheminement porte-à-porte fluide et signature POD de livraison finale.' }
      ],
      valueAdded: {
        title: 'Prestations à Valeur Ajoutée',
        desc: 'Opérations logistiques complémentaires intégrées pour sécuriser vos marchandises à haute priorité.',
        items: [
          { title: 'Courtage Douane', desc: 'Nomenclature douanière, déclaration en douane, calcul et dépôt des droits.' },
          { title: 'Stockage local', desc: 'Prélèvement d\'usine, emballage de protection, transbordement à Guangzhou.' },
          { title: 'Assurances Fret', desc: 'Garantie All-Risk complète couvrant chaque étape de transport mondial.' },
          { title: 'Chaîne du Froid', desc: 'Conteneurs isothermes actifs et housses thermiques pour composants hautement sensibles.' }
        ]
      }
    }
  },
  'amazon-fba': {
    en: {
      title: 'Amazon FBA Direct Delivery',
      tag: 'Specialized E-Commerce Logistics',
      heroSubtitle: 'Compliance-approved shipping from China directly to global Amazon warehouses with duty prepaid (DDP).',
      quickFacts: {
        title: 'Quick Facts',
        points: [
          'Fully compliant labeling and palletization guidelines',
          'Guaranteed duty prepaid delivery (DDP) by Air or Sea',
          'Strict appointments booking (CARP / Carrier Central)',
          'Pre-delivery physical inspections at Guangzhou hub'
        ]
      },
      advs: [
        { title: '100% Compliance', desc: 'Strict verification of Amazon dimensions, weight tags, and carton shipping labels.' },
        { title: 'Prepaid Duties (DDP)', desc: 'Absolute zero handoffs for importers; we pay duties, clear customs, and book slots.' },
        { title: 'Integrated Sorting', desc: 'Consolidate multiple factory batches into single compliant pallet ranks at our hub.' },
        { title: 'Fast Booking', desc: 'Direct access to Amazon scheduling booking systems, reducing local demurrage charges.' }
      ],
      deepDive: {
        title: 'Professional FBA Logistics',
        desc: 'Our specialized FBA cargo delivery team mitigates the risk of Amazon warehouse rejection. We check every carton and bar-code before dispatching your product. Partnering with last-mile couriers (UPS, FedEx) and local LTL carrier networks, we ensure fast entry.',
        sections: [
          { name: 'FBA Sea-DDP (Express)', info: 'Budget ocean shipping option with pre-set appointments and fast LTL/UPS direct delivery.' },
          { name: 'FBA Air-DDP (Fast)', info: 'Air freight express routing, ideal for restocking low-inventory high-margin variations within 7-10 days.' },
          { name: 'Prep & Inspection Services', info: 'Repackaging, labeling, custom pallet packing, and quality checks at our strategic Guangzhou facility.' }
        ]
      },
      lanes: {
        title: 'FBA Lanes & Transit Estimations',
        headers: ['Trade Route from China', 'Amazon Warehouse', 'Est. Transit Days'],
        rows: [
          ['China → Europe FBA (Sea)', 'Amazon Poland / Germany', '30 - 38 Days'],
          ['China → North America FBA (Sea)', 'ONT8 / LGB8 / GYR3, USA', '18 - 25 Days'],
          ['China → North America FBA (Air)', 'East Coast / West Coast, USA', '6 - 10 Days'],
          ['China → Middle East FBA', 'Amazon DXB, UAE', '12 - 16 Days']
        ]
      }
    },
    zh: {
      title: '亚马逊 FBA 一站式直航派送服务',
      tag: '高标准跨境电商全程履约通道',
      heroSubtitle: '严密合规、支持空运/海运双清包税送货上门(DDP/DDU)直接配送全球亚马逊各FBA运营中心。',
      quickFacts: {
        title: '核心速览',
        points: [
          '严格契合亚马逊最新贴标、超重标签及防跌落卡板加固规范',
          '保障全程包税清关（DDP）海运/空运直达，规避卖家税务风险',
          '直连亚马逊卡派预约通道（CARP / Carrier Central 资质）',
          '在广州自营仓提供正式出厂前质检、重贴标及条卡扫码复核'
        ]
      },
      advs: [
        { title: '合规零拒收保障', desc: '熟悉各大 FBA 运营中心收货政策，精确核验外箱尺寸重量，规避分仓及违规罚款。' },
        { title: '双清包税 DDP 送货', desc: '一揽子解决进出口商清关资质阻碍，代理支付税金，目的地亚马逊无需出面。' },
        { title: '多源厂家统拼拼箱', desc: '把不同省份、不同电商供应商的采购统一在广州拼装成一个整托，极力减少杂费。' },
        { title: '自有账号闪电约入', desc: '直接与当地卡车网路及国际快递协议直签，预约送仓，不耽误旺季动销。' }
      ],
      deepDive: {
        title: '亚马逊电商专业入仓体系',
        desc: '对于跨境大卖家来说，任何一次断货都是致命排名危机。华正邦泰国际货运 为您的全渠道履约保驾护航。我们严防装箱超标、标码模糊不清等常见顽疾，提供高容错、可追踪的一站式端到端电商空海运大后援。',
        sections: [
          { name: 'FBA海派专线 (双清包税)', info: '定期海运快船直航，搭配尾端 UPS/FedEx/主流拖车卡车派配，高性价比电商补货首选。' },
          { name: 'FBA空派专线', info: '空运包板起飞，专为爆款极速追单、防止断货打造的7-10天极速履约通道。' },
          { name: '海外仓换标与贴标 (Prep)', info: '中国核心仓、以及欧洲/东南亚中转节点提供拆箱合盘、退货代贴标签等二次翻新服务。' }
        ]
      },
      lanes: {
        title: 'FBA优势班期路线时效',
        headers: ['始发专线名称', '核心配送亚马逊运营中心', '预计全包含税时效天数'],
        rows: [
          ['中国海派 → 欧洲 FBA 专线', '波兰 / 德国亚马逊运营中心', '30 - 38 天'],
          ['中国美森/限时海派 → 美西 FBA', 'ONT8 / LGB8 / GYR3 等美西仓', '18 - 25 天'],
          ['中国空派极速 → 全美 FBA', '美国西海岸 / 东海岸各大运营点', '6 - 10 天'],
          ['中国海派集运 → 中东 FBA', '迪拜 DXB 等阿联酋亚马逊仓', '12 - 16 天']
        ]
      }
    },
    ru: {
      title: 'Доставка на склады Amazon FBA',
      tag: 'Специализированная логистика e-Commerce',
      heroSubtitle: 'Полностью соответствующие правилам Amazon поставки из Китая напрямую на склады по программе DDP.',
      quickFacts: {
        title: 'Факты',
        points: [
          'Полное соответствие правилам маркировки и паллетирования',
          'Гарантированная доставка с предоплатой пошлин (DDP)',
          'Строгое соблюдение слотов записи (CARP / Carrier Central)',
          'Предварительный аудит коробок на нашем хабе'
        ]
      },
      advs: [
        { title: '100% Соответствие', desc: 'Жесткий контроль размеров, сверхтяжелых бирок и этикеток Amazon.' },
        { title: 'Предоплата пошлин (DDP)', desc: 'Полное отсутствие скрытых платежей, самостоятельно оплачиваем все налоги.' },
        { title: 'Интегрированная подготовка', desc: 'Консолидация партий от разных фабрик в паллеты на одном терминале.' },
        { title: 'Быстрая запись', desc: 'Прямая интеграция со слотами букинга складов Amazon.' }
      ],
      deepDive: {
        title: 'Профессиональная FBA логистика',
        desc: 'Наша специализированная команда сводит к нулю риски拒收 (отказа в приемке) Amazon. Мы тщательно проверяем каждую коробку перед отправкой на экспорт.',
        sections: [
          { name: 'FBA Море-DDP (Выгодно)', info: 'Бюджетная доставка морем с автозаписью LTL и курьерами UPS на склады.' },
          { name: 'FBA Авиа-DDP (Быстро)', info: 'Доставка самолетом за 7-10 дней для срочного пополнения остатков.' },
          { name: 'Услуги Prep склада', info: 'Маркировка, переупаковка на нашем стратегическом хабе в Гуанчжоу.' }
        ]
      },
      lanes: {
        title: 'Маршруты FBA и Ориентировочное время',
        headers: ['Торговый путь из Китая', 'Склады Amazon', 'Ориентировочные дни'],
        rows: [
          ['Китай → Европа FBA (море)', 'Amazon Польша / Германия', '30 - 38 дней'],
          ['Китай → Северная Америка FBA (море)', 'ONT8 / LGB8 / GYR3, США', '18 - 25 дней'],
          ['Китай → Северная Америка FBA (авиа)', 'Восточное / Западное побережье США', '6 - 10 дней'],
          ['Китай → Ближний Восток FBA', 'Amazon DXB, ОАЭ', '12 - 16 дней']
        ]
      }
    },
    fr: {
      title: 'Livraison Directe Amazon FBA',
      tag: 'Logistique E-Commerce Spécialisée',
      heroSubtitle: 'Expédition rigoureuse et validée de Chine directement aux dépôts Amazon avec droits payés (DDP).',
      quickFacts: {
        title: 'Infos Rapides',
        points: [
          'Respect strict des directives d\'étiquetage carton et palettes',
          'Livraisons garanties en DDP (droits payés) par air ou mer',
          'Système d\'enregistrement de rendez-vous réservé (CARP)',
          'Inspections physiques minutieuses au hub de Guangzhou'
        ]
      },
      advs: [
        { title: 'Conformité Sans Faille', desc: 'Évitez les rejets de marchandises et pénalités de stockage Amazon.' },
        { title: 'Dédouanement Libéré (DDP)', desc: 'Zéro démarche administrative, dédouanements et droits de douane entièrement réglés.' },
        { title: 'Centre de Tri Intégré', desc: 'Centralisez plusieurs colis de fournisseurs distincts sur d\'élégantes palettes.' },
        { title: 'Livraison Rapide', desc: 'Entrées d\'entrepôt FBA rapides via notre partenariat de flotte de camionnage.' }
      ],
      deepDive: {
        title: 'Logistique电商 FBA Spécialisée',
        desc: 'Notre service e-commerce neutralise le danger d\'une fermeture de stock Amazon. Nous vérifions les dimensions, codes à barres et surcharges poids avant le départ aérien ou océanique.',
        sections: [
          { name: 'FBA Mer-DDP (Économique)', info: 'Navigation maritime performante complétée par une livraison directe UPS/camion.' },
          { name: 'FBA Air-DDP (Flux Tendu)', info: 'Expédition aérienne pour reconstituer des listes de variantes en 7 à 10 jours.' },
          { name: 'Services Prep & Contrôle', info: 'Étiquetage, cerclage et palettisation sur-mesure au point de tri de Guangzhou.' }
        ]
      },
      lanes: {
        title: 'Régimes et Délais Estimés FBA',
        headers: ['Itinéraire depuis la Chine', 'Entrepôt Amazon principal', 'Jours de Transit (Est.)'],
        rows: [
          ['Chine → Europe FBA (Mer)', 'Amazon Pologne / Allemagne', '30 - 38 Jours'],
          ['Chine → Amérique Nord FBA (Mer)', 'ONT8 / LGB8 / GYR3, USA', '18 - 25 Jours'],
          ['Chine → Amérique Nord FBA (Air)', 'Côte Est / Côte Ouest, USA', '6 - 10 Jours'],
          ['Chine → Moyen-Orient FBA', 'Amazon DXB, Émirats Arabes Unis', '12 - 16 Jours']
        ]
      }
    }
  },
  'warehouse-services': {
    en: {
      title: 'Warehouse & Consolidation Services',
      tag: 'Strategic Operational Infrastructure',
      heroSubtitle: 'Highly secured buffer warehousing and specialty export packaging based in our 18-year self-owned Guangzhou hub.',
      quickFacts: {
        title: 'Quick Facts',
        points: [
          '18 Years operated self-owned hub in Guangzhou Baiyun district',
          'Heavy cargo crating using precision plywood export crates',
          'Complete 24/7 CCTV security and thermal tracking controllers',
          'Advanced multi-supplier inventory sorting and dispatch control'
        ]
      },
      advs: [
        { title: 'Zero Lease Risk', desc: 'No long-term contracts; utilize our warehouses as your scalable peak seasons buffer storage.' },
        { title: 'Advanced Packaging', desc: 'High-durability wood crating designed specifically for sensitive heavy machinery transport.' },
        { title: 'Perfect Consolidation', desc: 'We act as your local logistics sorting center, matching cargo from many regional factories.' },
        { title: 'Strict Quality Audits', desc: 'Visual inspecting, unpacking, verifying, photographing and reporting before any container sealer is set.' }
      ],
      deepDive: {
        title: 'Comprehensive Warehousing Solutions',
        desc: 'Avoid shipping delays due to bad packing or supplier mistakes. Our secure warehouse facility offers complete supply chain control. We pack cargo to withstand the physical stress of rough sea transit, ensuring it arrives fully functional.',
        sections: [
          { name: 'Export Consolidation', info: 'Unloading regional delivery trucks, verifying item compliance, and loading unified export containers.' },
          { name: 'Specialty Wood Crating', info: 'Bespoke, non-fumigated plywood crates precision built on-site to wrap valuable machinery cargo.' },
          { name: 'Cross-Docking & Buffer Storage', info: 'Immediate transshipment with minimal sorting and secure buffer inventory safety ranks.' }
        ]
      },
      lanes: {
        title: 'Warehouse Processing Estimates',
        headers: ['Guangzhou Hub Process', 'Max Buffer Holding Time', 'Standard Lead Time'],
        rows: [
          ['General Consolidation Loading', '45 Days Storage Free', '1 - 2 Days Processing'],
          ['Precision Machinery Crating', 'Tailored Security Racks', '1 - 3 Days Construction'],
          ['Battery / ESS Storage Processing', 'Compliance Buffer Area', '24 Hours Clearance Out'],
          ['Product Physical Assembly Audit', 'Secure Visual Booth', 'Same Day Inspection Report']
        ]
      }
    },
    zh: {
      title: '自营海外仓配与出口集运仓储服务',
      tag: '实自置大湾区核心实业基础设施',
      heroSubtitle: '在核心空港中转地深耕18年、配有高级真空抗震包装能力的自营广州仓储指挥基地。',
      quickFacts: {
        title: '核心速览',
        points: [
          '坐置于广州白云区的 18 年精心打磨自营基地，拒绝外包租赁库风险',
          '独门重卡板、高承载免熏蒸胶合板出口坚固大木箱生产基地',
          '全自控 24/7 CCTV 电哨、防潮除尘与耐压堆存区域规划',
          '自主支持跨境采购拆箱重组、改包装、重贴箱标与空箱防损验证'
        ]
      },
      advs: [
        { title: '免租超长免仓仓期', desc: '提供长达30-45天免仓仓储支持，协助中小型买家多工厂悠闲采购大集结发运。' },
        { title: '极强刚性免熏蒸包装', desc: '自建木工班组，专门包装几十吨精密工业母机、新能源组件，防潮真空，安全无虞。' },
        { title: '核心统合二次装柜', desc: '作为您的“中国买手办中枢”，完美收纳百家零散多小部件集柜，提高装载空间。' },
        { title: '深度上门出厂前质检', desc: '提供包装完整度检测、开箱随机拍照抽检和条码贴标核验，把质量隐患化解在国内。' }
      ],
      deepDive: {
        title: '全方位物流仓储与中转支撑',
        desc: '大多数国际拒收与损失均归咎于货厂端业余的外箱或装运准备。华正邦泰国际货运 自置大型实体厂房，结合29年海陆空综合运转控制，提供重载、极温绝缘防护及精准系统出仓跟踪。不论是散货理货还是特种机器拼凑，我们用坚实后备做您的定海神针。',
        sections: [
          { name: '集拼装箱 (Consolidation)', info: '全天候卡车卸货泊位，多厂家订单拆包核对并分类置入指定待装柜货位，高效合并。' },
          { name: '外贸定制免熏蒸木箱 (Plywood Crating)', info: '精算重心与受力点，生产抗震胶合板托盘箱包，专治工业重件全球长途跋涉。' },
          { name: '跨境暂存与快接快出 (Cross-Doc)', info: '敏捷周转货载，在免去大规模囤积成本下实现极速拼装集载离港。' }
        ]
      },
      lanes: {
        title: '自营集货仓作业周转标准表',
        headers: ['自营集运仓核心操作流程', '免费存储或暂存宽限', '标准处理交付时效'],
        rows: [
          ['普通海运集货理货', '免租期 45 天超长保管', '收货后 1 - 2 天装箱上路'],
          ['超重件免熏蒸木箱生产', '依项目重心特殊存放', '木箱定制 1 - 3 天完工'],
          ['纯电池新能源及DG合规暂储', '特制防爆绝缘防潮区', '24小时内装包直通中转'],
          ['高货值精密件拍照深度开箱质检', '高保密专用独立间', '检验当天输出高清图片视频']
        ]
      }
    },
    ru: {
      title: 'Складские услуги и Консолидация',
      tag: 'Стратегический хаб в Китае',
      heroSubtitle: 'Сверхнадежное буферное хранение и специализированная прочная упаковка на нашем собственном складе (18 лет эксплуатации).',
      quickFacts: {
        title: 'Факты',
        points: [
          '18 лет управления собственным хабом в Гуанчжоу (район Байюнь)',
          'Профессиональная деревянная обрешетка и фанерные ящики на экспорт',
          'Круглосуточное видеонаблюдение CBT 24/7 и температурный контроль',
          'Автоматическая сортировка товаров от разных поставщиков'
        ]
      },
      advs: [
        { title: 'Отсутствие рисков аренды', desc: 'Никаких долгосрочных контрактов на аренду; гибкий буферный склад для грузов.' },
        { title: 'Надежная упаковка', desc: 'Усиленные деревянные ящики для транспортировки станков и тяжелого оборудования.' },
        { title: 'Эффективный сборный пункт', desc: 'Соберем заказы от десятков фабрик Китая на одной паллете в Гуанчжоу.' },
        { title: 'Тщательный аудит качества', desc: 'Проверка, вскрытие, фотоотчет перед загрузкой и отправкой.' }
      ],
      deepDive: {
        title: 'Комплексные складские услуги',
        desc: 'Исключите риски повреждения грузов из-за плохой заводской упаковки. Мы качественно упаковываем тяжелое оборудование для защиты от коррозии во время долгого путешествия по морю.',
        sections: [
          { name: 'Экспортная консолидация', info: 'Разгрузка фабричных машин, пересчет, наклеивание маркировок и загрузка контейнеров.' },
          { name: 'Изготовление ящиков', info: 'Построение прочных фанерных ящиков по размерам и центру тяжести оборудования на месте.' },
          { name: 'Кросс-докинг и транзиты', info: 'Быстрая перевалка транзитных грузов с минимальным временем хранения.' }
        ]
      },
      lanes: {
        title: 'Сроки обработки на складе',
        headers: ['Операция хаба в Гуанчжоу', 'Бесплатное хранение', 'Стандартное время обработки'],
        rows: [
          ['Сборная консолидация грузов', 'до 45 дней бесплатно', '1 - 2 рабочих дня'],
          ['Изготовление защитной обрешетки', 'Под спецконтролем', '1 - 3 дня на сборку'],
          ['Обработка аккумуляторных грузов', 'Изолированный буфер', 'Выгрузка за 24 часа'],
          ['Визуальная инспекция товаров', 'Комната контроля', 'Отчет с фото в тот же день']
        ]
      }
    },
    fr: {
      title: 'Services d\'Entreposage & de Tri',
      tag: 'Infrastructure Opérationnelle Stratégique',
      heroSubtitle: 'Hub d\'entreposage moderne et emballages d\'exportation robustes basés à notre centre de Guangzhou détenu depuis 18 ans.',
      quickFacts: {
        title: 'Infos Rapides',
        points: [
          'Hub géré en interne depuis 18 ans dans le district de Baiyun, Guangzhou',
          'Fabrication d\'emballages export en bois de placage haute densité',
          'Système de vidéosurveillance 24h/24 et d\'alarme de sécurité thermique',
          'Tri et inventaire multi-fournisseurs avant le chargement'
        ]
      },
      advs: [
        { title: 'Zéro Contrainte de Bail', desc: 'Utilisez nos surfaces en fonction de la fluctuation de vos stocks, à volonté.' },
        { title: 'Emballages Ingénierie', desc: 'Crating bois de placage sur-mesure ultra-résistant pour préserver les composants sensibles.' },
        { title: 'Groupage Local Intelligent', desc: 'Centralisez des cargaisons hétérogènes de plusieurs régions en un conteneur uni.' },
        { title: 'Audits de Qualité Physique', desc: 'Nous ouvrons, comptons et éliminons les erreurs d\'expédition directement sur place.' }
      ],
      deepDive: {
        title: 'Solutions d\'Entreposage Complètes',
        desc: 'Notre hub de tri à Guangzhou résout toutes les failles de conditionnement ou d\'erreur d\'expédition propres aux fabricants régionaux. Nous préparons la cargaison pour absorber les vibrations marines.',
        sections: [
          { name: 'Consolidation à l\'Export', info: 'Réception, inventaire précis de conformité et arrimage sécurisé du fret.' },
          { name: 'Crating Bois Cimenté', info: 'Construction solide de caissettes en placage épargnées de certification thermique.' },
          { name: 'Cross-Docking & Stockage', info: 'Transbordement instantané avec un taux de rotation maximal pour économiser votre budget.' }
        ]
      },
      lanes: {
        title: 'Délais de Traitement Opérationnels',
        headers: ['Processus de Traitement', 'Délai d\'Entreposage Gratuit', 'Temps standard d\'Exécution'],
        rows: [
          ['Tri Standard de Colis', '45 Jours de Tri Gratuit', '1 - 2 Jours Ouvrables'],
          ['Construction de Caisses de Bois', 'Emplacement sécurisé', '1 - 3 Jours Construction'],
          ['Dépôt de Batteries & DG', 'Zone d\'Isolation Conforme', 'Expédition sous 24 Heures'],
          ['Audit Qualité Photo & Vidéo', 'Poste Visuel Dédié', 'Rapport photo sous 24h']
        ]
      }
    }
  }
};

export default function ServiceDetail() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { language, t } = useLanguage();
  const [selectedService, setSelectedService] = useState('Sea');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [state, handleSubmit] = useForm("mdabvqbd");
  const [currentSEO, setCurrentSEO] = useState<{ title: string; desc: string; keywords: string } | null>(null);

  // Format valid service key or default to first
  const currentKey = serviceId && SERVICES_DATA[serviceId] ? serviceId : 'sea-freight';
  // Use current selected language or fallback to 'en'
  const activeLang = LANGUAGES_SUPPORTED.includes(language) ? language : 'en';
  const data = SERVICES_DATA[currentKey]?.[activeLang] || SERVICES_DATA[currentKey]?.['en'];

  useEffect(() => {
    window.scrollTo(0, 0);

    // Dynamic SEO Metadata and Keyword Injection Matrix with Hreflang Alternates
    const seoMeta: Record<string, Record<string, { title: string; desc: string; keywords: string }>> = {
      'sea-freight': {
        en: {
          title: 'China Sea Freight | Cheap LCL Container Agent',
          desc: 'Optimize your cargo with cheap sea freight from china, LCL consolidation container china. Top-rated door to door ocean freight shipping agent.',
          keywords: 'cheap sea freight from china, LCL consolidation container china, door to door ocean freight shipping agent'
        },
        zh: {
          title: '中国海运货代公司 | 便宜海运集装箱拼箱门到门',
          desc: '华正邦泰国际货运提供便宜中国海运拼箱及整柜进出口。cheap sea freight from china, LCL consolidation container china, door to door ocean freight shipping agent 双清包税。',
          keywords: 'cheap sea freight from china, LCL consolidation container china, door to door ocean freight shipping agent'
        },
        ru: {
          title: 'Морские перевозки из Китая | Надежная LCL доставка',
          desc: 'Морской фрахт. Мы осуществляем cheap sea freight from china, LCL consolidation container china, door to door ocean freight shipping agent под ключ.',
          keywords: 'cheap sea freight from china, LCL consolidation container china, door to door ocean freight shipping agent'
        },
        fr: {
          title: 'Fret maritime de Chine | Transitaire LCL Consolidation',
          desc: 'Logistique de cheap sea freight from china, LCL consolidation container china. Courtage de door to door ocean freight shipping agent certifié.',
          keywords: 'cheap sea freight from china, LCL consolidation container china, door to door ocean freight shipping agent'
        }
      },
      'air-freight': {
        en: {
          title: 'Air Freight China | Express Air Shipping Agent',
          desc: 'Need time-critical air cargo china? Get the best express air freight rate to US from an international air shipping agent shenzhen. Rapid delivery.',
          keywords: 'time-critical air cargo china, international air shipping agent shenzhen, express air freight rate to US'
        },
        zh: {
          title: '深圳精密空运货代 | 跨境高时效航空货运报价',
          desc: '直配急特需空中货运。提供 time-critical air cargo china, international air shipping agent shenzhen, 以及最优惠的 express air freight rate to US 快线。',
          keywords: 'time-critical air cargo china, international air shipping agent shenzhen, express air freight rate to US'
        },
        ru: {
          title: 'Авиаперевозки из Китая | Экспресс отправка Шэньчжэнь',
          desc: 'Авиадоставка под ключ: time-critical air cargo china, надежный international air shipping agent shenzhen и выгодный express air freight rate to US.',
          keywords: 'time-critical air cargo china, international air shipping agent shenzhen, express air freight rate to US'
        },
        fr: {
          title: 'Fret Aérien Chine | Agence de Transit Express Shenzhen',
          desc: 'Expéditions de time-critical air cargo china. Tarifs express via international air shipping agent shenzhen et bon express air freight rate to US.',
          keywords: 'time-critical air cargo china, international air shipping agent shenzhen, express air freight rate to US'
        }
      },
      'amazon-fba': {
        en: {
          title: 'Amazon FBA Prep China | Professional FNSKU Labeling',
          desc: 'Professional FBA prep services china & FNSKU labeling company china. Get secure, direct delivery to amazon warehouse with all customs cleared.',
          keywords: 'professional FBA prep services china, FNSKU labeling company china, direct delivery to amazon warehouse'
        },
        zh: {
          title: '出口亚马逊FBA仓配 | 双清包税贴标拼箱DDP',
          desc: 'professional FBA prep services china, FNSKU labeling company china, 提供快速 direct delivery to amazon warehouse 卡机一体电商一站式极速入仓。',
          keywords: 'professional FBA prep services china, FNSKU labeling company china, direct delivery to amazon warehouse'
        },
        ru: {
          title: 'Доставка на склады Amazon FBA из КНР | Prep услуги',
          desc: 'Надежный professional FBA prep services china и FNSKU labeling company china. Прямая direct delivery to amazon warehouse с таможенной очисткой.',
          keywords: 'professional FBA prep services china, FNSKU labeling company china, direct delivery to amazon warehouse'
        },
        fr: {
          title: 'Logistique Amazon FBA Chine | Service d\'Étiquetage',
          desc: 'Prestations professional FBA prep services china & FNSKU labeling company china. Service direct delivery to amazon warehouse de porte à porte.',
          keywords: 'professional FBA prep services china, FNSKU labeling company china, direct delivery to amazon warehouse'
        }
      },
      'warehouse-services': {
        en: {
          title: 'Secure Warehouse Storage China | Cheap Cross Docking',
          desc: 'Secure warehouse storage china & cheap cross docking service. Expert e-commerce order fulfillment warehouse in Guangzhou. Fully integrated logistics.',
          keywords: 'secure warehouse storage china, e-commerce order fulfillment warehouse, cheap cross docking service'
        },
        zh: {
          title: '广州自营出口储运集运仓 | 廉价跨境仓储一件代发',
          desc: '拥有18年自营大仓,提供 secure warehouse storage china, e-commerce order fulfillment warehouse, 及 cheap cross docking service 专业理箱打托。',
          keywords: 'secure warehouse storage china, e-commerce order fulfillment warehouse, cheap cross docking service'
        },
        ru: {
          title: 'Услуги склада и консолидации в Гуанчжоу | Кросс-докинг',
          desc: 'Собственный склад в Гуанчжоу: secure warehouse storage china, e-commerce order fulfillment warehouse и надежный cheap cross docking service услуг.',
          keywords: 'secure warehouse storage china, e-commerce order fulfillment warehouse, cheap cross docking service'
        },
        fr: {
          title: 'Stockage de marchandises en Chine | Transit Express',
          desc: 'Espace secure warehouse storage china & e-commerce order fulfillment warehouse. Opération de cheap cross docking service rapide à Guangzhou.',
          keywords: 'secure warehouse storage china, e-commerce order fulfillment warehouse, cheap cross docking service'
        }
      }
    };

    const currentSEOVal = seoMeta[currentKey]?.[activeLang] || seoMeta[currentKey]?.['en'];
    if (currentSEOVal) {
      setCurrentSEO(currentSEOVal);
    }
  }, [serviceId, currentKey, activeLang]);

  useEffect(() => {
    if (state.succeeded) {
      trackEvent('service_page_rfq_success', { 'service': currentKey });
      setIsFormSubmitted(true);
    }
  }, [state.succeeded]);

  // Map serviceId to visual details
  const getServiceConfig = (sid: string) => {
    switch (sid) {
      case 'air-freight':
        return { icon: Plane, bgGrad: 'from-blue-600 to-indigo-800', accentText: 'text-blue-500', defaultTab: 'Air' };
      case 'amazon-fba':
        return { icon: BadgeCheck, bgGrad: 'from-orange-600 to-amber-800', accentText: 'text-amber-500', defaultTab: 'Sourcing' };
      case 'warehouse-services':
        return { icon: Ship, bgGrad: 'from-emerald-600 to-teal-800', accentText: 'text-emerald-500', defaultTab: 'Land' };
      default:
        return { icon: Ship, bgGrad: 'from-purple-600 to-indigo-900', accentText: 'text-purple-500', defaultTab: 'Sea' };
    }
  };

  const config = getServiceConfig(currentKey);
  const IconComponent = config.icon;

  const stepsLocal = activeLang === 'zh' ? [
    { num: '01', title: '咨询与测算', desc: '提交详实货物规格，测算最节省性价比的海卡空预备方案。' },
    { num: '02', title: '集运提货', desc: '安排中国核心厂区极速上门派卡提货，或者厂家直发到广州自建仓。' },
    { num: '03', title: '专业装包报关', desc: '自制免熏蒸工业木箱防护，出具九类鉴定与AEO绿色口岸快速报关。' },
    { num: '04', title: '海空陆中转运载', desc: '根据配舱舱位直航装柜远航，GPS实时跟进轨迹防损监控。' },
    { num: '05', title: '目的港双清', desc: '自有海外清关代理强悍操作，代为缴付关税、申报并极速免息放行。' },
    { num: '06', title: '末端安全派送', desc: '协议拖车整车配送上门、UPS直发递送网内亚马逊中心或境外海外仓。' }
  ] : activeLang === 'ru' ? [
    { num: '01', title: 'Запрос и Расчет', desc: 'Предоставьте параметры груза для подбора наиболее выгодного маршрута.' },
    { num: '02', title: 'Забор Груза', desc: 'Организуем самовывоз с фабрики в Китае или прием груза на нашем складе.' },
    { num: '03', title: 'Упаковка и Декларирование', desc: 'Прочная упаковка в ящики, оформление экспортной декларации.' },
    { num: '04', title: 'Транспортировка', desc: 'Вылет самолета или выход контейнера, отслеживание в пути.' },
    { num: '05', title: 'Таможенная очистка', desc: 'Наши брокеры оплачивают пошлины и выпускают груз в стране назначения.' },
    { num: '06', title: 'Доставка получателю', desc: 'Окончательная автодоставка до дверей склада или FBA Amazon.' }
  ] : activeLang === 'fr' ? [
    { num: '01', title: 'Demande et Analyse', desc: 'Spécifiez la grille de colisage pour calculer l\'itinéraire le plus éco-énergétique.' },
    { num: '02', title: 'Enlèvement Usine', desc: 'Collecte sécurisée par camion de Chine ou réception immédiate à notre hub.' },
    { num: '03', title: 'Crating & Déclaration', desc: 'Conditionnement des machines et dédouanement immédiat à la douane chinoise.' },
    { num: '04', title: 'Transport Océan/Air', desc: 'Départ direct et suivi dynamique des coordonnées de transport de la cargaison.' },
    { num: '05', title: 'Dédouanement Destination', desc: 'Paiement détaxé de droits et libération rapide par nos représentants douaniers.' },
    { num: '06', title: 'Livraison Rendu Porte', desc: 'Amorçage final par UPS ou transport de poids lourds sur votre site d\'entrepôt.' }
  ] : [
    { num: '01', title: 'Quote & Feasibility', desc: 'Submit dimensions and cargo descriptions for custom routing options.' },
    { num: '02', title: 'Pickup & Delivery', desc: 'Arrange cross-border truck pick up directly from regional manufacturers.' },
    { num: '03', title: 'Packing & Export Doc', desc: 'Custom export packing and smooth customs brokerage declaration.' },
    { num: '04', title: 'International Transit', desc: 'Secure loading into scheduled oceanic lanes or air freighter slots.' },
    { num: '05', title: 'Import Clearance', desc: 'Handling port duties prepayments and local customs release.' },
    { num: '06', title: 'Last-Mile Delivery', desc: 'Direct drop-off to Amazon hubs, private facilities, or sea ports.' }
  ];

  if (currentKey === 'air-freight') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar />

        {/* Block 1: Hero Banner */}
        <section className={`relative pt-32 pb-20 md:pb-32 bg-gradient-to-br from-blue-600 to-indigo-800 text-white overflow-hidden`}>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-35" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-orange-200 text-xs font-bold uppercase tracking-widest mb-6 border border-white/10">
                <Plane className="w-4 h-4 text-orange-400 rotate-12" />
                {data.tag}
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6 animate-fade-in">
                {data.title}
              </h1>
              <p className="text-blue-100 text-lg sm:text-xl font-medium leading-relaxed mb-8 max-w-2xl">
                {data.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a 
                  href="#rfq-form-section"
                  className="bg-gradient-to-r from-[#FF8A00] to-[#FF5500] hover:from-[#ff9c22] hover:to-[#ff6715] text-white font-bold px-8 py-4 rounded-xl text-center shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {activeLang === 'zh' ? '立即询本服务底价' : activeLang === 'ru' ? 'Запросить расчет' : activeLang === 'fr' ? 'Demander un tarif' : 'Get Firm Rate Now'}
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a 
                  href="https://wa.me/8613430335022" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-xl border border-emerald-500 shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Block 2: Why Choose Our Air Freight (4-Column Layout) */}
        <section className="py-16 md:py-24 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.advs.map((adv: any, index: number) => {
                const iconMap = [Zap, Globe, FileText, ShieldCheck];
                const Icon = iconMap[index % 4] || ShieldCheck;
                return (
                  <div 
                    key={index}
                    className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-blue-100 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-600">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-3 tracking-tight">
                      {adv.title}
                    </h3>
                    <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">
                      {adv.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Block 3: Service Options & Quick Facts (Dual Split) */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
              
              {/* Left Column: 5 Core Services */}
              <div className="lg:col-span-7">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                  {data.coreServices.title}
                </h2>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8 font-medium">
                  {data.coreServices.desc}
                </p>
                <div className="space-y-6">
                  {data.coreServices.items.map((sec: any, index: number) => (
                    <div key={index} className="flex gap-4 p-5 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-blue-100 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-blue-50/10 text-blue-600 flex items-center justify-center font-bold shrink-0 text-sm mt-0.5">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 mb-1">{sec.name}</h4>
                        <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">{sec.info || sec.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Air Quick Facts Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#4B27B1] to-[#361793] text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                <h3 className="text-2xl font-black tracking-tight mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-orange-400" fill="currentColor" />
                  {data.quickFacts.title}
                </h3>
                <ul className="space-y-4">
                  {data.quickFacts.points.map((pt: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm sm:text-base font-semibold text-purple-100">
                      <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* Block 4: Popular Lanes & Transit Times (Air Matrix) */}
        <section className="py-16 bg-slate-105 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">
                {data.lanes.title}
              </h2>
              <div className="h-1 w-16 bg-blue-600 mx-auto rounded-full" />
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-xs sm:text-sm uppercase tracking-wider">
                      {data.lanes.headers.map((h: string, idx: number) => (
                        <th key={idx} className="px-6 py-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm md:text-base font-semibold text-slate-600">
                    {data.lanes.rows.map((row: string[], idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-slate-900 font-bold flex items-center gap-2 select-none">
                          <span>✈️</span>
                          {row[0]}
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-mono text-sm">{row[1]}</td>
                        <td className="px-6 py-4 text-blue-700 font-mono text-sm font-semibold">{row[2]}</td>
                        <td className="px-6 py-4 text-slate-500 font-mono text-sm font-semibold">{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Block 5: How It Works (6-Step Dedicated Operational Workflow) */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 md:mb-24">
              <div className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-2">
                {activeLang === 'zh' ? '规范出飞流程' : activeLang === 'ru' ? 'ЭТАПЫ РАБОТЫ' : activeLang === 'fr' ? 'ÉTAPES CLÉS' : 'TRANSPARENT ROADMAP'}
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
                {activeLang === 'zh' ? '华正邦泰专属 6 步快飞流程' : activeLang === 'ru' ? 'Как осуществляется авиадоставка' : activeLang === 'fr' ? 'Fret en 6 Étapes Célestes' : 'Standard 1-to-6 Air Cargo Cycle'}
              </h2>
              <div className="h-1.5 w-16 bg-gradient-to-r from-blue-600 to-indigo-800 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 relative">
              {data.workflow.map((step: any, index: number) => (
                <div 
                  key={index} 
                  className="relative bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg hover:border-blue-100 transition-all group"
                >
                  <div className="absolute top-4 right-6 text-4xl sm:text-5xl font-black text-slate-200/60 group-hover:text-blue-500/10 select-none transition-colors">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-sm md:text-base leading-relaxed font-semibold">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Block 6: Value-Added Services (Air Logistics Specifics) */}
        <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-slate-900 mb-4">{data.valueAdded.title}</h2>
              <p className="text-slate-600 max-w-2xl mx-auto font-medium text-sm sm:text-base">{data.valueAdded.desc}</p>
              <div className="h-1 w-12 bg-blue-600 mx-auto mt-4 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.valueAdded.items.map((item: any, idx: number) => {
                const icons = [Landmark, Package, ShieldCheck, Thermometer];
                const CustomIcon = icons[idx % 4] || Landmark;
                return (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
                      <CustomIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Lead Capture and Request form */}
        <section id="rfq-form-section" className="py-16 md:py-24 bg-blue-50/25 border-t border-blue-105">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                {activeLang === 'zh' ? '获取空运敏捷方案的专享评估' : activeLang === 'ru' ? 'Заказать этот сервис авиаперевозки' : activeLang === 'fr' ? 'Dossier de Devis Fret Aérien' : 'Request an Air Freight Service Quote'}
              </h2>
              <p className="text-slate-500 font-medium text-sm md:text-base">
                {t('get_a_quote.formSubtitle')}
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-blue-100 shadow-xl p-8 sm:p-10 relative overflow-hidden">
              {!isFormSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {t('get_a_quote.mode')}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'Sea', label: t('get_a_quote.modeSea') },
                        { id: 'Land', label: t('get_a_quote.modeLand') },
                        { id: 'Air', label: t('get_a_quote.modeAir') },
                        { id: 'Sourcing', label: activeLang === 'zh' ? '采购验货集运' : 'Sourcing/Prep' }
                      ].map((item) => {
                        const isSelected = selectedService === item.id || (selectedService === 'Sea' && item.id === 'Air'); // preset default style to Air on Air Freight detail page
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedService(item.id)}
                            className={`py-2.5 px-3 rounded-lg border-2 transition-all flex items-center justify-center font-bold text-xs sm:text-sm ${
                              (selectedService === 'Sea' ? item.id === 'Air' : selectedService === item.id)
                                ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' 
                                : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 font-medium'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                    <input type="hidden" name="service" value={selectedService === 'Sea' ? 'Air' : selectedService} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="origin" className="block text-sm font-bold text-slate-700 mb-1">
                        {t('get_a_quote.originLabel')}
                      </label>
                      <input
                        id="origin"
                        name="origin"
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-600 outline-none font-semibold text-sm transition-all"
                        placeholder={t('get_a_quote.originPlaceholder')}
                      />
                    </div>
                    <div>
                      <label htmlFor="destination" className="block text-sm font-bold text-slate-700 mb-1">
                        {t('get_a_quote.destLabel')}
                      </label>
                      <input
                        id="destination"
                        name="destination"
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-600 outline-none font-semibold text-sm transition-all"
                        placeholder={t('get_a_quote.destPlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="comp" className="block text-sm font-bold text-slate-700 mb-1">
                      {activeLang === 'zh' ? '主营物资品类/电池参数' : activeLang === 'ru' ? 'Категория груза / Характеристики' : activeLang === 'fr' ? 'Type de marchandises' : 'Cargo Category'}
                    </label>
                    <select
                      id="comp"
                      name="product"
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-600 outline-none font-semibold text-sm transition-all"
                    >
                      <option value="New Energy / ESS">{t('get_a_quote.indNev')}</option>
                      <option value="Commercial Furniture">{t('get_a_quote.indFurn')}</option>
                      <option value="Project Cargo">{t('get_a_quote.indProject')}</option>
                      <option value="Other">{t('get_a_quote.indOther')}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="msg" className="block text-sm font-bold text-slate-700 mb-1">
                      {t('get_a_quote.cargo')}
                    </label>
                    <textarea
                      id="msg"
                      name="cargo"
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-600 outline-none font-semibold text-sm transition-all"
                      placeholder={t('get_a_quote.cargoPlaceholder')}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1">
                        {t('get_a_quote.emailLabel')}
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-600 outline-none font-semibold text-sm transition-all"
                        placeholder="yourname@company.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-1">
                        {t('get_a_quote.phoneLabel')}
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-600 outline-none font-semibold text-sm transition-all"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={state.submitting}
                      className="w-full bg-[#FF8A00] hover:bg-[#FF5500] text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all focus:ring-4 focus:ring-orange-200 disabled:opacity-50"
                    >
                      {state.submitting 
                        ? (activeLang === 'zh' ? '正在提交...' : activeLang === 'ru' ? 'Отправка...' : activeLang === 'fr' ? 'Envoi...' : 'Submitting Cargo Plan...') 
                        : (activeLang === 'zh' ? '提交空运快报询盘' : activeLang === 'ru' ? 'Отправить запрос на расчет' : activeLang === 'fr' ? 'Valider la Demande' : 'Submit My Air Freight RFQ')}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                     <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">
                    {activeLang === 'zh' ? '您的询盘已递交给 华正邦泰 调度小组！' : activeLang === 'ru' ? 'Ваш запрос успешно отправлен!' : activeLang === 'fr' ? 'Votre demande de fret est enregistrée !' : 'Your Air Freight RFQ Appreciated!'}
                  </h3>
                  <p className="text-slate-500 font-semibold mb-6 max-w-md mx-auto text-sm sm:text-base">
                    {activeLang === 'zh' ? '我们经验丰富的空中走廊承配人将在 2 小时内安排专属卡车及班机测算计划，并在您的邮箱中呈现最省钱的费率和最迅速的路线方案。' : activeLang === 'ru' ? 'Наши авиаспециалисты подготовят коммерческое предложение и свяжутся с вами в течение 2 часов.' : activeLang === 'fr' ? 'Nos répartiteurs aériens préparent votre calcul de densité et vous reviendront avec les meilleurs plans d\'enlèvement d\'ici 2 heures.' : 'Our route agents are crunching numbers and and will deliver custom air pathways directly to your inbox within the next 2 hours.'}
                  </p>
                  <button 
                    onClick={() => setIsFormSubmitted(false)}
                    className="text-[#4B27B1] hover:text-[#361793] font-bold text-sm underline"
                  >
                    {activeLang === 'zh' ? '返回提单页面' : activeLang === 'ru' ? 'Вернуться назад' : activeLang === 'fr' ? 'Retour aux détails' : 'Go Back to Service Details'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  if (currentKey === 'amazon-fba') {
    const fbaData = {
      en: {
        hero: {
          title: 'Amazon FBA Shipping from China',
          subtitle: 'Professional FBA prep, labeling, and delivery to Amazon fulfillment centers worldwide with duty prepaid (DDP).',
          tag: 'Specialized E-Commerce Logistics',
        },
        solutions: {
          title: 'Complete Amazon FBA Solutions',
          desc: 'Streamline your Amazon business with our comprehensive FBA shipping services. From supplier pickup in China to Amazon warehouse delivery, we handle every step of your FBA logistics.',
          pillars: [
            { title: 'FBA Prep Services', desc: 'Professional labeling, packaging, and preparation according to Amazon requirements.' },
            { title: 'Direct to Amazon', desc: 'Scheduled deliveries to Amazon fulfillment centers with appointment booking.' },
            { title: 'Customs Clearance', desc: 'Expert handling of import procedures and customs documentation.' },
            { title: 'Real-time Tracking', desc: 'Monitor your shipments from China to Amazon warehouses with live updates.' }
          ]
        },
        quickFacts: {
          title: 'FBA Quick Facts',
          points: [
            'Amazon-compliant labeling and packaging',
            'Direct delivery to 200+ Amazon warehouses',
            'Appointment scheduling included',
            'Palletizing and consolidation services',
            'Insurance coverage available',
            'Multi-channel fulfillment support'
          ]
        },
        workflow: {
          title: 'Our FBA Process (6-Step Matrix)',
          desc: 'A streamlined 6-step process to get your products from Chinese suppliers to Amazon warehouses efficiently.',
          steps: [
            { num: '01', title: 'Supplier Pickup', desc: 'We collect your products from suppliers across China and transport to our Guangzhou hub.' },
            { num: '02', title: 'Quality Inspection', desc: 'Thorough quality check and inventory count before FBA preparation begins.' },
            { num: '03', title: 'FBA Preparation', desc: 'Amazon-compliant labeling, packaging, and palletizing according to FBA requirements.' },
            { num: '04', title: 'Customs Clearance', desc: 'Expert handling of import documentation and customs procedures.' },
            { num: '05', title: 'Appointment Booking', desc: 'Schedule delivery appointments with Amazon fulfillment centers.' },
            { num: '06', title: 'Amazon Delivery', desc: 'Final delivery to Amazon warehouses with proof of delivery confirmation.' }
          ]
        },
        services: {
          title: 'FBA Services We Offer',
          desc: 'Comprehensive Amazon FBA logistics solutions tailored to your e-commerce inventory requirements.',
          badges: [
            { title: 'FBA Labeling', desc: 'Amazon-compliant FNSKU labeling and barcode application for all your products.' },
            { title: 'Repackaging', desc: 'Professional repackaging to meet Amazon\'s packaging requirements and standards.' },
            { title: 'Palletizing', desc: 'Efficient palletizing and consolidation to optimize shipping costs and handling.' },
            { title: 'Storage', desc: 'Secure warehouse storage while preparing shipments and coordinating deliveries.' }
          ]
        },
        rates: {
          title: 'FBA Shipping Rates Matrix',
          desc: 'Competitive pricing for Amazon FBA shipping with transparent costs and no hidden fees.',
          headers: ['Shipping Mode', 'Transit Time', 'Minimum', 'Included Service Details'],
          rows: [
            ['Sea Freight FBA', '25-35 Days', '100 Kg', 'Includes FBA prep + delivery (Supplier pickup, FBA labeling & prep, Customs clearance, Amazon delivery).'],
            ['Air Freight FBA (MOST POPULAR)', '7-12 Days', '50 Kg', 'Includes FBA prep + delivery (Fast flight transport, priority clearance + express/LTL delivery).'],
            ['Express FBA', '3-5 Days', '20 Kg', 'Includes FBA prep + delivery (Direct flight courier priority, instant clearance, no appointments needed).']
          ]
        },
        warehouses: {
          title: 'FBA Warehouses We Deliver To',
          desc: 'We provide direct delivery services to Amazon FBA warehouses across multiple countries, ensuring your products reach their destination quickly and safely.',
          regions: [
            { name: 'United States (Amazon.com)', items: 'California (LAX9, ONT8, LGB8), Texas (DFW7, HOU2), New York (JFK8), Florida (MIA1, TPA2), Illinois (ORD2, MDW2)' },
            { name: 'United Kingdom (Amazon.co.uk)', items: 'England (LHR4, MAN1), Scotland (EDI4, GLA1), Wales (CWL1), Northern Ireland (BFS1)' },
            { name: 'Germany (Amazon.de)', items: 'Frankfurt (FRA1, FRA3), Munich (MUC3), Berlin (BER3), Hamburg (HAM2)' },
            { name: 'Canada (Amazon.ca)', items: 'Toronto (YYZ4, YYZ7), Vancouver (YVR4), Montreal (YUL2), Calgary (YYC1)' },
            { name: 'Australia (Amazon.com.au)', items: 'Sydney (SYD1, SYD2), Melbourne (MEL1), Brisbane (BNE1), Perth (PER1)' },
            { name: 'Japan (Amazon.co.jp)', items: 'Tokyo (NRT5, HND3), Osaka (KIX2), Nagoya (NGO2), Fukuoka (FUK1)' }
          ]
        }
      },
      zh: {
        hero: {
          title: '亚马逊 FBA 跨境电商头程物流',
          subtitle: '专业的一站式 FBA 贴标、包装准备及双清包税 (DDP) 派送，直达全球亚马逊海外运营中心。',
          tag: '高标准跨境电商全程履约通道',
        },
        solutions: {
          title: '亚马逊 FBA 综合物流解决方案',
          desc: '通过我们全面无忧的 FBA 货运代理方案，大幅简化您的亚马逊跨国业务。从中国供应商提货到海外 FBA 库房接收，我们悉心掌控全程每个物流节点。',
          pillars: [
            { title: 'FBA 包装准备服务', desc: '根据亚马逊平台的严苛标准，进行高规格的商品加固、合规防跌落外箱贴标与清点。' },
            { title: '直发亚马逊库房', desc: '固定班期直接打托派送，与各大运营中心系统对接，完成无缝预约和入仓。' },
            { title: '双清包税全程无忧', desc: '由自营关务代理全程负责出口退税与进口申报，无须卖家出任进口商，代理交纳税金。' },
            { title: '全程可视化追踪', desc: '实时掌控从中国自营仓库至目的国亚马逊货架的仓储、海空干线与尾端派送详情。' }
          ]
        },
        quickFacts: {
          title: 'FBA 核心要素说明',
          points: [
            '完美契合亚马逊标准的 FNSKU 条形码标签贴标与复核',
            '直发覆盖全球 200 多个活跃的亚马逊主要运营中心',
            '包含目的港卡车打托装车和 CARP 服务系统预订预约',
            '提供标准的打托、木卡板租赁和集运拼箱增值操作',
            '支持投保全损运输险以全面规避货损与拒收风险',
            '支持多平台海外仓中转调拨和全渠道一件代发支持'
          ]
        },
        workflow: {
          title: 'FBA 专属 6 步履约流程',
          desc: '高效顺畅的六步干线闭环，确保您的产品由中国工厂以极具性价比的方案安全交付至亚马逊接收窗口。',
          steps: [
            { num: '01', title: '国内供应商提货', desc: '协议重卡前往您在全国各地的供应商厂区，或支持发货至我们广州 18 年自营中心大仓。' },
            { num: '02', title: '入仓质检查验', desc: '在准备 FBA 发运前，进行细致的外观检查、包装完整度核验以及基础清点。' },
            { num: '03', title: '亚马逊合规包装', desc: '精确黏贴产品标签、外箱超重标、缠绕防潮膜，并进行标准熏蒸木托盘打包。' },
            { num: '04', title: '海关双清申报', desc: '专业的进出口货申报，提交合规通关文件，一揽子搞定关税代理缴纳。' },
            { num: '05', title: '分配预约入仓', desc: '通过专属承配人账号预先在亚马逊系统内取得送舱槽位预约，缩短等待时效。' },
            { num: '06', title: '安全派送完结', desc: '尾端通过协议卡车或 UPS 派送入库，获取亚马逊接收签收单证明（POD）。' }
          ]
        },
        services: {
          title: '我们提供的核心 FBA 服务',
          desc: '一站式精细化仓储与物流操作，全面破除跨境卖家的后顾之忧。',
          badges: [
            { title: '专业 FBA 贴标', desc: '依照最新的亚马逊规定，合规张贴 FNSKU 精准条形码与箱标。' },
            { title: '外箱重新包装', desc: '针对受损的原厂纸箱提供换箱和安全防跌落加固，符合入仓拒收红线。' },
            { title: '木托打托托盘化', desc: '选用合规材质进行严密的托盘打包，方便码头插爪卸载和高标货架入仓。' },
            { title: '安全仓储缓冲', desc: '提供长短期低成本库房，方便您在销售旺季合理规划调拨节奏和备货。' }
          ]
        },
        rates: {
          title: 'FBA 电商多式联运价目矩阵',
          desc: '极具市场竞争优势的跨境头程资费，费用透明、绝无隐性增收。',
          headers: ['运输方式', '预计时效', '起运门槛', '包含的服务细节'],
          rows: [
            ['FBA 海运卡派/普派', '25-35 天', '100 公斤', '一站式包税送货到门（包含国内工厂提货、FBA 贴标与查验、出口申报、海运、双清、海外卡派）。'],
            ['FBA 空派包税专线（爆款主推）', '7-12 天', '50 公斤', '优先装运班机（包含高速空运干线、目的港急速清关及最后一英里快递或卡派）。'],
            ['FBA 国际快递直达', '3-5 天', '20 公斤', '免预约优先清关放行，首班直飞大洋彼岸快递网点联运，直插运营中心。']
          ]
        },
        warehouses: {
          title: '直接覆盖配送的亚马逊热门仓库',
          desc: '承运范围直接精准配载至以下国家和地区的核心库房，确保货物平稳、合规移交。',
          regions: [
            { name: '美国站点 (Amazon.com)', items: '加利福尼亚州 (LAX9, ONT8, LGB8), 德克萨斯州 (DFW7, HOU2), 纽约州 (JFK8), 佛罗里达州 (MIA1, TPA2), 伊利诺伊州 (ORD2, MDW2)' },
            { name: '英国站点 (Amazon.co.uk)', items: '英格兰 (LHR4, MAN1), 苏格兰 (EDI4, GLA1), 威尔士 (CWL1), 北爱尔兰 (BFS1)' },
            { name: '德国站点 (Amazon.de)', items: '法兰к福 (FRA1, FRA3), 慕尼黑 (MUC3), 柏林 (BER3), 汉堡 (HAM2)' },
            { name: '加拿大站点 (Amazon.ca)', items: '多伦多 (YYZ4, YYZ7), 温哥华 (YVR4), 蒙特利尔 (YUL2), 卡尔加里 (YYC1)' },
            { name: '澳大利亚站点 (Amazon.com.au)', items: '悉尼 (SYD1, SYD2), 墨尔本 (MEL1), 布里斯班 (BNE1), 珀斯 (PER1)' },
            { name: '日本站点 (Amazon.co.jp)', items: '东京 (NRT5, HND3), 大阪 (KIX2), 名古屋 (NGO2), 福冈 (FUK1)' }
          ]
        }
      },
      ru: {
        hero: {
          title: 'Доставка Amazon FBA из Китая',
          subtitle: 'Профессиональная подготовка, маркировка FNSKU и доставка на склады Amazon по всему миру по программе DDP (все пошлины уплачены).',
          tag: 'Специализированная логистика e-Commerce',
        },
        solutions: {
          title: 'Комплексные решения для Amazon FBA',
          desc: 'Оптимизируйте свой e-commerce бизнес на Amazon с помощью наших комплексных логистических услуг. От забора товара у поставщика в Китае до финальной приемки на складах Amazon — мы берем на себя каждый этап.',
          pillars: [
            { title: 'Подготовка и Prep-услуги', desc: 'Профессиональное наклеивание этикеток, проверка упаковки и паллетирование в соответствии со строгими правилами Amazon.' },
            { title: 'Прямая доставка на склады', desc: 'Регулярная бережная доставка на фулфилмент-центры Amazon со своевременным бронированием слотов.' },
            { title: 'Таможенное оформление', desc: 'Профессиональное ведение импортных и экспортных процедур, уплата всех налогов и пошлин нашей компанией.' },
            { title: 'Отслеживание груза', desc: 'Контролируйте перемещение ваших товаров из Китая на склады Amazon в режиме реального времени.' }
          ]
        },
        quickFacts: {
          title: 'Ключевые факты об FBA',
          points: [
            'Маркировка FNSKU и стикерование коробок по стандартам Amazon',
            'Прямая доставка в более чем 200 крупных фулфилмент-центров',
            'Самостоятельное бронирование слотов выгрузки включено в тариф',
            'Формирование стандартных паллет и консолидация на нашем складе',
            'Возможность оформления надежного страхования от повреждений',
            'Полная поддержка мультизонального распределения e-commerce'
          ]
        },
        workflow: {
          title: 'Процесс доставки FBA (6 простых шагов)',
          desc: 'Надежная цепочка из шести этапов, обеспечивающая быструю и экономичную доставку вашей продукции напрямую от китайских заводов в руки Amazon.',
          steps: [
            { num: '01', title: 'Забор у поставщика', desc: 'Забираем готовый груз с фабрик в любых провинциях Китая и доставляем на наш склад в Гуанчжоу.' },
            { num: '02', title: 'Контроль качества', desc: 'Проводим тщательный визуальный осмотр и сверку количества перед проведением FBA подготовки.' },
            { num: '03', title: 'Подготовка FBA', desc: 'Наклеиваем штрихкоды, укладываем в новые коробки, оборачиваем паллеты стрейч-пленкой.' },
            { num: '04', title: 'Экспорт и растаможка', desc: 'Занимаемся оформлением экспортных документов и таможенной очисткой на стороне прибытия.' },
            { num: '05', title: 'Бронирование слота', desc: 'Получаем авторизованную дату и время выгрузки в системе CARP / Carrier Central.' },
            { num: '06', title: 'Доставка Amazon', desc: 'Осуществляем финальную доставку товара собственными грузовиками и передаем POD-документы.' }
          ]
        },
        services: {
          title: 'Наши специализированные услуги FBA',
          desc: 'Комплексный сервис для розничных продавцов и дистрибьюторов e-commerce, гарантирующий отсутствие штрафов при приемке.',
          badges: [
            { title: 'Стикерование FNSKU', desc: 'Точное нанесение индивидуальных штрихкодов товаров и наклеек «сверхтяжелый груз».' },
            { title: 'Замена поврежденных коробок', desc: 'Оперативный переупаковочный сервис для избежания дорогостоящих отказов склада Amazon.' },
            { title: 'Сборка деревянных паллет', desc: 'Размещение на новых прочных поддонах с соблюдением требований к высоте и массе.' },
            { title: 'Буферное хранение', desc: 'Надежный складской буфер для постепенной отправки партий в пиковые сезоны продаж.' }
          ]
        },
        rates: {
          title: 'Матрица стоимости тарифов FBA',
          desc: 'Выгодные и гибкие расценки на доставку с прозрачной калькуляцией без скрытых комиссий.',
          headers: ['Тип перевозки', 'Сроки доставки', 'Минимум', 'Что включено'],
          rows: [
            ['Морской фрахт FBA DDP', '25-35 дней', '100 кг', 'Доставка под ключ (забор у поставщика, стикерование FNSKU, экспорт, страхование, растаможка, кар-пай доставка).'],
            ['Авиадоставка FBA DDP (Топ продаж)', '7-12 дней', '50 кг', 'Быстрые авиалинии (забор со склада, экспресс-перелет, таможня, приоритетный слот выгрузки, UPS-доставка).'],
            ['Экспресс-доставка FBA', '3-5 дней', '20 кг', 'Курьерская доставка приоритетными рейсами без необходимости ожидания слотов букинга.']
          ]
        },
        warehouses: {
          title: 'Популярные склады Amazon, куда мы доставляем',
          desc: 'Ваши товары будут успешно экспортированы и приняты без задержек в следующих основных логистических регионах Amazon:',
          regions: [
            { name: 'США (Amazon.com)', items: 'Калифорния (LAX9, ONT8, LGB8), Техас (DFW7, HOU2), Нью-Йорк (JFK8), Флорида (MIA1, TPA2), Иллинойс (ORD2, MDW2)' },
            { name: 'Великобритания (Amazon.co.uk)', items: 'Англия (LHR4, MAN1), Шотландия (EDI4, GLA1), Уэльс (CWL1), Северная Ирландия (BFS1)' },
            { name: 'Германия (Amazon.de)', items: 'Франкфурт (FRA1, FRA3), Мюнхен (MUC3), Берлин (BER3), Гамбург (HAM2)' },
            { name: 'Канада (Amazon.ca)', items: 'Торонто (YYZ4, YYZ7), Ванкувер (YVR4), Монреаль (YUL2), Калгари (YYC1)' },
            { name: 'Австралия (Amazon.com.au)', items: 'Сидней (SYD1, SYD2), Мельбурн (MEL1), Брисбена (BNE1), Перт (PER1)' },
            { name: 'Япония (Amazon.co.jp)', items: 'Токио (NRT5, HND3), Осака (KIX2), Нагоя (NGO2), Фукуока (FUK1)' }
          ]
        }
      },
      fr: {
        hero: {
          title: 'Expédition Amazon FBA depuis la Chine',
          subtitle: 'Préparation FBA professionnelle, étiquetage FNSKU et livraison directe aux entrepôts Amazon du monde entier en DDP clé en main.',
          tag: 'Logistique E-Commerce Spécialisée',
        },
        solutions: {
          title: 'Solutions Logistiques Complètes Amazon FBA',
          desc: 'Boostez votre activité sur Amazon grâce à notre service de transport FBA tout-en-un. De la collecte fournisseur en Chine à la livraison finale, nous gérons chaque étape de votre logistique e-commerce.',
          pillars: [
            { title: 'Services de Préparation FBA', desc: 'Étiquetage rigoureux, suremballage et préparation conformes aux consignes strictes d\'Amazon.' },
            { title: 'Livraison Directe Amazon', desc: 'Acheminement planifié vers les centres de distribution Amazon avec prise de rendez-vous fluide.' },
            { title: 'Dédouanement Complet', desc: 'Gestion administrative experte, détaxation et règlement anticipé de l\'ensemble des droits de douanes (DDP).' },
            { title: 'Suivi de Livraison Actif', desc: 'Suivez vos colis e-commerce en temps réel de nos terminaux chinois jusqu\'aux étagères de stockage.' }
          ]
        },
        quickFacts: {
          title: 'Points Forts Amazon FBA',
          points: [
            'Étiquetage de codes FNSKU et cartons d\'expédition 100 % réglementaires',
            'Accès direct à plus de 200 centres de distribution Amazon actifs',
            'Gestion intégrée des rendez-vous via les plateformes de réservation (CARP)',
            'Palettisation robuste et groupage maritime à notre entrepôt propre',
            'Assurance transport incluse pour couvrir les détériorations potentielles',
            'Compatibilité avec le déploiement multi-plateformes et de stockage tampon'
          ]
        },
        workflow: {
          title: 'Notre Processus de Distribution FBA en 6 Étapes',
          desc: 'Découvrez notre parcours de transit fluide et optimisé pour faire voyager vos marchandises de l\'usine d\'origine aux centres FBA.',
          steps: [
            { num: '01', title: 'Collecte Usine', desc: 'Nous récupérons vos stocks directement chez votre fabricant ou consolidons le tout dans notre hub de Guangzhou.' },
            { num: '02', title: 'Contrôle à la Réception', desc: 'Audit dimensionnel complet et comptage de l\'inventaire physique pour exclure des erreurs.' },
            { num: '03', title: 'Préparation Normative', desc: 'Pose des codes à barres, application des étiquettes d\'avertissement et conditionnement sécurisé sur palettes.' },
            { num: '04', title: 'Export & Douanes', desc: 'Prise en charge douanière complète à l\'exportation de Chine et dédouanement import.' },
            { num: '05', title: 'Création de Rdv FBA', desc: 'Planification d\'un créneau horaire d\'évacuation certifié dans les systèmes logistiques d\'Amazon.' },
            { num: '06', title: 'Livraison Validée', desc: 'Déchargement par transporteurs agréés avec récupération de la preuve de livraison visée (POD).' }
          ]
        },
        services: {
          title: 'Nos Services de Prep et d\'Acheminement',
          desc: 'Un accompagnement logistique hautement qualitatif conçu pour éradiquer les risques de refus d\'expédition par Amazon.',
          badges: [
            { title: 'Étiquetage FNSKU', desc: 'Saisie de vos codes produits et étiquetage conforme exigé pour l\'entrée en terminal FBA.' },
            { title: 'Aiguillage et Reconditionnement', desc: 'Changement de carton ou renforcement de la protection de colis pour éviter les écrasements en transit.' },
            { title: 'Palettisation Standardisée', desc: 'Fabrication de palettes d\'exportation robustes et adaptées pour un déchargement sécurisé.' },
            { title: 'Entreposage Local Flex', desc: 'Espace de stockage modulable pour réguler vos envois au gré des dynamiques de vos ventes.' }
          ]
        },
        rates: {
          title: 'Grille des Tarifs de Transport FBA',
          desc: 'Des tarifs ultra-compétitifs et totalement transparents sans aucune surprise ni frais masqué.',
          headers: ['Mode d\'Expédition', 'Durée Estimée', 'Poids Minimum', 'Services Intégrés Clé en Main'],
          rows: [
            ['Fret Maritime FBA DDP', '25-35 Jours', '100 Kg', 'Livraison porte-à-porte globale (collecte, Prep FBA et étiquetage, export, fret mer, dédouanement et transport final).'],
            ['Fret Aérien FBA DDP (Option Reine)', '7-12 Jours', '50 Kg', 'Transit aérien express (collecte, routage prioritaire par compagnies partenaires, dédouanement fluide et livraison finale).'],
            ['Express International FBA', '3-5 Jours', '20 Kg', 'Option de messagerie express sans intermédiaire, idéale pour un approvisionnement immédiat sans réservation de créneau.']
          ]
        },
        warehouses: {
          title: 'Entrepôts Amazon FBA Principaux Desservis',
          desc: 'Nous desservons en direct et de manière hebdomadaire les plus grands hubs de distribution e-commerce mondiaux :',
          regions: [
            { name: 'États-Unis (Amazon.com)', items: 'Californie (LAX9, ONT8, LGB8), Texas (DFW7, HOU2), New York (JFK8), Floride (MIA1, TPA2), Illinois (ORD2, MDW2)' },
            { name: 'Royaume-Uni (Amazon.co.uk)', items: 'Angleterre (LHR4, MAN1), Écosse (EDI4, GLA1), Pays de Galles (CWL1), Irlande du Nord (BFS1)' },
            { name: 'Allemagne (Amazon.de)', items: 'Francfort (FRA1, FRA3), Munich (MUC3), Berlin (BER3), Hambourg (HAM2)' },
            { name: 'Canada (Amazon.ca)', items: 'Toronto (YYZ4, YYZ7), Vancouver (YVR4), Montréal (YUL2), Calgary (YYC1)' },
            { name: 'Australie (Amazon.com.au)', items: 'Sydney (SYD1, SYD2), Melbourne (MEL1), Brisbane (BNE1), Perth (PER1)' },
            { name: 'Japon (Amazon.co.jp)', items: 'Tokyo (NRT5, HND3), Osaka (KIX2), Nagoya (NGO2), Fukuoka (FUK1)' }
          ]
        }
      }
    };

    const fba = fbaData[activeLang as 'en' | 'zh' | 'ru' | 'fr'] || fbaData.en;

    const renderWarehouseItems = (itemsStr: string) => {
      const parts = itemsStr.split(/\),\s*/);
      return (
        <div className="flex flex-col gap-4 mt-2">
          {parts.map((part, pIdx) => {
            if (!part.trim()) return null;
            const normalized = part.endsWith(')') ? part : part + ')';
            const match = normalized.match(/(.*?)\s*\((.*?)\)/);
            if (match) {
              const areaName = match[1].trim();
              const codes = match[2].split(/,\s*/);
              return (
                <div key={pIdx} className="relative pl-3.5 pb-3 border-b border-slate-100/80 last:border-b-0 last:pb-0">
                  {/* Decorative vertical line representing localization hubs branch */}
                  <div className="absolute left-0 top-1 bottom-3 w-0.5 bg-gradient-to-b from-[#4B27B1]/80 to-purple-200/30 rounded-full" />
                  
                  <span className="text-xs font-extrabold text-slate-700 tracking-wider block mb-2 uppercase">
                    {areaName}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {codes.map((code, cIdx) => (
                      <span
                        key={cIdx}
                        className="inline-flex items-center px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-[#4B27B1] text-[#4B27B1] hover:text-white text-xs font-mono font-black border border-purple-100 shadow-sm hover:shadow transition-all duration-200 tracking-wider select-all cursor-pointer"
                        title={activeLang === 'zh' ? '点击可直接选取复制' : 'Click to select and copy'}
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <div key={pIdx} className="text-xs text-slate-500 font-medium pl-3.5">
                {part}
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar />

        {/* Block 1: Hero Banner */}
        <section className="relative pt-32 pb-20 md:pb-32 bg-gradient-to-br from-[#4B27B1] to-[#2D1375] text-white overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-orange-300 text-xs font-bold uppercase tracking-widest mb-6 border border-white/5">
                <Package className="w-4 h-4 text-orange-400" />
                {fba.hero.tag}
              </span>
              <h1 className={activeLang === 'zh' ? "text-[6.6vw] sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6 leading-none whitespace-nowrap" : "text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6 leading-none"}>
                {fba.hero.title}
              </h1>
              <p className="text-purple-100 text-lg sm:text-xl font-medium leading-relaxed mb-8 max-w-2xl">
                {fba.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a 
                  href="#rfq-form-section"
                  className="bg-gradient-to-r from-[#FF8A00] to-[#FF5500] hover:from-[#ff9c22] hover:to-[#ff6715] text-white font-bold px-8 py-4 rounded-xl text-center shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {activeLang === 'zh' ? '立即获取FBA头程底价' : activeLang === 'ru' ? 'Запросить расчет' : activeLang === 'fr' ? 'Demander un devis FBA' : 'Get FBA Rates Now'}
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a 
                  href="https://wa.me/8613430335022" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-xl border border-emerald-500 shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Block 2: Solutions Pillars */}
        <section className="py-16 md:py-24 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">{fba.solutions.title}</h2>
              <p className="text-slate-500 font-semibold text-sm sm:text-base leading-relaxed">{fba.solutions.desc}</p>
              <div className="h-1 w-16 bg-[#4B27B1] mx-auto mt-4 rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {fba.solutions.pillars.map((pillar, idx) => {
                const icons = [ShieldCheck, Truck, Landmark, Clock];
                const CustomIcon = icons[idx % 4] || ShieldCheck;
                return (
                  <div key={idx} className="p-8 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-[#4B27B1]/30 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-[#4B27B1]/10 flex items-center justify-center mb-6 text-[#4B27B1]">
                      <CustomIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">{pillar.title}</h3>
                    <p className="text-slate-500 text-sm font-semibold leading-relaxed">{pillar.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Block 3: FBA Services & Quick Facts (Dual Split) */}
        <section className="py-16 md:py-24 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left: Services We Offer */}
              <div className="lg:col-span-7">
                <h2 className="text-3xl font-black text-slate-900 mb-4">{fba.services.title}</h2>
                <p className="text-slate-500 font-semibold mb-8 text-sm sm:text-base">{fba.services.desc}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {fba.services.badges.map((badge, idx) => (
                    <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <span className="text-orange-500">✓</span>
                        {badge.title}
                      </h4>
                      <p className="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed">{badge.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Quick Facts Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#4B27B1] to-[#361793] text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                <h3 className="text-2xl font-black tracking-tight mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-orange-400" fill="currentColor" />
                  {fba.quickFacts.title}
                </h3>
                <div className="h-1 w-12 bg-orange-400 rounded-full mb-8" />
                <ul className="space-y-4">
                  {fba.quickFacts.points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-purple-100">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5 text-xs text-orange-300 font-bold">
                        ✓
                      </div>
                      <span className="text-sm md:text-base leading-relaxed font-semibold">
                        {pt}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* Block 4: FBA Rates Matrix Table */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-black text-slate-900 mb-3">{fba.rates.title}</h2>
              <p className="text-slate-500 font-semibold text-sm sm:text-base leading-relaxed">{fba.rates.desc}</p>
              <div className="h-1 w-16 bg-[#4B27B1] mx-auto mt-4 rounded-full" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-750 font-bold text-xs sm:text-sm uppercase tracking-wider">
                      {fba.rates.headers.map((h, idx) => (
                        <th key={idx} className="px-6 py-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm md:text-base font-semibold text-slate-600">
                    {fba.rates.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-slate-900 font-bold flex items-center gap-2">
                          <span>📦</span>
                          {row[0]}
                        </td>
                        <td className="px-6 py-4 text-[#4B27B1] font-bold font-mono text-sm">{row[1]}</td>
                        <td className="px-6 py-4 text-orange-600 font-black font-mono text-sm">{row[2]}</td>
                        <td className="px-6 py-4 text-slate-500 text-xs sm:text-sm leading-relaxed">{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Block 5: Operational FBA Process (6 Steps Grid) */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
                {fba.workflow.title}
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto font-semibold text-sm sm:text-base">{fba.workflow.desc}</p>
              <div className="h-1.5 w-16 bg-gradient-to-r from-[#4B27B1] to-orange-500 mx-auto mt-4 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              {fba.workflow.steps.map((step, idx) => (
                <div 
                  key={idx} 
                  className="relative bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-xl hover:border-[#4B27B1]/30 transition-all group"
                >
                  <div className="absolute top-4 right-6 text-4xl sm:text-5xl font-black text-slate-200/60 group-hover:text-[#4B27B1]/10 select-none transition-colors">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#4B27B1] transition-colors mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Block 6: Warehouses We Deliver To list Grid */}
        <section className="py-20 bg-slate-50 border-t border-slate-200/60 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b from-slate-100/50 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/80 text-[#4B27B1] text-xs font-extrabold uppercase tracking-widest mb-4">
                Global Coverage
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                {fba.warehouses.title}
              </h2>
              <p className="text-slate-500 font-semibold text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                {fba.warehouses.desc}
              </p>
              <div className="h-1.5 w-16 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto mt-6 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {fba.warehouses.regions.map((region, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-8 rounded-3xl border border-slate-150 shadow-sm hover:shadow-xl hover:border-purple-200/60 transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1 relative overflow-hidden group"
                >
                  {/* Premium top gradient stripe */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] opacity-80 group-hover:opacity-100 transition-opacity" />
                  
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 mb-5 flex items-center gap-2.5 border-b border-slate-100 pb-3">
                      <span className="w-8 h-8 rounded-lg bg-orange-55/10 text-orange-600 flex items-center justify-center font-bold text-sm select-none border border-orange-100/30 inline-flex shrink-0">
                        📍
                      </span>
                      <span className="truncate">{region.name}</span>
                    </h3>
                    <div className="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed">
                      {renderWarehouseItems(region.items)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lead Capture and Request form */}
        <section id="rfq-form-section" className="py-16 md:py-24 bg-purple-50/40 border-t border-purple-100">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                {activeLang === 'zh' ? '获取专属 FBA 头程多式联运报价评估' : activeLang === 'ru' ? 'Заказать расчет доставки Amazon FBA' : activeLang === 'fr' ? 'Demander une étude de coût Amazon FBA' : 'Request a Custom FBA Shipping Quote'}
              </h2>
              <p className="text-slate-500 font-medium text-sm md:text-base">
                {t('get_a_quote.formSubtitle')}
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-purple-100 shadow-xl p-8 sm:p-10 relative overflow-hidden">
              {!isFormSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {t('get_a_quote.mode')}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'Sea', label: t('get_a_quote.modeSea') },
                        { id: 'Land', label: t('get_a_quote.modeLand') },
                        { id: 'Air', label: t('get_a_quote.modeAir') },
                        { id: 'Sourcing', label: activeLang === 'zh' ? '采购验货集运' : 'Sourcing/Prep' }
                      ].map((item) => {
                        const isSelected = selectedService === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedService(item.id)}
                            className={`py-2.5 px-3 rounded-lg border-2 transition-all flex items-center justify-center font-bold text-xs sm:text-sm ${
                              isSelected
                                ? 'border-[#4B27B1] bg-purple-50 text-[#4B27B1] font-bold' 
                                : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                    <input type="hidden" name="service" value={selectedService} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="origin" className="block text-sm font-bold text-slate-700 mb-1">
                        {t('get_a_quote.originLabel')}
                      </label>
                      <input
                        id="origin"
                        name="origin"
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] outline-none font-semibold text-sm transition-all"
                        placeholder={t('get_a_quote.originPlaceholder')}
                      />
                    </div>
                    <div>
                      <label htmlFor="destination" className="block text-sm font-bold text-slate-700 mb-1">
                        {t('get_a_quote.destLabel')}
                      </label>
                      <input
                        id="destination"
                        name="destination"
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] outline-none font-semibold text-sm transition-all"
                        placeholder={t('get_a_quote.destPlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="comp" className="block text-sm font-bold text-slate-700 mb-1">
                      {activeLang === 'zh' ? '主营物资品类/电池参数' : activeLang === 'ru' ? 'Категория груза / Характеристики' : activeLang === 'fr' ? 'Type de marchandises' : 'Cargo Category'}
                    </label>
                    <select
                      id="comp"
                      name="product"
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] outline-none font-semibold text-sm transition-all"
                    >
                      <option value="New Energy / ESS">{t('get_a_quote.indNev')}</option>
                      <option value="Commercial Furniture">{t('get_a_quote.indFurn')}</option>
                      <option value="Project Cargo">{t('get_a_quote.indProject')}</option>
                      <option value="Other">{t('get_a_quote.indOther')}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="msg" className="block text-sm font-bold text-slate-700 mb-1">
                      {t('get_a_quote.cargo')}
                    </label>
                    <textarea
                      id="msg"
                      name="message"
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] outline-none font-semibold text-sm transition-all resize-none"
                      placeholder={t('get_a_quote.msgPlaceholder')}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fname" className="block text-sm font-bold text-slate-700 mb-1">
                        {t('get_a_quote.fname')}
                      </label>
                      <input
                        id="fname"
                        name="name"
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] outline-none font-semibold text-sm transition-all"
                        placeholder="e.g. Young Ming / DDNZ Global"
                      />
                    </div>
                    <div>
                      <label htmlFor="eml" className="block text-sm font-bold text-slate-700 mb-1">
                        {t('get_a_quote.email')}
                      </label>
                      <input
                        id="eml"
                        name="email"
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] outline-none font-semibold text-sm transition-all"
                        placeholder="partnership@ddnzglobal.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={state.submitting}
                    className={`w-full py-4 text-white font-bold rounded-xl transition-all shadow-md transform hover:-translate-y-0.5 active:translate-y-0 shrink-0 ${
                      state.submitting ? 'bg-slate-600' : 'bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] hover:shadow-xl'
                    }`}
                  >
                    {state.submitting ? t('get_a_quote.submitting') : t('get_a_quote.submit')}
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                     <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">
                    {activeLang === 'zh' ? '您的意向已递交给 华正邦泰 调度小组！' : activeLang === 'ru' ? 'Ваш запрос успешно отправлен!' : activeLang === 'fr' ? 'Votre demande e-commerce est enregistrée !' : 'Your FBA Shipping RFQ Appreciated!'}
                  </h3>
                  <p className="text-slate-500 font-semibold mb-6 max-w-md mx-auto text-sm sm:text-base">
                    {activeLang === 'zh' ? '我们专业的 FBA 项目主事人将在 2 小时内按您的供应商所在地进行定制航路与备货周期测算，并将最优化的双清方案呈现于您的收件箱。' : activeLang === 'ru' ? 'Наши FBA-специалисты подготовят коммерческое предложение и свяжутся с вами в течение 2 часов.' : activeLang === 'fr' ? 'Nos ingénieurs logistiques analysent votre plan de chargement et vous contacteront avec un devis DDP sous 2 heures.' : 'Our FBA route experts are configuring dynamic transport pathways and will deliver your complete door-to-door FBA strategy within 2 hours.'}
                  </p>
                  <button 
                    onClick={() => setIsFormSubmitted(false)}
                    className="text-[#4B27B1] hover:text-[#361793] font-bold text-sm underline"
                  >
                    {activeLang === 'zh' ? '返回提单页面' : activeLang === 'ru' ? 'Вернуться назад' : activeLang === 'fr' ? 'Retour aux détails' : 'Go Back to Service Details'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />
        <WhatsAppFloat />
        <ScrollToTop />
      </div>
    );
  }

  if (currentKey === 'warehouse-services') {
    const warehouseData = {
      en: {
        hero: {
          title: 'Warehouse & Sourcing Services in China',
          subtitle: 'Secure storage, advanced inventory management, and modular distribution solutions to streamline your global supply chain operations.',
          tag: 'Strategic Operational Infrastructure'
        },
        whyChoose: {
          title: 'Why Choose Our Warehouse Services',
          desc: 'Our state-of-the-art facilities and advanced management tools ensure your goods are stored, processed, and shipped safely and efficiently.',
          pillars: [
            { title: 'Secure Storage', desc: '24/7 security monitoring, climate control, and advanced fire protection systems.', icon: ShieldCheck },
            { title: 'Real-time Tracking', desc: 'Advanced WMS with real-time inventory visibility, automated stock levels, and instant reporting.', icon: Globe },
            { title: 'Fast Fulfillment', desc: 'Quick order processing, priority picking/packing, and same-day container loading capabilities.', icon: Zap },
            { title: 'Cost Effective', desc: 'Competitive pricing with flexible storage sizes and tailored cargo handling options.', icon: DollarSign }
          ]
        },
        breakdown: {
          title: 'Our Warehouse Services Breakdown',
          desc: 'Comprehensive warehousing and logistics solutions tailored specifically to your global business requirements.',
          modules: [
            {
              title: 'Storage Solutions',
              desc: 'Flexible storage options for various product categories and shipping volumes.',
              bullets: ['Short-term and long-term storage', 'Climate-controlled environments', 'Hazardous goods special isolation', 'Bulk and palletized storage'],
              icon: Package
            },
            {
              title: 'Inventory Management',
              desc: 'Advanced inventory control and management systems for total supply chain view.',
              bullets: ['Real-time inventory tracking', 'Automated stock alerts', 'Cycle counting services', 'Inventory reporting'],
              icon: FileText
            },
            {
              title: 'Order Fulfillment',
              desc: 'Efficient picking, packing, and courier/postal direct shipping services.',
              bullets: ['Pick and pack services', 'Custom packaging solutions', 'Same-day processing', 'Multi-channel fulfillment'],
              icon: Truck
            },
            {
              title: 'Cross-Docking',
              desc: 'Streamlined transfer of goods without expensive long-term warehousing.',
              bullets: ['Direct transshipment services', 'Multi-supplier consolidations', 'Reduced physical handling', 'Faster delivery times'],
              icon: Zap
            },
            {
              title: 'Quality Control',
              desc: 'Comprehensive inspection and quality assurance services at origin.',
              bullets: ['Incoming goods inspection', 'Quality control checklists', 'Damage assessment & photos', 'Product testing services'],
              icon: ShieldCheck
            },
            {
              title: 'Value-Added Services',
              desc: 'Additional processing services to enhance your distribution speed.',
              bullets: ['Kitting and assembly', 'FBA labeling and repackaging', 'Returns processing', 'Custom material insertions'],
              icon: Star
            }
          ]
        },
        facilities: {
          title: 'Our Warehouse Facilities & Specifications',
          desc: 'Modern, highly secure, and strategically located hubs across China\'s major logistics corridors.',
          features: [
            { title: 'Strategic Locations', desc: 'Warehouses located in major logistics hubs including Shenzhen, Shanghai, Guangzhou, and Yiwu for optimal distribution coverage.' },
            { title: 'Advanced Security', desc: '24/7 CCTV monitoring, strict access control systems, double fire suppression, and professional security personnel ensure maximum protection.' },
            { title: 'Climate Control', desc: 'Temperature and humidity controlled environments suitable for sensitive products including electronics, high-end apparel, and medical elements.' },
            { title: 'Modern Equipment', desc: 'State-of-the-art material handling equipment with heavy cranes, safety lifts, and automated sorting conveyor technology.' }
          ],
          specs: [
            { label: 'Total Storage Space', value: '21,500+ sq ft' },
            { label: 'Ceiling Height', value: '30+ feet' },
            { label: 'Loading Docks', value: '50+ bays' },
            { label: 'Operating Hours', value: '24/7' },
            { label: 'Certifications', value: 'ISO 9001, CTPAT' },
            { label: 'Technology', value: 'WMS, RFID, Barcode' }
          ]
        },
        technology: {
          title: 'Advanced Warehouse Technology',
          desc: 'Cutting-edge technology integrations for maximum operational efficiency, data accuracy, and minimal error rates.',
          badges: [
            { title: 'Warehouse Management System', desc: 'Proprietary advanced WMS for real-time inventory tracking, multi-client order dispatch, and optimal pathway planning.', icon: Globe },
            { title: 'Mobile Scanning', desc: 'Handheld smart terminals with barcode and RFID scanning to verify stock instantly on arrival.', icon: Zap },
            { title: 'Real-time Analytics', desc: 'Comprehensive dashboard presenting SKU aging, storage layout capacity, and hourly loading metrics.', icon: FileText },
            { title: 'API Integration', desc: 'Seamless connections with major e-commerce platforms, ERP grids, and custom tracking applications.', icon: Languages },
            { title: 'Automated Reporting', desc: 'Automated stock alerts, outgoing shipping notifications, and custom performance metrics directly to email.', icon: Clock },
            { title: 'Secure Access', desc: 'Multi-tier team permissions, encrypted data hosting portals, and absolute privacy safeguards.', icon: ShieldCheck }
          ]
        },
        industries: {
          title: 'Industries We Serve',
          desc: 'Specialized warehouse and handling configurations for diverse industry requirements.',
          sectors: [
            { name: 'Electronics', desc: 'Smartphones, computers, and sensitive micro-components.', icon: Zap },
            { name: 'Fashion', desc: 'Apparel, footwear, dustproofing, and fashion accessories.', icon: Star },
            { name: 'Home & Garden', desc: 'Heavy furniture, home decor, and fragile garden products.', icon: Landmark },
            { name: 'Health & Beauty', desc: 'Cosmetics, supplements, custom temperature tracking, and care.', icon: Thermometer },
            { name: 'Automotive', desc: 'Heavy auto parts, batteries, accessories, and industrial components.', icon: Truck },
            { name: 'Industrial', desc: 'Heavy machinery, construction tools, and industrial equipment.', icon: Package },
            { name: 'Books & Media', desc: 'Educational materials, specialty catalogs, and boxed media.', icon: FileText },
            { name: 'Food & Beverage', desc: 'Non-perishable food products, custom packings, and beverages.', icon: ShieldCheck }
          ]
        },
        bottomCta: {
          title: 'Ready to Optimize Your Warehouse Operations?',
          desc: 'Partner with us for secure, efficient, and cost-effective warehouse solutions that scale seamlessly with your trading volume.',
          btn1: 'Get Free Consultation',
          btn2: 'Call Now'
        }
      },
      zh: {
        hero: {
          title: '自营海外集运与高端仓储服务',
          subtitle: '提供极其安全可靠的货品暂存、智能化库存管理及一站式多厂拼装分发方案，帮助您全面简化并优化跨境供应链。',
          tag: '大湾区实业基础设施保障'
        },
        whyChoose: {
          title: '为什么选择我们的仓储服务',
          desc: '依靠自营高标仓库与先进的信息化管控手段，您的货物在这里将获得最安全的周转保障与最高效的履约效率。',
          pillars: [
            { title: '多维安全防护', desc: '配备 24/7 全天候监控、恒温恒湿管控、防爆隔离存放及多重烟雾火警防御系统。', icon: ShieldCheck },
            { title: '实时动态追踪', desc: '接入高级 WMS 库存管理中枢，支持在线核对实物状况，提供详尽的库存报表及动态提醒。', icon: Globe },
            { title: '敏捷出库履约', desc: '智能挑选配货、抗震打包加固以及当天即时配载出大货柜的货船装载力。', icon: Zap },
            { title: '高性价比方案', desc: '提供极具竞争力的按需计费仓租、长短租拆分方案，配合长期合作大客户的优惠支持。', icon: DollarSign }
          ]
        },
        breakdown: {
          title: '全方位仓储物流服务矩阵',
          desc: '根据各行业复杂的商品属性与运输逻辑，我们专门设计了六大核心定制层保障您的采购成果。',
          modules: [
            {
              title: '多元存储方案',
              desc: '根据货物不同的物理状态与出运计划，分设多样存期区域。',
              bullets: ['短期特惠暂存和中长期缓冲寄存', '高精密仪器恒温恒湿区', '敏感物品及新能源危险品专设区', '卡板整箱及散货堆位按需分配'],
              icon: Package
            },
            {
              title: '精细库存管治',
              desc: '系统化入仓扫码，完美呈现全球供应商的货物合拢进程。',
              bullets: ['实盘库存实时动态显示', '补货阈值及低量预警通知', '自动化批次管控与库位核查', '出入库流向表与财务成本报告'],
              icon: FileText
            },
            {
              title: '订单拣货与履约 (Fulfillment)',
              desc: '精细的一件代发服务，省去国外收货后的分拆难题。',
              bullets: ['精确的一件代发打包服务', '定制防撞保护和高级密封包装', '当天派送指令即时拣选处理', '多平台集成多网络跟踪覆盖'],
              icon: Truck
            },
            {
              title: '交叉转运与拼箱 (Cross-Docking)',
              desc: '极速收货、即发配载，帮助客户压缩仓储时间，缩短资金周转周期。',
              bullets: ['重卡入坞直驳海运拼箱装车', '极简多向分拔和统一并货', '免除长存费用降低库存持有成本', '大幅缩减供应链配送等待时间'],
              icon: Zap
            },
            {
              title: '高质品质控制',
              desc: '在集港出航之前，帮您拦截来自供应商的物理缺陷与错货。',
              bullets: ['外箱破损与规格参数检查', '产品精细开箱质检与核算', '原件异常实时拍照或联播反馈', '基础跌落与合格测试'],
              icon: ShieldCheck
            },
            {
              title: '增值装配服务',
              desc: '在关口前对物流标签、产品形态进行最终重配置，避免海外退单拒收。',
              bullets: ['异国语标签粘贴与多语插页插入', 'FBA贴标、套袋与重新装箱', '跨境包装减重及防丢套扎', '个性化客户定制贴片操作'],
              icon: Star
            }
          ]
        },
        facilities: {
          title: '自营高标物理规格与合规指标',
          desc: '坐落于中国三大沿海制造长廊的现代化仓储，从每一平米到每一立方都对安全严抓到脚尖。',
          features: [
            { title: '骨干战略口岸布局', desc: '仓库均设在深圳、上海、广州及义乌等物流交通枢纽中心，提供无缝对接卡班的集配深度。' },
            { title: '重金升级安防', desc: '数百个数字超清监控死角覆盖，严密生物进出验证，特级消防重器部署以及持证全夜候门哨保平安。' },
            { title: '智能控温调湿', desc: '对微型元器件、顶尖面料及敏感粉末气雾进行恒温仓位锁定，保证物理品质无锈化衰坏。' },
            { title: '精锐重载调车设备', desc: '配备重型高升叉车、机械爪吊整套起卸，全自动分流流水轨线极速转运。' }
          ],
          specs: [
            { label: '总仓储及集装容积', value: '2000+ 平方米' },
            { label: '仓库净挑高', value: '30+ 英尺 / 11+ 米' },
            { label: '装卸坞口挡板车位', value: '50+ 个重卡车位' },
            { label: '周转营运时间', value: '24/7/365 全天候' },
            { label: '国际安保认证', value: 'ISO 9001, CTPAT 认证' },
            { label: '数字化管理体系', value: 'WMS、RFID、条码识别' }
          ]
        },
        technology: {
          title: '最硬核的仓储数字化底座',
          desc: '我们坚信，顶尖的仓储必须以实时数据为神经。通过数字化让千万个SKU做到零人工错漏。',
          badges: [
            { title: '智慧 WMS 管理系统', desc: '自研企业级核心WMS中枢，实现在线分区上架、最优拣货路线算法运算和包裹防丢警报。', icon: Globe },
            { title: '全移动智能扫描', desc: '前线理货员标配高能手持PDA，多重条码及RFID闪电式读写，自动调拨归位信息。', icon: Zap },
            { title: '实时大盘深度剖析', desc: '总指挥层实时展示库存老化分析、爆仓预充预警和作业饱和热力图，为您的决策引路。', icon: FileText },
            { title: '无缝 API 系统对接', desc: '完美兼容各大知名跨境网店、ERP资源体系及定制API接口，一击打通跨境订单上下游。', icon: Languages },
            { title: '全自控生成表单', desc: '出入库数据日结自动下账通知、预警库存智能催单，极大节约客户人工沟通负累。', icon: Clock },
            { title: '特级云盾与加密隐私', desc: '高级账号分层、全流程数据多点热备灾防护，确保商业采购秘密获得铁甲防卫。', icon: ShieldCheck }
          ]
        },
        industries: {
          title: '多行业定制化存蓄经验',
          desc: '不同类型的货品具有不同的存放和周转属性。以下行业已被我们长期深度服务：',
          sectors: [
            { name: '3C 电子产品', desc: '防静电管理、轻型高价值存位、电池双重绝缘隔离。', icon: Zap },
            { name: '潮流服装与饰品', desc: '立体衣架吊挂库位，长途集货防霉潮精细吸顶吸湿袋铺充。', icon: Star },
            { name: '重型家具及家装', desc: '大载重平库，支持长臂叉车直接存取、耐压卡板定制配运。', icon: Landmark },
            { name: '美妆与个人护理', desc: '精控常温库位、抗香型混杂密封、洁净无尘拣货柜面。', icon: Thermometer },
            { name: '汽车与重型件', desc: '多品规零配件防震软木垫托底，防油脂外溢安全防滑处理。', icon: Truck },
            { name: '五金机械与器械', desc: '重型承载托盘，耐高震和重吊抓装，重工业零件完美收纳。', icon: Package },
            { name: '出版物与媒体', desc: '高规纸张防霉，避光防焦，条码分卷整册成套集包履约。', icon: FileText },
            { name: '预包装食品及饮料', desc: '合规食品级货品区，先进先出逻辑控制，严格效期警戒管理。', icon: ShieldCheck }
          ]
        },
        bottomCta: {
          title: '准备好大幅降低国内备货与统合仓储的损耗了吗？',
          desc: '联系我们获取免费的集货物流测算。专业团队协助您按货源灵活配置大湾区最优仓储节点。',
          btn1: '获取免费定制报告',
          btn2: '立即电话沟通'
        }
      },
      ru: {
        hero: {
          title: 'Складские Услуги и Консолидация в Китае',
          subtitle: 'Надежное хранение, передовое управление запасами и гибкие логистические решения для сокращения издержек вашей цепочки поставок.',
          tag: 'Инфраструктурная поддержка логистики'
        },
        whyChoose: {
          title: 'Почему выбирают наши складские услуги',
          desc: 'Современные охраняемые хабы и передовая система управления WMS исключают риски порчи грузов и оптимизируют отправку контейнеров из Китая.',
          pillars: [
            { title: 'Абсолютная безопасность', desc: 'Круглосуточное видеонаблюдение 24/7, жесткий температурный контроль и противопожарные системы класса А.', icon: ShieldCheck },
            { title: 'Онлайн-контроль остатков', desc: 'Современная WMS-архитектура с онлайн-кабинетом для оперативного отслеживания остатков и отчетов.', icon: Globe },
            { title: 'Молниеносная обработка', desc: 'Профессиональный подбор, бережная упаковка и быстрая погрузка сборных грузов в один контейнер.', icon: Zap },
            { title: 'Оптимизация затрат', desc: 'Выгодные долгосрочные и краткосрочные сетки тарифов на хранение для любого объема бизнеса.', icon: DollarSign }
          ]
        },
        breakdown: {
          title: 'Спектр профессиональных складских услуг',
          desc: 'Полный перечень складской подготовки, кастомизированный под требования международных торговых компаний.',
          modules: [
            {
              title: 'Решения для хранения',
              desc: 'Многофункциональное размещение товаров разных категорий с различным временем хранения.',
              bullets: ['Краткосрочное и долгосрочное хранение', 'Помещения с регулируемой температурой', 'Безопасное хранение опасных грузов (DG)', 'Стеллажное и напольное паллетное хранение'],
              icon: Package
            },
            {
              title: 'Управление товарными запасами',
              desc: 'Полная прозрачность жизненного цикла каждой единицы перед отправкой покупателям.',
              bullets: ['Отслеживание инвентаря в реальном времени', 'Автоматические уведомления о критических остатках', 'Регулярная инвентаризация по штрихкодам', 'Аналитические отчеты по оборачиваемости'],
              icon: FileText
            },
            {
              title: 'Подготовка и выполнение заказов (Fulfillment)',
              desc: 'Комплексное стикерование, защитное упаковывание и передача в курьерские службы.',
              bullets: ['Услуги Pick & Pack (сборка и укладка)', 'Разработка брендированной тары и прочных коробов', 'Быстрая упаковка день-в-день', 'Интеграция с крупнейшими маркетплейсами'],
              icon: Truck
            },
            {
              title: 'Кросс-докинг (Прямая перевалка)',
              desc: 'Эффективная экономия на длительном хранении: быстрая подгрузка в транзитный транспорт.',
              bullets: ['Прямой транзит товаров без лишнего складирования', 'Консолидация грузов от множества фабрик', 'Минимум физических манипуляций с коробками', 'Максимально быстрое отправление из портов Китая'],
              icon: Zap
            },
            {
              title: 'Контроль качества (QC)',
              desc: 'Проверка комплектности и соответствия стандартам у нас на складе до отправки на границу.',
              bullets: ['Доскональный входной контроль партии на складе', 'Сверка с фабричными упаковочными листами', 'Качественная фотосъемка возможных дефектов', 'Базовые тесты на работоспособность техники'],
              icon: ShieldCheck
            },
            {
              title: 'Дополнительные услуги',
              desc: 'Оптимизация вашего ритейл-бизнеса прямо на складах отправления в Азии.',
              bullets: ['Комплектация наборов (киттинг) и сборка', 'Переклейка товарных ярлыков и FBA FNSKU штрихкодов', 'Снижение веса отправления за счет правильной переупаковки', 'Обработка и консолидация возвратов'],
              icon: Star
            }
          ]
        },
        facilities: {
          title: 'Наши складские мощности и параметры (EXACT DATA LOCKED)',
          desc: 'Наши собственные склады, построенные по современным строительным стандартам, гарантируют безупречную сохранность грузов.',
          features: [
            { title: 'Ключевые гео-локации', desc: 'Хабы расположены в крупнейших промышленных и логистических центрах: Шэньчжэнь, Шанхай, Гуанчжоу и Иу для быстрой сборки.' },
            { title: 'Многоуровневая охрана', desc: 'Камеры высокого разрешения по всей площади, строгий пропускной режим по картам сотрудников и современная противопожарная система.' },
            { title: 'Климатический режим', desc: 'Регулируемые датчики тепла и сухости для защиты высокотехнологичной электроники, элитного текстиля и косметики.' },
            { title: 'Современное оборудование', desc: 'Фирменные штабелеры, автоматические системы сортировки и ленты быстрой транспортировки тяжелого оборудования.' }
          ],
          specs: [
            { label: 'Общая площадь складов', value: '21 500+ кв. футов' },
            { label: 'Высота потолков складов', value: '30+ футов / 9+ метров' },
            { label: 'Количество погрузочных доков', value: '50+ ворот' },
            { label: 'Режим работы терминала', value: '24/7/365 без выходных' },
            { label: 'Сертификаты соответствия', value: 'ISO 9001, CTPAT' },
            { label: 'Основные технологии', value: 'WMS, RFID, штрихкодирование' }
          ]
        },
        technology: {
          title: 'Инновационные решения управления паллетами',
          desc: 'Автоматизация позволяет свести ручной человеческий фактор в обработке отгрузок до абсолютного нуля.',
          badges: [
            { title: 'Умная система WMS', desc: 'Позволяет отслеживать весь цикл товаров, оптимизировать заполнение полок и автоматически строить маршруты сборки.', icon: Globe },
            { title: 'Интеграция RFID и PDA', desc: 'Портативные терминалы считывают код коробки за доли секунды и вносят в систему без задержек.', icon: Zap },
            { title: 'Продвинутая аналитика', desc: 'Удобный дашборд с показателем загружености склада, старением инвентаря и дневной выработкой грузчиков.', icon: FileText },
            { title: 'Прямое API с ERP', desc: 'Легкое сопряжение со всеми популярными маркетплейсами и учетными системами клиентов (1С, SAP).', icon: Languages },
            { title: 'Автоотчеты клиенту', desc: 'Автоматическая выгрузка ведомостей и мгновенные уведомления об отправке груза по e-mail.', icon: Clock },
            { title: 'Безопасность ваших данных', desc: 'Многоступенчатая защита доступа к файлам и зашифрованные базы данных на защищенных шлюзах.', icon: ShieldCheck }
          ]
        },
        industries: {
          title: 'Опыт работы в различных нишах',
          desc: 'Мы адаптируем зоны склада и методы укладки под специфику каждого товарного направления:',
          sectors: [
            { name: '3C Электроника', desc: 'Защита от статики, легкие ячейки повышенной ценности и термоизолированные коробки металл/пластик.', icon: Zap },
            { name: 'Мода и Обувь', desc: 'Вертикальные вешала, антипылевое укрытие, контроль влажности во время сезона дождей.', icon: Star },
            { name: 'Мебель и Сад', desc: 'Усиленные паллеты, работа тяжелыми погрузчиками, индивидуальное закрепление деревянных панелей.', icon: Landmark },
            { name: 'Красота и Здоровье', desc: 'Стерильное чистое золирование, защита от прямого солнечного света, теплоизоляция.', icon: Thermometer },
            { name: 'Автозапчасти', desc: 'Тяжелые стеллажи, защита от металлических сколов, маслоустойчивые поддоны.', icon: Truck },
            { name: 'Промышленное оборудование', desc: 'Прочные такелажные лебедки, индивидуальное проектирование экспортных коробов.', icon: Package },
            { name: 'Книги и полиграфия', desc: 'Защита от влажности и деформации, бережная поштучная комплектация партий.', icon: FileText },
            { name: 'Упакованная еда и напитки', desc: 'Зоны пищевой категории (non-perishables), FIFO контроль сроков годности.', icon: ShieldCheck }
          ]
        },
        bottomCta: {
          title: 'Готовы сократить издержки на складах в Китае?',
          desc: 'Доверьте свой груз профессионалам DDNZ Global. Настроим быструю консолидацию и проверку ваших товаров прямо сейчас.',
          btn1: 'Запросить бесплатный аудит',
          btn2: 'Позвонить специалисту'
        }
      },
      fr: {
        hero: {
          title: "Services d'Entreposage & de Sourcing en Chine",
          subtitle: "Espace de stockage sécurisé, gestion avancée de vos approvisionnements et solutions de distribution sur-mesure pour fluidifier l'ensemble de votre chaîne logistique.",
          tag: "Infrastructure Opérationnelle d'Élite"
        },
        whyChoose: {
          title: 'Pourquoi Choisir Nos Services de Stockage',
          desc: "Bénéficiez d'infrastructures détenues en propre, de technologies de pointe d'automatisation et de protocoles de sécurité pour un flux logistique sans faille.",
          pillars: [
            { title: 'Sécurité Absolue', desc: "Caméras de surveillance actives 24h/24, contrôle climatique thermique et systèmes d'extinction d'incendie de dernière génération.", icon: ShieldCheck },
            { title: 'Suivi Digital Direct', desc: 'Notre système WMS avancé vous offre une vision instantanée de vos niveaux de stock et génère des rapports d\'état complets.', icon: Globe },
            { title: 'Fulfillment Express', desc: 'Préparation de commandes rapide, emballages bois de placage sur-mesure de haute qualité et chargement optimisé.', icon: Zap },
            { title: 'Rentabilité Maîtrisée', desc: 'Une tarification transparente et ultra-compétitive adaptée à vos volumes et à la durée de votre stockage.', icon: DollarSign }
          ]
        },
        breakdown: {
          title: 'Détail de Nos Prestations de Stockage',
          desc: "Des services logistiques exhaustifs et modulaires pour accompagner le développement international de votre entreprise.",
          modules: [
            {
              title: 'Solutions de Stockage',
              desc: "Des options d'hébergement flexibles adaptées à chaque type de marchandise.",
              bullets: ['Stockage à court et long terme', 'Zones de contrôle de température et d\'humidité', 'Entreposage isolé pour matières réglementées (DG)', 'Emplacement palettes lourdes ou casiers d\'accès direct'],
              icon: Package
            },
            {
              title: 'Gestion Innovante des Inventaires',
              desc: "Une parfaite traçabilité à l'unité près pour un contrôle total de vos flux de fret.",
              bullets: ['Visualisation des stocks en temps réel', 'Alertes automatisées de seuil de réapprovisionnement', 'Inventaires cycliques par scanners thermiques', 'Rapports d\'activité de flux entrant et sortant'],
              icon: FileText
            },
            {
              title: 'Préparation de Commandes (Fulfillment)',
              desc: "Le traitement agile de vos colis e-commerce et de messagerie à la source.",
              bullets: ['Services Pick and Pack à haute fidélité', 'Conception de cartons de transport renforcés', 'Traitement prioritaire le jour même', 'Compatibilité logistique multi-canaux (FBA, B2C)'],
              icon: Truck
            },
            {
              title: 'Cross-Docking (Transit Fluide)',
              desc: "Répartissez vos marchandises à l'embarquement sans frais d'entreposage de longue durée.",
              bullets: ['Transbordement direct camion-à-conteneur', 'Regroupement de cargaisons multi-fournisseurs', 'Manipulation physique restreinte pour préserver la marchandise', 'Délais de transit réduits vers les ports d\'embarquement'],
              icon: Zap
            },
            {
              title: 'Contrôle Qualité Intégral',
              desc: "Une inspection rigoureuse pour éviter l'expédition de pièces défectueuses depuis l'Asie.",
              bullets: ["Contrôle systématique à l'arrivée (dimensions, poids)", "Saisie de listes de contrôle de qualité", 'Prise de clichés haute résolution des anomalies', 'Tests basiques de fonctionnement matériel'],
              icon: ShieldCheck
            },
            {
              title: 'Services à Valeur Ajoutée',
              desc: "Des ajustements techniques d'emballage pour maximiser la conformité réglementaire.",
              bullets: ['Kitting, emballage et assemblage', 'Étiquetage FBA de codes-barres (FNSKU)', 'Reconditionnement et renforcement de palettes export', 'Intégration de notices personnalisées par langue'],
              icon: Star
            }
          ]
        },
        facilities: {
          title: 'Infrastructures Logistiques & Spécifications (EXACT DATA LOCKED)',
          desc: "Nos dépôts modernes de haute sécurité sont positionnés au carrefour des principales autoroutes d'exportation chinoises.",
          features: [
            { title: 'Emplacements Stratégiques', desc: 'Hubs stratégiquement positionnés à Shenzhen, Shanghai, Guangzhou et Yiwu pour assurer une réactivité de transit optimale.' },
            { title: 'Sécurité Imparable', desc: 'Gardes qualifiés, vidéosurveillance continue par caméras thermiques, portails d\'accès contrôlés et sécurité incendie active.' },
            { title: 'Environnement Thermorégulé', desc: "Espaces préservés de la chaleur et de l'humidité pour garantir l'état des cargaisons micro-électroniques ou pharmaceutiques." },
            { title: 'Équipements de Manutention High-Tech', desc: 'Flotte de chariots élévateurs modernes à grande portée, ponts roulants de chargement et convoyeurs intégrés.' }
          ],
          specs: [
            { label: 'Surface Totale de Stockage', value: '21 500+ pieds carrés' },
            { label: 'Hauteur sous Plafond', value: '30+ pieds / 9+ mètres' },
            { label: 'Docks de Chargement', value: '50+ quais poids lourds' },
            { label: 'Heures d\'Ouverture', value: '24h/24 & 7j/7' },
            { label: 'Certifications Officielles', value: 'ISO 9001, CTPAT' },
            { label: 'Technologie Portative', value: 'WMS, RFID, Codes-barres' }
          ]
        },
        technology: {
          title: "L'Ingénierie Digitale de l'Entrepôt",
          desc: "La traçabilité de bout en bout propulsée par des algorithmes d'orchestration pour éliminer les erreurs humaines.",
          badges: [
            { title: 'Système de Gestion de Stock (WMS)', desc: "Création de parcours optimisés, attribution intelligente de casiers automatisés, et détection avancée d'erreurs.", icon: Globe },
            { title: 'Lecture PDA & RFID Autonome', desc: "Ordinateurs de poche lisant instantanément les puces d'inventaire sans friction physique.", icon: Zap },
            { title: 'Rapports Analytics Dynamiques', desc: "Dashboard évaluant en temps réel sous-utilisation d'espace, pics d'activité horaire et goulots d'étranglement de l'expédition.", icon: FileText },
            { title: 'Connecteurs API Standardisés', desc: "Connexion bidirectionnelle immédiate avec Shopify, WooCommerce et vos solutions ERP propriétaires.", icon: Languages },
            { title: 'Rapports Automatisés', desc: "Alertes de rupture, envois automatiques hebdomadaires d'inventaires résiduels par email.", icon: Clock },
            { title: 'Confidentialité Cryptée', desc: "Cryptage des banques de données douanières et segmentation fine des accès à vos bases confidentielles.", icon: ShieldCheck }
          ]
        },
        industries: {
          title: "Secteurs d'Activité Desservis",
          desc: "We adjust warehousing setups to the physical properties of your product universes:",
          sectors: [
            { name: 'Électronique 3C', desc: 'Protection ESD (décharge), casiers d\'accès restreint haute valeur, isolation batteries.', icon: Zap },
            { name: 'Mode & Beauté', desc: "Penderies suspendues, housses de protection, capteurs de taux d'hygrométrie actifs.", icon: Star },
            { name: 'Maison & Ameublement', desc: 'Stockage lourd au sol, prise par élévateurs à pinces, préparation en caisses cratées de bois.', icon: Landmark },
            { name: 'Santé & Cosmétiques', desc: "Propreté de classe pharmaceutique, préservation de l'ensoleillement et hygrométrie scellée.", icon: Thermometer },
            { name: 'Pièces Automobiles', desc: 'Casiers de calibrage variables, revêtements de protection anti-corrosion huileuse, palettes robustes.', icon: Truck },
            { name: 'Machinerie Industrielle', desc: "Prise en charge par grues, sillage d'acier, traitement d'emballage antisismique de transport.", icon: Package },
            { name: 'Édition & Médias', desc: 'Racks de sécheresse absolue, tri par code-barres, colisage protecteur des tranches papier.', icon: FileText },
            { name: 'Aliments & Boissons Secs', desc: 'Conformité alimentaire, contrôle rigoureux FIFO (premier entré, premier sorti) des dates de péremption.', icon: ShieldCheck }
          ]
        },
        bottomCta: {
          title: 'Prêt à Rationaliser Votre Entreposage en Chine ?',
          desc: 'Coordonnez vos expéditions au cœur de notre hub ultra-sécurisé de Guangzhou. Solutions agiles ajustées à votre croissance.',
          btn1: 'Obtenir une Analyse Gratuite',
          btn2: 'Contacter un Expert'
        }
      }
    };

    const wh = warehouseData[activeLang as 'en' | 'zh' | 'ru' | 'fr'] || warehouseData.en;

    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <SEO title={currentSEO?.title} description={currentSEO?.desc} keywords={currentSEO?.keywords} />
        <Navbar />

        {/* 1. Hero Banner */}
        <section className="relative pt-36 pb-24 md:pb-36 bg-gradient-to-br from-[#121B2B] via-[#0D2C43] to-[#123E5E] text-white overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div className="max-w-4xl">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6 border border-white/10">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                {wh.hero.tag}
              </span>
              <h1 className={activeLang === 'zh' ? "text-[6.8vw] sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6 whitespace-nowrap" : "text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6"}>
                {wh.hero.title}
              </h1>
              <p className="text-slate-300 text-lg sm:text-xl font-medium leading-relaxed mb-8 max-w-2xl">
                {wh.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a 
                  href="#rfq-form-section"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold px-8 py-4 rounded-xl text-center shadow-lg hover:shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
                >
                  {wh.bottomCta.btn1}
                </a>
                <a 
                  href="https://wa.me/8613430335022" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-center border border-white/20 backdrop-blur-sm transition-all text-sm"
                >
                  {wh.bottomCta.btn2}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Why Choose Our Warehouse Services */}
        <section className="py-20 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[#4B27B1] text-xs font-extrabold uppercase tracking-widest block mb-3">
                {activeLang === 'zh' ? '服务优势' : 'Core Advantages'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                {wh.whyChoose.title}
              </h2>
              <p className="text-slate-500 font-semibold text-sm sm:text-base leading-relaxed">
                {wh.whyChoose.desc}
              </p>
              <div className="h-1.5 w-16 bg-gradient-to-r from-emerald-500 to-teal-600 mx-auto mt-6 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {wh.whyChoose.pillars.map((pil, idx) => {
                const PilIcon = pil.icon;
                return (
                  <div 
                    key={idx} 
                    className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-emerald-250 hover:shadow-xl transition-all duration-300 relative group"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-colors duration-300">
                      <PilIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">
                      {pil.title}
                    </h3>
                    <p className="text-slate-500 text-sm font-semibold leading-relaxed">
                      {pil.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. Our Warehouse Services Breakdown (6 Core Product Modules) */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[#4B27B1] text-xs font-extrabold uppercase tracking-widest block mb-3">
                {activeLang === 'zh' ? '业务矩阵' : 'Service Breakdown'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                {wh.breakdown.title}
              </h2>
              <p className="text-slate-500 font-semibold text-sm sm:text-base leading-relaxed">
                {wh.breakdown.desc}
              </p>
              <div className="h-1.5 w-16 bg-gradient-to-r from-emerald-500 to-teal-600 mx-auto mt-6 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wh.breakdown.modules.map((mod, idx) => {
                const ModIcon = mod.icon;
                return (
                  <div 
                    key={idx} 
                    className="bg-white p-8 rounded-3xl border border-slate-150 hover:border-emerald-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#4B27B1] flex items-center justify-center mb-6">
                        <ModIcon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
                        {mod.title}
                      </h3>
                      <p className="text-slate-500 text-sm font-semibold leading-relaxed mb-6">
                        {mod.desc}
                      </p>
                    </div>
                    <ul className="space-y-2.5">
                      {mod.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Our Warehouse Facilities & Specifications */}
        <section className="py-20 bg-white border-t border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[#4B27B1] text-xs font-extrabold uppercase tracking-widest block mb-3">
                {activeLang === 'zh' ? '物理基建规格' : 'Facilities & Specifications'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                {wh.facilities.title}
              </h2>
              <p className="text-slate-500 font-semibold text-sm sm:text-base leading-relaxed">
                {wh.facilities.desc}
              </p>
              <div className="h-1.5 w-16 bg-gradient-to-r from-emerald-500 to-teal-600 mx-auto mt-6 rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
              <div className="lg:col-span-6 space-y-6">
                {wh.facilities.features.map((feat, fIdx) => (
                  <div key={fIdx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-105 transition-all duration-200">
                    <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      {feat.title}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-6">
                <div className="bg-gradient-to-br from-slate-900 to-[#122c42] text-white p-8 rounded-3xl h-full flex flex-col justify-between relative overflow-hidden shadow-xl border border-slate-800">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
                  <div>
                    <h3 className="text-xl font-bold mb-6 pb-3 border-b border-slate-800 flex items-center gap-2 text-emerald-400">
                      <span>📊</span>
                      {activeLang === 'zh' ? '仓储规格核心数据' : 'Facility Certified Specs'}
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      {wh.facilities.specs.map((spec, sIdx) => (
                        <div key={sIdx} className="space-y-1">
                          <span className="text-xs text-slate-400 block font-bold tracking-wide uppercase">
                            {spec.label}
                          </span>
                          <span className="text-lg sm:text-xl font-black text-white block font-mono">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-3">
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-xs font-bold leading-none uppercase">
                      CTPAT Secure
                    </div>
                    <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-blue-400 text-xs font-bold leading-none uppercase">
                      ISO 9001 Certified
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Advanced Warehouse Technology */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[#4B27B1] text-xs font-extrabold uppercase tracking-widest block mb-3">
                {activeLang === 'zh' ? '数字化系统支撑' : 'Digital Infrastructure'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                {wh.technology.title}
              </h2>
              <p className="text-slate-500 font-semibold text-sm sm:text-base leading-relaxed">
                {wh.technology.desc}
              </p>
              <div className="h-1.5 w-16 bg-gradient-to-r from-emerald-500 to-teal-600 mx-auto mt-6 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wh.technology.badges.map((b, idx) => {
                const TechIcon = b.icon;
                return (
                  <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-150 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 font-bold">
                      <TechIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {b.title}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. Industries We Serve */}
        <section className="py-20 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[#4B27B1] text-xs font-extrabold uppercase tracking-widest block mb-3">
                {activeLang === 'zh' ? '服务品类' : 'Market Expertise'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                {wh.industries.title}
              </h2>
              <p className="text-slate-500 font-semibold text-sm sm:text-base leading-relaxed">
                {wh.industries.desc}
              </p>
              <div className="h-1.5 w-16 bg-gradient-to-r from-emerald-500 to-teal-600 mx-auto mt-6 rounded-full" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 theme-grid-stagger bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
              {wh.industries.sectors.map((sec, idx) => {
                const SecIcon = sec.icon;
                return (
                  <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-200 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-full bg-[#4B27B1]/5 text-[#4B27B1] flex items-center justify-center mb-4">
                      <SecIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                      {sec.name}
                    </h3>
                    <p className="text-slate-500 text-[11px] sm:text-xs font-semibold leading-normal">
                      {sec.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. Bottom Conversion Banner with Form */}
        <section id="rfq-form-section" className="py-20 bg-slate-50 border-t border-slate-200/60 scroll-mt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-widest mb-4">
                RFQ Instant Access
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight animate-fade-in">
                {wh.bottomCta.title}
              </h2>
              <p className="text-slate-500 font-semibold text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                {wh.bottomCta.desc}
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 sm:p-10 relative overflow-hidden">
              {!isFormSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {t('get_a_quote.mode')}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'Sea', label: t('get_a_quote.modeSea') },
                        { id: 'Land', label: t('get_a_quote.modeLand') },
                        { id: 'Air', label: t('get_a_quote.modeAir') },
                        { id: 'Sourcing', label: activeLang === 'zh' ? '自营仓储暂存' : 'Warehousing/Prep' }
                      ].map((item) => {
                        const isSelected = selectedService === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedService(item.id)}
                            className={`py-2.5 px-3 rounded-lg border-2 transition-all flex items-center justify-center font-bold text-xs sm:text-sm ${
                              isSelected
                                ? 'border-[#4B27B1] bg-purple-50 text-[#4B27B1] font-bold' 
                                : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                    <input type="hidden" name="service" value={selectedService} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="origin" className="block text-sm font-bold text-slate-700 mb-1">
                        {t('get_a_quote.originLabel')}
                      </label>
                      <input
                        id="origin"
                        name="origin"
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] outline-none font-semibold text-sm transition-all"
                        placeholder={t('get_a_quote.originPlaceholder')}
                        defaultValue="Guangzhou Hub"
                      />
                    </div>
                    <div>
                      <label htmlFor="destination" className="block text-sm font-bold text-slate-700 mb-1">
                        {t('get_a_quote.destLabel')}
                      </label>
                      <input
                        id="destination"
                        name="destination"
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] outline-none font-semibold text-sm transition-all"
                        placeholder={t('get_a_quote.destPlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="comp" className="block text-sm font-bold text-slate-700 mb-1">
                      {activeLang === 'zh' ? '货物属性群组' : activeLang === 'ru' ? 'Категория груза' : activeLang === 'fr' ? 'Type de marchandises' : 'Cargo Category'}
                    </label>
                    <select
                      id="comp"
                      name="product"
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] outline-none font-semibold text-sm transition-all"
                    >
                      <option value="Electronics / Digital">{activeLang === 'zh' ? '数字/3C电子' : 'Electronics / Digital'}</option>
                      <option value="Furniture / Wood">{activeLang === 'zh' ? '大件家具及木器' : 'Furniture / Wood'}</option>
                      <option value="Apparel / Fabric">{activeLang === 'zh' ? '服装面料辅料' : 'Apparel / Fabric'}</option>
                      <option value="Machinery / Industry">{activeLang === 'zh' ? '工业母机与特种件' : 'Machinery / Industry'}</option>
                      <option value="Other">{t('get_a_quote.indOther')}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="msg" className="block text-sm font-bold text-slate-700 mb-1">
                      {activeLang === 'zh' ? '备货仓储或集运货运需求明细' : activeLang === 'ru' ? 'Спецификация груза' : activeLang === 'fr' ? 'Détails des besoins entrepôt' : 'Warehousing Specifications'}
                    </label>
                    <textarea
                      id="msg"
                      name="message"
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] outline-none font-semibold text-sm transition-all resize-none animate-pulse-once"
                      placeholder={activeLang === 'zh' ? '请简述：如 multi-supplier 拼货件数，大概箱数与卡板量、是否需要特殊免熏蒸木箱包装、是否需要开箱拍照/条码匹配等。' : 'Specify warehouse requirements (e.g. multi-supplier consolidation estimate, total cartons, request for crating, pallet counts, photo audit, or barcode matches).'}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fname" className="block text-sm font-bold text-slate-700 mb-1">
                        {t('get_a_quote.fname')}
                      </label>
                      <input
                        id="fname"
                        name="name"
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] outline-none font-semibold text-sm transition-all"
                        placeholder="e.g. Young Ming / DDNZ Global"
                      />
                    </div>
                    <div>
                      <label htmlFor="eml" className="block text-sm font-bold text-slate-700 mb-1">
                        {t('get_a_quote.email')}
                      </label>
                      <input
                        id="eml"
                        name="email"
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] outline-none font-semibold text-sm transition-all"
                        placeholder="partnership@ddnzglobal.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={state.submitting}
                    className={`w-full py-4 text-white font-bold rounded-xl transition-all shadow-md transform hover:-translate-y-0.5 active:translate-y-0 shrink-0 ${
                      state.submitting ? 'bg-slate-600' : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-xl'
                    }`}
                  >
                    {state.submitting ? t('get_a_quote.submitting') : t('get_a_quote.submit')}
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                     <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">
                    {activeLang === 'zh' ? '集货需求已接收！华正邦泰 专属仓管小队已就位！' : activeLang === 'ru' ? 'Ваш запрос на склад отправлен!' : activeLang === 'fr' ? 'Demande de stockage configurée !' : 'Warehouse RFQ Successfully Registered!'}
                  </h3>
                  <p className="text-slate-500 font-semibold mb-6 max-w-md mx-auto text-sm sm:text-base">
                    {activeLang === 'zh' ? '我们的大湾区集拼专家将在 2 小时内给您出具最优零中转费集货排期与打包加固估费。请关注您的邮件或社交网络。' : activeLang === 'ru' ? 'Наши логисты свяжутся с вами в течение 2 часов для обсуждения условий упаковки и хранения.' : activeLang === 'fr' ? 'Nos ingénieurs logistiques analysent les points de livraison de vos fournisseurs et reviennent vers vous sous 2 heures.' : 'Our South China consolidation specialists are computing your factory consolidation map and will deliver a custom crating/routing report within 2 hours.'}
                  </p>
                  <button 
                    onClick={() => setIsFormSubmitted(false)}
                    className="text-[#4B27B1] hover:text-[#361793] font-bold text-sm underline"
                  >
                    {activeLang === 'zh' ? '返回集运页面' : activeLang === 'ru' ? 'Вернуться назад' : activeLang === 'fr' ? 'Retour aux détails' : 'Go Back to Service Details'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />
        <WhatsAppFloat />
        <ScrollToTop />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <SEO title={currentSEO?.title} description={currentSEO?.desc} keywords={currentSEO?.keywords} />
      <SchemaMarkup 
        type="Service" 
        data={{
          name: data.title,
          description: data.heroSubtitle || data.title,
          serviceType: 'Freight Forwarding and Global Supply Chain'
        }} 
      />
      <Navbar />

      {/* Hero Block */}
      <section className={`relative pt-32 pb-20 md:pb-32 bg-gradient-to-br ${config.bgGrad} text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-35" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-orange-300 text-xs font-bold uppercase tracking-widest mb-6 border border-white/10">
              <IconComponent className="w-4 h-4 text-orange-400" />
              {data.tag}
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
              {data.title}
            </h1>
            <p className="text-purple-100 text-lg sm:text-xl font-medium leading-relaxed mb-8 max-w-2xl">
              {data.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a 
                href="#rfq-form-section"
                className="bg-gradient-to-r from-[#FF8A00] to-[#FF5500] hover:from-[#ff9c22] hover:to-[#ff6715] text-white font-bold px-8 py-4 rounded-xl text-center shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {activeLang === 'zh' ? '立即询本服务底价' : activeLang === 'ru' ? 'Запросить расчет' : activeLang === 'fr' ? 'Demander un tarif' : 'Get Firm Rate Now'}
                <ArrowRight className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/8613430335022" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-center border border-white/20 backdrop-blur-sm transition-all flex items-center justify-center gap-2"
              >
                {t('hero.chat')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Column Core USPs */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.advs.map((adv: any, index: number) => (
              <div 
                key={index}
                className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-purple-100 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#4B27B1]/10 flex items-center justify-center mb-6 text-[#4B27B1]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-3 tracking-tight">
                  {adv.title}
                </h3>
                <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">
                  {adv.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep-Dive / Quick Facts Dual Split */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
            
            {/* Left Column: Deep Dive */}
            <div className="lg:col-span-7">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">
                {data.deepDive.title}
              </h2>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8 font-medium">
                {data.deepDive.desc}
              </p>
              <div className="space-y-6">
                {data.deepDive.sections.map((sec: any, index: number) => (
                  <div key={index} className="flex gap-4 p-5 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold shrink-0 text-sm mt-0.5">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">{sec.name}</h4>
                      <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">{sec.info || sec.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Quick Facts Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#4B27B1] to-[#361793] text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-10" />
              <h3 className="text-2xl font-black tracking-tight mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-orange-400" fill="currentColor" />
                {data.quickFacts.title}
              </h3>
              <div className="h-1 w-12 bg-orange-400 rounded-full mb-8" />
              <ul className="space-y-6">
                {data.quickFacts.points.map((pt: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-purple-100">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5 text-xs text-orange-300 font-bold">
                      ✓
                    </div>
                    <span className="text-sm md:text-base leading-relaxed font-semibold">
                      {pt}
                    </span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-10 p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-orange-400 shrink-0" />
                <p className="text-xs text-purple-200 font-medium leading-relaxed">
                  {t('get_a_quote.fclNote')}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Transit Times Table Matrix */}
      <section className="py-16 bg-slate-100 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">
              {data.lanes.title}
            </h2>
            <div className="h-1 w-16 bg-[#4B27B1] mx-auto rounded-full" />
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-xs sm:text-sm uppercase tracking-wider">
                    {data.lanes.headers.map((h: string, idx: number) => (
                      <th key={idx} className="px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm md:text-base font-semibold text-slate-600">
                  {data.lanes.rows.map((row: string[], idx: number) => (
                    <tr key={idx} className="hover:bg-slate-55/40 transition-colors">
                      <td className="px-6 py-4 text-slate-900 font-bold flex items-center gap-2">
                        <span>🌐</span>
                        {row[0]}
                      </td>
                      <td className="px-6 py-4">{row[1]}</td>
                      <td className="px-6 py-4 text-purple-700 font-mono text-sm">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Step by Step Workflow (1 to 6) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-24">
            <div className="text-[#4B27B1] font-bold tracking-widest text-xs uppercase mb-2">
              {activeLang === 'zh' ? '规范交付流程' : activeLang === 'ru' ? 'ЭТАПЫ РАБОТЫ' : activeLang === 'fr' ? 'ÉTAPES CLÉS' : 'TRANSPARENT ROADMAP'}
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
              {activeLang === 'zh' ? '华正邦泰标准 6 步服务周期' : activeLang === 'ru' ? 'Как осуществляется доставка' : activeLang === 'fr' ? 'Notre cycle en 6 étapes' : 'Standard 1-to-6 Step Logistics Workflow'}
            </h2>
            <div className="h-1.5 w-16 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 relative">
            {stepsLocal.map((step, index) => (
              <div 
                key={index} 
                className="relative bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg hover:border-purple-100 transition-all group"
              >
                <div className="absolute top-4 right-6 text-4xl sm:text-5xl font-black text-slate-200/60 group-hover:text-[#FF8A00]/15 select-none transition-colors">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#4B27B1] transition-colors mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed font-semibold">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture and Request form */}
      <section id="rfq-form-section" className="py-16 md:py-24 bg-purple-50/40 border-t border-purple-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {activeLang === 'zh' ? '获取该服务的精准专享报价' : activeLang === 'ru' ? 'Заказать этот сервис' : activeLang === 'fr' ? 'Dossier de Devis Spécifique' : 'Request a Custom Services Quote'}
            </h2>
            <p className="text-slate-500 font-medium text-sm md:text-base">
              {t('get_a_quote.formSubtitle')}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-purple-100 shadow-xl p-8 sm:p-10 relative overflow-hidden">
            {!isFormSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {t('get_a_quote.mode')}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'Sea', label: t('get_a_quote.modeSea') },
                      { id: 'Land', label: t('get_a_quote.modeLand') },
                      { id: 'Air', label: t('get_a_quote.modeAir') },
                      { id: 'Sourcing', label: activeLang === 'zh' ? '采购验货集运' : 'Sourcing/Prep' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedService(item.id)}
                        className={`py-2.5 px-3 rounded-lg border-2 transition-all flex items-center justify-center font-bold text-xs sm:text-sm ${
                          selectedService === item.id 
                            ? 'border-[#4B27B1] bg-purple-50 text-[#4B27B1]' 
                            : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <input type="hidden" name="service" value={selectedService} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="origin" className="block text-sm font-bold text-slate-700 mb-1">
                      {t('get_a_quote.originLabel')}
                    </label>
                    <input
                      id="origin"
                      name="origin"
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] outline-none font-semibold text-sm transition-all"
                      placeholder={t('get_a_quote.originPlaceholder')}
                    />
                  </div>
                  <div>
                    <label htmlFor="destination" className="block text-sm font-bold text-slate-700 mb-1">
                      {t('get_a_quote.destLabel')}
                    </label>
                    <input
                      id="destination"
                      name="destination"
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] outline-none font-semibold text-sm transition-all"
                      placeholder={t('get_a_quote.destPlaceholder')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="comp" className="block text-sm font-bold text-slate-700 mb-1">
                    {activeLang === 'zh' ? '主营物资品类/电池参数' : activeLang === 'ru' ? 'Категория груза / Характеристики' : activeLang === 'fr' ? 'Type de marchandises' : 'Cargo Category'}
                  </label>
                  <select
                    id="comp"
                    name="product"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] outline-none font-semibold text-sm transition-all"
                  >
                    <option value="New Energy / ESS">{t('get_a_quote.indNev')}</option>
                    <option value="Commercial Furniture">{t('get_a_quote.indFurn')}</option>
                    <option value="Project Cargo">{t('get_a_quote.indProject')}</option>
                    <option value="Other">{t('get_a_quote.indOther')}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="msg" className="block text-sm font-bold text-slate-700 mb-1">
                    {t('get_a_quote.cargo')}
                  </label>
                  <textarea
                    id="msg"
                    name="message"
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] outline-none font-semibold text-sm transition-all resize-none"
                    placeholder={t('get_a_quote.msgPlaceholder')}
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fname" className="block text-sm font-bold text-slate-700 mb-1">
                      {t('get_a_quote.fname')}
                    </label>
                    <input
                      id="fname"
                      name="name"
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] outline-none font-semibold text-sm transition-all"
                      placeholder="e.g. Young Ming / DDNZ Global"
                    />
                  </div>
                  <div>
                    <label htmlFor="eml" className="block text-sm font-bold text-slate-700 mb-1">
                      {t('get_a_quote.email')}
                    </label>
                    <input
                      id="eml"
                      name="email"
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] outline-none font-semibold text-sm transition-all"
                      placeholder="partnership@ddnzglobal.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={state.submitting}
                  className={`w-full py-4 text-white font-bold rounded-xl transition-all shadow-md transform hover:-translate-y-0.5 active:translate-y-0 shrink-0 ${
                    state.submitting ? 'bg-slate-600' : 'bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] hover:shadow-xl'
                  }`}
                >
                  {state.submitting ? t('get_a_quote.submitting') : t('get_a_quote.submit')}
                </button>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 px-6 bg-[#4B27B1] rounded-2xl text-white"
              >
                <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-3xl font-bold">✓</span>
                </div>
                <h3 className="text-2xl font-black mb-3">
                  {activeLang === 'zh' ? '询价需求提交成功！' : activeLang === 'ru' ? 'Заявка принята!' : activeLang === 'fr' ? 'Demande Reçue !' : 'RFQ Submitted successfully!'}
                </h3>
                <p className="text-purple-100 max-w-sm mx-auto leading-relaxed text-sm md:text-base mb-8">
                  {t('get_a_quote.alertSuccess')}
                </p>
                <button 
                  onClick={() => setIsFormSubmitted(false)}
                  className="bg-white hover:bg-slate-100 text-slate-900 border font-bold px-6 py-2.5 rounded-full text-xs transition-colors"
                >
                  {activeLang === 'zh' ? '再次发送新请求' : 'Send another request'}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
      <ScrollToTop />
    </div>
  );
}

const LANGUAGES_SUPPORTED = ['en', 'zh', 'ru', 'fr'];
