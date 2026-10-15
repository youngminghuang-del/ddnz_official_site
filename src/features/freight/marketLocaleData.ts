import zh from './market-locales/zh.json';
import es from './market-locales/es.json';
import fr from './market-locales/fr.json';
import pt from './market-locales/pt.json';
import tr from './market-locales/tr.json';
import ru from './market-locales/ru.json';
import ar from './market-locales/ar.json';
export const marketLocaleData={zh,es,fr,pt,tr,ru,ar};
export type MarketTranslatedLocale=keyof typeof marketLocaleData;
