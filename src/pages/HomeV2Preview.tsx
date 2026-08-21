import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Languages,
  Maximize2,
  MessageCircle,
  PackageCheck,
  SearchCheck,
  ShieldCheck,
  Ship,
  Smartphone,
  Speaker,
  Utensils,
  X,
} from 'lucide-react';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import { useLanguage } from '../contexts/LanguageContext';
import { HOME_V2_COPY, type HomeV2Copy } from '../data/homeV2Copy';
import type { Language } from '../i18n/translations';
import { buildAttributedWhatsAppUrl, readAttribution } from '../lib/attribution';
import { buildQuoteHref } from '../lib/quoteLinks';
import { trackEvent } from '../lib/utils';

const categories = [
  {
    title: 'Commercial kitchen',
    description: 'Durable, efficient equipment for restaurants, hotels and food-service dealers.',
    control: 'Material grade, heat performance, energy use and factory QC acceptance.',
    image: '/images/sourcing/commercial-kitchen-project-hero.webp',
    alt: 'Commercial kitchen equipment range in a showroom',
    href: '/sourcing/commercial-kitchen-equipment-from-china',
    icon: Utensils,
  },
  {
    title: 'Audio & speakers',
    description: 'High-power ranges for retail, events, hospitality and regional distributors.',
    control: 'Power output, battery safety, Bluetooth stability and functional testing.',
    image: '/images/sourcing/audio-speakers-category.webp',
    alt: 'Portable party speakers and microphones',
    href: '/sourcing/audio-speakers-from-china',
    icon: Speaker,
  },
  {
    title: 'Mobile accessories',
    description: 'Fast-moving chargers, power banks, cables, mounts and wireless accessories.',
    control: 'Electrical safety, compatibility, durability, packaging and labeling.',
    image: '/images/sourcing/mobile-accessories-powerbank-category-v2.webp',
    alt: 'Unbranded mobile charging accessories and power banks',
    href: '/sourcing/mobile-accessories-from-china',
    icon: Smartphone,
  },
  {
    title: 'Outdoor products',
    description: 'Compact tents, overlanding backpacks, coolers, portable refrigeration and portable power.',
    control: 'Weather resistance, load checks, battery documents, labeling, packing and transport readiness.',
    image: '/images/sourcing/outdoor-portable-energy-brand-neutral-v1.webp',
    alt: 'Brand-neutral portable power stations, solar panels and outdoor charging equipment',
    href: '/sourcing/outdoor-products-from-china',
    icon: PackageCheck,
  },
];

const processStepMeta = [
  {
    number: '01',
    path: '/sourcing-services/supplier-search',
    icon: SearchCheck,
  },
  {
    number: '02',
    path: '/how-we-work#step-3',
    icon: ClipboardCheck,
  },
  {
    number: '03',
    path: '/sourcing-services/inspection-quality-control',
    icon: ShieldCheck,
  },
  {
    number: '04',
    path: '/sourcing-services/consolidation-export',
    icon: Boxes,
  },
];

const localePrefix: Record<Language, string> = { en: '', zh: '/zh-cn', ru: '/ru', fr: '/fr', es: '/es', ar: '/ar' };

const scorecardAsset: Record<Language, { src: string; width: number; height: number }> = {
  en: { src: '/media/evidence/2026-08-14/supplier-scorecard-criteria-en.webp', width: 1024, height: 1536 },
  zh: { src: '/media/evidence/2026-08-14/supplier-scorecard-criteria-redacted.webp', width: 1080, height: 1444 },
  ru: { src: '/media/evidence/2026-08-14/supplier-scorecard-criteria-ru.svg', width: 1024, height: 1536 },
  fr: { src: '/media/evidence/2026-08-14/supplier-scorecard-criteria-fr.svg', width: 1024, height: 1536 },
  es: { src: '/media/evidence/2026-08-14/supplier-scorecard-criteria-es.svg', width: 1024, height: 1536 },
  ar: { src: '/media/evidence/2026-08-14/supplier-scorecard-criteria-ar.svg', width: 1024, height: 1536 },
};

