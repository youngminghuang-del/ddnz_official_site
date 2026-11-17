import centralAfricaCopy from '../centralAfricaCopy.json';
import es from './es.json';import fr from './fr.json';import ru from './ru.json';import ar from './ar.json';import pt from './pt.json';import tr from './tr.json';
export const freightLocalizations={es,fr,ru,ar,pt,tr};
export const freightLocales=['en','zh','es','fr','ru','ar','pt','tr'];
export const localePrefix=l=>l==='en'?'':l==='zh'?'/zh-cn':`/${l}`;
const iso={ecuador:'EC','dominican-republic':'DO',togo:'TG',benin:'BJ',cameroon:'CM',panama:'PA','costa-rica':'CR',spain:'ES',germany:'DE',netherlands:'NL','united-kingdom':'GB',france:'FR',canada:'CA',australia:'AU',japan:'JP','south-korea':'KR',vietnam:'VN',malaysia:'MY',singapore:'SG',thailand:'TH',indonesia:'ID',philippines:'PH',colombia:'CO','ivory-coast':'CI',senegal:'SN',ghana:'GH',nigeria:'NG','saudi-arabia':'SA',uae:'AE',kuwait:'KW',qatar:'QA',oman:'OM',bahrain:'BH',india:'IN',pakistan:'PK',bangladesh:'BD',mexico:'MX',brazil:'BR',argentina:'AR',peru:'PE',chile:'CL',russia:'RU',kazakhstan:'KZ',kyrgyzstan:'KG',uzbekistan:'UZ',tajikistan:'TJ',turkmenistan:'TM'};
const regions={es:['Oriente Medio','África Occidental','América Latina','Asia Central',"América Central","Europa"],fr:['Moyen-Orient','Afrique de l’Ouest','Amérique latine','Asie centrale',"Amérique centrale","Europe"],ru:['Ближний Восток','Западная Африка','Латинская Америка','Центральная Азия',"Центральная Америка","Европа"],ar:['الشرق الأوسط','غرب أفريقيا','أمريكا اللاتينية','آسيا الوسطى',"أمريكا الوسطى","أوروبا"],pt:['Oriente Médio','África Ocidental','América Latina','Ásia Central',"América Central","Europa"],tr:['Orta Doğu','Batı Afrika','Latin Amerika','Orta Asya',"Orta Amerika","Avrupa"]};
export function localizedDestination(slug,locale){if(slug==="central-africa")return centralAfricaCopy[locale]?.name||"";if(iso[slug])return new Intl.DisplayNames([locale],{type:'region'}).of(iso[slug]);return regions[locale]?.[['middle-east','west-africa','latin-america','central-asia','central-america','europe'].indexOf(slug)]||'';}
export const feeKeys=['BUNKER ADJUSTMENT FACTOR','THC','SEAL CHARGE','EQUIPMENT INTERCHANGE RECEIPT','DOC FEE','TELEX RELEASE FEE','INTERNATIONAL SHIP AND PORT FACILITY SECURITY','AMS FEE','DHC','BOOKING FEE','CONGESTION FEE','DDC CHARGE','ELECTRONIC DATA INTERCHARGE','ELECTRONIC PACKING LIST CHARGE','ENS','TANK FEE','VGM FEE'];
const extraFees={"en": {"Suez Canal Surcharge": "Suez Canal surcharge"}, "zh": {"Suez Canal Surcharge": "苏伊士运河附加费"}, "es": {"Suez Canal Surcharge": "Recargo del canal de Suez"}, "ar": {"Suez Canal Surcharge": "رسم قناة السويس الإضافي"}, "fr": {"Suez Canal Surcharge": "Supplément canal de Suez"}, "ru": {"Suez Canal Surcharge": "Сбор за Суэцкий канал"}, "pt": {"Suez Canal Surcharge": "Adicional do Canal de Suez"}, "tr": {"Suez Canal Surcharge": "Süveyş Kanalı ek ücreti"}};
const pacificFees = {
 'ADVANCED FILING RULE(MBL)': {en:'Japan advance filing for master B/L (AFR)',zh:'日本预申报费（主提单 AFR）',es:'Declaración anticipada en Japón (MBL, AFR)',fr:'Déclaration anticipée au Japon (MBL, AFR)',ru:'Предварительная подача в Японии (MBL, AFR)',ar:'رسم البيان المسبق لليابان (MBL، AFR)',pt:'Declaração antecipada no Japão (MBL, AFR)',tr:'Japonya ön bildirim ücreti (MBL, AFR)'},
 'CARBON TAX SURCHARGE': {en:'Carrier carbon surcharge',zh:'承运人碳附加费',es:'Recargo de carbono del transportista',fr:'Supplément carbone du transporteur',ru:'Углеродная надбавка перевозчика',ar:'رسم الكربون الإضافي للناقل',pt:'Adicional de carbono do transportador',tr:'Taşıyıcının karbon ek ücreti'},
 'ACI FEE': {en:'Advance Commercial Information fee (ACI)',zh:'加拿大预申报费（ACI）',es:'Cargo por declaración anticipada (ACI)',fr:'Frais de déclaration préalable (ACI)',ru:'Сбор за предварительное информирование (ACI)',ar:'رسم المعلومات التجارية المسبقة (ACI)',pt:'Taxa de declaração antecipada (ACI)',tr:'Ön ticari bilgi ücreti (ACI)'},
 'SERVICE CHARGE': {en:'Service charge',zh:'服务费',es:'Cargo por servicio',fr:'Frais de service',ru:'Сервисный сбор',ar:'رسم الخدمة',pt:'Taxa de serviço',tr:'Hizmet ücreti'},
 'UNLABELLED FEE': {en:'Fee name to confirm',zh:'费用名称待确认',es:'Concepto del cargo por confirmar',fr:'Libellé des frais à confirmer',ru:'Наименование сбора уточняется',ar:'اسم الرسم قيد التأكيد',pt:'Nome da taxa a confirmar',tr:'Ücret adı teyit edilecek'},
};
export const localizedExtraFee = (name,locale)=>pacificFees[name]?.[locale] ?? extraFees[locale]?.[name];
export function localizedFee(name,locale){const extra=localizedExtraFee(name,locale);if(extra)return extra;if(name==='DOCUMENTS FEE')name='DOC FEE';const index=feeKeys.indexOf(name);return index<0?name:freightLocalizations[locale]?.door.fees[index]||name;}
export function localizedCutoff(text,locale){const keys=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];const fmt=new Intl.DateTimeFormat(locale,{weekday:'short',timeZone:'UTC'});const days=Object.fromEntries(keys.map((k,i)=>[k,fmt.format(new Date(Date.UTC(2020,0,6+i)))]));return text.replace(/^cutting\/ETD[：:]\s*/,freightLocalizations[locale].extra.cutoff+': ').replace(/\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/g,k=>days[k]);}

