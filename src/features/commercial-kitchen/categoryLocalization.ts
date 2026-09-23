import zh from './locales/categories/zh.json';
import es from './locales/categories/es.json';
import ar from './locales/categories/ar.json';
import ru from './locales/categories/ru.json';
import fr from './locales/categories/fr.json';
import pt from './locales/categories/pt.json';
import tr from './locales/categories/tr.json';
import {kitchenCategories,categoryProducts} from './data/categories.mjs';
import {foodPrefix,foodLanguages} from '../food-processing/localization';
export const categoryCopy={zh,es,ar,ru,fr,pt,tr};
export type CategoryLocale=keyof typeof categoryCopy;
export const categoryAlternates=(path:string)=>foodLanguages.map(hrefLang=>({hrefLang,href:`https://www.ddnzglobal.com${foodPrefix(hrefLang)}${path}`}));
export function categoryMeta(category:any,locale:CategoryLocale){const i=kitchenCategories.indexOf(category),c=categoryCopy[locale];return {title:`${c.titles[i]} | DDNZ`,description:c.intros[i]};}
export function translatedCategorySchema(category:any,locale:CategoryLocale){const m=categoryMeta(category,locale),url=`https://www.ddnzglobal.com${foodPrefix(locale)}${category.path}`;return {'@context':'https://schema.org','@type':'CollectionPage',url,name:m.title,description:m.description,inLanguage:locale==='zh'?'zh-CN':locale,mainEntity:{'@type':'ItemList',itemListElement:categoryProducts(category).map((p:any,i:number)=>({'@type':'ListItem',position:i+1,name:p.model,url:`${url}#model-${p.id}`}))}};}
