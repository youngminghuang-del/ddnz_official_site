import { geoGraticule, geoMercator, geoNaturalEarth1, geoPath, type GeoProjection } from 'd3-geo';
import { ArrowUpRight, MapPinned, Ship, TrainFront, Truck } from 'lucide-react';
import { feature } from 'topojson-client';
import type { Feature, FeatureCollection, Geometry, LineString, Polygon } from 'geojson';
import type { GeometryCollection, Topology } from 'topojson-specification';
import worldAtlas from 'world-atlas/countries-110m.json';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../i18n/translations';
import './freight-route-map.css';

type MapVariant = 'world' | 'central-asia' | 'uzbekistan';
type FreightRouteMapProps = { variant: MapVariant; locale?: Language };
type Coordinate = [longitude: number, latitude: number];
type MapCopy = { eyebrow: string; title: string; description: string; routeNote: string; routeHref: string; routeLabel: string };
type MapNode = {
  id: string; label: string; code?: string; coordinates: Coordinate; labelDx: number; labelDy: number;
  anchor?: 'start' | 'middle' | 'end'; kind?: 'origin' | 'gateway' | 'destination';
};
type MapRoute = { id: string; coordinates: Coordinate[]; kind: 'sea' | 'land' | 'secondary' };

const mapCopyZh: Record<MapVariant, MapCopy> = {
  world: {
    eyebrow: 'GLOBAL FREIGHT NETWORK', title: '从中国连接四个重点采购市场',
    description: '首页总览只展示主要方向和核心门户，让客户快速理解海运、铁路与跨境汽运的覆盖范围。',
    routeNote: '港口与口岸节点按经纬度投影；路线用于表达网络方向，实际起运港、中转点与靠港顺序按货物确认。',
    routeHref: '/services/sea-freight/', routeLabel: '查看货运服务',
  },
  'central-asia': {
    eyebrow: 'CENTRAL ASIA CORRIDORS', title: '中亚线路不只是一条线',
    description: '地区页突出霍尔果斯、阿拉山口等关键口岸，并把哈萨克斯坦、乌兹别克斯坦和周边市场放进同一张区域图。',
    routeNote: '城市与口岸按真实经纬度定位；口岸选择仍取决于班列计划、车板、货物属性和目的城市。',
    routeHref: '/shipping-from-china-to-central-asia/', routeLabel: '查看中亚线路',
  },
  uzbekistan: {
    eyebrow: 'CHINA TO UZBEKISTAN', title: '把换装、清关和自提节点画清楚',
    description: '国家页以单票运输逻辑展开，客户可以直接看到中国装车、霍尔果斯口岸、塔什干清关仓与客户自提之间的关系。',
    routeNote: '本示例对应胶州装车、全程汽运、塔什干清关仓通知自提；节点位置按真实经纬度投影。',
    routeHref: '/shipping-from-china-to-uzbekistan/', routeLabel: '查看乌兹别克斯坦页',
  },
};

const mapCopyEn: Record<MapVariant, MapCopy> = {
  world: {
    eyebrow: 'GLOBAL FREIGHT NETWORK', title: 'Four priority markets, connected from China',
    description: 'A clear overview of the main ocean and overland gateways, designed to help buyers understand the coverage before opening a route page.',
    routeNote: 'Ports and gateways use projected coordinates. Route lines communicate network direction; actual origin, transshipment and port rotation depend on the cargo.',
    routeHref: '/services/sea-freight/', routeLabel: 'Explore freight services',
  },
  'central-asia': {
    eyebrow: 'CENTRAL ASIA CORRIDORS', title: 'Central Asia is a network, not one line',
    description: 'Khorgos and Alashankou sit in the same regional view as Kazakhstan, Uzbekistan and the surrounding destination markets.',
    routeNote: 'Cities and border gateways use projected coordinates. The operating route still depends on schedules, rolling stock, cargo and destination city.',
    routeHref: '/shipping-from-china-to-central-asia/', routeLabel: 'Explore Central Asia routes',
  },
  uzbekistan: {
    eyebrow: 'CHINA TO UZBEKISTAN', title: 'See every handoff from loading to pickup',
    description: 'The country view connects origin loading, the Khorgos gateway and the Tashkent customs warehouse in one shipment narrative.',
    routeNote: 'This example covers loading in Jiaozhou, cross-border trucking and customer pickup after customs clearance in Tashkent.',
    routeHref: '/shipping-from-china-to-uzbekistan/', routeLabel: 'Explore the Uzbekistan route',
  },
};

