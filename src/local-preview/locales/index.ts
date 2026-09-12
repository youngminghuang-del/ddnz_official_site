import type { Language } from '../../i18n/translations';
import en from './en.json';
import zh from './zh.json';
import ru from './ru.json';
import fr from './fr.json';
import es from './es.json';
import ar from './ar.json';
import pt from './pt.json';
import tr from './tr.json';

export const localPreviewCopy: Record<Language, typeof en> = { en, zh, ru, fr, es, ar, pt, tr };
