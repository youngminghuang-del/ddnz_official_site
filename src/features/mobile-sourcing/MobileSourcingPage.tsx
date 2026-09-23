import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../../components/SEO';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import Footer from '../../components/Footer';
import LegalModal, { type LegalType } from '../../components/LegalModal';
import { productAlternates, productRouteParts } from '../../lib/productLocalization.mjs';
import { mobilePageForPath } from './routes.mjs';
import { mobileMetadata } from './seo.mjs';
import { mobileJourneyAnalytics } from './buying.mjs';
import { trackEvent } from '../../lib/analytics';
import MobileContent from './MobileContent.jsx';
import './mobile-sourcing.css';
export default function MobileSourcingPage(){
 const {pathname}=useLocation(),page=mobilePageForPath(pathname)||{id:'hub',path:'/sourcing/mobile-accessories-from-china'},locale=productRouteParts(pathname).locale as 'en' | 'zh' | 'es' | 'ar' | 'ru' | 'fr' | 'pt' | 'tr';
 const meta=mobileMetadata(page.id,locale),[legal,setLegal]=useState<LegalType>(null);
 useEffect(()=>{document.getElementById('schema-jsonld-static-page')?.remove();const node=document.createElement('script');node.id='schema-jsonld-mobile';node.type='application/ld+json';node.textContent=JSON.stringify(meta.schema);document.head.appendChild(node);return()=>node.remove();},[page.id,locale]);
 return <><SEO title={meta.title} description={meta.description} image={meta.image} canonicalPath={meta.path} contentLanguage={locale} alternateUrls={productAlternates(page.path)}/><SourcingHomepageNav quotePath={meta.path+'#buying-brief'}/><MobileContent pageId={page.id} locale={locale} onPrivacy={()=>setLegal('privacy')} onAction={(action:string)=>{const payload=mobileJourneyAnalytics(locale,action);if(payload)trackEvent(payload.event,payload.params)}}/><Footer quotePath={meta.path+'#buying-brief'} pageKey="mobile-sourcing"/><LegalModal type={legal} onClose={()=>setLegal(null)}/></>;
}
