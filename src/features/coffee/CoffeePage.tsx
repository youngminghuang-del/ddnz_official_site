import SEO from '../../components/SEO';
import Footer from '../../components/Footer';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import {useLanguage} from '../../contexts/LanguageContext';
import {coffeeMeta,coffeePath,coffeePrefix,coffeeAlternates,coffeeSchema} from './data.mjs';
import CoffeeContent from './CoffeeContent';
export default function CoffeePage(){const {language}=useLanguage(),meta=coffeeMeta(language),path=coffeePrefix(language)+coffeePath+'/';return <><SEO title={meta.title} description={meta.description} canonicalPath={path} contentLanguage={language} alternateUrls={coffeeAlternates()}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(coffeeSchema(language)).replace(/</g,'\\u003c')}}/><SourcingHomepageNav quotePath={path+'#coffee-machine-catalogue'}/><CoffeeContent key={language} locale={language}/><Footer description={meta.description} quotePath={path+'#coffee-machine-catalogue'}/></>;}
