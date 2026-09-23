import zh from './locales/zh.json' with {type:'json'};
import ru from './locales/ru.json' with {type:'json'};
import fr from './locales/fr.json' with {type:'json'};
import pt from './locales/pt.json' with {type:'json'};
import tr from './locales/tr.json' with {type:'json'};
import es from './locales/es.json' with {type:'json'};
import ar from './locales/ar.json' with {type:'json'};
export const translations={zh,ru,fr,pt,tr,es,ar};
export const localeCode=l=>l==='zh-cn'?'zh':l;
export const localePrefix=l=>localeCode(l)==='en'?'':`/${localeCode(l)==='zh'?'zh-cn':localeCode(l)}`;
const patternCache=new Map();
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export function translatedText(value,locale='en'){
 if(typeof value!=='string')return value;
 const lang=localeCode(locale),dict=translations[lang];if(!dict)return value;
 if(Object.hasOwn(dict,value))return dict[value];
 // Interpolate after translating the original template; never translate user input.
 if(!patternCache.has(lang))patternCache.set(lang,Object.keys(dict).filter(k=>/\{\w+\}/.test(k)).map(k=>{const keys=[...k.matchAll(/\{(\w+)\}/g)].map(m=>m[1]);const parts=k.split(/\{\w+\}/);return {regex:new RegExp('^'+parts.map(escape).join('([\\s\\S]*?)')+'$'),keys,template:dict[k]};}));
 for(const {regex,keys,template} of patternCache.get(lang)){const match=value.match(regex);if(match)return template.replace(/\{(\w+)\}/g,(all,key)=>{const i=keys.indexOf(key);return i<0?all:match[i+1];});}
 return value;
}
export function translatedTree(value,locale){if(typeof value==='string')return translatedText(value,locale);if(Array.isArray(value))return value.map(v=>translatedTree(v,locale));if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,(['id','href','path','file','poster','locale','dir','direction','numberLocale'].includes(k)||(k==='destination'&&typeof v==='string'&&/^[a-z-]+$/.test(v)))?v:translatedTree(v,locale)]));return value;}
