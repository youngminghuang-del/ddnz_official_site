import CentralAsiaRouteOptions from './CentralAsiaRouteOptions';
import EuropeDocumentExamples from "./EuropeDocumentExamples";
import centralAfricaCopy from './centralAfricaCopy.json';
import marketRegions from './marketRegions.json';
import EcuadorRegionEntry from './EcuadorRegionEntry';
import {DoorDeliveryLink} from './DoorDeliveryContent';
import FreightRatePreview from './rates/FreightRatePreview';
import FreightBreadcrumbs from './FreightBreadcrumbs';
import FreightRelatedLinks from './FreightRelatedLinks';
import type { Language } from '../../i18n/translations';
import { RegionalFreightMap } from '../../components/FreightRouteMap';
import { freightPrefix, regions, type RegionId } from './regions';
import NigeriaMarketGuide from './NigeriaMarketGuide';
import ChinaOriginGuide from './ChinaOriginGuide';
import OriginDestinationOpportunities from './OriginDestinationOpportunities';

type Copy = {
  home: string; freight: string; eyebrow: string; heading: string; intro: string; choose: string; quote: string;
  network: string; networkNote: string; routes: string; routesHeading: string; countryPrompt: string;
  evidence: string; evidenceHeading: string; origin: string; border: string; destination: string;
  originCaption: string; destinationCaption: string; pending: string; evidenceNote: string; caseLink: string;
  planning: string; planningHeading: string; cargo: string; cargoBody: string; import: string; importBody: string; scope: string; scopeBody: string;
};