const mapCopyInternational: Record<Exclude<Language, 'en' | 'zh'>, Record<MapVariant, MapCopy>> = {
  ru: {
    world: { eyebrow: 'ГЛОБАЛЬНАЯ ГРУЗОВАЯ СЕТЬ', title: 'Четыре приоритетных рынка с отправлением из Китая', description: 'Обзор основных морских и сухопутных узлов помогает оценить покрытие до перехода на страницу маршрута.', routeNote: 'Порты и переходы нанесены по координатам. Линии показывают направление сети; фактические пункты и ротация зависят от груза.', routeHref: '/services/sea-freight/', routeLabel: 'Изучить грузовые услуги' },
    'central-asia': { eyebrow: 'КОРИДОРЫ ЦЕНТРАЛЬНОЙ АЗИИ', title: 'Центральная Азия — это сеть, а не одна линия', description: 'Хоргос и Алашанькоу показаны вместе с Казахстаном, Узбекистаном и соседними рынками назначения.', routeNote: 'Города и переходы нанесены по координатам. Рабочий маршрут зависит от графика, подвижного состава, груза и города назначения.', routeHref: '/shipping-from-china-to-central-asia/', routeLabel: 'Маршруты по Центральной Азии' },
    uzbekistan: { eyebrow: 'ИЗ КИТАЯ В УЗБЕКИСТАН', title: 'Все этапы от погрузки до самовывоза', description: 'Маршрут связывает погрузку в Китае, переход Хоргос и таможенный склад в Ташкенте.', routeNote: 'Пример охватывает погрузку в Цзяочжоу, автоперевозку и самовывоз после оформления в Ташкенте.', routeHref: '/shipping-from-china-to-uzbekistan/', routeLabel: 'Маршрут в Узбекистан' },
  },
  fr: {
    world: { eyebrow: 'RÉSEAU MONDIAL DE FRET', title: 'Quatre marchés prioritaires reliés depuis la Chine', description: 'Vue claire des principales portes maritimes et terrestres avant d’ouvrir la page d’un itinéraire.', routeNote: 'Ports et passages sont positionnés par coordonnées. Les lignes indiquent la direction du réseau ; l’origine et les escales dépendent du fret.', routeHref: '/services/sea-freight/', routeLabel: 'Découvrir les services de fret' },
    'central-asia': { eyebrow: 'CORRIDORS D’ASIE CENTRALE', title: 'L’Asie centrale est un réseau, pas une seule ligne', description: 'Khorgos et Alashankou apparaissent avec le Kazakhstan, l’Ouzbékistan et les marchés voisins.', routeNote: 'Villes et passages sont géolocalisés. Le trajet dépend des horaires, du matériel roulant, du fret et de la destination.', routeHref: '/shipping-from-china-to-central-asia/', routeLabel: 'Explorer les routes d’Asie centrale' },
    uzbekistan: { eyebrow: 'CHINE VERS OUZBÉKISTAN', title: 'Chaque relais, du chargement au retrait', description: 'La vue relie le chargement en Chine, le passage de Khorgos et l’entrepôt douanier de Tachkent.', routeNote: 'Exemple : chargement à Jiaozhou, transport routier transfrontalier et retrait après dédouanement à Tachkent.', routeHref: '/shipping-from-china-to-uzbekistan/', routeLabel: 'Explorer la route vers l’Ouzbékistan' },
  },
  es: {
    world: { eyebrow: 'RED GLOBAL DE TRANSPORTE', title: 'Cuatro mercados prioritarios conectados desde China', description: 'Una vista clara de las principales puertas marítimas y terrestres antes de abrir cada ruta.', routeNote: 'Puertos y pasos usan coordenadas proyectadas. Las líneas muestran la dirección de la red; el origen y las escalas dependen de la carga.', routeHref: '/services/sea-freight/', routeLabel: 'Ver servicios de transporte' },
    'central-asia': { eyebrow: 'CORREDORES DE ASIA CENTRAL', title: 'Asia Central es una red, no una sola línea', description: 'Khorgos y Alashankou aparecen junto con Kazajistán, Uzbekistán y los mercados vecinos.', routeNote: 'Ciudades y pasos están geolocalizados. La ruta depende de horarios, material rodante, carga y destino.', routeHref: '/shipping-from-china-to-central-asia/', routeLabel: 'Explorar rutas de Asia Central' },
    uzbekistan: { eyebrow: 'CHINA A UZBEKISTÁN', title: 'Cada entrega, desde la carga hasta la recogida', description: 'La vista enlaza la carga en China, el paso de Khorgos y el almacén aduanero de Taskent.', routeNote: 'Ejemplo: carga en Jiaozhou, transporte por carretera y recogida tras el despacho en Taskent.', routeHref: '/shipping-from-china-to-uzbekistan/', routeLabel: 'Explorar la ruta de Uzbekistán' },
  },
  ar: {
    world: { eyebrow: 'شبكة الشحن العالمية', title: 'أربعة أسواق ذات أولوية متصلة من الصين', description: 'نظرة واضحة على أهم البوابات البحرية والبرية قبل فتح صفحة كل مسار.', routeNote: 'تظهر الموانئ والمعابر وفق الإحداثيات. توضح الخطوط اتجاه الشبكة، بينما يعتمد المنشأ والتوقف الفعليان على الشحنة.', routeHref: '/services/sea-freight/', routeLabel: 'استكشف خدمات الشحن' },
    'central-asia': { eyebrow: 'ممرات آسيا الوسطى', title: 'آسيا الوسطى شبكة وليست خطاً واحداً', description: 'تظهر خورغوس وألاشانكو مع كازاخستان وأوزبكستان والأسواق المجاورة في خريطة واحدة.', routeNote: 'المدن والمعابر محددة جغرافياً. يعتمد المسار التشغيلي على الجدول والعربات ونوع البضاعة والوجهة.', routeHref: '/shipping-from-china-to-central-asia/', routeLabel: 'استكشف مسارات آسيا الوسطى' },
    uzbekistan: { eyebrow: 'من الصين إلى أوزبكستان', title: 'كل عملية تسليم من التحميل حتى الاستلام', description: 'تربط الخريطة التحميل في الصين وبوابة خورغوس ومستودع الجمارك في طشقند.', routeNote: 'يشمل المثال التحميل في جياوجو والنقل البري واستلام العميل بعد التخليص في طشقند.', routeHref: '/shipping-from-china-to-uzbekistan/', routeLabel: 'استكشف مسار أوزبكستان' },
  },
  pt: {
    world: { eyebrow: 'REDE GLOBAL DE FRETE', title: 'Quatro mercados prioritários conectados à China', description: 'Uma visão clara dos principais portos e corredores terrestres antes de abrir cada rota.', routeNote: 'Portos e passagens usam coordenadas projetadas. As linhas mostram a direção da rede; origem e escalas dependem da carga.', routeHref: '/services/sea-freight/', routeLabel: 'Explorar serviços de frete' },
    'central-asia': { eyebrow: 'CORREDORES DA ÁSIA CENTRAL', title: 'A Ásia Central é uma rede, não uma única linha', description: 'Khorgos e Alashankou aparecem com Cazaquistão, Uzbequistão e mercados vizinhos.', routeNote: 'Cidades e passagens são geolocalizadas. A rota depende de horários, material ferroviário, carga e destino.', routeHref: '/shipping-from-china-to-central-asia/', routeLabel: 'Explorar rotas da Ásia Central' },
    uzbekistan: { eyebrow: 'CHINA AO UZBEQUISTÃO', title: 'Cada etapa, do carregamento à retirada', description: 'A visão liga o carregamento na China, a passagem de Khorgos e o armazém alfandegário de Tashkent.', routeNote: 'Exemplo: carregamento em Jiaozhou, transporte rodoviário e retirada após o desembaraço em Tashkent.', routeHref: '/shipping-from-china-to-uzbekistan/', routeLabel: 'Explorar a rota do Uzbequistão' },
  },
  tr: {
    world: { eyebrow: 'KÜRESEL YÜK AĞI', title: 'Çin’den dört öncelikli pazara bağlantı', description: 'Rota sayfasını açmadan önce ana deniz ve kara geçitlerini gösteren net bir genel bakış.', routeNote: 'Limanlar ve geçitler koordinatlara göre gösterilir. Çizgiler ağ yönünü anlatır; gerçek çıkış ve uğraklar yüke göre belirlenir.', routeHref: '/services/sea-freight/', routeLabel: 'Yük hizmetlerini inceleyin' },
    'central-asia': { eyebrow: 'ORTA ASYA KORİDORLARI', title: 'Orta Asya tek hat değil, bir ağdır', description: 'Khorgos ve Alashankou; Kazakistan, Özbekistan ve çevre pazarlarla aynı görünümde yer alır.', routeNote: 'Şehirler ve geçitler koordinatlarla konumlandırılır. Operasyon rotası program, vagon, yük ve varış şehrine bağlıdır.', routeHref: '/shipping-from-china-to-central-asia/', routeLabel: 'Orta Asya rotalarını inceleyin' },
    uzbekistan: { eyebrow: 'ÇİN’DEN ÖZBEKİSTAN’A', title: 'Yüklemeden teslim almaya her aktarma', description: 'Görünüm Çin’deki yüklemeyi, Khorgos geçidini ve Taşkent gümrük deposunu birleştirir.', routeNote: 'Örnek; Jiaozhou yüklemesi, sınır ötesi karayolu ve Taşkent’te gümrük sonrası müşteri teslim almasını kapsar.', routeHref: '/shipping-from-china-to-uzbekistan/', routeLabel: 'Özbekistan rotasını inceleyin' },
  },
};

