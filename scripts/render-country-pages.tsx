import ElectricUtilityVehiclesPage from '../src/features/electric-utility-vehicles/ElectricUtilityVehiclesPage';
import ElectricTricyclesPage from '../src/features/electric-tricycles/ElectricTricyclesPage';
import HomeProductFaqs from '../src/components/HomeProductFaqs';
import HomeV2Preview from '../src/pages/HomeV2Preview';
import PortablePowerPage from '../src/features/portable-power-catalogue/PortablePowerPage';
import ElectricBicyclesPage from '../src/features/electric-bicycles/ElectricBicyclesPage';
import HomeStoragePage from '../src/features/home-storage/HomeStoragePage';
import ElectricScootersPage from '../src/features/electric-mobility/ElectricScootersPage';
import Partners from '../src/components/Partners';
import Footer from '../src/components/Footer';
import BrazilCountryPage from '../src/features/freight/BrazilCountryPage';
import WorldFreightMap from '../src/components/WorldFreightMap';
import GulfFreightPage from '../src/features/freight/GulfFreightPage';
import About from '../src/pages/About';
import Insights from '../src/components/Insights';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from '../src/contexts/LanguageContext';
import MiddleEast from '../src/pages/shipping-from-china-to-middle-east';
import CentralAsia from '../src/pages/shipping-from-china-to-central-asia';
import WestAfrica from '../src/pages/shipping-from-china-to-west-africa';
import LatinAmerica from '../src/pages/shipping-from-china-to-latin-america';
export function renderCountryPage(route: string) {
  const parts = route.split('/').filter(Boolean);
  const country = parts.at(-1)!.replace('shipping-from-china-to-', '');
  if (!['saudi-arabia','uae','kuwait','qatar','oman','bahrain','kazakhstan','uzbekistan','kyrgyzstan','tajikistan','turkmenistan','russia','nigeria','ghana','mexico','brazil','argentina','peru','chile'].includes(country)) throw new Error(`Unsupported country: ${country}`);
  const language = parts.length === 1 ? 'en' : parts[0] === 'zh-cn' ? 'zh' : parts[0];
  const Component = country==='brazil' && ['en','zh'].includes(language) ? BrazilCountryPage : ['qatar','oman'].includes(country) ? GulfFreightPage : ['saudi-arabia','uae','kuwait','qatar','oman','bahrain'].includes(country) ? MiddleEast
    : ['kazakhstan','uzbekistan','kyrgyzstan','tajikistan','turkmenistan','russia'].includes(country) ? CentralAsia
    : ['nigeria','ghana'].includes(country) ? WestAfrica : LatinAmerica;
  return renderToStaticMarkup(<HelmetProvider><MemoryRouter initialEntries={[route]}><LanguageProvider initialLanguage={language as any}><Component /></LanguageProvider></MemoryRouter></HelmetProvider>);
}

import SourcingHomepageHero from '../src/components/SourcingHomepageHero';
import HomeOneTeamBridge from '../src/components/HomeOneTeamBridge';
import CompanyIdentity from '../src/features/company-identity/CompanyIdentity';
import SourcingHomepageNav from '../src/components/SourcingHomepageNav';
import HowWeWork from '../src/pages/HowWeWork';
import GetAQuotePage from '../src/pages/get-a-quote';
import InsightsHub from '../src/pages/InsightsHub';
import LocalizedOverviewPage from '../src/pages/LocalizedOverviewPage';
import ProductsIndex from '../src/pages/product-showcase/ProductsIndex';
import SourcingServices from '../src/pages/product-showcase/SourcingServices';
import { getLocalizedHomeFaqs } from '../src/data/homeFaqData';

export function renderCorePage(route: string) {
  const match=route.match(/^\/(zh-cn|ru|fr|es|ar|pt|tr)(?=\/|$)/);
  const language=(match?.[1]==='zh-cn'?'zh':match?.[1] || 'en') as any;
  const relative=(match?route.slice(match[0].length):route).replace(/^\/+|\/+$/g,'');
  const home=<div className="ddnz-home min-h-screen overflow-x-hidden bg-[#fffefb] font-sans text-slate-900"><SourcingHomepageNav/><main><SourcingHomepageHero/><HomeOneTeamBridge/><WorldFreightMap language={language}/><HomeV2Preview embedded beforeFinal={<><Insights/><Partners/><HomeProductFaqs/></>}/></main><Footer/></div>;
  const content=relative==='sourcing/electric-utility-vehicles-from-china'?<ElectricUtilityVehiclesPage/>:relative==='sourcing/electric-tricycles-from-china'?<ElectricTricyclesPage/>:relative==='sourcing/portable-power-stations-from-china'?<PortablePowerPage/>:relative==='sourcing/electric-bicycles-from-china'?<ElectricBicyclesPage/>:relative==='sourcing/home-energy-storage-from-china'?<HomeStoragePage/>:relative==='sourcing/electric-scooters-from-china'?<ElectricScootersPage/>:relative===''?home:relative==='about'?<About/>:relative==='get-a-quote'?<GetAQuotePage/>:relative==='insights'?<InsightsHub/>:relative==='how-we-work'?<HowWeWork/>:relative==='products'?(language==='en'?<ProductsIndex/>:<LocalizedOverviewPage kind="products"/>):relative==='sourcing-services'?(language==='en'?<SourcingServices/>:<LocalizedOverviewPage kind="sourcing-services"/>):null;
  if(!content)throw new Error(`Unsupported core page ${route}`);
  return renderToStaticMarkup(<HelmetProvider><MemoryRouter initialEntries={[route]}><LanguageProvider initialLanguage={language}>{content}</LanguageProvider></MemoryRouter></HelmetProvider>);
}
