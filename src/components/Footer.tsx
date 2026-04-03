import { MapPin, Mail, Globe } from 'lucide-react';
import { getImgUrl } from '../constants';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold text-white tracking-tighter">DDNZ Global</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-8 italic text-sm">
              "26 Years of Vision, Trust, and Global Adaptation. Your Strategic Partner for Specialized Supply Chain Solutions."
            </p>
            {/* 仅保留邮件联系方式 */}
            <div className="group flex items-center p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 transition-all">
              <Mail className="w-6 h-6 mr-4 text-blue-500" />
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">General Inquiry</p>
                <a href="mailto:services@ddnzglobal.com" className="text-white font-bold hover:text-blue-400">
                  services@ddnzglobal.com
                </a>
              </div>
            </div>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center md:h-14">
              <Globe className="w-5 h-5 mr-2 text-blue-500" /> Guangzhou HQ
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Room 6025 - 6027, 6th Floor, Lianfu Building,<br />
              No. 1-10 Qifu Road, Yuncheng Street,<br />
              Baiyun District, Guangzhou, China
            </p>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center md:h-14">
              <Globe className="w-5 h-5 mr-2 text-blue-500" /> Hong Kong Node
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              5F, Sun Hung Kai Centre,<br />
              38 Russell Street, Causeway Bay,<br />
              Hong Kong, China
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} DDNZ Global (Guangzhou). All Rights Reserved.</p>
          <div className="mt-4 md:mt-0 space-x-6 uppercase font-bold tracking-tighter">
            <span>Specialized NEV & SCM Experts</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
