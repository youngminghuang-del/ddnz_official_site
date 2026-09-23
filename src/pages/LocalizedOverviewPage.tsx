import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';
import { navigationPrefixes } from '../lib/productLanguageRouting';
import LocalizedOverviewContent from '../features/overview/LocalizedOverviewContent';
import { overviewMeta, overviewAlternates, type OverviewKind, type OverviewLocale } from '../features/overview/copy';
export default function LocalizedOverviewPage({kind}: {kind:OverviewKind}) {
 const {language}=useLanguage();
 const locale=language as OverviewLocale;
 const meta=overviewMeta(kind,locale);
 return <><SEO title={meta.title} description={meta.desc} canonicalPath={`${navigationPrefixes[language]}/${kind}/`} contentLanguage={language} alternateUrls={overviewAlternates(kind)}/><SourcingHomepageNav/><LocalizedOverviewContent kind={kind} locale={locale}/><Footer/></>;
}
