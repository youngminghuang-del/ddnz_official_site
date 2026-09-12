import { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, Download, QrCode, X } from 'lucide-react';
import { CONTACT_QR, type ContactQrChannel } from '../../config/contactQr';
import { SOCIAL_CHANNELS } from '../../config/socialChannels';
import { useLanguage } from '../../contexts/LanguageContext';
import { trackEvent } from '../../lib/utils';
import { contactQrCopy } from './locales';
import './contact-qr.css';

export default function ContactQrCodes({
  tone = 'light', location = 'footer',
}: { tone?: 'light' | 'dark'; location?: string }) {
  const { language } = useLanguage();
  const copy = contactQrCopy[language] || contactQrCopy.en;
  const [selected, setSelected] = useState<ContactQrChannel | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const id = useId();
  const titleFor = (channel: ContactQrChannel) => channel === 'whatsapp' ? copy.whatsappTitle : copy.wechatTitle;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!selected || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [selected]);

  const track = (channel: ContactQrChannel, action: string) => {
    trackEvent(action === 'chat' ? 'whatsapp_click' : channel + '_qr_' + action, {
      cta_location: location, channel, cta_type: action,
    });
  };

  return (
    <section className={'contact-qr contact-qr--' + tone} aria-labelledby={id + '-heading'}>
      <h4 id={id + '-heading'} className="contact-qr__heading"><QrCode size={16} aria-hidden="true" />{copy.heading}</h4>
      <div className="contact-qr__grid">
        {(Object.keys(CONTACT_QR) as ContactQrChannel[]).map(channel => {
          const item = CONTACT_QR[channel];
          return (
            <button key={channel} type="button" className="contact-qr__card"
              aria-label={titleFor(channel)} aria-haspopup="dialog" aria-controls={id + '-dialog'}
              data-analytics-tracked="true"
              onClick={() => { setSelected(channel); track(channel, 'open'); }}>
              <img className="contact-qr__thumbnail" src={item.image} alt=""
                width={item.width} height={item.height} loading="lazy" decoding="async" />
              <span className="contact-qr__brand"><QrCode className="contact-qr__mobile-icon" size={18} aria-hidden="true" /><b>{item.label}</b></span>
              <span className="contact-qr__view">{copy.view}</span>
            </button>
          );
        })}
      </div>
      <dialog ref={dialogRef} id={id + '-dialog'} className="contact-qr__dialog"
        dir={language === 'ar' ? 'rtl' : 'ltr'} aria-labelledby={id + '-title'} aria-describedby={id + '-hint'}
        onClose={() => setSelected(null)}
        onClick={event => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}>
        {selected && <div className="contact-qr__panel">
          <div className="contact-qr__dialog-heading">
            <h2 id={id + '-title'}>{titleFor(selected)}</h2>
            <button type="button" className="contact-qr__close" autoFocus
              aria-label={copy.close} onClick={() => dialogRef.current?.close()}><X size={22} aria-hidden="true" /></button>
          </div>
          <img className="contact-qr__full" src={CONTACT_QR[selected].image} alt={titleFor(selected)}
            width={CONTACT_QR[selected].width} height={CONTACT_QR[selected].height} decoding="async" />
          <p id={id + '-hint'} className="contact-qr__hint">{selected === 'whatsapp' ? copy.whatsappHint : copy.wechatHint}</p>
          {selected === 'whatsapp' && <a className="contact-qr__chat" href={SOCIAL_CHANNELS.whatsapp.publicUrl}
            target="_blank" rel="noopener noreferrer" data-analytics-tracked="true"
            onClick={() => track('whatsapp', 'chat')}>{copy.chat}<ArrowUpRight size={18} aria-hidden="true" /></a>}
          <a className="contact-qr__save" href={CONTACT_QR[selected].image}
            download={'ddnz-' + selected + '-qr.jpg'} data-analytics-tracked="true"
            onClick={() => track(selected, 'save')}><Download size={18} aria-hidden="true" />{copy.save}</a>
        </div>}
      </dialog>
    </section>
  );
}
