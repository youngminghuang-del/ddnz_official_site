import { useState } from 'react';
import { Mail, Globe, Clock, FileText, Shield, Linkedin, Phone, Instagram, MessageCircle, Music2, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import LegalModal, { LegalType } from './LegalModal';
import { useLanguage } from '../contexts/LanguageContext';
import { trackEvent } from '../lib/utils';
import { PUBLIC_SOCIAL_CHANNELS } from '../config/socialChannels';

const socialIcons = {
  linkedin: Linkedin,
  facebook: Share2,
  instagram: Instagram,
  tiktok: Music2,
  whatsapp: MessageCircle,
};

export default function Footer() {
  const [legalType, setLegalType] = useState<LegalType>(null);
  const { t, language } = useLanguage();

  const handleContactClick = (method: string) => {
    const eventName = method === 'phone'
      ? 'phone_click'
      : method === 'email'
        ? 'email_click'
        : `${method}_click`;
    trackEvent(eventName, { cta_location: 'footer' });
  };

  const cookieLabel = {
    en: 'Cookie Settings',
    zh: 'Cookie 设置',
    ru: 'Настройки Cookie',
    fr: 'Paramètres des cookies'
  }[language as 'en' | 'zh' | 'ru' | 'fr'] || 'Cookie Settings';

  const qrCopy = {
    en: {
      title: 'Scan to connect',
      wechatAlt: 'WeChat QR code for contacting DDNZ and Heaven Born',
      whatsappAlt: 'WhatsApp Business QR code for contacting DDNZ and Heaven Born',
    },
    zh: {
      title: '扫码联系',
      wechatAlt: '联系 DDNZ 与华正邦泰的微信二维码',
      whatsappAlt: '联系 DDNZ 与华正邦泰的 WhatsApp Business 二维码',
    },
    ru: {
      title: 'Связаться по QR-коду',
      wechatAlt: 'QR-код WeChat для связи с DDNZ и Heaven Born',
      whatsappAlt: 'QR-код WhatsApp Business для связи с DDNZ и Heaven Born',
    },
    fr: {
      title: 'Scanner pour nous contacter',
      wechatAlt: 'Code QR WeChat pour contacter DDNZ et Heaven Born',
      whatsappAlt: 'Code QR WhatsApp Business pour contacter DDNZ et Heaven Born',
    },
    es: {
      title: 'Escanee para contactar',
      wechatAlt: 'Código QR de WeChat para contactar con DDNZ y Heaven Born',
      whatsappAlt: 'Código QR de WhatsApp Business para contactar con DDNZ y Heaven Born',
    },
    ar: {
      title: 'امسح الرمز للتواصل',
      wechatAlt: 'رمز WeChat للتواصل مع DDNZ وHeaven Born',
      whatsappAlt: 'رمز WhatsApp Business للتواصل مع DDNZ وHeaven Born',
    },
  }[language];

  return (
    <footer className="bg-[#071A33] text-slate-300 py-8 font-sans border-t border-[#12355A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Row: Brand & Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-x-8 lg:gap-y-0 mb-10 md:mb-12">
          
          {/* Column 1: Brand & Contact */}
          <div className="space-y-4 lg:space-y-6 md:col-span-2 lg:col-span-1">
            <div>
              <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                <img 
                  src="https://raw.githubusercontent.com/youngminghuang-del/ddnz_photo_assets/main/heaven_born_logo_wing_transparent.png" 
                  alt="Heaven Born International Freight Co., Ltd logo"
                  loading="lazy"
                  className="h-8 md:h-10 w-auto opacity-90"
                />
                <div className="flex flex-col select-none">
                  {language === 'zh' ? (
                    <>
                      <span className="text-lg md:text-xl font-black tracking-tight leading-none text-white font-sans">
                        华正邦泰
                      </span>
                      <span className="text-[10px] md:text-xs tracking-[0.2em] font-black uppercase text-sky-300 font-sans mt-1">
                        国际货运
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg md:text-xl font-extrabold tracking-tight leading-none text-white font-sans">
                        Heaven Born
                      </span>
                      <span className="text-[9px] md:text-xs tracking-[0.08em] font-black uppercase text-sky-300 font-sans mt-1 whitespace-nowrap">
                        International Freight
                      </span>
                    </>
                  )}
                </div>
              </div>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-xs italic lg:not-italic font-medium">
                {t('footer.slogan')}
              </p>
              <p className="max-w-xs border-l-2 border-[#F59E0B] pl-3 text-[11px] leading-5 text-slate-400">
                {language === 'zh'
                  ? 'DDNZ 负责市场内容、产品采购与贸易支持；华正邦泰承接中国始发国际货运操作。'
                  : language === 'es'
                    ? 'DDNZ gestiona contenido, abastecimiento y apoyo comercial; Heaven Born ejecuta la logística internacional desde China.'
                    : language === 'fr'
                      ? 'DDNZ gère le contenu, le sourcing et l’appui commercial ; Heaven Born exécute le fret international depuis la Chine.'
                      : language === 'ar'
                        ? 'تدير DDNZ المحتوى والتوريد والدعم التجاري، بينما تنفذ Heaven Born عمليات الشحن الدولي من الصين.'
                        : 'DDNZ runs the content, sourcing and trade-support desk; Heaven Born executes international freight operations from China.'}
              </p>
            </div>
            <div className="pt-1 flex flex-col gap-3">
              <a 
                href="tel:+862036546132" 
                data-analytics-tracked="true"
                onClick={() => handleContactClick('phone')}
                className="inline-flex items-center text-white hover:text-orange-400 transition-colors group font-medium text-xs md:text-sm"
              >
                <Phone className="w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3 text-[#FF8A00] group-hover:text-orange-400 transition-colors" />
                {language === 'zh' ? '020 - 3654 6132' : '+86 20 3654 6132'}
              </a>
              <a 
                href="mailto:partnership@ddnzglobal.com" 
                data-analytics-tracked="true"
                onClick={() => handleContactClick('email')}
                className="inline-flex items-center text-white hover:text-orange-400 transition-colors group font-medium text-xs md:text-sm"
              >
                <Mail className="w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3 text-[#FF8A00] group-hover:text-orange-400 transition-colors" />
                partnership@ddnzglobal.com
              </a>
              <div className="grid grid-cols-2 gap-2 pt-1" aria-label="DDNZ social channels">
                {PUBLIC_SOCIAL_CHANNELS.map((channel) => {
                  const Icon = socialIcons[channel.platform];
                  return (
                    <a
                      key={channel.platform}
                      href={channel.publicUrl}
                      data-analytics-tracked="true"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleContactClick(channel.platform)}
                      aria-label={`${channel.label}: ${channel.handle}`}
                      className="inline-flex min-h-10 items-center gap-2 border border-white/10 px-2.5 text-[11px] font-bold text-slate-200 transition-colors hover:border-[#F59E0B]/60 hover:bg-white/5 hover:text-white"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-[#F59E0B]" aria-hidden="true" />
                      <span>{channel.label}</span>
                    </a>
                  );
                })}
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{qrCopy.title}</p>
                <div className="grid max-w-[15rem] grid-cols-2 gap-2.5">
                  <figure className="border border-white/10 bg-[#0A2747]/80 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    <div className="aspect-square overflow-hidden bg-[#F8FAFC] p-1.5">
                      <img
                        src="/images/social/wechat-qr.jpg"
                        alt={qrCopy.wechatAlt}
                        width={512}
                        height={512}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <figcaption className="pt-2 text-center text-[10px] font-black tracking-[0.08em] text-slate-200">WECHAT</figcaption>
                  </figure>
                  <figure className="border border-white/10 bg-[#0A2747]/80 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    <div className="aspect-square overflow-hidden bg-[#F8FAFC] p-1.5">
                      <img
                        src="/images/social/whatsapp-business-qr.jpg"
                        alt={qrCopy.whatsappAlt}
                        width={512}
                        height={512}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <figcaption className="pt-2 text-center text-[10px] font-black tracking-[0.08em] text-slate-200">WHATSAPP</figcaption>
                  </figure>
                </div>
              </div>
            </div>
          </div>

          {/* Container for addresses */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:contents gap-4 md:gap-12 lg:gap-0 lg:col-span-2">
            {/* Column 2: Guangzhou HQ */}
            <div className="lg:px-4">
              <h4 className="text-[11px] md:text-sm font-semibold text-white mb-2 lg:mb-4 uppercase tracking-[0.12em] flex items-center">
                <Globe className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1 lg:mr-2 text-[#FF8A00]" /> {t('footer.hq')}
              </h4>
              <address className="not-italic text-[11px] md:text-sm text-slate-300 leading-tight md:leading-snug font-normal pl-3 border-l-2 border-[#1D4E78] transition-colors hover:border-[#F59E0B]">
                <div className="space-y-1">
                  {(() => {
                    const parts = t('footer.hq_addr').split(', ');
                    const line1 = parts.slice(0, 3).join(', ');
                    const line2 = parts.slice(3, 6).join(', ');
                    const line3 = parts.slice(6).join(', ');
                    return (
                      <>
                        <span className="block">{line1}</span>
                        <span className="block">{line2}</span>
                        <span className="block font-medium text-white mt-1">{line3}</span>
                      </>
                    );
                  })()}
                </div>
              </address>
            </div>

            {/* Column 3: Hong Kong Node */}
            <div>
              <h4 className="text-[11px] md:text-sm font-semibold text-white mb-2 lg:mb-4 uppercase tracking-[0.12em] flex items-center">
                <Globe className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1 lg:mr-2 text-[#FF8A00]" /> {t('footer.hk')}
              </h4>
              <address className="not-italic text-[11px] md:text-sm text-slate-300 leading-tight md:leading-snug font-normal pl-3 border-l-2 border-[#1D4E78] transition-colors hover:border-[#F59E0B]">
                <div className="space-y-1">
                  {(() => {
                    const parts = t('footer.hk_addr').split(', ');
                    const line1 = parts.slice(0, 2).join(', ');
                    const line2 = parts.slice(2, 4).join(', ');
                    const line3 = parts.slice(4).join(', ');
                    return (
                      <>
                        <span className="block">{line1}</span>
                        <span className="block">{line2}</span>
                        <span className="block font-medium text-white mt-1">{line3}</span>
                      </>
                    );
                  })()}
                </div>
              </address>
            </div>
          </div>

          {/* Column 4: Popular Shipping Lanes (SEO Matrix) */}
          <div className="md:col-span-2 lg:col-span-1 lg:px-4">
            <h4 className="text-[11px] md:text-sm font-semibold text-white mb-2 lg:mb-4 uppercase tracking-[0.12em] flex items-center">
              <Globe className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1 lg:mr-2 text-[#FF8A00]" /> Popular Shipping Lanes
            </h4>
            <ul className="space-y-3 pl-3 border-l-2 border-[#1D4E78] transition-colors hover:border-[#F59E0B]">
              <li>
                <Link 
                  to="/shipping-from-china-to-middle-east" 
                  className="block text-[11px] md:text-sm text-slate-300 hover:text-white transition-colors leading-snug font-medium"
                >
                  LCL & FCL Ocean Shipping to Saudi Arabia & UAE
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipping-from-china-to-central-asia" 
                  className="block text-[11px] md:text-sm text-slate-300 hover:text-white transition-colors leading-snug font-medium"
                >
                  Reliable Land Freight & Rail Logistics to Kazakhstan
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipping-from-china-to-west-africa" 
                  className="block text-[11px] md:text-sm text-slate-300 hover:text-white transition-colors leading-snug font-medium"
                >
                  Fast Air Freight Consolidation to Lagos, Nigeria
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipping-from-china-to-latin-america" 
                  className="block text-[11px] md:text-sm text-slate-300 hover:text-white transition-colors leading-snug font-medium"
                >
                  DDP/DDU Double Customs Clearance to Mexico & Brazil
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Middle Row: Hours & Legal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 p-6 rounded-2xl bg-[#0B2A4A] border border-[#1D4E78]">
          
          {/* Hours */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#12355A] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-1">{t('footer.hours')}</h4>
              <p className="text-sm text-slate-300">
                <span className="text-white font-medium">Mon - Fri:</span> 9:00 AM - 6:00 PM <span className="text-sky-300">(GMT+8)</span>
              </p>
            </div>
          </div>

          {/* Legal */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#12355A] flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-1">{t('footer.compliance')}</h4>
              <div className="flex flex-wrap items-center gap-4 text-sm mt-1">
                <button 
                  onClick={() => setLegalType('privacy')}
                  className="text-slate-300 hover:text-white transition-colors flex items-center group"
                >
                  <FileText className="w-3.5 h-3.5 mr-1.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  {t('footer.privacy')}
                </button>
                <span className="text-[#1D4E78] hidden sm:inline">|</span>
                <button 
                  onClick={() => setLegalType('terms')}
                  className="text-slate-300 hover:text-white transition-colors flex items-center group"
                >
                  <FileText className="w-3.5 h-3.5 mr-1.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  {t('footer.terms')}
                </button>
                <span className="text-[#1D4E78] hidden sm:inline">|</span>
                <button 
                  onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
                  className="text-slate-300 hover:text-white transition-colors flex items-center group"
                >
                  <FileText className="w-3.5 h-3.5 mr-1.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  {cookieLabel}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section: Copyright */}
        <div className="border-t border-[#1D4E78] pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
          <p>{t('footer.rights')}</p>
          <div className="mt-4 md:mt-0 uppercase font-bold tracking-tighter">
            <span>{t('footer.experts')}</span>
          </div>
        </div>
      </div>

      {/* Legal Modal */}
      <LegalModal type={legalType} onClose={() => setLegalType(null)} />
    </footer>
  );
}
