import { motion } from 'framer-motion';
import { getImgUrl } from '../constants';

export default function Facilities() {
  const facilityData = [
    {
      title: "Guangzhou: Your Command & Control Center",
      tag: "1. A Strategic Hub, Owned & Mastered for 18 Years",
      desc: "This is not a leased space; it’s our strategic nerve center, owned and refined over nearly two decades. Here, we exercise absolute control. Every shipment undergoes professional consolidation and rigorous, standardized quality checks, ensuring integrity from the first to the final mile.",
      img: getImgUrl('FACILITY_SCALE'),
    },
    {
      title: "Advanced Systems for Complex Cargo",
      tag: "2. Engineered for Precision & Protection",
      desc: "Equipped with automated sorting and a team of specialists, we handle what standard warehouses cannot. Our core expertise lies in custom, export-grade packaging solutions—most notably, precision-engineered plywood crating for high-value, sensitive machinery and project cargo, built to survive the global supply chain.",
      img: getImgUrl('FACILITY_SORT'),
    }
  ];

  return (
    <section id="our-facilities" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight uppercase">OPERATIONAL EXCELLENCE</h2>
          <p className="mt-4 text-lg text-slate-600">Where Legacy Expertise Powers Modern Infrastructure</p>
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
              <div className="aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl bg-slate-100 mb-8">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="px-2">
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-4">{item.tag}</span>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
