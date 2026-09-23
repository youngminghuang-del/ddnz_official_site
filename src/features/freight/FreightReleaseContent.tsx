import type { Language } from '../../i18n/translations';
import SeaFreightContent, { seaFreightMetadata } from './SeaFreightContent';
import SeaInternationalContent, { internationalSeaMetadata } from './SeaInternationalContent';
import LclContent, { lclMetadata } from './LclContent';
import LclInternationalContent, { internationalLclMetadata } from './LclInternationalContent';
import { DangerousGoodsOriginalContent, copy } from './DangerousGoodsOriginalContent';
import DgInternationalContent, { internationalDgMetadata } from './DgInternationalContent';
import type { LclExtraLocale } from './lclInternationalCopy';
import ModernFreightServiceContent, {
  modernFreightServiceMetadata,
  modernizedFreightServicePaths,
  type ModernFreightServicePath,
} from './ModernFreightServiceContent';

export const freightReleasePaths = ['services/sea-freight', 'services/lcl-shipping-from-china', 'services/dangerous-goods-shipping-from-china'];
export { modernizedFreightServicePaths };
export function freightReleaseMetadata(path: string, language: Language) {
  if (modernizedFreightServicePaths.includes(path as ModernFreightServicePath)) {
    return modernFreightServiceMetadata(path as ModernFreightServicePath, language);
  }
  const original = language === 'en' || language === 'zh' || language === 'es';
  if(path === freightReleasePaths[0]) return original ? seaFreightMetadata(language) : internationalSeaMetadata(language as LclExtraLocale);
  if(path === freightReleasePaths[1]) return original ? lclMetadata(language) : internationalLclMetadata(language as LclExtraLocale);
  if(!original) return internationalDgMetadata(language as LclExtraLocale);
  return { title: `${copy[language].title} | DDNZ Global`, desc: copy[language].intro };
}
export default function FreightReleaseContent({path, language}: {path: string; language: Language}) {
  if (modernizedFreightServicePaths.includes(path as ModernFreightServicePath)) {
    return <ModernFreightServiceContent path={path as ModernFreightServicePath} language={language}/>;
  }
  const original = language === 'en' || language === 'zh' || language === 'es';
  if(path === freightReleasePaths[0]) return original ? <SeaFreightContent locale={language}/> : <SeaInternationalContent locale={language as LclExtraLocale}/>;
  if(path === freightReleasePaths[1]) return original ? <LclContent locale={language}/> : <LclInternationalContent locale={language as LclExtraLocale}/>;
  return original ? <DangerousGoodsOriginalContent lang={language}/> : <DgInternationalContent locale={language as LclExtraLocale}/>;
}
