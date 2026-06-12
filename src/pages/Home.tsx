import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WhoWeAre from '../components/WhoWeAre';
import WhatWeDo from '../components/WhatWeDo';
import CompetitiveEdge from '../components/CompetitiveEdge';
import Partners from '../components/Partners';
import GetAQuote from '../components/GetAQuote';
import Insights from '../components/Insights';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import ScrollToTop from '../components/ScrollToTop';
import CookieConsent from '../components/CookieConsent';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/SchemaMarkup';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <SEO />
      <SchemaMarkup type="Organization" data={{}} />
      <SchemaMarkup type="LocalBusiness" data={{}} />
      <Navbar />
      <main>
        <Hero />
        <WhoWeAre />
        <WhatWeDo />
        <CompetitiveEdge />
        <Partners />
        <GetAQuote />
        <Insights />
      </main>
      <Footer />
      <WhatsAppFloat />
      <ScrollToTop />
      <CookieConsent />
    </div>
  );
}
