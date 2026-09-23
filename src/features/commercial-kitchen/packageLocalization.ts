import zh from './locales/packages/zh.json';
import es from './locales/packages/es.json';
import ar from './locales/packages/ar.json';
import ru from './locales/packages/ru.json';
import fr from './locales/packages/fr.json';
import pt from './locales/packages/pt.json';
import tr from './locales/packages/tr.json';
import {foodPrefix,foodLanguages} from '../food-processing/localization';
import {kitchenPackagePath,kitchenPackageScenarioPaths} from './routes.mjs';
import {allScenarios,libraryOrder} from './data/restaurant-scenarios.mjs';
export const packageCopy={zh,es,ar,ru,fr,pt,tr};
export type PackageLocale=keyof typeof packageCopy;
export const restaurantPackagePaths=[kitchenPackagePath,...kitchenPackageScenarioPaths];
export const packageAlternates=(path:string)=>foodLanguages.map(hrefLang=>({hrefLang,href:`https://www.ddnzglobal.com${foodPrefix(hrefLang)}${path}/`}));
export function packageMeta(path:string,locale:PackageLocale){const c=packageCopy[locale],index=libraryOrder.indexOf(path.split('/').pop());return {title:`${index<0?c.ui.title:c.ui.template.replace('{name}',c.scenarios[index].name)} | DDNZ`,description:index<0?c.ui.intro:`${c.ui.template.replace('{name}',c.scenarios[index].name)}. ${c.scenarios[index].summary}`};}
export function packageSchema(path:string,locale:PackageLocale){const m=packageMeta(path,locale),url=`https://www.ddnzglobal.com${foodPrefix(locale)}${path}/`;return {'@context':'https://schema.org','@type':'CollectionPage',url,name:m.title,description:m.description,inLanguage:locale==='zh'?'zh-CN':locale};}
export function packageInquiry(locale:PackageLocale,slug:string,destination:string,requirements:string){const c=packageCopy[locale],s=c.scenarios[libraryOrder.indexOf(slug)],base=allScenarios[slug];const notes=[c.ui.template.replace('{name}',s.name),s.summary,...s.equipment.map((v,i)=>`${base.equipment[i][0]}: ${v}`),c.ui.utilities,...s.utilities,c.ui.menu,requirements,c.ui.scope,c.ui.boundary].join('\n');return `${foodPrefix(locale)}/get-a-quote/?`+new URLSearchParams({leadGoal:'Product Sourcing',source:'restaurant_kitchen_package',industry:s.name,overviewBrief:notes,dest:destination,projectNeed:slug});}
