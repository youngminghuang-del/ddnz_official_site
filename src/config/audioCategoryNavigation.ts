import type { Language } from '../i18n/translations';
import { audioCategoryPaths } from '../features/audio/category-routes.mjs';

const labels: Record<Language, string[]> = {
  "en": [
    "Headphones & earbuds",
    "Desktop & PC speakers",
    "Portable & outdoor speakers",
    "Party & karaoke speakers",
    "Home Hi-Fi & bookshelf speakers"
  ],
  "zh": [
    "耳机与耳塞",
    "桌面与电脑音箱",
    "便携与户外音箱",
    "派对与卡拉 OK 音箱",
    "家用 Hi-Fi 与书架音箱"
  ],
  "es": [
    "Auriculares y audífonos",
    "Altavoces de escritorio y PC",
    "Altavoces portátiles y exteriores",
    "Altavoces de fiesta y karaoke",
    "Hi-Fi y altavoces de estantería"
  ],
  "ar": [
    "سماعات الرأس والأذن",
    "سماعات المكتب والكمبيوتر",
    "سماعات محمولة وخارجية",
    "سماعات الحفلات والكاريوكي",
    "صوت منزلي Hi-Fi وسماعات رفوف"
  ],
  "ru": [
    "Наушники и TWS",
    "Настольные и компьютерные колонки",
    "Портативные и уличные колонки",
    "Колонки для вечеринок и караоке",
    "Домашний Hi-Fi и полочные колонки"
  ],
  "fr": [
    "Casques et écouteurs",
    "Enceintes de bureau et PC",
    "Enceintes portables et extérieures",
    "Enceintes de fête et karaoké",
    "Hi-Fi et enceintes bibliothèque"
  ],
  "pt": [
    "Fones e earbuds",
    "Caixas de som para PC e mesa",
    "Caixas portáteis e externas",
    "Caixas de festa e karaokê",
    "Hi-Fi e caixas bookshelf"
  ],
  "tr": [
    "Kulaklıklar ve TWS",
    "Masaüstü ve PC hoparlörleri",
    "Taşınabilir ve dış mekân hoparlörleri",
    "Parti ve karaoke hoparlörleri",
    "Ev Hi-Fi ve raf hoparlörleri"
  ]
};

export const audioCategoryNavigation = (language: Language) =>
  audioCategoryPaths.map((to, index) => ({ to, label: labels[language][index] }));