const mapUi: Record<Language, { primary: string; secondary: string; node: string; verified: string }> = {
  en: { primary: 'Primary route', secondary: 'Alternative / onward route', node: 'Geolocated node', verified: 'Geographically verified' },
  zh: { primary: '主路线', secondary: '备选 / 延伸路线', node: '经纬度定位节点', verified: '地理位置已核验' },
  ru: { primary: 'Основной маршрут', secondary: 'Альтернативный / дальнейший маршрут', node: 'Геолокационный узел', verified: 'География проверена' },
  fr: { primary: 'Itinéraire principal', secondary: 'Itinéraire alternatif / prolongé', node: 'Point géolocalisé', verified: 'Géographie vérifiée' },
  es: { primary: 'Ruta principal', secondary: 'Ruta alternativa / posterior', node: 'Nodo geolocalizado', verified: 'Geografía verificada' },
  ar: { primary: 'المسار الرئيسي', secondary: 'مسار بديل / لاحق', node: 'نقطة محددة جغرافياً', verified: 'تم التحقق جغرافياً' },
  pt: { primary: 'Rota principal', secondary: 'Rota alternativa / seguinte', node: 'Nó geolocalizado', verified: 'Geografia verificada' },
  tr: { primary: 'Ana rota', secondary: 'Alternatif / devam rotası', node: 'Konumlandırılmış nokta', verified: 'Coğrafya doğrulandı' },
};

const mapSvgUi: Record<Language, {
  worldTitle: string; worldDesc: string; worldCartouche: string;
  centralTitle: string; centralDesc: string; centralCartouche: string;
  uzTitle: string; uzDesc: string; uzCartouche: string; chinaRoad: string; crossBorder: string;
}> = {
  en: { worldTitle: 'DDNZ priority freight routes from China', worldDesc: 'A projected world map connecting South China with gateways in the Middle East, Central Asia, West Africa and Latin America.', worldCartouche: 'PORT & GATEWAY NETWORK', centralTitle: 'China to Central Asia border gateways and destinations', centralDesc: 'A projected regional map connecting Jiaozhou with Central Asia and Moscow through Khorgos or Alashankou.', centralCartouche: 'CENTRAL ASIA LAND CORRIDORS', uzTitle: 'Cross-border road route from Jiaozhou to Tashkent', uzDesc: 'A projected route map from origin loading in Jiaozhou through Khorgos to customs warehousing in Tashkent.', uzCartouche: 'JIAOZHOU → TASHKENT / ROAD', chinaRoad: 'CHINA ROAD LEG', crossBorder: 'CROSS-BORDER ROAD' },
  zh: { worldTitle: 'DDNZ 中国出口全球重点路线图', worldDesc: '使用真实世界边界和港口经纬度，从中国华南连接中东、中亚、西非和拉丁美洲主要门户。', worldCartouche: '港口与口岸网络', centralTitle: '中国至中亚主要跨境运输口岸与城市', centralDesc: '真实经纬度投影下，从胶州经霍尔果斯或阿拉山口连接中亚与莫斯科的区域路线。', centralCartouche: '中亚陆运走廊', uzTitle: '胶州至塔什干跨境汽运节点图', uzDesc: '真实地理底图上，货物在胶州装车，经霍尔果斯出境并在塔什干清关入仓。', uzCartouche: '胶州 → 塔什干 / 汽运', chinaRoad: '中国境内汽运', crossBorder: '跨境汽运' },
  ru: { worldTitle: 'Приоритетные маршруты DDNZ из Китая', worldDesc: 'Карта связывает Южный Китай с узлами Ближнего Востока, Центральной Азии, Западной Африки и Латинской Америки.', worldCartouche: 'СЕТЬ ПОРТОВ И ПЕРЕХОДОВ', centralTitle: 'Пограничные переходы и пункты назначения Центральной Азии', centralDesc: 'Региональная карта из Цзяочжоу через Хоргос или Алашанькоу в Центральную Азию и Москву.', centralCartouche: 'СУХОПУТНЫЕ КОРИДОРЫ ЦЕНТРАЛЬНОЙ АЗИИ', uzTitle: 'Автомаршрут Цзяочжоу — Ташкент', uzDesc: 'Маршрут через Хоргос к таможенному складу в Ташкенте.', uzCartouche: 'ЦЗЯОЧЖОУ → ТАШКЕНТ / АВТО', chinaRoad: 'УЧАСТОК ПО КИТАЮ', crossBorder: 'МЕЖДУНАРОДНЫЙ АВТОМАРШРУТ' },
  fr: { worldTitle: 'Itinéraires fret prioritaires DDNZ depuis la Chine', worldDesc: 'Carte reliant le sud de la Chine aux portes du Moyen-Orient, d’Asie centrale, d’Afrique de l’Ouest et d’Amérique latine.', worldCartouche: 'RÉSEAU DE PORTS ET PASSAGES', centralTitle: 'Passages et destinations entre Chine et Asie centrale', centralDesc: 'Carte régionale de Jiaozhou vers l’Asie centrale et Moscou via Khorgos ou Alashankou.', centralCartouche: 'CORRIDORS TERRESTRES D’ASIE CENTRALE', uzTitle: 'Route routière de Jiaozhou à Tachkent', uzDesc: 'Itinéraire via Khorgos jusqu’à l’entrepôt douanier de Tachkent.', uzCartouche: 'JIAOZHOU → TACHKENT / ROUTE', chinaRoad: 'TRAJET ROUTIER EN CHINE', crossBorder: 'ROUTE TRANSFRONTALIÈRE' },
  es: { worldTitle: 'Rutas prioritarias de DDNZ desde China', worldDesc: 'Mapa que conecta el sur de China con Oriente Medio, Asia Central, África Occidental y América Latina.', worldCartouche: 'RED DE PUERTOS Y PASOS', centralTitle: 'Pasos fronterizos y destinos de Asia Central', centralDesc: 'Mapa regional desde Jiaozhou hacia Asia Central y Moscú por Khorgos o Alashankou.', centralCartouche: 'CORREDORES TERRESTRES DE ASIA CENTRAL', uzTitle: 'Ruta por carretera de Jiaozhou a Taskent', uzDesc: 'Ruta por Khorgos hasta el almacén aduanero de Taskent.', uzCartouche: 'JIAOZHOU → TASKENT / CARRETERA', chinaRoad: 'TRAMO POR CARRETERA EN CHINA', crossBorder: 'CARRETERA TRANSFRONTERIZA' },
  ar: { worldTitle: 'مسارات DDNZ ذات الأولوية من الصين', worldDesc: 'خريطة تربط جنوب الصين ببوابات الشرق الأوسط وآسيا الوسطى وغرب أفريقيا وأمريكا اللاتينية.', worldCartouche: 'شبكة الموانئ والمعابر', centralTitle: 'معابر ووجهات الصين وآسيا الوسطى', centralDesc: 'خريطة إقليمية من جياوجو إلى آسيا الوسطى وموسكو عبر خورغوس أو ألاشانكو.', centralCartouche: 'الممرات البرية لآسيا الوسطى', uzTitle: 'المسار البري من جياوجو إلى طشقند', uzDesc: 'مسار عبر خورغوس إلى مستودع الجمارك في طشقند.', uzCartouche: 'جياوجو ← طشقند / طريق', chinaRoad: 'الجزء البري داخل الصين', crossBorder: 'الطريق العابر للحدود' },
  pt: { worldTitle: 'Rotas prioritárias da DDNZ a partir da China', worldDesc: 'Mapa ligando o sul da China ao Oriente Médio, Ásia Central, África Ocidental e América Latina.', worldCartouche: 'REDE DE PORTOS E PASSAGENS', centralTitle: 'Passagens e destinos entre China e Ásia Central', centralDesc: 'Mapa regional de Jiaozhou à Ásia Central e Moscou por Khorgos ou Alashankou.', centralCartouche: 'CORREDORES TERRESTRES DA ÁSIA CENTRAL', uzTitle: 'Rota rodoviária de Jiaozhou a Tashkent', uzDesc: 'Rota por Khorgos até o armazém alfandegário de Tashkent.', uzCartouche: 'JIAOZHOU → TASHKENT / RODOVIA', chinaRoad: 'TRECHO RODOVIÁRIO NA CHINA', crossBorder: 'RODOVIA TRANSFRONTEIRIÇA' },
  tr: { worldTitle: 'Çin’den DDNZ öncelikli yük rotaları', worldDesc: 'Güney Çin’i Orta Doğu, Orta Asya, Batı Afrika ve Latin Amerika geçitlerine bağlayan harita.', worldCartouche: 'LİMAN VE GEÇİT AĞI', centralTitle: 'Çin–Orta Asya sınır geçitleri ve varış noktaları', centralDesc: 'Jiaozhou’dan Khorgos veya Alashankou üzerinden Orta Asya ve Moskova’ya uzanan bölgesel harita.', centralCartouche: 'ORTA ASYA KARA KORİDORLARI', uzTitle: 'Jiaozhou’dan Taşkent’e karayolu rotası', uzDesc: 'Khorgos üzerinden Taşkent gümrük deposuna uzanan rota.', uzCartouche: 'JIAOZHOU → TAŞKENT / KARAYOLU', chinaRoad: 'ÇİN İÇİ KARAYOLU', crossBorder: 'SINIR ÖTESİ KARAYOLU' },
};

