import { motion } from 'framer-motion';
import { Award, Target, Warehouse } from 'lucide-react';

const comparisons = [
  {
    title: 'Trust Built on 29 Years',
    ddnz: 'Founded in 1997, our near-three-decade journey is your assurance. We have successfully navigated the evolution from general cargo to the complexities of New Energy Vehicle exports, building a track record you can rely on.',
    industry: 'Many suppliers lack the long-term, proven experience in critical areas like Dangerous Goods compliance and project logistics, representing a tangible risk for your shipments.',
    icon: Award,
  },
  {
    title: 'Specialized Solutions',
    ddnz: "We solve specific problems. Our expertise is not generic; it's focused on designing compliant, efficient logistics for NEVs and sensitive cargo to markets like the Middle East, Malaysia, Europe, and the Americas.",
    industry: 'Standard freight forwarders often apply a one-size-fits-all approach, lacking the specific knowledge to engineer optimal solutions for NEV finished vehicles and hazardous materials.',
    icon: Target,
  },
  {
    title: 'Seamless & Secure Operations',
    ddnz: 'Direct control means predictable outcomes. Our owned hub and port network in Guangzhou guarantees consistent, high-standard handling, ensuring the safety and timeliness of your bulk exports.',
    industry: 'Heavy reliance on fragmented third parties often leads to inconsistent execution, compromising both the security and schedule integrity of your supply chain.',
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
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight uppercase">Our Competitive Edge</h2>
          <p className="mt-4 text-lg text-slate-400">The Power of Depth and Personal Touch</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header Row */}
          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-4 pb-6 mb-8 text-sm uppercase tracking-widest text-slate-500 font-semibold">
            <div className="md:col-span-4 hidden md:block pl-14">Our Strength</div>
            <div className="md:col-span-4 hidden md:block text-white">How It Benefits You</div>
            <div className="md:col-span-4 hidden md:block">Common Industry Gaps</div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          </div>

          <div className="space-y-12 md:space-y-0">
            {comparisons.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-4 py-8 group"
              >
                {/* Subtle Gradient Divider */}
                {index !== comparisons.length - 1 && (
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
                )}
                <div className="md:col-span-4 flex items-start md:items-center space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-300 mt-1 md:mt-0">{item.title}</h3>
                </div>
                <div className="md:col-span-4 flex items-start md:items-center">
                  <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-snug">
                    {item.ddnz}
                  </div>
                </div>
                <div className="md:col-span-4 flex items-start md:items-center">
                  <div className="text-sm md:text-base text-slate-400 opacity-50 bg-slate-800/40 px-4 py-3 rounded-lg border border-slate-700/50">
                    <span className="font-bold text-slate-300 mr-2">Others:</span>
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
