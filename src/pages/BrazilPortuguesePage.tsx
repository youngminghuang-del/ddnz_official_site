import SEO from '../components/SEO';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import BrazilPortugueseContent, { brazilPortugueseMeta } from '../features/freight/BrazilPortugueseContent';
export default function BrazilPortuguesePage() {
 return <div className="ddnz-home"><SEO title={brazilPortugueseMeta.title} description={brazilPortugueseMeta.desc} keywords={brazilPortugueseMeta.keywords} canonicalPath="/pt/shipping-from-china-to-brazil/" contentLanguage="pt"/><SourcingHomepageNav showFreightExecutor/><BrazilPortugueseContent/><Footer/></div>;
}