const copy: Record<Language, Copy> = {
  en: { home: 'Home', freight: 'Freight services', eyebrow: 'CHINA → DESTINATION', heading: 'Shipping from China to', intro: 'Choose the destination first. We then align the cargo, port, importer and delivery boundary in one workable shipment plan.', choose: 'Choose a country', quote: 'Discuss a shipment', network: 'Port and gateway network', networkNote: 'Nodes are positioned by coordinates. Lines illustrate potential corridors, not a confirmed vessel schedule or port rotation.', routes: 'COUNTRY ROUTES', routesHeading: 'Choose the market, then the delivery plan.', countryPrompt: 'Review importer, documents, gateway and final delivery scope for this country.', evidence: 'SHIPMENT EVIDENCE', evidenceHeading: 'Follow the evidence, not just a route line.', origin: '01 / China origin', border: '02 / Route & handoff', destination: '03 / Destination', originCaption: 'Real China-side loading or cargo record; not proof of arrival.', destinationCaption: 'UAE unloading record from an actual shipment. Scope and date should be checked for a new quote.', pending: 'No verified destination photo is on file for this region. Ask for shipment-specific clearance and collection records.', evidenceNote: 'An illustrative map and an origin photo cannot prove customs clearance or final delivery.', caseLink: 'See the country case', planning: 'BEFORE THE QUOTE', planningHeading: 'Three decisions that change the real total.', cargo: 'Cargo & packaging', cargoBody: 'Send product, count, dimensions, gross weight, packing photos and ready date.', import: 'Importer & documents', importBody: 'Confirm who imports, who supplies documents and any product-specific checks before booking.', scope: 'Delivery boundary', scopeBody: 'Separate arrival at port, customs warehouse, customer pickup and door delivery in the quote.' },
  zh: { home: '首页', freight: '货运服务', eyebrow: '中国 → 目的地', heading: '从中国发往', intro: '先选目的国，再把货物、港口、进口主体与交付边界放进同一份可执行方案。', choose: '选择国家', quote: '讨论这票货', network: '港口与门户网络', networkNote: '节点按经纬度定位。线条表示可能的运输走廊，不是已确认的船期或挂港顺序。', routes: '国家线路', routesHeading: '先选市场，再定交付方案。', countryPrompt: '逐国核对进口主体、单证、门户和最终交付范围。', evidence: '运输证据', evidenceHeading: '沿着证据看交接，而不只看路线。', origin: '01 / 中国起运端', border: '02 / 路线与交接', destination: '03 / 目的地', originCaption: '真实中国端装载或货物记录；不代表已到达目的地。', destinationCaption: '真实阿联酋货物卸载记录。新询价仍需核对服务范围与日期。', pending: '目前没有该地区可核验的目的地照片。可针对具体运输索取清关与提货记录。', evidenceNote: '示意路线与中国端照片不能证明清关或最终交付。', caseLink: '查看国家案例', planning: '询价之前', planningHeading: '影响完整费用的三个决定。', cargo: '货物与包装', cargoBody: '提供品名、件数、尺寸、毛重、包装照片和货好时间。', import: '进口主体与文件', importBody: '订舱前确认谁负责进口、文件提供及产品专项要求。', scope: '交付边界', scopeBody: '把到港、清关仓、客户自提、到门分别列进报价范围。' },
  es: { home: 'Inicio', freight: 'Servicios de carga', eyebrow: 'CHINA → DESTINO', heading: 'Envíos de China a', intro: 'Primero elige el país. Después acordamos carga, puerto, importador y alcance de entrega en un plan viable.', choose: 'Elegir país', quote: 'Consultar un envío', network: 'Red de puertos y accesos', networkNote: 'Los nodos usan coordenadas. Las líneas ilustran corredores posibles, no un itinerario confirmado.', routes: 'RUTAS POR PAÍS', routesHeading: 'Primero el mercado, luego el plan de entrega.', countryPrompt: 'Revisar importador, documentos, puerto y entrega final para este país.', evidence: 'EVIDENCIA DE ENVÍO', evidenceHeading: 'Sigue la evidencia, no solo la línea del mapa.', origin: '01 / Origen en China', border: '02 / Ruta y relevo', destination: '03 / Destino', originCaption: 'Registro real de carga en China; no demuestra llegada al destino.', destinationCaption: 'Registro real de descarga en EAU. Confirmar alcance y fecha para un nuevo envío.', pending: 'Aún no hay foto verificable de destino para esta región. Solicita registros específicos de despacho y retiro.', evidenceNote: 'Un mapa ilustrativo y una foto de origen no demuestran despacho ni entrega.', caseLink: 'Ver el caso por país', planning: 'ANTES DE COTIZAR', planningHeading: 'Tres decisiones que cambian el coste total.', cargo: 'Carga y embalaje', cargoBody: 'Enviar producto, cantidad, dimensiones, peso bruto, fotos y fecha disponible.', import: 'Importador y documentos', importBody: 'Confirmar quién importa, quién aporta documentos y requisitos del producto antes de reservar.', scope: 'Alcance de entrega', scopeBody: 'Distinguir puerto, almacén aduanero, retiro y entrega a domicilio en la oferta.' },
  ru: { home: 'Главная', freight: 'Грузовые услуги', eyebrow: 'КИТАЙ → НАЗНАЧЕНИЕ', heading: 'Доставка из Китая в', intro: 'Сначала выберите страну. Затем согласуем груз, порт, импортёра и границы доставки в одном плане.', choose: 'Выбрать страну', quote: 'Обсудить груз', network: 'Сеть портов и переходов', networkNote: 'Узлы нанесены по координатам. Линии показывают возможные коридоры, а не подтверждённое расписание судна.', routes: 'МАРШРУТЫ ПО СТРАНАМ', routesHeading: 'Сначала рынок, затем план доставки.', countryPrompt: 'Проверьте импортёра, документы, порт и объем конечной доставки.', evidence: 'ПОДТВЕРЖДЕНИЯ ПЕРЕВОЗКИ', evidenceHeading: 'Смотрите на документы и этапы, а не только на линию маршрута.', origin: '01 / Отправление из Китая', border: '02 / Маршрут и передача', destination: '03 / Пункт назначения', originCaption: 'Реальная погрузка в Китае; не подтверждает прибытие.', destinationCaption: 'Реальная разгрузка в ОАЭ. Для нового груза нужно уточнить дату и объем услуги.', pending: 'Подтверждённого фото в пункте назначения пока нет. Запросите записи по оформлению и выдаче конкретного груза.', evidenceNote: 'Схема и фото погрузки не подтверждают таможенную очистку или выдачу.', caseLink: 'Смотреть кейс страны', planning: 'ДО РАСЧЁТА', planningHeading: 'Три решения, влияющие на полную стоимость.', cargo: 'Груз и упаковка', cargoBody: 'Укажите товар, количество мест, размеры, брутто, фото упаковки и дату готовности.', import: 'Импортёр и документы', importBody: 'До бронирования согласуйте импортёра, документы и требования к товару.', scope: 'Граница доставки', scopeBody: 'Разделите в смете порт, таможенный склад, самовывоз и доставку до двери.' },
  fr: { home: 'Accueil', freight: 'Services de fret', eyebrow: 'CHINE → DESTINATION', heading: 'Expédier de Chine vers', intro: 'Choisissez d’abord le pays. Nous alignons ensuite le fret, le port, l’importateur et le périmètre de livraison.', choose: 'Choisir un pays', quote: 'Parler de cet envoi', network: 'Réseau de ports et passages', networkNote: 'Les points sont géolocalisés. Les lignes illustrent des corridors possibles, pas une rotation maritime confirmée.', routes: 'ROUTES PAR PAYS', routesHeading: 'Le marché d’abord, puis la livraison.', countryPrompt: 'Vérifier importateur, documents, port et périmètre final pour ce pays.', evidence: 'PREUVES D’EXPÉDITION', evidenceHeading: 'Suivre les preuves, pas seulement la ligne.', origin: '01 / Origine Chine', border: '02 / Route et transfert', destination: '03 / Destination', originCaption: 'Chargement réel en Chine ; ne prouve pas l’arrivée.', destinationCaption: 'Déchargement réel aux EAU. Confirmer date et périmètre pour un nouvel envoi.', pending: 'Aucune photo vérifiée à destination pour cette région. Demandez les pièces de dédouanement et de retrait propres à l’envoi.', evidenceNote: 'Une carte indicative et une photo d’origine ne prouvent ni dédouanement ni livraison.', caseLink: 'Voir le cas pays', planning: 'AVANT LE DEVIS', planningHeading: 'Trois décisions qui changent le coût complet.', cargo: 'Fret et emballage', cargoBody: 'Indiquer produit, colis, dimensions, poids brut, photos et date de disponibilité.', import: 'Importateur et documents', importBody: 'Confirmer importateur, documents et exigences produit avant réservation.', scope: 'Périmètre de livraison', scopeBody: 'Distinguer port, entrepôt douanier, retrait et livraison à domicile dans le devis.' },
  ar: { home: 'الرئيسية', freight: 'خدمات الشحن', eyebrow: 'الصين ← الوجهة', heading: 'الشحن من الصين إلى', intro: 'اختر بلد الوجهة أولاً، ثم نحدد البضاعة والميناء والمستورد ونطاق التسليم ضمن خطة قابلة للتنفيذ.', choose: 'اختر البلد', quote: 'ناقش الشحنة', network: 'شبكة الموانئ والبوابات', networkNote: 'تم تحديد العقد جغرافياً. الخطوط توضح ممرات محتملة وليست جدول إبحار مؤكداً.', routes: 'مسارات الدول', routesHeading: 'اختر السوق ثم خطة التسليم.', countryPrompt: 'راجع المستورد والمستندات والميناء ونطاق التسليم لهذا البلد.', evidence: 'أدلة الشحنة', evidenceHeading: 'اتبع أدلة التسليم، لا خط الخريطة فقط.', origin: '01 / المنشأ في الصين', border: '02 / المسار والتسليم', destination: '03 / الوجهة', originCaption: 'سجل تحميل حقيقي في الصين؛ لا يثبت الوصول.', destinationCaption: 'سجل تفريغ حقيقي في الإمارات. يلزم تأكيد التاريخ والنطاق للشحنة الجديدة.', pending: 'لا توجد صورة وصول موثقة لهذه المنطقة حالياً. اطلب سجلات التخليص والاستلام الخاصة بالشحنة.', evidenceNote: 'الخريطة التوضيحية وصورة المنشأ لا تثبتان التخليص أو التسليم النهائي.', caseLink: 'عرض حالة الدولة', planning: 'قبل عرض السعر', planningHeading: 'ثلاثة قرارات تؤثر في التكلفة الكاملة.', cargo: 'البضاعة والتعبئة', cargoBody: 'أرسل نوع المنتج والعدد والأبعاد والوزن والصور وتاريخ الجاهزية.', import: 'المستورد والمستندات', importBody: 'حدد المستورد ومسؤول المستندات ومتطلبات المنتج قبل الحجز.', scope: 'نطاق التسليم', scopeBody: 'ميّز بين الميناء والمستودع الجمركي والاستلام والتوصيل في السعر.' },
  pt: { home: 'Início', freight: 'Serviços de frete', eyebrow: 'CHINA → DESTINO', heading: 'Envio da China para', intro: 'Escolha primeiro o país. Depois alinhamos carga, porto, importador e escopo de entrega.', choose: 'Escolher país', quote: 'Consultar remessa', network: 'Rede de portos', networkNote: 'Nós geolocalizados; linhas indicam corredores possíveis, não uma escala confirmada.', routes: 'ROTAS POR PAÍS', routesHeading: 'Primeiro o mercado, depois a entrega.', countryPrompt: 'Revise importador, documentos, porto e entrega final.', evidence: 'EVIDÊNCIAS', evidenceHeading: 'Siga as evidências, não só a linha.', origin: '01 / Origem na China', border: '02 / Rota e transferência', destination: '03 / Destino', originCaption: 'Carga real na China; não comprova chegada.', destinationCaption: 'Descarga real nos EAU; confirme data e escopo para nova remessa.', pending: 'Sem foto verificada no destino desta região. Solicite registros específicos de desembaraço e retirada.', evidenceNote: 'Mapa ilustrativo e foto de origem não comprovam desembaraço ou entrega.', caseLink: 'Ver caso do país', planning: 'ANTES DA COTAÇÃO', planningHeading: 'Três decisões que afetam o custo total.', cargo: 'Carga e embalagem', cargoBody: 'Informe produto, volumes, medidas, peso, fotos e data.', import: 'Importador e documentos', importBody: 'Confirme importador, documentos e requisitos do produto antes da reserva.', scope: 'Escopo da entrega', scopeBody: 'Separe porto, armazém, retirada e entrega na cotação.' },
  tr: { home: 'Ana sayfa', freight: 'Yük hizmetleri', eyebrow: 'ÇİN → VARIŞ', heading: 'Çin’den sevkiyat:', intro: 'Önce ülkeyi seçin. Sonra yük, liman, ithalatçı ve teslim kapsamını birlikte netleştirelim.', choose: 'Ülke seçin', quote: 'Sevkiyatı görüşün', network: 'Liman ve geçit ağı', networkNote: 'Noktalar koordinatlara göre yerleştirildi. Çizgiler olası koridorları gösterir, kesin gemi programını değil.', routes: 'ÜLKE ROTALARI', routesHeading: 'Önce pazar, sonra teslimat planı.', countryPrompt: 'İthalatçı, belgeler, liman ve son teslim kapsamını kontrol edin.', evidence: 'SEVKİYAT KANITI', evidenceHeading: 'Sadece rota çizgisine değil, kanıta bakın.', origin: '01 / Çin çıkışı', border: '02 / Rota ve devir', destination: '03 / Varış', originCaption: 'Çin’de gerçek yükleme; varışı kanıtlamaz.', destinationCaption: 'BAE’de gerçek boşaltma; yeni sevkiyat için tarih ve kapsamı teyit edin.', pending: 'Bu bölge için doğrulanmış varış fotoğrafı henüz yok. Sevkiyata özel gümrük ve teslim kayıtlarını isteyin.', evidenceNote: 'Harita ve çıkış fotoğrafı gümrükleme veya teslimatı kanıtlamaz.', caseLink: 'Ülke vakasını görün', planning: 'TEKLİFTEN ÖNCE', planningHeading: 'Toplam maliyeti etkileyen üç karar.', cargo: 'Yük ve ambalaj', cargoBody: 'Ürün, adet, ölçü, brüt ağırlık, fotoğraf ve hazır tarihi gönderin.', import: 'İthalatçı ve belgeler', importBody: 'Rezervasyon öncesinde ithalatçı, belgeler ve ürün koşullarını teyit edin.', scope: 'Teslim kapsamı', scopeBody: 'Liman, gümrük deposu, teslim alma ve adrese teslimi ayrı fiyatlandırın.' },
};

