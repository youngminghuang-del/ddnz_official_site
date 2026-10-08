import React, {useState} from 'react';
import {privacyCopy, privacy28} from './privacy28.mjs';
export default function Privacy28Feature({locale,selected,onSelect}){
 const c=privacyCopy[locale === "zh-cn" ? "zh" : locale]||privacyCopy.en;const [active,setActive]=useState(0);
 const images=['product','glass','packaging'];
 return <section className="ms-privacy28" id="privacy28-new" aria-labelledby="privacy28-title">
 <div className="ms-privacy28-gallery"><img className="ms-privacy28-main" src={'/images/product-showcase/mobile/privacy28-'+images[active]+'.jpg'} alt={c[1]+' — '+c[7+active]} width="790" height="911" loading="lazy"/>
 <div className="ms-privacy28-thumbs">{images.map((im,i)=><button key={im} type="button" aria-pressed={i===active} aria-label={c[7+i]} onClick={()=>setActive(i)}><img src={'/images/product-showcase/mobile/privacy28-'+im+'.jpg'} alt="" width="80" height="80" loading="lazy"/></button>)}</div></div>
 <div className="ms-privacy28-copy"><p className="ms-eyebrow">{c[0]}</p><h2 id="privacy28-title">{c[1]}</h2><p>{c[2]}</p><p className="ms-privacy28-price"><bdi>¥4.80</bdi> <span>{c[3]} · CNY</span></p><p className="ms-privacy28-moq">{c[4]}</p><button type="button" className="ms-button" aria-pressed={selected} onClick={()=>onSelect(privacy28.id)}>{selected?c[6]:c[5]} <span aria-hidden="true">{selected?'✓':'+'}</span></button></div>
 </section>;
}
