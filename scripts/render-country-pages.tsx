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
  const Component = ['saudi-arabia','uae','kuwait','qatar','oman','bahrain'].includes(country) ? MiddleEast
    : ['kazakhstan','uzbekistan','kyrgyzstan','tajikistan','turkmenistan','russia'].includes(country) ? CentralAsia
    : ['nigeria','ghana'].includes(country) ? WestAfrica : LatinAmerica;
  return renderToStaticMarkup(<HelmetProvider><MemoryRouter initialEntries={[route]}><LanguageProvider initialLanguage={language as any}><Component /></LanguageProvider></MemoryRouter></HelmetProvider>);
}

import SourcingHomepageHero from '../src/components/SourcingHomepageHero';
import HomeOneTeamBridge from '../src/components/HomeOneTeamBridge';
import SourcingHomepageNav from '../src/components/SourcingHomepageNav';
import HowWeWork from '../src/pages/HowWeWork';
import InsightsHub from '../src/pages/InsightsHub';
import LocalizedOverviewPage from '../src/pages/LocalizedOverviewPage';
import ProductsIndex from '../src/pages/product-showcase/ProductsIndex';
import SourcingServices from '../src/pages/product-showcase/SourcingServices';
import { getLocalizedHomeFaqs } from '../src/data/homeFaqData';

export function renderCorePage(route: string) {
  const match=route.match(/^\/(zh-cn|ru|fr|es|ar|pt|tr)(?=\/|$)/);
  const language=(match?.[1]==='zh-cn'?'zh':match?.[1] || 'en') as any;
  const relative=(match?route.slice(match[0].length):route).replace(/^\/+|\/+$/g,'');
  const home=<><SourcingHomepageNav/><main><SourcingHomepageHero/><HomeOneTeamBridge/><section className="mx-auto max-w-7xl px-6 py-16">{getLocalizedHomeFaqs(language).map(f=><article className="border-t py-6" key={f.question}><h2 className="text-xl font-bold">{f.question}</h2><p className="mt-3 leading-7">{f.answer}</p></article>)}</section></main></>;
  const content=relative===''?home:relative==='insights'?<InsightsHub/>:relative==='how-we-work'?<HowWeWork/>:relative==='products'?(language==='en'?<ProductsIndex/>:<LocalizedOverviewPage kind="products"/>):relative==='sourcing-services'?(language==='en'?<SourcingServices/>:<LocalizedOverviewPage kind="sourcing-services"/>):null;
  if(!content)throw new Error(`Unsupported core page ${route}`);
  return renderToStaticMarkup(<HelmetProvider><MemoryRouter initialEntries={[route]}><LanguageProvider initialLanguage={language}>{content}</LanguageProvider></MemoryRouter></HelmetProvider>);
}
