import React from 'react';
import {useLocation,Navigate} from 'react-router-dom';
import SEO from '../../components/SEO';import Footer from '../../components/Footer';import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import {productRouteParts,productAlternates} from '../../lib/productLocalization.mjs';
import {categoryIndex,audioCategoryMeta,audioCategoryPaths,audioCategorySchema,type CategoryLanguage} from './categories';
import AudioCategoryContent from './AudioCategoryContent';
export default function AudioCategoryPage(){const {pathname}=useLocation(),index=categoryIndex(pathname),locale=productRouteParts(pathname).locale as CategoryLanguage;if(index<0)return <Navigate to="/sourcing/audio-speakers-from-china/" replace/>;const meta=audioCategoryMeta(index,locale);return <><SEO title={meta.title} description={meta.description} canonicalPath={meta.path} contentLanguage={locale} alternateUrls={productAlternates(audioCategoryPaths[index])}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(audioCategorySchema(index,locale)).replace(/</g,'\\u003c')}}/><SourcingHomepageNav quotePath={`${meta.path}#order-packages`}/><AudioCategoryContent index={index} locale={locale}/><Footer description={meta.description} quotePath={`${meta.path}#order-packages`}/></>;}
