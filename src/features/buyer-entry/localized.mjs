import zh from './locales/zh.json' with {type:'json'};
import es from './locales/es.json' with {type:'json'};
import ar from './locales/ar.json' with {type:'json'};
import ru from './locales/ru.json' with {type:'json'};
import fr from './locales/fr.json' with {type:'json'};
import pt from './locales/pt.json' with {type:'json'};
import tr from './locales/tr.json' with {type:'json'};
import {link,wrap,cards,entryStyle,entryCards,requestEntry} from './content.mjs';
import {localizedProductPath} from '../../lib/productLocalization.mjs';
import {allScenarios,libraryOrder} from '../commercial-kitchen/data/restaurant-scenarios.mjs';
export const buyerEntryCopy={zh,es,ar,ru,fr,pt,tr};
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const localStyle=`<style>.buyer-entry[data-entry-locale]{text-align:start;scroll-margin-top:130px}.buyer-entry[data-entry-locale] h3{font-weight:700}.buyer-entry[data-entry-locale] .entry-request-button{max-width:100%;flex-shrink:1;gap:8px}.buyer-entry[data-entry-locale] .entry-request-button span{flex-shrink:0}.buyer-entry[dir="rtl"] a span[aria-hidden="true"]{display:inline-block;transform:scaleX(-1)}.buyer-entry[data-entry-locale] .buyer-entry-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.buyer-entry[data-entry-locale] .buyer-entry-grid article a{display:block}[id^="phone-product-"],[id^="machine-"],[id^="style-"]{scroll-margin-top:130px}.localized-entry-planner{border:1px solid #dce2e5;border-radius:12px;padding:24px}.localized-entry-planner>summary{cursor:pointer;font-size:20px;font-weight:700}.localized-entry-planner>div{display:grid;gap:32px;margin-top:24px}@media(min-width:1200px){.buyer-entry[data-entry-locale] .buyer-entry-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}@media(max-width:520px){.buyer-entry[data-entry-locale] .buyer-entry-grid{grid-template-columns:1fr}}</style>`;
const source={cases:'phone_cases',films:'screen_protector_planner',vegetables:'food_processing',refrigeration:'refrigeration_equipment_product',kitchen:'restaurant_kitchen_packages'};
const ids={cases:'case-materials',films:'film-buying-options',vegetables:'vegetable-jobs',refrigeration:'refrigeration-categories',kitchen:'kitchen-buying-paths'};
export function renderLocalizedEntry(kind,locale,scenarioCopy=[]){
 locale=locale==='zh-cn'?'zh':locale;
 const all=buyerEntryCopy[locale];if(!all||!all[kind])throw new Error(`Missing buyer entry: ${locale}/${kind}`);
 const c=all[kind],prefix=locale==='zh'?'/zh-cn':`/${locale}`,path=p=>localizedProductPath(p,locale);
 const view=name=>all.view.replace('{name}',name),larger=name=>all.larger.replace('{name}',name);
 const request=requestEntry(...c.request,kind==='cases'||kind==='films'?'Mobile Accessories':'Commercial Kitchen Equipment',c.scope,source[kind],`${prefix}/get-a-quote/`);
 const read=(heading,text,links)=>`<div class="entry-reading"><h3>${escape(heading)}</h3><p>${escape(text)}</p><div class="entry-reading-links">${links.map(([href,label])=>link(href,label)).join('')}</div></div>`;
 let body='';
 if(kind==='cases'){
  const anchors=['silicone-jmetec','clear-trendcomm','mesh-longan','folio-bida'];
  body=cards(c.names.map((name,i)=>[name,c.texts[i],'#style-'+anchors[i],view(c.links[i]),i===3?[['#style-fabric-feishile',view(c.links[4])]]:[]]));
 }
 if(kind==='films'){
  const product=id=>path('/screen-protectors/compare')+'#phone-product-'+id;
  const links=[[[product('titan-hd'),view('Titan HD')]],[[product('og28'),view('OG28')],[product('001'),view('001')],[product('titan-privacy'),view('Titan Privacy')]],[[product('titan-hd'),view('Titan HD')],[product('titan-privacy'),view('Titan Privacy')]]];
  body=entryCards(c.names.map((title,i)=>({title,text:c.texts[i],image:'/screen-protector-media/assets/'+['titan-hd.jpg','og28-privacy.jpg','titan-kit.jpg'][i],links:links[i]})))+read(c.edges[0],c.edges[1],[[path('/screen-protectors/guides/curved-glass'),c.edges[2]],[path('/screen-protectors/videos'),c.edges[3]]]);
 }
 if(kind==='vegetables'){
  body=entryCards(c.names.map((title,i)=>({title,text:c.texts[i],image:'/food-processing-media/'+['potato-peeler','vegetable-slicer','chopper'][i]+'.webp',links:[['#machine-'+['tp-350','dq-ps300-copper','sc-r22'][i],view(['TP-350','DQ-PS300','SC-R22'][i])]]})))+read(c.set[0],c.set[1],[[path('/sourcing/food-processing-machinery-from-china/packages/vegetables'),c.set[2]]]);
 }
 if(kind==='refrigeration'){
  const model=id=>path('/sourcing/commercial-kitchen-equipment-from-china')+'?model='+id+'#commercial-kitchen-equipment';
  const links=[[[model('cold-2'),view('GN650TNPro')],[model('cold-3'),larger('GN1410TNPro')]],[[model('cold-4'),view('GN650BTPro')],[model('cold-5'),larger('GN1410BTPro')]],[[model('cold-7'),view('GNT2MTNPro')]],[[model('cold-42'),view('LC-615M1F')]],[[path('/sourcing/commercial-ice-machines-from-china')+'#model-ice-49',view('HZB-50/AB')]]];
  body=entryCards(c.names.map((title,i)=>({title,text:c.texts[i],image:'/commercial-kitchen-media/'+['cold-2.webp','cold-4.webp','cold-7.webp','cold-42.webp','ice-49-studio-v2.png'][i],links:links[i]})));
 }
 if(kind==='kitchen'){
  if(scenarioCopy.length!==6)throw new Error('Six translated scenario descriptions are required');
  body=entryCards(libraryOrder.map((slug,i)=>{const s=allScenarios[slug];return {title:scenarioCopy[i].name,text:scenarioCopy[i].summary,image:s.isometric,brief:(s.footprint.match(/[\d,]+/)?.[0]||'')+' m²',briefLabel:all.briefLabel,links:[[path('/sourcing/restaurant-kitchen-packages-from-china/'+slug),s.isometric?all.concept:all.brief]]};}))+read(all.individualTitle,all.individualBody,['/sourcing/commercial-electric-fryers-from-china','/sourcing/commercial-electric-griddles-from-china','/refrigeration-equipment','/sourcing/food-processing-machinery-from-china'].map((p,i)=>[path(p),all.individualLinks[i]]));
 }
 return wrap(ids[kind],escape(c.title),entryStyle+localStyle+`<p>${escape(c.intro)}</p>`+body+request).replace('<section class="buyer-entry"',`<section class="buyer-entry" data-entry-locale="${locale}" lang="${locale==='zh'?'zh-CN':locale}" dir="${locale==='ar'?'rtl':'ltr'}"`);
}
