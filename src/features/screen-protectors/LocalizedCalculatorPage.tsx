import type {Language} from '../../i18n/translations';
import {useLocation} from 'react-router-dom';
import SEO from '../../components/SEO';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import Footer from '../../components/Footer';
import {productRouteParts} from '../../lib/productLocalization.mjs';
import {localePrefix} from '../site-localization/translate.mjs';
import LocalizedCalculator,{calculatorMeta,calculatorSchema} from './LocalizedCalculator.jsx';
import './screen-protectors.css';
import './phone-localized.css';
export default function LocalizedCalculatorPage(){const {pathname}=useLocation(),locale=productRouteParts(pathname).locale as Language,meta=calculatorMeta(locale),quote=localePrefix(locale)+'/get-a-quote/';return <><SEO title={meta.title} description={meta.description} canonicalPath={meta.path} contentLanguage={locale} alternateUrls={meta.alternateUrls}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(calculatorSchema(locale)).replace(/</g,'\\u003c')}}/><SourcingHomepageNav quotePath={quote}/><LocalizedCalculator locale={locale}/><Footer quotePath={quote}/></>}
