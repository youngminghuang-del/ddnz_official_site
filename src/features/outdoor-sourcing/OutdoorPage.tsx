import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import Footer from '../../components/Footer';
import LegalModal, { type LegalType } from '../../components/LegalModal';
import { productAlternates, productRouteParts, powerGuidePath } from '../../lib/productLocalization.mjs';
import { outdoorCategoryFromSearch, outdoorCategorySearch } from './navigation.mjs';
import { OUTDOOR_PATH } from './catalog.mjs';
import { outdoorMetadata, powerGuideMetadata } from './seo.mjs';
import { powerGuideEvent } from './power-draft.mjs';
import { outdoorEvent } from './buying.mjs';
import { trackEvent } from '../../lib/analytics';
import OutdoorContent from './OutdoorContent.jsx';
import PowerGuideContent from './PowerGuideContent.jsx';
import './outdoor.css';
import './power-guide.css';
export default function OutdoorPage({guide=false}:{guide?:boolean}){
 const location=useLocation(),navigate=useNavigate();
 const category=outdoorCategoryFromSearch(location.search);
 const changeCategory=(value:string,hash:string)=>navigate({pathname:location.pathname,search:outdoorCategorySearch(window.location.search,value),hash});
 const locale=productRouteParts(location.pathname).locale as 'en'|'es'|'ar',meta=guide?powerGuideMetadata(locale):outdoorMetadata(locale),[legal,setLegal]=useState<LegalType>(null);
 useEffect(()=>{document.getElementById('schema-jsonld-static-page')?.remove();const node=document.createElement('script');node.id='schema-jsonld-outdoor';node.type='application/ld+json';node.textContent=JSON.stringify(meta.schema);document.head.appendChild(node);return()=>node.remove();},[locale,guide]);
 return <><SEO title={meta.title} description={meta.description} image={meta.image} canonicalPath={meta.path} contentLanguage={locale} alternateUrls={productAlternates(guide?powerGuidePath:OUTDOOR_PATH)}/><SourcingHomepageNav quotePath={(guide?outdoorMetadata(locale).path:meta.path)+'#buying-brief'}/><>{guide?<PowerGuideContent locale={locale} onAction={(action:string,details={})=>{const event=powerGuideEvent(locale,action,details);if(event)trackEvent(event.event,event.params);}}/>:<OutdoorContent locale={locale} category={category} onCategoryChange={changeCategory} onPrivacy={()=>setLegal('privacy')} onAction={(action:string)=>{const event=outdoorEvent(locale,action);if(event)trackEvent(event.event,event.params);}}/>}</><Footer quotePath={(guide?outdoorMetadata(locale).path:meta.path)+'#buying-brief'} pageKey="outdoor-sourcing"/><LegalModal type={legal} onClose={()=>setLegal(null)}/></>;
}
