import zh from './locales/zh.json';import es from './locales/es.json';import ar from './locales/ar.json';import ru from './locales/ru.json';import fr from './locales/fr.json';import pt from './locales/pt.json';import tr from './locales/tr.json';
import {foodPrefix,foodLanguages} from '../food-processing/localization';
export const refrigerationCopy={zh,es,ar,ru,fr,pt,tr};export type RefrigerationLocale=keyof typeof refrigerationCopy;
export const refrigerationPath='/refrigeration-equipment';
export const refrigerationAlternates=()=>foodLanguages.map(hrefLang=>({hrefLang,href:`https://www.ddnzglobal.com${foodPrefix(hrefLang)}${refrigerationPath}/`}));
export const refrigerationMeta=(locale:RefrigerationLocale)=>({title:`${refrigerationCopy[locale].title} | DDNZ`,description:refrigerationCopy[locale].intro});
export const videoHeading={zh:'生产与功能记录',es:'Registros de producción y funciones',ar:'سجلات الإنتاج والوظائف',ru:'Записи производства и функций',fr:'Documents de production et de fonctions',pt:'Registros de produção e funções',tr:'Üretim ve işlev kayıtları'};
export const refrigerationSchema=(locale:RefrigerationLocale)=>({'@context':'https://schema.org','@type':'CollectionPage',url:`https://www.ddnzglobal.com${foodPrefix(locale)}${refrigerationPath}/`,name:refrigerationCopy[locale].title,description:refrigerationCopy[locale].intro,inLanguage:locale==='zh'?'zh-CN':locale});
