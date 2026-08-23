import { MessageCircle } from 'lucide-react';
import { trackEvent } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { buildAttributedWhatsAppUrl, readAttribution } from '../lib/attribution';

export default function WhatsAppFloat() {
  const { language } = useLanguage();
  const handleClick = () => {
    const attribution = readAttribution();
    trackEvent('whatsapp_click', {
      cta_location: 'floating_button',
      utm_source: attribution.utm_source,
      utm_campaign: attribution.utm_campaign,
      utm_content: attribution.utm_content,
    });
    const baseMessage = language === 'es'
      ? 'Hola DDNZ / Heaven Born, me interesan sus servicios de abastecimiento y logística desde China. ¿Podemos hablar?'
      : language === 'ar'
        ? 'مرحباً DDNZ / Heaven Born، أنا مهتم بخدمات التوريد والشحن من الصين. هل يمكننا التحدث؟'
        : language === 'pt'
          ? 'Olá DDNZ / Heaven Born, tenho interesse em apoio de sourcing ou logística a partir da China. Podemos conversar?'
          : language === 'tr'
            ? 'Merhaba DDNZ / Heaven Born, Çin’den tedarik veya lojistik desteğiyle ilgileniyorum. Görüşebilir miyiz?'
        : 'Hi DDNZ / Heaven Born, I’m interested in sourcing or logistics support from China. Can we talk?';
    const url = buildAttributedWhatsAppUrl(baseMessage, attribution);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center rtl:left-6 rtl:right-auto md:bottom-10">
      {/* 脉冲动画背景，增加“活人感” */}
      <div className="absolute inset-0 rounded-full bg-[#25D366] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-40"></div>
      
      {/* 主按钮 */}
      <button
        onClick={handleClick}
        className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all duration-300"
        aria-label={language === 'es' ? 'Contactarnos por WhatsApp' : language === 'ar' ? 'تواصل معنا عبر واتساب' : language === 'pt' ? 'Contactar pelo WhatsApp' : language === 'tr' ? 'WhatsApp üzerinden iletişime geçin' : 'Contact us on WhatsApp'}
      >
        <MessageCircle className="w-7 h-7 md:w-8 md:h-8" />
      </button>
    </div>
  );
}
