import type { Language } from '../i18n/translations';
import { kitchenCategoryPaths, kitchenPackagePath } from '../features/commercial-kitchen/routes.mjs';

const labels: Record<Language, string[]> = {
  en: ['Restaurant kitchen packages', 'Ice machines', 'Electric fryers', 'Electric griddles'],
  zh: ['餐厅厨房整套方案', '商用制冰机', '电炸炉', '电扒炉'],
  ar: ['باقات مطابخ المطاعم', 'آلات صنع الثلج', 'قلايات كهربائية', 'صاجات كهربائية'],
  es: ['Paquetes de cocina para restaurantes', 'Máquinas de hielo', 'Freidoras eléctricas', 'Planchas eléctricas'],
  fr: ['Packs cuisine pour restaurants', 'Machines à glaçons', 'Friteuses électriques', 'Planchas électriques'],
  ru: ['Комплекты кухонь для ресторанов', 'Льдогенераторы', 'Электрические фритюрницы', 'Электрические жарочные поверхности'],
  pt: ['Pacotes de cozinha para restaurantes', 'Máquinas de gelo', 'Fritadeiras elétricas', 'Chapas elétricas'],
  tr: ['Restoran mutfak paketleri', 'Buz makineleri', 'Elektrikli fritözler', 'Elektrikli ızgaralar'],
};
export function kitchenCategoryNavigation(language: Language) {
  return [kitchenPackagePath, ...kitchenCategoryPaths].map((to: string, index: number) => ({ to, label: labels[language][index] }));
}
