import {useState} from 'react';
import {CatalogueCard} from '../electric-mobility/CatalogueCard';
import common from '../home-storage/locales.json';
import copies from './locales.json';
import type {Language} from '../../i18n/translations';
const variants=[
 {code:'HM-2435-T',voltage:'24 V',power:'350 W',tyre:true},
 {code:'HM-3650-T',voltage:'36 V',power:'500 W',tyre:true},
 {code:'HM-4850-T',voltage:'48 V',power:'500 W',tyre:true},
 {code:'HM-3650-M',voltage:'36 V',power:'500 W',tyre:false},
 {code:'HM-4850-M',voltage:'48 V',power:'500 W',tyre:false},
];
export default function CatalogueSupplement({language='en',kind}:{language?:Language;kind:'wagon'|'motor'}){
 language=(language as string)==='zh-cn'?'zh':language;
 const [selected,setSelected]=useState(0),c=copies[language]||copies.en,t=c[kind],v=variants[selected],isWagon=kind==='wagon';
 const assets=isWagon?['wagon-main','wagon-loading','wagon-folding','wagon-battery','wagon-wheel']:v.tyre?['hub-wheel','hub-bare','hub-angle','hub-connectors']:['hub-bare'];
 const values=isWagon?['250 W × 2','24 V','90 × 50 × 63 cm','50 × 30 × 63 cm','260 L',c.values[1],c.values[2],c.values[0],c.values[0],c.values[0]]:[v.voltage,v.power,c.values[3],c.values[4],'10″',c.values[v.tyre?5:6],c.values[0],c.values[0],c.values[0],c.values[0]];
 const title=isWagon?c.wagon.name:`${c.motor.name} · ${v.voltage} · ${v.power}`;
 const label=isWagon?c.wagon.label:c.values[v.tyre?5:6];
 const product={id:isWagon?1:selected+1,code:isWagon?'CW-01':v.code,category:kind,title,enTitle:isWagon?title:`${title} · ${label}`,label,enLabel:label,specs:t.fields.map((f,i)=>[f,values[i]]),enSpecs:t.fields.map((f,i)=>[f,values[i]]),gallery:assets.map(asset=>{const n=isWagon?assets.indexOf(asset):['hub-wheel','hub-bare','hub-angle','hub-connectors'].indexOf(asset);return {web:`/images/catalogue-additions/${asset}.webp`,thumb:`/images/catalogue-additions/${asset}-thumb.webp`,title:t.images[n],enTitle:t.images[n],kind:'产品图片'};})};
 const id=isWagon?'camping-wagon':'scooter-hub-motors';
 return <div className="mobility-page catalogue-supplement" lang={language==='zh'?'zh-CN':language} dir={language==='ar'?'rtl':'ltr'}><section id={id} aria-labelledby={`${id}-heading`}><h2 id={`${id}-heading`}>{t.heading}</h2><p className="supplement-intro">{t.intro}</p>{!isWagon&&<label className="supplement-selector"><span>{c.choose}</span><select value={selected} onChange={e=>setSelected(Number(e.target.value))}>{variants.map((x,i)=><option key={x.code} value={i}>{x.voltage} · {x.power} · {c.values[x.tyre?5:6]}</option>)}</select></label>}<CatalogueCard key={isWagon?'wagon':v.code} product={product} zh={language==='zh'} language={language} ui={language==='en'||language==='zh'?undefined:common[language].ui} note={t.note} source={isWagon?'camping_wagon_catalogue':'scooter_hub_motor_catalogue'}/></section></div>;
}
