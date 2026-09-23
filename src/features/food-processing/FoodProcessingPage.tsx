import type { Language } from '../../i18n/translations';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import FoodProcessingContent from './FoodProcessingContent.jsx';
import { foodPage, foodPageMeta, foodPageSchema } from './pages.mjs';
import './food-processing.css';
import { productRouteParts } from '../../lib/productLocalization.mjs';
import { foodAlternates, foodPrefix, localizedFoodPage, localizedFoodMeta, localizedFoodSchema, foodLocales, type FoodLocale } from './localization';
import LocalizedFoodContent from './LocalizedFoodContent';

export default function FoodProcessingPage() {
  const { pathname } = useLocation();
  useEffect(() => { document.getElementById('schema-jsonld-static-page')?.remove(); }, []);
  const parts = productRouteParts(pathname);
  const locale = parts.locale as FoodLocale;
  const translated = parts.locale !== 'en';
  const page = translated ? localizedFoodPage(parts.path, locale) : foodPage(parts.path);
  if (!page) return null;
  const meta = translated ? localizedFoodMeta(page,locale) : foodPageMeta(page);
  const prefix = foodPrefix(parts.locale);
  return <>
    <SEO title={meta.title} description={meta.description} contentLanguage={parts.locale as Language} canonicalPath={`${prefix}${page.path}/`}
      alternateUrls={foodAlternates(page.path)} image={meta.image}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(translated ? localizedFoodSchema(page,locale) : foodPageSchema(page)).replace(/</g, '\\u003c') }}/>
    <SourcingHomepageNav quotePath={`${prefix}${page.path}/#your-list`}/>
    {translated ? <LocalizedFoodContent key={`${locale}${page.path}`} page={page} locale={locale}/> : <FoodProcessingContent key={page.path} page={page}/>}
    {translated ? <Footer quotePath={`${prefix}${page.path}/#your-list`} pageKey="food_processing" description={foodLocales[locale].ui.intro}/> : <Footer quotePath={`${page.path}/#your-list`} pageKey="food_processing" description="Food processing machinery, equipment packages and sourcing support from China."
      pageLinks={[{ href: `${page.path}/#equipment`, label: 'Equipment catalogue' }, { href: `${page.path}/#your-list`, label: 'Your equipment list' }]}/>}
  </>;
}
