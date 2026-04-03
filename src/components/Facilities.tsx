import { motion } from 'framer-motion';
import { getImgUrl } from '../constants';

export default function Facilities() {
  const facilityData = [
    {
      title: "Guangzhou Operational Hub",
      tag: "18-Year Self-Owned",
      desc: "Our strategic nerve center in Guangzhou. With nearly two decades of operational history, we provide absolute cargo control, professional consolidation, and rigorous QC for every shipment.",
      img: getImgUrl('FACILITY_SCALE'),
    },
    {
      title: "Professional Handling & Sorting",
      tag: "Precision Execution",
      desc: "Equipped with automated sorting lines and expert staff. We specialize in complex packing requirements, including export-grade plywood crating for high-value engineering projects.",
      img: getImgUrl('FACILITY_SORT'),
    }
  ];

  return (
    <section id="our-facilities" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">OPERATIONAL STRENGTH</h2>
          <p className="mt-4 text-lg text-slate-600">Where 26 Years of Experience Meets Modern Infrastructure</p>
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
