import { OUTDOOR_PATH, outdoorProducts, copy } from './catalog.mjs';
import { ui } from './copy.mjs';
import { guideUI } from './guide-copy.mjs';
import { localizedProductPath, powerGuidePath } from '../../lib/productLocalization.mjs';
export function outdoorMetadata(locale='en'){
 const path=localizedProductPath(OUTDOOR_PATH,locale),base='https://www.ddnzglobal.com',title=copy(ui.title,locale),description=copy(ui.description,locale),image='/outdoor-sourcing-media/outdoor-camp.webp';
 return {path,title,description,image,schema:{'@context':'https://schema.org','@graph':[
  {'@type':'WebPage','@id':base+path+'#webpage',url:base+path,name:title,description,inLanguage:locale,primaryImageOfPage:{'@type':'ImageObject',url:base+image}},
  {'@type':'BreadcrumbList',itemListElement:[{name:copy(ui.home,locale),item:base+(locale==='en'?'/':`/${locale==='zh'?'zh-cn':locale}/`)},{name:copy(ui.products,locale),item:base+localizedProductPath('/products',locale)},{name:copy(ui.heading,locale),item:base+path}].map((item,i)=>({'@type':'ListItem',position:i+1,...item}))},
  {'@type':'ItemList',name:copy(ui.range,locale),itemListElement:outdoorProducts.map((p,i)=>({'@type':'ListItem',position:i+1,name:p.model+' · '+copy(p.name,locale),url:base+path+'#product-'+p.id}))},
 ]}};
}

export function powerGuideMetadata(locale='en'){
 const path=localizedProductPath(powerGuidePath,locale),base='https://www.ddnzglobal.com',title=copy(guideUI.title,locale),description=copy(guideUI.description,locale),image='/outdoor-sourcing-media/power-guide-share-v1.jpg';
 return {path,title,description,image,schema:{'@context':'https://schema.org','@graph':[
  {'@type':'WebPage','@id':base+path+'#webpage',url:base+path,name:title,description,inLanguage:locale},
  {'@type':'BreadcrumbList',itemListElement:[{name:copy(ui.home,locale),item:base+(locale==='en'?'/':`/${locale==='zh'?'zh-cn':locale}/`)},{name:copy(ui.heading,locale),item:base+localizedProductPath(OUTDOOR_PATH,locale)},{name:copy(guideUI.eyebrow,locale),item:base+path}].map((item,i)=>({'@type':'ListItem',position:i+1,...item}))},
 ]}};
}
