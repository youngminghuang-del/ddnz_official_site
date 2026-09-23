import zh from './locales/zh.json';
import es from './locales/es.json';
import ar from './locales/ar.json';
import ru from './locales/ru.json';
import fr from './locales/fr.json';
import pt from './locales/pt.json';
import tr from './locales/tr.json';
import { overviewCopy } from '../overview/copy';
import { machines, packages, selectionTotals, money, sourceDate } from './catalog.mjs';
import { categoryPages, foodPage } from './pages.mjs';
export const foodLocales = {zh,es,ar,ru,fr,pt,tr};
export type FoodLocale = keyof typeof foodLocales;
export const foodLanguages = ['en','zh-cn','es','ar','ru','fr','pt','tr'];
export const foodPrefix = (locale:string) => locale==='en'?'':`/${locale==='zh'?'zh-cn':locale}`;
const packageHeading = {zh:'从中国采购{name}设备组合',es:'Compre un conjunto de {name} de China',ar:'شراء مجموعة {name} من الصين',ru:'Купить комплект «{name}» из Китая',fr:'Achetez un ensemble « {name} » en Chine',pt:'Compre uma combinação de {name} da China',tr:'Çin’den {name} ekipman paketi satın alın'};
export function localizedFoodPage(path:string,locale:FoodLocale) {
 const page=foodPage(path); if(!page) return null;
 const c=foodLocales[locale], o=overviewCopy[locale];
 const categoryIndex=categoryPages.findIndex(item=>item.slug===page.category?.slug);
 const bundleIndex=packages.findIndex(item=>item.id===page.bundle?.id);
 const title=page.kind==='hub'?c.ui.title:page.kind==='category'?`${c.categories[categoryIndex][0]} · ${c.ui.source}`:packageHeading[locale].replace('{name}',o.packageNames[bundleIndex]);
 const intro=page.kind==='category'?c.categories[categoryIndex][1]:page.kind==='package'?`${o.packageDescriptions[bundleIndex]} ${c.ui.intro}`:c.ui.intro;
 return {...page,title,intro,categoryIndex,bundleIndex};
}
export function localizedFoodMeta(page:any,locale:FoodLocale) { return {title:`${page.title} | DDNZ Global`,description:page.intro,image:`/food-processing-media/${page.machines[0].image}.webp`}; }
export function foodAlternates(path:string) {return foodLanguages.map(hrefLang=>({hrefLang,href:`https://www.ddnzglobal.com${foodPrefix(hrefLang)}${path}/`}));}
export function localizedFoodSchema(page:any,locale:FoodLocale) {
 const c=foodLocales[locale],prefix=foodPrefix(locale),url=`https://www.ddnzglobal.com${prefix}${page.path}/`;
 return {'@context':'https://schema.org','@graph':[
 {'@type':'CollectionPage','@id':`${url}#page`,name:page.title,description:page.intro,url,inLanguage:locale==='zh'?'zh-CN':locale},
 {'@type':'BreadcrumbList',itemListElement:[{name:c.ui.products,item:`https://www.ddnzglobal.com${prefix}/products/`},{name:page.title,item:url}].map((item,i)=>({'@type':'ListItem',position:i+1,...item}))},
 {'@type':'ItemList',name:c.ui.catalogueTitle,itemListElement:page.machines.map((m:any,i:number)=>({'@type':'ListItem',position:i+1,name:`${m.model} ${c.names[machines.findIndex(item=>item.id===m.id)]}`,url:`${url}#machine-${m.id}`}))}
 ]};
}
export function localizedFoodInquiry(selection:Record<string,number>,destination:string,requirement:string,locale:FoodLocale) {
 const c=foodLocales[locale], t=selectionTotals(selection);
 const lines=machines.filter(m=>Number.isInteger(selection[m.id])&&selection[m.id]>0&&selection[m.id]<=99).map(m=>{const i=machines.indexOf(m),q=selection[m.id];return `${m.model} · ${c.names[i]} · ${c.variants[i]} × ${q}: ${money(m.price*q)}; ${c.ui.packing}: ${money(m.packing*q)}`;});
 const notes=[`${c.ui.priceList}: ${sourceDate}`, ...lines,`${c.ui.equipment}: ${money(t.equipment)}; ${c.ui.packing}: ${money(t.packing)}`,c.ui.exclude,requirement].filter(Boolean).join('\n');
 return `${foodPrefix(locale)}/get-a-quote/?`+new URLSearchParams({leadGoal:'Product Sourcing',industry:c.ui.catalogueTitle,source:'food_processing',productScope:lines.join('\n'),notes,dest:destination});
}