export const pacificPorts = {
 'LAEM CHABANG': {en:'Laem Chabang',zh:'林查班',es:'Laem Chabang',fr:'Laem Chabang',ru:'Лаемчабанг',ar:'ليم تشابانغ',pt:'Laem Chabang',tr:'Laem Chabang'},
 JAKARTA: {en:'Jakarta',zh:'雅加达',es:'Yakarta',fr:'Jakarta',ru:'Джакарта',ar:'جاكرتا',pt:'Jacarta',tr:'Cakarta'},
 MANILA: {en:'Manila',zh:'马尼拉',es:'Manila',fr:'Manille',ru:'Манила',ar:'مانيلا',pt:'Manila',tr:'Manila'},
 'MANILA NORTH': {en:'Manila North',zh:'马尼拉北港',es:'Puerto Norte de Manila',fr:'Manille Nord',ru:'Северный порт Манилы',ar:'ميناء مانيلا الشمالي',pt:'Porto Norte de Manila',tr:'Manila Kuzey Limanı'},
 'MANILA SOUTH': {en:'Manila South',zh:'马尼拉南港',es:'Puerto Sur de Manila',fr:'Manille Sud',ru:'Южный порт Манилы',ar:'ميناء مانيلا الجنوبي',pt:'Porto Sul de Manila',tr:'Manila Güney Limanı'},
 GUAYAQUIL: {en:'Guayaquil',zh:'瓜亚基尔',es:'Guayaquil',fr:'Guayaquil',ru:'Гуаякиль',ar:'غواياكيل',pt:'Guayaquil',tr:'Guayaquil'},
 POSORJA: {en:'Posorja',zh:'波索尔哈',es:'Posorja',fr:'Posorja',ru:'Посорха',ar:'بوسورخا',pt:'Posorja',tr:'Posorja'},
 CAUCEDO: {en:'Caucedo',zh:'考塞多',es:'Caucedo',fr:'Caucedo',ru:'Кауседо',ar:'كاوسيدو',pt:'Caucedo',tr:'Caucedo'},
 'HOCHIMINH CAT LAI': {en:'Ho Chi Minh City · Cat Lai',zh:'胡志明市 · 卡莱',es:'Ciudad Ho Chi Minh · Cat Lai',fr:'Hô Chi Minh-Ville · Cat Lai',ru:'Хошимин · Катлай',ar:'مدينة هو تشي منه · كات لاي',pt:'Cidade de Ho Chi Minh · Cat Lai',tr:'Ho Chi Minh Şehri · Cat Lai'},
 'PORT KELANG': {en:'Port Klang',zh:'巴生港',es:'Puerto Klang',fr:'Port Klang',ru:'Порт-Кланг',ar:'ميناء كلانغ',pt:'Port Klang',tr:'Klang Limanı'},
 'PORT KELANG WEST': {en:'Port Klang · Westports',zh:'巴生港 · 西港',es:'Puerto Klang · Westports',fr:'Port Klang · Westports',ru:'Порт-Кланг · Westports',ar:'ميناء كلانغ · ويستبورتس',pt:'Port Klang · Westports',tr:'Klang Limanı · Westports'},
 'PORT KELANG NORTH': {en:'Port Klang · Northport',zh:'巴生港 · 北港',es:'Puerto Klang · Northport',fr:'Port Klang · Northport',ru:'Порт-Кланг · Northport',ar:'ميناء كلانغ · نورثبورت',pt:'Port Klang · Northport',tr:'Klang Limanı · Northport'},
 SINGAPORE: {en:'Singapore',zh:'新加坡',es:'Singapur',fr:'Singapour',ru:'Сингапур',ar:'سنغافورة',pt:'Singapura',tr:'Singapur'},
 TOKYO: {en:'Tokyo',zh:'东京',es:'Tokio',fr:'Tokyo',ru:'Токио',ar:'طوكيو',pt:'Tóquio',tr:'Tokyo'},
 BUSAN: {en:'Busan',zh:'釜山',es:'Busan',fr:'Busan',ru:'Пусан',ar:'بوسان',pt:'Busan',tr:'Busan'},
 'VANCOUVER,CA': {en:'Vancouver',zh:'温哥华',es:'Vancouver',fr:'Vancouver',ru:'Ванкувер',ar:'فانكوفر',pt:'Vancouver',tr:'Vancouver'},
 SYDNEY: {en:'Sydney',zh:'悉尼',es:'Sídney',fr:'Sydney',ru:'Сидней',ar:'سيدني',pt:'Sydney',tr:'Sydney'},
};
const terminalPrefixes = ['JAKARTA ', 'LAEM CHABANG '];
export const localizedPacificPort = (port, locale) => {
 const localized = pacificPorts[port]?.[locale];
 if (localized) return localized;
 const prefix = terminalPrefixes.find(value => port.startsWith(value));
 if (prefix) return `${pacificPorts[prefix.trim()][locale]} · ${port.slice(prefix.length)}`;
};
