import { motion } from 'framer-motion';
import { Award, Target, Warehouse } from 'lucide-react';

const comparisons = [
  {
    title: 'A Legacy of Trust',
    ddnz: '26 Years of Full-Category Experience. Capable of handling everything from general cargo to high-value NEV bulk exports.',
    industry: 'Inexperienced. Lacks the historical depth in handling complex compliance for DG (Dangerous Goods) and project cargo.',
    icon: Award,
  },
  {
    title: 'Domain Expertise',
    ddnz: 'Industrial & Project Supply Chain Experts. Familiar with NEV export policies and compliance in the Middle East, Malaysia, Europe, and America.',
    industry: 'General Moving Model. Lacks the ability to design solutions for NEV complete vehicles and hazardous materials logistics.',
    icon: Target,
  },
  {
    title: 'Operational Strength',
    ddnz: 'Wholly-Managed GZ Hub & Port Network. Ensures 26 years of consistent high-standard cargo control and professional operation.',
    industry: 'Third-Party Reliance. Unable to effectively manage the safety and timeliness of port operations for bulk vehicle exports.',
    icon: Warehouse,
  },
];

export default function WhyDDNZ() {
  return (
    <section id="why-ddnz" className="relative py-24 bg-slate-900 text-white overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">WHY DDNZ?</h2>
          <p className="mt-4 text-lg text-slate-400">The Power of Depth and Personal Touch</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header Row */}
          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-4 pb-6 mb-8 text-sm uppercase tracking-widest text-slate-500 font-semibold">
            <div className="md:col-span-4 hidden md:block pl-14">Value Pillar</div>
            <div className="md:col-span-4 hidden md:block text-white">DDNZ Global</div>
            <div className="md:col-span-4 hidden md:block">Industry Standard</div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          </div>

          <div className="space-y-8 md:space-y-0">
            {comparisons.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4 py-8 group"
              >
                {/* Subtle Gradient Divider */}
                {index !== comparisons.length - 1 && (
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
                )}
                <div className="md:col-span-4 flex items-center space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-300">{item.title}</h3>
                </div>
                <div className="md:col-span-4 flex items-center">
                  <div className="text-xl font-bold text-white tracking-tight">
                    {item.ddnz}
                  </div>
                </div>
                <div className="md:col-span-4 flex items-center">
                  <div className="text-base text-slate-500 line-through decoration-slate-700">
                    {item.industry}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