const europeIllustrationCopy: Record<Language, [string, string, string]> = {
  en: ['LCL consolidation and full-container pickup', 'LCL consolidation diagram. Goods from several shippers share one container and are sorted by shipment after unloading.', 'Full-container pickup diagram. Check the transport document and release status, confirm the pickup appointment, then count and sign for the goods at the warehouse.'],
  zh: ['拼箱怎么合装，整柜到港怎么提箱', '拼箱合装示意。不同发货人的货物共用一个集装箱，到港拆箱后按票分拨。', '整柜到港提箱示意。先核对运输单证和放行状态，再确认提货预约，最后在仓库清点货物并签收。'],
  es: ['Consolidación LCL y recogida de contenedores completos', 'Esquema de consolidación LCL. La mercancía de varios expedidores comparte un contenedor y se separa por envío tras la descarga.', 'Esquema de recogida de un contenedor completo. Compruebe el documento de transporte y el estado de liberación, confirme la cita y luego cuente y firme la recepción en el almacén.'],
  ru: ['Консолидация сборного груза и вывоз полного контейнера', 'Схема сборной перевозки. Грузы нескольких отправителей едут в одном контейнере. После выгрузки их распределяют по отправкам.', 'Схема вывоза полного контейнера. Проверьте транспортный документ и статус выпуска, согласуйте время вывоза, затем пересчитайте и примите груз на складе.'],
  fr: ['Groupage LCL et retrait de conteneurs complets', 'Schéma de groupage LCL. Les marchandises de plusieurs expéditeurs partagent un conteneur, puis sont triées par envoi après déchargement.', 'Schéma de retrait d’un conteneur complet. Vérifiez le document de transport et le statut de mainlevée, confirmez le créneau, puis comptez et réceptionnez les colis à l’entrepôt.'],
  ar: ['تجميع الشحنات الجزئية واستلام الحاويات الكاملة', 'مخطط التجميع. تتشارك بضائع عدة مرسلين حاوية واحدة، ثم تُفرز حسب الشحنة بعد التفريغ.', 'مخطط استلام حاوية كاملة. راجع مستند النقل وحالة الإفراج، وأكّد موعد الاستلام، ثم عُدّ الطرود ووقّع عند الاستلام في المستودع.'],
  pt: ['Consolidação LCL e retirada de contêineres completos', 'Esquema de consolidação LCL. Mercadorias de vários embarcadores compartilham um contêiner e são separadas por remessa após a descarga.', 'Esquema de retirada de contêiner completo. Confira o documento de transporte e a liberação, confirme o agendamento e depois conte e assine o recebimento no armazém.'],
  tr: ['Parsiyel yük birleştirme ve tam konteyner teslim alma', 'Parsiyel yük şeması. Birden fazla göndericinin yükü aynı konteynere alınır ve boşaltıldıktan sonra sevkiyata göre ayrılır.', 'Tam konteyner teslim alma şeması. Taşıma belgesini ve yükün serbest bırakılma durumunu kontrol edin, randevuyu doğrulayın ve depoda yükü sayıp teslim alın.'],
};
const europePorts = [['Valencia', 'Port of Valencia, Spain'], ['Hamburg', 'Port of Hamburg, Germany']];

