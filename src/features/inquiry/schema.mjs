import { intentCopy } from './copy.mjs';
import { resolveSeoTitle } from '../../lib/seoTitle.mjs';
const ORIGIN = 'https://www.ddnzglobal.com';
const kinds = [
 ['Product Sourcing', 'product-sourcing', 2],
 ['Supplier Inspection & Consolidation', 'inspection-consolidation', 4],
 ['Freight Export', 'international-freight', 6],
];
export function inquiryPageSchema(language = 'en', intent = null) {
 const lang = language === 'zh-cn' ? 'zh' : language;
 const locale = Object.hasOwn(intentCopy, lang) ? lang : 'en';
 const path = `${locale === 'en' ? '' : '/' + (locale === 'zh' ? 'zh-cn' : locale)}/get-a-quote/`;
 const url = ORIGIN + path, copy = intentCopy[locale];
 const selected = intent === 'Freight Only' ? 'Freight Export' : intent;
 const services = kinds.filter(([goal]) => !selected || goal === selected).map(([goal, id, index]) => ({
  '@type': 'Service', '@id': `${url}#${id}`, name: copy[index], description: copy[index+1],
  provider: {
   '@type': 'Organization',
   '@id': `${ORIGIN}/#${goal === 'Freight Export' ? 'freight-executor' : 'organization'}`,
   name: goal === 'Freight Export' ? 'Heaven Born International Freight (Guangzhou) Co., Ltd.' : 'DDNZ Global Trade Co., Ltd.',
   url: ORIGIN + '/',
  },
  availableChannel: { '@type': 'ServiceChannel', serviceUrl: url },
 }));
 return { '@context': 'https://schema.org', '@graph': [
  { '@type': 'ContactPage', '@id': url, url, name: resolveSeoTitle(path, copy[0]),
    inLanguage: locale === 'zh' ? 'zh-CN' : locale,
    isPartOf: { '@type': 'WebSite', '@id': ORIGIN + '/#website' },
    about: services.map(service => ({ '@id': service['@id'] })),
  }, ...services,
 ] };
}
export function replaceInquirySchema(doc, schema) {
 // Clear the previous route's static or runtime graph before installing this page's graph.
 doc.querySelectorAll('script[type="application/ld+json"]').forEach(script => script.remove());
 const script = doc.createElement('script'); script.id = 'schema-jsonld-inquiry'; script.type = 'application/ld+json';
 script.textContent = JSON.stringify(schema).replace(/</g, '\\u003c'); doc.head.appendChild(script);
 return () => script.remove();
}
