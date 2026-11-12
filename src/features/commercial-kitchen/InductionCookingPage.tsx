import './components/shared-kitchen-list.css';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../../components/SEO';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import Footer from '../../components/Footer';
import { productAlternates } from '../../lib/productLocalization.mjs';
import ChineseCookingContent from './ChineseCookingContent';
import InductionCookingContent from './InductionCookingContent';
import { sharedKitchenListHref, useSharedKitchenList } from './components/SharedKitchenList';
import { inductionPage, inductionPageSchema, chineseCookingSchema, zhInductionPage, zhHotCookingPage } from './data/inductionPage.mjs';
import './styles/kitchen.css';
import './styles/category.css';
import './styles/induction-catalogue.css';

export default function InductionCookingPage() {
  const { pathname, hash } = useLocation();
  const normalized = pathname.replace(/\/$/, '') + '/';
  const chinesePage = [zhInductionPage, zhHotCookingPage].find(page => page.path === normalized);
  const page = chinesePage || inductionPage;
  const locale = chinesePage ? 'zh' : 'en';
  const sharedList = useSharedKitchenList(locale);
  const quotePath = sharedKitchenListHref(locale);

  useEffect(() => {
    document.getElementById('schema-jsonld-static-page')?.remove();
    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify(chinesePage ? chineseCookingSchema(chinesePage) : inductionPageSchema());
    document.head.appendChild(schema);
    return () => schema.remove();
  }, [chinesePage]);

  useEffect(() => {
    if (!hash) return;
    const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  return <>
    <SEO title={page.title} description={page.description} image={page.image}
      canonicalPath={page.path} contentLanguage={locale}
      alternateUrls={productAlternates(page.path)}/>
    <SourcingHomepageNav quotePath={quotePath} supportedLanguages={chinesePage === zhHotCookingPage ? ['zh'] : ['en', 'zh']}/>
    {chinesePage
      ? <ChineseCookingContent page={chinesePage} onAdd={sharedList.add} count={sharedList.count} status={sharedList.status}/>
      : <InductionCookingContent onAdd={sharedList.add} count={sharedList.count} status={sharedList.status}/>}
    <Footer quotePath={quotePath} pageKey="commercial_kitchen" description={page.description}/>
  </>;
}
