import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Insights() {
  const { t } = useLanguage();

  useEffect(() => {
    // 埋点同步: insights_section_view
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'insights_section_view', { 
        'event_category': 'Engagement',
        'event_label': 'Insights Section View'
      });
    }

    // Load Elfsight Script
    const script = document.createElement('script');
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up script if necessary - though often we keep it if global
      // but for React SPA hygiene we can remove it. 
      // Note: Elfsight might have already initialized widgets.
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <section id="insights" className="py-16 md:py-32 bg-white font-sans border-t border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <div className="text-[#FF8A00] font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase mb-3">
            {t('insights.label')}
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#4B27B1] leading-tight flex items-center justify-center gap-x-4 mb-4">
            <span className="hidden md:inline-block w-12 md:w-20 h-1 bg-[#FF8A00] rounded-full" />
            {t('insights.title')}
            <span className="inline-block w-12 md:w-20 h-1 bg-[#FF8A00] rounded-full" />
          </h2>
          <p className="text-slate-500 text-sm md:text-xl max-w-2xl mx-auto leading-relaxed">
            {t('insights.subtitle')}
          </p>
        </div>

        {/* Elfsight LinkedIn Feed Implementation */}
        <div className="pt-10 md:pt-20 overflow-hidden">
          <div 
            className="elfsight-app-e6692636-31f6-4bb1-b8eb-8774bffd7093" 
            data-elfsight-app-lazy 
          />
        </div>
      </div>
    </section>
  );
}

