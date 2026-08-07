import { lazy, Suspense } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import OriginControlStrip from '../components/OriginControlStrip';
import WhoWeAre from '../components/WhoWeAre';
import WhatsAppFloat from '../components/WhatsAppFloat';
import ScrollToTop from '../components/ScrollToTop';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/SchemaMarkup';

const WhatWeDo = lazy(() => import('../components/WhatWeDo'));
const CompetitiveEdge = lazy(() => import('../components/CompetitiveEdge'));
const TradeSupport = lazy(() => import('../components/TradeSupport'));
const Insights = lazy(() => import('../components/Insights'));
const GetAQuote = lazy(() => import('../components/GetAQuote'));
const Partners = lazy(() => import('../components/Partners'));
const Footer = lazy(() => import('../components/Footer'));

function HomeSectionFallback() {
  return (
    <section className="min-h-64 bg-[#F5F8FC]" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading section</span>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <SEO />
      <SchemaMarkup type="Organization" data={{}} />
      <SchemaMarkup type="LocalBusiness" data={{}} />
      <Navbar />
      <main>
        <Hero />
        <OriginControlStrip />
        <WhoWeAre />
        <Suspense fallback={<HomeSectionFallback />}>
          <WhatWeDo />
          <CompetitiveEdge />
          <TradeSupport />
          <Insights />
          <GetAQuote />
          <Partners />
        </Suspense>
      </main>
      <Suspense fallback={<HomeSectionFallback />}>
        <Footer />
      </Suspense>
      <WhatsAppFloat />
      <ScrollToTop />
    </div>
  );
}
