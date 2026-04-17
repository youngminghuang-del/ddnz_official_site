import { motion } from 'framer-motion';
import { getImgUrl } from '../constants';

const timelineEvents = [
  {
    year: '1997 - 2004',
    title: "The WTO Era: Linking the World's Workshop",
    description: 'Capitalizing on China’s historic WTO accession, we established ourselves as a vital link between the "World’s Workshop" and emerging global markets. We specialized in moving a diverse range of goods—from fragile electronics and textiles to industrial machinery—establishing a reputation for steadfast reliability when "Made in China" went global.',
    image: getImgUrl('JOURNEY_1999'),
    highlight: true,
  },
  {
    year: '2005 - 2010',
    title: 'Building Infrastructure & Integrated Trade',
    description: 'As volumes grew, so did our capabilities. We invested in self-owned warehouse hubs to gain full operational control. Simultaneously, we evolved beyond logistics into a versatile trading partner, launching proprietary commercial kitchen brands while forging deep agency partnerships and managing professional sourcing for premium hospitality furniture.',
    image: getImgUrl('JOURNEY_2004'),
  },
  {
    year: '2011 - 2018',
    title: 'The Financial Gateway: DDNZ Global (HK)',
    description: 'To offer our global clients superior financial security and settlement efficiency, we strategically established our Hong Kong entity. This pivotal move enabled seamless multi-currency transactions and provided a stable, reliable financial bridge for international trade settlements.',
    image: getImgUrl('JOURNEY_2009'),
  },
  {
    year: '2020',
    title: 'Crisis Response: Delivering Critical Supplies',
    description: 'When global supply chains faltered during the pandemic, our infrastructure remained operational. We rapidly redirected our logistics networks to export essential medical supplies (including PPE, masks, and gloves) to Europe. We were recognized not merely as shippers, but as responsive partners capable of navigating extreme disruption.',
    image: getImgUrl('JOURNEY_2019'),
  },
  {
    year: '2021 - Present',
    title: 'The New Energy Frontier',
    description: 'Anticipating the global shift, we entered the green logistics arena. Today, we are specialists in complex, compliance-driven exports for the new energy sector. We engineer custom logistics solutions for Energy Storage Systems (ESS) and electric commercial vehicles, mastering the intricate regulations governing Dangerous Goods transport.',
    image: getImgUrl('ESS_STORAGE'),
  },
];

export default function WhoWeAre() {
  return (
    <section id="who-we-are" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          {/* 统一视觉：正体加粗标题 */}
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight uppercase">WHO WE ARE</h2>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">A 29-Year Evolution: From Trade Pioneers to Industrial Logistics Experts</p>
        </div>

        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-slate-200 transform md:-translate-x-1/2" />

          <div className="space-y-16">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-blue-600 transform -translate-x-1/2 mt-6 md:mt-0 z-10 shadow-[0_0_0_4px_white]" />

                {/* Content Box */}
                <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12 text-left md:text-right'}`}>
                  <div className="mb-2">
                    <span className={`font-bold ${event.highlight ? 'text-4xl text-blue-600' : 'text-2xl text-slate-400'}`}>
                      {event.year}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{event.title}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed text-sm md:text-base">
                    {event.description}
                  </p>
                  
                  {event.image && (
                    <div className="rounded-xl overflow-hidden shadow-md bg-slate-100 aspect-video group relative">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
