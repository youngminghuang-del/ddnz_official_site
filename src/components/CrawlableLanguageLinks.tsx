import { useLocation } from 'react-router-dom';
import { navigationPath, splitNavigationPath, supportedNavigationLanguages } from '../lib/productLanguageRouting';
const labels = {en:'English',zh:'中文',es:'Español',ar:'العربية',ru:'Русский',fr:'Français',pt:'Português',tr:'Türkçe'};
export default function CrawlableLanguageLinks() {
 const {pathname}=useLocation();
 const suffix=splitNavigationPath(pathname).pathname.replace(/^\/id(?=\/blog\/)/, "");
 const destination=suffix.startsWith('/blog/')?'/insights':suffix;
 return <nav data-crawlable-languages="true" aria-label="Languages" className="flex flex-wrap justify-center gap-x-5 gap-y-3 px-6 py-5 text-sm">
  {supportedNavigationLanguages(destination).map(language=><a key={language} href={navigationPath(destination,language)} lang={language==='zh'?'zh-CN':language} className="underline underline-offset-4">{labels[language]}</a>)}
 </nav>;
}