const regionNames: Record<RegionId, Record<Language, string>> = {
  'central-africa': {"en": "Central Africa", "zh": "中非", "es": "África Central", "ar": "أفريقيا الوسطى", "fr": "l’Afrique centrale", "ru": "Центральную Африку", "pt": "a África Central", "tr": "Orta Afrika"},"central-america":{"en": "Central America", "zh": "中美洲", "es": "América Central", "ar": "أمريكا الوسطى", "fr": "Amérique centrale", "ru": "Центральная Америка", "pt": "América Central", "tr": "Orta Amerika"},"europe":{"en": "Europe", "zh": "欧洲", "es": "Europa", "ar": "أوروبا", "fr": "Europe", "ru": "Европа", "pt": "Europa", "tr": "Avrupa"},
  'middle-east': { en: 'the Middle East', zh: '中东', es: 'Oriente Medio', ru: 'Ближний Восток', fr: 'le Moyen-Orient', ar: 'الشرق الأوسط', pt: 'o Oriente Médio', tr: 'Orta Doğu' },
  'west-africa': { en: 'West Africa', zh: '西非', es: 'África Occidental', ru: 'Западную Африку', fr: 'l’Afrique de l’Ouest', ar: 'غرب أفريقيا', pt: 'a África Ocidental', tr: 'Batı Afrika' },
  'latin-america': { en: 'Latin America', zh: '拉美', es: 'Latinoamérica', ru: 'Латинскую Америку', fr: 'l’Amérique latine', ar: 'أمريكا اللاتينية', pt: 'a América Latina', tr: 'Latin Amerika' },
};

