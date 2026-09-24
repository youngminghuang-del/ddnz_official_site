import en from './categories-locales/en.json';import zh from './categories-locales/zh.json';import es from './categories-locales/es.json';import ar from './categories-locales/ar.json';import ru from './categories-locales/ru.json';import fr from './categories-locales/fr.json';import pt from './categories-locales/pt.json';import tr from './categories-locales/tr.json';
import {buyerCopy,criterionIndices} from './buyer-guide';
import {audioCategoryPaths,audioCategoryRoot} from './category-routes.mjs';
import {foodPrefix} from '../food-processing/localization';
export const categoryCopy={en,zh,es,ar,ru,fr,pt,tr};
export type CategoryLanguage=keyof typeof categoryCopy;
export {audioCategoryPaths,audioCategoryRoot};
export function categoryIndex(path:string){return audioCategoryPaths.indexOf(path.replace(/^\/(zh-cn|es|ar|ru|fr|pt|tr)(?=\/)/,'').replace(/\/$/,''));}
export function audioCategoryMeta(index:number,locale:CategoryLanguage){const c=categoryCopy[locale];return {title:c.titles[index],description:c.intros[index],path:`${foodPrefix(locale)}${audioCategoryPaths[index]}/`};}
export function audioCategoryProducts(index:number,locale:CategoryLanguage){const c=buyerCopy[locale];return c.options[index].map((name,i)=>[name,c.checks[index][criterionIndices[index][i]][1]]);}
export function audioCategorySchema(index:number,locale:CategoryLanguage){const c=categoryCopy[locale],m=audioCategoryMeta(index,locale),url='https://www.ddnzglobal.com'+m.path;return {'@context':'https://schema.org','@graph':[
 {'@type':'CollectionPage','@id':url,name:m.title,description:m.description,url,inLanguage:locale==='zh'?'zh-CN':locale},
 {'@type':'BreadcrumbList',itemListElement:[{name:c.ui[0],item:'https://www.ddnzglobal.com'+foodPrefix(locale)+audioCategoryRoot+'/'},{name:c.names[index],item:url}].map((x,i)=>({'@type':'ListItem',position:i+1,...x}))},
 {'@type':'ItemList',itemListElement:audioCategoryProducts(index,locale).map(([name],i)=>({'@type':'ListItem',position:i+1,name,url:`${url}#product-${i+1}`}))}
]};}
