import italy from './italyCopy.json';
import morocco from './moroccoCopy.json';
import belgium from './belgiumCopy.json';
import poland from './polandCopy.json';

export const portMarketSlugs = ['italy', 'morocco', 'belgium', 'poland'] as const;
export type PortMarketCountry = typeof portMarketSlugs[number];
export function isPortMarketCountry(slug: string): slug is PortMarketCountry {
  return portMarketSlugs.some(country => country === slug);
}

export const portMarketCopy = {italy, morocco, belgium, poland};

const italySchedule = 'https://www.cma-cgm.com/assets/public/documents/MEX%202_1.pdf';
const tangerSchedule = 'https://www.cma-cgm.com/ebusiness/schedules/line-services/exportserviceschedules?ScheduleCode=FAL&ScheduleName=French+Asia+Line+1+%28FAL%29';
const casablancaMarket = 'https://www.jhz56.com/en/ports/macas.html';

const britanniaSchedule = 'https://www.msc.com/-/media/files/msc-cargo/msc-solutions/trades/east-west-network/via-cape-asia-north-europe-network-2026.pdf?rev=6c1fd7c0a72f478abf9978f745183c87';

export const portMarkets = {
  italy: {
    ports: [
      {code: 'ITGOA', days: '49', shanghai: true, transitSource: 'CMA CGM · MEX2', transitUrl: italySchedule, rate: 5052, rateUrl: 'https://www.jhz56.com/en/ports/'},
      {code: 'ITSPE', days: '46', shanghai: true, transitSource: 'CMA CGM · MEX2', transitUrl: italySchedule, rate: 5050, rateUrl: 'https://www.jhz56.com/en/ports/itspe.html'},
    ],
    customsBadges: ['EORI', 'TARIC', 'CE'],
    authorities: [
      {name: 'ADM · TARIC', url: 'https://www.adm.gov.it/portale/-/consultare-la-tariffa-doganale-taric'},
      {name: 'ADM · EORI', url: 'https://www.adm.gov.it/portale/faq-le-risposte-alle-domande-piu-frequenti-sulla-materia-doganale'},
    ],
    factoryPath: '/refrigeration-equipment/',
    photo: {src: '/images/operations/container-loading-forklift-wide-v1.webp', width: 1440, height: 810},
  },
  morocco: {
    ports: [
      {code: 'MAPTM', days: '35–36', shanghai: true, transitSource: 'CMA CGM · FAL', transitUrl: tangerSchedule, rate: 5586, rateUrl: 'https://www.jhz56.com/en/ports/maptm.html'},
      {code: 'MACAS', days: '≈49', shanghai: false, transitSource: 'JHZ', transitUrl: casablancaMarket, rate: 5790, rateUrl: casablancaMarket},
    ],
    customsBadges: ['PortNet', 'DUM / HS', 'CoC'],
    authorities: [
      {name: 'PortNet · Titre d’importation', url: 'https://www.portnet.ma/documents/d/guichet-unique/guide_utilisateur_titre_dimportation?download=true'},
      {name: 'PortNet · CoC', url: 'https://www.portnet.ma/fr/gestion-des-certificats-de-conformit%C3%A9-cocs'},
    ],
    factoryPath: '/sourcing-services/consolidation-export/',
    photo: {src: '/images/operations/warehouse-barcode-scan-candid-v1.webp', width: 1003, height: 1568},
  },
  belgium: {
    ports: [
      {code: 'BEANR', days: '48', shanghai: true, transitSource: 'MSC · Britannia', transitUrl: britanniaSchedule, rate: 3500, rateUrl: 'https://www.jhz56.com/en/ports/beanr.html'},
      {code: 'BEZEE', days: '47', shanghai: true, transitSource: 'MSC · Britannia', transitUrl: britanniaSchedule, rate: 3450, rateUrl: 'https://www.jhz56.com/en/ports/bezee.html'},
    ],
    customsBadges: ['EORI / IDMS', 'TARIC', 'Certified Pick up'],
    authorities: [
      {name: 'SPF Finances · IDMS', url: 'https://finances.belgium.be/fr/douanes_accises/entreprises/applications-da/masp-electronic-customs/applications-masp/idms'},
      {name: 'Port of Antwerp-Bruges · Certified Pick up', url: 'https://www.portofantwerpbruges.com/en/shipping/safety-and-security/certified-pick'},
      {name: 'CSP Zeebrugge · Certified Pick up', url: 'https://www.portofantwerpbruges.com/nl/nieuws/certified-pick-vervangt-pincodes-nu-ook-bij-csp-zeebrugge-terminal'},
    ],
    factoryPath: '/sourcing-services/inspection-quality-control/',
    photo: {src: '/images/operations/equipment-crate-blocking-anonymized.webp', width: 1087, height: 1447},
    doorAssessment: true,
  },
  poland: {
    ports: [
      {code: 'PLGDN', days: '53', shanghai: true, transitSource: 'MSC · Britannia', transitUrl: britanniaSchedule, rate: 3450, rateUrl: 'https://www.jhz56.com/en/ports/plgdn.html'},
      {code: 'PLGDY', days: '55', shanghai: true, transitSource: 'MSC · Britannia', transitUrl: britanniaSchedule, rate: 3660, rateUrl: 'https://www.jhz56.com/en/ports/'},
    ],
    customsBadges: ['EORI', 'AIS/IMPORT PLUS', 'RED / CE'],
    authorities: [
      {name: 'PUESC · AIS/IMPORT PLUS', url: 'https://puesc.gov.pl/en/uslugi/uslugi-sieciowe-informacje-i-specyfikacje/system-ais'},
      {name: 'EU · RED', url: 'https://single-market-economy.ec.europa.eu/sectors/electrical-and-electronic-engineering-industries-eei/radio-equipment-directive-red_en'},
      {name: 'UNECE · UN 38.3', url: 'https://unece.org/transport/dangerous-goods/rev8-files'},
      {name: 'IMO · IMDG', url: 'https://www.imo.org/en/publications/pages/imdg%20code.aspx'},
    ],
    factoryPath: '/sourcing/audio-speakers-from-china/portable-outdoor-speakers/',
    photo: {src: '/images/product-showcase/audio/mini-black-product-v1.webp', width: 1000, height: 1000, className: 'candidate-factory-product-image'},
    doorAssessment: true,
  },
} as const;

