import ScenePlanning from '../product-experience/ScenePlanning';
import ProgressiveSection,{experienceCopy} from '../product-experience/ProgressiveSection';
import ProductSeries from '../product-series/ProductSeries';
import {coffeeCopy,coffeePath,coffeePrefix} from './data.mjs';
export default function CoffeeContent({locale='en'}:{locale?:string}){const c=coffeeCopy(locale),prefix=coffeePrefix(locale);return <main id="main-content" className="coffee-page" lang={locale==='zh'?'zh-CN':locale} dir={locale==='ar'?'rtl':'ltr'}>
 <section className="coffee-hero"><div><p className="product-series-kicker">DDNZ · COFFEE EQUIPMENT</p><h1>{c.title}</h1><p>{c.intro}</p><a className="coffee-cta" href="#coffee-machine-catalogue">{c.cta} ↓</a></div><img src="/images/product-series/ky-168.webp" alt="KY-168" width="1080" height="800" fetchPriority="high"/></section>
 <section className="coffee-plan"><h2>{c.plan}</h2><div>{c.topics.map((topic,i)=><article key={topic}><span>0{i+1}</span><h3>{topic}</h3><p>{c.texts[i]}</p></article>)}</div></section>
 <ProgressiveSection title={experienceCopy(locale).coffeeScene} locale={locale}><ScenePlanning family="coffee" locale={locale}/></ProgressiveSection>
 <ProductSeries family="coffee" locale={locale} standalone canonicalPath={coffeePath+'/'}/>
 <section className="coffee-plan"><h2>{c.question}</h2><p>{c.answer}</p><a href={`${prefix}/sourcing/commercial-kitchen-equipment-from-china/#commercial-kitchen-list`}>{c.cta} · {c.nav} ↗</a></section>
 </main>;}
