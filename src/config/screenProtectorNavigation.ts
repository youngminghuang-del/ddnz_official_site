import type { Language } from '../i18n/translations';
import { ROUTES } from '../features/screen-protectors/routes.mjs';
import { canonicalSitePath } from '../lib/notionArticleRouting';
import en from './screen-protector-navigation/en.json';
import zh from './screen-protector-navigation/zh.json';
import ru from './screen-protector-navigation/ru.json';
import fr from './screen-protector-navigation/fr.json';
import es from './screen-protector-navigation/es.json';
import ar from './screen-protector-navigation/ar.json';
import pt from './screen-protector-navigation/pt.json';
import tr from './screen-protector-navigation/tr.json';

const labels: Record<Language, typeof en> = { en, zh, ru, fr, es, ar, pt, tr };

export function screenProtectorNavigation(language: Language) {
  return { ...labels[language], to: canonicalSitePath(ROUTES.home) };
}
