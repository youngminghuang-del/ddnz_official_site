import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import SEO from '../../components/SEO';
import Footer from '../../components/Footer';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import {MerchandisingContent, merchandisingMetadata, type MerchandisingLocale} from './MerchandisingContent';
import {merchandisingPages} from './merchandisingModels.mjs';
import {localizedProductPath, productAlternates, productRouteParts} from '../../lib/productLocalization.mjs';

export default function MerchandisingPage() {
  const { pathname, hash } = useLocation();
  const route = productRouteParts(pathname);
  const locale = route.locale as MerchandisingLocale;
  const path = route.path as keyof typeof merchandisingPages;
  const meta = merchandisingMetadata(path, locale);
  const canonical = localizedProductPath(path, locale);
  const quotePath = canonical + '#order-checks';

  useEffect(() => {
    if (!hash) return;
    const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [hash, pathname]);

  return <>
    <SEO title={meta.title} description={meta.description} canonicalPath={canonical} image={meta.image}
      contentLanguage={locale} alternateUrls={productAlternates(path)} />
    <SourcingHomepageNav quotePath={quotePath} />
    <MerchandisingContent path={path} locale={locale} />
    <Footer description={meta.description} quotePath={quotePath} />
  </>;
}