const countryIso: Record<string, string> = {togo:'TG',benin:'BJ',cameroon:'CM',panama:'PA','costa-rica':'CR',spain:'ES',germany:'DE',colombia:'CO','ivory-coast':'CI',senegal:'SN',
  mexico: 'MX', brazil: 'BR', argentina: 'AR', peru: 'PE', chile: 'CL', nigeria: 'NG', ghana: 'GH',
  'saudi-arabia': 'SA', uae: 'AE', kuwait: 'KW', qatar: 'QA', oman: 'OM', bahrain: 'BH',
};
const languageTag: Record<Language, string> = { en: 'en', zh: 'zh-CN', es: 'es', ru: 'ru', fr: 'fr', ar: 'ar', pt: 'pt', tr: 'tr' };
const gatewayNames: Record<RegionId, string[]> = {
  'central-africa': ['Douala / CMDLA'],'central-america':['Balboa','Caldera / Moín'],europe:['Valencia','Hamburg'],
  'middle-east': ['Jebel Ali / AEJEA', 'Jeddah / SAJED', 'Shuwaikh / KWSWK'],
  'west-africa': ['Lagos / NGLOS', 'Tema / GHTEM', 'Abidjan / CIABJ'],
  'latin-america': ['Callao / PECLL', 'Santos / BRSSZ', 'Manzanillo / MXZLO'],
};

