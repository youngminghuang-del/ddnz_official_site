import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WhoWeAre from '../components/WhoWeAre';
import WhatWeDo from '../components/WhatWeDo';
import CompetitiveEdge from '../components/CompetitiveEdge';
import WhyDDNZ from '../components/WhyDDNZ';
import Partners from '../components/Partners';
import GetAQuote from '../components/GetAQuote';
import Insights from '../components/Insights';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import ScrollToTop from '../components/ScrollToTop';
import CookieConsent from '../components/CookieConsent';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <main>
        <Hero />
        <GetAQuote />
        <WhoWeAre />
        <WhatWeDo />
        <CompetitiveEdge />
        <WhyDDNZ />
        <Partners />
        <Insights />
      </main>
      <Footer />
      <WhatsAppFloat />
      <ScrollToTop />
      <CookieConsent />
    </div>
  );
}
