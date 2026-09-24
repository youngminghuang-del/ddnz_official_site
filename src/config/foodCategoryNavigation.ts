import type { Language } from '../i18n/translations';

export const foodNavigationLabels: Record<Language, string> = {
  "en": "Food processing machinery",
  "zh": "食品加工机械",
  "es": "Maquinaria alimentaria",
  "ar": "آلات تجهيز الأغذية",
  "ru": "Пищевое оборудование",
  "fr": "Machines agroalimentaires",
  "pt": "Máquinas de processamento de alimentos",
  "tr": "Gıda işleme makineleri"
};
const paths = [
  "/sourcing/food-processing-machinery-from-china/dough-and-bakery-machinery",
  "/sourcing/food-processing-machinery-from-china/meat-processing-machinery",
  "/sourcing/food-processing-machinery-from-china/vegetable-processing-machinery",
  "/sourcing/food-processing-machinery-from-china/bean-rice-and-juice-machinery",
  "/sourcing/food-processing-machinery-from-china/#packages"
];
const labels: Record<Language, string[]> = {
  "en": [
    "Dough & bakery machinery",
    "Meat processing machinery",
    "Vegetable processing machinery",
    "Bean, rice & juice machinery",
    "Equipment packages"
  ],
  "zh": [
    "面团与烘焙机械",
    "肉类加工机械",
    "蔬菜加工机械",
    "豆米与榨汁机械",
    "场景设备组合"
  ],
  "es": [
    "Maquinaria para masas y panadería",
    "Maquinaria para procesar carne",
    "Maquinaria para preparar verduras",
    "Maquinaria para soja, arroz y jugos",
    "Conjuntos de equipos"
  ],
  "ar": [
    "آلات العجين والمخبوزات",
    "آلات تجهيز اللحوم",
    "آلات تجهيز الخضروات",
    "آلات الصويا والأرز والعصائر",
    "مجموعات المعدات"
  ],
  "ru": [
    "Оборудование для теста и выпечки",
    "Оборудование для переработки мяса",
    "Оборудование для подготовки овощей",
    "Оборудование для сои, риса и сока",
    "Комплекты оборудования"
  ],
  "fr": [
    "Machines pour pâtes et boulangerie",
    "Machines de préparation de viande",
    "Machines de préparation de légumes",
    "Machines pour soja, riz et jus",
    "Ensembles de machines"
  ],
  "pt": [
    "Máquinas para massas e panificação",
    "Máquinas para processamento de carnes",
    "Máquinas para preparação de vegetais",
    "Máquinas para soja, arroz e sucos",
    "Combinações de equipamentos"
  ],
  "tr": [
    "Hamur ve fırıncılık makineleri",
    "Et işleme makineleri",
    "Sebze hazırlama makineleri",
    "Soya, pirinç ve meyve suyu makineleri",
    "Ekipman paketleri"
  ]
};
export const foodCategoryNavigation = (language: Language) => paths.map((to, i) => ({ to, label: labels[language][i] }));
