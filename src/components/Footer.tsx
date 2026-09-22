import { useId, useState } from 'react';
import { ArrowRight, Clock3, Instagram, Linkedin, Mail, MapPin, MessageCircle, Music2, Phone, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import LegalModal, { LegalType } from './LegalModal';
import { useLanguage } from '../contexts/LanguageContext';
import { trackEvent } from '../lib/utils';
import { buildQuoteHref } from '../lib/quoteLinks';
import { canonicalSitePath } from '../lib/notionArticleRouting';
import { navigationPath } from '../lib/productLanguageRouting';
import { PUBLIC_SOCIAL_CHANNELS, SOCIAL_CHANNELS } from '../config/socialChannels';
import ContactQrCodes from './contact-qr/ContactQrCodes';
import { mobileCategoryNavigation } from '../config/mobileCategoryNavigation';
import { outdoorCategoryNavigation, outdoorOverviewNavigation } from '../config/outdoorCategoryNavigation';
import { screenProtectorNavigation } from '../config/screenProtectorNavigation';
import { COMPANY, companyName } from '../config/companyIdentity';
import { siteFooterCopy } from './site-footer/locales';
import { siteNavigation } from '../config/siteNavigation';
import './site-footer/site-footer.css';

type FooterProps = { quotePath?: string; footerId?: string; pageKey?: string; description?: string; tagline?: string; pageLinks?: {href: string; label: string}[]; note?: string };
const socialIcons = { linkedin: Linkedin, facebook: Share2, instagram: Instagram, tiktok: Music2, whatsapp: MessageCircle };
const footerServiceCopy = {
  en: { heading: 'Sourcing services', overview: 'Service overview', supplier: 'Supplier search & comparison', quality: 'Inspection & quality control', consolidation: 'Consolidation & export', process: 'How the process works' },
  zh: { heading: '采购服务', overview: '服务总览', supplier: '供应商搜索与比价', quality: '验货与质量控制', consolidation: '集货与出口交付', process: '查看完整服务流程' },
  ru: { heading: 'Услуги закупки', overview: 'Обзор услуг', supplier: 'Поиск и сравнение поставщиков', quality: 'Инспекция и контроль качества', consolidation: 'Консолидация и экспорт', process: 'Как устроен процесс' },
  fr: { heading: 'Services achats', overview: 'Vue d’ensemble', supplier: 'Recherche et comparaison', quality: 'Inspection et contrôle qualité', consolidation: 'Consolidation et export', process: 'Voir le processus' },
  es: { heading: 'Servicios de compra', overview: 'Resumen de servicios', supplier: 'Búsqueda y comparación', quality: 'Inspección y control de calidad', consolidation: 'Consolidación y exportación', process: 'Cómo funciona el proceso' },
  ar: { heading: 'خدمات التوريد', overview: 'نظرة عامة على الخدمات', supplier: 'البحث عن الموردين والمقارنة', quality: 'الفحص ومراقبة الجودة', consolidation: 'التجميع والتصدير', process: 'كيف تعمل العملية' },
  pt: { heading: 'Serviços de sourcing', overview: 'Visão geral', supplier: 'Busca e comparação de fornecedores', quality: 'Inspeção e controle de qualidade', consolidation: 'Consolidação e exportação', process: 'Como funciona o processo' },
  tr: { heading: 'Tedarik hizmetleri', overview: 'Hizmetlere genel bakış', supplier: 'Tedarikçi arama ve karşılaştırma', quality: 'Denetim ve kalite kontrol', consolidation: 'Konsolidasyon ve ihracat', process: 'Süreç nasıl işler' },
} as const;

export default function Footer({ quotePath, footerId, pageKey = 'site', description, tagline, pageLinks = [], note }: FooterProps = {}) {
  const [legalType, setLegalType] = useState<LegalType>(null);
  const { t, language } = useLanguage();
  const copy = siteFooterCopy[language];
  const id = useId();
  const localizedPath = (path: string) => navigationPath(path, language);
  const quoteHref = quotePath ? localizedPath(quotePath) : buildQuoteHref({ intent: 'Product Sourcing', language, source: 'footer_primary' });
  const handleContactClick = (method: string) => trackEvent(method + '_click', { cta_location: 'footer', showcase_page: pageKey });
  const productLinks = [
    { label: copy.kitchen, to: localizedPath('/sourcing/commercial-kitchen-equipment-from-china') },
    { label: copy.audio, to: localizedPath('/sourcing/audio-speakers-from-china') },
    { label: copy.mobile, to: localizedPath('/sourcing/mobile-accessories-from-china') },
    ...mobileCategoryNavigation(language).slice(0,2).map(item => ({...item,to:localizedPath(item.to)})),
    screenProtectorNavigation(language),
    ...[outdoorOverviewNavigation(language), outdoorCategoryNavigation(language)[3]].map(item => ({ ...item, to: localizedPath(item.to) })),
  ];
  const marketLinks = [
    { label: copy.middleEast, to: localizedPath('/shipping-from-china-to-middle-east') },
    { label: copy.centralAsia, to: localizedPath('/shipping-from-china-to-central-asia') },
    { label: copy.westAfrica, to: localizedPath('/shipping-from-china-to-west-africa') },
    { label: copy.latinAmerica, to: localizedPath('/shipping-from-china-to-latin-america') },
  ];
  const serviceCopy = footerServiceCopy[language];
  const serviceLinks = [
    { label: serviceCopy.overview, to: localizedPath(siteNavigation.sourcingServices[0]) },
    { label: serviceCopy.supplier, to: localizedPath(siteNavigation.sourcingServices[1]) },
    { label: serviceCopy.quality, to: localizedPath(siteNavigation.sourcingServices[2]) },
    { label: serviceCopy.consolidation, to: localizedPath(siteNavigation.sourcingServices[3]) },
    { label: serviceCopy.process, to: localizedPath(siteNavigation.process) },
  ];
  const contextualLinks = language === 'en' ? pageLinks.filter(link => link.href !== '/screen-protectors') : [];
  return (
    <footer lang={language === 'zh' ? 'zh-CN' : language} id={footerId} className="showcase-contact-footer ddnz-footer" dir={language === 'ar' ? 'rtl' : 'ltr'} data-site-footer="unified">
      <div className="ddnz-footer__inner">
        <div className="ddnz-footer__top">
          <section className="ddnz-footer__brand">
            <Link to={localizedPath('/')} aria-label={COMPANY.brand + ' — ' + copy.home} className="ddnz-footer__logo">
              <img src="/images/brand/ddnz-global-mark-v1.png" width="512" height="512" alt="" loading="lazy" decoding="async" />
              <span><strong>{COMPANY.brand}</strong><small>{copy.brandLine}</small></span>
            </Link>
            {language === 'zh' && <p className="ddnz-footer__company">{COMPANY.zh}</p>}
            <p>{language === 'en' && description ? description : copy.brandDescriptor}</p>
            {language === 'en' && tagline && <span className="ddnz-footer__tagline">{tagline}</span>}
            <Link to={quoteHref} className="ddnz-footer__cta" onClick={() => trackEvent('cta_click', { cta_location: 'footer', cta_type: 'sourcing_brief' })}>
              {copy.primaryCta}<ArrowRight size={17} aria-hidden="true" />
            </Link>
          </section>
          <section className="ddnz-footer__contact" aria-labelledby={id + '-contact'}>
            <p className="ddnz-footer__eyebrow">{copy.official}</p>
            <h2 id={id + '-contact'}>{copy.talk}</h2>
            <div className="ddnz-footer__direct">
              <a href="mailto:partnership@ddnzglobal.com" data-analytics-tracked="true" onClick={() => handleContactClick('email')}><Mail size={19} aria-hidden="true"/><span>partnership@ddnzglobal.com</span></a>
              <a href="tel:+862036546132" data-analytics-tracked="true" onClick={() => handleContactClick('phone')}><Phone size={19} aria-hidden="true"/><bdi>{language === 'zh' ? '020 3654 6132' : '+86 20 3654 6132'}</bdi></a>
              <a href={SOCIAL_CHANNELS.whatsapp.publicUrl} target="_blank" rel="noopener noreferrer" data-analytics-tracked="true" onClick={() => handleContactClick('whatsapp')}><MessageCircle size={19} aria-hidden="true"/><span>WhatsApp <bdi>{SOCIAL_CHANNELS.whatsapp.handle}</bdi></span></a>
            </div>
            <nav className="ddnz-footer__socials" aria-label={copy.socialLabel}>
              {PUBLIC_SOCIAL_CHANNELS.filter(c => c.platform !== 'whatsapp').map(channel => { const Icon = socialIcons[channel.platform]; return (
                <a key={channel.platform} href={channel.publicUrl} target="_blank" rel="noopener noreferrer" aria-label={channel.label + ': ' + channel.handle} data-analytics-tracked="true" onClick={() => handleContactClick(channel.platform)}><Icon size={17} aria-hidden="true"/>{channel.label}</a>
              ); })}
            </nav>
          </section>
          <div className="ddnz-footer__qr"><ContactQrCodes tone="light" location={'footer_' + pageKey} /></div>
        </div>
        <div className="ddnz-footer__navigation">
          <nav aria-labelledby={id + '-products'}><h3 id={id + '-products'}>{copy.categories}</h3><ul>{productLinks.map(item => <li key={item.to}><Link to={canonicalSitePath(item.to)}>{item.label}</Link></li>)}</ul></nav>
          <nav aria-labelledby={id + '-services'}><h3 id={id + '-services'}>{serviceCopy.heading}</h3><ul>{serviceLinks.map(item => <li key={item.to}><Link to={item.to}>{item.label}</Link></li>)}</ul></nav>
          <nav aria-labelledby={id + '-markets'}><h3 id={id + '-markets'}>{copy.markets}</h3><ul>{marketLinks.map(item => <li key={item.to}><Link to={item.to}>{item.label}</Link></li>)}</ul></nav>
          <section className="ddnz-footer__operations">
            <h3>{copy.freight}</h3><p>{language === 'zh' ? COMPANY.freightZh : COMPANY.freightEn}</p><p>{copy.hbLabel}</p>
            <address><MapPin size={15} aria-hidden="true"/><span>{t('footer.hq')} · {t('footer.hk')}</span></address>
            <p><Clock3 size={15} aria-hidden="true"/>{copy.hours}</p>
          </section>
        </div>
        {contextualLinks.length > 0 && <nav aria-label={copy.onPage} className="ddnz-footer__page-links">{contextualLinks.map(link => <a href={link.href.startsWith('/') ? canonicalSitePath(link.href) : link.href} key={link.href}>{link.label}</a>)}</nav>}
        <div className="ddnz-footer__bottom">
          <div><p>{copy.legalNote}</p><p>© 2026 {companyName(language)} · {copy.rights}</p>{language === 'en' && note && <p>{note}</p>}</div>
          <div className="ddnz-footer__legal">
            <Link to={localizedPath('/insights')}>{copy.insights}</Link>
            <button type="button" onClick={() => setLegalType('privacy')}>{t('footer.privacy')}</button>
            <button type="button" onClick={() => setLegalType('terms')}>{t('footer.terms')}</button>
            <button type="button" onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}>{copy.cookie}</button>
          </div>
        </div>
      </div>
      <LegalModal type={legalType} onClose={() => setLegalType(null)} />
    </footer>
  );
}
