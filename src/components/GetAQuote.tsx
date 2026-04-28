import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Calculator, Info, ArrowRight, MessageCircle } from 'lucide-react';

type FormData = {
  name: string;
  email: string;
  product: string;
  origin: string;
  destination: string;
  volume: string;
  weight: string;
  message: string;
};

type TransportMode = 'sea' | 'land' | 'air';

export default function GetAQuote() {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>();
  const watchDestination = watch('destination');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estimator State
  const [mode, setMode] = useState<TransportMode>('sea');
  const [seaLane, setSeaLane] = useState<'SA/SEA' | 'EA/EU'>('SA/SEA');
  const [length, setLength] = useState<number | ''>('');
  const [width, setWidth] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [manualCbm, setManualCbm] = useState<number | ''>('');
  const [actualWeight, setActualWeight] = useState<number | ''>('');
  const [baseRate, setBaseRate] = useState<number | ''>('');
  const [cargoType, setCargoType] = useState<'General' | 'NEV'>('General');
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
      alert('Please enter dimensions/quantity or Total CBM, and Actual Weight.');
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
      modeText = 'Air/Express';
    } else if (mode === 'sea') {
      modeText = 'Sea LCL';
      if (seaLane === 'EA/EU') {
         factor = 1000;
         ratioText = '1:1000';
         destinationLabel = 'Eastern Europe / Europe';
      } else {
         factor = 500;
         ratioText = '1:500';
         destinationLabel = 'South America / Southeast Asia';
      }
    } else if (mode === 'land') {
      factor = 500;
      ratioText = '1:500';
      destinationLabel = 'Central Asia';
      modeText = 'Road Freight';
    }

    const actualWeightNum = Number(actualWeight) || 0;
    const volumeNum = cbm;

    const density = volumeNum > 0 ? actualWeightNum / volumeNum : actualWeightNum;
    const isHeavy = density > factor;
    const classification = isHeavy ? 'Heavy Cargo (Charged by Weight)' : 'Light/Light-bubble Cargo (Charged by Volume)';

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
      totalFreight = baseFreight * (cargoType === 'NEV' ? 1.25 : 1);
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
      modeText
    });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("https://formsubmit.co/ajax/1bc24f86a9457c4bc4bf3ed157c32ead", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          ...data,
          _subject: `🚀 New Web Inquiry: ${data.product} | ${data.name}`,
          _template: "table",
        }),
      });

      const result = await response.json();

      if (response.ok && result.success === "true") {
        alert('Thank you! Your inquiry has been prioritized. A DDNZ senior expert will contact you via email within 24 hours.');
        reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error("Form Error:", error);
      alert('System busy. Please try again later or contact us directly via our official email for an immediate quote.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="get-a-quote" className="py-24 bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight uppercase">Logistics Tools & Inquiry</h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Use our professional Chargeable Weight Estimator for instant volume assessment, or submit a detailed inquiry to our senior team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-stretch">
          
          {/* Left Column: Estimator */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Rate Estimator</h3>
            </div>

            <div className="flex-1 flex flex-col space-y-6">
              {/* Transport Mode */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Transport Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['sea', 'land', 'air'] as TransportMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`py-2 text-sm font-bold rounded-lg border transition-all ${
                        mode === m 
                          ? 'border-blue-600 bg-blue-50 text-blue-700' 
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {m.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lane Selection dependent on Mode */}
              {mode === 'sea' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Select Sea Freight Lane</label>
                  <select 
                    value={seaLane} 
                    onChange={(e) => setSeaLane(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm font-medium rounded bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
                  >
                    <option value="SA/SEA">South America / SE Asia (1 CBM = 500 KG)</option>
                    <option value="EA/EU">Eastern Europe / Europe (1 CBM = 1000 KG)</option>
                  </select>
                </div>
              )}
              {mode === 'land' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Land Freight Lane</label>
                  <div className="px-3 py-2 text-sm font-medium rounded bg-slate-50 border border-slate-200 text-slate-600">
                    Central Asia Road (1 CBM = 500 KG)
                  </div>
                </div>
              )}
              {mode === 'air' && (
               <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Air Freight Lane</label>
                  <div className="px-3 py-2 text-sm font-medium rounded bg-slate-50 border border-slate-200 text-slate-600">
                    Global Express/Air (1 CBM = 167 KG)
                  </div>
                </div>
              )}

              {/* Dimensions Input */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-bold text-slate-700">Dimensions (Build-up CBM)</label>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  <input type="number" placeholder="L(cm)" value={length} onChange={(e) => setLength(Number(e.target.value) || '')} className="w-full px-2 py-2 text-sm rounded bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none" />
                  <input type="number" placeholder="W(cm)" value={width} onChange={(e) => setWidth(Number(e.target.value) || '')} className="w-full px-2 py-2 text-sm rounded bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none" />
                  <input type="number" placeholder="H(cm)" value={height} onChange={(e) => setHeight(Number(e.target.value) || '')} className="w-full px-2 py-2 text-sm rounded bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none" />
                  <input type="number" placeholder="Qty" value={quantity} onChange={(e) => setQuantity(Number(e.target.value) || '')} className="w-full px-2 py-2 text-sm rounded bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none" />
                </div>
                <div className="flex items-start gap-2 mb-4">
                  <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500 italic">Please use the max protrusion point for measurement.</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200"></div>
                  <span className="text-xs font-bold text-slate-400 uppercase">OR OVERRIDE CBM</span>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Total CBM</label>
                  <input 
                    type="number" 
                    placeholder={`Auto: ${calculateAutoCbm().toFixed(3)} CBM`}
                    value={manualCbm} 
                    onChange={(e) => setManualCbm(Number(e.target.value) || '')} 
                    className="w-full px-3 py-2 rounded bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none" 
                  />
                </div>
              </div>

              {/* Weight, Cargo Type & Rate */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Actual Weight (KG)</label>
                  <input 
                    type="number" 
                    value={actualWeight} 
                    onChange={(e) => setActualWeight(Number(e.target.value) || '')} 
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Cargo Category</label>
                  <select
                    value={cargoType}
                    onChange={(e) => setCargoType(e.target.value as 'General' | 'NEV')}
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="General">General / Standard</option>
                    <option value="NEV">NEV / Base Station</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Base Rate ($)</label>
                <input 
                  type="number" 
                  placeholder="Optional (Input rate per Chargeable Unit)"
                  value={baseRate} 
                  onChange={(e) => setBaseRate(Number(e.target.value) || '')} 
                  className="w-full px-3 py-2 rounded border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none" 
                />
              </div>

              <div className="mt-auto pt-4 space-y-4">
                <button
                  type="button"
                  onClick={handleCalculate}
                  className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
                >
                  Calculate Chargeable Weight
                </button>

                {/* Results */}
                {results && (() => {
                  const waText = `Hi DDNZ, I just used your Rate Tool. My shipment is ${results.cbm} CBM / ${results.actualWeight} KG to ${watchDestination || '[Destination]'}. It's detected as ${results.classification.toLowerCase()}. Can I get a final firm quote?`;
                  const waUrl = `https://wa.me/85261077362?text=${encodeURIComponent(waText)}`;

                  return (
                    <motion.div 
                      ref={resultsRef}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-blue-50 rounded-xl p-5 border border-blue-100"
                    >
                      {results.hasRate && (
                        <div className="mb-4 text-center">
                          <p className="text-sm text-slate-600 font-bold mb-1">Estimated Total Freight:</p>
                          <p className="text-2xl font-black text-emerald-600">${results.minFreight} - ${results.maxFreight}</p>
                        </div>
                      )}
                      
                      <div className="space-y-2 mb-4 bg-white p-4 rounded-lg border border-blue-100/50">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Total Volume:</span>
                          <span className="font-bold text-slate-900">{results.cbm} CBM</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Actual Weight:</span>
                          <span className="font-bold text-slate-900">{results.actualWeight} KG</span>
                        </div>
                        <div className="flex justify-between text-sm items-center pt-2 mt-2 border-t border-slate-100">
                          <span className="text-slate-900 font-bold">Chargeable Units:</span>
                          <span className="text-blue-700 text-lg font-black">{results.finalUnits} {results.finalUnitLabel}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 text-right uppercase tracking-wider">(Based on {results.ratio} weight/volume ratio)</p>
                      </div>
                      
                      <div className={`text-sm font-bold text-center py-2 px-3 rounded mb-4 shadow-sm ${results.isHeavy ? 'bg-orange-100 text-orange-800 border border-orange-200' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
                        Mode: {results.classification}
                      </div>

                      {/* DDNZ Insight Tooltip */}
                      <div className="bg-white/90 rounded-lg shadow-sm border border-slate-200 p-3 mb-4 flex gap-3 items-start">
                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          <span className="font-bold text-blue-700">DDNZ Insight:</span> For your <span className="font-bold">{results.modeText}</span> shipment to <span className="font-bold">{results.destinationLabel}</span>, we use a density ratio of <span className="font-bold text-slate-800">{results.ratio}</span> to ensure fair market pricing.
                        </p>
                      </div>

                      <button 
                        onClick={() => window.open(waUrl, '_blank')}
                        className="mt-2 w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#20bd5a] transition-colors shadow-md"
                      >
                        <MessageCircle className="w-5 h-5" /> Request Firm Quote
                      </button>
                      
                      <p className="text-[10px] text-slate-500 mt-4 leading-relaxed italic text-center">
                        * FCL (Full Container Load) is quoted separately. Pricing excludes local origin/destination charges and duties.
                      </p>
                    </motion.div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl p-8 md:p-10 flex flex-col h-full">
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Get Your Tailored Logistics Plan</h3>
            <p className="text-sm text-slate-500 mb-8">Fill out the details for a comprehensive quote and routing options.</p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-1 flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name / Company</label>
                  <input
                    id="name"
                    type="text"
                    {...register('name', { required: true })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe / Acme Corp"
                  />
                  {errors.name && <span className="text-red-500 text-xs mt-1">This field is required</span>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Corporate Email Address</label>
                  <input
                    id="email"
                    type="email"
                    {...register('email', { required: true })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="john@company.com"
                  />
                  {errors.email && <span className="text-red-500 text-xs mt-1">This field is required</span>}
                </div>
              </div>

              <div>
                <label htmlFor="product" className="block text-sm font-medium text-slate-700 mb-1">Industry / Product Category</label>
                <select
                  id="product"
                  {...register('product', { required: true })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="New Energy / ESS">New Energy / Energy Storage Systems (ESS)</option>
                  <option value="Commercial Furniture">Commercial Furniture Engineering</option>
                  <option value="Project Cargo / Heavy Lift">Project Cargo / Heavy Lift</option>
                  <option value="Other">Other (General Cargo)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="origin" className="block text-sm font-medium text-slate-700 mb-1">Origin Port / City</label>
                  <input
                    id="origin"
                    type="text"
                    {...register('origin', { required: true })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., Guangzhou, Shenzhen"
                  />
                  {errors.origin && <span className="text-red-500 text-xs mt-1">This field is required</span>}
                </div>
                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-slate-700 mb-1">Destination Port / Country</label>
                  <input
                    id="destination"
                    type="text"
                    {...register('destination', { required: true })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., Malaysia, Saudi Arabia"
                  />
                  {errors.destination && <span className="text-red-500 text-xs mt-1">This field is required</span>}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Project Specifications & Requirements</label>
                <textarea
                  id="message"
                  rows={4}
                  {...register('message', { required: true })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Please provide details regarding your cargo, timeline, and any special handling requirements..."
                />
                {errors.message && <span className="text-red-500 text-xs mt-1">This field is required</span>}
              </div>

              <div className="mt-auto pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full text-white font-bold py-4 rounded-lg transition-colors focus:ring-4 focus:ring-blue-200 outline-none flex items-center justify-center shadow-lg ${
                    isSubmitting ? 'bg-slate-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : (
                    <>
                      Submit Inquiry for Priority Review <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
