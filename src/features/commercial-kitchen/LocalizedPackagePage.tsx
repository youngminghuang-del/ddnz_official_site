import {useLocation} from 'react-router-dom';
import SEO from '../../components/SEO';
import Footer from '../../components/Footer';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import {productRouteParts} from '../../lib/productLocalization.mjs';
import {foodPrefix} from '../food-processing/localization';
import {kitchenPackagePath} from './routes.mjs';
import {packageMeta,packageAlternates,packageSchema,type PackageLocale} from './packageLocalization';
import LocalizedPackageContent from './LocalizedPackageContent';
export default function LocalizedPackagePage(){const {path,locale}=productRouteParts(useLocation().pathname),lang=locale as PackageLocale,slug=path===kitchenPackagePath?undefined:path.split('/').pop(),meta=packageMeta(path,lang),url=`${foodPrefix(lang)}${path}/`;return <><SEO title={meta.title} description={meta.description} canonicalPath={url} contentLanguage={lang} alternateUrls={packageAlternates(path)}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(packageSchema(path,lang)).replace(/</g,'\\u003c')}}/><SourcingHomepageNav quotePath={`${url}#package-rfq`}/><LocalizedPackageContent key={url} locale={lang} slug={slug}/><Footer description={meta.description} quotePath={`${url}#package-rfq`}/></>;}
