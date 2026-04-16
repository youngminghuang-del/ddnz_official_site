import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { getImgUrl } from '../constants';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900 font-sans">
      <div className="absolute inset-0 z-0">
        <img
          src={getImgUrl('HERO_BG')}
          alt="DDNZ Global - Logistics Hub"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Reliable Logistics with a <br className="hidden md:block" />
            <span className="text-blue-400 font-black">Personal Touch</span>.
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-slate-100 max-w-3xl mx-auto font-medium mb-10">
            Empowering Your Global Supply Chain Since 1997.
          </p>
          
          <a
            href="https://wa.me/85261077362?text=Hi%20DDNZ%20Global,%20I%27m%20interested%20in%20your%20logistics%20services.%20Can%20we%20talk?"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-10 py-4 text-lg font-bold rounded-full text-white bg-[#25D366] hover:bg-[#20bd5a] transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            <MessageCircle className="w-6 h-6 mr-3" />
            Chat on WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