export const portMarketLabels = {
  en: {rates: 'Q4 2026 rates and transit', transit: 'Ocean transit reference', rate: '40HQ market median', shanghai: 'Shanghai', china: 'China', scope: 'Rates are ocean freight samples across Chinese origins. Terminal charges, clearance, duties and warehouse delivery are priced separately. Confirm the sailing and any transshipment before booking.'},
  zh: {rates: '2026 年第四季度运费与航程参考', transit: '海运航程参考', rate: '40HQ 市场中位数', shanghai: '上海', china: '中国', scope: '运费为中国多起运港的主海运样本。码头费、清关、税费和到仓派送另核。订舱时确认实际班次和是否转船。'},
  es: {rates: 'Flete y tránsito de referencia · cuarto trimestre de 2026', transit: 'Tránsito marítimo de referencia', rate: 'Mediana de mercado 40HQ', shanghai: 'Shanghái', china: 'China', scope: 'Los fletes son muestras de varios orígenes chinos. Terminal, despacho, tributos y entrega se cotizan aparte. Confirme la salida y el transbordo antes de reservar.'},
  fr: {rates: 'Fret et transit de référence · 4ᵉ trimestre 2026', transit: 'Transit maritime indicatif', rate: 'Médiane du marché 40HQ', shanghai: 'Shanghai', china: 'Chine', scope: 'Les tarifs sont des exemples de fret maritime depuis plusieurs ports chinois. Terminal, dédouanement, droits et livraison se chiffrent séparément. Confirmez le départ et le transbordement avant réservation.'},
  ru: {rates: 'Фрахт и сроки · ориентиры за IV квартал 2026 года', transit: 'Ориентир по морскому транзиту', rate: 'Рыночная медиана за 40HQ', shanghai: 'Шанхай', china: 'Китай', scope: 'Ставки отражают выборку морского фрахта из разных портов Китая. Терминал, оформление, пошлины и доставку до склада считайте отдельно. Перед бронированием подтвердите рейс и перегрузки.'},
  ar: {rates: 'أسعار ومدد مرجعية للربع الرابع من 2026', transit: 'مدة الشحن البحري المرجعية', rate: 'وسيط سعر السوق لحاوية 40HQ', shanghai: 'شنغهاي', china: 'الصين', scope: 'الأسعار عينات للشحن البحري من عدة موانئ صينية. تُحسب رسوم المحطة والتخليص والرسوم الجمركية والتوصيل إلى المستودع بصورة منفصلة. أكد الرحلة وإعادة الشحن قبل الحجز.'},
  pt: {rates: 'Frete e trânsito de referência · 4º trimestre de 2026', transit: 'Trânsito marítimo de referência', rate: 'Mediana de mercado 40HQ', shanghai: 'Xangai', china: 'China', scope: 'Os valores são amostras de frete marítimo de várias origens chinesas. Terminal, despacho, tributos e entrega são cotados separadamente. Confirme a saída e eventual transbordo antes da reserva.'},
  tr: {rates: '2026 4. çeyrek navlun ve süre referansı', transit: 'Deniz transit süresi örneği', rate: '40HQ piyasa medyanı', shanghai: 'Şanghay', china: 'Çin', scope: 'Navlun rakamları Çin’in farklı limanlarından alınan deniz taşıma örnekleridir. Terminal, gümrükleme, vergiler ve depo teslimi ayrı fiyatlandırılır. Seferi ve varsa aktarmayı rezervasyondan önce teyit edin.'},
} as const;
