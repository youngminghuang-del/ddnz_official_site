import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import Footer from '../../components/Footer';
import LegalModal, { LegalType } from '../../components/LegalModal';
import SEO from '../../components/SEO';
import { trackEvent } from '../../lib/analytics';
import { useLanguage } from '../../contexts/LanguageContext';
import { navigationPath } from '../../lib/productLanguageRouting';
import KitchenCategoryContent from './KitchenCategoryContent.jsx';
import { kitchenCategories, kitchenCategorySchema, kitchenModelHref, categoryProducts } from './data/categories.mjs';
import { kitchenCategoryAnalytics } from './site-analytics.mjs';
import './styles/kitchen.css';
import './styles/category.css';

export default function KitchenCategoryPage() {
  const { language } = useLanguage();
  const location = useLocation();
  const category = kitchenCategories.find(item => item.path === `${location.pathname.replace(/\/+$/, '')}/`)!;
  const [legalType, setLegalType] = useState<LegalType>(null);
  useEffect(() => {
    document.getElementById('schema-jsonld-static-page')?.remove();
    const schema = document.createElement('script');
    schema.id = 'schema-jsonld-kitchen-category';
    schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify(kitchenCategorySchema(category));
    document.head.appendChild(schema);
    return () => schema.remove();
  }, [category]);
  const quotePath = kitchenModelHref(category.heroId);
  return <>
    <SEO title={category.title} description={category.description} canonicalPath={category.path} contentLanguage="en"
      image={categoryProducts(category).find(item => item.id === category.heroId)!.image}
      alternateUrls={[{ hrefLang: 'en', href: `https://www.ddnzglobal.com${category.path}` }]} />
    <SourcingHomepageNav quotePath={quotePath}/>
    <KitchenCategoryContent category={category} homeHref={navigationPath('/', language)} onTrack={(action: string) => {
      const payload = kitchenCategoryAnalytics(category.id, action);
      if (payload) trackEvent(payload.event, payload.params);
    }}/>
    <Footer quotePath={quotePath} pageKey={`kitchen_${category.id}`} description={category.description}
      pageLinks={kitchenCategories.map(item => ({ href: item.path, label: item.label }))}/>
    <LegalModal type={legalType} onClose={() => setLegalType(null)}/>
  </>;
}
