import { useLanguage } from '../../contexts/LanguageContext';
import { useLocation, Link } from 'react-router-dom';
import { regions, type RegionId } from './regions';
export default function CountryRegionLink({ region }: { region: RegionId }) {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const prefix = pathname.match(/^\/(zh-cn|es|ar|ru|fr|pt|tr)(?=\/)/)?.[0] || '';
  const locale = language === 'zh' || language === 'es' ? language : 'en';
  return <nav aria-label={locale === 'zh' ? '返回地区总览' : 'Region overview'} className="border-b border-slate-200 bg-[#fffdf9] text-[#10243f]"><div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"><Link className="text-sm font-semibold underline underline-offset-4" to={`${prefix}/shipping-from-china-to-${region}/`}>← {locale === 'zh' ? `查看${regions[region].name.zh}全部国家线路` : locale === 'es' ? `Ver todas las rutas de ${regions[region].name.es}` : `All ${regions[region].name.en} country routes`}</Link></div></nav>;
}
