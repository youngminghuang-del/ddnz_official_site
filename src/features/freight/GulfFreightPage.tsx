import { Fragment, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import SchemaMarkup from '../../components/SchemaMarkup';
import GetAQuote from '../../components/GetAQuote';
import WhatsAppFloat from '../../components/WhatsAppFloat';
import stories from './gulfStories.json';
import './gulf-stories.css';

type Locale = 'en' | 'ar';
type Country = 'qatar' | 'oman';
type Block = { type: string; text?: string; rows?: string[][] };
// Editorial text is rendered as React nodes, never injected HTML.
function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\b(LCL|FCL|DDP|DDNZ|Heaven Born|Bayan|SOHAR|kg)\b/g;
  let start = 0;
  for (const match of text.matchAll(pattern)) {
    parts.push(text.slice(start, match.index));
    parts.push(match[1] ? <a key={match.index} href={match[2]}>{match[1]}</a> : match[3] ? <strong key={match.index}>{match[3]}</strong> : <bdi key={match.index} dir="ltr">{match[4]}</bdi>);
    start = match.index! + match[0].length;
  }
  parts.push(text.slice(start));
  return <>{parts}</>;
}
function Blocks({ blocks }: { blocks: Block[] }) {
  return <>{blocks.map((block, i) => block.rows ? <dl key={i} className="gulf-records">{block.rows.slice(1).map(([label, value]) => <div key={label}><dt><Inline text={label} /></dt><dd><Inline text={value} /></dd></div>)}</dl> : block.text ? <p key={i}><Inline text={block.text} /></p> : null)}</>;
}
function Media({ country, locale }: { country: Country; locale: Locale }) {
  const id = country === 'qatar' ? 'qatar-receiving' : 'oman-loading';
  const caption = locale === 'ar' ? country === 'qatar' ? 'سجل استلام من الصين.' : 'سجل تحميل من الصين.' : country === 'qatar' ? 'Receiving record from China.' : 'Loading record from China.';
  return <figure className={`gulf-video gulf-video-${country}`}>
    <video controls playsInline preload="none" poster={`/media/freight-20261014/${id}-poster.jpg`} width="540" height={country === 'qatar' ? '756' : '984'} aria-label={caption}>
      <source src={`/media/freight-20261014/${id}.mp4`} type="video/mp4" />
      {(['en', 'ar'] as const).map(lang => <track key={lang} kind="captions" src={`/media/freight-20261014/${id}.${lang}.vtt`} srcLang={lang} label={lang === 'en' ? 'English' : 'العربية'} default={locale === lang} />)}
    </video>
    <figcaption>{caption} <span>{locale === 'ar' ? 'مقطع صامت مع تعليق نصي.' : 'Silent footage with context captions.'}</span></figcaption>
  </figure>;
}
function Diagram({ country, locale }: { country: Country; locale: Locale }) {
  const ar = locale === 'ar';
  return <figure className="gulf-diagram"><img src={`/media/freight-20261014/${country}-explainer.${locale}.svg`} width="720" height="960" loading="lazy" alt={country === 'qatar' ? ar ? 'ربط المورد ومرجع الطلب بعدد الطرود وأبعادها، ثم اتخاذ قرار الإرسال أو الانتظار.' : 'Identify supplier and order, record package count and size, then decide to ship, wait or clarify.' : ar ? 'تأكيد مسؤولية النقل والتفريغ والإدخال والتركيب كلّاً على حدة.' : 'Confirm responsibility for delivery, unloading, indoor movement and installation separately.'} /></figure>;
}
function PackedPiece({ ar }: { ar: boolean }) {
  return <figure className="gulf-package">
    <svg viewBox="0 0 520 350" role="img" aria-label={ar ? 'قياس الطرد بعد التعبئة: الطول والعرض والارتفاع.' : 'Measure external length, width and height after packing.'}>
      <path d="M100 115 310 65 426 145 216 200Z" fill="#e8d7f2" stroke="#763c9c" strokeWidth="2" />
      <path d="M100 115 216 200 216 299 100 213Z" fill="#d2b4e5" stroke="#763c9c" strokeWidth="2" />
      <path d="M216 200 426 145 426 243 216 299Z" fill="#f6eefb" stroke="#763c9c" strokeWidth="2" />
      <path d="m100 242 115 84m16 0 208-54m-358-159v101" fill="none" stroke="#c94f2f" strokeWidth="2" />
      <text x="264" y="238" fill="#632b89" fontSize="24" fontWeight="700" direction="ltr">01</text>
      <text x="310" y="326" textAnchor="middle" fill="#632b89" fontSize="18">{ar ? 'الطول' : 'Length'}</text>
      <text x="112" y="303" textAnchor="middle" fill="#632b89" fontSize="18">{ar ? 'العرض' : 'Width'}</text>
      <text x="72" y="84" textAnchor="middle" fill="#632b89" fontSize="18">{ar ? 'الارتفاع' : 'Height'}</text>
    </svg>
    <figcaption>{ar ? 'الأبعاد الخارجية بعد التعبئة + الوزن الإجمالي لكل طرد' : 'External packed dimensions + gross weight for each piece'}</figcaption>
  </figure>;
}
export default function GulfFreightPage() {
  // Read the route directly so an in-app language switch never paints stale copy.
  const { pathname } = useLocation();
  const locale: Locale = pathname.startsWith('/ar/') ? 'ar' : 'en';
  const country: Country = pathname.includes('to-oman') ? 'oman' : 'qatar';
  const ar = locale === 'ar';
  const data = stories[country][locale];
  const destination = country === 'qatar' ? 'Qatar' : 'Oman';
  const sections = data.sections;
  const prefix = ar ? '/ar' : '';
  const heroId = country === 'qatar' ? 'qatar-receiving' : 'oman-loading';
  const cta = (secondary = false) => <a className={secondary ? 'gulf-secondary' : 'gulf-cta'} href="#gulf-quote">{data.buttons[secondary ? 1 : 0]}<span aria-hidden="true">{ar ? '←' : '→'}</span></a>;
  const section = (index: number, visual?: ReactNode, className = '') => <section className={`gulf-section ${visual ? 'gulf-split' : ''} ${className}`} aria-labelledby={`gulf-section-${index}`}>
    <div className="gulf-copy"><span className="gulf-index" aria-hidden="true">{String(country === 'oman' ? [1, 2, 4, 5, 3][index] : index + 1).padStart(2, '0')}</span><h2 id={`gulf-section-${index}`}>{sections[index].heading}</h2><Blocks blocks={sections[index].blocks} /></div>{visual}
  </section>;
  const faq = sections[5];
  return <div className={`ddnz-home gulf-page gulf-${country}`} dir={ar ? 'rtl' : 'ltr'} lang={locale}>
    <SEO title={data.title} description={data.desc} contentLanguage={locale} />
    <SchemaMarkup type="Service" data={{ name: data.title, description: data.desc, serviceType: 'Freight planning from China', areaServed: { '@type': 'Country', name: destination }, url: `https://www.ddnzglobal.com${pathname}` }} />
    <SourcingHomepageNav showFreightExecutor />
    <main id="main-content" data-country-cargo-planning="gulf-story" data-destination={destination}>
      <div className="gulf-wrap">
        <nav aria-label={ar ? 'مسار التنقل' : 'Breadcrumb'} className="gulf-breadcrumb"><a href={`${prefix}/shipping-from-china-to-middle-east/`}>{ar ? 'مسارات الشرق الأوسط' : 'Middle East routes'}</a><span aria-hidden="true">/</span><span>{ar ? country === 'qatar' ? 'قطر' : 'عُمان' : destination}</span></nav>
        <header className="gulf-hero">
          <div className="gulf-hero-copy"><p className="gulf-eyebrow">{ar ? country === 'qatar' ? 'الصين ← قطر · طلبات متعددة الموردين' : 'الصين ← عُمان · البضائع التجارية الكبيرة' : country === 'qatar' ? 'CHINA → QATAR · MULTI-SUPPLIER ORDERS' : 'CHINA → OMAN · LARGE COMMERCIAL CARGO'}</p><h1>{data.heading}</h1><p className="gulf-lede">{data.intro}</p><div className="gulf-actions">{cta()}{cta(true)}</div></div>
          <figure className="gulf-hero-image"><img src={`/media/freight-20261014/${heroId}-poster.jpg`} width="540" height={country === 'qatar' ? '756' : '984'} fetchPriority="high" alt={ar ? country === 'qatar' ? 'كراتين على منصة أثناء الاستلام في الصين' : 'كراتين عند حاوية أثناء التحميل في الصين' : country === 'qatar' ? 'Palletised cartons during receiving in China' : 'Cartons at a container during loading in China'} /><figcaption>{ar ? country === 'qatar' ? 'من طلب المورد إلى سجل الاستلام' : 'من التعبئة إلى خطة المناولة' : country === 'qatar' ? 'From supplier order to receiving record' : 'From packing to handling plan'}<small>{ar ? 'سجل من الصين' : 'China-origin record'}</small></figcaption></figure>
        </header>
        <nav className="gulf-chapters" aria-label={ar ? 'في هذه الصفحة' : 'On this page'}>{[0, country === 'qatar' ? 2 : 1, country === 'qatar' ? 3 : 2, 5].map(i => <a key={i} href={`#gulf-section-${i}`}>{sections[i].heading}</a>)}</nav>
        {country === 'qatar' ? <>
          {section(0, <Diagram country={country} locale={locale} />)}
          {section(1, <Media country={country} locale={locale} />, 'gulf-media-section')}
          {section(2, <aside className="gulf-distinction"><p>{ar ? 'التجميع' : 'Consolidation'}</p><span>{ar ? 'تنظيم طرود الموردين' : 'Organise supplier packages'}</span><hr /><p dir="ltr">LCL</p><span>{ar ? 'مشاركة مساحة الحاوية' : 'Share container space'}</span></aside>)}
          {section(3, undefined, 'gulf-destination')}
          {section(4, undefined, 'gulf-scope')}
        </> : <>
          {section(0, <PackedPiece ar={ar} />)}
          {section(1, <Media country={country} locale={locale} />, 'gulf-media-section')}
          {section(4, <Diagram country={country} locale={locale} />, 'gulf-handover')}
          {section(2, undefined, 'gulf-destination')}
          {section(3, undefined, 'gulf-scope')}
        </>}
        <section className="gulf-section gulf-faq" aria-labelledby="gulf-section-5"><h2 id="gulf-section-5">{faq.heading}</h2><div>{faq.blocks.filter(b => b.text).map((b,i) => {
          const [question, ...answer] = b.text!.split('\n');
          return <details key={i}><summary>{question.replaceAll('**','')}</summary><p><Inline text={answer.join(' ')} /></p></details>;
        })}</div></section>
        <section id="gulf-quote" className="gulf-quote-intro"><p className="gulf-eyebrow">{ar ? 'خطوتك التالية' : 'YOUR NEXT STEP'}</p><h2>{sections[6].heading}</h2><Blocks blocks={sections[6].blocks.slice(0, 1)} /></section>
      </div>
      <div className="gulf-form"><GetAQuote key={`${country}-${locale}`} presetDestination={destination} hideLandRecommendation /></div>
      <div className="gulf-wrap gulf-reading">{sections[6].blocks.slice(2).map((b,i)=><Fragment key={i}>{b.text && <p><Inline text={b.text} /></p>}</Fragment>)}</div>
    </main><Footer /><WhatsAppFloat />
  </div>;
}
