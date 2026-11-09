import { caseFactoryFor } from './case-factory-copy.mjs';
import { mobilePages } from './routes.mjs';
import { pages, ui } from './locales.mjs';
import { copyFor,mobileProducts } from './catalog.mjs';
import { localizedProductPath } from '../../lib/productLocalization.mjs';
export function mobileMetadata(id,locale='en'){
 const page=mobilePages.find(p=>p.id===id),copy=pages[id],base='https://www.ddnzglobal.com';const path=localizedProductPath(page.path,locale);
 const description = id==='hub' && locale==='en' ? 'DDNZ factory-made phone cases and screen protectors with complementary accessories. Request a wholesale quote by model, quantity and packaging.' : id==='cases'?caseFactoryFor(locale).description:copyFor(copy.desc,locale);
 const productsBreadcrumb = id === 'hub' && (locale === 'en' || locale === 'fr')
   ? [{name:copyFor(ui.products,locale),item:base+localizedProductPath('/products',locale)}]
   : [];
 const schema={'@context':'https://schema.org','@graph':[
 {'@type':'WebPage','@id':base+path+'#webpage',url:base+path,name:copyFor(copy.title,locale),description,inLanguage:locale,primaryImageOfPage:{'@type':'ImageObject',url:base+copy.image}},
 {'@type':'BreadcrumbList',itemListElement:[{name:copyFor(ui.home,locale),item:base+(locale==='en'?'/':`/${locale==='zh'?'zh-cn':locale}/`)},...productsBreadcrumb,{name:copyFor(ui.hub,locale),item:base+localizedProductPath('/sourcing/mobile-accessories-from-china',locale)},...(id==='hub'?[]:[{name:copyFor(ui[id],locale),item:base+path}])].map((x,i)=>({'@type':'ListItem',position:i+1,...x}))},
 ]};
 if(id==='cases'||id==='straps')schema['@graph'].push({'@type':'ItemList',name:id==='cases'?caseFactoryFor(locale).heading:copyFor(copy.heading,locale),itemListElement:mobileProducts.filter(p=>p.group===id).map((p,i)=>({'@type':'ListItem',position:i+1,name:copyFor(p.name,locale),url:base+path+'#style-'+p.id}))});
 return {title:copyFor(copy.title,locale),description,image:copy.image,path,schema};
}
