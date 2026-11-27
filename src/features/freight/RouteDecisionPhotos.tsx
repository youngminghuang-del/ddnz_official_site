import type { Language } from '../../i18n/translations';
import { FreightPhotoStory } from './FreightPhotoStory';
import labels from './routePhotoCopy.json';
import stories from './regionalPhotoStories.json';
import photoCopy from './regionalPhotoCopy.json';

export default function RouteDecisionPhotos({
  country, locale, standalone = false,
}: { country: string; locale: string; standalone?: boolean }) {
  const gallery = stories[country as keyof typeof stories];
  if (!gallery || !Object.hasOwn(photoCopy, locale)) return null;

  const language = locale as Language;
  const { credit, adjustment } = labels[language];
  const photos = <FreightPhotoStory entries={gallery.entries} copy={{
    credit, adjustment, photos: photoCopy[language],
  }}/>;

  return standalone
    ? <div className="route-depth-inner" lang={language === 'zh' ? 'zh-CN' : language} dir={language === 'ar' ? 'rtl' : 'ltr'}>{photos}</div>
    : photos;
}
