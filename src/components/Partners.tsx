import { motion } from 'framer-motion';
import { getImgUrl } from '../constants';

export default function Partners() {
  return (
    <section id="partners" className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          {/* 统一规范：正体加粗，不带斜体 */}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight uppercase">
            Trusted by Global Leaders
          </h2>
          <div className="mt-2 w-20 h-1 bg-blue-600 mx-auto" />
          <p className="mt-4 text-slate-600 font-medium">
            Seamlessly Integrated with the World's Premier Carriers & Networks
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative rounded-2xl overflow-hidden bg-slate-50 p-8 md:p-12 shadow-inner"
        >
          {/* 展示你的 Logo 墙图片 */}
          <img 
            src={getImgUrl('LOGO_WALL')} 
            alt="DDNZ Global Partner Network" 
            className="w-full h-auto object-contain mix-blend-multiply opacity-80 hover:opacity-100 transition-opacity duration-500"
          />
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Our strategic alliances with top-tier shipping lines and airlines ensure that DDNZ Global (Hong Kong) 
            provides the most competitive rates and priority space allocations for your critical cargo.
          </p>
        </div>
      </div>
    </section>
  );
}
