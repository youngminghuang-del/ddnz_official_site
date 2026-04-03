import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhoWeAre from './components/WhoWeAre';
import WhatWeDo from './components/WhatWeDo';
import WhyDDNZ from './components/WhyDDNZ';
import Partners from './components/Partners';
import Facilities from './components/Facilities';
import GetAQuote from './components/GetAQuote';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      <Navbar />
      <main>
        <Hero />
        <WhoWeAre />
        <WhatWeDo />
        <WhyDDNZ />
        <Partners />
        <Facilities />
        <GetAQuote />
      </main>
      <Footer />
    </div>
  );
}
