import type { Language } from '../../i18n/translations';
import { localizedPacificPort } from './locales/index.mjs';

import southAfricaCopy from './candidate-markets/southAfricaCopy.json';
import {isMediterraneanCountry, mediterraneanCopy} from './candidate-markets/mediterraneanMarkets';

type Port = readonly [name: string, chinese: string, longitude: number, latitude: number, lookup?: string];
type Bounds = [west: number, south: number, east: number, north: number];
type GatewayMap = { id: string; bounds?: Bounds; placement?: 'route-planning'; ports: readonly Port[] };

const kazakhstanLandmarks = [
 { coordinates: [80.411, 44.213], labels: ['Khorgos', '霍尔果斯', 'Хоргос'] },
 { coordinates: [82.57, 45.17], labels: ['Alashankou / Dostyk', '阿拉山口 / 多斯特克', 'Алашанькоу / Достык'] },
 { coordinates: [76.945, 43.238], labels: ['Almaty', '阿拉木图', 'Алматы'] },
 { coordinates: [71.43, 51.13], labels: ['Astana', '阿斯塔纳', 'Астана'] },
] as const;

// Page gateways only. Terminal positions use the SMDG Terminal Code List,
// and named port areas use UN/LOCODE or the port authority's published layout.
export const countryGateways: Record<string, GatewayMap> = {
 kazakhstan: {id:'398', ports:kazakhstanLandmarks.map(({ coordinates: [longitude, latitude], labels: [en, zh] }) =>
  [en, zh, longitude, latitude])},
 thailand: {id:'764', ports:[
  ['Laem Chabang','林查班',100.882,13.075,'LAEM CHABANG'],
  ['Siam Commercial Seaport','Siam Commercial Seaport（SSP）',100.877222,13.13],
  ['KLN Seaport','KLN Seaport（Kerry）',100.876667,13.138333],
 ]},
 indonesia: {id:'360', bounds:[95,-10,121,7], ports:[
  ['Jakarta · JICT (UTC1)','雅加达 · JICT（UTC1）',106.893056,-6.097778],
  ['Jakarta · NPCT1','雅加达 · NPCT1',106.92,-6.094167],
 ]},
 philippines: {id:'608', ports:[
  ['Manila North','马尼拉北港',120.955,14.607,'MANILA NORTH'],
  ['Manila South','马尼拉南港',120.966944,14.586389,'MANILA SOUTH'],
 ]},
 vietnam: {id:'704', ports:[['Ho Chi Minh City · Cat Lai','胡志明市 · 卡莱',106.791,10.759,'HOCHIMINH CAT LAI']]},
 malaysia: {id:'458', bounds:[98,0,106,7.7], ports:[
  ['Port Klang · Westports','巴生港 · 西港',101.295,2.935,'PORT KELANG WEST'],
  ['Port Klang · Northport','巴生港 · 北港',101.357222,3.037222,'PORT KELANG NORTH'],
 ]},
 'south-africa': {id:'710', ports:[
  ['Durban','德班',31.03,-29.88],
  ['Johannesburg','约翰内斯堡',28.05,-26.20],
 ]},
 singapore: {id:'702', bounds:[103.56,1.16,104.11,1.49], ports:[['Singapore','新加坡',103.776667,1.283333,'SINGAPORE']]},
 japan: {id:'392', ports:[['Tokyo','东京',139.78,35.62,'TOKYO']]},
 'south-korea': {id:'410', ports:[['Busan','釜山',129.03,35.10,'BUSAN']]},
 canada: {id:'124', bounds:[-132,45,-114,53], ports:[['Vancouver','温哥华',-123.10,49.29,'VANCOUVER,CA']]},
 australia: {id:'036', ports:[['Sydney · Port Botany','悉尼 · 博塔尼港',151.218,-33.974]]},
 italy: {id:'380', bounds:[6.4,40.7,14.7,46.6], ports:[
  ['Genoa','热那亚',8.95,44.4167],
  ['La Spezia','拉斯佩齐亚',9.8333,44.1],
 ]},
 morocco: {id:'504', bounds:[-10,30.5,-2.4,36.3], ports:[
  ['Tanger Med','丹吉尔地中海港',-5.50,35.89],
  ['Casablanca','卡萨布兰卡',-7.6167,33.6],
 ]},
 netherlands: {id:'528', ports:[['Rotterdam','鹿特丹',4.14,51.95]]},
 'united-kingdom': {id:'826', ports:[['Southampton','南安普敦',-1.44,50.91]]},
 france: {id:'250', bounds:[-5.4,41.2,9.8,51.5], ports:[['Le Havre','勒阿弗尔',0.16,49.48]]},
 spain: {id:'724', bounds:[-10,35.4,4.5,44.2], ports:[
  ['Valencia','瓦伦西亚',-0.32,39.44],
  ['Barcelona','巴塞罗那',2.148333,41.309722],
 ]},
 germany: {id:'276', ports:[['Hamburg','汉堡',9.92,53.52]]},
 colombia: {id:'170', ports:[['Cartagena · SPRC','卡塔赫纳 · SPRC',-75.534167,10.405833],['Cartagena · Contecar','卡塔赫纳 · Contecar',-75.51,10.376389]]},
 panama: {id:'591', ports:[['Balboa','巴尔博亚',-79.567,8.957],['Cristóbal','克里斯托瓦尔',-79.90,9.35]]},
 'costa-rica': {id:'188', ports:[['Caldera','卡尔德拉',-84.72,9.91],['Moín','莫因',-83.10,10.02]]},
 'ivory-coast': {id:'384', ports:[['Abidjan','阿比让',-4.0167,5.3333]]},
 senegal: {id:'686', ports:[['Dakar','达喀尔',-17.43,14.67]]},
 togo: {id:'768', ports:[['Lomé','洛美',1.28,6.14]]},
 benin: {id:'204', ports:[['Cotonou','科托努',2.44,6.35]]},
 cameroon: {id:'120', ports:[['Douala','杜阿拉',9.69,4.04]]},
 nigeria: {id:'566', ports:[['Apapa','阿帕帕',3.365,6.44],['Tin Can Island','廷坎岛',3.34,6.44]]},
 'saudi-arabia': {id:'682', placement:'route-planning', ports:[
  ['Jeddah','吉达',39.1667,21.4667],
  ['Dammam','达曼',50.208,26.498],
 ]},
 uae: {id:'784', placement:'route-planning', ports:[
  ['Jebel Ali','杰贝阿里',55.027,24.985],
  ['Khalifa Port','哈利法港',54.649444,24.8075],
 ]},
 kuwait: {id:'414', placement:'route-planning', ports:[
  ['Shuwaikh','舒韦赫',47.9333,29.35],
  ['Shuaiba','舒艾巴',48.154639,29.045833],
 ]},
 bahrain: {id:'048', bounds:[50.33,25.91,50.8,26.34], placement:'route-planning', ports:[
  ['Khalifa Bin Salman Port','哈利法·本·萨勒曼港',50.713333,26.185],
 ]},
 mexico: {id:'484', placement:'route-planning', ports:[
  ['Manzanillo','曼萨尼约',-104.3025,19.084722],
  ['Lázaro Cárdenas','拉萨罗卡德纳斯',-102.172778,17.974444],
 ]},
 brazil: {id:'076', bounds:[-56,-31,-30,-5], placement:'route-planning', ports:[
  ['Santos','桑托斯',-46.3167,-23.9333],
  ['Paranaguá','巴拉那瓜',-48.51,-25.50],
  ['Itajaí','伊塔雅伊',-48.66,-26.90],
  ['Navegantes','纳维根特斯',-48.662778,-26.896389],
  ['Suape','苏阿佩',-34.9675,-8.393056],
  ['Rio de Janeiro','里约热内卢',-43.207,-22.878],
 ]},
 argentina: {id:'032', bounds:[-65,-39,-53,-28], placement:'route-planning', ports:[
  ['Buenos Aires','布宜诺斯艾利斯',-58.36,-34.58],
 ]},
 chile: {id:'152', bounds:[-75,-38,-67,-28], placement:'route-planning', ports:[
  ['San Antonio','圣安东尼奥',-71.616667,-33.591667],
  ['Valparaíso','瓦尔帕莱索',-71.625833,-33.036944],
 ]},
 peru: {id:'604', ports:[['Callao','卡亚俄',-77.147,-12.055],['Chancay','钱凯',-77.27,-11.57]]},
};

