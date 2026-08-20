import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import ScrollToTop from '../components/ScrollToTop';
import SchemaMarkup from '../components/SchemaMarkup';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { 
  Ship, Plane, ShieldAlert, BadgeCheck, CheckCircle2, ArrowRight, 
  Clock, DollarSign, Languages, Landmark, Star, HelpCircle, AlertCircle,
  Package, ShieldCheck, Thermometer, FileText, Truck, Zap, Globe, MapPin, ClipboardCheck, Boxes, Route, Camera
} from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import { trackEvent } from '../lib/utils';
import { getImgUrl } from '../constants';
import { buildAttributedWhatsAppUrl } from '../lib/attribution';

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
          'Carrier and schedule options reviewed for each booking',
          'Export documents checked before cargo moves to port',
          'FCL and LCL planning based on cargo volume and destination',
          'Inspection and loading coordination available in Guangzhou'
        ]
      },
      advs: [
        { title: 'Carrier Rate Review', desc: 'Quote options are confirmed against sailing schedule, equipment and destination scope.' },
        { title: 'FCL & LCL Planning', desc: 'Container and consolidation options are matched to your cargo volume and delivery plan.' },
        { title: 'Key Trade Lanes', desc: 'Routes are planned across Latin America, the Middle East, Africa and Eurasian markets.' },
        { title: 'DG & Lithium Preparation', desc: 'Eligibility and documentation are reviewed before booking dangerous goods or lithium cargo.' }
      ],
      deepDive: {
        title: 'How we plan your shipment',
        desc: 'We coordinate the shipment from booking through export documentation and handover. Your plan is built around cargo details, route availability and the delivery requirements you provide.',
        sections: [
          { name: 'FCL (Full Container Load)', info: 'We confirm equipment, loading requirements and available sailing options for full-container cargo.' },
          { name: 'LCL (Less-than-Container Load)', info: 'Smaller shipments can be consolidated after cargo, packing and destination requirements are confirmed.' },
          { name: 'Export documentation', info: 'We review the export declaration and shipping documents needed before cargo is handed over.' }
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
          '每票确认可用船期、舱位与目的港操作范围',
          '货物进港前核对出口资料与申报要求',
          '根据货量和目的地规划整柜或拼箱方案',
          '可协调广州验货、集货及装柜监装'
        ]
      },
      advs: [
        { title: '船期与运价核对', desc: '结合船期、用箱和目的港操作范围，确认适合本票货物的报价方案。' },
        { title: '整柜与拼箱规划', desc: '根据货量、包装和交期，匹配整柜或拼箱的出运安排。' },
        { title: '重点贸易航线', desc: '围绕中南美、中东、非洲及欧亚市场规划海运路线。' },
        { title: '危险品与锂电前置审核', desc: '危险品或锂电货物在订舱前先核验适运性和资料要求。' }
      ],
      deepDive: {
        title: '如何规划您的海运方案',
        desc: '我们从订舱、出口资料到货物交接进行协调。方案以货物信息、可用航线和您确认的交付要求为基础。',
        sections: [
          { name: '海运整箱 (FCL)', info: '确认用箱、装载要求和可用船期，为整柜货物安排订舱。' },
          { name: '海运拼箱 (LCL)', info: '在货物、包装和目的地要求确认后，安排小批量货物的集拼方案。' },
          { name: '出口资料配合', info: '货物交接前核对出口申报及运输所需资料。' }
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
          ['China → USA', 'LAX, JFK, ORD, DFW, ATL', '2 - 4 Days', '3 - 7 Days'],
          ['China → Europe', 'AMS, FRA, LHR, CDG', '2 - 3 Days', '3 - 5 Days'],
          ['China → Middle East', 'DXB, DOH, RUH', '1 - 3 Days', '2 - 4 Days']
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
          ['中国 → 美国', 'LAX, JFK, ORD, DFW, ATL', '2 - 4 天', '3 - 7 天'],
          ['中国 → 欧洲', 'AMS, FRA, LHR, CDG', '2 - 3 天', '3 - 5 天'],
          ['中国 → 中东', 'DXB, DOH, RUH', '1 - 3 天', '2 - 4 天']
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
          ['Китай → США', 'LAX, JFK, ORD, DFW, ATL', '2 - 4 дня', '3 - 7 дней'],
          ['Китай → Европа', 'AMS, FRA, LHR, CDG', '2 - 3 дня', '3 - 5 дней'],
          ['Китай → Ближний Восток', 'DXB, DOH, RUH', '1 - 3 дня', '2 - 4 дня']
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
          ['Chine → USA', 'LAX, JFK, ORD, DFW, ATL', '2 - 4 Jours', '3 - 7 Jours'],
          ['Chine → Europe', 'AMS, FRA, LHR, CDG', '2 - 3 Jours', '3 - 5 Jours'],
          ['Chine → Moyen-Orient', 'DXB, DOH, RUH', '1 - 3 Jours', '2 - 4 Jours']
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
      title: '中国仓储、验货与出口集运服务',
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

const LOCALIZED_SERVICE_PRESENTATION: Record<string, Record<string, Record<string, any>>> = {
  es: {
    'sea-freight': { title: 'Flete marítimo desde China', tag: 'Soluciones integradas de logística oceánica', heroSubtitle: 'Envíos FCL y LCL rentables con contratos directos con navieras.', quickFacts: { title: 'Información clave', points: ['Contratos directos con MAERSK, MSC y COSCO', 'Gestión profesional del despacho de exportación', 'Opciones de entrega DDP disponibles', 'Inspección y control de carga en Guangzhou'] } },
    'air-freight': { title: 'Carga aérea desde China', tag: 'Soluciones aéreas urgentes y flexibles', heroSubtitle: 'Carga aérea fiable para envíos urgentes, con recogida, despacho y seguimiento coordinados.', quickFacts: { title: 'Información clave', points: ['Rutas exprés y económicas', 'Cobertura global de aeropuertos', 'Gestión profesional de exportación', 'Seguimiento operativo de principio a fin'] } },
    'amazon-fba': { title: 'Logística Amazon FBA desde China', tag: 'Preparación, etiquetado y entrega FBA', heroSubtitle: 'Preparamos, etiquetamos y enviamos su mercancía desde proveedores chinos a centros Amazon.', quickFacts: { title: 'Información clave', points: ['Etiquetado y preparación FNSKU', 'Consolidación de varios proveedores', 'Reserva de citas de entrega', 'Entrega directa a almacenes Amazon'] } },
    'warehouse-services': { title: 'Almacén y consolidación en China', tag: 'Almacenamiento, preparación y distribución', heroSubtitle: 'Almacenamiento seguro, consolidación y preparación de exportación desde nuestro centro de Guangzhou.', quickFacts: { title: 'Información clave', points: ['Almacén seguro y controlado', 'Inventario WMS en tiempo real', 'Inspección, embalaje y etiquetado', 'Cross-docking y consolidación'] } },
  },
  ar: {
    'sea-freight': { title: 'الشحن البحري من الصين', tag: 'حلول لوجستية بحرية متكاملة', heroSubtitle: 'شحنات FCL وLCL اقتصادية مع عقود مباشرة مع خطوط الملاحة.', quickFacts: { title: 'معلومات سريعة', points: ['عقود مباشرة مع MAERSK وMSC وCOSCO', 'إدارة احترافية لإجراءات التصدير', 'خيارات تسليم DDP متاحة', 'فحص وتحكم في التحميل في قوانغتشو'] } },
    'air-freight': { title: 'الشحن الجوي من الصين', tag: 'حلول جوية سريعة ومرنة', heroSubtitle: 'شحن جوي موثوق للبضائع العاجلة مع استلام وتخليص ومتابعة منسقة.', quickFacts: { title: 'معلومات سريعة', points: ['مسارات سريعة واقتصادية', 'تغطية مطارات عالمية', 'إدارة تصدير احترافية', 'متابعة تشغيلية من البداية للنهاية'] } },
    'amazon-fba': { title: 'لوجستيات Amazon FBA من الصين', tag: 'تجهيز ووسم وتسليم FBA', heroSubtitle: 'نجهز ونوسم ونشحن بضائعكم من الموردين في الصين إلى مراكز Amazon.', quickFacts: { title: 'معلومات سريعة', points: ['وسم وتجهيز FNSKU', 'تجميع عدة موردين', 'حجز مواعيد التسليم', 'تسليم مباشر إلى مستودعات Amazon'] } },
    'warehouse-services': { title: 'التخزين والتجميع في الصين', tag: 'تخزين وتجهيز وتوزيع', heroSubtitle: 'تخزين آمن وتجميع وتجهيز للتصدير من مركزنا في قوانغتشو.', quickFacts: { title: 'معلومات سريعة', points: ['مستودع آمن ومراقب', 'مخزون WMS لحظي', 'فحص وتغليف ووسم', 'شحن متقاطع وتجميع'] } },
  },
};

const SEA_FREIGHT_LOADING_PROOF: Record<string, {
  eyebrow: string;
  title: string;
  description: string;
  privacy: string;
  captions: string[];
  alts: string[];
}> = {
  en: {
    eyebrow: 'China origin operations',
    title: 'Real container loading records',
    description: 'Operational photos showing cargo staging, forklift loading and completed container utilization before departure from China.',
    privacy: 'Shipment labels, documents and vehicle identifiers have been removed to protect customer information.',
    captions: ['Forklift-assisted loading', 'Completed container utilization', 'Wet-weather loading completed'],
    alts: ['Forklift loading packaged cargo into a shipping container', 'Fully loaded shipping container at a China origin facility', 'Completed container loading during wet-weather operations'],
  },
  zh: {
    eyebrow: '中国始发端实拍',
    title: '真实装柜作业记录',
    description: '现场照片展示货物进柜、叉车装载与整柜完成状态，让客户在货物离开中国前看见真实操作过程。',
    privacy: '客户标签、单据与车辆识别信息均已脱敏处理。',
    captions: ['叉车辅助装柜', '整柜装载完成', '雨天装柜完成'],
    alts: ['叉车将包装货物装入海运集装箱', '中国始发端完成装载的海运集装箱', '雨天作业环境下完成集装箱装载'],
  },
  ru: {
    eyebrow: 'Операции в Китае',
    title: 'Реальные записи загрузки контейнеров',
    description: 'Рабочие фотографии показывают подготовку груза, погрузку вилочным погрузчиком и заполненный контейнер перед отправкой из Китая.',
    privacy: 'Этикетки, документы и идентификаторы транспорта удалены для защиты данных клиентов.',
    captions: ['Погрузка вилочным погрузчиком', 'Контейнер полностью загружен', 'Погрузка завершена в дождливую погоду'],
    alts: ['Погрузка упакованного груза в контейнер вилочным погрузчиком', 'Полностью загруженный морской контейнер в Китае', 'Завершенная загрузка контейнера в дождливую погоду'],
  },
  fr: {
    eyebrow: 'Opérations au départ de Chine',
    title: 'Chargements réels de conteneurs',
    description: 'Des photos opérationnelles montrent la préparation du fret, le chargement au chariot élévateur et le conteneur rempli avant le départ de Chine.',
    privacy: 'Les étiquettes, documents et identifiants des véhicules ont été retirés afin de protéger les données clients.',
    captions: ['Chargement au chariot élévateur', 'Conteneur entièrement chargé', 'Chargement terminé par temps humide'],
    alts: ['Chargement de colis dans un conteneur avec un chariot élévateur', 'Conteneur maritime entièrement chargé en Chine', 'Chargement de conteneur terminé par temps humide'],
  },
  es: {
    eyebrow: 'Operación en origen en China',
    title: 'Registros reales de carga de contenedores',
    description: 'Fotografías operativas muestran la preparación, la carga con montacargas y el contenedor completo antes de salir de China.',
    privacy: 'Se eliminaron etiquetas, documentos e identificadores de vehículos para proteger la información del cliente.',
    captions: ['Carga asistida con montacargas', 'Contenedor completamente cargado', 'Carga completada con lluvia'],
    alts: ['Montacargas introduciendo mercancía embalada en un contenedor', 'Contenedor marítimo completamente cargado en China', 'Carga de contenedor completada durante condiciones de lluvia'],
  },
  ar: {
    eyebrow: 'عمليات منشأ الشحنة في الصين',
    title: 'سجلات حقيقية لتحميل الحاويات',
    description: 'تُظهر صور التشغيل تجهيز البضائع والتحميل بالرافعة الشوكية والحاوية بعد اكتمال التحميل قبل مغادرتها الصين.',
    privacy: 'تمت إزالة ملصقات الشحن والمستندات ومعرّفات المركبات لحماية معلومات العملاء.',
    captions: ['تحميل بمساعدة الرافعة الشوكية', 'اكتمال تحميل الحاوية', 'اكتمال التحميل أثناء الطقس الماطر'],
    alts: ['رافعة شوكية تحمل بضائع معبأة داخل حاوية شحن', 'حاوية شحن مكتملة التحميل في منشأة صينية', 'اكتمال تحميل الحاوية أثناء الطقس الماطر'],
  },
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
  const baseData = SERVICES_DATA[currentKey]?.[activeLang] || SERVICES_DATA[currentKey]?.['en'];
  const data = { ...baseData, ...(LOCALIZED_SERVICE_PRESENTATION[language]?.[currentKey] || {}) };
  const attributedWhatsAppUrl = buildAttributedWhatsAppUrl();

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

    const localizedSeo: Record<string, Record<string, { title: string; desc: string; keywords: string }>> = {
      es: {
        'sea-freight': { title: 'Flete marítimo desde China | Heaven Born', desc: 'Servicios FCL y LCL desde China con consolidación, despacho y opciones puerta a puerta.', keywords: 'flete marítimo china, envío FCL LCL, agente de carga china' },
        'air-freight': { title: 'Carga aérea desde China | Heaven Born', desc: 'Carga aérea urgente y económica desde China con recogida, exportación y seguimiento.', keywords: 'carga aérea china, flete aéreo urgente, agente de carga china' },
        'amazon-fba': { title: 'Logística Amazon FBA desde China | Heaven Born', desc: 'Preparación FBA, etiquetado FNSKU y entrega desde China a centros Amazon.', keywords: 'amazon fba china, preparación fba, etiquetado fnsku' },
        'warehouse-services': { title: 'Almacén y consolidación en China | Heaven Born', desc: 'Almacenamiento, inspección, consolidación y preparación de exportación en Guangzhou.', keywords: 'almacén china, consolidación carga, logística guangzhou' },
      },
      ar: {
        'sea-freight': { title: 'الشحن البحري من الصين | Heaven Born', desc: 'خدمات FCL وLCL من الصين مع التجميع والتخليص وخيارات التسليم من الباب إلى الباب.', keywords: 'الشحن البحري من الصين، شحن FCL LCL، وكيل شحن الصين' },
        'air-freight': { title: 'الشحن الجوي من الصين | Heaven Born', desc: 'شحن جوي سريع واقتصادي من الصين مع الاستلام وإجراءات التصدير والمتابعة.', keywords: 'الشحن الجوي من الصين، شحن جوي سريع، وكيل شحن الصين' },
        'amazon-fba': { title: 'لوجستيات Amazon FBA من الصين | Heaven Born', desc: 'تجهيز FBA ووسم FNSKU وتسليم من الصين إلى مراكز Amazon.', keywords: 'Amazon FBA الصين، تجهيز FBA، وسم FNSKU' },
        'warehouse-services': { title: 'التخزين والتجميع في الصين | Heaven Born', desc: 'تخزين وفحص وتجميع وتجهيز للتصدير في قوانغتشو.', keywords: 'مستودع الصين، تجميع الشحنات، لوجستيات قوانغتشو' },
      },
    };
    const currentSEOVal = localizedSeo[language]?.[currentKey] || seoMeta[currentKey]?.[activeLang] || seoMeta[currentKey]?.['en'];
    if (currentSEOVal) {
      setCurrentSEO(currentSEOVal);
    }
  }, [serviceId, currentKey, activeLang]);

  useEffect(() => {
    if (state.succeeded) {
      trackEvent('quote_form_submit', {
        event_category: 'conversion',
        form_location: 'service_page',
        service: currentKey,
      });
      setIsFormSubmitted(true);
    }
  }, [state.succeeded]);

  // Map serviceId to visual details
  const getServiceConfig = (sid: string) => {
    switch (sid) {
      case 'air-freight':
        return { icon: Plane, bgGrad: 'from-[var(--hb-navy-deep)] to-[var(--hb-blue)]', accentText: 'text-[var(--hb-amber)]', defaultTab: 'Air' };
      case 'amazon-fba':
        return { icon: BadgeCheck, bgGrad: 'from-orange-600 to-amber-800', accentText: 'text-amber-500', defaultTab: 'Sourcing' };
      case 'warehouse-services':
        return { icon: Package, bgGrad: 'from-[#071A33] to-[#0E4C78]', accentText: 'text-sky-600', defaultTab: 'Land' };
      default:
        return { icon: Ship, bgGrad: 'from-[#071A33] to-[#0E4C78]', accentText: 'text-sky-600', defaultTab: 'Sea' };
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
  ] : activeLang === 'es' ? [
    { num: '01', title: 'Cotización y viabilidad', desc: 'Comparta dimensiones y detalles de carga para definir la ruta adecuada.' },
    { num: '02', title: 'Recogida y consolidación', desc: 'Recogemos en fábrica o recibimos la carga en nuestro almacén de Guangzhou.' },
    { num: '03', title: 'Embalaje y documentos de exportación', desc: 'Embalaje de exportación y declaración aduanera gestionados por nuestro equipo.' },
    { num: '04', title: 'Tránsito internacional', desc: 'Carga segura en rutas marítimas, aéreas o terrestres programadas.' },
    { num: '05', title: 'Despacho de importación', desc: 'Coordinación de derechos, documentos y liberación local de la carga.' },
    { num: '06', title: 'Entrega final', desc: 'Entrega a centros Amazon, almacenes privados o el destino acordado.' }
  ] : activeLang === 'ar' ? [
    { num: '01', title: 'عرض السعر ودراسة الجدوى', desc: 'أرسل الأبعاد وتفاصيل الشحنة لتحديد المسار المناسب.' },
    { num: '02', title: 'الاستلام والتجميع', desc: 'نستلم من المصنع أو نستقبل البضائع في مستودعنا في قوانغتشو.' },
    { num: '03', title: 'التغليف ووثائق التصدير', desc: 'يتولى فريقنا تغليف التصدير وإجراءات الإقرار الجمركي.' },
    { num: '04', title: 'النقل الدولي', desc: 'تحميل آمن على مسارات بحرية أو جوية أو برية مجدولة.' },
    { num: '05', title: 'تخليص الاستيراد', desc: 'تنسيق الرسوم والمستندات والإفراج المحلي عن البضائع.' },
    { num: '06', title: 'التسليم النهائي', desc: 'تسليم إلى مراكز Amazon أو المستودعات الخاصة أو الوجهة المتفق عليها.' }
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
  const sharedServiceLabels = activeLang === 'zh'
    ? { quote: '获取本服务报价', planning: '运输方案规划', process: '标准服务流程' }
    : activeLang === 'es'
      ? { quote: 'Solicitar cotización', planning: 'Planificación del servicio', process: 'Proceso operativo' }
      : activeLang === 'ar'
        ? { quote: 'اطلب عرض سعر', planning: 'تخطيط الخدمة', process: 'خطوات التشغيل' }
        : activeLang === 'ru'
          ? { quote: 'Запросить расчет', planning: 'Планирование перевозки', process: 'Порядок работы' }
          : activeLang === 'fr'
            ? { quote: 'Demander un tarif', planning: 'Planification du transport', process: 'Processus opérationnel' }
            : { quote: 'Request a firm quote', planning: 'Service planning', process: 'Operating process' };

  if (currentKey === 'air-freight') {
    return (
      <div className="ddnz-home min-h-screen hb-page-shell font-sans text-slate-900">
        <SEO title={currentSEO?.title} description={currentSEO?.desc} keywords={currentSEO?.keywords} />
        <SourcingHomepageNav showFreightExecutor />

        {/* Block 1: Hero Banner */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[var(--hb-navy-deep)] to-[var(--hb-blue)] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid min-h-[34rem] items-center gap-10 py-12 md:grid-cols-12 md:py-16">
              <div className="md:col-span-7 lg:col-span-6">
              <span className="inline-flex items-center gap-2 text-amber-200 text-sm font-bold mb-5">
                <Plane className="w-4 h-4 text-amber-300 rotate-12" />
                {data.tag}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight leading-[1.04] mb-5">
                {data.title}
              </h1>
              <p className="text-slate-200 text-base sm:text-lg font-medium leading-relaxed mb-8 max-w-xl">
                {data.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a 
                  href="#rfq-form-section"
                  className="bg-[var(--hb-amber)] hover:bg-[var(--hb-amber-strong)] text-white font-bold px-7 py-3.5 rounded-xl text-center shadow-lg shadow-black/15 transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {sharedServiceLabels.quote}
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a 
                  href={attributedWhatsAppUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-7 py-3.5 rounded-xl border border-white/25 transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>{t('hero.chat')}</span>
                </a>
              </div>
              </div>
              <figure className="relative h-[19rem] overflow-hidden rounded-2xl border border-white/15 shadow-[0_28px_70px_rgba(0,0,0,0.28)] md:col-span-5 md:h-[27rem] md:rounded-l-none md:[clip-path:polygon(14%_0,100%_0,100%_100%,0_100%)] lg:col-span-6">
                <img
                  className="h-full w-full object-cover"
                  src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop"
                  alt={data.title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--hb-navy-deep)]/45 via-transparent to-transparent" />
              </figure>
            </div>
          </div>
        </section>

        {/* Block 2: Operational capabilities */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-2xl border border-slate-200 md:grid-cols-12">
              {data.advs.map((adv: any, index: number) => {
                return (
                  <article
                    key={index}
                    className={`${index === 0 ? 'bg-[var(--hb-navy-deep)] text-white md:col-span-5 md:row-span-3' : 'border-t border-slate-200 bg-[var(--hb-surface)] md:col-span-7'} grid gap-5 p-7 md:p-9`}
                  >
                    <Plane className={`${index === 0 ? 'h-9 w-9' : 'h-6 w-6'} text-[var(--hb-amber)]`} aria-hidden="true" />
                    <div>
                      <h2 className={`${index === 0 ? 'text-2xl md:text-3xl text-white' : 'text-xl text-[var(--hb-ink)]'} font-black mb-2 tracking-tight`}>{adv.title}</h2>
                      <p className={`${index === 0 ? 'text-slate-200' : 'text-slate-600'} text-sm md:text-base font-medium leading-relaxed max-w-[38rem]`}>{adv.desc}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Block 3: Service Options & Quick Facts (Dual Split) */}
        <section className="py-16 md:py-20 bg-[var(--hb-surface)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
              
              {/* Left Column: 5 Core Services */}
              <div className="lg:col-span-7">
                <p className="text-sm font-black text-[var(--hb-amber)] mb-3">{sharedServiceLabels.planning}</p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--hb-ink)] tracking-tight mb-3">
                  {data.coreServices.title}
                </h2>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8 font-medium">
                  {data.coreServices.desc}
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {data.coreServices.items.map((sec: any, index: number) => (
                    <div key={index} className={`${index === 0 ? 'sm:col-span-2' : ''} rounded-2xl border border-slate-200 bg-white p-6`}>
                      <div>
                        <h4 className="text-lg font-bold text-[var(--hb-ink)] mb-1">{sec.name}</h4>
                        <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed">{sec.info || sec.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Air Quick Facts Card */}
              <aside className="lg:col-span-5 bg-[var(--hb-navy-deep)] text-white rounded-2xl p-8 sm:p-10 shadow-[0_18px_45px_rgba(11,28,44,0.18)] relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-[var(--hb-amber)]" />
                <h3 className="text-2xl font-black tracking-tight mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-amber-300" />
                  {data.quickFacts.title}
                </h3>
                <ul className="space-y-4">
                  {data.quickFacts.points.map((pt: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm sm:text-base font-semibold text-slate-100">
                      <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </aside>

            </div>
          </div>
        </section>

        {/* Block 4: Popular Lanes & Transit Times (Air Matrix) */}
        <section className="py-16 bg-[var(--hb-surface)] border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">
                {data.lanes.title}
              </h2>
              <div className="h-1 w-16 bg-gradient-to-r from-[var(--hb-blue)] to-[var(--hb-amber)] mx-auto rounded-full" />
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
                        <td className="px-6 py-4 text-slate-900 font-bold flex items-center gap-2">
                          <Plane className="w-4 h-4 text-[var(--hb-blue)] shrink-0" aria-hidden="true" />
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
            <div className="mb-10 max-w-2xl md:mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
                {sharedServiceLabels.process}
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                {activeLang === 'zh' ? '从货物资料确认到目的地交付，每个环节由同一空运运营团队衔接。' : activeLang === 'es' ? 'Un mismo equipo aéreo coordina cada etapa, desde los datos de la carga hasta la entrega.' : activeLang === 'ar' ? 'يتولى فريق الشحن الجوي نفسه تنسيق كل مرحلة من بيانات الشحنة حتى التسليم.' : 'One air freight team coordinates each stage from cargo review through final delivery.'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-12 border-t border-slate-200 md:grid-cols-2">
              {data.workflow.map((step: any, index: number) => (
                <article
                  key={index} 
                  className="grid grid-cols-[3rem_1fr] gap-4 border-b border-slate-200 py-7"
                >
                  <div className="text-sm font-black text-[var(--hb-amber)]">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">{step.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Block 6: Value-Added Services (Air Logistics Specifics) */}
        <section className="py-16 md:py-20 bg-[var(--hb-surface)] border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-slate-900 mb-4">{data.valueAdded.title}</h2>
              <p className="text-slate-600 max-w-2xl mx-auto font-medium text-sm sm:text-base">{data.valueAdded.desc}</p>
              <div className="h-1 w-12 bg-[var(--hb-amber)] mx-auto mt-4 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.valueAdded.items.map((item: any, idx: number) => {
                const icons = [Landmark, Package, ShieldCheck, Thermometer];
                const CustomIcon = icons[idx % 4] || Landmark;
                return (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-[var(--hb-blue)] flex items-center justify-center mb-4">
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
        <section id="rfq-form-section" className="py-16 md:py-20 bg-white border-t border-slate-200">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                {activeLang === 'zh' ? '获取空运敏捷方案的专享评估' : activeLang === 'ru' ? 'Заказать этот сервис авиаперевозки' : activeLang === 'fr' ? 'Dossier de Devis Fret Aérien' : 'Request an Air Freight Service Quote'}
              </h2>
              <p className="text-slate-500 font-medium text-sm md:text-base">
                {t('get_a_quote.formSubtitle')}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_18px_45px_rgba(11,28,44,0.10)] p-8 sm:p-10 relative overflow-hidden">
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
                                ? 'border-[var(--hb-blue)] bg-sky-50 text-[var(--hb-blue)] font-bold'
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
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[var(--hb-blue)] focus:ring-2 focus:ring-sky-100 outline-none font-semibold text-base transition-all"
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
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[var(--hb-blue)] focus:ring-2 focus:ring-sky-100 outline-none font-semibold text-base transition-all"
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
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[var(--hb-blue)] focus:ring-2 focus:ring-sky-100 outline-none font-semibold text-base transition-all"
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
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[var(--hb-blue)] focus:ring-2 focus:ring-sky-100 outline-none font-semibold text-base transition-all resize-none"
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
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[var(--hb-blue)] focus:ring-2 focus:ring-sky-100 outline-none font-semibold text-base transition-all"
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
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[var(--hb-blue)] focus:ring-2 focus:ring-sky-100 outline-none font-semibold text-base transition-all"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={state.submitting}
                      className="w-full bg-[var(--hb-amber)] hover:bg-[var(--hb-amber-strong)] text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-colors active:scale-[0.99] focus:ring-4 focus:ring-amber-200 disabled:opacity-50"
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
                    {activeLang === 'zh' ? '我们的空运团队将根据您提交的货物信息确认可用航线、舱位和相关操作要求，并通过您留下的联系方式回复。' : activeLang === 'ru' ? 'Наша команда проверит доступные маршруты, места и операционные требования по данным вашего груза и свяжется с вами.' : activeLang === 'fr' ? 'Notre équipe vérifie les itinéraires, capacités et exigences opérationnelles à partir des informations de votre fret, puis vous contacte.' : 'Our air freight team will review available routes, capacity and operating requirements using your cargo details, then contact you.'}
                  </p>
                  <button 
                    onClick={() => setIsFormSubmitted(false)}
                    className="text-[var(--hb-blue)] hover:text-[var(--hb-navy)] font-bold text-sm underline"
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
          subtitle: 'FBA preparation, labeling, and coordinated delivery from China to Amazon fulfillment centers. DDP availability depends on the destination and cargo profile.',
          tag: 'Specialized E-Commerce Logistics',
        },
        solutions: {
          title: 'Complete Amazon FBA Solutions',
          desc: 'Coordinate pickup, preparation, export, appointment handling and final delivery through one operating team.',
          pillars: [
            { title: 'FBA Prep Services', desc: 'Professional labeling, packaging, and preparation according to Amazon requirements.' },
            { title: 'Direct to Amazon', desc: 'Scheduled deliveries to Amazon fulfillment centers with appointment booking.' },
            { title: 'Customs Coordination', desc: 'Prepare export documents and coordinate destination clearance within the confirmed service scope.' },
            { title: 'Milestone Updates', desc: 'Receive operational updates from warehouse receipt through final delivery.' }
          ]
        },
        quickFacts: {
          title: 'FBA Quick Facts',
          points: [
            'Amazon-compliant labeling and packaging',
            'Delivery plans for major Amazon marketplaces',
            'Appointment coordination where required',
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
          desc: 'Use these planning ranges to choose a mode. Your final quote confirms routing, customs scope and delivery requirements.',
          headers: ['Shipping Mode', 'Transit Time', 'Minimum', 'Included Service Details'],
          rows: [
            ['Sea Freight FBA', '25-35 Days', '100 Kg', 'Includes FBA prep + delivery (Supplier pickup, FBA labeling & prep, Customs clearance, Amazon delivery).'],
            ['Air Freight FBA (MOST POPULAR)', '7-12 Days', '50 Kg', 'Includes FBA prep + delivery (Fast flight transport, priority clearance + express/LTL delivery).'],
            ['Express FBA', '3-5 Days', '20 Kg', 'Fast courier routing for time-sensitive cartons. Delivery requirements are confirmed before dispatch.']
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
          subtitle: '从中国供应商提货、FBA 贴标到预约派送的协同服务。DDP 服务范围将根据目的国和货物情况确认。',
          tag: '高标准跨境电商全程履约通道',
        },
        solutions: {
          title: '亚马逊 FBA 综合物流解决方案',
          desc: '由同一运营团队协调提货、入仓、贴标、出口、预约与末端派送，减少多方沟通成本。',
          pillars: [
            { title: 'FBA 包装准备服务', desc: '根据亚马逊平台的严苛标准，进行高规格的商品加固、合规防跌落外箱贴标与清点。' },
            { title: '直发亚马逊库房', desc: '固定班期直接打托派送，与各大运营中心系统对接，完成无缝预约和入仓。' },
            { title: '关务协同支持', desc: '按确认的服务范围准备出口文件，并协调目的国清关与税费安排。' },
            { title: '关键节点更新', desc: '从入仓、起运到最终派送，提供可核对的运营进度更新。' }
          ]
        },
        quickFacts: {
          title: 'FBA 核心要素说明',
          points: [
            '按 Amazon FBA 要求进行 FNSKU 标签贴标与复核',
            '可规划主要 Amazon 站点的入仓派送',
            '按目的仓要求协调预约与末端派送',
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
          desc: '以下为选型参考时效与起运门槛，最终报价会确认路线、关务范围和末端交付要求。',
          headers: ['运输方式', '预计时效', '起运门槛', '包含的服务细节'],
          rows: [
            ['FBA 海运卡派/普派', '25-35 天', '100 公斤', '一站式包税送货到门（包含国内工厂提货、FBA 贴标与查验、出口申报、海运、双清、海外卡派）。'],
            ['FBA 空派包税专线（爆款主推）', '7-12 天', '50 公斤', '优先装运班机（包含高速空运干线、目的港急速清关及最后一英里快递或卡派）。'],
            ['FBA 国际快递直达', '3-5 天', '20 公斤', '适合时效敏感的箱货。发运前确认派送方式与目的仓要求。']
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
          desc: 'Оптимизируйте свой e-commerce бизнес на Amazon с помощью наших комплексных логистических услуг. От забора товара у поставщика в Китае до финальной приемки на складах Amazon. Мы берем на себя каждый этап.',
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
        <div className="flex flex-col gap-4 mt-3">
          {parts.map((part, pIdx) => {
            if (!part.trim()) return null;
            const normalized = part.endsWith(')') ? part : part + ')';
            const match = normalized.match(/(.*?)\s*\((.*?)\)/);
            if (match) {
              const areaName = match[1].trim();
              const codes = match[2].split(/,\s*/);
              return (
                <div key={pIdx} className="relative pl-4 pb-3 border-b border-slate-200 last:border-b-0 last:pb-0">
                  <div className="absolute left-0 top-1 bottom-3 w-px bg-sky-700/60" />
                  
                  <span className="text-xs font-bold text-slate-700 tracking-wide block mb-2 uppercase">
                    {areaName}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {codes.map((code, cIdx) => (
                      <span
                        key={cIdx}
                        className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold border border-slate-200 transition-colors duration-200 tracking-wider select-all cursor-pointer"
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
      <div className="ddnz-home hb-page-shell min-h-screen font-sans text-slate-900">
        <SEO title={currentSEO?.title} description={currentSEO?.desc} keywords={currentSEO?.keywords} />
        <SourcingHomepageNav showFreightExecutor />

        {/* The FBA template uses the shared Heaven Born navy / amber conversion system. */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0b1c2c] via-[#10283d] to-[#1d5274] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid min-h-[34rem] items-center gap-10 py-12 md:grid-cols-12 md:py-16">
              <div className="md:col-span-7 lg:col-span-6">
              <span className="inline-flex items-center gap-2 text-amber-200 text-sm font-semibold mb-5">
                <Package className="w-4 h-4 text-amber-300" aria-hidden="true" />
                {fba.hero.tag}
              </span>
              <h1 className={activeLang === 'zh' ? "text-4xl sm:text-5xl lg:text-[3.65rem] font-extrabold tracking-tight leading-[1.12] mb-5" : "text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] mb-5"}>
                {fba.hero.title}
              </h1>
              <p className="text-slate-200 text-base sm:text-lg font-medium leading-relaxed mb-8 max-w-2xl">
                {fba.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a 
                  href="#rfq-form-section"
                  className="hb-action font-bold px-7 py-3.5 rounded-xl text-center shadow-[0_10px_30px_rgba(217,119,6,.22)] transition-colors active:scale-[.98] flex items-center justify-center gap-2"
                >
                  {sharedServiceLabels.quote}
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a 
                  href={attributedWhatsAppUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/15 text-white font-bold px-7 py-3.5 rounded-xl border border-white/25 transition-colors active:scale-[.98] flex items-center justify-center gap-2"
                >
                  <span>{t('hero.chat')}</span>
                </a>
              </div>
              </div>
              <figure className="relative h-[19rem] overflow-hidden rounded-2xl border border-white/15 shadow-[0_28px_70px_rgba(0,0,0,0.28)] md:col-span-5 md:h-[27rem] md:rounded-l-none md:[clip-path:polygon(14%_0,100%_0,100%_100%,0_100%)] lg:col-span-6">
                <img
                  className="h-full w-full object-cover"
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop"
                  alt={fba.hero.title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--hb-navy-deep)]/50 via-transparent to-transparent" />
              </figure>
            </div>
          </div>
        </section>

        {/* Essential operating capabilities */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <h2 className="hb-section-title text-3xl md:text-4xl mb-4">{fba.solutions.title}</h2>
              <p className="text-slate-600 text-base leading-relaxed">{fba.solutions.desc}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 border-t border-slate-200 pt-8">
              {fba.solutions.pillars.map((pillar, idx) => {
                const icons = [ClipboardCheck, Truck, FileText, Route];
                const CustomIcon = icons[idx % 4] || ShieldCheck;
                return (
                  <div key={idx} className="grid grid-cols-[2.75rem_1fr] gap-4">
                    <div className="w-11 h-11 rounded-lg bg-sky-50 flex items-center justify-center text-sky-800 border border-sky-100">
                      <CustomIcon className="w-5 h-5" strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1.5">{pillar.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{pillar.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Preparation work and service scope */}
        <section className="py-16 md:py-20 bg-[#f5f8fa] border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left: Services We Offer */}
              <div className="lg:col-span-7">
                <h2 className="hb-section-title text-3xl mb-4">{fba.services.title}</h2>
                <p className="text-slate-600 mb-8 text-base leading-relaxed">{fba.services.desc}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {fba.services.badges.map((badge, idx) => (
                    <div key={idx} className="py-5 border-t border-slate-200 first:border-t-0 first:pt-0">
                      <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" strokeWidth={2} />
                        {badge.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{badge.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Quick Facts Card */}
              <div className="lg:col-span-5 bg-[#10283d] text-white rounded-[var(--hb-radius)] p-7 sm:p-8 border border-[#183b57]">
                <h3 className="text-xl font-extrabold tracking-tight mb-6 flex items-center gap-2">
                  <Boxes className="w-5 h-5 text-amber-300" strokeWidth={1.8} />
                  {fba.quickFacts.title}
                </h3>
                <ul className="space-y-4 border-t border-white/15 pt-5">
                  {fba.quickFacts.points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" strokeWidth={2} />
                      <span className="text-sm leading-relaxed font-medium">
                        {pt}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* The transport choice is the primary decision point on this page. */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <h2 className="hb-section-title text-3xl mb-3">{fba.rates.title}</h2>
              <p className="text-slate-600 text-base leading-relaxed">{fba.rates.desc}</p>
            </div>

            <div className="bg-white rounded-[var(--hb-radius)] border border-slate-300 overflow-hidden max-w-6xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#eef4f7] border-b border-slate-300 text-slate-700 font-bold text-xs sm:text-sm tracking-wide">
                      {fba.rates.headers.map((h, idx) => (
                        <th key={idx} className="px-6 py-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-xs sm:text-sm md:text-base text-slate-600">
                    {fba.rates.rows.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-5 text-slate-900 font-bold">
                          {row[0]}
                        </td>
                        <td className="px-6 py-5 text-sky-800 font-bold font-mono text-sm">{row[1]}</td>
                        <td className="px-6 py-5 text-amber-800 font-bold font-mono text-sm">{row[2]}</td>
                        <td className="px-6 py-5 text-slate-600 text-xs sm:text-sm leading-relaxed">{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FBA operating sequence */}
        <section className="py-16 md:py-20 bg-[#f5f8fa] border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <h2 className="hb-section-title text-3xl md:text-4xl mb-4">
                {fba.workflow.title}
              </h2>
              <p className="text-slate-600 max-w-xl text-base leading-relaxed">{fba.workflow.desc}</p>
            </div>

            <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-0 border-t border-slate-300">
              {fba.workflow.steps.map((step, idx) => (
                <li
                  key={idx} 
                  className="relative grid grid-cols-[2.5rem_1fr] gap-4 py-7 border-b border-slate-300"
                >
                  <div className="w-10 h-10 rounded-full bg-[#10283d] text-amber-200 flex items-center justify-center font-mono text-xs font-bold">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1.5">{step.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Coverage is kept scannable without making six large cards compete for attention. */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <h2 className="hb-section-title text-3xl sm:text-4xl mb-4">
                {fba.warehouses.title}
              </h2>
              <p className="text-slate-600 text-base leading-relaxed max-w-2xl">
                {fba.warehouses.desc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10">
              {fba.warehouses.regions.map((region, idx) => (
                <div
                  key={idx} 
                  className="py-7 border-t border-slate-200 first:border-t-0 md:[&:nth-child(2)]:border-t-0 lg:[&:nth-child(3)]:border-t-0"
                >
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-700 shrink-0" strokeWidth={2} />
                    <span>{region.name}</span>
                  </h3>
                  <div className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {renderWarehouseItems(region.items)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lead Capture and Request form */}
        <section id="rfq-form-section" className="py-16 md:py-20 bg-[#eef4f7] border-t border-slate-200">
          <div className="max-w-3xl mx-auto px-4">
            <div className="max-w-2xl mb-10">
              <h2 className="hb-section-title text-2xl md:text-3xl mb-3">
                {activeLang === 'zh' ? '获取专属 FBA 头程多式联运报价评估' : activeLang === 'ru' ? 'Заказать расчет доставки Amazon FBA' : activeLang === 'fr' ? 'Demander une étude de coût Amazon FBA' : 'Request a Custom FBA Shipping Quote'}
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                {t('get_a_quote.formSubtitle')}
              </p>
            </div>

            <div className="bg-white rounded-[var(--hb-radius)] border border-slate-300 shadow-[0_16px_40px_rgba(16,40,61,.08)] p-6 sm:p-8 relative overflow-hidden">
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
                            className={`py-2.5 px-3 rounded-lg border transition-colors flex items-center justify-center font-bold text-xs sm:text-sm ${
                              isSelected
                                ? 'border-sky-800 bg-sky-50 text-sky-900 font-bold'
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
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-sky-800 focus:ring-2 focus:ring-sky-100 outline-none text-base transition-colors"
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
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-sky-800 focus:ring-2 focus:ring-sky-100 outline-none text-base transition-colors"
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
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-sky-800 focus:ring-2 focus:ring-sky-100 outline-none text-base transition-colors"
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
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-sky-800 focus:ring-2 focus:ring-sky-100 outline-none text-base transition-colors resize-none"
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
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-sky-800 focus:ring-2 focus:ring-sky-100 outline-none text-base transition-colors"
                        placeholder="e.g. Maria Lopez / Andina Trading"
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
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-sky-800 focus:ring-2 focus:ring-sky-100 outline-none text-base transition-colors"
                        placeholder="partnership@ddnzglobal.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={state.submitting}
                    className={`w-full py-4 text-white font-bold rounded-xl transition-all shadow-md transform hover:-translate-y-0.5 active:translate-y-0 shrink-0 ${
                      state.submitting ? 'bg-slate-600' : 'hb-action hover:shadow-lg'
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
                    className="text-sky-800 hover:text-sky-950 font-bold text-sm underline"
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
          subtitle: 'Storage, consolidation, inspection coordination, and export preparation designed around your shipping plan from China.',
          tag: 'Strategic Operational Infrastructure'
        },
        whyChoose: {
          title: 'Why Choose Our Warehouse Services',
          desc: 'One China-side operating point for receiving, checking, consolidating and preparing cargo before export.',
          pillars: [
            { title: 'Cargo-appropriate handling', desc: 'We review dimensions, packaging and declared special requirements before receiving, moving or packing the cargo.', icon: ShieldCheck },
            { title: 'Multi-supplier control', desc: 'Supplier batches remain identified while cartons are received, checked and prepared for consolidation.', icon: Globe },
            { title: 'Export-ready preparation', desc: 'Repacking, shipping marks, inspection hand-offs and loading are coordinated against the confirmed sailing plan.', icon: Zap },
            { title: 'Visible handover records', desc: 'Receiving notes, exception photos and dispatch details keep the China-side handover easy to verify.', icon: DollarSign }
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
          title: 'What We Control Before Export',
          desc: 'Concrete checkpoints that reduce supplier hand-off gaps before cargo leaves China.',
          features: [
            { title: 'Guangzhou consolidation base', desc: 'Receive goods from multiple suppliers, keep batches identified and prepare one consolidated export shipment.' },
            { title: 'Receiving and exception checks', desc: 'Count cartons, check visible packaging condition and photograph discrepancies before further handling.' },
            { title: 'Export packing support', desc: 'Repack cartons, apply shipping marks and coordinate export plywood cases for machinery or sensitive cargo.' },
            { title: 'Inspection and loading coordination', desc: 'Arrange inspection hand-offs, loading tally and loading photos before dispatch to the port or airport.' }
          ],
          specs: [
            { label: 'Inbound check', value: 'Carton count + visible condition' },
            { label: 'Supplier consolidation', value: 'Separate batch identification' },
            { label: 'Packing support', value: 'Repacking, labels + export cases' },
            { label: 'Inspection hand-off', value: 'Photos + third-party coordination' },
            { label: 'Loading control', value: 'Tally + loading photos' },
            { label: 'Dispatch record', value: 'Released quantity + handover details' }
          ]
        },
        technology: {
          title: 'Warehouse Control & Shipment Visibility',
          desc: 'Practical records and checkpoints for receiving, consolidation, packing and dispatch.',
          badges: [
            { title: 'Inbound records', desc: 'Record cartons, quantities, visible condition and supplier references when cargo is received.', icon: Globe },
            { title: 'Barcode and label checks', desc: 'Scan or cross-check shipment labels, SKUs and carton marks before consolidation.', icon: Zap },
            { title: 'Photo updates', desc: 'Provide receiving, exception, packing and loading photos within the agreed service scope.', icon: FileText },
            { title: 'Supplier batch control', desc: 'Keep cargo from different suppliers identified before consolidation and export preparation.', icon: Languages },
            { title: 'Dispatch records', desc: 'Confirm released quantities, packing status and handover details before cargo leaves the warehouse.', icon: Clock },
            { title: 'Document access control', desc: 'Limit handling instructions and shipment documents to the assigned operating team.', icon: ShieldCheck }
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
          title: '中国仓储、验货与出口集运服务',
          subtitle: '围绕您的出运计划提供货物暂存、多供应商集货、验货协调及出口前准备服务，让中国采购与发运衔接更清晰。',
          tag: '中国出口仓储与集运中心'
        },
        whyChoose: {
          title: '为什么选择我们的仓储服务',
          desc: '用一个中国始发端操作节点，完成收货、核对、集货与出口前准备。',
          pillars: [
            { title: '匹配货物的操作方案', desc: '收货、搬运与包装前，先核对尺寸、包装状态及已申报的特殊要求。', icon: ShieldCheck },
            { title: '多供应商批次管控', desc: '不同供应商货物保持独立标识，完成收货核对后再按计划合并出运。', icon: Globe },
            { title: '出口前准备', desc: '围绕已确认的船期协调换箱、贴标、验货衔接与装载安排。', icon: Zap },
            { title: '可核对的交接记录', desc: '通过收货记录、异常照片和出库信息，让中国始发端交接过程可追溯。', icon: DollarSign }
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
          title: '货物出口前，我们实际管控什么',
          desc: '用清晰的操作节点减少供应商交货、集货与出口衔接之间的断点。',
          features: [
            { title: '广州集货主控基地', desc: '接收多家供应商货物，保持批次标识，并按同一出口计划完成合并出运。' },
            { title: '入仓与异常核对', desc: '登记到仓件数、检查外包装可见状态，并在后续操作前记录异常照片。' },
            { title: '出口包装支持', desc: '提供换箱、运输唛头及机械设备或敏感货物所需的出口木箱协调。' },
            { title: '验货与装载衔接', desc: '协调第三方验货交接、装载件数复核，并留存装柜或装车照片。' }
          ],
          specs: [
            { label: '入仓核对', value: '件数登记 + 外观检查' },
            { label: '多供应商集货', value: '分批标识 + 合并出运' },
            { label: '包装支持', value: '换箱、贴标及出口木箱' },
            { label: '验货衔接', value: '照片记录 + 第三方协调' },
            { label: '装载核对', value: '件数复核 + 装载照片' },
            { label: '出库记录', value: '放行数量 + 交接信息' }
          ]
        },
        technology: {
          title: '仓储操作记录与货物可视化',
          desc: '围绕入仓、集货、包装与出库设置可核对的记录与交接节点。',
          badges: [
            { title: '入仓记录', desc: '货物到仓时记录件数、外包装可见状态及对应供应商信息。', icon: Globe },
            { title: '条码与标签核对', desc: '集货前扫描或复核产品标签、SKU 与外箱唛头，减少错发风险。', icon: Zap },
            { title: '照片反馈', desc: '在约定服务范围内提供收货、异常、包装与装载照片。', icon: FileText },
            { title: '供应商批次管理', desc: '不同供应商货物保持清晰标识，再按出运计划进行合并与出口准备。', icon: Languages },
            { title: '出库记录', desc: '货物离仓前确认放行数量、包装状态及交接信息。', icon: Clock },
            { title: '文件权限管理', desc: '由指定操作团队处理货物指令与运输文件，减少无关人员接触。', icon: ShieldCheck }
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
          desc: 'Единая точка контроля в Китае для приемки, сверки, консолидации и подготовки груза к экспорту.',
          pillars: [
            { title: 'Обработка по типу груза', desc: 'До приемки и упаковки сверяем размеры, состояние тары и заявленные особые требования.', icon: ShieldCheck },
            { title: 'Контроль партий поставщиков', desc: 'Партии разных поставщиков сохраняют отдельную маркировку до объединения в одну отправку.', icon: Globe },
            { title: 'Подготовка к экспорту', desc: 'Координируем переупаковку, маркировку, передачу на инспекцию и погрузку по подтвержденному плану.', icon: Zap },
            { title: 'Проверяемые записи', desc: 'Фиксируем приемку, отклонения и сведения о передаче груза при отправке со склада.', icon: DollarSign }
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
          title: 'Что мы контролируем до экспорта',
          desc: 'Понятные контрольные точки сокращают разрывы между поставщиками, консолидацией и отправкой.',
          features: [
            { title: 'База консолидации в Гуанчжоу', desc: 'Принимаем товары от нескольких поставщиков, сохраняем маркировку партий и готовим объединенную экспортную отправку.' },
            { title: 'Приемка и фиксация отклонений', desc: 'Сверяем количество мест, видимое состояние упаковки и фотографируем отклонения до дальнейшей обработки.' },
            { title: 'Экспортная упаковка', desc: 'Организуем переупаковку, транспортную маркировку и фанерные ящики для оборудования или чувствительных грузов.' },
            { title: 'Инспекция и погрузка', desc: 'Координируем передачу на проверку, пересчет при погрузке и фотографии до отправки в порт или аэропорт.' }
          ],
          specs: [
            { label: 'Приемка', value: 'Количество + состояние упаковки' },
            { label: 'Консолидация', value: 'Раздельная маркировка партий' },
            { label: 'Упаковка', value: 'Короба, этикетки + экспортные ящики' },
            { label: 'Инспекция', value: 'Фото + координация третьей стороны' },
            { label: 'Погрузка', value: 'Пересчет + фотографии' },
            { label: 'Передача', value: 'Количество + данные выдачи' }
          ]
        },
        technology: {
          title: 'Учет складских операций и видимость груза',
          desc: 'Проверяемые записи для приемки, консолидации, упаковки и выдачи груза.',
          badges: [
            { title: 'Запись приемки', desc: 'Фиксируем количество мест, видимое состояние и данные поставщика при поступлении.', icon: Globe },
            { title: 'Проверка маркировки', desc: 'Сверяем штрихкоды, SKU и маркировку коробов перед консолидацией.', icon: Zap },
            { title: 'Фотоотчеты', desc: 'Предоставляем фотографии приемки, отклонений, упаковки и погрузки в согласованном объеме.', icon: FileText },
            { title: 'Контроль партий', desc: 'Сохраняем идентификацию грузов разных поставщиков до подготовки общей отправки.', icon: Languages },
            { title: 'Запись выдачи', desc: 'Подтверждаем количество, статус упаковки и сведения о передаче до выезда со склада.', icon: Clock },
            { title: 'Контроль доступа', desc: 'Инструкции и транспортные документы доступны назначенной операционной команде.', icon: ShieldCheck }
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
          desc: "Un point de contrôle en Chine pour réceptionner, vérifier, consolider et préparer la marchandise avant exportation.",
          pillars: [
            { title: 'Manutention adaptée au fret', desc: "Nous vérifions dimensions, emballage et exigences déclarées avant réception, déplacement ou conditionnement.", icon: ShieldCheck },
            { title: 'Contrôle des lots fournisseurs', desc: "Les lots restent identifiés séparément jusqu'à leur consolidation dans une expédition commune.", icon: Globe },
            { title: "Préparation à l'export", desc: "Nous coordonnons reconditionnement, marquage, inspection et chargement selon le plan confirmé.", icon: Zap },
            { title: 'Traçabilité des remises', desc: "Les notes de réception, photos d'anomalies et détails de sortie permettent de vérifier chaque transfert.", icon: DollarSign }
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
          title: "Ce Que Nous Contrôlons Avant l'Export",
          desc: "Des points de contrôle concrets réduisent les ruptures entre fournisseurs, consolidation et expédition.",
          features: [
            { title: 'Base de consolidation à Guangzhou', desc: "Réception des marchandises de plusieurs fournisseurs, identification des lots et préparation d'une expédition groupée." },
            { title: 'Contrôle à la réception', desc: "Comptage des colis, vérification visuelle de l'emballage et photos des écarts avant manipulation." },
            { title: "Emballage export", desc: "Reconditionnement, marquage et coordination de caisses en contreplaqué pour machines ou fret sensible." },
            { title: 'Inspection et chargement', desc: "Coordination des inspections, pointage au chargement et photos avant départ vers le port ou l'aéroport." }
          ],
          specs: [
            { label: 'Réception', value: 'Colis + état visible' },
            { label: 'Consolidation', value: 'Identification séparée des lots' },
            { label: 'Emballage', value: 'Reconditionnement, labels + caisses' },
            { label: 'Inspection', value: 'Photos + coordination tierce' },
            { label: 'Chargement', value: 'Pointage + photos' },
            { label: 'Sortie', value: 'Quantité + détails de remise' }
          ]
        },
        technology: {
          title: 'Contrôle des Opérations et Visibilité du Fret',
          desc: "Des enregistrements vérifiables pour la réception, la consolidation, l'emballage et la sortie.",
          badges: [
            { title: 'Enregistrement à la réception', desc: "Colis, quantités, état visible et référence fournisseur sont enregistrés à l'arrivée.", icon: Globe },
            { title: 'Contrôle des codes et labels', desc: 'Vérification des codes-barres, SKU et marques de colis avant consolidation.', icon: Zap },
            { title: 'Mises à jour photo', desc: "Photos de réception, anomalies, emballage et chargement selon le périmètre convenu.", icon: FileText },
            { title: 'Contrôle des lots fournisseurs', desc: "Les marchandises de chaque fournisseur restent identifiées avant préparation de l'export.", icon: Languages },
            { title: 'Enregistrement de sortie', desc: "Quantités libérées, état d'emballage et détails de remise sont confirmés avant départ.", icon: Clock },
            { title: "Contrôle d'accès documentaire", desc: "Les instructions et documents d'expédition sont réservés à l'équipe opérationnelle affectée.", icon: ShieldCheck }
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
    const warehouseOpsLabelsByLanguage = {
      en: { title: 'Service Deliverables', tag1: 'Recorded checkpoints', tag2: 'China-origin control' },
      zh: { title: '仓储服务交付清单', tag1: '关键节点有记录', tag2: '中国始发端管控' },
      ru: { title: 'Результаты складской обработки', tag1: 'Контрольные записи', tag2: 'Контроль в Китае' },
      fr: { title: 'Livrables des Opérations', tag1: 'Points de contrôle enregistrés', tag2: 'Contrôle à l’origine' },
      es: { title: 'Entregables del Servicio', tag1: 'Controles registrados', tag2: 'Control en origen' },
      ar: { title: 'مخرجات خدمة المستودع', tag1: 'نقاط تحقق موثقة', tag2: 'تحكم من منشأ الصين' }
    };
    const warehouseOpsLabels = warehouseOpsLabelsByLanguage[
      activeLang as keyof typeof warehouseOpsLabelsByLanguage
    ] || {
      title: 'Service Deliverables',
      tag1: 'Recorded checkpoints',
      tag2: 'China-origin control'
    };

    return (
      <div className="ddnz-home min-h-screen hb-page-shell font-sans text-slate-900">
        <SEO title={currentSEO?.title} description={currentSEO?.desc} keywords={currentSEO?.keywords} />
        <SourcingHomepageNav showFreightExecutor />

        {/* 1. Hero Banner */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0b1c2c] via-[#10283d] to-[#1d5274] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid min-h-[34rem] items-center gap-10 py-12 md:grid-cols-12 md:py-16">
              <div className="md:col-span-7 lg:col-span-6">
              <span className="inline-flex items-center gap-2 text-amber-200 text-sm font-bold mb-5">
                <Package className="w-4 h-4 text-amber-300" aria-hidden="true" />
                {wh.hero.tag}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-[1.06] mb-5">
                {wh.hero.title}
              </h1>
              <p className="text-slate-200 text-base sm:text-lg font-medium leading-relaxed mb-8 max-w-xl">
                {wh.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a 
                  href="#rfq-form-section"
                  className="hb-action px-8 py-4 text-center"
                >
                  {wh.bottomCta.btn1}
                </a>
                <a 
                  href={attributedWhatsAppUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-center border border-white/20 backdrop-blur-sm transition-all text-sm"
                >
                  {wh.bottomCta.btn2}
                </a>
              </div>
              </div>
              <figure className="relative h-[19rem] overflow-hidden rounded-2xl border border-white/15 shadow-[0_28px_70px_rgba(0,0,0,0.28)] md:col-span-5 md:h-[27rem] md:rounded-l-none md:[clip-path:polygon(14%_0,100%_0,100%_100%,0_100%)]">
                <img
                  className="h-full w-full object-cover"
                  src={getImgUrl('FACILITY_SCALE')}
                  alt={wh.hero.title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--hb-navy-deep)]/45 via-transparent to-transparent" />
              </figure>
            </div>
          </div>
        </section>

        {/* 2. Why Choose Our Warehouse Services */}
        <section className="py-20 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                {wh.whyChoose.title}
              </h2>
              <p className="text-slate-500 font-semibold text-sm sm:text-base leading-relaxed">
                {wh.whyChoose.desc}
              </p>
            </div>

            <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 md:grid-cols-12">
              {wh.whyChoose.pillars.map((pil, idx) => {
                const PilIcon = pil.icon;
                return (
                  <div 
                    key={idx} 
                    className={`${idx === 0 ? 'relative flex min-h-[24rem] flex-col justify-end overflow-hidden bg-[var(--hb-navy-deep)] text-white md:col-span-5 md:row-span-3' : 'border-t border-slate-200 bg-[var(--hb-surface)] md:col-span-7'} p-7 md:p-9`}
                  >
                    {idx === 0 && (
                      <>
                        <img
                          className="absolute inset-0 h-full w-full object-cover"
                          src={getImgUrl('FACILITY_SORT')}
                          alt={pil.title}
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,28,44,.08)_18%,rgba(11,28,44,.94)_82%)]" />
                      </>
                    )}
                    <div className="relative">
                      <div className={`${idx === 0 ? 'text-amber-300' : 'text-[var(--hb-amber)]'} mb-5`}>
                        <PilIcon className="w-6 h-6" />
                      </div>
                      <h3 className={`${idx === 0 ? 'text-2xl text-white' : 'text-xl text-slate-900'} font-bold mb-3 tracking-tight`}>
                        {pil.title}
                      </h3>
                      <p className={`${idx === 0 ? 'text-slate-100' : 'text-slate-600'} text-sm font-medium leading-relaxed`}>
                        {pil.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. Our Warehouse Services Breakdown (6 Core Product Modules) */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                {wh.breakdown.title}
              </h2>
              <p className="text-slate-500 font-semibold text-sm sm:text-base leading-relaxed">
                {wh.breakdown.desc}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-12 border-t border-slate-300 md:grid-cols-2">
              {wh.breakdown.modules.map((mod, idx) => {
                const ModIcon = mod.icon;
                return (
                  <article
                    key={idx} 
                    className="grid grid-cols-[2.75rem_1fr] gap-4 border-b border-slate-300 py-7"
                  >
                    <div className="text-[var(--hb-amber)] pt-1">
                      <ModIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {mod.title}
                      </h3>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed mb-4">
                        {mod.desc}
                      </p>
                    <ul className="grid gap-2">
                      {mod.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-[var(--hb-amber)] shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Our Warehouse Facilities & Specifications */}
        <section className="py-20 bg-white border-t border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                {wh.facilities.title}
              </h2>
              <p className="text-slate-500 font-semibold text-sm sm:text-base leading-relaxed">
                {wh.facilities.desc}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
              <div className="lg:col-span-6 border-t border-slate-300">
                {wh.facilities.features.map((feat, fIdx) => (
                  <div key={fIdx} className="grid grid-cols-[1.75rem_1fr] gap-3 border-b border-slate-300 py-6">
                    <CheckCircle2 className="w-5 h-5 text-[var(--hb-amber)] mt-0.5" aria-hidden="true" />
                    <div>
                    <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                      {feat.title}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed">
                      {feat.desc}
                    </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-6">
                <div className="bg-gradient-to-br from-slate-900 to-[#122c42] text-white p-8 rounded-[var(--hb-radius)] h-full flex flex-col justify-between relative overflow-hidden shadow-xl border border-slate-800">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
                  <div>
                    <h3 className="text-xl font-bold mb-6 pb-3 border-b border-slate-800 flex items-center gap-2 text-amber-300">
                      <FileText className="w-5 h-5" aria-hidden="true" />
                      {warehouseOpsLabels.title}
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
                    <div className="px-3 py-1 bg-sky-500/10 border border-sky-500/20 rounded text-sky-300 text-xs font-bold leading-none uppercase">
                      {warehouseOpsLabels.tag1}
                    </div>
                    <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-blue-400 text-xs font-bold leading-none uppercase">
                      {warehouseOpsLabels.tag2}
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
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                {wh.technology.title}
              </h2>
              <p className="text-slate-500 font-semibold text-sm sm:text-base leading-relaxed">
                {wh.technology.desc}
              </p>
            </div>

            <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 md:grid-cols-12">
              {wh.technology.badges.map((b, idx) => {
                const TechIcon = b.icon;
                return (
                  <div key={idx} className={`${idx === 0 ? 'relative flex min-h-[22rem] flex-col justify-end overflow-hidden bg-[var(--hb-navy-deep)] text-white md:col-span-5 md:row-span-2' : 'border-t border-slate-200 bg-white md:col-span-7'} p-8`}>
                    {idx === 0 && (
                      <>
                        <img
                          className="absolute inset-0 h-full w-full object-cover"
                          src={getImgUrl('FACILITY_TEAM')}
                          alt={b.title}
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,28,44,.12)_15%,rgba(11,28,44,.95)_84%)]" />
                      </>
                    )}
                    <div className="relative">
                      <div className={`${idx === 0 ? 'text-amber-300' : 'text-[var(--hb-amber)]'} mb-5`}>
                        <TechIcon className="w-5 h-5" />
                      </div>
                      <h3 className={`${idx === 0 ? 'text-2xl text-white' : 'text-lg text-slate-900'} font-bold mb-2`}>
                        {b.title}
                      </h3>
                      <p className={`${idx === 0 ? 'text-slate-100' : 'text-slate-600'} text-xs sm:text-sm font-medium leading-relaxed`}>
                        {b.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. Industries We Serve */}
        <section className="py-20 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                {wh.industries.title}
              </h2>
              <p className="text-slate-500 font-semibold text-sm sm:text-base leading-relaxed">
                {wh.industries.desc}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-12 border-t border-slate-200 md:grid-cols-2">
              {wh.industries.sectors.map((sec, idx) => {
                const SecIcon = sec.icon;
                return (
                  <div key={idx} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-slate-200 py-6">
                    <div className="text-[var(--hb-amber)] pt-0.5">
                      <SecIcon className="w-5 h-5" />
                    </div>
                    <div>
                    <h3 className="text-base font-bold text-slate-900 mb-1.5">
                      {sec.name}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                      {sec.desc}
                    </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. Bottom Conversion Banner with Form */}
        <section id="rfq-form-section" className="py-20 bg-slate-50 border-t border-slate-200/60 scroll-mt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                {wh.bottomCta.title}
              </h2>
              <p className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed max-w-xl">
                {wh.bottomCta.desc}
              </p>
            </div>

            <div className="bg-white rounded-[var(--hb-radius)] border border-slate-300 shadow-[0_16px_40px_rgba(16,40,61,.08)] p-6 sm:p-8 relative overflow-hidden">
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
                                ? 'border-sky-600 bg-sky-50 text-sky-700 font-bold'
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
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 outline-none font-semibold text-base transition-all"
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
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 outline-none font-semibold text-base transition-all"
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
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 outline-none font-semibold text-base transition-all"
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
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 outline-none font-semibold text-base transition-all resize-none"
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
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 outline-none font-semibold text-base transition-all"
                        placeholder="e.g. Maria Lopez / Andina Trading"
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
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 outline-none font-semibold text-base transition-all"
                        placeholder="partnership@ddnzglobal.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={state.submitting}
                    className={`w-full py-4 text-white font-bold rounded-xl transition-all shadow-md transform hover:-translate-y-0.5 active:translate-y-0 shrink-0 ${
                      state.submitting ? 'bg-slate-600' : 'bg-[var(--hb-amber)] hover:bg-[var(--hb-amber-strong)] hover:shadow-xl'
                    }`}
                  >
                    {state.submitting ? t('get_a_quote.submitting') : t('get_a_quote.submit')}
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-sky-50 text-sky-700 rounded-full flex items-center justify-center mx-auto mb-6">
                     <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">
                    {activeLang === 'zh' ? '集货需求已接收！华正邦泰 专属仓管小队已就位！' : activeLang === 'ru' ? 'Ваш запрос на склад отправлен!' : activeLang === 'fr' ? 'Demande de stockage configurée !' : 'Warehouse RFQ Successfully Registered!'}
                  </h3>
                  <p className="text-slate-500 font-semibold mb-6 max-w-md mx-auto text-sm sm:text-base">
                    {activeLang === 'zh' ? '我们的集货团队将根据您提交的货物信息和操作需求联系您，确认仓储、包装与出运安排。请留意您的邮箱或常用通讯方式。' : activeLang === 'ru' ? 'Наши специалисты свяжутся с вами, чтобы уточнить условия хранения, упаковки и дальнейшей отправки.' : activeLang === 'fr' ? 'Notre équipe vous contactera afin de préciser les besoins de stockage, d’emballage et d’expédition.' : 'Our consolidation team will contact you to confirm the storage, packing, and export requirements for your shipment.'}
                  </p>
                  <button 
                    onClick={() => setIsFormSubmitted(false)}
                    className="text-sky-700 hover:text-sky-900 font-bold text-sm underline"
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


  const getHeroImageUrl = (key: string) => {
    switch (key) {
      case 'sea-freight':
        return 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=1200&auto=format&fit=crop';
      case 'rail-freight':
        return 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=1200&auto=format&fit=crop';
      case 'road-freight':
        return 'https://images.unsplash.com/photo-1516576885502-d4c0529424c3?q=80&w=1200&auto=format&fit=crop';
      case 'customs-clearance':
        return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop';
      default:
        return 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=1200&auto=format&fit=crop';
    }
  };

  const heroImgUrl = getHeroImageUrl(currentKey);
  const serviceCtas = sharedServiceLabels;
  const loadingProof = SEA_FREIGHT_LOADING_PROOF[activeLang] || SEA_FREIGHT_LOADING_PROOF.en;
  const loadingProofImages = [
    '/images/operations/container-loading-forklift-anonymized.jpg',
    '/images/operations/container-loaded-anonymized.jpg',
    '/images/operations/container-loading-wet-weather-anonymized.jpg',
  ];

  return (
    <div className="ddnz-home min-h-screen hb-page-shell font-sans text-slate-900">
      <SEO title={currentSEO?.title} description={currentSEO?.desc} keywords={currentSEO?.keywords} />
      <SchemaMarkup 
        type="Service" 
        data={{
          name: data.title,
          description: data.heroSubtitle || data.title,
          serviceType: 'Freight Forwarding and Global Supply Chain'
        }} 
      />
      <SourcingHomepageNav showFreightExecutor />

      {/* Hero Block */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${config.bgGrad} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid min-h-[34rem] items-center gap-10 py-12 md:grid-cols-12 md:py-16">
            <div className="md:col-span-7 lg:col-span-6">
            <span className="inline-flex items-center gap-2 text-amber-200 text-sm font-bold mb-5">
              <IconComponent className="w-4 h-4 text-amber-300" />
              {data.tag}
            </span>
            <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight leading-[1.04] mb-5">
              {data.title}
            </h1>
            <p className="text-slate-200 text-base sm:text-lg font-medium leading-relaxed mb-8 max-w-xl">
              {data.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a 
                href="#rfq-form-section"
                className="bg-[var(--hb-amber)] hover:bg-[var(--hb-amber-strong)] text-white font-bold px-7 py-3.5 rounded-xl text-center shadow-lg shadow-black/15 transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {serviceCtas.quote}
                <ArrowRight className="w-5 h-5" />
              </a>
              <a 
                href={attributedWhatsAppUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-7 py-3.5 rounded-xl text-center border border-white/25 transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {t('hero.chat')}
              </a>
            </div>
            </div>

            <figure className="relative h-[19rem] overflow-hidden rounded-2xl border border-white/15 shadow-[0_28px_70px_rgba(0,0,0,0.28)] md:col-span-5 md:h-[27rem] md:rounded-l-none md:[clip-path:polygon(14%_0,100%_0,100%_100%,0_100%)] lg:col-span-6">
              <img
                className="h-full w-full object-cover"
                src={heroImgUrl}
                alt={data.title}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--hb-navy-deep)]/55 via-transparent to-transparent" />
            </figure>
          </div>
        </div>
      </section>

      {/* Operational capabilities */}
      <section className="bg-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-2xl border border-slate-200 md:grid-cols-12">
            {data.advs.map((adv: any, index: number) => (
              <article
                key={index}
                className={`${index === 0 ? 'bg-[var(--hb-navy-deep)] text-white md:col-span-5 md:row-span-3' : 'border-t border-slate-200 bg-[var(--hb-surface)] md:col-span-7'} grid gap-5 p-7 md:p-9`}
              >
                <IconComponent className={`${index === 0 ? 'h-9 w-9' : 'h-6 w-6'} text-[var(--hb-amber)]`} aria-hidden="true" />
                <div>
                  <h2 className={`${index === 0 ? 'text-2xl md:text-3xl text-white' : 'text-xl text-[var(--hb-ink)]'} font-black mb-2 tracking-tight`}>{adv.title}</h2>
                  <p className={`${index === 0 ? 'text-slate-200' : 'text-slate-600'} text-sm md:text-base font-medium leading-relaxed max-w-[38rem]`}>{adv.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {currentKey === 'sea-freight' && (
        <section className="bg-[var(--hb-navy-deep)] py-16 text-white md:py-24" aria-labelledby="loading-proof-title">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 grid gap-7 md:mb-14 md:grid-cols-12 md:items-end">
              <div className="md:col-span-7">
                <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--hb-amber)] sm:text-sm">
                  <Camera className="h-4 w-4" aria-hidden="true" />
                  {loadingProof.eyebrow}
                </p>
                <h2 id="loading-proof-title" className="max-w-3xl text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                  {loadingProof.title}
                </h2>
              </div>
              <div className="md:col-span-5">
                <p className="text-base font-medium leading-relaxed text-slate-200 md:text-lg">
                  {loadingProof.description}
                </p>
                <p className="mt-4 flex items-start gap-2 border-t border-white/15 pt-4 text-xs font-semibold leading-relaxed text-slate-400 sm:text-sm">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--hb-amber)]" aria-hidden="true" />
                  {loadingProof.privacy}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:h-[38rem] md:grid-cols-12">
              {loadingProofImages.map((src, index) => (
                <figure
                  key={src}
                  className={`${index === 0 ? 'md:col-span-5' : index === 1 ? 'md:col-span-3' : 'md:col-span-4'} group flex min-h-0 flex-col overflow-hidden border border-white/15 bg-white/[0.04]`}
                >
                  <div className="relative aspect-[4/5] min-h-0 overflow-hidden md:aspect-auto md:flex-1">
                    <img
                      src={src}
                      alt={loadingProof.alts[index]}
                      width={index === 0 ? 1600 : 1400}
                      height={index === 0 ? 2843 : 1866}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out motion-reduce:transition-none group-hover:scale-[1.025]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06172a]/25 via-transparent to-transparent" aria-hidden="true" />
                  </div>
                  <figcaption className="flex min-h-16 items-center border-t border-white/15 px-5 py-4 text-sm font-bold tracking-wide text-slate-100">
                    <span className="mr-3 text-xs font-black text-[var(--hb-amber)]">0{index + 1}</span>
                    {loadingProof.captions[index]}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Deep-Dive / Quick Facts Dual Split */}
      <section className="py-16 md:py-20 bg-[var(--hb-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
            
            {/* Left Column: Deep Dive */}
            <div className="lg:col-span-7">
              <p className="text-sm font-black text-[var(--hb-amber)] mb-3">{serviceCtas.planning}</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--hb-ink)] tracking-tight mb-5">
                {data.deepDive.title}
              </h2>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8 font-medium">
                {data.deepDive.desc}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {data.deepDive.sections.map((sec: any, index: number) => (
                  <div key={index} className={`${index === 0 ? 'sm:col-span-2' : ''} rounded-2xl border border-slate-200 bg-white p-6`}>
                    <div>
                      <h4 className="text-lg font-bold text-[var(--hb-ink)] mb-1">{sec.name}</h4>
                      <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed">{sec.info || sec.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Quick Facts Card */}
            <aside className="lg:col-span-5 bg-[var(--hb-navy-deep)] text-white rounded-2xl p-8 sm:p-10 shadow-[0_18px_45px_rgba(11,28,44,0.18)] relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-[var(--hb-amber)]" />
              <h3 className="text-2xl font-black tracking-tight mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-amber-300" />
                {data.quickFacts.title}
              </h3>
              <div className="h-1 w-10 bg-[var(--hb-amber)] mb-8" />
              <ul className="space-y-5">
                {data.quickFacts.points.map((pt: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-slate-100">
                    <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base leading-relaxed font-semibold">
                      {pt}
                    </span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-10 p-4 rounded-xl bg-white/5 border border-white/15 flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-amber-300 shrink-0" />
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {t('get_a_quote.fclNote')}
                </p>
              </div>
            </aside>

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
            <div className="h-1 w-16 bg-gradient-to-r from-[var(--hb-blue)] to-[var(--hb-amber)] mx-auto rounded-full" />
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
                        <Globe className="w-4 h-4 text-sky-600 shrink-0" aria-hidden="true" />
                        {row[0]}
                      </td>
                      <td className="px-6 py-4">{row[1]}</td>
                      <td className="px-6 py-4 text-sky-700 font-mono text-sm">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Operating workflow */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl md:mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
              {serviceCtas.process}
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              {activeLang === 'zh' ? '从货物资料确认到目的地交付，每个环节由同一运营团队衔接。' : activeLang === 'es' ? 'Un mismo equipo operativo coordina cada etapa, desde los datos de la carga hasta la entrega.' : activeLang === 'ar' ? 'يتولى فريق تشغيل واحد تنسيق كل مرحلة من بيانات الشحنة حتى التسليم.' : 'One operating team coordinates each stage from cargo review through final delivery.'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-12 border-t border-slate-200 md:grid-cols-2">
            {stepsLocal.map((step, index) => (
              <article
                key={index} 
                className="grid grid-cols-[3rem_1fr] gap-4 border-b border-slate-200 py-7"
              >
                <div className="text-sm font-black text-[var(--hb-amber)]">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">{step.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture and Request form */}
      <section id="rfq-form-section" className="py-16 md:py-24 bg-sky-50/60 border-t border-sky-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {activeLang === 'zh' ? '获取该服务的精准专享报价' : activeLang === 'ru' ? 'Заказать этот сервис' : activeLang === 'fr' ? 'Dossier de Devis Spécifique' : 'Request a Custom Services Quote'}
            </h2>
            <p className="text-slate-500 font-medium text-sm md:text-base">
              {t('get_a_quote.formSubtitle')}
            </p>
          </div>

          <div className="bg-white rounded-[var(--hb-radius)] border border-slate-300 shadow-[0_16px_40px_rgba(16,40,61,.08)] p-6 sm:p-8 relative overflow-hidden">
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
                            ? 'border-sky-600 bg-sky-50 text-sky-700'
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
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-600 outline-none font-semibold text-sm transition-all"
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
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-600 outline-none font-semibold text-sm transition-all"
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
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-600 outline-none font-semibold text-sm transition-all"
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
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-600 outline-none font-semibold text-sm transition-all resize-none"
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
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-600 outline-none font-semibold text-sm transition-all"
                      placeholder="e.g. Maria Lopez / Andina Trading"
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
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-600 outline-none font-semibold text-sm transition-all"
                      placeholder="partnership@ddnzglobal.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={state.submitting}
                  className={`w-full py-4 text-white font-bold rounded-xl transition-all shadow-md transform hover:-translate-y-0.5 active:translate-y-0 shrink-0 ${
                    state.submitting ? 'bg-slate-600' : 'bg-gradient-to-r from-[var(--hb-blue)] to-[var(--hb-amber)] hover:shadow-xl'
                  }`}
                >
                  {state.submitting ? t('get_a_quote.submitting') : t('get_a_quote.submit')}
                </button>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 px-6 bg-[#071A33] rounded-2xl text-white"
              >
                <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-3xl font-bold">✓</span>
                </div>
                <h3 className="text-2xl font-black mb-3">
                  {activeLang === 'zh' ? '询价需求提交成功！' : activeLang === 'ru' ? 'Заявка принята!' : activeLang === 'fr' ? 'Demande Reçue !' : 'RFQ Submitted successfully!'}
                </h3>
                <p className="text-slate-200 max-w-sm mx-auto leading-relaxed text-sm md:text-base mb-8">
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

const LANGUAGES_SUPPORTED = ['en', 'zh', 'ru', 'fr', 'es', 'ar'];
