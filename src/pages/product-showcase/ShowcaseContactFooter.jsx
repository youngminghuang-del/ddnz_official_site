import {
  ArrowUpRight,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Music2,
  Phone,
  QrCode,
  Share2,
} from "lucide-react";
import { PUBLIC_SOCIAL_CHANNELS, SOCIAL_CHANNELS } from "../../config/socialChannels";
import { trackEvent } from "../../lib/utils";
import "./showcase-contact-footer.css";

const OFFICIAL_CONTACT = {
  email: "partnership@ddnzglobal.com",
  phoneDisplay: "+86 20 3654 6132",
  phoneHref: "tel:+862036546132",
};

const socialIcons = {
  linkedin: Linkedin,
  facebook: Share2,
  instagram: Instagram,
  tiktok: Music2,
};

function trackContact(pageKey, channel, ctaType = "link") {
  const eventName = channel === "wechat"
    ? "wechat_qr_click"
    : `${channel}_click`;

  trackEvent(eventName, {
    cta_location: "product_showcase_footer",
    showcase_page: pageKey,
    channel,
    cta_type: ctaType,
  });
}

export default function ShowcaseContactFooter({
  footerId,
  pageKey,
  description,
  tagline,
  links = [],
  note,
}) {
  const socialChannels = PUBLIC_SOCIAL_CHANNELS.filter(({ platform }) => platform !== "whatsapp");
  const whatsapp = SOCIAL_CHANNELS.whatsapp;

  return (
    <footer id={footerId} className="showcase-contact-footer" aria-labelledby={`${pageKey}-contact-title`}>
      <div className="scf-grid">
        <section className="scf-brand-block">
          <a className="scf-brand" href="/" aria-label="DDNZ Global home">
            <img src="/images/brand/ddnz-global-mark-v1.png" alt="" width="512" height="512" loading="lazy" decoding="async" />
            <span><strong>DDNZ GLOBAL</strong><small>CHINA SOURCING &amp; EXPORT</small></span>
          </a>
          <p>{description}</p>
          {tagline ? <strong className="scf-tagline">{tagline}</strong> : null}
        </section>

        <section className="scf-contact-block">
          <p className="scf-kicker">OFFICIAL CONTACT</p>
          <h2 id={`${pageKey}-contact-title`}>Talk to the China team.</h2>
          <div className="scf-direct-links">
            <a
              href={`mailto:${OFFICIAL_CONTACT.email}`}
              data-analytics-tracked="true"
              onClick={() => trackContact(pageKey, "email")}
            >
              <Mail size={17} aria-hidden="true" />
              <span>{OFFICIAL_CONTACT.email}</span>
            </a>
            <a
              href={OFFICIAL_CONTACT.phoneHref}
              data-analytics-tracked="true"
              onClick={() => trackContact(pageKey, "phone")}
            >
              <Phone size={17} aria-hidden="true" />
              <span>{OFFICIAL_CONTACT.phoneDisplay}</span>
            </a>
            <a
              href={whatsapp.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-tracked="true"
              onClick={() => trackContact(pageKey, "whatsapp")}
            >
              <MessageCircle size={17} aria-hidden="true" />
              <span>WhatsApp {whatsapp.handle}</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>

          <nav className="scf-socials" aria-label="DDNZ official social channels">
            {socialChannels.map((channel) => {
              const Icon = socialIcons[channel.platform];
              return (
                <a
                  key={channel.platform}
                  href={channel.publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics-tracked="true"
                  onClick={() => trackContact(pageKey, channel.platform)}
                  aria-label={`${channel.label}: ${channel.handle}`}
                  title={`${channel.label} · ${channel.handle}`}
                >
                  <Icon size={17} aria-hidden="true" />
                  <span>{channel.label}</span>
                </a>
              );
            })}
          </nav>
        </section>

        <section className="scf-qr-block" aria-label="DDNZ messaging QR codes">
          <div className="scf-qr-heading"><QrCode size={18} aria-hidden="true" /><strong>Scan to connect</strong></div>
          <div className="scf-qr-grid">
            <a
              className="scf-qr-card"
              href={whatsapp.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-tracked="true"
              onClick={() => trackContact(pageKey, "whatsapp", "qr")}
              aria-label={`Open DDNZ WhatsApp ${whatsapp.handle}`}
            >
              <img src="/images/social/whatsapp-business-qr.jpg" alt={`WhatsApp QR code for ${whatsapp.handle}`} width="419" height="435" loading="lazy" decoding="async" />
              <span><strong>WhatsApp</strong><small>{whatsapp.handle}</small></span>
            </a>
            <a
              className="scf-qr-card"
              href="/images/social/wechat-qr.jpg"
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-tracked="true"
              onClick={() => trackContact(pageKey, "wechat", "qr")}
              aria-label="Open the DDNZ WeChat QR code"
            >
              <img src="/images/social/wechat-qr.jpg" alt="DDNZ WeChat QR code" width="512" height="512" loading="lazy" decoding="async" />
              <span><strong>WeChat</strong><small>Scan with WeChat</small></span>
            </a>
          </div>
        </section>
      </div>

      <div className="scf-bottom">
        {links.length ? (
          <nav aria-label="Page footer navigation">
            {links.map((link) => <a key={`${link.href}-${link.label}`} href={link.href}>{link.label}</a>)}
          </nav>
        ) : <span />}
        <p>{note ? `${note} · ` : ""}DDNZ Global Trade Co., Ltd. · © 2026</p>
      </div>
    </footer>
  );
}
