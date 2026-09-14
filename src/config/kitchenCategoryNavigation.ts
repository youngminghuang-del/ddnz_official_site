import type { Language } from '../i18n/translations';
import { kitchenCategoryPaths } from '../features/commercial-kitchen/routes.mjs';

const labels: Record<Language, string[]> = {
  en: ['Ice machines', 'Electric fryers', 'Electric griddles'],
  zh: ['商用制冰机', '电炸炉', '电扒炉'],
  ar: ['آلات صنع الثلج', 'قلايات كهربائية', 'صاجات كهربائية'],
  es: ['Máquinas de hielo', 'Freidoras eléctricas', 'Planchas eléctricas'],
  fr: ['Machines à glaçons', 'Friteuses électriques', 'Planchas électriques'],
  ru: ['Льдогенераторы', 'Электрические фритюрницы', 'Электрические жарочные поверхности'],
  pt: ['Máquinas de gelo', 'Fritadeiras elétricas', 'Chapas elétricas'],
  tr: ['Buz makineleri', 'Elektrikli fritözler', 'Elektrikli ızgaralar'],
};
export function kitchenCategoryNavigation(language: Language) {
  return kitchenCategoryPaths.map((to: string, index: number) => ({ to, label: labels[language][index] }));
}