const mapText: Record<Language, [string, string]> = {
 en:['Destination ports','Port locations are approximate. Confirm the terminal and charges for each shipment.'],
 zh:['目的地港口','港口位置为地理参考，实际卸货码头和费用按票确认。'],
 es:['Puertos de destino','Ubicaciones aproximadas. Confirme la terminal y los gastos de cada envío.'],
 fr:['Ports de destination','Positions approximatives. Confirmez le terminal et les frais pour chaque envoi.'],
 ru:['Порты назначения','Расположение портов ориентировочное. Уточните терминал и расходы для каждой отправки.'],
 ar:['موانئ الوجهة','مواقع الموانئ تقريبية. أكّد محطة التفريغ والتكاليف لكل شحنة.'],
 pt:['Portos de destino','Localização aproximada. Confirme o terminal e os custos de cada embarque.'],
 tr:['Varış limanları','Liman konumları yaklaşıktır. Terminali ve ücretleri her sevkiyat için doğrulayın.'],
};

export function countryGatewayLabels(country: string, locale: Language) {
 if (country === 'kazakhstan' && locale === 'ru') {
  return {
   title: 'Погранпереходы и города доставки',
   note: 'Переход и место выдачи уточняются для каждой отправки.',
   ports: kazakhstanLandmarks.map(({ coordinates: [longitude, latitude], labels: [, , ru] }) => ({
    name: ru, coordinates: [longitude, latitude] as [number, number],
   })),
  };
 }
 if (country === 'south-africa') {
  const c = southAfricaCopy[locale];
  return {
   title: c.mapTitle,
   note: c.mapNote,
   ports: countryGateways[country].ports.map(([, , longitude, latitude], i) => ({
    name: i === 0 ? c.durban : c.johannesburg,
    coordinates: [longitude, latitude] as [number, number],
   })),
  };
 }
 const [title, note] = mapText[locale];
 const ports = countryGateways[country].ports.map(([name, chinese, longitude, latitude, lookup], i) => ({
  name: isMediterraneanCountry(country)
   ? mediterraneanCopy[country][locale].ports[i]
   : (lookup && localizedPacificPort(lookup, locale)) || (locale === 'zh' ? chinese : name),
  coordinates: [longitude, latitude] as [number, number],
 }));
 return {title, note, ports};
}
