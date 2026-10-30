import { resolveSeoTitle } from '../../lib/seoTitle.mjs';

/** Mirrors only the service presented by the six reviewed shared service pages. */
export function freightServiceSchema(path: string, language: string, meta: {title: string; desc: string}) {
  const origin = 'https://www.ddnzglobal.com';
  const locale = language === 'zh-cn' ? 'zh' : language;
  const prefix = locale === 'en' ? '' : '/' + (locale === 'zh' ? 'zh-cn' : locale);
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  const url = `${origin}${prefix}/${cleanPath}/`;
  const name = meta.title.replace(/\s*\|.*$/, '');
  return {'@context':'https://schema.org','@graph':[
    {'@type':'WebPage','@id':url,url,name:resolveSeoTitle(`${prefix}/${cleanPath}/`,meta.title),description:meta.desc,inLanguage:locale==='zh'?'zh-CN':locale,mainEntity:{'@id':url+'#service'}},
    {'@type':'Service','@id':url+'#service',url,name,description:meta.desc,serviceType:name,
      provider:{'@type':'Organization','@id':origin+(locale==='zh'?'/#heaven-born':'/#freight-executor'),name:locale==='zh'?'广州华正邦泰国际货运代理有限公司':'Heaven Born International Freight (Guangzhou) Co., Ltd.',url:origin+'/'},
      availableChannel:{'@type':'ServiceChannel',serviceUrl:`${origin}${prefix}/get-a-quote/`},
      mainEntityOfPage:{'@id':url}}
  ]};
}
