import { resolveSeoTitle } from '../../lib/seoTitle.mjs';

/** Mirrors only the service presented by the six reviewed shared service pages. */
export function freightServiceSchema(path: string, language: string, meta: {title: string; desc: string}) {
  const origin = 'https://www.ddnzglobal.com';
  const locale = language === 'zh-cn' ? 'zh' : language;
  const prefix = locale === 'en' ? '' : '/' + (locale === 'zh' ? 'zh-cn' : locale);
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  const url = `${origin}${prefix}/${cleanPath}/`;
  const name = meta.title.replace(/\s*\|.*$/, '');
  const ddp=cleanPath==='services/ddp-shipping-from-china';
  const breadcrumbId=url+'#breadcrumb';
  return {'@context':'https://schema.org','@graph':[
    {'@type':'WebPage','@id':url,url,name:resolveSeoTitle(`${prefix}/${cleanPath}/`,meta.title),description:meta.desc,inLanguage:locale==='zh'?'zh-CN':locale,mainEntity:{'@id':url+'#service'},...(ddp?{breadcrumb:{'@id':breadcrumbId}}:{})},
    {'@type':'Service','@id':url+'#service',url,name,description:meta.desc,serviceType:name,
      provider:{'@type':'Organization','@id':origin+((locale==='zh'||ddp)?'/#heaven-born':'/#freight-executor'),name:locale==='zh'?'广州华正邦泰国际货运代理有限公司':ddp?'Heaven Born (HB)':'Heaven Born International Freight (Guangzhou) Co., Ltd.',url:origin+'/'},
      availableChannel:{'@type':'ServiceChannel',serviceUrl:`${origin}${prefix}/get-a-quote/`},
      mainEntityOfPage:{'@id':url}},
    ...(ddp?[{'@type':'BreadcrumbList','@id':breadcrumbId,itemListElement:[{name:locale==='zh'?'首页':'Home',item:origin+prefix+'/'},{name:locale==='zh'?'国际货运服务':'International freight',item:origin+prefix+'/services/sea-freight/'},{name:locale==='zh'?'含税清关到门':'Duty-paid door delivery',item:url}].map((item,i)=>({'@type':'ListItem',position:i+1,...item}))}]:[])
  ]};
}
