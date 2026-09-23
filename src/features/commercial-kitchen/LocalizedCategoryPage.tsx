import {useLocation} from 'react-router-dom';
import SEO from '../../components/SEO';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import Footer from '../../components/Footer';
import {productRouteParts} from '../../lib/productLocalization.mjs';
import {kitchenCategories} from './data/categories.mjs';
import {categoryMeta,categoryAlternates,translatedCategorySchema,type CategoryLocale} from './categoryLocalization';
import {foodPrefix} from '../food-processing/localization';
import LocalizedCategoryContent from './LocalizedCategoryContent';
import './styles/kitchen.css';
import './styles/category.css';
export default function LocalizedCategoryPage(){const parts=productRouteParts(useLocation().pathname),locale=parts.locale as CategoryLocale,category=kitchenCategories.find(c=>c.path===`${parts.path}/`)!;const meta=categoryMeta(category,locale),path=`${foodPrefix(locale)}${category.path}`;return <><SEO title={meta.title} description={meta.description} canonicalPath={path} contentLanguage={locale} alternateUrls={categoryAlternates(category.path)}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(translatedCategorySchema(category,locale)).replace(/</g,'\\u003c')}}/><SourcingHomepageNav quotePath={`${path}#category-rfq`}/><LocalizedCategoryContent key={path} category={category} locale={locale}/><Footer quotePath={`${path}#category-rfq`} description={meta.description}/></>;}