export function regionDisplayName(region: RegionId, locale: Language) { return regionNames[region][locale]; }
export function regionDescription(region: RegionId, locale: Language) {
  if(region==='central-africa')return centralAfricaCopy[locale].intro;
  if(region==='central-america'||region==='europe')return marketRegions[region][locale].intro;
  const local = locale === 'zh' || locale === 'es' ? locale : 'en';
  return locale === 'en' || locale === 'zh' || locale === 'es' ? regions[region].intro[local] : copy[locale].intro;
}
export function regionPageMetadata(region: RegionId, locale: Language) {
  if(region==='central-africa')return {title:centralAfricaCopy[locale].title+' | DDNZ Global',desc:centralAfricaCopy[locale].intro,keywords:''};
  if(region==='central-america'||region==='europe')return {title:marketRegions[region][locale].title+' | DDNZ Global',desc:marketRegions[region][locale].intro,keywords:''};
  const titleStart: Record<Language, string> = { en: 'Shipping from China to', zh: '中国至', es: 'Envíos de China a', ru: 'Доставка из Китая в', fr: 'Expédier de Chine vers', ar: 'الشحن من الصين إلى', pt: 'Envio da China para', tr: 'Çin’den sevkiyat:' };
  const start = locale === 'ru' && region === 'middle-east' ? 'Доставка из Китая на' : titleStart[locale];
  return { title: `${start} ${regionDisplayName(region, locale)} | DDNZ Global`, desc: regionDescription(region, locale), keywords: '' };
}

