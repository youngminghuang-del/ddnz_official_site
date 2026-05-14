import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Info, ArrowRight, MessageCircle } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import { useLanguage } from '../contexts/LanguageContext';
import { trackEvent } from '../lib/utils';

export default function GetAQuote() {
  const [state, handleSubmit] = useForm("mdabvqbd");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useLanguage();

  // Handle tracking and local success state
  useEffect(() => {
    if (state.succeeded) {
      trackEvent('rfq_submit_success', { 'event_category': 'conversion' });
      trackEvent('submit_quote_form', { 'method': 'Email' });
      setIsSubmitted(true);
    }
  }, [state.succeeded]);

  // Estimator State
  const [mode, setMode] = useState<'sea' | 'land' | 'air'>('sea');
  const [seaLane, setSeaLane] = useState<'SA/SEA' | 'EA/EU'>('SA/SEA');
  const [length, setLength] = useState<number | ''>('');
  const [width, setWidth] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [manualCbm, setManualCbm] = useState<number | ''>('');
  const [actualWeight, setActualWeight] = useState<number | ''>('');
  const [baseRate, setBaseRate] = useState<number | ''>('');
  const [cargoType, setCargoType] = useState<'General' | 'NEV'>('General');
  const [isDG, setIsDG] = useState(false);
  const [landLane, setLandLane] = useState<'Central' | 'Uzbekistan/Kazakhstan'>('Uzbekistan/Kazakhstan');
  const [results, setResults] = useState<any>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  const calculateAutoCbm = () => {
    if (length !== '' && width !== '' && height !== '' && quantity !== '') {
      return (Number(length) * Number(width) * Number(height) * Number(quantity)) / 1000000;
    }
    return 0;
  };

  const handleCalculate = () => {
    let cbm = 0;
    if (manualCbm !== '') {
      cbm = Number(manualCbm);
    } else {
      cbm = calculateAutoCbm();
    }

    if (cbm === 0 && Number(actualWeight) === 0) {
      alert(t('get_a_quote.alertInput'));
      return;
    }

    let factor = 1000;
    let ratioText = '';
    let destinationLabel = 'Global';
    let modeText = '';

    if (mode === 'air') {
      factor = 167; // 1 CBM = 167 KG
      ratioText = '1:167';
      destinationLabel = 'Global';
      modeText = t('get_a_quote.modeAir') + '/Express';
    } else if (mode === 'sea') {
      modeText = t('get_a_quote.modeSea') + ' LCL';
      if (seaLane === 'EA/EU') {
         factor = 1000;
         ratioText = '1:1000';
         destinationLabel = t('get_a_quote.sea_opt2');
      } else {
         factor = 500;
         ratioText = '1:500';
         destinationLabel = t('get_a_quote.sea_opt1');
      }
    } else if (mode === 'land') {
      factor = 500;
      ratioText = '1:500';
      destinationLabel = t('get_a_quote.land');
      modeText = t('get_a_quote.modeLand') + ' Freight';
    }

    const actualWeightNum = Number(actualWeight) || 0;
    const volumeNum = cbm;

    const density = volumeNum > 0 ? actualWeightNum / volumeNum : actualWeightNum;
    const isHeavy = density > factor;
    const classification = isHeavy ? t('get_a_quote.classHeavy') : t('get_a_quote.classLight');

    let finalUnits = 0;
    let finalUnitLabel = '';

    if (mode === 'air') {
      const volWeight = volumeNum * factor;
      finalUnits = Math.max(actualWeightNum, volWeight);
      finalUnitLabel = 'KG';
    } else {
      const weightTons = actualWeightNum / factor;
      finalUnits = Math.max(volumeNum, weightTons);
      finalUnitLabel = 'RT';
    }

    // Total Freight
    let totalFreight = 0;
    let minFreight = 0, maxFreight = 0;
    const rateNum = Number(baseRate) || 0;
    
    if (rateNum > 0) {
      const baseFreight = finalUnits * rateNum;
      // Add 25% surcharge for NEV or Battery/DG
      const surcharge = (cargoType === 'NEV' || isDG) ? 1.25 : 1;
      totalFreight = baseFreight * surcharge;
      minFreight = totalFreight * 0.90;
      maxFreight = totalFreight * 1.10;
    }

    setResults({
      cbm: Math.max(0.01, volumeNum).toFixed(3), // Ensure slightly visible if 0
      actualWeight: actualWeightNum.toFixed(2),
      finalUnits: finalUnits.toFixed(2),
      finalUnitLabel,
      classification,
      isHeavy,
      hasRate: rateNum > 0,
      minFreight: minFreight.toFixed(2),
      maxFreight: maxFreight.toFixed(2),
      ratio: ratioText,
      destinationLabel,
      modeText,
      landLane
    });

    trackEvent('tool_calculator_use');
    trackEvent('click_calculator', {
      'transport_mode': mode,
      'destination': destinationLabel
    });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  return (
    <section id="get-a-quote" className="py-10 md:py-24 bg-purple-50/50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <div className="text-orange-600 font-semibold tracking-widest text-xs uppercase mb-2">{t('get_a_quote.estimatorTitle')}</div>
          <h2 className="text-2xl md:text-5xl font-extrabold text-slate-900 tracking-tight text-center mb-4">
            {t('get_a_quote.title')}
          </h2>
          <div className="h-1.5 w-12 md:w-20 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] mx-auto rounded-full mb-8" />
          <p className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-4">
            {t('get_a_quote.subtitle')}
          </p>
          <div className="flex items-center justify-center gap-2 text-[#FF8A00] font-bold text-sm bg-orange-50 w-fit mx-auto px-4 py-1.5 rounded-full border border-orange-100 shadow-sm">
            <Info className="w-4 h-4" />
            {t('hero.alibaba_cta')}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-stretch">
          
          {/* Left Column: Estimator */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-purple-100 p-6 md:p-8 flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-[#4B27B1]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{t('get_a_quote.calcTitle')}</h3>
            </div>

            <div className="flex-1 flex flex-col space-y-6">
              {/* Transport Mode */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t('get_a_quote.mode')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['sea', 'land', 'air'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`py-2 text-sm font-bold rounded-lg border transition-all ${
                        mode === m 
                          ? 'border-[#4B27B1] bg-purple-50 text-[#4B27B1]' 
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {t(`get_a_quote.mode${m.charAt(0).toUpperCase() + m.slice(1)}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lane Selection dependent on Mode */}
              {mode === 'sea' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{t('get_a_quote.sea')}</label>
                  <select 
                    value={seaLane} 
                    onChange={(e) => setSeaLane(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm font-medium rounded bg-white border border-slate-200 focus:ring-1 focus:ring-[#4B27B1] outline-none"
                  >
                    <option value="SA/SEA">{t('get_a_quote.sea_opt1')}</option>
                    <option value="EA/EU">{t('get_a_quote.sea_opt2')}</option>
                  </select>
                </div>
              )}
              {mode === 'land' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{t('get_a_quote.land')}</label>
                  <select 
                    value={landLane} 
                    onChange={(e) => setLandLane(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm font-medium rounded bg-white border border-slate-200 focus:ring-1 focus:ring-[#4B27B1] outline-none"
                  >
                    <option value="Central">{t('get_a_quote.land_opt1')}</option>
                    <option value="Uzbekistan/Kazakhstan">{t('get_a_quote.land_opt2')}</option>
                  </select>
                </div>
              )}
              {mode === 'air' && (
               <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{t('get_a_quote.air')}</label>
                  <div className="px-3 py-2 text-sm font-medium rounded bg-slate-50 border border-slate-200 text-slate-600">
                    {t('get_a_quote.air_opt1')}
                  </div>
                </div>
              )}

              {/* Dimensions Input */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-bold text-slate-700">{t('get_a_quote.packageDim')}</label>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  <input type="number" placeholder="L(cm)" value={length} onChange={(e) => setLength(Number(e.target.value) || '')} className="w-full px-2 py-2 text-sm rounded bg-white border border-slate-200 focus:ring-1 focus:ring-[#4B27B1] outline-none" />
                  <input type="number" placeholder="W(cm)" value={width} onChange={(e) => setWidth(Number(e.target.value) || '')} className="w-full px-2 py-2 text-sm rounded bg-white border border-slate-200 focus:ring-1 focus:ring-[#4B27B1] outline-none" />
                  <input type="number" placeholder="H(cm)" value={height} onChange={(e) => setHeight(Number(e.target.value) || '')} className="w-full px-2 py-2 text-sm rounded bg-white border border-slate-200 focus:ring-1 focus:ring-[#4B27B1] outline-none" />
                  <input type="number" placeholder={t('get_a_quote.quantity')} value={quantity} onChange={(e) => setQuantity(Number(e.target.value) || '')} className="w-full px-2 py-2 text-sm rounded bg-white border border-slate-200 focus:ring-1 focus:ring-[#4B27B1] outline-none" />
                </div>
                <div className="flex items-start gap-2 mb-4">
                  <Info className="w-4 h-4 text-[#4B27B1] shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500 italic">{t('get_a_quote.dimInfo')}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200"></div>
                  <span className="text-xs font-bold text-slate-400 uppercase">{t('get_a_quote.orOverride')}</span>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t('get_a_quote.totalCbm')}</label>
                  <input 
                    type="number" 
                    placeholder={`${t('get_a_quote.autoPrefix')}: ${calculateAutoCbm().toFixed(3)} CBM`}
                    value={manualCbm} 
                    onChange={(e) => setManualCbm(Number(e.target.value) || '')} 
                    className="w-full px-3 py-2 rounded bg-white border border-slate-200 focus:ring-1 focus:ring-[#4B27B1] outline-none" 
                  />
                </div>
              </div>

              {/* Weight, Cargo Type & Rate */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t('get_a_quote.actualWeightLabel')}</label>
                  <input 
                    type="number" 
                    value={actualWeight} 
                    onChange={(e) => setActualWeight(Number(e.target.value) || '')} 
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:ring-1 focus:ring-[#4B27B1] outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t('get_a_quote.cargoCat')}</label>
                  <select
                    value={cargoType}
                    onChange={(e) => setCargoType(e.target.value as 'General' | 'NEV')}
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:ring-1 focus:ring-[#4B27B1] outline-none bg-white"
                  >
                    <option value="General">{t('get_a_quote.catGeneral')}</option>
                    <option value="NEV">{t('get_a_quote.catNev')}</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                 <input type="checkbox" id="isDG" checked={isDG} onChange={(e) => setIsDG(e.target.checked)} className="rounded text-[#4B27B1] border-slate-300 focus:ring-[#4B27B1]" />
                 <label htmlFor="isDG" className="text-sm font-bold text-slate-700">{t('get_a_quote.includeDG')}</label>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t('get_a_quote.baseRate')}</label>
                <input 
                  type="number" 
                  placeholder={t('get_a_quote.baseRatePlaceholder')}
                  value={baseRate} 
                  onChange={(e) => setBaseRate(Number(e.target.value) || '')} 
                  className="w-full px-3 py-2 rounded border border-slate-200 focus:ring-1 focus:ring-[#4B27B1] outline-none" 
                />
              </div>

              <div className="mt-auto pt-4 space-y-4">
                <button
                  type="button"
                  onClick={handleCalculate}
                  className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors shadow-md"
                >
                  {t('get_a_quote.calcBtn')}
                </button>

                {/* Results */}
                {results && (() => {
                  const waText = t('get_a_quote.waTemplate')
                    .replace('{cbm}', results.cbm)
                    .replace('{weight}', results.actualWeight)
                    .replace('{destination}', '[Destination]')
                    .replace('{class}', results.classification.toLowerCase());
                  const waUrl = `https://wa.me/85261077362?text=${encodeURIComponent(waText)}`;

                  return (
                    <motion.div 
                      ref={resultsRef}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-purple-50/50 rounded-xl p-5 border border-purple-100"
                    >
                      {results.hasRate && (
                        <div className="mb-4 text-center">
                          <p className="text-sm text-slate-600 font-bold mb-1">{t('get_a_quote.estTotalFreight')}</p>
                          <p className="text-2xl font-black text-emerald-600">${results.minFreight} - ${results.maxFreight}</p>
                        </div>
                      )}
                      
                      <div className="space-y-2 mb-4 bg-white p-4 rounded-lg border border-purple-100/50">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">{t('get_a_quote.totalVolLabel')}</span>
                          <span className="font-bold text-slate-900">{results.cbm} CBM</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">{t('get_a_quote.actualWeightLabel').split(' (')[0]}:</span>
                          <span className="font-bold text-slate-900">{results.actualWeight} KG</span>
                        </div>
                        <div className="flex justify-between text-sm items-center pt-2 mt-2 border-t border-slate-100">
                          <span className="text-slate-900 font-bold">{t('get_a_quote.chargeableUnitsLabel')}</span>
                          <span className="text-[#4B27B1] text-lg font-black">{results.finalUnits} {results.finalUnitLabel}</span>
                        </div>
                      </div>
                      
                      <div className={`text-sm font-bold text-center py-2 px-3 rounded mb-4 shadow-sm ${results.isHeavy ? 'bg-orange-100 text-orange-800 border border-orange-200' : 'bg-purple-100 text-purple-800 border border-purple-200'}`}>
                        {t('get_a_quote.modeLabel')}: {results.classification}
                      </div>

                      {/* DDNZ Insight Tooltip */}
                      <div className="bg-white/90 rounded-lg shadow-sm border border-slate-200 p-3 mb-4 flex gap-3 items-start">
                        <Info className="w-5 h-5 text-[#4B27B1] shrink-0 mt-0.5" />
                        <div className="text-xs text-slate-600 leading-relaxed font-medium">
                          <p><span className="font-bold text-[#4B27B1]">{t('get_a_quote.insight')}</span> For your <span className="font-bold">{results.modeText}</span> shipment to <span className="font-bold">{results.destinationLabel}</span>, {t('get_a_quote.insightDesc')}</p>
                          {results.modeText === 'Road Freight' && results.landLane === 'Uzbekistan/Kazakhstan' && (
                            <p className="mt-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block">{t('get_a_quote.roadNote')}</p>
                          )}
                        </div>
                      </div>

                      <button 
                        onClick={() => window.open(waUrl, '_blank')}
                        className="mt-2 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] text-white py-3 rounded-lg font-bold text-sm hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                      >
                        <MessageCircle className="w-5 h-5" /> {t('get_a_quote.reqQuote')}
                      </button>
                      
                      <p className="text-[10px] text-slate-500 mt-4 leading-relaxed italic text-center">
                        {t('get_a_quote.fclNote')}
                      </p>
                    </motion.div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form or Success State */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-purple-100 p-8 md:p-10 flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden">
            {!isSubmitted ? (
              <>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{t('get_a_quote.formTitle')}</h3>
                <p className="text-sm text-slate-500 mb-8">{t('get_a_quote.formSubtitle')}</p>
                
                <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">{t('get_a_quote.fname')}</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#4B27B1] focus:border-transparent outline-none transition-all"
                        placeholder="John Doe / Acme Corp"
                      />
                      <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">{t('get_a_quote.email')}</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#4B27B1] focus:border-transparent outline-none transition-all"
                        placeholder="john@company.com"
                      />
                      <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="product" className="block text-sm font-medium text-slate-700 mb-1">{t('get_a_quote.industryLabel')}</label>
                    <select
                      id="product"
                      name="product"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#4B27B1] focus:border-transparent outline-none transition-all bg-white"
                    >
                      <option value="New Energy / ESS">{t('get_a_quote.indNev')}</option>
                      <option value="Commercial Furniture">{t('get_a_quote.indFurn')}</option>
                      <option value="Project Cargo / Heavy Lift">{t('get_a_quote.indProject')}</option>
                      <option value="Other">{t('get_a_quote.indOther')}</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="origin" className="block text-sm font-medium text-slate-700 mb-1">{t('get_a_quote.originLabel')}</label>
                      <input
                        id="origin"
                        name="origin"
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#4B27B1] focus:border-transparent outline-none transition-all"
                        placeholder={t('get_a_quote.originPlaceholder')}
                      />
                    </div>
                    <div>
                      <label htmlFor="destination" className="block text-sm font-medium text-slate-700 mb-1">{t('get_a_quote.destLabel')}</label>
                      <input
                        id="destination"
                        name="destination"
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#4B27B1] focus:border-transparent outline-none transition-all"
                        placeholder={t('get_a_quote.destPlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">{t('get_a_quote.cargo')}</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#4B27B1] focus:border-transparent outline-none transition-all resize-none"
                      placeholder={t('get_a_quote.msgPlaceholder')}
                    />
                    <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-500 text-xs mt-1" />
                  </div>

                  <div className="mt-auto pt-4">
                    <button
                      type="submit"
                      disabled={state.submitting}
                      className={`w-full text-white font-bold py-4 rounded-lg transition-all focus:ring-4 focus:ring-purple-200 outline-none flex items-center justify-center shadow-lg hover:-translate-y-0.5 ${
                        state.submitting ? 'bg-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-[#4B27B1] to-[#FF8A00] hover:shadow-xl'
                      }`}
                    >
                      {state.submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          {t('get_a_quote.submit')} <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </button>
                    {state.errors && (
                      <p className="mt-4 text-xs text-red-500 text-center">
                        Something went wrong. Please <a href="mailto:partnership@ddnzglobal.com" className="underline font-bold">email us directly.</a>
                      </p>
                    )}
                  </div>
                </form>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center bg-[#4B27B1] -m-8 md:-m-10 p-10 rounded-2xl"
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
                  className="text-white bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full text-sm font-medium transition-colors"
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
