import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Info, ArrowRight } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import { useLanguage } from '../contexts/LanguageContext';
import { trackEvent } from '../lib/utils';

export default function GetAQuote() {
  const [state, handleSubmit] = useForm("mdabvqbd");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useLanguage();
  const [selectedService, setSelectedService] = useState('Sea');

  // Handle tracking and local success state
  useEffect(() => {
    if (state.succeeded) {
      trackEvent('rfq_submit_success', { 'event_category': 'conversion' });
      trackEvent('submit_quote_form', { 'method': 'Email' });
      setIsSubmitted(true);
    }
  }, [state.succeeded]);

  return (
    <section id="get-a-quote" className="py-12 md:py-24 bg-purple-50/50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <div className="text-[#4B27B1] font-bold tracking-widest text-xs uppercase mb-2">
            {t('get_a_quote.estimatorTitle')}
          </div>
          <h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tight text-center mb-4">
            {t('get_a_quote.formTitle')}
          </h2>
          <div className="h-1.5 w-12 md:w-20 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto rounded-full mb-8" />
          <p className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-4 font-medium">
            {t('get_a_quote.subtitle')}
          </p>
          <div className="flex items-center justify-center gap-2 text-[#FF8A00] font-bold text-sm bg-orange-50 w-fit mx-auto px-4 py-1.5 rounded-full border border-orange-100 shadow-sm">
            <Info className="w-4 h-4" />
            {t('hero.alibaba_cta')}
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 sm:p-10 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden">
            {!isSubmitted ? (
              <>
                <p className="text-sm text-slate-500 mb-8 text-center font-medium">
                  {t('get_a_quote.formSubtitle')}
                </p>
                
                <form id="quote-form" onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
                  
                  {/* Service Selector Chips */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      {t('get_a_quote.mode')}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: 'Sea', label: t('get_a_quote.modeSea'), icon: '🚢' },
                        { id: 'Land', label: t('get_a_quote.modeLand'), icon: '🚛' },
                        { id: 'Air', label: t('get_a_quote.modeAir'), icon: '✈️' },
                        { id: 'Warehouse', label: t('nav.services_warehouse') || 'Warehouse', icon: '📦' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedService(item.id)}
                          className={`py-3 px-2 flex flex-col items-center justify-center rounded-xl border-2 transition-all ${
                            selectedService === item.id 
                              ? 'border-[#4B27B1] bg-purple-50/50 text-[#4B27B1] font-bold shadow-sm' 
                              : 'border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-2xl mb-1">{item.icon}</span>
                          <span className="text-xs">{item.label}</span>
                        </button>
                      ))}
                    </div>
                    <input type="hidden" name="service" value={selectedService || ''} />
                  </div>

                  {/* Origin & Destination Ports */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="origin" className="block text-sm font-bold text-slate-700 mb-1">
                        {t('get_a_quote.originLabel')}
                      </label>
                      <input
                        id="origin"
                        name="origin"
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] focus:ring-1 focus:ring-[#4B27B1] outline-none transition-all placeholder-slate-400 font-medium"
                        placeholder={t('get_a_quote.originPlaceholder')}
                      />
                    </div>
                    <div>
                      <label htmlFor="destination" className="block text-sm font-bold text-slate-700 mb-1">
                        {t('get_a_quote.destLabel')}
                      </label>
                      <input
                        id="destination"
                        name="destination"
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] focus:ring-1 focus:ring-[#4B27B1] outline-none transition-all placeholder-slate-400 font-medium"
                        placeholder={t('get_a_quote.destPlaceholder')}
                      />
                    </div>
                  </div>

                  {/* Industry Select */}
                  <div>
                    <label htmlFor="product" className="block text-sm font-bold text-slate-700 mb-1">
                      {t('get_a_quote.industryLabel')}
                    </label>
                    <select
                      id="product"
                      name="product"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] focus:ring-1 focus:ring-[#4B27B1] outline-none bg-white font-medium transition-all"
                    >
                      <option value="New Energy / ESS">{t('get_a_quote.indNev')}</option>
                      <option value="Commercial Furniture">{t('get_a_quote.indFurn')}</option>
                      <option value="Project Cargo / Heavy Lift">{t('get_a_quote.indProject')}</option>
                      <option value="Other">{t('get_a_quote.indOther')}</option>
                    </select>
                  </div>

                  {/* Cargo Description Textarea */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-1">
                      {t('get_a_quote.cargo')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] focus:ring-1 focus:ring-[#4B27B1] outline-none resize-none transition-all placeholder-slate-400 font-medium"
                      placeholder={t('get_a_quote.msgPlaceholder')}
                    />
                  </div>

                  {/* Name & Email Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-1">
                        {t('get_a_quote.fname')}
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] focus:ring-1 focus:ring-[#4B27B1] outline-none transition-all placeholder-slate-400 font-medium"
                        placeholder="John Doe / Acme Corp"
                      />
                      <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1">
                        {t('get_a_quote.email')}
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4B27B1] focus:ring-1 focus:ring-[#4B27B1] outline-none transition-all placeholder-slate-400 font-medium"
                        placeholder="john@company.com"
                      />
                      <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={state.submitting}
                      className={`w-full text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center shadow-lg hover:-translate-y-0.5 ${
                        state.submitting ? 'bg-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] hover:shadow-xl'
                      }`}
                    >
                      {state.submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                          {t('get_a_quote.submitting')}
                        </>
                      ) : (
                        <>
                          {t('get_a_quote.submit')} <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                  
                  {state.errors && (
                    <p className="mt-4 text-xs text-red-500 text-center">
                      Something went wrong. Please <a href="mailto:partnership@ddnzglobal.com" className="underline font-bold">email us directly.</a>
                    </p>
                  )}
                </form>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center bg-[#4B27B1] -m-6 sm:-m-10 p-10 rounded-2xl"
              >
                <div className="w-20 h-20 bg-[#FF8A00] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <motion.path 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
                <h3 className="text-3xl font-black text-white mb-4">Thank You!</h3>
                <p className="text-purple-100 text-lg max-w-sm leading-relaxed mb-8">
                  Your inquiry has been received. Our specialists will reply <span className="text-[#FF8A00] font-bold">within 24 hours</span>.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-slate-900 bg-white hover:bg-slate-50 px-6 py-2 rounded-full text-sm font-bold transition-colors"
                >
                  Send another inquiry
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