/** Shared by browser and static HTML renderer; no router hooks or browser-only state. */
export default function RegionContent({ region, locale }: { region: RegionId; locale: Language }) {
  const data = regions[region];
  const c = copy[locale];
  const prefix = freightPrefix(locale);
  const countryPrefix = prefix;
  const englishGuideLabel = '';
  const name = regionDisplayName(region, locale);
  const heading = locale === 'ru' && region === 'middle-east' ? 'Доставка из Китая на' : c.heading;
  const displayNames = new Intl.DisplayNames([languageTag[locale]], { type: 'region' });
  const quote = `${prefix}/get-a-quote/?leadGoal=Freight+Export&source=freight_region_${region}&dest=${encodeURIComponent(name)}`;
  const europeTitle = marketRegions.europe[locale].title;
  const europeName = locale === 'ru' ? 'Европу' : marketRegions.europe[locale].name;
  const europeNameStart = europeTitle.indexOf(europeName);
  const highlightedEuropeTitle = europeNameStart < 0 ? europeTitle : <>{europeTitle.slice(0, europeNameStart)}<em>{europeName}</em>{europeTitle.slice(europeNameStart + europeName.length)}</>;
  const originImage = region === 'latin-america' ? '/images/operations/peru-tile-loading-case.webp' : region === 'west-africa' ? '/media/freight-20260918/mixed-cargo-loading.jpg' : '/media/freight-20260918/factory-container.jpg';
  return <main id="main-content" className="country-editorial freight-region-unified freight-editorial freight-next freight-region-stage">
    <header className="freight-region-intro"><div className="freight-wrap">
      <FreightBreadcrumbs path={`/shipping-from-china-to-${region}/`} locale={locale} className="freight-region-breadcrumb"/>
      <p className="freight-kicker">{c.eyebrow}</p><h1>{region==='europe'?highlightedEuropeTitle:region==='central-america'?marketRegions[region][locale].title:<>{heading} <em>{name}.</em></>}</h1>
      <p className="freight-intro">{regionDescription(region, locale)}</p>
      <div className="freight-region-actions"><a className="freight-cta" href="#country-routes">{c.choose} ↓</a><a href={quote}>{c.quote} ↗</a></div>
    </div></header>
    <FreightRatePreview context={region} locale={locale}/><DoorDeliveryLink locale={locale} context={region}/>
    <section id={region === 'europe' ? 'europe-port-network' : undefined} className="freight-region-map-section" aria-labelledby="region-map-heading"><div className="freight-wrap">
      <div className="freight-region-section-head"><p className="freight-kicker">01 / {c.network}</p><h2 id="region-map-heading">{c.network}</h2></div>
      {region==='central-africa'?<figure className="new-central-route"><p><bdi>{displayNames.of('CN')}</bdi> <span aria-hidden="true">{locale==='ar'?'←':'→'}</span> <bdi>Douala / CMDLA</bdi></p><figcaption>{centralAfricaCopy[locale].diagram}</figcaption></figure>:region==='central-america'?<figure className="market-region-route"><p><bdi>{new Intl.DisplayNames([locale],{type:'region'}).of('CN')}</bdi><span aria-hidden="true">{locale==='ar'?'←':'→'}</span><bdi>{gatewayNames[region].join(' / ')}</bdi></p><figcaption>{marketRegions[region][locale].diagram}</figcaption></figure>:<RegionalFreightMap region={region} locale={locale} title={c.network} description={c.networkNote} />}
      {region === 'europe' && <div className="europe-port-map-links">
        <p>{c.networkNote}</p>
        <div>{europePorts.map(([name, query]) => <a key={name} href={`https://www.google.com/maps/search/?${new URLSearchParams({api: '1', query})}`} target="_blank" rel="noopener noreferrer"><bdi>{name}</bdi> · Google Maps ↗</a>)}</div>
      </div>}
      <ChinaOriginGuide locale={locale} destination={name} />
      {region!=='central-america'&&region!=='europe'&&region!=='central-africa'&&<OriginDestinationOpportunities context={region} locale={locale} />}
    </div></section>
    {region === 'europe' && <CentralAsiaRouteOptions locale={locale} destination="europe" />}
    <section id="country-routes" className="freight-wrap freight-section"><p className="freight-kicker">02 / {c.routes}</p><h2 className="mt-4">{c.routesHeading}</h2>
      <div className="mt-8 border-t border-[#dedde1]">{data.countries.map((country, index) => {
        const countryName = locale === 'en' || locale === 'zh' || locale === 'es'
          ? country.name[locale] : displayNames.of(countryIso[country.slug]) || country.name.en;
        const focus = locale === 'en' || locale === 'zh' || locale === 'es' ? country.focus[locale] : c.countryPrompt;
        return <a className="freight-country" key={country.slug} href={`${countryPrefix}/shipping-from-china-to-${country.slug}/`}><span className="font-mono text-[#8c7398]">{String(index + 1).padStart(2, '0')}</span><h3>{countryName}</h3><p>{focus}{englishGuideLabel && <small className="freight-english-guide">{englishGuideLabel}</small>}</p><span className="freight-arrow" aria-hidden="true">↗</span></a>;
      })}</div>
    </section>
    {region==='latin-america' && <EcuadorRegionEntry locale={locale} prefix={prefix}/>}
    {region === 'west-africa' ? <NigeriaMarketGuide locale={locale} compact /> : <section id={region === 'europe' ? 'europe-handover' : undefined} className="freight-region-evidence" aria-labelledby="region-evidence-heading"><div className="freight-wrap freight-section">
      <p className="freight-kicker">03{region !== 'europe' && ` / ${c.evidence}`}</p><h2 id="region-evidence-heading">{region === 'europe' ? europeIllustrationCopy[locale][0] : c.evidenceHeading}</h2>
      <div className="freight-region-evidence-grid">
        <article><span>{c.origin}</span><img src={originImage} alt={c.originCaption} loading="lazy" /><p>{c.originCaption}</p></article>
        <article><span>{c.border}</span>{region === 'europe' ? <><img src="/media/freight-europe/lcl-consolidation-technical.webp" alt="" width="960" height="720" loading="lazy" /><p>{europeIllustrationCopy[locale][1]}</p></> : <div className="freight-region-gateway-list">{gatewayNames[region].map((gateway, index) => <div key={gateway}><small>{String(index + 1).padStart(2, '0')}</small><strong>{gateway}</strong></div>)}</div>}</article>
        <article><span>{c.destination}</span>{region === 'middle-east' ? <><img src="/media/freight-20260919/uae-kitchen-unloading.jpg" alt={c.destinationCaption} loading="lazy" /><p>{c.destinationCaption}</p><a href={`${prefix}/shipping-from-china-to-uae/`}>{c.caseLink} ↗</a></> : region === 'europe' ? <><img src="/media/freight-europe/port-pickup-technical.webp" alt="" width="960" height="720" loading="lazy" /><p>{europeIllustrationCopy[locale][2]}</p></> : <><div className="freight-region-stage-mark freight-region-stage-pending">03</div><p>{c.pending}</p></>}</article>
      </div><p className="freight-region-evidence-note">{c.evidenceNote} {region === 'europe' && c.pending}</p>
      {region === "europe" && <EuropeDocumentExamples locale={locale} />}
    </div></section>}
    <section className="freight-wrap freight-section"><p className="freight-kicker">04 / {c.planning}</p><h2 className="mt-4">{c.planningHeading}</h2>
      <div className="freight-steps">{[[c.cargo, c.cargoBody], [c.import, c.importBody], [c.scope, c.scopeBody]].map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div>
      <a className="freight-cta mt-8" href={quote}>{c.quote} ↗</a>
    </section>
  <FreightRelatedLinks region={region} locale={locale}/></main>;
}
