import { useState } from 'react';
import { Mail, Globe, Clock, FileText, Shield } from 'lucide-react';
import LegalModal, { LegalType } from './LegalModal';

export default function Footer() {
  const [legalType, setLegalType] = useState<LegalType>(null);

  return (
    <footer className="bg-slate-950 text-slate-300 py-16 font-sans border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Row: Brand & Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Column 1: Brand & Contact */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-white tracking-tighter">DDNZ Global</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm italic">
                "29 Years of Logistics Excellence & Integrity. Your Strategic Partner for Specialized Supply Chain Solutions."
              </p>
            </div>
            <div>
              <a href="mailto:partnership@ddnzglobal.com" className="inline-flex items-center text-white hover:text-blue-400 transition-colors group font-medium text-sm">
                <Mail className="w-5 h-5 mr-3 text-blue-500 group-hover:text-blue-400 transition-colors" />
                partnership@ddnzglobal.com
              </a>
            </div>
          </div>

          {/* Column 2: Guangzhou HQ */}
          <div>
            <h4 className="text-xs font-bold text-white mb-5 uppercase tracking-widest flex items-center">
              <Globe className="w-4 h-4 mr-2 text-blue-500" /> Guangzhou HQ
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Room 6025 - 6027, 6th Floor,<br />
              Lianfu Building, No. 1-10 Qifu Road,<br />
              Yuncheng Street, Baiyun District,<br />
              Guangzhou, China
            </p>
          </div>

          {/* Column 3: Hong Kong Node */}
          <div>
            <h4 className="text-xs font-bold text-white mb-5 uppercase tracking-widest flex items-center">
              <Globe className="w-4 h-4 mr-2 text-blue-500" /> Hong Kong Node
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              5F, Sun Hung Kai Centre,<br />
              38 Russell Street,<br />
              Causeway Bay,<br />
              Hong Kong, China
            </p>
          </div>

        </div>

        {/* Middle Row: Hours & Legal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50">
          
          {/* Hours */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-1">Office Hours</h4>
              <p className="text-sm text-slate-400">
                <span className="text-white font-medium">Mon - Fri:</span> 9:00 AM - 6:00 PM <span className="text-slate-500">(GMT+8)</span>
              </p>
            </div>
          </div>

          {/* Legal */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-1">Compliance & Legal</h4>
              <div className="flex flex-wrap items-center gap-4 text-sm mt-1">
                <button 
                  onClick={() => setLegalType('privacy')}
                  className="text-slate-400 hover:text-white transition-colors flex items-center group"
                >
                  <FileText className="w-3.5 h-3.5 mr-1.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  Privacy Policy
                </button>
                <span className="text-slate-700 hidden sm:inline">|</span>
                <button 
                  onClick={() => setLegalType('terms')}
                  className="text-slate-400 hover:text-white transition-colors flex items-center group"
                >
                  <FileText className="w-3.5 h-3.5 mr-1.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  Terms of Service
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section: Copyright */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; 2026 DDNZ Global. All Rights Reserved.</p>
          <div className="mt-4 md:mt-0 uppercase font-bold tracking-tighter">
            <span>Specialized NEV & SCM Experts</span>
          </div>
        </div>
      </div>

      {/* Legal Modal */}
      <LegalModal type={legalType} onClose={() => setLegalType(null)} />
    </footer>
  );
}
