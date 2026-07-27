import { MessageCircle } from 'lucide-react';
import { trackEvent } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

export default function WhatsAppFloat() {
  const { language } = useLanguage();
  const handleClick = () => {
    trackEvent('contact_whatsapp_click', { 'location': 'floating_button' });
    const message = language === 'es'
      ? 'Hola%20Heaven%20Born,%20me%20interesan%20sus%20servicios%20log%C3%ADsticos.%20%C2%BFPodemos%20hablar%3F'
      : language === 'ar'
      ? '%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20Heaven%20Born%D8%8C%20%D8%A3%D9%87%D8%AA%D9%85%20%D8%A8%D8%AE%D8%AF%D9%85%D8%A7%D8%AA%D9%83%D9%85%20%D8%A7%D9%84%D9%84%D9%88%D8%AC%D8%B3%D8%AA%D9%8A%D8%A9.%20%D9%87%D9%84%20%D9%8A%D9%85%D9%83%D9%86%D9%86%D8%A7%20%D8%A7%D9%84%D8%AA%D8%AD%D8%AF%D8%AB%D8%9F'
      : 'Hi%20Heaven%20Born,%20I%27m%20interested%20in%20your%20logistics%20services.%20Can%20we%20talk%3F';
    const url = `https://wa.me/85261077362?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 md:bottom-10 right-6 z-50 flex items-center justify-center">
      {/* 脉冲动画背景，增加“活人感” */}
      <div className="absolute inset-0 rounded-full bg-[#25D366] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-40"></div>
      
      {/* 主按钮 */}
      <button
        onClick={handleClick}
        className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all duration-300"
        aria-label={language === 'es' ? 'Contactarnos por WhatsApp' : language === 'ar' ? 'تواصل معنا عبر واتساب' : 'Contact us on WhatsApp'}
      >
        <MessageCircle className="w-7 h-7 md:w-8 md:h-8" />
      </button>
    </div>
  );
}
