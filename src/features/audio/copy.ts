import zh from './locales/zh.json';import es from './locales/es.json';import ar from './locales/ar.json';import ru from './locales/ru.json';import fr from './locales/fr.json';import pt from './locales/pt.json';import tr from './locales/tr.json';
import {foodPrefix,foodLanguages} from '../food-processing/localization';
export const audioCopy={zh,es,ar,ru,fr,pt,tr};export type AudioLocale=keyof typeof audioCopy;
export const audioPath='/sourcing/audio-speakers-from-china';
export const audioAlternates=()=>foodLanguages.map(hrefLang=>({hrefLang,href:`https://www.ddnzglobal.com${foodPrefix(hrefLang)}${audioPath}/`}));
export const audioMeta=(locale:AudioLocale)=>({title:`${audioCopy[locale].title} | DDNZ`,description:audioCopy[locale].intro});
export const videoHeading={zh:'生产与功能记录',es:'Registros de producción y funciones',ar:'سجلات الإنتاج والوظائف',ru:'Записи производства и функций',fr:'Documents de production et de fonctions',pt:'Registros de produção e funções',tr:'Üretim ve işlev kayıtları'};
export const audioSchema=(locale:AudioLocale)=>({'@context':'https://schema.org','@type':'CollectionPage',url:`https://www.ddnzglobal.com${foodPrefix(locale)}${audioPath}/`,name:audioCopy[locale].title,description:audioCopy[locale].intro,inLanguage:locale==='zh'?'zh-CN':locale});
