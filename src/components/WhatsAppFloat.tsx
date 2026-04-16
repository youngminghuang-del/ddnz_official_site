import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat() {
  const handleClick = () => {
    const url = 'https://wa.me/85261077362?text=Hi%20DDNZ%20Global,%20I%27m%20interested%20in%20your%20logistics%20services.%20Can%20we%20talk?';
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center">
      {/* 脉冲动画背景，增加“活人感” */}
      <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75 duration-1000"></div>
      
      {/* 主按钮 */}
      <button
        onClick={handleClick}
        className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 md:w-8 md:h-8" />
      </button>
    </div>
  );
}