const mapRegionLabels: Record<Language, string[]> = {
  en: ['CHINA', 'KAZAKHSTAN', 'UZBEKISTAN', 'RUSSIA'], zh: ['中国', '哈萨克斯坦', '乌兹别克斯坦', '俄罗斯'],
  ru: ['КИТАЙ', 'КАЗАХСТАН', 'УЗБЕКИСТАН', 'РОССИЯ'], fr: ['CHINE', 'KAZAKHSTAN', 'OUZBÉKISTAN', 'RUSSIE'],
  es: ['CHINA', 'KAZAJISTÁN', 'UZBEKISTÁN', 'RUSIA'], ar: ['الصين', 'كازاخستان', 'أوزبكستان', 'روسيا'],
  pt: ['CHINA', 'CAZAQUISTÃO', 'UZBEQUISTÃO', 'RÚSSIA'], tr: ['ÇİN', 'KAZAKİSTAN', 'ÖZBEKİSTAN', 'RUSYA'],
};
const mapNodeUi: Record<Language, { southChina: string; origin: string; roadRail: string; rail: string; load: string; border: string; customs: string }> = {
  en: { southChina: 'South China ports', origin: 'CHINA ORIGIN', roadRail: 'ROAD / RAIL GATEWAY', rail: 'RAIL GATEWAY', load: 'LOAD & SECURE', border: 'BORDER GATEWAY', customs: 'CUSTOMS WAREHOUSE / PICKUP' },
  zh: { southChina: '华南港口', origin: '中国起运', roadRail: '公路 / 铁路口岸', rail: '铁路口岸', load: '装车与加固', border: '出境口岸', customs: '清关仓 / 通知自提' },
  ru: { southChina: 'Порты Южного Китая', origin: 'ОТПРАВЛЕНИЕ ИЗ КИТАЯ', roadRail: 'АВТО / ЖД ПЕРЕХОД', rail: 'ЖД ПЕРЕХОД', load: 'ПОГРУЗКА И КРЕПЛЕНИЕ', border: 'ПОГРАНПЕРЕХОД', customs: 'ТАМОЖЕННЫЙ СКЛАД / САМОВЫВОЗ' },
  fr: { southChina: 'Ports du sud de la Chine', origin: 'ORIGINE CHINE', roadRail: 'PASSAGE ROUTE / RAIL', rail: 'PASSAGE FERROVIAIRE', load: 'CHARGER ET ARRIMER', border: 'PASSAGE FRONTALIER', customs: 'ENTREPÔT DOUANIER / RETRAIT' },
  es: { southChina: 'Puertos del sur de China', origin: 'ORIGEN CHINA', roadRail: 'PASO VIAL / FERROVIARIO', rail: 'PASO FERROVIARIO', load: 'CARGA Y SUJECIÓN', border: 'PASO FRONTERIZO', customs: 'ALMACÉN ADUANERO / RECOGIDA' },
  ar: { southChina: 'موانئ جنوب الصين', origin: 'منشأ الصين', roadRail: 'بوابة برية / سكة حديد', rail: 'بوابة السكك الحديدية', load: 'تحميل وتثبيت', border: 'بوابة الحدود', customs: 'مستودع جمركي / استلام' },
  pt: { southChina: 'Portos do sul da China', origin: 'ORIGEM CHINA', roadRail: 'PASSAGEM RODOVIÁRIA / FERROVIÁRIA', rail: 'PASSAGEM FERROVIÁRIA', load: 'CARREGAR E FIXAR', border: 'PASSAGEM DE FRONTEIRA', customs: 'ARMAZÉM ALFANDEGÁRIO / RETIRADA' },
  tr: { southChina: 'Güney Çin limanları', origin: 'ÇİN ÇIKIŞI', roadRail: 'KARAYOLU / DEMİRYOLU GEÇİDİ', rail: 'DEMİRYOLU GEÇİDİ', load: 'YÜKLE VE SABİTLE', border: 'SINIR GEÇİDİ', customs: 'GÜMRÜK DEPOSU / TESLİM ALMA' },
};

