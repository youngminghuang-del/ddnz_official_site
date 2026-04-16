import { motion } from 'framer-motion';
import { getImgUrl } from '../constants';

const timelineEvents = [
  {
    year: '1997 - 2004',
    title: "The WTO Era: Connecting the World's Factory",
    description: 'Riding the historic wave of China\'s entry into the WTO, we began our journey by bridging the "World\'s Factory" to every reachable corner of the globe. From delicate electronics and apparel to heavy machinery and daily chemicals, we ensured that "Made in China" reached the world with absolute reliability.',
    image: getImgUrl('JOURNEY_1999'),
    highlight: true,
  },
  {
    year: '2005 - 2010',
    title: 'Infrastructure & Trade Synergy',
    description: 'Growth brought depth. We expanded our footprint by establishing self-owned warehousing hubs. Evolving into a versatile trade partner, we successfully launched our proprietary brands for commercial kitchenware alongside deep-agency alliances, and professional sourcing for premium commercial furniture.',
    image: getImgUrl('JOURNEY_2004'),
  },
  {
    year: '2011 - 2018',
    title: 'The Financial Gateway: DDNZ Global (Hong Kong)',
    description: 'To ensure maximum financial security and settlement efficiency for our global clientele, we established our Hong Kong gateway. This strategic move allowed us to facilitate seamless multi-currency transactions, providing our partners with a secure and robust financial buffer in international trade.',
    image: getImgUrl('JOURNEY_2009'),
  },
  {
    year: '2020',
    title: 'Resilience Amidst Crisis',
    description: 'When the world stood still in 2020, DDNZ moved faster. We pivoted our logistics power to export critical medical supplies (PPE, masks, and gloves) to Europe. We didn\'t just ship cargo; we stood shoulder-to-shoulder with our clients to overcome the toughest challenges of our generation.',
    image: getImgUrl('JOURNEY_2019'),
  },
  {
    year: '2021 - Present',
    title: 'The Green Energy Revolution',
    description: 'Embracing the dawn of the EV era, we became experts in New Energy logistics. Today, we specialize in bespoke, case-by-case export solutions for Energy Storage Systems (ESS) and electric commercial vehicles, navigating the complexities of customized DG (Dangerous Goods) handling.',
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
          <p className="mt-4 text-lg text-slate-600">A 29-Year Legacy of Trust, Vision, and Global Adaptation</p>
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
