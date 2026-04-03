import { motion } from 'framer-motion';
import { getImgUrl } from '../constants';
import { ShieldCheck, Zap, Coffee, Globe, Anchor } from 'lucide-react';

const businessSectors = [
  {
    id: '01',
    title: 'Global Multimodal Logistics',
    tagline: 'Sea, Air & Land Freight Solutions',
    desc: '26 years of international freight heritage. We ensure your cargo crosses borders with absolute safety through professional crating and route optimization.',
    features: ['Direct Sea & Air Routes', 'ASEAN Land-Link Express', 'Export-Grade Plywood Crating'],
    image: getImgUrl('RAILWAY'),
    icon: Anchor,
    // 增加：包装实拍图及设施团队
    gallery: [getImgUrl('PACKING'), getImgUrl('FACILITY_SCALE'), getImgUrl('FACILITY_TEAM')] 
  },
  {
    id: '02',
    title: 'Commercial Kitchen Engineering',
    tagline: 'Precision for Hospitality & Catering',
    desc: 'Total kitchen ecosystems delivered factory-to-site. Our proprietary brands define the standards of modern commercial cooking for global hotel projects.',
    features: ['Bespoke Layout Design', 'Own-Brand Reliability', 'Global Project Delivery'],
    image: getImgUrl('KITCHEN_01'),
    icon: Coffee,
    // 增加：厨房工程实景图 (假设你已有 01, 02, 03)
    gallery: [getImgUrl('KITCHEN_01'), getImgUrl('KITCHEN_02'), getImgUrl('KITCHEN_03')]
  },
  {
    id: '03',
    title: 'New Energy & ESS Solutions',
    tagline: 'Bespoke DG Logistics Experts',
    desc: 'Navigating NEVs and Energy Storage Systems. We specialize in customized export schemes for Dangerous Goods (DG), ensuring full compliance.',
    features: ['NEV/ESS Specialization', 'Custom DG Handling', 'Port-Side Operations'],
    image: getImgUrl('ESS_STORAGE'),
    icon: Zap,
    // 增加：港口EV出口实拍 (01, 02, 03)
    gallery: [getImgUrl('EV_01'), getImgUrl('EV_02'), getImgUrl('EV_03')]
  },
  {
    id: '04',
    title: 'Hotel Furniture & Sourcing',
    tagline: '26 Years of Procurement Power',
    desc: 'Consolidating China’s manufacturing power for global hotel and office projects. We manage the full supply chain from QC to final installation.',
    features: ['Project Consolidation', 'Rigorous QC & Inspection', 'On-Site Delivery'],
    image: getImgUrl('FURNITURE_01'),
    icon: Globe,
    // 增加：酒店家具项目实拍 (01, 02, 03)
    gallery: [getImgUrl('FURNITURE_01'), getImgUrl('FURNITURE_02'), getImgUrl('FURNITURE_03')]
  }
];

export default function WhatWeDo() {
  return (
    <section id="what-we-do" className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight uppercase">Core Business Sectors</h2>
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
                  <span className="text-blue-600 font-bold tracking-widest text-sm uppercase">{sector.tagline}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">{sector.title}</h3>
                <p className="text-lg text-slate-600 leading-relaxed font-medium">{sector.desc}</p>
                
                {/* 小图画廊：增强说服力 */}
                <div className="pt-4">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Project Showcase</p>
                  <div className="flex gap-3">
                    {sector.gallery?.map((img, i) => (
                      <div key={i} className="group relative w-32 h-24 rounded-xl overflow-hidden border-2 border-white shadow-md bg-slate-200">
                        <img src={img} alt="Showcase" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      </div>
                    ))}
                  </div>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                  {sector.features.map((feat) => (
                    <li key={feat} className="flex items-center text-slate-700 font-bold text-sm">
                      <ShieldCheck className="w-5 h-5 mr-3 text-blue-600" />
                      {feat}
                    </li>
                  ))}
                </ul>
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
