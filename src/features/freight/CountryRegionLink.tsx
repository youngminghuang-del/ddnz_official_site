import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { regions, type RegionId } from './regions';
import { navigationPath } from '../../lib/productLanguageRouting';

const copy = {
  en: { aria: 'Region overview', prefix: 'All', suffix: 'country routes' },
  zh: { aria: '返回地区总览', prefix: '查看', suffix: '全部国家线路' },
  ru: { aria: 'Обзор региона', prefix: 'Все маршруты по региону', suffix: '' },
  fr: { aria: 'Vue d’ensemble de la région', prefix: 'Toutes les liaisons vers', suffix: '' },
  es: { aria: 'Resumen regional', prefix: 'Ver todas las rutas de', suffix: '' },
  ar: { aria: 'نظرة عامة على المنطقة', prefix: 'كل مسارات', suffix: '' },
  pt: { aria: 'Visão geral da região', prefix: 'Todas as rotas para', suffix: '' },
  tr: { aria: 'Bölge genel görünümü', prefix: 'Tüm', suffix: 'ülke rotaları' },
} as const;

const regionNames = {
  en: { 'middle-east': 'Middle East', 'west-africa': 'West Africa', 'latin-america': 'Latin America' },
  zh: { 'middle-east': '中东', 'west-africa': '西非', 'latin-america': '拉美' },
  ru: { 'middle-east': 'Ближнего Востока', 'west-africa': 'Западной Африки', 'latin-america': 'Латинской Америки' },
  fr: { 'middle-east': 'le Moyen-Orient', 'west-africa': 'l’Afrique de l’Ouest', 'latin-america': 'l’Amérique latine' },
  es: { 'middle-east': 'Oriente Medio', 'west-africa': 'África Occidental', 'latin-america': 'Latinoamérica' },
  ar: { 'middle-east': 'الشرق الأوسط', 'west-africa': 'غرب أفريقيا', 'latin-america': 'أمريكا اللاتينية' },
  pt: { 'middle-east': 'o Oriente Médio', 'west-africa': 'a África Ocidental', 'latin-america': 'a América Latina' },
  tr: { 'middle-east': 'Orta Doğu', 'west-africa': 'Batı Afrika', 'latin-america': 'Latin Amerika' },
} as const;

export default function CountryRegionLink({ region }: { region: RegionId }) {
  const { language } = useLanguage();
  const label = copy[language];
  const regionName = regionNames[language][region] || regions[region].name.en;
  return <nav aria-label={label.aria} className="border-b border-slate-200 bg-[#fffdf9] text-[#10243f]"><div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"><Link className="text-sm font-semibold underline underline-offset-4" to={navigationPath(`/shipping-from-china-to-${region}`, language)}>{language === 'ar' ? '→' : '←'} {`${label.prefix} ${regionName} ${label.suffix}`.trim()}</Link></div></nav>;
}
