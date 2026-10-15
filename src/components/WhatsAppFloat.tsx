import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { buildAttributedWhatsAppUrl, readAttribution } from '../lib/attribution';

const copy = {
  en: { label: 'Contact us on WhatsApp', message: 'Hi DDNZ / Heaven Born, I’m interested in sourcing or logistics support from China. Can we talk?' },
  zh: { label: '通过 WhatsApp 联系我们', message: '您好，DDNZ / Heaven Born，我想咨询中国采购或货运服务，可以沟通一下吗？' },
  ru: { label: 'Связаться с нами в WhatsApp', message: 'Здравствуйте, DDNZ / Heaven Born! Меня интересуют услуги закупки или логистики из Китая. Можем обсудить?' },
  fr: { label: 'Nous contacter sur WhatsApp', message: 'Bonjour DDNZ / Heaven Born, je souhaite discuter de vos services de sourcing ou de logistique depuis la Chine. Pouvons-nous échanger ?' },
  es: { label: 'Contactarnos por WhatsApp', message: 'Hola DDNZ / Heaven Born, me interesan sus servicios de abastecimiento y logística desde China. ¿Podemos hablar?' },
  ar: { label: 'تواصل معنا عبر واتساب', message: 'مرحباً DDNZ / Heaven Born، أنا مهتم بخدمات التوريد والشحن من الصين. هل يمكننا التحدث؟' },
  pt: { label: 'Contactar pelo WhatsApp', message: 'Olá DDNZ / Heaven Born, tenho interesse em apoio de sourcing ou logística a partir da China. Podemos conversar?' },
  tr: { label: 'WhatsApp üzerinden iletişime geçin', message: 'Merhaba DDNZ / Heaven Born, Çin’den tedarik veya lojistik desteğiyle ilgileniyorum. Görüşebilir miyiz?' },
};

export default function WhatsAppFloat() {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const [clearance, setClearance] = useState(24);
  const [galleryBlocked, setGalleryBlocked] = useState(false);
  const excluded = /^\/(?:content-ops|design-preview)(?:\/|$)/.test(pathname);

  useEffect(() => {
    if (excluded) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let bottom = window.innerWidth < 768 ? 20 : 32;
        document.querySelectorAll('[data-cookie-banner], .opg-mobile-shortcuts, .ddnz-kitchen .floating-list, .ddnz-kitchen .toast').forEach(element => {
          const rect = element.getBoundingClientRect();
          if (getComputedStyle(element).position === 'fixed' && rect.width && rect.height && rect.top < window.innerHeight) {
            bottom = Math.max(bottom, window.innerHeight - rect.top + 16);
          }
        });
        const floating = document.querySelector('[data-whatsapp-float]')?.getBoundingClientRect();
        const overlapsGallery = window.innerWidth <= 820 && !!floating && [...document.querySelectorAll('.qatar-gallery-thumbnails, .oman-gallery-thumbnails, .market-gallery-controls, .market-gallery video, .market-gallery figcaption a')].some(element => {
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && rect.left < floating.right + 8 && rect.right > floating.left - 8 && rect.top < floating.bottom + 8 && rect.bottom > floating.top - 8;
        });
        setGalleryBlocked(current => current === overlapsGallery ? current : overlapsGallery);
        setClearance(current => current === bottom ? current : bottom);
        document.documentElement.style.setProperty('--contact-clearance', `${bottom}px`);
      });
    };
    const observer = new MutationObserver(update);
    observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('resize', update); window.removeEventListener('scroll', update); document.documentElement.style.removeProperty('--contact-clearance'); };
  }, [pathname, excluded, clearance]);

  if (excluded) return null;
  const handleClick = () => {
    const attribution = readAttribution();
    trackEvent('whatsapp_click', { cta_location: 'floating_button', utm_source: attribution.utm_source, utm_campaign: attribution.utm_campaign, utm_content: attribution.utm_content });
    window.open(buildAttributedWhatsAppUrl(copy[language].message, attribution), '_blank', 'noopener,noreferrer');
  };
  return <div data-floating-control data-whatsapp-float data-gallery-blocked={galleryBlocked || undefined} className="ddnz-whatsapp-float" style={{ bottom: `max(${clearance}px, calc(env(safe-area-inset-bottom) + 16px))` }}>
    <button type="button" data-analytics-tracked="true" onClick={handleClick} aria-label={copy[language].label} title={copy[language].label}>
      <svg viewBox="0 0 32 32" width="32" height="32" fill="none" aria-hidden="true">
        <path d="M26.8 15.5a11.3 11.3 0 0 1-16.7 9.9L4.5 27l1.6-5.4a11.3 11.3 0 1 1 20.7-6.1Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M11 9.5c-.5 0-1 .3-1.4.9-.5.7-.8 1.6-.5 2.8.8 3.8 4 7.1 7.8 8.2 1.2.4 2.3.2 3.1-.5.7-.6 1-1.4.9-1.8-.1-.3-2.7-1.5-3-1.4-.3.1-.9 1.1-1.2 1.2-.3.1-1.3-.4-2.4-1.3-1.2-1-1.9-2.2-1.9-2.5 0-.3.9-1 1-1.4.1-.3-1-3.6-1.4-3.9-.2-.2-.6-.3-1-.3Z" fill="currentColor"/>
      </svg>
    </button>
  </div>;
}
