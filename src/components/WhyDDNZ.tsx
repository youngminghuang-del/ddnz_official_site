import { motion } from 'framer-motion';
import { getImgUrl } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

export default function WhyDDNZ() {
  const { t } = useLanguage();

  const facilityData = [
    {
      title: t('facilities.guangzhou.title'),
      tag: t('facilities.guangzhou.tag'),
      desc: t('facilities.guangzhou.desc'),
      img: getImgUrl('FACILITY_SCALE'),
    },
    {
      title: t('facilities.systems.title'),
      tag: t('facilities.systems.tag'),
      desc: t('facilities.systems.desc'),
      img: getImgUrl('FACILITY_SORT'),
    }
  ];

  return (
    <section className="relative py-10 md:py-24 bg-[#4B27B1] text-white overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4c1d95_1px,transparent_1px),linear-gradient(to_bottom,#4c1d95_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- FACILITIES PART --- */}
        <div id="our-facilities">
            <div className="mb-10 md:mb-16 text-center">
              <div className="text-[#FF8A00] font-bold tracking-widest text-xs uppercase mb-2">{t('facilities.label')}</div>
              <h2 className="text-2xl md:text-5xl font-extrabold text-white mb-2">
                {t('facilities.title')}
              </h2>
              <div className="h-1.5 w-12 md:w-20 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto rounded-full mb-8" />
              <p className="text-purple-200 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-12">
                {t('facilities.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {facilityData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="group"
                >
                  <div className="aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl bg-[#4B27B1] mb-8 border border-purple-800 relative">
                    <div className="absolute inset-0 bg-[#4B27B1]/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img src={item.img} alt={item.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                  </div>
                  <div className="px-2">
                    <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 text-xs font-bold rounded-full mb-4 border border-orange-500/30">{item.tag}</span>
                    <h3 className="text-2xl font-extrabold text-white mb-3">{item.title}</h3>
                    <p className="text-purple-200 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
}
