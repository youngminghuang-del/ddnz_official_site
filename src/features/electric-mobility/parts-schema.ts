import products from './parts-catalogue.json';
import {partsPrefix,partsText,partName,partsMetadata} from './parts-i18n';
import type {Language} from '../../i18n/translations';
export function partsSchema(language:Language='en'){
 const root='https://www.ddnzglobal.com',prefix=partsPrefix(language),url=`${root}${prefix}/sourcing/electric-scooter-spare-parts-from-china/`,t=(cn:string,en:string)=>partsText(language,cn,en);
 return {'@context':'https://schema.org','@graph':[
 {'@type':'CollectionPage','@id':url+'#page',url,name:language==='zh'?'中国电动滑板车配件批发':language==='en'?'Wholesale electric scooter spare parts from China':partsMetadata(language).title.split(' | ')[0],inLanguage:language==='zh'?'zh-CN':language,mainEntity:{'@id':url+'#parts'},breadcrumb:{'@id':url+'#breadcrumb'}},
 {'@type':'ItemList','@id':url+'#parts',numberOfItems:products.length,itemListElement:products.map((p,i)=>({'@type':'ListItem',position:i+1,name:`${p.id} · ${partName(p,language)}`,url:url+'#'+p.slug}))},
 {'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:[{name:t('首页','Home'),item:`${root}${prefix}/`},{name:t('电动滑板车','Electric scooters'),item:`${root}${prefix}/sourcing/electric-scooters-from-china/`},{name:t('配件批发','Spare parts'),item:url}].map((p,i)=>({'@type':'ListItem',position:i+1,...p}))}
 ]};
}
