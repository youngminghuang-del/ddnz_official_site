import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

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

export default function GetAQuote() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // 使用您的专属加密密钥：d75100350d3b94cdb97787821c3ba639
      // 这样可以完全隐藏 services@ddnzglobal.com 真实地址
      const response = await fetch("https://formsubmit.co/ajax/d75100350d3b94cdb97787821c3ba639", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          ...data,
          _subject: `🚀 New Web Inquiry: ${data.product} | ${data.name}`,
          _template: "table", // 邮件将以整齐的表格形式呈现
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
      alert('System busy. Please contact us directly via email (services@ddnzglobal.com) for an immediate quote.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="get-a-quote" className="py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">REQUEST A QUOTE</h2>
          <p className="mt-4 text-lg text-slate-600">Connect with our senior supply chain experts for specialized logistics solutions.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                <option value="Other">Other</option>
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
                  placeholder="e.g., Malaysia, Saudi Arabia, UAE, or Kazakhstan"
                />
                {errors.destination && <span className="text-red-500 text-xs mt-1">This field is required</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="volume" className="block text-sm font-medium text-slate-700 mb-1">Estimated Volume (CBM / TEU)</label>
                <input
                  id="volume"
                  type="text"
                  {...register('volume')}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g., 20 CBM or 1x40HQ"
                />
              </div>
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-slate-700 mb-1">Estimated Gross Weight (KG / Tons)</label>
                <input
                  id="weight"
                  type="text"
                  {...register('weight')}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g., 5000 KG"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Project Specifications & Requirements</label>
              <textarea
                id="message"
                rows={4}
                {...register('message', { required: true })}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Please provide details regarding your cargo, timeline, and any special handling requirements (e.g., DG cargo, oversized equipment)..."
              />
              {errors.message && <span className="text-red-500 text-xs mt-1">This field is required</span>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full text-white font-medium py-4 rounded-lg transition-colors focus:ring-4 focus:ring-slate-200 outline-none ${
                isSubmitting ? 'bg-slate-600 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Inquiry for Priority Review'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
