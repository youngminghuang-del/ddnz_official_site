import { ExternalLink, ChevronDown } from 'lucide-react';
import { COMPANY } from '../../config/companyIdentity';
import { useLanguage } from '../../contexts/LanguageContext';
import { companyCopy } from './copy';
import { aboutCopy } from './aboutCopy';
import { navigationPath } from '../../lib/productLanguageRouting';
const companies = [
 { id: 'ddnz', brand: 'DDNZ Global', name: COMPANY.zh, code: '91440111679736793B', date: '2008-09-16', capital: 500000 },
 { id: 'hb', brand: 'HB · Heaven Born', name: COMPANY.freightZh, code: '91440111778389280U', date: '2005-09-13', capital: 5000000 },
] as const;
export default function CompanyIdentity({compact=false}: {compact?:boolean}) {
 const { language } = useLanguage();
 const c = companyCopy[language];
 const locale = language === 'zh' ? 'zh-CN' : language;
 const dateFormat = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', timeZone: 'UTC' });
 const moneyFormat = new Intl.NumberFormat(locale, { style: 'currency', currency: 'CNY', currencyDisplay: 'code', maximumFractionDigits: 0 });
 return <section className="company-identity" id="company-identity" aria-labelledby="company-identity-title" dir={language === 'ar' ? 'rtl' : 'ltr'}>
  <div className="company-identity__inner">
   <header className="company-identity__heading"><p className="company-identity__eyebrow">{c.eyebrow}</p><h2 id="company-identity-title">{c.title}</h2><p>{c.intro}</p></header>
   <div className="company-identity__cards">{companies.map(company => <article className="company-identity__card" key={company.id}>
    <h3>{company.brand}</h3><p className="company-identity__role">{c[company.id]}</p>
    <dl className="company-identity__facts"><div><dt>{c.registered}</dt><dd><time dateTime={company.date}>{dateFormat.format(new Date(`${company.date}T00:00:00Z`))}</time></dd></div><div><dt>{c.capital}</dt><dd>{moneyFormat.format(company.capital)}</dd></div></dl>
    
   </article>)}</div>
   <p className="company-identity__contract">{c.contract}</p>
   {compact ? <a className="about-text-link company-identity__about-link" href={navigationPath('/about/',language)}>{aboutCopy[language].nav} <span aria-hidden="true">→</span></a> : <details className="company-identity__records"><summary>{c.records}<ChevronDown size={20} aria-hidden="true" /></summary>
    <div className="company-identity__records-body"><p className="company-identity__source">{c.source}</p><p>{c.note}</p>
     <div className="company-identity__documents">{companies.map(company => <figure key={company.id}>
      <figcaption><h3>{company.brand}</h3><div className="company-identity__legal"><span>{c.name}</span><p lang="zh-CN" dir="ltr">{company.name}</p></div><p>{c.code}</p><code dir="ltr">{company.code}</code></figcaption>
      <a href={`/images/company/${company.id}-registry-20260929.webp`} target="_blank" rel="noopener noreferrer" aria-label={`${c.image} · ${company.brand}`}><img src={`/images/company/${company.id}-registry-20260929.webp`} width="1550" height="515" loading="lazy" decoding="async" alt={`${c.image} · ${company.name}`} /></a>
     </figure>)}</div><p>{c.instructions}</p><a className="company-identity__verify" href="https://www.gsxt.gov.cn/" target="_blank" rel="noopener noreferrer">{c.verify}<ExternalLink size={16} aria-hidden="true" /></a>
    </div>
   </details>}
  </div>
 </section>;
}