function localizePath(path: string, language: Language) {
  const [pathname, hash] = path.split('#');
  return `${localePrefix[language]}${pathname}${hash ? `#${hash}` : ''}`;
}

function ScorecardDialog({ open, onClose, copy, asset }: { open: boolean; onClose: () => void; copy: HomeV2Copy['scorecardDialog']; asset: { src: string; width: number; height: number } }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-[#07182e]/88 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scorecard-dialog-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-[#fbfaf7] shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3 sm:px-6">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--ddnz-coral-strong)]">{copy.eyebrow}</p>
            <h2 id="scorecard-dialog-title" className="mt-1 text-lg font-extrabold text-[var(--ddnz-ink)] sm:text-xl">{copy.title}</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-slate-200 bg-white text-[var(--ddnz-ink)] hover:border-[var(--ddnz-purple)] hover:text-[var(--ddnz-purple-strong)]"
            aria-label={copy.closeLabel}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="overflow-auto bg-[#f3f5f7] p-3 sm:p-6">
          <img
            src={asset.src}
            alt={copy.imageAlt}
            width={asset.width}
            height={asset.height}
            className="mx-auto h-auto w-full max-w-3xl rounded-xl border border-slate-200 bg-white shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}

type HomeV2PreviewProps = {
  embedded?: boolean;
  beforeFinal?: ReactNode;
};

export default function HomeV2Preview({ embedded = false, beforeFinal }: HomeV2PreviewProps) {
  const { language } = useLanguage();
  const copy = HOME_V2_COPY[language];
  const localizedScorecard = scorecardAsset[language];
  const [scorecardOpen, setScorecardOpen] = useState(false);
  const attribution = readAttribution();
  const sourcingHref = buildQuoteHref({
    intent: 'Product Sourcing',
    language,
    source: embedded ? 'homepage_v2' : 'home_v2_preview',
    attribution,
  });
  const freightHref = buildQuoteHref({
    intent: 'Freight Export',
    language,
    source: embedded ? 'homepage_v2_freight' : 'home_v2_preview_freight',
    attribution,
  });
  const whatsappHref = buildAttributedWhatsAppUrl(
    copy.final.whatsappMessage,
    attribution,
  );

  const openScorecard = () => {
    trackEvent('supplier_scorecard_opened', {
      cta_location: embedded ? 'homepage_supplier_evidence' : 'home_v2_preview',
      language,
      document: 'supplier_scorecard_criteria',
    });
    setScorecardOpen(true);
  };

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={embedded ? '' : 'ddnz-home min-h-screen overflow-x-hidden bg-[#fffefb] text-[var(--ddnz-ink)]'}>
      {!embedded ? (
        <>
          <Helmet>
            <title>DDNZ Homepage V2 Design Preview</title>
            <meta name="robots" content="noindex,nofollow" />
          </Helmet>
          <SourcingHomepageNav />

          <aside className="border-b border-[#eadff0] bg-[#f8f1fb]" aria-label="Design preview status">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-xs font-bold text-[#5f2c7c] sm:px-6 lg:px-8">
              <span>Isolated homepage integration preview · Production homepage uses the approved integration below its sourcing hero</span>
              <Link className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 hover:bg-white" to="/">
                View production homepage <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </>
      ) : null}

      <div data-testid={embedded ? 'home-v2-production-canvas' : 'home-v2-preview-canvas'}>
        {!embedded ? <section id="preview-categories" className="border-b border-slate-200 bg-[#fffefb] py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ddnz-coral-strong)]">Priority product sourcing</p>
                <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-[-0.04em] text-[var(--ddnz-ink)] sm:text-4xl lg:text-5xl">Explore our priority categories</h1>
              </div>
              <Link to="/sourcing/outdoor-products-from-china" className="inline-flex min-h-11 items-center gap-2 text-sm font-black text-[var(--ddnz-purple-strong)] hover:text-[var(--ddnz-coral-strong)]">
                Explore outdoor products <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <article key={category.title} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(16,36,63,0.04)] transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[var(--ddnz-purple)]/35 hover:shadow-[0_18px_45px_rgba(16,36,63,0.09)]">
                    <Link
                      to={category.href}
                      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ddnz-purple)]"
                      onClick={() => trackEvent('homepage_category_select', { industry: category.title, cta_location: 'home_v2_preview_categories' })}
                    >
                      <div className="aspect-[16/7] overflow-hidden bg-slate-100">
                        <img src={category.image} alt={category.alt} width="1600" height="900" loading="eager" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
                      </div>
                      <div className="p-5 sm:p-6">
                        <div className="flex items-start gap-3">
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--ddnz-purple-soft)] text-[var(--ddnz-purple-strong)]"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                          <div>
                            <h2 className="text-xl font-extrabold tracking-[-0.025em] text-[var(--ddnz-ink)]">{category.title}</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
                          </div>
                        </div>
                        <div className="mt-4 grid gap-4 border-t border-slate-200 pt-4 sm:grid-cols-[1fr_auto]">
                          <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--ddnz-purple-strong)]">Key sourcing & QC control</p>
                            <p className="mt-1.5 text-sm leading-6 text-slate-700">{category.control}</p>
                          </div>
                          <div className="sm:max-w-[12rem] sm:text-right">
                            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Target regions</p>
                            <p className="mt-1 text-sm font-bold text-[var(--ddnz-ink)]">Middle East · Africa · Latin America</p>
                            <span className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-black text-[var(--ddnz-purple-strong)] sm:justify-end">Explore category <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section> : null}

        <section id="preview-accountability" className="border-b border-slate-200 bg-[#f8f9fa] py-16 sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-9 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-14 lg:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ddnz-coral-strong)]">{copy.accountability.eyebrow}</p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.045em] text-[var(--ddnz-ink)] sm:text-5xl lg:text-[3.4rem] lg:leading-[1.02]">{copy.accountability.title}</h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">{copy.accountability.body}</p>
              <ul className="mt-7 space-y-3">
                {copy.accountability.controls.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-semibold leading-6 text-slate-700 sm:text-base"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--ddnz-purple)]" aria-hidden="true" />{item}</li>
                ))}
              </ul>
            </div>
            <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(16,36,63,0.09)]">
              <img src="/images/operations/supplier-visit-speaker-redacted-v2.webp" alt={copy.accountability.imageAlt} width="1086" height="1448" loading="lazy" decoding="async" className="aspect-[16/10] h-full w-full object-cover object-[center_36%]" />
              <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-5 py-4 text-xs font-bold text-slate-600 sm:px-6">
                <span>{copy.accountability.fieldLabel}</span>
                <span className="text-[var(--ddnz-coral-strong)]">{copy.accountability.fieldCaption}</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="preview-process" className="border-b border-slate-200 bg-[#fffefb] py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ddnz-purple-strong)]">{copy.process.eyebrow}</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-[var(--ddnz-ink)] sm:text-4xl lg:text-5xl">{copy.process.title}</h2>
              <p className="mt-5 text-base leading-7 text-slate-600">{copy.process.body}</p>
            </div>

            <ol className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {copy.process.steps.map((step, index) => {
                const meta = processStepMeta[index];
                const Icon = meta.icon;
                return (
                  <li key={meta.number}>
                    <Link to={localizePath(meta.path, language)} className="group block h-full rounded-2xl border border-slate-200 bg-white p-5 transition-[border-color,box-shadow] hover:border-[var(--ddnz-purple)]/40 hover:shadow-[0_12px_35px_rgba(16,36,63,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ddnz-purple)] sm:p-6">
                      <div className="flex items-center justify-between gap-4">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--ddnz-purple-soft)] text-[var(--ddnz-purple-strong)]"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                        <span className="font-mono text-xs font-black tracking-[0.16em] text-[var(--ddnz-coral-strong)]">{meta.number}</span>
                      </div>
                      <h3 className="mt-4 text-lg font-extrabold tracking-[-0.025em] text-[var(--ddnz-ink)]">{step.title}</h3>
                      <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">{step.output}</p>
                      <div className="mt-4 border-t border-slate-200 pt-3">
                        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--ddnz-coral-strong)]">{copy.process.releaseGate}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{step.gate}</p>
                      </div>
                      <span className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-black text-[var(--ddnz-purple-strong)]">{copy.process.reviewStep} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" aria-hidden="true" /></span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section id="preview-evidence" className="border-b border-slate-200 bg-[#f4f6f8] py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <article className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white lg:grid-cols-[0.9fr_0.95fr_0.78fr]">
              <div className="p-6 sm:p-8 lg:p-9">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ddnz-coral-strong)]">{copy.evidence.scoreEyebrow}</p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[var(--ddnz-ink)]">{copy.evidence.scoreTitle}</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">{copy.evidence.scoreBody}</p>
                <ul className="mt-5 space-y-2.5">
                  {copy.evidence.scorePoints.map((point) => <li key={point} className="flex gap-2.5 text-sm font-semibold leading-6 text-slate-700"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--ddnz-purple)]" aria-hidden="true" />{point}</li>)}
                </ul>
                <button type="button" onClick={openScorecard} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-black text-[var(--ddnz-purple-strong)] hover:text-[var(--ddnz-coral-strong)]">{copy.evidence.openScorecard} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" /></button>
              </div>
              <figure className="min-h-[20rem] overflow-hidden border-y border-slate-200 lg:border-x lg:border-y-0">
                <img src="/images/operations/supplier-visit-speaker-redacted-v2.webp" alt={copy.evidence.supplierImageAlt} width="1086" height="1448" loading="lazy" decoding="async" className="h-full w-full object-cover object-center" />
              </figure>
              <button
                type="button"
                onClick={openScorecard}
                className="group relative min-h-[20rem] overflow-hidden bg-[#fbfaf7] p-4 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ddnz-purple)] sm:p-5"
                aria-label={copy.evidence.openScorecard}
              >
                <img src={localizedScorecard.src} alt={copy.evidence.scorecardPreviewAlt} width={localizedScorecard.width} height={localizedScorecard.height} loading="lazy" decoding="async" className="h-full max-h-[27rem] w-full rounded-xl border border-slate-200 object-cover object-top transition-transform duration-300 group-hover:scale-[1.01]" />
                <span className="absolute bottom-7 end-7 grid h-11 w-11 place-items-center rounded-xl bg-white/95 text-[var(--ddnz-purple-strong)] shadow-lg backdrop-blur"><Maximize2 className="h-4 w-4" aria-hidden="true" /></span>
              </button>
            </article>

            <article className="mt-8 grid overflow-hidden rounded-2xl border border-slate-200 bg-white lg:grid-cols-[1.05fr_0.95fr]">
              <figure className="overflow-hidden border-b border-slate-200 lg:border-b-0 lg:border-e">
                <img src="/media/evidence/2026-08-14/mobile-accessories-container-loading-04-redacted.webp" alt={copy.evidence.exportImageAlt} width="960" height="1708" loading="lazy" decoding="async" className="aspect-[16/9] h-full w-full object-cover object-[center_70%]" />
              </figure>
              <div className="p-6 sm:p-8 lg:p-9">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ddnz-coral-strong)]">{copy.evidence.exportEyebrow}</p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[var(--ddnz-ink)]">{copy.evidence.exportTitle}</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">{copy.evidence.exportBody}</p>
                <ol className="mt-5 grid gap-x-5 sm:grid-cols-2">
                  {copy.evidence.exportCheckpoints.map(([title, body], index) => (
                    <li key={title} className="grid grid-cols-[2rem_1fr] gap-2.5 border-t border-slate-200 py-3">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#fff2ec] font-mono text-[10px] font-black text-[var(--ddnz-coral-strong)]">0{index + 1}</span>
                      <div><h3 className="text-sm font-extrabold text-[var(--ddnz-ink)]">{title}</h3><p className="mt-0.5 text-xs leading-5 text-slate-600">{body}</p></div>
                    </li>
                  ))}
                </ol>
                <p className="mt-3 text-xs font-bold text-slate-500">{copy.evidence.redactionNote}</p>
              </div>
            </article>
          </div>
        </section>

        <section id="preview-languages" className="border-b border-slate-200 bg-[#fffefb] py-12 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-[1.15fr_repeat(4,1fr)] md:items-center md:gap-0">
              <div className="flex items-center gap-3 md:pe-8">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--ddnz-purple-soft)] text-[var(--ddnz-purple-strong)]"><Languages className="h-5 w-5" aria-hidden="true" /></span>
                <div><p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--ddnz-coral-strong)]">{copy.languages.eyebrow}</p><h2 className="mt-1 text-xl font-extrabold text-[var(--ddnz-ink)]">{copy.languages.title}</h2></div>
              </div>
              {copy.languages.items.map((item) => (
                <div key={item.name} className="border-slate-200 py-2 md:border-s md:px-6" dir={item.dir || (language === 'ar' ? 'rtl' : 'ltr')}>
                  <h3 className="font-extrabold text-[var(--ddnz-ink)]">{item.name}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="preview-freight-handoff" className="bg-[#07182e] text-white">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 md:grid-cols-[auto_1fr_auto] md:items-center lg:px-8">
            <span className="grid h-12 w-12 place-items-center rounded-xl border border-white/15 bg-white/5 text-[#f7a581]"><Ship className="h-6 w-6" aria-hidden="true" /></span>
            <div>
              <p className="text-lg font-extrabold">{copy.freight.title}</p>
              <p className="mt-1 text-sm font-bold text-[#f7a581]">{copy.freight.body}</p>
            </div>
            <Link to={freightHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/45 px-5 text-sm font-black hover:bg-white hover:text-[#07182e]">
              {copy.freight.cta} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {beforeFinal}

        <section id={embedded ? 'homepage-final-cta' : 'preview-final-cta'} className="relative overflow-hidden bg-[#fff4ef] py-14 sm:py-16">
          <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--ddnz-purple),var(--ddnz-coral))]" aria-hidden="true" />
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ddnz-purple-strong)]">{copy.final.eyebrow}</p>
              <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.045em] text-[var(--ddnz-ink)] sm:text-5xl">{copy.final.title}</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{copy.final.body}</p>
            </div>
            <div className="flex min-w-0 flex-col gap-3 sm:min-w-[22rem]">
              <Link
                to={sourcingHref}
                data-analytics-tracked="true"
                onClick={() => trackEvent('quote_click', { cta_location: embedded ? 'homepage_v2_final' : 'home_v2_preview_final', lead_goal: 'Product Sourcing' })}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[var(--ddnz-action)] px-6 py-3.5 text-sm font-black text-white shadow-[0_10px_28px_rgba(201,79,47,0.18)] hover:bg-[var(--ddnz-coral-strong)]"
              >
                {copy.final.sourcingCta} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </Link>
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#20a95a]/35 bg-white px-5 text-sm font-black text-[#167a43] hover:border-[#20a95a]">
                <MessageCircle className="h-5 w-5" aria-hidden="true" /> {copy.final.whatsappCta}
              </a>
              <Link to={freightHref} className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:text-[var(--ddnz-purple-strong)]">{copy.final.freightCta} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" /></Link>
              <p className="flex items-center justify-center gap-2 text-center text-xs font-semibold text-slate-500"><FileCheck2 className="h-4 w-4" aria-hidden="true" /> {copy.final.privacy}</p>
            </div>
          </div>
        </section>
      </div>

      <ScorecardDialog open={scorecardOpen} onClose={() => setScorecardOpen(false)} copy={copy.scorecardDialog} asset={localizedScorecard} />
    </div>
  );
}
