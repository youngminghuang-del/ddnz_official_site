import type { Language } from '../i18n/translations';
import { outdoorPath, powerGuidePath } from '../lib/productLocalization.mjs';
import { outdoorCategoryHref } from '../features/outdoor-sourcing/navigation.mjs';

const copy: Record<Language, string[]> = {
  en: ['Outdoor products', 'Portable power stations', 'Folding solar panels', 'Vehicle refrigerators', 'Power selection guide'],
  zh: ['户外用品', '便携电源', '折叠太阳能板', '车载冰箱', '电源选型指南'],
  es: ['Productos para exterior', 'Estaciones de energía portátiles', 'Paneles solares plegables', 'Neveras para vehículos', 'Guía de selección de energía'],
  ar: ['مستلزمات خارجية', 'محطات الطاقة المحمولة', 'ألواح شمسية قابلة للطي', 'ثلاجات المركبات', 'دليل اختيار محطة الطاقة'],
  fr: ['Produits de plein air', 'Stations d’énergie portables', 'Panneaux solaires pliables', 'Réfrigérateurs pour véhicules', 'Guide de choix d’une station d’énergie'],
  ru: ['Товары для отдыха на природе', 'Портативные электростанции', 'Складные солнечные панели', 'Автомобильные холодильники', 'Выбор портативной электростанции'],
  pt: ['Produtos para atividades ao ar livre', 'Estações de energia portáteis', 'Painéis solares dobráveis', 'Refrigeradores para veículos', 'Guia de escolha de energia portátil'],
  tr: ['Açık hava ürünleri', 'Taşınabilir güç istasyonları', 'Katlanır güneş panelleri', 'Araç buzdolapları', 'Güç istasyonu seçim rehberi'],
};
export const outdoorOverviewNavigation = (language: Language) => ({ to: outdoorPath, label: copy[language][0] });
export const outdoorCategoryNavigation = (language: Language) => [
  ...['power', 'solar', 'cold'].map(outdoorCategoryHref), powerGuidePath,
].map((to, i) => ({ to, label: copy[language][i + 1] }));
