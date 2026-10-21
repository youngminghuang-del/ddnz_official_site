import {useState} from 'react';
import {useLocation} from 'react-router-dom';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import {buildQuoteHref} from '../../lib/quoteLinks';
import {CatalogueCard} from '../electric-mobility/ElectricScootersPage';
import catalogue from './catalogue.json';
import './home-storage.css';
import LocalizedStoragePage,{storageAlternates,storageLanguages} from './LocalizedStoragePage';

export const storagePath='/sourcing/home-energy-storage-from-china';
function StorageRange({product:p,zh}:{product:typeof catalogue[number];zh:boolean}){
 const [selected,setSelected]=useState(0),variant=p.variants?.[selected];
 const product=variant?{...p,code:p.code+'-'+variant.code,specs:variant.specs,enSpecs:variant.enSpecs,enTitle:p.enTitle+' · '+variant.label,title:p.title+' · '+variant.label.replace('modules', '模块')}:p;
 return <section className="storage-range" id={p.code.toLowerCase()} aria-label={zh?p.title:p.enTitle}>
  {p.variants&&<label className="storage-configuration" htmlFor={p.code+'-configuration'}><span>{zh?'选择此系列配置':'Choose a configuration'}</span><select id={p.code+'-configuration'} value={selected} onChange={e=>setSelected(Number(e.target.value))}>{p.variants.map((v,i)=><option key={v.code} value={i}>{zh?v.label.replace('modules','模块'):v.label}</option>)}</select></label>}
  <CatalogueCard product={product} zh={zh} source="home_storage_catalogue"/>
  <p className="storage-scope">{p.id===1?(zh?'此款为51.2 V、100 Ah壁挂电池。逆变器、线缆及安装附件按订单配置。':'This wall-mounted battery is 51.2 V, 100 Ah. Inverter, cables and mounting accessories are configured for the order.'):p.id===2?(zh?'图片展示本系列不同模块与结构细节。单模块容量、安装支架和模块数量分别确认；多模块展示不代表单件包含整组。':'Images show module formats and construction details across the range. Specify the module capacity, mounting hardware and quantity separately; a group image does not define the unit supplied.'):(zh?'图片展示本系列外壳、接口和模块组合。电池模块数量、顶部控制单元、底座和配套逆变器分别列入报价。':'Images show the enclosure, connectors and module configurations in this range. The quotation lists battery modules, top control unit, base and matching inverter separately.')}</p>
 </section>;
}
export default function HomeStoragePage(){
 const pathname=useLocation().pathname, locale=pathname.split('/')[1];
 const zh=pathname.startsWith('/zh-cn/');
 if(['ru','fr','es','ar','pt','tr'].includes(locale)) return <LocalizedStoragePage language={locale as 'ru'|'fr'|'es'|'ar'|'pt'|'tr'}/>;
 const quote=buildQuoteHref({intent:'Product Sourcing',language:zh?'zh':'en',source:'home_storage_hero',industry:'Other',subcategory:'Home energy storage systems'});
 return <><SEO title={zh?'中国家庭储能电池批发与OEM定制 | DDNZ Global':'Wholesale Home Energy Storage Batteries from China | DDNZ Global'} description={zh?'比较壁挂、机柜及高压堆叠式磷酸铁锂储能电池，按电压、容量、逆变器匹配和出口包装向DDNZ询价。':'Compare wall-mounted, rack and high-voltage stackable LiFePO4 batteries from China. Request model-specific wholesale and OEM configurations.'} canonicalPath={`${zh?'/zh-cn':''}${storagePath}/`} contentLanguage={zh?'zh':'en'} image="/images/home-storage/hv-modules.webp" alternateUrls={storageAlternates}/><SourcingHomepageNav supportedLanguages={storageLanguages}/>
  <main id="main-content" className="mobility-page storage-page" lang={zh?'zh-CN':'en'}>
   <section className="mobility-hero storage-hero"><img className="storage-hero-image" src="/images/home-storage/hv-modules.webp" alt={zh?'家庭储能电池模块数量与扩展结构':'Home storage battery module configurations and expansion'} width="1916" height="821"/><div className="storage-hero-shade" aria-hidden="true"/><div className="storage-hero-copy"><p className="mobility-eyebrow">DDNZ GLOBAL · {zh?'中国制造与批发出口':'MANUFACTURING & EXPORT FROM CHINA'}</p><h1>{zh?'中国家庭储能电池批发与OEM定制':'Home energy storage batteries. Wholesale from China.'}</h1><p>{zh?'为进口商、经销商与储能安装商比较壁挂、机柜和高压堆叠电池。按电压、储电容量、逆变器型号与目标市场，配置您的产品订单。':'Compare wall-mounted, rack and high-voltage stackable batteries for importers, distributors and storage installers. Build your order around voltage, energy capacity, inverter model and destination market.'}</p><a href={quote} className="mobility-primary">{zh?'获取储能产品报价':'Get a storage battery quote'} ↗</a></div></section>
   <nav className="storage-jump" aria-label={zh?'储能电池类别':'Battery formats'}>{catalogue.map((p,i)=><a key={p.code} href={'#'+p.code.toLowerCase()}>{(zh?['壁挂式电池','低压机柜／堆叠电池','高压模块化电池']:['Wall-mounted batteries','Low-voltage rack / stackable','High-voltage modular batteries'])[i]} ↓</a>)}</nav>
   <div className="storage-intro"><h2>{zh?'先选电池架构，再匹配系统':'Choose the battery architecture. Match the system.'}</h2><p>{zh?'壁挂和低压机柜系列与高压堆叠系列分别匹配逆变器。电池容量不等于输出功率；报价同时确认电压范围、通信协议、所需模块及配套范围。':'Match wall-mounted and low-voltage rack batteries separately from high-voltage stacks. Stored energy is different from output power: confirm voltage range, communication, module count and the equipment included in the quotation.'}</p></div>
   <div className="storage-catalogue">{catalogue.map(p=><StorageRange key={p.id} product={p} zh={zh}/>)}</div>
   <section className="mobility-order"><p className="mobility-eyebrow">{zh?'批量采购与出口':'WHOLESALE & EXPORT'}</p><h2>{zh?'把系统需求变成可比较的产品订单':'Turn system requirements into a comparable order'}</h2><div className="mobility-order-grid">{(zh?[['配置与样品','提供目录编号、数量、目标储电量及逆变器品牌和型号，确认电池与系统的匹配要求。'],['OEM与供货范围','沟通品牌标识、外包装、说明书语言与连接附件。最小订购量、样品费用和生产交期按配置报价。'],['包装与国际运输','确认安装市场所需的产品测试资料、电池运输文件、单件包装尺寸和毛重，再安排交付。']]:[['Configuration & sample','Share catalogue codes, quantities, target energy capacity and the inverter make and model. Agree the battery-to-system requirements.'],['OEM & supply scope','Specify branding, packaging, manual languages and connection accessories. Minimum quantities, sample costs and production lead times are quoted for the configuration.'],['Packing & international freight','Confirm product test documents for the installation market, battery transport files, packed dimensions and gross weights before arranging delivery.']]).map(([h,b],i)=><article key={h}><span>0{i+1}</span><h3>{h}</h3><p>{b}</p></article>)}</div><a className="mobility-primary" href={quote}>{zh?'提交型号、数量与系统要求':'Send models, quantities and system requirements'} ↗</a></section>
  </main><Footer/>
 </>;
}
