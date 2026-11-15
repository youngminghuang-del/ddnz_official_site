import './components/shared-kitchen-list.css';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../../components/SEO';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import Footer from '../../components/Footer';
import { productAlternates, productRouteParts } from '../../lib/productLocalization.mjs';
import SteamCabinetContent from './SteamCabinetContent';
import { getSteamCabinetPage, steamCabinetSchema } from './data/steamCabinetPage.mjs';
import { steamCabinetPath } from './routes.mjs';
import ChineseCookingContent from './ChineseCookingContent';
import InductionCookingContent, { type InductionLocale } from './InductionCookingContent';
import { sharedKitchenListHref, useSharedKitchenList } from './components/SharedKitchenList';
import { getInductionPage, inductionPageSchema, chineseCookingSchema, zhHotCookingPage } from './data/inductionPage.mjs';
import './styles/kitchen.css';
import './styles/category.css';
import './styles/induction-catalogue.css';

export default function InductionCookingPage() {
  const { pathname, hash } = useLocation();
  const normalized = pathname.replace(/\/$/, '') + '/';
  const hotCooking = normalized === zhHotCookingPage.path;
  const route = productRouteParts(pathname);
  const steamCabinet = route.path === steamCabinetPath;
  const locale = route.locale as InductionLocale;
  const page = hotCooking ? zhHotCookingPage : steamCabinet ? getSteamCabinetPage(locale) : getInductionPage(locale);
  const sharedList = useSharedKitchenList(locale);
  const quotePath = sharedKitchenListHref(locale);

  useEffect(() => {
    document.getElementById('schema-jsonld-static-page')?.remove();
    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify(hotCooking ? chineseCookingSchema(zhHotCookingPage) : steamCabinet ? steamCabinetSchema(locale) : inductionPageSchema(locale));
    document.head.appendChild(schema);
    return () => schema.remove();
  }, [hotCooking, steamCabinet, locale]);

  useEffect(() => {
    if (!hash) return;
    const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  return <>
    <SEO title={page.title} description={page.description} image={page.image}
      canonicalPath={page.path} contentLanguage={locale}
      alternateUrls={productAlternates(page.path)}/>
    <SourcingHomepageNav quotePath={quotePath} supportedLanguages={hotCooking ? ['zh'] : undefined}/>
    {hotCooking
      ? <ChineseCookingContent page={zhHotCookingPage} onAdd={sharedList.add} count={sharedList.count} status={sharedList.status}/>
      : steamCabinet
        ? <SteamCabinetContent locale={locale} onAdd={sharedList.add} count={sharedList.count} status={sharedList.status}/>
        : <InductionCookingContent locale={locale} onAdd={sharedList.add} count={sharedList.count} status={sharedList.status}/>}
    <Footer quotePath={quotePath} pageKey="commercial_kitchen" description={page.description}/>
  </>;
}