const WIDTH = 1200;
const HEIGHT = 580;
const topology = worldAtlas as unknown as Topology;
const countries = feature(topology, topology.objects.countries as GeometryCollection) as unknown as FeatureCollection<Geometry, { name?: string }>;
const focusCountryIds = new Set(['076', '156', '288', '398', '484', '566', '604', '784']);
const centralCountryIds = new Set(['156', '398', '417', '643', '762', '795', '860']);
const worldProjection = geoNaturalEarth1().fitExtent([[30, 40], [WIDTH - 30, HEIGHT - 42]], countries);

function extentFeature(west: number, south: number, east: number, north: number): Feature<Polygon> {
  return { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[
    [west, south], [west, north], [east, north], [east, south], [west, south],
  ]] } };
}

const centralProjection = geoMercator().fitExtent([[44, 48], [WIDTH - 44, HEIGHT - 46]], extentFeature(34, 25, 126, 61));
const uzbekistanProjection = geoMercator().fitExtent([[54, 54], [WIDTH - 54, HEIGHT - 56]], extentFeature(66, 30, 123, 49));

function countryClass(country: Feature<Geometry, { name?: string }>, highlighted: Set<string>) {
  const id = String(country.id).padStart(3, '0');
  if (id === '156') return 'freight-map-country freight-map-country-origin';
  if (highlighted.has(id)) return 'freight-map-country freight-map-country-focus';
  return 'freight-map-country';
}

function routeFeature(route: MapRoute): Feature<LineString> {
  return { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: route.coordinates } };
}

function MapBase({ projection, highlighted, clipId, regional = false }: {
  projection: GeoProjection; highlighted: Set<string>; clipId: string; regional?: boolean;
}) {
  const path = geoPath(projection);
  const graticule = geoGraticule().step(regional ? [10, 5] : [30, 20])();
  return (
    <g clipPath={`url(#${clipId})`} aria-hidden="true">
      <path className="freight-map-graticule" d={path(graticule) ?? undefined} />
      <g className="freight-map-countries">
        {countries.features.map((country) => {
          const d = path(country);
          return d ? <path key={String(country.id)} d={d} className={countryClass(country, highlighted)} /> : null;
        })}
      </g>
    </g>
  );
}

function MapRoutes({ routes, projection }: { routes: MapRoute[]; projection: GeoProjection }) {
  const path = geoPath(projection);
  return <g className="freight-map-routes" aria-hidden="true">{routes.map((route) => (
    <path key={route.id} d={path(routeFeature(route)) ?? undefined} className={`freight-route freight-route-${route.kind}`} />
  ))}</g>;
}

