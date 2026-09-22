import { useLanguage } from '../contexts/LanguageContext';
import { useLocation, Navigate } from 'react-router-dom';
import SourcingHomepageNav from '../components/SourcingHomepageNav';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import SEO from '../components/SEO';
import RegionContent from '../features/freight/RegionContent';
import { regions, freightPrefix, regionMetadata, type RegionId } from '../features/freight/regions';
import '../features/freight/freight.css';

export default function FreightRegionPage() {
  const { language } = useLanguage();
  const { pathname, search } = useLocation();
  const locale = language === 'zh' || language === 'es' ? language : 'en';
  const region = pathname.split('/').filter(Boolean).at(-1)!.replace('shipping-from-china-to-', '') as RegionId;
  const meta = regionMetadata(region, locale);
  const params = new URLSearchParams(search);
  const legacyCountry = (params.get('country') || params.get('dest') || '').toLowerCase();
  if (regions[region].countries.some(country => country.slug === legacyCountry)) {
    params.delete('country');
    params.delete('dest');
    return <Navigate replace to={`${freightPrefix(locale)}/shipping-from-china-to-${legacyCountry}/${params.size ? `?${params}` : ''}`} />;
  }
  return <div className="ddnz-home freight-editorial"><SEO title={meta.title} description={meta.desc} /><SourcingHomepageNav showFreightExecutor /><RegionContent region={region} locale={locale} />{import.meta.env.DEV && <section className="freight-wrap pb-12"><div className="freight-placeholder"><p className="freight-kicker">{locale === 'zh' ? '素材位 · 仅本地预览可见' : locale === 'es' ? 'Espacio de material · solo vista previa' : 'Media slot · local preview only'}</p><h3 className="mt-3">{locale === 'zh' ? '目的港提货 / 末端交付记录' : locale === 'es' ? 'Retiro en destino / entrega final' : 'Destination collection / final delivery'}</h3><p className="mt-3 text-slate-600">{locale === 'zh' ? '待补：注明国家、港口、日期与负责环节的照片或视频，以及可脱敏的交接记录。现有中国端装柜素材不替代这一环节。' : locale === 'es' ? 'Pendiente: fotos o video con país, puerto, fecha y alcance del servicio. La carga en China no sustituye el registro de entrega.' : 'Awaiting photos or video with country, port, date and service scope. Origin loading does not replace a delivery record.'}</p></div></section>}<Footer /><WhatsAppFloat /></div>;
}
