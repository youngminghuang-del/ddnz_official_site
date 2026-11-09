import translations from './parts-locales.json';
import type {Language} from '../../i18n/translations';
import type products from './parts-catalogue.json';
export const partsLanguages:Language[]=['en','zh','ar','es','fr','ru','pt','tr'];
export const partsPrefix=(language:Language)=>language==='en'?'':language==='zh'?'/zh-cn':'/'+language;
export const partsLanguage=(pathname:string):Language=>pathname.startsWith('/zh-cn/')?'zh':partsLanguages.find(l=>l!=='en'&&l!=='zh'&&pathname.startsWith('/'+l+'/'))||'en';
export function partsText(language:Language,cn:string,en:string){return language==='zh'?cn:language==='en'?en:(translations[language].ui as Record<string,string>)[en]||en;}
export function partName(p:typeof products[number],language:Language){return language==='zh'?p.name.zh:language==='en'?p.name.en:(translations[language].names as Record<string,string>)[p.slug]||p.name.en;}
export function partSpec(p:typeof products[number],language:Language){
 if(p.slug==='front-caliper')return partsText(language,'供应商列 G3 右前／A1 右前左后，需确认安装位','Supplier lists G3 right-front / A1 right-front and left-rear; confirm mounting position');
 if(p.slug==='rear-caliper')return partsText(language,'右后','Right rear');
 if(p.slug==='brake-disc')return partsText(language,'140 mm · 6孔','140 mm · 6 holes');
 if(p.slug==='motor-wheel')return partsText(language,'10 × 2.75–6.5（图示）','10 × 2.75–6.5 (pictured)');
 return p.spec;
}
export const partsAlternates=partsLanguages.map(language=>({hrefLang:language==='zh'?'zh-cn':language,href:`https://www.ddnzglobal.com${partsPrefix(language)}/sourcing/electric-scooter-spare-parts-from-china/`}));
export function partsMetadata(language:Language){return {title:partsText(language,'中国电动滑板车配件批发 · KuKirin G2/G3/G4 | DDNZ','Wholesale Electric Scooter Spare Parts from China | DDNZ'),desc:partsText(language,'选购适配 KuKirin G2、G3、G4 的滑板车维修配件，按车型、部件和数量整理批发询价。轮胎、制动、电控、显示组件与车身配件分别匹配。','Source replacement parts compatible with KuKirin G2, G3 and G4 from China. Select tyres, brakes, controls, displays and fittings for a model-specific wholesale quote.'),keywords:'',image:'/images/scooter-parts/motor-wheel.webp'};}