function MapNodes({ nodes, projection }: { nodes: MapNode[]; projection: GeoProjection }) {
  return (
    <g className="freight-map-nodes">
      {nodes.map((node) => {
        const point = projection(node.coordinates);
        if (!point) return null;
        const [x, y] = point;
        const anchor = node.anchor ?? (node.labelDx < 0 ? 'end' : node.labelDx > 0 ? 'start' : 'middle');
        const labelX = x + node.labelDx;
        const labelY = y + node.labelDy;
        return (
          <g key={node.id} className={`freight-map-node freight-map-node-${node.kind ?? 'destination'}`}>
            <line x1={x} y1={y} x2={labelX + (anchor === 'start' ? -5 : anchor === 'end' ? 5 : 0)} y2={labelY + (node.labelDy < 0 ? 6 : -12)} className="freight-node-leader" />
            <g transform={`translate(${x} ${y})`}>
              <circle r={node.kind === 'origin' ? 12 : node.kind === 'gateway' ? 9 : 7} />
              <circle r="2.5" className="freight-node-core" />
            </g>
            <text x={labelX} y={labelY} textAnchor={anchor} className="freight-node-label">
              <tspan>{node.label}</tspan>
              {node.code ? <tspan x={labelX} dy="16" className="freight-node-code">{node.code}</tspan> : null}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function MapChrome({ clipId }: { clipId: string }) {
  return (
    <>
      <defs><clipPath id={clipId}><rect width={WIDTH} height={HEIGHT} rx="24" /></clipPath></defs>
      <rect width={WIDTH} height={HEIGHT} rx="24" className="freight-map-ocean" />
    </>
  );
}

function MapCartouche({ label }: { label: string }) {
  const cartoucheWidth = label.length > 24 ? 330 : 285;
  return (
    <g className="freight-map-cartouche" aria-hidden="true">
      <rect x="30" y="26" width={cartoucheWidth} height="42" rx="21" />
      <MapPinned x="48" y="38" width="18" height="18" />
      <text x="78" y="52">{label}</text>
    </g>
  );
}

const worldNodes: MapNode[] = [
  { id: 'south-china', label: 'South China ports', code: 'CHINA ORIGIN', coordinates: [114.26, 22.57], labelDx: 18, labelDy: -24, kind: 'origin' },
  { id: 'jebel-ali', label: 'Jebel Ali', code: 'AEJEA', coordinates: [55.027, 24.985], labelDx: 15, labelDy: 28 },
  { id: 'khorgos', label: 'Khorgos', code: 'CN / KZ GATEWAY', coordinates: [80.411, 44.213], labelDx: 14, labelDy: -26, kind: 'gateway' },
  { id: 'lagos', label: 'Lagos / Apapa', code: 'NGLOS', coordinates: [3.365, 6.44], labelDx: 14, labelDy: -24 },
  { id: 'tema', label: 'Tema', code: 'GHTEM', coordinates: [0.015, 5.674], labelDx: -14, labelDy: 32 },
  { id: 'callao', label: 'Callao', code: 'PECLL', coordinates: [-77.147, -12.055], labelDx: -14, labelDy: -24 },
  { id: 'santos', label: 'Santos', code: 'BRSSZ', coordinates: [-46.3167, -23.9333], labelDx: 14, labelDy: 32 },
  { id: 'manzanillo', label: 'Manzanillo', code: 'MXZLO', coordinates: [-104.3, 19.05], labelDx: -14, labelDy: -24 },
];

const worldRoutes: MapRoute[] = [
  { id: 'uae', kind: 'sea', coordinates: [[114.26, 22.57], [103.85, 1.3], [79.85, 6.95], [55.027, 24.985]] },
  { id: 'khorgos', kind: 'land', coordinates: [[114.26, 22.57], [103.83, 36.06], [87.62, 43.82], [80.411, 44.213]] },
  { id: 'west-africa', kind: 'sea', coordinates: [[114.26, 22.57], [103.85, 1.3], [79.85, 6.95], [18.42, -34.25], [3.365, 6.44], [0.015, 5.674]] },
  { id: 'callao', kind: 'sea', coordinates: [[114.26, 22.57], [145, 18], [178, 2], [-135, -7], [-77.147, -12.055]] },
  { id: 'santos', kind: 'sea', coordinates: [[114.26, 22.57], [103.85, 1.3], [79.85, -5], [18.42, -34.25], [-46.3167, -23.9333]] },
  { id: 'manzanillo', kind: 'secondary', coordinates: [[114.26, 22.57], [150, 30], [-155, 26], [-104.3, 19.05]] },
];

function WorldMap({ language }: { language: Language }) {
  const ui = mapSvgUi[language];
  const nodeUi = mapNodeUi[language];
  const nodes = worldNodes.map(node => node.id === 'south-china' ? { ...node, label: nodeUi.southChina, code: nodeUi.origin } : node.id === 'khorgos' ? { ...node, code: nodeUi.roadRail } : node);
  return (
    <svg className="freight-map-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby="freight-world-title freight-world-desc">
      <title id="freight-world-title">{ui.worldTitle}</title>
      <desc id="freight-world-desc">{ui.worldDesc}</desc>
      <MapChrome clipId="world-map-clip" />
      <MapBase projection={worldProjection} highlighted={focusCountryIds} clipId="world-map-clip" />
      <MapCartouche label={ui.worldCartouche} />
      <MapRoutes routes={worldRoutes} projection={worldProjection} />
      <MapNodes nodes={nodes} projection={worldProjection} />
    </svg>
  );
}

const centralNodes: MapNode[] = [
  { id: 'jiaozhou', label: '胶州 / Jiaozhou', code: '中国集货', coordinates: [120.033, 36.264], labelDx: -16, labelDy: -24, kind: 'origin' },
  { id: 'khorgos', label: '霍尔果斯 / Khorgos', code: '公路与铁路口岸', coordinates: [80.411, 44.213], labelDx: 8, labelDy: -58, anchor: 'middle', kind: 'gateway' },
  { id: 'alashankou', label: '阿拉山口 / Alashankou', code: '铁路口岸', coordinates: [82.57, 45.17], labelDx: 38, labelDy: 34, kind: 'gateway' },
  { id: 'almaty', label: '阿拉木图 / Almaty', coordinates: [76.945, 43.238], labelDx: -28, labelDy: 56 },
  { id: 'tashkent', label: '塔什干 / Tashkent', coordinates: [69.24, 41.299], labelDx: -30, labelDy: 24 },
  { id: 'bishkek', label: '比什凯克 / Bishkek', coordinates: [74.57, 42.875], labelDx: -22, labelDy: -34 },
  { id: 'dushanbe', label: '杜尚别 / Dushanbe', coordinates: [68.787, 38.56], labelDx: 22, labelDy: 54 },
  { id: 'moscow', label: '莫斯科 / Moscow', coordinates: [37.617, 55.756], labelDx: 16, labelDy: 30 },
];

const centralNodesEn: MapNode[] = centralNodes.map((node) => ({
  ...node,
  label: ({
    jiaozhou: 'Jiaozhou', khorgos: 'Khorgos', alashankou: 'Alashankou', almaty: 'Almaty',
    tashkent: 'Tashkent', bishkek: 'Bishkek', dushanbe: 'Dushanbe', moscow: 'Moscow',
  } as Record<string, string>)[node.id] ?? node.label,
  code: ({
    jiaozhou: 'CHINA ORIGIN', khorgos: 'ROAD / RAIL GATEWAY', alashankou: 'RAIL GATEWAY',
  } as Record<string, string>)[node.id],
}));

const centralRoutes: MapRoute[] = [
  { id: 'china-khorgos', kind: 'land', coordinates: [[120.033, 36.264], [103.83, 36.06], [87.62, 43.82], [80.411, 44.213]] },
  { id: 'china-alashankou', kind: 'secondary', coordinates: [[120.033, 36.264], [103.83, 36.06], [87.62, 43.82], [82.57, 45.17]] },
  { id: 'khorgos-almaty', kind: 'land', coordinates: [[80.411, 44.213], [76.945, 43.238]] },
  { id: 'khorgos-tashkent', kind: 'land', coordinates: [[80.411, 44.213], [76.89, 42.32], [69.24, 41.299]] },
  { id: 'almaty-bishkek', kind: 'secondary', coordinates: [[76.945, 43.238], [74.57, 42.875]] },
  { id: 'tashkent-dushanbe', kind: 'secondary', coordinates: [[69.24, 41.299], [68.787, 38.56]] },
  { id: 'khorgos-moscow', kind: 'secondary', coordinates: [[80.411, 44.213], [71.43, 51.17], [37.617, 55.756]] },
];

const regionLabels: Array<{ label: string; coordinates: Coordinate }> = [
  { label: 'CHINA', coordinates: [101, 31] }, { label: 'KAZAKHSTAN', coordinates: [66, 49] },
  { label: 'UZBEKISTAN', coordinates: [61.5, 38.5] }, { label: 'RUSSIA', coordinates: [53, 57] },
];

function CentralAsiaMap({ language }: { language: Language }) {
  const localized = language === 'zh';
  const ui = mapSvgUi[language];
  const nodeUi = mapNodeUi[language];
  const nodes = (localized ? centralNodes : centralNodesEn).map(node => node.id === 'jiaozhou' ? { ...node, code: nodeUi.origin } : node.id === 'khorgos' ? { ...node, code: nodeUi.roadRail } : node.id === 'alashankou' ? { ...node, code: nodeUi.rail } : node);
  const localizedRegionLabels = regionLabels.map((item, index) => ({ ...item, label: mapRegionLabels[language][index] }));
  return (
    <svg className="freight-map-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby="freight-central-title freight-central-desc">
      <title id="freight-central-title">{ui.centralTitle}</title>
      <desc id="freight-central-desc">{ui.centralDesc}</desc>
      <MapChrome clipId="central-map-clip" />
      <MapBase projection={centralProjection} highlighted={centralCountryIds} clipId="central-map-clip" regional />
      <MapCartouche label={ui.centralCartouche} />
      <g className="freight-region-labels" aria-hidden="true">{localizedRegionLabels.map((item) => {
        const point = centralProjection(item.coordinates);
        return point ? <text key={item.label} x={point[0]} y={point[1]}>{item.label}</text> : null;
      })}</g>
      <MapRoutes routes={centralRoutes} projection={centralProjection} />
      <MapNodes nodes={nodes} projection={centralProjection} />
    </svg>
  );
}

const uzbekistanNodes: MapNode[] = [
  { id: 'jiaozhou', label: '胶州', code: '装车与加固', coordinates: [120.033, 36.264], labelDx: -18, labelDy: -28, kind: 'origin' },
  { id: 'khorgos', label: '霍尔果斯', code: '出境口岸', coordinates: [80.411, 44.213], labelDx: 18, labelDy: -32, kind: 'gateway' },
  { id: 'tashkent', label: '塔什干', code: '清关仓 / 通知自提', coordinates: [69.24, 41.299], labelDx: 18, labelDy: 36 },
];
const uzbekistanNodesEn: MapNode[] = [
  { id: 'jiaozhou', label: 'Jiaozhou', code: 'LOAD & SECURE', coordinates: [120.033, 36.264], labelDx: -18, labelDy: -28, kind: 'origin' },
  { id: 'khorgos', label: 'Khorgos', code: 'BORDER GATEWAY', coordinates: [80.411, 44.213], labelDx: 18, labelDy: -32, kind: 'gateway' },
  { id: 'tashkent', label: 'Tashkent', code: 'CUSTOMS WAREHOUSE / PICKUP', coordinates: [69.24, 41.299], labelDx: 18, labelDy: 36 },
];
const uzbekistanRoutes: MapRoute[] = [
  { id: 'jiaozhou-tashkent', kind: 'land', coordinates: [[120.033, 36.264], [103.83, 36.06], [87.62, 43.82], [80.411, 44.213], [76.89, 42.32], [69.24, 41.299]] },
];

function UzbekistanMap({ language }: { language: Language }) {
  const localized = language === 'zh';
  const ui = mapSvgUi[language];
  const nodeUi = mapNodeUi[language];
  const nodes = (localized ? uzbekistanNodes : uzbekistanNodesEn).map(node => node.id === 'jiaozhou' ? { ...node, code: nodeUi.load } : node.id === 'khorgos' ? { ...node, code: nodeUi.border } : { ...node, code: nodeUi.customs });
  const mileposts: Array<{ label: string; coordinates: Coordinate }> = [
    { label: ui.chinaRoad, coordinates: [101, 37.6] },
    { label: ui.crossBorder, coordinates: [75.5, 40.9] },
  ];
  return (
    <svg className="freight-map-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby="freight-uz-title freight-uz-desc">
      <title id="freight-uz-title">{ui.uzTitle}</title>
      <desc id="freight-uz-desc">{ui.uzDesc}</desc>
      <MapChrome clipId="uzbekistan-map-clip" />
      <MapBase projection={uzbekistanProjection} highlighted={centralCountryIds} clipId="uzbekistan-map-clip" regional />
      <MapCartouche label={ui.uzCartouche} />
      <MapRoutes routes={uzbekistanRoutes} projection={uzbekistanProjection} />
      <MapNodes nodes={nodes} projection={uzbekistanProjection} />
      <g className="freight-route-mileposts" aria-hidden="true">{mileposts.map((item) => {
        const point = uzbekistanProjection(item.coordinates);
        return point ? <g key={item.label} transform={`translate(${point[0]} ${point[1]})`}><rect x="-62" y="-14" width="124" height="28" rx="14" /><text y="4">{item.label}</text></g> : null;
      })}</g>
    </svg>
  );
}

const modeRowsZh: Record<MapVariant, Array<{ label: string; value: string; icon: typeof Ship }>> = {
  world: [
    { label: '海运门户', value: 'Jebel Ali、Lagos、Tema、Callao、Santos、Manzanillo', icon: Ship },
    { label: '陆路门户', value: 'Khorgos、Alashankou', icon: TrainFront },
  ],
  'central-asia': [
    { label: '主要口岸', value: '霍尔果斯 / 阿拉山口', icon: TrainFront },
    { label: '覆盖方式', value: '铁路、跨境汽运、当地仓自提', icon: Truck },
  ],
  uzbekistan: [
    { label: '运输方式', value: '全程汽运', icon: Truck },
    { label: '交付边界', value: '塔什干清关仓，通知客户自提', icon: Ship },
  ],
};

const modeRowsEn: Record<MapVariant, Array<{ label: string; value: string; icon: typeof Ship }>> = {
  world: [
    { label: 'Ocean gateways', value: 'Jebel Ali, Lagos, Tema, Callao, Santos, Manzanillo', icon: Ship },
    { label: 'Overland gateways', value: 'Khorgos, Alashankou', icon: TrainFront },
  ],
  'central-asia': [
    { label: 'Main gateways', value: 'Khorgos / Alashankou', icon: TrainFront },
    { label: 'Service modes', value: 'Rail, cross-border trucking, local warehouse pickup', icon: Truck },
  ],
  uzbekistan: [
    { label: 'Transport mode', value: 'Cross-border trucking', icon: Truck },
    { label: 'Delivery scope', value: 'Tashkent customs warehouse, customer pickup', icon: Ship },
  ],
};

const modeRowsInternational: Record<Exclude<Language, 'en' | 'zh'>, Record<MapVariant, Array<{ label: string; value: string; icon: typeof Ship }>>> = {
  ru: {
    world: [{ label: 'Морские узлы', value: 'Джебель-Али, Лагос, Тема, Кальяо, Сантус, Мансанильо', icon: Ship }, { label: 'Сухопутные переходы', value: 'Хоргос, Алашанькоу', icon: TrainFront }],
    'central-asia': [{ label: 'Основные переходы', value: 'Хоргос / Алашанькоу', icon: TrainFront }, { label: 'Виды сервиса', value: 'Железная дорога, авто, самовывоз со склада', icon: Truck }],
    uzbekistan: [{ label: 'Вид транспорта', value: 'Международная автоперевозка', icon: Truck }, { label: 'Объем доставки', value: 'Таможенный склад в Ташкенте, самовывоз', icon: Ship }],
  },
  fr: {
    world: [{ label: 'Portes maritimes', value: 'Jebel Ali, Lagos, Tema, Callao, Santos, Manzanillo', icon: Ship }, { label: 'Passages terrestres', value: 'Khorgos, Alashankou', icon: TrainFront }],
    'central-asia': [{ label: 'Passages principaux', value: 'Khorgos / Alashankou', icon: TrainFront }, { label: 'Modes de service', value: 'Rail, route transfrontalière, retrait en entrepôt', icon: Truck }],
    uzbekistan: [{ label: 'Mode de transport', value: 'Transport routier transfrontalier', icon: Truck }, { label: 'Périmètre de livraison', value: 'Entrepôt douanier de Tachkent, retrait client', icon: Ship }],
  },
  es: {
    world: [{ label: 'Puertas marítimas', value: 'Jebel Ali, Lagos, Tema, Callao, Santos, Manzanillo', icon: Ship }, { label: 'Pasos terrestres', value: 'Khorgos, Alashankou', icon: TrainFront }],
    'central-asia': [{ label: 'Pasos principales', value: 'Khorgos / Alashankou', icon: TrainFront }, { label: 'Modos de servicio', value: 'Ferrocarril, carretera y recogida en almacén', icon: Truck }],
    uzbekistan: [{ label: 'Modo de transporte', value: 'Carretera transfronteriza', icon: Truck }, { label: 'Alcance de entrega', value: 'Almacén aduanero de Taskent, recogida del cliente', icon: Ship }],
  },
  ar: {
    world: [{ label: 'البوابات البحرية', value: 'جبل علي، لاغوس، تيما، كاياو، سانتوس، مانزانيلو', icon: Ship }, { label: 'البوابات البرية', value: 'خورغوس، ألاشانكو', icon: TrainFront }],
    'central-asia': [{ label: 'المعابر الرئيسية', value: 'خورغوس / ألاشانكو', icon: TrainFront }, { label: 'أنماط الخدمة', value: 'سكك حديدية، نقل بري، استلام من المستودع', icon: Truck }],
    uzbekistan: [{ label: 'وسيلة النقل', value: 'نقل بري عابر للحدود', icon: Truck }, { label: 'نطاق التسليم', value: 'مستودع جمارك طشقند، استلام العميل', icon: Ship }],
  },
  pt: {
    world: [{ label: 'Portos principais', value: 'Jebel Ali, Lagos, Tema, Callao, Santos, Manzanillo', icon: Ship }, { label: 'Passagens terrestres', value: 'Khorgos, Alashankou', icon: TrainFront }],
    'central-asia': [{ label: 'Passagens principais', value: 'Khorgos / Alashankou', icon: TrainFront }, { label: 'Modos de serviço', value: 'Ferrovia, rodovia e retirada no armazém', icon: Truck }],
    uzbekistan: [{ label: 'Modo de transporte', value: 'Transporte rodoviário transfronteiriço', icon: Truck }, { label: 'Escopo de entrega', value: 'Armazém alfandegário de Tashkent, retirada', icon: Ship }],
  },
  tr: {
    world: [{ label: 'Deniz geçitleri', value: 'Jebel Ali, Lagos, Tema, Callao, Santos, Manzanillo', icon: Ship }, { label: 'Kara geçitleri', value: 'Khorgos, Alashankou', icon: TrainFront }],
    'central-asia': [{ label: 'Ana geçitler', value: 'Khorgos / Alashankou', icon: TrainFront }, { label: 'Hizmet türleri', value: 'Demiryolu, karayolu ve depo teslim alma', icon: Truck }],
    uzbekistan: [{ label: 'Taşıma türü', value: 'Sınır ötesi karayolu', icon: Truck }, { label: 'Teslimat kapsamı', value: 'Taşkent gümrük deposu, müşteri teslim alması', icon: Ship }],
  },
};

export default function FreightRouteMap({ variant, locale }: FreightRouteMapProps) {
  const { language } = useLanguage();
  const activeLanguage = locale || language;
  const copy = activeLanguage === 'zh' ? mapCopyZh[variant] : activeLanguage === 'en' ? mapCopyEn[variant] : mapCopyInternational[activeLanguage][variant];
  const modeRows = activeLanguage === 'zh' ? modeRowsZh : activeLanguage === 'en' ? modeRowsEn : modeRowsInternational[activeLanguage];
  const ui = mapUi[activeLanguage];
  const prefix = language === 'en' ? '' : language === 'zh' ? '/zh-cn' : `/${language}`;
  return (
    <section className={`freight-map-panel freight-map-panel-${variant}`} aria-labelledby={`freight-map-${variant}-heading`}>
      <div className="freight-map-copy">
        <p className="freight-map-eyebrow">{copy.eyebrow}</p>
        <h2 id={`freight-map-${variant}-heading`}>{copy.title}</h2>
        <p className="freight-map-description">{copy.description}</p>
        <dl className="freight-map-facts">{modeRows[variant].map(({ label, value, icon: Icon }) => (
          <div key={label}><dt><Icon aria-hidden="true" />{label}</dt><dd>{value}</dd></div>
        ))}</dl>
        <a className="freight-map-link" href={`${prefix}${copy.routeHref}`}>{copy.routeLabel}<ArrowUpRight aria-hidden="true" /></a>
      </div>
      <figure className="freight-map-figure">
        {variant === 'world' ? <WorldMap language={activeLanguage} /> : variant === 'central-asia' ? <CentralAsiaMap language={activeLanguage} /> : <UzbekistanMap language={activeLanguage} />}
        <figcaption>
          <span><i className="freight-legend-line freight-legend-line-primary" />{ui.primary}</span>
          <span><i className="freight-legend-line freight-legend-line-secondary" />{ui.secondary}</span>
          <span><i className="freight-legend-node" />{ui.node}</span>
          <span className="freight-map-verified"><MapPinned aria-hidden="true" />{ui.verified}</span>
        </figcaption>
        <p className="freight-map-note">{copy.routeNote}</p>
      </figure>
    </section>
  );
}
