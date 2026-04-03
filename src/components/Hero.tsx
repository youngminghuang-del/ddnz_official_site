import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
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
            Empowering Your Global Supply Chain Since 1999.
          </p>
          
          {/* 修改点：按钮逻辑由 WhatsApp 切换为直接唤起邮件客户端 */}
          <a
            href="mailto:services@ddnzglobal.com?subject=Inquiry from DDNZ Global Website"
            className="inline-flex items-center px-10 py-4 text-lg font-bold rounded-full text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            <Mail className="w-6 h-6 mr-3" />
            Direct Email Inquiry
          </a>
        </motion.div>
      </div>
    </section>
  );
}
