import { getImgUrl } from '../constants';
import { ShieldCheck, Zap, Coffee, Globe, Anchor } from 'lucide-react';

const businessSectors = [
  {
    id: '01',
    title: 'Your Cargo, Our Commitment',
    tagline: 'Sea, Air & Land Freight Solutions',
    desc: 'Backed by 30 years of freight experience, we are committed to your cargo’s safety. From custom-built packaging to precision route planning, we navigate global complexities to deliver your goods securely and on schedule.',
    features: [
      { title: 'Direct Sea & Air Routes', detail: '' },
      { title: 'ASEAN Land-Link Express', detail: '' },
      { title: 'Export-Grade Plywood Crating', detail: '' }
    ],
    image: getImgUrl('RAILWAY'),
    icon: Anchor,
    gallery: [getImgUrl('PACKING'), getImgUrl('FACILITY_SCALE'), getImgUrl('FACILITY_TEAM')] 
  },
  {
    id: '02',
    title: 'Commercial Kitchen Solutions',
    tagline: 'Precision for Hospitality & Catering',
    desc: 'For over 30 years, we have been the cornerstone for commercial kitchens worldwide. We provide a comprehensive supply chain featuring our heritage proprietary brands alongside top Chinese manufacturers like Haier and Midea, delivering complete equipment ecosystems directly from factory to your site.',
    features: [
      { title: 'Bespoke Layout Design', detail: '' },
      { title: 'Own-Brand Reliability', detail: '' },
      { title: 'Global Project Delivery', detail: '' }
    ],
    image: getImgUrl('KITCHEN_01'),
    icon: Coffee,
    gallery: [getImgUrl('KITCHEN_01'), getImgUrl('KITCHEN_02'), getImgUrl('KITCHEN_03')]
  },
  {
    id: '03',
    title: 'Solutions for New Energy & ESS',
    tagline: 'Bespoke DG Logistics Experts',
    desc: 'We engineer seamless and fully compliant international supply chains for New Energy Vehicles and Energy Storage Systems. Our expertise begins with product sourcing and extends to safe delivery.',
    features: [
      { title: 'DG Compliance & Shipping', detail: 'Professional declaration, dangerous goods-approved bookings, and custom securing/stuffing plans for special containers.' },
      { title: 'Proactive Clearance Management', detail: 'Expert knowledge of destination port regulations enables advance clearance coordination, preventing delays.' },
      { title: 'End-to-End Visibility', detail: 'Real-time tracking from manufacturer to destination port, supported by comprehensive after-sales logistics support.' }
    ],
    image: getImgUrl('ESS_STORAGE'),
    icon: Zap,
    gallery: [getImgUrl('EV_01'), getImgUrl('EV_02'), getImgUrl('EV_03')]
  },
  {
    id: '04',
    title: 'Integrated Sourcing for Hotel & Office Furniture',
    tagline: '29 Years of Procurement Power',
    desc: 'We are a full-scope sourcing partner for global hospitality and office projects, transforming your specifications into delivered reality. We consolidate China’s vast manufacturing ecosystem to offer:',
    features: [
      { title: 'Design-to-Delivery Management', detail: 'Oversight of design, custom manufacturing, quality control, and consolidated logistics.' },
      { title: 'Budget-Engineered Procurement', detail: 'Access to a wide catalog with strong cost control, providing tailored solutions for any budget.' },
      { title: 'Destination-Ready Service', detail: 'We manage all upstream processes to delivery, facilitating a smooth handover to your local installation team.' }
    ],
    image: getImgUrl('FURNITURE_01'),
    icon: Globe,
    gallery: [getImgUrl('FURNITURE_01'), getImgUrl('FURNITURE_02'), getImgUrl('FURNITURE_03')]
  }
];

export default function WhatWeDo() {
  return (
    <section id="what-we-do" className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight uppercase">WHAT WE DO</h2>
          <div className="mt-4 w-24 h-1.5 bg-blue-600 mx-auto rounded-full" />
        </div>

        <div className="space-y-32">
          {businessSectors.map((sector, index) => (
            <div key={sector.id} className={`flex flex-col lg:flex-row gap-16 items-start ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
              {/* 文字描述部分 */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                    <sector.icon className="w-8 h-8" />
                  </div>
                  <span className="text-blue-600 font-bold tracking-widest text-base md:text-lg uppercase">{sector.tagline}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">{sector.title}</h3>
                <p className="text-lg text-slate-600 leading-relaxed font-medium">{sector.desc}</p>
                
                <ul className="grid grid-cols-1 gap-4 pt-4">
                  {sector.features.map((feat) => (
                    <li key={feat.title} className="flex items-start text-slate-700 text-sm">
                      <ShieldCheck className="w-5 h-5 mr-3 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">{feat.title}</span>
                        {feat.detail && (
                          <span className="text-slate-600">
                            : {feat.detail}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* 小图画廊：增强说服力 */}
                <div className="pt-6 mt-2 border-t border-slate-200">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Project Showcase</p>
                  <div className="flex gap-3">
                    {sector.gallery?.map((img, i) => (
                      <div key={i} className="group relative w-32 h-24 rounded-xl overflow-hidden border-2 border-white shadow-md bg-slate-200">
                        <img src={img} alt="Showcase" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 大图展示部分 */}
              <div className="w-full lg:w-1/2">
                <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
                  <img src={sector.image} alt={sector.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
