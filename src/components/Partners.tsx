import { motion } from 'framer-motion';
import { getImgUrl } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

export default function Partners() {
  const { t } = useLanguage();

  return (
    <section id="partners" className="py-10 md:py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          {/* 统一规范：正体加粗，不带斜体 */}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight uppercase">
            {t('partners.title')}
          </h2>
          <div className="mt-2 w-12 lg:w-20 h-1 bg-violet-600 mx-auto" />
          <p className="mt-4 text-slate-600 font-medium">
            {t('partners.subtitle')}
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
            loading="lazy"
            className="w-full h-auto object-contain mix-blend-multiply opacity-80 hover:opacity-100 transition-opacity duration-500"
          />
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('partners.desc')}
          </p>
        </div>
      </div>
    </section>
  );
}
